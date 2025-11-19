# Greater Components Development Guidelines

Coding standards, component creation patterns, testing requirements, and review checklist.

## Table of Contents

- [Code Style](#code-style)
- [Component Creation](#component-creation)
- [TypeScript Standards](#typescript-standards)
- [Testing Requirements](#testing-requirements)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Standards](#performance-standards)
- [Documentation Requirements](#documentation-requirements)
- [Review Checklist](#review-checklist)

---

## Code Style

### General Formatting

- **Indentation:** 2 spaces (no tabs)
- **Line Length:** 100 characters maximum
- **Quotes:** Single quotes for strings
- **Semicolons:** Optional but consistent within file
- **Trailing Commas:** Required in multiline

### Prettier Configuration

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

### ESLint Rules

Key rules enforced:
- No unused variables
- No console logs in production
- Explicit function return types
- Proper async/await usage
- Accessibility rules via eslint-plugin-svelte

---

## Component Creation

### File Structure

```
packages/primitives/src/components/
├── Button/
│   ├── Button.svelte
│   ├── Button.test.ts
│   ├── Button.stories.ts
│   └── index.ts
```

### Component Template (Styled)

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  interface Props {
    variant?: 'solid' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    prefix?: Snippet;
    suffix?: Snippet;
    class?: string;
  }
  
  let {
    variant = 'solid',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    onclick,
    children,
    prefix,
    suffix,
    class: className = '',
  }: Props = $props();
  
  const button = createButton({
    type,
    disabled,
    loading,
    onClick: onclick,
  });
</script>

<button
  use:button.actions.button
  class="gr-button gr-button--{variant} gr-button--{size} {className}"
  class:gr-button--loading={loading}
  aria-busy={loading}
>
  {#if prefix}
    <span class="gr-button__prefix">
      {@render prefix()}
    </span>
  {/if}
  
  <span class="gr-button__content">
    {@render children?.()}
  </span>
  
  {#if suffix}
    <span class="gr-button__suffix">
      {@render suffix()}
    </span>
  {/if}
  
  {#if loading}
    <span class="gr-button__spinner" aria-hidden="true">
      <!-- Spinner SVG -->
    </span>
  {/if}
</button>

<style>
  .gr-button {
    /* Base styles using design tokens */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gr-spacing-sm);
    padding: var(--gr-spacing-md) var(--gr-spacing-lg);
    border-radius: var(--gr-radii-md);
    font-family: var(--gr-typography-fontFamily-sans);
    font-weight: var(--gr-typography-fontWeight-medium);
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  .gr-button:focus-visible {
    outline: 2px solid var(--gr-color-primary-600);
    outline-offset: 2px;
  }
  
  .gr-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Variants */
  .gr-button--solid {
    background: var(--gr-color-primary-600);
    color: white;
  }
  
  .gr-button--solid:hover:not(:disabled) {
    background: var(--gr-color-primary-700);
  }
  
  /* Sizes */
  .gr-button--sm {
    padding: var(--gr-spacing-sm) var(--gr-spacing-md);
    font-size: var(--gr-typography-fontSize-sm);
  }
  
  .gr-button--md {
    padding: var(--gr-spacing-md) var(--gr-spacing-lg);
    font-size: var(--gr-typography-fontSize-base);
  }
  
  .gr-button--lg {
    padding: var(--gr-spacing-lg) var(--gr-spacing-xl);
    font-size: var(--gr-typography-fontSize-lg);
  }
  
  /* Loading state */
  .gr-button--loading {
    position: relative;
  }
  
  .gr-button--loading .gr-button__content {
    opacity: 0;
  }
  
  .gr-button__spinner {
    position: absolute;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

### Component Template (Headless)

```typescript
// button.ts
import { tick } from 'svelte';

export interface ButtonConfig {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  onClick?: (event: MouseEvent) => void | Promise<void>;
}

export interface ButtonState {
  disabled: boolean;
  loading: boolean;
  pressed: boolean;
}

export function createButton(config: ButtonConfig = {}) {
  let state = $state<ButtonState>({
    disabled: config.disabled ?? false,
    loading: config.loading ?? false,
    pressed: config.pressed ?? false,
  });
  
  function button(node: HTMLElement) {
    node.setAttribute('type', config.type ?? 'button');
    node.setAttribute('role', 'button');
    
    if (state.disabled) {
      node.setAttribute('disabled', '');
      node.setAttribute('aria-disabled', 'true');
    }
    
    if (state.pressed !== undefined) {
      node.setAttribute('aria-pressed', String(state.pressed));
    }
    
    async function handleClick(event: MouseEvent) {
      if (state.disabled || state.loading) return;
      
      if (config.onClick) {
        state.loading = true;
        await tick();
        
        try {
          await config.onClick(event);
        } finally {
          state.loading = false;
        }
      }
    }
    
    node.addEventListener('click', handleClick);
    
    return {
      destroy() {
        node.removeEventListener('click', handleClick);
      },
    };
  }
  
  return {
    state,
    actions: { button },
    helpers: {
      setLoading: (loading: boolean) => state.loading = loading,
      setPressed: (pressed: boolean) => state.pressed = pressed,
      setDisabled: (disabled: boolean) => state.disabled = disabled,
    },
  };
}
```

### Naming Conventions

**Components:**
- PascalCase: `Button`, `Modal`, `TextField`, `Card`, `Container`
- Descriptive: `ThemeSwitcher` not `TS`

**Props:**
- camelCase: `variant`, `isLoading`, `onClose`
- Boolean prefix: `is`, `has`, `show`, `enable`

**Events:**
- Prefix with `on`: `onclick`, `onchange`, `oninput`
- Past tense for completion: `onSave`, `onDelete`

**CSS Classes:**
- BEM pattern: `gr-button__content`, `gr-button--solid`
- Prefix: `gr-` (Greater Components)

---

## TypeScript Standards

### Type Definitions

```typescript
// Use interfaces for props
interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onclick?: (event: MouseEvent) => void;
  children?: Snippet;
}

// Use types for unions and intersections
type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonState = Pick<ButtonProps, 'disabled' | 'loading'>;

// Export all public types
export type { ButtonProps, ButtonVariant, ButtonState };
```

### Type Safety

```typescript
// GOOD: Explicit types
function handleClick(event: MouseEvent): void {
  console.log('Clicked');
}

// GOOD: Generic constraints
function createStore<T extends object>(initial: T): Store<T> {
  let state = $state(initial);
  return { state };
}

// AVOID: Any types
function handleData(data: any) { // ❌ Don't use any
  console.log(data);
}

// GOOD: Unknown for truly unknown data
function handleData(data: unknown) { // ✅ Use unknown
  if (typeof data === 'string') {
    console.log(data);
  }
}
```

---

## Testing Requirements

### Unit Tests

Every component must have unit tests covering:
- Props behavior
- User interactions
- State changes
- Edge cases
- Accessibility

```typescript
import { test, expect } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { Button } from './Button.svelte';

test('button renders with correct text', () => {
  const { getByRole } = render(Button, {
    props: { children: 'Click Me' },
  });
  
  expect(getByRole('button')).toHaveTextContent('Click Me');
});

test('button calls onclick when clicked', () => {
  const onclick = vi.fn();
  const { getByRole } = render(Button, {
    props: { onclick },
  });
  
  fireEvent.click(getByRole('button'));
  
  expect(onclick).toHaveBeenCalledOnce();
});

test('button is disabled when disabled prop is true', () => {
  const { getByRole } = render(Button, {
    props: { disabled: true },
  });
  
  expect(getByRole('button')).toBeDisabled();
});

test('button shows loading state', () => {
  const { getByRole } = render(Button, {
    props: { loading: true },
  });
  
  expect(getByRole('button')).toHaveAttribute('aria-busy', 'true');
});
```

### Coverage Requirements

- **Minimum:** 80% overall coverage
- **Target:** 90%+ for core components
- **Critical:** 100% for accessibility features

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

All components must:

1. **Keyboard Accessible**
   - Tab navigation works
   - Enter/Space activates buttons
   - Escape closes dialogs
   - Arrow keys navigate menus

2. **Screen Reader Support**
   - Proper ARIA labels
   - Semantic HTML
   - Role attributes
   - State announcements

3. **Visual Requirements**
   - 4.5:1 contrast ratio for text
   - 3:1 contrast ratio for UI components
   - Focus indicators visible
   - Touch targets 44x44px minimum

4. **Motion**
   - Respect prefers-reduced-motion
   - No auto-playing animations

### Accessibility Testing

```typescript
import { test, expect } from 'vitest';
import { render } from '@equaltoai/greater-components-testing';
import { axe } from 'axe-core';

test('button has no accessibility violations', async () => {
  const { container } = render(Button);
  const results = await axe(container);
  
  expect(results.violations).toHaveLength(0);
});
```

---

## Performance Standards

### Bundle Size Limits

- Individual components: < 5KB gzipped
- Package totals:
  - primitives: < 30KB
  - headless: < 10KB
  - fediverse: < 50KB

### Performance Budget

- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### Optimization Checklist

- [ ] Tree-shakeable exports
- [ ] No unnecessary dependencies
- [ ] CSS optimized (no unused selectors)
- [ ] Images optimized (if any)
- [ ] Lazy load heavy components
- [ ] Virtual scrolling for long lists

---

## Documentation Requirements

### Component Documentation

Every component must include:

1. **JSDoc Comments**
```typescript
/**
 * Button component with variants and loading states.
 * 
 * @example
 * ```svelte
 * <Button variant="solid" onclick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
```

2. **Props Documentation**
```typescript
interface ButtonProps {
  /** Visual style variant */
  variant?: 'solid' | 'outline' | 'ghost';
  
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disables the button */
  disabled?: boolean;
  
  /** Shows loading spinner */
  loading?: boolean;
  
  /** Click handler */
  onclick?: (event: MouseEvent) => void;
}
```

3. **README.md**
   - Purpose and use cases
   - Installation
   - Basic example
   - Props table
   - Accessibility notes

---

## Review Checklist

### Before Submitting PR

**Code Quality:**
- [ ] Code follows style guide
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Prettier formatting applied

**Testing:**
- [ ] Unit tests written and passing
- [ ] Coverage meets requirements
- [ ] Accessibility tests pass
- [ ] E2E tests for complex interactions

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus management correct
- [ ] Color contrast meets WCAG AA
- [ ] axe-core tests pass

**Performance:**
- [ ] Bundle size within limits
- [ ] No performance regressions
- [ ] Images optimized
- [ ] Virtual scrolling for long lists

**Documentation:**
- [ ] JSDoc comments complete
- [ ] Props documented
- [ ] Example provided
- [ ] README updated
- [ ] Changelog entry added

**Integration:**
- [ ] Works in SvelteKit
- [ ] Works in Vite-only setup
- [ ] SSR compatible (if applicable)
- [ ] Works with TypeScript
- [ ] Works without TypeScript

### Review Process

1. **Self Review**
   - Run through checklist above
   - Test in multiple browsers
   - Test with keyboard only
   - Test with screen reader

2. **Peer Review**
   - Code quality
   - Test coverage
   - Documentation clarity

3. **Accessibility Review**
   - Automated tests
   - Manual testing
   - Screen reader verification

4. **Performance Review**
   - Bundle size check
   - Lighthouse audit
   - Performance metrics

---

## Git Commit Standards

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(primitives): add Switch component

Implement toggle switch with keyboard support and ARIA.

Closes #123

---

fix(fediverse): correct timeline virtual scrolling offset

Virtual scrolling calculated wrong item positions on initial load.

Fixes #456
```

---

## Related Documentation

- [Core Patterns](./core-patterns.md) - Usage patterns and examples
- [Testing Guide](./testing-guide.md) - Detailed testing strategies
- [API Reference](./api-reference.md) - Complete API documentation