/**
 * Two palettes from docs/UI-DESIGN.md. The values do not come from Paseo.
 * Body notes (times, source lines, explanation) use textTertiary: #8f8f8f on #0a0a0a is 6.12:1,
 * #666666 on #ffffff is 5.74:1. hint is only for secondary marks and can sit under 4.5:1.
 */
export interface Palette {
  bg: string;
  card: string;
  raised: string;
  border: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  hint: string;
  faint: string;
  track: string;
  primaryBg: string;
  primaryFg: string;
  green: string;
  greenBg: string;
  amber: string;
  amberBg: string;
  red: string;
  redBg: string;
  blue: string;
  blueBg: string;
}

export const DARK: Palette = {
  bg: "#0a0a0a",
  card: "#111111",
  raised: "#1a1a1a",
  border: "#262626",
  text: "#ededed",
  textSecondary: "#a1a1a1",
  textTertiary: "#8f8f8f",
  hint: "#737373",
  faint: "#525252",
  track: "#1a1a1a",
  primaryBg: "#ededed",
  primaryFg: "#0a0a0a",
  green: "#3ecf8e",
  greenBg: "#12261c",
  amber: "#f5a524",
  amberBg: "#2a2110",
  red: "#ff5c5c",
  redBg: "#2a1414",
  blue: "#3291ff",
  blueBg: "#102033",
};

export const LIGHT: Palette = {
  bg: "#ffffff",
  card: "#fafafa",
  raised: "#f5f5f5",
  border: "#eaeaea",
  text: "#171717",
  textSecondary: "#4d4d4d",
  textTertiary: "#666666",
  hint: "#8f8f8f",
  faint: "#a3a3a3",
  track: "#ededed",
  primaryBg: "#171717",
  primaryFg: "#ffffff",
  green: "#067647",
  greenBg: "#ecfdf3",
  amber: "#b54708",
  amberBg: "#fffaeb",
  red: "#d92d20",
  redBg: "#fef3f2",
  blue: "#0070f3",
  blueBg: "#f0f7ff",
};

function rgb(input: string): [number, number, number] | null {
  const hex = input.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const fn = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!fn) return null;
  return [Number(fn[1]), Number(fn[2]), Number(fn[3])];
}

/** Paseo surface is the switch. A missing or unreadable color stays on the dark palette. */
export function isDarkSurface(color: string | undefined): boolean {
  const parts = color ? rgb(color) : null;
  if (!parts) return true;
  const y = (0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]) / 255;
  return y < 0.5;
}

export function paletteFor(surface: string | undefined): Palette {
  return isDarkSurface(surface) ? DARK : LIGHT;
}

/**
 * "Follow Paseo" uses surface0. Light and dark return that palette alone, even if Paseo is the other way.
 * An unknown mode follows Paseo.
 */
export function paletteForMode(mode: string | undefined, surface: string | undefined): Palette {
  if (mode === "light") return LIGHT;
  if (mode === "dark") return DARK;
  return paletteFor(surface);
}
