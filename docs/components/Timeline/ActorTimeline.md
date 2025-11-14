# Actor Timeline

The actor timeline feature allows you to fetch and display posts from a specific actor (user).

## Overview

Lesser's GraphQL schema now supports an `ACTOR` timeline type, which fetches all posts from a specific actor. This is useful for profile pages, user post archives, and actor-specific views.

## Usage

### Fetch Actor Timeline

```typescript
import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://api.lesser.occult.work/graphql',
	wsEndpoint: 'wss://api.lesser.occult.work/graphql',
	token: 'your-auth-token',
});

// Fetch actor timeline
const timeline = await adapter.fetchActorTimeline('actor-id-123', {
	first: 20,
	mediaOnly: false, // Optional: only show posts with media
});

console.log(timeline.edges.map((edge) => edge.node));
console.log(timeline.pageInfo.hasNextPage);
```

### Pagination

```typescript
let cursor: string | undefined;
const allPosts = [];

do {
	const timeline = await adapter.fetchActorTimeline('actor-id-123', {
		first: 20,
		after: cursor,
	});

	allPosts.push(...timeline.edges.map((edge) => edge.node));
	cursor = timeline.pageInfo.endCursor;
} while (timeline.pageInfo.hasNextPage);
```

### Media-Only Posts

Fetch only posts that have media attachments:

```typescript
const mediaTimeline = await adapter.fetchActorTimeline('actor-id-123', {
	first: 20,
	mediaOnly: true,
});
```

### With Timeline Store

Use the actor timeline with the reactive timeline store:

```typescript
import {
	createLesserGraphQLAdapter,
	createTimelineStore,
	unifiedStatusesToTimelineItems,
} from '@equaltoai/greater-components-adapters';
import { TransportManager } from '@equaltoai/greater-components-adapters';

const adapter = createLesserGraphQLAdapter({
	/* config */
});
const transportManager = new TransportManager({
	/* config */
});

// Fetch initial data
const actorTimeline = await adapter.fetchActorTimeline('actor-id-123', {
	first: 20,
});

// Convert to timeline items
const items = unifiedStatusesToTimelineItems(
	actorTimeline.edges
		.map((edge) => {
			const result = mapLesserPost(edge.node);
			return result.success ? result.data : null;
		})
		.filter(Boolean)
);

// Create store
const timelineStore = createTimelineStore({
	transportManager,
	initialItems: items.map((item, index) => ({
		...item,
		id: actorTimeline.edges[index].node.id,
		timestamp: Date.parse(actorTimeline.edges[index].node.createdAt),
	})),
});

// Use in Svelte component
const state = $derived(timelineStore.get());
```

## GraphQL Query

The actor timeline uses the standard `timeline` query with `type: ACTOR` and an `actorId` parameter:

```graphql
query Timeline(
	$type: TimelineType!
	$actorId: ID
	$first: Int = 20
	$after: Cursor
	$mediaOnly: Boolean = false
) {
	timeline(type: $type, actorId: $actorId, first: $first, after: $after, mediaOnly: $mediaOnly) {
		edges {
			cursor
			node {
				id
				content
				actor {
					id
					username
					displayName
				}
				# ... other fields
			}
		}
		pageInfo {
			hasNextPage
			hasPreviousPage
			startCursor
			endCursor
		}
		totalCount
	}
}
```

## Parameters

| Parameter   | Type      | Required | Description                                              |
| ----------- | --------- | -------- | -------------------------------------------------------- |
| `actorId`   | `string`  | Yes      | The ID of the actor whose timeline to fetch              |
| `first`     | `number`  | No       | Number of items to fetch (default: 20)                   |
| `after`     | `string`  | No       | Cursor for pagination                                    |
| `mediaOnly` | `boolean` | No       | Only fetch posts with media attachments (default: false) |

## Response

Returns an `ObjectConnection` with:

- `edges[]` - Array of timeline items
  - `node` - The post object
  - `cursor` - Pagination cursor
- `pageInfo` - Pagination information
  - `hasNextPage` - Whether there are more items
  - `hasPreviousPage` - Whether there are previous items
  - `startCursor` - Cursor for the first item
  - `endCursor` - Cursor for the last item
- `totalCount` - Total number of items

## Example: Profile Page

```typescript
<script lang="ts">
import { onMount } from 'svelte';
import type { ObjectFieldsFragment } from '@equaltoai/greater-components-adapters';

let actorId = $props<{ actorId: string }>();
let posts = $state<ObjectFieldsFragment[]>([]);
let loading = $state(true);
let hasMore = $state(true);
let cursor = $state<string | undefined>();

async function loadPosts() {
  loading = true;
  const timeline = await adapter.fetchActorTimeline(actorId, {
    first: 20,
    after: cursor
  });

  posts = [...posts, ...timeline.edges.map(edge => edge.node)];
  hasMore = timeline.pageInfo.hasNextPage;
  cursor = timeline.pageInfo.endCursor;
  loading = false;
}

onMount(() => {
  loadPosts();
});
</script>

<div>
  {#each posts as post}
    <StatusCard {post} />
  {/each}

  {#if hasMore}
    <button onclick={loadPosts} disabled={loading}>
      {loading ? 'Loading...' : 'Load More'}
    </button>
  {/if}
</div>
```

## Notes

- Actor timelines are chronologically ordered (newest first)
- The `mediaOnly` filter is useful for creating media galleries
- Actor timelines respect visibility permissions (you won't see private posts unless you have permission)
- Posts include all standard Lesser fields: trust scores, community notes, quote context, etc.

## Related

- [Timeline Types](./TimelineTypes.md)
- [Pagination](../General/Pagination.md)
- [Timeline Store](../Stores/TimelineStore.md)
