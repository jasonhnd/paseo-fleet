# paseo-fleet

Fleet Cockpit, a [Paseo](https://github.com/getpaseo/paseo) plugin for running a team of coding agents: roles, quota pacing across Claude, Codex and Grok subscriptions, and a decisions inbox.

| Package | Plugin id |
|---|---|
| `@jasonhnd/paseo-fleet-cockpit` | `agent-fleet-cockpit` |

Its companion board, Kanban for Paseo (`@jasonhnd/paseo-kanban`), lives in its own repository, [jasonhnd/paseo-kanban](https://github.com/jasonhnd/paseo-kanban).

> **Status: experimental, not released yet.** This repository holds the skeleton and the privacy gates; the plugin code is imported next. Version 0.1 will target Paseo 0.11 only.

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
client/, server/, shared/, locales/, bin/      plugin code (imported next)
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
npm install                                  # the dev tools (TypeScript, Paseo's plugin types)
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
npm run typecheck     # tsc on the plugin; with no TypeScript yet it passes with a note
npm test              # tests of the scripts themselves
npm run test:plugin   # the plugin's own tests
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
