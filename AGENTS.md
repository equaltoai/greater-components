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

# Read tags from origin so stale local tags cannot outrank deleted releases.
LESSER_TAG="$(git -C ../lesser ls-remote --tags origin | sed 's#refs/tags/##' | awk '{print $2}' | sort -V | tail -n 1)"
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

## Critical: Sync Lesser Host Contracts + Regenerate Adapters

Greater’s soul adapters also depend on Lesser Host’s published **file-only contracts**.
Any time Lesser Host’s API surface changes, update the pinned artifacts in this repo and regenerate the derived client
before shipping changes.

Pinned Lesser Host snapshots live here:

- OpenAPI: `docs/lesser-host/contracts/openapi.yaml`
- SSE contract: `docs/lesser-host/contracts/soul-mint-conversation-sse.json`
- JSON Schema + fixtures: `docs/lesser-host/spec/v3/`
- Pin record: `docs/lesser-host/contracts/LESSER_HOST_REF.txt` (must include the Lesser Host tag + commit)

Update workflow (assumes `../lesser-host` exists as a sibling checkout; always run on Node 24):

```bash
cd /path/to/greater-components
nvm use  # should resolve to Node v24 per .nvmrc

# Read tags from origin so stale local tags cannot outrank deleted releases.
LESSER_HOST_TAG="$(git -C ../lesser-host ls-remote --tags origin | sed 's#refs/tags/##' | awk '{print $2}' | sort -V | tail -n 1)"
LESSER_HOST_COMMIT="$(git -C ../lesser-host rev-parse "${LESSER_HOST_TAG}")"

git -C ../lesser-host show "${LESSER_HOST_TAG}:docs/contracts/openapi.yaml" \
  > docs/lesser-host/contracts/openapi.yaml
git -C ../lesser-host show "${LESSER_HOST_TAG}:docs/contracts/soul-mint-conversation-sse.json" \
  > docs/lesser-host/contracts/soul-mint-conversation-sse.json
rsync -a --delete ../lesser-host/docs/spec/v3/ docs/lesser-host/spec/v3/

printf "tag: %s\ncommit: %s\n" "${LESSER_HOST_TAG}" "${LESSER_HOST_COMMIT}" \
  > docs/lesser-host/contracts/LESSER_HOST_REF.txt

corepack pnpm generate:openapi:lesser-host
corepack pnpm generate-registry

corepack pnpm --filter @equaltoai/greater-components-adapters typecheck
corepack pnpm --filter @equaltoai/greater-components-adapters test
```

Notes:

- Prefer pinning to a Lesser Host **release tag** (example: `v0.2.2`) over a moving branch ref.
- If the published Lesser Host OpenAPI references new companion files, vendor those alongside the OpenAPI snapshot so the pinned contract set stays self-consistent.

## Critical: Release Flow + CI Governance

Every Greater release is normally promoted through:

- `staging` → `premain` (rc) → `main` (stable)

When we explicitly need to bypass the RC lane, direct `staging` → `main` promotions are also allowed.

CI expectations:

- `staging` is where we run the full suite (lint/typecheck, unit tests, e2e, a11y).
- `premain` and `main` are promotion/release-only; PRs into these branches are guarded (`.github/workflows/premain-guard.yml`, `.github/workflows/main-guard.yml`) and should not require re-running the full staging suite.
- Changesets are optional (not required for PRs to `staging`); releases are automated via release-please on `premain`/`main`.
- Any branch targeting `staging` must also be promotion-safe: before shipping, rehearse the exact merge path `candidate -> staging`, `staging -> premain`, and `staging -> main`. If the RC lane remains in play for that train, also rehearse `premain -> main`. If any conflict appears in that chain, resolve it on the staging-targeted branch before merge so promotions stay clean.

### Package-enumeration parity (automated gates)

Adding a new top-level workspace package (parallel to `packages/primitives`, NOT nested under `packages/{shared,faces}/`) requires updating four enumeration sites in lockstep. Two audit scripts enforce this on every staging PR via `.github/workflows/lint.yml`:

