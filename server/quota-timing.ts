/** Local protection/publication heartbeat. Never a provider sampling cadence. */
export const POOL_TICK_MS = 60_000;
export const POOL_REFRESH_MS = POOL_TICK_MS;
export const QUOTA_SAMPLE_MS = 60 * 60_000;
/** Display freshness does not authorize dispatch. */
export const QUOTA_DISPLAY_TTL_MS = QUOTA_SAMPLE_MS + 2 * POOL_TICK_MS;
export const USAGE_TIMEOUT_MS = 30_000;
/** Preserve the existing seven-minute safety expiry independently of the hourly sampler. */
export const LIVE_READING_TTL_MS = 7 * 60_000;
