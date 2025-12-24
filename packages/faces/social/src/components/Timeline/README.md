# Timeline Compound Component

A flexible, composable timeline component system for displaying ActivityPub/Fediverse posts with virtualization, infinite scroll, and real-time updates.

## Architecture

Built using the **compound component pattern**, Timeline provides maximum flexibility through separate sub-components that share state via context:

- **Timeline.Root** - Container providing context and scroll management
- **Timeline.Item** - Individual timeline item wrapper
- **Timeline.LoadMore** - Pagination trigger with loading state
- **Timeline.EmptyState** - Display when no items
- **Timeline.ErrorState** - Error handling with retry

## Basic Usage

```svelte
<script>
	import {
		TimelineCompound as Timeline,
		StatusCompound as Status,
	} from '@equaltoai/greater-components/faces/social';

	const posts = [
		/* ... */
	]; // Status[] from API

	async function handleLoadMore() {
		// Fetch more posts
	}
</script>

<Timeline.Root items={posts} handlers={{ onLoadMore: handleLoadMore }}>
	{#each posts as status, index}
		<Timeline.Item {status} {index}>
			<Status.Root {status}>
				<Status.Header />
				<Status.Content />
				<Status.Actions />
			</Status.Root>
		</Timeline.Item>
	{/each}
	<Timeline.LoadMore />
</Timeline.Root>
```

## Configuration

### Display Modes

```svelte
<Timeline.Root
  {items}
  config={{
    mode: 'feed',        // 'feed' | 'thread' | 'profile' | 'search'
    density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
    virtualized: true,    // Enable virtual scrolling
    infiniteScroll: true, // Auto-load more on scroll
    realtime: false       // Real-time updates
  }}
>
```

### Handlers

```svelte
<Timeline.Root
  {items}
  handlers={{
    onLoadMore: async () => {
      // Fetch and add more items
    },
    onRefresh: async () => {
      // Refresh timeline
    },
    onItemClick: (status, index) => {
      // Navigate to status detail
    },
    onScroll: (scrollTop) => {
      // Track scroll position
    }
  }}
>
```

## With Empty and Error States

```svelte
<script>
	let error = $state(null);
	let loading = $state(false);

	async function handleRetry() {
		error = null;
		await loadPosts();
	}
</script>

<Timeline.Root {items} initialState={{ error, loading }}>
	{#if error}
		<Timeline.ErrorState {error} onRetry={handleRetry} />
	{:else if loading}
		<div class="loading">Loading timeline...</div>
	{:else if items.length === 0}
		<Timeline.EmptyState title="No posts yet" description="Follow some accounts to see posts here">
			<button onclick={handleDiscover}>Discover accounts</button>
		</Timeline.EmptyState>
	{:else}
		{#each items as status, index}
			<Timeline.Item {status} {index}>
				<!-- Status content -->
			</Timeline.Item>
		{/each}
		<Timeline.LoadMore />
	{/if}
</Timeline.Root>
```

## Custom Styling

All components support custom styling through CSS custom properties and classes:

```svelte
<Timeline.Root
  {items}
  config={{
    class: 'my-custom-timeline'
  }}
>
```

```css
.my-custom-timeline {
	--timeline-bg: #f8f9fa;
	--timeline-border: #dee2e6;
	--timeline-text-primary: #212529;
	--timeline-text-secondary: #6c757d;
	--timeline-button-bg: #0d6efd;
	--timeline-button-hover-bg: #0b5ed7;
	--timeline-item-spacing: 1rem;
}
```

## Custom Content Rendering

### Custom LoadMore Button

```svelte
<Timeline.LoadMore>
	{#snippet button()}
		<button class="my-load-more-btn"> Show me more posts! </button>
	{/snippet}
</Timeline.LoadMore>
```

### Custom Empty State

```svelte
<Timeline.EmptyState>
	{#snippet children()}
		<div class="custom-empty">
			<img src="/empty-state.svg" alt="" />
			<h2>Nothing here yet</h2>
			<p>Be the first to post something!</p>
			<button>Create a post</button>
		</div>
	{/snippet}
</Timeline.EmptyState>
```

## Performance

### Virtual Scrolling

For large timelines (1000+ items), enable virtualization:

```svelte
<Timeline.Root
  {items}
  config={{
    virtualized: true,
    estimatedItemHeight: 200, // Average height in pixels
    overscan: 5                // Items to render outside viewport
  }}
>
```

