/// <reference types="node" />
// `afc migrate --finish <id>`: end the observation period. The legacy files are deleted only when nothing argues
// against it: every marker file that was migrated is still in the data directory and valid, decisions.json has at
// least as many items as were copied, the cockpit's rule (with this shell's environment) picks the data directory,
// the legacy files are the ones that were copied, and the plugin running in Paseo, restarted for the purpose,
// reports that it reads the data directory (Paseo can run with another AFC_DATA_DIR, HOME or PASEO_HOME).
// The files are archived to backups/legacy-<id>.tar.gz and the archive is read back before anything is deleted.
import { createHash, randomBytes } from "node:crypto";
import { rename, rm, unlink } from "node:fs/promises";
import { daysSince, decisionItems, MARKER_FILES, type MigrationRecord, OBSERVATION_DAYS } from "../shared/migration";
import { errorCode, fileStat, MigrationError, readJsonFile, removeEmptyDirs, sha256File, under } from "./migrate-files";
import { finishReadPathProblem, realOrSelf } from "./migrate-route";
import { listed, loadRecord, type MigrateDeps, saveRecord, withLock, withPausedPlugin } from "./migrate-steps";
import { readTarGz, writeTarGz } from "./tar";

export interface FinishResult {
  record: MigrationRecord;
  archive: string;
  removed: number;
  notes: string[];
}

const isObject = (value: unknown): boolean => typeof value === "object" && value !== null && !Array.isArray(value);

/** Why the data directory cannot yet stand on its own: missing, unreadable or shrunk marker files. */
export async function dataDirProblems(record: MigrationRecord): Promise<string[]> {
  const problems: string[] = [];
  for (const file of record.files.filter((row) => (MARKER_FILES as readonly string[]).includes(row.to))) {
    const path = under(record.to, file.to);
    if (!(await fileStat(path))) {
      problems.push(`${file.to} is missing from the data directory`);
      continue;
    }
    const json = await readJsonFile(path);
    if (file.to === "decisions.json") {
      const items = decisionItems(json);
      const copied = record.checks.decisions;
      if (items === null) problems.push("decisions.json is not a valid list of decisions");
      else if (copied !== null && items.length < copied) problems.push(`decisions.json has ${items.length} items, fewer than the ${copied} copied at migration`);
    } else if (!isObject(json)) {
      problems.push(`${file.to} is not a valid JSON object`);
    }
  }
  return problems;
}

async function legacyDrift(record: MigrationRecord): Promise<string[]> {
  const drift: string[] = [];
  for (const file of record.files) {
    const path = under(record.from, file.from);
    if (!(await fileStat(path))) drift.push(`${file.from} (missing)`);
    else if ((await sha256File(path)) !== file.sha256) drift.push(`${file.from} (changed)`);
  }
  return drift;
}

