# Timeline.LoadMore

**Component**: Pagination Control  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 32 passing tests

---

## 📋 Overview

`Timeline.LoadMore` provides pagination controls for loading additional timeline items. It supports both manual "Load More" buttons and automatic infinite scrolling. The component integrates with Timeline.Root context to manage loading states and trigger data fetching.

### **Key Features**:

- ✅ **Manual Loading** - Button to explicitly load more items
- ✅ **Infinite Scroll** - Automatic loading when near bottom
- ✅ **Loading States** - Visual feedback during data fetching
- ✅ **Customizable** - Custom button and loading content
- ✅ **Error Handling** - Integration with error state
- ✅ **Accessibility** - ARIA live regions for screen readers
- ✅ **Headless Button** - Uses `@equaltoai/greater-components-headless/button` for state management

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let cursor: string | null = $state(null);

	async function loadMore() {
		const response = await fetch(`/api/timeline?cursor=${cursor}`);
		const data = await response.json();

		items = [...items, ...data.items];
		cursor = data.nextCursor;
	}
</script>

<Timeline.Root {items} handlers={{ onLoadMore: loadMore }} initialState={{ hasMore: !!cursor }}>
	{#each items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item}>
				<Status.Header />
				<Status.Content />
			</Status.Root>
		</Timeline.Item>
	{/each}

	<Timeline.LoadMore buttonText="Load more posts" />
</Timeline.Root>
```

---

## 🎛️ Props

| Prop         | Type      | Default         | Required | Description                  |
| ------------ | --------- | --------------- | -------- | ---------------------------- |
| `loading`    | `Snippet` | Default spinner | No       | Custom loading state content |
| `button`     | `Snippet` | Default button  | No       | Custom load more button      |
| `buttonText` | `string`  | `'Load more'`   | No       | Text for default button      |
| `class`      | `string`  | `''`            | No       | Custom CSS class             |

---

## 💡 Examples

### Example 1: Basic Manual Loading

Simple load more button for manual pagination:

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let page = $state(1);
	let hasMore = $state(true);
	let isLoading = $state(false);
	let error = $state<Error | null>(null);

	// Load initial page
	$effect(() => {
		loadPage(1);
	});

	async function loadPage(pageNum: number) {
		isLoading = true;
		error = null;

		try {
			const response = await fetch(`/api/timeline/home?page=${pageNum}&limit=20`);

			if (!response.ok) {
				throw new Error('Failed to load timeline');
			}

			const data = await response.json();

			if (pageNum === 1) {
				items = data.items;
			} else {
				items = [...items, ...data.items];
			}

			hasMore = data.hasMore;
			page = pageNum;
		} catch (err) {
			error = err as Error;
			console.error('Failed to load timeline:', err);
		} finally {
			isLoading = false;
		}
	}

	async function loadMore() {
		if (!hasMore || isLoading) return;
		await loadPage(page + 1);
	}

	const config = {
		infiniteScroll: false, // Disable auto-loading
		showLoading: true,
	};

	const initialState = {
		hasMore,
		loadingMore: isLoading,
		error,
	};
</script>

<div class="timeline-container">
	<header class="timeline-header">
		<h1>Home Timeline</h1>
		<div class="page-info">Page {page}</div>
	</header>

	{#if error}
		<Timeline.ErrorState {error} onRetry={() => loadPage(page)} />
	{:else}
		<Timeline.Root {items} {config} handlers={{ onLoadMore: loadMore }} {initialState}>
			{#if items.length === 0 && !isLoading}
				<Timeline.EmptyState
					title="No posts yet"
					description="Follow some accounts to see posts here"
				/>
			{:else}
				{#each items as item, index}
					<Timeline.Item {item} {index}>
						<Status.Root status={item}>
							<Status.Header />
							<Status.Content />
							<Status.Media />
							<Status.Actions />
						</Status.Root>
					</Timeline.Item>
				{/each}

				{#if hasMore}
					<Timeline.LoadMore buttonText="Load more posts ({page + 1})" />
				{:else}
					<div class="end-message">
						<p>You've reached the end of the timeline</p>
					</div>
				{/if}
			{/if}
		</Timeline.Root>
	{/if}
</div>

<style>
	.timeline-container {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid #e1e8ed;
		border-right: 1px solid #e1e8ed;
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #e1e8ed;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.timeline-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.page-info {
		font-size: 0.875rem;
		color: #536471;
		padding: 0.25rem 0.75rem;
		background: #f7f9fa;
		border-radius: 9999px;
	}

	.end-message {
		text-align: center;
		padding: 2rem;
		color: #536471;
		font-size: 0.875rem;
	}
</style>
```

---

### Example 2: Infinite Scroll (Automatic Loading)

Automatically load more items as user scrolls:

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let cursor: string | null = $state(null);
	let hasMore = $state(true);
	let isLoadingMore = $state(false);

	// Load initial timeline
	$effect(() => {
		loadInitialTimeline();
	});

	async function loadInitialTimeline() {
		const data = await fetchTimeline();
		items = data.items;
		cursor = data.nextCursor;
		hasMore = !!cursor;
	}

	async function loadMore() {
		if (!cursor || isLoadingMore || !hasMore) return;

		isLoadingMore = true;

		try {
			const data = await fetchTimeline(cursor);

			// Append new items
			items = [...items, ...data.items];
			cursor = data.nextCursor;
			hasMore = !!cursor;
		} catch (error) {
			console.error('Failed to load more:', error);
		} finally {
			isLoadingMore = false;
		}
	}

	async function fetchTimeline(cursor?: string): Promise<{
		items: GenericTimelineItem[];
		nextCursor: string | null;
	}> {
		const url = cursor ? `/api/timeline/home?cursor=${cursor}` : '/api/timeline/home';

		const response = await fetch(url);
		return response.json();
	}

	const config = {
		infiniteScroll: true, // Enable automatic loading
		virtualized: true,
		showLoading: true,
	};

	const initialState = {
		hasMore,
		loadingMore: isLoadingMore,
	};
</script>

<div class="infinite-scroll-demo">
	<header class="sticky-header">
		<h1>Infinite Scroll Timeline</h1>
		<div class="item-count">{items.length} posts loaded</div>
	</header>

	<Timeline.Root {items} {config} handlers={{ onLoadMore: loadMore }} {initialState}>
		{#each items as item, index}
			<Timeline.Item {item} {index}>
				<Status.Root status={item}>
					<Status.Header />
					<Status.Content />
					<Status.Media />
					<Status.Actions />
				</Status.Root>
			</Timeline.Item>
		{/each}

		<!-- LoadMore component not needed for infinite scroll -->
		<!-- It's automatically triggered by Timeline.Root -->

		<!-- But we can add a loading indicator -->
		{#if isLoadingMore}
			<div class="loading-indicator">
				<svg class="spinner" viewBox="0 0 24 24" width="32" height="32">
					<path
						fill="currentColor"
						d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
					/>
					<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
				</svg>
				<p>Loading more posts...</p>
			</div>
		{/if}

		{#if !hasMore && items.length > 0}
			<div class="end-of-timeline">
				<p>🎉 You've reached the end!</p>
				<p>That's all for now. Check back later for more posts.</p>
			</div>
		{/if}
	</Timeline.Root>
</div>

<style>
	.infinite-scroll-demo {
		max-width: 600px;
		margin: 0 auto;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.sticky-header {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e1e8ed;
	}

	.sticky-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.item-count {
		font-size: 0.875rem;
		color: #536471;
		padding: 0.25rem 0.75rem;
		background: #e0f2fe;
		border-radius: 9999px;
		font-weight: 600;
	}

	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		gap: 1rem;
		color: #536471;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.end-of-timeline {
		text-align: center;
		padding: 3rem 2rem;
		color: #536471;
	}

	.end-of-timeline p:first-child {
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
	}

	.end-of-timeline p:last-child {
		font-size: 0.875rem;
		margin: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}
	}
</style>
```

**Infinite Scroll Behavior**:

- ✅ Triggers when user is within 400px of bottom
- ✅ Prevents duplicate requests with `isLoadingMore` flag
- ✅ Shows loading indicator automatically
- ✅ Displays end message when no more items
- ✅ Works with virtual scrolling

---

### Example 3: Custom Loading and Button Content

Customize the loading state and button appearance:

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let hasMore = $state(true);
	let loadedCount = $state(20);
	let estimatedTotal = $state(500);

	async function loadMore() {
		const newItems = await fetchMoreItems();
		items = [...items, ...newItems];
		loadedCount += newItems.length;
		hasMore = loadedCount < estimatedTotal;
	}
</script>

<Timeline.Root
	{items}
	handlers={{ onLoadMore: loadMore }}
	initialState={{ hasMore }}
	config={{ infiniteScroll: false }}
>
	{#each items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item}>
				<Status.Header />
				<Status.Content />
			</Status.Root>
		</Timeline.Item>
	{/each}

	<Timeline.LoadMore>
		<!-- Custom loading state -->
		{#snippet loading()}
			<div class="custom-loading">
				<div class="loading-dots">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
				<p class="loading-text">Fetching more awesome posts...</p>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {(loadedCount / estimatedTotal) * 100}%"></div>
				</div>
				<p class="progress-text">{loadedCount} / {estimatedTotal} posts loaded</p>
			</div>
		{/snippet}

		<!-- Custom button -->
		{#snippet button()}
			<button class="custom-load-button">
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path
						fill="currentColor"
						d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<span>Load {Math.min(20, estimatedTotal - loadedCount)} more posts</span>
				<div class="remaining-badge">
					{estimatedTotal - loadedCount} remaining
				</div>
			</button>
		{/snippet}
	</Timeline.LoadMore>
</Timeline.Root>

<style>
	.custom-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 2rem;
		gap: 1rem;
	}

	.loading-dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #1d9bf0;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.dot:nth-child(1) {
		animation-delay: -0.32s;
	}

	.dot:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	.loading-text {
		margin: 0;
		color: #536471;
		font-size: 0.875rem;
	}

	.progress-bar {
		width: 100%;
		max-width: 300px;
		height: 4px;
		background: #e1e8ed;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #1d9bf0, #0ea5e9);
		transition: width 0.3s ease;
	}

	.progress-text {
		margin: 0;
		color: #536471;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.custom-load-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #1d9bf0, #0ea5e9);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}

	.custom-load-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(29, 155, 240, 0.4);
	}

	.custom-load-button:active {
		transform: translateY(0);
	}

	.remaining-badge {
		padding: 0.25rem 0.75rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 9999px;
		font-size: 0.75rem;
		margin-left: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
		}

		.custom-load-button {
			transition: none;
		}
	}
</style>
```

---

### Example 4: Load More with Retry Logic

Handle errors gracefully with retry functionality:

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let cursor: string | null = $state(null);
	let hasMore = $state(true);
	let error = $state<Error | null>(null);
	let retryCount = $state(0);
	const MAX_RETRIES = 3;

	async function loadMore() {
		error = null;

		try {
			const response = await fetch(`/api/timeline?cursor=${cursor}`);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			items = [...items, ...data.items];
			cursor = data.nextCursor;
			hasMore = !!cursor;
			retryCount = 0; // Reset on success
		} catch (err) {
			error = err as Error;
			console.error('Failed to load more:', err);

			// Auto-retry with exponential backoff
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s

				console.log(`Retrying in ${delay}ms... (attempt ${retryCount}/${MAX_RETRIES})`);

				setTimeout(() => {
					loadMore();
				}, delay);
			}
		}
	}

	const initialState = {
		hasMore,
		error,
	};
</script>

<Timeline.Root
	{items}
	handlers={{ onLoadMore: loadMore }}
	{initialState}
	config={{ infiniteScroll: false }}
>
	{#each items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item}>
				<Status.Header />
				<Status.Content />
			</Status.Root>
		</Timeline.Item>
	{/each}

	{#if error && retryCount >= MAX_RETRIES}
		<div class="load-more-error">
			<div class="error-icon">⚠️</div>
			<h3>Failed to load more posts</h3>
			<p>{error.message}</p>
			<p class="retry-info">Tried {MAX_RETRIES} times without success</p>
			<button
				class="retry-button"
				onclick={() => {
					retryCount = 0;
					loadMore();
				}}
			>
				Try Again
			</button>
		</div>
	{:else if error && retryCount < MAX_RETRIES}
		<div class="load-more-retrying">
			<svg class="spinner" viewBox="0 0 24 24" width="24" height="24">
				<path
					fill="currentColor"
					d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
				/>
				<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
			</svg>
			<p>Connection issue. Retrying... (attempt {retryCount}/{MAX_RETRIES})</p>
		</div>
	{:else}
		<Timeline.LoadMore buttonText="Load more posts" />
	{/if}
</Timeline.Root>

<style>
	.load-more-error {
		text-align: center;
		padding: 3rem 2rem;
		background: #fef2f2;
		border: 1px solid #fee;
	}

	.error-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.load-more-error h3 {
		margin: 0 0 0.5rem 0;
		color: #dc2626;
		font-size: 1.25rem;
	}

	.load-more-error p {
		margin: 0.5rem 0;
		color: #536471;
		font-size: 0.875rem;
	}

	.retry-info {
		font-weight: 600;
		color: #991b1b;
	}

	.retry-button {
		margin-top: 1rem;
		padding: 0.75rem 2rem;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.retry-button:hover {
		background: #b91c1c;
	}

	.load-more-retrying {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		background: #fffbeb;
		color: #92400e;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}
	}
</style>
```

**Error Handling Features**:

- ✅ Automatic retry with exponential backoff
- ✅ Maximum retry limit
- ✅ Clear error messages
- ✅ Manual retry button
- ✅ Retry progress indication

---

### Example 5: Load More with Analytics Tracking

Track load more interactions for analytics:

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let hasMore = $state(true);
	let loadCount = $state(0);
	let totalItemsLoaded = $state(20);
	let lastLoadTime = $state<Date | null>(null);
	let averageLoadTime = $state(0);
	let loadTimes: number[] = [];

	async function loadMore() {
		const startTime = performance.now();
		loadCount++;

		// Track analytics event
		trackEvent('timeline_load_more_clicked', {
			currentItemCount: items.length,
			loadNumber: loadCount,
			timestamp: new Date().toISOString(),
		});

		try {
			const newItems = await fetchMoreItems();

			items = [...items, ...newItems];
			totalItemsLoaded += newItems.length;
			hasMore = newItems.length > 0;

			// Calculate load time
			const endTime = performance.now();
			const loadTime = endTime - startTime;
			loadTimes.push(loadTime);
			averageLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
			lastLoadTime = new Date();

			// Track success
			trackEvent('timeline_load_more_success', {
				loadTime,
				itemsLoaded: newItems.length,
				totalItems: items.length,
				loadNumber: loadCount,
			});
		} catch (error) {
			// Track error
			trackEvent('timeline_load_more_error', {
				error: error.message,
				loadNumber: loadCount,
			});

			throw error;
		}
	}

	function trackEvent(eventName: string, properties: Record<string, any>) {
		// Send to analytics service
		console.log('Analytics:', eventName, properties);

		// Example: Send to Google Analytics
		// gtag('event', eventName, properties);

		// Example: Send to custom analytics
		// fetch('/api/analytics', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify({ event: eventName, ...properties })
		// });
	}

	async function fetchMoreItems(): Promise<GenericTimelineItem[]> {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return mockItems(20);
	}
</script>

<div class="tracked-timeline">
	<div class="analytics-panel">
		<h3>Load More Analytics</h3>
		<div class="analytics-grid">
			<div class="metric">
				<div class="metric-label">Total Loads</div>
				<div class="metric-value">{loadCount}</div>
			</div>
			<div class="metric">
				<div class="metric-label">Items Loaded</div>
				<div class="metric-value">{totalItemsLoaded}</div>
			</div>
			<div class="metric">
				<div class="metric-label">Avg Load Time</div>
				<div class="metric-value">{averageLoadTime.toFixed(0)}ms</div>
			</div>
			<div class="metric">
				<div class="metric-label">Last Load</div>
				<div class="metric-value">
					{lastLoadTime ? lastLoadTime.toLocaleTimeString() : 'N/A'}
				</div>
			</div>
		</div>
	</div>

	<Timeline.Root
		{items}
		handlers={{ onLoadMore: loadMore }}
		initialState={{ hasMore }}
		config={{ infiniteScroll: false }}
	>
		{#each items as item, index}
			<Timeline.Item {item} {index}>
				<Status.Root status={item}>
					<Status.Header />
					<Status.Content />
				</Status.Root>
			</Timeline.Item>
		{/each}

		<Timeline.LoadMore>
			{#snippet button()}
				<button class="analytics-button">
					<span>Load More</span>
					<div class="button-stats">
						Load #{loadCount + 1} • {items.length} posts so far
					</div>
				</button>
			{/snippet}
		</Timeline.LoadMore>
	</Timeline.Root>
</div>

<style>
	.tracked-timeline {
		max-width: 600px;
		margin: 0 auto;
	}

	.analytics-panel {
		padding: 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-bottom: 1px solid #e1e8ed;
	}

	.analytics-panel h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
	}

	.analytics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
	}

	.metric {
		background: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		border-radius: 8px;
		backdrop-filter: blur(10px);
	}

	.metric-label {
		font-size: 0.75rem;
		opacity: 0.9;
		margin-bottom: 0.25rem;
	}

	.metric-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.analytics-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.analytics-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
	}

	.button-stats {
		font-size: 0.75rem;
		opacity: 0.9;
		font-weight: normal;
	}
</style>
```

**Analytics Features**:

- ✅ Track load more clicks
- ✅ Measure load times
- ✅ Count total loads
- ✅ Track success/error rates
- ✅ Visual metrics dashboard
- ✅ Ready for analytics service integration

---

## 🎯 Context Integration

Timeline.LoadMore automatically accesses Timeline.Root context:

```typescript
// Internal implementation
const context = getTimelineContext();

const shouldShow = $derived(
	context.state.hasMore && !context.config.infiniteScroll && !context.state.loading
);
```

**Context Properties Used**:

- `context.state.hasMore` - Whether more items are available
- `context.state.loadingMore` - Current loading state
- `context.config.infiniteScroll` - Whether infinite scroll is enabled
- `context.handlers.onLoadMore` - Load more handler function

---

## 🎨 Styling

### CSS Classes

```css
.timeline-load-more {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: var(--timeline-spacing, 1rem);
	border-bottom: 1px solid var(--timeline-border, #e1e8ed);
}

.timeline-load-more__button {
	padding: 0.75rem 2rem;
	background: var(--timeline-button-bg, #1d9bf0);
	color: var(--timeline-button-text, white);
	border: none;
	border-radius: var(--timeline-button-radius, 9999px);
	font-size: var(--timeline-font-size-base, 1rem);
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
}

.timeline-load-more__button:hover {
	background: var(--timeline-button-hover-bg, #1a8cd8);
	transform: translateY(-1px);
}

.timeline-load-more__spinner {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	color: var(--timeline-text-secondary, #536471);
}

.timeline-load-more__spinner-icon {
	width: 24px;
	height: 24px;
	animation: spin 1s linear infinite;
}
```

### Custom Styling

```svelte
<Timeline.LoadMore class="my-custom-load-more">
	<!-- Custom content -->
</Timeline.LoadMore>

<style>
	:global(.my-custom-load-more) {
		background: linear-gradient(to right, #f7f9fa, white);
		padding: 2rem;
	}

	:global(.my-custom-load-more .timeline-load-more__button) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
</style>
```

---

## ♿ Accessibility

### ARIA Live Region

```html
<div class="timeline-load-more" role="status" aria-live="polite">
	<!-- Loading state announced to screen readers -->
</div>
```

### Button Accessibility

```html
<button class="timeline-load-more__button" aria-label="Load more posts" aria-busy="false">
	Load more
</button>
```

**Screen Reader Announcements**:

- "Loading more..." when fetching starts
- "Load more posts" button label
- Live region updates with polite priority

---

## ⚡ Performance

### Preventing Duplicate Requests

```typescript
// Internal implementation prevents duplicate requests
if (context.state.loadingMore) return;

context.updateState({ loadingMore: true });
try {
	await context.handlers.onLoadMore();
} finally {
	context.updateState({ loadingMore: false });
}
```

### Infinite Scroll Threshold

Infinite scroll triggers when user is within 400px of bottom:

```typescript
const scrollBottom = scrollHeight - scrollTop - clientHeight;

if (scrollBottom < 400 && hasMore && !loadingMore) {
	handleLoadMore();
}
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Timeline } from '@equaltoai/greater-components-fediverse';

describe('Timeline.LoadMore', () => {
	it('renders load more button', () => {
		const items = [mockItem()];
		const onLoadMore = vi.fn();

		render(TimelineWithLoadMore, {
			props: {
				items,
				handlers: { onLoadMore },
				initialState: { hasMore: true },
				config: { infiniteScroll: false },
			},
		});

		expect(screen.getByText('Load more')).toBeInTheDocument();
	});

	it('calls onLoadMore when clicked', async () => {
		const items = [mockItem()];
		const onLoadMore = vi.fn().mockResolvedValue(undefined);

		render(TimelineWithLoadMore, {
			props: {
				items,
				handlers: { onLoadMore },
				initialState: { hasMore: true },
				config: { infiniteScroll: false },
			},
		});

		const button = screen.getByText('Load more');
		await fireEvent.click(button);

		expect(onLoadMore).toHaveBeenCalled();
	});

	it('shows loading state', async () => {
		const items = [mockItem()];
		const onLoadMore = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

		render(TimelineWithLoadMore, {
			props: {
				items,
				handlers: { onLoadMore },
				initialState: { hasMore: true },
				config: { infiniteScroll: false },
			},
		});

		const button = screen.getByText('Load more');
		await fireEvent.click(button);

		expect(screen.getByText('Loading more...')).toBeInTheDocument();
	});

	it('hides when no more items', () => {
		const items = [mockItem()];

		render(TimelineWithLoadMore, {
			props: {
				items,
				handlers: { onLoadMore: vi.fn() },
				initialState: { hasMore: false },
				config: { infiniteScroll: false },
			},
		});

		expect(screen.queryByText('Load more')).not.toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Timeline.Root](./Root.md) - Timeline context provider
- [Timeline.Item](./Item.md) - Timeline item wrapper
- [Timeline.ErrorState](./ErrorState.md) - Error display

---

## 📚 See Also

- [Timeline Components README](./README.md)
- [Infinite Scroll Guide](../../guides/infinite-scroll.md)
- [Performance Optimization](../../guides/performance.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0
