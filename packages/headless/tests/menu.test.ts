/**
 * Menu Primitive Tests
 *
 * Comprehensive coverage for the Menu headless primitive.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMenu } from '../src/primitives/menu';
import type { ActionReturn } from '../src/types/common';

function destroyAction(action: ActionReturn | void): void {
	if (
		action &&
		typeof action === 'object' &&
		'destroy' in action &&
		typeof action.destroy === 'function'
	) {
		action.destroy();
	}
}

function appendTriggerElement(): HTMLButtonElement {
	const button = document.createElement('button');
	button.type = 'button';
	document.body.appendChild(button);
	return button;
}

function appendMenuElement(): HTMLElement {
	const menu = document.createElement('div');
	document.body.appendChild(menu);
	return menu;
}

function appendMenuItem(text: string, parent?: HTMLElement): HTMLButtonElement {
	const item = document.createElement('button');
	item.type = 'button';
	item.textContent = text;
	(parent ?? document.body).appendChild(item);
	return item;
}

describe('Menu Primitive', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default config', () => {
			const menu = createMenu();

			expect(menu.state.open).toBe(false);
			expect(menu.state.focusedIndex).toBe(-1);
			expect(menu.state.activeIndex).toBe(-1);
			expect(menu.state.items.length).toBe(0);
			expect(menu.state.closeOnSelect).toBe(true);
			expect(menu.state.loop).toBe(true);
		});

		it('should respect custom configuration and report state changes', () => {
			const onOpen = vi.fn();
			const onClose = vi.fn();
			const onOpenChange = vi.fn();

			const menu = createMenu({
				open: true,
				id: 'custom-menu',
				closeOnSelect: false,
				loop: false,
				onOpen,
				onClose,
				onOpenChange,
			});

			expect(menu.state.id).toBe('custom-menu');
			expect(menu.state.open).toBe(true);
			expect(menu.state.closeOnSelect).toBe(false);
			expect(menu.state.loop).toBe(false);

			menu.helpers.close();
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onOpenChange).toHaveBeenLastCalledWith(false);

			menu.helpers.toggle();
			expect(onOpen).toHaveBeenCalledTimes(1);
			expect(onOpenChange).toHaveBeenLastCalledWith(true);
			expect(menu.state.open).toBe(true);
		});
	});

	describe('Trigger action', () => {
		it('should toggle open state through trigger interaction', () => {
			const menu = createMenu();
			const trigger = appendTriggerElement();
			const actions: Array<ActionReturn | void> = [];

			const triggerAction = menu.actions.trigger(trigger);
			actions.push(triggerAction);

			expect(trigger.getAttribute('aria-haspopup')).toBe('true');
			expect(trigger.getAttribute('aria-expanded')).toBe('false');
			expect(trigger.getAttribute('aria-controls')).toBe(menu.state.id);

			trigger.click();
			expect(menu.state.open).toBe(true);
			expect(trigger.getAttribute('aria-expanded')).toBe('true');

			trigger.click();
			expect(menu.state.open).toBe(false);
			expect(trigger.getAttribute('aria-expanded')).toBe('false');

			actions.forEach(destroyAction);
		});

		it('should handle keyboard openings via trigger keys', () => {
			vi.useFakeTimers();

			const menu = createMenu();
			const trigger = appendTriggerElement();
			const content = appendMenuElement();
			const firstItem = appendMenuItem('First', content);
			const secondItem = appendMenuItem('Second', content);
			const actions: Array<ActionReturn | void> = [];

			actions.push(menu.actions.trigger(trigger));
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(firstItem));
			actions.push(menu.actions.item(secondItem));

			trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
			expect(menu.state.open).toBe(true);
			expect(menu.state.focusedIndex).toBe(0);

			trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			vi.runAllTimers();
			expect(menu.state.focusedIndex).toBe(1);

			actions.forEach(destroyAction);
		});
	});

	describe('Menu action', () => {
		it('should close when clicking outside of menu content', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));

			menu.helpers.open();
			expect(menu.state.open).toBe(true);

			outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(menu.state.open).toBe(false);

			menu.helpers.open();
			content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(menu.state.open).toBe(true);

			actions.forEach(destroyAction);
		});
	});

	describe('Item behavior', () => {
		it('should invoke onClick and close when closeOnSelect is true', () => {
			const onClick = vi.fn();
			const menu = createMenu();
			const content = appendMenuElement();
			const item = appendMenuItem('Action', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(item, { onClick }));

			menu.helpers.open();
			item.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(onClick).toHaveBeenCalledTimes(1);
			expect(menu.state.open).toBe(false);

			actions.forEach(destroyAction);
		});

		it('should keep menu open when closeOnSelect is false', () => {
			const menu = createMenu({ closeOnSelect: false });
			const content = appendMenuElement();
			const item = appendMenuItem('Persistent', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(item));

			menu.helpers.open();
			item.click();

			expect(menu.state.open).toBe(true);

			actions.forEach(destroyAction);
		});

		it('should skip disabled items during focus navigation', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const first = appendMenuItem('First', content);
			const disabled = appendMenuItem('Disabled', content);
			const last = appendMenuItem('Last', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(first));
			actions.push(menu.actions.item(disabled, { disabled: true }));
			actions.push(menu.actions.item(last));

			menu.helpers.open();
			menu.helpers.focusFirst();
			expect(menu.state.focusedIndex).toBe(0);

			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(2);

			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(0);

			expect(disabled.getAttribute('aria-disabled')).toBe('true');

			actions.forEach(destroyAction);
		});
	});

	describe('Navigation helpers', () => {
		it('should honor loop=false when navigating past edges', () => {
			const menu = createMenu({ loop: false });
			const content = appendMenuElement();
			const first = appendMenuItem('First', content);
			const second = appendMenuItem('Second', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(first));
			actions.push(menu.actions.item(second));

			menu.helpers.open();
			menu.helpers.focusFirst();
			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(0);

			menu.helpers.focusLast();
			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(1);

			actions.forEach(destroyAction);
		});

		it('should support typeahead search and escape closing via handleKeyDown', () => {
			vi.useFakeTimers();

			const menu = createMenu();
			const content = appendMenuElement();
			const alpha = appendMenuItem('Alpha', content);
			const beta = appendMenuItem('Beta', content);
			const charlie = appendMenuItem('Charlie', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(alpha));
			actions.push(menu.actions.item(beta));
			actions.push(menu.actions.item(charlie));

			menu.helpers.open();
			menu.helpers.handleKeyDown({
				key: 'c',
				preventDefault: vi.fn(),
			} as unknown as KeyboardEvent);
			expect(menu.state.focusedIndex).toBe(2);

			menu.helpers.handleKeyDown({
				key: 'Escape',
				preventDefault: vi.fn(),
			} as unknown as KeyboardEvent);
			expect(menu.state.open).toBe(false);

			vi.runAllTimers();
			actions.forEach(destroyAction);
		});

		it('should set active index and focus items via helper', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const item = appendMenuItem('Focusable', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(item));

			menu.helpers.open();
			menu.helpers.setActiveIndex(0);

			expect(menu.state.focusedIndex).toBe(0);
			expect(document.activeElement).toBe(item);

			actions.forEach(destroyAction);
		});
	});

	it('should set separator attributes', () => {
		const menu = createMenu();
		const separator = document.createElement('div');
		document.body.appendChild(separator);

		const action = menu.actions.separator(separator);

		expect(separator.getAttribute('role')).toBe('separator');
		expect(separator.getAttribute('aria-orientation')).toBe('horizontal');

		destroyAction(action);
	});

	describe('Advanced keyboard navigation', () => {
		it('should handle Home/End keys', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const first = appendMenuItem('First', content);
			const middle = appendMenuItem('Middle', content);
			const last = appendMenuItem('Last', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(first));
			actions.push(menu.actions.item(middle));
			actions.push(menu.actions.item(last));

			menu.helpers.open();
			menu.helpers.focusNext(); // Start at first
			menu.helpers.focusNext(); // Move to middle

			content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
			expect(menu.state.focusedIndex).toBe(0);

			content.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
			expect(menu.state.focusedIndex).toBe(2);

			actions.forEach(destroyAction);
		});

		it('should handle Tab key to close menu', () => {
			const menu = createMenu();
			const content = appendMenuElement();

			const action = menu.actions.menu(content);

			menu.helpers.open();
			content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
			expect(menu.state.open).toBe(false);

			destroyAction(action);
		});

		it('should support multi-character typeahead', () => {
			vi.useFakeTimers();

			const menu = createMenu();
			const content = appendMenuElement();
			const apple = appendMenuItem('Apple', content);
			const apricot = appendMenuItem('Apricot', content);
			const banana = appendMenuItem('Banana', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(apple));
			actions.push(menu.actions.item(apricot));
			actions.push(menu.actions.item(banana));

			menu.helpers.open();

			// Type 'ap' quickly
			menu.helpers.handleKeyDown({ key: 'a', preventDefault: vi.fn() } as any);
			menu.helpers.handleKeyDown({ key: 'p', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(0); // Apple

			// Type 'apr' to get to apricot
			menu.helpers.handleKeyDown({ key: 'r', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(1); // Apricot

			// Wait for buffer to clear
			vi.advanceTimersByTime(600);

			// Type 'b' to get banana
			menu.helpers.handleKeyDown({ key: 'b', preventDefault: vi.fn() } as any);
			expect(menu.state.focusedIndex).toBe(2);

			actions.forEach(destroyAction);
		});
	});

	describe('Focus management', () => {
		it('should maintain focus index correctly', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const first = appendMenuItem('First', content);
			const second = appendMenuItem('Second', content);
			const third = appendMenuItem('Third', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(first));
			actions.push(menu.actions.item(second));
			actions.push(menu.actions.item(third));

			menu.helpers.open();

			menu.helpers.focusFirst();
			expect(menu.state.focusedIndex).toBe(0);

			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(1);

			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(2);

			menu.helpers.focusLast();
			expect(menu.state.focusedIndex).toBe(2);

			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(1);

			actions.forEach(destroyAction);
		});
	});

	describe('ARIA attributes', () => {
		it('should set correct ARIA attributes on menu', () => {
			const menu = createMenu();
			const content = appendMenuElement();

			const action = menu.actions.menu(content);

			expect(content.getAttribute('role')).toBe('menu');

			destroyAction(action);
		});
	});

	describe('Edge cases and cleanup', () => {
		it('should cleanup event listeners on destroy', () => {
			const menu = createMenu();
			const trigger = appendTriggerElement();
			const content = appendMenuElement();
			const item = appendMenuItem('Item', content);

			const triggerAction = menu.actions.trigger(trigger);
			const menuAction = menu.actions.menu(content);
			const itemAction = menu.actions.item(item);

			menu.helpers.open();

			destroyAction(triggerAction);
			destroyAction(menuAction);
			destroyAction(itemAction);

			// After destroy, interactions shouldn't work
			trigger.click();
			expect(menu.state.open).toBe(true); // State unchanged

			content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			expect(menu.state.open).toBe(true); // Still unchanged
		});

		it('should support setting activeIndex', () => {
			const menu = createMenu();
			const content = appendMenuElement();
			const item = appendMenuItem('Item', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(item));

			menu.helpers.open();
			menu.helpers.setActiveIndex(0);

			expect(menu.state.activeIndex).toBe(0);
			expect(menu.state.focusedIndex).toBe(0);
			expect(document.activeElement).toBe(item);

			actions.forEach(destroyAction);
		});

		it('should loop focus in both directions when loop=true', () => {
			const menu = createMenu({ loop: true });
			const content = appendMenuElement();
			const first = appendMenuItem('First', content);
			const second = appendMenuItem('Second', content);

			const actions: Array<ActionReturn | void> = [];
			actions.push(menu.actions.menu(content));
			actions.push(menu.actions.item(first));
			actions.push(menu.actions.item(second));

			menu.helpers.open();
			menu.helpers.focusFirst();
			expect(menu.state.focusedIndex).toBe(0);

			// Go previous from first - should loop to last
			menu.helpers.focusPrevious();
			expect(menu.state.focusedIndex).toBe(1);

			// Go next from last - should loop to first
			menu.helpers.focusNext();
			expect(menu.state.focusedIndex).toBe(0);

			actions.forEach(destroyAction);
		});
	});
});
