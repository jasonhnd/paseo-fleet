/// <reference types="node" />
// Every on-disk location the cockpit uses, in one place. Nothing here names a user or a checkout.
//
// Data directory: AFC_DATA_DIR, else `$PASEO_HOME/plugin-data/agent-fleet-cockpit` (PASEO_HOME defaults
// to ~/.paseo). Transition rule, agreed with Paseo Kanban: when AFC_DATA_DIR is not set, the new
// directory has neither decisions.json nor plans.json, and the legacy state directory
// (~/.config/fleet-roles, the path older installs and the `roles` command still use) has one of
// them, keep using the legacy directory. The choice is made once per process.
//
// Other plugins: their install directory comes from `$PASEO_HOME/config.json` (`plugins.<id>.path`);
// Managed AFC instances use their running package location; standalone tools also honor AFC_HOME.
// KANBAN_HOME overrides its host-configured path. Kanban's data directory follows the same pattern as ours:
// KANBAN_DATA_DIR, else its plugin-data directory once it holds a board, else `<install dir>/data`.
import { accessSync, constants, existsSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import { type Env, PLUGIN_IDS, paseoHome, pluginDataDir } from "./contract";
import { hasManagedInstallIdentity, runtimePluginDir } from "./runtime-location";

/** Files whose presence marks a directory as holding real cockpit state. */
export const STATE_MARKERS = ["decisions.json", "plans.json"] as const;
/** Files whose presence marks a directory as holding a Kanban board. */
export const KANBAN_MARKERS = ["kanban.config.json", "kanban.db"] as const;

export type DataDirSource = "override" | "data-dir" | "legacy";

export interface DataDirChoice {
  /** The directory the cockpit reads and writes. */
  dir: string;
  source: DataDirSource;
  /** Where the data lives once migrated (or the override). */
  dataDir: string;
  /** The pre-plugin-data location, probed only for the transition rule. */
  legacyDir: string;
}

type Exists = (path: string) => boolean;

/** The legacy state directory. Kept only so existing installs keep working until they migrate. */
export function legacyStateDir(home: string = homedir(), env: Env = process.env): string {
  return env.AFC_LEGACY_DATA_DIR?.trim() || join(home, ".config", "fleet-roles");
}

function hasAny(dir: string, names: readonly string[], exists: Exists): boolean {
  return names.some((name) => exists(join(dir, name)));
}

/** Pure decision for the cockpit's data directory. `exists` is injectable for tests. */
export function chooseDataDir(env: Env = process.env, home: string = homedir(), exists: Exists = existsSync): DataDirChoice {
  const legacyDir = legacyStateDir(home, env);
  const dataDir = pluginDataDir(PLUGIN_IDS.cockpit, env, home);
  if (env.AFC_DATA_DIR?.trim()) return { dir: dataDir, source: "override", dataDir, legacyDir };
  if (hasAny(dataDir, STATE_MARKERS, exists)) return { dir: dataDir, source: "data-dir", dataDir, legacyDir };
  if (hasAny(legacyDir, STATE_MARKERS, exists)) return { dir: legacyDir, source: "legacy", dataDir, legacyDir };
  return { dir: dataDir, source: "data-dir", dataDir, legacyDir };
}

const choiceMemo = new Map<string, DataDirChoice>();

/** The data directory decision for this process. Decided once per environment and then kept. */
export function dataDirChoice(env: Env = process.env, home: string = homedir()): DataDirChoice {
  const key = [home, env.AFC_DATA_DIR ?? "", env.PASEO_HOME ?? ""].join("\0");
  const hit = choiceMemo.get(key);
  if (hit) return hit;
  const choice = chooseDataDir(env, home);
  choiceMemo.set(key, choice);
  return choice;
}

/** The cockpit's data directory (see the transition rule at the top of this file). */
export function dataDir(env: Env = process.env, home: string = homedir()): string {
  return dataDirChoice(env, home).dir;
}

/** One log line saying which directory is in use and why. */
export function describeDataDir(choice: DataDirChoice): string {
  if (choice.source === "override") return `data dir: ${choice.dir} (from AFC_DATA_DIR)`;
  if (choice.source === "legacy") {
    return `data dir: using the legacy state directory (not migrated yet): ${choice.dir}; after migration it will be ${choice.dataDir}`;
  }
  return `data dir: ${choice.dir}`;
}

const DATA_DIR_LOG = /^\[afc\] data dir: (?:using the legacy state directory \(not migrated yet\): (.+?); after migration it will be .+|(.+?) \(from AFC_DATA_DIR\)|(.+))$/;

/** The directory named by a plugin log line written from `describeDataDir` (`[afc] data dir: …`), else null. */
export function parseDataDirLog(message: string): string | null {
  const match = DATA_DIR_LOG.exec(message.trim());
  return match ? (match[1] ?? match[2] ?? match[3] ?? null) : null;
}

/** Private files (0700 directory, 0600 files) inside the data directory. */
export function secretsDir(env: Env = process.env, home: string = homedir()): string {
  return join(dataDir(env, home), "secrets");
}

/** Cursor login file: `secrets/` now; the old `state/` location is still read while it exists. */
export function cursorTokenPaths(env: Env = process.env, home: string = homedir()): { current: string; legacy: string } {
  const dir = dataDir(env, home);
  return { current: join(dir, "secrets", "cursor-token.json"), legacy: join(dir, "state", "cursor-token.json") };
}

// ---------------------------------------------------------------- installed plugins

/** `$PASEO_HOME/config.json`. */
export function paseoConfigPath(env: Env = process.env, home: string = homedir()): string {
  return join(paseoHome(env, home), "config.json");
}

const pluginsMemo = new Map<string, { mtimeMs: number; plugins: Record<string, unknown> }>();

function installedPlugins(configPath: string): Record<string, unknown> {
  let mtimeMs: number;
  try {
    mtimeMs = statSync(configPath).mtimeMs;
  } catch {
    return {};
  }
  const hit = pluginsMemo.get(configPath);
  if (hit && hit.mtimeMs === mtimeMs) return hit.plugins;
  let plugins: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(readFileSync(configPath, "utf8"));
    const raw = parsed && typeof parsed === "object" ? (parsed as { plugins?: unknown }).plugins : undefined;
    plugins = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  } catch (error) {
    console.error(`[afc] paths: cannot read plugins from ${configPath}:`, String(error).slice(0, 160));
  }
  pluginsMemo.set(configPath, { mtimeMs, plugins });
  return plugins;
}

