# Requirements Document

## Introduction

This specification addresses Milestones 0-1 of the Greater Components strict CSP (Content Security Policy) compatibility initiative. The goal is to establish a baseline CSP policy, inventory all violations, and refactor the four core primitives (Skeleton, Avatar, Text, Container) to be strict-CSP compatible by eliminating all inline style attributes.

Lesser deployments enforce a strict CloudFront CSP where `script-src` and `style-src` do not include `'unsafe-inline'` or `'unsafe-hashes'`. This blocks any `style="..."` attributes emitted by components, making Greater Components unusable in production Lesser environments.

## Glossary

- **CSP**: Content Security Policy - a browser security standard that restricts resource loading
- **Strict_CSP**: A CSP configuration without `'unsafe-inline'` or `'unsafe-hashes'` directives
- **Inline_Style**: A `style="..."` or `style={...}` attribute on an HTML element
- **Greater_Components**: The component library being made CSP-compatible
- **Lesser**: The deployment environment enforcing strict CSP
- **Primitive**: A core reusable component in `packages/primitives/src/components/`
- **Preset**: A predefined, named configuration option (e.g., size="md", color="primary")
- **Inventory**: A comprehensive list of all CSP violations in the codebase
- **Source_Scan**: Analysis of `.svelte` template files for inline style usage
- **Build_Scan**: Analysis of compiled HTML output for inline styles and scripts

## Requirements

### Requirement 1: Establish CSP Policy and Constraints

**User Story:** As a platform engineer, I want a documented strict CSP policy definition, so that all contributors understand the constraints and can validate compliance.

#### Acceptance Criteria

1. THE System SHALL document the exact CloudFront CSP header from Lesser deployments
2. THE System SHALL document that `script-src` does not include `'unsafe-inline'`
3. THE System SHALL document that `style-src` does not include `'unsafe-inline'` or `'unsafe-hashes'`
4. THE System SHALL document that `style="..."` attributes are blocked under this policy
5. THE System SHALL establish a written policy stating "no shipped inline styles/scripts" as an enforceable contract
6. THE System SHALL document that `style` is not a supported prop for shipped components

### Requirement 2: Inventory Inline Style and Script Violations

**User Story:** As a developer, I want a complete inventory of all CSP violations in the codebase, so that I can prioritize and track remediation work.

#### Acceptance Criteria

1. WHEN performing a source scan, THE System SHALL identify all `style="..."` usage in `packages/**/src/**/*.svelte` files
2. WHEN performing a source scan, THE System SHALL identify all `style={...}` usage in `packages/**/src/**/*.svelte` files
3. WHEN performing a build scan, THE System SHALL identify all `style="..."` attributes in built docs/playground HTML
4. WHEN performing a build scan, THE System SHALL identify all inline `<script>` tags in built docs/playground HTML
5. THE System SHALL categorize each finding as "ship-blocking" or "follow-up"
6. THE System SHALL produce a checklist with file paths, line numbers, and remediation approaches
7. THE System SHALL identify Skeleton, Avatar, Text, and Container as ship-blocking primitives

### Requirement 3: Refactor Skeleton Component for CSP Compatibility

**User Story:** As a UI developer, I want to use Skeleton with preset sizes, so that loading states work under strict CSP without inline styles.

#### Acceptance Criteria

1. WHEN Skeleton is used with default props, THE Component SHALL emit no `style=` attribute
2. WHEN Skeleton is used with preset width values, THE Component SHALL emit no `style=` attribute
3. WHEN Skeleton is used with preset height values, THE Component SHALL emit no `style=` attribute
4. THE Component SHALL support bounded width presets (e.g., `full`, `1/2`, `1/3`, `content`, `auto`)
5. THE Component SHALL support bounded height presets (e.g., `xs`, `sm`, `md`, `lg`, `xl`)
6. THE Component SHALL maintain visual parity for variants (text/circular/rectangular/rounded) within acceptable deltas
7. THE Component SHALL remove style-prop merging behavior from internal rendering
8. WHEN arbitrary sizing is needed, THE Component SHALL require consumer-provided CSS class

### Requirement 4: Refactor Avatar Component for CSP Compatibility

**User Story:** As a UI developer, I want Avatar to display user initials with deterministic colors, so that user identity is visually consistent under strict CSP.

#### Acceptance Criteria

1. WHEN Avatar displays an image, THE Component SHALL emit no `style=` attribute for display control
2. WHEN Avatar displays initials, THE Component SHALL emit no `style=` attribute for background color
3. THE Component SHALL use conditional rendering, `hidden` attribute, or class toggles for image display state
4. THE Component SHALL generate deterministic palette classes from name/label hash
5. THE Component SHALL map hash values to color indices (e.g., `gr-avatar--color-0` through `gr-avatar--color-N`)
6. THE Component SHALL define background colors in CSS with validated contrast ratios
7. THE Component SHALL maintain stable initials/label/icon fallback behavior
8. THE Component SHALL maintain accessibility name behavior
9. WHEN the same name/label is provided, THE Component SHALL render the same color class across sessions

### Requirement 5: Refactor Text Component for CSP Compatibility

**User Story:** As a content author, I want to clamp text to a specific number of lines using preset values, so that text truncation works under strict CSP.

#### Acceptance Criteria

1. WHEN Text uses truncate with supported line counts, THE Component SHALL emit no `style=` attribute
2. WHEN Text uses single-line truncate, THE Component SHALL emit no `style=` attribute
3. THE Component SHALL support bounded clamp classes (e.g., `gr-text--clamp-2` through `gr-text--clamp-6`)
4. THE Component SHALL define CSS for each supported clamp class
5. THE Component SHALL remove inline CSS variable injection for `--gr-text-clamp-lines`
6. WHEN out-of-range clamp values are needed, THE Component SHALL require consumer-provided CSS class
7. THE Component SHALL document the supported clamp range

### Requirement 6: Refactor Container Component for CSP Compatibility

**User Story:** As a layout designer, I want to use Container with preset gutters, so that page layouts work under strict CSP without inline styles.

#### Acceptance Criteria

1. WHEN Container uses preset gutter values, THE Component SHALL emit no `style=` attribute
2. WHEN Container uses default gutter, THE Component SHALL emit no `style=` attribute
3. THE Component SHALL support only preset gutter values as CSP-safe behavior
4. THE Component SHALL emit `gr-container--padded-custom` class for custom gutters
5. THE Component SHALL not set CSS variables via inline style for custom gutters
6. THE Component SHALL document setting `--gr-container-custom-gutter` via external CSS
7. THE Component SHALL remove or replace numeric/string gutter values with preset-only API
8. WHEN custom gutters are needed, THE Component SHALL work only via consumer-provided external CSS

### Requirement 7: Validate CSP Compliance Across Refactored Components

**User Story:** As a quality engineer, I want automated validation that refactored components emit no inline styles, so that CSP compliance is maintained.

#### Acceptance Criteria

1. WHEN Skeleton is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
2. WHEN Avatar is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
3. WHEN Text is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
4. WHEN Container is rendered with any prop combination, THE Component SHALL emit no `style=` attribute
5. THE System SHALL validate that visual regression is within acceptable deltas for each component
6. THE System SHALL validate that accessibility behavior is preserved for each component
7. THE System SHALL validate that TypeScript types reflect the new preset-based APIs
