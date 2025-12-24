<!--
Artwork.Metadata - Artwork metadata display component

Displays medium, dimensions, year, materials.
Collapsible/expandable for detailed view.
Structured data for accessibility.

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.Metadata collapsible defaultExpanded={false} />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Enable collapsible behavior
		 */
		collapsible?: boolean;

		/**
		 * Default expanded state
		 */
		defaultExpanded?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		collapsible = false,
		defaultExpanded: initialExpanded = true,
		class: className = '',
	}: Props = $props();

	const context = getArtworkContext();
	const { artwork, config } = context;
	const { metadata } = artwork;

	// Expanded state
	// svelte-ignore state_referenced_locally
	let isExpanded = $state(initialExpanded);

	// Toggle expanded state
	function toggleExpanded() {
		if (collapsible) {
			isExpanded = !isExpanded;
		}
	}

	// Check if metadata exists
	const hasMetadata = $derived(
		metadata.medium || metadata.dimensions || metadata.year || metadata.materials?.length
	);

	// Compute CSS classes
	const metadataClass = $derived(
		[
			'gr-artist-artwork-metadata',
			collapsible && 'gr-artist-artwork-metadata--collapsible',
			isExpanded && 'gr-artist-artwork-metadata--expanded',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if hasMetadata && config.showMetadata}
	<div class={metadataClass}>
		{#if collapsible}
			<button
				class="gr-artist-artwork-metadata-toggle"
				onclick={toggleExpanded}
				aria-expanded={isExpanded}
				aria-controls="artwork-metadata-content"
			>
				<span>Details</span>
				<svg
					class="gr-artist-artwork-metadata-toggle-icon"
					class:rotated={isExpanded}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>
		{/if}

		<dl
			id="artwork-metadata-content"
			class="gr-artist-artwork-metadata-list"
			class:hidden={collapsible && !isExpanded}
		>
			{#if metadata.medium}
				<div class="gr-artist-artwork-metadata-item">
					<dt>Medium</dt>
					<dd>{metadata.medium}</dd>
				</div>
			{/if}

			{#if metadata.dimensions}
				<div class="gr-artist-artwork-metadata-item">
					<dt>Dimensions</dt>
					<dd>{metadata.dimensions}</dd>
				</div>
			{/if}

			{#if metadata.year}
				<div class="gr-artist-artwork-metadata-item">
					<dt>Year</dt>
					<dd>{metadata.year}</dd>
				</div>
			{/if}

			{#if metadata.materials?.length}
				<div class="gr-artist-artwork-metadata-item">
					<dt>Materials</dt>
					<dd>{metadata.materials.join(', ')}</dd>
				</div>
			{/if}
		</dl>
	</div>
{/if}

<style>
	.gr-artist-artwork-metadata {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	.gr-artist-artwork-metadata-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--gr-spacing-scale-2) 0;
		background: none;
		border: none;
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: color var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-metadata-toggle:hover,
	.gr-artist-artwork-metadata-toggle:focus {
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
	}

	.gr-artist-artwork-metadata-toggle:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm);
	}

	.gr-artist-artwork-metadata-toggle-icon {
		width: 16px;
		height: 16px;
		transition: transform var(--gr-artist-transition-reveal, 300ms ease-out);
	}

	.gr-artist-artwork-metadata-toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.gr-artist-artwork-metadata-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: var(--gr-spacing-scale-3);
		margin: 0;
		padding: 0;
	}

	.gr-artist-artwork-metadata-list.hidden {
		display: none;
	}

	.gr-artist-artwork-metadata-item {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.gr-artist-artwork-metadata-item dt {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.gr-artist-artwork-metadata-item dd {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-metadata-toggle,
		.gr-artist-artwork-metadata-toggle-icon {
			transition: none;
		}
	}
</style>
