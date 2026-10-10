/** Shared by refresh scheduling and live-reading expiry to keep their intervals aligned. */
export const POOL_TICK_MS = 60_000;
export const POOL_REFRESH_MS = 5 * 60_000;
export const USAGE_TIMEOUT_MS = 30_000;
/** Allow the next timer tick, a usage RPC, and publication before expiring the previous reading. */
export const LIVE_READING_TTL_MS = POOL_REFRESH_MS + POOL_TICK_MS + USAGE_TIMEOUT_MS + 30_000;
