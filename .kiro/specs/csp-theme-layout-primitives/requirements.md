# Requirements Document

## Introduction

This specification addresses Milestone 2 of the Greater Components strict CSP (Content Security Policy) compatibility initiative. The goal is to refactor the theme and layout primitives (ThemeProvider, Section, ThemeSwitcher, Tooltip) and associated Theme tooling components (ThemeWorkbench, ColorHarmonyPicker, ContrastChecker) to be strict-CSP compatible by eliminating all inline style attributes.

Building on the foundation established in Milestone 1 (core primitives), this milestone tackles more complex components that rely on dynamic styling for theming, positioning, and color customization. The approach requires significant API redesign in some cases, particularly for components that currently support arbitrary runtime values.

## Glossary

- **CSP**: Content Security Policy - a browser security standard that restricts resource loading
- **Strict_CSP**: A CSP configuration without `'unsafe-inline'` or `'unsafe-hashes'` directives
- **Inline_Style**: A `style="..."` or `style={...}` attribute on an HTML element
- **Greater_Components**: The component library being made CSP-compatible
- **Lesser**: The deployment environment enforcing strict CSP
- **Primitive**: A core reusable component in `packages/primitives/src/components/`
- **Preset**: A predefined, named configuration option (e.g., palette="slate", spacing="lg")
- **Theme_Tooling**: Components in `packages/primitives/src/components/Theme/` for theme customization
- **CSS_Variable**: A custom property (e.g., `--gr-color-primary`) defined in CSS
- **Palette_Preset**: A predefined color palette (e.g., slate, stone, neutral, zinc, gray)
- **Placement_Class**: A CSS class that positions an element (e.g., `gr-tooltip--top`)

## Requirements

### Requirement 1: Refactor ThemeProvider for CSP Compatibility

**User Story:** As a UI developer, I want to apply theme presets using class-based configuration, so that theming works under strict CSP without inline styles.

#### Acceptance Criteria

1. WHEN ThemeProvider is used with default props, THE Component SHALL emit no `style=` attribute
2. WHEN ThemeProvider is used with a palette preset, THE Component SHALL emit no `style=` attribute
3. WHEN ThemeProvider is used with typography presets, THE Component SHALL emit no `style=` attribute
4. THE Component SHALL support palette presets via class-based application (e.g., `gr-theme-provider--palette-slate`)
5. THE Component SHALL support typography presets via class-based application (e.g., `gr-theme-provider--font-heading-serif`)
6. THE Component SHALL remove the `customPalette` prop that requires inline CSS variable injection
7. THE Component SHALL remove the `headingFont` and `bodyFont` props that accept arbitrary font strings
8. THE Component SHALL provide preset font options (e.g., `headingFontPreset`, `bodyFontPreset`)
9. WHEN custom theming beyond presets is needed, THE Component SHALL require consumer-provided external CSS
10. THE Component SHALL document the migration path from runtime theme objects to preset-based theming

### Requirement 2: Refactor Section for CSP Compatibility

**User Story:** As a layout designer, I want to use Section with preset spacing and background options, so that page sections work under strict CSP without inline styles.

#### Acceptance Criteria

1. WHEN Section is used with preset spacing values, THE Component SHALL emit no `style=` attribute
2. WHEN Section is used with preset background values, THE Component SHALL emit no `style=` attribute
3. WHEN Section is used with default props, THE Component SHALL emit no `style=` attribute
4. THE Component SHALL restrict `spacing` prop to preset values only (none, sm, md, lg, xl, 2xl, 3xl, 4xl)
5. THE Component SHALL restrict `background` prop to preset values only (default, muted, accent, gradient)
6. THE Component SHALL remove support for arbitrary string/number spacing values
7. THE Component SHALL remove support for arbitrary CSS background values
8. THE Component SHALL remove inline CSS variable injection for custom spacing/background
9. WHEN custom spacing or background is needed, THE Component SHALL require consumer-provided external CSS class
10. THE Component SHALL maintain gradient direction support via preset classes

### Requirement 3: Refactor ThemeSwitcher for CSP Compatibility

**User Story:** As a user, I want to switch between theme presets, so that theme selection works under strict CSP without inline styles.

#### Acceptance Criteria

