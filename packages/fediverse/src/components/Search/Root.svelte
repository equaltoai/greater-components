<!--
  Search.Root - Search Context Provider
  
  Provides search context to all child search components.
  Manages shared state and handlers for the search flow.
  
  @component
  @example
  ```svelte
  <Search.Root {handlers} initialQuery="fediverse">
    <Search.Bar />
    <Search.Filters />
    <Search.Results />
  </Search.Root>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createSearchContext } from './context.js';
	import type { SearchHandlers } from './context.js';

	interface Props {
		/**
		 * Search event handlers
		 */
		handlers?: SearchHandlers;

		/**
		 * Initial search query
		 */
		initialQuery?: string;

		/**
		 * Child components
		 */
		children?: Snippet;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { handlers = {}, initialQuery = '', children, class: className = '' }: Props = $props();

	// Create search context
	const context = createSearchContext(handlers, initialQuery);

	// Auto-search if initial query provided
	$effect(() => {
		if (initialQuery && initialQuery.trim()) {
			context.search(initialQuery);
		}
	});
</script>

<div class="search-root {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.search-root {
		width: 100%;
		max-width: 100%;
	}
</style>
