# Profile.Stats

**Component**: Profile Statistics Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 12 passing tests

---

## 📋 Overview

`Profile.Stats` displays profile statistics including follower count, following count, and post count in a clean, formatted layout. The component supports clickable stats for navigation and automatic number formatting for large values.

### **Key Features**:
- ✅ Display follower, following, and post counts
- ✅ Automatic number formatting (1.2K, 1.5M)
- ✅ Clickable stats for navigation
- ✅ Singular/plural text handling
- ✅ Custom event emission
- ✅ Responsive design
- ✅ Accessible with ARIA labels

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

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<Profile.Root {profile} handlers={{}}>
  <Profile.Header />
  <Profile.Stats />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `clickable` | `boolean` | `true` | No | Make stats clickable |
| `showPosts` | `boolean` | `true` | No | Show posts count |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

The component emits a custom `statClick` event when a stat is clicked:

```typescript
interface StatClickEvent {
  type: 'followers' | 'following' | 'posts';
  profile: ProfileData;
}
```

---

## 💡 Examples

### **Example 1: Basic Stats Display**

Display profile statistics with default formatting:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

  const profile: ProfileData = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Software developer specializing in distributed systems',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<div class="profile-container">
  <Profile.Root {profile} handlers={{}}>
    <Profile.Header />
    <Profile.Stats clickable={true} showPosts={true} />
  </Profile.Root>
</div>

<style>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
```

### **Example 2: With Navigation**

Handle stat clicks for navigation:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import { goto } from '$app/navigation';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  function handleStatClick(event: CustomEvent) {
    const { type, profile } = event.detail;

    switch (type) {
      case 'followers':
        goto(`/@${profile.username}/followers`);
        break;
      case 'following':
        goto(`/@${profile.username}/following`);
        break;
      case 'posts':
        goto(`/@${profile.username}`);
        break;
    }
  }
</script>

<div class="stats-with-navigation" onstatClick={handleStatClick}>
  <Profile.Root {profile} handlers={{}}>
    <Profile.Header />
    <Profile.Stats clickable={true} />
  </Profile.Root>
</div>
```

### **Example 3: With Modal Dialogs**

