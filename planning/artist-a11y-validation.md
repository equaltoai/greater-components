# Artist Face Accessibility Validation Plan (Parity With Social)

## Objective

Extend the existing Playwright + Axe accessibility pipeline (`pnpm test:a11y` and `pnpm test:a11y:ci`) so it validates **Artist Face** pages/components with the same rigor as **Social Face**.

“Parity with Social” here means:

- Artist routes are exercised by Playwright demo tests (like `Profile`, `Timeline`, `Search`, `Tabs`, etc. are for Social).
- Every demo test automatically runs Axe (via `applyA11yReporter`) across the **theme × density matrix**.
- We include explicit **keyboard** and **focus management** validations for Artist’s high-risk interactive surfaces (e.g., MediaViewer).
- The CI compliance gate (`check-a11y-compliance.js`) includes Artist results and fails on critical/serious violations.

## Current Pipeline (How Social Gets Covered Today)

**Entry points**

- Root scripts:
  - `pnpm test:a11y` → `pnpm --filter @equaltoai/greater-components-testing run test:a11y`
  - `pnpm test:a11y:ci` → `scripts/run-a11y-ci.js`
- Matrix runner: `packages/testing/scripts/run-a11y-matrix.js`
  - Runs Playwright across `TEST_THEME` × `TEST_DENSITY`
  - Runs four jobs per matrix cell:
    1. “Axe accessibility tests” (all demo + a11y tests)
    2. “keyboard” tests (`--grep=keyboard`)
    3. focus management tests (`tests/a11y/focus.a11y.test.ts`)
    4. contrast tests (`tests/a11y/contrast.a11y.test.ts`)
- Playwright config: `packages/testing/playwright.a11y.config.ts`
  - Spins up the SvelteKit playground (`pnpm --filter @equaltoai/playground dev …`)
  - Executes tests under `packages/testing/tests/**/(demo|a11y)/**`
- Axe runner hook: `packages/testing/tests/demo/a11yReporter.ts`
  - `applyA11yReporter(test)` runs `runAxeTest(page)` after each test and writes results.

**What’s missing for Artist**

- There are no Playwright demo tests that visit Artist routes.
- The playground shell imports Social styles but not Artist styles.
- The playground only has a subset of Artist routes (`/artist`, `/artist/artwork`, `/artist/gallery`), while the Artist index links to additional routes that don’t exist.

## Plan Overview

1. Make the playground “Artist-ready” (styles, navigation, stable fixtures).
2. Build/finish Artist demo routes to represent the main Artist surfaces.
3. Add Playwright demo tests for those routes using `applyA11yReporter` (Axe runs automatically).
4. Add explicit keyboard + focus tests (and optionally extend contrast/focus suites) for Artist-specific behaviors.
5. Wire maintainability: fast local iteration commands, and a “no new uncovered demo route” checklist.

## Phase 0 — Baseline & Gaps (0.5 day)

- Verify current a11y runs do not include Artist:
  - Run a single-cell matrix locally to keep it fast:
    - `A11Y_THEMES=light A11Y_DENSITIES=comfortable pnpm test:a11y`
  - Confirm there are no test cases visiting `/artist*` in `packages/testing/tests/demo`.
- Confirm the playground has partial Artist pages:
  - `apps/playground/src/routes/artist/+page.svelte`
  - `apps/playground/src/routes/artist/artwork/+page.svelte`
  - `apps/playground/src/routes/artist/gallery/+page.svelte`

Deliverable: a short “current coverage map” (which routes are tested, which are not).

## Phase 1 — Make Playground Include Artist Face Properly (0.5–1 day)

**Goal:** Artist pages are styled and stable under the test matrix (theme/density).

- Add Artist package dependency to the playground:
  - `apps/playground/package.json` → add `@equaltoai/greater-components-artist: "workspace:*"`
- Load Artist theme/styles globally in the playground shell:
  - `apps/playground/src/routes/+layout.svelte` → add `import '@equaltoai/greater-components-artist/theme.css';`
- Add navigation entry so the route is discoverable (optional but aligns with Social):
  - `apps/playground/src/routes/+layout.svelte` → add `{ href: '/artist', label: 'Artist Face', icon: … }`
- Replace external image URLs with local fixtures where possible to reduce flakiness:
  - Add images under `apps/playground/static/images/artist/*`
  - Update Artist demo pages to use local `src="/images/artist/…"` assets.

Acceptance: `pnpm --filter @equaltoai/playground dev` loads `/artist/artwork` without missing CSS/import errors.

## Phase 2 — Complete Artist Demo Routes (1–3 days)

**Goal:** Artist Face has a small set of “demo surfaces” comparable to Social’s `/profile`, `/timeline`, `/search`, etc.

Create these SvelteKit routes in `apps/playground/src/routes/artist/*` (all should render with realistic data and include at least one interactive branch):

