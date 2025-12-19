# Getting Started with Greater Components

This guide walks you through installing, configuring, and deploying Greater Components for the first time.

## Prerequisites

**Required:**

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (recommended; via Corepack)
- Svelte >= 5.0.0 (must support runes system)
- TypeScript >= 5.0.0 (strongly recommended)

**Recommended:**

- SvelteKit for full-stack applications
- Vite for build tooling (comes with SvelteKit)
- VS Code with Svelte extension

**Knowledge Requirements:**

- Familiarity with Svelte 5 runes ($state, $derived, $effect)
- Basic understanding of ActivityPub/Fediverse (if building social apps)
- TypeScript basics (if using TypeScript)

## Installation

Greater Components uses a **CLI-first, vendored** distribution model: the CLI copies Greater code + CSS into your repo,
pinned to a Git ref, so your app has **no runtime dependency** on npm-published Greater packages.

```bash
# Initialize in your project (creates components.json and injects CSS imports)
cd my-sveltekit-app
npx @equaltoai/greater-components-cli init

# Add components
npx @equaltoai/greater-components-cli add button modal

# Add a complete face (optional)
npx @equaltoai/greater-components-cli add faces/social
```

By default, the CLI uses **local CSS mode** and injects imports like:

```ts
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
import '$lib/styles/greater/social.css';
```

In vendored mode, the CLI also vendors runtime code under:

- Core packages: `$lib/greater/*` (primitives, headless, icons, tokens, utils, content, adapters)
- Face/components: `$lib/components/*`

See [CLI Guide](./cli-guide.md) for the full command reference and configuration options.

### Step 1b: Content Package Dependencies (Optional)

If you need `CodeBlock` or `MarkdownRenderer`, import them from the vendored content package:

```ts
import { CodeBlock, MarkdownRenderer } from '$lib/greater/content';
```

**Note:** In v3.0.0, CodeBlock and MarkdownRenderer moved from `/primitives` to `/content` to keep the core package lightweight. If you're only using basic components (Button, Card, Container, etc.), you don't need the content package.

### Step 2: Configure TypeScript

Add to your `tsconfig.json`:

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"types": ["svelte", "vite/client"],
		"resolveJsonModule": true,
		"allowJs": true,
		"checkJs": true,
		"strict": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules"]
}
```

### Step 3: Configure Svelte

Ensure your `svelte.config.js` uses Svelte 5:

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// SvelteKit configuration
	},

	compilerOptions: {
		// Svelte 5 is the default
		runes: true,
	},
};

export default config;
```

### Step 4: Import CSS Styles (REQUIRED)

**CRITICAL:** Greater Components uses a layered CSS architecture. You must import tokens **and** component styles.

#### Vendored (default local CSS mode)

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	// Optional (if you installed a face)
	import '$lib/styles/greater/social.css';

	import { ThemeProvider } from '$lib/greater/primitives';
	let { children } = $props();
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
```

> **Important:** Both imports are required. Without `$lib/styles/greater/primitives.css`, components render but appear completely unstyled (browser defaults). For advanced CSS configuration, see the [CSS Architecture Guide](./css-architecture.md).

**Why Both Imports Are Required:**

- Tokens provide CSS custom properties (`--gr-color-primary-*`, `--gr-spacing-*`, etc.)
- Primitives styles provide component class definitions (`.gr-button`, `.gr-card`, etc.) that use those variables

Without the token layer, component styles reference undefined variables.
Without the component styles layer, components render with browser defaults.

**Import Order Matters:**

```typescript
// ✅ CORRECT ORDER
import '$lib/styles/greater/tokens.css'; // 1. Tokens first
import '$lib/styles/greater/primitives.css'; // 2. Component styles second
import { Button } from '$lib/greater/primitives'; // 3. Components last

// ❌ WRONG ORDER - Component styles before tokens
import '$lib/styles/greater/primitives.css'; // Uses undefined variables!
import '$lib/styles/greater/tokens.css';
```

**Common Mistakes:**

```typescript
// ❌ WRONG - Missing component styles (most common issue!)
import '$lib/styles/greater/tokens.css';
import { Button, Card } from '$lib/greater/primitives';
// Result: Components render but appear as unstyled browser defaults

// ❌ WRONG - CSS imported in child component instead of root
// src/routes/+page.svelte
import '$lib/styles/greater/tokens.css'; // Too late!
// Should be in +layout.svelte

// ✅ CORRECT - Both CSS layers imported once at root
// src/routes/+layout.svelte
import '$lib/styles/greater/tokens.css';
import '$lib/styles/greater/primitives.css';
```

**Verification:**

After adding both imports, verify styles are loaded:

```bash
# Start dev server
pnpm dev

# In browser console, check tokens are loaded:
getComputedStyle(document.documentElement).getPropertyValue('--gr-color-primary-600')
# Should return: "#2563eb" (or similar color)

