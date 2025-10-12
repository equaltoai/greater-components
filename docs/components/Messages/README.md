# Messages Components

**Component Group**: Direct Messaging System  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 422 passing tests

---

## 📋 Overview

The Messages component group provides a complete direct messaging system for private conversations in your Fediverse application. It supports one-on-one and group conversations, real-time message delivery, media attachments, unread tracking, and comprehensive conversation management.

### **What are Messages?**

Messages allow users to:
- 💬 **Private Conversations**: Direct, private communication between users
- 🔴 **Unread Tracking**: Badge indicators and read receipts
- 🔍 **Search**: Find conversations and messages quickly
- 📎 **Media Sharing**: Send images, videos, audio, and files
- 👥 **Group Chats**: Conversations with multiple participants
- ⚡ **Real-time Delivery**: Instant message delivery via WebSocket
- 🔔 **Notifications**: New message alerts
- 🗑️ **Management**: Archive, delete, or leave conversations

Messages provide secure, private communication similar to Twitter DMs, Mastodon Direct Messages, or Signal.

---

## 🎯 Key Features

### **Conversation Management**
- ✅ Create new conversations (one-on-one or group)
- ✅ List all conversations sorted by recent activity
- ✅ Search conversations by participant or content
- ✅ Archive/delete conversations
- ✅ Leave group conversations
- ✅ Conversation metadata (participant count, last message, unread count)

### **Messaging Features**
- ✅ Send text messages
- ✅ Media attachments (images, videos, audio, files)
- ✅ Message editing (platform-dependent)
- ✅ Message deletion
- ✅ Read receipts (optional)
- ✅ Typing indicators (optional)
- ✅ Delivery confirmations

### **Real-time Communication**
- ✅ WebSocket support for instant delivery
- ✅ Live message updates
- ✅ Presence indicators (online/offline)
- ✅ Real-time unread count updates
- ✅ Connection status indicators

### **Unread Tracking**
- ✅ Per-conversation unread counts
- ✅ Total unread badge
- ✅ Mark as read on view
- ✅ Mark all as read
- ✅ Persistent unread state across sessions

### **Security & Privacy**
- ✅ Private conversations (not public)
- ✅ End-to-end encryption support (platform-dependent)
- ✅ Message retention policies
- ✅ Block/report users
- ✅ Permission controls

### **Accessibility**
- ✅ Full keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Semantic HTML

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Quick Start

### **Basic Setup**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    onFetchMessages: async (conversationId) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
    onSendMessage: async (conversationId, content, mediaIds) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mediaIds }),
      });
      return await response.json();
    },
    onMarkRead: async (conversationId) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="messages-layout">
    <aside class="conversations-sidebar">
      <Messages.UnreadIndicator variant="badge" />
      <Messages.Conversations currentUserId="me" />
    </aside>
    
    <main class="messages-main">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>

<style>
  .messages-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100vh;
  }
  
  .conversations-sidebar {
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
  }
  
  .messages-main {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **With Real-time Updates**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import { createWebSocketClient } from '$lib/websocket';
  
  const ws = createWebSocketClient('wss://api.example.com/graphql');
  
  const handlers = {
    // ... standard handlers ...
    
    onFetchConversations: async () => {
      const conversations = await fetchConversations();
      
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
            }
          }
        `,
        onData: ({ messageReceived }) => {
          // Update conversation with new message
          updateConversationWithNewMessage(messageReceived);
        },
      });
      
      return conversations;
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="realtime-messages">
    <Messages.Conversations />
    <div class="thread-area">
      <Messages.Thread />
      <Messages.Composer />
    </div>
  </div>
</Messages.Root>
```

---

## 🧩 Components

### **[Messages.Root](/docs/components/Messages/Root.md)**
Context provider for all message components. Manages shared state and handlers.

```svelte
<Messages.Root {handlers}>
  <!-- Child components -->
</Messages.Root>
```

### **[Messages.Conversations](/docs/components/Messages/Conversations.md)**
List of all conversations sorted by recent activity. Shows participant info, last message preview, and unread counts.

```svelte
<Messages.Conversations currentUserId="me" />
```

### **[Messages.Thread](/docs/components/Messages/Thread.md)**
Display messages in the selected conversation as a chronological thread.

```svelte
<Messages.Thread />
```

### **[Messages.Message](/docs/components/Messages/Message.md)**
Individual message display component with sender info, content, and timestamp.

```svelte
<Messages.Message {message} currentUserId="me" />
```

### **[Messages.Composer](/docs/components/Messages/Composer.md)**
Message input interface for composing and sending new messages.

```svelte
<Messages.Composer />
```

### **[Messages.NewConversation](/docs/components/Messages/NewConversation.md)**
Modal interface for starting new conversations with search and participant selection.

```svelte
<Messages.NewConversation />
```

### **[Messages.MediaUpload](/docs/components/Messages/MediaUpload.md)**
Media attachment interface for uploading images, videos, audio, and files.

```svelte
<Messages.MediaUpload maxAttachments={4} />
```

### **[Messages.UnreadIndicator](/docs/components/Messages/UnreadIndicator.md)**
Badge or indicator showing total unread message count.

```svelte
<Messages.UnreadIndicator variant="badge" size="medium" />
```

---

## 💡 Usage Examples

### **Example 1: Basic Messaging Interface**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
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
    onMarkRead: async (conversationId) => {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    },
  };
