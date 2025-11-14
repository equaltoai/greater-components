# Profile.FollowingList

**Component**: Following List Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 22 passing tests

---

## 📋 Overview

`Profile.FollowingList` displays the list of accounts a user is following, with search, pagination, and unfollow capabilities. It provides comprehensive management of following relationships.

### **Key Features**:

- ✅ Display following accounts
- ✅ Search and filter
- ✅ Pagination and infinite scroll
- ✅ Unfollow actions
- ✅ Loading and empty states
- ✅ Account metadata display
- ✅ Responsive design

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

	const following = [
		{
			id: '123',
			username: 'bob',
			displayName: 'Bob Smith',
			avatar: 'https://cdn.example.com/avatars/bob.jpg',
			followersCount: 234,
		},
	];

	const handlers = {
		onUnfollow: async (userId: string) => {
			console.log('Unfollowing user:', userId);
		},
		onLoadMore: async () => {
			console.log('Loading more following');
		},
	};
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
	<Profile.FollowingList {following} hasMore={true} loading={false} enableSearch={true} />
</Profile.Root>
```

---

## 🎛️ Props

| Prop           | Type          | Default | Required | Description                 |
| -------------- | ------------- | ------- | -------- | --------------------------- |
| `following`    | `Following[]` | `[]`    | No       | List of following accounts  |
| `hasMore`      | `boolean`     | `false` | No       | Whether more accounts exist |
| `loading`      | `boolean`     | `false` | No       | Loading state               |
| `enableSearch` | `boolean`     | `true`  | No       | Enable search functionality |
| `class`        | `string`      | `''`    | No       | Custom CSS class            |

### **Following Interface**

```typescript
interface Following {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
	bio?: string;
	followersCount?: number;
	followingCount?: number;
	followedAt?: string; // When you started following
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
	onUnfollow?: (userId: string) => Promise<void>;
	onLoadMore?: () => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Complete Following List**

Full-featured following list with unfollow:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { Following } from '@equaltoai/greater-components-fediverse/Profile';

	let following = $state<Following[]>([
		{
			id: '101',
			username: 'bob',
			displayName: 'Bob Smith',
			avatar: 'https://cdn.example.com/avatars/bob.jpg',
			bio: 'Developer and photographer',
			followersCount: 234,
			followingCount: 456,
			followedAt: '2024-01-10T10:00:00Z',
		},
		{
			id: '102',
			username: 'charlie',
			displayName: 'Charlie Brown',
			avatar: 'https://cdn.example.com/avatars/charlie.jpg',
			bio: 'Artist and musician',
			followersCount: 567,
			followingCount: 234,
			followedAt: '2024-01-12T14:00:00Z',
		},
		{
			id: '103',
			username: 'diana',
			displayName: 'Diana Prince',
			avatar: 'https://cdn.example.com/avatars/diana.jpg',
			bio: 'Writer and traveler',
			followersCount: 890,
			followingCount: 345,
			followedAt: '2024-01-15T09:00:00Z',
		},
	]);

	let hasMore = $state(true);
	let loading = $state(false);
	let unfollowingIds = $state<Set<string>>(new Set());

