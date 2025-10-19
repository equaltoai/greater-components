# Compose.Submit

**Component**: Submit Button with Loading State  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.Submit` is an intelligent submit button component that handles post submission with visual feedback. It automatically disables when the post content is empty, when the character limit is exceeded, or during submission. Built on top of the headless button primitive for maximum accessibility.

### **Key Features**:
- ✅ Automatic disable states (empty content, over limit, submitting)
- ✅ Loading indicator during submission
- ✅ Customizable button text and loading text
- ✅ Built on `@equaltoai/greater-components-headless/button` for accessibility
- ✅ Keyboard accessible (Enter, Space)
- ✅ Screen reader support
- ✅ Smooth animations and transitions
- ✅ Respects `prefers-reduced-motion`

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
  <Compose.Editor autofocus />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `text` | `string` | `'Post'` | No | Button text when not submitting |
| `loadingText` | `string` | `'Posting...'` | No | Button text during submission |
| `class` | `string` | `''` | No | Additional CSS class |

---

## 📤 Events

The Submit button doesn't emit custom events. It triggers form submission which is handled by [`Compose.Root`](./Root.md) via the `onSubmit` handler.

---

## 🎭 Button States

The Submit button has four states:

### **1. Normal (Enabled)**
```typescript
// Conditions:
// - Content is not empty (content.trim().length > 0)
// - Character limit not exceeded (!overLimit)
// - Not currently submitting (!submitting)
```

### **2. Disabled (Empty Content)**
```typescript
// When content is empty or only whitespace
content.trim().length === 0
```

### **3. Disabled (Over Limit)**
```typescript
// When character count exceeds the limit
characterCount > characterLimit
```

### **4. Loading (Submitting)**
```typescript
// During async onSubmit execution
submitting === true
```

---

## 💡 Examples

### **Example 1: Basic Submit Button**

Simple submit button with default text:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    console.log('Submitting:', data);
    await api.createPost(data);
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor autofocus />
  
  <div class="actions">
    <Compose.CharacterCount />
    <Compose.Submit />
  </div>
</Compose.Root>

<style>
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 2: Custom Button Text**

Customize button text for different contexts:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let context = $state<'post' | 'reply' | 'quote'>('post');

  const buttonText = {
    post: { text: 'Publish', loading: 'Publishing...' },
    reply: { text: 'Reply', loading: 'Replying...' },
    quote: { text: 'Quote Post', loading: 'Quoting...' }
  };

  async function handleSubmit(data) {
    await api.createPost(data, context);
  }
</script>

<div class="context-switcher">
  <button onclick={() => context = 'post'}>Post</button>
  <button onclick={() => context = 'reply'}>Reply</button>
  <button onclick={() => context = 'quote'}>Quote</button>
</div>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor />
  
  <Compose.Submit
    text={buttonText[context].text}
    loadingText={buttonText[context].loading}
  />
</Compose.Root>

<style>
  .context-switcher {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .context-switcher button {
    padding: 0.5rem 1rem;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .context-switcher button:hover {
    background: #f7f9fa;
  }
</style>
```

### **Example 3: With Icons**

