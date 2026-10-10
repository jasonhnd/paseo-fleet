/// <reference types="node" />
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  DEFAULT_PANEL_PREFS,
  parsePanelPrefs,
  type ColorMode,
  type FontStep,
  type PanelPrefs,
} from "../shared/panel-prefs";
import { logSwallowed, STATE_DIR, writeJson } from "./util";
import type { PanelTab } from "../shared/panel-tabs";

/**
 * Next to the other AFC state files. The plugin server is bundled, so a path
 * beside the source file is not available at runtime. This file is outside the repo.
 */
export const PANEL_PREFS_PATH = join(STATE_DIR, "panel-prefs.json");

export async function readPanelPrefs(path = PANEL_PREFS_PATH): Promise<PanelPrefs> {
  try {
    return parsePanelPrefs(JSON.parse(await readFile(path, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") logSwallowed("panel-prefs read", error);
    return { ...DEFAULT_PANEL_PREFS };
  }
}

const writes = new Map<string, Promise<PanelPrefs>>();

/** Serialize read/modify/write so a fast tab click and a font change both survive. */
export async function updatePanelPrefs(
  patch: { fontStep?: FontStep; colorMode?: ColorMode; tab?: PanelTab },
  path = PANEL_PREFS_PATH,
): Promise<PanelPrefs> {
  const pending = (writes.get(path) ?? Promise.resolve()).catch(() => { /* the earlier writer already reported its own failure to its caller */ }).then(async () => {
    const current = await readPanelPrefs(path);
    const next: PanelPrefs = {
      fontStep: patch.fontStep ?? current.fontStep,
      colorMode: patch.colorMode ?? current.colorMode,
      tab: patch.tab ?? current.tab,
    };
    await writeJson(path, next);
    return next;
  });
  writes.set(path, pending);
  try {
    return await pending;
  } finally {
    if (writes.get(path) === pending) writes.delete(path);
  }
}
