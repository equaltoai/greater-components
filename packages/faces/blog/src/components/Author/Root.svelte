<!--
Author.Root - Container component for Author compound components

Provides context for child components and handles root-level layout.

@component
@example
```svelte
<script>
  import { Author } from '@equaltoai/greater-components/faces/blog';
</script>

<Author.Root author={author}>
  <Author.Card />
</Author.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { AuthorData } from '../../types.js';
	import { createAuthorContext } from './context.js';
	import Card from './Card.svelte';

	interface Props {
		author: AuthorData;
		showBio?: boolean;
		showSocial?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		author,
		showBio = true,
		showSocial = true,
		class: className = '',
		children,
	}: Props = $props();

	const initialAuthor = untrack(() => author);
	const initialShowBio = untrack(() => showBio);
	const initialShowSocial = untrack(() => showSocial);

	createAuthorContext(initialAuthor, initialShowBio, initialShowSocial);
</script>

<section class={className} data-author-id={author.id}>
	{#if children}
		{@render children?.()}
	{:else}
		<Card />
	{/if}
</section>

