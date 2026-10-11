import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { applyDispatchMatrix, eligibleReviewers, firstDispatchable, legacyReviewerModels, legacyReviewerTiers, profilesFromConfig, reviewerTier, type DispatchMatrix, type DispatchProfile } from "../../shared/dispatch";
import { DispatchMatrix as ExportMatrix } from "../../shared/contract/schema";
import { buildDispatchMatrixExport } from "../exports";
import { buildRolesPageView } from "../roles-page";
import { differentReviewModels } from "../../shared/review-model";
import { modelConflicts } from "../../shared/roles-swap";
import { checkProfiles, parseProfiles } from "../../shared/doctor-checks";

const fixture = JSON.parse(readFileSync(new URL("../contract/test/model-review.fixture.json", import.meta.url), "utf8"));
const profiles = profilesFromConfig({ daemon: { agentProfiles: fixture.profiles } })!;
const now = Date.parse("2030-01-01T00:00:00Z");
const options = { profiles, knownNames: new Set(profiles.map(profile => profile.name)), pools: fixture.pools, generatedAt: new Date(now).toISOString() };
const build = (base: DispatchMatrix = fixture.base, live: DispatchProfile[] = profiles) =>
  applyDispatchMatrix(base, { ...options, profiles: live, knownNames: new Set(live.map(profile => profile.name)) });

test("raw profiles through apply, contract/export parse and server Roles view use actual models", async () => {
  const matrix = build();
  const parsed = ExportMatrix.parse(buildDispatchMatrixExport(matrix, "demo", new Date(now)));
  assert.deepEqual(parsed.roles, matrix.roles);
  for (const row of fixture.cases.filter((row: { tier: string }) => row.tier === "L2")) {
    const candidates = eligibleReviewers(parsed, row.executorModel, row.tier, profiles, fixture.pools).filter(entry => !entry.paused);
    assert.equal(candidates.some(entry => entry.profile === row.reviewer), row.allowed, row.label);
  }
  const page = await buildRolesPageView({ profiles: async () => profiles, pools: async () => fixture.pools, runsSince: () => [], baseMatrix: async () => fixture.base }, now);
  const line = page.cards.find(card => card.key === "reviewer")!.orderLines.find(line => line.includes("demo-alpha"))!;
  assert.match(line, /L2 Demo same family reviewer/);
  assert.ok(!line.includes("Demo same model reviewer"));
  assert.ok(!line.includes("Demo unknown reviewer"));
  assert.equal(firstDispatchable(reviewerTier(parsed, null, "L2")), null);
});

test("candidate switching and stale/invalid profiles are rechecked against live actual models", () => {
  const matrix = build();
  assert.ok(eligibleReviewers(matrix, "demo-alpha", "L2", profiles, fixture.pools).some(row => row.profile === "Demo same family reviewer"));
  for (const replacement of [{ model: "demo-alpha" }, { model: " DEMO-ALPHA " }, { model: "" }, { model: " " }, { model: null }, { role: "reader", candidateFor: null }]) {
    const live = profiles.map(profile => profile.name === "Demo same family reviewer" ? { ...profile, ...replacement } : profile);
    assert.ok(!eligibleReviewers(matrix, "demo-alpha", "L2", live, fixture.pools).some(row => row.profile === "Demo same family reviewer"));
    assert.ok(!reviewerTier(build(fixture.base, live), "demo-alpha", "L2").some(row => row.profile === "Demo same family reviewer"));
  }
  assert.ok(!eligibleReviewers(matrix, "demo-alpha", "L2", profiles.filter(row => row.name !== "Demo same family reviewer"), fixture.pools).some(row => row.profile === "Demo same family reviewer"));
  // The candidate became the actual executor: compare beta, not the main executor's alpha or family.
  assert.ok(!eligibleReviewers(matrix, "demo-beta", "L2", profiles, fixture.pools).some(row => row.profile === "Demo same family reviewer"));
  assert.ok(eligibleReviewers(matrix, "demo-beta", "L2", profiles, fixture.pools).some(row => row.profile === "Demo same model reviewer"));
  for (const model of [null, undefined, "", " ", "missing-model"]) assert.deepEqual(reviewerTier(matrix, model, "L2"), []);
});

