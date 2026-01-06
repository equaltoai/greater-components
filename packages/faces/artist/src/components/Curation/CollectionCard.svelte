<!--
CollectionCard - User-created or themed collection display

Implements REQ-FR-005: Community Curation Features
- Collaborative collections with multiple contributors

Features:
- Preview images (configurable count, default 4)
- Collection title and description
- Artwork count
- Collaborative indicator with contributor avatars
- Save/follow collection button
- Privacy indicator (public/private)

@component
@example
```svelte
<CollectionCard
  collection={collectionData}
  preview={4}
  collaborative={true}
/>
```
-->

<script lang="ts">
	import type { CollectionData } from '../../types/curation.js';
	import type { ArtistData } from '../../types/artist.js';

	interface Props {
		/**
		 * Collection data
		 */
		collection: CollectionData;

		/**
		 * Number of preview images to show
		 */
		preview?: number;

		/**
		 * Whether this is a collaborative collection
		 */
		collaborative?: boolean;

		/**
		 * Whether user has saved this collection
		 */
		isSaved?: boolean;

		/**
		 * Variant style
		 */
		variant?: 'default' | 'compact' | 'large';

		/**
		 * Called when save button is clicked
		 */
		onSave?: (collection: CollectionData) => void | Promise<void>;

		/**
		 * Called when collection is clicked
		 */
		onClick?: (collection: CollectionData) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Contributors (optional override for testing)
		 */
		contributors?: ArtistData[];
	}

	let {
		collection,
		preview = 4,
		collaborative = false,
		isSaved = false,
		variant = 'default',
		onSave,
		onClick,
		class: className = '',
		contributors: propContributors = [],
	}: Props = $props();

	// Preview artworks
	const previewArtworks = $derived(collection.artworks.slice(0, preview));

	// Contributors for collaborative collections
	const contributors = $derived(() => {
		if (!collaborative) return [];
		if (propContributors.length > 0) return propContributors;
		// Mock contributors - in real app would come from collection data
		return [] as ArtistData[];
	});

	// Saved state
	// svelte-ignore state_referenced_locally
	let saved = $state(isSaved);
	let saveLoading = $state(false);

	// Handle save
	async function handleSave(event: Event) {
		event.stopPropagation();
		saveLoading = true;
		try {
			await onSave?.(collection);
			saved = !saved;
		} catch (error) {
			console.error('Failed to save collection:', error);
		} finally {
			saveLoading = false;
		}
	}

	// Handle click
	function handleClick() {
		onClick?.(collection);
	}

	// Privacy icon
	const privacyIcon = $derived(() => {
		if (collection.visibility === 'private') {
			return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
		}
		if (collection.visibility === 'unlisted') {
			return 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z';
		}
		return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z';
	});
</script>

