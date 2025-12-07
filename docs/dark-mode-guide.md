# Dark Mode Implementation Guide

This guide covers the dark mode token system, theme-aware shadows, and smooth theme transitions in Greater Components.

## Semantic Background Tokens

Greater Components provides a layered background token system for proper elevation hierarchy:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--gr-semantic-background-base` | gray.50 | gray.950 | Page/app background |
| `--gr-semantic-background-surface` | white | gray.900 | Cards, modals |
| `--gr-semantic-background-raised` | white | gray.800 | Nested cards, dropdowns |
| `--gr-semantic-background-input` | white | gray.800 | Form inputs |
| `--gr-semantic-background-overlay` | rgba(0,0,0,0.5) | rgba(0,0,0,0.75) | Modal overlays |

## Theme-Aware Shadows

In dark mode, traditional drop shadows don't provide good elevation cues. Greater Components automatically switches between shadow types:

### Light Mode (Drop Shadows)
```css
--gr-shadows-elevation-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--gr-shadows-elevation-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--gr-shadows-elevation-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Dark Mode (Glow Shadows)
```css
--gr-shadows-elevation-sm: 0 0 4px 0 rgb(255 255 255 / 0.05);
--gr-shadows-elevation-md: 0 0 8px 0 rgb(255 255 255 / 0.07);
--gr-shadows-elevation-lg: 0 0 16px 0 rgb(255 255 255 / 0.1);
```

**Usage:**
```css
.my-card {
  box-shadow: var(--gr-shadows-elevation-md);
}
```

## Focus Ring System

Focus rings use `outline` instead of `box-shadow` to prevent conflicts with hover states:

```css
.my-element:focus-visible {
  outline: var(--gr-semantic-focus-ring-width, 2px) solid var(--gr-semantic-focus-ring);
  outline-offset: var(--gr-semantic-focus-ring-offset, 2px);
}
```

## Smooth Theme Transitions

### Using the Utility Class

Apply the `.gr-theme-transition` class to enable smooth color transitions:

```html
<body class="gr-theme-transition">
  <!-- Content will smoothly transition between themes -->
</body>
```

### Manual Implementation

```css
.my-component {
  transition: var(--gr-semantic-transition-theme);
}
```

### Recommended Approach

1. Apply `.gr-theme-transition` to your root element
2. Use semantic tokens instead of hardcoded colors
3. Use `--gr-shadows-elevation-*` for elevation shadows
4. Use `outline` for focus states, `box-shadow` for hover states

## Component Dark Mode Checklist

When creating components, ensure:

- [ ] Use semantic background tokens (`--gr-semantic-background-*`)
- [ ] Use semantic foreground tokens (`--gr-semantic-foreground-*`)
- [ ] Use theme-aware elevation shadows (`--gr-shadows-elevation-*`)
- [ ] Use `outline` for focus states
- [ ] Test hover states in both light and dark modes
- [ ] Verify contrast ratios meet WCAG requirements

## Examples

### Card with Proper Dark Mode Support

```css
.card {
  background-color: var(--gr-semantic-background-surface);
  border: 1px solid var(--gr-semantic-border-default);
  box-shadow: var(--gr-shadows-elevation-md);
}

.card:hover {
  box-shadow: var(--gr-shadows-elevation-lg);
}

/* Dark mode uses border glow instead of shadow */
[data-theme="dark"] .card:hover {
  box-shadow: none;
  border-color: var(--gr-semantic-border-strong);
}
```

### Input with Dark Mode Support

```css
.input {
  background-color: var(--gr-semantic-background-input);
  border: 1px solid var(--gr-semantic-border-default);
}

.input:focus {
  outline: var(--gr-semantic-focus-ring-width) solid var(--gr-semantic-focus-ring);
  outline-offset: 1px;
  border-color: var(--gr-semantic-action-primary-default);
}
```