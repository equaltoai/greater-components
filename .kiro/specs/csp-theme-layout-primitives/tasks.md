# Implementation Plan: CSP Theme and Layout Primitives

## Overview

This implementation plan covers Milestone 2 of the CSP compatibility initiative. We'll refactor theme and layout primitives (ThemeProvider, Section, ThemeSwitcher, Tooltip) and theme tooling components to eliminate inline styles. The approach is incremental: tackle each component systematically, validate with property tests, and ensure visual/functional parity.

## Tasks

- [x] 1. Refactor ThemeProvider for CSP compliance
  - [x] 1.1 Update ThemeProvider types and props
    - Remove `customPalette` prop from interface
    - Remove `headingFont` and `bodyFont` props
    - Add `headingFontPreset` and `bodyFontPreset` props with FontPreset type
    - Update TypeScript types to reflect preset-only API
    - _Requirements: 1.6, 1.7, 1.8_

  - [x] 1.2 Implement class-based palette application
    - Remove `customCSS` derived property
    - Remove `style={customCSS}` from template
    - Add logic to generate palette class from preset value
    - Apply `gr-theme-provider--palette-{preset}` class
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 1.3 Implement class-based typography application
    - Add logic to generate typography classes from font presets
    - Apply `gr-theme-provider--heading-{preset}` class
    - Apply `gr-theme-provider--body-{preset}` class
    - _Requirements: 1.3, 1.5_

  - [x] 1.4 Add CSS for ThemeProvider presets
    - Create palette preset classes with CSS variable definitions
    - Create typography preset classes for heading and body fonts
    - Ensure all presets (slate, stone, neutral, zinc, gray) are defined
    - Ensure all font presets (system, sans, serif, mono) are defined
    - _Requirements: 1.4, 1.5_

  - [x] 1.5 Write property tests for ThemeProvider CSP compliance
    - **Property 1: ThemeProvider universal CSP compliance**
    - **Validates: Requirements 1.1, 1.2, 1.3, 6.1**
    - **Property 2: ThemeProvider palette class generation**
    - **Validates: Requirements 1.4**
    - **Property 3: ThemeProvider typography class generation**
    - **Validates: Requirements 1.5**

- [x] 2. Checkpoint - Validate ThemeProvider refactor
  - Run CSP scanner against ThemeProvider
  - Verify zero style attribute emissions
  - Run existing unit tests to ensure no regressions
  - Ask the user if questions arise

- [x] 3. Refactor Section for CSP compliance
  - [x] 3.1 Update Section types and props
    - Change `spacing` prop type to SpacingPreset only (remove string | number)
    - Change `background` prop type to BackgroundPreset only (remove string)
    - Update TypeScript types to reflect preset-only API
    - _Requirements: 2.4, 2.5, 2.6, 2.7_

  - [x] 3.2 Remove inline style generation
    - Remove `customSpacingStyle` computed property
    - Remove `customBackgroundStyle` computed property
    - Remove `customStyle` computed property
    - Remove `style={customStyle}` from template
    - Remove `isSpacingPreset` and `isBackgroundPreset` checks
    - _Requirements: 2.1, 2.2, 2.3, 2.8_

  - [x] 3.3 Simplify class generation
    - Remove `gr-section--spacing-custom` class logic
    - Remove `gr-section--bg-custom` class logic
    - Ensure all spacing presets generate correct classes
    - Ensure all background presets generate correct classes
    - Ensure gradient direction classes are applied correctly
    - _Requirements: 2.4, 2.5, 2.10_

  - [x] 3.4 Update Section CSS
    - Verify all spacing preset classes are defined
    - Verify all background preset classes are defined
    - Verify all gradient direction classes are defined
    - Remove any CSS for custom spacing/background
    - _Requirements: 2.4, 2.5, 2.10_

  - [x] 3.5 Write property tests for Section CSP compliance
    - **Property 4: Section universal CSP compliance**
    - **Validates: Requirements 2.1, 2.2, 2.3, 6.2**
    - **Property 5: Section spacing class generation**
    - **Validates: Requirements 2.4**
    - **Property 6: Section background class generation**
    - **Validates: Requirements 2.5**
    - **Property 7: Section gradient direction class generation**
    - **Validates: Requirements 2.10**

