# paseo-fleet

Two [Paseo](https://github.com/getpaseo/paseo) plugins for running a team of coding agents:

| Package | Plugin id | What it does |
|---|---|---|
| [`@jasonhnd/paseo-fleet-cockpit`](packages/fleet-cockpit) | `agent-fleet-cockpit` | Roles, quota pacing across Claude, Codex and Grok subscriptions, and a decisions inbox. |
| [`@jasonhnd/paseo-kanban`](packages/kanban) | `paseo-kanban` | A cross-project board: agents pick up cards by role, a different model family reviews, the lead accepts. |

> **Status: experimental, not released yet.** This repository holds the skeleton and the privacy gates; the plugin code is imported next. Version 0.1 will target Paseo 0.11 only.

## Install (after the first release)

```sh
paseo plugin install npm:@jasonhnd/paseo-kanban
paseo plugin install npm:@jasonhnd/paseo-fleet-cockpit
```

From a checkout, install a package folder directly: `paseo plugin install ./packages/kanban`.

Each plugin works alone; together they share quota and board data through files (`docs/CONTRACT.md`):

| Installed | Dispatch | Decisions | Board panel | Quota panel |
|---|---|---|---|---|
| Both | Quota pacing and the dispatch matrix | Fleet Cockpit's inbox | Yes | Yes |
| Kanban only | Basic order | Kanban's built-in list | Yes | No |
| Fleet Cockpit only | None | Fleet Cockpit's inbox | Hidden | Yes |

## Repository layout

```
packages/contract/       fleet-quota/v1 schemas and file I/O, copied into both plugins (not published)
packages/fleet-cockpit/  @jasonhnd/paseo-fleet-cockpit
packages/kanban/         @jasonhnd/paseo-kanban
scripts/                 privacy gates, contract sync, package file check
docs/                    architecture, recommended workflow, contract, data
```

## Privacy gates

Nothing personal may ever reach this repository or a published package. Three gates enforce it from the first commit:

1. **pre-commit** (`.githooks/pre-commit`): `scripts/check-private.mjs` scans the staged files against the generic rules in `scripts/private-scan.rules.json` (home paths, e-mail addresses, ids, board card numbers, keys and tokens, CJK text outside `locales/zh-CN.json` and the zh-CN protocol and doc folders, real data files) **and** your private denylist; `scripts/check-identity.mjs` refuses any author or committer that is not the placeholder or a GitHub noreply address; `gitleaks` runs when installed.
2. **`npm run verify`**, run by **pre-push** (`.githooks/pre-push`): the whole CI gate set on your machine. It runs type checks, the tests, `check-private --all`, the identity of the next commit and of every commit in history, gitleaks on the history, the contract copies and the package file check. pre-push also checks the identity of every outgoing commit and scans the pushed tree, and refuses the push when anything fails. This local run is the gate of record; `.github/workflows/ci.yml` runs the same checks when GitHub Actions is enabled, but it is never the only entry point.
3. **npm `files` whitelist** in each package, checked by `scripts/check-package-files.mjs` against `npm pack --dry-run`.

### Contributor setup

```sh
npm install                                  # installs the dev tools; its prepare step also sets core.hooksPath
git config core.hooksPath .githooks          # install the hooks (do this yourself if you skipped npm install)
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
npm run typecheck     # tsc per package; a package with no TypeScript yet passes with a note
npm test              # tests of the scripts themselves
npm run scan          # check-private.mjs --all: whole tree, generic rules + private denylist
npm run identity      # check-identity.mjs --history: every commit's author and committer
npm run pack:check    # check-package-files.mjs: what npm would publish
npm run contract:check
```

When the private denylist flags a word that is not personal in context (a short term), change the wording in the code; do not weaken the list.

## License

[MIT](LICENSE)
