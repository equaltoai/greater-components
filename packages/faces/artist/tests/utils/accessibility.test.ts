import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getFocusableElements,
	createFocusTrap,
	restoreFocus,
	createSkipLink,
	focusFirstInteractive,
	createGridNavigation,
	createRovingTabIndex,
	handleEscapeKey,
	createKeyboardShortcuts,
	announceToScreenReader,
	createAriaDescription,
	galleryAnnouncement,
	stateChangeAnnouncement,
	validateAltText,
	generateAltTextTemplate,
	type FocusTrap,
} from '../../src/utils/accessibility';

describe('accessibility Utils', () => {
	let container: HTMLElement;
	let activeTrap: FocusTrap | undefined;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		activeTrap = undefined;

		// Mock offsetParent for visibility checks - simplified
		Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
			get() {
				return document.body;
			},
			configurable: true,
		});
	});

	afterEach(() => {
		if (activeTrap && activeTrap.isActive()) {
			activeTrap.deactivate();
		}
		document.body.removeChild(container);
		vi.restoreAllMocks();
	});

	describe('getFocusableElements', () => {
		it('returns only focusable elements', () => {
			container.innerHTML = `
				<button>Button</button>
				<a href="#">Link</a>
				<div>Not focusable</div>
				<input type="text" />
				<button disabled>Disabled Button</button>
			`;

			const focusable = getFocusableElements(container);
			const tags = focusable.map((el) => el.tagName).sort();
			expect(tags).toEqual(['A', 'BUTTON', 'INPUT']);
		});

		it('filters out hidden elements', () => {
			container.innerHTML = `
				<button style="visibility: hidden">Hidden</button>
				<button>Visible</button>
			`;
			// Note: offsetParent check often fails in JSDOM unless mocked or specific layout used.
			// But visibility: hidden should be caught by getComputedStyle check in the util.

			const focusable = getFocusableElements(container);
			// In JSDOM, visibility might not be fully computed as expected without layout,
			// but we can test if the filter logic is applied if we mock getComputedStyle or similar if needed.
			// However, standard JSDOM usually handles inline styles for getComputedStyle.
			expect(focusable.length).toBe(1);
			expect(focusable[0]?.textContent).toBe('Visible');
		});
	});

	describe('createFocusTrap', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('activates and traps focus', async () => {
			container.innerHTML = `
				<button id="first" tabindex="0">First</button>
				<button id="last" tabindex="0">Last</button>
			`;
			const first = container.querySelector('#first') as HTMLElement;
			// const last = container.querySelector('#last') as HTMLElement;

			// Spy on focus
			const firstFocusSpy = vi.spyOn(first, 'focus');

			const trap = createFocusTrap({ container });
			activeTrap = trap;

			trap.activate();
			expect(trap.isActive()).toBe(true);

			// Run RAF
			vi.runAllTimers();

			// Should focus first element by default
			expect(firstFocusSpy).toHaveBeenCalled();
		});

		it('deactivates and restores focus', () => {
			const previous = document.createElement('button');
			previous.setAttribute('tabindex', '0');
			document.body.appendChild(previous);

			const focusSpy = vi.spyOn(previous, 'focus');
			// previous.focus();

			// Mock that it was previously focused by setting it manually if we could,
			// but util captures document.activeElement when activate() is called.
			// If activeElement is body, it will restore body.

			// We need to force activeElement to be `previous`.
			// Since focus() fails, we can't easily.
			// But we can verify `trap.deactivate()` calls `returnFocus` if provided.

			const trap = createFocusTrap({ container, returnFocus: previous });
			activeTrap = trap;
			trap.activate();
			trap.deactivate();

			expect(trap.isActive()).toBe(false);
			expect(focusSpy).toHaveBeenCalled();
			document.body.removeChild(previous);
		});

		it('handles Tab key wrapping', () => {
			container.innerHTML = `
				<button id="first">First</button>
				<button id="last">Last</button>
			`;
			const first = container.querySelector('#first') as HTMLElement;
			const last = container.querySelector('#last') as HTMLElement;

			const trap = createFocusTrap({ container });
			activeTrap = trap;
			trap.activate();

			// Mock activeElement as last element
			vi.spyOn(document, 'activeElement', 'get').mockReturnValue(last);

			const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
			const firstFocusSpy = vi.spyOn(first, 'focus');

			document.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(firstFocusSpy).toHaveBeenCalled();
		});

		it('handles Shift+Tab key wrapping', () => {
			container.innerHTML = `
				<button id="first">First</button>
				<button id="last">Last</button>
			`;
			const first = container.querySelector('#first') as HTMLElement;
			const last = container.querySelector('#last') as HTMLElement;

			const trap = createFocusTrap({ container });
			activeTrap = trap;
			trap.activate();

			// Mock activeElement as first element
			vi.spyOn(document, 'activeElement', 'get').mockReturnValue(first);

			const event = new KeyboardEvent('keydown', {
				key: 'Tab',
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			});
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
			const lastFocusSpy = vi.spyOn(last, 'focus');

			document.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(lastFocusSpy).toHaveBeenCalled();
		});

		it('handles empty container', () => {
			container.innerHTML = '';
			const trap = createFocusTrap({ container });
			activeTrap = trap;
			trap.activate();

			const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
			document.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('handles focusin outside container', () => {
			container.innerHTML = '<button>Inside</button>';
			const outside = document.createElement('button');
			document.body.appendChild(outside);

			const inside = container.querySelector('button') as HTMLElement;
			const insideFocusSpy = vi.spyOn(inside, 'focus');

			const trap = createFocusTrap({ container });
			activeTrap = trap;
			trap.activate();

			const event = new FocusEvent('focusin', { bubbles: true });
			Object.defineProperty(event, 'target', { value: outside });

			document.dispatchEvent(event);

			expect(insideFocusSpy).toHaveBeenCalled();
			document.body.removeChild(outside);
		});

		it('handles escape key deactivation', () => {
			const onEscape = vi.fn();
			const trap = createFocusTrap({ container, onEscape });
			activeTrap = trap;
			trap.activate();

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
			document.dispatchEvent(event);

			expect(onEscape).toHaveBeenCalled();
		});

		it('ignores keydown when inactive', () => {
			createFocusTrap({ container });
			// Not activated

			const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
			document.dispatchEvent(event);
			expect(preventDefaultSpy).not.toHaveBeenCalled();
		});
	});

	describe('createSkipLink', () => {
		it('creates link and handles click', () => {
			const target = document.createElement('div');
			target.id = 'main';
			document.body.appendChild(target);

			// Mock scrollIntoView
			target.scrollIntoView = vi.fn();
			const focusSpy = vi.spyOn(target, 'focus');

			const link = createSkipLink({ targetId: 'main', className: 'custom-skip' });
			document.body.appendChild(link);

			expect(link.tagName).toBe('A');
			expect(link.getAttribute('href')).toBe('#main');
			expect(link.className).toBe('custom-skip');

			link.click();

			expect(focusSpy).toHaveBeenCalled();
			expect(target.scrollIntoView).toHaveBeenCalled();

			document.body.removeChild(target);
		});
	});

	describe('focusFirstInteractive', () => {
		it('focuses first interactive element', () => {
			container.innerHTML = `
				<div>Text</div>
				<button>First</button>
			`;
			const button = container.querySelector('button') as HTMLElement;
			const focusSpy = vi.spyOn(button, 'focus');

			const result = focusFirstInteractive(container);
			expect(result).toBe(true);
			expect(focusSpy).toHaveBeenCalled();
		});

		it('returns false if no interactive elements', () => {
			container.innerHTML = `<div>Text</div>`;
			expect(focusFirstInteractive(container)).toBe(false);
		});
	});

	describe('createGridNavigation', () => {
		it('navigates grid with arrow keys', () => {
			container.innerHTML = `
				<button>1</button><button>2</button>
				<button>3</button><button>4</button>
			`;
			const buttons = container.querySelectorAll('button');

			if (!buttons[1] || !buttons[3]) throw new Error('Buttons missing');
			const focusSpy1 = vi.spyOn(buttons[1], 'focus');
			const focusSpy2 = vi.spyOn(buttons[2], 'focus');
			const focusSpy3 = vi.spyOn(buttons[3], 'focus');
			const focusSpy0 = vi.spyOn(buttons[0], 'focus');

			const onSelect = vi.fn();
			const cleanup = createGridNavigation({
				container,
				columns: 2,
				itemSelector: 'button',
				wrap: true,
				onSelect,
			});

			let activeElement = buttons[0];
			vi.spyOn(document, 'activeElement', 'get').mockImplementation(() => activeElement);

			// Right -> 2
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(focusSpy1).toHaveBeenCalled();

			// Update active element to 2 (index 1)
			activeElement = buttons[1];

			// Down -> 4 (index 3)
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			expect(focusSpy3).toHaveBeenCalled();

			// Left wrapping -> 3 (index 2) (from 4/index 3 -> left -> 3/index 2)
			activeElement = buttons[3];
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(focusSpy2).toHaveBeenCalled();

			// Up wrapping (from 3/index 2 -> up -> 1/index 0)
			activeElement = buttons[2];
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
			expect(focusSpy0).toHaveBeenCalled();

			// Home -> 0
			vi.clearAllMocks(); // Clear mocks to verify Home specifically
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
			expect(focusSpy0).toHaveBeenCalled();

			// End -> 3
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
			expect(focusSpy3).toHaveBeenCalledTimes(2);

			// Enter -> Select
			activeElement = buttons[0]; // Reset to 0
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			expect(onSelect).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('createRovingTabIndex', () => {
		it('manages tabindex', () => {
			container.innerHTML = `
				<button>1</button><button>2</button><button>3</button>
			`;
			const buttons = container.querySelectorAll('button');

			if (!buttons[1]) throw new Error('Button 1 missing');
			const focusSpy = vi.spyOn(buttons[1], 'focus');

			const cleanup = createRovingTabIndex({
				container,
				itemSelector: 'button',
				orientation: 'horizontal',
			});

			expect(buttons[0]?.getAttribute('tabindex')).toBe('0');
			expect(buttons[1].getAttribute('tabindex')).toBe('-1');

			// Mock activeElement
			vi.spyOn(document, 'activeElement', 'get').mockReturnValue(buttons[0]);

			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

			expect(buttons[0]?.getAttribute('tabindex')).toBe('-1');
			expect(buttons[1]?.getAttribute('tabindex')).toBe('0');
			expect(focusSpy).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('announceToScreenReader', () => {
		it('updates live region', async () => {
			announceToScreenReader('Hello');

			const region = document.getElementById('gr-live-region');
			expect(region).toBeTruthy();

			// Wait for requestAnimationFrame
			await new Promise((resolve) => requestAnimationFrame(resolve));

			expect(region?.textContent).toBe('Hello');

			// Reuse existing region
			announceToScreenReader('World');
			await new Promise((resolve) => requestAnimationFrame(resolve));
			expect(region?.textContent).toBe('World');
		});
	});

	describe('validateAltText', () => {
		it('validates good alt text', () => {
			const result = validateAltText('A painting of a sunset over the ocean');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('flags redundant phrases', () => {
			const result = validateAltText('Image of a cat');
			expect(result.warnings.some((w) => w.includes('Avoid starting with'))).toBe(true);
		});

		it('flags file names', () => {
			const result = validateAltText('image.jpg');
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('file name'))).toBe(true);
		});

		it('allows empty alt text for decorative images', () => {
			const result = validateAltText('', { isDecorative: true });
			expect(result.valid).toBe(true);
		});

		it('warns on short alt text', () => {
			const result = validateAltText('Cat');
			expect(result.warnings.some((w) => w.includes('too brief'))).toBe(true);
		});

		it('warns on long alt text', () => {
			const longText = 'a'.repeat(126);
			const result = validateAltText(longText);
			expect(result.warnings.some((w) => w.includes('long'))).toBe(true);
		});

		it('suggests long description for complex images', () => {
			const result = validateAltText('Chart', { isComplex: true });
			expect(result.suggestions.some((s) => s.includes('long description'))).toBe(true);
		});

		it('flags placeholder text', () => {
			const result = validateAltText('placeholder');
			expect(result.errors.some((e) => e.includes('placeholder'))).toBe(true);
		});
	});

	describe('generateAltTextTemplate', () => {
		it('generates template from metadata', () => {
			const text = generateAltTextTemplate({
				title: 'Sunset',
				artist: 'Picasso',
				year: 1920,
			});
			expect(text).toBe('"Sunset", by Picasso, (1920)');
		});
	});

	describe('restoreFocus', () => {
		it('safely handles null element', () => {
			expect(() => restoreFocus(null)).not.toThrow();
		});
	});

	describe('createKeyboardShortcuts', () => {
		it('handles shortcuts with modifiers', () => {
			const callback = vi.fn();
			const cleanup = createKeyboardShortcuts([{ key: 's', ctrl: true, callback }]);

			const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
			document.dispatchEvent(event);
			expect(callback).toHaveBeenCalled();

			cleanup();
		});

		it('ignores non-matching shortcuts', () => {
			const callback = vi.fn();
			const cleanup = createKeyboardShortcuts([{ key: 's', ctrl: true, callback }]);

			const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: false });
			document.dispatchEvent(event);
			expect(callback).not.toHaveBeenCalled();

			cleanup();
		});
	});

	describe('handleEscapeKey', () => {
		it('calls callback on escape', () => {
			const callback = vi.fn();
			const cleanup = handleEscapeKey(callback);

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(event);
			expect(callback).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('stateChangeAnnouncement', () => {
		it('formats announcement', () => {
			expect(stateChangeAnnouncement('Saved', 'Collection', 'Private')).toBe(
				'Collection Saved: Private'
			);
		});
	});

	describe('galleryAnnouncement', () => {
		it('formats gallery info', () => {
			expect(galleryAnnouncement(10, 1, 5, 'Main')).toBe('Main gallery, 10 artworks, row 1 of 5');
		});
	});

	describe('createAriaDescription', () => {
		it('adds description and cleans up', () => {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const cleanup = createAriaDescription(element, 'Description');

			expect(element.hasAttribute('aria-describedby')).toBe(true);
			const descId = element.getAttribute('aria-describedby');
			expect(descId).toBeTruthy();
			const descEl = descId ? document.getElementById(descId) : null;
			expect(descEl).toBeTruthy();
			expect(descEl?.textContent).toBe('Description');

			cleanup();
			expect(element.hasAttribute('aria-describedby')).toBe(false);
			expect(descId ? document.getElementById(descId) : null).toBeNull();

			document.body.removeChild(element);
		});
	});
});
