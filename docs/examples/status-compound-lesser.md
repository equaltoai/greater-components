# Using Status Compound Components in Lesser

Comprehensive examples of using Greater Components' Status compound components in the Lesser native client.

## Basic Implementation

### Simple Feed Item

```svelte
<!-- lesser/src/components/FeedItem.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import { boostPost, favoritePost, replyToPost } from '$lib/api';
	import type { Status as StatusType } from '@equaltoai/greater-components-fediverse';

	interface Props {
		post: StatusType;
	}

	let { post }: Props = $props();
</script>

<Status.Root
	status={post}
	config={{
		density: 'comfortable',
		clickable: true,
		class: 'lesser-feed-item',
	}}
	handlers={{
		onClick: (status) => goto(`/posts/${status.id}`),
		onReply: replyToPost,
		onBoost: boostPost,
		onFavorite: favoritePost,
	}}
>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>

<style>
	:global(.lesser-feed-item) {
		--status-bg: var(--lesser-bg-primary);
		--status-bg-hover: var(--lesser-bg-secondary);
		--status-border-color: var(--lesser-border-color);
		--status-text-primary: var(--lesser-text-primary);
		--status-link-color: var(--lesser-color-primary);
	}
</style>
```

## Advanced Customizations

### Custom Avatar with Presence Indicator

```svelte
<!-- lesser/src/components/StatusWithPresence.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import { userPresence } from '$lib/stores/presence';

	let { post } = $props();

	const isOnline = $derived($userPresence[post.account.id]?.status === 'online');
</script>

<Status.Root status={post}>
	<Status.Header>
		{#snippet avatar()}
			<div class="avatar-wrapper">
				<img src={post.account.avatar} alt="" class="avatar" />
				{#if isOnline}
					<div class="presence-indicator online" title="Online"></div>
				{/if}
			</div>
		{/snippet}
	</Status.Header>
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>

<style>
	.avatar-wrapper {
		position: relative;
		width: 48px;
		height: 48px;
	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}

	.presence-indicator {
		position: absolute;
		bottom: 2px;
		right: 2px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--lesser-bg-primary);
	}

	.presence-indicator.online {
		background: #22c55e;
	}
</style>
```

### Compact Timeline View

```svelte
<!-- lesser/src/components/CompactTimeline.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import { TimelineVirtualized } from '@equaltoai/greater-components-fediverse';

	let { items, onLoadMore } = $props();
</script>

<div class="compact-timeline">
	<TimelineVirtualized {items} {onLoadMore} estimateSize={120}>
		{#snippet item(status)}
			<Status.Root
				{status}
				config={{
					density: 'compact',
					showActions: false,
					clickable: true,
				}}
			>
				<Status.Header />
				<Status.Content />
				<!-- No media in compact view -->
			</Status.Root>
		{/snippet}
	</TimelineVirtualized>
</div>
```

### Thread View with Nesting

```svelte
<!-- lesser/src/components/ThreadView.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';

	let { thread, depth = 0 } = $props();

	const maxDepth = 10;
	const indent = depth * 24;
</script>

{#each thread as post}
	<div class="thread-item" style="margin-left: {indent}px">
		<Status.Root
			status={post}
			config={{
				density: 'comfortable',
				showActions: depth === 0, // Only show actions on root
			}}
		>
			{#if depth > 0}
				<!-- Show thread line indicator -->
				<div class="thread-line"></div>
			{/if}

			<Status.Header />
			<Status.Content />
			<Status.Media />
			{#if depth === 0}
				<Status.Actions />
			{/if}
		</Status.Root>

		{#if post.replies && depth < maxDepth}
			<svelte:self thread={post.replies} depth={depth + 1} />
		{/if}
	</div>
{/each}

<style>
	.thread-item {
		position: relative;
	}

	.thread-line {
		position: absolute;
		left: -12px;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--lesser-border-color);
	}
</style>
```

### Custom Action Bar with Bookmarks

