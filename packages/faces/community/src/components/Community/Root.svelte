<!--
Community.Root - Container component for Community compound components

Provides context for child components and handles root-level layout.

@component
@example
```svelte
<Community.Root community={communityData} config={{ showStats: true }}>
  <Community.Header />
  <Community.RulesSidebar />
</Community.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CommunityData, CommunityConfig, CommunityHandlers } from '../../types.js';
	import { createCommunityContext } from './context.js';
	import { untrack } from 'svelte';

	interface Props {
		/**
		 * Community data to display
		 */
		community: CommunityData;

		/**
		 * Configuration options
		 */
		config?: CommunityConfig;

		/**
		 * Action handlers
		 */
		handlers?: CommunityHandlers;

		/**
		 * Whether current user is subscribed
		 */
		isSubscribed?: boolean;

		/**
		 * Whether current user is a moderator
		 */
		isModerator?: boolean;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let {
		community,
		config = {},
		handlers = {},
		isSubscribed = false,
		isModerator = false,
		children,
	}: Props = $props();

	const initialCommunity = untrack(() => community);
	const initialConfig = untrack(() => config);
	const initialHandlers = untrack(() => handlers);
	const initialIsSubscribed = untrack(() => isSubscribed);
	const initialIsModerator = untrack(() => isModerator);

	// Create context for child components
	createCommunityContext(
		initialCommunity,
		initialConfig,
		initialHandlers,
		initialIsSubscribed,
		initialIsModerator
	);

	// Compute CSS classes
	const rootClass = $derived(
		['gr-community', config.compact && 'gr-community--compact', config.class]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClass} data-community-id={community.id}>
	{@render children?.()}
</div>
