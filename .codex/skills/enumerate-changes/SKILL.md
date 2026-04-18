---
name: enumerate-changes
description: Use after scope-need and relevant specialist skills approve work. Takes the scoped-need document and produces a flat, ordered list of discrete changes required. Each change is scoped to be a single commit.
---

# Enumerate changes

A scoped need describes _what_ is being delivered. An enumerated change list describes _what must move in the repo_. This skill is the transformation.

greater's change lists vary: a narrow bug fix might be two commits; a new component addition with docs + playground + tests is six to ten; a contract-sync with adapter updates can be larger. The single-commit rule holds regardless.

## Input required

An approved scoped-need document from `scope-need`. Specialist-skill findings (from `evolve-component-surface`, `sync-contracts`, `enforce-accessibility`, `release-components`, `coordinate-framework-feedback`, `review-advisor-brief`) if applicable. Load prior context with `memory_recent`.

## The walk

Walk the scoped need against every surface:

1. **`packages/primitives/`** — 17 styled components. Structure: `<component>/<component>.svelte`, `<component>/<component>.test.ts`, `<component>/types.ts`, `<component>/index.ts`.
2. **`packages/headless/`** — behavior-only primitives (button, modal, menu, tooltip, tabs) + behaviors (focus-trap, roving-tabindex, typeahead, popover, dismissable, live-region).
3. **`packages/tokens/`** — design tokens (CSS custom properties, palettes, theme-aware).
4. **`packages/icons/`** — 300+ SVG icons (Feather + Fediverse-specific).
5. **`packages/adapters/`** — GraphQL (Apollo), REST, Lesser Host REST, viem integrations.
6. **`packages/cli/`** — `greater` CLI (install, add, update commands).
7. **`packages/faces/`** — domain-specific suites: `social/`, `artist/`, `blog/`, `community/`, `agent/`.
8. **`packages/shared/`** — internal domain packages (messaging, notifications, admin, auth, compose, search, soul).
9. **`packages/utils/`** — utility functions.
10. **`packages/testing/`** — Vitest fixtures, Playwright helpers, a11y matchers.
11. **`packages/greater-components/`** — root barrel export.
12. **`apps/playground/`** — SvelteKit sandbox; demos.
13. **`apps/docs/`** — SvelteKit docs site.
14. **`docs/`** — API reference, guides, component inventory, CLI guide, theming guide, Lesser / Lesser Host integration guides.
15. **`docs/lesser/contracts/`** — pinned Lesser GraphQL + OpenAPI snapshots.
16. **`docs/lesser-host/contracts/`** — pinned Lesser Host soul-conversation snapshots.
17. **`registry/index.json`** — per-file checksums (generated via scripts; do not hand-edit).
18. **`registry/latest.json`** — latest-tag pointer (generated).
19. **`schema.graphql`** — aggregated Lesser / Fediverse type definitions.
20. **`scripts/`** — automation (registry generation, validation, release).
21. **`.github/workflows/`** — CI workflows (staging/premain/main promotion gates).
22. **`release-please-config.json`** — stable release configuration.
23. **`release-please-config.premain.json`** — RC release configuration.
24. **`CHANGELOG.md`** — maintained by release-please.
25. **`package.json`** / **`pnpm-lock.yaml`** — workspace root dependency management.
26. **`AGENTS.md`** / **`CONTRIBUTING.md`** / **`README.md`** — governance + contributor docs. Rarely touched; governance-level.
27. **`LICENSE`** / **`CODEOWNERS`** — rarely touched.

A change that touches none of these isn't really a change.

## The ordering rules

1. **Test-first for bug fixes.** Regression test first (fails against current code), then fix. Especially important for component-API, theming-contract, and accessibility fixes.
2. **Token changes land before component changes that consume them.** Token package depends inward.
3. **Headless behaviors land before components that use them.** Dependency direction: headless → primitives → faces.
4. **Contract snapshot updates land alongside adapter-code changes that consume them.** In the same commit where practical; at least in the same PR.
5. **Changeset file lands in the same commit as the source change it describes.** Contributors add `.changeset/*.md` declaring semver impact.
6. **Documentation rides with the behavior it describes.** Component additions update the component inventory; API changes update API reference; new adapters update integration guides.
7. **`apps/playground/` demos ride with component additions.** Interactive demo for new component lands in the same PR.
8. **`registry/index.json` regeneration is automated**; PRs regenerate via the scripts, not by hand. CI verifies.
9. **Dependency bumps land in isolated commits** for bisect clarity.
10. **CI workflow changes land in isolated commits** with clear rationale.
11. **Breaking changes require major-version changeset**; additive changes require minor; bug fixes require patch.

## The mission-scope rule

Every enumerated item must answer: **is this greater-mission work, or scope growth?**

- **In-mission**: component / primitive / headless / face / adapter / token / icon / CLI / registry / docs / playground / release automation / accessibility / Mastodon-compat / AGPL / dependency-maintenance / framework-feedback / bug-fix / test-coverage / docs.
- **Scope growth (refuse)**: general form-validation library, general-purpose routing / state-management, backend logic, non-Fediverse icons at scale, payments processing beyond agent-face wallet UX, framework patches.

