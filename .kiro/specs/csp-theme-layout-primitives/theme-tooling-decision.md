# Theme Tooling CSP Approach Decision

## Decision: Option B - Preset-Based Redesign

### Date: January 5, 2026

## Context

The Theme Tooling components (ThemeWorkbench, ColorHarmonyPicker, ContrastChecker) currently use inline styles for dynamic color visualization. This violates strict CSP requirements.

## Options Evaluated

### Option A: Separate Dev-Tools Package

- Extract components to `@equaltoai/greater-components-dev-tools`
- Not included in production builds
- Maintains full dynamic color functionality
- **Pros**: Full functionality preserved, clear separation
- **Cons**: Additional package maintenance, build complexity, users need separate install

### Option B: Preset-Based Redesign (Selected)

- Replace inline styles with CSS custom properties and preset classes
- Use CSS variables set by ThemeProvider for color visualization
- Limit to showing colors from the current theme's palette
- **Pros**: Single package, CSP-compliant, simpler maintenance
- **Cons**: Reduced flexibility (can't preview arbitrary colors)

### Option C: Keep with CSP Warning

- Keep current implementation with documentation warning
- Exclude from CSP audit
- **Pros**: No code changes needed
- **Cons**: Inconsistent CSP compliance, confusing for users

## Rationale for Option B

1. **Consistency**: All primitives should be CSP-compliant without exceptions
2. **Simplicity**: No additional package to maintain
3. **Sufficient Functionality**: Theme tooling can still visualize the current theme's colors using CSS custom properties
4. **User Experience**: Components work in strict CSP environments without special configuration

## Implementation Approach

### ThemeWorkbench

- Remove inline `style="background-color: {color}"` from swatches
- Use CSS classes that reference `--gr-color-primary-{scale}` variables
- Remove inline `style="height: 1rem"` spacers, use CSS classes

### ColorHarmonyPicker

- Remove inline `style="background-color: {color}"` from swatches
- Use preset harmony classes that reference theme CSS variables
- Display harmony colors using CSS custom properties set by parent

### ContrastChecker

- Remove inline `style="color: {foreground}; background-color: {background}"` from preview
- Use preset contrast preview classes
- Show contrast for predefined color combinations from the theme

### CSS Classes to Add

- `.gr-swatch--primary-{50-900}` - Primary color scale swatches
- `.gr-swatch--harmony-{0-5}` - Harmony color swatches
- `.gr-contrast-preview--{preset}` - Contrast preview combinations

## Trade-offs Accepted

1. Cannot preview arbitrary hex colors (must use theme presets)
2. Color harmony visualization limited to current theme colors
3. Contrast checker limited to predefined combinations

## Migration Path

Users who need arbitrary color preview functionality should:

1. Use browser dev tools for color experimentation
2. Create custom CSS with their desired colors
3. Use external color tools for palette generation
