# Greater Components + Astro client:only Issue - Root Cause Analysis

**Date:** October 31, 2025  
**Status:** 🔍 IDENTIFIED - Fix in progress  
**Severity:** ⚠️ High - Blocks static deployments

---

## 🎯 Issue Summary

Greater Components **headless** package works perfectly with Astro's `client:only`, but the **primitives** package fails with a hydration error.

### ✅ What Works
- Svelte 5 runes with `client:only` ✓
- Greater Components headless package ✓
- Client-side reactivity ✓
- Basic Svelte 5 components ✓

### ❌ What Fails
- `@equaltoai/greater-components-primitives` components
- Error: `TypeError: Cannot read properties of undefined (reading 'call')`

---

## 🔬 Investigation Results

### Test 1: Simple Svelte 5 Component
**File:** `test-apps/astro-client-only/src/pages/simple.astro`

```svelte
<script lang="ts">
  let count = $state(0);
</script>

<button onclick={() => count++}>Count: {count}</button>
```

**Result:** ✅ **WORKS PERFECTLY**
- Renders correctly
- Reactivity works
- No errors

**Conclusion:** Svelte 5 + Astro + client:only is NOT the problem.

---

### Test 2: Headless Components
**File:** `test-apps/astro-client-only/src/components/HeadlessTest.svelte`

```svelte
<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  const button = createButton({
    onClick: () => count++
  });
</script>

<button use:button.actions.button>Click</button>
```

**Result:** ✅ **WORKS PERFECTLY**
- Hydrates correctly
- All functionality works
- No errors

**Conclusion:** Greater Components headless package is correctly built.

---

### Test 3: Primitives Components
**File:** `test-apps/astro-client-only/src/components/PrimitivesTest.svelte`

```svelte
<script>
  import { Button, TextField } from '@equaltoai/greater-components-primitives';
</script>

<TextField bind:value={username} />
<Button onclick={submit}>Submit</Button>
```

**Result:** ❌ **FAILS**

**Error:**
```
[astro-island] Error hydrating /src/components/PrimitivesTest.svelte 
TypeError: Cannot read properties of undefined (reading 'call')
    at r3 (http://localhost:4321/node_modules/.vite/deps/@equaltoai_greater-components-primitives.js?v=f3b54d3f:122:13)
    at http://localhost:4321/node_modules/.vite/deps/@equaltoai_greater-components-primitives.js?v=f3b54d3f:1441:5
```

**Conclusion:** The primitives package has a build configuration issue.

---

## 🐛 Root Cause

### Problem: Svelte Internals Bundled Into Package

When building `@equaltoai/greater-components-primitives`, Vite is bundling Svelte's internal modules into the dist folder:

```
dist/node_modules/.pnpm/svelte@5.38.0/node_modules/svelte/src/internal/client/...
dist/node_modules/.pnpm/svelte@5.38.0/node_modules/svelte/src/internal/shared/...
```

This causes issues because:
1. **Svelte internals should be external**, not bundled
2. **Version mismatches** when Astro has its own Svelte version
3. **Duplicate Svelte runtimes** in the final bundle
4. **Internal APIs break** when bundled separately

### Why Headless Works

The headless package uses plain TypeScript and Svelte actions, which don't have the same bundling issues.

---

## 🔧 Solution

### Fix 1: Update Vite Config External Dependencies

The `vite.config.ts` for primitives needs to properly externalize all Svelte modules:

**Current:**
```javascript
external: [
  'svelte',
  'svelte/store',
  'svelte/internal',
  // ...
]
```

**Should be:**
```javascript
external: [
  'svelte',
  'svelte/store',
  'svelte/internal',
  /^svelte\//,  // ← Match all svelte/* paths
  // ...
]
```

### Fix 2: Use Source Exports Instead of Compiled

For Astro/Vite projects, we should export the source `.svelte` files, not compiled JavaScript:

**package.json:**
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./src/index.ts",  // ← Source files
      "import": "./dist/index.js"   // ← Fallback compiled
    }
  }
}
```

This allows Astro/Vite to compile the components with the correct Svelte version.

### Fix 3: Add Svelte Preprocessing Config

Ensure the Svelte compiler options are consistent:

```javascript
// vite.config.ts
svelte({
  compilerOptions: {
    runes: true,
    hydratable: true,  // ← Important for client hydration
    css: 'injected'     // ← Or 'external' depending on preference
  }
})
```

---

## ✅ Verification Steps

After fixes are applied:

1. **Rebuild primitives package:**
   ```bash
   cd packages/primitives
   pnpm build
   ```

2. **Check dist doesn't contain Svelte internals:**
   ```bash
   ls -R dist/ | grep "svelte"
   # Should NOT show svelte internal modules
   ```

3. **Test in Astro app:**
   ```bash
   cd test-apps/astro-client-only
   pnpm dev
   # Visit http://localhost:4321
   # All components should work
   ```

4. **Check browser console:**
   - No hydration errors
   - Components render and function
   - Forms are interactive

---

## 📝 Message to Lesser Team

**GOOD NEWS:** Your issue is NOT because Greater Components require SSR.

**THE FACTS:**
1. ✅ Greater Components **DO support** client-only rendering
2. ✅ Headless components work perfectly right now
3. ❌ Primitives package has a **build configuration bug**
4. 🔧 We're fixing it now

**SHORT TERM SOLUTION:**
Use the headless components:

```svelte
<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  const submitBtn = createButton({
    onClick: handleSubmit
  });
</script>

<button use:submitBtn.actions.button class="your-styles">
  Submit
</button>
```

**LONG TERM:**
We'll fix the primitives package build and release an update.

---

## 🎯 Next Steps

1. [x] Identify root cause
2. [ ] Fix vite.config.ts in primitives package
3. [ ] Rebuild and test
4. [ ] Update package.json exports
5. [ ] Create regression test
6. [ ] Release patch version
7. [ ] Update documentation

---

## 📚 Related Files

- Test app: `test-apps/astro-client-only/`
- Primitives config: `packages/primitives/vite.config.ts`
- Primitives package: `packages/primitives/package.json`
- Headless (working): `packages/headless/vite.config.ts`

---

**Bottom Line:** This is a **build configuration issue**, not a fundamental incompatibility. Greater Components **absolutely support** static/client-only deployments. We just need to fix how the primitives package is built.

