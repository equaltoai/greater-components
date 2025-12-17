<script lang="ts">
	import ContextTestWrapper from './ContextTestWrapper.svelte';
	import ContextConsumer from './ContextConsumer.svelte';
	import type { ArtworkData } from '../../../../src/types/artwork.js';

	interface ContextConsumerInstance {
		updateLoadState(state: 'loading' | 'loaded' | 'error'): void;
		updateResolution(res: 'thumbnail' | 'preview' | 'standard' | 'full'): void;
		getCtx(): unknown;
	}

	interface Props {
		artwork: ArtworkData;
		config?: Record<string, unknown>;
		testMissingContext?: boolean;
		consumer?: ContextConsumerInstance;
	}

	let { artwork, config, testMissingContext = false, consumer = $bindable() }: Props = $props();

	export function updateLoadState(state: 'loading' | 'loaded' | 'error') {
		consumer?.updateLoadState(state);
	}

	export function updateResolution(res: 'thumbnail' | 'preview' | 'standard' | 'full') {
		consumer?.updateResolution(res);
	}
	export function getContext() {
		return consumer?.getCtx();
	}
</script>

{#if testMissingContext}
	<ContextConsumer bind:this={consumer} />
{:else}
	<ContextTestWrapper {artwork} {config}>
		<ContextConsumer bind:this={consumer} />
	</ContextTestWrapper>
{/if}
