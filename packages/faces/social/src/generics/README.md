# Generic TypeScript Patterns for ActivityPub

This module provides **type-safe generic interfaces** that work across **any ActivityPub implementation** (Mastodon, Pleroma, Lesser, and more).

## Why Generics?

The Fediverse is diverse! Each platform (Mastodon, Pleroma, Misskey, etc.) implements ActivityPub slightly differently with platform-specific extensions. Our generic system allows you to:

1. **Write components once** - Works with any ActivityPub server
2. **Full type safety** - TypeScript knows exactly what fields are available
3. **Platform-specific extensions** - Access custom fields when needed
4. **Easy migration** - Switch platforms without rewriting components

## Core Interfaces

### ActivityPubActor

Represents any federated actor (Person, Organization, Service, etc.)

```typescript
import type { ActivityPubActor } from '@equaltoai/greater-components/faces/social/generics';

const actor: ActivityPubActor = {
	id: 'https://mastodon.social/users/alice',
	type: 'Person',
	name: 'Alice',
	preferredUsername: 'alice',
	summary: 'Software developer',
	icon: {
		type: 'Image',
		url: 'https://cdn.mastodon.social/avatars/alice.jpg',
	},
	// ... and more
};
```

### ActivityPubObject

Represents any federated object (Note, Article, Video, etc.)

```typescript
import type { ActivityPubObject } from '@equaltoai/greater-components/faces/social/generics';

const post: ActivityPubObject = {
	id: 'https://mastodon.social/users/alice/statuses/123',
	type: 'Note',
	attributedTo: actor,
	content: '<p>Hello Fediverse!</p>',
	published: '2025-10-11T12:00:00Z',
	// ... and more
};
```

### GenericStatus

A unified status interface that works across all platforms

```typescript
import type { GenericStatus } from '@equaltoai/greater-components/faces/social/generics';

const status: GenericStatus = {
	id: '123',
	account: actor,
	content: '<p>Hello Fediverse!</p>',
	mediaAttachments: [],
	createdAt: new Date(),
	repliesCount: 5,
	reblogsCount: 10,
	favouritesCount: 20,
	visibility: 'public',
	// ... and more
};
```

## Platform Adapters

### Mastodon Adapter

Converts Mastodon API responses to generic types:

```typescript
import { MastodonAdapter } from '@equaltoai/greater-components/faces/social/generics/adapters';
import type { MastodonStatus } from '@equaltoai/greater-components/faces/social/generics/adapters';

const adapter = new MastodonAdapter();

// Get from Mastodon API
const mastodonStatus: MastodonStatus = await fetch('/api/v1/statuses/123').then((r) => r.json());

// Convert to generic
const genericStatus = adapter.toGeneric(mastodonStatus);

// Now use in any component!
```

### Pleroma Adapter

Handles Pleroma-specific extensions like emoji reactions:

```typescript
import { PleromaAdapter } from '@equaltoai/greater-components/faces/social/generics/adapters';

const adapter = new PleromaAdapter();
const genericStatus = adapter.toGeneric(pleromaStatus);

// Access Pleroma-specific features
if (genericStatus.activityPubObject.extensions?.pleroma) {
	const emojiReactions = genericStatus.activityPubObject.extensions.pleroma.emoji_reactions;
}
```

### Lesser Adapter

Works with native ActivityPub objects:

```typescript
import { LesserAdapter } from '@equaltoai/greater-components/faces/social/generics/adapters';

const adapter = new LesserAdapter();
const genericStatus = adapter.toGeneric(lesserStatus);
```

### Auto-Detection

Don't know which platform you're using? Auto-detect it!

```typescript
import { autoDetectAdapter } from '@equaltoai/greater-components/faces/social/generics/adapters';

const rawStatus = await fetch('/api/status/123').then((r) => r.json());
const adapter = autoDetectAdapter(rawStatus);

if (adapter) {
	const genericStatus = adapter.toGeneric(rawStatus);
}
```

## Using with Components

### Timeline Component

```svelte
<script lang="ts">
	import { Timeline } from '@equaltoai/greater-components/faces/social';
	import type { GenericStatus } from '@equaltoai/greater-components/faces/social/generics';
	import { MastodonAdapter } from '@equaltoai/greater-components/faces/social/generics/adapters';

	// Fetch from your platform
	const mastodonStatuses = await fetchStatuses();

	// Convert to generic
	const adapter = new MastodonAdapter();
	const genericStatuses: GenericStatus[] = mastodonStatuses.map((s) => adapter.toGeneric(s));

	// Use in component!
	const config = {
		mode: 'feed' as const,
		density: 'comfortable' as const,
	};
</script>

<Timeline.Root items={genericStatuses} {config}>
	{#each genericStatuses as status}
		<Timeline.Item {status} />
	{/each}
</Timeline.Root>
```

### Status Component

```svelte
<script lang="ts">
	import * as Status from '@equaltoai/greater-components/faces/social/Status';
	import type { GenericStatus } from '@equaltoai/greater-components/faces/social/generics';

	interface Props {
		status: GenericStatus; // Works with ANY platform!
	}

	let { status }: Props = $props();
</script>

<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```

## Type Extensions

### Platform-Specific Fields

Access platform-specific extensions with type safety:

```typescript
import type { ActivityPubActor } from '@equaltoai/greater-components/faces/social/generics';
import type { MastodonExtensions } from '@equaltoai/greater-components/faces/social/generics/adapters';

const actor: ActivityPubActor<MastodonExtensions> = {
	id: 'https://mastodon.social/users/alice',
	type: 'Person',
	// ... standard fields
	extensions: {
		bot: false,
		locked: true,
		fields: [{ name: 'Website', value: 'https://alice.com' }],
	},
};

// Type-safe access to Mastodon-specific fields
if (actor.extensions?.bot) {
	console.log('This is a bot account');
}
```

