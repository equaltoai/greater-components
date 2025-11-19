# Greater Components: Layout & Typography Components Implementation Plan

**Document Purpose:** Define specifications and implementation phases for 5 new primitive components to eliminate PAI hallucinations and enable general-purpose website development.

**Target Package:** `@equaltoai/greater-components-primitives`

**Created:** 2025-11-19  
**Status:** Planning Phase

---

## Components Overview

| Component | Priority | Complexity | Reference Component |
|-----------|----------|------------|---------------------|
| Card | HIGH | Medium | Modal (structure), Avatar (variants) |
| Container | HIGH | Low | Skeleton (simple layout) |
| Section | MEDIUM | Low | Skeleton (simple layout) |
| Heading | MEDIUM | Medium | Button (variants/sizes) |
| Text | MEDIUM | Medium | Button (variants/sizes) |

---

## PHASE 1: Card Component

### Specification

**File:** `packages/primitives/src/components/Card.svelte`

**Purpose:** Content container with elevation, borders, and semantic sections for feature displays, pricing cards, content blocks, and information panels.

**Props Interface:**
```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card.
   * - `elevated`: Card with shadow (default)
   * - `outlined`: Card with border
   * - `filled`: Card with background fill
   * 
   * @defaultValue 'elevated'
   */
  variant?: 'elevated' | 'outlined' | 'filled';
  
  /**
   * Internal padding amount.
   * - `none`: No padding
   * - `sm`: 0.75rem padding
   * - `md`: 1rem padding (default)
   * - `lg`: 1.5rem padding
   * 
   * @defaultValue 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether the card is clickable/interactive.
   * When true, renders as button with hover states.
   * 
   * @defaultValue false
   */
  clickable?: boolean;
  
  /**
   * Whether to show hover effects.
   * 
   * @defaultValue false
   */
  hoverable?: boolean;
  
  /**
   * Additional CSS classes.
   */
  class?: string;
  
  /**
   * Header content snippet.
   */
  header?: Snippet;
  
  /**
   * Footer content snippet.
   */
  footer?: Snippet;
  
  /**
   * Main content snippet.
   */
  children?: Snippet;
}
```

**Design Tokens to Use:**
```css
/* Background */
--gr-semantic-background-primary
--gr-semantic-background-secondary
--gr-semantic-background-tertiary

/* Borders */
--gr-semantic-border-default
--gr-semantic-border-strong

/* Shadows */
--gr-shadows-md
--gr-shadows-lg

/* Radius */
--gr-radii-lg

/* Spacing */
--gr-spacing-scale-3  /* sm padding */
--gr-spacing-scale-4  /* md padding */
--gr-spacing-scale-6  /* lg padding */

/* Focus */
--gr-semantic-focus-ring
```

**Accessibility Requirements:**
- Default element: `<div>` or `<article>` (semantic based on usage)
- If `clickable=true`: render as `<button>` or add `role="button"` + `tabindex="0"`
- Focus-visible outline with 2px offset
- Keyboard navigation (Enter/Space when clickable)
- Proper ARIA labels when interactive
- Support for `aria-label`, `aria-labelledby`, `aria-describedby`

**Reference Components:**
- **Header/Footer Pattern:** `Modal.svelte` (lines 1-200) - snippet composition
- **Variant System:** `Button.svelte` (lines 200-300) - variant classes
- **Interactive Handling:** `Avatar.svelte` (lines 46-90) - optional onclick, role detection
- **Accessibility Pattern:** `Skeleton.svelte` (lines 39-90) - INTERACTIVE_ROLES, tabindex parsing

**CSS Class Pattern:**
```css
.gr-card
.gr-card--elevated
.gr-card--outlined
.gr-card--filled
.gr-card--clickable
.gr-card--hoverable
.gr-card__header
.gr-card__content
.gr-card__footer
```

**Test File:** `packages/primitives/tests/card.test.ts`

**Test Coverage Requirements:**
```typescript
describe('Card.svelte', () => {
  // Rendering tests
  it('renders with elevated variant by default')
  it('renders with outlined variant')
  it('renders with filled variant')
  it('applies padding variants correctly')
  
  // Snippet tests
  it('renders header snippet when provided')
  it('renders footer snippet when provided')
  it('renders children content')
  
  // Interactive tests
  it('calls onclick when clickable and clicked')
  it('renders as button element when clickable')
  it('adds hover styles when hoverable')
  it('prevents interaction when not clickable')
  
  // Accessibility tests
  it('has proper role when clickable')
  it('is keyboard accessible when clickable')
  it('has focus-visible styles')
  it('respects aria-label prop')
  
  // Style tests
  it('applies custom className')
  it('merges custom styles correctly')
});
```

**Test Harness:** `packages/primitives/tests/harness/CardHarness.svelte`
- Should follow pattern of `ButtonHarness.svelte`
- Accept props and content slots
- Enable testing of snippets

**Documentation Required:**
- Add to `packages/primitives/src/index.ts` exports
- Add section to `knowledgebase/api-reference.md`
- Add examples to `knowledgebase/core-patterns.md`
- Update `knowledgebase/_concepts.yaml` provides list
- Add to `apps/playground` demos

---

## PHASE 2: Container Component

### Specification

**File:** `packages/primitives/src/components/Container.svelte`

**Purpose:** Max-width wrapper for content centering on landing pages, marketing sites, and documentation.

**Props Interface:**
```typescript
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width constraint.
   * - `sm`: 640px
   * - `md`: 768px
   * - `lg`: 1024px (default)
   * - `xl`: 1280px
   * - `2xl`: 1536px
   * - `full`: 100% (no constraint)
   * 
   * @defaultValue 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /**
   * Horizontal padding.
   * - `false`: No padding
   * - `true`: Default padding (1rem)
   * - `sm`: 0.75rem
   * - `md`: 1rem
   * - `lg`: 1.5rem
   * 
   * @defaultValue true
   */
  padding?: boolean | 'sm' | 'md' | 'lg';
  
  /**
   * Center content horizontally.
   * 
   * @defaultValue true
   */
  centered?: boolean;
  
  /**
   * Additional CSS classes.
   */
  class?: string;
  
  /**
   * Content snippet.
   */
  children?: Snippet;
}
```

**Max-Width Values:**
```css
sm: 640px   (40rem)
md: 768px   (48rem)
lg: 1024px  (64rem)
xl: 1280px  (80rem)
2xl: 1536px (96rem)
full: 100%
```

**Design Tokens to Use:**
```css
/* Padding */
--gr-spacing-scale-3  /* sm */
--gr-spacing-scale-4  /* md */
--gr-spacing-scale-6  /* lg */
```

**Accessibility Requirements:**
- Passive container (no interactivity)
- Semantic `<div>` element
- No special ARIA requirements
- Should not trap focus or interfere with navigation

**Reference Components:**
- **Simple Structure:** `Skeleton.svelte` - minimal wrapper with conditional styles
- **Class Computation:** `Avatar.svelte` (lines 93-110) - derived class names
- **Style Merging:** `Skeleton.svelte` (lines 107-137) - style prop handling

**CSS Class Pattern:**
```css
.gr-container
.gr-container--sm
.gr-container--md
.gr-container--lg
.gr-container--xl
.gr-container--2xl
.gr-container--full
.gr-container--centered
.gr-container--padded
```

**Implementation Notes:**
- Very simple component (< 100 lines total)
- No complex state management needed
- Straightforward responsive behavior

**Test File:** `packages/primitives/tests/container.test.ts`

**Test Coverage Requirements:**
```typescript
describe('Container.svelte', () => {
  // Max-width tests
  it('applies sm max-width (640px)')
  it('applies md max-width (768px)')
  it('applies lg max-width by default (1024px)')
  it('applies xl max-width (1280px)')
  it('applies 2xl max-width (1536px)')
  it('applies full width (100%)')
  
  // Padding tests
  it('applies default padding when padding=true')
  it('applies no padding when padding=false')
  it('applies sm padding')
  it('applies md padding')
  it('applies lg padding')
  
  // Centering tests
  it('centers content by default')
  it('does not center when centered=false')
  
  // Content tests
  it('renders children content')
  it('applies custom className')
  it('merges custom styles')
});
```

