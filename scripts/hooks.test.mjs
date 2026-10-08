// End to end: the real .githooks/pre-commit and pre-push in a throwaway repository with a copy of the gates.
// Personal-looking samples are assembled at run time so this file scans clean.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GATES = ["scripts/check-private.mjs", "scripts/check-identity.mjs", "scripts/private-scan.rules.json", ".githooks/pre-commit", ".githooks/pre-push"];
const j = (...parts) => parts.join("");
const PLACEHOLDER = "noreply@example.invalid";
const PERSONAL = j("someone", "@", "mail.test.org");
const TERM = j("Hidden", "Project");

let home;
let repo;
let remote;
let env;

const git = (args, extra = {}) => spawnSync("git", ["-C", repo, ...args], { encoding: "utf8", env: { ...env, ...extra } });
const ok = (result) => {
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result;
};

/** Stage one file and try to commit it through the hooks. */
function tryCommit(file, body, extra = {}) {
  writeFileSync(join(repo, file), body);
  ok(git(["add", file]));
  const result = git(["commit", "-q", "-m", `add ${file}`], extra);
  if (result.status !== 0) ok(git(["reset", "-q", "HEAD", "--", file]));
  rmSync(join(repo, file), { force: true });
  return result;
}

before(() => {
  home = mkdtempSync(join(tmpdir(), "hooks-test-"));
  repo = join(home, "repo");
  remote = join(home, "remote.git");
  const list = join(home, "denylist.txt");
  writeFileSync(list, `# demo list\n${TERM}\n`);
  // No global or system git config: only the repository's own settings apply.
  env = { ...process.env, HOME: home, XDG_CONFIG_HOME: home, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: join(home, "no-global"), FLEET_PRIVATE_DENYLIST: list };
  for (const key of ["GIT_AUTHOR_NAME", "GIT_AUTHOR_EMAIL", "GIT_COMMITTER_NAME", "GIT_COMMITTER_EMAIL", "EMAIL"]) delete env[key];
  execFileSync("git", ["init", "-q", "-b", "main", repo], { env });
  execFileSync("git", ["init", "-q", "--bare", remote], { env });
  for (const file of GATES) cpSync(join(ROOT, file), join(repo, file));
  // pre-push runs `npm run verify`; here it is a stub that records the call and exits with VERIFY_STUB_EXIT.
  writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", private: true, scripts: { verify: "node verify-stub.mjs" } }));
  writeFileSync(join(repo, "verify-stub.mjs"), [
    'import { appendFileSync } from "node:fs";',
    'appendFileSync(process.env.VERIFY_STUB_LOG, "verify\\n");',
    'process.exitCode = Number(process.env.VERIFY_STUB_EXIT ?? 0);',
  ].join("\n"));
  env.VERIFY_STUB_LOG = join(home, "verify-calls.log");
  ok(git(["config", "core.hooksPath", ".githooks"]));
  ok(git(["config", "user.name", "paseo-fleet contributors"]));
  ok(git(["config", "user.email", PLACEHOLDER]));
  ok(git(["remote", "add", "origin", remote]));
  ok(git(["add", "-A"]));
  ok(git(["commit", "-q", "-m", "gates"]));
});

after(() => rmSync(home, { recursive: true, force: true }));

