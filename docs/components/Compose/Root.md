# Compose.Root

**Component**: Context Provider & Form Container  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.Root` is the foundational component for all post composition functionality. It creates and provides the Compose context to all child components, managing shared state, event handlers, and form submission. All other Compose components **must** be nested inside `Compose.Root` to function properly.

### **Key Features**:
- ✅ Centralized state management for compose operations
- ✅ Shared event handlers across child components
- ✅ Character limit tracking and enforcement
- ✅ Form submission handling with validation
- ✅ Error handling and display
- ✅ Loading states during submission
- ✅ Configurable character limits and settings
- ✅ Type-safe context API
- ✅ Accessible form structure

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit({ content, visibility }) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: content,
        visibility
      })
    });
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor autofocus />
  <Compose.CharacterCount />
  <Compose.VisibilitySelect />
  <Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `config` | `ComposeConfig` | `{}` | No | Configuration options for the composer |
| `handlers` | `ComposeHandlers` | `{}` | No | Event handlers for compose operations |
| `initialState` | `Partial<ComposeState>` | `{}` | No | Initial state values |
| `children` | `Snippet` | - | No | Child components to render |

### **ComposeConfig Interface**:

```typescript
interface ComposeConfig {
  /**
   * Maximum character limit for posts
   * @default 500
   */
  characterLimit?: number;

  /**
   * Allow media attachments
   * @default true
   */
  allowMedia?: boolean;

  /**
   * Maximum number of media attachments
   * @default 4
   */
  maxMediaAttachments?: number;

  /**
   * Allow polls
   * @default true
   */
  allowPolls?: boolean;

  /**
   * Allow content warnings (spoiler text)
   * @default true
   */
  allowContentWarnings?: boolean;

  /**
   * Default post visibility
   * @default 'public'
   */
  defaultVisibility?: PostVisibility;

  /**
   * Enable markdown formatting
   * @default false
   */
  enableMarkdown?: boolean;

  /**
   * Placeholder text for editor
   * @default "What's on your mind?"
   */
  placeholder?: string;

  /**
   * Custom CSS class
   * @default ''
   */
  class?: string;
}
```

### **ComposeHandlers Interface**:

```typescript
interface ComposeHandlers {
  /**
   * Called when post is submitted
   * Receives post data and should handle API submission
   */
  onSubmit?: (data: {
    content: string;
    visibility: PostVisibility;
    contentWarning?: string;
    mediaAttachments?: ComposeAttachment[];
    inReplyTo?: string;
  }) => Promise<void> | void;

  /**
   * Called when media file is uploaded
   * Should return media info from server
   */
  onMediaUpload?: (file: File) => Promise<MediaAttachment>;

  /**
   * Called when media is removed
   */
  onMediaRemove?: (id: string) => void;

  /**
   * Called when draft is saved
   */
  onSaveDraft?: (content: string) => void;

  /**
   * Called when compose is cancelled
   */
  onCancel?: () => void;
}
```

### **ComposeState Interface**:

```typescript
interface ComposeState {
  /** Post content text */
  content: string;

  /** Content warning (spoiler) text */
  contentWarning: string;

  /** Post visibility setting */
  visibility: PostVisibility;

  /** Attached media files */
  mediaAttachments: ComposeAttachment[];

  /** Whether compose is submitting */
  submitting: boolean;

  /** Submit error if any */
  error: Error | null;

  /** Current character count */
  characterCount: number;

  /** Whether character limit is exceeded */
  overLimit: boolean;

  /** ID of status being replied to */
  inReplyTo?: string;

  /** Whether content warning is enabled */
  contentWarningEnabled: boolean;
}
```

### **PostVisibility Type**:

```typescript
type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';
```

- **`public`** - Visible to everyone, shown in public timelines
- **`unlisted`** - Visible to everyone but not in public timelines
- **`private`** - Only visible to followers
- **`direct`** - Only visible to mentioned users

---

## 📤 Events

The Root component handles form submission and delegates to child components for user interactions. Events are handled through the `handlers` prop:

```typescript
// Submit event
onSubmit?: (data: {
  content: string;
  visibility: PostVisibility;
  contentWarning?: string;
  mediaAttachments?: ComposeAttachment[];
  inReplyTo?: string;
}) => Promise<void> | void;

// Media events
onMediaUpload?: (file: File) => Promise<MediaAttachment>;
onMediaRemove?: (id: string) => void;

// Draft events
onSaveDraft?: (content: string) => void;

