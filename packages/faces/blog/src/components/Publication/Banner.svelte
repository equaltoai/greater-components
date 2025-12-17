<!--
Publication.Banner - Publication branding banner

@component
@example
```svelte
<Publication.Root publication={publication}>
  <Publication.Banner />
</Publication.Root>
```
-->

<script lang="ts">
	import { getPublicationContext } from './context.js';

	const { publication, config } = getPublicationContext();
</script>

<header class="gr-blog-publication-banner">
	<div class="gr-blog-publication-banner__brand">
		{#if publication.logo}
			<img
				class="gr-blog-publication-banner__logo"
				src={publication.logo}
				alt={`${publication.name} logo`}
			/>
		{/if}
		<span class="gr-blog-publication-banner__name">{publication.name}</span>
	</div>

	{#if config.showSubscriberCount && publication.subscriberCount !== undefined}
		<span class="gr-blog-publication-banner__subscribers">
			{publication.subscriberCount.toLocaleString()} subscribers
		</span>
	{/if}
</header>
