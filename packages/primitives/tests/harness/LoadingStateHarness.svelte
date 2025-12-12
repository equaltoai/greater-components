<script lang="ts">
	import LoadingState from '../../src/components/LoadingState.svelte';
	import type { ComponentProps } from 'svelte';

	const { props = {} as ComponentProps<typeof LoadingState> } = $props<{
		props?: ComponentProps<typeof LoadingState>;
	}>();
</script>

<LoadingState {...props}>
	{#snippet children()}
		<div data-testid="loading-children">
			<p>Custom loading content</p>
		</div>
	{/snippet}
</LoadingState>