async function writeVerifiedArchive(record: MigrationRecord, archive: string): Promise<void> {
  const temp = `${archive}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    const entries = await Promise.all(
      record.files.map(async (file) => {
        const info = await fileStat(under(record.from, file.from));
        return { name: file.from, source: under(record.from, file.from), size: file.size, mode: file.kind === "secret" ? 0o600 : 0o644, mtimeMs: info?.mtimeMs ?? file.mtimeMs };
      }),
    );
    await writeTarGz(temp, entries);
    const read = new Map((await readTarGz(temp)).map((entry) => [entry.name, createHash("sha256").update(entry.data).digest("hex")]));
    const bad = record.files.filter((file) => read.get(file.from) !== file.sha256).map((file) => file.from);
    if (bad.length > 0 || read.size !== record.files.length) throw new MigrationError(`the archive does not match the legacy files (${listed(bad)}); nothing was deleted`);
    await rename(temp, archive);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}

const KEPT = (id: string) => `Nothing was archived or deleted; the legacy directory and migration ${id} stay as they are.`;

/**
 * Restart the plugin in Paseo and read back which directory it chose. Only the data directory lets finishing go on;
 * the legacy directory, anything else, or no answer refuses it. Returns the note for the report.
 */
async function confirmPluginReadsDataDir(record: MigrationRecord, gate: MigrateDeps["gate"]): Promise<string> {
  const keep = KEPT(record.id);
  if (!gate.readsAfterResume) throw new MigrationError(`cannot see which directory the plugin running in Paseo reads, so the legacy files are kept. ${keep}`);
  const restart = await withPausedPlugin(gate, async () => undefined);
  if (!restart.resumedAt) {
    throw new MigrationError(`could not restart the plugin to see which directory it reads (${restart.notes.join("; ")}). Enable it in Paseo, then run --finish again. ${keep}`);
  }
  const seen = await gate.readsAfterResume(restart.resumedAt);
  if (seen === null) {
    throw new MigrationError(`the restarted plugin did not report its data directory in time (\`paseo plugin logs ${record.plugin}\` shows no "[afc] data dir" line). Check that it runs, then run --finish again. ${keep}`);
  }
  const reads = realOrSelf(seen);
  if (reads === record.to) return `restarted the plugin in Paseo to check: it reads ${seen}`;
  const where = reads === record.from ? "the legacy directory, which finishing would empty" : "another directory";
  throw new MigrationError(
    `the plugin running in Paseo reads ${seen} (${where}), not the data directory ${record.to}. Paseo probably runs with a different AFC_DATA_DIR, HOME or PASEO_HOME than this shell: remove AFC_DATA_DIR from its environment (or set it to ${record.to}), restart Paseo, then run --finish again. ${keep}`,
  );
}

/** End the observation period: archive the legacy files, verify the archive, delete them from the legacy directory. */
export async function finishMigration(id: string, to: string, deps: MigrateDeps): Promise<FinishResult> {
  const record = await loadRecord(to, id, "finish");
  return withLock(record.to, async () => {
    const readPath = finishReadPathProblem(record, deps.env, deps.home);
    const problems = [...(await dataDirProblems(record)), ...(readPath ? [readPath] : [])];
    if (problems.length > 0) {
      throw new MigrationError(
        `the data directory cannot replace the legacy files yet: ${problems.join("; ")}.\n${KEPT(id)} Run \`afc doctor\`, restore the file from ${record.backupDir}/files/, or roll back.`,
      );
    }
    // What the plugin in Paseo really reads, before anything is archived or deleted. A plugin still on the legacy
    // directory also writes there, so this goes first: it names the cause, not the symptom.
    const confirmed = await confirmPluginReadsDataDir(record, deps.gate);
    const drift = await legacyDrift(record);
    if (drift.length > 0) {
      throw new MigrationError(
        `the legacy directory changed after migration ${id}: ${listed(drift)}.\nFinishing would lose those changes. Compare them with the data directory (the migration-time copies are in ${record.backupDir}/files/), make the legacy files match again or roll back.`,
      );
    }
    const archiveRel = `backups/legacy-${id}.tar.gz`;
    const archive = under(record.to, archiveRel);
    if (await fileStat(archive)) throw new MigrationError(`${archive} already exists`);
    await writeVerifiedArchive(record, archive);
    const archiveSha256 = await sha256File(archive);
    const late = await legacyDrift(record);
    if (late.length > 0) throw new MigrationError(`the legacy directory changed while it was being archived (${listed(late)}); nothing was deleted. Delete ${archive} and run --finish again`);
    for (const file of record.files) {
      await unlink(under(record.from, file.from)).catch((error: unknown) => {
        if (errorCode(error) !== "ENOENT") throw error;
      });
    }
    await removeEmptyDirs(record.from, record.files.map((file) => file.from));
    const at = deps.now();
    const updated: MigrationRecord = { ...record, status: "finished", finishedAt: at.toISOString(), finish: { archive: archiveRel, archiveSha256, removed: record.files.length } };
    await saveRecord(updated);
    const days = daysSince(record.migratedAt, at.getTime());
    const notes = [confirmed, ...(days < OBSERVATION_DAYS ? [`finished after ${days} day(s); the recommended observation period is ${OBSERVATION_DAYS} days`] : [])];
    notes.push(`the migration-time copy in ${record.backupDir}/ is kept; delete it by hand once you no longer need it`);
    return { record: updated, archive, removed: record.files.length, notes };
  });
}
