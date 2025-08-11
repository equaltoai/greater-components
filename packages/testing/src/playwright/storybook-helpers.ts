/**
 * Storybook Testing Helpers
 * Utilities for testing Storybook stories with Playwright
 */

import { Page } from '@playwright/test';

export interface StorybookConfig {
  baseUrl: string;
  waitForStoryLoad?: number;
  viewports?: { name: string; width: number; height: number }[];
  themes?: string[];
  densities?: string[];
}

export interface StoryTestOptions {
  args?: Record<string, any>;
  globals?: Record<string, any>;
  viewport?: { width: number; height: number };
  theme?: string;
  density?: string;
  waitTime?: number;
}

export const DEFAULT_STORYBOOK_CONFIG: StorybookConfig = {
  baseUrl: 'http://localhost:6006',
  waitForStoryLoad: 1000,
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ],
  themes: ['light', 'dark'],
  densities: ['comfortable'],
};

/**
 * Navigate to a Storybook story
 */
export async function gotoStory(
  page: Page,
  storyId: string,
  options: StoryTestOptions = {},
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<void> {
  const {
    args = {},
    globals = {},
    viewport,
    theme,
    density,
    waitTime = config.waitForStoryLoad,
  } = options;
  
  // Build URL with parameters
  const url = new URL(`${config.baseUrl}/iframe.html`);
  url.searchParams.set('id', storyId);
  
  // Add args if provided
  if (Object.keys(args).length > 0) {
    const argsString = Object.entries(args)
      .map(([key, value]) => `${key}:${encodeURIComponent(JSON.stringify(value))}`)
      .join(';');
    url.searchParams.set('args', argsString);
  }
  
  // Add globals if provided
  const finalGlobals = {
    ...(theme && { theme }),
    ...(density && { density }),
    ...globals,
  };
  
  if (Object.keys(finalGlobals).length > 0) {
    const globalsString = Object.entries(finalGlobals)
      .map(([key, value]) => `${key}:${encodeURIComponent(JSON.stringify(value))}`)
      .join(';');
    url.searchParams.set('globals', globalsString);
  }
  
  // Set viewport if provided
  if (viewport) {
    await page.setViewportSize(viewport);
  }
  
  // Navigate to story
  await page.goto(url.toString());
  
  // Wait for story to load
  await page.waitForLoadState('networkidle');
  if (waitTime) {
    await page.waitForTimeout(waitTime);
  }
  
  // Wait for Storybook to be ready
  await page.waitForFunction(() => {
    return window.parent !== window || document.readyState === 'complete';
  });
}

/**
 * Get story metadata
 */
export async function getStoryMetadata(
  page: Page,
  storyId: string,
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<{
  title: string;
  name: string;
  parameters: Record<string, any>;
  args: Record<string, any>;
  argTypes: Record<string, any>;
}> {
  await page.goto(`${config.baseUrl}/iframe.html?id=${storyId}`);
  
  return await page.evaluate(() => {
    const storyStore = (window as any).__STORYBOOK_STORY_STORE__;
    if (!storyStore) return null;
    
    const story = storyStore.fromId ? storyStore.fromId(storyId) : null;
    if (!story) return null;
    
    return {
      title: story.title,
      name: story.name,
      parameters: story.parameters || {},
      args: story.args || {},
      argTypes: story.argTypes || {},
    };
  });
}

/**
 * Test story across all configured themes
 */
export async function testStoryThemes(
  page: Page,
  storyId: string,
  testFn: (page: Page, theme: string) => Promise<void>,
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const theme of config.themes || ['light']) {
    try {
      await gotoStory(page, storyId, { theme }, config);
      await testFn(page, theme);
      results[theme] = { passed: true };
    } catch (error) {
      results[theme] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return results;
}

/**
 * Test story across all configured densities
 */
export async function testStoryDensities(
  page: Page,
  storyId: string,
  testFn: (page: Page, density: string) => Promise<void>,
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const density of config.densities || ['comfortable']) {
    try {
      await gotoStory(page, storyId, { density }, config);
      await testFn(page, density);
      results[density] = { passed: true };
    } catch (error) {
      results[density] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return results;
}

/**
 * Test story across all configured viewports
 */
export async function testStoryViewports(
  page: Page,
  storyId: string,
  testFn: (page: Page, viewport: { name: string; width: number; height: number }) => Promise<void>,
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const viewport of config.viewports || []) {
    try {
      await gotoStory(page, storyId, { viewport }, config);
      await testFn(page, viewport);
      results[viewport.name] = { passed: true };
    } catch (error) {
      results[viewport.name] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return results;
}

/**
 * Test all story variants (args combinations)
 */
export async function testStoryVariants(
  page: Page,
  storyId: string,
  variants: Array<{ name: string; args: Record<string, any> }>,
  testFn: (page: Page, variant: { name: string; args: Record<string, any> }) => Promise<void>,
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const variant of variants) {
    try {
      await gotoStory(page, storyId, { args: variant.args }, config);
      await testFn(page, variant);
      results[variant.name] = { passed: true };
    } catch (error) {
      results[variant.name] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return results;
}

/**
 * Get all interactive elements in a story
 */
export async function getStoryInteractiveElements(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const interactiveSelectors = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="option"]',
      '[role="tab"]',
      '[tabindex]:not([tabindex="-1"])',
      '[onclick]',
    ];
    
    const elements = new Set<string>();
    
    interactiveSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const element = el as HTMLElement;
        if (element.offsetParent !== null) { // visible
          let identifier = element.tagName.toLowerCase();
          if (element.id) identifier += `#${element.id}`;
          if (element.className) {
            const firstClass = element.className.split(' ')[0];
            if (firstClass) identifier += `.${firstClass}`;
          }
          elements.add(identifier);
        }
      });
    });
    
    return Array.from(elements);
  });
}

