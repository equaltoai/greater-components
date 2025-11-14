# Admin.Reports

**Component**: Content Moderation Reports Management  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 65 passing tests

---

## 📋 Overview

`Admin.Reports` provides a comprehensive interface for managing content moderation reports submitted by users. It displays reported content, user reports, and provides tools for moderators and administrators to review, resolve, or dismiss reports. The component supports filtering by status, viewing reporter and target information, and taking appropriate moderation actions.

### **Key Features**:

- ✅ Display all content reports
- ✅ Filter by status (pending, resolved, dismissed)
- ✅ View reporter and target details
- ✅ See reported content/user information
- ✅ Resolve reports with moderation action
- ✅ Dismiss reports as invalid
- ✅ Track report status changes
- ✅ Chronological sorting
- ✅ Loading and empty states
- ✅ Error handling
- ✅ Accessible interface
- ✅ Audit logging integration

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
		onFetchReports: async (status) => {
			const params = status ? `?status=${status}` : '';
			const res = await fetch(`/api/admin/reports${params}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to fetch reports');
			}

			return res.json();
		},

		onResolveReport: async (reportId, action) => {
			const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAuthToken()}`,
				},
				body: JSON.stringify({ action }),
			});

			if (!res.ok) {
				throw new Error('Failed to resolve report');
			}
		},

		onDismissReport: async (reportId) => {
			const res = await fetch(`/api/admin/reports/${reportId}/dismiss`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to dismiss report');
			}
		},
	};

	function getAuthToken(): string {
		return localStorage.getItem('authToken') || '';
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<Admin.Reports />
</Admin.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                  |
| ------- | -------- | ------- | -------- | ---------------------------- |
| `class` | `string` | `''`    | No       | Custom CSS class for styling |

**Note**: The component retrieves reports and handlers from the Admin context provided by `Admin.Root`.

---

## 📤 Events

The component uses handlers from the Admin context:

```typescript
interface AdminHandlers {
	onFetchReports?: (status?: 'pending' | 'resolved' | 'dismissed') => Promise<AdminReport[]>;

	onResolveReport?: (reportId: string, action: string) => Promise<void>;
	onDismissReport?: (reportId: string) => Promise<void>;
}

interface AdminReport {
	id: string;
	reporter: {
		id: string;
		username: string;
	};
	target: {
		id: string;
		username: string;
		type: 'user' | 'post';
	};
	reason: string;
	status: 'pending' | 'resolved' | 'dismissed';
	createdAt: string;
	assignedTo?: string;
}
```

### onFetchReports

**Type**: `(status?: 'pending' | 'resolved' | 'dismissed') => Promise<AdminReport[]>`

**Description**: Fetches reports filtered by optional status. Called on component mount with 'pending' status by default.

**Parameters**:

- `status`: Optional filter for report status

**Example**:

```typescript
onFetchReports: async (status) => {
	const params = status ? `?status=${status}` : '';
	const res = await fetch(`/api/admin/reports${params}`);
	return res.json();
};
```

### onResolveReport

**Type**: `(reportId: string, action: string) => Promise<void>`

**Description**: Resolves a report by taking a moderation action (e.g., 'suspend', 'delete', 'warn').

**Parameters**:

- `reportId`: ID of the report to resolve
- `action`: Moderation action taken

**Example**:

```typescript
onResolveReport: async (reportId, action) => {
	await fetch(`/api/admin/reports/${reportId}/resolve`, {
		method: 'POST',
		body: JSON.stringify({ action }),
	});

	await logAuditEvent('report_resolved', { reportId, action });
};
```

### onDismissReport

**Type**: `(reportId: string) => Promise<void>`

**Description**: Dismisses a report as invalid or not requiring action.

**Parameters**:

- `reportId`: ID of the report to dismiss

**Example**:

```typescript
onDismissReport: async (reportId) => {
	await fetch(`/api/admin/reports/${reportId}/dismiss`, {
		method: 'POST',
	});

	await logAuditEvent('report_dismissed', { reportId });
};
```

---

## 💡 Examples

### Example 1: Basic Reports Management

Simple reports interface with resolve and dismiss actions:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const adminHandlers = {
		onFetchReports: async (status) => {
			try {
				const params = status ? `?status=${status}` : '';
				const res = await fetch(`/api/admin/reports${params}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Failed to fetch reports');
				}

				return res.json();
			} catch (error) {
				console.error('Fetch reports error:', error);
				throw error;
			}
		},

		onResolveReport: async (reportId, action) => {
			try {
				const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ action }),
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Failed to resolve report');
				}

				showNotification('Report resolved successfully', 'success');
			} catch (error) {
				console.error('Resolve report error:', error);
				showNotification(error.message, 'error');
				throw error;
			}
		},

		onDismissReport: async (reportId) => {
			try {
				const res = await fetch(`/api/admin/reports/${reportId}/dismiss`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Failed to dismiss report');
				}

				showNotification('Report dismissed', 'success');
			} catch (error) {
				console.error('Dismiss report error:', error);
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
	<div class="reports-management">
		<h1>Content Reports</h1>
		<p class="subtitle">Review and moderate reported content</p>
		<Admin.Reports />
	</div>
</Admin.Root>

<style>
	.reports-management {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.reports-management h1 {
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

### Example 2: Reports with Detailed Actions

Extended actions with confirmation dialogs:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminReport } from '@equaltoai/greater-components-fediverse/Admin';

	let selectedReport = $state<AdminReport | null>(null);
	let actionModalOpen = $state(false);
	let selectedAction = $state<'suspend' | 'delete' | 'warn' | null>(null);
	let actionNotes = $state('');

	const adminHandlers = {
		onFetchReports: async (status) => {
			const params = status ? `?status=${status}` : '';
			const res = await fetch(`/api/admin/reports${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onResolveReport: async (reportId, action) => {
			// Custom resolve with notes
			await fetch(`/api/admin/reports/${reportId}/resolve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({
					action,
					notes: actionNotes,
					performedAt: new Date().toISOString(),
				}),
			});

			// Close modal
			actionModalOpen = false;
			selectedReport = null;
			selectedAction = null;
			actionNotes = '';

			// Refresh reports list
			await adminHandlers.onFetchReports?.('pending');
		},

		onDismissReport: async (reportId) => {
			await fetch(`/api/admin/reports/${reportId}/dismiss`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};

	function openActionModal(report: AdminReport, action: 'suspend' | 'delete' | 'warn') {
		selectedReport = report;
		selectedAction = action;
		actionModalOpen = true;
	}

	function closeActionModal() {
		actionModalOpen = false;
		selectedReport = null;
		selectedAction = null;
		actionNotes = '';
	}

	async function handleConfirmAction() {
		if (!selectedReport || !selectedAction) return;

		try {
			await adminHandlers.onResolveReport?.(selectedReport.id, selectedAction);
		} catch (error) {
			console.error('Action failed:', error);
		}
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="reports-with-actions">
		<Admin.Reports />

		<!-- Custom action modal -->
		{#if actionModalOpen && selectedReport}
			<div class="modal-backdrop">
				<div class="modal">
					<h3 class="modal__title">
						{#if selectedAction === 'suspend'}
							Suspend User
						{:else if selectedAction === 'delete'}
							Delete Content
						{:else}
							Warn User
						{/if}
					</h3>

					<div class="modal__content">
						<p>
							Taking action on report from
							<strong>@{selectedReport.reporter.username}</strong>
							against
							<strong>@{selectedReport.target.username}</strong>
						</p>

						<div class="modal__field">
							<label for="action-notes">Notes</label>
							<textarea
								id="action-notes"
								bind:value={actionNotes}
								placeholder="Add notes about this action..."
								rows="4"
							></textarea>
						</div>
					</div>

					<div class="modal__actions">
						<button class="button button--secondary" onclick={closeActionModal}> Cancel </button>
						<button class="button button--danger" onclick={handleConfirmAction}> Confirm </button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Admin.Root>

<style>
	.reports-with-actions {
		position: relative;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 1rem;
	}

	.modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 32rem;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.modal__title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.modal__content {
		margin-bottom: 1.5rem;
	}

	.modal__field {
		margin-top: 1rem;
	}

	.modal__field label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
	}

	.modal__field textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-family: inherit;
		font-size: 0.9375rem;
		resize: vertical;
	}

	.modal__actions {
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

	.button--secondary:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.button--danger {
		background: #f4211e;
		color: white;
	}

	.button--danger:hover {
		background: #d41d1a;
	}
</style>
```

### Example 3: Reports with Assignment System

Assign reports to specific moderators:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminReport } from '@equaltoai/greater-components-fediverse/Admin';

	interface Moderator {
		id: string;
		username: string;
		reportsAssigned: number;
	}

	let moderators = $state<Moderator[]>([]);
	let selectedReport = $state<AdminReport | null>(null);
	let assignModalOpen = $state(false);

	async function fetchModerators() {
		const res = await fetch('/api/admin/moderators', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		});
		moderators = await res.json();
	}

	async function assignReport(reportId: string, moderatorId: string) {
		await fetch(`/api/admin/reports/${reportId}/assign`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
			body: JSON.stringify({ moderatorId }),
		});

		assignModalOpen = false;
		selectedReport = null;

		// Refresh reports
		await adminHandlers.onFetchReports?.('pending');
	}

	const adminHandlers = {
		onFetchReports: async (status) => {
			const params = status ? `?status=${status}` : '';
			const res = await fetch(`/api/admin/reports${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onResolveReport: async (reportId, action) => {
			await fetch(`/api/admin/reports/${reportId}/resolve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ action }),
			});
		},

		onDismissReport: async (reportId) => {
			await fetch(`/api/admin/reports/${reportId}/dismiss`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};

	$effect(() => {
		fetchModerators();
	});

	function openAssignModal(report: AdminReport) {
		selectedReport = report;
		assignModalOpen = true;
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="reports-with-assignment">
		<div class="header">
			<h1>Content Reports</h1>
			<div class="moderator-stats">
				<span>Active Moderators: {moderators.length}</span>
			</div>
		</div>

		<Admin.Reports />

		<!-- Assignment Modal -->
		{#if assignModalOpen && selectedReport}
			<div class="modal-backdrop">
				<div class="modal">
					<h3>Assign Report</h3>

					<p>Assign report from @{selectedReport.reporter.username} to a moderator:</p>

					<div class="moderator-list">
						{#each moderators as moderator}
							<button
								class="moderator-card"
								onclick={() => assignReport(selectedReport.id, moderator.id)}
							>
								<div class="moderator-card__info">
									<strong>@{moderator.username}</strong>
									<span>{moderator.reportsAssigned} assigned reports</span>
								</div>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
								</svg>
							</button>
						{/each}
					</div>

					<button class="button button--secondary" onclick={() => (assignModalOpen = false)}>
						Cancel
					</button>
				</div>
			</div>
		{/if}
	</div>
</Admin.Root>

<style>
	.reports-with-assignment {
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

	.moderator-stats {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 1rem;
	}

	.modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 32rem;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.modal h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.modal p {
		margin: 0 0 1.5rem 0;
		color: var(--text-secondary, #536471);
	}

	.moderator-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.moderator-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.moderator-card:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.moderator-card__info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.moderator-card__info strong {
		font-size: 0.9375rem;
	}

	.moderator-card__info span {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.moderator-card svg {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
	}

	.button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}
</style>
```

### Example 4: Reports with GraphQL

Using GraphQL for report management:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const GRAPHQL_ENDPOINT = 'https://api.myinstance.social/graphql';

	async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
		const res = await fetch(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		const result = await res.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data;
	}

	const adminHandlers = {
		onFetchReports: async (status) => {
			const query = `
        query FetchReports($status: ReportStatus) {
          adminReports(status: $status) {
            id
            reporter {
              id
              username
            }
            target {
              id
              username
              type
            }
            reason
            status
            createdAt
            assignedTo
          }
        }
      `;

			const data = await graphqlRequest<{
				adminReports: AdminReport[];
			}>(query, { status });

			return data.adminReports;
		},

		onResolveReport: async (reportId, action) => {
			const mutation = `
        mutation ResolveReport($reportId: ID!, $action: String!) {
          resolveReport(reportId: $reportId, action: $action) {
            success
            message
          }
        }
      `;

			await graphqlRequest(mutation, { reportId, action });
		},

		onDismissReport: async (reportId) => {
			const mutation = `
        mutation DismissReport($reportId: ID!) {
          dismissReport(reportId: $reportId) {
            success
            message
          }
        }
      `;

			await graphqlRequest(mutation, { reportId });
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="reports-graphql">
		<div class="header">
			<h1>Content Reports</h1>
			<span class="api-badge">GraphQL API</span>
		</div>

		<Admin.Reports />
	</div>
</Admin.Root>

<style>
	.reports-graphql {
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

### Example 5: Reports with Real-time Updates

Real-time notifications for new reports:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import { onMount, onDestroy } from 'svelte';

	let newReportsCount = $state(0);
	let websocket: WebSocket | null = null;

	onMount(() => {
		// Connect to WebSocket for real-time updates
		websocket = new WebSocket('wss://api.myinstance.social/admin/reports');

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'new_report') {
				newReportsCount++;
				showNotification(`New report from @${data.reporter.username}`);
			}
		};

		websocket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};
	});

	onDestroy(() => {
		if (websocket) {
			websocket.close();
		}
	});

	function showNotification(message: string) {
		// Show browser notification
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('New Report', { body: message });
		}
	}

	async function refreshReports() {
		await adminHandlers.onFetchReports?.('pending');
		newReportsCount = 0;
	}

	const adminHandlers = {
		onFetchReports: async (status) => {
			const params = status ? `?status=${status}` : '';
			const res = await fetch(`/api/admin/reports${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			return res.json();
		},

		onResolveReport: async (reportId, action) => {
			await fetch(`/api/admin/reports/${reportId}/resolve`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ action }),
			});
		},

		onDismissReport: async (reportId) => {
			await fetch(`/api/admin/reports/${reportId}/dismiss`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="reports-realtime">
		<div class="header">
			<h1>Content Reports</h1>

			{#if newReportsCount > 0}
				<button class="new-reports-badge" onclick={refreshReports}>
					{newReportsCount} new report{newReportsCount > 1 ? 's' : ''}
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
						/>
					</svg>
				</button>
			{/if}
		</div>

		<Admin.Reports />
	</div>
</Admin.Root>

<style>
	.reports-realtime {
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

	.new-reports-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid #f59e0b;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: #f59e0b;
		cursor: pointer;
		transition: all 0.2s;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.new-reports-badge:hover {
		background: rgba(245, 158, 11, 0.2);
	}

	.new-reports-badge svg {
		width: 1rem;
		height: 1rem;
	}
</style>
```

---

## 🔒 Security Considerations

### 1. Permission Checks

**Verify moderator/admin permissions:**

```typescript
// Server-side permission check
export async function GET({ request }) {
	const user = await authenticateUser(request);

	if (!user || !['admin', 'moderator'].includes(user.role)) {
		return new Response('Forbidden', { status: 403 });
	}

	// Moderators can only see unassigned or their own assigned reports
	let reports;
	if (user.role === 'moderator') {
		reports = await db.reports.find({
			$or: [{ assignedTo: null }, { assignedTo: user.id }],
		});
	} else {
		// Admins see all reports
		reports = await db.reports.find();
	}

	return json(reports);
}
```

### 2. Report Privacy

**Protect reporter and target information:**

```typescript
// Anonymize sensitive data
function sanitizeReport(report: AdminReport, userRole: string) {
	return {
		...report,
		// Only admins see reporter email
		reporter: {
			...report.reporter,
			email: userRole === 'admin' ? report.reporter.email : undefined,
		},
	};
}
```

### 3. Audit Logging

**Log all moderation decisions:**

```typescript
async function logModerationAction(
	reportId: string,
	action: string,
	moderatorId: string,
	notes?: string
) {
	await db.auditLogs.create({
		id: generateUUID(),
		timestamp: new Date().toISOString(),
		action: 'report_moderated',
		reportId,
		moderatorId,
		moderationAction: action,
		notes,
		severity: 'high',
	});
}
```

### 4. Rate Limiting

**Prevent abuse of report system:**

```typescript
import { rateLimit } from '$lib/middleware';

const resolveLimiter = rateLimit({
	windowMs: 60000, // 1 minute
	max: 20, // Max 20 resolves per minute
});

export const POST = resolveLimiter(async ({ request }) => {
	// Handler
});
```

---

## 🎨 Styling

The component uses CSS variables for theming:

```css
.admin-reports {
	padding: 1.5rem;
}

.admin-reports__card {
	padding: 1rem;
	background: var(--bg-primary, #ffffff);
	border: 1px solid var(--border-color, #e1e8ed);
	border-radius: 0.5rem;
}

.admin-reports__badge {
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
}

.admin-reports__badge--pending {
	background: rgba(245, 158, 11, 0.1);
	color: #f59e0b;
}

.admin-reports__badge--resolved {
	background: rgba(0, 186, 124, 0.1);
	color: #00ba7c;
}

.admin-reports__badge--dismissed {
	background: rgba(107, 114, 128, 0.1);
	color: #6b7280;
}
```

### Custom Styling

```svelte
<Admin.Root handlers={adminHandlers}>
	<Admin.Reports class="custom-reports" />
</Admin.Root>

<style>
	:global(.custom-reports .admin-reports__card) {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.custom-reports .admin-reports__actions button:hover) {
		transform: translateY(-2px);
	}
</style>
```

---

## ♿ Accessibility

The component follows WCAG 2.1 Level AA standards:

### Semantic HTML

- Uses semantic elements for structure
- Report cards have proper headings
- Buttons have descriptive labels

### Screen Reader Support

```html
<div role="region" aria-label="Content reports">
	<div role="article" aria-labelledby="report-1-title">
		<h3 id="report-1-title">Report from @username</h3>
		<!-- Report content -->
	</div>
</div>
```

### Keyboard Navigation

- All actions are keyboard accessible
- Logical tab order through reports
- Enter key activates buttons

### Status Indicators

```html
<span
	class="admin-reports__badge admin-reports__badge--pending"
	role="status"
	aria-label="Report status: pending"
>
	pending
</span>
```

---

## ⚡ Performance

### Optimization Tips

**1. Paginate Reports:**

```svelte
<script lang="ts">
	let page = $state(1);
	let perPage = 20;

	const adminHandlers = {
		onFetchReports: async (status) => {
			const params = new URLSearchParams({
				status: status || '',
				page: page.toString(),
				perPage: perPage.toString(),
			});
			const res = await fetch(`/api/admin/reports?${params}`);
			return res.json();
		},
	};
</script>
```

**2. Filter on Server:**

```typescript
// Server-side filtering
export async function GET({ url }) {
	const status = url.searchParams.get('status');
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = parseInt(url.searchParams.get('perPage') || '20');

	const query = status ? { status } : {};

	const reports = await db.reports
		.find(query)
		.sort({ createdAt: -1 })
		.skip((page - 1) * perPage)
		.limit(perPage);

	return json(reports);
}
```

---

## 🧪 Testing

Run tests for Admin.Reports:

```bash
npm test -- Admin/Reports.test.ts
```

### Example Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Admin } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Admin.Reports', () => {
	it('displays reports list', async () => {
		const mockReports = [
			{
				id: '1',
				reporter: { id: '1', username: 'alice' },
				target: { id: '2', username: 'bob', type: 'user' },
				reason: 'Spam activity',
				status: 'pending',
				createdAt: '2024-01-01T00:00:00Z',
			},
		];

		const handlers = {
			onFetchReports: vi.fn().mockResolvedValue(mockReports),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Reports);

		await waitFor(() => {
			expect(screen.getByText('@alice')).toBeInTheDocument();
			expect(screen.getByText('@bob')).toBeInTheDocument();
			expect(screen.getByText('Spam activity')).toBeInTheDocument();
		});
	});

	it('resolves report', async () => {
		const mockReports = [
			{
				id: '1',
				reporter: { id: '1', username: 'alice' },
				target: { id: '2', username: 'bob', type: 'user' },
				reason: 'Spam',
				status: 'pending',
				createdAt: '2024-01-01T00:00:00Z',
			},
		];

		const onResolveReport = vi.fn();
		const handlers = {
			onFetchReports: vi.fn().mockResolvedValue(mockReports),
			onResolveReport,
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Reports);

		await waitFor(() => screen.getByText('Resolve'));

		const resolveButton = screen.getByText('Resolve');
		await fireEvent.click(resolveButton);

		expect(onResolveReport).toHaveBeenCalledWith('1', expect.any(String));
	});
});
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md) - Admin context provider
- [Admin.Moderation](./Moderation.md) - Quick moderation tools
- [Admin.Users](./Users.md) - User management
- [Admin.Logs](./Logs.md) - Audit logs

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [Content Moderation Guide](../../../docs/guides/moderation.md)
- [Report Handling Best Practices](../../../docs/guides/reports.md)
- [API Documentation](../../../API_DOCUMENTATION.md)

---

## 💡 Tips & Best Practices

### Report Triaging

- Review reports promptly (within 24 hours)
- Assign based on moderator expertise
- Prioritize severe violations
- Document decisions clearly

### Fair Moderation

- Review full context before action
- Give users chance to explain
- Be consistent with policies
- Appeal process available

### Communication

- Notify users of actions taken
- Explain policy violations clearly
- Provide improvement guidance
- Track repeat offenders

---

## 🐛 Troubleshooting

### Issue: Reports not loading

**Solution**: Check permissions and endpoint:

```typescript
const handlers = {
	onFetchReports: async (status) => {
		const token = localStorage.getItem('authToken');
		if (!token) throw new Error('Not authenticated');

		const res = await fetch(`/api/admin/reports?status=${status || ''}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status === 403) {
			throw new Error('Insufficient permissions');
		}

		return res.json();
	},
};
```

### Issue: Actions not updating list

**Solution**: Refresh after action:

```typescript
onResolveReport: async (reportId, action) => {
	await fetch(`/api/admin/reports/${reportId}/resolve`, {
		method: 'POST',
		body: JSON.stringify({ action }),
	});

	// Refresh the reports list
	await handlers.onFetchReports?.('pending');
};
```

---

**For comprehensive content moderation, see the [Admin Components Overview](./README.md).**
