# Lists.Settings

**Component**: List Privacy and Settings Configuration  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 45 passing tests

---

## 📋 Overview

`Lists.Settings` provides a dedicated interface for configuring list privacy, visibility, and metadata. It displays list information and allows users to change settings with visual feedback and validation.

### **Key Features**:
- ✅ Privacy/visibility toggle (public/private)
- ✅ List metadata display (created date, updated date, member count)
- ✅ Visual radio button selection
- ✅ Save changes with confirmation
- ✅ Success/error messages
- ✅ Auto-save with debouncing (optional)
- ✅ Change detection (only shows save button when changes exist)
- ✅ Loading states during save
- ✅ Responsive layout
- ✅ Keyboard navigation support
- ✅ Accessibility features

### **What It Does**:

`Lists.Settings` manages list configuration:

1. **Display Current Settings**: Shows current visibility and metadata
2. **Change Visibility**: Toggle between public and private
3. **Save Changes**: Submit updates to the server
4. **Show Feedback**: Display success/error messages
5. **Prevent Unnecessary Saves**: Only enable save button when changes exist
6. **Auto-close Success**: Optionally dismiss success message after delay
7. **Validate Changes**: Ensure valid visibility values

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
    onUpdate: async (id, data) => {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Settings />
</Lists.Root>
```

### **With Layout**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  const handlers = {
    // ... handlers
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-layout">
    <aside class="sidebar">
      <Lists.Manager />
    </aside>
    
    <main class="content">
      <Lists.Timeline />
    </main>
    
    <aside class="settings-panel">
      <Lists.Settings class="custom-settings" />
      <Lists.MemberPicker />
    </aside>
  </div>
</Lists.Root>

<style>
  .lists-layout {
    display: grid;
    grid-template-columns: 300px 1fr 350px;
    gap: 1rem;
    height: 100vh;
  }
  
  .settings-panel {
    overflow-y: auto;
    padding: 1rem;
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class for container |

**Note**: The component automatically accesses the currently selected list from context. You must select a list in `Lists.Manager` before the Settings will be functional.

---

## 📤 Events

The component uses handlers provided to `Lists.Root`:

### **Handler Callbacks**:

```typescript
// Update list settings
handlers.onUpdate?: (id: string, data: Partial<ListFormData>) => Promise<ListData>;
```

### **Context State Used**:

```typescript
const {
  state: {
    selectedList,    // Currently selected list
    loading,         // Loading state during save
    error,          // Error message if save fails
  },
  updateList,       // Method to update list
} = Lists.getListsContext();
```

---

## 💡 Examples

### **Example 1: Basic Settings with Toast Notifications**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { toast } from '$lib/toast';
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onUpdate: async (id: string, data) => {
      try {
        const response = await fetch(`/api/lists/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update list');
        }
        
        const updatedList = await response.json();
        
        // Show success notification
        toast.success('List settings saved!');
        
        return updatedList;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to save settings');
        throw error;
      }
    },
  };
</script>

<Lists.Root {handlers}>
  <div class="settings-container">
    <h2>Configure List</h2>
    <Lists.Settings />
  </div>
</Lists.Root>

<style>
  .settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .settings-container h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 800;
  }
