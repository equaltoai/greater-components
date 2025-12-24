<script lang="ts">
	import Badge from '../../src/components/Badge.svelte';
	import type { ComponentProps } from 'svelte';

	interface Props {
		props?: ComponentProps<typeof Badge>;
		labelContent?: string;
		childContent?: string;
	}

	let { props = {}, labelContent, childContent }: Props = $props();
</script>

{#snippet myLabelSnippet()}
	<span data-testid="label-snippet">{labelContent}</span>
{/snippet}

{#snippet myChildren()}
	<span data-testid="child-snippet">{childContent}</span>
{/snippet}

<Badge
	{...props}
	labelSnippet={labelContent ? myLabelSnippet : undefined}
	children={childContent ? myChildren : undefined}
/>
