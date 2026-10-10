# paseo-fleet

Fleet Cockpit, a [Paseo](https://github.com/getpaseo/paseo) plugin for running a team of coding agents: roles, quota pacing across Claude, Codex and Grok subscriptions, and a decisions inbox.

| Package | Plugin id |
|---|---|
| `@jasonhnd/paseo-fleet-cockpit` | `agent-fleet-cockpit` |

Its companion board, Kanban for Paseo (`@jasonhnd/paseo-kanban`), lives in its own repository, [jasonhnd/paseo-kanban](https://github.com/jasonhnd/paseo-kanban).

> **Status: experimental, not released yet.** The plugin sources and standalone Node commands are imported. Version 0.1 targets Paseo 0.11 only; clean-host installation and desktop validation remain release prerequisites.

## Install (after the first release)

```sh
paseo plugin install npm:@jasonhnd/paseo-fleet-cockpit
paseo plugin install github:jasonhnd/paseo-fleet --ref <release-tag>
```

From a checkout, install the repository folder itself: `paseo plugin install /absolute/path/to/paseo-fleet`. The repository root is the plugin folder (`paseo-plugin.json`, `OVERVIEW.md`, `package.json`, the two entries, `client/`, `server/`, `shared/`).

Git installs run the manifest's `build` preparation command, `npm ci --omit=dev
--ignore-scripts`, using the committed lockfile. Node and npm must be on the daemon's
PATH. The SDK and UI libraries stay in development dependencies; Paseo supplies its
host modules and Zod. The background client uses the locked production protocol, relay and Zod packages. npm publication must omit the Git-only preparation command
from its release artifact, because an npm install already resolves production dependencies.

For an existing daily daemon, use the backup, switch and rollback checklist in
[Git installation](docs/GIT-INSTALL.md).

Each plugin works alone; together they share quota and board data through files (`docs/CONTRACT.md`):

| Installed | Dispatch | Decisions | Board panel | Quota panel |
|---|---|---|---|---|
| Both | Quota pacing and the dispatch matrix | Fleet Cockpit's inbox | Yes | Yes |
| Kanban only | Basic order | Kanban's built-in list | Yes | No |
| Fleet Cockpit only | None | Fleet Cockpit's inbox | Hidden | Yes |

## Repository layout

```
paseo-plugin.json, OVERVIEW.md, package.json   the plugin @jasonhnd/paseo-fleet-cockpit
client/, server/, shared/, locales/, bin/      plugin code and standalone Node commands
shared/contract/, server/contract/             fleet-quota/v1 source; paseo-kanban keeps a copy
contract.manifest.json                         contract version and file hashes
scripts/, .githooks/, .github/workflows/       gates, identical in paseo-kanban
docs/                                          architecture, recommended workflow, contract, data
```

## Privacy gates

Nothing personal may ever reach this repository or a published package. Three gates enforce it from the first commit:

1. **pre-commit** (`.githooks/pre-commit`): `scripts/check-private.mjs` scans the staged files against the generic rules in `scripts/private-scan.rules.json` (home paths, e-mail addresses, ids, board card numbers, keys and tokens, CJK text outside the zh-CN files (`locales/zh-CN.json` or `locales/zh-CN/`, optionally under `shared/`; `server/protocol/zh-CN/`; `docs/zh-CN/`), real data files) **and** your private denylist; `scripts/check-identity.mjs` refuses any author or committer that is not the placeholder or a GitHub noreply address; `gitleaks` runs when installed.
2. **`npm run verify`**, run by **pre-push** (`.githooks/pre-push`): the whole CI gate set on your machine. It runs the type check, the tests, `check-private --all`, the identity of the next commit and of every commit in history, gitleaks on the history, the contract check, the comparison with paseo-kanban's gates and the package file check. pre-push also checks the identity of every outgoing commit and scans the pushed tree, and refuses the push when anything fails. This local run is the gate of record; `.github/workflows/ci.yml` runs the same checks when GitHub Actions is enabled, but it is never the only entry point.
3. **npm `files` whitelist** in `package.json`, checked by `scripts/check-package-files.mjs` against `npm pack --dry-run`.

### Contributor setup

```sh
npm ci                                       # install the locked development tools
npm run build:cli                            # build the standalone Node commands
npm run hooks                                # git config core.hooksPath .githooks
git config user.name "paseo-fleet contributors"
git config user.email "<id>+<user>@users.noreply.github.com"   # or noreply@example.invalid
mkdir -p ~/.config/paseo-fleet
cp scripts/private-denylist.example.txt ~/.config/paseo-fleet/private-denylist.txt   # then add your own terms
brew install gitleaks                        # or any other install; npm run verify needs it
```

The private denylist lists everything that identifies you (login name, real name, project and folder names). It stays outside every repository; a local commit is refused while it is missing. Use `FLEET_PRIVATE_DENYLIST=<path>` to keep it elsewhere.

### Checks

```sh
npm run verify        # everything below plus gitleaks; exit 0 means the push gate will pass
sh .githooks/pre-push </dev/null   # the push gate itself, without pushing anything
npm run build:check   # compile actual plugin entries with the installed Paseo compiler (required)
npm run typecheck     # tsc on the plugin
npm test              # tests of the scripts themselves
npm run test:plugin   # the plugin's own tests, including standalone CLI coverage
npm run compat        # offline compilation, type check and plugin tests
npm run scan          # check-private.mjs --all: whole tree, generic rules + private denylist
npm run identity      # check-identity.mjs --history: every commit's author and committer
npm run pack:check    # check-package-files.mjs: what npm would publish
npm run contract:check
npm run shared:check  # compare-scripts.mjs: gates identical to paseo-kanban's
```

Two optional settings widen `npm run verify`:

- `PASEO_FLEET_SIBLING=<paseo-kanban checkout>`: every file under `scripts/`, `.githooks/` and `.github/workflows/` must be identical in both repositories. Change a gate in both at once.
- `FLEET_CONTRACT_SOURCE=<repository>` is for the copy in paseo-kanban; here, the source, `contract:check` compares the contract files with `contract.manifest.json`. After changing the contract, run `npm run contract:manifest` (and raise `contract` in the manifest for a breaking change).

When the private denylist flags a word that is not personal in context (a short term), change the wording in the code; do not weaken the list.

## License

[MIT](LICENSE)

## Standalone commands and development

Use Node 22.13 or newer. Build the commands with `npm run build:cli` before installing
a Git checkout; release commits must include `bin/*.bundle.mjs` and
`server/paseo-client.bundle.mjs`. The latter embeds the pinned Node client SDK for
background connections before any RPC handler has supplied a host API. Its development
input is `bin/daemon-client.ts`; the server imports only the generated local module and
obtains API types through `PluginHandlerContext` from `@getpaseo/plugin/server`.
Run `npm run build` after changing the SDK version or connection input. `npm pack` rebuilds
them with `prepack`. Published commands need only Node, without TypeScript loaders,
Python, or development dependencies.

```sh
node bin/afc.mjs --help
node bin/afc.mjs roles ls
node bin/afc.mjs decide ls
node bin/afc.mjs doctor --json
node bin/afc.mjs migrate --help
```

The default dispatch template ships at `shared/default-dispatch.example.json`.
It is install data, separate from generated dispatch state. Profile bindings and
quota priority remain configurable. Model choices follow the host catalog and
configured provider exclusions; installation imposes no personal model restrictions.

Data defaults to `$PASEO_HOME/plugin-data/agent-fleet-cockpit`. `AFC_DATA_DIR`
overrides it, and `ROLES_STATE_DIR` overrides roles-command state only. Legacy
discovery checks `~/.config/fleet-roles`; set `AFC_LEGACY_DATA_DIR` for another
previous state directory, or use migration's explicit `--from` path. The optional
read-only sidebar adapter requires `AFC_SANDBOX_ROSTER_DIR` to select its persistence
directory; it does not probe an owner's application directory by default. An access
map plugin-listing check uses its explicit `pluginId` field; an unspecified id is
reported as unknown.

`npm run compat` is an offline compiler, type-check and regression gate. It does
not contact a daemon or prove desktop mounting, provider authentication, migration
against real data, or installation on another operating system. Those checks belong
to the isolated release validation workflow.
