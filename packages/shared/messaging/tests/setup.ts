import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

const matchMediaMock = vi.fn((query: string) => ({
	matches: false,
	media: query,
	onchange: null,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	configurable: true,
	value: matchMediaMock,
});

const localStorageMock = (() => {
	const store = new Map<string, string>();
	return {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
	};
})();

Object.defineProperty(window, 'localStorage', {
	writable: true,
	configurable: true,
	value: localStorageMock,
});

class ResizeObserverMock {
	constructor(_callback: ResizeObserverCallback) {}
	observe(_target: Element) {}
	unobserve(_target: Element) {}
	disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	configurable: true,
	value: ResizeObserverMock,
});

afterEach(() => {
	cleanup();
});
