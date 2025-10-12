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
	import type { Snippet } from 'svelte';
	import type { GenericStatus } from '../generics/index.js';
	import * as Status from '../components/Status/index.js';

	interface ThreadNode<T extends GenericStatus = GenericStatus> {
		status: T;
		children: ThreadNode<T>[];
		depth: number;
		hasMore?: boolean;
		isCollapsed?: boolean;
	}

	interface ThreadViewConfig {
		/**
		 * Maximum depth to display (deeper threads are collapsed)
		 */
		maxDepth?: number;

		/**
		 * Show reply indicators
		 */
		showReplyLines?: boolean;

		/**
		 * Collapse threads with many replies
		 */
		autoCollapseThreshold?: number;

		/**
		 * Highlight the focused status
		 */
		highlightedStatusId?: string;

		/**
		 * Display mode
		 */
		mode?: 'full' | 'compact' | 'minimal';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	interface ThreadViewHandlers<T extends GenericStatus = GenericStatus> {
		/**
		 * Load more replies for a status
		 */
		onLoadMore?: (statusId: string) => Promise<T[]>;

		/**
		 * Expand/collapse a thread
		 */
		onToggleCollapse?: (statusId: string) => void;

		/**
		 * Navigate to a status
		 */
		onNavigate?: (statusId: string) => void;

		/**
		 * Action handlers from Status component
		 */
		onLike?: (status: T) => void;
		onBoost?: (status: T) => void;
		onReply?: (status: T) => void;
		onBookmark?: (status: T) => void;
		onShare?: (status: T) => void;
	}

	interface Props<T extends GenericStatus = GenericStatus> {
		/**
		 * Root status of the thread
		 */
		rootStatus: T;

		/**
		 * All replies (will be organized into tree)
		 */
		replies: T[];

		/**
		 * Configuration
		 */
		config?: ThreadViewConfig;

		/**
		 * Event handlers
		 */
		handlers?: ThreadViewHandlers<T>;

		/**
		 * Custom status renderer (optional)
		 */
		renderStatus?: Snippet<[T, number]>;

		/**
		 * Custom loading indicator
		 */
		renderLoading?: Snippet;

		/**
		 * Custom empty state
		 */
		renderEmpty?: Snippet;
	}

	let {
		rootStatus,
		replies,
		config = {},
		handlers = {},
		renderStatus,
		renderLoading,
		renderEmpty,
	}: Props = $props();

	const {
		maxDepth = 10,
		showReplyLines = true,
		autoCollapseThreshold = 20,
		highlightedStatusId,
		mode = 'full',
		class: className = '',
	} = config;

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
	 * Check if thread should be auto-collapsed
	 */
	function shouldAutoCollapse(node: ThreadNode): boolean {
		if (!autoCollapseThreshold) return false;
		const totalReplies = countReplies(node);
		return totalReplies > autoCollapseThreshold;
	}

	/**
	 * Count total replies in a thread
	 */
	function countReplies(node: ThreadNode): number {
		return node.children.reduce((sum, child) => sum + 1 + countReplies(child), 0);
	}

	/**
	 * Render a thread node recursively
	 */
	function renderNode(node: ThreadNode) {
		const isHighlighted = node.status.id === highlightedStatusId;
		const isTooDeep = node.depth > maxDepth;
		const isCollapsed = node.isCollapsed || shouldAutoCollapse(node);

		return { node, isHighlighted, isTooDeep, isCollapsed };
	}
</script>

<div
	class="thread-view thread-view--{mode} {className}"
	class:thread-view--has-lines={showReplyLines}
>
	<!-- Root status -->
	<div class="thread-view__root">
		{#if renderStatus}
			{@render renderStatus(threadTree.status, 0)}
		{:else}
			<Status.Root status={threadTree.status} {handlers}>
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
			{#each threadTree.children as child}
				{@const { node, isHighlighted, isTooDeep, isCollapsed } = renderNode(child)}

				<div
					class="thread-view__reply"
					class:thread-view__reply--highlighted={isHighlighted}
					class:thread-view__reply--deep={isTooDeep}
					class:thread-view__reply--collapsed={isCollapsed}
					style="--depth: {node.depth}"
				>
					{#if isTooDeep}
						<!-- Show "Continue thread" button for deep threads -->
						<button
							class="thread-view__continue"
							onclick={() => handlers.onNavigate?.(node.status.id)}
						>
							Continue thread ({countReplies(node)}
							{countReplies(node) === 1 ? 'reply' : 'replies'})
						</button>
					{:else if isCollapsed}
						<!-- Show collapsed thread indicator -->
						<button class="thread-view__expand" onclick={() => toggleCollapse(node.status.id)}>
							<span class="thread-view__expand-icon">▶</span>
							{node.status.account.name} replied
							{#if node.children.length > 0}
								<span class="thread-view__reply-count">
									({countReplies(node)} more {countReplies(node) === 1 ? 'reply' : 'replies'})
								</span>
							{/if}
						</button>
					{:else}
						<!-- Render status -->
						<div class="thread-view__status">
							{#if renderStatus}
								{@render renderStatus(node.status, node.depth)}
							{:else}
								<Status.Root status={node.status} {handlers}>
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
									disabled={loadingMore.has(node.status.id)}
								>
									{#if loadingMore.has(node.status.id)}
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

						<!-- Render children recursively -->
						{#if node.children.length > 0}
							<div class="thread-view__children">
								{#each node.children as grandchild}
									<svelte:self
										rootStatus={grandchild.status}
										replies={[]}
										{config}
										{handlers}
										{renderStatus}
										{renderLoading}
										{renderEmpty}
									/>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
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
	.thread-view {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	.thread-view__root {
		margin-bottom: 0.5rem;
	}

	.thread-view__replies {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.thread-view__reply {
		position: relative;
		padding-left: calc(var(--depth, 0) * 1.5rem);
		transition: background-color 0.2s;
	}

	.thread-view--has-lines .thread-view__reply::before {
		content: '';
		position: absolute;
		left: calc(var(--depth, 0) * 1.5rem - 0.75rem);
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--border-color, #e1e8ed);
	}

	.thread-view__reply--highlighted {
		background-color: var(--highlight-bg, rgba(29, 161, 242, 0.1));
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	.thread-view__reply--deep {
		opacity: 0.8;
	}

	.thread-view__status {
		position: relative;
	}

	.thread-view__children {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.thread-view__continue,
	.thread-view__expand,
	.thread-view__load-more {
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

	.thread-view__continue:hover,
	.thread-view__expand:hover,
	.thread-view__load-more:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--border-hover, #cfd9de);
	}

	.thread-view__continue:disabled,
	.thread-view__load-more:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.thread-view__expand-icon,
	.thread-view__collapse-icon {
		font-size: 0.75rem;
		transition: transform 0.2s;
	}

	.thread-view__collapse {
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

	.thread-view__status:hover .thread-view__collapse {
		opacity: 1;
	}

	.thread-view__reply-count {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.thread-view__load-root {
		margin-top: 1rem;
	}

	/* Compact mode */
	.thread-view--compact .thread-view__reply {
		padding-left: calc(var(--depth, 0) * 1rem);
	}

	.thread-view--compact .thread-view__status {
		font-size: 0.875rem;
	}

	/* Minimal mode */
	.thread-view--minimal .thread-view__reply {
		padding-left: calc(var(--depth, 0) * 0.5rem);
	}

	.thread-view--minimal .thread-view--has-lines .thread-view__reply::before {
		display: none;
	}
</style>
