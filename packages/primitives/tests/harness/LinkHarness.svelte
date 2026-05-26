<script lang="ts">
	import Link from '../../src/components/Link.svelte';
	import type LinkComponent from '../../src/components/Link.svelte';
	import type { ComponentProps } from 'svelte';

	const { props = {} as ComponentProps<typeof LinkComponent>, label = 'Navigate' } = $props<{
		props?: ComponentProps<typeof LinkComponent>;
		label?: string;
	}>();
</script>

<Link {...props}>
	{#snippet children()}
		{label}
	{/snippet}
</Link>
