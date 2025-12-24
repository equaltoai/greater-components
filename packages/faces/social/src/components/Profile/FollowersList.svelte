<!--
Profile.FollowersList - Display and manage followers

Shows list of followers with search, pagination, and management actions.
Supports removing followers (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components/faces/social';
  
  const followers = [
    { id: '1', username: 'john', displayName: 'John Doe', avatar: '...' }
  ];
</script>

<Profile.FollowersList {followers} isOwnProfile={true} />
```
-->

<script lang="ts">
	import type { ProfileData } from './context.js';
	import { formatCount, getProfileContext } from './context.js';

	interface Props {
		/**
		 * List of followers
		 */
		followers?: ProfileData[];

		/**
		 * Whether this is the current user's profile
		 */
		isOwnProfile?: boolean;

		/**
		 * Whether more followers can be loaded
		 */
		hasMore?: boolean;

		/**
		 * Total follower count (from server pagination metadata)
		 */
		totalCount?: number;

		/**
		 * Whether followers are currently loading
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
		followers: providedFollowers,
		isOwnProfile = false,
		hasMore: providedHasMore,
		totalCount: providedTotalCount,
		loading: providedLoading,
		enableSearch = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let searchQuery = $state('');
	let removingIds = $state<Set<string>>(new Set());
	const followers = $derived(providedFollowers ?? context.state.followers);
	const hasMore = $derived(providedHasMore ?? Boolean(context.state.followersCursor));
	const totalCount = $derived(
		providedTotalCount ?? context.state.followersTotal ?? followers.length
	);
	const loading = $derived(providedLoading ?? context.state.followersLoading);
	const displayCount = $derived(totalCount);

	/**
	 * Filter followers based on search query
	 */
	const filteredFollowers = $derived(
		searchQuery.trim() === ''
			? followers
			: followers.filter((follower) => {
					const query = searchQuery.toLowerCase();
					return (
						follower.username.toLowerCase().includes(query) ||
						follower.displayName.toLowerCase().includes(query)
					);
				})
	);

	/**
	 * Handle search query change
	 */
	function handleSearch(query: string) {
		searchQuery = query;
		if (context.handlers.onSearchFollowers) {
			context.handlers.onSearchFollowers(query);
		}
	}

	/**
	 * Handle load more
	 */
	async function handleLoadMore() {
		if (context.handlers.onLoadMoreFollowers) {
			await context.handlers.onLoadMoreFollowers();
		}
	}

	/**
	 * Handle remove follower (only for own profile)
	 */
	async function handleRemoveFollower(userId: string) {
		if (!isOwnProfile || removingIds.has(userId) || !context.handlers.onRemoveFollower) {
			return;
		}

		if (!confirm('Remove this follower?')) {
			return;
		}

		removingIds.add(userId);
		try {
			await context.handlers.onRemoveFollower(userId);
		} catch (err) {
			console.error('Failed to remove follower:', err);
		} finally {
			removingIds.delete(userId);
		}
	}

	/**
	 * Handle follow/unfollow action
	 */
	async function handleToggleFollow(follower: ProfileData) {
		const isFollowing = follower.relationship?.following ?? false;

		try {
			if (isFollowing) {
				if (context.handlers.onUnfollow) {
					await context.handlers.onUnfollow(follower.id);
				}
			} else {
				if (context.handlers.onFollow) {
					await context.handlers.onFollow(follower.id);
				}
			}
		} catch (err) {
			console.error('Failed to toggle follow:', err);
		}
	}
</script>

<div class={`followers-list ${className}`}>
	<div class="followers-list__header">
		<h2 class="followers-list__title">
			Followers
			{#if displayCount > 0}
				<span class="followers-list__count">({formatCount(displayCount)})</span>
			{/if}
		</h2>

		{#if enableSearch && followers.length > 0}
			<input
				type="search"
				class="followers-list__search"
				placeholder="Search followers..."
				value={searchQuery}
				oninput={(e) => handleSearch(e.currentTarget.value)}
			/>
		{/if}
	</div>

	<div class="followers-list__content">
		{#if filteredFollowers.length === 0}
			<div class="followers-list__empty">
				{#if followers.length === 0}
					<p>No followers yet</p>
				{:else}
					<p>No followers match your search</p>
				{/if}
			</div>
		{:else}
			<div class="followers-list__items">
				{#each filteredFollowers as follower (follower.id)}
					{@const isRemoving = removingIds.has(follower.id)}
					{@const isFollowing = follower.relationship?.following ?? false}
					{@const isMutual = follower.relationship?.followedBy ?? false}

					<div class="followers-list__item">
						<div class="followers-list__account">
							{#if follower.avatar}
								<img src={follower.avatar} alt="" class="followers-list__avatar" loading="lazy" />
							{:else}
								<div class="followers-list__avatar-placeholder" aria-hidden="true">
									{follower.displayName[0]?.toUpperCase() || '?'}
								</div>
							{/if}

							<div class="followers-list__info">
								<div class="followers-list__names">
									<span class="followers-list__display-name">
										{follower.displayName}
										{#if isMutual}
											<span class="followers-list__badge" title="Follows you"> Mutual </span>
										{/if}
									</span>
									<span class="followers-list__username">
										@{follower.username}
									</span>
								</div>
								{#if follower.bio}
									<p class="followers-list__bio">
										{follower.bio.replace(/<[^>]*>/g, '')}
									</p>
								{/if}
							</div>
						</div>

						<div class="followers-list__actions">
							{#if isOwnProfile}
								<button
									class="followers-list__button followers-list__button--remove"
									onclick={() => handleRemoveFollower(follower.id)}
									disabled={isRemoving}
									type="button"
									aria-label={`Remove ${follower.displayName} as follower`}
								>
									{isRemoving ? 'Removing...' : 'Remove'}
								</button>
							{:else if !isMutual}
								<button
									class="followers-list__button followers-list__button--follow"
									onclick={() => handleToggleFollow(follower)}
									type="button"
									aria-label={isFollowing
										? `Unfollow ${follower.displayName}`
										: `Follow ${follower.displayName}`}
								>
									{isFollowing ? 'Following' : 'Follow'}
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if hasMore && !loading}
			<button class="followers-list__load-more" onclick={handleLoadMore} type="button">
				Load More
			</button>
		{/if}

		{#if loading}
			<div class="followers-list__loading">
				<div class="followers-list__spinner" aria-label="Loading followers"></div>
			</div>
		{/if}
	</div>
</div>
