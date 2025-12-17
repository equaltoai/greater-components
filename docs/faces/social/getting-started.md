# Social Face: Getting Started

> Twitter/Mastodon-style UI components for ActivityPub applications.

The Social Face provides components for building social media interfaces including Status, Timeline, Profile, Lists, Filters, and Hashtags. It's designed for Fediverse applications and integrates seamlessly with the Lesser GraphQL adapter.

## Installation

### Option 1: CLI (Recommended)

```bash
# Initialize with Social Face
npx @equaltoai/greater-components-cli init --face social

# Or add to an existing project
npx @equaltoai/greater-components-cli add faces/social
```

### Option 2: Add Individual Components

```bash
# Add specific component groups
npx @equaltoai/greater-components-cli add status timeline profile

# Add additional features
npx @equaltoai/greater-components-cli add lists filters hashtags
```

## Required CSS

If using CLI with local CSS mode (default), imports are injected automatically:

```ts
// Automatically added by CLI init
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/social.css';
```

If using npm packages directly:

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/social/style.css';
```

## Basic Usage

### Displaying a Status

```svelte
<script lang="ts">
	import { Status } from '$lib/components/faces/social';
	// Or from npm: import { Status } from '@equaltoai/greater-components/faces/social';

	const status = {
		id: '1',
		content: '<p>Hello, fediverse!</p>',
		createdAt: new Date().toISOString(),
		account: {
			id: 'a',
			username: 'demo',
			displayName: 'Demo User',
			avatar: '/avatars/demo.jpg',
		},
		favouritesCount: 42,
		reblogsCount: 12,
		repliesCount: 5,
	};

	const handlers = {
		onFavourite: async (status) => console.log('Favourited:', status.id),
		onBoost: async (status) => console.log('Boosted:', status.id),
		onReply: (status) => console.log('Reply to:', status.id),
	};
</script>

<Status.Root {status} {handlers}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```

### Building a Timeline

```svelte
<script lang="ts">
	import { Timeline } from '$lib/components/faces/social';
	import { createTimelineStore } from '$lib/stores';

	const timeline = createTimelineStore({ type: 'home' });
</script>

<Timeline.Root store={timeline}>
	<Timeline.Header title="Home" />
	<Timeline.Feed />
	<Timeline.LoadMore />
</Timeline.Root>
```

### User Profile

```svelte
<script lang="ts">
	import { Profile } from '$lib/components/faces/social';
</script>

<Profile.Root {account}>
	<Profile.Header />
	<Profile.Stats />
	<Profile.Bio />
	<Profile.Actions />
</Profile.Root>
```

## Key Component Groups

| Component  | Description                    | Documentation                                     |
| ---------- | ------------------------------ | ------------------------------------------------- |
| `Status`   | Individual post/status display | [Timeline Integration](./timeline-integration.md) |
| `Timeline` | Virtualized status feed        | [Timeline Integration](./timeline-integration.md) |
| `Profile`  | User profile pages             | Coming soon                                       |
| `Lists`    | User list management           | Coming soon                                       |
| `Filters`  | Content filtering              | Coming soon                                       |
| `Hashtags` | Hashtag exploration            | Coming soon                                       |

## Adapter Integration

```typescript
// src/lib/api.ts
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

export const adapter = new LesserGraphQLAdapter({
	httpEndpoint: 'https://your-instance.social/graphql',
	token: 'your-auth-token',
});
```

## Next Steps

- [Timeline Integration](./timeline-integration.md) – Building timeline views
- [Authentication](./authentication.md) – Setting up auth flows
- [Core Patterns](../../core-patterns.md) – Common patterns and best practices
