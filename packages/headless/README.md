# @greater/headless

**Headless UI primitives for Greater Components** - Behavior without styling.

## Overview

This package provides 5 production-ready headless UI primitives that handle all the complex behavior, accessibility, and keyboard interactions - while leaving the styling completely up to you.

**Perfect for:**
- Building custom component libraries
- Implementing your own design system
- Maximum flexibility in styling
- ActivityPub/Fediverse applications

## Features

- ✅ **Zero Styling** - Pure behavior, style however you want
- ✅ **Fully Accessible** - WCAG 2.1 AA compliant out of the box
- ✅ **Tiny Bundles** - All primitives under 2KB gzipped
- ✅ **TypeScript** - 100% type-safe
- ✅ **Tree-Shakeable** - Import only what you need
- ✅ **Svelte 5 Runes** - Modern reactivity

## Installation

```bash
# JSR (recommended)
npx jsr add @greater/headless

# npm
npm install @greater/headless
```

## Primitives

### Button (0.94 KB gzipped)

Accessible button with loading states, keyboard navigation, and ARIA attributes.

```svelte
<script>
  import { createButton } from '@greater/headless/button';
  
  const button = createButton({
    onClick: () => console.log('Clicked!'),
    loading: false
  });
</script>

<button use:button.actions.button class="your-styles">
  {#if button.state.loading}
    Loading...
  {:else}
    Click me
  {/if}
</button>

<style>
  .your-styles {
    /* Complete styling freedom */
  }
</style>
```

**Features:**
- Loading states with `aria-busy`
- Pressed state for toggle buttons
- Full keyboard support
- Disabled state handling
- Focus management

### Modal (1.19 KB gzipped)

Accessible modal dialog with focus trapping and ESC to close.

```svelte
<script>
  import { createModal } from '@greater/headless/modal';
  
  const modal = createModal({
    closeOnEscape: true,
    closeOnBackdrop: true,
    trapFocus: true,
    lockScroll: true
  });
</script>

<button use:modal.actions.trigger>
  Open Modal
</button>

{#if modal.state.open}
  <div use:modal.actions.backdrop class="backdrop">
    <div use:modal.actions.content class="modal">
      <h2 id="{modal.state.id}-title">Modal Title</h2>
      <p id="{modal.state.id}-description">Modal content here</p>
      <button use:modal.actions.close>Close</button>
    </div>
  </div>
{/if}

<style>
  .backdrop { /* Your backdrop styles */ }
  .modal { /* Your modal styles */ }
</style>
```

**Features:**
- Focus trapping (tab cycles within modal)
- ESC to close
- Click backdrop to close
- Body scroll locking
- Focus return on close
- Full ARIA attributes

### Menu (1.51 KB gzipped)

Accessible dropdown menu with keyboard navigation and typeahead search.

```svelte
<script>
  import { createMenu } from '@greater/headless/menu';
  
  const menu = createMenu({
    closeOnSelect: true,
    enableTypeahead: true,
    onSelect: (value) => console.log('Selected:', value)
  });
</script>

<button use:menu.actions.trigger>
  Open Menu
</button>

{#if menu.state.open}
  <div use:menu.actions.menu class="menu">
    <button use:menu.actions.item('option1')>Option 1</button>
    <button use:menu.actions.item('option2')>Option 2</button>
    <div use:menu.actions.separator></div>
    <button use:menu.actions.item('option3', true)>
      Option 3 (Disabled)
    </button>
  </div>
{/if}

<style>
  .menu { /* Your menu styles */ }
</style>
```

**Features:**
- Arrow key navigation
- Home/End keys
- Typeahead search (type to find)
- Click outside to close
- Disabled items
- Separator support
- Full ARIA menu role

### Tooltip (1.32 KB gzipped)

Accessible tooltip with smart positioning that avoids viewport edges.

```svelte
<script>
  import { createTooltip } from '@greater/headless/tooltip';
  
  const tooltip = createTooltip({
    placement: 'top',
    showDelay: 500,
    smartPositioning: true
  });
</script>

<button use:tooltip.actions.trigger>
  Hover me
</button>

{#if tooltip.state.open}
  <div 
    use:tooltip.actions.content 
    class="tooltip"
    data-placement={tooltip.state.placement}
  >
    Tooltip content
  </div>
{/if}

<style>
  .tooltip {
    /* Smart positioning applied automatically */
    /* Just style the appearance */
  }
</style>
```

