/// <reference types="node" />
// `afc migrate` on the command line: arguments, pausing the plugin through the `paseo` CLI, and the report.
// The work itself is in server/migrate.ts.
import { execFile } from "node:child_process";
import { realpathSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, join, resolve } from "node:path";
import { PLUGIN_IDS } from "../shared/contract/schema";
import { isMigrationId, OBSERVATION_DAYS } from "../shared/migration";
import { type Env, paseoHome, pluginDataDir } from "./contract";
import { finishMigration, type FinishResult, migrate, type MigrateResult, MigrationError, type MigrationPlan, NO_PAUSE, planMigration, type PluginGate, rollbackMigration, type RollbackResult } from "./migrate";
import { legacyStateDir, parseDataDirLog } from "./paths";

export const USAGE = `usage:
  afc migrate --from <legacy dir> [--to <data dir>] [--dry-run] [--no-pause]
  afc migrate --rollback <id> [--to <data dir>] [--no-pause]
  afc migrate --finish <id> [--to <data dir>]

  --from       the directory the cockpit used so far; it is copied, and left untouched until --finish
  --to         the data directory (default: AFC_DATA_DIR, else $PASEO_HOME/plugin-data/${PLUGIN_IDS.cockpit})
  --dry-run    list what would be copied and anything in the way; change nothing
  --rollback   undo migration <id>; the cockpit goes back to the legacy directory. A legacy link pointed at the
               data directory is pointed back; anything else that would keep the cockpit on the data directory
               (AFC_DATA_DIR, a link elsewhere) is refused before anything moves, and if the restarted plugin
               still reads elsewhere the rollback is undone
  --finish     after the observation period: archive the legacy files of migration <id>, then delete them;
               refused while decisions.json or plans.json in the data directory is missing, broken or shrunk,
               and unless the plugin running in Paseo (restarted to check) reports that it reads the data directory
  --no-pause   do not pause the plugin in Paseo while files move (only when Paseo is not running)

The migration id is printed by the migrate step and stored in <data dir>/MIGRATION.json.`;

export const EXIT = { ok: 0, failed: 1, usage: 2 } as const;

export type MigrateArgs =
  | { mode: "help" }
  | { mode: "migrate"; from: string; to: string | null; dryRun: boolean; pause: boolean }
  | { mode: "rollback"; id: string; to: string | null; pause: boolean }
  | { mode: "finish"; id: string; to: string | null };

export class UsageError extends Error {}

const VALUE_FLAGS = new Set(["--from", "--to", "--rollback", "--finish"]);
const BOOL_FLAGS = new Set(["--dry-run", "--no-pause"]);

function expandHome(path: string, home: string): string {
  if (path === "~") return home;
  return path.startsWith("~/") ? join(home, path.slice(2)) : path;
}

export function parseMigrateArgs(argv: readonly string[], home: string = homedir()): MigrateArgs {
  const values = new Map<string, string>();
  const flags = new Set<string>();
  for (let i = 0; i < argv.length; i += 1) {
    const [flag, inline] = argv[i].split(/=(.*)/s, 2);
    if (flag === "-h" || flag === "--help" || flag === "help") return { mode: "help" };
    if (BOOL_FLAGS.has(flag) && inline === undefined) flags.add(flag);
    else if (VALUE_FLAGS.has(flag)) {
      const value = inline ?? argv[(i += 1)];
      if (!value || value.startsWith("--")) throw new UsageError(`${flag} needs a value`);
      if (values.has(flag)) throw new UsageError(`${flag} given twice`);
      values.set(flag, value);
    } else throw new UsageError(`unknown argument ${argv[i]}`);
  }
  const modes = ["--from", "--rollback", "--finish"].filter((flag) => values.has(flag));
  if (modes.length !== 1) throw new UsageError(modes.length === 0 ? "give --from, --rollback or --finish" : `${modes.join(" and ")} cannot be combined`);
  const to = values.has("--to") ? expandHome(values.get("--to") ?? "", home) : null;
  const pause = !flags.has("--no-pause");
  if (values.has("--from")) return { mode: "migrate", from: expandHome(values.get("--from") ?? "", home), to, dryRun: flags.has("--dry-run"), pause };
  if (flags.has("--dry-run")) throw new UsageError("--dry-run only works with --from");
  const id = values.get("--rollback") ?? values.get("--finish") ?? "";
  if (!isMigrationId(id)) throw new UsageError(`"${id}" is not a migration id (they look like 20300101T000000Z; see MIGRATION.json)`);
  if (values.has("--rollback")) return { mode: "rollback", id, to, pause };
  if (!pause) throw new UsageError("--finish restarts the plugin to check which directory it reads; drop --no-pause");
  return { mode: "finish", id, to };
}

