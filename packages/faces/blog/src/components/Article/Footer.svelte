<!--
Article.Footer - Article footer with author card and tags

@component
-->

<script lang="ts">
	import { getArticleContext } from './context.js';

	const context = getArticleContext();
	const article = $derived(context.article);
	const author = $derived(article.author);
	const tags = $derived(article.metadata.tags || []);
	const showAuthor = $derived(context.config.showAuthor);
</script>

<footer class="gr-blog-article__footer">
	{#if tags.length > 0}
		<div class="gr-blog-article__tags">
			{#each tags as tag (tag)}
				<a href={`/tags/${tag}`} class="gr-blog-tag-cloud__tag">
					{tag}
				</a>
			{/each}
		</div>
	{/if}

	{#if showAuthor && author}
		<div class="gr-blog-author-card">
			{#if author.avatar}
				<img src={author.avatar} alt={author.name} class="gr-blog-author-card__avatar" />
			{/if}
			<div class="gr-blog-author-card__info">
				<div class="gr-blog-author-card__name">{author.name}</div>
				{#if author.bio}
					<p class="gr-blog-author-card__bio">{author.bio}</p>
				{/if}
			</div>
		</div>
	{/if}
</footer>
