import { beforeEach, describe, expect, it } from 'vitest';
import { ensureId, generateId, resetIdCounter } from '../src/utils/id';

beforeEach(() => {
	resetIdCounter();
});

describe('utils/id', () => {
	it('generates incrementing ids with custom prefixes', () => {
		expect(generateId()).toBe('greater-1');
		expect(generateId('custom')).toBe('custom-2');
	});

	it('applies an id to elements that are missing one', () => {
		const el = document.createElement('div');
		expect(el.id).toBe('');

		const first = ensureId(el, 'menu');
		const second = ensureId(el, 'menu');

		expect(first).toBe(second);
		expect(first).toMatch(/^menu-\d+$/);
	});
});
