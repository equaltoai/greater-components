---
name: release-components
description: Use to verify or prepare greater's operator-owned release path after work has landed in staging: staging → main promotion evidence, manual tag-driven release off main, CLI tarball + registry artifact validation, immutable GitHub Release verification, and post-release monitoring. No release-please, changesets, premain RC, or auto-publish-on-merge flow remains active.
---

# Release greater components

greater now uses **feature → staging → main** with a manual, tag-driven release cut from `main`. This skill is for release verification and operator handoff; it does not merge, sign, tag, or publish.

## Preconditions

- `staging` contains the approved work and its feature→staging PR passed the verify set: `Build and Test`, `ESLint and Prettier Check`, DCO, registry/integrity, contract-sync, and package validation gates.
- `main` promotion is operator-owned and accepts PRs only from `staging`.
- The release tag is a signed `greater-vX.Y.Z` tag pointing to a commit reachable from `origin/main`.
- Version bump PRs have already regenerated `registry/index.json` and `registry/latest.json` so versions, refs, and checksums match `package.json`.

## Active release path

1. **Feature → staging**: normal milestone PR. CI verifies source, packages, registry integrity, pinned contracts, accessibility, and DCO.
2. **staging → main**: operator promotion PR only. `main-guard.yml` enforces `head_ref == staging`. Do not rerun the staging verify workflows on `main`.
3. **Manual tag**: operator creates/signs `greater-vX.Y.Z` on `main`.
4. **Manual Release workflow**: `.github/workflows/manual-release.yml` runs on the tag (or workflow_dispatch from `main` for an existing tag), asserts the tag is reachable from `origin/main`, builds the CLI tarball, validates the registry, uploads `registry/index.json`, `registry/latest.json`, and `artifacts/*`, then publishes the GitHub Release.
5. **Post-release verification**: confirm the release assets exist, registry refs match the tag, checksums validate, and consumers can install via the CLI tarball/tag.

`docs.yml` may still deploy the docs site on `push: main`; that is non-release documentation automation and is intentionally outside the release-publish path.

## Validation commands

- `pnpm audit:lockfile-integrity`
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `pnpm validate:package`
- `pnpm validate:registry --strict`
- `pnpm audit:tarball-integrity`
- `pnpm release:artifacts` (release workflow context)
- `bash scripts/verify-release-branch.sh greater-vX.Y.Z`

## Refusals

- Do not publish on merge to `main`.
- Do not add `branches: [main]` to `lint.yml` or `test.yml`.
- Do not revive release-please, changesets, `premain`, or promotion rehearsal without a new governance decision.
- Do not cut or publish a release from a commit that is not reachable from `origin/main`.
- Do not re-point a published tag or mutate a published release asset. Ship a new patch release instead.
- Do not hand-edit registry JSON to repair drift; regenerate and validate.

## Output

Report: staging PR, main promotion evidence (if available), tag, release workflow run, asset list, registry/version validation, contract pins, known docs.yml carve-out, risks, and follow-ups.
