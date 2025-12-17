<script lang="ts">
	import Analytics from '../src/Analytics.svelte';
	import { createAdminContext, type AdminHandlers } from '../src/context.svelte.js';
	import { untrack } from 'svelte';

	let { handlers, class: className }: { handlers: AdminHandlers; class?: string } = $props();

	createAdminContext(untrack(() => handlers));
</script>

<Analytics class={className} />
