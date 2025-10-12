# Compose.VisibilitySelect

**Component**: Post Visibility Selector  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.VisibilitySelect` provides a dropdown menu for selecting post visibility levels according to ActivityPub standards. It allows users to control who can see their posts with clear visual indicators and descriptions for each visibility level.

### **Key Features**:
- ✅ Four standard ActivityPub visibility levels
- ✅ Clear icons and descriptions for each level
- ✅ Keyboard accessible dropdown
- ✅ Screen reader friendly
- ✅ Visual feedback on selection
- ✅ Integrates seamlessly with Compose context
- ✅ Mobile-friendly interface
- ✅ Customizable styling

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit(data) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: data.content,
        visibility: data.visibility
      })
    });
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor autofocus />
  
  <div class="footer">
    <Compose.VisibilitySelect />
    <Compose.Submit />
  </div>
</Compose.Root>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Additional CSS class |

**Note**: The current visibility and available options are inherited from the `Compose.Root` context via `config.defaultVisibility`.

---

## 🌐 Visibility Levels

### **Public (🌐)**
```typescript
visibility: 'public'
```
- **Visible to**: Everyone
- **Public timelines**: Yes (shown in federated/local timelines)
- **Discoverable**: Yes (appears in search, profiles)
- **Use case**: General announcements, public discussions

### **Unlisted (🔓)**
```typescript
visibility: 'unlisted'
```
- **Visible to**: Everyone with the link
- **Public timelines**: No (not shown in federated/local timelines)
- **Discoverable**: Yes (appears on profile, in replies)
- **Use case**: Replies, conversational posts, reduce noise

### **Followers Only (🔒)**
```typescript
visibility: 'private'
```
- **Visible to**: Only your followers
- **Public timelines**: No
- **Discoverable**: No (hidden from non-followers)
- **Use case**: Personal updates, follower-only content

### **Direct (✉️)**
```typescript
visibility: 'direct'
```
- **Visible to**: Only mentioned users
- **Public timelines**: No
- **Discoverable**: No
- **Use case**: Private messages, one-on-one conversations

---

## 💡 Examples

### **Example 1: Basic Visibility Selector**

Simple visibility selector with all options:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit(data) {
    console.log('Posting with visibility:', data.visibility);
    await api.createPost(data);
  }
</script>

<div class="compose-container">
  <h2>Create Post</h2>
  
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    
    <div class="compose-footer">
      <div class="footer-left">
        <Compose.VisibilitySelect />
      </div>
      <div class="footer-right">
        <Compose.CharacterCount />
        <Compose.Submit />
      </div>
    </div>
  </Compose.Root>
</div>

<style>
  .compose-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
  }

  .compose-footer {
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

### **Example 2: Default Visibility Per Context**

Set different default visibility for different composer contexts:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  type ComposerType = 'public' | 'reply' | 'dm';
  let composerType = $state<ComposerType>('public');

  const visibilityDefaults = {
    public: 'public' as const,
    reply: 'unlisted' as const,
    dm: 'direct' as const
  };

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="context-composer">
  <div class="context-switcher">
    <button 
      class="context-btn"
      class:active={composerType === 'public'}
      onclick={() => composerType = 'public'}
    >
      📢 New Post
    </button>
    <button 
      class="context-btn"
      class:active={composerType === 'reply'}
      onclick={() => composerType = 'reply'}
    >
      💬 Reply
    </button>
    <button 
      class="context-btn"
      class:active={composerType === 'dm'}
      onclick={() => composerType = 'dm'}
    >
      ✉️ Direct Message
    </button>
  </div>

  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ 
      defaultVisibility: visibilityDefaults[composerType]
    }}
  >
    <Compose.Editor autofocus />
    
    <div class="footer">
      <Compose.VisibilitySelect />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .context-composer {
    max-width: 600px;
    margin: 2rem auto;
  }

  .context-switcher {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .context-btn {
    flex: 1;
    padding: 0.75rem;
    background: white;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .context-btn:hover {
    border-color: #1d9bf0;
  }

  .context-btn.active {
    background: #e8f5fd;
    border-color: #1d9bf0;
    color: #1d9bf0;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 3: Visibility Explanation**

Show detailed explanations for each visibility level:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';
  import { getComposeContext } from '@greater/fediverse/Compose';

  const context = getComposeContext();

  const visibilityInfo = {
    public: {
      icon: '🌐',
      title: 'Public',
      description: 'Everyone can see this post',
      details: 'Your post will appear in public timelines and can be boosted by anyone.',
      color: '#1d9bf0'
    },
    unlisted: {
      icon: '🔓',
      title: 'Unlisted',
      description: 'Not shown in public timelines',
      details: 'Anyone can see it with a direct link, but it won\'t appear in discovery feeds.',
      color: '#10b981'
    },
    private: {
      icon: '🔒',
      title: 'Followers Only',
      description: 'Only your followers can see',
      details: 'This post is private to your followers and cannot be boosted.',
      color: '#f59e0b'
    },
    direct: {
      icon: '✉️',
      title: 'Direct',
      description: 'Only mentioned users can see',
      details: 'This is a private message visible only to people you mention.',
      color: '#8b5cf6'
    }
  };

  const currentInfo = $derived(visibilityInfo[context.state.visibility]);

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="explained-composer">
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    
    <div class="visibility-explanation" style="border-color: {currentInfo.color}">
      <div class="explanation-header">
        <span class="explanation-icon">{currentInfo.icon}</span>
        <strong>{currentInfo.title}</strong>
      </div>
      <p class="explanation-description">{currentInfo.description}</p>
      <p class="explanation-details">{currentInfo.details}</p>
    </div>

    <div class="footer">
      <Compose.VisibilitySelect />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .explained-composer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .visibility-explanation {
    padding: 1rem;
    margin: 1rem 0;
    background: #f7f9fa;
    border-left: 4px solid;
    border-radius: 8px;
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .explanation-icon {
    font-size: 1.5rem;
  }

  .explanation-description {
    margin: 0.5rem 0;
    color: #0f1419;
    font-size: 0.9375rem;
  }

  .explanation-details {
    margin: 0;
    color: #536471;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 4: Visibility Warnings**

Warn users when posting sensitive content publicly:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';
  import { getComposeContext } from '@greater/fediverse/Compose';

  const context = getComposeContext();

  let showWarning = $state(false);
  let contentSensitivity = $state<'safe' | 'sensitive' | 'private'>('safe');

  // Detect sensitive keywords (simplified example)
  function analyzeSensitivity(content: string): 'safe' | 'sensitive' | 'private' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('password') || lowerContent.includes('private')) {
      return 'private';
    }
    if (lowerContent.includes('personal') || lowerContent.includes('confidential')) {
      return 'sensitive';
    }
    return 'safe';
  }

  function handleContentChange(content: string) {
    contentSensitivity = analyzeSensitivity(content);
    
    // Show warning if public post with sensitive content
    showWarning = 
      context.state.visibility === 'public' && 
      contentSensitivity !== 'safe';
  }

  async function handleSubmit(data) {
    if (showWarning) {
      const confirmed = confirm(
        'This post contains potentially sensitive information and is set to public. Continue?'
      );
      if (!confirmed) {
        throw new Error('User cancelled submission');
      }
    }
    await api.createPost(data);
  }
</script>

<div class="warning-composer">
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor 
      autofocus 
      oninput={(e) => handleContentChange(e.target.value)}
    />
    
    {#if showWarning}
      <div class="warning-banner" role="alert">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <div class="warning-content">
          <strong>⚠️ Privacy Warning</strong>
          <p>
            {#if contentSensitivity === 'private'}
              Your post may contain private information and is set to <strong>Public</strong>.
            {:else}
              Your post may contain sensitive information and is set to <strong>Public</strong>.
            {/if}
            Consider changing the visibility.
          </p>
        </div>
      </div>
    {/if}

    <div class="footer">
      <Compose.VisibilitySelect />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .warning-composer {
    max-width: 600px;
    margin: 2rem auto;
  }

  .warning-banner {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin: 1rem 0;
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 8px;
    color: #856404;
  }

  .warning-banner svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .warning-content strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .warning-content p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 5: Custom Visibility Options**

Create a custom visibility selector with additional options:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  type ExtendedVisibility = 'public' | 'unlisted' | 'private' | 'direct' | 'local-only';

  let visibility = $state<ExtendedVisibility>('public');

  const customVisibilityOptions = [
    {
      value: 'public' as const,
      icon: '🌐',
      label: 'Public',
      description: 'Federated to all instances'
    },
    {
      value: 'local-only' as const,
      icon: '🏠',
      label: 'Local Only',
      description: 'Only visible on this instance'
    },
    {
      value: 'unlisted' as const,
      icon: '🔓',
      label: 'Unlisted',
      description: 'Hidden from timelines'
    },
    {
      value: 'private' as const,
      icon: '🔒',
      label: 'Followers',
      description: 'Followers only'
    },
    {
      value: 'direct' as const,
      icon: '✉️',
      label: 'Direct',
      description: 'Mentioned users only'
    }
  ];

  async function handleSubmit(data) {
    await api.createPost({
      ...data,
      visibility: visibility === 'local-only' ? 'public' : visibility,
      localOnly: visibility === 'local-only'
    });
  }
</script>

<div class="custom-visibility-composer">
  <Compose.Root handlers={{ onSubmit: handleSubmit }}>
    <Compose.Editor autofocus />
    
    <div class="custom-visibility-select">
      <label>Who can see this?</label>
      <div class="visibility-grid">
        {#each customVisibilityOptions as option}
          <button
            type="button"
            class="visibility-option"
            class:selected={visibility === option.value}
            onclick={() => visibility = option.value}
          >
            <span class="option-icon">{option.icon}</span>
            <div class="option-content">
              <strong>{option.label}</strong>
              <span class="option-description">{option.description}</span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="footer">
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .custom-visibility-composer {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .custom-visibility-select {
    margin: 1.5rem 0;
  }

  .custom-visibility-select label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: #0f1419;
  }

  .visibility-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .visibility-option {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .visibility-option:hover {
    border-color: #1d9bf0;
    box-shadow: 0 2px 8px rgba(29, 155, 240, 0.1);
  }

  .visibility-option.selected {
    background: #e8f5fd;
    border-color: #1d9bf0;
  }

  .option-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .option-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .option-content strong {
    color: #0f1419;
    font-size: 0.9375rem;
  }

  .option-description {
    color: #536471;
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 6: Visibility History**

Remember user's last visibility choice:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';
  import { onMount } from 'svelte';

  type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';

  let lastVisibility = $state<PostVisibility>('public');

  onMount(() => {
    // Load last used visibility from localStorage
    const saved = localStorage.getItem('lastVisibility');
    if (saved) {
      lastVisibility = saved as PostVisibility;
    }
  });

  async function handleSubmit(data) {
    // Save visibility choice
    localStorage.setItem('lastVisibility', data.visibility);
    
    await api.createPost(data);
  }
</script>

<div class="history-composer">
  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ defaultVisibility: lastVisibility }}
  >
    <Compose.Editor autofocus />
    
    <div class="footer">
      <div class="visibility-hint">
        💡 Your last visibility choice: <strong>{lastVisibility}</strong>
      </div>
      <Compose.VisibilitySelect />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .history-composer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .visibility-hint {
    font-size: 0.875rem;
    color: #536471;
  }

  .visibility-hint strong {
    color: #1d9bf0;
    text-transform: capitalize;
  }
</style>
```

