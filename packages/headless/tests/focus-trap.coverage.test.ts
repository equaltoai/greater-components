import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createFocusTrap, getFocusableElements } from '../src/behaviors/focus-trap';

describe('Focus Trap Coverage', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		vi.useFakeTimers();
		// Mock offsetParent for JSDOM
		Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
			configurable: true,
			get() {
				// Simulate null offsetParent for hidden/fixed elements if needed
				// But code has: if (el.offsetParent === null && el.style.position !== 'fixed') { return false }
				// So if offsetParent is null, it checks position fixed.
				// If position is NOT fixed, it returns false (hidden).
				// If position IS fixed, it continues (visible).

				// Let's rely on individual tests to mock this property on specific elements if needed
				// or assume JSDOM default (null if not connected? no JSDOM is simple)
				// JSDOM usually returns null for offsetParent.
				// So we need to ensure it returns something for visible elements.
				return this.parentNode;
			},
		});
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('getFocusableElements Edge Cases', () => {
		it('should handle fixed position elements with null offsetParent', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="fixed">Fixed</button>
					<button id="normal">Normal</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const fixed = document.getElementById('fixed') as HTMLElement;
			const normal = document.getElementById('normal') as HTMLElement;

			// Mock offsetParent to be null for 'fixed' element (as happens in browsers)
			Object.defineProperty(fixed, 'offsetParent', { value: null });
			fixed.style.position = 'fixed';

			// Normal element has offsetParent
			Object.defineProperty(normal, 'offsetParent', { value: container });

			const focusable = getFocusableElements(container);
			// Should include fixed element because position is fixed
			expect(focusable).toContain(fixed);
			expect(focusable).toContain(normal);
		});

		it('should exclude elements with null offsetParent and not fixed position', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="hidden">Hidden</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const hidden = document.getElementById('hidden') as HTMLElement;

			Object.defineProperty(hidden, 'offsetParent', { value: null });
			// position is not fixed by default

			const focusable = getFocusableElements(container);
			expect(focusable).not.toContain(hidden);
		});
	});

	describe('Initial Focus Resolution', () => {
		it('should resolve initial focus from string selector', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="btn1">Button 1</button>
					<button id="btn2">Button 2</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const btn2 = document.getElementById('btn2') as HTMLElement;

			const trap = createFocusTrap({ initialFocus: '#btn2' });
			trap.activate(container);

			vi.runAllTimers();
			expect(document.activeElement).toBe(btn2);
			trap.destroy();
		});

		it('should resolve initial focus from function', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="btn1">Button 1</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const btn1 = document.getElementById('btn1') as HTMLElement;

			const trap = createFocusTrap({ initialFocus: () => btn1 });
			trap.activate(container);

			vi.runAllTimers();
			expect(document.activeElement).toBe(btn1);
			trap.destroy();
		});

		it('should fallback to first focusable if autoFocus is true', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="btn1">Button 1</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const btn1 = document.getElementById('btn1') as HTMLElement;

			const trap = createFocusTrap({ autoFocus: true });
			trap.activate(container);

			vi.runAllTimers();
			expect(document.activeElement).toBe(btn1);
			trap.destroy();
		});

		it('should not focus anything if autoFocus is false and no initialFocus', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="btn1">Button 1</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;

			const trap = createFocusTrap({ autoFocus: false });
			trap.activate(container);

			vi.runAllTimers();
			expect(document.activeElement).not.toBe(document.getElementById('btn1'));
			trap.destroy();
		});
	});

	describe('Return Focus Logic', () => {
		it('should return focus to element returned by function', () => {
			const outsideBtn = document.createElement('button');
			document.body.appendChild(outsideBtn);

			const container = document.createElement('div');
			container.innerHTML = '<button>Inside</button>';
			document.body.appendChild(container);

			const trap = createFocusTrap({
				returnFocusTo: () => outsideBtn,
			});
			trap.activate(container);
			trap.deactivate();

			expect(document.activeElement).toBe(outsideBtn);
			trap.destroy();
		});

		it('should return focus to explicit element', () => {
			const outsideBtn = document.createElement('button');
			document.body.appendChild(outsideBtn);

			const container = document.createElement('div');
			container.innerHTML = '<button>Inside</button>';
			document.body.appendChild(container);

			const trap = createFocusTrap({
				returnFocusTo: outsideBtn,
			});
			trap.activate(container);
			trap.deactivate();

			expect(document.activeElement).toBe(outsideBtn);
			trap.destroy();
		});

		it('should not return focus if returnFocus is false', () => {
			const outsideBtn = document.createElement('button');
			document.body.appendChild(outsideBtn);
			outsideBtn.focus();

			const container = document.createElement('div');
			container.innerHTML = '<button>Inside</button>';
			document.body.appendChild(container);

			const trap = createFocusTrap({ returnFocus: false });
			trap.activate(container);

			// Focus inside
			const insideBtn = container.querySelector('button') as HTMLElement;
			insideBtn.focus();

			trap.deactivate();

			expect(document.activeElement).toBe(insideBtn);
			trap.destroy();
		});
	});

	describe('Configuration Updates', () => {
		it('should update configuration', () => {
			const trap = createFocusTrap({ autoFocus: false });

			// Initial check not easy without spying, but let's check update
			trap.updateConfig({ autoFocus: true });

			// Now activate should autofocus
			document.body.innerHTML = '<div id="container"><button id="btn">Btn</button></div>';
			const container = document.getElementById('container') as HTMLElement;
			const btn = document.getElementById('btn') as HTMLElement;

			trap.activate(container);
			vi.runAllTimers();

			expect(document.activeElement).toBe(btn);
			trap.destroy();
		});
	});

	describe('Event Handling', () => {
		it('should handle Shift+Tab wrapping (first to last)', () => {
			document.body.innerHTML = `
				<div id="container">
					<button id="first">First</button>
					<button id="last">Last</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const first = document.getElementById('first') as HTMLElement;
			const last = document.getElementById('last') as HTMLElement;

			const trap = createFocusTrap();
			trap.activate(container);

			// Focus first
			first.focus();

			// Shift+Tab
			const event = new KeyboardEvent('keydown', {
				key: 'Tab',
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			});
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

			// We need to simulate the keydown on the document
			document.dispatchEvent(event);

			// Should prevent default and verify last element would be focused
			// Note: real focus won't change in JSDOM automatically from event dispatch
			// But the trap code calls .focus()

			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(document.activeElement).toBe(last);

			trap.destroy();
		});

		it('should handle focus escape (bringing focus back)', () => {
			document.body.innerHTML = `
				<button id="outside">Outside</button>
				<div id="container">
					<button id="inside">Inside</button>
				</div>
			`;
			const container = document.getElementById('container') as HTMLElement;
			const outside = document.getElementById('outside') as HTMLElement;
			const inside = document.getElementById('inside') as HTMLElement;

			const onFocusEscape = vi.fn();
			const trap = createFocusTrap({ onFocusEscape });
			trap.activate(container);

			// Focus moves outside (simulate focusin on outside element)
			// The trap listens to 'focusin' on document
			const event = new FocusEvent('focusin', {
				bubbles: true,
				cancelable: true,
			});
			// We dispatch on outside element
			outside.dispatchEvent(event);

			expect(onFocusEscape).toHaveBeenCalled();
			expect(document.activeElement).toBe(inside); // Should be brought back

			trap.destroy();
		});
	});
});
