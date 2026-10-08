#!/usr/bin/env node
// `npm run verify`: the whole CI gate set, run on this machine. GitHub Actions is not the only entry point
// (and may be switched off), so this is gate 2; .githooks/pre-push runs it and refuses the push on failure.
//
// Every step runs, even after a failure, so one run lists everything that is wrong. Steps that have
// nothing to check yet (no plugin code) pass with a note; they never skip an error.
// Exit: 0 when every step passed, 1 otherwise.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const node = (...args) => [process.execPath, ...args];
const scriptTests = () => readdirSync(join(ROOT, "scripts")).filter((name) => name.endsWith(".test.mjs")).sort().map((name) => `scripts/${name}`);

/** The gate set, in the order CI runs it. */
export function steps() {
  return [
    { name: "typecheck", command: node("scripts/typecheck.mjs") },
    { name: "test (scripts)", command: node("--test", ...scriptTests()) },
    { name: "test (packages)", command: ["npm", "test", "--workspaces", "--if-present"] },
    { name: "scan (check-private --all)", command: node("scripts/check-private.mjs", "--all", "--quiet") },
    { name: "identity (next commit)", command: node("scripts/check-identity.mjs") },
    { name: "identity (history)", command: node("scripts/check-identity.mjs", "--history") },
    { name: "gitleaks (history)", command: ["gitleaks", "git", "--redact", "--no-banner", "."], missing: "gitleaks is not installed (brew install gitleaks); it is required here because no CI runs it" },
    { name: "contract (sync-contract --check)", command: node("scripts/sync-contract.mjs", "--check") },
    { name: "pack:check", command: node("scripts/check-package-files.mjs") },
  ];
}

/** Run each step with inherited output; returns one { name, ok, why } per step. */
export function runSteps(list, cwd = ROOT, log = console.log) {
  const results = [];
  for (const step of list) {
    log(`\n=== verify: ${step.name}`);
    const out = spawnSync(step.command[0], step.command.slice(1), { cwd, stdio: ["ignore", "inherit", "inherit"] });
    if (out.error?.code === "ENOENT") results.push({ name: step.name, ok: false, why: step.missing ?? `${step.command[0]} not found` });
    else results.push({ name: step.name, ok: out.status === 0, why: out.status === 0 ? "" : `exit ${out.status ?? out.signal}` });
  }
  return results;
}

function main() {
  const results = runSteps(steps());
  console.log("\n=== verify: summary");
  for (const result of results) console.log(`${result.ok ? "ok    " : "FAILED"} ${result.name}${result.why ? ` (${result.why})` : ""}`);
  const failed = results.filter((result) => !result.ok).length;
  console.log(failed === 0 ? "verify: all gates passed" : `verify: ${failed} gate(s) failed`);
  return failed === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
