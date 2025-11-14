<script lang="ts">
	import ThreadNodeViewRecursive from './ThreadNodeView.svelte';
	import type { Snippet } from 'svelte';
	import type { GenericStatus } from '../generics/index.js';
	import * as Status from '../components/Status/index.js';
	import type { StatusActionHandlers } from '../components/Status/context.js';
	import type { ThreadNode, ThreadViewHandlers } from './ThreadView.types.js';

	interface Props<T extends GenericStatus = GenericStatus> {
		node: ThreadNode<T>;
		handlers: ThreadViewHandlers<T>;
		renderStatus?: Snippet<[T, number]>;
		renderLoading?: Snippet;
		loadMore: (statusId: string) => Promise<void> | void;
		toggleCollapse: (statusId: string) => void;
		loadingMore: Set<string>;
		countReplies: (node: ThreadNode<T>) => number;
		highlightedStatusId?: string;
		maxDepth: number;
		autoCollapseThreshold: number;
	}

	let {
		node,
		handlers,
		renderStatus,
		renderLoading,
		loadMore,
		toggleCollapse,
		loadingMore,
		countReplies,
		highlightedStatusId,
		maxDepth,
		autoCollapseThreshold,
	}: Props = $props();

	const replyCount = $derived(countReplies(node));
	const isHighlighted = $derived(node.status.id === highlightedStatusId);
	const isTooDeep = $derived(node.depth > maxDepth);
	const isAutoCollapsed = $derived(autoCollapseThreshold > 0 && replyCount > autoCollapseThreshold);
	const isCollapsed = $derived(node.isCollapsed || isAutoCollapsed);
	const isLoadingMore = $derived(loadingMore.has(node.status.id));

	const statusActionHandlers = $derived({
		onReply: handlers.onReply,
		onBoost: handlers.onBoost,
		onFavorite: handlers.onLike,
		onBookmark: handlers.onBookmark,
		onShare: handlers.onShare,
		onQuote: handlers.onQuote,
	} as StatusActionHandlers);
</script>

<div
	class="thread-view__reply"
	class:thread-view__reply--highlighted={isHighlighted}
	class:thread-view__reply--deep={isTooDeep}
	class:thread-view__reply--collapsed={isCollapsed}
	style={`--depth: ${node.depth}`}
>
	{#if isTooDeep}
		<button class="thread-view__continue" onclick={() => handlers.onNavigate?.(node.status.id)}>
			Continue thread ({replyCount}
			{replyCount === 1 ? 'reply' : 'replies'})
		</button>
	{:else if isCollapsed}
		<button class="thread-view__expand" onclick={() => toggleCollapse(node.status.id)}>
			<span class="thread-view__expand-icon">▶</span>
			{node.status.account?.name ?? 'Account'} replied
			{#if node.children.length > 0}
				<span class="thread-view__reply-count">
					({replyCount} more {replyCount === 1 ? 'reply' : 'replies'})
				</span>
			{/if}
		</button>
	{:else}
		<div class="thread-view__status">
			{#if renderStatus}
				{@render renderStatus(node.status, node.depth)}
			{:else}
				<Status.Root status={node.status} handlers={statusActionHandlers}>
					<Status.Header />
					<Status.Content />
					<Status.Media />
					<Status.Actions />
				</Status.Root>
			{/if}

			{#if node.hasMore}
				<button
					class="thread-view__load-more"
					onclick={() => loadMore(node.status.id)}
					disabled={isLoadingMore}
				>
					{#if isLoadingMore}
						{#if renderLoading}
							{@render renderLoading()}
						{:else}
							Loading more replies...
						{/if}
					{:else}
						Load more replies
					{/if}
				</button>
			{/if}

			{#if node.children.length > 0}
				<button
					class="thread-view__collapse"
					onclick={() => toggleCollapse(node.status.id)}
					title="Collapse thread"
				>
					<span class="thread-view__collapse-icon">▼</span>
				</button>
			{/if}
		</div>

		{#if node.children.length > 0}
			<div class="thread-view__children">
				{#each node.children as child (child.status.id)}
					<ThreadNodeViewRecursive
						node={child}
						{handlers}
						{renderStatus}
						{renderLoading}
						{loadMore}
						{toggleCollapse}
						{loadingMore}
						{countReplies}
						{highlightedStatusId}
						{maxDepth}
						{autoCollapseThreshold}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</div>
