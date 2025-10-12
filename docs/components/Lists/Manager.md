# Lists.Manager

**Component**: List Overview & Management  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 92 passing tests

---

## 📋 Overview

`Lists.Manager` is the main interface for displaying and managing all user lists. It provides a comprehensive view of all lists with grid layout, showing list cards with metadata, actions, and visual indicators for selected lists.

### **Key Features**:
- ✅ Grid display of all lists
- ✅ List cards with metadata (title, description, visibility, member count)
- ✅ Create new list button
- ✅ Edit and delete actions per list
- ✅ Visual selection indicator
- ✅ Empty state for no lists
- ✅ Loading spinner
- ✅ Error messages with retry
- ✅ Delete confirmation modal
- ✅ Responsive grid layout
- ✅ Keyboard navigation
- ✅ Accessibility support

### **What It Does**:

`Lists.Manager` serves as the primary control center for list management:

1. **Display Lists**: Shows all user lists in a responsive grid layout
2. **Create Lists**: Provides button to open the list editor for new lists
3. **Edit Lists**: Per-list edit button opens editor with list data pre-filled
4. **Delete Lists**: Per-list delete button with confirmation modal
5. **Select Lists**: Clicking a list card selects it and loads members
6. **Visual Feedback**: Loading states, error messages, empty states
7. **Metadata Display**: Shows visibility, member count, descriptions

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    onDelete: async (id) => {
      await fetch(`/api/lists/${id}`, { method: 'DELETE' });
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Editor />
</Lists.Root>
```

### **With All Options**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
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
    onListClick: (list) => {
      console.log('Selected list:', list.title);
      // Navigate to list detail, show timeline, etc.
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager showCreate={true} class="custom-manager" />
  <Lists.Editor />
</Lists.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showCreate` | `boolean` | `true` | No | Show "New List" create button |
| `class` | `string` | `''` | No | Custom CSS class for container |

---

## 📤 Events

The component interacts with the Lists context and uses handlers provided to `Lists.Root`:

### **Handler Callbacks**:

```typescript
// Called when a list is clicked (selects the list)
handlers.onListClick?: (list: ListData) => void;

// Called when deleting a list
handlers.onDelete?: (id: string) => Promise<void>;
```

### **Context Methods Used**:

```typescript
// Selects a list and loads its members
selectList(list: ListData) => Promise<void>;

// Opens editor with no list (create mode)
openEditor() => void;

// Opens editor with a list (edit mode)
openEditor(list: ListData) => void;

// Deletes a list
deleteList(id: string) => Promise<void>;
```

---

## 💡 Examples

### **Example 1: Basic List Manager with Custom Styling**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      if (!response.ok) throw new Error('Failed to fetch lists');
      return await response.json();
    },
    onDelete: async (id: string) => {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete list');
    },
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-container">
    <header class="lists-header">
      <h1>My Lists</h1>
      <p>Organize the accounts you follow into custom lists</p>
    </header>
    
    <Lists.Manager class="custom-lists-manager" />
    <Lists.Editor />
  </div>
</Lists.Root>

