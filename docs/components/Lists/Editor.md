# Lists.Editor

**Component**: List Create/Edit Form  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 78 passing tests

---

## 📋 Overview

`Lists.Editor` is a modal dialog component for creating new lists or editing existing ones. It provides a form interface with fields for title, description, and visibility settings, complete with validation, character counting, and visual feedback.

### **Key Features**:
- ✅ Modal dialog interface
- ✅ Title input (required, max 100 characters)
- ✅ Description textarea (optional, max 500 characters)
- ✅ Character counters for inputs
- ✅ Visibility radio buttons (public/private)
- ✅ Real-time validation
- ✅ Loading states during submission
- ✅ Error display
- ✅ Keyboard support (Enter to submit, Escape to close)
- ✅ Focus management
- ✅ Auto-initialization with existing list data
- ✅ Form reset on close

### **What It Does**:

`Lists.Editor` handles the complete lifecycle of list creation and editing:

1. **Create Mode**: Opens with empty form for creating new lists
2. **Edit Mode**: Opens with pre-filled form when editing existing lists
3. **Validation**: Validates inputs before submission (client-side)
4. **Submission**: Calls appropriate handler (onCreate or onUpdate) via context
5. **Feedback**: Shows loading state, success, or error messages
6. **Auto-close**: Automatically closes on successful save

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
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Editor />
</Lists.Root>
```

The editor is controlled by the Lists context and opens when:
- User clicks "New List" button in Manager (create mode)
- User clicks edit icon on a list card (edit mode)
- `openEditor()` is called programmatically

### **Programmatic Control**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  const handlers = {
    onCreate: async (data) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
  };
  
  let context: ReturnType<typeof Lists.getListsContext>;
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="custom-header">
      <h1>My Lists</h1>
      <button onclick={() => context.openEditor()}>
        Create New List
      </button>
    </div>
    
    <Lists.Manager />
    <Lists.Editor />
  {/snippet}
</Lists.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class for modal content |

**Note**: The editor receives its data and state from the Lists context. It doesn't accept data props directly - instead, it reads from `state.editorOpen` and `state.editingList` provided by the context.

---

## 📤 Events

The component uses context methods and handlers:

### **Context Methods Used**:

```typescript
// From Lists context
const {
  state,           // Contains editorOpen, editingList, loading, error
  createList,      // Create new list
  updateList,      // Update existing list
  closeEditor,     // Close the editor modal
} = Lists.getListsContext();
```

### **Handler Callbacks**:

```typescript
// Called when creating a list
handlers.onCreate?: (data: ListFormData) => Promise<ListData>;

// Called when updating a list
handlers.onUpdate?: (id: string, data: Partial<ListFormData>) => Promise<ListData>;
```

---

## 💡 Examples

### **Example 1: Basic Editor with Validation Messages**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { toast } from '$lib/toast';
  
  const handlers = {
    onCreate: async (data) => {
      try {
        // Validate on server
        const response = await fetch('/api/lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          
          // Handle specific validation errors
          if (error.code === 'TITLE_TAKEN') {
            throw new Error('A list with this title already exists');
          } else if (error.code === 'LIST_LIMIT_REACHED') {
            throw new Error('You have reached the maximum number of lists (50)');
          }
          
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
    
    onUpdate: async (id, data) => {
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
        
        const list = await response.json();
        toast.success('List updated successfully!');
        return list;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Editor class="custom-editor" />
</Lists.Root>

<style>
  :global(.custom-editor) {
    max-width: 600px;
  }
</style>
```

