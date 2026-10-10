import assert from "node:assert/strict";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { build } from "esbuild";
import { runtimePluginDir } from "../runtime-location";
// @ts-expect-error Preparation is plain Node code.
import { preparePlugin } from "../prepare.mjs";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(import.meta.url);
function put(file: string, text: string, mode = 0o644) {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, text, { mode });
}

test("ESM sources and bundled commands locate their own package", () => {
  for (const file of ["server/paths.ts", "bin/roles.bundle.mjs", "index.server.ts"]) {
    assert.equal(runtimePluginDir({}, "/demo", pathToFileURL(join(root, file)).href), root);
  }
});

test("preparation stamps survive staging relocation and distinguish repeated preparations", () => {
  const home = mkdtempSync(join(tmpdir(), "afc-relocation-"));
  try {
    const staging = join(home, "plugins/.staging/candidate/checkout");
    const bundles = ["bin/roles.bundle.mjs", "bin/doctor.bundle.mjs", "bin/migrate.bundle.mjs",
      "bin/coupon.bundle.mjs", "bin/leader.bundle.mjs", "server/paseo-client.bundle.mjs"];
    for (const file of bundles) put(join(staging, file), "");
    preparePlugin(staging, () => {});
    const readIdentity = (dir: string) => JSON.parse(readFileSync(join(dir, "server/install-identity.mjs"), "utf8").match(/= (.+);/)![1]);
    const identity = readIdentity(staging);
    assert.equal(identity.relativeDir, "checkout");
    const installed = join(home, "plugins/agent-fleet-cockpit/new-version");
    mkdirSync(join(installed, ".."), { recursive: true });
    renameSync(join(staging, ".."), installed);
    // Explicitly emulate the host's cleared module URL.
    assert.equal(runtimePluginDir({ PASEO_HOME: home }, home, "", identity), join(installed, "checkout"));
    preparePlugin(join(installed, "checkout"), () => {});
    assert.notEqual(readIdentity(join(installed, "checkout")).id, identity.id);
    assert.equal(runtimePluginDir({ PASEO_HOME: home }, home, "", identity), null);
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test("host CJS publication and roles use the new instance while config still names the removed version", async () => {
  const home = mkdtempSync(join(tmpdir(), "afc-upgrade-path-"));
  const previous = { AFC_DATA_DIR: process.env.AFC_DATA_DIR, PASEO_HOME: process.env.PASEO_HOME, AFC_HOME: process.env.AFC_HOME };
  const warnings: string[] = [];
  const warn = console.warn;
  try {
    const old = join(home, "plugins/agent-fleet-cockpit/old/checkout");
    const current = join(home, "plugins/agent-fleet-cockpit/current/checkout");
    const identity = { id: "demo-current-instance", relativeDir: "checkout" };
    const stamp = `export const installIdentity = ${JSON.stringify(identity)};\n`;
    put(join(current, "server/install-identity.mjs"), stamp);
    put(join(current, "package.json"), '{"version":"1.2.3"}');
    put(join(current, "bin/afc.mjs"), "#!/usr/bin/env node\n", 0o755);
    put(join(current, "bin/roles.mjs"), "#!/usr/bin/env node\n", 0o755);
    put(join(home, "config.json"), JSON.stringify({ plugins: { "agent-fleet-cockpit": { path: old } } }));
    process.env.AFC_DATA_DIR = join(home, "data");
    process.env.PASEO_HOME = home;
    process.env.AFC_HOME = old;
    console.warn = (...args) => warnings.push(args.join(" "));
    const compiled = await build({
      stdin: { contents: 'export {afcPluginDir, afcBinDir, rolesBin} from "./server/paths"; export {publishCockpitInfo} from "./server/exports";', resolveDir: root, sourcefile: "upgrade-test.ts" },
      bundle: true, platform: "node", format: "cjs", write: false, logLevel: "silent", external: ["zod"],
      plugins: [{ name: "prepared-instance", setup(builder) {
        builder.onLoad({ filter: /install-identity\.mjs$/ }, () => ({ contents: stamp, loader: "js" }));
      } }],
    });
    const module = { exports: {} as { afcPluginDir: () => string; afcBinDir: () => string; rolesBin: () => string; publishCockpitInfo: () => Promise<boolean> } };
    // Match Paseo's eval factory: no __dirname, __filename or import.meta.url.
    new Function("require", "module", "exports", compiled.outputFiles[0].text)(require, module, module.exports);
    const api = module.exports;
    assert.equal(api.afcPluginDir(), current);
    assert.equal(api.afcBinDir(), join(current, "bin"));
    assert.equal(api.rolesBin(), join(current, "bin/roles.mjs"));
    const read = () => JSON.parse(readFileSync(join(home, "data/exports/cockpit.json"), "utf8"));
    assert.equal(await api.publishCockpitInfo(), true);
    assert.equal(read().cli, join(current, "bin/afc.mjs"));
    assert.equal(read().producerVersion, "1.2.3");
    chmodSync(join(current, "bin/afc.mjs"), 0o644);
    assert.equal(await api.publishCockpitInfo(), true);
    assert.equal(read().cli, null);
    chmodSync(join(current, "bin/afc.mjs"), 0o755);
    rmSync(join(current, "bin/afc.mjs"));
    // Even an executable old CLI must not be substituted for the missing running one.
    put(join(old, "bin/afc.mjs"), "#!/usr/bin/env node\n", 0o755);
    assert.equal(await api.publishCockpitInfo(), true);
    assert.equal(read().cli, null);
    assert.equal(warnings.filter(line => line.includes("cockpit CLI unavailable")).length, 2);
    rmSync(current, { recursive: true });
    assert.equal(api.afcPluginDir(), null, "An unresolved managed identity cannot fall back to stale config");
    assert.equal(await api.publishCockpitInfo(), true);
    assert.equal(read().cli, null);
  } finally {
    console.warn = warn;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    rmSync(home, { recursive: true, force: true });
  }
});
