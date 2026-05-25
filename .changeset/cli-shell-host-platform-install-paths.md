---
'@equaltoai/greater-components-cli': patch
---

Fix CLI install paths for `shell` and `host-platform`. Adding these
top-level workspace packages (G0 / G2) updated `CORE_PACKAGES` in
`transform.ts` but missed the matching `CORE_PACKAGE_NAMES` sets in
`dependency-resolver.ts` and `fetch.ts`, so `greater add shell --ref
greater-v0.9.1-rc.0` and `greater add host-platform ...` resolved files
to `packages/shared/<name>/...` (non-existent) and returned 404 from
GitHub raw. Routing now correctly resolves both into `packages/<name>/`
just like the other top-level packages (`primitives`, `icons`, `tokens`,
`utils`, `content`, `adapters`, `headless`). The fix also improves the
file-fetch error message to surface both the user-passed ref and the
commit SHA it was pinned to, so future failures don't read as "the CLI
ignored `--ref` and used a hardcoded default" when in fact `--ref` is
honored end-to-end. Resolves #674.