<article class={`collection-card collection-card--${variant} ${className}`}>
	<button
		type="button"
		class="collection-card__hit-area"
		onclick={handleClick}
		aria-label={`View collection ${collection.name}`}
	></button>

	<!-- Preview grid -->
	<div class="collection-card__preview">
		{#each previewArtworks as artwork, index (artwork.id)}
			<div class="collection-card__preview-item" class:large={index === 0 && preview <= 4}>
				<img src={artwork.images.thumbnail} alt="" loading="lazy" />
			</div>
		{/each}
		{#if previewArtworks.length === 0}
			<div class="collection-card__preview-empty">
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
					/>
				</svg>
				<span>No artworks yet</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="collection-card__content">
		<div class="collection-card__header">
			<h3 class="collection-card__title">{collection.name}</h3>
			<div class="collection-card__indicators">
				<!-- Privacy indicator -->
				{#if collection.visibility !== 'public'}
					<span class="collection-card__privacy" title={collection.visibility}>
						<svg viewBox="0 0 24 24" fill="currentColor" aria-label={collection.visibility}>
							<path d={privacyIcon()} />
						</svg>
					</span>
				{/if}
				<!-- Collaborative indicator -->
				{#if collaborative}
					<span class="collection-card__collaborative" title="Collaborative collection">
						<svg viewBox="0 0 24 24" fill="currentColor" aria-label="Collaborative">
							<path
								d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
							/>
						</svg>
					</span>
				{/if}
			</div>
		</div>

		{#if collection.description && variant !== 'compact'}
			<p class="collection-card__description">{collection.description}</p>
		{/if}

		<!-- Owner info -->
		<div class="collection-card__owner">
			{#if collection.ownerAvatar}
				<img src={collection.ownerAvatar} alt="" class="collection-card__owner-avatar" />
			{/if}
			<span class="collection-card__owner-name">{collection.ownerName}</span>
		</div>

		<!-- Contributors (for collaborative) -->
		{#if collaborative && contributors().length > 0}
			<div class="collection-card__contributors">
				<div class="collection-card__contributor-avatars">
					{#each contributors().slice(0, 3) as contributor (contributor)}
						<img
							src={contributor.avatar}
							alt={contributor.name}
							class="collection-card__contributor-avatar"
						/>
					{/each}
					{#if contributors().length > 3}
						<span class="collection-card__contributor-more">
							+{contributors().length - 3}
						</span>
					{/if}
				</div>
				<span class="collection-card__contributor-label">
					{contributors().length} contributors
				</span>
			</div>
		{/if}

		<!-- Footer -->
		<div class="collection-card__footer">
			<span class="collection-card__count">
				{collection.artworkCount}
				{collection.artworkCount === 1 ? 'artwork' : 'artworks'}
			</span>
			<button
				type="button"
				class="collection-card__save"
				class:saved
				onclick={handleSave}
				disabled={saveLoading}
				aria-pressed={saved}
				aria-label={saved ? 'Unsave collection' : 'Save collection'}
			>
				<svg
					viewBox="0 0 24 24"
					fill={saved ? 'currentColor' : 'none'}
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>
</article>

<style>
	.collection-card {
		position: relative;
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.collection-card__hit-area {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border: none;
		background: transparent;
		z-index: 1;
		cursor: pointer;
	}

	.collection-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.collection-card:focus-within {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.collection-card--large {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.collection-card__preview {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2px;
		aspect-ratio: 1;
		pointer-events: none;
	}

	.collection-card--large .collection-card__preview {
		aspect-ratio: auto;
		height: 100%;
	}

	.collection-card__preview-item {
		overflow: hidden;
	}

	.collection-card__preview-item.large {
		grid-column: span 2;
		grid-row: span 2;
	}

	.collection-card__preview-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.collection-card__preview-empty {
		grid-column: span 2;
		grid-row: span 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-500);
	}

	.collection-card__preview-empty svg {
		width: 48px;
		height: 48px;
	}

	.collection-card__preview-empty span {
		font-size: var(--gr-font-size-sm);
	}

	.collection-card__content {
		padding: var(--gr-spacing-scale-4);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.collection-card__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--gr-spacing-scale-2);
	}

	.collection-card__title {
		font-size: var(--gr-font-size-base);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0;
		line-height: 1.3;
	}

	.collection-card__indicators {
		display: flex;
		gap: var(--gr-spacing-scale-1);
	}

	.collection-card__privacy,
	.collection-card__collaborative {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		color: var(--gr-color-gray-400);
	}

	.collection-card__privacy svg,
	.collection-card__collaborative svg {
		width: 16px;
		height: 16px;
	}

	.collection-card__description {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.collection-card__owner {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.collection-card__owner-avatar {
		width: 24px;
		height: 24px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.collection-card__owner-name {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
	}

	.collection-card__contributors {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.collection-card__contributor-avatars {
		display: flex;
	}

	.collection-card__contributor-avatar {
		width: 24px;
		height: 24px;
		border-radius: var(--gr-radius-full);
		border: 2px solid var(--gr-color-gray-800);
		margin-left: -8px;
	}

	.collection-card__contributor-avatar:first-child {
		margin-left: 0;
	}

	.collection-card__contributor-more {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: var(--gr-radius-full);
		background: var(--gr-color-gray-600);
		border: 2px solid var(--gr-color-gray-800);
		margin-left: -8px;
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-300);
	}

	.collection-card__contributor-label {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.collection-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.collection-card__count {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.collection-card__save {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: none;
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-400);
		cursor: pointer;
		position: relative;
		z-index: 2;
		transition:
			color 0.2s,
			background 0.2s;
	}

	.collection-card__save:hover:not(:disabled) {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-200);
	}

	.collection-card__save.saved {
		color: var(--gr-color-primary-400);
	}

	.collection-card__save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.collection-card__save svg {
		width: 20px;
		height: 20px;
	}

	@media (prefers-reduced-motion: reduce) {
		.collection-card,
		.collection-card__save {
			transition: none;
		}
	}
</style>
