# Search Components

**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Components**: 7 compound components

---

## 📋 Overview

The Search component group provides a complete, production-ready search system for ActivityPub/Fediverse applications. Built using the compound component pattern, it offers full-text search, AI semantic search, real-time autocomplete, result filtering, search history, and comprehensive result displays for accounts, notes/posts, and hashtags.

### **Architecture**

The Search system follows a compound component architecture with shared context:

```
Search.Root (Context Provider)
├── Search.Bar (Search input with autocomplete)
├── Search.Filters (Result type filtering)
├── Search.Results (Results container)
│   ├── Search.ActorResult (Account result item)
│   ├── Search.NoteResult (Post result item)
│   └── Search.TagResult (Hashtag result item)
```

All child components access shared state through Svelte Context, ensuring type safety and consistent behavior across the search system.

---

## 🎯 Key Features

### **✅ Full-Text Search**
- Search across accounts (users, profiles)
- Search posts/notes content
- Search hashtags and topics
- Multi-field relevance scoring
- Fuzzy matching support
- Wildcard and phrase searches

### **✅ AI Semantic Search**
- Optional semantic/vector search
- Natural language queries
- Intent understanding
- Context-aware results
- Similarity scoring

### **✅ Real-time Autocomplete**
- Debounced search (300ms default)
- Type-ahead suggestions
- Minimum query length (2-3 chars)
- Keyboard navigation
- Recent searches integration
- Trending suggestions

### **✅ Advanced Filtering**
- Filter by result type (all, actors, notes, tags)
- Date range filtering
- Sort options (relevance, recent, popular)
- Federated vs. local search
- Account-specific filters (following only)

### **✅ Search History**
- Recent searches (localStorage)
- Quick access to previous queries
- Clear history functionality
- Search suggestions based on history
- Privacy-conscious storage

### **✅ Result Types**
- **Actors**: User accounts with avatars, bios, follower counts
- **Notes**: Posts with content preview, engagement metrics
- **Tags**: Hashtags with post counts, trending indicators

### **✅ Accessibility First**
- ARIA labels and roles
- Keyboard shortcuts (/, Ctrl+K)
- Screen reader announcements
- Focus management
- High contrast mode compatible

### **✅ Performance Optimized**
- Debounced API calls
- Request cancellation
- Cached results
- Virtualized result lists
- Lazy loading
- Efficient re-renders

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

Or with pnpm:

```bash
pnpm add @equaltoai/greater-components-fediverse
```

---

## 🚀 Quick Start

