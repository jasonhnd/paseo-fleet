import assert from "node:assert/strict";
import { join, resolve } from "node:path";
import { describe, test } from "node:test";
import { exportPath, exportsDir, paseoHome, pluginDataDir } from "../paths";
import { PLUGIN_IDS } from "../../../shared/contract/schema";

const HOME = "/home/demo";

describe("paths", () => {
  test("defaults to ~/.paseo/plugin-data/<id>", () => {
    assert.equal(paseoHome({}, HOME), join(HOME, ".paseo"));
    assert.equal(pluginDataDir(PLUGIN_IDS.cockpit, {}, HOME), join(HOME, ".paseo/plugin-data/agent-fleet-cockpit"));
    assert.equal(pluginDataDir(PLUGIN_IDS.kanban, {}, HOME), join(HOME, ".paseo/plugin-data/paseo-kanban"));
  });

  test("PASEO_HOME moves both plugins", () => {
    const env = { PASEO_HOME: "/srv/paseo-demo" };
    assert.equal(exportsDir(PLUGIN_IDS.cockpit, env, HOME), "/srv/paseo-demo/plugin-data/agent-fleet-cockpit/exports");
    assert.equal(exportsDir(PLUGIN_IDS.kanban, env, HOME), "/srv/paseo-demo/plugin-data/paseo-kanban/exports");
  });

  test("AFC_DATA_DIR overrides only the cockpit and beats PASEO_HOME", () => {
    const env = { PASEO_HOME: "/srv/paseo-demo", AFC_DATA_DIR: "/data/afc-demo" };
    assert.equal(pluginDataDir(PLUGIN_IDS.cockpit, env, HOME), "/data/afc-demo");
    assert.equal(pluginDataDir(PLUGIN_IDS.kanban, env, HOME), "/srv/paseo-demo/plugin-data/paseo-kanban");
  });

  test("KANBAN_DATA_DIR overrides only the board", () => {
    const env = { KANBAN_DATA_DIR: "/data/kanban-demo" };
    assert.equal(pluginDataDir(PLUGIN_IDS.kanban, env, HOME), "/data/kanban-demo");
    assert.equal(pluginDataDir(PLUGIN_IDS.cockpit, env, HOME), join(HOME, ".paseo/plugin-data/agent-fleet-cockpit"));
  });

  test("blank overrides are ignored, ~ and relative paths are expanded", () => {
    assert.equal(paseoHome({ PASEO_HOME: "  " }, HOME), join(HOME, ".paseo"));
    assert.equal(pluginDataDir(PLUGIN_IDS.cockpit, { AFC_DATA_DIR: "~/afc" }, HOME), join(HOME, "afc"));
    assert.equal(paseoHome({ PASEO_HOME: "~" }, HOME), HOME);
    assert.equal(pluginDataDir(PLUGIN_IDS.kanban, { KANBAN_DATA_DIR: "rel/kanban" }, HOME), resolve("rel/kanban"));
  });

  test("each export lives under its producer", () => {
    const env = { AFC_DATA_DIR: "/data/afc-demo", KANBAN_DATA_DIR: "/data/kanban-demo" };
    assert.equal(exportPath("poolStatus", env, HOME), "/data/afc-demo/exports/pool-status.json");
    assert.equal(exportPath("dispatchMatrix", env, HOME), "/data/afc-demo/exports/dispatch-matrix.json");
    assert.equal(exportPath("cockpit", env, HOME), "/data/afc-demo/exports/cockpit.json");
    assert.equal(exportPath("decisionsOpen", env, HOME), "/data/afc-demo/exports/decisions-open.json");
    assert.equal(exportPath("kanban", env, HOME), "/data/kanban-demo/exports/kanban.json");
    assert.equal(exportPath("boardSummary", env, HOME), "/data/kanban-demo/exports/board-summary.json");
  });

  test("defaults use the real home directory when none is passed", () => {
    assert.ok(paseoHome({}).endsWith(".paseo"));
  });
});
