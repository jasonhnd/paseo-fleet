# Antigravity isolation evidence

Keep the CLI usage table, ACP observations, routing tests and a real board lifecycle
as separate evidence. A successful compiler or routing test does not verify a model
task, provider permissions, authentication or a mounted panel.

## Offline acceptance probes

Install the locked dependencies as described in the README. In a task-owned temporary
directory, set absolute `PASEO_HOME`, `AFC_DATA_DIR`, `KANBAN_DATA_DIR`,
`ROLES_STATE_DIR` and `TMPDIR` before running:

```sh
node test/antigravity/check-isolation.mjs
node test/antigravity/check-isolation.mjs --usage-run "$TMPDIR/usage-run.json"
npm run antigravity:check -- --usage-run "$TMPDIR/usage-run.json"
```

The optional input is a saved command result with `stdout`, `stderr`, `code`,
`timedOut` and its original ISO `observedAt`. It is replayed offline; it does not
start `agy`. Do not substitute the current time for an old observation. The report
contains only parsed samples and decisions, never raw command output. Store raw
results privately and redact account identifiers before sharing.

Exit 0 means these offline probes pass; exit 1 lists failed acceptance expectations.
These Fleet-specific probes live outside the shared gate scripts and are separate
from `npm run verify`. In particular, check nonzero and
signal exits even when stdout already contains a valid partial quota table. Such
output must not be accepted as a successful live reading. Record a failed probe
as a defect, rather than changing its expectation to match the implementation.

The synthetic matching channel identities exercise exhausted and stale ACP gates.
They cannot prove that a real CLI subscription and ACP session consume one pool.
Production needs independently observed version, tier, specific quota source and
time from both channels. Missing evidence keeps ACP unknown under
`quotaProtection: "pause"`, even with a full CLI table or fresh manual zero.

## Host and panel isolation

Use an unused loopback listener, disable relay and speech downloads, and create
the host configuration from scratch. Disable unrelated providers and optional
adapters. Select the temporary endpoint explicitly on every daemon command.
Check the provider implementation: a CLI driver is not an ACP provider merely
because both use the same provider id.

Isolate Paseo home, all plugin data roots and `AFC_TRANSCRIPT_HOME`. The process
may keep its normal OS `HOME` so the official provider can use its existing
authentication itself. Do not read or copy authentication files. Moving only plugin
data and Paseo home does not isolate transcript discovery: point the scanner at an
empty task-owned transcript directory and verify that it finds no personal files.
The mounted panel must have no personal usage. Clear only task-owned caches if
an accidental discovery occurred. A completely empty OS HOME is not required.

Authentication must follow the provider's official flow. A successful `session/new`
in an existing diagnostic is session initialization evidence; do not require another
login merely because an unnecessary empty-OS-HOME experiment failed. It does not
prove shared CLI/ACP quota, task permissions or a real lifecycle. Do not redirect the
provider to another tool's identity. Capture actual initialization and session errors;
a diagnostic command may exit 0 while reporting a provider error.
Discover telemetry status only through advertised read-only CLI/ACP capabilities.
A free-tier privacy notice is a collection/opt-out reminder, not evidence that the
account setting is on or off. An exited settings command or model-generated answer
also does not prove an account opt-out.

Open the selected host in a separate local Edge profile. Capture the mounted quota
page, plugin settings, adapter switch, bucket selection, protection switch and
dispatch switch. Record whether CLI rows are live, replayed, synthetic or absent.
Save the pool export too. Do not replace a missing host mount with a DOM simulation.

## Official quota surfaces

Keep these observations separate. None of them is a substitute for another:

- The host `provider.usage.list` response is the official Paseo usage surface.
- An ACP `initialize` or `session/new` result is session-startup evidence.
- A model catalog lists model ids. It does not select an authorized model, and it does not report quota.
- A tier id names a subscription label. It is not a remaining-percent reading and it is not a quota-source key.
- The local `agy /usage` table is the CLI display. A credits balance is a further, separate meter.

If `provider.usage.list` has no row for the ACP provider, or the official diagnostic does not include both a specific quota-source key and a weekly or five-hour percent for that ACP channel, record the missing field as a capability gap. Leave the ACP observation empty. Do not copy the CLI percent into the ACP row. Do not treat a product name, a catalog, a successful session, a tier id, one email address, or two similar percentages as `samePoolProven`. Unknown, expired, unreadable, and provider-exhausted ACP quota stay non-dispatchable under `quotaProtection: "pause"`. `quotaProtection: "none"`, a hand-written zero, and a synthetic known fixture do not unlock a real task.

High, medium, and low variants are different model ids. There is no separate thinking parameter. The catalog's default id may differ from the only id a demonstration is allowed to run, so the task must name that id explicitly. Permission modes that auto-approve edits or every tool are not a denial test. A demonstration that must show a refusal stays on the default prompt mode, with auto-accept off.

A pure routing or permission fixture can reject a path, but it is not an ACP permission event and it is not a finished card. A real demonstration is created by a normally registered leader after the ACP quota source is actually dispatchable under pause protection.

## Dispatch and permission boundaries

Test each gate separately: paused profiles, `dispatch: false`, unknown ACP quota,
and board provider bans. A visible pool is not necessarily dispatchable. A profile
pause is not a host-wide prohibition on direct Paseo calls.

When comparing matrix tiers, resolve `role[tier] ?? role["*"]`. Preserve list order,
effort, explicit order and priority. Label reconstruction using frozen preparation
pool flags separately from a current snapshot. List every excluded metadata field;
do not discard role or priority differences as timestamp noise.

Test automatic routing and explicit profile selection. Explicit selection currently
bypasses profile scope rules and matrix membership. An empty L3/L4 slot or a paused
stand-in role alone is therefore insufficient to enforce a provider's authorized
tiers on that path. Pool holds and board bans still need independent checks.
Before enabling a provider, enforce authorized roles/tiers on explicit selection
as well, and reserve a reviewer from another family for Google execution.

Pure permission probes can check read/write/shell/mode-switch decisions, but cannot
prove that a real ACP provider requests approval for every relevant action. Keep
ordinary review candidates disabled until a real denied-write and mode-switch
attempt has been observed with the sentinel file unchanged. A read-only role also
needs `auto_accept` disabled; enabling it wins over the board permission gate.

A real board demonstration must be created by a normally registered leader, using
its own identity and the normal tools. Never impersonate it, clear identity variables,
edit a live card database, or replace the flow with direct agent creation. If blocked
by protected unknown quota or authentication, deliver the prepared brief and exact
missing conditions as waiting work. Do not turn off quota protection to finish it.

After collecting evidence, close the task browser, stop the selected temporary
daemon and keep a durable private report. Keep temporary runtime caches, profiles,
logs and screenshots under the task temporary directory for the board's 24-hour
cleanup policy; remove only task-owned files if earlier cleanup is necessary.
Recheck daily pauses and provider bans without changing them.
