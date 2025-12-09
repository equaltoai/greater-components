#!/usr/bin/env node
import { spawn } from 'node:child_process';

const defaultThemes = ['light', 'dark', 'high-contrast'];
const defaultDensities = ['compact', 'comfortable', 'spacious'];

const themes = process.env.A11Y_THEMES ? process.env.A11Y_THEMES.split(',') : defaultThemes;
const densities = process.env.A11Y_DENSITIES
	? process.env.A11Y_DENSITIES.split(',')
	: defaultDensities;

const extraArgs = process.argv.slice(2).filter((arg) => arg !== '--');

async function run() {
	for (const theme of themes) {
		for (const density of densities) {
			console.log(`\n📋 Running accessibility tests (theme: ${theme}, density: ${density})`);
			await runPlaywright(theme.trim(), density.trim());
		}
	}
}

function runPlaywright(theme, density) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'pnpm',
			[
				'exec',
				'playwright',
				'test',
				'--config=playwright.a11y.config.ts',
				'--project=chromium',
				...extraArgs,
			],
			{
				stdio: 'inherit',
				env: {
					...process.env,
					TEST_THEME: theme,
					TEST_DENSITY: density,
				},
			}
		);

		child.on('close', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`Playwright exited with code ${code}`));
		});
	});
}

run().catch((error) => {
	console.error('\n❌ Accessibility tests failed');
	console.error(error.message);
	process.exit(1);
});