- [x] 4. Checkpoint - Validate Section refactor
  - Run CSP scanner against Section
  - Verify zero style attribute emissions
  - Run existing unit tests to ensure no regressions
  - Ask the user if questions arise

- [x] 5. Refactor ThemeSwitcher for CSP compliance
  - [x] 5.1 Remove inline preview styling
    - Remove `primaryColor`, `secondaryColor`, `accentColor` state variables
    - Remove `previewButtonTextColor` derived function
    - Remove inline `style={...}` from preview buttons
    - Apply preset color classes to preview buttons
    - _Requirements: 3.3, 3.4, 3.5_

  - [x] 5.2 Remove or redesign advanced features
    - Remove `showAdvanced` custom colors feature (or redesign to use presets)
    - Remove `showWorkbench` feature (or mark as dev-only)
    - Remove color picker inputs and handlers
    - Update component to work with CSP-compatible ThemeProvider
    - _Requirements: 3.6, 3.7, 3.8_

  - [x] 5.3 Update ThemeSwitcher CSS
    - Add preset color classes for preview buttons
    - Ensure preview uses CSS custom properties from ThemeProvider
    - Remove any CSS that depends on inline styles
    - _Requirements: 3.5_

  - [x] 5.4 Write property tests for ThemeSwitcher CSP compliance
    - **Property 8: ThemeSwitcher universal CSP compliance**
    - **Validates: Requirements 3.1, 3.2, 3.3, 6.3**
    - **Property 9: ThemeSwitcher preview uses preset classes**
    - **Validates: Requirements 3.4, 3.5**

- [x] 6. Checkpoint - Validate ThemeSwitcher refactor
  - Run CSP scanner against ThemeSwitcher
  - Verify zero style attribute emissions
  - Run existing unit tests to ensure no regressions
  - Ask the user if questions arise

- [x] 7. Refactor Tooltip for CSP compliance
  - [x] 7.1 Implement CSS-based positioning
    - Remove `tooltipPosition` state variable
    - Remove `calculatePosition` function (or simplify to class selection)
    - Remove inline `style="position: absolute; top: Npx; left: Npx"` from template
    - Use CSS transforms and relative positioning
    - _Requirements: 4.1, 4.5, 4.6_

  - [x] 7.2 Implement placement class generation
    - Update `actualPlacement` to drive class selection
    - Apply `gr-tooltip--{placement}` class based on placement prop
    - Ensure all placements (top, bottom, left, right) have corresponding classes
    - _Requirements: 4.3_

  - [x] 7.3 Implement auto placement via class selection
    - Simplify `calculatePlacement` to return placement string
    - Use viewport heuristics to select best placement
    - Apply selected placement class (no pixel calculations)
    - _Requirements: 4.2, 4.4, 4.7_

  - [x] 7.4 Update Tooltip CSS
    - Add CSS for relative positioning within container
    - Add CSS transforms for each placement
    - Add arrow positioning for each placement
    - Ensure z-index is handled via CSS class
    - _Requirements: 4.3, 4.5_

  - [x] 7.5 Write property tests for Tooltip CSP compliance
    - **Property 10: Tooltip universal CSP compliance**
    - **Validates: Requirements 4.1, 4.2, 6.4**
    - **Property 11: Tooltip placement class generation**
    - **Validates: Requirements 4.3**
    - **Property 12: Tooltip auto placement resolves to valid class**
    - **Validates: Requirements 4.4**
    - **Property 13: Tooltip viewport boundary fallback**
    - **Validates: Requirements 4.7**

- [x] 8. Checkpoint - Validate Tooltip refactor
  - Run CSP scanner against Tooltip
  - Verify zero style attribute emissions
  - Run existing unit tests to ensure no regressions
  - Test tooltip positioning in various viewport scenarios
  - Ask the user if questions arise

