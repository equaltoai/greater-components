<script lang="ts">
	import { onMount } from 'svelte';
	import Root from '../../src/Root.svelte';
	import type { MessagesHandlers } from '../../src/context.svelte.js';

	interface Props {
		nextHandlers?: MessagesHandlers;
		delay?: number;
		autoFetch?: boolean;
	}

	let { nextHandlers = {}, delay = 0, autoFetch = true }: Props = $props();

	let handlers = $state<MessagesHandlers>({});

	onMount(() => {
		const timer = setTimeout(() => {
			handlers = nextHandlers;
		}, delay);

		return () => clearTimeout(timer);
	});
</script>

<Root {handlers} {autoFetch} />
