<script lang="ts">
	import { untrack } from 'svelte';
	import { useStableId } from '../src/use-stable-id.svelte.js';

	let { prefix = 'test' }: { prefix?: string } = $props();
	const id = useStableId(untrack(() => prefix));
</script>

<div data-testid="id-value">{id.value}</div>
