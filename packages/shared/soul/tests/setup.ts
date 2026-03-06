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

afterEach(() => {
	cleanup();
});
