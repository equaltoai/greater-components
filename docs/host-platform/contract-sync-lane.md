# Lesser Host contract-sync lane (deferred)

> Status: **deferred** — no work scheduled.
>
> This document is the visible placeholder for the future Lesser Host
> contract-sync work that the Project 39 G2 / G3 host-platform
> components do **not** currently depend on. It exists so the Greater
> steward, host steward, and any reviewer can see at a glance which
> data-fetching / adapter work is intentionally NOT in scope yet, and
> the explicit conditions that would activate the lane.
>
> Tracked by issue #666 (G4.6) under parent #637.

## Why the lane is deferred

The Greater Host adoption track for Project 39 ships **presentational
components only**:

- `packages/shell/` — app shell + command palette (G0, G1)
- `packages/host-platform/` — fleet card, cost gauge, activity
  sparkline, provisioning timeline, release timeline, stack matrix
  (G2, G3)

Every one of these components accepts **already-shaped data** from the
consumer. Lesser-host `web/` will construct that data from its own
Lesser Host API calls; Greater is never the layer that talks to Lesser
Host directly for these dashboards.

Treating them as presentational lets the Greater release train ship
**independently** of Lesser Host's API evolution. If Lesser Host
publishes a breaking change to its provisioning / release / fleet
endpoints tomorrow, none of the G2 / G3 components break — only the
consumer's adapter layer needs to update.

This is the canonical posture for Project 39 G0–G3, and was confirmed
in the parent issue body (#636, #637) and every sub-issue's guardrails.

## Current pinned contract snapshots (informational)

The repo already pins two Lesser-side contract bundles in
`docs/lesser/contracts/` and `docs/lesser-host/contracts/`:

| Source                | Tag       | Commit                                     |
| --------------------- | --------- | ------------------------------------------ |
| Lesser GraphQL + REST | `v1.4.12` | `81e1db10f86b43be627e791f68eec0f488613b16` |
| Lesser Host REST      | `v0.4.5`  | `315eb746c7b0acfd4c0385b7dfbac85178886772` |

These are consumed by `packages/adapters/` for the Lesser-aware
Fediverse surfaces (faces / social / soul). They do **not** drive any
host-platform component in this release; they're only listed here so
the file stays useful as a single-page contract-state reference.

## Activation triggers

The deferred lane opens **only** when at least one of these explicit
conditions is met:

### 1. Host requests Greater data adapters

If `lesser-host/web/` asks Greater to ship a typed adapter for one of:

- Provisioning job status / logs (would power `ProvisioningTimeline`
  with live data)
- Release history / adoption metrics (would power `ReleaseTimeline`)
- Fleet / stack version queries (would power `StackMatrix` /
  `FleetCard`)
- Cost / usage queries (would power `CostGauge`)

…then a new issue lands here under the `adapter-change` classification
and runs through the `sync-contracts` skill workflow.

### 2. Lesser Host publishes new public contract surfaces

If Lesser Host's OpenAPI / soul-conversation schemas grow new endpoints
that `host-platform` would naturally consume, the lane MAY open even
without an explicit consumer request — at the Greater steward's
discretion, with the host steward's confirmation that the contract is
stable.

### 3. Pre-existing pinned Lesser Host snapshots become stale

If `docs/lesser-host/contracts/LESSER_HOST_REF.txt` is bumped by
unrelated work (e.g. the lesser-host steward sends a coordination
email), the registered adapter regen runs and `host-platform` is
audited for compatibility. Most snapshot bumps will be no-ops for
host-platform; the audit confirms that.

## What activating the lane looks like

When triggered, the work runs as a normal sync-contracts PR:

1. **Branch name**: `chore/sync-lesser-host-v<x.y.z>[-and-host-platform]`
   or similar.
2. **Snapshot pull**: update `docs/lesser-host/contracts/openapi.yaml` +
   `LESSER_HOST_REF.txt` to the named Host tag + commit.
3. **Adapter regen**: `pnpm generate:openapi:lesser-host` regenerates
   `packages/adapters/src/rest/generated/lesser-host-api.ts`.
4. **New host-platform adapters** (if requested): add new files under
   `packages/adapters/src/rest/` (or a new `packages/host-platform-adapters/`
   workspace if the surface justifies isolation; that's a fresh G2.1-style
   placement decision).
5. **Component wiring**: host-platform components remain presentational;
   any adapter only feeds them already-shaped data. **No component is
   modified to call adapters directly.**
6. **Tests + docs + release-note impact + registry regen + CLI registry update**:
   same parity discipline as every G0–G3 PR.
7. **Sync-contracts skill walk**: the PR description includes the
   `sync-contracts` walk output, naming the pinned Host tag explicitly.

## Anti-patterns the deferral protects against

The lane stays closed specifically to prevent these regressions:

- **Greater component shipping a hardcoded Lesser Host API path**.
  Strict-CSP-safe presentational components don't make network calls;
  ever.
- **Adapter changes without a pinned snapshot bump.** Greater's
  steward refuses adapter PRs that change `packages/adapters/` without
  a matching `docs/lesser-host/contracts/` snapshot update — see
  `AGENTS.md`'s contract-sync discipline.
- **Component API designed around a specific Host response shape.**
  G2 / G3 prop contracts are intentionally generic (
  `ProvisioningStep[]`, `ReleaseTimelineItem[]`, `StackMatrixRow[]`)
  so future Host API shape changes never force a component breaking
  change.

## Pointers

- `AGENTS.md` — contract-sync discipline + Lesser-host snapshot pin
  rules
- `.claude/skills/sync-contracts/SKILL.md` — the activation playbook
- `docs/lesser-host/contracts/` — current pinned snapshots
- `packages/adapters/src/rest/generated/lesser-host-api.ts` — current
  regenerated client
- Project 39 #637 — release-coordination parent issue
- Project 39 #666 — this lane's tracking issue

---

**Last reviewed**: 2026-05-24 (Project 39 G4.6, parent #637).
