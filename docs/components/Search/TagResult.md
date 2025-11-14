# Search.TagResult

**Component**: Hashtag Search Result Item  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 11 passing tests

---

## 📋 Overview

`Search.TagResult` displays an individual hashtag search result with the tag name, post count, and optional trending indicator. It provides a compact, pill-shaped button that users can click to navigate to the hashtag feed or explore related content.

### **Key Features**:

- ✅ Hashtag name with # prefix
- ✅ Post count display
- ✅ Trending indicator icon
- ✅ Special styling for trending tags
- ✅ Click handler for navigation
- ✅ Pill-shaped design
- ✅ Hover states
- ✅ Formatted count display (1K, 1M)
- ✅ Accessibility support
- ✅ Customizable styling
- ✅ Responsive layout

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
			const response = await fetch(`/api/search?q=${options.query}&type=tags`);
			return await response.json();
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};
</script>

<Search.Root {handlers}>
	<Search.Bar placeholder="Search hashtags..." />
	<Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop    | Type        | Default | Required | Description          |
| ------- | ----------- | ------- | -------- | -------------------- |
| `tag`   | `SearchTag` | -       | **Yes**  | Tag data to display  |
| `class` | `string`    | `''`    | No       | Additional CSS class |

### **SearchTag Interface**

```typescript
interface SearchTag {
	/**
	 * Tag name without # prefix
	 */
	name: string;

	/**
	 * Number of posts using this tag
	 */
	count: number;

	/**
	 * Whether this tag is currently trending
	 */
	trending?: boolean;

	/**
	 * Optional tag description
	 */
	description?: string;

	/**
	 * Optional history data for trend analysis
	 */
	history?: Array<{
		day: string;
		uses: number;
	}>;

	/**
	 * Optional rank in trending list
	 */
	trendingRank?: number;

	/**
	 * Optional category/topic classification
	 */
	category?: string;
}
```

---

## 📤 Events

The component handles events through the Search context:

| Handler      | Parameters         | Description                |
| ------------ | ------------------ | -------------------------- |
| `onTagClick` | `(tag: SearchTag)` | Called when tag is clicked |

---

## 💡 Examples

### Example 1: Basic Tag Results with Trending Indicators

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let trendingCount = $state(0);
	let totalPosts = $state(0);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'tags',
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

				trendingCount = results.tags.filter((tag) => tag.trending).length;
				totalPosts = results.tags.reduce((sum, tag) => sum + tag.count, 0);

				console.log('Tag search completed:', {
					query: options.query,
					trendingCount,
					totalPosts,
				});

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onTagClick: (tag) => {
			console.log('Navigate to tag:', tag);
			window.location.href = `/tags/${tag.name}`;
		},
	};
</script>

<div class="tag-search">
	<h2>Search Hashtags</h2>

	{#if trendingCount > 0 || totalPosts > 0}
		<div class="search-stats">
			<span>🔥 <strong>{trendingCount}</strong> trending tag{trendingCount === 1 ? '' : 's'}</span>
			<span>📊 <strong>{totalPosts.toLocaleString()}</strong> total posts</span>
		</div>
	{/if}

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search hashtags and topics..." />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.tag-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.search-stats {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		margin-bottom: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 8px;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.search-stats strong {
		color: var(--primary-color);
		font-weight: 700;
	}
