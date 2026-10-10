#!/usr/bin/env node
// Prebuild the background connection dependency; production installs need no development SDK.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ["bin/daemon-client.ts"],
  outfile: "server/paseo-client.bundle.mjs",
  bundle: true,
  external: ["zod", "@getpaseo/protocol", "@getpaseo/relay"],
  platform: "node",
  format: "esm",
  target: "node22.5",
  write: false,
  // CommonJS dependencies require Node built-ins in both ESM and the plugin wrapper.
  banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(process.cwd() + "/package.json");' },
  minifyIdentifiers: true,
  legalComments: "eof",
});
for (const file of result.outputFiles) await writeFile(file.path, file.contents);
console.error("build:daemon-client: standalone Node connection module");
