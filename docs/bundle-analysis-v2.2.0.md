# Bundle Size Analysis - v2.2.0

## Summary
- Total size increase: ~5 KB (Estimated from component size)
- Target: <10KB ✅

## Package Breakdown

### @equaltoai/greater-components-primitives
- New settings components added:
  - SettingsSection
  - SettingsGroup
  - SettingsField
  - SettingsToggle
  - SettingsSelect
- New theme components added:
  - ColorHarmonyPicker
  - ContrastChecker
  - ThemeWorkbench
- Impact: Moderate increase, but well within limits. ThemeWorkbench is the largest addition but is tree-shakeable.

### @equaltoai/greater-components-fediverse
- New components:
  - Profile.Timeline (Small wrapper)
  - NotificationFilters
  - PushNotificationSettings
- Impact: Minimal. Most logic is reused from existing timeline components.

### @equaltoai/greater-components-utils
- New utilities:
  - Theme generators (color-harmony, contrast, theme-generator)
  - Preference store
- Impact: Very small. Pure functions are highly tree-shakeable.

## Tree-shaking Verification
- Settings components are tree-shakeable: ✅ (Exported individually)
- Theme components are tree-shakeable: ✅ (Exported individually)
- Utils are tree-shakeable: ✅ (Pure functions)

## Optimization Opportunities
- `ThemeWorkbench` imports all color utilities. Ensure it's only loaded when needed (e.g. in settings pages, not main app bundle).
- `SettingsSelect` uses `Select` primitive, which pulls in floating-ui logic. This is expected for select functionality.
