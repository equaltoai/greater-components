# Agent Workflow Expansion

This document freezes the package boundaries for the Drones prerequisite milestone before M2 and M3 implementation work spreads across the repo.

## Package ownership

| Package | Direct package | Aggregate export | Owns | Must not own |
| --- | --- | --- | --- | --- |
| `shared/soul` | `@equaltoai/greater-components-soul` | `@equaltoai/greater-components/shared/soul` | reachability channels, contact preferences, best-contact guidance | request/review/graduation flow shells |
| `shared/agent` | `@equaltoai/greater-components-agent` | `@equaltoai/greater-components/shared/agent` | workflow contracts, slot naming, lifecycle metadata, reusable agent workflow building blocks | inbox delivery, chat transport, route composition |
| `shared/chat` | `@equaltoai/greater-components-chat` | `@equaltoai/greater-components/shared/chat` | assistant transcripts, tool-call views, agent-side conversation panels | request queues, signing checkpoints, notification feeds |
| `shared/notifications` | `@equaltoai/greater-components-notifications` | `@equaltoai/greater-components/shared/notifications` | ambient alerts, grouping, delivery preferences | primary editors, full workflow state |
| `shared/messaging` | `@equaltoai/greater-components-messaging` | `@equaltoai/greater-components/shared/messaging` | direct conversations, request inbox threads, handoff messaging | lifecycle schema ownership, route shells |
| `faces/agent` | `@equaltoai/greater-components-agent-face` | `@equaltoai/greater-components/faces/agent` | page shells, screen presets, route-level composition boundaries | canonical workflow naming, reachability primitives, transport details |

## Naming freeze

`shared/agent` and `faces/agent` intentionally use different direct package names:

- `@equaltoai/greater-components-agent` for reusable workflow contracts and shared metadata
- `@equaltoai/greater-components-agent-face` for face-level composition surfaces

That split avoids a direct-package collision while preserving the aggregate export paths we want consumers to use inside `@equaltoai/greater-components`.

## Stitch anchors frozen in this milestone

The current Stitch `Agent Genesis` project provides the initial face anchor set:

- `Agent Genesis`
- `Nexus Dashboard`
- `Identity Nexus`
- `Notification Center: Soul Requests`
- `Direct Message: Graduation Approval`

These anchors establish the face-level shell categories we want to preserve while the shared packages stay reusable.

## Implementation shape

The milestone leaves a concrete handoff for later work:

- `M2`: implement reusable request/review/declaration/signing/graduation/continuity families inside `shared/agent`, while composing with `shared/soul`, `shared/chat`, `shared/notifications`, and `shared/messaging`.
- `M3`: assemble those reusable families into route-level workspaces and checkpoints inside `faces/agent` without leaking Simulacrum-only assumptions back into shared packages.

The canonical metadata lives in [`packages/shared/agent/src/boundaries.ts`](../packages/shared/agent/src/boundaries.ts) and [`packages/faces/agent/src/index.ts`](../packages/faces/agent/src/index.ts).
