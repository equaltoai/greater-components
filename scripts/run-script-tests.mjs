import { spawnSync } from 'node:child_process';

const scripts = [
	'test:scripts:dco',
	'test:scripts:csp',
	'test:scripts:registry',
	'test:scripts:tokens',
	'test:scripts:generator-replay',
	'test:scripts:blog-dist-exports',
];
let failed = false;

for (const script of scripts) {
	const result = spawnSync(process.execPath, ['--run', script], { stdio: 'inherit' });

	if (result.error) {
		console.error(
			`[test:scripts] Failed to start ${script}: ${result.error.stack ?? result.error.message}`
		);
		failed = true;
		continue;
	}

	if (result.status !== 0) {
		failed = true;
	}
}

process.exitCode = failed ? 1 : 0;
