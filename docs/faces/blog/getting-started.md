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
		content: '<h2>Introduction</h2><p>This is server-rendered article HTML.</p>',
		contentFormat: 'html',
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

### SSR-friendly reader and index card

For first-app public display routes that do not need custom composition, use the complete SSR-safe
exports instead of assembling the compound parts manually:

```svelte
<script lang="ts">
	import { ArticleReader, ArticleIndexCard } from '@equaltoai/greater-components/faces/blog';

	export let article;
	export let articles = [];
</script>

<ArticleReader {article} />

<section aria-label="Article index">
	{#each articles as post (post.id)}
		<ArticleIndexCard article={post} href={`/articles/${post.slug}`} />
	{/each}
</section>
```

See [Emdash Article Surface Migration](./emdash-article-surface.md) for the Project 36 migration note,
SSR import path, and release/export verification command.

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

For public Lesser-backed articles, pass canonical server-rendered HTML into `Article.Content` with
`contentFormat: 'html'`. If a Blog adapter only has raw Markdown source, `Article.Content` displays it
as escaped fallback text instead of creating a second public renderer.

The blog face can still integrate with the `content` package for draft/editor Markdown previews:

```typescript
import { MarkdownRenderer } from '$lib/greater/content';
```

See [Article Rendering](./article-rendering.md) for the renderer/sanitizer boundary and
[Lesser CMS Contract Audit](./lesser-cms-contract-audit.md) for the field-by-field adapter gap list.

## Next Steps

- [Article Rendering](./article-rendering.md) – Public article rendering boundary
- [Emdash Article Surface Migration](./emdash-article-surface.md) – Replacing first-app reader/index render glue
- [Lesser CMS Contract Audit](./lesser-cms-contract-audit.md) – Lesser CMS adapter boundary
- [Core Patterns](../../core-patterns.md) – Common patterns and best practices