```svelte
<!-- lesser/src/components/StatusWithBookmark.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { BookmarkIcon, BookmarkSolidIcon } from '@equaltoai/greater-components-icons';
	import { bookmarkPost, unbookmarkPost } from '$lib/api';

	let { post } = $props();

	const bookmarkButton = createButton({
		pressed: post.bookmarked,
		onClick: async () => {
			bookmarkButton.helpers.setLoading(true);
			try {
				if (bookmarkButton.state.pressed) {
					await unbookmarkPost(post.id);
				} else {
					await bookmarkPost(post.id);
				}
				bookmarkButton.helpers.setPressed(!bookmarkButton.state.pressed);
			} finally {
				bookmarkButton.helpers.setLoading(false);
			}
		},
	});
</script>

<Status.Root {post}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions>
		{#snippet actions()}
			<div class="custom-actions">
				<!-- Regular actions -->
				<Status.Actions size="sm" />

				<!-- Custom bookmark button -->
				<button
					use:bookmarkButton.actions.button
					class="bookmark-button"
					class:bookmarked={bookmarkButton.state.pressed}
					aria-label={bookmarkButton.state.pressed ? 'Remove bookmark' : 'Add bookmark'}
				>
					{#if bookmarkButton.state.pressed}
						<BookmarkSolidIcon />
					{:else}
						<BookmarkIcon />
					{/if}
				</button>
			</div>
		{/snippet}
	</Status.Actions>
</Status.Root>

<style>
	.custom-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bookmark-button {
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: var(--lesser-radius-sm);
		cursor: pointer;
		color: var(--lesser-text-secondary);
		transition: all 150ms;
	}

	.bookmark-button:hover {
		background: var(--lesser-color-bookmark-hover);
		color: var(--lesser-color-bookmark);
	}

	.bookmark-button.bookmarked {
		color: var(--lesser-color-bookmark);
	}
</style>
```

### Notifications View

```svelte
<!-- lesser/src/components/NotificationItem.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import type { Notification } from '@equaltoai/greater-components-fediverse';

	let { notification }: { notification: Notification } = $props();

	const notificationIcons = {
		favourite: '❤️',
		reblog: '🔁',
		mention: '@',
		follow: '👤',
	};
</script>

<article class="notification-item notification-item--{notification.type}">
	<div class="notification-meta">
		<span class="notification-icon">
			{notificationIcons[notification.type]}
		</span>
		<span class="notification-text">
			<strong>{notification.account.displayName}</strong>
			{#if notification.type === 'favourite'}
				favorited your post
			{:else if notification.type === 'reblog'}
				boosted your post
			{:else if notification.type === 'mention'}
				mentioned you
			{:else if notification.type === 'follow'}
				followed you
			{/if}
		</span>
	</div>

	{#if notification.status}
		<Status.Root
			status={notification.status}
			config={{
				density: 'compact',
				showActions: false,
				clickable: true,
			}}
		>
			<Status.Content />
			<Status.Media />
		</Status.Root>
	{/if}
</article>

<style>
	.notification-item {
		padding: 1rem;
		border-bottom: 1px solid var(--lesser-border-color);
	}

	.notification-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.notification-icon {
		font-size: 1.25rem;
	}

	.notification-text {
		font-size: 0.875rem;
		color: var(--lesser-text-secondary);
	}
</style>
```

### Quote Posts

```svelte
<!-- lesser/src/components/QuotePost.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';

	let { post, quotedPost } = $props();
</script>

<Status.Root {post}>
	<Status.Header />
	<Status.Content />
	<Status.Media />

	<!-- Quoted post as embedded card -->
	{#if quotedPost}
		<div class="quoted-post">
			<Status.Root
				status={quotedPost}
				config={{
					density: 'compact',
					showActions: false,
					clickable: true,
					class: 'quoted-post-card',
				}}
			>
				<Status.Header />
				<Status.Content />
			</Status.Root>
		</div>
	{/if}

	<Status.Actions />
</Status.Root>

<style>
	.quoted-post {
		margin: 0.75rem 0;
		border: 1px solid var(--lesser-border-color);
		border-radius: var(--lesser-radius-md);
		overflow: hidden;
	}

	:global(.quoted-post-card) {
		border-bottom: none !important;
	}
</style>
```

