# Status Components

**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Components**: 5 components

---

## 📋 Overview

The Status component group provides a complete solution for displaying individual posts/statuses in fediverse applications. These components are designed to handle rich content (text, media, polls), user interactions (boost, favorite, reply), and provide an accessible, mobile-responsive experience.

### **Key Features**:
- 📝 **Rich Content** - HTML rendering, mentions, hashtags, custom emojis
- 🎨 **Media Display** - Images, videos, audio, GIFs with optimized layouts
- 💬 **Interactions** - Reply, boost, favorite, share, bookmark actions
- ♻️ **Reblog Support** - Display boosted/reblogged content
- ⚠️ **Content Warnings** - Sensitive content with toggle display
- 📱 **Responsive** - Mobile-optimized layouts
- ⌨️ **Accessible** - Full keyboard navigation and screen reader support
- 🔒 **Secure** - Content sanitization to prevent XSS attacks
- 🎯 **Type-Safe** - Full TypeScript support with generic types
- 🔧 **Composable** - Mix and match components for custom layouts

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🏗️ Architecture

The Status components follow the **Compound Component Pattern**, where `Status.Root` provides context and child components consume it. This pattern enables:

1. **Separation of Concerns** - Each component has a single responsibility
2. **Flexible Composition** - Build custom status layouts
3. **Shared State** - Components automatically share status data
4. **Type Safety** - Context ensures type-safe prop passing

### **Component Hierarchy**:

```
Status.Root (Context Provider)
├── Status.Header (Avatar, author, timestamp)
├── Status.Content (HTML content with CW support)
├── Status.Media (Images, videos, audio)
└── Status.Actions (Reply, boost, favorite, share)
```

---

## 🚀 Quick Start

### Basic Status Display

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Hello from the fediverse! 👋</p>',
    account: {
      id: '1',
      username: 'alice',
      displayName: 'Alice',
      avatar: 'https://example.com/avatar.jpg',
      acct: 'alice@social.example'
    },
    createdAt: new Date().toISOString(),
    reblogsCount: 5,
    favouritesCount: 12,
    repliesCount: 3,
    reblogged: false,
    favourited: false
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

### With Media Attachments

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';

  const status = {
    id: '1',
    content: '<p>Check out this amazing photo!</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 25,
    favouritesCount: 150,
    repliesCount: 8,
    mediaAttachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://example.com/photo.jpg',
        previewUrl: 'https://example.com/photo-preview.jpg',
        description: 'A beautiful sunset over the ocean'
      }
    ]
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

### With Interaction Handlers

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  let status: GenericStatus = $state({
    id: '1',
    content: '<p>Interesting post</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 0,
    favouritesCount: 0,
    repliesCount: 0,
    reblogged: false,
    favourited: false
  });

  async function handleReply(status: GenericStatus) {
    console.log('Reply to:', status.id);
    // Open composer with reply context
  }

  async function handleBoost(status: GenericStatus) {
    // Optimistic update
    const originalBoosted = status.reblogged;
    status.reblogged = !status.reblogged;
    status.reblogsCount += status.reblogged ? 1 : -1;

    try {
      await boostStatus(status.id);
    } catch (error) {
      // Rollback on error
      status.reblogged = originalBoosted;
      status.reblogsCount += status.reblogged ? 1 : -1;
    }
  }

  async function handleFavorite(status: GenericStatus) {
    // Optimistic update
    const originalFavorited = status.favourited;
    status.favourited = !status.favourited;
    status.favouritesCount += status.favourited ? 1 : -1;

    try {
      await favoriteStatus(status.id);
    } catch (error) {
      // Rollback on error
      status.favourited = originalFavorited;
      status.favouritesCount += status.favourited ? 1 : -1;
    }
  }

  const handlers = {
    onReply: handleReply,
    onBoost: handleBoost,
    onFavorite: handleFavorite,
    onShare: (status) => {
      navigator.share({ url: status.url });
    }
  };
</script>

<Status.Root {status} {handlers}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

### Boosted/Reblogged Status

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';

  // Status with reblog
  const status = {
    id: '1',
    account: {
      id: '1',
      username: 'bob',
      displayName: 'Bob',
      avatar: 'https://example.com/bob.jpg',
      acct: 'bob@mastodon.social'
    },
    createdAt: new Date().toISOString(),
    reblogsCount: 0,
    favouritesCount: 0,
    repliesCount: 0,
    // The actual boosted content
    reblog: {
      id: '2',
      content: '<p>Original post content</p>',
      account: {
        id: '2',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'https://example.com/alice.jpg',
        acct: 'alice@social.example'
      },
      createdAt: '2025-10-12T10:00:00Z',
      reblogsCount: 50,
      favouritesCount: 100,
      repliesCount: 20
    }
  };
</script>

