/**
 * Vitest Accessibility Matchers
 * Custom matchers for testing accessibility in Vitest
 */

import { expect } from 'vitest';
import {
	validateARIA,
	hasAccessibleName,
	getAccessibleName,
	checkSemanticHTML,
} from '../a11y/aria-helpers';
import { testElementContrast, WCAG_CONTRAST } from '../a11y/contrast-helpers';
import { isElementFocusable, isElementTabbable } from '../a11y/focus-helpers';

/**
 * Check if element has accessible name
 */
function toHaveAccessibleName(element: HTMLElement, expectedName?: string) {
	const hasName = hasAccessibleName(element);

	if (!hasName) {
		return {
			pass: false,
			message: () => `Expected element to have accessible name, but it doesn't`,
		};
	}

	if (expectedName) {
		const actualName = getAccessibleName(element);
		const matches = actualName === expectedName;

		return {
			pass: matches,
			message: () =>
				matches
					? `Expected element not to have accessible name "${expectedName}"`
					: `Expected element to have accessible name "${expectedName}", but got "${actualName}"`,
		};
	}

	return {
		pass: true,
		message: () => `Expected element not to have accessible name`,
	};
}

/**
 * Check if element has specific role
 */
function toHaveRole(element: HTMLElement, expectedRole: string) {
	const actualRole = element.getAttribute('role') || element.tagName.toLowerCase();
	const matches = actualRole === expectedRole;

	return {
		pass: matches,
		message: () =>
			matches
				? `Expected element not to have role "${expectedRole}"`
				: `Expected element to have role "${expectedRole}", but got "${actualRole}"`,
	};
}

/**
 * Check if element passes basic accessibility tests
 */
function toBeAccessible(element: HTMLElement) {
	const ariaValidation = validateARIA(element);
	const semanticCheck = checkSemanticHTML(element);

	const isAccessible = ariaValidation.valid && semanticCheck.valid;
	const issues = [...ariaValidation.errors, ...semanticCheck.issues];

	return {
		pass: isAccessible,
		message: () =>
			isAccessible
				? 'Expected element to have accessibility issues'
				: `Element has accessibility issues:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`,
	};
}

/**
 * Check if element has sufficient color contrast
 */
function toHaveContrastRatio(element: HTMLElement, expectedRatio: number) {
	const result = testElementContrast(element);
	const meetsRatio = result.ratio >= expectedRatio;

	return {
		pass: meetsRatio,
		message: () =>
			meetsRatio
				? `Expected element contrast ratio ${result.ratio.toFixed(2)} to be less than ${expectedRatio}`
				: `Expected element contrast ratio ${result.ratio.toFixed(2)} to be at least ${expectedRatio}`,
	};
}

/**
 * Check if element passes WCAG color contrast requirements
 */
function toPassWCAGColorContrast(element: HTMLElement, level: 'AA' | 'AAA' = 'AA') {
	const result = testElementContrast(element);
	const passes = level === 'AA' ? result.passesAA : result.passesAAA;
	const requiredRatio =
		level === 'AA'
			? result.isLargeText
				? WCAG_CONTRAST.AA.large
				: WCAG_CONTRAST.AA.normal
			: result.isLargeText
				? WCAG_CONTRAST.AAA.large
				: WCAG_CONTRAST.AAA.normal;

	return {
		pass: passes,
		message: () =>
			passes
				? `Expected element not to pass WCAG ${level} contrast requirements`
				: `Expected element to pass WCAG ${level} contrast requirements. ` +
					`Current ratio: ${result.ratio.toFixed(2)}, Required: ${requiredRatio}`,
	};
}

/**
 * Check if element is focusable
 */
function toBeFocusable(element: HTMLElement) {
	const focusable = isElementFocusable(element);

	return {
		pass: focusable,
		message: () =>
			focusable ? 'Expected element not to be focusable' : 'Expected element to be focusable',
	};
}

/**
 * Check if element is tabbable
 */
function toBeTabbable(element: HTMLElement) {
	const tabbable = isElementTabbable(element);

	return {
		pass: tabbable,
		message: () =>
			tabbable ? 'Expected element not to be tabbable' : 'Expected element to be tabbable',
	};
}

/**
 * Check if element has valid ARIA attributes
 */
function toHaveValidAria(element: HTMLElement) {
	const validation = validateARIA(element);

	return {
		pass: validation.valid,
		message: () =>
			validation.valid
				? 'Expected element to have invalid ARIA attributes'
				: `Element has invalid ARIA attributes:\n${validation.errors.map((error) => `  - ${error}`).join('\n')}`,
	};
}

/**
 * Check if element has visible focus indicator
 */
function toHaveFocusIndicator(element: HTMLElement) {
	// Focus the element to check for focus indicator
	element.focus();

	const styles = window.getComputedStyle(element);
	const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
	const hasBoxShadow = styles.boxShadow !== 'none';
	const hasFocusVisible = element.matches(':focus-visible');

	const hasFocusIndicator = hasOutline || hasBoxShadow || hasFocusVisible;

	return {
		pass: hasFocusIndicator,
		message: () =>
			hasFocusIndicator
				? 'Expected element not to have focus indicator'
				: 'Expected element to have visible focus indicator (outline, box-shadow, or :focus-visible)',
	};
}

