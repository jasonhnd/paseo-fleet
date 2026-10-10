# Source import record

The public repository contains the plugin implementation and standalone Node commands.
It remains experimental and has no release tag from this import.

## Provenance

| Input | Commit |
|---|---|
| Source main baseline | `469b76d191f0980e45c1f6119f188143822ccd82` |
| Standalone command packaging | `e176223978fb89fe56eae6cd1a39834067ef78ba` |
| Temporary merged source snapshot | `915306fc` |
| Public skeleton baseline | `a97ad65` |

The export copied 258 tracked files and excluded the source examples README.
Only the plugin entries and allowed source directories were overlaid. The public
manifest, overview, license, gate scripts, and documentation were retained.
The source history was not imported into this repository.

Both entry files remain byte-for-byte identical to the merged source snapshot.
The nine contract files and `contract.manifest.json` are unchanged from the public
skeleton and match the source baseline. No companion contract update is required.
Later source changes must be compared with the recorded baseline before porting.

## Public adaptations

- Replace private terms and card references with generic or demo values while
  keeping all exported tests. The initial scan found 209 matches: 166 private terms
  and 43 card references. The completed source and generated commands have zero.
- Use the repository root as the plugin root in command and regression tests.
  Ship the install-time matrix as `shared/default-dispatch.example.json`.
- Build roles, doctor, migration, and coupon commands as standalone Node ESM.
  Exclude development command sources, tests, and fixtures from the package.
- Make legacy state lookup and the optional external sidebar directory configurable.
  Plugin status checks require a configured id rather than an owner's plugin name.
  Model selection retains host options and applies configured provider exclusions.
- Extend the shared command builder for both plugin layouts. Namespace imports let
  esbuild drop unused Zod exports, locales, and converters without weakening privacy
  rules or altering dependency source files.

The matching companion gate commits are `bcf7e95` and `e77632f`. They must be
integrated into the companion repository before comparing against its main checkout;
validation against the prepared companion checkout uses identical shared gate files.

## Verification and remaining release work

The local verification run passes all twelve gates: types, script tests, CLI build,
Paseo compilation, plugin tests, whole-tree privacy, next-commit identity, history
identity, history secrets, contract, shared gates, and package file checks.
The compiler is the installed Paseo server compiler, version 0.11.2.
The previous source compiler harness also compiled both imported entries and checked
that every shared source file avoids Node built-ins.

The npm package is unpacked and exercised with Node, an empty PATH, no node_modules,
and isolated demo directories. Roles, migration and coupon help, decision creation
and listing, and project pause/resume pass. This is command-package evidence, not
proof of desktop loading or authentication.

No production daemon, data, credentials, source checkout, or public main checkout
was changed. No push, merge, tag, or release was performed. Desktop mounting,
clean-host installation, real provider use, platform certification, and migration
cutover remain separate release prerequisites. The existing dependency audit reports
20 vulnerabilities (5 moderate, 15 high); dependency upgrades were outside this import.
