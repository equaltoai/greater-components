<script lang="ts">
	import {
		getArtworkContext,
		hasArtworkContext,
		updateImageLoadState,
		updateCurrentResolution,
	} from '../../../../src/components/Artwork/context.js';

	export const hasContext = hasArtworkContext();

	let context: ReturnType<typeof getArtworkContext> | null;
	try {
		context = getArtworkContext();
	} catch {
		context = null;
	}

	export function updateLoadState(state: 'loading' | 'loaded' | 'error') {
		if (context) updateImageLoadState(context, state);
	}

	export function updateResolution(res: 'thumbnail' | 'preview' | 'standard' | 'full') {
		if (context) updateCurrentResolution(context, res);
	}

	export function getCtx() {
		return context;
	}
</script>

<div>
	<span data-testid="has-context">{hasContext}</span>
	{#if context}
		<span data-testid="load-state">{context.imageLoadState}</span>
		<span data-testid="resolution">{context.currentResolution}</span>
		<span data-testid="config-density">{context.config.density}</span>
	{/if}
</div>
