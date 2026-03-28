# Agent Face Getting Started

`faces/agent` is the route-level face for agent-first products that need request intake, review, declaration, signing, graduation, and continuity screens without rebuilding those shells locally.

## Install

Package consumers can stay on the public aggregate paths:

```bash
pnpm add @equaltoai/greater-components
```

Vendored CLI installs can pull the same face into a host repo:

```bash
greater add faces/agent
greater add shared/agent
```

## Public Surfaces

The face exports five canonical screen compositions plus metadata for route selection:

```ts
import {
	AGENT_FACE_COMPOSITIONS,
	AgentGenesisWorkspace,
	GraduationApprovalThread,
	IdentityNexus,
	NexusDashboard,
	SoulRequestCenter,
	type AgentGenesisWorkspaceData,
	type GraduationApprovalThreadData,
	type IdentityNexusData,
	type NexusDashboardData,
	type SoulRequestCenterData,
} from '@equaltoai/greater-components/faces/agent';
```

Load the style layers the same way you would in a real host:

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/agent/style.css';
```

## Screen Model

The current canonical screen set is:

- `genesis-workspace`
- `soul-request-center`
- `graduation-approval-thread`
- `nexus-dashboard`
- `identity-nexus`

Use `AGENT_FACE_COMPOSITIONS` when the host wants a route switchboard, stitch metadata, or a screen picker without hardcoding the face contract:

```ts
const composition = AGENT_FACE_COMPOSITIONS.find(
	(candidate) => candidate.key === 'nexus-dashboard'
);
```

## Example Adoption Path

The repo includes two concrete adoption references:

- [`examples/agent-face-svelte`](../../../examples/agent-face-svelte/README.md) shows the standalone public-package consumption path
- [`apps/playground/src/routes/agent/+page.svelte`](../../../apps/playground/src/routes/agent/+page.svelte) embeds the same demo component in the repo playground

Validate the example locally with:

```bash
pnpm exec tsc --noEmit -p examples/agent-face-svelte/tsconfig.json
pnpm exec vite build --config examples/agent-face-svelte/vite.config.ts
pnpm --filter @equaltoai/playground build
```

## Shared Package Split

Keep the contract split between `shared/agent` and `faces/agent` intact:

- `shared/agent` owns workflow contracts, lifecycle metadata, and reusable workflow cards
- `faces/agent` owns route shells, screen presets, stitch-aligned compositions, and host-facing screen metadata

If you need host integration details beyond the basic setup, continue with [Agent Face Adoption Patterns](./integration-patterns.md) and [FaceTheory Integration](../../facetheory-integration.md).
