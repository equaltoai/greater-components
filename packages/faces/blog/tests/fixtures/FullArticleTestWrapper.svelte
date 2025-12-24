<script lang="ts">
	import { Article } from '../../src/components/Article/index.js';
	import type { ArticleData, ArticleConfig, ArticleHandlers } from '../../src/types.js';
	import { createMockArticle } from '../mocks/mockArticle.js';

	interface Props {
		article?: ArticleData;
		config?: ArticleConfig;
		handlers?: ArticleHandlers;
	}

	let { article = createMockArticle('test-1'), config = {}, handlers = {} }: Props = $props();

	const mockRelatedPosts = [
		createMockArticle('related-1', {
			metadata: { title: 'Related 1', description: 'Desc 1', publishedAt: new Date() },
		}),
		createMockArticle('related-2', {
			metadata: { title: 'Related 2', description: 'Desc 2', publishedAt: new Date() },
		}),
	];
</script>

<Article.Root {article} {config} {handlers}>
	<Article.Header />
	<Article.Content />
	<Article.ReadingProgress />
	<Article.ShareBar />
	<Article.Footer />
	<Article.RelatedPosts posts={mockRelatedPosts} />
</Article.Root>
