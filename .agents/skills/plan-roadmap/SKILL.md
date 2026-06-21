---
name: plan-roadmap
description: Use after enumerate-changes. Sequence the flat change list into milestones with dependencies, risks, validation gates, and the active feature → staging → main rollout. Produces a roadmap document, not code or project state.
---

# Plan a greater roadmap

Roadmaps preserve greater's invariants: API stability, pinned contract sync, WCAG 2.1 AA, registry integrity, theming contract, Mastodon-compatible behavior where feature sets overlap, AGPL posture, and the active **feature → staging → main** release model.

## Inputs

- Scoped need.
- Enumerated one-commit changes.
- Specialist-walk outputs for component API/theming, contract sync, accessibility, release, framework feedback, or advisor review.

## Sequencing rules

1. Put contract snapshot sync before adapter code that consumes it.
2. Put headless behavior/a11y foundations before visual components.
3. Put registry-generation changes with the source they enumerate.
4. Keep generated artifacts in the same milestone as their generator/source change.
5. Keep version/registry alignment explicit for release-preparation work.
6. Avoid scope growth; route new capability through `scope-need`.

## Rollout model

- **Feature branch**: branch from `origin/main`; implement bounded commits.
- **staging PR**: verify set runs (`Build and Test`, `ESLint and Prettier Check`) with DCO and package/registry/contract gates.
- **main promotion**: operator-owned PR from `staging` only; no duplicate verify rerun.
- **release**: manual signed tag off `main`; manual release workflow publishes immutable assets.

## Roadmap output

```markdown
# Roadmap: <name>

## Goal
<goal>

## Milestones
1. <milestone> — dependencies, changed paths, validation, risks.

## Validation gates
- Build and Test
- ESLint and Prettier Check
- DCO
- `pnpm validate:package`
- `pnpm validate:registry --strict`
- contract-sync checks
- a11y/e2e where applicable

## Rollout
- Feature → staging PR
- Operator staging → main promotion
- Manual tag-driven release off main if this work is released

## Risks / follow-ups
<...>
```
