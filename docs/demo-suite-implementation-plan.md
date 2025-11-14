# Greater Components Demo Suite: Comprehensive Implementation Plan

## Executive Summary

Greater Components is a modern, Svelte 5-based component library designed for Fediverse applications. The current codebase demonstrates a sophisticated architecture with proper separation of concerns across multiple packages (`icons`, `primitives`, `tokens`, `fediverse`, etc.). However, the demo system requires a structured, phased approach to ensure consistency, modern practices, and proper dependency management.

This plan outlines a systematic approach to build a comprehensive demo suite that progresses from core primitives to complex ActivityPub components, ensuring all code follows Svelte 5 runes syntax, modern TypeScript practices, and consistent design patterns.

## Playground CSR-Only Mode

- Default `pnpm --filter @equaltoai/playground dev` keeps SSR enabled for the playground shell.
- Run `pnpm dev:playground:csr` (alias for `pnpm --filter @equaltoai/playground dev --mode csr`) whenever you need a CSR-only server; this loads `apps/playground/.env.csr` which flips the layout’s `ssr` export off.
- Any command (including Playwright) can also opt into CSR by setting `PLAYGROUND_CSR_ONLY=true` or `PLAYGROUND_RUNTIME=csr`, which automatically passes `--mode csr` to the playground dev server via `packages/testing/playwright.demo.config.ts`.
- During Phase 2 we eliminated the remaining direct DOM + Clipboard references: the landing page theme toggle now checks `browser` before touching `document.documentElement`, and both the icon gallery + generic code sample components gate their clipboard usage so CSR builds never import `navigator` on the server.
- Phase 3 hardened the shared packages for CSR as well: primitives Modal/ThemeSwitcher effects now no-op when the DOM is unavailable, headless Avatar skips reloads without `window`, and fediverse auth/settings surfaces guard clipboard/print/download affordances behind browser checks so SSR builds never evaluate `document`/`navigator`.
- Phase 4 adds a dedicated CSR Playwright config and scripts:
  - `pnpm --filter @equaltoai/greater-components-testing test:demo` exercises the demo suite against the default SSR dev server.
  - `pnpm --filter @equaltoai/greater-components-testing test:demo:csr` drives the exact same specs against the CSR-only build (via `playwright.demo.csr.config.ts`).
  - `pnpm --filter @equaltoai/greater-components-testing test:e2e` runs both commands sequentially so CI can cover SSR + CSR in one job; reports write to `playwright-report/demo` (SSR) and `playwright-report/demo-csr`.

## Phase 1: Foundation & Core Primitives

### Goal: Establish a solid foundation with properly built and tested core components

#### Tasks:

1. **Package Build System Audit**
   - Verify all packages use consistent Svelte 5.43.6 version
   - Ensure `@sveltejs/package` is used for component libraries instead of custom Vite builds
   - Standardize build scripts across all packages
   - Implement proper TypeScript declaration generation

2. **Design Tokens Implementation**
   - Build `@equaltoai/greater-components-tokens` package
   - Generate `theme.css` with all CSS variables
   - Verify tokens work in both light/dark/high-contrast modes
   - Create token documentation

3. **Icon System Validation**
   - Build `@equaltoai/greater-components-icons` package
   - Verify all 300+ icons export correctly with Svelte 5 syntax
   - Test icon imports in isolation
   - Create comprehensive icon demo page

4. **Core Primitives Development**
   - Build `@equaltoai/greater-components-primitives` package
   - Validate all components use Svelte 5 runes syntax (`$state`, `$derived`, `$props`, `$effect`)
   - Ensure proper accessibility (keyboard navigation, ARIA attributes)
   - Implement comprehensive unit tests for each primitive

5. **Demo Infrastructure Setup**
   - Configure playground app to consume built packages (not source files)
   - Set up proper alias configuration in `svelte.config.js`
   - Create base layout with token CSS imports
   - Implement consistent demo page structure

## Phase 2: Basic Component Demos

### Goal: Create comprehensive demos for all core primitives

#### Tasks:

1. **Button Component Demo**
   - Showcase all variants (solid, outline, ghost)
   - Demonstrate all sizes (sm, md, lg)
   - Test disabled and loading states
   - Show icon integration (prefix, suffix, icon-only)
   - Implement form button types (submit, reset, button)
   - Add interactive functionality with state management

2. **Form Components Demo**
   - TextField with validation, error states, labels
   - TextArea with auto-resize and character counting
   - Select dropdown with keyboard navigation
   - Checkbox and Radio button groups
   - FileUpload with drag-and-drop and preview
   - Switch toggle component

3. **Layout Components Demo**
   - Avatar with fallbacks and status indicators
   - Skeleton loading states
   - Modal with proper focus management and accessibility
   - Tabs with keyboard navigation and orientation support
   - Tooltip with proper positioning and delay

