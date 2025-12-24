<!--
ArtistProfile.HeroBanner - Signature artwork banner component

Features:
- Full-width hero image
- Rotating artwork showcase (optional)
- Parallax scrolling (respects reduced motion)
- Overlay gradient for text readability

@component
@example
```svelte
<ArtistProfile.HeroBanner />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';

	interface Props {
		/**
		 * Banner height
		 */
		height?: 'sm' | 'md' | 'lg' | 'full';

		/**
		 * Enable rotating artworks
		 */
		rotating?: boolean;

		/**
		 * Rotation interval in milliseconds
		 */
		rotationInterval?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		height = 'md',
		rotating = false,
		rotationInterval = 5000,
		class: className = '',
	}: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist, config } = ctx;

	// Current artwork index for rotation
	let currentIndex = $state(0);
	let isTransitioning = $state(false);

	// Check for reduced motion preference
	let prefersReducedMotion = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			prefersReducedMotion = mediaQuery.matches;
		}
	});

	// Parallax scroll effect
	let scrollY = $state(0);
	let parallaxOffset = $derived(config.enableParallax && !prefersReducedMotion ? scrollY * 0.3 : 0);

	$effect(() => {
		if (typeof window === 'undefined' || !config.enableParallax || prefersReducedMotion) return;

		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Artwork rotation
	$effect(() => {
		if (!rotating || !artist.heroArtworks?.length || prefersReducedMotion) return;

		const interval = setInterval(() => {
			isTransitioning = true;
			setTimeout(() => {
				currentIndex = (currentIndex + 1) % artist.heroArtworks!.length;
				isTransitioning = false;
			}, 300);
		}, rotationInterval);

		return () => clearInterval(interval);
	});

	// Current banner image
	const bannerImage = $derived.by(() => {
		if (rotating && artist.heroArtworks?.length) {
			return artist.heroArtworks![currentIndex].images.full;
		}
		return artist.heroBanner || artist.heroArtworks?.[0]?.images.full;
	});

	// Height values
	const heightValues = {
		sm: '200px',
		md: '300px',
		lg: '400px',
		full: '100vh',
	};
</script>

{#if config.showHeroBanner && bannerImage}
	<header
		class={`hero-banner hero-banner--${height} ${className}`}
		style:--banner-height={heightValues[height]}
		style:--parallax-offset={`${parallaxOffset}px`}
		aria-label={`${artist.displayName}'s banner`}
	>
		<div class="hero-banner__image-container">
			<img
				src={bannerImage}
				alt={`Banner artwork by ${artist.displayName}`}
				class="hero-banner__image"
				class:transitioning={isTransitioning}
				loading="eager"
				decoding="async"
			/>
		</div>

		<!-- Gradient overlay for text readability -->
		<div class="hero-banner__overlay" aria-hidden="true"></div>

		<!-- Rotation indicators -->
		{#if rotating && artist.heroArtworks && artist.heroArtworks.length > 1}
			<div class="hero-banner__indicators" role="tablist" aria-label="Banner artwork navigation">
				{#each artist.heroArtworks as item, index (item.id || index)}
					<button
						class="hero-banner__indicator"
						class:active={index === currentIndex}
						role="tab"
						aria-selected={index === currentIndex}
						aria-label={`Show artwork ${index + 1}`}
						onclick={() => {
							currentIndex = index;
						}}
					></button>
				{/each}
			</div>
		{/if}
	</header>
{/if}

<style>
	.hero-banner {
		position: relative;
		width: 100%;
		height: var(--banner-height);
		overflow: hidden;
	}

	.hero-banner__image-container {
		position: absolute;
		inset: 0;
		transform: translateY(var(--parallax-offset, 0));
		will-change: transform;
	}

	.hero-banner__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.3s ease-out;
	}

	.hero-banner__image.transitioning {
		opacity: 0;
	}

	.hero-banner__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			transparent 50%,
			rgba(0, 0, 0, 0.7) 100%
		);
		pointer-events: none;
	}

	.hero-banner__indicators {
		position: absolute;
		bottom: var(--gr-spacing-scale-4);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--gr-spacing-scale-2);
		z-index: 10;
	}

	.hero-banner__indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.2s;
	}

	.hero-banner__indicator:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	.hero-banner__indicator.active {
		background: white;
		transform: scale(1.2);
	}

	.hero-banner__indicator:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.hero-banner__image-container {
			transform: none;
		}

		.hero-banner__image {
			transition: none;
		}

		.hero-banner__indicator {
			transition: none;
		}
	}
</style>
