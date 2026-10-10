/// <reference types="node" />
import type { PluginServerContext } from "@getpaseo/plugin/server";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildInsights } from "./server/insights";
import { readAgentRecords } from "./server/records";
import { recordTurn } from "./server/ledger";
import { publishFromSnapshotFile } from "./server/dispatch";
import { setEarlyResetNotify } from "./server/early-reset";
import { buildUsage, updatePlan } from "./server/usage";
import { beginCursorConnect, disconnectCursor, startCursorUsage } from "./server/cursor-usage";
import { requestPoolRefreshNow, startPoolRefresh } from "./server/pool-refresh";
import type { PaseoApi } from "./server/paseo-api";
import { changesBoard, readBoardSnapshot, startSnapshotWarm } from "./server/snapshot-cache";
import { readClosedDecision, submitChange } from "./server/decide-change";
import { productionDecideDeps, submitDecision } from "./server/decide-reply";
import { productionLeaderReplyDeps, submitLeaderReply } from "./server/leader-reply";
import { KANBAN_CONFIG, performOverturn, setDecisionMaintEnabled, startDecisionMaintenance } from "./server/decisions-maint";
import { setSweepEnabled, startIdleSweep } from "./server/sweep";
import { beginCompatCheck, startCompatWatch } from "./server/upgrade-watch";
import { startDaemonWatch } from "./server/daemon-watch";
import { startCursorLoginWatch } from "./server/cursor-login";
import { startKeychainProbe } from "./server/keychain-probe";
import { readAccessView, refreshAccess, startAccessCheck } from "./server/access";
import { BIN, DECISIONS, logSwallowed, PASEO_DIR, run } from "./server/util";
import { dataDirChoice, describeDataDir } from "./server/paths";
import { initLanguage } from "./server/language";
import { language, t } from "./shared/i18n";
import { startContractExports } from "./server/exports";
import { agentLinkRpc, boardInsightsRpc, boardSnapshotRpc, changeDecisionRpc, compatCheckRpc, decideReplyRpc, decisionMaintEnabledRpc, leaderReplyRpc, openAgentRpc, overturnDecisionRpc, supervisorShiftRpc, sweepEnabledRpc } from "./shared/board";
import { panelPrefsRpc } from "./shared/panel-prefs";
import { accessRpc } from "./shared/access";
import { doctorRpc } from "./shared/doctor";
import { runDoctor } from "./server/doctor";
import { startDoctorDaily } from "./server/doctor-daily";
import { readPanelPrefs, updatePanelPrefs } from "./server/panel-prefs";
import { leaderSwapRpc, leaderUsageRpc } from "./shared/leader-command";
import { leaderSwap, readLeaderUsage } from "./server/leader-command";
import { requestSupervisorShift } from "./server/supervisor-shift";
import { boardUsageRpc, cursorConnectRpc, cursorDisconnectRpc, planUpdateRpc, resetCouponsRefreshRpc } from "./shared/usage";
import { confirmResetCoupons, startResetCouponConfirm } from "./server/reset-coupons";
import { rolesPageRpc, rolesSetRpc } from "./shared/roles-page";
import { buildRolesPageView, setRoleModel, undoRoleChange } from "./server/roles-page";
import { initializeSettings } from "./server/settings";
import { readSettingsWithDispatch, writeSettingsWithDispatch } from "./server/settings-dispatch";
import { configReadRpc, configWriteRpc } from "./shared/settings";
import { discoverRolesRpc, previewRolesRpc } from "./shared/profile-bootstrap";
import { discoverRoles, previewRoles } from "./server/profile-bootstrap";
import { rolesUndoRpc } from "./shared/roles-history";

