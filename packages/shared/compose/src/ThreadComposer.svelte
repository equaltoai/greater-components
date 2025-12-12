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
	import { untrack } from 'svelte';
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

	let visibility = $state<PostVisibility>(untrack(() => defaultVisibility));
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
