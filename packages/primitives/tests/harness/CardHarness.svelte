<script lang="ts">
	import Card from '../../src/components/Card.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		variant,
		padding,
		clickable,
		hoverable,
		class: className,
		headerContent,
		footerContent,
		childrenContent,
		onclick,
		...restProps
	}: ComponentProps<typeof Card> & {
		headerContent?: string;
		footerContent?: string;
		childrenContent?: string;
	} = $props();
</script>

{#snippet headerSnippet()}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html headerContent}
{/snippet}

{#snippet footerSnippet()}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html footerContent}
{/snippet}

<Card
	{variant}
	{padding}
	{clickable}
	{hoverable}
	class={className}
	{onclick}
	header={headerContent ? headerSnippet : undefined}
	footer={footerContent ? footerSnippet : undefined}
	{...restProps}
>
	{#if childrenContent}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html childrenContent}
	{/if}
</Card>