Open modals instead of navigating:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

  const profile: ProfileData = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let showFollowersModal = $state(false);
  let showFollowingModal = $state(false);
  let followers = $state<ProfileData[]>([]);
  let following = $state<ProfileData[]>([]);

  async function handleStatClick(event: CustomEvent) {
    const { type } = event.detail;

    switch (type) {
      case 'followers':
        await loadFollowers();
        showFollowersModal = true;
        break;
      case 'following':
        await loadFollowing();
        showFollowingModal = true;
        break;
      case 'posts':
        // Scroll to posts section
        document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  async function loadFollowers() {
    const response = await fetch(`/api/accounts/${profile.id}/followers`);
    followers = await response.json();
  }

  async function loadFollowing() {
    const response = await fetch(`/api/accounts/${profile.id}/following`);
    following = await response.json();
  }
</script>

<div class="stats-with-modals" onstatClick={handleStatClick}>
  <Profile.Root {profile} handlers={{}}>
    <Profile.Stats clickable={true} />
  </Profile.Root>

  {#if showFollowersModal}
    <div class="modal-overlay" onclick={() => showFollowersModal = false}>
      <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Followers</h2>
          <button onclick={() => showFollowersModal = false}>×</button>
        </div>
        <div class="modal-body">
          <Profile.FollowersList {followers} isOwnProfile={false} />
        </div>
      </div>
    </div>
  {/if}

  {#if showFollowingModal}
    <div class="modal-overlay" onclick={() => showFollowingModal = false}>
      <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Following</h2>
          <button onclick={() => showFollowingModal = false}>×</button>
        </div>
        <div class="modal-body">
          <Profile.FollowingList following={following} />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .stats-with-modals {
    max-width: 600px;
    margin: 0 auto;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eff3f4;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-header button {
    padding: 0;
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: #536471;
    cursor: pointer;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
</style>
```

### **Example 4: With Real-Time Updates**

Update stats in real-time via WebSocket:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

  let profile = $state<ProfileData>({
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  });

  let ws: WebSocket | null = null;
  let updates = $state<{ [key: string]: { old: number; new: number } }>({});

  // Connect to WebSocket
  $effect(() => {
    ws = new WebSocket('wss://api.example.com/stats');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'stat_update' && message.userId === profile.id) {
        const { stat, value } = message;
        const oldValue = profile[`${stat}Count` as keyof ProfileData] as number;

        // Store update for animation
        updates[stat] = { old: oldValue, new: value };

        // Update profile
        profile = {
          ...profile,
          [`${stat}Count`]: value
        };

        // Clear animation after delay
        setTimeout(() => {
          const newUpdates = { ...updates };
          delete newUpdates[stat];
          updates = newUpdates;
        }, 2000);
      }
    };

    return () => {
      ws?.close();
    };
  });
</script>

<div class="stats-realtime">
  <Profile.Root {profile} handlers={{}}>
    <div class="stats-container">
      <Profile.Stats clickable={true} />
      
      {#if Object.keys(updates).length > 0}
        <div class="update-notifications">
          {#each Object.entries(updates) as [stat, { old, new: newValue }]}
            <div class="update-notification" class:increase={newValue > old}>
              {stat}: {old} → {newValue}
              <span class="change-indicator">
                {newValue > old ? '↑' : '↓'}
                {Math.abs(newValue - old)}
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .stats-realtime {
    max-width: 600px;
    margin: 0 auto;
  }

  .stats-container {
    position: relative;
  }

  .update-notifications {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .update-notification {
    padding: 0.75rem 1rem;
    background: #e8f5fe;
    border: 1px solid #1d9bf0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #0f1419;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideIn 0.3s ease-out;
  }

  .update-notification.increase {
    background: #e8f5e9;
    border-color: #4caf50;
  }

  .change-indicator {
    font-weight: 600;
    color: #1d9bf0;
  }

  .update-notification.increase .change-indicator {
    color: #4caf50;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

### **Example 5: With Detailed Tooltips**

Show detailed stat information on hover:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileData } from '@equaltoai/greater-components-fediverse/Profile';

  const profile: ProfileData = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let hoveredStat = $state<string | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });

  const statDetails = {
    followers: {
      title: 'Followers',
      description: 'People who follow your updates',
      growth: '+45 this week'
    },
    following: {
      title: 'Following',
      description: 'Accounts you follow',
      growth: '+12 this week'
    },
    posts: {
      title: 'Posts',
      description: 'Total posts published',
      growth: '+23 this week'
    }
  };

  function handleMouseEnter(event: MouseEvent, stat: string) {
    hoveredStat = stat;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    tooltipPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
  }

  function handleMouseLeave() {
    hoveredStat = null;
  }
</script>

<div class="stats-with-tooltips">
  <Profile.Root {profile} handlers={{}}>
    <div class="stats-wrapper">
      {#each ['posts', 'following', 'followers'] as stat}
        <button
          class="stat-button"
          onmouseenter={(e) => handleMouseEnter(e, stat)}
          onmouseleave={handleMouseLeave}
        >
          <span class="stat-value">
            {profile[`${stat === 'posts' ? 'statuses' : stat}Count` as keyof ProfileData]}
          </span>
          <span class="stat-label">
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </span>
        </button>
      {/each}
    </div>
  </Profile.Root>

  {#if hoveredStat && statDetails[hoveredStat as keyof typeof statDetails]}
    {@const details = statDetails[hoveredStat as keyof typeof statDetails]}
    <div 
      class="tooltip"
      style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
    >
      <div class="tooltip-arrow"></div>
      <div class="tooltip-title">{details.title}</div>
      <div class="tooltip-description">{details.description}</div>
      <div class="tooltip-growth">{details.growth}</div>
    </div>
  {/if}
</div>

<style>
  .stats-with-tooltips {
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  .stats-wrapper {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .stat-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .stat-button:hover {
    opacity: 0.7;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f1419;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #536471;
  }

  .tooltip {
    position: fixed;
    transform: translate(-50%, -100%);
    padding: 0.75rem 1rem;
    background: #15202b;
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    pointer-events: none;
    min-width: 200px;
  }

  .tooltip-arrow {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: #15202b;
  }

  .tooltip-title {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-description {
    font-size: 0.8125rem;
    color: #8899a6;
    margin-bottom: 0.5rem;
  }

  .tooltip-growth {
    font-size: 0.8125rem;
    color: #4caf50;
    font-weight: 500;
  }
</style>
```

---

## 🔒 Security Considerations

### **Rate Limiting for Stat Queries**

When stats are clickable and trigger data loading:

```typescript
// server/api/followers.ts
import { RateLimiter } from '@upstash/ratelimit';

const followerListLimit = new RateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true
});

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Rate limit
  const { success } = await followerListLimit.limit(userId);
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  // Fetch followers...
}
```

---

## 🎨 Styling

```css
.profile-stats {
  --stats-value-color: var(--text-primary, #0f1419);
  --stats-label-color: var(--text-secondary, #536471);
  --stats-hover-opacity: 0.7;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .profile-stats {
    --stats-value-color: #f7f9fa;
    --stats-label-color: #8899a6;
  }
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Uses button elements for clickable stats
- ✅ **Keyboard Navigation**: Fully keyboard accessible
- ✅ **Screen Readers**: Proper labels and ARIA attributes
- ✅ **Focus Indicators**: Clear focus states
- ✅ **Disabled State**: Accessible when not clickable

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

describe('Profile.Stats', () => {
  const mockProfile = {
    id: '1',
    username: 'alice',
    displayName: 'Alice',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  it('displays formatted counts', () => {
    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: {}
      }
    });

    expect(screen.getByText('1.2K')).toBeInTheDocument(); // followers
    expect(screen.getByText('567')).toBeInTheDocument(); // following
    expect(screen.getByText('8.9K')).toBeInTheDocument(); // posts
  });

  it('emits event when stat clicked', async () => {
    const handleStatClick = vi.fn();

    const { container } = render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: {}
      }
    });

    container.addEventListener('statClick', handleStatClick);

    const followersButton = screen.getByText(/followers/i).closest('button');
    await fireEvent.click(followersButton!);

    expect(handleStatClick).toHaveBeenCalled();
  });

  it('formats large numbers correctly', () => {
    const largeProfile = {
      ...mockProfile,
      followersCount: 1500000,
      followingCount: 2300,
      statusesCount: 45000
    };

    render(Profile.Root, {
      props: {
        profile: largeProfile,
        handlers: {}
      }
    });

    expect(screen.getByText('1.5M')).toBeInTheDocument();
    expect(screen.getByText('2.3K')).toBeInTheDocument();
    expect(screen.getByText('45.0K')).toBeInTheDocument();
  });

  it('handles singular vs plural correctly', () => {
    const singleProfile = {
      ...mockProfile,
      followersCount: 1,
      statusesCount: 1
    };

    render(Profile.Root, {
      props: {
        profile: singleProfile,
        handlers: {}
      }
    });

    expect(screen.getByText('Follower')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md) - Context provider
- [Profile.Header](./Header.md) - Profile header
- [Profile.FollowersList](./FollowersList.md) - Followers list
- [Profile.FollowingList](./FollowingList.md) - Following list

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Number Formatting Utilities](../../utils/NUMBER_FORMAT.md)
- [Real-Time Updates Guide](../../patterns/REALTIME.md)

