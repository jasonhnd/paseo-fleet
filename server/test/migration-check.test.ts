// The doctor's "Migration check" item: pure judgement (shared/doctor-checks.ts) and how server/doctor.ts feeds it
// from MIGRATION.json, the data directory and the legacy files. Demo data only.
import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { checkMigration, type MigrationView } from "../../shared/doctor-checks";
import { MIGRATION_FILE, type MigrationRecord } from "../../shared/migration";
import { migrate } from "../migrate";
import { type DemoHome, demoHome, recordingGate, steppingClock } from "./migrate-fixtures";
import { type DoctorDeps, readTextFile, runDoctor, statRegularFile } from "../doctor";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DAY = 86_400_000;
const MIGRATED_AT = Date.parse("2030-01-01T00:00:00.000Z");

const demoRecord = (over: Partial<MigrationRecord> = {}): MigrationRecord => ({
  schema: "afc-migration/v1",
  id: "20300101T000000Z",
  status: "migrated",
  from: "/demo/old",
  to: "/demo/data",
  migratedAt: new Date(MIGRATED_AT).toISOString(),
  backupDir: "backups/migration-20300101T000000Z",
  files: [],
  checks: { decisions: 4, plansSha256: null },
  plugin: "agent-fleet-cockpit",
  rolledBackAt: null,
  rollback: null,
  finishedAt: null,
  finish: null,
  ...over,
});

const legacyFile = (from: string, changed?: "size" | "mtime" | "gone") => ({
  from,
  recorded: { size: 10, mtimeMs: 1000 },
  now: changed === "gone" ? null : { size: changed === "size" ? 11 : 10, mtimeMs: changed === "mtime" ? 2000 : 1000 },
});

const active = (over: Partial<Extract<MigrationView, { state: "ok" }>> = {}): MigrationView => ({
  state: "ok",
  path: "/demo/data/MIGRATION.json",
  record: demoRecord(),
  decisionsNow: 4,
  legacy: [legacyFile("plans.json"), legacyFile("sweep.log")],
  usingLegacy: false,
  ...over,
});

describe("checkMigration", () => {
  test("nothing recorded: green, says so", () => {
    const item = checkMigration({ state: "absent", path: "/demo/data/MIGRATION.json" }, MIGRATED_AT);
    assert.equal(item.status, "green");
    assert.equal(item.summary, "No migration recorded");
    assert.equal(item.title, "Migration check");
  });

  test("unreadable record: yellow", () => {
    assert.equal(checkMigration({ state: "invalid", path: "/x", reason: "bad JSON" }, MIGRATED_AT).status, "yellow");
  });

  test("observation period, all well: green with the day count", () => {
    const item = checkMigration(active({ decisionsNow: 6 }), MIGRATED_AT + 2 * DAY);
    assert.equal(item.status, "green");
    assert.match(item.summary, /day 2 of 7/);
    assert.ok(item.findings.some((row) => row.key === "migration:decisions" && row.text.includes("6 items (4 at migration)")));
    assert.ok(item.findings.some((row) => row.key === "migration:legacy"));
  });

  test("fewer decisions than were copied: red", () => {
    const item = checkMigration(active({ decisionsNow: 3 }), MIGRATED_AT + DAY);
    assert.equal(item.status, "red");
    assert.match(item.summary, /fewer than the 4 copied/);
  });

  test("decisions.json gone from the data directory: yellow", () => {
    assert.equal(checkMigration(active({ decisionsNow: null }), MIGRATED_AT).status, "yellow");
  });

  test("legacy files written or deleted after the migration: yellow, named", () => {
    const changed = checkMigration(active({ legacy: [legacyFile("plans.json", "mtime"), legacyFile("sweep.log", "size")] }), MIGRATED_AT);
    assert.equal(changed.status, "yellow");
    assert.match(changed.summary, /something still writes to \/demo\/old: plans\.json, sweep\.log/);
    const gone = checkMigration(active({ legacy: [legacyFile("plans.json", "gone")] }), MIGRATED_AT);
    assert.equal(gone.status, "yellow");
    assert.ok(gone.findings.some((row) => row.key === "migration:legacy-missing"));
  });

  test("the cockpit still reads the legacy directory: red", () => {
    assert.equal(checkMigration(active({ usingLegacy: true }), MIGRATED_AT).status, "red");
  });

  test("after 7 days it suggests --finish", () => {
    const item = checkMigration(active(), MIGRATED_AT + 8 * DAY);
    assert.equal(item.status, "green");
    assert.ok(item.findings.some((row) => row.key === "migration:observation-over" && row.text.includes("afc migrate --finish 20300101T000000Z")));
  });

  test("rolled back and finished: green, one line", () => {
    assert.match(checkMigration(active({ record: demoRecord({ status: "rolled-back", rolledBackAt: "2030-01-02T00:00:00.000Z" }) }), MIGRATED_AT).summary, /was rolled back/);
    const finished = checkMigration(active({ record: demoRecord({ status: "finished", finishedAt: "2030-01-09T00:00:00.000Z", finish: { archive: "backups/legacy-x.tar.gz", archiveSha256: "0".repeat(64), removed: 3 } }) }), MIGRATED_AT);
    assert.equal(finished.status, "green");
    assert.match(finished.summary, /archived in backups\/legacy-x\.tar\.gz/);
  });
});

describe("runDoctor reads the migration from the data directory", () => {
  const homes: DemoHome[] = [];
  after(() => {
    for (const demo of homes) demo.cleanup();
  });

  /** The doctor's own file readers on the demo directories; every command fails, so only file-based items matter. */
  function fileOnlyDeps(demo: DemoHome, now: number): DoctorDeps {
    return {
      now: () => now,
      stateDir: demo.dataDir,
      paseoDir: demo.paseoHome,
      configPath: join(demo.paseoHome, "config.json"),
      kanbanRoot: join(demo.root, "no-kanban"),
      kanbanDataDir: join(demo.root, "no-kanban", "data"),
      dataDir: { dir: demo.dataDir, source: "data-dir", dataDir: demo.dataDir, legacyDir: demo.legacy },
      paseoBin: "paseo",
      run: async () => ({ ok: false, stdout: "", timedOut: false, error: "not run in tests", exitCode: 1 }),
      readJson: async (path) => {
        try {
          return JSON.parse(readFileSync(path, "utf8")) as unknown;
        } catch {
          return null;
        }
      },
      readTail: async () => null,
      listLogs: async () => [],
      pathDirs: async () => [],
      isFile: () => false,
      realpath: (path) => path,
      readText: readTextFile,
      statFile: statRegularFile,
    };
  }

  test("green right after the migration, yellow once a legacy file changes", async () => {
    const demo = demoHome();
    homes.push(demo);
    await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: steppingClock(), gate: recordingGate() });
    const first = (await runDoctor(fileOnlyDeps(demo, MIGRATED_AT + DAY))).items.find((row) => row.id === "migration");
    assert.equal(first?.status, "green", JSON.stringify(first));
    assert.match(first?.summary ?? "", /day 1 of 7/);
    assert.ok(first?.evidence[0].endsWith(MIGRATION_FILE));
    writeFileSync(join(demo.legacy, "sweep.log"), "written after the migration\n");
    const second = (await runDoctor(fileOnlyDeps(demo, MIGRATED_AT + DAY))).items.find((row) => row.id === "migration");
    assert.equal(second?.status, "yellow");
    assert.match(second?.summary ?? "", /sweep\.log/);
  });
});