### **Basic Search**

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';

  const handlers = {
    onSearch: async (options) => {
      const response = await fetch(`/api/search?q=${options.query}&type=${options.type || 'all'}`);
      return await response.json();
    },
    onActorClick: (actor) => {
      window.location.href = `/@${actor.username}`;
    },
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    },
    onTagClick: (tag) => {
      window.location.href = `/tags/${tag.name}`;
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar placeholder="Search posts, people, and tags..." />
  <Search.Results />
</Search.Root>
```

### **With Filtering**

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';

  const handlers = {
    onSearch: async (options) => {
      const params = new URLSearchParams({
        q: options.query,
        type: options.type || 'all',
        semantic: options.semantic ? 'true' : 'false',
        following: options.following ? 'true' : 'false'
      });
      
      const response = await fetch(`/api/search?${params}`);
      return await response.json();
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar showSemantic={true} showRecent={true} />
  <Search.Filters />
  <Search.Results />
</Search.Root>
```

### **With Custom Results**

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';

  const handlers = {
    onSearch: async (options) => {
      // API call
      return {
        actors: [...],
        notes: [...],
        tags: [...],
        total: 0
      };
    },
    onActorClick: (actor) => {
      console.log('Actor clicked:', actor);
    },
    onNoteClick: (note) => {
      console.log('Note clicked:', note);
    },
    onTagClick: (tag) => {
      console.log('Tag clicked:', tag);
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar />
  <Search.Filters />
  
  <Search.Results>
    {#snippet empty()}
      <div class="custom-empty">
        <h3>No results found</h3>
        <p>Try different keywords or check your spelling</p>
      </div>
    {/snippet}
  </Search.Results>
</Search.Root>
```

---

## 🔍 Search Types

### **Actors (Accounts/Users)**

Search for people and accounts:
- Username matching (`@alice`, `alice`)
- Display name matching
- Bio/description content
- Domain matching for federated accounts

**Result includes**:
- Avatar
- Display name
- Username
- Bio/description
- Follower count
- Following status
- Verification badge

### **Notes (Posts/Statuses)**

Search for posts and content:
- Content text matching
- Hashtag matching within posts
- Author matching
- Date-based filtering

**Result includes**:
- Author information
- Content preview (truncated)
- Engagement metrics (likes, boosts, replies)
- Timestamp
- Media indicators

### **Tags (Hashtags)**

Search for topics and hashtags:
- Hashtag name matching
- Trending indicators
- Usage statistics

**Result includes**:
- Tag name
- Post count
- Trending status
- Usage trend graph (optional)

---

## 🎨 Search Features

### **Debouncing**

```typescript
// Default debounce: 300ms
// Prevents excessive API calls while typing
const handlers = {
  onSearch: debounce(async (options) => {
    // API call
  }, 300)
};
```

### **Request Cancellation**

```typescript
let abortController: AbortController | null = null;

const handlers = {
  onSearch: async (options) => {
    // Cancel previous request
    if (abortController) {
      abortController.abort();
    }
    
    abortController = new AbortController();
    
    const response = await fetch('/api/search', {
      signal: abortController.signal
    });
    
    return await response.json();
  }
};
```

### **Keyboard Shortcuts**

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    function handleKeyPress(event: KeyboardEvent) {
      // Focus search with '/' key
      if (event.key === '/' && !isInputFocused()) {
        event.preventDefault();
        focusSearch();
      }
      
      // Focus search with Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        focusSearch();
      }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });
</script>
```

---

## 🧩 Component Reference

### **Available Components**

| Component | Description | Documentation |
|-----------|-------------|---------------|
| `Search.Root` | Context provider and container | [Root.md](./Root.md) |
| `Search.Bar` | Search input with autocomplete | [Bar.md](./Bar.md) |
| `Search.Filters` | Result type filter tabs | [Filters.md](./Filters.md) |
| `Search.Results` | Results container | [Results.md](./Results.md) |
| `Search.ActorResult` | Account search result item | [ActorResult.md](./ActorResult.md) |
| `Search.NoteResult` | Post search result item | [NoteResult.md](./NoteResult.md) |
| `Search.TagResult` | Hashtag search result item | [TagResult.md](./TagResult.md) |

---

## 🎨 Theming & Customization

### **CSS Custom Properties**

```css
:root {
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  
  /* Border colors */
  --border-color: #e1e8ed;
  
  /* Text colors */
  --text-primary: #0f1419;
  --text-secondary: #536471;
  
  /* Theme colors */
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  
  /* Status colors */
  --error-color: #dc2626;
  --success-color: #16a34a;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #15202b;
    --bg-secondary: #192734;
    --bg-hover: #1e2732;
    --border-color: #2f3336;
    --text-primary: #f7f9fa;
    --text-secondary: #8b98a5;
  }
}
```

### **Custom Styling Example**

```svelte
<style>
  :global(.search-root) {
    max-width: 800px;
    margin: 0 auto;
  }
  
  :global(.search-bar) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
  
  :global(.search-results) {
    margin-top: 1rem;
  }
  
  :global(.actor-result),
  :global(.note-result),
  :global(.tag-result) {
    transition: transform 0.2s;
  }
  
  :global(.actor-result:hover),
  :global(.note-result:hover),
  :global(.tag-result:hover) {
    transform: translateX(4px);
  }
</style>
```

---

## ♿ Accessibility

### **ARIA Support**

All components include proper ARIA attributes:
- `role="search"` on search container
- `role="searchbox"` on input
- `role="combobox"` for autocomplete
- `role="listbox"` for results
- `role="option"` for result items
- `aria-label` for screen readers
- `aria-busy` during loading
- `aria-expanded` for dropdowns

### **Keyboard Navigation**

| Key | Action |
|-----|--------|
| `/` | Focus search input |
| `Ctrl+K` / `Cmd+K` | Focus search input |
| `Enter` | Execute search / select result |
| `Escape` | Clear search / close dropdown |
| `Arrow Down` | Navigate to next result |
| `Arrow Up` | Navigate to previous result |
| `Tab` | Navigate between filters |

### **Screen Reader Announcements**

```svelte
<script lang="ts">
  import { announce } from '@equaltoai/greater-components-utils/a11y';
  
  const handlers = {
    onSearch: async (options) => {
      announce('Searching...');
      const results = await performSearch(options);
      announce(`Found ${results.total} results`);
      return results;
    }
  };
</script>
```

---

## ⚡ Performance Best Practices

### **Debounce Search Input**

```typescript
import { debounce } from '@equaltoai/greater-components-utils';

const debouncedSearch = debounce(async (query: string) => {
  const results = await fetch(`/api/search?q=${query}`);
  return await results.json();
}, 300);
```

### **Cancel Previous Requests**

```typescript
let controller: AbortController | null = null;

async function search(query: string) {
  if (controller) {
    controller.abort();
  }
  
  controller = new AbortController();
  
  const response = await fetch(`/api/search?q=${query}`, {
    signal: controller.signal
  });
  
  return await response.json();
}
```

### **Cache Results**

```typescript
const cache = new Map<string, SearchResults>();

async function search(query: string) {
  const cacheKey = query.toLowerCase().trim();
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const results = await performSearch(query);
  cache.set(cacheKey, results);
  
  return results;
}
```

### **Virtualize Long Result Lists**

```svelte
<script lang="ts">
  import { VirtualList } from '@equaltoai/greater-components-primitives';
  import { Search } from '@equaltoai/greater-components-fediverse';
  
  const handlers = {
    onSearch: async (options) => {
      // Large result set
      return await fetch(`/api/search?q=${options.query}`).then(r => r.json());
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar />
  
  {#if results.actors.length > 100}
    <VirtualList items={results.actors} estimateSize={80}>
      {#snippet item(actor)}
        <Search.ActorResult {actor} />
      {/snippet}
    </VirtualList>
  {:else}
    <Search.Results />
  {/if}
</Search.Root>
```

---

## 🔒 Security Considerations

### **Input Sanitization**

Always sanitize search queries:

```typescript
function sanitizeQuery(query: string): string {
  // Remove potentially dangerous characters
  return query
    .replace(/[<>\"']/g, '')
    .trim()
    .slice(0, 500); // Limit length
}

const handlers = {
  onSearch: async (options) => {
    const sanitized = sanitizeQuery(options.query);
    return await performSearch(sanitized);
  }
};
```

### **Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
import { RateLimiter } from '@equaltoai/greater-components-utils';

const searchLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000 // 20 searches per minute
});

const handlers = {
  onSearch: async (options) => {
    if (!searchLimiter.check()) {
      throw new Error('Too many searches. Please wait a moment.');
    }
    
    return await performSearch(options.query);
  }
};
```

### **Content Security**

Sanitize all user-generated content in results:

```typescript
import DOMPurify from 'dompurify';

const sanitizedResults = {
  actors: results.actors.map(actor => ({
    ...actor,
    bio: DOMPurify.sanitize(actor.bio || '')
  })),
  notes: results.notes.map(note => ({
    ...note,
    content: DOMPurify.sanitize(note.content)
  }))
};
```

### **Privacy Protection**

- Don't log full search queries (GDPR compliance)
- Implement search history opt-out
- Clear sensitive data from localStorage
- Use HTTPS for all search API calls
- Validate all result data before display

---

## 🧪 Testing

### **Unit Tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.Bar', () => {
  it('calls onSearch when typing', async () => {
    const onSearch = vi.fn();
    const handlers = { onSearch };
    
    render(Search.Root, { props: { handlers } });
    
    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'fediverse' } });
    
    // Debounce delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'fediverse' })
    );
  });
  
  it('displays search results', async () => {
    const handlers = {
      onSearch: async () => ({
        actors: [{ id: '1', username: 'alice', displayName: 'Alice' }],
        notes: [],
        tags: [],
        total: 1
      })
    };
    
    render(Search.Root, { props: { handlers } });
    
    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'alice' } });
    
    await screen.findByText('Alice');
    expect(screen.getByText('@alice')).toBeInTheDocument();
  });
});
```

### **Integration Tests**

Test files available:
- `packages/fediverse/tests/Search/Bar.test.ts`
- `packages/fediverse/tests/Search/Results.test.ts`
- `packages/fediverse/tests/Search/ActorResult.test.ts`
- `packages/fediverse/tests/Search/NoteResult.test.ts`
- `packages/fediverse/tests/Search/TagResult.test.ts`
- `packages/fediverse/tests/Search/Filters.test.ts`

---

## 📚 Examples

### **Complete Search System**

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import { onMount } from 'svelte';
  import type { SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let searching = $state(false);
  let error = $state<string | null>(null);

  const handlers = {
    onSearch: async (options) => {
      searching = true;
      error = null;
      
      try {
        const params = new URLSearchParams({
          q: options.query,
          limit: (options.limit || 20).toString()
        });
        
        if (options.type && options.type !== 'all') {
          params.set('type', options.type);
        }
        
        if (options.semantic) {
          params.set('semantic', 'true');
        }
        
        if (options.following) {
          params.set('following', 'true');
        }
        
        const response = await fetch(`/api/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const results: SearchResults = await response.json();
        
        // Track search analytics
        trackSearch(options.query, results.total);
        
        return results;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Search failed';
        throw err;
      } finally {
        searching = false;
      }
    },
    
    onActorClick: (actor) => {
      window.location.href = `/@${actor.username}`;
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    },
    
    onTagClick: (tag) => {
      window.location.href = `/tags/${tag.name}`;
    },
    
    onFollow: async (actorId: string) => {
      try {
        await fetch(`/api/accounts/${actorId}/follow`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        alert('Followed successfully!');
      } catch (err) {
        alert('Failed to follow');
      }
    },
    
    onClear: () => {
      console.log('Search cleared');
    }
  };

  function trackSearch(query: string, resultCount: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        result_count: resultCount
      });
    }
  }

  // Keyboard shortcut
  onMount(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === '/' && !isInputFocused()) {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.search-bar__input')?.focus();
      }
    }
    
    function isInputFocused(): boolean {
      return document.activeElement?.tagName === 'INPUT' ||
             document.activeElement?.tagName === 'TEXTAREA';
    }
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });
</script>

<div class="search-container">
  <header class="search-header">
    <h1>Search</h1>
    <p class="search-hint">
      Press <kbd>/</kbd> to focus search
    </p>
  </header>

  <Search.Root {handlers}>
    <div class="search-box">
      <Search.Bar 
        placeholder="Search posts, people, and tags..."
        showSemantic={true}
        showRecent={true}
        autofocus={false}
      />
    </div>
    
    <Search.Filters class="search-filters" />
    
    <div class="search-results-container">
      {#if error}
        <div class="search-error">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>{error}</p>
          <button onclick={() => error = null}>Dismiss</button>
        </div>
      {:else}
        <Search.Results />
      {/if}
    </div>
  </Search.Root>
</div>

<style>
  .search-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .search-header {
    margin-bottom: 2rem;
  }
  
  .search-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
  }
  
  .search-hint {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .search-hint kbd {
    padding: 0.125rem 0.375rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .search-box {
    margin-bottom: 1rem;
  }
  
  .search-filters {
    margin-bottom: 1rem;
  }
  
  .search-results-container {
    min-height: 400px;
  }
  
  .search-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    text-align: center;
  }
  
  .search-error svg {
    width: 3rem;
    height: 3rem;
    color: var(--error-color);
  }
  
  .search-error p {
    margin: 0;
    color: var(--text-primary);
  }
  
  .search-error button {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
```

---

## 🔗 Related Documentation

- [Search.Root](./Root.md) - Root context provider
- [Search.Bar](./Bar.md) - Search input component
- [Search.Filters](./Filters.md) - Filter tabs
- [Search.Results](./Results.md) - Results container
- [Search.ActorResult](./ActorResult.md) - Account result item
- [Search.NoteResult](./NoteResult.md) - Post result item
- [Search.TagResult](./TagResult.md) - Hashtag result item

---

## 📖 See Also

- [Notifications Components](../Notifications/README.md) - Notification system
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Profile Components](../Profile/README.md) - User profile components
- [ActivityPub Specification](https://www.w3.org/TR/activitypub/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-your-data.html)
- [Vector Search Guide](https://www.pinecone.io/learn/vector-search/)

---

**Need Help?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)

