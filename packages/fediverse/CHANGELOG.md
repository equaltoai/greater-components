# @equaltoai/greater-components-fediverse

## 1.2.1

### Patch Changes

- Updated dependencies
  - @equaltoai/greater-components-primitives@1.0.13

## 1.2.0

### Minor Changes

- 5863b88: Add actor timeline support

  **New Feature:**
  - Add `ACTOR` timeline type support for fetching posts from specific actors
  - Add `fetchActorTimeline()` convenience method to `LesserGraphQLAdapter`
  - Update GraphQL query to support `actorId` and `mediaOnly` parameters
  - Regenerate TypeScript types from updated Lesser schema

  **Files Changed:**
  - `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` - Add `fetchActorTimeline()` method
  - `packages/fediverse/src/adapters/graphql/documents/timeline.graphql` - Add `actorId` and `mediaOnly` parameters
  - `schemas/lesser/schema.graphql` - Update to latest Lesser schema with ACTOR timeline type
  - `packages/adapters/tests/graphql/LesserGraphQLAdapter.test.ts` - Add test for new method

  **Usage:**

  ```typescript
  const timeline = await adapter.fetchActorTimeline('actor-id', {
  	first: 20,
  	mediaOnly: false,
  });
  ```

### Patch Changes

- Align packages with the latest Lesser GraphQL schema (including `quoteId` support) and harden timeline data handling. Adapters now normalize missing timestamps/relationships, the fediverse docs and generated types stay in sync with the schema, and the TextField primitive correctly styles the `:read-only` state.
- Updated dependencies [5863b88]
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.2.0
  - @equaltoai/greater-components-primitives@1.0.12

## 1.1.0

### Minor Changes

- Add actor timeline support

  **New Feature:**
  - Add `ACTOR` timeline type support for fetching posts from specific actors
  - Add `fetchActorTimeline()` convenience method to `LesserGraphQLAdapter`
  - Update GraphQL query to support `actorId` and `mediaOnly` parameters
  - Regenerate TypeScript types from updated Lesser schema

  **Files Changed:**
  - `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` - Add `fetchActorTimeline()` method
  - `packages/fediverse/src/adapters/graphql/documents/timeline.graphql` - Add `actorId` and `mediaOnly` parameters
  - `schemas/lesser/schema.graphql` - Update to latest Lesser schema with ACTOR timeline type
  - `packages/adapters/tests/graphql/LesserGraphQLAdapter.test.ts` - Add test for new method

  **Usage:**

  ```typescript
  const timeline = await adapter.fetchActorTimeline('actor-id', {
  	first: 20,
  	mediaOnly: false,
  });
  ```

### Patch Changes

- Fix `createNote()` missing input variable wrapper

  **CRITICAL FIX:**
  - Fix `LesserGraphQLAdapter.createNote()` to wrap variables in `input` object before sending to GraphQL API
  - Fix `createQuoteNote()` for consistency with the same pattern
  - Update `buildCreateNoteVariables()` to return `CreateNoteInput` directly instead of wrapped object
  - This resolves 422 validation errors where the server expected `{ input: { ... } }` but received unwrapped variables

  **Files Changed:**
  - `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` - Wrap input in `{ input: ... }` for both `createNote()` and `createQuoteNote()`
  - `packages/fediverse/src/components/Compose/GraphQLAdapter.ts` - Update callers to pass input directly

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.1.0

## 1.0.9

### Patch Changes

- Fix `createNote()` missing input variable wrapper

  **CRITICAL FIX:**
  - Fix `LesserGraphQLAdapter.createNote()` to wrap variables in `input` object before sending to GraphQL API
  - Fix `createQuoteNote()` for consistency with the same pattern
  - Update `buildCreateNoteVariables()` to return `CreateNoteInput` directly instead of wrapped object
  - This resolves 422 validation errors where the server expected `{ input: { ... } }` but received unwrapped variables

  **Files Changed:**
  - `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` - Wrap input in `{ input: ... }` for both `createNote()` and `createQuoteNote()`
  - `packages/fediverse/src/components/Compose/GraphQLAdapter.ts` - Update callers to pass input directly

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.8

## 1.0.8

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.7

## 1.0.7

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.6

## 1.0.6

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.5

## 1.0.5

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.4
  - @equaltoai/greater-components-primitives@1.0.11

## 1.0.4

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @equaltoai/greater-components-primitives@1.0.10
  - @equaltoai/greater-components-adapters@1.0.3

## 1.0.3

### Patch Changes

- Updated dependencies
  - @equaltoai/greater-components-primitives@1.0.9
  - @equaltoai/greater-components-adapters@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies
  - @equaltoai/greater-components-primitives@1.0.1

## 1.0.1

### Patch Changes

