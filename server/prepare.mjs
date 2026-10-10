// Paseo runs this before compiling a newly acquired Git or npm candidate.
import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BUNDLES = ["roles", "doctor", "migrate", "coupon"].map(name => `bin/${name}.bundle.mjs`);
BUNDLES.push("server/paseo-client.bundle.mjs");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Plugin preparation failed: ${command} exited ${result.status ?? result.signal}`);
}

export function preparePlugin(root = ROOT, execute = run) {
  // Source builds need the locked SDK and compiler tools even under NODE_ENV=production.
  execute("npm", [existsSync(join(root, "package-lock.json")) ? "ci" : "install", "--include=dev", "--ignore-scripts", "--no-audit", "--no-fund"], root);
  const builders = ["bin/build-daemon-client.mjs", "scripts/build-cli.mjs"].map(file => existsSync(join(root, file)));
  if (builders.some(Boolean)) {
    if (!builders.every(Boolean)) throw new Error("Incomplete source build tools");
    execute("npm", ["run", "build"], root);
  }
  // npm artifacts omit repository build tools and already contain prepacked bundles.
  for (const file of BUNDLES) {
    if (!existsSync(join(root, file))) throw new Error(`Missing prepared bundle: ${file}`);
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { preparePlugin(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
