# Compose.ThreadComposer

**Component**: Multi-Post Thread Composer  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.ThreadComposer` enables users to compose multi-post threads (tweet storms, tweetstorms) with drag-and-drop reordering, individual character counting, and seamless sequential posting. Perfect for long-form content that needs to be split across multiple posts.

### **Key Features**:

- ✅ **Multiple posts** in a single thread (up to configurable max)
- ✅ **Drag & drop reordering** of thread posts
- ✅ **Per-post character counting** with unicode support
- ✅ **Add/remove posts** dynamically
- ✅ **Visual threading** with connecting lines
- ✅ **Keyboard navigation** (↑↓ to reorder)
- ✅ **Sequential posting** with automatic threading
- ✅ **Validation** before submission
- ✅ **Empty post filtering** (only posts with content are submitted)
- ✅ **Responsive design**

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	async function handleThreadSubmit(posts) {
		let previousId = null;

		for (const post of posts) {
			const response = await fetch('/api/statuses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					status: post.content,
					visibility: post.visibility,
					in_reply_to_id: previousId,
				}),
			});

			const data = await response.json();
			previousId = data.id;
		}
	}
</script>

<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} maxPosts={10} characterLimit={500} />
```

---

## 🎛️ Props

| Prop                | Type             | Default    | Required | Description                       |
| ------------------- | ---------------- | ---------- | -------- | --------------------------------- |
| `characterLimit`    | `number`         | `500`      | No       | Character limit per post          |
| `maxPosts`          | `number`         | `10`       | No       | Maximum posts in thread           |
| `defaultVisibility` | `PostVisibility` | `'public'` | No       | Default visibility for all posts  |
| `onSubmitThread`    | `Function`       | -          | **Yes**  | Callback when thread is submitted |
| `onCancel`          | `Function`       | -          | No       | Callback when cancelled           |
| `class`             | `string`         | `''`       | No       | Additional CSS class              |

### **Types**:

```typescript
type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';

interface ThreadPost {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
}

type OnSubmitThread = (posts: ThreadPost[]) => Promise<void>;
```

---

## 💡 Examples

### **Example 1: Basic Thread Composer**

Simple thread composition with default settings:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	async function handleThreadSubmit(posts) {
		console.log(`Posting thread with ${posts.length} posts`);

		let previousId = null;
		for (const post of posts) {
			const status = await api.createStatus({
				status: post.content,
				visibility: post.visibility,
				in_reply_to_id: previousId,
			});
			previousId = status.id;
		}

		alert('Thread posted successfully!');
	}
</script>

<div class="thread-container">
	<h2>Compose Thread</h2>

	<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} maxPosts={10} characterLimit={500} />
</div>

<style>
	.thread-container {
		max-width: 700px;
		margin: 2rem auto;
		padding: 1.5rem;
	}
</style>
```

### **Example 2: With Progress Tracking**

Show progress during thread posting:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	let posting = $state(false);
	let progress = $state({ current: 0, total: 0 });

	async function handleThreadSubmit(posts) {
		posting = true;
		progress = { current: 0, total: posts.length };

		try {
			let previousId = null;

			for (let i = 0; i < posts.length; i++) {
				progress.current = i + 1;

				const status = await api.createStatus({
					status: posts[i].content,
					visibility: posts[i].visibility,
					in_reply_to_id: previousId,
				});

				previousId = status.id;

				// Small delay between posts
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			alert('Thread posted successfully!');
		} catch (error) {
			alert('Failed to post thread: ' + error.message);
		} finally {
			posting = false;
			progress = { current: 0, total: 0 };
		}
	}
</script>

<div class="thread-composer-container">
	{#if posting}
		<div class="posting-overlay">
			<div class="progress-card">
				<h3>Posting Thread...</h3>
				<div class="progress-bar">
					<div
						class="progress-fill"
						style="width: {(progress.current / progress.total) * 100}%"
					></div>
				</div>
				<p>Post {progress.current} of {progress.total}</p>
			</div>
		</div>
	{/if}

	<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} maxPosts={15} />
</div>

<style>
	.posting-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1000;
	}

	.progress-card {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		min-width: 300px;
		text-align: center;
	}

	.progress-bar {
		height: 8px;
		background: #e1e8ed;
		border-radius: 4px;
		overflow: hidden;
		margin: 1rem 0;
	}

	.progress-fill {
		height: 100%;
		background: #1d9bf0;
		transition: width 0.3s ease;
	}
</style>
```

