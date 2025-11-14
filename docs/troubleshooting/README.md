# Troubleshooting Guide

This guide helps you resolve common issues when using Greater Components. Find solutions to installation problems, build errors, runtime issues, and more.

## Quick Navigation

- [**Installation Issues**](#installation-issues) - npm/pnpm installation problems
- [**Build & Bundle Problems**](#build--bundle-problems) - Vite, Rollup, Webpack issues
- [**TypeScript Errors**](#typescript-errors) - Type-related problems
- [**Styling & Theming**](#styling--theming) - CSS and theme issues
- [**Component Behavior**](#component-behavior) - Component not working as expected
- [**Accessibility Issues**](#accessibility-issues) - A11y testing and compliance
- [**Performance Problems**](#performance-problems) - Slow rendering, memory issues
- [**Fediverse Integration**](#fediverse-integration) - Social media component issues
- [**Development Tools**](#development-tools) - Storybook, testing, linting

## Installation Issues

### Package Not Found

**Problem**: `npm install @equaltoai/greater-components-primitives` fails with "package not found"

**Solutions**:

```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Check package registry
npm config get registry
npm config set registry https://registry.npmjs.org/

# 3. Try with different package manager
pnpm add @equaltoai/greater-components-primitives
yarn add @equaltoai/greater-components-primitives

# 4. Check package exists
npm view @equaltoai/greater-components-primitives
```

### Peer Dependencies Issues

**Problem**: Warnings about missing peer dependencies

**Solutions**:

```bash
# Install all required peer dependencies
npm install svelte @equaltoai/greater-components-tokens

# Check what's missing
npm ls --depth=0

# Auto-install peer dependencies
npm install-peerdeps @equaltoai/greater-components-primitives
```

### Version Conflicts

**Problem**: Multiple versions of Greater Components installed

**Solutions**:

```bash
# Check for duplicate versions
npm ls @equaltoai/greater-components-primitives

# Remove duplicates
npm dedupe

# Force single version
npm install @equaltoai/greater-components-primitives@^1.0.0 --save-exact
```

## Build & Bundle Problems

### Vite Build Errors

**Problem**: Vite fails to build with Greater Components

**Solution**: Update your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			// Enable Svelte 5 mode
			compilerOptions: {
				runes: true,
			},
		}),
	],
	optimizeDeps: {
		include: [
			'@equaltoai/greater-components-primitives',
			'@equaltoai/greater-components-tokens',
			'@equaltoai/greater-components-icons',
		],
	},
	ssr: {
		noExternal: [
			'@equaltoai/greater-components-primitives',
			'@equaltoai/greater-components-fediverse',
		],
	},
});
```

### SvelteKit Integration Issues

**Problem**: Components not working in SvelteKit

**Solution**: Update `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		runes: true, // Enable Svelte 5 runes
	},

	kit: {
		adapter: adapter(),
		alias: {
			'@equaltoai/*': './node_modules/@equaltoai/*',
		},
	},
};

export default config;
```

### Webpack Configuration

**Problem**: Using Greater Components with Webpack

**Solution**: Update webpack config:

```javascript
module.exports = {
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							runes: true,
						},
					},
				},
			},
		],
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte/src/runtime'),
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
};
```

### CSS Import Errors

**Problem**: CSS imports not working

**Solutions**:

```javascript
// 1. In your main app file
import '@equaltoai/greater-components-tokens/theme.css';

// 2. In Vite config
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        // Add PostCSS plugins if needed
      ]
    }
  }
});

// 3. In SvelteKit app.html
<link rel="stylesheet" href="%sveltekit.assets%/@equaltoai/greater-components-tokens/theme.css">
```

## TypeScript Errors

### Module Declaration Issues

**Problem**: TypeScript can't find Greater Components modules

**Solution**: Add to your `app.d.ts`:

```typescript
/// <reference types="@sveltejs/kit" />
/// <reference types="@equaltoai/greater-components-primitives" />

declare module '@equaltoai/greater-components-primitives' {
	export * from '@equaltoai/greater-components-primitives/dist/index';
}

