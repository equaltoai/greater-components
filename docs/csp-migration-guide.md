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

### ThemeProvider Component

**What Changed:**
- Custom palette prop removed (required inline CSS variable injection)
- Arbitrary font string props removed
- New preset-based font props added
- All theming now uses CSS classes

**Before (v3.0.x):**
```svelte
<ThemeProvider 
  customPalette={{
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  }}
  headingFont="'Custom Font', sans-serif"
  bodyFont="'Another Font', sans-serif"
>
  <App />
</ThemeProvider>
```

**After (v3.1.0+):**
```svelte
<!-- Use preset values -->
<ThemeProvider 
  palette="slate"
  headingFontPreset="serif"
  bodyFontPreset="sans"
>
  <App />
</ThemeProvider>

<!-- For custom theming, use external CSS -->
<ThemeProvider class="my-custom-theme">
  <App />
</ThemeProvider>

<style>
  :global(.my-custom-theme) {
    --gr-color-primary: #6366f1;
    --gr-color-secondary: #8b5cf6;
    --gr-color-accent: #ec4899;
    --gr-typography-fontFamily-heading: 'Custom Font', sans-serif;
    --gr-typography-fontFamily-sans: 'Another Font', sans-serif;
  }
</style>
```

**Available Presets:**

Palette presets:
- `'slate'` - Cool gray tones
- `'stone'` - Warm gray tones
- `'neutral'` - Pure gray tones
- `'zinc'` - Blue-gray tones
- `'gray'` - Standard gray tones

Font presets:
- `'system'` - System UI fonts
- `'sans'` - Inter font family
- `'serif'` - Crimson Pro font family
- `'mono'` - JetBrains Mono font family

### Section Component

**What Changed:**
- Spacing prop now only accepts preset values (no arbitrary strings/numbers)
- Background prop now only accepts preset values (no arbitrary CSS)
- Inline style attributes are no longer emitted
- Custom values require external CSS classes

**Before (v3.0.x):**
```svelte
<Section spacing="7rem">Content</Section>
<Section spacing={customSpacing}>Content</Section>
<Section background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
  Content
</Section>
```

**After (v3.1.0+):**
```svelte
<!-- Use preset values -->
<Section spacing="xl">Content</Section>
<Section spacing="3xl">Content</Section>
<Section background="gradient" gradientDirection="to-bottom-right">
  Content
</Section>

<!-- For custom values, use external CSS -->
<Section class="custom-section">Content</Section>

<style>
  :global(.custom-section) {
    margin-top: 7rem;
    margin-bottom: 7rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
</style>
```

**Available Presets:**

Spacing presets:
- `'none'` - 0
- `'sm'` - 2rem
- `'md'` - 4rem (default)
- `'lg'` - 6rem
- `'xl'` - 8rem
- `'2xl'` - 10rem
- `'3xl'` - 12rem
- `'4xl'` - 16rem

Background presets:
- `'default'` - Transparent/inherit
- `'muted'` - Subtle secondary background
- `'accent'` - Primary color tinted background
- `'gradient'` - Gradient background (use with gradientDirection)

Gradient directions:
- `'to-top'`, `'to-bottom'`, `'to-left'`, `'to-right'`
- `'to-top-left'`, `'to-top-right'`, `'to-bottom-left'`, `'to-bottom-right'`

### Tooltip Component

**What Changed:**
- Positioning now uses CSS classes instead of inline pixel values
- Auto placement uses viewport heuristics to select placement class
- No more inline `style="position: absolute; top: Npx; left: Npx"`
- Tooltips are positioned relative to trigger, not viewport

**Before (v3.0.x):**
```svelte
<!-- Tooltip used inline styles for pixel-perfect positioning -->
<Tooltip content="Help text" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

**After (v3.1.0+):**
```svelte
<!-- Same API, but CSS-based positioning -->
<Tooltip content="Help text" placement="top">
  <Button>Hover me</Button>
</Tooltip>

<!-- Auto placement still works -->
<Tooltip content="Auto positioned" placement="auto">
  <Button>Hover me</Button>
</Tooltip>

<!-- For pixel-perfect positioning, use external CSS -->
<Tooltip content="Custom position" class="custom-tooltip">
  <Button>Hover me</Button>
</Tooltip>

<style>
  :global(.custom-tooltip) {
    /* Override default positioning */
    top: auto !important;
    bottom: auto !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(-120%) !important;
  }