export default function contribute(server: PluginServerContext) {
  // Plugin code only gets a Paseo handle inside handlers and hooks; remember the latest one for the timer.
  // The timer keeps the quota snapshot (pool-status.json) fresh for Paseo Kanban even when nobody has AFC open,
  // and connects to the local daemon itself when no handle has come in since the last reload.
  let paseoRef: PaseoApi | null = null;
  const remember = (paseo: PaseoApi) => {
    paseoRef = paseo;
  };
  // Decided once per process (server/paths.ts); say which directory this run reads and writes.
  console.log(`[afc] ${describeDataDir(dataDirChoice())}`);
  initializeSettings();
  console.log(`[afc] language: ${initLanguage()}`);
  const stopContractExports = startContractExports();
  const stopPoolRefresh = startPoolRefresh(() => paseoRef);
  const stopSnapshotWarm = startSnapshotWarm(() => paseoRef);
  void publishFromSnapshotFile().catch((error) => console.error("[afc] dispatch:", String(error).slice(0, 200)));
  const stopCursorUsage = startCursorUsage();
  const stopSweep = startIdleSweep();
  const stopCompat = startCompatWatch();
  const stopDaemonWatch = startDaemonWatch();
  const stopKeychainProbe = startKeychainProbe();
  const stopCursorLogin = startCursorLoginWatch();
  const stopAccessCheck = startAccessCheck();
  const stopDoctorDaily = startDoctorDaily();
  const notifySupervisor = async (agentId: string, text: string) => {
    await run(BIN.paseo, ["send", agentId, "--no-wait", "--prompt", text], 20_000);
  };
  setEarlyResetNotify(notifySupervisor);
  const stopDecisionMaint = startDecisionMaintenance(notifySupervisor);
  const stopResetCoupons = startResetCouponConfirm(() => paseoRef, notifySupervisor);
  server.handle(configReadRpc, async ({ file }) => readSettingsWithDispatch(file));
  server.handle(discoverRolesRpc, async (_, { paseo }) => discoverRoles(paseo));
  server.handle(previewRolesRpc, async (input, { paseo }) => previewRoles(paseo, input));
  server.handle(configWriteRpc, async (input) => {
    const result = await changesBoard(writeSettingsWithDispatch(input));
    if (result.status === "saved" && input.file === "plans") requestPoolRefreshNow();
    return result;
  });
  server.handle(leaderUsageRpc, async (_, { paseo }) => readLeaderUsage(paseo));
  server.handle(leaderSwapRpc, async (input, { paseo }) => leaderSwap(paseo, input));
  server.handle(doctorRpc, async () => runDoctor());
  server.handle(accessRpc, async ({ refresh }) => {
    if (refresh) await refreshAccess("now");
    return readAccessView();
  });
  server.handle(panelPrefsRpc, async (input) => {
    const prefs = input.fontStep === undefined && input.colorMode === undefined ? await readPanelPrefs() : await updatePanelPrefs(input);
    return { ...prefs, language: language() };
  });
  server.handle(boardSnapshotRpc, async ({ force }, { paseo }) => {
    remember(paseo);
    return readBoardSnapshot(paseo, Boolean(force));
  });
  server.handle(boardInsightsRpc, async ({ force }, { paseo }) => {
    remember(paseo);
    return buildInsights(paseo, Boolean(force));
  });
  server.handle(rolesPageRpc, async () => buildRolesPageView());
  server.handle(rolesSetRpc, async (input) => changesBoard(setRoleModel(input)));
  server.handle(rolesUndoRpc, async ({ id }) => changesBoard(undoRoleChange(id)));
  server.handle(openAgentRpc, async ({ agentId }) => {
    // Opening loads the agent; if its working directory is gone, Paseo can crash while starting the provider.
    const rec = (await readAgentRecords()).find((r) => r.id === agentId);
    if (rec && !existsSync(rec.cwd)) {
      return { ok: false, message: t("server.open.cwdMissing", { cwd: rec.cwd }) };
    }
    // `paseo agent open` resolves the agent's workspace on the daemon, so it works for agents the app has not loaded.
    try {
      const out = await run(BIN.paseo, ["agent", "open", agentId, "--json"], 15_000);
      return { ok: /"opened"/.test(out), message: out.trim().slice(0, 200) };
    } catch (e) {
      return { ok: false, message: String(e).slice(0, 200) };
    }
  });
  server.handle(agentLinkRpc, async ({ agentId }) => {
    // Deep link the Paseo app understands: /h/<server>/workspace/<workspace>?open=agent:<id>.
    // Works on the phone even when the app has not loaded that agent yet.
    const rec = (await readAgentRecords()).find((r) => r.id === agentId);
    if (!rec?.workspaceId) return { url: null, message: t("server.open.noWorkspace") };
    if (!existsSync(rec.cwd)) return { url: null, message: t("server.open.cwdMissing", { cwd: rec.cwd }) };
    let serverId = "";
    try {
      serverId = readFileSync(join(PASEO_DIR, "server-id"), "utf8").trim();
    } catch (error) {
      logSwallowed("read paseo server-id", error);
      serverId = "";
    }
    if (!serverId) return { url: null, message: t("server.open.noServerId") };
    const url = `paseo://h/${encodeURIComponent(serverId)}/workspace/${encodeURIComponent(rec.workspaceId)}?open=${encodeURIComponent(`agent:${agentId}`)}`;
    return { url, message: "" };
  });
  server.handle(sweepEnabledRpc, async ({ enabled }) => ({ enabled: await changesBoard(setSweepEnabled(enabled)) }));
  server.handle(decisionMaintEnabledRpc, async ({ enabled }) => ({ enabled: await changesBoard(setDecisionMaintEnabled(enabled)) }));
  server.handle(decideReplyRpc, async (input) => changesBoard(submitDecision(input, productionDecideDeps())));
  server.handle(changeDecisionRpc, async (input) => changesBoard(submitChange(input, { ...productionDecideDeps(), readClosed: readClosedDecision, now: Date.now })));
  server.handle(leaderReplyRpc, async (input) => changesBoard(submitLeaderReply(input, productionLeaderReplyDeps())));
  server.handle(overturnDecisionRpc, async ({ id }) => changesBoard(performOverturn({
    id,
    decisionsPath: DECISIONS,
    kanbanConfigPath: KANBAN_CONFIG,
    notify: notifySupervisor,
  })));
  server.handle(compatCheckRpc, async () => changesBoard(beginCompatCheck({ force: true })));
  server.handle(supervisorShiftRpc, async ({ project, action }, { paseo }) => {
    remember(paseo);
    try {
      const job = await changesBoard(requestSupervisorShift(paseo, project, action));
      return { ok: job.phase !== "failed", message: job.detail, job };
    } catch (error) {
      const detail = t("server.shift.notStarted", { error: String(error).slice(0, 160) });
      return {
        ok: false,
        message: detail,
        job: {
          phase: "failed" as const,
          label: t("shift.phase.failed"),
          detail,
          project,
          code: "",
          oldId: "",
          newId: null,
          contextTokens: null,
          canContinue: false,
          canCancel: false,
          openAgentId: null,
        },
      };
    }
  });
  server.handle(boardUsageRpc, async ({ period }, { paseo }) => {
    remember(paseo);
    return buildUsage(paseo, period);
  });
  server.handle(planUpdateRpc, async (input) => changesBoard(updatePlan(input)));
  server.handle(cursorConnectRpc, async () => changesBoard(beginCursorConnect()));
  server.handle(cursorDisconnectRpc, async () => changesBoard(disconnectCursor()));
  server.handle(resetCouponsRefreshRpc, async (_input, { paseo }) => {
    remember(paseo);
    return changesBoard(confirmResetCoupons(paseo, { force: true }));
  });
  let offTurn = () => {};
  try {
    offTurn = server.on("agent.turn_ended", ({ agent, timeline }, context) => {
      try {
        remember(context.paseo);
        recordTurn(agent, timeline, context);
      } catch (e) {
        console.error("[afc] agent.turn_ended:", String(e).slice(0, 300));
      }
    });
  } catch (e) {
    console.error("[afc] subscribing to agent.turn_ended failed, skipped:", String(e).slice(0, 300));
  }
  return () => {
    stopContractExports();
    stopPoolRefresh();
    stopSnapshotWarm();
    stopCursorUsage();
    stopSweep();
    stopCompat();
    stopDaemonWatch();
    stopKeychainProbe();
    stopCursorLogin();
    stopAccessCheck();
    stopDoctorDaily();
    stopDecisionMaint();
    stopResetCoupons();
    offTurn();
  };
}
