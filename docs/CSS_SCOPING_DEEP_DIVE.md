# Deep Dive: CSS Scoping in Svelte Component Libraries

**Date:** October 31, 2025  
**Problem:** Greater Components CSS doesn't apply when used with Astro `client:only`  
**Root Cause:** Svelte scoping hash mismatch between build-time and runtime  

---

## The Problem Explained

### What We Expected
```html
<!-- Component renders with classes -->
<button class="gr-button gr-button--solid gr-button--md">Submit</button>
```

```css
/* CSS applies to those classes */
.gr-button { display: inline-flex; }
.gr-button--solid { background: blue; }
```

### What Actually Happens

**In our pre-built dist/style.css:**
```css
.gr-button.svelte-bjj3du { display: inline-flex; }
.gr-button--solid.svelte-bjj3du { background: blue; }
```

**In the browser (Astro compiles from source):**
```html
<button class="gr-button gr-button--solid gr-button--md svelte-ABC123">
  <!-- Different hash! svelte-ABC123 vs svelte-bjj3du -->
</button>
```

**Result:** CSS selectors don't match → no styles applied

---

## Why This Happens

### Svelte's CSS Scoping Mechanism

From Svelte docs (svelte.dev/docs/svelte/scoped-styles):

1. **At compile time**, Svelte:
   - Hashes the component's CSS content
   - Generates a unique class (e.g., `svelte-bjj3du`)
   - Appends this class to all elements
   - Appends this class to all CSS selectors

2. **The hash is deterministic** based on:
   - The CSS content
   - The component structure
   - The Svelte compiler version

3. **The problem with library builds:**
   - We compile components → hash `svelte-bjj3du`
   - Astro re-compiles from source → hash `svelte-ABC123`
   - **Different hashes = no match**

---

## Why `:global` Didn't Work

We tried wrapping styles in `:global { }`:

```svelte
<style>
  :global {
    .gr-button { ... }
  }
</style>
```

**This doesn't work in library mode because:**

1. Vite lib mode still processes Svelte files through Svelte compiler
2. Svelte compiler IGNORES `:global` wrapper in lib builds
3. It only prevents scoping in app builds, not library builds
4. This is likely a vite-plugin-svelte limitation

---

## Attempted Solutions (All Failed)

### ❌ Attempt 1: `:global()` individual selectors
- Too verbose, missed some selectors
- Still got scoped in lib build

### ❌ Attempt 2: `:global { }` wrapper block
- Svelte compiler ignored it in lib mode
- CSS still scoped

### ❌ Attempt 3: `css: 'external'` in Vite config
- Didn't prevent scoping
- Just changed how CSS was emitted

### ❌ Attempt 4: `emitCss: false`
- Prevented CSS emission entirely
- Had to extract from JS (messy)

### ❌ Attempt 5: Post-process CSS to remove hashes
- Fragile, breaks with Svelte updates
- Not sustainable

---

## The Correct Solution (Industry Standard)

Based on how successful Svelte libraries work:

### Option A: Export Source Files (Recommended)

**Let consuming apps compile the components**

```json
// package.json
{
  "exports": {
    ".": {
      "svelte": "./src/index.ts",  // ← Source files!
      "import": "./dist/index.js"   // ← Fallback
    }
  }
}
```

**How it works:**
1. Astro sees `"svelte"` export condition
2. Imports from `./src/index.ts` (source)
3. Compiles it with ITS Svelte compiler
4. Scoping hash matches runtime
5. ✅ Styles apply!

**Benefits:**
- Hash consistency guaranteed
- Astro can apply its own optimizations  
- Tree-shaking at source level
- Always fresh compilation

**Drawbacks:**
- Requires consuming app to have Svelte compiler
- Slightly slower builds (compile on use)
- Source files must be included in package

### Option B: Truly Unscoped CSS

**Use a CSS processing step to create unscoped stylesheet**

Current approach attempts this but the execution is wrong. The proper way:

1. Build components with Svelte (gets scoped CSS)
2. Extract the scoped CSS from dist/style.css
3. **Programmatically remove ALL scope hashes**
4. Write unscoped CSS file
5. Document that users must import the CSS file separately

