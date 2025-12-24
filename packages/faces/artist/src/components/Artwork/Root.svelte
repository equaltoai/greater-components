<!--
Artwork.Root - Container component for Artwork compound components

Provides context for child components and handles root-level layout.
Implements REQ-PHIL-001: UI chrome recedes to let artwork breathe.

@component
@example
```svelte
<Artwork.Root artwork={artworkData} config={{ density: 'comfortable' }}>
  <Artwork.Image />
  <Artwork.Title />
  <Artwork.Attribution />
</Artwork.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArtworkData, ArtworkConfig, ArtworkHandlers } from './context.js';
	import { createArtworkContext } from './context.js';
	import { untrack } from 'svelte';

	interface Props {
		/**
		 * Artwork data to display
		 */
		artwork: ArtworkData;

		/**
		 * Configuration options
		 */
		config?: ArtworkConfig;

		/**
		 * Action handlers
		 */
		handlers?: ArtworkHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { artwork, config = {}, handlers = {}, children }: Props = $props();

	// Capture initial values to avoid context recreation on prop changes
	const initialArtwork = untrack(() => artwork);
	const initialConfig = untrack(() => config);
	const initialHandlers = untrack(() => handlers);

	// Create context for child components
	createArtworkContext(initialArtwork, initialConfig, initialHandlers);

	// Compute CSS classes based on config
	// REQ-PHIL-001: UI chrome recedes - minimal styling on container
	const rootClass = $derived(
		[
			'gr-artist-artwork',
			config.density === 'compact' && 'gr-artist-artwork--compact',
			config.density === 'spacious' && 'gr-artist-artwork--spacious',
			config.displayMode && `gr-artist-artwork--${config.displayMode}`,
			config.class,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<article
	class={rootClass}
	data-artwork-id={artwork.id}
	aria-label={`Artwork: ${artwork.title} by ${artwork.artist.name}`}
>
	{@render children?.()}
</article>

<style>
	.gr-artist-artwork {
		/* REQ-PHIL-001: Minimal chrome, let artwork breathe */
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--gr-artist-bg-primary, var(--gr-color-gray-950));
		border-radius: var(--gr-radii-md);
		overflow: hidden;
		transition: var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork--compact {
		gap: var(--gr-spacing-scale-2);
	}

	.gr-artist-artwork--comfortable {
		gap: var(--gr-spacing-scale-4);
	}

	.gr-artist-artwork--spacious {
		gap: var(--gr-spacing-scale-6);
	}

	.gr-artist-artwork--card {
		box-shadow: var(--gr-shadow-sm);
	}

	.gr-artist-artwork--detail {
		max-width: 100%;
	}

	.gr-artist-artwork--immersive {
		background: var(--gr-artist-bg-immersive, #000000);
	}

	/* REQ-PHIL-001: Interaction elements subtle until hover/focus */
	.gr-artist-artwork:hover,
	.gr-artist-artwork:focus-within {
		box-shadow: var(--gr-shadow-md);
	}

	/* Reduced motion support - REQ-A11Y-007 */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork {
			transition: none;
		}
	}
</style>
