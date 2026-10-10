import type { PluginTheme } from "@getpaseo/plugin";

/** Neutral compatibility colors used only when an older host provides no theme. */
export const MISSING_HOST_THEME: PluginTheme = {
  colors: {
    surface0: "#f8f8f8",
    surface1: "#f0f0f0",
    surface2: "#e8e8e8",
    border: "#b0b0b0",
    foreground: "#202020",
    foregroundMuted: "#606060",
    accent: "#404040",
    accentForeground: "#fafafa",
    statusSuccess: "#484848",
    statusWarning: "#505050",
    statusDanger: "#383838",
  },
};
