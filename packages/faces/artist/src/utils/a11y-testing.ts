/**
 * Accessibility Testing Utilities
 *
 * Automated accessibility validation and reporting.
 * Supports WCAG 2.1 AA compliance verification.
 *
 * @module @equaltoai/greater-components-artist/utils/a11y-testing
 */

import { calculateContrastRatio } from './highContrast.js';
import { getFocusableElements } from './accessibility.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Accessibility issue severity
 */
export type A11ySeverity = 'critical' | 'serious' | 'moderate' | 'minor';

/**
 * Accessibility issue
 */
export interface A11yIssue {
	/** Issue ID */
	id: string;
	/** Issue description */
	description: string;
	/** Severity level */
	severity: A11ySeverity;
	/** WCAG criterion */
	wcagCriterion: string;
	/** Affected element selector */
	selector: string;
	/** Affected element */
	element?: HTMLElement;
	/** Suggested fix */
	fix: string;
}

/**
 * Accessibility report
 */
export interface A11yReport {
	/** Report timestamp */
	timestamp: number;
	/** Page URL */
	url: string;
	/** Total issues found */
	totalIssues: number;
	/** Issues by severity */
	bySeverity: Record<A11ySeverity, number>;
	/** All issues */
	issues: A11yIssue[];
	/** Pass/fail status */
	passed: boolean;
}

// ============================================================================
// Color Contrast Checking
// ============================================================================

/**
 * Check color contrast for all text elements
 */
