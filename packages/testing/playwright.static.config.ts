import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

type PlaygroundRuntime = 'ssr' | 'csr';

export function createDemoPlaywrightConfig(
	runtime: PlaygroundRuntime = 'ssr'
): PlaywrightTestConfig {
	const envRuntime = process.env['PLAYGROUND_RUNTIME']?.toLowerCase() === 'csr' ? 'csr' : null;
	const envToggle = process.env['PLAYGROUND_CSR_ONLY'] === 'true';
	const shouldForceCsr = runtime === 'csr' || envRuntime === 'csr' || envToggle;

	return defineConfig({
		testDir: './tests/demo',
		timeout: 45 * 1000,
		expect: {
			timeout: 5 * 1000,
		},
		fullyParallel: true,
		retries: process.env['CI'] ? 2 : 0,
		workers: process.env['CI'] ? 2 : undefined,
		reporter: [
			['list'],
			[
				'html',
				{
					outputFolder: runtime === 'csr' ? 'playwright-report/demo-csr' : 'playwright-report/demo',
				},
			],
		],
		use: {
			baseURL: 'http://127.0.0.1:8080',
			trace: 'on-first-retry',
		},
		projects: [
			{
				name: runtime === 'csr' ? 'csr-chromium' : 'chromium',
				use: { ...devices['Desktop Chrome'] },
			},
			{
				name: runtime === 'csr' ? 'csr-firefox' : 'firefox',
				use: { ...devices['Desktop Firefox'] },
			},
		],
	});
}

export default createDemoPlaywrightConfig();
