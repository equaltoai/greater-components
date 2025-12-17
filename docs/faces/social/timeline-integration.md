# Social Face: Timeline Integration

> Building virtualized timeline views with real-time updates.

The Timeline component is one of the most important parts of the Social Face, providing virtualized scrolling, real-time updates, and various timeline views (home, local, federated, user, hashtag).

## Timeline Components

```svelte
<script lang="ts">
	import { Timeline } from '$lib/components/faces/social';
</script>

<Timeline.Root store={timelineStore}>
	<Timeline.Header title="Home" />
	<Timeline.Feed />
	<Timeline.LoadMore />
</Timeline.Root>
```

## Timeline Store

The timeline uses a reactive store for state management:

```typescript
import { createTimelineStore } from '@equaltoai/greater-components/adapters';

const timeline = createTimelineStore({
	type: 'home', // 'home' | 'local' | 'federated' | 'user' | 'hashtag'
	adapter: lesserAdapter,
	options: {
		limit: 20,
		realtime: true,
	},
});
```

## Timeline Types

| Type        | Description                        | Props     |
| ----------- | ---------------------------------- | --------- |
| `home`      | Home timeline of followed accounts | -         |
| `local`     | Local instance timeline            | -         |
| `federated` | Federated/public timeline          | -         |
| `user`      | Single user's timeline             | `userId`  |
| `hashtag`   | Hashtag timeline                   | `hashtag` |
| `list`      | List timeline                      | `listId`  |

## Virtualized Scrolling

For large timelines, use the virtualized timeline component:

```svelte
<script lang="ts">
	import { TimelineVirtualized } from '$lib/components/faces/social';
</script>

<TimelineVirtualized {adapter} view={{ type: 'home' }} estimateSize={320} overscan={3} />
```

### Performance Considerations

- **estimateSize**: Approximate height of each status in pixels
- **overscan**: Number of items to render outside the visible area
- **debounce**: Scroll event debouncing (default: 100ms)

## Real-time Updates

Enable real-time updates with WebSocket streaming:

```typescript
const timeline = createTimelineStore({
	type: 'home',
	adapter,
	options: {
		realtime: true,
		streamEndpoint: 'wss://your-instance.social/streaming',
	},
});
```

## Thread Views

For viewing conversation threads:

```svelte
<script lang="ts">
	import { Thread } from '$lib/components/faces/social';
</script>

<Thread.Root status={focusStatus} {ancestors} {descendants}>
	<Thread.Ancestors />
	<Thread.Focus />
	<Thread.Descendants />
</Thread.Root>
```

## Actions and Handlers

```typescript
const handlers = {
	onFavourite: async (status) => {
		await adapter.favouriteStatus(status.id);
	},
	onBoost: async (status) => {
		await adapter.reblogStatus(status.id);
	},
	onReply: (status) => {
		openComposeModal({ replyTo: status });
	},
	onDelete: async (status) => {
		await adapter.deleteStatus(status.id);
	},
};
```

## Related Documentation

- [Getting Started](./getting-started.md)
- [Authentication](./authentication.md)
- [Core Patterns](../../core-patterns.md)
