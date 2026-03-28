# Agent Face Adoption Patterns

This guide documents the supported host patterns for `faces/agent` so downstream products can adopt the canonical screen bundle instead of rebuilding the same shells locally.

For the concrete project 15 to project 9 handoff, continue with [Simulacrum Migration Checklist](./simulacrum-migration-checklist.md).

## FaceTheory Hosts

FaceTheory `v0.3.1` is the compatible baseline for the current Greater hosting path.

Use the two repo examples together:

- [`examples/facetheory-svelte`](../../../examples/facetheory-svelte/README.md) shows the host boundary for `createSvelteFace()`, Vite manifest wiring, and hydration bootstrapping
- [`examples/agent-face-svelte`](../../../examples/agent-face-svelte/README.md) shows the agent-face route composition model and demo data contract

For an agent-first FaceTheory host, keep the split like this:

- FaceTheory owns routing, document metadata, assets, cookies, CSP, and hydration payload serialization
- the Greater host route chooses a face screen from `AGENT_FACE_COMPOSITIONS`
- the product owns the data adapters that populate `AgentGenesisWorkspaceData`, `NexusDashboardData`, and the other screen payloads

That keeps the FaceTheory host reusable while still proving the `faces/agent` contract through public `@equaltoai/*` imports.

## Vendored CLI Install

The default CLI mode is `installMode: "vendored"`. For `faces/agent`, that means:

```bash
greater add faces/agent
greater add shared/agent
```

The CLI writes the face package under your configured `aliases.greater` root and shared workflow modules under your configured `aliases.components` root.

With the default aliases, the important install targets are:

- `$lib/greater/faces/agent`
- `$lib/components/agent`
- `$lib/components/soul`
- `$lib/components/notifications`
- `$lib/components/messaging`
- `$lib/components/chat`

Import the vendored face like this:

```ts
import {
	AgentGenesisWorkspace,
	NexusDashboard,
	type AgentGenesisWorkspaceData,
} from '$lib/greater/faces/agent';
import * as AgentWorkflow from '$lib/components/agent';
```

And load the vendored CSS layers in your root layout:

```ts
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/agent.css';
```

## SSR Ownership

`faces/agent` is intended to be safe to import and initial-render in SSR as long as the host supplies the data and keeps browser-only concerns outside the face package.

Recommended server/client split:

- server: fetch workflow state, declaration data, messaging summaries, continuity data, and contact preferences
- server: render the selected face screen with host-owned navigation, product actions, and route metadata
- client: hydrate theme preferences, routing listeners, browser presence sources, and any transport/session stores the host wants to enhance after first paint

Keep these host-owned instead of pushing them into the face package:

- route semantics and URL generation
- auth/session bootstrap
- browser-only activity or location tracking
- product-specific mutation flows for request approval, signing, or graduation

## Strict CSP

For strict-CSP hosts, use the primitives bootstrap helpers instead of inline style or theme mutation hacks:

```ts
import {
	createThemeBootstrapSnapshot,
	getThemeDocumentAttributes,
	preferencesStore,
} from '@equaltoai/greater-components/primitives';

const snapshot = createThemeBootstrapSnapshot({
	cookie: request.headers.get('cookie') ?? '',
	system: {
		colorScheme: 'light',
		motion: 'normal',
		highContrast: false,
	},
});

const htmlAttrs = getThemeDocumentAttributes(snapshot);

// Server: spread htmlAttrs onto the document shell.
// Client: call preferencesStore.hydrate(snapshot) before mounting the host app.
preferencesStore.hydrate(snapshot);
```

That flow keeps `data-theme`, density, motion, and related document attributes aligned across SSR and hydration without requiring CSP exceptions.

## Recommended Verification

When wiring a new host, validate the contract with the same checks this repo uses:

```bash
pnpm exec tsc --noEmit -p examples/agent-face-svelte/tsconfig.json
pnpm exec vite build --config examples/agent-face-svelte/vite.config.ts
pnpm --filter @equaltoai/playground build
pnpm test:agent-face
```
