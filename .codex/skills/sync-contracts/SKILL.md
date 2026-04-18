---
name: sync-contracts
description: Use when a change touches `packages/adapters/` or when upstream Lesser / Lesser Host publishes a new schema version that greater should incorporate. Walks the pinned-snapshot + adapter-code alignment discipline. Adapter changes without corresponding contract-sync are release blockers.
---

# Sync contracts

greater's `packages/adapters/` wire UI components to specific versions of Lesser's GraphQL schema, Lesser's OpenAPI, and Lesser Host's soul-conversation schemas. Those versions are **pinned** in:

- `docs/lesser/contracts/` — Lesser GraphQL + OpenAPI snapshots
- `docs/lesser-host/contracts/` — Lesser Host soul-conversation snapshots

Every release ships adapters targeting an exact pinned version. Adapter changes without corresponding snapshot updates are **release blockers** — the CI gate catches them, and the steward refuses them on principle.

This skill walks contract-sync changes: either syncing to a new upstream release, or adapting to a previously-pinned contract in a new way.

## The contract-sync surface (memorize)

- **`docs/lesser/contracts/`** — pinned Lesser snapshots (GraphQL schema doc, OpenAPI spec, ActivityPub notes)
- **`docs/lesser-host/contracts/`** — pinned Lesser Host snapshots (soul-conversation schemas)
- **`packages/adapters/`** — adapter code consuming the snapshots
  - `adapters/lesser/` — Lesser GraphQL (Apollo) + REST client
  - `adapters/lesser-host/` — Lesser Host REST client
  - `adapters/viem/` — viem / wallet integration
  - Other adapters as they exist
- **`schema.graphql`** — aggregated Lesser / Fediverse type definitions (may be generated from snapshots or manually curated)
- **`codegen.ts`** — GraphQL codegen configuration (may generate TypeScript types from pinned snapshots)
- **Branch pattern (observed)**: `chore/sync-lesser-contracts-v1.1.0`, `chore/sync-lesser-graphql-v1.1.28`, `chore/sync-lesser-host-v0.1.7-and-deps`, `chore/sync-lesser-v1.1.25-lesser-host-v0.1.3` — frequent branch category

## When this skill runs

Invoke when:

