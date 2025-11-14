# Messages.Composer

**Component**: Message Input / Composition  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 85 passing tests

---

## 📋 Overview

`Messages.Composer` provides a rich input interface for composing and sending messages in a conversation. It includes text input, emoji picker, media attachments, character counting, send validation, keyboard shortcuts, and optional typing indicators.

### **Key Features**:

- ✅ Multi-line text input with auto-resize
- ✅ Send button with validation
- ✅ Character counter and limits
- ✅ Media attachment support
- ✅ Emoji picker integration
- ✅ Mention/autocomplete support
- ✅ Draft saving (localStorage)
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- ✅ Typing indicators (optional)
- ✅ File upload via drag-and-drop
- ✅ Paste image support
- ✅ Loading states
- ✅ Error handling
- ✅ Accessibility (ARIA labels, keyboard navigation)

### **What It Does**:

`Messages.Composer` manages the message composition interface:

1. **Text Input**: Provides a textarea that auto-grows with content
2. **Send Messages**: Validates and sends messages via context handlers
3. **Media Upload**: Integrates with media upload component
4. **Draft Management**: Auto-saves drafts to prevent data loss
5. **Typing Indicators**: Optionally broadcasts typing status
6. **Keyboard Shortcuts**: Supports Enter to send, Shift+Enter for newline
7. **Validation**: Enforces character limits and empty message prevention

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onSendMessage: async (conversationId: string, content: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content }),
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers}>
	<Messages.Conversations currentUserId="me" />
	<Messages.Thread />
	<Messages.Composer />
