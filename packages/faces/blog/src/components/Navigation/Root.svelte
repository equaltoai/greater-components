<!--
Navigation.Root - Container component for blog navigation widgets

Provides context for ArchiveView/TagCloud/etc.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { ArchiveEntry, CategoryData, TagData } from '../../types.js';
	import { createNavigationContext } from './context.js';
	import ArchiveView from './ArchiveView.svelte';
	import TagCloud from './TagCloud.svelte';

	interface Props {
		archives?: ArchiveEntry[];
		tags?: TagData[];
		categories?: CategoryData[];
		currentPath?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		archives = [],
		tags = [],
		categories = [],
		currentPath = '',
		class: className = '',
		children,
	}: Props = $props();

	const initialArchives = untrack(() => archives);
	const initialTags = untrack(() => tags);
	const initialCategories = untrack(() => categories);
	const initialCurrentPath = untrack(() => currentPath);

	createNavigationContext(initialArchives, initialTags, initialCategories, initialCurrentPath);
</script>

<nav class={className}>
	{#if children}
		{@render children?.()}
	{:else}
		{#if tags.length > 0}
			<TagCloud />
		{/if}
		{#if archives.length > 0}
			<ArchiveView />
		{/if}
	{/if}
</nav>
