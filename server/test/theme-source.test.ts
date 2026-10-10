import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const normalizeColor = createRequire(import.meta.url)("@react-native/normalize-colors");
const colorProperty = /(?:color|background|fill|stroke|shadow|outline|tint)$/i;

/** Inspect literals, not comments or parsing regexes. Tone ids are semantic strings, not paint. */
function colorLiterals(source: string): string[] {
  const file = ts.createSourceFile("source.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const constants = new Map<string, ts.Expression>();
  const index = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) constants.set(node.name.text, node.initializer);
    ts.forEachChild(node, index);
  };
  index(file);
  const visit = (node: ts.Node, paint = false, resolving = new Set<string>()) => {
    const name = ts.isPropertyAssignment(node) || ts.isJsxAttribute(node) || ts.isVariableDeclaration(node) ? node.name?.getText(file).replace(/["']/g, "") : "";
    const isPaint = paint || colorProperty.test(name ?? "");
    if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const value = node.text.trim();
      const numeric = /#[\da-f]{3,8}(?![\w])/i.test(value) || /\b(?:rgba?|hsla?|hwb|(?:ok)?l(?:ab|ch)|color)\(\s*[\d.+-]/i.test(value);
      const named = normalizeColor(value) !== null && (isPaint || !["red", "green", "yellow", "blue"].includes(value));
      if (numeric || named) found.push(value);
    }
    if (isPaint && ts.isIdentifier(node) && constants.has(node.text) && !resolving.has(node.text)) {
      visit(constants.get(node.text)!, true, new Set([...resolving, node.text]));
    }
    if (ts.isConditionalExpression(node)) {
      visit(node.condition, false, resolving);
      visit(node.whenTrue, isPaint, resolving);
      visit(node.whenFalse, isPaint, resolving);
      return;
    }
    if (ts.isElementAccessExpression(node)) {
      visit(node.expression, isPaint, resolving);
      visit(node.argumentExpression, false, resolving);
      return;
    }
    if (ts.isCallExpression(node) || (ts.isBinaryExpression(node) && /^(?:===?|!==?)$/.test(node.operatorToken.getText(file)))) {
      ts.forEachChild(node, child => visit(child, false, resolving));
      return;
    }
    ts.forEachChild(node, child => visit(child, isPaint, resolving));
  };
  visit(file);
  return [...new Set(found)];
}

const sourceExempt = (name: string) => name === "shared/theme-fallback.ts";

test("source exemptions contain only the single missing-host fallback", () => {
  assert.equal(sourceExempt("shared/theme-fallback.ts"), true);
  for (const name of ["client/__fixtures__/colors.ts", "shared/__fixtures__/colors.ts", "client/theme-fallback.ts", "shared/nested/theme-fallback.ts"]) {
    assert.equal(sourceExempt(name), false, name);
  }
});

test("client and shared have no color literals outside the missing-host fallback", async () => {
  const root = resolve(import.meta.dirname, "../..");
  const failures: string[] = [];
  for (const dir of ["client", "shared"]) {
    for (const entry of await readdir(resolve(root, dir), { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !/\.(?:[cm]?[jt]sx?|json|css)$/.test(entry.name)) continue;
      const path = resolve(entry.parentPath, entry.name);
      const name = relative(root, path).replaceAll("\\", "/");
      if (sourceExempt(name)) continue;
      const source = await readFile(path, "utf8");
      const colors = entry.name.endsWith(".css")
        ? [...source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(?:color|background|fill|stroke|shadow|outline)\s*:\s*([^;}]+)/gi)]
          .flatMap(match => colorLiterals(`const color = ${JSON.stringify(match[1].trim())};`))
        : colorLiterals(source);
      if (colors.length) failures.push(`${name}: ${colors.join(", ")}`);
    }
  }
  assert.deepEqual(failures, [], "All paint must come from PluginTheme.colors");
});

test("color gate catches numeric, named, conditional and aliased paint without rejecting semantic tones", () => {
  for (const source of [
    'const p = { borderColor: "#123" };',
    'const p = { color: "rgb(1, 2, 3)" };',
    'const p = { backgroundColor: "hsl(20, 30%, 40%)" };',
    'const p = { color: on ? "tomato" : theme.colors.foreground };',
    'const arbitrary = "rebeccapurple"; const p = { color: arbitrary };',
    '<TextInput placeholderTextColor="gray" />',
    'const p = { backgroundColor: "transparent" };',
    'const arbitrary = "tomato";',
    'const p = { background: "linear-gradient(#123, #456)" };',
    'const p = { background: `linear-gradient(#123, ${theme.colors.surface0})` };',
  ]) assert.ok(colorLiterals(source).length, source);
  assert.deepEqual(colorLiterals('type Tone = "red" | "green"; const tone = "red"; if (tone === "green") {}'), []);
  assert.deepEqual(colorLiterals('const p = { color: theme.colors.foreground }; // formerly #123456'), []);
  assert.deepEqual(colorLiterals('const color = tone === "red" ? theme.colors.statusDanger : toneColor(s, "green");'), []);
  assert.deepEqual(colorLiterals('function format(r) { return `rgba(${r}, ${r}, ${r}, 1)`; }'), []);
});
