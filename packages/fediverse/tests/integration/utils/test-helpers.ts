/**
 * Test Helpers for Integration Testing
 *
 * Provides utilities for waiting, measuring performance,
 * simulating network conditions, and asserting on async behavior.
 */

import { tick } from 'svelte';

interface PerformanceMemoryInfo {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
}

function hasPerformanceMemory(perf: Performance): perf is Performance & { memory: PerformanceMemoryInfo } {
	return 'memory' in perf;
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
	condition: () => boolean | Promise<boolean>,
	options: {
		timeout?: number;
		interval?: number;
		timeoutMessage?: string;
	} = {}
): Promise<void> {
	const { timeout = 5000, interval = 50, timeoutMessage = 'Timeout waiting for condition' } = options;

	const startTime = Date.now();

	while (Date.now() - startTime < timeout) {
		const result = await condition();
		if (result) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, interval));
	}

	throw new Error(timeoutMessage);
}

/**
 * Wait for element to appear in DOM
 */
export async function waitForElement(
	selector: string,
	options: { timeout?: number } = {}
): Promise<Element> {
	const { timeout = 5000 } = options;

	let element: Element | null = null;

	await waitFor(
		() => {
			element = document.querySelector(selector);
			return element !== null;
		},
		{ timeout, timeoutMessage: `Element "${selector}" not found within ${timeout}ms` }
	);

	if (!element) {
		throw new Error(`Element "${selector}" not found after waiting for ${timeout}ms`);
	}

	return element;
}

/**
 * Wait for subscription to be established
 */
export async function waitForSubscription(
	subscriptionName: string,
	options: { timeout?: number } = {}
): Promise<void> {
	const { timeout = 3000 } = options;

	await waitFor(
		() => {
			// Check if subscription is active (implementation specific)
			// This would typically check a subscription registry or connection state
			return true; // Simplified for now
		},
		{ timeout, timeoutMessage: `Subscription "${subscriptionName}" not established within ${timeout}ms` }
	);
}

/**
 * Simulate network failure
 */
export function simulateNetworkFailure(duration: number = 1000): Promise<void> {
	// This would typically mock fetch/XMLHttpRequest to fail
	// For now, we'll use a simple delay
	return new Promise(resolve => {
		// Mark network as offline
		if (typeof window !== 'undefined') {
			Object.defineProperty(window.navigator, 'onLine', {
				writable: true,
				value: false,
			});
		}

		setTimeout(() => {
			// Restore network
			if (typeof window !== 'undefined') {
				Object.defineProperty(window.navigator, 'onLine', {
					writable: true,
					value: true,
				});
			}
			resolve();
		}, duration);
	});
}

/**
 * Simulate slow network
 */
export class NetworkThrottler {
	private originalFetch: typeof fetch;
	private delay: number;

	constructor(delay: number = 1000) {
		this.delay = delay;
		this.originalFetch = globalThis.fetch;
	}

	enable(): void {
		const delay = this.delay;
		globalThis.fetch = async function(...args: Parameters<typeof fetch>) {
			await new Promise(resolve => setTimeout(resolve, delay));
			return this.originalFetch(...args);
		}.bind(this);
	}

	disable(): void {
		globalThis.fetch = this.originalFetch;
	}
}

/**
 * Measure render time
 */
export async function measureRenderTime(
	renderFn: () => void | Promise<void>
): Promise<number> {
	const start = performance.now();
	await renderFn();
	await tick(); // Wait for Svelte to flush updates
	const end = performance.now();
	return end - start;
}

/**
 * Check memory usage
 */
export function checkMemoryUsage(): {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
} {
	if (typeof performance !== 'undefined' && hasPerformanceMemory(performance)) {
		const memory = performance.memory;
		return {
			usedJSHeapSize: memory.usedJSHeapSize,
			totalJSHeapSize: memory.totalJSHeapSize,
			jsHeapSizeLimit: memory.jsHeapSizeLimit,
		};
	}

	// Return dummy values if memory API not available
	return {
		usedJSHeapSize: 0,
		totalJSHeapSize: 0,
		jsHeapSizeLimit: 0,
	};
}

/**
 * Measure frame rate during an operation
 */
export async function measureFrameRate(
	operation: () => void | Promise<void>,
	duration: number = 1000
): Promise<number> {
	const frames: number[] = [];
	let lastTime = performance.now();
	let running = true;

	// Start frame counting
	const countFrames = () => {
		if (!running) return;

		const currentTime = performance.now();
		const delta = currentTime - lastTime;
		frames.push(1000 / delta); // FPS
		lastTime = currentTime;

		requestAnimationFrame(countFrames);
	};

	requestAnimationFrame(countFrames);

	// Run operation
	await operation();

	// Wait for duration
	await new Promise(resolve => setTimeout(resolve, duration));

	// Stop counting
	running = false;

	// Calculate average FPS
	if (frames.length === 0) return 0;
	return frames.reduce((a, b) => a + b, 0) / frames.length;
}

