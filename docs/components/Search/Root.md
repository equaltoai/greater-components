# Search.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 14 passing tests

---

## 📋 Overview

`Search.Root` is the foundational component for the Search system. It creates and provides search context to all child components, managing shared state, search execution, result caching, and event handlers. All Search components must be descendants of `Search.Root` to function correctly.

### **Key Features**:

- ✅ Centralized search state management
- ✅ Automatic search execution
- ✅ Result caching and invalidation
- ✅ Type-safe context API
- ✅ Flexible composition with child components
- ✅ Error handling and loading states
- ✅ Recent searches tracking (localStorage)
- ✅ Support for semantic/AI search
- ✅ Request cancellation
- ✅ Filter state management
- ✅ Accessibility-first design

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
			const response = await fetch(`/api/search?q=${options.query}`);
			return await response.json();
		},
		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},
		onNoteClick: (note) => {
			window.location.href = `/status/${note.id}`;
		},
		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};
</script>

<Search.Root {handlers}>
	<Search.Bar placeholder="Search..." />
	<Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop           | Type             | Default | Required | Description                          |
| -------------- | ---------------- | ------- | -------- | ------------------------------------ |
| `handlers`     | `SearchHandlers` | `{}`    | No       | Event handlers for search operations |
| `initialQuery` | `string`         | `''`    | No       | Initial search query to execute      |
| `children`     | `Snippet`        | -       | No       | Child components                     |
| `class`        | `string`         | `''`    | No       | Custom CSS class                     |

### **SearchHandlers Interface**

```typescript
interface SearchHandlers {
	/**
	 * Handle search execution
	 * @returns Promise<SearchResults>
	 */
	onSearch?: (options: SearchOptions) => Promise<SearchResults>;

	/**
	 * Handle actor result click
	 */
	onActorClick?: (actor: SearchActor) => void;

	/**
	 * Handle note result click
	 */
	onNoteClick?: (note: SearchNote) => void;

	/**
	 * Handle tag result click
	 */
	onTagClick?: (tag: SearchTag) => void;

	/**
	 * Handle follow action from results
	 */
	onFollow?: (actorId: string) => Promise<void>;

	/**
	 * Handle clear search
	 */
	onClear?: () => void;
}
```

### **SearchOptions Interface**

```typescript
interface SearchOptions {
	/**
	 * Search query
	 */
	query: string;

	/**
	 * Result type filter
	 */
	type?: 'actors' | 'notes' | 'tags' | 'all';

	/**
	 * Maximum results per type
	 * @default 20
	 */
	limit?: number;

	/**
	 * Enable AI semantic search
	 * @default false
	 */
	semantic?: boolean;

	/**
	 * Include only accounts user follows
	 * @default false
	 */
	following?: boolean;
}
```

### **SearchResults Interface**

```typescript
interface SearchResults {
	actors: SearchActor[];
	notes: SearchNote[];
	tags: SearchTag[];
	total: number;
}

interface SearchActor {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
	bio?: string;
	followersCount?: number;
	isFollowing?: boolean;
}

interface SearchNote {
	id: string;
	content: string;
	author: {
		id: string;
		username: string;
		displayName: string;
		avatar?: string;
	};
	createdAt: string;
	likesCount?: number;
	repliesCount?: number;
	reblogsCount?: number;
}

interface SearchTag {
	name: string;
	count: number;
	trending?: boolean;
}
```

---

## 💡 Examples

### Example 1: Basic Search Implementation

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			console.log('Searching for:', options.query);

			try {
				const params = new URLSearchParams({
					q: options.query,
					limit: (options.limit || 20).toString(),
				});

				if (options.type && options.type !== 'all') {
					params.set('type', options.type);
				}

				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				if (!response.ok) {
					throw new Error(`Search failed: ${response.statusText}`);
				}

				const results: SearchResults = await response.json();

				console.log('Search results:', {
					actors: results.actors.length,
					notes: results.notes.length,
					tags: results.tags.length,
					total: results.total,
				});

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			console.log('Actor clicked:', actor.username);
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			console.log('Note clicked:', note.id);
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			console.log('Tag clicked:', tag.name);
			window.location.href = `/tags/${tag.name}`;
		},

		onClear: () => {
			console.log('Search cleared');
		},
	};
</script>

