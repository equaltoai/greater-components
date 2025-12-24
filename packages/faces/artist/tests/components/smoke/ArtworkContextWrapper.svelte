<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createArtworkContext,
		type ArtworkData,
	} from '../../../src/components/Artwork/context.js';
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		artwork: ArtworkData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { artwork, Component, props = {} }: Props = $props();

	createArtworkContext(untrack(() => artwork));
</script>

<Component {...props} />