declare module '@equaltoai/greater-components-icons' {
	export * from '@equaltoai/greater-components-icons/dist/index';
}
```

### Component Prop Types

**Problem**: TypeScript errors with component props

**Solution**: Use proper type imports:

```typescript
// Import component types
import type { ButtonProps, ModalProps } from '@equaltoai/greater-components-primitives';
import { Button, Modal } from '@equaltoai/greater-components-primitives';

// Use in your component
interface MyComponentProps {
	buttonConfig: ButtonProps;
	showModal: boolean;
}
```

### Svelte 5 Runes Types

**Problem**: TypeScript errors with runes

**Solution**: Ensure correct Svelte version and types:

```json
// package.json
{
	"devDependencies": {
		"svelte": "^5.0.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.0",
		"typescript": "^5.0.0"
	}
}
```

```typescript
// Use proper rune types
let count = $state(0);
let doubled = $derived(count * 2);

// Component props with proper typing
interface Props {
	title: string;
	count?: number;
}

let { title, count = 0 }: Props = $props();
```

## Styling & Theming

### CSS Custom Properties Not Working

**Problem**: Design tokens not applying

**Solutions**:

```css
/* 1. Ensure CSS is imported */
@import '@equaltoai/greater-components-tokens/theme.css';

/* 2. Check custom property usage */
.my-component {
	/* Wrong */
	color: --gr-color-primary-600;

	/* Correct */
	color: var(--gr-color-primary-600);
}

/* 3. Verify token names */
.my-component {
	/* Use gr- prefix */
	background: var(--gr-semantic-background-primary);
}
```

### Theme Switching Issues

**Problem**: Theme changes not applying

**Solution**: Proper theme provider setup:

```svelte
<script>
	import { ThemeProvider } from '@equaltoai/greater-components-primitives';
	import { preferencesStore } from '@equaltoai/greater-components-primitives';
</script>

<!-- Wrap your entire app -->
<ThemeProvider>
	<main>
		<!-- Your app content -->
	</main>
</ThemeProvider>

<style>
	/* Ensure CSS custom properties cascade */
	:global(:root) {
		color-scheme: light dark;
	}
</style>
```

### Component Styles Conflicting

**Problem**: Component styles overridden by global styles

**Solutions**:

```css
/* 1. Use CSS layers for better control */
@layer reset, components, utilities;

@layer components {
	@import '@equaltoai/greater-components-tokens/theme.css';
}

/* 2. Increase specificity carefully */
.my-app .gr-button {
	/* Your overrides */
}

/* 3. Use CSS custom properties for theming */
.gr-button {
	--gr-button-background: var(--my-custom-color);
}
```

## Component Behavior

### Modal Not Opening

**Problem**: Modal component not showing

**Solutions**:

```svelte
<script>
	import { Modal } from '@equaltoai/greater-components-primitives';

	// 1. Use bindable variable
	let showModal = $state(false);

	// 2. Check boolean value
	function openModal() {
		showModal = true; // Ensure it's actually true
		console.log('Modal state:', showModal);
	}
</script>

<!-- 3. Use bind:open for two-way binding -->
<Modal bind:open={showModal} title="My Modal">
	<p>Modal content</p>
</Modal>

<button onclick={openModal}>Open Modal</button>
```

### Button Click Not Working

**Problem**: Button onclick handler not firing

**Solutions**:

```svelte
<script>
	// 1. Use proper event handler syntax
	function handleClick(event) {
		console.log('Button clicked:', event);
	}

	// 2. Check for disabled/loading states
	let disabled = false;
	let loading = false;
</script>

<!-- 3. Ensure onclick is properly bound -->
<Button onclick={handleClick} {disabled} {loading}>Click Me</Button>
```

### Form Components Not Validating

**Problem**: TextField validation not working

**Solution**:

```svelte
<script>
	import { TextField } from '@equaltoai/greater-components-primitives';

	let email = $state('');
	let emailError = $state('');

	function validateEmail() {
		if (!email.includes('@')) {
			emailError = 'Please enter a valid email';
		} else {
			emailError = '';
		}
	}
</script>

<TextField
	bind:value={email}
	type="email"
	label="Email"
	error={emailError}
	oninput={validateEmail}
	required
/>
```

## Accessibility Issues

### Screen Reader Not Announcing

**Problem**: Screen reader not reading component content

**Solutions**:

```svelte
<!-- 3. Manage focus properly -->
<script>
	import { tick } from 'svelte';

	let modalOpen = $state(false);
	let firstInput;

	$effect(() => {
		if (modalOpen && firstInput) {
			tick().then(() => firstInput.focus());
		}
	});
