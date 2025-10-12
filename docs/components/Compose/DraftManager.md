# Compose Utilities: DraftManager

**Module**: Draft Management Utility  
**Package**: `@greater/fediverse`  
**Export**: `Compose.DraftManager` or direct imports

---

## 📋 Overview

The `DraftManager` utility provides a comprehensive API for managing compose drafts in localStorage. It handles saving, loading, listing, and cleaning up drafts with automatic expiration, multiple draft keys support, and error handling for localStorage unavailability.

### **Key Features**:
- ✅ **localStorage persistence** with automatic cleanup
- ✅ **Multiple draft keys** for different composers
- ✅ **Automatic expiration** (7 days default)
- ✅ **Draft age tracking** and formatting
- ✅ **Error handling** for quota exceeded and unavailable storage
- ✅ **TypeScript** fully typed API
- ✅ **Zero dependencies**

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🔧 API Reference

### **Draft Interface**

```typescript
interface Draft {
  /** Draft content */
  content: string;
  
  /** Content warning text */
  contentWarning?: string;
  
  /** Post visibility */
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  
  /** Timestamp when saved (milliseconds) */
  savedAt: number;
  
  /** ID of status being replied to */
  inReplyTo?: string;
  
  /** Media attachment IDs */
  mediaIds?: string[];
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}
```

### **Functions**

#### **isLocalStorageAvailable()**

Check if localStorage is available and working.

```typescript
function isLocalStorageAvailable(): boolean
```

**Returns**: `true` if localStorage is available, `false` otherwise.

**Example**:
```typescript
import { isLocalStorageAvailable } from '@greater/fediverse/Compose';

if (isLocalStorageAvailable()) {
  console.log('localStorage is available');
} else {
  console.warn('localStorage not available, drafts will not persist');
}
```

---

#### **saveDraft()**

Save a draft to localStorage.

```typescript
function saveDraft(
  draft: Draft,
  key: string = 'default'
): boolean
```

**Parameters**:
- `draft`: Draft object to save
- `key`: Unique key for this draft (default: `'default'`)

**Returns**: `true` if saved successfully, `false` otherwise.

**Example**:
```typescript
import { saveDraft } from '@greater/fediverse/Compose';

const draft = {
  content: 'This is my draft post...',
  visibility: 'public',
  savedAt: Date.now()
};

if (saveDraft(draft, 'main-composer')) {
  console.log('Draft saved!');
}
```

---

#### **loadDraft()**

Load a draft from localStorage.

```typescript
function loadDraft(key: string = 'default'): Draft | null
```

**Parameters**:
- `key`: Unique key for the draft to load

**Returns**: Draft object if found, `null` otherwise.

**Example**:
```typescript
import { loadDraft } from '@greater/fediverse/Compose';

const draft = loadDraft('main-composer');
if (draft) {
  console.log('Loaded draft:', draft.content);
  console.log('Saved at:', new Date(draft.savedAt));
}
```

---

#### **deleteDraft()**

Delete a draft from localStorage.

```typescript
function deleteDraft(key: string = 'default'): boolean
```

**Parameters**:
- `key`: Unique key for the draft to delete

**Returns**: `true` if deleted successfully, `false` otherwise.

**Example**:
```typescript
import { deleteDraft } from '@greater/fediverse/Compose';

if (deleteDraft('main-composer')) {
  console.log('Draft deleted');
}
```

---

#### **listDrafts()**

Get all draft keys currently stored.

```typescript
function listDrafts(): string[]
```

**Returns**: Array of draft keys.

**Example**:
```typescript
import { listDrafts } from '@greater/fediverse/Compose';

const keys = listDrafts();
console.log(`Found ${keys.length} draft(s):`, keys);
// Example output: ['main-composer', 'reply-composer', 'dm-composer']
```

---

#### **cleanupOldDrafts()**

Remove drafts older than the maximum age (7 days).

```typescript
function cleanupOldDrafts(): number
```

**Returns**: Number of drafts deleted.

**Example**:
```typescript
import { cleanupOldDrafts } from '@greater/fediverse/Compose';

// Run on app initialization
const deleted = cleanupOldDrafts();
if (deleted > 0) {
  console.log(`Cleaned up ${deleted} old draft(s)`);
}
```

---

#### **hasDraft()**

Check if a draft exists for the given key.

```typescript
function hasDraft(key: string = 'default'): boolean
```

**Parameters**:
- `key`: Draft key to check

**Returns**: `true` if draft exists, `false` otherwise.

**Example**:
```typescript
import { hasDraft } from '@greater/fediverse/Compose';

if (hasDraft('main-composer')) {
  // Show "Load Draft" button
}
```

---

#### **getDraftAge()**

