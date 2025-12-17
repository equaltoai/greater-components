<script lang="ts">
	import { Article } from '../../src/components/Article/index.js';
	import type { ArticleData, ArticleConfig, ArticleHandlers } from '../../src/types.js';
	import { createMockArticle } from '../mocks/mockArticle.js';

	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		article?: ArticleData;
		config?: ArticleConfig;
		handlers?: ArticleHandlers;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		article = createMockArticle('test-1'),
		config = {},
		handlers = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Article.Root {article} {config} {handlers}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Article.Root>
