# Lint Remediation Plan

This plan captures the outstanding ESLint findings across the repository and breaks the remediation work into focused phases. Phases may be tackled in any order; each closes out a discrete cluster of issues. All commands assume execution from `/home/aron/ai-workspace/codebases/greater-components`.

## Phase A – Docs Application Cleanup

- **Scope**: `apps/docs/src/**/*`
- **Primary Rules**: `svelte/require-each-key`, `svelte/valid-compile` (unused selectors), `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, `svelte/no-at-html-tags`
- **Priority Files**:
  - `apps/docs/src/lib/components/AccessibilityScorecard.svelte`
  - `apps/docs/src/lib/components/ComponentDoc.svelte`
  - `apps/docs/src/lib/components/SearchModal.svelte`
  - `apps/docs/src/routes/components/[slug]/+page.svelte`
- **Tasks**:
  1. Add `{#each}` keys to every Svelte loop.
  2. Remove or consolidate unused `.dark …` CSS selectors and redundant styles.
  3. Replace `any`/unused vars with accurate typing or `_`-prefixed placeholders.
  4. Audit `{@html}` usage; either justify with escaping or refactor.
- **Verification**: `pnpm exec eslint apps/docs --ext .svelte,.ts --max-warnings=0`

## Phase B – Playground Examples Hardening

- **Scope**: `apps/playground/src/**/*`
- **Primary Rules**: `svelte/require-each-key`, `no-console`, `@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-explicit-any`
- **Tasks**:
  1. Add keys to demo loops.
  2. Replace instructional `console.log` calls with in-UI logging or guard them behind environment checks.
  3. Remove unused demo variables; rename to `_foo` when kept for illustrative purposes.
  4. Replace broad `any` props with explicit demo interfaces.
- **Verification**: `pnpm exec eslint apps/playground --ext .svelte,.ts --max-warnings=0`

## Phase C – Fediverse Core Components

- **Scope**: `packages/fediverse/src/**/*`
- **Primary Rules**: `svelte/valid-compile` (unused selectors), `svelte/require-each-key`, `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, `svelte/no-at-html-tags`, `no-console`, `prefer-const`
- **Hotspots**: Component layouts and pattern libraries; story helpers with aggressive styling.
- **Tasks**:
  1. Trim unused selectors and migrate color-mode styles to shared tokens.
  2. Ensure every timeline/list/notification loop carries a deterministic key.
  3. Replace `any` pipes with shared TypeScript types introduced in Phase 2 work.
  4. Remove ad-hoc console statements; route through logger utilities if needed.
  5. Normalize `const` usage in stores/selectors.
- **Verification**: `pnpm exec eslint packages/fediverse/src --ext .svelte,.ts --max-warnings=0`

## Phase D – Fediverse Test Suite Hygiene

- **Scope**: `packages/fediverse/tests/**/*`
- **Primary Rules**: `@typescript-eslint/no-non-null-assertion`, `@typescript-eslint/no-unused-vars`, `prefer-const`, `@typescript-eslint/no-explicit-any`
- **Tasks**:
  1. Replace `!` assertions with helper guards (e.g., `expect(value).toBeDefined()`).
  2. Drop unused mocks or mark intentionally unused with `_`.
  3. Convert mutable `let` fixtures to `const` where possible.
  4. Add narrow generics instead of `any` in shared test builders.
- **Verification**: `pnpm exec eslint packages/fediverse/tests --ext .ts --max-warnings=0`

## Phase E – Adapters Streaming & Transport

- **Scope**: `packages/adapters/src/**/*`
- **Primary Rules**: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-non-null-assertion`, `no-console`
- **Tasks**:
  1. Type transport payloads (`WebSocketClient`, `SseClient`, `HttpPollingClient`, `TransportManager`).
  2. Replace non-null assertions with guards or early returns.
  3. Swap `console.log`/`console.debug` with structured logger hooks or wrap behind `if (process.env.NODE_ENV !== 'production')`.
- **Verification**: `pnpm exec eslint packages/adapters/src --ext .ts --max-warnings=0`

## Phase F – Adapters Tests Modernization

- **Scope**: `packages/adapters/tests/**/*`
- **Primary Rules**: `@typescript-eslint/ban-ts-comment`, `@typescript-eslint/no-non-null-assertion`, `@typescript-eslint/no-unused-vars`
- **Tasks**:
  1. Replace each `@ts-ignore` with `@ts-expect-error` accompanied by an explanation, or remove once typings are fixed.
  2. Eliminate `!` assertions in test helpers.
  3. Prefix intentionally unused fixtures with `_`.
- **Verification**: `pnpm exec eslint packages/adapters/tests --ext .ts --max-warnings=0`

## Phase G – Primitives Component Stories

- **Scope**: `packages/primitives/src/**/*`
- **Primary Rules**: `svelte/valid-compile`, `svelte/require-each-key`, `no-case-declarations`
- **Tasks**:
  1. Remove unused style selectors and ensure each story block has a key.
  2. Refactor switch statements to wrap `case`-scoped variables in braces.
- **Verification**: `pnpm exec eslint packages/primitives/src --ext .svelte,.ts --max-warnings=0`

## Phase H – Shared Utilities & Testing Helpers

- **Scope**:
  - `packages/testing/src/vitest/render-helpers.ts`
  - `packages/testing/tests/examples/**/*.ts`
  - `packages/utils/src/performance.ts`
- **Primary Rules**: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-non-null-assertion`, `no-console`, `@typescript-eslint/no-unused-vars`
- **Tasks**:
  1. Introduce proper generics for render helpers and performance instrumentation.
  2. Guard `document`/`window` accesses instead of relying on non-null assertions.
  3. Remove example utilities that are no longer imported, or document intentional unused exports.
  4. Replace console statements with warnings/errors or structured logging.
- **Verification**:
  - `pnpm exec eslint packages/testing/src --ext .ts --max-warnings=0`
  - `pnpm exec eslint packages/testing/tests --ext .ts --max-warnings=0`
  - `pnpm exec eslint packages/utils/src --ext .ts --max-warnings=0`

## Phase I – Icons & Storybook Fixtures

- **Scope**: `packages/icons/tests/**/*`
- **Primary Rules**: `svelte/valid-compile`
- **Tasks**:
  1. Update icon story templates to satisfy Svelte compile expectations (remove unused selectors, ensure components mount cleanly).
- **Verification**: `pnpm exec eslint packages/icons/tests --ext .svelte,.ts --max-warnings=0`

## Phase J – Final Integration Pass

- **Scope**: Whole repo
- **Tasks**:
  1. Run `pnpm lint` and confirm zero errors/warnings.
  2. Document completion in `docs/planning/greater-alignment-log.md` with a dated entry.
  3. Capture a diff summary covering major refactors (transport typing, Svelte cleanup).
  4. Call out any justified rule suppressions for posterity.

## Reference Artifacts

- **Lint Reports**:
  - `/tmp/docs-lint.json` – detailed findings for `apps/docs`.
  - `/tmp/adapter-lint.json` – focused results for `packages/adapters`.
  - `/tmp/repo-lint.json` plus `/tmp/repo-lint-relative.json` – full-repo summary with relative paths.
- Regenerate these reports after each phase to track remediation progress.
