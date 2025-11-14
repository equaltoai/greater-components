/**
 * WCAG Compliance Testing Helpers
 * Utilities for testing WCAG 2.1 Level A, AA, and AAA compliance
 */

export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type WCAGVersion = '2.0' | '2.1' | '2.2';

export interface WCAGCriterion {
	id: string;
	level: WCAGLevel;
	title: string;
	description: string;
	techniques?: string[];
	failures?: string[];
}

export interface WCAGTestResult {
	criterion: WCAGCriterion;
	passed: boolean;
	errors: string[];
	warnings: string[];
	elements?: HTMLElement[];
}

export interface WCAGComplianceReport {
	level: WCAGLevel;
	version: WCAGVersion;
	passed: boolean;
	results: WCAGTestResult[];
	summary: {
		total: number;
		passed: number;
		failed: number;
		warnings: number;
	};
}

/**
 * WCAG 2.1 Success Criteria
 */
export const WCAG21_CRITERIA: WCAGCriterion[] = [
	// Level A
	{
		id: '1.1.1',
		level: 'A',
		title: 'Non-text Content',
		description: 'All non-text content has a text alternative',
		techniques: ['H37', 'H36', 'H35', 'H2', 'H30'],
	},
	{
		id: '1.3.1',
		level: 'A',
		title: 'Info and Relationships',
		description: 'Information, structure, and relationships are programmatically determined',
		techniques: ['ARIA11', 'ARIA12', 'ARIA13', 'ARIA16', 'ARIA17'],
	},
	{
		id: '1.4.1',
		level: 'A',
		title: 'Use of Color',
		description: 'Color is not used as the only visual means of conveying information',
	},
	{
		id: '2.1.1',
		level: 'A',
		title: 'Keyboard',
		description: 'All functionality is available from a keyboard',
		techniques: ['G202', 'SCR20', 'SCR35'],
	},
	{
		id: '2.1.2',
		level: 'A',
		title: 'No Keyboard Trap',
		description: 'Keyboard focus can be moved away from any component',
	},
	{
		id: '2.4.1',
		level: 'A',
		title: 'Bypass Blocks',
		description: 'A mechanism is available to bypass blocks of content',
		techniques: ['G1', 'G123', 'G124'],
	},
	{
		id: '2.4.2',
		level: 'A',
		title: 'Page Titled',
		description: 'Web pages have titles that describe topic or purpose',
	},
	{
		id: '2.4.3',
		level: 'A',
		title: 'Focus Order',
		description: 'Components receive focus in a logical order',
		techniques: ['G59', 'G57', 'C27'],
	},
	{
		id: '3.1.1',
		level: 'A',
		title: 'Language of Page',
		description: 'Default human language can be programmatically determined',
	},
	{
		id: '4.1.1',
		level: 'A',
		title: 'Parsing',
		description: 'Elements have complete start and end tags, are nested correctly',
	},
	{
		id: '4.1.2',
		level: 'A',
		title: 'Name, Role, Value',
		description: 'Name and role can be programmatically determined for all UI components',
		techniques: ['ARIA14', 'ARIA16'],
	},

	// Level AA
	{
		id: '1.4.3',
		level: 'AA',
		title: 'Contrast (Minimum)',
		description: 'Text has a contrast ratio of at least 4.5:1',
		techniques: ['G18', 'G145'],
	},
	{
		id: '1.4.4',
		level: 'AA',
		title: 'Resize Text',
		description: 'Text can be resized up to 200% without loss of functionality',
		techniques: ['C28', 'C29', 'C30'],
	},
	{
		id: '1.4.5',
		level: 'AA',
		title: 'Images of Text',
		description: 'Text is used instead of images of text',
	},
	{
		id: '2.4.5',
		level: 'AA',
		title: 'Multiple Ways',
		description: 'More than one way is available to locate a page',
	},
	{
		id: '2.4.6',
		level: 'AA',
		title: 'Headings and Labels',
		description: 'Headings and labels describe topic or purpose',
	},
	{
		id: '2.4.7',
		level: 'AA',
		title: 'Focus Visible',
		description: 'Keyboard focus indicator is visible',
		techniques: ['G149', 'G165', 'G195'],
	},
	{
		id: '3.1.2',
		level: 'AA',
		title: 'Language of Parts',
		description: 'Language of each passage can be programmatically determined',
	},

	// Level AAA
	{
		id: '1.4.6',
		level: 'AAA',
		title: 'Contrast (Enhanced)',
		description: 'Text has a contrast ratio of at least 7:1',
	},
	{
		id: '2.1.3',
		level: 'AAA',
		title: 'Keyboard (No Exception)',
		description: 'All functionality is available from a keyboard without exceptions',
	},
	{
		id: '2.2.3',
		level: 'AAA',
		title: 'No Timing',
		description: 'Timing is not an essential part of functionality',
	},
	{
		id: '2.4.8',
		level: 'AAA',
		title: 'Location',
		description: 'Information about location within a set of pages is available',
	},
];

/**
 * Test for specific WCAG criterion
 */
