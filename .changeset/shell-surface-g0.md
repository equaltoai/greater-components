---
'greater-components': minor
'@equaltoai/greater-components': minor
'@equaltoai/greater-components-shell': minor
---

Add the new `@equaltoai/greater-components-shell` workspace package and the `@equaltoai/greater-components/shell` export subpath. The shell surface provides ten additive, Svelte 5, strict-CSP-safe, WCAG 2.1 AA components for app-shaped Fediverse / Lesser-aware consumers (lesser-host web M0):

- `Shell` — root grid layout combining `Sidebar`, `Topbar`, and a single `<main>` landmark
- `Sidebar` — semantic `<nav>` with a required accessible name, supports `aria-current="page"`
- `Topbar` — site/app `<header>` bar with start / center / end regions
- `Panel` — `<section>` container with title heading (auto-`aria-labelledby`) and actions group
- `StatCard` — `role="group"` metric card composing its accessible name from label / value / trend / description
- `SummaryStrip` — `<section aria-label>` grouping summary items in a responsive grid
- `PageFrame` — content-level wrapper with optional aside, header, and footer
- `PageTitle` — semantic page heading with eyebrow / subtitle / description / actions
- `Breadcrumb` — `<nav aria-label>` + `<ol>` with `aria-current="page"` on the active item
- `Callout` — informational call-out with tone-driven live-region semantics (`status` / `alert` / `note`)

No existing exports are renamed or removed. All styles consume stable `--gr-*` tokens and add only additive `--gr-shell-*` tokens. No Lesser / Lesser Host contract or adapter changes.
