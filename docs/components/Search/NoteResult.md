# Search.NoteResult

**Component**: Post/Status Search Result Item  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 13 passing tests

---

## 📋 Overview

`Search.NoteResult` displays an individual note (post/status) search result with author information, content preview, query highlighting, engagement statistics, and timestamps. It provides a compact yet informative view of posts matching the search query with intelligent text highlighting.

### **Key Features**:
- ✅ Author avatar and display name
- ✅ Username and timestamp display
- ✅ Content preview with 3-line truncation
- ✅ Query term highlighting in content
- ✅ Engagement stats (replies, reblogs, likes)
- ✅ Relative timestamp formatting
- ✅ Click handler for navigation
- ✅ Responsive layout
- ✅ Hover states
- ✅ Accessibility support
- ✅ Customizable styling
- ✅ HTML content sanitization

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
      const response = await fetch(`/api/search?q=${options.query}&type=notes`);
      return await response.json();
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    }
  };
</script>

<Search.Root {handlers}>
  <Search.Bar placeholder="Search posts..." />
  <Search.Results />
</Search.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `note` | `SearchNote` | - | **Yes** | Note data to display |
| `class` | `string` | `''` | No | Additional CSS class |

### **SearchNote Interface**

```typescript
interface SearchNote {
  /**
   * Unique identifier for the note
   */
  id: string;

  /**
   * Content/text of the note (HTML allowed)
   */
  content: string;

  /**
   * Author information
   */
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };

  /**
   * Creation timestamp (ISO 8601)
   */
  createdAt: string;

  /**
   * Optional reply count
   */
  repliesCount?: number;

  /**
   * Optional reblog/boost count
   */
  reblogsCount?: number;

  /**
   * Optional like/favorite count
   */
  likesCount?: number;

  /**
   * Optional media attachments
   */
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    preview?: string;
  }>;

  /**
   * Optional content warning
   */
  contentWarning?: string;

  /**
   * Optional visibility setting
   */
  visibility?: 'public' | 'unlisted' | 'followers' | 'direct';
}
```

---

## 📤 Events

The component handles events through the Search context:

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onNoteClick` | `(note: SearchNote)` | Called when result is clicked |

---

## 💡 Examples

### Example 1: Basic Note Results with Query Highlighting

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults } from '@equaltoai/greater-components-fediverse/types';

  let totalNotes = $state(0);
  let averageEngagement = $state(0);

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const params = new URLSearchParams({
        q: options.query,
        type: 'notes',
        limit: '20'
      });
      
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
        
        totalNotes = results.notes.length;
        
        // Calculate average engagement
        if (results.notes.length > 0) {
          const totalEngagement = results.notes.reduce((sum, note) => {
            return sum + (note.repliesCount || 0) + (note.reblogsCount || 0) + (note.likesCount || 0);
          }, 0);
          averageEngagement = Math.round(totalEngagement / results.notes.length);
        }
        
        console.log('Note search completed:', {
          query: options.query,
          totalNotes,
          averageEngagement
        });
        
        return results;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    },
    
    onNoteClick: (note) => {
      console.log('Navigate to post:', note);
      window.location.href = `/status/${note.id}`;
    }
  };
</script>

<div class="note-search">
  <h2>Search Posts</h2>
  
  {#if totalNotes > 0}
    <div class="search-stats">
      <span>Found <strong>{totalNotes}</strong> post{totalNotes === 1 ? '' : 's'}</span>
      <span>Avg. engagement: <strong>{averageEngagement}</strong></span>
    </div>
  {/if}

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search posts and content..." />
    <Search.Results />
  </Search.Root>
</div>

<style>
  .note-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .search-stats {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .search-stats strong {
    color: var(--primary-color);
    font-weight: 700;
  }
</style>
```

