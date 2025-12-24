<script lang="ts">
	import { Community } from '../../src/components/Community/index.js';
	import type { CommunityData, CommunityConfig, CommunityHandlers } from '../../src/types.js';
	import { createMockCommunity } from '../mocks/mockCommunity.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		community?: CommunityData;
		config?: CommunityConfig;
		handlers?: CommunityHandlers;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		community = createMockCommunity('test-1'),
		config = {},
		handlers = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Community.Root {community} {config} {handlers}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Community.Root>
