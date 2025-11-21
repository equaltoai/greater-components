# Greater Components Documentation Enhancement Specification

**Project:** greater-components  
**Goal:** Fix documentation gaps that caused PAI to generate incorrect code  
**Scope:** Update 5 documentation files with critical corrections and additions  
**Priority:** Critical - Directly impacts PAI code generation accuracy

---

## Background

Recent PAI session analysis (paicodes implementation) revealed 4 critical documentation gaps:

1. **Missing CSS import requirement** - Caused unstyled components
2. **Wrong ThemeSwitcher variants** - Caused TypeScript errors
3. **Missing Svelte 5 :global() guidance** - Caused 6 warnings
4. **Missing CSS best practices** - Caused compatibility warnings

These documentation bugs directly caused PAI to generate incorrect code through knowledge base queries.

---

## Success Criteria

After implementation:

- ✅ All ThemeSwitcher variant references show 'compact' | 'full' (not 'dropdown' | 'toggle' | 'button')
- ✅ CSS import requirement prominently documented in getting-started.md
- ✅ Correct CSS import path in importing-components.md
- ✅ Svelte 5 :global() scoping guidance in core-patterns.md
- ✅ CSS vendor prefix best practices in development-guidelines.md
- ✅ New quick-reference.md created for AI agents
- ✅ All examples using ThemeSwitcher updated to use correct variants

---

## CHANGE 1: Fix ThemeSwitcher Variants in api-reference.md

### Location

`docs/api-reference.md` lines 526-536

### Current Content (BEFORE)

````markdown
#### ThemeSwitcher

**Purpose:** UI control for theme switching

**Props:**

```typescript
interface ThemeSwitcherProps {
	variant?: 'dropdown' | 'toggle' | 'button';
}
```
````

````

### New Content (AFTER)
```markdown
#### ThemeSwitcher

**Purpose:** UI control for theme switching

**Props:**
```typescript
interface ThemeSwitcherProps {
  variant?: 'compact' | 'full';  // Default: 'compact'
  showPreview?: boolean;          // Show theme preview colors (default: true)
  showAdvanced?: boolean;         // Show advanced preferences (default: false)
  class?: string;                 // Additional CSS classes
  value?: ColorScheme;            // Controlled theme value ('light' | 'dark' | 'high-contrast')
  onThemeChange?: (theme: ColorScheme) => void;  // Theme change callback
}
````

**Variants:**

- `'compact'` - Compact dropdown style, ideal for navigation bars (default)
- `'full'` - Expanded panel with all theme options and customization controls

**Common Usage:**

```svelte
<!-- In navigation bar -->
<ThemeSwitcher variant="compact" />

<!-- In settings page with all options -->
<ThemeSwitcher variant="full" showAdvanced={true} />
```

**Example with Controlled Value:**

```svelte
<script>
	let currentTheme = $state('dark');
</script>

<ThemeSwitcher
	variant="compact"
	value={currentTheme}
	onThemeChange={(theme) => (currentTheme = theme)}
/>
```

````

### Type
Content replacement

### Verification
```bash
# After change, verify:
grep -n "variant.*'compact' | 'full'" docs/api-reference.md
# Should show the updated line

# Verify no references to old variants remain:
grep -n "dropdown.*toggle.*button" docs/api-reference.md
# Should return no matches in ThemeSwitcher section
````

---

## CHANGE 2: Fix ThemeSwitcher Variants in component-inventory.md

### Location

`docs/component-inventory.md` lines 523-544

### Current Content (BEFORE)

````markdown
#### ThemeSwitcher

**Purpose:** UI control to toggle between themes.

**When to Use:**

- In navigation bars or settings menus
- allowing user to override system preference

**Key Props:**

- `variant`: 'dropdown' | 'toggle' | 'button'

**Quick Example:**

```svelte
<script>
	import { ThemeSwitcher } from '@equaltoai/greater-components/primitives';
</script>

<ThemeSwitcher variant="dropdown" />
```
````

**Reference:** See [api-reference.md#themeswitcher](./api-reference.md#themeswitcher) for complete API

````

### New Content (AFTER)
```markdown
#### ThemeSwitcher

**Purpose:** UI control to toggle between themes (light, dark, high-contrast).

**When to Use:**
- In navigation bars for quick theme switching (use `variant="compact"`)
- In settings pages for full theme customization (use `variant="full"`)
- Allowing users to override system preference

**When NOT to Use:**
- If app only supports one theme
- If theme controlled entirely by system preferences with no override

**Key Props:**
- `variant`: 'compact' | 'full' (default: 'compact')
  - `'compact'` - Dropdown style for navigation bars
  - `'full'` - Full panel with advanced color and preference controls
- `showPreview`: boolean - Show theme preview colors (default: true)
- `showAdvanced`: boolean - Show advanced customization options (default: false)

**Quick Example:**
```svelte
<script>
  import { ThemeSwitcher } from '@equaltoai/greater-components/primitives';
</script>

<!-- Most common: compact dropdown in navbar -->
<ThemeSwitcher variant="compact" />

<!-- For settings pages: full customization panel -->
<ThemeSwitcher variant="full" showAdvanced={true} />
````

**Reference:** See [api-reference.md#themeswitcher](./api-reference.md#themeswitcher) for complete API

````

### Type
Content replacement

### Verification
```bash
# Verify update:
grep -A 5 "variant.*'compact' | 'full'" docs/component-inventory.md

# Verify example updated:
grep "variant=\"compact\"" docs/component-inventory.md
# Should show the example
````

---

## CHANGE 3: Fix ThemeSwitcher in example-landing-page.md

