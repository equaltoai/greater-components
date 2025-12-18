<script lang="ts">
	import { useStableId } from '../src/use-stable-id.svelte.js';

	let { prefix = 'test' }: { prefix?: string } = $props();
	const id = useStableId(prefix);
</script>

<div data-testid="id-value">{id.value}</div>
