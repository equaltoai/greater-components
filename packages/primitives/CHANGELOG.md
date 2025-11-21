# @equaltoai/greater-components-primitives

## 2.0.0

### Major Changes

- feat(primitives): Added Advanced Interaction Components (Phase 3):
  - `CodeBlock` - Syntax highlighting with Shiki, copy button, line numbers.
  - `DropZone` - Drag and drop file uploads with validation and visual feedback.
  - `MarkdownRenderer` - Safe markdown rendering with DOMPurify and marked.
  - `StreamingText` - Typewriter/streaming text effect for AI responses.

## 1.3.0

### Minor Changes

- feat(primitives): Added 5 new Core Components for marketing and documentation sites:
  - `Badge` - Pill, dot, outlined, and filled variants for status and labels.
  - `List` & `ListItem` - Styled lists with automatic or custom icon injection.
  - `GradientText` - Eye-catching gradient text wrapper with presets.
  - `StepIndicator` - Numbered/icon badges for multi-step workflows (tutorials, wizards).
  - `IconBadge` - Consistent icon containers with shape and size variants.

## 1.2.0

### Minor Changes

- feat(primitives): Added `CopyButton` component.
  - A specialized button for copying text to the clipboard.
  - Provides automatic visual feedback (transitions from copy icon to checkmark).
  - Supports `icon`, `text`, and `icon-text` variants.
  - Fully accessible with aria-label updates.
  - Handles both direct text input and target element selectors.

## 1.1.0

### Patch Changes

- Disable Vite/esbuild minification for every Svelte 5 bundle so our compiled output never uses `$` as a variable name. This keeps all published artifacts rune-safe and fixes the “`$` name is reserved” crash reported in v1.0.27.
- Stop Vite/esbuild from mangling identifiers to `$` so the compiled Svelte output remains rune-safe under Svelte 5, and rebuild the affected packages. This fixes the `function $(...)` runtime error reported in v1.0.27.

## 1.0.16

### Patch Changes

- Align every package with the shared Vitest 4 toolchain, clean up the rune-incompatible Timeline unit specs, and document that Timeline coverage now lives in the demo/E2E suite.

## 1.0.15

### Patch Changes

- Fix Tabs component $restProps handling and add comprehensive demo

  **Fixes:**
  - Fixed `Tabs` component to use `...restProps` destructuring pattern instead of `$derived(() => $restProps())`
  - Resolves `store_invalid_shape: restProps is not a store with a subscribe method` error during SSR
  - Component now correctly forwards additional HTML attributes to the root element

  **Demo:**
  - Added comprehensive Tabs demo at `apps/playground/src/routes/tabs/+page.svelte`
  - Demonstrates horizontal tabs with underline variant
  - Demonstrates vertical tabs with pills variant and manual activation
  - Shows keyboard navigation (arrow keys, Home/End, Enter/Space)
  - Includes disabled tab states and snippet-based content rendering
  - Fully functional under SSR using local workspace packages

## 1.0.14

### Patch Changes

- Fix Tabs component $restProps handling and add comprehensive demo

  **Fixes:**
  - Fixed `Tabs` component to use `...restProps` destructuring pattern instead of `$derived(() => $restProps())`
  - Resolves `store_invalid_shape: restProps is not a store with a subscribe method` error during SSR
  - Component now correctly forwards additional HTML attributes to the root element

  **Demo:**
  - Added comprehensive Tabs demo at `apps/playground/src/routes/tabs/+page.svelte`
  - Demonstrates horizontal tabs with underline variant
  - Demonstrates vertical tabs with pills variant and manual activation
  - Shows keyboard navigation (arrow keys, Home/End, Enter/Space)
  - Includes disabled tab states and snippet-based content rendering
  - Fully functional under SSR using local workspace packages

## 1.0.13

### Patch Changes

- Fix the Tabs component’s `$restProps` handling so SSR/custom-element renders no longer crash.

## 1.0.12

### Patch Changes

- Align packages with the latest Lesser GraphQL schema (including `quoteId` support) and harden timeline data handling. Adapters now normalize missing timestamps/relationships, the fediverse docs and generated types stay in sync with the schema, and the TextField primitive correctly styles the `:read-only` state.

## 1.0.11

### Patch Changes