### **Example 2: With Custom Validation Rules**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListFormData } from '@greater/fediverse/Lists';
  
  // Custom validation beyond the built-in checks
  function validateListData(data: ListFormData): string | null {
    // Check for profanity (example)
    const profanityWords = ['badword1', 'badword2'];
    const hasProfanity = profanityWords.some(word =>
      data.title.toLowerCase().includes(word) ||
      data.description?.toLowerCase().includes(word)
    );
    
    if (hasProfanity) {
      return 'List title and description must not contain inappropriate language';
    }
    
    // Check title doesn't start with special characters
    if (/^[^a-zA-Z0-9]/.test(data.title)) {
      return 'List title must start with a letter or number';
    }
    
    // Check for minimum title length
    if (data.title.trim().length < 3) {
      return 'List title must be at least 3 characters long';
    }
    
    // Check for duplicate titles (you'd need to check against existing lists)
    // This is just an example - real implementation would query existing lists
    
    return null;
  }
  
  const handlers = {
    onCreate: async (data) => {
      // Additional validation before sending to server
      const validationError = validateListData(data);
      if (validationError) {
        throw new Error(validationError);
      }
      
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create list');
      }
      
      return await response.json();
    },
    
    onUpdate: async (id, data) => {
      // Additional validation for updates
      const validationError = validateListData(data as ListFormData);
      if (validationError) {
        throw new Error(validationError);
      }
      
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update list');
      }
      
      return await response.json();
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Editor />
</Lists.Root>
```

### **Example 3: With Templates and Quick Actions**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import type { ListFormData } from '@greater/fediverse/Lists';
  
  // Predefined list templates
  const listTemplates: Array<{ name: string; data: ListFormData }> = [
    {
      name: 'Tech News',
      data: {
        title: 'Tech News',
        description: 'Stay updated with the latest in technology',
        visibility: 'public',
      },
    },
    {
      name: 'Friends',
      data: {
        title: 'Friends',
        description: 'Close friends and family',
        visibility: 'private',
      },
    },
    {
      name: 'Work',
      data: {
        title: 'Work Contacts',
        description: 'Professional connections and colleagues',
        visibility: 'private',
      },
    },
  ];
  
  let showTemplates = $state(false);
  let context: ReturnType<typeof Lists.getListsContext>;
  
  function useTemplate(template: typeof listTemplates[0]) {
    // Close templates
    showTemplates = false;
    
    // Create list directly
    context.createList(template.data);
  }
  
  const handlers = {
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
  };
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="lists-with-templates">
      <div class="header">
        <h2>My Lists</h2>
        <div class="header-actions">
          <button
            class="template-button"
            onclick={() => { showTemplates = !showTemplates; }}
          >
            📋 Use Template
          </button>
          <button
            class="create-button"
            onclick={() => context.openEditor()}
          >
            ➕ Create Custom List
          </button>
        </div>
      </div>
      
      {#if showTemplates}
        <div class="templates-panel">
          <h3>Quick Start Templates</h3>
          <div class="templates-grid">
            {#each listTemplates as template}
              <button
                class="template-card"
                onclick={() => useTemplate(template)}
              >
                <h4>{template.data.title}</h4>
                <p>{template.data.description}</p>
                <span class="template-visibility">
                  {template.data.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
      
      <Lists.Manager />
      <Lists.Editor />
    </div>
  {/snippet}
</Lists.Root>

<style>
  .lists-with-templates {
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
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  
  .template-button,
  .create-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .template-button {
    background: var(--bg-secondary, #f7f9fa);
    color: var(--text-primary, #0f1419);
    border: 1px solid var(--border-color, #e1e8ed);
  }
  
  .template-button:hover {
    background: var(--bg-hover, #eff3f4);
  }
  
  .create-button {
    background: var(--primary-color, #1d9bf0);
    color: white;
  }
  
  .create-button:hover {
    background: var(--primary-color-dark, #1a8cd8);
  }
  
  .templates-panel {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    color: white;
  }
  
  .templates-panel h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
  }
  
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .template-card {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
    color: white;
  }
  
  .template-card:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
  
  .template-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
  }
  
  .template-card p {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .template-visibility {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
</style>
```

