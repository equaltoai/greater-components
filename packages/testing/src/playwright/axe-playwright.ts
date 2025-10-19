/**
 * Playwright Axe Integration
 * Utilities for running axe-core accessibility tests in Playwright
 */

import { Page, expect } from '@playwright/test';
import { injectAxe } from 'axe-playwright';
import type { AxeResults, ContextObject, RunOptions } from 'axe-core';
import {
  defaultAxeConfig,
  strictAxeConfig,
  themeConfigs,
  densityConfigs,
  formatAxeResults,
  type AxeTestOptions,
} from '../a11y/axe-helpers';

function cloneRunOptions(source: RunOptions): RunOptions {
  return {
    ...source,
    rules: source.rules ? { ...source.rules } : undefined,
    resultTypes: source.resultTypes ? [...source.resultTypes] : undefined,
  };
}

function mergeAxeConfigs(base: RunOptions, overrides?: AxeTestOptions | RunOptions): RunOptions {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    rules: { ...(base.rules ?? {}), ...(overrides.rules ?? {}) },
    runOnly: overrides.runOnly ?? base.runOnly,
    resultTypes: overrides.resultTypes
      ? [...overrides.resultTypes]
      : base.resultTypes
        ? [...base.resultTypes]
        : undefined,
  };
}

export interface PlaywrightAxeOptions {
  theme?: 'light' | 'dark' | 'highContrast';
  density?: 'compact' | 'comfortable' | 'spacious';
  standard?: 'AA' | 'AAA';
  include?: string[];
  exclude?: string[];
  tags?: string[];
  disableRules?: string[];
}

function createAxeContext(include?: string[], exclude?: string[]): ContextObject | undefined {
  if (!include && !exclude) return undefined;

  if (include && exclude) {
    return {
      include,
      exclude,
    } as ContextObject;
  }

  if (include) {
    return {
      include,
    } as ContextObject;
  }

  return {
    exclude: exclude!,
  } as ContextObject;
}

function createRunOptions(options: PlaywrightAxeOptions): RunOptions {
  const baseConfig = options.standard === 'AAA' ? strictAxeConfig : defaultAxeConfig;
  let runOptions = cloneRunOptions(baseConfig);

  if (options.theme && themeConfigs[options.theme]) {
    runOptions = mergeAxeConfigs(runOptions, themeConfigs[options.theme]);
  }

  if (options.density && densityConfigs[options.density]) {
    runOptions = mergeAxeConfigs(runOptions, densityConfigs[options.density]);
  }

  if (options.disableRules?.length) {
    const updatedRules = { ...(runOptions.rules ?? {}) };
    for (const rule of options.disableRules) {
      updatedRules[rule] = { enabled: false };
    }
    runOptions.rules = updatedRules;
  }

  if (options.tags) {
    runOptions.runOnly = {
      type: 'tag',
      values: options.tags,
    };
  }

  return runOptions;
}

/**
 * Setup axe for a Playwright page
 */
export async function setupAxe(
  page: Page,
  options: PlaywrightAxeOptions = {}
): Promise<RunOptions> {
  await injectAxe(page);
  return createRunOptions(options);
}

/**
 * Run accessibility tests on a page
 */
export async function runAxeTest(
  page: Page, 
  options: PlaywrightAxeOptions = {},
  presetRunOptions?: RunOptions
): Promise<AxeResults> {
  const runOptions = presetRunOptions ?? (await setupAxe(page, options));
  const context = createAxeContext(options.include, options.exclude);

  const payload = {
    context: context ?? null,
    options: runOptions,
  };

  const results = await page.evaluate<any, any>(
    async ({ context, options: evalOptions }: { context: unknown; options: unknown }) => {
      const axeWindow = window as any;
      return axeWindow.axe.run(context ?? undefined, evalOptions);
    },
    payload as any
  );

  return results as AxeResults;
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
  
  const runOptions = await setupAxe(page, axeOptions);
  const results = await runAxeTest(page, axeOptions, runOptions);
  
  if (detailedReport) {
    const formatted = formatAxeResults(results);
    console.warn('Accessibility Test Results:', JSON.stringify(formatted, null, 2));
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
