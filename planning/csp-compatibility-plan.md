# Greater Components — Strict CSP Compatibility Plan

## Problem Statement

Lesser deployments use a strict CloudFront Content Security Policy (CSP):

- `script-src` does **not** include `'unsafe-inline'`
- `style-src` does **not** include `'unsafe-inline'` (and no `style-src 'unsafe-hashes'`)

Implications:

- Any inline `<script>…</script>` is blocked unless its hash is in the CSP.
- Any `style="…"` attribute is blocked (style hashes do not apply to `style=` attributes without `unsafe-hashes`).

This is primarily a **Greater Components** issue because multiple primitives emit `style=` attributes in common usage.

## What CSP Console Errors Usually Mean

- Inline scripts are usually app/framework output (e.g., SvelteKit bootstrap) rather than Greater Components.
- Inline styles are the primary Greater Components blocker because `style="…"` and `style={…}` in templates violate strict
  CSP in all cases without `unsafe-inline`/`unsafe-hashes`.

## Goals

- Make Greater Components **strict-CSP compatible** (no emitted `style=` attributes in shipped components).
- Provide CSP-safe alternatives (classes/presets) where Greater previously relied on inline CSS.
- Add guardrails (CI) to prevent regressions.
- Document what is/ isn’t compatible with strict CSP and how to use CSP-safe alternatives.

## Decisions (Answered)

- Greater Components must be **strict CSP compatible end-to-end**; anything not CSP friendly is unusable in Lesser.
- Assume **no install base**: breaking changes are acceptable to achieve strict CSP compatibility.
- No long-term “CSP-unsafe” component/prop paths in shipped primitives; if a feature cannot be made CSP-safe, it must be
  redesigned or removed.

## Non-Goals (explicitly out of scope)

- Eliminating framework/app-produced inline scripts/styles (e.g., SvelteKit bootstrap) in downstream apps.
- Supporting arbitrary per-instance CSS values (width/height/gutter/colors) without consumer-provided external CSS.

## Scope

### Must-fix (blockers for strict CSP)

- `packages/primitives/src/components/Skeleton.svelte` (inline computed width/height style)
- `packages/primitives/src/components/Avatar.svelte` (inline display + dynamic background color styles)
- `packages/primitives/src/components/Text.svelte` (inline CSS variable for line clamping)
- `packages/primitives/src/components/Container.svelte` (inline CSS variable for custom gutters)

### Also required (must be strict CSP compatible)

- `packages/primitives/src/components/ThemeProvider.svelte` (inline CSS variables for palette/fonts)
- `packages/primitives/src/components/Section.svelte` (inline CSS variables for custom spacing/background)
- `packages/primitives/src/components/ThemeSwitcher.svelte` (+ `packages/primitives/src/components/Theme/*`) (inline preview styles)
- `packages/primitives/src/components/Tooltip.svelte` (inline pixel positioning)

### Follow-up candidates (as discovered by audit)

Other packages contain inline styles today (faces/shared tooling). After primitives are addressed, audit and prioritize
the subset that ships in Lesser deployments (e.g., blog/social surfaces) and apply the same CSP-safe rule (no inline styles).

## Definition of Done (Acceptance Criteria)

1. **No `style=` emitted** by shipped Greater Components (including via prop forwarding or `{...restProps}` spreads).
2. CI guard exists and fails on:
   - inline `<script>` tags in built docs/playground output
   - any `style="…"` attributes in built docs/playground output
   - any `style=` usage in shipped `.svelte` templates (source-level scan under `packages/**/src/**/*.svelte`)
3. Documentation includes a **“CSP Compatibility”** section that:
   - states the strict CSP guarantees for shipped Greater components
   - documents the CSP-safe alternatives for customization (classes/presets/external CSS)
4. Internal validation: the Lesser deployment using strict CSP has **zero `style-src` CSP violations** attributable to
   Greater primitives.

---

## Milestones

### Milestone 0 — Baseline, Policy, and Inventory (½–1 day)

**Outcome**

- A shared definition of “strict CSP compatible” for Greater Components and an inventory of violations.

**Work**

- Confirm target CSP (exact header) from Lesser CloudFront policy and document constraints (no `unsafe-inline`, no
  `unsafe-hashes`).
- Inventory inline style/script usage:
  - source scan: find all `style="…"` and `style={…}` in shipped Svelte templates (`packages/**/src/**/*.svelte`)
  - build scan: find `style="…"` and inline `<script>` in built docs/playground HTML
