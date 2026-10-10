// `afc migrate` command line: arguments, the Paseo pause through a fake runner, and the printed report.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { after, describe, test } from "node:test";
import { MigrationError } from "../migrate";
import { EXIT, formatBytes, latestDataDirLog, parseMigrateArgs, paseoGate, pathHints, type RunResult, runMigrateCli, UsageError } from "../migrate-cli";
import { daemonGate, type DemoHome, demoHome, recordingGate, steppingClock } from "./migrate-fixtures";

const homes: DemoHome[] = [];
after(() => {
  for (const demo of homes) demo.cleanup();
});

describe("arguments", () => {
  test("the three modes", () => {
    assert.deepEqual(parseMigrateArgs(["--from", "~/old", "--dry-run"], "/home/example"), { mode: "migrate", from: "/home/example/old", to: null, dryRun: true, pause: true });
    assert.deepEqual(parseMigrateArgs(["--from=/a", "--to=/b", "--no-pause"], "/h"), { mode: "migrate", from: "/a", to: "/b", dryRun: false, pause: false });
    assert.deepEqual(parseMigrateArgs(["--rollback", "20300101T000000Z"], "/h"), { mode: "rollback", id: "20300101T000000Z", to: null, pause: true });
    assert.deepEqual(parseMigrateArgs(["--finish", "20300101T000000Z", "--to", "/d"], "/h"), { mode: "finish", id: "20300101T000000Z", to: "/d" });
    assert.deepEqual(parseMigrateArgs(["--help"], "/h"), { mode: "help" });
  });

  test("bad combinations are usage errors", () => {
    const bad = [[], ["--from"], ["--from", "/a", "--finish", "20300101T000000Z"], ["--rollback", "yesterday"], ["--finish", "20300101T000000Z", "--dry-run"], ["--finish", "20300101T000000Z", "--no-pause"], ["--from", "/a", "--from", "/b"], ["--force"], ["extra"]];
    for (const argv of bad) assert.throws(() => parseMigrateArgs(argv, "/h"), UsageError, argv.join(" "));
  });

  test("sizes", () => {
    assert.equal(formatBytes(12), "12 B");
    assert.equal(formatBytes(2048), "2.0 KB");
    assert.equal(formatBytes(3 * 1024 * 1024), "3.0 MB");
  });
});