// Cancel event
onCancel?: () => void;
```

---

## 💡 Examples

### **Example 1: Basic Post Composer**

Simple post composition with default settings:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let submitted = $state(false);
  let submittedContent = $state('');

  async function handleSubmit({ content, visibility }) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submittedContent = content;
    submitted = true;
    
    // Reset after 3 seconds
    setTimeout(() => {
      submitted = false;
    }, 3000);
  }
</script>

<div class="container">
  <h2>Create a Post</h2>
  
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus rows={4} />
    
    <div class="compose-footer">
      <Compose.CharacterCount />
      <Compose.VisibilitySelect />
      <Compose.Submit text="Post" />
    </div>
  </Compose.Root>

  {#if submitted}
    <div class="success-message">
      ✅ Posted successfully: "{submittedContent}"
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .compose-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }

  .success-message {
    margin-top: 1rem;
    padding: 1rem;
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 0.5rem;
    color: #155724;
  }
</style>
```

### **Example 2: Custom Character Limit**

Twitter-like composer with 280 character limit:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  const config = {
    characterLimit: 280,
    placeholder: "What's happening?",
    defaultVisibility: 'public' as const
  };

  async function handleSubmit({ content, visibility }) {
    const response = await fetch('https://api.example.com/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        text: content,
        visibility
      })
    });

    if (!response.ok) {
      throw new Error('Failed to post tweet');
    }

    const data = await response.json();
    console.log('Tweet posted:', data);
  }
</script>

<div class="tweet-composer">
  <Compose.Root {config} handlers={{ onSubmit: handleSubmit }}>
    <div class="tweet-input">
      <img src={user.avatar} alt={user.name} class="avatar" />
      <Compose.Editor autofocus />
    </div>
    
    <div class="tweet-actions">
      <div class="tweet-actions-left">
        <!-- Media, poll, emoji buttons could go here -->
      </div>
      <div class="tweet-actions-right">
        <Compose.CharacterCount showProgress={true} />
        <Compose.Submit text="Tweet" />
      </div>
    </div>
  </Compose.Root>
</div>

<style>
  .tweet-composer {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 16px;
    padding: 1rem;
  }

  .tweet-input {
    display: flex;
    gap: 0.75rem;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .tweet-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e1e8ed;
  }

  .tweet-actions-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
```

### **Example 3: Reply Composer**

Composer for replying to existing posts:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  interface Props {
    replyToStatus: {
      id: string;
      account: {
        username: string;
        displayName: string;
      };
      content: string;
    };
    onReplyPosted: () => void;
  }

  let { replyToStatus, onReplyPosted }: Props = $props();

  const initialState = {
    inReplyTo: replyToStatus.id,
    // Pre-fill with mention
    content: `@${replyToStatus.account.username} `
  };

  async function handleSubmit({ content, visibility, inReplyTo }) {
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: content,
        visibility,
        in_reply_to_id: inReplyTo
      })
    });

    if (response.ok) {
      onReplyPosted();
    }
  }
</script>

<div class="reply-composer">
  <div class="reply-context">
    <strong>{replyToStatus.account.displayName}</strong>
    <span class="username">@{replyToStatus.account.username}</span>
    <p>{replyToStatus.content}</p>
  </div>

  <Compose.Root 
    {initialState} 
    handlers={{ onSubmit: handleSubmit }}
    config={{ characterLimit: 500 }}
  >
    <Compose.Editor autofocus placeholder="Write your reply..." />
    
    <div class="reply-actions">
      <Compose.CharacterCount />
      <Compose.Submit text="Reply" />
    </div>
  </Compose.Root>
</div>

<style>
  .reply-composer {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1rem;
  }

  .reply-context {
    padding: 1rem;
    background: #f7f9fa;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9375rem;
  }

  .username {
    color: #536471;
    margin-left: 0.5rem;
  }

  .reply-context p {
    margin: 0.5rem 0 0;
    color: #0f1419;
  }

  .reply-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 4: With Media Upload**

Full-featured composer with media support:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  const config = {
    characterLimit: 500,
    allowMedia: true,
    maxMediaAttachments: 4
  };

  async function handleSubmit(data) {
    // Upload media first if any
    const mediaIds = [];
    if (data.mediaAttachments && data.mediaAttachments.length > 0) {
      for (const media of data.mediaAttachments) {
        if (media.serverId) {
          mediaIds.push(media.serverId);
        }
      }
    }

    // Create status with media
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: data.content,
        visibility: data.visibility,
        media_ids: mediaIds,
        sensitive: data.contentWarning ? true : false,
        spoiler_text: data.contentWarning
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to post');
    }

    return response.json();
  }

  async function handleMediaUpload(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload media');
    }

    return response.json(); // { id, url, preview_url }
  }

  function handleMediaRemove(id) {
    console.log('Media removed:', id);
    // Optionally call API to delete media
  }
</script>

<div class="full-composer">
  <h3>Create Post</h3>
  
  <Compose.Root 
    {config}
    handlers={{
      onSubmit: handleSubmit,
      onMediaUpload: handleMediaUpload,
      onMediaRemove: handleMediaRemove
    }}
  >
    <Compose.Editor 
      autofocus 
      placeholder="What's on your mind?"
      rows={4}
    />
    
    <Compose.MediaUpload maxFiles={4} />
    
    <div class="composer-toolbar">
      <div class="toolbar-left">
        <Compose.VisibilitySelect />
      </div>
      <div class="toolbar-right">
        <Compose.CharacterCount />
        <Compose.Submit text="Publish" />
      </div>
    </div>
  </Compose.Root>
</div>

<style>
  .full-composer {
    max-width: 800px;
    margin: 0 auto;
  }

  .composer-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
```

