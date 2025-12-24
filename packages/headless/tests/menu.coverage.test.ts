import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMenu } from '../src/primitives/menu';

describe('Menu Coverage', () => {
	let triggerEl: HTMLButtonElement;
	let menuEl: HTMLElement;
	let itemEl: HTMLButtonElement;

	beforeEach(() => {
		triggerEl = document.createElement('button');
		menuEl = document.createElement('div');
		itemEl = document.createElement('button');
		document.body.appendChild(triggerEl);
		document.body.appendChild(menuEl);
		document.body.appendChild(itemEl);
		vi.useFakeTimers();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('Item Action Updates', () => {
		it('should update existing item options', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl, { disabled: false });

			// Initial state
			expect(itemEl.getAttribute('aria-disabled')).toBeNull();

			// Update action with new options
			// Svelte actions are called again with new params on update
			// But the createMenu item action returns an object with destroy, not update
			// Wait, let's check the source again.
			// The item function: function item(node, options) ... returns { destroy }
			// It doesn't have an update method in the return object.
			// However, in Svelte, if the params change, the action is re-run (destroyed and re-created)
			// OR if it has an update method, that is called.
			// Since it DOES NOT have an update method, Svelte would normally destroy and recreate.
			// BUT the code has:
			// const existingIndex = menuItems.findIndex((item) => item.element === node);
			// if (existingIndex !== -1) { ... update ... return { destroy } }

			// So if we call it again on the same node, it updates.

			const onClick = vi.fn();
			const action2 = menu.actions.item(itemEl, { disabled: true, onClick });

			expect(itemEl.getAttribute('aria-disabled')).toBe('true');

			// Verify onClick is updated
			menu.helpers.open();
			itemEl.click();
			expect(onClick).not.toHaveBeenCalled(); // because disabled

			// Update again to enable
			const action3 = menu.actions.item(itemEl, { disabled: false, onClick });
			itemEl.click();
			expect(onClick).toHaveBeenCalled();

			action.destroy(); // Should remove from items
			// Note: action2 and action3 returned their own destroy functions
			// checking if they work correctly
			action2.destroy();
			action3.destroy();
		});

		it('should handle keyboard enter on item', () => {
			const onClick = vi.fn();
			const menu = createMenu();
			menu.actions.item(itemEl, { onClick });

			menu.helpers.open();
			itemEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(onClick).toHaveBeenCalled();
		});

		it('should handle keyboard space on item', () => {
			const onClick = vi.fn();
			const menu = createMenu();
			menu.actions.item(itemEl, { onClick });

			menu.helpers.open();
			itemEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

			expect(onClick).toHaveBeenCalled();
		});
	});

	describe('Trigger Keydown Edge Cases', () => {
		it('should focus last item on ArrowUp from trigger', () => {
			const menu = createMenu();
			const action1 = menu.actions.trigger(triggerEl);
			const action2 = menu.actions.item(itemEl);

			// Add another item
			const item2 = document.createElement('button');
			document.body.appendChild(item2);
			const action3 = menu.actions.item(item2);

			triggerEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			expect(menu.state.open).toBe(true);

			// Wait for setTimeout in trigger handler
			vi.runAllTimers();

			expect(menu.state.focusedIndex).toBe(1); // Last item (index 1)

			action1.destroy();
			action2.destroy();
			action3.destroy();
		});
	});

	describe('Focus Navigation Edge Cases', () => {
		it('should handle navigation when all items are disabled', () => {
			const menu = createMenu();
			const item1 = document.createElement('button');
			const item2 = document.createElement('button');
			document.body.appendChild(item1);
			document.body.appendChild(item2);

			menu.actions.item(item1, { disabled: true });
			menu.actions.item(item2, { disabled: true });

			menu.helpers.open();

			// Focus next should not crash and should not change focus if all disabled
			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(-1);

			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(-1);
		});

		it('should handle navigation with no items', () => {
			const menu = createMenu();
			menu.helpers.open();

			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(-1);

			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(-1);

			menu.helpers.focusFirst();
			menu.helpers.focusLast();
			menu.helpers.setActiveIndex(0);
		});
	});

	describe('State Proxy Coverage', () => {
		it('should update DOM when activeIndex/focusedIndex changes via proxy', () => {
			const menu = createMenu();
			menu.actions.trigger(triggerEl);
			menu.actions.item(itemEl);

			menu.state.open = true;
			expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

			menu.state.focusedIndex = 0;
			expect(itemEl.getAttribute('data-active')).toBe('true');
			expect(menu.state.activeIndex).toBe(0);

			menu.state.activeIndex = -1;
			expect(itemEl.getAttribute('data-active')).toBe('false');
			expect(menu.state.focusedIndex).toBe(-1);
		});

		it('should access items via proxy getter', () => {
			const menu = createMenu();
			menu.actions.item(itemEl);

			expect(menu.state.items).toEqual([itemEl]);
		});
	});

	describe('Typeahead via Menu Action', () => {
		it('should handle typeahead via menu element keydown', () => {
			const menu = createMenu();
			const action = menu.actions.menu(menuEl);
			const itemA = document.createElement('button');
			itemA.textContent = 'Apple';
			menu.actions.item(itemA);

			menu.helpers.open();

			// Dispatch keydown on menu element (not trigger)
			menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

			expect(menu.state.focusedIndex).toBe(0);

			action.destroy();
		});
	});

	describe('Helper Coverage', () => {
		it('should handle all keys in handleKeyDown helper', () => {
			const menu = createMenu();
			const content = document.createElement('div');
			menu.actions.menu(content);
			const item1 = document.createElement('button');
			const item2 = document.createElement('button');
			const item3 = document.createElement('button');
			menu.actions.item(item1);
			menu.actions.item(item2);
			menu.actions.item(item3);

			menu.helpers.open();

			// Expect initial focus at 0
			expect(menu.state.focusedIndex).toBe(0);

			// ArrowDown -> 1
			menu.helpers.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(1);

			// ArrowUp -> 0
			menu.helpers.handleKeyDown({ key: 'ArrowUp', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(0); // Back to 0

			// ArrowUp again -> 2 (loop)
			menu.helpers.handleKeyDown({ key: 'ArrowUp', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(2);

			// Home
			menu.helpers.handleKeyDown({ key: 'Home', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(0);

			// End
			menu.helpers.handleKeyDown({ key: 'End', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(2);

			// Escape
			menu.helpers.handleKeyDown({ key: 'Escape', preventDefault: vi.fn() } as any);
			expect(menu.state.open).toBe(false);
		});
	});
});
