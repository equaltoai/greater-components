<!--
ArtistTimeline - Hybrid social feed with larger image previews

Features:
- REQ-VIEW-003: Hybrid social feed with larger image previews
- Threaded conversations anchored to specific artworks
- Work-in-progress tracking showing piece evolution
- Similar interaction patterns to social face for familiarity
- Extends social Timeline patterns

@component
@example
```svelte
<ArtistTimeline {artist} items={timelineItems} showSocial />
```
-->

<script lang="ts">
	import type { ArtistData, TimelineItem } from './ArtistProfile/context.js';

	interface Props {
		/**
		 * Artist data
		 */
		artist: ArtistData;

		/**
		 * Timeline items
		 */
		items?: TimelineItem[];

		/**
		 * Show social elements (likes, comments, shares)
		 */
		showSocial?: boolean;

		/**
		 * Callback for loading more items
		 */
		onLoadMore?: () => void | Promise<void>;

		/**
		 * Whether more items are available
		 */
		hasMore?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		artist,
		items = [],
		showSocial = true,
		onLoadMore,
		hasMore = false,
		class: className = '',
	}: Props = $props();

	// Loading state
	let isLoading = $state(false);

	// Intersection observer for infinite scroll
	let sentinelRef: HTMLElement | null = $state(null);

	$effect(() => {
		if (!sentinelRef || !hasMore || !onLoadMore) return;

		const observer = new IntersectionObserver(
			async (entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					isLoading = true;
					await onLoadMore();
					isLoading = false;
				}
			},
			{ rootMargin: '200px' }
		);

		observer.observe(sentinelRef);
		return () => observer.disconnect();
	});

	// Format relative time
	function formatRelativeTime(date: string | Date): string {
		const now = new Date();
		const then = new Date(date);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return then.toLocaleDateString();
	}

	// Format engagement numbers
	function formatNumber(num: number): string {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	}
</script>

<div
	class={`artist-timeline ${className}`}
	role="feed"
	aria-label={`${artist.displayName}'s timeline`}
>
	{#each items as item (item.id)}
		<article class="artist-timeline__item" aria-label="Timeline post">
			<!-- Author header -->
			<header class="artist-timeline__header">
				<img src={artist.avatar} alt="" class="artist-timeline__avatar" loading="lazy" />
				<div class="artist-timeline__meta">
					<span class="artist-timeline__name">{artist.displayName}</span>
					<span class="artist-timeline__handle">@{artist.username}</span>
					<span class="artist-timeline__separator">·</span>
					<time class="artist-timeline__time" datetime={new Date(item.createdAt).toISOString()}>
						{formatRelativeTime(item.createdAt)}
					</time>
				</div>
			</header>

			<!-- Content -->
			<div class="artist-timeline__content">
				<p class="artist-timeline__text">{item.content}</p>

				<!-- Artwork preview (larger for artist timeline - REQ-VIEW-003) -->
				{#if item.artwork}
					<div class="artist-timeline__artwork">
						<img src={item.artwork.images.standard} alt={item.artwork.title} loading="lazy" />
						<div class="artist-timeline__artwork-info">
							<span class="artist-timeline__artwork-title">{item.artwork.title}</span>
							{#if item.type === 'artwork'}
								<span class="artist-timeline__artwork-badge">New Work</span>
							{:else if item.type === 'exhibition'}
								<span
									class="artist-timeline__artwork-badge artist-timeline__artwork-badge--exhibition"
								>
									Exhibition
								</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Social engagement -->
			{#if showSocial && item.engagement}
				<footer class="artist-timeline__footer">
					<button class="artist-timeline__action" aria-label="Like">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							/>
						</svg>
						<span>{formatNumber(item.engagement.likes)}</span>
					</button>

					<button class="artist-timeline__action" aria-label="Comment">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
							/>
						</svg>
						<span>{formatNumber(item.engagement.comments)}</span>
					</button>

					<button class="artist-timeline__action" aria-label="Share">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="18" cy="5" r="3" />
							<circle cx="6" cy="12" r="3" />
							<circle cx="18" cy="19" r="3" />
							<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
							<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
						</svg>
						<span>{formatNumber(item.engagement.shares)}</span>
					</button>
				</footer>
			{/if}
		</article>
	{/each}

	{#if hasMore}
		<div bind:this={sentinelRef} class="artist-timeline__sentinel" aria-hidden="true">
			{#if isLoading}
				<div class="artist-timeline__loader">
					<div class="artist-timeline__spinner"></div>
					<span>Loading more...</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.artist-timeline {
		display: flex;
		flex-direction: column;
	}

	.artist-timeline__item {
		padding: var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-gray-800);
	}

	.artist-timeline__header {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-3);
	}

	.artist-timeline__avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.artist-timeline__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.artist-timeline__name {
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.artist-timeline__handle,
	.artist-timeline__separator,
	.artist-timeline__time {
		color: var(--gr-color-gray-500);
		font-size: var(--gr-font-size-sm);
	}

	.artist-timeline__content {
		margin-bottom: var(--gr-spacing-scale-3);
	}

	.artist-timeline__text {
		margin: 0 0 var(--gr-spacing-scale-3);
		color: var(--gr-color-gray-200);
		line-height: 1.6;
	}

	/* Larger artwork preview - REQ-VIEW-003 */
	.artist-timeline__artwork {
		position: relative;
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
	}

	.artist-timeline__artwork img {
		width: 100%;
		max-height: 500px;
		object-fit: cover;
		display: block;
	}

	.artist-timeline__artwork-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--gr-spacing-scale-4);
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.artist-timeline__artwork-title {
		font-weight: var(--gr-font-weight-medium);
		color: white;
	}

	.artist-timeline__artwork-badge {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-600);
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-font-size-xs);
		font-weight: var(--gr-font-weight-medium);
		color: white;
	}

	.artist-timeline__artwork-badge--exhibition {
		background: var(--gr-color-warning-600);
	}

	.artist-timeline__footer {
		display: flex;
		gap: var(--gr-spacing-scale-6);
	}

	.artist-timeline__action {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: 0;
		border: none;
		background: none;
		color: var(--gr-color-gray-500);
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
		transition: color 0.2s;
	}

	.artist-timeline__action:hover {
		color: var(--gr-color-primary-400);
	}

	.artist-timeline__action:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm);
	}

	.artist-timeline__sentinel {
		min-height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.artist-timeline__loader {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		color: var(--gr-color-gray-500);
		font-size: var(--gr-font-size-sm);
	}

	.artist-timeline__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--gr-color-gray-700);
		border-top-color: var(--gr-color-primary-500);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.artist-timeline__action {
			transition: none;
		}

		.artist-timeline__spinner {
			animation: none;
		}
	}
</style>