4. **Interactive Components Demo**
   - Menu/ContextMenu with keyboard navigation
   - ThemeSwitcher with system preference detection
   - ThemeProvider for consistent theming

5. **Demo Page Standards**
   - Consistent page structure with header, sections, examples
   - Interactive examples with editable props
   - Code snippets showing implementation
   - Accessibility compliance indicators
   - Performance metrics

## Phase 3: Fediverse-Specific Components

### Goal: Build and demonstrate Fediverse-optimized components

#### Tasks:

1. **Status Card Component**
   - Implement `StatusCard` with proper ActivityPub data structure
   - Support for media attachments (images, videos)
   - Content warning/spoiler text handling
   - Interaction buttons (like, boost, reply, share)
   - User avatar and profile information
   - Timestamp formatting with relative time
   - Thread/reply visualization

2. **Compose Component**
   - Multi-featured compose form
   - Media upload with drag-and-drop
   - Content warning toggle
   - Visibility selector (public, unlisted, private, direct)
   - Character counting with validation
   - Mention autocomplete
   - Poll creation support
   - Draft saving functionality

3. **Timeline Component**
   - Virtualized scrolling for performance
   - Infinite scroll loading
   - Timeline filtering (home, local, federated, lists)
   - Status card rendering with proper caching
   - Loading and empty states
   - Error handling and retry mechanisms

4. **Profile Components**
   - Profile header with cover image and avatar
   - User statistics (posts, following, followers)
   - Profile tabs (posts, replies, media, likes)
   - Follow/following buttons with proper states
   - Pinned posts display

5. **Notification Components**
   - Notification list with different types (mention, follow, boost, like)
   - Notification filtering and clearing
   - Real-time updates support

## Phase 4: Complex Application Demos

### Goal: Create full-featured application demos showcasing component integration

#### Tasks:

1. **Complete Timeline Application**
   - Integrated timeline with compose form
   - Navigation sidebar with proper icons
   - User profile integration
   - Notification system
   - Settings panel
   - Responsive design for mobile/desktop

2. **Profile Application**
   - Full user profile with all tabs
   - Edit profile functionality
   - Media gallery view
   - Following/followers lists
   - Pinned posts management

3. **Settings Application**
   - Comprehensive settings panel
   - Theme and appearance settings
   - Privacy and security settings
   - Notification preferences
   - Account management

4. **Search Application**
   - Search interface with filters
   - Results display (statuses, accounts, hashtags)
   - Semantic search integration (Lesser API feature)
   - Search history and suggestions

## Phase 5: Documentation & Testing

### Goal: Ensure comprehensive documentation and testing coverage

#### Tasks:

1. **Interactive Documentation**
   - Component API documentation with props, events, slots
   - Live editable examples
   - Accessibility guidelines
   - Performance best practices
   - Theming and customization guides

2. **Comprehensive Testing**
   - Unit tests for all components (90%+ coverage)
   - Integration tests for component interactions
   - Accessibility tests (a11y compliance)
   - Visual regression tests
   - Performance tests (bundle size, render time)
   - E2E tests for demo applications

3. **Build & Deployment**
   - Optimized production builds
   - Bundle size monitoring
   - Lighthouse performance scoring (95+ target)
   - Deployment to demo environment
   - Version management and changelogs

### Phase 5 Status — 2025-02-18

- ✅ New documentation routes at `/demo-suite`, `/demo-suite/timeline`, `/demo-suite/profile`, `/demo-suite/settings`, and `/demo-suite/search` covering props, handlers, accessibility, performance, and testing guidance for every Phase 4 surface.
- ✅ Added primitive docs for `/components/tabs` and `/components/switch`, mirroring the components used heavily inside the demo suite.
- ✅ Storage + timeline controllers now have Vitest coverage (`apps/playground/src/lib/stores/storage.test.ts`, `packages/fediverse/tests/timelineStore.test.ts`), and Playwright specs live in `packages/testing/tests/demo/{timeline,profile,settings,search}.spec.ts`.
- ✅ Playground build scored **98/100/100/100** (Performance/Accessibility/Best Practices/SEO) via Lighthouse and is logged alongside deployment commands in `docs/deployment/demo-suite.md`.
- ✅ Playwright demo suite passes end-to-end after stabilizing the `/profile`, `/search`, and `/timeline` routes (rest props handling, toast updates, and simplified virtualization), locking Phase 5 runtime coverage in place.

## Technical Standards & Requirements

### Svelte 5 Modern Practices
- **Runes Syntax**: All components must use `$state`, `$derived`, `$props`, `$effect`
- **No Legacy Syntax**: No `export let`, `$:`, `createEventDispatcher`, or class components
- **Snippet-Based Composition**: Use `{#snippet}` instead of slots for component composition
- **Modern Event Handling**: Use `onclick` instead of `on:click` directives