</style>
```

### Example 2: With Trending Rankings and Sparkline Charts

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchTag,
	} from '@equaltoai/greater-components-fediverse/types';

	interface EnhancedSearchTag extends SearchTag {
		trendingRank?: number;
		history?: Array<{ day: string; uses: number }>;
		growthRate?: number;
	}

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'tags',
				limit: '20',
				include: 'history,ranking',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			const results: SearchResults = await response.json();

			// Calculate growth rates
			results.tags = results.tags.map((tag: EnhancedSearchTag) => {
				if (tag.history && tag.history.length >= 2) {
					const recent = tag.history[tag.history.length - 1].uses;
					const previous = tag.history[tag.history.length - 2].uses;
					tag.growthRate = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
				}
				return tag;
			});

			return results;
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};

	function generateSparkline(history: Array<{ day: string; uses: number }>): string {
		if (!history || history.length === 0) return '';

		const values = history.map((h) => h.uses);
		const max = Math.max(...values);
		const min = Math.min(...values);
		const range = max - min || 1;

		const points = values
			.map((value, index) => {
				const x = (index / (values.length - 1)) * 60;
				const y = 20 - ((value - min) / range) * 15;
				return `${x},${y}`;
			})
			.join(' ');

		return points;
	}

	function getTrendingBadgeColor(rank: number): string {
		if (rank === 1) return '#f59e0b'; // Gold
		if (rank === 2) return '#9ca3af'; // Silver
		if (rank === 3) return '#cd7f32'; // Bronze
		return '#3b82f6'; // Blue
	}

	function getGrowthIndicator(rate: number): string {
		if (rate > 50) return '🚀';
		if (rate > 20) return '📈';
		if (rate > 0) return '↗️';
		if (rate < -20) return '📉';
		return '↔️';
	}
</script>

<div class="trending-tag-search">
	<h2>Trending Hashtags</h2>
	<p class="description">Discover trending topics with historical data and growth indicators</p>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search trending tags..." />

		<div class="enhanced-tag-results">
			{#snippet tagResult(tag: EnhancedSearchTag)}
				<article class="enhanced-tag-result" class:trending={tag.trending}>
					{#if tag.trending && tag.trendingRank}
						<div
							class="trending-rank-badge"
							style="background: {getTrendingBadgeColor(tag.trendingRank)}"
						>
							#{tag.trendingRank}
						</div>
					{/if}

					<div class="tag-result__main">
						<div class="tag-result__header">
							<h3 class="tag-result__name">#{tag.name}</h3>
							{#if tag.trending}
								<span class="trending-indicator"> 🔥 Trending </span>
							{/if}
						</div>

						<div class="tag-result__stats">
							<span class="stat-count">
								<strong>{tag.count.toLocaleString()}</strong> posts
							</span>

							{#if tag.growthRate !== undefined}
								<span class="stat-growth">
									{getGrowthIndicator(tag.growthRate)}
									{Math.abs(tag.growthRate).toFixed(1)}%
								</span>
							{/if}
						</div>

						{#if tag.history && tag.history.length > 0}
							<svg class="sparkline" width="60" height="20" viewBox="0 0 60 20">
								<polyline
									points={generateSparkline(tag.history)}
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								/>
							</svg>
						{/if}
					</div>

					<button
						class="explore-btn"
						onclick={(e) => {
							e.stopPropagation();
							handlers.onTagClick?.(tag);
						}}
					>
						Explore →
					</button>
				</article>
			{/snippet}
		</div>
	</Search.Root>
</div>

<style>
	.trending-tag-search {
		max-width: 800px;
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

	.enhanced-tag-results {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.enhanced-tag-result {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.enhanced-tag-result:hover {
		background: var(--bg-hover);
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.enhanced-tag-result.trending {
		border-color: var(--primary-color);
		background: rgba(29, 155, 240, 0.05);
	}

	.trending-rank-badge {
		position: absolute;
		top: -12px;
		left: 1rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.tag-result__main {
		flex: 1;
		min-width: 0;
	}

	.tag-result__header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.tag-result__name {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--primary-color);
	}

	.trending-indicator {
		padding: 0.25rem 0.5rem;
		background: rgba(239, 68, 68, 0.1);
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
		color: #ef4444;
		white-space: nowrap;
	}

	.tag-result__stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.stat-count {
		color: var(--text-secondary);
	}

	.stat-count strong {
		color: var(--text-primary);
	}

	.stat-growth {
		font-weight: 700;
		color: #10b981;
	}

	.sparkline {
		color: var(--primary-color);
		opacity: 0.6;
	}

	.explore-btn {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.explore-btn:hover {
		background: var(--primary-color-dark);
		transform: scale(1.05);
	}

	@media (max-width: 640px) {
		.enhanced-tag-results {
			grid-template-columns: 1fr;
		}
	}
</style>
```

### Example 3: With Category Grouping and Tag Collections

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchTag,
	} from '@equaltoai/greater-components-fediverse/types';

	interface CategorizedTag extends SearchTag {
		category?: string;
	}

	let groupByCategory = $state(true);
	let tagsByCategory = $state<Record<string, CategorizedTag[]>>({});

	const categoryColors: Record<string, string> = {
		Technology: '#3b82f6',
		Politics: '#ef4444',
		Entertainment: '#8b5cf6',
		Sports: '#10b981',
		Science: '#f59e0b',
		Art: '#ec4899',
	};

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'tags',
				limit: '50',
				include: 'categories',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			const results: SearchResults = await response.json();

			// Group by category
			if (groupByCategory) {
				const grouped: Record<string, CategorizedTag[]> = {};

				results.tags.forEach((tag: CategorizedTag) => {
					const category = tag.category || 'Other';
					if (!grouped[category]) {
						grouped[category] = [];
					}
					grouped[category].push(tag);
				});

				tagsByCategory = grouped;
			}

			return results;
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};

	function followCategory(category: string) {
		console.log('Follow all tags in category:', category);
		// Implement category follow logic
	}
