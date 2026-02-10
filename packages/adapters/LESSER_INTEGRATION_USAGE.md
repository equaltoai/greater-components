# Lesser Integration Usage Guide

## Overview

The `@equaltoai/greater-components-adapters` package now fully supports Lesser's enhanced schema with trust scores, cost metrics, community notes, and quote posts. This guide shows how to use the Lesser-integrated features.

## Data Flow

```
Lesser GraphQL API
  ↓ (fragments include trust, cost, quotes, community notes)
mapLesserAccount() / mapLesserPost()
  ↓ (populates UnifiedAccount / UnifiedStatus with Lesser fields)
unifiedStatusToTimelineItem() / unifiedNotificationToStoreNotification()
  ↓ (extracts Lesser metadata into typed store structures)
Timeline/Notification Stores (with Lesser selectors)
  ↓
UI Components (Status.LesserMetadata, Profile.TrustBadge, etc.)
```

## Using UnifiedStatus with Lesser Fields

```typescript
import { mapLesserPost, type UnifiedStatus } from '@equaltoai/greater-components-adapters';

// GraphQL response includes Lesser fields
const lesserPostFragment = {
	id: '123',
	content: 'Post content',
	author: {
		/* ... */
	},
	// Lesser-specific fields
	estimatedCost: 1500000, // microcents
	moderationScore: 0.2,
	trustScore: 85,
	communityNotes: [
		{
			id: 'note1',
			author: {
				/* ... */
			},
			content: 'Additional context',
			helpful: 25,
			notHelpful: 3,
			createdAt: '2024-01-01T12:00:00Z',
		},
	],
	quoteCount: 5,
	quoteable: true,
	quotePermissions: 'EVERYONE',
};

// Map to UnifiedStatus
const result = mapLesserPost(lesserPostFragment);
if (result.success) {
	const status: UnifiedStatus = result.data;

	// Access Lesser fields directly
	console.log(status.estimatedCost); // 1500000
	console.log(status.account.trustScore); // 85
	console.log(status.communityNotes?.length); // 1
	console.log(status.quoteCount); // 5
}
```

## Using Timeline Store with Lesser Metadata

```typescript
import {
  createTimelineStore,
  unifiedStatusToTimelineItem,
  mapLesserPost,
  type UnifiedStatus
} from '@equaltoai/greater-components-adapters';

// Create timeline store
const timelineStore = createTimelineStore({
  transportManager,
  itemHeight: 150,
  containerHeight: 800,
});

// Convert UnifiedStatus to TimelineItem (with Lesser metadata auto-populated)
const lesserPosts: UnifiedStatus[] = /* ... from GraphQL */;
lesserPosts.forEach(status => {
  const timelineItem = unifiedStatusToTimelineItem(status);
  timelineStore.addItem(timelineItem);
});

// Use Lesser-specific selectors
const expensivePosts = timelineStore.getItemsWithCost(5000000); // > $5
const trustedAuthors = timelineStore.getItemsWithTrustScore(80); // trust >= 80
const notedPosts = timelineStore.getItemsWithCommunityNotes();
const quotePosts = timelineStore.getQuotePosts();
const flaggedPosts = timelineStore.getModeratedItems('FLAG');
```

## Using Notification Store with Lesser Types

```typescript
import {
  createNotificationStore,
  unifiedNotificationToStoreNotification,
  mapLesserNotification,
  type UnifiedNotification
} from '@equaltoai/greater-components-adapters';

const notificationStore = createNotificationStore({
  transportManager,
  maxNotifications: 100,
});

// Convert UnifiedNotification to store notification (with Lesser payloads)
const lesserNotifications: UnifiedNotification[] = /* ... from GraphQL */;
lesserNotifications.forEach(notification => {
  const storeNotification = unifiedNotificationToStoreNotification(notification);
  notificationStore.addNotification(storeNotification);
});

// Use Lesser-specific selectors
const quoteNotifs = notificationStore.getQuoteNotifications();
const noteNotifs = notificationStore.getCommunityNoteNotifications();
const trustNotifs = notificationStore.getTrustUpdateNotifications();
const costNotifs = notificationStore.getCostAlertNotifications();
const moderationNotifs = notificationStore.getModerationActionNotifications();
const allLesserUnread = notificationStore.getUnreadLesserNotifications();
```

## UI Component Integration

### Status with Lesser Metadata