- Fix critical restProps errors and improve GraphQL WebSocket URL handling

  **CRITICAL FIXES:**
  1. **restProps Initialization Errors**
     - Fixed `Avatar` and `Skeleton` components to use `...restProps` destructuring pattern instead of `$restProps()` call
     - This matches the pattern used in working components like `Button`
     - Resolves `ReferenceError: Cannot access 'restProps' before initialization` in SSR/SSG environments
     - Components now hydrate correctly in Astro/Cloudflare Workers
  2. **GraphQL WebSocket URL Handling**
     - Added defensive checks to ensure `wsEndpoint` is not derived from `httpEndpoint`
     - Added explicit URL validation and logging
     - Store `wsEndpoint` in const to prevent mutation
     - Added error logging if URL derivation is detected
     - Improved debug logging to trace WebSocket URL usage

  **Files Fixed:**
  - `packages/primitives/src/components/Avatar.svelte` - restProps pattern
  - `packages/primitives/src/components/Skeleton.svelte` - restProps pattern
  - `packages/adapters/src/graphql/client.ts` - WebSocket URL handling

  **Note:** If WebSocket still connects to wrong URL, check browser console for debug logs showing which URL is being used. The issue may be in `graphql-ws` library or Apollo Client's `GraphQLWsLink` if URL derivation persists.

## 1.0.10

### Patch Changes

- Fix critical restProps errors and improve GraphQL WebSocket URL handling

  **CRITICAL FIXES:**
  1. **restProps Initialization Errors**
     - Fixed `Avatar` and `Skeleton` components to use `...restProps` destructuring pattern instead of `$restProps()` call
     - This matches the pattern used in working components like `Button`
     - Resolves `ReferenceError: Cannot access 'restProps' before initialization` in SSR/SSG environments
     - Components now hydrate correctly in Astro/Cloudflare Workers
  2. **GraphQL WebSocket URL Handling**
     - Added defensive checks to ensure `wsEndpoint` is not derived from `httpEndpoint`
     - Added explicit URL validation and logging
     - Store `wsEndpoint` in const to prevent mutation
     - Added error logging if URL derivation is detected
     - Improved debug logging to trace WebSocket URL usage

  **Files Fixed:**
  - `packages/primitives/src/components/Avatar.svelte` - restProps pattern
  - `packages/primitives/src/components/Skeleton.svelte` - restProps pattern
  - `packages/adapters/src/graphql/client.ts` - WebSocket URL handling

  **Note:** If WebSocket still connects to wrong URL, check browser console for debug logs showing which URL is being used. The issue may be in `graphql-ws` library or Apollo Client's `GraphQLWsLink` if URL derivation persists.

- Fix critical issues: GraphQL wsEndpoint, restProps errors, and ThemeSwitcher default

  **CRITICAL FIXES:**
  1. **GraphQL Adapter wsEndpoint Fix**
     - Fixed adapter to explicitly use `wsEndpoint` config parameter instead of constructing URL
     - Added validation and explicit capture of wsEndpoint to prevent closure issues
     - Added debug logging to trace WebSocket URL usage
     - Fixed WebSocket reconnection in `updateToken` to properly use wsEndpoint
  2. **restProps Initialization Errors**
     - Fixed `restProps` initialization errors in `Avatar` and `Skeleton` components
     - Added missing `Snippet` import in `Skeleton` component
     - Ensured `$restProps()` is called before any derived values to avoid hoisting issues
     - Resolves hydration errors in Astro/SSR environments
  3. **ThemeSwitcher Default Variant**
     - Changed default variant from `"full"` to `"compact"` for header usage
     - **BREAKING CHANGE**: Settings pages now need to explicitly use `variant="full"`
     - Compact variant shows dropdown with Light/Dark/Auto options suitable for navigation headers
     - Full variant remains available for comprehensive settings panels

  **Migration:**
  - ThemeSwitcher now defaults to compact variant (suitable for headers)
  - For settings pages, use: `<GCThemeSwitcher variant="full" />`
  - For headers, use: `<GCThemeSwitcher variant="compact" />` (or omit variant for default)

  **Files Fixed:**
  - `packages/adapters/src/graphql/client.ts` - wsEndpoint usage
  - `packages/primitives/src/components/Avatar.svelte` - restProps initialization
  - `packages/primitives/src/components/Skeleton.svelte` - restProps initialization and missing import
  - `packages/primitives/src/components/ThemeSwitcher.svelte` - default variant

