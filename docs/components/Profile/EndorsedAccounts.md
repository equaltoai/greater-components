# Profile.EndorsedAccounts

**Component**: Endorsed/Featured Accounts Display  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 20 passing tests

---

## 📋 Overview

`Profile.EndorsedAccounts` displays a user's featured or endorsed accounts - a curated list of accounts they want to highlight on their profile. For profile owners, it supports drag-and-drop reordering and removal of endorsements.

### **Key Features**:
- ✅ Display endorsed accounts
- ✅ Drag-and-drop reordering (own profile)
- ✅ Remove endorsements (own profile)
- ✅ Maximum account limits
- ✅ Account metadata display
- ✅ Loading and empty states
- ✅ Responsive design

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

  const endorsed = [
    {
      id: '123',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Developer and photographer',
      followersCount: 234
    }
  ];

  const handlers = {
    onReorderEndorsed: async (accountIds: string[]) => {
      console.log('Reordered:', accountIds);
    },
    onRemoveEndorsement: async (accountId: string) => {
      console.log('Removed:', accountId);
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.EndorsedAccounts 
    {endorsed}
    isOwnProfile={true}
    enableReordering={true}
    maxAccounts={4}
  />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `endorsed` | `EndorsedAccount[]` | `[]` | No | List of endorsed accounts |
| `isOwnProfile` | `boolean` | `false` | No | Whether viewing own profile |
| `enableReordering` | `boolean` | `true` | No | Enable drag-and-drop reordering |
| `maxAccounts` | `number` | `4` | No | Maximum accounts to display (0 = all) |
| `class` | `string` | `''` | No | Custom CSS class |

### **EndorsedAccount Interface**

```typescript
interface EndorsedAccount {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  endorsed At?: string;
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onReorderEndorsed?: (accountIds: string[]) => Promise<void>;
  onRemoveEndorsement?: (accountId: string) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Complete Endorsed Accounts Management**

Full-featured endorsed accounts with reordering:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { EndorsedAccount } from '@greater/fediverse/Profile';

  let endorsed = $state<EndorsedAccount[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Full-stack developer passionate about open source',
      followersCount: 1234,
      followingCount: 456,
      endorsedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      bio: 'Artist and musician creating beautiful things',
      followersCount: 567,
      followingCount: 234,
      endorsedAt: '2024-01-12T14:00:00Z'
    },
    {
      id: '103',
      username: 'diana',
      displayName: 'Diana Prince',
      avatar: 'https://cdn.example.com/avatars/diana.jpg',
      bio: 'Writer and traveler exploring the world',
      followersCount: 890,
      followingCount: 345,
      endorsedAt: '2024-01-15T09:00:00Z'
    }
  ]);

  let removingIds = $state<Set<string>>(new Set());

  const handlers = {
    onReorderEndorsed: async (accountIds: string[]) => {
      try {
        const response = await fetch('/api/profile/endorsed/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountIds }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to reorder');
        }

        showNotification('Order saved', 'success');
      } catch (error) {
        console.error('Failed to reorder:', error);
        showNotification('Failed to save order', 'error');
      }
    },

    onRemoveEndorsement: async (accountId: string) => {
      removingIds.add(accountId);

      try {
        const response = await fetch(`/api/profile/endorsed/${accountId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove endorsement');
        }

        // Remove from list
        endorsed = endorsed.filter(a => a.id !== accountId);
        
        showNotification('Endorsement removed', 'success');
      } catch (error) {
        console.error('Failed to remove endorsement:', error);
        showNotification('Failed to remove endorsement', 'error');
      } finally {
        removingIds.delete(accountId);
        removingIds = new Set(removingIds);
      }
    }
  };

  function showNotification(message: string, type: string) {
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

<div class="endorsed-page">
  <header class="page-header">
    <h1>Featured Accounts</h1>
    <p class="description">
      Highlight accounts you want to showcase on your profile
    </p>
  </header>

  <div class="info-box">
    <div class="info-icon">💡</div>
    <div class="info-content">
      <strong>Pro tip:</strong> Drag and drop to reorder your featured accounts.
      They'll appear in this order on your profile.
    </div>
  </div>

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.EndorsedAccounts 
      {endorsed}
      isOwnProfile={true}
      enableReordering={true}
      maxAccounts={4}
    />
  </Profile.Root>

  {#if endorsed.length < 4}
    <div class="add-more">
      <p>You can feature up to 4 accounts. ({endorsed.length}/4 used)</p>
      <button class="add-button">
        Add Featured Account
      </button>
    </div>
  {/if}
</div>

<style>
  .endorsed-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .description {
    margin: 0;
    color: #536471;
    font-size: 1rem;
  }

  .info-box {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    background: #e8f5fe;
    border: 1px solid #1d9bf0;
    border-radius: 0.75rem;
  }

  .info-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;
    font-size: 0.875rem;
    color: #0d8bd9;
  }

  .info-content strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #0d8bd9;
  }

  .add-more {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    text-align: center;
  }

  .add-more p {
    margin: 0 0 1rem;
    color: #536471;
  }

  .add-button {
    padding: 0.875rem 2rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .add-button:hover {
    background: #1a8cd8;
  }
</style>
```

### **Example 2: Drag-and-Drop Implementation**

Complete drag-and-drop functionality:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { EndorsedAccount } from '@greater/fediverse/Profile';

  let endorsed = $state<EndorsedAccount[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      followersCount: 234
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      followersCount: 567
    },
    {
      id: '103',
      username: 'diana',
      displayName: 'Diana Prince',
      avatar: 'https://cdn.example.com/avatars/diana.jpg',
      followersCount: 890
    }
  ]);

  let draggingIndex = $state<number | null>(null);
  let dragOverIndex = $state<number | null>(null);

  function handleDragStart(index: number) {
    return (event: DragEvent) => {
      draggingIndex = index;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString());
      }
    };
  }

  function handleDragOver(index: number) {
    return (event: DragEvent) => {
      event.preventDefault();
      if (draggingIndex !== null && draggingIndex !== index) {
        dragOverIndex = index;
      }
    };
  }

  function handleDrop(index: number) {
    return async (event: DragEvent) => {
      event.preventDefault();

      if (draggingIndex === null || draggingIndex === index) {
        draggingIndex = null;
        dragOverIndex = null;
        return;
      }

      // Reorder array
      const newEndorsed = [...endorsed];
      const [movedItem] = newEndorsed.splice(draggingIndex, 1);
      newEndorsed.splice(index, 0, movedItem);

      endorsed = newEndorsed;
      draggingIndex = null;
      dragOverIndex = null;

      // Save order to server
      try {
        const accountIds = endorsed.map(a => a.id);
        await fetch('/api/profile/endorsed/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountIds }),
          credentials: 'include'
        });
      } catch (error) {
        console.error('Failed to save order:', error);
      }
    };
  }

  function handleDragEnd() {
    draggingIndex = null;
    dragOverIndex = null;
  }
</script>

<div class="drag-drop-endorsed">
  <h2>Drag to Reorder</h2>

  <div class="endorsed-grid">
    {#each endorsed as account, index}
      <div
        class="account-card"
        class:dragging={draggingIndex === index}
        class:drag-over={dragOverIndex === index}
        draggable={true}
        ondragstart={handleDragStart(index)}
        ondragover={handleDragOver(index)}
        ondrop={handleDrop(index)}
        ondragend={handleDragEnd}
      >
        <div class="drag-handle">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
          </svg>
        </div>

        <img
          src={account.avatar}
          alt={account.displayName}
          class="avatar"
        />

        <div class="account-info">
          <strong>{account.displayName}</strong>
          <span class="username">@{account.username}</span>
          {#if account.followersCount}
            <span class="followers">
              {account.followersCount.toLocaleString()} followers
            </span>
          {/if}
        </div>

        <div class="position-indicator">
          #{index + 1}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .drag-drop-endorsed {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .drag-drop-endorsed h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .endorsed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .account-card {
    position: relative;
    padding: 1.5rem;
    background: white;
    border: 2px solid #eff3f4;
    border-radius: 0.75rem;
    cursor: move;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .account-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #1d9bf0;
  }

  .account-card.dragging {
    opacity: 0.5;
  }

  .account-card.drag-over {
    border-color: #1d9bf0;
    background: rgba(29, 155, 240, 0.05);
  }

  .drag-handle {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 24px;
    height: 24px;
    color: #536471;
    opacity: 0.5;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .account-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .account-info strong {
    font-size: 1rem;
    color: #0f1419;
  }

  .username {
    font-size: 0.875rem;
    color: #536471;
  }

  .followers {
    font-size: 0.8125rem;
    color: #536471;
  }

  .position-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 28px;
    height: 28px;
    background: #1d9bf0;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .endorsed-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### **Example 3: Add Endorsement Flow**

Implement adding new endorsements:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { EndorsedAccount } from '@greater/fediverse/Profile';

  let endorsed = $state<EndorsedAccount[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      followersCount: 234
    }
  ]);

  let showAddDialog = $state(false);
  let searchQuery = $state('');
  let searchResults = $state<EndorsedAccount[]>([]);
  let searching = $state(false);

  const maxAccounts = 4;
  const canAddMore = $derived(endorsed.length < maxAccounts);

  async function searchAccounts() {
    if (!searchQuery.trim()) {
      searchResults = [];
      return;
    }

    searching = true;

    try {
      const response = await fetch(
        `/api/search/accounts?q=${encodeURIComponent(searchQuery)}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out already endorsed accounts
        searchResults = data.accounts.filter(
          (account: EndorsedAccount) => !endorsed.some(e => e.id === account.id)
        );
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      searching = false;
    }
  }

  async function addEndorsement(account: EndorsedAccount) {
    try {
      const response = await fetch('/api/profile/endorsed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.id }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to add endorsement');
      }

      endorsed = [...endorsed, { ...account, endorsedAt: new Date().toISOString() }];
      showAddDialog = false;
      searchQuery = '';
      searchResults = [];
    } catch (error) {
      console.error('Failed to add endorsement:', error);
      alert('Failed to add endorsement');
    }
  }

  $effect(() => {
    const timeoutId = setTimeout(searchAccounts, 300);
    return () => clearTimeout(timeoutId);
  });
