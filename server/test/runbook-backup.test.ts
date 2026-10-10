import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Execute only the documented backup fragment against CLI-shaped fixtures, without a daemon.
const document = readFileSync(new URL("../../docs/GIT-INSTALL.md", import.meta.url), "utf8");
const fragment = document.match(/node --input-type=module <<'NODE'\n([\s\S]*?)\nNODE/);
assert.ok(fragment, "The runbook must contain its backup fragment");

function backup(plugin: Record<string, unknown>) {
  const root = mkdtempSync(join(tmpdir(), "afc-runbook-"));
  const home = join(root, "home"), destination = join(root, "backup"), shims = join(root, "commands");
  for (const dir of [home, destination, shims]) mkdirSync(dir);
  writeFileSync(join(home, "config.json"), JSON.stringify({ pluginsEnabled: true }));
  writeFileSync(join(destination, "plugin-before.json"), JSON.stringify([plugin]));
  writeFileSync(join(shims, "afc"), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  return {
    root, destination,
    run: () => execFileSync(process.execPath, ["--input-type=module"], {
      input: fragment![1], encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PASEO_HOME: home, AFC_BACKUP: destination, AFC_SHIM_DIR: shims },
    }),
  };
}

test("the runbook backs up a directory list item with no source field", () => {
  const fixture = backup({ id: "agent-fleet-cockpit", enabled: false, path: "/display-path",
    installation: { identity: { kind: "directory", path: "/original-checkout" } } });
  try {
    fixture.run();
    assert.deepEqual(JSON.parse(readFileSync(join(fixture.destination, "state.json"), "utf8")), {
      oldDirectory: "/original-checkout", enabled: false, pluginsEnabled: true,
      shims: { afc: true, roles: false },
    });
    assert.equal(readFileSync(join(fixture.destination, "shims/afc"), "utf8"), "#!/bin/sh\nexit 0\n");
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});

test("the runbook falls back to the path only when installation identity is absent", () => {
  const fixture = backup({ id: "agent-fleet-cockpit", enabled: true, path: "/legacy-checkout" });
  try {
    fixture.run();
    assert.equal(JSON.parse(readFileSync(join(fixture.destination, "state.json"), "utf8")).oldDirectory, "/legacy-checkout");
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});

test("the runbook refuses Git identity before saving rollback state", () => {
  const fixture = backup({ id: "agent-fleet-cockpit", enabled: true, source: "git", path: "/managed-checkout",
    installation: { identity: { kind: "git", remote: "file:///example/repository" } } });
  try {
    assert.throws(fixture.run, /Expected the old directory source/);
    assert.equal(existsSync(join(fixture.destination, "state.json")), false);
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});


const translations = [document,
  readFileSync(new URL("../../docs/zh-CN/GIT-INSTALL.md", import.meta.url), "utf8")];
const commandBlocks = (text: string) => [...text.matchAll(/```sh\n([\s\S]*?)```/g)].map(match => match[1]);

test("both runbooks have identical POSIX shell blocks and poll after switch and rollback", () => {
  assert.deepEqual(commandBlocks(translations[0]), commandBlocks(translations[1]));
  for (const text of translations) {
    const blocks = commandBlocks(text);
    assert.equal(blocks.length, 2);
    for (const block of blocks) {
      execFileSync("sh", ["-n"], { input: block, stdio: "pipe" });
      assert.match(block, /afc_restore\nafc_wait/);
    }
  }
});

function poll(statuses: unknown[], enabled = true, pluginsEnabled = true) {
  const root = mkdtempSync(join(tmpdir(), "afc-runbook-poll-"));
  writeFileSync(join(root, "state.json"), JSON.stringify({ enabled, pluginsEnabled }));
  writeFileSync(join(root, "sequence.json"), JSON.stringify(statuses));
  writeFileSync(join(root, "mock-cli.mjs"), `
import fs from "node:fs";
const dir = process.env.AFC_BACKUP;
const file = dir + "/calls.json";
const calls = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : { ls: 0, logs: 0 };
const command = process.argv[3];
if (command === "ls") {
  const sequence = JSON.parse(fs.readFileSync(dir + "/sequence.json"));
  const value = sequence[Math.min(calls.ls, sequence.length - 1)];
  calls.ls++;
  fs.writeFileSync(file, JSON.stringify(calls));
  if (value === "cli-error") process.exit(1);
  console.log(value === "invalid-json" ? "invalid" : JSON.stringify(value));
} else if (command === "logs") {
  calls.logs++;
  fs.writeFileSync(file, JSON.stringify(calls));
  console.log(JSON.stringify({ logs: [] }));
} else throw new Error("Unexpected CLI command");
`);
  const wait = document.match(/afc_wait\(\) \{\n[\s\S]*?\n\}/);
  assert.ok(wait);
  // Replace only the CLI and delay: exercise the actual documented function offline.
  const shell = `set -eu
p() { node "$AFC_BACKUP/mock-cli.mjs" "$@"; }
sleep() { [ "$1" = 2 ]; }
${wait[0]}
afc_wait
echo completed
`;
  try {
    const result = spawnSync("sh", [], { input: shell, encoding: "utf8",
      env: { ...process.env, AFC_BACKUP: root } });
    assert.ifError(result.error);
    return { result, calls: JSON.parse(readFileSync(join(root, "calls.json"), "utf8")) };
  } finally { rmSync(root, { recursive: true, force: true }); }
}

const running = { id: "agent-fleet-cockpit", status: "running" };
const failed = { id: "agent-fleet-cockpit", status: "failed" };
const disabled = { id: "agent-fleet-cockpit", status: "disabled" };

test("polling waits through transient failed and starting array listings", () => {
  const { result, calls } = poll([[{ id: "other", status: "running" }, failed],
    [{ ...running, status: "starting" }], [running]]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls, { ls: 3, logs: 1 });
  assert.match(result.stdout, /completed/);
});

test("polling expects disabled when either saved switch is off", () => {
  for (const [enabled, global] of [[false, true], [true, false], [false, false]]) {
    const { result, calls } = poll([failed, disabled], enabled, global);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(calls, { ls: 2, logs: 1 });
  }
});

test("polling tolerates unavailable or malformed listings until running", () => {
  const { result, calls } = poll(["cli-error", "invalid-json", [], {}, running]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls, { ls: 5, logs: 1 });
});

test("polling checks logs and fails only after all 60-second retries", () => {
  for (const status of [failed, disabled, "cli-error", "invalid-json"]) {
    const { result, calls } = poll([status]);
    assert.equal(result.status, 1);
    assert.deepEqual(calls, { ls: 31, logs: 1 });
    assert.match(result.stderr, /within 60 seconds/);
    assert.doesNotMatch(result.stdout, /completed/);
  }
});