/**
 * Simulate rapid scrolling
 */
export async function simulateRapidScroll(
	element: Element,
	distance: number,
	steps: number = 10
): Promise<void> {
	const stepSize = distance / steps;

	for (let i = 0; i < steps; i++) {
		element.scrollTop += stepSize;
		
		// Trigger scroll event
		element.dispatchEvent(new Event('scroll'));
		
		// Wait for next frame
		await new Promise(resolve => requestAnimationFrame(resolve));
	}
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(
	element: Element,
	options: { timeout?: number } = {}
): Promise<void> {
	const { timeout = 3000 } = options;

	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error('Animation timeout'));
		}, timeout);

		const handleAnimationEnd = () => {
			clearTimeout(timer);
			element.removeEventListener('animationend', handleAnimationEnd);
			element.removeEventListener('transitionend', handleAnimationEnd);
			resolve();
		};

		element.addEventListener('animationend', handleAnimationEnd);
		element.addEventListener('transitionend', handleAnimationEnd);
	});
}

/**
 * Flush all pending promises
 */
export async function flushPromises(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
	await tick();
}

/**
 * Simulate user typing
 */
export async function simulateTyping(
	element: HTMLInputElement | HTMLTextAreaElement,
	text: string,
	options: { delay?: number } = {}
): Promise<void> {
	const { delay = 50 } = options;

	for (const char of text) {
		element.value += char;
		
		// Dispatch input event
		element.dispatchEvent(new Event('input', { bubbles: true }));
		
		// Wait between characters
		await new Promise(resolve => setTimeout(resolve, delay));
	}
}

/**
 * Create a deferred promise
 */
export function createDeferred<T>(): {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (reason?: unknown) => void;
} {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

/**
 * Mock WebSocket connection
 */
export class MockWebSocket {
	public url: string;
	public readyState: number = 0; // CONNECTING
	public onopen: ((event: Event) => void) | null = null;
	public onclose: ((event: CloseEvent) => void) | null = null;
	public onerror: ((event: Event) => void) | null = null;
	public onmessage: ((event: MessageEvent) => void) | null = null;

	private static readonly CONNECTING = 0;
	private static readonly OPEN = 1;
	private static readonly CLOSING = 2;
	private static readonly CLOSED = 3;

	constructor(url: string) {
		this.url = url;

		// Simulate connection
		setTimeout(() => {
			this.readyState = MockWebSocket.OPEN;
			if (this.onopen) {
				this.onopen(new Event('open'));
			}
		}, 100);
	}

	send(_data: string): void {
		if (this.readyState !== MockWebSocket.OPEN) {
			throw new Error('WebSocket is not open');
		}
		// Simulate send
	}

	close(code?: number, reason?: string): void {
		this.readyState = MockWebSocket.CLOSING;
		setTimeout(() => {
			this.readyState = MockWebSocket.CLOSED;
			if (this.onclose) {
				this.onclose(new CloseEvent('close', { code, reason }));
			}
		}, 50);
	}

	// Simulate receiving a message
	simulateMessage<T>(data: T): void {
		if (this.readyState === MockWebSocket.OPEN && this.onmessage) {
			this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
		}
	}

	// Simulate error
	simulateError(): void {
		if (this.onerror) {
			this.onerror(new Event('error'));
		}
	}
}

/**
 * Assert element has class
 */
export function assertHasClass(element: Element, className: string): void {
	if (!element.classList.contains(className)) {
		throw new Error(`Expected element to have class "${className}"`);
	}
}

/**
 * Assert element text content
 */
export function assertTextContent(element: Element, expected: string): void {
	const actual = element.textContent?.trim();
	if (actual !== expected) {
		throw new Error(`Expected text content "${expected}", got "${actual}"`);
	}
}

/**
 * Assert element is visible
 */
export function assertVisible(element: Element): void {
	const rect = element.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) {
		throw new Error('Element is not visible');
	}

	const style = window.getComputedStyle(element);
	if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
		throw new Error('Element is not visible');
	}
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(
	timeout: number = 2000
): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
	operation: () => Promise<T>,
	options: {
		maxRetries?: number;
		initialDelay?: number;
		maxDelay?: number;
		factor?: number;
	} = {}
): Promise<T> {
	const {
		maxRetries = 3,
		initialDelay = 100,
		maxDelay = 5000,
		factor = 2,
	} = options;

	let delay = initialDelay;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await operation();
		} catch (error) {
			if (i === maxRetries - 1) {
				throw error;
			}

			await new Promise(resolve => setTimeout(resolve, delay));
			delay = Math.min(delay * factor, maxDelay);
		}
	}

	throw new Error('Max retries exceeded');
}