### **Example 5: With Error Handling**

Robust error handling and user feedback:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let errorMessage = $state<string | null>(null);
  let showSuccess = $state(false);

  async function handleSubmit(data) {
    errorMessage = null;

    try {
      const response = await fetch('/api/statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          status: data.content,
          visibility: data.visibility
        })
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Handle specific error codes
        if (response.status === 429) {
          throw new Error('You\'re posting too quickly. Please wait a moment.');
        } else if (response.status === 422) {
          throw new Error('Your post contains invalid content.');
        } else if (response.status === 401) {
          throw new Error('You must be logged in to post.');
        } else {
          throw new Error(error.message || 'Failed to post. Please try again.');
        }
      }

      // Success
      showSuccess = true;
      setTimeout(() => {
        showSuccess = false;
      }, 3000);

    } catch (error) {
      errorMessage = error.message;
      // Re-throw so Compose.Root can handle the state
      throw error;
    }
  }

  function getToken() {
    return localStorage.getItem('auth_token') || '';
  }
</script>

<div class="composer-container">
  {#if errorMessage}
    <div class="error-banner" role="alert">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      {errorMessage}
      <button onclick={() => errorMessage = null} class="close-btn">×</button>
    </div>
  {/if}

  {#if showSuccess}
    <div class="success-banner" role="status">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      Posted successfully!
    </div>
  {/if}

  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    <div class="actions">
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .composer-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .error-banner,
  .success-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    font-weight: 500;
  }

  .error-banner {
    background: #fee;
    color: #dc2626;
    border: 1px solid #dc2626;
  }

  .success-banner {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .error-banner svg,
  .success-banner svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  .close-btn {
    margin-left: auto;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: inherit;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 6: With Draft Auto-Save**

Composer with automatic draft saving and recovery:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { onMount } from 'svelte';

  let hasDraft = $state(false);
  let showDraftPrompt = $state(false);

  onMount(() => {
    // Check if there's a saved draft
    const draft = localStorage.getItem('compose-draft');
    if (draft) {
      hasDraft = true;
      showDraftPrompt = true;
    }
  });

  async function handleSubmit(data) {
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // Clear draft on successful submit
      localStorage.removeItem('compose-draft');
      hasDraft = false;
    }

    return response.json();
  }

  function handleSaveDraft(content) {
    if (content.trim()) {
      localStorage.setItem('compose-draft', content);
      hasDraft = true;
    }
  }

  function loadDraft() {
    // Draft will be loaded by DraftSaver component
    showDraftPrompt = false;
  }

  function discardDraft() {
    localStorage.removeItem('compose-draft');
    hasDraft = false;
    showDraftPrompt = false;
  }
</script>

<div class="draft-composer">
  {#if showDraftPrompt}
    <div class="draft-prompt">
      <div class="draft-prompt-content">
        <h4>You have an unsaved draft</h4>
        <p>Would you like to continue where you left off?</p>
        <div class="draft-prompt-actions">
          <button onclick={loadDraft} class="btn-primary">
            Load Draft
          </button>
          <button onclick={discardDraft} class="btn-secondary">
            Discard
          </button>
        </div>
      </div>
    </div>
  {/if}

  <Compose.Root 
    handlers={{ 
      onSubmit: handleSubmit,
      onSaveDraft: handleSaveDraft
    }}
  >
    <Compose.DraftSaver
      draftKey="main-composer"
      autoSave={true}
      intervalSeconds={30}
    />
    
    <Compose.Editor autofocus />
    
    <div class="composer-footer">
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .draft-composer {
    max-width: 600px;
    margin: 0 auto;
  }

  .draft-prompt {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .draft-prompt-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    text-align: center;
  }

  .draft-prompt-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: center;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: #0f1419;
    border: 1px solid #cfd9de;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }

  .composer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

---

## 🎨 Styling

`Compose.Root` supports customization through CSS custom properties:

```css
/* Container styling */
.compose-root {
  --compose-bg: white;
  --compose-border: #e1e8ed;
  --compose-radius: 8px;
  --compose-padding: 1rem;
  --compose-spacing: 1rem;

  /* Error styling */
  --compose-error-bg: #fee;
  --compose-error-color: #dc2626;

  /* Reply indicator */
  --compose-reply-bg: #f7f9fa;
  --compose-text-secondary: #536471;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .compose-root {
    --compose-bg: #15202b;
    --compose-border: #38444d;
    --compose-text-primary: #ffffff;
    --compose-text-secondary: #8899a6;
    --compose-error-bg: rgba(244, 33, 46, 0.1);
  }
}
```

### **Custom Class**

You can add custom classes via the `config.class` prop:

```svelte
<Compose.Root config={{ class: 'my-custom-composer' }}>
  <!-- ... -->
</Compose.Root>

<style>
  :global(.my-custom-composer) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 2px solid #1d9bf0;
  }
</style>
```

---

## ♿ Accessibility

`Compose.Root` follows WCAG 2.1 AA standards:

### **Semantic HTML**
- Uses `<form>` element for proper form semantics
- Proper `role="form"` attribute
- `aria-busy` state during submission

### **Keyboard Navigation**
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Enter submits the form (default browser behavior)

### **Screen Reader Support**
- Error messages announced via `role="alert"`
- Reply indicator provides context
- Loading states communicated via `aria-busy`

### **Error Handling**
- Errors displayed with `role="alert"` for immediate announcement
- Descriptive error messages
- Form remains accessible during submission

---

## 🔒 Security Considerations

### **Input Sanitization**

Always sanitize user input on the server:

```typescript
// Server-side validation
app.post('/api/statuses', async (req, res) => {
  const { status, visibility } = req.body;

  // Validate content
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'Invalid content' });
  }

  // Check length
  if (status.length > 500) {
    return res.status(422).json({ error: 'Content too long' });
  }

  // Sanitize HTML (if you allow HTML)
  const sanitized = sanitizeHtml(status, {
    allowedTags: ['p', 'br', 'a'],
    allowedAttributes: { a: ['href'] }
  });

  // Save to database
  await db.statuses.create({
    content: sanitized,
    visibility,
    userId: req.user.id
  });

  res.json({ success: true });
});
```

### **CSRF Protection**

Include CSRF tokens in form submissions:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  async function handleSubmit(data) {
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(data)
    });

    return response.json();
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <!-- ... -->
</Compose.Root>
```

### **Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const postLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours
  max: 300, // 300 posts per 3 hours
  message: 'Too many posts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/statuses', postLimiter, async (req, res) => {
  // Handle post creation
});
```

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Compose.Root', () => {
  it('submits post with content', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    // Type content
    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, { target: { value: 'Hello world' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /post/i });
    await fireEvent.click(submitBtn);

    // Verify submission
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Hello world',
          visibility: 'public'
        })
      );
    });
  });

  it('shows error when submission fails', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(
      new Error('Network error')
    );

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, { target: { value: 'Test' } });

    const submitBtn = screen.getByRole('button');
    await fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('disables submit when over character limit', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 10 }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'This is way over the limit' }
    });

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
  });

  it('resets form after successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox') as HTMLTextAreaElement;
    await fireEvent.input(editor, { target: { value: 'Test post' } });
    
    const submitBtn = screen.getByRole('button');
    await fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(editor.value).toBe('');
    });
  });
});
```

---

## 🔗 Related Components

- [Compose.Editor](./Editor.md) - Text editor component
- [Compose.EditorWithAutocomplete](./EditorWithAutocomplete.md) - Editor with autocomplete
- [Compose.Submit](./Submit.md) - Submit button
- [Compose.CharacterCount](./CharacterCount.md) - Character counter
- [Compose.VisibilitySelect](./VisibilitySelect.md) - Visibility selector
- [Compose.MediaUpload](./MediaUpload.md) - Media upload component
- [Compose.DraftSaver](./DraftSaver.md) - Draft management

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Lesser Integration Guide](../../lesser-integration-guide.md)
- [GraphQL Adapter Documentation](./GraphQLAdapter.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