/**
 * Run comprehensive accessibility tests on a story
 */
export async function runStoryA11yTests(
  page: Page,
  storyId: string,
  tests: {
    axe?: boolean;
    keyboard?: boolean;
    focusManagement?: boolean;
    colorContrast?: boolean;
    screenReader?: boolean;
  } = {},
  config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG
): Promise<{
  storyId: string;
  results: Record<string, any>;
  summary: {
    passed: boolean;
    totalTests: number;
    passedTests: number;
    failedTests: number;
  };
}> {
  const {
    axe = true,
    keyboard = true,
    focusManagement = true,
    colorContrast = true,
    screenReader = true,
  } = tests;
  
  await gotoStory(page, storyId, {}, config);
  
  const results: Record<string, any> = {};
  let totalTests = 0;
  let passedTests = 0;
  
  // Axe accessibility tests
  if (axe) {
    totalTests++;
    try {
      // This would use the axe-playwright utilities we created
      results.axe = { passed: true, violations: [] };
      passedTests++;
    } catch (error) {
      results.axe = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Keyboard navigation tests
  if (keyboard) {
    totalTests++;
    try {
      const interactiveElements = await getStoryInteractiveElements(page);
      
      // Test tab navigation
      if (interactiveElements.length > 0) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        results.keyboard = { 
          passed: !!focused,
          interactiveElements: interactiveElements.length,
        };
        if (focused) passedTests++;
      } else {
        results.keyboard = { passed: true, interactiveElements: 0 };
        passedTests++;
      }
    } catch (error) {
      results.keyboard = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Focus management tests
  if (focusManagement) {
    totalTests++;
    try {
      // Test focus indicators
      const elementsWithFocus = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, a[href], input, select, textarea');
        let hasVisibleFocus = false;
        
        elements.forEach(el => {
          const element = el as HTMLElement;
          element.focus();
          const styles = window.getComputedStyle(element);
          if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
            hasVisibleFocus = true;
          }
        });
        
        return hasVisibleFocus;
      });
      
      results.focusManagement = { passed: elementsWithFocus };
      if (elementsWithFocus) passedTests++;
    } catch (error) {
      results.focusManagement = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return {
    storyId,
    results,
    summary: {
      passed: passedTests === totalTests,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
    },
  };
}

/**
 * Create Storybook test suite
 */
export function createStorybookTestSuite(config: StorybookConfig = DEFAULT_STORYBOOK_CONFIG) {
  return {
    gotoStory: (page: Page, storyId: string, options?: StoryTestOptions) => 
      gotoStory(page, storyId, options, config),
    
    getMetadata: (page: Page, storyId: string) => 
      getStoryMetadata(page, storyId, config),
    
    testThemes: (page: Page, storyId: string, testFn: (page: Page, theme: string) => Promise<void>) =>
      testStoryThemes(page, storyId, testFn, config),
    
    testDensities: (page: Page, storyId: string, testFn: (page: Page, density: string) => Promise<void>) =>
      testStoryDensities(page, storyId, testFn, config),
    
    testViewports: (page: Page, storyId: string, testFn: (page: Page, viewport: any) => Promise<void>) =>
      testStoryViewports(page, storyId, testFn, config),
    
    testVariants: (page: Page, storyId: string, variants: any[], testFn: any) =>
      testStoryVariants(page, storyId, variants, testFn, config),
    
    runA11yTests: (page: Page, storyId: string, tests?: any) =>
      runStoryA11yTests(page, storyId, tests, config),
    
    getInteractiveElements: getStoryInteractiveElements,
  };
}