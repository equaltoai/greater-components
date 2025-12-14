<!--
ArtistProfile.Actions - Profile action buttons

Features:
- Follow, message, commission buttons
- State management for follow status
- Commission availability indicator

@component
@example
```svelte
<ArtistProfile.Actions />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';

	interface Props {
		/**
		 * Show follow button
		 */
		showFollow?: boolean;

		/**
		 * Show message button
		 */
		showMessage?: boolean;

		/**
		 * Show commission button
		 */
		showCommission?: boolean;

		/**
		 * Button size
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showFollow = true,
		showMessage = true,
		showCommission = true,
		size = 'md',
		class: className = '',
	}: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist, isOwnProfile, handlers, professionalMode } = ctx;

	// Local follow state (would be synced with server in real app)
	let isFollowing = $state(ctx.isFollowing);
	let isLoading = $state(false);

	// Commission status labels
	const commissionLabels = {
		open: 'Open for Commissions',
		closed: 'Commissions Closed',
		waitlist: 'Join Waitlist',
	};

	// Handle follow/unfollow
	async function handleFollow() {
		if (isLoading) return;
		isLoading = true;

		try {
			if (isFollowing) {
				await handlers.onUnfollow?.();
			} else {
				await handlers.onFollow?.();
			}
			isFollowing = !isFollowing;
		} finally {
			isLoading = false;
		}
	}

	// Handle message
	function handleMessage() {
		handlers.onMessage?.();
	}

	// Handle commission
	function handleCommission() {
		handlers.onCommission?.();
	}
</script>

{#if !isOwnProfile}
	<div
		class={`profile-actions profile-actions--${size} ${className}`}
		role="group"
		aria-label="Profile actions"
	>
		{#if showFollow && !professionalMode}
			<button
				class="profile-actions__button profile-actions__button--follow"
				class:following={isFollowing}
				onclick={handleFollow}
				disabled={isLoading}
				aria-pressed={isFollowing}
			>
				{#if isLoading}
					<span class="profile-actions__spinner" aria-hidden="true"></span>
				{:else if isFollowing}
					Following
				{:else}
					Follow
				{/if}
			</button>
		{/if}

		{#if showMessage}
			<button
				class="profile-actions__button profile-actions__button--message"
				onclick={handleMessage}
				aria-label="Send message to {artist.displayName}"
			>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M2 4h16v12H4l-2 2V4z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Message</span>
			</button>
		{/if}

		{#if showCommission && artist.commissionStatus !== 'closed'}
			<button
				class="profile-actions__button profile-actions__button--commission"
				class:waitlist={artist.commissionStatus === 'waitlist'}
				onclick={handleCommission}
			>
				{commissionLabels[artist.commissionStatus]}
			</button>
		{/if}
	</div>
{/if}

<style>
	.profile-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-3);
	}

	.profile-actions__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		border: 1px solid transparent;
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.profile-actions__button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.profile-actions__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Follow button */
	.profile-actions__button--follow {
		background: var(--gr-color-primary-600);
		color: white;
		min-width: 100px;
	}

	.profile-actions__button--follow:hover:not(:disabled) {
		background: var(--gr-color-primary-700);
	}

	.profile-actions__button--follow.following {
		background: transparent;
		border-color: var(--gr-color-gray-600);
		color: var(--gr-color-gray-200);
	}

	.profile-actions__button--follow.following:hover:not(:disabled) {
		border-color: var(--gr-color-error-500);
		color: var(--gr-color-error-500);
	}

	/* Message button */
	.profile-actions__button--message {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-100);
	}

	.profile-actions__button--message:hover:not(:disabled) {
		background: var(--gr-color-gray-600);
	}

	/* Commission button */
	.profile-actions__button--commission {
		background: var(--gr-color-success-600);
		color: white;
	}

	.profile-actions__button--commission:hover:not(:disabled) {
		background: var(--gr-color-success-700);
	}

	.profile-actions__button--commission.waitlist {
		background: var(--gr-color-warning-600);
	}

	.profile-actions__button--commission.waitlist:hover:not(:disabled) {
		background: var(--gr-color-warning-700);
	}

	/* Spinner */
	.profile-actions__spinner {
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

	/* Size variants */
	.profile-actions--sm .profile-actions__button {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-xs);
	}

	.profile-actions--lg .profile-actions__button {
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-6);
		font-size: var(--gr-font-size-md);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-actions__button {
			transition: none;
		}

		.profile-actions__spinner {
			animation: none;
		}
	}
</style>
