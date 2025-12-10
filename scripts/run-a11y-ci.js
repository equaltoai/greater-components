#!/usr/bin/env node
/**
 * Aligns pnpm test:a11y:ci with the GitHub Actions workflow by running the same steps locally.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(
	path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
);
const baseEnv = {
	...process.env,
	CI: process.env.CI ?? 'true',
};

const steps = [
	{
		title: 'Build workspace packages',
		cmd: 'pnpm',
		args: ['build'],
	},
	{
		title: 'Install Playwright browsers',
		cmd: 'pnpm',
		args: [
			'--filter',
			'@equaltoai/greater-components-testing',
			'exec',
			'playwright',
			'install',
			'--with-deps',
		],
	},
	{
		title: 'Run accessibility matrix (themes x densities)',
		cmd: 'pnpm',
		args: ['test:a11y'],
	},
	{
		title: 'Check WCAG AA compliance (fail on critical/serious)',
		cmd: 'pnpm',
		args: [
			'--filter',
			'@equaltoai/greater-components-testing',
			'exec',
			'node',
			'scripts/check-a11y-compliance.js',
			'--results=test-results',
			'--standard=AA',
			'--fail-on-violations=critical,serious',
		],
	},
];

async function run() {
	for (const step of steps) {
		console.log(`\n▶ ${step.title}`);
		await runCommand(step);
	}
	console.log('\n✅ Finished running local accessibility CI workflow');
}

function runCommand({ cmd, args, env }) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			stdio: 'inherit',
			cwd: rootDir,
			env: { ...baseEnv, ...(env ?? {}) },
		});

		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
			}
		});
	});
}

run().catch((error) => {
	console.error('\n❌ Accessibility CI workflow failed');
	console.error(error.message);
	process.exit(1);
});
