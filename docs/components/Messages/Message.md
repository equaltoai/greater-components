# Messages.Message

**Component**: Individual Message Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 78 passing tests

---

## 📋 Overview

`Messages.Message` renders an individual message within a conversation thread. It displays the message content, sender information, timestamp, media attachments, and provides interactive features like reactions, delete, and read receipts.

### **Key Features**:
- ✅ Display message content with proper formatting
- ✅ Show sender avatar and name
- ✅ Timestamp with smart formatting (relative or absolute)
- ✅ Media attachment preview (images, videos, files)
- ✅ Read receipt indicators
- ✅ Message reactions/emoji support
- ✅ Delete message functionality
- ✅ Copy message content
- ✅ Link preview cards
- ✅ Message grouping support
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Custom styling and theming
- ✅ Loading states for media
- ✅ Error handling for failed messages

### **What It Does**:

`Messages.Message` is the atomic component for displaying individual messages:

1. **Renders Content**: Displays message text with proper formatting and link detection
2. **Shows Metadata**: Displays sender info, timestamp, read status
3. **Media Handling**: Previews images, videos, and other attachments
4. **Interactive Actions**: Supports reactions, deletion, copying
5. **Visual Indicators**: Shows read receipts, sending status, errors
6. **Accessibility**: Provides semantic HTML and ARIA attributes

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
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const message: DirectMessage = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Hello! How are you?',
    sender: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    createdAt: new Date().toISOString(),
    read: true,
  };
  
  const currentUserId = 'me';
</script>

<Message {message} {currentUserId} />
```

### **With All Features**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const message: DirectMessage = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Check out this cool project: https://github.com/example/repo',
    sender: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    createdAt: '2025-10-12T10:30:00Z',
    read: true,
    mediaAttachments: [
      {
        url: 'https://example.com/image.jpg',
        type: 'image',
        previewUrl: 'https://example.com/image-thumb.jpg',
      },
    ],
  };
  
  const currentUserId = 'me';
  
  const handleDelete = async (messageId: string) => {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: 'DELETE',
    });
    console.log('Message deleted');
  };
  
  const handleReact = async (messageId: string, emoji: string) => {
    await fetch(`/api/messages/${messageId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    });
    console.log(`Reacted with ${emoji}`);
  };
</script>

<Message 
  {message} 
  {currentUserId}
  onDelete={handleDelete}
  onReact={handleReact}
  showAvatar={true}
  showTimestamp={true}
  groupedWithPrevious={false}
  class="custom-message"
