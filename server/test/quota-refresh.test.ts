import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { EXPORTS } from "../../shared/contract/schema";
import { providerSourceTime, QUOTA_DISPLAY_TTL_MS, QUOTA_SAMPLE_MS } from "../../shared/quota-time";
import type { PaseoApi } from "../paseo-api";
import type { UsagePlan } from "../../shared/usage";

const root = await mkdtemp(join(tmpdir(), "quota-refresh-"));
process.env.AFC_DATA_DIR = join(root, "afc");
process.env.PASEO_HOME = join(root, "host");
process.env.KANBAN_DATA_DIR = join(root, "board");
process.env.ROLES_STATE_DIR = join(root, "roles");
process.env.AFC_TRANSCRIPT_HOME = join(root, "transcripts");
const { PLANS, QUOTA_COMPANIES, buildUsage, refreshPoolStatus, windowFromSuperGrok } = await import("../usage");
const { POOL_STATUS, poolStatus } = await import("../pools-status");
const { companyWindows } = await import("../usage-view");
const { readCompanies } = await import("../home-feed");
const { claudeReadingFromSnapshot } = await import("../pools-unread");
const { samplesInPeriod } = await import("../quota-history");
const { windowsFor } = await import("../adapters/windows");
const { chooseSuperGrok } = await import("../grok-usage");
const { captureCursorUsage, combineCursorReading } = await import("../cursor-usage");
const { readProviderQuota } = await import("../provider-usage");
const { settleSuperGrokChoice } = await import("../grok-usage");
const { readAntigravityUsage } = await import("../quota/antigravity-usage");
const { clearCache } = await import("../util");
after(() => rm(root, { recursive: true, force: true }));
const now = Date.parse("2030-06-01T00:13:20Z");
const iso = (at: number) => new Date(at).toISOString();

test("source times are never replaced by panel time; legacy batch minimum is explicitly labeled", () => {
  for (const sampledAt of ["bad", iso(now + 1)]) {
    assert.deepEqual(providerSourceTime({ sampledAt, batchFetchedAt: iso(now) }, now), { sampledAt: null, sourceTimeKind: "unknown" });
  }
  assert.deepEqual(providerSourceTime({}, now), { sampledAt: null, sourceTimeKind: "unknown" });
  assert.deepEqual(providerSourceTime({ batchFetchedAt: iso(now - 10_000) }, now), { sampledAt: iso(now - 10_000), sourceTimeKind: "batch" });
  assert.deepEqual(providerSourceTime({ sampledAt: iso(now - 1000), batchFetchedAt: iso(now - 10_000) }, now), { sampledAt: iso(now - 1000), sourceTimeKind: "source" });
  const plan = { id: "demo", adapter: "codex-cli", windows: [{ label: "Weekly", usedPct: 5, resetsAt: null, source: "provider", manualAt: null }] } as UsagePlan;
  assert.equal(companyWindows([plan], iso(now))[0].readAt, null);
  for (const sampledAt of ["bad", iso(now + 1000)]) {
    const row = companyWindows([{ ...plan, windows: [{ ...plan.windows[0], sampledAt }] }], iso(now))[0];
    assert.equal(row.readAt, null);
    assert.equal(row.sourceTimeKind, "unknown");
  }
});

test("Grok CLI source sentence and sampledAt retain the same actual read, including no reset", () => {
  const readAt = iso(now - 20 * 60_000);
  const choice = chooseSuperGrok({ now, providerWindows: [], cliEnabled: true, manual: null, unreadSince: null, history: [],
    cli: { ok: true, usedPct: 13, resetsAt: null, readAt, error: null, loggedOut: false, loginLost: false, homeAlarm: null } });
  assert.equal(choice.readAt, readAt);
  assert.match(choice.sourceText!, /13%/);
  const win = windowFromSuperGrok(choice, undefined, null);
  assert.equal(win.sampledAt, readAt);
  assert.equal(companyWindows([{ id: "demo", adapter: "grok-cli", windows: [win] } as UsagePlan], iso(now))[0].readAt, readAt);
});