<div class="search-container">
	<h1>Search</h1>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search posts, people, and tags..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.search-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 700;
	}
</style>
```

### Example 2: With Initial Query and Auto-Search

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import { page } from '$app/stores';

	// Get initial query from URL parameter
	const initialQuery = $derived($page.url.searchParams.get('q') || '');

	const handlers = {
		onSearch: async (options) => {
			// Update URL when search changes
			const url = new URL(window.location.href);
			url.searchParams.set('q', options.query);

			if (options.type && options.type !== 'all') {
				url.searchParams.set('type', options.type);
			} else {
				url.searchParams.delete('type');
			}

			window.history.replaceState({}, '', url.toString());

			// Perform search
			const response = await fetch(`/api/search?q=${options.query}&type=${options.type || 'all'}`);
			return await response.json();
		},
	};
</script>

<Search.Root {handlers} {initialQuery}>
	<Search.Bar />
	<Search.Filters />
	<Search.Results />
</Search.Root>
```

### Example 3: With Semantic AI Search

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let semanticEnabled = $state(false);
	let searchQuality = $state<'standard' | 'semantic'>('standard');

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const endpoint = options.semantic ? '/api/search/semantic' : '/api/search';

			searchQuality = options.semantic ? 'semantic' : 'standard';

			const params = new URLSearchParams({
				q: options.query,
				limit: (options.limit || 20).toString(),
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

			if (options.following) {
				params.set('following', 'true');
			}

			console.log(`Performing ${searchQuality} search:`, options.query);

			try {
				const response = await fetch(`${endpoint}?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const results: SearchResults = await response.json();

				// Add metadata for semantic results
				if (options.semantic && results.actors) {
					results.actors = results.actors.map((actor) => ({
						...actor,
						relevanceScore: Math.random(), // Would come from API
					}));
				}

				return results;
			} catch (error) {
				console.error('Search failed:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},
	};
</script>

<div class="semantic-search">
	<div class="search-header">
		<h2>Advanced Search</h2>
		<div class="search-mode">
			<label>
				<input type="checkbox" bind:checked={semanticEnabled} />
				Enable AI Semantic Search
			</label>
			{#if semanticEnabled}
				<span class="search-mode-badge"> 🧠 AI-Powered </span>
			{/if}
		</div>
	</div>

	<Search.Root {handlers}>
		<Search.Bar
			showSemantic={true}
			placeholder={semanticEnabled
				? "Ask a question or describe what you're looking for..."
				: 'Search posts, people, and tags...'}
		/>

		{#if searchQuality === 'semantic'}
			<div class="search-info">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
					/>
				</svg>
				<p>Using AI to understand your search intent and find the most relevant results</p>
			</div>
		{/if}

		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.semantic-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.search-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.search-mode {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.search-mode label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.search-mode-badge {
		padding: 0.25rem 0.75rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 9999px;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	.search-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		background: rgba(102, 126, 234, 0.1);
		border: 1px solid rgba(102, 126, 234, 0.3);
		border-radius: 8px;
	}

	.search-info svg {
		width: 1.25rem;
		height: 1.25rem;
		color: #667eea;
		flex-shrink: 0;
	}

	.search-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
</style>
```

### Example 4: With Request Cancellation and Caching

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	// Cache for search results
	const cache = new Map<string, { results: SearchResults; timestamp: number }>();
	const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

	// Current request controller
	let currentController: AbortController | null = null;

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			// Create cache key
			const cacheKey = JSON.stringify({
				query: options.query,
				type: options.type,
				semantic: options.semantic,
				following: options.following,
			});

			// Check cache
			const cached = cache.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
				console.log('Returning cached results for:', options.query);
				return cached.results;
			}

			// Cancel previous request
			if (currentController) {
				currentController.abort();
				console.log('Cancelled previous search request');
			}

			// Create new abort controller
			currentController = new AbortController();

			try {
				const params = new URLSearchParams({
					q: options.query,
					limit: (options.limit || 20).toString(),
				});

				if (options.type && options.type !== 'all') {
					params.set('type', options.type);
				}

				if (options.semantic) {
					params.set('semantic', 'true');
				}

				if (options.following) {
					params.set('following', 'true');
				}

				console.log('Fetching fresh results for:', options.query);

				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
					signal: currentController.signal,
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const results: SearchResults = await response.json();

				// Store in cache
				cache.set(cacheKey, {
					results,
					timestamp: Date.now(),
				});

				// Clean old cache entries
				if (cache.size > 50) {
					const entries = Array.from(cache.entries());
					const sortedByAge = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
					const toRemove = sortedByAge.slice(0, 10);
					toRemove.forEach(([key]) => cache.delete(key));
				}

				return results;
			} catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					console.log('Search request was cancelled');
					throw new Error('Search cancelled');
				}
				throw error;
			} finally {
				currentController = null;
			}
		},

		onActorClick: (actor) => {
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			window.location.href = `/tags/${tag.name}`;
		},

		onClear: () => {
			// Don't clear cache on clear
			console.log('Search cleared (cache preserved)');
		},
	};

	function clearCache() {
		cache.clear();
		console.log('Cache cleared');
		alert('Search cache cleared');
	}
