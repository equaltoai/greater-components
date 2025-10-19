<!--
Profile.FeaturedHashtags - Featured hashtags on profile

Displays hashtags featured on the profile with usage stats.
Supports drag-and-drop reordering and management (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
  const hashtags = [
    { name: 'svelte', usageCount: 42, lastUsed: '2024-01-15' },
    { name: 'typescript', usageCount: 38, lastUsed: '2024-01-14' }
  ];
</script>

<Profile.FeaturedHashtags {hashtags} isOwnProfile={true} />
```
-->

<script lang="ts">
	import type { FeaturedHashtag } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * List of featured hashtags
		 */
		hashtags?: FeaturedHashtag[];

		/**
		 * Whether this is the current user's profile
		 */
		isOwnProfile?: boolean;

		/**
		 * Enable drag-and-drop reordering
		 */
		enableReordering?: boolean;

		/**
		 * Show usage statistics
		 */
		showStats?: boolean;

		/**
		 * Maximum hashtags to display (0 = all)
		 */
		maxHashtags?: number;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		hashtags = [],
		isOwnProfile = false,
		enableReordering = true,
		showStats = true,
		maxHashtags = 0,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let draggingIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);
	let removingHashtags = $state<Set<string>>(new Set());

	// Local copy for reordering
	let localHashtags = $state<FeaturedHashtag[]>([...hashtags]);

	// Update local copy when prop changes
	$effect(() => {
		localHashtags = [...hashtags];
	});

	/**
	 * Display hashtags (limited if maxHashtags is set)
	 */
	const displayHashtags = $derived<FeaturedHashtag[]>(
		maxHashtags > 0 ? localHashtags.slice(0, maxHashtags) : localHashtags
	);

	/**
	 * Format usage count
	 */
	function formatCount(count: number): string {
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	}

	/**
	 * Format last used date
	 */
	function formatLastUsed(dateString?: string): string {
		if (!dateString) return '';

		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

			if (diffDays === 0) {
				return 'today';
			}
			if (diffDays === 1) {
				return 'yesterday';
			}
			if (diffDays < 7) {
				return `${diffDays}d ago`;
			}
			if (diffDays < 30) {
				return `${Math.floor(diffDays / 7)}w ago`;
			}
			return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		} catch {
			return '';
		}
	}

	/**
	 * Handle drag start
	 */
	function handleDragStart(index: number) {
		if (!isOwnProfile || !enableReordering) return;
		draggingIndex = index;
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent, index: number) {
		if (!isOwnProfile || !enableReordering || draggingIndex === null) return;
		event.preventDefault();
		dragOverIndex = index;
	}

	/**
	 * Handle drop
	 */
	async function handleDrop(event: DragEvent, targetIndex: number) {
		if (!isOwnProfile || !enableReordering || draggingIndex === null) return;
		event.preventDefault();

		// Reorder array
		const newHashtags = [...localHashtags];
		const [removed] = newHashtags.splice(draggingIndex, 1);
		newHashtags.splice(targetIndex, 0, removed);

		localHashtags = newHashtags;
		draggingIndex = null;
		dragOverIndex = null;

		// Notify parent
		if (context.handlers.onReorderHashtags) {
			const names = newHashtags.map((tag) => tag.name);
			await context.handlers.onReorderHashtags(names);
		}
	}

	/**
	 * Handle drag end
	 */
	function handleDragEnd() {
		draggingIndex = null;
		dragOverIndex = null;
	}

	/**
	 * Remove featured hashtag
	 */
	async function handleRemoveHashtag(name: string) {
		if (removingHashtags.has(name) || !context.handlers.onRemoveFeaturedHashtag) {
			return;
		}

		if (!confirm(`Remove #${name} from featured hashtags?`)) {
			return;
		}

		removingHashtags.add(name);
		try {
			await context.handlers.onRemoveFeaturedHashtag(name);
			// Remove from local copy
			localHashtags = localHashtags.filter((tag) => tag.name !== name);
		} catch (err) {
			console.error('Failed to remove featured hashtag:', err);
		} finally {
			removingHashtags.delete(name);
		}
	}
</script>