- Categorize findings into:
  - “ship-blocking” (must be fixed before release)
  - “follow-up” (not currently shipped to Lesser but should be fixed to maintain repo-wide CSP guarantees)
- Document the repo policy: **no shipped inline styles/scripts**; redesign/remove features that require inline styles.
  - Include an explicit rule: `style` is not a supported prop for shipped components (prefer `class` + external CSS).

**Acceptance Criteria**

- A checklist of every inline-style/script emission site with an owner and a remediation approach.
- A written policy statement defining “strict CSP compatible” and “no inline styles/scripts” as an enforceable contract.

---

### Milestone 1 — Core Primitive Refactors (CSP-safe by default) (1–3 days)

#### 1.1 Skeleton (`Skeleton.svelte`)

**Plan**

- Replace computed `style={…}` for `width`/`height` with class-based presets.
- New/updated API direction (example):
  - bounded `width` presets (e.g., `full`, `1/2`, `1/3`, `content`, `auto`)
  - bounded `height` presets (e.g., `xs`…`xl`) with sensible defaults per `variant`
  - arbitrary sizing requires consumer-provided CSS class (no inline style path)
- Remove style-prop merging behavior from Skeleton’s internal rendering path.

**Acceptance Criteria**

- Default usage (no width/height) emits no `style=` attribute.
- Preset sizing emits no `style=` attribute.
- Visual/DOM parity for default variants (text/circular/rectangular/rounded) within acceptable deltas.

#### 1.2 Avatar (`Avatar.svelte`)

**Plan**

- Replace `style="display: …"` with:
  - conditional rendering, and/or
  - `hidden` attribute, and/or
  - class toggles (`gr-avatar__image--loaded`, etc).
- Replace dynamic `background-color: hsl(…)` with deterministic palette classes:
  - hash(name/label) → index → `gr-avatar--color-0..N`
  - define those background colors in CSS (validated for contrast with the chosen foreground)

**Acceptance Criteria**

- No inline `style=` used for image display or placeholder/initials colors.
- Avatar still renders stable initials/label/icon fallback and maintains accessibility name behavior.
- Color choice is deterministic across sessions and stable for the same input.

#### 1.3 Text (`Text.svelte`)

**Plan**

- Replace `style={--gr-text-clamp-lines: …}` with bounded clamp classes:
  - e.g., `gr-text--clamp-2` … `gr-text--clamp-6` (decide exact range)
- Define CSS for each clamp class (no per-instance variable injection).
- For out-of-range clamp values, require consumer-provided class and document.

**Acceptance Criteria**

- `truncate` + supported `lines` emits no `style=` attribute.
- Single-line truncate remains class-only and unchanged.

#### 1.4 Container (`Container.svelte`)

**Plan**

- Keep preset gutters only as CSP-safe behavior.
- Treat non-preset gutters as “bring your own CSS”:
  - keep `gr-container--padded-custom` class but do **not** set variables via inline style
  - document setting `--gr-container-custom-gutter` via external CSS class
- Remove numeric/string `gutter` values (or replace with a `custom` sentinel) to avoid per-instance CSS values.

**Acceptance Criteria**

- Preset gutter usage emits no `style=` attribute.
- Container emits no `style=` attribute in any prop combination; custom gutters work only via external CSS.

---

### Milestone 2 — Theme + Layout Primitives (Decisions + Remediations) (1–3 days)

#### 2.1 ThemeProvider (`ThemeProvider.svelte`)

**Plan**

- Remove inline style emission entirely (no `style={customCSS}` path).
- Move palette + typography overrides to **class-based presets** backed by shipped CSS:
  - e.g., `gr-theme-provider--palette-slate`, `gr-theme-provider--font-body-sans`, etc.
- Remove or redesign runtime “custom theme object” APIs that require inline CSS variable injection.

**Acceptance Criteria**

- ThemeProvider emits no `style=` attribute in any prop combination.
- Theme selection is fully class-based and works under strict CSP.

#### 2.2 Section (`Section.svelte`)

**Plan**

- Restrict `spacing` and `background` to preset values only (no arbitrary string/number values).
- For bespoke styling, require consumer-provided external CSS classes instead of per-instance values.

**Acceptance Criteria**

- Section emits no `style=` attribute in any prop combination.
- Custom per-instance spacing/background values are removed (or redesigned to be class-based).

#### 2.3 ThemeSwitcher (+ Theme tooling components)

**Plan**

- Remove inline preview styles and any dynamic color styling.
- Redesign ThemeSwitcher to work with strict-CSP-compatible ThemeProvider capabilities:
  - select from preset themes/palettes
  - preview uses classes (no inline colors)
