# Compose Utilities: GraphQLAdapter

**Module**: GraphQL Integration Adapter  
**Package**: `@greater/fediverse`  
**Export**: `Compose.GraphQLAdapter` or direct imports

---

## 📋 Overview

The `GraphQLAdapter` utility provides high-level handlers for integrating Compose components with a GraphQL API. It includes optimistic updates, error handling, media upload orchestration, and thread posting support for creating statuses in Fediverse applications.

### **Key Features**:
- ✅ **GraphQL mutation wrappers** for creating statuses
- ✅ **Optimistic updates** for instant UI feedback
- ✅ **Media upload orchestration** with progress tracking
- ✅ **Thread posting** with automatic reply chaining
- ✅ **Error handling** and rollback
- ✅ **Type-safe** GraphQL operations
- ✅ **Cache management** for Apollo/URQL
- ✅ **TypeScript** fully typed

---

## 📦 Installation

```bash
npm install @greater/fediverse
npm install @urql/svelte graphql  # or @apollo/client
```

---

## 🔧 API Reference

### **Functions**

#### **createGraphQLComposeHandlers()**

Create compose handlers that integrate with a GraphQL client.

```typescript
function createGraphQLComposeHandlers(
  client: GraphQLClient,
  options?: ComposeHandlerOptions
): ComposeHandlers
```

**Parameters**:
- `client`: GraphQL client instance (URQL or Apollo)
- `options`: Handler configuration options

**Returns**: Object with `onSubmit`, `onMediaUpload`, etc.

**Example**:
```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';
import { getContextClient } from '@urql/svelte';

const client = getContextClient();
const handlers = createGraphQLComposeHandlers(client);

// Use in Compose.Root
<Compose.Root handlers={handlers}>
  <Compose.Editor />
  <Compose.Submit />
</Compose.Root>
```

---

#### **createOptimisticStatus()**

Create an optimistic status object for immediate UI updates.

```typescript
function createOptimisticStatus(
  content: string,
  options?: OptimisticStatusOptions
): Status
```

**Parameters**:
- `content`: Status content
- `options`: Additional status properties

**Returns**: Optimistic status object.

**Example**:
```typescript
import { createOptimisticStatus } from '@greater/fediverse/Compose';

const optimisticStatus = createOptimisticStatus('Hello world!', {
  visibility: 'public',
  author: currentUser,
  mediaAttachments: []
});

// Add to cache immediately
cache.writeFragment({
  id: cache.identify(optimisticStatus),
  fragment: STATUS_FRAGMENT,
  data: optimisticStatus
});
```

---

#### **createOptimisticComposeHandlers()**

Create handlers with optimistic updates enabled.

```typescript
function createOptimisticComposeHandlers(
  client: GraphQLClient,
  options: OptimisticHandlerOptions
): ComposeHandlers
```

**Parameters**:
- `client`: GraphQL client
- `options`: Options including user info for optimistic updates

**Returns**: Handlers with optimistic update support.

**Example**:
```typescript
import { createOptimisticComposeHandlers } from '@greater/fediverse/Compose';

const handlers = createOptimisticComposeHandlers(client, {
  currentUser: {
    id: 'user-123',
    username: 'alice',
    displayName: 'Alice Smith',
    avatar: '/avatars/alice.jpg'
  },
  onOptimisticUpdate: (status) => {
    console.log('Optimistic status created:', status);
  }
});
```

---

#### **createComposeHandlers()**

Create basic compose handlers (without optimistic updates).

```typescript
function createComposeHandlers(
  client: GraphQLClient
): ComposeHandlers
```

**Parameters**:
- `client`: GraphQL client

**Returns**: Basic compose handlers.

**Example**:
```typescript
import { createComposeHandlers } from '@greater/fediverse/Compose';

const handlers = createComposeHandlers(client);
```

---

## 💡 Usage Examples

### **Example 1: Basic GraphQL Integration**

Simple integration with URQL:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';
import { getContextClient } from '@urql/svelte';
import { Compose } from '@greater/fediverse';

