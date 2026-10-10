# Compatibility and troubleshooting

Both manifests declare Paseo `>=0.11.0 <0.12.0`. Check **both daemon and desktop app** versions; a compatible daemon does not prove a compatible app. A future host version needs compilation, integration and desktop checks before widening this range.

## Requirements and evidence

| Component | Requirement or evidence boundary |
|---|---|
| Paseo | Daemon and app in the manifest range; global plugins switch and individual plugins enabled. |
| Node | Fleet commands require >=22.13.0; Kanban declares >=22.5 with usable `node:sqlite`. Use >=22.13.0 for both. Test SQLite availability in the daemon's Node environment. |
| npm | Needed for source development and both plugins' Git preparation on the daemon's PATH. |
| Git | Needed for coding cards, temporary workspaces and Git-source installations. |
| Providers | User-installed and user-authenticated local providers. Discovery is not proof of login, quota or a successful request. |
| Review | Two confirmed model families for the current automatic executor/reviewer cycle. |

| Platform | Current statement |
|---|---|
| macOS | Local source/CLI/compiler checks are recorded in the import/toolchain documents. Full clean-host desktop and first-card certification remains a release gate. |
| Linux | Release target; full native workflow verification has not been recorded here. Do not treat compilation as platform certification. |
| WSL2 | Requires a separate Linux-environment validation record. |
| Native Windows | Not supported for the initial release; Node-only commands do not prove the entire workflow or optional shell helpers work. |

No platform is certified by this documentation change. Before release, record the exact OS, Node, daemon and app versions, provider/model, install source and tested companion commit/tag. Optional macOS probes are not requirements for the core workflow.

## Troubleshooting

| Symptom | Next check |
|---|---|
| No provider or no selectable model | Install/enable a local provider in Paseo, complete its login yourself, then rediscover. Never send authentication files to an issue. |
| Provider discovered but request fails | Check the provider's own status; discovery alone does not establish authentication or remaining quota. |
| No role profiles | Fleet Settings can preview profiles; manually create/configure them in Paseo, keeping existing entries. Confirm model families and role fields. |
| Leader created but cannot create/accept cards | Check protocol delivery and self-registration separately. Use the leader launch panel and `kanban_supervise` or CLI `supervise`; hand over a live prior registration. |
| Protocol missing | Use the panel's recovery controls. A normal profile selection does not inject the board protocol; message recovery remains visibly labelled. |
| Empty or unknown quota | Configure only your pools. Refresh or enter a dated manual value; unknown is not zero. A pool with protection disabled has no quota guard. |
| Only one plugin installed | Fleet alone has no board dispatch; Kanban alone has basic ordering and local decisions without Fleet quota protection. |
| Plugin enabled but no panel | Check Settings -> Plugins, plugin logs and the actual desktop entry. `running` and compiler success do not prove client mounting. |
| Host rejects the version | Read the supported range and obtain a compatible app/daemon pair. An unavailable or offline compatibility result is unknown, not a pass. |
| Command bundle missing | Build in the source checkout, or use the installed release artifacts. Check the current installation path after every Git update. |

Run the installed commands with Node:

```sh
node "$FLEET_INSTALL/bin/afc.mjs" doctor --json
node "$BOARD_INSTALL/bin/paseo-kanban.mjs" doctor
```

Doctor reports can contain private paths and project information. Share only manually redacted excerpts. Offline build/type/test checks do not prove authentication, live daemon behavior, data migration or desktop mounting.

## Version changes

Read the target CHANGELOG Notes for host range, contract changes, companion minimum version, upgrade order, migration and rollback limits. Use an explicit tag for **every** Git update:

```sh
paseo plugin update paseo-kanban --check --ref vX.Y.Z
paseo plugin update paseo-kanban --ref vX.Y.Z
```

Replace the id with `agent-fleet-cockpit` for Fleet. Use only a published tag with a recorded full commit. Both plugins run their own `server/prepare.mjs` through manifest `build`. Fleet preparation installs locked dependencies with development tools included and lifecycle scripts disabled, then runs `npm run build`; see [Fleet Git installation](GIT-INSTALL.md). Clean-host validation remains a release prerequisite for each plugin; a successful Kanban installation does not validate Fleet. Back up data and plugin settings before changing sources. Code downgrade does not undo data writes. See [RELEASE](RELEASE.md).
