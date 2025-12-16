# Blog Face: Getting Started

The blog face provides Medium/WordPress-style UI for long-form publishing (Article, Author, Publication, Navigation, Editor).

## Install

```bash
pnpm add @equaltoai/greater-components
```

## Required CSS

```ts
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/blog/style.css';
```

## Basic Usage

```svelte
<script lang="ts">
	import { Article } from '@equaltoai/greater-components/faces/blog';

	const article = {
		id: 'a1',
		slug: 'hello-long-form',
		metadata: {
			title: 'Hello, long-form',
			description: 'A demo article rendered with the blog face',
			publishedAt: new Date().toISOString(),
			tags: ['demo'],
		},
		content: '# Heading\\n\\nThis is a demo article.',
		contentFormat: 'markdown',
		author: { id: 'u1', name: 'Demo Author', username: 'demo' },
		isPublished: true,
	};
<\/script>

<Article.Root {article}>
	<Article.Header />
	<Article.Content />
	<Article.Footer />
</Article.Root>
```

## CLI Install

```bash
greater init --face blog
greater add faces/blog
```
