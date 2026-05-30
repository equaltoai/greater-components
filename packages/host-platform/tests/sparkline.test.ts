import { describe, it, expect } from 'vitest';
import { buildSparklinePath } from '../src/utils/sparkline.js';

const MAX_EXPECTED_SPARKLINE_POINTS = 1000;

function countPathPoints(path: string): number {
	return (path.match(/[ML]/g) ?? []).length;
}

describe('buildSparklinePath', () => {
	it('returns an empty path on an empty series', () => {
		const result = buildSparklinePath({ data: [], width: 100, height: 28 });
		expect(result.path).toBe('');
		expect(result.last.x).toBe(0);
		expect(result.last.y).toBe(14);
	});

	it('produces a deterministic path for a known series', () => {
		const result = buildSparklinePath({
			data: [0, 1, 0, 1, 0],
			width: 100,
			height: 28,
			padding: 2,
		});
		// Same input → same output. Snapshot is captured here so any
		// arithmetic regression is detected immediately.
		expect(result.path).toBe('M2 26 L26 2 L50 26 L74 2 L98 26');
	});

	it('centers a constant series vertically', () => {
		const result = buildSparklinePath({
			data: [5, 5, 5, 5],
			width: 100,
			height: 30,
		});
		// All Ys equal — and they should equal the centerline given the
		// 1-unit synthetic range we apply for constant inputs.
		const ys = result.path
			.split(/[ML]/)
			.map((s) => s.trim().split(/\s+/)[1])
			.filter(Boolean)
			.map(Number);
		expect(new Set(ys).size).toBe(1);
	});

	it('respects explicit min / max overrides', () => {
		const a = buildSparklinePath({ data: [10, 20, 30], width: 100, height: 30 });
		const b = buildSparklinePath({
			data: [10, 20, 30],
			width: 100,
			height: 30,
			min: 0,
			max: 100,
		});
		// Same data + same dimensions but a wider explicit range should
		// produce a flatter (smaller-amplitude) line.
		expect(a.path).not.toBe(b.path);
	});

	it('reports the last point inside the path', () => {
		const result = buildSparklinePath({ data: [1, 2, 3, 4], width: 100, height: 28 });
		// The "last" point should be at x = width - padding.
		expect(result.last.x).toBeCloseTo(99);
	});

	it('handles a single sample by anchoring it at the start', () => {
		const result = buildSparklinePath({ data: [5], width: 100, height: 28 });
		expect(result.path).toMatch(/^M\d/);
	});

	it('skips non-finite samples instead of emitting invalid SVG coordinates', () => {
		const result = buildSparklinePath({
			data: [1, Number.NaN, 2, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 3],
			width: 100,
			height: 28,
		});

		expect(result.path).toMatch(/^M/);
		expect(result.path).not.toMatch(/NaN|Infinity/);
		expect(countPathPoints(result.path)).toBe(3);
		expect(result.range).toEqual({ min: 1, max: 3 });
	});

	it('returns a no-op path when every sample is non-finite', () => {
		const result = buildSparklinePath({
			data: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
			width: 100,
			height: 28,
		});

		expect(result.path).toBe('');
		expect(result.last).toEqual({ x: 0, y: 14 });
		expect(result.range).toEqual({ min: 0, max: 0 });
	});

	it('bounds output for a 500k-sample untrusted series containing non-finite values', () => {
		const data = Array.from({ length: 500_000 }, (_, i) => {
			if (i % 100_003 === 0) return Number.NaN;
			if (i % 131_071 === 0) return Number.POSITIVE_INFINITY;
			if (i % 262_147 === 0) return Number.NEGATIVE_INFINITY;
			return Math.sin(i / 50) * 20 + (i % 97);
		});

		const result = buildSparklinePath({ data, width: 100, height: 28 });

		expect(result.path).toMatch(/^M/);
		expect(result.path).not.toMatch(/NaN|Infinity/);
		expect(countPathPoints(result.path)).toBeLessThanOrEqual(MAX_EXPECTED_SPARKLINE_POINTS);
		expect(Number.isFinite(result.last.x)).toBe(true);
		expect(Number.isFinite(result.last.y)).toBe(true);
	});
});
