import { test } from "node:test";
import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, rm, symlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Exercise the shipped module outside the checkout, with only its production dependency.
test("the background client can initialize without installed SDK packages", async () => {
  const dir = await mkdtemp(join(tmpdir(), "afc-client-"));
  try {
    const file = join(dir, "client.mjs");
    await mkdir(join(dir, "node_modules"));
    await mkdir(join(dir, "node_modules/@getpaseo"));
    for (const name of ["zod", "@getpaseo/protocol", "@getpaseo/relay"]) {
      await symlink(new URL(`../../node_modules/${name}`, import.meta.url).pathname, join(dir, "node_modules", name));
    }
    await copyFile(new URL("../paseo-client.bundle.mjs", import.meta.url), file);
    const output = execFileSync(process.execPath, ["--input-type=module", "-e", `
      import { pathToFileURL } from "node:url";
      const { createPaseoClient } = await import(pathToFileURL(process.argv[1]).href);
      const client = createPaseoClient({ url: "ws://127.0.0.1:0/ws", clientId: "offline-test",
        connectTimeoutMs: 100, reconnect: { enabled: false } });
      if (typeof client.providers.listUsage !== "function" || typeof client.agents.list !== "function")
        throw new Error("The background API is incomplete");
      await client.close();
      console.log("ready");
    `, file], { cwd: dir, encoding: "utf8", timeout: 10_000 });
    assert.match(output, /ready/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
