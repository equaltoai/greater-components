# @equaltoai/greater-components-headless Changelog

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
<Button variant="solid" size="md" onclick={handler}>
  Click me
</Button>
```

**New (headless):**
```svelte
<script>
  const button = createButton({ onClick: handler });
</script>

<button use:button.actions.button class="your-styles">
  Click me
</button>
```

Both will be supported during transition period (6 months), after which styled components will be deprecated in favor of headless + example styled implementations.

