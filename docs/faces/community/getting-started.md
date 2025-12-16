# Community Face: Getting Started

The community face provides Reddit/forum-style UI for communities, posts, threads, moderation, and wikis.

## Install

```bash
pnpm add @equaltoai/greater-components
```

## Required CSS

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/community/style.css';
```

## Basic Usage

```svelte
<script lang="ts">
	import { Community } from '@equaltoai/greater-components/faces/community';

	const community = {
		id: 'c1',
		name: 'greater',
		title: 'Greater Components',
		description: 'A demo community',
		rules: [],
		stats: { subscriberCount: 1234, activeCount: 12, postCount: 99, createdAt: new Date().toISOString() },
	};
<\/script>

<Community.Root {community}>
	<Community.Header />
	<Community.Stats />
	<Community.RulesSidebar />
</Community.Root>
```

## CLI Install

```bash
greater init --face community
greater add faces/community
```

