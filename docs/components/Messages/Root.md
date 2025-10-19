# Messages.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 112 passing tests

---

## 📋 Overview

`Messages.Root` is the foundational component for the direct messaging system. It creates and provides the messages context to all child components, managing shared state, event handlers, and coordinating between different messaging operations.

### **Key Features**:
- ✅ Centralized messaging state management
- ✅ Shared event handlers for all message operations
- ✅ Type-safe context API
- ✅ Automatic state synchronization
- ✅ Error handling and recovery
- ✅ Loading states for async operations
- ✅ Auto-fetch conversations on mount (optional)
- ✅ Real-time update support
- ✅ Unread count tracking
- ✅ WebSocket integration support

### **What It Does**:

`Messages.Root` serves as the container and coordinator for all messaging functionality:

1. **State Management**: Maintains conversations, selected conversation, messages, loading states, errors
2. **Context Provider**: Shares state and methods with all child components via Svelte context
3. **Handler Coordination**: Receives event handlers and makes them available throughout the component tree
4. **Lifecycle Management**: Handles initialization, cleanup, and data fetching
5. **Auto-mark Read**: Automatically marks conversations as read when viewed
6. **Unread Tracking**: Maintains total unread count across all conversations
7. **Error Boundaries**: Catches and manages errors from child components

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
    onFetchMessages: async (conversationId) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
    onSendMessage: async (conversationId, content) => {
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
  <Messages.Conversations currentUserId="me" />
  <Messages.Thread />
  <Messages.Composer />
</Messages.Root>
```

### **With All Handlers**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { MessagesHandlers } from '@equaltoai/greater-components-fediverse/Messages';
  
  const handlers: MessagesHandlers = {
    // Fetch all conversations
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return await response.json();
    },
    
    // Fetch messages for a conversation
    onFetchMessages: async (conversationId, options) => {
      const params = new URLSearchParams({
        ...(options?.limit && { limit: options.limit.toString() }),
        ...(options?.cursor && { cursor: options.cursor }),
      });
      
      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    },
    
    // Send a message
    onSendMessage: async (conversationId, content, mediaIds) => {
      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ content, mediaIds }),
        }
      );
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    },
    
    // Mark conversation as read
    onMarkRead: async (conversationId) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
    },
    
    // Delete a message
    onDeleteMessage: async (messageId) => {
      await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
    },
    
    // Create new conversation
    onCreateConversation: async (participantIds) => {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ participantIds }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return await response.json();
    },
    
    // Upload media
    onUploadMedia: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    },
    
    // Handle conversation click
    onConversationClick: (conversation) => {
      console.log('Conversation selected:', conversation.id);
    },
    
    // Search for participants
    onSearchParticipants: async (query) => {
      const response = await fetch(
        `/api/search/users?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        }
      );
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    },
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="messages-layout">
    <Messages.Conversations currentUserId="me" />
    <div class="message-thread">
      <Messages.Thread />
      <Messages.Composer />
    </div>
  </div>
</Messages.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `handlers` | `MessagesHandlers` | `{}` | No | Event handlers for message operations |
| `autoFetch` | `boolean` | `true` | No | Auto-fetch conversations on component mount |
| `children` | `Snippet` | - | No | Child components |
| `class` | `string` | `''` | No | Custom CSS class for root element |

### **MessagesHandlers Interface**:

```typescript
interface MessagesHandlers {
  /**
   * Fetch all conversations for the current user
   * @returns Promise resolving to array of conversations
   */
  onFetchConversations?: () => Promise<Conversation[]>;

  /**
   * Fetch messages for a conversation
   * @param conversationId - Conversation ID
   * @param options - Pagination options
   * @returns Promise resolving to array of messages
   */
  onFetchMessages?: (
    conversationId: string,
    options?: { limit?: number; cursor?: string }
  ) => Promise<DirectMessage[]>;

  /**
   * Send a message in a conversation
   * @param conversationId - Conversation ID
   * @param content - Message content
   * @param mediaIds - Optional media attachment IDs
   * @returns Promise resolving to created message
   */
  onSendMessage?: (
    conversationId: string,
    content: string,
    mediaIds?: string[]
  ) => Promise<DirectMessage>;

  /**
   * Mark conversation as read
   * @param conversationId - Conversation ID
   * @returns Promise resolving when operation completes
   */
  onMarkRead?: (conversationId: string) => Promise<void>;

  /**
   * Delete a message
   * @param messageId - Message ID
   * @returns Promise resolving when deletion is complete
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;

  /**
   * Create new conversation
   * @param participantIds - Array of participant user IDs
   * @returns Promise resolving to created conversation
   */
  onCreateConversation?: (participantIds: string[]) => Promise<Conversation>;

  /**
   * Upload media file
   * @param file - File to upload
   * @returns Promise resolving to media metadata (id, url)
   */
  onUploadMedia?: (file: File) => Promise<{ id: string; url: string }>;

  /**
   * Handle conversation click event
   * @param conversation - The clicked conversation
   */
  onConversationClick?: (conversation: Conversation) => void;

  /**
   * Search for users to start new conversation
   * @param query - Search query
   * @returns Promise resolving to array of matching users
   */
  onSearchParticipants?: (query: string) => Promise<MessageParticipant[]>;
}
```

### **Conversation Interface**:

```typescript
interface Conversation {
  /** Unique conversation identifier */
  id: string;
  
  /** Participants in the conversation */
  participants: MessageParticipant[];
  
  /** Last message in conversation */
  lastMessage?: DirectMessage;
  
  /** Number of unread messages */
  unreadCount: number;
  
  /** Last update timestamp */
  updatedAt: string;
}
```

### **DirectMessage Interface**:

```typescript
interface DirectMessage {
  /** Unique message identifier */
  id: string;
  
  /** Conversation this message belongs to */
  conversationId: string;
  
  /** Message sender */
  sender: MessageParticipant;
  
  /** Message content */
  content: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Whether message has been read */
  read: boolean;
  
  /** Optional media attachments */
  mediaAttachments?: Array<{
    url: string;
    type: string;
    previewUrl?: string;
  }>;
}
```

### **MessageParticipant Interface**:

```typescript
interface MessageParticipant {
  /** User ID */
  id: string;
  
  /** Username */
  username: string;
  
  /** Display name */
  displayName: string;
  
  /** Avatar URL */
  avatar?: string;
}
```

---

## 📤 Context API

When you use `Messages.Root`, it creates a context that child components can access:

### **Available Context Methods**:

```typescript
const {
  // State
  state,                      // Current messages state (reactive)
  
  // Methods
  fetchConversations,         // Fetch all conversations
  selectConversation,         // Select a conversation and load messages
  sendMessage,                // Send a message
  deleteMessage,              // Delete a message
  markRead,                   // Mark conversation as read
  updateState,                // Update state manually
  clearError,                 // Clear error state
  
  // Handlers (original handlers passed to Root)
  handlers,
} = Messages.getMessagesContext();
```

### **State Shape**:

```typescript
interface MessagesState {
  /** All user's conversations */
  conversations: Conversation[];
  
  /** Currently selected conversation */
  selectedConversation: Conversation | null;
  
  /** Messages in the selected conversation */
  messages: DirectMessage[];
  
  /** Loading state for operations */
  loading: boolean;
  
  /** Error message (if any) */
  error: string | null;
  
  /** Whether conversations are loading */
  loadingConversations: boolean;
  
  /** Whether messages are loading */
  loadingMessages: boolean;
}
```

---

## 💡 Examples