test("heartbeat publications cannot renew the original quota age", () => {
  const old = iso(now - 3 * QUOTA_SAMPLE_MS);
  const file = { generatedAt: iso(now), pools: { demo: { usedPct: 99, resetsAt: iso(now + QUOTA_SAMPLE_MS), observedAt: old } } };
  assert.equal(claudeReadingFromSnapshot(file, "demo")?.at, old);
  assert.equal(claudeReadingFromSnapshot({ ...file, pools: { demo: { ...file.pools.demo, observedAt: null } } }, "demo"), null);
  assert.deepEqual(samplesInPeriod([{ at: iso(now), pools: { demo: { usedPct: 99, resetsAt: null, observedAt: null } } }], "demo", null, now - 1000, now), []);
});

test("real assembly/publication paths honor hourly slots while plans, priorities and known stops update inside the hour", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });
  await mkdir(process.env.AFC_DATA_DIR!, { recursive: true });
  await writeFile(join(process.env.AFC_DATA_DIR!, "afc.config.json"), JSON.stringify({ adapters: { "grok-cli": false, "cursor-api": false, "antigravity-cli": false } }));
  const plans = [
    { id: "demo-claude", name: "Claude", adapter: "claude-cli", usageProvider: "claude", providers: ["claude"], dispatch: true, pacePause: false, couponCliRead: false },
    { id: "demo-codex", name: "ChatGPT", adapter: "codex-cli", usageProvider: "codex", providers: ["codex"], dispatch: true, pacePause: false, couponCliRead: false },
    { id: "demo-manual", name: "Manual", adapter: "manual", providers: [], dispatch: true, pacePause: false, quotaProtection: "pause", quotaCycle: { kind: "unknown" }, manualOverride: { usedPct: 10, at: iso(now), ttlSeconds: 7200 }, stopPct: 80 },
  ];
  const save = () => writeFile(PLANS, JSON.stringify({ plans }));
  await save();
  let calls = 0;
  let fail = false;
  const paseo = { providers: { listUsage: async () => {
    calls++;
    if (fail) throw Object.assign(new Error("try later"), { code: "rate_limit" });
    return { fetchedAt: iso(Date.now() - 1000), providers: [
      { providerId: "claude", windows: [{ label: "Weekly", usedPct: 76, resetsAt: iso(now + 5 * 86400000) }] },
      { providerId: "codex", windows: [{ label: "Weekly", usedPct: 20, resetsAt: iso(now + 5 * 86400000) }] },
    ] };
  } } } as unknown as PaseoApi;
  const boards = await Promise.all(Array.from({ length: 4 }, () => buildUsage(paseo, "7d")));
  assert.equal(calls, 1);
  assert.equal(boards[0].pools!["demo-claude"].dispatchable, false);
  assert.equal(boards[0].pools!["demo-codex"].dispatchable, true);
  const reading = boards[0].companies!.find(card => card.adapter === "codex-cli")!.windows[0];
  assert.equal(reading.readAt, iso(now - 1000));
  assert.equal(reading.sourceTimeKind, "batch");
  assert.match(reading.sourceText, /batch|account/i);
  for (let minute = 1; minute < 60; minute++) {
    ctx.mock.timers.setTime(now + minute * 60_000);
    if (minute === 20) { plans[1].dispatch = false; await save(); }
    if (minute === 30) { plans[2].manualOverride!.usedPct = 81; await save(); }
    await refreshPoolStatus(paseo);
    if (minute % 10 === 0) await buildUsage(paseo, "today");
    const legacy = JSON.parse(await readFile(POOL_STATUS, "utf8"));
    const exported = EXPORTS.poolStatus.schema.parse(JSON.parse(await readFile(join(process.env.AFC_DATA_DIR!, "exports", "pool-status.json"), "utf8")));
    assert.equal(legacy.generatedAt, iso(Date.now()));
    assert.equal(legacy.pools["demo-codex"].observedAt, iso(now - 1000));
    assert.equal(legacy.pools["demo-claude"].dispatchable, false);
    if (minute >= 20) assert.equal(legacy.pools["demo-codex"].dispatchable, false);
    if (minute >= 30) assert.equal(legacy.pools["demo-manual"].dispatchable, false);
    assert.equal(exported.generatedAt, legacy.generatedAt);
    assert.equal(exported.pools["demo-codex"].dispatchable, legacy.pools["demo-codex"].dispatchable);
    assert.ok(Date.parse(legacy.priority.until) > Date.now());
  }
  assert.equal(calls, 1);
  ctx.mock.timers.setTime(now + QUOTA_SAMPLE_MS);
  fail = true;
  await refreshPoolStatus(paseo);
  assert.equal(calls, 2);
  const failed = JSON.parse(await readFile(POOL_STATUS, "utf8"));
  assert.equal(failed.pools["demo-codex"].dispatchable, false);
  assert.equal(failed.pools["demo-claude"].dispatchable, false);
  assert.match(failed.pools["demo-claude"].reason, /rate_limit/);
  ctx.mock.timers.setTime(now + QUOTA_SAMPLE_MS + 60_000);
  await buildUsage(paseo, "7d");
  await refreshPoolStatus(paseo);
  assert.equal(calls, 2);
  ctx.mock.timers.reset();
  clearCache();
});