test("model branches take precedence; legacy consumer merges remain separate from scoped producer migration", () => {
  const legacy: DispatchMatrix = { ...fixture.base, roles: { reviewer: { byExecutorFamily: {
    "demo-family-a": { L2: [{ profile: "Demo same model reviewer", effort: "high" }] },
    "demo-family-b": { L2: [{ profile: "Demo same family reviewer", effort: "high" }, { profile: "Demo same model reviewer", effort: "high" }] },
  } } } };
  assert.equal(legacyReviewerTiers(legacy.roles.reviewer).L2.length, 2);
  assert.deepEqual(reviewerTier(legacy, "demo-alpha", "L2").map(row => row.profile), ["Demo same model reviewer", "Demo same family reviewer"]);
  // Conflicting legacy origin metadata for one actual model cannot grant a union of scopes.
  assert.deepEqual(reviewerTier(build(legacy), "demo-alpha", "L2"), []);
  for (const branch of [{}, { "demo-alpha": { L2: [] } }, null, []]) {
    const mixed = { ...legacy, roles: { reviewer: { ...legacy.roles.reviewer as object, byExecutorModel: branch } } };
    assert.deepEqual(reviewerTier(build(mixed), "demo-alpha", "L2"), []);
  }
  const exact = { ...legacy, roles: { reviewer: { byExecutorModel: { "demo-alpha": { L2: [] }, "demo-beta": { L2: [{ profile: "Demo ordinary reviewer", effort: "high" }] } } } } };
  assert.deepEqual(reviewerTier(build(exact), "demo-alpha", "L2"), []);
});

test("legacy Gemini review scope stays GPT-only in all four tiers through apply, export and Roles", async () => {
  const live: DispatchProfile[] = [
    { name: "Demo Gemini executor", role: "executor", model: "gemini-3.8-flash-medium", family: "google", pool: "demo-google" },
    { name: "Demo GPT reviewer", role: "reviewer", model: "gpt-6.1-sol", family: "openai", pool: "demo-gpt" },
    { name: "Demo Grok reviewer", role: "candidate", candidateFor: "reviewer", model: "grok-4.7", family: "xai", pool: "demo-grok" },
    { name: "Demo Sonnet reviewer", role: "candidate", candidateFor: "reviewer", model: "demo-sonnet", family: "anthropic", pool: "demo-claude" },
    { name: "Demo paused high-risk reviewer", role: "personal", pausedCandidateFor: "reviewer", model: "demo-fable", family: "anthropic", pool: "demo-claude" },
  ];
  const tiers = Object.fromEntries(["L1", "L2", "L3", "L4"].map(tier => [tier,
    [{ profile: "Demo GPT reviewer", effort: tier === "L1" || tier === "L2" ? "xhigh" : "max" }]]));
  const base: DispatchMatrix = { ...fixture.base, roles: {
    executor: { L1: [{ profile: live[0].name, effort: null }], L2: [{ profile: live[0].name, effort: null }] },
    reviewer: { byExecutorFamily: {
      google: tiers,
      openai: Object.fromEntries(Object.keys(tiers).map(tier => [tier, [{ profile: live[2].name, effort: "high" }, { profile: live[4].name, effort: "xhigh" }]])),
      xai: Object.fromEntries(Object.keys(tiers).map(tier => [tier, [{ profile: live[1].name, effort: tiers[tier][0].effort }, { profile: live[4].name, effort: "xhigh" }]])),
      anthropic: Object.fromEntries(Object.keys(tiers).map(tier => [tier, [{ profile: live[1].name, effort: tiers[tier][0].effort }, { profile: live[2].name, effort: "high" }]])),
    } },
  } };
  const pools = { "demo-google": { dispatchable: true, prefer: false }, "demo-gpt": { dispatchable: true, prefer: true },
    "demo-grok": { dispatchable: true, prefer: false }, "demo-claude": { dispatchable: false, prefer: false } };
  const opts = { ...options, profiles: live, knownNames: new Set(live.map(row => row.name)), pools };
  const migrated = { ...base, roles: { ...base.roles, reviewer: legacyReviewerModels(base.roles.reviewer, live) } };
  for (const input of [base, migrated]) {
    const matrix = applyDispatchMatrix(input, opts);
    const parsed = ExportMatrix.parse(buildDispatchMatrixExport(matrix, "demo", new Date(now)));
    for (const tier of Object.keys(tiers)) {
      assert.deepEqual(reviewerTier(parsed, live[0].model, tier), tiers[tier]);
      assert.equal(firstDispatchable(reviewerTier(parsed, live[0].model, tier))?.profile, live[1].name);
      // If GPT pauses, the configured Gemini scope has no Grok/Sonnet/Fable fallback.
      const paused = eligibleReviewers(parsed, live[0].model, tier, live, { ...pools, "demo-gpt": { dispatchable: false, prefer: false } });
      assert.deepEqual(paused.map(row => row.profile), [live[1].name]);
      assert.equal(firstDispatchable(paused), null);
      // The existing paused high-risk substitute stays visible in its configured scopes.
      for (const executorModel of ["grok-4.7", "gpt-6.1-sol"]) {
        assert.equal(reviewerTier(parsed, executorModel, tier).find(row => row.profile === live[4].name)?.paused, true);
      }
    }
    const page = await buildRolesPageView({ profiles: async () => live, pools: async () => pools, runsSince: () => [], baseMatrix: async () => input }, now);
    const line = page.cards.find(card => card.key === "reviewer")!.orderLines.find(row => row.includes(live[0].model!))!;
    assert.match(line, /Demo GPT reviewer/);
    assert.ok(!line.includes(live[2].name) && !line.includes(live[3].name) && !line.includes(live[4].name));
  }
  // Actual-model branches have no family comparison: an explicitly allowed same-family different model remains valid.
  const sameFamily = live.map(row => row.name === live[1].name ? { ...row, family: "google" } : row);
  const explicit = applyDispatchMatrix(migrated, { ...opts, profiles: sameFamily });
  assert.deepEqual(reviewerTier(explicit, live[0].model, "L1"), tiers.L1);
});

