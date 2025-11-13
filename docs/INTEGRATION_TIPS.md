# Greater Components Integration Tips

## Quick Answers to Your Questions

### 1. ComposeBox Import Issue ✅

**Problem:** `ComposeBox` is deprecated and may have import issues.

**Solution:** Use the new `Compose` compound component instead:

```svelte
<script>
  // ❌ Don't use this (deprecated)
  // import { ComposeBox } from '@equaltoai/greater-components/fediverse';
  
  // ✅ Use this instead
  import { Compose } from '@equaltoai/greater-components/fediverse';
  
  async function handleSubmit(data) {
    await api.statuses.create(data);
  }
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
  <Compose.Editor autofocus />
  <Compose.CharacterCount />
  <Compose.VisibilitySelect />
  <Compose.Submit />
</Compose.Root>
```

**Alternative named exports:**
```svelte
import {
  ComposeRoot,
  ComposeEditor,
  ComposeSubmit,
  ComposeCharacterCount,
  ComposeVisibilitySelect
} from '@equaltoai/greater-components/fediverse';

<ComposeRoot handlers={{ onSubmit: handleSubmit }}>
  <ComposeEditor autofocus />
  <ComposeCharacterCount />
  <ComposeSubmit />
</ComposeRoot>
```

### 2. Styling Setup for SvelteKit CSR ✅

**Required CSS imports for SvelteKit (Client-Side Rendering):**

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  // 1. Design tokens (REQUIRED)
  import '@equaltoai/greater-components/tokens/theme.css';
  
  // 2. Component styles (REQUIRED for CSR)
  import '@equaltoai/greater-components/primitives/style.css';
  
  // 3. Optional: High contrast support
  import '@equaltoai/greater-components/tokens/high-contrast.css';
</script>
```

**Why both CSS files?**
- `theme.css` - CSS custom properties (design tokens)
- `style.css` - Component-specific styles (needed when compiling from source)

**For SSR (Server-Side Rendering):**
If you're using SSR, components compile from source and CSS is auto-injected. You may only need:
```svelte
import '@equaltoai/greater-components/tokens/theme.css';
```

### 3. ThemeProvider Setup ✅

**Wrap your app with ThemeProvider:**

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
  import '@equaltoai/greater-components/tokens/theme.css';
  import '@equaltoai/greater-components/primitives/style.css';
</script>

<ThemeProvider>
  <slot />
</ThemeProvider>

<style>
  :global(:root) {
    color-scheme: light dark;
  }
</style>
```

**ThemeProvider automatically:**
- Detects system theme preference
- Persists theme choice to localStorage
- Prevents flash of unstyled content (FOUC)
- Applies theme attributes to `<html>` element

### 4. Status Type Compatibility ✅

**GC Status types are Mastodon-compatible** with extensions:

```typescript
import type { Status, Account } from '@equaltoai/greater-components/fediverse';

// GC Status includes all Mastodon fields PLUS:
interface Status {
  // Standard Mastodon fields
  id: string;
  account: Account;
  content: string;
  createdAt: string | Date;
  // ... all standard fields
  
  // Lesser-specific extensions (optional)
  trustScore?: number;
  reputation?: Reputation;
  communityNotes?: CommunityNote[];
  quoteContext?: QuoteContext;
  aiAnalysis?: AIAnalysis;
}
```

**No adapter needed** - GC Status types are a superset of Mastodon API types. Your Mastodon API responses should work directly.

### 5. Centralized Import Helper Pattern ✅

Your `src/lib/gc.ts` pattern is excellent! Here's an enhanced version:

```typescript
// src/lib/gc.ts
export {
  // Primitives
  Button,
  TextField,
  Modal,
  Tabs,
  ThemeProvider,
  ThemeSwitcher
} from '@equaltoai/greater-components/primitives';

export {
  // Fediverse components
  TimelineVirtualizedReactive,
  NotificationsFeedReactive,
  StatusCard,
  ActionBar,
  Compose,
  ComposeRoot,
  ComposeEditor,
  ComposeSubmit,
  ComposeCharacterCount,
  ComposeVisibilitySelect
} from '@equaltoai/greater-components/fediverse';

export {
  // Adapters
  createLesserClient,
  LesserAdapter
} from '@equaltoai/greater-components/adapters';

export {
  // Icons (replace lucide-svelte)
  IconHome,
  IconUser,
  IconSettings
  // ... etc
} from '@equaltoai/greater-components/icons';

// Export types
export type {
  Status,
  Account,
  MediaAttachment,
  Notification
} from '@equaltoai/greater-components/fediverse';
```

### 6. Bridge Component Pattern ✅

Your bridge pattern is correct! Here's a refined example:

