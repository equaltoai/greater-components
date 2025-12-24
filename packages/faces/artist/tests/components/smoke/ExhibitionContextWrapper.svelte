<script lang="ts">
	import { createExhibitionContext } from '../../../src/components/Exhibition/context.js';
	import type { ExhibitionData } from '../../../src/types/curation.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		exhibition: ExhibitionData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { exhibition, Component, props = {} }: Props = $props();

	createExhibitionContext(untrack(() => exhibition));
</script>

<Component {...props} />
