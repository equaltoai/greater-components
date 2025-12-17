<script lang="ts">
	import TextField from '../../src/components/TextField.svelte';
	let { prefixContent, suffixContent, ...props } = $props();
</script>

<TextField {...props}>
	{#snippet prefix()}
		{#if prefixContent}
			<span>{prefixContent}</span>
		{/if}
	{/snippet}
	{#snippet suffix()}
		{#if suffixContent}
			<span>{suffixContent}</span>
		{/if}
	{/snippet}
</TextField>
