# Release, branch, and stage discipline

greater uses a **three-branch flow** (staging → premain → main) with **changesets + release-please**, a **shadcn-style CLI distribution** (git-tag + registry + checksum, no npm), and **CI-enforced gates** (lint, typecheck, test, accessibility, build, registry regeneration) on every PR.

## Branch model

Observed pattern:

- **`staging`** — active development branch. Feature branches merge here first. This is where most work lands.
- **`premain`** — release candidate branch. Promotes from `staging` when an RC is being prepared. `release-please-config.premain.json` governs RC metadata. RC tags (`greater-vX.Y.Z-rc.N`) cut here.
- **`main`** — stable branch. Promotes from `premain` when the RC stabilizes. `release-please-config.json` governs stable metadata. Stable tags (`greater-vX.Y.Z`) cut here.

Feature branch naming observed:

- `chore/<topic>` — dependency bumps, toolchain maintenance, registry refreshes
- `chore/sync-lesser-contracts-v<ver>`, `chore/sync-lesser-graphql-v<ver>`, `chore/sync-lesser-host-v<ver>-and-deps` — contract-sync branches (frequent work category)
- `chore/release-automation`, `chore/release-flow-apptheory` — release-flow improvements
- `chore/agents` — stewardship / agent-config work
- `chore/backmerge-<source>-into-<target>` — back-merges from main into premain / staging (common after releases)
- `changeset-release/<branch>` — release-please PRs

Branch protection on all three enforces required review and CI status checks.

## Changesets and release-please

- **Changesets** — contributors add a changeset markup on PRs declaring the semver impact (`major`, `minor`, `patch`) and the user-facing description. The changeset is the source of truth for the changelog and the version bump.
- **release-please** — automation reads changesets, opens release PRs that bump versions and generate changelogs. Merging a release PR cuts a tag.
- **`release-please-config.json`** — governs main-branch (stable) releases.
- **`release-please-config.premain.json`** — governs premain-branch (RC) releases.
- **Packages released together** follow the workspace's release configuration; the config names which packages advance per release event.

## The CLI / registry distribution

greater publishes to GitHub Releases, not npm:

- **Tag format** — `greater-vX.Y.Z` (stable on `main`), `greater-vX.Y.Z-rc.N` (RC on `premain`).
- **GitHub Release asset** — `greater-components-cli.tgz` (installable as `npm install -g https://.../greater-vX.Y.Z/greater-components-cli.tgz`).
- **Registry manifest** — `registry/index.json` enumerates per-file checksums for components, tokens, icons, faces. `registry/latest.json` may point at the current tag.
- **Consumer install flow**:
  ```bash
  npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
  greater init <app>
  greater add <component>
  greater update --ref greater-vX.Y.Z   # pin to specific tag
  ```
- **CLI verifies checksums** before copying source into the consumer's codebase.

## CI gates

Every PR runs:

- **pnpm install** (fresh, lockfile-strict)
- **Lint** (ESLint)
- **Typecheck** (TypeScript `tsc --noEmit` across workspace)
- **Unit / integration tests** (Vitest; 75% coverage threshold)
- **E2E / a11y tests** (Playwright; `pnpm playwright:install` prerequisite)
- **Build** (Vite build of every workspace package)
- **Registry regeneration** — confirms `registry/index.json` is in sync with source
- **Contract sync check** — confirms `docs/lesser/contracts/` and `docs/lesser-host/contracts/` are consistent with adapter code
- **Changeset check** — PRs that change source without a changeset surface a warning; breaking changes without a major-impact changeset fail

A PR that fails any CI gate does not merge.

## The three-branch promotion rhythm

Standard rhythm:

1. **Feature branch → `staging`** via PR with required review. Changeset attached.
2. **`staging` CI** runs all gates. Contract-sync branches go through here routinely.
3. **`staging` → `premain`** — promotion happens when an RC is being prepared. Typically a release-please PR or a manual promotion. `premain` CI runs with RC release-please.
4. **`premain` → `main`** — promotion happens when the RC has stabilized (soak period, no regressions observed). Release-please merges the main-variant PR; stable tag cuts.
5. **Release automation** generates and publishes `greater-components-cli.tgz` on the tag, updates `registry/index.json` and `registry/latest.json` on the release commit.
6. **Backmerge** from `main` into `premain` / `staging` keeps branches in sync (observed `chore/backmerge-*` branches).