### **Example 3: Pre-filled Thread**

Start with pre-filled content (e.g., from a long paste):

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';
	import { splitIntoChunks } from '@equaltoai/greater-components-fediverse/Compose';

	let longText = $state('');
	let threadPosts = $state<string[]>([]);

	function splitIntoThread() {
		if (!longText.trim()) return;

		// Split long text into thread posts
		threadPosts = splitIntoChunks(longText, 500);

		// Show thread composer with pre-filled posts
	}

	async function handleThreadSubmit(posts) {
		await postThread(posts);
	}
</script>

<div class="split-thread-composer">
	<div class="input-section">
		<h3>Paste Long Content</h3>
		<textarea bind:value={longText} placeholder="Paste your long-form content here..." rows="8"
		></textarea>
		<button onclick={splitIntoThread}>
			Split into Thread ({Math.ceil(longText.length / 500)} posts)
		</button>
	</div>

	{#if threadPosts.length > 0}
		<div class="thread-preview">
			<h3>Thread Preview ({threadPosts.length} posts)</h3>
			{#each threadPosts as post, i}
				<div class="preview-post">
					<strong>Post {i + 1}:</strong>
					<p>{post}</p>
				</div>
			{/each}
		</div>

		<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} initialPosts={threadPosts} />
	{/if}
</div>

<style>
	.split-thread-composer {
		max-width: 700px;
		margin: 2rem auto;
	}

	.input-section textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e1e8ed;
		border-radius: 8px;
		font-family: inherit;
		margin-bottom: 1rem;
	}

	.input-section button {
		padding: 0.75rem 1.5rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		cursor: pointer;
	}

	.thread-preview {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f7f9fa;
		border-radius: 12px;
	}

	.preview-post {
		padding: 1rem;
		margin-bottom: 0.75rem;
		background: white;
		border-radius: 8px;
		border-left: 3px solid #1d9bf0;
	}

	.preview-post strong {
		display: block;
		margin-bottom: 0.5rem;
		color: #1d9bf0;
	}

	.preview-post p {
		margin: 0;
		white-space: pre-wrap;
	}
</style>
```

### **Example 4: With Draft Saving**

Save thread drafts to resume later:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';
	import { onMount } from 'svelte';

	const THREAD_DRAFT_KEY = 'thread-composer-draft';
	let hasDraft = $state(false);

	onMount(() => {
		const saved = localStorage.getItem(THREAD_DRAFT_KEY);
		hasDraft = !!saved;
	});

	function saveDraft(posts: any[]) {
		localStorage.setItem(THREAD_DRAFT_KEY, JSON.stringify(posts));
	}

	function loadDraft(): any[] {
		const saved = localStorage.getItem(THREAD_DRAFT_KEY);
		return saved ? JSON.parse(saved) : [];
	}

	function clearDraft() {
		localStorage.removeItem(THREAD_DRAFT_KEY);
		hasDraft = false;
	}

	async function handleThreadSubmit(posts) {
		await postThread(posts);
		clearDraft();
	}
</script>

<div class="draft-thread-composer">
	{#if hasDraft}
		<div class="draft-notice">
			<span>💾 You have an unsaved thread draft</span>
			<button
				onclick={() => {
					/* load draft */
				}}>Load Draft</button
			>
			<button onclick={clearDraft}>Discard</button>
		</div>
	{/if}

	<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} onPostsChange={saveDraft} />
</div>

<style>
	.draft-notice {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		margin-bottom: 1rem;
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 8px;
	}

	.draft-notice button {
		padding: 0.5rem 1rem;
		border: 1px solid #856404;
		border-radius: 6px;
		background: white;
		cursor: pointer;
	}
</style>
```

### **Example 5: With Content Warnings**

Add content warnings to sensitive threads:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	let showContentWarning = $state(false);
	let contentWarning = $state('');

	async function handleThreadSubmit(posts) {
		const postsWithCW = posts.map((post) => ({
			...post,
			spoiler_text: showContentWarning ? contentWarning : undefined,
			sensitive: showContentWarning,
		}));

		await postThread(postsWithCW);
	}
