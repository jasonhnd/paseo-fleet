/// <reference types="node" />
// Optional Antigravity display reader.
// The local `agy -p "/usage"` table is not the Paseo ACP consumption pool unless both channels report the same
// version, tier and quota-source key. This reader never learns the ACP side, so dispatch stays unknown.
// It does not read credentials, print command output, or call a private backend.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { t } from "../../shared/i18n";
import {
  ANTIGRAVITY_ACP_WINDOW,
  ANTIGRAVITY_FIVE_HOUR_WINDOW,
  ANTIGRAVITY_WEEK_WINDOW,
  type AntigravityBucket,
} from "../../shared/quota-adapters";
import { validPercent } from "../../shared/quota-cycle";
import type { UsageWindow } from "../../shared/usage";
import { LIVE_READING_TTL_MS, POOL_REFRESH_MS } from "../quota-timing";

export const AGY_USAGE_COMMAND = { bin: "agy", args: ["-p", "/usage"] as const };
const OUTPUT_CAP = 64 * 1024;
const AGY_TIMEOUT_MS = 20_000;
const LOGIN = /not logged in|login required|sign in to|authentication required/i;
/** A product name is not evidence that the CLI table and the ACP channel spend one pool. */
const GENERIC_QUOTA_SOURCES = new Set([
  "antigravity", "agy", "agy-cli", "paseo-acp", "acp", "cli", "google",
  "gemini", "claude", "gpt", "claude-gpt", "pro", "free", "free-tier",
]);

export type AntigravityChannel = "agy-cli" | "paseo-acp";
export interface ChannelObservation {
  channel: AntigravityChannel;
  version: string | null;
  tier: string | null;
  quotaSource: string | null;
  observedAt: string | null;
}
export interface AntigravitySample {
  bucket: AntigravityBucket;
  window: "week" | "five-hour";
  remainingPct: number;
  usedPct: number;
  resetsAt: string | null;
}
export type AntigravityReadError = "missing-cli" | "timeout" | "not-logged-in" | "bad-output" | "failed";
export interface AntigravityReading {
  readAt: string;
  error: AntigravityReadError | null;
  stale: boolean;
  samples: AntigravitySample[];
  cli: ChannelObservation | null;
  acp: ChannelObservation | null;
}
export interface UsageRunResult {
  stdout: string;
  stderr: string;
  code: number | null;
  timedOut: boolean;
  missing?: boolean;
}
export type UsageRunner = () => Promise<UsageRunResult>;

