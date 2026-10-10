# Host theme adaptation

Fleet follows the same SDK contract and palette recipes as Kanban's
`docs/THEME.md` (main `29a1d29`). The SDK 0.11 theme is a registered
component **prop**, not part of the registration-time `PluginClientContext`.
Paseo 0.11.2 passes current theme props to screen, workspace panel and settings
components through `withUnistyles` / `uniProps`. `RoleBoard` and `FleetSettings`
pass these props into `useStyles`, which calls `paletteFromTheme` on every render.
No subscription, system appearance lookup or theme RPC is needed.

`shared/palette.ts` replaces the former independent light/dark palette. Its pure
adapter uses only the eleven `PluginTheme.colors` tokens:

| Use | Recipe shared with Kanban |
| --- | --- |
| Page, card, raised and tracks | `surface0`, `surface1`, `surface2` |
| Column | `mixColors(surface0, surface1, .5)` |
| Border and body text | `border`, `foreground` |
| Secondary text and placeholder | `foregroundMuted`, corrected against all three surfaces |
| Decorative faint | `mixColors(border, foregroundMuted, .5)` |
| Primary button and selected tab/segment | Original `accent` and `accentForeground` |
| Status or accent badge background | `mixColors(surface1, status/accent, .1)` |
| Status text and link/badge ink | Status token or accent, corrected on page, card and tinted badge |
| Clear and backdrop | `surface0` with alpha multiplied by 0 or .65 |

Contrast correction mixes toward the supplied `foreground` in .05 steps until
4.5:1 is reached. It cannot repair an unreadable host foreground/surface pair.
Primary and selected controls preserve the host accent pair even if that pair
falls below 4.5:1. Mixing interpolates channels including alpha and emits generated
hex. Unrecognized host color syntax retains a host endpoint. `isDarkSurface`, if
needed, uses only surface0 relative luminance and the shared .179 threshold; palette
construction does not choose a light/dark table.

Fleet has two domain-specific additions; neither changes the shared recipes:

- Existing tone/style aliases (`green`, `amber`, `red`, `link`, `transparent`)
  reference the corresponding shared semantic output. `blue` is the original host
  accent for selection borders; blue badges use corrected `accent` on `accentBg`.
- Kanban has no chart series. Fleet's `poolColors` uses accent mixed toward
  surface0 by 0, .3 and .6. `shareColors` supplies sixteen accent shades spanning
  0 through .65; longer lists repeat shades and remain distinguished by names.
  Both arrays are derived in the shared adapter. Client components only read them.

Only a completely absent host theme uses `shared/theme-fallback.ts`, a single
neutral grayscale theme identical to Kanban's `NEUTRAL_THEME`. The entry points are `RoleBoard` and `FleetSettings` via
`useStyles`; their descendants receive the resulting styles without separate
fallbacks. Actual SDK 0.11.2 supplies a theme, so this compatibility path is covered
by pure tests rather than the isolated browser screenshots.

Legacy `colorMode` values, including invalid values, are ignored on read. The next
font or tab save strips that field while preserving all other unknown JSON fields.
The RPC and both catalogs no longer expose a color-mode preference.

`server/test/theme-source.test.ts` scans client and shared source strings/templates
and CSS values for numeric or named paint. Its only source exemption is
`shared/theme-fallback.ts`; directories named `__fixtures__` are scanned too.
Fixtures remain under `server/test/fixtures`, outside the scanned directories.
The existing plugin test runner includes this gate in `npm run verify`.
Pure contrast tests and DOM mounts cover Home, all seven panel tabs and settings
through light/dark prop changes without remounting.

The isolated Web check switches Appearance through Light and Midnight, with
additional Claude evidence. Paseo may rebuild plugin DOM or close open drawers
when themes change; this is host behavior, not a promise of transient state
preservation by Fleet. These checks do not connect to the production daemon or
constitute final acceptance.