---

## 🎨 Styling

`Compose.VisibilitySelect` can be styled using CSS custom properties:

```css
.compose-visibility-select {
  /* Colors */
  --compose-text-primary: #0f1419;
  --compose-text-secondary: #536471;
  --compose-editor-bg: white;
  --compose-border: #cfd9de;
  --compose-focus-color: #1d9bf0;

  /* Shape */
  --compose-radius: 8px;

  /* Typography */
  --compose-font-size: 1rem;
  --compose-font-size-sm: 0.875rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .compose-visibility-select {
    --compose-text-primary: #ffffff;
    --compose-text-secondary: #8899a6;
    --compose-editor-bg: #15202b;
    --compose-border: #38444d;
  }
}
```

### **Custom Styles**

```css
/* Compact select */
:global(.compact-visibility) {
  font-size: 0.875rem;
}

/* Inline select (no label) */
:global(.inline-visibility .compose-visibility-select__label) {
  display: none;
}

/* Icon-only select */
:global(.icon-only-visibility .compose-visibility-select__select option) {
  /* Remove text, keep icons only (browser-dependent) */
}

/* Custom select colors */
:global(.compose-visibility-select__select:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}
```

---

## ♿ Accessibility

`Compose.VisibilitySelect` follows WCAG 2.1 AA standards:

### **Semantic HTML**
```html
<div class="compose-visibility-select">
  <label for="compose-visibility">Visibility</label>
  <select 
    id="compose-visibility"
    aria-label="Post visibility"
  >
    <option value="public">🌐 Public</option>
    <!-- ... -->
  </select>
  <p>Anyone can see this post</p>
</div>
```

### **Keyboard Support**
- ✅ `Tab` moves focus to the select
- ✅ `Enter` or `Space` opens the dropdown
- ✅ `↑ ↓` navigates options
- ✅ `Enter` selects option
- ✅ `Esc` closes dropdown

### **Screen Reader Support**
- Label properly associated with select (`for` attribute)
- Current selection announced
- Option descriptions provided
- Changes announced immediately

### **Visual Accessibility**
- Clear labels and descriptions
- High contrast for all states (4.5:1 minimum)
- Focus indicator visible
- Icons supplement, not replace, text

---

## 🔒 Security Considerations

### **Visibility Enforcement**

**Important**: Visibility is enforced on the server, not the client:

```typescript
app.post('/api/statuses', async (req, res) => {
  const { status, visibility } = req.body;
  const userId = req.user.id;

  // Validate visibility
  const validVisibilities = ['public', 'unlisted', 'private', 'direct'];
  if (!validVisibilities.includes(visibility)) {
    return res.status(400).json({ error: 'Invalid visibility' });
  }

  // Check user permissions
  if (visibility === 'direct' && !req.body.mentions?.length) {
    return res.status(400).json({ 
      error: 'Direct posts must mention at least one user' 
    });
  }

  // Create post with visibility
  const post = await db.statuses.create({
    content: status,
    visibility,
    userId,
    localOnly: req.body.localOnly || false
  });

  // Apply visibility rules in database queries
  await applyVisibilityRules(post);

  res.json(post);
});
```

