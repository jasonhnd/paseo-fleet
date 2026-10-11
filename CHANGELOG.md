# Changelog

Versions and release tags belong to this plugin independently of its companion.
No public release is declared by this document.

## Unreleased

### Added

- One Antigravity card shows both CLI buckets in four remaining-quota rows, with reset countdowns and a shared Claude/GPT display-only note. ACP dispatch protection and contract snapshots stay separate.
- Optional `antigravity-cli` shows the local agy `/usage` table. It stays off until switched on, and it does not dispatch the Paseo ACP channel unless that channel is shown to be the same pool. The shipped reader does not establish that.
- Experimental plugin sources, standalone Node commands and English/Simplified Chinese interfaces.
- Public setup, workflow, data, compatibility and manual release documentation.
- Bug, feature and compatibility report templates and private disclosure guidance.

### Changed

- No released baseline yet.

### Fixed

- Explicit plan `onlyRoles` now survives usage normalization, RPC output and quota/dispatch publication. Only profiles with a listed `role` or `candidateFor` can dispatch; pacing and quota-protection overrides cannot broaden the allowlist. Existing dated reviewer exceptions remain separate and intersect explicit limits.
- Concurrent quota refreshes and panel requests use exclusive temporary files for JSON snapshots, preventing one writer from consuming another writer's pending rename.
- Failed or signal-terminated agy commands discard even valid stdout rows; only a normal code-zero read can supply new live samples.

- An `antigravity-cli` plan keeps its unknown ACP hold when the reader switch is off or unset. A hand-copied percent does not replace that hold. An expired agy table is shown as a stale sample.

### Security

- Local privacy, identity, history leak and package-content gates are required.
- Private vulnerability reporting must be enabled by the owner before release.

### Notes

- Intended initial package version: 0.1.0; status: experimental, unreleased.
- Paseo manifest range: >=0.11.0 <0.12.0. Full platform/desktop certification is pending.
- Contract schema: fleet-quota/v1; additive contractVersion: 1.2.0. No contract or data migration is introduced by these documentation changes.
- Minimum released companion version: not established; no supported release pair is declared.
- Tested companion tag/commit and upgrade order: to be recorded in each release after interoperability checks. Do not infer these from matching package versions.
- Git install, package, desktop, first-card and rollback evidence is required before release; see docs/RELEASE.md. Code downgrade does not undo data writes.
