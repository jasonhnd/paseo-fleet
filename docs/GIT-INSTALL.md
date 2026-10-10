# Git installation and switching an existing daemon

Paseo 0.11 clones the selected Git revision into a managed directory. It does not
infer dependency installation from a lockfile. This repository declares the
preparation entry `node server/prepare.mjs` in the manifest's `build` field. For a
Git checkout it runs `npm ci --include=dev --ignore-scripts --no-audit --no-fund`,
then `npm run build`. Explicitly including development dependencies also works
when the daemon sets NODE_ENV=production. Preparation runs before compilation and
activation on install and update.
Node 22.13 or newer and npm must be available on the daemon's PATH.

Server API types come from `PluginHandlerContext["paseo"]` in
`@getpaseo/plugin/server`. Background tasks also need a connection before the first
handler or hook runs. Their factory is generated as `server/paseo-client.bundle.mjs`
from the development-only client SDK by `npm run build`. Its protocol, relay and
Zod dependencies are locked production dependencies. The server imports the local
generated module rather than the client SDK. CLI and server bundles contain
third-party code, so they are ignored by Git and never committed. Rebuild locally
after changing their inputs or the pinned SDK. Plugin IDs, surfaces and registration
stay the same.

The build produces five CLI bundles (roles, doctor, migrate, coupon and leader)
through `bin/build-commands.mjs`, plus the background client. Preparation requires
all six files; npm packages include the same six prebuilt bundles.

Paseo supplies Zod and its supported SDK runtime entries to plugin bundles. Ordinary
Node modules still need their declared dependencies. Shared code must stay runtime
neutral, including type imports. The same rules apply to other plugins: an offline
build with a contributor's node_modules is insufficient evidence for a Git release.
Test a tagged checkout that initially has neither dependencies nor bundles, with a
fresh daemon home. Installation requires registry access for the locked dependencies
and enough time and space for development tools and the source build.

This follows the same preparation flow as Kanban for Paseo: a plain Node entry
installs dependencies with development tools included and lifecycle scripts disabled,
builds ignored bundles in Git checkouts, and validates the expected bundle set.
AFC additionally builds its background Node client and keeps protocol and relay
packages as production dependencies for that module's ordinary ESM imports.

`npm run pack:check` and npm's `prepack` build the bundles before checking or packing
the whitelist. npm artifacts keep the same preparation entry, omit the lockfile and
repository build tools, and already include the built CLI and background client.
Preparation falls back to `npm install --include=dev --ignore-scripts --no-audit
--no-fund` and validates those prepacked files without invoking omitted builders.

