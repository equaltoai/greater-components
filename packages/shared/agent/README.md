# @equaltoai/greater-components-agent

Reusable workflow surfaces, contracts, and package-boundary metadata for agent-first product surfaces.

This package is the narrow home for:

- reusable workflow cards and rails that can appear inside multiple products
- lifecycle workflow naming and slot/state contracts
- package ownership boundaries across shared workflow modules
- rollout shape metadata that later milestones can implement without reopening package scope

It intentionally does not own full-screen app shells or route composition. That responsibility lives in `faces/agent`.

## Shared workflow surfaces

The current reusable surface exports are:

- `AgentIdentityCard`
- `AgentStateBadge`
- `SoulRequestCard`
- `SoulLifecycleRail`
- `ReviewDecisionCard`
- `DeclarationPreviewCard`
- `SignatureCheckpointCard`
- `ContinuityPanel`
- `GraduationSummaryCard`

These components are intentionally generic: they describe workflow states, approvals, continuity, and graduation without assuming a Simulacrum-specific backend contract.

## Frozen workflow phases

The reusable lifecycle is intentionally ordered as:

1. `request`
2. `review`
3. `declaration`
4. `signing`
5. `graduation`
6. `continuity`

Every slot and state is phase-prefixed so multiple consumers can safely merge data without inventing project-specific field names.

## Stitch anchor map

The current workflow anchor map is derived from the Stitch `Agent Genesis` project and currently freezes these titles as reusable surfaces:

- `Agent Genesis`
- `Nexus Dashboard`
- `Identity Nexus`
- `Notification Center: Soul Requests`
- `Direct Message: Graduation Approval`
