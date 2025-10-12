# Getting Started with Greater Components

Welcome to Greater Components! This guide will help you get up and running with building Fediverse applications in minutes.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 20.0.0 or higher
- **Package Manager**: pnpm (recommended), npm, or yarn
- **Framework**: Svelte 5 or SvelteKit
- **TypeScript**: Version 5.5.0 or higher (optional but recommended)

---

## 📦 Installation

### **Step 1: Install Core Packages**

```bash
# Using pnpm (recommended)
pnpm add @greater/fediverse @greater/adapters @greater/utils

# Using npm
npm install @greater/fediverse @greater/adapters @greater/utils

# Using yarn
yarn add @greater/fediverse @greater/adapters @greater/utils
```

### **Step 2: Install Optional Packages**

```bash
# Icons (tree-shakeable)
pnpm add @greater/icons

# Testing utilities
pnpm add -D @greater/testing

# Primitives (if building custom components)
pnpm add @greater/primitives @greater/headless
```

---

## 🚀 Your First Component

### **Basic Timeline**

Create a simple timeline component:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Timeline } from '@greater/fediverse';
  import { createTimelineStore } from '@greater/adapters';

  // Create a timeline store
  const timeline = createTimelineStore({
    endpoint: 'https://api.lesser.social/graphql',
    timeline: 'home',
    token: 'your-auth-token' // Optional
  });
</script>

<main>
  <h1>My Timeline</h1>
  
  <Timeline.Root store={timeline}>
    <Timeline.Feed />
  </Timeline.Root>
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
```

That's it! You now have a working timeline that displays posts from a Fediverse instance.

---

## 🔐 Authentication

Add user authentication:

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let authenticated = false;
  let authToken = '';

  function handleLogin({ token }) {
    authToken = token;
    authenticated = true;
  }
</script>

{#if !authenticated}
  <Auth.Root>
    <Auth.LoginForm 
      onSuccess={handleLogin}
      endpoint="https://api.lesser.social/auth" 
    />
  </Auth.Root>
{:else}
  <p>Welcome! You're logged in.</p>
  <!-- Show authenticated content -->
{/if}
```

---

## ✍️ Post Composition

Let users create posts:

```svelte
<script lang="ts">
  import { Compose } from '@greater/fediverse';

  async function handleSubmit({ content, visibility }) {
    const response = await fetch('https://api.lesser.social/api/v1/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: content, visibility })
    });

    if (response.ok) {
      console.log('Post created!');
    }
  }
</script>

<Compose.Root onSubmit={handleSubmit}>
  <Compose.Editor placeholder="What's on your mind?" />
  <Compose.CharacterCount max={500} />
  <Compose.VisibilitySelect />
  <Compose.Submit>Post</Compose.Submit>
</Compose.Root>
```

---

## 🔍 Search

Add search functionality:

```svelte
<script lang="ts">
  import { Search } from '@greater/fediverse';
  import { debounce } from '@greater/utils';

  let results = [];

  const performSearch = debounce(async (query) => {
    const response = await fetch(
      `https://api.lesser.social/api/v2/search?q=${encodeURIComponent(query)}`
    );
    results = await response.json();
  }, 300);
</script>

<Search.Root>
  <Search.Bar onSearch={performSearch} />
  <Search.Results {results} />
</Search.Root>
```

---

## 👤 User Profiles

Display user profiles:

```svelte
<script lang="ts">
  import { Profile } from '@greater/fediverse';
  
  export let userId: string;
  
  let profile = $state(null);
  
  $effect(() => {
    fetch(`https://api.lesser.social/api/v1/accounts/${userId}`)
      .then(r => r.json())
      .then(data => profile = data);
  });
</script>

