# fleet-quota/v1

How Fleet Cockpit and Kanban for Paseo share data. The public plugin SDK has no cross-plugin RPC, so each producer writes JSON files under its own data directory and the consumer reads them. A missing file means the other plugin is not installed.

## Files

Each plugin's data directory is `$PASEO_HOME/plugin-data/<plugin id>/` (default `~/.paseo`). Producers write into its `exports/` folder.

| File | Producer | Consumer | Refresh | `ttlSeconds` |
|---|---|---|---|---|
| `agent-fleet-cockpit/exports/cockpit.json` | Fleet Cockpit | Kanban | start and every 10 minutes | 1800 |
| `agent-fleet-cockpit/exports/pool-status.json` | Fleet Cockpit | Kanban | after each quota refresh | 900 |
| `agent-fleet-cockpit/exports/dispatch-matrix.json` | Fleet Cockpit | Kanban | after each matrix rebuild | 900 |
| `agent-fleet-cockpit/exports/decisions-open.json` | Fleet Cockpit | Kanban | on every decisions change | 600 |
| `paseo-kanban/exports/kanban.json` | Kanban | Fleet Cockpit | start and every 10 minutes | 1800 |
| `paseo-kanban/exports/board-summary.json` | Kanban | Fleet Cockpit | on board changes (5 s debounce) and every 5 minutes | 900 |

## Envelope

Every file carries:

| Field | Type |
|---|---|
| `schema` | `"fleet-quota/v1"` |
| `producer` | `"agent-fleet-cockpit"` or `"paseo-kanban"` |
| `producerVersion` | the producer's package version |
| `generatedAt` | ISO 8601 date-time |
| `ttlSeconds` | positive integer |

The zod definitions of the envelope and each payload are in `packages/contract/src/shared/`.

## Reading

| Situation | State | Consumer behaviour |
|---|---|---|
| File missing | `absent` | The other plugin is not installed: hide or degrade the feature. |
| Unreadable JSON or wrong `schema` | `invalid` | Log once, then treat as absent. |
| `now - generatedAt > 3 × ttlSeconds` | `stale` | Use with care (Kanban stops trusting `dispatchable`). |
| Otherwise | `fresh` | Use it. |

Writers always write a temporary file and rename it into place.

## Versioning

Inside v1, fields are only added, never removed or redefined. A breaking change starts `fleet-quota/v2` with a `.v2` file name, and the producer writes both versions for one release.