### Example 2: With Content Warnings and Media Previews

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults, SearchNote } from '@equaltoai/greater-components-fediverse/types';

  let expandedWarnings = $state<Set<string>>(new Set());

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      expandedWarnings.clear(); // Reset on new search
      
      const params = new URLSearchParams({
        q: options.query,
        type: 'notes',
        limit: '20',
        include: 'attachments,warnings'
      });
      
      const response = await fetch(`/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      return await response.json();
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    }
  };

  function toggleWarning(noteId: string) {
    if (expandedWarnings.has(noteId)) {
      expandedWarnings.delete(noteId);
    } else {
      expandedWarnings.add(noteId);
    }
    expandedWarnings = new Set(expandedWarnings);
  }

  function getMediaIcon(type: string): string {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📎';
    }
  }
</script>

<div class="enhanced-note-search">
  <h2>Content Search</h2>
  <p class="description">
    Results may include content warnings and media attachments
  </p>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search with media and CW support..." />
    
    <div class="custom-note-results">
      {#snippet noteResult(note: SearchNote)}
        <article class="enhanced-note-result">
          <div class="note-result__avatar">
            {#if note.author.avatar}
              <img src={note.author.avatar} alt={note.author.displayName} loading="lazy" />
            {:else}
              <div class="note-result__avatar-placeholder">
                {note.author.displayName[0]?.toUpperCase()}
              </div>
            {/if}
          </div>
          
          <div class="note-result__content">
            <div class="note-result__header">
              <span class="note-result__author">{note.author.displayName}</span>
              <span class="note-result__username">@{note.author.username}</span>
              <span class="note-result__separator">·</span>
              <time class="note-result__time">
                {new Date(note.createdAt).toLocaleDateString()}
              </time>
            </div>
            
            {#if note.contentWarning}
              <div class="content-warning-box">
                <div class="content-warning-header">
                  <span class="warning-icon">⚠️</span>
                  <span class="warning-text">{note.contentWarning}</span>
                </div>
                <button 
                  class="warning-toggle"
                  onclick={() => toggleWarning(note.id)}
                >
                  {expandedWarnings.has(note.id) ? 'Hide' : 'Show'} content
                </button>
              </div>
            {/if}
            
            {#if !note.contentWarning || expandedWarnings.has(note.id)}
              <div class="note-result__text">{@html note.content}</div>
              
              {#if note.attachments && note.attachments.length > 0}
                <div class="note-result__media">
                  {#each note.attachments as attachment}
                    <div class="media-badge">
                      {getMediaIcon(attachment.type)} {attachment.type}
                    </div>
                  {/each}
                </div>
              {/if}
            {/if}
            
            <div class="note-result__stats">
              {#if note.repliesCount !== undefined}
                <span>💬 {note.repliesCount}</span>
              {/if}
              {#if note.reblogsCount !== undefined}
                <span>🔁 {note.reblogsCount}</span>
              {/if}
              {#if note.likesCount !== undefined}
                <span>❤️ {note.likesCount}</span>
              {/if}
            </div>
          </div>
        </article>
      {/snippet}
    </div>
  </Search.Root>
</div>

<style>
  .enhanced-note-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .description {
    margin: 0 0 1.5rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .custom-note-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .enhanced-note-result {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .enhanced-note-result:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .note-result__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .note-result__avatar img,
  .note-result__avatar-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .note-result__avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
  
  .note-result__content {
    flex: 1;
    min-width: 0;
  }
  
  .note-result__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
  }
  
  .note-result__author {
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .note-result__username,
  .note-result__separator,
  .note-result__time {
    color: var(--text-secondary);
  }
  
  .content-warning-box {
    padding: 1rem;
    margin-bottom: 1rem;
    background: rgba(245, 158, 11, 0.1);
    border: 2px solid #f59e0b;
    border-radius: 8px;
  }
  
  .content-warning-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .warning-icon {
    font-size: 1.25rem;
  }
  
  .warning-text {
    font-weight: 700;
    color: #d97706;
  }
  
  .warning-toggle {
    padding: 0.5rem 1rem;
    background: #f59e0b;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .warning-toggle:hover {
    background: #d97706;
  }
  
  .note-result__text {
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  
  .note-result__media {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .media-badge {
    padding: 0.375rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .note-result__stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

### Example 3: With Engagement Sorting and Viral Post Badges

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults, SearchNote } from '@equaltoai/greater-components-fediverse/types';

  let sortBy = $state<'relevance' | 'engagement' | 'recent'>('relevance');
  let viralThreshold = $state(1000); // Total engagement threshold

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const params = new URLSearchParams({
        q: options.query,
        type: 'notes',
        limit: '20',
        sort: sortBy
      });
      
      const response = await fetch(`/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const results: SearchResults = await response.json();
      
      // Sort results if needed
      if (sortBy === 'engagement') {
        results.notes.sort((a, b) => {
          const aTotal = (a.repliesCount || 0) + (a.reblogsCount || 0) + (a.likesCount || 0);
          const bTotal = (b.repliesCount || 0) + (b.reblogsCount || 0) + (b.likesCount || 0);
          return bTotal - aTotal;
        });
      }
      
      return results;
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    }
  };

  function getTotalEngagement(note: SearchNote): number {
    return (note.repliesCount || 0) + (note.reblogsCount || 0) + (note.likesCount || 0);
  }

  function isViral(note: SearchNote): boolean {
    return getTotalEngagement(note) >= viralThreshold;
  }

  function getEngagementLevel(engagement: number): string {
    if (engagement >= 10000) return 'legendary';
    if (engagement >= 5000) return 'viral';
    if (engagement >= 1000) return 'popular';
    if (engagement >= 100) return 'active';
    return 'normal';
  }

  function getEngagementColor(level: string): string {
    switch (level) {
      case 'legendary': return '#f59e0b';
      case 'viral': return '#ef4444';
      case 'popular': return '#8b5cf6';
      case 'active': return '#3b82f6';
      default: return '#6b7280';
    }
  }
