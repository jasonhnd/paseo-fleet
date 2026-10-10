// `afc migrate` end to end on demo data in temp directories: plan, migrate, rollback, migrate again, finish,
// plus the refusals (conflicts, active migration, legacy changed) and the clean-up after a failed copy.
import assert from "node:assert/strict";
import { chmodSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { after, describe, test } from "node:test";
import { MIGRATION_FILE, MigrationRecord } from "../../shared/migration";
import { finishMigration, migrate, MigrationError, planMigration, rollbackMigration } from "../migrate";
import { chooseDataDir } from "../paths";
import { readTarGz } from "../tar";
import { daemonGate, DEMO_DECISIONS, DEMO_FILES, DEMO_STAYS, type DemoHome, demoHome, put, recordingGate, steppingClock } from "./migrate-fixtures";

const homes: DemoHome[] = [];
function fresh(): DemoHome {
  const demo = demoHome();
  homes.push(demo);
  return demo;
}
after(() => {
  for (const demo of homes) demo.cleanup();
});

const sha = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const read = (root: string, rel: string) => readFileSync(join(root, ...rel.split("/")), "utf8");
const has = (root: string, rel: string) => existsSync(join(root, ...rel.split("/")));
const record = (dir: string) => MigrationRecord.parse(JSON.parse(readFileSync(join(dir, MIGRATION_FILE), "utf8")));
const mode = (path: string) => statSync(path).mode & 0o777;
const TARGET_OF: Record<string, string> = {
  "state/cursor-token.json": "secrets/cursor-token.json",
  "backups/config-20300101-000000.json": "backups/legacy/config-20300101-000000.json",
  "backups/nested/demo-backup.txt": "backups/legacy/nested/demo-backup.txt",
};
const targetOf = (rel: string) => TARGET_OF[rel] ?? rel;

describe("plan (dry run)", () => {
  test("lists the state files and where they go; docs, code, hidden files and links stay", async () => {
    const demo = fresh();
    const plan = await planMigration(join(demo.home, ".config", "fleet-roles"), demo.dataDir);
    assert.equal(plan.from, demo.legacy, "symbolic links in --from are resolved");
    assert.deepEqual(plan.files.map((file) => [file.from, file.to]).sort(), Object.keys(DEMO_FILES).map((rel) => [rel, targetOf(rel)]).sort());
    assert.deepEqual(plan.blockers, []);
    assert.ok(plan.leftInPlace.includes("README.md") && plan.leftInPlace.includes("docs/") && plan.leftInPlace.includes("tool/") && plan.leftInPlace.includes("package.json"));
    assert.ok(!plan.leftInPlace.includes(".hidden.json"));
    assert.deepEqual(plan.skipped, [{ path: "plans-link.json", reason: "symbolic link" }]);
    assert.equal(plan.totalBytes, Object.values(DEMO_FILES).reduce((sum, body) => sum + Buffer.byteLength(body), 0));
    assert.equal(existsSync(demo.dataDir), false, "a dry run creates nothing");
  });

  test("files already in the data directory block the migration", async () => {
    const demo = fresh();
    put(demo.dataDir, "plans.json", DEMO_FILES["plans.json"]);
    put(demo.dataDir, "sweep.log", "other content\n");
    const plan = await planMigration(demo.legacy, demo.dataDir);
    assert.deepEqual(plan.files.filter((file) => file.conflict !== "none").map((file) => [file.to, file.conflict]).sort(), [["plans.json", "same"], ["sweep.log", "differs"]]);
    assert.equal(plan.blockers.length, 2);
    await assert.rejects(migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: steppingClock(), gate: recordingGate() }), /already exists in the data directory/);
  });

  test("refuses the same or nested directories and an empty source", async () => {
    const demo = fresh();
    await assert.rejects(planMigration(demo.legacy, demo.legacy), MigrationError);
    await assert.rejects(planMigration(demo.legacy, join(demo.legacy, "data")), /inside each other/);
    await assert.rejects(planMigration(join(demo.legacy, "docs"), demo.dataDir), /nothing to migrate/);
    await assert.rejects(planMigration(join(demo.root, "missing"), demo.dataDir), /is not a directory/);
  });

  test("an unreadable MIGRATION.json blocks", async () => {
    const demo = fresh();
    put(demo.dataDir, MIGRATION_FILE, "{not json");
    assert.match((await planMigration(demo.legacy, demo.dataDir)).blockers.join("\n"), /MIGRATION\.json is invalid/);
  });
});