/>
```

### **With Custom Styling**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const message: DirectMessage = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'This message has custom styling!',
    sender: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    createdAt: new Date().toISOString(),
    read: true,
  };
</script>

<Message 
  {message} 
  currentUserId="me"
  class="custom-message"
/>

<style>
  :global(.custom-message) {
    --message-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --message-text-color: white;
    --message-border-radius: 1.5rem;
    --message-padding: 1rem 1.25rem;
  }
  
  :global(.custom-message .message-bubble) {
    background: var(--message-bg);
    color: var(--message-text-color);
    border-radius: var(--message-border-radius);
    padding: var(--message-padding);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `message` | `DirectMessage` | - | **Yes** | Message object to display |
| `currentUserId` | `string` | - | **Yes** | Current user's ID (to determine message alignment) |
| `onDelete` | `(messageId: string) => void \| Promise<void>` | `undefined` | No | Callback when delete button is clicked |
| `onReact` | `(messageId: string, emoji: string) => void \| Promise<void>` | `undefined` | No | Callback when reaction is added |
| `onCopy` | `(content: string) => void` | `undefined` | No | Callback when content is copied |
| `showAvatar` | `boolean` | `true` | No | Whether to show sender avatar |
| `showTimestamp` | `boolean` | `true` | No | Whether to show message timestamp |
| `groupedWithPrevious` | `boolean` | `false` | No | Whether message is grouped with previous (hides avatar/timestamp) |
| `enableLinkPreviews` | `boolean` | `true` | No | Whether to show link preview cards |
| `enableReactions` | `boolean` | `false` | No | Whether to enable reactions |
| `class` | `string` | `''` | No | Custom CSS class for the container |

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
  
  /** Creation timestamp (ISO 8601) */
  createdAt: string;
  
  /** Whether message has been read */
  read: boolean;
  
  /** Optional media attachments */
  mediaAttachments?: Array<{
    url: string;
    type: string;
    previewUrl?: string;
  }>;
  
  /** Optional reactions */
  reactions?: Array<{
    emoji: string;
    userId: string;
    username: string;
  }>;
  
  /** Optional link preview */
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
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

## 📤 Events

### **onDelete**

Called when user deletes a message:

```typescript
const handleDelete = async (messageId: string) => {
  const confirmed = confirm('Delete this message?');
  if (!confirmed) return;
  
  await fetch(`/api/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });
  
  // Update local state
  const context = Messages.getMessagesContext();
  context.updateState({
    messages: context.state.messages.filter(m => m.id !== messageId),
  });
};
```

### **onReact**

Called when user reacts to a message:

```typescript
const handleReact = async (messageId: string, emoji: string) => {
  await fetch(`/api/messages/${messageId}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ emoji }),
  });
};
```

### **onCopy**

Called when user copies message content:

```typescript
const handleCopy = (content: string) => {
  console.log('Copied:', content);
  showToast('Message copied to clipboard');
};
```

---

## 💡 Examples

### **Example 1: Basic Message Display**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const messages: DirectMessage[] = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: 'Hey, how are you doing?',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T09:30:00Z',
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      content: "I'm doing great! Just finished a big project.",
      sender: {
        id: 'me',
        username: 'me',
        displayName: 'Me',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      },
      createdAt: '2025-10-12T09:31:00Z',
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      content: 'That\'s awesome! What kind of project was it?',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T09:32:00Z',
      read: true,
    },
  ];
  
  const currentUserId = 'me';
</script>

<div class="message-list">
  {#each messages as message}
    <Message {message} {currentUserId} />
  {/each}
</div>

<style>
  .message-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
```

### **Example 2: With Message Grouping**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const messages: DirectMessage[] = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: 'Hey',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T09:30:00Z',
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      content: 'How are you?',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T09:30:15Z',
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      content: 'Got time to chat?',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T09:30:30Z',
      read: true,
    },
  ];
  
  const currentUserId = 'me';
  
  // Group messages from same sender within 5 minutes
  const shouldGroup = (current: DirectMessage, previous: DirectMessage | null): boolean => {
    if (!previous) return false;
    if (current.sender.id !== previous.sender.id) return false;
    
    const currentTime = new Date(current.createdAt).getTime();
    const previousTime = new Date(previous.createdAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (currentTime - previousTime) < fiveMinutes;
  };
</script>

<div class="grouped-messages">
  {#each messages as message, index}
    {@const previous = index > 0 ? messages[index - 1] : null}
    {@const grouped = shouldGroup(message, previous)}
    
    <Message 
      {message} 
      {currentUserId}
      groupedWithPrevious={grouped}
      showAvatar={!grouped}
      showTimestamp={!grouped}
    />
  {/each}
</div>

<style>
  .grouped-messages {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
```

### **Example 3: With Media Attachments**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const messages: DirectMessage[] = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: 'Check out these photos from my vacation!',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T10:00:00Z',
      read: true,
      mediaAttachments: [
        {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
          type: 'image',
          previewUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        },
        {
          url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
          type: 'image',
          previewUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
        },
      ],
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      content: 'Wow! These are amazing! 😍',
      sender: {
        id: 'me',
        username: 'me',
        displayName: 'Me',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      },
      createdAt: '2025-10-12T10:01:00Z',
      read: true,
    },
  ];
  
  const currentUserId = 'me';
</script>

<div class="messages-with-media">
  {#each messages as message}
    <Message {message} {currentUserId} />
  {/each}
</div>

<style>
  .messages-with-media {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
```

### **Example 4: With Reactions and Actions**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let messages = $state<DirectMessage[]>([
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: 'Who wants to grab lunch today?',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T11:00:00Z',
      read: true,
      reactions: [
        { emoji: '👍', userId: 'me', username: 'me' },
        { emoji: '👍', userId: 'user-2', username: 'janedoe' },
        { emoji: '🍕', userId: 'user-3', username: 'bob' },
      ],
    },
  ]);
  
  const handleDelete = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
      });
      
      messages = messages.filter(m => m.id !== messageId);
      console.log('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };
  
  const handleReact = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: JSON.stringify({ emoji }),
      });
      
      // Update local state
      messages = messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          return {
            ...msg,
            reactions: [
              ...reactions,
              { emoji, userId: $authStore.userId, username: $authStore.username },
            ],
          };
        }
        return msg;
      });
      
      console.log(`Reacted with ${emoji}`);
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log('Content copied to clipboard');
  };
