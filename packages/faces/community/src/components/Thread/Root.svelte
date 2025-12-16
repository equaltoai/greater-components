<!--
Thread.Root - Thread view container

Renders the parent post plus a comment tree with sorting.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { CommentSortOption, ThreadConfig, ThreadData, ThreadHandlers } from '../../types.js';
	import { createThreadContext } from './context.js';
	import { Post } from '../Post/index.js';
	import CommentTree from './CommentTree.svelte';

	interface Props {
		thread: ThreadData;
		config?: ThreadConfig;
		handlers?: ThreadHandlers;
		children?: Snippet;
	}

	let { thread, config = {}, handlers = {}, children }: Props = $props();

	const threadState = $state<ThreadData>(untrack(() => thread));
	const initialConfig = untrack(() => config);
	const initialHandlers = untrack(() => handlers);

	const context = createThreadContext(threadState, initialConfig, initialHandlers);

	$effect(() => {
		if (thread.post.id !== threadState.post.id) {
			Object.assign(threadState, thread);
		}
	});

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});

	const sortOptions: Array<{ id: CommentSortOption; label: string }> = [
		{ id: 'best', label: 'Best' },
		{ id: 'top', label: 'Top' },
		{ id: 'new', label: 'New' },
		{ id: 'old', label: 'Old' },
	];

	function setSort(sortBy: CommentSortOption) {
		threadState.sortBy = sortBy;
		context.handlers.onSortChange?.(sortBy);
	}

	const rootClass = $derived(['gr-community-thread-root', context.config.class].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-thread-post-id={threadState.post.id}>
	{#if children}
		{@render children?.()}
	{:else}
		<Post.Root post={threadState.post} />

		<div class="gr-community-sort" aria-label="Comment sorting">
			{#each sortOptions as option (option.id)}
				<button
					type="button"
					class="gr-community-sort__option"
					class:gr-community-sort__option--active={threadState.sortBy === option.id}
					onclick={() => setSort(option.id)}
				>
					{option.label}
				</button>
			{/each}
		</div>

		<CommentTree comments={threadState.comments} />
	{/if}
</section>

