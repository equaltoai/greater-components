/**
 * Playwright Configuration for Accessibility Testing
 * Comprehensive configuration for running accessibility tests across all components
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/a11y',
  testMatch: '**/*.a11y.test.ts',
  timeout: 60 * 1000, // Increased timeout for accessibility tests
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report-a11y', open: 'never' }],
    ['junit', { outputFile: 'test-results/a11y-results.xml' }],
    ['json', { outputFile: 'test-results/a11y-results.json' }],
    ['./accessibility-reporter.ts'], // Custom accessibility reporter
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Accessibility-specific settings
    actionTimeout: 5000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        // Enhanced for accessibility testing
        launchOptions: {
          args: [
            '--force-prefers-reduced-motion',
            '--force-color-profile=srgb',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-popup-blocking',
            '--disable-background-mode',
          ],
        },
      },
      testDir: './tests/a11y',
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'ui.prefersReducedMotion': 1,
            'browser.display.document_color_use': 1,
            'browser.display.use_system_colors': true,
          },
        },
      },
      testDir: './tests/a11y',
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
      },
      testDir: './tests/a11y',
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
      testDir: './tests/a11y',
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
      testDir: './tests/a11y',
    },

    // High contrast testing
    {
      name: 'high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        extraHTTPHeaders: {
          'Sec-CH-Prefers-Color-Scheme': 'dark',
        },
        launchOptions: {
          args: [
            '--force-dark-mode',
            '--enable-features=WebContentsForceDarkMode',
            '--force-prefers-reduced-motion',
          ],
        },
      },
      testDir: './tests/a11y',
    },

    // Reduced motion testing
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--force-prefers-reduced-motion',
          ],
        },
      },
      testDir: './tests/a11y',
    },
  ],

  webServer: {
    command: 'pnpm storybook',
    port: 6006,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});