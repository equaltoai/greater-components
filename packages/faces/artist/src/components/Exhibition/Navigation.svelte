<!--
Exhibition.Navigation - Navigation controls for exhibitions

Features:
- Previous/next artwork buttons
- Jump to section
- Progress indicator
- Keyboard navigation support

@component
@example
```svelte
<Exhibition.Navigation showProgress />
```
-->

<script lang="ts">
	import { getExhibitionContext, navigateNext, navigatePrevious, navigateTo } from './context.js';

	interface Props {
		/**
		 * Show progress indicator
		 */
		showProgress?: boolean;

		/**
		 * Show thumbnail navigation
		 */
		showThumbnails?: boolean;

		/**
		 * Position of navigation
		 */
		position?: 'bottom' | 'floating';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showProgress = true,
		showThumbnails = false,
		position = 'bottom',
		class: className = '',
	}: Props = $props();

	const ctx = getExhibitionContext();
	const { exhibition, navigation } = ctx;

	// Progress percentage
	const progress = $derived(((navigation.currentIndex + 1) / navigation.totalArtworks) * 100);

	// Handle previous
	function handlePrevious() {
		navigatePrevious(ctx);
	}

	// Handle next
	function handleNext() {
		navigateNext(ctx);
	}

	// Handle thumbnail click
	function handleThumbnailClick(index: number) {
		navigateTo(ctx, index);
	}
</script>

<nav
	class={`exhibition-nav exhibition-nav--${position} ${className}`}
	aria-label="Exhibition navigation"
>
	{#if showProgress}
		<div
			class="exhibition-nav__progress"
			role="progressbar"
			aria-valuenow={navigation.currentIndex + 1}
			aria-valuemin={1}
			aria-valuemax={navigation.totalArtworks}
		>
			<div class="exhibition-nav__progress-bar" style="width: {progress}%"></div>
			<span class="exhibition-nav__progress-text">
				{navigation.currentIndex + 1} of {navigation.totalArtworks}
			</span>
		</div>
	{/if}

	<div class="exhibition-nav__controls">
		<button
			type="button"
			class="exhibition-nav__button exhibition-nav__button--prev"
			onclick={handlePrevious}
			disabled={navigation.isAtStart}
			aria-label="Previous artwork"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<polyline
					points="15,18 9,12 15,6"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="exhibition-nav__button-text">Previous</span>
		</button>

		{#if showThumbnails}
			<div class="exhibition-nav__thumbnails" role="listbox" aria-label="Artwork thumbnails">
				{#each exhibition.artworks as artwork, index (artwork.id)}
					<button
						type="button"
						class="exhibition-nav__thumbnail"
						class:active={index === navigation.currentIndex}
						onclick={() => handleThumbnailClick(index)}
						role="option"
						aria-selected={index === navigation.currentIndex}
						aria-label={`Go to ${artwork.title}`}
					>
						<img src={artwork.images?.thumbnail || artwork.images?.preview} alt="" loading="lazy" />
					</button>
				{/each}
			</div>
		{/if}

		<button
			type="button"
			class="exhibition-nav__button exhibition-nav__button--next"
			onclick={handleNext}
			disabled={navigation.isAtEnd}
			aria-label="Next artwork"
		>
			<span class="exhibition-nav__button-text">Next</span>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<polyline
					points="9,18 15,12 9,6"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</nav>

<style>
	.exhibition-nav {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
	}

	.exhibition-nav--floating {
		position: fixed;
		bottom: var(--gr-spacing-scale-4);
		left: 50%;
		transform: translateX(-50%);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		z-index: 50;
	}

	.exhibition-nav__progress {
		position: relative;
		height: 4px;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-full);
		overflow: hidden;
	}

	.exhibition-nav__progress-bar {
		height: 100%;
		background: var(--gr-color-primary-500);
		transition: width 0.3s ease;
	}

	.exhibition-nav__progress-text {
		position: absolute;
		top: var(--gr-spacing-scale-2);
		left: 50%;
		transform: translateX(-50%);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
		font-variant-numeric: tabular-nums;
	}

	.exhibition-nav__controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-4);
	}

	.exhibition-nav__button {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
		transition: background 0.2s;
	}

	.exhibition-nav__button:hover:not(:disabled) {
		background: var(--gr-color-gray-600);
	}

	.exhibition-nav__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.exhibition-nav__button svg {
		width: 20px;
		height: 20px;
	}

	.exhibition-nav__thumbnails {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		overflow-x: auto;
		max-width: 400px;
		padding: var(--gr-spacing-scale-1);
	}

	.exhibition-nav__thumbnail {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 2px solid transparent;
		border-radius: var(--gr-radius-sm);
		overflow: hidden;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.exhibition-nav__thumbnail.active {
		border-color: var(--gr-color-primary-500);
	}

	.exhibition-nav__thumbnail:hover:not(.active) {
		border-color: var(--gr-color-gray-500);
	}

	.exhibition-nav__thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 640px) {
		.exhibition-nav__button-text {
			display: none;
		}

		.exhibition-nav--floating {
			left: var(--gr-spacing-scale-4);
			right: var(--gr-spacing-scale-4);
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.exhibition-nav__progress-bar,
		.exhibition-nav__button,
		.exhibition-nav__thumbnail {
			transition: none;
		}
	}
</style>
