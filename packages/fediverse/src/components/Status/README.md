# Status Compound Component

A flexible, composable status card component for displaying ActivityPub/Fediverse posts using the compound component pattern.

## Why Compound Components?

The compound component pattern provides maximum flexibility while maintaining a simple API:

- **Composable** - Mix and match parts to create custom layouts
- **Flexible** - Replace any part with custom implementations
- **Context-aware** - Components share state automatically
- **Type-safe** - Full TypeScript support with proper types
- **Tree-shakeable** - Import only what you use

## Basic Usage

```svelte
<script>
  import { Status } from '@equaltoai/greater-components-fediverse';
  
  const post = {
    id: '123',
    account: {
      username: 'alice',
      displayName: 'Alice',
      avatar: 'https://example.com/avatar.jpg',
      // ...
    },
    content: '<p>Hello Fediverse!</p>',
    createdAt: new Date(),
    repliesCount: 5,
    reblogsCount: 10,
    favouritesCount: 15,
    // ...
  };
  
  async function handleBoost(status) {
    await api.boost(status.id);
  }
  
  async function handleFavorite(status) {
    await api.favorite(status.id);
  }
</script>

<Status.Root 
  status={post}
  handlers={{ onBoost: handleBoost, onFavorite: handleFavorite }}
>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

## Component API

### Status.Root

Container component that provides context to child components.

**Props:**
- `status: Status` - The status data (required)
- `config?: StatusConfig` - Configuration options
  - `density?: 'compact' | 'comfortable'` - Display density (default: `'comfortable'`)
  - `showActions?: boolean` - Show action bar (default: `true`)
  - `clickable?: boolean` - Make status clickable (default: `false`)
  - `showThread?: boolean` - Show thread indicators (default: `true`)
  - `class?: string` - Custom CSS class
- `handlers?: StatusActionHandlers` - Action handlers
  - `onClick?: (status) => void` - Status click handler
  - `onReply?: (status) => void` - Reply handler
  - `onBoost?: (status) => void` - Boost handler
  - `onFavorite?: (status) => void` - Favorite handler
  - `onShare?: (status) => void` - Share handler

### Status.Header

Displays account information, avatar, and timestamp.

**Props:**
- `avatar?: Snippet` - Custom avatar rendering
- `accountInfo?: Snippet` - Custom account info rendering
- `timestamp?: Snippet` - Custom timestamp rendering
- `class?: string` - Custom CSS class

### Status.Content

Renders post content with mentions and hashtags.

**Props:**
- `content?: Snippet` - Custom content rendering
- `class?: string` - Custom CSS class

### Status.Media

Displays media attachments (images, videos, audio).

**Props:**
- `media?: Snippet` - Custom media rendering
- `class?: string` - Custom CSS class

### Status.Actions

Action buttons for interactions (reply, boost, favorite, share).

**Props:**
- `actions?: Snippet` - Custom actions rendering
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: `'sm'`)
- `readonly?: boolean` - Disable interactions (default: `false`)
- `class?: string` - Custom CSS class

## Advanced Examples

### Compact Layout

```svelte
<Status.Root 
  status={post}
  config={{ density: 'compact' }}
>
  <Status.Header />
  <Status.Content />
  <Status.Actions size="sm" />
</Status.Root>
```

### Without Media

```svelte
<Status.Root status={post}>
  <Status.Header />
  <Status.Content />
  <!-- Skip Status.Media -->
  <Status.Actions />