{#if profile}
  <Profile.Root data={profile}>
    <Profile.Header />
    <Profile.Stats />
    <Profile.Tabs />
  </Profile.Root>
{/if}
```

---

## 🔔 Real-time Updates

Enable real-time timeline updates:

```svelte
<script lang="ts">
  import { Timeline } from '@greater/fediverse';
  import { createGraphQLClient } from '@greater/adapters';

  // Create GraphQL client with WebSocket support
  const client = createGraphQLClient({
    httpEndpoint: 'https://api.lesser.social/graphql',
    wsEndpoint: 'wss://api.lesser.social/graphql',
    token: authToken
  });

  // Subscribe to timeline updates
  const unsubscribe = client.subscribe({
    query: `
      subscription {
        timelineUpdated {
          id
          content
          createdAt
        }
      }
    `,
    onData: (data) => {
      console.log('New post:', data);
      // Update timeline
    }
  });

  // Cleanup on unmount
  $effect(() => {
    return () => unsubscribe();
  });
</script>
```

---

## 🎨 Theming

Customize the appearance:

```css
/* src/app.css */
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  
  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  /* Spacing */
  --spacing-unit: 8px;
  --spacing-xs: calc(var(--spacing-unit) * 0.5);
  --spacing-sm: var(--spacing-unit);
  --spacing-md: calc(var(--spacing-unit) * 2);
  --spacing-lg: calc(var(--spacing-unit) * 3);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #111827;
    --color-surface: #1f2937;
    --color-text: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-border: #374151;
  }
}
```

---

## 📱 Complete Example

Here's a complete, minimal social media app:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Timeline, Auth, Compose, Search } from '@greater/fediverse';
  import { createTimelineStore } from '@greater/adapters';
  import { debounce } from '@greater/utils';

  let authenticated = $state(false);
  let authToken = $state('');
  let activeView = $state('timeline');

  const timeline = createTimelineStore({
    endpoint: 'https://api.lesser.social/graphql',
    timeline: 'home',
    get token() { return authToken; }
  });

  function handleLogin({ token }) {
    authToken = token;
    authenticated = true;
  }

  async function handlePost({ content, visibility }) {
    await fetch('https://api.lesser.social/api/v1/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: content, visibility })
    });
    timeline.refresh();
  }
</script>

<div class="app">
  {#if !authenticated}
    <div class="auth-page">
      <h1>Welcome to Fediverse</h1>
      <Auth.Root>
        <Auth.LoginForm onSuccess={handleLogin} />
      </Auth.Root>
    </div>
  {:else}
    <nav class="nav">
      <button onclick={() => activeView = 'timeline'}>Timeline</button>
      <button onclick={() => activeView = 'compose'}>Compose</button>
      <button onclick={() => activeView = 'search'}>Search</button>
    </nav>

    <main class="main">
      {#if activeView === 'timeline'}
        <Timeline.Root store={timeline}>
          <Timeline.Feed />
        </Timeline.Root>
      {:else if activeView === 'compose'}
        <Compose.Root onSubmit={handlePost}>
          <Compose.Editor />
          <Compose.CharacterCount max={500} />
          <Compose.Submit>Post</Compose.Submit>
        </Compose.Root>
      {:else if activeView === 'search'}
        <Search.Root>
          <Search.Bar />
          <Search.Results />
        </Search.Root>
      {/if}
    </main>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    background: var(--color-background);
  }

  .auth-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  button:hover {
    background: var(--color-primary-hover);
  }
</style>
```

---

## 🔧 Configuration

### **SvelteKit Configuration**

Add to `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter(),
    alias: {
      '@greater/*': './node_modules/@greater/*'
    }
  },

  compilerOptions: {
    runes: true // Enable Svelte 5 runes
  }
};

export default config;
```

### **TypeScript Configuration**

Add to `tsconfig.json`:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "esnext",
    "lib": ["esnext", "dom"],
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "paths": {
      "@greater/*": ["./node_modules/@greater/*"]
    }
  }
}
```

---

## 🧪 Testing

Test your components:

```typescript
// src/routes/Timeline.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Timeline from './Timeline.svelte';

describe('Timeline', () => {
  it('renders timeline', () => {
    const { getByText } = render(Timeline);
    expect(getByText('My Timeline')).toBeInTheDocument();
  });
});
```

---

## 📚 Next Steps

Now that you have the basics, explore more:

1. **[Component Documentation](./components/)** - Learn about all 45 components
2. **[Integration Guides](./integration/)** - Connect to different platforms
3. **[API Reference](./api/)** - Detailed API documentation
4. **[Patterns](./patterns/)** - Best practices and patterns
5. **[Examples](./examples/)** - Full application examples

---

## 🆘 Troubleshooting

### **Common Issues**:

#### **"Module not found"**
Make sure all packages are installed:
```bash
pnpm install
```

#### **"Component not rendering"**
Check that you're using Svelte 5 with runes enabled.

#### **"TypeScript errors"**
Ensure TypeScript 5.5+ is installed and configured.

#### **"Styles not applying"**
Import CSS custom properties in your `app.css`.

### **Get Help**:
- [GitHub Issues](https://github.com/equaltoai/greater-components/issues)
- [Discord Community](https://discord.gg/greater)
- [Documentation](./README.md)

---

## 🎉 You're Ready!

You're now ready to build amazing Fediverse applications with Greater Components!

**Happy coding!** 🚀

