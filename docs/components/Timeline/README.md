# Timeline Components

**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Components**: 5 components

---

## 📋 Overview

The Timeline component group provides a complete solution for displaying chronological feeds of content in fediverse applications. These components are designed to handle large datasets efficiently using virtual scrolling, support real-time updates via WebSocket subscriptions, and provide an accessible, mobile-responsive experience.

### **Key Features**:

- 📜 **Virtual Scrolling** - Efficiently render thousands of items with `@tanstack/svelte-virtual`
- 🔄 **Real-time Updates** - WebSocket subscriptions for live timeline updates
- ⚡ **Infinite Scroll** - Automatic loading of more items as user scrolls
- 📱 **Mobile-Responsive** - Touch-friendly, optimized for all screen sizes
- ⌨️ **Keyboard Navigation** - Full keyboard accessibility
- 🎨 **Customizable** - Flexible styling with CSS custom properties
- 🔧 **Composable** - Mix and match components for custom layouts
- 🎯 **Type-Safe** - Full TypeScript support with generic types

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🏗️ Architecture

The Timeline components follow the **Compound Component Pattern**, where `Timeline.Root` provides context and child components consume it. This pattern enables:

1. **Separation of Concerns** - Each component has a single responsibility
2. **Flexible Composition** - Build custom timeline layouts
3. **Shared State** - Components automatically share timeline state
4. **Type Safety** - Context ensures type-safe prop passing

### **Component Hierarchy**:

```
Timeline.Root (Context Provider)
├── Timeline.Item (Item Wrapper)
├── Timeline.LoadMore (Pagination Control)
├── Timeline.EmptyState (Empty Placeholder)
└── Timeline.ErrorState (Error Display)
```

---

## 🚀 Quick Start

### Basic Timeline

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

	let items: GenericTimelineItem[] = $state([]);

	async function loadMore() {
		// Fetch more items from API
		const newItems = await fetchTimeline();
		items = [...items, ...newItems];
	}
</script>

<Timeline.Root {items} handlers={{ onLoadMore: loadMore }}>
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

	<Timeline.LoadMore />
</Timeline.Root>
```

### With Virtual Scrolling

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';

	let items = $state([
		/* 10,000+ items */
	]);
</script>

<Timeline.Root
	{items}
	config={{
		virtualized: true,
		estimatedItemHeight: 200,
		overscan: 5,
	}}
>
	{#each items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item}>
				<!-- Status content -->
			</Status.Root>
		</Timeline.Item>
	{/each}
</Timeline.Root>
```

### With Real-time Updates

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
	import { createTimelineStore } from '@equaltoai/greater-components-adapters';

	const timeline = createTimelineStore({
		endpoint: 'wss://api.lesser.social/graphql',
		timeline: 'home',
		realtime: true, // Enable WebSocket subscriptions
	});

	$effect(() => {
		// Subscribe to new posts
		const unsubscribe = timeline.subscribe();
		return () => unsubscribe();
	});
</script>

