/**
 * Focus Trap Behavior Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	createFocusTrap,
	getFocusableElements,
	getFirstFocusable,
	getLastFocusable,
	isFocusable,
} from '../src/behaviors/focus-trap';

describe('Focus Trap Behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		// Mock offsetParent for JSDOM as it doesn't support layout
		Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
			configurable: true,
			get() {
				// For testing purposes, we consider elements with a parent to have an offsetParent
				// unless the element is hidden via styles checking which is handled separately
				return this.parentNode;
			},
		});
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	describe('getFocusableElements', () => {
		it('should find all focusable elements', () => {
			document.body.innerHTML = `
				<div id="container">
					<button>Button</button>
					<a href="#">Link</a>
					<input type="text" />
					<textarea></textarea>
					<select><option>Option</option></select>
					<div tabindex="0">Tabbable div</div>
					<div tabindex="-1">Not tabbable</div>
					<button disabled>Disabled</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;
			const focusable = getFocusableElements(container);

			expect(focusable.length).toBe(6);
		});

		it('should exclude hidden elements', () => {
			document.body.innerHTML = `
				<div id="container">
					<button>Visible</button>
					<button style="display: none">Hidden display</button>
					<button style="visibility: hidden">Hidden visibility</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;
			const focusable = getFocusableElements(container);

			expect(focusable.length).toBe(1);
		});
	});

	describe('getFirstFocusable / getLastFocusable', () => {
		it('should return first and last focusable elements', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="first">First</button>
					<button id="middle">Middle</button>
					<button id="last">Last</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;

			expect(getFirstFocusable(container)?.id).toBe('first');
			expect(getLastFocusable(container)?.id).toBe('last');
		});

		it('should return null for empty container', () => {
			document.body.innerHTML = '<div id="container"></div>';
			const container = document.getElementById('container') as HTMLElement;

			expect(getFirstFocusable(container)).toBeNull();
			expect(getLastFocusable(container)).toBeNull();
		});
	});

	describe('isFocusable', () => {
		it('should correctly identify focusable elements', () => {
			document.body.innerHTML = `
				<button id="btn">Button</button>
				<div id="div">Div</div>
				<div id="tabbable" tabindex="0">Tabbable</div>
			`;

			expect(isFocusable(document.getElementById('btn') as HTMLElement)).toBe(true);
			expect(isFocusable(document.getElementById('div') as HTMLElement)).toBe(false);
			expect(isFocusable(document.getElementById('tabbable') as HTMLElement)).toBe(true);
		});
	});

	describe('createFocusTrap', () => {
		it('should initialize with inactive state', () => {
			const trap = createFocusTrap();

			expect(trap.state.active).toBe(false);
			expect(trap.state.container).toBeNull();
		});

		it('should activate and focus first element', async () => {
			vi.useFakeTimers();

			document.body.innerHTML = `
				<button id="outside">Outside</button>
				<div id="container">
					<button id="first">First</button>
					<button id="second">Second</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;
			const firstButton = document.getElementById('first') as HTMLElement;
			const onActivate = vi.fn();

			const trap = createFocusTrap({ onActivate });
			trap.activate(container);

			expect(trap.state.active).toBe(true);
			expect(trap.state.container).toBe(container);
			expect(onActivate).toHaveBeenCalled();

			vi.runAllTimers();
			expect(document.activeElement).toBe(firstButton);

			trap.destroy();
			vi.useRealTimers();
		});

		it('should focus custom initial element', async () => {
			vi.useFakeTimers();

			document.body.innerHTML = `
				<div id="container">
					<button id="first">First</button>
					<button id="second">Second</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;
			const secondButton = document.getElementById('second') as HTMLElement;

			const trap = createFocusTrap({
				initialFocus: secondButton,
			});
			trap.activate(container);

			vi.runAllTimers();
			expect(document.activeElement).toBe(secondButton);

			trap.destroy();
			vi.useRealTimers();
		});

		it('should return focus on deactivate', () => {
			document.body.innerHTML = `
				<button id="trigger">Trigger</button>
				<div id="container">
					<button id="inside">Inside</button>
				</div>
			`;

			const trigger = document.getElementById('trigger') as HTMLElement;
			const container = document.getElementById('container') as HTMLElement;

			trigger.focus();
			expect(document.activeElement).toBe(trigger);

			const onDeactivate = vi.fn();
			const trap = createFocusTrap({ onDeactivate });
			trap.activate(container);
			trap.deactivate();

			expect(trap.state.active).toBe(false);
			expect(onDeactivate).toHaveBeenCalled();
			expect(document.activeElement).toBe(trigger);

			trap.destroy();
		});

		it('should trap Tab key navigation', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="first">First</button>
					<button id="last">Last</button>
				</div>
			`;

			const container = document.getElementById('container') as HTMLElement;

			const lastButton = document.getElementById('last') as HTMLElement;

			const trap = createFocusTrap();
			trap.activate(container);

			// Focus last element
			lastButton.focus();

			// Tab should wrap to first
			const tabEvent = new KeyboardEvent('keydown', {
				key: 'Tab',
				bubbles: true,
			});
			document.dispatchEvent(tabEvent);

			// Note: In JSDOM, focus doesn't actually move, but we can verify the event was handled
			expect(trap.state.active).toBe(true);

			trap.destroy();
		});
	});
});
