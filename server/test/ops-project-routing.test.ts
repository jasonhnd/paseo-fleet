import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { VALID } from "../contract/test/fixtures";
import { emptyDailyState } from "../../shared/doctor-daily";
import type { DoctorReport } from "../../shared/doctor";

const root = await mkdtemp(join(tmpdir(), "ops-project-routing-"));
process.env.AFC_DATA_DIR = join(root, "data");
process.env.ROLES_STATE_DIR = process.env.AFC_DATA_DIR;
process.env.KANBAN_DATA_DIR = join(root, "kanban");
process.env.PASEO_HOME = join(root, "paseo");
delete process.env.AFC_LEGACY_DATA_DIR;
const { kanbanConfigPath } = await import("../paths");
const { afcLeaderId, productionDailyDeps, runDailyOnce, summaryLeaderId } = await import("../doctor-daily");
const { clearKanbanSourceMemo } = await import("../kanban-source");
const { deliverEarlyResetNotices, EARLY_RESET_FILE, setEarlyResetNotify } = await import("../early-reset");
await mkdir(process.env.AFC_DATA_DIR, { recursive: true });
await mkdir(join(process.env.KANBAN_DATA_DIR, "exports"), { recursive: true });
after(() => rm(root, { recursive: true, force: true }));
const legacy = "00000000-0000-4000-8000-000000000001";
const configured = "00000000-0000-4000-8000-000000000002";
const now = Date.parse("2030-01-02T01:00:00Z");
const table = { supervisors: { "paseo-fleet": legacy, "Demo operations": configured } };
const write = (path: string, value: unknown) => writeFile(path, JSON.stringify(value));
const cases = [{ config: {}, expected: legacy }, { config: { opsProject: " Demo operations " }, expected: configured },
  { config: { opsProject: 42 }, expected: legacy }];

test("early-reset delivery reads the configured supervisors entry and marks only successful sends", async () => {
  await write(kanbanConfigPath(), table);
  for (const { config, expected } of cases) {
    await write(join(process.env.AFC_DATA_DIR!, "afc.config.json"), config);
    await write(EARLY_RESET_FILE, { last: {}, events: [{ pool: "demo", at: new Date(now).toISOString(),
      detectedAt: new Date(now).toISOString(), beforePct: 80, afterPct: 0,
      beforeResetsAt: "2030-01-05T01:00:00Z", afterResetsAt: "2030-01-09T01:00:00Z", couponCount: null, notifiedAt: null }] });
    const sent: string[] = [];
    setEarlyResetNotify(async id => { sent.push(id); });
    assert.equal(await deliverEarlyResetNotices(now), 1);
    assert.deepEqual(sent, [expected]);
    assert.equal(await deliverEarlyResetNotices(now), 0);
    assert.equal(JSON.parse(await readFile(EARLY_RESET_FILE, "utf8")).events[0].notifiedAt, new Date(now).toISOString());
  }
});

test("daily health delivery uses the configured project in supervisors and in board summaries", async () => {
  await write(kanbanConfigPath(), table);
  await write(join(process.env.KANBAN_DATA_DIR!, "exports/kanban.json"), VALID.kanban);
  const summary = { ...VALID.boardSummary, projects: [
    { name: "paseo-fleet", code: "LEGACY", leaderAgentId: legacy, root: null },
    { name: "Demo operations", code: "DEMO", leaderAgentId: configured, root: null },
  ] };
  for (const { config, expected } of cases) {
    await write(join(process.env.AFC_DATA_DIR!, "afc.config.json"), config);
    assert.equal(afcLeaderId(table), expected);
    assert.equal(summaryLeaderId(summary), expected);
    // No summary project: the production dependency falls back to supervisors.
    await write(join(process.env.KANBAN_DATA_DIR!, "exports/board-summary.json"), { ...summary, projects: [] });
    clearKanbanSourceMemo();
    const deps = productionDailyDeps();
    assert.equal(await deps.leaderId(), expected);
    const sent: string[] = [];
    let state = emptyDailyState();
    const report = { at: new Date(now).toISOString(), worst: "red", counts: {}, items: [{ id: "demo", title: "Demo",
      status: "red", summary: "Demo setup needed", findings: [{ key: "demo", status: "red", text: "Demo setup needed" }] }] } as DoctorReport;
    assert.equal(await runDailyOnce({ ...deps, now: () => now, run: async () => report,
      loadState: async () => state, saveState: async next => { state = next; }, appendHistory: async () => {},
      notify: async id => { sent.push(id); } }), true);
    assert.deepEqual(sent, [expected]);
    await write(join(process.env.KANBAN_DATA_DIR!, "exports/board-summary.json"), summary);
    clearKanbanSourceMemo();
    assert.equal(await deps.leaderId(), expected);
  }
  await write(join(process.env.AFC_DATA_DIR!, "afc.config.json"), { opsProject: "Demo operations" });
  assert.equal(afcLeaderId({ supervisors: { "DEMO OPERATIONS": configured } }), configured);
  assert.equal(afcLeaderId({ supervisors: [] }), null);
  const noLeader = { ...summary, projects: [{ ...summary.projects[1], leaderAgentId: null }] };
  await write(join(process.env.KANBAN_DATA_DIR!, "exports/board-summary.json"), noLeader);
  clearKanbanSourceMemo();
  assert.equal(await productionDailyDeps().leaderId(), null, "An explicitly unregistered summary leader must not use a stale registration");
});
