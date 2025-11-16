# Testing Coverage Improvement Plan

## Current Snapshot (from `pnpm test:coverage` + `pnpm test:coverage:report`)

- Overall: 17.3% lines / 20.7% functions / 14.0% branches (`coverage/combined-coverage.json`).
- Packages: adapters 56% lines, fediverse 1.1%, headless 80.5% (branches 71.3%), icons 0.7%, primitives 68% (branches 48%), testing 0% (no instrumented source), tokens 70.5% (functions 44.4%), utils 34.9%. No reports for `cli` or `greater-components`.

## Key Gaps (actionable targets)

- **Fediverse (`packages/fediverse`)**: Core adapters and data utilities are untested (e.g., request batching/cache/optimistic layers at `packages/fediverse/src/adapters/batcher.ts:1`, `cache.ts:1`, `optimistic.ts:1`).
- **Icons (`packages/icons`)**: Svelte icon components have no runtime/SSR coverage (e.g., `packages/icons/src/icons/airplay.svelte:1` and peers).
- **Utils (`packages/utils`)**: Keyboard shortcut manager and performance helpers lack tests (`src/keyboardShortcuts.ts:1`, `src/performance.ts:1`), leaving time-based/edge behaviours unverified.
- **Tokens (`packages/tokens/src/index.ts:1`)**: Auto-generated token surface has no contract/snapshot guard; API regressions would slip through.
- **Primitives (`packages/primitives`)**: Interaction-heavy components have mid coverage with weak branches (e.g., ThemeSwitcher preferences flow at `src/components/ThemeSwitcher.svelte:1`, Avatar upload slots at `Avatar.svelte:1`, menu/tab/tooltip keyboard paths).
- **Headless (`packages/headless`)**: Utility branches uncovered (`src/utils/keyboard.ts:1`, `src/utils/id.ts:1`); menu/tooltip orientation variants missing assertions.
- **Adapters GraphQL mapping**: Only happy-path conversion covered (`packages/adapters/src/mappers/lesser/graphqlConverters.ts:1`); error/optional fields and date handling are largely untested.
- **CLI & package entrypoints**: No smoke coverage ensuring binaries/export maps stay intact.

## Plan to Raise Coverage

1. **Stabilize the baseline and reporting**
   - Keep generating reports with `pnpm test:coverage && pnpm test:coverage:report`; publish `coverage/index.html` artifact in CI.
   - Temporarily gate PRs at the package level with a ratcheting floor (start at current +10%, climb toward 90%) rather than the existing global 90% threshold.

2. **Wave 1 – Zero/low coverage packages (fast wins)**
   - **Utils**: Add Vitest timer-driven specs for debounce/throttle/rafThrottle/memoize/lazy/LRU cache (`packages/utils/src/performance.ts:1`) and keyboard shortcut manager (`src/keyboardShortcuts.ts:1`) using fake timers and DOM stubs.
   - **Icons**: Parameterized render test that SSR-renders every export from `packages/icons/src/icons` and validates `aria-hidden`/`role` plus snapshot of generated SVG to guard build tooling.
   - **Tokens**: Snapshot the exported `tokens` shape and a few semantic assertions (color palette keys, typography scales) to catch regeneration drift.
   - **CLI & root package**: Add smoke tests that the CLI binary invokes with `--help` and that the aggregated package re-exports the expected entrypoints.

3. **Wave 2 – Core data paths**
   - **Fediverse adapters**: Unit-test RequestBatcher (`adapters/batcher.ts:1`) for max batch size, timeout flush, error propagation, and stats; add cache/resolver tests for optimistic updates (`adapters/optimistic.ts:1`) and cache invalidation (`adapters/cache.ts:1`). Use `packages/testing` fixtures/mocks where possible.
   - **GraphQL converters**: Extend coverage for malformed payloads, date coercion, and optional fields in `graphqlConverters.ts:1` with table-driven cases matching schema fragments.

4. **Wave 3 – Interaction-heavy UI**
   - **Primitives**: Strengthen branch coverage for ThemeSwitcher state sync (`ThemeSwitcher.svelte:1`), menu/tabs/tooltip keyboard navigation and focus management, avatar/file upload happy/error paths, and density/motion toggles. Use Svelte Testing Library with `@equaltoai/testing` helpers for accessible queries.
   - **Headless**: Add pure unit specs for keyboard utilities (`utils/keyboard.ts:1`) and id generator; broaden menu/tooltip/radios to cover horizontal vs vertical navigation, escape/blur handling, and disabled items.

5. **Maintenance & automation**
   - Wire coverage to CI with per-package job sharding to keep runtimes down; fail the pipeline on any package regression below its ratchet.
   - Document recipes in `CONTRIBUTING` and add a short “writing tests” section per package (fixtures, mocks, render helpers).
   - Schedule weekly coverage report generation and trend logging from `coverage/combined-coverage.json` to track progress.

## Expected Milestones

- **Week 1**: Land Wave 1 suites (utils/icons/tokens/CLI) and raise overall lines to ~40%.
- **Week 2**: Fediverse adapters + GraphQL converters reach ≥60% package coverage; unblock downstream consumers.
- **Week 3**: Primitives/headless interaction coverage pushes branch metrics past 70% and re-enable the 90% global gate.
