# Community Face: Getting Started

> Reddit/forum-style UI components for community platforms.

The Community Face provides components for building community platforms with posts, threads, voting, moderation tools, and wiki pages. It's designed for forum-style applications with nested discussions and community governance.

## Installation

### Option 1: CLI (Recommended)

```bash
# Initialize with Community Face
npx @equaltoai/greater-components-cli init --face community

# Or add to an existing project
npx @equaltoai/greater-components-cli add faces/community
```

### Option 2: Add Individual Components

```bash
# Add specific component groups
npx @equaltoai/greater-components-cli add community post thread

# Add moderation and wiki
npx @equaltoai/greater-components-cli add moderation wiki voting flair
```

## Required CSS

If using CLI with local CSS mode (default), imports are injected automatically:

```ts
// Automatically added by CLI init
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/community.css';
```

## Basic Usage

### Community Header

```svelte
<script lang="ts">
	import { Community } from '$lib/components/Community';

	const community = {
		id: 'c1',
		name: 'greater',
		title: 'Greater Components',
		description: 'Discussion about Greater Components library',
		banner: '/banners/greater.jpg',
		icon: '/icons/greater.png',
		rules: [
			{ id: 'r1', title: 'Be respectful', description: 'Treat others with respect.' },
			{ id: 'r2', title: 'Stay on topic', description: 'Keep discussions relevant.' },
		],
		stats: {
			subscriberCount: 12500,
			activeCount: 342,
			postCount: 8900,
			createdAt: '2024-01-01T00:00:00Z',
		},
	};
</script>

<Community.Root {community}>
	<Community.Header />
	<Community.Stats />
	<Community.RulesSidebar />
</Community.Root>
```

### Post Display

```svelte
<script lang="ts">
	import { Post } from '$lib/components/Post';

	const post = {
		id: 'p1',
		title: 'How to use the Community Face',
		content: 'A guide to building community platforms...',
		author: { id: 'u1', username: 'demo', displayName: 'Demo User' },
		score: 42,
		commentCount: 15,
		createdAt: new Date().toISOString(),
		flair: { id: 'f1', text: 'Tutorial', color: '#4CAF50' },
	};

	const handlers = {
		onUpvote: async (post) => console.log('Upvoted:', post.id),
		onDownvote: async (post) => console.log('Downvoted:', post.id),
		onComment: (post) => console.log('Comment on:', post.id),
	};
</script>

<Post.Root {post} {handlers}>
	<Post.Header />
	<Post.Content />
	<Post.Voting />
	<Post.Actions />
</Post.Root>
```

### Threaded Comments

```svelte
<script lang="ts">
	import { Thread } from '$lib/components/Thread';
</script>

<Thread.Root {comments} {handlers}>
	<Thread.List />
	<Thread.LoadMore />
</Thread.Root>
```

## Key Component Groups

| Component    | Description                | Documentation                             |
| ------------ | -------------------------- | ----------------------------------------- |
| `Community`  | Community page and sidebar | [Group Management](./group-management.md) |
| `Post`       | Post display with voting   | Coming soon                               |
| `Thread`     | Nested comment threads     | Coming soon                               |
| `Voting`     | Upvote/downvote controls   | Coming soon                               |
| `Flair`      | Post and user flair        | Coming soon                               |
| `Moderation` | Mod tools and queue        | [Moderation](./moderation.md)             |
| `Wiki`       | Community wiki pages       | Coming soon                               |

## Moderation Integration

```svelte
<script lang="ts">
	import { Moderation } from '$lib/components/faces/community';
</script>

<Moderation.Root {queue} {handlers}>
	<Moderation.Queue />
	<Moderation.Log />
</Moderation.Root>
```

## Next Steps

- [Group Management](./group-management.md) – Community settings and rules
- [Moderation](./moderation.md) – Moderation tools and workflows
- [Core Patterns](../../core-patterns.md) – Common patterns and best practices
