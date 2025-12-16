# Social Face: Getting Started

The social face provides Twitter/Mastodon-style UI for ActivityPub apps (Status, Timeline, Profile, Lists, Filters, Hashtags).

## Install

```bash
pnpm add @equaltoai/greater-components
```

## Required CSS

Import tokens, primitives, then the face stylesheet:

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/social/style.css';
```

## Basic Usage

```svelte
<script lang="ts">
	import { Status } from '@equaltoai/greater-components/faces/social';

	// Provide your own status data (or use the Lesser adapter/store patterns).
	const status = {
		id: '1',
		content: '<p>Hello, fediverse!</p>',
		createdAt: new Date().toISOString(),
		account: { id: 'a', username: 'demo', displayName: 'Demo' },
		favouritesCount: 0,
		reblogsCount: 0,
		repliesCount: 0,
	};
<\/script>

<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```

## CLI Install

```bash
greater init --face social
greater add faces/social
```

Next: `docs/faces/social/timeline-integration.md`

