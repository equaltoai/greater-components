# Messages.NewConversation

**Component**: New Conversation Modal  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 72 passing tests

---

## 📋 Overview

`Messages.NewConversation` provides a modal interface for starting new direct message conversations. It includes participant search, selection, multi-participant conversations (group chats), and instant conversation creation.

### **Key Features**:

- ✅ Modal dialog interface
- ✅ User search with real-time results
- ✅ Participant selection (single or multiple)
- ✅ Search debouncing for performance
- ✅ Selected participants display
- ✅ Group conversation support
- ✅ Keyboard navigation (arrows, Enter, Escape)
- ✅ Empty state for no results
- ✅ Loading states during search
- ✅ Error handling
- ✅ Recent/suggested contacts
- ✅ Accessible ARIA labels
- ✅ Custom styling support

### **What It Does**:

`Messages.NewConversation` manages the new conversation creation flow:

1. **Modal UI**: Opens a modal dialog for creating conversations
2. **Search**: Allows searching for users to add as participants
3. **Selection**: Manages selected participants with add/remove functionality
4. **Validation**: Ensures at least one participant is selected
5. **Creation**: Creates the conversation via context handler
6. **Navigation**: Automatically selects the newly created conversation

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
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ participantIds }),
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers}>
	<Messages.NewConversation />
	<Messages.Conversations currentUserId="me" />
	<Messages.Thread />
</Messages.Root>
```

### **With All Features**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showNewConversation = $state(false);

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onSearchParticipants: async (query: string) => {
			if (query.trim().length < 2) {
				return [];
			}

			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Search failed');
			}

			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ participantIds }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create conversation');
			}

			const conversation = await response.json();

			// Close modal
			showNewConversation = false;

			return conversation;
		},
	};
</script>

<div class="messaging-app">
	<Messages.Root {handlers} autoFetch={true}>
		<div class="layout">
			<aside class="sidebar">
				<header class="sidebar-header">
					<h2>Messages</h2>
					<button
						class="new-conversation-button"
						onclick={() => {
							showNewConversation = true;
						}}
						aria-label="Start new conversation"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
						</svg>
					</button>
				</header>
				<Messages.Conversations currentUserId={$authStore.userId} />
			</aside>

			<main class="main-content">
				<Messages.Thread />
				<Messages.Composer />
			</main>
		</div>

		{#if showNewConversation}
			<Messages.NewConversation
				onClose={() => {
					showNewConversation = false;
				}}
				allowMultiple={true}
				maxParticipants={10}
				class="custom-new-conversation"
			/>
		{/if}
	</Messages.Root>
</div>

<style>
	.messaging-app {
		height: 100vh;
	}

	.layout {
		display: grid;
		grid-template-columns: 380px 1fr;
		height: 100%;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--border-color, #e1e8ed);
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.new-conversation-button {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.new-conversation-button:hover {
		transform: scale(1.1);
	}

	.new-conversation-button svg {
		width: 1.5rem;
		height: 1.5rem;
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
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ participantIds }),
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers}>
	<Messages.NewConversation class="custom-modal" />
</Messages.Root>

<style>
	:global(.custom-modal) {
		--modal-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		--modal-text-color: white;
		--modal-border-radius: 1.5rem;
		--modal-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
	}

	:global(.custom-modal .modal-content) {
		background: var(--modal-bg);
		color: var(--modal-text-color);
		border-radius: var(--modal-border-radius);
		box-shadow: var(--modal-shadow);
	}

	:global(.custom-modal input) {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	:global(.custom-modal input::placeholder) {
		color: rgba(255, 255, 255, 0.7);
	}
</style>
```

---

## 🎛️ Props

| Prop              | Type         | Default     | Required | Description                                        |
| ----------------- | ------------ | ----------- | -------- | -------------------------------------------------- |
| `onClose`         | `() => void` | `undefined` | No       | Callback when modal is closed                      |
| `allowMultiple`   | `boolean`    | `false`     | No       | Allow selecting multiple participants (group chat) |
| `maxParticipants` | `number`     | `10`        | No       | Maximum participants for group conversations       |
| `showRecent`      | `boolean`    | `true`      | No       | Show recent/suggested contacts                     |
| `class`           | `string`     | `''`        | No       | Custom CSS class for the modal                     |

---

## 📤 Events

The component interacts with the Messages context and uses handlers from `Messages.Root`:

### **Used Handlers**:

- `onSearchParticipants`: Searches for users to add as participants
- `onCreateConversation`: Creates a new conversation with selected participants

