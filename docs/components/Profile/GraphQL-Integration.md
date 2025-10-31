# Profile GraphQL Integration Guide

This guide explains how to use GraphQL queries and mutations for profile management, including followers/following lists, profile updates, preferences, and push notifications.

## Overview

The Lesser GraphQL adapter provides type-safe methods for:
- Fetching paginated followers and following lists
- Updating user profiles
- Managing user preferences and privacy settings
- Configuring push notifications
- Managing relationships (follow, block, mute)

The Profile package includes specialized controllers that provide reactive state management and automatic synchronization:
- **ProfileGraphQLController** - Main profile controller with followers/following management
- **PreferencesGraphQLController** - User preferences and privacy settings
- **PushNotificationsController** - Push notification subscriptions with browser integration

All methods return strongly-typed data that can be easily converted to your application's models.

## Installation

```typescript
import { 
  createLesserGraphQLAdapter,
  convertGraphQLActorListPage,
  convertGraphQLUserPreferences,
  convertGraphQLPushSubscription 
} from '@equaltoai/greater-components-adapters';
```

> **Live API Available!** Lesser's GraphQL API is now live at `https://dev.lesser.host/api/graphql`  
> You can test all queries and mutations against real data.

## Followers & Following

### Fetching Followers

```typescript
const adapter = createLesserGraphQLAdapter({
  httpEndpoint: 'https://api.lesser.social/graphql',
  wsEndpoint: 'wss://api.lesser.social/graphql',
  token: 'your-auth-token'
});

// Fetch first page of followers
const followersData = await adapter.getFollowers('username', 40);

console.log(followersData.actors); // Array of Actor objects
console.log(followersData.nextCursor); // Cursor for next page
console.log(followersData.totalCount); // Total follower count

// Fetch next page
if (followersData.nextCursor) {
  const nextPage = await adapter.getFollowers(
    'username', 
    40, 
    followersData.nextCursor
  );
}
```

### Fetching Following

```typescript
const followingData = await adapter.getFollowing('username', 40);

console.log(followingData.actors); // Array of Actor objects
console.log(followingData.nextCursor); // Cursor for next page
console.log(followingData.totalCount); // Total following count
```

### Response Structure

```typescript
interface ActorListPage {
  actors: Actor[];      // Array of account objects
  nextCursor?: string;  // Cursor for pagination
  totalCount: number;   // Total count of followers/following
}

interface Actor {
  id: string;
  username: string;
  domain?: string;
  displayName?: string;
  summary?: string;
  avatar?: string;
  header?: string;
  followers: number;
  following: number;
  statusesCount: number;
  bot: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  trustScore: number;
  fields: Field[];
}
```

### Using with Profile Components

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  let adapter = createLesserGraphQLAdapter({ /* config */ });
  let followers = $state<any[]>([]);
  let nextCursor = $state<string | undefined>();
  let totalCount = $state(0);
  
  async function loadFollowers() {
    const data = await adapter.getFollowers('alice', 40, nextCursor);
    
    // Convert to Profile component format
    const newFollowers = data.actors.map(actor => ({
      id: actor.id,
      username: actor.username,
      displayName: actor.displayName || actor.username,
      bio: actor.summary,
      avatar: actor.avatar,
      followersCount: actor.followers,
      followingCount: actor.following,
      statusesCount: actor.statusesCount,
    }));
    
    followers = [...followers, ...newFollowers];
    nextCursor = data.nextCursor;
    totalCount = data.totalCount;
  }
  
  const handlers = {
    onLoadMoreFollowers: loadFollowers
  };
</script>

<Profile.Root profile={...} {handlers}>
  <Profile.FollowersList 
    {followers} 
    hasMore={!!nextCursor}
    totalCount={totalCount}
  />
