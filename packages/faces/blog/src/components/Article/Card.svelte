<!--
Article.Card - SSR-friendly article index card

Designed for article index/list routes that need a single accessible link to a
canonical Article reader page.
-->

<script lang="ts">
	import { formatDateTime } from '@equaltoai/greater-components-utils';
	import type { ArticleInputData } from '../../types.js';
	import { normalizeArticleData } from './normalize.js';

	interface Props {
		/** Canonical Greater ArticleData or flat Lesser/Emdash ArticleData-shaped input. */
		article: ArticleInputData;
		/** Link target for the article. Defaults to `/articles/{slug}`. */
		href?: string;
		/** Heading level for the card title. */
		headingLevel?: 2 | 3 | 4;
		/** Show the article description/subtitle excerpt. */
		showExcerpt?: boolean;
		/** Show author name in card metadata. */
		showAuthor?: boolean;
		/** Show published date in card metadata. */
		showPublishedAt?: boolean;
		/** Show reading-time metadata when available. */
		showReadingTime?: boolean;
		/** Show article tags/categories. */
		showTags?: boolean;
		/** Maximum number of tags/categories to display. */
		maxTags?: number;
		/** Custom CSS class. */
		class?: string;
	}

	let {
		article,
		href,
		headingLevel = 2,
		showExcerpt = true,
		showAuthor = true,
		showPublishedAt = true,
		showReadingTime = true,
		showTags = true,
		maxTags = 3,
		class: className = '',
	}: Props = $props();

	const normalizedArticle = $derived(normalizeArticleData(article));
	const metadata = $derived(normalizedArticle.metadata);
	const articleHref = $derived(href ?? `/articles/${normalizedArticle.slug}`);
	const titleId = $derived(`gr-blog-article-card-title-${normalizedArticle.id}`);
	const excerpt = $derived(metadata.description || metadata.subtitle || '');
	const tags = $derived((metadata.tags ?? []).slice(0, maxTags));
	const cardClass = $derived(['gr-blog-article-card', className].filter(Boolean).join(' '));
	const headingTag = $derived(`h${headingLevel}` as 'h2' | 'h3' | 'h4');
	const publishedIso = $derived(toIso(metadata.publishedAt));
	const publishedLabel = $derived(formatDate(metadata.publishedAt));
	const metaItems = $derived.by(() => {
		const items: Array<{ label: string; datetime?: string }> = [];
		if (showPublishedAt && publishedLabel) {
			items.push({ label: publishedLabel, datetime: publishedIso });
		}
		if (showAuthor) {
			items.push({ label: normalizedArticle.author.name });
		}
		if (showReadingTime && metadata.readingTime) {
			items.push({ label: `${metadata.readingTime} min read` });
		}
		return items;
	});

	function toIso(value: Date | string): string | undefined {
		const date = value instanceof Date ? value : new Date(value);
		return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
	}

	function formatDate(value: Date | string): string {
		try {
			return formatDateTime(value);
		} catch {
			return String(value);
		}
	}
</script>

<article class={cardClass} aria-labelledby={titleId} data-article-id={normalizedArticle.id}>
	<a class="gr-blog-article-card__link" href={articleHref}>
		{#if metadata.featuredImage}
			<img
				class="gr-blog-article-card__image"
				src={metadata.featuredImage}
				alt={metadata.featuredImageAlt ?? ''}
				loading="lazy"
			/>
		{/if}

		<div class="gr-blog-article-card__body">
			{#if metaItems.length > 0}
				<p class="gr-blog-article-card__meta">
					{#each metaItems as item, index (`${item.label}-${index}`)}
						{#if index > 0}
							<span class="gr-blog-article-card__separator" aria-hidden="true">·</span>
						{/if}
						{#if item.datetime}
							<time datetime={item.datetime}>{item.label}</time>
						{:else}
							<span>{item.label}</span>
						{/if}
					{/each}
				</p>
			{/if}

			<svelte:element this={headingTag} id={titleId} class="gr-blog-article-card__title">
				{metadata.title}
			</svelte:element>

			{#if metadata.subtitle}
				<p class="gr-blog-article-card__subtitle">{metadata.subtitle}</p>
			{/if}

			{#if showExcerpt && excerpt}
				<p class="gr-blog-article-card__excerpt">{excerpt}</p>
			{/if}

			{#if showTags && tags.length > 0}
				<ul class="gr-blog-article-card__tags" aria-label="Article tags">
					{#each tags as tag (tag)}
						<li class="gr-blog-article-card__tag">{tag}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</a>
</article>
