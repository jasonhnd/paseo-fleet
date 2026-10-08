# Fleet Cockpit

> **Experimental.** Version 0.1 targets Paseo 0.11 only (`>=0.11.0 <0.12.0`) and may change without notice.

Fleet Cockpit gives the lead of a team of coding agents one screen in Paseo:

- **Roles.** Who plays lead, executor, reviewer, reader, decision maker and batch worker, and which model each role uses.
- **Quota pacing.** Reads each subscription's usage from its own command-line tool, compares it with the reset cycle, and marks every quota pool as preferred, dispatchable or paused, so work goes where there is room.
- **Decisions inbox.** Questions that only a person can answer, each with lettered options and a recommendation.

It works alone. Together with [Kanban for Paseo](https://www.npmjs.com/package/@jasonhnd/paseo-kanban) it publishes the quota snapshot and dispatch matrix that the board uses to pick a model for each card (`fleet-quota/v1`, see `docs/CONTRACT.md` in the repository).

## What it reads and where it stores data

All data lives in `$PASEO_HOME/plugin-data/agent-fleet-cockpit/` (default `~/.paseo/plugin-data/agent-fleet-cockpit/`). Optional readers are off by default. The full list is in `docs/DATA.md` in the repository.

## Source

<https://github.com/jasonhnd/paseo-fleet/tree/main/packages/fleet-cockpit>
