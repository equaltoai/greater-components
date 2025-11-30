# Changelog

## [2.2.0] - 2025-11-23

### Added

#### Fediverse Package

- **Profile.Timeline component** - Dedicated profile timeline with filtering options
  - Props: `username`, `adapter`, `showReplies`, `showBoosts`, `onlyMedia`, `showPinned`
  - Integrates with Profile.Root context
  - Supports virtualized scrolling

#### Primitives Package

- **Settings Components** - Composable settings panel primitives
  - `SettingsSection` - Group settings with title and description
  - `SettingsGroup` - Nest related settings
  - `SettingsField` - Individual setting field with label
  - `SettingsToggle` - Pre-composed toggle switch
  - `SettingsSelect` - Pre-composed dropdown select
- **Theme Components** - Advanced theme customization tools
  - `ThemeWorkbench` - Visual theme builder with live preview
  - `ColorHarmonyPicker` - Generate color harmonies (complementary, analogous, triadic, etc.)
  - `ContrastChecker` - WCAG contrast ratio validator

#### Utils Package

- **Preference Store** - Persistent user preferences with localStorage
  - `createPreferenceStore()` - Type-safe preference management
  - Auto-save to localStorage
  - Export/import functionality
- **Theme Utilities** - Programmatic theme generation
  - `generateTheme()` - Create complete theme from brand color
  - `generateColorHarmony()` - Generate color schemes
  - `hexToHsl()` / `hslToHex()` - Color space conversion
  - `getContrastRatio()` - Calculate WCAG contrast ratio
  - `meetsWCAG()` - Validate accessibility compliance
  - `suggestTextColor()` - Optimal text color for background

#### Adapters Package

- **LesserGraphQLAdapter enhancements**
  - `verifyCredentials()` - Verify authentication and get current user
  - `isAuthenticated()` - Check if adapter has valid auth token
  - `getToken()` - Retrieve current authentication token
  - `refreshToken()` - Update authentication token

### Changed

- Documentation reorganized with implementation guide and troubleshooting section
- API reference expanded with new components and utilities
- Migration guide added for v2.2.0 adoption

### Performance

- All new components are tree-shakeable
- Bundle size increase: <10KB (verified)

### Testing

- 80%+ test coverage across all new features
- Comprehensive unit tests for all components
- Integration tests for adapter methods