# Check a button element has proper styling:
# - Blue background for solid variant
# - Proper padding and border-radius
# - Correct font family
```

If components still appear unstyled:

1. Verify both import paths are exact
2. Check imports are in root layout file (not a page component)
3. Clear build cache: `rm -rf .svelte-kit node_modules/.vite && pnpm dev`
4. Verify package version is 2.0.0 or higher

### Step 5: Prevent Theme Flash (Optional)

To prevent a flash of incorrect theme colors on page load (FOUC), add this script to your `app.html`:

```html
<!-- src/app.html -->
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!-- Prevent theme flash -->
		<script>
			(function () {
				const theme = localStorage.getItem('gr-theme') || 'light';
				document.documentElement.setAttribute('data-theme', theme);
			})();
		</script>

		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

This script runs before the page renders and applies the user's saved theme preference immediately, preventing a flash of the default theme.

````

## First Deployment

### Option 1: Styled Components (Quick Start)

Create your first component with styled primitives:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { Button, Modal, ThemeProvider, Card, Heading, Text } from '$lib/greater/primitives';
  import { SettingsIcon } from '$lib/greater/icons';

  let showSettings = $state(false);
</script>

<ThemeProvider>
  <main>
    <Card variant="elevated" padding="lg">
        <Heading level={1}>My Greater Components App</Heading>
        <Text class="mb-4">Welcome to your new app.</Text>

        <Button
        variant="solid"
        size="md"
        onclick={() => showSettings = true}
        >
        {#snippet prefix()}
            <SettingsIcon />
        {/snippet}
        Open Settings
        </Button>
    </Card>

    <Modal
      bind:open={showSettings}
      title="Settings"
      size="lg"
    >
      <p>Configure your application settings here.</p>

      {#snippet footer()}
        <Button
          variant="ghost"
          onclick={() => showSettings = false}
        >
          Cancel
        </Button>
        <Button variant="solid">
          Save Changes
        </Button>
      {/snippet}
    </Modal>
  </main>
</ThemeProvider>

<style>
  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  :global(.mb-4) { margin-bottom: 1rem; }
</style>
````

### Option 2: Headless Components (Maximum Control)

Create a component with complete styling control:

```svelte
<!-- src/routes/+page.svelte -->
<script>
	import { createButton } from '$lib/greater/headless/button';
	import { SettingsIcon } from '$lib/greater/icons';

	const button = createButton({
		type: 'button',
		loading: false,
		onClick: () => console.log('Settings clicked!'),
	});
</script>

<main>
	<h1>My Custom App</h1>

	<button use:button.actions.button class="custom-button">
		<SettingsIcon />
		{#if button.state.loading}
			Loading...
		{:else}
			Settings
		{/if}
	</button>
</main>

<style>
	.custom-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.custom-button:hover {
		transform: translateY(-2px);
	}

	.custom-button:active {
		transform: translateY(0);
	}
</style>
```

### Option 3: Social Timeline (Twitter-style App)

Create a social timeline using the social face:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';
	import TimelineVirtualizedReactive from '$lib/components/TimelineVirtualizedReactive.svelte';

	// Initialize Lesser adapter
	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: import.meta.env.VITE_LESSER_ENDPOINT,
		token: import.meta.env.VITE_LESSER_TOKEN,
		// Optional: enables GraphQL subscriptions (real-time updates) when supported by your Lesser instance
		wsEndpoint: import.meta.env.VITE_LESSER_WS_ENDPOINT,
	});

	const view = { type: 'home' };
</script>

<main>
	<h1>My Fediverse Timeline</h1>

	<TimelineVirtualizedReactive {adapter} {view} estimateSize={320} />
</main>
```

Create `.env` file:

```bash
VITE_LESSER_ENDPOINT=https://your-instance.social/graphql
VITE_LESSER_WS_ENDPOINT=wss://your-instance.social/graphql
VITE_LESSER_TOKEN=your-auth-token
```

## Local Development

### Run Development Server

```bash
# Start dev server (SvelteKit)
pnpm dev

# Or for Vite-only projects
vite dev
```

**What this does:**

- Starts development server on http://localhost:5173
- Enables hot module replacement (HMR)
- Provides TypeScript checking
- Auto-imports components

### Development Mode Features

- **Hot Reload** - Changes appear instantly without page refresh
- **Type Checking** - TypeScript errors shown in real-time
- **Auto Import** - Components auto-imported in many setups
- **Source Maps** - Debug original source code

## Production Deployment

### Step 1: Build for Production

```bash
# Build all packages
pnpm build

# Or just your app (in SvelteKit)
pnpm build
```

**What this does:**

- Compiles Svelte components to optimized JavaScript
- Bundles and minifies code
- Generates TypeScript declarations
- Optimizes CSS
- Creates production-ready output in `build/` directory

### Step 2: Preview Production Build

```bash
# Preview production build locally
pnpm preview
```

Test production build at http://localhost:4173

### Step 3: Deploy

**Vercel:**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

**Netlify:**

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy --prod
```

**Cloudflare Pages:**

```bash
# Build command: pnpm build
# Publish directory: build
```

**Static Hosting:**

