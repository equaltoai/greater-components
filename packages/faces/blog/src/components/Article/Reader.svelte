<!--
Article.Reader - SSR-friendly complete article display component

Composes the Article compound primitives for first-app public reader pages while
keeping the lower-level Article.* pieces available for custom layouts.
-->

<script lang="ts">
	import type { ArticleConfig, ArticleHandlers, ArticleInputData } from '../../types.js';
	import { normalizeArticleData } from './normalize.js';
	import Root from './Root.svelte';
	import Header from './Header.svelte';
	import Content from './Content.svelte';
	import Footer from './Footer.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import ReadingProgress from './ReadingProgress.svelte';

	interface Props {
		/** Canonical Greater ArticleData or flat Lesser/Emdash ArticleData-shaped input. */
		article: ArticleInputData;
		/** Optional rendering configuration. Defaults are SSR-safe for public readers. */
		config?: ArticleConfig;
		/** Optional action handlers forwarded to composed Article primitives. */
		handlers?: ArticleHandlers;
	}

	let { article, config = {}, handlers = {} }: Props = $props();

	const normalizedArticle = $derived(normalizeArticleData(article));
	const readerConfig = $derived({
		showReadingProgress: false,
		showTableOfContents: false,
		showShareBar: false,
		showRelatedPosts: false,
		showAuthor: true,
		...config,
	});
</script>

<Root article={normalizedArticle} config={readerConfig} {handlers}>
	{#if readerConfig.showReadingProgress}
		<ReadingProgress />
	{/if}

	<Header />

	{#if readerConfig.showTableOfContents}
		<div class="gr-blog-article__layout">
			<TableOfContents />
			<Content />
		</div>
	{:else}
		<Content />
	{/if}

	<Footer />
</Root>