```svelte
<script>
	import { Status } from '@equaltoai/greater-components-social';
	import { mapLesserPost } from '@equaltoai/greater-components-adapters';

	let { lesserPost } = $props(); // From GraphQL

	const unifiedStatus = mapLesserPost(lesserPost).data;
	// Convert to GenericStatus or use directly (components accept Status from types.ts)
</script>

<Status.Root status={unifiedStatus}>
	<Status.Header />
	<Status.Content />

	<!-- Lesser-specific components -->
	<Status.LesserMetadata showCost={true} showTrust={true} showModeration={true} showQuotes={true} />
	<Status.CommunityNotes maxInitialNotes={3} />

	<Status.Actions />
</Status.Root>
```

### Profile with Trust Badge

```svelte
<script>
	import * as Profile from '@equaltoai/greater-components-social/components/Profile';
	import { mapLesserAccount } from '@equaltoai/greater-components-adapters';

	let { lesserAccount } = $props();

	const unifiedAccount = mapLesserAccount(lesserAccount).data;
</script>

<Profile.Root profile={unifiedAccount}>
	<Profile.Header />
	<Profile.Stats />

	<!-- Lesser-specific trust display -->
	<Profile.TrustBadge showDetails={true} showVouches={true} />
</Profile.Root>
```

### Notifications with Lesser Types

```svelte
<script>
	import { Notifications } from '@equaltoai/greater-components-social';
	import { unifiedNotificationToStoreNotification } from '@equaltoai/greater-components-adapters';

	let { lesserNotifications } = $props();

	const storeNotifications = lesserNotifications.map(unifiedNotificationToStoreNotification);
</script>

<Notifications.Root notifications={storeNotifications}>
	{#each storeNotifications as notification}
		{#if ['quote', 'community_note', 'trust_update', 'cost_alert', 'moderation_action'].includes(notification.type)}
			<Notifications.LesserNotificationItem {notification} />
		{:else}
			<Notifications.Item {notification} />
		{/if}
	{/each}
</Notifications.Root>
```

## Type Safety

All Lesser integrations are fully typed:

```typescript
import type {
	UnifiedStatus,
	UnifiedAccount,
	UnifiedNotification,
	LesserTimelineMetadata,
	LesserNotificationMetadata,
	TimelineStore,
	NotificationStore,
} from '@equaltoai/greater-components-adapters';

// UnifiedStatus includes all Lesser fields
const status: UnifiedStatus = {
	/* ... */
};
status.estimatedCost; // number | undefined
status.communityNotes; // Array<{ ... }> | undefined
status.account.trustScore; // number | undefined

// Store selectors are fully typed
const timeline: TimelineStore = createTimelineStore(config);
const items: TimelineItem[] = timeline.getItemsWithCost(1000000);
const trusted: TimelineItem[] = timeline.getItemsWithTrustScore(75);
```

## GraphQL Fragments

Common Lesser UI fields are included in the shared fragments (and used by the generated operations):

- **ActorSummary**: includes `trustScore`, `tipAddress`, `tipChainId`
- **ObjectFields**: includes `boosted`, `relationshipType`, `contentHash`, `estimatedCost`, `moderationScore`, `communityNotes`, quote fields
- **CommunityNoteFields**: full community note structure
- **QuoteContextFields**: quote metadata
- **Notifications query**: includes `quoteStatus`, `communityNote`, `trustUpdate`, `costAlert`, `moderationAction`
- **Instance query**: includes `instance.tips` config fields

No additional GraphQL configuration required - fragments are ready!

## Migration from Extension-Based Access

**Old (manual extension parsing)**:

```typescript
const cost = status.activityPubObject.extensions?.estimatedCost;
const trust = account.extensions?.trustScore;
```

**New (unified model fields)**:

```typescript
const cost = status.estimatedCost;
const trust = status.account.trustScore;
```

## Testing

Test utilities for Lesser features:

```typescript
import { describe, it, expect } from 'vitest';
import { unifiedStatusToTimelineItem } from '@equaltoai/greater-components-adapters';

it('should populate Lesser metadata from UnifiedStatus', () => {
	const status: UnifiedStatus = {
		id: '123',
		estimatedCost: 1000000,
		account: {
			trustScore: 85,
			/* ... */
		},
		communityNotes: [
			/* ... */
		],
		/* ... */
	};

	const item = unifiedStatusToTimelineItem(status);

	expect(item.metadata?.lesser?.estimatedCost).toBe(1000000);
	expect(item.metadata?.lesser?.authorTrustScore).toBe(85);
	expect(item.metadata?.lesser?.hasCommunityNotes).toBe(true);
});
```

## See Also

- [Greater Alignment Log](../../docs/planning/greater-alignment-log.md) - Phase 2 implementation details
- [Lesser Schema](../../schemas/lesser/schema.graphql) - Authoritative GraphQL schema
- [Component Documentation](../../packages/faces/social/src/components/) - UI component guides
