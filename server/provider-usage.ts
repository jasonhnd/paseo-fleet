/// <reference types="node" />
import type { PaseoApi } from "./paseo-api";
import { sampleQuota, type QuotaSample, type SamplingOptions } from "./quota-sampling";
import { USAGE_TIMEOUT_MS } from "./quota-timing";
import type { Json } from "./util";

export function quotaErrorText(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const row = error as { code?: unknown; type?: unknown; message?: unknown };
    const parts = [row.code, row.type, row.message].filter((value): value is string => typeof value === "string");
    if (parts.length) return parts.join(": ").slice(0, 300);
  }
  return "Provider usage failed";
}

/** Shared by quota assembly and coupon checks. Paseo's own internal cache remains host-owned. */
export function readProviderQuota(paseo: PaseoApi, options: SamplingOptions<Json | null> = {}): Promise<QuotaSample<Json | null>> {
  return sampleQuota("paseo", () => new Promise<Json | null>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("providers.listUsage timed out")), USAGE_TIMEOUT_MS);
    paseo.providers.listUsage().then(value => { clearTimeout(timer); resolve(value as Json | null); },
      error => { clearTimeout(timer); reject(new Error(quotaErrorText(error) ?? String(error))); });
  }), { ...options, errorOf: options.errorOf ?? (value => quotaErrorText(value?.error)) });
}
