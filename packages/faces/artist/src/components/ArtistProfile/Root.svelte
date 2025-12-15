<!--
ArtistProfile.Root - Container compound component for artist gallery/portfolio

Implements REQ-FR-002: Artist Profiles as Gallery Spaces
Implements REQ-VIEW-002: Portfolio View layout
Implements accessibility with semantic heading structure and landmark regions

@component
@example
```svelte
<ArtistProfile.Root {artist} isOwnProfile={false} layout="gallery">
  <ArtistProfile.HeroBanner />
  <ArtistProfile.Avatar />
  <ArtistProfile.Name />
  <ArtistProfile.Statement />
  <ArtistProfile.Sections />
</ArtistProfile.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		createArtistProfileContext,
		type ArtistData,
		type ProfileHandlers,
		type ProfileLayout,
	} from './context.js';

	interface Props {
		/**
		 * Artist profile data
		 */
		artist: ArtistData;

		/**
		 * Whether viewing own profile (enables edit mode)
		 */
		isOwnProfile?: boolean;

		/**
		 * Event handlers for profile actions
		 */
		handlers?: ProfileHandlers;

		/**
		 * Profile layout mode
		 */
		layout?: ProfileLayout;

		/**
		 * Show hero banner
		 */
		showHeroBanner?: boolean;

		/**
		 * Enable parallax scrolling on hero (respects reduced motion)
		 */
		enableParallax?: boolean;

		/**
		 * Show social elements (false for professional mode - REQ-VIEW-002)
		 */
		showSocial?: boolean;

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
		artist,
		isOwnProfile = false,
		handlers = {},
		layout = 'gallery',
		showHeroBanner = true,
		enableParallax = true,
		showSocial = true,
		class: className = '',
		children,
	}: Props = $props();

	// Check for reduced motion preference
	let prefersReducedMotion = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			prefersReducedMotion = mediaQuery.matches;

			const handler = (e: MediaQueryListEvent) => {
				prefersReducedMotion = e.matches;
			};

			mediaQuery.addEventListener('change', handler);
			return () => mediaQuery.removeEventListener('change', handler);
		}
		// Explicit return for consistent return paths
		return;
	});

	const ctx = createArtistProfileContext(
		() => artist,
		() => isOwnProfile,
		() => ({
			layout,
			showHeroBanner,
			enableParallax: enableParallax && !prefersReducedMotion,
			showSocial,
			editable: isOwnProfile,
		}),
		() => handlers
	);

	// Computed classes
	const rootClasses = $derived(
		[
			'artist-profile',
			`artist-profile--${layout}`,
			ctx.professionalMode && 'artist-profile--professional',
			ctx.isEditing && 'artist-profile--editing',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<article
	class={rootClasses}
	aria-label={`${artist.displayName}'s profile`}
	data-layout={layout}
	data-professional={ctx.professionalMode}
>
	<!-- Skip link for accessibility -->
	<a href="#profile-content" class="skip-link">Skip to profile content</a>

	<!-- Main profile content -->
	<div id="profile-content" class="artist-profile__content">
		{@render children()}
	</div>
</article>

<style>
	.artist-profile {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--gr-color-primary-700);
		color: white;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		z-index: 100;
		transition: top 0.2s;
	}

	.skip-link:focus {
		top: 0;
	}

	.artist-profile__content {
		position: relative;
		width: 100%;
	}

	/* Layout variants */
	/* .artist-profile--gallery { */
	/* Default gallery layout */
	/* } */

	.artist-profile--portfolio {
		/* Portfolio layout - cleaner, more professional */
		background: var(--gr-color-gray-950);
	}

	/* .artist-profile--timeline { */
	/* Timeline layout - social feed style */
	/* } */

	/* Professional mode - REQ-VIEW-002 */
	.artist-profile--professional {
		/* Clean portfolio presentation */
		--profile-social-display: none;
	}

	/* Edit mode */
	/* .artist-profile--editing { */
	/* Visual indicator for edit mode */
	/* } */

	/* Print styles for professional mode */
	@media print {
		.artist-profile {
			background: white;
			color: black;
		}

		.skip-link {
			display: none;
		}

		.artist-profile--professional {
			/* Print-friendly styles */
			font-size: 12pt;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.skip-link {
			transition: none;
		}
	}
</style>
