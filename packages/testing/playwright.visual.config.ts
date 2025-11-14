import { defineConfig, devices } from '@playwright/test';

const baseCommand = 'pnpm --filter @equaltoai/playground dev --host 127.0.0.1 --port 4174';
const shouldForceCsr =
	process.env['PLAYGROUND_RUNTIME']?.toLowerCase() === 'csr' ||
	process.env['PLAYGROUND_CSR_ONLY'] === 'true';
const playgroundCommand = shouldForceCsr ? `${baseCommand} --mode csr` : baseCommand;

export default defineConfig({
	testDir: './tests/demo',
	timeout: 45 * 1000,
	expect: {
		timeout: 5 * 1000,
	},
	fullyParallel: true,
	retries: process.env['CI'] ? 1 : 0,
	workers: process.env['CI'] ? 2 : undefined,
	reporter: [
		['list'],
		['html', { outputFolder: 'playwright-report/visual' }],
	],
	use: {
		baseURL: 'http://127.0.0.1:4174',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'focus-states',
			use: {
				...devices['Desktop Chrome'],
			},
		},
		{
			name: 'high-contrast-visual',
			use: {
				...devices['Desktop Chrome'],
				colorScheme: 'dark',
			},
		},
	],
	webServer: {
		command: playgroundCommand,
		port: 4174,
		reuseExistingServer: !process.env['CI'],
		timeout: 180 * 1000,
	},
});
