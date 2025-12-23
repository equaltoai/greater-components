import fs from 'node:fs';
import path from 'node:path';

const LOCAL_REPO_ENV = 'GREATER_CLI_LOCAL_REPO_ROOT';

function isGreaterRepoRoot(dir: string): boolean {
	return (
		fs.existsSync(path.join(dir, 'registry', 'index.json')) &&
		fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) &&
		fs.existsSync(path.join(dir, 'packages', 'cli', 'package.json'))
	);
}

export function findLocalRepoRoot(startDir: string): string | null {
	let current = path.resolve(startDir);

	for (let depth = 0; depth < 25; depth++) {
		if (isGreaterRepoRoot(current)) return current;

		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}

	return null;
}

export function ensureLocalRepoRoot(startDir: string): string | null {
	const existing = process.env[LOCAL_REPO_ENV];
	if (existing) return existing;

	const detected = findLocalRepoRoot(startDir);
	if (!detected) return null;

	process.env[LOCAL_REPO_ENV] = detected;
	return detected;
}

