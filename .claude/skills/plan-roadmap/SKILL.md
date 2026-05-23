---
name: plan-roadmap
description: Use after enumerate-changes. Takes a flat enumerated change list and sequences it with dependencies, risks, and a three-branch release rollout plan (staging → premain → main). Produces a roadmap document, not code or project state.
---

# Plan a roadmap

A flat enumerated list answers "what changes." A roadmap answers "in what order, with what risks, through which release branches, with what coordination outside this repo." This skill is the bridge.

greater's roadmaps are shaped by: the three-branch flow (staging → premain → main), changeset-driven semver, the CLI / registry release cycle, contract-sync coordination with upstream Lesser / Lesser Host, and the consumer-coordination reality (sim, host, external consumers).

## Input required

An approved enumerated change list from `enumerate-changes`. Specialist-skill findings if applicable. Load prior context with `memory_recent`.

## Dependency analysis

For each enumerated item, identify:

- **Hard dependencies** — items that must land first to compile, pass tests, or satisfy registry regen
- **Soft dependencies** — items that should land first for review coherence
- **Sibling-repo coordination** — sim (consumer), host (consumer + contract source), lesser (contract source)
- **Upstream coordination** — when contract-sync is needed, the upstream version pinned
- **External-consumer coordination** — breaking changes require advisory / release-notes path for Mastodon-compat consumers
- **Parallelizable siblings** — items with no ordering constraint

## Phase shape

Canonical phases for greater:

1. **Dependency / infrastructure baseline** — pnpm, Svelte, Vite, TypeScript, FaceTheory, tooling bumps. Lands first.
2. **Tokens (if touched)** — design-token package updates. Lands before components that consume them.
3. **Headless behaviors (if touched)** — behavior-only primitives. Lands before components that use them.
4. **Adapters + contract sync (if touched)** — adapter code + pinned snapshot snapshots. Lands in the same commits where possible.
5. **Primitives / headless component updates** — bulk of component-API work.
6. **Faces** — domain-specific suites that depend on primitives + adapters.
7. **Shared / utils** — internal supporting packages.
8. **Apps (`playground`, `docs`)** — consumer-facing demos + docs; updates ride with component changes.
9. **CLI / registry / release automation** — release-pipeline work.
10. **Tests + coverage** — any coverage additions.
11. **Documentation** — API reference, integration guides, component inventory.
12. **Changesets + release-please PRs** — captured throughout; consolidated at release time.

Not every roadmap uses all phases. A narrow bug fix may be one phase. A new-face suite with adapters and contract sync is multi-phase.

## Release rollout discipline

Every roadmap answers: **how does this reach stable (`main`) safely via the three-branch flow?**

### Phase A: `staging`

1. **Feature branches merge to `staging`** via PR. CI gates pass (lint, typecheck, test, a11y, build, registry regen, contract-sync). Changeset attached. CODEOWNERS review.
2. **Soak in `staging`.** Observable evidence that affected components work correctly in `apps/playground/`, that adapters interoperate with pinned contract versions, that a11y tests pass reliably, that CLI regen produces expected output.
3. Multiple features may accumulate in `staging` before promotion to `premain`.

### Phase B: `premain` (RC)

4. **Promote `staging` to `premain`.** release-please RC config opens a release PR for RC tag (`greater-vX.Y.Z-rc.N`).
5. **RC tag cuts** on merge of the release-please PR. CLI asset + registry regen generate; RC tarball available.
6. **Soak in RC.** Internal consumers (sim, host web) test against the RC tag. External advisory consumers (Mastodon-compat UIs) can opt in.
7. **Iterate if regressions surface.** Fix on `staging`, promote again to `premain`, cut next RC.

### Phase C: `main` (stable)

8. **Promote `premain` to `main`.** release-please stable config opens a release PR for stable tag (`greater-vX.Y.Z`).
9. **Stable tag cuts** on merge. CLI asset + registry regen generate; GitHub Release published with `greater-components-cli.tgz` + checksums.
10. **Backmerge from `main`** into `premain` / `staging` to keep branches aligned.
11. **Post-release monitoring.** Consumer reports (sim, host, external) via issues; CLI install + upgrade reliability.

**Never set timeouts on CI jobs.** Let them run.
**Never skip `premain` soak.** Hotfix compression is possible within stages, not by skipping.
**Never re-point a published stable tag.** Hotfixes are new patch versions.

## The contract-sync release-timing consideration

Contract-sync changes have specific release timing:

- **Frequent, routine syncs** (patch-level upstream schema refreshes) land in normal flow; no special coordination.
- **Minor upstream schema additions** that enable new adapter capabilities — typically `minor` in greater; coordinate with `lesser` or `host` stewards if the upstream version isn't yet released stable.
- **Major upstream schema breaking changes** that require adapter rewrites — rare; coordinate with the upstream stewards; consider whether greater can preserve backward-compat with previous-version pins for a transition window (possible but requires design).

## Per-consumer rollout considerations

Because consumers install source via CLI:

- **sim** (internal consumer) can test RC tags directly via `greater update --ref <rc-tag>`. sim's own CI catches regressions before sim's stable release.
- **host's web/ SPA** similarly.
- **External Mastodon-compat consumers** — not directly coordinable; rely on release-notes + semver discipline + advisory posts.
- **Breaking-change releases** warrant a clear release-notes section explaining what changed, why, and migration steps. The changeset description drives this.

## Risk register

- **Known unknowns**
- **Component-API-break risks** — breaking changes that weren't declared in the changeset
- **Contract-sync mismatch risks** — adapter change ships without snapshot update
- **Accessibility regressions** — subtle contrast / focus / ARIA drops
- **Registry integrity risks** — regen drift, signed-tag compromise
- **Theming contract risks** — token rename landed silently
- **CLI install / update flow risks** — subtle consumer-side breakage
- **Mastodon-compat regression risks** — Lesser-first feature that removed baseline support
- **FaceTheory / upstream framework compat risks**
- **Consumer-sim / host-web build-break risks** — their CIs should catch, but may surface late
- **AGPL risks** — new dependencies needing license vetting
- **Release automation risks** — release-please PR edge cases, changeset parsing issues, registry regen drift

A risk with no mitigation is a blocker.

## Output format

```markdown
# Roadmap: <scoped-need name>

## Goal

<one paragraph — what the roadmap delivers and why>

## Classification

<component-addition / api-evolution / adapter-change / accessibility / theming / cli-registry / release-automation / docs / dependency-maintenance / bug-fix>

## Surfaces affected

<enumerated from change list>

## Sibling-repo coordination

- sim (primary consumer): <required / monitor for breakage>
- host web (primary consumer): <required / monitor>
- lesser (contract source): <required for sync / not relevant>
- host (contract source): <required for sync / not relevant>
- body / soul: <typically not relevant>

## Theory Cloud framework coordination

- FaceTheory: <required / not required, what>

## External-consumer coordination

- Mastodon-compat consumers: <no impact / release-notes advisory / explicit migration path>

## Phases

### Phase 1: <name>

- Items: <enumerated item numbers>
- Dependencies: <what must land first>
- Risks: <bullet list>

### Phase 2: <name>

...

## Release rollout plan

### Staging

- Feature-branch merges via PR with CI gates
- Soak criteria: <observable evidence required before promoting to premain>
- Expected duration: <...>

### Premain (RC)

- Promotion mechanism: release-please premain-variant PR
- RC tag: greater-v<version>-rc.<n>
- Soak criteria: <internal consumer testing (sim, host), RC tag pin validation>
- Expected duration: <...>

### Main (stable)

- Promotion mechanism: release-please stable PR
- Stable tag: greater-v<version>
- Release artifacts: greater-components-cli.tgz + checksums + registry regen
- Post-release monitoring plan: <consumer reports, CLI install reliability>

### Backmerge

- Main → premain → staging backmerge timing: <...>

## Changeset plan

- Impact: <major / minor / patch>
- Changeset description drafted: <...>
- Release-notes section: <breaking changes, migration steps if any>

## Rollback plan

- Consumer rollback: `greater update --ref <prior-tag>`
- CLI rollback: reinstall prior CLI tarball
- No tag re-pointing

## AGPL posture

- No proprietary blobs: <confirmed>
- Dependency license vetting: <completed if applicable>

## Advisor-brief authorization (if applicable)

- Brief source: <advisor identity, email provenance>
- Aron's authorization: <scope, date, notes>

## Open questions

<unresolved>
```

## Persist

Append when the roadmap exposes a recurring risk pattern — a contract-sync timing subtlety, a consumer-coordination lesson, a registry-regen edge case, a release-please pattern, a Mastodon-compat communication approach. Routine roadmaps aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff

- If approved, invoke `create-github-project` if the roadmap warrants tracked kanban.
- If the roadmap reveals coordination not yet happening (sibling stewards uninformed, contract-sync commit not planned, advisory not drafted), pause and surface first.
- If the roadmap reveals scope growth, revisit `scope-need`.
- If the roadmap is a security / accessibility-regression response needing compressed cadence, ensure authorization is explicit.
