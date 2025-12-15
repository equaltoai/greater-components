<script lang="ts">
	import { createMediaViewerContext } from '../../../src/components/MediaViewer/context.js';
	import type { ArtworkData } from '../../../src/types/artwork.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		artworks: ArtworkData[];
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { artworks, Component, props = {} }: Props = $props();

	createMediaViewerContext(untrack(() => artworks));
</script>

<Component {...props} />
