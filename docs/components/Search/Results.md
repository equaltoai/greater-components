# Search.Results

**Component**: Search Results Container  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 12 passing tests

---

## 📋 Overview

`Search.Results` is the primary container component for displaying search results. It intelligently handles loading states, error states, empty states, and conditionally renders result sections based on the active filter (All, People, Posts, Tags). It manages the display of `ActorResult`, `NoteResult`, and `TagResult` components with proper organization and semantic HTML.

### **Key Features**:

- ✅ Smart result rendering based on active filter
- ✅ Loading state with spinner animation
- ✅ Error handling with user-friendly messages
- ✅ Empty state for no results
- ✅ Organized sections (People, Posts, Tags)
- ✅ Context-aware display logic
- ✅ Semantic HTML with proper headings
- ✅ ARIA attributes for accessibility
- ✅ Responsive layout
- ✅ Customizable styling
- ✅ Smooth transitions
- ✅ Performance-optimized rendering

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
			const params = new URLSearchParams({
				q: options.query,
				type: options.type || 'all',
			});

			const response = await fetch(`/api/search?${params}`);
			return await response.json();
		},
	};
</script>

<Search.Root {handlers}>
	<Search.Bar placeholder="Search..." />
	<Search.Filters />
	<Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                      |
| ------- | -------- | ------- | -------- | -------------------------------- |
| `class` | `string` | `''`    | No       | Additional CSS class for styling |

---

## 📤 Events

The component doesn't emit events directly but renders child components (`ActorResult`, `NoteResult`, `TagResult`) which can handle click events through the Search context.

---

## 💡 Examples

### Example 1: Basic Search Results Display

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let totalSearches = $state(0);
	let lastQuery = $state('');

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			totalSearches++;
			lastQuery = options.query;

			const params = new URLSearchParams({
				q: options.query,
				limit: '20',
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

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

				console.log('Search completed:', {
					query: options.query,
					filter: options.type || 'all',
					totalResults: results.total,
					actors: results.actors.length,
					notes: results.notes.length,
					tags: results.tags.length,
				});

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			console.log('Actor clicked:', actor);
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			console.log('Note clicked:', note);
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			console.log('Tag clicked:', tag);
			window.location.href = `/tags/${tag.name}`;
		},
	};
</script>

