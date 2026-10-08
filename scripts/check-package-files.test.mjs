// Tests for check-package-files.mjs: the whitelist rules, and a real npm pack on a throwaway workspace.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkFiles, packResultFiles, workspaceDirs } from "./check-package-files.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "check-package-files.mjs");
const BASE = ["LICENSE", "OVERVIEW.md", "package.json", "paseo-plugin.json"];
const temps = [];
after(() => {
  for (const dir of temps) rmSync(dir, { recursive: true, force: true });
});

describe("rules", () => {
  test("an empty plugin package passes", () => {
    assert.deepEqual(checkFiles(BASE, {}), []);
  });

  test("whitelisted plugin files pass", () => {
    const files = [...BASE, "README.md", "index.client.tsx", "index.server.ts", "client/board.tsx", "server/rpc.ts", "shared/i18n.ts",
      "locales/en.json", "locales/zh-CN.json", "shared/locales/en.json", "shared/locales/zh-CN.json", "bin/tool.mjs", "assets/icon.png", "examples/plans.example.json"];
    assert.deepEqual(checkFiles(files, { icon: "assets/icon.png" }), []);
  });

  test("anything else is refused", () => {
    const refused = (file) => checkFiles([...BASE, file], {});
    assert.match(refused("tsconfig.json")[0], /not in the whitelist/);
    assert.match(refused("test/a.test.ts")[0], /not in the whitelist/);
    assert.match(refused("server/a.test.ts")[0], /tests, fixtures/);
    assert.match(refused("server/__fixtures__/x.ts")[0], /tests, fixtures/);
    assert.match(refused("client/board.js.map")[0], /source maps/);
    assert.match(refused("server/state.json")[0], /JSON data files/);
    assert.ok(refused("examples/plans.json").some((p) => /forbidden by/.test(p)));
    assert.ok(refused("server/cache.db").some((p) => /forbidden by/.test(p)));
  });

  test("manifest files and files named in paseo-plugin.json must be packed", () => {
    assert.deepEqual(checkFiles(["package.json", "paseo-plugin.json"], {}), ["OVERVIEW.md: missing from the package", "LICENSE: missing from the package"]);
    assert.deepEqual(checkFiles(BASE, { icon: "assets/icon.png", media: ["./assets/shot.png"] }), [
      "assets/icon.png: named in paseo-plugin.json but not in the package",
      "./assets/shot.png: named in paseo-plugin.json but not in the package",
    ]);
  });

  test("npm pack --json output from npm 10 and npm 11+", () => {
    const files = [{ path: "b" }, { path: "a" }];
    assert.deepEqual(packResultFiles([{ files }]), ["a", "b"]);
    assert.deepEqual(packResultFiles({ "@demo/x": { files } }), ["a", "b"]);
    assert.throws(() => packResultFiles([]));
  });
});

describe("command line", () => {
  function workspace(extra = {}) {
    const root = mkdtempSync(join(tmpdir(), "check-package-files-"));
    temps.push(root);
    const files = {
      "package.json": JSON.stringify({ name: "demo-root", private: true, workspaces: ["packages/*"] }),
      "packages/internal/package.json": JSON.stringify({ name: "demo-internal", private: true, version: "0.0.0" }),
      "packages/plugin/package.json": JSON.stringify({ name: "@demo/plugin", version: "0.1.0", license: "MIT", files: ["paseo-plugin.json", "OVERVIEW.md", "LICENSE", "server/", "!**/*.test.ts"] }),
      "packages/plugin/paseo-plugin.json": JSON.stringify({ id: "demo-plugin" }),
      "packages/plugin/OVERVIEW.md": "# Demo\n",
      "packages/plugin/LICENSE": "MIT\n",
      "packages/plugin/server/a.ts": "export {};\n",
      "packages/plugin/server/a.test.ts": "// excluded by files\n",
      ...extra,
    };
    for (const [path, body] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), body);
    }
    return root;
  }
  const cli = (root, ...args) => spawnSync(process.execPath, [SCRIPT, "--root", root, ...args], { encoding: "utf8" });

  test("workspace folders come from the root package.json", () => {
    assert.deepEqual(workspaceDirs(workspace()), ["packages/internal", "packages/plugin"]);
  });

  test("a clean package passes and --print lists its files", () => {
    const out = cli(workspace(), "--print");
    assert.equal(out.status, 0, out.stdout + out.stderr);
    assert.match(out.stdout, /packages\/internal: private, not published/);
    assert.match(out.stdout, /packages\/plugin \(@demo\/plugin\): 5 file\(s\), 0 problem\(s\)/);
    assert.match(out.stdout, /^ {2}server\/a\.ts$/m);
    assert.doesNotMatch(out.stdout, /a\.test\.ts/);
  });

  test("a file the whitelist does not know fails the check", () => {
    const root = workspace({ "packages/plugin/server/state.json": "{}\n" });
    const out = cli(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /refused: server\/state\.json: JSON data files/);
  });
});
