<script lang="ts">
	import { untrack } from 'svelte';
	import { createAdminContext } from '../src/context.svelte.js';
	import Logs from '../src/Logs.svelte';
	import type { AdminHandlers } from '../src/context.svelte.js';

	interface Props {
		handlers?: AdminHandlers;
	}

	let { handlers = {} }: Props = $props();

	createAdminContext(untrack(() => handlers));
</script>

<Logs />