<Status.Root {status}>
  <!-- Header automatically shows "Bob boosted" indicator -->
  <!-- Then shows Alice's original post -->
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

---

## 🎯 Components

| Component | Description | Documentation |
|-----------|-------------|---------------|
| **Status.Root** | Context provider and container | [Root.md](./Root.md) |
| **Status.Header** | Avatar, author, timestamp | [Header.md](./Header.md) |
| **Status.Content** | HTML content with content warnings | [Content.md](./Content.md) |
| **Status.Media** | Images, videos, audio attachments | [Media.md](./Media.md) |
| **Status.Actions** | Interaction buttons (reply, boost, etc.) | [Actions.md](./Actions.md) |

---

## 🎨 Styling

### CSS Custom Properties

```css
.status-root {
  /* Background colors */
  --status-bg: white;
  --status-bg-hover: #f7f9fa;
  --status-bg-secondary: #f7f9fa;
  
  /* Borders */
  --status-border-color: #e1e8ed;
  
  /* Text colors */
  --status-text-primary: #0f1419;
  --status-text-secondary: #536471;
  --status-link-color: #1d9bf0;
  --status-mention-color: #1d9bf0;
  --status-hashtag-color: #1d9bf0;
  
  /* Focus ring */
  --status-focus-ring: #3b82f6;
  
  /* Spacing */
  --status-padding: 1rem;
  --status-padding-compact: 0.75rem;
  --status-spacing-xs: 0.25rem;
  --status-spacing-sm: 0.5rem;
  --status-spacing-md: 1rem;
  --status-spacing-lg: 1.5rem;
  
  /* Typography */
  --status-font-size-xs: 0.75rem;
  --status-font-size-sm: 0.875rem;
  --status-font-size-base: 1rem;
  
  /* Border radius */
  --status-radius-xs: 2px;
  --status-radius-md: 8px;
}
```

### Density Modes

```svelte
<!-- Compact mode -->
<Status.Root {status} config={{ density: 'compact' }}>
  <!-- Reduced spacing and font sizes -->
</Status.Root>

<!-- Comfortable mode (default) -->
<Status.Root {status} config={{ density: 'comfortable' }}>
  <!-- Standard spacing -->
</Status.Root>
```

---

## ♿ Accessibility

Status components follow WCAG 2.1 Level AA guidelines:

### Semantic HTML

```html
<article class="status-root">
  <header class="status-header">
    <!-- Account info -->
  </header>
  <div class="status-content">
    <!-- Post content -->
  </div>
  <div class="status-actions">
    <!-- Action buttons -->
  </div>
</article>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus next interactive element |
| `Shift+Tab` | Focus previous interactive element |
| `Enter` / `Space` | Activate focused element |
| `r` | Reply (when status focused) |
| `b` | Boost/reblog (when status focused) |
| `f` | Favorite/like (when status focused) |

### Screen Reader Support

```svelte
<Status.Root {status}>
  <!-- Announces: "Post by Alice, posted 5 minutes ago" -->
  <Status.Header />
  
  <!-- Announces content with proper formatting -->
  <Status.Content />
  
  <!-- Action buttons with descriptive labels -->
  <Status.Actions />
</Status.Root>
```

**Features**:
- ✅ Semantic HTML (`<article>`, `<header>`, `<time>`, etc.)
- ✅ ARIA labels and descriptions
- ✅ Keyboard shortcuts
- ✅ Focus management
- ✅ Alt text for images
- ✅ Proper heading hierarchy

---

## 🔒 Security

### Content Sanitization

All HTML content is automatically sanitized to prevent XSS attacks:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: ['p', 'br', 'a', 'span', 'strong', 'em', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'class', 'rel', 'target'],
  ALLOW_DATA_ATTR: false
});
```

### Link Safety

External links automatically get security attributes:

```html
<a 
  href="https://external-site.com" 
  rel="noopener noreferrer nofollow" 
  target="_blank"
>
  Link text
</a>
```

### Content Warnings

Sensitive content is hidden by default:

```svelte
<Status.Root {status}>
  <Status.Content />
  <!-- If status.sensitive is true, content is hidden
       until user clicks "Show more" -->
</Status.Root>
```

---

## ⚡ Performance

### Optimizations

1. **Lazy Loading Images** - Images load only when visible
2. **Optimistic Updates** - Instant feedback on interactions
3. **Minimal Re-renders** - Efficient reactivity with Svelte 5
4. **Blurhash Placeholders** - Show placeholders while images load
5. **Video Optimization** - Load videos on demand

### Example: Optimistic Updates

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';

  async function handleFavorite(status: GenericStatus) {
    // Update UI immediately
    const original = status.favourited;
    status.favourited = !status.favourited;
    status.favouritesCount += status.favourited ? 1 : -1;

    try {
      await favoriteStatus(status.id);
    } catch (error) {
      // Rollback on error
      status.favourited = original;
      status.favouritesCount += status.favourited ? 1 : -1;
    }
  }
