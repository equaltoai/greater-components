# GitHub Releases

Greater Components distributes the `greater` CLI via GitHub Releases (it is not published to the npm registry).

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

1. Create a repo release tag:
   - `pnpm release:tag:dry` (preview)
   - `pnpm release:tag` (creates `greater-vX.Y.Z`)
2. Build and pack release artifacts:
   - `node scripts/pack-for-release.js`
   - Output is written to `artifacts/` and includes `greater-components-cli.tgz`
3. Create a GitHub Release for the new `greater-vX.Y.Z` tag and upload everything in `artifacts/`.

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
