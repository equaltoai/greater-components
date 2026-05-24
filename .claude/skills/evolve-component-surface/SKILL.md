---
name: evolve-component-surface
description: Use when a change touches the component public API (props, slots, events, exports, primitives, headless behaviors, faces) or the theming contract (CSS custom-property tokens). Walks API-stability + semver discipline + theming-stability + accessibility-preservation + Mastodon-compat-consideration before enumeration.
---

# Evolve the component surface

greater's component exports are **versioned contracts**. Every `greater update` replays component source into consumer codebases; breaking changes land there directly. This skill walks component-surface and theming-surface changes with the discipline those contracts demand.

## The component surface (memorize)

- **Primitives** (`packages/primitives/`) — 17 styled components. Each export: component + prop types + slot structure + event types + index barrel.
- **Headless behaviors** (`packages/headless/`) — behavior-only primitives (button, modal, menu, tooltip, tabs) + pure behaviors (focus-trap, roving-tabindex, typeahead, popover, dismissable, live-region). No styles; consumers bring their own.
- **Faces** (`packages/faces/`) — domain-specific component suites: social, artist, blog, community, agent.
- **Shared** (`packages/shared/`) — internal domain packages (messaging, notifications, admin, auth, compose, search, soul).
- **Tokens** (`packages/tokens/`) — CSS custom properties (`--gr-*`) + palettes + theme variants.
- **Icons** (`packages/icons/`) — 300+ SVG icons.

## The public-contract surface per component

For each exported component:

- **Props** — names, types, defaults, requiredness. `PropType | undefined` vs strict `PropType` matters.
- **Slots** — names and expected content shape; `let:` directives.
- **Events** — dispatched events, their names, their detail payloads.
- **Default CSS classes** — NOT public API. Consumers shouldn't select by internal class names.
- **ARIA attributes** — part of the accessibility contract (see `enforce-accessibility`).
- **Token usage** — which `--gr-*` tokens the component reads. Consumers theme via tokens.

## When this skill runs

Invoke when:

- A change adds a new component to any package
- A change modifies props, slots, events, or exports of an existing component
- A change adds, renames, or changes the semantic meaning of a design token (`--gr-*`)
- A change adds a new theme variant or changes theme-switching mechanism
- A change affects which tokens a component consumes in a way consumers would observe
- A change removes or deprecates a component
- `scope-need` flags a change as component-surface or theming-contract touching
- `investigate-issue` surfaces a component-API stability issue

## Preconditions

- **The change is described concretely.** "Improve Button" is too vague; "add optional `size` prop to Button accepting `'sm' | 'md' | 'lg'` with default `'md'`, backward-compatible for existing consumers who don't pass the prop" is concrete.
- **MCP tools healthy**, `memory_recent` first.
- **Current component's public surface loaded in mind** — `types.ts`, `index.ts`, existing tests.

## The five-dimension walk

### Dimension 1: Semver impact classification

Every change classifies:

- **Major (breaking)**: removing a prop, renaming a prop, changing a prop's type (widening / narrowing behavior), removing a slot, removing an event, removing a component, changing an event's detail payload in a way consumers observe, renaming a token, changing a token's semantic meaning, removing a theme variant.
- **Minor (additive)**: new optional prop, new slot (additive), new event, new component, new token, new theme variant, semantic-refinement that bugs-are-fixed without changing documented behavior.
- **Patch (bug fix)**: behavior fix that matches the documented contract, internal refactor, non-observable optimization, dependency bump within range.

The classification drives the **changeset impact declaration**. `.changeset/<slug>.md` declares impact explicitly.

### Dimension 2: Consumer-impact analysis

For each changed component:

- **Who consumes it?** sim, host web, lesser UIs, external Mastodon-compat UIs.
- **For breaking changes**: which consumers are affected, how they migrate, whether advisory / release-notes path is needed.
- **For additive changes**: can consumers adopt the new capability incrementally, or does uptake require coordination?
- **For token changes**: which consumer themes override the affected tokens? A rename breaks every override.

### Dimension 3: Accessibility preservation check

Every component-surface change preserves or tightens the WCAG 2.1 AA baseline:

- **ARIA attributes preserved** — keyboard navigation, screen-reader semantics, focus management.
- **Contrast ratios** — if the change affects default visual presentation, contrast verified against AA minimums.
- **Focus management** — modals, menus, popovers maintain focus-trap behavior.
- **Keyboard interaction patterns** — standard patterns (arrow keys in menus, escape closes modals, tab / shift+tab in focus traps) preserved.

If accessibility is affected, the `enforce-accessibility` walk runs additionally.

### Dimension 4: Theming-contract check

For token changes:

- **Additive**: new `--gr-*` token. Consumers ignore tokens they don't override. Minor.
- **Rename**: `--gr-color-primary-600` → `--gr-color-primary-medium`. Breaking; every consumer override becomes a no-op. Major + `evolve-component-surface` walk + consumer-migration advisory.
- **Semantic shift**: same token name, different hue / size / meaning. Breaking even if name is stable; consumer visual regressions result. Major.
- **Removal**: refused unless explicitly authorized with documented migration.

For theme-variant changes:

- **Additive new variant** (e.g. new `high-contrast-plus` theme): minor.
- **Renaming variant** or **changing how theme-switching works**: breaking; major.
- **Removing a theme variant** (e.g. removing `dark`): refused without explicit governance.

### Dimension 5: Mastodon-compat consideration

greater is Lesser-first but Mastodon-baseline-compatible where feature sets overlap. For changes that could affect non-Lesser consumers:

- **New Lesser-exclusive feature**: fine as an additive new component or new prop that Mastodon-consumers simply don't use.
- **Change to existing behavior**: if existing behavior was Mastodon-compatible, the change should remain so — or the drop is documented explicitly in release notes.
- **Adapter-level branching**: protocol-specific logic lives in adapters (`packages/adapters/`), not in components themselves where avoidable.

## The audit output

```markdown
## Component-surface audit: <change name>

### Proposed change

<concrete description>

### Component(s) affected

- **<component name>** (package: <primitives / headless / faces / shared>)
  - Props impact: <added / modified / removed>
  - Slots impact: <...>
  - Events impact: <...>
  - Exports impact: <...>
  - Token usage impact: <...>
  - ARIA / accessibility impact: <preserved / tightened / refused>

### Token(s) affected (if applicable)

- Added: <list>
- Renamed: <refused without major + advisory>
- Semantic shifts: <refused>
- Removed: <refused without explicit authorization>

### Semver impact classification

<major / minor / patch>

### Changeset declaration

`.changeset/<slug>.md` content draft:
```

---

## "@equaltoai/greater-components-\*": <impact>

<description of change, user-facing>

```

### Consumer-impact analysis
- sim: <...>
- host web: <...>
- lesser UIs: <...>
- external Mastodon-compat: <baseline preserved / explicit drop documented in release notes>

### Accessibility preservation
- ARIA / keyboard / focus preserved or tightened: <confirmed>
- Contrast AA: <confirmed>
- `enforce-accessibility` walk: <not required / completed>

### Theming-contract preservation
- Additive only: <yes / no>
- Renames / removals / semantic shifts: <none — default; if present, refuse without major + advisory>

### Mastodon-compat preservation
- Baseline preserved: <yes / explicit drop documented>

### Test coverage
- Unit tests for new prop / slot / event / component: <added>
- Integration tests: <added where applicable>
- a11y tests: <added / existing>
- Playground demo for new / modified component: <added>
- Docs / component-inventory update: <added>

### Proposed next skill
<enumerate-changes if audit clean; sync-contracts if adapter-side change required; enforce-accessibility if a11y walk needed; scope-need if audit surfaces scope growth; investigate-issue if audit reveals an existing bug>
```

## Refusal cases

- **"Ship a breaking component change without a major-version changeset."** Refuse.
- **"Remove this prop silently; nobody uses it."** Refuse. Removal is breaking; major.
- **"Rename this prop for consistency."** Evaluate — usually refuse in favor of additive aliasing. Direct renames break every consumer.
- **"Change the default value of an existing prop."** Evaluate. If the new default is backward-compatible (doesn't change observable behavior for consumers who didn't pass the prop), minor. If it does change, breaking.
- **"Rename `--gr-color-primary-600` to `--gr-color-primary-medium`."** Refuse silent. Requires major + consumer-migration advisory.
- **"Remove the dark theme."** Refuse without explicit governance event.
- **"Add a breaking change to this component and log it in the commit body; skip the changeset."** Refuse.
- **"Loosen ARIA semantics for simpler DOM."** Refuse via `enforce-accessibility`.
- **"Drop Mastodon baseline for this component; we only care about Lesser."** Evaluate carefully; document the drop in release notes if authorized; refuse silent drops.

## Persist

Append when the walk surfaces something worth remembering — a breaking-change-consumer-coordination pattern, a token-rename migration strategy, an additive-change semver nuance, a Mastodon-compat boundary. Routine audits aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff

- **Audit clean, additive / minor** — invoke `enumerate-changes`.
- **Audit clean, breaking / major with consumer-coordination plan** — coordinate via sibling stewards (sim, host) through the user, then `enumerate-changes`.
- **Audit overlaps with contract-sync** (adapter-surface affected too) — invoke `sync-contracts` as well.
- **Audit overlaps with accessibility** — invoke `enforce-accessibility`.
- **Audit surfaces scope growth** — revisit `scope-need`.
- **Audit reveals an existing bug** — route through `investigate-issue`, then back here.
- **Audit surfaces framework awkwardness** (Svelte 5, FaceTheory) — `coordinate-framework-feedback`.