export function checkColorContrast(container: HTMLElement = document.body): A11yIssue[] {
	const issues: A11yIssue[] = [];
	const textElements = container.querySelectorAll<HTMLElement>(
		'p, span, h1, h2, h3, h4, h5, h6, a, button, label, li, td, th'
	);

	textElements.forEach((element, index) => {
		const style = getComputedStyle(element);
		const color = style.color;
		const bgColor = getBackgroundColor(element);

		if (!color || !bgColor) return;

		const ratio = calculateContrastRatio(color, bgColor);
		const fontSize = parseFloat(style.fontSize);
		const fontWeight = parseInt(style.fontWeight, 10);
		const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
		const requiredRatio = isLargeText ? 3 : 4.5;

		if (ratio < requiredRatio) {
			issues.push({
				id: `contrast-${index}`,
				description: `Insufficient color contrast ratio: ${ratio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
				severity: ratio < 3 ? 'critical' : 'serious',
				wcagCriterion: '1.4.3 Contrast (Minimum)',
				selector: getSelector(element),
				element,
				fix: `Increase contrast between text color (${color}) and background (${bgColor}) to at least ${requiredRatio}:1`,
			});
		}
	});

	return issues;
}

/**
 * Get effective background color of an element
 */
function getBackgroundColor(element: HTMLElement): string {
	let current: HTMLElement | null = element;

	while (current) {
		const style = getComputedStyle(current);
		const bgColor = style.backgroundColor;

		// Check if background is not transparent
		if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
			return bgColor;
		}

		current = current.parentElement;
	}

	return 'rgb(255, 255, 255)'; // Default to white
}

// ============================================================================
// ARIA Validation
// ============================================================================

/**
 * Validate ARIA attributes on elements
 */
export function validateAriaAttributes(container: HTMLElement = document.body): A11yIssue[] {
	const issues: A11yIssue[] = [];

	// Check for invalid ARIA roles
	const elementsWithRoles = container.querySelectorAll<HTMLElement>('[role]');
	const validRoles = [
		'alert',
		'alertdialog',
		'application',
		'article',
		'banner',
		'button',
		'cell',
		'checkbox',
		'columnheader',
		'combobox',
		'complementary',
		'contentinfo',
		'definition',
		'dialog',
		'directory',
		'document',
		'feed',
		'figure',
		'form',
		'grid',
		'gridcell',
		'group',
		'heading',
		'img',
		'link',
		'list',
		'listbox',
		'listitem',
		'log',
		'main',
		'marquee',
		'math',
		'menu',
		'menubar',
		'menuitem',
		'menuitemcheckbox',
		'menuitemradio',
		'navigation',
		'none',
		'note',
		'option',
		'presentation',
		'progressbar',
		'radio',
		'radiogroup',
		'region',
		'row',
		'rowgroup',
		'rowheader',
		'scrollbar',
		'search',
		'searchbox',
		'separator',
		'slider',
		'spinbutton',
		'status',
		'switch',
		'tab',
		'table',
		'tablist',
		'tabpanel',
		'term',
		'textbox',
		'timer',
		'toolbar',
		'tooltip',
		'tree',
		'treegrid',
		'treeitem',
	];

	elementsWithRoles.forEach((element, index) => {
		const role = element.getAttribute('role');
		if (role && !validRoles.includes(role)) {
			issues.push({
				id: `aria-role-${index}`,
				description: `Invalid ARIA role: "${role}"`,
				severity: 'serious',
				wcagCriterion: '4.1.2 Name, Role, Value',
				selector: getSelector(element),
				element,
				fix: `Use a valid ARIA role from the WAI-ARIA specification`,
			});
		}
	});

	// Check for missing required ARIA attributes
	const interactiveElements = container.querySelectorAll<HTMLElement>(
		'button, a, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"]'
	);

	interactiveElements.forEach((element, index) => {
		const hasAccessibleName =
			element.hasAttribute('aria-label') ||
			element.hasAttribute('aria-labelledby') ||
			element.textContent?.trim() ||
			(element as HTMLInputElement).value ||
			element.getAttribute('title');

		if (!hasAccessibleName) {
			issues.push({
				id: `aria-name-${index}`,
				description: 'Interactive element missing accessible name',
				severity: 'critical',
				wcagCriterion: '4.1.2 Name, Role, Value',
				selector: getSelector(element),
				element,
				fix: 'Add aria-label, aria-labelledby, or visible text content',
			});
		}
	});

	// Check images for alt text
	const images = container.querySelectorAll<HTMLImageElement>('img');
	images.forEach((img, index) => {
		if (!img.hasAttribute('alt')) {
			issues.push({
				id: `img-alt-${index}`,
				description: 'Image missing alt attribute',
				severity: 'critical',
				wcagCriterion: '1.1.1 Non-text Content',
				selector: getSelector(img),
				element: img,
				fix: 'Add alt attribute with descriptive text, or alt="" for decorative images',
			});
		}
	});

	return issues;
}

// ============================================================================
// Keyboard Accessibility
// ============================================================================

/**
 * Check keyboard accessibility
 */
export function checkKeyboardAccess(container: HTMLElement = document.body): A11yIssue[] {
	const issues: A11yIssue[] = [];

	// Check for elements with click handlers but no keyboard access
	const clickableElements = container.querySelectorAll<HTMLElement>('[onclick], [data-onclick]');

	clickableElements.forEach((element, index) => {
		const tagName = element.tagName.toLowerCase();
		const role = element.getAttribute('role');
		const tabindex = element.getAttribute('tabindex');

		// Skip natively focusable elements
		if (['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
			return;
		}

		// Check if element is focusable
		if (tabindex === null || tabindex === '-1') {
			issues.push({
				id: `keyboard-${index}`,
				description: 'Clickable element not keyboard accessible',
				severity: 'critical',
				wcagCriterion: '2.1.1 Keyboard',
				selector: getSelector(element),
				element,
				fix: 'Add tabindex="0" and keyboard event handlers, or use a native button/link',
			});
		}

		// Check for appropriate role
		if (!role && !['a', 'button'].includes(tagName)) {
			issues.push({
				id: `keyboard-role-${index}`,
				description: 'Clickable element missing role',
				severity: 'serious',
				wcagCriterion: '4.1.2 Name, Role, Value',
				selector: getSelector(element),
				element,
				fix: 'Add role="button" or role="link" as appropriate',
			});
		}
	});

	// Check for focus traps (elements that can't be tabbed out of)
	const focusableElements = getFocusableElements(container);
	if (focusableElements.length > 0) {
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		if (firstFocusable && lastFocusable) {
			// Check if first and last focusable are in logical order
			const firstRect = firstFocusable.getBoundingClientRect();
			const lastRect = lastFocusable.getBoundingClientRect();

			if (lastRect.top < firstRect.top) {
				issues.push({
					id: 'focus-order',
					description: 'Focus order may not match visual order',
					severity: 'moderate',
					wcagCriterion: '2.4.3 Focus Order',
					selector: getSelector(container),
					fix: 'Ensure tab order follows visual reading order',
				});
			}
		}
	}

	return issues;
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Generate comprehensive accessibility report
 */
export function generateA11yReport(container: HTMLElement = document.body): A11yReport {
	const issues: A11yIssue[] = [
		...checkColorContrast(container),
		...validateAriaAttributes(container),
		...checkKeyboardAccess(container),
	];

	const bySeverity: Record<A11ySeverity, number> = {
		critical: 0,
		serious: 0,
		moderate: 0,
		minor: 0,
	};

	issues.forEach((issue) => {
		bySeverity[issue.severity]++;
	});

	// Fail if any critical or serious issues
	const passed = bySeverity.critical === 0 && bySeverity.serious === 0;

	return {
		timestamp: Date.now(),
		url: typeof window !== 'undefined' ? window.location.href : '',
		totalIssues: issues.length,
		bySeverity,
		issues,
		passed,
	};
}

/**
 * Format report as text
 */
export function formatA11yReport(report: A11yReport): string {
	const lines: string[] = [
		'='.repeat(60),
		'ACCESSIBILITY REPORT',
		'='.repeat(60),
		`URL: ${report.url}`,
		`Date: ${new Date(report.timestamp).toISOString()}`,
		`Status: ${report.passed ? 'PASSED' : 'FAILED'}`,
		'',
		'SUMMARY',
		'-'.repeat(30),
		`Total Issues: ${report.totalIssues}`,
		`  Critical: ${report.bySeverity.critical}`,
		`  Serious: ${report.bySeverity.serious}`,
		`  Moderate: ${report.bySeverity.moderate}`,
		`  Minor: ${report.bySeverity.minor}`,
		'',
	];

	if (report.issues.length > 0) {
		lines.push('ISSUES', '-'.repeat(30));

		report.issues.forEach((issue, index) => {
			lines.push(
				``,
				`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`,
				`   WCAG: ${issue.wcagCriterion}`,
				`   Element: ${issue.selector}`,
				`   Fix: ${issue.fix}`
			);
		});
	}

	lines.push('', '='.repeat(60));

	return lines.join('\n');
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get CSS selector for an element
 */
function getSelector(element: HTMLElement): string {
	if (element.id) {
		return `#${element.id}`;
	}

	const path: string[] = [];
	let current: HTMLElement | null = element;

	while (current && current !== document.body) {
		let selector = current.tagName.toLowerCase();

		if (current.className) {
			const classes = current.className.split(' ').filter(Boolean).slice(0, 2);
			if (classes.length > 0) {
				selector += '.' + classes.join('.');
			}
		}

		path.unshift(selector);
		current = current.parentElement;
	}

	return path.join(' > ');
}
