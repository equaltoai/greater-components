# Messages.Thread

**Component**: Message Thread Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 91 passing tests

---

## 📋 Overview

`Messages.Thread` displays the full conversation thread of messages within a selected conversation. It provides a chronological view of messages with support for real-time updates, scroll behavior, read receipts, and message actions.

### **Key Features**:
- ✅ Display full conversation thread
- ✅ Chronological message ordering
- ✅ Auto-scroll to latest message
- ✅ Smart scroll behavior (maintain position when loading history)
- ✅ Real-time message delivery
- ✅ Read receipts and status indicators
- ✅ Message grouping by sender
- ✅ Timestamp formatting
- ✅ Media attachments display
- ✅ Empty state when no conversation selected
- ✅ Loading states for message fetching
- ✅ Infinite scroll for message history
- ✅ Keyboard navigation
- ✅ Accessible ARIA labels

### **What It Does**:

`Messages.Thread` manages the conversation thread interface:

1. **Displays Messages**: Renders all messages in the selected conversation
2. **Auto-scrolling**: Automatically scrolls to the newest message on load and new message arrival
3. **History Loading**: Loads older messages when scrolling to the top
4. **Real-time Updates**: Adds new messages as they arrive via WebSocket
5. **Read Marking**: Marks messages as read when they come into view
6. **Message Grouping**: Groups consecutive messages from the same sender
7. **Timestamp Display**: Shows message timestamps with smart formatting
8. **Media Support**: Displays images, videos, and other attachments

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="messaging-interface">
    <Messages.Conversations currentUserId="me" />
    <Messages.Thread />
  </div>
</Messages.Root>
```

### **With Composer**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
    
    onSendMessage: async (conversationId: string, content: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="chat-layout">
    <aside class="sidebar">
      <Messages.Conversations currentUserId="me" />
    </aside>
    
    <main class="main-chat">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>

<style>
  .chat-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100vh;
  }
  
  .sidebar {
    border-right: 1px solid var(--border-color, #e1e8ed);
  }
  
  .main-chat {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **With Custom Styling**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <Messages.Thread class="custom-thread" />
</Messages.Root>

<style>
  :global(.custom-thread) {
    background: linear-gradient(to bottom, #f0f2f5, #ffffff);
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  :global(.custom-thread .message-bubble) {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 1.25rem;
  }
  
  :global(.custom-thread .message-bubble--me) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  :global(.custom-thread .message-bubble--other) {
    background: #ffffff;
    border: 1px solid var(--border-color, #e1e8ed);
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class for the container |

---

## 📤 Events

The component interacts with the Messages context and uses handlers from `Messages.Root`:

### **Used Handlers**:

- `onFetchMessages`: Fetches messages for the selected conversation
- `onMarkRead`: Marks the conversation as read when messages are viewed

### **Context Usage**:

Accesses state from the Messages context:
- `state.selectedConversation`: The currently selected conversation
- `state.messages`: Messages in the selected conversation
- `state.loadingMessages`: Loading state for message fetching

---

## 💡 Examples

### **Example 1: Basic Thread with Auto-scroll**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import { onMount, tick } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  
  let threadContainer: HTMLElement;
  let messagesContext: ReturnType<typeof Messages.getMessagesContext>;
  
  // Auto-scroll to bottom when messages change
  $effect(() => {
    if (messagesContext?.state.messages) {
      tick().then(() => {
        if (threadContainer) {
          threadContainer.scrollTop = threadContainer.scrollHeight;
        }
      });
    }
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
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      const messages = await response.json();
      
      // Mark as read after fetching
      if (handlers.onMarkRead) {
        await handlers.onMarkRead(conversationId);
      }
      
      return messages;
    },
    
    onMarkRead: async (conversationId: string) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
    },
    
    onSendMessage: async (conversationId: string, content: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: JSON.stringify({ content }),
      });
      return await response.json();
    },
  };
</script>

<div class="messaging-app">
  <Messages.Root {handlers} autoFetch={true}>
    {#snippet children()}
      {(messagesContext = Messages.getMessagesContext(), null)}
      
      <div class="app-layout">
        <aside class="conversations-panel">
          <header class="panel-header">
            <h2>Messages</h2>
            <Messages.UnreadIndicator variant="badge" />
          </header>
          <Messages.Conversations currentUserId={$authStore.userId} />
        </aside>
        
        <main class="thread-panel">
          {#if messagesContext.state.selectedConversation}
            <header class="thread-header">
              <div class="participants">
                {#each messagesContext.state.selectedConversation.participants as participant}
                  {#if participant.id !== $authStore.userId}
                    <img 
                      src={participant.avatar} 
                      alt={participant.displayName}
                      class="participant-avatar"
                    />
                    <div class="participant-info">
                      <h3>{participant.displayName}</h3>
                      <span class="username">@{participant.username}</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </header>
            
            <div class="thread-container" bind:this={threadContainer}>
              <Messages.Thread />
            </div>
            
            <Messages.Composer />
          {:else}
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
              <h3>No conversation selected</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          {/if}
        </main>
      </div>
    {/snippet}
  </Messages.Root>
</div>

<style>
  .messaging-app {
    height: 100vh;
    background: var(--background, #ffffff);
  }
  
  .app-layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    height: 100%;
  }
  
  .conversations-panel {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color, #e1e8ed);
    background: var(--background-secondary, #f7f9fa);
  }
  
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .panel-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .thread-panel {
    display: flex;
    flex-direction: column;
  }
  
  .thread-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
    background: var(--background, #ffffff);
  }
  
  .participants {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .participant-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .participant-info h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .username {
    font-size: 0.875rem;
    color: var(--text-secondary, #657786);
  }
  
  .thread-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary, #657786);
  }
  
  .empty-state svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-state h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary, #14171a);
  }
  
  .empty-state p {
    margin: 0;
    font-size: 0.9375rem;
  }
</style>
```

