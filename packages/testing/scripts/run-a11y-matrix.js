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
			const normalizedTheme = theme.trim();
			const normalizedDensity = density.trim();
			console.log(
				`\n📋 Running accessibility tests (theme: ${normalizedTheme}, density: ${normalizedDensity})`
			);

			const jobs = [
				{
					label: 'Run Axe accessibility tests',
					args: [
						'--reporter=json',
						`--output=test-results/a11y-${normalizedTheme}-${normalizedDensity}`,
					],
				},
				{
					label: 'Run keyboard navigation tests',
					args: [
						'--grep=keyboard',
						'--reporter=json',
						`--output=test-results/keyboard-${normalizedTheme}-${normalizedDensity}`,
					],
				},
				{
					label: 'Run focus management tests',
					args: [
						'--reporter=json',
						`--output=test-results/focus-${normalizedTheme}-${normalizedDensity}`,
						'tests/a11y/focus.a11y.test.ts',
					],
				},
				{
					label: 'Run contrast tests',
					args: [
						'--reporter=json',
						`--output=test-results/contrast-${normalizedTheme}-${normalizedDensity}`,
						'tests/a11y/contrast.a11y.test.ts',
					],
				},
			];

			for (const job of jobs) {
				console.log(`→ ${job.label}`);
				await runPlaywright(normalizedTheme, normalizedDensity, job.args);
			}
		}
	}
}

function runPlaywright(theme, density, jobSpecificArgs = []) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'pnpm',
			[
				'exec',
				'playwright',
				'test',
				'--config=playwright.a11y.config.ts',
				'--project=chromium',
				...jobSpecificArgs,
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
