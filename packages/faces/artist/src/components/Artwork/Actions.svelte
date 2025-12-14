<!--
Artwork.Actions - Action buttons component

Like, collect, share, comment buttons.
REQ-PHIL-001: Subtle until hover/focus.
Keyboard accessible.
Event handlers from context.

@component
@example
```svelte
<Artwork.Root artwork={artworkData} handlers={{ onLike, onShare }}>
  <Artwork.Actions />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Show like button
		 */
		showLike?: boolean;

		/**
		 * Show collect button
		 */
		showCollect?: boolean;

		/**
		 * Show share button
		 */
		showShare?: boolean;

		/**
		 * Show comment button
		 */
		showComment?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showLike = true,
		showCollect = true,
		showShare = true,
		showComment = true,
		class: className = '',
	}: Props = $props();

	const context = getArtworkContext();
	const { artwork, config, handlers } = context;

	// Action states
	let isLiking = $state(false);
	let isCollecting = $state(false);

	// Handle like action
	async function handleLike() {
		if (isLiking || !handlers.onLike) return;
		isLiking = true;
		try {
			await handlers.onLike(artwork);
			context.isLiked = !context.isLiked;
		} finally {
			isLiking = false;
		}
	}

	// Handle collect action
	async function handleCollect() {
		if (isCollecting || !handlers.onCollect) return;
		isCollecting = true;
		try {
			await handlers.onCollect(artwork);
			context.isCollected = !context.isCollected;
		} finally {
			isCollecting = false;
		}
	}

	// Handle share action
	function handleShare() {
		handlers.onShare?.(artwork);
	}

	// Handle comment action
	function handleComment() {
		handlers.onComment?.(artwork);
	}

	// Compute CSS classes
	const actionsClass = $derived(['gr-artist-artwork-actions', className].filter(Boolean).join(' '));
</script>

{#if config.showActions}
	<div class={actionsClass} role="group" aria-label="Artwork actions">
		{#if showLike}
			<button
				class="gr-artist-artwork-action"
				class:active={context.isLiked}
				onclick={handleLike}
				disabled={isLiking || !handlers.onLike}
				aria-label={context.isLiked ? 'Unlike artwork' : 'Like artwork'}
				aria-pressed={context.isLiked}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill={context.isLiked ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
					/>
				</svg>
				<span class="sr-only">Like</span>
			</button>
		{/if}

		{#if showCollect}
			<button
				class="gr-artist-artwork-action"
				class:active={context.isCollected}
				onclick={handleCollect}
				disabled={isCollecting || !handlers.onCollect}
				aria-label={context.isCollected ? 'Remove from collection' : 'Add to collection'}
				aria-pressed={context.isCollected}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill={context.isCollected ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
				</svg>
				<span class="sr-only">Collect</span>
			</button>
		{/if}

		{#if showShare}
			<button
				class="gr-artist-artwork-action"
				onclick={handleShare}
				disabled={!handlers.onShare}
				aria-label="Share artwork"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
				<span class="sr-only">Share</span>
			</button>
		{/if}

		{#if showComment}
			<button
				class="gr-artist-artwork-action"
				onclick={handleComment}
				disabled={!handlers.onComment}
				aria-label="Comment on artwork"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
				<span class="sr-only">Comment</span>
			</button>
		{/if}
	</div>
{/if}

<style>
	.gr-artist-artwork-actions {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		/* REQ-PHIL-001: Subtle until hover/focus */
		opacity: 0.6;
		transition: opacity var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-actions:hover,
	.gr-artist-artwork-actions:focus-within {
		opacity: 1;
	}

	.gr-artist-artwork-action {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
		cursor: pointer;
		transition:
			color var(--gr-artist-transition-hover, 200ms ease-out),
			background-color var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-action:hover:not(:disabled) {
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
		background: var(--gr-artist-bg-elevated, var(--gr-color-gray-850));
	}

	.gr-artist-artwork-action:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-artwork-action:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gr-artist-artwork-action.active {
		color: var(--gr-color-primary-500);
	}

	.gr-artist-artwork-action svg {
		width: 20px;
		height: 20px;
	}

	/* Screen reader only text */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-actions,
		.gr-artist-artwork-action {
			transition: none;
		}
	}
</style>