</script>

<!-- 1. Ensure proper ARIA labels -->
<Button aria-label="Close dialog">
	<CloseIcon aria-hidden="true" />
</Button>

<!-- 2. Use semantic HTML -->
<Modal title="Settings" aria-describedby="modal-description">
	<p id="modal-description">Configure your application settings</p>
</Modal>
```

### Keyboard Navigation Broken

**Problem**: Can't navigate components with keyboard

**Solutions**:

```svelte
<!-- 2. Handle keyboard events -->
<script>
	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleAction();
		}
	}
</script>

<!-- 1. Ensure proper tabindex -->
<Menu>
	<MenuButton tabindex="0">Options</MenuButton>
	<MenuItems>
		<MenuItem tabindex="-1">Edit</MenuItem>
		<MenuItem tabindex="-1">Delete</MenuItem>
	</MenuItems>
</Menu>

<div role="button" tabindex="0" onkeydown={handleKeydown}>Custom Button</div>
```

### Color Contrast Issues

**Problem**: Failing WCAG color contrast requirements

**Solution**:

```css
/* Use high contrast theme */
:root[data-theme='high-contrast'] {
	--gr-color-primary-600: #0000ff; /* High contrast blue */
	--gr-color-background: #ffffff;
	--gr-color-foreground: #000000;
}

/* Test contrast ratios */
.custom-button {
	background: var(--gr-semantic-action-primary-default);
	color: var(--gr-semantic-action-primary-foreground);
	/* Ensure 4.5:1 contrast ratio minimum */
}
```

## Performance Problems

### Slow Timeline Rendering

**Problem**: TimelineVirtualized performance issues

**Solutions**:

```svelte
<script>
	import { TimelineVirtualized } from '@equaltoai/greater-components-fediverse';

	// 1. Enable virtualization properly
	let items = $state([]);

	// 2. Use consistent item heights
	const itemHeight = 200; // Fixed height for better performance

	// 3. Limit initial items
	let visibleItems = $derived(items.slice(0, 100));
</script>

<TimelineVirtualized items={visibleItems} {itemHeight} overscan={5} onLoadMore={loadMoreItems} />
```

### Memory Leaks

**Problem**: Application consuming too much memory

**Solutions**:

```svelte
<script>
	// 1. Clean up effects properly
	let subscription = $state();

	$effect(() => {
		subscription = createSubscription();

		// Cleanup function
		return () => {
			subscription?.unsubscribe();
		};
	});

	// 2. Limit reactive computations
	let expensiveComputation = $derived.by(() => {
		// Only recalculate when necessary
		if (items.length > 1000) {
			return computeExpensiveValue(items);
		}
		return null;
	});
</script>
```

### Bundle Size Issues

**Problem**: Large bundle size with Greater Components

**Solutions**:

```javascript
// 1. Import only what you need
import { Button } from '@equaltoai/greater-components-primitives/Button';
import { HomeIcon } from '@equaltoai/greater-components-icons/home';

// 2. Configure tree shaking
// vite.config.js
export default defineConfig({
	build: {
		rollupOptions: {
			external: ['@equaltoai/greater-components-fediverse'], // If not using
		},
	},
});

// 3. Use dynamic imports for large components
const TimelineVirtualized = await import(
	'@equaltoai/greater-components-fediverse/TimelineVirtualized'
);
```

## Fediverse Integration

### Connection Timeouts

**Problem**: Fediverse server connections timing out

**Solutions**:

```javascript
import { TransportManager } from '@equaltoai/greater-components-adapters';

const transport = new TransportManager({
	baseUrl: 'https://mastodon.social',
	timeout: 10000, // 10 second timeout
	retries: 3,
	retryDelay: 1000,
});

// Handle connection errors
transport.on('error', (error) => {
	console.error('Connection error:', error);
	// Implement fallback logic
});
```

### Status Card Not Rendering

**Problem**: StatusCard showing blank content

**Solutions**:

```svelte
<script>
	import { StatusCard } from '@equaltoai/greater-components-fediverse';

	// 1. Ensure proper status object structure
	let status = {
		id: '123',
		account: {
			display_name: 'User',
			username: 'user',
			avatar: 'https://example.com/avatar.jpg',
		},
		content: '<p>Status content</p>',
		created_at: '2025-01-01T00:00:00Z',
		// ... other required fields
	};

	// 2. Handle loading states
	let loading = $state(false);
