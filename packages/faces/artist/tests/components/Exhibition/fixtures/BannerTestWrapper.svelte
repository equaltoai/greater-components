<script lang="ts">
	import { untrack } from 'svelte';
	import { createExhibitionContext } from '../../../../src/components/Exhibition/context.js';
	import Banner from '../../../../src/components/Exhibition/Banner.svelte';
	import type {
		ExhibitionData,
		ExhibitionConfig,
		ExhibitionHandlers,
	} from '../../../../src/types/curation.js';

	interface ContextData {
		exhibition: ExhibitionData;
		config?: ExhibitionConfig;
		handlers?: ExhibitionHandlers;
	}

	let props: { contextData: ContextData; props?: Record<string, unknown> } = $props();

	createExhibitionContext(
		untrack(() => props.contextData.exhibition),
		untrack(() => props.contextData.config),
		untrack(() => props.contextData.handlers)
	);
</script>

<Banner {...props.props} />