Sources: [publishing](https://github.com/getpaseo/paseo/blob/main/public-docs/plugins/publishing.md)
and [runtime and CLI reference](https://github.com/getpaseo/paseo/blob/main/public-docs/plugins/reference.md).

## Isolated validation

Create a new home under the task's temporary directory. Write `config.json` before
starting the daemon, with a different `daemon.listen`, relay disabled and providers
disabled through `agents.providers`. Point HOME, PASEO_HOME, AFC_DATA_DIR,
AFC_LEGACY_DATA_DIR, KANBAN_DATA_DIR and ROLES_STATE_DIR at isolated locations.
Use the bundled web UI and a separate browser profile. Select the isolated endpoint
explicitly with `--host`; do not combine `--host` and `--home`.

The release check must cover a temporary tag through `file://`, status `running`,
ID `agent-fleet-cockpit`, backend logs, the actual cockpit and settings screens,
installed `node bin/afc.mjs --help`, `leader --help` and `roles ls`, `update --check --ref`, and a
plugin-data marker surviving removal. Delete only the test tags afterwards. A fresh
daemon can have no agent records or role profiles; unresolved dispatch slots warn
until configured. This is separate from compiler or runtime errors.

Run the command blocks with Bash or POSIX `sh`. Pasting them directly into zsh
can produce `bad substitution`; in zsh, run `bash` first.

## Daily AFC switch checklist

These commands are a runbook, not an automatic migration. Run them only in the
shell for the chosen daily daemon, after the release tag has been reviewed. They
pause all plugins on that daemon while replacing AFC, so that the newly installed
plugin cannot run with settings that have not yet been restored. Other plugins
resume when the previous global enabled state is restored.

Set the repository, approved tag, a new backup directory outside the checkout and
the directory containing your command shims. Keep the old directory source for
rollback. Check any AFC_DATA_DIR and ROLES_STATE_DIR overrides before continuing.
The backup contains only AFC's source/enabled state, plugin settings and command
shims; it does not copy the daemon config or credentials.

```sh
set -eu
export PASEO_HOME="${PASEO_HOME:-$HOME/.paseo}"
AFC_REPO="/absolute/path/to/paseo-fleet"
AFC_TAG="<approved-release-tag>"
AFC_BACKUP="/absolute/path/to/new-afc-switch-backup"
AFC_SHIM_DIR="$HOME/.local/bin"
export AFC_BACKUP AFC_SHIM_DIR
p() { paseo --home "$PASEO_HOME" "$@"; }

# Confirm this is the selected daily daemon and the current source is a directory.
p status --json
mkdir -m 700 "$AFC_BACKUP"
p plugin ls agent-fleet-cockpit --json > "$AFC_BACKUP/plugin-before.json"
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const home = process.env.PASEO_HOME, backup = process.env.AFC_BACKUP;
const cfg = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(backup, "plugin-before.json"), "utf8"));
const plugin = Array.isArray(raw) ? raw.find(row => row.id === "agent-fleet-cockpit") : raw;
const identity = plugin?.installation?.identity;
const oldDirectory = identity ? (identity.kind === "directory" ? identity.path : null)
  : (plugin?.source === "git" ? null : plugin?.path);
if (!oldDirectory) throw new Error("Expected the old directory source");
const state = { oldDirectory, enabled: plugin.enabled,
  pluginsEnabled: cfg.pluginsEnabled === true, shims: {} };
fs.mkdirSync(path.join(backup, "shims"));
for (const name of ["afc", "roles"]) {
  const from = path.join(process.env.AFC_SHIM_DIR, name);
  try {
    fs.lstatSync(from);
    fs.cpSync(from, path.join(backup, "shims", name), { dereference: false, verbatimSymlinks: true });
    state.shims[name] = true;
  } catch (error) { if (error.code !== "ENOENT") throw error; state.shims[name] = false; }
}
fs.writeFileSync(path.join(backup, "state.json"), JSON.stringify(state, null, 2), { mode: 0o600 });
NODE

# Poll after restoring/reloading; rollback uses this function too.
afc_wait() {
  AFC_EXPECTED="$(node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json"));console.log(s.enabled && s.pluginsEnabled ? "running" : "disabled")')"
  AFC_ATTEMPT=0
  while :; do
    if p plugin ls agent-fleet-cockpit --json > "$AFC_BACKUP/plugin-status.json"; then
      if AFC_STATUS="$(node -e 'const fs=require("node:fs");const raw=JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/plugin-status.json"));const p=Array.isArray(raw) ? raw.find(p=>p.id==="agent-fleet-cockpit") : raw;console.log(p?.status || "unknown")')"; then
        if [ "$AFC_STATUS" = "$AFC_EXPECTED" ]; then
          cat "$AFC_BACKUP/plugin-status.json"
          p plugin logs agent-fleet-cockpit --json
          return 0
        fi
      fi
    fi
    if [ "$AFC_ATTEMPT" -ge 30 ]; then
      echo "AFC did not reach $AFC_EXPECTED within 60 seconds; inspect logs before rollback." >&2
      p plugin logs agent-fleet-cockpit --json
      return 1
    fi
    sleep 2
    AFC_ATTEMPT=$((AFC_ATTEMPT + 1))
  done
}

# Define pause and restore functions once; rollback uses the same functions.
afc_pause() {
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const file = path.join(process.env.PASEO_HOME, "config.json");
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.pluginsEnabled = false;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2), { mode: 0o600 });
NODE
  p reload --json
}
afc_restore() {
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const from = path.join(process.env.AFC_BACKUP, "settings");
const to = path.join(process.env.PASEO_HOME, "plugin-settings", "agent-fleet-cockpit");
fs.rmSync(to, { recursive: true, force: true });
if (fs.existsSync(from)) fs.cpSync(from, to, { recursive: true });
NODE
  AFC_ENABLED="$(node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json")).enabled ? "yes" : "no")')"
  if [ "$AFC_ENABLED" = yes ]; then p plugin enable agent-fleet-cockpit --json
  else p plugin disable agent-fleet-cockpit --json; fi
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const file = path.join(process.env.PASEO_HOME, "config.json");
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "state.json"), "utf8"));
cfg.pluginsEnabled = state.pluginsEnabled;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2), { mode: 0o600 });
NODE
  p reload --json
}

# Stop plugin activity before taking a consistent settings backup.
afc_pause
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const from = path.join(process.env.PASEO_HOME, "plugin-settings", "agent-fleet-cockpit");
if (fs.existsSync(from)) fs.cpSync(from, path.join(process.env.AFC_BACKUP, "settings"), { recursive: true });
NODE

# Removal preserves the old directory and plugin-data, but clears plugin-settings.
p plugin remove agent-fleet-cockpit --json
p plugin install "file://$AFC_REPO" --ref "$AFC_TAG" --json > "$AFC_BACKUP/plugin-after.json"
afc_restore
afc_wait

# Point both commands at the installed, already-built Node entry, with the correct home.
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const plugin = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "plugin-after.json"), "utf8"));
const entry = path.join(plugin.path, "bin", "afc.mjs");
const commands = ["roles", "doctor", "migrate", "coupon", "leader"];
if (!fs.existsSync(entry) || commands.some(name => !fs.existsSync(path.join(plugin.path, "bin", `${name}.bundle.mjs`))))
  throw new Error("Installed commands are missing");
const quote = value => "'" + value.replaceAll("'", "'\\''") + "'";
fs.mkdirSync(process.env.AFC_SHIM_DIR, { recursive: true });
for (const name of ["afc", "roles"]) {
  const target = path.join(process.env.AFC_SHIM_DIR, name);
  const script = `#!/bin/sh\nset -eu\nexport PASEO_HOME=${quote(process.env.PASEO_HOME)}\n` +
    `exec node ${quote(entry)}${name === "roles" ? " roles" : ""} "$@"\n`;
  fs.rmSync(target, { force: true });
  fs.writeFileSync(target, script, { mode: 0o755 });
}
NODE

# Check identity, revision, data and the built commands after afc_wait.
p plugin update agent-fleet-cockpit --check --ref "$AFC_TAG" --json
"$AFC_SHIM_DIR/afc" --help
"$AFC_SHIM_DIR/afc" leader --help
"$AFC_SHIM_DIR/roles" ls
```

Immediately after reload or restoring the global switch, `plugin ls` may briefly
report `failed`, including for other plugins, then reach `running` after 5–10
seconds with no log errors. Use `afc_wait` after each restore/reload that resumes
plugins: it polls `paseo plugin ls agent-fleet-cockpit --json` on the selected home
every two seconds for up to 60 seconds (plus command execution time), expecting
`running` only when both saved switches were on, otherwise `disabled`. A transient
status is not a failure; only a timeout without the expected status fails the
status check and calls for rollback. Also inspect `plugin logs` for compilation or
initialization errors before deciding the switch succeeded or requires rollback.

A reload result containing `restartRequiredPaths: plugins.agent-fleet-cockpit.path`
reports a source path change. If the listing confirms AFC is `running` from the
new installed path and the logs have no errors, no daemon restart is needed. If it
still uses the old path, restart the selected daemon and repeat `afc_wait` and the
log check. For a saved disabled state, confirm the new path and `disabled` status.

Expect Git source identity, the approved tag's commit, and `running` when both
saved enabled switches were on; otherwise expect `disabled`. Open the daily
host's AFC cockpit and AFC settings page, confirm the saved language/configuration
and plugin-data are present, and check logs for compilation or initialization
errors. The `afc` shim also routes `afc leader`; no separate leader shim is required.
Confirm `command -v afc` and `command -v roles` select these shims. Git updates
replace the managed directory, so regenerate the shims after every applied update.
An ordinary update checks default HEAD, not the install tag; use an explicit `--ref`
when retaining a release revision.

If installation, the 60-second status check, or another check fails, keep the
plugins paused and use rollback in the same shell. Restore settings again from the untouched backup, restore the old
source/enabled state, then restore the previous shims. The old directory must still
have its original dependencies and built commands.

```sh
afc_pause
# If a failed install left no AFC entry, skip this remove command.
p plugin remove agent-fleet-cockpit --json
AFC_OLD_DIRECTORY="$(node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json")).oldDirectory)')"
p plugin install "$AFC_OLD_DIRECTORY" --json
afc_restore
afc_wait
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const backup = process.env.AFC_BACKUP;
const state = JSON.parse(fs.readFileSync(path.join(backup, "state.json"), "utf8"));
for (const name of ["afc", "roles"]) {
  const target = path.join(process.env.AFC_SHIM_DIR, name);
  fs.rmSync(target, { force: true });
  if (state.shims[name]) fs.cpSync(path.join(backup, "shims", name), target,
    { dereference: false, verbatimSymlinks: true });
}
NODE
if [ -x "$AFC_SHIM_DIR/afc" ]; then "$AFC_SHIM_DIR/afc" --help; fi
if [ -x "$AFC_SHIM_DIR/roles" ]; then "$AFC_SHIM_DIR/roles" ls; fi
```

After rollback, apply the same polling and log checks; do not treat its first
listing as a final failure.

Keep the backup until the selected daily daemon has been checked independently.
These commands do not migrate, replace or delete AFC's plugin-data.
