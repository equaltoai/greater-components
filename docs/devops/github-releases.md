# GitHub Releases

Greater Components distributes the `greater` CLI via GitHub Releases (it is not published to the npm registry).

## Branching Model

- `premain` is the default integration branch; feature PRs should target `premain`.
- `main` is release-only; the only PR allowed into `main` is `premain → main` for a release cut.

## Release Definition (Client-Facing)

A **Greater Components release** is a single, immutable reference that clients can pin and upgrade to safely.

- **Identifier:** a Git tag `greater-vX.Y.Z` (prefer signed tags).
- **Artifacts:** a GitHub Release for that tag containing at least:
  - `greater-components-cli.tgz` (installable `greater` CLI)
  - `registry/index.json` and `registry/latest.json` (CLI registry metadata)
- **Registry contract:** `registry/index.json` in the tag matches the tagged source tree (`pnpm validate:registry` passes).
- **Quality gates:** CI is green for the tag’s commit (lint/format, build, unit, a11y, e2e, CodeQL).
- **Upgrade path:** clients install the CLI from the Release and pin `--ref greater-vX.Y.Z`.

## Creating a Release (Maintainers)

If you want a single command that orchestrates the full flow (prepare → PR → merge premain → open release PR), run:

- `pnpm release:cut 0.1.0`

1. Prepare the release commit on `premain` (bump version + update registry refs):
   - `pnpm release:prepare 0.1.0`
   - Commit and merge to `premain` via PR.
2. Cut the release by merging `premain → main` via PR.
3. Tag + artifacts are published automatically:
   - `Tag Release` creates the `greater-vX.Y.Z` tag from `main`.
   - `Publish GitHub Release Artifacts` attaches `greater-components-cli.tgz`, `registry/index.json`, and `registry/latest.json`.

## Installing the CLI (Consumers)

```bash
# Replace `greater-vX.Y.Z` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
greater --version
```

## Verifying a Release (Maintainers)

Run locally before tagging:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm validate:package
pnpm validate:registry
pnpm test:unit
pnpm test:a11y:ci
pnpm test:e2e
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

## Notes

- `node scripts/pack-for-release.js` deletes and recreates `artifacts/`.
- For signed tags, see `docs/tag-signing-guide.md`.
