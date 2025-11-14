# Lists.MemberPicker

**Component**: List Member Management Interface  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 68 passing tests

---

## 📋 Overview

`Lists.MemberPicker` is a comprehensive interface for managing list membership. It provides search functionality to find accounts, displays current list members, and handles adding/removing members with visual feedback and error handling.

### **Key Features**:

- ✅ Real-time account search with debouncing
- ✅ Search results display with avatars
- ✅ Current members list
- ✅ Add members from search results
- ✅ Remove members with confirmation
- ✅ Duplicate prevention (can't add same member twice)
- ✅ Member count display
- ✅ Loading states for search and operations
- ✅ Empty states (no search results, no members)
- ✅ Avatar display with fallback placeholders
- ✅ Responsive layout
- ✅ Keyboard navigation support
- ✅ Accessibility features

### **What It Does**:

`Lists.MemberPicker` manages the complete member lifecycle:

1. **Search Accounts**: Provides search input with debounced queries
2. **Display Results**: Shows matching accounts with avatars and usernames
3. **Add Members**: Adds selected accounts to the current list
4. **Show Current Members**: Displays all members of the selected list
5. **Remove Members**: Removes members from the list
6. **Prevent Duplicates**: Disables "Add" button for members already in list
7. **Visual Feedback**: Shows loading spinners, success/error states
8. **Auto-refresh**: Refreshes member list after add/remove operations

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
		onSearchAccounts: async (query) => {
			const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
			return await response.json();
		},
	};
</script>

<Lists.Root {handlers}>
	<Lists.Manager />
	<Lists.MemberPicker />
</Lists.Root>
```

### **With Layout**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';

	const handlers = {
		// ... all handlers
	};
</script>

<Lists.Root {handlers}>
	<div class="lists-layout">
		<aside class="sidebar">
			<Lists.Manager />
		</aside>

		<main class="content">
			<Lists.Timeline />
		</main>

		<aside class="member-panel">
			<Lists.MemberPicker class="custom-picker" />
		</aside>
	</div>
</Lists.Root>

<style>
	.lists-layout {
		display: grid;
		grid-template-columns: 300px 1fr 350px;
		gap: 1rem;
		height: 100vh;
	}

	.sidebar,
	.member-panel {
		overflow-y: auto;
	}

	.content {
		border-left: 1px solid var(--border-color);
		border-right: 1px solid var(--border-color);
		overflow-y: auto;
	}
</style>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                    |
| ------- | -------- | ------- | -------- | ------------------------------ |
| `class` | `string` | `''`    | No       | Custom CSS class for container |

**Note**: The component automatically accesses the currently selected list from context. You must select a list in `Lists.Manager` before the MemberPicker will be functional.

---

## 📤 Events

The component uses handlers provided to `Lists.Root`:

### **Handler Callbacks**:

```typescript
// Search for accounts to add to list
handlers.onSearchAccounts?: (query: string) => Promise<ListMember[]>;

// Add a member to a list
handlers.onAddMember?: (listId: string, actorId: string) => Promise<void>;
// Alias also supported:
handlers.onAddListMember?: (listId: string, actorId: string) => Promise<void>;

// Remove a member from a list
handlers.onRemoveMember?: (listId: string, memberId: string) => Promise<void>;
// Alias also supported:
handlers.onRemoveListMember?: (listId: string, memberId: string) => Promise<void>;

// Fetch full list details (used for refreshing after changes)
handlers.onFetchList?: (listId: string) => Promise<ListData>;
```

### **Context State Used**:

```typescript
const {
	state: {
		selectedList, // Currently selected list
		members, // Current members of selected list
	},
} = Lists.getListsContext();
```

---

## 💡 Examples

### **Example 1: Basic Member Picker with Toast Notifications**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import { toast } from '$lib/toast';

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onFetchMembers: async (listId: string) => {
			try {
				const response = await fetch(`/api/lists/${listId}/members`);
				if (!response.ok) throw new Error('Failed to fetch members');
				return await response.json();
			} catch (error) {
				toast.error('Could not load list members');
				throw error;
			}
		},

		onSearchAccounts: async (query: string) => {
			try {
				const response = await fetch(
					`/api/search/accounts?q=${encodeURIComponent(query)}&limit=20`
				);
				if (!response.ok) throw new Error('Search failed');
				return await response.json();
			} catch (error) {
				toast.error('Account search failed');
				return [];
			}
		},

		onAddMember: async (listId: string, actorId: string) => {
			try {
				const response = await fetch(`/api/lists/${listId}/members`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ actorId }),
				});

				if (!response.ok) {
					const error = await response.json();
					if (error.code === 'MEMBER_LIMIT_REACHED') {
						throw new Error('List has reached maximum member limit');
					}
					throw new Error(error.message || 'Failed to add member');
				}

				toast.success('Member added to list!');
			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Failed to add member');
				throw error;
			}
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			try {
				const response = await fetch(`/api/lists/${listId}/members/${memberId}`, {
					method: 'DELETE',
				});

				if (!response.ok) {
					throw new Error('Failed to remove member');
				}

				toast.success('Member removed from list');
			} catch (error) {
				toast.error('Failed to remove member');
				throw error;
			}
		},

		onFetchList: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}`);
			return await response.json();
		},
	};