</script>

<div class="engagement-sorted-search">
  <div class="search-header">
    <h2>Trending Posts Search</h2>
    
    <div class="sort-controls">
      <label for="sortBy">Sort by:</label>
      <select id="sortBy" bind:value={sortBy}>
        <option value="relevance">Relevance</option>
        <option value="engagement">Engagement</option>
        <option value="recent">Most Recent</option>
      </select>
    </div>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Find trending posts..." />
    
    <div class="sorted-note-results">
      {#snippet noteResult(note: SearchNote)}
        {@const engagement = getTotalEngagement(note)}
        {@const level = getEngagementLevel(engagement)}
        {@const isViralPost = isViral(note)}
        
        <article 
          class="engagement-note-result"
          class:viral={isViralPost}
          style="--engagement-color: {getEngagementColor(level)}"
        >
          {#if isViralPost}
            <div class="viral-badge">
              🔥 Viral
            </div>
          {/if}
          
          <div class="engagement-indicator" title="{level} ({engagement} total)">
            <div 
              class="engagement-bar"
              style="width: {Math.min((engagement / 10000) * 100, 100)}%"
            ></div>
          </div>
          
          <div class="note-result__main">
            <div class="note-result__avatar">
              {#if note.author.avatar}
                <img src={note.author.avatar} alt={note.author.displayName} loading="lazy" />
              {:else}
                <div class="note-result__avatar-placeholder">
                  {note.author.displayName[0]?.toUpperCase()}
                </div>
              {/if}
            </div>
            
            <div class="note-result__content">
              <div class="note-result__header">
                <span class="note-result__author">{note.author.displayName}</span>
                <span class="note-result__username">@{note.author.username}</span>
                <span class="note-result__separator">·</span>
                <time class="note-result__time">
                  {new Date(note.createdAt).toLocaleDateString()}
                </time>
                <span class="engagement-level" style="color: {getEngagementColor(level)}">
                  {level.toUpperCase()}
                </span>
              </div>
              
              <div class="note-result__text">{@html note.content}</div>
              
              <div class="note-result__stats">
                <span class="stat-item stat-item--replies">
                  <strong>{note.repliesCount || 0}</strong> replies
                </span>
                <span class="stat-item stat-item--reblogs">
                  <strong>{note.reblogsCount || 0}</strong> reblogs
                </span>
                <span class="stat-item stat-item--likes">
                  <strong>{note.likesCount || 0}</strong> likes
                </span>
              </div>
            </div>
          </div>
        </article>
      {/snippet}
    </div>
  </Search.Root>
</div>

<style>
  .engagement-sorted-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
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
  
  .sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .sort-controls label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .sort-controls select {
    padding: 0.5rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
  }
  
  .sorted-note-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .engagement-note-result {
    position: relative;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .engagement-note-result:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .engagement-note-result.viral {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
  
  .viral-badge {
    position: absolute;
    top: -12px;
    right: 1rem;
    padding: 0.375rem 0.75rem;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  .engagement-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--bg-secondary);
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  
  .engagement-bar {
    height: 100%;
    background: var(--engagement-color);
    transition: width 0.5s ease-out;
  }
  
  .note-result__main {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .note-result__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .note-result__avatar img,
  .note-result__avatar-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .note-result__avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
  
  .note-result__content {
    flex: 1;
    min-width: 0;
  }
  
  .note-result__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
    flex-wrap: wrap;
  }
  
  .note-result__author {
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .note-result__username,
  .note-result__separator,
  .note-result__time {
    color: var(--text-secondary);
  }
  
  .engagement-level {
    padding: 0.125rem 0.5rem;
    background: rgba(var(--engagement-color), 0.1);
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  .note-result__text {
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .note-result__stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .stat-item strong {
    color: var(--text-primary);
    font-weight: 700;
  }
</style>
```

### Example 4: With Thread Context and Conversation Previews

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults, SearchNote } from '@equaltoai/greater-components-fediverse/types';

  interface NoteWithContext extends SearchNote {
    inReplyTo?: {
      id: string;
      author: string;
      preview: string;
    };
    hasReplies?: boolean;
  }

  let showThreadContext = $state(true);

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const params = new URLSearchParams({
        q: options.query,
        type: 'notes',
        limit: '20',
        include_context: showThreadContext ? 'true' : 'false'
      });
      
      const response = await fetch(`/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      return await response.json();
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    }
  };

  function goToThread(noteId: string) {
    window.location.href = `/status/${noteId}/thread`;
  }
</script>

<div class="threaded-note-search">
  <div class="search-options">
    <h2>Conversation Search</h2>
    
    <label class="thread-toggle">
      <input type="checkbox" bind:checked={showThreadContext} />
      <span>Show thread context</span>
    </label>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search conversations..." />
    
    <div class="threaded-note-results">
      {#snippet noteResult(note: NoteWithContext)}
        <article class="threaded-note-result">
          {#if note.inReplyTo}
            <div class="reply-context">
              <div class="thread-line"></div>
              <div class="reply-info">
                <span class="reply-icon">↩️</span>
                <span class="reply-text">
                  Replying to <strong>@{note.inReplyTo.author}</strong>:
                </span>
              </div>
              <blockquote class="parent-preview">
                {note.inReplyTo.preview}
              </blockquote>
            </div>
          {/if}
          
          <div class="note-result__main">
            <div class="note-result__avatar">
              {#if note.author.avatar}
                <img src={note.author.avatar} alt={note.author.displayName} loading="lazy" />
              {:else}
                <div class="note-result__avatar-placeholder">
                  {note.author.displayName[0]?.toUpperCase()}
                </div>
              {/if}
            </div>
            
            <div class="note-result__content">
              <div class="note-result__header">
                <span class="note-result__author">{note.author.displayName}</span>
                <span class="note-result__username">@{note.author.username}</span>
                <span class="note-result__separator">·</span>
                <time class="note-result__time">
                  {new Date(note.createdAt).toLocaleDateString()}
                </time>
              </div>
              
              <div class="note-result__text">{@html note.content}</div>
              
              <div class="note-result__actions">
                <div class="note-result__stats">
                  {#if note.repliesCount}
                    <span>💬 {note.repliesCount}</span>
                  {/if}
                  {#if note.reblogsCount}
                    <span>🔁 {note.reblogsCount}</span>
                  {/if}
                  {#if note.likesCount}
                    <span>❤️ {note.likesCount}</span>
                  {/if}
                </div>
                
                {#if note.hasReplies || note.inReplyTo}
                  <button 
                    class="thread-btn"
                    onclick={(e) => {
                      e.stopPropagation();
                      goToThread(note.id);
                    }}
                  >
                    View thread →
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </article>
      {/snippet}
    </div>
  </Search.Root>
</div>

<style>
  .threaded-note-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .search-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .search-options h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .thread-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .thread-toggle input {
    cursor: pointer;
  }
  
  .threaded-note-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .threaded-note-result {
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .threaded-note-result:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .reply-context {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
  
  .thread-line {
    position: absolute;
    left: 0.5rem;
    top: 1.5rem;
    bottom: -1rem;
    width: 2px;
    background: var(--border-color);
  }
  
  .reply-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .reply-icon {
    font-size: 1rem;
  }
  
  .reply-text strong {
    color: var(--primary-color);
    font-weight: 700;
  }
  
  .parent-preview {
    margin: 0;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border-left: 3px solid var(--primary-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--text-secondary);
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .note-result__main {
    display: flex;
    gap: 1rem;
  }
  
  .note-result__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .note-result__avatar img,
  .note-result__avatar-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .note-result__avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
  
  .note-result__content {
    flex: 1;
    min-width: 0;
  }
  
  .note-result__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
  }
  
  .note-result__author {
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .note-result__username,
  .note-result__separator,
  .note-result__time {
    color: var(--text-secondary);
  }
  
  .note-result__text {
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .note-result__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .note-result__stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .thread-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .thread-btn:hover {
    background: var(--primary-color);
    color: white;
  }
</style>
```

### Example 5: With Bookmarking and Read Later Features

```svelte
<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import type { SearchOptions, SearchResults, SearchNote } from '@equaltoai/greater-components-fediverse/types';

  let bookmarkedNotes = $state<Set<string>>(new Set());
  let readLater = $state<SearchNote[]>([]);

  const handlers = {
    onSearch: async (options: SearchOptions): Promise<SearchResults> => {
      const params = new URLSearchParams({
        q: options.query,
        type: 'notes',
        limit: '20'
      });
      
      const response = await fetch(`/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      return await response.json();
    },
    
    onNoteClick: (note) => {
      window.location.href = `/status/${note.id}`;
    }
  };

  async function toggleBookmark(note: SearchNote, event: MouseEvent) {
    event.stopPropagation();
    
    const isBookmarked = bookmarkedNotes.has(note.id);
    
    try {
      const response = await fetch(`/api/notes/${note.id}/bookmark`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        if (isBookmarked) {
          bookmarkedNotes.delete(note.id);
        } else {
          bookmarkedNotes.add(note.id);
        }
        bookmarkedNotes = new Set(bookmarkedNotes);
        
        // Save to localStorage
        localStorage.setItem('bookmarked-notes', JSON.stringify(Array.from(bookmarkedNotes)));
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  }

  function addToReadLater(note: SearchNote, event: MouseEvent) {
    event.stopPropagation();
    
    if (!readLater.some(n => n.id === note.id)) {
      readLater = [...readLater, note];
      localStorage.setItem('read-later', JSON.stringify(readLater));
      alert('Added to Read Later');
    }
  }

  function exportBookmarks() {
    const data = {
      bookmarks: Array.from(bookmarkedNotes),
      readLater: readLater,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Load from localStorage on mount
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('bookmarked-notes');
      if (saved) {
        bookmarkedNotes = new Set(JSON.parse(saved));
      }
      
      const savedReadLater = localStorage.getItem('read-later');
      if (savedReadLater) {
        readLater = JSON.parse(savedReadLater);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }
</script>

<div class="bookmarkable-search">
  <div class="search-header">
    <h2>Search & Save Posts</h2>
    
    <div class="saved-stats">
      <span>📚 {bookmarkedNotes.size} bookmarked</span>
      <span>🕐 {readLater.length} read later</span>
      <button class="export-btn" onclick={exportBookmarks}>
        Export
      </button>
    </div>
  </div>

  <Search.Root {handlers}>
    <Search.Bar placeholder="Search posts to save..." />
    
    <div class="bookmarkable-note-results">
      {#snippet noteResult(note: SearchNote)}
        <article class="bookmarkable-note-result">
          <div class="note-result__main">
            <div class="note-result__avatar">
              {#if note.author.avatar}
                <img src={note.author.avatar} alt={note.author.displayName} loading="lazy" />
              {:else}
                <div class="note-result__avatar-placeholder">
                  {note.author.displayName[0]?.toUpperCase()}
                </div>
              {/if}
            </div>
            
            <div class="note-result__content">
              <div class="note-result__header">
                <span class="note-result__author">{note.author.displayName}</span>
                <span class="note-result__username">@{note.author.username}</span>
                <span class="note-result__separator">·</span>
                <time class="note-result__time">
                  {new Date(note.createdAt).toLocaleDateString()}
                </time>
              </div>
              
              <div class="note-result__text">{@html note.content}</div>
              
              <div class="note-result__stats">
                {#if note.repliesCount}
                  <span>💬 {note.repliesCount}</span>
                {/if}
                {#if note.reblogsCount}
                  <span>🔁 {note.reblogsCount}</span>
                {/if}
                {#if note.likesCount}
                  <span>❤️ {note.likesCount}</span>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="note-result__actions">
            <button 
              class="action-btn bookmark-btn"
              class:bookmarked={bookmarkedNotes.has(note.id)}
              onclick={(e) => toggleBookmark(note, e)}
              title={bookmarkedNotes.has(note.id) ? 'Remove bookmark' : 'Bookmark'}
            >
              {bookmarkedNotes.has(note.id) ? '⭐' : '☆'}
            </button>
            
            <button 
              class="action-btn read-later-btn"
              onclick={(e) => addToReadLater(note, e)}
              title="Add to Read Later"
            >
              🕐
            </button>
          </div>
        </article>
      {/snippet}
    </div>
  </Search.Root>
</div>

<style>
  .bookmarkable-search {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
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
  
  .saved-stats {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .export-btn {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .export-btn:hover {
    background: var(--primary-color-dark);
    transform: scale(1.05);
  }
  
  .bookmarkable-note-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .bookmarkable-note-result {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .bookmarkable-note-result:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .note-result__main {
    display: flex;
    gap: 1rem;
    flex: 1;
  }
  
  .note-result__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .note-result__avatar img,
  .note-result__avatar-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .note-result__avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
  
  .note-result__content {
    flex: 1;
    min-width: 0;
  }
  
  .note-result__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
  }
  
  .note-result__author {
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .note-result__username,
  .note-result__separator,
  .note-result__time {
    color: var(--text-secondary);
  }
  
  .note-result__text {
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .note-result__stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .note-result__actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 1rem;
  }
  
  .action-btn {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .action-btn:hover {
    background: var(--bg-hover);
    transform: scale(1.1);
  }
  
  .bookmark-btn.bookmarked {
    background: #fef3c7;
    border-color: #f59e0b;
  }
  
  @media (max-width: 640px) {
    .search-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
    
    .saved-stats {
      justify-content: space-between;
    }
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.note-result` | Root result container |
| `.note-result__avatar` | Author avatar container |
| `.note-result__avatar-placeholder` | Avatar fallback |
| `.note-result__content` | Content container |
| `.note-result__header` | Author/time header |
| `.note-result__author` | Author display name |
| `.note-result__username` | Author username |
| `.note-result__separator` | Visual separator |
| `.note-result__time` | Relative timestamp |
| `.note-result__text` | Post content |
| `.note-result__stats` | Engagement statistics |

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

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<article role="article" aria-label="Post by Alice">
  <img alt="Alice's profile picture" />
  <time datetime="2025-10-12T10:00:00Z">2h ago</time>
</article>
```

### **Keyboard Navigation**

- Tab through results
- Enter to open post
- Proper semantic HTML

---

## 🔒 Security

### **Content Sanitization**

All HTML content is sanitized before rendering:

```typescript
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(note.content);
```

---

## ⚡ Performance

- **Image lazy loading**: `loading="lazy"`
- **Content truncation**: 3-line clamp
- **Query highlighting**: Optimized regex

---

## 🧪 Testing

Test file: `packages/fediverse/tests/Search/NoteResult.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Search } from '@equaltoai/greater-components-fediverse';

describe('Search.NoteResult', () => {
  it('renders note content with highlighting', () => {
    const note = {
      id: '1',
      content: 'Hello world',
      author: { id: 'u1', username: 'alice', displayName: 'Alice' },
      createdAt: '2025-10-12T10:00:00Z'
    };
    
    render(Search.NoteResult, { props: { note } });
    
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Search.Root](./Root.md) - Context provider
- [Search.Bar](./Bar.md) - Search input
- [Search.Results](./Results.md) - Results container
- [Search.ActorResult](./ActorResult.md) - Account result
- [Search.TagResult](./TagResult.md) - Hashtag result
- [Search.Filters](./Filters.md) - Result type filters

---

## 📚 See Also

- [Search README](./README.md) - Component overview
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Status Components](../Status/README.md) - Status display components

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)
