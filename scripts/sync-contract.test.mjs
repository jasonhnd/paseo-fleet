// Tests for sync-contract.mjs, on a throwaway repository layout.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, beforeEach, test } from "node:test";
import { parseArgs, pluginPackages, syncContract } from "./sync-contract.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "sync-contract.mjs");
const temps = [];
let root;

async function put(file, text) {
  const path = join(root, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text, "utf8");
}
const run = (...args) => spawnSync(process.execPath, [SCRIPT, "--root", root, ...args], { encoding: "utf8" });

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "sync-contract-"));
  temps.push(root);
  await put("packages/contract/package.json", "{}\n");
  await put("packages/alpha/paseo-plugin.json", "{}\n");
  await put("packages/beta/paseo-plugin.json", "{}\n");
  await put("packages/not-a-plugin/package.json", "{}\n");
});

after(async () => {
  for (const dir of temps) await rm(dir, { recursive: true, force: true });
});

test("arguments", () => {
  assert.equal(parseArgs(["--check"]).check, true);
  assert.equal(parseArgs(["--root", "/x"]).root, "/x");
  assert.throws(() => parseArgs(["--root"]));
  assert.throws(() => parseArgs(["extra"]), /unknown argument/);
});

test("plugin packages are the folders with a paseo-plugin.json", async () => {
  assert.deepEqual(await pluginPackages(root), ["packages/alpha", "packages/beta"]);
});

test("an empty contract with no copies is in sync (skeleton)", () => {
  const out = run("--check");
  assert.equal(out.status, 0, out.stdout + out.stderr);
  assert.match(out.stdout, /contract in sync \(0 contract file\(s\), 2 plugin package\(s\)\)/);
});

test("--check lists differences in both halves and writes nothing", async () => {
  await put("packages/contract/src/shared/schema.ts", "export const A = 1;\n");
  await put("packages/contract/src/server/io.ts", "// io\n");
  await put("packages/alpha/shared/contract/schema.ts", "export const A = 0;\n");
  await put("packages/alpha/shared/contract/old.ts", "// stale\n");
  await put("packages/alpha/server/contract/io.ts", "// io\n");
  const out = run("--check");
  assert.equal(out.status, 1);
  assert.match(out.stdout, /changed {2}packages\/alpha\/shared\/contract\/schema\.ts/);
  assert.match(out.stdout, /extra {4}packages\/alpha\/shared\/contract\/old\.ts/);
  assert.match(out.stdout, /missing {2}packages\/beta\/server\/contract\/io\.ts/);
  assert.doesNotMatch(out.stdout, /alpha\/server\/contract\/io\.ts/);
  assert.equal(await readFile(join(root, "packages/alpha/shared/contract/schema.ts"), "utf8"), "export const A = 0;\n");
});

test("sync mirrors the source into every plugin, then --check passes", async () => {
  await put("packages/contract/src/shared/schema.ts", "export const A = 1;\n");
  await put("packages/contract/src/server/nested/paths.ts", "// paths\n");
  await put("packages/contract/test/schema.test.ts", "// not copied\n");
  await put("packages/beta/shared/contract/old.ts", "// stale\n");
  const diff = await syncContract({ root, check: false });
  assert.equal(diff.sourceCount, 2);
  for (const plugin of ["alpha", "beta"]) {
    assert.equal(await readFile(join(root, `packages/${plugin}/shared/contract/schema.ts`), "utf8"), "export const A = 1;\n");
    assert.equal(await readFile(join(root, `packages/${plugin}/server/contract/nested/paths.ts`), "utf8"), "// paths\n");
  }
  await assert.rejects(readFile(join(root, "packages/beta/shared/contract/old.ts")));
  await assert.rejects(readFile(join(root, "packages/alpha/shared/contract/schema.test.ts")));
  assert.equal(run("--check").status, 0);
});

test("an empty source never deletes existing copies", async () => {
  await put("packages/alpha/shared/contract/schema.ts", "// copy\n");
  assert.equal(run("--check").status, 1);
  const out = run();
  assert.equal(out.status, 2);
  assert.match(out.stderr, /refusing to delete/);
  assert.equal(await readFile(join(root, "packages/alpha/shared/contract/schema.ts"), "utf8"), "// copy\n");
});
