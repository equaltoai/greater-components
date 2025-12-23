# Blog Face: Getting Started

> Medium/WordPress-style UI components for long-form publishing.

The Blog Face provides components designed for blog platforms, publications, and content management systems. It includes Article, Author, Publication, Navigation, and Editor components optimized for long-form reading experiences.

## Installation

### Option 1: CLI (Recommended)

```bash
# Initialize with Blog Face
greater init --face blog

# Or add to an existing project
greater add faces/blog
```

### Option 2: Add Individual Components

```bash
# Add specific component groups
greater add article author publication

# Add editor and navigation
greater add editor navigation
```

## Required CSS

If using CLI with local CSS mode (default), imports are injected automatically:

```ts
// Automatically added by CLI init
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/blog.css';
```

## Basic Usage

### Displaying an Article

```svelte
<script lang="ts">
	import { Article } from '$lib/components/Article';

	const article = {
		id: 'a1',
		slug: 'hello-long-form',
		metadata: {
			title: 'Hello, Long-Form Content',
			description: 'A demonstration of the blog face article components',
			publishedAt: new Date().toISOString(),
			readingTime: 5,
			tags: ['demo', 'tutorial'],
		},
		content: '# Introduction\n\nThis is a demo article with full markdown support.',
		contentFormat: 'markdown',
		author: {
			id: 'u1',
			name: 'Demo Author',
			username: 'demo',
			avatar: '/avatars/demo.jpg',
		},
		isPublished: true,
	};
</script>

<Article.Root {article}>
	<Article.Header />
	<Article.TableOfContents />
	<Article.Content />
	<Article.Footer />
	<Article.RelatedPosts posts={relatedPosts} />
</Article.Root>
```

### Author Card

```svelte
<script lang="ts">
	import { Author } from '$lib/components/Author';

	const author = {
		id: 'u1',
		name: 'Demo Author',
		username: 'demo',
		avatar: '/avatars/demo.jpg',
		bio: 'Tech writer and software enthusiast.',
		socialLinks: {
			twitter: 'https://twitter.com/demo',
			github: 'https://github.com/demo',
		},
	};
</script>

<Author.Root {author} showBio showSocial>
	<Author.Card />
</Author.Root>
```

### Navigation Components

```svelte
<script lang="ts">
	import { Navigation } from '$lib/components/Navigation';
</script>

<Navigation.Root {categories} {archives}>
	<Navigation.Categories />
	<Navigation.ArchiveView />
	<Navigation.TagCloud />
</Navigation.Root>
```

## Key Component Groups

| Component     | Description                | Documentation                               |
| ------------- | -------------------------- | ------------------------------------------- |
| `Article`     | Article display with TOC   | [Article Rendering](./article-rendering.md) |
| `Author`      | Author bio and cards       | Coming soon                                 |
| `Publication` | Publication/blog branding  | Coming soon                                 |
| `Navigation`  | Categories, archives, tags | Coming soon                                 |
| `Editor`      | Rich text editor           | Coming soon                                 |

## Content Rendering

The blog face integrates with the `content` package for markdown rendering:

```typescript
import { MarkdownRenderer } from '$lib/greater/content';
```

## Next Steps

- [Article Rendering](./article-rendering.md) – Markdown and rich content
- [Core Patterns](../../core-patterns.md) – Common patterns and best practices
