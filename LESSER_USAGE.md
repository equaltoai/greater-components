# Using Greater Components in Lesser

## How It Works

Lesser/Greater compile Greater Components **from source** (not pre-built).

**What this means:**
- Components are TypeScript/Svelte source files
- Your bundler (Vite/Astro) compiles them when you build
- CSS is automatically scoped correctly
- No separate CSS imports needed

## Usage in Lesser

### Standard Import (Recommended)

```javascript
import { Button, TextField } from '@equaltoai/greater-components/primitives';
```

That's it. CSS is embedded in the components and compiled with your app.

### Astro Config Required

```javascript
// astro.config.mjs
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

## Build Process

1. **Greater Components builds** → Generates types in `dist/`, keeps source in `src/`
2. **Lesser imports** → From `src/` (source files)
3. **Lesser builds** → Compiles Greater Components with its own Svelte compiler
4. **Result** → Properly scoped CSS, everything works

## What's in the Package

```
@equaltoai/greater-components/
├── primitives/
│   ├── src/           ← Lesser imports from here
│   │   ├── components/
│   │   │   ├── Button.svelte
│   │   │   ├── TextField.svelte
│   │   │   └── ...
│   │   └── index.ts
│   └── dist/          ← Types only
│       └── *.d.ts
```

## Why This Approach

**Problem with pre-compiled components:**
- Svelte adds scoping hashes at compile time
- Pre-compiled hash: `svelte-AAAA`
- Runtime hash (Lesser compiles): `svelte-BBBB`
- **Mismatch → CSS doesn't apply**

**Solution (source compilation):**
- Lesser compiles from source
- Single compilation = single hash
- ✅ CSS matches HTML perfectly

## External Users (Not Supported)

If someone outside Lesser/Greater wants to use these:

**They must:**
- Compile from Svelte source files
- Have Svelte 5+ with runes enabled
- Accept our architecture conventions

**We don't provide:**
- Pre-compiled standalone bundles
- Unscoped global CSS
- Support for non-Svelte bundlers

Greater Components are **internal tools** for the Lesser/Greater ecosystem.

## Troubleshooting

### Components render but no styles

**Check:**
```javascript
// astro.config.mjs
svelte({
  compilerOptions: {
    runes: true  // ← Must be present
  }
})
```

### Import errors

**Make sure:**
- Using Svelte 5.36+
- TypeScript 5.5+
- Vite/Astro can resolve `.svelte` files

### Build errors

**Verify:**
```bash
pnpm ls svelte  # Should show single version 5.x
```

## That's It

No CSS imports, no config fussing. Just import and use. The build system handles everything.

