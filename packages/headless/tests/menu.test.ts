/**
 * Menu Primitive Tests
 * 
 * Comprehensive test suite for the Menu headless primitive.
 * Tests dropdown behavior, keyboard navigation, focus management, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMenu } from '../src/primitives/menu';

describe('Menu Primitive', () => {
	describe('Initialization', () => {
		it('should create with default config', () => {
			const menu = createMenu();

			expect(menu.state.open).toBe(false);
			expect(menu.state.activeIndex).toBe(-1);
			expect(menu.state.items).toEqual([]);
			expect(menu.state.closeOnSelect).toBe(true);
			expect(menu.state.loop).toBe(true);
		});

		it('should initialize as open', () => {
			const menu = createMenu({ open: true });

			expect(menu.state.open).toBe(true);
		});

		it('should initialize with custom config', () => {
			const menu = createMenu({
				open: true,
				closeOnSelect: false,
				loop: false,
			});

			expect(menu.state.open).toBe(true);
			expect(menu.state.closeOnSelect).toBe(false);
			expect(menu.state.loop).toBe(false);
		});
	});

	describe('Open and Close', () => {
		it('should open menu', () => {
			const menu = createMenu();

			menu.helpers.open();

			expect(menu.state.open).toBe(true);
		});

		it('should close menu', () => {
			const menu = createMenu({ open: true });

			menu.helpers.close();

			expect(menu.state.open).toBe(false);
		});

		it('should toggle menu', () => {
			const menu = createMenu();

			menu.helpers.toggle();
			expect(menu.state.open).toBe(true);

			menu.helpers.toggle();
			expect(menu.state.open).toBe(false);
		});

		it('should call onOpenChange when opened', () => {
			const onOpenChange = vi.fn();
			const menu = createMenu({ onOpenChange });

			menu.helpers.open();

			expect(onOpenChange).toHaveBeenCalledWith(true);
		});

		it('should call onOpenChange when closed', () => {
			const onOpenChange = vi.fn();
			const menu = createMenu({ open: true, onOpenChange });

			menu.helpers.close();

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should reset active index when closed', () => {
			const menu = createMenu({ open: true });
			menu.helpers.setActiveIndex(2);

			menu.helpers.close();

			expect(menu.state.activeIndex).toBe(-1);
		});
	});

	describe('Trigger Action', () => {
		let triggerEl: HTMLButtonElement;

		beforeEach(() => {
			triggerEl = document.createElement('button');
			document.body.appendChild(triggerEl);
		});

		afterEach(() => {
			document.body.removeChild(triggerEl);
		});

		it('should toggle menu on trigger click', () => {
			const menu = createMenu();
			const action = menu.actions.trigger(triggerEl);

			triggerEl.click();
			expect(menu.state.open).toBe(true);

			triggerEl.click();
			expect(menu.state.open).toBe(false);

			action.destroy();
		});

		it('should set aria-expanded', () => {
			const menu = createMenu();
			const action = menu.actions.trigger(triggerEl);

			expect(triggerEl.getAttribute('aria-expanded')).toBe('false');

			menu.helpers.open();

			expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

			action.destroy();
		});

		it('should set aria-haspopup', () => {
			const menu = createMenu();
			const action = menu.actions.trigger(triggerEl);

			expect(triggerEl.getAttribute('aria-haspopup')).toBe('true');

			action.destroy();
		});

		it('should open on ArrowDown', () => {
			const menu = createMenu();
			const action = menu.actions.trigger(triggerEl);

			const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
			triggerEl.dispatchEvent(event);

			expect(menu.state.open).toBe(true);

			action.destroy();
		});

		it('should open on ArrowUp', () => {
			const menu = createMenu();
			const action = menu.actions.trigger(triggerEl);

			const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			triggerEl.dispatchEvent(event);

			expect(menu.state.open).toBe(true);

			action.destroy();
		});

		it('should close on Escape', () => {
			const menu = createMenu({ open: true });
			const action = menu.actions.trigger(triggerEl);

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			triggerEl.dispatchEvent(event);

			expect(menu.state.open).toBe(false);

			action.destroy();
		});
	});

	describe('Content Action', () => {
		let contentEl: HTMLDivElement;

		beforeEach(() => {
			contentEl = document.createElement('div');
			document.body.appendChild(contentEl);
		});

		afterEach(() => {
			document.body.removeChild(contentEl);
		});

		it('should set role=menu', () => {
			const menu = createMenu();
			const action = menu.actions.content(contentEl);

			expect(contentEl.getAttribute('role')).toBe('menu');

			action.destroy();
		});

		it('should close on Escape key', () => {
			const menu = createMenu({ open: true });
			const action = menu.actions.content(contentEl);

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			contentEl.dispatchEvent(event);

			expect(menu.state.open).toBe(false);

			action.destroy();
		});

		it('should close on outside click', () => {
			const menu = createMenu({ open: true });
			const action = menu.actions.content(contentEl);

			const outsideEl = document.createElement('div');
			document.body.appendChild(outsideEl);

			outsideEl.click();

			expect(menu.state.open).toBe(false);

			document.body.removeChild(outsideEl);
			action.destroy();
		});

		it('should not close on inside click', () => {
			const menu = createMenu({ open: true, closeOnSelect: false });
			const action = menu.actions.content(contentEl);

			contentEl.click();

			expect(menu.state.open).toBe(true);

			action.destroy();
		});
	});

	describe('Item Action', () => {
		let itemEl: HTMLDivElement;

		beforeEach(() => {
			itemEl = document.createElement('div');
			document.body.appendChild(itemEl);
		});

		afterEach(() => {
			document.body.removeChild(itemEl);
		});

		it('should register menu item', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl);

			expect(menu.state.items).toContain(itemEl);

			action.destroy();
		});

		it('should unregister menu item on destroy', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl);

			expect(menu.state.items).toContain(itemEl);

			action.destroy();

			expect(menu.state.items).not.toContain(itemEl);
		});

		it('should set role=menuitem', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl);

			expect(itemEl.getAttribute('role')).toBe('menuitem');

			action.destroy();
		});

		it('should be keyboard accessible', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl);

			expect(itemEl.tabIndex).toBe(-1);

			action.destroy();
		});

		it('should call onClick when clicked', () => {
			const onClick = vi.fn();
			const menu = createMenu({ open: true });
			const action = menu.actions.item(itemEl, { onClick });

			itemEl.click();

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});

		it('should close menu on click by default', () => {
			const menu = createMenu({ open: true, closeOnSelect: true });
			const action = menu.actions.item(itemEl);

			itemEl.click();

			expect(menu.state.open).toBe(false);

			action.destroy();
		});

		it('should not close menu on click when closeOnSelect is false', () => {
			const menu = createMenu({ open: true, closeOnSelect: false });
			const action = menu.actions.item(itemEl);

			itemEl.click();

			expect(menu.state.open).toBe(true);

			action.destroy();
		});

		it('should not be clickable when disabled', () => {
			const onClick = vi.fn();
			const menu = createMenu({ open: true });
			const action = menu.actions.item(itemEl, { disabled: true, onClick });

			itemEl.click();

			expect(onClick).not.toHaveBeenCalled();
			expect(menu.state.open).toBe(true);

			action.destroy();
		});

		it('should set aria-disabled when disabled', () => {
			const menu = createMenu();
			const action = menu.actions.item(itemEl, { disabled: true });

			expect(itemEl.getAttribute('aria-disabled')).toBe('true');

			action.destroy();
		});

		it('should trigger onClick on Enter key', () => {
			const onClick = vi.fn();
			const menu = createMenu({ open: true });
			const action = menu.actions.item(itemEl, { onClick });

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			itemEl.dispatchEvent(event);

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});

		it('should trigger onClick on Space key', () => {
			const onClick = vi.fn();
			const menu = createMenu({ open: true });
			const action = menu.actions.item(itemEl, { onClick });

			const event = new KeyboardEvent('keydown', { key: ' ' });
			itemEl.dispatchEvent(event);

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});
	});

	describe('Keyboard Navigation', () => {
		let menu: ReturnType<typeof createMenu>;
		let item1: HTMLDivElement;
		let item2: HTMLDivElement;
		let item3: HTMLDivElement;

		beforeEach(() => {
			menu = createMenu({ open: true });
			item1 = document.createElement('div');
			item2 = document.createElement('div');
			item3 = document.createElement('div');
			document.body.appendChild(item1);
			document.body.appendChild(item2);
			document.body.appendChild(item3);

			menu.actions.item(item1);
			menu.actions.item(item2);
			menu.actions.item(item3);
		});

		afterEach(() => {
			document.body.removeChild(item1);
			document.body.removeChild(item2);
			document.body.removeChild(item3);
		});

		it('should navigate down with ArrowDown', () => {
			expect(menu.state.activeIndex).toBe(-1);

			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(0);

			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(1);
		});

		it('should navigate up with ArrowUp', () => {
			menu.helpers.setActiveIndex(2);

			menu.helpers.handleKeyDown({ key: 'ArrowUp' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(1);

			menu.helpers.handleKeyDown({ key: 'ArrowUp' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(0);
		});

		it('should loop to beginning from end', () => {
			menu.helpers.setActiveIndex(2);

			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(0);
		});

		it('should loop to end from beginning', () => {
			menu.helpers.setActiveIndex(0);

			menu.helpers.handleKeyDown({ key: 'ArrowUp' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(2);
		});

	it('should not loop when loop is false', () => {
		const nonLoopMenu = createMenu({ open: true, loop: false });

		nonLoopMenu.actions.item(item1);
		nonLoopMenu.actions.item(item2);
		nonLoopMenu.actions.item(item3);

		nonLoopMenu.helpers.setActiveIndex(2);
		nonLoopMenu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

		expect(nonLoopMenu.state.activeIndex).toBe(2);
	});

		it('should navigate to first item with Home key', () => {
			menu.helpers.setActiveIndex(2);

			menu.helpers.handleKeyDown({ key: 'Home' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(0);
		});

		it('should navigate to last item with End key', () => {
			menu.helpers.setActiveIndex(0);

			menu.helpers.handleKeyDown({ key: 'End' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(2);
		});

		it('should skip disabled items when navigating', () => {
			const item2Action = menu.actions.item(item2, { disabled: true });

			menu.helpers.setActiveIndex(0);
			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(2); // Skip item2

			item2Action.destroy();
		});
	});

	describe('Type-ahead Search', () => {
		let menu: ReturnType<typeof createMenu>;
		let item1: HTMLDivElement;
		let item2: HTMLDivElement;
		let item3: HTMLDivElement;

		beforeEach(() => {
			menu = createMenu({ open: true, typeAhead: true });
			item1 = document.createElement('div');
			item2 = document.createElement('div');
			item3 = document.createElement('div');

			item1.textContent = 'Apple';
			item2.textContent = 'Banana';
			item3.textContent = 'Cherry';

			document.body.appendChild(item1);
			document.body.appendChild(item2);
			document.body.appendChild(item3);

			menu.actions.item(item1);
			menu.actions.item(item2);
			menu.actions.item(item3);
		});

		afterEach(() => {
			document.body.removeChild(item1);
			document.body.removeChild(item2);
			document.body.removeChild(item3);
		});

		it('should navigate to item starting with typed character', () => {
			menu.helpers.handleKeyDown({ key: 'b' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(1); // Banana
		});

		it('should handle multiple characters', () => {
			menu.helpers.handleKeyDown({ key: 'c' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(2); // Cherry
		});

		it('should wrap around when same key pressed multiple times', () => {
			menu.helpers.handleKeyDown({ key: 'a' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(0); // Apple

			menu.helpers.handleKeyDown({ key: 'a' } as KeyboardEvent);
			expect(menu.state.activeIndex).toBe(0); // Still Apple (only one starts with 'a')
		});
	});

	describe('Focus Management', () => {
		let triggerEl: HTMLButtonElement;
		let contentEl: HTMLDivElement;

		beforeEach(() => {
			triggerEl = document.createElement('button');
			contentEl = document.createElement('div');
			document.body.appendChild(triggerEl);
			document.body.appendChild(contentEl);
		});

		afterEach(() => {
			document.body.removeChild(triggerEl);
			document.body.removeChild(contentEl);
		});

		it('should focus first item when menu opens', () => {
			const menu = createMenu();
			const triggerAction = menu.actions.trigger(triggerEl);
			const contentAction = menu.actions.content(contentEl);

			const item = document.createElement('div');
			contentEl.appendChild(item);
			const itemAction = menu.actions.item(item);

			menu.helpers.open();

			expect(document.activeElement).toBe(item);

			itemAction.destroy();
			triggerAction.destroy();
			contentAction.destroy();
		});

		it('should return focus to trigger on close', () => {
			const menu = createMenu({ open: true });
			const triggerAction = menu.actions.trigger(triggerEl);
			const contentAction = menu.actions.content(contentEl);

			triggerEl.focus();
			contentEl.focus();

			menu.helpers.close();

			expect(document.activeElement).toBe(triggerEl);

			triggerAction.destroy();
			contentAction.destroy();
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const menu = createMenu({ onDestroy });
			const triggerEl = document.createElement('button');

			const action = menu.actions.trigger(triggerEl);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should remove all items on destroy', () => {
			const menu = createMenu();
			const item1 = document.createElement('div');
			const item2 = document.createElement('div');

			const action1 = menu.actions.item(item1);
			const action2 = menu.actions.item(item2);

			expect(menu.state.items.length).toBe(2);

			action1.destroy();

			expect(menu.state.items.length).toBe(1);

			action2.destroy();

			expect(menu.state.items.length).toBe(0);
		});
	});

	describe('Edge Cases', () => {
		it('should handle open when already open', () => {
			const menu = createMenu({ open: true });

			menu.helpers.open();

			expect(menu.state.open).toBe(true);
		});

		it('should handle close when already closed', () => {
			const menu = createMenu({ open: false });

			menu.helpers.close();

			expect(menu.state.open).toBe(false);
		});

		it('should handle navigation with no items', () => {
			const menu = createMenu({ open: true });

			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(-1);
		});

		it('should handle rapid open/close', () => {
			const menu = createMenu();

			menu.helpers.toggle();
			menu.helpers.toggle();
			menu.helpers.toggle();

			expect(menu.state.open).toBe(true);
		});

		it('should handle all items disabled', () => {
			const menu = createMenu({ open: true });
			const item1 = document.createElement('div');
			const item2 = document.createElement('div');

			menu.actions.item(item1, { disabled: true });
			menu.actions.item(item2, { disabled: true });

			menu.helpers.handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent);

			expect(menu.state.activeIndex).toBe(-1);
		});
	});

	describe('Accessibility', () => {
		it('should set correct ARIA attributes on trigger', () => {
			const menu = createMenu();
			const triggerEl = document.createElement('button');
			const action = menu.actions.trigger(triggerEl);

			expect(triggerEl.getAttribute('aria-haspopup')).toBe('true');
			expect(triggerEl.getAttribute('aria-expanded')).toBe('false');

			action.destroy();
		});

		it('should set correct ARIA attributes on content', () => {
			const menu = createMenu();
			const contentEl = document.createElement('div');
			const action = menu.actions.content(contentEl);

			expect(contentEl.getAttribute('role')).toBe('menu');

			action.destroy();
		});

		it('should set correct ARIA attributes on items', () => {
			const menu = createMenu();
			const itemEl = document.createElement('div');
			const action = menu.actions.item(itemEl);

			expect(itemEl.getAttribute('role')).toBe('menuitem');
			expect(itemEl.tabIndex).toBe(-1);

			action.destroy();
		});

		it('should indicate active item', () => {
			const menu = createMenu();
			const item1 = document.createElement('div');
			const item2 = document.createElement('div');

			menu.actions.item(item1);
			menu.actions.item(item2);

			menu.helpers.setActiveIndex(0);

			expect(item1.getAttribute('data-active')).toBe('true');
			expect(item2.getAttribute('data-active')).toBe('false');
		});
	});
});

