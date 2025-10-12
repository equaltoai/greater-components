# Compose Component Group

**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Components**: 11 components + 5 utility modules

---

## 📋 Overview

The **Compose** component group provides a complete, production-ready solution for creating posts, threads, and rich content in ActivityPub/Fediverse applications. Built using the compound component pattern, it offers maximum flexibility while maintaining consistency and type safety.

### **Architecture**

The Compose system follows a **compound component pattern** with:
- 🎯 **Root Provider** - Manages shared state and context
- 🧩 **Composable Components** - Each handles a specific UI concern
- 🛠️ **Utility Modules** - Reusable logic for common operations
- 🔒 **Type Safety** - Full TypeScript support throughout

---

## 🌟 Key Features

### **Content Creation**
- 📝 Rich text editing with auto-resize
- #️⃣ **Hashtag autocomplete** with trending tags
- 👤 **Mention autocomplete** with user search
- 😀 **Emoji autocomplete** with fuzzy matching
- 🔤 **Unicode-aware character counting** (emojis, CJK, combining chars)
- 🔗 **URL weighting** (URLs count as ~23 chars like Twitter)

### **Media & Content**
- 🖼️ **Drag & drop media upload** (images, video, audio)
- 📸 **Image editing** with focal point picker and alt text
- 📹 **Video upload** with progress tracking
- 🎵 **Audio upload** support
- ⚠️ **Content warnings** (spoiler text)
- 👁️ **Visibility controls** (public, unlisted, private, direct)

### **Draft Management**
- 💾 **Auto-save drafts** to localStorage
- 🔄 **Draft recovery** on page reload
- 🗑️ **Automatic cleanup** of old drafts (7 days)
- 🔑 **Multiple drafts** with unique keys
- ⏰ **Timestamp tracking** for draft age

### **Threading**
- 🧵 **Multi-post thread composition**
- ↕️ **Drag & drop reordering** of thread posts
- ➕ **Dynamic post addition/removal**
- 📊 **Per-post character counting**
- 🔗 **Automatic threading** on submission

### **Integration**
- 🔌 **GraphQL adapter** for Lesser integration
- ⚡ **Optimistic updates** for instant feedback
- 🔄 **Error handling** with rollback
- 🎨 **Fully themeable** with CSS variables
- ♿ **WCAG 2.1 AA compliant** accessibility

### **Developer Experience**
- 📘 **Full TypeScript support**
- 🧪 **Comprehensive test coverage**
- 📚 **Detailed documentation**
- 🎨 **Customizable styling**
- 🔧 **Flexible composition**

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Quick Start

### **Basic Post Composition**

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit({ content, visibility }) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: content, visibility })
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

### **With Media Upload & Autocomplete**

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit(data) {
    // Upload media first
    const mediaIds = await uploadMedia(data.mediaAttachments);
    
    // Create status with media
    await api.createStatus({
      status: data.content,
      visibility: data.visibility,
      mediaIds
    });
  }

  async function handleMediaUpload(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }

  async function searchSuggestions(query, type) {
    const response = await fetch(`/api/search?q=${query}&type=${type}`);
    return response.json();
  }
</script>

<Compose.Root 
  handlers={{ 
    onSubmit: handleSubmit,
    onMediaUpload: handleMediaUpload
  }}
>
  <Compose.EditorWithAutocomplete searchHandler={searchSuggestions} />
  <Compose.MediaUpload maxFiles={4} />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```

### **Thread Composer**

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleThreadSubmit(posts) {
    let previousId = null;
    
    for (const post of posts) {
      const response = await api.createStatus({
        status: post.content,
        visibility: post.visibility,
        inReplyToId: previousId
      });
      previousId = response.id;
    }
  }
</script>

<Compose.ThreadComposer
  onSubmitThread={handleThreadSubmit}
  maxPosts={10}
  characterLimit={500}
/>
```

