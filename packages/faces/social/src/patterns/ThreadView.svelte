<!--
  ThreadView - Conversation Threading Component
  
  Displays a threaded conversation with proper reply structure.
  Uses generic ActivityPub types to work with any platform.
  
  @component
  @example
  ```svelte
  <ThreadView
    rootStatus={status}
    replies={childStatuses}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import type { GenericStatus } from '../generics/index.js';
	import * as Status from '../components/Status/index.js';
	import type { StatusActionHandlers } from '../components/Status/context.js';
	import ThreadNodeView from './ThreadNodeView.svelte';
	import type { ThreadNode, ThreadViewProps } from './ThreadView.types.js';
	import { untrack } from 'svelte';

	let {
		rootStatus,
		replies,
		config = {},
		handlers = {},
		renderStatus,
		renderLoading,
		renderEmpty,
	}: ThreadViewProps = $props();

	const {
		maxDepth = 10,
		showReplyLines = true,
		autoCollapseThreshold = 20,
		highlightedStatusId,
		mode = 'full',
		class: className = '',
	} = untrack(() => config);

	let collapsedThreads = $state<Set<string>>(new Set());
	let loadingMore = $state<Set<string>>(new Set());

	/**
	 * Build thread tree from flat replies list
	 */
	function buildThreadTree<T extends GenericStatus>(root: T, allReplies: T[]): ThreadNode<T> {
		const replyMap = new Map<string, T[]>();

		// Group replies by parent
		for (const reply of allReplies) {
			const parentId = reply.inReplyToId || root.id;
			if (!replyMap.has(parentId)) {
				replyMap.set(parentId, []);
			}
			replyMap.get(parentId)!.push(reply);
		}

		// Recursively build tree
		function buildNode(status: T, depth: number): ThreadNode<T> {
			const children = replyMap.get(status.id) || [];
			const childNodes = children
				.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
				.map((child) => buildNode(child, depth + 1));

			return {
				status,
				children: childNodes,
				depth,
				hasMore: status.repliesCount > children.length,
				isCollapsed: collapsedThreads.has(status.id),
			};
		}

		return buildNode(root, 0);
	}

	const threadTree = $derived(buildThreadTree(rootStatus, replies));

	const statusActionHandlers = $derived({
		onReply: handlers.onReply,
		onBoost: handlers.onBoost,
		onFavorite: handlers.onLike,
		onBookmark: handlers.onBookmark,
		onShare: handlers.onShare,
		onQuote: handlers.onQuote,
	} as StatusActionHandlers);

	/**
	 * Toggle thread collapse
	 */
	function toggleCollapse(statusId: string) {
		if (collapsedThreads.has(statusId)) {
			collapsedThreads.delete(statusId);
		} else {
			collapsedThreads.add(statusId);
		}
		handlers.onToggleCollapse?.(statusId);
	}

	/**
	 * Load more replies
	 */
	async function loadMore(statusId: string) {
		if (!handlers.onLoadMore || loadingMore.has(statusId)) return;

		loadingMore.add(statusId);
		try {
			await handlers.onLoadMore(statusId);
		} finally {
			loadingMore.delete(statusId);
		}
	}

	/**
	 * Count total replies in a thread
	 */
	function countReplies(node: ThreadNode): number {
		return node.children.reduce((sum, child) => sum + 1 + countReplies(child), 0);
	}

	/**
	 * Sync thread (Lesser-specific)
	 */
	let syncing = $state(false);
	async function syncThread() {
		if (!handlers.onSyncThread || syncing) return;

		syncing = true;
		try {
			await handlers.onSyncThread(rootStatus.id);
		} finally {
			syncing = false;
		}
	}
</script>

<div
	class={`thread-view thread-view--${mode} ${className}`}
	class:thread-view--has-lines={showReplyLines}
>
	<!-- Root status -->
	<div class="thread-view__root">
		{#if handlers.onSyncThread}
			<div class="thread-view__sync-controls">
				<button
					class="thread-view__sync-button"
					onclick={syncThread}
					disabled={syncing}
					type="button"
					title="Sync missing replies from remote instances"
				>
					{syncing ? 'Syncing...' : 'Sync Thread'}
				</button>
			</div>
		{/if}

		{#if renderStatus}
			{@render renderStatus(threadTree.status, 0)}
		{:else}
			<Status.Root status={threadTree.status} handlers={statusActionHandlers}>
				<Status.Header />
				<Status.Content />
				<Status.Media />
				<Status.Actions />
			</Status.Root>
		{/if}
	</div>

	<!-- Replies -->
	{#if threadTree.children.length > 0}
		<div class="thread-view__replies">
			{#each threadTree.children as child (child.status.id)}
				<ThreadNodeView
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
	{:else if threadTree.hasMore}
		<div class="thread-view__load-root">
			<button
				class="thread-view__load-more"
				onclick={() => loadMore(rootStatus.id)}
				disabled={loadingMore.has(rootStatus.id)}
			>
				{#if loadingMore.has(rootStatus.id)}
					{#if renderLoading}
						{@render renderLoading()}
					{:else}
						Loading replies...
					{/if}
				{:else}
					Load {rootStatus.repliesCount} {rootStatus.repliesCount === 1 ? 'reply' : 'replies'}
				{/if}
			</button>
		</div>
	{:else if renderEmpty}
		{@render renderEmpty()}
	{/if}
</div>

<style>
	:global(.thread-view) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	:global(.thread-view__root) {
		margin-bottom: 0.5rem;
	}

	:global(.thread-view__sync-controls) {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.75rem;
	}

	:global(.thread-view__sync-button) {
		padding: 0.5rem 1rem;
		background: var(--primary-color, #1d9bf0);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	:global(.thread-view__sync-button:disabled) {
		opacity: 0.6;
		cursor: not-allowed;
	}

	:global(.thread-view__sync-button:hover:not(:disabled)) {
		opacity: 0.9;
	}

	:global(.thread-view__replies) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.thread-view__reply) {
		position: relative;
		padding-left: calc(var(--depth, 0) * 1.5rem);
		transition: background-color 0.2s;
	}

	:global(.thread-view--has-lines .thread-view__reply::before) {
		content: '';
		position: absolute;
		left: calc(var(--depth, 0) * 1.5rem - 0.75rem);
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--border-color, #e1e8ed);
	}

	:global(.thread-view__reply--highlighted) {
		background-color: var(--highlight-bg, rgba(29, 161, 242, 0.1));
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	:global(.thread-view__reply--deep) {
		opacity: 0.8;
	}

	:global(.thread-view__status) {
		position: relative;
	}

	:global(.thread-view__children) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	:global(.thread-view__continue),
	:global(.thread-view__expand),
	:global(.thread-view__load-more) {
		padding: 0.5rem 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.thread-view__continue:hover),
	:global(.thread-view__expand:hover),
	:global(.thread-view__load-more:hover) {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--border-hover, #cfd9de);
	}

	:global(.thread-view__continue:disabled),
	:global(.thread-view__load-more:disabled) {
		opacity: 0.6;
		cursor: not-allowed;
	}

	:global(.thread-view__expand-icon),
	:global(.thread-view__collapse-icon) {
		font-size: 0.75rem;
		transition: transform 0.2s;
	}

	:global(.thread-view__collapse) {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s;
	}

	:global(.thread-view__status:hover .thread-view__collapse) {
		opacity: 1;
	}

	:global(.thread-view__reply-count) {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	:global(.thread-view__load-root) {
		margin-top: 1rem;
	}

	/* Compact mode */
	:global(.thread-view--compact .thread-view__reply) {
		padding-left: calc(var(--depth, 0) * 1rem);
	}

	:global(.thread-view--compact .thread-view__status) {
		font-size: 0.875rem;
	}

	/* Minimal mode */
	:global(.thread-view--minimal .thread-view__reply) {
		padding-left: calc(var(--depth, 0) * 0.5rem);
	}

	:global(.thread-view--minimal.thread-view--has-lines .thread-view__reply::before) {
		display: none;
	}
</style>
