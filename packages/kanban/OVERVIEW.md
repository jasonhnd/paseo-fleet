# Kanban for Paseo

> **Experimental.** Version 0.1 targets Paseo 0.11 only (`>=0.11.0 <0.12.0`) and may change without notice. It relies on daemon behaviour that is not part of the public plugin API, and every Paseo upgrade is checked before the range is widened.

A board across all your Paseo projects, run by coding agents:

- Cards carry a role (executor, reviewer, reader, decision, batch) and a difficulty tier (L1 to L4). The board starts an agent for each ready card, in its own temporary workspace when the main checkout is busy.
- Finished work goes to a reviewer from a different model family, then to the project lead for acceptance.
- Agents get board tools over MCP: comment, complete with a hand-off, block when a person is needed.

It works alone with a basic dispatch order. With [Fleet Cockpit](https://www.npmjs.com/package/@jasonhnd/paseo-fleet-cockpit) it follows quota pacing and the dispatch matrix (`fleet-quota/v1`, see `docs/CONTRACT.md` in the repository).

## What it reads and where it stores data

All data lives in `$PASEO_HOME/plugin-data/paseo-kanban/` (default `~/.paseo/plugin-data/paseo-kanban/`). The full list is in `docs/DATA.md` in the repository.

## Source

<https://github.com/jasonhnd/paseo-fleet/tree/main/packages/kanban>