### **Example 1: Basic Messaging with Error Handling**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import { onMount } from 'svelte';
  
  let errorMessage = $state<string | null>(null);
  let successMessage = $state<string | null>(null);
  
  const showSuccess = (message: string) => {
    successMessage = message;
    setTimeout(() => { successMessage = null; }, 3000);
  };
  
  const handlers = {
    onFetchConversations: async () => {
      try {
        const response = await fetch('/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to view messages');
          }
          throw new Error('Failed to load conversations');
        }
        
        return await response.json();
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return [];
      }
    },
    
    onFetchMessages: async (conversationId: string) => {
      try {
        const response = await fetch(`/api/messages/conversations/${conversationId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to load messages');
        }
        
        return await response.json();
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
        return [];
      }
    },
    
    onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
      try {
        const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ content, mediaIds }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send message');
        }
        
        const message = await response.json();
        showSuccess('Message sent!');
        return message;
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        throw error;
      }
    },
    
    onMarkRead: async (conversationId: string) => {
      try {
        await fetch(`/api/messages/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    },
  };
</script>

<div class="messaging-container">
  {#if errorMessage}
    <div class="alert alert--error" role="alert">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span>{errorMessage}</span>
      <button onclick={() => { errorMessage = null; }}>×</button>
    </div>
  {/if}
  
  {#if successMessage}
    <div class="alert alert--success" role="status">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>{successMessage}</span>
    </div>
  {/if}
  
  <Messages.Root {handlers}>
    <div class="messages-layout">
      <Messages.Conversations currentUserId="me" />
      <div class="thread-area">
        <Messages.Thread />
        <Messages.Composer />
      </div>
    </div>
  </Messages.Root>
</div>

<style>
  .messaging-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
  
  .alert svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
  
  .alert--error {
    background: rgba(244, 33, 46, 0.1);
    border: 1px solid #f4211e;
    color: #f4211e;
  }
  
  .alert--success {
    background: rgba(0, 186, 124, 0.1);
    border: 1px solid #00ba7c;
    color: #00ba7c;
  }
  
  .alert button {
    margin-left: auto;
    padding: 0.25rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: inherit;
  }
  
  .messages-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 600px;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .thread-area {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **Example 2: With Real-time WebSocket Updates**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import { onMount, onDestroy } from 'svelte';
  import { createWebSocketClient } from '$lib/websocket';
  
  let ws: ReturnType<typeof createWebSocketClient> | null = null;
  let isConnected = $state(false);
  let messagesContext: ReturnType<typeof Messages.getMessagesContext> | null = null;
  
  onMount(() => {
    // Initialize WebSocket connection
    ws = createWebSocketClient('wss://api.example.com/graphql', {
      reconnect: true,
      reconnectAttempts: 5,
      reconnectDelay: 1000,
    });
    
    ws.on('connect', () => {
      isConnected = true;
      console.log('WebSocket connected');
    });
    
    ws.on('disconnect', () => {
      isConnected = false;
      console.log('WebSocket disconnected');
    });
    
    // Subscribe to new messages
    ws.subscribe({
      query: `
        subscription OnNewMessage {
          messageReceived {
            id
            conversationId
            content
            sender {
              id
              username
              displayName
              avatar
            }
            createdAt
            read
          }
        }
      `,
      onData: ({ messageReceived }) => {
        if (!messagesContext) return;
        
        const { state, updateState } = messagesContext;
        
        // Add message to current thread if it's the selected conversation
        if (state.selectedConversation?.id === messageReceived.conversationId) {
          updateState({
            messages: [...state.messages, messageReceived],
          });
        }
        
        // Update conversation list with new message
        const updatedConversations = state.conversations.map(conv => {
          if (conv.id === messageReceived.conversationId) {
            return {
              ...conv,
              lastMessage: messageReceived,
              unreadCount: state.selectedConversation?.id === conv.id 
                ? conv.unreadCount 
                : conv.unreadCount + 1,
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
        if (!messagesContext) return;
        
        const { state, updateState } = messagesContext;
        
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
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    
    onFetchMessages: async (conversationId: string) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
    
    onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mediaIds }),
      });
      return await response.json();
    },
    
    onMarkRead: async (conversationId: string) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    },
  };
</script>

<div class="realtime-messaging">
  <div class="connection-status" class:connected={isConnected}>
    <span class="status-dot"></span>
    {isConnected ? 'Connected' : 'Disconnected'}
  </div>
  
  <Messages.Root {handlers}>
    {#snippet children()}
      {(messagesContext = Messages.getMessagesContext(), null)}
      
      <div class="messages-layout">
        <Messages.Conversations currentUserId="me" />
        <div class="thread-area">
          <Messages.Thread />
          <Messages.Composer />
        </div>
      </div>
    {/snippet}
  </Messages.Root>
</div>

<style>
  .realtime-messaging {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    background: rgba(244, 33, 46, 0.1);
    color: #f4211e;
  }
  
  .connection-status.connected {
    background: rgba(0, 186, 124, 0.1);
    color: #00ba7c;
  }
  
  .status-dot {
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
  
  .messages-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 600px;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .thread-area {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **Example 3: With GraphQL Adapter Integration**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { MessagesHandlers } from '@equaltoai/greater-components-fediverse/Messages';
  import { createGraphQLClient } from '$lib/graphql';
  import { authStore } from '$lib/stores/auth';
  
  // GraphQL client with authentication
  const graphql = createGraphQLClient({
    endpoint: 'https://api.example.com/graphql',
    headers: () => ({
      'Authorization': `Bearer ${$authStore.token}`,
    }),
  });
  
  // Type-safe adapter implementation
  class MessagesAdapter {
    async fetchConversations() {
      const { data } = await graphql.query({
        query: `
          query GetConversations {
            conversations {
              id
              participants {
                id
                username
                displayName
                avatar
              }
              lastMessage {
                id
                content
                sender { id username displayName avatar }
                createdAt
                read
              }
              unreadCount
              updatedAt
            }
          }
        `,
      });
      return data.conversations;
    }
    
    async fetchMessages(conversationId: string, options?: { limit?: number; cursor?: string }) {
      const { data } = await graphql.query({
        query: `
          query GetMessages($conversationId: ID!, $limit: Int, $cursor: String) {
            messages(conversationId: $conversationId, limit: $limit, cursor: $cursor) {
              id
              conversationId
              content
              sender { id username displayName avatar }
              createdAt
              read
              mediaAttachments {
                url
                type
                previewUrl
              }
            }
          }
        `,
        variables: { conversationId, ...options },
      });
      return data.messages;
    }
    
    async sendMessage(conversationId: string, content: string, mediaIds?: string[]) {
      const { data } = await graphql.mutate({
        mutation: `
          mutation SendMessage($conversationId: ID!, $content: String!, $mediaIds: [ID!]) {
            sendMessage(conversationId: $conversationId, content: $content, mediaIds: $mediaIds) {
              id
              conversationId
              content
              sender { id username displayName avatar }
              createdAt
              read
            }
          }
        `,
        variables: { conversationId, content, mediaIds },
      });
      return data.sendMessage;
    }
    
    async markRead(conversationId: string) {
      await graphql.mutate({
        mutation: `
          mutation MarkRead($conversationId: ID!) {
            markConversationRead(conversationId: $conversationId) {
              success
            }
          }
        `,
        variables: { conversationId },
      });
    }
    
    async deleteMessage(messageId: string) {
      await graphql.mutate({
        mutation: `
          mutation DeleteMessage($messageId: ID!) {
            deleteMessage(messageId: $messageId) {
              success
            }
          }
        `,
        variables: { messageId },
      });
    }
    
    async createConversation(participantIds: string[]) {
      const { data } = await graphql.mutate({
        mutation: `
          mutation CreateConversation($participantIds: [ID!]!) {
            createConversation(participantIds: $participantIds) {
              id
              participants { id username displayName avatar }
              lastMessage { id content sender { id username displayName avatar } createdAt read }
              unreadCount
              updatedAt
            }
          }
        `,
        variables: { participantIds },
      });
      return data.createConversation;
    }
    
    async uploadMedia(file: File) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://api.example.com/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: formData,
      });
      
      return await response.json();
    }
    
    async searchParticipants(query: string) {
      const { data } = await graphql.query({
        query: `
          query SearchUsers($query: String!) {
            searchUsers(query: $query) {
              id
              username
              displayName
              avatar
            }
          }
        `,
        variables: { query },
      });
      return data.searchUsers;
    }
  }
  
  const adapter = new MessagesAdapter();
  
  // Create handlers from adapter
  const handlers: MessagesHandlers = {
    onFetchConversations: () => adapter.fetchConversations(),
    onFetchMessages: (id, opts) => adapter.fetchMessages(id, opts),
    onSendMessage: (id, content, mediaIds) => adapter.sendMessage(id, content, mediaIds),
    onMarkRead: (id) => adapter.markRead(id),
    onDeleteMessage: (id) => adapter.deleteMessage(id),
    onCreateConversation: (ids) => adapter.createConversation(ids),
    onUploadMedia: (file) => adapter.uploadMedia(file),
    onSearchParticipants: (query) => adapter.searchParticipants(query),
    onConversationClick: (conversation) => {
      console.log('Conversation selected:', conversation.id);
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <div class="adapter-messages">
    <aside class="sidebar">
      <Messages.UnreadIndicator variant="badge" />
      <Messages.NewConversation />
      <Messages.Conversations currentUserId={$authStore.userId} />
    </aside>
    
    <main class="main">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>

<style>
  .adapter-messages {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100vh;
  }
  
  .sidebar {
    border-right: 1px solid var(--border-color, #e1e8ed);
    overflow-y: auto;
  }
  
  .main {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **Example 4: With Caching and Optimistic Updates**

```svelte
<script lang="ts">
  import * * Messages from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage, Conversation } from '@equaltoai/greater-components-fediverse/Messages';
  import { lruCache } from '$lib/cache';
  
  // Cache for conversations (5 minutes TTL)
  const conversationsCache = lruCache<Conversation[]>({ 
    max: 1, 
    ttl: 5 * 60 * 1000 
  });
  
  // Cache for messages (2 minutes TTL per conversation)
  const messagesCache = lruCache({ 
    max: 50, 
    ttl: 2 * 60 * 1000 
  });
  
  // Optimistic update helper
  function withOptimisticUpdate<T>(
    operation: () => Promise<T>,
    optimisticValue: T,
    rollback: () => void
  ): Promise<T> {
    return operation().catch(error => {
      rollback();
      throw error;
    });
  }
  
  const handlers = {
    onFetchConversations: async () => {
      // Check cache first
      const cached = conversationsCache.get('user-conversations');
      if (cached) {
        console.log('Conversations loaded from cache');
        return cached;
      }
      
      // Fetch from API
      const response = await fetch('/api/messages/conversations');
      const conversations = await response.json();
      
      // Store in cache
      conversationsCache.set('user-conversations', conversations);
      console.log('Conversations loaded from API and cached');
      
      return conversations;
    },
    
    onFetchMessages: async (conversationId: string) => {
      // Check cache
      const cacheKey = `messages-${conversationId}`;
      const cached = messagesCache.get(cacheKey);
      if (cached) {
        console.log('Messages loaded from cache');
        return cached;
      }
      
      // Fetch from API
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      const messages = await response.json();
      
      // Store in cache
      messagesCache.set(cacheKey, messages);
      console.log('Messages loaded from API and cached');
      
      return messages;
    },
    
    onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
      // Generate optimistic ID
      const optimisticId = `temp-${Date.now()}`;
      const optimisticMessage: DirectMessage = {
        id: optimisticId,
        conversationId,
        content,
        sender: {
          id: 'me',
          username: 'me',
          displayName: 'Me',
        },
        createdAt: new Date().toISOString(),
        read: true,
      };
      
      // Get context to update state optimistically
      const context = Messages.getMessagesContext();
      const originalMessages = [...context.state.messages];
      
      // Optimistic update
      context.updateState({
        messages: [...context.state.messages, optimisticMessage]
      });
      
      // Perform actual send
      return withOptimisticUpdate(
        async () => {
          const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, mediaIds }),
          });
          
          if (!response.ok) throw new Error('Failed to send message');
          
          const realMessage = await response.json();
          
          // Replace optimistic message with real one
          context.updateState({
            messages: context.state.messages.map(m => 
              m.id === optimisticId ? realMessage : m
            )
          });
          
          // Invalidate caches
          messagesCache.delete(`messages-${conversationId}`);
          conversationsCache.delete('user-conversations');
          
          return realMessage;
        },
        optimisticMessage,
        () => {
          // Rollback on error
          context.updateState({ messages: originalMessages });
        }
      );
    },
    
    onMarkRead: async (conversationId: string) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
      });
      
      // Invalidate conversation cache
      conversationsCache.delete('user-conversations');
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <Messages.Conversations currentUserId="me" />
  <Messages.Thread />
  <Messages.Composer />
</Messages.Root>
```

### **Example 5: With Analytics and Logging**

```svelte
<script lang="ts">
  import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
  import { analytics } from '$lib/analytics';
  import { logger } from '$lib/logger';
  
  // Track messaging operations
  const trackOperation = (operation: string, metadata?: Record<string, any>) => {
    analytics.track('Messages Operation', {
      operation,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  };
  
  // Enhanced error logging
  const handleError = (operation: string, error: Error, context?: Record<string, any>) => {
    logger.error('Messages operation failed', {
      operation,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
    
    // Send to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { operation: 'messages', action: operation },
        extra: context,
      });
    }
  };
  
  const handlers = {
    onFetchConversations: async () => {
      const startTime = performance.now();
      
      try {
        logger.info('Fetching conversations');
        const response = await fetch('/api/messages/conversations');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const conversations = await response.json();
        const duration = performance.now() - startTime;
        
        logger.info('Conversations fetched successfully', {
          count: conversations.length,
          duration: `${duration.toFixed(2)}ms`,
        });
        
        trackOperation('fetch_conversations', {
          count: conversations.length,
          duration,
        });
        
        return conversations;
      } catch (error) {
        handleError('fetch_conversations', error as Error);
        throw error;
      }
    },
    
    onSendMessage: async (conversationId: string, content: string, mediaIds?: string[]) => {
      const startTime = performance.now();
      
      try {
        logger.info('Sending message', {
          conversationId,
          contentLength: content.length,
          hasMedia: !!mediaIds?.length,
        });
        
        const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, mediaIds }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const message = await response.json();
        const duration = performance.now() - startTime;
        
        logger.info('Message sent successfully', {
          messageId: message.id,
          duration: `${duration.toFixed(2)}ms`,
        });
        
        trackOperation('send_message', {
          conversationId,
          contentLength: content.length,
          hasMedia: !!mediaIds?.length,
          mediaCount: mediaIds?.length || 0,
          duration,
        });
        
        return message;
      } catch (error) {
        handleError('send_message', error as Error, { conversationId });
        throw error;
      }
    },
    
    onConversationClick: (conversation) => {
      logger.debug('Conversation clicked', {
        conversationId: conversation.id,
        participantCount: conversation.participants.length,
        unreadCount: conversation.unreadCount,
      });
      
      trackOperation('conversation_click', {
        conversationId: conversation.id,
        hadUnread: conversation.unreadCount > 0,
      });
    },
  };
</script>

<Messages.Root {handlers} autoFetch={true}>
  <Messages.Conversations currentUserId="me" />
  <Messages.Thread />
  <Messages.Composer />
</Messages.Root>
```

---

## 🔒 Security Considerations

### **Authentication**

Always include authentication tokens:

```typescript
const handlers = {
  onFetchConversations: async () => {
    const token = await getAuthToken();
    const response = await fetch('/api/messages/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  },
};
```

### **Input Validation**

Validate and sanitize all inputs:

```typescript
import { sanitizeHTML } from '$lib/security';

const handlers = {
  onSendMessage: async (conversationId: string, content: string) => {
    // Sanitize message content
    const sanitized = sanitizeHTML(content.trim()).slice(0, 5000); // Max 5000 chars
    
    if (!sanitized) {
      throw new Error('Message content is required');
    }
    
    const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: sanitized }),
    });
    
    return await response.json();
  },
};
```

### **Permission Checks**

Always verify permissions on the server side:

```typescript
// Server-side example (Node.js/Express)
app.get('/api/messages/conversations/:id', authenticateUser, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  // Check if user is participant
  if (!conversation.participantIds.includes(req.user.id)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const messages = await Message.find({ conversationId: req.params.id });
  res.json(messages);
});
```

### **Rate Limiting**

Implement rate limiting to prevent spam:

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const sendMessageLimiter = new RateLimiter({
  maxRequests: 60, // 60 messages
  windowMs: 60 * 1000, // per minute
});

const handlers = {
  onSendMessage: async (conversationId: string, content: string) => {
    const userId = getCurrentUserId();
    
    if (!await sendMessageLimiter.checkLimit(userId)) {
      throw new Error('Rate limit exceeded. Please wait before sending more messages.');
    }
    
    const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    
    return await response.json();
  },
};
```

---

## ♿ Accessibility

`Messages.Root` provides an accessible foundation:

### **Semantic Structure**

```svelte
<Messages.Root {handlers}>
  <div role="application" aria-label="Direct messages">
    <aside aria-label="Conversations list" role="complementary">
      <Messages.Conversations currentUserId="me" />
    </aside>
    
    <main aria-label="Selected conversation" role="main">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>
```

### **Keyboard Navigation**

All child components support full keyboard navigation:
- **Tab**: Navigate between conversations and messages
- **Enter**: Select conversation, send message
- **Escape**: Close modals
- **Arrow keys**: Navigate lists

### **Screen Reader Support**

- Proper ARIA labels on all interactive elements
- Status announcements for new messages
- Error messages in accessible format
- Live regions for dynamic updates

---

## ⚡ Performance

### **Lazy Loading**

Defer loading until needed:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let showMessages = $state(false);
  
  onMount(() => {
    requestIdleCallback(() => {
      showMessages = true;
    });
  });
</script>

{#if showMessages}
  <Messages.Root {handlers}>
    <Messages.Conversations currentUserId="me" />
  </Messages.Root>
{/if}
```

---

## 🧪 Testing

### **Component Test**

```typescript
import { render } from '@testing-library/svelte';
import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

test('renders without crashing', () => {
  const { container } = render(Messages.Root, {
    handlers: {},
  });
  
  expect(container.querySelector('.messages-root')).toBeInTheDocument();
});

test('calls onFetchConversations on mount', async () => {
  const onFetchConversations = vi.fn().mockResolvedValue([]);
  
  render(Messages.Root, {
    handlers: { onFetchConversations },
    autoFetch: true,
  });
  
  await vi.waitFor(() => {
    expect(onFetchConversations).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔗 Related Components

- [Messages.Conversations](/docs/components/Messages/Conversations.md) - List conversations
- [Messages.Thread](/docs/components/Messages/Thread.md) - Display messages
- [Messages.Composer](/docs/components/Messages/Composer.md) - Send messages

---

## 📚 API Reference

### **createMessagesContext()**

```typescript
function createMessagesContext(handlers?: MessagesHandlers): MessagesContext
```

### **getMessagesContext()**

```typescript
function getMessagesContext(): MessagesContext
```

---

## 📖 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [ActivityPub Direct Messages](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-directmessage)
- [Context API Guide](/docs/guides/context-api.md)
- [WebSocket Integration](/docs/guides/websocket.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