/**
 * Check if element uses semantic HTML
 */
function toBeSemanticHTML(element: HTMLElement) {
	const semanticCheck = checkSemanticHTML(element);

	return {
		pass: semanticCheck.valid,
		message: () =>
			semanticCheck.valid
				? 'Expected element to have semantic HTML issues'
				: `Element has semantic HTML issues:\n${semanticCheck.issues.map((issue) => `  - ${issue}`).join('\n')}`,
	};
}

/**
 * Extend Vitest expect with accessibility matchers
 */
expect.extend({
	toHaveAccessibleName,
	toHaveRole,
	toBeAccessible,
	toHaveContrastRatio,
	toPassWCAGColorContrast,
	toBeFocusable,
	toBeTabbable,
	toHaveValidAria,
	toHaveFocusIndicator,
	toBeSemanticHTML,
});

/**
 * Helper function to get element by test id
 */
export function getByTestId(container: HTMLElement, testId: string): HTMLElement {
	const element = container.querySelector(`[data-testid="${testId}"]`) as HTMLElement;
	if (!element) {
		throw new Error(`Unable to find element with data-testid="${testId}"`);
	}
	return element;
}

/**
 * Helper function to get all elements by role
 */
export function getAllByRole(container: HTMLElement, role: string): HTMLElement[] {
	return Array.from(container.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
}

/**
 * Helper function to get element by accessible name
 */
export function getByAccessibleName(container: HTMLElement, name: string): HTMLElement | null {
	const elements = container.querySelectorAll('*');

	for (const element of elements) {
		const el = element as HTMLElement;
		const accessibleName = getAccessibleName(el);
		if (accessibleName === name) {
			return el;
		}
	}

	return null;
}

/**
 * Create accessibility test helpers
 */
export function createA11yTestHelpers(container: HTMLElement) {
	return {
		getByTestId: (testId: string) => getByTestId(container, testId),
		getAllByRole: (role: string) => getAllByRole(container, role),
		getByAccessibleName: (name: string) => getByAccessibleName(container, name),

		// Accessibility-specific queries
		getFocusableElements: () => {
			return Array.from(
				container.querySelectorAll(
					'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
			).filter((el) => {
				const element = el as HTMLElement;
				return element.offsetParent !== null && !element.hasAttribute('disabled');
			}) as HTMLElement[];
		},

		getElementsWithRole: (role: string) => {
			return Array.from(container.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
		},

		getElementsWithAriaLabel: () => {
			return Array.from(container.querySelectorAll('[aria-label]')) as HTMLElement[];
		},

		getFormElementsWithoutLabels: () => {
			return Array.from(container.querySelectorAll('input, select, textarea')).filter((el) => {
				const element = el as HTMLElement;
				return !hasAccessibleName(element);
			}) as HTMLElement[];
		},

		getImagesWithoutAlt: () => {
			return Array.from(container.querySelectorAll('img:not([alt])')) as HTMLElement[];
		},
	};
}

/**
 * Batch accessibility tests
 */
export function runA11yTests(
	container: HTMLElement,
	options: {
		skipContrastCheck?: boolean;
		skipFocusCheck?: boolean;
		skipAriaCheck?: boolean;
		skipSemanticCheck?: boolean;
	} = {}
): {
	passed: boolean;
	issues: string[];
} {
	const issues: string[] = [];

	const helpers = createA11yTestHelpers(container);

	// Check for images without alt text
	if (!options.skipSemanticCheck) {
		const imagesWithoutAlt = helpers.getImagesWithoutAlt();
		if (imagesWithoutAlt.length > 0) {
			issues.push(`${imagesWithoutAlt.length} images without alt text`);
		}

		// Check for form elements without labels
		const formElementsWithoutLabels = helpers.getFormElementsWithoutLabels();
		if (formElementsWithoutLabels.length > 0) {
			issues.push(`${formElementsWithoutLabels.length} form elements without labels`);
		}
	}

	// Check ARIA validity
	if (!options.skipAriaCheck) {
		const elementsWithAria = container.querySelectorAll(
			'[role], [aria-label], [aria-labelledby], [aria-describedby]'
		);
		elementsWithAria.forEach((el) => {
			const validation = validateARIA(el as HTMLElement);
			if (!validation.valid) {
				issues.push(`Invalid ARIA: ${validation.errors.join(', ')}`);
			}
		});
	}

	// Check focus management
	if (!options.skipFocusCheck) {
		const focusableElements = helpers.getFocusableElements();
		focusableElements.forEach((el) => {
			if (!isElementFocusable(el)) {
				issues.push(`Element appears focusable but isn't: ${el.tagName}`);
			}
		});
	}

	// Check color contrast
	if (!options.skipContrastCheck) {
		const textElements = container.querySelectorAll(
			'p, span, div, h1, h2, h3, h4, h5, h6, a, button, label'
		);
		textElements.forEach((el) => {
			const element = el as HTMLElement;
			if (element.textContent?.trim()) {
				const result = testElementContrast(element);
				if (!result.passesAA) {
					issues.push(`Poor color contrast (${result.ratio.toFixed(2)}): ${element.tagName}`);
				}
			}
		});
	}

	return {
		passed: issues.length === 0,
		issues,
	};
}