### **Privacy Leaks**

Prevent unintended information disclosure:

```typescript
// Don't expose private posts in public APIs
app.get('/api/statuses/:id', async (req, res) => {
  const post = await db.statuses.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Check if user can see this post
  const canView = await canUserViewPost(req.user, post);
  if (!canView) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(post);
});
```

### **Federation Considerations**

For ActivityPub federation:

```typescript
// Different visibility levels affect ActivityPub delivery
function getActivityPubRecipients(post, user) {
  switch (post.visibility) {
    case 'public':
      return [
        'https://www.w3.org/ns/activitystreams#Public',
        ...user.followers
      ];
    case 'unlisted':
      return [...user.followers];
    case 'private':
      return [...user.followers];
    case 'direct':
      return [...post.mentions];
  }
}
```

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Compose } from '@greater/fediverse';

describe('Compose.VisibilitySelect', () => {
  it('renders with all visibility options', () => {
    render(Compose.Root);

    const select = screen.getByLabelText(/visibility/i);
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Public');
    expect(options[1]).toHaveTextContent('Unlisted');
    expect(options[2]).toHaveTextContent('Followers only');
    expect(options[3]).toHaveTextContent('Direct');
  });

  it('defaults to public visibility', () => {
    render(Compose.Root);

    const select = screen.getByLabelText(/visibility/i) as HTMLSelectElement;
    expect(select.value).toBe('public');
  });

  it('allows changing visibility', async () => {
    render(Compose.Root);

    const select = screen.getByLabelText(/visibility/i);
    await fireEvent.change(select, { target: { value: 'private' } });

    expect(select).toHaveValue('private');
  });

  it('uses custom default visibility', () => {
    render(Compose.Root, {
      props: {
        config: {
          defaultVisibility: 'unlisted'
        }
      }
    });

    const select = screen.getByLabelText(/visibility/i) as HTMLSelectElement;
    expect(select.value).toBe('unlisted');
  });

  it('submits with selected visibility', async () => {
    const handleSubmit = vi.fn();

    render(Compose.Root, {
      props: {
        handlers: { onSubmit: handleSubmit }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, { target: { value: 'Test' } });

    const select = screen.getByLabelText(/visibility/i);
    await fireEvent.change(select, { target: { value: 'private' } });

    const submitBtn = screen.getByRole('button');
    await fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test',
          visibility: 'private'
        })
      );
    });
  });

  it('shows description for selected visibility', async () => {
    render(Compose.Root);

    const select = screen.getByLabelText(/visibility/i);
    
    // Check public description
    expect(screen.getByText(/anyone can see/i)).toBeInTheDocument();

    // Change to private
    await fireEvent.change(select, { target: { value: 'private' } });
    expect(screen.getByText(/only your followers/i)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.Editor](./Editor.md) - Text editor
- [Compose.Submit](./Submit.md) - Submit button
- [Compose.CharacterCount](./CharacterCount.md) - Character counter

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [ActivityPub Specification](https://www.w3.org/TR/activitypub/)
- [Mastodon Visibility Levels](https://docs.joinmastodon.org/user/posting/#privacy)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: Can I add custom visibility levels?**

Yes! You can create a custom select component using the Compose context:

```svelte
<script lang="ts">
  import { getComposeContext } from '@greater/fediverse/Compose';
  const context = getComposeContext();

  const customVisibilities = ['public', 'unlisted', 'private', 'direct', 'local-only'];
</script>

<select 
  value={context.state.visibility}
  onchange={(e) => context.updateState({ visibility: e.target.value })}
>
  {#each customVisibilities as vis}
    <option value={vis}>{vis}</option>
  {/each}
</select>
```

### **Q: How do I make posts default to "Followers Only"?**

Set `defaultVisibility` in the config:

```svelte
<Compose.Root config={{ defaultVisibility: 'private' }}>
  <!-- ... -->
</Compose.Root>
```

### **Q: Can users change the default visibility?**

Yes! Save user preference to localStorage:

```typescript
// Save preference
localStorage.setItem('preferredVisibility', 'unlisted');

// Load preference
const preferred = localStorage.getItem('preferredVisibility') || 'public';
```

### **Q: What's the difference between unlisted and private?**

- **Unlisted**: Anyone can see with the link, but hidden from discovery
- **Private**: Only followers can see, even with a direct link

### **Q: How do I implement local-only posts?**

"Local only" is a server-side flag, not a visibility level. Implement it separately:

```svelte
<script>
  let localOnly = $state(false);

  async function handleSubmit(data) {
    await api.createPost({
      ...data,
      local_only: localOnly
    });
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor />
  <Compose.VisibilitySelect />
  <label>
    <input type="checkbox" bind:checked={localOnly} />
    Local only (don't federate)
  </label>
  <Compose.Submit />
</Compose.Root>
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

