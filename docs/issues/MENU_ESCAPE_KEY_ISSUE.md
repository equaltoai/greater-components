# Menu Escape Key Issue

## Summary

The Menu compound component (`Menu.Root`, `Menu.Content`, `Menu.Item`) does not close when the Escape key is pressed while focus is on a menu item.

## Failing Test

**File:** `packages/testing/tests/demo/focus.spec.ts`  
**Test:** `@focus menu trap returns focus to trigger after closing`

```typescript
test('@focus menu trap returns focus to trigger after closing', async ({ page }) => {
	const trigger = page.getByTestId('menu-trigger');
	await trigger.focus();
	await trigger.press('Enter'); // Opens menu

	const firstItem = page.getByRole('menuitem', { name: 'Profile Overview' });
	const secondItem = page.getByRole('menuitem', { name: 'Security Logins' });

	await expect(firstItem).toBeFocused(); // PASSES

	await firstItem.press('ArrowDown'); // PASSES
	await expect(secondItem).toBeFocused(); // PASSES

	await secondItem.press('Escape'); // ISSUE HERE
	await expect(firstItem).not.toBeVisible(); // FAILS - menu stays visible
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect(trigger).toBeFocused();
});
```

## Behavior

- **Expected:** Pressing Escape closes the menu and returns focus to the trigger
- **Actual:** Menu remains visible after pressing Escape

## Components Involved

| Component      | File                                                     | Role                                 |
| -------------- | -------------------------------------------------------- | ------------------------------------ |
| `Menu.Root`    | `packages/primitives/src/components/Menu/Root.svelte`    | Manages state, provides context      |
| `Menu.Content` | `packages/primitives/src/components/Menu/Content.svelte` | Renders menu popup, handles keyboard |
| `Menu.Item`    | `packages/primitives/src/components/Menu/Item.svelte`    | Individual menu items                |
| `SimpleMenu`   | `packages/primitives/src/components/SimpleMenu.svelte`   | Convenience wrapper used in demo     |

## Architecture

```
Menu.Root (state owner)
├── provides context with { isOpen, close(), ... }
├── Menu.Trigger
│   └── Button with aria-expanded
└── Menu.Content
    ├── {#if ctx.isOpen} conditional render
    ├── keydown handler for navigation
    └── Menu.Item (multiple)
        └── own keydown handler
```

## What Works

- Opening the menu via Enter/click on trigger
- Arrow key navigation between items (ArrowDown/ArrowUp)
- Click outside to close
- Escape key when focus is still on trigger

## What Doesn't Work

- Escape key when focus is on a `Menu.Item`

## Root Cause Analysis

The issue appears to be in **Svelte 5's reactivity system** with context getters:

1. `Root.svelte` creates context with getter: `get isOpen() { return isOpen; }`
2. `Content.svelte` reads via `ctx.isOpen`
3. When `closeMenu()` sets `isOpen = false`, the change may not propagate through the context getter

### Attempted Fixes (all failed)

1. **Add Escape handling in `Item.svelte`** - Called `ctx.close()` but menu didn't close
2. **Use `$derived(ctx.isOpen)`** in Content - Tried to force reactivity tracking
3. **Document-level keydown listener** - Added capture-phase listener in Content
4. **Event bubbling** - Let Escape bubble from Item to Content's keydown handler

### Key Observation

ArrowDown navigation works correctly, which also uses `ctx.setActiveIndex()` from the context. This suggests the context functions work, but state updates aren't triggering re-renders in `Content.svelte`.

## Comparison: Old Menu vs New

The **old deprecated `Menu.svelte`** (single-file component) has passing tests for Escape key. It uses a simpler architecture where all state and handlers are in one component.

The **new compound component pattern** distributes state across multiple components connected via Svelte context, which appears to have reactivity issues.

## Files Modified During Investigation

- `packages/primitives/src/components/Menu/Content.svelte` - Added `$derived`, document-level escape handler
- `packages/primitives/src/components/Menu/Item.svelte` - Added comment about key bubbling
- `packages/testing/tests/demo/focus.spec.ts` - No permanent changes

## Potential Solutions to Explore

1. **Use Svelte stores instead of context getters** - Stores have explicit subscription semantics
2. **Pass reactive object through context** - Instead of an object with getters
3. **Use `bind:open` pattern differently** - Direct prop drilling
4. **Investigate Svelte 5 context reactivity docs** - May be a known limitation

## Priority

**High** - This is a core accessibility feature. Users expect Escape to close menus.

## Related

- Modal component Escape handling works correctly (same test file, passes)
- Old `Menu.svelte` tests all pass including Escape