test("home rejudges a six-hour cache and explicit expiry even when stored stale is false", async () => {
  const card = { id: "demo", name: "Demo", adapter: "codex-cli", remainingPct: 80, headline: "80%", stale: false, notice: null,
    windows: [{ id: "demo-week", name: "Weekly", usedPct: 20, remainingPct: 80, resetsAt: iso(now + 86400000), source: "provider", readAt: iso(now - 6 * QUOTA_SAMPLE_MS),
      sourceText: "Provider source", who: "", dispatchText: "Open", pacePct: null, stopPct: 97, showPace: true, tone: "green", amountText: null }] };
  await writeFile(QUOTA_COMPANIES, JSON.stringify({ generatedAt: iso(now), companies: [card] }));
  const old = (await readCompanies(now))[0];
  assert.equal(old.stale, true);
  assert.equal(old.windows[0].readingState, "stale");
  assert.equal(old.windows[0].readAt, card.windows[0].readAt);
  card.windows[0].readAt = iso(now);
  Object.assign(card.windows[0], { readingExpiresAt: iso(now - 1) });
  await writeFile(QUOTA_COMPANIES, JSON.stringify({ generatedAt: iso(now), companies: [card] }));
  assert.equal((await readCompanies(now))[0].stale, true);
  Object.assign(card.windows[0], { readingExpiresAt: null, readAt: "bad" });
  await writeFile(QUOTA_COMPANIES, JSON.stringify({ generatedAt: iso(now), companies: [card] }));
  const invalid = (await readCompanies(now))[0];
  assert.equal(invalid.windows[0].readAt, null);
  assert.match(invalid.windows[0].sourceText, /unknown/i);
});

