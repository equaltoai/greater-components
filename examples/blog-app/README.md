# Blog App Example

A complete SvelteKit application demonstrating Greater Components blog face usage.

## Features

- 📄 Article display with rich formatting
- 📑 Table of contents generation
- 📊 Reading progress indicator
- ✍️ Article editor with toolbar
- 👤 Author cards and bios
- 🏷️ Tag cloud and archives

## Quick Start

```bash
# Install dependencies
pnpm install

# Initialize Greater Components
greater init --face blog

# Add blog face components
greater add faces/blog

# Start development server
pnpm dev
```

## Project Structure

```
blog-app/
├── src/
│   ├── lib/
│   │   └── components/
│   │       └── ui/          # Greater Components (added via CLI)
│   │           ├── Article/
│   │           ├── Author/
│   │           ├── Editor/
│   │           └── Navigation/
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte     # Blog home/listing
│       ├── [slug]/
│       │   └── +page.svelte # Article view
│       └── editor/
│           └── +page.svelte # Article editor
├── components.json
└── package.json
```

## Usage Examples

### Article Display

```svelte
<script>
	import * as Article from '$lib/components/ui/Article';
</script>

<Article.Root {article}>
	<Article.Header />
	<Article.TableOfContents position="sidebar" />
	<Article.Content />
	<Article.ShareBar platforms={['twitter', 'linkedin', 'email']} />
	<Article.Footer />
	<Article.RelatedPosts posts={relatedPosts} limit={3} />
</Article.Root>
```

### Author Card

```svelte
<script>
	import * as Author from '$lib/components/ui/Author';
</script>

<Author.Root {author}>
	<Author.Avatar size="lg" />
	<Author.Bio />
	<Author.SocialLinks />
</Author.Root>
```

### Navigation

```svelte
<script>
	import * as Navigation from '$lib/components/ui/Navigation';
</script>

<Navigation.Root {archives} {tags} {categories}>
	<Navigation.ArchiveView groupBy="month" />
	<Navigation.TagCloud maxTags={20} />
	<Navigation.CategoryList showCounts />
</Navigation.Root>
```

## Learn More

- [CLI Guide](../../docs/cli-guide.md)
- [Blog Face Documentation](../../packages/faces/blog/README.md)
- [Core Patterns](../../docs/core-patterns.md)
