import assert from "node:assert/strict";
import { test } from "node:test";
import { mix, themeColors, withAlpha } from "../../shared/theme-colors";
import { MISSING_HOST_THEME } from "../../shared/theme-fallback";
import { LIGHT_THEME, DARK_THEME } from "./fixtures/themes";

test("style aliases use all eleven host colors and never select an AFC palette", () => {
  for (const theme of [LIGHT_THEME, DARK_THEME]) {
    const p = themeColors(theme), c = theme.colors;
    assert.equal(p.bg, c.surface0);
    assert.equal(p.card, c.surface1);
    assert.equal(p.raised, c.surface2);
    assert.equal(p.border, c.border);
    assert.equal(p.text, c.foreground);
    assert.equal(p.hint, c.foregroundMuted);
    assert.equal(p.primaryBg, c.accent);
    assert.equal(p.primaryFg, c.accentForeground);
    assert.equal(p.green, c.statusSuccess);
    assert.equal(p.amber, c.statusWarning);
    assert.equal(p.red, c.statusDanger);
    assert.equal(p.blueBg, mix(c.surface1, c.accent, 0.1));
  }
  assert.deepEqual(themeColors(undefined), themeColors(MISSING_HOST_THEME));
  assert.deepEqual(themeColors(null), themeColors(MISSING_HOST_THEME));
  for (const value of Object.values(MISSING_HOST_THEME.colors)) {
    assert.match(value, /^#([\da-f]{2})\1\1$/i);
  }
});

test("mix and alpha derive native-compatible colors, clamp ratios and preserve unfamiliar host syntax", () => {
  assert.equal(mix("#000", "#fff", 0.25), "rgba(64, 64, 64, 1)");
  assert.equal(mix("#0000", "#ffffffff", 0.5), "rgba(128, 128, 128, 0.5)");
  assert.equal(mix("rgb(10, 20, 30)", "rgba(20, 40, 60, 0.5)", 0.5), "rgba(15, 30, 45, 0.75)");
  assert.equal(withAlpha("#abc8", 0.5), "rgba(170, 187, 204, 0.2667)");
  assert.equal(withAlpha("rgb(100% 0% 0% / 50%)", 0.5), "rgba(255, 0, 0, 0.25)");
  assert.equal(mix("#000", "#fff", 2), "rgba(255, 255, 255, 1)");
  assert.equal(withAlpha("#abc", -1), "rgba(170, 187, 204, 0)");
  assert.equal(mix("var(--host-accent)", "var(--host-surface)", 0.1), "var(--host-accent)");
  assert.equal(withAlpha("var(--host-accent)", 0.5), "var(--host-accent)");
});
