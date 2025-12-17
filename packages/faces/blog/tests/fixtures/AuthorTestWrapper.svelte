<script lang="ts">
	import { Author } from '../../src/components/Author/index.js';
	import type { AuthorData } from '../../src/types.js';
	import { createMockAuthor } from '../mocks/mockAuthor.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		author?: AuthorData;
		showBio?: boolean;
		showSocial?: boolean;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		author = createMockAuthor('test-1'),
		showBio = true,
		showSocial = true,
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Author.Root {author} {showBio} {showSocial}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Author.Root>
