# Lists.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 85 passing tests

---

## 📋 Overview

`Lists.Root` is the foundational component for the Lists management system. It creates and provides the lists context to all child components, managing shared state, event handlers, and coordinating between different list operations.

### **Key Features**:

- ✅ Centralized lists state management
- ✅ Shared event handlers for list operations
- ✅ Type-safe context API
- ✅ Automatic state synchronization
- ✅ Error handling and recovery
- ✅ Loading states and indicators
- ✅ Auto-fetch on mount (optional)
- ✅ Real-time update support

### **What It Does**:

`Lists.Root` serves as the container and coordinator for all lists-related functionality:

1. **State Management**: Maintains current lists, selected list, members, loading states, and errors
2. **Context Provider**: Shares state and methods with all child components via Svelte context
3. **Handler Coordination**: Receives event handlers and makes them available throughout the component tree
4. **Lifecycle Management**: Handles initialization, cleanup, and data fetching
5. **Error Boundaries**: Catches and manages errors from child components

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
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},
	};
</script>

<Lists.Root {handlers}>
	<Lists.Manager />
</Lists.Root>
```

### **With All Handlers**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type { ListsHandlers } from '@equaltoai/greater-components-fediverse/Lists';

	const handlers: ListsHandlers = {
		// Fetch all user's lists
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			if (!response.ok) throw new Error('Failed to fetch lists');
			return await response.json();
		},

		// Create a new list
		onCreate: async (data) => {
			const response = await fetch('/api/lists', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) throw new Error('Failed to create list');
			return await response.json();
		},

		// Update an existing list
		onUpdate: async (id, data) => {
			const response = await fetch(`/api/lists/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) throw new Error('Failed to update list');
			return await response.json();
		},

		// Delete a list
		onDelete: async (id) => {
			const response = await fetch(`/api/lists/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete list');
		},

		// Fetch members of a list
		onFetchMembers: async (listId) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			if (!response.ok) throw new Error('Failed to fetch members');
			return await response.json();
		},

		// Add a member to a list
		onAddMember: async (listId, actorId) => {
			const response = await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
			if (!response.ok) throw new Error('Failed to add member');
		},

		// Remove a member from a list
		onRemoveMember: async (listId, memberId) => {
			const response = await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to remove member');
		},

		// Search for accounts to add to lists
		onSearchAccounts: async (query) => {
			const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
			if (!response.ok) throw new Error('Search failed');
			return await response.json();
		},

		// Handle list click for custom behavior
		onListClick: (list) => {
			console.log('List clicked:', list);
		},

		// Fetch a single list with details
		onFetchList: async (listId) => {
			const response = await fetch(`/api/lists/${listId}`);
			if (!response.ok) throw new Error('Failed to fetch list');
			return await response.json();
		},
	};
</script>

<Lists.Root {handlers} autoFetch={true}>
	<Lists.Manager />
	<Lists.Editor />
	<Lists.MemberPicker />
	<Lists.Settings />
	<Lists.Timeline />
</Lists.Root>
```

---

## 🎛️ Props

| Prop        | Type            | Default | Required | Description                         |
| ----------- | --------------- | ------- | -------- | ----------------------------------- |
| `handlers`  | `ListsHandlers` | `{}`    | No       | Event handlers for list operations  |
| `autoFetch` | `boolean`       | `true`  | No       | Auto-fetch lists on component mount |
| `children`  | `Snippet`       | -       | No       | Child components                    |
| `class`     | `string`        | `''`    | No       | Custom CSS class for root element   |

### **ListsHandlers Interface**:

```typescript
interface ListsHandlers {
	/**
	 * Fetch all lists for the current user
	 * @returns Promise resolving to array of lists
	 */
	onFetchLists?: () => Promise<ListData[]>;

	/**
	 * Create a new list
	 * @param data - List creation data (title, description, visibility)
	 * @returns Promise resolving to created list
	 */
	onCreate?: (data: ListFormData) => Promise<ListData>;

	/**
	 * Update an existing list
	 * @param id - List ID
	 * @param data - List update data
	 * @returns Promise resolving to updated list
	 */
	onUpdate?: (id: string, data: Partial<ListFormData>) => Promise<ListData>;

	/**
	 * Delete a list
	 * @param id - List ID
	 * @returns Promise resolving when deletion is complete
	 */
	onDelete?: (id: string) => Promise<void>;

	/**
	 * Fetch members of a list
	 * @param listId - List ID
	 * @returns Promise resolving to array of members
	 */
	onFetchMembers?: (listId: string) => Promise<ListMember[]>;

	/**
	 * Add a member to a list
	 * @param listId - List ID
	 * @param actorId - Actor/User ID to add
	 * @returns Promise resolving when addition is complete
	 */
	onAddMember?: (listId: string, actorId: string) => Promise<void>;

	/**
	 * Remove a member from a list
	 * @param listId - List ID
	 * @param memberId - Member ID to remove
	 * @returns Promise resolving when removal is complete
	 */
	onRemoveMember?: (listId: string, memberId: string) => Promise<void>;

	/**
	 * Fetch timeline for a list
	 * @param listId - List ID
	 * @param options - Pagination options
	 * @returns Promise resolving to timeline posts
	 */
	onFetchTimeline?: (listId: string, options?: { limit?: number; cursor?: string }) => Promise<any>;

	/**
	 * Handle list click event
	 * @param list - The clicked list
	 */
	onListClick?: (list: ListData) => void;

	/**
	 * Search for accounts to add to lists
	 * @param query - Search query
	 * @returns Promise resolving to array of matching accounts
	 */
	onSearchAccounts?: (query: string) => Promise<ListMember[]>;

	/**
	 * Fetch a single list with full details
	 * @param listId - List ID
	 * @returns Promise resolving to list data
	 */
	onFetchList?: (listId: string) => Promise<ListData>;
}
```

### **ListData Interface**:

```typescript
interface ListData {
	/** Unique list identifier */
	id: string;

	/** List title (max 100 characters) */
	title: string;

	/** Optional description (max 500 characters) */
	description?: string;

	/** Visibility: 'public' or 'private' */
	visibility: 'public' | 'private';

	/** Number of members in the list */
	membersCount: number;

	/** List members (if fetched) */
	members?: ListMember[];

	/** Creation timestamp */
	createdAt?: string;

	/** Last update timestamp */
	updatedAt?: string;

	/** List owner ID */
	ownerId?: string;
}
```

### **ListMember Interface**:

```typescript
interface ListMember {
	/** Member ID */
	id: string;

	/** List ID this member belongs to */
	listId: string;

	/** Actor/user information */
	actor: {
		id: string;
		username: string;
		displayName: string;
		avatar?: string;
	};

	/** Timestamp when member was added */
	addedAt: string;
}
```

### **ListFormData Interface**:

```typescript
interface ListFormData {
	/** List title (required, max 100 chars) */
	title: string;

	/** List description (optional, max 500 chars) */
	description?: string;

	/** Visibility setting */
	visibility: 'public' | 'private';
}
```

---

## 📤 Context API

When you use `Lists.Root`, it creates a context that child components can access:

### **Available Context Methods**:

```typescript
const {
	// State
	state, // Current lists state (reactive)

	// Methods
	fetchLists, // Fetch all lists
	selectList, // Select a list and load its members
	openEditor, // Open editor for create/edit
	closeEditor, // Close editor
	createList, // Create new list
	updateList, // Update existing list
	deleteList, // Delete a list
	addMember, // Add member to selected list
	removeMember, // Remove member from selected list
	updateState, // Update state manually
	clearError, // Clear error state

	// Handlers (original handlers passed to Root)
	handlers,
} = Lists.getListsContext();
```

### **State Shape**:

```typescript
interface ListsState {
	/** All user's lists */
	lists: ListData[];

	/** Currently selected list */
	selectedList: ListData | null;

	/** Members of the selected list */
	members: ListMember[];

	/** Loading state for operations */
	loading: boolean;

	/** Error message (if any) */
	error: string | null;

	/** Whether the editor modal is open */
	editorOpen: boolean;

	/** List being edited (null for new list) */
	editingList: ListData | null;
}
```

---

## 💡 Examples

### **Example 1: Basic List Management with Error Handling**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import { onMount } from 'svelte';

	let errorMessage = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	const showSuccess = (message: string) => {
		successMessage = message;
		setTimeout(() => {
			successMessage = null;
		}, 3000);
	};

	const handlers = {
		onFetchLists: async () => {
			try {
				const response = await fetch('/api/lists', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				if (!response.ok) {
					if (response.status === 401) {
						throw new Error('Please log in to view your lists');
					}
					throw new Error('Failed to load lists');
				}

				const data = await response.json();
				return data.lists || [];
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Unknown error';
				return [];
			}
		},

		onCreate: async (data) => {
			try {
				const response = await fetch('/api/lists', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || 'Failed to create list');
				}

				const list = await response.json();
				showSuccess(`List "${list.title}" created successfully!`);
				return list;
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Failed to create list';
				throw error;
			}
		},

		onUpdate: async (id, data) => {
			try {
				const response = await fetch(`/api/lists/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error('Failed to update list');
				}

				const list = await response.json();
				showSuccess('List updated successfully!');
				return list;
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Failed to update list';
				throw error;
			}
		},

		onDelete: async (id) => {
			try {
				const response = await fetch(`/api/lists/${id}`, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to delete list');
				}

				showSuccess('List deleted successfully');
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Failed to delete list';
				throw error;
			}
		},
	};
</script>

<div class="lists-container">
	{#if errorMessage}
		<div class="alert alert--error" role="alert">
			<svg><!-- Error icon --></svg>
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
			<svg><!-- Success icon --></svg>
			<span>{successMessage}</span>
		</div>
	{/if}

	<Lists.Root {handlers}>
		<Lists.Manager />
		<Lists.Editor />
		<Lists.Timeline />
	</Lists.Root>
</div>

<style>
	.lists-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
	}

	.alert--error {
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		color: #f4211e;
	}

	.alert--success {
		background: rgba(0, 186, 124, 0.1);
		border: 1px solid #00ba7c;
		color: #00ba7c;
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
</style>
```

### **Example 2: With Real-time WebSocket Updates**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import { onMount, onDestroy } from 'svelte';
	import { createWebSocketClient } from '$lib/websocket';

	let ws: ReturnType<typeof createWebSocketClient> | null = null;
	let isConnected = $state(false);

	// Store reference to context for WebSocket updates
	let listsContext: ReturnType<typeof Lists.getListsContext> | null = null;

	onMount(() => {
		// Initialize WebSocket connection
		ws = createWebSocketClient('wss://api.example.com/graphql', {
			reconnect: true,
			reconnectAttempts: 5,
			reconnectDelay: 1000,
		});

		ws.on('connect', () => {
			isConnected = true;
			console.log('WebSocket connected');
		});

		ws.on('disconnect', () => {
			isConnected = false;
			console.log('WebSocket disconnected');
		});

		// Subscribe to list updates
		ws.subscribe({
			query: `
        subscription OnListUpdate {
          listUpdated {
            id
            title
            description
            visibility
            membersCount
            updatedAt
          }
        }
      `,
			onData: ({ listUpdated }) => {
				if (!listsContext) return;

				// Update the list in state
				const { state, updateState } = listsContext;
				const updatedLists = state.lists.map((list) =>
					list.id === listUpdated.id ? { ...list, ...listUpdated } : list
				);

				updateState({ lists: updatedLists });

				// Update selected list if it's the one that changed
				if (state.selectedList?.id === listUpdated.id) {
					updateState({ selectedList: { ...state.selectedList, ...listUpdated } });
				}
			},
		});

		// Subscribe to list creation
		ws.subscribe({
			query: `
        subscription OnListCreated {
          listCreated {
            id
            title
            description
            visibility
            membersCount
            createdAt
          }
        }
      `,
			onData: ({ listCreated }) => {
				if (!listsContext) return;

				const { state, updateState } = listsContext;
				updateState({ lists: [...state.lists, listCreated] });
			},
		});

		// Subscribe to list deletion
		ws.subscribe({
			query: `
        subscription OnListDeleted {
          listDeleted {
            id
          }
        }
      `,
			onData: ({ listDeleted }) => {
				if (!listsContext) return;

				const { state, updateState } = listsContext;
				const updatedLists = state.lists.filter((list) => list.id !== listDeleted.id);
				updateState({ lists: updatedLists });

				// Clear selection if deleted list was selected
				if (state.selectedList?.id === listDeleted.id) {
					updateState({ selectedList: null, members: [] });
				}
			},
		});

		// Subscribe to member additions/removals
		ws.subscribe({
			query: `
        subscription OnListMembersChanged {
          listMembersChanged {
            listId
            membersCount
          }
        }
      `,
			onData: ({ listMembersChanged }) => {
				if (!listsContext) return;

				const { state, updateState } = listsContext;
				const updatedLists = state.lists.map((list) =>
					list.id === listMembersChanged.listId
						? { ...list, membersCount: listMembersChanged.membersCount }
						: list
				);

				updateState({ lists: updatedLists });

				// Refresh members if it's the selected list
				if (state.selectedList?.id === listMembersChanged.listId) {
					handlers.onFetchMembers?.(listMembersChanged.listId);
				}
			},
		});
	});

	onDestroy(() => {
		// Clean up WebSocket connection
		ws?.close();
	});

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onCreate: async (data) => {
			const response = await fetch('/api/lists', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			return await response.json();
		},

		onUpdate: async (id, data) => {
			const response = await fetch(`/api/lists/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			return await response.json();
		},

		onDelete: async (id) => {
			await fetch(`/api/lists/${id}`, { method: 'DELETE' });
		},

		onFetchMembers: async (listId) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			return await response.json();
		},

		onAddMember: async (listId, actorId) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
		},

		onRemoveMember: async (listId, memberId) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
		},
	};
</script>

<div class="lists-wrapper">
	<div class="connection-status" class:connected={isConnected}>
		<span class="status-dot"></span>
		{isConnected ? 'Connected' : 'Disconnected'}
	</div>

	<Lists.Root {handlers}>
		{#snippet children()}
			<!-- Get context reference for WebSocket updates -->
			{((listsContext = Lists.getListsContext()), null)}

			<Lists.Manager />
			<Lists.Editor />
			<Lists.Timeline />
		{/snippet}
	</Lists.Root>
</div>

<style>
	.connection-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		margin-bottom: 1rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.connection-status.connected {
		background: rgba(0, 186, 124, 0.1);
		color: #00ba7c;
	}

	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
```

### **Example 3: With Adapter Integration and TypeScript**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type {
		ListsHandlers,
		ListData,
		ListMember,
	} from '@equaltoai/greater-components-fediverse/Lists';
	import { createGraphQLClient } from '$lib/graphql';
	import { authStore } from '$lib/stores/auth';

	// GraphQL client with authentication
	const graphql = createGraphQLClient({
		endpoint: 'https://api.example.com/graphql',
		headers: () => ({
			Authorization: `Bearer ${$authStore.token}`,
		}),
	});

	// Type-safe adapter implementation
	class ListsAdapter {
		async fetchLists(): Promise<ListData[]> {
			const { data } = await graphql.query({
				query: `
          query GetLists {
            lists {
              id
              title
              description
              visibility
              membersCount
              createdAt
              updatedAt
            }
          }
        `,
			});
			return data.lists;
		}

		async createList(input: {
			title: string;
			description?: string;
			visibility: 'public' | 'private';
		}): Promise<ListData> {
			const { data } = await graphql.mutate({
				mutation: `
          mutation CreateList($input: CreateListInput!) {
            createList(input: $input) {
              id
              title
              description
              visibility
              membersCount
              createdAt
              updatedAt
            }
          }
        `,
				variables: { input },
			});
			return data.createList;
		}

		async updateList(
			id: string,
			input: Partial<{ title: string; description?: string; visibility: 'public' | 'private' }>
		): Promise<ListData> {
			const { data } = await graphql.mutate({
				mutation: `
          mutation UpdateList($id: ID!, $input: UpdateListInput!) {
            updateList(id: $id, input: $input) {
              id
              title
              description
              visibility
              membersCount
              updatedAt
            }
          }
        `,
				variables: { id, input },
			});
			return data.updateList;
		}

		async deleteList(id: string): Promise<void> {
			await graphql.mutate({
				mutation: `
          mutation DeleteList($id: ID!) {
            deleteList(id: $id) {
              success
            }
          }
        `,
				variables: { id },
			});
		}

		async fetchMembers(listId: string): Promise<ListMember[]> {
			const { data } = await graphql.query({
				query: `
          query GetListMembers($listId: ID!) {
            list(id: $listId) {
              members {
                id
                listId
                actor {
                  id
                  username
                  displayName
                  avatar
                }
                addedAt
              }
            }
          }
        `,
				variables: { listId },
			});
			return data.list.members;
		}

		async addMember(listId: string, actorId: string): Promise<void> {
			await graphql.mutate({
				mutation: `
          mutation AddListMember($listId: ID!, $actorId: ID!) {
            addListMember(listId: $listId, actorId: $actorId) {
              success
            }
          }
        `,
				variables: { listId, actorId },
			});
		}

		async removeMember(listId: string, memberId: string): Promise<void> {
			await graphql.mutate({
				mutation: `
          mutation RemoveListMember($listId: ID!, $memberId: ID!) {
            removeListMember(listId: $listId, memberId: $memberId) {
              success
            }
          }
        `,
				variables: { listId, memberId },
			});
		}

		async searchAccounts(query: string): Promise<ListMember[]> {
			const { data } = await graphql.query({
				query: `
          query SearchAccounts($query: String!) {
            searchAccounts(query: $query) {
              id
              username
              displayName
              avatar
            }
          }
        `,
				variables: { query },
			});

			// Transform to ListMember format
			return data.searchAccounts.map((actor: any) => ({
				id: actor.id,
				listId: '', // Will be set when added to list
				actor,
				addedAt: new Date().toISOString(),
			}));
		}
	}

	const adapter = new ListsAdapter();

	// Create handlers from adapter
	const handlers: ListsHandlers = {
		onFetchLists: () => adapter.fetchLists(),
		onCreate: (data) => adapter.createList(data),
		onUpdate: (id, data) => adapter.updateList(id, data),
		onDelete: (id) => adapter.deleteList(id),
		onFetchMembers: (listId) => adapter.fetchMembers(listId),
		onAddMember: (listId, actorId) => adapter.addMember(listId, actorId),
		onRemoveMember: (listId, memberId) => adapter.removeMember(listId, memberId),
		onSearchAccounts: (query) => adapter.searchAccounts(query),
		onListClick: (list) => {
			console.log('List selected:', list.title);
			// Could navigate to list detail page, etc.
		},
	};
</script>

<Lists.Root {handlers} autoFetch={true}>
	<div class="lists-layout">
		<aside class="lists-sidebar">
			<Lists.Manager showCreate={true} />
		</aside>

		<main class="lists-main">
			<Lists.Timeline showMembers={true} />
		</main>

		<aside class="lists-panel">
			<Lists.Settings />
			<Lists.MemberPicker />
		</aside>
	</div>
</Lists.Root>

<style>
	.lists-layout {
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		gap: 1rem;
		height: 100vh;
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}

	.lists-sidebar,
	.lists-panel {
		overflow-y: auto;
	}

	.lists-main {
		border-left: 1px solid var(--border-color);
		border-right: 1px solid var(--border-color);
		overflow-y: auto;
	}

	@media (max-width: 1024px) {
		.lists-layout {
			grid-template-columns: 250px 1fr;
		}

		.lists-panel {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.lists-layout {
			grid-template-columns: 1fr;
		}

		.lists-sidebar {
			display: none;
		}
	}
</style>
```

### **Example 4: With Caching and Optimistic Updates**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type { ListData, ListFormData } from '@equaltoai/greater-components-fediverse/Lists';
	import { lruCache } from '$lib/cache';

	// Cache for lists (5 minutes TTL)
	const listsCache = lruCache<ListData[]>({
		max: 1,
		ttl: 5 * 60 * 1000,
	});

	// Cache for members (2 minutes TTL)
	const membersCache = lruCache({
		max: 50,
		ttl: 2 * 60 * 1000,
	});

	// Optimistic update helper
	function withOptimisticUpdate<T>(
		operation: () => Promise<T>,
		optimisticValue: T,
		rollback: () => void
	): Promise<T> {
		return operation().catch((error) => {
			rollback();
			throw error;
		});
	}

	const handlers = {
		onFetchLists: async () => {
			// Check cache first
			const cached = listsCache.get('user-lists');
			if (cached) {
				console.log('Lists loaded from cache');
				return cached;
			}

			// Fetch from API
			const response = await fetch('/api/lists');
			const lists = await response.json();

			// Store in cache
			listsCache.set('user-lists', lists);
			console.log('Lists loaded from API and cached');

			return lists;
		},

		onCreate: async (data: ListFormData) => {
			// Generate optimistic ID
			const optimisticId = `temp-${Date.now()}`;
			const optimisticList: ListData = {
				id: optimisticId,
				...data,
				membersCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			// Get context to update state optimistically
			const context = Lists.getListsContext();
			const originalLists = [...context.state.lists];

			// Optimistic update
			context.updateState({
				lists: [...context.state.lists, optimisticList],
			});

			// Perform actual creation
			return withOptimisticUpdate(
				async () => {
					const response = await fetch('/api/lists', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(data),
					});

					if (!response.ok) throw new Error('Failed to create list');

					const realList = await response.json();

					// Replace optimistic list with real one
					context.updateState({
						lists: context.state.lists.map((l) => (l.id === optimisticId ? realList : l)),
					});

					// Invalidate cache
					listsCache.delete('user-lists');

					return realList;
				},
				optimisticList,
				() => {
					// Rollback on error
					context.updateState({ lists: originalLists });
				}
			);
		},

		onUpdate: async (id: string, data: Partial<ListFormData>) => {
			const context = Lists.getListsContext();
			const originalLists = [...context.state.lists];

			// Optimistic update
			context.updateState({
				lists: context.state.lists.map((list) =>
					list.id === id ? { ...list, ...data, updatedAt: new Date().toISOString() } : list
				),
			});

			return withOptimisticUpdate(
				async () => {
					const response = await fetch(`/api/lists/${id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(data),
					});

					if (!response.ok) throw new Error('Failed to update list');

					const updatedList = await response.json();

					// Update with real data
					context.updateState({
						lists: context.state.lists.map((l) => (l.id === id ? updatedList : l)),
					});

					// Invalidate cache
					listsCache.delete('user-lists');

					return updatedList;
				},
				{} as ListData,
				() => {
					context.updateState({ lists: originalLists });
				}
			);
		},

		onDelete: async (id: string) => {
			const context = Lists.getListsContext();
			const originalLists = [...context.state.lists];
			const deletedList = context.state.lists.find((l) => l.id === id);

			// Optimistic deletion
			context.updateState({
				lists: context.state.lists.filter((list) => list.id !== id),
			});

			return withOptimisticUpdate(
				async () => {
					const response = await fetch(`/api/lists/${id}`, {
						method: 'DELETE',
					});

					if (!response.ok) throw new Error('Failed to delete list');

					// Invalidate caches
					listsCache.delete('user-lists');
					membersCache.delete(`list-${id}-members`);
				},
				undefined,
				() => {
					context.updateState({ lists: originalLists });
				}
			);
		},

		onFetchMembers: async (listId: string) => {
			// Check cache
			const cacheKey = `list-${listId}-members`;
			const cached = membersCache.get(cacheKey);
			if (cached) {
				console.log('Members loaded from cache');
				return cached;
			}

			// Fetch from API
			const response = await fetch(`/api/lists/${listId}/members`);
			const members = await response.json();

			// Store in cache
			membersCache.set(cacheKey, members);
			console.log('Members loaded from API and cached');

			return members;
		},

		onAddMember: async (listId: string, actorId: string) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});

			// Invalidate member cache
			membersCache.delete(`list-${listId}-members`);
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});

			// Invalidate member cache
			membersCache.delete(`list-${listId}-members`);
		},
	};