/** Install directory Paseo loads a plugin from, or null when it is not installed as a directory. */
export function pluginInstallDir(pluginId: string, env: Env = process.env, home: string = homedir()): string | null {
  const row = installedPlugins(paseoConfigPath(env, home))[pluginId];
  if (!row || typeof row !== "object") return null;
  const path = (row as { path?: unknown }).path;
  return typeof path === "string" && path.trim() ? path.trim() : null;
}

/** Every plugin Paseo loads from a directory, in config order. */
export function installedPluginDirs(env: Env = process.env, home: string = homedir()): Array<{ id: string; dir: string }> {
  const out: Array<{ id: string; dir: string }> = [];
  for (const id of Object.keys(installedPlugins(paseoConfigPath(env, home)))) {
    const dir = pluginInstallDir(id, env, home);
    if (dir) out.push({ id, dir });
  }
  return out;
}

/** Nearest ancestor (or the directory itself) that is a git checkout; null when there is none. */
export function checkoutRoot(dir: string, exists: Exists = existsSync): string | null {
  let current = dir;
  for (;;) {
    if (exists(join(current, ".git"))) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

/** Short name for the checkout a plugin lives in, used to match agent working directories. */
export function checkoutName(dir: string, exists: Exists = existsSync): string {
  return basename(checkoutRoot(dir, exists) ?? dir);
}

function envDir(env: Env, name: string): string | null {
  const raw = env[name]?.trim();
  return raw ? raw : null;
}

// ---------------------------------------------------------------- this plugin

/** The running package wins over a host config that is still being updated. */
export function afcPluginDir(env: Env = process.env, home: string = homedir(), runningDir = runtimePluginDir(env, home)): string | null {
  if (hasManagedInstallIdentity()) return runningDir;
  return envDir(env, "AFC_HOME") ?? runningDir ?? pluginInstallDir(PLUGIN_IDS.cockpit, env, home);
}

/** The cockpit's command-line directory: `<plugin>/bin`, or `<checkout>/bin` beside the plugin folder. */
export function afcBinDir(env: Env = process.env, home: string = homedir(), exists: Exists = existsSync, runningDir = runtimePluginDir(env, home)): string | null {
  const plugin = afcPluginDir(env, home, runningDir);
  if (!plugin) return null;
  const inside = join(plugin, "bin");
  if (exists(inside)) return inside;
  return join(dirname(plugin), "bin");
}

/** The `roles` command shipped with the cockpit; plain `roles` (found on PATH) when the plugin location is unknown. */
export function rolesBin(env: Env = process.env, home: string = homedir(), runningDir = runtimePluginDir(env, home)): string {
  const bin = afcBinDir(env, home, existsSync, runningDir);
  return bin ? (existsSync(join(bin, "roles.mjs")) ? join(bin, "roles.mjs") : join(bin, "roles")) : "roles";
}

/** Only publish a regular, executable command. Recheck it on every publication. */
export function afcCli(env: Env = process.env, home: string = homedir(), exists: Exists = existsSync, runningDir = runtimePluginDir(env, home)): string | null {
  const bin = afcBinDir(env, home, exists, runningDir);
  const cli = bin ? join(bin, "afc.mjs") : null;
  try {
    if (!cli || !exists(cli) || !statSync(cli).isFile()) throw new Error("CLI is missing");
    accessSync(cli, constants.X_OK);
    return cli;
  } catch (error) {
    console.warn(`[afc] cockpit CLI unavailable; exporting null (${cli ?? "installation unknown"}):`, String(error).slice(0, 160));
    return null;
  }
}

// ---------------------------------------------------------------- Paseo Kanban (read-only until F6a)

/** Where Paseo Kanban is installed. */
export function kanbanPluginDir(env: Env = process.env, home: string = homedir()): string | null {
  return envDir(env, "KANBAN_HOME") ?? pluginInstallDir(PLUGIN_IDS.kanban, env, home);
}

/** Pure decision for Kanban's data directory. */
export function chooseKanbanDataDir(env: Env = process.env, home: string = homedir(), exists: Exists = existsSync): string {
  const dataDir = pluginDataDir(PLUGIN_IDS.kanban, env, home);
  if (env.KANBAN_DATA_DIR?.trim()) return dataDir;
  if (hasAny(dataDir, KANBAN_MARKERS, exists)) return dataDir;
  const plugin = kanbanPluginDir(env, home);
  const legacy = plugin ? join(plugin, "data") : null;
  if (legacy && hasAny(legacy, KANBAN_MARKERS, exists)) return legacy;
  return dataDir;
}

const kanbanMemo = new Map<string, string>();

/** Kanban's data directory for this process (decided once per environment). */
export function kanbanDataDir(env: Env = process.env, home: string = homedir()): string {
  const key = [home, env.KANBAN_DATA_DIR ?? "", env.KANBAN_HOME ?? "", env.PASEO_HOME ?? ""].join("\0");
  const hit = kanbanMemo.get(key);
  if (hit) return hit;
  const dir = chooseKanbanDataDir(env, home);
  kanbanMemo.set(key, dir);
  return dir;
}

export function kanbanConfigPath(env: Env = process.env, home: string = homedir()): string {
  return join(kanbanDataDir(env, home), "kanban.config.json");
}

export function kanbanDbPath(env: Env = process.env, home: string = homedir()): string {
  return join(kanbanDataDir(env, home), "kanban.db");
}

/** Kanban's install directory, or an empty-named fallback that never exists, so callers just see "missing". */
export function kanbanRoot(env: Env = process.env, home: string = homedir()): string {
  return kanbanPluginDir(env, home) ?? join(paseoHome(env, home), "plugins", PLUGIN_IDS.kanban);
}

/** The board project that Kanban's own `supervisorAgentId` belongs to: the name of Kanban's checkout. */
export function kanbanProjectName(env: Env = process.env, home: string = homedir()): string {
  const plugin = kanbanPluginDir(env, home);
  return plugin ? checkoutName(plugin) : PLUGIN_IDS.kanban;
}
