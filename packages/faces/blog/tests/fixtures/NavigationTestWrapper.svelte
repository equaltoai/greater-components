<script lang="ts">
	import { Navigation } from '../../src/components/Navigation/index.js';
	import type { ArchiveEntry, TagData, CategoryData } from '../../src/types.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		archives?: ArchiveEntry[];
		tags?: TagData[];
		categories?: CategoryData[];
		currentPath?: string;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		archives = [],
		tags = [],
		categories = [],
		currentPath = '/',
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Navigation.Root {archives} {tags} {categories} {currentPath}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Navigation.Root>
