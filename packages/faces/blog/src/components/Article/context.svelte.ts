/**
 * Article Component Context
 *
 * Provides shared state and configuration for compound Article components.
 * Uses Svelte 5's context API for passing data between Article.* components.
 *
 * @module @equaltoai/greater-components/faces/blog/Article/context
 */

import { getContext, setContext } from 'svelte';
import type {
	ArticleData,
	ArticleConfig,
	ArticleHandlers,
	ArticleContext,
	HeadingData,
} from '../../types.js';

/**
 * Article context key
 */
export const ARTICLE_CONTEXT_KEY = Symbol('article-context');

/**
 * Default article configuration
 */
export const DEFAULT_ARTICLE_CONFIG: Required<ArticleConfig> = {
	density: 'comfortable',
	showTableOfContents: true,
	showReadingProgress: true,
	showShareBar: true,
	showRelatedPosts: true,
	showAuthor: true,
	showComments: false,
	class: '',
};

/**
 * Creates and sets the article context
 */
export function createArticleContext(
	article: ArticleData,
	config: ArticleConfig = {},
	handlers: ArticleHandlers = {}
): ArticleContext {
	const state = $state({
		headings: [] as HeadingData[],
		activeHeadingId: null as string | null,
		scrollProgress: 0,
	});

	const context: ArticleContext = {
		get article() {
			return article;
		},
		get config() {
			return {
				...DEFAULT_ARTICLE_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
		get headings() {
			return state.headings;
		},
		set headings(v) {
			state.headings = v;
		},
		get activeHeadingId() {
			return state.activeHeadingId;
		},
		set activeHeadingId(v) {
			state.activeHeadingId = v;
		},
		get scrollProgress() {
			return state.scrollProgress;
		},
		set scrollProgress(v) {
			state.scrollProgress = v;
		},
	};

	setContext(ARTICLE_CONTEXT_KEY, context);
	return context;
}

/**
 * Gets the article context from a parent component
 * @throws Error if called outside of an Article.Root component
 */
export function getArticleContext(): ArticleContext {
	const context = getContext<ArticleContext>(ARTICLE_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Article context not found. Make sure this component is used within an Article.Root component.'
		);
	}
	return context;
}

/**
 * Checks if article context exists
 */
export function hasArticleContext(): boolean {
	try {
		return !!getContext<ArticleContext>(ARTICLE_CONTEXT_KEY);
	} catch {
		return false;
	}
}

/**
 * Updates the headings in the context (called by Article.Content)
 */
export function updateHeadings(context: ArticleContext, headings: HeadingData[]): void {
	(context as { headings: HeadingData[] }).headings = headings;
}

/**
 * Updates the active heading ID (called by scroll observer)
 */
export function updateActiveHeading(context: ArticleContext, headingId: string | null): void {
	(context as { activeHeadingId: string | null }).activeHeadingId = headingId;
}

/**
 * Updates the scroll progress (called by scroll observer)
 */
export function updateScrollProgress(context: ArticleContext, progress: number): void {
	(context as { scrollProgress: number }).scrollProgress = Math.max(0, Math.min(1, progress));
}

// Re-export types for convenience
export type { ArticleContext, ArticleConfig, ArticleHandlers };
