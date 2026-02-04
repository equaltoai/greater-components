# Greater Components Troubleshooting

Common issues with verified fixes from production experience.

## Quick Diagnosis

| Symptom                                    | Likely Cause                                 | Section                                           |
| ------------------------------------------ | -------------------------------------------- | ------------------------------------------------- |
| "Cannot find module '$lib/greater/...'"    | Greater not vendored yet                     | [Installation Issues](#installation-issues)       |
| "Could not resolve 'isomorphic-dompurify'" | Missing peer dependency                      | [Peer Dependency Issues](#peer-dependency-issues) |
| "Could not resolve 'marked'" / "shiki"     | Missing peer dependency                      | [Peer Dependency Issues](#peer-dependency-issues) |
| Components render but appear unstyled      | Missing `$lib/styles/greater/primitives.css` | [Styling Issues](#styling-issues)                 |
| CSS variables show as invalid              | Missing `$lib/styles/greater/tokens.css`     | [Styling Issues](#styling-issues)                 |
| `preventFlashScript is not defined`        | Missing theme flash prevention               | [Theming Issues](#theming-issues)                 |
| "Snippets not working"                     | Using Svelte 4 slot syntax                   | [Svelte 5 Migration](#svelte-5-migration)         |
| "$state is not defined"                    | Not using Svelte 5                           | [Svelte 5 Migration](#svelte-5-migration)         |
| Type errors                                | TypeScript misconfiguration                  | [TypeScript Issues](#typescript-issues)           |
| Modal not closing                          | Missing onClose handler                      | [Component Issues](#component-issues)             |
| Theme not applying                         | CSS variables not loading                    | [Theming Issues](#theming-issues)                 |
| Timeline performance slow                  | Virtual scrolling not enabled                | [Performance Issues](#performance-issues)         |
| SSR hydration errors                       | Client-only code running on server           | [SSR Issues](#ssr-issues)                         |
| Lesser adapter 401 error                   | Invalid or expired token                     | [Lesser Integration](#lesser-integration)         |

---

## Installation Issues

### Issue: Cannot find module '$lib/greater/primitives'

**Symptoms:**

- Import errors in IDE
- Module not found at runtime
- TypeScript cannot resolve types

**Cause:**
Greater CLI has not been run (or the vendored files were not added).

**Solution:**

```bash
# Initialize Greater in your project (creates components.json + injects CSS)
greater init

# Add a face bundle (includes core packages + components)
greater add faces/social

# Or add only core packages
greater add primitives icons tokens headless
```

**Verification:**

```bash
ls src/lib/greater/primitives
ls src/lib/greater/icons
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
pnpm not enabled (or not installed)

**Solution:**

```bash
# Node 24+ includes Corepack
corepack enable
corepack prepare pnpm@10.25.0 --activate

# Verify installation
pnpm --version
# Should show 10.0.0 or higher
```

---

## Peer Dependency Issues

### Issue: Could not resolve "isomorphic-dompurify" / "marked" / "shiki"

**Symptoms:**

- Build fails with "Could not resolve" errors
- Dev server crashes immediately after starting
- Error points to MarkdownRenderer.svelte or CodeBlock.svelte
- Rollup/Vite error during bundling

**Full Error Example:**

```
[vite]: Rollup failed to resolve import "isomorphic-dompurify" from "src/lib/greater/content/components/MarkdownRenderer.svelte"
```

**Cause:**

You're using components that have peer dependencies which aren't bundled with Greater Components. These must be installed separately.

**Solution:**

```bash
# Install all optional peer dependencies
pnpm add isomorphic-dompurify marked shiki

# Or install only what you need:
pnpm add isomorphic-dompurify marked  # For MarkdownRenderer
pnpm add shiki                         # For CodeBlock
```

**Which components need peer dependencies?**

| Component           | Peer Dependencies                | Purpose                 |
| ------------------- | -------------------------------- | ----------------------- |
| MarkdownRenderer    | `isomorphic-dompurify`, `marked` | Safe markdown rendering |
| CodeBlock           | `shiki`                          | Syntax highlighting     |
| sanitizeHtml (util) | `isomorphic-dompurify`           | HTML sanitization       |

**Prevention:**

- Check component documentation before use
- Install peer deps when adding new components
- If only using basic components (Button, Card, etc.), peer deps aren't needed

**Verification:**

```bash
pnpm dev    # Should start without errors
pnpm build  # Should complete successfully
```

---

## Styling Issues

### Issue: Components appear unstyled or have browser default styling

**Symptoms:**

- Components render but appear as browser defaults
- Buttons look like plain HTML buttons (no colors, wrong font)
- Cards have no shadow or border
- Missing colors, spacing, and typography

**Cause:**

Greater Components uses a **two-layer CSS architecture**. Both layers must be imported:

1. `$lib/styles/greater/tokens.css` - Design tokens (CSS variables)
2. `$lib/styles/greater/primitives.css` - Component class definitions

**Most common cause:** Only importing `$lib/styles/greater/tokens.css` but missing `$lib/styles/greater/primitives.css`.

**Solution:**

Import BOTH CSS layers in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// ✅ Layer 1: Design tokens (colors, spacing, typography variables)
	import '$lib/styles/greater/tokens.css';
	// ✅ Layer 2: Component styles (button, card, container classes)
	import '$lib/styles/greater/primitives.css';

	import { ThemeProvider } from '$lib/greater/primitives';

	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

**For apps using fediverse components:**

```svelte
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/social.css';
</script>
```

**Verification:**

```javascript
// In browser console - check tokens loaded:
getComputedStyle(document.documentElement).getPropertyValue('--gr-color-primary-600');
// Should return: "#2563eb" (or similar color)

// Check a button has proper styling in DevTools:
// - Blue background (solid variant)
// - Proper padding and border-radius
// - Correct font family
```

**Quick Diagnosis Table:**

| Symptom                             | Missing Import                       | Solution                                              |
| ----------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| Components render but unstyled      | `$lib/styles/greater/primitives.css` | Add component styles import                           |
| CSS variables show as invalid       | `$lib/styles/greater/tokens.css`     | Add tokens import FIRST                               |
| Both unstyled AND invalid variables | Both files                           | Add both imports in correct order                     |
| Social face components unstyled     | Face CSS                             | Add `$lib/styles/greater/social.css` after primitives |

See [CSS Architecture Guide](./css-architecture.md) for complete documentation.

---

### Issue: CSS variables show as invalid or undefined

**Symptoms:**

- Browser DevTools shows `var(--gr-color-primary-600)` as invalid
- Components have partial styling but wrong colors
- Console may show warnings about invalid CSS values

**Cause:**

Token CSS file not loaded, or loaded AFTER component styles.

**Solution:**

Ensure `$lib/styles/greater/tokens.css` is imported FIRST:

```ts
// ✅ CORRECT ORDER
import '$lib/styles/greater/tokens.css'; // 1. Tokens first
import '$lib/styles/greater/primitives.css'; // 2. Component styles second

// ❌ WRONG ORDER (styles before tokens)
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/tokens.css';
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
<!-- Or in app.css -->

<!-- Define tokens in global scope -->
<style>
	:global(:root) {
		--gr-color-primary-600: #8b5cf6;
		--gr-typography-fontFamily-sans: 'Inter', sans-serif;
	}
</style>
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
getComputedStyle(document.documentElement).getPropertyValue('--gr-color-primary-600');
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
TypeScript not picking up vendored types (or the vendored files are missing).

**Solution:**

```bash
# Ensure TypeScript is installed
pnpm add -D typescript

# (SvelteKit) refresh generated types
pnpm svelte-kit sync

# If types were accidentally deleted, re-add core packages
greater add primitives --force
```

**Check types exist:**

```bash
# Verify .d.ts files exist
ls src/lib/greater/primitives/index.d.ts
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
<Modal bind:open={isOpen} closeOnOutsideClick={true} closeOnEscape={true} title="Test">
	Content
</Modal>

<!-- Or use onClose -->
<Modal open={isOpen} onClose={() => (isOpen = false)} title="Test">Content</Modal>
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

<Button {loading} onclick={handleClick}>Save</Button>
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
	import { ThemeProvider } from '$lib/greater/primitives';

	let theme = $state<'light' | 'dark'>('light');
</script>

<ThemeProvider {theme}>
	<YourApp />
</ThemeProvider>
```

**Verify data-theme:**

```javascript
// In browser console
document.documentElement.getAttribute('data-theme');
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

### Issue: preventFlashScript is not defined

**Symptoms:**

- Console error: `ReferenceError: preventFlashScript is not defined`
- Brief flash of wrong theme on page load
- Theme flickers before settling

**Cause:**

The theme flash prevention script is referenced but not defined in your `app.html`.

**Solution:**

Add the theme flash prevention script to your `app.html`:

```html
<!-- src/app.html -->
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!-- Prevent theme flash on page load -->
		<script>
			(function () {
				const theme = localStorage.getItem('gr-theme') || 'light';
				document.documentElement.setAttribute('data-theme', theme);
			})();
		</script>

		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Why this is needed:**

Without this script, the page renders with the default theme first, then switches to the user's saved preference after JavaScript loads. This causes a visible flash. The inline script runs immediately before render, applying the correct theme.

**Alternative - ignore the error:**

If you don't need theme persistence, the error is harmless and can be ignored. Components will still render correctly.

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
	import { ThemeProvider } from '$lib/greater/primitives';

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
<script lang="ts">
	import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';
</script>

<TimelineVirtualizedReactive {items} estimateSize={320} />
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
// GOOD: Import only what you use
import { Button, Modal } from '$lib/greater/primitives';

// For strict bundle control, import component files directly
import ButtonComponent from '$lib/greater/primitives/components/Button.svelte';
import ModalComponent from '$lib/greater/primitives/components/Modal.svelte';
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
<script lang="ts">
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';

	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
		token: import.meta.env.VITE_LESSER_TOKEN,
	});
</script>
```

**Handle token refresh:**

```typescript
let token = getStoredToken();

async function withAuth<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (
			error instanceof Error &&
			(error.message.includes('401') || error.message.includes('403'))
		) {
			token = await refreshToken();
			adapter.updateToken(token);
			return await fn();
		}
		throw error;
	}
}
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
	httpEndpoint: 'https://your-instance.social/graphql',
	wsEndpoint: 'wss://your-instance.social/graphql',
	token,
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
Using a non-Lesser data source (e.g. REST timelines) instead of the Lesser GraphQL adapter

**Solution:**

```svelte
<script lang="ts">
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';

	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: 'https://lesser-instance.social/graphql',
		wsEndpoint: 'wss://lesser-instance.social/graphql',
		token,
	});
</script>
```

---

## Clipboard & Export Issues

### Issue: Clipboard operations fail ("Clipboard API unavailable")

**Symptoms:**

- `copyToClipboard` returns `{ success: false }`
- Error: "Clipboard API unavailable"
- CopyButton works in dev but fails in production

**Cause:**
Browser security restriction. Clipboard API requires a **Secure Context** (HTTPS or localhost).

**Solution:**

- Ensure your site is served over HTTPS
- For local testing on other devices, use a tunnel (e.g., ngrok) or set up local HTTPS
- The utility automatically falls back to `execCommand('copy')` if available, but this is deprecated and less reliable.

### Issue: CopyButton doesn't show feedback

**Symptoms:**

- Clicking button copies text (content is in clipboard)
- But icon doesn't change to checkmark
- "Copied!" label doesn't appear

**Cause:**
Reactivity issue or component unmounted before timeout.

**Solution:**

- Ensure `feedbackDuration` is set (default 2000ms)
- If wrapping CopyButton, ensure the wrapper doesn't recreate the button on click
- Check console for errors in `onCopy` callback

### Issue: Export generates malformed markdown

**Symptoms:**

- `exportToMarkdown` output is missing content
- Tables are broken
- Code blocks lose formatting

**Cause:**
Complex HTML structures that Turndown handles poorly or missing GFM plugin.

**Solution:**

- Ensure the input HTML is valid
- `htmlToMarkdown` includes GFM plugin support for tables and strikethrough
- For complex custom components, you might need to preprocess the HTML before exporting
- Check `turndown` configuration options in `packages/utils/src/html-to-markdown.ts`

### Issue: Download doesn't trigger

**Symptoms:**

- `downloadMarkdown` called but no file prompt

- Console warning about popup blocked

**Cause:**

Browser popup blocker or user interaction requirement.

**Solution:**

- Ensure `downloadMarkdown` (or the function calling it) is triggered **directly** by a user user event (click)

- Do not call it inside an async operation that takes too long (> 5s), as browsers may lose the user gesture context

- Check browser settings for download restrictions

### Issue: GradientText appears solid black/white

**Symptoms:**

- Gradient doesn't show up on text

- Text is invisible or solid color

**Cause:**

Browser doesn't support `background-clip: text` or vendor prefixes missing.

**Solution:**

- Ensure `-webkit-background-clip: text` is present (component includes it)

- Check if `color: transparent` is being overridden by another style

- Ensure background is actually applied (inspect element)

### Issue: List icons not aligning

**Symptoms:**

- Icons in `List` or `ListItem` are vertically misaligned with text

**Cause:**

Flex alignment issues or line-height mismatches.

**Solution:**

- The `ListItem` component uses `align-items: flex-start` and a top margin for optical alignment.

- If using custom icons, ensure they have consistent `viewBox` and are sized correctly.

- Use the `iconSize` prop to adjust if needed.

### Issue: CodeBlock not highlighting code

**Symptoms:**

- Code renders as plain text

- No colors appear

**Cause:**

Shiki lazy loading failed, or language is not supported/loaded.

**Solution:**

- Ensure `shiki` is installed.

- Check console for errors.

- If using a custom language, ensure it is in the loaded list (see `CodeBlock.svelte`).

- Fallback to plain text is automatic on error.

### Issue: Drag-drop not working

**Symptoms:**

- Drop events not firing

- Browser opens file instead of handling drop

**Cause:**

Default browser behavior not prevented, or `ondragover` handler missing.

**Solution:**

- `DropZone` handles `preventDefault` on `dragover` and `drop`.

- Ensure nothing is blocking pointer events on the DropZone.

- On mobile, drag-drop is often not supported; `DropZone` provides a click-to-upload fallback.

### Issue: Markdown renders raw HTML

**Symptoms:**

- HTML tags appear in output instead of rendered elements

**Cause:**

`sanitize` prop is true (default) and tags are stripped, or input is escaped.

**Solution:**

- `MarkdownRenderer` sanitizes aggressively by default using DOMPurify.

- If you trust the content source, you can set `sanitize={false}` (NOT RECOMMENDED for user content).

- Check `allowedTags` prop to enable specific tags.

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
2. **Check version compatibility** - Ensure Svelte 5, Node 24+
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
