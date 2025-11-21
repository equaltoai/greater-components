<!--
  Admin.Root - Admin Context Provider
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createAdminContext } from './context.js';
	import type { AdminHandlers } from './context.js';

	interface Props {
		handlers?: AdminHandlers;
		children?: Snippet;
		class?: string;
	}

	let { handlers = {}, children, class: className = '' }: Props = $props();

	createAdminContext(handlers);
</script>

<div class={`admin-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