</script>
```

---

## 💬 Content Features

### HTML Rendering

```svelte
<Status.Root {status}>
  <!-- Renders HTML with:
       - Paragraph breaks
       - Links
       - Mentions (@username)
       - Hashtags (#topic)
       - Custom emojis :emoji:
  -->
  <Status.Content />
</Status.Root>
```

### Content Warnings

```svelte
<script>
  const status = {
    id: '1',
    content: '<p>Sensitive content here</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    sensitive: true,
    spoilerText: 'CW: Spoilers',
    // ... other fields
  };
</script>

<Status.Root {status}>
  <Status.Content />
  <!-- Shows "CW: Spoilers" with "Show more" button -->
</Status.Root>
```

### Media Layouts

```svelte
<!-- 1 image: Full width -->
<!-- 2 images: Side by side -->
<!-- 3 images: 2 top, 1 bottom -->
<!-- 4 images: 2x2 grid -->

<Status.Root {status}>
  <Status.Media />
  <!-- Automatically optimizes layout based on attachment count -->
</Status.Root>
```

---

## 🧪 Testing

Status components have comprehensive test coverage:

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Status } from '@greater/fediverse';

describe('Status Components', () => {
  it('renders status content', () => {
    const status = mockStatus({ content: '<p>Test content</p>' });
    
    render(Status.Root, { props: { status } });
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles favorite action', async () => {
    const onFavorite = vi.fn();
    const status = mockStatus();
    
    render(Status.Root, {
      props: {
        status,
        handlers: { onFavorite }
      }
    });
    
    const favoriteButton = screen.getByLabelText('Favorite');
    await fireEvent.click(favoriteButton);
    
    expect(onFavorite).toHaveBeenCalledWith(status);
  });

  it('displays media attachments', () => {
    const status = mockStatus({
      mediaAttachments: [
        { id: '1', type: 'image', url: 'image.jpg', previewUrl: 'preview.jpg' }
      ]
    });
    
    render(Status.Root, { props: { status } });
    
    expect(screen.getByRole('img')).toHaveAttribute('src', 'preview.jpg');
  });
});
```

**Test Coverage**:
- ✅ Component rendering
- ✅ User interactions
- ✅ Content sanitization
- ✅ Media display
- ✅ Keyboard navigation
- ✅ Screen reader compatibility

---

## 📚 Examples

### Custom Status Card

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';

  let status = $state(mockStatus());
</script>

<div class="custom-status-card">
  <Status.Root {status} config={{ clickable: true, density: 'comfortable' }}>
    <div class="status-card-header">
      <Status.Header />
      
      <!-- Custom dropdown menu -->
      <button class="status-menu-button">⋯</button>
    </div>

    <Status.Content />
    
    <Status.Media />
    
    <div class="status-card-footer">
      <Status.Actions />
      
      <!-- Custom bookmark button -->
      <button class="bookmark-button">🔖</button>
    </div>
  </Status.Root>
</div>

<style>
  .custom-status-card {
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .status-card-header,
  .status-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-menu-button,
  .bookmark-button {
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .status-menu-button:hover,
  .bookmark-button:hover {
    background: rgba(0, 0, 0, 0.05);
  }
</style>
```

### Compact Status Display

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';

  let statuses = $state([]);
</script>

<div class="compact-timeline">
  {#each statuses as status}
    <Status.Root {status} config={{ density: 'compact' }}>
      <div class="compact-status">
        <Status.Header />
        <Status.Content />
        <Status.Actions />
      </div>
    </Status.Root>
  {/each}
</div>

<style>
  .compact-timeline {
    max-width: 400px;
  }

  .compact-status {
    font-size: 0.875rem;
  }
</style>
```

---

## 🔗 Related Components

- **[Timeline Components](../Timeline/README.md)** - Display lists of statuses
- **[Compose Components](../Compose/README.md)** - Create new statuses
- **[Profile Components](../Profile/README.md)** - User profiles

---

## 📖 Additional Resources

- [Content Rendering Guide](../../guides/content-rendering.md)
- [Media Handling Guide](../../guides/media-handling.md)
- [Interaction Patterns](../../guides/interaction-patterns.md)
- [Security Best Practices](../../guides/security.md)
- [API Documentation](../../API_DOCUMENTATION.md)

---

## 💡 Tips

1. **Use Optimistic Updates** for instant feedback
2. **Sanitize Content** to prevent XSS attacks
3. **Implement Content Warnings** for sensitive content
4. **Add Alt Text** to all images for accessibility
5. **Handle Errors Gracefully** with rollback on failure
6. **Test with Screen Readers** to ensure accessibility
7. **Optimize Media Loading** with lazy loading
8. **Cache Interaction State** to reduce API calls

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

