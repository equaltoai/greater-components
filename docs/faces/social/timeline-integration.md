# Social Face: Timeline Integration

> Building virtualized timeline views with real-time updates.

The Timeline component is one of the most important parts of the Social Face, providing virtualized scrolling, real-time updates, and various timeline views (home, local, federated, user, hashtag).

## Timeline Components

```svelte
<script lang="ts">
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';
	import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';

	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
		wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT,
		token: import.meta.env.VITE_LESSER_TOKEN,
	});

	const view = { type: 'home' } as const;
</script>

<TimelineVirtualizedReactive {adapter} {view} estimateSize={320} />
```

## Timeline Views

`TimelineVirtualizedReactive` supports multiple view modes via the `view` prop.

## Timeline Types

| Type      | Description                        | Props      |
| --------- | ---------------------------------- | ---------- |
| `home`    | Home timeline of followed accounts | -          |
| `public`  | Public timeline                    | -          |
| `profile` | Single user's timeline             | `username` |
| `hashtag` | Hashtag timeline                   | `hashtag`  |
| `list`    | List timeline                      | `listId`   |

## Virtualized Scrolling

For large timelines, use the virtualized timeline component:

```svelte
<script lang="ts">
	import TimelineVirtualized from '$lib/components/TimelineVirtualized.svelte';
</script>

<TimelineVirtualized {adapter} view={{ type: 'home' }} estimateSize={320} overscan={3} />
```

### Performance Considerations

- **estimateSize**: Approximate height of each status in pixels
- **overscan**: Number of items to render outside the visible area
- **debounce**: Scroll event debouncing (default: 100ms)

## Real-time Updates

Enable real-time updates with WebSocket streaming:

Provide `wsEndpoint` to your `LesserGraphQLAdapter` and keep `TimelineVirtualizedReactive` mounted.

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
