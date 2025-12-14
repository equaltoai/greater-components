<!--
Exhibition.Root - Container compound component for curated exhibitions

Implements REQ-FR-005: Community Curation Features
- Guest curator programs
- Themed exhibitions (time-based showcases)
- Artist spotlights

@component
@example
```svelte
<Exhibition.Root {exhibition} layout="gallery">
  <Exhibition.Banner />
  <Exhibition.Statement />
  <Exhibition.Artists />
  <Exhibition.Gallery />
  <Exhibition.Navigation />
</Exhibition.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createExhibitionContext, type ExhibitionLayout } from './context.js';
	import type { ExhibitionData, ExhibitionHandlers } from '../../types/curation.js';

	interface Props {
		/**
		 * Exhibition data
		 */
		exhibition: ExhibitionData;

		/**
		 * Layout mode for exhibition display
		 * @default 'gallery'
		 */
		layout?: ExhibitionLayout;

		/**
		 * Event handlers
		 */
		handlers?: ExhibitionHandlers;

		/**
		 * Show curator information
		 */
		showCurator?: boolean;

		/**
		 * Show artwork count
		 */
		showArtworkCount?: boolean;

		/**
		 * Show exhibition dates
		 */
		showDates?: boolean;

		/**
		 * Show location information
		 */
		showLocation?: boolean;

		/**
		 * Enable virtual tour mode
		 */
		enableVirtualTour?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child content
		 */
		children: Snippet;
	}

	let {
		exhibition,
		layout = 'gallery',
		handlers = {},
		showCurator = true,
		showArtworkCount = true,
		showDates = true,
		showLocation = true,
		enableVirtualTour = false,
		class: className = '',
		children,
	}: Props = $props();

	// Create and set context for child components
	const config = $derived({
		showCurator,
		showArtworkCount,
		showDates,
		showLocation,
		enableVirtualTour,
	});

	const ctx = createExhibitionContext(
		() => exhibition,
		() => config,
		() => handlers,
		() => layout
	);

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (layout === 'narrative' || layout === 'timeline') {
			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					event.preventDefault();
					if (ctx.navigation.currentIndex < ctx.navigation.totalArtworks - 1) {
						ctx.navigation.currentIndex++;
					}
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					event.preventDefault();
					if (ctx.navigation.currentIndex > 0) {
						ctx.navigation.currentIndex--;
					}
					break;
				case 'Home':
					event.preventDefault();
					ctx.navigation.currentIndex = 0;
					break;
				case 'End':
					event.preventDefault();
					ctx.navigation.currentIndex = ctx.navigation.totalArtworks - 1;
					break;
			}
		}
	}

	// Computed classes
	const rootClasses = $derived(
		['exhibition', `exhibition--${layout}`, `exhibition--${exhibition.status}`, className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<svelte:window onkeydown={handleKeydown} />

<article
	class={rootClasses}
	aria-label={`Exhibition: ${exhibition.title}`}
	data-layout={layout}
	data-status={exhibition.status}
>
	<!-- Skip link for accessibility -->
	<a href="#exhibition-gallery" class="skip-link">Skip to gallery</a>

	<!-- Main exhibition content -->
	<div class="exhibition__content">
		{@render children()}
	</div>
</article>

<style>
	.exhibition {
		position: relative;
		width: 100%;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--gr-color-primary-500);
		color: white;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		z-index: 100;
		transition: top 0.2s;
	}

	.skip-link:focus {
		top: 0;
	}

	.exhibition__content {
		position: relative;
		width: 100%;
	}

	/* Layout variants */
	.exhibition--gallery .exhibition__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-8);
	}

	.exhibition--narrative .exhibition__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-12);
	}

	.exhibition--timeline .exhibition__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
	}

	/* Status indicators */
	.exhibition--upcoming::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--gr-color-warning-500);
	}

	.exhibition--current::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--gr-color-success-500);
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.skip-link {
			transition: none;
		}
	}
</style>