export function testWCAGCriterion(
	criterion: WCAGCriterion,
	container: HTMLElement = document.body
): WCAGTestResult {
	const errors: string[] = [];
	const warnings: string[] = [];
	const elements: HTMLElement[] = [];

	switch (criterion.id) {
		case '1.1.1': // Non-text Content
			container.querySelectorAll('img').forEach((img) => {
				if (!img.hasAttribute('alt')) {
					errors.push(`Image missing alt attribute: ${img.src}`);
					elements.push(img as HTMLElement);
				}
			});

			container.querySelectorAll('svg[role="img"]').forEach((svg) => {
				if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
					errors.push('SVG with role="img" missing accessible name');
					elements.push(svg as HTMLElement);
				}
			});
			break;

		case '1.3.1': {
			// Info and Relationships
			// Check heading hierarchy
			const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
			let lastLevel = 0;
			headings.forEach((heading) => {
				const levelStr = heading.tagName[1];
				if (!levelStr) return;
				const level = parseInt(levelStr, 10);
				if (lastLevel > 0 && level - lastLevel > 1) {
					warnings.push(`Heading hierarchy skipped from h${lastLevel} to h${level}`);
					elements.push(heading as HTMLElement);
				}
				lastLevel = level;
			});

			// Check form labels
			container.querySelectorAll('input, select, textarea').forEach((input) => {
				const element = input as HTMLElement;
				if (
					!element.hasAttribute('aria-label') &&
					!element.hasAttribute('aria-labelledby') &&
					!element.id
				) {
					errors.push(`Form element missing label: ${element.tagName}`);
					elements.push(element);
				}
			});
			break;
		}

		case '2.1.1': // Keyboard
			container.querySelectorAll('[onclick]').forEach((element) => {
				const el = element as HTMLElement;
				if (
					!el.hasAttribute('tabindex') &&
					!['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
				) {
					errors.push('Clickable element not keyboard accessible');
					elements.push(el);
				}
			});
			break;

		case '2.4.3': {
			// Focus Order
			const focusableElements = container.querySelectorAll(
				'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			focusableElements.forEach((element) => {
				const tabindex = element.getAttribute('tabindex');
				if (tabindex && parseInt(tabindex, 10) > 0) {
					warnings.push('Positive tabindex found - may affect focus order');
					elements.push(element as HTMLElement);
				}
			});
			break;
		}

		case '2.4.7': {
			// Focus Visible
			const interactiveElements = container.querySelectorAll(
				'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			interactiveElements.forEach((element) => {
				const el = element as HTMLElement;
				el.focus();
				const styles = window.getComputedStyle(el);

				if (styles.outline === 'none' && !el.matches(':focus-visible')) {
					warnings.push('Element may not have visible focus indicator');
					elements.push(el);
				}
			});
			break;
		}

		case '4.1.2': // Name, Role, Value
			container.querySelectorAll('[role]').forEach((element) => {
				const role = element.getAttribute('role');
				if (role && !isValidARIARole(role)) {
					errors.push(`Invalid ARIA role: ${role}`);
					elements.push(element as HTMLElement);
				}
			});
			break;
	}

	return {
		criterion,
		passed: errors.length === 0,
		errors,
		warnings,
		elements,
	};
}

/**
 * Check if ARIA role is valid
 */
function isValidARIARole(role: string): boolean {
	const validRoles = [
		'alert',
		'alertdialog',
		'application',
		'article',
		'banner',
		'button',
		'checkbox',
		'complementary',
		'contentinfo',
		'dialog',
		'directory',
		'document',
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
		'menu',
		'menubar',
		'menuitem',
		'menuitemcheckbox',
		'menuitemradio',
		'navigation',
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
		'separator',
		'slider',
		'spinbutton',
		'status',
		'tab',
		'tablist',
		'tabpanel',
		'textbox',
		'timer',
		'toolbar',
		'tooltip',
		'tree',
		'treegrid',
		'treeitem',
	];

	return validRoles.includes(role);
}

/**
 * Test WCAG compliance at a specific level
 */
export function testWCAGCompliance(
	level: WCAGLevel = 'AA',
	version: WCAGVersion = '2.1',
	container: HTMLElement = document.body
): WCAGComplianceReport {
	const criteria = WCAG21_CRITERIA.filter((c) => {
		if (level === 'A') return c.level === 'A';
		if (level === 'AA') return c.level === 'A' || c.level === 'AA';
		return true; // AAA includes all levels
	});

	const results = criteria.map((criterion) => testWCAGCriterion(criterion, container));

	const passed = results.filter((r) => r.passed).length;
	const failed = results.filter((r) => !r.passed).length;
	const warnings = results.reduce((acc, r) => acc + r.warnings.length, 0);

	return {
		level,
		version,
		passed: failed === 0,
		results,
		summary: {
			total: criteria.length,
			passed,
			failed,
			warnings,
		},
	};
}

/**
 * Generate WCAG compliance summary
 */
export function generateWCAGSummary(report: WCAGComplianceReport): string {
	const { summary, level, version } = report;

	let output = `WCAG ${version} Level ${level} Compliance Report\n`;
	output += '='.repeat(40) + '\n\n';
	output += `Overall Status: ${report.passed ? 'PASS' : 'FAIL'}\n`;
	output += `Criteria Tested: ${summary.total}\n`;
	output += `Passed: ${summary.passed}\n`;
	output += `Failed: ${summary.failed}\n`;
	output += `Warnings: ${summary.warnings}\n\n`;

	if (summary.failed > 0) {
		output += 'Failed Criteria:\n';
		output += '-'.repeat(20) + '\n';

		report.results
			.filter((r) => !r.passed)
			.forEach((result) => {
				output += `\n${result.criterion.id}: ${result.criterion.title}\n`;
				result.errors.forEach((error) => {
					output += `  ✗ ${error}\n`;
				});
			});
	}

	if (summary.warnings > 0) {
		output += '\nWarnings:\n';
		output += '-'.repeat(20) + '\n';

		report.results
			.filter((r) => r.warnings.length > 0)
			.forEach((result) => {
				output += `\n${result.criterion.id}: ${result.criterion.title}\n`;
				result.warnings.forEach((warning) => {
					output += `  ⚠ ${warning}\n`;
				});
			});
	}

	return output;
}
