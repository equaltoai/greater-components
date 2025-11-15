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
- `packages/testing/tests/demo/a11yReporter.ts` hooks every demo spec so `axe-results.json` files land in the run’s `test-results/*` folders (14 per run). The previous ThemeSwitcher `heading-order` warning is gone after promoting the sidebar “Adaptive themes” label to an `<h2>` in `apps/playground/src/routes/+layout.svelte`; verified with `TEST_THEME=dark TEST_DENSITY=compact CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium`.
- Report generation (HTML artifacts saved under `packages/testing/reports/`):  
  `pnpm --filter @equaltoai/greater-components-testing exec node scripts/generate-a11y-report.js --theme=dark --density=compact --input=test-results/a11y-dark-compact --output=reports/a11y-report-dark-compact.html`  
  `pnpm --filter @equaltoai/greater-components-testing exec node scripts/generate-a11y-report.js --theme=high-contrast --density=comfortable --input=test-results/a11y-high-contrast-comfortable --output=reports/a11y-report-high-contrast-comfortable.html`

### A11y workflow coverage map

- Axe sweep: `pnpm exec playwright test --config=playwright.a11y.config.ts --project=chromium` now traverses both `packages/testing/tests/demo/**/*.spec.ts` and the new `tests/a11y/*.spec.ts`, so every interaction (tabs, timeline, ThemeSwitcher drills) produces axe JSON via `tests/demo/a11yReporter.ts`.
- Keyboard step: `.github/workflows/a11y.yml` leaves `--grep="keyboard"` intact; it targets `packages/testing/tests/demo/profile.spec.ts:12` (`tabs support keyboard navigation`) so CI keeps exercising arrow-key nav without duplicating specs.
- Focus step: routed directly to `packages/testing/tests/a11y/focus.spec.ts`, which reuses `/tabs` to assert roving tabindex, manual activation, and disabled-tab skips under `test.describe('focus', ...)` (still calls `applyA11yReporter` for axe metadata).
- Contrast step: routed directly to `packages/testing/tests/a11y/contrast.spec.ts`, which hits `/settings` to check ThemeSwitcher headings, forced high-contrast mode, and density propagation to the preview grid with `test.describe('contrast', ...)` and the shared reporter.

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

### E2E workflow – CSR project rename fallout

- **Spec:** `.github/workflows/e2e.yml` CSR job (`playwright.demo.csr.config.ts`)
- **Root cause:** The CSR-focused config now defines `csr-chromium` / `csr-firefox` projects, but the workflow still invoked `--project=chromium` / `--project=firefox`, so the CSR step failed before uploading artifacts.
- **Fix:** Updated the CSR command to use `--project=csr-${{ matrix.browser }}` and pointed the artifact uploads at `packages/testing/playwright-report/` and `packages/testing/test-results/`, which contain both SSR (`demo/`) and CSR (`demo-csr/`) assets.
- **Verification:** `CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.demo.csr.config.ts --project=csr-chromium` and the analogous `csr-firefox` run both pass locally; CI will now find the correct projects and publish the reports again.

### A11y workflow – focus coverage via primitives demo

- **Spec:** `.github/workflows/a11y.yml` focus job + `packages/testing/tests/demo/focus.spec.ts`
- **Root cause:** The workflow filtered on `"focus"` without any tagged specs, so the job failed with “No tests found.”
- **Fix:** Added `focus.spec.ts`, which exercises the primitives menu (roving tabindex, Escape returning focus) and the modal (initial focus, Tab/Shift+Tab trap, Escape restoring the trigger). With those tests in place, the workflow runs the `--grep="focus"` step unconditionally again.
- **Verification:** `TEST_THEME=light TEST_DENSITY=comfortable CI=1 pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.a11y.config.ts --project=chromium --grep="focus"` passes locally and produces the expected axe payloads.