- [x] 9. Refactor Theme Tooling components for CSP compliance
  - [x] 9.1 Decide on Theme Tooling approach
    - Evaluate Option A (separate dev-tools package) vs Option B (preset-based redesign)
    - Document decision and rationale
    - If Option A: plan package extraction
    - If Option B: plan preset-based implementation
    - _Requirements: 5.10_

  - [x] 9.2 Refactor ThemeWorkbench
    - Remove inline swatch `style="background-color: {color}"` attributes
    - Remove inline spacing `style="height: 1rem"` attributes
    - Use preset swatch classes or CSS custom properties
    - Update to work with CSP-compatible ThemeProvider
    - _Requirements: 5.1, 5.4, 5.5_

  - [x] 9.3 Refactor ColorHarmonyPicker
    - Remove inline `style="background-color: {color}"` from swatches
    - Use preset color classes for harmony visualization
    - Limit to showing predefined harmony palettes
    - _Requirements: 5.2, 5.6, 5.7_

  - [x] 9.4 Refactor ContrastChecker
    - Remove inline `style="color: {foreground}; background-color: {background}"` from preview
    - Use preset color classes for contrast preview
    - Limit to showing predefined color combinations
    - _Requirements: 5.3, 5.8, 5.9_

  - [x] 9.5 Add CSS for Theme Tooling presets
    - Create preset swatch classes for primary color scale
    - Create preset classes for harmony colors
    - Create preset classes for contrast preview combinations
    - _Requirements: 5.5, 5.7, 5.9_

  - [x] 9.6 Write property tests for Theme Tooling CSP compliance
    - **Property 14: Theme tooling universal CSP compliance**
    - **Validates: Requirements 5.1, 5.2, 5.3, 6.5**
    - **Property 15: Theme tooling uses preset color classes**
    - **Validates: Requirements 5.5, 5.7, 5.9**

- [x] 10. Checkpoint - Validate Theme Tooling refactor
  - Run CSP scanner against Theme Tooling components
  - Verify zero style attribute emissions
  - Run existing unit tests to ensure no regressions
  - Ask the user if questions arise

- [x] 11. Update CSP validation and CI
  - Verify CSP scanner catches all Milestone 2 components
  - Run full CSP audit on primitives package
  - Ensure CI fails on new inline style violations
  - Update CSP audit allowlist if needed (for dev-only components)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Update documentation
  - [x] 12.1 Update ThemeProvider documentation
    - Document removed props (customPalette, headingFont, bodyFont)
    - Document new preset props (headingFontPreset, bodyFontPreset)
    - Add migration examples for custom palettes
    - Document external CSS pattern for custom theming
    - _Requirements: 7.1, 7.2, 7.5_

  - [x] 12.2 Update Section documentation
    - Document preset-only spacing and background
    - Add migration examples for custom spacing/background
    - Document external CSS pattern for custom values
    - _Requirements: 7.1, 7.3, 7.5_

  - [x] 12.3 Update Tooltip documentation
    - Document CSS-based positioning approach
    - Document positioning constraints vs pixel-positioned implementation
    - Add examples for each placement
    - Document external CSS pattern for pixel-perfect positioning
    - _Requirements: 7.1, 7.4, 7.5_

  - [x] 12.4 Update CSP compatibility guide
    - Add Milestone 2 components to compatibility matrix
    - Document Theme Tooling as dev-only (if applicable)
    - Update migration guide with Milestone 2 changes
    - _Requirements: 7.6_

- [x] 13. Final checkpoint - End-to-end validation
  - Build docs and playground
  - Run CSP scanner on built output
  - Verify zero CSP violations attributable to Milestone 2 components
  - Run full test suite (unit, integration, visual, a11y)
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- All tasks are required for comprehensive CSP compliance
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The Tooltip refactor is the most complex due to positioning redesign
- Theme Tooling decision (dev-only vs preset-based) should be made early in task 9.1
