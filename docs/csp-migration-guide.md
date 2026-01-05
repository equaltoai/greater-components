# CSP Compatibility Migration Guide

This guide helps you migrate from pre-CSP versions of Greater Components to the CSP-compatible versions introduced in v3.1.0.

## Overview

Greater Components v3.1.0 introduces strict Content Security Policy (CSP) compatibility for core primitive components. This ensures components work in environments where `'unsafe-inline'` is not allowed in `style-src` directives, such as Lesser deployments with CloudFront CSP headers.

## Breaking Changes

### Skeleton Component

**What Changed:**
- Width and height props now only accept preset values (no arbitrary strings/numbers)
- Inline style attributes are no longer emitted
- Custom sizing requires external CSS classes

**Before (v3.0.x):**
```svelte
<Skeleton width="250px" height="80px" />
<Skeleton width={customWidth} height={customHeight} />
```

**After (v3.1.0+):**
```svelte
<!-- Use preset values -->
<Skeleton width="1/2" height="lg" />
<Skeleton width="full" height="xl" />

<!-- For custom sizes, use external CSS -->
<Skeleton class="custom-skeleton" />

<style>
  :global(.custom-skeleton) {
    width: 250px;
    height: 80px;
  }
</style>
```

**Available Presets:**

Width presets:
- `'full'` - 100%
- `'1/2'` - 50%
- `'1/3'` - 33.333%
- `'2/3'` - 66.667%
- `'1/4'` - 25%
- `'3/4'` - 75%
- `'content'` - fit-content
- `'auto'` - auto

Height presets:
- `'xs'` - 1rem
- `'sm'` - 1.5rem
- `'md'` - 2rem
- `'lg'` - 3rem
- `'xl'` - 4rem
- `'2xl'` - 6rem

### Avatar Component

**What Changed:**
- Background colors now use deterministic hash-based color classes
- Image display controlled via CSS classes instead of inline styles
- Colors are consistent across sessions for the same name/label

**Before (v3.0.x):**
```svelte
<!-- Colors were randomly generated on each render -->
<Avatar name="Jane Doe" />
```

**After (v3.1.0+):**
```svelte
<!-- Same name always produces same color -->
<Avatar name="Jane Doe" />
<!-- Color is deterministic: gr-avatar--color-N where N is 0-11 -->
```

**Migration Notes:**
- No code changes required - the API is the same
- Colors are now deterministic (same input = same color)
- All 12 color classes meet WCAG AA contrast requirements
- If you were relying on random colors, you may need to adjust your design

### Text Component

**What Changed:**
- Line clamping now only supports 2-6 lines via preset classes
- No inline CSS variables for line counts
- Out-of-range line counts require external CSS

**Before (v3.0.x):**
```svelte
<Text truncate lines={10}>Long text...</Text>
<Text truncate lines={customLineCount}>Dynamic lines...</Text>
```

**After (v3.1.0+):**
```svelte
<!-- Supported range: 2-6 lines -->
<Text truncate lines={3}>Clamped to 3 lines...</Text>

<!-- For other line counts, use external CSS -->
<Text truncate class="clamp-10">Long text...</Text>

<style>
  :global(.clamp-10) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
</style>
```

**Supported Line Counts:**
- 2, 3, 4, 5, 6 (via `gr-text--clamp-N` classes)
- Single-line truncation still works with `truncate` prop alone

### Container Component

**What Changed:**
- Gutter prop now only accepts preset values
- Custom gutter values require external CSS
- No inline CSS variables for custom gutters

**Before (v3.0.x):**
```svelte
<Container gutter="2.5rem">Content</Container>
<Container gutter={customGutter}>Content</Container>
```

**After (v3.1.0+):**
```svelte
<!-- Use preset values -->
<Container gutter="lg">Content</Container>

<!-- For custom gutters, use external CSS -->
<Container class="custom-gutter">Content</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>
```

