import { afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Mock matchMedia
const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

// Mock localStorage
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

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestIdleCallback
// @ts-expect-error - Mock return type doesn't match exactly
global.requestIdleCallback = vi.fn((cb) => setTimeout(cb, 0));
global.cancelIdleCallback = vi.fn();

// Mock scroll-related APIs
global.HTMLElement.prototype.scrollIntoView = vi.fn();
global.HTMLElement.prototype.focus = vi.fn();
global.HTMLElement.prototype.blur = vi.fn();

// Mock HTMLDialogElement methods
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.open = true;
    };
  }

  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close() {
      this.open = false;
    };
  }
}

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
  configurable: true,
});

// Set up environment variables for testing
beforeAll(() => {
  process.env['NODE_ENV'] = 'test';
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});