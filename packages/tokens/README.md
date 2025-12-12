# @equaltoai/greater-components-tokens

Design tokens for Greater Components - the foundational layer providing CSS custom properties, JavaScript exports, and SCSS variables for theming.

## Installation

```bash
pnpm add @equaltoai/greater-components-tokens
```

## Usage

### CSS Custom Properties

Import the theme CSS in your root layout:

```svelte
<script>
	import '@equaltoai/greater-components-tokens/theme.css';
</script>
```

This provides all CSS custom properties with automatic theme support.

### JavaScript/TypeScript

```typescript
import { tokens, themes, getCSSVar, getColor } from '@equaltoai/greater-components-tokens';

// Access raw token values
const primaryColor = tokens.color.primary['600'].value; // '#2563eb'

// Get CSS variable references
const cssVar = getCSSVar('color-primary-600'); // 'var(--gr-color-primary-600)'
const colorVar = getColor('primary.600'); // 'var(--gr-color-primary-600)'
```

### SCSS Variables

```scss
@use '@equaltoai/greater-components-tokens/scss' as tokens;

.my-component {
	color: tokens.$gr-color-primary-600;
	padding: tokens.$gr-spacing-scale-4;
}
```

## Runtime Theme Switching

The token system supports runtime theme switching via the `data-theme` attribute on the root element:

```html
<!-- Light theme (default) -->
<html data-theme="light">
	<!-- Dark theme -->
	<html data-theme="dark">
		<!-- High contrast theme -->
		<html data-theme="highContrast">
			<!-- or -->
			<html data-theme="high-contrast"></html>
		</html>
	</html>
</html>
```

### Programmatic Theme Switching

```typescript
// Switch to dark theme
document.documentElement.dataset.theme = 'dark';

// Switch to light theme
document.documentElement.dataset.theme = 'light';

// Switch to high contrast
document.documentElement.dataset.theme = 'highContrast';

// Remove theme (uses system preference)
delete document.documentElement.dataset.theme;
```

### System Preference Support

When no `data-theme` attribute is set, the system automatically respects user preferences:

```css
/* Automatically applied when prefers-color-scheme: dark */
@media (prefers-color-scheme: dark) {
	:root:not([data-theme]) {
		/* Dark theme tokens applied */
	}
}

/* Automatically applied when prefers-contrast: high */
@media (prefers-contrast: high) {
	:root:not([data-theme]) {
		/* High contrast tokens applied */
	}
}
```

## Token Categories

| Category   | CSS Variable Prefix    | Description                                                  |
| ---------- | ---------------------- | ------------------------------------------------------------ |
| Colors     | `--gr-color-*`         | Color palette (primary, gray, success, warning, error, info) |
| Typography | `--gr-typography-*`    | Font families, sizes, weights, line heights                  |
| Spacing    | `--gr-spacing-scale-*` | Spacing scale (0-32)                                         |
| Radii      | `--gr-radii-*`         | Border radius values                                         |
| Shadows    | `--gr-shadows-*`       | Box shadow definitions                                       |
| Motion     | `--gr-motion-*`        | Animation durations and easings                              |
| Semantic   | `--gr-semantic-*`      | Context-aware colors (background, foreground, action)        |

## Accessibility

All color combinations are verified to meet WCAG AA contrast requirements:

- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3.0:1 minimum contrast ratio
- UI components: 3.0:1 minimum contrast ratio

The high contrast theme exceeds WCAG AAA requirements with maximum contrast ratios.

## File Structure

```
dist/
├── css/
│   ├── tokens.css      # Base tokens only
│   ├── theme.css       # Combined tokens + themes
│   └── themes/
│       ├── light.css
│       ├── dark.css
│       └── highContrast.css
├── scss/
│   ├── _index.scss     # SCSS entry point
│   ├── _tokens.scss    # Base token variables
│   ├── _light.scss     # Light theme variables
│   ├── _dark.scss      # Dark theme variables
│   └── _highContrast.scss
├── index.js            # ESM JavaScript exports
├── index.d.ts          # TypeScript definitions
└── theme.css           # Main CSS entry point
```

## License

AGPL-3.0-only
