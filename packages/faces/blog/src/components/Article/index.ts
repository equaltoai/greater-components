/**
 * Article Compound Component
 *
 * A flexible, composable article component for displaying long-form blog content.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * Complete display helpers (`ArticleReader`, `ArticleCard`, and `ArticleIndexCard`)
 * are SSR-friendly entry points for first-app reader/index pages that do not need
 * to compose the lower-level primitives manually.
 *
 * @example Basic compound usage
 * ```svelte
 * <script>
 *   import { Article } from '@equaltoai/greater-components/faces/blog';
 * </script>
 *
 * <Article.Root article={post}>
 *   <Article.Header />
 *   <Article.Content />
 *   <Article.Footer />
 * </Article.Root>
 * ```
 *
 * @example Complete SSR reader usage
 * ```svelte
 * <script>
 *   import { ArticleReader, ArticleIndexCard } from '@equaltoai/greater-components/faces/blog';
 * </script>
 *
 * <ArticleReader article={post} />
 * <ArticleIndexCard article={post} />
 * ```
 *
 * @module @equaltoai/greater-components/faces/blog/Article
 */

import Root from './Root.svelte';
import Header from './Header.svelte';
import Content from './Content.svelte';
import Footer from './Footer.svelte';
import TableOfContents from './TableOfContents.svelte';
import ReadingProgress from './ReadingProgress.svelte';
import ShareBar from './ShareBar.svelte';
import RelatedPosts from './RelatedPosts.svelte';
import Reader from './Reader.svelte';
import Card from './Card.svelte';

export { default as Root } from './Root.svelte';
export { default as Header } from './Header.svelte';
export { default as Content } from './Content.svelte';
export { default as Footer } from './Footer.svelte';
export { default as TableOfContents } from './TableOfContents.svelte';
export { default as ReadingProgress } from './ReadingProgress.svelte';
export { default as ShareBar } from './ShareBar.svelte';
export { default as RelatedPosts } from './RelatedPosts.svelte';
export { default as Reader } from './Reader.svelte';
export { default as Card } from './Card.svelte';
export { default as ArticleReader } from './Reader.svelte';
export { default as ArticleCard } from './Card.svelte';
export { default as ArticleIndexCard } from './Card.svelte';
export { normalizeArticleData } from './normalize.js';

// Export types
export type { ArticleContext, ArticleConfig, ArticleHandlers } from './context.js';

/**
 * Article compound component
 */
export const Article = {
	Root,
	Header,
	Content,
	Footer,
	TableOfContents,
	ReadingProgress,
	ShareBar,
	RelatedPosts,
	Reader,
	Card,
	IndexCard: Card,
};
