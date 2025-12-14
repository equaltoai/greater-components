<!--
WorkInProgress.Comments - Threaded discussion

@component
-->

<script lang="ts">
	import { getWIPContext } from './context.js';

	interface Comment {
		id: string;
		authorId: string;
		authorName: string;
		authorAvatar?: string;
		content: string;
		createdAt: Date | string;
		versionIndex?: number;
		replies?: Comment[];
	}

	interface Props {
		/**
		 * Comments data
		 */
		comments?: Comment[];

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { comments = [], class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread, config, handlers } = ctx;

	// Local state
	let newComment = $state('');
	let replyingTo = $state<string | null>(null);

	// Format date
	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		});
	}

	// Handle submit
	async function handleSubmit() {
		if (!newComment.trim()) return;

		const currentUpdate = thread.updates[ctx.currentVersionIndex];
		await handlers.onComment?.(thread, currentUpdate.id, newComment.trim());
		newComment = '';
	}

	// Handle reply
	function handleReply(commentId: string) {
		replyingTo = replyingTo === commentId ? null : commentId;
	}
</script>

{#if config.showComments}
	<section class={`wip-comments ${className}`} aria-labelledby="comments-heading">
		<h2 id="comments-heading" class="wip-comments__heading">
			Discussion
			<span class="wip-comments__count">({comments.length})</span>
		</h2>

		<!-- Comment form -->
		<form
			class="wip-comments__form"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<textarea
				bind:value={newComment}
				class="wip-comments__input"
				placeholder="Share your thoughts on this progress..."
				rows="3"
				aria-label="Write a comment"
			></textarea>
			<div class="wip-comments__form-footer">
				<span class="wip-comments__version-tag">
					Commenting on v{ctx.currentVersionIndex + 1}
				</span>
				<button type="submit" class="wip-comments__submit" disabled={!newComment.trim()}>
					Post Comment
				</button>
			</div>
		</form>

		<!-- Comments list -->
		<div class="wip-comments__list" role="list">
			{#each comments as comment (comment.id)}
				<article class="wip-comments__item" role="listitem">
					<div class="wip-comments__author">
						{#if comment.authorAvatar}
							<img src={comment.authorAvatar} alt="" class="wip-comments__avatar" />
						{:else}
							<div class="wip-comments__avatar-placeholder">
								{comment.authorName.charAt(0).toUpperCase()}
							</div>
						{/if}
						<div class="wip-comments__author-info">
							<span class="wip-comments__author-name">{comment.authorName}</span>
							<time class="wip-comments__date" datetime={new Date(comment.createdAt).toISOString()}>
								{formatDate(comment.createdAt)}
							</time>
						</div>
						{#if comment.versionIndex !== undefined}
							<span class="wip-comments__version-badge">v{comment.versionIndex + 1}</span>
						{/if}
					</div>

					<p class="wip-comments__content">{comment.content}</p>

					<div class="wip-comments__actions">
						<button
							type="button"
							class="wip-comments__action"
							onclick={() => handleReply(comment.id)}
						>
							Reply
						</button>
					</div>

					<!-- Replies -->
					{#if comment.replies && comment.replies.length > 0}
						<div class="wip-comments__replies">
							{#each comment.replies as reply (reply.id)}
								<article class="wip-comments__reply">
									<div class="wip-comments__author">
										{#if reply.authorAvatar}
											<img
												src={reply.authorAvatar}
												alt=""
												class="wip-comments__avatar wip-comments__avatar--small"
											/>
										{/if}
										<span class="wip-comments__author-name">{reply.authorName}</span>
										<time class="wip-comments__date">{formatDate(reply.createdAt)}</time>
									</div>
									<p class="wip-comments__content">{reply.content}</p>
								</article>
							{/each}
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</section>
{/if}

<style>
	.wip-comments {
		padding: var(--gr-spacing-scale-6);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
	}

	.wip-comments__heading {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.wip-comments__count {
		font-weight: var(--gr-font-weight-normal);
		color: var(--gr-color-gray-400);
	}

	.wip-comments__form {
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.wip-comments__input {
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-font-size-base);
		resize: vertical;
	}

	.wip-comments__input:focus {
		outline: none;
		border-color: var(--gr-color-primary-500);
	}

	.wip-comments__form-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--gr-spacing-scale-3);
	}

	.wip-comments__version-tag {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.wip-comments__submit {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.wip-comments__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.wip-comments__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.wip-comments__item {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.wip-comments__author {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.wip-comments__avatar {
		width: 32px;
		height: 32px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.wip-comments__avatar--small {
		width: 24px;
		height: 24px;
	}

	.wip-comments__avatar-placeholder {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-600);
		border-radius: var(--gr-radius-full);
		color: var(--gr-color-gray-300);
		font-weight: var(--gr-font-weight-semibold);
	}

	.wip-comments__author-info {
		display: flex;
		flex-direction: column;
	}

	.wip-comments__author-name {
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
	}

	.wip-comments__date {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.wip-comments__version-badge {
		margin-left: auto;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-900);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-primary-300);
	}

	.wip-comments__content {
		margin: 0;
		color: var(--gr-color-gray-200);
		line-height: 1.5;
	}

	.wip-comments__actions {
		margin-top: var(--gr-spacing-scale-2);
	}

	.wip-comments__action {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: none;
		border: none;
		color: var(--gr-color-gray-400);
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
	}

	.wip-comments__action:hover {
		color: var(--gr-color-gray-200);
	}

	.wip-comments__replies {
		margin-top: var(--gr-spacing-scale-3);
		padding-left: var(--gr-spacing-scale-6);
		border-left: 2px solid var(--gr-color-gray-600);
	}

	.wip-comments__reply {
		padding: var(--gr-spacing-scale-2) 0;
	}
</style>
