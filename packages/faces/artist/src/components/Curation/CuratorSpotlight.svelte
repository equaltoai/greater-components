<!--
CuratorSpotlight - Featured curator or artist spotlight card

Implements REQ-FR-005: Community Curation Features
- Artist spotlights (daily/weekly features)
- Guest curator programs

Features:
- Curator bio and credentials
- Curated selection preview (3-4 artworks)
- Curator statement quote
- "View Full Collection" link
- Follow curator button

@component
@example
```svelte
<CuratorSpotlight
  curator={curatorData}
  collection={artworks}
  statement="My curatorial vision..."
/>
```
-->

<script lang="ts">
	import type { CuratorData } from '../../types/curation.js';
	import type { ArtworkData } from '../../types/artwork.js';

	interface Props {
		/**
		 * Curator data
		 */
		curator: CuratorData;

		/**
		 * Curated artwork collection
		 */
		collection: ArtworkData[];

		/**
		 * Curator statement or quote
		 */
		statement?: string;

		/**
		 * Number of preview artworks to show
		 */
		previewCount?: number;

		/**
		 * Link to full collection
		 */
		collectionUrl?: string;

		/**
		 * Whether user is following this curator
		 */
		isFollowing?: boolean;

		/**
		 * Variant style
		 */
		variant?: 'default' | 'compact' | 'featured';

		/**
		 * Called when follow button is clicked
		 */
		onFollow?: (curator: CuratorData) => void | Promise<void>;

		/**
		 * Called when curator is clicked
		 */
		onCuratorClick?: (curator: CuratorData) => void;

		/**
		 * Called when artwork is clicked
		 */
		onArtworkClick?: (artwork: ArtworkData) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		curator,
		collection,
		statement,
		previewCount = 4,
		collectionUrl,
		isFollowing = false,
		variant = 'default',
		onFollow,
		onCuratorClick,
		onArtworkClick,
		class: className = '',
	}: Props = $props();

	// Preview artworks
	const previewArtworks = $derived(collection.slice(0, previewCount));

	// Following state
	// svelte-ignore state_referenced_locally
	let following = $state(isFollowing);
	let followLoading = $state(false);

	// Handle follow
	async function handleFollow() {
		followLoading = true;
		try {
			await onFollow?.(curator);
			following = !following;
		} finally {
			followLoading = false;
		}
	}

	// Handle curator click
	function handleCuratorClick() {
		onCuratorClick?.(curator);
	}

	// Handle artwork click
	function handleArtworkClick(artwork: ArtworkData) {
		onArtworkClick?.(artwork);
	}
</script>

