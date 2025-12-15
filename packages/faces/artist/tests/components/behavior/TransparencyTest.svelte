<script lang="ts">
	import AIOptOutControls from '../../../src/components/Transparency/AIOptOutControls.svelte';
	import AIDisclosure from '../../../src/components/Transparency/AIDisclosure.svelte';
	import type { ComponentProps } from 'svelte';
	import type { AIOptOutStatus } from '../../../src/types/transparency.js';

	interface Props {
		component: 'AIOptOutControls' | 'AIDisclosure';
		props: Record<string, unknown>;
		handlers?: Record<string, unknown>;
	}

	let { component, props, handlers = {} }: Props = $props();
</script>

{#if component === 'AIOptOutControls'}
	<AIOptOutControls
		{...props as ComponentProps}
		onUpdate={handlers?.onUpdate as ((status: AIOptOutStatus) => void | Promise<void>) | undefined}
	/>
{:else if component === 'AIDisclosure'}
	<AIDisclosure {...props as ComponentProps} />
{/if}