</script>

<Lists.Root {handlers}>
	<div class="lists-container">
		<div class="lists-main">
			<Lists.Manager />
		</div>

		<div class="member-management">
			<h3>Manage Members</h3>
			<Lists.MemberPicker />
		</div>
	</div>
</Lists.Root>

<style>
	.lists-container {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.lists-main {
		min-height: 500px;
	}

	.member-management {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.member-management h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}
</style>
```

### **Example 2: With Advanced Search and Filters**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type { ListMember } from '@equaltoai/greater-components-fediverse/Lists';

	let searchFilters = $state({
		includeFollowing: true,
		includeFollowers: false,
		localOnly: false,
	});

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onFetchMembers: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			return await response.json();
		},

		onSearchAccounts: async (query: string) => {
			// Build query parameters based on filters
			const params = new URLSearchParams({
				q: query,
				limit: '20',
				following: searchFilters.includeFollowing.toString(),
				followers: searchFilters.includeFollowers.toString(),
				local: searchFilters.localOnly.toString(),
			});

			const response = await fetch(`/api/search/accounts?${params}`);
			return await response.json();
		},

		onAddMember: async (listId: string, actorId: string) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
		},

		onFetchList: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}`);
			return await response.json();
		},
	};
</script>

<Lists.Root {handlers}>
	<div class="advanced-member-picker">
		<Lists.Manager />

		<div class="picker-panel">
			<h3>Add Members</h3>

			<!-- Search Filters -->
			<div class="search-filters">
				<label class="filter-checkbox">
					<input type="checkbox" bind:checked={searchFilters.includeFollowing} />
					<span>Search people I follow</span>
				</label>

				<label class="filter-checkbox">
					<input type="checkbox" bind:checked={searchFilters.includeFollowers} />
					<span>Search my followers</span>
				</label>

				<label class="filter-checkbox">
					<input type="checkbox" bind:checked={searchFilters.localOnly} />
					<span>Local accounts only</span>
				</label>
			</div>

			<Lists.MemberPicker />
		</div>
	</div>
</Lists.Root>

<style>
	.advanced-member-picker {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.picker-panel {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.picker-panel h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.search-filters {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.filter-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.filter-checkbox input {
		cursor: pointer;
	}
</style>
```

### **Example 3: With Bulk Member Operations**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type { ListMember } from '@equaltoai/greater-components-fediverse/Lists';

	let selectedMembers = $state(new Set<string>());
	let bulkMode = $state(false);

	function toggleMemberSelection(memberId: string) {
		if (selectedMembers.has(memberId)) {
			selectedMembers.delete(memberId);
		} else {
			selectedMembers.add(memberId);
		}
		selectedMembers = selectedMembers; // Trigger reactivity
	}

	async function bulkRemoveMembers(listId: string) {
		if (selectedMembers.size === 0) return;

		if (!confirm(`Remove ${selectedMembers.size} member(s) from this list?`)) {
			return;
		}

		try {
			// Remove all selected members
			await Promise.all(
				Array.from(selectedMembers).map((memberId) =>
					fetch(`/api/lists/${listId}/members/${memberId}`, {
						method: 'DELETE',
					})
				)
			);

			// Clear selection
			selectedMembers.clear();
			bulkMode = false;

			// Refresh list
			const context = Lists.getListsContext();
			if (context.state.selectedList) {
				await context.selectList(context.state.selectedList);
			}
		} catch (error) {
			console.error('Bulk removal failed:', error);
		}
	}

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onFetchMembers: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			return await response.json();
		},

		onSearchAccounts: async (query: string) => {
			const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
			return await response.json();
		},

		onAddMember: async (listId: string, actorId: string) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
		},

		onFetchList: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}`);
			return await response.json();
		},
	};

	let context: ReturnType<typeof Lists.getListsContext>;
