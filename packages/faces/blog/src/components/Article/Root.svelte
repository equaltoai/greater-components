<!--
Article.Root - Container component for Article compound components

Provides context for child components and handles root-level layout.

@component
@example
```svelte
<Article.Root article={post} config={{ density: 'comfortable' }}>
  <Article.Header />
  <Article.Content />
  <Article.Footer />
</Article.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArticleData, ArticleConfig, ArticleHandlers } from '../../types.js';
	import { createArticleContext } from './context.js';
	import { untrack } from 'svelte';

	interface Props {
		/**
		 * Article data to display
		 */
		article: ArticleData;

		/**
		 * Configuration options
		 */
		config?: ArticleConfig;

		/**
		 * Action handlers
		 */
		handlers?: ArticleHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { article, config = {}, handlers = {}, children }: Props = $props();

	const initialArticle = untrack(() => article);
	const initialConfig = untrack(() => config);
	const initialHandlers = untrack(() => handlers);

	// Create context for child components
	createArticleContext(initialArticle, initialConfig, initialHandlers);

	// Compute CSS classes
	const rootClass = $derived(
		[
			'gr-blog-article',
			config.density === 'compact' && 'gr-blog-article--compact',
			config.density === 'spacious' && 'gr-blog-article--spacious',
			config.class,
			// Dynamically add classes based on article tags
			...(article.metadata.tags || []).map((tag) => `gr-blog-article--tag-${tag.toLowerCase()}`),
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<article class={rootClass} data-article-id={article.id}>
	{@render children?.()}
</article>
