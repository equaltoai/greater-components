<!--
Post.Root - Post card container

Renders a Reddit-style post card with voting, metadata, and actions.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import type { PostConfig, PostData, PostHandlers, VoteDirection } from '../../types.js';
	import { createPostContext } from './context.js';
	import { Voting } from '../Voting/index.js';
	import { Flair } from '../Flair/index.js';

	interface Props {
		post: PostData;
		config?: PostConfig;
		handlers?: PostHandlers;
		children?: Snippet;
	}

	let { post, config = {}, handlers = {}, children }: Props = $props();

	// Initialize post state inside a Svelte component so rune tracking works.
	const postState = $state<PostData>(untrack(() => post));
	const initialConfig = untrack(() => config);
	const initialHandlers = untrack(() => handlers);

	const context = createPostContext(postState, initialConfig, initialHandlers);

	$effect(() => {
		// Sync post only when identity changes to avoid clobbering optimistic updates.
		if (post.id !== postState.id) {
			Object.assign(postState, post);
		}
	});

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});

	const rootClass = $derived(
		[
			'gr-community-post',
			context.config.density === 'compact' && 'gr-community-post--compact',
			context.config.class,
		]
			.filter(Boolean)
			.join(' ')
	);

	const postHref = $derived(
		postState.type === 'link' && postState.url ? postState.url : `/posts/${postState.id}`
	);

	function formatTimestamp(value: Date | string): string {
		const date = typeof value === 'string' ? new Date(value) : value;
		return date.toLocaleString();
	}

	async function setVote(direction: VoteDirection) {
		const previousVote = postState.userVote ?? 0;
		const previousScore = postState.score;

		const nextVote = previousVote === direction ? 0 : direction;
		postState.userVote = nextVote;
		postState.score = previousScore + (nextVote - previousVote);

		try {
			if (nextVote === 1) await context.handlers.onUpvote?.(postState.id);
			else if (nextVote === -1) await context.handlers.onDownvote?.(postState.id);
			else await context.handlers.onRemoveVote?.(postState.id);
		} catch {
			postState.userVote = previousVote;
			postState.score = previousScore;
		}
	}

	async function toggleSave() {
		const wasSaved = !!postState.isSaved;
		postState.isSaved = !wasSaved;
		try {
			if (wasSaved) await context.handlers.onUnsave?.(postState.id);
			else await context.handlers.onSave?.(postState.id);
		} catch {
			postState.isSaved = wasSaved;
		}
	}

	function handleNavigate(event: MouseEvent) {
		if (!context.handlers.onNavigate) return;
		event.preventDefault();
		context.handlers.onNavigate(postState.id);
	}

	function navigateToPost() {
		if (context.handlers.onNavigate) {
			context.handlers.onNavigate(postState.id);
		} else {
			window.location.href = postHref;
		}
	}
</script>

<article class={rootClass} data-post-id={postState.id}>
	{#if children}
		{@render children?.()}
	{:else}
		{#if context.config.showVoting}
			<div class="gr-community-post__voting">
				<Voting.Root
					score={postState.score}
					userVote={postState.userVote ?? 0}
					handlers={{
						onUpvote: () => setVote(1),
						onDownvote: () => setVote(-1),
						onRemoveVote: () => setVote(0),
					}}
				/>
			</div>
		{/if}

		<div class="gr-community-post__content">
			<h2 class="gr-community-post__title">
				<a href={postHref} onclick={handleNavigate}>{postState.title}</a>
			</h2>

			<div class="gr-community-post__meta">
				{#if context.config.showCommunity}
					<span>{postState.community.title}</span>
					<span class="gr-community-post__meta-separator" aria-hidden="true"></span>
				{/if}

				{#if context.config.showAuthor}
					<span>by {postState.author.username}</span>
					<span class="gr-community-post__meta-separator" aria-hidden="true"></span>
				{/if}

				<span>{formatTimestamp(postState.createdAt)}</span>

				{#if context.config.showFlair && postState.flair}
					<span class="gr-community-post__meta-separator" aria-hidden="true"></span>
					<Flair.Badge flair={postState.flair} />
				{/if}
			</div>

			{#if postState.type === 'text' && postState.content}
				<div class="gr-community-post__body">
					<MarkdownRenderer content={postState.content} />
				</div>
			{:else if postState.type === 'link' && postState.url}
				<div class="gr-community-post__body">
					<a href={postState.url} rel="noopener noreferrer" target="_blank">{postState.url}</a>
				</div>
			{/if}

			<div class="gr-community-post__actions">
				<button type="button" class="gr-community-post__action" onclick={navigateToPost}>
					{postState.commentCount} comments
				</button>
				<button
					type="button"
					class="gr-community-post__action"
					onclick={() => context.handlers.onShare?.(postState.id)}
				>
					Share
				</button>
				<button type="button" class="gr-community-post__action" onclick={toggleSave}>
					{postState.isSaved ? 'Unsave' : 'Save'}
				</button>
			</div>
		</div>
	{/if}
</article>
