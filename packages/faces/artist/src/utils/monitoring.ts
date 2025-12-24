/**
 * Performance Monitoring Utilities
 *
 * Core Web Vitals measurement and reporting.
 * Implements REQ-PERF-006 Lighthouse targets.
 *
 * @module @equaltoai/greater-components-artist/utils/monitoring
 */

// ============================================================================
// Performance Metrics Types
// ============================================================================

/**
 * Performance metric entry
 */
export interface PerformanceMetric {
	/** Metric name */
	name: string;
	/** Metric value */
	value: number;
	/** Rating (good, needs-improvement, poor) */
	rating: 'good' | 'needs-improvement' | 'poor';
	/** Timestamp */
	timestamp: number;
	/** Additional metadata */
	metadata?: Record<string, unknown>;
}

/**
 * Core Web Vitals thresholds
 */
export const CORE_WEB_VITALS_THRESHOLDS = {
	FCP: { good: 1800, poor: 3000 },
	LCP: { good: 2500, poor: 4000 },
	FID: { good: 100, poor: 300 },
	CLS: { good: 0.1, poor: 0.25 },
	TTI: { good: 3800, poor: 7300 },
	TBT: { good: 200, poor: 600 },
} as const;

/**
 * Get rating for a metric value
 */
function getRating(
	value: number,
	thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
	if (value <= thresholds.good) return 'good';
	if (value <= thresholds.poor) return 'needs-improvement';
	return 'poor';
}

// ============================================================================
// Core Web Vitals Measurement
// ============================================================================

/**
 * Measure First Contentful Paint (FCP)
 * Time when first content is painted to screen
 */
export function measureFCP(): Promise<PerformanceMetric | null> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
			resolve(null);
			return;
		}

		// Check if already available
		const entries = performance.getEntriesByName('first-contentful-paint');
		if (entries.length > 0) {
			const entry = entries[0];
			if (entry) {
				resolve({
					name: 'FCP',
					value: entry.startTime,
					rating: getRating(entry.startTime, CORE_WEB_VITALS_THRESHOLDS.FCP),
					timestamp: Date.now(),
				});
				return;
			}
		}

		// Observe for FCP
		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntriesByName('first-contentful-paint');
			if (entries.length > 0) {
				const entry = entries[0];
				if (entry) {
					observer.disconnect();
					resolve({
						name: 'FCP',
						value: entry.startTime,
						rating: getRating(entry.startTime, CORE_WEB_VITALS_THRESHOLDS.FCP),
						timestamp: Date.now(),
					});
				}
			}
		});

		try {
			observer.observe({ type: 'paint', buffered: true });
		} catch {
			resolve(null);
		}

		// Timeout after 10 seconds
		setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, 10000);
	});
}

/**
 * Measure Largest Contentful Paint (LCP)
 * Time when largest content element is painted
 */
export function measureLCP(): Promise<PerformanceMetric | null> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
			resolve(null);
			return;
		}

		let lastEntry: PerformanceEntry | null = null;

		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			lastEntry = entries[entries.length - 1] ?? null;
		});

		try {
			observer.observe({ type: 'largest-contentful-paint', buffered: true });
		} catch {
			resolve(null);
			return;
		}

		// LCP is finalized on user interaction or page hide
		const finalize = () => {
			observer.disconnect();
			if (lastEntry) {
				resolve({
					name: 'LCP',
					value: lastEntry.startTime,
					rating: getRating(lastEntry.startTime, CORE_WEB_VITALS_THRESHOLDS.LCP),
					timestamp: Date.now(),
				});
			} else {
				resolve(null);
			}
		};

		// Listen for user interaction
		['keydown', 'click', 'scroll'].forEach((type) => {
			window.addEventListener(type, finalize, { once: true, passive: true });
		});

		// Or page visibility change
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				finalize();
			}
		});
	});
}

/**
 * Measure Time to Interactive (TTI)
 * Approximation using Long Tasks API
 */
