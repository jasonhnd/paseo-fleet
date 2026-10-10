/// <reference types="node" />
// Steps every `afc migrate` mode shares: the lock, pausing the plugin, reading and saving MIGRATION.json.
import { randomBytes } from "node:crypto";
import { open, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { PLUGIN_IDS } from "../shared/contract/schema";
import { decisionItems, MIGRATION_FILE, type MigrationRecord, MigrationRecord as MigrationRecordSchema, parseMigrationRecord } from "../shared/migration";
import type { Env } from "./contract";
import { ensureDir, errorCode, MigrationError, readJsonFile, under } from "./migrate-files";

/** Pauses the plugin in Paseo while files move, so it does not write half way through. */
export interface PluginGate {
  pause(): Promise<{ paused: boolean; note: string }>;
  resume(): Promise<void>;
  /** After a resume: the directory the restarted plugin says it reads, or null when that cannot be seen. */
  readsAfterResume?(since: Date): Promise<string | null>;
}

export const NO_PAUSE: PluginGate = {
  pause: async () => ({ paused: false, note: "plugin not paused (--no-pause)" }),
  resume: async () => undefined,
};

export interface MigrateDeps {
  now: () => Date;
  gate: PluginGate;
  /** The environment and home the cockpit resolves its data directory from (server/paths.ts). */
  env: Env;
  home: string;
}

const LOCK_FILE = ".migrate.lock";
const LIST_LIMIT = 10;

export const message = (error: unknown): string => (error instanceof Error ? error.message : String(error));

export const listed = (items: readonly string[]): string => {
  const head = items.slice(0, LIST_LIMIT).join(", ");
  return items.length > LIST_LIMIT ? `${head} and ${items.length - LIST_LIMIT} more` : head;
};

/** Absolute path with symbolic links resolved as far as the path exists. */
export async function canonical(path: string): Promise<string> {
  const absolute = resolve(path);
  try {
    return await realpath(absolute);
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    const parent = dirname(absolute);
    return parent === absolute ? absolute : join(await canonical(parent), relative(parent, absolute));
  }
}

export async function withLock<T>(to: string, work: () => Promise<T>): Promise<T> {
  await ensureDir(to);
  const lock = join(to, LOCK_FILE);
  let handle;
  try {
    handle = await open(lock, "wx");
  } catch (error) {
    if (errorCode(error) === "EEXIST") throw new MigrationError(`another migration step is running (${lock} exists); if none is, delete that file and try again`);
    throw error;
  }
  try {
    await handle.writeFile(`${process.pid} ${new Date().toISOString()}\n`);
    await handle.close();
    return await work();
  } finally {
    await rm(lock, { force: true });
  }
}

export interface Paused<T> {
  value: T;
  notes: string[];
  /** When the plugin was resumed (wall clock, to match plugin logs); null when it was never paused. */
  resumedAt: Date | null;
}

/** Run `work` with the plugin paused; the plugin is resumed afterwards whether `work` succeeded or not. */
export async function withPausedPlugin<T>(gate: PluginGate, work: () => Promise<T>): Promise<Paused<T>> {
  const pause = await gate.pause();
  let value: T;
  try {
    value = await work();
  } catch (error) {
    if (pause.paused) {
      try {
        await gate.resume();
      } catch (resumeError) {
        throw new MigrationError(`${message(error)}\nAlso, the plugin could not be resumed: ${message(resumeError).slice(0, 200)}; run \`paseo plugin enable ${PLUGIN_IDS.cockpit}\``);
      }
    }
    throw error;
  }
  const notes = [pause.note];
  if (!pause.paused) return { value, notes, resumedAt: null };
  const resumedAt = new Date();
  try {
    await gate.resume();
    notes.push("plugin resumed");
    return { value, notes, resumedAt };
  } catch (error) {
    notes.push(`the plugin could not be resumed: ${message(error).slice(0, 200)}; run \`paseo plugin enable ${PLUGIN_IDS.cockpit}\``);
    return { value, notes, resumedAt: null };
  }
}

export async function readRecordIfAny(to: string): Promise<{ record: MigrationRecord | null; problem: string | null }> {
  const path = join(to, MIGRATION_FILE);
  let text: string;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    if (errorCode(error) === "ENOENT") return { record: null, problem: null };
    throw error;
  }
  const parsed = parseMigrationRecord(text);
  return parsed.ok ? { record: parsed.record, problem: null } : { record: null, problem: `${path} is invalid (${parsed.reason})` };
}

async function writeRecord(dir: string, record: MigrationRecord): Promise<void> {
  const checked = MigrationRecordSchema.parse(record);
  await ensureDir(dir);
  const file = join(dir, MIGRATION_FILE);
  const temp = `${file}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(checked, null, 2)}\n`, "utf8");
    await rename(temp, file);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}

/** Write the record into the data directory and, as history, next to the migration's backup. */
export async function saveRecord(record: MigrationRecord): Promise<void> {
  await writeRecord(under(record.to, record.backupDir), record);
  await writeRecord(record.to, record);
}

export async function loadRecord(to: string, id: string, action: string): Promise<MigrationRecord> {
  const dir = await canonical(to);
  const { record, problem } = await readRecordIfAny(dir);
  if (problem) throw new MigrationError(problem);
  if (!record) throw new MigrationError(`no migration recorded in ${dir} (${MIGRATION_FILE} is missing)`);
  if (record.id !== id) throw new MigrationError(`${MIGRATION_FILE} in ${dir} is for migration ${record.id}, not ${id}`);
  if (record.status !== "migrated") throw new MigrationError(`cannot ${action} migration ${id}: it is already ${record.status}`);
  return record;
}

export async function decisionCount(path: string): Promise<number | null> {
  return decisionItems(await readJsonFile(path))?.length ?? null;
}
