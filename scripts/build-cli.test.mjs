import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildCli, ENTRIES } from "./build-cli.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const temps = [];
after(() => { for (const dir of temps) rmSync(dir, { recursive: true, force: true }); });
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "cli-bundle-test-")));
  temps.push(root);
  mkdirSync(join(root, "server"));
  return root;
}

test("an empty skeleton is allowed; a partial command set fails", async () => {
  const root = fixture();
  await buildCli(root);
  writeFileSync(join(root, "server/cli.ts"), "export {};\n");
  await assert.rejects(buildCli(root), /incomplete CLI source set/);
});

test("all routes run bundled TypeScript under Node with no node_modules", async () => {
  const root = fixture();
  writeFileSync(join(root, "server/helper.ts"), 'export const word: string = "ready";\n');
  for (const name of ENTRIES) writeFileSync(join(root, "server", `${name}.ts`), `
import { pathToFileURL } from "node:url";
import { word } from "./helper";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("${name}", word, ...process.argv.slice(2));
  if (process.argv.includes("--fail")) process.exitCode = 7;
}
`);
  await buildCli(root);
  for (const name of ENTRIES) {
    const out = spawnSync(process.execPath, [join(root, "bin", `${name}.bundle.mjs`), "--help"], { encoding: "utf8" });
    assert.equal(out.status, 0, out.stderr);
    assert.match(out.stdout, new RegExp(`${name} ready --help`));
  }
  if (!existsSync(join(ROOT, "bin/paseo-kanban.mjs"))) return;
  for (const name of ["paseo-kanban.mjs", "check-missing-cwd"]) copyFileSync(join(ROOT, "bin", name), join(root, "bin", name));
  assert.equal(existsSync(join(root, "node_modules")), false);
  const run = (bin, ...args) => spawnSync(process.execPath, [join(root, "bin", bin), ...args], { encoding: "utf8" });
  assert.match(run("paseo-kanban.mjs", "--help").stdout, /cli ready --help/);
  assert.match(run("paseo-kanban.mjs", "decide", "--help").stdout, /local-decisions ready --help/);
  assert.match(run("paseo-kanban.mjs", "migrate", "--help").stdout, /migrate ready --help/);
  assert.match(run("check-missing-cwd", "--json").stdout, /check-missing-cwd ready --json/);
  assert.match(run("check-missing-cwd", "--help").stdout, /Usage: check-missing-cwd/);
  assert.equal(run("paseo-kanban.mjs", "--fail").status, 7);
  assert.doesNotMatch(readFileSync(join(root, "bin/cli.bundle.mjs"), "utf8"), /from ["']\.\/helper/);
});

test("a failed build writes no partial command bundles", async () => {
  const root = fixture();
  for (const name of ENTRIES) writeFileSync(join(root, "server", `${name}.ts`), name === "migrate" ? 'import "./missing";\n' : 'export {};\n');
  await assert.rejects(buildCli(root));
  assert.equal(existsSync(join(root, "bin/cli.bundle.mjs")), false);
});