<div class="basic-search-results">
	<div class="search-stats">
		<span>Total searches: <strong>{totalSearches}</strong></span>
		{#if lastQuery}
			<span>Last query: <strong>{lastQuery}</strong></span>
		{/if}
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search posts, people, and tags..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.basic-search-results {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.search-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

### Example 2: With Result Limits and Pagination

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let currentPage = $state(1);
	let resultsPerPage = $state(10);
	let totalResults = $state(0);
	let hasMore = $state(false);
	let loadingMore = $state(false);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			// Reset pagination on new search
			if (options.query !== previousQuery) {
				currentPage = 1;
			}

			const params = new URLSearchParams({
				q: options.query,
				limit: resultsPerPage.toString(),
				offset: ((currentPage - 1) * resultsPerPage).toString(),
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

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

				totalResults = results.total;
				hasMore = currentPage * resultsPerPage < results.total;
				previousQuery = options.query;

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},
	};

	let previousQuery = $state('');

	async function loadMore() {
		if (loadingMore || !hasMore) return;

		loadingMore = true;
		currentPage++;

		try {
			// Trigger new search with updated page
			// This would be handled by the Search context
			console.log('Loading page:', currentPage);
		} finally {
			loadingMore = false;
		}
	}

	const totalPages = $derived(Math.ceil(totalResults / resultsPerPage));
</script>

<div class="paginated-search">
	<div class="pagination-controls top">
		<span class="results-count">
			Showing {Math.min((currentPage - 1) * resultsPerPage + 1, totalResults)} -
			{Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} results
		</span>

		<div class="page-size-selector">
			<label for="pageSize">Results per page:</label>
			<select id="pageSize" bind:value={resultsPerPage} onchange={() => (currentPage = 1)}>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
		</div>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>

	{#if hasMore}
		<div class="load-more">
			<button class="load-more-btn" onclick={loadMore} disabled={loadingMore}>
				{loadingMore ? 'Loading...' : 'Load More Results'}
			</button>
		</div>
	{/if}

	<div class="pagination-controls bottom">
		<button
			class="pagination-btn"
			onclick={() => (currentPage = Math.max(1, currentPage - 1))}
			disabled={currentPage === 1}
		>
			← Previous
		</button>

		<span class="page-indicator">
			Page {currentPage} of {totalPages}
		</span>

		<button
			class="pagination-btn"
			onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
			disabled={currentPage >= totalPages}
		>
			Next →
		</button>
	</div>
</div>

<style>
	.paginated-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.pagination-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--bg-secondary);
		border-radius: 8px;
		font-size: 0.875rem;
	}

	.pagination-controls.top {
		margin-bottom: 1.5rem;
	}

	.pagination-controls.bottom {
		margin-top: 1.5rem;
	}

	.results-count {
		color: var(--text-secondary);
	}

	.page-size-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-size-selector label {
		font-weight: 600;
		color: var(--text-primary);
	}

	.page-size-selector select {
		padding: 0.375rem 0.75rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
	}

	.load-more {
		display: flex;
		justify-content: center;
		padding: 2rem 0;
	}

	.load-more-btn {
		padding: 0.75rem 2rem;
		background: var(--primary-color);
		border: none;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.load-more-btn:hover:not(:disabled) {
		background: var(--primary-color-dark);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}

	.load-more-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--bg-hover);
		border-color: var(--primary-color);
	}

	.pagination-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-indicator {
		font-weight: 600;
		color: var(--text-primary);
	}
