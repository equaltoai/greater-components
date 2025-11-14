<script lang="ts">
	import Tooltip from '../../src/components/Tooltip.svelte';
	import type TooltipComponent from '../../src/components/Tooltip.svelte';
	import type { ComponentProps } from 'svelte';

	const { props = {} as ComponentProps<typeof TooltipComponent> } = $props<{
		props?: ComponentProps<typeof TooltipComponent>;
	}>();
</script>

<Tooltip {...props}>
	{#snippet children()}
		<span data-testid="tooltip-trigger">Info</span>
	{/snippet}
</Tooltip>
