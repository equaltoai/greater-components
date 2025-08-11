/**
 * Vitest Component Testing Helpers
 * Utilities for testing Svelte components with accessibility focus
 */

import { render, cleanup, type ComponentProps } from '@testing-library/svelte';
import { afterEach } from 'vitest';
import type { SvelteComponent } from 'svelte';

// Auto cleanup after each test
afterEach(() => {
  cleanup();
});

export interface A11yRenderOptions {
  theme?: 'light' | 'dark' | 'high-contrast';
  density?: 'compact' | 'comfortable' | 'spacious';
  reducedMotion?: boolean;
  highContrast?: boolean;
  direction?: 'ltr' | 'rtl';
  lang?: string;
}

/**
 * Render component with accessibility context
 */
export function renderWithA11yContext<T extends SvelteComponent>(
  Component: new (...args: any[]) => T,
  props?: ComponentProps<T>,
  options: A11yRenderOptions = {}
): ReturnType<typeof render> {
  const {
    theme = 'light',
    density = 'comfortable',
    reducedMotion = false,
    highContrast = false,
    direction = 'ltr',
    lang = 'en',
  } = options;
  
  // Set up document attributes for testing
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-density', density);
  document.documentElement.setAttribute('dir', direction);
  document.documentElement.setAttribute('lang', lang);
  
  // Apply media query preferences
  if (reducedMotion) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  }
  
  if (highContrast) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-contrast: high)' || 
                query === '(prefers-reduced-motion: reduce)' && reducedMotion,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  }
  
  return render(Component, { props: props as any });
}

/**
 * Test component across different themes
 */
export async function testComponentThemes<T extends SvelteComponent>(
  Component: new (...args: any[]) => T,
  props: ComponentProps<T>,
  testFn: (container: HTMLElement, theme: string) => void | Promise<void>,
  themes: string[] = ['light', 'dark']
): Promise<void> {
  for (const theme of themes) {
    const { container } = renderWithA11yContext(Component, props, { 
      theme: theme as 'light' | 'dark' 
    });
    
    await testFn(container, theme);
    cleanup();
  }
}

/**
 * Test component across different densities
 */
export async function testComponentDensities<T extends SvelteComponent>(
  Component: new (...args: any[]) => T,
  props: ComponentProps<T>,
  testFn: (container: HTMLElement, density: string) => void | Promise<void>,
  densities: string[] = ['compact', 'comfortable', 'spacious']
): Promise<void> {
  for (const density of densities) {
    const { container } = renderWithA11yContext(Component, props, { 
      density: density as 'compact' | 'comfortable' | 'spacious'
    });
    
    await testFn(container, density);
    cleanup();
  }
}

/**
 * Create mock accessibility context
 */
export function createMockA11yContext(overrides: Partial<A11yRenderOptions> = {}) {
  return {
    theme: 'light',
    density: 'comfortable',
    reducedMotion: false,
    highContrast: false,
    direction: 'ltr',
    lang: 'en',
    ...overrides,
  } as A11yRenderOptions;
}

/**
 * Setup global accessibility testing environment
 */
export function setupA11yTestEnvironment() {
  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any;
  
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any;
  
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
  
  // Mock getComputedStyle
  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: () => ({
      getPropertyValue: () => '',
      outline: 'none',
      outlineWidth: '0px',
      outlineStyle: 'none',
      outlineColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#000000',
      backgroundColor: '#ffffff',
    }),
  });
  
  // Mock focus/blur events
  HTMLElement.prototype.focus = function() {
    this.dispatchEvent(new Event('focus'));
  };
  
  HTMLElement.prototype.blur = function() {
    this.dispatchEvent(new Event('blur'));
  };
}

/**
 * Create test doubles for common component props
 */
export function createComponentMocks() {
  return {
    onClose: vi.fn(),
    onClick: vi.fn(),
    onFocus: vi.fn(),
    onBlur: vi.fn(),
    onKeyDown: vi.fn(),
    onKeyUp: vi.fn(),
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onSelect: vi.fn(),
    onToggle: vi.fn(),
  };
}

/**
 * Wait for component to be ready (animations, async operations)
 */
export async function waitForComponentReady(
  container: HTMLElement,
  timeout: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkReady = () => {
      // Check if any animations are running
      const animatingElements = container.querySelectorAll('*');
      const hasAnimations = Array.from(animatingElements).some(el => {
        const styles = getComputedStyle(el);
        return styles.animationName !== 'none' && styles.animationDuration !== '0s';
      });
      
      if (!hasAnimations || Date.now() - startTime > timeout) {
        resolve();
      } else {
        requestAnimationFrame(checkReady);
      }
    };
    
    requestAnimationFrame(checkReady);
  });
}