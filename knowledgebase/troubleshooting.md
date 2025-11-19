# Greater Components Troubleshooting

Common issues with verified fixes from production experience.

## Quick Diagnosis

| Symptom | Likely Cause | Section |
|---------|--------------|---------|
| "Cannot find module '@equaltoai/...'" | Package not installed | [Installation Issues](#installation-issues) |
| Components not styled | Missing tokens or ThemeProvider | [Styling Issues](#styling-issues) |
| "Snippets not working" | Using Svelte 4 slot syntax | [Svelte 5 Migration](#svelte-5-migration) |
| "$state is not defined" | Not using Svelte 5 | [Svelte 5 Migration](#svelte-5-migration) |
| Type errors | TypeScript misconfiguration | [TypeScript Issues](#typescript-issues) |
| Modal not closing | Missing onClose handler | [Component Issues](#component-issues) |
| Theme not applying | CSS variables not loading | [Theming Issues](#theming-issues) |
| Timeline performance slow | Virtual scrolling not enabled | [Performance Issues](#performance-issues) |
| SSR hydration errors | Client-only code running on server | [SSR Issues](#ssr-issues) |
| Lesser adapter 401 error | Invalid or expired token | [Lesser Integration](#lesser-integration) |

---

## Installation Issues

### Issue: Cannot find module '@equaltoai/greater-components-primitives'

**Symptoms:**
- Import errors in IDE
- Module not found at runtime
- TypeScript cannot resolve types

**Cause:**
Package not installed or not in package.json

**Solution:**
```bash
# Install missing package
pnpm add @equaltoai/greater-components-primitives

# Or install all core packages
pnpm add @equaltoai/greater-components-primitives \
         @equaltoai/greater-components-tokens \
         @equaltoai/greater-components-icons
```

**Verification:**
```bash
# Check package is installed
pnpm list | grep greater-components
# Should show installed packages

# Verify package.json
cat package.json | grep greater-components
```

**Prevention:**
- Always run `pnpm install` after cloning
- Commit package.json changes
- Use lockfile (pnpm-lock.yaml)

---

### Issue: pnpm command not found

**Symptoms:**
- `pnpm: command not found`
- Cannot run pnpm scripts

**Cause:**
pnpm not installed globally

**Solution:**
```bash
# Install pnpm globally
npm install -g pnpm

# Or use npx
npx pnpm install

# Verify installation
pnpm --version
# Should show 9.0.0 or higher
```

**Alternative:**
Use npm or yarn instead:
```bash
npm install @equaltoai/greater-components-primitives
# or
yarn add @equaltoai/greater-components-primitives
```

---

## Styling Issues

### Issue: Components appear unstyled or have no CSS

**Symptoms:**
- Components render but have no styling
- Missing colors and spacing
- Layout broken

**Cause:**
Missing tokens package or ThemeProvider not wrapped around app

**Solution:**
```bash
# Install tokens package
pnpm add @equaltoai/greater-components-tokens
```

```svelte
<!-- Wrap app in ThemeProvider -->
<script>
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
</script>

<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

**Verification:**
```bash
# Check browser DevTools
# Look for CSS custom properties in :root
# Should see --gr-color-*, --gr-spacing-*, etc.
```

---

### Issue: Custom theme tokens not applying

**Symptoms:**
- CSS custom properties defined but not working
- Theme colors not changing
- Design tokens using default values

**Cause:**
CSS variables defined in wrong scope or after component styles load

**Solution:**
```svelte
<!-- Define tokens in global scope -->
<style>
  :global(:root) {
    --gr-color-primary-600: #8b5cf6;
    --gr-typography-fontFamily-sans: 'Inter', sans-serif;
  }
</style>

<!-- Or in app.css -->
```

```css
/* app.css */
:root {
  --gr-color-primary-600: #8b5cf6;
  --gr-typography-fontFamily-sans: 'Inter', sans-serif;
}
```

**Verification:**
```javascript
// In browser console
getComputedStyle(document.documentElement)
  .getPropertyValue('--gr-color-primary-600')
// Should return your custom color
```

---

## Svelte 5 Migration

### Issue: Snippets not working / "slot is deprecated"

**Symptoms:**
- `<div slot="footer">` not working
- Warning: "Slots are deprecated in Svelte 5"
- Footer/header not rendering

**Cause:**
Using Svelte 4 slot syntax with Svelte 5 components

**Solution:**
```svelte
<!-- INCORRECT: Svelte 4 syntax -->
<Modal open={true} title="Test">
  <div slot="footer">
    <Button>OK</Button>
  </div>
</Modal>

<!-- CORRECT: Svelte 5 syntax -->
<Modal open={true} title="Test">
  {#snippet footer()}
    <Button>OK</Button>
  {/snippet}
</Modal>
```

**Migration:**
```svelte
<!-- Before (Svelte 4) -->
<slot name="header" />
<slot />
<slot name="footer" />

<!-- After (Svelte 5) -->
{@render header?.()}
{@render children?.()}
{@render footer?.()}
```

---

### Issue: "$state is not defined" error

**Symptoms:**
- ReferenceError: $state is not defined
- $derived, $effect also not working
- Reactivity not working

**Cause:**
Using Svelte 4 instead of Svelte 5

**Solution:**
```bash
# Upgrade to Svelte 5
pnpm add svelte@latest

# Verify version
pnpm list svelte
# Should show 5.x.x
```

**Update code:**
```svelte
<!-- Before (Svelte 4) -->
<script>
  let count = 0;
  $: doubled = count * 2;
</script>

<!-- After (Svelte 5) -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

---

## TypeScript Issues

### Issue: Type errors with component props

**Symptoms:**
- TypeScript errors on component usage
- Props marked as not existing
- Type 'Snippet' not found

**Cause:**
TypeScript configuration missing or incorrect

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["svelte", "vite/client"],
    "strict": true,
    "resolveJsonModule": true,
    "allowJs": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**For Snippet type errors:**
```typescript
// Add to global types or component
import type { Snippet } from 'svelte';

interface Props {
  children?: Snippet;
  footer?: Snippet;
}
```

**Verification:**
```bash
# Run TypeScript check
pnpm typecheck
# Should show no errors
```

---

### Issue: Cannot find types for Greater Components

**Symptoms:**
- No autocomplete for component props
- Type errors on valid code
- "Could not find declaration file"

**Cause:**
TypeScript not picking up package types

**Solution:**
```bash
# Ensure TypeScript is installed
pnpm add -D typescript

# Regenerate types
pnpm build
```

**Check types exist:**
```bash
# Verify .d.ts files exist
ls node_modules/@equaltoai/greater-components-primitives/dist/*.d.ts
```

---

## Component Issues

### Issue: Modal not closing when clicking outside

**Symptoms:**
- Modal stays open when clicking overlay
- closeOnOutsideClick not working
- Escape key doesn't close modal

**Cause:**
Missing onClose handler or bind:open not set up

**Solution:**
```svelte
<script>
  let isOpen = $state(false);
</script>

<!-- CORRECT: Bind open state -->
<Modal 
  bind:open={isOpen}
  closeOnOutsideClick={true}
  closeOnEscape={true}
  title="Test"
>
  Content
</Modal>

<!-- Or use onClose -->
<Modal
  open={isOpen}
  onClose={() => isOpen = false}
  title="Test"
>
  Content
</Modal>
```

---

### Issue: Button loading state not showing

**Symptoms:**
- Loading prop set but no spinner
- Button text still visible during loading
- No visual loading indication

**Cause:**
Missing loading prop binding or CSS not loaded

**Solution:**
```svelte
<script>
  let loading = $state(false);
  
  async function handleClick() {
    loading = true;
    try {
      await someAsyncOperation();
    } finally {
      loading = false;
    }
  }
</script>

<Button 
  {loading}
  onclick={handleClick}
>
  Save
</Button>
```

**Check CSS:**
```css
/* Verify these styles exist */
.gr-button--loading {
  position: relative;
}

.gr-button--loading .gr-button__content {
  opacity: 0;
}

.gr-button__spinner {
  position: absolute;
}
```

---

## Theming Issues

### Issue: Dark mode not working

**Symptoms:**
- Theme switcher doesn't change appearance
- Dark theme colors not applying
- Components stay in light mode

**Cause:**
ThemeProvider not wrapping app or data-theme attribute not set

**Solution:**
```svelte
<script>
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
  
  let theme = $state<'light' | 'dark'>('light');
</script>

<ThemeProvider {theme}>
  <YourApp />
</ThemeProvider>
```

**Verify data-theme:**
```javascript
// In browser console
document.documentElement.getAttribute('data-theme')
// Should return 'dark' or 'light'
```

**CSS dark mode:**
```css
:global([data-theme='dark']) {
  --gr-color-gray-50: #1a1a1a;
  --gr-color-gray-900: #f5f5f5;
  /* Other dark theme tokens */
}
```

---

### Issue: Theme persists after page reload incorrectly

**Symptoms:**
- Theme resets to light on reload
- User preference not remembered
- Theme state lost

**Cause:**
Theme not persisted to localStorage

**Solution:**
```svelte
<script>
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
  
  // Load from localStorage
  let theme = $state<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  
  // Save to localStorage when changed
  $effect(() => {
    localStorage.setItem('theme', theme);
  });
</script>

<ThemeProvider {theme}>
  <ThemeSwitcher bind:theme />
  <YourApp />
</ThemeProvider>
```

---

## Performance Issues

### Issue: Timeline scrolling is laggy with many posts

**Symptoms:**
- Slow scrolling performance
- Browser freezes with many items
- High memory usage
- Low FPS during scroll

**Cause:**
Rendering all items instead of using virtual scrolling

**Solution:**
```svelte
<script>
  import { createTimelineStore } from '@equaltoai/greater-components-fediverse';
  
  const timeline = createTimelineStore({
    adapter,
    type: 'HOME',
    virtualScrolling: true,  // Enable virtual scrolling
    estimateSize: 400,       // Estimated item height
  });
</script>

<div class="timeline" style="height: 100vh; overflow: auto;">
  <div style="height: {timeline.totalSize}px; position: relative;">
    {#each timeline.virtualItems as virtualRow}
      {@const item = timeline.items[virtualRow.index]}
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        transform: translateY({virtualRow.start}px);
      ">
        <Status {item} />
      </div>
    {/each}
  </div>
</div>
```

**Performance targets:**
- 60 FPS scrolling
- < 100ms to render new items
- < 200MB memory for 1000 items

---

### Issue: Large bundle size

**Symptoms:**
- Slow page load
- Large JavaScript bundles
- Low Lighthouse performance score

**Cause:**
Importing entire packages instead of specific components

**Solution:**
```typescript
// GOOD: Specific imports
import { Button } from '@equaltoai/greater-components-primitives/Button';
import { Modal } from '@equaltoai/greater-components-primitives/Modal';

// AVOID: Barrel imports (larger bundle)
import { Button, Modal, TextField, Select, /* everything */ } 
  from '@equaltoai/greater-components-primitives';

// NEVER: Namespace imports (imports everything)
import * as Primitives from '@equaltoai/greater-components-primitives';
```

**Analyze bundle:**
```bash
# Build with analysis
pnpm build
npx vite-bundle-visualizer
```

---

## SSR Issues

### Issue: "window is not defined" on server

**Symptoms:**
- Error during SSR build
- `window is not defined`
- `document is not defined`

**Cause:**
Client-only code running on server

**Solution:**
```svelte
<script>
  import { browser } from '$app/environment'; // SvelteKit
  
  let windowWidth = $state(0);
  
  $effect(() => {
    if (browser) {
      windowWidth = window.innerWidth;
      
      const handleResize = () => {
        windowWidth = window.innerWidth;
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  });
</script>
```

**Or use onMount:**
```svelte
<script>
  import { onMount } from 'svelte';
  
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <!-- Client-only content -->
{/if}
```

---

### Issue: Hydration mismatch errors

**Symptoms:**
- "Hydration failed because the initial UI does not match"
- Content flashing on page load
- Different content on server vs client

**Cause:**
Server and client rendering different content

**Solution:**
```svelte
<script>
  import { browser } from '$app/environment';
  
  // Use consistent initial values
  let theme = $state('light');
  
  // Only update after hydration
  onMount(() => {
    theme = localStorage.getItem('theme') || 'light';
  });
</script>
```

**Avoid:**
```svelte
<!-- INCORRECT: Different on server vs client -->
<script>
  // This will cause hydration mismatch
  let time = $state(Date.now());
</script>

<p>Current time: {time}</p>
```

---

## Lesser Integration

### Issue: Lesser adapter returns 401 Unauthorized

**Symptoms:**
- GraphQL queries fail with 401
- "Unauthorized" error message
- Cannot fetch timeline

**Cause:**
Invalid, expired, or missing authentication token

**Solution:**
```bash
# Verify token is valid
curl https://your-instance.social/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "{ viewer { id username } }"}'

# If fails, generate new token from Lesser admin panel
```

**Store token securely:**
```bash
# .env (DO NOT COMMIT)
VITE_LESSER_TOKEN=your-auth-token-here
```

```svelte
<script>
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new LesserGraphQLAdapter({
    endpoint: import.meta.env.VITE_LESSER_ENDPOINT,
    token: import.meta.env.VITE_LESSER_TOKEN,
  });
</script>
```

**Handle token refresh:**
```typescript
let token = getStoredToken();

adapter.onError = async (error) => {
  if (error.message.includes('401')) {
    token = await refreshToken();
    adapter.updateToken(token);
  }
};
```

---

### Issue: GraphQL subscription connection fails

**Symptoms:**
- Real-time updates not working
- WebSocket connection errors
- "Connection closed" errors

**Cause:**
Subscription endpoint incorrect or not enabled

**Solution:**
```typescript
const adapter = new LesserGraphQLAdapter({
  endpoint: 'https://your-instance.social/graphql',
  token: token,
  enableSubscriptions: true,
  subscriptionEndpoint: 'wss://your-instance.social/graphql', // WebSocket URL
});
```

**Verify WebSocket:**
```javascript
// Test WebSocket connection
const ws = new WebSocket('wss://your-instance.social/graphql');
ws.onopen = () => console.log('Connected');
ws.onerror = (error) => console.error('WebSocket error:', error);
```

---

### Issue: Lesser-specific features not available

**Symptoms:**
- Quote posts not working
- Community notes not showing
- Trust scores missing
- Cost analytics unavailable

**Cause:**
Using MastodonRESTAdapter instead of LesserGraphQLAdapter

**Solution:**
```svelte
<script>
  // INCORRECT: REST adapter doesn't support Lesser features
  import { MastodonRESTAdapter } from '@equaltoai/greater-components-adapters';
  
  // CORRECT: Use GraphQL adapter for Lesser
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new LesserGraphQLAdapter({
    endpoint: 'https://lesser-instance.social/graphql',
    token: token
  });
</script>
```

---

## Build Issues

### Issue: Build fails with memory error

**Symptoms:**
- "JavaScript heap out of memory"
- Build process killed
- Out of memory errors

**Cause:**
Large project consuming too much memory during build

**Solution:**
```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 pnpm build

# Or add to package.json
```

```json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
  }
}
```

---

### Issue: Build succeeds but app doesn't work in production

**Symptoms:**
- App works in dev but not production
- Blank page after build
- Console errors in production

**Cause:**
Environment variables not available in production or different Vite config

**Solution:**
```bash
# Test production build locally
pnpm build
pnpm preview

# Check browser console for errors
```

**Environment variables:**
```bash
# .env.production
VITE_LESSER_ENDPOINT=https://production-instance.social/graphql
VITE_LESSER_TOKEN=production-token
```

---

## Getting Help

### Before Reporting Issues

1. **Search existing issues** - Problem may already be solved
2. **Check version compatibility** - Ensure Svelte 5, Node 20+
3. **Try minimal reproduction** - Isolate the problem
4. **Check browser console** - Look for error messages
5. **Review documentation** - Check API reference and patterns

### Creating Bug Reports

Include:
- Greater Components version numbers
- Svelte/SvelteKit version
- Node.js version
- Browser and OS
- Minimal reproduction code
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Community Support

- **GitHub Discussions:** Questions and community help
- **GitHub Issues:** Bug reports and feature requests
- **Discord:** Real-time community support (if available)

### Security Issues

For security vulnerabilities:
- **DO NOT** create public GitHub issues
- **Email:** security@equalto.ai
- Include detailed description and reproduction steps

---

## Related Documentation

- [Getting Started](./getting-started.md) - Installation and setup
- [API Reference](./api-reference.md) - Complete API documentation
- [Core Patterns](./core-patterns.md) - Usage patterns and examples
- [Development Guidelines](./development-guidelines.md) - Coding standards
