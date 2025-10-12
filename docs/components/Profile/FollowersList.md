# Profile.FollowersList

**Component**: Followers List Display  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 24 passing tests

---

## 📋 Overview

`Profile.FollowersList` displays a user's followers with search, pagination, and management capabilities. It provides different functionality depending on whether you're viewing your own profile or another user's profile.

### **Key Features**:
- ✅ Display followers with avatars and bio
- ✅ Search/filter followers
- ✅ Pagination and infinite scroll
- ✅ Remove followers (own profile)
- ✅ Follow/unfollow actions (other profiles)
- ✅ Loading states
- ✅ Empty states
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

  const followers = [
    {
      id: '123',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      followersCount: 234,
      following: false
    }
  ];

  const handlers = {
    onRemoveFollower: async (userId: string) => {
      console.log('Removing follower:', userId);
    },
    onFollow: async (userId: string) => {
      console.log('Following user:', userId);
    },
    onLoadMore: async () => {
      console.log('Loading more followers');
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.FollowersList 
    {followers}
    isOwnProfile={true}
    hasMore={true}
    loading={false}
    enableSearch={true}
  />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `followers` | `Follower[]` | `[]` | No | List of followers |
| `isOwnProfile` | `boolean` | `false` | No | Whether viewing own profile |
| `hasMore` | `boolean` | `false` | No | Whether more followers exist |
| `loading` | `boolean` | `false` | No | Loading state |
| `enableSearch` | `boolean` | `true` | No | Enable search functionality |
| `class` | `string` | `''` | No | Custom CSS class |

### **Follower Interface**

```typescript
interface Follower {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  following?: boolean;  // For other profiles
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onRemoveFollower?: (userId: string) => Promise<void>;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onLoadMore?: () => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Own Profile Followers List**

Manage your own followers with remove capability:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { Follower } from '@greater/fediverse/Profile';

  let followers = $state<Follower[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Developer and photographer',
      followersCount: 234,
      followingCount: 456
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      bio: 'Artist and musician',
      followersCount: 567,
      followingCount: 234
    }
  ]);

  let hasMore = $state(true);
  let loading = $state(false);
  let page = $state(1);

  const handlers = {
    onRemoveFollower: async (userId: string) => {
      const confirmed = confirm('Remove this follower?');
      if (!confirmed) return;

      try {
        const response = await fetch(`/api/followers/${userId}/remove`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove follower');
        }

        // Remove from list
        followers = followers.filter(f => f.id !== userId);
        
        showNotification('Follower removed', 'success');
      } catch (error) {
        console.error('Failed to remove follower:', error);
        showNotification('Failed to remove follower', 'error');
      }
    },

    onLoadMore: async () => {
      if (loading || !hasMore) return;

      loading = true;

      try {
        const response = await fetch(`/api/followers?page=${page + 1}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to load followers');
        }

        const data = await response.json();
        
        followers = [...followers, ...data.followers];
        hasMore = data.hasMore;
        page++;
      } catch (error) {
        console.error('Failed to load more followers:', error);
      } finally {
        loading = false;
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
    followersCount: followers.length,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<div class="followers-page">
  <header class="page-header">
    <h1>Your Followers</h1>
    <p class="followers-count">
      {followers.length} follower{followers.length !== 1 ? 's' : ''}
    </p>
  </header>

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.FollowersList 
      {followers}
      isOwnProfile={true}
      {hasMore}
      {loading}
      enableSearch={true}
    />
  </Profile.Root>
</div>

<style>
  .followers-page {
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

  .followers-count {
    margin: 0;
    font-size: 1rem;
    color: #536471;
  }
</style>
```

### **Example 2: Other User's Followers List**

View another user's followers with follow actions:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { Follower } from '@greater/fediverse/Profile';

  let followers = $state<Follower[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Developer and photographer',
      followersCount: 234,
      followingCount: 456,
      following: false
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      bio: 'Artist and musician',
      followersCount: 567,
      followingCount: 234,
      following: true
    }
  ]);

  let processingIds = $state<Set<string>>(new Set());

  const handlers = {
    onFollow: async (userId: string) => {
      processingIds.add(userId);

      try {
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to follow user');
        }

        // Update following status
        followers = followers.map(f =>
          f.id === userId ? { ...f, following: true } : f
        );
      } catch (error) {
        console.error('Failed to follow user:', error);
        alert('Failed to follow user');
      } finally {
        processingIds.delete(userId);
        processingIds = new Set(processingIds);
      }
    },

    onUnfollow: async (userId: string) => {
      processingIds.add(userId);

      try {
        const response = await fetch(`/api/users/${userId}/unfollow`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to unfollow user');
        }

        // Update following status
        followers = followers.map(f =>
          f.id === userId ? { ...f, following: false } : f
        );
      } catch (error) {
        console.error('Failed to unfollow user:', error);
        alert('Failed to unfollow user');
      } finally {
        processingIds.delete(userId);
        processingIds = new Set(processingIds);
      }
    }
  };

  const profile = {
    id: '456',
    username: 'bob',
    displayName: 'Bob Smith',
    avatar: 'https://cdn.example.com/avatars/bob.jpg',
    followersCount: followers.length,
    followingCount: 234,
    statusesCount: 567
  };
</script>

<div class="other-followers-page">
  <h1>Bob's Followers</h1>

  <Profile.Root {profile} {handlers} isOwnProfile={false}>
    <Profile.FollowersList 
      {followers}
      isOwnProfile={false}
      hasMore={false}
      loading={false}
      enableSearch={true}
    />
  </Profile.Root>
</div>

<style>
  .other-followers-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .other-followers-page h1 {
    margin: 0 0 1.5rem;
    font-size: 2rem;
    font-weight: 700;
  }
</style>
```

### **Example 3: With Search and Filtering**

Advanced search functionality:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { Follower } from '@greater/fediverse/Profile';

  let allFollowers = $state<Follower[]>([
    {
      id: '101',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://cdn.example.com/avatars/bob.jpg',
      bio: 'Developer and photographer',
      followersCount: 234
    },
    {
      id: '102',
      username: 'charlie',
      displayName: 'Charlie Brown',
      avatar: 'https://cdn.example.com/avatars/charlie.jpg',
      bio: 'Artist and musician',
      followersCount: 567
    },
    {
      id: '103',
      username: 'diana',
      displayName: 'Diana Prince',
      avatar: 'https://cdn.example.com/avatars/diana.jpg',
      bio: 'Writer and traveler',
      followersCount: 890
    }
  ]);

  let searchQuery = $state('');
  let sortBy = $state<'name' | 'followers' | 'recent'>('name');

  const filteredFollowers = $derived(() => {
    let result = allFollowers;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.displayName.toLowerCase().includes(query) ||
        f.username.toLowerCase().includes(query) ||
        f.bio?.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.displayName.localeCompare(b.displayName);
        case 'followers':
          return (b.followersCount || 0) - (a.followersCount || 0);
        case 'recent':
          // Would use actual timestamp in real implementation
          return 0;
        default:
          return 0;
      }
    });

    return result;
  });
