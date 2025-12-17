<script lang="ts">
	import { createCritiqueContext } from '../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';
	import type { ArtworkData } from '../../../../../src/components/Artwork/context.js';
	import type {
		CritiqueAnnotation,
		CritiqueConfig,
		CritiqueHandlers,
	} from '../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';

	interface Props {
		artwork: ArtworkData;
		config?: CritiqueConfig;
		handlers?: CritiqueHandlers;
		initialAnnotations?: CritiqueAnnotation[];
		children?: import('svelte').Snippet;
	}

	let { artwork, config = {}, handlers = {}, initialAnnotations = [], children }: Props = $props();

	// svelte-ignore state_referenced_locally
	createCritiqueContext(artwork, config, handlers, initialAnnotations);
</script>

{@render children?.()}
