<!--
MediaViewer.MetadataPanel - Collapsible metadata panel

Context toggle to show/hide social elements.
Metadata display (medium, dimensions, year, materials).
Collapsible panel.

@component
-->

<script lang="ts">
	import { getMediaViewerContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getMediaViewerContext();
	const { artworks, config } = context;

	// Current artwork
	const artwork = $derived(artworks[context.currentIndex]);

	// Toggle panel visibility
	function togglePanel() {
		context.isMetadataVisible = !context.isMetadataVisible;
	}
</script>

{#if config.showMetadata}
	<div
		class="gr-artist-media-viewer-metadata {className}"
		class:visible={context.isMetadataVisible}
	>
		<button
			class="gr-artist-media-viewer-metadata-toggle"
			onclick={togglePanel}
			aria-expanded={context.isMetadataVisible}
			aria-label={context.isMetadataVisible ? 'Hide details' : 'Show details'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12.01" y2="8" />
			</svg>
		</button>

		{#if context.isMetadataVisible && artwork}
			<div class="gr-artist-media-viewer-metadata-panel">
				<h2 class="gr-artist-media-viewer-metadata-title">{artwork.title}</h2>
				<p class="gr-artist-media-viewer-metadata-artist">by {artwork.artist.name}</p>

				{#if artwork.description}
					<p class="gr-artist-media-viewer-metadata-desc">{artwork.description}</p>
				{/if}

				<dl class="gr-artist-media-viewer-metadata-list">
					{#if artwork.metadata.medium}
						<div class="gr-artist-media-viewer-metadata-item">
							<dt>Medium</dt>
							<dd>{artwork.metadata.medium}</dd>
						</div>
					{/if}

					{#if artwork.metadata.dimensions}
						<div class="gr-artist-media-viewer-metadata-item">
							<dt>Dimensions</dt>
							<dd>{artwork.metadata.dimensions}</dd>
						</div>
					{/if}

					{#if artwork.metadata.year}
						<div class="gr-artist-media-viewer-metadata-item">
							<dt>Year</dt>
							<dd>{artwork.metadata.year}</dd>
						</div>
					{/if}

					{#if artwork.metadata.materials?.length}
						<div class="gr-artist-media-viewer-metadata-item">
							<dt>Materials</dt>
							<dd>{artwork.metadata.materials.join(', ')}</dd>
						</div>
					{/if}
				</dl>

				{#if artwork.aiUsage?.hasAI}
					<div class="gr-artist-media-viewer-metadata-ai">
						<span class="gr-artist-media-viewer-metadata-ai-badge">AI-assisted</span>
						{#if artwork.aiUsage.tools?.length}
							<span class="gr-artist-media-viewer-metadata-ai-tools">
								{artwork.aiUsage.tools.join(', ')}
							</span>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.gr-artist-media-viewer-metadata {
		position: absolute;
		top: var(--gr-spacing-scale-4);
		left: var(--gr-spacing-scale-4);
		z-index: 10;
	}

	.gr-artist-media-viewer-metadata-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: background-color 200ms ease-out;
	}

	.gr-artist-media-viewer-metadata-toggle:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.gr-artist-media-viewer-metadata-toggle:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-media-viewer-metadata-toggle svg {
		width: 24px;
		height: 24px;
	}

	.gr-artist-media-viewer-metadata-panel {
		margin-top: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		background: rgba(0, 0, 0, 0.8);
		border-radius: var(--gr-radii-md);
		max-width: 320px;
		max-height: 60vh;
		overflow-y: auto;
	}

	.gr-artist-media-viewer-metadata-title {
		margin: 0 0 var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: 500;
		color: white;
	}

	.gr-artist-media-viewer-metadata-artist {
		margin: 0 0 var(--gr-spacing-scale-3);
		font-size: var(--gr-typography-fontSize-sm);
		color: rgba(255, 255, 255, 0.7);
	}

	.gr-artist-media-viewer-metadata-desc {
		margin: 0 0 var(--gr-spacing-scale-3);
		font-size: var(--gr-typography-fontSize-sm);
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.5;
	}

	.gr-artist-media-viewer-metadata-list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		margin: 0;
		padding: 0;
	}

	.gr-artist-media-viewer-metadata-item {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.gr-artist-media-viewer-metadata-item dt {
		font-size: var(--gr-typography-fontSize-xs);
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.gr-artist-media-viewer-metadata-item dd {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: white;
	}

	.gr-artist-media-viewer-metadata-ai {
		margin-top: var(--gr-spacing-scale-3);
		padding-top: var(--gr-spacing-scale-3);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.gr-artist-media-viewer-metadata-ai-badge {
		display: inline-block;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-typography-fontSize-xs);
		color: rgba(255, 255, 255, 0.7);
	}

	.gr-artist-media-viewer-metadata-ai-tools {
		display: block;
		margin-top: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: rgba(255, 255, 255, 0.5);
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-media-viewer-metadata-toggle {
			transition: none;
		}
	}
</style>