</style>
```

### **Example 2: With Advanced Permission Controls**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  
  let userPermissions = $state({
    canMakePublic: true,
    canInviteMembers: true,
    maxPublicLists: 10,
  });
  
  let publicListCount = $state(0);
  
  // Check if user can make list public
  const canChangeToPublic = $derived(() => {
    if (!userPermissions.canMakePublic) return false;
    // Check if adding another public list would exceed limit
    return publicListCount < userPermissions.maxPublicLists;
  });
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      const lists: ListData[] = await response.json();
      
      // Count public lists
      publicListCount = lists.filter(l => l.visibility === 'public').length;
      
      return lists;
    },
    
    onUpdate: async (id: string, data) => {
      // Validate permission before sending
      if (data.visibility === 'public') {
        if (!canChangeToPublic()) {
          throw new Error(`You can only have ${userPermissions.maxPublicLists} public lists`);
        }
      }
      
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        
        // Handle specific permission errors
        if (error.code === 'PUBLIC_LIST_LIMIT_REACHED') {
          throw new Error(`You have reached the maximum of ${userPermissions.maxPublicLists} public lists`);
        } else if (error.code === 'PERMISSION_DENIED') {
          throw new Error('You do not have permission to create public lists');
        }
        
        throw new Error(error.message || 'Failed to update list');
      }
      
      return await response.json();
    },
  };
  
  let context: ReturnType<typeof Lists.getListsContext>;
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="advanced-settings">
      <Lists.Manager />
      
      <div class="settings-panel">
        <h3>List Settings</h3>
        
        {#if context.state.selectedList}
          <!-- Permission Notice -->
          {#if !userPermissions.canMakePublic}
            <div class="permission-notice notice--warning">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <div>
                <strong>Limited Access</strong>
                <p>Your account cannot create public lists. Upgrade to enable this feature.</p>
              </div>
            </div>
          {:else if publicListCount >= userPermissions.maxPublicLists && context.state.selectedList.visibility === 'private'}
            <div class="permission-notice notice--info">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <div>
                <strong>Public List Limit Reached</strong>
                <p>You have {publicListCount} of {userPermissions.maxPublicLists} public lists. To make this list public, please make another list private first.</p>
              </div>
            </div>
          {/if}
        {/if}
        
        <Lists.Settings />
      </div>
    </div>
  {/snippet}
</Lists.Root>

<style>
  .advanced-settings {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .settings-panel {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .settings-panel h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .permission-notice {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .permission-notice svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .permission-notice strong {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .permission-notice p {
    margin: 0;
    font-size: 0.875rem;
  }
  
  .notice--warning {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    color: #f59e0b;
  }
  
  .notice--info {
    background: rgba(29, 155, 240, 0.1);
    border: 1px solid rgba(29, 155, 240, 0.3);
    color: #1d9bf0;
  }
</style>
```