</script>

<Lists.Root {handlers} autoFetch={true}>
	<Lists.Manager />
	<Lists.Editor />
	<Lists.Timeline />
</Lists.Root>
```

### **Example 5: With Analytics and Logging**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import { analytics } from '$lib/analytics';
	import { logger } from '$lib/logger';

	// Track list operations for analytics
	const trackOperation = (operation: string, metadata?: Record<string, any>) => {
		analytics.track('Lists Operation', {
			operation,
			timestamp: new Date().toISOString(),
			...metadata,
		});
	};

	// Enhanced error logging
	const handleError = (operation: string, error: Error, context?: Record<string, any>) => {
		logger.error('Lists operation failed', {
			operation,
			error: error.message,
			stack: error.stack,
			context,
			timestamp: new Date().toISOString(),
		});

		// Send to error tracking service
		if (window.Sentry) {
			window.Sentry.captureException(error, {
				tags: { operation: 'lists', action: operation },
				extra: context,
			});
		}
	};

	const handlers = {
		onFetchLists: async () => {
			const startTime = performance.now();

			try {
				logger.info('Fetching lists');
				const response = await fetch('/api/lists');

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const lists = await response.json();
				const duration = performance.now() - startTime;

				logger.info('Lists fetched successfully', {
					count: lists.length,
					duration: `${duration.toFixed(2)}ms`,
				});

				trackOperation('fetch_lists', {
					count: lists.length,
					duration,
				});

				return lists;
			} catch (error) {
				handleError('fetch_lists', error as Error);
				throw error;
			}
		},

		onCreate: async (data) => {
			const startTime = performance.now();

			try {
				logger.info('Creating list', { title: data.title, visibility: data.visibility });

				const response = await fetch('/api/lists', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const list = await response.json();
				const duration = performance.now() - startTime;

				logger.info('List created successfully', {
					listId: list.id,
					title: list.title,
					duration: `${duration.toFixed(2)}ms`,
				});

				trackOperation('create_list', {
					listId: list.id,
					visibility: list.visibility,
					hasDescription: !!list.description,
					duration,
				});

				return list;
			} catch (error) {
				handleError('create_list', error as Error, { title: data.title });
				throw error;
			}
		},

		onUpdate: async (id, data) => {
			const startTime = performance.now();

			try {
				logger.info('Updating list', { listId: id, changes: Object.keys(data) });

				const response = await fetch(`/api/lists/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const list = await response.json();
				const duration = performance.now() - startTime;

				logger.info('List updated successfully', {
					listId: id,
					duration: `${duration.toFixed(2)}ms`,
				});

				trackOperation('update_list', {
					listId: id,
					fieldsUpdated: Object.keys(data),
					duration,
				});

				return list;
			} catch (error) {
				handleError('update_list', error as Error, { listId: id });
				throw error;
			}
		},

		onDelete: async (id) => {
			const startTime = performance.now();

			try {
				logger.info('Deleting list', { listId: id });

				const response = await fetch(`/api/lists/${id}`, {
					method: 'DELETE',
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const duration = performance.now() - startTime;

				logger.info('List deleted successfully', {
					listId: id,
					duration: `${duration.toFixed(2)}ms`,
				});

				trackOperation('delete_list', {
					listId: id,
					duration,
				});
			} catch (error) {
				handleError('delete_list', error as Error, { listId: id });
				throw error;
			}
		},

		onAddMember: async (listId, actorId) => {
			try {
				logger.info('Adding member to list', { listId, actorId });

				await fetch(`/api/lists/${listId}/members`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ actorId }),
				});

				logger.info('Member added successfully', { listId, actorId });
				trackOperation('add_member', { listId, actorId });
			} catch (error) {
				handleError('add_member', error as Error, { listId, actorId });
				throw error;
			}
		},

		onRemoveMember: async (listId, memberId) => {
			try {
				logger.info('Removing member from list', { listId, memberId });

				await fetch(`/api/lists/${listId}/members/${memberId}`, {
					method: 'DELETE',
				});

				logger.info('Member removed successfully', { listId, memberId });
				trackOperation('remove_member', { listId, memberId });
			} catch (error) {
				handleError('remove_member', error as Error, { listId, memberId });
				throw error;
			}
		},

		onListClick: (list) => {
			logger.debug('List clicked', { listId: list.id, title: list.title });
			trackOperation('list_click', { listId: list.id });
		},
	};