Get the age of a draft in milliseconds.

```typescript
function getDraftAge(key: string = 'default'): number | null
```

**Parameters**:
- `key`: Draft key

**Returns**: Age in milliseconds, or `null` if draft doesn't exist.

**Example**:
```typescript
import { getDraftAge } from '@greater/fediverse/Compose';

const age = getDraftAge('main-composer');
if (age) {
  const hours = age / 3600000;
  console.log(`Draft is ${hours.toFixed(1)} hours old`);
}
```

---

#### **formatDraftAge()**

Format draft age into human-readable string.

```typescript
function formatDraftAge(key: string = 'default'): string | null
```

**Parameters**:
- `key`: Draft key

**Returns**: Formatted string like "2 minutes ago", or `null` if draft doesn't exist.

**Example**:
```typescript
import { formatDraftAge } from '@greater/fediverse/Compose';

const formatted = formatDraftAge('main-composer');
console.log(formatted); // "5 minutes ago"
```

---

## 💡 Usage Examples

### **Example 1: Basic Draft Management**

Simple save/load/delete operations:

```typescript
import { saveDraft, loadDraft, deleteDraft } from '@greater/fediverse/Compose';

// Save a draft
const draft = {
  content: 'My post content',
  visibility: 'public',
  savedAt: Date.now()
};

saveDraft(draft, 'my-post');

// Load it later
const loaded = loadDraft('my-post');
console.log(loaded?.content); // "My post content"

// Delete when done
deleteDraft('my-post');
```

### **Example 2: Auto-Save with Debouncing**

Implement auto-save with debouncing to avoid excessive localStorage writes:

```typescript
import { saveDraft } from '@greater/fediverse/Compose';

let autoSaveTimeout: ReturnType<typeof setTimeout>;

function debouncedAutoSave(content: string, key: string) {
  clearTimeout(autoSaveTimeout);
  
  autoSaveTimeout = setTimeout(() => {
    const draft = {
      content,
      savedAt: Date.now()
    };
    
    if (saveDraft(draft, key)) {
      console.log('Auto-saved draft');
    }
  }, 2000); // Wait 2 seconds after last change
}

// Call on content change
editor.addEventListener('input', (e) => {
  debouncedAutoSave(e.target.value, 'editor');
});
```

### **Example 3: Draft Recovery on Page Load**

Show recovery prompt if unsaved draft exists:

```typescript
import { hasDraft, loadDraft, getDraftAge, deleteDraft } from '@greater/fediverse/Compose';

function checkForDrafts() {
  if (!hasDraft('main')) return;
  
  const age = getDraftAge('main');
  const draft = loadDraft('main');
  
  if (!draft || !age) return;
  
  // Don't recover very old drafts automatically
  if (age > 86400000) { // 24 hours
    const shouldRecover = confirm(
      `You have a draft from ${formatAge(age)}. Recover it?`
    );
    
    if (!shouldRecover) {
      deleteDraft('main');
      return;
    }
  }
  
  // Restore draft
  restoreComposer(draft);
}

function formatAge(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  
  if (days > 0) return `${days} day(s) ago`;
  if (hours > 0) return `${hours} hour(s) ago`;
  return 'recently';
}

// Run on page load
window.addEventListener('DOMContentLoaded', checkForDrafts);
```

### **Example 4: Multiple Draft Management**

Manage drafts for multiple composers:

```typescript
import { saveDraft, loadDraft, listDrafts, deleteDraft } from '@greater/fediverse/Compose';

class DraftRegistry {
  private composers = new Map<string, any>();
  
  registerComposer(id: string, composer: any) {
    this.composers.set(id, composer);
    
    // Load draft if exists
    const draft = loadDraft(id);
    if (draft) {
      composer.restore(draft);
    }
  }
  
  saveDraft(id: string, content: any) {
    const draft = {
      content,
      savedAt: Date.now()
    };
    
    return saveDraft(draft, id);
  }
  
  clearDraft(id: string) {
    return deleteDraft(id);
  }
  
  getAllDrafts() {
    const keys = listDrafts();
    return keys.map(key => ({
      key,
      draft: loadDraft(key)
    }));
  }
  
  clearAllDrafts() {
    const keys = listDrafts();
    keys.forEach(key => deleteDraft(key));
    return keys.length;
  }
}

// Usage
const registry = new DraftRegistry();
registry.registerComposer('main', mainComposer);
registry.registerComposer('reply', replyComposer);
```

### **Example 5: Draft Sync Across Tabs**

Listen for draft changes from other tabs:

```typescript
import { loadDraft, saveDraft } from '@greater/fediverse/Compose';

// Listen for storage events from other tabs
window.addEventListener('storage', (event) => {
  if (!event.key?.startsWith('greater-compose-draft-')) return;
  
  const draftKey = event.key.replace('greater-compose-draft-', '');
  
  if (event.newValue) {
    // Draft was saved/updated
    const draft = loadDraft(draftKey);
    console.log('Draft updated in another tab:', draft);
    
    // Optionally update current composer
    updateComposer(draftKey, draft);
  } else {
    // Draft was deleted
    console.log('Draft deleted in another tab');
    clearComposer(draftKey);
  }
});

function updateComposer(key: string, draft: Draft | null) {
  // Update your composer UI
}

function clearComposer(key: string) {
  // Clear your composer UI
}
```

### **Example 6: Draft Export/Import**

Export drafts for backup or transfer:

```typescript
import { listDrafts, loadDraft, saveDraft } from '@greater/fediverse/Compose';

function exportDrafts(): string {
  const keys = listDrafts();
  const drafts = keys.map(key => ({
    key,
    draft: loadDraft(key)
  }));
  
  return JSON.stringify(drafts, null, 2);
}

function importDrafts(json: string): number {
  try {
    const drafts = JSON.parse(json);
    let imported = 0;
    
    for (const { key, draft } of drafts) {
      if (draft && saveDraft(draft, key)) {
        imported++;
      }
    }
    
    return imported;
  } catch (error) {
    console.error('Failed to import drafts:', error);
    return 0;
  }
}

// Usage
const backup = exportDrafts();
localStorage.setItem('draft-backup', backup);

// Later, restore
const backup = localStorage.getItem('draft-backup');
if (backup) {
  const count = importDrafts(backup);
  console.log(`Imported ${count} draft(s)`);
}
```

### **Example 7: Draft Statistics**

Analyze draft usage:

```typescript
import { listDrafts, loadDraft, getDraftAge } from '@greater/fediverse/Compose';

interface DraftStats {
  total: number;
  oldest: number | null;
  newest: number | null;
  avgAge: number;
  totalSize: number;
}

function getDraftStatistics(): DraftStats {
  const keys = listDrafts();
  const drafts = keys.map(key => ({
    key,
    draft: loadDraft(key),
    age: getDraftAge(key)
  })).filter(d => d.draft && d.age !== null);
  
  if (drafts.length === 0) {
    return {
      total: 0,
      oldest: null,
      newest: null,
      avgAge: 0,
      totalSize: 0
    };
  }
  
  const ages = drafts.map(d => d.age!);
  const sizes = drafts.map(d => 
    JSON.stringify(d.draft).length
  );
  
  return {
    total: drafts.length,
    oldest: Math.max(...ages),
    newest: Math.min(...ages),
    avgAge: ages.reduce((a, b) => a + b, 0) / ages.length,
    totalSize: sizes.reduce((a, b) => a + b, 0)
  };
}

// Usage
const stats = getDraftStatistics();
console.log(`
  Total drafts: ${stats.total}
  Oldest: ${(stats.oldest! / 86400000).toFixed(1)} days
  Newest: ${(stats.newest! / 60000).toFixed(0)} minutes
  Average age: ${(stats.avgAge / 3600000).toFixed(1)} hours
  Total size: ${(stats.totalSize / 1024).toFixed(1)} KB
`);
```

### **Example 8: Migration from Old Format**

Migrate from an old draft format:

```typescript
import { saveDraft, listDrafts } from '@greater/fediverse/Compose';

interface OldDraft {
  text: string;
  timestamp: number;
  privacy?: string;
}

function migrateDrafts() {
  const oldKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('old-draft-')
  );
  
  let migrated = 0;
  
  for (const oldKey of oldKeys) {
    try {
      const oldDraft: OldDraft = JSON.parse(
        localStorage.getItem(oldKey)!
      );
      
      const newDraft = {
        content: oldDraft.text,
        visibility: oldDraft.privacy || 'public',
        savedAt: oldDraft.timestamp
      };
      
      const newKey = oldKey.replace('old-draft-', '');
      
      if (saveDraft(newDraft, newKey)) {
        localStorage.removeItem(oldKey);
        migrated++;
      }
    } catch (error) {
      console.error(`Failed to migrate ${oldKey}:`, error);
    }
  }
  
  return migrated;
}

// Run once on app upgrade
const migrated = migrateDrafts();
if (migrated > 0) {
  console.log(`Migrated ${migrated} draft(s) to new format`);
}
```

---

## 🔒 Security Considerations

### **localStorage Limits**

Be aware of localStorage size limits (~5-10MB per domain):

```typescript
function getLocalStorageUsage(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

const usage = getLocalStorageUsage();
const limit = 5 * 1024 * 1024; // 5MB

if (usage > limit * 0.9) {
  console.warn('localStorage nearly full, cleaning up...');
  cleanupOldDrafts();
}
```