**Test Harness:** Not required (simple enough to test directly)

**Documentation Required:**
- Export in `packages/primitives/src/index.ts`
- Section in `knowledgebase/api-reference.md`
- Example in `knowledgebase/core-patterns.md` (landing page pattern)
- Update `knowledgebase/_concepts.yaml`

---

## PHASE 3: Section Component

### Specification

**File:** `packages/primitives/src/components/Section.svelte`

**Purpose:** Semantic section wrapper with consistent vertical spacing for page sections.

**Props Interface:**
```typescript
interface SectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * Vertical spacing (margin-top and margin-bottom).
   * - `none`: No spacing
   * - `sm`: 2rem
   * - `md`: 4rem (default)
   * - `lg`: 6rem
   * - `xl`: 8rem
   * 
   * @defaultValue 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Horizontal padding.
   * 
   * @defaultValue false
   */
  padding?: boolean | 'sm' | 'md' | 'lg';
  
  /**
   * Center content horizontally.
   * 
   * @defaultValue false
   */
  centered?: boolean;
  
  /**
   * Additional CSS classes.
   */
  class?: string;
  
  /**
   * Content snippet.
   */
  children?: Snippet;
}
```

**Design Tokens to Use:**
```css
/* Spacing */
--gr-spacing-scale-8   /* 2rem - sm */
--gr-spacing-scale-16  /* 4rem - md */
--gr-spacing-scale-24  /* 6rem - lg */
--gr-spacing-scale-32  /* 8rem - xl */

/* Padding (when enabled) */
--gr-spacing-scale-3   /* sm */
--gr-spacing-scale-4   /* md */
--gr-spacing-scale-6   /* lg */
```

**Accessibility Requirements:**
- Semantic `<section>` element
- Optional `aria-labelledby` for heading association
- No interactive requirements (passive container)

**Reference Components:**
- **Simple Wrapper:** `Skeleton.svelte` - basic structure
- **Spacing System:** `Button.svelte` - size-based spacing variants

**CSS Class Pattern:**
```css
.gr-section
.gr-section--spacing-none
.gr-section--spacing-sm
.gr-section--spacing-md
.gr-section--spacing-lg
.gr-section--spacing-xl
.gr-section--centered
```

**Test File:** `packages/primitives/tests/section.test.ts`

**Test Coverage Requirements:**
```typescript
describe('Section.svelte', () => {
  // Spacing tests
  it('applies md spacing by default')
  it('applies no spacing when spacing=none')
  it('applies sm spacing')
  it('applies lg spacing')
  it('applies xl spacing')
  
  // Layout tests
  it('renders as semantic section element')
  it('centers content when centered=true')
  it('applies padding when enabled')
  
  // Content tests
  it('renders children content')
  it('applies custom className')
  
  // Accessibility tests
  it('accepts aria-labelledby attribute')
});
```

**Documentation Required:**
- Export in `packages/primitives/src/index.ts`
- Section in `knowledgebase/api-reference.md`
- Example in landing page pattern
- Update `knowledgebase/_concepts.yaml`

---

## PHASE 4: Heading Component

### Specification

**File:** `packages/primitives/src/components/Heading.svelte`

**Purpose:** Semantic heading component with level enforcement and consistent typography.

**Props Interface:**
```typescript
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Semantic heading level (required for accessibility).
   * Maps to <h1> through <h6> elements.
   * 
   * @required
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  
  /**
   * Visual size (can differ from semantic level).
   * - `xs`: 0.75rem
   * - `sm`: 0.875rem
   * - `base`: 1rem
   * - `lg`: 1.125rem
   * - `xl`: 1.25rem
   * - `2xl`: 1.5rem
   * - `3xl`: 1.875rem
   * - `4xl`: 2.25rem
   * - `5xl`: 3rem
   * 
   * @defaultValue Maps to level (h1=5xl, h2=4xl, h3=3xl, h4=2xl, h5=xl, h6=lg)
   */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  
  /**
   * Font weight.
   * - `normal`: 400
   * - `medium`: 500
   * - `semibold`: 600
   * - `bold`: 700 (default for headings)
   * 
   * @defaultValue 'bold'
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  /**
   * Text alignment.
   * 
   * @defaultValue 'left'
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Additional CSS classes.
   */
  class?: string;
  
  /**
   * Content snippet.
   */
  children?: Snippet;
}
```

**Design Tokens to Use:**
```css
/* Font sizes */
--gr-typography-fontSize-xs
--gr-typography-fontSize-sm
--gr-typography-fontSize-base
--gr-typography-fontSize-lg
--gr-typography-fontSize-xl
--gr-typography-fontSize-2xl
--gr-typography-fontSize-3xl
--gr-typography-fontSize-4xl
--gr-typography-fontSize-5xl

/* Font weights */
--gr-typography-fontWeight-normal    /* 400 */
--gr-typography-fontWeight-medium    /* 500 */
--gr-typography-fontWeight-semibold  /* 600 */
--gr-typography-fontWeight-bold      /* 700 */

/* Font family */
--gr-typography-fontFamily-sans

/* Line height */
--gr-typography-lineHeight-tight     /* 1.25 */
--gr-typography-lineHeight-normal    /* 1.5 */

/* Spacing */
--gr-spacing-scale-2  /* margin-bottom for headings */
--gr-spacing-scale-4
```

**Accessibility Requirements:**
- Renders correct semantic element (`<h1>` through `<h6>`)
- **Critical:** `level` prop must map to actual heading level (not just visual)
- Proper heading hierarchy for screen readers
- No skipping levels (enforced by parent page, but component must render correctly)
- Support for `id` prop for anchor links
- Support for `aria-label` override

**Reference Components:**
- **Variant System:** `Button.svelte` (lines 200-260) - variant and size classes
- **Props Mapping:** `Avatar.svelte` (lines 6-44) - extensive prop interface
- **Type Safety:** `Button.svelte` (lines 20-100) - comprehensive TypeScript

**CSS Class Pattern:**
```css
.gr-heading
.gr-heading--h1
.gr-heading--h2
.gr-heading--h3
.gr-heading--h4
.gr-heading--h5
.gr-heading--h6
.gr-heading--size-xs
.gr-heading--size-5xl
.gr-heading--weight-bold
.gr-heading--align-center
```

**Implementation Notes:**
- Component needs to render different elements based on `level` prop
- Use Svelte's `<svelte:element>` for dynamic element rendering
- Default size should map sensibly to level (h1=5xl, h2=4xl, etc.)

**Test File:** `packages/primitives/tests/heading.test.ts`

**Test Coverage Requirements:**
```typescript
describe('Heading.svelte', () => {
  // Semantic level tests
  it('renders as h1 when level=1')
  it('renders as h2 when level=2')
  it('renders as h3 when level=3')
  it('renders as h4 when level=4')
  it('renders as h5 when level=5')
  it('renders as h6 when level=6')
  
  // Size tests
  it('applies default size based on level')
  it('overrides size when explicitly set')
  it('applies all size variants correctly')
  
  // Weight tests
  it('applies bold weight by default')
  it('applies all weight variants correctly')
  
  // Alignment tests
  it('aligns left by default')
  it('centers text when align=center')
  it('aligns right when align=right')
  
  // Content tests
  it('renders children content')
  it('applies custom className')
  
  // Accessibility tests
  it('accepts id for anchor links')
  it('accepts aria-label override')
  it('renders semantic heading element')
});
```

**Test Harness:** `packages/primitives/tests/harness/HeadingHarness.svelte`

**Documentation Required:**
- Export in `packages/primitives/src/index.ts`
- Section in `knowledgebase/api-reference.md`
- Examples showing semantic level vs visual size
- Update `knowledgebase/_concepts.yaml`

---

## PHASE 5: Text Component

### Specification

**File:** `packages/primitives/src/components/Text.svelte`

**Purpose:** Paragraph and inline text component with size, weight, and color variants.