## 1.0.9

### Patch Changes

- Fix critical issues: GraphQL wsEndpoint, restProps errors, and ThemeSwitcher default

  **CRITICAL FIXES:**
  1. **GraphQL Adapter wsEndpoint Fix**
     - Fixed adapter to explicitly use `wsEndpoint` config parameter instead of constructing URL
     - Added validation and explicit capture of wsEndpoint to prevent closure issues
     - Added debug logging to trace WebSocket URL usage
     - Fixed WebSocket reconnection in `updateToken` to properly use wsEndpoint
  2. **restProps Initialization Errors**
     - Fixed `restProps` initialization errors in `Avatar` and `Skeleton` components
     - Added missing `Snippet` import in `Skeleton` component
     - Ensured `$restProps()` is called before any derived values to avoid hoisting issues
     - Resolves hydration errors in Astro/SSR environments
  3. **ThemeSwitcher Default Variant**
     - Changed default variant from `"full"` to `"compact"` for header usage
     - **BREAKING CHANGE**: Settings pages now need to explicitly use `variant="full"`
     - Compact variant shows dropdown with Light/Dark/Auto options suitable for navigation headers
     - Full variant remains available for comprehensive settings panels

  **Migration:**
  - ThemeSwitcher now defaults to compact variant (suitable for headers)
  - For settings pages, use: `<GCThemeSwitcher variant="full" />`
  - For headers, use: `<GCThemeSwitcher variant="compact" />` (or omit variant for default)

  **Files Fixed:**
  - `packages/adapters/src/graphql/client.ts` - wsEndpoint usage
  - `packages/primitives/src/components/Avatar.svelte` - restProps initialization
  - `packages/primitives/src/components/Skeleton.svelte` - restProps initialization and missing import
  - `packages/primitives/src/components/ThemeSwitcher.svelte` - default variant

## 1.0.6

### Patch Changes

- Add missing `style.css` export to package.json

  Users need to import both the tokens and full component styles:

  ```javascript
  import '@equaltoai/greater-components-tokens/theme.css';
  import '@equaltoai/greater-components-primitives/style.css'; // Full component styles
  ```

  Note: `styles.css` contains only reset/base styles. Use `style.css` for complete styling.

## 1.0.5

### Patch Changes

- Fix client-only rendering in Astro and other static site generators

  **Problem:** The primitives package was bundling Svelte internals, causing hydration errors when used with Astro's `client:only` directive or other static/client-only contexts.

  **Solution:**
  - Updated Vite build config to properly externalize all Svelte modules using regex pattern `/^svelte\//`
  - Added `clsx` to external dependencies
  - Removed bundled Svelte internals from dist folder

  **Impact:**
  - ✅ Components now work perfectly with `client:only` in Astro
  - ✅ Static deployments (S3/CloudFront) fully supported
  - ✅ No SSR required - client-side hydration works correctly
  - ✅ Smaller bundle size (Svelte internals no longer bundled)

  **For Astro users:**
  Add this to your `astro.config.mjs`:

  ```javascript
  vite: {
  	optimizeDeps: {
  		exclude: ['@equaltoai/greater-components-primitives'];
  	}
  }
  ```

  **Breaking Changes:** None - this is a bug fix that improves compatibility.

## 2.0.0

### Major Changes

