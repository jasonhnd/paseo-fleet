// `afc migrate`: the command is bin/afc-migrate, which starts this file. The work is in server/migrate.ts.
import { runMigrateCli } from "./migrate-cli";

runMigrateCli(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error("afc migrate: unexpected error:", String(error).slice(0, 300));
    process.exitCode = 1;
  },
);