describe("pre-commit", () => {
  test("a clean file is committed", () => {
    writeFileSync(join(repo, "clean.md"), "# Demo\n");
    ok(git(["add", "clean.md"]));
    ok(git(["commit", "-q", "-m", "clean"]));
  });

  const refused = [
    ["a home directory path", "home.md", j("see /", "Users/", "x/notes\n"), /home-path/],
    ["CJK text outside the locale files", "text.md", j("label ", "\u770b\u677f", "\n"), /cjk-outside-locales/],
    ["a UUID", "id.md", j("agent ", "3934ae19-8389-4a8f-", "9b36-08c66eca8c34\n"), /uuid/],
    ["a private denylist term", "term.md", `about ${TERM.toLowerCase()}\n`, /private/],
    ["a real data file", "plans.json", "{}\n", /forbidden-path/],
  ];
  for (const [what, file, body, rule] of refused) {
    test(`a file with ${what} is refused`, () => {
      const result = tryCommit(file, body);
      assert.notEqual(result.status, 0, "commit should be refused");
      assert.match(result.stdout + result.stderr, rule);
    });
  }

  test("CJK text in a nested locales/zh-CN.json is committed", () => {
    const file = "packages/demo/shared/locales/zh-CN.json";
    mkdirSync(join(repo, dirname(file)), { recursive: true });
    writeFileSync(join(repo, file), j('{ "board.title": "', "\u770b\u677f", '" }\n'));
    ok(git(["add", file]));
    ok(git(["commit", "-q", "-m", "zh-CN locale"]));
  });

  test("CJK text in any other file under the same folder is refused", () => {
    mkdirSync(join(repo, "packages/demo/shared/locales"), { recursive: true });
    const result = tryCommit("packages/demo/shared/locales/en.json", j('{ "board.title": "', "\u770b\u677f", '" }\n'));
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /cjk-outside-locales/);
  });

  test("a missing private denylist refuses every commit", () => {
    const result = tryCommit("fine.md", "fine\n", { FLEET_PRIVATE_DENYLIST: join(home, "missing.txt") });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /private denylist not found/);
  });

  test("a personal identity is refused", () => {
    const result = tryCommit("fine.md", "fine\n", { GIT_COMMITTER_EMAIL: PERSONAL });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /committer: e-mail is not a placeholder/);
  });
});

describe("pre-push", () => {
  const verifyCalls = () => (existsSync(env.VERIFY_STUB_LOG) ? readFileSync(env.VERIFY_STUB_LOG, "utf8").split("\n").filter(Boolean).length : 0);

  test("running the hook by hand runs npm run verify", () => {
    const before = verifyCalls();
    const result = spawnSync("sh", [".githooks/pre-push"], { cwd: repo, input: "", encoding: "utf8", env });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(verifyCalls(), before + 1);
  });

  test("a failing npm run verify refuses the push", () => {
    const result = git(["push", "-q", "origin", "HEAD:refs/heads/verify-fails"], { VERIFY_STUB_EXIT: "1" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /pre-push: refused/);
    const pushed = spawnSync("git", ["-C", remote, "rev-parse", "--verify", "-q", "refs/heads/verify-fails"], { encoding: "utf8", env });
    assert.notEqual(pushed.status, 0, "nothing may reach the remote");
  });

  test("clean history is pushed", () => {
    ok(git(["push", "-q", "origin", "main"]));
  });

  test("a commit with a personal identity is not pushed", () => {
    writeFileSync(join(repo, "late.md"), "late\n");
    ok(git(["add", "late.md"]));
    ok(git(["commit", "-q", "--no-verify", "-m", "late"], { GIT_AUTHOR_EMAIL: PERSONAL }));
    const result = git(["push", "-q", "origin", "main"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /author: e-mail is not a placeholder/);
    ok(git(["reset", "-q", "--hard", "HEAD~1"]));
  });

  test("a tree with personal data is not pushed, even if the working tree is clean", () => {
    writeFileSync(join(repo, "leak.md"), j("x ", "ABCD", "_0136\n"));
    ok(git(["add", "leak.md"]));
    ok(git(["commit", "-q", "--no-verify", "-m", "leak"]));
    rmSync(join(repo, "leak.md"));
    const result = git(["push", "-q", "origin", "HEAD:refs/heads/topic"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /leak\.md:1:card-code/);
    const pushed = spawnSync("git", ["-C", remote, "rev-parse", "--verify", "-q", "refs/heads/topic"], { encoding: "utf8", env });
    assert.notEqual(pushed.status, 0, "the topic branch must not exist on the remote");
  });
});