// ---------------------------------------------------------------- pausing the plugin through Paseo

export interface RunResult {
  ok: boolean;
  stdout: string;
  error: string | null;
}

export type Runner = (cmd: string, args: string[]) => Promise<RunResult>;

const PASEO_TIMEOUT_MS = 60_000;

/** Run a command; PATH also covers ~/.local/bin, where Paseo installs its CLI by default. */
export function commandRunner(env: Env, home: string): Runner {
  const path = [env.PATH ?? "", join(home, ".local", "bin")].filter(Boolean).join(delimiter);
  return (cmd, args) =>
    new Promise((done) => {
      execFile(cmd, args, { env: { ...env, PATH: path }, timeout: PASEO_TIMEOUT_MS, maxBuffer: 8 * 1024 * 1024 }, (error, stdout, stderr) => {
        done({ ok: !error, stdout: String(stdout ?? ""), error: error ? String(stderr || error.message).replace(/\s+/g, " ").trim().slice(0, 300) : null });
      });
    });
}

/** How long to wait for the restarted plugin to log its data directory, and how often to look. */
export const READS_WAIT = { timeoutMs: 30_000, pollMs: 1_000 };

/** The newest `[afc] data dir` line logged at or after `since`, from `paseo plugin logs --json` output. */
export function latestDataDirLog(stdout: string, since: Date): string | null {
  let rows: unknown;
  try {
    rows = JSON.parse(stdout);
  } catch {
    return null;
  }
  if (!Array.isArray(rows)) return null;
  let found: string | null = null;
  for (const row of rows) {
    const { message, timestamp } = (row ?? {}) as { message?: unknown; timestamp?: unknown };
    if (typeof message !== "string" || typeof timestamp !== "string" || Date.parse(timestamp) < since.getTime()) continue;
    found = parseDataDirLog(message) ?? found;
  }
  return found;
}

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

export interface GateOptions {
  wait?: { timeoutMs: number; pollMs: number };
  pause?: (ms: number) => Promise<void>;
}

/**
 * Pause and resume the cockpit plugin in the Paseo daemon that owns $PASEO_HOME, and read back from the plugin log
 * which data directory the restarted plugin chose. AFC_PASEO_BIN overrides `paseo`.
 */
export function paseoGate(env: Env, home: string, run: Runner, options: GateOptions = {}): PluginGate {
  const wait = options.wait ?? READS_WAIT;
  const nap = options.pause ?? sleep;
  const bin = env.AFC_PASEO_BIN?.trim() || "paseo";
  const target = ["--home", paseoHome(env, home)];
  const id = PLUGIN_IDS.cockpit;
  return {
    async pause() {
      const listed = await run(bin, ["plugin", "ls", "--json", ...target]);
      if (!listed.ok) throw new MigrationError(`cannot reach Paseo to pause the plugin (${listed.error}); start Paseo, or pass --no-pause if it is not running`);
      let rows: unknown;
      try {
        rows = JSON.parse(listed.stdout);
      } catch {
        throw new MigrationError("`paseo plugin ls --json` did not print JSON; pass --no-pause if Paseo is not running");
      }
      const row = Array.isArray(rows) ? (rows.find((item) => (item as { id?: unknown })?.id === id) as { enabled?: unknown } | undefined) : undefined;
      if (!row) return { paused: false, note: `plugin ${id} is not installed in this Paseo; nothing to pause` };
      if (row.enabled === false) return { paused: false, note: `plugin ${id} is disabled; left disabled` };
      const off = await run(bin, ["plugin", "disable", id, ...target]);
      if (!off.ok) throw new MigrationError(`could not pause the plugin: ${off.error}`);
      return { paused: true, note: `plugin ${id} paused while files moved` };
    },
    async resume() {
      const on = await run(bin, ["plugin", "enable", id, ...target]);
      if (!on.ok) throw new Error(on.error ?? "paseo plugin enable failed");
    },
    async readsAfterResume(since) {
      for (let waited = 0; ; waited += wait.pollMs) {
        const logs = await run(bin, ["plugin", "logs", id, "--json", ...target]);
        const dir = logs.ok ? latestDataDirLog(logs.stdout, since) : null;
        if (dir || waited >= wait.timeoutMs) return dir;
        await nap(wait.pollMs);
      }
    },
  };
}