<div class={`featured-hashtags ${className}`}>
	<div class="featured-hashtags__header">
		<h3 class="featured-hashtags__title">Featured Hashtags</h3>
		{#if hashtags.length > 0}
			<span class="featured-hashtags__count">{hashtags.length}</span>
		{/if}
	</div>

	{#if displayHashtags.length === 0}
		<div class="featured-hashtags__empty">
			{#if isOwnProfile}
				<p>You haven't featured any hashtags yet</p>
				<p class="featured-hashtags__hint">Feature hashtags to showcase topics you post about</p>
			{:else}
				<p>No featured hashtags</p>
			{/if}
		</div>
	{:else}
		<div class="featured-hashtags__list">
			{#each displayHashtags as hashtag, index (hashtag.name)}
				{@const isDragging = draggingIndex === index}
				{@const isDragOver = dragOverIndex === index}
				{@const isRemoving = removingHashtags.has(hashtag.name)}

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="featured-hashtags__item"
					class:featured-hashtags__item--dragging={isDragging}
					class:featured-hashtags__item--drag-over={isDragOver}
					class:featured-hashtags__item--draggable={isOwnProfile && enableReordering}
					draggable={isOwnProfile && enableReordering}
					ondragstart={() => handleDragStart(index)}
					ondragover={(e) => handleDragOver(e, index)}
					ondrop={(e) => handleDrop(e, index)}
					ondragend={handleDragEnd}
					role={isOwnProfile && enableReordering ? 'button' : undefined}
					tabindex={isOwnProfile && enableReordering ? 0 : undefined}
				>
					{#if isOwnProfile && enableReordering}
						<div class="featured-hashtags__drag-handle" aria-label="Drag to reorder">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="4" y1="8" x2="20" y2="8" />
								<line x1="4" y1="16" x2="20" y2="16" />
							</svg>
						</div>
					{/if}

					<div class="featured-hashtags__content">
						<a href={`/tags/${hashtag.name}`} class="featured-hashtags__tag">
							#{hashtag.name}
						</a>

						{#if showStats}
							<div class="featured-hashtags__stats">
								<span class="featured-hashtags__stat" title={`${hashtag.usageCount} posts`}>
									{formatCount(hashtag.usageCount)} posts
								</span>
								{#if hashtag.lastUsed}
									<span class="featured-hashtags__separator">•</span>
									<span class="featured-hashtags__stat" title={`Last used ${hashtag.lastUsed}`}>
										{formatLastUsed(hashtag.lastUsed)}
									</span>
								{/if}
							</div>
						{/if}
					</div>

					{#if isOwnProfile}
						<button
							class="featured-hashtags__remove"
							onclick={() => handleRemoveHashtag(hashtag.name)}
							disabled={isRemoving}
							type="button"
							aria-label={`Remove #${hashtag.name} from featured hashtags`}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					{/if}
				</div>
			{/each}
		</div>

		{#if maxHashtags > 0 && hashtags.length > maxHashtags}
			<div class="featured-hashtags__show-more">
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class="featured-hashtags__show-more-link">
					Show all {hashtags.length} hashtags
				</a>
			</div>
		{/if}
	{/if}
</div>

<style>
	.featured-hashtags {
		width: 100%;
	}

	.featured-hashtags__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.featured-hashtags__title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		margin: 0;
	}

	.featured-hashtags__count {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary, #536471);
		padding: 0.25rem 0.625rem;
		background: var(--count-bg, #eff3f4);
		border-radius: 9999px;
	}

	.featured-hashtags__empty {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.featured-hashtags__empty p {
		margin: 0 0 0.5rem;
	}

	.featured-hashtags__hint {
		font-size: 0.875rem;
		color: var(--text-tertiary, #8899a6);
	}

	.featured-hashtags__list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.featured-hashtags__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--item-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.featured-hashtags__item:hover {
		background: var(--item-hover-bg, #eff3f4);
	}

	.featured-hashtags__item--draggable {
		cursor: grab;
	}

	.featured-hashtags__item--draggable:active {
		cursor: grabbing;
	}

	.featured-hashtags__item--dragging {
		opacity: 0.5;
		cursor: grabbing;
	}

	.featured-hashtags__item--drag-over {
		border-color: var(--primary-color, #1d9bf0);
		background: var(--drag-over-bg, #e8f5fe);
	}

	.featured-hashtags__drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary, #8899a6);
		cursor: grab;
		flex-shrink: 0;
	}

	.featured-hashtags__drag-handle:active {
		cursor: grabbing;
	}

	.featured-hashtags__content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		min-width: 0;
	}

	.featured-hashtags__tag {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
		transition: color 0.2s;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.featured-hashtags__tag:hover {
		color: var(--primary-hover, #1a8cd8);
		text-decoration: underline;
	}

	.featured-hashtags__stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.featured-hashtags__stat {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.featured-hashtags__separator {
		color: var(--text-tertiary, #8899a6);
	}

	.featured-hashtags__remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-tertiary, #8899a6);
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.featured-hashtags__remove:hover:not(:disabled) {
		background: var(--remove-hover-bg, #fee);
		color: var(--error-color, #f44336);
	}

	.featured-hashtags__remove:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.featured-hashtags__show-more {
		margin-top: 0.75rem;
		text-align: center;
	}

	.featured-hashtags__show-more-link {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
		transition: color 0.2s;
	}

	.featured-hashtags__show-more-link:hover {
		color: var(--primary-hover, #1a8cd8);
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.featured-hashtags__drag-handle {
			display: none;
		}

		.featured-hashtags__item--draggable {
			cursor: default;
		}
	}
</style>
