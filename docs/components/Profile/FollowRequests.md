# Profile.FollowRequests

**Component**: Follow Request Management  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 26 passing tests

---

## 📋 Overview

`Profile.FollowRequests` provides comprehensive management of incoming follow requests for private accounts. It enables users to review, approve, or reject follow requests with batch actions and filtering capabilities.

### **Key Features**:
- ✅ Display pending follow requests
- ✅ Individual approve/reject actions
- ✅ Batch approval/rejection
- ✅ Search and filtering
- ✅ Request metadata display
- ✅ Optimistic UI updates
- ✅ Error handling and retry
- ✅ Empty state handling

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';

  const requests = [
    {
      id: '1',
      account: {
        id: '123',
        username: 'bob',
        displayName: 'Bob Smith',
        avatar: 'https://cdn.example.com/avatars/bob.jpg',
        followersCount: 234
      },
      createdAt: '2024-01-15T10:00:00Z'
    }
  ];

  const handlers = {
    onApproveFollowRequest: async (requestId: string) => {
      console.log('Approving:', requestId);
    },
    onRejectFollowRequest: async (requestId: string) => {
      console.log('Rejecting:', requestId);
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.FollowRequests 
    {requests}
    showBatchActions={true}
    enableFiltering={true}
  />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `requests` | `FollowRequest[]` | `[]` | No | Pending follow requests |
| `showBatchActions` | `boolean` | `true` | No | Show batch action buttons |
| `enableFiltering` | `boolean` | `true` | No | Enable search/filter |
| `class` | `string` | `''` | No | Custom CSS class |

### **FollowRequest Interface**

```typescript
interface FollowRequest {
  id: string;
  account: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
  };
  createdAt: string;
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onApproveFollowRequest?: (requestId: string) => Promise<void>;
  onRejectFollowRequest?: (requestId: string) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Complete Follow Requests Manager**

Full-featured follow request management:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FollowRequest } from '@greater/fediverse/Profile';

  let requests = $state<FollowRequest[]>([
    {
      id: '1',
      account: {
        id: '101',
        username: 'bob',
        displayName: 'Bob Smith',
        avatar: 'https://cdn.example.com/avatars/bob.jpg',
        bio: 'Developer and photographer',
        followersCount: 234,
        followingCount: 456
      },
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      account: {
        id: '102',
        username: 'charlie',
        displayName: 'Charlie Brown',
        avatar: 'https://cdn.example.com/avatars/charlie.jpg',
        bio: 'Artist and musician',
        followersCount: 567,
        followingCount: 234
      },
      createdAt: '2024-01-15T11:30:00Z'
    },
    {
      id: '3',
      account: {
        id: '103',
        username: 'diana',
        displayName: 'Diana Prince',
        avatar: 'https://cdn.example.com/avatars/diana.jpg',
        bio: 'Writer and traveler',
        followersCount: 890,
        followingCount: 345
      },
      createdAt: '2024-01-15T14:00:00Z'
    }
  ]);

  let processing = $state(false);
  let stats = $state({
    approved: 0,
    rejected: 0
  });

  const handlers = {
    onApproveFollowRequest: async (requestId: string) => {
      processing = true;

      try {
        const response = await fetch(`/api/follow-requests/${requestId}/approve`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to approve request');
        }

        // Remove from list
        requests = requests.filter(r => r.id !== requestId);
        stats.approved++;

        showNotification('Follow request approved', 'success');
      } catch (error) {
        console.error('Approval failed:', error);
        showNotification('Failed to approve request', 'error');
      } finally {
        processing = false;
      }
    },

    onRejectFollowRequest: async (requestId: string) => {
      processing = true;

      try {
        const response = await fetch(`/api/follow-requests/${requestId}/reject`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to reject request');
        }

        // Remove from list
        requests = requests.filter(r => r.id !== requestId);
        stats.rejected++;

        showNotification('Follow request rejected', 'info');
      } catch (error) {
        console.error('Rejection failed:', error);
        showNotification('Failed to reject request', 'error');
      } finally {
        processing = false;
      }
    }
  };

  function showNotification(message: string, type: string) {
    // Implement your notification system
    console.log(`[${type}] ${message}`);
  }

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<div class="follow-requests-page">
  <header class="page-header">
    <h1>Follow Requests</h1>
    <div class="stats">
      <span class="stat">
        <strong>{requests.length}</strong> pending
      </span>
      <span class="stat">
        <strong>{stats.approved}</strong> approved
      </span>
      <span class="stat">
        <strong>{stats.rejected}</strong> rejected
      </span>
    </div>
  </header>

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.FollowRequests 
      {requests}
      showBatchActions={true}
      enableFiltering={true}
    />
  </Profile.Root>
</div>

<style>
  .follow-requests-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0 0 1rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    font-size: 0.875rem;
    color: #536471;
  }

  .stat strong {
    font-size: 1.25rem;
    color: #0f1419;
    margin-right: 0.25rem;
  }
</style>
```

### **Example 2: With Account Previews**

Show detailed account information in requests:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FollowRequest } from '@greater/fediverse/Profile';

  const requests: FollowRequest[] = [
    {
      id: '1',
      account: {
        id: '101',
        username: 'bob',
        displayName: 'Bob Smith',
        avatar: 'https://cdn.example.com/avatars/bob.jpg',
        bio: 'Full-stack developer passionate about open source. Building cool things with JavaScript and Rust. Coffee enthusiast ☕',
        followersCount: 1234,
        followingCount: 456
      },
      createdAt: '2024-01-15T10:00:00Z'
    }
  ];

  let expandedRequests = $state<Set<string>>(new Set());

  function toggleExpanded(requestId: string) {
    if (expandedRequests.has(requestId)) {
      expandedRequests.delete(requestId);
    } else {
      expandedRequests.add(requestId);
    }
    expandedRequests = new Set(expandedRequests);
  }

  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  async function handleApprove(requestId: string) {
    try {
      await fetch(`/api/follow-requests/${requestId}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      // Handle success
    } catch (error) {
      console.error('Approval failed:', error);
    }
  }

  async function handleReject(requestId: string) {
    try {
      await fetch(`/api/follow-requests/${requestId}/reject`, {
        method: 'POST',
        credentials: 'include'
      });
      // Handle success
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  }
</script>

<div class="requests-with-previews">
  <h2>Follow Requests with Previews</h2>

  <div class="requests-list">
    {#each requests as request}
      {@const isExpanded = expandedRequests.has(request.id)}
      
      <div class="request-card" class:expanded={isExpanded}>
        <div class="request-header">
          <img
            src={request.account.avatar}
            alt={`${request.account.displayName}'s avatar`}
            class="avatar"
          />

          <div class="account-info">
            <div class="account-name">
              <strong>{request.account.displayName}</strong>
              <span class="username">@{request.account.username}</span>
            </div>
            <div class="request-meta">
              <span class="time">{formatRelativeTime(request.createdAt)}</span>
              {#if request.account.followersCount !== undefined}
                <span class="followers">
                  {request.account.followersCount} followers
                </span>
              {/if}
            </div>
          </div>

          <button
            class="expand-button"
            onclick={() => toggleExpanded(request.id)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class:rotated={isExpanded}
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
        </div>

        {#if isExpanded && request.account.bio}
          <div class="account-bio">
            <p>{request.account.bio}</p>
          </div>
        {/if}

        <div class="request-actions">
          <button
            class="reject-button"
            onclick={() => handleReject(request.id)}
          >
            Reject
          </button>
          <button
            class="approve-button"
            onclick={() => handleApprove(request.id)}
          >
            Approve
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .requests-with-previews {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .requests-with-previews h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .request-card {
    padding: 1rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .request-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .request-card.expanded {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  .request-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .account-info {
    flex: 1;
    min-width: 0;
  }

  .account-name {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .account-name strong {
    font-size: 1rem;
    color: #0f1419;
    font-weight: 600;
  }

  .username {
    font-size: 0.875rem;
    color: #536471;
  }

  .request-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8125rem;
    color: #536471;
  }

  .expand-button {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    color: #536471;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .expand-button:hover {
    background: #f7f9fa;
  }

  .expand-button svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s;
  }

  .expand-button svg.rotated {
    transform: rotate(180deg);
  }

  .account-bio {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f7f9fa;
    border-radius: 0.5rem;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .account-bio p {
    margin: 0;
    color: #0f1419;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .request-actions {
    display: flex;
    gap: 0.75rem;
  }

  .reject-button,
  .approve-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .reject-button {
    background: #f7f9fa;
    color: #0f1419;
  }

  .reject-button:hover {
    background: #eff3f4;
  }

  .approve-button {
    background: #1d9bf0;
    color: white;
  }

  .approve-button:hover {
    background: #1a8cd8;
  }
</style>
```

### **Example 3: With Batch Actions**

Implement batch approval/rejection:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FollowRequest } from '@greater/fediverse/Profile';

  let requests = $state<FollowRequest[]>([
    {
      id: '1',
      account: {
        id: '101',
        username: 'bob',
        displayName: 'Bob Smith',
        avatar: 'https://cdn.example.com/avatars/bob.jpg',
        followersCount: 234
      },
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      account: {
        id: '102',
        username: 'charlie',
        displayName: 'Charlie Brown',
        avatar: 'https://cdn.example.com/avatars/charlie.jpg',
        followersCount: 567
      },
      createdAt: '2024-01-15T11:30:00Z'
    },
    {
      id: '3',
      account: {
        id: '103',
        username: 'diana',
        displayName: 'Diana Prince',
        avatar: 'https://cdn.example.com/avatars/diana.jpg',
        followersCount: 890
      },
      createdAt: '2024-01-15T14:00:00Z'
    }
  ]);

  let selectedIds = $state<Set<string>>(new Set());
  let processing = $state(false);

  const allSelected = $derived(
    requests.length > 0 && selectedIds.size === requests.length
  );

  const hasSelection = $derived(selectedIds.size > 0);

  function toggleSelectAll() {
    if (allSelected) {
      selectedIds.clear();
    } else {
      requests.forEach(r => selectedIds.add(r.id));
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

  async function handleApproveSelected() {
    if (!hasSelection || processing) return;

    const confirmed = confirm(
      `Approve ${selectedIds.size} follow request${selectedIds.size !== 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;

    processing = true;

    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`/api/follow-requests/${id}/approve`, {
          method: 'POST',
          credentials: 'include'
        })
      );

      const results = await Promise.allSettled(promises);

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.length - succeeded;

      // Remove successful requests
      requests = requests.filter(r => !selectedIds.has(r.id));
      selectedIds.clear();

      if (failed === 0) {
        alert(`Successfully approved ${succeeded} request${succeeded !== 1 ? 's' : ''}`);
      } else {
        alert(`Approved ${succeeded}, failed ${failed}`);
      }
    } catch (error) {
      console.error('Batch approval failed:', error);
      alert('Failed to approve requests');
    } finally {
      processing = false;
    }
  }

  async function handleRejectSelected() {
    if (!hasSelection || processing) return;

    const confirmed = confirm(
      `Reject ${selectedIds.size} follow request${selectedIds.size !== 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;

    processing = true;

    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`/api/follow-requests/${id}/reject`, {
          method: 'POST',
          credentials: 'include'
        })
      );

      const results = await Promise.allSettled(promises);

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.length - succeeded;

      // Remove successful requests
      requests = requests.filter(r => !selectedIds.has(r.id));
      selectedIds.clear();

      if (failed === 0) {
        alert(`Successfully rejected ${succeeded} request${succeeded !== 1 ? 's' : ''}`);
      } else {
        alert(`Rejected ${succeeded}, failed ${failed}`);
      }
    } catch (error) {
      console.error('Batch rejection failed:', error);
      alert('Failed to reject requests');
    } finally {
      processing = false;
    }
  }
</script>

<div class="batch-actions-requests">
  <h2>Follow Requests</h2>

  {#if requests.length > 0}
    <div class="batch-controls">
      <label class="select-all">
        <input
          type="checkbox"
          checked={allSelected}
          onchange={toggleSelectAll}
        />
        <span>Select all ({requests.length})</span>
      </label>

      {#if hasSelection}
        <div class="batch-actions">
          <span class="selection-count">
            {selectedIds.size} selected
          </span>
          <button
            class="batch-reject"
            onclick={handleRejectSelected}
            disabled={processing}
          >
            {#if processing}
              <span class="spinner"></span>
            {/if}
            Reject Selected
          </button>
          <button
            class="batch-approve"
            onclick={handleApproveSelected}
            disabled={processing}
          >
            {#if processing}
              <span class="spinner"></span>
            {/if}
            Approve Selected
          </button>
        </div>
      {/if}
    </div>

    <div class="requests-list">
      {#each requests as request}
        <div class="request-item" class:selected={selectedIds.has(request.id)}>
          <label class="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectedIds.has(request.id)}
              onchange={() => toggleSelect(request.id)}
            />
          </label>

          <img
            src={request.account.avatar}
            alt={request.account.displayName}
            class="avatar"
          />

          <div class="account-details">
            <strong>{request.account.displayName}</strong>
            <span class="username">@{request.account.username}</span>
            {#if request.account.followersCount}
              <span class="followers">
                {request.account.followersCount} followers
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>No pending follow requests</p>
    </div>
  {/if}
</div>

<style>
  .batch-actions-requests {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .batch-actions-requests h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .batch-controls {
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

  .select-all input[type="checkbox"] {
    cursor: pointer;
  }

  .batch-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .selection-count {
    font-size: 0.875rem;
    color: #536471;
    font-weight: 500;
  }

  .batch-reject,
  .batch-approve {
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .batch-reject {
    background: white;
    color: #f44336;
    border: 1px solid #f44336;
  }

  .batch-reject:hover:not(:disabled) {
    background: #fee;
  }

  .batch-approve {
    background: #1d9bf0;
    color: white;
  }

  .batch-approve:hover:not(:disabled) {
    background: #1a8cd8;
  }

  .batch-reject:disabled,
  .batch-approve:disabled {
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
    to { transform: rotate(360deg); }
  }

  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .request-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border: 2px solid #eff3f4;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .request-item:hover {
    background: #f7f9fa;
  }

  .request-item.selected {
    background: rgba(29, 155, 240, 0.05);
    border-color: #1d9bf0;
  }

  .checkbox-wrapper input[type="checkbox"] {
    cursor: pointer;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .account-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .account-details strong {
    font-size: 0.9375rem;
    color: #0f1419;
  }

  .username {
    font-size: 0.8125rem;
    color: #536471;
  }

  .followers {
    font-size: 0.8125rem;
    color: #536471;
  }

  .empty-state {
    padding: 3rem;
    text-align: center;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .empty-state p {
    margin: 0;
    color: #536471;
  }
</style>
```

### **Example 4: Server-Side Request Handlers**

Complete server implementation:

```typescript
// server/api/follow-requests/[id]/approve.ts
import { db } from '@/lib/database';
import { sendActivityPubActivity } from '@/lib/activitypub';

export async function POST(request: Request, context: { params: { id: string } }): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const requestId = context.params.id;

  try {
    // Get the follow request
    const followRequest = await db.followRequests.findUnique({
      where: { id: requestId },
      include: { 
        follower: true,
        following: true
      }
    });

    if (!followRequest) {
      return new Response('Follow request not found', { status: 404 });
    }

    // Verify user owns the account being followed
    if (followRequest.followingId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }

    // Check if already following
    const existingFollow = await db.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followRequest.followerId,
          followingId: userId
        }
      }
    });

    if (existingFollow) {
      // Already following, just delete the request
      await db.followRequests.delete({
        where: { id: requestId }
      });

      return new Response(
        JSON.stringify({ message: 'Already following' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the follow relationship
    await db.follows.create({
      data: {
        followerId: followRequest.followerId,
        followingId: userId,
        createdAt: new Date()
      }
    });

    // Delete the follow request
    await db.followRequests.delete({
      where: { id: requestId }
    });

    // Update follower counts
    await db.users.update({
      where: { id: userId },
      data: { followersCount: { increment: 1 } }
    });

    await db.users.update({
      where: { id: followRequest.followerId },
      data: { followingCount: { increment: 1 } }
    });

    // Send ActivityPub Accept activity
    const acceptActivity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Accept',
      actor: `https://example.com/users/${followRequest.following.username}`,
      object: {
        type: 'Follow',
        id: followRequest.activityId,
        actor: followRequest.follower.actorUrl,
        object: `https://example.com/users/${followRequest.following.username}`
      }
    };

    await sendActivityPubActivity(
      followRequest.follower.inbox,
      acceptActivity,
      followRequest.following
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'follow_request.approved',
        details: JSON.stringify({
          requestId,
          follower: followRequest.follower.username
        }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Follow request approved' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to approve follow request:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/follow-requests/[id]/reject.ts
export async function POST(request: Request, context: { params: { id: string } }): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const requestId = context.params.id;

  try {
    // Get the follow request
    const followRequest = await db.followRequests.findUnique({
      where: { id: requestId },
      include: {
        follower: true,
        following: true
      }
    });

    if (!followRequest) {
      return new Response('Follow request not found', { status: 404 });
    }

    // Verify user owns the account
    if (followRequest.followingId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }

    // Delete the follow request
    await db.followRequests.delete({
      where: { id: requestId }
    });

    // Send ActivityPub Reject activity
    const rejectActivity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Reject',
      actor: `https://example.com/users/${followRequest.following.username}`,
      object: {
        type: 'Follow',
        id: followRequest.activityId,
        actor: followRequest.follower.actorUrl,
        object: `https://example.com/users/${followRequest.following.username}`
      }
    };

    await sendActivityPubActivity(
      followRequest.follower.inbox,
      rejectActivity,
      followRequest.following
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'follow_request.rejected',
        details: JSON.stringify({
          requestId,
          follower: followRequest.follower.username
        }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Follow request rejected' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to reject follow request:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### **Example 5: With Real-Time Updates**

Implement real-time request notifications:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FollowRequest } from '@greater/fediverse/Profile';
  import { onMount } from 'svelte';

  let requests = $state<FollowRequest[]>([]);
  let ws: WebSocket | null = null;

  onMount(() => {
    // Fetch initial requests
    fetchRequests();

    // Connect to WebSocket for real-time updates
    connectWebSocket();

    return () => {
      ws?.close();
    };
  });

  async function fetchRequests() {
    try {
      const response = await fetch('/api/follow-requests', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        requests = data.requests;
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  }

  function connectWebSocket() {
    ws = new WebSocket('wss://example.com/ws');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'follow_request') {
        // New follow request received
        requests = [message.request, ...requests];
        
        // Show browser notification
        showNotification('New follow request', message.request.account.displayName);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
  }

  function showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  const handlers = {
    onApproveFollowRequest: async (requestId: string) => {
      // Handle approval and remove from list
      await fetch(`/api/follow-requests/${requestId}/approve`, {
        method: 'POST',
        credentials: 'include'
      });

      requests = requests.filter(r => r.id !== requestId);
    },

    onRejectFollowRequest: async (requestId: string) => {
      // Handle rejection and remove from list
      await fetch(`/api/follow-requests/${requestId}/reject`, {
        method: 'POST',
        credentials: 'include'
      });

      requests = requests.filter(r => r.id !== requestId);
    }
  };
</script>

<div class="realtime-requests">
  <h2>Follow Requests (Real-time)</h2>

  <Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
    <Profile.FollowRequests 
      {requests}
      showBatchActions={true}
      enableFiltering={true}
    />
  </Profile.Root>
</div>

<style>
  .realtime-requests {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .realtime-requests h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
</style>
```

---

## 🔒 Security Considerations

### **Authorization**

Always verify request ownership:

```typescript
if (followRequest.followingId !== userId) {
  return new Response('Forbidden', { status: 403 });
}
```

### **Rate Limiting**

Prevent abuse:

```typescript
const requestLimit = new RateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'),
  analytics: true
});
```

### **Audit Logging**

Track all actions:

```typescript
await db.auditLogs.create({
  data: {
    userId,
    action: 'follow_request.approved',
    details: JSON.stringify({ requestId }),
    timestamp: new Date()
  }
});
```

---

## 🎨 Styling

```css
.follow-requests {
  --request-bg: white;
  --request-border: #eff3f4;
  --request-hover: #f7f9fa;
  --selected-bg: rgba(29, 155, 240, 0.05);
  --selected-border: #1d9bf0;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper list structure
- ✅ **ARIA Labels**: Clear action buttons
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Status announcements

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { FollowRequests } from '@greater/fediverse/Profile';

describe('FollowRequests', () => {
  it('displays follow requests', () => {
    const requests = [
      {
        id: '1',
        account: {
          id: '101',
          username: 'bob',
          displayName: 'Bob',
          avatar: 'avatar.jpg'
        },
        createdAt: '2024-01-15'
      }
    ];

    render(FollowRequests, { props: { requests } });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('@bob')).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.FollowersList](./FollowersList.md)
- [Profile.FollowingList](./FollowingList.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [ActivityPub Follow Mechanism](https://www.w3.org/TR/activitypub/#follow-activity-inbox)
- [Mastodon Follow Requests Guide](https://docs.joinmastodon.org/user/moderating/)