describe("migrate -> rollback -> migrate -> finish", () => {
  const demo = fresh();
  const now = steppingClock();
  const gate = recordingGate();
  const env = demo.env;
  const legacyBefore = Object.fromEntries(Object.keys(DEMO_FILES).map((rel) => [rel, sha(join(demo.legacy, ...rel.split("/")))]));
  let firstId = "";
  let secondId = "";

  test("migrate copies, verifies and records; the source is untouched", async () => {
    const result = await migrate({ from: join(demo.home, ".config", "fleet-roles"), to: demo.dataDir }, { ...demo.where, now, gate });
    firstId = result.record.id;
    assert.equal(firstId, "20300101T000000Z");
    assert.deepEqual(gate.calls, ["pause", "resume"]);
    for (const rel of Object.keys(DEMO_FILES)) {
      assert.equal(read(demo.dataDir, targetOf(rel)), DEMO_FILES[rel], `${rel} copied`);
      assert.equal(read(demo.dataDir, `backups/migration-${firstId}/files/${rel}`), DEMO_FILES[rel], `${rel} backed up`);
      assert.equal(sha(join(demo.legacy, ...rel.split("/"))), legacyBefore[rel], `${rel} unchanged in the source`);
    }
    assert.equal(mode(join(demo.dataDir, "secrets")), 0o700);
    assert.equal(mode(join(demo.dataDir, "secrets", "cursor-token.json")), 0o600);
    assert.equal(mode(join(demo.dataDir, `backups/migration-${firstId}`)), 0o700);
    assert.notEqual(mode(join(demo.dataDir, "backups")), 0o700, "only the backup folder itself is private, not backups/");
    const saved = record(demo.dataDir);
    assert.equal(saved.status, "migrated");
    assert.equal(saved.from, demo.legacy);
    assert.equal(saved.checks.decisions, DEMO_DECISIONS.length);
    assert.equal(saved.checks.plansSha256, legacyBefore["plans.json"]);
    assert.deepEqual(record(join(demo.dataDir, `backups/migration-${firstId}`)), saved, "a copy of the record sits beside the backup");
    assert.equal(has(demo.dataDir, ".migrate.lock"), false);
    assert.equal(chooseDataDir(env, demo.home).source, "data-dir", "the cockpit now reads the data directory");
  });

  test("a second migrate is refused while the first is active", async () => {
    await assert.rejects(migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() }), /still active/);
  });

  test("rollback exports what changed, restores missing legacy files and moves the migrated files aside", async () => {
    // The plugin kept working in the data directory: one decision answered, one added, a new state file.
    const decisions = [{ ...DEMO_DECISIONS[0], status: "done" }, DEMO_DECISIONS[1], { id: "d-demo-3", project: "DEMO", title: "New demo question", status: "open" }];
    writeFileSync(join(demo.dataDir, "decisions.json"), JSON.stringify(decisions));
    writeFileSync(join(demo.dataDir, "pool-status.json"), "{}");
    writeFileSync(join(demo.dataDir, "new-state.json"), "{}");
    // Something touched the legacy directory: one file deleted, one rewritten.
    unlinkSync(join(demo.legacy, "sweep.log"));
    writeFileSync(join(demo.legacy, "leader-activity.jsonl"), '{"at":"2030-01-02T00:00:00Z"}\n');
    const rollbackGate = recordingGate();
    const result = await rollbackMigration(firstId, demo.dataDir, { ...demo.where, now, gate: rollbackGate });
    assert.deepEqual(rollbackGate.calls, ["pause", "resume"]);
    assert.deepEqual(result.changes.map((row) => `${row.path}:${row.change}`).sort(), ["decisions.json:changed", "new-state.json:added", "pool-status.json:changed"]);
    assert.deepEqual(result.decisions.added.map((item) => item.id), ["d-demo-3"]);
    assert.deepEqual(result.decisions.changed.map((row) => [row.before.status, row.after.status]), [["open", "done"]]);
    const exported = JSON.parse(read(demo.dataDir, `backups/rollback-${firstId}.json`));
    assert.equal(exported.schema, "afc-rollback/v1");
    assert.deepEqual(exported.decisions.added.map((item: { id: string }) => item.id), ["d-demo-3"]);
    assert.equal(read(demo.legacy, "sweep.log"), DEMO_FILES["sweep.log"], "the missing legacy file came back from the backup");
    assert.equal(read(demo.legacy, "leader-activity.jsonl"), '{"at":"2030-01-02T00:00:00Z"}\n', "a changed legacy file keeps its newer content");
    assert.deepEqual(result.record.rollback?.restored, ["sweep.log"]);
    assert.deepEqual(result.record.rollback?.changedInLegacy, ["leader-activity.jsonl"]);
    for (const rel of ["decisions.json", "plans.json", "new-state.json", "secrets/cursor-token.json", "backups/legacy/nested/demo-backup.txt"]) {
      assert.equal(has(demo.dataDir, rel), false, `${rel} moved out of the way`);
      assert.ok(has(demo.dataDir, `backups/rollback-${firstId}/data/${rel}`), `${rel} kept in the rollback folder`);
    }
    assert.equal(read(demo.dataDir, `backups/rollback-${firstId}/data/decisions.json`), JSON.stringify(decisions));
    assert.equal(record(demo.dataDir).status, "rolled-back");
    const choice = chooseDataDir(env, demo.home);
    assert.equal(choice.source, "legacy", "the cockpit falls back to the legacy directory");
    await assert.rejects(rollbackMigration(firstId, demo.dataDir, { ...demo.where, now, gate: recordingGate() }), /already rolled-back/);
    await assert.rejects(finishMigration(firstId, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), /already rolled-back/);
  });

  test("migrate again after the rollback", async () => {
    const result = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() });
    secondId = result.record.id;
    assert.notEqual(secondId, firstId);
    assert.equal(read(demo.dataDir, "leader-activity.jsonl"), '{"at":"2030-01-02T00:00:00Z"}\n', "the current legacy content is what moves");
    assert.equal(chooseDataDir(env, demo.home).source, "data-dir");
    assert.ok(has(demo.dataDir, `backups/migration-${firstId}/MIGRATION.json`), "the first migration's history stays");
  });

  test("finish refuses the wrong id", async () => {
    await assert.rejects(finishMigration(firstId, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), new RegExp(`is for migration ${secondId}`));
  });

  test("finish archives the legacy files, verifies the archive, then deletes only them", async () => {
    const result = await finishMigration(secondId, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) });
    const saved = record(demo.dataDir);
    assert.equal(saved.status, "finished");
    assert.equal(saved.finish?.archive, `backups/legacy-${secondId}.tar.gz`);
    assert.equal(saved.finish?.archiveSha256, sha(result.archive));
    const entries = await readTarGz(result.archive);
    assert.deepEqual(entries.map((entry) => entry.name).sort(), Object.keys(DEMO_FILES).sort());
    for (const entry of entries) {
      const file = saved.files.find((row) => row.from === entry.name);
      assert.equal(createHash("sha256").update(entry.data).digest("hex"), file?.sha256, `${entry.name} archived intact`);
    }
    assert.equal(entries.find((entry) => entry.name === "state/cursor-token.json")?.mode, 0o600);
    for (const rel of Object.keys(DEMO_FILES)) assert.equal(has(demo.legacy, rel), false, `${rel} deleted from the legacy directory`);
    assert.equal(has(demo.legacy, "state"), false, "emptied folders go too");
    assert.equal(has(demo.legacy, "backups"), false);
    for (const rel of Object.keys(DEMO_STAYS)) assert.ok(has(demo.legacy, rel), `${rel} stays`);
    assert.ok(lstatSync(join(demo.legacy, "plans-link.json")).isSymbolicLink(), "links are left alone");
    assert.match(result.notes.join("\n"), /observation period is 7 days/);
    assert.equal(chooseDataDir(env, demo.home).source, "data-dir");
    await assert.rejects(finishMigration(secondId, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), /already finished/);
  });
});

