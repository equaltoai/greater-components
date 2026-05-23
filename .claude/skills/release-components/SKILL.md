---
name: release-components
description: Use to walk work from `staging` through `premain` (RC) to `main` (stable), cutting tags via release-please, generating `registry/index.json` + CLI tarball, publishing GitHub Releases, and coordinating backmerges. The three-branch flow + shadcn-style CLI distribution + changesets + release-please automation is greater's distinctive release discipline.
---

# Release greater components

After `implement-milestone` lands a PR to `staging`, the release path moves through `staging → premain → main` with changesets + release-please automation, CLI tarball generation, `registry/index.json` regeneration, signed-tag cutting, and GitHub Release publication. This skill walks that pipeline.

## When this skill runs

Invoke when:

- `staging` has accumulated merged work ready for RC promotion
- A release-please PR for `premain` (RC) needs review / merge
- A release-please PR for `main` (stable) needs review / merge
- A stable tag has been cut and CLI / registry / GitHub Release publishing is in progress or needs verification
- A backmerge from `main` → `premain` → `staging` is needed after a release
- A release-flow anomaly surfaces (release-please PR edge case, changeset parsing issue, registry regen drift, tag signing issue, CLI tarball upload failure)
- A rollback is required

## Preconditions

- **The work in `staging`** passed CI gates (lint, typecheck, test, a11y, build, registry regen, contract-sync) at merge time.
- **Changesets attached** to the merged PRs declaring semver impact.
- **Release-please config** (`release-please-config.json`, `release-please-config.premain.json`) current.
- **MCP tools healthy**, `memory_recent` first.
- **Operator authorization** for `main`-stage promotion.
- **For rollback**: consumer-side rollback mechanism understood (consumers re-pin to prior tag via `greater update --ref <prior>`).

## The three-branch rollout

### Phase A: Soak in `staging`

After merges to `staging`:

- **Observable evidence** that affected components work in `apps/playground/`
- **Adapter interop** with pinned contract versions verified
- **A11y tests pass** reliably (no intermittent failures)
- **Registry regen** produces no diff
- **Contract-sync check** passes
- Typically multiple features accumulate in `staging` before RC cut

### Phase B: Promote `staging → premain`

When RC-readiness reached:

1. **Back-merge `main` into `staging`** if drift (back-merge discipline after prior releases keeps branches aligned)
2. **Merge `staging` into `premain`** via PR or direct merge per team convention (observed: sometimes a fast-forward, sometimes a merge commit)
3. **release-please premain config** triggers — opens or updates a release PR on `premain` proposing an RC version bump based on accumulated changesets
4. **Review the release-please RC PR**:
   - Version bump matches the accumulated changeset impacts
   - CHANGELOG.md updates reflect actual changes
   - No unexpected file diffs
5. **Merge the release-please RC PR** — this cuts the RC tag `greater-vX.Y.Z-rc.N` on `premain`
6. **Verify RC tag** — signed, CI passed, artifacts generated
7. **Verify CLI tarball + registry**:
   - `greater-components-cli.tgz` uploaded to GitHub Release for the RC tag
   - `registry/index.json` and `registry/latest.json` updated (latest.json may or may not advance for RC — per team convention)
   - Checksums match between tarball contents and registry

### Phase C: RC soak in `premain`

- **Internal consumers test the RC**:
  - sim updates to the RC tag via `greater update --ref greater-vX.Y.Z-rc.N`
  - host web tests similarly
- **External opt-in consumers** may adopt the RC for testing
- **Iterate if regressions**: fix on `staging`, promote again to `premain`, cut next RC (e.g. `-rc.N+1`)
- **Soak duration** per risk; typically multiple days for non-trivial changes

### Phase D: Promote `premain → main`

When RC has stabilized:

1. **Merge `premain` into `main`**
2. **release-please main config** triggers — opens or updates a release PR on `main` proposing the stable version
3. **Review the stable PR**:
   - Version bump is the RC's final form (RC suffix stripped)
   - CHANGELOG consolidates changesets
   - Release-notes section drafted for the GitHub Release (breaking changes, migration, highlights)
4. **Operator authorizes the stable promotion**
5. **Merge the release-please stable PR** — cuts `greater-vX.Y.Z` on `main`
6. **Verify stable tag** — signed, CI passed
7. **CLI tarball + registry publishing**:
   - `greater-components-cli.tgz` uploads to GitHub Release
   - `registry/index.json` + `registry/latest.json` update on the release commit
   - Checksums verified

### Phase E: Backmerge

After stable cut:

- **Backmerge `main` → `premain`** — keeps `premain` aligned with released stable
- **Backmerge `premain` → `staging`** — keeps `staging` aligned
- Observed branches: `chore/backmerge-main-into-staging`, `chore/backmerge-main-into-staging-v0.5.0-stable`

### Phase F: Post-release monitoring

- **Consumer reports** via issues on greater-components, sim, host
- **CLI install reliability** via community channels (if any)
- **Registry integrity** — periodic verification that registry JSON matches source + uploaded tarball