<style>
  .lists-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .lists-header {
    margin-bottom: 2rem;
  }
  
  .lists-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary, #0f1419);
  }
  
  .lists-header p {
    margin: 0;
    color: var(--text-secondary, #536471);
    font-size: 1rem;
  }
  
  :global(.custom-lists-manager) {
    background: var(--bg-primary, #ffffff);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
```

### **Example 2: With Search and Filtering**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  
  let searchQuery = $state('');
  let visibilityFilter = $state<'all' | 'public' | 'private'>('all');
  let sortBy = $state<'name' | 'members' | 'recent'>('name');
  
  // Get all lists from context
  let allLists: ListData[] = $state([]);
  
  // Filtered and sorted lists
  const filteredLists = $derived(() => {
    let result = allLists;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(list =>
        list.title.toLowerCase().includes(query) ||
        list.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply visibility filter
    if (visibilityFilter !== 'all') {
      result = result.filter(list => list.visibility === visibilityFilter);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'members':
          return b.membersCount - a.membersCount;
        case 'recent':
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  });
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      const lists = await response.json();
      allLists = lists;
      return lists;
    },
    // ... other handlers
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-with-filters">
    <!-- Filters Bar -->
    <div class="filters-bar">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="text"
          class="search-input"
          bind:value={searchQuery}
          placeholder="Search lists..."
        />
      </div>
      
      <!-- Visibility Filter -->
      <select class="filter-select" bind:value={visibilityFilter}>
        <option value="all">All Lists</option>
        <option value="public">Public Only</option>
        <option value="private">Private Only</option>
      </select>
      
      <!-- Sort By -->
      <select class="filter-select" bind:value={sortBy}>
        <option value="name">Sort by Name</option>
        <option value="members">Sort by Members</option>
        <option value="recent">Sort by Recent</option>
      </select>
    </div>
    
    <!-- Results Count -->
    <div class="results-info">
      Showing {filteredLists().length} of {allLists.length} lists
    </div>
    
    <!-- Lists Manager (we'll need to pass filtered lists) -->
    <Lists.Manager />
    <Lists.Editor />
  </div>
</Lists.Root>

<style>
  .lists-with-filters {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .filters-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  
  .search-box {
    position: relative;
    flex: 1;
    min-width: 300px;
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-secondary, #536471);
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 9999px;
    font-size: 0.9375rem;
    background: var(--bg-secondary, #f7f9fa);
    color: var(--text-primary, #0f1419);
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary-color, #1d9bf0);
    background: var(--bg-primary, #ffffff);
  }
  
  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #0f1419);
    cursor: pointer;
  }
  
  .results-info {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
</style>
```

### **Example 3: With Drag and Drop Reordering**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  
  let lists = $state<ListData[]>([]);
  let dragDisabled = $state(false);
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      const data = await response.json();
      lists = data;
      return data;
    },
    // ... other handlers
  };
  
  function handleDndConsider(e: CustomEvent) {
    lists = e.detail.items;
  }
  
  async function handleDndFinalize(e: CustomEvent) {
    lists = e.detail.items;
    
    // Save new order to server
    try {
      await fetch('/api/lists/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: lists.map(list => list.id),
        }),
      });
    } catch (error) {
      console.error('Failed to save list order:', error);
    }
  }
</script>

