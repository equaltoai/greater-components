# Playwright (Greater Components)

<!-- AI Training: How to run Playwright for Greater Components in local + CI environments -->

Greater Components uses Playwright for:

- **E2E demo-suite tests** (SSR + CSR) against `apps/playground`
- **Accessibility (a11y) matrix tests** (themes × densities) in `packages/testing`
- **Visual regression tests** in `packages/testing` (currently disabled in CI, but runnable locally)

## Why there is no automatic Playwright install

This repo intentionally **does not auto-download browsers on `pnpm install`**.

Playwright browser downloads are:

- large,
- sometimes blocked by corporate networks,
- and not required for most work (build/typecheck/unit tests).

Install Playwright browsers only when you need Playwright suites.

## One-time setup

From the repo root:

```bash
pnpm install
```

Install Playwright browsers (one-time per machine):

```bash
pnpm playwright:install
```

On Linux CI, you may also need OS dependencies:

```bash
pnpm playwright:install:with-deps
```

Install only a specific browser (optional):

```bash
pnpm playwright:install -- chromium
pnpm playwright:install -- firefox
```

## Running suites (repo root)

### E2E (Playground demo suite)

Runs Playwright tests that start `@equaltoai/playground` and execute `packages/testing/tests/demo/*`.

```bash
pnpm test:e2e
```

Run only the testing package:

```bash
pnpm --filter @equaltoai/greater-components-testing test:e2e
```

Notes:

- The demo suite starts the playground dev server on `http://127.0.0.1:4173` (SSR by default).
- CSR mode can be forced with `PLAYGROUND_RUNTIME=csr` or `PLAYGROUND_CSR_ONLY=true`.

### Accessibility (themes × densities)

Runs the same matrix approach as CI (theme × density) via `packages/testing/scripts/run-a11y-matrix.js`.

```bash
pnpm test:a11y
```

Limit the matrix:

```bash
A11Y_THEMES=light,dark A11Y_DENSITIES=comfortable pnpm test:a11y
```

Pass through extra Playwright args (forwarded to `playwright test`):

```bash
pnpm test:a11y -- --headed
pnpm test:a11y -- --grep=keyboard
```

Outputs:

- JSON test results are written under `packages/testing/test-results/`.

### Local parity with CI a11y workflow

Runs a local “CI-like” sequence: build → Playwright install → a11y matrix → WCAG compliance check.

```bash
pnpm test:a11y:ci
```

If you’re on Linux and see missing dependency errors, run:

```bash
pnpm playwright:install:with-deps
```

### Visual regression (testing package)

Runs Playwright with `packages/testing/playwright.visual.config.ts` (serves the playground on `http://127.0.0.1:4174`).

```bash
pnpm test:visual
```

Run only a specific visual project:

```bash
pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.visual.config.ts --project=focus-states
pnpm --filter @equaltoai/greater-components-testing exec playwright test --config=playwright.visual.config.ts --project=high-contrast-visual
```

Reports:

- HTML reports are written under `packages/testing/playwright-report/`.

## How CI runs Playwright (reference)

See:

- `.github/workflows/e2e.yml` (demo-suite E2E)
- `.github/workflows/a11y.yml` (a11y matrix; visual regression currently disabled)

Typical CI order:

1. `pnpm install --frozen-lockfile`
2. `pnpm build` (for E2E/a11y flows)
3. `pnpm playwright:install:with-deps` (or package-scoped `pnpm exec playwright install --with-deps`)
4. Run the suite (`pnpm test:e2e` / `pnpm test:a11y`)

## Troubleshooting

### “Executable doesn’t exist” / missing browser

Run:

```bash
pnpm playwright:install
```

### Linux CI missing system dependencies

Run:

```bash
pnpm playwright:install:with-deps
```

### Port already in use

The test web servers use:

- `4173` for demo-suite tests
- `4174` for visual tests

Stop the conflicting process or change the port in the corresponding config:

- `packages/testing/playwright.demo.config.ts`
- `packages/testing/playwright.visual.config.ts`

