#!/usr/bin/env node
// Third gate: what `npm pack` would publish. The repository root is the plugin package: run
// `npm pack --dry-run --json` there and refuse any file outside the whitelist, any test, fixture or source map,
// any JSON data file that is not an example or a locale, and any path the private-scan rules forbid.
// The manifest files (package.json, paseo-plugin.json, OVERVIEW.md, LICENSE) must be in the package, and
// every file paseo-plugin.json points to (icon, media) must be in it too.
//
// Usage: node scripts/check-package-files.mjs [--print] [--root <repository>]
//   --print   list every packed file (for the human check before the first release)
// Exit: 0 clean, 1 refused files, 2 setup problem.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { EXIT, isForbiddenPath, loadRules } from "./check-private.mjs";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const ALLOWED = /^(paseo-plugin\.json|OVERVIEW\.md|LICENSE|README\.md|package\.json|index\.(client\.tsx|server\.ts)|(client|server|shared|locales|bin|assets|examples)\/.+)$/;
export const BLOCKED = /(\.test\.|(^|\/)__fixtures__\/|\.map$)/;
const JSON_ALLOWED = /^(package\.json|paseo-plugin\.json|(.+\/)?locales\/.+\.json|(.+\/)?[^/]+\.example\.json)$/;
export const REQUIRED = ["package.json", "paseo-plugin.json", "OVERVIEW.md", "LICENSE"];

export function parseArgs(argv) {
  const options = { print: false, root: DEFAULT_ROOT };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--print") options.print = true;
    else if (arg === "--root") {
      if (!argv[i + 1]) throw new Error("--root needs a directory");
      options.root = resolve(argv[(i += 1)]);
    } else throw new Error(`unknown argument ${arg}`);
  }
  return options;
}

/** Problems with one package's file list. `manifest` is the parsed paseo-plugin.json (or null). */
export function checkFiles(files, manifest, compiled = loadRules()) {
  const problems = [];
  const present = new Set(files);
  for (const file of files) {
    if (!ALLOWED.test(file)) problems.push(`${file}: not in the whitelist`);
    else if (BLOCKED.test(file)) problems.push(`${file}: tests, fixtures and source maps are never published`);
    else if (file.endsWith(".json") && !JSON_ALLOWED.test(file)) problems.push(`${file}: JSON data files are never published (only *.example.json and locales/)`);
    if (isForbiddenPath(file, compiled)) problems.push(`${file}: forbidden by scripts/private-scan.rules.json`);
  }
  for (const file of REQUIRED) if (!present.has(file)) problems.push(`${file}: missing from the package`);
  const referenced = [manifest?.icon, ...(Array.isArray(manifest?.media) ? manifest.media : [])].filter((value) => typeof value === "string");
  for (const file of referenced) if (!present.has(file.replace(/^\.\//, ""))) problems.push(`${file}: named in paseo-plugin.json but not in the package`);
  return problems;
}

function packedFiles(dir) {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return packResultFiles(JSON.parse(out));
}

/** npm 10 prints an array of results, npm 11 and later an object keyed by package name. */
export function packResultFiles(json) {
  const results = Array.isArray(json) ? json : Object.values(json ?? {});
  if (results.length !== 1 || !Array.isArray(results[0]?.files)) throw new Error("unexpected npm pack --json output");
  return results[0].files.map((file) => file.path).sort();
}

/** The root package's packed files and their problems. A private root package is a setup problem. */
export function run(options) {
  const compiled = loadRules();
  const pkg = JSON.parse(readFileSync(join(options.root, "package.json"), "utf8"));
  if (pkg.private) throw new Error("package.json is private; the repository root must be the published plugin package");
  const manifestPath = join(options.root, "paseo-plugin.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : null;
  const files = packedFiles(options.root);
  return { name: pkg.name, files, problems: checkFiles(files, manifest, compiled) };
}

function main() {
  let report;
  try {
    const options = parseArgs(process.argv.slice(2));
    report = run(options);
    console.log(`${report.name}: ${report.files.length} file(s), ${report.problems.length} problem(s)`);
    if (options.print) for (const file of report.files) console.log(`  ${file}`);
    for (const problem of report.problems) console.log(`  refused: ${problem}`);
  } catch (error) {
    console.error(`check-package-files: ${error.message ?? error}`);
    return EXIT.setup;
  }
  return report.problems.length > 0 ? EXIT.hits : EXIT.clean;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
