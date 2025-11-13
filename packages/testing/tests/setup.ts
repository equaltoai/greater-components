import { vi, beforeAll } from 'vitest';

// Global test setup for the testing package

// Mock DOM APIs that might not be available in test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestIdleCallback for testing environments
// @ts-expect-error - Mock return type doesn't match exactly
global.requestIdleCallback = vi.fn((cb) => setTimeout(cb, 0));
global.cancelIdleCallback = vi.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock focus-related APIs
global.HTMLElement.prototype.scrollIntoView = vi.fn();
global.HTMLElement.prototype.focus = vi.fn();
global.HTMLElement.prototype.blur = vi.fn();

// Set up environment variables for testing
beforeAll(() => {
	// Set NODE_ENV to test
	process.env['NODE_ENV'] = 'test';
});