describe("pausing the plugin through paseo", () => {
  const ok = (stdout = ""): RunResult => ({ ok: true, stdout, error: null });
  const fakeRun = (listing: RunResult) => {
    const calls: string[] = [];
    const run = async (cmd: string, args: string[]) => {
      calls.push([cmd, ...args].join(" "));
      return args[1] === "ls" ? listing : ok();
    };
    return { calls, run };
  };
  const env = { PASEO_HOME: "/demo/paseo-home", AFC_PASEO_BIN: "/demo/bin/paseo" };

  test("an enabled plugin is disabled, then enabled, in the daemon that owns PASEO_HOME", async () => {
    const fake = fakeRun(ok(JSON.stringify([{ id: "agent-fleet-cockpit", enabled: true, status: "running" }])));
    const gate = paseoGate(env, "/h", fake.run);
    assert.deepEqual(await gate.pause(), { paused: true, note: "plugin agent-fleet-cockpit paused while files moved" });
    await gate.resume();
    assert.deepEqual(fake.calls, [
      "/demo/bin/paseo plugin ls --json --home /demo/paseo-home",
      "/demo/bin/paseo plugin disable agent-fleet-cockpit --home /demo/paseo-home",
      "/demo/bin/paseo plugin enable agent-fleet-cockpit --home /demo/paseo-home",
    ]);
  });

  test("not installed or already disabled: nothing is toggled", async () => {
    const missing = fakeRun(ok("[]"));
    assert.equal((await paseoGate(env, "/h", missing.run).pause()).paused, false);
    const disabled = fakeRun(ok(JSON.stringify([{ id: "agent-fleet-cockpit", enabled: false }])));
    assert.match((await paseoGate(env, "/h", disabled.run).pause()).note, /left disabled/);
    assert.equal(disabled.calls.length, 1);
  });

  test("after a resume, the data directory the restarted plugin logged", async () => {
    const since = new Date("2030-01-01T00:00:10.000Z");
    const log = (at: string, message: string) => ({ timestamp: at, stream: "stdout", sequence: 1, message });
    const rows = [
      log("2030-01-01T00:00:05.000Z", "[afc] data dir: /demo/old-run"),
      log("2030-01-01T00:00:11.000Z", "[paseo] Loading plugin"),
      log("2030-01-01T00:00:12.000Z", "[afc] data dir: using the legacy state directory (not migrated yet): /demo/legacy; after migration it will be /demo/data"),
    ];
    assert.equal(latestDataDirLog(JSON.stringify(rows), since), "/demo/legacy");
    assert.equal(latestDataDirLog(JSON.stringify(rows.slice(0, 2)), since), null, "lines from before the resume do not count");
    assert.equal(latestDataDirLog("not json", since), null);
    // The gate polls the log until the line appears, then gives up after the wait.
    let polls = 0;
    const run = async (_cmd: string, args: string[]) => {
      if (args[1] !== "logs") return ok();
      polls += 1;
      return ok(JSON.stringify(polls < 3 ? rows.slice(0, 2) : rows));
    };
    const gate = paseoGate(env, "/h", run, { wait: { timeoutMs: 5000, pollMs: 1000 }, pause: async () => undefined });
    assert.equal(await gate.readsAfterResume?.(since), "/demo/legacy");
    assert.equal(polls, 3);
    const silent = paseoGate(env, "/h", async () => ok("[]"), { wait: { timeoutMs: 2000, pollMs: 1000 }, pause: async () => undefined });
    assert.equal(await silent.readsAfterResume?.(since), null);
  });

  test("Paseo unreachable: refuse, and say how to go on", async () => {
    const down = fakeRun({ ok: false, stdout: "", error: "connect ECONNREFUSED" });
    await assert.rejects(paseoGate(env, "/h", down.run).pause(), (error: unknown) => error instanceof MigrationError && /--no-pause/.test(error.message));
  });
});

