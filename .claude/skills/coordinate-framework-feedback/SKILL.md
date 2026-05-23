---
name: coordinate-framework-feedback
description: Use when building or maintaining greater surfaces framework awkwardness — a FaceTheory SSR / SSG / ISR pattern gap (in `apps/docs/` or `apps/playground/`), a Svelte 5 rune-system limitation that affects idiomatic component authoring, a Vite / build-toolchain gap that affects registry generation. Produces a cleanly-shaped signal for the relevant steward rather than a local patch.
---

# Coordinate framework feedback

greater consumes FaceTheory for its SvelteKit-based docs site (`apps/docs/`) and local playground (`apps/playground/`). It also depends on Svelte 5 + Vite + TypeScript / pnpm toolchain — upstream open-source, not Theory Cloud. When consumption is awkward under greater's specific conditions (component-library patterns, shadcn-style CLI distribution, registry-regen workflow, strict accessibility gates), the friction is targeted upstream signal.

This skill handles the signal cleanly. It separates "greater is using the framework wrong" from "the framework has a genuine gap under greater's constraints," and produces a shaped report for the appropriate steward.

## The frameworks greater consumes

- **FaceTheory** — for SvelteKit SSR / SSG patterns in `apps/docs/` + `apps/playground/`. Steward: Theory Cloud FaceTheory steward.
- **Svelte 5 (+ runes)** — upstream open-source; not Theory Cloud. Feedback goes to the Svelte community.
- **Vite** — upstream open-source.
- **TypeScript, pnpm, Node 24+ toolchain** — upstream.

Only **FaceTheory** is a Theory Cloud framework. Signals to upstream Svelte / Vite / TypeScript are community-level; signals to FaceTheory use the Theory Cloud framework-feedback path.

## When this skill runs

Invoke when:

- A FaceTheory SSR / SSG pattern doesn't fit greater's docs-site or playground needs cleanly
- A Svelte 5 rune-system pattern produces awkward component authoring that other Svelte consumers also face
- A Vite build-toolchain pattern affects registry regeneration or CLI tarball generation
- A TypeScript workspace pattern constrains component-library authoring
- `scope-need` flags a change as framework-awkward
- `investigate-issue` surfaces a root cause in a framework

## Preconditions

- **The awkwardness is described concretely.** "FaceTheory is hard in greater" is too vague; "FaceTheory's SSG build pipeline for `apps/docs/` re-renders all component demos on every content change, causing 8-minute CI builds; the docs site doesn't need full rebuild when a non-component-demo content change lands. FaceTheory's incremental-build surface doesn't expose a hook for 'components unchanged, docs content changed → skip re-render'" is concrete.
- **The idiomatic attempt is captured.** What would the code look like if the framework supported the concern cleanly?
- **The current workaround (if any) is captured.** Cost?
- **MCP tools healthy**, `memory_recent` first.

## The three-step walk

### Step 1: Is greater using the framework wrong?

Before assuming framework limitation:

- **Idiomatic FaceTheory usage**: what does FaceTheory offer for this concern? `query_knowledge` against the FaceTheory knowledge base.
- **Alternative patterns**: different expression?
- **Recent framework versions**: pinned version may lag.

If greater's usage is bent rather than idiomatic, the fix is local: reshape greater's code. Proceed to `scope-need` for the local change.

### Step 2: Is the framework genuinely limiting under greater's constraints?

greater's constraints are distinctive:

- **Component-library authoring patterns** — Svelte 5 components with typed props, exported slot structures, event dispatchers, and token-based theming
- **shadcn-style CLI distribution** — source-install via CLI rather than npm
- **Registry regeneration** — per-file checksum manifest that must stay in sync
- **Three-branch release flow** — `staging → premain → main` with release-please
- **Strict accessibility gates** — Playwright a11y + Vitest
- **Pinned contract snapshots** — adapters depend on frozen upstream schema versions
- **SvelteKit-based docs + playground** — two SvelteKit apps consuming the library as source

If FaceTheory (or Svelte / Vite) doesn't accommodate these cleanly, the signal is targeted.

Characterize:

- **Concern, concretely** — what greater is trying to do, under which constraint
- **Ideal framework support** — what would FaceTheory / Svelte / Vite offer cleanly?
- **Current gap** — specifically what's missing
- **Workaround shape** — what greater currently does, cost

### Step 3: Shape the signal

For FaceTheory:

````markdown
## Framework-feedback signal: <short name>

### Target framework

FaceTheory

### Framework version in use

<pinned version>

### The concern (under greater's component-library + shadcn-CLI constraints)

<one-to-two sentences>

### The idiomatic code greater would write if the framework supported it

```<language>
// Code sketch
```
````

### The current workaround in greater (or "blocked")

```<language>
// Current code, comments on why awkward
```

### Cost of the workaround

- CI build time: <...>
- Code complexity: <...>
- Maintenance drag: <...>

### Scope of the gap

- greater-specific (component-library + shadcn-CLI + SvelteKit-docs stress test): <yes>
- Likely broader (other component-library consumers of FaceTheory would benefit): <yes / evaluate>

### Proposed next step

<FaceTheory steward scopes via their own scope-need; greater does not patch FaceTheory locally>

```

For Svelte / Vite / TypeScript (community-level):

- The signal shape is similar but targets the upstream community (GitHub issue on the Svelte repo, a Vite issue, a TypeScript issue) rather than a Theory Cloud framework steward.
- greater's role: author a clear bug report or RFC, reference upstream discussion if any, and track response.

## The explicit refusal to patch locally

Absolute:

- **No monkey-patches** to FaceTheory, Svelte, Vite, TypeScript in greater's tree
- **No forked copies** of FaceTheory or Svelte code
- **No "temporary" framework overrides**
- **No vendoring** framework code into greater's `packages/`

If the framework blocks critical work, escalate to Aron. Forking / patching is scope-level, not steward-level.

## The continuity discipline

Signals accumulate:

- **Record in memory** — target framework, concern, signal sent, date
- **Track response** — scoped need, feature release, decline, redirect
- **Revisit on framework version bumps** — when greater bumps FaceTheory / Svelte / Vite / TypeScript, check whether pending signals are addressed
- **Duplicate-signal discipline** — check memory before re-sending

## Refusal cases

- **"Patch FaceTheory locally; we need this to ship."** Refuse.
- **"Fork Svelte 5 to add a rune pattern we need."** Refuse; engage the Svelte community.
- **"Vendor a Vite plugin modification."** Refuse.
- **"Send a framework-feedback signal for every minor awkwardness."** Genuine gaps only.
- **"Copy a FaceTheory construct into greater and modify it."** Refuse.
- **"Framework isn't responsive; let's fork."** Escalate to Aron; forking is scope-level.

## Persist

Append every meaningful framework-feedback signal — target framework, concern, date, response if received. High-signal memory material for the framework-feedback loop.

Five meaningful entries is the right scale.

## Handoff

- **Signal shaped and sent to framework steward (via user)** — stop. Record and continue greater's local work via documented workaround.
- **Signal reveals greater is using framework wrong** — `scope-need` for local change.
- **Signal is duplicate** — don't re-send; update memory.
- **Signal reveals framework bug (not gap)** — bug report, not scoping.
- **Signal to upstream open-source Svelte / Vite / TypeScript** — community issue / RFC path, not Theory Cloud framework-feedback path.
```