### **Example 4: With Auto-save Draft**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { onMount } from 'svelte';
  
  const DRAFT_STORAGE_KEY = 'lists-editor-draft';
  
  let context: ReturnType<typeof Lists.getListsContext>;
  let hasDraft = $state(false);
  
  // Check for draft on mount
  onMount(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    hasDraft = !!draft;
  });
  
  function loadDraft() {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        // Open editor and populate with draft
        context.openEditor();
        // Note: You'd need to modify the editor to accept initial values
        // or use a custom editor implementation
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
    hasDraft = false;
  }
  
  function discardDraft() {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    hasDraft = false;
  }
  
  const handlers = {
    onCreate: async (data) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Clear draft on successful creation
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      
      return await response.json();
    },
  };
  
  // Save draft periodically
  $effect(() => {
    if (!context) return;
    
    const interval = setInterval(() => {
      if (context.state.editorOpen && !context.state.editingList) {
        // Get current form values (you'd need to expose these from the editor)
        // For now, this is a conceptual example
        const currentValues = {
          title: '', // Would get from editor state
          description: '',
          visibility: 'public',
        };
        
        if (currentValues.title) {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(currentValues));
        }
      }
    }, 5000); // Auto-save every 5 seconds
    
    return () => clearInterval(interval);
  });
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    {#if hasDraft}
      <div class="draft-banner">
        <div class="draft-banner__content">
          <svg class="draft-banner__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <div>
            <strong>Draft Saved</strong>
            <p>You have an unsaved list draft</p>
          </div>
        </div>
        <div class="draft-banner__actions">
          <button class="draft-button draft-button--primary" onclick={loadDraft}>
            Continue Editing
          </button>
          <button class="draft-button draft-button--secondary" onclick={discardDraft}>
            Discard
          </button>
        </div>
      </div>
    {/if}
    
    <Lists.Manager />
    <Lists.Editor />
  {/snippet}
</Lists.Root>

<style>
  .draft-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 0.75rem;
  }
  
  .draft-banner__content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .draft-banner__icon {
    width: 2rem;
    height: 2rem;
    color: #f59e0b;
    flex-shrink: 0;
  }
  
  .draft-banner__content strong {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .draft-banner__content p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .draft-banner__actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .draft-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .draft-button--primary {
    background: #f59e0b;
    color: white;
  }
  
  .draft-button--primary:hover {
    background: #d97706;
  }
  
  .draft-button--secondary {
    background: transparent;
    color: var(--text-secondary, #536471);
    border: 1px solid var(--border-color, #e1e8ed);
  }
  
  .draft-button--secondary:hover {
    background: var(--bg-hover, #eff3f4);
  }
</style>
```

### **Example 5: With Analytics Tracking**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { analytics } from '$lib/analytics';
  import { logger } from '$lib/logger';
  
  function trackEditorOpen(mode: 'create' | 'edit') {
    analytics.track('Lists Editor Opened', {
      mode,
      timestamp: new Date().toISOString(),
    });
  }
  
  function trackEditorClose(saved: boolean, mode: 'create' | 'edit') {
    analytics.track('Lists Editor Closed', {
      mode,
      saved,
      timestamp: new Date().toISOString(),
    });
  }
  
  function trackFormValidationError(error: string) {
    analytics.track('Lists Editor Validation Error', {
      error,
      timestamp: new Date().toISOString(),
    });
  }
  
  const handlers = {
    onCreate: async (data) => {
      const startTime = performance.now();
      
      try {
        logger.info('Creating list', { title: data.title, visibility: data.visibility });
        
        const response = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create list');
        }
        
        const list = await response.json();
        const duration = performance.now() - startTime;
        
        logger.info('List created successfully', {
          listId: list.id,
          title: list.title,
          duration: `${duration.toFixed(2)}ms`,
        });
        
        analytics.track('List Created', {
          listId: list.id,
          visibility: list.visibility,
          hasDescription: !!list.description,
          duration,
          titleLength: list.title.length,
          descriptionLength: list.description?.length || 0,
        });
        
        trackEditorClose(true, 'create');
        
        return list;
      } catch (error) {
        logger.error('List creation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          title: data.title,
        });
        
        analytics.track('List Creation Failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          visibility: data.visibility,
        });
        
        throw error;
      }
    },
    
    onUpdate: async (id, data) => {
      const startTime = performance.now();
      
      try {
        logger.info('Updating list', { listId: id, changes: Object.keys(data) });
        
        const response = await fetch(`/api/lists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update list');
        }
        
        const list = await response.json();
        const duration = performance.now() - startTime;
        
        logger.info('List updated successfully', {
          listId: id,
          duration: `${duration.toFixed(2)}ms`,
        });
        
        analytics.track('List Updated', {
          listId: id,
          fieldsUpdated: Object.keys(data),
          duration,
        });
        
        trackEditorClose(true, 'edit');
        
        return list;
      } catch (error) {
        logger.error('List update failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          listId: id,
        });
        
        analytics.track('List Update Failed', {
          listId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        throw error;
      }
    },
  };
  
  // Track editor opening
  let context: ReturnType<typeof Lists.getListsContext>;
  
  $effect(() => {
    if (!context) return;
    
    // Track when editor opens
    if (context.state.editorOpen) {
      const mode = context.state.editingList ? 'edit' : 'create';
      trackEditorOpen(mode);
    }
  });
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <Lists.Manager />
    <Lists.Editor />
  {/snippet}
</Lists.Root>
```

---

## 🎨 Styling

`Lists.Editor` uses CSS custom properties for theming:

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

### **Custom Styling**

```svelte
<Lists.Editor class="custom-editor" />

<style>
  :global(.custom-editor) {
    /* Override modal width */
    max-width: 700px;
  }
  
  :global(.custom-editor .lists-editor__title) {
    color: #7c3aed;
    font-size: 1.75rem;
  }
  
  :global(.custom-editor .lists-editor__input),
  :global(.custom-editor .lists-editor__textarea) {
    border: 2px solid #e9d5ff;
    border-radius: 0.75rem;
  }
  
  :global(.custom-editor .lists-editor__input:focus),
  :global(.custom-editor .lists-editor__textarea:focus) {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
  
  :global(.custom-editor .lists-editor__button--primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
</style>
```

---

## 🔒 Security Considerations

### **Input Sanitization**

Always sanitize user inputs:

```typescript
import { sanitizeHTML, escapeHTML } from '$lib/security';

const handlers = {
  onCreate: async (data) => {
    // Sanitize inputs before sending to server
    const sanitized = {
      title: escapeHTML(data.title.trim()),
      description: data.description ? sanitizeHTML(data.description.trim()) : undefined,
      visibility: data.visibility,
    };
    
    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
    
    return await response.json();
  },
};
```

### **Server-side Validation**

Always validate on the server:

```typescript
// Server-side (Express example)
app.post('/api/lists', async (req, res) => {
  const { title, description, visibility } = req.body;
  
  // Validate required fields
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  // Validate length constraints
  if (title.length > 100) {
    return res.status(400).json({ error: 'Title must be 100 characters or less' });
  }
  
  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description must be 500 characters or less' });
  }
  
  // Validate visibility
  if (!['public', 'private'].includes(visibility)) {
    return res.status(400).json({ error: 'Invalid visibility setting' });
  }
  
  // Check permissions
  if (visibility === 'public' && !req.user.canCreatePublicLists) {
    return res.status(403).json({ error: 'You do not have permission to create public lists' });
  }
  
  // Create list
  const list = await List.create({
    title: title.trim(),
    description: description?.trim(),
    visibility,
    ownerId: req.user.id,
  });
  
  res.json(list);
});
```

### **Rate Limiting**

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const createListLimiter = new RateLimiter({
  maxRequests: 10, // 10 lists
  windowMs: 60 * 60 * 1000, // per hour
});

const handlers = {
  onCreate: async (data) => {
    const userId = getCurrentUserId();
    
    if (!await createListLimiter.checkLimit(userId)) {
      throw new Error('Rate limit exceeded. You can create up to 10 lists per hour.');
    }
    
    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  },
};
```

---

## ♿ Accessibility

`Lists.Editor` is fully accessible:

### **Keyboard Navigation**

- **Tab**: Navigate between form fields
- **Enter**: Submit form (when focused on input)
- **Escape**: Close modal
- **Space**: Toggle radio buttons

### **Screen Reader Support**

```html
<!-- Modal is properly labeled -->
<div role="dialog" aria-labelledby="editor-title" aria-modal="true">
  <h2 id="editor-title">Create New List</h2>
  
  <!-- Form fields have labels -->
  <label for="list-title">
    Title <span class="sr-only">(required)</span>
  </label>
  <input
    id="list-title"
    type="text"
    aria-required="true"
    aria-describedby="title-hint title-error"
  />
  
  <!-- Error messages are announced -->
  <div id="title-error" role="alert" aria-live="polite">
    List title is required
  </div>
</div>
```

### **Focus Management**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let titleInput: HTMLInputElement | null = null;
  
  // Auto-focus title input when modal opens
  $effect(() => {
    if (state.editorOpen && titleInput) {
      titleInput.focus();
    }
  });
</script>
```

---

## ⚡ Performance

### **Debounced Validation**

```svelte
<script lang="ts">
  import { debounce } from '$lib/utils';
  
  let title = $state('');
  let validationError = $state<string | null>(null);
  
  const validateTitle = debounce((value: string) => {
    if (value.length > 100) {
      validationError = 'Title must be 100 characters or less';
    } else if (value.trim().length === 0) {
      validationError = 'Title is required';
    } else {
      validationError = null;
    }
  }, 300);
  
  $effect(() => {
    validateTitle(title);
  });
</script>
```

---

## 🧪 Testing

### **Component Tests**

```typescript
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import * as Lists from '@greater/fediverse/Lists';

describe('Lists.Editor', () => {
  test('opens in create mode', async () => {
    const { getByText } = render(Lists.Root, {
      handlers: {},
    });
    
    // Trigger editor opening (this would come from Manager or programmatic call)
    // ...
    
    await waitFor(() => {
      expect(getByText('Create New List')).toBeInTheDocument();
    });
  });
  
  test('validates title length', async () => {
    const { getByLabelText, getByText } = render(Lists.Root, {
      handlers: {},
    });
    
    const titleInput = getByLabelText('Title');
    
    // Enter title exceeding 100 characters
    await fireEvent.input(titleInput, {
      target: { value: 'a'.repeat(101) },
    });
    
    // Try to submit
    await fireEvent.click(getByText('Create List'));
    
    await waitFor(() => {
      expect(getByText('Title must be 100 characters or less')).toBeInTheDocument();
    });
  });
  
  test('creates list successfully', async () => {
    const onCreate = vi.fn().mockResolvedValue({
      id: '1',
      title: 'Test List',
      visibility: 'public',
      membersCount: 0,
    });
    
    const { getByLabelText, getByText } = render(Lists.Root, {
      handlers: { onCreate },
    });
    
    // Fill form
    await fireEvent.input(getByLabelText('Title'), {
      target: { value: 'Test List' },
    });
    
    await fireEvent.click(getByLabelText('Public'));
    
    // Submit
    await fireEvent.click(getByText('Create List'));
    
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        title: 'Test List',
        description: undefined,
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
- [Lists.Settings](/docs/components/Lists/Settings.md) - List settings

---

## 📚 API Reference

### **validateListForm()**

```typescript
import { validateListForm } from '@greater/fediverse/Lists';

const error = validateListForm({
  title: 'My List',
  description: 'Description',
  visibility: 'public',
});

// Returns null if valid, or error message string if invalid
```

---

## 📖 See Also

- [Lists Component Overview](/docs/components/Lists/README.md)
- [Form Validation Best Practices](/docs/guides/validation.md)
- [Modal Accessibility Guide](/docs/guides/modal-accessibility.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

