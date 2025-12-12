# Face Development Guide

<!-- AI Training: This guide covers creating custom faces for Greater Components -->

**Faces are opinionated component bundles designed for specific application types. This guide covers creating custom faces for Greater Components.**

## What is a Face?

A **Face** is a curated collection of components, patterns, and styles designed for a specific product type:

| Face        | Use Case               | Example Apps                   |
| ----------- | ---------------------- | ------------------------------ |
| `social`    | Twitter/Mastodon-style | Social networks, microblogging |
| `blog`      | Medium/WordPress-style | Publishing platforms, blogs    |
| `community` | Reddit/Forum-style     | Discussion forums, communities |

Faces include:

- Domain-specific components
- UI patterns
- Theme overrides
- Type definitions

---

## Face Architecture

```
packages/faces/my-face/
├── manifest.json          # Face metadata and component list
├── package.json           # npm package configuration
├── README.md              # Documentation
├── src/
│   ├── index.ts           # Main exports
│   ├── components/        # Face-specific components
│   │   ├── MyComponent/
│   │   │   ├── Root.svelte
│   │   │   ├── context.ts
│   │   │   └── index.ts
│   │   └── ...
│   ├── patterns/          # UI patterns
│   │   └── index.ts
│   ├── theme.css          # Theme overrides
│   └── types.ts           # TypeScript definitions
├── tests/                 # Component tests
│   ├── MyComponent.test.ts
│   └── setup.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Creating a Custom Face

### Step 1: Create Face Directory

```bash
mkdir -p packages/faces/my-face/src/components
cd packages/faces/my-face
```

### Step 2: Create manifest.json

The manifest defines your face's metadata and components:

```json
{
	"$schema": "../../../schemas/module-manifest.schema.json",
	"name": "@equaltoai/greater-components-my-face",
	"version": "1.0.0",
	"description": "My custom face for Greater Components",
	"components": {
		"MyComponent": {
			"description": "Main component for my face",
			"subcomponents": ["Root", "Header", "Content", "Footer"],
			"props": ["data", "config", "handlers"],
			"events": ["onAction", "onChange"],
			"slots": ["header", "footer"]
		}
	},
	"patterns": ["my-pattern"],
	"dependencies": {
		"primitives": ["button", "card", "modal"],
		"shared": ["auth"],
		"npm": []
	},
	"styles": {
		"main": "./dist/my-face.css",
		"tokens": "./src/theme.css"
	},
	"examples": ["examples/my-face-app"]
}
```

### Step 3: Create package.json

```json
{
	"name": "@equaltoai/greater-components-my-face",
	"private": true,
	"version": "1.0.0",
	"type": "module",
	"description": "My custom face for Greater Components",
	"license": "AGPL-3.0-only",
	"main": "./dist/index.js",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"svelte": "./src/index.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./src/index.ts",
			"import": "./dist/index.js"
		},
		"./manifest.json": "./manifest.json",
		"./style.css": "./dist/my-face.css",
		"./theme.css": "./src/theme.css"
	},
	"files": ["dist", "src"],
	"scripts": {
		"build": "vite build && tsc -b --force --emitDeclarationOnly",
		"dev": "vite build --watch",
		"test": "vitest run",
		"typecheck": "tsc --noEmit"
	},
	"dependencies": {
		"@equaltoai/greater-components-primitives": "workspace:*",
		"@equaltoai/greater-components-headless": "workspace:^",
		"@equaltoai/greater-components-icons": "workspace:*"
	},
	"devDependencies": {
		"svelte": "^5.0.0",
		"typescript": "^5.0.0",
		"vite": "^5.0.0",
		"vitest": "^1.0.0"
	},
	"peerDependencies": {
		"svelte": "^5.0.0"
	}
}
```

### Step 4: Create Main Component

**src/components/MyComponent/Root.svelte:**

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { createMyComponentContext, MY_COMPONENT_CONTEXT_KEY } from './context.js';
	import type { MyComponentData, MyComponentConfig, MyComponentHandlers } from '../../types.js';

	interface Props {
		data: MyComponentData;
		config?: MyComponentConfig;
		handlers?: MyComponentHandlers;
		children?: import('svelte').Snippet;
	}

	let { data, config = {}, handlers = {}, children }: Props = $props();

	// Create and provide context
	const context = createMyComponentContext(data, config, handlers);
	setContext(MY_COMPONENT_CONTEXT_KEY, context);
</script>

<article class="my-component" data-testid="my-component">
	{@render children?.()}
</article>

<style>
	.my-component {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-4);
		padding: var(--gr-spacing-4);
		background: var(--gr-color-surface);
		border-radius: var(--gr-radii-lg);
	}
</style>
```

**src/components/MyComponent/context.ts:**

```typescript
import { getContext } from 'svelte';
import type { MyComponentData, MyComponentConfig, MyComponentHandlers } from '../../types.js';

export const MY_COMPONENT_CONTEXT_KEY = Symbol('my-component');

export interface MyComponentContext {
	data: MyComponentData;
	config: MyComponentConfig;
	handlers: MyComponentHandlers;
}

export function createMyComponentContext(
	data: MyComponentData,
	config: MyComponentConfig,
	handlers: MyComponentHandlers
): MyComponentContext {
	return { data, config, handlers };
}

export function getMyComponentContext(): MyComponentContext {
	const context = getContext<MyComponentContext>(MY_COMPONENT_CONTEXT_KEY);
	if (!context) {
		throw new Error('MyComponent.* must be used within MyComponent.Root');
	}
	return context;
}
```