<Lists.Root {handlers}>
  <div class="lists-with-dnd">
    <div class="header">
      <h2>My Lists</h2>
      <button class="toggle-button" onclick={() => { dragDisabled = !dragDisabled; }}>
        {dragDisabled ? 'Enable' : 'Disable'} Reordering
      </button>
    </div>
    
    <div
      class="lists-grid"
      use:dndzone={{
        items: lists,
        flipDurationMs: 300,
        dragDisabled,
      }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each lists as list (list.id)}
        <div class="list-card" animate:flip={{ duration: 300 }}>
          <div class="drag-handle" class:hidden={dragDisabled}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
          </div>
          
          <h3>{list.title}</h3>
          {#if list.description}
            <p>{list.description}</p>
          {/if}
          <div class="list-meta">
            <span>{list.visibility}</span>
            <span>{list.membersCount} members</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <Lists.Editor />
</Lists.Root>

<style>
  .lists-with-dnd {
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .toggle-button {
    padding: 0.5rem 1rem;
    background: var(--primary-color, #1d9bf0);
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
  
  .lists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .list-card {
    position: relative;
    padding: 1.5rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.75rem;
    transition: transform 0.2s;
  }
  
  .list-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .drag-handle {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: grab;
    color: var(--text-secondary, #536471);
  }
  
  .drag-handle:active {
    cursor: grabbing;
  }
  
  .drag-handle.hidden {
    display: none;
  }
  
  .drag-handle svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .list-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .list-card p {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .list-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
</style>
```

### **Example 4: With Bulk Actions**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  
  let selectedListIds = $state(new Set<string>());
  let allLists: ListData[] = $state([]);
  let bulkActionMode = $state(false);
  
  const allSelected = $derived(
    allLists.length > 0 && selectedListIds.size === allLists.length
  );
  
  function toggleSelectAll() {
    if (allSelected) {
      selectedListIds.clear();
    } else {
      allLists.forEach(list => selectedListIds.add(list.id));
    }
  }
  
  function toggleSelect(listId: string) {
    if (selectedListIds.has(listId)) {
      selectedListIds.delete(listId);
    } else {
      selectedListIds.add(listId);
    }
  }
  
  async function bulkDelete() {
    if (selectedListIds.size === 0) return;
    
    if (!confirm(`Delete ${selectedListIds.size} list(s)?`)) return;
    
    try {
      await Promise.all(
        Array.from(selectedListIds).map(id =>
          fetch(`/api/lists/${id}`, { method: 'DELETE' })
        )
      );
      
      selectedListIds.clear();
      // Refresh lists
      await handlers.onFetchLists?.();
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  }
  
  async function bulkChangeVisibility(visibility: 'public' | 'private') {
    if (selectedListIds.size === 0) return;
    
    try {
      await Promise.all(
        Array.from(selectedListIds).map(id =>
          fetch(`/api/lists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visibility }),
          })
        )
      );
      
      selectedListIds.clear();
      await handlers.onFetchLists?.();
    } catch (error) {
      console.error('Bulk visibility change failed:', error);
    }
  }
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      const lists = await response.json();
      allLists = lists;
      return lists;
    },
    // ... other handlers
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-with-bulk">
    <div class="toolbar">
      <button
        class="bulk-mode-button"
        onclick={() => { bulkActionMode = !bulkActionMode; }}
      >
        {bulkActionMode ? 'Cancel' : 'Select Multiple'}
      </button>
      
      {#if bulkActionMode}
        <div class="bulk-actions">
          <button
            class="bulk-action-button"
            onclick={toggleSelectAll}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          
          {#if selectedListIds.size > 0}
            <span class="selected-count">
              {selectedListIds.size} selected
            </span>
            
            <button
              class="bulk-action-button bulk-action-button--visibility"
              onclick={() => bulkChangeVisibility('public')}
            >
              Make Public
            </button>
            
            <button
              class="bulk-action-button bulk-action-button--visibility"
              onclick={() => bulkChangeVisibility('private')}
            >
              Make Private
            </button>
            
            <button
              class="bulk-action-button bulk-action-button--danger"
              onclick={bulkDelete}
            >
              Delete Selected
            </button>
          {/if}
        </div>
      {/if}
    </div>
    
    <!-- Custom list display with checkboxes -->
    <div class="lists-grid">
      {#each allLists as list (list.id)}
        <div
          class="list-card"
          class:selected={selectedListIds.has(list.id)}
        >
          {#if bulkActionMode}
            <input
              type="checkbox"
              class="list-checkbox"
              checked={selectedListIds.has(list.id)}
              onchange={() => toggleSelect(list.id)}
            />
          {/if}
          
          <h3>{list.title}</h3>
          {#if list.description}
            <p>{list.description}</p>
          {/if}
          <div class="list-meta">
            <span>{list.visibility}</span>
            <span>{list.membersCount} members</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <Lists.Editor />
</Lists.Root>

<style>
  .lists-with-bulk {
    padding: 2rem;
  }
  
  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: var(--bg-secondary, #f7f9fa);
    border-radius: 0.5rem;
  }
  
  .bulk-mode-button {
    padding: 0.5rem 1rem;
    background: var(--primary-color, #1d9bf0);
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
  
  .bulk-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .bulk-action-button {
    padding: 0.5rem 1rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .bulk-action-button:hover {
    background: var(--bg-hover, #eff3f4);
  }
  
  .bulk-action-button--danger {
    background: #f4211e;
    color: white;
    border-color: #f4211e;
  }
  
  .bulk-action-button--danger:hover {
    background: #d41d1a;
  }
  
  .selected-count {
    margin-left: auto;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary, #0f1419);
  }
  
  .lists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .list-card {
    position: relative;
    padding: 1.5rem;
    background: var(--bg-primary, #ffffff);
    border: 2px solid var(--border-color, #e1e8ed);
    border-radius: 0.75rem;
    transition: all 0.2s;
  }
  
  .list-card.selected {
    border-color: var(--primary-color, #1d9bf0);
    background: rgba(29, 155, 240, 0.05);
  }
  
  .list-checkbox {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }
  
  .list-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .list-card p {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .list-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
</style>
```

### **Example 5: With Analytics and Insights**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  
  let lists: ListData[] = $state([]);
  let showInsights = $state(false);
  
  // Calculate insights
  const insights = $derived(() => {
    if (lists.length === 0) return null;
    
    const totalMembers = lists.reduce((sum, list) => sum + list.membersCount, 0);
    const avgMembers = totalMembers / lists.length;
    const publicLists = lists.filter(l => l.visibility === 'public').length;
    const privateLists = lists.filter(l => l.visibility === 'private').length;
    const largestList = lists.reduce((max, list) => 
      list.membersCount > max.membersCount ? list : max
    );
    const emptyLists = lists.filter(l => l.membersCount === 0).length;
    
    return {
      total: lists.length,
      totalMembers,
      avgMembers: avgMembers.toFixed(1),
      publicLists,
      privateLists,
      largestList,
      emptyLists,
    };
  });
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      const data = await response.json();
      lists = data;
      return data;
    },
    // ... other handlers
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-with-insights">
    <div class="header">
      <h2>My Lists</h2>
      <button
        class="insights-button"
        onclick={() => { showInsights = !showInsights; }}
      >
        {showInsights ? 'Hide' : 'Show'} Insights
      </button>
    </div>
    
    {#if showInsights && insights()}
      <div class="insights-panel">
        <h3>📊 List Insights</h3>
        
        <div class="insights-grid">
          <div class="insight-card">
            <div class="insight-value">{insights().total}</div>
            <div class="insight-label">Total Lists</div>
          </div>
          
          <div class="insight-card">
            <div class="insight-value">{insights().totalMembers}</div>
            <div class="insight-label">Total Members</div>
          </div>
          
          <div class="insight-card">
            <div class="insight-value">{insights().avgMembers}</div>
            <div class="insight-label">Avg Members/List</div>
          </div>
          
          <div class="insight-card">
            <div class="insight-value">{insights().publicLists}</div>
            <div class="insight-label">Public Lists</div>
          </div>
          
          <div class="insight-card">
            <div class="insight-value">{insights().privateLists}</div>
            <div class="insight-label">Private Lists</div>
          </div>
          
          <div class="insight-card">
            <div class="insight-value">{insights().emptyLists}</div>
            <div class="insight-label">Empty Lists</div>
          </div>
        </div>
        
        {#if insights().largestList}
          <div class="highlight-card">
            <strong>Largest List:</strong>
            "{insights().largestList.title}" with {insights().largestList.membersCount} members
          </div>
        {/if}
        
        {#if insights().emptyLists > 0}
          <div class="warning-card">
            ⚠️ You have {insights().emptyLists} empty list{insights().emptyLists === 1 ? '' : 's'}.
            Consider adding members or deleting them.
          </div>
        {/if}
      </div>
    {/if}
    
    <Lists.Manager />
    <Lists.Editor />
  </div>
</Lists.Root>

<style>
  .lists-with-insights {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
  }
  
  .insights-button {
    padding: 0.5rem 1rem;
    background: var(--primary-color, #1d9bf0);
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .insights-button:hover {
    background: var(--primary-color-dark, #1a8cd8);
  }
  
  .insights-panel {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    color: white;
  }
  
  .insights-panel h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .insight-card {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 0.5rem;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  
  .insight-value {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }
  
  .insight-label {
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .highlight-card,
  .warning-card {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
  }
  
  .highlight-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }
  
  .warning-card {
    background: rgba(255, 215, 0, 0.2);
    border: 1px solid rgba(255, 215, 0, 0.4);
  }
</style>
```

---

## 🎨 Styling

`Lists.Manager` uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
  
  /* Error colors */
  --error-color: #f4211e;
  --error-bg: rgba(244, 33, 46, 0.1);
  --error-border: rgba(244, 33, 46, 0.3);
}
```

### **Custom Class Styling**

```svelte
<Lists.Manager class="custom-manager" />

<style>
  :global(.custom-manager) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    padding: 2rem;
  }
  
  /* Override card styles */
  :global(.custom-manager .lists-manager__card) {
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  /* Override grid layout */
  :global(.custom-manager .lists-manager__grid) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
</style>
```

---

## 🔒 Security Considerations

### **XSS Prevention**

List data is automatically escaped by Svelte, but be careful with rich text:

```typescript
import { sanitizeHTML } from '$lib/security';

const handlers = {
  onFetchLists: async () => {
    const response = await fetch('/api/lists');
    const lists = await response.json();
    
    // Sanitize descriptions if they contain HTML
    return lists.map(list => ({
      ...list,
      description: list.description ? sanitizeHTML(list.description) : undefined,
    }));
  },
};
```

### **Permission Checks**

Always verify user permissions on the server:

```typescript
// Server-side (Express example)
app.delete('/api/lists/:id', async (req, res) => {
  const list = await List.findById(req.params.id);
  
  if (list.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  await list.delete();
  res.json({ success: true });
});
```

---

## ♿ Accessibility

`Lists.Manager` is fully accessible:

### **Keyboard Navigation**

- **Tab**: Navigate between lists and buttons
- **Enter/Space**: Select list or activate button
- **Escape**: Close delete confirmation modal
- **Arrow Keys**: Navigate grid (with custom implementation)

### **Screen Reader Support**

```html
<!-- Each list card has proper ARIA labels -->
<article
  class="lists-manager__card"
  role="button"
  aria-label="List: Tech News, Private, 15 members"
  tabindex="0"
>
  <!-- Card content -->
</article>

<!-- Error messages are announced -->
<div class="lists-manager__error" role="alert">
  Failed to load lists
</div>

<!-- Loading state is announced -->
<div class="lists-manager__loading" role="status" aria-live="polite">
  <span class="sr-only">Loading lists...</span>
</div>
```

### **Focus Management**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let firstCard: HTMLElement | null = null;
  
  onMount(() => {
    // Focus first list card on mount
    firstCard?.focus();
  });
</script>
```

---

## ⚡ Performance

### **Virtualization for Large Lists**

```svelte
<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import * as Lists from '@greater/fediverse/Lists';
  
  let scrollElement: HTMLElement | null = null;
  let lists: ListData[] = $state([]);
  
  const rowVirtualizer = $derived(() =>
    scrollElement
      ? createVirtualizer({
          count: lists.length,
          getScrollElement: () => scrollElement,
          estimateSize: () => 200, // Estimated card height
          overscan: 5,
        })
      : null
  );
</script>

<div class="virtualized-lists" bind:this={scrollElement}>
  {#if rowVirtualizer()}
    <div style="height: {rowVirtualizer().getTotalSize()}px; position: relative;">
      {#each rowVirtualizer().getVirtualItems() as virtualRow}
        {@const list = lists[virtualRow.index]}
        <div
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            transform: translateY({virtualRow.start}px);
          "
        >
          <!-- List card content -->
        </div>
      {/each}
    </div>
  {/if}
</div>
```

---

## 🧪 Testing

### **Component Tests**

```typescript
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import * as Lists from '@greater/fediverse/Lists';

describe('Lists.Manager', () => {
  test('displays lists', async () => {
    const mockLists = [
      { id: '1', title: 'Test List', visibility: 'public', membersCount: 5 },
    ];
    
    const { getByText } = render(Lists.Root, {
      handlers: {
        onFetchLists: async () => mockLists,
      },
    });
    
    await waitFor(() => {
      expect(getByText('Test List')).toBeInTheDocument();
    });
  });
  
  test('opens editor on create button click', async () => {
    const { getByText } = render(Lists.Root, {
      handlers: {},
      children: () => `
        <Lists.Manager />
        <Lists.Editor />
      `,
    });
    
    await fireEvent.click(getByText('New List'));
    
    await waitFor(() => {
      expect(getByText('Create New List')).toBeInTheDocument();
    });
  });
  
  test('shows delete confirmation', async () => {
    const mockLists = [
      { id: '1', title: 'Test List', visibility: 'public', membersCount: 5 },
    ];
    
    const { getByTitle, getByText } = render(Lists.Root, {
      handlers: {
        onFetchLists: async () => mockLists,
      },
    });
    
    await waitFor(() => {
      const deleteButton = getByTitle('Delete list');
      fireEvent.click(deleteButton);
    });
    
    await waitFor(() => {
      expect(getByText('Delete "Test List"?')).toBeInTheDocument();
    });
  });
});
```

---

## 🔗 Related Components

- [Lists.Root](/docs/components/Lists/Root.md) - Context provider
- [Lists.Editor](/docs/components/Lists/Editor.md) - Create/edit lists
- [Lists.Timeline](/docs/components/Lists/Timeline.md) - View list timeline

---

## 📚 See Also

- [Lists Component Overview](/docs/components/Lists/README.md)
- [Mastodon Lists API](https://docs.joinmastodon.org/methods/lists/)
- [Grid Layout Best Practices](/docs/guides/layouts.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

