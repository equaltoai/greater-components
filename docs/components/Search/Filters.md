# Search.Filters

**Component**: Result Type Filters  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 10 passing tests

---

## 📋 Overview

`Search.Filters` provides tabbed filtering for search results by type (All, People, Posts, Tags). It displays filter options with result counts, highlights the active filter, and integrates seamlessly with the Search context to update displayed results when filters change.

### **Key Features**:
- ✅ Four filter types (All, People, Posts, Tags)
- ✅ Dynamic result count badges
- ✅ Active state highlighting
- ✅ Click to filter results
- ✅ Keyboard navigation support
- ✅ ARIA attributes for accessibility
- ✅ Smooth transitions
- ✅ Responsive design (scrollable on mobile)
- ✅ Context-aware state management
- ✅ Event handler integration
- ✅ Customizable styling

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';

  const handlers = {
    onSearch: async (options) => {
      const params = new URLSearchParams({
        q: options.query,
        type: options.type || 'all'
      });
      
      const response = await fetch(`/api/search?${params}`);
      return await response.json();
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar placeholder="Search..." />
  <Search.Filters />
  <Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Additional CSS class for styling |

### **Filter Types**

The component provides four filter options:

```typescript
type SearchResultType = 'all' | 'actors' | 'notes' | 'tags';
```

### **Filter Configuration**

Each filter displays:
- **Label**: Display text ("All", "People", "Posts", "Tags")
- **Count Badge**: Number of results for that type (when available)
- **Active State**: Visual indicator when selected

---

## 📤 Events

The component automatically updates the search context when a filter is clicked, triggering the `setType` method which may cause a new search to be executed with the selected filter.

---

## 💡 Examples

### Example 1: Basic Filter Implementation

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let currentFilter = $state<'all' | 'actors' | 'notes' | 'tags'>('all');
  let resultCounts = $state({ all: 0, actors: 0, notes: 0, tags: 0 });

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      currentFilter = options.type || 'all';
      
      const params = new URLSearchParams({
        q: options.query,
        limit: '20'
      });
      
      if (options.type && options.type !== 'all') {
        params.set('type', options.type);
      }
      
      try {
        const response = await fetch(`/api/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }
        
        const results: SearchResults = await response.json();
        
        // Update result counts
        resultCounts = {
          all: results.total,
          actors: results.actors.length,
          notes: results.notes.length,
          tags: results.tags.length
        };
        
        console.log('Filter:', currentFilter, 'Results:', resultCounts);
        
        return results;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
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
    }
  };
</script>

<div class="search-with-filters">
  <h2>Search Results</h2>
  
  <div class="current-filter-info">
    <span>Viewing: <strong>{currentFilter === 'all' ? 'All Results' : currentFilter === 'actors' ? 'People' : currentFilter === 'notes' ? 'Posts' : 'Tags'}</strong></span>
    <span class="result-count">
      {currentFilter === 'all' ? resultCounts.all : resultCounts[currentFilter]} results
    </span>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search posts, people, and tags..." />
    <Search.Filters />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .search-with-filters {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .current-filter-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .current-filter-info strong {
    color: var(--text-primary);
    text-transform: capitalize;
  }
  
  .result-count {
    font-weight: 600;
    color: var(--primary-color);
  }
</style>
```

### Example 2: With Persistent Filter State (localStorage)

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import { onMount } from 'svelte';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let savedFilter = $state<'all' | 'actors' | 'notes' | 'tags'>('all');
  let filterHistory = $state<Array<{ filter: string; timestamp: Date; resultCount: number }>>([]);

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const newFilter = options.type || 'all';
      
      // Save filter preference
      localStorage.setItem('search-filter-preference', newFilter);
      savedFilter = newFilter;
      
      const params = new URLSearchParams({
        q: options.query,
        limit: '20'
      });
      
      if (options.type && options.type !== 'all') {
        params.set('type', options.type);
      }
      
      try {
        const response = await fetch(`/api/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        const results: SearchResults = await response.json();
        
        // Add to filter history
        filterHistory = [
          {
            filter: newFilter,
            timestamp: new Date(),
            resultCount: results.total
          },
          ...filterHistory.slice(0, 9)
        ];
        
        // Save history
        try {
          localStorage.setItem('search-filter-history', JSON.stringify(filterHistory));
        } catch (error) {
          console.error('Failed to save filter history:', error);
        }
        
        // Track analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'search_filter', {
            event_category: 'search',
            event_label: newFilter,
            value: results.total
          });
        }
        
        return results;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    }
  };

  onMount(() => {
    // Load saved filter preference
    const saved = localStorage.getItem('search-filter-preference');
    if (saved) {
      savedFilter = saved as typeof savedFilter;
    }
    
    // Load filter history
    try {
      const history = localStorage.getItem('search-filter-history');
      if (history) {
        filterHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Failed to load filter history:', error);
    }
  });

  function clearFilterHistory() {
    filterHistory = [];
    localStorage.removeItem('search-filter-history');
  }
</script>

<div class="persistent-filters">
  <div class="filters-header">
    <h2>Search</h2>
    <div class="saved-filter">
      <span class="saved-filter-label">Preferred filter:</span>
      <span class="saved-filter-value">{savedFilter}</span>
    </div>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search..." />
    <Search.Filters />
    <Search.Results />
  </Search.Root>
  
  {#if filterHistory.length > 0}
    <div class="filter-history">
      <div class="filter-history-header">
        <h3>Filter History</h3>
        <button 
          class="clear-history-btn"
          onclick={clearFilterHistory}
        >
          Clear
        </button>
      </div>
      
      <ul class="filter-history-list">
        {#each filterHistory as entry}
          <li>
            <span class="history-filter">{entry.filter}</span>
            <span class="history-results">{entry.resultCount} results</span>
            <span class="history-time">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .persistent-filters {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .filters-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .saved-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  
  .saved-filter-label {
    color: var(--text-secondary);
  }
  
  .saved-filter-value {
    font-weight: 700;
    color: var(--primary-color);
    text-transform: capitalize;
  }
  
  .filter-history {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
  }
  
  .filter-history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .filter-history-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .clear-history-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .clear-history-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .filter-history-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .filter-history-list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .filter-history-list li:last-child {
    border-bottom: none;
  }
  
  .history-filter {
    flex: 0 0 auto;
    padding: 0.25rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  
  .history-results {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .history-time {
    flex: 0 0 auto;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

### Example 3: With URL Query Parameters

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  // Get current filter from URL
  const currentFilter = $derived(
    ($page.url.searchParams.get('type') as 'all' | 'actors' | 'notes' | 'tags') || 'all'
  );

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const newFilter = options.type || 'all';
      
      // Update URL with new filter
      const url = new URL(window.location.href);
      
      if (options.query) {
        url.searchParams.set('q', options.query);
      }
      
      if (newFilter === 'all') {
        url.searchParams.delete('type');
      } else {
        url.searchParams.set('type', newFilter);
      }
      
      // Navigate without page reload
      goto(url.pathname + url.search, { replaceState: true });
      
      // Perform search
      const params = new URLSearchParams({
        q: options.query,
        limit: '20'
      });
      
      if (newFilter !== 'all') {
        params.set('type', newFilter);
      }
      
      const response = await fetch(`/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      return await response.json();
    }
  };

  // Generate shareable links for each filter
  function getFilterLink(filter: 'all' | 'actors' | 'notes' | 'tags'): string {
    const url = new URL(window.location.href);
    
    if (filter === 'all') {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', filter);
    }
    
    return url.pathname + url.search;
  }

  async function copyCurrentFilterLink() {
    const link = window.location.origin + window.location.pathname + window.location.search;
    
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link');
    }
  }
</script>

<div class="url-filtered-search">
  <div class="search-header">
    <h2>Search</h2>
    <button 
      class="share-filter-btn"
      onclick={copyCurrentFilterLink}
      title="Share this filtered view"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
      </svg>
      Share
    </button>
  </div>
  
  <div class="filter-info">
    <p>
      Current filter: <strong>{currentFilter}</strong>
    </p>
    <p class="share-hint">
      You can share this filtered view using the Share button above
    </p>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search..." />
    <Search.Filters />
    <Search.Results />
  </Search.Root>
  
  <div class="filter-links">
    <h3>Direct Filter Links</h3>
    <ul>
      <li>
        <a href={getFilterLink('all')}>All Results</a>
      </li>
      <li>
        <a href={getFilterLink('actors')}>People Only</a>
      </li>
      <li>
        <a href={getFilterLink('notes')}>Posts Only</a>
      </li>
      <li>
        <a href={getFilterLink('tags')}>Tags Only</a>
      </li>
    </ul>
  </div>
</div>

<style>
  .url-filtered-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .search-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .share-filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .share-filter-btn svg {
    width: 1rem;
    height: 1rem;
  }
  
  .share-filter-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(29, 155, 240, 0.3);
  }
  
  .filter-info {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  
  .filter-info p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .filter-info strong {
    color: var(--text-primary);
    text-transform: capitalize;
  }
  
  .share-hint {
    font-size: 0.75rem !important;
    color: var(--text-secondary);
    opacity: 0.8;
  }
  
  .filter-links {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
  }
  
  .filter-links h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .filter-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .filter-links li {
    margin: 0.5rem 0;
  }
  
  .filter-links a {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-color);
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .filter-links a:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateX(4px);
  }
</style>
```

### Example 4: With Filter Analytics and Insights

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let filterStats = $state({
    all: { searches: 0, totalResults: 0, avgResults: 0 },
    actors: { searches: 0, totalResults: 0, avgResults: 0 },
    notes: { searches: 0, totalResults: 0, avgResults: 0 },
    tags: { searches: 0, totalResults: 0, avgResults: 0 }
  });

  let mostUsedFilter = $derived(() => {
    const entries = Object.entries(filterStats);
    const sorted = entries.sort((a, b) => b[1].searches - a[1].searches);
    return sorted[0]?.[0] || 'all';
  });

  let bestPerformingFilter = $derived(() => {
    const entries = Object.entries(filterStats);
    const sorted = entries.sort((a, b) => b[1].avgResults - a[1].avgResults);
    return sorted[0]?.[0] || 'all';
  });

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const filterType = options.type || 'all';
      
      const params = new URLSearchParams({
        q: options.query,
        limit: '20'
      });
      
      if (filterType !== 'all') {
        params.set('type', filterType);
      }
      
      try {
        const response = await fetch(`/api/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        const results: SearchResults = await response.json();
        
        // Update filter statistics
        filterStats[filterType].searches++;
        filterStats[filterType].totalResults += results.total;
        filterStats[filterType].avgResults = 
          filterStats[filterType].totalResults / filterStats[filterType].searches;
        
        // Save stats to localStorage
        try {
          localStorage.setItem('search-filter-stats', JSON.stringify(filterStats));
        } catch (error) {
          console.error('Failed to save filter stats:', error);
        }
        
        return results;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    }
  };

  function resetStats() {
    filterStats = {
      all: { searches: 0, totalResults: 0, avgResults: 0 },
      actors: { searches: 0, totalResults: 0, avgResults: 0 },
      notes: { searches: 0, totalResults: 0, avgResults: 0 },
      tags: { searches: 0, totalResults: 0, avgResults: 0 }
    };
    localStorage.removeItem('search-filter-stats');
  }

  // Load stats on mount
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('search-filter-stats');
      if (saved) {
        filterStats = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load filter stats:', error);
    }
  }
