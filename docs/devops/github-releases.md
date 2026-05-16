# GitHub Releases

Greater Components distributes the `greater` CLI via GitHub Releases (it is not published to the npm registry).

## Branching Model

- `staging` is the default integration branch; feature PRs target `staging` and may include a changeset when you want release notes or internal bookkeeping.
- `premain` is release-candidate only; changes are promoted from `staging → premain` for integration testing.
- `main` is stable release promotion only; changes are normally promoted from `premain → main`, and may be promoted directly from `staging → main` when we intentionally bypass the RC lane.

## Release Definition (Client-Facing)

A **Greater Components release** is a single, immutable reference that clients can pin and upgrade to safely.

- **Identifier:** a Git tag `greater-vX.Y.Z` (prefer signed tags).
- **Artifacts:** a GitHub Release for that tag containing at least:
  - `greater-components-cli.tgz` (installable `greater` CLI)
  - `registry/index.json` and `registry/latest.json` (CLI registry metadata)
- **Registry contract:** `registry/index.json` in the tag matches the tagged source tree (`pnpm validate:registry` passes).
- **Quality gates:** CI is green for the tag’s commit (lint/format, build, unit, a11y, e2e, CodeQL).
- **Upgrade path:** clients install the CLI from the Release and pin `--ref greater-vX.Y.Z`.

## Creating a Release Candidate (Maintainers)

Release candidates are cut from `premain` using a version like `X.Y.Z-rc.N`. They are used for client integration testing.

1. Promote changes from `staging → premain` via PR.
2. On merge, GitHub Actions opens a prerelease PR into `premain` (release-please).
3. Approve + merge the prerelease PR (no manual versioning).
4. GitHub Actions tags `greater-vX.Y.Z-rc.N` from `premain` and publishes prerelease artifacts automatically.

## Creating a Stable Release (Maintainers)

1. Promote changes from `premain → main` via PR, or from `staging → main` when you explicitly want to bypass the RC lane.
2. On merge, GitHub Actions opens a stable release PR into `main` (release-please), aligned to the latest `premain` RC baseline.
3. Approve + merge the stable release PR (no manual versioning).
4. GitHub Actions tags `greater-vX.Y.Z` from `main` and publishes release artifacts automatically.

## Notes

- `staging` runs checks only; release tags are only ever created from `premain` (RC) and `main` (stable).
- `registry/latest.json` always points to the latest **stable** tag (it is not updated by `-rc.*` prereleases).
- When bypassing RC, rehearse both `staging → premain` and `staging → main` merge paths before merging the staging PR so either promotion lane stays conflict-free.

## Promotion Rehearsal (Required)

Every staging-targeted branch must prove the exact merge path that operators will use next. The important detail is that ordinary PRs into `staging` are often squash-merged; rehearsing only the feature branch topology can produce a false pass because the squash commit loses ancestry from `main` or `premain`.

Use the dedicated rehearsal script instead of ad-hoc `git merge-tree` commands:

```bash
# Ordinary staging PRs that will be squash-merged.
git fetch origin staging premain main --force
pnpm release:rehearse -- --candidate HEAD --simulate-squash

# Release-topology/backmerge branches that must preserve merge ancestry.
# These PRs must be merged with "Create a merge commit", not squash.
git fetch origin staging premain main --force
pnpm release:rehearse -- --candidate HEAD
```

The script validates all promotion lanes that must remain available:

- candidate `staging → premain` for the RC lane
- candidate `staging → main` for an explicitly approved direct stable promotion
- synthetic `premain → main` after the candidate has landed in `premain`

CI runs the same rehearsal in `.github/workflows/promotion-rehearsal.yml`:

- ordinary PRs to `staging` are checked as a **squash** result;
- branches named `chore/release-topology-*` or `chore/backmerge-*` are checked with their merge ancestry preserved;
- pushes to `staging` check the actual resulting branch state.

If rehearsal fails, do not merge and do not open a `staging → premain` PR. Fix the release topology first.

## Release-Topology Repair Branches

Use a release-topology branch when a normal staging PR cannot be made promotion-safe by content changes alone (for example, after `staging` was squash-merged while `premain` still contains prerelease metadata).

1. Start from current `origin/staging`:

   ```bash
   git fetch origin staging premain main --force
   git switch -c chore/release-topology-YYYY-MM-DD origin/staging
   ```

2. Merge the release branches into the repair branch so ancestry is explicit:

   ```bash
   git merge --no-ff --signoff origin/premain \
     -m "chore: stitch premain ancestry into staging release path"
   # Resolve conflicts by keeping the intended staging source state, then regenerate registry metadata.
   pnpm generate-registry
   git add <resolved-files> registry/index.json registry/latest.json
   git commit -s --no-edit

   git merge --no-ff --signoff origin/main \
     -m "chore: stitch main ancestry into staging release path"
   # Resolve generated registry/latest conflicts the same way: intended staging source + regenerated registry.
   pnpm generate-registry
   git add registry/index.json registry/latest.json
   git commit -s --no-edit
   ```

3. Rehearse the topology-preserving path:

   ```bash
   pnpm release:rehearse -- --candidate HEAD
   ```

4. Open the PR to `staging` and label the PR body clearly:

   ```text
   Release-topology repair: merge with "Create a merge commit" only. Do not squash.
   ```

   Prefer merging these PRs with the CLI so the merge method is unambiguous:

   ```bash
   gh pr merge <PR_NUMBER> --repo equaltoai/greater-components --merge
   ```

   Do **not** use the default green button if it says **Squash and merge**. Open the merge-method dropdown
   and choose **Create a merge commit**.

5. After the PR is merged to `staging`, confirm the push check passed and confirm the release branches are
   ancestors of `staging`:

   ```bash
   git fetch origin staging premain main --force
   git merge-base --is-ancestor origin/premain origin/staging
   git merge-base --is-ancestor origin/main origin/staging
   pnpm release:rehearse -- --candidate origin/staging
   ```

   Then create the `staging → premain` promotion PR.

Do **not** squash a release-topology repair PR. Squashing discards the `premain`/`main` ancestry that the branch exists to restore, and can recreate the same promotion conflict.

## Installing the CLI (Consumers)

```bash
# Replace `greater-vX.Y.Z` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
greater --version
```

## Client Announcement Template

```text
Greater Components release: greater-vX.Y.Z (YYYY-MM-DD)
Highlights:
- …

Breaking changes / migrations:
- …

CSP compatibility status:
- …

Upgrade:
  npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
  greater update --all --ref greater-vX.Y.Z --yes
```