test("safety expiry stays short and known failures stop even a quota-unprotected pool", () => {
  const cfg = { id: "demo", priceUsdMonthly: null, providers: ["codex"], usageProvider: "codex", quotaCycle: { kind: "unknown" as const } };
  const context = { now, windowsBy: new Map([["codex", [{ label: "Weekly", usedPct: 10, resetsAt: iso(now + 86400000), collectedAt: iso(now) }]]]),
    providerCollectedAt: iso(now), balances: new Map(), cursorReading: null, sumUsd: () => 0 };
  const first = windowsFor(cfg, "codex-cli", context);
  const later = windowsFor(cfg, "codex-cli", { ...context, now: now + 8 * 60_000 });
  assert.equal(first[0].readingExpiresAt, iso(now + 7 * 60_000));
  assert.equal(later[0].usedPct, null);
  assert.equal(later[0].staleUsedPct, 10);
  assert.equal(later[0].readingState, "stale");
  const capped = windowsFor({ ...cfg, manualOverride: { usedPct: 1, at: iso(now), ttlSeconds: 7200 } }, "codex-cli", {
    ...context, now: now + 8 * 60_000, windowsBy: new Map([["codex", [{ label: "Weekly", usedPct: 99, resetsAt: iso(now + 86400000), collectedAt: iso(now) }]]]),
  });
  assert.equal(capped[0].usedPct, 1);
  assert.ok(capped[0].knownQuotaStop);
  const plan: UsagePlan = { ...cfg, name: "Demo", adapter: "codex-cli", dispatch: true, quotaProtection: "none", windows: [{ ...first[0], safetyError: "quota exceeded" }], note: "", api30dUsd: 0, roi30d: null, coverage: "" };
  assert.equal(poolStatus([plan], { now }).demo.dispatchable, false);
  const unknownAcp = { ...plan, adapter: "antigravity-cli", windows: [{ ...first[0], usedPct: null, safetyError: null, readingState: "unknown" as const }] } as UsagePlan;
  assert.equal(poolStatus([unknownAcp], { now }).demo.dispatchable, true);
  assert.ok(QUOTA_DISPLAY_TTL_MS > 7 * 60_000);
});

test("native provider, Grok, Cursor and Antigravity entry points share hourly gating with synthetic IO only", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });
  const statePath = join(root, "native-schedule.json");
  await writeFile(join(process.env.AFC_DATA_DIR!, "afc.config.json"), JSON.stringify({ adapters: { "cursor-api": true } }));
  const calls = { provider: 0, grok: 0, cursor: 0, antigravity: 0 };
  let grok: import("../grok-usage").GrokStored | null = null;
  let cursor: import("../cursor-usage").CursorUsageReading | null = null;
  const paseo = { providers: { listUsage: async () => {
    calls.provider++;
    return { providers: ["claude", "codex", "grok"].map(providerId => ({ providerId, windows: [{ label: "Weekly", usedPct: 10 }] })) };
  } } } as unknown as PaseoApi;
  const visit = () => Promise.all([
    readProviderQuota(paseo, { statePath }),
    settleSuperGrokChoice({ providerWindows: [], manual: null, cliRead: true, capture: true, hooks: {
      statePath, now: Date.now(), previous: async () => grok, history: async () => [], ranSince: async () => false,
      capture: async () => { calls.grok++; return { ok: true, usedPct: 13, readAt: iso(Date.now()), resetsAt: iso(now + 86400000), error: null, loggedOut: false, loginLost: false, homeAlarm: null }; },
      persist: async reading => { grok = reading; },
    } }),
    captureCursorUsage(root, { statePath, previous: async () => cursor, tokenGet: async () => ({ ok: false, reason: "missing" }),
      screenIfDue: async () => {
        calls.cursor++;
        return { readAt: iso(Date.now()), ok: true, error: null, includedPct: 10, autoPct: 10, apiPct: 0, onDemandUsd: null, onDemandLimitUsd: null,
          resetsAt: iso(now + 86400000), windows: [], source: "screen", loggedOut: false };
      }, persist: async reading => { cursor = reading; },
    }),
    readAntigravityUsage({ statePath, runner: async () => {
      calls.antigravity++;
      return { stdout: `Gemini Models\tWeekly Limit Remaining\t90%\t${iso(now + 86400000)}`, stderr: "", code: 0, timedOut: false };
    } }),
  ]);
  await Promise.all([visit(), visit(), visit()]);
  for (let minute = 1; minute < 60; minute++) {
    ctx.mock.timers.setTime(now + minute * 60_000);
    await visit();
  }
  assert.deepEqual(calls, { provider: 1, grok: 1, cursor: 1, antigravity: 1 });
  ctx.mock.timers.setTime(now + QUOTA_SAMPLE_MS);
  await Promise.all([visit(), visit()]);
  assert.deepEqual(calls, { provider: 2, grok: 2, cursor: 2, antigravity: 2 });
  const failedHooks = { statePath: join(root, "cursor-interrupted.json"), previous: async () => cursor,
    tokenGet: async () => ({ ok: false as const, reason: "missing" as const }),
    screenIfDue: async () => { throw new Error("screen interrupted"); }, persist: async () => {} };
  const interrupted = await captureCursorUsage(root, failedHooks);
  assert.equal(interrupted?.ok, false);
  assert.match(interrupted!.error!, /screen interrupted/);
  assert.equal((await captureCursorUsage(root, failedHooks))?.error, interrupted?.error);
  ctx.mock.timers.reset();
  await writeFile(join(process.env.AFC_DATA_DIR!, "afc.config.json"), JSON.stringify({ adapters: { "cursor-api": false } }));
});