</script>

<div class="add-endorsement-flow">
  <h2>Featured Accounts</h2>

  <Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
    <Profile.EndorsedAccounts 
      {endorsed}
      isOwnProfile={true}
      enableReordering={true}
      maxAccounts={maxAccounts}
    />
  </Profile.Root>

  {#if canAddMore}
    <button
      class="add-endorsement-button"
      onclick={() => showAddDialog = true}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      Add Featured Account ({endorsed.length}/{maxAccounts})
    </button>
  {:else}
    <div class="max-reached">
      Maximum of {maxAccounts} featured accounts reached
    </div>
  {/if}

  {#if showAddDialog}
    <div class="dialog-overlay" onclick={() => showAddDialog = false}>
      <div class="dialog" onclick={(e) => e.stopPropagation()}>
        <div class="dialog-header">
          <h3>Add Featured Account</h3>
          <button
            class="close-button"
            onclick={() => showAddDialog = false}
          >
            ×
          </button>
        </div>

        <div class="dialog-body">
          <div class="search-box">
            <input
              type="search"
              placeholder="Search for accounts..."
              bind:value={searchQuery}
              class="search-input"
              autofocus
            />
          </div>

          {#if searching}
            <div class="searching">
              <span class="spinner"></span>
              Searching...
            </div>
          {:else if searchResults.length > 0}
            <div class="search-results">
              {#each searchResults as account}
                <button
                  class="result-item"
                  onclick={() => addEndorsement(account)}
                >
                  <img
                    src={account.avatar}
                    alt={account.displayName}
                    class="result-avatar"
                  />
                  <div class="result-info">
                    <strong>{account.displayName}</strong>
                    <span class="result-username">@{account.username}</span>
                  </div>
                  <svg class="add-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              {/each}
            </div>
          {:else if searchQuery.trim()}
            <div class="no-results">
              No accounts found
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .add-endorsement-flow {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .add-endorsement-flow h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .add-endorsement-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background: white;
    border: 2px dashed #eff3f4;
    border-radius: 0.75rem;
    color: #1d9bf0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-endorsement-button:hover {
    border-color: #1d9bf0;
    background: rgba(29, 155, 240, 0.05);
  }

  .add-endorsement-button svg {
    width: 20px;
    height: 20px;
  }

  .max-reached {
    padding: 1rem;
    margin-top: 1rem;
    text-align: center;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .dialog {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #eff3f4;
  }

  .dialog-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .close-button {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #536471;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .close-button:hover {
    background: #f7f9fa;
  }

  .dialog-body {
    padding: 1.5rem;
    overflow-y: auto;
  }

  .search-box {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid #eff3f4;
    border-radius: 9999px;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #1d9bf0;
  }

  .searching,
  .no-results {
    padding: 2rem;
    text-align: center;
    color: #536471;
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #eff3f4;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .search-results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .result-item:hover {
    background: #f7f9fa;
    border-color: #1d9bf0;
  }

  .result-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .result-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .result-info strong {
    font-size: 0.9375rem;
    color: #0f1419;
  }

  .result-username {
    font-size: 0.8125rem;
    color: #536471;
  }

  .add-icon {
    width: 20px;
    height: 20px;
    color: #1d9bf0;
  }
</style>
```

### **Example 4: Server-Side Implementation**

Complete server handlers:

```typescript
// server/api/profile/endorsed.ts
import { db } from '@/lib/database';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response('Username required', { status: 400 });
  }

  try {
    const user = await db.users.findUnique({
      where: { username },
      include: {
        endorsedAccounts: {
          include: {
            endorsedUser: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                bio: true,
                followersCount: true,
                followingCount: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const endorsed = user.endorsedAccounts.map((e, index) => ({
      ...e.endorsedUser,
      endorsedAt: e.createdAt.toISOString(),
      order: index
    }));

    return new Response(
      JSON.stringify({ endorsed }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch endorsed accounts:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { accountId } = body;

  try {
    // Check if account exists
    const account = await db.users.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      return new Response('Account not found', { status: 404 });
    }

    // Check max endorsements (e.g., 4)
    const currentCount = await db.endorsedAccounts.count({
      where: { userId }
    });

    if (currentCount >= 4) {
      return new Response('Maximum endorsements reached', { status: 400 });
    }

    // Check if already endorsed
    const existing = await db.endorsedAccounts.findUnique({
      where: {
        userId_endorsedUserId: {
          userId,
          endorsedUserId: accountId
        }
      }
    });

    if (existing) {
      return new Response('Already endorsed', { status: 400 });
    }

    // Create endorsement
    const endorsement = await db.endorsedAccounts.create({
      data: {
        userId,
        endorsedUserId: accountId,
        order: currentCount,
        createdAt: new Date()
      },
      include: {
        endorsedUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            bio: true,
            followersCount: true
          }
        }
      }
    });

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'account.endorsed',
        details: JSON.stringify({ accountId }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ endorsement }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to endorse account:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/profile/endorsed/[id].ts
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const accountId = context.params.id;

  try {
    // Delete endorsement
    const deleted = await db.endorsedAccounts.deleteMany({
      where: {
        userId,
        endorsedUserId: accountId
      }
    });

    if (deleted.count === 0) {
      return new Response('Endorsement not found', { status: 404 });
    }

    // Reorder remaining endorsements
    const remaining = await db.endorsedAccounts.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });

    await Promise.all(
      remaining.map((e, index) =>
        db.endorsedAccounts.update({
          where: { id: e.id },
          data: { order: index }
        })
      )
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'account.endorsement_removed',
        details: JSON.stringify({ accountId }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Endorsement removed' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to remove endorsement:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/profile/endorsed/reorder.ts
export async function POST(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { accountIds } = body;

  if (!Array.isArray(accountIds)) {
    return new Response('Invalid account IDs', { status: 400 });
  }

  try {
    // Update order for each endorsement
    await Promise.all(
      accountIds.map((accountId, index) =>
        db.endorsedAccounts.updateMany({
          where: {
            userId,
            endorsedUserId: accountId
          },
          data: { order: index }
        })
      )
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'endorsed_accounts.reordered',
        details: JSON.stringify({ order: accountIds }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Order updated' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to reorder endorsements:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### **Example 5: Public View**

Display endorsed accounts on public profile:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { EndorsedAccount } from '@greater/fediverse/Profile';

  const endorsed: EndorsedAccount[] = [
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Developer and photographer',
      followersCount: 1234
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      bio: 'Artist and musician',
      followersCount: 567
    }
  ];

  function navigateToProfile(username: string) {
    window.location.href = `/@${username}`;
  }
</script>

<div class="public-endorsed">
  <h2>Featured Accounts</h2>
  <p class="subtitle">Accounts recommended by this user</p>

  <div class="endorsed-grid">
    {#each endorsed as account}
      <button
        class="account-card"
        onclick={() => navigateToProfile(account.username)}
      >
        <img
          src={account.avatar}
          alt={account.displayName}
          class="avatar"
        />

        <div class="account-content">
          <strong>{account.displayName}</strong>
          <span class="username">@{account.username}</span>
          
          {#if account.bio}
            <p class="bio">{account.bio}</p>
          {/if}

          {#if account.followersCount}
            <span class="followers">
              {account.followersCount.toLocaleString()} followers
            </span>
          {/if}
        </div>

        <div class="view-arrow">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .public-endorsed {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .public-endorsed h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0 0 1.5rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .endorsed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .account-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .account-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #1d9bf0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .account-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .account-content strong {
    font-size: 1rem;
    color: #0f1419;
    font-weight: 600;
  }

  .username {
    font-size: 0.875rem;
    color: #536471;
  }

  .bio {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #0f1419;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .followers {
    margin-top: 0.5rem;
    font-size: 0.8125rem;
    color: #536471;
  }

  .view-arrow {
    width: 24px;
    height: 24px;
    color: #536471;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .endorsed-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

---

## 🔒 Security Considerations

### **Maximum Limits**

Enforce endorsement limits:

```typescript
const MAX_ENDORSEMENTS = 4;

if (currentCount >= MAX_ENDORSEMENTS) {
  return new Response('Maximum endorsements reached', { status: 400 });
}
```

### **Authorization**

Verify ownership:

```typescript
const endorsement = await db.endorsedAccounts.findUnique({
  where: { id: endorsementId }
});

if (endorsement.userId !== userId) {
  return new Response('Forbidden', { status: 403 });
}
```

### **Audit Logging**

Track endorsements:

```typescript
await db.auditLogs.create({
  data: {
    userId,
    action: 'account.endorsed',
    details: JSON.stringify({ accountId }),
    timestamp: new Date()
  }
});
```

---

## 🎨 Styling

```css
.endorsed-accounts {
  --card-bg: white;
  --card-border: #eff3f4;
  --card-hover: rgba(29, 155, 240, 0.05);
  --drag-color: #1d9bf0;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper structure
- ✅ **ARIA Labels**: Drag-and-drop announcements
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Descriptive labels

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { EndorsedAccounts } from '@greater/fediverse/Profile';

describe('EndorsedAccounts', () => {
  it('displays endorsed accounts', () => {
    const endorsed = [
      {
        id: '1',
        username: 'bob',
        displayName: 'Bob',
        avatar: 'avatar.jpg'
      }
    ];

    render(EndorsedAccounts, { props: { endorsed, isOwnProfile: false } });

    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows reorder controls for own profile', () => {
    const endorsed = [
      {
        id: '1',
        username: 'bob',
        displayName: 'Bob',
        avatar: 'avatar.jpg'
      }
    ];

    render(EndorsedAccounts, { 
      props: { endorsed, isOwnProfile: true, enableReordering: true } 
    });

    const cards = screen.getAllByRole('button');
    expect(cards[0]).toHaveAttribute('draggable', 'true');
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.Header](./Header.md)
- [Profile.FeaturedHashtags](./FeaturedHashtags.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Mastodon Featured Profiles](https://docs.joinmastodon.org/user/profile/#featured)
- [Drag and Drop API Guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

