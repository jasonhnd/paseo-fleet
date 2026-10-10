/// <reference types="node" />
import { delimiter, dirname, join } from "node:path";
import { homedir } from "node:os";

/** Capabilities and release targets do not establish end-to-end validation. */
export function platformCapabilities(platform: NodeJS.Platform = process.platform) {
  return { keychain: platform === "darwin", unixProcesses: platform === "darwin" || platform === "linux",
    releaseTarget: platform === "darwin" || platform === "linux" };
}

/** Prefer the local command directory and retain the caller's PATH order. */
export function commandPath(env: NodeJS.ProcessEnv = process.env, home = homedir()): string {
  return [...new Set([join(home, ".local", "bin"), ...(env.PATH ?? "").split(delimiter).filter(Boolean), dirname(process.execPath)])].join(delimiter);
}
