/**
 * Playwright Axe Integration
 * Utilities for running axe-core accessibility tests in Playwright
 */

import { Page, expect } from '@playwright/test';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import type { AxeResults, RunOptions } from 'axe-core';
import { defaultAxeConfig, strictAxeConfig, themeConfigs, densityConfigs, formatAxeResults } from '../a11y/axe-helpers';

export interface PlaywrightAxeOptions {
  theme?: 'light' | 'dark' | 'highContrast';
  density?: 'compact' | 'comfortable' | 'spacious';
  standard?: 'AA' | 'AAA';
  include?: string[];
  exclude?: string[];
  tags?: string[];
  disableRules?: string[];
}

/**
 * Setup axe for a Playwright page
 */
export async function setupAxe(page: Page, options: PlaywrightAxeOptions = {}): Promise<void> {
  await injectAxe(page);
  
  // Get configuration based on options
  let config = options.standard === 'AAA' ? strictAxeConfig : defaultAxeConfig;
  
  // Apply theme-specific config
  if (options.theme && themeConfigs[options.theme]) {
    config = { ...config, ...themeConfigs[options.theme] };
  }
  
  // Apply density-specific config
  if (options.density && densityConfigs[options.density]) {
    config = { ...config, ...densityConfigs[options.density] };
  }
  
  // Disable specific rules if requested
  if (options.disableRules) {
    config.rules = config.rules || {};
    options.disableRules.forEach(rule => {
      config.rules![rule] = { enabled: false };
    });
  }
  
  // Configure custom tags if provided
  if (options.tags) {
    config.runOnly = {
      type: 'tag',
      values: options.tags,
    };
  }
  
  await configureAxe(page, config);
}

/**
 * Run accessibility tests on a page
 */
export async function runAxeTest(
  page: Page, 
  options: PlaywrightAxeOptions = {}
): Promise<AxeResults> {
  await setupAxe(page, options);
  
  return await page.evaluate(async (evalOptions) => {
    return await (window as any).axe.run({
      include: evalOptions.include,
      exclude: evalOptions.exclude,
    });
  }, {
    include: options.include,
    exclude: options.exclude,
  });
}

/**
 * Check accessibility and fail test if violations found
 */
export async function checkAccessibility(
  page: Page,
  options: PlaywrightAxeOptions & { 
    detailedReport?: boolean;
    failOnViolations?: boolean;
    maxViolations?: number;
  } = {}
): Promise<AxeResults> {
  const {
    detailedReport = false,
    failOnViolations = true,
    maxViolations = 0,
    ...axeOptions
  } = options;
  
  await setupAxe(page, axeOptions);
  
  const results = await runAxeTest(page, axeOptions);
  
  if (detailedReport) {
    const formatted = formatAxeResults(results);
    console.log('Accessibility Test Results:', JSON.stringify(formatted, null, 2));
  }
  
  if (failOnViolations && results.violations.length > maxViolations) {
    const violationSummary = results.violations.map(v => 
      `${v.id} (${v.impact}): ${v.description}`
    ).join('\n  ');
    
    expect(results.violations.length, 
      `Found ${results.violations.length} accessibility violations:\n  ${violationSummary}`
    ).toBeLessThanOrEqual(maxViolations);
  }
  
  return results;
}

/**
 * Test accessibility across multiple themes
 */
export async function testThemeAccessibility(
  page: Page,
  themes: ('light' | 'dark' | 'highContrast')[] = ['light', 'dark'],
  options: Omit<PlaywrightAxeOptions, 'theme'> = {}
): Promise<Record<string, AxeResults>> {
  const results: Record<string, AxeResults> = {};
  
  for (const theme of themes) {
    // Switch to theme (assuming there's a theme switcher)
    await page.evaluate((themeName) => {
      document.documentElement.setAttribute('data-theme', themeName);
    }, theme);
    
    // Wait for theme to apply
    await page.waitForTimeout(500);
    
    // Run accessibility test
    results[theme] = await runAxeTest(page, { ...options, theme });
  }
  
  return results;
}

/**
 * Test accessibility across multiple densities
 */
export async function testDensityAccessibility(
  page: Page,
  densities: ('compact' | 'comfortable' | 'spacious')[] = ['compact', 'comfortable', 'spacious'],
  options: Omit<PlaywrightAxeOptions, 'density'> = {}
): Promise<Record<string, AxeResults>> {
  const results: Record<string, AxeResults> = {};
  
  for (const density of densities) {
    // Switch to density (assuming there's a density switcher)
    await page.evaluate((densityName) => {
      document.documentElement.setAttribute('data-density', densityName);
    }, density);
    
    // Wait for density to apply
    await page.waitForTimeout(500);
    
    // Run accessibility test
    results[density] = await runAxeTest(page, { ...options, density });
  }
  
  return results;
}

