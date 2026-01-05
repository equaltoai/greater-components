# Implementation Plan: CSP Baseline and Primitives

## Overview

This implementation plan covers Milestones 0-1 of the CSP compatibility initiative. We'll build scanning tools to identify violations, then refactor four core primitives (Skeleton, Avatar, Text, Container) to eliminate inline styles. The approach is incremental: build the scanner first to validate our refactors, then tackle each component systematically.

## Tasks

- [x] 1. Create CSP scanner infrastructure
  - Create `scripts/audit-csp.mjs` with source and build scanning capabilities
  - Implement regex-based source scanner for `.svelte` files
  - Implement HTML parser-based build scanner
  - Generate violation reports with file paths, line numbers, and categorization
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 1.1 Write property tests for source scanner
  - **Property 1: Source scanner detects style attributes**
  - **Validates: Requirements 2.1**
  - **Property 2: Source scanner detects style bindings**
  - **Validates: Requirements 2.2**

- [x] 1.2 Write property tests for build scanner
  - **Property 3: Build scanner detects inline styles**
  - **Validates: Requirements 2.3**
  - **Property 4: Build scanner detects inline scripts**
  - **Validates: Requirements 2.4**

- [x] 1.3 Write property tests for scanner categorization
  - **Property 5: Scanner categorizes findings correctly**
  - **Validates: Requirements 2.5**
  - **Property 6: Scanner produces complete reports**
  - **Validates: Requirements 2.6**

- [x] 2. Run baseline CSP audit and document findings
  - Execute scanner against `packages/primitives/src/components/`
  - Execute scanner against built docs/playground output
  - Generate violation report and save to `planning/csp-violations-baseline.md`
  - Verify Skeleton, Avatar, Text, and Container are identified as ship-blocking
  - _Requirements: 2.7_

- [x] 3. Document CSP policy and constraints
  - Create `docs/csp-compatibility.md` with policy definition
  - Document strict CSP constraints (no unsafe-inline, no unsafe-hashes)
  - Document "no shipped inline styles/scripts" policy
  - Document that `style` prop is not supported for shipped components
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4. Checkpoint - Validate scanner and baseline
  - Ensure scanner correctly identifies known violations
  - Ensure baseline report is complete and accurate
  - Ask the user if questions arise

- [ ] 5. Refactor Skeleton component for CSP compliance
  - [x] 5.1 Define width and height preset types
    - Create TypeScript types for `WidthPreset` and `HeightPreset`
    - Update `SkeletonProps` interface to use preset types
    - Remove support for arbitrary string/number width/height values
    - _Requirements: 3.4, 3.5_

  - [x] 5.2 Implement preset-based class generation
    - Remove `skeletonStyle` computed property
    - Add logic to generate width/height classes from presets
    - Maintain variant-specific default dimensions via classes
    - Remove style prop merging logic
    - _Requirements: 3.1, 3.2, 3.3, 3.7_

  - [x] 5.3 Add CSS for Skeleton presets
    - Create width preset classes (full, 1/2, 1/3, 2/3, 1/4, 3/4, content, auto)
    - Create height preset classes (xs, sm, md, lg, xl, 2xl)
    - Ensure variant defaults work via CSS
    - _Requirements: 3.4, 3.5_

  - [x] 5.4 Write property tests for Skeleton CSP compliance
    - **Property 7: Skeleton default usage emits no style attribute**
    - **Validates: Requirements 3.1**
    - **Property 8: Skeleton preset widths emit no style attribute**
    - **Validates: Requirements 3.2, 3.4**
    - **Property 9: Skeleton preset heights emit no style attribute**
    - **Validates: Requirements 3.3, 3.5**
    - **Property 10: Skeleton ignores style prop**
    - **Validates: Requirements 3.7**
    - **Property 11: Skeleton universal CSP compliance**
    - **Validates: Requirements 7.1**