**src/components/MyComponent/index.ts:**

```typescript
export { default as Root } from './Root.svelte';
export { default as Header } from './Header.svelte';
export { default as Content } from './Content.svelte';
export { default as Footer } from './Footer.svelte';
export * from './context.js';
```

### Step 5: Create Types

**src/types.ts:**

```typescript
export interface MyComponentData {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
}

export interface MyComponentConfig {
	showAuthor?: boolean;
	showTimestamp?: boolean;
	maxContentLength?: number;
}

export interface MyComponentHandlers {
	onAction?: (action: string, data: MyComponentData) => void;
	onChange?: (data: Partial<MyComponentData>) => void;
}
```

### Step 6: Create Theme CSS

**src/theme.css:**

```css
/* My Face Theme Overrides */

:root {
	/* Custom color palette */
	--my-face-primary: var(--gr-color-primary-600);
	--my-face-secondary: var(--gr-color-secondary-500);

	/* Custom spacing */
	--my-face-card-padding: var(--gr-spacing-4);
	--my-face-card-gap: var(--gr-spacing-3);
}

/* Dark mode overrides */
[data-theme='dark'] {
	--my-face-primary: var(--gr-color-primary-400);
	--my-face-secondary: var(--gr-color-secondary-400);
}

/* Component-specific styles */
.my-component {
	--component-bg: var(--gr-color-surface);
	--component-border: var(--gr-color-border);
}
```

### Step 7: Create Main Export

**src/index.ts:**

```typescript
// Components
export * as MyComponent from './components/MyComponent/index.js';

// Patterns
export * from './patterns/index.js';

// Types
export type * from './types.js';
```

---

## Compound Component Pattern

Faces should use the compound component pattern for complex components:

```svelte
<!-- Usage -->
<MyComponent.Root {data}>
	<MyComponent.Header />
	<MyComponent.Content />
	<MyComponent.Footer />
</MyComponent.Root>
```

**Benefits:**

- Flexible composition
- Shared context
- Customizable rendering
- Clear component boundaries

---

## Registering with CLI

To make your face available via the CLI, add it to the face registry:

**packages/cli/src/registry/faces.ts:**

```typescript
export const faceRegistry: Record<string, FaceManifest> = {
	// ... existing faces

	'my-face': {
		name: 'my-face',
		type: 'face',
		description: 'My custom face for specific use case',
		files: [],
		dependencies: [],
		devDependencies: [],
		registryDependencies: ['button', 'card', 'modal'],
		tags: ['my-face', 'custom'],
		version: '1.0.0',
		domain: 'custom',
		includes: {
			primitives: ['button', 'card', 'modal'],
			shared: ['auth'],
			patterns: ['my-pattern'],
			components: ['MyComponent'],
		},
		styles: {
			main: 'packages/faces/my-face/dist/my-face.css',
			tokens: 'packages/faces/my-face/src/theme.css',
		},
		examples: ['examples/my-face-app'],
		docs: 'https://greater.fediverse.dev/faces/my-face',
	},
};
```

---

## Testing Your Face

### Unit Tests

**tests/MyComponent.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { MyComponent } from '../src/index.js';

describe('MyComponent', () => {
	const mockData = {
		id: '1',
		title: 'Test Title',
		content: 'Test content',
		createdAt: new Date(),
		author: { id: '1', name: 'Test Author' },
	};

	it('renders root component', () => {
		render(MyComponent.Root, { props: { data: mockData } });
		expect(screen.getByTestId('my-component')).toBeInTheDocument();
	});

	it('displays title in header', () => {
		render(MyComponent.Root, {
			props: { data: mockData },
			slots: { default: '<MyComponent.Header />' },
		});
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});
});
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
	const { container } = render(MyComponent.Root, { props: { data: mockData } });
	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
```

---

## Best Practices

### 1. Use Design Tokens

Always use Greater Components design tokens:

```css
/* ✅ Correct */
.my-component {
	padding: var(--gr-spacing-4);
	color: var(--gr-color-text-primary);
}

/* ❌ Incorrect */
.my-component {
	padding: 16px;
	color: #333;
}
```

### 2. Support Dark Mode

Test and style for both light and dark themes:

```css
.my-component {
	background: var(--gr-color-surface);
}

[data-theme='dark'] .my-component {
	/* Dark mode specific overrides if needed */
}
```

### 3. Accessibility First

- Use semantic HTML
- Include ARIA attributes
- Support keyboard navigation
- Test with screen readers

### 4. TypeScript Everything

- Export all types
- Use strict mode
- Document props with JSDoc

### 5. Document Components

Include README with:

- Installation instructions
- Quick start example
- Component inventory table
- Props documentation

---

## Publishing Your Face

### Internal (Monorepo)

1. Add to `pnpm-workspace.yaml`
2. Register in CLI face registry
3. Build and test

### External (npm)

1. Update `package.json` with `"private": false`
2. Add `publishConfig`
3. Build distribution files
4. Publish to npm

```bash
pnpm build
npm publish --access public
```

---

## Related Documentation

- [CLI Guide](./cli-guide.md) – CLI command reference
- [Core Patterns](./core-patterns.md) – Component patterns
- [Development Guidelines](./development-guidelines.md) – Coding standards

---

_Last Updated: December 2024_
