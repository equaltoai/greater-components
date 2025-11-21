<!--
Profile.FollowingList - Display accounts being followed

Shows list of accounts the user follows with search and pagination.
Supports unfollow action.

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
  const following = [
    { id: '1', username: 'jane', displayName: 'Jane Smith', avatar: '...' }
  ];
</script>

<Profile.FollowingList {following} />
```
-->

<script lang="ts">
	import type { ProfileData } from './context.js';
	import { formatCount, getProfileContext } from './context.js';

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
		 * Total following count (from server pagination metadata)
		 */
		totalCount?: number;

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
		following: providedFollowing,
		hasMore: providedHasMore,
		totalCount: providedTotalCount,
		loading: providedLoading,
		enableSearch = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let searchQuery = $state('');
	let unfollowingIds = $state<Set<string>>(new Set());
	const following = $derived(providedFollowing ?? context.state.following);
	const hasMore = $derived(providedHasMore ?? Boolean(context.state.followingCursor));
	const totalCount = $derived(
		providedTotalCount ?? context.state.followingTotal ?? following.length
	);
	const loading = $derived(providedLoading ?? context.state.followingLoading);
	const displayCount = $derived(totalCount);

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

<div class={`following-list ${className}`}>
	<div class="following-list__header">
		<h2 class="following-list__title">
			Following
			{#if displayCount > 0}
				<span class="following-list__count">({formatCount(displayCount)})</span>
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
								aria-label={`Unfollow ${account.displayName}`}
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
