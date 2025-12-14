import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
	checkColorContrast,
	validateAriaAttributes,
	checkKeyboardAccess,
	generateA11yReport,
	formatA11yReport
} from '../../src/utils/a11y-testing';

describe('a11y-testing Utils', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('checkColorContrast', () => {
		it('detects low contrast text', () => {
			container.innerHTML = `
				<div style="background-color: white">
					<p style="color: #eeeeee">Low Contrast</p>
					<p style="color: black">High Contrast</p>
				</div>
			`;
			
			const issues = checkColorContrast(container);
			expect(issues.length).toBeGreaterThan(0);
			expect(issues[0].description).toContain('Insufficient color contrast');
			expect(issues[0].element?.textContent).toBe('Low Contrast');
		});

		it('passes sufficient contrast', () => {
			container.innerHTML = `
				<div style="background-color: white">
					<p style="color: black">Good Contrast</p>
				</div>
			`;
			const issues = checkColorContrast(container);
			expect(issues).toHaveLength(0);
		});
	});

	describe('validateAriaAttributes', () => {
		it('detects invalid roles', () => {
			container.innerHTML = `<div role="invalid-role">Content</div>`;
			const issues = validateAriaAttributes(container);
			
			expect(issues).toHaveLength(1);
			expect(issues[0].description).toContain('Invalid ARIA role');
		});

		it('detects missing accessible names', () => {
			container.innerHTML = `<button></button>`;
			const issues = validateAriaAttributes(container);
			
			expect(issues).toHaveLength(1);
			expect(issues[0].description).toContain('missing accessible name');
		});

		it('detects missing alt text', () => {
			container.innerHTML = `<img src="test.jpg" />`;
			const issues = validateAriaAttributes(container);
			
			expect(issues).toHaveLength(1);
			expect(issues[0].description).toContain('missing alt attribute');
		});
		
		it('passes valid attributes', () => {
			container.innerHTML = `
				<button aria-label="Submit"></button>
				<img src="test.jpg" alt="Description" />
				<div role="group">Content</div>
			`;
			const issues = validateAriaAttributes(container);
			expect(issues).toHaveLength(0);
		});
	});

	describe('checkKeyboardAccess', () => {
		it('detects clickable non-interactive elements', () => {
			container.innerHTML = `<div onclick="alert(1)">Click me</div>`;
			const issues = checkKeyboardAccess(container);
			
			expect(issues).toHaveLength(2); // No tabindex + No role
			expect(issues.some(i => i.description.includes('not keyboard accessible'))).toBe(true);
			expect(issues.some(i => i.description.includes('missing role'))).toBe(true);
		});

		it('passes valid keyboard access', () => {
			container.innerHTML = `<button onclick="alert(1)">Click me</button>`;
			const issues = checkKeyboardAccess(container);
			expect(issues).toHaveLength(0);
		});
	});

	describe('generateA11yReport', () => {
		it('generates full report', () => {
			container.innerHTML = `<button></button>`; // Error
			const report = generateA11yReport(container);
			
			expect(report.totalIssues).toBeGreaterThan(0);
			expect(report.passed).toBe(false);
			expect(report.issues.length).toBe(report.totalIssues);
		});
		
		it('passes when no issues', () => {
			container.innerHTML = `<div>Plain text</div>`;
			const report = generateA11yReport(container);
			expect(report.passed).toBe(true);
		});
	});

	describe('formatA11yReport', () => {
		it('formats report as string', () => {
			const report = {
				timestamp: Date.now(),
				url: 'http://test.com',
				totalIssues: 1,
				bySeverity: { critical: 1, serious: 0, moderate: 0, minor: 0 },
				issues: [{
					id: '1',
					description: 'Error',
					severity: 'critical' as const,
					wcagCriterion: '1.1.1',
					selector: 'button',
					fix: 'fix it'
				}],
				passed: false
			};
			
			const text = formatA11yReport(report);
			expect(text).toContain('ACCESSIBILITY REPORT');
			expect(text).toContain('FAILED');
			expect(text).toContain('[CRITICAL] Error');
		});
	});
});
