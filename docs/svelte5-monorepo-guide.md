# Svelte 5 Monorepo Best Practices Guide

## For the Greater Components Team

This guide outlines best practices for developing Svelte 5 component libraries in our pnpm monorepo. It combines industry standards with patterns specific to our codebase.

---

## Table of Contents

1. [Monorepo Architecture](#1-monorepo-architecture)
2. [Svelte 5 Runes](#2-svelte-5-runes)
3. [Component Development](#3-component-development)
4. [Package Configuration](#4-package-configuration)
5. [Build & Tooling](#5-build--tooling)
6. [TypeScript Configuration](#6-typescript-configuration)
7. [Testing Strategy](#7-testing-strategy)
8. [Common Pitfalls](#8-common-pitfalls)

---

## 1. Monorepo Architecture

### Our Structure

```
greater-components/
├── apps/                    # Applications
│   ├── playground/          # Development sandbox
│   └── docs/                # Documentation site
├── packages/                # Core library packages
│   ├── tokens/              # Design tokens & CSS variables
│   ├── icons/               # SVG icon components
│   ├── utils/               # Utility functions
│   ├── headless/            # Unstyled behavior primitives
│   ├── primitives/          # Styled UI components
│   ├── content/             # Content rendering (Markdown, Code)
│   ├── adapters/            # Transport & state (Apollo, etc.)
│   └── greater-components/  # Aggregate export package
├── packages/shared/         # Feature modules
│   ├── auth/                # Authentication components
│   ├── chat/                # Chat interface
│   ├── compose/             # Content composition
│   └── ...
├── packages/faces/          # Theme variations
│   └── social/              # Social media theme
├── pnpm-workspace.yaml      # Workspace configuration
└── tsconfig.base.json       # Shared TypeScript config
```

### Dependency Layers

Follow this dependency hierarchy to avoid circular dependencies:

```
┌─────────────────────────────────────────────┐
│ Applications (playground, docs)              │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Feature Modules (shared/*, faces/*)          │
│ Domain-specific composed components          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ UI Layer (primitives, content, headless)     │
│ Styled components + behavior primitives      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Foundation (tokens, icons, utils, adapters)  │
│ Zero/minimal internal dependencies           │
└─────────────────────────────────────────────┘
```

**Rule:** Packages may only import from layers below them, never above or sideways within the same layer.

### Workspace Protocol

Always use `workspace:*` for internal dependencies:

```json
{
	"dependencies": {
		"@equaltoai/greater-components-primitives": "workspace:*",
		"@equaltoai/greater-components-icons": "workspace:*"
	},
	"peerDependencies": {
		"@equaltoai/greater-components-tokens": "workspace:*",
		"svelte": "^5.43.6"
	}
}
```

---

## 2. Svelte 5 Runes

### Core Runes Overview

| Rune        | Purpose                 | Returns Value | Has Side Effects |
| ----------- | ----------------------- | ------------- | ---------------- |
| `$state`    | Declare reactive state  | No            | No               |
| `$derived`  | Compute derived values  | Yes           | No               |
| `$effect`   | Run side effects        | No            | Yes              |
| `$props`    | Receive component props | No            | No               |
| `$bindable` | Two-way binding props   | No            | No               |

### `$state` - Reactive State

```svelte
<script>
	// Simple state
	let count = $state(0);

	// Object state (deeply reactive)
	let user = $state({ name: 'Alice', age: 30 });

	// Array state (deeply reactive)
	let items = $state([]);
</script>
```

**Important:** Objects and arrays become deeply reactive proxies. Mutations are tracked automatically:

```svelte
<script>
	let items = $state([]);

	function addItem(item) {
		items.push(item); // This triggers reactivity
	}
</script>
```

### `$derived` - Computed Values

Use `$derived` for values that depend on other reactive state:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
	let isEven = $derived(count % 2 === 0);
</script>
```

For complex derivations, use `$derived.by`:

```svelte
<script>
	let items = $state([]);

	let summary = $derived.by(() => {
		const total = items.reduce((sum, item) => sum + item.price, 0);
		const count = items.length;
		return { total, count, average: count > 0 ? total / count : 0 };
	});
</script>
```

**Key characteristics:**

- Lazy evaluation (only computed when accessed)
- Memoized (won't recompute if dependencies haven't changed)
- Should be pure (no side effects)

### `$effect` - Side Effects

Use `$effect` sparingly and only for true side effects:

```svelte
<script>
	let searchQuery = $state('');

	// Good: External API call
	$effect(() => {
		if (searchQuery.length > 2) {
			fetch(`/api/search?q=${searchQuery}`)
				.then((res) => res.json())
				.then((data) => (results = data));
		}
	});

	// Good: Canvas rendering
	$effect(() => {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, width, height);
	});

	// Good: Third-party library integration
	$effect(() => {
		const chart = new Chart(element, { data: chartData });
		return () => chart.destroy(); // Cleanup
	});
</script>
```

**Anti-patterns to avoid:**

```svelte
<script>
	let count = $state(0);
	let doubled = $state(0);

	// BAD: Synchronizing derived state
	$effect(() => {
		doubled = count * 2;
	});

	// GOOD: Use $derived instead
	let doubled = $derived(count * 2);
</script>
```

**Cleanup pattern:**

```svelte
<script>
	$effect(() => {
		const handler = (e) => console.log(e);
		window.addEventListener('resize', handler);

		// Return cleanup function
		return () => {
			window.removeEventListener('resize', handler);
		};
	});
</script>
```

**Async tracking limitation:**

```svelte
<script>
	let query = $state('');

	// BAD: query accessed after await won't be tracked
	$effect(async () => {
		await delay(100);
		console.log(query); // Not tracked!
	});

	// GOOD: Access state synchronously first
	$effect(() => {
		const currentQuery = query; // Tracked
		delay(100).then(() => {
			console.log(currentQuery);
		});
	});
</script>
```

### `$props` - Component Props

```svelte
<script>
	// Destructure with defaults
	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		children, // Slot content
		...restProps // Remaining props
	} = $props();
</script>

<button class="{variant} {size}" {disabled} {...restProps}>
	{@render children?.()}
</button>
```

**TypeScript typing:**

```svelte
<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	}

	let { variant = 'primary', size = 'md', disabled = false, onclick, children }: Props = $props();
</script>
```

**Never mutate props directly:**

```svelte
<script>
	let { value, onchange } = $props();

	// BAD: Direct mutation
	function handleInput(e) {
		value = e.target.value;
	}

	// GOOD: Use callback
	function handleInput(e) {
		onchange?.(e.target.value);
	}
</script>
```

### `$bindable` - Two-Way Binding

For props that need two-way binding:

```svelte
<!-- Parent.svelte -->
<script>
  let value = $state('');
</script>

<TextField bind:value />

<!-- TextField.svelte -->
<script>
  let { value = $bindable('') } = $props();
</script>

<input bind:value />
```

---

## 3. Component Development

### File Naming Conventions

```
src/
├── components/
│   ├── Button.svelte          # Component
│   ├── Button.svelte.d.ts     # Generated types
│   ├── button.ts              # Non-reactive logic
│   └── button.svelte.ts       # Reactive logic (uses runes)
├── utils/
│   ├── dom.ts                 # Regular utilities
│   └── reactive.svelte.ts     # Utilities using runes
└── index.ts                   # Package exports
```

**Rule:** Files using runes outside `.svelte` components must use `.svelte.ts` or `.svelte.js` extension.

### Component Structure Pattern

```svelte
<!-- Button.svelte -->
<script lang="ts" module>
	// Module-level exports (types, constants)
	export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
	export type ButtonSize = 'sm' | 'md' | 'lg';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// Props interface
	interface Props extends HTMLButtonAttributes {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		children?: Snippet;
	}

	// Destructure props with defaults
	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	// Derived state
	let isDisabled = $derived(disabled || loading);

	// Local state (if needed)
	let pressed = $state(false);
</script>

<button
	class="btn btn-{variant} btn-{size} {className}"
	disabled={isDisabled}
	aria-busy={loading}
	{...restProps}
>
	{#if loading}
		<span class="spinner" aria-hidden="true"></span>
	{/if}
	{@render children?.()}
</button>

<style>
	.btn {
		/* Component styles */
	}
</style>
```

### Snippets (Replacing Slots)

Svelte 5 uses snippets instead of slots:

```svelte
<!-- Card.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let { header, footer, children }: Props = $props();
</script>

<article class="card">
	{#if header}
		<header class="card-header">
			{@render header()}
		</header>
	{/if}

	<div class="card-body">
		{@render children?.()}
	</div>

	{#if footer}
		<footer class="card-footer">
			{@render footer()}
		</footer>
	{/if}
</article>
```

**Using snippets with parameters:**

```svelte
<!-- List.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props<T> {
		items: T[];
		renderItem: Snippet<[T, number]>;
	}

	let { items, renderItem }: Props<T> = $props();
</script>

<ul>
	{#each items as item, index}
		<li>{@render renderItem(item, index)}</li>
	{/each}
</ul>

<!-- Usage -->
<List {items}>
	{#snippet renderItem(item, index)}
		<span>{index + 1}. {item.name}</span>
	{/snippet}
</List>
```

### Shared Reactive State

Create `.svelte.ts` files for shared reactive logic:

```typescript
// stores/counter.svelte.ts
export function createCounter(initial = 0) {
  let count = $state(initial);

  return {
    get count() { return count; },
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; }
  };
}

// Usage in component
<script>
  import { createCounter } from './stores/counter.svelte.ts';

  const counter = createCounter(10);
</script>

<button onclick={counter.increment}>{counter.count}</button>
```

**Context-based shared state:**

```typescript
// context/theme.svelte.ts
import { getContext, setContext } from 'svelte';

const THEME_KEY = Symbol('theme');

export function createThemeContext() {
	let theme = $state<'light' | 'dark'>('light');

	const context = {
		get theme() {
			return theme;
		},
		toggle() {
			theme = theme === 'light' ? 'dark' : 'light';
		},
		set(value: 'light' | 'dark') {
			theme = value;
		},
	};

	setContext(THEME_KEY, context);
	return context;
}

export function getThemeContext() {
	return getContext<ReturnType<typeof createThemeContext>>(THEME_KEY);
}
```

---

## 4. Package Configuration

### Standard package.json Structure

```json
{
	"name": "@equaltoai/greater-components-primitives",
	"version": "3.0.0",
	"type": "module",
	"svelte": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js",
			"import": "./dist/index.js"
		},
		"./Button.svelte": {
			"types": "./dist/components/Button.svelte.d.ts",
			"svelte": "./dist/components/Button.svelte",
			"import": "./dist/components/Button.svelte"
		}
	},
	"files": ["dist", "!dist/**/*.test.*"],
	"sideEffects": ["**/*.css"],
	"peerDependencies": {
		"svelte": "^5.43.6",
		"@equaltoai/greater-components-tokens": "workspace:*"
	},
	"devDependencies": {
		"@sveltejs/package": "^2.3.0",
		"@sveltejs/vite-plugin-svelte": "^5.0.0",
		"svelte": "^5.43.6",
		"typescript": "^5.7.0",
		"vite": "^6.0.0"
	},
	"scripts": {
		"build": "svelte-package --output dist",
		"dev": "svelte-package --output dist --watch",
		"test": "vitest run",
		"typecheck": "tsc --noEmit"
	}
}
```

### Exports Best Practices

**Order of conditions matters:**

```json
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts", // Always first
			"svelte": "./dist/index.js", // Svelte-aware bundlers
			"import": "./dist/index.js" // Standard ESM
		}
	}
}
```

**Subpath exports for tree-shaking:**

```json
{
	"exports": {
		".": "./dist/index.js",
		"./Button.svelte": "./dist/components/Button.svelte",
		"./Modal.svelte": "./dist/components/Modal.svelte",
		"./utils": "./dist/utils/index.js"
	}
}
```

### sideEffects Configuration

Mark CSS as having side effects for proper bundling:

```json
{
	"sideEffects": ["**/*.css", "**/*.scss"]
}
```

For pure JavaScript libraries:

```json
{
	"sideEffects": false
}
```

---

## 5. Build & Tooling

### Vite Configuration for Libraries

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		lib: {
			entry: './src/index.ts',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'svelte',
				'svelte/internal',
				'@equaltoai/greater-components-tokens',
				'@equaltoai/greater-components-icons',
			],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js',
			},
		},
	},
});
```

### svelte-package Configuration

For Svelte component libraries, use `svelte-package`:

```json
{
	"scripts": {
		"build": "svelte-package --output dist",
		"dev": "svelte-package --output dist --watch"
	}
}
```

### Turborepo Task Configuration

In `turbo.json`:

```json
{
	"$schema": "https://turbo.build/schema.json",
	"tasks": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**", ".svelte-kit/**"]
		},
		"dev": {
			"cache": false,
			"persistent": true
		},
		"test": {
			"dependsOn": ["build"]
		},
		"typecheck": {
			"dependsOn": ["^build"]
		}
	}
}
```

### Hot Reload in Development

For Vite to properly hot-reload workspace packages:

```typescript
// vite.config.ts (in apps)
export default defineConfig({
	optimizeDeps: {
		exclude: ['@equaltoai/greater-components-primitives', '@equaltoai/greater-components-icons'],
	},
	server: {
		fs: {
			allow: ['..'], // Allow serving files from parent directories
		},
	},
});
```

---

## 6. TypeScript Configuration

### Base Configuration (tsconfig.base.json)

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true,
		"composite": true,
		"isolatedModules": true,
		"verbatimModuleSyntax": true
	}
}
```

### Package-Level Configuration

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"rootDir": "./src",
		"outDir": "./dist"
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Path Aliases

Define in the root `tsconfig.base.json` for IDE support:

```json
{
	"compilerOptions": {
		"paths": {
			"@equaltoai/greater-components-primitives": ["./packages/primitives/src/index.ts"],
			"@equaltoai/greater-components-icons": ["./packages/icons/src/index.ts"],
			"@equaltoai/greater-components-tokens": ["./packages/tokens/src/index.ts"]
		}
	}
}
```

### Svelte Type Checking

```bash
# Check types across all packages
pnpm typecheck

# Check specific package
pnpm --filter @equaltoai/greater-components-primitives typecheck
```

---

## 7. Testing Strategy

### Unit Testing with Vitest

```typescript
// Button.test.ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
	it('renders with default props', () => {
		const { getByRole } = render(Button, {
			props: { children: createRawSnippet(() => 'Click me') },
		});

		expect(getByRole('button')).toHaveTextContent('Click me');
	});

	it('applies variant class', () => {
		const { getByRole } = render(Button, {
			props: { variant: 'secondary' },
		});

		expect(getByRole('button')).toHaveClass('btn-secondary');
	});

	it('handles click events', async () => {
		let clicked = false;
		const { getByRole } = render(Button, {
			props: { onclick: () => (clicked = true) },
		});

		await fireEvent.click(getByRole('button'));
		expect(clicked).toBe(true);
	});
});
```

### Accessibility Testing

```typescript
// a11y.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import Button from './Button.svelte';