</script>

<div class="searchable-followers">
  <div class="search-controls">
    <input
      type="search"
      placeholder="Search followers..."
      bind:value={searchQuery}
      class="search-input"
    />

    <select bind:value={sortBy} class="sort-select">
      <option value="name">Sort by name</option>
      <option value="followers">Sort by followers</option>
      <option value="recent">Sort by recent</option>
    </select>
  </div>

  <div class="results-info">
    {#if searchQuery.trim()}
      Showing {filteredFollowers.length} of {allFollowers.length} followers
    {:else}
      {allFollowers.length} followers
    {/if}
  </div>

  <Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
    <Profile.FollowersList 
      followers={filteredFollowers}
      isOwnProfile={true}
      hasMore={false}
      loading={false}
      enableSearch={false}
    />
  </Profile.Root>
</div>

<style>
  .searchable-followers {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .search-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #eff3f4;
    border-radius: 9999px;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #1d9bf0;
  }

  .sort-select {
    padding: 0.75rem 1rem;
    border: 1px solid #eff3f4;
    border-radius: 9999px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
  }

  .results-info {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #536471;
  }
</style>
```

### **Example 4: Server-Side Implementation**

Complete server handlers:

```typescript
// server/api/followers.ts
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
    const followers = await db.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
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
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit + 1
    });

    const hasMore = followers.length > limit;
    const followersData = followers.slice(0, limit).map(f => f.follower);

    return new Response(
      JSON.stringify({
        followers: followersData,
        hasMore,
        total: await db.follows.count({ where: { followingId: userId } })
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch followers:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/followers/[id]/remove.ts
export async function POST(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const followerId = context.params.id;

  try {
    // Check if follow exists
    const follow = await db.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    });

    if (!follow) {
      return new Response('Follow not found', { status: 404 });
    }

    // Remove the follow
    await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    });

    // Update counts
    await db.users.update({
      where: { id: userId },
      data: { followersCount: { decrement: 1 } }
    });

    await db.users.update({
      where: { id: followerId },
      data: { followingCount: { decrement: 1 } }
    });

    // Send ActivityPub Reject activity
    const follower = await db.users.findUnique({ where: { id: followerId } });
    const user = await db.users.findUnique({ where: { id: userId } });

    if (follower && user) {
      const rejectActivity = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Reject',
        actor: `https://example.com/users/${user.username}`,
        object: {
          type: 'Follow',
          actor: follower.actorUrl,
          object: `https://example.com/users/${user.username}`
        }
      };

      await sendActivityPubActivity(follower.inbox, rejectActivity, user);
    }

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'follower.removed',
        details: JSON.stringify({ followerId }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Follower removed' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to remove follower:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### **Example 5: With Infinite Scroll**

Implement infinite scroll pagination:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { Follower } from '@greater/fediverse/Profile';
  import { onMount } from 'svelte';

  let followers = $state<Follower[]>([]);
  let hasMore = $state(true);
  let loading = $state(false);
  let page = $state(1);
  let observer: IntersectionObserver | null = null;
  let loadMoreTrigger: HTMLElement;

  onMount(() => {
    // Load initial followers
    loadFollowers();

    // Set up intersection observer for infinite scroll
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          loadFollowers();
        }
      },
      { rootMargin: '100px' }
    );

    return () => {
      observer?.disconnect();
    };
  });

  $effect(() => {
    if (loadMoreTrigger && observer) {
      observer.observe(loadMoreTrigger);
    }
  });

  async function loadFollowers() {
    if (loading || !hasMore) return;

    loading = true;

    try {
      const response = await fetch(`/api/followers?page=${page}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to load followers');
      }

      const data = await response.json();
      
      followers = [...followers, ...data.followers];
      hasMore = data.hasMore;
      page++;
    } catch (error) {
      console.error('Failed to load followers:', error);
    } finally {
      loading = false;
    }
  }

  const handlers = {
    onRemoveFollower: async (userId: string) => {
      // Handle removal
      followers = followers.filter(f => f.id !== userId);
    }
  };
</script>

<div class="infinite-scroll-followers">
  <h2>Followers</h2>

  <Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
    <Profile.FollowersList 
      {followers}
      isOwnProfile={true}
      hasMore={false}
      loading={false}
      enableSearch={true}
    />
  </Profile.Root>

  {#if hasMore}
    <div bind:this={loadMoreTrigger} class="load-more-trigger">
      {#if loading}
        <div class="loading">
          <span class="spinner"></span>
          Loading more followers...
        </div>
      {:else}
        <button onclick={loadFollowers} class="load-more-button">
          Load More
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .infinite-scroll-followers {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .infinite-scroll-followers h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .load-more-trigger {
    margin-top: 2rem;
    padding: 2rem;
    display: flex;
    justify-content: center;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
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
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .load-more-button {
    padding: 0.875rem 2rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .load-more-button:hover {
    background: #1a8cd8;
  }
</style>
```

---

## 🔒 Security Considerations

### **Privacy Checks**

Respect privacy settings:

```typescript
// Only show followers if user allows it
if (user.hideFollowers && requestUserId !== userId) {
  return new Response('Forbidden', { status: 403 });
}
```

### **Authorization**

Verify permissions for removal:

```typescript
if (follow.followingId !== userId) {
  return new Response('Forbidden', { status: 403 });
}
```

### **Rate Limiting**

Prevent abuse:

```typescript
const followersLimit = new RateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  analytics: true
});
```

---

## 🎨 Styling

```css
.followers-list {
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
import { FollowersList } from '@greater/fediverse/Profile';

describe('FollowersList', () => {
  it('displays followers', () => {
    const followers = [
      {
        id: '1',
        username: 'bob',
        displayName: 'Bob',
        avatar: 'avatar.jpg'
      }
    ];

    render(FollowersList, { props: { followers, isOwnProfile: true } });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('@bob')).toBeInTheDocument();
  });

  it('shows remove button for own profile', () => {
    const followers = [
      {
        id: '1',
        username: 'bob',
        displayName: 'Bob',
        avatar: 'avatar.jpg'
      }
    ];

    render(FollowersList, { props: { followers, isOwnProfile: true } });

    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.FollowingList](./FollowingList.md)
- [Profile.FollowRequests](./FollowRequests.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [ActivityPub Followers Collection](https://www.w3.org/TR/activitypub/#followers)
- [Privacy Best Practices](../../guides/PRIVACY_BEST_PRACTICES.md)

