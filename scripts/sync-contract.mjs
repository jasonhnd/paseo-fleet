#!/usr/bin/env node
// Copy the fleet-quota contract from packages/contract into every plugin package, or check the copies.
//
// Usage: node scripts/sync-contract.mjs [--check] [--root <repository>]
//
// The contract has two halves, because Paseo bundles a plugin's shared/ folder into the client and the
// client may not import Node built-ins:
//   packages/contract/src/shared/  ->  packages/<plugin>/shared/contract/   (schemas only)
//   packages/contract/src/server/  ->  packages/<plugin>/server/contract/   (paths and file I/O)
// A plugin package is a folder under packages/ with a paseo-plugin.json. Only the two contract folders are
// touched: files are copied over and files that exist only in a copy are removed, so every copy is identical.
// With --check nothing is written; differences are listed and the exit code is 1.
// An empty contract source is allowed while the repository has no plugin code yet, but then a sync never
// deletes existing copies (that would only ever be a mistake).
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const HALVES = [
  { from: "src/shared", to: "shared/contract" },
  { from: "src/server", to: "server/contract" },
];
const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const USAGE = "usage: node scripts/sync-contract.mjs [--check] [--root <repository>]";

export function parseArgs(argv) {
  const options = { root: DEFAULT_ROOT, check: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check") options.check = true;
    else if (arg === "--root") {
      if (!argv[i + 1]) throw new Error("--root needs a directory");
      options.root = resolve(argv[(i += 1)]);
    } else throw new Error(`unknown argument ${arg}\n${USAGE}`);
  }
  return options;
}

async function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join("/"))
    .sort();
}

const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");

/** Plugin packages: folders under packages/ that hold a paseo-plugin.json. */
export async function pluginPackages(root) {
  const packages = join(root, "packages");
  if (!existsSync(packages)) return [];
  const entries = await readdir(packages, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && existsSync(join(packages, entry.name, "paseo-plugin.json")))
    .map((entry) => `packages/${entry.name}`)
    .sort();
}

/** Files missing, extra or changed in `to` compared with `from`. */
export async function diffDir(from, to) {
  const [sourceFiles, targetFiles] = await Promise.all([listFiles(from), listFiles(to)]);
  const sourceSet = new Set(sourceFiles);
  const targetSet = new Set(targetFiles);
  const shared = sourceFiles.filter((file) => targetSet.has(file));
  const changed = [];
  for (const file of shared) if ((await digest(join(from, file))) !== (await digest(join(to, file)))) changed.push(file);
  return {
    missing: sourceFiles.filter((file) => !targetSet.has(file)),
    extra: targetFiles.filter((file) => !sourceSet.has(file)),
    changed,
    sourceCount: sourceFiles.length,
  };
}

/** Every difference, as repository-relative paths of the copies. */
export async function diffAll(root) {
  const contract = join(root, "packages", "contract");
  const plugins = await pluginPackages(root);
  const total = { missing: [], extra: [], changed: [], sourceCount: 0, plugins };
  for (const half of HALVES) total.sourceCount += (await listFiles(join(contract, half.from))).length;
  for (const plugin of plugins) {
    for (const half of HALVES) {
      const diff = await diffDir(join(contract, half.from), join(root, plugin, half.to));
      const where = (file) => `${plugin}/${half.to}/${file}`;
      total.missing.push(...diff.missing.map(where));
      total.extra.push(...diff.extra.map(where));
      total.changed.push(...diff.changed.map(where));
    }
  }
  return total;
}

export async function syncContract({ root, check }) {
  const diff = await diffAll(root);
  if (check) return diff;
  if (diff.sourceCount === 0 && diff.extra.length > 0) {
    throw new Error("packages/contract/src is empty; refusing to delete the plugin copies");
  }
  const contract = join(root, "packages", "contract");
  const sourceOf = (file) => {
    const plugin = diff.plugins.find((p) => file.startsWith(`${p}/`));
    const rest = file.slice(plugin.length + 1);
    const half = HALVES.find((h) => rest.startsWith(`${h.to}/`));
    return join(contract, half.from, rest.slice(half.to.length + 1));
  };
  for (const file of [...diff.missing, ...diff.changed]) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await copyFile(sourceOf(file), join(root, file));
  }
  for (const file of diff.extra) await rm(join(root, file));
  return diff;
}

function describe(diff) {
  return [
    ...diff.missing.map((file) => `missing  ${file}`),
    ...diff.extra.map((file) => `extra    ${file}`),
    ...diff.changed.map((file) => `changed  ${file}`),
  ];
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`sync-contract: ${error.message}\n`);
    return 2;
  }
  try {
    const diff = await syncContract(options);
    const lines = describe(diff);
    const scope = `${diff.sourceCount} contract file(s), ${diff.plugins.length} plugin package(s)`;
    if (options.check) {
      if (lines.length === 0) {
        process.stdout.write(`contract in sync (${scope})\n`);
        return 0;
      }
      process.stdout.write(`contract differs (${scope}):\n${lines.join("\n")}\n`);
      return 1;
    }
    process.stdout.write(lines.length === 0 ? `contract already in sync (${scope})\n` : `synced (${scope}):\n${lines.join("\n")}\n`);
    return 0;
  } catch (error) {
    process.stderr.write(`sync-contract: ${error.message}\n`);
    return 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