</script>

<div class="analytics-filters">
  <div class="analytics-panel">
    <div class="analytics-header">
      <h3>Filter Analytics</h3>
      <button class="reset-stats-btn" onclick={resetStats}>
        Reset
      </button>
    </div>
    
    <div class="insights-grid">
      <div class="insight-card">
        <div class="insight-label">Most Used Filter</div>
        <div class="insight-value">{mostUsedFilter}</div>
      </div>
      
      <div class="insight-card">
        <div class="insight-label">Best Performing</div>
        <div class="insight-value">{bestPerformingFilter}</div>
      </div>
      
      <div class="insight-card">
        <div class="insight-label">Total Searches</div>
        <div class="insight-value">
          {Object.values(filterStats).reduce((sum, f) => sum + f.searches, 0)}
        </div>
      </div>
    </div>
    
    <div class="stats-table">
      <table>
        <thead>
          <tr>
            <th>Filter</th>
            <th>Searches</th>
            <th>Total Results</th>
            <th>Avg Results</th>
          </tr>
        </thead>
        <tbody>
          {#each Object.entries(filterStats) as [filter, stats]}
            <tr>
              <td class="filter-name">{filter}</td>
              <td>{stats.searches}</td>
              <td>{stats.totalResults}</td>
              <td>{stats.avgResults.toFixed(1)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search to see analytics..." />
    <Search.Filters />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .analytics-filters {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .analytics-panel {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
  }
  
  .analytics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .analytics-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .reset-stats-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reset-stats-btn:hover {
    background: var(--bg-hover);
    color: var(--error-color);
    border-color: var(--error-color);
  }
  
  .insights-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .insight-card {
    padding: 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: center;
  }
  
  .insight-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
  
  .insight-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-transform: capitalize;
  }
  
  .stats-table {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: var(--bg-primary);
  }
  
  th {
    padding: 0.75rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--border-color);
  }
  
  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .filter-name {
    font-weight: 600;
    text-transform: capitalize;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr:hover {
    background: var(--bg-hover);
  }
  
  @media (max-width: 640px) {
    .insights-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### Example 5: Custom Filter Design with Icons

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let activeFilter = $state<'all' | 'actors' | 'notes' | 'tags'>('all');
  let resultCounts = $state({ all: 0, actors: 0, notes: 0, tags: 0 });

  const filterConfig = {
    all: {
      label: 'All Results',
      icon: '🔍',
      color: '#6b7280',
      description: 'Search everything'
    },
    actors: {
      label: 'People',
      icon: '👤',
      color: '#3b82f6',
      description: 'Find users and accounts'
    },
    notes: {
      label: 'Posts',
      icon: '📝',
      color: '#8b5cf6',
      description: 'Search posts and content'
    },
    tags: {
      label: 'Tags',
      icon: '#️⃣',
      color: '#10b981',
      description: 'Discover hashtags and topics'
    }
  };

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      activeFilter = options.type || 'all';
      
      const params = new URLSearchParams({
        q: options.query,
        limit: '20'
      });
      
      if (options.type && options.type !== 'all') {
        params.set('type', options.type);
      }
      
      try {
        const response = await fetch(`/api/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        const results: SearchResults = await response.json();
        
        resultCounts = {
          all: results.total,
          actors: results.actors.length,
          notes: results.notes.length,
          tags: results.tags.length
        };
        
        return results;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    }
  };
</script>

<div class="custom-filters-design">
  <div class="filter-showcase">
    <h2>Enhanced Search Filters</h2>
    <p class="filter-description">
      Select a filter to refine your search results
    </p>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Start typing to search..." />
    
    <div class="custom-filters-wrapper">
      <Search.Filters class="enhanced-filters" />
      
      <!-- Custom filter cards overlay/supplement -->
      <div class="filter-cards">
        {#each Object.entries(filterConfig) as [key, config]}
          <button 
            class="filter-card"
            class:filter-card--active={activeFilter === key}
            style="--filter-color: {config.color}"
            onclick={() => {
              // This would trigger the filter change through the Search context
              console.log('Filter card clicked:', key);
            }}
          >
            <div class="filter-card__icon">{config.icon}</div>
            <div class="filter-card__content">
              <div class="filter-card__label">{config.label}</div>
              <div class="filter-card__description">{config.description}</div>
              {#if resultCounts[key] > 0}
                <div class="filter-card__count">
                  {resultCounts[key]} result{resultCounts[key] === 1 ? '' : 's'}
                </div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
    
    <Search.Results />
  </Search.Root>
</div>

<style>
  .custom-filters-design {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .filter-showcase {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .filter-showcase h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .filter-description {
    margin: 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  
  .custom-filters-wrapper {
    margin: 2rem 0;
  }
  
  /* Hide default filters when using custom cards */
  :global(.enhanced-filters) {
    display: none;
  }
  
  .filter-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .filter-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
  }
  
  .filter-card:hover {
    border-color: var(--filter-color);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .filter-card--active {
    border-color: var(--filter-color);
    background: linear-gradient(135deg, 
      rgba(var(--filter-color), 0.1) 0%, 
      rgba(var(--filter-color), 0.05) 100%
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .filter-card__icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .filter-card__content {
    width: 100%;
  }
  
  .filter-card__label {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .filter-card__description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }
  
  .filter-card__count {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--filter-color);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 9999px;
  }
  
  .filter-card--active .filter-card__count {
    animation: bounce 0.5s ease-out;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  @media (max-width: 640px) {
    .filter-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .filter-card {
      padding: 1rem;
    }
    
    .filter-card__icon {
      font-size: 2rem;
    }
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.search-filters` | Root filters container |
| `.search-filters__tab` | Individual filter tab button |
| `.search-filters__tab--active` | Active filter tab |
| `.search-filters__count` | Result count badge |

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
}
```

### **Custom Styling Example**

```svelte
<Search.Root {handlers}>
  <Search.Filters class="custom-filters" />
</Search.Root>

<style>
  :global(.custom-filters) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 0.5rem;
    border-radius: 12px;
  }
  
  :global(.custom-filters .search-filters__tab) {
    color: white;
  }
  
  :global(.custom-filters .search-filters__tab--active) {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
```

---

## ♿ Accessibility

### **ARIA Attributes**

The component includes proper ARIA attributes:

```html
<div role="tablist" aria-label="Search result filters">
  <button role="tab" aria-selected="true">All</button>
  <button role="tab" aria-selected="false">People</button>
  <!-- ... -->
</div>
```

### **Keyboard Navigation**

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate between filter tabs |
| `Arrow Left` / `Arrow Right` | Navigate tabs (with roving tabindex) |
| `Enter` / `Space` | Activate filter |
| `Home` | Jump to first filter |
| `End` | Jump to last filter |

### **Screen Reader Support**

- Announces current filter
- Announces result counts
- Announces filter changes
- Proper semantic HTML

---

## 🔒 Security

### **Input Validation**

Validate filter values to prevent injection:

```typescript
const validFilters = ['all', 'actors', 'notes', 'tags'];

function isValidFilter(filter: string): boolean {
  return validFilters.includes(filter);
}
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Memoize filtered results**
2. **Debounce filter changes** if triggering API calls
3. **Use CSS containment**
4. **Optimize re-renders**

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/Filters.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.Filters', () => {
  it('renders all filter tabs', () => {
    render(Search.Filters);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });
  
  it('updates active filter on click', async () => {
    const onSearch = vi.fn();
    render(Search.Root, { props: { handlers: { onSearch } } });
    
    const peopleTab = screen.getByText('People');
    await fireEvent.click(peopleTab);
    
    // Should have called onSearch with type: 'actors'
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'actors' })
    );
  });
  
  it('displays result counts', async () => {
    const onSearch = vi.fn().mockResolvedValue({
      actors: [{}, {}],
      notes: [{}, {}, {}],
      tags: [{}],
      total: 6
    });
    
    render(Search.Root, { props: { handlers: { onSearch } } });
    
    // Trigger search
    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'test' } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // actors count
      expect(screen.getByText('3')).toBeInTheDocument(); // notes count
      expect(screen.getByText('1')).toBeInTheDocument(); // tags count
    });
  });
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Bar](./Bar.md) - Search input
- [Search.Results](./Results.md) - Results container
- [Search.ActorResult](./ActorResult.md) - Account result
- [Search.NoteResult](./NoteResult.md) - Post result
- [Search.TagResult](./TagResult.md) - Hashtag result

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Notifications Components](../Notifications/README.md) - Notification system
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Profile Components](../Profile/README.md) - User profile components

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)

