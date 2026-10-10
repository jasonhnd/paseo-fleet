/// <reference types="node" />
// `afc migrate`: copy the cockpit's state from a legacy directory into its data directory, check the copy and
// record it in MIGRATION.json; later roll it back (server/migrate-rollback.ts) or finish it (server/migrate-finish.ts).
// The source is copied, never moved, and stays untouched until `--finish`, which archives it first.
//
//   migrate   pause the plugin, snapshot the source into backups/migration-<id>/, copy (marker files last),
//             verify every hash, compare decisions.json items and the plans.json checksum, write MIGRATION.json.
import { realpath, rm, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { PLUGIN_IDS } from "../shared/contract/schema";
import { copyRank, MARKER_FILES, migrationId, type MigrationRecord } from "../shared/migration";
import {
  copyVerified,
  ensureDir,
  errorCode,
  fileStat,
  MigrationError,
  pathExists,
  scanSource,
  SECRET_DIR_MODE,
  sha256File,
  type SourceFile,
  type SourceScan,
  under,
} from "./migrate-files";
import { realOrSelf } from "./migrate-route";
import { canonical, decisionCount, listed, type MigrateDeps, readRecordIfAny, saveRecord, withLock, withPausedPlugin } from "./migrate-steps";

export { MigrationError } from "./migrate-files";
export { finishMigration, type FinishResult } from "./migrate-finish";
export { type FileChange, rollbackMigration, type RollbackResult } from "./migrate-rollback";
export { type MigrateDeps, NO_PAUSE, type PluginGate } from "./migrate-steps";

// ---------------------------------------------------------------- plan

export interface PlannedFile extends SourceFile {
  /** The data directory already has a file at `to`. */
  conflict: "none" | "same" | "differs";
}

export interface MigrationPlan {
  from: string;
  to: string;
  files: PlannedFile[];
  leftInPlace: string[];
  skipped: SourceScan["skipped"];
  totalBytes: number;
  /** Reasons the migration cannot run; empty when it can. */
  blockers: string[];
  /** Notes that do not stop the migration. */
  warnings: string[];
}

async function existingDir(path: string, label: string): Promise<string> {
  try {
    if ((await stat(path)).isDirectory()) return await realpath(path);
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
  }
  throw new MigrationError(`${label} ${path} is not a directory`);
}

/** `child` is `parent` or somewhere below it. */
function inside(child: string, parent: string): boolean {
  const rel = relative(parent, child);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}

async function conflictOf(file: SourceFile, from: string, to: string): Promise<PlannedFile["conflict"]> {
  const existing = await fileStat(under(to, file.to));
  if (!existing) return "none";
  if (existing.size !== file.size) return "differs";
  return (await sha256File(under(to, file.to))) === (await sha256File(under(from, file.from))) ? "same" : "differs";
}

/** What a migration from `fromInput` into `toInput` would do. Reads only. */
export async function planMigration(fromInput: string, toInput: string): Promise<MigrationPlan> {
  const from = await existingDir(resolve(fromInput), "--from");
  const to = await canonical(toInput);
  if (inside(to, from) || inside(from, to)) throw new MigrationError(`the source ${from} and the data directory ${to} must not be the same or inside each other`);
  const scan = await scanSource(from);
  if (scan.files.length === 0) throw new MigrationError(`nothing to migrate: ${from} has no cockpit state files (*.json, *.jsonl, *.log, state/, backups/)`);
  const files = await Promise.all(scan.files.map(async (file) => ({ ...file, conflict: await conflictOf(file, from, to) })));
  const blockers: string[] = [];
  const warnings: string[] = [];
  const { record, problem } = await readRecordIfAny(to);
  if (problem) blockers.push(problem);
  if (record?.status === "migrated") blockers.push(`migration ${record.id} is still active; run --rollback ${record.id} or --finish ${record.id} first`);
  for (const file of files.filter((row) => row.conflict !== "none")) {
    blockers.push(`${file.to} already exists in the data directory (${file.conflict === "same" ? "identical" : "different content"})`);
  }
  if (!files.some((file) => (MARKER_FILES as readonly string[]).includes(file.to))) {
    warnings.push(`the source has neither ${MARKER_FILES.join(" nor ")}; the cockpit only switches to a data directory that holds one of them`);
  }
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  return { from, to, files, leftInPlace: scan.leftInPlace, skipped: scan.skipped, totalBytes, blockers, warnings };
}

// ---------------------------------------------------------------- migrate

export interface MigrateResult {
  record: MigrationRecord;
  plan: MigrationPlan;
  notes: string[];
}

async function hashed(plan: MigrationPlan): Promise<Array<PlannedFile & { sha256: string }>> {
  return Promise.all(plan.files.map(async (file) => ({ ...file, sha256: await sha256File(under(plan.from, file.from)) })));
}

const ID_ATTEMPTS = 60;

/** The id for `now`, moved on a second at a time while an earlier migration in the same second already took it. */
async function freeMigrationId(to: string, now: Date): Promise<string> {
  for (let step = 0; step < ID_ATTEMPTS; step += 1) {
    const id = migrationId(new Date(now.getTime() + step * 1000));
    if (!(await pathExists(under(to, `backups/migration-${id}`)))) return id;
  }
  throw new MigrationError(`no free migration id near ${migrationId(now)} in ${to}/backups/`);
}

/** Copy the source into the data directory and record it. Refuses when the plan has blockers. */
export async function migrate(input: { from: string; to: string }, deps: MigrateDeps): Promise<MigrateResult> {
  const preview = await planMigration(input.from, input.to);
  if (preview.blockers.length > 0) throw new MigrationError(`cannot migrate:\n  ${preview.blockers.join("\n  ")}`);
  const now = deps.now();
  return withLock(preview.to, async () => {
    const id = await freeMigrationId(preview.to, now);
    const backupRel = `backups/migration-${id}`;
    const backupDir = under(preview.to, backupRel);
    const paused = await withPausedPlugin(deps.gate, async (): Promise<MigrateResult> => {
      // Plan again now that the plugin is paused: this list is the one that gets copied.
      const plan = await planMigration(preview.from, preview.to);
      if (plan.blockers.length > 0) throw new MigrationError(`cannot migrate:\n  ${plan.blockers.join("\n  ")}`);
      const created: string[] = [];
      try {
        const files = await hashed(plan);
        await ensureDir(backupDir, SECRET_DIR_MODE);
        for (const file of files) await copyVerified(under(plan.from, file.from), under(backupDir, `files/${file.from}`), file.sha256, { secret: file.kind === "secret" });
        for (const file of [...files].sort((a, b) => copyRank(a) - copyRank(b))) {
          const dest = under(plan.to, file.to);
          await copyVerified(under(plan.from, file.from), dest, file.sha256, { secret: file.kind === "secret" });
          created.push(dest);
        }
        // The source must not have changed while it was copied; its mtime from here on is what the doctor compares.
        const recheck = await Promise.all(files.map(async (file) => ({ file, sha256: await sha256File(under(plan.from, file.from)), info: await fileStat(under(plan.from, file.from)) })));
        const changed = recheck.filter((row) => row.sha256 !== row.file.sha256 || row.info?.size !== row.file.size).map((row) => row.file.from);
        if (changed.length > 0) throw new MigrationError(`the source changed while it was being copied (${listed(changed)}); nothing was migrated, try again`);
        const sourceDecisions = files.some((file) => file.to === "decisions.json") ? await decisionCount(under(plan.from, "decisions.json")) : null;
        const targetDecisions = files.some((file) => file.to === "decisions.json") ? await decisionCount(under(plan.to, "decisions.json")) : null;
        if (sourceDecisions !== targetDecisions) throw new MigrationError(`decisions.json has ${targetDecisions} items after copying, ${sourceDecisions} in the source`);
        const plansSha256 = files.find((file) => file.to === "plans.json")?.sha256 ?? null;
        if (plansSha256 && (await sha256File(under(plan.to, "plans.json"))) !== plansSha256) throw new MigrationError("plans.json checksum differs after copying");
        const record: MigrationRecord = {
          schema: "afc-migration/v1",
          id,
          status: "migrated",
          from: plan.from,
          to: plan.to,
          migratedAt: now.toISOString(),
          backupDir: backupRel,
          files: recheck.map(({ file, info }) => ({ from: file.from, to: file.to, kind: file.kind, size: file.size, sha256: file.sha256, mtimeMs: info?.mtimeMs ?? file.mtimeMs })),
          checks: { decisions: sourceDecisions, plansSha256 },
          plugin: PLUGIN_IDS.cockpit,
          rolledBackAt: null,
          rollback: null,
          finishedAt: null,
          finish: null,
        };
        await saveRecord(record);
        return { record, plan, notes: plan.warnings };
      } catch (error) {
        for (const path of created.reverse()) await rm(path, { force: true });
        await rm(backupDir, { recursive: true, force: true });
        throw error;
      }
    });
    const result = paused.value;
    return { ...result, notes: [...paused.notes, ...result.notes, ...(await restartedReads(deps, paused.resumedAt, result.record))] };
  });
}

/** Nothing is lost when the restarted plugin reads elsewhere (the legacy directory is untouched), so it is a note. */
async function restartedReads(deps: MigrateDeps, resumedAt: Date | null, record: MigrationRecord): Promise<string[]> {
  if (!resumedAt || !deps.gate.readsAfterResume) return [];
  const seen = await deps.gate.readsAfterResume(resumedAt);
  if (seen === null) return ["could not see which directory the restarted plugin reads; check `paseo plugin logs agent-fleet-cockpit`"];
  if (realOrSelf(seen) === record.to) return [`the restarted plugin reads ${seen}`];
  return [`WARNING: the restarted plugin reads ${seen}, not ${record.to} (Paseo runs with a different AFC_DATA_DIR, HOME or PASEO_HOME?); the legacy directory is untouched, so roll back or fix Paseo's environment`];
}