### Location

`docs/example-landing-page.md` line 96

### Current Content (BEFORE)

```svelte
<ThemeSwitcher variant="button" />
```

### New Content (AFTER)

```svelte
<ThemeSwitcher variant="compact" />
```

### Type

Single line replacement

### Verification

```bash
# Verify change:
grep "ThemeSwitcher" docs/example-landing-page.md
# Should show variant="compact"
```

---

## CHANGE 4: Add CSS Import Requirement to getting-started.md

### Location

`docs/getting-started.md` - Add new section after line 83 (after Svelte configuration)

### Content to Insert (NEW SECTION)

````markdown
### Step 4: Import Theme Styles (REQUIRED)

**CRITICAL:** You must import the theme CSS in your root layout **before using any components**. Without this import, components will have no styling.

**For SvelteKit Projects:**

```typescript
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  // ✅ STEP 1: Import theme CSS FIRST (before any components)
  import '@equaltoai/greater-components/tokens/theme.css';

  // ✅ STEP 2: Import components after theme
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';

  let { children } = $props();
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- ✅ STEP 3: Wrap app in ThemeProvider -->
<ThemeProvider>
  {@render children()}
</ThemeProvider>
```
````

**For Vite/Svelte Projects:**

```typescript
<!-- src/App.svelte -->
<script lang="ts">
  // ✅ Import theme CSS FIRST
  import '@equaltoai/greater-components/tokens/theme.css';
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';

  // Your app imports here
</script>

<ThemeProvider>
  <!-- Your app content -->
</ThemeProvider>
```

**Why This is Required:**

The `theme.css` file provides all CSS custom properties that components depend on:

- Color tokens: `--gr-color-primary-*`, `--gr-color-gray-*`, etc.
- Typography tokens: `--gr-typography-fontSize-*`, `--gr-typography-fontWeight-*`
- Spacing tokens: `--gr-spacing-*`
- Shadow tokens: `--gr-shadow-*`

Without these tokens, components render but have no colors, fonts, or proper styling.

**Import Order Matters:**

```typescript
// ✅ CORRECT ORDER
import '@equaltoai/greater-components/tokens/theme.css'; // First
import { Button } from '@equaltoai/greater-components/primitives'; // Second

// ❌ WRONG ORDER - Components imported before theme
import { Button } from '@equaltoai/greater-components/primitives';
import '@equaltoai/greater-components/tokens/theme.css';
```

**Common Mistakes:**

```typescript
// ❌ WRONG - Forgot theme import entirely
import { Button, Card } from '@equaltoai/greater-components/primitives';
// Result: Unstyled components (no colors, default fonts)

// ❌ WRONG - Theme imported in child component instead of root
// src/routes/+page.svelte
import '@equaltoai/greater-components/tokens/theme.css'; // Too late!
// Should be in +layout.svelte

// ✅ CORRECT - Theme imported once at root
// src/routes/+layout.svelte
import '@equaltoai/greater-components/tokens/theme.css';
```

**Verification:**

After adding the import, check that styles are loaded:

```bash
# Start dev server
pnpm dev

# Open browser dev tools (F12)
# Go to Elements tab → Inspect <html> or <body>
# Look for CSS custom properties in Computed styles
# Should see: --gr-color-primary-500, --gr-typography-fontSize-base, etc.
```

If you see the custom properties, theme is loaded correctly. If not:

1. Verify import path is exact: `'@equaltoai/greater-components/tokens/theme.css'`
2. Check import is in root layout file
3. Clear build cache and restart dev server
4. Verify package version is 1.1.1 or higher

````

### Type
New section insertion

### Verification
```bash
# Verify section added:
grep -A 5 "Step 4: Import Theme Styles" docs/getting-started.md

# Verify import path is correct:
grep "tokens/theme.css" docs/getting-started.md
````

---

## CHANGE 5: Fix CSS Import Path in importing-components.md

### Location

`docs/importing-components.md` lines 65-72

### Current Content (BEFORE)

````markdown
## Styles

Import the CSS file in your root layout:

```typescript
import '@equaltoai/greater-components/primitives/styles.css';
```
````

````

### New Content (AFTER)
```markdown
## Styles

**REQUIRED:** Import theme CSS in your root layout file (import once at application root):

```typescript
// src/routes/+layout.svelte (SvelteKit) or src/App.svelte (Vite/Svelte)
import '@equaltoai/greater-components/tokens/theme.css';
````

**Where to Import:**

- **SvelteKit:** `src/routes/+layout.svelte` (root layout)
- **Vite/Svelte:** `src/App.svelte` (root component)
- **Any project:** The topmost component that wraps your entire application

**Import Order:**

```typescript
// ✅ CORRECT - Theme first, then components
import '@equaltoai/greater-components/tokens/theme.css';
import { ThemeProvider, Button } from '@equaltoai/greater-components/primitives';

// ❌ WRONG - Components before theme
import { Button } from '@equaltoai/greater-components/primitives';
import '@equaltoai/greater-components/tokens/theme.css';
```

**Why This is Required:**

- Provides all CSS custom properties (design tokens) that components use
- Must load before any components render
- Import once at root (don't import in multiple files)
- Without it, components have no styling (no colors, fonts, spacing)

**Troubleshooting:**

If components appear unstyled after importing:

1. Verify exact import path: `'@equaltoai/greater-components/tokens/theme.css'`
2. Check import is in your root layout/app file (not a child component)
3. Verify import comes before any component imports
4. Clear build cache: `rm -rf .svelte-kit` or `rm -rf node_modules/.vite`
5. Restart dev server

````

### Type
Content replacement

### Verification
```bash
# Verify correct path:
grep "tokens/theme.css" docs/importing-components.md
# Should show the corrected import