</Profile.Root>
```

## Profile Updates

### Updating Profile

```typescript
const updatedActor = await adapter.updateProfile({
  displayName: 'New Display Name',
  bio: 'Updated bio text',
  avatar: 'https://cdn.example.com/new-avatar.jpg',
  header: 'https://cdn.example.com/new-header.jpg',
  locked: false,
  bot: false,
  discoverable: true,
  noIndex: false,
  sensitive: false,
  language: 'en',
  fields: [
    { name: 'Website', value: 'https://example.com' },
    { name: 'Location', value: 'San Francisco' }
  ]
});

console.log(updatedActor.displayName); // 'New Display Name'
```

### With Optimistic Updates

```svelte
<script lang="ts">
  let saving = $state(false);
  let error = $state<string | null>(null);
  
  async function saveProfile(formData: ProfileEditData) {
    saving = true;
    error = null;
    
    try {
      const updated = await adapter.updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        fields: formData.fields
      });
      
      // Update local state
      profile = updated;
      
      // Invalidate cache to refetch with updated data
      adapter.invalidate('actor');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update profile';
    } finally {
      saving = false;
    }
  }
</script>
```

## User Preferences

### Fetching Preferences

```typescript
const preferences = await adapter.getUserPreferences();

// Access structured preference data
console.log(preferences.posting.defaultVisibility);    // 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT'
console.log(preferences.reading.expandMedia);          // 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL'
console.log(preferences.streaming.defaultQuality);     // 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA'
console.log(preferences.notifications.push);           // boolean
console.log(preferences.privacy.indexable);            // boolean
```

### Updating Preferences

```typescript
const updated = await adapter.updateUserPreferences({
  defaultPostingVisibility: 'FOLLOWERS',
  expandMedia: 'SHOW_ALL',
  autoplayGifs: true,
  showFollowCounts: true,
  preferredTimelineOrder: 'NEWEST',
  streaming: {
    defaultQuality: 'HIGH',
    autoQuality: false,
    preloadNext: true,
    dataSaver: false
  }
});
```

### Streaming-Only Updates

```typescript
// Update just streaming preferences
const updated = await adapter.updateStreamingPreferences({
  defaultQuality: 'MEDIUM',
  autoQuality: true,
  dataSaver: true
});
```

### Preference Structure

```typescript
interface UserPreferences {
  actorId: string;
  
  posting: {
    defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
    defaultSensitive: boolean;
    defaultLanguage: string;
  };
  
  reading: {
    expandSpoilers: boolean;
    expandMedia: 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL';
    autoplayGifs: boolean;
    timelineOrder: 'NEWEST' | 'OLDEST';
  };
  
  discovery: {
    showFollowCounts: boolean;
    searchSuggestionsEnabled: boolean;
    personalizedSearchEnabled: boolean;
  };
  
  streaming: {
    defaultQuality: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
    autoQuality: boolean;
    preloadNext: boolean;
    dataSaver: boolean;
  };
  
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
  
  privacy: {
    defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
    indexable: boolean;
    showOnlineStatus: boolean;
  };
  
  reblogFilters: Array<{ key: string; enabled: boolean }>;
}
```

## Push Notifications

### Checking Subscription Status

```typescript
const subscription = await adapter.getPushSubscription();

if (subscription) {
  console.log('Registered:', subscription.endpoint);
  console.log('Alerts:', subscription.alerts);
} else {
  console.log('Not registered for push notifications');
}
```

### Registering Push Notifications

```typescript
// 1. Request browser permission
const permission = await Notification.requestPermission();
if (permission !== 'granted') {
  throw new Error('Permission denied');
}

// 2. Get service worker registration
const registration = await navigator.serviceWorker.ready;

// 3. Subscribe to push
const browserSubscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
});

