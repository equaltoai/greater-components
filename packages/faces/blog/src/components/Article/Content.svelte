<!--
Article.Content - Renders article body content with proper typography

@component
-->

<script lang="ts">
	import { getArticleContext, updateHeadings } from './context.js';
	import { onMount } from 'svelte';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import type { HeadingData } from '../../types.js';

	const context = getArticleContext();
	const article = $derived(context.article);

	let contentElement: HTMLElement;

	const sanitizedContent = $derived.by(() =>
		article.contentFormat === 'html' ? sanitizeHtml(article.content).trim() : ''
	);

	// Extract headings for table of contents
	onMount(() => {
		if (contentElement) {
			const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
			const headings: HeadingData[] = [];

			headingElements.forEach((el, index) => {
				const id = el.id || `heading-${index}`;
				if (!el.id) {
					el.id = id;
				}
				headings.push({
					id,
					text: el.textContent || '',
					level: parseInt(el.tagName.charAt(1), 10),
				});
			});

			updateHeadings(context, headings);
		}
	});
</script>

<div class="gr-blog-article__content" bind:this={contentElement}>
	{#if article.contentFormat === 'html'}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html sanitizedContent}
	{:else}
		<!-- Markdown content would be rendered here -->
		<p>{article.content}</p>
	{/if}
</div>
