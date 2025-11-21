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
- **Container**: Centered layout container with max-width constraints.
- **Heading**: Semantic heading component (h1-h6).
- **Section**: Semantic section component with standard spacing.
- **Text**: Body text component with typography variants.

### Navigation & Overlay

- **Menu**: Dropdown menu component.
- **Modal**: Dialog/Overlay component.
- **Tabs**: Tabbed interface component.
- **Tooltip**: Popup information component.

### Data Display

- **Avatar**: User profile image/initials component.
- **Skeleton**: Loading placeholder state.

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
