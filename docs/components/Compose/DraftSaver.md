# Compose.DraftSaver

**Component**: Auto-Save Draft Manager  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.DraftSaver` automatically saves compose drafts to localStorage and provides manual save/load controls. It prevents data loss from accidental page closes, browser crashes, or navigation, allowing users to resume composing exactly where they left off.

### **Key Features**:
- ✅ **Auto-save** with configurable intervals (default 30 seconds)
- ✅ **Manual save/load** controls
- ✅ **Multiple drafts** support with unique keys
- ✅ **Draft age tracking** (shows "saved 2 minutes ago")
- ✅ **Automatic cleanup** of old drafts (7 days)
- ✅ **Load prompt** on page load if draft exists
- ✅ **Auto-clear** on successful submission
- ✅ **localStorage fallback** handling
- ✅ **Visual indicators** for save status

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.DraftSaver 
    draftKey="main-composer"
    autoSave={true}
    intervalSeconds={30}
  />
  
  <Compose.Editor autofocus />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `draftKey` | `string` | `'default'` | No | Unique key for this draft (for multiple composers) |
| `autoSave` | `boolean` | `true` | No | Enable automatic saving |
| `intervalSeconds` | `number` | `30` | No | Auto-save interval in seconds |
| `showIndicator` | `boolean` | `true` | No | Show visual save indicators |
| `class` | `string` | `''` | No | Additional CSS class |

---

## 💾 Draft Storage

Drafts are stored in localStorage with the following structure:

```typescript
interface Draft {
  /** Draft content */
  content: string;
  
  /** Content warning text */
  contentWarning?: string;
  
  /** Post visibility */
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  
  /** Timestamp when saved */
  savedAt: number;
  
  /** ID of status being replied to */
  inReplyTo?: string;
  
  /** Media attachment IDs */
  mediaIds?: string[];
  
  /** Additional metadata */
  metadata?: {
    language?: string;
    sensitive?: boolean;
  };
}
```

**Storage Key Format**: `greater-compose-draft-{draftKey}`

**Maximum Age**: 7 days (older drafts are automatically deleted)

---

## 💡 Examples

### **Example 1: Basic Auto-Save**

Simple auto-save with default settings:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="draft-composer">
  <h2>Create Post</h2>
  <p class="help-text">Your draft is automatically saved every 30 seconds</p>
  
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    {/* Auto-saves every 30 seconds */}
    <Compose.DraftSaver 
      draftKey="main-post"
      autoSave={true}
      intervalSeconds={30}
    />
    
    <Compose.Editor autofocus />
    
    <div class="footer">
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .draft-composer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
  }

  .help-text {
    margin: 0 0 1rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 2: Multiple Draft Keys**

Manage separate drafts for different contexts:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  type ComposerType = 'main' | 'reply' | 'quote';
  let activeComposer = $state<ComposerType>('main');

  async function handleSubmit(data) {
    await api.createPost({
      ...data,
      type: activeComposer
    });
  }
</script>

<div class="multi-draft-composer">
  <div class="tabs">
    <button 
      class:active={activeComposer === 'main'}
      onclick={() => activeComposer = 'main'}
    >
      New Post
    </button>
    <button 
      class:active={activeComposer === 'reply'}
      onclick={() => activeComposer = 'reply'}
    >
      Reply
    </button>
    <button 
      class:active={activeComposer === 'quote'}
      onclick={() => activeComposer = 'quote'}
    >
      Quote
    </button>
  </div>

  {#if activeComposer === 'main'}
    <Compose.Root handlers={{ onSubmit: handleSubmit }}>
      <Compose.DraftSaver draftKey="draft-main" />
      <Compose.Editor autofocus />
      <Compose.Submit />
    </Compose.Root>
  {:else if activeComposer === 'reply'}
    <Compose.Root handlers={{ onSubmit: handleSubmit }}>
      <Compose.DraftSaver draftKey="draft-reply" />
      <Compose.Editor autofocus />
      <Compose.Submit text="Reply" />
    </Compose.Root>
  {:else if activeComposer === 'quote'}
    <Compose.Root handlers={{ onSubmit: handleSubmit }}>
      <Compose.DraftSaver draftKey="draft-quote" />
      <Compose.Editor autofocus />
      <Compose.Submit text="Quote" />
    </Compose.Root>
  {/if}
</div>

<style>
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tabs button {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    cursor: pointer;
  }

  .tabs button.active {
    background: #1d9bf0;
    color: white;
    border-color: #1d9bf0;
  }
</style>
```

