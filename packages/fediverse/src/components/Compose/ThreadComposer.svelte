<!--
Compose.ThreadComposer - Multi-post thread composer

Create threads with multiple connected posts, each with its own character limit.

@component
@example
```svelte
<script>
  import { Compose } from '@equaltoai/greater-components-fediverse';
  
  async function handleSubmitThread(posts) {
    // Submit posts in sequence
    for (const post of posts) {
      await api.createStatus(post);
    }
  }
</script>

<Compose.ThreadComposer 
  onSubmitThread={handleSubmitThread}
  maxPosts={10}
/>
```
-->

<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { countWeightedCharacters } from './UnicodeCounter.js';
	import type { PostVisibility } from './context.js';

	interface ThreadPost {
		id: string;
		content: string;
		contentWarning?: string;
		characterCount: number;
		overLimit: boolean;
	}

	interface Props {
		/**
		 * Character limit per post
		 */
		characterLimit?: number;

		/**
		 * Maximum number of posts in thread
		 */
		maxPosts?: number;

		/**
		 * Default visibility for all posts
		 */
		defaultVisibility?: PostVisibility;

		/**
		 * Callback when thread is submitted
		 */
		onSubmitThread?: (
			posts: Array<{
				content: string;
				contentWarning?: string;
				visibility: PostVisibility;
			}>
		) => Promise<void>;

		/**
		 * Callback when cancelled
		 */
		onCancel?: () => void;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		characterLimit = 500,
		maxPosts = 10,
		defaultVisibility = 'public',
		onSubmitThread,
		onCancel,
		class: className = '',
	}: Props = $props();

	// Thread state
	let posts = $state<ThreadPost[]>([
		{
			id: crypto.randomUUID(),
			content: '',
			characterCount: 0,
			overLimit: false,
		},
	]);

	let visibility = $state<PostVisibility>(defaultVisibility);
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let draggedPostId = $state<string | null>(null);

	function extractErrorMessage(value: unknown): string {
		if (value instanceof Error) {
			return value.message;
		}
		if (typeof value === 'string') {
			return value;
		}
		return 'Failed to submit thread';
	}

	// Buttons
	const addPostButton = createButton();
	const submitButton = createButton();
	const cancelButton = createButton();

	/**
	 * Update character count for a post
	 */
	function updateCharacterCount(post: ThreadPost) {
		const metrics = countWeightedCharacters(post.content, {
			useUrlWeighting: true,
			maxCharacters: characterLimit,
		});
		post.characterCount = metrics.count;
		post.overLimit = metrics.count > characterLimit;
	}

	/**
	 * Handle post content change
	 */
	function handlePostInput(postId: string, content: string) {
		const post = posts.find((p) => p.id === postId);
		if (post) {
			post.content = content;
			updateCharacterCount(post);
		}
	}

	/**
	 * Add a new post to the thread
	 */
	function addPost() {
		if (posts.length >= maxPosts) {
			error = `Maximum ${maxPosts} posts per thread`;
			return;
		}

		posts.push({
			id: crypto.randomUUID(),
			content: '',
			characterCount: 0,
			overLimit: false,
		});

		// Focus the new post's textarea
		setTimeout(() => {
			const textareas = document.querySelectorAll('.thread-post__textarea');
			const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
			lastTextarea?.focus();
		}, 0);
	}

	/**
	 * Remove a post from the thread
	 */
	function removePost(postId: string) {
		if (posts.length === 1) {
			error = 'Thread must have at least one post';
			return;
		}
		posts = posts.filter((p) => p.id !== postId);
	}

	/**
	 * Move post up
	 */
	function movePostUp(postId: string) {
		const index = posts.findIndex((p) => p.id === postId);
		if (index > 0) {
			[posts[index], posts[index - 1]] = [posts[index - 1], posts[index]];
		}
	}

	/**
	 * Move post down
	 */
	function movePostDown(postId: string) {
		const index = posts.findIndex((p) => p.id === postId);
		if (index < posts.length - 1) {
			[posts[index], posts[index + 1]] = [posts[index + 1], posts[index]];
		}
	}

	/**
	 * Handle drag start
	 */
	function handleDragStart(postId: string) {
		draggedPostId = postId;
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent, postId: string) {
		event.preventDefault();
		if (!draggedPostId || draggedPostId === postId) return;

		const draggedIndex = posts.findIndex((p) => p.id === draggedPostId);
		const targetIndex = posts.findIndex((p) => p.id === postId);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			const newPosts = [...posts];
			const [draggedPost] = newPosts.splice(draggedIndex, 1);
			newPosts.splice(targetIndex, 0, draggedPost);
			posts = newPosts;
		}
	}

	/**
	 * Handle drag end
	 */
	function handleDragEnd() {
		draggedPostId = null;
	}

	/**
	 * Validate thread before submission
	 */
	function validateThread(): string | null {
		// Check if all posts have content
		const emptyPosts = posts.filter((p) => !p.content.trim());
		if (emptyPosts.length === posts.length) {
			return 'Thread cannot be empty';
		}

		// Check for over-limit posts
		const overLimitPosts = posts.filter((p) => p.overLimit);
		if (overLimitPosts.length > 0) {
			return `Post ${posts.findIndex((p) => p.overLimit) + 1} exceeds character limit`;
		}

		return null;
	}

	/**
	 * Submit the thread
	 */
	async function handleSubmit() {
		error = null;

		// Validate
		const validationError = validateThread();
		if (validationError) {
			error = validationError;
			return;
		}

		if (!onSubmitThread) {
			error = 'No submit handler provided';
			return;
		}

		submitting = true;

		try {
			// Filter out empty posts
			const postsToSubmit = posts
				.filter((p) => p.content.trim().length > 0)
				.map((p) => ({
					content: p.content,
					contentWarning: p.contentWarning,
					visibility,
				}));

			await onSubmitThread(postsToSubmit);

			// Reset on success
			posts = [
				{
					id: crypto.randomUUID(),
					content: '',
					characterCount: 0,
					overLimit: false,
				},
			];
		} catch (err) {
			error = extractErrorMessage(err);
		} finally {
			submitting = false;
		}
	}

	/**
	 * Handle cancel
	 */
	function handleCancelClick() {
		if (onCancel) {
			onCancel();
		} else {
			// Reset to single empty post
			posts = [
				{
					id: crypto.randomUUID(),
					content: '',
					characterCount: 0,
					overLimit: false,
				},
			];
			error = null;
		}
	}

	// Check if submit is disabled
	const canSubmit = $derived(
		posts.some((p) => p.content.trim().length > 0) && !posts.some((p) => p.overLimit) && !submitting
	);
