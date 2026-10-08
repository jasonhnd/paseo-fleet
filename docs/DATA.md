# Data: what the plugins read and where they store it

> Skeleton. Every reader is listed here, with how to turn it off, before the first release.

## Where data lives

| Plugin | Data directory | Override |
|---|---|---|
| Fleet Cockpit | `$PASEO_HOME/plugin-data/agent-fleet-cockpit/` | `AFC_DATA_DIR` |

Kanban for Paseo keeps its own directory, `$PASEO_HOME/plugin-data/paseo-kanban/`, described in its repository.

`PASEO_HOME` defaults to `~/.paseo`. One directory holds all of a plugin's data, so backup, migration and removal only deal with that directory. Nothing is ever written into the plugin's install folder.

## Configuration files

| File | Plugin | Holds |
|---|---|---|
| `plans.json` | Fleet Cockpit | Quota pools: name, source adapter, cycle, thresholds, price. |
| `afc.config.json` | Fleet Cockpit | Language and optional adapter switches (all off by default). |

The package ships `examples/*.example.json` with demo values only.

## Readers

To be completed with the import: each quota source adapter, each optional integration, what it reads, what it stores, and the switch that turns it off.