**Implementation:**
```javascript
// scripts/build-css.js
const scopedCSS = fs.readFileSync('dist/style.css', 'utf8');

// Remove .svelte-XXXXX from all selectors
let unscoped = scopedCSS.replace(/\.svelte-[a-z0-9]+/g, '');

// Remove :where(.svelte-XXXXX) patterns  
unscoped = unscoped.replace(/:where\(\.svelte-[a-z0-9]+\)/g, '');

// Fix keyframe names (they get scoped too)
unscoped = unscoped.replace(/@keyframes\s+svelte-[a-z0-9]+-([a-z-]+)/g, '@keyframes $1');
unscoped = unscoped.replace(/animation:\s*svelte-[a-z0-9]+-([a-z-]+)/g, 'animation: $1');

fs.writeFileSync('dist/style.unscoped.css', unscoped);
```

**Benefits:**
- Works with any bundler
- No recompilation needed
- Smaller bundle (pre-compiled JS)

**Drawbacks:**
- CSS and JS separate (must import both)
- No component-level isolation
- Global namespace pollution risk
- Fragile if Svelte changes hash format

---

## What Other Libraries Do

### Melt UI (Headless)
- Exports **source files only**
- No pre-compiled dist
- No CSS (headless)
- Consumers compile everything

### Skeleton UI
- **Separate CSS file** approach
- User imports: `skeleton/theme.css`
- Uses `:global` throughout
- Accepts global namespace pollution

### shadcn-svelte
- **Copy-paste approach**
- Components go into user's src/
- User's bundler compiles them
- No distribution problem

### Flowbite Svelte
- **Separate CSS bundle**
- Tailwind-based (utility classes)
- No scoping issues (Tailwind is global)

---

## Recommended Fix for Greater Components

### Hybrid Approach (Best of Both Worlds)

**1. Export source files as primary:**
```json
{
  "exports": {
    "./primitives": {
      "svelte": "./primitives/src/index.ts",  // Primary
      "import": "./primitives/dist/index.js"   // Fallback
    }
  }
}
```

**2. Also provide unscoped CSS:**
```json
{
  "exports": {
    "./primitives/style.css": "./primitives/dist/style.unscoped.css"
  }
}
```

**3. Update build process:**
- Vite builds components (scoped, for legacy consumers)
- Post-process CSS to create unscoped version
- Include src/ in published package

**4. Documentation:**
```javascript
// For Astro/Vite users (recommended)
import { Button } from '@equaltoai/greater-components/primitives';
// Compiles from source, no CSS import needed

// For legacy/other bundlers
import { Button } from '@equaltoai/greater-components/primitives';
import '@equaltoai/greater-components/primitives/style.css';
```

---

## Implementation Checklist

- [ ] Update package.json exports to prioritize `"svelte"` condition
- [ ] Ensure src/ directory is included in published files
- [ ] Fix build-css.js to properly remove ALL scope artifacts
- [ ] Test with Astro (source compilation)
- [ ] Test with Webpack/Rollup (pre-compiled fallback)
- [ ] Document both usage patterns
- [ ] Add integration tests

---

## Key Insights

1. **`:global` doesn't work in library builds** - It's an app-level feature
2. **Source distribution is the modern approach** - Let consumers compile
3. **CSS extraction is fragile** - Svelte's internal format can change
4. **Two paths are needed** - Modern (source) + legacy (compiled)
5. **This is poorly documented** - Cobbled together from community knowledge

---

## References

- Svelte Scoped Styles: https://svelte.dev/docs/svelte/scoped-styles
- @sveltejs/vite-plugin-svelte (check GitHub for lib mode docs)
- SvelteKit packaging: https://kit.svelte.dev/docs/packaging
- Community discussions on Svelte Discord #libraries channel

---

## Next Steps

1. Research @sveltejs/package (SvelteKit's official packaging tool)
2. Check if it handles this correctly
3. Consider switching from manual Vite config to svelte-package
4. Or implement hybrid approach above
5. Write comprehensive tests for both consumption modes

