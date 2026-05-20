<!--
Article.Header - Article header with title, metadata, and featured image

@component
-->

<script lang="ts">
	import { getArticleContext } from './context.js';
	import { formatArticleDateTime } from './date.js';

	const context = getArticleContext();
	const article = $derived(context.article);
	const metadata = $derived(article.metadata);
	const publishedDate = $derived(formatArticleDateTime(metadata.publishedAt));
</script>

<header class="gr-blog-article__header">
	{#if metadata.featuredImage}
		<figure class="gr-blog-featured-image">
			<img
				src={metadata.featuredImage}
				alt={metadata.featuredImageAlt || metadata.title}
				class="gr-blog-featured-image__img"
				loading="eager"
			/>
			{#if metadata.featuredImageCaption}
				<figcaption class="gr-blog-featured-image__caption">
					{metadata.featuredImageCaption}
				</figcaption>
			{/if}
		</figure>
	{/if}

	<h1 class="gr-blog-article__title">{metadata.title}</h1>

	{#if metadata.subtitle}
		<p class="gr-blog-article__subtitle">{metadata.subtitle}</p>
	{/if}

	<div class="gr-blog-article__meta">
		{#if publishedDate.label}
			<time datetime={publishedDate.iso}>
				{publishedDate.label}
			</time>
		{/if}

		{#if metadata.readingTime}
			<span class="gr-blog-article__reading-time">
				{metadata.readingTime} min read
			</span>
		{/if}

		{#if metadata.category}
			<span class="gr-blog-article__category">{metadata.category}</span>
		{/if}
	</div>
</header>
