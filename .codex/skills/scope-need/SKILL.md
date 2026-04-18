---
name: scope-need
description: Use when a user brings a new capability, feature request, or enhancement need for greater in vague terms. Interviews conversationally and produces a scoped-need document. Applies Gate 1 (greater-mission alignment), Gate 2 (narrowest scope with API stability), Gate 3 (specialist routing).
---

# Scope a need

A need arrives fuzzy. A feature arrives sharp. This skill is the conversation that turns fuzzy into sharp, with three specific filters: greater-mission alignment, narrowest-scope discipline with API stability, and specialist-skill routing.

## Your posture

You are interviewing, not pitching. greater is a Svelte 5 Fediverse UI component library — components for Fediverse apps, accessible by default, protocol-aware via pinned adapter contracts, distributed shadcn-style via CLI. Scope is bounded.

The scoping question is three-part:

1. **Is this greater-mission work — component / primitive / headless / face / adapter / token / icon / CLI / registry / docs / playground, with accessibility + Mastodon-compat discipline — or is it scope growth outside that mission?**
2. **If it's in-mission, what is the narrowest scope that preserves component API stability, contract-sync, accessibility baseline, registry integrity, theming contract, release-flow discipline, and Mastodon-compat where feature sets overlap?**
3. **Does the change touch the component API, theming tokens, an adapter, accessibility semantics, the CLI / registry, release automation, or an advisor-dispatched brief? If yes, route to the appropriate specialist skill before enumeration.**

The default for Gate 1 for new components, accessibility improvements, adapter additions (with contract sync), theming additions, docs / playground expansions, upstream dependency bumps, and bug fixes is "yes, evaluate at Gate 2." The default for net-new capability outside the Fediverse UI component library mission is "no."

## Start with memory and the architecture

- **Read `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `docs/`** for canonical patterns.
- `memory_recent` — has this or adjacent work been scoped?
- `query_knowledge` — do Lesser / Lesser Host / FaceTheory already cover this concept?

If tools unavailable, surface and ask the user to re-auth.

## The interview

Ask, one or two at a time:

1. **Who is asking and why now?** sim / host web / external Mastodon consumer / CVE / advisor-dispatched / Aron-direct?
2. **What problem does it solve?** Current pain, not speculative.
3. **Which surface does it touch?** Component primitive / headless / face / adapter / token / icon / CLI / registry / docs / playground / release automation.
4. **Is this a new component?** If yes, identify primitive vs headless vs face suite.
5. **Is this an adapter change?** If yes, identify the upstream Lesser / Lesser Host surface and whether a contract-sync is needed.
6. **Is this an accessibility improvement?** If yes, evaluate baseline shift.
7. **Is this a token / theming change?** If yes, evaluate stability impact.
8. **Is this a CLI / registry / release-flow change?** If yes, gate through `release-components`.
9. **Does this break existing consumers?** If yes, major-version discipline; coordination with sim / host / external consumers.
10. **Does this affect Mastodon baseline?** If yes, document the drop or evaluate whether the baseline can be preserved.
11. **What does success look like?** Observable, testable.
12. **What is explicitly out of scope?**

## The three gating questions

### Gate 1: Is this greater-mission work?

Seven verdicts:

1. **Yes — new component / primitive / headless / face addition.** Accepted with `evolve-component-surface` walk.
2. **Yes — component API evolution (minor / patch).** Accepted with `evolve-component-surface` walk.
3. **Yes — adapter change (with contract sync).** Accepted with `sync-contracts` walk.
4. **Yes — accessibility improvement / tightening.** Accepted with `enforce-accessibility` walk.
5. **Yes — theming token addition / refinement.** Accepted with `evolve-component-surface` walk.
6. **Yes — CLI / registry / release automation improvement.** Accepted with `release-components` walk.
7. **Yes — docs / playground / CI / dependency maintenance.** Accepted.
8. **No — out-of-scope growth.** General-purpose form validation not Fediverse-specific, routing / state-management concerns, backend logic, payments processing beyond wallet-UX in agent face, non-Fediverse icons at scale. Produces a redirect document.

### Gate 2: What is the narrowest possible scope?

If Gate 1 passed:

Prefer:

- New optional props over breaking existing ones
- New component additions over modifying existing shape
- New headless behaviors over modifying existing
- Adapter additions that consume already-pinned contract versions
- Token additions over renaming existing
- Accessibility tightening (higher bar) over loosening
- Dependency bumps within current major versions
- CLI UX improvements that don't change the install contract

Avoid:

- Refactors "while we're in there"
- Breaking changes without major-version changeset + consumer coordination
- Adapter changes without pinned contract-sync
- Token renames (breaking theming)
- Accessibility regressions
- Registry format changes without version coordination
- Mastodon-baseline breaks

### Gate 3: Specialist routing

Specialist skills run before enumeration when the change touches:

- **Component API or theming tokens** → `evolve-component-surface`
- **Adapter + pinned contract sync** → `sync-contracts`
- **Accessibility (WCAG 2.1 AA)** → `enforce-accessibility`
- **CLI / registry / release automation** → `release-components`
- **Framework consumption (FaceTheory)** → `coordinate-framework-feedback`
- **Advisor-dispatched brief** → `review-advisor-brief`

Specialist findings feed into enumeration.

## Output: the scoped-need document

### For Gate 1 verdict "in-mission":

```markdown
# Scoped Need: <short name>

