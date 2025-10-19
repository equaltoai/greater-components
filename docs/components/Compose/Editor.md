# Compose.Editor

**Component**: Text Editor Textarea  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.Editor` is the basic text editor component for composing posts. It provides a textarea with auto-resize functionality, keyboard shortcuts, and integration with the Compose context. For autocomplete features (hashtags, mentions, emojis), use [`Compose.EditorWithAutocomplete`](./EditorWithAutocomplete.md) instead.

### **Key Features**:
- ✅ Auto-resize based on content
- ✅ Keyboard shortcuts (Cmd/Ctrl+Enter to submit)
- ✅ Character counting integration
- ✅ Placeholder text
- ✅ Autofocus support
- ✅ Disabled state during submission
- ✅ ARIA labels for accessibility
- ✅ Mobile-friendly

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

  async function handleSubmit(data) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor autofocus rows={4} />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `rows` | `number` | `4` | No | Minimum number of textarea rows |
| `autofocus` | `boolean` | `false` | No | Automatically focus on mount |
| `class` | `string` | `''` | No | Additional CSS class |

**Note**: The editor automatically inherits `placeholder`, `disabled`, and other properties from the `Compose.Root` context.

---

## 📤 Events

The Editor component doesn't emit custom events directly. All interactions are handled through the Compose context:

- **Input changes** → Updates `context.state.content`
- **Character count** → Automatically calculated via `context.updateState`
- **Keyboard shortcuts** → `Cmd/Ctrl+Enter` triggers form submission

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Enter` (Mac) | Submit the form |
| `Ctrl+Enter` (Windows/Linux) | Submit the form |
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |

---

## 💡 Examples

### **Example 1: Simple Editor**

Basic editor with default settings:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let postContent = $state('');

  async function handleSubmit({ content }) {
    postContent = content;
    console.log('Posted:', content);
  }
</script>

<div class="container">
  <h2>What's on your mind?</h2>
  
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    <Compose.Submit text="Post" />
  </Compose.Root>

  {#if postContent}
    <div class="preview">
      <h3>Last Post:</h3>
      <p>{postContent}</p>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .preview {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f7f9fa;
    border-radius: 8px;
  }

  .preview h3 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    color: #536471;
  }

  .preview p {
    margin: 0;
    white-space: pre-wrap;
  }
</style>
```

### **Example 2: Custom Rows and Autofocus**

Editor with specific height and automatic focus:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="quick-post">
  <h3>Quick Post</h3>
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    {/* 
      Larger editor with autofocus 
      User can start typing immediately
    */}
    <Compose.Editor 
      rows={8} 
      autofocus
      class="large-editor"
    />
    
    <div class="actions">
      <Compose.CharacterCount showProgress={true} />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .quick-post {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .quick-post h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  :global(.large-editor) {
    min-height: 200px;
    font-size: 1.0625rem; /* Slightly larger text */
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 3: Multiple Editors**

Page with multiple independent compose forms:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handlePostSubmit(data) {
    console.log('Public post:', data);
    await api.createPost(data);
  }

  async function handleNoteSubmit(data) {
    console.log('Private note:', data);
    await api.createNote(data);
  }
</script>

<div class="multi-composer">
  <div class="composer-section">
    <h3>📢 Public Post</h3>
    <Compose.Root 
      handlers={{ onSubmit: handlePostSubmit }}
      config={{ 
        placeholder: "Share your thoughts with everyone...",
        defaultVisibility: 'public'
      }}
    >
      <Compose.Editor rows={3} autofocus />
      <div class="footer">
        <Compose.CharacterCount />
        <Compose.Submit text="Post Publicly" />
      </div>
    </Compose.Root>
  </div>

  <div class="composer-section">
    <h3>📝 Private Note</h3>
    <Compose.Root 
      handlers={{ onSubmit: handleNoteSubmit }}
      config={{ 
        placeholder: "Write a note just for yourself...",
        defaultVisibility: 'private'
      }}
    >
      <Compose.Editor rows={3} />
      <div class="footer">
        <Compose.CharacterCount />
        <Compose.Submit text="Save Note" />
      </div>
    </Compose.Root>
  </div>
</div>

<style>
  .multi-composer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }

  .composer-section {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .composer-section h3 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 4: With Real-Time Character Count**

Show character count and warning as user types:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  const characterLimit = 280;

  async function handleSubmit(data) {
    if (data.content.length > characterLimit) {
      alert('Post is too long!');
      throw new Error('Content exceeds character limit');
    }
    
    await api.createPost(data);
  }
</script>

<div class="twitter-style">
  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ 
      characterLimit,
      placeholder: "What's happening?"
    }}
  >
    <div class="editor-container">
      <div class="user-avatar">
        <img src={user.avatar} alt={user.name} />
      </div>
      <div class="editor-area">
        <Compose.Editor autofocus rows={3} />
      </div>
    </div>

    <div class="tweet-footer">
      <div class="footer-left">
        {/* Icons for media, emoji, etc. */}
      </div>
      <div class="footer-right">
        <Compose.CharacterCount showProgress={true} />
        <Compose.Submit text="Tweet" />
      </div>
    </div>
  </Compose.Root>
</div>

<style>
  .twitter-style {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .editor-container {
    display: flex;
    gap: 0.75rem;
  }

  .user-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .editor-area {
    flex: 1;
  }

  .tweet-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
```