// ---------------------------------------------------------------- report

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const LIST_LIMIT = 12;

function shortList(items: readonly string[]): string {
  if (items.length === 0) return "none";
  const head = items.slice(0, LIST_LIMIT).join(", ");
  return items.length > LIST_LIMIT ? `${head} and ${items.length - LIST_LIMIT} more` : head;
}

export function formatPlan(plan: MigrationPlan): string[] {
  const lines = ["Dry run: nothing was changed.", `  from  ${plan.from}`, `  to    ${plan.to}`];
  for (const file of plan.files) {
    const where = file.from === file.to ? file.from : `${file.from} -> ${file.to}`;
    const extra = file.kind === "secret" ? ", private: 0600" : "";
    const clash = file.conflict === "none" ? "" : `  [already in the data directory: ${file.conflict === "same" ? "identical" : "different"}]`;
    lines.push(`  copy  ${where}  (${formatBytes(file.size)}${extra})${clash}`);
  }
  lines.push(`  stays in place: ${shortList(plan.leftInPlace)}`);
  if (plan.skipped.length > 0) lines.push(`  skipped: ${shortList(plan.skipped.map((row) => `${row.path} (${row.reason})`))}`);
  lines.push(`${plan.files.length} file(s), ${formatBytes(plan.totalBytes)}.`);
  for (const warning of plan.warnings) lines.push(`Warning: ${warning}`);
  if (plan.blockers.length === 0) lines.push("Ready: run the same command without --dry-run to migrate.");
  else lines.push("Cannot migrate yet:", ...plan.blockers.map((blocker) => `  - ${blocker}`));
  return lines;
}

export function formatMigrated(result: MigrateResult): string[] {
  const { record } = result;
  const bytes = record.files.reduce((sum, file) => sum + file.size, 0);
  const checks = [
    record.checks.decisions === null ? "decisions.json: none" : `decisions.json: ${record.checks.decisions} item(s) on both sides`,
    record.checks.plansSha256 === null ? "plans.json: none" : `plans.json: same sha256 ${record.checks.plansSha256.slice(0, 12)}…`,
  ];
  return [
    `Migrated ${record.id}: ${record.files.length} file(s), ${formatBytes(bytes)}, copied and checked (sha256 of every file).`,
    `  from    ${record.from} (unchanged)`,
    `  to      ${record.to}`,
    `  checks  ${checks.join("; ")}`,
    `  backup  ${join(record.to, record.backupDir)}/`,
    `  record  ${join(record.to, "MIGRATION.json")}`,
    ...result.notes.map((note) => `  note    ${note}`),
    `Next: keep the legacy directory for ${OBSERVATION_DAYS} days (\`afc doctor\` shows "Migration check"), then \`afc migrate --finish ${record.id}\`.`,
    `To undo: \`afc migrate --rollback ${record.id}\`.`,
  ];
}

export function formatRolledBack(result: RollbackResult): string[] {
  const { record, decisions } = result;
  const changed = result.changes.map((row) => `${row.path} (${row.change})`);
  return [
    `Rolled back ${record.id}: the cockpit uses ${record.from} again once the plugin restarts.`,
    `  changed since the migration: ${shortList(changed)}`,
    `  decisions: ${decisions.added.length} added, ${decisions.changed.length} changed, ${decisions.removed.length} removed since the migration`,
    `  export   ${result.exportFile} (for replaying those changes by hand)`,
    `  moved aside: ${result.setAside.length} file(s) -> ${join(record.to, record.rollback?.setAsideDir ?? "")}/`,
    `  restored in the legacy directory: ${shortList(record.rollback?.restored ?? [])}`,
    ...result.notes.map((note) => `  note    ${note}`),
  ];
}

