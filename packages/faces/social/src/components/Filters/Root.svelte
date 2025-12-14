<!--
  Filters.Root - Context Provider
  
  Provides filters context for all child components.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createFiltersContext, type FiltersHandlers, type FiltersState } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		/**
		 * Event handlers for filter operations
		 */
		handlers?: FiltersHandlers;

		/**
		 * Initial state (for testing)
		 */
		initialState?: Partial<FiltersState>;

		/**
		 * Whether to auto-fetch filters on mount
		 */
		autoFetch?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let {
		handlers = {},
		initialState = {},
		autoFetch = true,
		class: className = '',
		children,
	}: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	const context = createFiltersContext(handlers, initialState);

	onMount(() => {
		if (autoFetch) {
			context.fetchFilters();
		}
	});
</script>

<div class={`filters-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
