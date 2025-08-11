import '@testing-library/jest-dom';

// Add vi to global scope for tests
import { vi } from 'vitest';
global.vi = vi;

// Mock dynamic imports for icon testing
vi.mock('../src/icons/*.svelte', () => {
  return {
    default: () => '<svg></svg>'
  };
});