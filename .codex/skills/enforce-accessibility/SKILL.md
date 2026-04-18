---
name: enforce-accessibility
description: Use when a change touches accessibility-relevant surfaces — DOM structure, ARIA attributes, keyboard navigation, focus management, contrast, screen-reader semantics. Walks the WCAG 2.1 AA baseline preservation discipline. Loosening the baseline is refused without explicit governance authorization.
---

# Enforce accessibility

greater's accessibility baseline is **WCAG 2.1 AA**. It is non-negotiable: every component ships at that bar; CI tests enforce it; consumers rely on it. Regressions are refused without explicit governance authorization.

This skill walks every accessibility-adjacent change with the rigor the baseline demands.

## The accessibility surface (memorize)

- **Headless behaviors** (`packages/headless/`) — focus-trap, roving-tabindex, typeahead, popover, dismissable, live-region. The a11y building blocks.
- **Primitives** (`packages/primitives/`) — each must include appropriate ARIA, keyboard handling, focus management.
- **Faces** (`packages/faces/`) — domain-specific components that compose primitives + headless behaviors.
- **Tokens** (`packages/tokens/`) — color tokens must meet AA contrast ratios; typography tokens support readability.
- **Tests**:
  - **Vitest a11y matchers** — unit-level assertions
  - **Playwright a11y tests** — integration-level, runs in CI (`pnpm playwright:install && pnpm test:e2e`)
  - **axe-core** or similar engine typically powering a11y checks
- **Documentation**:
  - Accessibility claims in component docs
  - CONTRIBUTING.md accessibility checklist
  - Any `docs/accessibility.md` or equivalent

## The WCAG 2.1 AA criteria (the gate)

Key criteria enforced (non-exhaustive — full WCAG compliance walks more):

- **1.4.3 Contrast (Minimum)** — 4.5:1 for normal text, 3:1 for large text, UI components and graphical objects 3:1 against adjacent colors.
- **1.4.11 Non-text Contrast** — UI component boundaries 3:1 against adjacent colors.
- **2.1.1 Keyboard** — all functionality available via keyboard.
- **2.1.2 No Keyboard Trap** — focus can move away from any focused element (focus traps in modals release on escape / dismissal).
- **2.4.3 Focus Order** — focus order preserves meaning.
- **2.4.7 Focus Visible** — keyboard focus indicator is visible.
- **3.2.1 On Focus** — focusing does not initiate unexpected change of context.
- **3.2.2 On Input** — changing input does not initiate unexpected change of context without warning.
- **3.3.1 Error Identification** — form errors identified and described.
- **3.3.2 Labels or Instructions** — form controls have labels.
- **4.1.2 Name, Role, Value** — elements have accessible names, roles, values via ARIA where needed.
- **4.1.3 Status Messages** — dynamic status communicated to assistive tech (live regions).

## When this skill runs

Invoke when:

- A change adds a new component (new component ships at AA baseline)
- A change modifies DOM structure, ARIA attributes, keyboard handling, focus management, contrast, or screen-reader semantics of an existing component
- A change adds or modifies a token that affects contrast (color tokens, especially)
- A change adds or modifies a theme variant (light / dark / high-contrast)
- A Playwright a11y test fails in CI
- A consumer reports an accessibility issue
- `scope-need` flags a change as accessibility-relevant
- `investigate-issue` surfaces an accessibility regression
- `evolve-component-surface` walk identifies accessibility-preservation as a concern

## Preconditions

- **The change is described concretely.** "Improve accessibility" is too vague; "add `aria-describedby` pointing at error-message element when the Input component is in error state" is concrete.
- **MCP tools healthy**, `memory_recent` first — a11y findings accumulate.
- **The specific WCAG criterion / criteria under consideration identified** — "contrast", "keyboard nav in combobox", "focus management in nested modals", etc.

## The four-dimension walk

### Dimension 1: Baseline classification

- **Baseline-preserving**: the change maintains existing accessibility properties exactly. Default for refactors, styling updates, non-a11y-adjacent logic.
- **Baseline-tightening (higher bar)**: the change exceeds the baseline — tighter contrast, more robust ARIA, better keyboard handling, improved focus management. Welcome; consider locking in with a test.
- **Baseline-adjacent / neutral**: new component addition. Ships at the baseline; tests validate.
- **Baseline-loosening**: refused without explicit governance authorization. Specifically includes removing ARIA without replacement, removing keyboard handling, dropping focus management, reducing contrast.

### Dimension 2: Test coverage

Every a11y-relevant change lands with corresponding test coverage:

- **Unit tests** (Vitest) — assert ARIA attributes, role, accessible-name.
- **Integration / component tests** — keyboard interaction, focus management, event handlers.
- **Playwright a11y tests** — axe-core-powered scan of component-in-context (playground page), contrast verification, screen-reader-semantic validation.
- **New components** — a11y tests included from day one.
- **Modified components** — existing tests still pass; new tests added for the specific accessibility property being preserved or tightened.

### Dimension 3: Keyboard + focus audit

For any component with interactive behavior:

- **Keyboard access** — every action available via keyboard (no mouse-only functionality).
- **Focus indicators** — visible for every focusable element; not removed via `outline: none` without compensating indicator.
- **Focus order** — tab order matches visual / logical order.
- **Focus management**:
  - Modal opens → focus moves to first focusable element (or modal body per pattern)
  - Modal closes → focus returns to trigger
  - Menu opens → focus stays on trigger until arrow-key navigation engages (standard pattern)
  - Popover / tooltip — focus behavior per pattern
