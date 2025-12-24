<script lang="ts">
	import {
		createCritiqueContext,
		getCritiqueContext,
		hasCritiqueContext,
		type CritiqueContext,
		type CritiqueConfig,
		type CritiqueHandlers,
	} from '../../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';
	import { onMount, type Snippet } from 'svelte';
	import type { ArtworkData } from '../../../../../../src/types/artwork.js';

	interface Props {
		artwork?: ArtworkData;
		config?: Record<string, unknown>;
		handlers?: Record<string, unknown>;
		captureContext?: (ctx: CritiqueContext | null, err?: unknown) => void;
		checkHasContext?: (exists: boolean) => void;
		children?: Snippet;
	}

	let props: Props = $props();

	if (props.checkHasContext) {
		props.checkHasContext(hasCritiqueContext());
	}

	if (props.artwork) {
		createCritiqueContext(
			props.artwork,
			props.config as CritiqueConfig,
			props.handlers as CritiqueHandlers
		);
	}

	// Check again after creation if we created it
	if (props.artwork && props.checkHasContext) {
		props.checkHasContext(hasCritiqueContext());
	}

	onMount(() => {
		if (props.captureContext) {
			try {
				props.captureContext(getCritiqueContext());
			} catch (e) {
				props.captureContext(null, e);
			}
		}
	});
</script>

{@render props.children?.()}