### Infinite Scroll

Automatically load more items when near bottom:

```svelte
<Timeline.Root
  {items}
  config={{ infiniteScroll: true }}
  handlers={{
    onLoadMore: async () => {
      const morePosts = await fetchMorePosts();
      items = [...items, ...morePosts];
    }
  }}
>
```

## TypeScript Support

Full type safety with exported interfaces:

```typescript
import type {
	TimelineContext,
	TimelineCompoundConfig,
	TimelineHandlers,
	TimelineCompoundState,
	TimelineMode,
	TimelineDensity,
} from '@equaltoai/greater-components/faces/social';

const config: TimelineCompoundConfig = {
	mode: 'feed',
	density: 'comfortable',
	virtualized: true,
};

const handlers: TimelineHandlers = {
	onLoadMore: async () => {
		/* ... */
	},
};
```

## Deletion & Tombstones

- Timeline items marked as deleted (`type: 'tombstone'`, `metadata.lesser.isDeleted`, or statuses with `isDeleted`) render a muted tombstone row instead of the full status. Replies and thread structure remain intact.
- Pair with `Status.Actions`’ opt-in `showDelete` + `onDelete` to surface a delete affordance; Lesser-backed timelines default to tombstone rendering when deletions flow through the adapters/stores.

## Accessibility

Timeline components follow WCAG 2.1 AA guidelines:

- `role="feed"` on Timeline.Root for screen readers
- `role="article"` on Timeline.Item
- `aria-busy` states during loading
- `aria-posinset` and `aria-setsize` for item position
- Keyboard navigation support
- Focus management

## Real-World Example

```svelte
<script>
	import {
		TimelineCompound as Timeline,
		StatusCompound as Status,
	} from '@equaltoai/greater-components/faces/social';

	let posts = $state([]);
	let hasMore = $state(true);
	let error = $state(null);

	async function loadMore() {
		try {
			const response = await fetch('/api/timeline?offset=' + posts.length);
			const newPosts = await response.json();

			posts = [...posts, ...newPosts];
			hasMore = newPosts.length > 0;
		} catch (err) {
			error = err;
		}
	}

	function handleStatusClick(status, index) {
		window.location.href = `/status/${status.id}`;
	}
</script>

<Timeline.Root
	items={posts}
	config={{
		mode: 'feed',
		density: 'comfortable',
		virtualized: true,
		infiniteScroll: true,
	}}
	handlers={{
		onLoadMore: loadMore,
		onItemClick: handleStatusClick,
	}}
	initialState={{ hasMore, error }}
>
	{#if error}
		<Timeline.ErrorState {error} onRetry={loadMore} />
	{:else if posts.length === 0}
		<Timeline.EmptyState />
	{:else}
		{#each posts as status, index}
			<Timeline.Item {status} {index}>
				<Status.Root {status}>
					<Status.Header />
					<Status.Content />
					<Status.Media />
					<Status.Actions />
				</Status.Root>
			</Timeline.Item>
		{/each}
		{#if hasMore}
			<Timeline.LoadMore />
		{/if}
	{/if}
</Timeline.Root>
```

## Migration from TimelineVirtualized

If you're migrating from the old `TimelineVirtualized` component:

### Before

```svelte
<TimelineVirtualized
  items={posts}
  {itemHeight}
  renderItem={(status) => <StatusCard {status} />}
  onLoadMore={handleLoadMore}
/>
```

### After

```svelte
<Timeline.Root
	items={posts}
	config={{ estimatedItemHeight: itemHeight }}
	handlers={{ onLoadMore: handleLoadMore }}
>
	{#each posts as status, index}
		<Timeline.Item {status} {index}>
			<Status.Root {status}>
				<Status.Header />
				<Status.Content />
				<Status.Actions />
			</Status.Root>
		</Timeline.Item>
	{/each}
	<Timeline.LoadMore />
</Timeline.Root>
```

## Benefits over old TimelineVirtualized

1. **Composable** - Mix and match sub-components
2. **Flexible** - Full control over rendering
3. **Type-safe** - Better TypeScript support
4. **Accessible** - Built-in ARIA attributes
5. **Customizable** - Easy to style and extend
6. **Modern** - Uses Svelte 5 runes and patterns
