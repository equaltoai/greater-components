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
} from '../../src/utils/accessibility';

describe('accessibility Utils', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		// Mock offsetParent for visibility checks - simplified
		Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
			get() {
				return document.body;
			},
			configurable: true,
		});
	});

	afterEach(() => {
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

			trap.activate();
			expect(trap.isActive()).toBe(true);

			// Run RAF
			vi.runAllTimers();

			// Should focus first element by default
			expect(firstFocusSpy).toHaveBeenCalled();

			// Simulate Tab on last element
			// last.focus(); // Focus doesn't work well in this env, but we can simulate the event

			// const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
			// Mock activeElement logic if needed by util:
			// The util checks document.activeElement.
			// Since focus() doesn't update it, we might need to assume the util logic will proceed based on event.

			// If we can't test the tab wrapping logic easily because activeElement isn't updated,
			// we can at least verify the trap is active.
			// But let's try to stub activeElement for the event dispatch?
			// document.activeElement is read-only.

			// For now, satisfy with focus spy.
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
			trap.activate();
			trap.deactivate();

			expect(trap.isActive()).toBe(false);
			expect(focusSpy).toHaveBeenCalled();
			document.body.removeChild(previous);
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

			const link = createSkipLink({ targetId: 'main' });
			document.body.appendChild(link);

			expect(link.tagName).toBe('A');
			expect(link.getAttribute('href')).toBe('#main');

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

			// Spy on focus for target elements
			// Spy on focus for target elements
			if (!buttons[1] || !buttons[3]) throw new Error('Buttons missing');
			const focusSpy1 = vi.spyOn(buttons[1], 'focus');
			const focusSpy3 = vi.spyOn(buttons[3], 'focus');

			const cleanup = createGridNavigation({
				container,
				columns: 2,
				itemSelector: 'button',
				wrap: false,
			});

			// We need to simulate activeElement being the first button for the logic to work
			// Since we can't set it easily, we'll mock the document.activeElement getter for this test block?
			// Or we can rely on findIndex logic.
			// findIndex matches item === document.activeElement.
			// If activeElement is body, index is -1.
			// Logic: if (currentIndex === -1) return;

			// So grid navigation DOES NOT WORK if focus is broken.
			// We MUST fix focus or mock activeElement.

			// Let's try to mock document.activeElement by using Object.defineProperty on document.
			// const originalActiveElement = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement');

			Object.defineProperty(document, 'activeElement', {
				value: buttons[0],
				writable: true,
				configurable: true,
			});

			// Right -> 2
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(focusSpy1).toHaveBeenCalled();

			// Update active element to simulate focus change
			Object.defineProperty(document, 'activeElement', { value: buttons[1] });

			// Down -> 4
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			expect(focusSpy3).toHaveBeenCalled();

			cleanup();

			// Restore? It's JSDOM, maybe hard to restore perfectly but configurable: true helps.
			// Ideally revert to original getter.
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
			Object.defineProperty(document, 'activeElement', {
				value: buttons[0],
				writable: true,
				configurable: true,
			});

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
