#!/usr/bin/env node
// Refuse personal data in the repository: home paths, e-mail addresses, ids, card numbers, keys, and
// text outside the locale files; plus every term in the author's private denylist (kept outside all repos).
//
// Usage: node scripts/check-private.mjs [--all | --tree <rev>] [--no-private-list] [--list <path>] [--quiet] [<path prefix>...]
//   default      staged files, as they are in the index (what the next commit will contain)
//   --all        every tracked or new, not ignored file, as it is in the working tree
//   --tree       every file of a commit (pre-push checks what is about to leave the machine)
//   <prefix>     only files under these repository-relative prefixes
//   --list       private denylist (default $FLEET_PRIVATE_DENYLIST, else ~/.config/paseo-fleet/private-denylist.txt)
//   --no-private-list   generic rules only (CI; the private list never leaves the author's machine)
// Exit: 0 clean, 1 hits, 2 setup problem (missing denylist, unreadable rules, not a git checkout).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RULES_FILE = join(dirname(fileURLToPath(import.meta.url)), "private-scan.rules.json");
const CONTEXT = 40;
const MAX_BUFFER = 64 * 1024 * 1024;
export const EXIT = { clean: 0, hits: 1, setup: 2 };

export class SetupError extends Error {}

export function parseArgs(argv) {
  const options = { all: false, tree: null, privateList: true, list: null, quiet: false, prefixes: [] };
  const value = (i, name) => {
    if (!argv[i + 1]) throw new SetupError(`${name} needs a value`);
    return argv[i + 1];
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") options.all = true;
    else if (arg === "--no-private-list") options.privateList = false;
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--list") options.list = value(i++, "--list");
    else if (arg === "--tree") options.tree = value(i++, "--tree");
    else if (arg.startsWith("--")) throw new SetupError(`unknown option ${arg}`);
    else options.prefixes.push(arg.replace(/^\.\//, ""));
  }
  if (options.all && options.tree) throw new SetupError("--all and --tree cannot be combined");
  return options;
}

export function defaultListPath(env = process.env, home = homedir()) {
  return env.FLEET_PRIVATE_DENYLIST?.trim() || join(home, ".config", "paseo-fleet", "private-denylist.txt");
}

const regex = (source, flags = "") => new RegExp(source, flags);

/** Compile the generic rules file. */
export function compileRules(json) {
  const list = (items) => (items ?? []).map((source) => regex(source));
  return {
    ignore: list(json.ignorePaths),
    forbidden: list(json.forbiddenPaths?.patterns),
    forbiddenAllow: list(json.forbiddenPaths?.allow),
    rules: (json.rules ?? []).map((rule) => ({
      id: rule.id,
      pattern: regex(rule.pattern, "g"),
      allow: list(rule.allow),
      onlyPaths: rule.onlyPaths ? list(rule.onlyPaths) : null,
    })),
  };
}

export function loadRules() {
  return compileRules(JSON.parse(readFileSync(RULES_FILE, "utf8")));
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One term per line; `/regex/flags` or a case-insensitive literal; `#` starts a comment line. */
export function parseDenylist(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((term) => {
      const literal = /^\/(.+)\/([a-z]*)$/.exec(term);
      const pattern = literal ? regex(literal[1], literal[2].includes("g") ? literal[2] : `${literal[2]}g`) : regex(escapeRegex(term), "gi");
      return { id: "private", pattern, allow: [], onlyPaths: null };
    });
}

/** Read the private denylist; a missing file is a setup error so a local commit never runs without it. */
export function loadDenylist(listPath) {
  let text;
  try {
    text = readFileSync(listPath, "utf8");
  } catch {
    throw new SetupError(`private denylist not found: ${listPath} (create it from scripts/private-denylist.example.txt, or pass --list <path>)`);
  }
  return parseDenylist(text);
}

export const anyMatch = (patterns, text) => patterns.some((pattern) => pattern.test(text));

/** The line around a hit, with the hit itself masked. */
export function masked(line, index, length) {
  const start = Math.max(0, index - CONTEXT);
  const end = Math.min(line.length, index + length + CONTEXT);
  return `${line.slice(start, index)}***${line.slice(index + length, end)}`.trim();
}

/** True when a path name alone is refused (real data files, private folders). */
export function isForbiddenPath(path, compiled) {
  return anyMatch(compiled.forbidden, path) && !anyMatch(compiled.forbiddenAllow, path);
}

/** Hits for one file. `text` is null for binary files, which are judged by path only. */
export function scanFile(path, text, compiled, privateRules = []) {
  if (anyMatch(compiled.ignore, path)) return [];
  const hits = [];
  if (isForbiddenPath(path, compiled)) hits.push({ path, line: 0, rule: "forbidden-path", snippet: path });
  for (const rule of privateRules) {
    for (const match of path.matchAll(rule.pattern)) hits.push({ path, line: 0, rule: rule.id, snippet: masked(path, match.index, match[0].length) });
  }
  if (text === null) return hits;
  const rules = [...compiled.rules.filter((rule) => !rule.onlyPaths || anyMatch(rule.onlyPaths, path)), ...privateRules];
  text.split("\n").forEach((line, index) => {
    for (const rule of rules) {
      for (const match of line.matchAll(rule.pattern)) {
        if (anyMatch(rule.allow, match[0])) continue;
        hits.push({ path, line: index + 1, rule: rule.id, snippet: masked(line, match.index, match[0].length) });
      }
    }
  });
  return hits;
}

function git(root, args, encoding = "utf8") {
  return execFileSync("git", ["-C", root, ...args], { encoding, maxBuffer: MAX_BUFFER, stdio: ["ignore", "pipe", "pipe"] });
}

/** The files to scan and how to read each one: index blobs, a commit's blobs, or the working tree. */
function source(root, options) {
  if (options.tree) {
    let commit;
    try {
      commit = git(root, ["rev-parse", "--verify", `${options.tree}^{commit}`]).trim();
    } catch {
      throw new SetupError(`not a commit: ${options.tree}`);
    }
    return { args: ["ls-tree", "-r", "-z", "--name-only", commit], read: (path) => git(root, ["cat-file", "blob", `${commit}:${path}`], "buffer") };
  }
  if (options.all) {
    return { args: ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], read: (path) => readFileSync(join(root, path)) };
  }
  return { args: ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"], read: (path) => git(root, ["cat-file", "blob", `:${path}`], "buffer") };
}

const asText = (buffer) => (buffer.includes(0) ? null : buffer.toString("utf8"));

export function run(argv, env = process.env, cwd = process.cwd()) {
  const options = parseArgs(argv);
  let root;
  try {
    root = git(cwd, ["rev-parse", "--show-toplevel"]).trim();
  } catch {
    throw new SetupError("not inside a git checkout");
  }
  const compiled = loadRules();
  const privateRules = options.privateList ? loadDenylist(options.list ?? defaultListPath(env)) : [];
  const inScope = (path) => options.prefixes.length === 0 || options.prefixes.some((prefix) => path === prefix || path.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`));
  const { args, read } = source(root, options);
  const files = [...new Set(git(root, args).split("\0").filter(Boolean))].sort().filter(inScope);
  const hits = [];
  for (const path of files) {
    let buffer;
    try {
      buffer = read(path);
    } catch {
      continue; // listed but gone from the working tree (or a submodule entry); nothing to leak
    }
    hits.push(...scanFile(path, asText(buffer), compiled, privateRules));
  }
  return { files: files.length, hits };
}

export function summarize(hits) {
  const byRule = new Map();
  for (const hit of hits) byRule.set(hit.rule, (byRule.get(hit.rule) ?? 0) + 1);
  return [...byRule.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function main() {
  let result;
  try {
    result = run(process.argv.slice(2));
  } catch (error) {
    console.error(`check-private: ${error instanceof SetupError ? error.message : String(error)}`);
    return EXIT.setup;
  }
  const quiet = process.argv.includes("--quiet");
  if (!quiet) for (const hit of result.hits) console.log(`${hit.path}:${hit.line}:${hit.rule}: ${hit.snippet}`);
  const files = new Set(result.hits.map((hit) => hit.path)).size;
  const counts = summarize(result.hits).map(([rule, count]) => `${rule} ${count}`).join(", ");
  console.log(`check-private: ${result.files} file(s) scanned, ${result.hits.length} hit(s) in ${files} file(s)${counts ? `: ${counts}` : ""}`);
  return result.hits.length > 0 ? EXIT.hits : EXIT.clean;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
