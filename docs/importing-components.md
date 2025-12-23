# Importing Greater Components (Vendored)

This guide explains the correct import paths when using the **Greater CLI** in `installMode: "vendored"` (default).

In vendored mode:

- Greater code is copied into your repo (shadcn-style).
- Your app has **no runtime dependency** on `@equaltoai/greater-components`.

## Install (CLI)

```bash
npx @equaltoai/greater-components-cli init

# Add a face bundle (recommended starting point)
npx @equaltoai/greater-components-cli add faces/social

# Or add core packages directly
npx @equaltoai/greater-components-cli add primitives icons tokens headless
```

## Default Import Paths

### 1. Core Packages (`$lib/greater/*`)

| Package     | Import path               | Notes                                     |
| ----------- | ------------------------- | ----------------------------------------- |
| Primitives  | `$lib/greater/primitives` | Styled Svelte components                  |
| Headless    | `$lib/greater/headless/*` | Builders/actions (e.g. `button`, `tabs`)  |
| Icons       | `$lib/greater/icons`      | SVG icon components                       |
| Tokens (JS) | `$lib/greater/tokens`     | Token helpers/constants (CSS is separate) |
| Utils       | `$lib/greater/utils`      | Shared utilities                          |
| Content     | `$lib/greater/content`    | Markdown + syntax highlighting components |
| Adapters    | `$lib/greater/adapters`   | Lesser GraphQL + stores                   |

**Example: primitives**

```ts
import { Button, Modal, ThemeProvider } from '$lib/greater/primitives';
```

**Example: headless**

```ts
import { createButton } from '$lib/greater/headless/button';
```

### 2. Face + Compound Components (`$lib/components/*`)

Face installs place components under `$lib/components`. Compound components typically have an `index.ts` exporting a
compound API.

**Example: Status (compound API)**

```ts
import { Status } from '$lib/components/Status';
```

**Example: single-file component**

```ts
import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';
```

### 3. Shared Modules (`$lib/components/<module>`)

Shared modules install under `$lib/components/<module>`.

```ts
import * as Auth from '$lib/components/auth';
import * as Chat from '$lib/components/chat';
```

### 4. Patterns (`$lib/patterns/*`)

```ts
import ThreadView from '$lib/patterns/thread-view/ThreadView.svelte';
```

## Styles (REQUIRED)

Greater Components uses a two-layer CSS architecture. Import **both** CSS files in your root layout:

```ts
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
```

If you installed a face, also import its CSS:

```ts
import '$lib/styles/greater/social.css';
```

See the [CSS Architecture Guide](./css-architecture.md) for full documentation.

## Customizing Paths

You can change where files are installed by editing `components.json`:

- `aliases.greater` (default `$lib/greater`)
- `aliases.components` (default `$lib/components`)
- `css.localDir` (default `styles/greater`, relative to `aliases.lib`)
