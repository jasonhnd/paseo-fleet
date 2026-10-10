// Demo state for the `afc migrate` tests: a legacy directory that looks like an old install (state files at the
// top level, a private file in state/, config backups, plus docs and code that must stay where they are).
// Everything is invented demo data inside a fresh temp directory.
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { PluginGate } from "../migrate";
import { chooseDataDir } from "../paths";

export const DEMO_DECISIONS = [
  { id: "d-demo-1", project: "DEMO", title: "Pick option A or B", detail: "A is faster, B is cheaper", blocking: false, status: "open" },
  { id: "d-demo-2", project: "DEMO", title: "Rename the demo board", detail: "A keep, B rename", blocking: true, status: "open" },
];

export const DEMO_FILES: Record<string, string> = {
  "decisions.json": JSON.stringify(DEMO_DECISIONS, null, 2),
  "plans.json": JSON.stringify({ plans: [{ id: "demo-pool", monthlyUsd: 10, resetDays: 7 }] }),
  "pool-status.json": JSON.stringify({ generatedAt: "2030-01-01T00:00:00.000Z", pools: { "demo-pool": { usedPct: 12 } } }),
  "sweep.log": "2030-01-01T00:00:00Z demo sweep line\n",
  "leader-activity.jsonl": '{"at":"2030-01-01T00:00:00Z","project":"DEMO"}\n',
  "state/cursor-token.json": JSON.stringify({ token: "demo-token-not-real" }),
  "backups/config-20300101-000000.json": JSON.stringify({ demo: true }),
  "backups/nested/demo-backup.txt": "demo backup\n",
};

/** Present in the legacy directory but never migrated. */
export const DEMO_STAYS: Record<string, string> = {
  "README.md": "# Demo checkout\n",
  "docs/notes.md": "demo notes\n",
  "tool/server/demo.ts": "export const demo = 1;\n",
  "package.json": JSON.stringify({ name: "demo" }),
  ".hidden.json": "{}",
};

export function put(root: string, rel: string, body: string): void {
  const path = join(root, ...rel.split("/"));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
}

export interface DemoHome {
  root: string;
  home: string;
  /** The legacy directory with demo state; `<home>/.config/fleet-roles` is a symbolic link to it. */
  legacy: string;
  paseoHome: string;
  /** `$PASEO_HOME/plugin-data/agent-fleet-cockpit`. */
  dataDir: string;
  env: Record<string, string | undefined>;
  /** `env` and `home` together, as the migrate steps take them. */
  where: { env: Record<string, string | undefined>; home: string };
  cleanup: () => void;
}

export function demoHome(): DemoHome {
  // Resolved, because the command records real paths (the system temp folder can itself be a link).
  const root = realpathSync(mkdtempSync(join(tmpdir(), "afc-migrate-test-")));
  const home = join(root, "home");
  const legacy = join(root, "old-checkout");
  for (const [rel, body] of Object.entries({ ...DEMO_FILES, ...DEMO_STAYS })) put(legacy, rel, body);
  symlinkSync("plans.json", join(legacy, "plans-link.json"));
  mkdirSync(join(home, ".config"), { recursive: true });
  symlinkSync(legacy, join(home, ".config", "fleet-roles"));
  const paseoHome = join(home, ".paseo");
  const dataDir = join(paseoHome, "plugin-data", "agent-fleet-cockpit");
  const env = { PASEO_HOME: paseoHome };
  return { root, home, legacy, paseoHome, dataDir, env, where: { env, home }, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

/** A clock that moves one second per call, so each migration gets its own id. */
export function steppingClock(startIso = "2030-01-01T00:00:00.000Z"): () => Date {
  let at = Date.parse(startIso);
  return () => {
    const now = new Date(at);
    at += 1000;
    return now;
  };
}

export interface RecordingGate extends PluginGate {
  calls: string[];
}

/** A gate that records pause/resume; `reads` stands in for the restarted plugin's log line (omit: not observable). */
export function recordingGate(hooks: { onPause?: () => void; onResume?: () => void; reads?: () => string | null } = {}): RecordingGate {
  const calls: string[] = [];
  const gate: RecordingGate = {
    calls,
    pause: async () => {
      calls.push("pause");
      hooks.onPause?.();
      return { paused: true, note: "demo plugin paused" };
    },
    resume: async () => {
      calls.push("resume");
      hooks.onResume?.();
    },
  };
  const reads = hooks.reads;
  return reads ? { ...gate, readsAfterResume: async () => reads() } : gate;
}

/**
 * Stands in for the plugin running in Paseo: after each resume it reports the directory the cockpit's rule picks
 * with the daemon's environment, which may differ from the shell's.
 */
export function daemonGate(daemon: { env: Record<string, string | undefined>; home: string }, hooks: { onPause?: () => void; onResume?: () => void } = {}): RecordingGate {
  return recordingGate({ ...hooks, reads: () => chooseDataDir(daemon.env, daemon.home).dir });
}
