<script lang="ts">
	import ArticleRoot from '../../src/components/Article/Root.svelte';
	import ArticleHeader from '../../src/components/Article/Header.svelte';
	import ArticleContent from '../../src/components/Article/Content.svelte';
	import ArticleFooter from '../../src/components/Article/Footer.svelte';
	import ArticleTableOfContents from '../../src/components/Article/TableOfContents.svelte';
	import ArticleReadingProgress from '../../src/components/Article/ReadingProgress.svelte';
	import ArticleShareBar from '../../src/components/Article/ShareBar.svelte';
	import ArticleRelatedPosts from '../../src/components/Article/RelatedPosts.svelte';
	import type { ArticleData, ArticleConfig } from '../../src/types.js';

	let { article, config = {} } = $props<{ article: ArticleData; config?: ArticleConfig }>();

	let relatedPosts: ArticleData[] = $derived([
		{
			id: '2',
			slug: 'related-1',
			metadata: { title: 'Related 1', description: 'Desc 1', publishedAt: new Date() },
			content: '',
			contentFormat: 'markdown',
			author: article.author,
			isPublished: true,
		},
	]);
</script>

<ArticleRoot {article} {config}>
	<ArticleReadingProgress />
	<ArticleTableOfContents />
	<ArticleHeader />
	<ArticleContent />
	<ArticleShareBar />
	<ArticleFooter />
	<ArticleRelatedPosts posts={relatedPosts} />
</ArticleRoot>