**Features:**
- Smart positioning (avoids viewport edges)
- 12 placement options
- Show on hover and/or focus
- Configurable delays
- Automatic position updates on scroll/resize
- Full ARIA tooltip role

### Tabs (1.22 KB gzipped)

Accessible tabs with arrow key navigation and automatic/manual activation.

```svelte
<script>
  import { createTabs } from '@greater/headless/tabs';
  
  const tabs = createTabs({
    initialTab: 'tab1',
    orientation: 'horizontal',
    activation: 'automatic',
    onChange: (value) => console.log('Tab changed:', value)
  });
</script>

<div use:tabs.actions.list class="tab-list">
  <button use:tabs.actions.tab('tab1')}>Tab 1</button>
  <button use:tabs.actions.tab('tab2')}>Tab 2</button>
  <button use:tabs.actions.tab('tab3')}>Tab 3</button>
</div>

<div use:tabs.actions.panel('tab1')} class="panel">
  Panel 1 content
</div>

<div use:tabs.actions.panel('tab2')} class="panel">
  Panel 2 content
</div>

<div use:tabs.actions.panel('tab3')} class="panel">
  Panel 3 content
</div>

<style>
  .tab-list { /* Your tab list styles */ }
  .panel { /* Your panel styles */ }
</style>
```

**Features:**
- Arrow key navigation (left/right or up/down)
- Home/End keys
- Automatic or manual activation
- Horizontal/vertical orientation
- Loop navigation
- Disabled tabs
- Full ARIA tablist role

## Bundle Sizes

All primitives are optimized for size:

| Primitive | Gzipped | Raw |
|-----------|---------|-----|
| Button    | 0.94 KB | 2.77 KB |
| Modal     | 1.19 KB | 3.43 KB |
| Tabs      | 1.22 KB | 3.59 KB |
| Tooltip   | 1.32 KB | 4.38 KB |
| Menu      | 1.51 KB | 4.64 KB |

**All under 2KB gzipped!**

## API Pattern

All primitives follow a consistent pattern:

```typescript
const primitive = createPrimitive(config);

// Returns:
{
  state,     // Reactive state (Svelte runes)
  actions,   // Svelte actions for DOM elements
  helpers    // Programmatic control functions
}
```

### State
Reactive state you can bind to or read:
```svelte
{#if button.state.loading}
  Loading...
{/if}
```

### Actions
Svelte actions applied with `use:` directive:
```svelte
<button use:button.actions.button>
```

### Helpers
Programmatic control:
```svelte
<script>
  button.helpers.setLoading(true);
  modal.helpers.open();
  menu.helpers.close();
</script>
```

## Accessibility

Every primitive is built with accessibility in mind:

- ✅ **WCAG 2.1 AA** compliant
- ✅ **Full keyboard support** (Arrow keys, Tab, Enter, ESC, Home, End)
- ✅ **Screen reader friendly** (Proper ARIA attributes)
- ✅ **Focus management** (Logical tab order, focus trapping where needed)
- ✅ **Semantic HTML** (Correct roles and attributes)

## TypeScript

100% TypeScript with full type inference:

```typescript
import type { ButtonState, ButtonConfig } from '@greater/headless/button';
import type { ModalState, ModalConfig } from '@greater/headless/modal';
// ... etc
```

## Use with ActivityPub/Fediverse

These primitives are perfect for building ActivityPub clients:

- **Button**: Boost, Like, Reply actions
- **Modal**: Image lightboxes, confirmation dialogs, compose modals
- **Menu**: Post actions, account menus, filter menus
- **Tooltip**: Account previews, post previews, help text
- **Tabs**: Settings panels, navigation, content filters

## Why Headless?

Traditional component libraries force you into their design decisions. Headless primitives give you:

1. **Complete Style Control** - No CSS to override or fight with
2. **Smaller Bundles** - Only behavior code, no styles to ship
3. **Framework Agnostic** - Behavior doesn't depend on design
4. **Easier Maintenance** - Behavior and styling separated
5. **Maximum Flexibility** - Build exactly what you need

## Examples

See the `@greater/fediverse` package for real-world usage of these primitives in:
- Status compound component
- Timeline compound component  
- Compose compound component
- Notifications compound component

## License

AGPL-3.0-only

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

---

**Built for the Fediverse, by the Fediverse** 🌐
