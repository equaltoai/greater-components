# Search.Bar

**Component**: Search Input  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 16 passing tests

---

## 📋 Overview

`Search.Bar` is a sophisticated search input component with autocomplete, recent searches, semantic search toggle, and keyboard shortcuts. It handles debouncing, input validation, and provides a polished user experience with dropdown suggestions and clear functionality.

### **Key Features**:
- ✅ Debounced search input (300ms default)
- ✅ Real-time autocomplete dropdown
- ✅ Recent searches display (localStorage)
- ✅ Semantic/AI search toggle
- ✅ Clear button for quick reset
- ✅ Search button with loading state
- ✅ Keyboard navigation (Enter, Escape, Arrow keys)
- ✅ Minimum query length enforcement
- ✅ Input validation and sanitization
- ✅ Focus management
- ✅ Accessibility-first design
- ✅ Responsive layout

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';
  
  const handlers = {
    onSearch: async (options) => {
      const response = await fetch(`/api/search?q=${options.query}`);
      return await response.json();
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar placeholder="Search posts, people, and tags..." />
  <Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `placeholder` | `string` | `'Search...'` | No | Input placeholder text |
| `showSemantic` | `boolean` | `true` | No | Show semantic search toggle button |
| `showRecent` | `boolean` | `true` | No | Show recent searches dropdown |
| `autofocus` | `boolean` | `false` | No | Auto-focus input on mount |
| `class` | `string` | `''` | No | Additional CSS class |

---

## 💡 Examples

### Example 1: Basic Search Input

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';

  const handlers = {
    onSearch: async (options) => {
      console.log('Searching for:', options.query);
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(options.query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return await response.json();
    }
  };
</script>

<div class="search-container">
  <Search.Root {handlers}>
    <Search.Bar 
      placeholder="What are you looking for?"
      autofocus={true}
    />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .search-container {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
```

### Example 2: With Semantic Search Toggle

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';

  let searchMode = $state<'standard' | 'semantic'>('standard');

  const handlers = {
    onSearch: async (options) => {
      searchMode = options.semantic ? 'semantic' : 'standard';
      
      const endpoint = options.semantic 
        ? '/api/search/semantic'
        : '/api/search';
      
      const response = await fetch(`${endpoint}?q=${encodeURIComponent(options.query)}`);
      return await response.json();
    }
  };
</script>

<div class="semantic-search">
  <div class="mode-indicator">
    {#if searchMode === 'semantic'}
      <span class="mode-badge mode-badge--ai">
        🧠 AI-Powered Search
      </span>
    {:else}
      <span class="mode-badge mode-badge--standard">
        🔍 Standard Search
      </span>
    {/if}
  </div>

  <Search.Root {handlers}>
    <Search.Bar 
      placeholder={searchMode === 'semantic' 
        ? "Ask a question or describe what you're looking for..."
        : "Search posts, people, and tags..."}
      showSemantic={true}
    />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .semantic-search {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .mode-indicator {
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .mode-badge--standard {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
  
  .mode-badge--ai {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
</style>
```

### Example 3: With Recent Searches

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';
  import { onMount } from 'svelte';

  let recentSearches = $state<string[]>([]);

  const handlers = {
    onSearch: async (options) => {
      // Add to recent searches
      if (!recentSearches.includes(options.query)) {
        recentSearches = [options.query, ...recentSearches.slice(0, 9)];
        saveRecentSearches();
      }
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(options.query)}`);
      return await response.json();
    }
  };

  function saveRecentSearches() {
    try {
      localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }

  function loadRecentSearches() {
    try {
      const stored = localStorage.getItem('recent-searches');
      if (stored) {
        recentSearches = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }

  function clearRecentSearches() {
    recentSearches = [];
    localStorage.removeItem('recent-searches');
  }

  onMount(() => {
    loadRecentSearches();
  });
</script>

<div class="search-with-history">
  <div class="search-header">
    <h2>Search</h2>
    {#if recentSearches.length > 0}
      <button 
        class="clear-history-btn"
        onclick={clearRecentSearches}
      >
        Clear History
      </button>
    {/if}
  </div>

  <Search.Root {handlers}>
    <Search.Bar 
      placeholder="Search..."
      showRecent={true}
    />
    <Search.Results />
  </Search.Root>
  
  {#if recentSearches.length > 0}
    <div class="recent-searches-display">
      <h3>Your Recent Searches</h3>
      <ul>
        {#each recentSearches as search}
          <li>{search}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .search-with-history {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .search-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .clear-history-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .clear-history-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .recent-searches-display {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
  }
  
  .recent-searches-display h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .recent-searches-display ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .recent-searches-display li {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .recent-searches-display li:last-child {
    border-bottom: none;
  }
</style>
```

### Example 4: With Keyboard Shortcuts

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';
  import { onMount } from 'svelte';

  let searchInput: HTMLElement | null = null;
  let shortcutUsed = $state(false);

  const handlers = {
    onSearch: async (options) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(options.query)}`);
      return await response.json();
    }
  };

  function focusSearch() {
    const input = document.querySelector<HTMLInputElement>('.search-bar__input');
    if (input) {
      input.focus();
      shortcutUsed = true;
      setTimeout(() => {
        shortcutUsed = false;
      }, 2000);
    }
  }

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
    
    function isInputFocused(): boolean {
      const active = document.activeElement;
      return active?.tagName === 'INPUT' || 
             active?.tagName === 'TEXTAREA' ||
             active?.getAttribute('contenteditable') === 'true';
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });
</script>

<div class="keyboard-search">
  <div class="search-help">
    <h2>Search</h2>
    <div class="keyboard-hints">
      <span class="hint">
        Press <kbd>/</kbd> or <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to search
      </span>
    </div>
  </div>
  
  {#if shortcutUsed}
    <div class="shortcut-notification">
      ✨ Keyboard shortcut activated!
    </div>
  {/if}

  <Search.Root {handlers}>
    <Search.Bar placeholder="Type to search or use keyboard shortcuts..." />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .keyboard-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .search-help {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .search-help h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .keyboard-hints {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .hint kbd {
    padding: 0.125rem 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
  }
  
  .shortcut-notification {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    animation: slideIn 0.3s ease-out;
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

### Example 5: Advanced with Validation and Filtering

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';

  let queryLength = $state(0);
  let validationMessage = $state('');
  let searchCount = $state(0);

  const MIN_QUERY_LENGTH = 2;
  const MAX_QUERY_LENGTH = 100;

  const handlers = {
    onSearch: async (options) => {
      queryLength = options.query.length;
      
      // Validation
      if (options.query.length < MIN_QUERY_LENGTH) {
        validationMessage = `Query must be at least ${MIN_QUERY_LENGTH} characters`;
        throw new Error(validationMessage);
      }
      
      if (options.query.length > MAX_QUERY_LENGTH) {
        validationMessage = `Query must be less than ${MAX_QUERY_LENGTH} characters`;
        throw new Error(validationMessage);
      }
      
      // Sanitize query
      const sanitized = options.query
        .replace(/[<>\"']/g, '')
        .trim();
      
      if (sanitized !== options.query) {
        validationMessage = 'Special characters were removed from your query';
      } else {
        validationMessage = '';
      }
      
      searchCount++;
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(sanitized)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    }
  };
</script>

<div class="validated-search">
  <div class="search-stats">
    <div class="stat">
      <span class="stat-label">Searches:</span>
      <span class="stat-value">{searchCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Query length:</span>
      <span class="stat-value" class:stat-value--warning={queryLength > MAX_QUERY_LENGTH}>
        {queryLength}/{MAX_QUERY_LENGTH}
      </span>
    </div>
  </div>
  
  {#if validationMessage}
    <div class="validation-message">
      ℹ️ {validationMessage}
    </div>
  {/if}

  <Search.Root {handlers}>
    <Search.Bar 
      placeholder={`Search (min ${MIN_QUERY_LENGTH} chars)...`}
      showSemantic={true}
      showRecent={true}
    />
    <Search.Results />
  </Search.Root>
  
  <div class="search-tips">
    <h4>Search Tips</h4>
    <ul>
      <li>Use quotes for exact phrases: "fediverse network"</li>
      <li>Use @ to search for users: @alice</li>
      <li>Use # to search for hashtags: #activitypub</li>
      <li>Enable AI search for natural language queries</li>
    </ul>
  </div>
</div>

<style>
  .validated-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .search-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  .stat-value--warning {
    color: var(--error-color);
  }
  
  .validation-message {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: rgba(29, 155, 240, 0.1);
    border: 1px solid rgba(29, 155, 240, 0.3);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-primary);
  }
  
  .search-tips {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
  }
  
  .search-tips h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .search-tips ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .search-tips li {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.search-bar` | Root search bar container |
| `.search-bar__input-wrapper` | Input wrapper with icons |
| `.search-bar__icon` | Search icon |
| `.search-bar__input` | Text input element |
| `.search-bar__clear` | Clear button |
| `.search-bar__semantic` | Semantic search toggle button |
| `.search-bar__semantic--active` | Active semantic toggle |
| `.search-bar__submit` | Search submit button |
| `.search-bar__spinner` | Loading spinner |
| `.search-bar__recent` | Recent searches dropdown |
| `.search-bar__recent-header` | Recent searches header |
| `.search-bar__recent-clear` | Clear history button |
| `.search-bar__recent-list` | Recent searches list |
| `.search-bar__recent-item` | Individual recent search |

### **CSS Custom Properties**

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  --border-color: #e1e8ed;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
}
```

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<input
  type="text"
  role="searchbox"
  aria-label="Search"
  aria-describedby="search-help"
/>
```

### **Keyboard Navigation**

| Key | Action |
|-----|--------|
| `Enter` | Execute search |
| `Escape` | Clear input / close dropdown |
| `Arrow Down` | Navigate recent searches |
| `Arrow Up` | Navigate recent searches |

---

## 🔒 Security

### **Input Sanitization**

```typescript
function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>\"']/g, '')
    .trim()
    .slice(0, 500);
}
```

---

## ⚡ Performance

- Automatic debouncing (300ms)
- Request cancellation
- Efficient re-renders
- Lazy dropdown rendering

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/Bar.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Search } from '@greater/fediverse';

describe('Search.Bar', () => {
  it('renders search input', () => {
    render(Search.Bar);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
  
  it('calls onSearch when typing', async () => {
    const onSearch = vi.fn();
    render(Search.Root, { props: { handlers: { onSearch } } });
    
    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'test' } });
    
    await new Promise(resolve => setTimeout(resolve, 350));
    
    expect(onSearch).toHaveBeenCalled();
  });
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Filters](./Filters.md) - Filter tabs
- [Search.Results](./Results.md) - Results container

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Notifications Components](../Notifications/README.md)