describe("migration ids", () => {
  test("a second migration in the same second gets the next free id", async () => {
    const demo = fresh();
    const frozen = () => new Date("2030-01-01T00:00:00.000Z");
    const first = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: frozen, gate: recordingGate() });
    await rollbackMigration(first.record.id, demo.dataDir, { ...demo.where, now: frozen, gate: recordingGate() });
    const second = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: frozen, gate: recordingGate() });
    assert.deepEqual([first.record.id, second.record.id], ["20300101T000000Z", "20300101T000001Z"]);
  });
});

describe("finish refuses a legacy directory that changed", () => {
  test("nothing is archived or deleted", async () => {
    const demo = fresh();
    const now = steppingClock();
    const { record: done } = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() });
    writeFileSync(join(demo.legacy, "plans.json"), JSON.stringify({ plans: [] }));
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), /plans\.json \(changed\)[\s\S]*Finishing would lose those changes/);
    assert.equal(has(demo.dataDir, `backups/legacy-${done.id}.tar.gz`), false);
    assert.ok(has(demo.legacy, "decisions.json") && has(demo.legacy, "state/cursor-token.json"));
    assert.equal(record(demo.dataDir).status, "migrated");
  });

  test("no MIGRATION.json: a clear error", async () => {
    const demo = fresh();
    await assert.rejects(rollbackMigration("20300101T000000Z", demo.dataDir, { ...demo.where, now: steppingClock(), gate: recordingGate() }), /no migration recorded/);
  });
});