1. WHEN ThemeSwitcher is rendered in compact variant, THE Component SHALL emit no `style=` attribute
2. WHEN ThemeSwitcher is rendered in full variant, THE Component SHALL emit no `style=` attribute
3. WHEN ThemeSwitcher shows preview, THE Component SHALL emit no `style=` attribute
4. THE Component SHALL remove inline color styling from preview buttons
5. THE Component SHALL use preset color classes for preview elements
6. THE Component SHALL work with CSP-compatible ThemeProvider capabilities
7. THE Component SHALL remove or redesign the `showAdvanced` custom colors feature
8. THE Component SHALL remove or redesign the `showWorkbench` feature that requires dynamic colors
9. WHEN advanced color customization is needed, THE Component SHALL document external CSS approach

### Requirement 4: Refactor Tooltip for CSP Compatibility

**User Story:** As a UI developer, I want tooltips to position correctly using CSS-based placement, so that tooltips work under strict CSP without inline pixel positioning.

#### Acceptance Criteria

1. WHEN Tooltip is rendered with any placement, THE Component SHALL emit no `style=` attribute
2. WHEN Tooltip uses auto placement, THE Component SHALL emit no `style=` attribute
3. THE Component SHALL use CSS-based positioning via placement classes (top, bottom, left, right)
4. THE Component SHALL implement auto placement via class selection, not pixel style injection
5. THE Component SHALL use CSS transforms and positioning relative to trigger element
6. THE Component SHALL remove inline `position: absolute; top: Npx; left: Npx` styling
7. THE Component SHALL maintain viewport boundary awareness via class-based fallback positions
8. THE Component SHALL document positioning constraints vs the current pixel-positioned implementation
9. WHEN pixel-perfect positioning is required, THE Component SHALL document external CSS approach

### Requirement 5: Refactor Theme Tooling Components for CSP Compatibility

**User Story:** As a theme designer, I want to use theme tooling components that work under strict CSP, so that theme customization previews are CSP-compatible.

#### Acceptance Criteria

1. WHEN ThemeWorkbench is rendered, THE Component SHALL emit no `style=` attribute
2. WHEN ColorHarmonyPicker is rendered, THE Component SHALL emit no `style=` attribute
3. WHEN ContrastChecker is rendered, THE Component SHALL emit no `style=` attribute
4. THE ThemeWorkbench SHALL remove inline swatch background colors
5. THE ThemeWorkbench SHALL use preset color classes or CSS custom properties set via classes
6. THE ColorHarmonyPicker SHALL remove inline `background-color` styling on swatches
7. THE ColorHarmonyPicker SHALL use preset color classes for harmony visualization
8. THE ContrastChecker SHALL remove inline `color` and `background-color` styling
9. THE ContrastChecker SHALL use preset color classes for contrast preview
10. IF dynamic color preview is essential, THE Components SHALL document that they are development-only tools not shipped to production

### Requirement 6: Validate CSP Compliance Across Refactored Components

**User Story:** As a quality engineer, I want automated validation that refactored components emit no inline styles, so that CSP compliance is maintained.

#### Acceptance Criteria

1. WHEN ThemeProvider is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
2. WHEN Section is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
3. WHEN ThemeSwitcher is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
4. WHEN Tooltip is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
5. WHEN Theme tooling components are rendered, THE Components SHALL emit no `style=` attribute
6. THE System SHALL validate that visual regression is within acceptable deltas for each component
7. THE System SHALL validate that accessibility behavior is preserved for each component
8. THE System SHALL validate that TypeScript types reflect the new preset-based APIs

### Requirement 7: Document API Changes and Migration Path

**User Story:** As a developer using Greater Components, I want clear documentation on API changes, so that I can migrate my code to CSP-compatible patterns.

#### Acceptance Criteria

1. THE Documentation SHALL list all removed props and their CSP-safe alternatives
2. THE Documentation SHALL provide migration examples for ThemeProvider custom palettes
3. THE Documentation SHALL provide migration examples for Section custom spacing/background
4. THE Documentation SHALL provide migration examples for Tooltip positioning constraints
5. THE Documentation SHALL explain the external CSS pattern for custom values
6. THE Documentation SHALL update the CSP compatibility guide with Milestone 2 components