</style>
```

### Example 3: With Result Analytics and Insights

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type {
		SearchOptions,
		SearchResults,
		SearchResultType,
	} from '@equaltoai/greater-components-fediverse/types';

	interface SearchAnalytics {
		query: string;
		timestamp: Date;
		resultsCount: number;
		filterUsed: SearchResultType;
		clickedResults: number;
	}

	let searchHistory = $state<SearchAnalytics[]>([]);
	let currentSearch = $state<SearchAnalytics | null>(null);

	let totalClicks = $derived(searchHistory.reduce((sum, s) => sum + s.clickedResults, 0));

	let avgResultsPerSearch = $derived(
		searchHistory.length > 0
			? Math.round(searchHistory.reduce((sum, s) => sum + s.resultsCount, 0) / searchHistory.length)
			: 0
	);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			const params = new URLSearchParams({
				q: options.query,
				limit: '20',
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const results: SearchResults = await response.json();

				// Create analytics entry
				currentSearch = {
					query: options.query,
					timestamp: new Date(),
					resultsCount: results.total,
					filterUsed: options.type || 'all',
					clickedResults: 0,
				};

				searchHistory = [currentSearch, ...searchHistory.slice(0, 49)];

				// Save to localStorage
				try {
					localStorage.setItem('search-analytics', JSON.stringify(searchHistory));
				} catch (error) {
					console.error('Failed to save analytics:', error);
				}

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onActorClick: (actor) => {
			if (currentSearch) {
				currentSearch.clickedResults++;
				updateAnalytics();
			}
			window.location.href = `/@${actor.username}`;
		},

		onNoteClick: (note) => {
			if (currentSearch) {
				currentSearch.clickedResults++;
				updateAnalytics();
			}
			window.location.href = `/status/${note.id}`;
		},

		onTagClick: (tag) => {
			if (currentSearch) {
				currentSearch.clickedResults++;
				updateAnalytics();
			}
			window.location.href = `/tags/${tag.name}`;
		},
	};

	function updateAnalytics() {
		try {
			localStorage.setItem('search-analytics', JSON.stringify(searchHistory));
		} catch (error) {
			console.error('Failed to update analytics:', error);
		}
	}

	function clearAnalytics() {
		searchHistory = [];
		currentSearch = null;
		localStorage.removeItem('search-analytics');
	}

	// Load analytics on mount
	if (typeof window !== 'undefined') {
		try {
			const saved = localStorage.getItem('search-analytics');
			if (saved) {
				searchHistory = JSON.parse(saved);
			}
		} catch (error) {
			console.error('Failed to load analytics:', error);
		}
	}
</script>

<div class="analytics-search">
	<div class="analytics-dashboard">
		<div class="analytics-header">
			<h3>Search Analytics</h3>
			<button class="clear-btn" onclick={clearAnalytics}> Clear Data </button>
		</div>

		<div class="analytics-stats">
			<div class="stat-card">
				<div class="stat-label">Total Searches</div>
				<div class="stat-value">{searchHistory.length}</div>
			</div>

			<div class="stat-card">
				<div class="stat-label">Total Clicks</div>
				<div class="stat-value">{totalClicks}</div>
			</div>

			<div class="stat-card">
				<div class="stat-label">Avg Results</div>
				<div class="stat-value">{avgResultsPerSearch}</div>
			</div>

			{#if searchHistory.length > 0}
				<div class="stat-card">
					<div class="stat-label">Click Rate</div>
					<div class="stat-value">
						{((totalClicks / searchHistory.length) * 100).toFixed(1)}%
					</div>
				</div>
			{/if}
		</div>

		{#if currentSearch}
			<div class="current-search-info">
				<h4>Current Search</h4>
				<dl>
					<dt>Query:</dt>
					<dd>{currentSearch.query}</dd>

					<dt>Results:</dt>
					<dd>{currentSearch.resultsCount}</dd>

					<dt>Filter:</dt>
					<dd>{currentSearch.filterUsed}</dd>

					<dt>Clicks:</dt>
					<dd>{currentSearch.clickedResults}</dd>
				</dl>
			</div>
		{/if}
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search with analytics tracking..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.analytics-search {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.analytics-dashboard {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
	}

	.analytics-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.analytics-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.clear-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: var(--bg-hover);
		color: var(--error-color);
		border-color: var(--error-color);
	}

	.analytics-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		padding: 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		text-align: center;
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-color);
	}

	.current-search-info {
		padding: 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.current-search-info h4 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--text-secondary);
	}

	.current-search-info dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
		font-size: 0.875rem;
	}

	.current-search-info dt {
		font-weight: 600;
		color: var(--text-secondary);
	}

	.current-search-info dd {
		margin: 0;
		color: var(--text-primary);
		font-weight: 600;
	}
</style>
```