</style>
```

**Positioning Constraints:**

The CSS-based positioning approach has some trade-offs:

| Feature                    | Previous (Inline Styles)        | Current (CSS Classes)           |
| -------------------------- | ------------------------------- | ------------------------------- |
| Pixel-perfect positioning  | ✅ Calculated per-pixel         | ❌ Relative to trigger          |
| Viewport edge handling     | ✅ Precise repositioning        | ⚠️ Class-based fallback         |
| CSP compliance             | ❌ Requires unsafe-inline       | ✅ Fully compliant              |
| Performance                | ⚠️ JS calculations on show      | ✅ Pure CSS positioning         |

For most use cases, the CSS-based positioning is sufficient. If you need pixel-perfect positioning, use external CSS.

### ThemeSwitcher Component

**What Changed:**
- Preview buttons now use preset color classes instead of inline styles
- `showAdvanced` prop removed (custom color pickers required inline styles)
- `showWorkbench` prop removed (dynamic color preview required inline styles)

**Before (v3.0.x):**
```svelte
<ThemeSwitcher showAdvanced showWorkbench />
```

**After (v3.1.0+):**
```svelte
<!-- Advanced features removed for CSP compliance -->
<ThemeSwitcher variant="full" showPreview />

<!-- For advanced theme customization, use external CSS with ThemeProvider -->
<ThemeProvider class="my-custom-theme">
  <ThemeSwitcher />
</ThemeProvider>
```

### Theme Tooling Components

**What Changed:**
- ThemeWorkbench, ColorHarmonyPicker, and ContrastChecker now use preset color classes
- These components are marked as development-only tools
- Dynamic color swatches use CSS custom properties set via classes

**Migration Notes:**
- These components are intended for design-time use, not production
- For production deployments with strict CSP, use predefined color palettes
- If you need dynamic color preview in production, consider a separate dev-tools package

## Migration Strategy

### Step 1: Audit Your Usage

Search your codebase for components that may be affected:

```bash
# Milestone 1 components
# Find Skeleton with custom sizing
grep -r "Skeleton.*width=" src/
grep -r "Skeleton.*height=" src/

# Find Text with line clamping
grep -r "Text.*lines=" src/

# Find Container with custom gutters
grep -r "Container.*gutter=" src/

# Milestone 2 components
# Find ThemeProvider with custom palette or fonts
grep -r "ThemeProvider.*customPalette" src/
grep -r "ThemeProvider.*headingFont=" src/
grep -r "ThemeProvider.*bodyFont=" src/

# Find Section with custom spacing or background
grep -r "Section.*spacing=" src/
grep -r "Section.*background=" src/

# Find ThemeSwitcher with advanced features
grep -r "ThemeSwitcher.*showAdvanced" src/
grep -r "ThemeSwitcher.*showWorkbench" src/
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

### Dynamic Theme Switching

**Before:**
```svelte
<script>
  let customColors = $state({
    primary: '#6366f1',
    secondary: '#8b5cf6'
  });
</script>

<ThemeProvider customPalette={customColors}>
  <App />
</ThemeProvider>
```

**After:**
```svelte
<script>
  // Define theme classes in your stylesheet
  let themeClass = $state('theme-indigo');
</script>

<ThemeProvider class={themeClass}>
  <App />
</ThemeProvider>

<style>
  :global(.theme-indigo) {
    --gr-color-primary: #6366f1;
    --gr-color-secondary: #8b5cf6;
  }
  :global(.theme-purple) {
    --gr-color-primary: #8b5cf6;
    --gr-color-secondary: #a855f7;
  }
</style>
```

### Responsive Section Spacing

**Before:**
```svelte
<script>
  let spacing = $state(isMobile ? '2rem' : '6rem');
</script>

<Section spacing={spacing}>Content</Section>
```

**After:**
```svelte
<script>
  let spacingPreset = $state(isMobile ? 'sm' : 'lg');
</script>

<Section spacing={spacingPreset}>Content</Section>
```

### Custom Section Backgrounds

**Before:**
```svelte
<Section background="linear-gradient(to right, #667eea, #764ba2)">
  Hero content
</Section>
```

**After:**
```svelte
<Section class="hero-gradient">
  Hero content
</Section>

<style>
  :global(.hero-gradient) {
    background: linear-gradient(to right, #667eea, #764ba2);
  }
</style>
```

## TypeScript Support

All preset types are exported for type safety:

```typescript
import type { 
  // Milestone 1 types
  WidthPreset, 
  HeightPreset, 
  GutterPreset,
  // Milestone 2 types
  PalettePreset,
  FontPreset,
  SpacingPreset,
  BackgroundPreset,
  GradientDirection,
  Placement
} from '@equaltoai/greater-components-primitives';

// Type-safe preset values
const width: WidthPreset = '1/2';
const height: HeightPreset = 'lg';
const gutter: GutterPreset = 'md';

// Theme presets
const palette: PalettePreset = 'slate';
const headingFont: FontPreset = 'serif';
const bodyFont: FontPreset = 'sans';

// Section presets
const spacing: SpacingPreset = 'xl';
const background: BackgroundPreset = 'gradient';
const direction: GradientDirection = 'to-bottom-right';

// Tooltip placement
const placement: Placement = 'auto';
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