- Upstream Lesser publishes a new GraphQL schema or OpenAPI version and greater should incorporate it
- Upstream Lesser Host publishes a new soul-conversation schema version
- A change to `packages/adapters/` is being proposed (regardless of whether it's triggered by upstream)
- A consumer reports an adapter-behavior mismatch that traces to snapshot drift
- `scope-need` flags a change as adapter-touching
- `investigate-issue` surfaces a contract-sync-related issue

## Preconditions

- **The sync target is identified.** Which upstream version? Lesser v1.1.28? Lesser Host v0.1.7? Both? A specific adapter-side change that requires (or doesn't require) snapshot updates?
- **MCP tools healthy**, `memory_recent` first — contract-sync decisions accumulate over releases.
- **Current pinned versions known** — look at the most-recent commit touching `docs/lesser/contracts/` or `docs/lesser-host/contracts/` to see current pins.

## The five-step walk

### Step 1: Identify the sync target

Concrete scenarios:

- **Upstream release → pull snapshot**: Lesser or Lesser Host has published a new release. Pull the updated schema into `docs/<repo>/contracts/`. This is a snapshot-only change if no adapter-code changes needed (e.g. purely additive schema change consumed by existing adapters idiomatically).
- **Upstream release + adapter-code update**: Upstream release has new capabilities greater wants to expose via components. Update snapshot + adapter code together.
- **Adapter-code change against existing pin**: Change to adapter logic that doesn't require a new upstream version (e.g. fixing a client-side bug, adding an adapter option). No snapshot update; existing pin remains.
- **Adapter rewrite due to upstream breaking change**: Major-version upstream change (e.g. Lesser GraphQL schema v2). Coordinated: update snapshot + rewrite adapter + update components that consume + `evolve-component-surface` walk for component impact.

### Step 2: Classify the change type

- **Snapshot-only sync** (no adapter change) — typically `patch` or `minor` depending on whether downstream components can consume new capabilities idiomatically via existing adapter APIs.
- **Snapshot + adapter minor addition** — new adapter function / query / mutation exposing new upstream capability. `minor` in greater.
- **Snapshot + adapter refactor** — existing adapter code changes shape. May be `patch` (internal) or `minor` (new capability surfaced) or `major` (breaking adapter API).
- **Snapshot + adapter breaking change** — adapter API changes shape in a way consumers observe. `major` + `evolve-component-surface` walk.

### Step 3: Prepare the snapshot update

For each pinned-version update:

- **Fetch the upstream snapshot**: GraphQL schema doc from Lesser's `docs/contracts/graphql-schema.graphql` (or equivalent) at the target version; OpenAPI spec from `docs/contracts/openapi.yaml`; Lesser Host soul-conversation schemas from Lesser Host's equivalent location.
- **Replace the pinned file** in `docs/lesser/contracts/` or `docs/lesser-host/contracts/`.
- **Record the upstream version** in the commit body or in a version-marker file.
- **Regenerate downstream artifacts** if any — `schema.graphql` aggregate, GraphQL-codegen-generated TypeScript types (via `codegen.ts`).

### Step 4: Update adapter code (if applicable)

- **Identify the adapter-code paths** affected by the snapshot change.
- **Update code** to consume new upstream surfaces, handle new optional fields, adapt to removed fields (if any), etc.
- **Preserve existing adapter API surface** where possible — consumers use adapter functions, not the underlying GraphQL directly, so backward-compatible adapter-API changes are preferable.
- **For breaking adapter API changes**: coordinate with `evolve-component-surface` because components consuming the adapter are affected.

### Step 5: Verify the end-to-end alignment

- **TypeScript types** generated from the snapshot compile.
- **Tests** pass — adapter unit tests, integration tests that mock the upstream response shape.
- **Playground demos** — if any demo uses the affected adapter, it continues to work.
- **Consumer CI** (sim, host web) — if the change is a minor or patch, their CI should absorb after the next `greater update`. For major, their migration is explicit.

## The audit output

```markdown
## Contract-sync audit: <change name>

### Sync target
- Upstream repo: <lesser / lesser-host>
- Upstream version: <v1.1.28 / v0.1.7 / etc.>
- Change type: <snapshot-only / snapshot + adapter-minor / snapshot + adapter-major / adapter-only (no snapshot change)>

### Current pinned versions
- Lesser: <v1.1.25 (or whatever current)>
- Lesser Host: <v0.1.3 (or whatever current)>

### Snapshot changes
- `docs/lesser/contracts/graphql-schema.graphql`: <updated from v1.1.25 to v1.1.28 / unchanged>
- `docs/lesser/contracts/openapi.yaml`: <...>
- `docs/lesser-host/contracts/*`: <...>
- `schema.graphql` regeneration: <yes / no>
- `codegen.ts` regeneration: <yes / no>

### Adapter-code changes
- Affected adapter path(s): <adapters/lesser/, adapters/lesser-host/, adapters/viem/, other>
- New capabilities exposed: <...>
- Existing behaviors preserved: <confirmed>
- Adapter API change: <none (internal-only) / additive (minor) / breaking (major — coordinate with evolve-component-surface)>

### Component-surface impact
- Components consuming affected adapter: <enumerated>
- Component API changes needed: <none / documented via evolve-component-surface>

### Semver impact
<patch / minor / major>

### Changeset declaration
`.changeset/<slug>.md`:
```
---
"@equaltoai/greater-components-adapters": <impact>
---

<description of upstream sync + adapter change>
```

### Consumer-impact analysis
- sim: <...>
- host web: <...>
- lesser UIs: <...>
- external Mastodon-compat (for adapters with Mastodon fallback): <baseline preserved / explicit drop>

### Test coverage
- Adapter unit tests against new snapshot: <added / existing>
- Integration tests: <added / existing>
- Playground demos verified: <confirmed>

### Upstream-steward coordination
- `lesser` steward aware of snapshot pull: <not required — upstream already released / required (pre-release coordination)>
- `host` steward aware: <...>

### Proposed next skill
<enumerate-changes if audit clean; evolve-component-surface if breaking adapter API change; scope-need if audit surfaces scope growth; investigate-issue if audit reveals existing bug>
```

## Refusal cases

- **"Ship the adapter change without updating the pinned snapshot; the upstream change is minor."** Refuse. Pinning is the gate; CI catches it anyway.
- **"Pin to an unreleased Lesser commit for a feature we need."** Refuse. Pin to released versions only; pre-release coordination can happen but doesn't relax the release-version gate.
- **"Skip the schema snapshot update; the change is internal-only."** If the change is truly internal, no snapshot update is needed — but the adapter change should reference the existing pin in its commit body to make the alignment auditable.
- **"Pin multiple conflicting Lesser versions in the same release."** Refuse. One pin per release.
- **"Hand-edit the pinned snapshot to add a field we want."** Refuse. Snapshots mirror upstream exactly; fabricating is not allowed.
- **"Let the pinned snapshot drift from upstream for one release; we'll sync later."** Refuse. Drift creates silent adapter incompatibilities.
- **"Skip regenerating `codegen.ts` TypeScript types; they don't affect runtime."** Evaluate. Generated types affect consumer type-safety; regeneration is standard.
- **"Rewrite the adapter to not use the pinned snapshot at all for performance."** Evaluate carefully. The snapshot is the source of truth for the contract; adapters that bypass it silently can drift.

## Persist

Append every meaningful contract-sync event — upstream version bump, adapter-API evolution, codegen-config change, upstream-breaking-change migration. These are high-signal memory material because sync events are the protocol-side record of greater's relationship with upstream. Include: upstream repo, version pulled, date, nature of adapter changes.

Five meaningful entries is a floor for contract-sync work.

## Handoff

- **Audit clean, snapshot-only sync** — invoke `enumerate-changes` (small; may be one or two commits).
- **Audit clean, snapshot + adapter-minor** — invoke `enumerate-changes`.
- **Audit clean, snapshot + adapter-major** — invoke `evolve-component-surface` for the adapter-API break; coordinate consumer migration; then `enumerate-changes`.
- **Audit surfaces upstream-coordination need** (pre-release Lesser / Lesser Host coordination) — pause; coordinate via the upstream steward through the user before proceeding.
- **Audit surfaces scope growth** — revisit `scope-need`.
- **Audit reveals an existing contract-sync bug** (drift in current state, unpinned adapter surface) — route through `investigate-issue`, then back here.
- **Audit surfaces framework awkwardness** (e.g. GraphQL codegen tooling gap) — `coordinate-framework-feedback`.
