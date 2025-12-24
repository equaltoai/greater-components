<script lang="ts">
	import { Article } from '../../src/components/Article/index.js';
	import type { ArticleData, ArticleHandlers } from '../../src/types.js';

	let { article, handlers }: { article: ArticleData; handlers?: ArticleHandlers } = $props();
</script>

<Article.Root {article} {handlers}>
	<Article.Content />
	<Article.TableOfContents />
</Article.Root>