describe("a failed copy leaves nothing behind", { skip: process.getuid?.() === 0 ? "root ignores file permissions" : false }, () => {
  test("files already copied, the backup and the lock are removed; the plugin is resumed", async () => {
    const demo = fresh();
    // Folders the copy writes into before it reaches the top-level files, then a read-only data directory.
    mkdirSync(join(demo.dataDir, "backups"), { recursive: true });
    mkdirSync(join(demo.dataDir, "secrets"), { recursive: true });
    const gate = recordingGate({ onPause: () => chmodSync(demo.dataDir, 0o500), onResume: () => chmodSync(demo.dataDir, 0o755) });
    // Backups and secrets are already in place when the first top-level file (sorted: leader-activity.jsonl) fails.
    await assert.rejects(migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: steppingClock(), gate }), /EACCES[\s\S]*leader-activity\.jsonl/);
    assert.deepEqual(gate.calls, ["pause", "resume"]);
    assert.deepEqual(readdirSync(demo.dataDir).sort(), ["backups", "secrets"]);
    assert.deepEqual(readdirSync(join(demo.dataDir, "secrets")), []);
    assert.deepEqual(readdirSync(join(demo.dataDir, "backups")).filter((name) => name.startsWith("migration-")), []);
    assert.equal(has(demo.dataDir, "backups/legacy/config-20300101-000000.json"), false);
    assert.equal(chooseDataDir(demo.env, demo.home).source, "legacy", "the cockpit still reads the legacy directory");
  });
});

describe("hardening", () => {
  test("finish refuses when the data directory lost its marker files", async () => {
    const demo = fresh();
    const now = steppingClock();
    const { record: done } = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() });
    unlinkSync(join(demo.dataDir, "decisions.json"));
    unlinkSync(join(demo.dataDir, "plans.json"));
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), /decisions\.json is missing from the data directory; plans\.json is missing[\s\S]*Nothing was archived or deleted/);
    assert.ok(has(demo.legacy, "decisions.json"));
  });

  test("a record whose paths leave the layout is rejected before anything is deleted", async () => {
    const demo = fresh();
    const now = steppingClock();
    const { record: done } = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() });
    const tampered = { ...done, files: [...done.files, { ...done.files[0], from: "../outside.json", to: "../outside.json" }] };
    writeFileSync(join(demo.dataDir, MIGRATION_FILE), JSON.stringify(tampered));
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), /MIGRATION\.json is invalid \(files\.\d+: file paths do not follow the migration layout\)/);
    assert.ok(has(demo.legacy, "decisions.json"));
  });
});

