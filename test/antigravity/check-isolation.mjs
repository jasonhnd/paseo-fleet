#!/usr/bin/env node
// Source-checkout-only development probes (npm ci with dev dependencies); not shipped in npm tarballs.
// Offline acceptance probes. No provider, daemon, credential or board mutations.
// Run after npm ci: node test/antigravity/check-isolation.mjs [--usage-run file]
import { readFile } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { register } from "tsx/esm/api";
for (const key of ["AFC_DATA_DIR", "KANBAN_DATA_DIR", "ROLES_STATE_DIR", "PASEO_HOME", "TMPDIR"]) {
  if (!process.env[key] || !isAbsolute(process.env[key])) throw new Error(`Set an absolute isolated ${key} before running the probes`);
}
register();
const { readingFromRun, antigravityPlanWindows } = await import("../../server/quota/antigravity-usage.ts");
const { poolStatus } = await import("../../server/pools-status.ts");
const { profilePaused, applyDispatchMatrix } = await import("../../shared/dispatch.ts");
const { adapterOf } = await import("../../shared/quota-adapters.ts");
const { windowsFor } = await import("../../server/adapters/windows.ts");

const now = Date.parse("2028-06-01T00:00:00Z");
const table = [
  "Gemini Models\tWeekly Limit Remaining\t80%\t2028-06-08T00:00:00Z",
  "Gemini Models\tFive Hour Limit Remaining\t70%\t2028-06-01T05:00:00Z",
  "Claude and GPT models\tWeekly Limit Remaining\t40%\t2028-06-08T00:00:00Z",
  "Claude and GPT models\tFive Hour Limit Remaining\t25%\t2028-06-01T05:00:00Z",
].join("\n");
const run = (stdout, extra = {}) => ({ stdout, stderr: "", code: 0, timedOut: false, ...extra });
const results = [];
function check(name, ok, evidence) { results.push({ name, ok, evidence }); }
function plan(id, windows, changes = {}) {
  return { id, name: id, adapter: "antigravity-cli", providers: ["antigravity"],
    dispatch: true, quotaProtection: "pause", priceUsdMonthly: null, api30dUsd: 0,
    roi30d: null, note: "", coverage: "", windows, ...changes };
}
function status(reading, at = now) {
  const windows = antigravityPlanWindows({ id: "demo", antigravityBucket: "gemini" }, reading, at);
  return { windows, pool: poolStatus([plan("demo", windows)], { now: at }).demo };
}
const valid = readingFromRun(run(table), now);
const grouped = ["gemini", "claude-gpt"].map(bucket => antigravityPlanWindows({ id: bucket, antigravityBucket: bucket }, valid, now));
check("separate CLI buckets", JSON.stringify(grouped.map(w => w.slice(1).map(x => x.usedPct))) === "[[20,30],[60,75]]", grouped.map(w => w.map(x => ({ id: x.id, usedPct: x.usedPct, source: x.source }))));
check("unproven ACP stays unknown and closed", status(valid).pool.dispatchable === false && status(valid).windows[0].usedPct === null, status(valid));
for (const [name, value, error] of [
  ["missing CLI", run(table, { missing: true }), "missing-cli"],
  ["timeout with partial stdout", run(table, { timedOut: true, code: null }), "timeout"],
  ["invalid stdout", run("unrecognized output"), "bad-output"],
  ["failed exit with valid partial stdout", run(table.split("\n")[0], { code: 2 }), "failed"],
  ["signal exit with valid partial stdout", run(table.split("\n")[0], { code: null }), "failed"],
]) {
  const reading = readingFromRun(value, now);
  check(name, reading.error === error && reading.samples.length === 0 && !status(reading).pool.dispatchable, { reading, ...status(reading) });
}
const stale = status(valid, now + 86400000);
check("expired CLI is marked stale and ACP stays closed", !stale.pool.dispatchable && stale.windows.slice(1).every(w => w.readingState === "stale"), stale);
// Matching channel identities here are artificial test data, never production evidence.
const identity = { version: "9.9.9", tier: "synthetic-tier", quotaSource: "synthetic-specific-pool", observedAt: new Date(now).toISOString() };
const proven = { ...valid, cli: { ...identity, channel: "agy-cli" }, acp: { ...identity, channel: "paseo-acp" } };
const exhausted = { ...proven, samples: proven.samples.map(s => ({ ...s, remainingPct: 0, usedPct: 100 })) };
check("synthetic exhausted ACP pool stays closed", !status(exhausted).pool.dispatchable, status(exhausted));
check("synthetic expired proven ACP reading stays closed", !status(proven, now + 86400000).pool.dispatchable && status(proven, now + 86400000).windows[0].readingState === "stale", status(proven, now + 86400000));
const input = { id: "demo", providers: ["antigravity"], priceUsdMonthly: null, antigravityBucket: "gemini", quotaCycle: { kind: "unknown" }, manualOverride: { usedPct: 0, at: new Date(now).toISOString(), ttlSeconds: 86400 } };
for (const switches of [{ "antigravity-cli": false }, {}]) {
  const adapter = adapterOf({ ...input, adapter: "antigravity-cli" }, switches);
  const windows = windowsFor(input, adapter, { windowsBy: new Map(), balances: new Map(), cursorReading: null, antigravityReading: null, sumUsd: () => 0, now });
  check(Object.hasOwn(switches, "antigravity-cli") ? "reader explicitly off cannot fall back to fresh manual zero" : "reader switch missing cannot fall back to fresh manual zero", adapter === "antigravity-cli" && !poolStatus([plan("demo", windows)], { now }).demo.dispatchable, { adapter, windows });
}
const manualWindows = windowsFor(input, "manual", { windowsBy: new Map(), balances: new Map(), cursorReading: null, antigravityReading: null, sumUsd: () => 0, now });
check("other manual provider remains dispatchable", poolStatus([plan("other", manualWindows, { adapter: "manual", providers: ["other-provider"] })], { now }).other.dispatchable, manualWindows);
const closedWindows = status(valid).windows;
check("dispatch false is an independent gate", !poolStatus([plan("demo", closedWindows, { dispatch: false })], { now }).demo.dispatchable, null);
const profiles = ["executor", "reader", "batch"].map(role => ({ name: `demo-${role}`, provider: "antigravity", family: "google", role: "personal", pausedCandidateFor: role, pool: "demo" }));
check("paused stand-ins stay paused even without a pool snapshot", profiles.every(p => profilePaused(p, undefined)), profiles);
const candidates = profiles.map(({ pausedCandidateFor, ...p }) => ({ ...p, role: "candidate", candidateFor: pausedCandidateFor }));
const base = { roles: Object.fromEntries(candidates.map(p => [p.candidateFor, { L1: [{ profile: p.name }], L2: [{ profile: p.name }], L3: [], L4: [] }])) };
const matrix = applyDispatchMatrix(base, { knownNames: new Set(candidates.map(p => p.name)), profiles: candidates, pools: { demo: { dispatchable: false } }, generatedAt: new Date(now).toISOString() });
check("sandbox role slots are only execution, reading and batch at L1/L2", Object.keys(matrix.roles).length === 3 && Object.values(matrix.roles).every(r => r.L1[0]?.paused && r.L2[0]?.paused && r.L3.length === 0 && r.L4.length === 0), matrix);

const args = process.argv.slice(2);
if (args.length) {
  if (args.length !== 2 || args[0] !== "--usage-run") throw new Error("Usage: check-antigravity-isolation.mjs [--usage-run file]");
  const saved = JSON.parse(await readFile(args[1], "utf8"));
  const at = Date.parse(saved.observedAt);
  if (!Number.isFinite(at)) throw new Error("Saved run needs observedAt; do not fabricate a fresh sampling time");
  const reading = readingFromRun(saved, at);
  check("saved real CLI result is separate from ACP", reading.error === null && reading.samples.length > 0 && reading.acp === null && !status(reading, at).pool.dispatchable, { reading, ...status(reading, at) });
}
console.log(JSON.stringify({ kind: "offline-acceptance-probes", realLifecycleVerified: false, results, failures: results.filter(r => !r.ok).map(r => r.name) }, null, 2));
process.exitCode = results.some(r => !r.ok) ? 1 : 0;