</script>

<Lists.Root {handlers}>
	{#snippet children()}
		{((context = Lists.getListsContext()), null)}

		<div class="bulk-member-picker">
			<Lists.Manager />

			<div class="picker-with-bulk">
				<div class="bulk-header">
					<h3>List Members</h3>
					<button
						class="bulk-toggle"
						onclick={() => {
							bulkMode = !bulkMode;
							if (!bulkMode) selectedMembers.clear();
						}}
					>
						{bulkMode ? 'Cancel' : 'Select Multiple'}
					</button>
				</div>

				{#if bulkMode && selectedMembers.size > 0}
					<div class="bulk-actions">
						<span class="selected-count">
							{selectedMembers.size} selected
						</span>
						<button
							class="bulk-remove-button"
							onclick={() => {
								if (context.state.selectedList) {
									bulkRemoveMembers(context.state.selectedList.id);
								}
							}}
						>
							Remove Selected
						</button>
					</div>
				{/if}

				<!-- Custom member list with checkboxes -->
				{#if context.state.selectedList}
					<div class="member-list">
						{#each context.state.members as member (member.id)}
							<div class="member-item">
								{#if bulkMode}
									<input
										type="checkbox"
										checked={selectedMembers.has(member.id)}
										onchange={() => toggleMemberSelection(member.id)}
									/>
								{/if}

								{#if member.actor.avatar}
									<img
										src={member.actor.avatar}
										alt={member.actor.displayName}
										class="member-avatar"
									/>
								{:else}
									<div class="member-avatar-placeholder">
										{member.actor.displayName.charAt(0).toUpperCase()}
									</div>
								{/if}

								<div class="member-info">
									<div class="member-name">{member.actor.displayName}</div>
									<div class="member-username">@{member.actor.username}</div>
								</div>

								{#if !bulkMode}
									<button
										class="remove-button"
										onclick={() => {
											if (context.state.selectedList) {
												context.removeMember(member.id);
											}
										}}
									>
										Remove
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Search and add section -->
				<div class="add-section">
					<Lists.MemberPicker />
				</div>
			</div>
		</div>
	{/snippet}
</Lists.Root>

<style>
	.bulk-member-picker {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.picker-with-bulk {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.bulk-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.bulk-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.bulk-toggle {
		padding: 0.5rem 1rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.bulk-toggle:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.bulk-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.selected-count {
		font-weight: 600;
	}

	.bulk-remove-button {
		padding: 0.5rem 1rem;
		background: #f4211e;
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.bulk-remove-button:hover {
		background: #d41d1a;
	}

	.member-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		max-height: 400px;
		overflow-y: auto;
	}

	.member-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	.member-item input[type='checkbox'] {
		cursor: pointer;
	}

	.member-avatar,
	.member-avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.member-avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 700;
	}

	.member-info {
		flex: 1;
		min-width: 0;
	}

	.member-name {
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.member-username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.remove-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.remove-button:hover {
		background: rgba(244, 33, 46, 0.1);
		border-color: #f4211e;
		color: #f4211e;
	}

	.add-section {
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}
</style>
```

### **Example 4: With Member Import from CSV**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import type { ListMember } from '@equaltoai/greater-components-fediverse/Lists';

	let importFile: File | null = $state(null);
	let importing = $state(false);
	let importResults = $state<{
		success: number;
		failed: number;
		errors: string[];
	} | null>(null);

	async function handleImport(listId: string) {
		if (!importFile) return;

		importing = true;
		importResults = null;

		try {
			// Read CSV file
			const text = await importFile.text();
			const lines = text
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean);

			// Parse usernames (assuming format: @username or username@domain)
			const usernames = lines.map((line) => {
				// Remove @ if present
				return line.replace(/^@/, '');
			});

			// Search for each username and add to list
			let success = 0;
			let failed = 0;
			const errors: string[] = [];

			for (const username of usernames) {
				try {
					// Search for account
					const searchResults = await handlers.onSearchAccounts?.(username);

					if (!searchResults || searchResults.length === 0) {
						errors.push(`Account not found: ${username}`);
						failed++;
						continue;
					}

					// Use first result
					const account = searchResults[0];

					// Add to list
					await handlers.onAddMember?.(listId, account.actor.id);
					success++;
				} catch (error) {
					errors.push(
						`Failed to add ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`
					);
					failed++;
				}
			}

			importResults = { success, failed, errors };

			// Refresh list
			const context = Lists.getListsContext();
			if (context.state.selectedList) {
				await context.selectList(context.state.selectedList);
			}
		} catch (error) {
			console.error('Import failed:', error);
		} finally {
			importing = false;
			importFile = null;
		}
	}

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onFetchMembers: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			return await response.json();
		},

		onSearchAccounts: async (query: string) => {
			const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
			return await response.json();
		},

		onAddMember: async (listId: string, actorId: string) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
		},

		onFetchList: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}`);
			return await response.json();
		},
	};

	let context: ReturnType<typeof Lists.getListsContext>;
</script>

<Lists.Root {handlers}>
	{#snippet children()}
		{((context = Lists.getListsContext()), null)}

		<div class="import-member-picker">
			<Lists.Manager />

			<div class="picker-with-import">
				<h3>Manage Members</h3>

				<!-- Import Section -->
				{#if context.state.selectedList}
					<div class="import-section">
						<h4>Import from CSV</h4>
						<p class="import-hint">
							Upload a CSV file with one username per line (e.g., @user@domain.com)
						</p>

						<div class="import-controls">
							<input
								type="file"
								accept=".csv,.txt"
								onchange={(e) => {
									const target = e.target as HTMLInputElement;
									importFile = target.files?.[0] || null;
								}}
								disabled={importing}
							/>

							{#if importFile}
								<button
									class="import-button"
									onclick={() => handleImport(context.state.selectedList!.id)}
									disabled={importing}
								>
									{importing ? 'Importing...' : `Import ${importFile.name}`}
								</button>
							{/if}
						</div>

						{#if importing}
							<div class="import-progress">
								<div class="spinner"></div>
								<span>Importing members...</span>
							</div>
						{/if}

						{#if importResults}
							<div class="import-results">
								<div class="result-summary">
									<span class="success-count">✓ {importResults.success} added</span>
									{#if importResults.failed > 0}
										<span class="failed-count">✗ {importResults.failed} failed</span>
									{/if}
								</div>

								{#if importResults.errors.length > 0}
									<details class="error-details">
										<summary>View Errors ({importResults.errors.length})</summary>
										<ul class="error-list">
											{#each importResults.errors as error}
												<li>{error}</li>
											{/each}
										</ul>
									</details>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Regular Member Picker -->
				<Lists.MemberPicker />
			</div>
		</div>
	{/snippet}
</Lists.Root>

<style>
	.import-member-picker {
		display: grid;
		grid-template-columns: 1fr 450px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.picker-with-import {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.picker-with-import h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.import-section {
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 0.75rem;
		color: white;
	}

	.import-section h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
	}

	.import-hint {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.import-controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.import-controls input[type='file'] {
		flex: 1;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.5rem;
		color: white;
	}

	.import-button {
		padding: 0.5rem 1rem;
		background: white;
		border: none;
		border-radius: 0.5rem;
		color: #667eea;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.import-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.import-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.import-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 0.5rem;
	}

	.spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.import-results {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 0.5rem;
	}

	.result-summary {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.success-count {
		color: #00ba7c;
	}

	.failed-count {
		color: #f4211e;
	}

	.error-details {
		padding: 0.75rem;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
	}

	.error-details summary {
		cursor: pointer;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.error-list {
		margin: 0.5rem 0 0 0;
		padding-left: 1.5rem;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.error-list li {
		margin-bottom: 0.25rem;
	}
</style>
```

### **Example 5: With Real-time Member Activity**

```svelte
<script lang="ts">
	import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
	import { onMount, onDestroy } from 'svelte';
	import { createWebSocketClient } from '$lib/websocket';

	let memberActivity = $state<Map<string, { online: boolean; lastSeen?: string }>>(new Map());
	let ws: ReturnType<typeof createWebSocketClient> | null = null;

	onMount(() => {
		// Connect to WebSocket for real-time presence
		ws = createWebSocketClient('wss://api.example.com/graphql');

		ws.subscribe({
			query: `
        subscription OnMemberActivity {
          memberActivity {
            userId
            online
            lastSeen
          }
        }
      `,
			onData: ({ memberActivity: activity }) => {
				memberActivity.set(activity.userId, {
					online: activity.online,
					lastSeen: activity.lastSeen,
				});
				memberActivity = memberActivity; // Trigger reactivity
			},
		});
	});

	onDestroy(() => {
		ws?.close();
	});

	const handlers = {
		onFetchLists: async () => {
			const response = await fetch('/api/lists');
			return await response.json();
		},

		onFetchMembers: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}/members`);
			const members = await response.json();

			// Fetch initial activity status
			const activityResponse = await fetch(`/api/lists/${listId}/members/activity`);
			const activities = await activityResponse.json();

			activities.forEach((activity: any) => {
				memberActivity.set(activity.userId, {
					online: activity.online,
					lastSeen: activity.lastSeen,
				});
			});

			return members;
		},

		onSearchAccounts: async (query: string) => {
			const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
			return await response.json();
		},

		onAddMember: async (listId: string, actorId: string) => {
			await fetch(`/api/lists/${listId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ actorId }),
			});
		},

		onRemoveMember: async (listId: string, memberId: string) => {
			await fetch(`/api/lists/${listId}/members/${memberId}`, {
				method: 'DELETE',
			});
		},

		onFetchList: async (listId: string) => {
			const response = await fetch(`/api/lists/${listId}`);
			return await response.json();
		},
	};

	let context: ReturnType<typeof Lists.getListsContext>;

	function formatLastSeen(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}
</script>

<Lists.Root {handlers}>
	{#snippet children()}
		{((context = Lists.getListsContext()), null)}

		<div class="activity-member-picker">
			<Lists.Manager />

			<div class="picker-with-activity">
				<h3>Members</h3>

				{#if context.state.selectedList && context.state.members.length > 0}
					<div class="member-list-with-activity">
						{#each context.state.members as member (member.id)}
							{@const activity = memberActivity.get(member.actor.id)}
							<div class="member-item">
								<div class="member-avatar-container">
									{#if member.actor.avatar}
										<img
											src={member.actor.avatar}
											alt={member.actor.displayName}
											class="member-avatar"
										/>
									{:else}
										<div class="member-avatar-placeholder">
											{member.actor.displayName.charAt(0).toUpperCase()}
										</div>
									{/if}

									{#if activity}
										<span
											class="presence-indicator"
											class:online={activity.online}
											title={activity.online
												? 'Online'
												: activity.lastSeen
													? `Last seen ${formatLastSeen(activity.lastSeen)}`
													: 'Offline'}
										></span>
									{/if}
								</div>

								<div class="member-info">
									<div class="member-name">{member.actor.displayName}</div>
									<div class="member-username">@{member.actor.username}</div>
									{#if activity && !activity.online && activity.lastSeen}
										<div class="last-seen">
											Last seen {formatLastSeen(activity.lastSeen)}
										</div>
									{/if}
								</div>

								<button
									class="remove-button"
									onclick={() => context.removeMember(member.id)}
									title="Remove from list"
								>
									×
								</button>
							</div>
						{/each}
					</div>
				{/if}

				<div class="add-member-section">
					<Lists.MemberPicker />
				</div>
			</div>
		</div>
	{/snippet}
</Lists.Root>

<style>
	.activity-member-picker {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.picker-with-activity {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.picker-with-activity h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.member-list-with-activity {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		max-height: 500px;
		overflow-y: auto;
	}

	.member-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		transition: background-color 0.2s;
	}

	.member-item:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.member-avatar-container {
		position: relative;
	}

	.member-avatar,
	.member-avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.member-avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 700;
	}

	.presence-indicator {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 2px solid var(--bg-primary, #ffffff);
		background: #8899a6; /* Offline/gray */
	}

	.presence-indicator.online {
		background: #00ba7c; /* Online/green */
		box-shadow: 0 0 6px rgba(0, 186, 124, 0.5);
	}

	.member-info {
		flex: 1;
		min-width: 0;
	}

	.member-name {
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.member-username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.last-seen {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		margin-top: 0.125rem;
	}

	.remove-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-secondary, #536471);
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.remove-button:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.add-member-section {
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}
</style>
```

---

## 🎨 Styling

`Lists.MemberPicker` uses CSS custom properties for theming:

```css
:root {
	/* Colors */
	--primary-color: #1d9bf0;
	--primary-color-dark: #1a8cd8;
	--bg-primary: #ffffff;
	--bg-secondary: #f7f9fa;
	--bg-hover: #eff3f4;
	--text-primary: #0f1419;
	--text-secondary: #536471;
	--border-color: #e1e8ed;

	/* Error colors */
	--error-color: #f4211e;
}
```

### **Custom Styling**

```svelte
<Lists.MemberPicker class="custom-picker" />

<style>
	:global(.custom-picker) {
		background: linear-gradient(to bottom, #f7f9fa, #ffffff);
	}

	:global(.custom-picker .member-picker__search) {
		border: 2px solid #7c3aed;
	}

	:global(.custom-picker .member-picker__action--add) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
</style>
```

---

## 🔒 Security Considerations

### **Rate Limiting Search**

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const searchLimiter = new RateLimiter({
	maxRequests: 20,
	windowMs: 60000, // 1 minute
});

const handlers = {
	onSearchAccounts: async (query: string) => {
		if (!(await searchLimiter.checkLimit('search'))) {
			throw new Error('Search rate limit exceeded');
		}

		const response = await fetch(`/api/search/accounts?q=${encodeURIComponent(query)}`);
		return await response.json();
	},
};
```

### **Prevent Spam Adding**

```typescript
const addMemberLimiter = new RateLimiter({
	maxRequests: 50,
	windowMs: 60 * 60 * 1000, // 1 hour
});

const handlers = {
	onAddMember: async (listId: string, actorId: string) => {
		if (!(await addMemberLimiter.checkLimit(listId))) {
			throw new Error('Too many members added. Please wait.');
		}

		await fetch(`/api/lists/${listId}/members`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ actorId }),
		});
	},
};
```

---

## ♿ Accessibility

`Lists.MemberPicker` is fully accessible:

### **Keyboard Navigation**

- **Tab**: Navigate between search input, results, and member list
- **Enter**: Select account from search results
- **Escape**: Clear search
- **Arrow Keys**: Navigate search results

### **Screen Reader Support**

All interactive elements have proper ARIA labels and roles:

```html
<!-- Search input -->
<input type="text" aria-label="Search accounts to add to list" aria-describedby="search-hint" />

<!-- Member list -->
<div role="list" aria-label="Current list members">
	<div role="listitem" aria-label="John Doe, @johndoe">
		<!-- Member content -->
	</div>
</div>
```

---

## ⚡ Performance

### **Debounced Search**

Search is automatically debounced (300ms) to prevent excessive API calls:

```typescript
// Built into the component
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
$effect(() => {
	searchQuery;
	if (searchTimeout) clearTimeout(searchTimeout);
	if (searchQuery.trim().length > 0) {
		searchTimeout = setTimeout(() => handleSearch(), 300);
	}
});
```

---

## 🧪 Testing

### **Component Tests**

```typescript
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import * as Lists from '@equaltoai/greater-components-fediverse/Lists';

describe('Lists.MemberPicker', () => {
	test('searches for accounts', async () => {
		const onSearchAccounts = vi.fn().mockResolvedValue([
			{
				id: '1',
				actor: {
					id: '1',
					username: 'johndoe',
					displayName: 'John Doe',
				},
			},
		]);

		const { getByPlaceholderText, getByText } = render(Lists.Root, {
			handlers: { onSearchAccounts },
		});

		const searchInput = getByPlaceholderText('Search people to add...');
		await fireEvent.input(searchInput, { target: { value: 'john' } });

		await waitFor(() => {
			expect(onSearchAccounts).toHaveBeenCalledWith('john');
			expect(getByText('John Doe')).toBeInTheDocument();
		});
	});
});
```

---

## 🔗 Related Components

- [Lists.Root](/docs/components/Lists/Root.md) - Context provider
- [Lists.Manager](/docs/components/Lists/Manager.md) - List overview
- [Lists.Settings](/docs/components/Lists/Settings.md) - List settings

---

## 📚 See Also

- [Lists Component Overview](/docs/components/Lists/README.md)
- [Search Best Practices](/docs/guides/search.md)
- [Real-time Updates Guide](/docs/guides/realtime.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0
