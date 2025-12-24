<script lang="ts">
	import { Publication } from '../../src/components/Publication/index.js';
	import type { PublicationData, PublicationConfig } from '../../src/types.js';
	import { createMockPublication } from '../mocks/mockPublication.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		publication?: PublicationData;
		config?: PublicationConfig;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		publication = createMockPublication('test-1'),
		config = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Publication.Root {publication} {config}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Publication.Root>
