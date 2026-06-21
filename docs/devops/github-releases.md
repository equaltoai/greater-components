# GitHub Releases

Greater Components releases are manual, tag-driven, and anchored on `main`.
The source-control model is **feature → staging → main**:

- `staging` is the default integration branch. Feature PRs target `staging` and run the existing verify set: `Build and Test` + `ESLint and Prettier Check`, with DCO and package/registry/contract gates.
- `main` is protected and operator-owned. It accepts PRs only from `staging`; `main-guard.yml` enforces the head-ref restriction. Do not re-run the staging verify workflows on `main`.
- Releases are cut by signed `greater-vX.Y.Z` tags on commits reachable from `origin/main`. There is no release-please, changesets, `premain`, promotion rehearsal, or auto-publish-on-merge path.

`docs.yml` still deploys the documentation site on `push: main`. That is known surviving documentation automation and is not a release-publish path.

## Release artifact contract

A Greater Components release is a single immutable reference that clients can pin and upgrade to safely. A release must provide:

- signed tag: `greater-vX.Y.Z`
- GitHub Release for that tag
- `greater-components-cli.tgz`
- `registry/index.json`
- `registry/latest.json`
- generated package tarballs under `artifacts/`

The workflow derives the release version from the `greater-vX.Y.Z` tag, updates package/manifest versions ephemerally in the CI workspace, and regenerates `registry/index.json` plus `registry/latest.json` from that tag before packaging. A committed package.json pre-bump is not required and does not gate the release.

## Operator release flow

1. Confirm the feature→staging PRs passed the verify set.
2. Promote `staging → main` via PR. `main-guard.yml` must pass and show `Head: staging`.
3. Dispatch `.github/workflows/manual-release.yml` from `main` with `version=greater-vX.Y.Z`, or push an existing `greater-vX.Y.Z` tag. Dispatch creates and pushes the tag at the dispatched `main` SHA when it does not already exist, and refuses only if that tag already points at a different SHA.
4. Verify the workflow asserts tag ancestry, derives `X.Y.Z` from the tag, regenerates package/registry metadata ephemerally, builds artifacts, uploads assets, and publishes the GitHub Release.

Local release checks mirror the workflow:

```bash
git fetch origin main --force --tags
bash scripts/verify-release-branch.sh greater-vX.Y.Z
pnpm audit:lockfile-integrity
pnpm install --frozen-lockfile
pnpm release:prepare greater-vX.Y.Z
pnpm validate:package
pnpm validate:registry
pnpm audit:tarball-integrity
pnpm release:artifacts
```

## Consumer install smoke

```bash
# Replace greater-vX.Y.Z with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
greater --help
greater add Button --ref greater-vX.Y.Z
```

## Release notes template

```text
Greater Components release: greater-vX.Y.Z (YYYY-MM-DD)

Tag: greater-vX.Y.Z
Commit: <sha reachable from main>
CLI tarball: https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
Registry: registry/index.json + registry/latest.json attached to release

Highlights:
- ...

Compatibility:
- Lesser pin: <docs/lesser/contracts/LESSER_REF.txt>
- Lesser Host pin: <docs/lesser-host/contracts/LESSER_HOST_REF.txt>

Install:
  npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
  greater update --ref greater-vX.Y.Z
```