// 4. Register with server
const subscriptionJson = browserSubscription.toJSON();
const registered = await adapter.registerPushSubscription({
  endpoint: subscriptionJson.endpoint!,
  keys: {
    auth: subscriptionJson.keys!.auth,
    p256dh: subscriptionJson.keys!.p256dh
  },
  alerts: {
    follow: true,
    favourite: true,
    reblog: true,
    mention: true,
    poll: true,
    followRequest: true,
    status: false,
    update: false,
    adminSignUp: false,
    adminReport: false
  }
});
```

### Updating Alert Preferences

```typescript
// Toggle specific alert types
await adapter.updatePushSubscription({
  alerts: {
    follow: true,
    favourite: false,  // Disable favourite notifications
    reblog: true,
    mention: true,
    poll: false,       // Disable poll notifications
    followRequest: true,
    status: true,
    update: true,
    adminSignUp: false,
    adminReport: false
  }
});
```

### Unregistering

```typescript
// Remove subscription from server
await adapter.deletePushSubscription();

// Unsubscribe from browser
if (browserSubscription) {
  await browserSubscription.unsubscribe();
}
```

## Cache Management

The Apollo Client cache is configured to handle these queries efficiently:

### Followers/Following Pagination

Followers and following queries use username-based cache keys and automatically merge paginated results:

```typescript
// First page - cached with key: followers:{"username":"alice"}
const page1 = await adapter.getFollowers('alice', 40);

// Next page - merged with existing data
const page2 = await adapter.getFollowers('alice', 40, page1.nextCursor);

// Cache now contains: page1.actors + page2.actors
```

### Preferences Caching

User preferences are cached by actorId and always replaced with latest data:

```typescript
// Cached with key: UserPreferences:{"actorId":"user123"}
const prefs = await adapter.getUserPreferences();

// Mutations automatically update cache
await adapter.updateUserPreferences({ ... });

// Next query uses updated cache
const updated = await adapter.getUserPreferences();
```

### Push Subscription Caching

Push subscriptions are cached by id and replaced on updates:

```typescript
const sub = await adapter.getPushSubscription();

await adapter.updatePushSubscription({ ... });

// Cache automatically updated
const updated = await adapter.getPushSubscription();
```

### Manual Cache Invalidation

```typescript
// Invalidate specific cache entries
adapter.client.cache.evict({ id: 'Actor:123' });

// Invalidate all queries matching pattern
adapter.client.cache.evict({ 
  fieldName: 'followers',
  args: { username: 'alice' }
});

// Clear entire cache
adapter.client.cache.reset();
```

## Error Handling

All methods throw errors that should be caught and handled:

```typescript
try {
  const followers = await adapter.getFollowers('alice', 40);
} catch (error) {
  if (error.message.includes('UNAUTHENTICATED')) {
    // Handle auth error - redirect to login
  } else if (error.message.includes('NOT_FOUND')) {
    // Handle user not found
  } else {
    // Generic error handling
    console.error('Failed to load followers:', error);
  }
}
```

### GraphQL Error Structure

```typescript
interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}
```

## Account Switching

When users switch accounts, invalidate cached data:

```typescript
function switchAccount(newToken: string) {
  // Update token
  adapter.updateToken(newToken);
  
  // Clear user-specific cache
  adapter.client.cache.evict({ fieldName: 'userPreferences' });
  adapter.client.cache.evict({ fieldName: 'pushSubscription' });
  adapter.client.cache.evict({ fieldName: 'followers' });
  adapter.client.cache.evict({ fieldName: 'following' });
  
  // Refetch data for new user
  loadUserData();
}
```

## Best Practices

### 1. Use Pagination

Always use the cursor-based pagination for followers/following:

```typescript
let allFollowers = [];
let cursor = undefined;