test("Cursor and Grok failure/expiry cannot forget a known exhausted reading before reset", () => {
  const previous: import("../cursor-usage").CursorUsageReading = { readAt: iso(now - 2 * QUOTA_SAMPLE_MS), ok: true, error: null, includedPct: 99,
    autoPct: 99, apiPct: 0, onDemandUsd: null, onDemandLimitUsd: null, resetsAt: iso(now + 86400000), windows: [], source: "official", loggedOut: false };
  const failed = combineCursorReading({ nowMs: now, readAt: iso(now), previous, attemptedOfficial: true,
    official: { ok: false, failure: "network", message: "network unavailable" }, screen: null, screenRead: false });
  assert.equal(failed.lastKnown?.readAt, previous.readAt);
  const cfg = { id: "demo", priceUsdMonthly: null, providers: ["cursor"], cycleDay: 1, manual: { usedPct: 1, at: iso(now) } };
  const windows = windowsFor(cfg, "cursor-api", { now, windowsBy: new Map(), balances: new Map(), cursorReading: failed, sumUsd: () => 0 });
  assert.ok(windows[0].knownQuotaStop);
  const plan: UsagePlan = { ...cfg, name: "Demo", adapter: "cursor-api", dispatch: true, windows, note: "", api30dUsd: 0, roi30d: null, coverage: "" };
  assert.equal(poolStatus([plan], { now }).demo.dispatchable, false);
  const choice = chooseSuperGrok({ now, providerWindows: [], cli: null, cliEnabled: true, manual: { usedPct: 1, at: iso(now) }, unreadSince: null, history: [],
    lastKnown: { usedPct: 99, readAt: iso(now - 3 * QUOTA_SAMPLE_MS), resetsAt: iso(now + 86400000) } });
  assert.ok(choice.knownQuotaStop);
  const disabled = chooseSuperGrok({ now, providerWindows: [], cli: null, cliEnabled: false, manual: { usedPct: 1, at: iso(now) }, unreadSince: null, history: [],
    lastKnown: { usedPct: 99, readAt: iso(now - 3 * QUOTA_SAMPLE_MS), resetsAt: iso(now + 86400000) } });
  assert.equal(disabled.knownQuotaStop, null);
  const invalid = chooseSuperGrok({ now, providerWindows: [], cli: null, cliEnabled: true, manual: null, unreadSince: null, history: [],
    lastKnown: { usedPct: 99, readAt: iso(now + 1000), resetsAt: iso(now + 86400000) } });
  assert.equal(invalid.knownQuotaStop, null);
  const loggedOut = chooseSuperGrok({ now, providerWindows: [{ label: "Weekly", usedPct: 10, resetsAt: iso(now + 86400000), sampledAt: iso(now) }],
    cli: { ok: false, usedPct: null, readAt: iso(now), resetsAt: null, error: "localized login failure", loggedOut: true, loginLost: false, homeAlarm: null },
    cliEnabled: true, manual: null, unreadSince: null, history: [] });
  assert.equal(loggedOut.source, "provider");
  assert.ok(loggedOut.safetyError);
});
