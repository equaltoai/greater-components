# Hashtags

Follow hashtags with granular notification preferences and mute controls for hashtag-based content filtering.

## Overview

The `Hashtags` module provides comprehensive hashtag management for Lesser instances. Users can follow hashtags to see related content in dedicated timelines, configure notification levels to control how they're alerted to new posts, and mute hashtags to filter unwanted content.

## Components

### Hashtags.Root

Context provider for hashtag management state and adapter connection.

**Props:**
- `adapter: LesserGraphQLAdapter` - GraphQL adapter instance
- `children?: Snippet` - Child components

**Usage:**

```svelte
<script lang="ts">
  import * as Hashtags from '@greater/fediverse/Hashtags';
  import { adapter } from './config';
</script>

<Hashtags.Root {adapter}>
  <Hashtags.Controls hashtag="svelte" />
  <Hashtags.FollowedList />
  <Hashtags.MutedList />
</Hashtags.Root>
```

---

### Hashtags.Controls

Follow/mute toggle controls for a specific hashtag.

**Props:**
- `hashtag: string` - Hashtag name (without #)
- `onFollow?: (hashtag: string) => Promise<void>` - Follow callback
- `onUnfollow?: (hashtag: string) => Promise<void>` - Unfollow callback
- `onMute?: (hashtag: string) => Promise<void>` - Mute callback
- `onUnmute?: (hashtag: string) => Promise<void>` - Unmute callback
- `initialState?: { following: boolean; muted: boolean }` - Initial state

**Usage:**

```svelte
<script lang="ts">
  async function followHashtag(tag: string) {
    await adapter.followHashtag(tag, 'ALL');
  }
  
  async function unfollowHashtag(tag: string) {
    await adapter.unfollowHashtag(tag);
  }
  
  async function muteHashtag(tag: string) {
    // Mute for 24 hours
    const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await adapter.muteHashtag(tag, until);
  }
</script>

<Hashtags.Root {adapter}>
  <Hashtags.Controls 
    hashtag="webdev"
    onFollow={followHashtag}
    onUnfollow={unfollowHashtag}
    onMute={muteHashtag}
    initialState={{ following: false, muted: false }}
  />
</Hashtags.Root>
```

**Features:**

- Toggle buttons for follow/unfollow
- Mute button with duration selector
- Loading states during operations
- Disabled states to prevent double-actions

---

### Hashtags.FollowedList

List of followed hashtags with notification settings and unfollow actions.

**Props:**
- `onUnfollow?: (hashtag: string) => Promise<void>` - Unfollow callback
- `onUpdateNotifications?: (hashtag: string, settings: NotificationSettings) => Promise<void>` - Settings update callback
- `sortBy?: 'hashtag' | 'followedAt' | 'postCount'` - Sort order (default: `'followedAt'`)
- `sortDirection?: 'asc' | 'desc'` - Sort direction (default: `'desc'`)

**Usage:**

```svelte
<script lang="ts">
  async function updateNotifications(tag: string, settings) {
    await adapter.updateHashtagNotifications(tag, {
      notifyLevel: settings.level,
      muted: settings.muted
    });
  }
</script>

<Hashtags.Root {adapter}>
  <Hashtags.FollowedList 
    onUnfollow={unfollowHashtag}
    onUpdateNotifications={updateNotifications}
    sortBy="followedAt"
    sortDirection="desc"
  />
</Hashtags.Root>
```

**Table Columns:**

- **Hashtag**: Tag name with # prefix
- **Notification Level**: Dropdown selector (ALL/MUTUALS/FOLLOWING/NONE)
- **Post Count**: Recent activity indicator
- **Followed At**: When hashtag was followed
- **Actions**: Unfollow button

---

### Hashtags.MutedList

List of muted hashtags with unmute actions.

**Props:**
- `onUnmute?: (hashtag: string) => Promise<void>` - Unmute callback
- `showExpired?: boolean` - Show expired mutes (default: `false`)

**Usage:**

```svelte
<script lang="ts">
  async function unmuteHashtag(tag: string) {
    await adapter.unmuteHashtag(tag, { preserveFollow: true });
  }
</script>

<Hashtags.Root {adapter}>
  <Hashtags.MutedList 
    onUnmute={unmuteHashtag}
    showExpired={false}
  />
</Hashtags.Root>
```

**Table Columns:**

- **Hashtag**: Tag name with # prefix
- **Muted At**: When mute was applied
- **Mute Until**: Expiration time (if temporary)
- **Status**: Active/Expired
- **Actions**: Unmute button

---

## GraphQL Operations

### Queries

```graphql
query FollowedHashtags($first: Int, $after: String) {
  followedHashtags(first: $first, after: $after) {
    edges {
      node {
        hashtag
        notifyLevel
        muted
        muteUntil
        followedAt
        postCount
        lastActivity
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Mutations

```graphql
mutation FollowHashtag($hashtag: String!, $notifyLevel: NotificationLevel) {
  followHashtag(hashtag: $hashtag, notifyLevel: $notifyLevel) {
    hashtag
    notifyLevel
    followedAt
  }
}

mutation UnfollowHashtag($hashtag: String!) {
  unfollowHashtag(hashtag: $hashtag) {
    success
  }
}

mutation MuteHashtag($hashtag: String!, $until: Time) {
  muteHashtag(hashtag: $hashtag, until: $until) {
    hashtag
    muted
    muteUntil
  }
}

mutation UnmuteHashtag($hashtag: String!) {
  unmuteHashtag(hashtag: $hashtag) {
    hashtag
    muted
  }
}

mutation UpdateHashtagNotifications($hashtag: String!, $settings: HashtagNotificationSettingsInput!) {
  updateHashtagNotifications(hashtag: $hashtag, settings: $settings) {
    hashtag
    notifyLevel
    muted
  }
}
```

---

## Adapter Methods

```typescript
// Follow hashtag
await adapter.followHashtag('svelte', 'ALL');

// Unfollow hashtag
await adapter.unfollowHashtag('svelte');

// Mute hashtag temporarily
const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
await adapter.muteHashtag('politics', until);

// Mute hashtag permanently
await adapter.muteHashtag('spam');

// Unmute hashtag
await adapter.unmuteHashtag('politics', { preserveFollow: true });

// Update notification settings
await adapter.updateHashtagNotifications('webdev', {
  notifyLevel: 'MUTUALS',
  muted: false
});

// Get followed hashtags
const result = await adapter.getFollowedHashtags(50, null);
const followed = result.data.followedHashtags.edges.map(e => e.node);
```

---

## Types

```typescript
interface FollowedHashtag {
  hashtag: string;
  notifyLevel: NotificationLevel;
  muted: boolean;
  muteUntil?: string;
  followedAt: string;
  postCount?: number;
  lastActivity?: string;
}

type NotificationLevel = 
  | 'ALL'         // All posts
  | 'MUTUALS'     // Only mutuals
  | 'FOLLOWING'   // Only following
  | 'NONE';       // No notifications (effectively muted)

interface HashtagNotificationSettings {
  notifyLevel: NotificationLevel;
  muted: boolean;
  muteUntil?: string;
}
```

---

## Notification Levels

### ALL (Default)
Notify for all posts with this hashtag.

**Use Case**: Topics you want to stay fully updated on.

**Example**: `#svelte` for a Svelte developer

### MUTUALS
Only notify for posts from mutual follows.

**Use Case**: Popular hashtags where you only care about friends' posts.

**Example**: `#photography` - only see photos from people you mutually follow

### FOLLOWING
Only notify for posts from accounts you follow.

**Use Case**: Hashtags used by community members you follow.

**Example**: `#announcements` - only from followed accounts

### NONE
Follow without notifications (effectively muted).

**Use Case**: Hashtags you want in dedicated timeline but not in notifications.

**Example**: `#news` - check when you want, don't interrupt flow

---

## Timeline Integration

Create timelines filtered by followed hashtags:

```svelte
<script lang="ts">
  import { createLesserTimelineStore, TimelineVirtualized } from '@greater/fediverse';
  import { adapter } from './config';
  
  // Single hashtag timeline
  const timeline = createLesserTimelineStore({
    adapter,
    type: 'HASHTAG',
    hashtag: 'svelte'
  });
  
  // Multiple hashtags (ANY mode - union)
  const multiTimeline = createLesserTimelineStore({
    adapter,
    type: 'HASHTAG',
    hashtags: ['svelte', 'webdev', 'javascript'],
    hashtagMode: 'ANY'  // Posts with any of these hashtags
  });
  
  // Multiple hashtags (ALL mode - intersection)
  const intersectionTimeline = createLesserTimelineStore({
    adapter,
    type: 'HASHTAG',
    hashtags: ['svelte', 'tutorial'],
    hashtagMode: 'ALL'  // Posts with all these hashtags
  });
</script>

<h2>#{$timeline.hashtag} Timeline</h2>
<TimelineVirtualized
  items={$timeline.items}
  onLoadMore={timeline.loadMore}
/>
```

---

## Real-time Updates

Subscribe to hashtag activity:

```typescript
adapter.subscribeToHashtagActivity({
  hashtags: ['svelte', 'fediverse']
}).subscribe(activity => {
  console.log('New post in hashtag:', activity.hashtag);
  console.log('Author:', activity.author);
  console.log('Content:', activity.object);
  
  // Update timeline
  if (isHashtagTimelineVisible(activity.hashtag)) {
    prependToTimeline(activity.object);
  }
  
  // Show notification if configured
  if (shouldNotify(activity.hashtag, activity.author)) {
    showNotification(`New post in #${activity.hashtag}`);
  }
});
```

---

## Mute Durations

Common mute duration patterns:

```typescript
const MUTE_DURATIONS = {
  oneHour: () => new Date(Date.now() + 60 * 60 * 1000),
  oneDay: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  oneWeek: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  oneMonth: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  permanent: () => null  // No expiration
};