describe("rollback lands on the legacy directory, or changes nothing", () => {
  const link = (demo: DemoHome) => join(demo.home, ".config", "fleet-roles");
  const pointLink = (demo: DemoHome, target: string) => {
    rmSync(link(demo));
    symlinkSync(target, link(demo));
  };
  async function migrated(demo: DemoHome) {
    return (await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: steppingClock(), gate: recordingGate() })).record;
  }
  /** Nothing moved: the data directory still holds the migrated state and the migration is still active. */
  function unchanged(demo: DemoHome, id: string) {
    assert.ok(has(demo.dataDir, "decisions.json") && has(demo.dataDir, "plans.json") && has(demo.dataDir, "secrets/cursor-token.json"));
    assert.equal(record(demo.dataDir).status, "migrated");
    assert.equal(has(demo.dataDir, `backups/rollback-${id}.json`), false, "no export left behind");
    assert.equal(has(demo.dataDir, ".migrate.lock"), false);
  }

  test("after the cutover (legacy link -> data directory) the link is pointed back and the cockpit reads the legacy data", async () => {
    const demo = fresh();
    const done = await migrated(demo);
    pointLink(demo, demo.dataDir);
    assert.equal(realpathSync(chooseDataDir(demo.env, demo.home).dir), demo.dataDir, "cut over: the cockpit reads the data directory");
    const gate = recordingGate({ reads: () => link(demo) });
    const result = await rollbackMigration(done.id, demo.dataDir, { ...demo.where, now: steppingClock(), gate });
    assert.deepEqual(gate.calls, ["pause", "resume"]);
    assert.equal(readlinkSync(link(demo)), demo.legacy);
    assert.deepEqual(result.record.rollback?.linkRestored, { path: link(demo), from: demo.dataDir, to: demo.legacy });
    const choice = chooseDataDir(demo.env, demo.home);
    assert.equal(choice.source, "legacy");
    assert.equal(realpathSync(choice.dir), demo.legacy);
    assert.deepEqual(JSON.parse(read(choice.dir, "decisions.json")).map((item: { id: string }) => item.id), DEMO_DECISIONS.map((item) => item.id), "the legacy decisions are what the cockpit sees");
    assert.match(result.notes.join("\n"), /pointed .*fleet-roles back at .*old-checkout[\s\S]*the restarted plugin reads/);
  });

  test("AFC_DATA_DIR pointing at the data directory: refused before the plugin is paused", async () => {
    const demo = fresh();
    const done = await migrated(demo);
    const gate = recordingGate();
    const env = { ...demo.env, AFC_DATA_DIR: demo.dataDir };
    await assert.rejects(rollbackMigration(done.id, demo.dataDir, { env, home: demo.home, now: steppingClock(), gate }), /AFC_DATA_DIR is set[\s\S]*Remove AFC_DATA_DIR from the environment Paseo runs with[\s\S]*Nothing was changed/);
    assert.deepEqual(gate.calls, []);
    unchanged(demo, done.id);
  });

  test("a legacy path that leads elsewhere, or is gone: refused before anything moves", async () => {
    const demo = fresh();
    const done = await migrated(demo);
    const elsewhere = join(demo.root, "elsewhere");
    mkdirSync(elsewhere);
    pointLink(demo, elsewhere);
    await assert.rejects(rollbackMigration(done.id, demo.dataDir, { ...demo.where, now: steppingClock(), gate: recordingGate() }), /leads to .*elsewhere, not .*old-checkout/);
    unchanged(demo, done.id);
    rmSync(link(demo));
    await assert.rejects(rollbackMigration(done.id, demo.dataDir, { ...demo.where, now: steppingClock(), gate: recordingGate() }), /does not exist\. Create it as a link/);
    unchanged(demo, done.id);
  });

  test("another data directory with state of its own comes first: refused", async () => {
    const demo = fresh();
    const custom = join(demo.root, "custom-data");
    const done = (await migrate({ from: demo.legacy, to: custom }, { env: { ...demo.env, AFC_DATA_DIR: custom }, home: demo.home, now: steppingClock(), gate: recordingGate() })).record;
    put(demo.dataDir, "plans.json", "{}");
    await assert.rejects(rollbackMigration(done.id, custom, { ...demo.where, now: steppingClock(), gate: recordingGate() }), /reads .*plugin-data\/agent-fleet-cockpit first/);
    assert.equal(record(custom).status, "migrated");
  });

  test("the restarted plugin reports another directory: the whole rollback is undone", async () => {
    const demo = fresh();
    const done = await migrated(demo);
    pointLink(demo, demo.dataDir);
    unlinkSync(join(demo.legacy, "sweep.log"));
    const gate = recordingGate({ reads: () => demo.dataDir });
    await assert.rejects(rollbackMigration(done.id, demo.dataDir, { ...demo.where, now: steppingClock(), gate }), /the restarted plugin reads .*plugin-data\/agent-fleet-cockpit, not .*old-checkout[\s\S]*rollback was undone/);
    assert.deepEqual(gate.calls, ["pause", "resume", "pause", "resume"]);
    unchanged(demo, done.id);
    assert.equal(readlinkSync(link(demo)), demo.dataDir, "the cutover link is as it was");
    assert.equal(realpathSync(chooseDataDir(demo.env, demo.home).dir), demo.dataDir);
    assert.equal(record(join(demo.dataDir, `backups/migration-${done.id}`)).status, "migrated");
  });

  test("a source without marker files cannot be fallen back to: everything is put back", async () => {
    const demo = fresh();
    for (const name of ["decisions.json", "plans.json"]) unlinkSync(join(demo.legacy, name));
    const done = (await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now: steppingClock(), gate: recordingGate() })).record;
    put(demo.dataDir, "plans.json", "{}");
    const gate = recordingGate();
    await assert.rejects(rollbackMigration(done.id, demo.dataDir, { ...demo.where, now: steppingClock(), gate }), /would read .*plugin-data\/agent-fleet-cockpit, not .*old-checkout; everything was put back/);
    assert.deepEqual(gate.calls, ["pause", "resume"]);
    assert.ok(has(demo.dataDir, "sweep.log") && has(demo.dataDir, "plans.json") && has(demo.dataDir, "secrets/cursor-token.json"));
    assert.equal(record(demo.dataDir).status, "migrated");
    assert.equal(has(demo.dataDir, `backups/rollback-${done.id}.json`), false);
  });
});