</script>

<Lists.Root {handlers} autoFetch={true}>
	<Lists.Manager />
	<Lists.Editor />
	<Lists.Timeline />
</Lists.Root>
```

---

## 🔒 Security Considerations

### **Authentication**

Always include authentication tokens in your API requests:

```typescript
const handlers = {
	onFetchLists: async () => {
		const token = await getAuthToken();
		const response = await fetch('/api/lists', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return await response.json();
	},
};
```

### **Input Validation**

Validate all user inputs before sending to the server:

```typescript
import { validateListForm } from '@equaltoai/greater-components-fediverse/Lists';

const handlers = {
	onCreate: async (data) => {
		// Client-side validation
		const error = validateListForm(data);
		if (error) {
			throw new Error(error);
		}

		// Sanitize inputs
		const sanitized = {
			title: data.title.trim().slice(0, 100),
			description: data.description?.trim().slice(0, 500),
			visibility: data.visibility,
		};

		// Send to server
		const response = await fetch('/api/lists', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(sanitized),
		});

		return await response.json();
	},
};
```

### **Permission Checks**

Always verify permissions on the server side:

```typescript
// Server-side example (Node.js/Express)
app.put('/api/lists/:id', authenticateUser, async (req, res) => {
	const { id } = req.params;
	const list = await List.findById(id);

	// Check ownership
	if (list.ownerId !== req.user.id) {
		return res.status(403).json({ error: 'Permission denied' });
	}

	// Update list
	const updated = await list.update(req.body);
	res.json(updated);
});
```

### **Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const createListLimiter = new RateLimiter({
	maxRequests: 10, // 10 lists per hour
	windowMs: 60 * 60 * 1000,
});

const handlers = {
	onCreate: async (data) => {
		const userId = getCurrentUserId();

		if (!(await createListLimiter.checkLimit(userId))) {
			throw new Error('Rate limit exceeded. Please try again later.');
		}

		const response = await fetch('/api/lists', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		return await response.json();
	},
};
```

