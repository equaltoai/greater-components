# Importing Greater Components

This guide explains the correct ways to import components from the `@equaltoai/greater-components` package.

## Installation

Install the single umbrella package:

```bash
pnpm add @equaltoai/greater-components
```

## Correct Import Patterns

Greater Components is organized into subpaths. You should import from these specific paths to ensure optimal tree-shaking and organization.

### 1. Primitives

Styled UI components:

```typescript
import { Button, Container, Modal } from '@equaltoai/greater-components/primitives';
```

### 2. Icons

Feather icons and custom Fediverse icons:

```typescript
import { MenuIcon, HomeIcon } from '@equaltoai/greater-components/icons';
```

### 3. Tokens

Design system tokens (often used for theming):

```typescript
import { tokens } from '@equaltoai/greater-components/tokens';
```

### 4. Fediverse Components

Components for ActivityPub/social applications:

```typescript
import { Status, Timeline } from '@equaltoai/greater-components/fediverse';
```

### 5. Adapters

Protocol adapters:

```typescript
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
```

### 6. Utilities

Shared helper functions:

```typescript
import { formatRelativeTime } from '@equaltoai/greater-components/utils';
```

## Styles

**REQUIRED:** Import theme CSS in your root layout file (import once at application root):

```typescript
// src/routes/+layout.svelte (SvelteKit) or src/App.svelte (Vite/Svelte)
import '@equaltoai/greater-components/tokens/theme.css';
```

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

## Incorrect Import Patterns

### ❌ Non-Existent Packages

Do not try to install or import from workspace package names:

```typescript
// ❌ WRONG - Package does not exist
import { Button } from '@equaltoai/greater-components-primitives';
```

### ❌ Direct Component Paths

Do not import individual component files unless you know exactly what you are doing (internal structure may change):

```typescript
// ❌ AVOID - Internal path
import { Button } from '@equaltoai/greater-components/dist/primitives/components/Button.svelte';
```

Instead, use the subpath exports:

```typescript
// ✅ CORRECT
import { Button } from '@equaltoai/greater-components/primitives';
```
