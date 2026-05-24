---
'greater-components': minor
'@equaltoai/greater-components': minor
'@equaltoai/greater-components-host-platform': minor
---

Add three operator-console components to `@equaltoai/greater-components/host-platform`: `ProvisioningTimeline`, `ReleaseTimeline`, `StackMatrix`. G3 milestone for lesser-host web M2 (Greater Project 39 Signal D, parent #636).

All three are presentational only — consumers supply already-shaped data. No Lesser / Lesser Host adapter or contract changes (deferred to a later sync-contracts-gated PR if/when Host publishes provisioning / release / stack APIs).

Highlights:

- **ProvisioningTimeline** — `<section aria-labelledby>` + semantic `<ol>` of `ProvisioningStep`s. Each step exposes status (`pending` / `active` / `success` / `failure` / `skipped`) via icon glyph + visible text label (never color-only). The active step carries `aria-current="step"`. Optional `liveLog` snippet is wrapped in a constrained `<section role="log" aria-live="polite" aria-atomic="false" aria-relevant="additions">` so AT users hear only NEW log lines on each update rather than the entire backlog. `liveLogPoliteness` configurable to `'assertive'` (urgent failures) or `'off'` (visible-only).

- **ReleaseTimeline** — `<section aria-labelledby>` + semantic `<ol>` of `ReleaseTimelineItem`s. Each release exposes channel via `aria-label`, dates via `<time datetime>`, and numeric adoption as a nested `role="meter"` with `[0, 1]` range and composed `aria-valuetext` (e.g. `"Adoption: 42%"`). String adoption (`"42 of 100 instances"`) renders as static text — no fake meter range. Default `formatDate` uses `Intl.DateTimeFormat`; `formatAdoption` and `formatDate` are both overridable.

- **StackMatrix** — real `<table>` with `<caption>` (visually-hidden by default but available to AT), `<th scope="col">` column headers, `<th scope="row">` row headers, and `aria-sort` on the currently-sorted column. Sortable columns render their headers as `<button>` elements (browser-native keyboard contract); consumers receive the column id via `onsort` and re-supply `rows` in the desired order. Drift indicators (`in-sync` ● / `pending` ◌ / `drifted` ⚠ / `unknown` ?) are non-color-only. Per-row actions are wrapped in `<div role="group">` with a row-specific accessible name.

Type contracts added: `ProvisioningStep`, `ProvisioningStepStatus`, `ProvisioningLogPoliteness`, `ReleaseChannel`, `ReleaseStatus`, `ReleaseTimelineItem`, `ReleaseAdoptionFormatter`, `StackMatrixDrift`, `StackMatrixColumn`, `StackMatrixCell`, `StackMatrixRow`, `StackMatrixSortDirection`.

Wiring:

- `packages/host-platform/src/index.ts` exports the three new components and all twelve new types.
- `packages/host-platform/package.json` adds `./ProvisioningTimeline`, `./ReleaseTimeline`, `./StackMatrix` subpath exports.
- `packages/host-platform/src/styles/base.css` extends the box-sizing + `--gr-host-platform-*` token-defaults `:where(...)` selector to cover the new component root classes.
- CLI registry (`packages/cli/src/registry/index.ts`): updated `host-platform` description + tags to mention the new components.
- `registry/index.json` regenerated.

No existing exports are renamed or removed. No new runtime dependencies. Strict-CSP safe: no inline event handlers, no `style` attributes set at runtime.