- **Focus trap** — modals trap focus until dismissed; no keyboard escape without interaction.
- **Roving tabindex** — menus, tablists use roving pattern to maintain single tab-stop.
- **Typeahead** — select / combobox support typeahead to jump.

### Dimension 4: Screen-reader semantics + contrast

For any component affecting semantics or visual:

- **Accessible name** — every interactive element has a name (from content, `aria-label`, `aria-labelledby`).
- **Role** — semantic HTML preferred (`<button>`, `<a href>`, `<input>`); ARIA roles fill gaps.
- **States** (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`) — communicated correctly and updated dynamically.
- **Properties** (`aria-describedby`, `aria-controls`, `aria-owns`) — used where they add meaning.
- **Live regions** (`aria-live`, `aria-atomic`) — for dynamic status messages.
- **Contrast**:
  - Text-on-background: 4.5:1 for normal text, 3:1 for large (18pt+, 14pt+ bold).
  - UI component boundaries: 3:1 against adjacent.
  - Graphical objects conveying information: 3:1.
  - Tested across light / dark / high-contrast theme variants.

## The audit output

```markdown
## Accessibility audit: <change name>

### Proposed change
<concrete description>

### Component(s) affected
<list>

### WCAG criteria implicated
<list — e.g. 1.4.3 Contrast, 2.1.1 Keyboard, 4.1.2 Name Role Value>

### Baseline classification
<preserving / tightening / neutral new-component / loosening (refuse)>

### Keyboard + focus audit
- Keyboard access preserved / tightened: <confirmed>
- Focus indicators preserved / tightened: <confirmed>
- Focus order correct: <confirmed>
- Focus management (modal, menu, popover patterns) preserved: <confirmed>
- Focus trap behavior (if applicable): <confirmed>

### Screen-reader semantics audit
- Accessible name present: <confirmed>
- Role correct (semantic HTML or ARIA): <confirmed>
- States dynamic and correct: <confirmed>
- Properties (describedby, controls, owns) used where meaningful: <confirmed>
- Live regions (if applicable): <confirmed>

### Contrast audit
- Text contrast in light theme: <AA — X:1>
- Text contrast in dark theme: <AA — Y:1>
- Text contrast in high-contrast theme: <AAA — Z:1>
- UI component boundaries: <3:1+>
- Graphical objects: <3:1+ where applicable>

### Test coverage
- Vitest unit tests (ARIA / role / name assertions): <added / existing>
- Vitest integration tests (keyboard interaction, focus management): <added / existing>
- Playwright a11y tests (axe-core scan, contrast, screen-reader semantic): <added / existing>
- Theme-variant coverage: <light / dark / high-contrast all tested>

### Documentation
- Component docs a11y claim updated: <yes / n/a>
- CONTRIBUTING.md a11y checklist references this component: <yes>

### Governance-authorization check (for baseline-loosening only)
- Loosening proposed: <no — default>
- If yes: authorization documented, migration path for affected consumers, temporary exception with sunset

### Proposed next skill
<enumerate-changes if audit clean; evolve-component-surface if wider component-surface changes are needed alongside a11y work; scope-need if audit surfaces scope growth; investigate-issue if audit reveals existing a11y bug>
```

## Refusal cases

- **"Drop the focus-trap on Modal for simpler code."** Refuse. Modal's focus-trap is mandated by 2.1.2 No Keyboard Trap + focus-management-in-modals standard pattern.
- **"Remove ARIA attributes because semantic HTML covers it."** Evaluate. Semantic HTML is preferred, but state-communication ARIA often still needed (`aria-expanded`, etc.). Refuse blanket removal.
- **"Lower contrast in dark theme for aesthetic reasons."** Refuse.
- **"Skip the a11y test for this component; it's decorative."** If the component has any interactive role, it has a11y obligations. Purely decorative (visual-only, non-interactive) components may have reduced obligations but are rare.
- **"Let the contrast-ratio test fail; the design team approved."** Refuse. Design approvals don't override WCAG.
- **"Remove keyboard handling on this click-only component."** Refuse — keyboard access is mandatory.
- **"Skip focus-visible styling; designers don't like the outline."** Refuse. Focus indicators are mandatory; if the default outline is disliked, replace with an equally-visible alternative.
- **"Drop a theme variant with poor contrast rather than fix it."** Evaluate — dropping a variant is major; fixing is usually the right path.
- **"Make this interactive element role='presentation' because the semantics are weird."** Rarely correct. Refuse unless the semantics genuinely are presentational.

## Persist

Append when the walk surfaces something worth remembering — a contrast calculation for a specific token combination, a keyboard-pattern decision, a focus-management edge case, a test-flakiness story, a WCAG criterion that keeps coming up. Routine a11y passes aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff

- **Audit clean, baseline-preserving or tightening** — invoke `enumerate-changes`.
- **Audit clean, new component shipping at baseline** — invoke `enumerate-changes`.
- **Audit overlaps with component-surface change** — ensure `evolve-component-surface` is also complete.
- **Audit surfaces baseline-loosening proposal** — refuse or escalate to Aron for explicit governance authorization.
- **Audit reveals an existing a11y bug** — route through `investigate-issue`, then back here.
- **Audit surfaces scope growth** — revisit `scope-need`.
- **Audit reveals a testing-infrastructure gap** (axe-core version, Playwright a11y helpers) — `coordinate-framework-feedback` if the gap is framework-level, otherwise scope as a `test-coverage` enhancement.