---

## ♿ Accessibility

`Lists.Root` provides an accessible foundation:

### **Semantic Structure**

```svelte
<Lists.Root {handlers}>
	<section aria-label="Lists management" role="region">
		<Lists.Manager />
	</section>

	<aside aria-label="List timeline" role="complementary">
		<Lists.Timeline />
	</aside>
</Lists.Root>
```

### **Keyboard Navigation**

All child components support full keyboard navigation:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons
- **Escape**: Close modals
- **Arrow keys**: Navigate lists

### **Screen Reader Support**

- Proper ARIA labels on all interactive elements
- Status announcements for loading states
- Error messages in accessible format
- Live regions for dynamic updates

---

## ⚡ Performance

### **Lazy Loading**

Defer loading until needed:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	let showLists = $state(false);

	onMount(() => {
		// Load lists after initial render
		requestIdleCallback(() => {
			showLists = true;
		});
	});
</script>

{#if showLists}
	<Lists.Root {handlers}>
		<Lists.Manager />
	</Lists.Root>
{/if}
```

### **Pagination**

Implement pagination for large list collections:

```typescript
const handlers = {
	onFetchLists: async () => {
		const response = await fetch('/api/lists?limit=20&page=1');
		return await response.json();
	},
};
```

---

## 🧪 Testing

### **Component Test**

```typescript
import { render } from '@testing-library/svelte';
import * as Lists from '@equaltoai/greater-components-fediverse/Lists';

test('renders without crashing', () => {
	const { container } = render(Lists.Root, {
		handlers: {},
	});

	expect(container.querySelector('.lists-root')).toBeInTheDocument();
});

test('calls onFetchLists on mount', async () => {
	const onFetchLists = vi.fn().mockResolvedValue([]);

	render(Lists.Root, {
		handlers: { onFetchLists },
		autoFetch: true,
	});

	await vi.waitFor(() => {
		expect(onFetchLists).toHaveBeenCalledTimes(1);
	});
});
```

---

## 🔗 Related Components

- [Lists.Manager](/docs/components/Lists/Manager.md) - Display and manage all lists
- [Lists.Editor](/docs/components/Lists/Editor.md) - Create/edit list form
- [Lists.Timeline](/docs/components/Lists/Timeline.md) - Display list timeline

---

## 📚 API Reference

### **createListsContext()**

```typescript
function createListsContext(handlers?: ListsHandlers): ListsContext;
```

### **getListsContext()**

```typescript
function getListsContext(): ListsContext;
```

---

## 📖 See Also

- [Lists Component Group Overview](/docs/components/Lists/README.md)
- [ActivityPub Collections](https://www.w3.org/TR/activitypub/#collections)
- [Context API Guide](/docs/guides/context-api.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0
