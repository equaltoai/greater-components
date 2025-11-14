import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');
const workspaceRoot = join(packageRoot, '..');
const repoRoot = join(workspaceRoot, '..');
const distDir = join(packageRoot, 'dist');

const packages = [
	{ key: 'adapters', dir: 'adapters' },
	{ key: 'fediverse', dir: 'fediverse' },
	{ key: 'headless', dir: 'headless' },
	{ key: 'icons', dir: 'icons' },
	{ key: 'primitives', dir: 'primitives' },
	{ key: 'tokens', dir: 'tokens' },
	{ key: 'utils', dir: 'utils' },
	{ key: 'testing', dir: 'testing' },
	{ key: 'cli', dir: 'cli' },
];

function ensureBuilt(sourceDir) {
	if (!existsSync(sourceDir)) {
		throw new Error(
			`Expected build output missing at ${sourceDir}. Run "pnpm -r build" before building greater-components.`
		);
	}
}

function copyPackageOutput() {
	rmSync(distDir, { recursive: true, force: true });
	mkdirSync(distDir, { recursive: true });

	for (const { key, dir } of packages) {
		const source = join(workspaceRoot, dir, 'dist');
		ensureBuilt(source);
		const destination = join(distDir, key);
		cpSync(source, destination, { recursive: true });

		// Also copy src for packages that export source files
		const srcSource = join(workspaceRoot, dir, 'src');
		if (existsSync(srcSource)) {
			const srcDest = join(distDir, key, 'src');
			cpSync(srcSource, srcDest, { recursive: true });
		}
	}
}

function generateRootBarrels() {
	const entryTargets = packages.map(({ key }) => `export * from './${key}/index.js';`).join('\n');

	const entryTypes = packages.map(({ key }) => `export * from './${key}/index.js';`).join('\n');

	writeFileSync(join(distDir, 'index.js'), `${entryTargets}\n`, 'utf8');
	writeFileSync(join(distDir, 'index.d.ts'), `${entryTypes}\n`, 'utf8');
}

copyPackageOutput();
generateRootBarrels();

const licenseSource = join(repoRoot, 'LICENSE');
if (existsSync(licenseSource)) {
	cpSync(licenseSource, join(packageRoot, 'LICENSE'));
}

console.log('greater-components build complete.');