## Background

<one paragraph>

## Driver

<sim / host / lesser-UI / external consumer / CVE / advisor / Aron-direct>

## Problem

<what is broken, missing, or painful today>

## Surface affected

<primitive / headless / face / adapter / token / icon / CLI / registry / docs / playground / release-automation>

## Component(s) affected (if applicable)

<named — from primitives / headless / faces>

## Classification

<component-addition / component-api-evolution / adapter-change / accessibility / theming / cli-registry / release-automation / docs / dependency-maintenance>

## Narrowest-scope proposal

<the smallest change that addresses the need>

## What this need explicitly does not cover

<bounded scope; watch for scope-creep>

## Success criteria

<observable, testable>

## Specialist routing

- Component API / theming: <not touched / walk via evolve-component-surface>
- Adapter / contract sync: <not relevant / walk via sync-contracts>
- Accessibility: <baseline preserved / walk via enforce-accessibility>
- CLI / registry / release: <not touched / walk via release-components>
- Framework consumption: <idiomatic / signal via coordinate-framework-feedback>
- Advisor brief: <n/a / review via review-advisor-brief>

## Consumer impact

- sim: <no impact / update needed>
- host web: <no impact / update needed>
- lesser-UI: <no impact / update needed>
- External Mastodon-compat: <baseline preserved / explicit drop documented>

## Semver impact

- <major / minor / patch> — changeset impact

## Mastodon-compat posture

- <baseline preserved / intentional Lesser-first drop with documented fallback>

## AGPL posture

- <no change / confirmed AGPL-compatible>

## Open questions

<unresolved>
```

### For Gate 1 verdict "out-of-scope":

```markdown
# Redirect: <short name>

## Background

<what was asked>

## Why this doesn't belong in greater

<scope bounded to Fediverse UI component library; this is X>

## Appropriate owner

<sim / lesser / host / new repo / scoping with Aron>

## Path for the requesting user

<route to appropriate steward, defer, or new-repo scoping>

## Recommended next step

<specific handoff>
```

## Persist before handoff

Append when scoping surfaces a recurring pattern — a redirect category, a component-evolution decision, a contract-sync pattern, an accessibility finding, a Mastodon-compat boundary. Routine completions aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff

- **In-mission, component / theming** — `evolve-component-surface`.
- **In-mission, adapter / contract-sync** — `sync-contracts`.
- **In-mission, accessibility** — `enforce-accessibility`.
- **In-mission, CLI / registry / release** — `release-components`.
- **In-mission, framework-feedback** — `coordinate-framework-feedback`.
- **In-mission, none of the above** — `enumerate-changes`.
- **Advisor-dispatched** — `review-advisor-brief` already ran; authorization included.
- **Out-of-scope** — redirect is the handoff.
- **Resolved to "no change needed"** — record and stop.
- **User defers** — record and stop.
