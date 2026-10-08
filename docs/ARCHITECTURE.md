# Architecture

> Skeleton. The sections below are filled in when the plugin code is imported.

## Two plugins, two repositories

- **Fleet Cockpit** (this repository, `jasonhnd/paseo-fleet`, plugin id `agent-fleet-cockpit`): roles, quota pacing, decisions inbox.
- **Kanban for Paseo** (`jasonhnd/paseo-kanban`, plugin id `paseo-kanban`): the board, dispatch, review and acceptance.

Each repository is one npm package whose root is the Paseo plugin folder, so `paseo plugin install github:<owner>/<repository>`, `npm:<package>` and a local checkout all install the same layout. The plugins never import each other. They exchange data through files described in [CONTRACT.md](CONTRACT.md), so each one works alone.

## Plugin layout

The repository root follows the Paseo plugin layout (`@getpaseo/plugin` 0.11):

| Path | Runs in | Rule |
|---|---|---|
| `index.client.tsx`, `client/` | the Paseo app | No Node built-ins. |
| `index.server.ts`, `server/` | a daemon child process | May use Node built-ins. |
| `shared/` | both | Bundled into the client too, so no `node:*` imports. |
| `shared/locales/` | both | `en.json` is the source language; other languages are translations. |
| `bin/` | your shell | Command-line tools that read the same data directory outside the daemon. |

No other code module sits in the root. `scripts/` holds the repository's own gates (plain Node scripts, never published, never compiled by Paseo).

Paseo compiles TypeScript itself and provides `@getpaseo/*`, React, React Native, zod and TanStack Query, so they are dev dependencies. The plugins have no runtime dependencies.

## Contract

The `fleet-quota/v1` schemas live in `shared/contract/` and the file I/O in `server/contract/`. This repository is the source; paseo-kanban keeps a vendored copy of the same two folders. `contract.manifest.json` records the contract version and a hash of every file, and `scripts/sync-contract.mjs` checks it (see [CONTRACT.md](CONTRACT.md#source-and-copy)).

## Shared gates

`scripts/`, `.githooks/` and `.github/workflows/` are byte-identical in both repositories. `scripts/compare-scripts.mjs` (part of `npm run verify` when `PASEO_FLEET_SIBLING` points at the other checkout) refuses any difference.
