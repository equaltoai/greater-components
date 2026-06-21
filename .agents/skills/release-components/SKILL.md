---
name: release-components
description: Use when operator-owned Greater release work is ready after staging has passed the existing pnpm verify set. Walks manual staging → main promotion, manual tag-driven release off main, CLI registry artifact verification, GitHub Release evidence, and post-release alignment. Retired release automation is not authority.
---

# Release greater components

This skill is the Greater steward's release discipline under the active **feature → staging → main** branch profile. It does not implement code changes, merge main, cut tags, or publish releases. It prepares evidence for the operator-owned promotion and manual release.

## Active release model

- **Feature → staging**: feature branches merge to `staging` by PR after required review and the existing pnpm verify set passes, including the required GitHub checks **Build and Test** and **ESLint and Prettier Check**.
- **Staging → main**: `main` accepts PRs only from `staging`. The promotion uses default GitHub checks and branch rules only; do not rerun the full pnpm verify set as a main-promotion gate.
- **Release**: manual, operator-owned, tag-driven off `main`. The operator cuts the stable tag, publishes GitHub Release assets, and owns any signing or registry publication step.
- **Release automation is not authority**: prior source-changing release automation is retired for this milestone. Do not invoke automated version-bump or publish-on-merge tooling as the release authority.
- **Contract sync remains mandatory**: adapter changes still require pinned contract sync before feature→staging merge. Preserve `LESSER_REF` v1.5.3, `LESSER_HOST_REF` v1.0.3, and `check-openapi-auth` discipline unless a separate contract-sync milestone changes them.

## Preconditions

- `staging` contains the candidate release state.
- Required feature→staging checks passed when the candidate merged: **Build and Test** plus **ESLint and Prettier Check**.
- Registry regeneration and contract-sync checks are clean on `staging` before promotion evidence is prepared.
- The principal/operator explicitly authorizes main promotion and tag/release work.

## Release walk

1. **Ground release candidate** — record current `staging` SHA, current `main` SHA, target version/tag, and included PRs.
2. **Verify staging evidence** — confirm the existing pnpm verify set passed on the staging candidate. Capture links/check names; do not substitute a new verifier.
3. **Check contract pins** — confirm adapter-touching work has synced pinned snapshots and that `LESSER_REF` v1.5.3 / `LESSER_HOST_REF` v1.0.3 / `check-openapi-auth` expectations remain explicit.
4. **Prepare staging→main PR evidence** — summarize candidate, verify evidence, registry/CLI artifact expectations, and release notes. The steward may open/report the PR if authorized, but does not merge it.
5. **Operator-owned main promotion** — the operator/reviewer merges the staging→main PR under branch rules. The steward does not merge main.
6. **Manual tag and GitHub Release** — after main promotion, the operator cuts the tag from `main` and publishes release assets. The steward verifies tag SHA, registry/CLI tarball checksums, and GitHub Release asset presence.
7. **Post-release alignment** — ensure `staging` is aligned with `main` after release if repo policy requires it, using a normal PR and required staging checks.

## Refusals

- "Merge main yourself." Refuse; main promotion is operator-owned.
- "Run the full pnpm verify set again on staging→main because it feels safer." Refuse as a required gate; this milestone intentionally avoids duplicate verify/rubric runs.
- "Cut a stable tag before the staging candidate is promoted to main." Refuse.
- "Use release automation as the release authority." Refuse.
- "Delete or re-point a published tag or release asset." Refuse; publish a new corrective tag/release instead.
- "Ship adapter changes without pinned contract sync." Refuse; contract sync is orthogonal and still mandatory.
