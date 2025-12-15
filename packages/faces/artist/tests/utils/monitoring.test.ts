import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	measureFCP,
	measureLCP,
	measureFID,
	measureCLS,
	createMetricsReporter,
} from '../../src/utils/monitoring';

describe('monitoring Utils', () => {
	let observerCallback: any;
	let observeMock: any;
	let disconnectMock: any;

	beforeEach(() => {
		observeMock = vi.fn();
		disconnectMock = vi.fn();

		// @ts-ignore - Testing private property
		global.PerformanceObserver = class MockPerformanceObserver {
			constructor(callback: any) {
				observerCallback = callback;
			}
			observe = observeMock;
			disconnect = disconnectMock;
			takeRecords = vi.fn();
		};

		// @ts-ignore - Testing private property
		global.performance.getEntriesByName = vi.fn().mockReturnValue([]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('measureFCP', () => {
		it('resolves when entry observed', async () => {
			const promise = measureFCP();

			// Trigger observer
			observerCallback({
				getEntriesByName: (name: string) => {
					if (name === 'first-contentful-paint') {
						return [{ startTime: 100 }];
					}
					return [];
				},
			});

			const metric = await promise;
			expect(metric?.name).toBe('FCP');
			expect(metric?.value).toBe(100);
			expect(metric?.rating).toBe('good');
		});

		it('resolves if already present', async () => {
			// @ts-ignore - Testing private property
			global.performance.getEntriesByName.mockReturnValue([{ startTime: 100 }]);
			const metric = await measureFCP();
			expect(metric?.value).toBe(100);
		});
	});

	describe('measureLCP', () => {
		it('reports largest entry on finalize', async () => {
			const promise = measureLCP();

			// Multiple entries, last one counts
			observerCallback({
				getEntries: () => [{ startTime: 100 }, { startTime: 200 }],
			});

			// Simulate finalize (keydown)
			window.dispatchEvent(new Event('keydown'));

			const metric = await promise;
			expect(metric?.name).toBe('LCP');
			expect(metric?.value).toBe(200);
		});
	});

	describe('measureFID', () => {
		it('reports first input delay', async () => {
			const promise = measureFID();

			observerCallback({
				getEntries: () => [{ startTime: 100, processingStart: 150 }],
			});

			const metric = await promise;
			expect(metric?.name).toBe('FID');
			expect(metric?.value).toBe(50); // 150 - 100
		});
	});

	describe('measureCLS', () => {
		it('calculates cumulative shift', async () => {
			const promise = measureCLS();

			observerCallback({
				getEntries: () => [
					{ value: 0.1, hadRecentInput: false, startTime: 100 },
					{ value: 0.2, hadRecentInput: false, startTime: 200 }, // Within 1s, so sum
				],
			});

			// Finalize
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			const metric = await promise;
			expect(metric?.name).toBe('CLS');
			expect(metric?.value).toBeCloseTo(0.3);
		});
	});

	describe('createMetricsReporter', () => {
		it('batches and reports metrics', () => {
			const onReport = vi.fn();
			const reporter = createMetricsReporter({
				onReport,
				batchSize: 2,
			});

			reporter.report({ name: 'FCP', value: 100, rating: 'good', timestamp: 0 });
			expect(onReport).not.toHaveBeenCalled();

			reporter.report({ name: 'LCP', value: 200, rating: 'good', timestamp: 0 });
			expect(onReport).toHaveBeenCalledTimes(1);
			expect(onReport).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ name: 'FCP' }),
					expect.objectContaining({ name: 'LCP' }),
				])
			);
		});

		it('flushes remaining metrics', () => {
			const onReport = vi.fn();
			const reporter = createMetricsReporter({ onReport, batchSize: 5 });

			reporter.report({ name: 'FCP', value: 100, rating: 'good', timestamp: 0 });
			reporter.flush();

			expect(onReport).toHaveBeenCalledTimes(1);
		});
	});

	describe('measureLCP fallback', () => {
		it('handles no entries', async () => {
			const promise = measureLCP();
			observerCallback({ getEntries: () => [] });
			window.dispatchEvent(new Event('keydown'));
			const metric = await promise;
			expect(metric).toBeNull();
		});
	});

	describe('measureCLS fallback', () => {
		it('handles no entries', async () => {
			const promise = measureCLS();
			observerCallback({ getEntries: () => [] });
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBe(0);
		});
	});
});
