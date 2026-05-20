# Blog Face: Emdash Article Surface Migration

Project 36 issue #573 added the first-app-proven Blog face display surface Emdash needs for
public reader and index routes. The surface is intentionally narrow: it replaces local article HTML
render glue, not Emdash routing, auth, adapters, SEO document metadata, comments, newsletter, search,
RSS, timelines, or rich editing.

## Public exports

After the Greater release that contains this change, Emdash can consume the public aggregate package
subpath from its own Svelte/FaceTheory SSR build without adopting Greater's workspace-internal Vite
build chain:

```ts
import {
	ArticleReader,
	ArticleIndexCard,
	normalizeArticleData,
	type ArticleDisplayData,
} from '@equaltoai/greater-components/faces/blog';
import '@equaltoai/greater-components/faces/blog/style.css';
```

CLI-vendored consumers can use the equivalent vendored Blog face path produced by `greater add faces/blog`.
The lower-level compound export remains stable for custom Svelte layouts:

```ts
import { Article } from '@equaltoai/greater-components/faces/blog';
```

`Article.Reader`, `Article.Card`, and `Article.IndexCard` are additive aliases on that namespace.

## SSR reader replacement

Emdash currently builds an Article reader body string locally. Replace that route-local body render with
Svelte SSR over `ArticleReader` while keeping FaceTheory document metadata in Emdash:

```ts
import { render } from 'svelte/server';
import { ArticleReader, type ArticleDisplayData } from '@equaltoai/greater-components/faces/blog';

export function renderArticleBody(article: ArticleDisplayData): string {
	return render(ArticleReader, {
		props: {
			article,
			config: {
				// Defaults are already SSR-safe: no reading progress, no TOC, no share bar.
				showAuthor: true,
			},
		},
	}).body;
}
```

`ArticleReader` accepts canonical Greater `ArticleData` and the flat Lesser/Emdash
`ArticleData`-shaped display object:

- `contentFormat: 'HTML' | 'MARKDOWN'` is normalized to Greater's lowercase format.
- `author.displayName` / `author.avatarUrl` are normalized to Blog face `AuthorData`.
- `categories` become display tags for the public reader/card.
- `featuredImage.url` / `featuredImage.altText` feed the existing featured-image presentation.

For public Lesser-backed articles, `HTML` remains the canonical rendered/sanitized path. `MARKDOWN` is
still escaped fallback text; Greater does not become a second public Markdown renderer.

## SSR index-card replacement

Replace Emdash's local `renderIndexCard(article)` helper with `ArticleIndexCard`:

```ts
import { render } from 'svelte/server';
import {
	ArticleIndexCard,
	type ArticleDisplayData,
} from '@equaltoai/greater-components/faces/blog';

export function renderIndexCard(article: ArticleDisplayData): string {
	return render(ArticleIndexCard, {
		props: {
			article,
			href: `/articles/${article.slug}`,
		},
	}).body;
}
```

The card emits one accessible link wrapping the card content, a heading, date/author/reading-time
metadata, excerpt text, optional featured image, and category/tag chips. Emdash keeps owning index page
layout, route state, loading/not-configured/not-found messaging, and canonical/SEO head tags.

## Export evidence to verify after release

Before removing Emdash's local render glue, verify the Greater release artifact exposes the compiled
types for both public exports:

```bash
grep -E "ArticleReader|ArticleIndexCard" \
  node_modules/@equaltoai/greater-components/dist/faces/blog/index.d.ts
```

Expected: both names are present. In a Svelte-enabled SSR test, the render smoke should also pass:

```ts
import { render } from 'svelte/server';
import { ArticleIndexCard, ArticleReader } from '@equaltoai/greater-components/faces/blog';

render(ArticleReader, { props: { article } });
render(ArticleIndexCard, { props: { article, href: `/articles/${article.slug}` } });
```
