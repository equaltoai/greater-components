/**
 * Keyboard Navigation Testing Helpers
 * Utilities for testing keyboard accessibility and navigation patterns
 */

export interface KeyboardNavigationTest {
	element: string | HTMLElement;
	keys: string[];
	expectedFocus?: string | HTMLElement;
	expectedAction?: () => boolean;
	description: string;
}

export interface KeyboardTestResult {
	passed: boolean;
	description: string;
	error?: string;
	focusPath: string[];
}

/**
 * Common keyboard navigation patterns
 */
export const KeyboardPatterns = {
	TAB_NAVIGATION: ['Tab', 'Shift+Tab'],
	ARROW_NAVIGATION: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
	MENU_NAVIGATION: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'],
	DIALOG_NAVIGATION: ['Tab', 'Shift+Tab', 'Escape'],
	GRID_NAVIGATION: [
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'Home',
		'End',
		'PageUp',
		'PageDown',
	],
	LISTBOX_NAVIGATION: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'],
	TABS_NAVIGATION: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
	TREE_NAVIGATION: [
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'Enter',
		'Space',
		'Home',
		'End',
	],
} as const;

/**
 * Keyboard shortcuts for common actions
 */
export const KeyboardShortcuts = {
	SUBMIT: 'Enter',
	CANCEL: 'Escape',
	SELECT: 'Space',
	DELETE: 'Delete',
	COPY: 'Control+C',
	PASTE: 'Control+V',
	CUT: 'Control+X',
	UNDO: 'Control+Z',
	REDO: 'Control+Y',
	SELECT_ALL: 'Control+A',
	SEARCH: 'Control+F',
} as const;

/**
 * Test keyboard navigation sequence
 */
export async function testKeyboardNavigation(
	tests: KeyboardNavigationTest[]
): Promise<KeyboardTestResult[]> {
	const results: KeyboardTestResult[] = [];
	const focusPath: string[] = [];

	for (const test of tests) {
		try {
			const element =
				typeof test.element === 'string' ? document.querySelector(test.element) : test.element;

			if (!element) {
				results.push({
					passed: false,
					description: test.description,
					error: `Element not found: ${test.element}`,
					focusPath: [...focusPath],
				});
				continue;
			}

			// Focus the element
			if (element instanceof HTMLElement) {
				element.focus();
				focusPath.push(element.tagName + (element.id ? `#${element.id}` : ''));
			}

			// Simulate key presses
			for (const key of test.keys) {
				await simulateKeyPress(element as HTMLElement, key);
			}

			// Check expected focus
			if (test.expectedFocus) {
				const expectedElement =
					typeof test.expectedFocus === 'string'
						? document.querySelector(test.expectedFocus)
						: test.expectedFocus;

				const hasFocus = document.activeElement === expectedElement;

				results.push({
					passed: hasFocus,
					description: test.description,
					error: hasFocus ? undefined : 'Focus not on expected element',
					focusPath: [...focusPath],
				});
			}

			// Check expected action
			if (test.expectedAction) {
				const actionResult = test.expectedAction();
				results.push({
					passed: actionResult,
					description: test.description,
					error: actionResult ? undefined : 'Expected action did not occur',
					focusPath: [...focusPath],
				});
			}
		} catch (error) {
			results.push({
				passed: false,
				description: test.description,
				error: error instanceof Error ? error.message : 'Unknown error',
				focusPath: [...focusPath],
			});
		}
	}

	return results;
}

/**
 * Simulate keyboard event
 */
export async function simulateKeyPress(element: HTMLElement, key: string): Promise<void> {
	const parts = key.split('+');
	const modifiers = {
		ctrlKey: parts.includes('Control'),
		shiftKey: parts.includes('Shift'),
		altKey: parts.includes('Alt'),
		metaKey: parts.includes('Meta'),
	};
	const keyName = parts[parts.length - 1];

	if (!keyName) {
		throw new Error('Invalid keyboard shortcut: no key name found');
	}

	const event = new KeyboardEvent('keydown', {
		key: keyName,
		code: getKeyCode(keyName),
		bubbles: true,
		cancelable: true,
		...modifiers,
	});

	element.dispatchEvent(event);

	// Also dispatch keyup for completeness
	const keyUpEvent = new KeyboardEvent('keyup', {
		key: keyName,
		code: getKeyCode(keyName),
		bubbles: true,
		cancelable: true,
		...modifiers,
	});

	element.dispatchEvent(keyUpEvent);

	// Wait for any async operations
	await new Promise((resolve) => setTimeout(resolve, 50));
}

/**
 * Get key code from key name
 */
function getKeyCode(key: string): string {
	const keyCodes: Record<string, string> = {
		Enter: 'Enter',
		Escape: 'Escape',
		Space: 'Space',
		Tab: 'Tab',
		ArrowUp: 'ArrowUp',
		ArrowDown: 'ArrowDown',
		ArrowLeft: 'ArrowLeft',
		ArrowRight: 'ArrowRight',
		Home: 'Home',
		End: 'End',
		PageUp: 'PageUp',
		PageDown: 'PageDown',
		Delete: 'Delete',
		Backspace: 'Backspace',
	};

	return keyCodes[key] || `Key${key.toUpperCase()}`;
}

/**
 * Test tab order
 */
export function testTabOrder(expectedOrder: string[]): boolean {
	const actualOrder: string[] = [];
	const tabbableElements = document.querySelectorAll(
		'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);

	tabbableElements.forEach((element) => {
		const selector =
			element.tagName.toLowerCase() +
			(element.id ? `#${element.id}` : '') +
			(element.className ? `.${element.className.split(' ')[0]}` : '');
		actualOrder.push(selector);
	});

	return JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
	// Check if element is naturally focusable
	const naturallyFocusable = [
		'a[href]',
		'button',
		'input',
		'select',
		'textarea',
		'iframe',
		'object',
		'embed',
	];

	const isNaturallyFocusable = naturallyFocusable.some((selector) => element.matches(selector));

	// Check tabindex
	const tabindex = element.getAttribute('tabindex');
	const hasValidTabindex = tabindex !== null && tabindex !== '-1';

	// Check if element is not disabled
	const isNotDisabled = !element.hasAttribute('disabled');

	// Check if element is visible
	const isVisible = element.offsetParent !== null;

	return (isNaturallyFocusable || hasValidTabindex) && isNotDisabled && isVisible;
}

/**
 * Get all keyboard accessible elements
 */
export function getKeyboardAccessibleElements(): HTMLElement[] {
	const selector = [
		'a[href]',
		'button:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])',
	].join(', ');

	return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
		(el) => el.offsetParent !== null
	);
}

/**
 * Test keyboard trap (for modals, dropdowns, etc.)
 */
export function testKeyboardTrap(container: HTMLElement): boolean {
	const focusableElements = container.querySelectorAll<HTMLElement>(
		'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);

	if (focusableElements.length === 0) return false;

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	if (!firstElement || !lastElement) return false;

	// Simulate Tab from last element
	(lastElement as HTMLElement).focus();
	simulateKeyPress(lastElement as HTMLElement, 'Tab');

	// Check if focus wraps to first element
	return document.activeElement === firstElement;
}
