/// <reference types="node" />
// Which directory the cockpit reads, for `afc migrate`. A rollback is only safe when, afterwards, the cockpit's
// own rule (server/paths.ts chooseDataDir) lands on the legacy directory again; finishing is only safe while it
// reads the data directory. The one outside change the command makes itself is the design's own cutover step:
// the legacy path as a symbolic link to the data directory is pointed back at the legacy directory.
import { randomBytes } from "node:crypto";
import { existsSync, realpathSync } from "node:fs";
import { lstat, readlink, rename, rm, symlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { PLUGIN_IDS } from "../shared/contract/schema";
import { MARKER_FILES, type MigrationRecord } from "../shared/migration";
import { type Env, pluginDataDir } from "./contract";
import { errorCode, MigrationError } from "./migrate-files";
import { chooseDataDir, legacyStateDir } from "./paths";

/** Real path, or the path itself when it does not exist (yet). */
export function realOrSelf(path: string): string {
  try {
    return realpathSync(path);
  } catch {
    return path;
  }
}

/** The directory the cockpit picks right now, from the files on disk (not the per-process memo). */
export function cockpitReadsDir(env: Env, home: string): string {
  return realOrSelf(chooseDataDir(env, home).dir);
}

const hasMarker = (dir: string): boolean => MARKER_FILES.some((name) => existsSync(join(dir, name)));

export interface LinkPlan {
  path: string;
  target: string;
}

/**
 * Before a rollback moves anything: refuse what the command cannot put right, and plan re-pointing the legacy
 * link when the cutover pointed it at the data directory. Throws MigrationError with the steps to take.
 */
export async function planRollbackReadPath(record: MigrationRecord, env: Env, home: string): Promise<LinkPlan | null> {
  const retry = `then run \`afc migrate --rollback ${record.id} --to ${record.to}\` again. Nothing was changed.`;
  const override = env.AFC_DATA_DIR?.trim();
  if (override) {
    const dir = realOrSelf(pluginDataDir(PLUGIN_IDS.cockpit, env, home));
    if (dir !== record.from) {
      throw new MigrationError(`AFC_DATA_DIR is set (${override}), so the cockpit would keep reading ${dir} after the rollback. Remove AFC_DATA_DIR from the environment Paseo runs with and from this shell, restart Paseo, ${retry}`);
    }
    return null;
  }
  const firstChoice = realOrSelf(pluginDataDir(PLUGIN_IDS.cockpit, env, home));
  if (firstChoice !== record.to && hasMarker(firstChoice)) {
    throw new MigrationError(`the cockpit reads ${firstChoice} first and it holds cockpit state of its own, so it would not fall back to ${record.from}. Move that state away, ${retry}`);
  }
  const legacyPath = legacyStateDir(home);
  let isLink = false;
  try {
    isLink = (await lstat(legacyPath)).isSymbolicLink();
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    throw new MigrationError(`the cockpit only falls back to ${legacyPath}, which does not exist. Create it as a link to the legacy directory (ln -s ${record.from} ${legacyPath}), ${retry}`);
  }
  const resolved = realOrSelf(legacyPath);
  if (resolved === record.from) return null;
  if (isLink && resolved === record.to) return { path: legacyPath, target: record.from };
  throw new MigrationError(`the cockpit falls back to ${legacyPath}, which leads to ${resolved}, not ${record.from}. Point it at ${record.from} (or set AFC_DATA_DIR=${record.from} where Paseo runs), ${retry}`);
}

export interface LinkChange {
  path: string;
  before: string;
  after: string;
}

/** Point a symbolic link at `target`, replacing it in one rename. Returns what to undo. */
export async function repointLink(path: string, target: string): Promise<LinkChange> {
  const before = await readlink(path);
  const temp = join(dirname(path), `.${randomBytes(6).toString("hex")}.migrate-link`);
  await symlink(target, temp);
  try {
    await rename(temp, path);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
  return { path, before, after: target };
}

export async function undoLink(change: LinkChange): Promise<void> {
  await repointLink(change.path, change.before);
}

/** Problems that make deleting the legacy files unsafe: the data directory is not what the cockpit reads. */
export function finishReadPathProblem(record: MigrationRecord, env: Env, home: string): string | null {
  const reads = cockpitReadsDir(env, home);
  return reads === record.to ? null : `the cockpit reads ${reads}, not the data directory ${record.to}`;
}