describe("finish refuses a data directory that cannot stand on its own", () => {
  async function migratedDemo() {
    const demo = fresh();
    const now = steppingClock();
    const done = (await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() })).record;
    return { demo, now, done };
  }
  function keptEverything(demo: DemoHome, id: string) {
    for (const rel of Object.keys(DEMO_FILES)) assert.ok(has(demo.legacy, rel), `${rel} kept in the legacy directory`);
    assert.equal(has(demo.dataDir, `backups/legacy-${id}.tar.gz`), false, "no archive");
    assert.equal(record(demo.dataDir).status, "migrated");
  }
  const cases: Array<[string, (dataDir: string) => void, RegExp]> = [
    ["only decisions.json missing", (dir) => unlinkSync(join(dir, "decisions.json")), /decisions\.json is missing from the data directory/],
    ["only plans.json missing", (dir) => unlinkSync(join(dir, "plans.json")), /plans\.json is missing from the data directory/],
    ["decisions.json corrupt", (dir) => writeFileSync(join(dir, "decisions.json"), "[{ broken"), /decisions\.json is not a valid list of decisions/],
    ["decisions.json shrank", (dir) => writeFileSync(join(dir, "decisions.json"), JSON.stringify([DEMO_DECISIONS[0]])), /decisions\.json has 1 items, fewer than the 2 copied at migration/],
    ["plans.json not an object", (dir) => writeFileSync(join(dir, "plans.json"), "[]"), /plans\.json is not a valid JSON object/],
  ];
  for (const [name, damage, expected] of cases) {
    test(name, async () => {
      const { demo, now, done } = await migratedDemo();
      damage(demo.dataDir);
      await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) }), (error: unknown) => error instanceof MigrationError && expected.test(error.message) && /Nothing was archived or deleted/.test(error.message));
      keptEverything(demo, done.id);
    });
  }

  test("more decisions than were copied is fine", async () => {
    const { demo, now, done } = await migratedDemo();
    writeFileSync(join(demo.dataDir, "decisions.json"), JSON.stringify([...DEMO_DECISIONS, { id: "d-demo-3", status: "open" }]));
    assert.equal((await finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(demo.where) })).record.status, "finished");
  });

  test("the cockpit reading another directory (AFC_DATA_DIR elsewhere): refused", async () => {
    const { demo, now, done } = await migratedDemo();
    const env = { ...demo.env, AFC_DATA_DIR: join(demo.root, "other-data") };
    await assert.rejects(finishMigration(done.id, demo.dataDir, { env, home: demo.home, now, gate: daemonGate(demo.where) }), /the cockpit reads .*other-data, not the data directory/);
    keptEverything(demo, done.id);
  });
});

