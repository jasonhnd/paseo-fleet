import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "node:test";
// @ts-expect-error Preparation is plain Node code without a TypeScript loader.
import { NODE_ENTRYPOINTS, preparePlugin } from "../prepare.mjs";

const roots: string[] = [];
const bundles = ["bin/roles.bundle.mjs", "bin/doctor.bundle.mjs", "bin/migrate.bundle.mjs", "bin/coupon.bundle.mjs", "bin/leader.bundle.mjs", "server/paseo-client.bundle.mjs"];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture(prepacked = true) {
  const root = mkdtempSync(join(tmpdir(), "afc-preparation-")); roots.push(root);
  for (const dir of ["bin", "server"]) mkdirSync(join(root, dir));
  if (prepacked) for (const file of bundles) writeFileSync(join(root, file), "");
  return root;
}

test("Git preparation installs locked development tools and generates every bundle", () => {
  const root = fixture(false);
  writeFileSync(join(root, "package-lock.json"), "{}");
  mkdirSync(join(root, "scripts"));
  for (const file of ["bin/build-daemon-client.mjs", "bin/build-commands.mjs", "scripts/build-cli.mjs"]) writeFileSync(join(root, file), "#!/usr/bin/env node\n");
  const calls: string[][] = [];
  preparePlugin(root, (command: string, args: string[], cwd: string) => {
    assert.equal(cwd, root); calls.push([command, ...args]);
    if (args[0] === "run") for (const file of bundles) writeFileSync(join(root, file), "");
  });
  assert.deepEqual(calls, [["npm", "ci", "--include=dev", "--ignore-scripts", "--no-audit", "--no-fund"], ["npm", "run", "build"]]);
});

test("prepacked npm artifacts install dependencies without invoking omitted build tools", () => {
  const calls: string[][] = [];
  preparePlugin(fixture(), (command: string, args: string[]) => calls.push([command, ...args]));
  assert.deepEqual(calls, [["npm", "install", "--include=dev", "--ignore-scripts", "--no-audit", "--no-fund"]]);
});

test("missing prepared bundles or incomplete builders refuse activation", () => {
  const root = fixture(false);
  assert.throws(() => preparePlugin(root, () => {}), /Missing prepared bundle/);
  writeFileSync(join(root, "bin/build-daemon-client.mjs"), "");
  assert.throws(() => preparePlugin(root, () => {}), /Incomplete source build tools/);
});

test("dependency failures stop before the source build", () => {
  let calls = 0;
  assert.throws(() => preparePlugin(fixture(), () => { calls++; throw new Error("dependency installation failed"); }), /dependency installation failed/);
  assert.equal(calls, 1);
});

test("preparation refuses an artifact missing the leader command", () => {
  const root = fixture();
  rmSync(join(root, "bin/leader.bundle.mjs"));
  assert.throws(() => preparePlugin(root, () => {}), /Missing prepared bundle: bin\/leader\.bundle\.mjs/);
});

test("source preparation requires the Fleet command registration builder", () => {
  const root = fixture();
  mkdirSync(join(root, "scripts"));
  for (const file of ["bin/build-daemon-client.mjs", "scripts/build-cli.mjs"]) writeFileSync(join(root, file), "");
  assert.throws(() => preparePlugin(root, () => {}), /Incomplete source build tools/);
});

test("the plain Node preparation entry runs through a symlink", () => {
  const root = fixture(); mkdirSync(join(root, "tools"));
  copyFileSync(new URL("../prepare.mjs", import.meta.url), join(root, "server/prepare.mjs"));
  writeFileSync(join(root, "tools/npm"), `#!${process.execPath}\nrequire("node:fs").writeFileSync("prepared", "yes");\n`, { mode: 0o755 });
  symlinkSync(root, join(root, "alias"), "dir");
  const result = spawnSync(process.execPath, [join(root, "alias/server/prepare.mjs")], {
    encoding: "utf8", env: { ...process.env, PATH: `${join(root, "tools")}${delimiter}${process.env.PATH}` },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(join(root, "prepared")));
});

test("preparation repairs executable modes after building and for prepacked artifacts", () => {
  for (const source of [false, true]) {
    const root = fixture();
    const files = source ? NODE_ENTRYPOINTS : NODE_ENTRYPOINTS.slice(0, 2);
    for (const file of files) writeFileSync(join(root, file), "#!/usr/bin/env node\n", { mode: 0o644 });
    if (source) {
      mkdirSync(join(root, "scripts"));
      writeFileSync(join(root, "scripts/build-cli.mjs"), "");
    }
    let built = !source;
    preparePlugin(root, (_command: string, args: string[]) => { if (args[0] === "run") built = true; }, (path: string, mode: number) => {
      assert.ok(built, "Modes must be repaired after the build");
      assert.equal(mode, 0o755);
      chmodSync(path, mode);
    });
    for (const file of files) {
      assert.equal(statSync(join(root, file)).mode & 0o777, 0o755);
      assert.equal(spawnSync(join(root, file)).status, 0);
    }
  }
});

test("invalid shebangs and chmod failures refuse activation", () => {
  const root = fixture();
  const entry = join(root, "bin/afc.mjs");
  writeFileSync(entry, "console.log('demo');\n");
  assert.throws(() => preparePlugin(root, () => {}), /Invalid Node entrypoint shebang/);
  writeFileSync(entry, "#!/usr/bin/env node\n");
  assert.throws(() => preparePlugin(root, () => {}, () => { throw new Error("demo chmod failure"); }), /Cannot make Node entrypoint executable/);
});

test("every direct Node entrypoint has its shebang and an executable Git index mode", () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const entries = readdirSync(join(root, "bin")).filter(file => file.endsWith(".mjs") && !file.endsWith(".bundle.mjs")
    && readFileSync(join(root, "bin", file), "utf8").startsWith("#!")).map(file => `bin/${file}`).sort();
  assert.deepEqual(entries, [...NODE_ENTRYPOINTS].sort());
  const result = spawnSync("git", ["ls-files", "-s", "--", ...entries], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const indexed = result.stdout.trim().split("\n");
  assert.equal(indexed.length, entries.length);
  for (const entry of entries) {
    assert.equal(readFileSync(join(root, entry), "utf8").split(/\r?\n/, 1)[0], "#!/usr/bin/env node");
    assert.ok(indexed.some(row => row.startsWith("100755 ") && row.endsWith(`\t${entry}`)), `${entry} must be executable in Git`);
  }
});