**Props Interface:**
```typescript
interface TextProps extends HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  /**
   * HTML element to render.
   * - `p`: Paragraph (default)
   * - `span`: Inline span
   * - `div`: Block div
   * - `label`: Label element
   * 
   * @defaultValue 'p'
   */
  as?: 'p' | 'span' | 'div' | 'label';
  
  /**
   * Text size.
   * - `xs`: 0.75rem
   * - `sm`: 0.875rem
   * - `base`: 1rem (default)
   * - `lg`: 1.125rem
   * - `xl`: 1.25rem
   * - `2xl`: 1.5rem
   * 
   * @defaultValue 'base'
   */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  
  /**
   * Font weight.
   * - `normal`: 400 (default)
   * - `medium`: 500
   * - `semibold`: 600
   * - `bold`: 700
   * 
   * @defaultValue 'normal'
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  /**
   * Text color variant.
   * - `primary`: Primary text color (default)
   * - `secondary`: Muted text color
   * - `tertiary`: Most muted text color
   * - `success`: Success/positive color
   * - `warning`: Warning color
   * - `error`: Error/danger color
   * 
   * @defaultValue 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  
  /**
   * Text alignment.
   * 
   * @defaultValue 'left'
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  
  /**
   * Whether text should truncate with ellipsis.
   * 
   * @defaultValue false
   */
  truncate?: boolean;
  
  /**
   * Number of lines before truncating (requires truncate=true).
   */
  lines?: number;
  
  /**
   * Additional CSS classes.
   */
  class?: string;
  
  /**
   * Content snippet.
   */
  children?: Snippet;
}
```

**Design Tokens to Use:**
```css
/* Font sizes */
--gr-typography-fontSize-xs
--gr-typography-fontSize-sm
--gr-typography-fontSize-base
--gr-typography-fontSize-lg
--gr-typography-fontSize-xl
--gr-typography-fontSize-2xl

/* Font weights */
--gr-typography-fontWeight-normal
--gr-typography-fontWeight-medium
--gr-typography-fontWeight-semibold
--gr-typography-fontWeight-bold

/* Font family */
--gr-typography-fontFamily-sans

/* Line height */
--gr-typography-lineHeight-normal

/* Colors */
--gr-semantic-foreground-primary
--gr-semantic-foreground-secondary
--gr-semantic-foreground-tertiary
--gr-semantic-action-success-default
--gr-semantic-action-warning-default
--gr-semantic-action-error-default
```

**Accessibility Requirements:**
- Semantic element based on `as` prop
- For `label`: support for `for` attribute
- Proper color contrast (handled by semantic tokens)
- Respects reduced motion for any transitions

**Reference Components:**
- **Element Rendering:** Similar to Heading (use `<svelte:element>`)
- **Variant System:** `Button.svelte` - multiple variant dimensions
- **Simple Structure:** `Skeleton.svelte` - straightforward component

**CSS Class Pattern:**
```css
.gr-text
.gr-text--xs
.gr-text--base
.gr-text--2xl
.gr-text--weight-normal
.gr-text--weight-bold
.gr-text--color-primary
.gr-text--color-error
.gr-text--align-center
.gr-text--truncate
```

**Implementation Notes:**
- Truncation CSS: `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`
- Multi-line truncation: `-webkit-line-clamp` with `-webkit-box-orient: vertical;`

**Test File:** `packages/primitives/tests/text.test.ts`

**Test Coverage Requirements:**
```typescript
describe('Text.svelte', () => {
  // Element rendering tests
  it('renders as p by default')
  it('renders as span when as=span')
  it('renders as div when as=div')
  it('renders as label when as=label')
  
  // Size tests
  it('applies base size by default')
  it('applies all size variants correctly')
  
  // Weight tests
  it('applies normal weight by default')
  it('applies all weight variants correctly')
  
  // Color tests
  it('applies primary color by default')
  it('applies all color variants correctly')
  
  // Alignment tests
  it('aligns left by default')
  it('applies all alignment values correctly')
  
  // Truncation tests
  it('truncates text when truncate=true')
  it('truncates to specific lines when lines prop set')
  it('does not truncate by default')
  
  // Content tests
  it('renders children content')
  it('applies custom className')
  
  // Accessibility tests
  it('supports for attribute when as=label')
});
```

**Test Harness:** `packages/primitives/tests/harness/TextHarness.svelte`

**Documentation Required:**
- Export in `packages/primitives/src/index.ts`
- Section in `knowledgebase/api-reference.md`
- Examples in `knowledgebase/core-patterns.md`
- Update `knowledgebase/_concepts.yaml`

---

## PHASE 6: Knowledge Base Expansion & Final Validation

### Overview

Phase 6 transforms the knowledge base from Fediverse-focused documentation to comprehensive coverage that prevents AI hallucinations. This phase is divided into 5 sub-phases to ensure complete, accurate, discoverable documentation.

**Current KB State:** ~6,662 lines across 10 files, primarily Fediverse-focused  
**Target:** Comprehensive coverage of all packages for any use case

---

## PHASE 6.1: Component Inventory Documentation

**Objective:** Create explicit, complete inventories so AI knows what exists and what doesn't.

### 6.1.1: Create Component Inventory Master Document

**New File:** `knowledgebase/component-inventory.md`

