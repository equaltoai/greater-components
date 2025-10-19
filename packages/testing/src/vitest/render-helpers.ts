/**
 * Vitest Render Helpers
 * Utilities for rendering components with theme and accessibility context
 */

import { render, type RenderOptions } from '@testing-library/svelte';
import { vi } from 'vitest';

type RenderableComponent = Parameters<typeof render>[0];
type ComponentInput = Parameters<typeof render>[1];

export interface ThemeContextOptions {
  theme: 'light' | 'dark' | 'high-contrast';
  density: 'compact' | 'comfortable' | 'spacious';
  direction: 'ltr' | 'rtl';
  reducedMotion: boolean;
  highContrast: boolean;
  lang: string;
}

type ThemeOption = ThemeContextOptions['theme'];
type DensityOption = ThemeContextOptions['density'];

/**
 * Create theme context wrapper
 */
export function createThemeContextWrapper(options: Partial<ThemeContextOptions> = {}) {
  const defaultOptions: ThemeContextOptions = {
    theme: 'light',
    density: 'comfortable',
    direction: 'ltr',
    reducedMotion: false,
    highContrast: false,
    lang: 'en',
    ...options,
  };
  
  return function ThemeContextWrapper(props: { children: unknown }): unknown {
    // This would typically be a Svelte component that provides theme context
    // For testing, we'll set up the environment directly
    
    // Set document attributes
    document.documentElement.setAttribute('data-theme', defaultOptions.theme);
    document.documentElement.setAttribute('data-density', defaultOptions.density);
    document.documentElement.setAttribute('dir', defaultOptions.direction);
    document.documentElement.setAttribute('lang', defaultOptions.lang);
    
    // Mock media queries
    const mediaQueries = {
      '(prefers-color-scheme: dark)': defaultOptions.theme === 'dark',
      '(prefers-reduced-motion: reduce)': defaultOptions.reducedMotion,
      '(prefers-contrast: high)': defaultOptions.highContrast,
    };
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: mediaQueries[query as keyof typeof mediaQueries] || false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
    
    return props.children;
  };
}

/**
 * Render component with theme context
 */
export function renderWithTheme(
  ComponentCtor: RenderableComponent,
  props?: ComponentInput,
  themeOptions?: Partial<ThemeContextOptions>,
  renderOptions?: RenderOptions
): ReturnType<typeof render> {
  // Create wrapper for theme context
  const applyThemeContext = createThemeContextWrapper(themeOptions);
  applyThemeContext({ children: null });
  
  return render(ComponentCtor, props, renderOptions) as unknown as ReturnType<typeof render>;
}

/**
 * Create mock theme store
 */
export function createMockThemeStore(initialTheme: string = 'light') {
  let currentTheme = initialTheme;
  const subscribers: Array<(theme: string) => void> = [];
  
  return {
    subscribe(callback: (theme: string) => void) {
      subscribers.push(callback);
      callback(currentTheme);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) subscribers.splice(index, 1);
      };
    },
    
    set(theme: string) {
      currentTheme = theme;
      subscribers.forEach(callback => callback(theme));
    },
    
    update(updater: (theme: string) => string) {
      this.set(updater(currentTheme));
    },
    
    get current() {
      return currentTheme;
    },
  };
}

/**
 * Create mock density store
 */
export function createMockDensityStore(initialDensity: string = 'comfortable') {
  let currentDensity = initialDensity;
  const subscribers: Array<(density: string) => void> = [];
  
  return {
    subscribe(callback: (density: string) => void) {
      subscribers.push(callback);
      callback(currentDensity);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) subscribers.splice(index, 1);
      };
    },
    
    set(density: string) {
      currentDensity = density;
      subscribers.forEach(callback => callback(density));
    },
    
    update(updater: (density: string) => string) {
      this.set(updater(currentDensity));
    },
    
    get current() {
      return currentDensity;
    },
  };
}

/**
 * Create mock accessibility preferences store
 */
