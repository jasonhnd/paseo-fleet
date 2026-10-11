# Hourly quota sampling

AFC initiates quota reads on one fixed one-hour schedule. The first read creates
a persistent anchor in `quota-sampling.json`; subsequent slots start at
`anchor + n * 1 hour`. Success, failure, panel requests and settings edits do not
move that anchor. A newly enabled source may initialize once in the current slot.
After downtime, only the current slot is attempted: missed slots are not replayed.

| Work | Cadence | Data and protection |
|---|---|---|
| Paseo provider usage (Claude, ChatGPT, SuperGrok) | One attempt per slot | AFC call time is separate from source time; legacy `fetchedAt` is the earliest batch timestamp, not an account timestamp. |
| SuperGrok screen, Cursor API/screen, Antigravity CLI | Same hourly slots | Disabled adapters never launch; failure consumes the slot. No automatic login or model task is started to align the clock. |
| Local protection and pool/matrix publication | Every minute, or a settings kick | Rejudge known numbers, manual overrides, resets, expiry, bans and role limits without a new quota read. Renew priority's existing 30-minute validity here. |
| Panel RPC / opening the panel | Existing short refresh interval | Rebuild presentation from samples; show panel update, token-statistics time and quota-source time separately. Unknown source time stays unknown. |
| Display freshness | One hour plus two minutes, capped at reset/explicit expiry | Every window carries its source time and expiry. Rejudge cached company cards against the current time. |
| Dispatch safety expiry | Existing rules | Configured live readings and proven ACP keep their seven-minute limit. Manual TTL, Grok's two-hour carry and Cursor's thirty-minute failed-read carry are not extended. Contract snapshot TTL is unchanged. |

The short safety limits can pause protected pools between hourly attempts. Display
freshness is not permission to dispatch. `quotaProtection: none` retains the
accepted unknown-ACP behavior; explicit disabled pools, bans and role restrictions
still apply. Heartbeat timestamps must not renew a quota sample's age.

The scheduler claims each source slot on disk before calling it. In-process calls
share one promise. A short exclusive file lock serializes reservations and writes
for processes on the same host using the same state directory. It is not a global
lock across hosts or separate data directories. An abandoned lock or unreadable scheduler file refuses sampling instead of
risking a duplicate; an owner must check that no reader is running before removing
an abandoned lock. Reservations survive ordinary process restarts, but no
power-loss durability or distributed-filesystem lock guarantee is claimed.
A crash after reservation consumes that slot. A second process can return the
previous sample while the first is reading; it does not issue another read.

Paseo owns its internal provider cache. AFC cannot change its cadence or prevent
other clients from reading. A valid per-window source timestamp is preferred; the
legacy batch timestamp is labeled as a batch. Missing, invalid or future source
timestamps are unknown, never replaced with the panel or RPC-return time.

AFC currently subscribes to `agent.turn_ended` for usage bookkeeping, not to a
provider quota/rate-limit/authentication failure stream. Existing Cursor login
state and reader failures must propagate through local protection immediately;
hourly caching must not suppress them. For failures outside those entry points,
the owner must disable the affected plan (`dispatch: false`) in Fleet Settings.
Settings publication refreshes local protection without sampling. A general
provider-failure event interface remains a host/integration follow-up; this change
does not add unauthorized listeners. Unknown spending between samples can take
up to one hour plus the timer/reader delay to observe. This cannot guarantee that
a subscription will never exceed its quota.

## Source-only delivery and later validation

Keep contract/manifest, private plan files and model-review settings unchanged.
Build and test locally before review. Installation, release-candidate selection,
daily update and production restart are separate work. Rollback restores the
previous source; its old readers ignore the additive scheduler and display fields.
Preserve the scheduler file on upgrade to keep the anchor. Removing it permits
one new initialization and requires an intentional owner action.

A later independent Edge/desktop card must use an anonymous isolated host with
providers disabled and no model tasks. Verify all five source labels, unknown and
old timestamps, fresh panel timestamps with expired quotas, opening/closing and
restoring the panel, and preserved timestamps after host restart. Then separately
verify the approved RC install, upgrade and rollback without changing private
configuration. Component mounting and fake-clock advancement do not prove a real
hour of elapsed sampling or the original reported six-hour UI incident.
