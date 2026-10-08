#!/usr/bin/env node
// Bundle command entries as standalone ESM for Node. Only Node built-ins remain external.
// No runtime loader or development dependency is needed in an unpacked npm package.
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const ENTRIES = ["cli", "local-decisions", "migrate", "check-missing-cwd"];

export async function buildCli(root = ROOT) {
  root = realpathSync(root);
  const present = ENTRIES.filter(name => existsSync(join(root, "server", `${name}.ts`)));
  if (!present.includes("cli")) {
    console.error("build:cli: no command sources yet, nothing to build");
    return;
  }
  if (present.length !== ENTRIES.length) throw new Error("incomplete CLI source set");
  // Build in memory so a failed compilation cannot leave a partially updated bundle set.
  const results = await Promise.all(ENTRIES.map(name => build({
    entryPoints: [join(root, "server", `${name}.ts`)],
    outfile: join(root, "bin", `${name}.bundle.mjs`),
    bundle: true, platform: "node", format: "esm", target: "node22.5", write: false,
    // Bundling gives every module the command's import.meta.url. Disable command-only
    // guards in imported modules, otherwise importing one CLI can run another CLI's main.
    plugins: [{ name: "entry-guards", setup(builder) {
      builder.onLoad({ filter: /\.tsx?$/ }, args => {
        if (args.path === join(root, "server", `${name}.ts`) || !args.path.startsWith(join(root, "server") + sep)) return;
        const source = readFileSync(args.path, "utf8");
        const contents = source.replace(/if\s*\(\s*import\.meta\.url\s*===\s*invoked\s*\)/g, "if (false)");
        if (contents === source) return;
        return { contents, loader: args.path.endsWith(".tsx") ? "tsx" : "ts" };
      });
    } }],
    // Bundled CommonJS dependencies may use require() for Node built-ins.
    banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' },
  })));
  mkdirSync(join(root, "bin"), { recursive: true });
  for (const result of results) for (const file of result.outputFiles) writeFileSync(file.path, file.contents);
  console.error(`build:cli: ${results.length} standalone Node bundles`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await buildCli(); }
  catch (error) { console.error(`build:cli: ${error.message}`); process.exitCode = 1; }
}
