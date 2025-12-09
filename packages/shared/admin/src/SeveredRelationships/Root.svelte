<!--
Admin.SeveredRelationships.Root - Severed Relationships Container
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createSeveredRelationshipsContext, type SeveredRelationshipsConfig } from './context.js';

	interface Props {
		adapter: SeveredRelationshipsConfig['adapter'];
		config?: Partial<Omit<SeveredRelationshipsConfig, 'adapter'>>;
		children?: Snippet;
		class?: string;
	}

	let { adapter, config = {}, children, class: className = '' }: Props = $props();

	// Create context
	createSeveredRelationshipsContext(
		untrack(() => ({
			adapter,
			...config,
		}))
	);
</script>

<div class={`severed-relationships-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
