// The pure parts of `afc migrate` (shared/migration.ts) and the tar.gz archive (server/tar.ts). Demo data only.
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, test } from "node:test";
import {
  copyRank,
  daysSince,
  decisionItems,
  diffDecisions,
  isLayoutTarget,
  isMigrationId,
  isTopLevelDataFile,
  migrationId,
  parseMigrationRecord,
  targetFor,
} from "../../shared/migration";
import { parseTar, readTarGz, tarHeader, writeTarGz } from "../tar";

const dirs: string[] = [];
after(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

describe("layout rule", () => {
  test("top-level state files keep their names; code-checkout files and our own record stay", () => {
    for (const name of ["decisions.json", "sweep.log", "leader-activity.jsonl", "plans.json"]) assert.equal(isTopLevelDataFile(name), true, name);
    for (const name of ["README.md", "package.json", "package-lock.json", "tsconfig.json", "MIGRATION.json", ".hidden.json", "notes.txt"]) assert.equal(isTopLevelDataFile(name), false, name);
  });

  test("state/ goes to secrets/, backups/ to backups/legacy/, the rest stays", () => {
    assert.deepEqual(targetFor("plans.json"), { to: "plans.json", kind: "data" });
    assert.deepEqual(targetFor("state/cursor-token.json"), { to: "secrets/cursor-token.json", kind: "secret" });
    assert.deepEqual(targetFor("backups/a/b.json"), { to: "backups/legacy/a/b.json", kind: "backup" });
    for (const path of ["state/deep/x.json", "docs/a.json", "README.md", "backups/.DS_Store", "../x.json", "a//b.json"]) assert.equal(targetFor(path), null, path);
  });

  test("layout targets in the data directory", () => {
    for (const path of ["decisions.json", "secrets/cursor-token.json", "backups/legacy/a/b.json"]) assert.equal(isLayoutTarget(path), true, path);
    for (const path of ["MIGRATION.json", "exports/cockpit.json", "backups/migration-x/files/a.json", "backups/config-1.json", "secrets/a/b"]) assert.equal(isLayoutTarget(path), false, path);
  });

  test("marker files are copied last, backups first", () => {
    const order = [
      { to: "plans.json", kind: "data" as const },
      { to: "sweep.log", kind: "data" as const },
      { to: "secrets/t.json", kind: "secret" as const },
      { to: "backups/legacy/c.json", kind: "backup" as const },
      { to: "decisions.json", kind: "data" as const },
    ].sort((a, b) => copyRank(a) - copyRank(b));
    assert.deepEqual(order.map((row) => row.to), ["backups/legacy/c.json", "secrets/t.json", "sweep.log", "plans.json", "decisions.json"]);
  });

  test("migration ids", () => {
    assert.equal(migrationId(new Date("2030-01-02T03:04:05.678Z")), "20300102T030405Z");
    assert.equal(isMigrationId("20300102T030405Z"), true);
    assert.equal(isMigrationId("2030-01-02"), false);
    assert.equal(daysSince("2030-01-01T00:00:00.000Z", Date.parse("2030-01-08T00:00:01.000Z")), 7);
    assert.equal(daysSince("2030-01-02T00:00:00.000Z", Date.parse("2030-01-01T00:00:00.000Z")), 0);
  });
});

describe("decisions.json diff", () => {
  test("added, changed and removed items by id", () => {
    const before = [{ id: "a", status: "open" }, { id: "b", status: "open" }, { id: "c" }];
    const after = [{ id: "a", status: "done" }, { id: "b", status: "open" }, { id: "d" }];
    const diff = diffDecisions(before, after);
    assert.deepEqual(diff.added, [{ id: "d" }]);
    assert.deepEqual(diff.changed, [{ before: { id: "a", status: "open" }, after: { id: "a", status: "done" } }]);
    assert.deepEqual(diff.removed, ["c"]);
  });

  test("only an array of objects counts as decisions", () => {
    assert.deepEqual(decisionItems([{ id: "a" }, 3, null]), [{ id: "a" }]);
    assert.equal(decisionItems({ items: [] }), null);
    assert.equal(decisionItems(null), null);
  });
});

describe("MIGRATION.json parsing", () => {
  test("bad JSON and wrong shapes are rejected with a reason", () => {
    const bad = parseMigrationRecord("{");
    assert.equal(bad.ok, false);
    assert.match(bad.ok ? "" : bad.reason, /bad JSON/);
    const wrong = parseMigrationRecord(JSON.stringify({ schema: "afc-migration/v1", id: "nope" }));
    assert.equal(wrong.ok, false);
  });
});

describe("tar.gz archive", () => {
  test("round trip with a long path, an empty file, binary data and modes", async () => {
    const dir = mkdtempSync(join(tmpdir(), "afc-tar-test-"));
    dirs.push(dir);
    const long = `backups/${"deep-folder-name/".repeat(6)}a-rather-long-demo-file-name-for-the-prefix-field.json`;
    const files = [
      { name: "plans.json", body: Buffer.from('{"plans":[]}') },
      { name: "empty.log", body: Buffer.alloc(0) },
      { name: "state/token.json", body: Buffer.from([0, 1, 2, 255, 254]) },
      { name: long, body: Buffer.alloc(1500, 7) },
    ];
    const inputs = files.map((file, index) => {
      const source = join(dir, `src-${index}`);
      writeFileSync(source, file.body);
      return { name: file.name, source, size: file.body.length, mode: file.name.startsWith("state/") ? 0o600 : 0o644, mtimeMs: Date.parse("2030-01-01T00:00:00Z") };
    });
    assert.ok(long.length > 100, "the long path needs the ustar prefix field");
    const archive = join(dir, "out.tar.gz");
    await writeTarGz(archive, inputs);
    const entries = await readTarGz(archive);
    assert.deepEqual(entries.map((entry) => entry.name), files.map((file) => file.name));
    entries.forEach((entry, index) => assert.ok(entry.data.equals(files[index].body), entry.name));
    assert.equal(entries[2].mode, 0o600);
    await assert.rejects(writeTarGz(archive, inputs), /EEXIST/, "an existing archive is never overwritten");
  });

  test("a corrupted header is detected", () => {
    const header = tarHeader({ name: "a.json", size: 0, mode: 0o644, mtimeMs: 0 });
    header[0] = "b".charCodeAt(0);
    assert.throws(() => parseTar(Buffer.concat([header, Buffer.alloc(1024)])), /checksum mismatch/);
  });

  test("a file that changed size while archiving fails the archive", async () => {
    const dir = mkdtempSync(join(tmpdir(), "afc-tar-test-"));
    dirs.push(dir);
    const source = join(dir, "src");
    writeFileSync(source, "12345");
    await assert.rejects(writeTarGz(join(dir, "x.tar.gz"), [{ name: "a", source, size: 3, mode: 0o644, mtimeMs: 0 }]), /grew while it was being archived/);
    await assert.rejects(writeTarGz(join(dir, "y.tar.gz"), [{ name: "a", source, size: 9, mode: 0o644, mtimeMs: 0 }]), /changed size/);
  });

  test("truncated data is detected", () => {
    const header = tarHeader({ name: "a.json", size: 600, mode: 0o644, mtimeMs: 0 });
    assert.throws(() => parseTar(Buffer.concat([header, Buffer.alloc(100)])), /truncated/);
  });
});
