<!--
Profile.FeaturedHashtags - Featured hashtags on profile

Displays hashtags featured on the profile with usage stats.
Supports drag-and-drop reordering and management (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components/faces/social';
  
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
