import { describe, expect, it } from 'vitest';
import {
	computeDiff,
	isBinaryContent,
	formatDiffStats,
	hasLocalModifications,
} from '../src/utils/diff.js';

describe('isBinaryContent', () => {
	it('detects null bytes as binary', () => {
		expect(isBinaryContent('hello\0world')).toBe(true);
	});

	it('detects high non-printable ratio as binary', () => {
		const binary = String.fromCharCode(1, 2, 3, 4, 5, 6, 7, 8);
		expect(isBinaryContent(binary)).toBe(true);
	});

	it('identifies text content as non-binary', () => {
		expect(isBinaryContent('Hello, world!\nThis is text.')).toBe(false);
	});

	it('handles empty content', () => {
		expect(isBinaryContent('')).toBe(false);
	});

	it('allows common whitespace characters', () => {
		expect(isBinaryContent('line1\n\tindented\r\nwindows')).toBe(false);
	});
});

describe('computeDiff', () => {
	it('returns identical for same content', () => {
		const content = 'line1\nline2\nline3';
		const result = computeDiff(content, content);

		expect(result.identical).toBe(true);
		expect(result.hunks).toHaveLength(0);
		expect(result.unifiedDiff).toBe('');
	});

	it('detects added lines', () => {
		const local = 'line1\nline2';
		const remote = 'line1\nline2\nline3';
		const result = computeDiff(local, remote);

		expect(result.identical).toBe(false);
		expect(result.stats.additions).toBeGreaterThan(0);
	});

	it('detects removed lines', () => {
		const local = 'line1\nline2\nline3';
		const remote = 'line1\nline2';
		const result = computeDiff(local, remote);

		expect(result.identical).toBe(false);
		expect(result.stats.deletions).toBeGreaterThan(0);
	});

	it('detects modified lines', () => {
		const local = 'line1\nline2\nline3';
		const remote = 'line1\nmodified\nline3';
		const result = computeDiff(local, remote);

		expect(result.identical).toBe(false);
		expect(result.stats.additions).toBeGreaterThan(0);
		expect(result.stats.deletions).toBeGreaterThan(0);
	});

	it('handles empty local content', () => {
		const local = '';
		const remote = 'line1\nline2';
		const result = computeDiff(local, remote);

		expect(result.identical).toBe(false);
		expect(result.stats.additions).toBe(2);
	});

	it('handles empty remote content', () => {
		const local = 'line1\nline2';
		const remote = '';
		const result = computeDiff(local, remote);

		expect(result.identical).toBe(false);
		expect(result.stats.deletions).toBe(2);
	});

	it('generates unified diff format', () => {
		const local = 'line1\nline2';
		const remote = 'line1\nmodified';
		const result = computeDiff(local, remote, { filePath: 'test.ts' });

		expect(result.unifiedDiff).toContain('--- a/test.ts');
		expect(result.unifiedDiff).toContain('+++ b/test.ts');
		expect(result.unifiedDiff).toContain('@@');
	});

	it('includes context lines', () => {
		const local = 'a\nb\nc\nd\ne\nf\ng';
		const remote = 'a\nb\nc\nX\ne\nf\ng';
		const result = computeDiff(local, remote, { contextLines: 2 });

		// Should include context around the change
		expect(result.unifiedDiff).toContain(' b');
		expect(result.unifiedDiff).toContain(' c');
		expect(result.unifiedDiff).toContain('-d');
		expect(result.unifiedDiff).toContain('+X');
		expect(result.unifiedDiff).toContain(' e');
		expect(result.unifiedDiff).toContain(' f');
	});

	it('handles binary content', () => {
		const local = 'hello\0world';
		const remote = 'different\0content';
		const result = computeDiff(local, remote, { filePath: 'binary.bin' });

		expect(result.isBinary).toBe(true);
		expect(result.unifiedDiff).toContain('Binary files');
	});

	it('respects ignoreWhitespace option', () => {
		const local = 'line1  \nline2';
		const remote = 'line1\nline2';

		const withWhitespace = computeDiff(local, remote, { ignoreWhitespace: false });
		const ignoreWhitespace = computeDiff(local, remote, { ignoreWhitespace: true });

		expect(withWhitespace.identical).toBe(false);
		expect(ignoreWhitespace.identical).toBe(true);
	});
});

describe('formatDiffStats', () => {
	it('formats additions only', () => {
		const stats = { additions: 5, deletions: 0, unchanged: 10, totalLines: 15 };
		expect(formatDiffStats(stats)).toBe('+5');
	});

	it('formats deletions only', () => {
		const stats = { additions: 0, deletions: 3, unchanged: 10, totalLines: 10 };
		expect(formatDiffStats(stats)).toBe('-3');
	});

	it('formats both additions and deletions', () => {
		const stats = { additions: 5, deletions: 3, unchanged: 10, totalLines: 15 };
		expect(formatDiffStats(stats)).toBe('+5, -3');
	});

	it('returns no changes for zero diff', () => {
		const stats = { additions: 0, deletions: 0, unchanged: 10, totalLines: 10 };
		expect(formatDiffStats(stats)).toBe('no changes');
	});
});

describe('hasLocalModifications', () => {
	it('returns true for different checksums', () => {
		expect(hasLocalModifications('abc123', 'def456')).toBe(true);
	});

	it('returns false for matching checksums', () => {
		expect(hasLocalModifications('abc123', 'abc123')).toBe(false);
	});
});