**Available Gutter Presets:**
- `'none'` - No padding
- `'sm'` - 0.75rem
- `'md'` - 1rem (default)
- `'lg'` - 1.5rem
- `'xl'` - 2rem

## Migration Strategy

### Step 1: Audit Your Usage

Search your codebase for components that may be affected:

```bash
# Find Skeleton with custom sizing
grep -r "Skeleton.*width=" src/
grep -r "Skeleton.*height=" src/

# Find Text with line clamping
grep -r "Text.*lines=" src/

# Find Container with custom gutters
grep -r "Container.*gutter=" src/
```

### Step 2: Update to Presets

For most use cases, you can replace custom values with presets:

```svelte
<!-- Before -->
<Skeleton width="200px" height="40px" />

<!-- After -->
<Skeleton width="1/2" height="md" />
```

### Step 3: Extract Custom Styles

For cases where presets don't fit, extract styles to CSS:

```svelte
<!-- Before -->
<Skeleton width="250px" height="80px" />

<!-- After -->
<Skeleton class="hero-skeleton" />

<style>
  :global(.hero-skeleton) {
    width: 250px;
    height: 80px;
  }
</style>
```

### Step 4: Test CSP Compliance

Verify your application works under strict CSP:

```html
<!-- Add to your HTML head for testing -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self'; script-src 'self'">
```

If components render correctly with this CSP header, you're good to go!

## Common Patterns

### Responsive Skeleton Sizing

**Before:**
```svelte
<script>
  let width = $state(isMobile ? '100%' : '50%');
</script>

<Skeleton width={width} />
```

**After:**
```svelte
<script>
  let widthClass = $state(isMobile ? 'full' : '1/2');
</script>

<Skeleton width={widthClass} />
```

### Dynamic Line Clamping

**Before:**
```svelte
<script>
  let lines = $state(expanded ? 10 : 3);
</script>

<Text truncate lines={lines}>Long text...</Text>
```

**After:**
```svelte
<script>
  let lines = $state(expanded ? 6 : 3); // Clamp to supported range
</script>

<Text truncate lines={lines}>Long text...</Text>

<!-- Or use conditional rendering for out-of-range values -->
{#if expanded}
  <Text class="clamp-10">Long text...</Text>
{:else}
  <Text truncate lines={3}>Long text...</Text>
{/if}

<style>
  :global(.clamp-10) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
</style>
```

### Custom Container Gutters

**Before:**
```svelte
<script>
  let gutter = $state('2.5rem');
</script>

<Container gutter={gutter}>Content</Container>
```

**After:**
```svelte
<script>
  let gutterClass = $state('custom-gutter-large');
</script>

<Container class={gutterClass}>Content</Container>

<style>
  :global(.custom-gutter-large) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>
```

## TypeScript Support

All preset types are exported for type safety:

```typescript
import type { 
  WidthPreset, 
  HeightPreset, 
  GutterPreset 
} from '@equaltoai/greater-components-primitives';

// Type-safe preset values
const width: WidthPreset = '1/2';
const height: HeightPreset = 'lg';
const gutter: GutterPreset = 'md';
```

## Benefits of CSP Compliance

After migration, your application will:

1. **Work in strict CSP environments** - Deploy to Lesser, CloudFront, and other platforms with strict CSP policies
2. **Improve security** - Eliminate inline styles that could be exploited
3. **Better performance** - Class-based styles are more efficient than inline styles
4. **Consistent styling** - Preset values ensure design system consistency
5. **Easier maintenance** - Centralized CSS is easier to update than scattered inline styles

## Need Help?

If you encounter issues during migration:

1. Check the [CSP Compatibility Guide](./csp-compatibility.md) for detailed technical information
2. Review the [component documentation](../packages/primitives/README.md) for API details
3. Open an issue on GitHub with your specific use case

## Rollback Plan

If you need to temporarily rollback to pre-CSP versions:

```bash
# Install previous version
pnpm add @equaltoai/greater-components-primitives@3.0.1
```

Note: We recommend migrating to CSP-compatible versions as soon as possible for security and compatibility benefits.
