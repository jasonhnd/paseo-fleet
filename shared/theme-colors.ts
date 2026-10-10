import type { PluginTheme } from "@getpaseo/plugin";
import { MISSING_HOST_THEME } from "./theme-fallback";

type Channels = readonly [number, number, number, number];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function channels(color: string): Channels | null {
  const hex = color.trim().match(/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    const value = hex[1].length <= 4 ? [...hex[1]].map(c => c + c).join("") : hex[1];
    return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16)).concat(value.length === 8 ? parseInt(value.slice(6), 16) / 255 : 1) as unknown as Channels;
  }
  const match = color.trim().match(/^rgba?\(\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/i);
  if (!match) return null;
  const component = (i: number) => Math.min(255, Number(match[i]) * (match[i + 1] ? 2.55 : 1));
  return [component(1), component(3), component(5), match[7] ? clamp(Number(match[7]) / (match[8] ? 100 : 1)) : 1];
}

function format([r, g, b, a]: Channels): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(a.toFixed(4))})`;
}

/** Ratio is the contribution of b. Unrecognized host syntax preserves a host color. */
export function mix(a: string, b: string, ratio: number): string {
  const left = channels(a), right = channels(b);
  if (!left || !right) return ratio >= 0.5 ? b : a;
  const weight = clamp(ratio);
  return format(left.map((value, i) => value * (1 - weight) + right[i] * weight) as unknown as Channels);
}

/** Derive transparency from a host color, including an existing alpha channel. */
export function withAlpha(color: string, alpha: number): string {
  const value = channels(color);
  return value ? format([value[0], value[1], value[2], value[3] * clamp(alpha)]) : color;
}

/** Style aliases preserve the existing layout; every value comes from the host's eleven keys. */
export function themeColors(theme: PluginTheme | null | undefined) {
  const c = (theme ?? MISSING_HOST_THEME).colors;
  return {
    bg: c.surface0,
    card: c.surface1,
    raised: c.surface2,
    border: c.border,
    text: c.foreground,
    textSecondary: c.foregroundMuted,
    textTertiary: c.foregroundMuted,
    hint: c.foregroundMuted,
    faint: mix(c.foregroundMuted, c.surface0, 0.35),
    track: c.surface2,
    primaryBg: c.accent,
    primaryFg: c.accentForeground,
    green: c.statusSuccess,
    greenBg: mix(c.surface1, c.statusSuccess, 0.1),
    amber: c.statusWarning,
    amberBg: mix(c.surface1, c.statusWarning, 0.1),
    red: c.statusDanger,
    redBg: mix(c.surface1, c.statusDanger, 0.1),
    blue: c.accent,
    link: mix(c.accent, c.foreground, 0.3),
    blueBg: mix(c.surface1, c.accent, 0.1),
    transparent: withAlpha(c.surface0, 0),
  };
}

export type ThemeColors = ReturnType<typeof themeColors>;