<article class={`curator-spotlight curator-spotlight--${variant} ${className}`}>
	<!-- Curator header -->
	<header class="curator-spotlight__header">
		<button type="button" class="curator-spotlight__curator" onclick={handleCuratorClick}>
			{#if curator.avatar}
				<img src={curator.avatar} alt="" class="curator-spotlight__avatar" />
			{:else}
				<div class="curator-spotlight__avatar-placeholder" aria-hidden="true">
					{curator.name.charAt(0).toUpperCase()}
				</div>
			{/if}
			<div class="curator-spotlight__info">
				<span class="curator-spotlight__name">
					{curator.name}
					{#if curator.isVerified}
						<svg
							class="curator-spotlight__verified"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-label="Verified"
						>
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
						</svg>
					{/if}
				</span>
				{#if curator.institution}
					<span class="curator-spotlight__institution">{curator.institution}</span>
				{/if}
			</div>
		</button>

		<button
			type="button"
			class="curator-spotlight__follow"
			class:following
			onclick={handleFollow}
			disabled={followLoading}
			aria-pressed={following}
		>
			{#if followLoading}
				<span class="curator-spotlight__follow-loading" aria-hidden="true"></span>
			{:else}
				{following ? 'Following' : 'Follow'}
			{/if}
		</button>
	</header>

	<!-- Bio -->
	{#if curator.bio && variant !== 'compact'}
		<p class="curator-spotlight__bio">{curator.bio}</p>
	{/if}

	<!-- Focus areas / credentials -->
	{#if curator.focusAreas && curator.focusAreas.length > 0}
		<div class="curator-spotlight__focus-areas">
			{#each curator.focusAreas.slice(0, 3) as area (area)}
				<span class="curator-spotlight__focus-tag">{area}</span>
			{/each}
		</div>
	{/if}

	<!-- Statement quote -->
	{#if statement && variant === 'featured'}
		<blockquote class="curator-spotlight__statement">
			<p>"{statement}"</p>
		</blockquote>
	{/if}

	<!-- Artwork preview -->
	{#if previewArtworks.length > 0}
		{@const previewCountClamped = Math.min(previewArtworks.length, 4)}
		<div class="curator-spotlight__preview">
			<div
				class={`curator-spotlight__preview-grid curator-spotlight__preview-grid--count-${previewCountClamped}`}
			>
				{#each previewArtworks as artwork (artwork.id)}
					<button
						type="button"
						class="curator-spotlight__preview-item"
						onclick={() => handleArtworkClick(artwork)}
						aria-label={`View ${artwork.title}`}
					>
						<img src={artwork.images.preview} alt={artwork.altText} loading="lazy" />
					</button>
				{/each}
			</div>
			{#if collection.length > previewCount}
				<span class="curator-spotlight__more">
					+{collection.length - previewCount} more
				</span>
			{/if}
		</div>
	{/if}

	<!-- Stats -->
	<div class="curator-spotlight__stats">
		{#if curator.exhibitionCount !== undefined}
			<span class="curator-spotlight__stat">
				<strong>{curator.exhibitionCount}</strong> exhibitions
			</span>
		{/if}
		<span class="curator-spotlight__stat">
			<strong>{collection.length}</strong> works curated
		</span>
	</div>

	<!-- View collection link -->
	{#if collectionUrl}
		<a href={collectionUrl} class="curator-spotlight__link">
			View Full Collection
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<path
					d="M5 12h14M12 5l7 7-7 7"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	{/if}
</article>

<style>
	.curator-spotlight {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-6);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.curator-spotlight--featured {
		background: linear-gradient(135deg, var(--gr-color-gray-800), var(--gr-color-gray-900));
		border: 1px solid var(--gr-color-gray-700);
	}

	.curator-spotlight--compact {
		padding: var(--gr-spacing-scale-4);
		gap: var(--gr-spacing-scale-3);
	}

	.curator-spotlight__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--gr-spacing-scale-4);
	}

	.curator-spotlight__curator {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
	}

	.curator-spotlight__avatar {
		width: 56px;
		height: 56px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.curator-spotlight--compact .curator-spotlight__avatar {
		width: 40px;
		height: 40px;
	}

	.curator-spotlight__avatar-placeholder {
		width: 56px;
		height: 56px;
		border-radius: var(--gr-radius-full);
		background: var(--gr-color-gray-600);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-300);
	}

	.curator-spotlight__info {
		display: flex;
		flex-direction: column;
	}

	.curator-spotlight__name {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.curator-spotlight__verified {
		width: 18px;
		height: 18px;
		color: var(--gr-color-primary-400);
	}

	.curator-spotlight__institution {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.curator-spotlight__follow {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-500);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
		min-width: 90px;
	}

	.curator-spotlight__follow:hover:not(:disabled) {
		background: var(--gr-color-primary-600);
	}

	.curator-spotlight__follow.following {
		background: var(--gr-color-gray-600);
	}

	.curator-spotlight__follow.following:hover:not(:disabled) {
		background: var(--gr-color-error-500);
	}

	.curator-spotlight__follow:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.curator-spotlight__follow-loading {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.curator-spotlight__bio {
		font-size: var(--gr-font-size-sm);
		line-height: 1.6;
		color: var(--gr-color-gray-300);
		margin: 0;
	}

	.curator-spotlight__focus-areas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
	}

	.curator-spotlight__focus-tag {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-300);
	}

	.curator-spotlight__statement {
		margin: 0;
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
		border-left: 3px solid var(--gr-color-primary-500);
	}

	.curator-spotlight__statement p {
		margin: 0;
		font-size: var(--gr-font-size-base);
		font-style: italic;
		color: var(--gr-color-gray-200);
		line-height: 1.6;
	}

	.curator-spotlight__preview {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.curator-spotlight__preview-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gr-spacing-scale-2);
	}

	.curator-spotlight__preview-grid--count-1 {
		grid-template-columns: repeat(1, 1fr);
	}

	.curator-spotlight__preview-grid--count-2 {
		grid-template-columns: repeat(2, 1fr);
	}

	.curator-spotlight__preview-grid--count-3 {
		grid-template-columns: repeat(3, 1fr);
	}

	.curator-spotlight__preview-grid--count-4 {
		grid-template-columns: repeat(4, 1fr);
	}

	.curator-spotlight__preview-item {
		aspect-ratio: 1;
		padding: 0;
		border: none;
		border-radius: var(--gr-radius-sm);
		overflow: hidden;
		cursor: pointer;
	}

	.curator-spotlight__preview-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s;
	}

	.curator-spotlight__preview-item:hover img {
		transform: scale(1.05);
	}

	.curator-spotlight__more {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
		text-align: right;
	}

	.curator-spotlight__stats {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.curator-spotlight__stat strong {
		color: var(--gr-color-gray-200);
		font-weight: var(--gr-font-weight-semibold);
	}

	.curator-spotlight__link {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		color: var(--gr-color-primary-400);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		text-decoration: none;
		transition: color 0.2s;
	}

	.curator-spotlight__link:hover {
		color: var(--gr-color-primary-300);
	}

	.curator-spotlight__link svg {
		width: 16px;
		height: 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		.curator-spotlight__follow,
		.curator-spotlight__preview-item img,
		.curator-spotlight__link,
		.curator-spotlight__follow-loading {
			transition: none;
			animation: none;
		}
	}
</style>