## Performance Optimizations

### Virtual Scrolling with Compound Components

```svelte
<!-- lesser/src/components/OptimizedTimeline.svelte -->
<script lang="ts">
	import { Status } from '@equaltoai/greater-components-fediverse';
	import { createVirtualizer } from '@tanstack/svelte-virtual';

	let { posts, onLoadMore } = $props();

	let scrollElement: HTMLElement;

	const rowVirtualizer = $derived(
		createVirtualizer({
			count: posts.length,
			getScrollElement: () => scrollElement,
			estimateSize: () => 200,
			overscan: 5,
		})
	);

	$effect(() => {
		const lastItem = $rowVirtualizer.getVirtualItems().at(-1);
		if (lastItem && lastItem.index >= posts.length - 1) {
			onLoadMore();
		}
	});
</script>

<div bind:this={scrollElement} class="timeline-scroll">
	<div style="height: {$rowVirtualizer.getTotalSize()}px; position: relative;">
		{#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
			{@const post = posts[virtualRow.index]}
			<div
				style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transform: translateY({virtualRow.start}px);
        "
			>
				<Status.Root {post}>
					<Status.Header />
					<Status.Content />
					<Status.Media />
					<Status.Actions />
				</Status.Root>
			</div>
		{/each}
	</div>
</div>
```

## Testing

### Unit Tests

```typescript
// lesser/tests/components/StatusCompound.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { Status } from '@equaltoai/greater-components-fediverse';

describe('Status Compound Component', () => {
	const mockStatus = {
		id: '123',
		account: {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			avatar: 'https://example.com/avatar.jpg',
			acct: 'alice@example.com',
			url: 'https://example.com/@alice',
		},
		content: '<p>Hello world!</p>',
		createdAt: new Date('2025-01-01'),
		repliesCount: 5,
		reblogsCount: 10,
		favouritesCount: 15,
		reblogged: false,
		favourited: false,
		bookmarked: false,
	};

	it('renders all parts correctly', () => {
		const { getByText, getByRole } = render(Status.Root, {
			props: { status: mockStatus },
			slots: {
				default: `
          <Status.Header />
          <Status.Content />
          <Status.Actions />
        `,
			},
		});

		expect(getByText('Alice')).toBeInTheDocument();
		expect(getByText('@alice@example.com')).toBeInTheDocument();
	});

	it('calls boost handler', async () => {
		const onBoost = vi.fn();

		const { getByLabelText } = render(Status.Root, {
			props: {
				status: mockStatus,
				handlers: { onBoost },
			},
			slots: {
				default: `
          <Status.Header />
          <Status.Actions />
        `,
			},
		});

		const boostButton = getByLabelText(/boost/i);
		await fireEvent.click(boostButton);

		expect(onBoost).toHaveBeenCalledWith(mockStatus);
	});
});
```

## Best Practices for Lesser

1. **Consistent Density** - Use `'comfortable'` for main timeline, `'compact'` for secondary views
2. **Action Handlers** - Centralize API calls in `$lib/api` module
3. **Custom Styling** - Use CSS custom properties for theme consistency
4. **Performance** - Use virtual scrolling for long timelines
5. **Accessibility** - Always provide action handlers for keyboard users
6. **Error Handling** - Show loading states and handle errors gracefully
7. **Optimistic Updates** - Update UI immediately, rollback on failure

## Migration Path

To migrate existing StatusCard usage to Status compound:

```diff
- <StatusCard
-   {status}
-   density="comfortable"
-   {onBoost}
-   {onFavorite}
- />
+ <Status.Root
+   {status}
+   config={{ density: 'comfortable' }}
+   handlers={{ onBoost, onFavorite }}
+ >
+   <Status.Header />
+   <Status.Content />
+   <Status.Media />
+   <Status.Actions />
+ </Status.Root>
```

The compound component provides the same functionality with more flexibility!