</script>

<div class="cached-search">
	<div class="search-header">
		<h2>Search (with caching)</h2>
		<button class="clear-cache-btn" onclick={clearCache}> Clear Cache </button>
	</div>

	<div class="cache-info">
		<span>Cached queries: {cache.size}</span>
		<span>•</span>
		<span>Cache TTL: 5 minutes</span>
	</div>

	<Search.Root {handlers}>
		<Search.Bar />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.cached-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.search-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.clear-cache-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-cache-btn:hover {
		background: var(--bg-hover);
	}

	.cache-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
</style>
```

### Example 5: Advanced Integration with Analytics

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import { onMount } from 'svelte';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let searchCount = $state(0);
	let totalResults = $state(0);
	let averageResultCount = $state(0);
	let searchHistory = $state<Array<{ query: string; results: number; timestamp: Date }>>([]);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const startTime = performance.now();

			try {
				const response = await fetch(`/api/search?q=${options.query}`);
				const results: SearchResults = await response.json();

				const endTime = performance.now();
				const duration = endTime - startTime;

				// Update analytics
				searchCount++;
				totalResults += results.total;
				averageResultCount = totalResults / searchCount;

				// Add to history
				searchHistory = [
					{ query: options.query, results: results.total, timestamp: new Date() },
					...searchHistory.slice(0, 9),
				];

				// Track with analytics service
				trackSearchAnalytics({
					query: options.query,
					resultCount: results.total,
					duration,
					type: options.type || 'all',
					semantic: options.semantic || false,
				});

				return results;
			} catch (error) {
				// Track failed search
				trackSearchError(options.query, error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			trackResultClick('actor', actor.username);
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			trackResultClick('note', note.id);
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			trackResultClick('tag', tag.name);
			window.location.href = `/tags/${tag.name}`;
		},
	};

	function trackSearchAnalytics(data: any) {
		console.log('Search analytics:', data);

		// Send to analytics service
		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', 'search', {
				search_term: data.query,
				result_count: data.resultCount,
				search_duration: data.duration,
				search_type: data.type,
				semantic_search: data.semantic,
			});
		}
	}

	function trackSearchError(query: string, error: any) {
		console.error('Search error:', query, error);

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', 'exception', {
				description: `Search failed: ${query}`,
				fatal: false,
			});
		}
	}

	function trackResultClick(type: string, identifier: string) {
		console.log('Result clicked:', type, identifier);

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', 'select_content', {
				content_type: type,
				item_id: identifier,
			});
		}
	}

	onMount(() => {
		// Load previous search history from localStorage
		try {
			const stored = localStorage.getItem('search-history');
			if (stored) {
				searchHistory = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Failed to load search history:', error);
		}
	});

	// Save search history to localStorage when it changes
	$effect(() => {
		try {
			localStorage.setItem('search-history', JSON.stringify(searchHistory));
		} catch (error) {
			console.error('Failed to save search history:', error);
		}
	});
</script>

<div class="analytics-search">
	<div class="analytics-panel">
		<h3>Search Analytics</h3>
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value">{searchCount}</div>
				<div class="stat-label">Total Searches</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{totalResults}</div>
				<div class="stat-label">Total Results</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{averageResultCount.toFixed(1)}</div>
				<div class="stat-label">Avg Results</div>
			</div>
		</div>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search with analytics tracking..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>

	{#if searchHistory.length > 0}
		<div class="search-history">
			<h3>Recent Searches</h3>
			<ul>
				{#each searchHistory as item}
					<li>
						<span class="history-query">{item.query}</span>
						<span class="history-results">{item.results} results</span>
						<span class="history-time">
							{new Date(item.timestamp).toLocaleTimeString()}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.analytics-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.analytics-panel {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
	}

	.analytics-panel h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.stat-card {
		padding: 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		text-align: center;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.search-history {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
	}

	.search-history h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.search-history ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.search-history li {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.search-history li:last-child {
		border-bottom: none;
	}

	.history-query {
		flex: 1;
		font-weight: 600;
		color: var(--text-primary);
	}

	.history-results {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.history-time {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
</style>
```