### **With Draft Management**

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit(data) {
    await api.createStatus(data);
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.DraftSaver 
    draftKey="main-composer"
    autoSave={true}
    intervalSeconds={30}
  />
  <Compose.Editor />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```

---

## 📚 Component Index

### **Core Components**

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `Compose.Root` | Context provider and form wrapper | [Root.md](./Root.md) |
| `Compose.Editor` | Basic text editor textarea | [Editor.md](./Editor.md) |
| `Compose.EditorWithAutocomplete` | Editor with hashtag/mention/emoji autocomplete | [EditorWithAutocomplete.md](./EditorWithAutocomplete.md) |
| `Compose.Submit` | Submit button with loading state | [Submit.md](./Submit.md) |
| `Compose.CharacterCount` | Unicode-aware character counter | [CharacterCount.md](./CharacterCount.md) |
| `Compose.VisibilitySelect` | Post visibility selector | [VisibilitySelect.md](./VisibilitySelect.md) |

### **Advanced Components**

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `Compose.AutocompleteMenu` | Autocomplete suggestions dropdown | [AutocompleteMenu.md](./AutocompleteMenu.md) |
| `Compose.DraftSaver` | Auto-save drafts to localStorage | [DraftSaver.md](./DraftSaver.md) |
| `Compose.ThreadComposer` | Multi-post thread composition | [ThreadComposer.md](./ThreadComposer.md) |
| `Compose.MediaUpload` | Drag & drop media upload | [MediaUpload.md](./MediaUpload.md) |
| `Compose.ImageEditor` | Image editing with focal point | [ImageEditor.md](./ImageEditor.md) |

### **Utility Modules**

| Module | Purpose | Documentation |
|--------|---------|---------------|
| `DraftManager` | Draft persistence in localStorage | [DraftManager.md](./DraftManager.md) |
| `Autocomplete` | Autocomplete logic and utilities | [Autocomplete.md](./Autocomplete.md) |
| `UnicodeCounter` | Unicode character counting | [UnicodeCounter.md](./UnicodeCounter.md) |
| `MediaUploadHandler` | Media file validation and processing | [MediaUploadHandler.md](./MediaUploadHandler.md) |
| `GraphQLAdapter` | GraphQL integration for Lesser | [GraphQLAdapter.md](./GraphQLAdapter.md) |

---

## 🎨 Theming

All Compose components support theming via CSS custom properties:

```css
:root {
  /* Compose container */
  --compose-bg: white;
  --compose-border: #e1e8ed;
  --compose-radius: 8px;
  --compose-padding: 1rem;
  --compose-spacing: 1rem;

  /* Editor */
  --compose-editor-bg: white;
  --compose-font-family: -apple-system, system-ui, sans-serif;
  --compose-font-size: 1rem;
  --compose-font-size-sm: 0.875rem;

  /* Colors */
  --compose-text-primary: #0f1419;
  --compose-text-secondary: #536471;
  --compose-focus-color: #1d9bf0;
  --compose-error-color: #dc2626;
  --compose-warning-color: #f59e0b;

  /* Submit button */
  --compose-submit-bg: #1d9bf0;
  --compose-submit-text: white;
  --compose-submit-hover-bg: #1a8cd8;
  --compose-submit-disabled-bg: #cfd9de;
  --compose-submit-disabled-text: #8899a6;
  --compose-submit-radius: 9999px;

  /* Progress */
  --compose-progress-bg: #e1e8ed;

  /* Draft */
  --draft-load-bg: #e8f5fd;
  --draft-load-border: #1d9bf0;
  --draft-load-color: #1d9bf0;
  --draft-load-hover: #d5eef9;

  /* Autocomplete */
  --autocomplete-bg: white;
  --autocomplete-border: #cfd9de;
  --autocomplete-radius: 8px;
  --autocomplete-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --autocomplete-hover-bg: #f7f9fa;

  /* Media upload */
  --drop-zone-bg: #f7f9fa;
  --drop-zone-border: #cfd9de;
  --drop-zone-hover: #eff3f4;
  
  /* Thread composer */
  --thread-bg: white;
  --thread-border: #cfd9de;
  --thread-radius: 12px;
  --thread-post-bg: #f7f9fa;
  --thread-post-border: #e1e8ed;
  --thread-connector: #cfd9de;
  --primary-color: #1d9bf0;
  --primary-hover: #1a8cd8;
}
```

---

## ♿ Accessibility

All Compose components follow WCAG 2.1 AA standards:

### **Keyboard Navigation**
- ✅ **Tab** - Navigate between fields
- ✅ **Enter** - Select autocomplete suggestion
- ✅ **Escape** - Close autocomplete menu
- ✅ **↑ ↓** - Navigate autocomplete suggestions
- ✅ **Cmd/Ctrl + Enter** - Submit post

### **Screen Reader Support**
- ✅ ARIA labels on all interactive elements
- ✅ ARIA live regions for status updates
- ✅ ARIA roles for custom components
- ✅ Alt text required for images
- ✅ Form validation announcements

### **Visual Accessibility**
- ✅ High contrast text (4.5:1 ratio minimum)
- ✅ Focus indicators on all interactive elements
- ✅ Color is not the only indicator
- ✅ Animations respect `prefers-reduced-motion`
- ✅ Text scaling up to 200%

---

## 🔒 Security Considerations

### **XSS Prevention**

The Compose components handle user-generated content safely:

```typescript
// ❌ NEVER DO THIS (XSS vulnerable)
element.innerHTML = userContent;

// ✅ CORRECT (Safe)
element.textContent = userContent;
```

All content is treated as plain text and properly escaped before rendering. For rich formatting:
- Use markdown parsers with XSS protection (e.g., `marked` + `DOMPurify`)
- Sanitize HTML with allowlists
- Validate URLs before creating links

### **Content Validation**

```typescript
// Character limits
const MAX_CONTENT_LENGTH = 500;
const MAX_ALT_TEXT_LENGTH = 1500;
const MAX_CONTENT_WARNING_LENGTH = 100;

// File validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;  // 8MB
const MAX_VIDEO_SIZE = 40 * 1024 * 1024; // 40MB
```

### **Rate Limiting**

Implement rate limiting on the server side:

```typescript
// Example rate limiting
const RATE_LIMIT = {
  posts: 300,        // per 3 hours
  media: 30,         // per 30 minutes
  drafts: 100        // per hour
};
```

### **Draft Security**

Drafts are stored in localStorage:
- ✅ Data remains on client side
- ✅ No sensitive data in drafts by default
- ✅ Automatic cleanup after 7 days
- ✅ User can clear drafts manually

**Warning**: Don't store sensitive information (passwords, tokens) in drafts.

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Compose } from '@greater/fediverse';

test('submits post with content', async () => {
  const handleSubmit = vi.fn();
  
  render(Compose.Root, {
    props: {
      handlers: { onSubmit: handleSubmit }
    }
  });

  const editor = screen.getByRole('textbox');
  await fireEvent.input(editor, { target: { value: 'Hello world' } });

  const submitBtn = screen.getByRole('button', { name: /post/i });
  await fireEvent.click(submitBtn);

  expect(handleSubmit).toHaveBeenCalledWith({
    content: 'Hello world',
    visibility: 'public'
  });
});
```

### **Utility Testing**

```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

test('counts emojis correctly', () => {
  const result = countWeightedCharacters('Hello 👋 World 🌍');
  expect(result.count).toBe(15); // Not 19
  expect(result.graphemeCount).toBe(15);
});

test('weights URLs correctly', () => {
  const result = countWeightedCharacters(
    'Check out https://example.com/very/long/url/path',
    { useUrlWeighting: true, urlWeight: 23 }
  );
  // URL counted as 23 chars instead of actual 42
  expect(result.count).toBeLessThan(50);
});
```

---

## 🔌 GraphQL Integration

### **Setup with Lesser Adapter**

```typescript
import { createLesserGraphQLAdapter } from '@greater/adapters';
import { createComposeHandlers } from '@greater/fediverse/Compose';

const adapter = createLesserGraphQLAdapter({
  endpoint: 'https://your-instance.social/api/graphql',
  token: 'your-auth-token'
});

const composeHandlers = createComposeHandlers({
  adapter,
  currentAccount: {
    id: '123',
    username: 'alice',
    displayName: 'Alice',
    avatar: 'https://example.com/avatar.jpg'
  },
  enableOptimistic: true,
  onOptimisticUpdate: (status) => {
    // Handle optimistic status updates
    if (status._optimistic) {
      // Show temporary status immediately
    } else if (status._replaces) {
      // Replace optimistic with real status
    } else if (status._remove) {
      // Remove failed optimistic status
    }
  }
});
```

### **Using with Compose.Root**

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';
  
  const {
    handleSubmit,
    handleMediaUpload,
    handleAutocompleteSearch
  } = composeHandlers;
</script>

<Compose.Root
  handlers={{
    onSubmit: handleSubmit,
    onMediaUpload: handleMediaUpload
  }}
>
  <Compose.EditorWithAutocomplete searchHandler={handleAutocompleteSearch} />
  <Compose.MediaUpload />
  <Compose.CharacterCount />
  <Compose.VisibilitySelect />
  <Compose.Submit />
</Compose.Root>
```

---

## 🎯 Use Cases

### **1. Basic Post Composer**
Simple post creation with text and visibility controls.

**Components**: `Root`, `Editor`, `CharacterCount`, `VisibilitySelect`, `Submit`

### **2. Advanced Post Composer**
Full-featured composer with media upload, autocomplete, and content warnings.

**Components**: `Root`, `EditorWithAutocomplete`, `MediaUpload`, `CharacterCount`, `VisibilitySelect`, `Submit`

### **3. Thread Composer**
Create multi-post threads with drag & drop reordering.

**Components**: `ThreadComposer`

### **4. Reply Composer**
Quick reply interface for responding to posts.

**Components**: `Root` (with `inReplyTo`), `Editor`, `Submit`

### **5. Draft-Enabled Composer**
Composer with auto-save and draft recovery.

**Components**: `Root`, `DraftSaver`, `Editor`, `CharacterCount`, `Submit`

### **6. Media-Heavy Composer**
Focused on image/video posts with editing capabilities.

**Components**: `Root`, `Editor`, `MediaUpload`, `ImageEditor`, `Submit`

---

## 💡 Best Practices

### **1. Always Use Compose.Root**

```svelte
<!-- ✅ CORRECT -->
<Compose.Root handlers={{ onSubmit }}>
  <Compose.Editor />
  <Compose.Submit />
</Compose.Root>

<!-- ❌ INCORRECT (missing context) -->
<Compose.Editor />
<Compose.Submit />
```

### **2. Handle Errors Gracefully**

```svelte
<script lang="ts">
  async function handleSubmit(data) {
    try {
      await api.createStatus(data);
    } catch (error) {
      // Show user-friendly error
      if (error.code === 'RATE_LIMIT') {
        alert('You\'re posting too quickly. Please wait a moment.');
      } else if (error.code === 'CONTENT_TOO_LONG') {
        alert('Your post is too long. Please shorten it.');
      } else {
        alert('Failed to post. Please try again.');
      }
      throw error; // Re-throw so Compose.Root can handle state
    }
  }
</script>
```

### **3. Validate Media on Server**

```typescript
// Client-side validation is bypassed easily
// Always validate on server:
app.post('/api/media', upload.single('file'), async (req, res) => {
  const file = req.file;
  
  // Validate type
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Validate size
  if (file.size > MAX_SIZE) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  // Process and store...
});
```

### **4. Clean Up Drafts**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { cleanupOldDrafts } from '@greater/fediverse/Compose';

  onMount(() => {
    // Clean up drafts older than 7 days
    cleanupOldDrafts();
  });
</script>
```

### **5. Use Optimistic Updates**

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';

  const statuses = writable([]);

  const handlers = createComposeHandlers({
    adapter,
    currentAccount,
    enableOptimistic: true,
    onOptimisticUpdate: (status) => {
      if (status._optimistic) {
        // Add immediately
        statuses.update(s => [status, ...s]);
      } else if (status._replaces) {
        // Replace with real
        statuses.update(s => 
          s.map(st => st.id === status._replaces ? status : st)
        );
      }
    }
  });
</script>
```

---

## 🐛 Troubleshooting

### **Character Count Incorrect**

**Problem**: Character count doesn't match expected value.

**Solution**: Make sure you're using `countWeightedCharacters` with proper options:

```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

const result = countWeightedCharacters(text, {
  useUrlWeighting: true,  // Weight URLs as ~23 chars
  maxCharacters: 500
});

console.log(result.count); // Weighted count
console.log(result.graphemeCount); // Actual grapheme count
```

### **Autocomplete Not Showing**

**Problem**: Autocomplete menu doesn't appear when typing `#`, `@`, or `:`.

**Solution**: Ensure you're using `EditorWithAutocomplete` and providing a `searchHandler`:

```svelte
<Compose.EditorWithAutocomplete
  searchHandler={async (query, type) => {
    // Implement search for mentions, hashtags, emojis
    const response = await fetch(`/api/search?q=${query}&type=${type}`);
    return response.json();
  }}
/>
```

### **Drafts Not Saving**

**Problem**: Drafts aren't being saved or loaded.

**Solution**: Check localStorage availability and permissions:

```typescript
import { saveDraft, loadDraft } from '@greater/fediverse/Compose';

// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage not available:', e);
}

// Manual draft operations
const draft = {
  content: 'Hello world',
  savedAt: Date.now()
};

if (saveDraft(draft, 'my-draft-key')) {
  console.log('Draft saved successfully');
}

const loaded = loadDraft('my-draft-key');
console.log('Loaded draft:', loaded);
```

### **Media Upload Fails**

**Problem**: Media files fail to upload.

**Solution**: Check file validation and server configuration:

```typescript
import { validateFile } from '@greater/fediverse/Compose';

const file = event.target.files[0];
const validation = validateFile(file, {
  maxFileSize: 8 * 1024 * 1024,  // 8MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
});

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### **Context Not Found Error**

**Problem**: `Error: Compose context not found. Make sure you are using Compose components inside <Compose.Root>.`

**Solution**: Wrap all Compose components in `Compose.Root`:

```svelte
<!-- ✅ CORRECT -->
<Compose.Root>
  <Compose.Editor />
  <Compose.Submit />
</Compose.Root>

<!-- ❌ INCORRECT -->
<Compose.Editor />
<Compose.Submit />
```

---

## 📖 Related Documentation

- [Auth Components](../Auth/README.md) - User authentication
- [Profile Components](../Profile/README.md) - User profiles
- [Status Components](../Status/README.md) - Displaying posts
- [Lesser Integration Guide](../../lesser-integration-guide.md)
- [GraphQL Adapter Documentation](../../../packages/adapters/README.md)

---

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/lesserphp/greater-components).

### **Development Setup**

```bash
# Clone repository
git clone https://github.com/lesserphp/greater-components.git
cd greater-components

# Install dependencies
pnpm install

# Run tests
pnpm test

# Start dev server
pnpm dev
```

---

## 📄 License

MIT License - see [LICENSE](../../../LICENSE) for details.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or join our [Discord community](https://discord.gg/greater-components).

