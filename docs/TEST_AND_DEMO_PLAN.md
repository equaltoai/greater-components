# Test and Demo Plan

## Overview
This document outlines all components requiring comprehensive test coverage and demo implementations. Each component must have passing tests with zero TypeScript errors and zero lint warnings before moving to the next.

## Critical Rules

### Quality Gates
1. **After first test is written**: Check TypeScript errors and lint warnings. Fix ALL issues before writing more tests.
2. **After last test is written**: Run full test suite for that component. Verify 100% pass rate and zero TypeScript/lint errors.
3. **No moving on**: Do not proceed to next component until current component is completely green (tests passing, no TS errors, no lint warnings).

### Common Mistakes to AVOID
1. ❌ **Using `action.destroy?.()` directly on `void | ActionReturn` types**
   - ✅ Instead: Use `destroyAction(action)` helper function with proper type guards
   - ✅ Copy the working pattern from `tooltip.test.ts` lines 12-16

2. ❌ **Immediately destroying actions after creation**
   - Example: `menu.actions.item(item1).destroy?.();` // Item is destroyed immediately!
   - ✅ Instead: Store action, use it, then destroy in cleanup

3. ❌ **Not registering items properly in menu/list/combobox tests**
   - Actions must remain alive for the duration of the test
   - Only destroy in afterEach or at end of specific test

4. ❌ **Ignoring TypeScript errors**
   - Check `get_errors` after writing tests
   - Fix type issues immediately, don't accumulate them

5. ❌ **Ignoring lint warnings**
   - Run `pnpm lint` in the package directory
   - Zero warnings policy for new code

6. ❌ **Not verifying tests actually pass**
   - Must run `pnpm test <filename>` after creating/editing
   - Fix failing tests before moving on

7. ❌ **Creating tests from scratch instead of using working examples**
   - ✅ Copy patterns from existing working test files
   - ✅ Use `tooltip.test.ts`, `button.test.ts`, `avatar.test.ts` as templates

## Headless Primitives (packages/headless)

### ✅ Completed
- [x] **Avatar** (30 tests passing)
  - File: `tests/avatar.test.ts`
  - Status: Complete, all passing

- [x] **TextField** (31 tests passing)
  - File: `tests/textfield.test.ts`
  - Status: Complete, all passing

- [x] **Skeleton** (43 tests passing)
  - File: `tests/skeleton.test.ts`
  - Status: Complete, all passing

- [x] **Tooltip** (42 tests passing)
  - File: `tests/tooltip.test.ts`
  - Status: Complete, all passing, includes working `destroyAction` helper

- [x] **Button** (36 tests passing)
  - File: `tests/button.test.ts`
  - Status: Complete, all passing

- [x] **Menu** (12 tests passing)
  - File: `tests/menu.test.ts`
  - Status: Complete, all passing

- [x] **Modal** (13 tests passing)
  - File: `tests/modal.test.ts`
  - Status: Complete, all passing

- [x] **Tabs** (10 tests passing)
  - File: `tests/tabs.test.ts`
  - Status: Complete, all passing

### 🔴 Failed Attempts (needs retry)
- _None — all current attempts succeeded._

### ⏳ Pending Unit Tests
- [ ] **Combobox**
  - File: `tests/combobox.test.ts` (if exists in src/primitives/)
  - Test areas:
    - Input field behavior
    - Dropdown open/close
    - Item filtering/search
    - Keyboard navigation
    - ARIA attributes (role="combobox", aria-expanded, aria-autocomplete)
    - Selection handling
  - Template: Use tooltip.test.ts pattern

- [ ] **Listbox**
  - File: `tests/listbox.test.ts` (if exists in src/primitives/)
  - Test areas:
    - Single/multiple selection
    - Keyboard navigation
    - ARIA attributes (role="listbox", role="option", aria-selected)
    - Disabled options
  - Template: Use tooltip.test.ts pattern

- [ ] **Radio Group**
  - File: `tests/radio-group.test.ts` (if exists in src/primitives/)
  - Test areas:
    - Single selection enforcement
    - Keyboard navigation (Arrow keys)
    - ARIA attributes (role="radiogroup", role="radio", aria-checked)
    - Disabled radios
  - Template: Use tooltip.test.ts pattern

- [ ] **Checkbox**
  - File: `tests/checkbox.test.ts` (if exists in src/primitives/)
  - Test areas:
    - Checked/unchecked state
    - Indeterminate state
    - ARIA attributes (role="checkbox", aria-checked)
    - Disabled state
  - Template: Use tooltip.test.ts pattern

- [ ] **Switch**
  - File: `tests/switch.test.ts` (if exists in src/primitives/)
  - Test areas:
    - On/off state
    - ARIA attributes (role="switch", aria-checked)
    - Disabled state
  - Template: Use tooltip.test.ts pattern

- [ ] **Progress**
  - File: `tests/progress.test.ts` (if exists in src/primitives/)
  - Test areas:
    - Value updates
    - Indeterminate state
    - ARIA attributes (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax)
  - Template: Use tooltip.test.ts pattern

## Fediverse Components (packages/fediverse)

### High Priority (Core User Flows)
- [ ] **Timeline** _(unit coverage deferred — exercise via demos/E2E until rune-friendly harness exists)_
  - Reason: Timeline compound relies on rune context + hydrated components and cannot be mounted in Vitest without hacks. Follow user direction to keep coverage in the Playwright demos instead of unit tests.

