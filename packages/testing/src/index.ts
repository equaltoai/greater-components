/**
 * Greater Components Testing Utilities
 * Comprehensive accessibility, keyboard navigation, and visual regression testing
 */

// Re-export accessibility testing utilities (a11y namespace for clarity)
export * as a11y from './a11y';

// Re-export Playwright utilities (playwright namespace for clarity)
export * as playwright from './playwright';

// Re-export Vitest utilities
export * from './vitest';

// Core testing types and interfaces
export interface TestConfig {
	themes: string[];
	densities: string[];
	viewports: string[];
	a11yStandard: 'A' | 'AA' | 'AAA';
	contrastRatio: 'AA' | 'AAA';
	includeFocusTests: boolean;
	includeKeyboardTests: boolean;
	includeScreenReaderTests: boolean;
	includeVisualRegressionTests: boolean;
}

export const DEFAULT_TEST_CONFIG: TestConfig = {
	themes: ['light', 'dark', 'high-contrast'],
	densities: ['compact', 'comfortable', 'spacious'],
	viewports: ['desktop', 'tablet', 'mobile'],
	a11yStandard: 'AA',
	contrastRatio: 'AA',
	includeFocusTests: true,
	includeKeyboardTests: true,
	includeScreenReaderTests: true,
	includeVisualRegressionTests: true,
};

/**
 * Component test metadata
 */
export interface ComponentTestInfo {
	name: string;
	path: string;
	variants: string[];
	keyboardShortcuts?: Record<string, string>;
	expectedRole?: string;
	expectedStates?: string[];
	focusableElements?: string[];
	criticalForA11y?: boolean;
}

/**
 * Test result aggregation
 */
export interface TestResults {
	component: string;
	timestamp: string;
	passed: boolean;
	a11yScore: number;
	issues: {
		critical: TestIssue[];
		serious: TestIssue[];
		moderate: TestIssue[];
		minor: TestIssue[];
	};
	coverage: {
		wcag: number;
		keyboard: number;
		screenReader: number;
		contrast: number;
		focus: number;
	};
}

export interface TestIssue {
	type: 'accessibility' | 'keyboard' | 'focus' | 'contrast' | 'screen-reader';
	severity: 'critical' | 'serious' | 'moderate' | 'minor';
	description: string;
	element?: string;
	recommendation: string;
	wcagReference?: string;
}

/**
 * Utility functions
 */

/**
 * Create a comprehensive test suite for a component
 */
export function createComponentTestSuite(info: ComponentTestInfo) {
	return {
		name: info.name,
		tests: {
			axe: `${info.name}.axe.test.ts`,
			keyboard: `${info.name}.keyboard.test.ts`,
			focus: `${info.name}.focus.test.ts`,
			contrast: `${info.name}.contrast.test.ts`,
			screenReader: `${info.name}.screen-reader.test.ts`,
			visual: `${info.name}.visual.test.ts`,
		},
		config: {
			criticalForA11y: info.criticalForA11y || false,
			expectedRole: info.expectedRole || 'generic',
			keyboardShortcuts: info.keyboardShortcuts || {},
		},
	};
}

/**
 * Calculate overall accessibility score
 */
export function calculateA11yScore(results: {
	wcagPassed: number;
	wcagTotal: number;
	axeViolations: number;
	axeChecks: number;
	contrastPassed: number;
	contrastTotal: number;
	keyboardPassed: number;
	keyboardTotal: number;
	focusPassed: number;
	focusTotal: number;
}): number {
	const wcagScore = results.wcagTotal > 0 ? (results.wcagPassed / results.wcagTotal) * 100 : 100;
	const axeScore =
		results.axeChecks > 0
			? ((results.axeChecks - results.axeViolations) / results.axeChecks) * 100
			: 100;
	const contrastScore =
		results.contrastTotal > 0 ? (results.contrastPassed / results.contrastTotal) * 100 : 100;
	const keyboardScore =
		results.keyboardTotal > 0 ? (results.keyboardPassed / results.keyboardTotal) * 100 : 100;
	const focusScore =
		results.focusTotal > 0 ? (results.focusPassed / results.focusTotal) * 100 : 100;

	// Weighted average: WCAG (30%), Axe (25%), Contrast (20%), Keyboard (15%), Focus (10%)
	return Math.round(
		wcagScore * 0.3 +
			axeScore * 0.25 +
			contrastScore * 0.2 +
			keyboardScore * 0.15 +
			focusScore * 0.1
	);
}

/**
 * Determine if score meets threshold
 */
export function meetsA11yThreshold(
	score: number,
	threshold: 'strict' | 'moderate' | 'basic' = 'moderate'
): boolean {
	const thresholds = {
		strict: 95, // AAA compliance
		moderate: 85, // AA compliance
		basic: 70, // A compliance with some AA
	};

	return score >= thresholds[threshold];
}

/**
 * Generate test recommendations
 */
export function generateTestRecommendations(issues: TestIssue[]): string[] {
	const recommendations: string[] = [];
	const issueTypes = new Map<string, number>();

	issues.forEach((issue) => {
		issueTypes.set(issue.type, (issueTypes.get(issue.type) || 0) + 1);
	});

	// Sort by frequency
	const sortedTypes = Array.from(issueTypes.entries()).sort(([, a], [, b]) => b - a);

	sortedTypes.forEach(([type, count]) => {
		switch (type) {
			case 'accessibility':
				recommendations.push(
					`Address ${count} accessibility violations using axe-core recommendations`
				);
				break;
			case 'contrast':
				recommendations.push(
					`Improve color contrast for ${count} elements to meet WCAG requirements`
				);
				break;
			case 'keyboard':
				recommendations.push(
					`Fix ${count} keyboard navigation issues - ensure all interactive elements are keyboard accessible`
				);
				break;
			case 'focus':
				recommendations.push(
					`Resolve ${count} focus management issues - improve focus indicators and tab order`
				);
				break;
			case 'screen-reader':
				recommendations.push(
					`Enhance screen reader compatibility for ${count} elements with proper ARIA labels and roles`
				);
				break;
		}
	});

	return recommendations;
}
