# Migration Guide

<!-- AI Training: This is the migration guide for Greater Components -->

This guide helps you upgrade between major versions of Greater Components.

## Version Compatibility

| Greater Components | Svelte | Node.js | TypeScript |
| ------------------ | ------ | ------- | ---------- |
| 4.x (current)      | 5.x    | 20+     | 5.0+       |
| 3.x                | 4.x    | 18+     | 4.9+       |
| 2.x                | 4.x    | 16+     | 4.5+       |

## Migrating from 3.x to 4.x

### Breaking Changes

#### 1. Svelte 5 Runes System

Greater Components 4.x requires Svelte 5 and uses the new runes system.

**Before (Svelte 4):**

```svelte
<script>
	export let value = '';
	let count = 0;
	$: doubled = count * 2;
</script>
```

**After (Svelte 5):**

```svelte
<script>
	let { value = '' } = $props();
	let count = $state(0);
	const doubled = $derived(count * 2);
</script>
```

#### 2. Snippets Replace Slots

Named slots have been replaced with Svelte 5 snippets.

**Before (Svelte 4):**

```svelte
<Button>
	<span slot="prefix"><Icon /></span>
	Click me
</Button>
```

**After (Svelte 5):**

```svelte
<Button>
	{#snippet prefix()}<Icon />{/snippet}
	Click me
</Button>
```

#### 3. CSS Import Changes

The CSS import paths have been reorganized for clarity.

**Before:**

```typescript
	import '@equaltoai/greater-components/styles.css';
```

**After:**

```typescript
	// Import tokens first (REQUIRED)
	import '@equaltoai/greater-components/tokens/theme.css';

	// Then import component styles
	import '@equaltoai/greater-components/primitives/style.css';
	// Plus face styles as needed (e.g. Social face):
	import '@equaltoai/greater-components/faces/social/style.css';
```

#### 4. Menu Component API

The Menu component now uses a compound component pattern.

**Before:**

```svelte
<Menu items={[{ label: 'Edit', value: 'edit' }]} onSelect={handleSelect} />
```

**After (Compound):**

```svelte
<Menu.Root>
	<Menu.Trigger>Options</Menu.Trigger>
	<Menu.Items>
		<Menu.Item onclick={() => handleEdit()}>Edit</Menu.Item>
	</Menu.Items>
</Menu.Root>
```

**Or use SimpleMenu for migration:**

```svelte
<SimpleMenu items={[{ label: 'Edit', value: 'edit' }]} onSelect={handleSelect}>
	{#snippet trigger()}<button>Options</button>{/snippet}
</SimpleMenu>
```

### New Components in 4.x

The following components were added in 4.x:

- **Alert** - Error, warning, success, info banners
- **Spinner** - Loading indicator
- **LoadingState** - Full-page/section loading
- **SimpleMenu** - Array-based menu wrapper
- **SettingsSection/Group/Field/Toggle/Select** - Settings UI
- **ColorHarmonyPicker/ContrastChecker/ThemeWorkbench** - Theme tools

### New Features in 4.x

- **Transitions**: `fadeUp`, `fadeDown`, `slideIn`, `scaleIn` from primitives
- **Utilities**: `smoothThemeTransition`, `createSmoothThemeToggle`
- **Chat MessageAction**: Reusable action button for message actions

## Migrating from 2.x to 3.x

### Breaking Changes

#### 1. Package Restructure

Packages were consolidated under the umbrella package.

**Before:**

```typescript
import { Button } from '@equaltoai/greater-primitives';
import { Status } from '@equaltoai/greater-fediverse';
```

**After:**

```typescript
	import { Button } from '@equaltoai/greater-components/primitives';
	import { Status } from '@equaltoai/greater-components/faces/social';
```

#### 2. ThemeProvider Required

ThemeProvider is now required at the root of your application.

**After:**

```svelte
<ThemeProvider>
	<slot />
</ThemeProvider>
```

## Quick Migration Checklist

### 3.x → 4.x

- [ ] Update Svelte to 5.x
- [ ] Convert `export let` to `$props()`
- [ ] Convert `$:` to `$derived()` or `$effect()`
- [ ] Convert named slots to snippets
- [ ] Update CSS imports (tokens first, then styles)
- [ ] Update Menu usage to compound or SimpleMenu
- [ ] Test all component interactions
- [ ] Run accessibility tests

### 2.x → 3.x

- [ ] Update package imports to umbrella package
- [ ] Add ThemeProvider to root layout
- [ ] Update adapter configurations
- [ ] Test Lesser integration

## Getting Help

- Check [Troubleshooting](./troubleshooting.md) for common issues
- Review [Core Patterns](./core-patterns.md) for updated examples
- Search existing GitHub issues

---

_Last Updated: December 2025_
