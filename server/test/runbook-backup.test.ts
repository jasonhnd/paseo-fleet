import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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
