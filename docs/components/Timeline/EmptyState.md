# Timeline.EmptyState

**Component**: Empty State Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 24 passing tests

---

## 📋 Overview

`Timeline.EmptyState` displays a friendly message when a timeline has no items to show. It provides customizable text, icons, and action buttons to guide users on what to do next. This component improves user experience by preventing confusion when timelines are empty.

### **Key Features**:

- ✅ **Customizable** - Custom title, description, icon, and actions
- ✅ **Flexible** - Multiple use cases (empty feed, no search results, etc.)
- ✅ **Accessible** - Proper ARIA roles and semantic HTML
- ✅ **Action-Oriented** - Optional call-to-action buttons
- ✅ **Styled** - Beautiful default styling with CSS custom properties
- ✅ **Responsive** - Mobile-friendly layout

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';

	let items = $state([]);
</script>

<Timeline.Root {items}>
	{#if items.length === 0}
		<Timeline.EmptyState
			title="No posts yet"
			description="Follow some accounts to see posts in your timeline"
		/>
	{:else}
		{#each items as item, index}
			<Timeline.Item {item} {index}>
				<!-- Item content -->
			</Timeline.Item>
		{/each}
	{/if}
</Timeline.Root>
```

---

## 🎛️ Props

| Prop          | Type      | Default                           | Required | Description                       |
| ------------- | --------- | --------------------------------- | -------- | --------------------------------- |
| `title`       | `string`  | `'No posts'`                      | No       | Main heading text                 |
| `description` | `string`  | `'There are no posts to display'` | No       | Description text                  |
| `icon`        | `Snippet` | Default icon                      | No       | Custom icon component             |
| `action`      | `Snippet` | -                                 | No       | Action button or custom content   |
| `children`    | `Snippet` | -                                 | No       | Custom content (replaces default) |
| `class`       | `string`  | `''`                              | No       | Custom CSS class                  |

---

## 💡 Examples

### Example 1: Home Timeline Empty State

Empty state for a home timeline:

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let isLoading = $state(true);

	$effect(() => {
		loadTimeline();
	});

	async function loadTimeline() {
		isLoading = true;
		try {
			const response = await fetch('/api/timeline/home');
			const data = await response.json();
			items = data.items;
		} catch (error) {
			console.error('Failed to load timeline:', error);
		} finally {
			isLoading = false;
		}
	}

	function navigateToDiscover() {
		window.location.href = '/discover';
	}
</script>

<div class="home-timeline">
	<header class="timeline-header">
		<h1>Home</h1>
	</header>

	<Timeline.Root {items}>
		{#if isLoading}
			<div class="loading-state">
				<svg class="spinner" viewBox="0 0 24 24" width="32" height="32">
					<path
						fill="currentColor"
						d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
					/>
					<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
				</svg>
				<p>Loading your timeline...</p>
			</div>
		{:else if items.length === 0}
			<Timeline.EmptyState
				title="Welcome to your timeline!"
				description="Your timeline is empty because you're not following anyone yet. Discover interesting accounts to follow and see their posts here."
			>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
						/>
					</svg>
				{/snippet}

				{#snippet action()}
					<button class="discover-button" onclick={navigateToDiscover}>
						<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
							<path
								d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
							/>
						</svg>
						Discover People
					</button>
				{/snippet}
			</Timeline.EmptyState>
		{:else}
			{#each items as item, index}
				<Timeline.Item {item} {index}>
					<!-- Item content -->
				</Timeline.Item>
			{/each}
		{/if}
	</Timeline.Root>
</div>

<style>
	.home-timeline {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid #e1e8ed;
		border-right: 1px solid #e1e8ed;
		min-height: 100vh;
	}

	.timeline-header {
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

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
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

	.discover-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 2rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.discover-button:hover {
		background: #1a8cd8;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}
		.discover-button {
			transition: none;
			transform: none;
		}
	}
</style>
```

---

### Example 2: Search Results Empty State

Empty state for search with no results:

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let searchQuery = $state('');
	let searchResults: GenericTimelineItem[] = $state([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);

	async function handleSearch() {
		if (!searchQuery.trim()) return;

		isSearching = true;
		hasSearched = true;

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
			const data = await response.json();
			searchResults = data.results;
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			isSearching = false;
		}
	}

	function clearSearch() {
		searchQuery = '';
		searchResults = [];
		hasSearched = false;
	}
</script>

<div class="search-container">
	<div class="search-bar">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Search posts, people, hashtags..."
			onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			class="search-input"
		/>
		<button onclick={handleSearch} class="search-button" disabled={isSearching}>
			{#if isSearching}
				Searching...
			{:else}
				Search
			{/if}
		</button>
	</div>

	<Timeline.Root items={searchResults}>
		{#if isSearching}
			<div class="searching-state">
				<svg class="spinner" viewBox="0 0 24 24" width="32" height="32">
					<path
						fill="currentColor"
						d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
					/>
					<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
				</svg>
				<p>Searching for "{searchQuery}"...</p>
			</div>
		{:else if hasSearched && searchResults.length === 0}
			<Timeline.EmptyState
				title="No results found"
				description="No posts found for "{searchQuery}". Try a different search term or explore trending topics."
			>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
						/>
					</svg>
				{/snippet}

				{#snippet action()}
					<div class="search-actions">
						<button class="action-button action-button--primary" onclick={clearSearch}>
							Clear Search
						</button>
						<button
							class="action-button action-button--secondary"
							onclick={() => (window.location.href = '/explore')}
						>
							Explore Trending
						</button>
					</div>
				{/snippet}
			</Timeline.EmptyState>
		{:else if !hasSearched}
			<Timeline.EmptyState
				title="Search the fediverse"
				description="Enter a search term above to find posts, people, and hashtags across the fediverse."
			>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
						/>
					</svg>
				{/snippet}
			</Timeline.EmptyState>
		{:else}
			{#each searchResults as item, index}
				<Timeline.Item {item} {index}>
					<!-- Search result -->
				</Timeline.Item>
			{/each}
		{/if}
	</Timeline.Root>
</div>

<style>
	.search-container {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid #e1e8ed;
		border-right: 1px solid #e1e8ed;
		min-height: 100vh;
	}

	.search-bar {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		border-bottom: 1px solid #e1e8ed;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 1px solid #e1e8ed;
		border-radius: 9999px;
		font-size: 1rem;
		outline: none;
	}

	.search-input:focus {
		border-color: #1d9bf0;
		box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.1);
	}

	.search-button {
		padding: 0.75rem 2rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-button:hover:not(:disabled) {
		background: #1a8cd8;
	}

	.search-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.searching-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 4rem 2rem;
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

	.search-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.action-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-button--primary {
		background: #1d9bf0;
		color: white;
	}

	.action-button--primary:hover {
		background: #1a8cd8;
	}

	.action-button--secondary {
		background: white;
		color: #0f1419;
		border: 1px solid #e1e8ed;
	}

	.action-button--secondary:hover {
		background: #f7f9fa;
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}
	}
</style>
```

---

### Example 3: Notifications Empty State

Empty state for notifications:

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let notifications: GenericTimelineItem[] = $state([]);

	$effect(() => {
		loadNotifications();
	});

	async function loadNotifications() {
		const response = await fetch('/api/notifications');
		const data = await response.json();
		notifications = data.items;
	}
</script>

<div class="notifications-page">
	<header class="page-header">
		<h1>Notifications</h1>
	</header>

	<Timeline.Root items={notifications}>
		{#if notifications.length === 0}
			<Timeline.EmptyState
				title="No notifications yet"
				description="When someone follows you, mentions you, or interacts with your posts, you'll see it here."
			>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
						<path
							d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
						/>
					</svg>
				{/snippet}

				{#snippet action()}
					<button class="primary-button" onclick={() => (window.location.href = '/discover')}>
						Discover People to Follow
					</button>
				{/snippet}
			</Timeline.EmptyState>
		{:else}
			{#each notifications as notification, index}
				<Timeline.Item item={notification} {index}>
					<!-- Notification content -->
				</Timeline.Item>
			{/each}
		{/if}
	</Timeline.Root>
</div>

<style>
	.notifications-page {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid #e1e8ed;
		border-right: 1px solid #e1e8ed;
		min-height: 100vh;
	}

	.page-header {
		padding: 1rem;
		border-bottom: 1px solid #e1e8ed;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.primary-button {
		padding: 0.75rem 2rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.primary-button:hover {
		background: #1a8cd8;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}
</style>
```

---

### Example 4: Bookmarks Empty State

Empty state for bookmarks:

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let bookmarks: GenericTimelineItem[] = $state([]);

	$effect(() => {
		loadBookmarks();
	});

	async function loadBookmarks() {
		const response = await fetch('/api/bookmarks');
		const data = await response.json();
		bookmarks = data.items;
	}
</script>

<div class="bookmarks-page">
	<header class="page-header">
		<h1>Bookmarks</h1>
	</header>

	<Timeline.Root items={bookmarks}>
		{#if bookmarks.length === 0}
			<Timeline.EmptyState
				title="No bookmarks yet"
				description="Save posts you want to read later by clicking the bookmark button. Your bookmarks are private and only visible to you."
			>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
						<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
					</svg>
				{/snippet}

				{#snippet action()}
					<button class="explore-button" onclick={() => (window.location.href = '/home')}>
						<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
							<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
						</svg>
						Go to Home Timeline
					</button>
				{/snippet}
			</Timeline.EmptyState>
		{:else}
			{#each bookmarks as bookmark, index}
				<Timeline.Item item={bookmark} {index}>
					<!-- Bookmark content -->
				</Timeline.Item>
			{/each}
		{/if}
	</Timeline.Root>
</div>

<style>
	.bookmarks-page {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid #e1e8ed;
		border-right: 1px solid #e1e8ed;
		min-height: 100vh;
	}

	.page-header {
		padding: 1rem;
		border-bottom: 1px solid #e1e8ed;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.explore-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 2rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.explore-button:hover {
		background: #1a8cd8;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}
</style>
```

---

### Example 5: Completely Custom Empty State

Fully custom empty state with animations and illustrations:

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);
	let showAnimation = $state(true);

	$effect(() => {
		// Hide animation after 3 seconds
		const timeout = setTimeout(() => {
			showAnimation = false;
		}, 3000);

		return () => clearTimeout(timeout);
	});
</script>

<Timeline.Root {items}>
	{#if items.length === 0}
		<Timeline.EmptyState>
			{#snippet children()}
				<div class="custom-empty-state" class:animated={showAnimation}>
					<div class="illustration">
						<svg viewBox="0 0 200 200" width="200" height="200">
							<circle cx="100" cy="100" r="80" fill="#e0f2fe" />
							<circle cx="100" cy="100" r="60" fill="#bae6fd" class="pulse" />
							<circle cx="100" cy="100" r="40" fill="#7dd3fc" class="pulse pulse-delay" />
							<path d="M 100 60 L 120 90 L 100 80 L 80 90 Z" fill="#0ea5e9" class="float" />
						</svg>
					</div>

					<div class="content">
						<h2 class="title">Your Timeline Awaits</h2>
						<p class="description">
							Start your journey by following interesting people and communities. Your personalized
							feed will appear here.
						</p>

						<div class="features">
							<div class="feature">
								<div class="feature-icon">👥</div>
								<div class="feature-text">Follow people</div>
							</div>
							<div class="feature">
								<div class="feature-icon">🔖</div>
								<div class="feature-text">Bookmark posts</div>
							</div>
							<div class="feature">
								<div class="feature-icon">💬</div>
								<div class="feature-text">Join conversations</div>
							</div>
						</div>

						<div class="actions">
							<button class="action-btn action-btn--primary">
								<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
									<path
										d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
									/>
								</svg>
								Discover People
							</button>
							<button class="action-btn action-btn--secondary">
								<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
									<path
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
									/>
								</svg>
								Complete Profile
							</button>
						</div>
					</div>
				</div>
			{/snippet}
		</Timeline.EmptyState>
	{/if}
</Timeline.Root>

<style>
	.custom-empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 4rem 2rem;
		max-width: 500px;
		margin: 0 auto;
		text-align: center;
	}

	.illustration {
		margin-bottom: 2rem;
	}

	.pulse {
		animation: pulse 2s ease-in-out infinite;
	}

	.pulse-delay {
		animation-delay: 0.5s;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	.float {
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.content {
		width: 100%;
	}

	.title {
		margin: 0 0 1rem 0;
		font-size: 1.75rem;
		font-weight: 700;
		color: #0f1419;
	}

	.description {
		margin: 0 0 2rem 0;
		font-size: 1rem;
		line-height: 1.5;
		color: #536471;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.feature {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: #f7f9fa;
		border-radius: 12px;
		transition: transform 0.2s;
	}

	.feature:hover {
		transform: translateY(-4px);
		background: #e0f2fe;
	}

	.feature-icon {
		font-size: 2rem;
	}

	.feature-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: #536471;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.75rem;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.action-btn--primary {
		background: linear-gradient(135deg, #1d9bf0, #0ea5e9);
		color: white;
		box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
	}

	.action-btn--primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(29, 155, 240, 0.4);
	}

	.action-btn--secondary {
		background: white;
		color: #0f1419;
		border: 2px solid #e1e8ed;
	}

	.action-btn--secondary:hover {
		background: #f7f9fa;
		border-color: #1d9bf0;
	}

	@media (max-width: 640px) {
		.features {
			grid-template-columns: 1fr;
		}

		.actions {
			flex-direction: column;
			width: 100%;
		}

		.action-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse,
		.float,
		.feature {
			animation: none;
			transition: none;
		}

		.action-btn {
			transition: none;
		}
	}
</style>
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.timeline-empty {
	/* Background */
	--timeline-empty-bg: white;

	/* Text colors */
	--timeline-text-primary: #0f1419;
	--timeline-text-secondary: #536471;

	/* Spacing */
	--timeline-spacing-lg: 2rem;

	/* Typography */
	--timeline-font-size-xl: 1.25rem;
	--timeline-font-size-base: 1rem;
}
```

### Default Styles

```css
.timeline-empty {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 300px;
	padding: var(--timeline-spacing-lg, 2rem);
	background: var(--timeline-empty-bg, white);
}

.timeline-empty__icon {
	width: 64px;
	height: 64px;
	margin-bottom: 1rem;
	color: var(--timeline-text-secondary, #536471);
	opacity: 0.5;
}

.timeline-empty__title {
	margin: 0 0 0.5rem 0;
	font-size: var(--timeline-font-size-xl, 1.25rem);
	font-weight: 700;
	color: var(--timeline-text-primary, #0f1419);
}

.timeline-empty__description {
	margin: 0 0 1.5rem 0;
	font-size: var(--timeline-font-size-base, 1rem);
	color: var(--timeline-text-secondary, #536471);
	line-height: 1.5;
}
```

---

## ♿ Accessibility

### ARIA Attributes

```html
<div class="timeline-empty" role="status">
	<!-- Content announces to screen readers -->
</div>
```

**Screen Reader Support**:

- `role="status"` - Announces content changes
- Semantic HTML with proper headings
- Descriptive text for all icons
- Focus-able action buttons

---

## 🧪 Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/svelte';
import { Timeline } from '@equaltoai/greater-components-fediverse';

describe('Timeline.EmptyState', () => {
	it('renders default empty state', () => {
		render(Timeline.EmptyState);

		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.getByText('No posts')).toBeInTheDocument();
	});

	it('renders custom title and description', () => {
		render(Timeline.EmptyState, {
			props: {
				title: 'Custom Title',
				description: 'Custom Description',
			},
		});

		expect(screen.getByText('Custom Title')).toBeInTheDocument();
		expect(screen.getByText('Custom Description')).toBeInTheDocument();
	});

	it('renders action button', () => {
		const { container } = render(Timeline.EmptyState, {
			props: {
				title: 'No posts',
				description: 'Get started',
			},
		});

		const actionSlot = container.querySelector('.timeline-empty__action');
		expect(actionSlot).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Timeline.Root](./Root.md) - Timeline context provider
- [Timeline.ErrorState](./ErrorState.md) - Error display
- [Timeline.LoadMore](./LoadMore.md) - Load more trigger

---

## 📚 See Also

- [Timeline Components README](./README.md)
- [UX Best Practices](../../guides/ux-best-practices.md)
- [Empty States Design Guide](../../guides/empty-states.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0