- [x] 6. Refactor Avatar component for CSP compliance
  - [x] 6.1 Implement deterministic color class generation
    - Create `generateColorClass` function with hash-based logic
    - Ensure deterministic output for same input
    - Generate classes in format `gr-avatar--color-N` (N = 0-11)
    - _Requirements: 4.4, 4.5, 4.9_

  - [x] 6.2 Replace inline background colors with classes
    - Remove inline `style="background-color: ..."` from initials
    - Remove inline `style="background-color: ..."` from label
    - Remove inline `style="background-color: ..."` from icon
    - Apply color class to placeholder elements
    - _Requirements: 4.2_

  - [x] 6.3 Replace inline display control with classes
    - Remove `style="display: ..."` from image element
    - Add `gr-avatar__image--loaded` class toggle
    - Use CSS to control image visibility
    - _Requirements: 4.1, 4.3_

  - [x] 6.4 Add CSS for Avatar color palette
    - Create 12 color classes with WCAG AA compliant colors
    - Define HSL colors with 65% saturation, 30% lightness
    - Ensure white text has sufficient contrast
    - Add CSS for image display states
    - _Requirements: 4.4, 4.5_

  - [x] 6.5 Write property tests for Avatar CSP compliance
    - **Property 12: Avatar image display emits no style attribute**
    - **Validates: Requirements 4.1**
    - **Property 13: Avatar initials emit no style attribute**
    - **Validates: Requirements 4.2**
    - **Property 14: Avatar uses class-based display control**
    - **Validates: Requirements 4.3**
    - **Property 15: Avatar color class determinism**
    - **Validates: Requirements 4.4, 4.9**
    - **Property 16: Avatar color class format**
    - **Validates: Requirements 4.5**
    - **Property 17: Avatar fallback behavior preserved**
    - **Validates: Requirements 4.7**
    - **Property 18: Avatar accessibility preserved**
    - **Validates: Requirements 4.8**
    - **Property 19: Avatar universal CSP compliance**
    - **Validates: Requirements 7.2**

- [x] 7. Refactor Text component for CSP compliance
  - [x] 7.1 Implement bounded clamp class generation
    - Create `getClampClass` function for lines 2-6
    - Remove `textStyle` computed property
    - Remove inline CSS variable injection
    - Update component to use clamp classes
    - _Requirements: 5.1, 5.3, 5.5_

  - [x] 7.2 Add CSS for Text clamp classes
    - Create `gr-text--clamp-2` through `gr-text--clamp-6` classes
    - Define `-webkit-line-clamp` values for each class
    - Ensure single-line truncate remains class-only
    - _Requirements: 5.2, 5.3_

  - [x] 7.3 Write property tests for Text CSP compliance
    - **Property 20: Text truncate emits no style attribute**
    - **Validates: Requirements 5.1**
    - **Property 21: Text clamp class generation**
    - **Validates: Requirements 5.3**
    - **Property 22: Text removes CSS variable injection**
    - **Validates: Requirements 5.5**
    - **Property 23: Text universal CSP compliance**
    - **Validates: Requirements 7.3**

- [x] 8. Refactor Container component for CSP compliance
  - [x] 8.1 Restrict gutter API to presets only
    - Update `GutterPreset` type definition
    - Remove support for numeric/string gutter values
    - Remove `customGutterStyle` computed property
    - Update component to only emit preset gutter classes
    - _Requirements: 6.1, 6.3, 6.5, 6.7_

  - [x] 8.2 Update Container CSS for preset gutters
    - Ensure all preset gutter classes are defined
    - Remove custom gutter CSS variable usage
    - Document external CSS pattern for custom gutters
    - _Requirements: 6.3, 6.4_

  - [x] 8.3 Write property tests for Container CSP compliance
    - **Property 24: Container preset gutters emit no style attribute**
    - **Validates: Requirements 6.1, 6.3**
    - **Property 25: Container custom gutter emits no style attribute**
    - **Validates: Requirements 6.5**
    - **Property 26: Container preset-only API**
    - **Validates: Requirements 6.7**
    - **Property 27: Container universal CSP compliance**
    - **Validates: Requirements 7.4**

- [x] 9. Checkpoint - Validate all refactors
  - Run CSP scanner against refactored components
  - Verify zero violations in Skeleton, Avatar, Text, Container
  - Run existing unit tests to ensure no regressions
  - Ask the user if questions arise

- [x] 10. Add CSP validation to CI pipeline
  - Add `validate:csp` script to root package.json
  - Integrate scanner into `validate:package` script
  - Ensure CI fails on new inline style violations
  - Document validation process in CSP compatibility guide
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 11. Update component documentation
  - Update Skeleton docs with preset-based API
  - Update Avatar docs with color class behavior
  - Update Text docs with bounded clamp range
  - Update Container docs with preset-only gutters
  - Add migration notes for breaking changes
  - _Requirements: 3.8, 5.6, 5.7, 6.6, 6.8_

- [x] 12. Final checkpoint - End-to-end validation
  - Build docs and playground
  - Run CSP scanner on built output
  - Verify zero CSP violations attributable to Greater Components
  - Run full test suite (unit, integration, visual, a11y)
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The scanner is built first to validate subsequent refactors
- Each component refactor follows the same pattern: update types → update logic → update CSS → test
