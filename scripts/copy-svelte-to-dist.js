#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const packageRoot = process.cwd();
const srcDir = join(packageRoot, 'src');
const distDir = join(packageRoot, 'dist');

if (!existsSync(srcDir)) {
	console.error(`No src/ directory found at ${srcDir}`);
	process.exit(1);
}

if (!existsSync(distDir)) {
	console.error(`No dist/ directory found at ${distDir}. Run the package build first.`);
	process.exit(1);
}

function copySvelteFiles(currentDir) {
	for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
		if (entry.name === 'node_modules' || entry.name === '.git') continue;

		const entryPath = join(currentDir, entry.name);
		if (entry.isDirectory()) {
			copySvelteFiles(entryPath);
			continue;
		}

		if (!entry.isFile() || !entry.name.endsWith('.svelte')) continue;

		const relPath = relative(srcDir, entryPath);
		const destPath = join(distDir, relPath);
		mkdirSync(dirname(destPath), { recursive: true });
		copyFileSync(entryPath, destPath);

		// Copy generated type definitions alongside Svelte source, when present.
		for (const typeSuffix of ['.d.ts', '.d.ts.map']) {
			const typeSourcePath = `${entryPath}${typeSuffix}`;
			if (!existsSync(typeSourcePath)) continue;

			const typeRelPath = relative(srcDir, typeSourcePath);
			const typeDestPath = join(distDir, typeRelPath);
			mkdirSync(dirname(typeDestPath), { recursive: true });
			copyFileSync(typeSourcePath, typeDestPath);
		}
	}
}

copySvelteFiles(srcDir);
