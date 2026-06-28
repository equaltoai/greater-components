# Lesser Integration Guide

<!-- AI Training: Canonical guide for integrating Greater Components with Lesser via GraphQL -->

This guide covers the current, supported way to integrate Greater Components with a Lesser instance using the vendored `$lib/greater/adapters` GraphQL client and the Social face UI.

## Prerequisites

- Node.js 20+
- Svelte 5+
- A Lesser instance with GraphQL enabled
- A user token for GraphQL requests

## Installation

### CLI (recommended)

```bash
# Initialize config + CSS injection
greater init --face social

# Install the Social face bundle (components + shared modules + patterns)
greater add faces/social
```

## CSS setup (required)

Import tokens first, then primitives, then the Social face CSS:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/social.css';

	import { ThemeProvider } from '$lib/greater/primitives';

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
import { LesserGraphQLAdapter } from '$lib/greater/adapters';

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
	import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';
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
	import { Status } from '$lib/components/Status';

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

## Hosted genesis helpers (Project 49)

Greater exposes display-safe helpers for Lesser's durable hosted genesis projection. They read
Lesser GraphQL state (or generated Lesser Host status envelopes in adapter tests) and do not call
Lesser Host, hold Host credentials, infer hidden Host state, or own orchestration.

```ts
import {
	canPublishHostedSoulBootstrap,
	getHostedSoulGenesisComposerState,
	getHostedSoulGenesisConversation,
	getHostedSoulBootstrapTerminalDeclarationEvidenceSummary,
	isHostedSoulBootstrapDeclarationReady,
	isHostedSoulBootstrapInProgress,
} from '$lib/greater/adapters';

const inProgress = isHostedSoulBootstrapInProgress(result, { conversationId });
const declarationReady = isHostedSoulBootstrapDeclarationReady(result, { conversationId });
const terminalEvidence = getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(result, {
	conversationId,
});
const canPublish = canPublishHostedSoulBootstrap(result, { conversationId });
const transcript = getHostedSoulGenesisConversation(result);
const composer = getHostedSoulGenesisComposerState(result);
```

Helper behavior is intentionally fail-closed:

- `created`, `in_progress`, `assistant_turn_ready`, and
  `declaration_extraction_pending` are progress states only.
- Hosted transcript/composer helpers read Lesser's `hostedGenesisConversation` and
  `availableActions` fields. `composer.canSendMessage` and `composer.canComplete` are enabled only
  when Lesser advertises `SEND_HOSTED_SOUL_GENESIS_MESSAGE` or
  `COMPLETE_HOSTED_SOUL_GENESIS`.
- `declaration_ready` enables publish only when terminal declaration evidence is bound to the
  active `hostConversationId` and Lesser's `publishGate` is explicitly open.
- `failed`, malformed data, stale conversation ids, missing hashes, and compact `publishGate`
  data without terminal evidence all return `false`.

No shared display component landed for Project 49 M4.3; Sim can render its own UI from these
helpers until a common display-only component is justified.

## Troubleshooting

- If the timeline is unstyled, verify you imported `tokens/theme.css`, `primitives/style.css`, and `faces/social/style.css` (in that order).
- If you see 401/403 errors, confirm the token works via a direct GraphQL `viewer` query and rotate it if needed.
- If SSR fails in SvelteKit, ensure you only access `import.meta.env` in module code that runs in the browser (or use private env vars on the server).

See `docs/troubleshooting.md` for more verified fixes.