### Example 4: With Export and Sharing Capabilities

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let lastResults = $state<SearchResults | null>(null);
	let lastQuery = $state('');
	let lastFilter = $state<'all' | 'actors' | 'notes' | 'tags'>('all');

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			lastQuery = options.query;
			lastFilter = options.type || 'all';

			const params = new URLSearchParams({
				q: options.query,
				limit: '20',
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const results: SearchResults = await response.json();
				lastResults = results;

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},
	};

	function exportResultsAsJSON() {
		if (!lastResults) return;

		const data = {
			query: lastQuery,
			filter: lastFilter,
			timestamp: new Date().toISOString(),
			results: lastResults,
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `search-results-${lastQuery}-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function exportResultsAsCSV() {
		if (!lastResults) return;

		const rows: string[] = [];

		// Header
		rows.push('Type,ID,Name/Content,Username/Author,Link');

		// Actors
		lastResults.actors.forEach((actor) => {
			rows.push(`Actor,${actor.id},"${actor.displayName}",@${actor.username},/@${actor.username}`);
		});

		// Notes
		lastResults.notes.forEach((note) => {
			const content = note.content.replace(/"/g, '""').substring(0, 100);
			rows.push(`Note,${note.id},"${content}",@${note.actor.username},/status/${note.id}`);
		});

		// Tags
		lastResults.tags.forEach((tag) => {
			rows.push(`Tag,${tag.name},#${tag.name},,/tags/${tag.name}`);
		});

		const csv = rows.join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `search-results-${lastQuery}-${Date.now()}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function copyResultsLink() {
		if (!lastQuery) return;

		const url = new URL(window.location.href);
		url.searchParams.set('q', lastQuery);

		if (lastFilter !== 'all') {
			url.searchParams.set('type', lastFilter);
		} else {
			url.searchParams.delete('type');
		}

		try {
			await navigator.clipboard.writeText(url.toString());
			alert('Link copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy:', error);
			alert('Failed to copy link');
		}
	}

	async function shareResults() {
		if (!lastQuery || !lastResults) return;

		const shareData = {
			title: `Search results for "${lastQuery}"`,
			text: `Found ${lastResults.total} results for "${lastQuery}"`,
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				// Fallback: copy to clipboard
				await copyResultsLink();
			}
		} catch (error) {
			console.error('Failed to share:', error);
		}
	}
</script>

<div class="exportable-search">
	<div class="export-toolbar">
		<h3>Search Results</h3>

		<div class="export-actions">
			<button
				class="export-btn"
				onclick={exportResultsAsJSON}
				disabled={!lastResults}
				title="Export as JSON"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
					/>
				</svg>
				JSON
			</button>

			<button
				class="export-btn"
				onclick={exportResultsAsCSV}
				disabled={!lastResults}
				title="Export as CSV"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
					/>
				</svg>
				CSV
			</button>

			<button class="export-btn" onclick={copyResultsLink} disabled={!lastQuery} title="Copy link">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
					/>
				</svg>
				Copy Link
			</button>

			<button
				class="export-btn primary"
				onclick={shareResults}
				disabled={!lastResults}
				title="Share results"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
					/>
				</svg>
				Share
			</button>
		</div>
	</div>

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search to export results..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.exportable-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.export-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 8px;
	}

	.export-toolbar h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.export-actions {
		display: flex;
		gap: 0.5rem;
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.export-btn svg {
		width: 1rem;
		height: 1rem;
	}

	.export-btn:hover:not(:disabled) {
		background: var(--bg-hover);
		border-color: var(--primary-color);
		transform: translateY(-1px);
	}

	.export-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.export-btn.primary {
		background: var(--primary-color);
		border-color: var(--primary-color);
		color: white;
	}

	.export-btn.primary:hover:not(:disabled) {
		background: var(--primary-color-dark);
		border-color: var(--primary-color-dark);
	}

	@media (max-width: 640px) {
		.export-toolbar {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.export-actions {
			flex-wrap: wrap;
		}

		.export-btn {
			flex: 1;
			min-width: 80px;
			justify-content: center;
		}
	}
</style>
```

### Example 5: With Real-time Result Updates and Notifications

