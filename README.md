# paseo-fleet

Roles, quota pacing and a decisions inbox for local coding agents in Paseo. A [Paseo](https://github.com/getpaseo/paseo) plugin.

[Simplified Chinese](docs/zh-CN/README.md)

| Package | Plugin id |
|---|---|
| `@jasonhnd/paseo-fleet-cockpit` | `agent-fleet-cockpit` |

> **Experimental, unreleased.** Sources and commands are included; clean-host installation, desktop mounting and first-card validation remain release gates. No stability or response-time commitment is made.

## Choose a combination

| Installed | Capabilities |
|---|---|
| Fleet + Kanban | Roles, quota pacing, decisions and role-based task/review flow. |
| Kanban only | Board, configured role profiles, basic ordering and local decisions; no Fleet quota guard. |
| Fleet only | Roles, quota and decisions; no board dispatch. |

Companion repositories: [Fleet](https://github.com/jasonhnd/paseo-fleet), [Kanban](https://github.com/jasonhnd/paseo-kanban). Integration uses [fleet-quota/v1](docs/CONTRACT.md) files, with independent package versions.

## Requirements

- Paseo daemon **and desktop app** `>=0.11.0 <0.12.0`; plugins enabled globally and individually.
- Node >=22.13.0 for both plugins together. Kanban declares >=22.5 and requires working `node:sqlite`; Fleet declares >=22.13.0. These package floors do not certify every Node/OS combination.
- Git for code cards and workspaces; npm for source builds and Kanban Git preparation on the daemon's PATH.
- At least one user-installed/authenticated local provider for investigation; **two confirmed model families** for the current automatic executor/reviewer card flow.
- macOS and Linux are initial release targets, subject to separate real-world validation. Native Windows is not initially supported; WSL2 must be checked separately. See the [evidence matrix](docs/COMPATIBILITY.md).

## Five-minute setup: installation to the first finished card

Five minutes describes configuration guidance when Paseo and authenticated local providers are already ready. Downloads, login, model startup and agent execution can take longer. This is an **experimental walkthrough awaiting clean-host acceptance**, not a promise that every installation works. Roles are currently preview-only/manual; same-family automatic self-check is not yet available.

1. Run `paseo --version` and `node --version`; check the app version too. Meet [Requirements](#requirements). Log in through your provider yourself.
2. After the first release, install the desired plugins:

   ```sh
   paseo plugin install npm:@jasonhnd/paseo-fleet-cockpit
   paseo plugin install npm:@jasonhnd/paseo-kanban
   paseo plugin ls
   ```

   In host Settings -> Plugins, enable the global switch and the individual plugins. Check their status **and open the desktop panels**. To evaluate source before publication, use a checkout and the build instructions below; do not assume these npm packages or release tags are already available.
3. In Fleet Settings, choose English or Simplified Chinese and preview roles from the available provider/model catalog. Confirm model families and manually create the profiles in Paseo, preserving existing profiles. Configure `role`/`family` and model options from the preview, including a leader (`role=supervisor`), executor and reviewer from different families. Preview does not save profiles or verify login. With Kanban alone, manually configure the same role fields. With one family, stop at manual assessment until an independent reviewer is available; do not claim a completed automatic review cycle. Quota setup may be skipped, with no quota protection; add only your own pools when ready.
4. Create a disposable Git repository/workspace named `demo` with an initial commit. In Kanban project settings, configure its workspace, short code and protected branches. In the project leader panel, choose the leader profile/workspace/language, preview and start the leader. Check protocol delivery. Selecting the same profile in an ordinary conversation is insufficient.
5. In that leader session, call `kanban_supervise` for project `demo`, or run:

   ```sh
   node "$BOARD_INSTALL/bin/paseo-kanban.mjs" supervise --project demo
   ```

   `BOARD_INSTALL` is the current installed directory from `paseo plugin ls --json`. The session uses its own injected identity; do not paste tokens. Confirm registration in the panel. Hand over a live existing leader rather than replacing it.
6. Ask the leader: "Create an L1 card to add hello.md containing exactly Hello and a newline in the demo repository. Verify the file and content. Commit, review and accept locally; do not push or publish." The executor commits and completes its handoff, an independent reviewer checks it, and the lead verifies evidence and accepts it. Check that the card is finished, the file is correct, the working tree is clean and managed cleanup has completed.
7. On failure, use [Compatibility and troubleshooting](docs/COMPATIBILITY.md), plugin logs and the installed Node doctor. Missing protocol or registration blocks dispatch. Fleet alone can test roles/quota/decisions; a finished board card needs Kanban.

Git installations use `paseo plugin install github:jasonhnd/paseo-fleet --ref vX.Y.Z` only after a published, validated tag exists. Always specify `--ref` on updates. Directory installation uses `paseo plugin install "$PLUGIN_CHECKOUT"` after the appropriate source build; a directory source does not select a Git tag. Read the [manual release/update checklist](docs/RELEASE.md) before replacing an existing source.

## Documentation

[Workflow](docs/WORKFLOW.md) · [Data and privacy](docs/DATA.md) · [Compatibility](docs/COMPATIBILITY.md) · [Release/update](docs/RELEASE.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Changelog](CHANGELOG.md)

## Standalone commands

Run `npm run build:cli` in a Fleet checkout before using its Node launchers. Release Git commits must supply the command bundles or a proven preparation path; Fleet Git installation still needs clean-host validation. npm prepack rebuilds bundles. Commands need Node >=22.13.0, without Python or a TypeScript loader.

```sh
node "$FLEET_INSTALL/bin/afc.mjs" --help
node "$FLEET_INSTALL/bin/afc.mjs" roles ls
node "$FLEET_INSTALL/bin/afc.mjs" decide ls
node "$FLEET_INSTALL/bin/afc.mjs" doctor --json
```

The default dispatch template is `shared/default-dispatch.example.json`. It is install data, separate from generated dispatch state. Model choices and optional integrations are configurable. See [DATA](docs/DATA.md) and [the import evidence](docs/IMPORT.md).

An access
map plugin-listing check uses its explicit `pluginId` field; an unspecified id is
reported as unknown.

## Leader context reminders and swaps

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
npm run verify        # required local gates including builds, plugin tests and gitleaks
sh .githooks/pre-push </dev/null   # the push gate itself, without pushing anything
npm run build:check   # compile actual plugin entries with the installed Paseo compiler (required)
npm run typecheck     # tsc on the plugin
npm test              # shared gate-script tests; verify also runs plugin tests
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