</script>

<div class="messaging-app">
  <Messages.Root {handlers}>
    <div class="messages-container">
      <Messages.Conversations currentUserId="me" class="conversations-list" />
      
      <div class="message-view">
        <Messages.Thread class="thread-display" />
        <Messages.Composer class="message-composer" />
      </div>
    </div>
  </Messages.Root>
</div>

<style>
  .messaging-app {
    height: 100vh;
    background: var(--bg-primary, #ffffff);
  }
  
  .messages-container {
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 100%;
  }
  
  .message-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
```

### **Example 2: With New Conversation Creation**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
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
    onCreateConversation: async (participantIds) => {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds }),
      });
      return await response.json();
    },
    onSearchParticipants: async (query) => {
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
      return await response.json();
    },
  };
</script>

<Messages.Root {handlers}>
  <div class="messages-with-creation">
    <header class="messages-header">
      <h1>Messages</h1>
      <Messages.UnreadIndicator variant="badge" />
      <Messages.NewConversation />
    </header>
    
    <div class="messages-body">
      <Messages.Conversations currentUserId="me" />
      <div class="thread-area">
        <Messages.Thread />
        <Messages.Composer />
      </div>
    </div>
  </div>
</Messages.Root>

<style>
  .messages-with-creation {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .messages-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .messages-header h1 {
    flex: 1;
    margin: 0;
  }
  
  .messages-body {
    flex: 1;
    display: grid;
    grid-template-columns: 320px 1fr;
    overflow: hidden;
  }
  
  .thread-area {
    display: flex;
    flex-direction: column;
  }
</style>
```

### **Example 3: With Media Attachments**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  
  let mediaUpload: typeof Messages.MediaUpload;
  let attachedMediaIds = $state<string[]>([]);
  
  const handlers = {
    onFetchConversations: async () => {
      const response = await fetch('/api/messages/conversations');
      return await response.json();
    },
    onFetchMessages: async (conversationId) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}`);
      return await response.json();
    },
    onSendMessage: async (conversationId, content, mediaIds) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mediaIds }),
      });
      return await response.json();
    },
    onUploadMedia: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    },
  };
  
  function handleAttachmentsChange(mediaIds: string[]) {
    attachedMediaIds = mediaIds;
  }
</script>

<Messages.Root {handlers}>
  <div class="messages-with-media">
    <Messages.Conversations currentUserId="me" />
    
    <div class="thread-area">
      <Messages.Thread />
      
      <div class="composer-area">
        <Messages.MediaUpload
          bind:this={mediaUpload}
          maxAttachments={4}
          onAttachmentsChange={handleAttachmentsChange}
        />
        <Messages.Composer />
      </div>
    </div>
  </div>
</Messages.Root>

<style>
  .messages-with-media {
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 100vh;
  }
  
  .thread-area {
    display: flex;
    flex-direction: column;
  }
  
  .composer-area {
    border-top: 1px solid var(--border-color);
    padding: 1rem;
  }
</style>
```

### **Example 4: Integration with Adapter**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
  import { createMessagesAdapter } from '@greater/adapters';
  
  const adapter = createMessagesAdapter({
    endpoint: 'https://api.example.com/graphql',
    authentication: {
      token: 'your-auth-token',
    },
    realtime: true, // Enable WebSocket
  });
  
  const handlers = {
    onFetchConversations: adapter.fetchConversations,
    onFetchMessages: adapter.fetchMessages,
    onSendMessage: adapter.sendMessage,
    onMarkRead: adapter.markRead,
    onDeleteMessage: adapter.deleteMessage,
    onCreateConversation: adapter.createConversation,
    onSearchParticipants: adapter.searchUsers,
    onUploadMedia: adapter.uploadMedia,
  };
</script>

<Messages.Root {handlers}>
  <div class="adapter-messages">
    <Messages.UnreadIndicator variant="badge" />
    <Messages.NewConversation />
    <Messages.Conversations currentUserId="me" />
    <Messages.Thread />
    <Messages.Composer />
    <Messages.MediaUpload />
  </div>
</Messages.Root>
```

### **Example 5: Custom Styling**

```svelte
<script lang="ts">
  import * as Messages from '@greater/fediverse/Messages';
</script>

<Messages.Root {handlers} class="custom-messages">
  <Messages.Conversations class="custom-conversations" />
  <Messages.Thread class="custom-thread" />
  <Messages.Composer class="custom-composer" />
</Messages.Root>

<style>
  :global(.custom-messages) {
    --primary-color: #7c3aed;
    --bg-primary: #faf9fb;
    --border-color: #e9d5ff;
  }
  
  :global(.custom-conversations) {
    background: linear-gradient(to bottom, #f3e8ff, #ffffff);
  }
  
  :global(.custom-thread) {
    background: url('/patterns/subtle-grid.png');
  }
  
  :global(.custom-composer) {
    border-radius: 1rem;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

---

## 🔒 Security Considerations

### **Message Privacy**

Always ensure messages are private and access-controlled:

```typescript
// Server-side middleware
const checkConversationAccess = async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation.participantIds.includes(req.user.id)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

app.get('/api/messages/conversations/:id', checkConversationAccess, async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.id });
  res.json(messages);
});
```

### **Content Sanitization**

Sanitize all user-generated content:

```typescript
import { sanitizeHTML } from '$lib/security';

const handlers = {
  onSendMessage: async (conversationId, content) => {
    // Sanitize message content
    const sanitizedContent = sanitizeHTML(content);
    
    const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: sanitizedContent }),
    });
    
    return await response.json();
  },
};
```

### **Rate Limiting**

Prevent spam and abuse:

```typescript
import { RateLimiter } from '$lib/rate-limiter';

const messageLimiter = new RateLimiter({
  maxRequests: 60, // 60 messages
  windowMs: 60 * 1000, // per minute
});

const handlers = {
  onSendMessage: async (conversationId, content) => {
    const userId = getCurrentUserId();
    
    if (!await messageLimiter.checkLimit(userId)) {
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

### **End-to-End Encryption**

For platforms that support E2EE:

```typescript
import { encryptMessage, decryptMessage } from '$lib/crypto';

const handlers = {
  onSendMessage: async (conversationId, content) => {
    // Encrypt message before sending
    const encryptedContent = await encryptMessage(content, conversationId);
    
    const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: encryptedContent, encrypted: true }),
    });
    
    return await response.json();
  },
  
  onFetchMessages: async (conversationId) => {
    const response = await fetch(`/api/messages/conversations/${conversationId}`);
    const messages = await response.json();
    
    // Decrypt messages
    return Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        content: msg.encrypted ? await decryptMessage(msg.content, conversationId) : msg.content,
      }))
    );
  },
};
```

---

## ♿ Accessibility

The Messages components are built with accessibility as a core principle:

### **Keyboard Navigation**

- **Tab**: Navigate between conversations, messages, and controls
- **Enter**: Select conversation, send message
- **Escape**: Close modals, cancel operations
- **Arrow Keys**: Navigate message list, conversation list
- **Ctrl/Cmd + Enter**: Send message (in composer)

### **Screen Reader Support**

All components include:
- Semantic HTML elements
- ARIA labels and roles
- Status announcements for new messages
- Live regions for dynamic content
- Descriptive alt text for media

### **Focus Management**

- Visible focus indicators
- Logical tab order
- Focus trapping in modals
- Focus restoration on close
- Auto-focus on conversation selection

### **Example: Accessible Messages**

```svelte
<Messages.Root {handlers}>
  <div role="application" aria-label="Direct messages">
    <section aria-label="Conversations list">
      <Messages.Conversations currentUserId="me" />
    </section>
    
    <main aria-label="Selected conversation">
      <Messages.Thread />
      <Messages.Composer />
    </main>
  </div>