```svelte
<script lang="ts">
	import { Search } from '@equaltoai/greater-components-fediverse';
	import { onMount, onDestroy } from 'svelte';
	import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

	let realtimeEnabled = $state(true);
	let wsConnection = $state<WebSocket | null>(null);
	let newResultsCount = $state(0);
	let showNewResultsBanner = $state(false);

	const handlers = {
		onSearch: async (options: SearchOptions): Promise<SearchResults> => {
			newResultsCount = 0;
			showNewResultsBanner = false;

			const params = new URLSearchParams({
				q: options.query,
				limit: '20',
			});

			if (options.type && options.type !== 'all') {
				params.set('type', options.type);
			}

			try {
				const response = await fetch(`/api/search?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					},
				});

				const results: SearchResults = await response.json();

				// Subscribe to real-time updates for this query
				if (realtimeEnabled && wsConnection) {
					wsConnection.send(
						JSON.stringify({
							type: 'subscribe_search',
							query: options.query,
							filter: options.type || 'all',
						})
					);
				}

				return results;
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},
	};

	function connectWebSocket() {
		if (wsConnection) return;

		const ws = new WebSocket('wss://api.lesser.social/search-updates');

		ws.onopen = () => {
			console.log('WebSocket connected for real-time search updates');
			wsConnection = ws;
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'new_result') {
				newResultsCount++;
				showNewResultsBanner = true;

				// Show browser notification if permitted
				if (Notification.permission === 'granted') {
					new Notification('New search result', {
						body: `New result for your search: ${data.result.title || data.result.username}`,
						icon: data.result.avatar || '/icon.png',
					});
				}
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket disconnected');
			wsConnection = null;

			// Reconnect after 5 seconds
			if (realtimeEnabled) {
				setTimeout(connectWebSocket, 5000);
			}
		};
	}

	function disconnectWebSocket() {
		if (wsConnection) {
			wsConnection.close();
			wsConnection = null;
		}
	}

	function refreshResults() {
		newResultsCount = 0;
		showNewResultsBanner = false;
		// Trigger search again through context
		console.log('Refreshing results...');
	}

	async function requestNotificationPermission() {
		if (Notification.permission === 'default') {
			const permission = await Notification.requestPermission();
			console.log('Notification permission:', permission);
		}
	}

	onMount(() => {
		if (realtimeEnabled) {
			connectWebSocket();
		}
	});

	onDestroy(() => {
		disconnectWebSocket();
	});

	$effect(() => {
		if (realtimeEnabled) {
			connectWebSocket();
		} else {
			disconnectWebSocket();
		}
	});
</script>