- Remove or redesign Theme tooling components that require dynamic inline colors (`ThemeWorkbench`, swatches, contrast preview).

**Acceptance Criteria**

- ThemeSwitcher emits no `style=` attribute in any prop combination and remains usable for preset theme switching.

#### 2.4 Tooltip (`Tooltip.svelte`)

**Plan**

- Remove inline positioning style attributes.
- Redesign to a CSS-positioned tooltip anchored to its trigger via placement classes (e.g., top/bottom/left/right), with:
  - optional JS-driven “auto placement” implemented via **class selection** (no pixel style injection)
  - documented constraints vs the current pixel-positioned implementation

**Acceptance Criteria**

- Tooltip emits no `style=` attribute in any prop combination and works under strict CSP.

---

### Milestone 2.5 — Repo-wide Inline Style Cleanup (faces/shared) (1–4 days)

**Outcome**

- No shipped Greater `.svelte` templates emit `style=` outside primitives.

**Work**

- Sweep `packages/**/src/**/*.svelte` (excluding tests and generated artifacts) and eliminate remaining inline styles:
  - replace dynamic pixel/percent styles with class-based presets or layout patterns
  - use external CSS variables only when values are set by **classes**, not per-instance props
- Prioritize anything used in Lesser deployments first (faces/blog, faces/social, shared surfaces).

**Acceptance Criteria**

- `rg -n "\\bstyle=(\"|\\{)" packages/**/src/**/*.svelte` returns no matches.

---

### Milestone 3 — Guardrails (CI CSP Audit) (½–1 day)

**Outcome**

- Regressions are caught automatically before deployment.

**Work**

- Add a CSP audit script (e.g., `scripts/audit-csp.mjs`) with two passes:
  1. **Source-level**: scan shipped component templates for `style=` usage (no allow list).
  2. **Built-output**: scan built docs/playground HTML for:
     - `<script>` tags without `src`
     - `style="…"` attributes
- Add root scripts:
  - `pnpm validate:csp` → runs the CSP audit(s)
  - optionally include in `pnpm validate:package`
- Ensure failures are actionable (file path + snippet + remediation hint).

**Acceptance Criteria**

- CI fails when a new `style=` attribute is introduced into shipped `.svelte` templates.
- CI fails when docs/playground output contains `style="…"` attributes.
- CI fails when docs/playground output contains inline `<script>` tags.
- Local command exists to reproduce failures quickly (`pnpm validate:csp`).

---

### Milestone 4 — Documentation + Migration Guide (½ day)

**Outcome**

- Consumers understand what works under strict CSP and how to migrate.

**Work**

- Add a “CSP Compatibility” section (docs site + package README) including:
  - what strict CSP blocks (inline scripts vs inline styles)
  - which components/props are CSP-safe
  - CSP-safe alternatives (classes/presets/external CSS variable patterns)
- Add a migration guide for any breaking or behavior-changing API updates:
  - Skeleton sizing changes
  - Text clamping changes
  - Container custom gutter changes
  - Avatar placeholder color changes (if applicable)

**Acceptance Criteria**

- Documentation includes a clear compatibility matrix and concrete migration examples.
- No intentionally CSP-unsafe features remain in shipped components; docs reflect this guarantee.

---

### Milestone 5 — Downstream Validation (Lesser) + Release (½–2 days, depends on app changes)

**Outcome**

- Verified strict CSP compatibility in the real deployment environment.

**Work**

- Update the consuming Lesser surfaces to use CSP-safe sizing/clamping/gutter/avatar patterns.
- Validate in a strict-CSP environment (CloudFront policy enabled):
  - confirm no `style-src` CSP violations from Greater components
  - confirm UX/visual parity for affected components
- Publish changes:
  - add changeset(s) for publishable packages
  - call out CSP compatibility in release notes

**Acceptance Criteria**

- Lesser deployment has zero `style-src` violations attributable to Greater components.
- CI guard passes on main for all packages/apps.
- Changeset + release notes include CSP changes and migration notes.

---

## Risks

- **Tooltip positioning**: strict CSP may make pixel-perfect tooltip positioning infeasible without a redesign.
- **Theme customization**: runtime palette generation implies inline variable injection; strict CSP may require switching to
  preset-only palettes or external pre-generated CSS.
- **API compatibility**: some props currently accept arbitrary strings/numbers; removing or gating these may require a
  coordinated downstream migration.
- **Docs/playground build constraints**: docs/playground frameworks may emit inline scripts by default; plan includes
  reconfiguring builds so output contains no inline scripts/styles.
