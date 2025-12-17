<!--
Publication.Root - Container component for Publication compound components

Provides context for child components and handles root-level layout.

@component
@example
```svelte
<script>
  import { Publication } from '@equaltoai/greater-components/faces/blog';
</script>

<Publication.Root publication={publication}>
  <Publication.Banner />
  <Publication.NewsletterSignup onSubscribe={(email) => api.subscribe(email)} />
</Publication.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { PublicationConfig, PublicationData } from '../../types.js';
	import { createPublicationContext } from './context.js';
	import Banner from './Banner.svelte';
	import NewsletterSignup from './NewsletterSignup.svelte';

	interface Props {
		publication: PublicationData;
		config?: PublicationConfig;
		children?: Snippet;
	}

	let { publication, config = {}, children }: Props = $props();

	const initialPublication = untrack(() => publication);
	const initialConfig = untrack(() => config);

	const context = createPublicationContext(initialPublication, initialConfig);
</script>

<section class={context.config.class} data-publication-id={publication.id}>
	{#if children}
		{@render children?.()}
	{:else}
		{#if context.config.showBanner}
			<Banner />
		{/if}
		{#if context.config.showNewsletter}
			<NewsletterSignup />
		{/if}
	{/if}
</section>
