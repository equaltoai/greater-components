import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/demo',
  timeout: 45 * 1000,
  expect: {
    timeout: 5 * 1000
  },
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/demo' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ],
  webServer: {
    command: 'pnpm --filter @equaltoai/playground dev -- --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: !process.env['CI'],
    timeout: 120 * 1000
  }
});
