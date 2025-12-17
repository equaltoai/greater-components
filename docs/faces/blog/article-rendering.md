# Blog Face: Article Rendering

> Rendering markdown content with syntax highlighting and rich formatting.

The Blog Face uses the `content` package for flexible content rendering, supporting Markdown, HTML, and custom block types.

## Article Component

```svelte
<script lang="ts">
	import { Article } from '$lib/components/faces/blog';
</script>

<Article.Root {article}>
	<Article.Header />
	<Article.TableOfContents />
	<Article.Content />
	<Article.Footer />
</Article.Root>
```

## Content Formats

### Markdown

```typescript
const article = {
	content: '# Hello World\n\nThis is **markdown** content.',
	contentFormat: 'markdown',
};
```

### HTML

```typescript
const article = {
	content: '<h1>Hello World</h1><p>This is <strong>HTML</strong> content.</p>',
	contentFormat: 'html',
};
```

## Markdown Renderer

Direct usage of the markdown renderer:

```svelte
<script lang="ts">
	import { MarkdownRenderer } from '@equaltoai/greater-components/content';
</script>

<MarkdownRenderer content={markdownString} allowHtml={false} syntaxHighlight={true} />
```

## Syntax Highlighting

Code blocks are automatically highlighted using Shiki:

````markdown
```typescript
function hello(name: string): void {
	console.log(`Hello, ${name}!`);
}
```
````

### Supported Languages

The renderer supports 100+ languages including:

- JavaScript/TypeScript
- Python, Ruby, Go, Rust
- HTML, CSS, SCSS
- Svelte, Vue, React
- SQL, GraphQL, JSON/YAML

## Table of Contents

Auto-generated from headings:

```svelte
<Article.TableOfContents maxDepth={3} scrollOffset={80} smooth={true} />
```

## Custom Blocks

Define custom content blocks:

```typescript
const blocks = {
	callout: ({ type, content }) => {
		return `<div class="callout callout-${type}">${content}</div>`;
	},
	embed: ({ url }) => {
		return `<iframe src="${url}" />`;
	},
};
```

Usage in markdown:

```markdown
:::callout[info]
This is an informational callout.
:::

:::embed[https://example.com/video]
:::
```

## Image Handling

```svelte
<Article.Content
	imageLoading="lazy"
	imagePlaceholder="/placeholder.jpg"
	onImageClick={openLightbox}
/>
```

## Reading Progress

```svelte
<script lang="ts">
	import { ReadingProgress } from '$lib/components/faces/blog';
</script>

<ReadingProgress position="top" color="var(--gr-color-primary-500)" />
```

## Related Documentation

- [Getting Started](./getting-started.md)
- [Core Patterns](../../core-patterns.md)
