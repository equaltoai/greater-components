<script lang="ts">
	import {
		createCritiqueContext,
		getCritiqueContext,
		hasCritiqueContext,
		type CritiqueContext,
		type CritiqueConfig,
		type CritiqueHandlers,
	} from '../../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';
	import { onMount, untrack, type Snippet } from 'svelte';
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

	const checkHasContext = untrack(() => props.checkHasContext);
	checkHasContext?.(hasCritiqueContext());

	const artwork = untrack(() => props.artwork);
	if (artwork) {
		createCritiqueContext(
			artwork,
			untrack(() => props.config) as CritiqueConfig,
			untrack(() => props.handlers) as CritiqueHandlers
		);
	}

	// Check again after creation if we created it
	if (artwork && checkHasContext) {
		checkHasContext(hasCritiqueContext());
	}

	const captureContext = untrack(() => props.captureContext);
	onMount(() => {
		if (!captureContext) {
			return;
		}
		try {
			captureContext(getCritiqueContext());
		} catch (e) {
			captureContext(null, e);
		}
	});
</script>

{@render props.children?.()}
