<script lang="ts">
	import { createAdminContext } from '../src/context.svelte.js';
	import Federation from '../src/Federation.svelte';
	import type { AdminHandlers } from '../src/context.svelte.js';

	interface Props {
		handlers?: AdminHandlers;
	}

	let { handlers = {} }: Props = $props();

	createAdminContext(handlers);
</script>

<Federation />