# Verify old path removed:
grep "primitives/styles.css" docs/importing-components.md
# Should return no matches
````

---

## CHANGE 6: Add Svelte 5 CSS Scoping Section to core-patterns.md

### Location

`docs/core-patterns.md` - Add new section after Theming section (find appropriate location)

### Content to Insert (NEW SECTION)

````markdown
## CSS Scoping with Svelte 5

### Understanding the Issue

Svelte 5's scoped CSS system cannot automatically detect when classes are applied to component instances. This causes "unused selector" warnings during compilation:

```svelte
<!-- This triggers: "Unused CSS selector .hero-title" -->
<Heading class="hero-title">Welcome to My App</Heading>

<style>
	.hero-title {
		font-size: 3rem;
		color: var(--gr-color-primary-600);
	}
	/* ⚠️ Svelte can't see this class is used on <Heading> component */
</style>
```
````

**Why This Happens:**

Svelte's scoping works by:

1. Adding unique class identifiers to elements it directly controls
2. Prefixing CSS selectors with those identifiers

When you apply a class to a component (like `<Heading class="hero-title">`), Svelte doesn't control that component's internal DOM structure, so it can't determine if the class is used.

### The Solution: :global()

Wrap classes applied to Greater Components (or any component) with `:global()`:

```svelte
<script>
	import { Heading, Text, Section, Button } from '@equaltoai/greater-components/primitives';
</script>

<Section class="hero-section">
	<Heading class="hero-title">Welcome to My App</Heading>
	<Text class="hero-subtitle">Build amazing things with Greater Components</Text>
	<Button class="cta-button">Get Started</Button>
</Section>

<style>
	/* ✅ CORRECT - Use :global() for component classes */
	:global(.hero-section) {
		padding-top: 4rem;
		background: linear-gradient(to bottom, var(--gr-color-gray-50), white);
	}

	:global(.hero-title) {
		font-size: 3rem;
		color: var(--gr-color-primary-600);
		margin-bottom: 1rem;
	}

	:global(.hero-subtitle) {
		max-width: 600px;
		margin: 0 auto 2rem;
		color: var(--gr-color-gray-600);
	}

	:global(.cta-button) {
		padding-left: 2rem;
		padding-right: 2rem;
	}
</style>
```

### When to Use :global()

**DO use :global() for:**

- ✅ Classes applied to Greater Components primitives
- ✅ Classes applied to your own custom components
- ✅ Utility classes you want available throughout your app
- ✅ Classes passed to third-party component libraries

**DON'T use :global() for:**

- ❌ Classes on regular HTML elements in your component
- ❌ Component-internal styles (should stay scoped)
- ❌ Styles that should only apply in this component

**Examples:**

```svelte
<script>
	import { Card, Heading } from '@equaltoai/greater-components/primitives';
</script>

<!-- Components - need :global() -->
<Card class="feature-card">
	<Heading class="feature-title">Feature</Heading>
</Card>

<!-- Regular HTML - no :global() needed -->
<div class="container">
	<p class="description">Text</p>
</div>

<style>
	/* Component classes - use :global() */
	:global(.feature-card) {
		padding: 2rem;
	}
	:global(.feature-title) {
		color: blue;
	}

	/* HTML element classes - no :global() */
	.container {
		max-width: 1200px;
	}
	.description {
		font-size: 1rem;
	}
</style>
```

### Alternative: :global Block

For many global classes, use a `:global` block to reduce repetition:

```svelte
<style>
	/* Global classes for components */
	:global {
		.hero-title {
			font-size: 3rem;
		}
		.hero-subtitle {
			max-width: 600px;
		}
		.hero-section {
			padding-top: 4rem;
		}
		.cta-button {
			padding: 1rem 2rem;
		}
	}

	/* Local scoped styles */
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
```

### Responsive Design with :global()

Media queries work the same way:

```svelte
<style>
	:global(.hero-title) {
		font-size: 3rem;
	}

	@media (max-width: 768px) {
		:global(.hero-title) {
			font-size: 2rem; /* Smaller on mobile */
		}
	}
</style>
```

### Common Pitfalls

**Pitfall 1: Forgetting :global() on Component Classes**

```svelte
<!-- ❌ This won't style the Button -->
<Button class="primary-cta">Sign Up</Button>

<style>
  .primary-cta {  /* Svelte: "unused selector" warning */
    background: var(--gr-color-primary-500);
  }
</style>

<!-- ✅ This works -->
<Button class="primary-cta">Sign Up</Button>

<style>
  :global(.primary-cta) {
    background: var(--gr-color-primary-500);
  }
</style>
```

**Pitfall 2: Using :global() on Everything**

```svelte
<!-- ❌ Over-using :global() breaks scoping -->
<div class="wrapper">
  <p class="text">Content</p>
</div>

<style>
  :global(.wrapper) { /* Unnecessary - could leak to other components */ }
  :global(.text) { /* Unnecessary - could leak to other components */ }
</style>

<!-- ✅ Use scoped CSS for your own HTML -->
<div class="wrapper">
  <p class="text">Content</p>
</div>

<style>
  .wrapper { /* Scoped to this component only */ }
  .text { /* Scoped to this component only */ }
</style>
```

**Pitfall 3: Mixing Scoped and Global Incorrectly**

