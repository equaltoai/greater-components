<script lang="ts">
	import { Thread } from '../../src/components/Thread/index.js';
	import type { ThreadData, ThreadConfig, ThreadHandlers } from '../../src/types.js';
	import { createMockPost, createMockCommentTree } from '../mocks/index.js';
	import type { Component as SvelteComponent, Snippet } from 'svelte';

	interface Props {
		thread?: ThreadData;
		config?: ThreadConfig;
		handlers?: ThreadHandlers;
		component?: SvelteComponent<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	const defaultThread: ThreadData = {
		post: createMockPost('t1'),
		comments: createMockCommentTree(),
		totalComments: 10,
		sortBy: 'best',
	};

	let {
		thread = defaultThread,
		config = {},
		handlers = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Thread.Root {thread} {config} {handlers}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Thread.Root>