function identity(value: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function observedAt(value: string | null): boolean {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

/**
 * True only when both observations name their own channel and agree on version, tier and a specific quota-source key.
 * Callers recompute this from the observations. A boolean on a plan cannot turn it on.
 */
export function samePoolProven(cli: ChannelObservation | null | undefined, acp: ChannelObservation | null | undefined): boolean {
  if (!cli || !acp) return false;
  if (cli.channel !== "agy-cli" || acp.channel !== "paseo-acp") return false;
  const version = identity(cli.version);
  const tier = identity(cli.tier);
  const source = identity(cli.quotaSource);
  if (!version || !tier || !source || GENERIC_QUOTA_SOURCES.has(source)) return false;
  if (version !== identity(acp.version) || tier !== identity(acp.tier) || source !== identity(acp.quotaSource)) return false;
  return observedAt(cli.observedAt) && observedAt(acp.observedAt);
}

function columns(line: string): string[] {
  const parts = line.includes("\t") ? line.split("\t") : line.split(/\s{2,}/);
  return parts.map((part) => part.trim());
}

function bucketOf(label: string): AntigravityBucket | null {
  if (/^gemini\b/i.test(label)) return "gemini";
  if (/claude/i.test(label)) return "claude-gpt";
  return null;
}

function windowOf(label: string): AntigravitySample["window"] | null {
  if (/five[\s-]*hour/i.test(label)) return "five-hour";
  if (/\bweekly\b/i.test(label)) return "week";
  return null;
}

function remainingOf(raw: string): number | null {
  const match = /^(\d+(?:\.\d+)?)%$/.exec(raw.trim());
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}

/** Rows of an agy usage table. Unrecognized pools, bad percents and unparseable resets are dropped, not stored as zero. */
export function parseAntigravityUsage(text: string): AntigravitySample[] {
  const samples: AntigravitySample[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = columns(line);
    const bucket = bucketOf(cells[0] ?? "");
    const window = windowOf(cells[1] ?? "");
    const remaining = remainingOf(cells[2] ?? "");
    if (!bucket || !window || remaining === null) continue;
    const reset = cells[3] ?? "";
    if (reset !== "" && !Number.isFinite(Date.parse(reset))) continue;
    samples.push({
      bucket,
      window,
      remainingPct: remaining,
      usedPct: Math.round((100 - remaining) * 1000) / 1000,
      resetsAt: reset === "" ? null : new Date(Date.parse(reset)).toISOString(),
    });
  }
  return samples;
}

function cliObservation(now: number): ChannelObservation {
  return { channel: "agy-cli", version: null, tier: null, quotaSource: null, observedAt: new Date(now).toISOString() };
}

export function readingFromRun(run: UsageRunResult, now: number): AntigravityReading {
  const readAt = new Date(now).toISOString();
  const base = { readAt, stale: false, cli: cliObservation(now), acp: null, samples: [] as AntigravitySample[] };
  if (run.missing) return { ...base, error: "missing-cli" };
  if (run.timedOut) return { ...base, error: "timeout" };
  const samples = parseAntigravityUsage(run.stdout);
  if (samples.length > 0) return { ...base, error: null, samples };
  const blob = `${run.stdout}\n${run.stderr}`;
  if (LOGIN.test(blob)) return { ...base, error: "not-logged-in" };
  if (run.code !== 0 && run.code !== null) return { ...base, error: "failed" };
  return { ...base, error: "bad-output" };
}

export function unavailableAntigravityReading(now = Date.now()): AntigravityReading {
  return readingFromRun({ stdout: "", stderr: "", code: 1, timedOut: false }, now);
}

let cache: { at: number; reading: AntigravityReading } | null = null;
let inflight: Promise<AntigravityReading> | null = null;

export function resetAntigravityUsageCache(): void {
  cache = null;
  inflight = null;
}

/** One agy process, in an empty temp directory. Timeout and a missing binary stay inside the result. */
export async function runAgyUsage(): Promise<UsageRunResult> {
  const cwd = await mkdtemp(join(tmpdir(), "afc-agy-usage-"));
  try {
    return await new Promise((resolve) => {
      let stdout = "";
      let stderr = "";
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = (result: UsageRunResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(result);
      };
      const take = (current: string, chunk: Buffer) => (current.length >= OUTPUT_CAP ? current : (current + chunk.toString("utf8")).slice(0, OUTPUT_CAP));
      const child: ChildProcess = spawn(AGY_USAGE_COMMAND.bin, [...AGY_USAGE_COMMAND.args], {
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
      });
      timer = setTimeout(() => {
        child.kill("SIGKILL");
        finish({ stdout, stderr, code: null, timedOut: true });
      }, AGY_TIMEOUT_MS);
      child.stdout?.on("data", (chunk: Buffer) => { stdout = take(stdout, chunk); });
      child.stderr?.on("data", (chunk: Buffer) => { stderr = take(stderr, chunk); });
      child.on("error", (error: NodeJS.ErrnoException) => {
        finish({ stdout: "", stderr: "", code: null, timedOut: false, missing: error.code === "ENOENT" });
      });
      child.on("close", (code) => finish({ stdout, stderr, code, timedOut: false }));
    });
  } finally {
    await rm(cwd, { recursive: true, force: true }).catch(() => {});
  }
}

export async function readAntigravityUsage(options: { now?: number; force?: boolean; runner?: UsageRunner } = {}): Promise<AntigravityReading> {
  const now = options.now ?? Date.now();
  if (!options.force && cache && now >= cache.at && now - cache.at < POOL_REFRESH_MS) return cache.reading;
  if (!options.force && inflight) return inflight;
  const runner = options.runner ?? runAgyUsage;
  const box: { current: Promise<AntigravityReading> } = { current: Promise.resolve(unavailableAntigravityReading(now)) };
  box.current = (async () => {
    try {
      const reading = readingFromRun(await runner(), now);
      cache = { at: now, reading };
      return reading;
    } catch {
      const reading = unavailableAntigravityReading(now);
      cache = { at: now, reading };
      return reading;
    } finally {
      if (inflight === box.current) inflight = null;
    }
  })();
  inflight = box.current;
  return box.current;
}

function fresh(readAt: string, now: number): boolean {
  const at = Date.parse(readAt);
  if (!Number.isFinite(at)) return false;
  const age = now - at;
  return age >= 0 && age <= LIVE_READING_TTL_MS;
}

function readErrorText(error: AntigravityReadError | null): string {
  if (error === "missing-cli") return t("quota.antigravity.missingCli");
  if (error === "timeout") return t("quota.antigravity.timeout");
  if (error === "not-logged-in") return t("quota.antigravity.notLoggedIn");
  if (error === "bad-output") return t("quota.antigravity.badOutput");
  if (error === "failed") return t("quota.antigravity.failed");
  return t("quota.antigravity.acpUnknown");
}

function blankWindow(input: {
  id: string;
  label: string;
  primary: boolean;
  usedPct: number | null;
  resetsAt: string | null;
  source: UsageWindow["source"];
  readingState: NonNullable<UsageWindow["readingState"]>;
  cycleKind: NonNullable<UsageWindow["cycleKind"]>;
  readError: string | null;
  apiUsd: number;
  planUsd: number | null;
}): UsageWindow {
  return {
    id: input.id,
    label: input.label,
    primary: input.primary,
    usedPct: input.usedPct,
    resetsAt: input.resetsAt,
    startsAt: null,
    elapsedPct: null,
    projectedPct: null,
    runsOutAt: null,
    verdict: "unknown",
    apiUsd: input.apiUsd,
    fullWindowUsd: null,
    planUsd: input.planUsd,
    source: input.source,
    manualAt: null,
    readingState: input.readingState,
    readError: input.readError,
    cycleKind: input.cycleKind,
    paceEligible: false,
  };
}

function cliLabel(bucket: AntigravityBucket, window: AntigravitySample["window"]): string {
  if (bucket === "gemini" && window === "week") return t("quota.antigravity.geminiWeek");
  if (bucket === "gemini") return t("quota.antigravity.geminiFiveHour");
  return window === "week" ? t("quota.antigravity.claudeWeek") : t("quota.antigravity.claudeFiveHour");
}

export interface AntigravityWindowPlan {
  id: string;
  antigravityBucket?: AntigravityBucket | null;
  priceUsdMonthly?: number | null;
}

/**
 * ACP row first. Its percent is copied from the weekly CLI sample only after `samePoolProven` is recomputed.
 * CLI rows stay display-only: source `screen`, no invented start, and they are not the primary window.
 */
export function antigravityPlanWindows(plan: AntigravityWindowPlan, reading: AntigravityReading | null, now: number, apiUsd = 0): UsageWindow[] {
  const planUsd = plan.priceUsdMonthly ?? null;
  const bucket = plan.antigravityBucket === "gemini" || plan.antigravityBucket === "claude-gpt" ? plan.antigravityBucket : null;
  const proven = reading !== null && reading.error === null && samePoolProven(reading.cli, reading.acp);
  const live = reading !== null && fresh(reading.readAt, now);
  const week = bucket && reading ? reading.samples.find((sample) => sample.bucket === bucket && sample.window === "week") : undefined;
  const five = bucket && reading ? reading.samples.find((sample) => sample.bucket === bucket && sample.window === "five-hour") : undefined;
  const hold = blankWindow({
    id: ANTIGRAVITY_ACP_WINDOW,
    label: t("quota.antigravity.acp"),
    primary: true,
    usedPct: null,
    resetsAt: null,
    source: "none",
    readingState: proven && !live ? "stale" : "unknown",
    cycleKind: "unknown",
    readError: proven && !live ? t("quota.antigravity.stale") : readErrorText(reading?.error ?? null),
    apiUsd,
    planUsd,
  });
  const acp = proven && live && week && validPercent(week.usedPct)
    ? blankWindow({
      id: ANTIGRAVITY_ACP_WINDOW,
      label: t("quota.antigravity.acp"),
      primary: true,
      usedPct: week.usedPct,
      resetsAt: week.resetsAt,
      source: "provider",
      readingState: "live",
      cycleKind: "week",
      readError: null,
      apiUsd,
      planUsd,
    })
    : hold;
  if (!bucket || !reading || reading.error !== null) return [acp];
  const shown = [week, five].flatMap((sample) => sample ? [blankWindow({
    id: sample.window === "week" ? ANTIGRAVITY_WEEK_WINDOW : ANTIGRAVITY_FIVE_HOUR_WINDOW,
    label: cliLabel(bucket, sample.window),
    primary: false,
    usedPct: sample.usedPct,
    resetsAt: sample.resetsAt,
    source: "screen",
    readingState: "live",
    cycleKind: "unknown",
    readError: null,
    apiUsd,
    planUsd,
  })] : []);
  return [acp, ...shown];
}
