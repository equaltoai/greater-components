<!--
ArtistProfile.Timeline - Artist activity timeline

Features:
- Recent posts, exhibitions, collaborations
- Infinite scroll
- Social engagement display

@component
@example
```svelte
<ArtistProfile.Timeline items={timelineItems} />
```
-->

<script lang="ts">
	import { getArtistProfileContext, type TimelineItem } from './context.js';

	interface Props {
		/**
		 * Timeline items to display
		 */
		items: TimelineItem[];

		/**
		 * Show social engagement (likes, comments)
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
		items = [],
		showSocial = true,
		onLoadMore,
		hasMore = false,
		class: className = '',
	}: Props = $props();

	const ctx = getArtistProfileContext();
	const { professionalMode } = ctx;

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

	// Format date
	function formatDate(date: string | Date): string {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	// Type icons
	const typeIcons: Record<TimelineItem['type'], string> = {
		post: '📝',
		artwork: '🎨',
		exhibition: '🖼️',
		collaboration: '🤝',
		milestone: '🏆',
	};
</script>

<div class={`profile-timeline ${className}`} role="feed" aria-label="Artist activity timeline">
	{#each items as item (item.id)}
		<article
			class="profile-timeline__item"
			aria-label={`${item.type} from ${formatDate(item.createdAt)}`}
		>
			<div class="profile-timeline__icon" aria-hidden="true">
				{typeIcons[item.type]}
			</div>

			<div class="profile-timeline__content">
				<time class="profile-timeline__date" datetime={new Date(item.createdAt).toISOString()}>
					{formatDate(item.createdAt)}
				</time>

				<p class="profile-timeline__text">{item.content}</p>

				{#if item.artwork}
					<div class="profile-timeline__artwork">
						<img src={item.artwork.images.preview} alt={item.artwork.title} loading="lazy" />
					</div>
				{/if}

				{#if showSocial && !professionalMode && item.engagement}
					<div class="profile-timeline__engagement">
						<span>{item.engagement.likes} likes</span>
						<span>{item.engagement.comments} comments</span>
					</div>
				{/if}
			</div>
		</article>
	{/each}

	{#if hasMore}
		<div bind:this={sentinelRef} class="profile-timeline__sentinel" aria-hidden="true">
			{#if isLoading}
				<div class="profile-timeline__loader">Loading more...</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.profile-timeline {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
	}

	.profile-timeline__item {
		display: flex;
		gap: var(--gr-spacing-scale-4);
	}

	.profile-timeline__icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--gr-font-size-xl);
		background: var(--gr-color-gray-800);
		border-radius: 50%;
	}

	.profile-timeline__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.profile-timeline__date {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-500);
	}

	.profile-timeline__text {
		margin: 0;
		color: var(--gr-color-gray-200);
		line-height: 1.6;
	}

	.profile-timeline__artwork {
		margin-top: var(--gr-spacing-scale-2);
		border-radius: var(--gr-radii-md);
		overflow: hidden;
	}

	.profile-timeline__artwork img {
		width: 100%;
		max-width: 400px;
		height: auto;
		display: block;
	}

	.profile-timeline__engagement {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-500);
	}

	.profile-timeline__sentinel {
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-timeline__loader {
		color: var(--gr-color-gray-500);
		font-size: var(--gr-font-size-sm);
	}
</style>
