# Greater Components + Astro `client:only` - Complete Setup Guide

**Version:** 1.0.6+  
**Status:** ✅ Fully Supported  

---

## ✅ Confirmed Working

Greater Components **fully support** client-only rendering with Astro. No SSR required.

- ✅ Works with `client:only="svelte"`
- ✅ Perfect for static deployments (S3, CloudFront, Netlify, etc.)
- ✅ All components hydrate and function correctly
- ✅ Svelte 5 runes work in browser-only mode

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components@^1.0.6
```

**Minimum versions:**
- `astro@^5.14.0`
- `@astrojs/svelte@^7.1.0`  
- `svelte@^5.36.0`

---

## ⚙️ Configuration

### 1. `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  output: 'static',
  
  integrations: [
    svelte({
      compilerOptions: {
        runes: true  // ⚠️ REQUIRED for Svelte 5
      }
    })
  ],
  
  vite: {
    optimizeDeps: {
      exclude: ['@equaltoai/greater-components']  // Let Vite handle source compilation
    }
  }
});
```

### 2. Import CSS in your Astro pages

```astro
---
// Import BOTH CSS files for full styling
import '@equaltoai/greater-components/tokens/theme.css';    // Design tokens
import '@equaltoai/greater-components/primitives/style.css'; // Component styles
---

<YourComponent client:only="svelte" />
```

**Important:** Use `style.css` (singular) for full component styles. The file `styles.css` (plural) contains only reset/base styles.

---

## 📝 Complete Example

### Passwordless Login Component

```svelte
<!-- src/components/PasswordlessLogin.svelte -->
<script lang="ts">
  import { Button, TextField } from '@equaltoai/greater-components/primitives';
  
  let username = $state('');
  let isLoading = $state(false);
  
  async function loginWithWebAuthn() {
    isLoading = true;
    try {
      // Your WebAuthn logic here
      await navigator.credentials.get({ /* ... */ });
    } finally {
      isLoading = false;
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); loginWithWebAuthn(); }}>
  <TextField
    id="username"
    type="text"
    label="Username"
    bind:value={username}
    placeholder="Enter your username"
    disabled={isLoading}
    autocomplete="username webauthn"
    required
  />
  
  <Button
    type="submit"
    variant="solid"
    disabled={!username || isLoading}
    loading={isLoading}
  >
    Sign in with Passkey
  </Button>
</form>
```

### Astro Page

```astro
---
// src/pages/login.astro
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';
import PasswordlessLogin from '../components/PasswordlessLogin.svelte';

const authRequest = Astro.url.searchParams.get('auth_request');
const returnTo = Astro.url.searchParams.get('return_to');
---

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Sign In</title>
  </head>
  <body>
    <PasswordlessLogin 
      client:only="svelte"
      authRequest={authRequest}
      returnTo={returnTo}
    />
  </body>
</html>
```

---

## 🧪 Verification

After setup, verify everything works:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check browser console - should see:**
   - ✅ No hydration errors
   - ✅ No "Cannot read properties of undefined" errors
   - ✅ Components render with full styling

3. **Verify CSS loaded:**
   - Open DevTools → Network tab
   - Look for:
     - `theme.css` → [200] OK
     - `style.css` → [200] OK

4. **Test interactivity:**
   - Type in inputs → values should update
   - Click buttons → should respond
   - Form validation → should work

---

## 🐛 Troubleshooting

### Components render but aren't styled

**Problem:** Forgot to import CSS or using wrong file

**Fix:**
```astro
import '@equaltoai/greater-components/tokens/theme.css';
import '@equaltoai/greater-components/primitives/style.css';  // ← singular, not styles.css
```

### Hydration error on load

**Problem:** Missing `runes: true` in Svelte config

**Fix:** Add to `astro.config.mjs`:
```javascript
svelte({
  compilerOptions: {
    runes: true
  }
})
```

### "Module not found" errors

**Problem:** Using v1.0.4 or earlier (had build issues)

**Fix:**
```bash
npm install @equaltoai/greater-components@latest
```

### Styles partially applying

**Problem:** CSS custom properties not loading

**Fix:** Make sure `theme.css` is imported BEFORE `style.css`:
```javascript
import '@equaltoai/greater-components/tokens/theme.css';  // First!
import '@equaltoai/greater-components/primitives/style.css';  // Second
```

---

## ✅ Success Checklist

- [ ] Astro 5.14+ installed
- [ ] Svelte 5.36+ installed
- [ ] @astrojs/svelte 7.1+ installed
- [ ] `runes: true` in astro.config.mjs
- [ ] Both CSS files imported
- [ ] Using `client:only="svelte"`
- [ ] Components render with styling
- [ ] No console errors
- [ ] Forms are interactive

---

## 📊 What's Included in v1.0.6

✅ **Client-only rendering fix** - Externalized Svelte modules  
✅ **CSS export fix** - Added `./style.css` export  
✅ **Source exports** - Astro/Vite compiles from source for proper scoping  
✅ **Tested** - Verified working in production-like setup  

---

## 🚀 Deploy to S3/CloudFront

```bash
# Build static site
npm run build

# Output is in dist/ directory
# Upload to S3
aws s3 sync dist/ s3://your-bucket/

# Or use any static host:
# - Netlify: drag dist/ folder
# - Vercel: connect repo
# - CloudFront: point to S3 bucket
```

---

## 📞 Still Having Issues?

If problems persist after following this guide:

1. **Clear all caches:**
   ```bash
   rm -rf .astro node_modules/.vite node_modules
   npm install
   npm run dev
   ```

2. **Share with us:**
   - Your exact package versions (`npm ls`)
   - Full `astro.config.mjs`
   - Console error messages
   - Screenshot of unstyled components

3. **Open an issue:**
   - GitHub: https://github.com/equaltoai/greater-components/issues
   - Include "Astro client:only" in the title

---

**Bottom line:** v1.0.6 works perfectly with Astro `client:only`. Follow this guide and you'll have fully functional, styled components in your static deployment! 🎉

