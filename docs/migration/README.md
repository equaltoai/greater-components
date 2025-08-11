# Migration Guide

Welcome to the Greater Components migration guide. This document provides step-by-step instructions for upgrading between versions, migrating from other UI libraries, and handling breaking changes.

## Quick Navigation

- [**New Installation**](#new-installation) - Starting fresh with Greater Components
- [**Migrating from Other Libraries**](#migrating-from-other-libraries) - Coming from other UI frameworks
- [**Version Upgrades**](#version-upgrades) - Upgrading between Greater Components versions
- [**Breaking Changes**](#breaking-changes) - Detailed breaking change documentation
- [**Automated Migration**](#automated-migration) - Tools to help with migrations

## New Installation

If you're starting a new project, you can skip to our [Quick Start Guide](../../README.md#quick-start).

## Migrating from Other Libraries

### From Flowbite Svelte

Flowbite Svelte users can migrate to Greater Components with these mappings:

| Flowbite Component | Greater Components Equivalent | Notes |
|-------------------|-------------------------------|-------|
| `Button` | `@greater/primitives/Button` | Similar API, enhanced accessibility |
| `Modal` | `@greater/primitives/Modal` | Improved focus management |
| `Dropdown` | `@greater/primitives/Menu` | More keyboard navigation features |
| `Avatar` | `@greater/primitives/Avatar` | Enhanced fallback handling |
| `Skeleton` | `@greater/primitives/Skeleton` | Improved animation options |

**Migration Steps:**

1. **Install Greater Components**
   ```bash
   npm install @greater/primitives @greater/tokens @greater/icons
   npm uninstall flowbite-svelte
   ```

2. **Update Imports**
   ```svelte
   <!-- Before (Flowbite) -->
   <script>
     import { Button, Modal } from 'flowbite-svelte';
   </script>
   
   <!-- After (Greater Components) -->
   <script>
     import { Button, Modal } from '@greater/primitives';
   </script>
   ```

3. **Update Component Usage**
   ```svelte
   <!-- Before (Flowbite) -->
   <Button color="blue" size="lg">Click me</Button>
   
   <!-- After (Greater Components) -->
   <Button variant="solid" size="lg">Click me</Button>
   ```

### From SvelteUI

SvelteUI users can migrate with these component mappings:

| SvelteUI Component | Greater Components Equivalent | Notes |
|-------------------|-------------------------------|-------|
| `Button` | `@greater/primitives/Button` | Enhanced loading states |
| `TextInput` | `@greater/primitives/TextField` | Improved validation handling |
| `Modal` | `@greater/primitives/Modal` | Better backdrop management |
| `Menu` | `@greater/primitives/Menu` | More comprehensive keyboard support |

**Migration Steps:**

1. **Install Greater Components**
   ```bash
   npm install @greater/primitives @greater/tokens @greater/icons
   npm uninstall @svelteuidev/core
   ```

2. **Theme Migration**
   ```svelte
   <!-- Before (SvelteUI) -->
   <SvelteUIProvider theme={{ colorScheme: 'dark' }}>
     <App />
   </SvelteUIProvider>
   
   <!-- After (Greater Components) -->
   <ThemeProvider>
     <App />
   </ThemeProvider>
   ```

### From Carbon Components Svelte

Carbon users can migrate to Greater Components:

| Carbon Component | Greater Components Equivalent | Notes |
|------------------|-------------------------------|-------|
| `Button` | `@greater/primitives/Button` | Different size names |
| `Modal` | `@greater/primitives/Modal` | Enhanced accessibility |
| `TextInput` | `@greater/primitives/TextField` | Simplified validation API |
| `Tabs` | `@greater/primitives/Tabs` | Improved keyboard navigation |

**Migration Steps:**

1. **Install Greater Components**
   ```bash
   npm install @greater/primitives @greater/tokens @greater/icons
   npm uninstall carbon-components-svelte
   ```

2. **Update Theme Approach**
   ```css
   /* Before (Carbon) */
   @import 'carbon-components-svelte/css/white.css';
   
   /* After (Greater Components) */
   @import '@greater/tokens/theme.css';
   ```

## Version Upgrades

### Future Version Guidelines

Since v1.0.0 is the initial release, this section will be updated with specific migration instructions for future versions. All future migrations will follow these principles:

- **Semantic Versioning**: Breaking changes only in major versions
- **Deprecation Warnings**: 6-month notice before API removal
- **Migration Tools**: Automated codemods where possible
- **Clear Documentation**: Step-by-step upgrade instructions

### Version Compatibility Matrix

| Greater Components Version | Node.js | TypeScript | Svelte | Browser Support |
|---------------------------|---------|------------|--------|----------------|
| 1.x | >= 20.0.0 | >= 5.0.0 | >= 5.0.0 | Modern evergreen |

## Breaking Changes

### v1.0.0 (Initial Release)

Since this is the initial release, there are no breaking changes from previous versions. However, here are important considerations:

**API Stability Promise:**
- All APIs marked `@public` are stable
- Component props interfaces are locked
- CSS class names prefixed with `gr-` are stable
- Design tokens prefixed with `--gr-` are stable

**Not Covered by Stability:**
- Internal implementation details
- Utilities not marked `@public`
- Development-only features

## Automated Migration

### Codemod Tools

Greater Components provides automated migration tools for common scenarios:

```bash
# Install the migration tool
npm install -g @greater/codemod

# Run migration for specific changes
npx @greater/codemod migrate --from=flowbite-svelte --to=greater-components
npx @greater/codemod migrate --from=svelteui --to=greater-components

# Migrate specific files
npx @greater/codemod migrate src/**/*.svelte --transform=button-props
```

**Available Transforms:**
- `button-props` - Updates Button component properties
- `modal-props` - Updates Modal component properties
- `theme-provider` - Migrates theme provider setup
- `import-paths` - Updates import statements

### ESLint Rules

Add ESLint rules to catch deprecated patterns:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@greater/eslint-config'],
  rules: {
    '@greater/no-deprecated-props': 'error',
    '@greater/prefer-new-api': 'warn'
  }
};
```

## Common Migration Patterns

### Theme Migration

Most UI libraries have different theming approaches. Here's how to migrate to Greater Components theming:

```css
/* Step 1: Remove old theme imports */
/* Remove: @import 'old-library/theme.css'; */

/* Step 2: Import Greater Components theme */
@import '@greater/tokens/theme.css';

/* Step 3: Customize with CSS custom properties */
:root {
  --gr-color-primary-600: #your-brand-color;
  --gr-radii-lg: 8px;
}
```

### Component Prop Mapping

Common prop name changes:

| Old Prop | New Prop | Notes |
|----------|----------|-------|
| `color` | `variant` | More semantic naming |
| `disabled` | `disabled` | No change |
| `loading` | `loading` | No change |
| `onClick` | `onclick` | Svelte convention |

### Event Handler Migration

```svelte
<!-- Before (React-style) -->
<Button onClick={handleClick}>Click</Button>

<!-- After (Svelte-style) -->
<Button onclick={handleClick}>Click</Button>
```

## Testing Migration

### Update Test Imports

```javascript
// Before
import { render, fireEvent } from '@testing-library/svelte';

// After
import { render, fireEvent } from '@greater/testing';
```

### Accessibility Testing

Greater Components includes enhanced accessibility testing:

```javascript
import { checkA11y } from '@greater/testing';

test('component accessibility', async () => {
  const { container } = render(MyComponent);
  await checkA11y(container); // Enhanced a11y checks
});
```

## Migration Checklist

Use this checklist for your migration:

### Pre-Migration
- [ ] Review current component usage
- [ ] Identify custom styling and themes
- [ ] Plan testing strategy
- [ ] Set up development branch

### Migration Steps
- [ ] Install Greater Components packages
- [ ] Run automated migration tools
- [ ] Update component imports
- [ ] Migrate theme configuration
- [ ] Update prop usage
- [ ] Test component functionality
- [ ] Update test files
- [ ] Run accessibility tests

### Post-Migration
- [ ] Remove old library dependencies
- [ ] Clean up unused styles
- [ ] Update documentation
- [ ] Train team on new components
- [ ] Monitor for issues

## Getting Help

### Migration Support

If you encounter issues during migration:

1. **Check Documentation**: Review our [API docs](../../API_DOCUMENTATION.md)
2. **Search Issues**: Look through [GitHub Issues](https://github.com/equaltoai/greater-components/issues)
3. **Ask Community**: Post in [GitHub Discussions](https://github.com/equaltoai/greater-components/discussions)
4. **Report Bugs**: File detailed bug reports with migration context

### Professional Support

For enterprise migrations or custom requirements:
- **Consulting Services**: Available for complex migrations
- **Training Programs**: Team training on Greater Components
- **Custom Components**: Development of specialized components

Contact: `support@equalto.ai`

## FAQ

### **Q: How long does a typical migration take?**
**A:** Most migrations take 1-3 days depending on project size:
- Small projects (< 50 components): 4-8 hours
- Medium projects (50-200 components): 1-2 days  
- Large projects (200+ components): 2-3 days

### **Q: Will my existing styles break?**
**A:** Greater Components uses CSS custom properties for theming, so your existing styles should be largely unaffected. However, you may need to update class names and theme variables.

### **Q: Can I migrate gradually?**
**A:** Yes! You can install Greater Components alongside your existing UI library and migrate components one by one. Both libraries can coexist during the transition.

### **Q: What about custom components built on the old library?**
**A:** Custom components will need to be updated to use Greater Components as the base. The migration tools can help identify which components need updates.

### **Q: How do I handle different prop names?**
**A:** Our codemod tools can automatically update most prop name changes. For complex cases, refer to the component-specific migration guides above.

---

## Contributing to Migration Docs

Found an issue with these migration instructions? Please:

1. **File an Issue**: Report documentation problems
2. **Submit a PR**: Improve migration instructions  
3. **Share Experience**: Help others with your migration story

Together, we can make migrations as smooth as possible for everyone!

---

*Last updated: August 11, 2025*  
*For the latest migration information, visit: [https://github.com/equaltoai/greater-components/docs/migration](https://github.com/equaltoai/greater-components/docs/migration)*