```svelte
<Heading class="title">Hello</Heading>
<div class="container">World</div>

<style>
	/* ❌ Inconsistent - title needs :global() */
	.title {
		font-size: 2rem;
	} /* Won't work */
	.container {
		padding: 1rem;
	} /* Works */

	/* ✅ Consistent - proper scoping */
	:global(.title) {
		font-size: 2rem;
	} /* Works */
	.container {
		padding: 1rem;
	} /* Works */
</style>
```

### Best Practice Summary

1. **Component classes** → Always use `:global()`
2. **HTML element classes** → Don't use `:global()` (stay scoped)
3. **Utility classes** → Use `:global()` if shared across components
4. **Many global classes** → Use `:global { }` block
5. **Responsive styles** → `:global()` works in media queries

This scoping pattern ensures clean compilation with no warnings while maintaining proper CSS encapsulation.

````

### Type
New section insertion

### Verification
```bash
# Verify section added:
grep -A 10 "CSS Scoping with Svelte 5" docs/core-patterns.md

# Verify examples included:
grep ":global(" docs/core-patterns.md
````

---

## CHANGE 7: Add CSS Best Practices to development-guidelines.md

### Location

`docs/development-guidelines.md` - Add new section (find appropriate location for CSS section)

### Content to Insert (NEW SECTION)

````markdown
## CSS Best Practices

### Vendor Prefixes

Modern browsers increasingly support standard CSS properties, but some features still benefit from vendor prefixes for backwards compatibility. **Always include the standard property alongside vendor-prefixed versions.**

**Correct Pattern:**

```css
/* ✅ CORRECT - Standard property included after prefix */
.text-gradient {
	background: linear-gradient(to right, #667eea, #764ba2);
	-webkit-background-clip: text; /* Vendor prefix for Safari/older Chrome */
	background-clip: text; /* ← Standard property (required) */
	-webkit-text-fill-color: transparent;
	color: transparent; /* Fallback */
}

/* ✅ CORRECT - Transform with both versions */
.animated-card {
	-webkit-transform: translateY(-4px);
	transform: translateY(-4px);
}

/* ✅ CORRECT - Transition with both versions */
.smooth-transition {
	-webkit-transition: all 0.3s ease;
	transition: all 0.3s ease;
}
```
````

**Incorrect Pattern:**

```css
/* ❌ WRONG - Only vendor prefix, missing standard property */
.text-gradient {
	-webkit-background-clip: text; /* What about non-webkit browsers? */
}

/* ❌ WRONG - Standard property missing */
.animated {
	-webkit-transform: scale(1.1); /* Firefox, Edge won't apply this */
}
```

**Why This Matters:**

1. **Browser Compatibility:** Different browsers may need prefixed or standard versions
2. **Future-Proofing:** Standard properties ensure your styles work as browsers evolve
3. **Linting:** Tools like Stylelint will warn about missing standard properties
4. **Best Practice:** Industry standard is to include both prefix and standard

**Common Properties Requiring Prefixes:**

```css
/* Background Clip */
-webkit-background-clip: text;
background-clip: text;

/* Transform */
-webkit-transform: translateX(10px);
transform: translateX(10px);

/* Transition */
-webkit-transition: all 0.3s;
transition: all 0.3s;

/* User Select */
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;

/* Appearance */
-webkit-appearance: none;
-moz-appearance: none;
appearance: none;

/* Backdrop Filter */
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);
```

**Property Order:**

Always place vendor-prefixed properties **before** the standard property:

```css
/* ✅ CORRECT ORDER */
.element {
	-webkit-property: value; /* Vendor prefix first */
	-moz-property: value;
	property: value; /* Standard property last (takes precedence) */
}

/* ❌ WRONG ORDER */
.element {
	property: value; /* Standard first means prefix never used */
	-webkit-property: value; /* Too late - already set above */
}
```

**Reason:** Browsers read CSS top-to-bottom. If they understand the standard property, they use it (overriding the prefix). If they don't, they fall back to the prefixed version.

### Autoprefixer

For production projects, consider using [Autoprefixer](https://github.com/postcss/autoprefixer) to automatically add vendor prefixes:

```bash
pnpm add -D autoprefixer postcss
```

```javascript
// postcss.config.js
export default {
	plugins: {
		autoprefixer: {},
	},
};
```

With Autoprefixer, you write standard properties and it adds prefixes automatically based on your browser support targets.

### CSS Custom Properties (CSS Variables)

Greater Components extensively uses CSS custom properties. Follow these patterns:

**Defining Custom Properties:**

```css
/* ✅ Define in :root for global tokens */
:root {
	--gr-color-primary-500: #3b82f6;
	--gr-spacing-md: 1rem;
}

