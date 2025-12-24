# GitHub Releases

Greater Components distributes the `greater` CLI via GitHub Releases (it is not published to the npm registry).

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

## Notes

- `node scripts/pack-for-release.js` deletes and recreates `artifacts/`.
- For signed tags, see `docs/tag-signing-guide.md`.