Add icons to the submit button:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { SendIcon, LoadingIcon } from '$lib/icons';

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor />
  
  <Compose.Submit class="icon-button">
    {#snippet children(state)}
      {#if state.loading}
        <LoadingIcon class="animate-spin" />
        <span>Sending...</span>
      {:else}
        <SendIcon />
        <span>Send Post</span>
      {/if}
    {/snippet}
  </Compose.Submit>
</Compose.Root>

<style>
  :global(.icon-button) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.animate-spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
```

### **Example 4: Multiple Submit Actions**

Different submit buttons for different actions:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handlePublish(data) {
    await api.createPost({ ...data, status: 'published' });
    alert('Published!');
  }

  async function handleDraft(data) {
    await api.createPost({ ...data, status: 'draft' });
    alert('Saved as draft!');
  }

  async function handleSchedule(data) {
    await api.createPost({ ...data, status: 'scheduled' });
    alert('Scheduled!');
  }
</script>

<Compose.Root handlers={{ onSubmit: handlePublish }}>
  <Compose.Editor autofocus />
  
  <div class="multi-action">
    <Compose.CharacterCount />
    
    <div class="action-buttons">
      <button 
        class="secondary-button"
        onclick={() => handleDraft(getCurrentContent())}
      >
        Save Draft
      </button>
      
      <button 
        class="secondary-button"
        onclick={() => handleSchedule(getCurrentContent())}
      >
        Schedule
      </button>
      
      <Compose.Submit 
        text="Publish Now"
        class="primary-button"
      />
    </div>
  </div>
</Compose.Root>

<style>
  .multi-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .secondary-button {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1px solid #cfd9de;
    border-radius: 9999px;
    color: #0f1419;
    font-weight: 700;
    cursor: pointer;
  }

  .secondary-button:hover {
    background: #f7f9fa;
  }

  :global(.primary-button) {
    padding: 0.75rem 1.5rem;
    background: #1d9bf0;
    border: none;
    border-radius: 9999px;
    color: white;
    font-weight: 700;
  }
</style>
```

### **Example 5: With Confirmation Dialog**

Add a confirmation dialog for important posts:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let showConfirmation = $state(false);
  let pendingData = $state<any>(null);

  async function handleSubmitAttempt(data) {
    // Check if content contains important keywords
    const requiresConfirmation = 
      data.visibility === 'public' && 
      data.content.length > 200;

    if (requiresConfirmation) {
      pendingData = data;
      showConfirmation = true;
      // Prevent submission for now
      throw new Error('Confirmation required');
    }

    // No confirmation needed, proceed
    await submitPost(data);
  }

  async function confirmSubmit() {
    if (pendingData) {
      await submitPost(pendingData);
      showConfirmation = false;
      pendingData = null;
    }
  }

  function cancelSubmit() {
    showConfirmation = false;
    pendingData = null;
  }

  async function submitPost(data) {
    await api.createPost(data);
    alert('Posted successfully!');
  }
</script>

<div class="confirmation-composer">
  {#if showConfirmation}
    <div class="confirmation-dialog">
      <div class="dialog-content">
        <h3>⚠️ Confirm Public Post</h3>
        <p>
          You're about to post a long message publicly. 
          Are you sure you want to continue?
        </p>
        <div class="dialog-actions">
          <button onclick={cancelSubmit} class="cancel-btn">
            Cancel
          </button>
          <button onclick={confirmSubmit} class="confirm-btn">
            Yes, Post Publicly
          </button>
        </div>
      </div>
    </div>
  {/if}

  <Compose.Root handlers={{ onSubmit: handleSubmitAttempt }}>
    <Compose.Editor autofocus />
    
    <div class="actions">
      <Compose.VisibilitySelect />
      <Compose.Submit text="Post" />
    </div>
  </Compose.Root>
</div>

<style>
  .confirmation-composer {
    position: relative;
  }

  .confirmation-dialog {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .dialog-content h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  .dialog-content p {
    margin: 0 0 1.5rem;
    color: #536471;
  }

  .dialog-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .cancel-btn,
  .confirm-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }

  .cancel-btn {
    background: transparent;
    color: #0f1419;
    border: 1px solid #cfd9de;
  }

  .confirm-btn {
    background: #1d9bf0;
    color: white;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
</style>
```

### **Example 6: With Success Feedback**

Show success message after posting:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let showSuccess = $state(false);
  let successMessage = $state('');

  async function handleSubmit(data) {
    await api.createPost(data);
    
    // Show success message
    successMessage = 'Posted successfully!';
    showSuccess = true;
    
    // Hide after 3 seconds
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }
</script>

<div class="feedback-composer">
  {#if showSuccess}
    <div class="success-toast">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      {successMessage}
    </div>
  {/if}

  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    
    <div class="actions">
      <Compose.CharacterCount />
      <Compose.Submit 
        text="Post"
        loadingText="Posting..."
      />
    </div>
  </Compose.Root>
</div>

<style>
  .feedback-composer {
    position: relative;
  }

  .success-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #10b981;
    color: white;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
  }

  .success-toast svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .success-toast {
      animation: none;
    }
  }
</style>
```

---

## 🎨 Styling

`Compose.Submit` can be styled using CSS custom properties:

```css
.compose-submit {
  /* Background colors */
  --compose-submit-bg: #1d9bf0;
  --compose-submit-hover-bg: #1a8cd8;
  --compose-submit-disabled-bg: #cfd9de;

  /* Text colors */
  --compose-submit-text: white;
  --compose-submit-disabled-text: #8899a6;

  /* Shape */
  --compose-submit-radius: 9999px; /* Fully rounded */

  /* Spacing */
  --compose-submit-padding: 0.75rem 1.5rem;

  /* Typography */
  --compose-font-size: 1rem;
  --compose-font-weight: 700;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .compose-submit {
    --compose-submit-bg: #1d9bf0;
    --compose-submit-hover-bg: #1a8cd8;
    --compose-submit-disabled-bg: #263340;
    --compose-submit-disabled-text: #6e767d;
  }
}
```

### **Custom Styles**

```css
/* Larger button */
:global(.large-submit) {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Square button */
:global(.square-submit) {
  border-radius: 8px;
}

/* Full-width button */
:global(.full-width-submit) {
  width: 100%;
}

/* Danger/warning style */
:global(.danger-submit) {
  background: #dc2626;
}

:global(.danger-submit:hover) {
  background: #b91c1c;
}

/* Success style */
:global(.success-submit) {
  background: #10b981;
}

:global(.success-submit:hover) {
  background: #059669;
}
```

---

## ♿ Accessibility

`Compose.Submit` is built on `@equaltoai/greater-components-headless/button` and follows WCAG 2.1 AA standards:

### **Keyboard Support**
- ✅ `Enter` or `Space` activates the button
- ✅ `Tab` moves focus to the button
- ✅ `Shift+Tab` moves focus away from the button

### **Screen Reader Support**
```html
<button
  type="submit"
  aria-disabled="true|false"
  aria-busy="true|false"
  aria-label="Post status"
>
  Post
</button>
```

**States announced:**
- "Post, button" (normal)
- "Post, button, disabled" (when disabled)
- "Posting..., button, busy" (during submission)

### **Focus Management**
- Clear focus indicator
- Focus remains on button during submission
- Focus indicator respects system preferences

### **Visual Accessibility**
- High contrast in all states (4.5:1 minimum)
- Disabled state clearly distinguishable
- Loading animation respects `prefers-reduced-motion`

---

## 🔒 Security Considerations

### **Double-Submit Prevention**

The Submit button automatically prevents double-submission:

```typescript
// Built-in protection
if (submitting) {
  return; // Already submitting
}
```

### **Server-Side Validation**

Always validate on the server:

```typescript
app.post('/api/statuses', async (req, res) => {
  const { status } = req.body;

  // Check if user is rate-limited
  const canPost = await checkRateLimit(req.user.id);
  if (!canPost) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded' 
    });
  }

  // Validate content
  if (!status || status.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Content cannot be empty' 
    });
  }

  if (status.length > 500) {
    return res.status(422).json({ 
      error: 'Content exceeds character limit' 
    });
  }

  // Create post
  const post = await db.statuses.create({
    content: status,
    userId: req.user.id
  });

  res.json(post);
});
```

### **CSRF Protection**

Include CSRF tokens:

```svelte
<script lang="ts">
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  async function handleSubmit(data) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(data)
    });
  }
</script>
```

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Compose.Submit', () => {
  it('renders with default text', () => {
    render(Compose.Root);
    
    const button = screen.getByRole('button', { name: /post/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(Compose.Root, {
      props: {
        text: 'Publish'
      }
    });
    
    const button = screen.getByRole('button', { name: /publish/i });
    expect(button).toBeInTheDocument();
  });

  it('is disabled when content is empty', () => {
    render(Compose.Root);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is enabled when content is present', async () => {
    render(Compose.Root);
    
    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test content' }
    });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('is disabled when over character limit', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 10 }
      }
    });
    
    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'This is too long' }
    });

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state during submission', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit },
        loadingText: 'Submitting...'
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test' }
    });

    const button = screen.getByRole('button');
    await fireEvent.click(button);

    // Check loading text
    expect(button).toHaveTextContent('Submitting...');
    expect(button).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(button).toHaveTextContent('Post');
      expect(button).toBeDisabled(); // Disabled because content is empty after reset
    });
  });

  it('calls onSubmit when clicked', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test content' }
    });

    const button = screen.getByRole('button');
    await fireEvent.click(button);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test content'
        })
      );
    });
  });

  it('prevents double submission', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Test' }
    });

    const button = screen.getByRole('button');
    
    // Click multiple times rapidly
    await fireEvent.click(button);
    await fireEvent.click(button);
    await fireEvent.click(button);

    await waitFor(() => {
      // Should only be called once
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.Editor](./Editor.md) - Text editor
- [Compose.CharacterCount](./CharacterCount.md) - Character counter
- [Compose.VisibilitySelect](./VisibilitySelect.md) - Visibility selector

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Button Headless Primitive](../../../packages/headless/button/README.md)
- [Accessibility Guidelines](../../accessibility.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: Can I add an icon to the submit button?**

Yes! Use the `class` prop and custom CSS:

```svelte
<Compose.Submit class="with-icon">
  Send →
</Compose.Submit>

<style>
  :global(.with-icon) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
```

### **Q: How do I make the button full-width?**

Use CSS:

```css
:global(.compose-submit) {
  width: 100%;
}
```

### **Q: Can I change the loading spinner?**

The loading spinner is built-in. To customize it, you'd need to create a custom submit button using the Compose context:

```svelte
<script lang="ts">
  import { getComposeContext } from '@equaltoai/greater-components-fediverse/Compose';
  
  const context = getComposeContext();
  // Create custom button with context.state.submitting
</script>
```

### **Q: How do I trigger submission programmatically?**

Get a reference to the form element:

```svelte
<script lang="ts">
  let formEl: HTMLFormElement;

  function submitProgrammatically() {
    formEl.requestSubmit();
  }
</script>

<form bind:this={formEl}>
  <Compose.Root>
    <!-- ... -->
  </Compose.Root>
</form>

<button onclick={submitProgrammatically}>
  Submit Externally
</button>
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

