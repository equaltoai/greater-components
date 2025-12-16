# Greater Components Core Patterns

Canonical usage patterns with examples for common scenarios.

## Table of Contents

- [Layout Patterns](#layout-patterns)
- [Styled Components Pattern](#styled-components-pattern)
- [Headless Components Pattern](#headless-components-pattern)
- [Theming and Customization](#theming-and-customization)
- [Lesser Integration](#lesser-integration)
- [Timeline Management](#timeline-management)
- [Error Handling](#error-handling)
- [State Management with Runes](#state-management-with-runes)
- [Accessibility Patterns](#accessibility-patterns)
- [Performance Optimization](#performance-optimization)
- [Responsive Design](#responsive-design)
- [Non-Fediverse Application Patterns](#non-fediverse-application-patterns)

---

## Layout Patterns

### Centered Page Layout

✅ **CORRECT: Use Container to constrain content width**

```svelte
<script>
	import { Container, Card, Section } from '@equaltoai/greater-components/primitives';
</script>

<div class="page-wrapper">
	<header>
		<Container maxWidth="xl">
			<nav>Navigation</nav>
		</Container>
	</header>

	<main>
		<Section spacing="md">
			<Container maxWidth="lg" padding="md">
				<h1>Dashboard</h1>
				<Card>
					<p>Main content area constrained to large breakpoint.</p>
				</Card>
			</Container>
		</Section>

		<Section spacing="lg" class="bg-gray-50">
			<Container maxWidth="md">
				<h2>Secondary Section</h2>
				<p>Narrower content block.</p>
			</Container>
		</Section>
	</main>
</div>
```

### Landing Page / Marketing Site Pattern

✅ **CORRECT: Compose primitives for marketing layouts**

```svelte
<script>
	import {
		Container,
		Section,
		Heading,
		Text,
		Button,
		Card,
	} from '@equaltoai/greater-components/primitives';
</script>

<!-- Hero Section -->
<Section spacing="xl" centered class="bg-gradient-to-b from-primary-50 to-white">
	<Container maxWidth="lg">
		<Heading level={1} size="5xl" align="center" class="mb-4">Build Better Fediverse Apps</Heading>
		<Text size="xl" align="center" color="secondary" class="mb-8 max-w-2xl mx-auto">
			Production-ready primitives, headless components, and protocol adapters for the next
			generation of social web applications.
		</Text>
		<div class="flex gap-4 justify-center">
			<Button size="lg">Get Started</Button>
			<Button size="lg" variant="outline">View Documentation</Button>
		</div>
	</Container>
</Section>

<!-- Features Grid -->
<Section spacing="lg">
	<Container maxWidth="xl">
		<Heading level={2} align="center" class="mb-12">Why Greater Components?</Heading>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<Heading level={3} size="xl">Accessible</Heading>
				{/snippet}
				<Text>
					WCAG 2.1 AA compliant out of the box. Keyboard navigation and screen reader support
					built-in.
				</Text>
			</Card>

			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<Heading level={3} size="xl">Themable</Heading>
				{/snippet}
				<Text>
					Powered by CSS custom properties for instant runtime theming. Includes light, dark, and
					high-contrast modes.
				</Text>
			</Card>

			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<Heading level={3} size="xl">Type-Safe</Heading>
				{/snippet}
				<Text>
					Written in TypeScript with Svelte 5 runes. Full type definitions for all props and events.
				</Text>
			</Card>
		</div>
	</Container>
</Section>
```

---

## Styled Components Pattern

### Basic Usage

✅ **CORRECT: Import and use styled components directly**

```svelte
<script>
	// CORRECT: Styled components work immediately with consistent styling
	import { Button, Modal, TextField } from '@equaltoai/greater-components/primitives';
	import { SaveIcon } from '@equaltoai/greater-components/icons';

	let formData = $state({ name: '', email: '' });
	let showModal = $state(false);
	let saving = $state(false);

	async function handleSave() {
		saving = true;
		await saveToServer(formData);
		saving = false;
		showModal = false;
	}
</script>

<Button variant="solid" onclick={() => (showModal = true)}>Create New</Button>

<Modal bind:open={showModal} title="Create Item" size="md">
	<TextField bind:value={formData.name} label="Name" required />
	<TextField bind:value={formData.email} type="email" label="Email" required />

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (showModal = false)}>Cancel</Button>
		<Button variant="solid" loading={saving} onclick={handleSave}>
			{#snippet prefix()}
				<SaveIcon />
			{/snippet}
			Save
		</Button>
	{/snippet}
</Modal>
```

**Why this works:**

- Components styled and accessible out of the box
- Consistent theming across application
- No CSS required for basic usage
- Focus management handled automatically

### Component Composition with Snippets

✅ **CORRECT: Use Svelte 5 snippets for flexible composition**

```svelte
<script>
	import { Card, Button } from '@equaltoai/greater-components/primitives';
	import { EditIcon, DeleteIcon } from '@equaltoai/greater-components/icons';
</script>

<Card variant="elevated" padding="lg">
	{#snippet header()}
		<div class="card-header">
			<h2>User Profile</h2>
			<span class="badge">Pro</span>
		</div>
	{/snippet}

	<div class="card-content">
		<p><strong>Name:</strong> John Doe</p>
		<p><strong>Email:</strong> john@example.com</p>
		<p><strong>Role:</strong> Administrator</p>
	</div>

	{#snippet footer()}
		<div class="actions">
			<Button variant="outline" size="sm">
				{#snippet prefix()}<EditIcon />{/snippet}
				Edit
			</Button>
			<Button variant="danger" size="sm">
				{#snippet prefix()}<DeleteIcon />{/snippet}
				Delete
			</Button>
		</div>
	{/snippet}
</Card>
```

### Interactive Card Pattern

✅ **CORRECT: Use clickable cards for navigation or actions**

```svelte
<script>
	import { Card } from '@equaltoai/greater-components/primitives';
	import { goto } from '$app/navigation';
</script>

<Card
	variant="outlined"
	clickable
	hoverable
	onclick={() => goto('/projects/123')}
	aria-label="View Project 123"
>
	<h3>Project Alpha</h3>
	<p>Last updated: 2 hours ago</p>
</Card>
```

---

## Headless Components Pattern

### Maximum Styling Control

✅ **CORRECT: Use headless components for complete custom styling**

```svelte
<script>
	// CORRECT: Headless provides behavior, you provide styling
	import { createButton, createModal } from '@equaltoai/greater-components/headless';

	let isOpen = $state(false);

	const openButton = createButton({
		onClick: () => (isOpen = true),
	});

	const modal = createModal({
		open: isOpen,
		closeOnEscape: true,
		onClose: () => (isOpen = false),
	});
</script>

<!-- Apply your design system styles -->
<button use:openButton.actions.button class="brand-button"> Open Settings </button>

{#if modal.state.open}
	<div use:modal.actions.overlay class="modal-overlay">
		<div use:modal.actions.content class="modal-content">
			<h2>Settings</h2>
			<p>Your custom modal content</p>
			<button use:modal.actions.close class="close-button"> Close </button>
		</div>
	</div>
{/if}

<style>
	.brand-button {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.brand-button:hover {
		transform: translateY(-2px);
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 16px;
		max-width: 500px;
		width: 90%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}
</style>
```

**Why this works:**

- Complete control over appearance
- Maintains accessibility automatically
- Keyboard navigation handled
- Focus management built-in

### Headless with Existing Design System

✅ **CORRECT: Integrate headless components with your design system**

```svelte
<script>
	import { createButton } from '@equaltoai/greater-components/headless/button';
	import { yourDesignSystem } from '$lib/design-system';

	const button = createButton({
		loading: false,
		onClick: handleAction,
	});
</script>

<!-- Use your design system classes -->
<button
	use:button.actions.button
	class={yourDesignSystem.button({ variant: 'primary', size: 'large' })}
>
	{#if button.state.loading}
		<span class={yourDesignSystem.spinner()}>Loading...</span>
	{:else}
		Click Me
	{/if}
</button>
```

---

## Theming and Customization

### Override Design Tokens

✅ **CORRECT: Customize appearance via CSS custom properties**

```svelte
<script>
	import { ThemeProvider, Button, Modal } from '@equaltoai/greater-components/primitives';
</script>

<ThemeProvider>
	<YourApp />
</ThemeProvider>

<style>
	:global(:root) {
		/* Brand Colors */
		--gr-color-primary-50: #f5f3ff;
		--gr-color-primary-100: #ede9fe;
		--gr-color-primary-200: #ddd6fe;
		--gr-color-primary-300: #c4b5fd;
		--gr-color-primary-400: #a78bfa;
		--gr-color-primary-500: #8b5cf6;
		--gr-color-primary-600: #7c3aed;
		--gr-color-primary-700: #6d28d9;
		--gr-color-primary-800: #5b21b6;
		--gr-color-primary-900: #4c1d95;

		/* Typography */
		--gr-typography-fontFamily-sans: 'Inter', -apple-system, sans-serif;
		--gr-typography-fontSize-base: 16px;

		/* Spacing */
		--gr-spacing-unit: 0.25rem;

		/* Border Radius */
		--gr-radii-sm: 6px;
		--gr-radii-md: 8px;
		--gr-radii-lg: 12px;

		/* Shadows */
		--gr-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
		--gr-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
		--gr-shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);
	}

	/* Dark theme overrides */
	:global([data-theme='dark']) {
		--gr-color-gray-50: #1a1a1a;
		--gr-color-gray-100: #2d2d2d;
		--gr-color-gray-900: #f5f5f5;
	}
</style>
```

### Runtime Theme Switching

✅ **CORRECT: Implement theme switching with ThemeProvider**

```svelte
<script>
	import { ThemeProvider, ThemeSwitcher, Button } from '@equaltoai/greater-components/primitives';
	import { SunIcon, MoonIcon } from '@equaltoai/greater-components/icons';

	let theme = $state('light');

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}
</script>

<ThemeProvider {theme}>
	<nav>
		<Button variant="ghost" onclick={toggleTheme}>
			{#snippet prefix()}
				{#if theme === 'light'}
					<MoonIcon />
				{:else}
					<SunIcon />
				{/if}
			{/snippet}
			{theme === 'light' ? 'Dark' : 'Light'} Mode
		</Button>

		<!-- Or use built-in switcher -->
		<ThemeSwitcher variant="dropdown" />
	</nav>

	<YourApp />
</ThemeProvider>
```

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

---

## Lesser Integration

### Complete Lesser Setup

✅ **CORRECT: Lesser GraphQL timeline with built-in virtualization**

```svelte
<script>
	import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
	import { TimelineVirtualizedReactive } from '@equaltoai/greater-components/faces/social';

	// Initialize Lesser adapter with GraphQL
	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
		token: import.meta.env.VITE_LESSER_TOKEN,
		// Optional: enables GraphQL subscriptions (real-time updates) when supported by your instance
		wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT,
	});

	const view = { type: 'home' };
</script>

<TimelineVirtualizedReactive {adapter} {view} estimateSize={320} />
```

**Environment variables (`.env`):**

```bash
VITE_LESSER_ENDPOINT=https://your-instance.social/graphql
VITE_LESSER_TOKEN=your-auth-token
VITE_LESSER_WS_ENDPOINT=wss://your-instance.social/graphql
```

---

## Timeline Management

### Virtual Scrolling for Performance

✅ **CORRECT: Use TimelineVirtualizedReactive for large timelines**

```svelte
<script>
	import { TimelineVirtualizedReactive } from '@equaltoai/greater-components/faces/social';
</script>

<TimelineVirtualizedReactive {items} estimateSize={320} overscan={8} />
```

**Performance benefits:**

- Only renders visible items
- Handles 10,000+ items smoothly
- Reduces memory usage
- Smooth scrolling

---

## Error Handling

### Graceful Error Handling

✅ **CORRECT: Handle errors with user-friendly messages**

```svelte
<script>
	import { LesserGraphQLAdapter, createTimelineStore } from '@equaltoai/greater-components/adapters';
	import { Button } from '@equaltoai/greater-components/primitives';

	let errorMessage = $state('');
	let errorType = $state<'auth' | 'network' | 'rate-limit' | 'unknown'>('unknown');

	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
		wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT,
		token: import.meta.env.VITE_LESSER_TOKEN,
	});

	const timeline = createTimelineStore({
		adapter,
		timeline: { type: 'home' },
	});

	$effect(() => {
		const unsubscribe = timeline.subscribe((state) => {
			if (!state.error) return;

			console.error('Timeline error:', state.error);

			const message = state.error.message;
			if (message.includes('401') || message.includes('403')) {
				errorType = 'auth';
				errorMessage = 'Authentication failed. Please log in again.';
			} else if (message.includes('rate limit')) {
				errorType = 'rate-limit';
				errorMessage = 'Too many requests. Please wait a moment and try again.';
			} else if (message.includes('network') || message.includes('fetch')) {
				errorType = 'network';
				errorMessage = 'Network error. Check your connection and try again.';
			} else {
				errorType = 'unknown';
				errorMessage = 'Something went wrong. Please try again.';
			}
		});

		void timeline.refresh();

		return unsubscribe;
	});

	async function handleRetry() {
		errorMessage = '';
		await timeline.refresh();
	}

	function handleReauth() {
		// Redirect to login
		window.location.href = '/login';
	}
</script>

{#if errorMessage}
	<div class="error-banner" class:auth={errorType === 'auth'}>
		<p>{errorMessage}</p>

		{#if errorType === 'auth'}
			<Button onclick={handleReauth}>Log In</Button>
		{:else}
			<Button onclick={handleRetry}>Retry</Button>
		{/if}
	</div>
{/if}

<style>
	.error-banner {
		padding: 1rem;
		background: var(--gr-color-danger-50);
		border: 1px solid var(--gr-color-danger-200);
		border-radius: var(--gr-radii-md);
		margin-bottom: 1rem;
	}

	.error-banner.auth {
		background: var(--gr-color-warning-50);
		border-color: var(--gr-color-warning-200);
	}
</style>
```

---

## State Management with Runes

### Svelte 5 Runes Pattern

✅ **CORRECT: Use Svelte 5 runes for reactive state**

```svelte
<script>
	import { Button, TextField } from '@equaltoai/greater-components/primitives';

	// Reactive state
	let count = $state(0);
	let name = $state('');

	// Derived values
	let doubled = $derived(count * 2);
	let greeting = $derived(`Hello, ${name || 'stranger'}!`);

	// Side effects
	$effect(() => {
		console.log(`Count changed to ${count}`);
		document.title = `Count: ${count}`;
	});

	// Cleanup in effects
	$effect(() => {
		const interval = setInterval(() => {
			console.log('Tick');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<TextField bind:value={name} label="Your Name" />
<p>{greeting}</p>

<Button onclick={() => count++}>
	Count: {count} (Doubled: {doubled})
</Button>
```

---

## Accessibility Patterns

### Keyboard Navigation

✅ **CORRECT: Components include keyboard support automatically**

```svelte
<script>
	import { Menu, Button } from '@equaltoai/greater-components/primitives';

	let items = [
		{ label: 'Edit', action: () => console.log('edit') },
		{ label: 'Share', action: () => console.log('share') },
		{ label: 'Delete', action: () => console.log('delete') },
	];
</script>

<!-- Keyboard support built-in:
     - Tab to focus
     - Enter/Space to open
     - Arrow keys to navigate
     - Enter to select
     - Escape to close
-->
<Menu.Root>
	<Menu.Trigger>Actions</Menu.Trigger>
	<Menu.Items>
		{#each items as item}
			<Menu.Item onclick={item.action}>
				{item.label}
			</Menu.Item>
		{/each}
	</Menu.Items>
</Menu.Root>
```

### Screen Reader Support

✅ **CORRECT: Use proper ARIA labels**

```svelte
<script>
	import { Button } from '@equaltoai/greater-components/primitives';
	import { CloseIcon } from '@equaltoai/greater-components/icons';
</script>

<Button variant="ghost" aria-label="Close dialog" onclick={handleClose}>
	<CloseIcon aria-hidden="true" />
</Button>
```

---

## Performance Optimization

### Code Splitting and Lazy Loading

✅ **CORRECT: Lazy load components with dynamic imports**

```svelte
<script>
	import { Button } from '@equaltoai/greater-components/primitives';

	let showEditor = $state(false);
	let Editor;

	async function loadEditor() {
		const module = await import('$lib/components/RichTextEditor.svelte');
		Editor = module.default;
		showEditor = true;
	}
</script>

<Button onclick={loadEditor}>Open Editor</Button>

{#if showEditor && Editor}
	<Editor />
{/if}
```

### Optimize Bundle Size

✅ **CORRECT: Import specific components**

```typescript
// BEST: Specific imports
import { Button } from '@equaltoai/greater-components/primitives/Button';
import { Modal } from '@equaltoai/greater-components/primitives/Modal';

// GOOD: Named imports (relies on tree-shaking)
import { Button, Modal } from '@equaltoai/greater-components/primitives';

// AVOID: Imports everything
import * as Primitives from '@equaltoai/greater-components/primitives';
```

---

## Responsive Design

### Mobile-First Approach

✅ **CORRECT: Build mobile-first, enhance for larger screens**

```svelte
<script>
	import { Modal, Button } from '@equaltoai/greater-components/primitives';

	let isMobile = $state(false);

	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

<Modal open={true} size={isMobile ? 'full' : 'lg'} title="Settings">
	<div class="content">
		<p>Responsive content</p>
	</div>
</Modal>

<style>
	.content {
		/* Mobile first */
		padding: 1rem;
		font-size: 14px;
	}

	/* Tablet */
	@media (min-width: 768px) {
		.content {
			padding: 1.5rem;
			font-size: 16px;
		}
	}

	/* Desktop */
	@media (min-width: 1024px) {
		.content {
			padding: 2rem;
			font-size: 18px;
		}
	}
</style>
```

---

## Non-Fediverse Application Patterns

Greater Components is not just for social media. It powers all types of modern web applications.

### Application Types

- **Landing Pages & Marketing Sites:** See [Landing Page Patterns](./patterns-landing-pages.md) for hero sections, feature grids, and pricing tables.
- **Documentation Sites:** Use `Container` for content width, `Heading` hierarchy for structure, and `Tabs` for code examples.
- **Admin Dashboards:** Use `Card` for widgets, `Container` with `maxWidth="full"` for fluid layouts, and `Table` (HTML) styled with tokens.
- **Corporate Sites:** Combine `Section` spacing with `Card` layouts to build professional company pages.
- **Portfolio Sites:** Use `Card` with `variant="outlined"` and `hoverable` for project galleries.

See [patterns-landing-pages.md](./patterns-landing-pages.md) for complete code examples of these patterns.

---

## Related Documentation

- [API Reference](./api-reference.md) - Complete API documentation
- [Getting Started](./getting-started.md) - Installation and setup
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Development Guidelines](./development-guidelines.md) - Coding standards
