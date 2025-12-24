<!--
Author.Card - Author bio card

Renders an author card optimized for blog contexts.

@component
@example
```svelte
<Author.Root author={author}>
  <Author.Card />
</Author.Root>
```
-->

<script lang="ts">
	import { getAuthorContext } from './context.js';

	const { author, showBio, showSocial } = getAuthorContext();

	const bioText = author.shortBio || author.bio;
	const socialLinks = author.socialLinks ?? {};
	const socialEntries = Object.entries(socialLinks).filter(([, value]) => !!value);
</script>

<div class="gr-blog-author-card">
	{#if author.avatar}
		<img class="gr-blog-author-card__avatar" src={author.avatar} alt={`${author.name} avatar`} />
	{:else}
		<div class="gr-blog-author-card__avatar" aria-hidden="true"></div>
	{/if}

	<div class="gr-blog-author-card__info">
		<div class="gr-blog-author-card__name">{author.name}</div>

		{#if showBio && bioText}
			<div class="gr-blog-author-card__bio">{bioText}</div>
		{/if}

		{#if showSocial && socialEntries.length > 0}
			<div class="gr-blog-author-card__links">
				{#each socialEntries as [key, href] (key)}
					<a class="gr-blog-author-card__link" {href} rel="me noopener noreferrer" target="_blank">
						{key}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
