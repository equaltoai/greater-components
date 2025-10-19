# Lists Components

**Component Group**: Lists Management  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 364 passing tests

---

## 📋 Overview

The Lists component group provides a complete system for creating, managing, and viewing curated lists of actors (users) in your Fediverse application. Users can organize the accounts they follow into custom lists, each with its own timeline, privacy settings, and member management.

### **What are Lists?**

Lists allow users to:
- 📋 **Organize Follows**: Group accounts into topic-based or interest-based lists
- 🔒 **Control Privacy**: Create public or private lists
- 📜 **Custom Timelines**: View chronological posts from list members only
- 👥 **Member Management**: Add/remove accounts with search functionality
- ⚙️ **Settings Control**: Configure list visibility and metadata

Lists are a powerful way to curate content and reduce noise in the main timeline, similar to Twitter Lists or Mastodon Lists.

---

## 🎯 Key Features

### **List Management**
- ✅ Create, Read, Update, Delete (CRUD) operations
- ✅ List title and description (with character limits)
- ✅ Public/private visibility control
- ✅ Member count tracking
- ✅ Real-time updates
- ✅ Search and filtering

### **Member Management**
- ✅ Add accounts to lists via search
- ✅ Remove members with confirmation
- ✅ Display member avatars and names
- ✅ Bulk operations support
- ✅ Member count limits (server-dependent)

### **Timeline Integration**
- ✅ Chronological posts from list members
- ✅ Real-time post updates via WebSocket
- ✅ Infinite scroll support
- ✅ Empty states and loading indicators

### **Privacy & Security**
- ✅ Public lists (visible to all)
- ✅ Private lists (visible only to owner)
- ✅ Permission-based operations
- ✅ Rate limiting support

### **Accessibility**
- ✅ Full keyboard navigation
- ✅ ARIA labels and roles
- ✅ Screen reader support
- ✅ Focus management
- ✅ Semantic HTML

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Quick Start

### **Basic Setup**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    onCreate: async (data) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onUpdate: async (id, data) => {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onDelete: async (id) => {
      await fetch(`/api/lists/${id}`, { method: 'DELETE' });
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
  <Lists.Editor />
  <Lists.Timeline />
</Lists.Root>
```

### **With Real-time Updates**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  import { createWebSocketClient } from '$lib/websocket';
  
  const ws = createWebSocketClient('wss://api.example.com/graphql');
  
  const handlers = {
    // ... standard handlers ...
    
    // Subscribe to list updates
    onFetchLists: async () => {
      const lists = await fetchLists();
      
      // Subscribe to real-time updates
      ws.subscribe({
        query: `
          subscription OnListUpdate {
            listUpdated {
              id
              title
              membersCount
              updatedAt
            }
          }
        `,
        onData: ({ listUpdated }) => {
          // Update list in UI
          updateListInState(listUpdated);
        },
      });
      
      return lists;
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Timeline />
</Lists.Root>
```

---

## 🧩 Components

### **[Lists.Root](/docs/components/Lists/Root.md)**
Context provider for all list components. Manages shared state and handlers.

```svelte
<Lists.Root {handlers}>
  <!-- Child components -->
</Lists.Root>
```

### **[Lists.Manager](/docs/components/Lists/Manager.md)**
List overview and management interface. Displays all lists with creation, editing, and deletion controls.

```svelte
<Lists.Manager showCreate={true} />
```

### **[Lists.Editor](/docs/components/Lists/Editor.md)**
Modal form for creating new lists or editing existing ones. Includes title, description, and visibility fields.

```svelte
<Lists.Editor />
```

### **[Lists.MemberPicker](/docs/components/Lists/MemberPicker.md)**
Interface for managing list membership. Search and add/remove accounts from the selected list.

```svelte
<Lists.MemberPicker />
```

### **[Lists.Settings](/docs/components/Lists/Settings.md)**
Configuration panel for list privacy, visibility, and advanced settings.

```svelte
<Lists.Settings />
```

### **[Lists.Timeline](/docs/components/Lists/Timeline.md)**
Displays the timeline of posts from list members. Shows members list with ability to add/remove.

```svelte
<Lists.Timeline showMembers={true} />
```

---

## 💡 Usage Examples

### **Example 1: Basic List Management**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  
  const handlers = {
    onFetchLists: async () => {
      // Fetch from your API
      return [];
    },
    onCreate: async (data) => {
      // Create list
      return { id: '1', ...data };
    },
  };
</script>

<div class="lists-container">
  <Lists.Root {handlers}>
    <aside class="lists-sidebar">
      <Lists.Manager />
    </aside>
    
    <main class="lists-main">
      <Lists.Timeline />
    </main>
  </Lists.Root>
</div>

<style>
  .lists-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1rem;
    height: 100vh;
  }
  
  .lists-sidebar {
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
  }
  
  .lists-main {
    overflow-y: auto;
  }