### TypeScript Standards
- **Strict Mode**: All packages use TypeScript strict mode
- **Comprehensive Types**: Full type coverage for all props, events, and public APIs
- **Generic Components**: Where applicable, components should support generic types
- **Type Safety**: No `any` or `unknown` without proper validation

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: All components must meet accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Attributes**: Proper ARIA roles, states, and properties
- **Focus Management**: Proper focus handling for modals, menus, and dialogs
- **Reduced Motion**: Support for `prefers-reduced-motion` media query

### Performance Requirements
- **Bundle Size**: Individual components < 5KB gzipped
- **Tree Shaking**: Full support for tree shaking unused components
- **Lazy Loading**: Support for dynamic imports where appropriate
- **Virtualization**: Virtualized lists for large datasets
- **Lighthouse Score**: 95+ performance score for all demo pages

### Design System Consistency
- **Design Tokens**: All styling must use design tokens from `@equaltoai/greater-components-tokens`
- **Consistent Spacing**: Use token-based spacing system
- **Typography System**: Consistent font families, sizes, and line heights
- **Color System**: Semantic color usage with proper contrast ratios
- **Motion System**: Consistent animation timing and easing

## Implementation Guidelines

### Package Architecture
```
packages/
├── tokens/           # Design tokens and CSS variables
├── icons/            # Icon components (300+ icons)
├── primitives/       # Core UI components (Button, TextField, etc.)
├── fediverse/        # Fediverse-specific components (StatusCard, Timeline, etc.)
├── adapters/         # API adapters and data layer
├── utils/            # Shared utilities and helpers
└── testing/          # Testing utilities and fixtures

apps/
├── docs/             # Documentation site
└── playground/       # Demo and testing playground
```

### Component Structure
Each component should follow this structure:
```svelte
<!-- Component.svelte -->
<script lang="ts">
  // TypeScript interface for props
  interface Props { /* ... */ }
  
  // Svelte 5 runes syntax
  let { prop1, prop2, ...rest } = $props();
  
  // Derived state and effects
  const derivedValue = $derived(/* ... */);
  $effect(() => { /* ... */ });
</script>

<!-- Component markup with proper accessibility -->
<div role="..." aria-...="..." {...rest}>
  <!-- Content with snippet composition -->
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  /* Scoped styles using design tokens */
  :global(.gr-component) {
    --color: var(--gr-semantic-color-primary);
  }
</style>
```

### Demo Page Structure
```svelte
<!-- +page.svelte -->
<script lang="ts">
  // Import from built packages, not source
  import { Component } from '@equaltoai/greater-components-primitives';
  import { Icon } from '@equaltoai/greater-components-icons';
</script>

<div class="demo-page">
  <header>
    <h1>Component Name</h1>
    <p>Description of component and use cases</p>
  </header>
  
  <section>
    <h2>Basic Usage</h2>
    <Component />
  </section>
  
  <section>
    <h2>Variants</h2>
    <!-- Show all variants -->
  </section>
  
  <!-- Additional sections as needed -->
</div>
```

## Success Metrics

### Technical Metrics
- ✅ All packages build successfully with `pnpm build`
- ✅ Playground app runs without errors at `http://localhost:5173`
- ✅ All demos accessible via navigation
- ✅ TypeScript compilation passes with strict mode
- ✅ Bundle size within performance requirements

### Quality Metrics
- ✅ 90%+ test coverage for all packages
- ✅ WCAG 2.1 AA compliance for all components
- ✅ Lighthouse performance score 95+
- ✅ No accessibility violations in automated tests
- ✅ Consistent design across all components

### User Experience Metrics
- ✅ Intuitive navigation between demos
- ✅ Clear documentation and examples
- ✅ Interactive examples with editable props
- ✅ Responsive design for all screen sizes
- ✅ Fast loading and interaction times

## Timeline & Milestones

### Week 1: Foundation
- Complete Phase 1 (Foundation & Core Primitives)
- Ensure all packages build and import correctly
- Create basic icon and button demos

### Week 2: Core Components
- Complete Phase 2 (Basic Component Demos)
- Implement all form and layout components
- Create comprehensive demo pages

### Week 3: Fediverse Components
- Complete Phase 3 (Fediverse-Specific Components)
- Implement StatusCard, Compose, and Timeline
- Ensure proper ActivityPub data handling

### Week 4: Applications & Documentation
- Complete Phase 4 (Complex Application Demos)
- Complete Phase 5 (Documentation & Testing)
- Final performance optimization and testing

This plan ensures a systematic, quality-focused approach to building the Greater Components demo suite while maintaining modern Svelte 5 practices and consistent design patterns throughout.