</script>

<div class={`thread-composer ${className}`}>
	<div class="thread-composer__header">
		<h3 class="thread-composer__title">
			Compose Thread
			<span class="thread-composer__count">{posts.length} / {maxPosts} posts</span>
		</h3>
	</div>

	{#if error}
		<div class="thread-composer__error" role="alert">
			{error}
		</div>
	{/if}

	<div class="thread-composer__posts" role="list" aria-label="Thread posts">
		{#each posts as post, index (post.id)}
			<div
				class="thread-post"
				class:thread-post--dragging={draggedPostId === post.id}
				draggable="true"
				ondragstart={() => handleDragStart(post.id)}
				ondragover={(e) => handleDragOver(e, post.id)}
				ondragend={handleDragEnd}
				role="listitem"
				aria-grabbed={draggedPostId === post.id}
			>
				<div class="thread-post__header">
					<div class="thread-post__number">{index + 1}</div>

					<div class="thread-post__controls">
						<button
							type="button"
							class="thread-post__control"
							onclick={() => movePostUp(post.id)}
							disabled={index === 0}
							title="Move up"
							aria-label="Move post up"
						>
							↑
						</button>
						<button
							type="button"
							class="thread-post__control"
							onclick={() => movePostDown(post.id)}
							disabled={index === posts.length - 1}
							title="Move down"
							aria-label="Move post down"
						>
							↓
						</button>
						<button
							type="button"
							class="thread-post__control thread-post__control--remove"
							onclick={() => removePost(post.id)}
							disabled={posts.length === 1}
							title="Remove post"
							aria-label="Remove post"
						>
							×
						</button>
					</div>
				</div>

				<textarea
					class="thread-post__textarea"
					class:thread-post__textarea--over-limit={post.overLimit}
					placeholder="What's on your mind?"
					value={post.content}
					oninput={(e) => handlePostInput(post.id, e.currentTarget.value)}
					disabled={submitting}
					rows="4"
				></textarea>

				<div class="thread-post__footer">
					<div
						class="thread-post__char-count"
						class:thread-post__char-count--near-limit={post.characterCount / characterLimit >= 0.8}
						class:thread-post__char-count--over-limit={post.overLimit}
					>
						{post.characterCount} / {characterLimit}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="thread-composer__actions">
		<button
			use:addPostButton.actions.button
			type="button"
			class="thread-composer__add-post"
			onclick={addPost}
			disabled={posts.length >= maxPosts || submitting}
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			Add post to thread
		</button>

		<div class="thread-composer__submit-group">
			<button
				use:cancelButton.actions.button
				type="button"
				class="thread-composer__cancel"
				onclick={handleCancelClick}
				disabled={submitting}
			>
				Cancel
			</button>

			<button
				use:submitButton.actions.button
				type="button"
				class="thread-composer__submit"
				onclick={handleSubmit}
				disabled={!canSubmit}
			>
				{#if submitting}
					<span class="thread-composer__spinner"></span>
					Posting thread...
				{:else}
					Post thread ({posts.filter((p) => p.content.trim()).length})
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.thread-composer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		background: var(--thread-bg, white);
		border: 1px solid var(--thread-border, #cfd9de);
		border-radius: var(--thread-radius, 12px);
	}

	.thread-composer__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.thread-composer__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-primary, #0f1419);
	}

	.thread-composer__count {
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--text-secondary, #536471);
		margin-left: 0.5rem;
	}

	.thread-composer__error {
		padding: 0.75rem 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
	}

	.thread-composer__posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.thread-post {
		position: relative;
		padding: 1rem;
		background: var(--thread-post-bg, #f7f9fa);
		border: 2px solid var(--thread-post-border, #e1e8ed);
		border-radius: 0.75rem;
		cursor: move;
		transition: all 0.2s;
	}

	.thread-post--dragging {
		opacity: 0.5;
		transform: scale(0.98);
	}

	.thread-post:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 2rem;
		bottom: -1rem;
		width: 2px;
		height: 1rem;
		background: var(--thread-connector, #cfd9de);
	}

	.thread-post__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.thread-post__number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: var(--primary-color, #1d9bf0);
		color: white;
		border-radius: 50%;
		font-weight: 700;
		font-size: 0.875rem;
	}

	.thread-post__controls {
		display: flex;
		gap: 0.25rem;
	}

	.thread-post__control {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.375rem;
		color: var(--text-secondary, #536471);
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.thread-post__control:hover:not(:disabled) {
		background: var(--hover-bg, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
		color: var(--primary-color, #1d9bf0);
	}

	.thread-post__control:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.thread-post__control--remove {
		color: #f4211e;
	}

	.thread-post__control--remove:hover:not(:disabled) {
		background: rgba(244, 33, 46, 0.1);
		border-color: #f4211e;
	}

	.thread-post__textarea {
		width: 100%;
		min-height: 100px;
		padding: 0.75rem;
		font-family: inherit;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--text-primary, #0f1419);
		background: white;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.5rem;
		resize: vertical;
		outline: none;
		transition: border-color 0.2s;
	}

	.thread-post__textarea:focus {
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 1px var(--primary-color, #1d9bf0);
	}

	.thread-post__textarea--over-limit {
		border-color: #f4211e;
	}

	.thread-post__textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.thread-post__footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.thread-post__char-count {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.thread-post__char-count--near-limit {
		color: #f59e0b;
	}

	.thread-post__char-count--over-limit {
		color: #f4211e;
	}

	.thread-composer__actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.thread-composer__add-post {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 2px dashed var(--border-color, #cfd9de);
		border-radius: 0.75rem;
		color: var(--primary-color, #1d9bf0);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.thread-composer__add-post:hover:not(:disabled) {
		background: var(--hover-bg, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.thread-composer__add-post:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.thread-composer__add-post svg {
		width: 20px;
		height: 20px;
	}

	.thread-composer__submit-group {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.thread-composer__cancel {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 9999px;
		color: var(--text-primary, #0f1419);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.thread-composer__cancel:hover:not(:disabled) {
		background: var(--hover-bg, #eff3f4);
	}

	.thread-composer__cancel:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.thread-composer__submit {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		color: white;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.thread-composer__submit:hover:not(:disabled) {
		background: var(--primary-hover, #1a8cd8);
	}

	.thread-composer__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.thread-composer__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid white;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.thread-composer__spinner {
			animation: none;
		}
	}
</style>
