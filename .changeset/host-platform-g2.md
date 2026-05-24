---
'greater-components': minor
'@equaltoai/greater-components': minor
'@equaltoai/greater-components-host-platform': minor
---

Add the new `@equaltoai/greater-components-host-platform` workspace package and the `@equaltoai/greater-components/host-platform` export subpath. This is the G2 milestone (parent #635) for the lesser-host web M0.8–M0.10 / M1 cost-and-usage rollout — Greater Project 39 Signal D.

Three additive components, all strict-CSP safe, SSR-safe, WCAG 2.1 AA, and **status communication is never color-only**:

- **FleetCard** — composed instance / fleet card. Renders a `<section>` landmark with `aria-labelledby` linked to the auto-generated heading (`h3` by default; `headerLevel` selects `<h1>`–`<h6>`). Slug / region / version subtitle with `aria-label="Region"` / `"Version"`. Status badge with an icon glyph **and** visible text label for every `FleetCardStatus` (`healthy` ●, `provisioning` ◌, `warning` ▲, `degraded` ▼, `offline` ■, `unknown` ?). `metadata: FleetCardMetadataItem[]` renders as a real `<dl>` / `<dt>` / `<dd>`. `cost` / `activity` / `actions` snippets compose into the same card. `actions` is wrapped in `role="group"` with `aria-label="Fleet actions"`.

- **CostGauge** — `role="meter"` cost / usage indicator. `current`, `limit`, optional `currency` (drives `Intl.NumberFormat`-based `aria-valuetext`, e.g. `"$42.50 of $100.00"`). Auto-status from `current / limit`: defaults `warning` at `0.75`, `danger` at `0.9`; override with `thresholds` or supply `status` directly. Non-color-only: every status renders icon + label inside the readout. **Strict-CSP fill width** via a `data-ratio` integer attribute (0–100) and 101 attribute-selector CSS rules — no inline `style` ever set at runtime.

- **ActivitySparkline** — inline SVG trend. Defaults to informative (`<svg role="img" aria-labelledby aria-describedby>` with `<title>` + optional `<desc>`); opt into `decorative` only when a textual equivalent exists adjacent. Empty `data` renders a labeled empty-state `<div role="status">` instead of a zero-length path. Pure `buildSparklinePath` data-to-SVG transform — deterministic, no DOM access, no inline styles.

Distribution:

- New workspace package at `packages/host-platform/` paralleling `packages/shell/`.
- Exported through `@equaltoai/greater-components/host-platform`, `./host-platform/*`, `./host-platform/types`, `./host-platform/formatters`, `./host-platform/sparkline`, `./host-platform/style.css`, `./host-platform/host-platform.css`.
- CLI registry entry (`host-platform`) with `tokens` + `utils` registry deps.
- `scripts/generate-registry-index.js` PACKAGE_CONFIGS entry; registry regenerated.
- `tsconfig.base.json` path aliases.
- `.changeset/config.json` adds host-platform to the fixed release group.
- `.github/workflows/docs.yml` builds the package before the playground / docs apps.

Theming: existing `--gr-*` tokens unchanged. Additive `--gr-host-platform-*` tokens (`gutter`, `gap-sm`/`-md`/`-lg`, `radius`, `sparkline-stroke`). Package ships its own `.gr-sr-only` utility so shell-less consumers retain visually-hidden semantics for any composed live-region announcements.

No existing exports are renamed or removed. No Lesser / Lesser Host adapter or contract changes (data is consumer-provided).
