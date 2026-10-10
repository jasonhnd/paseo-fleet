import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { afterEach, test } from "node:test";
// @ts-expect-error Preparation is plain Node code without a TypeScript loader.
import { preparePlugin } from "../prepare.mjs";

const roots: string[] = [];
const bundles = ["bin/roles.bundle.mjs", "bin/doctor.bundle.mjs", "bin/migrate.bundle.mjs", "bin/coupon.bundle.mjs", "server/paseo-client.bundle.mjs"];
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
  for (const file of ["bin/build-daemon-client.mjs", "scripts/build-cli.mjs"]) writeFileSync(join(root, file), "");
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
