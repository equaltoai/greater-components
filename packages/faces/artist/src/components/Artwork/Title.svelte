<!--
Artwork.Title - Artwork title display component

Displays artwork title with optional link.
Typography following --gr-artist-font-title token.
Truncation for long titles with tooltip.

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.Title linkTo="/artwork/{artwork.id}" />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Optional link URL for the title
		 */
		linkTo?: string;

		/**
		 * Maximum lines before truncation
		 */
		maxLines?: number;

		/**
		 * Heading level for semantic HTML
		 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { linkTo, maxLines = 2, level = 3, class: className = '' }: Props = $props();

	const context = getArtworkContext();
	const { artwork } = context;

	// Determine if title needs truncation
	const needsTruncation = $derived(artwork.title.length > 60);

	// Compute CSS classes
	const titleClass = $derived(
		['gr-artist-artwork-title', needsTruncation && 'gr-artist-artwork-title--truncated', className]
			.filter(Boolean)
			.join(' ')
	);

	// Dynamic heading element
	const HeadingTag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element this={HeadingTag} class={titleClass} style="--max-lines: {maxLines}">
	{#if linkTo}
		<a href={linkTo} class="gr-artist-artwork-title-link" title={artwork.title}>
			{artwork.title}
		</a>
	{:else}
		<span title={needsTruncation ? artwork.title : undefined}>
			{artwork.title}
		</span>
	{/if}
</svelte:element>

<style>
	.gr-artist-artwork-title {
		/* REQ-DESIGN-004: Artwork titles slightly more prominent */
		font-family: var(--gr-artist-font-title, var(--gr-typography-fontFamily-sans));
		font-weight: var(--gr-artist-title-weight, 500);
		font-size: var(--gr-typography-fontSize-lg);
		line-height: 1.3;
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
		margin: 0;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	.gr-artist-artwork-title--truncated {
		display: -webkit-box;
		-webkit-line-clamp: var(--max-lines, 2);
		line-clamp: var(--max-lines, 2);
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.gr-artist-artwork-title-link {
		color: inherit;
		text-decoration: none;
		transition: color var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-title-link:hover,
	.gr-artist-artwork-title-link:focus {
		color: var(--gr-artist-accent-hover, var(--gr-color-gray-300));
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.gr-artist-artwork-title-link:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm);
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-title-link {
			transition: none;
		}
	}
</style>
