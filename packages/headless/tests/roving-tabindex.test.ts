/**
 * Roving Tabindex Behavior Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRovingTabindex } from '../src/behaviors/roving-tabindex';

describe('Roving Tabindex Behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function createItems(count: number): HTMLButtonElement[] {
		const items: HTMLButtonElement[] = [];
		for (let i = 0; i < count; i++) {
			const button = document.createElement('button');
			button.textContent = `Item ${i + 1}`;
			document.body.appendChild(button);
			items.push(button);
		}
		return items;
	}

	describe('Initialization', () => {
		it('should initialize with default config', () => {
			const roving = createRovingTabindex();

			expect(roving.state.focusedIndex).toBe(0);
			expect(roving.state.items).toEqual([]);
			expect(roving.state.active).toBe(true);
		});

		it('should respect custom initial index', () => {
			const roving = createRovingTabindex({ initialIndex: 2 });

			expect(roving.state.focusedIndex).toBe(2);
		});
	});

	describe('Item Registration', () => {
		it('should register items and update tabindex', () => {
			const items = createItems(3);
			const roving = createRovingTabindex();

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			expect(roving.state.items.length).toBe(3);
			expect(items[0].tabIndex).toBe(0);
			expect(items[1].tabIndex).toBe(-1);
			expect(items[2].tabIndex).toBe(-1);
		});

		it('should unregister items', () => {
			const items = createItems(3);
			const roving = createRovingTabindex();

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.unregisterItem(items[1]);

			expect(roving.state.items.length).toBe(2);
		});
	});

	describe('Navigation', () => {
		it('should navigate with focusNext/focusPrevious', () => {
			const items = createItems(3);
			const onFocusChange = vi.fn();
			const roving = createRovingTabindex({ onFocusChange });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(1);
			expect(onFocusChange).toHaveBeenCalledWith(1, items[1]);

			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(2);

			roving.focusPrevious();
			expect(roving.state.focusedIndex).toBe(1);
		});

		it('should loop navigation when enabled', () => {
			const items = createItems(3);
			const roving = createRovingTabindex({ loop: true });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.setFocusedIndex(2);
			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(0);

			roving.focusPrevious();
			expect(roving.state.focusedIndex).toBe(2);
		});

		it('should not loop when disabled', () => {
			const items = createItems(3);
			const roving = createRovingTabindex({ loop: false });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.setFocusedIndex(2);
			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(2);

			roving.setFocusedIndex(0);
			roving.focusPrevious();
			expect(roving.state.focusedIndex).toBe(0);
		});

		it('should navigate to first/last', () => {
			const items = createItems(5);
			const roving = createRovingTabindex();

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.setFocusedIndex(2);

			roving.focusFirst();
			expect(roving.state.focusedIndex).toBe(0);

			roving.focusLast();
			expect(roving.state.focusedIndex).toBe(4);
		});
	});

	describe('Disabled Items', () => {
		it('should skip disabled items', () => {
			const items = createItems(3);
			items[1].setAttribute('disabled', '');

			const roving = createRovingTabindex();

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(2);
		});

		it('should use custom isDisabled function', () => {
			const items = createItems(3);
			items[1].setAttribute('data-disabled', 'true');

			const roving = createRovingTabindex({
				isDisabled: (el) => el.hasAttribute('data-disabled'),
			});

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.focusNext();
			expect(roving.state.focusedIndex).toBe(2);
		});
	});

	describe('Keyboard Handling', () => {
		it('should handle arrow keys for vertical orientation', () => {
			const items = createItems(3);
			const roving = createRovingTabindex({ orientation: 'vertical' });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
			roving.handleKeyDown(downEvent);
			expect(roving.state.focusedIndex).toBe(1);

			const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			roving.handleKeyDown(upEvent);
			expect(roving.state.focusedIndex).toBe(0);
		});

		it('should handle arrow keys for horizontal orientation', () => {
			const items = createItems(3);
			const roving = createRovingTabindex({ orientation: 'horizontal' });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			roving.handleKeyDown(rightEvent);
			expect(roving.state.focusedIndex).toBe(1);

			const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			roving.handleKeyDown(leftEvent);
			expect(roving.state.focusedIndex).toBe(0);
		});

		it('should handle Home/End keys', () => {
			const items = createItems(5);
			const roving = createRovingTabindex({ homeEndKeys: true });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.setFocusedIndex(2, false);

			const endEvent = new KeyboardEvent('keydown', { key: 'End' });
			roving.handleKeyDown(endEvent);
			expect(roving.state.focusedIndex).toBe(4);

			const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
			roving.handleKeyDown(homeEvent);
			expect(roving.state.focusedIndex).toBe(0);
		});

		it('should call onActivate for Enter/Space', () => {
			const items = createItems(3);
			const onActivate = vi.fn();
			const roving = createRovingTabindex({ onActivate });

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			roving.handleKeyDown(enterEvent);
			expect(onActivate).toHaveBeenCalledWith(0, items[0]);

			const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
			roving.handleKeyDown(spaceEvent);
			expect(onActivate).toHaveBeenCalledTimes(2);
		});
	});

	describe('Cleanup', () => {
		it('should destroy properly', () => {
			const items = createItems(3);
			const roving = createRovingTabindex();

			items.forEach((item, index) => {
				roving.registerItem(item, index);
			});

			roving.destroy();

			expect(roving.state.active).toBe(false);
			expect(roving.state.items).toEqual([]);
		});
	});
});