	const handlers = {
		onUnfollow: async (userId: string) => {
			const confirmed = confirm('Unfollow this account?');
			if (!confirmed) return;

			unfollowingIds.add(userId);

			try {
				const response = await fetch(`/api/users/${userId}/unfollow`, {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Failed to unfollow user');
				}

				// Remove from list
				following = following.filter((f) => f.id !== userId);

				showNotification('Successfully unfollowed', 'success');
			} catch (error) {
				console.error('Failed to unfollow:', error);
				showNotification('Failed to unfollow', 'error');
			} finally {
				unfollowingIds.delete(userId);
				unfollowingIds = new Set(unfollowingIds);
			}
		},

		onLoadMore: async () => {
			if (loading || !hasMore) return;

			loading = true;

			try {
				const response = await fetch(`/api/following?offset=${following.length}`, {
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Failed to load more');
				}

				const data = await response.json();

				following = [...following, ...data.following];
				hasMore = data.hasMore;
			} catch (error) {
				console.error('Failed to load more:', error);
			} finally {
				loading = false;
			}
		},
	};

	function showNotification(message: string, type: string) {
		console.log(`[${type}] ${message}`);
	}

	function formatFollowedDate(dateStr: string): string {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(date);
	}

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		avatar: 'https://cdn.example.com/avatars/alice.jpg',
		followersCount: 1234,
		followingCount: following.length,
		statusesCount: 8910,
	};
</script>

<div class="following-page">
	<header class="page-header">
		<h1>Following</h1>
		<p class="following-count">
			{following.length} account{following.length !== 1 ? 's' : ''}
		</p>
	</header>

	<Profile.Root {profile} {handlers} isOwnProfile={true}>
		<Profile.FollowingList {following} {hasMore} {loading} enableSearch={true} />
	</Profile.Root>

	{#if following.length > 0}
		<div class="following-details">
			<h2>Recently Followed</h2>
			<div class="recent-list">
				{#each following.slice(0, 3) as account}
					<div class="recent-item">
						<img src={account.avatar} alt={account.displayName} class="recent-avatar" />
						<div class="recent-info">
							<strong>{account.displayName}</strong>
							<span class="followed-date">
								Followed {formatFollowedDate(account.followedAt)}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.following-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		font-weight: 700;
	}

	.following-count {
		margin: 0;
		font-size: 1rem;
		color: #536471;
	}

	.following-details {
		margin-top: 2rem;
		padding: 1.5rem;
		background: #f7f9fa;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
	}

	.following-details h2 {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.recent-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.recent-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: white;
		border-radius: 0.5rem;
	}

	.recent-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.recent-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.recent-info strong {
		font-size: 0.9375rem;
		color: #0f1419;
	}

	.followed-date {
		font-size: 0.8125rem;
		color: #536471;
	}
</style>
```

### **Example 2: With Categories**

Organize following by categories:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { Following } from '@equaltoai/greater-components-fediverse/Profile';

	interface CategorizedFollowing extends Following {
		category?: string;
	}

	const following: CategorizedFollowing[] = [
		{
			id: '101',
			username: 'bob',
			displayName: 'Bob Smith',
			avatar: 'https://cdn.example.com/avatars/bob.jpg',
			followersCount: 234,
			category: 'Tech',
		},
		{
			id: '102',
			username: 'charlie',
			displayName: 'Charlie Brown',
			avatar: 'https://cdn.example.com/avatars/charlie.jpg',
			followersCount: 567,
			category: 'Art',
		},
		{
			id: '103',
			username: 'diana',
			displayName: 'Diana Prince',
			avatar: 'https://cdn.example.com/avatars/diana.jpg',
			followersCount: 890,
			category: 'Writing',
		},
		{
			id: '104',
			username: 'eve',
			displayName: 'Eve Anderson',
			avatar: 'https://cdn.example.com/avatars/eve.jpg',
			followersCount: 123,
			category: 'Tech',
		},
	];

	let selectedCategory = $state<string>('all');

	const categories = $derived(() => {
		const cats = new Set(following.map((f) => f.category).filter(Boolean));
		return ['all', ...Array.from(cats)];
	});

	const filteredFollowing = $derived(() => {
		if (selectedCategory === 'all') {
			return following;
		}
		return following.filter((f) => f.category === selectedCategory);
	});

	const categoryStats = $derived(() => {
		const stats: Record<string, number> = { all: following.length };
		following.forEach((f) => {
			if (f.category) {
				stats[f.category] = (stats[f.category] || 0) + 1;
			}
		});
		return stats;
	});
</script>

<div class="categorized-following">
	<h2>Following by Category</h2>

	<div class="category-tabs">
		{#each categories as category}
			<button
				class="category-tab"
				class:active={selectedCategory === category}
				onclick={() => (selectedCategory = category)}
			>
				{category.charAt(0).toUpperCase() + category.slice(1)}
				<span class="count">
					{categoryStats[category] || 0}
				</span>
			</button>
		{/each}
	</div>

	<Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
		<Profile.FollowingList
			following={filteredFollowing}
			hasMore={false}
			loading={false}
			enableSearch={true}
		/>
	</Profile.Root>
</div>

<style>
	.categorized-following {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.categorized-following h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.category-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.category-tab {
		padding: 0.625rem 1.25rem;
		background: white;
		border: 1px solid #eff3f4;
		border-radius: 9999px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.category-tab:hover {
		background: #f7f9fa;
	}

	.category-tab.active {
		background: #1d9bf0;
		color: white;
		border-color: #1d9bf0;
	}

	.count {
		padding: 0.125rem 0.5rem;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.category-tab.active .count {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
```

### **Example 3: With Bulk Unfollow**

Implement batch unfollow functionality:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { Following } from '@equaltoai/greater-components-fediverse/Profile';

	let following = $state<Following[]>([
		{
			id: '101',
			username: 'bob',
			displayName: 'Bob Smith',
			avatar: 'https://cdn.example.com/avatars/bob.jpg',
			followersCount: 234,
		},
		{
			id: '102',
			username: 'charlie',
			displayName: 'Charlie Brown',
			avatar: 'https://cdn.example.com/avatars/charlie.jpg',
			followersCount: 567,
		},
		{
			id: '103',
			username: 'diana',
			displayName: 'Diana Prince',
			avatar: 'https://cdn.example.com/avatars/diana.jpg',
			followersCount: 890,
		},
	]);

	let selectedIds = $state<Set<string>>(new Set());
	let processing = $state(false);
	let bulkMode = $state(false);

	const allSelected = $derived(following.length > 0 && selectedIds.size === following.length);

	const hasSelection = $derived(selectedIds.size > 0);

	function toggleBulkMode() {
		bulkMode = !bulkMode;
		if (!bulkMode) {
			selectedIds.clear();
		}
	}

	function toggleSelectAll() {
		if (allSelected) {
			selectedIds.clear();
		} else {
			following.forEach((f) => selectedIds.add(f.id));
		}
		selectedIds = new Set(selectedIds);
	}

	function toggleSelect(id: string) {
		if (selectedIds.has(id)) {
			selectedIds.delete(id);
		} else {
			selectedIds.add(id);
		}
		selectedIds = new Set(selectedIds);
	}

	async function handleBulkUnfollow() {
		if (!hasSelection || processing) return;

		const confirmed = confirm(
			`Unfollow ${selectedIds.size} account${selectedIds.size !== 1 ? 's' : ''}?`
		);

		if (!confirmed) return;

		processing = true;

		try {
			const promises = Array.from(selectedIds).map((id) =>
				fetch(`/api/users/${id}/unfollow`, {
					method: 'POST',
					credentials: 'include',
				})
			);

			const results = await Promise.allSettled(promises);

			const succeeded = results.filter((r) => r.status === 'fulfilled').length;
			const failed = results.length - succeeded;

			// Remove successful unfollows
			following = following.filter((f) => !selectedIds.has(f.id));
			selectedIds.clear();

			if (failed === 0) {
				alert(`Successfully unfollowed ${succeeded} account${succeeded !== 1 ? 's' : ''}`);
			} else {
				alert(`Unfollowed ${succeeded}, failed ${failed}`);
			}
		} catch (error) {
			console.error('Bulk unfollow failed:', error);
			alert('Failed to unfollow accounts');
		} finally {
			processing = false;
		}
	}
</script>

<div class="bulk-unfollow">
	<div class="header">
		<h2>Following</h2>
		<button class="bulk-mode-toggle" onclick={toggleBulkMode}>
			{bulkMode ? 'Done' : 'Select'}
		</button>
	</div>

	{#if bulkMode}
		<div class="bulk-controls">
			<label class="select-all">
				<input type="checkbox" checked={allSelected} onchange={toggleSelectAll} />
				<span>Select all ({following.length})</span>
			</label>

			{#if hasSelection}
				<div class="bulk-actions">
					<span class="selection-count">
						{selectedIds.size} selected
					</span>
					<button class="bulk-unfollow-button" onclick={handleBulkUnfollow} disabled={processing}>
						{#if processing}
							<span class="spinner"></span>
						{/if}
						Unfollow Selected
					</button>
				</div>
			{/if}
		</div>
	{/if}

	{#if bulkMode}
		<div class="following-list">
			{#each following as account}
				<div class="account-item" class:selected={selectedIds.has(account.id)}>
					<label class="checkbox-wrapper">
						<input
							type="checkbox"
							checked={selectedIds.has(account.id)}
							onchange={() => toggleSelect(account.id)}
						/>
					</label>

					<img src={account.avatar} alt={account.displayName} class="avatar" />

					<div class="account-info">
						<strong>{account.displayName}</strong>
						<span class="username">@{account.username}</span>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
			<Profile.FollowingList {following} hasMore={false} loading={false} enableSearch={true} />
		</Profile.Root>
	{/if}
</div>

<style>
	.bulk-unfollow {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.bulk-mode-toggle {
		padding: 0.625rem 1.25rem;
		background: white;
		border: 1px solid #1d9bf0;
		border-radius: 9999px;
		color: #1d9bf0;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.bulk-mode-toggle:hover {
		background: #e8f5fe;
	}

	.bulk-controls {
		padding: 1rem;
		margin-bottom: 1rem;
		background: #f7f9fa;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.select-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 500;
	}

	.bulk-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.selection-count {
		font-size: 0.875rem;
		color: #536471;
		font-weight: 500;
	}

	.bulk-unfollow-button {
		padding: 0.625rem 1.25rem;
		background: #f44336;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background 0.2s;
	}

	.bulk-unfollow-button:hover:not(:disabled) {
		background: #d32f2f;
	}

	.bulk-unfollow-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.following-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.account-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: white;
		border: 2px solid #eff3f4;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.account-item:hover {
		background: #f7f9fa;
	}

	.account-item.selected {
		background: rgba(29, 155, 240, 0.05);
		border-color: #1d9bf0;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.account-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.account-info strong {
		font-size: 0.9375rem;
		color: #0f1419;
	}

	.username {
		font-size: 0.8125rem;
		color: #536471;
	}
</style>
```

### **Example 4: Server-Side Implementation**

Complete server handlers:

```typescript
// server/api/following.ts
import { db } from '@/lib/database';

export async function GET(request: Request): Promise<Response> {
	const userId = await getAuthenticatedUserId(request);
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	try {
		const following = await db.follows.findMany({
			where: { followerId: userId },
			include: {
				following: {
					select: {
						id: true,
						username: true,
						displayName: true,
						avatar: true,
						bio: true,
						followersCount: true,
						followingCount: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip: offset,
			take: limit + 1,
		});

		const hasMore = following.length > limit;
		const followingData = following.slice(0, limit).map((f) => ({
			...f.following,
			followedAt: f.createdAt.toISOString(),
		}));

		return new Response(
			JSON.stringify({
				following: followingData,
				hasMore,
				total: await db.follows.count({ where: { followerId: userId } }),
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Failed to fetch following:', error);
		return new Response('Internal server error', { status: 500 });
	}
}

// server/api/users/[id]/unfollow.ts
import { sendActivityPubActivity } from '@/lib/activitypub';

export async function POST(
	request: Request,
	context: { params: { id: string } }
): Promise<Response> {
	const userId = await getAuthenticatedUserId(request);
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const targetUserId = context.params.id;

	try {
		// Check if following
		const follow = await db.follows.findUnique({
			where: {
				followerId_followingId: {
					followerId: userId,
					followingId: targetUserId,
				},
			},
		});

		if (!follow) {
			return new Response('Not following', { status: 404 });
		}

		// Delete follow
		await db.follows.delete({
			where: {
				followerId_followingId: {
					followerId: userId,
					followingId: targetUserId,
				},
			},
		});

		// Update counts
		await db.users.update({
			where: { id: userId },
			data: { followingCount: { decrement: 1 } },
		});

		await db.users.update({
			where: { id: targetUserId },
			data: { followersCount: { decrement: 1 } },
		});

		// Send ActivityPub Undo Follow activity
		const user = await db.users.findUnique({ where: { id: userId } });
		const targetUser = await db.users.findUnique({ where: { id: targetUserId } });

		if (user && targetUser) {
			const undoActivity = {
				'@context': 'https://www.w3.org/ns/activitystreams',
				type: 'Undo',
				actor: `https://example.com/users/${user.username}`,
				object: {
					type: 'Follow',
					actor: `https://example.com/users/${user.username}`,
					object: targetUser.actorUrl,
				},
			};

			await sendActivityPubActivity(targetUser.inbox, undoActivity, user);
		}

		// Create audit log
		await db.auditLogs.create({
			data: {
				userId,
				action: 'user.unfollowed',
				details: JSON.stringify({ targetUserId }),
				timestamp: new Date(),
			},
		});

		return new Response(JSON.stringify({ message: 'Successfully unfollowed' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Failed to unfollow:', error);
		return new Response('Internal server error', { status: 500 });
	}
}
```

### **Example 5: With Analytics**

Track following patterns:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { Following } from '@equaltoai/greater-components-fediverse/Profile';

	const following: Following[] = [
		{
			id: '101',
			username: 'bob',
			displayName: 'Bob Smith',
			avatar: 'https://cdn.example.com/avatars/bob.jpg',
			followersCount: 234,
			followedAt: '2024-01-10T10:00:00Z',
		},
		{
			id: '102',
			username: 'charlie',
			displayName: 'Charlie Brown',
			avatar: 'https://cdn.example.com/avatars/charlie.jpg',
			followersCount: 567,
			followedAt: '2024-01-12T14:00:00Z',
		},
		{
			id: '103',
			username: 'diana',
			displayName: 'Diana Prince',
			avatar: 'https://cdn.example.com/avatars/diana.jpg',
			followersCount: 890,
			followedAt: '2024-01-15T09:00:00Z',
		},
	];

	const analytics = $derived(() => {
		const now = new Date();
		const thisMonth = following.filter((f) => {
			const followedDate = new Date(f.followedAt);
			return (
				followedDate.getMonth() === now.getMonth() &&
				followedDate.getFullYear() === now.getFullYear()
			);
		}).length;

		const avgFollowers = Math.round(
			following.reduce((sum, f) => sum + (f.followersCount || 0), 0) / following.length
		);

		return {
			total: following.length,
			thisMonth,
			avgFollowers,
		};
	});
</script>

<div class="following-with-analytics">
	<h2>Following Overview</h2>

	<div class="analytics-cards">
		<div class="stat-card">
			<div class="stat-value">{analytics.total}</div>
			<div class="stat-label">Total Following</div>
		</div>

		<div class="stat-card">
			<div class="stat-value">{analytics.thisMonth}</div>
			<div class="stat-label">Followed This Month</div>
		</div>

		<div class="stat-card">
			<div class="stat-value">{analytics.avgFollowers.toLocaleString()}</div>
			<div class="stat-label">Avg Followers</div>
		</div>
	</div>

	<Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
		<Profile.FollowingList {following} hasMore={false} loading={false} enableSearch={true} />
	</Profile.Root>
</div>

<style>
	.following-with-analytics {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.following-with-analytics h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.analytics-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		padding: 1.5rem;
		background: white;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
		text-align: center;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: #1d9bf0;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #536471;
	}
</style>
```

---

## 🔒 Security Considerations

### **Privacy Checks**

Respect privacy settings:

```typescript
if (user.hideFollowing && requestUserId !== userId) {
	return new Response('Forbidden', { status: 403 });
}
```

### **Rate Limiting**

Prevent abuse:

```typescript
const unfollowLimit = new RateLimiter({
	redis,
	limiter: Ratelimit.slidingWindow(50, '1 h'),
	analytics: true,
});
```

### **Audit Logging**

Track unfollows:

```typescript
await db.auditLogs.create({
	data: {
		userId,
		action: 'user.unfollowed',
		details: JSON.stringify({ targetUserId }),
		timestamp: new Date(),
	},
});
```

---

## 🎨 Styling

```css
.following-list {
	--item-bg: white;
	--item-border: #eff3f4;
	--item-hover: #f7f9fa;
	--avatar-size: 48px;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper list structure
- ✅ **ARIA Labels**: Clear action buttons
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Descriptive labels

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { FollowingList } from '@equaltoai/greater-components-fediverse/Profile';

describe('FollowingList', () => {
	it('displays following accounts', () => {
		const following = [
			{
				id: '1',
				username: 'bob',
				displayName: 'Bob',
				avatar: 'avatar.jpg',
			},
		];

		render(FollowingList, { props: { following } });

		expect(screen.getByText('Bob')).toBeInTheDocument();
		expect(screen.getByText('@bob')).toBeInTheDocument();
	});

	it('shows unfollow button', () => {
		const following = [
			{
				id: '1',
				username: 'bob',
				displayName: 'Bob',
				avatar: 'avatar.jpg',
			},
		];

		render(FollowingList, { props: { following } });

		expect(screen.getByRole('button', { name: /unfollow/i })).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.FollowersList](./FollowersList.md)
- [Profile.FollowRequests](./FollowRequests.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [ActivityPub Following Collection](https://www.w3.org/TR/activitypub/#following)
- [Best Practices for Social Connections](../../guides/SOCIAL_CONNECTIONS.md)
