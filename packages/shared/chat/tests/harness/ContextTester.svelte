<script lang="ts">
	import { getChatContext, type ChatContextValue } from '../../src/context.svelte.js';
	import { onMount } from 'svelte';

	interface Props {
		onContext: (ctx: ChatContextValue) => void;
	}

	let { onContext }: Props = $props();

	const context = getChatContext();

	onMount(() => {
		onContext(context);
	});
    
    // Watch for state changes to update the test reference if needed
    // or we can just rely on the reference being stable (state is reactive)
    $effect(() => {
       // Just to ensure reactivity is tracked if we were logging updates
    });
</script>

<div data-testid="context-tester"></div>