</Status.Root>
```

### Custom Header with Avatar

```svelte
<Status.Root status={post}>
  <Status.Header>
    {#snippet avatar()}
      <CustomAvatar 
        src={post.account.avatar}
        size="large"
        verified={post.account.verified}
      />
    {/snippet}
  </Status.Header>
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

### Read-Only Display

```svelte
<Status.Root 
  status={post}
  config={{ showActions: false }}
>
  <Status.Header />
  <Status.Content />
  <Status.Media />
</Status.Root>
```

### Clickable Status Card

```svelte
<Status.Root 
  status={post}
  config={{ clickable: true }}
  handlers={{ onClick: (status) => navigateTo(`/status/${status.id}`) }}
>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

### Custom Actions

```svelte
<Status.Root status={post}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions>
    {#snippet actions()}
      <div class="custom-actions">
        <button onclick={() => handleReply(post)}>
          <ReplyIcon /> Reply
        </button>
        <button onclick={() => handleBoost(post)}>
          <BoostIcon /> Boost
        </button>
        <button onclick={() => handleBookmark(post)}>
          <BookmarkIcon /> Bookmark
        </button>
      </div>
    {/snippet}
  </Status.Actions>
</Status.Root>
```

### Complete Custom Layout

```svelte
<Status.Root status={post} config={{ showActions: false }}>
  <div class="custom-layout">
    <aside class="sidebar">
      <Status.Header>
        {#snippet avatar()}
          <img src={post.account.avatar} alt="" />
        {/snippet}
        {#snippet accountInfo()}
          <!-- Hide account info in sidebar -->
        {/snippet}
      </Status.Header>
    </aside>
    
    <main class="main-content">
      <Status.Header>
        {#snippet avatar()}
          <!-- Hide avatar in main -->
        {/snippet}
      </Status.Header>
      <Status.Content />
      <Status.Media />
      
      <footer class="footer">
        <Status.Actions />
        <div class="metadata">
          Posted {post.createdAt}
        </div>
      </footer>
    </main>
  </div>
</Status.Root>
```

## Styling

### CSS Custom Properties

The Status component uses CSS custom properties for easy customization:

```css
/* Override default colors and spacing */
.status-root {
  --status-bg: #ffffff;
  --status-bg-hover: #f7f9fa;
  --status-border-color: #e1e8ed;
  --status-text-primary: #0f1419;
  --status-text-secondary: #536471;
  --status-link-color: #1d9bf0;
  --status-spacing-xs: 0.25rem;
  --status-spacing-sm: 0.5rem;
  --status-spacing-md: 1rem;
  --status-font-size-sm: 0.875rem;
  --status-font-size-base: 1rem;
  --status-radius-md: 8px;
  --status-focus-ring: #3b82f6;
}
```

### Custom Classes

```svelte
<Status.Root 
  status={post}
  config={{ class: 'my-custom-status' }}
>
  <Status.Header class="my-custom-header" />
  <Status.Content class="my-custom-content" />
  <Status.Actions class="my-custom-actions" />
</Status.Root>
```

## Integration with Lesser

```svelte
<!-- lesser/src/components/FeedItem.svelte -->
<script>
  import { Status } from '@equaltoai/greater-components-fediverse';
  import { boostPost, favoritePost } from '$lib/api';
  
  let { post } = $props();
</script>

<Status.Root 
  status={post}
  config={{ 
    density: 'comfortable',
    clickable: true,
    class: 'lesser-feed-item'
  }}
  handlers={{
    onClick: (status) => goto(`/posts/${status.id}`),
    onBoost: boostPost,
    onFavorite: favoritePost
  }}
>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

## Migration from StatusCard

**Old (StatusCard):**
```svelte
<StatusCard 
  status={post}
  density="comfortable"
  showActions={true}
  onBoost={handleBoost}
  onFavorite={handleFavorite}
/>
```

**New (Status Compound):**
```svelte
<Status.Root 
  status={post}
  config={{ density: 'comfortable' }}
  handlers={{ onBoost: handleBoost, onFavorite: handleFavorite }}
>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

**Benefits of migration:**
- More flexible - customize any part
- Better tree-shaking - only import what you use
- Easier to test - test individual parts
- More maintainable - clear component boundaries

## TypeScript Support

Full TypeScript support with proper types:

```typescript
import type { Status as StatusType } from '@equaltoai/greater-components-fediverse';
import type { StatusConfig, StatusActionHandlers } from '@equaltoai/greater-components-fediverse/Status';

const config: StatusConfig = {
  density: 'comfortable',
  showActions: true,
  clickable: false
};

const handlers: StatusActionHandlers = {
  onBoost: async (status: StatusType) => {
    await api.boost(status.id);
  },
  onFavorite: async (status: StatusType) => {
    await api.favorite(status.id);
  }
};
```

## Performance

- **Tree-shakeable** - Import only the components you use
- **Lazy rendering** - Components only render when included
- **Efficient updates** - Svelte 5 runes for optimal reactivity
- **Small bundle** - Each component is independently optimized

## Accessibility

All Status components are fully accessible:

- ✅ Proper ARIA attributes
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Semantic HTML
- ✅ WCAG 2.1 AA compliant

## Best Practices

1. **Always include Status.Root** - It provides context for child components
2. **Use custom snippets for flexibility** - Override default rendering when needed
3. **Leverage CSS custom properties** - Easy theming without specificity wars
4. **Pass handlers via Root** - Centralize action handling
5. **Test individual components** - Easier to maintain and debug

