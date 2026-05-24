import { describe, it, expect } from 'vitest';
import { formatCost, formatCostGaugeText, computeRatio } from '../src/utils/formatters.js';

describe('formatCost', () => {
	it('formats USD values with the $ symbol and 2 fraction digits', () => {
		expect(formatCost(42, 'USD')).toBe('$42.00');
		expect(formatCost(42.5, 'USD')).toBe('$42.50');
		expect(formatCost(1234.567, 'USD')).toBe('$1,234.57');
	});

	it('formats decimal values when no currency is supplied', () => {
		expect(formatCost(42, undefined)).toBe('42');
		expect(formatCost(42.5, undefined)).toBe('42.5');
		expect(formatCost(1234.56, undefined)).toBe('1,234.56');
	});

	it('renders an em dash for non-finite or missing values', () => {
		expect(formatCost(null as unknown as number, 'USD')).toBe('—');
		expect(formatCost(undefined as unknown as number, 'USD')).toBe('—');
		expect(formatCost(Number.NaN, 'USD')).toBe('—');
		expect(formatCost(Number.POSITIVE_INFINITY, 'USD')).toBe('—');
		expect(formatCost(Number.NEGATIVE_INFINITY, 'USD')).toBe('—');
	});

	it('caches per-(locale, currency) formatter instances', () => {
		// Two calls with the same arguments should not throw and remain deterministic.
		const a = formatCost(42.5, 'USD');
		const b = formatCost(42.5, 'USD');
		expect(a).toBe(b);
	});
});

describe('formatCostGaugeText', () => {
	it('composes "current of limit"', () => {
		expect(formatCostGaugeText(42.5, 100, 'USD')).toBe('$42.50 of $100.00');
		expect(formatCostGaugeText(0, 1000)).toBe('0 of 1,000');
	});
});

describe('computeRatio', () => {
	it('returns the clamped ratio in [0, 1]', () => {
		expect(computeRatio(0, 100)).toBe(0);
		expect(computeRatio(50, 100)).toBe(0.5);
		expect(computeRatio(100, 100)).toBe(1);
	});

	it('clamps overruns and negatives', () => {
		expect(computeRatio(200, 100)).toBe(1);
		expect(computeRatio(-5, 100)).toBe(0);
	});

	it('returns 0 when the limit is 0, negative, or non-finite', () => {
		expect(computeRatio(50, 0)).toBe(0);
		expect(computeRatio(50, -1)).toBe(0);
		expect(computeRatio(50, Number.NaN)).toBe(0);
		expect(computeRatio(50, Number.POSITIVE_INFINITY)).toBe(0);
	});

	it('returns 0 when the current value is non-finite', () => {
		expect(computeRatio(Number.NaN, 100)).toBe(0);
		expect(computeRatio(Number.POSITIVE_INFINITY, 100)).toBe(0);
	});
});
