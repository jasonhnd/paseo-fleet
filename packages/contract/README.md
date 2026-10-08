# fleet-quota/v1 contract

The file contract between Fleet Cockpit and Kanban for Paseo (see `docs/CONTRACT.md`). It is not published to npm: both plugins keep zero runtime dependencies, so `scripts/sync-contract.mjs` copies the source into each plugin package and CI checks that every copy is identical.

| Source | Copied to | Contents |
|---|---|---|
| `src/shared/` | `packages/<plugin>/shared/contract/` | zod schemas only. Paseo bundles `shared/` into the client, so nothing here may import a Node built-in (`node:*`). |
| `src/server/` | `packages/<plugin>/server/contract/` | Data directory paths, atomic writes and the read state machine (absent, invalid, stale, fresh). |

Tests live in `test/` and are not copied.

```sh
npm run contract:sync    # copy src/ into every plugin package
npm run contract:check   # list differences, exit 1 when a copy differs (CI)
```

Change the contract here, never in a plugin's copy.
