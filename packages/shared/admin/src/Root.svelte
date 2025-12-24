<!--
  Admin.Root - Admin Context Provider
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createAdminContext } from './context.svelte.js';
	import type { AdminHandlers } from './context.svelte.js';

	interface Props {
		handlers?: AdminHandlers;
		children?: Snippet;
		class?: string;
	}

	let { handlers = {}, children, class: className = '' }: Props = $props();

	// Create context with untracked handlers to avoid reactivity capture
	const context = createAdminContext(untrack(() => handlers));

	// Keep handlers in sync if they change
	$effect(() => {
		Object.assign(context.handlers, handlers);
	});
</script>

<div class={`admin-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
