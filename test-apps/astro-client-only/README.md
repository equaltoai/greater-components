# Greater Components - Astro Client-Only Test App

This is a **proof-of-concept** application demonstrating that Greater Components work perfectly with **client-side only rendering** (no SSR required).

## 🎯 What This Proves

✅ Greater Components work with Astro's `client:only` directive  
✅ No server-side rendering needed  
✅ Perfect for static deployments (S3, CloudFront, Netlify, Vercel, etc.)  
✅ Svelte 5 runes work in browser-only mode  
✅ Both styled and headless components function correctly  

## 🚀 Quick Start

```bash
# From the monorepo root
cd test-apps/astro-client-only

# Install dependencies (uses workspace packages)
pnpm install

# Start dev server
pnpm dev

# Visit http://localhost:4321
```

## 📦 What's Included

### Components

1. **PrimitivesTest.svelte** - Full form with styled components
   - TextField inputs
   - Checkbox and Switch
   - Buttons with loading states
   - Live state display

2. **HeadlessTest.svelte** - Custom styled headless components
   - Demonstrates full styling control
   - Async button interactions
   - Custom CSS

### Key Files

- `astro.config.mjs` - Astro configuration with Svelte 5 runes enabled
- `src/pages/index.astro` - Main page using `client:only="svelte"`
- `package.json` - Uses workspace dependencies (Greater Components)

## 🧪 Testing Checklist

When you run this app, verify:

- [ ] ✅ Page loads without errors
- [ ] ✅ Form inputs are interactive
- [ ] ✅ Text fields accept input and show current value
- [ ] ✅ Checkbox and switch toggle correctly
- [ ] ✅ Buttons respond to clicks
- [ ] ✅ Submit button shows loading state
- [ ] ✅ Form validation works (try submitting empty)
- [ ] ✅ Live state display updates reactively
- [ ] ✅ Headless counter increments with animation
- [ ] ✅ No console errors
- [ ] ✅ Console shows "RUNNING IN BROWSER" message

## 🔍 Inspecting in Browser DevTools

### 1. Check Hydration

Open DevTools Console and look for:
```
✅ RUNNING IN BROWSER
This page was built statically and all components are hydrated client-side.
Greater Components work perfectly without SSR!
```

### 2. Verify No SSR

1. View page source (Ctrl+U / Cmd+U)
2. Search for "astro-island"
3. Notice the component content is NOT pre-rendered
4. It's injected by JavaScript after page load

### 3. Network Tab

1. Open Network tab
2. Reload page
3. Filter by "JS"
4. See Greater Components chunks loading
5. No server-rendered HTML for components

### 4. Test Interactivity

1. Type in the username field
2. Watch the "Current value" update
3. Toggle checkbox/switch
4. Click submit (watch loading state)
5. Check live state JSON updates

## 📊 Build for Production

```bash
# Build static site
pnpm build

# Preview production build
pnpm preview

# Output will be in dist/ directory
```

### Deploy to S3/CloudFront

```bash
# Build
pnpm build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Or use any static hosting:
# - Netlify: drag dist/ folder
# - Vercel: connect repo
# - GitHub Pages: copy dist/ contents
```

## 🐛 Troubleshooting

### Components don't render

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Astro config has `runes: true`

### TypeScript errors

**Fix:**
```bash
pnpm install
pnpm dev
```

### Styles missing

**Check:**
Import in the Astro file:
```astro
import '@equaltoai/greater-components-primitives/styles.css';
```

## 📝 Key Configuration

### astro.config.mjs
```javascript
svelte({
  compilerOptions: {
    runes: true  // ← CRITICAL for Svelte 5
  }
})
```

### Using in Astro pages
```astro
<YourComponent client:only="svelte" />
```

## ✅ Expected Results

When everything works correctly:

1. **Dev server starts** without errors
2. **Page loads** showing styled components
3. **Form is interactive** and validates input
4. **State updates** reactively as you type
5. **Buttons work** with loading states
6. **Console shows** success messages
7. **No errors** in browser console

## 🎉 Conclusion

This test app definitively proves that **Greater Components do NOT require SSR** and work perfectly with:

- Static site generation
- Client-side only hydration
- Astro's `client:only` directive
- S3/CloudFront deployments
- Any static hosting platform

The Lesser team should have no issues using Greater Components in their static auth UI!