If any item is scope growth, stop and revisit `scope-need`.

## The component-API-stability rule

Every enumerated item must answer: **does this touch component public API (props, slots, events, exports)?**

- **No** — default.
- **Yes — additive (new optional prop / slot / event)** — proceed; minor version.
- **Yes — semantic refinement** — evaluate; may be minor or major.
- **Yes — breaking (removed, renamed, changed semantics)** — requires major-version changeset + `evolve-component-surface` walk + consumer coordination.

## The contract-sync rule

Every enumerated item must answer: **does this touch `packages/adapters/`?**

- **No** — default.
- **Yes, consuming already-pinned contracts** — proceed; no snapshot update needed.
- **Yes, requires updated snapshot** — the `sync-contracts` walk must be complete; the snapshot update commits in the same PR as the adapter change.

## The accessibility rule

Every enumerated item must answer: **does this touch accessibility-relevant DOM, ARIA, keyboard navigation, focus management, or contrast?**

- **No** — default.
- **Yes — tightening (higher bar)** — proceed; consider adding a test to lock in the baseline.
- **Yes — preserving existing baseline** — proceed; verify tests pass.
- **Yes — loosening** — refuse unless explicitly authorized via `enforce-accessibility` walk.

## The theming-contract rule

Every enumerated item must answer: **does this touch `packages/tokens/` or token usage in components?**

- **No** — default.
- **Yes — additive (new token)** — proceed.
- **Yes — rename or semantic shift** — breaking; requires major-version changeset + `evolve-component-surface` walk.

## The registry-integrity rule

Every enumerated item must answer: **does this touch `registry/*.json` or registry-regeneration scripts?**

- **No** — default; the CI job auto-regenerates on every PR touching source.
- **Yes — automated regeneration expected** — ensure the PR reflects the regenerated state.
- **Yes — hand-editing registry JSON** — refuse.

## The single-commit rule

Each enumerated item fits in one commit:

- One logical intent
- `pnpm install` succeeds (lockfile-strict)
- `pnpm lint` passes
- `pnpm typecheck` passes (TypeScript strict)
- `pnpm test` (Vitest unit / integration, 75% coverage) passes
- `pnpm build` succeeds
- `pnpm playwright:install && pnpm test:e2e` (a11y + e2e) passes where applicable
- Registry regeneration produces no diff
- Contract-sync check passes
- Changeset file present (for source-changing PRs)
- No commit depends on a later item to compile or pass tests

## Output format

```markdown
### N. <imperative title>

- **Paths**: <files or directories touched>
- **Surface**: <primitives / headless / tokens / icons / adapters / cli / faces / shared / utils / testing / docs / apps / registry / scripts / workflows / deps>
- **Classification**: <component-addition / api-evolution / adapter-change / accessibility / theming / cli-registry / release-automation / docs / bug-fix / test-coverage / dependency-maintenance>
- **Component API impact**: <none / additive / semantic-refinement / breaking (major) — `evolve-component-surface` walk referenced>
- **Contract sync impact**: <none / consumes already-pinned / requires snapshot update — `sync-contracts` walk referenced>
- **Accessibility impact**: <none / tightening / loosening (refuse without authorization) — `enforce-accessibility` walk referenced>
- **Theming impact**: <none / additive token / rename or shift (breaking)>
- **Registry impact**: <automated regen — no hand-editing>
- **Semver impact**: <major / minor / patch — changeset file added>
- **Acceptance**: <one sentence>
- **Validation**: <`pnpm lint / typecheck / test / build`, `pnpm test:e2e`, registry regen check, changeset validate>
- **Conventional Commit subject**: `<type(scope): subject>`
- **Changeset**: `.changeset/<slug>.md` with declared impact
```

## Self-check before handing off

- [ ] Every item is in-mission
- [ ] No item breaks component API silently (breaking → major changeset)
- [ ] No adapter change without synced contract snapshot
- [ ] No accessibility regression
- [ ] No token rename or semantic shift without major-version discipline
- [ ] No hand-editing of registry JSON
- [ ] No item loosens Mastodon-compat silently
- [ ] Framework awkwardness routed to `coordinate-framework-feedback`, not patched locally
- [ ] Bug fixes follow test-first ordering
- [ ] Dependency bumps isolated
- [ ] CI workflow changes isolated
- [ ] Playground demos ride with component additions
- [ ] Docs ride with behavior changes
- [ ] Changeset file present for source-changing items
- [ ] Every item has test / build / regen validation
- [ ] No hardcoded secrets
- [ ] No AGPL-incompatible dependencies introduced
- [ ] Full list satisfies the scoped need's success criteria

## Persist

Append when enumeration surfaces something unusual — a component-dependency ordering subtlety, a contract-snapshot-sync edge case, an accessibility-test ordering consideration, a token-rollout pattern, a CI-workflow interaction. Routine enumerations aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff

Invoke `plan-roadmap` to sequence the flat list into phases and identify the three-branch release plan (staging → premain → main).
