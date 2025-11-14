# Admin.Overview

**Component**: Dashboard Overview with Instance Statistics  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 52 passing tests

---

## 📋 Overview

`Admin.Overview` displays a comprehensive dashboard with key instance statistics and metrics. It provides administrators with an at-a-glance view of their instance health, including user counts, activity levels, pending moderation items, and resource usage. The component automatically fetches and refreshes statistics, presenting them in an easily scannable card-based layout.

### **Key Features**:

- ✅ Real-time instance statistics
- ✅ Automatic data fetching on mount
- ✅ Formatted number display (K, M abbreviations)
- ✅ Visual status indicators
- ✅ Warning highlights for pending items
- ✅ Responsive grid layout
- ✅ Loading states
- ✅ Error handling
- ✅ Accessible labels and semantics
- ✅ Customizable styling

### **Displayed Metrics**:

- **Total Users**: Complete user count on the instance
- **Active Users**: Recently active user count
- **Total Posts**: Cumulative posts created
- **Pending Reports**: Unresolved moderation reports (highlighted)
- **Blocked Domains**: Number of blocked federated instances
- **Storage Used**: Current media storage consumption

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
		onFetchStats: async () => {
			const res = await fetch('/api/admin/stats', {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to fetch statistics');
			}

			return res.json();
		},
	};

	function getAuthToken(): string {
		return localStorage.getItem('authToken') || '';
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<Admin.Overview />
</Admin.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description                  |
| ------- | -------- | ------- | -------- | ---------------------------- |
| `class` | `string` | `''`    | No       | Custom CSS class for styling |

**Note**: The component retrieves statistics from the Admin context provided by `Admin.Root`.

---

## 📤 Events

The component uses handlers from the Admin context:

```typescript
interface AdminHandlers {
	onFetchStats?: () => Promise<AdminStats>;
}

interface AdminStats {
	totalUsers: number;
	activeUsers: number;
	totalPosts: number;
	pendingReports: number;
	blockedDomains: number;
	storageUsed: string;
}
```

### onFetchStats

**Type**: `() => Promise<AdminStats>`

**Description**: Fetches current instance statistics. Called automatically on component mount.

**Returns**: Promise resolving to `AdminStats` object with all metrics.

**Example**:

```typescript
onFetchStats: async () => {
	const res = await fetch('/api/admin/stats');
	return res.json();
};
```

---

## 💡 Examples

### Example 1: Basic Dashboard Overview

Simple statistics dashboard:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	const adminHandlers = {
		onFetchStats: async () => {
			try {
				const res = await fetch('/api/admin/stats', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!res.ok) {
					throw new Error(`HTTP ${res.status}: ${res.statusText}`);
				}

				const data = await res.json();

				return {
					totalUsers: data.users.total,
					activeUsers: data.users.active,
					totalPosts: data.posts.total,
					pendingReports: data.moderation.pending_reports,
					blockedDomains: data.federation.blocked_domains,
					storageUsed: data.storage.used,
				};
			} catch (error) {
				console.error('Failed to fetch stats:', error);
				throw error;
			}
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="admin-dashboard">
		<h1>Instance Dashboard</h1>
		<Admin.Overview />
	</div>
</Admin.Root>

<style>
	.admin-dashboard {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.admin-dashboard h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 800;
	}
</style>
```

### Example 2: Dashboard with Auto-Refresh

Statistics that automatically refresh every 30 seconds:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import { onMount, onDestroy } from 'svelte';

	let refreshInterval: ReturnType<typeof setInterval> | null = null;
	let lastRefresh = $state<Date | null>(null);
	let autoRefresh = $state(true);

	const adminHandlers = {
		onFetchStats: async () => {
			const res = await fetch('/api/admin/stats', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to fetch stats');
			}

			lastRefresh = new Date();
			return res.json();
		},
	};

	onMount(() => {
		if (autoRefresh) {
			startAutoRefresh();
		}
	});

	onDestroy(() => {
		stopAutoRefresh();
	});

	function startAutoRefresh() {
		// Refresh every 30 seconds
		refreshInterval = setInterval(() => {
			// Trigger refresh by calling fetch manually
			adminHandlers.onFetchStats();
		}, 30000);
	}

	function stopAutoRefresh() {
		if (refreshInterval) {
			clearInterval(refreshInterval);
			refreshInterval = null;
		}
	}

	$effect(() => {
		if (autoRefresh) {
			startAutoRefresh();
		} else {
			stopAutoRefresh();
		}
	});

	function handleManualRefresh() {
		adminHandlers.onFetchStats();
	}
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="dashboard-header">
		<h1>Instance Dashboard</h1>

		<div class="dashboard-controls">
			<label class="auto-refresh-toggle">
				<input type="checkbox" bind:checked={autoRefresh} />
				<span>Auto-refresh (30s)</span>
			</label>

			<button class="refresh-button" onclick={handleManualRefresh}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
					/>
				</svg>
				Refresh Now
			</button>

			{#if lastRefresh}
				<span class="last-refresh">
					Last updated: {lastRefresh.toLocaleTimeString()}
				</span>
			{/if}
		</div>
	</div>

	<Admin.Overview />
</Admin.Root>

<style>
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 0 1.5rem;
	}

	.dashboard-header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.dashboard-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.auto-refresh-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.auto-refresh-toggle input {
		cursor: pointer;
	}

	.refresh-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
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

	.refresh-button:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.refresh-button svg {
		width: 1rem;
		height: 1rem;
	}

	.last-refresh {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}
</style>
```

### Example 3: Dashboard with Alerts

Dashboard that highlights critical metrics and shows alerts:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	let stats = $state<AdminStats | null>(null);
	let alerts = $derived.by(() => {
		if (!stats) return [];

		const alertList = [];

		// Alert if pending reports exceed threshold
		if (stats.pendingReports > 10) {
			alertList.push({
				level: 'warning',
				message: `${stats.pendingReports} pending reports require attention`,
			});
		}

		// Alert if storage is high
		const storageNum = parseFloat(stats.storageUsed);
		if (storageNum > 80) {
			alertList.push({
				level: 'error',
				message: `Storage usage at ${stats.storageUsed} - consider cleanup`,
			});
		}

		// Alert if active users is low
		const activePercentage = (stats.activeUsers / stats.totalUsers) * 100;
		if (activePercentage < 10) {
			alertList.push({
				level: 'info',
				message: `Only ${activePercentage.toFixed(1)}% of users are active`,
			});
		}

		return alertList;
	});

	const adminHandlers = {
		onFetchStats: async () => {
			const res = await fetch('/api/admin/stats', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});

			if (!res.ok) {
				throw new Error('Failed to fetch stats');
			}

			const data = await res.json();
			stats = data;
			return data;
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="dashboard-with-alerts">
		{#if alerts.length > 0}
			<div class="alerts">
				{#each alerts as alert}
					<div class="alert alert--{alert.level}" role="alert">
						<svg class="alert__icon" viewBox="0 0 24 24" fill="currentColor">
							{#if alert.level === 'error'}
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
								/>
							{:else if alert.level === 'warning'}
								<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
							{:else}
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
								/>
							{/if}
						</svg>
						<span>{alert.message}</span>
					</div>
				{/each}
			</div>
		{/if}

		<Admin.Overview />
	</div>
</Admin.Root>

<style>
	.dashboard-with-alerts {
		padding: 1.5rem;
	}

	.alerts {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.9375rem;
	}

	.alert--error {
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		color: #f4211e;
	}

	.alert--warning {
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid #f59e0b;
		color: #f59e0b;
	}

	.alert--info {
		background: rgba(29, 155, 240, 0.1);
		border: 1px solid #1d9bf0;
		color: #1d9bf0;
	}

	.alert__icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}
</style>
```

### Example 4: Dashboard with GraphQL Integration

Using GraphQL for statistics:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';

	interface GraphQLResponse<T> {
		data?: T;
		errors?: Array<{ message: string }>;
	}

	interface StatsQueryData {
		instanceStats: {
			users: {
				total: number;
				active: number;
			};
			posts: {
				total: number;
			};
			moderation: {
				pendingReports: number;
			};
			federation: {
				blockedDomains: number;
			};
			storage: {
				used: string;
			};
		};
	}

	const STATS_QUERY = `
    query GetInstanceStats {
      instanceStats {
        users {
          total
          active
        }
        posts {
          total
        }
        moderation {
          pendingReports
        }
        federation {
          blockedDomains
        }
        storage {
          used
        }
      }
    }
  `;

	async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
		const res = await fetch('https://api.myinstance.social/graphql', {
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
		onFetchStats: async () => {
			try {
				const data = await graphqlRequest<StatsQueryData>(STATS_QUERY);

				return {
					totalUsers: data.instanceStats.users.total,
					activeUsers: data.instanceStats.users.active,
					totalPosts: data.instanceStats.posts.total,
					pendingReports: data.instanceStats.moderation.pendingReports,
					blockedDomains: data.instanceStats.federation.blockedDomains,
					storageUsed: data.instanceStats.storage.used,
				};
			} catch (error) {
				console.error('GraphQL request failed:', error);
				throw error;
			}
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="dashboard">
		<div class="dashboard__header">
			<h1>Instance Dashboard</h1>
			<span class="dashboard__badge">GraphQL API</span>
		</div>

		<Admin.Overview />
	</div>
</Admin.Root>

<style>
	.dashboard {
		padding: 2rem;
	}

	.dashboard__header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.dashboard__header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
	}

	.dashboard__badge {
		padding: 0.375rem 0.75rem;
		background: rgba(29, 155, 240, 0.1);
		border: 1px solid #1d9bf0;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		color: #1d9bf0;
		text-transform: uppercase;
	}
</style>
```

### Example 5: Dashboard with Historical Comparison

Compare current stats with previous period:

```svelte
<script lang="ts">
	import { Admin } from '@equaltoai/greater-components-fediverse';
	import type { AdminStats } from '@equaltoai/greater-components-fediverse/Admin';

	let currentStats = $state<AdminStats | null>(null);
	let previousStats = $state<AdminStats | null>(null);

	const changes = $derived.by(() => {
		if (!currentStats || !previousStats) return null;

		return {
			users: calculateChange(previousStats.totalUsers, currentStats.totalUsers),
			activeUsers: calculateChange(previousStats.activeUsers, currentStats.activeUsers),
			posts: calculateChange(previousStats.totalPosts, currentStats.totalPosts),
			reports: calculateChange(previousStats.pendingReports, currentStats.pendingReports),
		};
	});

	function calculateChange(oldValue: number, newValue: number) {
		const diff = newValue - oldValue;
		const percentChange = oldValue > 0 ? (diff / oldValue) * 100 : 0;

		return {
			absolute: diff,
			percent: percentChange,
			direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
		};
	}

	function formatChange(change: ReturnType<typeof calculateChange>) {
		const sign = change.absolute > 0 ? '+' : '';
		return `${sign}${change.absolute} (${sign}${change.percent.toFixed(1)}%)`;
	}

	const adminHandlers = {
		onFetchStats: async () => {
			try {
				// Fetch current stats
				const currentRes = await fetch('/api/admin/stats', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (!currentRes.ok) {
					throw new Error('Failed to fetch current stats');
				}

				const current = await currentRes.json();
				currentStats = current;

				// Fetch previous period stats (e.g., 24 hours ago)
				const previousRes = await fetch('/api/admin/stats/previous', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});

				if (previousRes.ok) {
					previousStats = await previousRes.json();
				}

				return current;
			} catch (error) {
				console.error('Failed to fetch stats:', error);
				throw error;
			}
		},
	};
</script>

<Admin.Root handlers={adminHandlers}>
	<div class="dashboard-with-comparison">
		<Admin.Overview />

		{#if changes}
			<div class="changes-panel">
				<h3>Changes (24h)</h3>

				<div class="changes-grid">
					<div class="change-item">
						<span class="change-item__label">Total Users</span>
						<span class="change-item__value change-item__value--{changes.users.direction}">
							{formatChange(changes.users)}
						</span>
					</div>

					<div class="change-item">
						<span class="change-item__label">Active Users</span>
						<span class="change-item__value change-item__value--{changes.activeUsers.direction}">
							{formatChange(changes.activeUsers)}
						</span>
					</div>

					<div class="change-item">
						<span class="change-item__label">Total Posts</span>
						<span class="change-item__value change-item__value--{changes.posts.direction}">
							{formatChange(changes.posts)}
						</span>
					</div>

					<div class="change-item">
						<span class="change-item__label">Pending Reports</span>
						<span class="change-item__value change-item__value--{changes.reports.direction}">
							{formatChange(changes.reports)}
						</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Admin.Root>

<style>
	.dashboard-with-comparison {
		padding: 1.5rem;
	}

	.changes-panel {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.changes-panel h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.changes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
	}

	.change-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.change-item__label {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
		font-weight: 600;
	}

	.change-item__value {
		font-size: 1rem;
		font-weight: 700;
	}

	.change-item__value--up {
		color: #00ba7c;
	}

	.change-item__value--down {
		color: #f4211e;
	}

	.change-item__value--same {
		color: var(--text-secondary, #536471);
	}
</style>
```

---

## 🎨 Styling

The component uses CSS variables for theming:

```css
.admin-overview {
	/* Spacing */
	padding: 1.5rem;

	/* Grid */
	--grid-min-width: 15rem;
	--grid-gap: 1rem;
}

.admin-overview__title {
	/* Typography */
	font-size: 1.5rem;
	font-weight: 800;
	color: var(--text-primary, #0f1419);
	margin: 0 0 1.5rem 0;
}

.admin-overview__card {
	/* Card styling */
	padding: 1.5rem;
	background: var(--bg-primary, #ffffff);
	border: 1px solid var(--border-color, #e1e8ed);
	border-radius: 0.75rem;
}

.admin-overview__card--warning {
	/* Warning state */
	border-color: #f59e0b;
	background: rgba(245, 158, 11, 0.05);
}

.admin-overview__card-value {
	/* Large numbers */
	font-size: 2rem;
	font-weight: 800;
	color: var(--text-primary, #0f1419);
}
```

### Custom Styling

```svelte
<Admin.Root handlers={adminHandlers}>
	<Admin.Overview class="custom-overview" />
</Admin.Root>

<style>
	:global(.custom-overview) {
		padding: 2rem;
	}

	:global(.custom-overview .admin-overview__card) {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.custom-overview .admin-overview__card-value) {
		color: #7c3aed;
	}
</style>
```

---

## 🔧 Utility Functions

### formatNumber

The component uses `formatNumber` utility to abbreviate large numbers:

```typescript
export function formatNumber(num: number): string {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
}
```

**Examples**:

- `formatNumber(1234)` → `"1.2K"`
- `formatNumber(5678900)` → `"5.7M"`
- `formatNumber(789)` → `"789"`

---

## 🔒 Security Considerations

### 1. Authentication Required

**Always require admin authentication:**

```typescript
// Server endpoint
export async function GET({ request }) {
	const user = await authenticateAdmin(request);

	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const stats = await fetchInstanceStats();
	return json(stats);
}
```

### 2. Rate Limiting

**Protect stats endpoint from abuse:**

```typescript
import { rateLimit } from '$lib/middleware';

const statsLimiter = rateLimit({
	windowMs: 60000, // 1 minute
	max: 10, // Max 10 requests per minute
});

export const GET = statsLimiter(async ({ request }) => {
	// Handler
});
```

### 3. Data Sanitization

**Ensure no sensitive data in stats:**

```typescript
async function fetchInstanceStats(): Promise<AdminStats> {
	const stats = await db.getStats();

	// Return only safe, aggregated data
	return {
		totalUsers: stats.users.count,
		activeUsers: stats.users.active,
		totalPosts: stats.posts.count,
		pendingReports: stats.reports.pending,
		blockedDomains: stats.federation.blocked,
		storageUsed: formatBytes(stats.storage.used),
	};
	// ❌ DON'T include: user emails, IP addresses, sensitive content
}
```

### 4. Audit Logging

**Log stats access for compliance:**

```typescript
export async function GET({ request }) {
	const user = await authenticateAdmin(request);

	// Log the access
	await auditLog.create({
		action: 'stats_viewed',
		userId: user.id,
		timestamp: new Date().toISOString(),
		ipAddress: request.headers.get('x-forwarded-for'),
	});

	const stats = await fetchInstanceStats();
	return json(stats);
}
```

---

## ♿ Accessibility

The component follows WCAG 2.1 Level AA standards:

### Semantic HTML

- Uses semantic `<div>` structure with proper headings
- Each card has descriptive labels
- Numbers are in readable format

### Screen Reader Support

```html
<div class="admin-overview" role="region" aria-label="Instance Statistics">
	<h2 class="admin-overview__title">Dashboard Overview</h2>

	<div class="admin-overview__grid">
		<div class="admin-overview__card" role="article">
			<div class="admin-overview__card-label">Total Users</div>
			<div class="admin-overview__card-value" aria-label="1,234 total users">1.2K</div>
		</div>
	</div>
</div>
```

### Color Contrast

- All text meets minimum 4.5:1 contrast ratio
- Warning cards use distinct visual indicators beyond just color

### Keyboard Navigation

- Focusable elements have proper focus indicators
- Logical tab order through statistics

---

## ⚡ Performance

### Optimization Tips

**1. Debounced Auto-Refresh:**

```svelte
<script lang="ts">
	import { debounce } from '$lib/utils';

	const debouncedFetch = debounce(() => {
		adminHandlers.onFetchStats();
	}, 300);
</script>
```

**2. Memoized Calculations:**

```svelte
<script lang="ts">
	const activePercentage = $derived.by(() => {
		if (!stats) return 0;
		return (stats.activeUsers / stats.totalUsers) * 100;
	});
</script>
```

**3. Conditional Rendering:**

```svelte
{#if state.loading && !state.stats}
	<LoadingSpinner />
{:else if state.stats}
	<!-- Show stats -->
{/if}
```

---

## 🧪 Testing

Run tests for Admin.Overview:

```bash
npm test -- Admin/Overview.test.ts
```

### Example Tests

```typescript
import { render, screen, waitFor } from '@testing-library/svelte';
import { Admin } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Admin.Overview', () => {
	it('displays statistics correctly', async () => {
		const mockStats = {
			totalUsers: 1234,
			activeUsers: 567,
			totalPosts: 8900,
			pendingReports: 5,
			blockedDomains: 12,
			storageUsed: '45.2 GB',
		};

		const handlers = {
			onFetchStats: vi.fn().mockResolvedValue(mockStats),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Overview);

		await waitFor(() => {
			expect(screen.getByText('1.2K')).toBeInTheDocument(); // Total users
			expect(screen.getByText('567')).toBeInTheDocument(); // Active users
			expect(screen.getByText('8.9K')).toBeInTheDocument(); // Posts
			expect(screen.getByText('5')).toBeInTheDocument(); // Reports
			expect(screen.getByText('12')).toBeInTheDocument(); // Blocked domains
			expect(screen.getByText('45.2 GB')).toBeInTheDocument(); // Storage
		});
	});

	it('shows loading state', () => {
		const handlers = {
			onFetchStats: vi
				.fn()
				.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000))),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Overview);

		expect(screen.getByText('Loading stats...')).toBeInTheDocument();
	});

	it('handles fetch errors', async () => {
		const handlers = {
			onFetchStats: vi.fn().mockRejectedValue(new Error('Network error')),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Overview);

		await waitFor(() => {
			// Error is handled by context
			expect(handlers.onFetchStats).toHaveBeenCalled();
		});
	});

	it('highlights pending reports', async () => {
		const mockStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 200,
			pendingReports: 25,
			blockedDomains: 5,
			storageUsed: '10 GB',
		};

		const handlers = {
			onFetchStats: vi.fn().mockResolvedValue(mockStats),
		};

		render(Admin.Root, { props: { handlers } });
		render(Admin.Overview);

		await waitFor(() => {
			const reportsCard = screen.getByText('25').closest('.admin-overview__card');
			expect(reportsCard).toHaveClass('admin-overview__card--warning');
		});
	});
});
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md) - Admin context provider
- [Admin.Analytics](./Analytics.md) - Detailed analytics and charts
- [Admin.Users](./Users.md) - User management
- [Admin.Reports](./Reports.md) - Moderation reports
- [Admin.Logs](./Logs.md) - System logs

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [Instance Management Guide](../../../docs/guides/instance-management.md)
- [Monitoring Best Practices](../../../docs/guides/monitoring.md)
- [API Documentation](../../../API_DOCUMENTATION.md)

---

## 💡 Tips & Best Practices

### Refresh Strategy

**Choose appropriate refresh intervals:**

- **Real-time critical**: 10-30 seconds (expensive)
- **Important metrics**: 1-5 minutes (balanced)
- **Historical data**: 15-30 minutes (efficient)

### Performance Monitoring

**Monitor stats fetch performance:**

```typescript
const adminHandlers = {
	onFetchStats: async () => {
		const startTime = performance.now();

		const res = await fetch('/api/admin/stats');
		const data = await res.json();

		const duration = performance.now() - startTime;
		console.log(`Stats fetch took ${duration}ms`);

		if (duration > 1000) {
			console.warn('Stats fetch is slow, consider caching');
		}

		return data;
	},
};
```

### Error Recovery

**Implement graceful error handling:**

```typescript
const adminHandlers = {
	onFetchStats: async () => {
		try {
			const res = await fetch('/api/admin/stats', {
				timeout: 5000, // 5 second timeout
			});
			return res.json();
		} catch (error) {
			// Fall back to cached data if available
			const cached = localStorage.getItem('admin_stats_cache');
			if (cached) {
				console.warn('Using cached stats due to fetch error');
				return JSON.parse(cached);
			}
			throw error;
		}
	},
};
```

### Data Caching

**Cache stats to reduce load:**

```typescript
let statsCache: { data: AdminStats; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds

const adminHandlers = {
	onFetchStats: async () => {
		const now = Date.now();

		// Return cached data if fresh
		if (statsCache && now - statsCache.timestamp < CACHE_TTL) {
			return statsCache.data;
		}

		// Fetch fresh data
		const res = await fetch('/api/admin/stats');
		const data = await res.json();

		// Update cache
		statsCache = { data, timestamp: now };

		return data;
	},
};
```

---

## 🐛 Troubleshooting

### Issue: Stats not loading

**Solution**: Check authentication and endpoint:

```typescript
const adminHandlers = {
	onFetchStats: async () => {
		const token = localStorage.getItem('authToken');

		if (!token) {
			console.error('No auth token found');
			throw new Error('Authentication required');
		}

		const res = await fetch('/api/admin/stats', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			console.error('Stats fetch failed:', res.status, res.statusText);
			throw new Error(`HTTP ${res.status}`);
		}

		return res.json();
	},
};
```

### Issue: Numbers not formatting correctly

**Solution**: Verify data types:

```typescript
// Ensure numbers are actually numbers, not strings
const stats = {
	totalUsers: Number(data.totalUsers),
	activeUsers: Number(data.activeUsers),
	totalPosts: Number(data.totalPosts),
	// ...
};
```

### Issue: Warning styles not applying

**Solution**: Check CSS specificity:

```css
/* Ensure warning styles have proper specificity */
.admin-overview__card.admin-overview__card--warning {
	border-color: #f59e0b;
	background: rgba(245, 158, 11, 0.05);
}
```

### Issue: Auto-refresh causing performance issues

**Solution**: Implement smarter refresh logic:

```svelte
<script lang="ts">
	let isVisible = $state(true);

	// Only refresh when tab is visible
	$effect(() => {
		function handleVisibilityChange() {
			isVisible = !document.hidden;
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	// Refresh logic only runs when visible
	$effect(() => {
		if (!isVisible) return;

		const interval = setInterval(() => {
			adminHandlers.onFetchStats();
		}, 30000);

		return () => clearInterval(interval);
	});
</script>
```

---

**Need help with other admin components? See the [Admin Components Overview](./README.md).**
