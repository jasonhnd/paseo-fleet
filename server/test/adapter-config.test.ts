// Optional adapter switches (server/adapters/config.ts). Every data directory is a fresh temp dir.
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, test } from "node:test";
import { CURSOR_API, KEYCHAIN } from "../../shared/quota-adapters";
import { AFC_CONFIG_FILE, adapterOn, adapterSwitches, resolveSwitches } from "../adapters/config";

const dirs: string[] = [];
function freshDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "afc-adapters-test-"));
  dirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

describe("resolveSwitches", () => {
  const never = () => false;
  test("missing config: both off", () => {
    assert.deepEqual(resolveSwitches(null, never), { [CURSOR_API]: false, [KEYCHAIN]: false });
  });
  test("only a literal boolean counts", () => {
    const raw = { adapters: { [CURSOR_API]: true, [KEYCHAIN]: "yes" } };
    assert.deepEqual(resolveSwitches(raw, never), { [CURSOR_API]: true, [KEYCHAIN]: false });
  });
  test("an unset switch follows earlier use; a written one wins", () => {
    const inUse = () => true;
    assert.deepEqual(resolveSwitches({}, inUse), { [CURSOR_API]: true, [KEYCHAIN]: true });
    assert.deepEqual(resolveSwitches({ adapters: { [KEYCHAIN]: false } }, inUse), { [CURSOR_API]: true, [KEYCHAIN]: false });
  });
  test("junk shapes are ignored", () => {
    assert.deepEqual(resolveSwitches({ adapters: [true] }, never), { [CURSOR_API]: false, [KEYCHAIN]: false });
    assert.deepEqual(resolveSwitches("text", never), { [CURSOR_API]: false, [KEYCHAIN]: false });
  });
});

describe("adapterSwitches on a data directory", () => {
  test("a fresh directory: both optional adapters off", () => {
    const dir = freshDir();
    assert.equal(adapterOn(CURSOR_API, dir), false);
    assert.equal(adapterOn(KEYCHAIN, dir), false);
  });
  test("state files from before the switches keep an adapter on", () => {
    const dir = freshDir();
    writeFileSync(join(dir, "cursor-usage.json"), "{}");
    writeFileSync(join(dir, "keychain-probe-state.json"), "{}");
    assert.deepEqual(adapterSwitches(dir), { [CURSOR_API]: true, [KEYCHAIN]: true });
  });
  test("afc.config.json turns an adapter off even with its state file there", () => {
    const dir = freshDir();
    writeFileSync(join(dir, "cursor-usage.json"), "{}");
    writeFileSync(join(dir, AFC_CONFIG_FILE), JSON.stringify({ adapters: { [CURSOR_API]: false } }));
    assert.equal(adapterOn(CURSOR_API, dir), false);
  });
  test("a broken afc.config.json counts as missing", () => {
    const dir = freshDir();
    writeFileSync(join(dir, AFC_CONFIG_FILE), "{ not json");
    assert.deepEqual(adapterSwitches(dir), { [CURSOR_API]: false, [KEYCHAIN]: false });
  });
});