test("model eligibility preserves pause, quota, roles, provider bans and explicit tier limits", () => {
  const matrix = build();
  const preferred = "Demo same family reviewer";
  for (const pools of [{ ...fixture.pools, "demo-ready": { dispatchable: false, prefer: true } },
    { ...fixture.pools, "demo-ready": { dispatchable: true, prefer: true, onlyRoles: ["reader"] } }]) {
    assert.equal(eligibleReviewers(matrix, "demo-alpha", "L2", profiles, pools).find(row => row.profile === preferred)?.paused, true);
  }
  const live = profiles.map(profile => profile.name === preferred ? { ...profile, notes: "[Paused]" } : profile);
  assert.equal(eligibleReviewers(matrix, "demo-alpha", "L2", live, null).find(row => row.profile === preferred)?.paused, true);
  assert.deepEqual(eligibleReviewers(matrix, "demo-alpha", "L2", profiles, fixture.pools, ["demo-provider-a"]).map(row => row.profile), ["Demo ordinary reviewer", "Demo paused reviewer"]);
  // L4 permission is represented by the configured tier list, never inferred from a different model.
  const highRiskBase = structuredClone(fixture.base);
  highRiskBase.roles.reviewer.L4 = highRiskBase.roles.reviewer.L4.filter((row: { profile: string }) => row.profile !== "Demo ordinary reviewer");
  assert.ok(!reviewerTier(build(highRiskBase), "demo-alpha", "L4").some(row => row.profile === "Demo ordinary reviewer"));
  const paused = structuredClone(highRiskBase);
  paused.roles.reviewer.L4[0].paused = true;
  assert.equal(reviewerTier(build(paused), "demo-alpha", "L4")[0].paused, true);
});

test("doctor and model-swap warnings compare actual models even across companies", async () => {
  const raw = [fixture.profiles[0], fixture.profiles[1]];
  const verdict = (reviewer: object) => checkProfiles({ profiles: parseProfiles({ daemon: { agentProfiles: [raw[0], reviewer] } }), models: {}, providers: null, disabledPools: [] }).findings.find(row => row.key === "profiles:model")!.status;
  assert.equal(verdict(raw[1]), "green");
  assert.equal(verdict({ ...raw[1], model: "demo-alpha", family: "other" }), "red");
  assert.equal(verdict({ ...raw[1], model: "" }), "red");
  const page = await buildRolesPageView({ profiles: async () => profiles, pools: async () => fixture.pools, runsSince: () => [], baseMatrix: async () => fixture.base }, now);
  assert.deepEqual(modelConflicts(page.cards, "executor", "Demo executor", "demo-gamma-unlisted"), []);
  assert.ok(modelConflicts(page.cards, "executor", "Demo executor", "demo-alpha").some(line => line.includes("Demo same model reviewer")));
  assert.equal(differentReviewModels("demo-alpha", "demo-beta"), true);
});
