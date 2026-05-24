# Project 39 — Greater Host adoption RC preview

> Status: **awaiting RC promotion** (G4.3 #663).
>
> This document is the staging-state preview of what an RC tag covering
> Project 39 G0–G3 would ship. It is generated as part of G4.1
> (parity audit, #661) and G4.2 (changeset / release-note discipline,
> #662) and exists so the Greater steward, host steward, and Aron can
> see the consolidated release shape **before** the RC tag is cut.

## Scope

Four milestones merged into `staging` between PR #667 and #670:

| Milestone                                    | PR   | Merge commit | Parent issue                                           |
| -------------------------------------------- | ---- | ------------ | ------------------------------------------------------ |
| G0 — Shell surface                           | #667 | `555a39d9`   | #633 — Host shell surface for lesser-host web M0       |
| G1 — CommandPalette                          | #668 | `05d0daf2`   | #634 — Accessible CommandPalette for Host navigation   |
| G2 — Host-platform (cards/gauges/sparklines) | #669 | `4862e285`   | #635 — Hosted-platform cards, gauges, and sparklines   |
| G3 — Host-platform (timelines/matrix)        | #670 | `24154c23`   | #636 — Operator timelines and stack matrix for Host M2 |

All four shipped under Greater Project 39 Signal D and unblock the
lesser-host `web/` rework (parent #377 in `equaltoai/lesser-host`).

## What ships

### New workspace packages

- **`@equaltoai/greater-components-shell`** — new in G0
- **`@equaltoai/greater-components-host-platform`** — new in G2 (extended in G3)

Both also exposed via the root barrel as `@equaltoai/greater-components/shell`
and `@equaltoai/greater-components/host-platform`.

### Component surface additions

**Shell (11 components):**

- `Shell`, `Sidebar`, `Topbar`, `Panel`, `StatCard`, `SummaryStrip`,
  `PageFrame`, `PageTitle`, `Breadcrumb`, `Callout` (G0)
- `CommandPalette` (G1)

**Host-platform (6 components):**

- `FleetCard`, `CostGauge`, `ActivitySparkline` (G2)
- `ProvisioningTimeline`, `ReleaseTimeline`, `StackMatrix` (G3)

### New public types (35+)

All exported via each package's `./types` subpath. See
[`docs/api-reference.md`](../api-reference.md) for the full list.

### New utilities

- Shell: `scoreCommandPaletteItem`, `filterAndRankCommandPaletteItems`,
  `tokenizeCommandPaletteQuery` (dependency-free fuzzy filter)
- Host-platform: `formatCost`, `formatCostGaugeText`, `computeRatio`,
  `buildSparklinePath`

All zero runtime dependencies; no `unsafe-eval`; deterministic.

### Additive `--gr-*` design tokens

No existing tokens renamed or removed. New `--gr-shell-*` and
`--gr-host-platform-*` token families scoped via `:where(...)` selectors
to every component root class, so standalone components outside their
wrapper still resolve spacing tokens.

## Changeset audit (G4.2)

Four changesets target the consolidated release:

| File                    | Impact | Packages                                                                                             |
| ----------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `shell-surface-g0.md`   | minor  | `greater-components`, `@equaltoai/greater-components`, `@equaltoai/greater-components-shell`         |
| `command-palette-g1.md` | minor  | `greater-components`, `@equaltoai/greater-components`, `@equaltoai/greater-components-shell`         |
| `host-platform-g2.md`   | minor  | `greater-components`, `@equaltoai/greater-components`, `@equaltoai/greater-components-host-platform` |
| `host-platform-g3.md`   | minor  | `greater-components`, `@equaltoai/greater-components`, `@equaltoai/greater-components-host-platform` |

**All minor / additive. No major / breaking. No token renames.** The
release-please RC PR will compile these into the consolidated changelog
entry on the version bump.

The next stable cuts from 0.9.0; the RC will be **0.10.0-rc.0** (or
later) per release-please's accumulated-minor-changeset arithmetic.

## Component-parity audit (G4.1)

Every G0–G3 PR shipped with the full parity checklist satisfied (no
gaps left for follow-up):

| Milestone | Source | Types | Tests                         | Docs (inventory / api-ref) | Playground                | CLI registry | Registry regen |
| --------- | ------ | ----- | ----------------------------- | -------------------------- | ------------------------- | ------------ | -------------- |
| G0        | ✅     | ✅    | 79 (74 + 5 id-uniq)           | ✅                         | `/shell`                  | ✅           | ✅             |
| G1        | ✅     | ✅    | 41 added (cmdk + filter)      | ✅                         | `/command-palette`        | ✅           | ✅             |
| G2        | ✅     | ✅    | 57 (initial)                  | ✅                         | `/host-platform`          | ✅           | ✅             |
| G3        | ✅     | ✅    | 51 added (timelines + matrix) | ✅                         | `/host-platform` extended | ✅           | ✅             |

Workspace-wide test totals at staging head `24154c23`: **shell 124 +
host-platform 108** plus all pre-existing packages green.

## Accessibility audit (Project 39 stewardship gate)

All four milestones cleared the 9-cell accessibility-tests CI matrix
(light / dark / high-contrast × comfortable / compact / spacious) on
their final commit. Notable patterns enforced:

- **Status communication is never color-only** — every
  `FleetCardStatus`, `CostGaugeStatus`, `ProvisioningStepStatus`,
  `ReleaseStatus`, `StackMatrixDrift`, `CalloutTone` carries an icon
  glyph plus a visible text label in addition to any color tint.
- **`role="meter"` ARIA contract enforced** — `aria-valuenow` clamped
  into `[aria-valuemin, aria-valuemax]`; when the consumer-supplied
  range is invalid (`limit <= 0` or non-finite), the gauge drops the
  meter role entirely and falls back to `role="img"` with a composed
  multi-id `aria-labelledby` so AT users still hear the readout. (See
  PR #669 + #670 review history for the regression tests.)
- **`role="log"` is implicitly live** — when consumers opt out via
  `liveLogPoliteness="off"`, ProvisioningTimeline drops `role="log"`
  entirely (not just `aria-live`) so AT genuinely sees no
  announcements. (See PR #670 review #4353484472.)
- **Date-only ISO strings format in UTC** — ReleaseTimeline's default
  formatter detects calendar-day inputs (`YYYY-MM-DD`, `...T00:00:00Z`)
  and passes `timeZone: 'UTC'` to `Intl.DateTimeFormat`, avoiding the
  one-day-earlier shift in US timezones.
- **Sortable headers are native `<button>`** — StackMatrix's sortable
  columns use real `<button>` elements with the browser-native keyboard
  contract; `aria-sort` reflects only the currently-sorted column.
- **`role="img"` SVGs have accessible names** — ActivitySparkline
  defaults to informative `<svg role="img" aria-labelledby
aria-describedby>` with real `<title>` + optional `<desc>`; opt into
  `decorative={true}` only when a textual equivalent exists nearby.

## Strict-CSP audit

Zero new CSP violations across G0–G3 per `pnpm validate:csp`. Key
techniques:

- No inline event handlers (Svelte's compiled `on*` listeners attach
  after hydration).
- No `style="..."` attributes set at runtime. CostGauge's fill width is
  driven by a `data-ratio` integer attribute (0–100) + 101
  attribute-selector CSS rules in the bundle.
- ActivitySparkline's SVG path is a pure data-to-string transform via
  `buildSparklinePath`.
- All `.gr-sr-only` references are backed by the rule shipped in both
  shell's and host-platform's `base.css` (avoids visible live-region
  announcement leakage for shell-less / primitives-less consumers).

## Cross-repo consumer impact

| Consumer                     | Impact                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **lesser-host web/** (#377)  | Unblocks shell + command palette + cost / activity / fleet displays + operator timelines / matrix. |
| **sim (simulacrum)**         | Additive only; can adopt incrementally.                                                            |
| **lesser UIs**               | Additive only; protocol-agnostic surfaces remain unaffected.                                       |
| **External Mastodon-compat** | Hosted-platform surfaces are operator-specific; shell surface is protocol-agnostic and compatible. |

**No Lesser / Lesser Host contract or adapter changes ship in this
RC.** Future data-fetching adapters for provisioning / release / fleet
APIs are tracked separately as the deferred contract-sync lane (G4.6 /
#666; see `docs/host-platform/contract-sync-lane.md`).

## Open coordination items

- **G4.3 / #663** — Cut the RC tag. Operator-authorized release op
  (managed by `release-components` skill). Awaits Aron.
- **G4.4 / #664** — Host validates the RC in `lesser-host/web/` under
  strict CSP + SSR + Svelte 5.55.7+. Awaits Host steward.
- **G4.5 / #665** — Cut stable tag after Host acceptance + backmerge.
  Awaits Aron.

## Pinning the RC (consumer instructions, once cut)

Once Aron promotes `staging → premain` and release-please publishes the
RC tag, host can adopt with:

```sh
# Install the RC CLI globally (pinned to the RC tag).
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z-rc.N/greater-components-cli.tgz

# In the consumer project:
greater update --ref greater-vX.Y.Z-rc.N

# Or, for a single component:
greater add shell --ref greater-vX.Y.Z-rc.N
greater add host-platform --ref greater-vX.Y.Z-rc.N
```

(Exact `X.Y.Z-rc.N` will be filled in by release-please at promotion
time.)

---

**Generated**: 2026-05-24 by the Greater steward as part of Project 39
G4 release-coordination work (PRs #667–#670, parent issue #637).
