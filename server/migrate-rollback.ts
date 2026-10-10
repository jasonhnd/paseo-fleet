/// <reference types="node" />
// `afc migrate --rollback <id>`: the cockpit goes back to the legacy directory, and nothing is lost.
//
// Before anything moves, the command checks that the cockpit's own rule will land on the legacy directory once the
// migrated files are out of the way; what it cannot put right (AFC_DATA_DIR, a legacy path that leads elsewhere)
// is refused with the steps to take. With the plugin paused it then exports what changed since the migration,
// restores legacy files that went missing, points the legacy link back if the cutover had pointed it at the data
// directory, and moves the migrated files aside. If the cockpit would still not read the legacy directory, or the
// restarted plugin reports another directory, every step is put back and the migration stays active.
import { rm, writeFile } from "node:fs/promises";
import { decisionItems, type DecisionsDiff, diffDecisions, type MigrationRecord, ROLLBACK_SCHEMA } from "../shared/migration";
import { copyVerified, ensureDir, fileStat, MigrationError, moveFile, readJsonFile, scanTarget, SECRET_DIR_MODE, sha256File, under } from "./migrate-files";
import { cockpitReadsDir, type LinkChange, type LinkPlan, planRollbackReadPath, realOrSelf, repointLink, undoLink } from "./migrate-route";
import { listed, loadRecord, type MigrateDeps, saveRecord, withLock, withPausedPlugin } from "./migrate-steps";

export interface FileChange {
  path: string;
  change: "added" | "changed" | "removed";
}

export interface RollbackResult {
  record: MigrationRecord;
  changes: FileChange[];
  decisions: DecisionsDiff;
  exportFile: string;
  setAside: string[];
  notes: string[];
}

async function dataDirChanges(record: MigrationRecord): Promise<{ changes: FileChange[]; present: string[] }> {
  const recorded = new Map(record.files.map((file) => [file.to, file]));
  const changes: FileChange[] = [];
  const present: string[] = [];
  for (const file of record.files) {
    const info = await fileStat(under(record.to, file.to));
    if (!info) changes.push({ path: file.to, change: "removed" });
    else {
      present.push(file.to);
      if ((await sha256File(under(record.to, file.to))) !== file.sha256) changes.push({ path: file.to, change: "changed" });
    }
  }
  for (const path of await scanTarget(record.to)) {
    if (recorded.has(path)) continue;
    changes.push({ path, change: "added" });
    present.push(path);
  }
  return { changes, present };
}

/** Legacy files to restore (missing) and to report (changed since the migration). Fails before anything moves. */
async function legacyState(record: MigrationRecord): Promise<{ missing: MigrationRecord["files"]; changed: string[] }> {
  const missing: MigrationRecord["files"] = [];
  const changed: string[] = [];
  for (const file of record.files) {
    const path = under(record.from, file.from);
    if (!(await fileStat(path))) {
      const copy = under(record.to, `${record.backupDir}/files/${file.from}`);
      if (!(await fileStat(copy))) throw new MigrationError(`${path} is missing and so is its backup ${copy}; nothing was rolled back`);
      missing.push(file);
    } else if ((await sha256File(path)) !== file.sha256) {
      changed.push(file.from);
    }
  }
  return { missing, changed };
}

interface Applied extends RollbackResult {
  /** Put every change back (files, link, export, record); used when the restarted plugin reads the wrong place. */
  undo: () => Promise<void>;
}

