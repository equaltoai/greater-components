<!--
WorkInProgress.Header - Thread header with title, artist, and status

@component
-->

<script lang="ts">
	import { getWIPContext } from './context.js';

	interface Props {
		/**
		 * Show follow button
		 */
		showFollow?: boolean;

		/**
		 * Show share button
		 */
		showShare?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showFollow = true, showShare = true, class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread, config, handlers } = ctx;

	// Format date
	const createdDate = $derived(
		new Date(thread.createdAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	);

	// Status text
	const statusText = $derived(() => {
		if (thread.isComplete) return 'Completed';
		return 'In Progress';
	});

	// Handle follow
	async function handleFollow() {
		ctx.isFollowing = !ctx.isFollowing;
		await handlers.onFollow?.(thread);
	}

	// Handle share
	async function handleShare() {
		await handlers.onShare?.(thread);
	}
</script>

<header class={`wip-header ${className}`}>
	<!-- Artist info -->
	<div class="wip-header__artist">
		{#if thread.artistAvatar}
			<img src={thread.artistAvatar} alt="" class="wip-header__avatar" />
		{/if}
		<div class="wip-header__artist-info">
			<span class="wip-header__artist-name">{thread.artistName}</span>
			<time class="wip-header__date" datetime={new Date(thread.createdAt).toISOString()}>
				Started {createdDate}
			</time>
		</div>
	</div>

	<!-- Title and status -->
	<div class="wip-header__main">
		<h1 class="wip-header__title">{thread.title}</h1>
		<div class="wip-header__meta">
			<span
				class="wip-header__status"
				data-status={thread.isComplete ? 'completed' : 'in-progress'}
			>
				{statusText()}
			</span>
			<span class="wip-header__versions">
				{thread.updates.length}
				{thread.updates.length === 1 ? 'update' : 'updates'}
			</span>
			{#if config.showProgress}
				<span class="wip-header__progress">
					{thread.currentProgress}% complete
				</span>
			{/if}
		</div>
	</div>

	<!-- Actions -->
	<div class="wip-header__actions">
		{#if showFollow}
			<button
				type="button"
				class="wip-header__action"
				class:following={ctx.isFollowing}
				onclick={handleFollow}
				aria-pressed={ctx.isFollowing}
			>
				{ctx.isFollowing ? 'Following' : 'Follow'}
			</button>
		{/if}
		{#if showShare}
			<button
				type="button"
				class="wip-header__action wip-header__action--secondary"
				onclick={handleShare}
				aria-label="Share thread"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke-width="2" stroke-linecap="round" />
					<polyline
						points="16,6 12,2 8,6"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<line x1="12" y1="2" x2="12" y2="15" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
		{/if}
	</div>
</header>

<style>
	.wip-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-6);
		background: var(--gr-color-gray-800);
	}

	.wip-header__artist {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
	}

	.wip-header__avatar {
		width: 48px;
		height: 48px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.wip-header__artist-info {
		display: flex;
		flex-direction: column;
	}

	.wip-header__artist-name {
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.wip-header__date {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.wip-header__main {
		flex: 1;
		min-width: 200px;
	}

	.wip-header__title {
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-bold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.wip-header__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.wip-header__status {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radius-sm);
		font-weight: var(--gr-font-weight-medium);
	}

	.wip-header__status[data-status='in-progress'] {
		background: var(--gr-color-primary-900);
		color: var(--gr-color-primary-300);
	}

	.wip-header__status[data-status='completed'] {
		background: var(--gr-color-success-900);
		color: var(--gr-color-success-300);
	}

	.wip-header__actions {
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.wip-header__action {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.wip-header__action:hover {
		background: var(--gr-color-primary-700);
	}

	.wip-header__action.following {
		background: var(--gr-color-gray-700);
	}

	.wip-header__action--secondary {
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
	}

	.wip-header__action--secondary svg {
		width: 20px;
		height: 20px;
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-header__action {
			transition: none;
		}
	}
</style>