<div class="realtime-search">
	<div class="realtime-controls">
		<div class="realtime-status">
			<div
				class="status-indicator"
				class:status-indicator--connected={wsConnection}
				class:status-indicator--disconnected={!wsConnection}
			></div>
			<span>
				{wsConnection ? 'Real-time updates enabled' : 'Real-time updates disabled'}
			</span>
		</div>

		<div class="realtime-toggles">
			<label class="toggle-label">
				<input type="checkbox" bind:checked={realtimeEnabled} />
				<span>Enable real-time</span>
			</label>

			<button class="notification-btn" onclick={requestNotificationPermission}>
				🔔 Enable Notifications
			</button>
		</div>
	</div>

	{#if showNewResultsBanner}
		<div class="new-results-banner">
			<span>
				{newResultsCount} new result{newResultsCount === 1 ? '' : 's'} available
			</span>
			<button onclick={refreshResults}> Refresh </button>
		</div>
	{/if}

	<Search.Root {handlers}>
		<Search.Bar placeholder="Search with real-time updates..." />
		<Search.Filters />
		<Search.Results />
	</Search.Root>
</div>

<style>
	.realtime-search {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.realtime-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1rem;
		background: var(--bg-secondary);
		border-radius: 8px;
	}

	.realtime-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.status-indicator {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	.status-indicator--connected {
		background: #10b981;
	}

	.status-indicator--disconnected {
		background: #ef4444;
		animation: none;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.realtime-toggles {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.toggle-label input {
		cursor: pointer;
	}

	.notification-btn {
		padding: 0.5rem 0.75rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.notification-btn:hover {
		background: var(--bg-hover);
		border-color: var(--primary-color);
	}

	.new-results-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 8px;
		color: white;
		font-weight: 600;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.new-results-banner button {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.new-results-banner button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.05);
	}

	@media (max-width: 640px) {
		.realtime-controls {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.realtime-toggles {
			flex-direction: column;
		}
	}
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class                      | Description                     |
| -------------------------- | ------------------------------- |
| `.search-results`          | Root container                  |
| `.search-results__loading` | Loading state container         |
| `.search-results__spinner` | Loading spinner                 |
| `.search-results__error`   | Error state container           |
| `.search-results__empty`   | Empty state container           |
| `.search-results__section` | Result type section             |
| `.search-results__heading` | Section heading                 |
| `.search-results__list`    | List container for actors/notes |
| `.search-results__tags`    | Flex container for tag results  |

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
	--error-color: #f4212e;
}
```

### **Custom Styling Example**

```svelte
<Search.Root {handlers}>
	<Search.Results class="custom-results" />
</Search.Root>

<style>
	:global(.custom-results) {
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16px;
	}

	:global(.custom-results .search-results__heading) {
		color: white;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
</style>
```

---

## ♿ Accessibility

### **ARIA Attributes**

The component includes proper ARIA attributes for all states:

```html
<!-- Loading state -->
<div role="status" aria-live="polite" aria-label="Searching">
	<div class="spinner"></div>
	<p>Searching...</p>
</div>

<!-- Error state -->
<div role="alert" aria-live="assertive">
	<p>Error message</p>
</div>

<!-- Results sections -->
<section aria-labelledby="people-heading">
	<h3 id="people-heading">People</h3>
	<!-- results -->
</section>
```

### **Keyboard Navigation**

- Results are keyboard navigable through child components
- Proper focus management
- Skip links available for result sections

### **Screen Reader Support**

- Announces loading states
- Announces error messages
- Announces result counts
- Announces empty states
- Proper semantic HTML structure

---

## 🔒 Security

### **Content Sanitization**

All content is sanitized before rendering:

```typescript
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(note.content);
```

### **Rate Limiting**

Implement rate limiting on search requests:

```typescript
let lastSearchTime = 0;
const RATE_LIMIT_MS = 1000; // 1 request per second

const handlers = {
	onSearch: async (options) => {
		const now = Date.now();
		if (now - lastSearchTime < RATE_LIMIT_MS) {
			throw new Error('Please wait before searching again');
		}
		lastSearchTime = now;

		// Perform search...
	},
};
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Virtual Scrolling**: Use virtual scrolling for large result sets
2. **Lazy Loading**: Load results incrementally
3. **Debounce**: Debounce search input
4. **Cache Results**: Cache recent search results
5. **Image Lazy Loading**: Use `loading="lazy"` for avatars

### **Performance Monitoring**

```typescript
const handlers = {
	onSearch: async (options) => {
		const startTime = performance.now();

		const results = await fetch(/* ... */);

		const endTime = performance.now();
		console.log(`Search took ${endTime - startTime}ms`);

		return results;
	},
};
```

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/Results.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.Results', () => {
	it('shows loading state during search', async () => {
		const onSearch = vi
			.fn()
			.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

		render(Search.Root, { props: { handlers: { onSearch } } });

		// Trigger search
		const input = screen.getByRole('searchbox');
		await fireEvent.input(input, { target: { value: 'test' } });

		expect(screen.getByText(/searching/i)).toBeInTheDocument();
	});

	it('displays results when search completes', async () => {
		const mockResults = {
			actors: [{ id: '1', username: 'alice', displayName: 'Alice' }],
			notes: [],
			tags: [],
			total: 1,
		};

		const onSearch = vi.fn().mockResolvedValue(mockResults);
		render(Search.Root, { props: { handlers: { onSearch } } });

		const input = screen.getByRole('searchbox');
		await fireEvent.input(input, { target: { value: 'alice' } });

		await waitFor(() => {
			expect(screen.getByText('Alice')).toBeInTheDocument();
		});
	});

	it('shows empty state when no results', async () => {
		const onSearch = vi.fn().mockResolvedValue({
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		});

		render(Search.Root, { props: { handlers: { onSearch } } });

		const input = screen.getByRole('searchbox');
		await fireEvent.input(input, { target: { value: 'xyz123' } });

		await waitFor(() => {
			expect(screen.getByText(/no results found/i)).toBeInTheDocument();
		});
	});
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Bar](./Bar.md) - Search input
- [Search.Filters](./Filters.md) - Result type filters
- [Search.ActorResult](./ActorResult.md) - Account result item
- [Search.NoteResult](./NoteResult.md) - Post result item
- [Search.TagResult](./TagResult.md) - Hashtag result item

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Notifications Components](../Notifications/README.md) - Notification system
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Profile Components](../Profile/README.md) - User profile components

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)
