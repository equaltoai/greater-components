/**
 * Article Compound Component
 *
 * A flexible, composable article component for displaying long-form blog content.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
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
 * @module @equaltoai/greater-components/faces/blog/Article
 */

// Placeholder exports - components to be implemented
export { default as Root } from './Root.svelte';
export { default as Header } from './Header.svelte';
export { default as Content } from './Content.svelte';
export { default as Footer } from './Footer.svelte';
export { default as TableOfContents } from './TableOfContents.svelte';
export { default as ReadingProgress } from './ReadingProgress.svelte';
export { default as ShareBar } from './ShareBar.svelte';
export { default as RelatedPosts } from './RelatedPosts.svelte';

// Export types
export type { ArticleContext, ArticleConfig, ArticleHandlers } from './context.js';

/**
 * Article compound component
 */
export const Article = {
	Root: {} as typeof import('./Root.svelte').default,
	Header: {} as typeof import('./Header.svelte').default,
	Content: {} as typeof import('./Content.svelte').default,
	Footer: {} as typeof import('./Footer.svelte').default,
	TableOfContents: {} as typeof import('./TableOfContents.svelte').default,
	ReadingProgress: {} as typeof import('./ReadingProgress.svelte').default,
	ShareBar: {} as typeof import('./ShareBar.svelte').default,
	RelatedPosts: {} as typeof import('./RelatedPosts.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Header from './Header.svelte';
import Content from './Content.svelte';
import Footer from './Footer.svelte';
import TableOfContents from './TableOfContents.svelte';
import ReadingProgress from './ReadingProgress.svelte';
import ShareBar from './ShareBar.svelte';
import RelatedPosts from './RelatedPosts.svelte';

Article.Root = Root;
Article.Header = Header;
Article.Content = Content;
Article.Footer = Footer;
Article.TableOfContents = TableOfContents;
Article.ReadingProgress = ReadingProgress;
Article.ShareBar = ShareBar;
Article.RelatedPosts = RelatedPosts;