</script>

<div class="categorized-tag-search">
	<div class="search-header">
		<h2>Browse Topics by Category</h2>

		<label class="category-toggle">
			<input type="checkbox" bind:checked={groupByCategory} />
			<span>Group by category</span>
		</label>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search topics and categories..." />

		{#if groupByCategory}
			<div class="categorized-results">
				{#each Object.entries(tagsByCategory) as [category, tags]}
					<section
						class="category-section"
						style="--category-color: {categoryColors[category] || '#6b7280'}"
					>
						<div class="category-header">
							<h3 class="category-name">{category}</h3>
							<div class="category-meta">
								<span class="category-count">{tags.length} tags</span>
								<button class="follow-category-btn" onclick={() => followCategory(category)}>
									Follow All
								</button>
							</div>
						</div>

						<div class="category-tags">
							{#each tags as tag}
								<Search.TagResult {tag} />
							{/each}
						</div>
					</section>
				{/each}
			</div>
		{:else}
			<Search.Results />
		{/if}
	</Search.Root>
</div>

<style>
	.categorized-tag-search {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.search-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.category-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.category-toggle input {
		cursor: pointer;
	}

	.categorized-results {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.category-section {
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 2px solid var(--category-color);
		border-radius: 12px;
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--category-color);
	}

	.category-name {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--category-color);
	}

	.category-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.category-count {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.follow-category-btn {
		padding: 0.375rem 0.75rem;
		background: var(--category-color);
		border: none;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.follow-category-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.category-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
</style>
```

### Example 4: With Follow/Mute Actions and Tag Management

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchTag,
	} from '@equaltoai/greater-components-fediverse/types';

	interface ManagedTag extends SearchTag {
		isFollowing?: boolean;
		isMuted?: boolean;
	}

	let followedTags = $state<Set<string>>(new Set());
	let mutedTags = $state<Set<string>>(new Set());

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'tags',
				limit: '30',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			const results: SearchResults = await response.json();

			// Add follow/mute state
			results.tags = results.tags.map((tag: ManagedTag) => ({
				...tag,
				isFollowing: followedTags.has(tag.name),
				isMuted: mutedTags.has(tag.name),
			}));

			return results;
		},

		onTagClick: (tag) => {
			if (!mutedTags.has(tag.name)) {
				window.location.href = `/tags/${tag.name}`;
			}
		},
	};

	async function toggleFollow(tagName: string, event: MouseEvent) {
		event.stopPropagation();

		const isFollowing = followedTags.has(tagName);

		try {
			const response = await fetch(`/api/tags/${tagName}/follow`, {
				method: isFollowing ? 'DELETE' : 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			if (response.ok) {
				if (isFollowing) {
					followedTags.delete(tagName);
				} else {
					followedTags.add(tagName);
				}
				followedTags = new Set(followedTags);

				localStorage.setItem('followed-tags', JSON.stringify(Array.from(followedTags)));
			}
		} catch (error) {
			console.error('Follow error:', error);
		}
	}

	async function toggleMute(tagName: string, event: MouseEvent) {
		event.stopPropagation();

		const isMuted = mutedTags.has(tagName);

		try {
			const response = await fetch(`/api/tags/${tagName}/mute`, {
				method: isMuted ? 'DELETE' : 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			if (response.ok) {
				if (isMuted) {
					mutedTags.delete(tagName);
				} else {
					mutedTags.add(tagName);
				}
				mutedTags = new Set(mutedTags);

				localStorage.setItem('muted-tags', JSON.stringify(Array.from(mutedTags)));
			}
		} catch (error) {
			console.error('Mute error:', error);
		}
	}

	function exportTagLists() {
		const data = {
			followed: Array.from(followedTags),
			muted: Array.from(mutedTags),
			exportedAt: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `tag-lists-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Load from localStorage
	if (typeof window !== 'undefined') {
		try {
			const savedFollowed = localStorage.getItem('followed-tags');
			if (savedFollowed) {
				followedTags = new Set(JSON.parse(savedFollowed));
			}

			const savedMuted = localStorage.getItem('muted-tags');
			if (savedMuted) {
				mutedTags = new Set(JSON.parse(savedMuted));
			}
		} catch (error) {
			console.error('Failed to load tag lists:', error);
		}
	}
</script>

<div class="managed-tag-search">
	<div class="search-header">
		<h2>Manage Your Tags</h2>

		<div class="tag-stats">
			<span>➕ {followedTags.size} following</span>
			<span>🔇 {mutedTags.size} muted</span>
			<button class="export-btn" onclick={exportTagLists}> Export Lists </button>
		</div>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search tags to follow or mute..." />

		<div class="managed-tag-results">
			{#snippet tagResult(tag: ManagedTag)}
				<article
					class="managed-tag-result"
					class:muted={tag.isMuted}
					class:followed={tag.isFollowing}
				>
					<div class="tag-result__content">
						<h3 class="tag-result__name">#{tag.name}</h3>
						<span class="tag-result__count">
							{tag.count.toLocaleString()} posts
						</span>

						{#if tag.isMuted}
							<span class="muted-badge">Muted</span>
						{/if}

						{#if tag.isFollowing}
							<span class="following-badge">Following</span>
						{/if}
					</div>

					<div class="tag-result__actions">
						<button
							class="action-btn follow-btn"
							class:active={tag.isFollowing}
							onclick={(e) => toggleFollow(tag.name, e)}
							title={tag.isFollowing ? 'Unfollow' : 'Follow'}
						>
							{tag.isFollowing ? '✓ Following' : '+ Follow'}
						</button>

						<button
							class="action-btn mute-btn"
							class:active={tag.isMuted}
							onclick={(e) => toggleMute(tag.name, e)}
							title={tag.isMuted ? 'Unmute' : 'Mute'}
						>
							{tag.isMuted ? 'Unmute' : 'Mute'}
						</button>
					</div>
				</article>
			{/snippet}
		</div>
	</Search.Root>
</div>

<style>
	.managed-tag-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.search-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.tag-stats {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.export-btn {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.export-btn:hover {
		background: var(--primary-color-dark);
		transform: scale(1.05);
	}

	.managed-tag-results {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.managed-tag-result {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: var(--bg-primary);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.managed-tag-result:hover:not(.muted) {
		background: var(--bg-hover);
		transform: translateX(4px);
	}

	.managed-tag-result.muted {
		opacity: 0.5;
		background: var(--bg-secondary);
	}

	.managed-tag-result.followed {
		border-color: var(--primary-color);
		background: rgba(29, 155, 240, 0.05);
	}

	.tag-result__content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.tag-result__name {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--primary-color);
	}

	.tag-result__count {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.muted-badge,
	.following-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.muted-badge {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.following-badge {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.tag-result__actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.action-btn:hover {
		background: var(--bg-hover);
	}

	.follow-btn.active {
		background: var(--primary-color);
		border-color: var(--primary-color);
		color: white;
	}

	.mute-btn.active {
		background: #ef4444;
		border-color: #ef4444;
		color: white;
	}

	@media (max-width: 640px) {
		.search-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.tag-stats {
			justify-content: space-between;
		}

		.managed-tag-result {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.tag-result__content {
			flex-direction: column;
			align-items: flex-start;
		}

		.tag-result__actions {
			width: 100%;
		}

		.action-btn {
			flex: 1;
		}
	}
</style>
```

### Example 5: With Related Tags and Topic Discovery

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchTag,
	} from '@equaltoai/greater-components-fediverse/types';

	interface TagWithRelated extends SearchTag {
		relatedTags?: string[];
	}

	let expandedTag = $state<string | null>(null);
	let relatedTagsMap = $state<Record<string, TagWithRelated[]>>({});

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				type: 'tags',
				limit: '20',
				include: 'related',
			});

			const response = await fetch(`/api/search?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			return await response.json();
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};

	async function toggleExpand(tag: TagWithRelated, event: MouseEvent) {
		event.stopPropagation();

		if (expandedTag === tag.name) {
			expandedTag = null;
			return;
		}

		expandedTag = tag.name;

		// Load related tags if not already loaded
		if (!relatedTagsMap[tag.name]) {
			try {
				const response = await fetch(`/api/tags/${tag.name}/related`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const related = await response.json();
				relatedTagsMap[tag.name] = related;
				relatedTagsMap = { ...relatedTagsMap };
			} catch (error) {
				console.error('Failed to load related tags:', error);
			}
		}
	}

	function navigateToTag(tagName: string, event: MouseEvent) {
		event.stopPropagation();
		window.location.href = `/tags/${tagName}`;
	}
</script>

<div class="discovery-tag-search">
	<h2>Discover Topics</h2>
	<p class="description">Search tags and explore related topics to discover new content</p>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Discover topics and hashtags..." />

		<div class="discovery-tag-results">
			{#snippet tagResult(tag: TagWithRelated)}
				<article class="discovery-tag-result" class:expanded={expandedTag === tag.name}>
					<div class="tag-result__main">
						<div class="tag-result__header">
							<h3 class="tag-result__name">#{tag.name}</h3>
							<span class="tag-result__count">
								{tag.count.toLocaleString()} posts
							</span>
							{#if tag.trending}
								<span class="trending-indicator">🔥</span>
							{/if}
						</div>

						{#if tag.relatedTags && tag.relatedTags.length > 0}
							<button class="expand-btn" onclick={(e) => toggleExpand(tag, e)}>
								{expandedTag === tag.name ? '▼' : '▶'}
								{tag.relatedTags.length} related
							</button>
						{/if}
					</div>

					{#if expandedTag === tag.name && relatedTagsMap[tag.name]}
						<div class="related-tags">
							<h4>Related Topics</h4>
							<div class="related-tags-grid">
								{#each relatedTagsMap[tag.name] as relatedTag}
									<button
										class="related-tag-chip"
										onclick={(e) => navigateToTag(relatedTag.name, e)}
									>
										<span class="related-tag-name">#{relatedTag.name}</span>
										<span class="related-tag-count">
											{relatedTag.count.toLocaleString()}
										</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</article>
			{/snippet}
		</div>
	</Search.Root>
</div>

<style>
	.discovery-tag-search {
		max-width: 800px;
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

	.discovery-tag-results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.discovery-tag-result {
		padding: 1.5rem;
		background: var(--bg-primary);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s;
	}

	.discovery-tag-result:hover {
		background: var(--bg-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.discovery-tag-result.expanded {
		border-color: var(--primary-color);
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.2);
	}

	.tag-result__main {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tag-result__header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.tag-result__name {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--primary-color);
	}

	.tag-result__count {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.trending-indicator {
		font-size: 1.25rem;
	}

	.expand-btn {
		padding: 0.375rem 0.75rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.expand-btn:hover {
		background: var(--bg-hover);
		border-color: var(--primary-color);
	}

	.related-tags {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.related-tags h4 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.related-tags-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.related-tag-chip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.related-tag-chip:hover {
		background: var(--primary-color);
		border-color: var(--primary-color);
		transform: scale(1.05);
	}

	.related-tag-chip:hover .related-tag-name,
	.related-tag-chip:hover .related-tag-count {
		color: white;
	}

	.related-tag-name {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--primary-color);
	}

	.related-tag-count {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class                        | Description            |
| ---------------------------- | ---------------------- |
| `.tag-result`                | Root tag button        |
| `.tag-result--trending`      | Trending state styling |
| `.tag-result__content`       | Content container      |
| `.tag-result__name`          | Tag name with #        |
| `.tag-result__trending-icon` | Trending icon (SVG)    |
| `.tag-result__count`         | Post count text        |

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
}
```

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<button role="button" aria-label="Search for #javascript tag">#javascript</button>
```

### **Keyboard Navigation**

- Tab to focus
- Enter/Space to activate
- Proper semantic HTML

---

## 🔒 Security

### **Input Validation**

Tag names are validated and sanitized:

```typescript
function isValidTagName(name: string): boolean {
	return /^[a-zA-Z0-9_]+$/.test(name);
}
```

---

## ⚡ Performance

- **Formatted counts**: Cached formatting
- **Pill shape**: CSS-only rendering
- **Minimal DOM**: Simple structure

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/TagResult.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.TagResult', () => {
	it('renders tag name with # prefix', () => {
		const tag = { name: 'javascript', count: 1000 };

		render(Search.TagResult, { props: { tag } });

		expect(screen.getByText(/#javascript/)).toBeInTheDocument();
		expect(screen.getByText(/1K posts/)).toBeInTheDocument();
	});

	it('shows trending indicator', () => {
		const tag = { name: 'trending', count: 5000, trending: true };

		render(Search.TagResult, { props: { tag } });

		expect(screen.getByRole('button')).toHaveClass('tag-result--trending');
	});
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Bar](./Bar.md) - Search input
- [Search.Results](./Results.md) - Results container
- [Search.ActorResult](./ActorResult.md) - Account result
- [Search.NoteResult](./NoteResult.md) - Post result
- [Search.Filters](./Filters.md) - Result type filters

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Compose Components](../Compose/README.md) - Compose with hashtags

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)