do {
  const page = await adapter.getFollowers('alice', 40, cursor);
  allFollowers = [...allFollowers, ...page.actors];
  cursor = page.nextCursor;
} while (cursor);
```

### 2. Handle Loading States

Show loading indicators while fetching data:

```svelte
<script lang="ts">
  let loading = $state(false);
  let followers = $state([]);
  
  async function load() {
    loading = true;
    try {
      const data = await adapter.getFollowers('alice', 40);
      followers = data.actors;
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else}
  <!-- Display followers -->
{/if}
```

### 3. Optimistic Updates

For profile updates, show changes immediately:

```svelte
<script lang="ts">
  let profile = $state({ ...currentProfile });
  
  async function updateBio(newBio: string) {
    // Optimistic update
    const oldBio = profile.bio;
    profile.bio = newBio;
    
    try {
      await adapter.updateProfile({ bio: newBio });
    } catch (error) {
      // Rollback on error
      profile.bio = oldBio;
      throw error;
    }
  }
</script>
```

### 4. Validate Before Saving

Validate form data before calling mutations:

```typescript
function validateProfile(data: ProfileEditData): string[] {
  const errors = [];
  
  if (data.displayName && data.displayName.length > 30) {
    errors.push('Display name must be 30 characters or less');
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be 500 characters or less');
  }
  
  if (data.fields && data.fields.length > 4) {
    errors.push('Maximum 4 custom fields allowed');
  }
  
  return errors;
}
```

### 5. Handle Server Validation Errors

Extract and display server-side validation errors:

```typescript
try {
  await adapter.updateProfile(input);
} catch (error) {
  // GraphQL returns validation errors in extensions
  const graphqlError = error.graphQLErrors?.[0];
  const validationErrors = graphqlError?.extensions?.validation;
  
  if (validationErrors) {
    // Display field-specific errors
    Object.entries(validationErrors).forEach(([field, message]) => {
      showFieldError(field, message);
    });
  }
}
```

## Examples

See the example implementations in the playground:
- `apps/playground/stories/examples/ProfilePageExample.svelte` - Followers/Following pagination
- `apps/playground/stories/examples/PreferencesExample.svelte` - User preferences management
- `apps/playground/stories/examples/PushNotificationsExample.svelte` - Push notification setup

## API Reference

### LesserGraphQLAdapter Methods

#### Profile & Relationships

```typescript
getFollowers(username: string, limit?: number, cursor?: string): Promise<ActorListPage>
getFollowing(username: string, limit?: number, cursor?: string): Promise<ActorListPage>
updateProfile(input: UpdateProfileInput): Promise<Actor>
```

#### Preferences

```typescript
getUserPreferences(): Promise<UserPreferences>
updateUserPreferences(input: UpdateUserPreferencesInput): Promise<UserPreferences>
updateStreamingPreferences(input: StreamingPreferencesInput): Promise<UserPreferences>
```

#### Push Notifications

```typescript
getPushSubscription(): Promise<PushSubscription | null>
registerPushSubscription(input: RegisterPushSubscriptionInput): Promise<PushSubscription>
updatePushSubscription(input: UpdatePushSubscriptionInput): Promise<PushSubscription>
deletePushSubscription(): Promise<boolean>
```

## Migration from REST

If you're migrating from REST endpoints:

### Before (REST)

```typescript
const followers = await fetch(`/api/v1/accounts/${id}/followers?limit=40`);
```

### After (GraphQL)

```typescript
const followersData = await adapter.getFollowers(username, 40);
```

### Key Differences

- GraphQL uses **username** instead of account **id**
- Returns **ActorListPage** with `nextCursor` instead of `Link` headers
- Includes **totalCount** in response
- Returns **Actor** objects with Lesser-specific fields (trustScore, reputation)

## Troubleshooting

### "No data in GraphQL response"

Ensure the server is returning the expected fields. Check your GraphQL documents match the schema.

### "Cannot query field X on type Y"

Run `pnpm graphql-codegen` to regenerate types after schema changes.

### Push notifications not working

1. Verify browser support: `'PushManager' in window`
2. Check VAPID key is valid
3. Ensure service worker is registered
4. Verify notification permission is granted

## See Also

- [Profile Components Documentation](./Root.md)
- [GraphQL Adapter Documentation](../../adapters/graphql/README.md)
- [Cache Configuration](../../adapters/graphql/cache.md)