---

## 🔄 Context API

The `Search.Root` component provides context to all child components through Svelte's context API.

### **Accessing Context**

Child components automatically access context:

```typescript
import { getSearchContext } from '@equaltoai/greater-components-fediverse/Search/context';

const context = getSearchContext();
// Access: context.state, context.handlers, context.search(), context.clear()
```

### **Context Structure**

```typescript
interface SearchContext {
	/** Current search state */
	state: SearchState;

	/** Search event handlers */
	handlers: SearchHandlers;

	/** Update search state */
	updateState: (partial: Partial<SearchState>) => void;

	/** Clear search error */
	clearError: () => void;

	/** Execute search */
	search: (query?: string) => Promise<void>;

	/** Clear search */
	clear: () => void;

	/** Set result type filter */
	setType: (type: SearchResultType) => void;

	/** Toggle semantic search */
	toggleSemantic: () => void;

	/** Toggle following filter */
	toggleFollowing: () => void;

	/** Add recent search */
	addRecentSearch: (query: string) => void;
}

interface SearchState {
	query: string;
	type: SearchResultType;
	results: SearchResults;
	loading: boolean;
	error: string | null;
	semantic: boolean;
	following: boolean;
	recentSearches: string[];
}
```

---

## 🎨 Styling

### **CSS Classes**

| Class          | Description            |
| -------------- | ---------------------- |
| `.search-root` | Root container element |

### **Custom Styling**

```svelte
<Search.Root {handlers} class="custom-search">
	<!-- content -->
</Search.Root>

<style>
	:global(.custom-search) {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
```

---

## ♿ Accessibility

### **ARIA Attributes**

The component provides proper ARIA context for descendants:

```html
<div role="search">
	<!-- search components -->
</div>
```

### **Keyboard Navigation**

- Child components handle keyboard navigation
- Focus management for search flow
- Screen reader announcements

---

## 🔒 Security

### **Input Validation**

Always validate search queries:

```typescript
function sanitizeQuery(query: string): string {
	return query
		.replace(/[<>\"']/g, '')
		.trim()
		.slice(0, 500);
}
```

### **Rate Limiting**

```typescript
import { RateLimiter } from '@equaltoai/greater-components-utils';

const limiter = new RateLimiter({
	maxRequests: 20,
	windowMs: 60000,
});

const handlers = {
	onSearch: async (options) => {
		if (!limiter.check()) {
			throw new Error('Too many searches');
		}
		return await performSearch(options);
	},
};
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Debounce search input** (handled by Search.Bar)
2. **Cancel previous requests**
3. **Cache results**
4. **Limit result set size**
5. **Use pagination for large results**

---

## 🧪 Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.Root', () => {
	it('provides context to children', () => {
		const handlers = {
			onSearch: vi.fn(),
		};

		render(Search.Root, { props: { handlers } });
		// Context is available to child components
	});

	it('executes initial search', async () => {
		const onSearch = vi.fn().mockResolvedValue({
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		});

		render(Search.Root, {
			props: {
				handlers: { onSearch },
				initialQuery: 'test',
			},
		});

		// Should call onSearch with initial query
		await vi.waitFor(() => {
			expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ query: 'test' }));
		});
	});
});
```

---

## 🔗 Related Components

- [Search.Bar](./Bar.md) - Search input
- [Search.Filters](./Filters.md) - Filter tabs
- [Search.Results](./Results.md) - Results container
- [Search.ActorResult](./ActorResult.md) - Account result
- [Search.NoteResult](./NoteResult.md) - Post result
- [Search.TagResult](./TagResult.md) - Hashtag result

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Notifications Components](../Notifications/README.md)
- [Timeline Components](../Timeline/README.md)
