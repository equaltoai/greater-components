---
'@equaltoai/greater-components-adapters': patch
'@equaltoai/greater-components-cli': patch
---

Clear four MODERATE-severity advisories from the workspace lockfile by
bumping affected dependencies and tightening one pnpm override.

CVEs cleared:

- **GHSA-jxxr-4gwj-5jf2** — `brace-expansion` ReDoS / memory-exhaustion
  via large `{1..N}` ranges. Existing `brace-expansion@^5.0.0` override
  was set to `^5.0.5` (one patch below the fix at 5.0.6); override
  now bumped to `^5.0.6`.

- **GHSA-58qx-3vcg-4xpx** — `ws` uninitialized memory disclosure when
  `WebSocket.close(code, reason)` is called with a `TypedArray` as the
  reason argument. Patched in 8.20.1. Bumped `packages/adapters`
  devDependency from `^8.20.0` to `^8.21.0` and added a workspace-wide
  override `ws@^8.0.0 -> ^8.21.0` to cover transitive paths via
  `graphql-ws` and other consumers.

- **GHSA-hgv7-v322-mmgr** — `@sveltejs/kit` `query.batch` cross-talk
  enabling cross-user data disclosure under rare timing in concurrent
  SSR requests. Patched in 2.60.1. Bumped from `^2.57.1` to `^2.61.1`
  in `apps/docs`, `apps/playground`, and `packages/cli`.

- (transitive `ws` via `viem`) — Bumped `packages/adapters` runtime
  dependency `viem` from `^2.47.14` to `^2.51.0` for hygiene; viem's
  own newer release pulls a patched ws transitively.

Runtime impact on greater-components consumers: **none**. All four
advisories are in build / dev / codegen-time paths:

- `brace-expansion` is consumed by `@graphql-codegen/cli` (devDep) for
  glob expansion against `docs/lesser/contracts/`; inputs are
  developer-controlled, not user-controlled.
- `ws` direct usage is a devDep in `packages/adapters`; greater
  consumers receive only the published source via the shadcn-style CLI
  and never get our devDependencies.
- `@sveltejs/kit` is a build-time tool; `apps/docs` and
  `apps/playground` are both `adapter-static` (fully prerendered),
  so the SSR `query.batch` runtime exploit surface is not present.

Provenance verified for all four patched versions: all MIT-licensed
(AGPL-3.0-compatible); all four have npm registry signatures with the
canonical npm signing key; `@sveltejs/kit@2.61.1` and `viem@2.51.0`
additionally carry SLSA-v1 provenance attestations from their GitHub
Actions build pipelines.

This update touches only dependency version strings and the lockfile.
No source changes, no API changes, no Mastodon-compat impact.