### **Example 2: With Infinite Scroll (Load History)**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let threadContainer: HTMLElement;
  let isLoadingHistory = $state(false);
  let hasMoreHistory = $state(true);
  let oldestMessageId = $state<string | null>(null);
  
  const loadOlderMessages = async (conversationId: string) => {
    if (isLoadingHistory || !hasMoreHistory) return;
    
    isLoadingHistory = true;
    
    try {
      const params = new URLSearchParams({
        before: oldestMessageId || '',
        limit: '50',
      });
      
      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${$authStore.token}`,
          },
        }
      );
      
      const olderMessages = await response.json();
      
      if (olderMessages.length === 0) {
        hasMoreHistory = false;
        return;
      }
      
      // Update oldest message ID for pagination
      oldestMessageId = olderMessages[0].id;
      
      // Add to beginning of messages array
      const context = Messages.getMessagesContext();
      context.updateState({
        messages: [...olderMessages, ...context.state.messages],
      });
      
      // Maintain scroll position
      const scrollHeightBefore = threadContainer.scrollHeight;
      await tick();
      const scrollHeightAfter = threadContainer.scrollHeight;
      threadContainer.scrollTop += scrollHeightAfter - scrollHeightBefore;
      
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      isLoadingHistory = false;
    }
  };
  
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    
    // Load more when scrolled near top
    if (target.scrollTop < 100) {
      const context = Messages.getMessagesContext();
      if (context.state.selectedConversation) {
        loadOlderMessages(context.state.selectedConversation.id);
      }
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
    
    onFetchMessages: async (conversationId: string) => {
      // Reset pagination state
      hasMoreHistory = true;
      oldestMessageId = null;
      
      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages?limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${$authStore.token}`,
          },
        }
      );
      const messages = await response.json();
      
      if (messages.length > 0) {
        oldestMessageId = messages[0].id;
      }
      
      return messages;
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="infinite-scroll-thread">
    <Messages.Conversations currentUserId={$authStore.userId} />
    
    <div 
      class="thread-with-history"
      bind:this={threadContainer}
      onscroll={handleScroll}
    >
      {#if isLoadingHistory}
        <div class="history-loading">
          <div class="spinner"></div>
          <span>Loading older messages...</span>
        </div>
      {/if}
      
      {#if !hasMoreHistory}
        <div class="history-end">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <p>This is the beginning of your conversation</p>
        </div>
      {/if}
      
      <Messages.Thread />
    </div>
  </div>
</Messages.Root>

<style>
  .infinite-scroll-thread {
    display: flex;
    height: 100vh;
  }
  
  .thread-with-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .history-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    color: var(--text-secondary, #657786);
    font-size: 0.875rem;
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
  
  .history-end {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    text-align: center;
    color: var(--text-secondary, #657786);
  }
  
  .history-end svg {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .history-end p {
    margin: 0;
    font-size: 0.875rem;
  }
</style>
```

### **Example 3: With Real-time Updates (WebSocket)**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  import { onMount, onDestroy, tick } from 'svelte';
  import { createWebSocketClient } from '$lib/websocket';
  import { authStore } from '$lib/stores/auth';
  
  let ws: ReturnType<typeof createWebSocketClient> | null = null;
  let threadContainer: HTMLElement;
  let isAtBottom = $state(true);
  
  // Track if user is at bottom of thread
  const checkScrollPosition = () => {
    if (!threadContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = threadContainer;
    isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
  };
  
  // Auto-scroll to bottom only if user is already at bottom
  const scrollToBottomIfNeeded = async () => {
    if (isAtBottom && threadContainer) {
      await tick();
      threadContainer.scrollTop = threadContainer.scrollHeight;
    }
  };
  
  onMount(() => {
    // Initialize WebSocket
    ws = createWebSocketClient('wss://api.example.com/graphql', {
      reconnect: true,
      reconnectAttempts: 10,
    });
    
    ws.on('connect', () => {
      console.log('✓ WebSocket connected');
    });
    
    // Subscribe to new messages
    ws.subscribe({
      query: `
        subscription OnNewMessage($userId: ID!) {
          messageReceived(userId: $userId) {
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
      variables: { userId: $authStore.userId },
      onData: ({ messageReceived }: { messageReceived: DirectMessage }) => {
        const context = Messages.getMessagesContext();
        const { state, updateState } = context;
        
        // Only add if it's for the current conversation
        if (state.selectedConversation?.id === messageReceived.conversationId) {
          updateState({
            messages: [...state.messages, messageReceived],
          });
          
          scrollToBottomIfNeeded();
          
          // Show notification for incoming messages (not from me)
          if (messageReceived.sender.id !== $authStore.userId) {
            if (Notification.permission === 'granted') {
              new Notification('New Message', {
                body: `${messageReceived.sender.displayName}: ${messageReceived.content}`,
                icon: messageReceived.sender.avatar,
              });
            }
          }
        }
      },
    });
    
    // Subscribe to typing indicators (optional)
    ws.subscribe({
      query: `
        subscription OnTyping($conversationId: ID!) {
          userTyping(conversationId: $conversationId) {
            userId
            username
            isTyping
          }
        }
      `,
      onData: ({ userTyping }) => {
        console.log(`${userTyping.username} is ${userTyping.isTyping ? 'typing' : 'idle'}...`);
        // Update UI to show typing indicator
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
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      return await response.json();
    },
    
    onSendMessage: async (conversationId: string, content: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: JSON.stringify({ content }),
      });
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="realtime-thread">
    <Messages.Conversations currentUserId={$authStore.userId} />
    
    <div 
      class="thread-container"
      bind:this={threadContainer}
      onscroll={checkScrollPosition}
    >
      <Messages.Thread />
      
      {#if !isAtBottom}
        <button 
          class="scroll-to-bottom"
          onclick={() => {
            threadContainer.scrollTop = threadContainer.scrollHeight;
          }}
          aria-label="Scroll to bottom"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
      {/if}
    </div>
    
    <Messages.Composer />
  </div>
</Messages.Root>

<style>
  .realtime-thread {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100vh;
  }
  
  .thread-container {
    position: relative;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .scroll-to-bottom {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary, #1da1f2);
    color: white;
    border: none;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .scroll-to-bottom:hover {
    transform: scale(1.1);
  }
  
  .scroll-to-bottom svg {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
```

### **Example 4: With Message Grouping and Date Separators**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  // Group messages by date
  const groupMessagesByDate = (messages: DirectMessage[]) => {
    const groups: Map<string, DirectMessage[]> = new Map();
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(message);
    });
    
    return groups;
  };
  
  // Format date for separator
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };
  
  // Check if messages should be grouped (same sender, within 5 minutes)
  const shouldGroupWithPrevious = (current: DirectMessage, previous: DirectMessage | null) => {
    if (!previous) return false;
    
    if (current.sender.id !== previous.sender.id) return false;
    
    const currentTime = new Date(current.createdAt).getTime();
    const previousTime = new Date(previous.createdAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (currentTime - previousTime) < fiveMinutes;
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
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  {#snippet children()}
    {
      const context = Messages.getMessagesContext();
      const messageGroups = groupMessagesByDate(context.state.messages);
    }
    
    <div class="grouped-thread">
      {#each Array.from(messageGroups.entries()) as [date, messages]}
        <div class="date-separator">
          <span>{formatDate(date)}</span>
        </div>
        
        {#each messages as message, index}
          {@const previous = index > 0 ? messages[index - 1] : null}
          {@const grouped = shouldGroupWithPrevious(message, previous)}
          
          <div 
            class="message"
            class:message--grouped={grouped}
            class:message--me={message.sender.id === $authStore.userId}
          >
            {#if !grouped}
              <div class="message-header">
                <img 
                  src={message.sender.avatar} 
                  alt={message.sender.displayName}
                  class="message-avatar"
                />
                <span class="message-sender">{message.sender.displayName}</span>
                <span class="message-time">
                  {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            {/if}
            
            <div class="message-content">
              {message.content}
            </div>
          </div>
        {/each}
      {/each}
    </div>
  {/snippet}
</Messages.Root>

<style>
  .grouped-thread {
    padding: 1rem;
  }
  
  .date-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.5rem 0;
  }
  
  .date-separator span {
    padding: 0.25rem 0.75rem;
    background: var(--background-secondary, #f7f9fa);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary, #657786);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .message {
    margin-bottom: 1rem;
  }
  
  .message--grouped {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  
  .message-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .message-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .message-sender {
    font-weight: 600;
    font-size: 0.9375rem;
  }
  
  .message-time {
    font-size: 0.75rem;
    color: var(--text-secondary, #657786);
  }
  
  .message-content {
    padding: 0.75rem 1rem;
    background: var(--background-secondary, #f7f9fa);
    border-radius: 1rem;
    margin-left: 2.5rem;
  }
  
  .message--me .message-content {
    background: var(--primary, #1da1f2);
    color: white;
    margin-left: 0;
    margin-right: 2.5rem;
  }
  
  .message--grouped .message-content {
    margin-top: 0.25rem;
  }
</style>
```

### **Example 5: With Message Actions (Delete, React, Reply)**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let hoveredMessageId = $state<string | null>(null);
  let showActionsFor = $state<string | null>(null);
  
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      // Remove from local state
      const context = Messages.getMessagesContext();
      context.updateState({
        messages: context.state.messages.filter(m => m.id !== messageId),
      });
      
      console.log('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };
  
  const reactToMessage = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: JSON.stringify({ emoji }),
      });
      
      console.log(`Reacted with ${emoji}`);
    } catch (error) {
      console.error('Failed to react:', error);
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
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  {#snippet children()}
    {
      const context = Messages.getMessagesContext();
    }
    
    <div class="thread-with-actions">
      {#each context.state.messages as message}
        <div 
          class="message-wrapper"
          class:message--me={message.sender.id === $authStore.userId}
          onmouseenter={() => { hoveredMessageId = message.id; }}
          onmouseleave={() => { hoveredMessageId = null; }}
        >
          <div class="message-bubble">
            <div class="message-sender">
              <strong>{message.sender.displayName}</strong>
              <span class="message-time">
                {new Date(message.createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            
            <div class="message-content">
              {message.content}
            </div>
            
            {#if hoveredMessageId === message.id}
              <div class="message-actions">
                <button 
                  class="action-button"
                  onclick={() => reactToMessage(message.id, '👍')}
                  title="React"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                </button>
                
                {#if message.sender.id === $authStore.userId}
                  <button 
                    class="action-button action-button--danger"
                    onclick={() => deleteMessage(message.id)}
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
</Messages.Root>

<style>
  .thread-with-actions {
    padding: 1rem;
  }
  
  .message-wrapper {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .message-bubble {
    position: relative;
    max-width: 70%;
    padding: 0.75rem 1rem;
    background: var(--background-secondary, #f7f9fa);
    border-radius: 1rem;
  }
  
  .message--me .message-bubble {
    margin-left: auto;
    background: var(--primary, #1da1f2);
    color: white;
  }
  
  .message-sender {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .message-time {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .message-content {
    font-size: 0.9375rem;
    line-height: 1.5;
  }
  
  .message-actions {
    position: absolute;
    top: -1.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  
  .action-button:hover {
    background: var(--background-hover, #f7f9fa);
  }
  
  .action-button svg {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  .action-button--danger:hover {
    background: rgba(244, 33, 46, 0.1);
    color: #f4211e;
  }
</style>
```

---

## 🔒 Security Considerations

### **Permission Validation**

Only show messages for conversations the user is part of:

```typescript
// Server-side
app.get('/api/messages/conversations/:id', authenticateUser, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation.participantIds.includes(req.user.id)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const messages = await Message.find({ conversationId: req.params.id });
  res.json(messages);
});
```

### **Content Sanitization**

Always sanitize message content:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizeMessage = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};
```

---

## ♿ Accessibility

### **ARIA Labels**

```svelte
<div 
  role="log"
  aria-label="Message thread"
  aria-live="polite"
  aria-relevant="additions"
>
  <Messages.Thread />
</div>
```

### **Keyboard Navigation**

- **↑/↓**: Navigate messages
- **Home/End**: Jump to first/last message
- **Tab**: Move through interactive elements

---

## ⚡ Performance

### **Virtual Scrolling**

For very long threads (1000+ messages):

```svelte
<script lang="ts">
  import VirtualList from 'svelte-virtual-list';
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  
  const context = Messages.getMessagesContext();
</script>

<VirtualList items={context.state.messages} let:item>
  <Messages.Message message={item} />
</VirtualList>
```

---

## 🧪 Testing

```typescript
import { render } from '@testing-library/svelte';
import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

test('renders messages', () => {
  const { getByText } = render(Messages.Root, {
    props: {
      handlers: {
        onFetchMessages: async () => [
          { id: '1', content: 'Hello', sender: { id: '1', username: 'user1', displayName: 'User' }, createdAt: new Date().toISOString(), conversationId: '1', read: true },
        ],
      },
    },
  });
  
  expect(getByText('Hello')).toBeInTheDocument();
});
```

---

## 🔗 Related Components

- [Messages.Root](/docs/components/Messages/Root.md) - Context provider
- [Messages.Message](/docs/components/Messages/Message.md) - Individual message
- [Messages.Composer](/docs/components/Messages/Composer.md) - Send messages

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Real-time Updates Guide](/docs/guides/real-time.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