| Route                       | Components Exercised                                         | Key a11y behaviors to surface                                  |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `/artist/artwork` (already) | `Artwork`, `ArtworkCard`, `MediaViewer`                      | Modal/dialog semantics, focus trap, keyboard close, alt text   |
| `/artist/gallery` (already) | `GalleryGrid`, `GalleryRow`, `GalleryMasonry`                | Grid semantics, keyboard navigation, scroll container behavior |
| `/artist/profile`           | `ArtistProfile.*`, `PortfolioSection`                        | Editing controls, toggles, drag/drop reorder semantics         |
| `/artist/discovery`         | `DiscoveryEngine.*`                                          | Search input labeling, filters, results list semantics         |
| `/artist/creative-tools`    | `WorkInProgress.*`, `CritiqueMode.*`, `CommissionWorkflow.*` | Focus regions, keyboard shortcuts, dialogs/panels              |
| `/artist/community`         | `CritiqueCircle.*`, `Collaboration.*`, `MentorMatch`         | Role-based controls, list semantics, status changes            |
| `/artist/transparency`      | `Transparency.*`                                             | Expand/collapse, keyboard toggles, progress/labels             |
| `/artist/monetization`      | `Monetization.*`                                             | Radio groups, stepper controls, form validation, dialogs       |

Implementation notes:

- Put shared demo data in `apps/playground/src/lib/data/artist.ts` (like `lib/data/fediverse.ts` for Social), and reuse across pages.
- Ensure every interactive control has:
  - a visible label or `aria-label`,
  - deterministic focus order,
  - no “click only” behavior (support Enter/Space where appropriate).

Acceptance: all listed routes render (SSR) and show their primary interactive surfaces without runtime console errors.

## Phase 3 — Add Playwright Demo Tests for Artist (1–2 days)

**Goal:** Include Artist routes in the existing matrix, so Axe runs on them automatically.

Add Playwright tests under `packages/testing/tests/demo/`:

- `packages/testing/tests/demo/artist.spec.ts` (recommended) with 1–2 tests per page.
- Ensure each file calls:
  - `applyA11yReporter(test);`
- Ensure tests wait for playground hydration (consistent with other specs):
  - `await page.waitForSelector('body[data-playground-hydrated=\"true\"]');`

Minimum test set (parity baseline):

- `/artist/artwork`:
  - “keyboard: media viewer opens and closes with Escape” (must include word `keyboard` in title for the keyboard matrix job).
  - “media viewer traps focus and restores focus on close” (focus management coverage).
- `/artist/gallery`:
  - “keyboard: gallery cards reachable via Tab and activate with Enter”.
- `/artist/discovery`:
  - “keyboard: search input + filter chips usable via keyboard”.
- `/artist/profile`:
  - “profile actions expose accessible names and edit panel is reachable via keyboard”.

Acceptance: `A11Y_THEMES=light A11Y_DENSITIES=comfortable pnpm test:a11y -- --grep=Artist` runs and produces `axe-results.json` for Artist tests.

## Phase 4 — Extend Focus/Contrast Suites for Artist-Specific Risk Areas (0.5–1 day)

**Focus**

Artist has modal/overlay-heavy UI (MediaViewer, inquiry modals, etc.). Add explicit focus trap tests either by:

- Option A (lowest overhead): extend `packages/testing/tests/a11y/focus.a11y.test.ts` with an “Artist focus” describe that visits `/artist/artwork` and validates the MediaViewer trap + restore.
- Option B: create `packages/testing/tests/a11y/artist-focus.a11y.test.ts` and update `packages/testing/scripts/run-a11y-matrix.js` to run both focus files in the focus job.

**Contrast**

Add at least one contrast-specific assertion for Artist pages in high-contrast mode:

- Validate key headings remain properly structured (sequential levels).
- Validate controls maintain visible focus indicators (this is partially covered by Axe; explicit assertions catch regressions).

Acceptance: focus/contrast jobs in `pnpm test:a11y` include at least one Artist assertion and remain stable.

## Phase 5 — CI Gate & Reporting (0.5 day)

- Ensure `pnpm test:a11y:ci` includes Artist by virtue of:
  - new playground routes,
  - new `packages/testing/tests/demo/artist.spec.ts`.
- Keep CI runtime reasonable:
  - Prefer 6–10 total Artist Playwright tests initially.
  - Expand breadth by adding routes first, then deepen with additional scenarios.
- (Optional) Enhance reporting:
  - Add `@artist` tags in test titles so reports can be filtered easily.
  - Wrap demo sections with `data-component="Artist/…"`, if you want compliance reporting grouped per component.

Acceptance: `pnpm test:a11y:ci` fails on critical/serious violations across Artist pages the same way it does for Social.

## Fast Local Iteration Commands

Run only one theme/density and only Artist tests:

```bash
A11Y_THEMES=light A11Y_DENSITIES=comfortable pnpm test:a11y -- --grep=Artist
```

Run the Playwright suite directly:

```bash
pnpm --filter @equaltoai/greater-components-testing exec playwright test \\
  --config=playwright.a11y.config.ts \\
  --project=chromium \\
  --grep=Artist
```

## Done-When Checklist

- Artist styles load in the playground (`@equaltoai/greater-components-artist/theme.css` included).
- All Artist routes listed in Phase 2 exist and render deterministically.
- `packages/testing/tests/demo/artist.spec.ts` covers the routes and includes keyboard/focus interactions.
- `pnpm test:a11y` and `pnpm test:a11y:ci` both execute Artist tests and enforce compliance.
