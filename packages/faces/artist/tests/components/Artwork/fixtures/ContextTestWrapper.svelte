<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createArtworkContext,
		type ArtworkConfig,
		type ArtworkHandlers,
	} from '../../../../src/components/Artwork/context.js';
	import type { ArtworkData } from '../../../../src/types/artwork.js';

	interface Props {
		artwork: ArtworkData;
		config?: ArtworkConfig;
		handlers?: ArtworkHandlers;
		children?: import('svelte').Snippet;
	}

	let props: Props = $props();

	createArtworkContext(
		untrack(() => props.artwork),
		untrack(() => props.config),
		untrack(() => props.handlers)
	);
</script>

{@render props.children?.()}
