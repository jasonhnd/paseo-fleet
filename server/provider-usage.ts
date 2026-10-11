/// <reference types="node" />
import type { PaseoApi } from "./paseo-api";
import { sampleQuota, type QuotaSample, type SamplingOptions } from "./quota-sampling";
import { USAGE_TIMEOUT_MS } from "./quota-timing";
import type { Json } from "./util";

/** Shared by quota assembly and coupon checks. Paseo's own internal cache remains host-owned. */
export function readProviderQuota(paseo: PaseoApi, options: SamplingOptions<Json | null> = {}): Promise<QuotaSample<Json | null>> {
  return sampleQuota("paseo", () => new Promise<Json | null>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("providers.listUsage timed out")), USAGE_TIMEOUT_MS);
    paseo.providers.listUsage().then(value => { clearTimeout(timer); resolve(value as Json | null); },
      error => { clearTimeout(timer); reject(error); });
  }), options);
}
