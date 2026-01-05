import { describe, it, expect } from 'vitest';
import { truncateMiddle } from '../src/truncateMiddle';

describe('truncateMiddle', () => {
	it('returns the original string when it is short enough', () => {
		expect(truncateMiddle('abc')).toBe('abc');
	});

	it('truncates long strings with default options', () => {
		expect(truncateMiddle('0x1234567890abcdef')).toBe('0x1234…cdef');
	});

	it('supports custom head, tail, and ellipsis', () => {
		expect(
			truncateMiddle('abcdefghijklmnopqrstuvwxyz', { head: 2, tail: 2, ellipsis: '...' })
		).toBe('ab...yz');
	});

	it('supports head-only and tail-only truncation', () => {
		expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', { head: 0, tail: 4 })).toBe('…wxyz');
		expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', { head: 4, tail: 0 })).toBe('abcd…');
	});

	it('clamps negative head/tail to 0', () => {
		expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', { head: -10, tail: 4 })).toBe('…wxyz');
	});

	it('avoids truncation when it would not shorten the string', () => {
		// head + tail + ellipsis length >= value length
		expect(truncateMiddle('abcdef', { head: 2, tail: 2, ellipsis: '...' })).toBe('abcdef');
	});
});
