/**
 * Playwright Configuration for Visual Regression Testing
 * Focus on accessibility-related visual changes (focus states, contrast, etc.)
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  testMatch: '**/*.visual.test.ts',
  timeout: 30 * 1000,
  expect: {
    timeout: 10000,
    // Visual comparison settings
    threshold: 0.1, // 0.1% difference threshold for accessibility-focused tests
    toHaveScreenshot: { 
      threshold: 0.1,
      maxDiffPixels: 100,
      animations: 'disabled',
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report-visual', open: 'never' }],
    ['junit', { outputFile: 'test-results/visual-results.xml' }],
    ['json', { outputFile: 'test-results/visual-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Ensure consistent rendering for visual tests
    actionTimeout: 2000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop visual testing
    {
      name: 'desktop-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1, // Ensure consistent pixel rendering
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-background-mode',
            '--font-render-hinting=none', // Consistent font rendering
            '--disable-font-subpixel-positioning',
            '--disable-lcd-text',
          ],
        },
      },
      testDir: './tests/visual',
    },

    // Focus state visual testing
    {
      name: 'focus-states',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: [
            '--disable-web-security',
            '--force-prefers-reduced-motion', // Disable animations for consistent focus testing
            '--disable-background-mode',
          ],
        },
      },
      testDir: './tests/visual/focus',
    },

    // High contrast visual testing
    {
      name: 'high-contrast-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark',
        launchOptions: {
          args: [
            '--force-dark-mode',
            '--enable-features=WebContentsForceDarkMode',
            '--disable-web-security',
          ],
        },
      },
      testDir: './tests/visual/themes',
    },

    // Mobile visual testing
    {
      name: 'mobile-visual',
      use: {
        ...devices['iPhone 12'],
        deviceScaleFactor: 1, // Override device scale for consistent screenshots
      },
      testDir: './tests/visual/responsive',
    },

    // Tablet visual testing
    {
      name: 'tablet-visual',
      use: {
        ...devices['iPad Pro'],
        deviceScaleFactor: 1,
      },
      testDir: './tests/visual/responsive',
    },
  ],

  webServer: {
    command: 'pnpm storybook',
    port: 6006,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});