### **Example 3: With Auto-save**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { debounce } from '$lib/utils';
  
  let autoSaveEnabled = $state(true);
  let lastSaved = $state<Date | null>(null);
  let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  let context: ReturnType<typeof Lists.getListsContext>;
  
  // Debounced auto-save function
  const autoSave = debounce(async (listId: string, visibility: 'public' | 'private') => {
    if (!autoSaveEnabled) return;
    
    saveStatus = 'saving';
    
    try {
      await context.updateList(listId, { visibility });
      lastSaved = new Date();
      saveStatus = 'saved';
      
      // Reset status after 3 seconds
      setTimeout(() => {
        saveStatus = 'idle';
      }, 3000);
    } catch (error) {
      saveStatus = 'error';
      console.error('Auto-save failed:', error);
    }
  }, 2000); // Wait 2 seconds after last change
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onUpdate: async (id: string, data) => {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
  };
  
  // Watch for changes to trigger auto-save
  let previousVisibility: 'public' | 'private' | null = null;
  
  $effect(() => {
    if (!context || !context.state.selectedList) return;
    
    const currentVisibility = context.state.selectedList.visibility;
    
    // Check if visibility changed
    if (previousVisibility !== null && previousVisibility !== currentVisibility) {
      autoSave(context.state.selectedList.id, currentVisibility);
    }
    
    previousVisibility = currentVisibility;
  });
  
  function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  }
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="autosave-settings">
      <Lists.Manager />
      
      <div class="settings-with-autosave">
        <div class="settings-header">
          <h3>List Settings</h3>
          
          <!-- Auto-save toggle -->
          <label class="autosave-toggle">
            <input
              type="checkbox"
              bind:checked={autoSaveEnabled}
            />
            <span>Auto-save</span>
          </label>
        </div>
        
        <!-- Save status indicator -->
        <div class="save-status">
          {#if saveStatus === 'saving'}
            <span class="status status--saving">
              <span class="spinner"></span>
              Saving...
            </span>
          {:else if saveStatus === 'saved'}
            <span class="status status--saved">
              ✓ Saved {lastSaved ? `at ${formatTime(lastSaved)}` : ''}
            </span>
          {:else if saveStatus === 'error'}
            <span class="status status--error">
              ✗ Save failed
            </span>
          {/if}
        </div>
        
        <Lists.Settings />
      </div>
    </div>
  {/snippet}
</Lists.Root>

<style>
  .autosave-settings {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .settings-with-autosave {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .settings-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .autosave-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .autosave-toggle input {
    cursor: pointer;
  }
  
  .save-status {
    margin-bottom: 1rem;
    min-height: 1.5rem;
  }
  
  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .status--saving {
    color: var(--text-secondary, #536471);
  }
  
  .status--saved {
    color: #00ba7c;
  }
  
  .status--error {
    color: #f4211e;
  }
  
  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--border-color, #e1e8ed);
    border-top-color: var(--primary-color, #1d9bf0);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

### **Example 4: With Change History**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListData } from '@greater/fediverse/Lists';
  
  interface ChangeRecord {
    timestamp: Date;
    field: string;
    oldValue: any;
    newValue: any;
    success: boolean;
  }
  
  let changeHistory = $state<ChangeRecord[]>([]);
  let showHistory = $state(false);
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onUpdate: async (id: string, data) => {
      // Record what changed
      const context = Lists.getListsContext();
      const oldList = context.state.selectedList;
      
      try {
        const response = await fetch(`/api/lists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Update failed');
        }
        
        const updatedList = await response.json();
        
        // Record successful change
        if (data.visibility && oldList) {
          changeHistory = [
            {
              timestamp: new Date(),
              field: 'visibility',
              oldValue: oldList.visibility,
              newValue: data.visibility,
              success: true,
            },
            ...changeHistory,
          ].slice(0, 10); // Keep last 10 changes
        }
        
        return updatedList;
      } catch (error) {
        // Record failed change
        if (data.visibility && oldList) {
          changeHistory = [
            {
              timestamp: new Date(),
              field: 'visibility',
              oldValue: oldList.visibility,
              newValue: data.visibility,
              success: false,
            },
            ...changeHistory,
          ].slice(0, 10);
        }
        
        throw error;
      }
    },
  };
  
  function formatChangeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  }
</script>

<Lists.Root {handlers}>
  <div class="history-settings">
    <Lists.Manager />
    
    <div class="settings-with-history">
      <div class="settings-header">
        <h3>List Settings</h3>
        <button
          class="history-toggle"
          onclick={() => { showHistory = !showHistory; }}
        >
          📜 {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>
      
      {#if showHistory && changeHistory.length > 0}
        <div class="change-history">
          <h4>Recent Changes</h4>
          <div class="history-list">
            {#each changeHistory as change (change.timestamp.getTime())}
              <div class="history-item" class:failed={!change.success}>
                <div class="history-icon">
                  {change.success ? '✓' : '✗'}
                </div>
                <div class="history-content">
                  <div class="history-change">
                    Changed <strong>{change.field}</strong> from
                    <span class="value">{change.oldValue}</span> to
                    <span class="value">{change.newValue}</span>
                  </div>
                  <div class="history-time">
                    {formatChangeTime(change.timestamp)}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <Lists.Settings />
    </div>
  </div>
</Lists.Root>

<style>
  .history-settings {
    display: grid;
    grid-template-columns: 1fr 450px;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .settings-with-history {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .settings-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .history-toggle {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary, #f7f9fa);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .history-toggle:hover {
    background: var(--bg-hover, #eff3f4);
  }
  
  .change-history {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary, #f7f9fa);
    border-radius: 0.75rem;
  }
  
  .change-history h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .history-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
  }
  
  .history-item.failed {
    border-color: rgba(244, 33, 46, 0.3);
    background: rgba(244, 33, 46, 0.05);
  }
  
  .history-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  
  .history-item:not(.failed) .history-icon {
    background: rgba(0, 186, 124, 0.1);
    color: #00ba7c;
  }
  
  .history-item.failed .history-icon {
    background: rgba(244, 33, 46, 0.1);
    color: #f4211e;
  }
  
  .history-content {
    flex: 1;
    min-width: 0;
  }
  
  .history-change {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .history-change .value {
    padding: 0.125rem 0.375rem;
    background: var(--bg-secondary, #f7f9fa);
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.8125rem;
  }
  
  .history-time {
    font-size: 0.75rem;
    color: var(--text-secondary, #536471);
  }
</style>
```

### **Example 5: With Danger Zone (Advanced Settings)**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  let showDangerZone = $state(false);
  let confirmDelete = $state('');
  let deleting = $state(false);
  
  async function handleDeleteList(listId: string) {
    if (confirmDelete !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    
    deleting = true;
    
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete list');
      }
      
      // Refresh lists
      const context = Lists.getListsContext();
      await context.fetchLists();
      
      confirmDelete = '';
      showDangerZone = false;
    } catch (error) {
      alert('Failed to delete list');
      console.error(error);
    } finally {
      deleting = false;
    }
  }
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onUpdate: async (id: string, data) => {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    
    onDelete: async (id: string) => {
      await fetch(`/api/lists/${id}`, { method: 'DELETE' });
    },
  };
  
  let context: ReturnType<typeof Lists.getListsContext>;
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="danger-settings">
      <Lists.Manager />
      
      <div class="settings-with-danger">
        <h3>List Settings</h3>
        
        <Lists.Settings />
        
        <!-- Danger Zone -->
        {#if context.state.selectedList}
          <div class="danger-zone">
            <button
              class="danger-zone-toggle"
              onclick={() => { showDangerZone = !showDangerZone; }}
            >
              ⚠️ {showDangerZone ? 'Hide' : 'Show'} Danger Zone
            </button>
            
            {#if showDangerZone}
              <div class="danger-content">
                <h4>⚠️ Danger Zone</h4>
                <p class="danger-warning">
                  <strong>Warning:</strong> Actions in this section are irreversible.
                </p>
                
                <div class="danger-action">
                  <div class="danger-action-info">
                    <h5>Delete This List</h5>
                    <p>
                      Permanently delete this list and remove all members. This action cannot be undone.
                    </p>
                  </div>
                  
                  <div class="danger-action-control">
                    <input
                      type="text"
                      class="confirm-input"
                      bind:value={confirmDelete}
                      placeholder='Type "DELETE" to confirm'
                      disabled={deleting}
                    />
                    <button
                      class="delete-button"
                      onclick={() => handleDeleteList(context.state.selectedList!.id)}
                      disabled={deleting || confirmDelete !== 'DELETE'}
                    >
                      {deleting ? 'Deleting...' : 'Delete List'}
                    </button>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/snippet}
</Lists.Root>

<style>
  .danger-settings {
    display: grid;
    grid-template-columns: 1fr 450px;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .settings-with-danger {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .settings-with-danger h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .danger-zone {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color, #e1e8ed);
  }
  
  .danger-zone-toggle {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 2px solid #f4211e;
    border-radius: 0.5rem;
    color: #f4211e;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .danger-zone-toggle:hover {
    background: rgba(244, 33, 46, 0.1);
  }
  
  .danger-content {
    margin-top: 1rem;
    padding: 1.5rem;
    background: rgba(244, 33, 46, 0.05);
    border: 2px solid rgba(244, 33, 46, 0.2);
    border-radius: 0.75rem;
  }
  
  .danger-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #f4211e;
  }
  
  .danger-warning {
    margin: 0 0 1.5rem 0;
    padding: 0.75rem;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
  
  .danger-warning strong {
    color: #f59e0b;
  }
  
  .danger-action {
    padding: 1rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid rgba(244, 33, 46, 0.2);
    border-radius: 0.5rem;
  }
  
  .danger-action-info h5 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .danger-action-info p {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .danger-action-control {
    display: flex;
    gap: 0.75rem;
  }
  
  .confirm-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: 'Monaco', 'Courier New', monospace;
  }
  
  .confirm-input:focus {
    outline: none;
    border-color: #f4211e;
  }
  
  .delete-button {
    padding: 0.75rem 1.5rem;
    background: #f4211e;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .delete-button:hover:not(:disabled) {
    background: #d41d1a;
  }
  
  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

---

## 🎨 Styling

`Lists.Settings` uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #1d9bf0;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
  
  /* Success/Error */
  --success-color: #00ba7c;
  --error-color: #f4211e;
}
```

### **Custom Styling**

```svelte
<Lists.Settings class="custom-settings" />

<style>
  :global(.custom-settings) {
    background: linear-gradient(to bottom, #fef3c7, #ffffff);
  }
  
  :global(.custom-settings .list-settings__option) {
    border-width: 2px;
  }
  
  :global(.custom-settings .list-settings__option:has(input:checked)) {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.05);
  }
</style>
```

---

## 🔒 Security Considerations

### **Validate Permissions**

```typescript
// Server-side validation
app.put('/api/lists/:id', async (req, res) => {
  const list = await List.findById(req.params.id);
  
  // Check ownership
  if (list.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  // Validate visibility change
  if (req.body.visibility === 'public' && !req.user.canCreatePublicLists) {
    return res.status(403).json({
      code: 'PERMISSION_DENIED',
      error: 'You do not have permission to create public lists',
    });
  }
  
  await list.update(req.body);
  res.json(list);
});
```

---

## ♿ Accessibility

`Lists.Settings` is fully accessible:

### **Keyboard Navigation**

- **Tab**: Navigate between radio buttons and save button
- **Arrow Keys**: Navigate between radio options
- **Space**: Select radio button
- **Enter**: Submit changes

### **Screen Reader Support**

All elements have proper ARIA labels:

```html
<div role="radiogroup" aria-labelledby="visibility-label">
  <label>
    <input type="radio" name="visibility" value="public" aria-label="Make list public" />
    <span>Public</span>
  </label>
  <label>
    <input type="radio" name="visibility" value="private" aria-label="Make list private" />
    <span>Private</span>
  </label>
</div>
```

---

## ⚡ Performance

The component is lightweight and only re-renders when the selected list changes or settings are updated.

---

## 🧪 Testing

### **Component Tests**

```typescript
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import * as Lists from '@greater/fediverse/Lists';

describe('Lists.Settings', () => {
  test('updates visibility', async () => {
    const onUpdate = vi.fn().mockResolvedValue({
      id: '1',
      title: 'Test List',
      visibility: 'public',
      membersCount: 0,
    });
    
    const { getByLabelText, getByText } = render(Lists.Root, {
      handlers: { onUpdate },
    });
    
    // Select public visibility
    await fireEvent.click(getByLabelText('Public'));
    
    // Click save
    await fireEvent.click(getByText('Save Changes'));
    
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('1', {
        visibility: 'public',
      });
    });
  });
});
```

---

## 🔗 Related Components

- [Lists.Root](/docs/components/Lists/Root.md) - Context provider
- [Lists.Manager](/docs/components/Lists/Manager.md) - List overview
- [Lists.Editor](/docs/components/Lists/Editor.md) - Create/edit lists

---

## 📚 See Also

- [Lists Component Overview](/docs/components/Lists/README.md)
- [Privacy Best Practices](/docs/guides/privacy.md)
- [Settings UI Patterns](/docs/guides/settings-ui.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