export function measureTTI(): Promise<PerformanceMetric | null> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
			resolve(null);
			return;
		}

		const _navigationStart = performance.timing?.navigationStart || 0;
		let lastLongTaskEnd = 0;
		let quietWindowStart = performance.now();

		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			entries.forEach((entry) => {
				lastLongTaskEnd = entry.startTime + entry.duration;
				quietWindowStart = lastLongTaskEnd;
			});
		});

		try {
			observer.observe({ type: 'longtask', buffered: true });
		} catch {
			// Long Tasks API not supported, use load event as fallback
			window.addEventListener('load', () => {
				const loadTime = performance.now();
				resolve({
					name: 'TTI',
					value: loadTime,
					rating: getRating(loadTime, CORE_WEB_VITALS_THRESHOLDS.TTI),
					timestamp: Date.now(),
					metadata: { fallback: true },
				});
			});
			return;
		}

		// Check for 5 second quiet window
		const checkQuietWindow = () => {
			const now = performance.now();
			if (now - quietWindowStart >= 5000) {
				observer.disconnect();
				const tti = quietWindowStart;
				resolve({
					name: 'TTI',
					value: tti,
					rating: getRating(tti, CORE_WEB_VITALS_THRESHOLDS.TTI),
					timestamp: Date.now(),
				});
			} else {
				requestAnimationFrame(checkQuietWindow);
			}
		};

		// Start checking after load
		window.addEventListener('load', () => {
			setTimeout(checkQuietWindow, 100);
		});

		// Timeout after 30 seconds
		setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, 30000);
	});
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(): Promise<PerformanceMetric | null> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
			resolve(null);
			return;
		}

		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			if (entries.length > 0) {
				const entry = entries[0] as PerformanceEventTiming;
				observer.disconnect();
				const fid = entry.processingStart - entry.startTime;
				resolve({
					name: 'FID',
					value: fid,
					rating: getRating(fid, CORE_WEB_VITALS_THRESHOLDS.FID),
					timestamp: Date.now(),
				});
			}
		});

		try {
			observer.observe({ type: 'first-input', buffered: true });
		} catch {
			resolve(null);
		}
	});
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(): Promise<PerformanceMetric | null> {
	return new Promise((resolve) => {
		if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
			resolve(null);
			return;
		}

		let clsValue = 0;
		let sessionValue = 0;
		let sessionEntries: PerformanceEntry[] = [];

		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries() as LayoutShift[];

			entries.forEach((entry) => {
				// Only count if not from user input
				if (!entry.hadRecentInput) {
					const firstEntry = sessionEntries[0];
					const lastEntry = sessionEntries[sessionEntries.length - 1];

					// Start new session if gap > 1s or session > 5s
					if (
						sessionEntries.length > 0 &&
						firstEntry &&
						lastEntry &&
						(entry.startTime - lastEntry.startTime > 1000 ||
							entry.startTime - firstEntry.startTime > 5000)
					) {
						if (sessionValue > clsValue) {
							clsValue = sessionValue;
						}
						sessionValue = entry.value;
						sessionEntries = [entry];
					} else {
						sessionValue += entry.value;
						sessionEntries.push(entry);
					}
				}
			});
		});

		try {
			observer.observe({ type: 'layout-shift', buffered: true });
		} catch {
			resolve(null);
			return;
		}

		// Finalize on page hide
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				if (sessionValue > clsValue) {
					clsValue = sessionValue;
				}
				observer.disconnect();
				resolve({
					name: 'CLS',
					value: clsValue,
					rating: getRating(clsValue, CORE_WEB_VITALS_THRESHOLDS.CLS),
					timestamp: Date.now(),
				});
			}
		});
	});
}

// ============================================================================
// Metrics Reporting
// ============================================================================

/**
 * Metrics reporter configuration
 */
export interface MetricsReporterConfig {
	/** Endpoint to send metrics */
	endpoint?: string;
	/** Custom report function */
	onReport?: (metrics: PerformanceMetric[]) => void;
	/** Include page metadata */
	includeMetadata?: boolean;
	/** Batch metrics before sending */
	batchSize?: number;
}

/**
 * Create metrics reporter
 */
export function createMetricsReporter(config: MetricsReporterConfig = {}): {
	report: (metric: PerformanceMetric) => void;
	flush: () => void;
	collectAll: () => Promise<PerformanceMetric[]>;
} {
	const { endpoint, onReport, includeMetadata = true, batchSize = 5 } = config;
	const batch: PerformanceMetric[] = [];

	const sendBatch = () => {
		if (batch.length === 0) return;

		const metrics = [...batch];
		batch.length = 0;

		if (includeMetadata) {
			metrics.forEach((metric) => {
				metric.metadata = {
					...metric.metadata,
					url: window.location.href,
					userAgent: navigator.userAgent,
					connection: (navigator as Navigator & { connection?: { effectiveType: string } })
						.connection?.effectiveType,
				};
			});
		}

		if (onReport) {
			onReport(metrics);
		}

		if (endpoint) {
			// Use sendBeacon for reliability
			if (navigator.sendBeacon) {
				navigator.sendBeacon(endpoint, JSON.stringify(metrics));
			} else {
				fetch(endpoint, {
					method: 'POST',
					body: JSON.stringify(metrics),
					headers: { 'Content-Type': 'application/json' },
					keepalive: true,
				}).catch(console.error);
			}
		}
	};

	return {
		report(metric: PerformanceMetric) {
			batch.push(metric);
			if (batch.length >= batchSize) {
				sendBatch();
			}
		},
		flush() {
			sendBatch();
		},
		async collectAll() {
			const metrics: PerformanceMetric[] = [];

			const [fcp, lcp, fid, cls] = await Promise.all([
				measureFCP(),
				measureLCP(),
				measureFID(),
				measureCLS(),
			]);

			if (fcp) metrics.push(fcp);
			if (lcp) metrics.push(lcp);
			if (fid) metrics.push(fid);
			if (cls) metrics.push(cls);

			return metrics;
		},
	};
}

/**
 * Report all Core Web Vitals
 */
export async function reportMetrics(
	onReport: (metrics: PerformanceMetric[]) => void
): Promise<void> {
	const reporter = createMetricsReporter({ onReport });
	const metrics = await reporter.collectAll();
	onReport(metrics);
}

// ============================================================================
// Performance Event Timing type (for FID)
// ============================================================================

interface PerformanceEventTiming extends PerformanceEntry {
	processingStart: number;
	processingEnd: number;
	duration: number;
	cancelable: boolean;
	target?: Node;
}

interface LayoutShift extends PerformanceEntry {
	value: number;
	hadRecentInput: boolean;
}