<Timeline.Root items={$timeline.items} config={{ realtime: true }}>
	{#each $timeline.items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item}>
				<Status.Header />
				<Status.Content />
				<Status.Actions />
			</Status.Root>
		</Timeline.Item>
	{/each}
</Timeline.Root>
```

### With Empty & Error States

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';

	let items = $state([]);
	let error = $state<Error | null>(null);

	async function handleRetry() {
		error = null;
		try {
			items = await fetchTimeline();
		} catch (e) {
			error = e as Error;
		}
	}
</script>

<Timeline.Root {items}>
	{#if error}
		<Timeline.ErrorState {error} onRetry={handleRetry} />
	{:else if items.length === 0}
		<Timeline.EmptyState
			title="No posts yet"
			description="Follow some accounts to see posts here"
		/>
	{:else}
		{#each items as item, index}
			<Timeline.Item {item} {index}>
				<!-- Content -->
			</Timeline.Item>
		{/each}
	{/if}
</Timeline.Root>
```

---

## 🎯 Components

| Component               | Description                       | Documentation                    |
| ----------------------- | --------------------------------- | -------------------------------- |
| **Timeline.Root**       | Context provider and container    | [Root.md](./Root.md)             |
| **Timeline.Item**       | Individual timeline item wrapper  | [Item.md](./Item.md)             |
| **Timeline.LoadMore**   | Load more trigger/infinite scroll | [LoadMore.md](./LoadMore.md)     |
| **Timeline.EmptyState** | Empty timeline placeholder        | [EmptyState.md](./EmptyState.md) |
| **Timeline.ErrorState** | Error display with retry          | [ErrorState.md](./ErrorState.md) |

---

## 🔄 Real-time Integration

Timeline components support real-time updates via WebSocket subscriptions:

### GraphQL Subscriptions

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components-fediverse';
	import { createApolloClient } from '@equaltoai/greater-components-adapters';
	import { gql } from '@apollo/client/core';

	const client = createApolloClient({
		uri: 'wss://api.lesser.social/graphql',
	});

	let items = $state([]);

	// Subscribe to new posts
	const subscription = client.subscribe({
		query: gql`
			subscription OnStatusCreated($timeline: String!) {
				statusCreated(timeline: $timeline) {
					id
					content
					account {
						id
						username
						displayName
						avatar
					}
					createdAt
				}
			}
		`,
		variables: { timeline: 'home' },
	});

	subscription.subscribe({
		next: ({ data }) => {
			// Prepend new item to timeline
			items = [data.statusCreated, ...items];
		},
		error: (err) => console.error('Subscription error:', err),
	});
</script>

<Timeline.Root {items} config={{ realtime: true }}>
	<!-- Timeline items -->
</Timeline.Root>
```

### Optimistic Updates

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';

	let items = $state([]);

	async function handleBoost(status: GenericStatus) {
		// Optimistic update
		const originalBoosted = status.reblogged;
		status.reblogged = !status.reblogged;
		status.reblogsCount += status.reblogged ? 1 : -1;

		// Trigger UI update
		items = [...items];

		try {
			await boostStatus(status.id);
		} catch (error) {
			// Rollback on error
			status.reblogged = originalBoosted;
			status.reblogsCount += status.reblogged ? 1 : -1;
			items = [...items];
		}
	}
</script>

<Timeline.Root {items}>
	{#each items as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item} handlers={{ onBoost: handleBoost }}>
				<Status.Actions />
			</Status.Root>
		</Timeline.Item>
	{/each}
</Timeline.Root>
```

---

## ⚡ Performance

### Virtual Scrolling

Timeline components use virtual scrolling to efficiently render large datasets:

```svelte
<Timeline.Root
	{items}
	config={{
		virtualized: true,
		estimatedItemHeight: 200, // Average item height
		overscan: 5, // Items to render outside viewport
	}}
>
	<!-- Only visible items are rendered in DOM -->
</Timeline.Root>
```

**Performance Benefits**:

- ✅ Renders only visible items + overscan
- ✅ Handles 10,000+ items smoothly
- ✅ Minimal DOM nodes (30-40 typically)
- ✅ Smooth scrolling with 60fps
- ✅ Dynamic item heights supported

### Infinite Scroll

Automatically load more items as user scrolls:

```svelte
<Timeline.Root
	{items}
	config={{ infiniteScroll: true }}
	handlers={{
		onLoadMore: async () => {
			const newItems = await fetchMore();
			items = [...items, ...newItems];
		},
	}}
>
	<!-- LoadMore component not needed -->
</Timeline.Root>
```

**Configuration**:

- Triggers when within 400px of bottom
- Prevents duplicate requests
- Shows loading state automatically
- Respects `hasMore` state

---

## ♿ Accessibility

Timeline components follow WCAG 2.1 Level AA guidelines:

### ARIA Roles

```html
<div role="feed" aria-busy="false">
	<article role="article" aria-posinset="1" aria-setsize="100">
		<!-- Item content -->
	</article>
</div>
```

### Keyboard Navigation

| Key         | Action                             |
| ----------- | ---------------------------------- |
| `Tab`       | Focus next interactive element     |
| `Shift+Tab` | Focus previous interactive element |
| `Enter`     | Activate focused item              |
| `Space`     | Activate focused item              |
| `Home`      | Scroll to top                      |
| `End`       | Scroll to bottom                   |

### Screen Readers

```svelte
<Timeline.Root {items}>
	<Timeline.Item {item} {index}>
		<!-- Announces: "Article 1 of 100" -->
	</Timeline.Item>
</Timeline.Root>
```

**Features**:

- ✅ Semantic HTML (`<article>`, `<time>`, etc.)
- ✅ ARIA labels and descriptions
- ✅ Loading state announcements
- ✅ Error announcements with `role="alert"`
- ✅ Focus management
- ✅ Skip links for long timelines

---

## 🎨 Styling

### CSS Custom Properties

Timeline components expose CSS variables for customization:

```css
.timeline-root {
	/* Colors */
	--timeline-bg: white;
	--timeline-border: #e1e8ed;
	--timeline-item-bg: white;
	--timeline-item-hover-bg: #f7f9fa;
	--timeline-focus-ring: #3b82f6;

	/* Text */
	--timeline-text-primary: #0f1419;
	--timeline-text-secondary: #536471;

	/* Spacing */
	--timeline-spacing: 1rem;
	--timeline-spacing-lg: 2rem;
	--timeline-item-spacing: 1rem;

	/* Typography */
	--timeline-font-size-base: 1rem;
	--timeline-font-size-sm: 0.875rem;
	--timeline-font-size-xl: 1.25rem;

	/* Buttons */
	--timeline-button-bg: #1d9bf0;
	--timeline-button-text: white;
	--timeline-button-hover-bg: #1a8cd8;
	--timeline-button-radius: 9999px;

	/* Scrollbar */
	--timeline-scrollbar-track: transparent;
	--timeline-scrollbar-thumb: #ccc;
	--timeline-scrollbar-thumb-hover: #999;
}
```

### Density Modes

```svelte
<Timeline.Root
  {items}
  config={{ density: 'compact' }} <!-- 'compact' | 'comfortable' | 'spacious' -->
>
  <!-- Items automatically adjust spacing -->
</Timeline.Root>
```

### Custom Classes

```svelte
<Timeline.Root {items} config={{ class: 'my-custom-timeline' }}>
	<Timeline.Item {item} {index} class="my-custom-item">
		<!-- Custom styling -->
	</Timeline.Item>
</Timeline.Root>
```

---

## 🔒 Security

### Content Sanitization

Timeline components automatically sanitize HTML content to prevent XSS:

```typescript
// ContentRenderer component handles sanitization
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(content, {
	ALLOWED_TAGS: ['p', 'br', 'a', 'span', 'strong', 'em'],
	ALLOWED_ATTR: ['href', 'class', 'rel', 'target'],
});
```

### Link Safety

External links automatically get safe attributes:

```html
<a href="external-link" rel="noopener noreferrer nofollow" target="_blank"> Link </a>
```

### Rate Limiting

Implement rate limiting for actions:

```svelte
<script lang="ts">
	import { rateLimit } from '@equaltoai/greater-components-utils';

	const limitedLoadMore = rateLimit(loadMore, 1000); // Max once per second
</script>

<Timeline.Root handlers={{ onLoadMore: limitedLoadMore }}>
	<!-- Timeline -->
</Timeline.Root>
```

---

## 🧪 Testing

Timeline components have comprehensive test coverage:

```typescript
// Example: Testing Timeline.Root
import { render } from '@testing-library/svelte';
import { Timeline } from '@equaltoai/greater-components-fediverse';

test('renders timeline items', () => {
	const items = [
		{ id: '1', content: 'Post 1' },
		{ id: '2', content: 'Post 2' },
	];

	const { getAllByRole } = render(Timeline.Root, { props: { items } });
	const articles = getAllByRole('article');

	expect(articles).toHaveLength(2);
});
```

**Test Coverage**:

- ✅ Component rendering
- ✅ Virtual scrolling behavior
- ✅ Infinite scroll triggers
- ✅ Real-time updates
- ✅ Error handling
- ✅ Keyboard navigation
- ✅ Screen reader announcements

---

## 📚 Examples

### Custom Timeline Layout

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';

	let items = $state([]);
</script>

<div class="custom-timeline-layout">
	<aside class="timeline-filters">
		<!-- Custom filters -->
	</aside>

	<main class="timeline-main">
		<Timeline.Root
			{items}
			config={{
				virtualized: true,
				density: 'comfortable',
			}}
		>
			{#each items as item, index}
				<Timeline.Item {item} {index}>
					<div class="custom-item-wrapper">
						<Status.Root status={item}>
							<Status.Header />
							<Status.Content />
							<Status.Media />
							<Status.Actions />
						</Status.Root>
					</div>
				</Timeline.Item>
			{/each}

			<Timeline.LoadMore buttonText="Show more posts" />
		</Timeline.Root>
	</main>

	<aside class="timeline-sidebar">
		<!-- Trending, suggestions, etc. -->
	</aside>
</div>

<style>
	.custom-timeline-layout {
		display: grid;
		grid-template-columns: 300px 1fr 350px;
		gap: 1rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	@media (max-width: 1024px) {
		.custom-timeline-layout {
			grid-template-columns: 1fr;
		}
		.timeline-filters,
		.timeline-sidebar {
			display: none;
		}
	}
</style>
```

### Thread View

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';

	let thread = $state([]);

	async function loadThread(statusId: string) {
		// Fetch status and its context (ancestors + descendants)
		const { ancestors, status, descendants } = await fetchThread(statusId);
		thread = [...ancestors, status, ...descendants];
	}
</script>

<Timeline.Root items={thread} config={{ mode: 'thread' }}>
	{#each thread as item, index}
		<Timeline.Item {item} {index}>
			<Status.Root status={item} config={{ showThread: true }}>
				<Status.Header />
				<Status.Content />
				<Status.Actions />
			</Status.Root>
		</Timeline.Item>
	{/each}
</Timeline.Root>
```

### Profile Timeline

```svelte
<script lang="ts">
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';

	let posts = $state([]);
	let account = $state(null);

	async function loadProfile(username: string) {
		account = await fetchAccount(username);
		posts = await fetchAccountPosts(account.id);
	}
</script>

<div class="profile-container">
	<header class="profile-header">
		<img src={account?.avatar} alt={account?.displayName} />
		<h1>{account?.displayName}</h1>
		<p>@{account?.acct}</p>
	</header>

	<Timeline.Root items={posts} config={{ mode: 'profile' }}>
		{#if posts.length === 0}
			<Timeline.EmptyState
				title="No posts"
				description="{account?.displayName} hasn't posted anything yet"
			/>
		{:else}
			{#each posts as item, index}
				<Timeline.Item {item} {index}>
					<Status.Root status={item}>
						<Status.Header />
						<Status.Content />
						<Status.Media />
					</Status.Root>
				</Timeline.Item>
			{/each}

			<Timeline.LoadMore />
		{/if}
	</Timeline.Root>
</div>
```

---

## 🔗 Related Components

- **[Status Components](../Status/README.md)** - Display individual posts
- **[Compose Components](../Compose/README.md)** - Create new posts
- **[Profile Components](../Profile/README.md)** - User profiles

---

## 📖 Additional Resources

- [Virtual Scrolling Guide](../../guides/virtual-scrolling.md)
- [Real-time Integration Guide](../../guides/realtime.md)
- [Performance Optimization](../../guides/performance.md)
- [Accessibility Best Practices](../../guides/accessibility.md)
- [API Documentation](../../API_DOCUMENTATION.md)

---

## 💡 Tips

1. **Use Virtual Scrolling** for timelines with 100+ items
2. **Enable Infinite Scroll** for better UX on mobile
3. **Implement Optimistic Updates** for instant feedback
4. **Add Content Warnings** for sensitive content
5. **Test with Screen Readers** to ensure accessibility
6. **Monitor Performance** with browser DevTools
7. **Implement Error Boundaries** for graceful error handling
8. **Cache Timeline Data** to reduce API calls

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0