### **Example 5: With Loading State**

Show visual feedback during submission:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let isSubmitting = $state(false);

  async function handleSubmit(data) {
    isSubmitting = true;
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      await api.createPost(data);
      
      // Show success message
      alert('Posted successfully!');
    } catch (error) {
      alert('Failed to post: ' + error.message);
      throw error;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="loading-composer">
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <div class="editor-wrapper" class:submitting={isSubmitting}>
      <Compose.Editor 
        autofocus 
        rows={4}
        class="styled-editor"
      />
      
      {#if isSubmitting}
        <div class="loading-overlay">
          <div class="spinner"></div>
          <span>Posting...</span>
        </div>
      {/if}
    </div>

    <div class="actions">
      <Compose.CharacterCount />
      <Compose.Submit loadingText="Posting..." />
    </div>
  </Compose.Root>
</div>

<style>
  .loading-composer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .editor-wrapper {
    position: relative;
  }

  .editor-wrapper.submitting {
    opacity: 0.6;
    pointer-events: none;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    gap: 0.5rem;
    font-weight: 600;
    color: #1d9bf0;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e1e8ed;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border: 3px solid #1d9bf0;
    }
  }
</style>
```

### **Example 6: With Custom Validation**

Add custom validation before allowing submission:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let validationError = $state<string | null>(null);

  // List of blocked words for demonstration
  const blockedWords = ['spam', 'scam', 'phishing'];

  function validateContent(content: string): string | null {
    // Check for blocked words
    const lowerContent = content.toLowerCase();
    for (const word of blockedWords) {
      if (lowerContent.includes(word)) {
        return `Content contains blocked word: "${word}"`;
      }
    }

    // Check minimum length
    if (content.trim().length < 10) {
      return 'Post must be at least 10 characters long';
    }

    // Check for URLs (example validation)
    const urlCount = (content.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) {
      return 'Too many links (maximum 3 allowed)';
    }

    return null;
  }

  async function handleSubmit(data) {
    // Validate before submission
    const error = validateContent(data.content);
    if (error) {
      validationError = error;
      throw new Error(error);
    }

    validationError = null;

    // Submit to API
    await api.createPost(data);
  }

  function handleInput() {
    // Clear validation error when user starts typing
    if (validationError) {
      validationError = null;
    }
  }
</script>

<div class="validated-composer">
  <h2>Create Post</h2>

  {#if validationError}
    <div class="validation-error" role="alert">
      ⚠️ {validationError}
    </div>
  {/if}

  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor 
      autofocus 
      rows={5}
      oninput={handleInput}
    />

    <div class="help-text">
      Minimum 10 characters. No spam or scam content. Max 3 links.
    </div>

    <div class="actions">
      <Compose.CharacterCount />
      <Compose.Submit text="Post" />
    </div>
  </Compose.Root>
</div>

<style>
  .validated-composer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .validated-composer h2 {
    margin: 0 0 1rem;
  }

  .validation-error {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    color: #856404;
    font-weight: 500;
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #536471;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

---

## 🎨 Styling

`Compose.Editor` can be styled using CSS custom properties:

```css
/* Editor styling */
.compose-editor {
  /* Dimensions */
  --compose-editor-min-height: 100px;

  /* Typography */
  --compose-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --compose-font-size: 1rem;
  --compose-line-height: 1.5;

  /* Colors */
  --compose-text-primary: #0f1419;
  --compose-editor-bg: white;
  --compose-border: #cfd9de;
  --compose-focus-color: #1d9bf0;

  /* Placeholder */
  --compose-text-secondary: #536471;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .compose-editor {
    --compose-text-primary: #ffffff;
    --compose-editor-bg: #15202b;
    --compose-border: #38444d;
    --compose-text-secondary: #8899a6;
  }
}
```

### **Custom Styling Examples**

```css
/* Larger font for better readability */
:global(.large-editor) {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Minimal style */
:global(.minimal-editor) {
  border: none;
  border-bottom: 2px solid #e1e8ed;
  border-radius: 0;
}

/* Colored border when focused */
:global(.colorful-editor:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Custom placeholder color */
:global(.compose-editor::placeholder) {
  color: #94a3b8;
  font-style: italic;
}
```

---

## ♿ Accessibility

`Compose.Editor` follows WCAG 2.1 AA standards:

### **ARIA Attributes**
```html
<textarea
  aria-label="Compose post content"
  aria-describedby="compose-character-count"
  role="textbox"
  aria-multiline="true"
></textarea>
```

### **Keyboard Support**
- ✅ Full keyboard navigation
- ✅ `Tab` moves focus to next element
- ✅ `Shift+Tab` moves focus to previous element
- ✅ `Cmd/Ctrl+Enter` submits the form
- ✅ All standard text editing shortcuts work

### **Screen Reader Support**
- Announced as "Compose post content, text area"
- Character count changes announced via `aria-live` region
- Disabled state properly communicated
- Error messages linked via `aria-describedby`

### **Focus Management**
- Clear focus indicator (ring around editor)
- `autofocus` prop for immediate focus on load
- Focus remains in editor after validation errors

### **Visual Accessibility**
- High contrast text (4.5:1 ratio minimum)
- Focus indicator visible in all themes
- Text scales with browser zoom
- Respects `prefers-reduced-motion`

---

## 🔒 Security Considerations

### **Input Sanitization**

**Important**: Always sanitize user input on the server, never trust client-side validation:

```typescript
// ❌ NEVER DO THIS (vulnerable to XSS)
element.innerHTML = userContent;

// ✅ CORRECT (safe)
element.textContent = userContent;
```

The Editor component stores plain text only. When displaying user content:

```svelte
<!-- ✅ SAFE - Svelte escapes by default -->
<p>{content}</p>

<!-- ✅ SAFE - Explicit text content -->
<p>{@text content}</p>

<!-- ❌ DANGEROUS - Only use with sanitized HTML -->
<p>{@html sanitizedContent}</p>
```

### **Server-Side Validation**

```typescript
import DOMPurify from 'isomorphic-dompurify';

app.post('/api/statuses', async (req, res) => {
  let { status } = req.body;

  // 1. Type check
  if (typeof status !== 'string') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  // 2. Length check
  if (status.length > 500) {
    return res.status(422).json({ error: 'Content too long' });
  }

  // 3. Sanitize HTML if you allow it
  if (allowsHtml) {
    status = DOMPurify.sanitize(status, {
      ALLOWED_TAGS: ['p', 'br', 'a', 'strong', 'em'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }

  // 4. Additional validation
  if (containsSpam(status)) {
    return res.status(422).json({ error: 'Spam detected' });
  }

  // 5. Save to database
  await db.statuses.create({
    content: status,
    userId: req.user.id
  });

  res.json({ success: true });
});
```

### **Content Security Policy**

Add CSP headers to prevent XSS:

```typescript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Compose.Editor', () => {
  it('renders with placeholder', () => {
    render(Compose.Root, {
      props: {
        config: {
          placeholder: 'Write something...'
        }
      }
    });

    const editor = screen.getByPlaceholderText('Write something...');
    expect(editor).toBeInTheDocument();
  });

  it('updates content on input', async () => {
    const handleSubmit = vi.fn();
    
    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test content' }
    });

    expect(editor).toHaveValue('Test content');
  });

  it('auto-focuses when autofocus is true', () => {
    render(Compose.Root, {
      props: {}
    });

    // Editor should be focused after render
    const editor = screen.getByRole('textbox');
    expect(document.activeElement).toBe(editor);
  });

  it('submits on Cmd+Enter', async () => {
    const handleSubmit = vi.fn();
    
    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test' }
    });

    await fireEvent.keyDown(editor, {
      key: 'Enter',
      metaKey: true
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('disables during submission', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button');

    await fireEvent.input(editor, { target: { value: 'Test' } });
    await fireEvent.click(submitBtn);

    // Editor should be disabled during submission
    expect(editor).toBeDisabled();
  });

  it('auto-resizes based on content', async () => {
    render(Compose.Root);

    const editor = screen.getByRole('textbox') as HTMLTextAreaElement;
    const initialHeight = editor.style.height;

    // Add lots of content
    const longText = 'Line\n'.repeat(20);
    await fireEvent.input(editor, { target: { value: longText } });

    // Height should increase
    expect(editor.style.height).not.toBe(initialHeight);
  });
});
```

### **Integration Testing**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';

describe('Editor Integration', () => {
  it('integrates with CharacterCount', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 50 }
      }
    });

    const editor = screen.getByRole('textbox');
    
    await fireEvent.input(editor, {
      target: { value: 'This is a test message' }
    });

    // Character count should update
    const count = screen.getByRole('status');
    expect(count).toHaveTextContent('22');
  });

  it('prevents submission when over limit', async () => {
    const handleSubmit = vi.fn();

    render(Compose.Root, {
      props: {
        config: { characterLimit: 10 },
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'This is way too long' }
    });

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
  });
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.EditorWithAutocomplete](./EditorWithAutocomplete.md) - Editor with autocomplete
- [Compose.CharacterCount](./CharacterCount.md) - Character counter
- [Compose.Submit](./Submit.md) - Submit button
- [Compose.VisibilitySelect](./VisibilitySelect.md) - Visibility selector

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Keyboard Shortcuts Guide](../../keyboard-shortcuts.md)
- [Accessibility Guidelines](../../accessibility.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: How do I add autocomplete for hashtags and mentions?**

Use [`Compose.EditorWithAutocomplete`](./EditorWithAutocomplete.md) instead of `Compose.Editor`:

```svelte
<Compose.EditorWithAutocomplete searchHandler={searchHandler} />
```

### **Q: Can I disable the auto-resize feature?**

No, auto-resize is built-in for better UX. However, you can control the initial size with the `rows` prop and set a max-height via CSS:

```css
:global(.fixed-height-editor) {
  max-height: 200px;
  overflow-y: auto;
}
```

### **Q: How do I style the placeholder text?**

Use CSS custom properties or target the `::placeholder` pseudo-element:

```css
:global(.compose-editor::placeholder) {
  color: #94a3b8;
  font-style: italic;
}
```

### **Q: Can I use markdown in the editor?**

The basic editor doesn't support markdown formatting. To add markdown support:

1. Enable it in config: `config={{ enableMarkdown: true }}`
2. Parse markdown on the server before displaying
3. Use a library like `marked` with `DOMPurify` for safe rendering

### **Q: How do I validate content before submission?**

Add validation in your `onSubmit` handler:

```typescript
async function handleSubmit(data) {
  if (data.content.length < 10) {
    throw new Error('Post must be at least 10 characters');
  }
  
  // Proceed with submission
  await api.createPost(data);
}
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

