#!/usr/bin/env node
// Fleet-only command registration keeps the shared build gates identical in both repositories.
import { buildCli, FLEET_ENTRIES } from "../scripts/build-cli.mjs";
FLEET_ENTRIES.leader = "server/leader-cli.ts";
try { await buildCli(); }
catch (error) { console.error(`build:cli: ${error.message}`); process.exitCode = 1; }