```bash
# Upload contents of build/ directory
# to your static host (Nginx, Apache, S3, etc.)
```

## Verification

### Test Your Deployment

#### 1. Styled Components Test

```svelte
<script>
	import { Button } from '$lib/greater/primitives';

	let clicks = $state(0);
</script>

<Button onclick={() => clicks++}>
	Clicked {clicks} times
</Button>
```

**Expected:** Button appears styled, click counter increments

#### 2. Headless Components Test

```svelte
<script>
	import { createButton } from '$lib/greater/headless/button';

	const button = createButton({
		onClick: () => alert('Works!'),
	});
</script>

<button use:button.actions.button> Test Headless </button>
```

**Expected:** Alert appears on click, keyboard navigation works

#### 3. Theme Test

```svelte
<script>
	import { ThemeProvider, ThemeSwitcher, Button } from '$lib/greater/primitives';
</script>

<ThemeProvider>
	<ThemeSwitcher />
	<Button variant="solid">Test Theme</Button>
</ThemeProvider>
```

**Expected:** Theme switcher changes component appearance

#### 4. Fediverse Test (if applicable)

```bash
# Verify adapter connection
curl https://your-instance.social/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "{ viewer { username } }"}'
```

**Expected:** Returns JSON with username

## Next Steps

- **Learn Patterns:** Read [Core Patterns](./core-patterns.md) for best practices
- **Explore API:** See [API Reference](./api-reference.md) for complete interfaces
- **Customize Theme:** Learn theming in [Core Patterns](./core-patterns.md#theming)
- **View Examples:** Check [Playground](../apps/playground) for live examples
- **Build Fediverse App:** Follow [Lesser Integration Guide](../docs/lesser-integration-guide.md)
- **Build Fediverse App:** Follow [Lesser Integration Guide](./lesser-integration-guide.md)

## Troubleshooting

### Issue: "Cannot find module '$lib/greater/primitives'"

**Cause:** Greater CLI has not been run (or vendored files are missing).

**Solution:**

```bash
npx @equaltoai/greater-components-cli init
npx @equaltoai/greater-components-cli add primitives
```

**Verification:**

```bash
ls src/lib/greater/primitives
# Should exist after install
```

### Issue: "Svelte 5 runes not working"

**Cause:** Using Svelte 4 or earlier

**Solution:**

```bash
# Upgrade to Svelte 5
pnpm add svelte@latest

# Verify version
pnpm list svelte
# Should show 5.x.x
```

### Issue: "Snippets not working"

**Cause:** Using old Svelte 4 slot syntax

**Solution:**

```svelte
<!-- INCORRECT (Svelte 4 syntax) -->
<Modal>
	<div slot="footer">...</div>
</Modal>

<!-- CORRECT (Svelte 5 syntax) -->
<Modal>
	{#snippet footer()}
		...
	{/snippet}
</Modal>
```

### Issue: "TypeScript errors about types"

**Cause:** TypeScript configuration missing or incorrect

**Solution:**

```json
{
	"compilerOptions": {
		"moduleResolution": "bundler",
		"types": ["svelte", "vite/client"]
	}
}
```

### Issue: "Components not styled" / Components appear as browser defaults

**Cause:** Missing CSS imports. Greater Components requires TWO CSS files.

**Solution:**

Ensure your root layout imports both CSS layers:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// ✅ BOTH imports required
	import '$lib/styles/greater/tokens.css'; // Design tokens
	import '$lib/styles/greater/primitives.css'; // Component styles

	import { ThemeProvider } from '$lib/greater/primitives';
</script>

<ThemeProvider>
	<!-- Your app -->
</ThemeProvider>
```

**Common causes:**

- Only importing `tokens/theme.css` (missing component styles)
- Importing CSS in a page component instead of root layout
- Wrong import order (component styles before tokens)

See [CSS Architecture Guide](./css-architecture.md) for full details.

### Issue: "Lesser adapter fails with 401"

**Cause:** Invalid or expired authentication token

**Solution:**

```bash
# Verify token works
curl https://your-instance.social/graphql \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "{ viewer { id } }"}'

# If fails, generate new token from Lesser admin panel
```

**Prevention:**

- Store tokens in environment variables
- Never commit tokens to version control
- Implement token refresh logic
- Handle 401 errors gracefully

### Issue: "Build fails with memory error"

**Cause:** Large project consuming too much memory

**Solution:**

```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

[See full troubleshooting guide](./troubleshooting.md)

## Getting Help

**For installation issues:**

- Verify Node version: `node --version` (should be >= 20.0.0)
- Verify pnpm version: `pnpm --version` (should be >= 9.0.0)
- Check [Troubleshooting Guide](./troubleshooting.md)

**For usage questions:**

- Review [Core Patterns](./core-patterns.md)
- Check [API Reference](./api-reference.md)
- Search [GitHub Discussions](https://github.com/equaltoai/greater-components/discussions)

**For bugs:**

- Search existing issues first
- Provide minimal reproduction
- Include version numbers

**For security issues:**

- Email `security@equalto.ai` (do not use public tracker)