</script>

<div class="cw-thread-composer">
	<div class="cw-controls">
		<label>
			<input type="checkbox" bind:checked={showContentWarning} />
			Add content warning to entire thread
		</label>

		{#if showContentWarning}
			<input
				type="text"
				bind:value={contentWarning}
				placeholder="Content warning text..."
				class="cw-input"
			/>
		{/if}
	</div>

	<Compose.ThreadComposer onSubmitThread={handleThreadSubmit} maxPosts={20} />
</div>

<style>
	.cw-controls {
		padding: 1rem;
		margin-bottom: 1rem;
		background: #fff3cd;
		border-radius: 8px;
	}

	.cw-input {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border: 1px solid #ffc107;
		border-radius: 6px;
	}
</style>
```

### **Example 6: With Templates**

Provide thread templates for common use cases:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	const templates = {
		announcement: [
			'🎉 Big announcement! ',
			'Here are the details: ',
			'Thank you for your support!',
		],
		tutorial: ['🧵 Thread: How to ', 'Step 1: ', 'Step 2: ', 'Step 3: ', 'Hope this helps!'],
		review: ['📝 Review: ', 'Pros: ', 'Cons: ', 'Overall: '],
	};

	let selectedTemplate = $state<keyof typeof templates | null>(null);

	function applyTemplate(template: keyof typeof templates) {
		selectedTemplate = template;
		// Apply template posts to thread composer
	}

	async function handleThreadSubmit(posts) {
		await postThread(posts);
	}
</script>

<div class="template-thread-composer">
	<div class="templates">
		<h3>Thread Templates</h3>
		<div class="template-buttons">
			{#each Object.keys(templates) as template}
				<button
					onclick={() => applyTemplate(template as keyof typeof templates)}
					class:active={selectedTemplate === template}
				>
					{template}
				</button>
			{/each}
		</div>
	</div>

	<Compose.ThreadComposer
		onSubmitThread={handleThreadSubmit}
		initialPosts={selectedTemplate ? templates[selectedTemplate] : undefined}
	/>
</div>

<style>
	.templates {
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background: #f7f9fa;
		border-radius: 12px;
	}

	.templates h3 {
		margin: 0 0 1rem;
		font-size: 1rem;
	}

	.template-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.template-buttons button {
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid #e1e8ed;
		border-radius: 6px;
		text-transform: capitalize;
		cursor: pointer;
	}

	.template-buttons button.active {
		background: #1d9bf0;
		color: white;
		border-color: #1d9bf0;
	}
</style>
```

---

## 🎨 Styling

```css
.thread-composer {
	--thread-bg: white;
	--thread-border: #cfd9de;
	--thread-radius: 12px;
	--thread-post-bg: #f7f9fa;
	--thread-post-border: #e1e8ed;
	--thread-connector: #cfd9de;
	--primary-color: #1d9bf0;
	--primary-hover: #1a8cd8;
	--text-primary: #0f1419;
	--text-secondary: #536471;
	--border-color: #cfd9de;
	--hover-bg: #eff3f4;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	.thread-composer {
		--thread-bg: #15202b;
		--thread-border: #38444d;
		--thread-post-bg: #1c2938;
		--thread-post-border: #38444d;
		--thread-connector: #38444d;
		--text-primary: #ffffff;
		--text-secondary: #8899a6;
		--border-color: #38444d;
		--hover-bg: #273340;
	}
}
```

---

## ♿ Accessibility

### **Keyboard Support**

- Tab navigation between posts
- Standard textarea editing
- Buttons are keyboard accessible

### **Screen Reader Support**

- Post numbers announced
- Thread structure communicated
- Action buttons clearly labeled

### **ARIA Attributes**

```html
<div class="thread-composer" role="form" aria-label="Thread composer">
	<div class="thread-post" role="group" aria-label="Post 1 of 3">
		<textarea aria-label="Post content"></textarea>
	</div>
</div>
```

---

## 🔒 Security Considerations

### **Content Validation**

Validate each post in the thread:

```typescript
async function handleThreadSubmit(posts) {
	for (const [index, post] of posts.entries()) {
		if (post.content.length > 500) {
			throw new Error(`Post ${index + 1} exceeds character limit`);
		}

		if (containsSpam(post.content)) {
			throw new Error(`Post ${index + 1} contains spam`);
		}
	}

	await postThread(posts);
}
```

### **Rate Limiting**

Be mindful of API rate limits when posting threads:

```typescript
async function postThreadWithRateLimit(posts) {
	const DELAY_BETWEEN_POSTS = 1000; // 1 second

	let previousId = null;
	for (const post of posts) {
		const status = await api.createStatus({
			...post,
			in_reply_to_id: previousId,
		});
		previousId = status.id;

		// Delay before next post
		if (posts.indexOf(post) < posts.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_POSTS));
		}
	}
}
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';

describe('ThreadComposer', () => {
	it('starts with one empty post', () => {
		render(Compose.ThreadComposer, {
			props: {
				onSubmitThread: () => {},
			},
		});

		const textareas = screen.getAllByRole('textbox');
		expect(textareas).toHaveLength(1);
	});

	it('adds new posts', async () => {
		render(Compose.ThreadComposer, {
			props: {
				onSubmitThread: () => {},
			},
		});

		const addButton = screen.getByText(/add post/i);
		await fireEvent.click(addButton);

		const textareas = screen.getAllByRole('textbox');
		expect(textareas).toHaveLength(2);
	});

	it('removes posts', async () => {
		render(Compose.ThreadComposer, {
			props: {
				onSubmitThread: () => {},
				maxPosts: 5,
			},
		});

		// Add 2 posts
		const addButton = screen.getByText(/add post/i);
		await fireEvent.click(addButton);
		await fireEvent.click(addButton);

		// Remove one
		const removeButtons = screen.getAllByLabelText(/remove post/i);
		await fireEvent.click(removeButtons[1]);

		const textareas = screen.getAllByRole('textbox');
		expect(textareas).toHaveLength(2);
	});

	it('submits thread with only non-empty posts', async () => {
		const handleSubmit = vi.fn();

		render(Compose.ThreadComposer, {
			props: {
				onSubmitThread: handleSubmit,
			},
		});

		// Add posts
		const addButton = screen.getByText(/add post/i);
		await fireEvent.click(addButton);
		await fireEvent.click(addButton);

		// Fill only first and third
		const textareas = screen.getAllByRole('textbox');
		await fireEvent.input(textareas[0], { target: { value: 'Post 1' } });
		await fireEvent.input(textareas[2], { target: { value: 'Post 3' } });

		// Submit
		const submitButton = screen.getByText(/post thread/i);
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ content: 'Post 1' }),
					expect.objectContaining({ content: 'Post 3' }),
				])
			);
			// Should only submit 2 posts (empty one filtered out)
			expect(handleSubmit.mock.calls[0][0]).toHaveLength(2);
		});
	});

	it('respects max posts limit', async () => {
		render(Compose.ThreadComposer, {
			props: {
				onSubmitThread: () => {},
				maxPosts: 3,
			},
		});

		const addButton = screen.getByText(/add post/i);

		// Try to add 5 posts (should only allow 3)
		await fireEvent.click(addButton);
		await fireEvent.click(addButton);
		await fireEvent.click(addButton);
		await fireEvent.click(addButton);

		const textareas = screen.getAllByRole('textbox');
		expect(textareas).toHaveLength(3);
		expect(addButton).toBeDisabled();
	});
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Single post composer
- [Compose.Editor](./Editor.md) - Text editor
- [UnicodeCounter Utility](./UnicodeCounter.md) - Character counting

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [UnicodeCounter Documentation](./UnicodeCounter.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: How many posts can be in a thread?**

Default is 10, configurable via `maxPosts` prop. Some instances may have server-side limits.

### **Q: Can I nest threads (thread of threads)?**

No. Each thread is a linear sequence of posts. For complex structures, create separate threads.

### **Q: What happens if one post in the middle fails?**

The thread will be incomplete. Consider implementing:

- Transaction-like behavior (rollback all on failure)
- Resume from last successful post
- Save progress for manual retry

### **Q: Can I add media to thread posts?**

The ThreadComposer focuses on text. For media-rich threads, use multiple `Compose.Root` instances with media upload.

### **Q: How do I handle very long threads (50+ posts)?**

Consider:

- Pagination/lazy loading
- Virtual scrolling for performance
- Warning users about long threads
- Suggesting blog posts instead

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).