</Messages.Root>
```

---

## ⚡ Performance Optimization

### **Lazy Loading Conversations**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let conversationsLoaded = $state(false);
  
  onMount(() => {
    // Defer conversation loading
    requestIdleCallback(() => {
      conversationsLoaded = true;
    });
  });
</script>

{#if conversationsLoaded}
  <Messages.Root {handlers}>
    <Messages.Conversations />
  </Messages.Root>
{:else}
  <div>Loading messages...</div>
{/if}
```

### **Message Virtualization**

For long conversation threads:

```svelte
<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  
  let scrollElement: HTMLElement | null = null;
  
  const messageVirtualizer = $derived(() =>
    scrollElement
      ? createVirtualizer({
          count: messages.length,
          getScrollElement: () => scrollElement,
          estimateSize: () => 100,
          overscan: 5,
        })
      : null
  );
</script>
```

### **Caching**

```typescript
import { lruCache } from '$lib/cache';

const conversationCache = lruCache({ max: 50, ttl: 5 * 60 * 1000 }); // 5 minutes

const handlers = {
  onFetchConversations: async () => {
    const cached = conversationCache.get('conversations');
    if (cached) return cached;
    
    const response = await fetch('/api/messages/conversations');
    const conversations = await response.json();
    
    conversationCache.set('conversations', conversations);
    return conversations;
  },
};
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import * as Messages from '@greater/fediverse/Messages';

test('sends a message', async () => {
  const onSendMessage = vi.fn().mockResolvedValue({
    id: '1',
    content: 'Hello',
    sender: { id: 'me', name: 'Me' },
    createdAt: new Date().toISOString(),
  });
  
  const { getByPlaceholderText, getByText } = render(Messages.Root, {
    handlers: { onSendMessage },
  });
  
  // Type message
  const input = getByPlaceholderText('Write a message...');
  await fireEvent.input(input, { target: { value: 'Hello' } });
  
  // Send
  await fireEvent.click(getByText('Send'));
  
  expect(onSendMessage).toHaveBeenCalledWith(expect.any(String), 'Hello', undefined);
});
```

