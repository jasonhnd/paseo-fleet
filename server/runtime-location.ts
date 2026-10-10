/// <reference types="node" />
import { readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Env, PLUGIN_IDS, paseoHome } from "./contract";
import { installIdentity } from "./install-identity.mjs";

/** Find the package containing an ESM source module or a bundled Node command. */
function modulePluginDir(moduleUrl: string | undefined): string | null {
  if (!moduleUrl?.startsWith("file:")) return null;
  let dir = dirname(fileURLToPath(moduleUrl));
  for (;;) {
    try {
      if (JSON.parse(readFileSync(join(dir, "paseo-plugin.json"), "utf8")).id === PLUGIN_IDS.cockpit) return dir;
    } catch { /* This ancestor is not the cockpit package. */ }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * Paseo 0.11 clears import.meta.url and supplies no __dirname in its CJS factory.
 * Preparation stamps a unique identity into this bundle and the acquired package.
 * Match that identity after Paseo moves staging into its final managed directory;
 * neither the old config path nor another candidate with the same revision can win.
 */
export function runtimePluginDir(
  env: Env = process.env, home = homedir(), moduleUrl: string | undefined = import.meta.url,
  identity: typeof installIdentity = installIdentity,
): string | null {
  const own = modulePluginDir(moduleUrl);
  if (own) return own;
  if (!identity.id || identity.relativeDir === null) return null;
  const plugins = join(paseoHome(env, home), "plugins");
  try {
    for (const plugin of readdirSync(plugins, { withFileTypes: true })) {
      if (!plugin.isDirectory() || plugin.name.startsWith(".")) continue;
      const pluginRoot = join(plugins, plugin.name);
      for (const version of readdirSync(pluginRoot, { withFileTypes: true })) {
        if (!version.isDirectory()) continue;
        const versionRoot = join(pluginRoot, version.name);
        const candidate = resolve(versionRoot, identity.relativeDir);
        if (!candidate.startsWith(versionRoot + "/")) continue;
        try {
          const stamp = readFileSync(join(candidate, "server", "install-identity.mjs"), "utf8");
          if (stamp.includes(`"id":${JSON.stringify(identity.id)}`)) return candidate;
        } catch { /* This installed package does not have this instance's stamp. */ }
      }
    }
  } catch (error) {
    console.warn("[afc] cannot locate the running managed installation:", String(error).slice(0, 160));
  }
  return null;
}

/** A prepared managed bundle must never fall back to the host's previous path. */
export function hasManagedInstallIdentity(): boolean {
  return installIdentity.id !== null && installIdentity.relativeDir !== null;
}