/* ✅ Define in component for local overrides */
.card {
	--card-padding: var(--gr-spacing-lg);
	--card-background: var(--gr-color-gray-50);
}
```

**Using Custom Properties:**

```css
/* ✅ Use with fallback values */
.element {
	color: var(--gr-color-primary-500, #3b82f6);
	padding: var(--card-padding, 1rem);
}

/* ✅ Compose custom properties */
.button {
	background: var(--button-bg, var(--gr-color-primary-500));
}
```

### Modern CSS Features

Greater Components supports modern CSS. Use these features confidently:

**CSS Grid:**

```css
.layout {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}
```

**Flexbox:**

```css
.flex-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
```

**Custom Properties:**

```css
.themed {
	color: var(--gr-color-primary-500);
	font-size: var(--gr-typography-fontSize-lg);
}
```

**Logical Properties:**

```css
/* ✅ Use logical properties for better i18n */
.element {
	margin-inline-start: 1rem; /* Respects text direction */
	padding-block: 2rem;
	border-inline-end: 1px solid gray;
}
```

### Performance Best Practices

**Avoid Expensive Properties:**

```css
/* ⚠️ EXPENSIVE - Triggers layout recalculation */
.slow {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}

/* ✅ BETTER - Uses compositor */
.fast {
	transform: translateX(100px);
	opacity: 0.5;
}
```

**Use `will-change` Sparingly:**

```css
/* ✅ GOOD - On elements that will definitely animate */
.animated-card:hover {
	will-change: transform;
}

/* ❌ BAD - On every element */
* {
	will-change: transform; /* Wastes memory */
}
```

**Contain Layout When Possible:**

```css
/* ✅ Isolate expensive layout work */
.card {
	contain: layout style paint;
}
```

````

### Type
New section insertion

### Verification
```bash
# Verify section added:
grep -A 5 "CSS Best Practices" docs/development-guidelines.md

# Verify vendor prefix guidance:
grep -A 3 "background-clip" docs/development-guidelines.md
````

---

## CHANGE 8: Create New quick-reference.md File

### Location

Create new file: `docs/quick-reference.md`

### Complete File Content (NEW FILE)

````markdown
# Greater Components Quick Reference

**For AI Agents and Rapid Development**

This document provides essential information in a format optimized for AI code generation and quick human reference.

---

## Essential Setup (3 Required Steps)

### Step 1: Install Package

```bash
pnpm add @equaltoai/greater-components
```
````

### Step 2: Configure TypeScript (tsconfig.json)

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"types": ["svelte", "vite/client"]
	}
}
```

### Step 3: Configure Svelte (svelte.config.js)

```javascript
const config = {
	compilerOptions: {
		runes: true, // Required for Svelte 5
	},
};
```

---

## CRITICAL: Theme CSS Import (Required for All Projects)

**This is the #1 most common mistake.** Components will be unstyled without this import.

### SvelteKit Projects

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// ✅ STEP 1: Import theme CSS FIRST (this line is REQUIRED)
	import '@equaltoai/greater-components/tokens/theme.css';

	// ✅ STEP 2: Import ThemeProvider after theme CSS
	import { ThemeProvider } from '@equaltoai/greater-components/primitives';

	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

### Vite/Svelte Projects

```svelte
<!-- src/App.svelte -->
<script lang="ts">
	// ✅ Import theme CSS FIRST
	import '@equaltoai/greater-components/tokens/theme.css';
	import { ThemeProvider } from '@equaltoai/greater-components/primitives';
</script>

<ThemeProvider>
	<!-- Your app content -->
</ThemeProvider>
```

**Without this import:** Components render but have no colors, fonts, or design tokens.

---

## Import Paths Reference

### Primitives (Styled Components)

```typescript
import {
	// Layout
	Container,
	Section,

	// Typography
	Heading,
	Text,

	// Interactive
	Button,
	Modal,

	// Display
	Card,

	// Theme
	ThemeProvider,
	ThemeSwitcher,
} from '@equaltoai/greater-components/primitives';
```

### Icons (300+ Feather Icons)

```typescript
import {
	MenuIcon,
	XIcon,
	ArrowRightIcon,
	CheckIcon,
	HomeIcon,
	SettingsIcon,
	UserIcon,
	SearchIcon,
} from '@equaltoai/greater-components/icons';
```

### Theme CSS (Required - Import Once at Root)

```typescript
import '@equaltoai/greater-components/tokens/theme.css';
```

---

## Component Props Quick Reference

### ThemeSwitcher

```typescript
variant?: 'compact' | 'full'  // DEFAULT: 'compact'
showPreview?: boolean         // DEFAULT: true
showAdvanced?: boolean        // DEFAULT: false
```

**Variants:**

- `'compact'` - Dropdown for navigation bars (most common)
- `'full'` - Full panel for settings pages

**Example:**

```svelte
<!-- Navigation bar usage (most common) -->
<ThemeSwitcher variant="compact" />

