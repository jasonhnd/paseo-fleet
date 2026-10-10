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
paseo plugin install github:jasonhnd/paseo-fleet     # or straight from this repository
```

From a checkout, install the repository folder itself: `paseo plugin install /absolute/path/to/paseo-fleet`. The repository root is the plugin folder (`paseo-plugin.json`, `OVERVIEW.md`, `package.json`, the two entries, `client/`, `server/`, `shared/`).

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
a Git checkout; release commits must include `bin/*.bundle.mjs`. `npm pack` rebuilds
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

Leader context reminders and swaps are available through the installed plugin:

```sh
afc leader usage --json                 # read-only report for a heartbeat
afc leader swap demo --dry-run          # inspect settings and planned steps
afc leader swap demo                    # confirmation was given in the conversation
afc leader status demo --json           # inspect an interrupted or running swap
afc leader swap demo                    # resume the same swap after a failure
afc leader swap demo --again            # explicitly start another completed shift
afc leader cancel demo                  # clear stopped tracking; keep both sessions
```

The plugin must be running on the selected local daemon. Commands use
`$PASEO_HOME/config.json`'s daemon listen address; `--host 127.0.0.1:PORT`
selects a different local TCP endpoint. IPv6 loopback requires brackets, for example
`--host '[::1]:PORT'`; the daemon listen address must use the same bracketed form.
No login credentials are read. A protected
endpoint can reject the handshake; the command reports the rejection.

Settings stores `leaderUsage.reminderTokens` and `leaderUsage.warningTokens` in
`afc.config.json`, using the existing revision check. Defaults are 500,000 and
750,000 tokens. The warning value must exceed the reminder value. A value strictly
above the reminder is yellow; strictly above the warning is red. Missing or invalid
file settings fall back to both defaults. Home displays the effective thresholds.
`leader usage --json` returns `generatedAt`, `thresholds` and one row per registered
project with `contextTokens` and `level` (`normal`, `reminder`, `warning`, `unknown`).
A heartbeat can report rows whose level is `reminder` or `warning`; `unknown` means
usage could not be read, and must not be treated as zero. This report never resumes
pending shifts.

The CLI invokes `leader.swap` in the plugin, which uses the homepage's shift
runner and state file. It waits for the old session to become idle, requests its
handover, opens a session with the same title, workspace and model settings,
detaches any parent link, waits for the takeover reply **and** Kanban registration,
then archives the old session. Each stage is printed; with `--json`, progress goes
to stderr and the final result goes to stdout. Creation uses a stable host
idempotency key and the new session id is saved before later mutations. Repeating
a pending command continues it; repeating a completed command reports completion.
`--again` is required to deliberately swap the next leader. Keep both sessions when
a step fails and inspect the registry before manual rollback. `leader cancel`
refuses while a swap is running; once stopped, it clears tracking without touching
either session or the registry. For manual rollback, open the old session, register
it with `kanban supervise --project demo`, verify that registration, and only then
archive an orphan new session. If the CLI connection
is interrupted, the plugin may still be running the swap; inspect its status before
rerunning. `--dry-run` performs reads only and does not start or resume a shift.
