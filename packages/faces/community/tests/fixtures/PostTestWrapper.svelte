<script lang="ts">
	import { Post } from '../../src/components/Post/index.js';
	import type { PostData, PostConfig, PostHandlers } from '../../src/types.js';
	import { createMockPost } from '../mocks/mockPost.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		post?: PostData;
		config?: PostConfig;
		handlers?: PostHandlers;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		post = createMockPost('test-1'),
		config = {},
		handlers = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Post.Root {post} {config} {handlers}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Post.Root>
