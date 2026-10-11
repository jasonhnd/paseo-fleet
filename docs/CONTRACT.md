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

The zod definitions of the envelope and each payload are in `shared/contract/`; paths, atomic writes and the read state machine are in `server/contract/`.

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

## Source and copy

Fleet Cockpit's repository (`jasonhnd/paseo-fleet`) is the source. Kanban's repository keeps a vendored copy of `shared/contract/` and `server/contract/`; both plugins keep zero runtime dependencies, so the contract is never an npm package.

| File | Holds |
|---|---|
| `shared/contract/` | zod schemas only. Paseo bundles `shared/` into the client, so nothing here may import a Node built-in. |
| `server/contract/` | Data directory paths, atomic writes and the read state machine (absent, invalid, stale, fresh). |
| `contract.manifest.json` | `contract` (the version, `fleet-quota/v1`) and the sha256 of every file in the two folders. |

```sh
npm run contract:check       # files must match contract.manifest.json; no source needed, an empty contract passes
npm run contract:manifest    # in the source, after changing the contract: rewrite the hashes
FLEET_CONTRACT_SOURCE=<paseo-fleet checkout> npm run contract:check         # in paseo-kanban: same version, identical files
node scripts/sync-contract.mjs --source <paseo-fleet checkout>              # in paseo-kanban: copy the source over
```

Change the contract in the source, never in the copy.

## Actual-model reviewer branches (contract 1.3.0)

The raw/default reviewer configuration is a tier map of configured eligible reviewers.
Fleet resolves the live profiles, applies overrides and quota ordering, then exports
`roles.reviewer.byExecutorModel[actualModel][tier]` as `MatrixEntry[]`. Entries retain
`profile`, `effort`, optional `paused` and optional `order`. Model ids come from actual
profiles (trimmed and lowercased on both sides) rather than provider, family, mode or thinking labels. Empty/unknown actual
model fields and unresolved reviewer profiles cannot authorize review.

A consumer uses the exact branch for the actual executor model, including a replacement
candidate, and rechecks the actual reviewer model. The two nonempty model ids must differ;
the same family with different models is allowed. A present model branch is authoritative:
an absent model/tier or malformed branch cannot borrow candidates from another model or
from family metadata. The schema preserves model keys and rejects malformed model branches
instead of silently stripping them through a legacy union alternative.

Legacy `byExecutorFamily` input is only a candidate migration format: merge each tier's
lists in stored order, deduplicate by profile (first occurrence keeps its settings), then
apply the actual model check. Family is never an independent-review exclusion. Google
executors use the same model comparison and may use any configured eligible reviewer
with a different actual model; old family buckets do not impose a permanent restriction.
This does not authorize Google reviewer profiles or broaden executor/reader/batch tiers.
Paused personal substitutes with `pausedCandidateFor=reviewer` remain visible and paused.
No migration
may widen configured tier eligibility or bypass provider bans, role/candidateFor, pause,
quota, capacity or high-risk review checks. Historical family evidence stays unchanged.

Update Fleet and Kanban together after review. Older consumers do not understand model
branches; verify the synchronized manifest and the consumer before activating the producer.
This source change does not itself update an installed plugin, protocol or profile notes.
The fixed anonymous fixture is `server/contract/test/model-review.fixture.json`; run
`node --import tsx --test server/contract/test/schema.test.ts server/test/model-review.test.ts`
after `npm run build` for the producer/schema/Roles service checks. Consumer capacity and
high-risk cases require the companion's real dispatch entry point as well.
