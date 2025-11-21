# Greater Components Quick Reference

**For AI Agents and Rapid Development**

This document provides essential information in a format optimized for AI code generation and quick human reference.

---

## Essential Setup (3 Required Steps)

### Step 1: Install Package

```bash
pnpm add @equaltoai/greater-components
```

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
