# GraphQL Integration Implementation Status

## Completed Tasks ✅

### 1. Schema Sync & Generation
- ✅ Copied updated Lesser GraphQL schema from `/home/aron/ai-workspace/codebases/lesser/schema.graphql`
- ✅ Fixed `AttachmentFields` fragment to match actual schema structure
- ✅ Successfully ran GraphQL Code Generator
- ✅ Generated TypeScript types in `packages/fediverse/src/adapters/graphql/generated/types.ts`

### 2. GraphQL Documents  
Created three new GraphQL document files with queries and mutations:

#### `/packages/fediverse/src/adapters/graphql/documents/profile.graphql`
- ✅ `Followers` query - paginated followers list with ActorListPage support
- ✅ `Following` query - paginated following list with ActorListPage support
- ✅ `UpdateProfile` mutation - update profile with all fields (displayName, bio, avatar, header, locked, bot, discoverable, noIndex, sensitive, language, fields)

#### `/packages/fediverse/src/adapters/graphql/documents/preferences.graphql`
- ✅ `UserPreferences` query - fetch all user preferences (posting, reading, discovery, streaming, notifications, privacy, reblogFilters)
- ✅ `UpdateUserPreferences` mutation - update full preferences
- ✅ `UpdateStreamingPreferences` mutation - update streaming-specific preferences

#### `/packages/fediverse/src/adapters/graphql/documents/push.graphql`
- ✅ `PushSubscription` query - fetch current push subscription
- ✅ `RegisterPushSubscription` mutation - register new push subscription
- ✅ `UpdatePushSubscription` mutation - update push alerts
- ✅ `DeletePushSubscription` mutation - remove push subscription

### 3. Client Adapter Layer
Created converter functions in `/packages/adapters/src/mappers/lesser/graphqlConverters.ts`:

- ✅ `convertGraphQLActorListPage()` - converts ActorListPage with actors array, nextCursor, totalCount
- ✅ `convertGraphQLUserPreferences()` - converts all preference sections (posting, reading, discovery, streaming, notifications, privacy, reblogFilters)
- ✅ `convertGraphQLPushSubscription()` - converts push subscription with keys and alerts

**Type Definitions Added:**
- `ActorListPage` interface
- `UserPreferences` interface (with sub-interfaces for posting, reading, discovery, streaming, notifications, privacy)
- `PushSubscription` interface (with sub-interfaces for keys and alerts)

✅ **Build Verification:** All packages compile successfully with new types

## Remaining Work 🚧

The following tasks require UI component integration and are tracked in separate TODOs:

### 4. Followers/Following UI
**Location:** `packages/fediverse/src/components/Profile/*.svelte`

**Implementation Required:**
- Replace REST API calls with GraphQL `Followers` and `Following` queries
- Update pagination logic to use `nextCursor` instead of offset-based pagination
- Display `totalCount` in UI headers
- Handle empty states and loading indicators
- Update stores to cache GraphQL results

**Files to Modify:**
- Profile component that displays followers/following lists
- Timeline context if followers data is used there

### 5. Profile Editing Flow
**Location:** `packages/fediverse/src/components/Profile/Edit*.svelte`

**Implementation Required:**
- Use `UpdateProfile` mutation instead of REST endpoints
- Map form fields to `UpdateProfileInput` type
- Handle optimistic updates
- Manage avatar/header upload flow (may need separate media upload mutation first)
- Display validation errors from GraphQL response
- Invalidate/refetch profile query after successful update

### 6. Unified Preferences
**Location:** Settings/preferences components

**Implementation Required:**
- Replace current preference loading with `UserPreferences` query
- Hydrate forms from structured preference data (posting, reading, discovery, etc.)
- Use `UpdateUserPreferences` mutation for full saves
- Use `UpdateStreamingPreferences` for streaming-specific updates
- Support new enum types (`ExpandMediaPreference`, `TimelineOrder`, `StreamQuality`, `DigestFrequency`)
- Handle account switching by refetching preferences

### 7. Push Notifications UI
**Location:** Notification settings components

**Implementation Required:**
- Query `PushSubscription` on settings load
- Call `RegisterPushSubscription` when user enables push (with browser subscription info)
- Call `UpdatePushSubscription` when user toggles individual alert types
- Call `DeletePushSubscription` on logout or opt-out
- Display server VAPID key if available
- Handle missing endpoint/keys errors gracefully
- Show registration status (pending, active, failed)

### 8. State & Cache Management
**Implementation Required:**
- Add Apollo/urql cache update logic for mutations
- Implement `writeQuery` or custom exchange for cache coherence
- Handle optimistic updates for profile/preference changes
- Invalidate cached data on account switch
- Set up refetch policies for profile/preference queries

### 9. Validation & UX
**Implementation Required:**
- Extract and display GraphQL validation errors
- Map error paths to form fields
- Show toast/banner feedback for mutations
- Detect missing VAPID keys and prompt user
- Handle network errors gracefully
- Show loading spinners during mutations
- Disable form controls while mutations are in flight

