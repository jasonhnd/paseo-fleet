/// <reference types="node" />
// Pure view helpers for usage.ts: Cursor read shapes, dispatch/pool/company views and the Cursor link banner.
import type { DispatchStats } from "../shared/dispatch";
import { poolLabel } from "../shared/dispatch";
import { ANTIGRAVITY_CLI, CURSOR_API, isMonthlyWindow } from "../shared/quota-adapters";
import type { CompanyCursorRead, CompanyProviderWindow } from "../shared/quota-companies";
import type { BoardUsage, UsagePlan } from "../shared/usage";
import { cursorLinkOverride, msgUnlinked, type CursorUsageReading } from "./cursor-usage";
import { tAll, type MessageKey } from "../shared/i18n";
import type { CursorReadMeta, PoolStatus } from "./pools";

/** Cursor login-file and lost-login alarms; a stored alarm may be in any catalog language. */
const TOKEN_ALARM_KEYS: readonly MessageKey[] = [
  "cursor.token.mode",
  "cursor.token.save",
  "cursor.token.unreadable",
  "cursor.token.write",
  "cursor.usage.loginLost",
];

function tokenAlarm(value: string | null | undefined): string | null {
  return value && TOKEN_ALARM_KEYS.some((key) => tAll(key).includes(value)) ? value : null;
}

function errorMentionsLogin(error: string): boolean {
  if (/not logged in|press any key to log in/i.test(error)) return true;
  const lower = error.toLowerCase();
  return tAll("usage.view.loginScreenMarker").some((marker) => lower.includes(marker.toLowerCase()));
}

export function cursorReadForPlan(reading: CursorUsageReading | null, manualAt: string | null): BoardUsage["plans"][number]["cursorRead"] {
  if (!reading) return null;
  const live = reading.ok && reading.autoPct !== null;
  return {
    readAt: reading.readAt,
    ok: live,
    includedPct: reading.includedPct,
    autoPct: reading.autoPct,
    apiPct: reading.apiPct,
    onDemandUsd: reading.onDemandUsd,
    onDemandLimitUsd: reading.onDemandLimitUsd,
    usingManual: !live,
    manualAt,
    error: live ? null : reading.error,
    loggedOut: !live && reading.linkBroken !== true && (reading.loggedOut === true || errorMentionsLogin(reading.error ?? "")),
    linkBroken: reading.linkBroken === true,
    via: reading.source === "official" ? "official" : live ? "screen" : "manual",
    alarm: tokenAlarm(reading.homeAlarm),
    ...(reading.screenRead === false ? { screenRead: false as const } : {}),
  };
}

/** Auto percent that decides Cursor dispatch. Official and screen reads both count; a failed read does not. */
export function cursorLivePct(reading: { ok?: boolean; autoPct?: number | null } | null): number | null {
  return reading?.ok === true && typeof reading.autoPct === "number" ? reading.autoPct : null;
}

export function cursorMeta(reading: CursorUsageReading | null, manualAt: string | null): CursorReadMeta | null {
  const shown = cursorReadForPlan(reading, manualAt);
  if (!shown) return null;
  const alarm = shown.alarm ?? null;
  return { ok: shown.ok, readAt: shown.readAt, usingManual: shown.usingManual, manualAt: shown.manualAt, error: shown.error, loggedOut: shown.loggedOut === true, linkBroken: shown.linkBroken === true, ...(shown.screenRead === false ? { screenRead: false as const } : {}), ...(alarm ? { alarm } : {}) };
}

function leaderProfile(name: string | null, supervisorNames: ReadonlySet<string>): string | null {
  if (!name) return name;
  return supervisorNames.has(name) ? "<leader>" : name;
}

/** `labels`: pool id → display name (shared/quota-adapters.ts poolNames(catalog, "label")). */
export function dispatchView(stats: DispatchStats | null, supervisorNames: ReadonlySet<string>, labels: Readonly<Record<string, string>> = {}): BoardUsage["dispatch"] {
  if (!stats) return null;
  return {
    tiers: stats.tiers.map((tier) => ({
      tier: tier.tier,
      profile: leaderProfile(tier.profile, supervisorNames),
      pool: tier.pool,
      poolLabel: tier.pool ? poolLabel(tier.pool, labels) : null,
      cards: tier.cards,
    })),
    costs: stats.byProfileEffort.map((row) => ({ ...row, profile: leaderProfile(row.profile, supervisorNames) ?? row.profile })),
    claude: stats.claude,
  };
}