const client = getContextClient();
const handlers = createGraphQLComposeHandlers(client);

<Compose.Root handlers={handlers}>
  <Compose.Editor autofocus />
  <Compose.MediaUpload />
  <Compose.Submit />
</Compose.Root>
```

### **Example 2: With Optimistic Updates**

Enable optimistic UI updates:

```typescript
import { createOptimisticComposeHandlers } from '@greater/fediverse/Compose';
import { getContextClient } from '@urql/svelte';

const client = getContextClient();
const currentUser = {
  id: 'user-123',
  username: 'alice',
  displayName: 'Alice Smith',
  avatar: '/avatars/alice.jpg'
};

const handlers = createOptimisticComposeHandlers(client, {
  currentUser,
  onOptimisticUpdate: (optimisticStatus) => {
    // Status appears in timeline immediately
    console.log('Optimistic status:', optimisticStatus);
  },
  onSuccess: (realStatus) => {
    // Real status received from server
    console.log('Real status:', realStatus);
  },
  onError: (error) => {
    // Rollback optimistic update
    console.error('Failed to create status:', error);
  }
});

<Compose.Root handlers={handlers}>
  <Compose.Editor />
  <Compose.Submit />
</Compose.Root>
```

### **Example 3: Custom GraphQL Mutations**

Use custom mutations:

```typescript
import { createComposeHandlers } from '@greater/fediverse/Compose';
import { gql } from '@urql/svelte';

const CREATE_STATUS_MUTATION = gql`
  mutation CreateStatus($input: CreateStatusInput!) {
    createStatus(input: $input) {
      id
      content
      createdAt
      visibility
      author {
        id
        username
        displayName
        avatar
      }
      mediaAttachments {
        id
        url
        type
      }
    }
  }
`;