## Never set timeouts on CI jobs

Playwright installation, pnpm install, TypeScript workspace build, large-component re-render — all can take meaningful time. Aborting loses diagnostic output. Run to completion.

## Rollback discipline

- **Consumer rollback**: re-pin to prior tag via `greater update --ref <prior-stable>`.
- **CLI rollback**: consumers reinstall the prior CLI tarball.
- **Registry rollback**: `registry/*.json` updates on next release; prior release's registry is preserved in that release's GitHub Release assets.
- **Tag immutability**: published tags are never re-pointed. A bad release is fixed by publishing `greater-vX.Y.Z+1` (patch) or `greater-vX.Y.{Z+1}-rc.1` depending on severity.
- **GitHub Release assets are never deleted** — they are consumer rollback targets.

## Hotfix discipline

For urgent production issues:

- **Compressed soak** between branches, not skipped promotion.
- **Explicit operator authorization** for compression.
- **Hotfix version**: typically `patch` (e.g. `greater-vX.Y.Z+1`) unless the fix itself is breaking.
- **Hotfix goes through the same three-branch flow** — `staging → premain → main`. It does not branch from `main` directly; the flow is preserved.
- **Post-incident review** identifies what CI gate or specialist-walk missed the issue.

## Output: the release record

```markdown
## Release record: <release name>

### Scope

- Version: <greater-vX.Y.Z>
- Impact: <major / minor / patch>
- Changesets consolidated: <list>
- Breaking changes (if any): <documented in release notes>

### Phase timeline

#### Staging

- Staging branch at commit: <SHA>
- Work accumulated: <summary>
- Soak completed: <yes, criteria met>

#### Premain (RC)

- Promotion commit: <SHA>
- release-please premain PR: <URL>
- RC tag cut: <greater-vX.Y.Z-rc.N>
- RC artifacts: <CLI tarball URL, registry updates>
- Internal consumer testing: <sim tested at version X, host web tested at version Y>
- Soak duration: <...>

#### Main (stable)

- Operator authorization: <...>
- Promotion commit: <SHA>
- release-please stable PR: <URL>
- Stable tag cut: <greater-vX.Y.Z>
- GitHub Release published: <URL>
- Release notes: <summary>
- CLI tarball: <URL, checksum>
- Registry updates: `registry/index.json` + `registry/latest.json` at <SHA>
- Signed tag verified: <yes>

### Backmerge

- Main → premain: <commit SHA>
- Premain → staging: <commit SHA>

### Post-release monitoring

- Consumer reports: <none / issues filed>
- CLI install reliability: <...>

### Rollback (if any)

<trigger, mechanism, prior-tag restore instructions>
```

## Refusal cases

- **"Promote directly from staging to main; skip premain."** Refuse. The RC stage is the soak gate.
- **"Cut a stable tag on premain."** Refuse. Stable tags cut on main only.
- **"Re-point greater-vX.Y.Z to a new commit."** Refuse. Tag immutability is sacred.
- **"Delete a GitHub Release asset from a prior version."** Refuse. Prior releases are rollback targets.
- **"Hand-edit `registry/index.json` to fix a checksum mismatch."** Refuse. Regenerate via the script; investigate the drift.
- **"Hand-edit `registry/latest.json` to point at a non-current version."** Refuse. Updates happen via release automation.
- **"Skip the release-please PR review; the bot got it right."** Don't skip. Review verifies version, changelog, artifact expectation.
- **"Ship a release without running backmerge."** Backmerge discipline is part of the flow; skipping produces branch drift that bites future releases.
- **"Publish to npm for broader reach."** Refuse. Shadcn-style CLI distribution is the model.
- **"Set a 30-minute timeout on the CI release-pipeline job."** Never.
- **"Skip the operator authorization for stable promotion."** Refuse.
- **"Cut a stable release from an RC that's only been tested for an hour."** Evaluate risk; typically refuse for non-trivial changes.

## Persist

Append when the release surfaces something worth remembering — a release-please PR edge case, a changeset parsing subtlety, a registry regen timing issue, a CLI tarball upload failure, an RC-soak pattern that worked well or didn't, a consumer-side migration observation, a backmerge-conflict resolution. These events are the release-flow's paper trail.

Five meaningful entries is the right scale; release events are inherently memorable.

## Handoff

- **Release clean through all phases** — stop. Record release, append memory if warranted.
- **RC regressions** — fix on staging; re-promote; cut next RC.
- **Stable-release regression** — patch via normal flow (new version), never re-point.
- **Release surfaces scope question** — `scope-need` once release is stable.
- **Release-automation issue** (release-please bug, tooling gap) — `coordinate-framework-feedback` if framework-level, otherwise scope as a release-automation improvement.
- **Consumer report post-release** — route through `investigate-issue`.
- **Backmerge conflicts surface** — resolve via standard git conventions; no short-circuiting.