/** `earlyReset`: quota page line per pool after an official early reset (server/early-reset.ts readEarlyResetLines). */
export function poolView(pools: Record<string, PoolStatus>, earlyReset: Record<string, string> = {}): NonNullable<BoardUsage["pools"]> {
  return Object.fromEntries(
    Object.entries(pools).map(([key, p]) => [key, {
      dispatchable: p.dispatchable,
      deprioritize: p.deprioritize,
      prefer: p.prefer,
      reason: p.reason,
      usedPct: p.usedPct,
      pacePct: p.pacePct,
      daysLeft: p.daysLeft,
      periodDays: p.periodDays,
      dailyPct: p.dailyPct,
      perRunPct: p.perRunPct,
      dailyRuns: p.dailyRuns,
      paceState: p.paceState,
      ...(earlyReset[key] ? { earlyReset: earlyReset[key] } : {}),
    }]),
  );
}

/** Windows of every plan the company cards draw from plan windows; a cursor-api plan's card uses the Cursor read instead. */
export function companyWindows(plans: UsagePlan[], readAt: string): CompanyProviderWindow[] {
  return plans.filter((p) => p.adapter !== CURSOR_API).flatMap((p) => (p.adapter === ANTIGRAVITY_CLI ? p.antigravityDisplay ?? p.windows : p.windows).map((w) => ({
    planId: p.id,
    label: w.label,
    id: w.id,
    cycleKind: w.cycleKind,
    primary: w.primary,
    usedPct: w.usedPct,
    resetsAt: w.resetsAt,
    source: w.source === "manual" || w.source === "none" || w.source === "provider" ? w.source : "screen",
    readAt: w.sampledAt ?? w.manualAt ?? readAt,
    readError: w.readError ?? null,
    readingState: w.readingState,
    readingExpiresAt: w.readingExpiresAt,
  })));
}

export function companyCursor(plans: UsagePlan[], reading: CursorUsageReading | null, cursorRead: CursorReadMeta | null): CompanyCursorRead | null {
  const monthly = plans.find((p) => p.adapter === CURSOR_API)?.windows.find(isMonthlyWindow);
  if (!reading && !monthly) return null;
  const live = reading?.ok === true && reading.autoPct !== null;
  return {
    ok: live,
    loggedOut: cursorRead?.loggedOut === true || reading?.loggedOut === true,
    readAt: reading?.readAt ?? null,
    manualAt: cursorRead?.manualAt ?? monthly?.manualAt ?? null,
    manualUsedPct: live ? null : monthly?.usedPct ?? null,
    resetsAt: monthly?.resetsAt ?? null,
    windows: (reading?.windows ?? []).map((w) => ({
      label: w.label,
      usedPct: w.usedPct,
      onDemandUsd: w.onDemandUsd,
      onDemandLimitUsd: w.onDemandLimitUsd,
      resetsAt: w.resetsAt ?? null,
    })),
    usingManual: !live,
    source: reading?.source === "official" ? "official" : live ? "screen" : null,
    notice: reading?.notice ?? null,
    linkBroken: reading?.linkBroken === true,
    ...(reading?.screenRead === false ? { screenRead: false as const } : {}),
  };
}

function cursorLinkOf(reading: CursorUsageReading | null): NonNullable<BoardUsage["cursorLink"]> {
  const waiting = cursorLinkOverride();
  if (waiting) return waiting;
  if (reading?.linkBroken || reading?.linkState === "broken") return { state: "broken", message: "" };
  if (reading?.linkState === "connected" || reading?.source === "official") return { state: "connected", message: "" };
  return { state: "unlinked", message: msgUnlinked() };
}

export function withCursorLink(board: BoardUsage, companies: BoardUsage["companies"], reading: CursorUsageReading | null): BoardUsage {
  const cursorLink = cursorLinkOf(reading);
  const shown = (companies ?? []).map((card) => (
    card.adapter === CURSOR_API && cursorLink.state === "waiting" ? { ...card, notice: cursorLink.message } : card
  ));
  return { ...board, companies: shown, cursorLink };
}
