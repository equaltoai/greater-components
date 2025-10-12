# Messages.Conversations

**Component**: Conversations List  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 89 passing tests

---

## 📋 Overview

`Messages.Conversations` displays a list of all direct message conversations for the current user. It provides an interactive interface for browsing conversations, viewing unread counts, and selecting conversations to view their messages.

### **Key Features**:
- ✅ Display all user conversations
- ✅ Sort by most recent activity
- ✅ Show unread message counts
- ✅ Display last message preview
- ✅ Show participant avatars and names
- ✅ Highlight selected conversation
- ✅ Real-time updates for new messages
- ✅ Empty state for no conversations
- ✅ Loading states
- ✅ Keyboard navigation
- ✅ Accessible ARIA labels

### **What It Does**:

`Messages.Conversations` manages the conversation list interface:

1. **Displays Conversations**: Shows all conversations with preview info
2. **Unread Indicators**: Highlights conversations with unread messages
3. **Selection Management**: Tracks and updates selected conversation
4. **Real-time Updates**: Reflects new messages and read status changes
5. **Sorting**: Automatically sorts by most recent activity
6. **User Context**: Requires current user ID to determine message read status
7. **Click Handling**: Selects conversation and triggers handlers

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
  import * as Messages from '@greater/fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <Messages.Conversations currentUserId="user-123" />
</Messages.Root>
```

### **With Selection Handling**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    
    onConversationClick: (conversation) => {
      console.log('Selected conversation:', conversation.id);
      // Custom logic (e.g., analytics tracking)
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="messaging-interface">
    <aside class="conversations-sidebar">
      <Messages.Conversations currentUserId="user-123" />
    </aside>
    
    <main class="conversation-view">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>

<style>
  .messaging-interface {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100vh;
  }
  
  .conversations-sidebar {
    border-right: 1px solid var(--border-color, #e1e8ed);
    overflow-y: auto;
  }
  
  .conversation-view {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **With Custom Styling**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <Messages.Conversations 
    currentUserId="user-123"
    class="custom-conversations"
  />
</Messages.Root>

<style>
  :global(.custom-conversations) {
    background: linear-gradient(to bottom, #f7f9fa, #ffffff);
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  :global(.custom-conversations .conversation-item) {
    border-radius: 0.75rem;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
  }
  
  :global(.custom-conversations .conversation-item:hover) {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  :global(.custom-conversations .conversation-item--selected) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `currentUserId` | `string` | - | **Yes** | Current user's ID (to determine read status) |
| `class` | `string` | `''` | No | Custom CSS class for the container |

---

## 📤 Events

The component interacts with the Messages context and uses handlers from `Messages.Root`:

### **Used Handlers**:

- `onFetchConversations`: Fetches the list of conversations (called on mount if `autoFetch` is enabled)
- `onConversationClick`: Called when a conversation is clicked (receives the clicked conversation)

### **Context Updates**:

When a conversation is clicked, the component:
1. Calls `selectConversation(conversation.id)` from context
2. Updates `selectedConversation` in state
3. Fetches messages for that conversation
4. Calls `onConversationClick` handler if provided

---

## 💡 Examples

### **Example 1: Basic Conversations List**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load conversations');
      }
      
      return await response.json();
    },
    
    onConversationClick: (conversation) => {
      // Log conversation selection
      console.log('Viewing conversation with:', 
        conversation.participants.map(p => p.username).join(', ')
      );
    },
  };
</script>

<div class="messages-app">
  <Messages.Root {handlers} autoFetch={true}>
    <div class="layout">
      <aside class="sidebar">
        <header class="sidebar-header">
          <h2>Messages</h2>
          <Messages.UnreadIndicator variant="badge" />
        </header>
        
        <Messages.Conversations currentUserId={$authStore.userId} />
      </aside>
      
      <main class="main-content">
        <Messages.Thread />
        <Messages.Composer />
      </main>
    </div>
  </Messages.Root>
</div>

<style>
  .messages-app {
    height: 100vh;
    background: var(--background, #ffffff);
  }
  
  .layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    height: 100%;
  }
  
  .sidebar {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color, #e1e8ed);
    background: var(--sidebar-bg, #f7f9fa);
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .sidebar-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .main-content {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **Example 2: With Search and Filtering**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import type { Conversation } from '@greater/fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let searchQuery = $state('');
  let filterUnread = $state(false);
  let allConversations = $state<Conversation[]>([]);
  
  // Filtered conversations based on search and filter
  let filteredConversations = $derived(() => {
    let result = allConversations;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conv => 
        conv.participants.some(p => 
          p.username.toLowerCase().includes(query) ||
          p.displayName.toLowerCase().includes(query)
        ) ||
        conv.lastMessage?.content.toLowerCase().includes(query)
      );
    }
    
    // Filter unread only
    if (filterUnread) {
      result = result.filter(conv => conv.unreadCount > 0);
    }
    
    return result;
  });
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      const conversations = await response.json();
      allConversations = conversations;
      return conversations;
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="conversations-container">
    <header class="conversations-header">
      <h2>Messages</h2>
      <Messages.NewConversation />
    </header>
    
    <div class="search-bar">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input
        type="search"
        placeholder="Search conversations..."
        bind:value={searchQuery}
        aria-label="Search conversations"
      />
    </div>
    
    <div class="filters">
      <label class="filter-option">
        <input
          type="checkbox"
          bind:checked={filterUnread}
        />
        <span>Unread only</span>
      </label>
      
      {#if filteredConversations.length !== allConversations.length}
        <span class="filter-count">
          {filteredConversations.length} of {allConversations.length}
        </span>
      {/if}
    </div>
    
    <Messages.Conversations currentUserId={$authStore.userId} />
  </div>
</Messages.Root>

<style>
  .conversations-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .conversations-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .conversations-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .search-bar svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-secondary, #657786);
    flex-shrink: 0;
  }
  
  .search-bar input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9375rem;
    outline: none;
  }
  
  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
    background: var(--background-secondary, #f7f9fa);
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }
  
  .filter-option input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
  
  .filter-count {
    font-size: 0.875rem;
    color: var(--text-secondary, #657786);
  }
</style>
```

