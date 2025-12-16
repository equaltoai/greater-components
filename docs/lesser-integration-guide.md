# Lesser Integration Guide

<!-- AI Training: Canonical guide for integrating Greater Components with Lesser via GraphQL -->

This guide covers the current, supported way to integrate Greater Components with a Lesser instance using the `@equaltoai/greater-components/adapters` GraphQL client and the Social face UI.

## Prerequisites

- Node.js 20+
- Svelte 5+
- A Lesser instance with GraphQL enabled
- A user token for GraphQL requests

## Installation

### Option A: CLI (recommended)

```bash
# Initialize config + CSS injection
npx @equaltoai/greater-components-cli init --face social

# Install the Social face bundle (components + shared modules + patterns)
greater add faces/social
```

### Option B: npm (umbrella package)

```bash
pnpm add @equaltoai/greater-components
```

## CSS setup (required)

Import tokens first, then primitives, then the Social face CSS:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@equaltoai/greater-components/tokens/theme.css';
	import '@equaltoai/greater-components/primitives/style.css';
	import '@equaltoai/greater-components/faces/social/style.css';

	import { ThemeProvider } from '@equaltoai/greater-components/primitives';

	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

## Configure the Lesser GraphQL adapter

Create a single adapter instance and reuse it across your app:

```ts
// src/lib/lesser.ts
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

export const lesser = new LesserGraphQLAdapter({
	httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
	wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT, // optional (subscriptions)
	token: import.meta.env.VITE_LESSER_TOKEN,
});
```

Recommended environment variables:

```bash
# .env (DO NOT COMMIT)
VITE_LESSER_ENDPOINT=https://your-instance.social/graphql
VITE_LESSER_WS_ENDPOINT=wss://your-instance.social/graphql
VITE_LESSER_TOKEN=your-auth-token
```

## Timeline quickstart (GraphQL-backed)

`TimelineVirtualizedReactive` supports `adapter + view` and will page as you scroll.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { TimelineVirtualizedReactive } from '@equaltoai/greater-components/faces/social';
	import { lesser } from '$lib/lesser';

	const view = { type: 'home' } as const;
</script>

<TimelineVirtualizedReactive adapter={lesser} {view} estimateSize={320} />
```

### View options

The current view shape is:

```ts
type GraphQLTimelineView =
	| { type: 'home' }
	| { type: 'public' }
	| { type: 'profile'; username: string }
	| { type: 'hashtag'; hashtag: string }
	| { type: 'list'; listId: string };
```

## Rendering a status (compound API)

Use the Status compound components when you need fine-grained layout control or Lesser-specific UI.

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components/faces/social';

	// Provide a status object from your data layer.
	// The Social face components consume generic ActivityPub-shaped data.
	let status = $state<any>(null);
</script>

{#if status}
	<Status.Root {status}>
		<Status.Header />
		<Status.Content />
		<Status.Media />

		<!-- Lesser-only metadata (when present in your status data) -->
		<Status.LesserMetadata showCost showTrust showModeration showQuotes />

		<!-- Community notes UI (when present in your status data) -->
		<Status.CommunityNotes />

		<Status.Actions />
	</Status.Root>
{/if}
```

## Troubleshooting

- If the timeline is unstyled, verify you imported `tokens/theme.css`, `primitives/style.css`, and `faces/social/style.css` (in that order).
- If you see 401/403 errors, confirm the token works via a direct GraphQL `viewer` query and rotate it if needed.
- If SSR fails in SvelteKit, ensure you only access `import.meta.env` in module code that runs in the browser (or use private env vars on the server).

See `docs/troubleshooting.md` for more verified fixes.