</Messages.Root>
```

### **With All Features**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations');
			return await response.json();
		},

		onFetchMessages: async (conversationId: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}`);
			return await response.json();
		},

		onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, mediaIds }),
			});
			return await response.json();
		},

		onUploadMedia: async (file: File) => {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/media/upload', {
				method: 'POST',
				body: formData,
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="messaging-interface">
		<aside class="sidebar">
			<Messages.Conversations currentUserId="me" />
		</aside>

		<main class="main-content">
			<Messages.Thread />
			<Messages.Composer
				placeholder="Type a message..."
				maxLength={5000}
				enableEmojiPicker={true}
				enableMediaUpload={true}
				enableTypingIndicator={true}
				autoSaveDrafts={true}
				class="custom-composer"
			/>
		</main>
	</div>
</Messages.Root>

<style>
	.messaging-interface {
		display: grid;
		grid-template-columns: 350px 1fr;
		height: 100vh;
	}

	.sidebar {
		border-right: 1px solid var(--border-color, #e1e8ed);
	}

	.main-content {
		display: flex;
		flex-direction: column;
	}
</style>
```

### **With Custom Styling**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onSendMessage: async (conversationId: string, content: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content }),
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers}>
	<Messages.Composer class="custom-composer" />
</Messages.Root>

<style>
	:global(.custom-composer) {
		background: linear-gradient(to right, #f7f9fa, #ffffff);
		border-radius: 1.5rem;
		padding: 1rem;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
	}

	:global(.custom-composer textarea) {
		border-radius: 1rem;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid var(--border-color, #e1e8ed);
		transition: border-color 0.2s ease;
	}

	:global(.custom-composer textarea:focus) {
		border-color: var(--primary, #1da1f2);
		outline: none;
	}

	:global(.custom-composer .send-button) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 50%;
		width: 2.5rem;
		height: 2.5rem;
		transition: transform 0.2s ease;
	}

	:global(.custom-composer .send-button:hover) {
		transform: scale(1.1);
	}
</style>
```

---

## 🎛️ Props

| Prop                    | Type      | Default               | Required | Description                                 |
| ----------------------- | --------- | --------------------- | -------- | ------------------------------------------- |
| `placeholder`           | `string`  | `'Type a message...'` | No       | Placeholder text for the input              |
| `maxLength`             | `number`  | `5000`                | No       | Maximum character count                     |
| `enableEmojiPicker`     | `boolean` | `false`               | No       | Show emoji picker button                    |
| `enableMediaUpload`     | `boolean` | `false`               | No       | Show media upload button                    |
| `enableTypingIndicator` | `boolean` | `false`               | No       | Broadcast typing status                     |
| `autoSaveDrafts`        | `boolean` | `false`               | No       | Save drafts to localStorage                 |
| `submitOnEnter`         | `boolean` | `true`                | No       | Send on Enter key (Shift+Enter for newline) |
| `minHeight`             | `string`  | `'3rem'`              | No       | Minimum textarea height                     |
| `maxHeight`             | `string`  | `'10rem'`             | No       | Maximum textarea height                     |
| `class`                 | `string`  | `''`                  | No       | Custom CSS class for the container          |

---

## 📤 Events

The component interacts with the Messages context and uses handlers from `Messages.Root`:

### **Used Handlers**:

- `onSendMessage`: Sends the composed message
- `onUploadMedia`: Uploads media files (if media upload is enabled)

### **Context Updates**:

When a message is sent:

1. Calls `sendMessage(conversationId, content, mediaIds)` from context
2. Clears the input field
3. Clears media attachments
4. Removes saved draft
5. Optimistically adds message to the thread

---

## 💡 Examples

### **Example 1: Basic Composer with Validation**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let errorMessage = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	const showSuccess = (message: string) => {
		successMessage = message;
		setTimeout(() => {
			successMessage = null;
		}, 3000);
	};

	const showError = (message: string) => {
		errorMessage = message;
		setTimeout(() => {
			errorMessage = null;
		}, 5000);
	};

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onFetchMessages: async (conversationId: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onSendMessage: async (conversationId: string, content: string) => {
			// Validation
			const trimmed = content.trim();

			if (!trimmed) {
				showError('Message cannot be empty');
				throw new Error('Empty message');
			}

			if (trimmed.length > 5000) {
				showError('Message is too long (max 5000 characters)');
				throw new Error('Message too long');
			}

			try {
				const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${$authStore.token}`,
					},
					body: JSON.stringify({ content: trimmed }),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || 'Failed to send message');
				}

				const message = await response.json();
				showSuccess('Message sent!');
				return message;
			} catch (error) {
				showError(error instanceof Error ? error.message : 'Failed to send message');
				throw error;
			}
		},
	};
</script>

<div class="messaging-app">
	{#if errorMessage}
		<div class="alert alert--error" role="alert">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			<span>{errorMessage}</span>
			<button
				onclick={() => {
					errorMessage = null;
				}}>×</button
			>
		</div>
	{/if}

	{#if successMessage}
		<div class="alert alert--success" role="status">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
				/>
			</svg>
			<span>{successMessage}</span>
		</div>
	{/if}

	<Messages.Root {handlers} autoFetch={true}>
		<div class="layout">
			<Messages.Conversations currentUserId={$authStore.userId} />
			<div class="thread-area">
				<Messages.Thread />
				<Messages.Composer placeholder="Type your message..." maxLength={5000} />
			</div>
		</div>
	</Messages.Root>
</div>

<style>
	.messaging-app {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		font-size: 0.875rem;
	}

	.alert svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.alert button {
		margin-left: auto;
		padding: 0.25rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: inherit;
	}

	.alert--error {
		background: rgba(244, 33, 46, 0.1);
		border-bottom: 2px solid #f4211e;
		color: #f4211e;
	}

	.alert--success {
		background: rgba(0, 186, 124, 0.1);
		border-bottom: 2px solid #00ba7c;
		color: #00ba7c;
	}

	.layout {
		flex: 1;
		display: grid;
		grid-template-columns: 350px 1fr;
		overflow: hidden;
	}

	.thread-area {
		display: flex;
		flex-direction: column;
	}
</style>
```

### **Example 2: With Media Upload and Attachments**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let uploadedFiles = $state<Array<{ id: string; url: string; name: string }>>([]);
	let isUploading = $state(false);

	const handlers = {
		onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({
					content,
					mediaIds: mediaIds || uploadedFiles.map((f) => f.id),
				}),
			});

			// Clear uploaded files after sending
			uploadedFiles = [];

			return await response.json();
		},

		onUploadMedia: async (file: File) => {
			isUploading = true;

			try {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/media/upload', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${$authStore.token}`,
					},
					body: formData,
				});

				if (!response.ok) {
					throw new Error('Upload failed');
				}

				const media = await response.json();

				// Add to uploaded files list
				uploadedFiles = [...uploadedFiles, media];

				return media;
			} catch (error) {
				console.error('Failed to upload media:', error);
				throw error;
			} finally {
				isUploading = false;
			}
		},
	};

	const removeUploadedFile = (fileId: string) => {
		uploadedFiles = uploadedFiles.filter((f) => f.id !== fileId);
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="composer-with-media">
		<Messages.Conversations currentUserId={$authStore.userId} />

		<div class="thread-area">
			<Messages.Thread />

			<div class="composer-container">
				{#if uploadedFiles.length > 0}
					<div class="uploaded-files">
						{#each uploadedFiles as file}
							<div class="file-preview">
								{#if file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)}
									<img src={file.url} alt={file.name} />
								{:else}
									<div class="file-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"
											/>
										</svg>
										<span>{file.name}</span>
									</div>
								{/if}

								<button
									class="remove-file"
									onclick={() => removeUploadedFile(file.id)}
									aria-label="Remove {file.name}"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
										/>
									</svg>
								</button>
							</div>
						{/each}
					</div>
				{/if}

				{#if isUploading}
					<div class="upload-progress">
						<div class="spinner"></div>
						<span>Uploading...</span>
					</div>
				{/if}

				<Messages.Composer
					placeholder="Type a message..."
					enableMediaUpload={true}
					enableEmojiPicker={true}
				/>
			</div>
		</div>
	</div>
</Messages.Root>

<style>
	.composer-with-media {
		display: grid;
		grid-template-columns: 350px 1fr;
		height: 100vh;
	}

	.thread-area {
		display: flex;
		flex-direction: column;
	}

	.composer-container {
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.uploaded-files {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
	}

	.file-preview {
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--background-secondary, #f7f9fa);
	}

	.file-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.file-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0.5rem;
		text-align: center;
	}

	.file-icon svg {
		width: 2rem;
		height: 2rem;
		margin-bottom: 0.25rem;
		color: var(--text-secondary, #657786);
	}

	.file-icon span {
		font-size: 0.625rem;
		color: var(--text-secondary, #657786);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.remove-file {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.remove-file:hover {
		background: rgba(244, 33, 46, 0.9);
	}

	.remove-file svg {
		width: 1rem;
		height: 1rem;
	}

	.upload-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--background-secondary, #f7f9fa);
		color: var(--text-secondary, #657786);
		font-size: 0.875rem;
	}

	.spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary, #1da1f2);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
```

### **Example 3: With Auto-save Drafts**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { onMount, onDestroy } from 'svelte';
	import { authStore } from '$lib/stores/auth';

	let draftKey = $state<string | null>(null);
	let savedDraft = $state<string>('');
	let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

	// Load draft when conversation changes
	$effect(() => {
		const context = Messages.getMessagesContext();
		if (context.state.selectedConversation) {
			draftKey = `draft-${context.state.selectedConversation.id}`;

			// Load saved draft
			const saved = localStorage.getItem(draftKey);
			if (saved) {
				savedDraft = saved;
				console.log('Draft loaded');
			} else {
				savedDraft = '';
			}
		}
	});

	// Save draft automatically
	const saveDraft = (content: string) => {
		if (!draftKey) return;

		if (autoSaveTimer) {
			clearTimeout(autoSaveTimer);
		}

		autoSaveTimer = setTimeout(() => {
			if (content.trim()) {
				localStorage.setItem(draftKey!, content);
				console.log('Draft saved');
			} else {
				localStorage.removeItem(draftKey!);
			}
		}, 1000); // Save after 1 second of inactivity
	};

	onDestroy(() => {
		if (autoSaveTimer) {
			clearTimeout(autoSaveTimer);
		}
	});

	const handlers = {
		onSendMessage: async (conversationId: string, content: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ content }),
			});

			// Clear draft after sending
			if (draftKey) {
				localStorage.removeItem(draftKey);
			}

			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="draft-composer">
		<Messages.Conversations currentUserId={$authStore.userId} />

		<div class="thread-area">
			<Messages.Thread />

			{#if savedDraft}
				<div class="draft-notice">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
						/>
					</svg>
					<span>Draft restored</span>
				</div>
			{/if}

			<Messages.Composer placeholder="Type a message..." autoSaveDrafts={true} />
		</div>
	</div>
</Messages.Root>

<style>
	.draft-composer {
		display: grid;
		grid-template-columns: 350px 1fr;
		height: 100vh;
	}

	.thread-area {
		display: flex;
		flex-direction: column;
	}

	.draft-notice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(29, 161, 242, 0.1);
		border-bottom: 1px solid rgba(29, 161, 242, 0.3);
		color: var(--primary, #1da1f2);
		font-size: 0.875rem;
	}

	.draft-notice svg {
		width: 1rem;
		height: 1rem;
	}
</style>
```

### **Example 4: With Typing Indicators**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { onMount, onDestroy } from 'svelte';
	import { createWebSocketClient } from '$lib/websocket';
	import { authStore } from '$lib/stores/auth';

	let ws: ReturnType<typeof createWebSocketClient> | null = null;
	let typingUsers = $state<Set<string>>(new Set());
	let typingTimer: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		// Initialize WebSocket
		ws = createWebSocketClient('wss://api.example.com/graphql');

		// Subscribe to typing indicators
		ws.subscribe({
			query: `
        subscription OnTyping {
          userTyping {
            conversationId
            userId
            username
            isTyping
          }
        }
      `,
			onData: ({ userTyping }) => {
				const context = Messages.getMessagesContext();

				// Only show for current conversation
				if (context.state.selectedConversation?.id === userTyping.conversationId) {
					if (userTyping.isTyping) {
						typingUsers.add(userTyping.username);
					} else {
						typingUsers.delete(userTyping.username);
					}
					typingUsers = new Set(typingUsers); // Trigger reactivity
				}
			},
		});
	});

	onDestroy(() => {
		ws?.close();
	});

	// Broadcast typing status
	const handleTyping = () => {
		const context = Messages.getMessagesContext();
		if (!context.state.selectedConversation) return;

		// Send typing status
		ws?.send({
			mutation: `
        mutation BroadcastTyping($conversationId: ID!, $isTyping: Boolean!) {
          setTypingStatus(conversationId: $conversationId, isTyping: $isTyping) {
            success
          }
        }
      `,
			variables: {
				conversationId: context.state.selectedConversation.id,
				isTyping: true,
			},
		});

		// Clear previous timer
		if (typingTimer) {
			clearTimeout(typingTimer);
		}

		// Stop typing after 3 seconds of inactivity
		typingTimer = setTimeout(() => {
			ws?.send({
				mutation: `
          mutation BroadcastTyping($conversationId: ID!, $isTyping: Boolean!) {
            setTypingStatus(conversationId: $conversationId, isTyping: $isTyping) {
              success
            }
          }
        `,
				variables: {
					conversationId: context.state.selectedConversation!.id,
					isTyping: false,
				},
			});
		}, 3000);
	};

	const handlers = {
		onSendMessage: async (conversationId: string, content: string) => {
			// Stop typing indicator when sending
			if (typingTimer) {
				clearTimeout(typingTimer);
			}

			ws?.send({
				mutation: `
          mutation BroadcastTyping($conversationId: ID!, $isTyping: Boolean!) {
            setTypingStatus(conversationId: $conversationId, isTyping: $isTyping) {
              success
            }
          }
        `,
				variables: {
					conversationId,
					isTyping: false,
				},
			});

			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ content }),
			});

			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="typing-indicator-composer">
		<Messages.Conversations currentUserId={$authStore.userId} />

		<div class="thread-area">
			<Messages.Thread />

			{#if typingUsers.size > 0}
				<div class="typing-indicator">
					<div class="typing-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
					<span class="typing-text">
						{Array.from(typingUsers).join(', ')}
						{typingUsers.size === 1 ? 'is' : 'are'} typing...
					</span>
				</div>
			{/if}

			<Messages.Composer
				placeholder="Type a message..."
				enableTypingIndicator={true}
				oninput={handleTyping}
			/>
		</div>
	</div>
</Messages.Root>

<style>
	.typing-indicator-composer {
		display: grid;
		grid-template-columns: 350px 1fr;
		height: 100vh;
	}

	.thread-area {
		display: flex;
		flex-direction: column;
	}

	.typing-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: var(--background-secondary, #f7f9fa);
		border-top: 1px solid var(--border-color, #e1e8ed);
		font-size: 0.875rem;
		color: var(--text-secondary, #657786);
	}

	.typing-dots {
		display: flex;
		gap: 0.25rem;
	}

	.typing-dots span {
		width: 0.5rem;
		height: 0.5rem;
		background: var(--text-secondary, #657786);
		border-radius: 50%;
		animation: typing 1.4s infinite;
	}

	.typing-dots span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-dots span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes typing {
		0%,
		60%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		30% {
			opacity: 1;
			transform: translateY(-0.25rem);
		}
	}
</style>
```

### **Example 5: With Emoji Picker and Mentions**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showEmojiPicker = $state(false);
	let showMentionSuggestions = $state(false);
	let mentionQuery = $state('');
	let mentionSuggestions = $state<Array<{ id: string; username: string; displayName: string }>>([]);

	const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙌', '👏', '💪', '🚀'];

	const insertEmoji = (emoji: string, textarea: HTMLTextAreaElement) => {
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const before = text.substring(0, start);
		const after = text.substring(end, text.length);

		textarea.value = before + emoji + after;
		textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
		textarea.focus();

		showEmojiPicker = false;
	};

	const handleInput = async (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement;
		const text = textarea.value;
		const cursorPosition = textarea.selectionStart;

		// Check for @mention
		const textBeforeCursor = text.substring(0, cursorPosition);
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			mentionQuery = mentionMatch[1];
			showMentionSuggestions = true;

			// Fetch mention suggestions
			if (mentionQuery.length >= 2) {
				const response = await fetch(`/api/search/users?q=${mentionQuery}`, {
					headers: {
						Authorization: `Bearer ${$authStore.token}`,
					},
				});
				mentionSuggestions = await response.json();
			}
		} else {
			showMentionSuggestions = false;
			mentionSuggestions = [];
		}
	};

	const insertMention = (user: (typeof mentionSuggestions)[0], textarea: HTMLTextAreaElement) => {
		const text = textarea.value;
		const cursorPosition = textarea.selectionStart;
		const textBeforeCursor = text.substring(0, cursorPosition);
		const textAfterCursor = text.substring(cursorPosition);

		// Replace @query with @username
		const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@${user.username} `);
		textarea.value = newTextBefore + textAfterCursor;
		textarea.selectionStart = textarea.selectionEnd = newTextBefore.length;
		textarea.focus();

		showMentionSuggestions = false;
		mentionSuggestions = [];
	};

	const handlers = {
		onSendMessage: async (conversationId: string, content: string) => {
			const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ content }),
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="enhanced-composer">
		<Messages.Conversations currentUserId={$authStore.userId} />

		<div class="thread-area">
			<Messages.Thread />

			<div class="composer-wrapper">
				{#if showMentionSuggestions && mentionSuggestions.length > 0}
					<div class="mention-suggestions">
						{#each mentionSuggestions as user}
							<button
								class="mention-suggestion"
								onclick={(e) => {
									const textarea = e.currentTarget
										.closest('.composer-wrapper')
										?.querySelector('textarea');
									if (textarea) insertMention(user, textarea);
								}}
							>
								<strong>@{user.username}</strong>
								<span>{user.displayName}</span>
							</button>
						{/each}
					</div>
				{/if}

				{#if showEmojiPicker}
					<div class="emoji-picker">
						<div class="emoji-grid">
							{#each emojis as emoji}
								<button
									class="emoji-button"
									onclick={(e) => {
										const textarea = e.currentTarget
											.closest('.composer-wrapper')
											?.querySelector('textarea');
										if (textarea) insertEmoji(emoji, textarea);
									}}
								>
									{emoji}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<Messages.Composer
					placeholder="Type a message... (@mention or :emoji:)"
					enableEmojiPicker={true}
					oninput={handleInput}
				/>

				<button
					class="emoji-picker-toggle"
					onclick={() => {
						showEmojiPicker = !showEmojiPicker;
					}}
					aria-label="Toggle emoji picker"
				>
					😀
				</button>
			</div>
		</div>
	</div>
</Messages.Root>

<style>
	.enhanced-composer {
		display: grid;
		grid-template-columns: 350px 1fr;
		height: 100vh;
	}

	.thread-area {
		display: flex;
		flex-direction: column;
	}

	.composer-wrapper {
		position: relative;
	}

	.mention-suggestions {
		position: absolute;
		bottom: 100%;
		left: 0;
		right: 0;
		max-height: 200px;
		overflow-y: auto;
		background: var(--background, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-bottom: none;
		box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
	}

	.mention-suggestion {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.mention-suggestion:hover {
		background: var(--background-hover, #f7f9fa);
	}

	.mention-suggestion strong {
		font-size: 0.9375rem;
		color: var(--text-primary, #14171a);
	}

	.mention-suggestion span {
		font-size: 0.875rem;
		color: var(--text-secondary, #657786);
	}

	.emoji-picker {
		position: absolute;
		bottom: 100%;
		right: 0;
		width: 300px;
		background: var(--background, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
		padding: 0.5rem;
		z-index: 10;
	}

	.emoji-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.25rem;
	}

	.emoji-button {
		width: 100%;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		font-size: 1.5rem;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background 0.15s ease;
	}

	.emoji-button:hover {
		background: var(--background-hover, #f7f9fa);
	}

	.emoji-picker-toggle {
		position: absolute;
		bottom: 0.75rem;
		right: 4rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		font-size: 1.25rem;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background 0.15s ease;
	}

	.emoji-picker-toggle:hover {
		background: var(--background-hover, #f7f9fa);
	}
</style>
```

---

## 🔒 Security Considerations

### **Input Sanitization**

Always sanitize user input:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string): string => {
	return DOMPurify.sanitize(input.trim(), {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
	});
};
```

### **Rate Limiting**

Implement client-side rate limiting:

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const sendLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 messages per minute
});

const handleSend = async () => {
  if (!await sendLimiter.checkLimit(userId)) {
    alert('You're sending messages too quickly. Please slow down.');
    return;
  }

  // Send message
};
```

---

## ♿ Accessibility

### **ARIA Labels**

```svelte
<form aria-label="Message composer" onsubmit={handleSubmit}>
	<textarea aria-label="Message content" aria-required="true" aria-multiline="true"></textarea>

	<button type="submit" aria-label="Send message"> Send </button>
</form>
```

### **Keyboard Shortcuts**

- **Enter**: Send message (if `submitOnEnter` is true)
- **Shift+Enter**: New line
- **Ctrl+V / Cmd+V**: Paste (including images)
- **Escape**: Cancel/close emoji picker

---

## ⚡ Performance

### **Debounced Auto-save**

```typescript
import { debounce } from '$lib/utils';

const saveDraft = debounce((content: string) => {
	localStorage.setItem(draftKey, content);
}, 1000);
```

---

## 🧪 Testing

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Composer } from '@equaltoai/greater-components-fediverse/Messages';

test('sends message on submit', async () => {
	const onSendMessage = vi.fn().mockResolvedValue({});

	const { getByRole } = render(Composer, {
		props: { onSendMessage },
	});

	const textarea = getByRole('textbox');
	const sendButton = getByRole('button', { name: /send/i });

	await fireEvent.input(textarea, { target: { value: 'Hello!' } });
	await fireEvent.click(sendButton);

	expect(onSendMessage).toHaveBeenCalledWith(expect.any(String), 'Hello!', undefined);
});
```

---

## 🔗 Related Components

- [Messages.Root](/docs/components/Messages/Root.md) - Context provider
- [Messages.Thread](/docs/components/Messages/Thread.md) - Message display
- [Messages.MediaUpload](/docs/components/Messages/MediaUpload.md) - Media attachments

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Keyboard Shortcuts Guide](/docs/guides/keyboard-shortcuts.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0
