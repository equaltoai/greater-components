import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

const matchMediaMock = vi.fn((query: string) => ({
	matches: false,
	media: query,
	onchange: null,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));

if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		configurable: true,
		value: matchMediaMock,
	});
}

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

beforeEach(() => {
	// Reset any document-level state between tests.
});

afterEach(() => {
	cleanup();
});