</script>

{#if loading}
	<StatusCardSkeleton />
{:else if status}
	<StatusCard {status} />
{:else}
	<p>No status to display</p>
{/if}
```

### Real-time Updates Not Working

**Problem**: Live timeline updates not appearing

**Solutions**:

```javascript
// 1. Check WebSocket connection
const timeline = createTimelineStore({
	server: 'mastodon.social',
	realtime: true,
	onConnectionError: (error) => {
		console.error('WebSocket error:', error);
		// Fallback to polling
	},
});

// 2. Verify server supports streaming
if (!timeline.supportsStreaming) {
	console.warn('Server does not support real-time streaming');
	// Use polling fallback
}

// 3. Check authentication
timeline.authenticate(accessToken);
```

## Development Tools

### Storybook Not Loading Components

**Problem**: Components not appearing in Storybook

**Solution**: Update `.storybook/main.js`:

```javascript
module.exports = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
	framework: {
		name: '@storybook/svelte-vite',
		options: {},
	},
	svelteOptions: {
		preprocess: import('@sveltejs/vite-plugin-svelte').then((plugin) => plugin.vitePreprocess()),
	},
};
```

### Testing Components Failing

**Problem**: Component tests failing with Greater Components

**Solution**: Update test setup:

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test-setup.js'],
	},
});

// test-setup.js
import '@equaltoai/greater-components-testing/setup';
import '@testing-library/jest-dom';
```

### ESLint Errors with Svelte 5

**Problem**: ESLint not recognizing Svelte 5 syntax

**Solution**: Update ESLint config:

```javascript
// eslint.config.js
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	},
];
```

## Getting Additional Help

### Before Asking for Help

1. **Check the Console**: Look for error messages in browser DevTools
2. **Review Documentation**: Check our [API docs](../../API_DOCUMENTATION.md)
3. **Search Issues**: Look through [GitHub Issues](https://github.com/equaltoai/greater-components/issues)
4. **Try Minimal Example**: Reproduce the issue in a simple test case

### Where to Get Help

1. **GitHub Discussions**: [Ask questions](https://github.com/equaltoai/greater-components/discussions)
2. **GitHub Issues**: [Report bugs](https://github.com/equaltoai/greater-components/issues)
3. **Discord Community**: Join our Discord server (link in README)
4. **Email Support**: For enterprise users: `support@equalto.ai`

### How to Report Issues

When reporting bugs, include:

1. **Environment Details**:
   - Greater Components version
   - Node.js version
   - Package manager (npm/pnpm/yarn)
   - Framework (Svelte, SvelteKit)
   - Browser and version

2. **Reproduction Steps**:
   - Minimal code example
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if visual issue

3. **Error Messages**:
   - Complete error messages
   - Console logs
   - Network errors if applicable

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// Set debug environment
localStorage.setItem('gr-debug', 'true');

// Or in Node.js
process.env.GR_DEBUG = 'true';
```

## FAQ

### **Q: Why is my component not rendering?**

**A:** Check that you've imported the CSS, the component is properly imported, and all required props are provided.

### **Q: How do I debug accessibility issues?**

**A:** Use the `@equaltoai/greater-components-testing` package's accessibility helpers, enable high contrast mode, and test with screen readers.

### **Q: Why are my styles not applying?**

**A:** Ensure CSS custom properties are imported, check CSS specificity, and verify token names have the correct `--gr-` prefix.

### **Q: How do I optimize performance?**

**A:** Use virtual scrolling for large lists, implement proper cleanup in effects, and import only needed components.

### **Q: Why can't TypeScript find my components?**

**A:** Make sure TypeScript definitions are included in your build, update your `tsconfig.json`, and check import paths.

---

_Still need help? Join our community discussions or file an issue with detailed information about your problem._

---

_Last updated: August 11, 2025_  
_For the latest troubleshooting information, visit: [https://github.com/equaltoai/greater-components/docs/troubleshooting](https://github.com/equaltoai/greater-components/docs/troubleshooting)_
