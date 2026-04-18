---
name: investigate-issue
description: Use when a user reports a bug, regression, or unexpected behavior — a component API change that broke a consumer's build, a contract-sync mismatch, a failing accessibility test, a CLI install failure, a registry checksum mismatch, a theming contract break, a Mastodon-compat regression, a release-flow promotion failure. Runs before any fix is proposed. Produces an investigation note, not a patch.
---

# Investigate an issue

Investigation comes before implementation. greater has distinctive investigation dimensions: a shadcn-style CLI distribution that lands source in consumers, pinned contract snapshots that must align with adapter code, a three-branch release flow with release-please automation, WCAG 2.1 AA-enforcing CI gates, a theming contract via CSS custom properties, and a dual-consumer reality (Lesser-aware features + Mastodon-baseline compatibility).

## Start with memory

Call `memory_recent` first. Scan for prior investigations — component-API evolution lessons, contract-sync edge cases, accessibility-test flakiness patterns, CLI registry subtleties, release-flow lessons (backmerges, RC soak). greater is active; prior context accumulates fast.

## Capture the claim precisely

Record the user's report literally, then extract:

- **Symptom** — what was observed, verbatim where possible
- **Surface** — component primitive / headless behavior / face (social/artist/blog/community/agent) / adapter (graphql/rest/lesser-host/viem) / CLI / registry / tokens / icons / docs site / playground / release automation
- **Consumer reporting** — sim? host's web? a consumer of lesser's own UIs? an external Mastodon-compat UI?
- **Versions involved** — `greater-v<X>` consumer pins; upstream Lesser / Lesser Host versions that pinned snapshots target
- **Reproduction path** — request shape, component usage, CLI command, consumer codebase context
- **Expected vs actual** — rendered output, prop handling, accessibility tree, theming behavior, registry hash
- **Recent deploys / releases / promotions** — staging → premain → main transitions

## Ground the investigation

Your first structural questions are always:

1. **Is this a component API stability issue?** A breaking change landed without a major-version changeset, or consumer build broke after `greater update`. Route through `evolve-component-surface` for the API walk.
2. **Is this a contract-sync issue?** Adapter behavior diverges from pinned snapshot, or upstream Lesser / Lesser Host changed and snapshot didn't sync. Route through `sync-contracts`.
3. **Is this an accessibility regression?** CI a11y test failing, consumer reports keyboard / screen-reader regression, contrast ratio below AA. Route through `enforce-accessibility`.
4. **Is this a CLI / registry issue?** Install failing, checksum mismatch, `greater update` missing files, signed-tag drift. Route through `release-components`.
5. **Is this a release-flow issue?** Promotion stuck, release-please PR bad, RC tag wrong, backmerge missed. Route through `release-components`.
6. **Is this a theming contract issue?** Token rename / removal / semantic shift affecting consumers. Route through `evolve-component-surface` (which covers theming).
7. **Is this a Mastodon-compat regression?** Lesser-first feature landed in a way that broke Mastodon-baseline. Evaluate carefully.
8. **Is the symptom in greater, in a consumer (sim / host web / lesser UI), in upstream Lesser / Lesser Host, in FaceTheory, in Svelte / Vite / toolchain, or in external Fediverse server?** Many reported "greater bugs" are consumer-misuse, consumer-wrong-version, upstream-schema-drift, or Mastodon-server oddities. Confirm.

## Evidence before hypotheses

Gather before theorizing:

- `git log` since last known-good state on the affected branch (`staging` / `premain` / `main`)
- `git blame` on the specific lines
- `packages/<affected>/` source history
- `registry/index.json` and `registry/latest.json` — current state; compare to the expected state for the affected tag
- CHANGELOG.md entries for the versions involved
- CI logs for the affected PR / branch (lint, typecheck, test, a11y, build, registry regen, contract sync)
- For contract-sync: `docs/lesser/contracts/` and `docs/lesser-host/contracts/` snapshots; compare with upstream's current state
- For accessibility: Playwright a11y-test output; specific WCAG criterion affected
- For CLI / registry: checksum of files installed in consumer vs checksum in `registry/index.json`
- For release flow: release-please PR state; current tags; signed-tag integrity
- `query_knowledge` for cross-repo context (lesser / host version info, FaceTheory patterns)

If `memory_recent` or `query_knowledge` returns an auth error, stop.

## The specialist-routing question

Every investigation answers: **which specialist skill, if any, should handle this?**

- **Component API stability, theming contract** → `evolve-component-surface`
- **Contract sync (adapter ↔ pinned snapshot alignment)** → `sync-contracts`
- **Accessibility (WCAG 2.1 AA)** → `enforce-accessibility`
- **Release flow (three-branch, changesets, release-please, CLI registry, signed tags)** → `release-components`
- **Framework awkwardness** (FaceTheory, Svelte, Vite) → `coordinate-framework-feedback`
- **Advisor-originated brief** → `review-advisor-brief`
- **None** — routes through standard `scope-need` → `enumerate-changes` → `plan-roadmap` → `implement-milestone` → `release-components`

## Rank hypotheses by evidence

List theories in descending order of support:

1. **Hypothesis** — one sentence
2. **Evidence for** — commits, CI output, checksum comparison, snapshot diff, consumer stack trace
3. **Evidence against** — what would be true if this were wrong
4. **Verification step** — the cheapest test to prove or disprove

## Output: the investigation note

```markdown
## Reported symptom
<verbatim>

## Dimensions
- Surface: <primitive / headless / face / adapter / CLI / registry / tokens / icons / docs / playground / release>
- Consumer reporting: <sim / host web / lesser UI / external Mastodon-compat / other>
- Versions: <greater tag, upstream Lesser / Lesser Host versions>
- Reproduction: <...>

## Specialist elevation check
<normal / elevate to evolve-component-surface / sync-contracts / enforce-accessibility / release-components / coordinate-framework-feedback / review-advisor-brief>

## What is definitely true
<verified facts — CI output, checksum comparison, snapshot diff, consumer trace>

## Fix-locus verdict
<fix here (greater) / fix upstream (FaceTheory, Svelte, Vite) / fix in sibling (lesser, host, sim) / fix in consumer's usage / fix in release automation / no-fix (external Mastodon-server oddity)>

## Hypotheses (ranked)
1. <hypothesis> — evidence: <...>
2. <...>

## Verification step
<the one thing to run next>

## Proposed next skill
<investigate-issue again / fix directly / scope-need / evolve-component-surface / sync-contracts / enforce-accessibility / release-components / coordinate-framework-feedback / review-advisor-brief / none — cross-repo report>
```

## Persist

Append only when the investigation surfaces something worth remembering — a component-API evolution edge case, a contract-sync mismatch pattern, an accessibility-test flakiness story, a CLI-registry drift observation, a release-flow subtlety (backmerge timing, release-please PR edge case), a Mastodon-compat boundary, a framework-awkwardness worth upstreaming. Routine "typo" findings aren't memory material. Five meaningful entries beat fifty log-shaped ones.

## Handoff rules

- **Component API break-suspected** — `evolve-component-surface`.
- **Contract-sync mismatch** — `sync-contracts`.
- **Accessibility regression** — `enforce-accessibility`.
- **CLI / registry / release-flow** — `release-components`.
- **Framework awkwardness** — `coordinate-framework-feedback`.
- **Advisor brief** — `review-advisor-brief`.
- **Small, contained fix** — standard `scope-need` → `implement-milestone` → `release-components`.
- **Consumer-side issue** — document; consider defensive improvement in greater's docs or API.
- **Upstream / external issue** — report; consider whether greater needs tolerance improvements.