</script>

<div class="messages-with-actions">
  {#each messages as message}
    <Message 
      {message} 
      currentUserId={$authStore.userId}
      onDelete={handleDelete}
      onReact={handleReact}
      onCopy={handleCopy}
      enableReactions={true}
    />
  {/each}
</div>

<style>
  .messages-with-actions {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
```

### **Example 5: With Link Previews and Smart Formatting**

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  import type { DirectMessage } from '@equaltoai/greater-components-fediverse/Messages';
  
  const messages: DirectMessage[] = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: 'Check out this amazing article: https://example.com/article',
      sender: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      createdAt: '2025-10-12T12:00:00Z',
      read: true,
      linkPreview: {
        url: 'https://example.com/article',
        title: 'The Future of Web Development',
        description: 'Exploring the latest trends and technologies shaping the web development landscape in 2025.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      },
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      content: `Here's a long message with multiple lines.

It has paragraphs separated by empty lines.

And it contains various formatting:
- Bold text
- *Italic text*
- Links like https://github.com
- Mentions like @username

Pretty cool, right?`,
      sender: {
        id: 'me',
        username: 'me',
        displayName: 'Me',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      },
      createdAt: '2025-10-12T12:05:00Z',
      read: true,
    },
  ];
  
  const currentUserId = 'me';
</script>

<div class="messages-with-previews">
  {#each messages as message}
    <Message 
      {message} 
      {currentUserId}
      enableLinkPreviews={true}
    />
  {/each}
</div>

<style>
  .messages-with-previews {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
```

---

## 🔒 Security Considerations

### **Content Sanitization**

Always sanitize message content before display:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
};
```

### **Link Safety**

Protect users from malicious links:

```typescript
const makeLinksSafe = (url: string): string => {
  // Ensure all links open in new tab with noopener noreferrer
  return url;
};

// In your link rendering:
<a 
  href={url} 
  target="_blank" 
  rel="noopener noreferrer"
  onclick={(e) => {
    // Optional: warn user about external links
    if (!url.startsWith(window.location.origin)) {
      const confirmed = confirm(`You're about to visit: ${url}\n\nDo you want to continue?`);
      if (!confirmed) e.preventDefault();
    }
  }}
>
  {linkText}
</a>
```

### **Media Validation**

Validate media attachments:

```typescript
const isValidMediaType = (type: string): boolean => {
  const allowedTypes = ['image', 'video', 'audio', 'document'];
  return allowedTypes.includes(type);
};

const isValidMediaUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
```

---

## ♿ Accessibility

### **Semantic HTML**

```svelte
<article 
  class="message"
  role="article"
  aria-label="Message from {message.sender.displayName}"
>
  <header class="message-header">
    <img 
      src={message.sender.avatar} 
      alt="{message.sender.displayName}'s avatar"
      role="img"
    />
    <h3 id="sender-{message.id}">{message.sender.displayName}</h3>
    <time 
      datetime={message.createdAt}
      aria-label="Sent at {formatTimestamp(message.createdAt)}"
    >
      {formatTimestamp(message.createdAt)}
    </time>
  </header>
  
  <div 
    class="message-content"
    aria-labelledby="sender-{message.id}"
  >
    {message.content}
  </div>
</article>
```

### **Keyboard Navigation**

- **Tab**: Navigate to message actions
- **Enter**: Activate action buttons
- **Escape**: Close action menu
- **Ctrl+C / Cmd+C**: Copy message content (when focused)

### **Screen Reader Support**

```svelte
<button 
  onclick={() => handleDelete(message.id)}
  aria-label="Delete message from {message.sender.displayName}"
>
  <svg aria-hidden="true">...</svg>
  <span class="sr-only">Delete</span>
</button>
```

---

## 🎨 Styling

### **CSS Custom Properties**

```css
.message {
  /* Layout */
  --message-padding: 0.75rem 1rem;
  --message-margin: 0.5rem 0;
  --message-max-width: 70%;
  
  /* Colors */
  --message-bg: #f7f9fa;
  --message-bg-me: #1da1f2;
  --message-text-color: #14171a;
  --message-text-color-me: #ffffff;
  
  /* Typography */
  --message-font-size: 0.9375rem;
  --message-line-height: 1.5;
  
  /* Border */
  --message-border-radius: 1rem;
  --message-border-color: transparent;
  
  /* Shadow */
  --message-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

### **Theme Example**

```svelte
<style>
  /* Dark mode theme */
  :global(.dark-mode .message) {
    --message-bg: #2c2f33;
    --message-bg-me: #5865f2;
    --message-text-color: #dcddde;
    --message-text-color-me: #ffffff;
  }
  
  /* Compact mode */
  :global(.compact .message) {
    --message-padding: 0.5rem 0.75rem;
    --message-margin: 0.25rem 0;
    --message-font-size: 0.875rem;
  }
</style>
```

---

## ⚡ Performance

### **Image Lazy Loading**

```svelte
<img 
  src={attachment.url}
  loading="lazy"
  decoding="async"
  alt="Message attachment"
/>
```

### **Virtualization**

For threads with hundreds of messages, use virtual scrolling:

```svelte
<script lang="ts">
  import VirtualList from 'svelte-virtual-list';
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  
  const messages = [...]; // Large array of messages
</script>

<VirtualList items={messages} let:item>
  <Message message={item} currentUserId="me" />
</VirtualList>
```

### **Memoization**

Memoize expensive operations:

```svelte
<script lang="ts">
  import { Message } from '@equaltoai/greater-components-fediverse/Messages';
  
  const formattedContent = $derived(() => {
    // Expensive formatting operation
    return formatMessageContent(message.content);
  });
</script>
```

---

## 🧪 Testing

### **Component Test**

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Message } from '@equaltoai/greater-components-fediverse/Messages';

test('renders message content', () => {
  const message = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Hello, world!',
    sender: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
    },
    createdAt: new Date().toISOString(),
    read: true,
  };
  
  const { getByText } = render(Message, {
    props: { message, currentUserId: 'me' },
  });
  
  expect(getByText('Hello, world!')).toBeInTheDocument();
});

