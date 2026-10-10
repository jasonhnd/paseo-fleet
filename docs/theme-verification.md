# Theme rework verification (2026-10-10)

Code verified: `7280988` (retired preferences) and `304133b` (shared palette recipes,
color gate, mounted tests and theme documentation), plus `1a62173` (identical
Kanban neutral fallback). Execution evidence only;
independent review and final acceptance remain separate.

## Local checks

- Dependencies were installed with `npm ci` as instructed by the repository;
  no dependency or lockfile change was needed for rework.
- `node --import tsx --test server/test/panel-prefs.test.ts`: 2/2 passed.
  Valid and invalid legacy color modes are ignored without rewriting on read;
  font/tab saves remove the field, preserve nested unknown fields and serialize
  concurrent updates. RPC and local view state no longer carry the field.
- Theme pure/source/mount tests: 8/8 passed. Contrast correction, generated hex,
  all eleven host tokens, primary accent preservation and the single source
  exemption are covered. Home, all seven tabs and settings repaint from the two
  complete theme fixtures through light/dark/light changes without remounting.
- Four existing UI mount regressions: 4/4 passed, including both locales.
- Final `npm run verify`: exit 0, all 12 gates passed. Typecheck covered 278 files;
  scripts 115/115, plugin tests 403/403, CLI and strict Paseo builds passed;
  private/identity/history/gitleaks/contract/shared gates/package checks passed.
  The shared-scripts gate reports no configured sibling. A separate read-only
  comparison compiled Kanban and Fleet adapters and found all 23 common semantic
  outputs equal for light, dark and low-contrast themes, plus absent/null host themes.
- The first full suite run failed two existing leader-swap assertions. The unchanged
  leader-swap file passed 21/21 in isolation, then the unchanged full verify passed.
  The first failure log is retained alongside the final passing log.
- All commits used `.githooks`, including private scan, identity and gitleaks.
  One documentation commit attempt was blocked for an internal card identifier;
  the identifier was removed and the normal hook then passed.

## Isolated Web verification

Paseo 0.11.2 / Node 24.21.0, loopback `127.0.0.1:63472`, relay/MCP/browser tools
turned off. All eight providers were disabled before startup. The daemon wrapper
uses a clean environment with isolated Paseo home, AFC/Kanban/roles data paths and
npm cache from the first command. Browser profile, sockets and screenshots also
remain in the task's temporary directory. No agent was created; no production
daemon, credentials or production data were accessed.

The plugin uses this card's workspace directory (already installed during the
first round); explicit plugin reload reported running with no error. Appearance
was actually switched through Light, Midnight and Claude. Each theme's Overview,
Leader and Fleet settings views were loaded before capture at 1440x1100. All nine
screenshots were opened and inspected: host surfaces, text, status ink and shallow
count badges follow the selected template, with no old Fleet palette visible.
Appearance screenshots additionally record the selected host template.

DOM samples collect visible, enabled text and input values, composite the ancestor
backgrounds and calculate WCAG relative luminance. Text outside the viewport,
disabled or faded controls are excluded. Settings samples include the host-provided
heading/back link around Fleet's settings contribution. This is contrast sampling,
not a full accessibility audit or proof about unmounted production data.

| Screenshot | Visible samples | Minimum contrast | Samples below 4.5:1 |
| --- | --- | --- | --- |
| `rework-light-home.png` | 30 | 4.666:1 | 0 |
| `rework-light-panel.png` | 35 | 4.666:1 | 0 |
| `rework-light-settings.png` | 24 | 4.833:1 | 0 |
| `rework-midnight-home.png` | 30 | 4.725:1 | 0 |
| `rework-midnight-panel.png` | 35 | 4.725:1 | 0 |
| `rework-midnight-settings.png` | 24 | 6.188:1 | 0 |
| `rework-claude-home.png` | 30 | 3.122:1 | 3 |
| `rework-claude-panel.png` | 35 | 3.122:1 | 3 |
| `rework-claude-settings.png` | 24 | 6.560:1 | 0 |

Claude's three sub-4.5 samples on Home/Leader are the selected M font segment,
Refresh and the selected tab label: the exact host accent/accentForeground pair
is 3.122:1. Count badges now have a distinct shallow background and corrected ink.
All other sampled non-disabled text on these surfaces is at least 4.5:1.
The shared adapter deliberately preserves the host primary/selected pair.

Browser runtime errors were empty. Browser and isolated daemon were stopped after
capture. Generated bundles are temporary build artifacts, not tracked sources;
run `npm run build` before checks requiring them after cleanup.

The missing-theme compatibility path uses the same neutral fallback as Kanban via RoleBoard
and FleetSettings/useStyles; descendants receive styles. This path has pure tests
and was not exercised by the current host, which supplies a full theme. Host theme
changes may replace plugin DOM or close drawers as documented by Kanban; Fleet's
prop tests do not promise transient state survives host remounts. Physical native
devices and the user's production desktop were not tested.

## Screenshot checksums

Screenshots and detailed JSON/log evidence are stored in the card's temporary
area, with absolute paths listed in the Kanban handoff. Checksums preserve the
identity of the final screenshot set after temporary retention ends.

```text
3dda9660ef1ad258f12ddba345850a6f198c1eacbede9374027526070a266122 rework-claude-appearance.png
a27e7fb804c0d3ed58e7edf619f4ad3829f6195587142c7085f4e6a59d2a299b rework-claude-home.png
bfa91e8a5af546656e52f27799bacb2dc9eacb92c7ac50ac563b8613cbe3e966 rework-claude-panel.png
37797034cad61925f80102b6f2b3a3863e45ae0d7e05dd2a05baeb41506b7c7a rework-claude-settings.png
65e61cde0a08bf4b2ae373450c8591ae2b1a9b3aba1b7e0665043db88228c111 rework-light-appearance.png
d0b22d6de1e9bda67b5ed06e033f94b08c7cd5b6e5fbe60ad20f3e9cec41fd50 rework-light-home.png
01f8a8d702b0b9e67ebdf785be2fda4fab6a23b003509fd5e6e8546440d7986a rework-light-panel.png
807395e8f1e3c25ac8a5b880d5a1c29a66b71a26f1b3f44b8099a4e5bd854937 rework-light-settings.png
6fbd6f230add8349f8b2575c287e4f6f4dc55c8036f11d039bc15400843ac162 rework-midnight-appearance.png
67a13ba577184d140ec5a41a66ca32bd9321b13e7cb09d7b67f7f4be5e499606 rework-midnight-home.png
dabe3eb734f799d830701ecd76309139c76fb132f1a3076c517cdc4f63fc1992 rework-midnight-panel.png
fe58af27c9fec4510068ae989ab40ac94d6a2d22e395b83f0977d78a0688e15a rework-midnight-settings.png
```
