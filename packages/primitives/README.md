# @equaltoai/greater-components-primitives

A collection of accessible, unstyled primitive UI components for Svelte 5, designed for the Greater Components system.

## Installation

```bash
pnpm add @equaltoai/greater-components-primitives
```

## Components

### Form Controls

- **Button**: Interactive button component.
- **Checkbox**: Boolean input control.
- **FileUpload**: File selection input.
- **Select**: Dropdown selection component.
- **Switch**: Toggle switch for boolean states.
- **TextArea**: Multi-line text input.
- **TextField**: Single-line text input.

### Layout & Typography

- **Card**: Container for grouping related content.
- **Container**: Centered layout container with max-width constraints and preset gutters.
- **Heading**: Semantic heading component (h1-h6).
- **Section**: Semantic section component with standard spacing.
- **Text**: Body text component with typography variants and bounded line clamping.

### Navigation & Overlay

- **Menu**: Dropdown menu component.
- **Modal**: Dialog/Overlay component.
- **Tabs**: Tabbed interface component.
- **Tooltip**: Popup information component.

### Data Display

- **Avatar**: User profile image/initials component with deterministic color classes.
- **Skeleton**: Loading placeholder state with preset-based sizing.

### Utilities

- **ThemeProvider**: Context provider for theme management.
- **ThemeSwitcher**: Component to toggle between light/dark/system themes.

## Usage

```svelte
<script>
	import { Button, Card, Text } from '@equaltoai/greater-components-primitives';
</script>

<Card>
	<Text>Hello World</Text>
	<Button onclick={() => alert('Clicked!')}>Click Me</Button>
</Card>
```

## Component Details

### Skeleton

Loading placeholder component with preset-based sizing for strict CSP compliance.

**Props:**
- `variant`: `'text' | 'circular' | 'rectangular' | 'rounded'` (default: `'text'`)
- `width`: `'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | 'content' | 'auto'`
- `height`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`
- `animation`: `'pulse' | 'wave' | 'none'` (default: `'pulse'`)
- `loading`: `boolean` (default: `true`)

**Example:**
```svelte
<Skeleton variant="text" width="full" height="md" />
<Skeleton variant="circular" width="auto" height="xl" />
<Skeleton variant="rectangular" width="1/2" height="lg" animation="wave" />
```

**CSP Compliance:**
- All sizing is class-based using preset values
- No inline styles are emitted
- For custom sizes, use the `class` prop with external CSS

### Avatar

User profile component with deterministic color classes for consistent identity visualization.

**Props:**
- `src`: Image URL
- `alt`: Image alt text
- `name`: User name (generates initials and color)
- `label`: Text label fallback (e.g., "You", "AI")
- `labelIcon`: Icon snippet fallback
- `fallbackMode`: `'initials' | 'label' | 'icon'` (default: `'initials'`)
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` (default: `'md'`)
- `shape`: `'circle' | 'square' | 'rounded'` (default: `'circle'`)
- `status`: `'online' | 'offline' | 'busy' | 'away'`
- `loading`: `boolean`

**Example:**
```svelte
<Avatar name="Jane Doe" size="lg" />
<Avatar src="/profile.jpg" alt="User" status="online" />
<Avatar label="AI" fallbackMode="label" shape="rounded" />
```

**CSP Compliance:**
- Background colors use deterministic hash-based color classes (`gr-avatar--color-0` through `gr-avatar--color-11`)
- Same name/label always produces the same color across sessions
- Image display controlled via CSS classes, not inline styles
- All 12 color classes meet WCAG AA contrast requirements

### Text

Typography component with bounded line clamping for strict CSP compliance.

**Props:**
- `as`: `'p' | 'span' | 'div' | 'label'` (default: `'p'`)
- `size`: `'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'` (default: `'base'`)
- `weight`: `'normal' | 'medium' | 'semibold' | 'bold'` (default: `'normal'`)
- `color`: `'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'` (default: `'primary'`)
- `align`: `'left' | 'center' | 'right' | 'justify'` (default: `'left'`)
- `truncate`: `boolean` (default: `false`)
- `lines`: `number` (2-6 supported for CSP compliance)

**Example:**
```svelte
<Text size="lg" weight="semibold">Heading Text</Text>
<Text truncate>Single line truncation</Text>
<Text truncate lines={3}>Multi-line clamping (2-6 lines supported)</Text>
```

**CSP Compliance:**
- Line clamping uses predefined classes (`gr-text--clamp-2` through `gr-text--clamp-6`)
- No inline CSS variables for line counts
- For line counts outside 2-6 range, use the `class` prop with external CSS

### Container

Layout container with preset gutters for strict CSP compliance.

**Props:**
- `maxWidth` / `size`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` (default: `'lg'`)
- `gutter`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `centered`: `boolean` (default: `true`)

**Example:**
```svelte
<Container size="xl" gutter="lg">
  <h1>Page Content</h1>
</Container>

<Container maxWidth="md" gutter="none">
  <p>No padding</p>
</Container>
```

**CSP Compliance:**
- Only preset gutter values are supported
- No inline CSS variables for custom gutters
- For custom gutters, use the `class` prop with external CSS to set `--gr-container-custom-gutter`

**Custom Gutter Example:**
```svelte
<Container size="lg" class="custom-gutter">
  <h1>Custom Padding</h1>
</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>
```

## CSP Compatibility

All components in this package are designed for strict Content Security Policy (CSP) compliance. They emit no inline `style` attributes and work in environments where `'unsafe-inline'` is not allowed in `style-src` directives.

For more information, see the [CSP Compatibility Guide](../../docs/csp-compatibility.md).
