# For Lesser Team: Using Greater Components

## TL;DR

```javascript
import { Button, TextField } from '@equaltoai/greater-components/primitives';
```

Done. No CSS imports needed. Styles work automatically.

## How It Works

Greater Components are **compiled from source** by your bundler.

1. You import: `import { Button } from '@equaltoai/greater-components/primitives'`
2. Your bundler resolves to: `node_modules/@equaltoai/greater-components/dist/primitives/src/components/Button.svelte`
3. Your Svelte compiler compiles it
4. CSS is automatically scoped and injected
5. ✅ Everything works

## Required Config

### astro.config.mjs

```javascript
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    svelte({
      compilerOptions: {
        runes: true  // Required for Svelte 5
      }
    })
  ]
});
```

That's it.

## Why No Separate CSS Import?

**Old (broken) way:**
```javascript
import '@equaltoai/greater-components/primitives/style.css';  // ❌ Don't do this
import { Button } from '@equaltoai/greater-components/primitives';
```

**New (correct) way:**
```javascript
import { Button } from '@equaltoai/greater-components/primitives';  // ✅ CSS included
```

The CSS is **in the .svelte files**. When you compile from source, it's extracted and scoped automatically.

## Build Process

```
Lesser imports Greater Components
     ↓
Astro/Vite sees import
     ↓
Resolves to .svelte source files
     ↓
Svelte compiler processes them
     ↓
Generates scoped CSS + JS
     ↓
Injects into your app
     ↓
✅ Styled components
```

## Tokens (Design System Variables)

Greater Components use CSS custom properties from the tokens package.

**Option 1: Automatic (if using workspace)**
```javascript
// Tokens are a peer dependency, automatically available
import { Button } from '@equaltoai/greater-components/primitives';
```

**Option 2: Explicit (if needed)**
```javascript
import '@equaltoai/greater-components/tokens/theme.css';
import { Button } from '@equaltoai/greater-components/primitives';
```

## Version

Use **1.0.8 or later**. Earlier versions had build issues.

```bash
npm install @equaltoai/greater-components@^1.0.8
```

Or in workspace:
```json
{
  "dependencies": {
    "@equaltoai/greater-components": "workspace:*"
  }
}
```

## What If Styles Don't Apply?

**Check 1: Runes enabled**
```javascript
// astro.config.mjs
svelte({ compilerOptions: { runes: true } })
```

**Check 2: Svelte version**
```bash
pnpm ls svelte  # Must be 5.36+
```

**Check 3: Clear cache**
```bash
rm -rf .astro node_modules/.vite
pnpm dev
```

## External Users (Not You)

If someone outside Lesser/Greater tries to use these components:

**They must:**
- Have Svelte 5.36+ with runes
- Compile from source
- Accept our conventions

**We provide NO:**
- Pre-compiled bundles
- Unscoped global CSS
- Support for non-Svelte tools

Greater Components are **internal** to Lesser/Greater ecosystem.

## Summary

```javascript
// That's the whole setup
import { Button, TextField, Modal } from '@equaltoai/greater-components/primitives';
```

No CSS imports. No extra config. Just works.

