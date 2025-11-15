# Playwright Failure Inventory

Compiled from local runs on the latest `main` (see commands below). Use this as a punch list for stabilizing the Demo/E2E and Accessibility workflows.

## Data sources

- `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo` (SSR mode)
- `CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium`
- Focused repro commands (tabs + timeline specs) to capture detailed traces
- `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo:csr` (for comparison – passes)

The CSR Playwright suite currently passes in both Chromium and Firefox, so the issues below only affect the default SSR-powered dev server (and therefore both the `test:demo` and a11y workflows, which hit the same server).

## Outstanding issues

None – demo and a11y suites now hydrate cleanly after the timeline fix documented below.

## Accessibility suite status

- Base verification (Chromium, SSR dev server):  
  `CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium`
- Theme/density matrix spot checks (matching `.github/workflows/a11y.yml`):  
  `TEST_THEME=dark TEST_DENSITY=compact CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium --output=test-results/a11y-dark-compact`  
  `TEST_THEME=high-contrast TEST_DENSITY=comfortable CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium --output=test-results/a11y-high-contrast-comfortable`
- `TEST_THEME` / `TEST_DENSITY` now flow through `apps/playground/src/routes/+layout.server.ts` → `+layout.svelte`, which seeds `gr-preferences-v1` and forces the requested tokens/density before hydration. Playwright’s env matrix therefore exercises dark/compact and high-contrast/comfortable permutations exactly as the GitHub workflow does.
- `packages/testing/tests/demo/a11yReporter.ts` hooks every demo spec so `axe-results.json` files land in the run’s `test-results/*` folders (14 per run). The current snapshots flag a single moderate `heading-order` violation coming from the ThemeSwitcher’s `h3` hierarchy, so expect the HTML reports to show that component until we adjust the heading levels.
- Report generation (HTML artifacts saved under `packages/testing/reports/`):  
  `pnpm --filter @equaltoai/greater-components-testing exec node scripts/generate-a11y-report.js --theme=dark --density=compact --input=test-results/a11y-dark-compact --output=reports/a11y-report-dark-compact.html`  
  `pnpm --filter @equaltoai/greater-components-testing exec node scripts/generate-a11y-report.js --theme=high-contrast --density=comfortable --input=test-results/a11y-high-contrast-comfortable --output=reports/a11y-report-high-contrast-comfortable.html`

## Passing reference

- `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo:csr` – 28/28 tests green in Chromium + Firefox, confirming the regressions are isolated to SSR-powered runs.

## Resolved issues

### Timeline demo – filter + density preview hydration (Chromium, SSR)

- **Spec:** `packages/testing/tests/demo/timeline.spec.ts:8-20`
- **Root cause:** Playwright clicked the “Local” filter before the playground layout finished hydrating, so the click handler never ran and `timelineState.viewDescription` stayed on the SSR snapshot (“People you follow…”). Once hydration completed, the UI looked interactive but the missed click meant the heading never updated.
- **Fix:** Mirror the tabs spec by waiting for `body[data-playground-hydrated="true"]` in the timeline Playwright `beforeEach`, ensuring interactions only begin once hydration finishes (matching real user experience).
- **Verification:** `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo`, `CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium`.

### Tabs demo – keyboard activation in SSR (Chromium)

- **Specs:** `packages/testing/tests/demo/tabs.spec.ts:8-34`
- **Root cause:** Playwright was interacting with the SSR-rendered demo before Svelte had a chance to finish hydrating. Specifically, the dev server needs a few hundred milliseconds after the HTML response to compile and ship the page modules, so early arrow/Enter key presses never reached the component’s handlers.
- **Fix:** Added a hydration sentinel in `apps/playground/src/routes/+layout.svelte` that flips `data-playground-hydrated="true"` on `<body>` once the layout mounts, then updated `packages/testing/tests/demo/tabs.spec.ts` to wait for that signal before dispatching keyboard events. This mirrors the real-world behavior (users only reach the tabs after hydration) and keeps SSR + CSR behavior aligned.
- **Verification:** `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo` now clears the tabs specs (the run still fails later on the known timeline issue) and `CI=1 pnpm --filter @equaltoai/greater-components-testing run test:demo:csr` remains fully green.