async function applyRollback(record: MigrationRecord, linkPlan: LinkPlan | null, deps: MigrateDeps): Promise<Applied> {
  const id = record.id;
  const legacy = await legacyState(record);
  const { changes, present } = await dataDirChanges(record);
  const before = decisionItems(await readJsonFile(under(record.to, `${record.backupDir}/files/decisions.json`))) ?? [];
  const after = decisionItems(await readJsonFile(under(record.to, "decisions.json"))) ?? [];
  const decisions = diffDecisions(before, after);
  const at = deps.now().toISOString();
  const exportRel = `backups/rollback-${id}.json`;
  const exportFile = under(record.to, exportRel);
  const setAsideRel = `backups/rollback-${id}`;
  const exported = { schema: ROLLBACK_SCHEMA, id, rolledBackAt: at, from: record.from, to: record.to, setAsideDir: `${setAsideRel}/data`, files: changes, decisions };
  await writeFile(exportFile, `${JSON.stringify(exported, null, 2)}\n`, "utf8");
  for (const file of legacy.missing) {
    await copyVerified(under(record.to, `${record.backupDir}/files/${file.from}`), under(record.from, file.from), file.sha256, { secret: file.kind === "secret" });
  }
  const moved: Array<{ path: string; dest: string }> = [];
  const links: LinkChange[] = [];
  const putBack = async (): Promise<void> => {
    for (const row of moved.splice(0).reverse()) await moveFile(row.dest, under(record.to, row.path), row.path.startsWith("secrets/"));
    for (const change of links.splice(0)) await undoLink(change);
    await rm(exportFile, { force: true });
  };
  try {
    if (linkPlan) links.push(await repointLink(linkPlan.path, linkPlan.target));
    await ensureDir(under(record.to, setAsideRel), SECRET_DIR_MODE);
    for (const path of present) {
      const dest = under(record.to, `${setAsideRel}/data/${path}`);
      if (await fileStat(dest)) throw new MigrationError(`${dest} already exists; move it away and run the rollback again`);
      await moveFile(under(record.to, path), dest, path.startsWith("secrets/"));
      moved.push({ path, dest });
    }
    const reads = cockpitReadsDir(deps.env, deps.home);
    if (reads !== record.from) throw new MigrationError(`with the migrated files moved aside the cockpit would read ${reads}, not ${record.from}; everything was put back and migration ${id} stays active`);
  } catch (error) {
    await putBack();
    throw error;
  }
  const linkRestored = links[0] ? { path: links[0].path, from: links[0].before, to: links[0].after } : null;
  const updated: MigrationRecord = {
    ...record,
    status: "rolled-back",
    rolledBackAt: at,
    rollback: { exportFile: exportRel, setAsideDir: `${setAsideRel}/data`, restored: legacy.missing.map((file) => file.from), changedInLegacy: legacy.changed, linkRestored },
  };
  try {
    await saveRecord(updated);
  } catch (error) {
    await putBack();
    throw error;
  }
  const notes: string[] = [];
  if (linkRestored) notes.push(`pointed ${linkRestored.path} back at ${linkRestored.to} (the cutover had pointed it at ${linkRestored.from})`);
  if (legacy.changed.length > 0) notes.push(`changed in the legacy directory after the migration, newer version kept: ${listed(legacy.changed)}`);
  const undo = async (): Promise<void> => {
    await putBack();
    await saveRecord(record);
  };
  return { record: updated, changes, decisions, exportFile, setAside: present, notes, undo };
}

/** Undo a migration: the cockpit falls back to the legacy directory; the migrated files are kept aside. */
export async function rollbackMigration(id: string, to: string, deps: MigrateDeps): Promise<RollbackResult> {
  const record = await loadRecord(to, id, "roll back");
  const linkPlan = await planRollbackReadPath(record, deps.env, deps.home);
  return withLock(record.to, async () => {
    const paused = await withPausedPlugin(deps.gate, () => applyRollback(record, linkPlan, deps));
    const { undo, ...result } = paused.value;
    const notes = [...paused.notes, ...result.notes];
    if (paused.resumedAt && deps.gate.readsAfterResume) {
      const seen = await deps.gate.readsAfterResume(paused.resumedAt);
      if (seen === null) notes.push("could not see which directory the restarted plugin reads; check `paseo plugin logs agent-fleet-cockpit`");
      else if (realOrSelf(seen) !== record.from) {
        await withPausedPlugin(deps.gate, undo);
        throw new MigrationError(
          `the restarted plugin reads ${seen}, not ${record.from} (Paseo runs with a different AFC_DATA_DIR, HOME or PASEO_HOME than this shell?), so the rollback was undone: the files are back in ${record.to} and migration ${id} is active again`,
        );
      } else notes.push(`the restarted plugin reads ${seen}`);
    }
    return { ...result, notes };
  });
}