### **Example 3: With Real-time Updates (WebSocket)**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import type { DirectMessage } from '@greater/fediverse/Messages';
  import { onMount, onDestroy } from 'svelte';
  import { createWebSocketClient } from '$lib/websocket';
  import { authStore } from '$lib/stores/auth';
  
  let ws: ReturnType<typeof createWebSocketClient> | null = null;
  let connectionStatus = $state<'connected' | 'disconnected' | 'connecting'>('connecting');
  
  onMount(() => {
    // Initialize WebSocket
    ws = createWebSocketClient('wss://api.example.com/graphql', {
      reconnect: true,
      reconnectAttempts: 10,
      reconnectDelay: 2000,
    });
    
    ws.on('connect', () => {
      connectionStatus = 'connected';
      console.log('✓ WebSocket connected');
    });
    
    ws.on('disconnect', () => {
      connectionStatus = 'disconnected';
      console.log('✗ WebSocket disconnected');
    });
    
    ws.on('reconnecting', () => {
      connectionStatus = 'connecting';
      console.log('↻ WebSocket reconnecting...');
    });
    
    // Subscribe to new message events
    ws.subscribe({
      query: `
        subscription OnNewMessage {
          messageReceived {
            id
            conversationId
            content
            sender { id username displayName avatar }
            createdAt
            read
            mediaAttachments { url type previewUrl }
          }
        }
      `,
      onData: ({ messageReceived }: { messageReceived: DirectMessage }) => {
        console.log('New message received:', messageReceived);
        
        const context = Messages.getMessagesContext();
        const { state, updateState } = context;
        
        // Update conversation list
        const updatedConversations = state.conversations.map(conv => {
          if (conv.id === messageReceived.conversationId) {
            return {
              ...conv,
              lastMessage: messageReceived,
              unreadCount: conv.unreadCount + 1,
              updatedAt: messageReceived.createdAt,
            };
          }
          return conv;
        });
        
        // Sort by most recent
        updatedConversations.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        updateState({ conversations: updatedConversations });
        
        // Show browser notification if supported
        if (Notification.permission === 'granted') {
          new Notification('New Message', {
            body: `${messageReceived.sender.displayName}: ${messageReceived.content.slice(0, 50)}`,
            icon: messageReceived.sender.avatar,
          });
        }
      },
    });
    
    // Subscribe to read receipts
    ws.subscribe({
      query: `
        subscription OnMessageRead {
          messageRead {
            conversationId
            userId
          }
        }
      `,
      onData: ({ messageRead }) => {
        const context = Messages.getMessagesContext();
        const { state, updateState } = context;
        
        // Update unread count
        const updatedConversations = state.conversations.map(conv => {
          if (conv.id === messageRead.conversationId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        });
        
        updateState({ conversations: updatedConversations });
      },
    });
  });
  
  onDestroy(() => {
    ws?.close();
  });
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="realtime-conversations">
    <header class="header">
      <h2>Messages</h2>
      
      <div class="connection-indicator" class:connected={connectionStatus === 'connected'}>
        <span class="dot"></span>
        {connectionStatus === 'connected' ? 'Live' : 
         connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
      </div>
    </header>
    
    <Messages.Conversations currentUserId={$authStore.userId} />
  </div>
</Messages.Root>

<style>
  .realtime-conversations {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .connection-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: rgba(244, 33, 46, 0.1);
    color: #f4211e;
  }
  
  .connection-indicator.connected {
    background: rgba(0, 186, 124, 0.1);
    color: #00ba7c;
  }
  
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
```

### **Example 4: With Pagination and Infinite Scroll**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import type { Conversation } from '@greater/fediverse/Messages';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  
  let conversationsContainer: HTMLElement;
  let allConversations = $state<Conversation[]>([]);
  let displayedConversations = $state<Conversation[]>([]);
  let page = $state(1);
  let pageSize = 20;
  let isLoadingMore = $state(false);
  let hasMore = $state(true);
  
  // Load more conversations
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    isLoadingMore = true;
    
    try {
      const response = await fetch(
        `/api/messages/conversations?page=${page}&limit=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${$authStore.token}`,
          },
        }
      );
      
      const newConversations = await response.json();
      
      if (newConversations.length < pageSize) {
        hasMore = false;
      }
      
      allConversations = [...allConversations, ...newConversations];
      displayedConversations = allConversations;
      page++;
    } catch (error) {
      console.error('Failed to load more conversations:', error);
    } finally {
      isLoadingMore = false;
    }
  };
  
  // Scroll handler for infinite scroll
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    
    if (scrollBottom < 100 && !isLoadingMore && hasMore) {
      loadMore();
    }
  };
  
  onMount(() => {
    // Load initial conversations
    loadMore();
  });
  
  const handlers = {
    onFetchConversations: async () => {
      // Return already loaded conversations
      return displayedConversations;
    },
  };
</script>

<Messages.Root {handlers} autoFetch={false}>
  <div 
    class="infinite-scroll-conversations"
    bind:this={conversationsContainer}
    onscroll={handleScroll}
  >
    <header class="header">
      <h2>Messages</h2>
      <span class="count">{allConversations.length} conversations</span>
    </header>
    
    <Messages.Conversations currentUserId={$authStore.userId} />
    
    {#if isLoadingMore}
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading more conversations...</span>
      </div>
    {/if}
    
    {#if !hasMore && allConversations.length > 0}
      <div class="end-message">
        <p>You've reached the end</p>
      </div>
    {/if}
  </div>
</Messages.Root>

<style>
  .infinite-scroll-conversations {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
    position: sticky;
    top: 0;
    background: var(--background, #ffffff);
    z-index: 10;
  }
  
  .header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .count {
    font-size: 0.875rem;
    color: var(--text-secondary, #657786);
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.5rem;
    color: var(--text-secondary, #657786);
  }
  
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--border-color, #e1e8ed);
    border-top-color: var(--primary, #1da1f2);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .end-message {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary, #657786);
    font-size: 0.875rem;
  }
</style>
```

### **Example 5: With Conversation Actions (Archive, Delete, Mute)**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import type { Conversation } from '@greater/fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let contextMenuConversation = $state<Conversation | null>(null);
  let contextMenuPosition = $state<{ x: number; y: number } | null>(null);
  
  const showContextMenu = (event: MouseEvent, conversation: Conversation) => {
    event.preventDefault();
    contextMenuConversation = conversation;
    contextMenuPosition = { x: event.clientX, y: event.clientY };
  };
  
  const hideContextMenu = () => {
    contextMenuConversation = null;
    contextMenuPosition = null;
  };
  
  const archiveConversation = async (conversationId: string) => {
    try {
      await fetch(`/api/messages/conversations/${conversationId}/archive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      // Refresh conversations
      const context = Messages.getMessagesContext();
      await context.fetchConversations();
      
      console.log('Conversation archived');
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    } finally {
      hideContextMenu();
    }
  };
  
  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    try {
      await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      // Refresh conversations
      const context = Messages.getMessagesContext();
      await context.fetchConversations();
      
      console.log('Conversation deleted');
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      hideContextMenu();
    }
  };
  
  const muteConversation = async (conversationId: string) => {
    try {
      await fetch(`/api/messages/conversations/${conversationId}/mute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      console.log('Conversation muted');
    } catch (error) {
      console.error('Failed to mute conversation:', error);
    } finally {
      hideContextMenu();
    }
  };
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      return await response.json();
    },
  };
</script>

<svelte:window onclick={hideContextMenu} />

<Messages.Root {handlers} autoFetch={true}>
  <div class="conversations-with-actions">
    <header class="header">
      <h2>Messages</h2>
    </header>
    
    <Messages.Conversations currentUserId={$authStore.userId} />
    
    {#if contextMenuConversation && contextMenuPosition}
      <div
        class="context-menu"
        style:left="{contextMenuPosition.x}px"
        style:top="{contextMenuPosition.y}px"
        onclick|stopPropagation
      >
        <button 
          class="context-menu-item"
          onclick={() => archiveConversation(contextMenuConversation!.id)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
          </svg>
          Archive
        </button>
        
        <button 
          class="context-menu-item"
          onclick={() => muteConversation(contextMenuConversation!.id)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          Mute
        </button>
        
        <hr />
        
        <button 
          class="context-menu-item context-menu-item--danger"
          onclick={() => deleteConversation(contextMenuConversation!.id)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          Delete
        </button>
      </div>
    {/if}
  </div>
</Messages.Root>

<style>
  .conversations-with-actions {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }
  
  .header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .context-menu {
    position: fixed;
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: 0.5rem 0;
    z-index: 1000;
    min-width: 200px;
  }
  
  .context-menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    font-size: 0.9375rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  
  .context-menu-item:hover {
    background: var(--background-hover, #f7f9fa);
  }
  
  .context-menu-item svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .context-menu-item--danger {
    color: #f4211e;
  }
  
  .context-menu hr {
    margin: 0.5rem 0;
    border: none;
    border-top: 1px solid var(--border-color, #e1e8ed);
  }
</style>
```

---

## 🔒 Security Considerations

### **Permission Validation**

Ensure users can only see their own conversations:

```typescript
// Server-side validation
app.get('/api/messages/conversations', authenticateUser, async (req, res) => {
  // Only return conversations where user is a participant
  const conversations = await Conversation.find({
    participantIds: req.user.id,
  }).sort({ updatedAt: -1 });
  
  res.json(conversations);
});
```

### **Content Sanitization**

Sanitize message content before display:

```svelte
<script lang="ts">
  import { sanitizeHTML } from '$lib/security';
  
  const displayMessagePreview = (content: string) => {
    const sanitized = sanitizeHTML(content);
    return sanitized.slice(0, 100); // Limit preview length
  };
</script>
```

---

## ♿ Accessibility

### **Semantic Structure**

```svelte
<nav aria-label="Message conversations" role="navigation">
  <Messages.Conversations currentUserId="me" />
</nav>
```

### **Keyboard Navigation**

- **↑/↓ Arrow keys**: Navigate conversations
- **Enter**: Select conversation
- **Tab**: Navigate to next focusable element

---

## ⚡ Performance

### **Virtual Scrolling**

For large conversation lists:

```svelte
<script lang="ts">
  import VirtualList from 'svelte-virtual-list';
  import * as Messages from '@greater/fediverse/Messages';
  
  const context = Messages.getMessagesContext();
  const { state } = context;
</script>

<VirtualList items={state.conversations} let:item>
  <ConversationItem conversation={item} />
</VirtualList>
```

---

## 🧪 Testing

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import * as Messages from '@greater/fediverse/Messages';

test('selects conversation on click', async () => {
  const onConversationClick = vi.fn();
  
  const { getByRole } = render(Messages.Root, {
    props: {
      handlers: { onConversationClick },
    },
  });
  
  const conversation = getByRole('button', { name: /conversation with/i });
  await fireEvent.click(conversation);
  
  expect(onConversationClick).toHaveBeenCalledWith(
    expect.objectContaining({ id: expect.any(String) })
  );
});
```

---

## 🔗 Related Components

- [Messages.Root](/docs/components/Messages/Root.md) - Context provider
- [Messages.Thread](/docs/components/Messages/Thread.md) - Display messages
- [Messages.NewConversation](/docs/components/Messages/NewConversation.md) - Start new conversation

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Real-time Updates Guide](/docs/guides/real-time.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

