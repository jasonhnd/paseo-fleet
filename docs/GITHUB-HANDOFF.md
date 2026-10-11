# Source repository handoff

The publication scope is this development source repository at
https://github.com/jasonhnd/paseo-fleet. Personal configuration, quota records,
decisions, local handoffs, credentials and runtime data are excluded. Preparing
sources does not install or update the daily plugin, migrate its data, or publish
a release.

## Publication gates

Finish independent review and acceptance of in-flight changes before selecting
final revisions. Record every selected full ref, object SHA and peeled commit SHA
for annotated tags. Preserve local development and backup refs until their owners
have decided which objects must be retained; retention is not permission to push.
Read the remote refs again before publication rather than assuming an empty remote.

Scan every selected tree and its reachable history with the existing private
scanner, identity gate and redacted gitleaks gate. Run the package whitelist gate
and the local verification suite. Report actual exit codes and hashes of retained
scan logs. A changed ref requires scanning its newly reachable objects. A finding
stops publication and goes back to the coordinating lead; do not rewrite history,
force-push, or hide an old finding behind a file deletion in a new commit.

Local validation reports, host log excerpts, DOM captures and screenshots require
separate public-suitability review. A clean text or secret scan does not establish
that an image or host receipt is safe to publish. Check paths, identities and host
metadata item by item. Keep unresolved evidence local until that review completes.

The lead must read the final diff and independent review, and record permission to
push the exact selected refs. Push only that explicit set, preserving the remote's
visibility. Do not use mirror, all-ref or force options. After publication, compare
each remote object SHA and peeled tag commit with the approved local list and
return the complete mapping to the coordinating lead.

## Development on another machine

Requirements and commands come from [README](../README.md) and
[CONTRIBUTING](../CONTRIBUTING.md): Node >=22.13, Git, npm, gitleaks, and a supported
Paseo daemon and desktop app. Choose local paths rather than copying a previous
machine's absolute paths.

```sh
git clone https://github.com/jasonhnd/paseo-fleet "$FLEET_CHECKOUT"
cd "$FLEET_CHECKOUT"
git checkout --detach "$APPROVED_REF"
npm ci --include=dev --ignore-scripts --no-audit --no-fund
npm run build
npm run verify
git diff --check
```

Set `FLEET_CHECKOUT` and `APPROVED_REF` explicitly before running these commands.
Configure a placeholder or GitHub noreply developer identity and keep the private
denylist outside the checkout. Authenticate providers personally through their
official interfaces; do not transfer credentials, raw host configuration or browser
profiles. Offline builds do not certify desktop mounting or a real provider cycle.

## Installed plugin updates and rollback

Follow [Git installation](GIT-INSTALL.md) and [release checks](RELEASE.md) only after
the chosen release revision has been approved. Inspect installation identity before
updating: a local file source does not automatically change to the GitHub remote.
Switching sources is a separate operation with its own backup and rollback checks.
Once the configured source is the approved remote, use the official commands with
an explicit reviewed tag:

```sh
paseo plugin ls agent-fleet-cockpit --json
paseo plugin update agent-fleet-cockpit --check --ref "$APPROVED_TAG" --json
# Apply only after the check and authorization have been recorded.
paseo plugin update agent-fleet-cockpit --ref "$APPROVED_TAG" --json
```

Updates can replace the managed installation directory. Discover the current path
through the official listing and rebuild command shims against that installation;
check command help, exported CLI identity, plugin status and the real panels.
Retain the previous approved revision and local settings backup for rollback.
Keep locally approved configuration increments separately and reapply only reviewed
fields, preserving concurrent edits. Do not automatically migrate production state.
Source verification does not imply that an unreleased candidate is already live.