### **Example 3: Manual Save/Load Controls**

Add manual save and clear buttons:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { saveDraft, loadDraft, deleteDraft } from '@equaltoai/greater-components-fediverse/Compose';

  const draftKey = 'manual-draft';
  let lastSaved = $state<number | null>(null);

  async function handleSubmit(data) {
    await api.createPost(data);
  }

  function handleManualSave() {
    const draft = {
      content: getCurrentContent(),
      savedAt: Date.now()
    };
    
    if (saveDraft(draft, draftKey)) {
      lastSaved = Date.now();
      alert('Draft saved!');
    }
  }

  function handleLoadDraft() {
    const draft = loadDraft(draftKey);
    if (draft) {
      // Set content via context
      alert('Draft loaded!');
    } else {
      alert('No draft found');
    }
  }

  function handleClearDraft() {
    if (confirm('Clear saved draft?')) {
      deleteDraft(draftKey);
      lastSaved = null;
      alert('Draft cleared!');
    }
  }

  function getCurrentContent() {
    // Get content from compose context
    return '';
  }
</script>

<div class="manual-draft-composer">
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.DraftSaver 
      draftKey={draftKey}
      autoSave={false}
      showIndicator={false}
    />
    
    <Compose.Editor autofocus />
    
    <div class="draft-controls">
      <button onclick={handleManualSave} class="save-btn">
        💾 Save Draft
      </button>
      <button onclick={handleLoadDraft} class="load-btn">
        📂 Load Draft
      </button>
      <button onclick={handleClearDraft} class="clear-btn">
        🗑️ Clear Draft
      </button>
    </div>

    {#if lastSaved}
      <div class="save-status">
        Last saved: {new Date(lastSaved).toLocaleTimeString()}
      </div>
    {/if}

    <Compose.Submit />
  </Compose.Root>
</div>

<style>
  .draft-controls {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .draft-controls button {
    padding: 0.5rem 1rem;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .draft-controls button:hover {
    background: #f7f9fa;
  }

  .save-status {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: #10b981;
  }
</style>
```

### **Example 4: Draft Recovery Prompt**

Show a modal to recover unsaved drafts on page load:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { hasDraft, loadDraft, deleteDraft, getDraftAge } from '@equaltoai/greater-components-fediverse/Compose';
  import { onMount } from 'svelte';

  const draftKey = 'recovery-draft';
  let showRecoveryPrompt = $state(false);
  let draftAge = $state<number>(0);

  onMount(() => {
    if (hasDraft(draftKey)) {
      const age = getDraftAge(draftKey);
      if (age) {
        draftAge = age;
        showRecoveryPrompt = true;
      }
    }
  });

  function recoverDraft() {
    const draft = loadDraft(draftKey);
    if (draft) {
      // Load draft into editor
      showRecoveryPrompt = false;
    }
  }

  function discardDraft() {
    deleteDraft(draftKey);
    showRecoveryPrompt = false;
  }

  async function handleSubmit(data) {
    await api.createPost(data);
  }

  function formatAge(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }
</script>

{#if showRecoveryPrompt}
  <div class="recovery-modal">
    <div class="recovery-dialog">
      <h3>💾 Unsaved Draft Found</h3>
      <p>
        You have an unsaved draft from <strong>{formatAge(draftAge)}</strong>.
        Would you like to continue where you left off?
      </p>
      <div class="recovery-actions">
        <button onclick={discardDraft} class="discard-btn">
          Discard
        </button>
        <button onclick={recoverDraft} class="recover-btn">
          Recover Draft
        </button>
      </div>
    </div>
  </div>
{/if}

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.DraftSaver draftKey={draftKey} />
  <Compose.Editor autofocus />
  <Compose.Submit />
</Compose.Root>

<style>
  .recovery-modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .recovery-dialog {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .recovery-dialog h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  .recovery-dialog p {
    margin: 0 0 1.5rem;
    color: #536471;
    line-height: 1.5;
  }

  .recovery-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .discard-btn,
  .recover-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }

  .discard-btn {
    background: transparent;
    color: #0f1419;
    border: 1px solid #cfd9de;
  }

  .recover-btn {
    background: #1d9bf0;
    color: white;
  }
</style>
```

### **Example 5: Draft Cleanup Utility**

Automatically clean up old drafts on app initialization:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { cleanupOldDrafts, listDrafts } from '@equaltoai/greater-components-fediverse/Compose';
  import { onMount } from 'svelte';

  let cleanedCount = $state(0);
  let allDrafts = $state<string[]>([]);

  onMount(() => {
    // Clean up drafts older than 7 days
    cleanedCount = cleanupOldDrafts();
    
    // List remaining drafts
    allDrafts = listDrafts();

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} old draft(s)`);
    }
  });

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="app-composer">
  {#if cleanedCount > 0}
    <div class="cleanup-notice">
      ℹ️ Cleaned up {cleanedCount} old draft{cleanedCount > 1 ? 's' : ''}
    </div>
  {/if}

  {#if allDrafts.length > 0}
    <div class="draft-list">
      <h4>Your Drafts ({allDrafts.length})</h4>
      <ul>
        {#each allDrafts as draftKey}
          <li>{draftKey}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.DraftSaver />
    <Compose.Editor autofocus />
    <Compose.Submit />
  </Compose.Root>
</div>

<style>
  .cleanup-notice {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #e8f5fd;
    border: 1px solid #1d9bf0;
    border-radius: 8px;
    color: #0f1419;
    font-size: 0.875rem;
  }

  .draft-list {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f7f9fa;
    border-radius: 8px;
  }

  .draft-list h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    color: #536471;
  }

  .draft-list ul {
    margin: 0;
    padding-left: 1.5rem;
    font-size: 0.875rem;
  }
</style>
```

### **Example 6: Real-Time Draft Sync**

Sync drafts across tabs in real-time:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { saveDraft, loadDraft } from '@equaltoai/greater-components-fediverse/Compose';
  import { onMount } from 'svelte';

  const draftKey = 'synced-draft';
  let syncEnabled = $state(true);

  onMount(() => {
    if (!syncEnabled) return;

    // Listen for localStorage changes from other tabs
    function handleStorageChange(event: StorageEvent) {
      if (event.key === `greater-compose-draft-${draftKey}`) {
        if (event.newValue) {
          const draft = JSON.parse(event.newValue);
          console.log('Draft updated in another tab:', draft);
          // Optionally reload draft
        }
      }
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  });

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="synced-composer">
  <div class="sync-status">
    <label>
      <input type="checkbox" bind:checked={syncEnabled} />
      Sync drafts across tabs
    </label>
    {#if syncEnabled}
      <span class="sync-indicator">🔄 Syncing</span>
    {/if}
  </div>

  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.DraftSaver 
      draftKey={draftKey}
      autoSave={syncEnabled}
    />
    <Compose.Editor autofocus />
    <Compose.Submit />
  </Compose.Root>
</div>

<style>
  .sync-status {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #f7f9fa;
    border-radius: 8px;
    font-size: 0.875rem;
  }

  .sync-indicator {
    color: #10b981;
    font-weight: 600;
  }
</style>
```

---

## 🎨 Styling

```css
.draft-saver {
  /* Container */
  --draft-spacing: 0.75rem;

  /* Load button */
  --draft-load-bg: #e8f5fd;
  --draft-load-border: #1d9bf0;
  --draft-load-color: #1d9bf0;
  --draft-load-hover: #d5eef9;
  --draft-radius: 6px;

  /* Indicator */
  --text-secondary: #536471;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .draft-saver {
    --draft-load-bg: rgba(29, 155, 240, 0.1);
    --draft-load-border: #1d9bf0;
    --draft-load-hover: rgba(29, 155, 240, 0.2);
    --text-secondary: #8899a6;
  }
}
```

---

## ♿ Accessibility

`Compose.DraftSaver` follows WCAG 2.1 AA standards:

### **Keyboard Support**
- Draft load button is keyboard accessible
- Standard button interactions (Enter, Space)

### **Screen Reader Support**
- Draft status announced via ARIA live regions
- Clear button labels
- Save timestamps announced

### **Visual Feedback**
- Clear visual indicators for save status
- Icon + text for better clarity
- Color is not the only indicator

---

## 🔒 Security Considerations

### **localStorage Availability**

Always check for localStorage availability:

```typescript
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
```

### **Data Sanitization**

Don't store sensitive data in drafts:

```typescript
// ❌ DON'T store sensitive data
const draft = {
  content,
  password: userPassword, // Never store passwords!
  apiKey: secretKey // Never store keys!
};

// ✅ Only store non-sensitive compose data
const draft = {
  content,
  visibility,
  contentWarning
};
```

### **Storage Limits**

localStorage has a ~5-10MB limit per domain:

```typescript
function getStorageUsage(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

// Warn if approaching limit
if (getStorageUsage() > 4.5 * 1024 * 1024) {
  console.warn('localStorage usage high, consider cleanup');
  cleanupOldDrafts();
}
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';
import { saveDraft, loadDraft, deleteDraft } from '@equaltoai/greater-components-fediverse/Compose';

describe('Compose.DraftSaver', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('auto-saves drafts', async () => {
    vi.useFakeTimers();

    render(Compose.Root, {
      props: {
        config: {}
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, { target: { value: 'Test draft' } });

    // Advance time by 30 seconds
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      const draft = loadDraft('default');
      expect(draft?.content).toBe('Test draft');
    });

    vi.useRealTimers();
  });

  it('shows load button when draft exists', () => {
    // Create a draft
    saveDraft({
      content: 'Existing draft',
      savedAt: Date.now()
    }, 'test-key');

    render(Compose.Root, {
      props: {
        draftKey: 'test-key'
      }
    });

    expect(screen.getByText(/load draft/i)).toBeInTheDocument();
  });

  it('clears draft on successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    // Save a draft first
    saveDraft({
      content: 'Draft content',
      savedAt: Date.now()
    }, 'submit-test');

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit },
        draftKey: 'submit-test'
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, { target: { value: 'New content' } });

    const submitBtn = screen.getByRole('button', { name: /post/i });
    await fireEvent.click(submitBtn);

    await waitFor(() => {
      // Draft should be cleared
      expect(loadDraft('submit-test')).toBeNull();
    });
  });

  it('handles localStorage unavailability', () => {
    // Mock localStorage to throw
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });

    render(Compose.Root);

    const editor = screen.getByRole('textbox');
    fireEvent.input(editor, { target: { value: 'Test' } });

    // Should not crash
    expect(() => {
      saveDraft({ content: 'Test', savedAt: Date.now() });
    }).not.toThrow();

    mockSetItem.mockRestore();
  });
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.Editor](./Editor.md) - Text editor
- [DraftManager Utility](./DraftManager.md) - Draft management utilities

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [DraftManager Utility Documentation](./DraftManager.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: How often should I auto-save?**

30 seconds is a good default. Adjust based on your needs:
- **10-15 seconds**: For critical content
- **30 seconds**: General use (default)
- **60+ seconds**: For performance-constrained environments

### **Q: Can I store media attachments in drafts?**

Store media IDs, not files:

```typescript
const draft = {
  content,
  mediaIds: ['id1', 'id2'], // ✅ Store IDs
  // media: [File, File] // ❌ Don't store File objects
};
```

### **Q: What happens if localStorage is full?**

The save will fail silently. Implement cleanup:

```typescript
import { cleanupOldDrafts } from '@equaltoai/greater-components-fediverse/Compose';

// Periodically clean up
setInterval(() => {
  cleanupOldDrafts();
}, 3600000); // Every hour
```

### **Q: Can I sync drafts across devices?**

localStorage is per-device. For cross-device sync, store drafts on your server:

```typescript
async function saveDraftToServer(draft: Draft) {
  await fetch('/api/drafts', {
    method: 'POST',
    body: JSON.stringify(draft)
  });
}
```

### **Q: How do I migrate old draft formats?**

Implement migration logic:

```typescript
function migrateDraft(oldDraft: any): Draft {
  return {
    content: oldDraft.text || oldDraft.content || '',
    savedAt: oldDraft.timestamp || Date.now(),
    visibility: oldDraft.privacy || 'public'
  };
}
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

