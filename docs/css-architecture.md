# CSS Architecture Guide

<!-- AI Training: This is the comprehensive CSS architecture documentation for Greater Components -->

Greater Components uses a layered CSS architecture that separates design tokens from component styles. This enables theming, tree-shaking, and modular imports.

## Overview

Greater Components CSS is organized into two distinct layers:

1. **Design Tokens** - CSS custom properties defining colors, spacing, typography, etc.
2. **Component Styles** - CSS class definitions that use the token variables

Both layers must be imported for components to render correctly.

## Architecture Layers

### Layer 1: Design Tokens

Design tokens are CSS custom properties that define the visual foundation:

```
styles/greater/tokens.css        # Tokens + themes (required)
styles/greater/primitives.css    # Primitive styles (required)
styles/greater/social.css        # Social face styles (optional)
```

**Token categories:**

| Category   | Example Variables                                            | Purpose                    |
| ---------- | ------------------------------------------------------------ | -------------------------- |
| Colors     | `--gr-color-primary-*`, `--gr-color-gray-*`                  | Brand and UI colors        |
| Typography | `--gr-typography-fontSize-*`, `--gr-typography-fontWeight-*` | Font settings              |
| Spacing    | `--gr-spacing-scale-*`                                       | Margins, padding, gaps     |
| Effects    | `--gr-shadows-*`, `--gr-radii-*`                             | Shadows and border radius  |
| Motion     | `--gr-motion-duration-*`, `--gr-motion-easing-*`             | Animations and transitions |
| Semantic   | `--gr-semantic-foreground-*`, `--gr-semantic-background-*`   | Context-aware colors       |

### Layer 2: Component Styles

Component styles define the visual appearance using token variables:

```
styles/greater/primitives.css             # Primitive components (Button, Card, etc.)
styles/greater/social.css                 # Social face components (Timeline, Status, Profile, etc.)
```

**Component classes include:**

- `.gr-button`, `.gr-button--solid`, `.gr-button--outline`, `.gr-button--ghost`
- `.gr-card`, `.gr-card--elevated`, `.gr-card--outlined`, `.gr-card--filled`
- `.gr-container`, `.gr-heading`, `.gr-text`, `.gr-modal`
- And 30+ more component class families

---

## Import Configurations

### Minimal Setup (Primitives Only)

For apps using only basic components (Button, Card, Container, Heading, Text, etc.):

```svelte
<script lang="ts">
	// Layer 1: Design tokens (colors, spacing, typography variables)
	import '$lib/styles/greater/tokens.css';
	// Layer 2: Component styles (button, card, container classes)
	import '$lib/styles/greater/primitives.css';

	import { ThemeProvider } from '$lib/greater/primitives';

	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

### Full Setup (Primitives + Social Face)

For apps using social face components (Timeline, Status, Profile, ActionBar, etc.):

```svelte
<script lang="ts">
	// Layer 1: Design tokens
	import '$lib/styles/greater/tokens.css';
	// Layer 2: Primitives + social face styles
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/social.css';

	import { ThemeProvider } from '$lib/greater/primitives';

	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

### With Dark Theme

```svelte
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';

	import { ThemeProvider } from '$lib/greater/primitives';

	let { children } = $props();
</script>

<ThemeProvider defaultTheme="dark">
	{@render children()}
</ThemeProvider>
```

### With High Contrast (Accessibility)

```svelte
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';

	import { ThemeProvider } from '$lib/greater/primitives';

	let { children } = $props();
</script>

<ThemeProvider defaultTheme="high-contrast">
	{@render children()}
</ThemeProvider>
```

---

## Import Order

**Critical:** Tokens must be imported before component styles.

```ts
// ✅ CORRECT: Proper import order
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';

// ❌ INCORRECT: Component styles before tokens
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/tokens.css';
```

**Why order matters:** Component styles reference token variables like `var(--gr-color-primary-600)`. If tokens aren't loaded first, these variables are undefined and components won't style correctly.

---

## Troubleshooting

| Symptom                                                             | Cause                                        | Solution                                          |
| ------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------- |
| Components render but appear completely unstyled (browser defaults) | Missing component CSS                        | Add `$lib/styles/greater/primitives.css` (and face CSS if used) |
| Styles partially work, colors/spacing wrong                         | Missing token CSS                            | Add `$lib/styles/greater/tokens.css` before component CSS       |
| Console shows `var(--gr-*)` as invalid value                        | Tokens not loaded or loaded after components | Import `$lib/styles/greater/tokens.css` FIRST     |
| Dark mode not working                                               | Theme not set                                | Ensure `ThemeProvider defaultTheme="dark"` or set `data-theme="dark"` |
| Social face components unstyled                                     | Face CSS not imported                        | Import `$lib/styles/greater/social.css` after primitives          |
| Button/Card have no styling but render                              | Component CSS missing                        | Verify `$lib/styles/greater/primitives.css` is imported           |

### Quick Diagnosis

**Test 1: Check token loading**

```javascript
// In browser console
getComputedStyle(document.documentElement).getPropertyValue('--gr-color-primary-600');
// Should return: "#2563eb" (or similar hex color)
// If empty: $lib/styles/greater/tokens.css not loaded
```

**Test 2: Check component classes**

```javascript
// In browser console
document.querySelector('.gr-button');
// Should return element if Button component is rendered
// Check if element has expected styles in DevTools
```

---

## File Reference

| Import Path                      | Size          | Contents                                           |
| -------------------------------- | ------------- | -------------------------------------------------- |
| `$lib/styles/greater/tokens.css`     | ~180+ lines   | Tokens + theme variables (light/dark/high-contrast) |
| `$lib/styles/greater/primitives.css` | ~3,000+ lines | Primitive component class definitions               |
| `$lib/styles/greater/social.css`     | ~10,000+ lines| Social face component class definitions             |

---

## Related Documentation

- [Getting Started](./getting-started.md) - Quick setup guide with CSS imports
- [Core Patterns](./core-patterns.md) - Component usage patterns
- [Troubleshooting](./troubleshooting.md) - Full troubleshooting guide
- [API Reference](./api-reference.md) - Complete component API

---

## Summary

1. **Always import both layers:** tokens AND component styles
2. **Order matters:** tokens first, then primitives, then face CSS (if used)
3. **Choose the right styles:** `$lib/styles/greater/primitives.css` for basic apps, plus face CSS as needed
4. **Theme switching:** use `ThemeProvider` or set `data-theme` (tokens are in `$lib/styles/greater/tokens.css`)