describe('Button accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = render(Button);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
```

### Testing Reactive State

```typescript
// counter.test.ts
import { describe, it, expect } from 'vitest';
import { createCounter } from './counter.svelte.ts';
import { flushSync } from 'svelte';

describe('createCounter', () => {
	it('increments count', () => {
		const counter = createCounter(0);

		flushSync(() => {
			counter.increment();
		});

		expect(counter.count).toBe(1);
	});
});
```

---

## 8. Common Pitfalls

### 1. Mutating Props

```svelte
<!-- BAD -->
<script>
  let { items } = $props();

  function addItem(item) {
    items.push(item); // Mutating parent's array!
  }
</script>

<!-- GOOD -->
<script>
  let { items, onItemAdd } = $props();

  function addItem(item) {
    onItemAdd?.(item);
  }
</script>
```

### 2. Using $effect for Derived Values

```svelte
<!-- BAD -->
<script>
  let count = $state(0);
  let doubled = $state(0);

  $effect(() => {
    doubled = count * 2;
  });
</script>

<!-- GOOD -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

### 3. Async Dependencies in Effects

```svelte
<!-- BAD: searchQuery not tracked after await -->
<script>
  let searchQuery = $state('');

  $effect(async () => {
    const results = await fetch(`/api?q=${searchQuery}`);
    // searchQuery changes won't trigger re-run
  });
</script>

<!-- GOOD: Capture state synchronously -->
<script>
  let searchQuery = $state('');

  $effect(() => {
    const query = searchQuery; // Tracked
    fetch(`/api?q=${query}`).then(/* ... */);
  });
</script>
```

### 4. Forgetting .svelte.ts Extension

```typescript
// BAD: Won't work in regular .ts file
// utils/state.ts
export function createToggle() {
	let active = $state(false); // Error!
	return {
		/* ... */
	};
}

// GOOD: Use .svelte.ts extension
// utils/state.svelte.ts
export function createToggle() {
	let active = $state(false); // Works!
	return {
		/* ... */
	};
}
```

### 5. Circular Dependencies in Monorepo

```
// BAD: Circular dependency
primitives -> headless -> primitives

// GOOD: Clear dependency direction
primitives -> headless -> (no UI dependencies)
```

### 6. Missing Peer Dependencies

```json
// BAD: Svelte bundled with package
{
  "dependencies": {
    "svelte": "^5.43.6"
  }
}

// GOOD: Svelte as peer dependency
{
  "peerDependencies": {
    "svelte": "^5.43.6"
  }
}
```

### 7. Incorrect Import Extensions

```typescript
// BAD: Missing extension
import { Button } from './components/Button';

// GOOD: Full path with extension
import { Button } from './components/Button.js';
```

---

## Quick Reference

### Rune Cheatsheet

```svelte
<script>
	// State
	let count = $state(0);
	let user = $state({ name: '' });

	// Derived (computed)
	let doubled = $derived(count * 2);
	let fullName = $derived.by(() => `${user.first} ${user.last}`);

	// Props
	let { prop1, prop2 = 'default' } = $props();

	// Bindable props
	let { value = $bindable('') } = $props();

	// Effects (use sparingly!)
	$effect(() => {
		console.log(count);
		return () => cleanup();
	});

	// Pre-effect (before DOM update)
	$effect.pre(() => {
		// Runs before DOM updates
	});
</script>
```

### Package Scripts

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @equaltoai/greater-components-primitives build

# Development mode
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Lint
pnpm lint
```

---

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [SvelteKit Packaging](https://svelte.dev/docs/kit/packaging)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

_Last updated: December 2025_
