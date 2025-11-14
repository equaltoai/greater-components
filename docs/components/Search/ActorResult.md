# Search.ActorResult

**Component**: Account/User Search Result Item  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 14 passing tests

---

## 📋 Overview

`Search.ActorResult` displays an individual actor (user/account) search result with avatar, display name, username, bio, follower count, and a follow/unfollow button. It provides a complete profile preview that users can click to navigate to the full profile, or interact with directly through the follow button.

### **Key Features**:

- ✅ Avatar display with fallback placeholder
- ✅ Display name and username
- ✅ Bio preview (2-line truncation)
- ✅ Follower count display
- ✅ Follow/Following button
- ✅ Click handler for profile navigation
- ✅ Stop-propagation on follow button
- ✅ Responsive layout
- ✅ Hover states
- ✅ Accessibility support
- ✅ Customizable styling
- ✅ Integration with headless button primitive

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';

	const handlers = {
		onSearch: async (options) => {
			const response = await fetch(`/api/search?q=${options.query}&type=actors`);
			return await response.json();
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},

		onFollow: async (actorId) => {
			await fetch(`/api/actors/${actorId}/follow`, { method: 'POST' });
		},
	};
</script>

<Search.Root {handlers}>
	<Search.Bar placeholder="Search people..." />
	<Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop    | Type          | Default | Required | Description           |
| ------- | ------------- | ------- | -------- | --------------------- |
| `actor` | `SearchActor` | -       | **Yes**  | Actor data to display |
| `class` | `string`      | `''`    | No       | Additional CSS class  |

### **SearchActor Interface**

```typescript
interface SearchActor {
	/**
	 * Unique identifier for the actor
	 */
	id: string;

	/**
	 * Username (handle) without @
	 */
	username: string;

	/**
	 * Display name (can contain emojis, special chars)
	 */
	displayName: string;

	/**
	 * Optional avatar URL
	 */
	avatar?: string;

	/**
	 * Optional bio/description (HTML allowed)
	 */
	bio?: string;

	/**
	 * Optional follower count
	 */
	followersCount?: number;

	/**
	 * Optional following state
	 */
	isFollowing?: boolean;

	/**
	 * Optional verified badge
	 */
	verified?: boolean;

	/**
	 * Optional account creation date
	 */
	createdAt?: string;

	/**
	 * Optional post count
	 */
	statusesCount?: number;

	/**
	 * Optional following count
	 */
	followingCount?: number;
}
```

---

## 📤 Events

The component handles events through the Search context:

| Handler        | Parameters             | Description                          |
| -------------- | ---------------------- | ------------------------------------ |
| `onActorClick` | `(actor: SearchActor)` | Called when result is clicked        |
| `onFollow`     | `(actorId: string)`    | Called when follow button is clicked |

---

## 💡 Examples

### Example 1: Basic Actor Result with Follow Functionality

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchActor,
	} from '@equaltoai/greater-components-fediverse/types';

	let followingUsers = $state<Set<string>>(new Set());
	let followCounts = $state<Record<string, number>>({});

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'actors',
				limit: '20',
			});

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				if (!response.ok) {
					throw new Error(`Search failed: ${response.statusText}`);
				}

				const results: SearchResults = await response.json();

				// Update follow states
				results.actors.forEach((actor) => {
					if (actor.isFollowing) {
						followingUsers.add(actor.id);
					}
				});

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor: SearchActor) => {
			console.log('Navigate to profile:', actor);
			window.location.href = `/@${actor.username}`;
		},

		onFollow: async (actorId: string) => {
			const isFollowing = followingUsers.has(actorId);

			try {
				const response = await fetch(
					`/api/actors/${actorId}/${isFollowing ? 'unfollow' : 'follow'}`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					throw new Error(`Follow action failed: ${response.statusText}`);
				}

				// Update follow state
				if (isFollowing) {
					followingUsers.delete(actorId);
					followCounts[actorId] = (followCounts[actorId] || 0) - 1;
				} else {
					followingUsers.add(actorId);
					followCounts[actorId] = (followCounts[actorId] || 0) + 1;
				}

				console.log(`${isFollowing ? 'Unfollowed' : 'Followed'} actor:`, actorId);
			} catch (error) {
				console.error('Follow error:', error);
				alert('Failed to update follow status. Please try again.');
			}
		},
	};
