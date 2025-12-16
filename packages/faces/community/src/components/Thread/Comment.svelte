<!--
Thread.Comment - Single comment with nesting support
-->

<script lang="ts">
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import type { CommentData, VoteDirection } from '../../types.js';
	import { getThreadContext } from './context.js';
	import { Voting } from '../Voting/index.js';
	import { Flair } from '../Flair/index.js';

	interface Props {
		comment: CommentData;
	}

	let { comment }: Props = $props();

	const { config, handlers } = getThreadContext();

	const depthClass = $derived(comment.depth === 0 ? 'gr-community-comment--depth-0' : '');
	const collapsedClass = $derived(comment.isCollapsed ? 'gr-community-comment--collapsed' : '');
	const opClass = $derived(config.highlightOp && comment.isOp ? 'gr-community-comment--op' : '');
	const modClass = $derived(comment.isMod ? 'gr-community-comment--mod' : '');

	const commentClass = $derived(
		['gr-community-comment', depthClass, collapsedClass, opClass, modClass].filter(Boolean).join(' ')
	);

	function toggleCollapse() {
		if (handlers.onToggleCollapse) {
			handlers.onToggleCollapse(comment.id);
			return;
		}
		comment.isCollapsed = !comment.isCollapsed;
	}

	async function setVote(direction: VoteDirection) {
		if (!config.showVoting) return;

		const previousVote = comment.userVote ?? 0;
		const previousScore = comment.score;

		const nextVote = previousVote === direction ? 0 : direction;
		comment.userVote = nextVote;
		comment.score = previousScore + (nextVote - previousVote);

		try {
			await handlers.onVote?.(comment.id, nextVote);
		} catch {
			comment.userVote = previousVote;
			comment.score = previousScore;
		}
	}

	async function loadMore() {
		if (!handlers.onLoadMore) return;
		const more = await handlers.onLoadMore(comment.id);
		if (!more || more.length === 0) return;
		comment.children = [...(comment.children ?? []), ...more];
		comment.moreChildrenCount = 0;
	}

	const authorFlair = $derived(config.showFlairs ? comment.authorFlair : undefined);
	const createdAt = $derived.by(() => {
		const date = typeof comment.createdAt === 'string' ? new Date(comment.createdAt) : comment.createdAt;
		return date.toLocaleString();
	});

	const hasChildren = $derived((comment.children?.length ?? 0) > 0);
	const withinDepth = $derived(comment.depth < config.maxDepth);
	const canShowChildren = $derived(withinDepth && !comment.isCollapsed && hasChildren);
	const canShowContent = $derived(!comment.isCollapsed && !comment.isDeleted && !comment.isRemoved);

	const badge = $derived.by(() => {
		if (comment.isAdmin) return { text: 'Admin', class: 'gr-community-comment__badge--admin' };
		if (comment.isMod) return { text: 'Mod', class: 'gr-community-comment__badge--mod' };
		if (comment.isOp) return { text: 'OP', class: 'gr-community-comment__badge--op' };
		return null;
	});
</script>

<div class={commentClass} data-comment-id={comment.id}>
	<div class="gr-community-comment__header">
		<button type="button" class="gr-community-comment__author" onclick={toggleCollapse}>
			{comment.author.username}
		</button>

		{#if badge}
			<span class={`gr-community-comment__badge ${badge.class}`}>{badge.text}</span>
		{/if}

		{#if authorFlair}
			<Flair.Badge flair={authorFlair} />
		{/if}

		<span class="gr-community-comment__meta">{createdAt}</span>

		{#if config.showVoting}
			<Voting.Root
				orientation="horizontal"
				score={comment.score}
				userVote={comment.userVote ?? 0}
				handlers={{
					onUpvote: () => setVote(1),
					onDownvote: () => setVote(-1),
					onRemoveVote: () => setVote(0),
				}}
			/>
		{/if}
	</div>

	{#if canShowContent}
		<div class="gr-community-comment__content">
			<MarkdownRenderer content={comment.content} />
		</div>
	{:else if comment.isDeleted}
		<div class="gr-community-comment__content">[deleted]</div>
	{:else if comment.isRemoved}
		<div class="gr-community-comment__content">[removed]</div>
	{/if}

	{#if !comment.isCollapsed && comment.moreChildrenCount && comment.moreChildrenCount > 0}
		<button type="button" class="gr-community-comment__load-more" onclick={loadMore}>
			Load more ({comment.moreChildrenCount})
		</button>
	{/if}

	{#if canShowChildren}
		<div class="gr-community-comment__children">
			{#each comment.children as child (child.id)}
				<svelte:self comment={child} />
			{/each}
		</div>
	{/if}
</div>