### Custom Extensions

Define your own extensions for custom platforms:

```typescript
interface MyPlatformExtensions {
	customField: string;
	specialFeature: boolean;
}

const actor: ActivityPubActor<MyPlatformExtensions> = {
	id: 'https://myplatform.com/users/bob',
	type: 'Person',
	extensions: {
		customField: 'custom value',
		specialFeature: true,
	},
};
```

## Type Guards

Use type guards to safely check types:

```typescript
import {
	isFullActor,
	isFullObject,
	isNote,
	isLike,
	isAnnounce,
	isFollow,
} from '@equaltoai/greater-components/faces/social/generics';

// Check if actor is fully loaded
if (isFullActor(object.attributedTo)) {
	console.log(object.attributedTo.name); // Type-safe!
}

// Check activity types
if (isLike(activity)) {
	console.log('Someone liked a post!');
}

if (isAnnounce(activity)) {
	console.log('Someone boosted a post!');
}
```

## Helpers

### Extract IDs

```typescript
import { extractActor, extractObject } from '@equaltoai/greater-components/faces/social/generics';

// Works with both strings and objects
const actorId = extractActor(object.attributedTo);
// Returns: 'https://mastodon.social/users/alice'

const objectId = extractObject(activity.object);
// Returns: 'https://mastodon.social/users/alice/statuses/123'
```

### Parse Timestamps

```typescript
import { parseTimestamp } from '@equaltoai/greater-components/faces/social/generics';

const date = parseTimestamp(object.published);
// Returns: Date object
```

### Get Visibility

```typescript
import { getVisibility } from '@equaltoai/greater-components/faces/social/generics';

const visibility = getVisibility(object);
// Returns: 'public' | 'unlisted' | 'private' | 'direct'
```

## Building Your Own Adapter

Create an adapter for a custom platform:

```typescript
import type {
	GenericAdapter,
	GenericStatus,
} from '@equaltoai/greater-components/faces/social/generics';

export interface MyPlatformStatus {
	// Your platform's status type
	id: string;
	author: { name: string };
	text: string;
	created: string;
}

export class MyPlatformAdapter implements GenericAdapter<MyPlatformStatus, GenericStatus> {
	toGeneric(raw: MyPlatformStatus): GenericStatus {
		return {
			id: raw.id,
			account: {
				id: `platform:${raw.author.name}`,
				type: 'Person',
				name: raw.author.name,
			},
			content: raw.text,
			createdAt: new Date(raw.created),
			// ... map all fields
		};
	}

	fromGeneric(generic: GenericStatus): MyPlatformStatus {
		// Convert back if needed
	}

	validate(raw: unknown): raw is MyPlatformStatus {
		// Validation logic
		return typeof raw === 'object' && 'id' in raw;
	}
}
```

## Best Practices

1. **Always use adapters** - Don't access platform-specific fields directly
2. **Type your components** - Use `GenericStatus` instead of `MastodonStatus`
3. **Handle missing fields** - Not all platforms have all fields
4. **Use type guards** - Check before accessing nested objects
5. **Document extensions** - If you add platform-specific code, document it

## Migration Guide

### From Platform-Specific Types

**Before:**

```typescript
import type { Status } from '../types'; // Mastodon-specific

function displayStatus(status: Status) {
	return status.account.display_name; // Only works with Mastodon
}
```

**After:**

```typescript
import type { GenericStatus } from '@equaltoai/greater-components/faces/social/generics';

function displayStatus(status: GenericStatus) {
	return status.account.name; // Works with any platform!
}
```

### Converting Existing Components

1. Replace platform-specific types with `GenericStatus`
2. Add adapter at data fetching layer
3. Update field access (e.g., `display_name` → `name`)
4. Test with multiple platforms

## Examples

See the refactored compound components for real-world usage:

- `Status` component - Uses `GenericStatus`
- `Timeline` component - Uses `GenericTimelineItem`
- `Notifications` component - Uses `GenericNotification`

## API Reference

### Types

- `ActivityPubActor<TExtensions>` - Federated actor
- `ActivityPubObject<TExtensions>` - Federated object
- `ActivityPubActivity<TObject, TExtensions>` - Federated activity
- `GenericStatus<T>` - Unified status
- `GenericTimelineItem<T>` - Timeline item
- `GenericNotification<T>` - Notification

### Adapters

- `MastodonAdapter` - Mastodon API → Generic
- `PleromaAdapter` - Pleroma API → Generic
- `LesserAdapter` - Native ActivityPub → Generic
- `createAdapter(platform)` - Factory function
- `autoDetectAdapter(raw)` - Auto-detection

### Type Guards

- `isFullActor(actor)` - Check if actor is loaded
- `isFullObject(object)` - Check if object is loaded
- `isNote(object)` - Check if object is a Note
- `isLike(activity)` - Check if activity is a Like
- `isAnnounce(activity)` - Check if activity is an Announce
- `isFollow(activity)` - Check if activity is a Follow

### Helpers

- `extractActor(actorOrString)` - Get actor ID
- `extractObject(objectOrString)` - Get object ID
- `parseTimestamp(timestamp)` - Parse to Date
- `getVisibility(object)` - Get visibility level

---

**Built for the Fediverse, by the Fediverse** 🌐

This generic system ensures Greater Components works with **any** ActivityPub implementation, now and in the future!
