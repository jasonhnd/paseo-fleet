# Fleet data and readers

## Paths and state

| Location | Contents or precedence |
|---|---|
| `AFC_DATA_DIR` | Explicit Fleet data directory, highest priority. |
| `$PASEO_HOME/plugin-data/agent-fleet-cockpit/` | Default. |
| `~/.config/fleet-roles` or `AFC_LEGACY_DATA_DIR` | Transitional fallback when new data has no `plans.json`/`decisions.json` and legacy state does. |
| `ROLES_STATE_DIR` | Explicit roles-command state; set alongside `AFC_DATA_DIR` for isolated tests. |
| `plans.json` | User's pools, adapters, cycles/timezones, manual readings, thresholds and priority. |
| `afc.config.json` | Language, display/provider policy, dispatch overrides and optional adapter switches. |
| `decisions.json`, usage/dispatch snapshots, logs | Private decisions and operational state. |
| `exports/` | Versioned cockpit, pool-status, dispatch-matrix and open-decisions files. |
| `secrets/`, `backups/` | Private optional adapter state and consistent migration backups. |

Current source: `server/paths.ts`, `server/settings.ts`. Fresh plans start empty; examples are opt-in demo data, not real prices or readings. Existing configurations are not overwritten on first-run initialization.

## Reader and writer inventory

| Integration | Reads / stores | Control or boundary |
|---|---|---|
| Role preview | Public provider/model/mode catalog; produces role JSON. | User invokes discovery/preview; no login proof, profile write or credential read. Manually configure profiles in Paseo. |
| Host/dispatch | Configured profiles and provider usage reports; computes pool state and dispatch matrix. | Configure plans and profile-to-pool mappings. No configured pools means no quota protection. |
| `claude-cli`, `codex-cli`, `grok-cli`, `muse-msp`, `opencode-go-api` | Usage windows from the configured Paseo provider transport and adapter-specific state. | Configure only relevant pools/providers; use `manual` to avoid automatic quota reads for that pool. Authentication remains the provider/user's responsibility. |
| `manual` | User-supplied percentage, recording time/source and reset/cycle boundaries. | Explicit entry; unknown/expired readings are not zero. `quotaProtection=none` disables the guard, not a claim of available quota. |
| Optional `cursor-api` | Official usage with Fleet's own optional token store, CLI screen fallback and login-state diagnostics; stores private usage/login state. | Fresh config: `adapters.cursor-api=false`. Explicit false disables it, including previously active legacy markers; choose manual readings instead. Never copy another tool's credentials. |
| Optional macOS keychain probe | Presence/status metadata and probe state, not secret values. | Fresh config: `adapters.keychain=false`; macOS-only. Explicit false disables it. An unset legacy switch can follow an existing state marker. |
| Optional `antigravity-cli` | Display-only local `agy /usage` table. Not a Paseo provider read and not an execution channel. | Off unless `adapters.antigravity-cli` is true. See below. |
| Kanban companion | Contract board summary/information; compatibility paths also inspect board/config/doctor state. | Optional companion; absence hides/degrades board integration. See `server/paths.ts` and [CONTRACT](CONTRACT.md). |
| Optional sidebar roster | Explicitly selected roster persistence directory. | Requires `AFC_SANDBOX_ROSTER_DIR`; no implicit personal application directory. |
| Decisions/roles CLI | Private decisions, role mapping and project pause state. | Explicit command/user action, using current installed commands and selected data directories. |

Hiding a pool is a display setting, not a dispatch stop. Use pool dispatch/protection settings for routing, and explicit adapter switches to disable optional readers. To stop all Fleet background activity, disable the plugin. No adapter promises remaining subscription quota when its transport cannot report it.

## Antigravity CLI display

`antigravity-cli` is optional and off by default. There is no in-use marker: a file in the data directory does not start it, and a missing `agy` command is not launched. Turning the switch on reads `agy -p "/usage"` in an empty temporary directory, with a timeout. The table can show a Gemini bucket and a Claude/GPT bucket. Each bucket is its own plan. The rows are the weekly and five-hour values from that table, labeled as the agy CLI.

Those rows are not the Paseo ACP dispatch pool. The ACP row stays unknown, so the pool is not dispatched, unless the CLI observation and the ACP observation carry the same version, the same tier, and the same quota-source key, each with an observation time. A product name is not that key. The shipped reader records the CLI table only and leaves the ACP observation empty, so the hold stays in place. A hand-copied percent does not replace that ACP row. `quotaProtection` set to `none` turns this guard off on purpose.

Suggested shape, with no live percentages:

```json
{
  "id": "example-antigravity-gemini",
  "name": "Example Antigravity Gemini",
  "adapter": "antigravity-cli",
  "antigravityBucket": "gemini",
  "providers": ["antigravity"],
  "dispatch": false,
  "quotaProtection": "pause"
}
```

A Claude/GPT display plan uses `"antigravityBucket": "claude-gpt"` and the same provider id `antigravity`. It does not use `claude` or `codex`, and it does not create a Claude ACP profile. The five-hour reset is shown when the table includes one. Dispatch does not invent a window start, so that shorter row does not by itself exhaust the pool.

## Backup, migration and removal

Default `PASEO_HOME` is `~/.paseo`. Inspect the plugin's startup data-directory log before backup or migration; legacy installs may still use their previous directory. Do not assume a new install source moves old data. The installed code/CLI path can change on a Git update.

Keep configuration, decisions, usage snapshots, logs, exports, backups and any `secrets/` private. Pause Fleet writers, then copy `plans.json`, `afc.config.json`, `decisions.json` and `exports/` together with any other private state in the selected data directory. Only when also backing up Kanban should you take a consistent SQLite snapshot of `kanban.db`; do not copy an active database/WAL. Back up `$PASEO_HOME/plugin-settings/<id>` and enabled state separately from plugin-data. Removal preserves plugin-data but can delete plugin settings and a managed Git checkout. Restoration and code downgrade do not automatically reverse data writes.

Use `node "$FLEET_INSTALL/bin/afc.mjs" migrate --help` or `node "$BOARD_INSTALL/bin/paseo-kanban.mjs" migrate --help` for the installed migration interface. Rehearse with explicit source/target demo directories before any authorized cutover. Do not publish migration logs or backup contents.

## Isolation and disclosure

For testing, use a disposable Paseo home and loopback listener; set `AFC_DATA_DIR`, `KANBAN_DATA_DIR`, `ROLES_STATE_DIR`, `PASEO_HOME`, `PASEO_URL` and `TMPDIR` before launching commands or the test daemon. No test should discover a personal host or reuse live data. Stop the selected daemon before cleanup.

Plugins run in the local daemon's trust boundary. Integration files and audit rows are not an independent security boundary. Credentials and personal configuration must never be committed, packed, included in screenshots or posted in issues. Doctor/log output requires manual redaction. See [SECURITY](../SECURITY.md), [COMPATIBILITY](COMPATIBILITY.md) and [RELEASE](RELEASE.md).
