import assert from "node:assert/strict";
import { test } from "node:test";
import { pickableModels, swapRefusal } from "../../shared/roles-policy";
import { supervisorSlots } from "../../shared/supervisor-shift-rows";
import { chooseDataDir, legacyStateDir } from "../paths";
import { isUnreviewedMerge } from "../insights";

test("public model choices retain host options and only apply configured exclusions", () => {
  const models = [
    { provider: "codex", id: "demo-fast-model", thinking: ["low", "ultra"] },
    { provider: "cursor", id: "demo-model", thinking: ["high"] },
  ];
  assert.deepEqual(pickableModels(models), models);
  for (const row of models) assert.equal(swapRefusal(row.provider, row.id, "ultra"), null);
  assert.equal(swapRefusal("cursor", "demo-model", "high", ["cursor"]) === null, false);
  assert.deepEqual(pickableModels(models, ["cursor"]), [models[0]]);
  assert.equal(swapRefusal("", "demo-model", null) === null, false);
});

test("unreviewed merges use a rolling window independent of the calendar year", () => {
  for (const year of [2020, 2024, 2030]) {
    const now = Date.parse(`${year}-01-10T12:00:00Z`);
    const merged = { mergedAt: `${year}-01-09T12:00:00Z`, reviewerAgentId: null };
    assert.equal(isUnreviewedMerge(merged, now), true);
    assert.equal(isUnreviewedMerge({ ...merged, reviewerAgentId: "demo-reviewer" }, now), false);
    assert.equal(isUnreviewedMerge({ ...merged, mergedAt: `${year}-01-03T12:00:00Z` }, now), false);
    assert.equal(isUnreviewedMerge({ ...merged, mergedAt: null }, now), false);
    assert.equal(isUnreviewedMerge({ ...merged, mergedAt: "invalid" }, now), false);
  }
});

test("registered projects sort by configured code without a built-in project list", () => {
  const rows = supervisorSlots({
    projects: { demoFirst: { code: "AAA" }, demoSecond: { code: "ZZZ" } },
    supervisors: { demoSecond: "demo-second", demoFirst: "demo-first" },
  });
  assert.deepEqual(rows.map(row => row.project), ["demoFirst", "demoSecond"]);
});

test("legacy migration discovery accepts an explicit directory without embedding an owner's path", () => {
  const env = { AFC_LEGACY_DATA_DIR: "/demo/previous-state" };
  assert.equal(legacyStateDir("/demo/home", env), env.AFC_LEGACY_DATA_DIR);
  const choice = chooseDataDir(env, "/demo/home", path => path === "/demo/previous-state/plans.json");
  assert.equal(choice.source, "legacy");
  assert.equal(choice.dir, "/demo/previous-state");
  const overridden = chooseDataDir({ ...env, AFC_DATA_DIR: "/demo/current-state" }, "/demo/home", () => true);
  assert.equal(overridden.source, "override");
  assert.equal(overridden.dir, "/demo/current-state");
});

test("optional plugin status checks use the configured id and distinguish an exact row", async () => {
  const { parseStatusOutput } = await import("../../shared/access-parse");
  const stdout = "PLUGIN                  STATUS          ENABLED\n" +
    "demo-chat-other         stopped         yes\n" +
    "demo-chat               running         yes\n";
  const outcome = { stdout, stderr: "", ok: true, timedOut: false, missing: false, abortedLogin: false };
  assert.equal(parseStatusOutput("slack-plugin", outcome).state, "unknown");
  assert.equal(parseStatusOutput("slack-plugin", outcome, "demo-chat").state, "in");
  assert.equal(parseStatusOutput("slack-plugin", outcome, "demo-chat-other").state, "out");
  assert.equal(parseStatusOutput("slack-plugin", outcome, "demo-missing").state, "out");
});