describe("runMigrateCli", () => {
  function capture() {
    const out: string[] = [];
    const err: string[] = [];
    return { out, err, io: { out: (line: string) => out.push(line), err: (line: string) => err.push(line) } };
  }

  test("dry run, migrate, rollback, migrate, finish with the default data directory", async () => {
    const demo = demoHome();
    homes.push(demo);
    const base = { env: demo.env, home: demo.home, now: steppingClock(), gate: daemonGate(demo.where) };
    const from = join(demo.home, ".config", "fleet-roles");

    const dry = capture();
    assert.equal(await runMigrateCli(["--from", from, "--dry-run"], { ...base, ...dry.io }), EXIT.ok);
    assert.match(dry.out.join("\n"), /Dry run: nothing was changed[\s\S]*copy {2}state\/cursor-token\.json -> secrets\/cursor-token\.json[\s\S]*Ready: run the same command without --dry-run/);
    assert.equal(existsSync(demo.dataDir), false);

    const first = capture();
    assert.equal(await runMigrateCli(["--from", from], { ...base, ...first.io }), EXIT.ok, first.err.join("\n"));
    assert.match(first.out[0], /^Migrated 20300101T000000Z: 8 file\(s\)/);
    assert.ok(existsSync(join(demo.dataDir, "MIGRATION.json")));

    const blocked = capture();
    assert.equal(await runMigrateCli(["--from", from, "--dry-run"], { ...base, ...blocked.io }), EXIT.failed);
    assert.match(blocked.out.join("\n"), /Cannot migrate yet:[\s\S]*still active/);

    const back = capture();
    assert.equal(await runMigrateCli(["--rollback", "20300101T000000Z"], { ...base, ...back.io }), EXIT.ok, back.err.join("\n"));
    assert.match(back.out.join("\n"), /Rolled back 20300101T000000Z[\s\S]*moved aside: 8 file\(s\)/);
    assert.match(back.out.join("\n"), /the cockpit uses .*old-checkout again/);

    const second = capture();
    assert.equal(await runMigrateCli(["--from", from], { ...base, ...second.io }), EXIT.ok, second.err.join("\n"));
    const id = /^Migrated (\S+):/.exec(second.out[0])?.[1] ?? "";

    const done = capture();
    assert.equal(await runMigrateCli(["--finish", id], { ...base, ...done.io }), EXIT.ok, done.err.join("\n"));
    assert.match(done.out[0], new RegExp(`^Finished ${id}: 8 legacy file\\(s\\) archived`));
    assert.equal(JSON.parse(readFileSync(join(demo.dataDir, "MIGRATION.json"), "utf8")).status, "finished");
  });

  test("refusals exit 1 with the reason; bad arguments exit 2 with the usage", async () => {
    const demo = demoHome();
    homes.push(demo);
    const refused = capture();
    assert.equal(await runMigrateCli(["--finish", "20300101T000000Z"], { env: demo.env, home: demo.home, ...refused.io }), EXIT.failed);
    assert.match(refused.err.join("\n"), /^afc migrate: no migration recorded/);
    const usage = capture();
    assert.equal(await runMigrateCli(["--to", "/x"], { env: demo.env, home: demo.home, ...usage.io }), EXIT.usage);
    assert.match(usage.err.join("\n"), /give --from, --rollback or --finish[\s\S]*usage:/);
  });

  test("path hints: the legacy link, and a --to the cockpit does not read", () => {
    const demo = demoHome();
    homes.push(demo);
    mkdirSync(demo.dataDir, { recursive: true });
    const record = { from: demo.legacy, to: demo.dataDir };
    // The legacy path still points at the old directory (it does in the demo).
    assert.match(pathHints(demo.env, demo.home, record, "migrated").join("\n"), /fleet-roles still points at the legacy directory/);
    assert.match(pathHints(demo.env, demo.home, record, "finished").join("\n"), /will not find them any more/);
    // A --to elsewhere, without AFC_DATA_DIR: the cockpit would not use it.
    const elsewhere = join(demo.root, "elsewhere");
    mkdirSync(elsewhere);
    assert.match(pathHints(demo.env, demo.home, { from: demo.legacy, to: elsewhere }, "migrated").join("\n"), /set AFC_DATA_DIR=.*elsewhere/);
    // Once the legacy path points at the data directory (the cutover), there is nothing to say.
    const link = join(demo.home, ".config", "fleet-roles");
    rmSync(link);
    symlinkSync(demo.dataDir, link);
    assert.deepEqual(pathHints(demo.env, demo.home, record, "migrated"), []);
  });

  test("AFC_DATA_DIR is the default target; a rollback under it is refused before anything moves", async () => {
    const demo = demoHome();
    homes.push(demo);
    const custom = join(demo.root, "custom-data");
    const env = { ...demo.env, AFC_DATA_DIR: custom };
    const gate = recordingGate();
    const base = { env, home: demo.home, now: steppingClock(), gate };
    const first = capture();
    assert.equal(await runMigrateCli(["--from", demo.legacy], { ...base, ...first.io }), EXIT.ok, first.err.join("\n"));
    assert.ok(existsSync(join(custom, "decisions.json")));
    const back = capture();
    assert.equal(await runMigrateCli(["--rollback", "20300101T000000Z"], { ...base, ...back.io }), EXIT.failed);
    assert.match(back.err.join("\n"), /AFC_DATA_DIR is set[\s\S]*Remove AFC_DATA_DIR[\s\S]*Nothing was changed/);
    assert.deepEqual(gate.calls, ["pause", "resume"], "only the migrate paused the plugin");
    assert.ok(existsSync(join(custom, "decisions.json")) && existsSync(join(custom, "plans.json")));
    assert.equal(JSON.parse(readFileSync(join(custom, "MIGRATION.json"), "utf8")).status, "migrated");
  });
});