- GraphQL Integration for Followers, Preferences, and Push Notifications

  This patch adds comprehensive GraphQL support for user relationships, preferences, and push notification management:

  **New GraphQL Queries:**
  - followers(username, limit, cursor) - Paginated followers list
  - following(username, limit, cursor) - Paginated following list
  - userPreferences - Fetch all user preferences
  - pushSubscription - Get current push subscription

  **New GraphQL Mutations:**
  - updateProfile(input) - Update profile with all fields
  - updateUserPreferences(input) - Update preferences
  - updateStreamingPreferences(input) - Update streaming settings
  - registerPushSubscription(input) - Register push notifications
  - updatePushSubscription(input) - Update push alerts
  - deletePushSubscription - Remove push subscription

  **Adapter Enhancements:**
  - 10 new methods in LesserGraphQLAdapter
  - 3 type converter functions
  - Apollo cache policies for efficient pagination
  - Full TypeScript type safety

  **Examples:**
  - ProfilePageExample updated with GraphQL followers/following
  - New PreferencesExample component
  - New PushNotificationsExample component

  **Live API:**
  - Configured for https://dev.lesser.host/api/graphql
  - WebSocket support at wss://dev.lesser.host/api/graphql

  No breaking changes - fully backward compatible.

- Updated dependencies
  - @equaltoai/greater-components-adapters@1.0.1

## 2.1.0

### Minor Changes

#### GraphQL Integration for Followers, Preferences, and Push Notifications

This release adds comprehensive GraphQL support for user relationships, preferences, and push notification management:

**New GraphQL Queries:**

- `followers(username, limit, cursor)` - Paginated followers list with ActorListPage support
- `following(username, limit, cursor)` - Paginated following list with ActorListPage support
- `userPreferences` - Fetch all user preferences (posting, reading, discovery, streaming, notifications, privacy)
- `pushSubscription` - Get current push notification subscription

**New GraphQL Mutations:**

- `updateProfile(input)` - Update profile with displayName, bio, avatar, header, locked, bot, discoverable, noIndex, sensitive, language, and custom fields
- `updateUserPreferences(input)` - Update all user preferences at once
- `updateStreamingPreferences(input)` - Update streaming-specific preferences
- `registerPushSubscription(input)` - Register new push notification subscription with keys and alert preferences
- `updatePushSubscription(input)` - Update push notification alert preferences
- `deletePushSubscription` - Remove push notification subscription

**Adapter Enhancements:**

- Added `LesserGraphQLAdapter.getFollowers()` and `LesserGraphQLAdapter.getFollowing()` methods
- Added `LesserGraphQLAdapter.updateProfile()` for profile updates
- Added `LesserGraphQLAdapter.getUserPreferences()` and `LesserGraphQLAdapter.updateUserPreferences()`
- Added `LesserGraphQLAdapter.updateStreamingPreferences()` for media streaming settings
- Added complete push notification lifecycle methods: `getPushSubscription()`, `registerPushSubscription()`, `updatePushSubscription()`, `deletePushSubscription()`

**Type Converters:**

- Added `convertGraphQLActorListPage()` for follower/following pagination
- Added `convertGraphQLUserPreferences()` for structured preference data
- Added `convertGraphQLPushSubscription()` for push subscription data

**Apollo Cache Configuration:**

- Updated followers/following cache policies to use username-based keys and ActorListPage structure
- Added UserPreferences cache policy with actorId as key
- Added PushSubscription cache policy with id as key
- Configured proper merge strategies for pagination and updates

**Example Implementations:**

- Updated ProfilePageExample with GraphQL followers/following pagination
- Created PreferencesExample showing GraphQL-backed settings management
- Created PushNotificationsExample demonstrating push registration and alert management

**Migration Notes:**

- Components using followers/following data can now leverage cursor-based pagination with `nextCursor` and `totalCount`
- Profile editing now supports all Lesser-specific fields including trust and reputation data
- Preferences are now structured by category (posting, reading, discovery, streaming, notifications, privacy)
- Push notifications support granular alert controls for all notification types

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
  - @equaltoai/greater-components-icons@2.0.0
  - @equaltoai/greater-components-primitives@2.0.0
  - @equaltoai/greater-components-tokens@2.0.0
  - @equaltoai/greater-components-utils@2.0.0

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

- a24ce74: Initial release of @equaltoai/greater-components-fediverse package with read-only Fediverse UI components:
  - **ContentRenderer**: Renders sanitized HTML content with support for spoiler text, mentions, and hashtags
  - **StatusCard**: Displays a single status/post with full anatomy including avatar, content, media attachments, and action bar
  - **TimelineVirtualized**: Efficient virtualized timeline for rendering thousands of items with scroll position preservation
  - Full TypeScript support and accessibility features
  - Supports both compact and comfortable density variants

### Patch Changes

- Updated dependencies [a24ce74]
- Updated dependencies [a24ce74]
- Updated dependencies [a24ce74]
- Updated dependencies [a24ce74]
- Updated dependencies [a24ce74]
- Updated dependencies
  - @equaltoai/greater-components-icons@1.0.0
  - @equaltoai/greater-components-primitives@1.0.0
  - @equaltoai/greater-components-tokens@1.0.0
  - @equaltoai/greater-components-utils@1.0.0