### **Context Updates**:

When a conversation is created:

1. Calls `createConversation(participantIds)` from context handler
2. Adds the new conversation to the conversations list
3. Selects the newly created conversation
4. Closes the modal
5. Updates `selectedConversation` in state

---

## 💡 Examples

### **Example 1: Basic New Conversation Modal**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showModal = $state(false);

	const handlers = {
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ participantIds }),
			});

			const conversation = await response.json();
			showModal = false;
			return conversation;
		},
	};
</script>

<div class="messages-app">
	<Messages.Root {handlers} autoFetch={true}>
		<div class="toolbar">
			<h1>Messages</h1>
			<button
				class="btn-primary"
				onclick={() => {
					showModal = true;
				}}
			>
				New Message
			</button>
		</div>

		<div class="layout">
			<Messages.Conversations currentUserId={$authStore.userId} />
			<div class="thread-area">
				<Messages.Thread />
				<Messages.Composer />
			</div>
		</div>

		{#if showModal}
			<Messages.NewConversation
				onClose={() => {
					showModal = false;
				}}
			/>
		{/if}
	</Messages.Root>
</div>

<style>
	.messages-app {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.toolbar h1 {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 700;
	}

	.btn-primary {
		padding: 0.5rem 1.5rem;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 2rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.btn-primary:hover {
		background: #1a91da;
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

### **Example 2: With Group Conversation Support**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import type { MessageParticipant } from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showModal = $state(false);
	let selectedParticipants = $state<MessageParticipant[]>([]);

	const handlers = {
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			console.log('Creating conversation with:', participantIds);

			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({
					participantIds,
					type: participantIds.length > 1 ? 'group' : 'direct',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to create conversation');
			}

			const conversation = await response.json();

			// Reset state
			selectedParticipants = [];
			showModal = false;

			return conversation;
		},
	};
</script>

<div class="group-conversations-app">
	<Messages.Root {handlers} autoFetch={true}>
		<div class="layout">
			<aside class="sidebar">
				<header class="sidebar-header">
					<h2>Messages</h2>
					<button
						class="new-message-btn"
						onclick={() => {
							showModal = true;
						}}
						aria-label="Start new conversation"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
							/>
						</svg>
						<span>New</span>
					</button>
				</header>

				<Messages.Conversations currentUserId={$authStore.userId} />
			</aside>

			<main class="main-content">
				<Messages.Thread />
				<Messages.Composer />
			</main>
		</div>

		{#if showModal}
			<Messages.NewConversation
				onClose={() => {
					showModal = false;
				}}
				allowMultiple={true}
				maxParticipants={20}
			/>
		{/if}
	</Messages.Root>
</div>

<style>
	.group-conversations-app {
		height: 100vh;
	}

	.layout {
		display: grid;
		grid-template-columns: 380px 1fr;
		height: 100%;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--border-color, #e1e8ed);
		background: var(--background-secondary, #f7f9fa);
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.new-message-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 2rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.new-message-btn:hover {
		background: #1a91da;
	}

	.new-message-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.main-content {
		display: flex;
		flex-direction: column;
	}
</style>
```

### **Example 3: With Recent Contacts**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import type { MessageParticipant } from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showModal = $state(false);
	let recentContacts = $state<MessageParticipant[]>([]);

	// Load recent contacts
	$effect(() => {
		if (showModal) {
			loadRecentContacts();
		}
	});

	const loadRecentContacts = async () => {
		try {
			const response = await fetch('/api/messages/recent-contacts', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});

			recentContacts = await response.json();
		} catch (error) {
			console.error('Failed to load recent contacts:', error);
		}
	};

	const handlers = {
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ participantIds }),
			});

			const conversation = await response.json();
			showModal = false;
			return conversation;
		},
	};
</script>

<div class="recent-contacts-app">
	<Messages.Root {handlers} autoFetch={true}>
		<button
			class="fab"
			onclick={() => {
				showModal = true;
			}}
			aria-label="New conversation"
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
			</svg>
		</button>

		<Messages.Conversations currentUserId={$authStore.userId} />
		<Messages.Thread />
		<Messages.Composer />

		{#if showModal}
			<Messages.NewConversation
				onClose={() => {
					showModal = false;
				}}
				showRecent={true}
			>
				{#snippet recentContactsList()}
					{#if recentContacts.length > 0}
						<div class="recent-section">
							<h3>Recent Contacts</h3>
							<div class="contacts-list">
								{#each recentContacts as contact}
									<button class="contact-item">
										<img src={contact.avatar} alt={contact.displayName} />
										<div class="contact-info">
											<strong>{contact.displayName}</strong>
											<span>@{contact.username}</span>
										</div>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				{/snippet}
			</Messages.NewConversation>
		{/if}
	</Messages.Root>
</div>

<style>
	.recent-contacts-app {
		height: 100vh;
		position: relative;
	}

	.fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 50%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: transform 0.2s ease;
		z-index: 100;
	}

	.fab:hover {
		transform: scale(1.1);
	}

	.fab svg {
		width: 1.75rem;
		height: 1.75rem;
	}

	.recent-section {
		padding: 1rem;
	}

	.recent-section h3 {
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary, #657786);
	}

	.contacts-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem;
		border: none;
		background: transparent;
		text-align: left;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.contact-item:hover {
		background: var(--background-hover, #f7f9fa);
	}

	.contact-item img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
	}

	.contact-info strong {
		font-size: 0.9375rem;
		color: var(--text-primary, #14171a);
	}

	.contact-info span {
		font-size: 0.875rem;
		color: var(--text-secondary, #657786);
	}
</style>
```

### **Example 4: With Validation and Error Handling**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showModal = $state(false);
	let errorMessage = $state<string | null>(null);
	let isCreating = $state(false);

	const handlers = {
		onSearchParticipants: async (query: string) => {
			try {
				const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
					headers: {
						Authorization: `Bearer ${$authStore.token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Search failed');
				}

				return await response.json();
			} catch (error) {
				console.error('Search error:', error);
				errorMessage = 'Failed to search users. Please try again.';
				return [];
			}
		},

		onCreateConversation: async (participantIds: string[]) => {
			// Validation
			if (participantIds.length === 0) {
				errorMessage = 'Please select at least one participant';
				throw new Error('No participants selected');
			}

			if (participantIds.length > 10) {
				errorMessage = 'Maximum 10 participants allowed';
				throw new Error('Too many participants');
			}

			isCreating = true;
			errorMessage = null;

			try {
				const response = await fetch('/api/messages/conversations', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${$authStore.token}`,
					},
					body: JSON.stringify({ participantIds }),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || 'Failed to create conversation');
				}

				const conversation = await response.json();
				showModal = false;
				errorMessage = null;
				return conversation;
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
				throw error;
			} finally {
				isCreating = false;
			}
		},
	};
</script>

<div class="validated-conversation-app">
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

	<Messages.Root {handlers} autoFetch={true}>
		<button
			class="new-message-button"
			onclick={() => {
				showModal = true;
				errorMessage = null;
			}}
		>
			New Message
		</button>

		<Messages.Conversations currentUserId={$authStore.userId} />
		<Messages.Thread />
		<Messages.Composer />

		{#if showModal}
			<Messages.NewConversation
				onClose={() => {
					showModal = false;
					errorMessage = null;
				}}
				allowMultiple={true}
				maxParticipants={10}
			/>

			{#if isCreating}
				<div class="creating-overlay">
					<div class="spinner"></div>
					<span>Creating conversation...</span>
				</div>
			{/if}
		{/if}
	</Messages.Root>
</div>

<style>
	.validated-conversation-app {
		height: 100vh;
		position: relative;
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

	.new-message-button {
		padding: 0.75rem 1.5rem;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 2rem;
		font-weight: 600;
		cursor: pointer;
	}

	.creating-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 1.125rem;
		z-index: 1001;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
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

### **Example 5: With Keyboard Navigation**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import type { MessageParticipant } from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showModal = $state(false);
	let searchResults = $state<MessageParticipant[]>([]);
	let selectedIndex = $state(0);

	const handleKeydown = (event: KeyboardEvent) => {
		if (!showModal) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
				break;

			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;

			case 'Enter':
				event.preventDefault();
				if (searchResults[selectedIndex]) {
					selectParticipant(searchResults[selectedIndex]);
				}
				break;

			case 'Escape':
				event.preventDefault();
				showModal = false;
				break;
		}
	};

	const selectParticipant = (participant: MessageParticipant) => {
		console.log('Selected:', participant.username);
		// Add to selected participants
	};

	const handlers = {
		onSearchParticipants: async (query: string) => {
			const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});

			const results = await response.json();
			searchResults = results;
			selectedIndex = 0; // Reset selection
			return results;
		},

		onCreateConversation: async (participantIds: string[]) => {
			const response = await fetch('/api/messages/conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authStore.token}`,
				},
				body: JSON.stringify({ participantIds }),
			});

			const conversation = await response.json();
			showModal = false;
			return conversation;
		},
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="keyboard-nav-app">
	<Messages.Root {handlers} autoFetch={true}>
		<button
			onclick={() => {
				showModal = true;
			}}
		>
			New Conversation
		</button>

		<Messages.Conversations currentUserId={$authStore.userId} />
		<Messages.Thread />
		<Messages.Composer />

		{#if showModal}
			<Messages.NewConversation
				onClose={() => {
					showModal = false;
				}}
			/>
		{/if}
	</Messages.Root>

	{#if showModal}
		<div class="keyboard-hint">
			<kbd>↑</kbd> <kbd>↓</kbd> Navigate • <kbd>Enter</kbd> Select • <kbd>Esc</kbd> Close
		</div>
	{/if}
</div>

<style>
	.keyboard-nav-app {
		height: 100vh;
		position: relative;
	}

	.keyboard-hint {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		background: rgba(0, 0, 0, 0.8);
		color: white;
		border-radius: 2rem;
		font-size: 0.875rem;
		z-index: 1001;
	}

	kbd {
		padding: 0.25rem 0.5rem;
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.75rem;
	}
</style>
```

---

## 🔒 Security Considerations

### **User Search Privacy**

Only allow searching for public users or connections:

```typescript
// Server-side
app.get('/api/search/users', authenticateUser, async (req, res) => {
	const { q: query } = req.query;

	// Only search users who:
	// 1. Have public profiles
	// 2. Are already connections
	// 3. Allow messages from anyone
	const users = await User.find({
		$or: [
			{ isPublic: true },
			{ _id: { $in: req.user.connections } },
			{ allowMessagesFrom: 'anyone' },
		],
		$or: [
			{ username: { $regex: query, $options: 'i' } },
			{ displayName: { $regex: query, $options: 'i' } },
		],
	}).limit(50);

	res.json(users);
});
```

### **Rate Limiting**

Prevent spam by rate limiting conversation creation:

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const createConversationLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 conversations per minute
});

const handleCreate = async (participantIds: string[]) => {
  if (!await createConversationLimiter.checkLimit(userId)) {
    throw new Error('You're creating conversations too quickly. Please slow down.');
  }

  // Create conversation
};
```

---

## ♿ Accessibility

### **ARIA Labels**

```svelte
<div role="dialog" aria-modal="true" aria-labelledby="new-conversation-title">
	<h2 id="new-conversation-title">New Conversation</h2>

	<input
		type="search"
		role="searchbox"
		aria-label="Search for users"
		aria-autocomplete="list"
		aria-controls="search-results"
	/>

	<ul id="search-results" role="listbox">
		{#each results as result}
			<li role="option" aria-selected={selected === result.id}>
				{result.displayName}
			</li>
		{/each}
	</ul>
</div>
```

### **Keyboard Navigation**

- **↑/↓ Arrow keys**: Navigate search results
- **Enter**: Select user/create conversation
- **Escape**: Close modal
- **Tab**: Navigate between elements

---

## ⚡ Performance

### **Debounced Search**

```typescript
import { debounce } from '$lib/utils';

const searchUsers = debounce(async (query: string) => {
	const results = await onSearchParticipants(query);
	searchResults = results;
}, 300);
```

---

## 🧪 Testing

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { NewConversation } from '@equaltoai/greater-components-fediverse/Messages';

test('creates conversation on submit', async () => {
	const onCreateConversation = vi.fn().mockResolvedValue({});
	const onSearchParticipants = vi
		.fn()
		.mockResolvedValue([{ id: '1', username: 'user1', displayName: 'User 1' }]);

	const { getByRole, getByText } = render(NewConversation, {
		props: { onCreateConversation, onSearchParticipants },
	});

	const searchInput = getByRole('searchbox');
	await fireEvent.input(searchInput, { target: { value: 'user1' } });

	const user = await getByText('User 1');
	await fireEvent.click(user);

	const createButton = getByRole('button', { name: /create/i });
	await fireEvent.click(createButton);

	expect(onCreateConversation).toHaveBeenCalledWith(['1']);
});
```

---

## 🔗 Related Components

- [Messages.Root](/docs/components/Messages/Root.md) - Context provider
- [Messages.Conversations](/docs/components/Messages/Conversations.md) - Conversations list
- [Messages.Composer](/docs/components/Messages/Composer.md) - Message input

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Modal Patterns Guide](/docs/guides/modals.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0
