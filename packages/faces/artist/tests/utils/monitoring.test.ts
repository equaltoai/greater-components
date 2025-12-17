import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	measureFCP,
	measureLCP,
	measureFID,
	measureCLS,
	measureTTI,
	createMetricsReporter,
} from '../../src/utils/monitoring';

describe('monitoring Utils', () => {
	let observers: any[] = [];
	let originalPerformanceObserver: any;
	let originalRequestAnimationFrame: any;
	let nowMock: any;
	let getEntriesByNameMock: any;

	beforeEach(() => {
		originalPerformanceObserver = global.PerformanceObserver;
		originalRequestAnimationFrame = global.requestAnimationFrame;
		observers = [];

		// @ts-ignore - Mocking private property for testing
		global.PerformanceObserver = class MockPerformanceObserver {
			callback: any;
			constructor(callback: any) {
				this.callback = callback;
				observers.push(this);
			}
			observe = vi.fn();
			disconnect = vi.fn();
			takeRecords = vi.fn();
		};

		// Spy on performance methods
		// We assume global.performance exists (JSDOM/Node)
		getEntriesByNameMock = vi.spyOn(global.performance, 'getEntriesByName').mockReturnValue([]);
		vi.spyOn(global.performance, 'getEntries').mockReturnValue([]);
		nowMock = vi.spyOn(global.performance, 'now').mockReturnValue(1000);

		// Mock navigator.sendBeacon
		if (global.navigator) {
			Object.defineProperty(global.navigator, 'sendBeacon', {
				value: vi.fn().mockReturnValue(true),
				writable: true,
				configurable: true,
			});
			Object.defineProperty(global.navigator, 'connection', {
				value: { effectiveType: '4g' },
				writable: true,
				configurable: true,
			});
		}

		// Mock fetch
		global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

		// Mock requestAnimationFrame
		global.requestAnimationFrame = (cb: FrameRequestCallback) => {
			return setTimeout(() => cb(performance.now()), 16) as unknown as number;
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
		if (global.PerformanceObserver) global.PerformanceObserver = originalPerformanceObserver;
		if (global.requestAnimationFrame) global.requestAnimationFrame = originalRequestAnimationFrame;
	});

	// Helper to trigger latest observer
	const triggerObserver = (data: any) => {
		const observer = observers[observers.length - 1];
		if (observer) observer.callback(data);
	};

	describe('measureFCP', () => {
		it('resolves when entry observed', async () => {
			const promise = measureFCP();
			triggerObserver({
				getEntriesByName: (name: string) => {
					if (name === 'first-contentful-paint') return [{ startTime: 100 }];
					return [];
				},
			});
			const metric = await promise;
			expect(metric?.name).toBe('FCP');
			expect(metric?.value).toBe(100);
			expect(metric?.rating).toBe('good');
		});

		it('resolves with poor rating for slow FCP', async () => {
			const promise = measureFCP();
			triggerObserver({
				getEntriesByName: (name: string) => {
					if (name === 'first-contentful-paint') return [{ startTime: 3500 }];
					return [];
				},
			});
			const metric = await promise;
			expect(metric?.rating).toBe('poor');
		});

		it('resolves if already present', async () => {
			getEntriesByNameMock.mockReturnValue([{ startTime: 100 }]);
			const metric = await measureFCP();
			expect(metric?.value).toBe(100);
		});

		it('times out if no entry found', async () => {
			vi.useFakeTimers();
			const promise = measureFCP();
			vi.advanceTimersByTime(10001);
			const metric = await promise;
			expect(metric).toBeNull();
			vi.useRealTimers();
		});

		it('returns null if PerformanceObserver not supported', async () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking globals
			delete global.window;
			const metric = await measureFCP();
			expect(metric).toBeNull();
			global.window = originalWindow;
		});

		it('handles observe error', async () => {
			// @ts-ignore - Mocking throwing observer
			global.PerformanceObserver = class ThrowingObserver {
				constructor(_cb: any) {}
				observe() {
					throw new Error('Error');
				}
			};
			const promise = measureFCP();
			expect(await promise).toBeNull();
		});
	});

	describe('measureLCP', () => {
		it('reports largest entry on finalize (interaction)', async () => {
			const promise = measureLCP();
			triggerObserver({
				getEntries: () => [{ startTime: 100 }, { startTime: 200 }],
			});
			window.dispatchEvent(new Event('keydown'));
			const metric = await promise;
			expect(metric?.value).toBe(200);
		});

		it('reports largest entry on finalize (visibility change)', async () => {
			const promise = measureLCP();
			triggerObserver({
				getEntries: () => [{ startTime: 300 }],
			});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBe(300);
		});

		it('resolves null if no entry before finalize', async () => {
			const promise = measureLCP();
			window.dispatchEvent(new Event('click'));
			const metric = await promise;
			expect(metric).toBeNull();
		});

		it('returns null if PerformanceObserver not supported', async () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking globals
			delete global.window;
			const metric = await measureLCP();
			expect(metric).toBeNull();
			global.window = originalWindow;
		});

		it('handles observe error', async () => {
			// @ts-ignore - Mocking throwing observer
			global.PerformanceObserver = class ThrowingObserver {
				constructor(_cb: any) {}
				observe() {
					throw new Error('Error');
				}
			};
			const metric = await measureLCP();
			expect(metric).toBeNull();
		});
	});

	describe('measureFID', () => {
		it('reports first input delay', async () => {
			const promise = measureFID();
			triggerObserver({
				getEntries: () => [{ startTime: 100, processingStart: 150 }],
			});
			const metric = await promise;
			expect(metric?.value).toBe(50);
		});

		it('returns null if PerformanceObserver not supported', async () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking globals
			delete global.window;
			const metric = await measureFID();
			expect(metric).toBeNull();
			global.window = originalWindow;
		});

		it('handles observe error', async () => {
			// @ts-ignore - Mocking throwing observer
			global.PerformanceObserver = class ThrowingObserver {
				constructor(_cb: any) {}
				observe() {
					throw new Error('Error');
				}
			};
			const promise = measureFID();
			const metric = await promise;
			expect(metric).toBeNull();
		});
	});

	describe('measureCLS', () => {
		it('calculates cumulative shift', async () => {
			const promise = measureCLS();
			triggerObserver({
				getEntries: () => [
					{ value: 0.1, hadRecentInput: false, startTime: 100 },
					{ value: 0.2, hadRecentInput: false, startTime: 200 },
				],
			});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBeCloseTo(0.3);
		});

		it('handles session windows (gap > 1s)', async () => {
			const promise = measureCLS();
			triggerObserver({
				getEntries: () => [
					{ value: 0.1, hadRecentInput: false, startTime: 100 },
					// Gap > 1s, new session
					{ value: 0.2, hadRecentInput: false, startTime: 1200 },
				],
			});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBe(0.2); // Uses max session
		});

		it('handles session windows (session > 5s)', async () => {
			const promise = measureCLS();
			triggerObserver({
				getEntries: () => [
					{ value: 0.1, hadRecentInput: false, startTime: 100 },
					// Session > 5s, new session
					{ value: 0.2, hadRecentInput: false, startTime: 5200 },
				],
			});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBe(0.2);
		});

		it('ignores input related shifts', async () => {
			const promise = measureCLS();
			triggerObserver({
				getEntries: () => [{ value: 0.1, hadRecentInput: true, startTime: 100 }],
			});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
			const metric = await promise;
			expect(metric?.value).toBe(0);
		});

		it('returns null if PerformanceObserver not supported', async () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking globals
			delete global.window;
			const metric = await measureCLS();
			expect(metric).toBeNull();
			global.window = originalWindow;
		});

		it('handles observe error', async () => {
			// @ts-ignore - Mocking throwing observer
			global.PerformanceObserver = class ThrowingObserver {
				constructor(_cb: any) {}
				observe() {
					throw new Error('Error');
				}
			};
			const metric = await measureCLS();
			expect(metric).toBeNull();
		});
	});

	describe('measureTTI', () => {
		it('falls back to load time if observer error', async () => {
			// @ts-ignore - Testing error handling
			global.PerformanceObserver = class ThrowingObserver {
				constructor(_cb: any) {}
				observe() {
					throw new Error('Error');
				}
			};

			const promise = measureTTI();
			nowMock.mockReturnValue(1234);
			window.dispatchEvent(new Event('load'));

			const metric = await promise;
			expect(metric?.value).toBe(1234);
			expect(metric?.metadata?.fallback).toBe(true);
		});

		it('returns null if PerformanceObserver not supported', async () => {
			const originalWindow = global.window;
			// @ts-ignore - Mocking globals
			delete global.window;
			const metric = await measureTTI();
			expect(metric).toBeNull();
			global.window = originalWindow;
		});

		it('times out after 30s', async () => {
			vi.useFakeTimers();
			const promise = measureTTI();
			vi.advanceTimersByTime(30001);
			const metric = await promise;
			expect(metric).toBeNull();
			vi.useRealTimers();
		});
	});

	describe('createMetricsReporter', () => {
		it('collectAll gathers all metrics', async () => {
			const reporter = createMetricsReporter();
			const promise = reporter.collectAll();

			// Trigger FCP
			if (observers[0])
				observers[0].callback({
					getEntriesByName: (name: string) =>
						name === 'first-contentful-paint' ? [{ startTime: 100 }] : [],
				});

			// Trigger LCP
			if (observers[1])
				observers[1].callback({
					getEntries: () => [{ startTime: 200 }],
				});
			window.dispatchEvent(new Event('keydown'));

			// Trigger FID
			if (observers[2])
				observers[2].callback({
					getEntries: () => [{ startTime: 100, processingStart: 150 }],
				});

			// Trigger CLS
			if (observers[3])
				observers[3].callback({
					getEntries: () => [{ value: 0.1, hadRecentInput: false, startTime: 100 }],
				});
			Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			const metrics = await promise;
			expect(metrics.length).toBeGreaterThanOrEqual(4);
		});

		it('reports metrics in batches', () => {
			const onReport = vi.fn();
			const reporter = createMetricsReporter({ onReport, batchSize: 2 });

			const metric = { name: 'FCP', value: 100, rating: 'good' as const, timestamp: 123 };

			reporter.report(metric);
			expect(onReport).not.toHaveBeenCalled();

			reporter.report(metric);
			expect(onReport).toHaveBeenCalledTimes(1);
			expect(onReport).toHaveBeenCalledWith([
				expect.objectContaining(metric),
				expect.objectContaining(metric),
			]);
		});

		it('flushes metrics manually', () => {
			const onReport = vi.fn();
			const reporter = createMetricsReporter({ onReport, batchSize: 5 });

			const metric = { name: 'FCP', value: 100, rating: 'good' as const, timestamp: 123 };
			reporter.report(metric);
			reporter.flush();
			expect(onReport).toHaveBeenCalledTimes(1);
		});

		it('sends via beacon if available', () => {
			const reporter = createMetricsReporter({ endpoint: '/metrics' });
			const metric = { name: 'FCP', value: 100, rating: 'good' as const, timestamp: 123 };
			reporter.report(metric);
			reporter.flush();
			expect(navigator.sendBeacon).toHaveBeenCalledWith('/metrics', expect.stringContaining('FCP'));
		});

		it('falls back to fetch if beacon not available', () => {
			// @ts-ignore - Mocking globals
			delete navigator.sendBeacon;
			const reporter = createMetricsReporter({ endpoint: '/metrics' });
			const metric = { name: 'FCP', value: 100, rating: 'good' as const, timestamp: 123 };
			reporter.report(metric);
			reporter.flush();
			expect(global.fetch).toHaveBeenCalledWith(
				'/metrics',
				expect.objectContaining({
					method: 'POST',
					keepalive: true,
				})
			);
		});

		it('includes metadata', () => {
			const onReport = vi.fn();
			const reporter = createMetricsReporter({ onReport, includeMetadata: true, batchSize: 1 });
			const metric = { name: 'FCP', value: 100, rating: 'good' as const, timestamp: 123 };
			reporter.report(metric);
			expect(onReport).toHaveBeenCalledWith([
				expect.objectContaining({
					metadata: expect.objectContaining({
						connection: '4g',
					}),
				}),
			]);
		});
	});
});