const handlers = {
  async onSubmit(data) {
    const result = await client.mutation(CREATE_STATUS_MUTATION, {
      input: {
        status: data.content,
        visibility: data.visibility,
        inReplyToId: data.inReplyTo,
        mediaIds: data.mediaIds,
        sensitive: data.sensitive,
        spoilerText: data.contentWarning
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data.createStatus;
  }
};
```

### **Example 4: Media Upload Integration**

Handle media uploads with GraphQL:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';
import { gql } from '@urql/svelte';

const UPLOAD_MEDIA_MUTATION = gql`
  mutation UploadMedia($file: Upload!, $description: String, $focus: String) {
    uploadMedia(file: $file, description: $description, focus: $focus) {
      id
      url
      previewUrl
      type
      description
    }
  }
`;

const handlers = createGraphQLComposeHandlers(client, {
  async onMediaUpload(files) {
    const mediaIds = [];

    for (const file of files) {
      const result = await client.mutation(UPLOAD_MEDIA_MUTATION, {
        file: file.file,
        description: file.description,
        focus: file.focalPoint ? `${file.focalPoint.x},${file.focalPoint.y}` : null
      });

      if (result.error) {
        throw new Error(`Failed to upload ${file.file.name}`);
      }

      mediaIds.push(result.data.uploadMedia.id);
    }

    return mediaIds;
  }
});
```

### **Example 5: Thread Posting**

Post threads with GraphQL:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';

const handlers = createGraphQLComposeHandlers(client, {
  async onSubmitThread(posts) {
    let previousId = null;

    for (const post of posts) {
      const result = await client.mutation(CREATE_STATUS_MUTATION, {
        input: {
          status: post.content,
          visibility: post.visibility,
          inReplyToId: previousId,
          mediaIds: post.mediaIds
        }
      });

      if (result.error) {
        throw new Error('Failed to post thread');
      }

      previousId = result.data.createStatus.id;

      // Small delay between posts
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
});

<Compose.ThreadComposer
  onSubmitThread={handlers.onSubmitThread}
  maxPosts={10}
/>
```

### **Example 6: Error Handling and Retry**

Implement retry logic:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';

async function retryMutation(mutationFn, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await mutationFn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);

      // Wait before retry (exponential backoff)
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw lastError;
}

const handlers = createGraphQLComposeHandlers(client, {
  async onSubmit(data) {
    return retryMutation(async () => {
      const result = await client.mutation(CREATE_STATUS_MUTATION, {
        input: mapDataToInput(data)
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data.createStatus;
    });
  }
});
```

### **Example 7: Cache Updates**

Update Apollo/URQL cache after creating status:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';

const handlers = createGraphQLComposeHandlers(client, {
  async onSubmit(data) {
    const result = await client.mutation(CREATE_STATUS_MUTATION, {
      input: mapDataToInput(data)
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    const newStatus = result.data.createStatus;

    // Update cache
    client.cache.updateQuery(
      { query: TIMELINE_QUERY },
      (data) => {
        if (!data) return data;

        return {
          ...data,
          timeline: {
            ...data.timeline,
            statuses: [newStatus, ...data.timeline.statuses]
          }
        };
      }
    );

    return newStatus;
  }
});
```

### **Example 8: Apollo Client Integration**

Use with Apollo Client:

```typescript
import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose';
import { useMutation } from '@apollo/client';

const [createStatus] = useMutation(CREATE_STATUS_MUTATION);

const handlers = {
  async onSubmit(data) {
    try {
      const result = await createStatus({
        variables: {
          input: {
            status: data.content,
            visibility: data.visibility,
            mediaIds: data.mediaIds
          }
        },
        update(cache, { data }) {
          // Update cache
          cache.modify({
            fields: {
              timeline(existingTimeline = { statuses: [] }) {
                const newStatus = cache.writeFragment({
                  data: data.createStatus,
                  fragment: STATUS_FRAGMENT
                });

                return {
                  ...existingTimeline,
                  statuses: [newStatus, ...existingTimeline.statuses]
                };
              }
            }
          });
        },
        optimisticResponse: {
          createStatus: createOptimisticStatus(data.content, {
            visibility: data.visibility,
            author: currentUser
          })
        }
      });

      return result.data.createStatus;
    } catch (error) {
      throw new Error('Failed to create status');
    }
  }
};
```

---

## 🎨 GraphQL Schema Example

Example schema for Fediverse status creation:

```graphql
type Mutation {
  """Create a new status"""
  createStatus(input: CreateStatusInput!): Status!
  
  """Upload media attachment"""
  uploadMedia(
    file: Upload!
    description: String
    focus: String
  ): MediaAttachment!
  
  """Delete a status"""
  deleteStatus(id: ID!): Boolean!
}

input CreateStatusInput {
  """Status content (required)"""
  status: String!
  
  """Visibility level"""
  visibility: Visibility = PUBLIC
  
  """ID of status being replied to"""
  inReplyToId: ID
  
  """Media attachment IDs"""
  mediaIds: [ID!]
  
  """Whether status contains sensitive content"""
  sensitive: Boolean
  
  """Content warning text"""
  spoilerText: String
  
  """Language code"""
  language: String
  
  """Poll options (if creating a poll)"""
  poll: PollInput
}

enum Visibility {
  PUBLIC
  UNLISTED
  PRIVATE
  DIRECT
}

type Status {
  id: ID!
  content: String!
  createdAt: DateTime!
  visibility: Visibility!
  sensitive: Boolean!
  spoilerText: String
  
  author: Account!
  inReplyTo: Status
  mediaAttachments: [MediaAttachment!]!
  mentions: [Account!]!
  tags: [Tag!]!
  
  repliesCount: Int!
  reblogsCount: Int!
  favouritesCount: Int!
}

type MediaAttachment {
  id: ID!
  type: MediaType!
  url: String!
  previewUrl: String
  description: String
  meta: MediaMeta
}

enum MediaType {
  IMAGE
  VIDEO
  GIFV
  AUDIO
  UNKNOWN
}
```

---

## 🧪 Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createGraphQLComposeHandlers, createOptimisticStatus } from '@greater/fediverse/Compose';

describe('GraphQLAdapter', () => {
  const mockClient = {
    mutation: vi.fn()
  };

  beforeEach(() => {
    mockClient.mutation.mockClear();
  });

  it('creates compose handlers', () => {
    const handlers = createGraphQLComposeHandlers(mockClient);
    
    expect(handlers).toHaveProperty('onSubmit');
    expect(typeof handlers.onSubmit).toBe('function');
  });

  it('calls mutation on submit', async () => {
    mockClient.mutation.mockResolvedValue({
      data: {
        createStatus: {
          id: 'status-123',
          content: 'Test post'
        }
      }
    });

    const handlers = createGraphQLComposeHandlers(mockClient);
    
    const result = await handlers.onSubmit({
      content: 'Test post',
      visibility: 'public'
    });

    expect(mockClient.mutation).toHaveBeenCalled();
    expect(result.id).toBe('status-123');
  });

  it('creates optimistic status', () => {
    const status = createOptimisticStatus('Hello world', {
      visibility: 'public',
      author: {
        id: 'user-123',
        username: 'alice'
      }
    });

    expect(status.content).toBe('Hello world');
    expect(status.visibility).toBe('public');
    expect(status.author.username).toBe('alice');
    expect(status.id).toContain('optimistic-');
  });

  it('handles mutation errors', async () => {
    mockClient.mutation.mockResolvedValue({
      error: new Error('Network error')
    });

    const handlers = createGraphQLComposeHandlers(mockClient);

    await expect(
      handlers.onSubmit({ content: 'Test' })
    ).rejects.toThrow();
  });
});
```

---

## 🔒 Security Considerations

### **Input Sanitization**

Always sanitize content before sending to server:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const handlers = createGraphQLComposeHandlers(client, {
  async onSubmit(data) {
    // Sanitize content
    const cleanContent = DOMPurify.sanitize(data.content);

    const result = await client.mutation(CREATE_STATUS_MUTATION, {
      input: {
        ...data,
        status: cleanContent
      }
    });

    return result.data.createStatus;
  }
});
```

### **Rate Limiting**

Implement client-side rate limiting:

```typescript
class RateLimiter {
  private lastRequest = 0;
  private readonly minInterval = 1000; // 1 second

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequest = Date.now();
    return fn();
  }
}

const rateLimiter = new RateLimiter();

const handlers = createGraphQLComposeHandlers(client, {
  async onSubmit(data) {
    return rateLimiter.throttle(() =>
      client.mutation(CREATE_STATUS_MUTATION, { input: data })
    );
  }
});
```

---

## 🔗 Related

- [Compose.Root](./Root.md) - Main compose component
- [@greater/adapters](../../adapters/README.md) - Backend adapters

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [URQL Documentation](https://formidable.com/open-source/urql/docs/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Mastodon API Documentation](https://docs.joinmastodon.org/methods/statuses/)

---

## ❓ FAQ

### **Q: Does this work with REST APIs?**

This adapter is designed for GraphQL. For REST APIs, create custom handlers:

```typescript
const restHandlers = {
  async onSubmit(data) {
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### **Q: How do I handle file uploads?**

Use GraphQL Upload scalar:

```typescript
import { gql } from '@urql/svelte';

const UPLOAD_MUTATION = gql`
  mutation UploadMedia($file: Upload!) {
    uploadMedia(file: $file) {
      id
      url
    }
  }
`;

// File will be sent as multipart/form-data
```

### **Q: Can I use this with different GraphQL clients?**

Yes, it's designed to be client-agnostic. Just ensure your client has a `.mutation()` method.

### **Q: How do I rollback optimistic updates on error?**

Most GraphQL clients handle this automatically. For manual control:

```typescript
let optimisticId;

try {
  optimisticId = addOptimisticStatus();
  const result = await createStatus();
} catch (error) {
  removeOptimisticStatus(optimisticId);
  throw error;
}
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