**Content Structure:**
```markdown
# Complete Component Inventory

## Purpose
This document lists EVERY component available in Greater Components.
If a component is not listed here, it DOES NOT EXIST.

## Primitives Package (@equaltoai/greater-components-primitives)

### All 20 Components (Complete List)

**Form Controls (7):**
- Button - Interactive button with variants
- TextField - Single-line text input
- TextArea - Multi-line text input
- Select - Dropdown select
- Checkbox - Checkbox input
- Switch - Toggle switch
- FileUpload - File upload with drag-drop

**Overlays & Menus (4):**
- Modal - Dialog overlay
- Menu - Dropdown menu
- Tooltip - Hover tooltip
- Tabs - Tab navigation

**Display & Status (3):**
- Avatar - User avatar with fallback
- Skeleton - Loading placeholder
- ThemeSwitcher - Theme toggle

**Layout & Typography (5) - NEW:**
- Card - Content container with borders/shadows
- Container - Max-width centering wrapper
- Section - Semantic section with spacing
- Heading - Semantic h1-h6 with typography control
- Text - Paragraph/span/div with typography control

**Theme System (1):**
- ThemeProvider - Theme context provider

### What This Package Does NOT Provide

❌ NO Grid or Flexbox layout components (use CSS Grid/Flexbox directly)
❌ NO Navigation components (Nav, Navbar, Sidebar, Breadcrumbs) - build with HTML + Button
❌ NO Table components - build with HTML <table> + styling
❌ NO Form wrapper components - build with HTML <form>
❌ NO Image components - use HTML <img> or <picture>

### For Missing Functionality

**If you need layout beyond Container/Section:**
Use standard HTML + CSS Grid/Flexbox:
- Grid layouts: <div style="display: grid; ...">
- Flex layouts: <div style="display: flex; ...">
- Responsive: CSS media queries

**If you need navigation:**
Combine HTML + Button component:
- <nav> with <Button> components
- <ul><li> with styling
- SvelteKit links with <a> elements

## Icons Package (@equaltoai/greater-components-icons)

### Naming Convention

Filename (kebab-case) → Export (PascalCase + Icon):
- code.svelte → CodeIcon
- alert-circle.svelte → AlertCircleIcon  
- arrow-right.svelte → ArrowRightIcon

### All 300+ Icons (Complete List)

[Alphabetical listing of every icon from packages/icons/src/icons/]

activity, airplay, alert-circle, alert-octagon, alert-triangle, align-center,
align-justify, align-left, align-right, anchor, aperture, archive, arrow-down,
arrow-down-circle, arrow-down-left, arrow-down-right, arrow-left, arrow-left-circle,
arrow-right, arrow-right-circle, arrow-up, arrow-up-circle, arrow-up-left,
arrow-up-right, at-sign, award, bar-chart, bar-chart-2, battery, battery-charging,
bell, bell-off, bluetooth, bold, book, book-open, bookmark, boost, box, briefcase,
building, calendar, camera, camera-off, cast, check, check-circle, check-square,
chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left,
chevrons-right, chevrons-up, chrome, circle, clipboard, clock, cloud, cloud-drizzle,
cloud-lightning, cloud-off, cloud-rain, cloud-snow, code, codepen, codesandbox,
coffee, columns, command, compass, copy, corner-down-left, corner-down-right,
corner-left-down, corner-left-up, corner-right-down, corner-right-up,
corner-up-left, corner-up-right, cpu, credit-card, crop, crosshair, database,
delete, disc, divide, divide-circle, divide-square, dollar-sign, download,
download-cloud, dribbble, droplet, edit, edit-2, edit-3, equals, external-link,
eye, eye-off, facebook, fast-forward, favorite, feather, figma, file, file-minus,
file-plus, file-text, film, filter, flag, folder, folder-minus, folder-plus,
follow, framer, frown, gift, git-branch, git-commit, git-merge, git-pull-request,
github, gitlab, globe, greater-than, grid, hard-drive, hash, hashtag, headphones,
heart, help-circle, hexagon, home, image, inbox, info, instagram, italic, key,
layers, layout, less-than, life-buoy, link, link-2, linkedin, list, loader, lock,
log-in, log-out, mail, map, map-pin, maximize, maximize-2, meh, mention, menu,
message-circle, message-square, mic, mic-off, minimize, minimize-2, minus,
minus-circle, minus-square, monitor, moon, more-horizontal, more-vertical,
mouse-pointer, move, music, navigation, navigation-2, octagon, package, paperclip,
pause, pause-circle, pen-tool, percent, phone, phone-call, phone-forwarded,
phone-incoming, phone-missed, phone-off, phone-outgoing, pie-chart, play,
play-circle, plus, plus-circle, plus-square, pocket, power, printer, radio,
refresh-ccw, refresh-cw, repeat, reply, rewind, rotate-ccw, rotate-cw, rss, save,
scissors, search, send, server, settings, share, share-2, shield, shield-off,
shopping-bag, shopping-cart, shuffle, sidebar, skip-back, skip-forward, slack,
slash, sliders, smartphone, smile, speaker, square, star, stop-circle, sun,
sunrise, sunset, table, tablet, tag, target, terminal, thermometer, thumbs-down,
thumbs-up, toggle-left, toggle-right, tool, trash, trash-2, trello, trending-down,
trending-up, triangle, truck, tv, twitch, twitter, type, umbrella, unboost,
underline, unfavorite, unfollow, unlock, upload, upload-cloud, user, user-check,
user-minus, user-plus, user-x, users, video, video-off, voicemail, volume,
volume-1, volume-2, volume-x, watch, wifi, wifi-off, wind, x, x-circle, x-octagon,
x-square, youtube, zap, zap-off, zoom-in, zoom-out

### Icon Alternatives for Common Needs

**If you need "ApiIcon" (DOES NOT EXIST):**
Use: ServerIcon, DatabaseIcon, CloudIcon, or CodeIcon

**If you need "WorkflowIcon" (DOES NOT EXIST):**
Use: GitBranchIcon, GitMergeIcon, LayersIcon, or ToolIcon

### Verifying Icon Exists

Before importing an icon:
1. Check if filename exists in packages/icons/src/icons/{name}.svelte
2. Convert kebab-case to PascalCase + Icon
3. If missing, use closest semantic alternative from list above

## Fediverse Package (@equaltoai/greater-components-fediverse)

### Main Component Groups

[Continue with comprehensive fediverse inventory...]

## Headless, Adapters, Utils, Testing Packages

[Complete inventories for each...]
```

**Lines:** ~800-1000 lines (comprehensive)

**Success Criteria:**
- ✅ Every component listed with brief description
- ✅ Explicit "DOES NOT EXIST" sections
- ✅ Alternatives documented for common hallucinations
- ✅ Verification methods provided

---

## PHASE 6.2: Design Token Schema Documentation

**Objective:** Eliminate token-related hallucinations (wrong scales, typos, missing values).

### 6.2.1: Create Design Token Schema Reference

**New File:** `knowledgebase/design-tokens-schema.md`

**Content Structure:**
```markdown
# Design Token Schema - Complete Reference

## Purpose
Exact schema for all design tokens to prevent common errors.

## Color Token Scale

### Scale Values (CRITICAL)

Color tokens use these EXACT values (NOT 10, 20, 30...):
- 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

✅ CORRECT Examples:
```css
--gr-color-primary-50: #eff6ff
--gr-color-primary-100: #dbeafe
--gr-color-primary-200: #bfdbfe
--gr-color-primary-600: #2563eb
--gr-color-primary-900: #1e3a8a
--gr-color-primary-950: #172554
```

❌ INCORRECT Examples (Common Errors):
```css
--gr-color-primary-10: ...   /* WRONG: Should be 50 or 100 */
--gr-color-primary-20: ...   /* WRONG: Should be 200 */
--gr-color-primary-60: ...   /* WRONG: Should be 600 */
```

### Available Color Families

From packages/tokens/src/tokens.json:
- base: white, black
- gray: 50-950
- primary: 50-950
- success: 50-900
- warning: 50-900
- error: 50-900

## Typography Tokens

### Font Weight Values (CRITICAL)

Font weights are standard CSS numeric values (400, 500, 600, 700):

✅ CORRECT:
```css
--gr-typography-fontWeight-normal: 400
--gr-typography-fontWeight-medium: 500
--gr-typography-fontWeight-semibold: 600
--gr-typography-fontWeight-bold: 700
```

❌ INCORRECT (Common Error - Missing Zero):
```css
--gr-typography-fontWeight-normal: 40    /* WRONG: Missing zero */
--gr-typography-fontWeight-medium: 50    /* WRONG: Missing zero */
--gr-typography-fontWeight-semibold: 60  /* WRONG: Missing zero */
--gr-typography-fontWeight-bold: 70      /* WRONG: Missing zero */
```

### Font Size Scale

Available sizes with exact rem values:
```css
--gr-typography-fontSize-xs: 0.75rem     /* 12px */
--gr-typography-fontSize-sm: 0.875rem    /* 14px */
--gr-typography-fontSize-base: 1rem      /* 16px */
--gr-typography-fontSize-lg: 1.125rem    /* 18px */
--gr-typography-fontSize-xl: 1.25rem     /* 20px */
--gr-typography-fontSize-2xl: 1.5rem     /* 24px */
--gr-typography-fontSize-3xl: 1.875rem   /* 30px */
--gr-typography-fontSize-4xl: 2.25rem    /* 36px */
--gr-typography-fontSize-5xl: 3rem       /* 48px */
```

## Spacing Tokens

### Spacing Scale

Available spacing values:
```css
--gr-spacing-scale-0: 0
--gr-spacing-scale-1: 0.25rem   /* 4px */
--gr-spacing-scale-2: 0.5rem    /* 8px */
--gr-spacing-scale-3: 0.75rem   /* 12px */
--gr-spacing-scale-4: 1rem      /* 16px */
--gr-spacing-scale-5: 1.25rem   /* 20px */
--gr-spacing-scale-6: 1.5rem    /* 24px */
--gr-spacing-scale-8: 2rem      /* 32px */
--gr-spacing-scale-10: 2.5rem   /* 40px */
--gr-spacing-scale-12: 3rem     /* 48px */
--gr-spacing-scale-16: 4rem     /* 64px */
--gr-spacing-scale-20: 5rem     /* 80px */
--gr-spacing-scale-24: 6rem     /* 96px */
--gr-spacing-scale-32: 8rem     /* 128px */
```

Note: Spacing uses `--gr-spacing-scale-{number}` NOT `--gr-spacing-{number}`

## Border Radius Tokens

### Critical: Double 'i' in 'radii'

✅ CORRECT:
```css
--gr-radii-none: 0
--gr-radii-sm: 0.125rem
--gr-radii-base: 0.25rem
--gr-radii-md: 0.375rem
--gr-radii-lg: 0.5rem
--gr-radii-xl: 0.75rem
--gr-radii-2xl: 1rem
--gr-radii-full: 9999px
```

❌ INCORRECT (Common Typo):
```css
--gr-radi-sm: ...   /* WRONG: Missing 'i' - should be 'radii' */
--gr-radi-md: ...   /* WRONG: Missing 'i' - should be 'radii' */
```

## Shadow Tokens

Available shadow values:
```css
--gr-shadows-sm
--gr-shadows-base
--gr-shadows-md
--gr-shadows-lg
--gr-shadows-xl
--gr-shadows-2xl
--gr-shadows-inner
--gr-shadows-none
```

## Common Errors & Fixes

### Error 1: Wrong Color Scale
- ❌ Using 10, 20, 30... instead of 50, 100, 200...
- ✅ Always use: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Error 2: Missing Digit in Font Weights
- ❌ Using 40, 50, 60, 70 instead of 400, 500, 600, 700
- ✅ Font weights are always 3 digits

### Error 3: Typo in 'radii'
- ❌ Using --gr-radi-* (missing 'i')
- ✅ Always: --gr-radii-* (double 'i')

### Error 4: Wrong Spacing Format
- ❌ Using --gr-spacing-4 (missing 'scale')
- ✅ Always: --gr-spacing-scale-4

### Error 5: Incomplete Hex Colors
- ❌ Truncated hex like #47569 or #3415
- ✅ Always 6 digits: #475569, #334155
```