</script>

<div class="actor-search">
	<h2>Find People</h2>

	<div class="follow-stats">
		<span>Currently following: <strong>{followingUsers.size}</strong> users</span>
		<span>Follow actions: <strong>{Object.keys(followCounts).length}</strong></span>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search for people..." />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.actor-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.follow-stats {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		margin-bottom: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 8px;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.follow-stats strong {
		color: var(--primary-color);
		font-weight: 700;
	}
</style>
```

### Example 2: With Mutual Followers and Verification Badges

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchActor,
	} from '@equaltoai/greater-components-fediverse/types';

	interface ExtendedSearchActor extends SearchActor {
		verified?: boolean;
		mutualFollowers?: string[];
		lastActive?: string;
	}

	let currentUser = $state({ id: 'current-user-id', following: ['user1', 'user2'] });

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'actors',
				limit: '20',
				include: 'mutual_followers,verification',
			});

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const results: SearchResults = await response.json();

				// Enhance results with mutual follower data
				const enhancedActors = results.actors.map((actor: ExtendedSearchActor) => ({
					...actor,
					mutualFollowers: actor.mutualFollowers || [],
					verified: actor.verified || false,
				}));

				return {
					...results,
					actors: enhancedActors,
				};
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},

		onFollow: async (actorId) => {
			const response = await fetch(`/api/actors/${actorId}/follow`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			if (response.ok) {
				currentUser.following = [...currentUser.following, actorId];
			}
		},
	};

	function getMutualFollowerText(actor: ExtendedSearchActor): string {
		if (!actor.mutualFollowers || actor.mutualFollowers.length === 0) {
			return '';
		}

		const count = actor.mutualFollowers.length;
		if (count === 1) {
			return `Followed by ${actor.mutualFollowers[0]}`;
		} else if (count === 2) {
			return `Followed by ${actor.mutualFollowers[0]} and ${actor.mutualFollowers[1]}`;
		} else {
			return `Followed by ${actor.mutualFollowers[0]} and ${count - 1} other${count - 1 === 1 ? '' : 's'} you follow`;
		}
	}
</script>

<div class="enhanced-actor-search">
	<h2>Discover People</h2>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search verified users, find mutual connections..." />

		<div class="custom-results">
			{#snippet actorResult(actor: ExtendedSearchActor)}
				<article class="enhanced-actor-result">
					<div class="actor-result__avatar">
						{#if actor.avatar}
							<img src={actor.avatar} alt={actor.displayName} loading="lazy" />
						{:else}
							<div class="actor-result__avatar-placeholder">
								{actor.displayName[0]?.toUpperCase()}
							</div>
						{/if}

						{#if actor.verified}
							<div class="verified-badge" title="Verified account">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<div class="actor-result__content">
						<div class="actor-result__header">
							<h4 class="actor-result__name">
								{actor.displayName}
							</h4>
							<span class="actor-result__username">@{actor.username}</span>
						</div>

						{#if actor.bio}
							<p class="actor-result__bio">{@html actor.bio}</p>
						{/if}

						<div class="actor-result__meta">
							{#if actor.followersCount !== undefined}
								<span>{actor.followersCount.toLocaleString()} followers</span>
							{/if}

							{#if actor.mutualFollowers && actor.mutualFollowers.length > 0}
								<span class="mutual-followers">
									🤝 {getMutualFollowerText(actor)}
								</span>
							{/if}

							{#if actor.lastActive}
								<span class="last-active">
									Active {new Date(actor.lastActive).toLocaleDateString()}
								</span>
							{/if}
						</div>
					</div>

					<button
						class="actor-result__follow"
						class:actor-result__follow--following={actor.isFollowing}
						onclick={(e) => {
							e.stopPropagation();
							handlers.onFollow?.(actor.id);
						}}
					>
						{actor.isFollowing ? 'Following' : 'Follow'}
					</button>
				</article>
			{/snippet}
		</div>
	</Search.Root>
</div>

<style>
	.enhanced-actor-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.custom-results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.enhanced-actor-result {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.enhanced-actor-result:hover {
		background: var(--bg-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.actor-result__avatar {
		position: relative;
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		overflow: visible;
		flex-shrink: 0;
	}

	.actor-result__avatar img,
	.actor-result__avatar-placeholder {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}

	.actor-result__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.verified-badge {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 1.5rem;
		height: 1.5rem;
		background: #1d9bf0;
		border: 2px solid var(--bg-primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.verified-badge svg {
		width: 1rem;
		height: 1rem;
		color: white;
	}

	.actor-result__content {
		flex: 1;
		min-width: 0;
	}

	.actor-result__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.actor-result__name {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.actor-result__username {
		font-size: 0.9375rem;
		color: var(--text-secondary);
	}

	.actor-result__bio {
		margin: 0 0 0.75rem 0;
		font-size: 0.9375rem;
		color: var(--text-primary);
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.actor-result__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.mutual-followers {
		color: var(--primary-color);
		font-weight: 600;
	}

	.last-active {
		opacity: 0.7;
	}

	.actor-result__follow {
		padding: 0.625rem 1.5rem;
		background: var(--primary-color);
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		align-self: flex-start;
	}

	.actor-result__follow:hover {
		background: var(--primary-color-dark);
		transform: scale(1.05);
	}

	.actor-result__follow--following {
		background: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.actor-result__follow--following:hover {
		background: var(--error-color);
		border-color: var(--error-color);
		color: white;
	}

	.actor-result__follow--following:hover::after {
		content: ' Unfollow';
	}
</style>
```

