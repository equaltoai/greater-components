# @equaltoai/greater-components-headless Changelog

## 2.0.0

### Major Changes

- 5a9bb32: # Greater Components 3.0.0 - Faces Architecture

  ## Breaking Changes

  ### Package Structure Reorganization
  - **`fediverse` renamed to `faces/social`**: The fediverse package is now `@equaltoai/greater-components-social` and accessed via `@equaltoai/greater-components/faces/social`
  - **CodeBlock and MarkdownRenderer moved to `content`**: These components with heavy dependencies (shiki, marked, dompurify) are now in a separate `@equaltoai/greater-components/content` package
  - **Shared components extracted**: Auth, Admin, Compose, Messaging, Search, and Notifications are now in separate packages under `shared/`

  ### Import Path Changes

  ```typescript
  // OLD (v2.x)
  import { Timeline } from '@equaltoai/greater-components/fediverse';
  import { CodeBlock } from '@equaltoai/greater-components/primitives';

  // NEW (v3.0)
  import { Timeline } from '@equaltoai/greater-components/faces/social';
  import { CodeBlock } from '@equaltoai/greater-components/content';
  ```

  ### New Package Paths
  - `@equaltoai/greater-components/content` - CodeBlock, MarkdownRenderer
  - `@equaltoai/greater-components/faces/social` - Timeline, Status, etc.
  - `@equaltoai/greater-components/shared/auth` - Authentication components
  - `@equaltoai/greater-components/shared/admin` - Admin dashboard
  - `@equaltoai/greater-components/shared/compose` - Post composer
  - `@equaltoai/greater-components/shared/messaging` - Direct messages
  - `@equaltoai/greater-components/shared/search` - Search components
  - `@equaltoai/greater-components/shared/notifications` - Notification feed

  ## Why This Change?
  1. **Lighter core package**: Apps using only Button, Card, etc. no longer pull in shiki (~2MB) and other heavy dependencies
  2. **Face-based architecture**: Organized by use case (social, blog, forum, etc.) rather than technical grouping
  3. **Shared components**: Auth, Admin, etc. can be reused across different "faces"
  4. **Future extensibility**: Ready for new faces (visual, blog, forum, commerce, video, docs, chat)

  ## Migration Guide
  1. Update import paths for fediverse → faces/social
  2. Update import paths for CodeBlock/MarkdownRenderer → content
  3. Update CSS imports to include face-specific styles if needed

## 1.0.2

### Patch Changes

- Fix broken package imports in the umbrella package by rewriting internal workspace references to relative paths.
  Fix TypeScript error in icons package registry lookup.
  Update documentation to correctly reflect the single-package installation strategy.
  Update focus-trap dependency in headless package.

## 1.0.1

### Patch Changes

- Align every package with the shared Vitest 4 toolchain, clean up the rune-incompatible Timeline unit specs, and document that Timeline coverage now lives in the demo/E2E suite.

All notable changes to the headless package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

## [1.0.0] - 2025-10-11

### Added

- **Initial Release** - Headless UI primitives package created
- **Button Primitive** - Fully accessible headless button with:
  - Keyboard navigation (Enter, Space activation)
  - Loading state support with aria-busy
  - Disabled state handling with aria-disabled
  - Toggle button support with aria-pressed
  - Focus management
  - Programmatic control methods (click, focus, setDisabled, setLoading)
  - Bundle size: 0.95KB gzipped (meets < 2KB target)
- **Core Utilities**
  - ID generation and management
  - Keyboard event helpers (isActivationKey, isEscapeKey, isArrowKey, etc.)
  - Navigation direction detection
- **Type System**
  - BaseBuilderConfig interface
  - ActionReturn type for Svelte actions
  - Builder pattern types
  - ElementAttributes for ARIA support
- **Build System**
  - Tree-shakeable ESM output
  - preserveModules enabled for optimal code splitting
  - Individual component exports
  - Source maps included
- **Documentation**
  - Comprehensive README with examples
  - JSDoc comments throughout
  - TypeScript definitions for excellent IDE support

### Technical Details

- Built with Svelte 5 runes for optimal reactivity
- TypeScript strict mode enabled
- Zero runtime dependencies (except Svelte peer dependency)
- WCAG 2.1 AA compliant
- Full keyboard navigation support
- Production-ready accessibility

### Performance

- Button primitive: 0.95KB gzipped
- Build time: ~50ms
- Tree-shakeable exports

---

## Release Notes

### 1.0.0 - Headless Architecture Foundation

This initial release establishes the foundation for Greater Components' headless architecture. The button primitive serves as the blueprint for all future headless components, demonstrating:

1. **Behavior without styling** - Complete functionality with zero CSS opinions
2. **Accessibility first** - Full ARIA support, keyboard navigation, focus management
3. **Performance optimized** - Sub-1KB gzipped size
4. **Developer-friendly** - Simple API, excellent TypeScript support
5. **Production validated** - Used in Lesser ActivityPub client

The headless approach allows developers to:

- Use any styling solution (Tailwind, CSS Modules, Styled Components, etc.)
- Customize appearance without fighting library defaults
- Build custom design systems on solid behavioral foundations
- Keep bundle sizes minimal by importing only what's needed

### Coming Soon

- Modal primitive (focus trap, ESC handling, backdrop clicks)
- Menu primitive (keyboard navigation, typeahead, nested menus)
- Tooltip primitive (smart positioning, hover/focus triggers)
- Tabs primitive (arrow key navigation, ARIA semantics)
- Dialog primitive (portal rendering, scroll locking)
- Combobox primitive (autocomplete, keyboard selection)

### Breaking Changes from @equaltoai/greater-components-primitives

The headless package is designed to eventually replace the styled primitives. Migration path:

**Old (styled):**

```svelte
<Button variant="solid" size="md" onclick={handler}>Click me</Button>
```

**New (headless):**

```svelte
<script>
	const button = createButton({ onClick: handler });
</script>

<button use:button.actions.button class="your-styles"> Click me </button>
```

Both will be supported during transition period (6 months), after which styled components will be deprecated in favor of headless + example styled implementations.