<!-- Settings page usage -->
<ThemeSwitcher variant="full" showAdvanced={true} />
```

### Button

```typescript
variant?: 'solid' | 'outline' | 'ghost' | 'danger'  // DEFAULT: 'solid'
size?: 'sm' | 'md' | 'lg'                           // DEFAULT: 'md'
disabled?: boolean                                   // DEFAULT: false
loading?: boolean                                    // DEFAULT: false
```

**Example:**

```svelte
<Button variant="solid" size="lg">
	Get Started
	{#snippet suffix()}<ArrowRightIcon />{/snippet}
</Button>
```

### Container

```typescript
maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'  // DEFAULT: 'xl'
centered?: boolean                                      // DEFAULT: false
padding?: 'none' | 'sm' | 'md' | 'lg'                  // DEFAULT: 'md'
```

**Example:**

```svelte
<Container maxWidth="lg" centered>
	<Heading>Content</Heading>
</Container>
```

### Section

```typescript
spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'  // DEFAULT: 'md'
background?: string                           // DEFAULT: undefined
```

**Example:**

```svelte
<Section spacing="xl">
	<Container>
		<!-- Content -->
	</Container>
</Section>
```

### Card

```typescript
variant?: 'elevated' | 'outlined' | 'filled'  // DEFAULT: 'elevated'
padding?: 'none' | 'sm' | 'md' | 'lg'        // DEFAULT: 'md'
clickable?: boolean                          // DEFAULT: false
hoverable?: boolean                          // DEFAULT: false
```

**Example:**

```svelte
<Card variant="elevated" padding="lg" hoverable>
	{#snippet header()}
		<Heading level={3}>Card Title</Heading>
	{/snippet}

	<Text>Card content goes here</Text>

	{#snippet footer()}
		<Button>Action</Button>
	{/snippet}
</Card>
```

### Heading

```typescript
level: 1 | 2 | 3 | 4 | 5 | 6                                   // REQUIRED
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
align?: 'left' | 'center' | 'right'
color?: 'primary' | 'secondary' | 'muted'
```

**Example:**

```svelte
<Heading level={1} size="4xl" align="center">Welcome to My App</Heading>
```

### Text

```typescript
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'      // DEFAULT: 'md'
weight?: 'normal' | 'medium' | 'semibold' | 'bold'  // DEFAULT: 'normal'
align?: 'left' | 'center' | 'right' | 'justify'     // DEFAULT: 'left'
color?: 'primary' | 'secondary' | 'muted' | 'error'
```

**Example:**

```svelte
<Text size="lg" color="secondary" align="center">Subtitle text here</Text>
```

### Modal

```typescript
open: boolean                  // REQUIRED (bind this)
title?: string
size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

**Example:**

```svelte
<script>
	let modalOpen = $state(false);
</script>

<Button onclick={() => (modalOpen = true)}>Open Modal</Button>

<Modal bind:open={modalOpen} title="Modal Title" size="lg">
	<p>Modal content here</p>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
		<Button variant="solid">Confirm</Button>
	{/snippet}
</Modal>
```

---

## CSS Scoping Rules (Svelte 5)

### For Greater Components → Use :global()

```svelte
<Heading class="hero-title">Welcome</Heading>
<Text class="hero-subtitle">Subtitle</Text>
<Section class="hero-section">Content</Section>

<style>
	/* ✅ Use :global() for component classes */
	:global(.hero-title) {
		font-size: 3rem;
		color: var(--gr-color-primary-600);
	}

	:global(.hero-subtitle) {
		max-width: 600px;
		margin: 1.5rem auto;
	}

	:global(.hero-section) {
		padding-top: 4rem;
	}
</style>
```

### For Regular HTML → No :global() Needed

```svelte
<div class="container">
	<p class="description">Regular HTML</p>
</div>

<style>
	/* ✅ No :global() for your HTML elements */
	.container {
		max-width: 1200px;
	}

	.description {
		font-size: 1rem;
	}
</style>
```

### Alternative: :global Block

```svelte
<style>
	:global {
		.hero-title {
			font-size: 3rem;
		}
		.hero-subtitle {
			max-width: 600px;
		}
	}

	.local-class {
		padding: 1rem;
	}
</style>
```

---

## Common Patterns

### Navigation Bar with ThemeSwitcher

```svelte
<script>
	import { Container, Button, ThemeSwitcher } from '@equaltoai/greater-components/primitives';
	import { MenuIcon, XIcon } from '@equaltoai/greater-components/icons';

	let mobileMenuOpen = $state(false);
</script>

<header class="header">
	<Container maxWidth="xl">
		<div class="nav-content">
			<div class="logo">Logo</div>

			<!-- Desktop Nav -->
			<nav class="desktop-nav">
				<a href="#features">Features</a>
				<a href="#pricing">Pricing</a>
				<ThemeSwitcher variant="compact" />
				<Button variant="ghost">Log In</Button>
				<Button variant="solid">Sign Up</Button>
			</nav>

			<!-- Mobile Toggle -->
			<button class="mobile-toggle" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
				{#if mobileMenuOpen}<XIcon />{:else}<MenuIcon />{/if}
			</button>
		</div>
	</Container>
</header>

<style>
	.header {
		background: var(--gr-color-primary-600);
		padding: 1rem 0;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}
	}
</style>
```

### Hero Section

```svelte
<script>
	import {
		Section,
		Container,
		Heading,
		Text,
		Button,
	} from '@equaltoai/greater-components/primitives';
	import { ArrowRightIcon } from '@equaltoai/greater-components/icons';
</script>

<Section spacing="xl" class="hero-section">
	<Container maxWidth="lg" centered>
		<Heading level={1} size="5xl" align="center" class="hero-title">
			Build faster with <span class="text-gradient">Greater Components</span>
		</Heading>

		<Text size="xl" color="secondary" align="center" class="hero-subtitle">
			The ultimate UI kit for building modern web applications. Accessible, themable, and
			production-ready.
		</Text>

		<div class="hero-actions">
			<Button variant="solid" size="lg">
				Get Started
				{#snippet suffix()}<ArrowRightIcon />{/snippet}
			</Button>
			<Button variant="outline" size="lg">View Docs</Button>
		</div>
	</Container>
</Section>

<style>
	:global(.hero-section) {
		padding-top: 4rem;
	}

	.text-gradient {
		background: linear-gradient(to right, var(--gr-color-primary-600), var(--gr-color-primary-400));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}

	:global(.hero-subtitle) {
		max-width: 600px;
		margin: 1.5rem auto 2.5rem;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
</style>
```

### Feature Cards Grid

```svelte
<script>
	import {
		Section,
		Container,
		Heading,
		Card,
		Text,
	} from '@equaltoai/greater-components/primitives';
	import { CodeIcon, ZapIcon, ShieldIcon } from '@equaltoai/greater-components/icons';

	const features = [
		{ icon: CodeIcon, title: 'Developer First', description: 'Built with DX in mind' },
		{ icon: ZapIcon, title: 'Lightning Fast', description: 'Optimized performance' },
		{ icon: ShieldIcon, title: 'Type Safe', description: 'Full TypeScript support' },
	];
</script>

<Section id="features" spacing="xl">
	<Container maxWidth="lg">
		<Heading level={2} size="3xl" align="center">Features</Heading>

		<div class="features-grid">
			{#each features as feature}
				<Card variant="elevated" padding="lg" hoverable>
					{#snippet header()}
						<div class="feature-icon">
							<svelte:component this={feature.icon} size={32} />
						</div>
						<Heading level={3} size="xl">{feature.title}</Heading>
					{/snippet}

					<Text color="secondary">{feature.description}</Text>
				</Card>
			{/each}
		</div>
	</Container>
</Section>

<style>
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.feature-icon {
		color: var(--gr-color-primary-500);
		margin-bottom: 1rem;
	}
</style>
```

---

## Common Errors & Solutions

### Error: "Components not styled"

**Cause:** Missing theme CSS import

**Solution:**

```svelte
<!-- Add to root layout FIRST -->
<script>
	import '@equaltoai/greater-components/tokens/theme.css'; // ← Add this
	import { ThemeProvider } from '@equaltoai/greater-components/primitives';
</script>
```

### Error: Type '"button"' is not assignable to type '"compact" | "full"'

**Cause:** Using wrong ThemeSwitcher variant

**Solution:**

```svelte
<!-- ❌ WRONG -->
<ThemeSwitcher variant="button" />

<!-- ✅ CORRECT -->
<ThemeSwitcher variant="compact" />
```

### Warning: "Unused CSS selector .hero-title"

**Cause:** Missing :global() wrapper on component class

**Solution:**

```svelte
<!-- ❌ WRONG -->
<Heading class="hero-title">Text</Heading>
<style>
  .hero-title { /* ... */ }
</style>

<!-- ✅ CORRECT -->
<Heading class="hero-title">Text</Heading>
<style>
  :global(.hero-title) { /* ... */ }
</style>
```

### Warning: "Missing standard 'background-clip' property"

**Cause:** Only vendor prefix used, missing standard property

**Solution:**

```css
/* ❌ WRONG */
.text-gradient {
	-webkit-background-clip: text;
}

/* ✅ CORRECT */
.text-gradient {
	-webkit-background-clip: text;
	background-clip: text; /* ← Add standard property */
}
```

---

## Design Token Reference

### Colors

```css
/* Primary */
--gr-color-primary-50 through --gr-color-primary-950

/* Gray */
--gr-color-gray-50 through --gr-color-gray-950

/* Success, Warning, Error */
--gr-color-success-500
--gr-color-warning-500
--gr-color-error-500
```

### Typography

```css
/* Font Sizes */
--gr-typography-fontSize-xs  /* 0.75rem */
--gr-typography-fontSize-sm  /* 0.875rem */
--gr-typography-fontSize-md  /* 1rem */
--gr-typography-fontSize-lg  /* 1.125rem */
--gr-typography-fontSize-xl  /* 1.25rem */

/* Font Weights */
--gr-typography-fontWeight-normal   /* 400 */
--gr-typography-fontWeight-medium   /* 500 */
--gr-typography-fontWeight-semibold /* 600 */
--gr-typography-fontWeight-bold     /* 700 */
```

### Spacing

```css
--gr-spacing-xs  /* 0.25rem */
--gr-spacing-sm  /* 0.5rem */
--gr-spacing-md  /* 1rem */
--gr-spacing-lg  /* 1.5rem */
--gr-spacing-xl  /* 2rem */
```

---

## Verification Checklist

After setup, verify:

- [ ] `pnpm dev` runs without errors
- [ ] Theme CSS import in root layout
- [ ] Components render with colors and fonts
- [ ] ThemeSwitcher present and functional
- [ ] `pnpm check` passes (0 TypeScript errors)
- [ ] No Svelte warnings about unused selectors
- [ ] Theme switching works (light/dark modes)

---

## Additional Resources

- **Full Documentation:** [getting-started.md](./getting-started.md)
- **Component Inventory:** [component-inventory.md](./component-inventory.md)
- **API Reference:** [api-reference.md](./api-reference.md)
- **Patterns:** [core-patterns.md](./core-patterns.md)
- **Troubleshooting:** [troubleshooting.md](./troubleshooting.md)

````

### Type
New file creation

### Verification
```bash
# Verify file created:
ls -la docs/quick-reference.md

# Verify content structure:
grep "## Essential Setup" docs/quick-reference.md
grep "## CRITICAL: Theme CSS Import" docs/quick-reference.md
grep "## Component Props Quick Reference" docs/quick-reference.md
````

---

## Implementation Order

Execute changes in this sequence:

### Phase 1: Critical Fixes (Priority 1 - Do First)

1. ✅ CHANGE 1: Fix ThemeSwitcher variants in api-reference.md
2. ✅ CHANGE 2: Fix ThemeSwitcher variants in component-inventory.md
3. ✅ CHANGE 3: Fix ThemeSwitcher in example-landing-page.md

### Phase 2: Essential Documentation (Priority 2 - Do Second)

4. ✅ CHANGE 4: Add CSS import requirement to getting-started.md
5. ✅ CHANGE 5: Fix CSS import path in importing-components.md

### Phase 3: Educational Content (Priority 3 - Do Third)

6. ✅ CHANGE 6: Add Svelte 5 CSS scoping to core-patterns.md
7. ✅ CHANGE 7: Add CSS best practices to development-guidelines.md

### Phase 4: Quick Reference (Priority 4 - Do Last)

8. ✅ CHANGE 8: Create new quick-reference.md file

---

## Post-Implementation Verification

After all changes are complete, run these verification steps:

### 1. Grep Verification

```bash
# Verify no old ThemeSwitcher variants remain
grep -rn "variant.*button.*toggle.*dropdown" docs/
# Should return NO matches

# Verify correct variants present
grep -rn "variant.*compact.*full" docs/api-reference.md docs/component-inventory.md
# Should show updated lines

# Verify CSS import path correct
grep -rn "tokens/theme.css" docs/
# Should show multiple matches

# Verify old CSS path removed
grep -rn "primitives/styles.css" docs/
# Should return NO matches

# Verify :global() guidance added
grep -rn ":global(" docs/core-patterns.md
# Should show examples
```

### 2. File Completeness Check

```bash
# Verify all 8 changes applied
echo "Checking file modifications..."

# Modified files (should exist and be recently updated)
ls -l docs/api-reference.md
ls -l docs/component-inventory.md
ls -l docs/example-landing-page.md
ls -l docs/getting-started.md
ls -l docs/importing-components.md
ls -l docs/core-patterns.md
ls -l docs/development-guidelines.md

# New file (should exist)
ls -l docs/quick-reference.md
```

### 3. Content Validation

```bash
# Verify Step 4 added to getting-started.md
grep -A 5 "Step 4: Import Theme Styles" docs/getting-started.md

# Verify CSS Scoping section added to core-patterns.md
grep -A 5 "CSS Scoping with Svelte 5" docs/core-patterns.md

# Verify CSS Best Practices added to development-guidelines.md
grep -A 5 "CSS Best Practices" docs/development-guidelines.md

# Verify quick-reference.md is complete
wc -l docs/quick-reference.md
# Should show ~700+ lines
```

### 4. Cross-Reference Validation

```bash
# All ThemeSwitcher references should use correct variants
grep -n "ThemeSwitcher" docs/*.md | grep -v "compact\|full"
# Should only show mentions without variant prop
```

### 5. Test with PAI

After documentation updates, test PAI code generation:

```bash
# Update PAI knowledge base with new documentation
# (Process depends on your KB update workflow)

# Run test generation
# PAI should now:
# 1. Include theme CSS import
# 2. Use correct ThemeSwitcher variants
# 3. Use :global() for component classes
# 4. Include standard CSS properties with vendor prefixes
```

---

## Review Checklist

When reviewing the implementation, verify:

### Content Accuracy

- [ ] All ThemeSwitcher variant references updated to 'compact' | 'full'
- [ ] Theme CSS import path is `@equaltoai/greater-components/tokens/theme.css`
- [ ] No references to old paths remain (`primitives/styles.css`)
- [ ] :global() usage clearly explained with examples
- [ ] Vendor prefix best practices documented with examples

### Completeness

- [ ] All 8 changes implemented
- [ ] No changes to non-specified sections
- [ ] Code examples are syntactically correct
- [ ] All examples use correct import paths

### Consistency

- [ ] Terminology consistent across all documents
- [ ] Code examples follow same formatting style
- [ ] All Svelte 5 syntax (runes, snippets) used correctly

### Quality

- [ ] No typos or grammatical errors
- [ ] Code blocks properly formatted with language tags
- [ ] Examples are practical and realistic
- [ ] Explanations are clear and concise

---

## Expected Impact

After these changes are implemented and PAI's knowledge base is updated:

### Code Generation Improvements

- ✅ PAI will include theme CSS import in root layouts
- ✅ PAI will use correct ThemeSwitcher variants
- ✅ PAI will wrap component classes with :global()
- ✅ PAI will include standard CSS properties with vendor prefixes

### Error Reduction

- **Before:** 1 TypeScript error, 6 Svelte warnings
- **After:** 0 TypeScript errors, 0 Svelte warnings (expected)

### Development Time Savings

- **Before:** 35 minutes of human fixes required
- **After:** < 10 minutes of minor adjustments (expected)

### PAI Accuracy

- **Before:** 8 hallucinations/errors in initial generation
- **After:** 0-2 minor issues (expected)

---

## Notes for Implementation Agent

### General Guidelines

1. **Exact Replacements:** Use the BEFORE/AFTER content exactly as specified
2. **Preserve Formatting:** Maintain existing indentation and line breaks
3. **No Extra Changes:** Only modify what's specified in this document
4. **Verify Each Step:** Check your work after each change
5. **Ask If Unclear:** If any instruction is ambiguous, ask for clarification

### File Handling

- **Existing Files:** Edit in place, preserve file structure
- **New Files:** Create with exact content specified
- **Line Numbers:** Line numbers are approximate guides (file may have changed)
- **Search BEFORE Content:** Use BEFORE content to locate exact replacement point

### Common Pitfalls to Avoid

- ❌ Don't add extra sections beyond what's specified
- ❌ Don't "improve" code examples beyond the specification
- ❌ Don't change unrelated parts of documents
- ❌ Don't modify code formatting style
- ✅ Do exactly what's specified, nothing more, nothing less

---

## Success Metrics

Implementation is complete when:

1. All 8 changes applied exactly as specified
2. All verification commands pass
3. No grep searches return incorrect patterns
4. All files syntactically correct (no broken markdown/code blocks)
5. Review checklist items all pass

**Estimated Implementation Time:** 1-2 hours for careful, verified implementation

---

## Questions for Reviewer

After implementation, the reviewer should verify:

1. Are all ThemeSwitcher variants corrected?
2. Is the CSS import requirement clearly documented?
3. Is the :global() scoping pattern well explained?
4. Are the code examples correct and working?
5. Is quick-reference.md comprehensive and accurate?
6. Would these docs prevent the original PAI errors?

---

**Document Version:** 1.0  
**Created:** 2025-11-20  
**Purpose:** Guide implementation agent through documentation fixes  
**Review Required:** Yes - by original analysis author
