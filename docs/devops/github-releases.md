# GitHub Releases

Greater Components distributes the `greater` CLI via GitHub Releases (it is not published to the npm registry).

## Branching Model

- `staging` is the default integration branch; feature PRs target `staging` and must include a changeset.
- `premain` is release-candidate only; changes are promoted from `staging → premain` for integration testing.
- `main` is release-only; changes are promoted from `premain → main` for stable releases.

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

1. Promote changes from `premain → main` via PR.
2. On merge, GitHub Actions opens a stable release PR into `main` (release-please), aligned to the latest `premain` RC baseline.
3. Approve + merge the stable release PR (no manual versioning).
4. GitHub Actions tags `greater-vX.Y.Z` from `main` and publishes release artifacts automatically.

## Notes

- `staging` runs checks only; release tags are only ever created from `premain` (RC) and `main` (stable).
- `registry/latest.json` always points to the latest **stable** tag (it is not updated by `-rc.*` prereleases).

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