```svelte
<!-- src/lib/components/TimelineGC.svelte -->
<script lang="ts">
  import { TimelineVirtualizedReactive } from '$lib/gc';
  import { timelineStore } from '$lib/stores/timeline.svelte';
  
  interface Props {
    type: 'home' | 'public' | 'local';
  }
  
  let { type }: Props = $props();
  
  const items = $derived(timelineStore.timelines[type].statuses);
  const loadingBottom = $derived(timelineStore.timelines[type].isLoadingMore);
  
  function handleLoadMore() {
    timelineStore.loadMore(type);
  }
  
  function handleStatusAction(action: string, statusId: string) {
    // Your custom action handling
    timelineStore.handleAction(action, statusId);
  }
</script>

<TimelineVirtualizedReactive
  {items}
  {loadingBottom}
  onLoadMore={handleLoadMore}
  onStatusAction={handleStatusAction}
/>
```

### 7. ComposeBox Bridge Example ✅

```svelte
<!-- src/lib/components/ComposeBoxGC.svelte -->
<script lang="ts">
  import { Compose } from '$lib/gc';
  import { api } from '$lib/api';
  
  interface Props {
    replyToStatus?: Status;
    onSuccess?: () => void;
  }
  
  let { replyToStatus, onSuccess }: Props = $props();
  
  async function handleSubmit(data: ComposeState) {
    try {
      await api.statuses.create({
        status: data.content,
        inReplyToId: replyToStatus?.id,
        visibility: data.visibility,
        spoilerText: data.contentWarning,
        mediaIds: data.attachments.map(a => a.id)
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to post:', error);
    }
  }
</script>

<Compose.Root
  initialState={{
    inReplyTo: replyToStatus?.id,
    content: replyToStatus ? `@${replyToStatus.account.acct} ` : ''
  }}
  handlers={{ onSubmit: handleSubmit }}
>
  <Compose.Editor autofocus />
  <Compose.CharacterCount />
  <Compose.VisibilitySelect />
  <Compose.Submit />
</Compose.Root>
```

### 8. SvelteKit Configuration ✅

**Ensure Svelte 5 runes are enabled:**

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true  // ⚠️ REQUIRED for Svelte 5
  }
};
```

**Vite config (if needed):**

```javascript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['@equaltoai/greater-components']  // Let Vite compile from source
  }
};
```

### 9. TypeScript Configuration ✅

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}
```

### 10. Verification Checklist ✅

**After setup, verify:**

1. ✅ CSS imports in `+layout.svelte`
2. ✅ ThemeProvider wrapping app
3. ✅ Svelte 5 runes enabled
4. ✅ Components compile from source (check `node_modules/.vite`)
5. ✅ No `$` prefix errors in console
6. ✅ Styles apply correctly
7. ✅ Theme switching works

**Test component:**

```svelte
<!-- src/routes/test/+page.svelte -->
<script>
  import { Button, TextField } from '$lib/gc';
</script>

<Button>Test Button</Button>
<TextField placeholder="Test input" />
```

If this renders styled, you're good to go!

## Common Issues & Solutions

### Issue: Components render but look unstyled

**Solution:**
1. Check CSS imports in `+layout.svelte`
2. Verify `style.css` (not `styles.css`) is imported
3. Check browser console for CSS loading errors
4. Clear `.svelte-kit` cache: `rm -rf .svelte-kit`

### Issue: ComposeBox import fails

**Solution:** Use `Compose` compound component instead (see section 1)

### Issue: Type errors with Status types

**Solution:** GC Status types are compatible - ensure you're importing from the correct package:
```typescript
import type { Status } from '@equaltoai/greater-components/fediverse';
```

### Issue: ThemeProvider not applying theme

**Solution:**
1. Ensure ThemeProvider wraps your entire app
2. Check that `theme.css` is imported
3. Verify `data-theme` attribute appears on `<html>` element

## Best Practices

1. **Always use the centralized import helper** (`$lib/gc.ts`) for consistency
2. **Use bridge components** to connect GC to your custom stores
3. **Prefer compound components** (`Compose.*`, `Status.*`) over deprecated single components
4. **Import CSS in layout** not individual pages
5. **Wrap app with ThemeProvider** for theme management
6. **Use TypeScript** - GC has excellent type definitions

## Next Steps

1. Replace `ComposeBox` with `Compose` compound component
2. Verify CSS imports in your `+layout.svelte`
3. Test with a simple component (Button, TextField)
4. Gradually migrate other components using bridge pattern

## Need Help?

- Check `docs/FOR_LESSER_TEAM.md` for Lesser-specific guidance
- See `docs/troubleshooting/README.md` for common issues
- Review `apps/playground` for working examples