Promoting without soak or skipping branches requires explicit operator authorization.

## Contract-sync as a release-category event

A significant category of greater's work is **syncing pinned snapshots** with upstream Lesser / Lesser Host schema changes:

- **Observed branches**: `chore/sync-lesser-contracts-v1.1.0`, `chore/sync-lesser-graphql-v1.1.28`, `chore/sync-lesser-host-v0.1.7-and-deps`, `chore/sync-lesser-v1.1.25-lesser-host-v0.1.3`
- **Flow**: upstream publishes a new Lesser / Lesser Host version → `sync-contracts` skill walks the impact → feature branch updates pinned snapshots + adapter code → PR → normal three-branch flow
- **Release-timing**: contract-sync changes are typically `minor` if they add adapter capabilities, `patch` if they're schema-format refreshes without adapter changes, `major` if they drop an adapter surface (rare).

The `sync-contracts` skill walks this discipline.

## Release-blocking conditions

A PR cannot merge if:

- Lint, typecheck, test, a11y, build CI gate fails
- Registry regeneration mismatch
- Adapter change without corresponding contract-sync snapshot update
- Missing changeset for a source-changing PR
- Breaking change without major-version changeset
- Accessibility regression (contrast drop, keyboard-navigation failure, screen-reader semantic loss)
- CLI manifest inconsistent with source (checksum drift)

## Never set timeouts on CI jobs

A CI job that feels stuck is almost always Playwright browser installation, pnpm install pulling a slow dependency, a TypeScript build across the workspace, or a large component re-render cycle. Aborting loses diagnostic output. Run to completion.

CI timeouts are set at the GitHub Actions job-level per workflow and should be generous; do not override per-PR.

## Hotfix discipline

For urgent production issues:

- **Compressed soak between branches**, not skipped promotion.
- **Explicit operator authorization** for compression.
- **Hotfix version bumps** — typically `patch` (e.g. `greater-vX.Y.Z+1`) unless the fix itself is breaking, in which case major discipline applies.
- **Post-incident review.** Every hotfix produces a write-up identifying what gate missed the issue.

## Rollback discipline

Rollback mechanisms:

- **Published tags are immutable.** A bad release is fixed by a new version, not by re-pointing the tag.
- **Consumer rollback**: consumers re-pin to a prior `greater-vX.Y.Z` via `greater update --ref <prior-tag>`.
- **CLI rollback**: consumers reinstall the prior CLI via `npm install -g https://.../greater-v<prior>/greater-components-cli.tgz`.
- **Registry rollback**: `registry/index.json` and `registry/latest.json` update on the next release; previous release's registry is preserved as part of the previous tag's GitHub Release assets.

Never re-point a published git tag. Never delete a GitHub Release asset (prior versions are operator-critical rollback targets).

## Commit and PR discipline

- Clear commit subjects. Conventional Commits style encouraged (the changeset file declares impact semantically; the commit subject describes what moved).
- First line under 72 characters.
- Explain the _why_ in the body, especially for contract-sync, accessibility-adjacent, API-change, or registry-format changes.
- **DCO / signed commits** per repo convention.
- PRs through required review + CI gates.

## Rules you do not break

- Never force-push to `staging`, `premain`, or `main`.
- Never amend a commit that has been pushed.
- Never skip pre-commit hooks (`--no-verify`).
- Never bypass required review or CI gates.
- Never re-point a published git tag.
- Never delete GitHub Release assets.
- Never modify `registry/index.json` or `registry/latest.json` outside the release automation.
- Never commit without a changeset when the PR changes source (non-doc, non-chore) files.
- Never ship a breaking change without a major-version changeset.
- Never ship an adapter change without a synced contract snapshot.
- Never loosen accessibility baselines silently.
- Never add `'unsafe-inline'`, `'unsafe-eval'`, or third-party origins to component-level CSP expectations without explicit coordination with consumer stewards (host, sim).
- Never publish to npm (the shadcn-style distribution is the model).
- Never introduce AGPL-incompatible dependencies or proprietary blobs.
- Never vendor / fork FaceTheory or upstream Svelte patterns locally. Framework awkwardness is upstream signal.
- Never execute an advisor-dispatched brief without running `review-advisor-brief`.
- Never skip DCO / signed commits where required.
