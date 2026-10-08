# Architecture

> Skeleton. The sections below are filled in when the plugin code is imported.

## Two plugins, one repository

- **Fleet Cockpit** (`packages/fleet-cockpit`, plugin id `agent-fleet-cockpit`): roles, quota pacing, decisions inbox.
- **Kanban for Paseo** (`packages/kanban`, plugin id `paseo-kanban`): the board, dispatch, review and acceptance.

They never import each other. They exchange data through files described in [CONTRACT.md](CONTRACT.md), so each one works alone.

## Plugin layout

Each package follows the Paseo plugin layout (`@getpaseo/plugin` 0.11):

| Path | Runs in | Rule |
|---|---|---|
| `index.client.tsx`, `client/` | the Paseo app | No Node built-ins. |
| `index.server.ts`, `server/` | a daemon child process | May use Node built-ins. |
| `shared/` | both | Bundled into the client too, so no `node:*` imports. |
| `locales/` | both | `en.json` is the source language; other languages are translations. |
| `bin/` | your shell | Command-line tools that read the same data directory outside the daemon. |

Paseo compiles TypeScript itself and provides `@getpaseo/*`, React, React Native, zod and TanStack Query, so they are dev dependencies. The plugins have no runtime dependencies.

## Contract package

`packages/contract` holds the `fleet-quota/v1` schemas and file I/O. `scripts/sync-contract.mjs` copies it into both plugins; CI fails when a copy differs.