describe("finish deletes nothing unless the plugin running in Paseo reads the data directory", () => {
  async function migratedDemo() {
    const demo = fresh();
    const now = steppingClock();
    const done = (await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: recordingGate() })).record;
    return { demo, now, done };
  }
  function keptEverything(demo: DemoHome, id: string) {
    for (const rel of Object.keys(DEMO_FILES)) assert.ok(has(demo.legacy, rel), `${rel} kept in the legacy directory`);
    assert.equal(has(demo.dataDir, `backups/legacy-${id}.tar.gz`), false, "no archive");
    assert.equal(record(demo.dataDir).status, "migrated");
    assert.equal(has(demo.dataDir, ".migrate.lock"), false);
  }
  const daemonReadingLegacy = (demo: DemoHome) => ({ env: { ...demo.env, AFC_DATA_DIR: demo.legacy }, home: demo.home });

  test("Paseo runs with AFC_DATA_DIR = the legacy directory, the shell has none: refused after the plugin restart", async () => {
    const { demo, now, done } = await migratedDemo();
    const gate = daemonGate(daemonReadingLegacy(demo));
    await assert.rejects(
      finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate }),
      /the plugin running in Paseo reads .*old-checkout \(the legacy directory, which finishing would empty\), not the data directory[\s\S]*remove AFC_DATA_DIR[\s\S]*Nothing was archived or deleted/,
    );
    assert.deepEqual(gate.calls, ["pause", "resume"], "the plugin was restarted once to report, then left running");
    keptEverything(demo, done.id);
  });

  test("a plugin on the legacy directory has also written there: the refusal names the reader, not the drift", async () => {
    const { demo, now, done } = await migratedDemo();
    writeFileSync(join(demo.legacy, "sweep.log"), "written by the plugin that still reads the legacy directory\n");
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(daemonReadingLegacy(demo)) }), (error: unknown) => error instanceof MigrationError && /legacy directory, which finishing would empty/.test(error.message) && !/changed after migration/.test(error.message));
    assert.equal(record(demo.dataDir).status, "migrated");
  });

  test("the same after the cutover link (legacy path -> data directory)", async () => {
    const { demo, now, done } = await migratedDemo();
    rmSync(join(demo.home, ".config", "fleet-roles"));
    symlinkSync(demo.dataDir, join(demo.home, ".config", "fleet-roles"));
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(daemonReadingLegacy(demo)) }), /reads .*old-checkout \(the legacy directory/);
    keptEverything(demo, done.id);
  });

  test("the plugin reads somewhere else entirely: refused", async () => {
    const { demo, now, done } = await migratedDemo();
    const elsewhere = { env: { ...demo.env, AFC_DATA_DIR: join(demo.root, "elsewhere") }, home: demo.home };
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(elsewhere) }), /reads .*elsewhere \(another directory\)/);
    keptEverything(demo, done.id);
  });

  test("no answer from the plugin log in time: refused", async () => {
    const { demo, now, done } = await migratedDemo();
    const gate = recordingGate({ reads: () => null });
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate }), /did not report its data directory in time[\s\S]*Nothing was archived or deleted/);
    keptEverything(demo, done.id);
  });

  test("a gate that cannot restart the plugin or cannot see its log: refused", async () => {
    const { demo, now, done } = await migratedDemo();
    const disabled = { pause: async () => ({ paused: false, note: "plugin agent-fleet-cockpit is disabled; left disabled" }), resume: async () => undefined, readsAfterResume: async () => demo.dataDir };
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: disabled }), /could not restart the plugin[\s\S]*left disabled[\s\S]*Nothing was archived or deleted/);
    await assert.rejects(finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate: recordingGate() }), /cannot see which directory the plugin running in Paseo reads/);
    keptEverything(demo, done.id);
  });

  test("the migrate step warned that the plugin still reads the legacy directory; finish cannot skip past it", async () => {
    const demo = fresh();
    const now = steppingClock();
    const daemon = daemonReadingLegacy(demo);
    const result = await migrate({ from: demo.legacy, to: demo.dataDir }, { ...demo.where, now, gate: daemonGate(daemon) });
    assert.match(result.notes.join("\n"), /WARNING: the restarted plugin reads .*old-checkout/);
    await assert.rejects(finishMigration(result.record.id, demo.dataDir, { ...demo.where, now, gate: daemonGate(daemon) }), /legacy directory, which finishing would empty/);
    keptEverything(demo, result.record.id);
  });

  test("normal case: the plugin reads the data directory, finish goes ahead and says so", async () => {
    const { demo, now, done } = await migratedDemo();
    const gate = daemonGate(demo.where);
    const result = await finishMigration(done.id, demo.dataDir, { ...demo.where, now, gate });
    assert.equal(result.record.status, "finished");
    assert.deepEqual(gate.calls, ["pause", "resume"]);
    assert.match(result.notes[0], /restarted the plugin in Paseo to check: it reads .*plugin-data\/agent-fleet-cockpit/);
  });
});
