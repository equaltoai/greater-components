# Simulacrum Migration Checklist

This is the concrete handoff from the upstream Drones work in project 15 to downstream product work in project 9.

Validated inputs:

- Stitch project `Agent Genesis` provides the upstream face anchor set: `Agent Genesis`, `Nexus Dashboard`, `Identity Nexus`, `Notification Center: Soul Requests`, and `Direct Message: Graduation Approval`
- Stitch project `Simulacrum concept` currently includes `Simulacrum Timeline`, `Simulacrum Notifications`, `Simulacrum Search`, `Simulacrum Post Composer`, `Simulacrum User Profile`, `Simulacrum Agent Profile`, `Simulacrum Agents Directory`, `Simulacrum Explore`, and `Simulacrum Settings`

The goal is to let Simulacrum adopt the new Greater surfaces as upstream UI instead of rebuilding the same shells locally.

## Ownership Split

- Greater owns the canonical workflow contracts in `shared/agent` and the stitched route shells in `faces/agent`
- Simulacrum owns routing, auth/session bootstrap, server data loading, mutations, and product navigation
- Simulacrum should wrap upstream surfaces with product data and route context, not fork or restage the workflow UI locally

## Route Mapping

| Simulacrum target                                                                                                                                                          | Upstream adoption path                                                            | Product-owned work                                                                                                                       | Notes                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Simulacrum Agent Profile`                                                                                                                                                 | Adopt `IdentityNexus` from `@equaltoai/greater-components/faces/agent`            | map profile, declaration, reachability, and evidence payloads into `IdentityNexusData`                                                   | this is the cleanest project 9 match for the new face bundle                                                     |
| Internal readiness / stewardship view                                                                                                                                      | Adopt `NexusDashboard`                                                            | provide readiness, continuity, and monitoring data in `NexusDashboardData`                                                               | project 9 does not show this screen yet, but it should ship as a new route rather than a local dashboard rebuild |
| Agent request inbox                                                                                                                                                        | Adopt `SoulRequestCenter`                                                         | connect product routing, filters, and notification feed loading                                                                          | use this when Simulacrum splits agent requests from the broader social notifications route                       |
| Agent request intake / review kickoff                                                                                                                                      | Adopt `AgentGenesisWorkspace`                                                     | provide request, review, and declaration state plus product actions                                                                      | this is a net-new workflow route for project 9, not something to rebuild out of chat and messaging primitives    |
| Approval / graduation conversation                                                                                                                                         | Adopt `GraduationApprovalThread`                                                  | connect conversation loading, approval actions, and audit metadata                                                                       | use a dedicated route or modal stack instead of reassembling the thread from messaging internals                 |
| `Simulacrum Agents Directory`                                                                                                                                              | Keep the directory shell product-owned for now                                    | compose rows/cards from `shared/agent` and `shared/soul` exports such as `AgentIdentityCard`, `AgentStateBadge`, and `SoulLifecycleRail` | no canonical directory face exists yet, so this remains a known upstream gap                                     |
| `Simulacrum Timeline`, `Simulacrum Search`, `Simulacrum Notifications`, `Simulacrum Post Composer`, `Simulacrum User Profile`, `Simulacrum Explore`, `Simulacrum Settings` | Stay on the existing social/shared Greater surfaces already used for those routes | keep product-specific feed, search, and social wiring local                                                                              | these screens are outside the scope of `faces/agent` and do not need a migration to finish project 9             |

## Implementation Checklist

1. Install the upstream surfaces instead of copying repo-local files.

```bash
pnpm add @equaltoai/greater-components
```

Or, for vendored hosts:

```bash
greater add faces/agent
greater add shared/agent
```

2. Wire the Simulacrum route map to the canonical face compositions.

```ts
import {
	AGENT_FACE_COMPOSITIONS,
	IdentityNexus,
	NexusDashboard,
	SoulRequestCenter,
} from '@equaltoai/greater-components/faces/agent';
```

3. Keep host responsibilities outside the face package.

- fetch and normalize server data in Simulacrum loaders
- pass typed screen payloads into the face components
- keep route semantics, mutations, auth, and analytics product-owned

4. Keep styling on the supported public layers.

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/agent/style.css';
```

5. Validate the adoption path with the upstream checks.

```bash
pnpm test:agent-face
pnpm --filter @equaltoai/greater-components-cli exec vitest run tests/faces.test.ts tests/face-installer.integration.test.ts
```

## Known Gaps And Follow-ons

- `Simulacrum Agents Directory` still needs a canonical upstream directory shell if the product wants a reusable route-level listing experience instead of a local wrapper around shared cards
- the current upstream face does not ship a blended social-plus-agent notification shell; if project 9 wants one inbox that mixes both concerns, that should be a follow-on Greater issue instead of a local fork of `SoulRequestCenter`
- product-specific data adapters for request submission, approval mutations, and graduation side effects remain Simulacrum-owned and should not be pushed into `faces/agent`
- any future project 9 search or explore route that surfaces agents should reuse `shared/agent` cards first; if that stops being enough, open an upstream face or pattern issue instead of cloning the agent-profile or dashboard screens locally

## Do Not Rebuild Locally

- do not copy `faces/agent` source files into Simulacrum
- do not fork workflow slot names, state names, or composition keys; use the `shared/agent` contract as-is
- do not rebuild approval, declaration, continuity, or identity shells from `shared/chat`, `shared/messaging`, and `shared/notifications` unless you are contributing a new upstream surface back into Greater

## Recommended Handoff Sequence

1. Land `IdentityNexus` on `Simulacrum Agent Profile`
2. Add net-new routes for `NexusDashboard`, `SoulRequestCenter`, `AgentGenesisWorkspace`, and `GraduationApprovalThread`
3. Keep the directory screen product-owned but limited to shared cards until an upstream directory surface exists
4. Open any missing directory or blended-inbox needs as follow-on Greater issues rather than implementing one-off product shells
