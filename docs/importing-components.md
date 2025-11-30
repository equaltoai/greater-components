# Importing Greater Components

This guide explains the correct ways to import components from the `@equaltoai/greater-components` package (v3.0.0+).

## Installation

Install the single umbrella package:

```bash
pnpm add @equaltoai/greater-components
```

## Package Structure (v3.0.0)

Greater Components is organized into these subpaths:

| Path                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `/primitives`           | Core UI components (Button, Card, Modal, etc.)       |
| `/tokens`               | Design system tokens and CSS variables               |
| `/icons`                | Feather icons and custom icons                       |
| `/headless`             | Behavior-only components (no styling)                |
| `/utils`                | Shared helper functions                              |
| `/content`              | Rich content rendering (CodeBlock, MarkdownRenderer) |
| `/shared/auth`          | Authentication components                            |
| `/shared/admin`         | Admin dashboard components                           |
| `/shared/compose`       | Post/content composer                                |
| `/shared/messaging`     | Direct messaging                                     |
| `/shared/search`        | Search components                                    |
| `/shared/notifications` | Notification feed                                    |
| `/faces/social`         | Twitter/Mastodon-style UI (Timeline, Status)         |
| `/adapters`             | Protocol adapters (Lesser GraphQL)                   |

## Import Patterns

### 1. Primitives (Core UI)

```typescript
import {
	Button,
	Container,
	Modal,
	Card,
	Heading,
	Text,
} from '@equaltoai/greater-components/primitives';
```

### 2. Icons

```typescript
import { MenuIcon, HomeIcon, SearchIcon } from '@equaltoai/greater-components/icons';
```

### 3. Content (Heavy Dependencies)

For syntax highlighting and markdown rendering:

```typescript
import { CodeBlock, MarkdownRenderer } from '@equaltoai/greater-components/content';
```

**Note:** This package has heavy dependencies (shiki, marked). Only import if you need these components.

### 4. Social Face (Twitter-style)

```typescript
import { Timeline, Status, ActionBar } from '@equaltoai/greater-components/faces/social';
```

### 5. Shared Components

```typescript
// Authentication
import * as Auth from '@equaltoai/greater-components/shared/auth';

// Compose/posting
import * as Compose from '@equaltoai/greater-components/shared/compose';

// Messaging
import * as Messaging from '@equaltoai/greater-components/shared/messaging';

// Search
import * as Search from '@equaltoai/greater-components/shared/search';

// Notifications
import * as Notifications from '@equaltoai/greater-components/shared/notifications';
```

### 6. Adapters

```typescript
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
```

## Styles

**REQUIRED:** Greater Components uses a two-layer CSS architecture. Import **BOTH** CSS files in your root layout:

```typescript
// src/routes/+layout.svelte (SvelteKit)

// Layer 1: Design tokens (colors, spacing, typography variables)
import '@equaltoai/greater-components/tokens/theme.css';
// Layer 2: Component styles (button, card, container classes)
import '@equaltoai/greater-components/primitives/style.css';
```

**For apps using social face components:**

```typescript
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/faces/social/style.css';
```

**Import Order (Critical!):**

```typescript
// ✅ CORRECT - Tokens first, then component styles
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import { ThemeProvider, Button } from '@equaltoai/greater-components/primitives';

// ❌ WRONG - Missing component styles
import '@equaltoai/greater-components/tokens/theme.css';
import { Button } from '@equaltoai/greater-components/primitives';

// ❌ WRONG - Component styles before tokens
import '@equaltoai/greater-components/primitives/style.css';
import '@equaltoai/greater-components/tokens/theme.css';
```

See the [CSS Architecture Guide](./css-architecture.md) for full documentation.

## Incorrect Import Patterns

### ❌ Old Fediverse Path (Removed in v3.0.0)

```typescript
// ❌ WRONG - This path no longer exists
import { Timeline } from '@equaltoai/greater-components/fediverse';

// ✅ CORRECT - Use faces/social
import { Timeline } from '@equaltoai/greater-components/faces/social';
```

### ❌ CodeBlock/MarkdownRenderer from Primitives

```typescript
// ❌ WRONG - These moved to content package
import { CodeBlock } from '@equaltoai/greater-components/primitives';

// ✅ CORRECT - Import from content
import { CodeBlock } from '@equaltoai/greater-components/content';
```

### ❌ Direct Component Paths

```typescript
// ❌ AVOID - Internal path
import { Button } from '@equaltoai/greater-components/dist/primitives/components/Button.svelte';

// ✅ CORRECT - Use subpath exports
import { Button } from '@equaltoai/greater-components/primitives';
```
