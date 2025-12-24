# Accessibility Remediation Plan (WCAG 2.1 AA)

This document turns the current `pnpm test:a11y:ci` outputs into an actionable, prioritized remediation plan.

## Baseline (from local `packages/testing/test-results/**/axe-results.json`)

Scanned Axe outputs: **409** (`axe-results.json`)

Violations: **339**

- Critical: **81**
- Serious: **123**
- Moderate: **90**
- Minor: **45**

All violations in this baseline are coming from Artist playground routes:

- `/artist/gallery` (highest volume)
- `/artist/discovery`
- `/artist/profile`
- `/artist/artwork`

There are only **10 unique Axe rule IDs** to resolve in this snapshot, so the fastest path to compliance is to fix each rule at the source component(s), not per-test.

## How to iterate locally

Run one matrix cell and only Artist tests:

```bash
A11Y_THEMES=light A11Y_DENSITIES=comfortable pnpm test:a11y -- --grep=Artist
```

When critical/serious are cleared, confirm the CI parity workflow:

```bash
pnpm test:a11y:ci
```

## Priority order (to pass the CI compliance gate first)

The CI compliance gate fails on **critical** and **serious** by default (`scripts/run-a11y-ci.js` → `packages/testing/scripts/check-a11y-compliance.js`).

### P0 — Critical and Serious

1. **`aria-required-children` (critical, 45) — `GalleryGrid` container semantics**
   - Symptom: `.gallery-grid` fails required owned elements.
   - Likely source: `packages/faces/artist/src/components/Gallery/Grid.svelte:267` (`role="feed"` + deep nesting).
   - Fix strategy:
     - Prefer a simpler semantic model:
       - Remove `role="feed"` if not strictly needed; use `role="region"` + `aria-label` for the scroll container.
       - If keeping `role="feed"`, ensure required owned elements are present in the accessibility tree (not “too nested”).
     - Remove `tabindex="0"` on non-interactive containers if it’s only used to catch key events; key events bubble from focused children.

2. **`nested-interactive` (serious, 45) — nested `<button>` in gallery layouts**
   - Symptom: Interactive controls nested (e.g. `<button>` inside `<button>`).
   - Likely sources:
     - `packages/faces/artist/src/components/Gallery/Row.svelte:226`
     - `packages/faces/artist/src/components/Gallery/Masonry.svelte:205`
   - Root cause: `ArtworkCard` renders a `<button>`, and the layout components wrap it in another `<button>`.
   - Fix strategy:
     - Make only one interactive surface:
       - Remove the wrapper `<button>` and let `ArtworkCard` handle click/keyboard, or
       - Add a non-button rendering mode for `ArtworkCard` (e.g. render as `<div>`/`<a>` while preserving accessible name + focus styles), and keep the wrapper button.

3. **`aria-valid-attr-value` (critical, 18) — invalid ARIA reference/value on discovery search input**
   - Symptom: `.search-bar__input` fails ARIA attribute value validation.
   - Likely source: `packages/faces/artist/src/components/Discovery/SearchBar.svelte:265`.
   - Fix strategy:
     - Ensure any `aria-controls="…"` references an element that always exists (even if empty/hidden), or only set the attribute when the controlled element is present.
     - Align to a standard combobox/listbox pattern:
       - Consider setting `aria-expanded`, and ensure the listbox is in the DOM with the referenced `id`.

4. **`label` (critical, 18) — file input missing accessible label**
   - Symptom: file input in color palette extraction has no label.
   - Likely source: `packages/faces/artist/src/components/Discovery/ColorPaletteSearch.svelte:190`.
   - Fix strategy:
     - Add `aria-label="…"` or connect `<label for="…">` to an `id`, even if visually hidden.

5. **`color-contrast` (serious, 78) — contrast failures across Artist pages**
   - Symptom: multiple color pairs fail AA contrast (e.g. muted text, skip links).
   - Likely sources (examples from the snapshot):
     - `packages/faces/artist/src/components/Artwork/Metadata.svelte` (muted `dt`)
     - `packages/faces/artist/src/components/Artwork/Stats.svelte` (muted text + opacity)
     - `packages/faces/artist/src/components/Artwork/Attribution.svelte` (muted username)
     - `packages/faces/artist/src/components/Discovery/ColorPaletteSearch.svelte` (tolerance hints)
     - Skip links in:
       - `packages/faces/artist/src/components/Discovery/Root.svelte`
       - `packages/faces/artist/src/components/ArtistProfile/Root.svelte`
   - Fix strategy:
     - Define and use Artist-specific “adaptive” tokens (currently referenced but not defined in `packages/faces/artist/src/theme.css`):
       - `--gr-artist-adaptive-text`
       - `--gr-artist-adaptive-muted`
     - Avoid relying on low opacity for “subtle” text if it drops below contrast requirements.
     - Adjust skip-link background to a darker blue (or use dark text) so the link meets AA.

Acceptance for P0: `pnpm test:a11y:ci` passes the compliance gate (`--fail-on-violations=critical,serious`).

### P1 — Moderate and Minor (complete AA hygiene + reduce regressions)

6. **Landmark issues (moderate, 18 each) — nested/duplicate mains**
   - `landmark-main-is-top-level`
   - `landmark-no-duplicate-main`
   - `landmark-unique`
   - Likely source: `packages/faces/artist/src/components/ArtistProfile/Root.svelte:145` (`role="main"` inside a page that already has a `<main>`).
   - Fix strategy:
     - Remove `role="main"` from the component (prefer `role="region"` + label), or ensure it’s only applied at the actual page root.

7. **`landmark-complementary-is-top-level` (moderate, 18) — discovery sidebar landmark nesting**
   - Likely source: `apps/playground/src/routes/artist/discovery/+page.svelte:44` (`<aside class="discovery-sidebar">…`).
   - Fix strategy:
     - Ensure the complementary landmark isn’t nested in a way Axe flags (e.g. within another landmark/region); adjust the demo layout if needed.

8. **`heading-order` (moderate, 18) — empty results heading level**
   - Likely source: `packages/faces/artist/src/components/Discovery/Results.svelte:162` (uses `<h3>` without a preceding `<h2>` in that region).
   - Fix strategy:
     - Ensure the results region has an `h2` (or adjust the empty state heading level) so heading structure remains sequential.

9. **`focus-order-semantics` (minor, 45) — focusable non-interactive container**
   - Likely source: `packages/faces/artist/src/components/Gallery/Grid.svelte:267` (`tabindex="0"` on the scroll container).
   - Fix strategy:
     - Prefer focus on real interactive elements (the cards) and capture keyboard events via bubbling.

Acceptance for P1: `pnpm test:a11y:ci` passes with **0** moderate/minor Axe violations for Artist routes (or a documented exception list with justification).

## Execution checklist

- Create one GitHub issue per rule ID using `.github/ISSUE_TEMPLATE/accessibility_issue.yml`.
- Fix issues in source components first (Artist packages), then adjust the playground demos only if the demo layout is the cause.
- After each rule fix:
  - Run `A11Y_THEMES=light A11Y_DENSITIES=comfortable pnpm test:a11y -- --grep=Artist`
  - Confirm the rule’s count goes to zero across Artist routes.
- When all P0 items are resolved:
  - Run `pnpm test:a11y:ci` to confirm CI parity.
