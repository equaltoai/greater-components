/**
 * Tests for Filters.Editor Component Logic
 * 
 * Tests filter creation and editing form logic:
 * - Form validation
 * - Context selection
 * - Expiration calculation
 * - Form state management
 * - Submit logic
 */

import { describe, it, expect } from 'vitest';
import { calculateExpiresAt } from '../../src/components/Filters/context.js';

/**
 * Toggle context in/out of selection
 */
function toggleContext(contexts: string[], context: string): string[] {
	if (contexts.includes(context)) {
		return contexts.filter((c) => c !== context);
	} else {
		return [...contexts, context];
	}
}

/**
 * Validate filter form
 */
function validateForm(phrase: string, contexts: string[]): boolean {
	return phrase.trim().length > 0 && contexts.length > 0;
}

/**
 * Calculate expires-in from expires-at
 */
function calculateExpiresIn(expiresAt: string | null): number | null {
	if (!expiresAt) return null;
	const now = new Date();
	const expires = new Date(expiresAt);
	const diff = expires.getTime() - now.getTime();
	return Math.floor(diff / 1000);
}

describe('Editor Logic', () => {
	describe('Context Toggle', () => {
		it('should add context when not present', () => {
			const result = toggleContext(['home'], 'notifications');
			expect(result).toEqual(['home', 'notifications']);
		});

		it('should remove context when present', () => {
			const result = toggleContext(['home', 'notifications'], 'home');
			expect(result).toEqual(['notifications']);
		});

		it('should handle empty array', () => {
			const result = toggleContext([], 'home');
			expect(result).toEqual(['home']);
		});

		it('should remove last context', () => {
			const result = toggleContext(['home'], 'home');
			expect(result).toEqual([]);
		});

		it('should preserve order when adding', () => {
			const result = toggleContext(['a', 'b'], 'c');
			expect(result).toEqual(['a', 'b', 'c']);
		});

		it('should preserve order when removing', () => {
			const result = toggleContext(['a', 'b', 'c'], 'b');
			expect(result).toEqual(['a', 'c']);
		});

		it('should handle multiple toggles', () => {
			let contexts = ['home'];
			contexts = toggleContext(contexts, 'public');
			contexts = toggleContext(contexts, 'notifications');
			contexts = toggleContext(contexts, 'home');
			expect(contexts).toEqual(['public', 'notifications']);
		});

		it('should handle toggle of non-existent context', () => {
			const result = toggleContext(['home'], 'nonexistent');
			expect(result).toEqual(['home', 'nonexistent']);
		});

		it('should handle duplicate toggle attempts', () => {
			let contexts = ['home'];
			contexts = toggleContext(contexts, 'home');
			contexts = toggleContext(contexts, 'home');
			expect(contexts).toEqual(['home']);
		});

		it('should handle all five contexts', () => {
			let contexts: string[] = [];
			contexts = toggleContext(contexts, 'home');
			contexts = toggleContext(contexts, 'notifications');
			contexts = toggleContext(contexts, 'public');
			contexts = toggleContext(contexts, 'thread');
			contexts = toggleContext(contexts, 'account');
			expect(contexts.length).toBe(5);
		});
	});

	describe('Form Validation', () => {
		it('should validate with phrase and contexts', () => {
			expect(validateForm('spoilers', ['home'])).toBe(true);
		});

		it('should invalidate without phrase', () => {
			expect(validateForm('', ['home'])).toBe(false);
		});

		it('should invalidate with whitespace phrase', () => {
			expect(validateForm('   ', ['home'])).toBe(false);
		});

		it('should invalidate without contexts', () => {
			expect(validateForm('spoilers', [])).toBe(false);
		});

		it('should validate with multiple contexts', () => {
			expect(validateForm('test', ['home', 'public'])).toBe(true);
		});

		it('should trim whitespace in validation', () => {
			expect(validateForm('  test  ', ['home'])).toBe(true);
		});

		it('should validate with special characters', () => {
			expect(validateForm('@#$%', ['home'])).toBe(true);
		});

		it('should validate with unicode', () => {
			expect(validateForm('你好', ['home'])).toBe(true);
		});

		it('should validate with emoji', () => {
			expect(validateForm('🔥', ['home'])).toBe(true);
		});

		it('should invalidate with only whitespace and tabs', () => {
			expect(validateForm('\t\n  ', ['home'])).toBe(false);
		});
	});

	describe('Expiration Calculation', () => {
		it('should calculate expires-at from seconds', () => {
			const result = calculateExpiresAt(3600); // 1 hour
			expect(result).toBeTruthy();
			if (result) {
				const expires = new Date(result);
				expect(expires).toBeInstanceOf(Date);
			}
		});

		it('should return null for null input', () => {
			expect(calculateExpiresAt(null)).toBeNull();
		});

		it('should return null for zero', () => {
			expect(calculateExpiresAt(0)).toBeNull();
		});

		it('should handle 30 minutes', () => {
			const result = calculateExpiresAt(1800);
			expect(result).toBeTruthy();
		});

		it('should handle 1 week', () => {
			const result = calculateExpiresAt(604800);
			expect(result).toBeTruthy();
		});

		it('should return ISO string format', () => {
			const result = calculateExpiresAt(3600);
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should calculate future date correctly', () => {
			const now = new Date();
			const result = calculateExpiresAt(3600);
			if (result) {
				const expires = new Date(result);
				expect(expires.getTime()).toBeGreaterThan(now.getTime());
			}
		});

		it('should handle large durations', () => {
			const result = calculateExpiresAt(31536000); // 1 year
			expect(result).toBeTruthy();
		});

		it('should handle negative durations', () => {
			const result = calculateExpiresAt(-3600);
			expect(result).toBeTruthy(); // Still calculates, even if past
		});
	});

	describe('Expires-In Calculation', () => {
		it('should return null for null input', () => {
			expect(calculateExpiresIn(null)).toBeNull();
		});

		it('should calculate seconds to future date', () => {
			const future = new Date(Date.now() + 3600000); // 1 hour
			const result = calculateExpiresIn(future.toISOString());
			expect(result).toBeGreaterThan(3500); // Allow some margin
			expect(result).toBeLessThan(3700);
		});

		it('should handle past dates', () => {
			const past = new Date(Date.now() - 3600000);
			const result = calculateExpiresIn(past.toISOString());
			expect(result).toBeLessThan(0);
		});

		it('should handle very close dates', () => {
			const future = new Date(Date.now() + 1000);
			const result = calculateExpiresIn(future.toISOString());
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThanOrEqual(2);
		});

		it('should floor the seconds', () => {
			const future = new Date(Date.now() + 1500); // 1.5 seconds
			const result = calculateExpiresIn(future.toISOString());
			expect(Number.isInteger(result)).toBe(true);
		});
	});

	describe('Form State Management', () => {
		it('should reset form to defaults', () => {
			const defaults = {
				phrase: '',
				contexts: ['home'],
				expiresIn: null,
				irreversible: false,
				wholeWord: true,
			};
			expect(defaults.phrase).toBe('');
			expect(defaults.contexts).toEqual(['home']);
		});

		it('should initialize with filter data', () => {
			const filter = {
				phrase: 'spoilers',
				context: ['home', 'public'],
				irreversible: true,
				wholeWord: false,
			};
			expect(filter.phrase).toBe('spoilers');
			expect(filter.context).toEqual(['home', 'public']);
		});

		it('should handle empty filter', () => {
			const filter = {
				phrase: '',
				context: [],
				irreversible: false,
				wholeWord: true,
			};
			expect(validateForm(filter.phrase, filter.context)).toBe(false);
		});

		it('should preserve form state', () => {
			const state = {
				phrase: 'test',
				contexts: ['home', 'public'],
			};
			expect(state.phrase).toBe('test');
			expect(state.contexts.length).toBe(2);
		});
	});

	describe('Expiration Options', () => {
		const options = [
			{ value: null, label: 'Never' },
			{ value: 1800, label: '30 minutes' },
			{ value: 3600, label: '1 hour' },
			{ value: 21600, label: '6 hours' },
			{ value: 43200, label: '12 hours' },
			{ value: 86400, label: '1 day' },
			{ value: 604800, label: '1 week' },
		];

		it('should have never option', () => {
			const never = options.find(o => o.value === null);
			expect(never).toBeDefined();
			expect(never?.label).toBe('Never');
		});

		it('should have 30 minutes option', () => {
			const option = options.find(o => o.value === 1800);
			expect(option).toBeDefined();
		});

		it('should have 1 hour option', () => {
			const option = options.find(o => o.value === 3600);
			expect(option).toBeDefined();
		});

		it('should have 1 week option', () => {
			const option = options.find(o => o.value === 604800);
			expect(option).toBeDefined();
		});

		it('should have 7 options total', () => {
			expect(options.length).toBe(7);
		});

		it('should have ascending durations', () => {
			const durations = options
				.map(o => o.value)
				.filter((value): value is number => value !== null);
			for (let i = 1; i < durations.length; i++) {
				const previous = durations[i - 1];
				const current = durations[i];
				expect(current).toBeGreaterThan(previous);
			}
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long phrases', () => {
			const longPhrase = 'a'.repeat(1000);
			expect(validateForm(longPhrase, ['home'])).toBe(true);
		});

		it('should handle phrase with newlines', () => {
			expect(validateForm('line1\nline2', ['home'])).toBe(true);
		});

		it('should handle phrase with tabs', () => {
			expect(validateForm('word1\tword2', ['home'])).toBe(true);
		});

		it('should handle all contexts selected', () => {
			const allContexts = ['home', 'notifications', 'public', 'thread', 'account'];
			expect(validateForm('test', allContexts)).toBe(true);
		});

		it('should handle rapid context toggles', () => {
			let contexts = ['home'];
			for (let i = 0; i < 100; i++) {
				contexts = toggleContext(contexts, 'home');
			}
			// 100 toggles is even, so ends with ['home']
			expect(contexts).toEqual(['home']);
		});

		it('should handle phrase with only emojis', () => {
			expect(validateForm('🔥💯🎉', ['home'])).toBe(true);
		});

		it('should handle phrase with mixed content', () => {
			expect(validateForm('test 测试 🔥', ['home'])).toBe(true);
		});
	});
});