/**
 * Test accessibility across multiple viewport sizes
 */
export async function testViewportAccessibility(
  page: Page,
  viewports: { name: string; width: number; height: number }[] = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ],
  options: PlaywrightAxeOptions = {}
): Promise<Record<string, AxeResults>> {
  const results: Record<string, AxeResults> = {};
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500);
    
    results[viewport.name] = await runAxeTest(page, options);
  }
  
  return results;
}

/**
 * Test accessibility for interactive states
 */
export async function testInteractiveStateAccessibility(
  page: Page,
  selector: string,
  options: PlaywrightAxeOptions = {}
): Promise<{
  default: AxeResults;
  hover: AxeResults;
  focus: AxeResults;
  active?: AxeResults;
}> {
  const element = page.locator(selector);
  
  // Default state
  const defaultResults = await runAxeTest(page, options);
  
  // Hover state
  await element.hover();
  await page.waitForTimeout(100);
  const hoverResults = await runAxeTest(page, options);
  
  // Focus state
  await element.focus();
  await page.waitForTimeout(100);
  const focusResults = await runAxeTest(page, options);
  
  // Active state (if clickable)
  let activeResults: AxeResults | undefined;
  const isClickable = await element.evaluate((el) => {
    return el.tagName === 'BUTTON' || el.tagName === 'A' || el.onclick !== null;
  });
  
  if (isClickable) {
    await page.mouse.down();
    await page.waitForTimeout(100);
    activeResults = await runAxeTest(page, options);
    await page.mouse.up();
  }
  
  return {
    default: defaultResults,
    hover: hoverResults,
    focus: focusResults,
    ...(activeResults && { active: activeResults }),
  };
}

/**
 * Generate comprehensive accessibility report
 */
export async function generateA11yReport(
  page: Page,
  options: {
    themes?: ('light' | 'dark' | 'highContrast')[];
    densities?: ('compact' | 'comfortable' | 'spacious')[];
    viewports?: { name: string; width: number; height: number }[];
    testName?: string;
  } = {}
): Promise<{
  summary: {
    totalTests: number;
    totalViolations: number;
    criticalViolations: number;
    wcagCompliant: boolean;
  };
  results: {
    themes: Record<string, AxeResults>;
    densities: Record<string, AxeResults>;
    viewports: Record<string, AxeResults>;
  };
}> {
  const {
    themes = ['light', 'dark'],
    densities = ['comfortable'],
    viewports = [{ name: 'desktop', width: 1280, height: 720 }],
    testName = 'component',
  } = options;
  
  const results = {
    themes: await testThemeAccessibility(page, themes),
    densities: await testDensityAccessibility(page, densities),
    viewports: await testViewportAccessibility(page, viewports),
  };
  
  // Calculate summary
  const allResults = [
    ...Object.values(results.themes),
    ...Object.values(results.densities),
    ...Object.values(results.viewports),
  ];
  
  const totalViolations = allResults.reduce((acc, r) => acc + r.violations.length, 0);
  const criticalViolations = allResults.reduce((acc, r) => 
    acc + r.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length, 0
  );
  
  const summary = {
    totalTests: allResults.length,
    totalViolations,
    criticalViolations,
    wcagCompliant: criticalViolations === 0,
  };
  
  return { summary, results };
}

/**
 * Create axe test helper for Storybook
 */
export function createStorybookAxeTest(
  baseUrl: string = 'http://localhost:6006'
) {
  return {
    async testStory(
      page: Page,
      storyPath: string,
      options: PlaywrightAxeOptions = {}
    ): Promise<AxeResults> {
      const url = `${baseUrl}/iframe.html?id=${storyPath}`;
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      return await runAxeTest(page, options);
    },
    
    async testAllStoryVariants(
      page: Page,
      storyPath: string,
      variants: string[] = [],
      options: PlaywrightAxeOptions = {}
    ): Promise<Record<string, AxeResults>> {
      const results: Record<string, AxeResults> = {};
      
      for (const variant of variants) {
        const url = `${baseUrl}/iframe.html?id=${storyPath}&args=${variant}`;
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        results[variant] = await runAxeTest(page, options);
      }
      
      return results;
    }
  };
}