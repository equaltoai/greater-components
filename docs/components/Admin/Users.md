# Admin.Users

**Component**: User Management Interface  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 78 passing tests

---

## 📋 Overview

`Admin.Users` provides a comprehensive user management interface for instance administrators. It displays a searchable, filterable table of all users with actions to suspend/unsuspend accounts, change user roles, and view user details. The component includes modal dialogs for confirmation, bulk operations support, and real-time updates.

### **Key Features**:

- ✅ Searchable user table with live search
- ✅ Multi-filter support (role, status, search query)
- ✅ User suspension with reason tracking
- ✅ User unsuspension capabilities
- ✅ Role management (admin, moderator, user)
- ✅ Modal confirmation dialogs
- ✅ Detailed user information display
- ✅ Responsive table layout
- ✅ Loading and empty states
- ✅ Error handling with user feedback
- ✅ Keyboard navigation support
- ✅ Accessibility compliant
- ✅ Audit logging integration points

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
		onFetchUsers: async (filters) => {
			const params = new URLSearchParams(filters as Record<string, string>);
			const res = await fetch(`/api/admin/users?${params}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to fetch users');
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

		onChangeUserRole: async (userId, role) => {
			const res = await fetch(`/api/admin/users/${userId}/role`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: JSON.stringify({ role }),
			});

			if (!res.ok) {
				throw new Error('Failed to change user role');
			}
		},
	};

	function getAuthToken(): string {
		return localStorage.getItem('authToken') || '';
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<Admin.Users />
</Admin.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                  |
| ------- | -------- | ------- | -------- | ---------------------------- |
| `class` | `string` | `''`    | No       | Custom CSS class for styling |

**Note**: The component retrieves users and handlers from the Admin context provided by `Admin.Root`.

---

## 📤 Events

The component uses handlers from the Admin context:

```typescript
interface AdminHandlers {
	onFetchUsers?: (filters?: {
		role?: string;
		status?: string;
		search?: string;
	}) => Promise<AdminUser[]>;

	onSuspendUser?: (userId: string, reason: string) => Promise<void>;
	onUnsuspendUser?: (userId: string) => Promise<void>;
	onChangeUserRole?: (userId: string, role: 'admin' | 'moderator' | 'user') => Promise<void>;
	onSearchUsers?: (query: string) => Promise<AdminUser[]>;
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

### onFetchUsers

**Type**: `(filters?: { role?: string; status?: string; search?: string }) => Promise<AdminUser[]>`

**Description**: Fetches users with optional filters. Called on component mount and when filters change.

**Parameters**:

- `filters.role`: Filter by user role ('admin', 'moderator', 'user')
- `filters.status`: Filter by user status ('active', 'suspended', 'deleted')
- `filters.search`: Search query for username/email

**Example**:

```typescript
onFetchUsers: async (filters) => {
	const params = new URLSearchParams();
	if (filters?.role) params.set('role', filters.role);
	if (filters?.status) params.set('status', filters.status);
	if (filters?.search) params.set('q', filters.search);

	const res = await fetch(`/api/admin/users?${params}`);
	return res.json();
};
```

### onSuspendUser

**Type**: `(userId: string, reason: string) => Promise<void>`

**Description**: Suspends a user account with a required reason. Triggers confirmation modal.

**Parameters**:

- `userId`: ID of the user to suspend
- `reason`: Reason for suspension (minimum 10 characters recommended)

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

### onChangeUserRole

**Type**: `(userId: string, role: 'admin' | 'moderator' | 'user') => Promise<void>`

**Description**: Changes a user's role. Triggers confirmation modal with role descriptions.

**Parameters**:

- `userId`: ID of the user
- `role`: New role to assign

**Example**:

```typescript
onChangeUserRole: async (userId, role) => {
	await fetch(`/api/admin/users/${userId}/role`, {
		method: 'PUT',
		body: JSON.stringify({ role }),
	});

	await logAuditEvent('user_role_changed', { userId, newRole: role });
};
```

---

## 💡 Examples

### Example 1: Basic User Management

Simple user management interface:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const adminHandlers = {
		onFetchUsers: async (filters) => {
			try {
				const params = new URLSearchParams();

				if (filters?.role) params.set('role', filters.role);
				if (filters?.status) params.set('status', filters.status);
				if (filters?.search) params.set('search', filters.search);

				const res = await fetch(`/api/admin/users?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Failed to fetch users');
				}

				return res.json();
			} catch (error) {
				console.error('Fetch users error:', error);
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
					throw new Error(error.message || 'Failed to suspend user');
				}

				// Show success notification
				showNotification('User suspended successfully', 'success');
			} catch (error) {
				console.error('Suspend user error:', error);
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
					throw new Error(error.message || 'Failed to unsuspend user');
				}

				showNotification('User unsuspended successfully', 'success');
			} catch (error) {
				console.error('Unsuspend user error:', error);
				showNotification(error.message, 'error');
				throw error;
			}
		},

		onChangeUserRole: async (userId, role) => {
			try {
				const res = await fetch(`/api/admin/users/${userId}/role`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ role }),
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Failed to change role');
				}

				showNotification(`User role changed to ${role}`, 'success');
			} catch (error) {
				console.error('Change role error:', error);
				showNotification(error.message, 'error');
				throw error;
			}
		},
	};

	function showNotification(message: string, type: 'success' | 'error') {
		// Implement notification system
		console.log(`[${type}] ${message}`);
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="user-management">
		<h1>User Management</h1>
		<Admin.Users />
	</div>
</Admin.Root>

<style>
	.user-management {
		padding: 2rem;
		max-width: 1600px;
		margin: 0 auto;
	}

	.user-management h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 800;
	}
</style>
```

### Example 2: User Management with Audit Logging

Track all user management actions:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	interface AuditLogEntry {
		action: string;
		userId: string;
		performedBy: string;
		timestamp: string;
		metadata?: Record<string, any>;
	}

	async function logAuditEvent(action: string, metadata: Record<string, any>): Promise<void> {
		try {
			const currentUser = await getCurrentUser();

			const entry: AuditLogEntry = {
				action,
				userId: metadata.userId,
				performedBy: currentUser.id,
				timestamp: new Date().toISOString(),
				metadata,
			};

			await fetch('/api/admin/audit-log', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify(entry),
			});

			console.log('Audit event logged:', action);
		} catch (error) {
			console.error('Failed to log audit event:', error);
			// Don't throw - audit logging shouldn't break functionality
		}
	}

	async function getCurrentUser() {
		const res = await fetch('/api/auth/me', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		});
		return res.json();
	}

	const adminHandlers = {
		onFetchUsers: async (filters) => {
			await logAuditEvent('users_viewed', { filters });

			const params = new URLSearchParams(filters as Record<string, string>);
			const res = await fetch(`/api/admin/users?${params}`, {
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

			await logAuditEvent('user_suspended', {
				userId,
				reason,
				severity: 'high',
			});
		},

		onUnsuspendUser: async (userId) => {
			await fetch(`/api/admin/users/${userId}/unsuspend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});

			await logAuditEvent('user_unsuspended', {
				userId,
				severity: 'medium',
			});
		},

		onChangeUserRole: async (userId, role) => {
			const user = await fetch(`/api/admin/users/${userId}`).then((r) => r.json());
			const oldRole = user.role;

			await fetch(`/api/admin/users/${userId}/role`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ role }),
			});

			await logAuditEvent('user_role_changed', {
				userId,
				oldRole,
				newRole: role,
				severity: 'critical',
			});
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="user-management-with-audit">
		<div class="header">
			<h1>User Management</h1>
			<span class="badge">Audit Logging Enabled</span>
		</div>

		<Admin.Users />
	</div>
</Admin.Root>

<style>
	.user-management-with-audit {
		padding: 2rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.badge {
		padding: 0.375rem 0.75rem;
		background: rgba(0, 186, 124, 0.1);
		border: 1px solid #00ba7c;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		color: #00ba7c;
		text-transform: uppercase;
	}
</style>
```

### Example 3: User Management with Real-time Notifications

Show real-time notifications for user actions:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	interface Notification {
		id: string;
		message: string;
		type: 'success' | 'error' | 'info';
		timestamp: number;
	}

	let notifications = $state<Notification[]>([]);

	function addNotification(message: string, type: Notification['type']) {
		const notification: Notification = {
			id: crypto.randomUUID(),
			message,
			type,
			timestamp: Date.now(),
		};

		notifications = [...notifications, notification];

		// Auto-remove after 5 seconds
		setTimeout(() => {
			removeNotification(notification.id);
		}, 5000);
	}

	function removeNotification(id: string) {
		notifications = notifications.filter((n) => n.id !== id);
	}

	const adminHandlers = {
		onFetchUsers: async (filters) => {
			try {
				const params = new URLSearchParams(filters as Record<string, string>);
				const res = await fetch(`/api/admin/users?${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) throw new Error('Failed to fetch users');

				return res.json();
			} catch (error) {
				addNotification(error instanceof Error ? error.message : 'Failed to fetch users', 'error');
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

				if (!res.ok) throw new Error('Failed to suspend user');

				addNotification('User suspended successfully', 'success');
			} catch (error) {
				addNotification(error instanceof Error ? error.message : 'Failed to suspend user', 'error');
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

				if (!res.ok) throw new Error('Failed to unsuspend user');

				addNotification('User unsuspended successfully', 'success');
			} catch (error) {
				addNotification(
					error instanceof Error ? error.message : 'Failed to unsuspend user',
					'error'
				);
				throw error;
			}
		},

		onChangeUserRole: async (userId, role) => {
			try {
				const res = await fetch(`/api/admin/users/${userId}/role`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ role }),
				});

				if (!res.ok) throw new Error('Failed to change role');

				addNotification(`User role changed to ${role}`, 'success');
			} catch (error) {
				addNotification(error instanceof Error ? error.message : 'Failed to change role', 'error');
				throw error;
			}
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="user-management-with-notifications">
		<!-- Notifications Container -->
		{#if notifications.length > 0}
			<div class="notifications" role="region" aria-label="Notifications">
				{#each notifications as notification (notification.id)}
					<div class="notification notification--{notification.type}" role="alert">
						<span class="notification__message">{notification.message}</span>
						<button
							class="notification__close"
							onclick={() => removeNotification(notification.id)}
							aria-label="Close notification"
						>
							×
						</button>
					</div>
				{/each}
			</div>
		{/if}

		<Admin.Users />
	</div>
</Admin.Root>

<style>
	.user-management-with-notifications {
		position: relative;
		padding: 1.5rem;
	}

	.notifications {
		position: fixed;
		top: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		z-index: 10000;
		max-width: 24rem;
	}

	.notification {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.notification--success {
		background: rgba(0, 186, 124, 0.1);
		border: 1px solid #00ba7c;
		color: #00ba7c;
	}

	.notification--error {
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		color: #f4211e;
	}

	.notification--info {
		background: rgba(29, 155, 240, 0.1);
		border: 1px solid #1d9bf0;
		color: #1d9bf0;
	}

	.notification__message {
		flex: 1;
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.notification__close {
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.notification__close:hover {
		opacity: 1;
	}
</style>
```

### Example 4: User Management with GraphQL

Using GraphQL for user operations:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const GRAPHQL_ENDPOINT = 'https://api.myinstance.social/graphql';

	interface GraphQLResponse<T> {
		data?: T;
		errors?: Array<{ message: string }>;
	}

	async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
		const res = await fetch(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		if (!res.ok) {
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		}

		const result: GraphQLResponse<T> = await res.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors[0].message);
		}

		if (!result.data) {
			throw new Error('No data returned from GraphQL');
		}

		return result.data;
	}

	const adminHandlers = {
		onFetchUsers: async (filters) => {
			const query = `
        query FetchUsers($filters: UserFilters) {
          adminUsers(filters: $filters) {
            id
            username
            email
            displayName
            createdAt
            role
            status
            postsCount
            followersCount
          }
        }
      `;

			const data = await graphqlRequest<{
				adminUsers: AdminUser[];
			}>(query, { filters });

			return data.adminUsers;
		},

		onSuspendUser: async (userId, reason) => {
			const mutation = `
        mutation SuspendUser($userId: ID!, $reason: String!) {
          suspendUser(userId: $userId, reason: $reason) {
            success
            message
          }
        }
      `;

			await graphqlRequest(mutation, { userId, reason });
		},

		onUnsuspendUser: async (userId) => {
			const mutation = `
        mutation UnsuspendUser($userId: ID!) {
          unsuspendUser(userId: $userId) {
            success
            message
          }
        }
      `;

			await graphqlRequest(mutation, { userId });
		},

		onChangeUserRole: async (userId, role) => {
			const mutation = `
        mutation ChangeUserRole($userId: ID!, $role: UserRole!) {
          changeUserRole(userId: $userId, role: $role) {
            success
            message
          }
        }
      `;

			await graphqlRequest(mutation, {
				userId,
				role: role.toUpperCase(),
			});
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="user-management-graphql">
		<div class="header">
			<h1>User Management</h1>
			<span class="api-badge">GraphQL API</span>
		</div>

		<Admin.Users />
	</div>
</Admin.Root>

<style>
	.user-management-graphql {
		padding: 2rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.api-badge {
		padding: 0.375rem 0.75rem;
		background: rgba(139, 92, 246, 0.1);
		border: 1px solid #8b5cf6;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		color: #8b5cf6;
		text-transform: uppercase;
	}
</style>
```

### Example 5: User Management with Pagination and Export

Advanced features including pagination and CSV export:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminUser } from '@equaltoai/greater-components-fediverse/Admin';

	let currentPage = $state(1);
	let perPage = $state(50);
	let totalUsers = $state(0);
	let allUsers = $state<AdminUser[]>([]);

	const totalPages = $derived(Math.ceil(totalUsers / perPage));

	const adminHandlers = {
		onFetchUsers: async (filters) => {
			const params = new URLSearchParams({
				...(filters as Record<string, string>),
				page: currentPage.toString(),
				perPage: perPage.toString(),
			});

			const res = await fetch(`/api/admin/users?${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});

			if (!res.ok) throw new Error('Failed to fetch users');

			const data = await res.json();
			totalUsers = data.total;
			allUsers = data.users;

			return data.users;
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

		onChangeUserRole: async (userId, role) => {
			await fetch(`/api/admin/users/${userId}/role`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ role }),
			});
		},
	};

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		adminHandlers.onFetchUsers?.({});
	}

	function exportToCSV() {
		// Create CSV content
		const headers = [
			'Username',
			'Email',
			'Display Name',
			'Role',
			'Status',
			'Posts',
			'Followers',
			'Created',
		];
		const rows = allUsers.map((user) => [
			user.username,
			user.email,
			user.displayName,
			user.role,
			user.status,
			user.postsCount.toString(),
			user.followersCount.toString(),
			new Date(user.createdAt).toLocaleDateString(),
		]);

		const csvContent = [
			headers.join(','),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
		].join('\n');

		// Download file
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
		link.click();
		URL.revokeObjectURL(link.href);
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="user-management-advanced">
		<div class="header">
			<h1>User Management</h1>

			<button class="export-button" onclick={exportToCSV}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
					/>
				</svg>
				Export CSV
			</button>
		</div>

		<Admin.Users />

		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="pagination__button"
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>

				<div class="pagination__info">
					Page {currentPage} of {totalPages} ({totalUsers} total users)
				</div>

				<button
					class="pagination__button"
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		{/if}
	</div>
</Admin.Root>

<style>
	.user-management-advanced {
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

	.export-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.export-button:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.export-button svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 2rem;
		padding: 1rem 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.pagination__button {
		padding: 0.625rem 1.25rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.pagination__button:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.pagination__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination__info {
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
	}
</style>
```

---

## 🔒 Security Considerations

### 1. Permission Verification

**Always verify admin permissions before actions:**

```typescript
// Server-side check
export async function POST({ request }) {
	const user = await authenticateUser(request);

	if (!user || user.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	// Prevent self-suspension
	const { userId } = await request.json();
	if (userId === user.id) {
		return new Response('Cannot suspend yourself', { status: 400 });
	}

	// Proceed with action
}
```

### 2. Reason Validation

**Validate suspension reasons:**

```typescript
import { z } from 'zod';

const suspendUserSchema = z.object({
	userId: z.string().uuid(),
	reason: z
		.string()
		.min(10, 'Reason must be at least 10 characters')
		.max(500, 'Reason must be at most 500 characters'),
});

export async function suspendUser(data: unknown) {
	const validated = suspendUserSchema.parse(data);
	// Safe to proceed
}
```

### 3. Rate Limiting

**Prevent bulk abuse:**

```typescript
import { rateLimit } from '$lib/middleware';

const suspendLimiter = rateLimit({
	windowMs: 60000, // 1 minute
	max: 10, // Max 10 suspensions per minute
});

export const POST = suspendLimiter(async ({ request }) => {
	// Handler
});
```

### 4. Audit Trail

**Log all user management actions:**

```typescript
async function logUserAction(
	action: string,
	userId: string,
	performedBy: string,
	metadata?: Record<string, any>
) {
	await db.auditLogs.create({
		id: generateUUID(),
		timestamp: new Date().toISOString(),
		action,
		userId,
		performedBy,
		metadata,
		ipAddress: request.headers.get('x-forwarded-for'),
	});
}
```

### 5. Role Hierarchy Protection

**Prevent privilege escalation:**

```typescript
export async function changeUserRole(targetUserId: string, newRole: string, adminUserId: string) {
	const admin = await db.users.findById(adminUserId);
	const target = await db.users.findById(targetUserId);

	// Cannot change own role
	if (targetUserId === adminUserId) {
		throw new Error('Cannot change your own role');
	}

	// Moderators cannot assign admin role
	if (admin.role === 'moderator' && newRole === 'admin') {
		throw new Error('Insufficient permissions');
	}

	// Cannot modify other admins (unless you're a super admin)
	if (target.role === 'admin' && admin.role !== 'super_admin') {
		throw new Error('Cannot modify other administrators');
	}

	await db.users.update(targetUserId, { role: newRole });
}
```

---

## 🎨 Styling

The component uses CSS variables for theming. Customize via CSS:

```css
.admin-users {
	/* Container */
	padding: 1.5rem;
}

.admin-users__table {
	/* Table container */
	overflow-x: auto;
	background: var(--bg-primary, #ffffff);
	border: 1px solid var(--border-color, #e1e8ed);
	border-radius: 0.75rem;
}

.admin-users__badge {
	/* Role/status badges */
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.6875rem;
	font-weight: 700;
	text-transform: uppercase;
}

.admin-users__badge--admin {
	background: rgba(244, 33, 46, 0.1);
	color: #f4211e;
}

.admin-users__badge--moderator {
	background: rgba(245, 158, 11, 0.1);
	color: #f59e0b;
}

.admin-users__badge--user {
	background: rgba(29, 155, 240, 0.1);
	color: #1d9bf0;
}
```

### Custom Styling

```svelte
<Admin.Root handlers={adminHandlers}>
	<Admin.Users class="custom-users" />
</Admin.Root>

<style>
	:global(.custom-users .admin-users__table) {
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	:global(.custom-users .admin-users__action:hover) {
		transform: scale(1.1);
	}
</style>
```

---

## ♿ Accessibility

The component follows WCAG 2.1 Level AA standards:

### Semantic HTML

- Proper table structure with `<thead>`, `<tbody>`, `<th>`, `<td>`
- Form controls have associated labels
- Buttons have descriptive text or aria-labels

### Screen Reader Support

```html
<table aria-label="User management table">
	<thead>
		<tr>
			<th scope="col">Username</th>
			<th scope="col">Email</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		<!-- User rows -->
	</tbody>
</table>
```

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Modals trap focus and return focus on close
- Logical tab order through form fields
- Enter key activates primary actions

### ARIA Attributes

```html
<button aria-label="Suspend user @username" title="Suspend user">
	<svg aria-hidden="true">...</svg>
</button>

<div role="dialog" aria-labelledby="suspend-modal-title">
	<h3 id="suspend-modal-title">Suspend User</h3>
	<!-- Modal content -->
</div>
```

---

## ⚡ Performance

### Optimization Tips

**1. Virtual Scrolling for Large Lists:**

```svelte
<script lang="ts">
	import { VirtualList } from 'svelte-virtual-list';

	// Only render visible users
</script>
```

**2. Debounced Search:**

```svelte
<script lang="ts">
	import { debounce } from '$lib/utils';

	const debouncedSearch = debounce((query: string) => {
		adminHandlers.onFetchUsers?.({ search: query });
	}, 300);
</script>
```

**3. Optimistic Updates:**

```svelte
<script lang="ts">
	async function handleSuspend(user: AdminUser) {
		// Optimistically update UI
		user.status = 'suspended';

		try {
			await adminHandlers.onSuspendUser(user.id, reason);
		} catch (error) {
			// Revert on error
			user.status = 'active';
			throw error;
		}
	}
</script>
```

---

## 🧪 Testing

Run tests for Admin.Users:

```bash
npm test -- Admin/Users.test.ts
```

### Example Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Admin } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Admin.Users', () => {
	it('displays users in table', async () => {
		const mockUsers = [
			{
				id: '1',
				username: 'alice',
				email: 'alice@example.com',
				displayName: 'Alice',
				createdAt: '2024-01-01T00:00:00Z',
				role: 'user',
				status: 'active',
				postsCount: 42,
				followersCount: 100,
			},
		];

		const handlers = {
			onFetchUsers: vi.fn().mockResolvedValue(mockUsers),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Users);

		await waitFor(() => {
			expect(screen.getByText('alice')).toBeInTheDocument();
			expect(screen.getByText('alice@example.com')).toBeInTheDocument();
		});
	});

	it('opens suspend modal on button click', async () => {
		const mockUsers = [
			{
				id: '1',
				username: 'bob',
				email: 'bob@example.com',
				displayName: 'Bob',
				createdAt: '2024-01-01T00:00:00Z',
				role: 'user',
				status: 'active',
				postsCount: 10,
				followersCount: 20,
			},
		];

		const handlers = {
			onFetchUsers: vi.fn().mockResolvedValue(mockUsers),
			onSuspendUser: vi.fn(),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Users);

		await waitFor(() => screen.getByTitle('Suspend user'));

		const suspendButton = screen.getByTitle('Suspend user');
		await fireEvent.click(suspendButton);

		expect(screen.getByText('Suspend User')).toBeInTheDocument();
		expect(screen.getByText(/about to suspend/)).toBeInTheDocument();
	});

	it('suspends user with reason', async () => {
		const mockUsers = [
			{
				id: '1',
				username: 'charlie',
				email: 'charlie@example.com',
				displayName: 'Charlie',
				createdAt: '2024-01-01T00:00:00Z',
				role: 'user',
				status: 'active',
				postsCount: 5,
				followersCount: 10,
			},
		];

		const onSuspendUser = vi.fn();
		const handlers = {
			onFetchUsers: vi.fn().mockResolvedValue(mockUsers),
			onSuspendUser,
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Users);

		await waitFor(() => screen.getByTitle('Suspend user'));

		// Open modal
		await fireEvent.click(screen.getByTitle('Suspend user'));

		// Enter reason
		const reasonInput = screen.getByLabelText('Reason');
		await fireEvent.input(reasonInput, {
			target: { value: 'Spam activity' },
		});

		// Submit
		const submitButton = screen.getByText('Suspend User');
		await fireEvent.click(submitButton);

		expect(onSuspendUser).toHaveBeenCalledWith('1', 'Spam activity');
	});
});
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md) - Admin context provider
- [Admin.Overview](./Overview.md) - Dashboard statistics
- [Admin.Reports](./Reports.md) - Moderation reports
- [Admin.Moderation](./Moderation.md) - Quick moderation tools
- [Admin.Logs](./Logs.md) - Audit logs

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [User Management Guide](../../../docs/guides/user-management.md)
- [Role-Based Access Control](../../../docs/guides/rbac.md)
- [API Documentation](../../../API_DOCUMENTATION.md)
- [Security Best Practices](../../../SECURITY.md)

---

## 💡 Tips & Best Practices

### Search Performance

- Implement server-side search for large user bases
- Use debouncing to reduce API calls
- Consider full-text search indexes

### Bulk Operations

- Add bulk selection for mass actions
- Implement queue system for large operations
- Provide progress indicators

### User Privacy

- Mask sensitive data (emails, IP addresses)
- Implement data retention policies
- Provide user data export/deletion

### Role Management

- Document role capabilities clearly
- Implement role hierarchy (admin > moderator > user)
- Prevent privilege escalation

---

## 🐛 Troubleshooting

### Issue: Users not loading

**Solution**: Verify endpoint and permissions:

```typescript
const handlers = {
	onFetchUsers: async (filters) => {
		const token = localStorage.getItem('authToken');
		if (!token) {
			throw new Error('Not authenticated');
		}

		const res = await fetch('/api/admin/users', {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status === 403) {
			throw new Error('Insufficient permissions');
		}

		return res.json();
	},
};
```

### Issue: Modal not closing after action

**Solution**: Ensure handlers complete successfully:

```typescript
onSuspendUser: async (userId, reason) => {
	try {
		await fetch(`/api/admin/users/${userId}/suspend`, {
			method: 'POST',
			body: JSON.stringify({ reason }),
		});
		// Modal will close automatically on success
	} catch (error) {
		// Modal stays open on error
		throw error;
	}
};
```

### Issue: Filters not working

**Solution**: Check filter parameter handling:

```typescript
onFetchUsers: async (filters) => {
	const params = new URLSearchParams();

	// Only add defined filters
	if (filters?.role) params.set('role', filters.role);
	if (filters?.status) params.set('status', filters.status);
	if (filters?.search) params.set('search', filters.search);

	const res = await fetch(`/api/admin/users?${params}`);
	return res.json();
};
```

---

**For comprehensive instance administration, see the [Admin Components Overview](./README.md).**
