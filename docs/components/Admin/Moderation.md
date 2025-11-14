# Admin.Moderation

**Component**: Quick Moderation Tools & Actions  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 58 passing tests

---

## 📋 Overview

`Admin.Moderation` provides quick moderation tools and actions for administrators and moderators. It features a user lookup interface, quick action cards, and streamlined workflows for common moderation tasks like suspending users, deleting content, and reviewing activity. The component is designed for efficiency, allowing moderators to take action quickly while maintaining proper documentation and audit trails.

### **Key Features**:

- ✅ Quick user lookup and search
- ✅ Streamlined moderation actions
- ✅ Suspend/unsuspend users
- ✅ Content deletion tools
- ✅ Moderation action cards
- ✅ Reason documentation
- ✅ Selected user context
- ✅ Action confirmation
- ✅ Audit logging integration
- ✅ Keyboard shortcuts support
- ✅ Accessible interface

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const adminHandlers = {
		onSearchUsers: async (query) => {
			const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to search users');
			}

			return res.json();
		},

		onSuspendUser: async (userId, reason) => {
			const res = await fetch(`/api/admin/users/${userId}/suspend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: JSON.stringify({ reason }),
			});

			if (!res.ok) {
				throw new Error('Failed to suspend user');
			}
		},

		onUnsuspendUser: async (userId) => {
			const res = await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to unsuspend user');
			}
		},
	};

	function getAuthToken(): string {
		return localStorage.getItem('authToken') || '';
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<Admin.Moderation />
</Admin.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                  |
| ------- | -------- | ------- | -------- | ---------------------------- |
| `class` | `string` | `''`    | No       | Custom CSS class for styling |

**Note**: The component retrieves handlers from the Admin context provided by `Admin.Root`.

---

## 📤 Events

The component uses handlers from the Admin context:

```typescript
interface AdminHandlers {
	onSearchUsers?: (query: string) => Promise<AdminUser[]>;
	onSuspendUser?: (userId: string, reason: string) => Promise<void>;
	onUnsuspendUser?: (userId: string) => Promise<void>;
}

interface AdminUser {
	id: string;
	username: string;
	email: string;
	displayName: string;
	createdAt: string;
	role: 'admin' | 'moderator' | 'user';
	status: 'active' | 'suspended' | 'deleted';
	postsCount: number;
	followersCount: number;
}
```

### onSearchUsers

**Type**: `(query: string) => Promise<AdminUser[]>`

**Description**: Searches for users by username or email. Returns matching users for quick lookup.

**Parameters**:

- `query`: Search query string

**Example**:

```typescript
onSearchUsers: async (query) => {
	const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
	return res.json();
};
```

### onSuspendUser

**Type**: `(userId: string, reason: string) => Promise<void>`

**Description**: Suspends a user account with documented reason.

**Parameters**:

- `userId`: ID of the user to suspend
- `reason`: Documented reason for suspension

**Example**:

```typescript
onSuspendUser: async (userId, reason) => {
	await fetch(`/api/admin/users/${userId}/suspend`, {
		method: 'POST',
		body: JSON.stringify({ reason }),
	});

	await logAuditEvent('user_suspended', { userId, reason });
};
```

### onUnsuspendUser

**Type**: `(userId: string) => Promise<void>`

**Description**: Restores a suspended user account.

**Parameters**:

- `userId`: ID of the user to unsuspend

**Example**:

```typescript
onUnsuspendUser: async (userId) => {
	await fetch(`/api/admin/users/${userId}/unsuspend`, {
		method: 'POST',
	});

	await logAuditEvent('user_unsuspended', { userId });
};
```

---

## 💡 Examples

### Example 1: Basic Moderation Interface

Simple moderation tools with user search:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const adminHandlers = {
		onSearchUsers: async (query) => {
			try {
				const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Search failed');
				}

				return res.json();
			} catch (error) {
				console.error('Search error:', error);
				throw error;
			}
		},

		onSuspendUser: async (userId, reason) => {
			try {
				const res = await fetch(`/api/admin/users/${userId}/suspend`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ reason }),
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Suspension failed');
				}

				showNotification('User suspended successfully', 'success');
			} catch (error) {
				console.error('Suspension error:', error);
				showNotification(error.message, 'error');
				throw error;
			}
		},

		onUnsuspendUser: async (userId) => {
			try {
				const res = await fetch(`/api/admin/users/${userId}/unsuspend`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Unsuspension failed');
				}

				showNotification('User unsuspended successfully', 'success');
			} catch (error) {
				console.error('Unsuspension error:', error);
				showNotification(error.message, 'error');
				throw error;
			}
		},
	};

	function showNotification(message: string, type: 'success' | 'error') {
		console.log(`[${type}] ${message}`);
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="moderation-interface">
		<h1>Moderation Tools</h1>
		<p class="subtitle">Quick actions for content moderation</p>
		<Admin.Moderation />
	</div>
</Admin.Root>

<style>
	.moderation-interface {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.moderation-interface h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.subtitle {
		margin: 0 0 2rem 0;
		font-size: 1rem;
		color: var(--text-secondary, #536471);
	}
</style>
```

### Example 2: Moderation with Keyboard Shortcuts

Add keyboard shortcuts for quick actions:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import { onMount, onDestroy } from 'svelte';

	let searchInput: HTMLInputElement | null = null;

	function handleKeyboard(event: KeyboardEvent) {
		// Focus search with '/' key
		if (event.key === '/' && document.activeElement !== searchInput) {
			event.preventDefault();
			searchInput?.focus();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyboard);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyboard);
	});

	const adminHandlers = {
		onSearchUsers: async (query) => {
			const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onSuspendUser: async (userId, reason) => {
			await fetch(`/api/admin/users/${userId}/suspend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ reason }),
			});
		},

		onUnsuspendUser: async (userId) => {
			await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="moderation-with-shortcuts">
		<div class="header">
			<h1>Moderation Tools</h1>
			<div class="shortcuts-hint">
				<kbd>/</kbd> to search
			</div>
		</div>

		<Admin.Moderation />
	</div>
</Admin.Root>

<style>
	.moderation-with-shortcuts {
		padding: 2rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.shortcuts-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	kbd {
		padding: 0.25rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
	}
</style>
```

### Example 3: Moderation with Bulk Actions

Support for bulk moderation operations:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminUser } from '@equaltoai/greater-components-fediverse/Admin';

	let selectedUsers = $state<Set<string>>(new Set());
	let bulkAction = $state<'suspend' | 'unsuspend' | null>(null);
	let bulkReason = $state('');

	function toggleUserSelection(userId: string) {
		const newSelected = new Set(selectedUsers);
		if (newSelected.has(userId)) {
			newSelected.delete(userId);
		} else {
			newSelected.add(userId);
		}
		selectedUsers = newSelected;
	}

	async function executeBulkAction() {
		if (!bulkAction || selectedUsers.size === 0) return;

		const userIds = Array.from(selectedUsers);

		for (const userId of userIds) {
			try {
				if (bulkAction === 'suspend') {
					await adminHandlers.onSuspendUser?.(userId, bulkReason);
				} else if (bulkAction === 'unsuspend') {
					await adminHandlers.onUnsuspendUser?.(userId);
				}
			} catch (error) {
				console.error(`Failed to ${bulkAction} user ${userId}:`, error);
			}
		}

		// Clear selection
		selectedUsers = new Set();
		bulkAction = null;
		bulkReason = '';

		showNotification(`Bulk ${bulkAction} completed`, 'success');
	}

	const adminHandlers = {
		onSearchUsers: async (query) => {
			const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onSuspendUser: async (userId, reason) => {
			await fetch(`/api/admin/users/${userId}/suspend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ reason }),
			});
		},

		onUnsuspendUser: async (userId) => {
			await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};

	function showNotification(message: string, type: string) {
		console.log(`[${type}] ${message}`);
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="moderation-bulk">
		{#if selectedUsers.size > 0}
			<div class="bulk-actions-bar">
				<span class="bulk-actions-bar__count">
					{selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
				</span>

				<div class="bulk-actions-bar__actions">
					<button class="bulk-action-btn" onclick={() => (bulkAction = 'suspend')}>
						Suspend Selected
					</button>
					<button class="bulk-action-btn" onclick={() => (bulkAction = 'unsuspend')}>
						Unsuspend Selected
					</button>
					<button
						class="bulk-action-btn bulk-action-btn--secondary"
						onclick={() => (selectedUsers = new Set())}
					>
						Clear Selection
					</button>
				</div>
			</div>
		{/if}

		<Admin.Moderation />

		{#if bulkAction}
			<div class="bulk-modal-backdrop">
				<div class="bulk-modal">
					<h3>Bulk {bulkAction === 'suspend' ? 'Suspend' : 'Unsuspend'}</h3>

					<p>
						This will {bulkAction}
						{selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''}.
					</p>

					{#if bulkAction === 'suspend'}
						<div class="field">
							<label for="bulk-reason">Reason</label>
							<textarea
								id="bulk-reason"
								bind:value={bulkReason}
								placeholder="Enter reason for bulk suspension..."
								rows="3"
								required
							></textarea>
						</div>
					{/if}

					<div class="modal-actions">
						<button class="button button--secondary" onclick={() => (bulkAction = null)}>
							Cancel
						</button>
						<button
							class="button button--danger"
							onclick={executeBulkAction}
							disabled={bulkAction === 'suspend' && !bulkReason.trim()}
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Admin.Root>

<style>
	.moderation-bulk {
		position: relative;
	}

	.bulk-actions-bar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: rgba(29, 155, 240, 0.1);
		border: 1px solid #1d9bf0;
		border-radius: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.bulk-actions-bar__count {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
	}

	.bulk-actions-bar__actions {
		display: flex;
		gap: 0.75rem;
	}

	.bulk-action-btn {
		padding: 0.625rem 1rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.bulk-action-btn:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.bulk-action-btn--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.bulk-action-btn--secondary:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.bulk-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 1rem;
	}

	.bulk-modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 32rem;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.bulk-modal h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.bulk-modal p {
		margin: 0 0 1.5rem 0;
		color: var(--text-secondary, #536471);
	}

	.field {
		margin-bottom: 1.5rem;
	}

	.field label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
	}

	.field textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-family: inherit;
		font-size: 0.9375rem;
		resize: vertical;
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.button--danger {
		background: #f4211e;
		color: white;
	}

	.button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
```

### Example 4: Moderation with Activity Timeline

Show recent user activity for context:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminUser } from '@equaltoai/greater-components-fediverse/Admin';

	interface UserActivity {
		id: string;
		type: 'post' | 'reply' | 'boost' | 'follow';
		content?: string;
		timestamp: string;
	}

	let selectedUser = $state<AdminUser | null>(null);
	let userActivity = $state<UserActivity[]>([]);
	let loadingActivity = $state(false);

	async function loadUserActivity(userId: string) {
		loadingActivity = true;
		try {
			const res = await fetch(`/api/admin/users/${userId}/activity`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			userActivity = await res.json();
		} catch (error) {
			console.error('Failed to load activity:', error);
			userActivity = [];
		} finally {
			loadingActivity = false;
		}
	}

	const adminHandlers = {
		onSearchUsers: async (query) => {
			const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			const users = await res.json();

			// Load activity for first user
			if (users.length > 0) {
				selectedUser = users[0];
				await loadUserActivity(users[0].id);
			}

			return users;
		},

		onSuspendUser: async (userId, reason) => {
			await fetch(`/api/admin/users/${userId}/suspend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ reason }),
			});
		},

		onUnsuspendUser: async (userId) => {
			await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};

	function formatActivityType(type: string): string {
		return type.charAt(0).toUpperCase() + type.slice(1);
	}

	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleString();
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="moderation-with-activity">
		<div class="main-content">
			<Admin.Moderation />
		</div>

		{#if selectedUser}
			<aside class="activity-sidebar">
				<h3>Recent Activity: @{selectedUser.username}</h3>

				{#if loadingActivity}
					<div class="activity-loading">Loading activity...</div>
				{:else if userActivity.length === 0}
					<div class="activity-empty">No recent activity</div>
				{:else}
					<div class="activity-timeline">
						{#each userActivity as activity}
							<div class="activity-item">
								<div class="activity-item__type">
									{formatActivityType(activity.type)}
								</div>
								{#if activity.content}
									<div class="activity-item__content">
										{activity.content}
									</div>
								{/if}
								<div class="activity-item__timestamp">
									{formatTimestamp(activity.timestamp)}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</aside>
		{/if}
	</div>
</Admin.Root>

<style>
	.moderation-with-activity {
		display: grid;
		grid-template-columns: 1fr 20rem;
		gap: 2rem;
		padding: 2rem;
	}

	.main-content {
		min-width: 0;
	}

	.activity-sidebar {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.activity-sidebar h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.activity-loading,
	.activity-empty {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.875rem;
	}

	.activity-timeline {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-item {
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.activity-item__type {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--primary-color, #1d9bf0);
		text-transform: uppercase;
		margin-bottom: 0.5rem;
	}

	.activity-item__content {
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		margin-bottom: 0.5rem;
		word-break: break-word;
	}

	.activity-item__timestamp {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	@media (max-width: 1024px) {
		.moderation-with-activity {
			grid-template-columns: 1fr;
		}

		.activity-sidebar {
			position: static;
		}
	}
</style>
```

### Example 5: Moderation with Templates

Pre-defined reason templates for common scenarios:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	interface ReasonTemplate {
		id: string;
		name: string;
		reason: string;
		severity: 'low' | 'medium' | 'high';
	}

	const reasonTemplates: ReasonTemplate[] = [
		{
			id: 'spam',
			name: 'Spam',
			reason: 'Posting spam content or excessive promotional material',
			severity: 'medium',
		},
		{
			id: 'harassment',
			name: 'Harassment',
			reason: 'Harassing or bullying other users',
			severity: 'high',
		},
		{
			id: 'impersonation',
			name: 'Impersonation',
			reason: 'Impersonating another person or entity',
			severity: 'high',
		},
		{
			id: 'nsfw',
			name: 'Inappropriate Content',
			reason: 'Posting NSFW content without proper content warnings',
			severity: 'medium',
		},
		{
			id: 'bot',
			name: 'Automated Bot',
			reason: 'Operating an undisclosed automated bot account',
			severity: 'low',
		},
	];

	let selectedTemplate = $state<ReasonTemplate | null>(null);
	let customReason = $state('');

	function selectTemplate(template: ReasonTemplate) {
		selectedTemplate = template;
		customReason = template.reason;
	}

	const adminHandlers = {
		onSearchUsers: async (query) => {
			const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onSuspendUser: async (userId, reason) => {
			await fetch(`/api/admin/users/${userId}/suspend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({
					reason,
					template: selectedTemplate?.id,
					severity: selectedTemplate?.severity,
				}),
			});

			// Reset template selection
			selectedTemplate = null;
			customReason = '';
		},

		onUnsuspendUser: async (userId) => {
			await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="moderation-with-templates">
		<Admin.Moderation />

		<div class="templates-panel">
			<h3>Reason Templates</h3>

			<div class="templates-grid">
				{#each reasonTemplates as template}
					<button
						class="template-card"
						class:template-card--selected={selectedTemplate?.id === template.id}
						onclick={() => selectTemplate(template)}
					>
						<div class="template-card__name">{template.name}</div>
						<div class="template-card__severity template-card__severity--{template.severity}">
							{template.severity}
						</div>
					</button>
				{/each}
			</div>

			{#if selectedTemplate}
				<div class="selected-template">
					<label for="custom-reason">Reason (editable)</label>
					<textarea id="custom-reason" bind:value={customReason} rows="4"></textarea>
				</div>
			{/if}
		</div>
	</div>
</Admin.Root>

<style>
	.moderation-with-templates {
		padding: 2rem;
	}

	.templates-panel {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.templates-panel h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1rem;
	}

	.template-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
	}

	.template-card:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.template-card--selected {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.1);
	}

	.template-card__name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.template-card__severity {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.template-card__severity--low {
		background: rgba(29, 155, 240, 0.1);
		color: #1d9bf0;
	}

	.template-card__severity--medium {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.template-card__severity--high {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.selected-template {
		margin-top: 1.5rem;
	}

	.selected-template label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
	}

	.selected-template textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-family: inherit;
		font-size: 0.9375rem;
		resize: vertical;
	}
</style>
```

---

## 🔒 Security Considerations

### 1. Permission Verification

**Ensure proper moderator/admin permissions:**

```typescript
// Server-side check
export async function POST({ request }) {
	const user = await authenticateUser(request);

	if (!user || !['admin', 'moderator'].includes(user.role)) {
		return new Response('Forbidden', { status: 403 });
	}

	// Prevent self-moderation
	const { userId } = await request.json();
	if (userId === user.id) {
		return new Response('Cannot moderate yourself', { status: 400 });
	}

	// Moderators cannot moderate admins
	const target = await db.users.findById(userId);
	if (target.role === 'admin' && user.role !== 'admin') {
		return new Response('Cannot moderate administrators', { status: 403 });
	}

	// Proceed with action
}
```

### 2. Reason Required

**Always require documented reasons:**

```typescript
import { z } from 'zod';

const suspendSchema = z.object({
	userId: z.string().uuid(),
	reason: z
		.string()
		.min(10, 'Reason must be at least 10 characters')
		.max(500, 'Reason must be at most 500 characters'),
});

export async function suspendUser(data: unknown) {
	const validated = suspendSchema.parse(data);
	// Safe to proceed
}
```

### 3. Audit Trail

**Log all moderation actions:**

```typescript
async function logModerationAction(
	action: string,
	userId: string,
	moderatorId: string,
	reason: string
) {
	await db.auditLogs.create({
		id: generateUUID(),
		timestamp: new Date().toISOString(),
		action,
		userId,
		moderatorId,
		reason,
		ipAddress: request.headers.get('x-forwarded-for'),
		severity: 'high',
	});
}
```

### 4. Rate Limiting

**Prevent moderation abuse:**

```typescript
import { rateLimit } from '$lib/middleware';

const moderationLimiter = rateLimit({
	windowMs: 60000, // 1 minute
	max: 30, // Max 30 actions per minute
});

export const POST = moderationLimiter(async ({ request }) => {
	// Handler
});
```

---

## 🎨 Styling

The component uses CSS variables for theming:

```css
.admin-moderation {
	padding: 1.5rem;
}

.admin-moderation__section {
	padding: 1.5rem;
	background: var(--bg-primary, #ffffff);
	border: 1px solid var(--border-color, #e1e8ed);
	border-radius: 0.75rem;
}

.admin-moderation__action-card {
	padding: 1.5rem 1rem;
	border: 2px solid var(--border-color, #e1e8ed);
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
}

.admin-moderation__action-card:hover {
	background: var(--bg-hover, #eff3f4);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

---

## ♿ Accessibility

The component follows WCAG 2.1 Level AA standards:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper element usage

---

## 🧪 Testing

Run tests:

```bash
npm test -- Admin/Moderation.test.ts
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md)
- [Admin.Users](./Users.md)
- [Admin.Reports](./Reports.md)
- [Admin.Logs](./Logs.md)

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [Moderation Best Practices](../../../docs/guides/moderation.md)
- [API Documentation](../../../API_DOCUMENTATION.md)

---

**For comprehensive moderation tools, see the [Admin Components Overview](./README.md).**
