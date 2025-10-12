<!--
Profile.FollowingList - Display accounts being followed

Shows list of accounts the user follows with search and pagination.
Supports unfollow action.

@component
@example
```svelte
<script>
  import { Profile } from '@greater/fediverse';
  
  const following = [
    { id: '1', username: 'jane', displayName: 'Jane Smith', avatar: '...' }
  ];
</script>

<Profile.FollowingList {following} />
```
-->

<script lang="ts">
	import type { ProfileData } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * List of accounts being followed
		 */
		following?: ProfileData[];

		/**
		 * Whether more accounts can be loaded
		 */
		hasMore?: boolean;

		/**
		 * Whether accounts are currently loading
		 */
		loading?: boolean;

		/**
		 * Enable search functionality
		 */
		enableSearch?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		following = [],
		hasMore = false,
		loading = false,
		enableSearch = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let searchQuery = $state('');
	let unfollowingIds = $state<Set<string>>(new Set());

	/**
	 * Filter following based on search query
	 */
	const filteredFollowing = $derived(
		searchQuery.trim() === ''
			? following
			: following.filter((account) => {
					const query = searchQuery.toLowerCase();
					return (
						account.username.toLowerCase().includes(query) ||
						account.displayName.toLowerCase().includes(query)
					);
				})
	);

	/**
	 * Handle search query change
	 */
	function handleSearch(query: string) {
		searchQuery = query;
		if (context.handlers.onSearchFollowing) {
			context.handlers.onSearchFollowing(query);
		}
	}

	/**
	 * Handle load more
	 */
	async function handleLoadMore() {
		if (context.handlers.onLoadMoreFollowing) {
			await context.handlers.onLoadMoreFollowing();
		}
	}

	/**
	 * Handle unfollow action
	 */
	async function handleUnfollow(userId: string, displayName: string) {
		if (unfollowingIds.has(userId) || !context.handlers.onUnfollow) {
			return;
		}

		if (!confirm(`Unfollow ${displayName}?`)) {
			return;
		}

		unfollowingIds.add(userId);
		try {
			await context.handlers.onUnfollow(userId);
		} catch (err) {
			console.error('Failed to unfollow:', err);
		} finally {
			unfollowingIds.delete(userId);
		}
	}
</script>

<div class="following-list {className}">
	<div class="following-list__header">
		<h2 class="following-list__title">
			Following
			{#if following.length > 0}
				<span class="following-list__count">({following.length})</span>
			{/if}
		</h2>

		{#if enableSearch && following.length > 0}
			<input
				type="search"
				class="following-list__search"
				placeholder="Search following..."
				value={searchQuery}
				oninput={(e) => handleSearch(e.currentTarget.value)}
			/>
		{/if}
	</div>

	<div class="following-list__content">
		{#if filteredFollowing.length === 0}
			<div class="following-list__empty">
				{#if following.length === 0}
					<p>Not following anyone yet</p>
				{:else}
					<p>No accounts match your search</p>
				{/if}
			</div>
		{:else}
			<div class="following-list__items">
				{#each filteredFollowing as account (account.id)}
					{@const isUnfollowing = unfollowingIds.has(account.id)}
					{@const isFollowingBack = account.relationship?.followedBy ?? false}

					<div class="following-list__item">
						<div class="following-list__account">
							{#if account.avatar}
								<img src={account.avatar} alt="" class="following-list__avatar" loading="lazy" />
							{:else}
								<div class="following-list__avatar-placeholder" aria-hidden="true">
									{account.displayName[0]?.toUpperCase() || '?'}
								</div>
							{/if}

							<div class="following-list__info">
								<div class="following-list__names">
									<span class="following-list__display-name">
										{account.displayName}
										{#if isFollowingBack}
											<span class="following-list__badge" title="Follows you"> Follows you </span>
										{/if}
									</span>
									<span class="following-list__username">
										@{account.username}
									</span>
								</div>
								{#if account.bio}
									<p class="following-list__bio">
										{account.bio.replace(/<[^>]*>/g, '')}
									</p>
								{/if}
							</div>
						</div>

						<div class="following-list__actions">
							<button
								class="following-list__button following-list__button--unfollow"
								onclick={() => handleUnfollow(account.id, account.displayName)}
								disabled={isUnfollowing}
								type="button"
								aria-label="Unfollow {account.displayName}"
							>
								{isUnfollowing ? 'Unfollowing...' : 'Following'}
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if hasMore && !loading}
			<button class="following-list__load-more" onclick={handleLoadMore} type="button">
				Load More
			</button>
		{/if}

		{#if loading}
			<div class="following-list__loading">
				<div class="following-list__spinner" aria-label="Loading following"></div>
			</div>
		{/if}
	</div>
</div>

<style>
	.following-list {
		width: 100%;
	}

	.following-list__header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.following-list__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		margin: 0;
	}

	.following-list__count {
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	.following-list__search {
		padding: 0.625rem 1rem;
		font-size: 0.9375rem;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 9999px;
		background: var(--input-bg, #f7f9fa);
		color: var(--text-primary, #0f1419);
		outline: none;
		transition: all 0.2s;
	}

	.following-list__search:focus {
		border-color: var(--primary-color, #1d9bf0);
		background: white;
	}

	.following-list__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.following-list__items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.following-list__item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		background: var(--item-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.following-list__item:hover {
		background: var(--item-hover-bg, #eff3f4);
	}

	.following-list__account {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.following-list__avatar,
	.following-list__avatar-placeholder {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.following-list__avatar {
		object-fit: cover;
	}

	.following-list__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--avatar-placeholder-bg, #cfd9de);
		color: var(--avatar-placeholder-text, #536471);
		font-weight: 600;
		font-size: 1.25rem;
	}

	.following-list__info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.following-list__names {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.following-list__display-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.following-list__badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--badge-bg, #e8f5e9);
		color: var(--badge-text, #2e7d32);
		border-radius: 0.25rem;
		flex-shrink: 0;
	}

	.following-list__username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.following-list__bio {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.following-list__actions {
		flex-shrink: 0;
	}

	.following-list__button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.following-list__button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.following-list__button--unfollow {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.following-list__button--unfollow:hover:not(:disabled) {
		background: var(--error-color, #f44336);
	}

	.following-list__load-more {
		width: 100%;
		padding: 0.75rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.following-list__load-more:hover {
		background: var(--button-hover-bg, #f7f9fa);
	}

	.following-list__empty {
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.following-list__empty p {
		margin: 0;
	}

	.following-list__loading {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.following-list__spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--border-color, #eff3f4);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.following-list__item {
			flex-direction: column;
			gap: 0.75rem;
		}

		.following-list__actions {
			width: 100%;
		}

		.following-list__button {
			width: 100%;
		}
	}
</style>
