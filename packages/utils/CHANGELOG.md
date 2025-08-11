# @greater/utils

## 1.0.0

### Major Changes

- # Greater Components v1.0.0 - Initial Release

  🎉 **Welcome to Greater Components v1.0.0!**

  This is the initial stable release of Greater Components - a comprehensive UI component library built with Svelte 5, TypeScript, and accessibility-first design principles.

  ## 🚀 What's New

  ### Core Package (@greater/primitives)
  - **10 Essential Components**: Button, TextField, Modal, Menu, Tooltip, Tabs, Avatar, Skeleton, ThemeSwitcher, ThemeProvider
  - **Full Accessibility**: WCAG 2.1 AA compliance with comprehensive keyboard navigation
  - **Svelte 5 Runes**: Built with the latest reactive primitives for optimal performance
  - **TypeScript Support**: Complete type definitions with prop inference
  - **Theme System**: Integrated with @greater/tokens for consistent theming

  ### Fediverse Package (@greater/fediverse)
  - **Social Media Components**: StatusCard, TimelineVirtualized, NotificationsFeed, ComposeBox
  - **Real-time Streaming**: Live timeline updates and notification streams
  - **ActivityPub Compatible**: Works with Mastodon, Pleroma, and other Fediverse servers
  - **Performance Optimized**: Virtual scrolling for handling thousands of posts
  - **Complete Type System**: Full TypeScript definitions for Fediverse data structures

  ### Design Tokens (@greater/tokens)
  - **Comprehensive Token System**: Colors, typography, spacing, shadows, and motion
  - **Multi-theme Support**: Light, dark, and high contrast themes included
  - **CSS Custom Properties**: Automatic CSS variable generation
  - **Semantic Tokens**: Context-aware design tokens for consistent theming
  - **TypeScript Helpers**: Utility functions for token access

  ### Icon Library (@greater/icons)
  - **300+ SVG Icons**: Comprehensive set including specialized Fediverse icons
  - **Tree Shakeable**: Import only the icons you need
  - **Accessibility Focused**: Proper ARIA labels and semantic markup
  - **Customizable**: Easy styling via CSS custom properties
  - **Icon Aliases**: Convenient aliases for common use cases

  ### Utilities (@greater/utils)
  - **HTML Sanitization**: Safe rendering of user-generated content
  - **Time Formatting**: Relative and absolute timestamp formatting
  - **Link Processing**: Automatic mention and hashtag linking
  - **Keyboard Shortcuts**: Comprehensive shortcut management system

  ### Protocol Adapters (@greater/adapters)
  - **Multi-server Support**: Mastodon, Pleroma, and generic ActivityPub
  - **Real-time Streaming**: WebSocket and Server-Sent Events transport
  - **Transport Fallbacks**: Automatic failover between connection types
  - **TypeScript Integration**: Fully typed API clients and responses

  ### Testing Utilities (@greater/testing)
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
  npm install @greater/primitives

  # Add design tokens
  npm install @greater/tokens

  # Include icons
  npm install @greater/icons

  # For Fediverse applications
  npm install @greater/fediverse

  # Utilities and testing (optional)
  npm install @greater/utils @greater/testing
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

- a24ce74: Initial release of @greater/utils package with utility functions for Fediverse components:
  - `sanitizeHtml` - Sanitize HTML content with DOMPurify allow-list approach
  - `relativeTime` - Format dates as relative time with locale support
  - `linkifyMentions` - Convert mentions, hashtags, and URLs to clickable links
  - `keyboardShortcuts` - Helper for managing keyboard shortcuts
  - Full TypeScript support and comprehensive test coverage