</style>
```

### **Example 2: With Member Management**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  
  let showMemberPicker = $state(false);
  
  const handlers = {
    // ... handlers ...
    onListClick: (list) => {
      showMemberPicker = true;
    },
  };
</script>

<Lists.Root {handlers}>
  <div class="layout">
    <Lists.Manager />
    
    {#if showMemberPicker}
      <div class="member-panel">
        <Lists.MemberPicker />
        <Lists.Settings />
      </div>
    {/if}
  </div>
</Lists.Root>
```

### **Example 3: Integration with Adapter**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  import { createListsAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = createListsAdapter({
    endpoint: 'https://api.example.com/graphql',
    authentication: {
      token: 'your-auth-token',
    },
  });
  
  const handlers = {
    onFetchLists: adapter.fetchLists,
    onCreate: adapter.createList,
    onUpdate: adapter.updateList,
    onDelete: adapter.deleteList,
    onFetchMembers: adapter.fetchMembers,
    onAddMember: adapter.addMember,
    onRemoveMember: adapter.removeMember,
    onSearchAccounts: adapter.searchAccounts,
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Editor />
  <Lists.Timeline />
</Lists.Root>
```

### **Example 4: Custom Styling**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
</script>

<Lists.Root {handlers} class="custom-lists">
  <Lists.Manager class="custom-manager" />
  <Lists.Timeline class="custom-timeline" />
</Lists.Root>

<style>
  :global(.custom-lists) {
    --primary-color: #7c3aed;
    --bg-primary: #faf9fb;
    --border-color: #e9d5ff;
  }
  
  :global(.custom-manager) {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  :global(.custom-timeline) {
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
</style>
```

### **Example 5: Error Handling**

```svelte
<script lang="ts">
  import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
  import { toast } from '$lib/toast';
  
  const handlers = {
    onFetchLists: async () => {
      try {
        const response = await fetch('/api/lists');
        if (!response.ok) throw new Error('Failed to fetch lists');
        return await response.json();
      } catch (error) {
        toast.error('Could not load lists. Please try again.');
        throw error;
      }
    },
    onCreate: async (data) => {
      try {
        const response = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create list');
        }
        
        const list = await response.json();
        toast.success(`List "${list.title}" created successfully!`);
        return list;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    onDelete: async (id) => {
      try {
        const response = await fetch(`/api/lists/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete list');
        toast.success('List deleted successfully');
      } catch (error) {
        toast.error('Could not delete list. Please try again.');
        throw error;
      }
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
</Lists.Root>
```

---

## 🔒 Security Considerations

### **Privacy Controls**

```typescript
// Validate list visibility
const validateListAccess = (list, currentUser) => {
  if (list.visibility === 'private' && list.ownerId !== currentUser.id) {
    throw new Error('Access denied to private list');
  }
  return true;
};

// Server-side handler with access control
const handlers = {
  onFetchLists: async () => {
    const lists = await fetchLists();
    // Only return lists user can access
    return lists.filter(list => 
      list.visibility === 'public' || list.ownerId === currentUser.id
    );
  },
};
```

### **Input Validation**

```typescript
// Sanitize list data before submission
import { sanitizeHTML } from '$lib/security';

const handlers = {
  onCreate: async (data) => {
    // Validate title length
    if (data.title.length > 100) {
      throw new Error('List title must be 100 characters or less');
    }
    
    // Validate description length
    if (data.description && data.description.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }
    
    // Sanitize content
    const sanitizedData = {
      title: sanitizeHTML(data.title.trim()),
      description: data.description ? sanitizeHTML(data.description.trim()) : undefined,
      visibility: data.visibility,
    };
    
    return await createList(sanitizedData);
  },
};
```

### **Rate Limiting**

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const listRateLimiter = new RateLimiter({
  maxRequests: 10, // 10 lists
  windowMs: 60000, // per minute
});

const handlers = {
  onCreate: async (data) => {
    // Check rate limit before creating
    if (!await listRateLimiter.checkLimit(currentUser.id)) {
      throw new Error('Too many lists created. Please wait before creating more.');
    }
    
    return await createList(data);
  },
};
```

### **Permission Checks**

```typescript
// Server-side middleware
const checkListPermission = async (listId, userId, action) => {
  const list = await getList(listId);
  
  if (!list) {
    throw new Error('List not found');
  }
  
  // Only owner can edit/delete
  if (['update', 'delete', 'add_member', 'remove_member'].includes(action)) {
    if (list.ownerId !== userId) {
      throw new Error('You do not have permission to modify this list');
    }
  }
  
  // Private lists only visible to owner
  if (action === 'view' && list.visibility === 'private' && list.ownerId !== userId) {
    throw new Error('You do not have permission to view this list');
  }
  
  return true;
};
```

---

