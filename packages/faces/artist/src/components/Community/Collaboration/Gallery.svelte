<!--
Collaboration.Gallery - Collaborative gallery display

@component
-->

<script lang="ts">
	import { getCollaborationContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCollaborationContext();
	const { collaboration, config } = ctx;

	// View mode
	let viewMode = $state<'combined' | 'individual'>('combined');

	// Group assets by contributor
	const assetsByContributor = $derived(() => {
		if (!collaboration.sharedAssets) return new Map();
		const grouped = new Map<string, typeof collaboration.sharedAssets>();
		for (const asset of collaboration.sharedAssets) {
			const existing = grouped.get(asset.uploadedBy) || [];
			grouped.set(asset.uploadedBy, [...existing, asset]);
		}
		return grouped;
	});
</script>

{#if config.showGallery}
	<div class={`collab-gallery ${className}`}>
		<div class="collab-gallery__header">
			<h3 class="collab-gallery__title">Gallery</h3>
			<div class="collab-gallery__view-toggle" role="tablist">
				<button
					type="button"
					role="tab"
					class="collab-gallery__view-btn"
					class:active={viewMode === 'combined'}
					aria-selected={viewMode === 'combined'}
					onclick={() => (viewMode = 'combined')}
				>
					Combined
				</button>
				<button
					type="button"
					role="tab"
					class="collab-gallery__view-btn"
					class:active={viewMode === 'individual'}
					aria-selected={viewMode === 'individual'}
					onclick={() => (viewMode = 'individual')}
				>
					By Contributor
				</button>
			</div>
		</div>

		{#if viewMode === 'combined'}
			<!-- Combined view -->
			<div class="collab-gallery__grid">
				{#if !collaboration.sharedAssets?.length}
					<p class="collab-gallery__empty">No gallery items yet.</p>
				{:else}
					{#each collaboration.sharedAssets.filter( (a) => a.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ) as asset (asset.id)}
						<div class="collab-gallery__item">
							<img src={asset.url} alt={asset.name} />
							<div class="collab-gallery__item-overlay">
								<span class="collab-gallery__item-name">{asset.name}</span>
								<span class="collab-gallery__item-artist">by {asset.uploadedBy}</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{:else}
			<!-- Individual contributions view -->
			<div class="collab-gallery__contributors">
				{#each [...assetsByContributor().entries()] as [contributor, assets] (contributor)}
					<div class="collab-gallery__contributor-section">
						<h4 class="collab-gallery__contributor-name">{contributor}</h4>
						<div class="collab-gallery__contributor-grid">
							{#each assets.filter( (a) => a.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ) as asset (asset.id)}
								<div class="collab-gallery__item collab-gallery__item--small">
									<img src={asset.url} alt={asset.name} />
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.collab-gallery {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.collab-gallery__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-gallery__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.collab-gallery__view-toggle {
		display: flex;
		gap: var(--gr-spacing-scale-1);
	}

	.collab-gallery__view-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-300);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.collab-gallery__view-btn:hover {
		background: var(--gr-color-gray-600);
	}

	.collab-gallery__view-btn.active {
		background: var(--gr-color-primary-600);
		color: white;
	}

	.collab-gallery__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--gr-spacing-scale-4);
	}

	.collab-gallery__empty {
		grid-column: 1 / -1;
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-8);
	}

	.collab-gallery__item {
		position: relative;
		aspect-ratio: 1;
		border-radius: var(--gr-radius-md);
		overflow: hidden;
	}

	.collab-gallery__item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.collab-gallery__item:hover img {
		transform: scale(1.05);
	}

	.collab-gallery__item-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: var(--gr-spacing-scale-3);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.collab-gallery__item:hover .collab-gallery__item-overlay {
		opacity: 1;
	}

	.collab-gallery__item-name {
		font-weight: var(--gr-font-weight-medium);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collab-gallery__item-artist {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
	}

	.collab-gallery__contributors {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
	}

	.collab-gallery__contributor-section {
		border-bottom: 1px solid var(--gr-color-gray-700);
		padding-bottom: var(--gr-spacing-scale-5);
	}

	.collab-gallery__contributor-section:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.collab-gallery__contributor-name {
		font-size: var(--gr-font-size-base);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.collab-gallery__contributor-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: var(--gr-spacing-scale-2);
	}

	.collab-gallery__item--small {
		aspect-ratio: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.collab-gallery__view-btn,
		.collab-gallery__item img,
		.collab-gallery__item-overlay {
			transition: none;
		}
	}
</style>
