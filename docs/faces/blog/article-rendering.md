# Blog Face: Article Rendering

> Public article display for Lesser-backed Blog/CMS apps.

`Article.Content` displays a prepared article body. For Lesser-backed publications, Lesser/server owns
the canonical render and sanitize step; Greater does not create a second public Markdown renderer that
can diverge from the server contract.

## Article component

For a complete SSR-safe public reader route, prefer `ArticleReader`:

```svelte
<script lang="ts">
	import { ArticleReader } from '@equaltoai/greater-components/faces/blog';
</script>

<ArticleReader {article} />
```

`ArticleReader` accepts canonical Greater `ArticleData` and flat Lesser/Emdash
`ArticleData`-shaped display input. It defaults browser-only affordances such as reading progress,
table-of-contents extraction, and share actions off so server-rendered reader routes can adopt it
without a client-only lifecycle.

For custom layouts, continue using the compound components:

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

## Public content formats

### Server-rendered HTML (canonical public path)

Use `contentFormat: 'html'` for public articles when the backend has rendered and sanitized the
canonical article body. Greater still sanitizes before `{@html}` as defense-in-depth.

```typescript
const article = {
	content: '<h2>Hello World</h2><p>This is the server-rendered article body.</p>',
	contentFormat: 'html',
};
```

### Markdown source (escaped fallback only)

Use `contentFormat: 'markdown'` only when the adapter has raw source and no canonical rendered public
HTML yet. `Article.Content` displays that source as escaped plain text. It does not parse Markdown into
public HTML and it does not treat raw Markdown as trusted content.

```typescript
const article = {
	content: '# Draft source\n\nThis Markdown is shown as escaped fallback text.',
	contentFormat: 'markdown',
};
```

For authoring previews, use `Editor.Root` split mode or the `content` package's `MarkdownRenderer`.
Those previews are draft/editor conveniences, not the canonical public renderer for Lesser-backed
articles.

## Lesser CMS adapter boundary

Adapters should map Lesser's pinned CMS contract into Blog face view models before rendering:

- Lesser `ContentFormat.HTML` / `ContentFormat.MARKDOWN` → Greater `html` / `markdown`
- Lesser `Article.title`, `subtitle`, `excerpt`, `publishedAt`, `updatedAt`, `readingTimeMinutes`,
  and `wordCount` → `ArticleData.metadata.*`
- Lesser `Actor` → `AuthorData`
- Lesser `Media` → featured-image URL/alt metadata
- Lesser private workflow fields (`editorNotes`, `reviewStatus`) stay out of reusable public UI types

See [Lesser CMS Contract Audit](./lesser-cms-contract-audit.md) for the complete field-by-field gap
list.

## Table of contents

`Article.TableOfContents` uses headings discovered from the rendered article DOM. The Lesser M0
`tableOfContents` field remains outside the Blog face public API for this milestone; add a server-TOC
input only after a concrete app integration proves that `Article.Content`'s DOM-derived headings are
insufficient.

```svelte
<Article.Root {article}>
	<Article.Header />
	<div class="article-layout">
		<Article.TableOfContents />
		<Article.Content />
	</div>
	<Article.Footer />
</Article.Root>
```

## Syntax highlighting and custom Markdown rendering

The `content` package still exports `MarkdownRenderer` for draft previews or non-Lesser content
surfaces:

```svelte
<script lang="ts">
	import { MarkdownRenderer } from '$lib/greater/content';
</script>

<MarkdownRenderer content={draftMarkdown} sanitize={true} />
```

Do not substitute this client renderer for Lesser's canonical public article renderer. If a consuming
app needs temporary Markdown display before server-rendered HTML exists, keep that behavior clearly
labeled as fallback/plain/escaped content.

## Reading progress

```svelte
<script lang="ts">
	import { ReadingProgress } from '$lib/components/faces/blog';
</script>

<ReadingProgress position="top" color="var(--gr-color-primary-500)" />
```

## Related documentation

- [Getting Started](./getting-started.md)
- [Emdash Article Surface Migration](./emdash-article-surface.md)
- [Lesser CMS Contract Audit](./lesser-cms-contract-audit.md)
- [Core Patterns](../../core-patterns.md)