### Example 3: With Profile Preview Popover on Hover

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchActor,
	} from '@equaltoai/greater-components-fediverse/types';

	let hoveredActor = $state<SearchActor | null>(null);
	let hoverTimeout = $state<ReturnType<typeof setTimeout> | null>(null);
	let popoverPosition = $state({ top: 0, left: 0 });

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'actors',
				limit: '20',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			return await response.json();
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},
	};

	function handleActorHover(actor: SearchActor, event: MouseEvent) {
		// Clear existing timeout
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}

		// Show popover after 500ms delay
		hoverTimeout = setTimeout(() => {
			hoveredActor = actor;

			const rect = (event.target as HTMLElement).getBoundingClientRect();
			popoverPosition = {
				top: rect.top + window.scrollY,
				left: rect.right + 10,
			};
		}, 500);
	}

	function handleActorLeave() {
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}

		// Delay hiding to allow moving to popover
		setTimeout(() => {
			hoveredActor = null;
		}, 200);
	}

	async function loadExtendedProfile(actorId: string) {
		try {
			const response = await fetch(`/api/actors/${actorId}/extended`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			return await response.json();
		} catch (error) {
			console.error('Failed to load extended profile:', error);
			return null;
		}
	}
</script>

<div class="popover-actor-search">
	<h2>Search with Profile Preview</h2>
	<p class="hint">Hover over a result for 500ms to see a detailed preview</p>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search people..." />

		<div class="results-with-popover">
			<Search.Results>
				{#snippet actorResult(actor)}
					<div
						class="hoverable-actor-result"
						onmouseenter={(e) => handleActorHover(actor, e)}
						onmouseleave={handleActorLeave}
					>
						<Search.ActorResult {actor} />
					</div>
				{/snippet}
			</Search.Results>
		</div>
	</Search.Root>

	{#if hoveredActor}
		<div
			class="profile-popover"
			style="top: {popoverPosition.top}px; left: {popoverPosition.left}px;"
			onmouseenter={() => {
				// Keep popover open when hovering
				if (hoverTimeout) clearTimeout(hoverTimeout);
			}}
			onmouseleave={handleActorLeave}
		>
			<div class="popover-header">
				<img
					src={hoveredActor.avatar || '/default-avatar.png'}
					alt={hoveredActor.displayName}
					class="popover-avatar"
				/>
				<div class="popover-names">
					<h4>{hoveredActor.displayName}</h4>
					<span>@{hoveredActor.username}</span>
				</div>
			</div>

			{#if hoveredActor.bio}
				<p class="popover-bio">{@html hoveredActor.bio}</p>
			{/if}

			<div class="popover-stats">
				<div class="stat">
					<strong>{hoveredActor.statusesCount || 0}</strong>
					<span>Posts</span>
				</div>
				<div class="stat">
					<strong>{hoveredActor.followingCount || 0}</strong>
					<span>Following</span>
				</div>
				<div class="stat">
					<strong>{hoveredActor.followersCount || 0}</strong>
					<span>Followers</span>
				</div>
			</div>

			<button
				class="popover-view-profile"
				onclick={() => (window.location.href = `/@${hoveredActor.username}`)}
			>
				View Full Profile →
			</button>
		</div>
	{/if}
</div>

<style>
	.popover-actor-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		position: relative;
	}

	h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.hint {
		margin: 0 0 1.5rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.results-with-popover {
		position: relative;
	}

	.hoverable-actor-result {
		margin-bottom: 0.75rem;
	}

	.profile-popover {
		position: absolute;
		width: 320px;
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.popover-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.popover-avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.popover-names h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.popover-names span {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.popover-bio {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.popover-stats {
		display: flex;
		justify-content: space-around;
		padding: 1rem 0;
		border-top: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
		margin-bottom: 1rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat strong {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.stat span {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.popover-view-profile {
		width: 100%;
		padding: 0.75rem;
		background: var(--primary-color);
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.popover-view-profile:hover {
		background: var(--primary-color-dark);
		transform: scale(1.02);
	}
</style>
```

### Example 4: With Recommendation Scores and Follow Suggestions

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchActor,
	} from '@equaltoai/greater-components-fediverse/types';

	interface ScoredActor extends SearchActor {
		relevanceScore?: number;
		matchReasons?: string[];
		recommendationSource?: 'search' | 'similar' | 'trending';
	}

	let recommendedActors = $state<ScoredActor[]>([]);
	let showRecommendations = $state(true);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'actors',
				limit: '20',
				include_scores: 'true',
			});

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const results: SearchResults = await response.json();

				// Fetch recommendations based on search
				if (results.actors.length > 0) {
					fetchRecommendations(results.actors[0].id);
				}

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},
	};

	async function fetchRecommendations(baseActorId: string) {
		try {
			const response = await fetch(`/api/actors/${baseActorId}/recommendations`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			const data = await response.json();
			recommendedActors = data.recommendations || [];
		} catch (error) {
			console.error('Failed to fetch recommendations:', error);
		}
	}

	function getRelevanceColor(score: number): string {
		if (score >= 90) return '#10b981'; // Green
		if (score >= 70) return '#3b82f6'; // Blue
		if (score >= 50) return '#f59e0b'; // Orange
		return '#6b7280'; // Gray
	}

	function getMatchReasonsText(reasons: string[]): string {
		if (!reasons || reasons.length === 0) return '';

		return reasons
			.map((reason) => {
				switch (reason) {
					case 'username_match':
						return '📛 Username match';
					case 'bio_match':
						return '📝 Bio match';
					case 'mutual_followers':
						return '🤝 Mutual connections';
					case 'similar_interests':
						return '🎯 Similar interests';
					case 'trending':
						return '📈 Trending';
					default:
						return reason;
				}
			})
			.join(' • ');
	}
</script>

<div class="scored-actor-search">
	<h2>Smart People Search</h2>
	<p class="description">
		Results are ranked by relevance with match reasons and personalized recommendations
	</p>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search for people..." />

		<div class="smart-results">
			<Search.Results>
				{#snippet actorResult(actor: ScoredActor)}
					<article class="scored-actor-result">
						<div class="actor-result__main">
							<div class="actor-result__avatar">
								{#if actor.avatar}
									<img src={actor.avatar} alt={actor.displayName} loading="lazy" />
								{:else}
									<div class="actor-result__avatar-placeholder">
										{actor.displayName[0]?.toUpperCase()}
									</div>
								{/if}
							</div>

							<div class="actor-result__content">
								<div class="actor-result__header">
									<h4 class="actor-result__name">{actor.displayName}</h4>
									<span class="actor-result__username">@{actor.username}</span>

									{#if actor.relevanceScore}
										<span
											class="relevance-badge"
											style="background: {getRelevanceColor(actor.relevanceScore)}"
										>
											{actor.relevanceScore}% match
										</span>
									{/if}
								</div>

								{#if actor.matchReasons && actor.matchReasons.length > 0}
									<div class="match-reasons">
										{getMatchReasonsText(actor.matchReasons)}
									</div>
								{/if}

								{#if actor.bio}
									<p class="actor-result__bio">{@html actor.bio}</p>
								{/if}

								{#if actor.followersCount !== undefined}
									<div class="actor-result__stats">
										<span>{actor.followersCount.toLocaleString()} followers</span>
									</div>
								{/if}
							</div>

							<button
								class="actor-result__follow"
								class:actor-result__follow--following={actor.isFollowing}
								onclick={(e) => {
									e.stopPropagation();
									handlers.onFollow?.(actor.id);
								}}
							>
								{actor.isFollowing ? 'Following' : 'Follow'}
							</button>
						</div>
					</article>
				{/snippet}
			</Search.Results>

			{#if showRecommendations && recommendedActors.length > 0}
				<aside class="recommendations-panel">
					<div class="recommendations-header">
						<h3>You might also like</h3>
						<button class="close-recommendations" onclick={() => (showRecommendations = false)}>
							✕
						</button>
					</div>

					<div class="recommendations-list">
						{#each recommendedActors as actor}
							<div class="recommendation-item">
								<img
									src={actor.avatar || '/default-avatar.png'}
									alt={actor.displayName}
									class="recommendation-avatar"
								/>
								<div class="recommendation-info">
									<strong>{actor.displayName}</strong>
									<span>@{actor.username}</span>
								</div>
								<button class="recommendation-follow" onclick={() => handlers.onFollow?.(actor.id)}>
									Follow
								</button>
							</div>
						{/each}
					</div>
				</aside>
			{/if}
		</div>
	</Search.Root>
</div>

<style>
	.scored-actor-search {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.description {
		margin: 0 0 1.5rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.smart-results {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
	}

	.scored-actor-result {
		margin-bottom: 1rem;
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.scored-actor-result:hover {
		background: var(--bg-hover);
		transform: translateX(4px);
	}

	.actor-result__main {
		display: flex;
		gap: 1rem;
	}

	.actor-result__avatar {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}

	.actor-result__avatar img,
	.actor-result__avatar-placeholder {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.actor-result__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.actor-result__content {
		flex: 1;
		min-width: 0;
	}

	.actor-result__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		flex-wrap: wrap;
	}

	.actor-result__name {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.actor-result__username {
		font-size: 0.9375rem;
		color: var(--text-secondary);
	}

	.relevance-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
	}

	.match-reasons {
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.actor-result__bio {
		margin: 0.5rem 0;
		font-size: 0.9375rem;
		color: var(--text-primary);
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.actor-result__stats {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.actor-result__follow {
		padding: 0.625rem 1.5rem;
		background: var(--primary-color);
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		align-self: flex-start;
	}

	.actor-result__follow:hover {
		background: var(--primary-color-dark);
	}

	.actor-result__follow--following {
		background: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.recommendations-panel {
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
		height: fit-content;
		position: sticky;
		top: 1rem;
	}

	.recommendations-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.recommendations-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.close-recommendations {
		background: none;
		border: none;
		font-size: 1.25rem;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.25rem;
	}

	.recommendations-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.recommendation-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.recommendation-avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.recommendation-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.recommendation-info strong {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recommendation-info span {
		font-size: 0.75rem;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recommendation-follow {
		padding: 0.375rem 0.75rem;
		background: var(--primary-color);
		border: none;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.recommendation-follow:hover {
		background: var(--primary-color-dark);
	}

	@media (max-width: 1024px) {
		.smart-results {
			grid-template-columns: 1fr;
		}

		.recommendations-panel {
			position: relative;
			top: 0;
		}
	}
</style>
```

### Example 5: With Bulk Follow Actions and List Management

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchActor,
	} from '@equaltoai/greater-components-fediverse/types';

	let selectedActors = $state<Set<string>>(new Set());
	let bulkActionInProgress = $state(false);
	let lists = $state([
		{ id: '1', name: 'Tech Influencers' },
		{ id: '2', name: 'Artists' },
		{ id: '3', name: 'Friends' },
	]);
	let showListModal = $state(false);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			selectedActors.clear(); // Reset selection on new search

			const params = new URLSearchParams({
				q: options.query,
				type: 'actors',
				limit: '20',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			return await response.json();
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},
	};

	function toggleSelection(actorId: string) {
		if (selectedActors.has(actorId)) {
			selectedActors.delete(actorId);
		} else {
			selectedActors.add(actorId);
		}

		// Trigger reactivity
		selectedActors = new Set(selectedActors);
	}

	async function bulkFollow() {
		if (selectedActors.size === 0 || bulkActionInProgress) return;

		bulkActionInProgress = true;

		try {
			await Promise.all(
				Array.from(selectedActors).map((actorId) =>
					fetch(`/api/actors/${actorId}/follow`, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
						},
					})
				)
			);

			alert(`Successfully followed ${selectedActors.size} users`);
			selectedActors.clear();
		} catch (error) {
			console.error('Bulk follow error:', error);
			alert('Some follow actions failed');
		} finally {
			bulkActionInProgress = false;
		}
	}

	async function addToList(listId: string) {
		if (selectedActors.size === 0 || bulkActionInProgress) return;

		bulkActionInProgress = true;

		try {
			await fetch(`/api/lists/${listId}/accounts`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					accountIds: Array.from(selectedActors),
				}),
			});

			const list = lists.find((l) => l.id === listId);
			alert(`Added ${selectedActors.size} users to ${list?.name}`);
			selectedActors.clear();
			showListModal = false;
		} catch (error) {
			console.error('Add to list error:', error);
			alert('Failed to add users to list');
		} finally {
			bulkActionInProgress = false;
		}
	}
</script>

<div class="bulk-action-search">
	<h2>Bulk Follow & List Management</h2>

	{#if selectedActors.size > 0}
		<div class="bulk-actions-bar">
			<span class="selection-count">
				{selectedActors.size} user{selectedActors.size === 1 ? '' : 's'} selected
			</span>

			<div class="bulk-actions">
				<button class="bulk-action-btn" onclick={bulkFollow} disabled={bulkActionInProgress}>
					Follow All
				</button>

				<button
					class="bulk-action-btn"
					onclick={() => (showListModal = true)}
					disabled={bulkActionInProgress}
				>
					Add to List
				</button>

				<button class="bulk-action-btn clear" onclick={() => selectedActors.clear()}>
					Clear Selection
				</button>
			</div>
		</div>
	{/if}

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search people to follow..." />

		<Search.Results>
			{#snippet actorResult(actor)}
				<article
					class="selectable-actor-result"
					class:selectable-actor-result--selected={selectedActors.has(actor.id)}
				>
					<input
						type="checkbox"
						class="actor-checkbox"
						checked={selectedActors.has(actor.id)}
						onchange={() => toggleSelection(actor.id)}
						onclick={(e) => e.stopPropagation()}
					/>

					<Search.ActorResult {actor} />
				</article>
			{/snippet}
		</Search.Results>
	</Search.Root>
</div>

{#if showListModal}
	<div class="modal-overlay" onclick={() => (showListModal = false)}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<h3>Add to List</h3>
			<p>Select a list to add {selectedActors.size} user{selectedActors.size === 1 ? '' : 's'}:</p>

			<div class="list-options">
				{#each lists as list}
					<button
						class="list-option"
						onclick={() => addToList(list.id)}
						disabled={bulkActionInProgress}
					>
						{list.name}
					</button>
				{/each}
			</div>

			<button class="modal-close" onclick={() => (showListModal = false)}> Cancel </button>
		</div>
	</div>
{/if}

<style>
	.bulk-action-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.bulk-actions-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 8px;
		color: white;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.selection-count {
		font-weight: 700;
	}

	.bulk-actions {
		display: flex;
		gap: 0.5rem;
	}

	.bulk-action-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.bulk-action-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.05);
	}

	.bulk-action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.bulk-action-btn.clear {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.3);
	}

	.selectable-actor-result {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-primary);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		transition: all 0.2s;
	}

	.selectable-actor-result--selected {
		border-color: var(--primary-color);
		background: rgba(29, 155, 240, 0.05);
	}

	.actor-checkbox {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		width: 90%;
		max-width: 400px;
		padding: 2rem;
		background: var(--bg-primary);
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		animation: scaleIn 0.2s ease-out;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.modal-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.modal-content p {
		margin: 0 0 1.5rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.list-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.list-option {
		padding: 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.list-option:hover:not(:disabled) {
		background: var(--bg-hover);
		border-color: var(--primary-color);
	}

	.list-option:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.modal-close {
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.modal-close:hover {
		background: var(--bg-hover);
	}
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class                               | Description           |
| ----------------------------------- | --------------------- |
| `.actor-result`                     | Root result container |
| `.actor-result__avatar`             | Avatar container      |
| `.actor-result__avatar-placeholder` | Avatar fallback       |
| `.actor-result__content`            | Content container     |
| `.actor-result__header`             | Name/username header  |
| `.actor-result__name`               | Display name          |
| `.actor-result__username`           | Username/handle       |
| `.actor-result__bio`                | Bio text              |
| `.actor-result__stats`              | Stats (followers)     |
| `.actor-result__follow`             | Follow button         |
| `.actor-result__follow--following`  | Following state       |

### **CSS Custom Properties**

```css
:root {
	--bg-primary: #ffffff;
	--bg-secondary: #f7f9fa;
	--bg-hover: #eff3f4;
	--border-color: #e1e8ed;
	--text-primary: #0f1419;
	--text-secondary: #536471;
	--primary-color: #1d9bf0;
	--primary-color-dark: #1a8cd8;
}
```

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<article role="article" aria-label="Search result for Alice">
	<img alt="Alice's profile picture" />
	<button aria-label="Follow Alice">Follow</button>
</article>
```

### **Keyboard Navigation**

- Tab through results and buttons
- Enter/Space to activate follow button
- Click result for navigation

---

## 🔒 Security

### **Content Sanitization**

Bio HTML is sanitized before rendering:

```typescript
import DOMPurify from 'dompurify';

const sanitizedBio = DOMPurify.sanitize(actor.bio);
```

---

## ⚡ Performance

- **Image lazy loading**: `loading="lazy"`
- **Avatar placeholder**: Instant render while image loads
- **Event delegation**: Optimized click handlers

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/ActorResult.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.ActorResult', () => {
	it('renders actor information', () => {
		const actor = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			bio: 'Software engineer',
			followersCount: 1000,
		};

		render(Search.ActorResult, { props: { actor } });

		expect(screen.getByText('Alice')).toBeInTheDocument();
		expect(screen.getByText('@alice')).toBeInTheDocument();
		expect(screen.getByText('Software engineer')).toBeInTheDocument();
	});

	it('calls onFollow when follow button clicked', async () => {
		const onFollow = vi.fn();
		const actor = { id: '1', username: 'alice', displayName: 'Alice' };

		render(Search.Root, { props: { handlers: { onFollow } } });
		render(Search.ActorResult, { props: { actor } });

		const followBtn = screen.getByText('Follow');
		await fireEvent.click(followBtn);

		expect(onFollow).toHaveBeenCalledWith('1');
	});
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Bar](./Bar.md) - Search input
- [Search.Results](./Results.md) - Results container
- [Search.NoteResult](./NoteResult.md) - Post result
- [Search.TagResult](./TagResult.md) - Hashtag result
- [Search.Filters](./Filters.md) - Result type filters

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Profile Components](../Profile/README.md) - User profile components
- [Notifications Components](../Notifications/README.md) - Notification system

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)