export function createMockA11yPreferencesStore(initialPrefs: Partial<{
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: number;
  screenReader: boolean;
}> = {}) {
  const defaultPrefs = {
    reducedMotion: false,
    highContrast: false,
    fontSize: 16,
    screenReader: false,
    ...initialPrefs,
  };
  
  let currentPrefs = { ...defaultPrefs };
  const subscribers: Array<(prefs: typeof currentPrefs) => void> = [];
  
  return {
    subscribe(callback: (prefs: typeof currentPrefs) => void) {
      subscribers.push(callback);
      callback(currentPrefs);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) subscribers.splice(index, 1);
      };
    },
    
    set(prefs: typeof currentPrefs) {
      currentPrefs = { ...prefs };
      subscribers.forEach(callback => callback(currentPrefs));
    },
    
    update(updater: (prefs: typeof currentPrefs) => typeof currentPrefs) {
      this.set(updater(currentPrefs));
    },
    
    updatePreference<K extends keyof typeof currentPrefs>(
      key: K,
      value: typeof currentPrefs[K]
    ) {
      this.update(prefs => ({ ...prefs, [key]: value }));
    },
    
    get current() {
      return currentPrefs;
    },
  };
}

/**
 * Setup test environment with mocked stores
 */
export function setupTestEnvironment(options: {
  theme?: string;
  density?: string;
  a11yPrefs?: Parameters<typeof createMockA11yPreferencesStore>[0];
} = {}) {
  const themeStore = createMockThemeStore(options.theme);
  const densityStore = createMockDensityStore(options.density);
  const a11yPrefsStore = createMockA11yPreferencesStore(options.a11yPrefs);
  
  // Mock global stores if your components use them
  vi.mock('$lib/stores/theme', () => ({
    theme: themeStore,
  }));
  
  vi.mock('$lib/stores/density', () => ({
    density: densityStore,
  }));
  
  vi.mock('$lib/stores/a11y', () => ({
    a11yPreferences: a11yPrefsStore,
  }));
  
  return {
    themeStore,
    densityStore,
    a11yPrefsStore,
    cleanup: () => {
      vi.clearAllMocks();
    },
  };
}

/**
 * Create custom render function with all context
 */
export function createCustomRender(globalOptions: Partial<ThemeContextOptions> = {}) {
  return function customRender(
    ComponentCtor: RenderableComponent,
    props?: ComponentInput,
    options?: {
      theme?: Partial<ThemeContextOptions>;
      render?: RenderOptions;
    }
  ): ReturnType<typeof render> {
    const mergedThemeOptions = { ...globalOptions, ...options?.theme };
    
    return renderWithTheme(
      ComponentCtor,
      props,
      mergedThemeOptions,
      options?.render
    ) as unknown as ReturnType<typeof render>;
  };
}

/**
 * Test utilities for snapshot testing with themes
 */
export function createThemeSnapshots() {
  return {
    async captureThemeSnapshots(
      ComponentCtor: RenderableComponent,
      props?: ComponentInput,
      themes: ThemeOption[] = ['light', 'dark']
    ): Promise<Record<string, string>> {
      const snapshots: Record<string, string> = {};
      
      for (const theme of themes) {
        const { container } = renderWithTheme(ComponentCtor, props, { 
          theme 
        });
        
        // Wait for any async operations
        await new Promise(resolve => setTimeout(resolve, 0));
        
        snapshots[theme] = container.innerHTML;
      }
      
      return snapshots;
    },
    
    async captureDensitySnapshots(
      ComponentCtor: RenderableComponent,
      props?: ComponentInput,
      densities: DensityOption[] = ['compact', 'comfortable', 'spacious']
    ): Promise<Record<string, string>> {
      const snapshots: Record<string, string> = {};
      
      for (const density of densities) {
        const { container } = renderWithTheme(ComponentCtor, props, { 
          density 
        });
        
        // Wait for any async operations
        await new Promise(resolve => setTimeout(resolve, 0));
        
        snapshots[density] = container.innerHTML;
      }
      
      return snapshots;
    },
  };
}
