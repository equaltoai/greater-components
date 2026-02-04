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
- `pnpm lint`, `pnpm format`, `pnpm typecheck`, and `pnpm changeset` should be clean before requesting review.

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
- Add a changeset whenever a publishable package changes; keep notes customer-facing.
- Pull requests should link issues, call out UI impacts (screenshots or GIFs), and confirm `pnpm lint`, `pnpm typecheck`, and relevant tests.

## Environment & Tooling Notes

- Husky with lint-staged formats staged files and runs lightweight checks; fix failures locally before retrying the commit.
- Use `pnpm --filter @equaltoai/greater-components-social dev` (or similar) to iterate without rebuilding the entire monorepo.
- Secrets and API credentials must stay local; adapters expect runtime configuration instead of hard-coded values.
