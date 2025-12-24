/**
 * Test setup for Community Face
 *
 * Configures Vitest environment with JSDOM, mocks adapters and API calls,
 * and provides test utilities for comprehensive component testing.
 */

import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi, beforeAll } from 'vitest';

expect.extend(matchers);

// Svelte 5 runes polyfills for Vitest
const runtime = globalThis as typeof globalThis & {
	$state?: <T>(value: T) => T;
	$derived?: <T>(fn: () => T) => () => T;
	$effect?: (fn: () => void | (() => void)) => void;
};

if (typeof runtime.$state !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$state = <T>(value: T) => value;
}

if (typeof runtime.$derived !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$derived = <T>(fn: () => T) => fn;
}

if (typeof runtime.$effect !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$effect = () => {};
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	options?: IntersectionObserverInit;

	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		this.options = options;
	}

	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
	callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}

	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: MockResizeObserver,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock canvas context for image processing
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
	drawImage: vi.fn(),
	getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
	putImageData: vi.fn(),
	createImageData: vi.fn(),
	scale: vi.fn(),
	translate: vi.fn(),
	rotate: vi.fn(),
	save: vi.fn(),
	restore: vi.fn(),
	fillRect: vi.fn(),
	clearRect: vi.fn(),
	measureText: vi.fn().mockReturnValue({ width: 0 }),
});

// Mock requestIdleCallback
// @ts-expect-error - Mock return type doesn't match exactly
global.requestIdleCallback = vi.fn((cb) => setTimeout(cb, 0));
global.cancelIdleCallback = vi.fn();

// Mock IndexedDB for offline store tests
const mockIndexedDB = {
	open: vi.fn().mockReturnValue({
		result: {
			createObjectStore: vi.fn(),
			transaction: vi.fn().mockReturnValue({
				objectStore: vi.fn().mockReturnValue({
					put: vi.fn(),
					get: vi.fn(),
					delete: vi.fn(),
					getAll: vi.fn(),
				}),
			}),
		},
		onerror: null,
		onsuccess: null,
		onupgradeneeded: null,
	}),
	deleteDatabase: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
	writable: true,
	value: mockIndexedDB,
});

// Mock navigator.onLine for offline tests
Object.defineProperty(navigator, 'onLine', {
	writable: true,
	value: true,
});

// Set up environment variables for testing
beforeAll(() => {
	process.env['NODE_ENV'] = 'test';
});