## ♿ Accessibility

The Lists components are built with accessibility as a core principle:

### **Keyboard Navigation**

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and select items
- **Escape**: Close modals and cancel operations
- **Arrow Keys**: Navigate through lists and members

### **Screen Reader Support**

All components include:
- Semantic HTML elements
- ARIA labels and roles
- Status announcements for loading/errors
- Descriptive alt text for images
- Live regions for dynamic content

### **Focus Management**

- Visible focus indicators
- Logical tab order
- Focus trapping in modals
- Focus restoration on close

### **Example: Accessible List**

```svelte
<Lists.Root {handlers}>
  <section aria-label="Lists management">
    <Lists.Manager />
  </section>
  
  <aside aria-label="Selected list timeline">
    <Lists.Timeline />
  </aside>
</Lists.Root>
```

---

## ⚡ Performance Optimization

### **Lazy Loading**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let listsLoaded = $state(false);
  
  onMount(() => {
    // Defer list loading until after initial render
    requestIdleCallback(() => {
      listsLoaded = true;
    });
  });
</script>

{#if listsLoaded}
  <Lists.Root {handlers}>
    <Lists.Manager />
  </Lists.Root>
{:else}
  <div>Loading lists...</div>
{/if}
```

### **Pagination**

```svelte
<script lang="ts">
  let currentPage = $state(1);
  const pageSize = 20;
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch(
        `/api/lists?page=${currentPage}&limit=${pageSize}`
      );
      return await response.json();
    },
  };
</script>
```

### **Caching**

```typescript
import { lruCache } from '$lib/cache';

const listCache = lruCache({ max: 100, ttl: 5 * 60 * 1000 }); // 5 minutes

const handlers = {
  onFetchLists: async () => {
    const cached = listCache.get('lists');
    if (cached) return cached;
    
    const lists = await fetchLists();
    listCache.set('lists', lists);
    return lists;
  },
};
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import * as Lists from '@equaltoai/greater-components-fediverse/Lists';

test('creates a list', async () => {
  const onCreate = vi.fn().mockResolvedValue({
    id: '1',
    title: 'Test List',
    visibility: 'public',
    membersCount: 0,
  });
  
  const { getByText, getByLabelText } = render(Lists.Root, {
    handlers: { onCreate },
  });
  
  // Open editor
  await fireEvent.click(getByText('New List'));
  
  // Fill form
  await fireEvent.input(getByLabelText('Title'), {
    target: { value: 'Test List' },
  });
  
  // Submit
  await fireEvent.click(getByText('Create List'));
  
  expect(onCreate).toHaveBeenCalledWith({
    title: 'Test List',
    description: undefined,
    visibility: 'public',
  });
});
```

### **Integration Tests**

```typescript
import { test, expect } from '@playwright/test';

test('list management flow', async ({ page }) => {
  await page.goto('/lists');
  
  // Create list
  await page.click('text=New List');
  await page.fill('[name="title"]', 'My Test List');
  await page.selectOption('[name="visibility"]', 'private');
  await page.click('text=Create List');
  
  // Verify creation
  await expect(page.locator('text=My Test List')).toBeVisible();
  
  // Add member
  await page.click('text=My Test List');
  await page.fill('[placeholder="Search people"]', 'johndoe');
  await page.click('text=@johndoe');
  await page.click('text=Add');
  
  // Verify member added
  await expect(page.locator('text=1 member')).toBeVisible();
});
```

---

## 🔗 Related Components

- **[Timeline](/docs/components/Timeline)** - Display posts from list members
- **[Profile](/docs/components/Profile)** - View member profiles
- **[Search](/docs/components/Search)** - Find accounts to add to lists

---

## 📚 API Reference

### **Context API**

```typescript
// Create context
const context = Lists.createListsContext(handlers);

// Access context (within Lists.Root)
const { state, fetchLists, createList } = Lists.getListsContext();
```

### **Validation**

```typescript
import { validateListForm } from '@equaltoai/greater-components-fediverse/Lists';

const error = validateListForm({
  title: '',
  visibility: 'public',
});
// Returns: "List title is required"
```

---

## 🎨 Theming

Lists components support CSS custom properties for theming:

```css
:root {
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
}
```

---

## 📖 Further Reading

- [Lists API Specification](/docs/api/lists)
- [ActivityPub Collections](https://www.w3.org/TR/activitypub/#collections)
- [Mastodon Lists API](https://docs.joinmastodon.org/methods/lists/)
- [Privacy Best Practices](/docs/privacy)

---

## 💬 Support

For questions, issues, or feature requests:
- GitHub Issues: [github.com/your-org/greater-components/issues](https://github.com/your-org/greater-components/issues)
- Discord: [discord.gg/your-server](https://discord.gg/your-server)
- Documentation: [docs.greater-components.dev](https://docs.greater-components.dev)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

