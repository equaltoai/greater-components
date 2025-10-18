<!--
Profile.FollowersList - Display and manage followers

Shows list of followers with search, pagination, and management actions.
Supports removing followers (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@greater/fediverse';
  
  const followers = [
    { id: '1', username: 'john', displayName: 'John Doe', avatar: '...' }
  ];
</script>

<Profile.FollowersList {followers} isOwnProfile={true} />
```
-->

<script lang="ts">
	import type { ProfileData } from './context.js';
	import { getProfileContext } from './context.js';

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
		followers = [],
		isOwnProfile = false,
		hasMore = false,
		loading = false,
		enableSearch = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let searchQuery = $state('');
	let removingIds = $state<Set<string>>(new Set());

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
			{#if followers.length > 0}
				<span class="followers-list__count">({followers.length})</span>
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

<style>
	.followers-list {
		width: 100%;
	}

	.followers-list__header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.followers-list__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		margin: 0;
	}

	.followers-list__count {
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	.followers-list__search {
		padding: 0.625rem 1rem;
		font-size: 0.9375rem;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 9999px;
		background: var(--input-bg, #f7f9fa);
		color: var(--text-primary, #0f1419);
		outline: none;
		transition: all 0.2s;
	}

	.followers-list__search:focus {
		border-color: var(--primary-color, #1d9bf0);
		background: white;
	}

	.followers-list__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.followers-list__items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.followers-list__item {
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

	.followers-list__item:hover {
		background: var(--item-hover-bg, #eff3f4);
	}

	.followers-list__account {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.followers-list__avatar,
	.followers-list__avatar-placeholder {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.followers-list__avatar {
		object-fit: cover;
	}

	.followers-list__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--avatar-placeholder-bg, #cfd9de);
		color: var(--avatar-placeholder-text, #536471);
		font-weight: 600;
		font-size: 1.25rem;
	}

	.followers-list__info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.followers-list__names {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.followers-list__display-name {
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

	.followers-list__badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--badge-bg, #e8f5e9);
		color: var(--badge-text, #2e7d32);
		border-radius: 0.25rem;
		flex-shrink: 0;
	}

	.followers-list__username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.followers-list__bio {
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

	.followers-list__actions {
		flex-shrink: 0;
	}

	.followers-list__button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.followers-list__button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.followers-list__button--remove {
		background: transparent;
		color: var(--error-color, #f44336);
		border: 1px solid var(--error-color, #f44336);
	}

	.followers-list__button--remove:hover:not(:disabled) {
		background: var(--error-color, #f44336);
		color: white;
	}

	.followers-list__button--follow {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.followers-list__button--follow:hover:not(:disabled) {
		background: var(--primary-hover, #1a8cd8);
	}

	.followers-list__load-more {
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

	.followers-list__load-more:hover {
		background: var(--button-hover-bg, #f7f9fa);
	}

	.followers-list__empty {
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.followers-list__empty p {
		margin: 0;
	}

	.followers-list__loading {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.followers-list__spinner {
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
		.followers-list__item {
			flex-direction: column;
			gap: 0.75rem;
		}

		.followers-list__actions {
			width: 100%;
		}

		.followers-list__button {
			width: 100%;
		}
	}
</style>
