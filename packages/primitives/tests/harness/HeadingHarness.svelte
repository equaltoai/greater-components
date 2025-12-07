<script lang="ts">
	import Heading from '../../src/components/Heading.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		level,
		size,
		responsiveSize,
		fluid,
		weight,
		align,
		class: className,
		textContent,
		...restProps
	}: ComponentProps<typeof Heading> & {
		textContent?: string;
	} = $props();
</script>

<Heading {level} {size} {responsiveSize} {fluid} {weight} {align} class={className} {...restProps}>
	{#if textContent}
		{textContent}
	{/if}
</Heading>
