# Repository Guidelines

## Project Structure & Module Organization

- `packages/*` contains publishable libraries: `greater-components` bundles exports, while `primitives`, `headless`, `faces/*`, `shared/*`, `adapters`, `icons`, `tokens`, `utils`, and `testing` house feature-specific code.
- `apps/docs` builds the documentation site and `apps/playground` is the local sandbox for rapid component trials.
- Reference material sits in `docs/`; shared schemas live in `schema.graphql` and `schemas/`; automation scripts (coverage aggregation, publishing) live in `scripts/`.
- Builds emit to each package's `dist/`; regenerate via scripts instead of editing generated output.

## Build, Test, and Development Commands

- Install with `pnpm install`; the `preinstall` hook enforces pnpm and Node 24 (`.nvmrc`).
- `pnpm dev` runs docs and the playground in parallel; narrow focus with `pnpm --filter <package> <command>` when iterating on a single module.
- `pnpm build` compiles every workspace; `pnpm check` calls each package’s `check` script when present.
- `pnpm lint`, `pnpm format`, and `pnpm typecheck` should be clean before requesting review (changesets are optional; see release flow notes below).

## Critical: Sync Lesser Contracts + Regenerate Adapters

Greater’s adapters are generated from Lesser’s published **file-only contracts** (OpenAPI + aggregated GraphQL schema).
Any time Lesser’s API surface changes, you must update the pinned contracts in this repo and regenerate the derived
artifacts before shipping changes.

Why this is critical:

- `packages/adapters` REST and GraphQL types are generated from `docs/lesser/contracts/*`.
- The `greater` CLI fetches files using `registry/index.json` checksums; if generated files change but the registry
  checksums are not regenerated, installs/updates can fail integrity verification.

Pinned contract snapshots live here:

- OpenAPI: `docs/lesser/contracts/openapi.yaml`
- GraphQL schema: `docs/lesser/contracts/graphql-schema.graphql`
- Pin record: `docs/lesser/contracts/LESSER_REF.txt` (must include the Lesser tag + commit)

Update workflow (assumes `../lesser` exists as a sibling checkout; always run on Node 24):

```bash
cd /path/to/greater-components
nvm use  # should resolve to Node v24 per .nvmrc

LESSER_TAG="$(git -C ../lesser tag --sort=-v:refname | head -n 1)"
LESSER_COMMIT="$(git -C ../lesser rev-parse "${LESSER_TAG}")"

git -C ../lesser show "${LESSER_TAG}:docs/contracts/openapi.yaml" \
  > docs/lesser/contracts/openapi.yaml
git -C ../lesser show "${LESSER_TAG}:docs/contracts/graphql-schema.graphql" \
  > docs/lesser/contracts/graphql-schema.graphql

printf "tag: %s\ncommit: %s\n" "${LESSER_TAG}" "${LESSER_COMMIT}" \
  > docs/lesser/contracts/LESSER_REF.txt

corepack pnpm generate:openapi
corepack pnpm generate:graphql
corepack pnpm generate-registry

corepack pnpm --filter @equaltoai/greater-components-adapters typecheck
corepack pnpm --filter @equaltoai/greater-components-social typecheck
```

Notes:

- Prefer pinning to a Lesser **release tag** (example: `v1.1.3`) over a moving branch ref.
- If the Lesser schema/contracts look invalid, stop and ask for the Lesser team to fix the release/tag rather than patching around it in Greater.

## Critical: Release Flow + CI Governance

Every Greater release is promoted through:

- `staging` → `premain` (rc) → `main` (stable)

CI expectations:

- `staging` is where we run the full suite (lint/typecheck, unit tests, e2e, a11y).
- `premain` and `main` are promotion/release-only; PRs into these branches are guarded (`.github/workflows/premain-guard.yml`, `.github/workflows/main-guard.yml`) and should not require re-running the full staging suite.
- Changesets are optional (not required for PRs to `staging`); releases are automated via release-please on `premain`/`main`.

## CLI: Build + Install Locally

The CLI lives in `packages/cli` and installs the `greater` binary (Node 24 required):

```bash
corepack pnpm install
corepack pnpm --filter @equaltoai/greater-components-cli build
corepack pnpm add -g ./packages/cli

greater --help
```

## Coding Style & Naming Conventions

- Prettier (tabs, width 100, single quotes, trailing commas) plus `prettier-plugin-svelte` governs formatting; JSON/YAML use two-space indents.
- ESLint (`eslint.config.js`) enforces TypeScript and Svelte rules; lean on `pnpm lint:fix` for quick cleanups.
- Components export in PascalCase (`Button`, `Modal`, `TimelineVirtualized`); utilities and stores stay camelCase.
- Honor `.editorconfig`: LF endings, trimmed whitespace, final newlines.

## Testing Guidelines

- Vitest powers unit, integration, visual, and accessibility suites under `packages/*/tests`; run `pnpm test` or scoped commands such as `pnpm test:unit`, `pnpm test:a11y`, and `pnpm test:visual`.
- Maintain the repo coverage thresholds (see `pnpm test:coverage:report` and `scripts/aggregate-coverage.js`).
- Prefer fixtures from `packages/testing` and adapters in `packages/adapters` for realistic GraphQL and transport scenarios.

## Commit & Pull Request Guidelines

- Follow Conventional Commits and sign every commit (`git commit -s "feat: add component"`).
- Changesets are optional; only add one when you explicitly want a changeset entry.
- Pull requests should link issues, call out UI impacts (screenshots or GIFs), and confirm `pnpm lint`, `pnpm typecheck`, and relevant tests.

## Environment & Tooling Notes

- Husky with lint-staged formats staged files and runs lightweight checks; fix failures locally before retrying the commit.
- Use `pnpm --filter @equaltoai/greater-components-social dev` (or similar) to iterate without rebuilding the entire monorepo.
- Secrets and API credentials must stay local; adapters expect runtime configuration instead of hard-coded values.
