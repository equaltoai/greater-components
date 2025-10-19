/**
 * Vitest Component Testing Helpers
 * Utilities for testing Svelte components with accessibility focus
 */

import { render, cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';

type RenderableComponent = Parameters<typeof render>[0];
type ComponentInput = Parameters<typeof render>[1];

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

type ThemeOption = NonNullable<A11yRenderOptions['theme']>;
type DensityOption = NonNullable<A11yRenderOptions['density']>;

/**
 * Render component with accessibility context
 */
export function renderWithA11yContext(
  ComponentCtor: RenderableComponent,
  props?: ComponentInput,
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
  
  return (props !== undefined ? render(ComponentCtor, props) : render(ComponentCtor)) as unknown as ReturnType<
    typeof render
  >;
}

/**
 * Test component across different themes
 */
export async function testComponentThemes(
  ComponentCtor: RenderableComponent,
  props: ComponentInput,
  testFn: (container: HTMLElement, theme: ThemeOption) => void | Promise<void>,
  themes: ThemeOption[] = ['light', 'dark']
): Promise<void> {
  for (const theme of themes) {
    const { container } = renderWithA11yContext(ComponentCtor, props, { theme });
    
    await testFn(container, theme);
    cleanup();
  }
}

/**
 * Test component across different densities
 */
export async function testComponentDensities(
  ComponentCtor: RenderableComponent,
  props: ComponentInput,
  testFn: (container: HTMLElement, density: DensityOption) => void | Promise<void>,
  densities: DensityOption[] = ['compact', 'comfortable', 'spacious']
): Promise<void> {
  for (const density of densities) {
    const { container } = renderWithA11yContext(ComponentCtor, props, { density });
    
    await testFn(container, density);
    cleanup();
  }
}

/**
 * Create mock accessibility context
 */
export function createMockA11yContext(
  overrides: Partial<A11yRenderOptions> = {}
): A11yRenderOptions {
  return {
    theme: 'light',
    density: 'comfortable',
    reducedMotion: false,
    highContrast: false,
    direction: 'ltr',
    lang: 'en',
    ...overrides,
  };
}

/**
 * Setup global accessibility testing environment
 */
export function setupA11yTestEnvironment() {
  // Mock IntersectionObserver
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin = '0px';
    readonly thresholds: ReadonlyArray<number> = [0];
    constructor(_callback: IntersectionObserverCallback) {}
    observe(_target: Element): void {}
    unobserve(_target: Element): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver as typeof IntersectionObserver;
  
  // Mock ResizeObserver
  class MockResizeObserver implements ResizeObserver {
    constructor(_callback: ResizeObserverCallback) {}
    observe(_target: Element, _options?: ResizeObserverOptions): void {}
    unobserve(_target: Element): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = MockResizeObserver as typeof ResizeObserver;
  
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
export async function createComponentMocks() {
  const { vi } = await import('vitest');
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
