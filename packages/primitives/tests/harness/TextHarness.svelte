<script lang="ts">
	import Text from '../../src/components/Text.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		as,
		size,
		weight,
		color,
		align,
		truncate,
		lines,
		class: className,
		textContent,
		...restProps
	}: ComponentProps<typeof Text> & {
		textContent?: string;
	} = $props();
</script>

<Text
	{as}
	{size}
	{weight}
	{color}
	{align}
	{truncate}
	{lines}
	class={className}
	{...restProps}
>
	{#if textContent}
		{textContent}
	{/if}
</Text>