test('calls onDelete when delete button clicked', async () => {
  const onDelete = vi.fn();
  const message = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Test message',
    sender: {
      id: 'me',
      username: 'me',
      displayName: 'Me',
    },
    createdAt: new Date().toISOString(),
    read: true,
  };
  
  const { getByRole } = render(Message, {
    props: { message, currentUserId: 'me', onDelete },
  });
  
  const deleteButton = getByRole('button', { name: /delete/i });
  await fireEvent.click(deleteButton);
  
  expect(onDelete).toHaveBeenCalledWith('msg-1');
});
```

### **Accessibility Test**

```typescript
import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { Message } from '@equaltoai/greater-components-fediverse/Messages';

test('has no accessibility violations', async () => {
  const message = {
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'Accessible message',
    sender: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
    },
    createdAt: new Date().toISOString(),
    read: true,
  };
  
  const { container } = render(Message, {
    props: { message, currentUserId: 'me' },
  });
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🔗 Related Components

- [Messages.Thread](/docs/components/Messages/Thread.md) - Message thread container
- [Messages.Composer](/docs/components/Messages/Composer.md) - Send messages
- [Messages.Root](/docs/components/Messages/Root.md) - Context provider

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Content Formatting Guide](/docs/guides/content-formatting.md)
- [Accessibility Best Practices](/docs/guides/accessibility.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