export function formatFinished(result: FinishResult): string[] {
  return [
    `Finished ${result.record.id}: ${result.removed} legacy file(s) archived to ${result.archive} (archive verified), then deleted from ${result.record.from}.`,
    ...result.notes.map((note) => `  note    ${note}`),
  ];
}

function realpathOrNull(path: string): string | null {
  try {
    return realpathSync(path);
  } catch {
    return null;
  }
}

export type Phase = "migrated" | "finished";

/**
 * Things outside the data directory that decide what the cockpit and other programs actually read after a migrate
 * or finish: a --to the cockpit does not use, and the legacy path (often a symbolic link) other tools read directly.
 * (A rollback checks and repairs these itself.)
 */
export function pathHints(env: Env, home: string, record: { from: string; to: string }, phase: Phase): string[] {
  const hints: string[] = [];
  const legacyPath = legacyStateDir(home);
  const legacyTarget = realpathOrNull(legacyPath);
  const reads = resolve(pluginDataDir(PLUGIN_IDS.cockpit, env, home));
  if (phase === "migrated" && realpathOrNull(reads) !== record.to) hints.push(`the cockpit reads ${reads}, not ${record.to}; set AFC_DATA_DIR=${record.to} for it to use the migrated data`);
  if (legacyTarget === record.from) {
    hints.push(
      phase === "migrated"
        ? `${legacyPath} still points at the legacy directory; programs that read files there directly keep seeing the old copy until it points at the data directory`
        : `${legacyPath} still points at ${record.from}; programs that read files there directly will not find them any more`,
    );
  }
  return hints;
}

// ---------------------------------------------------------------- entry point

export interface CliIo {
  env?: Env;
  home?: string;
  now?: () => Date;
  /** Replaces the Paseo pause (tests). */
  gate?: PluginGate;
  out?: (line: string) => void;
  err?: (line: string) => void;
}

/** Run `afc migrate` with `argv`; returns the exit code. */
export async function runMigrateCli(argv: readonly string[], io: CliIo = {}): Promise<number> {
  const env = io.env ?? process.env;
  const home = io.home ?? homedir();
  const out = io.out ?? ((line: string) => console.log(line));
  const err = io.err ?? ((line: string) => console.error(line));
  let args: MigrateArgs;
  try {
    args = parseMigrateArgs(argv, home);
  } catch (error) {
    err(`afc migrate: ${error instanceof Error ? error.message : String(error)}\n\n${USAGE}`);
    return EXIT.usage;
  }
  if (args.mode === "help") {
    out(USAGE);
    return EXIT.ok;
  }
  const to = resolve(args.to ?? pluginDataDir(PLUGIN_IDS.cockpit, env, home));
  const gateFor = (pause: boolean) => (pause ? (io.gate ?? paseoGate(env, home, commandRunner(env, home))) : NO_PAUSE);
  const deps = { now: io.now ?? (() => new Date()), env, home };
  try {
    if (args.mode === "migrate" && args.dryRun) {
      const plan = await planMigration(args.from, to);
      formatPlan(plan).forEach((line) => out(line));
      return plan.blockers.length === 0 ? EXIT.ok : EXIT.failed;
    }
    if (args.mode === "migrate") {
      const result = await migrate({ from: args.from, to }, { ...deps, gate: gateFor(args.pause) });
      formatMigrated({ ...result, notes: [...result.notes, ...pathHints(env, home, result.record, "migrated")] }).forEach((line) => out(line));
      return EXIT.ok;
    }
    if (args.mode === "rollback") {
      formatRolledBack(await rollbackMigration(args.id, to, { ...deps, gate: gateFor(args.pause) })).forEach((line) => out(line));
      return EXIT.ok;
    }
    const finished = await finishMigration(args.id, to, { ...deps, gate: gateFor(true) });
    formatFinished({ ...finished, notes: [...finished.notes, ...pathHints(env, home, finished.record, "finished")] }).forEach((line) => out(line));
    return EXIT.ok;
  } catch (error) {
    if (error instanceof MigrationError) err(`afc migrate: ${error.message}`);
    else err(`afc migrate: unexpected error: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`);
    return EXIT.failed;
  }
}