### **Integration Tests**

```typescript
import { test, expect } from '@playwright/test';

test('messaging flow', async ({ page }) => {
  await page.goto('/messages');
  
  // Create new conversation
  await page.click('text=New Message');
  await page.fill('[placeholder="Search people..."]', 'johndoe');
  await page.click('text=@johndoe');
  await page.click('text=Start Conversation');
  
  // Send message
  await page.fill('[placeholder="Write a message..."]', 'Hello John!');
  await page.click('text=Send');
  
  // Verify message sent
  await expect(page.locator('text=Hello John!')).toBeVisible();
});
```

---

## 🔗 Related Components

- **[Notifications](/docs/components/Notifications)** - Message notifications
- **[Profile](/docs/components/Profile)** - View participant profiles
- **[Search](/docs/components/Search)** - Find users to message

---

## 📚 API Reference

### **Context API**

```typescript
// Create context
const context = Messages.createMessagesContext(handlers);

// Access context (within Messages.Root)
const { state, sendMessage, markRead } = Messages.getMessagesContext();
```

### **Helper Functions**

```typescript
import { formatMessageTime, getConversationName } from '@greater/fediverse/Messages';

// Format timestamp
const timeAgo = formatMessageTime('2024-01-01T12:00:00Z');

// Get conversation display name
const name = getConversationName(conversation, currentUserId);
```

---

## 🎨 Theming

Messages components support CSS custom properties for theming:

```css
:root {
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
  --error-color: #f4211e;
  --success-color: #00ba7c;
}
```

---

## 📖 Further Reading

- [Messages API Specification](/docs/api/messages)
- [ActivityPub Direct Messages](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-directmessage)
- [WebSocket Integration Guide](/docs/guides/websocket)
- [End-to-End Encryption](/docs/guides/encryption)
- [Privacy Best Practices](/docs/privacy)

---

## 💬 Support

For questions, issues, or feature requests:
- GitHub Issues: [github.com/your-org/greater-components/issues](https://github.com/your-org/greater-components/issues)
- Discord: [discord.gg/your-server](https://discord.gg/your-server)
- Documentation: [docs.greater-components.dev](https://docs.greater-components.dev)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

