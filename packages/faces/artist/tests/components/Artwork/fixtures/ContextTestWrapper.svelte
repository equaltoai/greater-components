<script lang="ts">
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

	createArtworkContext(props.artwork, props.config, props.handlers);
</script>

{@render props.children?.()}
