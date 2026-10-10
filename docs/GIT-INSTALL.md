# Git installation and switching an existing daemon

Paseo 0.11 clones the selected Git revision into a managed directory. It does not
infer dependency installation from a lockfile. This repository declares the
preparation command `npm ci --omit=dev --ignore-scripts` in the manifest's `build`
field. Preparation runs before compilation and activation on install and update.
Node 22.13 or newer and npm must be available on the daemon's PATH.

Server API types come from `PluginHandlerContext["paseo"]` in
`@getpaseo/plugin/server`. Background tasks also need a connection before the first
handler or hook runs. Their factory is committed as `server/paseo-client.bundle.mjs`,
built from the development-only client SDK by `npm run build`. Its protocol, relay
and Zod dependencies are locked production dependencies. Git consumers do not
install the client SDK or development tools. Rebuild and commit the generated
module whenever its input or the pinned SDK changes. Plugin IDs, surfaces and
registration stay the same.

Paseo supplies Zod and its supported SDK runtime entries to plugin bundles. Ordinary
Node modules still need their declared dependencies. Shared code must stay runtime
neutral, including type imports. The same rules apply to other plugins: an offline
build with a contributor's node_modules is insufficient evidence for a Git release.
Test a tagged checkout with only production dependencies and a fresh daemon home.
For npm publication, remove the Git-only preparation command from the npm artifact;
npm installation already installs production dependencies, and the npm whitelist
does not include this repository's lockfile.

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
installed `node bin/afc.mjs --help` and `roles ls`, `update --check --ref`, and a
plugin-data marker surviving removal. Delete only the test tags afterwards. A fresh
daemon can have no agent records or role profiles; unresolved dispatch slots warn
until configured. This is separate from compiler or runtime errors.

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

# Point both commands at the installed, already-built Node entry, with the correct home.
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const plugin = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "plugin-after.json"), "utf8"));
const entry = path.join(plugin.path, "bin", "afc.mjs");
if (!fs.existsSync(entry) || !fs.existsSync(path.join(plugin.path, "bin", "roles.bundle.mjs")))
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

# Check identity, revision, saved enabled state, logs, data and the built commands.
p plugin ls agent-fleet-cockpit --json
p plugin logs agent-fleet-cockpit --json
p plugin update agent-fleet-cockpit --check --ref "$AFC_TAG" --json
"$AFC_SHIM_DIR/afc" --help
"$AFC_SHIM_DIR/roles" ls
```

Expect Git source identity, the approved tag's commit, and `running` when both
saved enabled switches were on; otherwise expect `disabled`. Open the daily
host's AFC cockpit and AFC settings page, confirm the saved language/configuration
and plugin-data are present, and check logs for compilation or initialization
errors. Confirm `command -v afc` and `command -v roles` select these shims. Git updates
replace the managed directory, so regenerate the shims after every applied update.
An ordinary update checks default HEAD, not the install tag; use an explicit `--ref`
when retaining a release revision.

If installation or a check fails, keep the plugins paused and use rollback in the
same shell. Restore settings again from the untouched backup, restore the old
source/enabled state, then restore the previous shims. The old directory must still
have its original dependencies and built commands.

```sh
afc_pause
# If a failed install left no AFC entry, skip this remove command.
p plugin remove agent-fleet-cockpit --json
AFC_OLD_DIRECTORY="$(node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json")).oldDirectory)')"
p plugin install "$AFC_OLD_DIRECTORY" --json
afc_restore
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
p plugin ls agent-fleet-cockpit --json
p plugin logs agent-fleet-cockpit --json
if [ -x "$AFC_SHIM_DIR/afc" ]; then "$AFC_SHIM_DIR/afc" --help; fi
if [ -x "$AFC_SHIM_DIR/roles" ]; then "$AFC_SHIM_DIR/roles" ls; fi
```

Keep the backup until the selected daily daemon has been checked independently.
These commands do not migrate, replace or delete AFC's plugin-data.