### 10. Testing Strategy
**Implementation Required:**
- Unit tests for new converter functions (Vitest)
- Update component snapshots for settings/profile screens
- Add Playwright E2E tests:
  - Followers pagination flow
  - Following pagination flow
  - Profile edit and save
  - Preferences update
  - Push notification registration
- Mock GraphQL responses in tests
- Ensure test suite passes (pnpm test, lint, E2E)

### 11. Documentation & Changelog
**Implementation Required:**
- Update component documentation in `docs/components/`
- Add GraphQL usage examples
- Note REST deprecation timeline (if any)
- Document preference structure and enums
- Add push notification setup guide
- Update `CHANGELOG.md` with new features:
  - GraphQL-based followers/following queries
  - GraphQL-based profile updates
  - GraphQL-based user preferences
  - GraphQL-based push notification management

## Usage Examples

### Followers/Following (for UI implementation)
```typescript
import { FollowersDocument, FollowingDocument } from './adapters/graphql/generated/types';
import { convertGraphQLActorListPage } from '@equaltoai/greater-components-adapters';

// Fetch followers
const followersResult = await client.query({
  query: FollowersDocument,
  variables: { username: 'alice', limit: 40, cursor: null }
});

const followers = convertGraphQLActorListPage(followersResult.data?.followers);
// followers.actors: LesserAccountFragment[]
// followers.nextCursor: string | undefined
// followers.totalCount: number
```

### User Preferences
```typescript
import { UserPreferencesDocument, UpdateUserPreferencesDocument } from './adapters/graphql/generated/types';
import { convertGraphQLUserPreferences } from '@equaltoai/greater-components-adapters';

// Load preferences
const prefsResult = await client.query({
  query: UserPreferencesDocument
});

const prefs = convertGraphQLUserPreferences(prefsResult.data?.userPreferences);
// prefs.posting.defaultVisibility
// prefs.reading.expandMedia
// prefs.streaming.defaultQuality
// ...

// Update preferences
await client.mutate({
  mutation: UpdateUserPreferencesDocument,
  variables: {
    input: {
      defaultPostingVisibility: 'PUBLIC',
      expandMedia: 'SHOW_ALL',
      streaming: {
        defaultQuality: 'HIGH',
        autoQuality: true,
        preloadNext: true,
        dataSaver: false
      }
    }
  }
});
```

### Push Subscriptions
```typescript
import { 
  PushSubscriptionDocument, 
  RegisterPushSubscriptionDocument,
  UpdatePushSubscriptionDocument,
  DeletePushSubscriptionDocument 
} from './adapters/graphql/generated/types';
import { convertGraphQLPushSubscription } from '@equaltoai/greater-components-adapters';

// Check current subscription
const subResult = await client.query({
  query: PushSubscriptionDocument
});

const currentSub = subResult.data?.pushSubscription 
  ? convertGraphQLPushSubscription(subResult.data.pushSubscription)
  : null;

// Register new subscription
const browserSub = await navigator.serviceWorker.ready.then(reg => 
  reg.pushManager.subscribe({ ... })
);

await client.mutate({
  mutation: RegisterPushSubscriptionDocument,
  variables: {
    input: {
      endpoint: browserSub.endpoint,
      keys: {
        auth: arrayBufferToBase64(browserSub.getKey('auth')),
        p256dh: arrayBufferToBase64(browserSub.getKey('p256dh'))
      },
      alerts: {
        follow: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: false,
        followRequest: true,
        status: true,
        update: true,
        adminSignUp: false,
        adminReport: false
      }
    }
  }
});

// Update alert preferences
await client.mutate({
  mutation: UpdatePushSubscriptionDocument,
  variables: {
    input: {
      alerts: {
        follow: true,
        favourite: false, // toggle favourite alerts
        reblog: true,
        mention: true,
        poll: true,
        followRequest: true,
        status: false,
        update: false,
        adminSignUp: false,
        adminReport: false
      }
    }
  }
});

// Delete subscription
await client.mutate({
  mutation: DeletePushSubscriptionDocument
});
```

## Technical Notes

### GraphQL Client Setup
The project uses `@graphql-codegen/typed-document-node` which generates type-safe documents. These can be used with any GraphQL client (Apollo, urql, graphql-request, etc.).

### Generated Files
- `packages/fediverse/src/adapters/graphql/generated/types.ts` - All TypeScript types
- `packages/fediverse/src/adapters/graphql/generated/introspection.json` - Schema introspection
- `packages/fediverse/src/adapters/graphql/generated/possible-types.ts` - Fragment type matching

### Code Generation Command
```bash
pnpm graphql-codegen --config codegen.ts
```

Run this whenever schema or documents change.

## Next Steps Priority

1. **Followers/Following UI** - Most straightforward, good test of GraphQL integration
2. **Profile Editing** - High visibility feature, user-facing
3. **Push Notifications** - Complex but isolated, can be feature-flagged
4. **User Preferences** - Broad impact, requires careful migration
5. **State Management** - Ongoing as features are implemented
6. **Testing** - Parallel with feature implementation
7. **Documentation** - Final step after features stabilize

