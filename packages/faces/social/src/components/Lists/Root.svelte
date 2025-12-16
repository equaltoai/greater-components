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
	import type { ListsHandlers, ListsState } from './context.js';
	import { onMount, untrack } from 'svelte';

	interface Props {
		/**
		 * Lists event handlers
		 */
		handlers?: ListsHandlers;

		/**
		 * Initial state (for testing)
		 */
		initialState?: Partial<ListsState>;

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

	let {
		handlers: handlersProp = {},
		initialState = {},
		autoFetch = true,
		children,
		class: className = '',
	}: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	const context = createListsContext(untrack(() => handlersProp), untrack(() => initialState));

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