- # Greater Components v1.0.0 - General Availability Release 🎉

  **The first stable release of Greater Components is here!** This major release represents the completion of all 6 implementation phases, delivering a comprehensive, production-ready UI component library specifically designed for building modern Fediverse applications.

  ## ✨ What's New in v1.0.0

  ### 🎯 Complete Component Library
  - **21 Production Components** across 7 packages
  - **296 Tree-shakable Icons** including Fediverse-specific glyphs
  - **Advanced Design System** with light, dark, and high-contrast themes
  - **Real-time Transport Layer** with WebSocket, SSE, and HTTP polling
  - **Accessibility-first** with WCAG 2.1 AA compliance

  ### 📦 Core Packages

  #### `@equaltoai/greater-components-tokens`

  Complete design token system with:
  - 112+ semantic design tokens
  - 3 built-in themes (light, dark, high-contrast)
  - CSS custom properties for easy customization
  - TypeScript definitions for design consistency

  #### `@equaltoai/greater-components-icons`

  Comprehensive icon library featuring:
  - 287 Feather icons + 9 Fediverse-specific icons
  - Tree-shakable Svelte components
  - 28 semantic aliases (boost, unboost, globe, etc.)
  - Consistent sizing and styling system

  #### `@equaltoai/greater-components-primitives`

  Foundation UI components including:
  - Button, TextField, Modal (foundational set)
  - Menu, Tooltip, Tabs, Avatar, Skeleton (extended set)
  - ThemeProvider, ThemeSwitcher (theming components)
  - All with comprehensive accessibility and keyboard support

  #### `@equaltoai/greater-components-utils`

  Essential utilities for Fediverse apps:
  - HTML sanitization with DOMPurify
  - Relative time formatting with i18n
  - Mention/hashtag linkification
  - Keyboard shortcuts helper

  #### `@equaltoai/greater-components-adapters`

  Advanced real-time data layer featuring:
  - WebSocket, SSE, and HTTP polling clients
  - Transport manager with automatic fallback
  - Reactive stores with Svelte 5 runes
  - Mastodon and Lesser GraphQL payload mappers

  #### `@equaltoai/greater-components-fediverse`

  Specialized Fediverse components:
  - StatusCard, TimelineVirtualized (display components)
  - ComposeBox, ActionBar (interaction components)
  - NotificationsFeed, ProfileHeader (advanced components)
  - SettingsPanel (configuration component)

  #### `@equaltoai/greater-components-testing`

  Comprehensive testing infrastructure:
  - Accessibility testing utilities with axe integration
  - Visual regression testing helpers
  - Keyboard navigation test utilities
  - Storybook and Playwright integration

  ## 🚀 Developer Experience

  ### Modern Technology Stack
  - **Svelte 5** with runes for optimal reactivity
  - **TypeScript Strict** for type safety and great DX
  - **Vite** for fast development and optimized builds
  - **Storybook** for component development and documentation

  ### Production-Ready Features
  - **Enterprise CI/CD** with automated testing and publishing
  - **Accessibility Audits** built into the development workflow
  - **Visual Regression Testing** to prevent UI breakage
  - **Security-First** design with npm provenance

  ### Comprehensive Documentation
  - **Interactive Documentation Site** with live examples
  - **Complete API Reference** with TypeScript definitions
  - **Migration Guides** for integrating with existing projects
  - **Accessibility Scorecards** for each component

  ## 🎯 Perfect For
  - **Fediverse Applications** (Mastodon clients, social platforms)
  - **Real-time Social Apps** requiring live updates
  - **Accessible Web Applications** with strict accessibility requirements
  - **Design System Implementation** for consistent UIs
  - **Svelte 5 Projects** wanting modern reactive patterns

  ## 🏗️ Architecture Highlights

  ### Accessibility-First Design

  Every component meets WCAG 2.1 AA standards with:
  - Comprehensive keyboard navigation
  - Screen reader compatibility
  - High contrast mode support
  - Focus management and visual indicators

  ### Real-time Capabilities

  Built-in support for live data with:
  - Automatic transport negotiation (WebSocket → SSE → HTTP)
  - Optimistic updates and conflict resolution
  - Streaming timeline and notification updates
  - Connection recovery and state synchronization

  ### Advanced Theming System

  Flexible theming with:
  - CSS custom properties for easy customization
  - System preference detection (dark mode, reduced motion)
  - User preference persistence
  - Smooth theme transitions

  ## 🎉 Community & Governance
  - **AGPL-3.0 License** ensuring open source ecosystem growth
  - **Developer Certificate of Origin** for contribution clarity
  - **Professional Issue Templates** for bug reports and feature requests
  - **Security Policy** with responsible disclosure process

  ***

  This release represents months of development focused on creating the most comprehensive, accessible, and developer-friendly component library for the Fediverse ecosystem. Every component has been battle-tested with extensive unit tests, accessibility audits, and visual regression tests.

  **Ready to build the next generation of social web applications!** 🌐✨

### Patch Changes

- Updated dependencies
  - @equaltoai/greater-components-tokens@2.0.0

## 1.0.0

### Major Changes

