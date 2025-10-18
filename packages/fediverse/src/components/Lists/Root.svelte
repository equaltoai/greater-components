<!--
  Lists.Root - Lists Context Provider
  
  Provides lists context to all child list components.
  Manages shared state and handlers for lists, members, and editor.
  
  @component
  @example
  ```svelte
  <Lists.Root {handlers}>
    <Lists.Manager />
    <Lists.Editor />
  </Lists.Root>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createListsContext } from './context.js';
	import type { ListsHandlers } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		/**
		 * Lists event handlers
		 */
		handlers?: ListsHandlers;

		/**
		 * Auto-fetch lists on mount
		 * @default true
		 */
		autoFetch?: boolean;

		/**
		 * Child components
		 */
		children?: Snippet;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { handlers = {}, autoFetch = true, children, class: className = '' }: Props = $props();

	// Create lists context
	const context = createListsContext(handlers);

	// Auto-fetch on mount
	onMount(() => {
		if (autoFetch) {
			context.fetchLists();
		}
	});
</script>

<div class={`lists-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.lists-root {
		width: 100%;
		max-width: 100%;
	}
</style>