**Lines:** ~400-500 lines  
**Impact:** Eliminates token value hallucinations

---

## PHASE 6.2: Usage Pattern Documentation

**Objective:** Document HOW to use components for non-Fediverse use cases.

### 6.2.1: Landing Page Pattern Document

**New File:** `knowledgebase/patterns-landing-pages.md`

**Content Structure:**
```markdown
# Landing Page & Marketing Site Patterns

## Purpose
Comprehensive patterns for using Greater Components primitives in landing pages, marketing sites, and general websites (non-Fediverse).

## Pattern 1: Hero Section

### Structure
Use HTML for layout + Primitives for interaction:

```svelte
<script>
  import { Container, Section, Heading, Text, Button } from '@equaltoai/greater-components-primitives';
  import { ArrowRightIcon, PlayIcon } from '@equaltoai/greater-components-icons';
  
  let showDemo = $state(false);
</script>

<Section spacing="xl">
  <Container maxWidth="xl" padding="lg">
    <div class="hero">
      <Heading level={1} size="5xl" align="center">
        Your Product Name
      </Heading>
      
      <Text size="xl" color="secondary" align="center">
        Build amazing things with our platform
      </Text>
      
      <div class="cta-buttons">
        <Button variant="solid" size="lg">
          Get Started
          {#snippet suffix()}<ArrowRightIcon />{/snippet}
        </Button>
        
        <Button variant="outline" size="lg" onclick={() => showDemo = true}>
          {#snippet prefix()}<PlayIcon />{/snippet}
          Watch Demo
        </Button>
      </div>
    </div>
  </Container>
</Section>

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 4rem 0;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
```

## Pattern 2: Feature Grid

```svelte
<Section spacing="lg">
  <Container maxWidth="lg">
    <Heading level={2} align="center">Features</Heading>
    
    <div class="feature-grid">
      <Card variant="outlined" hoverable>
        {#snippet header()}
          <CodeIcon size={32} />
          <Heading level={3} size="xl">Fast Development</Heading>
        {/snippet}
        
        <Text color="secondary">
          Build quickly with pre-made components
        </Text>
      </Card>
      
      <!-- More feature cards... -->
    </div>
  </Container>
</Section>

<style>
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
</style>
```

## Pattern 3: Pricing Section

## Pattern 4: Testimonials

## Pattern 5: FAQ Section

## Pattern 6: Footer

## Complete Landing Page Example

[Full working example with all sections integrated]

## Anti-Patterns

### ❌ INCORRECT: Looking for components that don't exist

```svelte
// THESE DO NOT EXIST:
import { Grid, Flex, Nav, Table, Image } from '@equaltoai/greater-components-primitives';
```

### ✅ CORRECT: Use HTML + Primitives

```svelte
import { Container, Section, Heading, Text, Card, Button } from '@equaltoai/greater-components-primitives';

<!-- Use HTML for structure -->
<div style="display: grid; ...">
  <Container>
    <Heading>Title</Heading>
  </Container>
</div>
```
```

**Lines:** ~600-800 lines  
**Impact:** Provides complete non-Fediverse usage guidance

---

### 6.2.2: Update core-patterns.md

**Add Section:** "Non-Fediverse Application Patterns"  
**Content:**
- Marketing websites
- Documentation sites
- Admin dashboards
- Corporate sites
- Portfolio sites

**Lines:** +300-400 lines

---

## PHASE 6.3: Reference Documentation Expansion

**Objective:** Make all reference documentation complete and discoverable.

### 6.3.1: Expand Icon Documentation

**Update:** `knowledgebase/api-reference.md` Icons section

**Changes:**
- Replace "300+ SVG icons" with complete alphabetical list
- Add naming convention explanation
- Add verification method
- Add common icon alternatives

**Added Content:** ~200 lines

---

### 6.3.2: Add Complete Token Reference

**Update:** `knowledgebase/api-reference.md` Tokens section

**Changes:**
- Replace summary with complete token listing
- Show all scale values explicitly
- Include common error examples
- Cross-reference to design-tokens-schema.md

**Added Content:** ~150 lines

---

### 6.3.3: Add Primitives Scope Statement

**Update:** `knowledgebase/api-reference.md` at start of Primitives section

**Add Before Component Listings:**
```markdown
## Primitives Package

`@equaltoai/greater-components-primitives`

### Package Scope

This package provides **20 interactive and layout components** for building any type of website.

**What Primitives Provides:**
- Interactive widgets (buttons, forms, modals, menus)
- Layout primitives (containers, sections, cards)
- Typography components (headings, text)
- Theme system (provider, switcher)

**What Primitives Does NOT Provide:**
- Navigation components (build with HTML + Button)
- Data tables (build with HTML <table>)
- Grid/Flex systems (use CSS Grid/Flexbox)
- Complex page layouts (compose Container + Section + custom CSS)

**For General Websites:**
Primitives work for ANY website type:
- ✅ Landing pages
- ✅ Marketing sites
- ✅ Documentation sites
- ✅ Admin dashboards
- ✅ Fediverse applications

Use HTML for structure, primitives for interactive elements and consistent typography.

### Complete Component List (20 Total)

[Existing component documentation follows...]
```

**Added Content:** ~50 lines

---

## PHASE 6.4: Knowledge Base Structure Updates

**Objective:** Update structured data files for AI consumption.

### 6.4.1: Update _concepts.yaml

**Changes:**
```yaml
primitives_package:
  type: component_package
  package_name: "@equaltoai/greater-components-primitives"
  purpose: "Styled UI components for any website type - Fediverse, landing pages, marketing sites, documentation"
  
  use_cases:
    - landing_pages
    - marketing_websites
    - documentation_sites
    - admin_dashboards
    - fediverse_applications
    - general_web_applications
  
  provides:
    # ... existing 15 + new 5 = 20 total
  
  does_not_provide:
    - navigation_components
    - data_table_components
    - grid_layout_systems
    - chart_components
    - map_components
    - video_player_components
  
  use_html_for:
    - complex_page_layouts
    - navigation_menus
    - data_tables
    - custom_grids
    - embedded_media
```

**Added Content:** ~100 lines

---

### 6.4.2: Update _patterns.yaml

**Add Patterns:**
```yaml
landing_page_layout:
  name: "Building Landing Pages"
  problem: "Need to build marketing landing page with Greater Components"
  solution: "Use Container + Section for structure, Card for features, Button for CTAs"
  correct_example: |
    [Full landing page example]
  anti_patterns:
    - name: "Looking for Grid component"
      why: "Grid component doesn't exist, use CSS Grid"
      incorrect_example: |
        import { Grid } from '@equaltoai/greater-components-primitives'; // DOES NOT EXIST
      correct_example: |
        <div style="display: grid; grid-template-columns: repeat(3, 1fr);">
          <Card>...</Card>
        </div>

typography_composition:
  name: "Typography with Heading and Text"
  problem: "Need consistent typography across pages"
  solution: "Use Heading for titles, Text for body content"
  correct_example: |
    [Examples with Heading + Text]
```

**Added Content:** ~400 lines

---

### 6.4.3: Update _decisions.yaml

**Add Decision Trees:**
```yaml
layout_component_selection:
  question: "Which component should I use for page layout?"
  decision_tree:
    - condition: "Need to center content with max-width"
      choice: "Use Container component"
      example: |
        <Container maxWidth="lg" padding="md">
          <!-- Content -->
        </Container>
    
    - condition: "Need vertical spacing between page sections"
      choice: "Use Section component"
      example: |
        <Section spacing="lg">
          <!-- Section content -->
        </Section>
    
    - condition: "Need content card with border/shadow"
      choice: "Use Card component"
      
    - condition: "Need complex grid layout"
      choice: "Use HTML + CSS Grid (no component exists)"
      example: |
        <div style="display: grid; grid-template-columns: ...">

text_component_selection:
  question: "Should I use Heading, Text, or HTML elements?"
  decision_tree:
    - condition: "Is this a page/section title?"
      choice: "Use Heading component with appropriate level"
      reason: "Ensures semantic HTML and consistent typography"
      
    - condition: "Is this body text needing color/size variants?"
      choice: "Use Text component"
      reason: "Provides typography variants and semantic colors"
      
    - condition: "Is this simple paragraph with no special styling?"
      choice: "Use HTML <p> element directly"
      reason: "Text component adds convenience, but HTML is fine for basic use"

icon_discovery:
  question: "How do I find if an icon exists?"
  decision_tree:
    - condition: "I need a specific icon"
      steps:
        - "Check knowledgebase/component-inventory.md icon list"
        - "Verify kebab-case filename exists in packages/icons/src/icons/"
        - "Convert to PascalCase + Icon suffix"
        - "If not found, use closest semantic alternative"
      
    - condition: "Icon doesn't exist"
      choice: "Use semantic alternative from documented list"
      examples:
        api: "Use ServerIcon, DatabaseIcon, or CloudIcon"
        workflow: "Use GitBranchIcon, LayersIcon, or ToolIcon"
```

**Added Content:** ~300 lines

---

## PHASE 6.5: Practical Examples & Validation

**Objective:** Create working examples and validate with PAI.

### 6.5.1: Create Complete Landing Page Example

**New File:** `knowledgebase/example-landing-page.md`

**Content:**
- Full working landing page using all 5 new components
- Hero, features, pricing, testimonials, CTA, footer
- All code runnable and tested
- Comments explaining choices

**Lines:** ~500-600 lines

---

### 6.5.2: Add Playground Demos

**New Files in apps/playground:**
```
src/routes/demos/layout-components/+page.svelte
src/routes/demos/typography-components/+page.svelte  
src/routes/demos/landing-page-example/+page.svelte
```

**Each Demo Shows:**
- Component in isolation
- All variants/props
- Common use cases
- Accessibility features

---

### 6.5.3: PAI Validation Tests

**Create:** `knowledgebase/PAI-VALIDATION-TESTS.md`

**Test Scenarios:**
```markdown
# PAI Validation Test Scenarios

## Test 1: Landing Page Generation
**Prompt:** "Build a landing page for a SaaS product using greater-components primitives"

**Expected Behavior:**
- ✅ Imports Card, Container, Section, Heading, Text, Button
- ✅ Uses HTML for <main>, <nav>, <footer>
- ✅ Does NOT import non-existent components
- ✅ Uses correct design token values
- ✅ Uses existing icons or documents alternatives

## Test 2: Component Discovery
**Prompt:** "What layout components are available in greater-components-primitives?"

**Expected Response:**
- Lists: Card, Container, Section
- Mentions: Heading, Text for typography
- States: No Grid, Flex, Nav components
- Provides: Alternatives (CSS Grid, HTML)

## Test 3: Icon Discovery
**Prompt:** "I need ApiIcon and WorkflowIcon from greater-components-icons"

**Expected Response:**
- States: ApiIcon and WorkflowIcon DO NOT EXIST
- Suggests: ServerIcon, CodeIcon, DatabaseIcon for API
- Suggests: GitBranchIcon, LayersIcon, ToolIcon for Workflow

## Test 4: Design Token Usage
**Prompt:** "Create custom theme with design tokens for greater-components"

**Expected Behavior:**
- ✅ Uses correct scale: 50, 100, 200... (not 10, 20, 30)
- ✅ Font weights: 400, 500, 600, 700 (not 40, 50, 60, 70)
- ✅ Uses --gr-radii-* (not --gr-radi-*)
- ✅ Complete hex colors (6 digits)
```

**Lines:** ~200 lines

---

## PHASE 6.6: Knowledge Base Quality Assurance

**Objective:** Audit and fix ALL existing KB content.

### 6.6.1: Audit Existing Files

**Process:**
1. Read each KB file completely
2. Verify every component reference exists
3. Check every code example compiles
4. Validate all design tokens correct
5. Fix or remove incorrect content

**Files to Audit:**
- ✅ api-reference.md (already updated with 5 new components)
- ✅ core-patterns.md (has Container example, needs expansion)
- ⚠️ getting-started.md (check for outdated patterns)
- ⚠️ development-guidelines.md (verify examples)
- ⚠️ testing-guide.md (verify component references)
- ⚠️ troubleshooting.md (verify solutions current)

---

### 6.6.2: Create KB Completeness Checklist

**New File:** `knowledgebase/COMPLETENESS-CHECKLIST.md`

**Content:**
```markdown
# Knowledge Base Completeness Checklist

## Component Coverage

### Primitives (20/20)
- [ ] Button - API docs, patterns, examples ✓
- [ ] Modal - API docs, patterns, examples ✓
- [ ] TextField - API docs, patterns, examples ✓
- [ ] TextArea - API docs, patterns, examples ✓
- [ ] Select - API docs, patterns, examples ✓
- [ ] Checkbox - API docs, patterns, examples ✓
- [ ] Switch - API docs, patterns, examples ✓
- [ ] FileUpload - API docs, patterns, examples ✓
- [ ] Menu - API docs, patterns, examples ✓
- [ ] Tooltip - API docs, patterns, examples ✓
- [ ] Tabs - API docs, patterns, examples ✓
- [ ] Avatar - API docs, patterns, examples ✓
- [ ] Skeleton - API docs, patterns, examples ✓
- [ ] ThemeProvider - API docs, patterns, examples ✓
- [ ] ThemeSwitcher - API docs, patterns, examples ✓
- [ ] Card - API docs, patterns, examples NEW
- [ ] Container - API docs, patterns, examples NEW
- [ ] Section - API docs, patterns, examples NEW
- [ ] Heading - API docs, patterns, examples NEW
- [ ] Text - API docs, patterns, examples NEW

### Use Case Coverage

- [ ] Fediverse/Social Apps ✓
- [ ] Landing Pages NEW
- [ ] Marketing Sites NEW
- [ ] Documentation Sites NEW
- [ ] Admin Dashboards PARTIAL
- [ ] E-commerce Sites MISSING
- [ ] Portfolio Sites MISSING

### Anti-Hallucination Coverage

- [ ] Complete component inventory documented
- [ ] "Does not provide" lists for each package
- [ ] Icon alternatives for common requests
- [ ] Design token error examples
- [ ] When to use HTML vs components
```

---

## PHASE 6.7: Final Technical Validation

**Objective:** Ensure everything builds, tests, and lints.

### 6.7.1: Full Build Validation

**Commands:**
```bash
# From monorepo root
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
```

**Success Criteria:**
- ✅ All packages build
- ✅ All tests pass (150+ in primitives)
- ✅ No TypeScript errors
- ✅ Lint warnings acceptable (document any remaining)

---

### 6.7.2: Bundle Size Analysis

**Check:**
```bash
cd packages/primitives/dist
ls -lh components/ | grep -E "Card|Container|Section|Heading|Text"
```

**Document:**
- Individual component sizes
- Total added size
- Tree-shaking verification
- Performance impact assessment

---

### 6.7.3: Accessibility Validation

**Manual Tests:**
- [ ] Keyboard navigation works for all 5 components
- [ ] Screen reader announces correctly (NVDA/VoiceOver)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Reduced motion preferences respected

**Automated:**
```bash
cd packages/primitives
pnpm test  # Includes a11y assertions in tests
```

---

## PHASE 6.8: PAI Integration Testing

**Objective:** Validate that PAI can now use components without hallucinations.

### 6.8.1: Test Scenario 1 - Landing Page

**Command:**
```bash
cd /path/to/test-project
pai project "create a landing page using greater-components primitives with hero, features grid, and CTA section"
```

**Validation:**
- ✅ Imports: Card, Container, Section, Heading, Text, Button
- ✅ Does NOT import non-existent components
- ✅ Uses correct design tokens
- ✅ Uses existing icons or documents need for alternatives
- ✅ Proper HTML structure with primitives

---

### 6.8.2: Test Scenario 2 - Documentation Site

**Command:**
```bash
pai project "build documentation site homepage with greater-components"
```

**Validation:**
- ✅ Uses appropriate components
- ✅ No hallucinations
- ✅ Correct token usage

---

### 6.8.3: Test Scenario 3 - Icon Discovery

**Query PAI KB:**
```
What icons are available for API and workflow concepts in greater-components-icons?
```

**Expected Response:**
- States ApiIcon and WorkflowIcon DON'T exist
- Suggests: ServerIcon, CodeIcon for API
- Suggests: GitBranchIcon, LayersIcon for workflow

---

## PHASE 6.9: Documentation Publication

**Objective:** Ensure KB is ready for production use and PAI consumption.

### 6.9.1: Update Knowledge Base README

**File:** `knowledgebase/README.md`

**Add Sections:**
```markdown
## What's New

### Recently Added (Nov 2025)
- 5 new layout & typography components: Card, Container, Section, Heading, Text
- Complete component inventory with "does not exist" guidance
- Complete icon reference (all 300 icons)
- Design token schema with common error examples
- Landing page and marketing site patterns
- Non-Fediverse usage patterns

### For AI Assistants

The knowledge base now includes:
- Complete component inventories (what exists and what doesn't)
- Explicit "does not provide" lists for each package
- Icon alternatives for common requests
- Design token schemas with error examples
- Usage patterns for Fediverse AND general websites

This prevents hallucinations by providing:
1. Explicit lists of what exists
2. Explicit statements of what doesn't exist
3. Alternatives when requested item doesn't exist
4. Validation methods to check before using
```

---

### 6.9.2: Create Documentation Index

**New File:** `knowledgebase/DOCUMENTATION-INDEX.md`

**Content:**
```markdown
# Greater Components Knowledge Base - Complete Index

## Quick Navigation

### I want to build...
- **Fediverse/Social App** → [getting-started.md](./getting-started.md)
- **Landing Page** → [patterns-landing-pages.md](./patterns-landing-pages.md) NEW
- **Documentation Site** → [patterns-landing-pages.md](./patterns-landing-pages.md) NEW
- **Admin Dashboard** → [core-patterns.md](./core-patterns.md)

### I need to know...
- **What components exist** → [component-inventory.md](./component-inventory.md) NEW
- **What icons are available** → [component-inventory.md#icons](./component-inventory.md#icons) NEW
- **How to use design tokens** → [design-tokens-schema.md](./design-tokens-schema.md) NEW
- **Component API reference** → [api-reference.md](./api-reference.md)
- **Usage patterns** → [core-patterns.md](./core-patterns.md)

### I'm having problems...
- **Check here first** → [troubleshooting.md](./troubleshooting.md)
- **Common errors** → [design-tokens-schema.md#common-errors](./design-tokens-schema.md#common-errors) NEW

### I'm using AI assistance...
- **Structured data** → [_concepts.yaml](./_concepts.yaml), [_patterns.yaml](./_patterns.yaml), [_decisions.yaml](./_decisions.yaml)
- **Validation tests** → [PAI-VALIDATION-TESTS.md](./PAI-VALIDATION-TESTS.md) NEW
- **Component inventory** → [component-inventory.md](./component-inventory.md) NEW
```

---

## PHASE 6.10: Final Validation & Sign-Off

**Objective:** Comprehensive validation before marking complete.

### 6.10.1: PAI Re-Test on Original Scenario

**Reproduce Original Issue:**
```bash
cd paicodes
rm -rf src/
pai project "use the greater-components library to implement PAGE: HOME / LANDING as defined in docs/paicodes.com.md"
```

**Expected Outcome:**
- ✅ NO hallucinated components (Container, Section, Heading, Text, Card all exist now)
- ✅ Correct imports from @equaltoai/greater-components-primitives
- ✅ Correct design token usage
- ✅ Uses existing icons or notes alternatives needed
- ✅ Proper layout with HTML + primitives

**Compare to Original:**
- Original had: 5 hallucinated components
- New should have: 0 hallucinations

---

### 6.10.2: Knowledge Base Metrics

**Measure:**
```bash
cd knowledgebase
wc -l *.md *.yaml
```

**Current:** ~6,662 lines  
**Target:** ~10,000-12,000 lines (comprehensive)

**New Files Added:** 5
- component-inventory.md (~1000 lines)
- design-tokens-schema.md (~500 lines)
- patterns-landing-pages.md (~700 lines)
- example-landing-page.md (~600 lines)
- PAI-VALIDATION-TESTS.md (~200 lines)
- COMPLETENESS-CHECKLIST.md (~300 lines)
- DOCUMENTATION-INDEX.md (~200 lines)

**Total Addition:** ~3,500-4,000 lines

---

### 6.10.3: Coverage Report

**Generate Final Report:**

**Component Implementation:**
- 5/5 components complete ✅
- 150 tests passing ✅
- 100% coverage on new components ✅
- 0 TypeScript errors ✅
- 0 lint errors on new code ✅

**Documentation Coverage:**
- API Reference: 20/20 primitives documented ✅
- Patterns: Fediverse ✅, Landing Pages ✅, General Sites ✅
- Structured Data: _concepts, _patterns, _decisions all updated ✅
- Icon Reference: Complete 300 icon list ✅
- Token Schema: Complete with error examples ✅

**Anti-Hallucination Measures:**
- Explicit inventory lists ✅
- "Does not exist" statements ✅
- Alternative suggestions ✅
- Validation methods ✅
- Error pattern documentation ✅

---

## Phase 6 Sub-Phase Summary

| Sub-Phase | Focus | New Files | Lines Added | Status |
|-----------|-------|-----------|-------------|--------|
| 6.1 | Component Inventory | 1 | ~1000 | Planned |
| 6.2 | Usage Patterns | 1 | ~700 | Planned |
| 6.3 | Reference Expansion | 0 | ~400 | Planned |
| 6.4 | Structure Updates | 0 | ~800 | Planned |
| 6.5 | Examples & Validation | 2 | ~800 | Planned |
| 6.6 | Quality Assurance | 1 | ~300 | Planned |
| 6.7 | Technical Validation | 0 | ~0 | Planned |
| 6.8 | PAI Integration Test | 0 | ~0 | Planned |
| 6.9 | Publication Prep | 2 | ~500 | Planned |
| 6.10 | Final Sign-Off | 0 | ~0 | Planned |

**Total:** 7 new files, ~4,500 lines, 10 sub-phases

---

## Success Criteria for Phase 6

### Documentation Completeness
- ✅ Every component has complete API documentation
- ✅ Every component has usage examples
- ✅ Every component listed in structured data (_concepts, _patterns, _decisions)
- ✅ Complete icon inventory (all 300)
- ✅ Complete token schema with examples
- ✅ Landing page patterns documented
- ✅ Marketing site patterns documented
- ✅ "Does not exist" guidance for common requests

### Anti-Hallucination Measures
- ✅ Explicit inventories prevent assuming components exist
- ✅ "Does not provide" lists prevent wrong package usage
- ✅ Icon alternatives prevent icon hallucinations
- ✅ Token schemas prevent value errors
- ✅ Pattern examples show correct usage

### PAI Validation
- ✅ PAI can build landing page without hallucinations
- ✅ PAI suggests correct alternatives when component missing
- ✅ PAI uses correct token values
- ✅ PAI references existing icons or documents alternatives

### Technical Quality
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Lint clean on new code
- ✅ Build successful
- ✅ Documentation renders correctly

### Discoverability
- ✅ Clear navigation in README
- ✅ Documentation index created
- ✅ Use-case-based organization
- ✅ AI-friendly structured data

---

## Reference Component Mapping

### For Each New Component, Follow These Patterns:

**File Structure:**
```
packages/primitives/src/components/{ComponentName}.svelte
packages/primitives/tests/{componentname}.test.ts
packages/primitives/tests/harness/{ComponentName}Harness.svelte (if complex)
```

**Component Structure Pattern (from Button.svelte):**
```svelte
<!-- JSDoc comments with @component and @example -->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  
  // Props interface with full JSDoc
  interface Props extends HTMLAttributes<HTMLElement> {
    // ... props with @defaultValue and @public tags
  }
  
  // Destructure props with defaults
  let { prop1, prop2, ... }: Props = $props();
  
  // Derived computations with $derived
  const computedClass = $derived(() => { /* ... */ });
  
  // Helper functions if needed
</script>

<!-- Template with proper accessibility -->
<element
  class={computedClass()}
  {/* ... accessibility attributes */}
>
  {@render children?.()}
</element>

<style>
  :global {
    /* Component styles using design tokens */
    .gr-component {
      property: var(--gr-token-name);
    }
  }
</style>
```

**Test Structure Pattern (from button.test.ts, avatar.test.ts):**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Component from '../src/components/Component.svelte';
import ComponentHarness from './harness/ComponentHarness.svelte'; // if needed

describe('Component.svelte', () => {
  // Group tests by feature
  // Use descriptive test names
  // Cover all props and variants
  // Test accessibility requirements
  // Test error conditions
});
```

**Accessibility Pattern (from Skeleton.svelte, Avatar.svelte):**
```typescript
// Interactive role detection
const INTERACTIVE_ROLES = new Set([...]);

// Tabindex parsing
const parsedTabIndex = $derived<number | undefined>(() => {
  // Safe number parsing
});

// Interactive state detection
const hasInteractiveHandlers = $derived(() => 
  Boolean(onclick || onkeydown || onkeyup)
);

const isInteractive = $derived(() => {
  // Check role, handlers, tabindex
});
```

---

## Success Criteria

### Component Implementation
- ✅ All 5 components created in `packages/primitives/src/components/`
- ✅ All components exported in `packages/primitives/src/index.ts`
- ✅ All components have comprehensive props with JSDoc
- ✅ All components use design tokens (no hardcoded values)
- ✅ All components follow existing naming conventions

### Testing
- ✅ All components have unit tests with ≥90% coverage
- ✅ All tests pass: `pnpm test`
- ✅ Test harnesses created for complex components
- ✅ Accessibility requirements tested

### Quality
- ✅ TypeScript compiles: `pnpm typecheck`
- ✅ Linting passes: `pnpm lint`
- ✅ Formatting correct: `pnpm format`
- ✅ No console errors or warnings

### Documentation
- ✅ All components documented in `knowledgebase/api-reference.md`
- ✅ Usage examples in `knowledgebase/core-patterns.md`
- ✅ Landing page pattern added to KB
- ✅ `_concepts.yaml` updated with new components
- ✅ No phantom component references in KB
- ✅ Playground demos created

### Validation
- ✅ Test PAI can use new components without hallucinations
- ✅ Build succeeds: `pnpm build`
- ✅ Bundle size acceptable (check dist/)
- ✅ Tree-shaking works (components individually importable)

---

## Implementation Order & Dependencies

### Recommended Sequence:

**Week 1:**
- Phase 1: Card (most complex, highest value)
- Phase 2: Container (simple, foundational)

**Week 2:**
- Phase 3: Section (simple, builds on Container)
- Phase 4: Heading (medium complexity)

**Week 3:**
- Phase 5: Text (medium complexity)
- Phase 6: Integration & validation

### Dependencies:
- Card, Container, Section are independent (can be parallelized)
- Heading and Text are similar (implement in sequence to reuse patterns)
- Phase 6 requires all previous phases complete

---

## Additional Recommendations

### Icon Additions (Optional - Low Priority)

If adding icons to eliminate hallucinations:

**ApiIcon:**
- Could use existing `ServerIcon`, `DatabaseIcon`, or `CloudIcon` as semantic alternatives
- Alternatively: add custom SVG to `packages/icons/src/icons/api.svelte`

**WorkflowIcon:**
- Could use existing `GitBranchIcon`, `GitMergeIcon`, or `LayersIcon` as alternatives
- Alternatively: add custom SVG to `packages/icons/src/icons/workflow.svelte`

**Recommendation:** Document existing alternatives in KB rather than adding new icons

### Knowledge Base Enhancements Post-Implementation

**New Documentation File:**
`knowledgebase/patterns-general-websites.md`
- Landing pages
- Marketing sites
- Documentation sites
- Admin dashboards (non-Fediverse)
- Complete examples using new components

**Update Existing Files:**
- Remove Card bug from `core-patterns.md`
- Add "Complete Component Inventory" section to `api-reference.md`
- Add icon reference appendix with all 300 icons listed

---

---

## PHASE 6: Estimated Effort

**Timeline:** 2-3 days with AI assistance

**Breakdown:**
- Sub-phases 6.1-6.4 (Documentation): 1 day
- Sub-phases 6.5-6.6 (Examples & QA): 0.5 days
- Sub-phases 6.7-6.10 (Validation): 0.5 days

**Parallelization Opportunities:**
- 6.1 (Inventory) and 6.2 (Patterns) can run in parallel
- 6.3 (Reference) and 6.4 (Structure) can run in parallel
- 6.5 (Examples) requires 6.1-6.4 complete

---

## Expected Outcomes

### Before Phase 6 (Current State)
- ✅ 5 new components implemented and tested
- ⚠️ KB has 6,662 lines, primarily Fediverse-focused
- ❌ PAI hallucinates components for landing pages
- ❌ No complete component inventory
- ❌ No icon reference
- ❌ Token schemas vague

### After Phase 6 (Target State)
- ✅ 5 components fully documented
- ✅ KB has ~11,000 lines, comprehensive coverage
- ✅ PAI builds landing pages without hallucinations
- ✅ Complete component inventory with negatives
- ✅ Complete icon reference (300 icons)
- ✅ Precise token schemas with error examples
- ✅ Usage patterns for ALL website types
- ✅ AI validation tests pass

### Hallucination Elimination

**Original Hallucinations:**
1. Container component → NOW EXISTS ✅
2. Section component → NOW EXISTS ✅
3. Heading component → NOW EXISTS ✅
4. Text component → NOW EXISTS ✅
5. Card component → NOW EXISTS ✅
6. ApiIcon → Documented alternatives ✅
7. WorkflowIcon → Documented alternatives ✅
8. Wrong token scales → Schema with correct values ✅
9. Font weight typos → Schema with examples ✅
10. Radii typo → Explicit callout ✅

**Result:** 0 hallucinations expected on landing page generation

---

## Notes

- All components should follow existing conventions in `greater-components/AGENTS.md`
- Maintain consistency with existing primitives (Button, Modal, etc.)
- Use same testing patterns and harness approach
- Follow accessibility patterns established in Skeleton and Avatar components
- All CSS should use `:global` scope and `gr-` prefix per existing convention
- Design tokens from `packages/tokens/src/tokens.json` are the source of truth
- Knowledge base expansion should follow existing documentation principles (examples-first, explicit context, semantic structure)