### **Sensitive Data**

Never store sensitive data in drafts:

```typescript
// ❌ DON'T
const draft = {
  content: postText,
  password: userPassword,
  apiKey: secretKey
};

// ✅ DO
const draft = {
  content: postText,
  visibility: 'private'
};
```

### **XSS Prevention**

Sanitize draft content before rendering:

```typescript
import DOMPurify from 'dompurify';

const draft = loadDraft('main');
if (draft) {
  const cleanContent = DOMPurify.sanitize(draft.content);
  editor.value = cleanContent;
}
```

---

## 🧪 Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  listDrafts,
  cleanupOldDrafts,
  hasDraft,
  getDraftAge,
  formatDraftAge
} from '@greater/fediverse/Compose';

describe('DraftManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveDraft', () => {
    it('saves draft to localStorage', () => {
      const draft = {
        content: 'Test content',
        savedAt: Date.now()
      };

      expect(saveDraft(draft, 'test')).toBe(true);
      expect(localStorage.getItem('greater-compose-draft-test')).toBeTruthy();
    });

    it('overwrites existing draft', () => {
      saveDraft({ content: 'First', savedAt: Date.now() }, 'test');
      saveDraft({ content: 'Second', savedAt: Date.now() }, 'test');

      const loaded = loadDraft('test');
      expect(loaded?.content).toBe('Second');
    });
  });

  describe('loadDraft', () => {
    it('loads saved draft', () => {
      const draft = {
        content: 'Test',
        savedAt: Date.now()
      };

      saveDraft(draft, 'test');
      const loaded = loadDraft('test');

      expect(loaded).toEqual(draft);
    });

    it('returns null for non-existent draft', () => {
      expect(loadDraft('nonexistent')).toBeNull();
    });
  });

  describe('deleteDraft', () => {
    it('deletes draft', () => {
      saveDraft({ content: 'Test', savedAt: Date.now() }, 'test');
      expect(deleteDraft('test')).toBe(true);
      expect(loadDraft('test')).toBeNull();
    });
  });

  describe('listDrafts', () => {
    it('lists all draft keys', () => {
      saveDraft({ content: '1', savedAt: Date.now() }, 'draft1');
      saveDraft({ content: '2', savedAt: Date.now() }, 'draft2');

      const keys = listDrafts();
      expect(keys).toContain('draft1');
      expect(keys).toContain('draft2');
      expect(keys).toHaveLength(2);
    });
  });

  describe('cleanupOldDrafts', () => {
    it('removes old drafts', () => {
      const oldDraft = {
        content: 'Old',
        savedAt: Date.now() - 8 * 86400000 // 8 days ago
      };

      const newDraft = {
        content: 'New',
        savedAt: Date.now()
      };

      saveDraft(oldDraft, 'old');
      saveDraft(newDraft, 'new');

      const deleted = cleanupOldDrafts();
      expect(deleted).toBe(1);
      expect(loadDraft('old')).toBeNull();
      expect(loadDraft('new')).not.toBeNull();
    });
  });

  describe('getDraftAge', () => {
    it('returns draft age in milliseconds', () => {
      const savedAt = Date.now() - 60000; // 1 minute ago
      saveDraft({ content: 'Test', savedAt }, 'test');

      const age = getDraftAge('test');
      expect(age).toBeGreaterThan(59000);
      expect(age).toBeLessThan(61000);
    });
  });

  describe('formatDraftAge', () => {
    it('formats age correctly', () => {
      const tests = [
        { ago: 30000, expected: 'just now' },
        { ago: 120000, expected: '2 minutes ago' },
        { ago: 3600000, expected: '1 hour ago' },
        { ago: 86400000, expected: '1 day ago' }
      ];

      for (const test of tests) {
        saveDraft({ content: 'Test', savedAt: Date.now() - test.ago }, 'test');
        const formatted = formatDraftAge('test');
        expect(formatted).toBe(test.expected);
      }
    });
  });
});
```

---

## 🔗 Related

- [Compose.DraftSaver Component](./DraftSaver.md) - Component using this utility
- [Compose.Root](./Root.md) - Main compose component

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [localStorage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## ❓ FAQ

### **Q: What happens if localStorage is full?**

`saveDraft()` returns `false`. Implement cleanup or notify the user.

### **Q: Can I change the expiration time?**

Yes, modify the `MAX_DRAFT_AGE` constant in the source (default: 7 days).

### **Q: Are drafts synced across devices?**

No, localStorage is per-device. For cross-device sync, store drafts on your server.

### **Q: How do I handle localStorage unavailability?**

Always check `isLocalStorageAvailable()` first and provide fallback behavior.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