- `scripts/audit-svelte-check-parity.mjs` — every Svelte-containing package must have `tsconfig.check.json` AND be enumerated in root `package.json` `scripts.check:svelte`.
- `scripts/audit-cli-package-enumeration-parity.mjs` — every top-level package must appear in all three CLI files: `transform.ts:CORE_PACKAGES`, `dependency-resolver.ts:CORE_PACKAGE_NAMES`, `fetch.ts:CORE_PACKAGE_NAMES`.

Both run locally via `pnpm validate:check-parity` (also chained into `pnpm validate:package`). They derive the canonical list from `packages/*/package.json` discovery. See Project 41 (#680) for the story: issue #674 (CLI install routing) shipped because three CLI sites had to update together and one was missed; issue #679 (CommandPalette type collision) shipped because the workspace `check:svelte` script wasn't covering `shell` / `host-platform`. The audits make both failure modes CI-visible.

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

## GitHub Provenance Guidance

- When handling GitHub issues, PRs, comments, reviews, branches, commits, PR creation, or check runs, use `.codex/skills/github-provenance` and prefer the routed `mcp__greater_lab__` GitHub tools whenever they cover the action.
- Fall back to the general GitHub plugin or `gh` only for capabilities the routed tools do not expose, such as diffs, inline review comments, unresolved threads, Actions logs, labels, search, approvals, or large local pushes. State the fallback reason when a GitHub write uses a non-routed path.
- Routed provenance does not relax Greater gates: preserve component API stability, pinned Lesser/Lesser Host contract sync, WCAG 2.1 AA accessibility, CLI registry integrity, theming token stability, Mastodon-compatible behavior where applicable, and AGPL/dependency discipline.

## Project MCP Trust Posture

- `.mcp.json` intentionally registers the `greater_lab` remote MCP server at
  `https://lab.theorymcp.ai/equaltoai/agents/greater/mcp`. The endpoint is
  first-party EqualToAI/TheoryMCP steward-routing infrastructure for this repo,
  not a general-purpose developer tool server.
- Ownership: `lab.theorymcp.ai` is operated as EqualToAI/TheoryMCP infrastructure
  for routed steward-agent sessions. The `greater_lab` route is scoped to the
  Greater steward identity and exposes managed tools such as memory, email,
  knowledge, and bounded GitHub operations.
- Prefer `mcp__greater_lab__` GitHub tools for supported GitHub work because they
  preserve routed-agent provenance, constrain writes to server-authorized repo
  surfaces, and keep memory/email/GitHub actions attributable to the Greater
  steward. Use fallback GitHub tooling only for capabilities the routed tools do
  not expose, and state the fallback reason.
- Trust assumptions: contributors and agents who enable the project MCP config
  trust DNS/TLS resolution for `lab.theorymcp.ai`, the TheoryMCP service's tool
  descriptions/resources/responses, and its server-side authorization policy for
  the Greater steward route. Enabling project MCP connects the IDE agent to an
  external server that controls tool behavior; never pass local secrets, tokens,
  private keys, seed phrases, or unrelated repository contents through MCP tools.
- Contributor consent: opening the repository does not by itself require using
  the endpoint, but enabling project MCP in a compatible client is an informed
  trust decision. Contributors who do not accept that remote-tool trust model
  should leave project MCP disabled and use ordinary local/GitHub workflows.
- Endpoint pinning / allowlist recommendation: keep any non-interactive client,
  proxy, firewall, or enterprise MCP policy pinned to the exact HTTPS origin and
  path above. Prefer certificate/SPKI pinning or an exact egress allowlist where
  the client/runtime supports it without interactive prompts. Do not add local
  approval gates that break non-interactive steward operation.

## Environment & Tooling Notes

- Husky with lint-staged formats staged files and runs lightweight checks; fix failures locally before retrying the commit.
- Use `pnpm --filter @equaltoai/greater-components-social dev` (or similar) to iterate without rebuilding the entire monorepo.
- Secrets and API credentials must stay local; adapters expect runtime configuration instead of hard-coded values.