// Mute for one week
await adapter.muteHashtag('politics', MUTE_DURATIONS.oneWeek().toISOString());

// Mute permanently
await adapter.muteHashtag('spam', MUTE_DURATIONS.permanent());
```

---

## Best Practices

1. **Start Broad**: Follow hashtags with `ALL` notifications initially, adjust as needed

2. **Use MUTUALS for Popular Tags**: Avoid notification overload from busy hashtags

3. **Temporary Mutes**: Use temporary mutes for event-based hashtags (e.g., sports events)

4. **Review Periodically**: Check followed hashtags monthly, unfollow inactive ones

5. **Combine with Filters**: Use hashtag muting in combination with content filters for best control

6. **Dedicated Timelines**: Create separate timelines for different hashtag groups (work, hobbies, news)

7. **Notification Hygiene**: Set most hashtags to `NONE` or `FOLLOWING` to reduce noise

---

## Migration from Account-level Hashtag Mutes

If upgrading from Mastodon/Pleroma:

```typescript
// Migrate muted hashtags to Lesser system
async function migrateMutedHashtags(legacyMutes: string[]) {
  for (const hashtag of legacyMutes) {
    await adapter.muteHashtag(hashtag); // Permanent mute
  }
}

// Migrate followed hashtags (if previously manual)
async function migrateFollowedHashtags(hashtags: string[]) {
  for (const hashtag of hashtags) {
    await adapter.followHashtag(hashtag, 'MUTUALS'); // Conservative default
  }
}
```

---

## Accessibility

- All hashtag names have proper `aria-label` attributes
- Color coding supplemented with text labels
- Keyboard navigation for all controls
- Loading states announced to screen readers
- Focus management for modals and dropdowns

---

## Performance Considerations

- Followed hashtags list paginated (50 per page)
- Muted hashtags cached client-side
- Real-time updates batched to prevent UI thrashing
- Timeline queries use cursor-based pagination

---

## Related Components

- [Timeline](../Timeline/README.md) - Hashtag timeline display
- [Filters](../Filters/README.md) - Content filtering by hashtag
- [Search](../Search/README.md) - Hashtag search and discovery

---

## See Also

- [Lesser Integration Guide](../../lesser-integration-guide.md#hashtag-management)
- [Timeline Configuration](../../timeline-configuration.md)
- [Notification Preferences](../../notification-preferences.md)

