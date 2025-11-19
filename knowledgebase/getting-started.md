# Getting Started with Greater Components

This guide walks you through installing, configuring, and deploying Greater Components for the first time.

## Prerequisites

**Required:**
- Node.js >= 20.0.0
- pnpm >= 9.0.0 (recommended) or npm >= 10.0.0
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

### Step 1: Choose Your Packages

Greater Components is modular. Install only what you need:

```bash
# For styled UI components (quick start)
pnpm add @equaltoai/greater-components-primitives
pnpm add @equaltoai/greater-components-tokens

# For headless components (maximum control)
pnpm add @equaltoai/greater-components-headless

# For Fediverse/social features
pnpm add @equaltoai/greater-components-fediverse
pnpm add @equaltoai/greater-components-adapters

# For icons
pnpm add @equaltoai/greater-components-icons

# For utilities
pnpm add @equaltoai/greater-components-utils

# For testing
pnpm add -D @equaltoai/greater-components-testing
```

**What these packages do:**
- `primitives` - Styled components ready to use (Button, Modal, TextField, Card, Container, etc.)
- `tokens` - Design system tokens for theming
- `headless` - Behavior-only components for custom styling
- `fediverse` - Social media components (Status, Timeline, Profile, etc.)
- `adapters` - Protocol adapters for Lesser, Mastodon, Pleroma
- `icons` - 300+ SVG icons including Fediverse-specific ones
- `utils` - Common utility functions
- `testing` - Testing helpers and accessibility validators

### Step 2: Install via JSR (Alternative)

Greater Components is also available on JSR (JavaScript Registry):

```bash
# Headless components
npx jsr add @equaltoai/greater-components-headless

# Styled primitives
npx jsr add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens

# Icons
npx jsr add @equaltoai/greater-components-icons

# Fediverse components
npx jsr add @equaltoai/greater-components-fediverse

# Utilities
npx jsr add @equaltoai/greater-components-utils
```

### Step 3: Configure TypeScript

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

### Step 4: Configure Svelte

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
    runes: true
  }
};

export default config;
```

## First Deployment

### Option 1: Styled Components (Quick Start)

Create your first component with styled primitives:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { Button, Modal, ThemeProvider, Card, Heading, Text } from '@equaltoai/greater-components-primitives';
  import { SettingsIcon } from '@equaltoai/greater-components-icons';
  
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
```

### Option 2: Headless Components (Maximum Control)

Create a component with complete styling control:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';
  import { SettingsIcon } from '@equaltoai/greater-components-icons';
  
  const button = createButton({
    type: 'button',
    loading: false,
    onClick: () => console.log('Settings clicked!')
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

### Option 3: Fediverse Timeline (Social App)

Create a Fediverse timeline:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  import { Status, createLesserTimelineStore } from '@equaltoai/greater-components-fediverse';
  
  // Initialize Lesser adapter
  const adapter = new LesserGraphQLAdapter({
    endpoint: import.meta.env.VITE_LESSER_ENDPOINT,
    token: import.meta.env.VITE_LESSER_TOKEN,
    enableSubscriptions: true
  });
  
  // Create timeline store
  const timeline = createLesserTimelineStore({
    adapter,
    type: 'HOME',
    enableRealtime: true
  });
</script>

<main>
  <h1>My Fediverse Timeline</h1>
  
  {#if timeline.isLoading}
    <p>Loading timeline...</p>
  {:else if timeline.error}
    <p>Error: {timeline.error}</p>
  {:else}
    <div class="timeline">
      {#each timeline.items as status}
        <Status.Root {status}>
          <Status.Header />
          <Status.Content />
          <Status.LesserMetadata showCost showTrust />
          <Status.Actions />
        </Status.Root>
      {/each}
    </div>
  {/if}
</main>

<style>
  .timeline {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
```

**Create `.env` file:**
```bash
VITE_LESSER_ENDPOINT=https://your-instance.social/graphql
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
  import { Button } from '@equaltoai/greater-components-primitives';
  
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
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  const button = createButton({
    onClick: () => alert('Works!')
  });
</script>

<button use:button.actions.button>
  Test Headless
</button>
```

**Expected:** Alert appears on click, keyboard navigation works

#### 3. Theme Test

```svelte
<script>
  import { ThemeProvider, ThemeSwitcher, Button } from '@equaltoai/greater-components-primitives';
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

## Troubleshooting

### Issue: "Cannot find module '@equaltoai/greater-components-primitives'"

**Cause:** Package not installed or not in package.json

**Solution:**
```bash
pnpm add @equaltoai/greater-components-primitives
```

**Verification:**
```bash
pnpm list | grep greater-components
# Should show installed packages
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

### Issue: "Components not styled"

**Cause:** Missing tokens package or ThemeProvider

**Solution:**
```bash
# Install tokens
pnpm add @equaltoai/greater-components-tokens

# Wrap app in ThemeProvider
```

```svelte
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

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