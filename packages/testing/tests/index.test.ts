import { describe, expect, it } from 'vitest';
import {
	DEFAULT_TEST_CONFIG,
	calculateA11yScore,
	createComponentTestSuite,
	meetsA11yThreshold,
} from '../src/index';

describe('@equaltoai/greater-components-testing', () => {
	it('creates component test suite metadata', () => {
		const suite = createComponentTestSuite({
			name: 'Button',
			path: 'Button.svelte',
			variants: ['default'],
			expectedRole: 'button',
			criticalForA11y: true,
		});

		expect(suite.name).toBe('Button');
		expect(suite.tests.axe).toBe('Button.axe.test.ts');
		expect(suite.config.criticalForA11y).toBe(true);
	});

	it('calculates scores and thresholds', () => {
		const score = calculateA11yScore({
			wcagPassed: 9,
			wcagTotal: 10,
			axeViolations: 1,
			axeChecks: 5,
			contrastPassed: 4,
			contrastTotal: 5,
			keyboardPassed: 3,
			keyboardTotal: 3,
			focusPassed: 2,
			focusTotal: 2,
		});

		expect(score).toBeGreaterThan(80);
		expect(meetsA11yThreshold(score, 'basic')).toBe(true);
		expect(meetsA11yThreshold(score, 'strict')).toBe(false);
	});

	it('exposes a default config', () => {
		expect(DEFAULT_TEST_CONFIG.themes).toContain('light');
		expect(DEFAULT_TEST_CONFIG.includeKeyboardTests).toBe(true);
	});
});
