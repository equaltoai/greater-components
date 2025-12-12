# Custom Face Example

This example demonstrates how to create a custom face for Greater Components.

## What's Included

- `manifest.json` - Face metadata and component definitions
- `src/components/` - Custom components using compound pattern
- `src/theme.css` - Theme customizations
- `src/types.ts` - TypeScript definitions

## Creating Your Own Face

### 1. Copy This Template

```bash
cp -r examples/custom-face packages/faces/my-face
cd packages/faces/my-face
```

### 2. Update manifest.json

```json
{
	"name": "@equaltoai/greater-components-my-face",
	"version": "1.0.0",
	"description": "My custom face",
	"components": {
		"MyComponent": {
			"description": "Main component",
			"subcomponents": ["Root", "Header", "Content"]
		}
	}
}
```

### 3. Create Components

Follow the compound component pattern:

```svelte
<!-- src/components/MyComponent/Root.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import { createContext, CONTEXT_KEY } from './context.js';

	let { data, children } = $props();

	setContext(CONTEXT_KEY, createContext(data));
</script>

<article class="my-component">
	{@render children?.()}
</article>
```

### 4. Add Theme Customizations

```css
/* src/theme.css */
:root {
	--my-face-primary: var(--gr-color-primary-600);
}
```

### 5. Register with CLI

Add to `packages/cli/src/registry/faces.ts` to make available via CLI.

## Learn More

- [Face Development Guide](../../docs/face-development.md)
- [Development Guidelines](../../docs/development-guidelines.md)