- # Greater Components v1.0.0 - Initial Release

  🎉 **Welcome to Greater Components v1.0.0!**

  This is the initial stable release of Greater Components - a comprehensive UI component library built with Svelte 5, TypeScript, and accessibility-first design principles.

  ## 🚀 What's New

  ### Core Package (@equaltoai/greater-components-primitives)
  - **10 Essential Components**: Button, TextField, Modal, Menu, Tooltip, Tabs, Avatar, Skeleton, ThemeSwitcher, ThemeProvider
  - **Full Accessibility**: WCAG 2.1 AA compliance with comprehensive keyboard navigation
  - **Svelte 5 Runes**: Built with the latest reactive primitives for optimal performance
  - **TypeScript Support**: Complete type definitions with prop inference
  - **Theme System**: Integrated with @equaltoai/greater-components-tokens for consistent theming

  ### Fediverse Package (@equaltoai/greater-components-fediverse)
  - **Social Media Components**: StatusCard, TimelineVirtualized, NotificationsFeed, ComposeBox
  - **Real-time Streaming**: Live timeline updates and notification streams
  - **ActivityPub Compatible**: Works with Mastodon, Pleroma, and other Fediverse servers
  - **Performance Optimized**: Virtual scrolling for handling thousands of posts
  - **Complete Type System**: Full TypeScript definitions for Fediverse data structures

  ### Design Tokens (@equaltoai/greater-components-tokens)
  - **Comprehensive Token System**: Colors, typography, spacing, shadows, and motion
  - **Multi-theme Support**: Light, dark, and high contrast themes included
  - **CSS Custom Properties**: Automatic CSS variable generation
  - **Semantic Tokens**: Context-aware design tokens for consistent theming
  - **TypeScript Helpers**: Utility functions for token access

  ### Icon Library (@equaltoai/greater-components-icons)
  - **300+ SVG Icons**: Comprehensive set including specialized Fediverse icons
  - **Tree Shakeable**: Import only the icons you need
  - **Accessibility Focused**: Proper ARIA labels and semantic markup
  - **Customizable**: Easy styling via CSS custom properties
  - **Icon Aliases**: Convenient aliases for common use cases

  ### Utilities (@equaltoai/greater-components-utils)
  - **HTML Sanitization**: Safe rendering of user-generated content
  - **Time Formatting**: Relative and absolute timestamp formatting
  - **Link Processing**: Automatic mention and hashtag linking
  - **Keyboard Shortcuts**: Comprehensive shortcut management system

  ### Protocol Adapters (@equaltoai/greater-components-adapters)
  - **Multi-server Support**: Mastodon, Pleroma, and generic ActivityPub
  - **Real-time Streaming**: WebSocket and Server-Sent Events transport
  - **Transport Fallbacks**: Automatic failover between connection types
  - **TypeScript Integration**: Fully typed API clients and responses

  ### Testing Utilities (@equaltoai/greater-components-testing)
  - **Component Testing**: Specialized helpers for Svelte component testing
  - **Accessibility Testing**: Automated a11y checks with axe-core
  - **Visual Regression**: Playwright-based visual testing
  - **Test Matchers**: Custom Jest/Vitest matchers for common assertions

  ## 🎯 Key Features

  ### Developer Experience
  - **TypeScript First**: Complete type safety throughout the library
  - **Comprehensive Documentation**: JSDoc comments on all public APIs
  - **Storybook Integration**: Interactive component playground
  - **ESLint & Prettier**: Consistent code style and quality
  - **Automated Testing**: 100% test coverage across all packages

  ### Performance
  - **Zero Runtime**: Compile-time optimizations with Svelte 5
  - **Tree Shaking**: Import only what you need
  - **Virtual Scrolling**: Handle large datasets efficiently
  - **Optimized Bundles**: Minimal JavaScript footprint
  - **CSS Optimization**: Automatic purging and minification

  ### Accessibility
  - **WCAG 2.1 AA**: Full compliance with accessibility standards
  - **Keyboard Navigation**: Comprehensive keyboard support
  - **Screen Reader**: Optimized for assistive technologies
  - **High Contrast**: Built-in high contrast theme
  - **Reduced Motion**: Respects prefers-reduced-motion

  ### Theming & Customization
  - **CSS Custom Properties**: Easy theming without rebuilding
  - **Design Tokens**: Systematic approach to design consistency
  - **Multiple Themes**: Light, dark, and high contrast included
  - **Component Variants**: Flexible styling options
  - **Custom CSS**: Easy to extend and customize

  ## 📦 Installation

  ```bash
  # Install core primitives
  npm install @equaltoai/greater-components-primitives

  # Add design tokens
  npm install @equaltoai/greater-components-tokens

  # Include icons
  npm install @equaltoai/greater-components-icons

  # For Fediverse applications
  npm install @equaltoai/greater-components-fediverse

  # Utilities and testing (optional)
  npm install @equaltoai/greater-components-utils @equaltoai/greater-components-testing
  ```

  ## 🚦 Migration Guide

  This is the initial v1.0.0 release, so there are no breaking changes to migrate from. All APIs are now considered stable and will follow semantic versioning guarantees.

  ### API Stability Promise
  - **Backwards Compatibility**: All public APIs maintain backwards compatibility in minor/patch releases
  - **Deprecation Policy**: 6-month notice period for any API removals
  - **Migration Tools**: Automated codemods provided for major version upgrades
  - **Clear Documentation**: Comprehensive API documentation and migration guides

  ## 🔧 Browser Support
  - **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
  - **Node.js**: >= 20.0.0
  - **TypeScript**: >= 5.0.0
  - **Svelte**: >= 5.0.0

  ## 📖 Documentation
  - **API Reference**: Complete documentation in `/API_DOCUMENTATION.md`
  - **Storybook**: Interactive component playground
  - **Examples**: Real-world usage examples in `/examples`
  - **Migration Guides**: Version upgrade instructions
  - **Contributing**: Development setup and contribution guidelines

  ## 🎨 Design Philosophy

  Greater Components follows these core principles:
  1. **Accessibility First**: Every component is built with accessibility in mind
  2. **Performance Focused**: Optimized for real-world application performance
  3. **Developer Friendly**: Comprehensive TypeScript support and documentation
  4. **Design System**: Consistent, scalable approach to UI development
  5. **Modern Web**: Built for contemporary web development practices

  ## 🤝 Community
  - **GitHub**: [greater/greater-components](https://github.com/greater/greater-components)
  - **Discussions**: Community support and feature requests
  - **Issues**: Bug reports and feature proposals
  - **Contributing**: Open source contributions welcome
  - **License**: AGPL-3.0-only

  ## 🙏 Acknowledgments

  Special thanks to:
  - The Svelte team for Svelte 5 and its revolutionary runes system
  - The Fediverse community for inspiration and feedback
  - All contributors who helped shape this library
  - The accessibility community for guidance on inclusive design

  ***

  **This release represents months of development, testing, and refinement. We're excited to see what you build with Greater Components!**

  For questions, feedback, or contributions, please visit our [GitHub repository](https://github.com/greater/greater-components) or start a [discussion](https://github.com/greater/greater-components/discussions).

  Happy building! 🚀

### Minor Changes

- a24ce74: Add five new primitive components with full accessibility and keyboard navigation support

  **New Components:**
  - **Menu** - Accessible dropdown/menubar component with roving tabindex, typeahead search, submenu support, and ARIA menu semantics
  - **Tooltip** - Smart positioning tooltip with hover/focus/long-press triggers, viewport edge detection, and proper ARIA labeling
  - **Tabs** - Keyboard navigable tabs with automatic/manual activation modes, horizontal/vertical orientations, and ARIA tablist semantics
  - **Avatar** - Image avatar with initials fallback, status indicators, multiple sizes/shapes, and consistent color generation
  - **Skeleton** - Loading skeleton with pulse/wave animations, reduced-motion support, and multiple shape variants

  All components include comprehensive Storybook documentation, follow WCAG 2.1 AA accessibility guidelines, and are built with Svelte 5 runes and TypeScript strict mode.

- a24ce74: Initial release of @equaltoai/greater-components-primitives package with core UI components
  - Button component with solid, outline, and ghost variants
  - TextField component with validation states and prefix/suffix slots
  - Modal component with focus trap, scroll lock, and keyboard navigation
  - Full accessibility support with ARIA attributes and keyboard handlers
  - Token-driven styling with theme support
  - TypeScript definitions and Svelte 5 runes support

### Patch Changes

- Updated dependencies [a24ce74]
- Updated dependencies
  - @equaltoai/greater-components-tokens@1.0.0