- [ ] **Compose**
  - File: `tests/Compose.test.ts`
  - Test areas:
    - Text input and validation
    - Character count
    - Media attachment
    - Visibility selection
    - CW (content warning) toggle
    - Poll creation
    - Emoji picker integration
    - Post submission
    - Draft saving

- [ ] **Status**
  - File: `tests/Status.test.ts`
  - Test areas:
    - Content rendering (text, media, polls)
    - Action buttons (reply, boost, favorite)
    - Expand/collapse
    - CW reveal
    - Media gallery
    - Thread context

- [ ] **Profile**
  - File: `tests/Profile.test.ts`
  - Test areas:
    - User info display
    - Follow/unfollow button
    - Tab navigation (posts, replies, media)
    - Bio and fields rendering
    - Avatar and header images

### Medium Priority (User Interaction)
- [ ] **Notifications**
  - File: `tests/Notifications.test.ts`
  - Test areas:
    - Notification types (follow, favorite, boost, mention)
    - Mark as read
    - Filter by type
    - Real-time updates

- [ ] **Messages/DMs**
  - File: `tests/Messages.test.ts`
  - Test areas:
    - Conversation list
    - Message thread
    - Send message
    - Real-time updates

- [ ] **Search**
  - File: `tests/Search.test.ts`
  - Test areas:
    - Query input
    - Result types (accounts, statuses, hashtags)
    - Result rendering
    - Click through to detail

### Lower Priority (Configuration)
- [ ] **Filters**
  - File: `tests/Filters.test.ts`
  - Test areas:
    - Filter creation/editing
    - Filter application
    - Keyword matching

- [ ] **Lists**
  - File: `tests/Lists.test.ts`
  - Test areas:
    - List creation/editing
    - Member management
    - Timeline filtering

- [ ] **Auth**
  - File: `tests/Auth.test.ts`
  - Test areas:
    - Login flow
    - OAuth handling
    - Token management
    - Logout

## Playwright E2E Tests (packages/testing/tests/demo)

### Critical User Journeys
- [ ] **Compose and Post Flow**
  - File: `compose-flow.spec.ts`
  - Journey: Login → Open compose → Write post → Add media → Select visibility → Submit → Verify in timeline

- [ ] **Timeline Interaction Flow**
  - File: `timeline-flow.spec.ts`
  - Journey: Load timeline → Scroll through posts → Favorite a post → Boost a post → Reply to post

- [ ] **Profile Viewing Flow**
  - File: `profile-flow.spec.ts`
  - Journey: Click user avatar → View profile → Follow/unfollow → Browse posts tab → Browse media tab

- [ ] **Search Flow**
  - File: `search-flow.spec.ts`
  - Journey: Enter search query → View results → Click on account result → Click on status result

- [ ] **Notification Flow**
  - File: `notification-flow.spec.ts`
  - Journey: Receive notification → Click notification → Navigate to source → Mark as read

## Other Packages

### Icons Package
- [x] **Fix Test Setup**
  - Added `tests/icons.test.ts` covering default/custom props plus export coverage. Updated `vitest.config.ts` to resolve `svelte` with the browser/runtime conditions so `mount` works under Vitest 4 without SSR helpers. Package now runs clean through tests, `typecheck`, and repo-wide `lint`.

## Verification Checklist (Per Component)

Before marking any component as complete:

1. ✅ All tests written
2. ✅ Run `pnpm test <component>` - all tests pass
3. ✅ Run TypeScript check - zero errors
4. ✅ Run `pnpm lint` - zero errors, zero warnings
5. ✅ Coverage report shows ≥90% (if applicable)
6. ✅ Update todo list marking component complete

## Testing Best Practices

### Setup Pattern (from tooltip.test.ts)
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPrimitive } from '../src/primitives/primitive';
import type { ActionReturn } from '../src/types/common';

// Helper to safely destroy actions
function destroyAction(action: ActionReturn | void): void {
	if (action && typeof action === 'object' && 'destroy' in action && action.destroy) {
		action.destroy();
	}
}

describe('Primitive Name', () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('should test behavior', () => {
		const primitive = createPrimitive();
		const action = primitive.actions.someAction(element);

		// Test assertions here

		destroyAction(action); // Clean up
	});
});
```

### Action Lifecycle Pattern
```typescript
// ✅ CORRECT: Store action, use it, then destroy
const action = menu.actions.item(item1);
// ... use action ...
destroyAction(action);

// ❌ WRONG: Immediate destroy
menu.actions.item(item1).destroy?.(); // Item is destroyed right away!
```

### Type Import Pattern
```typescript
// ✅ CORRECT: Import from local types
import type { ActionReturn } from '../src/types/common';

// ❌ WRONG: Import from svelte/action (different type signature)
import type { ActionReturn } from 'svelte/action';
```

## Progress Tracking

**Total Components Needing Tests**: ~25+
**Completed**: 5 (avatar, textfield, skeleton, tooltip, button)
**In Progress**: 0
**Failed/Retry**: 1 (menu)
**Pending**: ~20+

**Current Pass Rate**: 182/182 tests (100%)
**TypeScript Errors**: 0
**Lint Warnings**: 0
