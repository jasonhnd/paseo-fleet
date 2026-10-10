#!/usr/bin/env node
// Build the background connection dependency during source preparation or prepack.
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
  // Anchor ESM require to this module. The plugin compiler removes this unused shim
  // when converting the current dependency graph to its CommonJS wrapper.
  banner: { js: 'import { createRequire } from "node:module"; const require = /* @__PURE__ */ createRequire(import.meta.url);' },
  minifyIdentifiers: true,
  legalComments: "eof",
});
for (const file of result.outputFiles) await writeFile(file.path, file.contents);
console.error("build:daemon-client: standalone Node connection module");
