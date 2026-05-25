// Build the consolidated host-platform.css bundle from per-component CSS source files.
// Strict-CSP safe: only static CSS is concatenated.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const srcDir = join(packageRoot, 'src');
const distDir = join(packageRoot, 'dist');

if (!existsSync(distDir)) {
	mkdirSync(distDir, { recursive: true });
}

const parts = [];

const baseCss = join(srcDir, 'styles', 'base.css');
if (existsSync(baseCss)) {
	parts.push(readFileSync(baseCss, 'utf8'));
}

const componentsDir = join(srcDir, 'components');
if (existsSync(componentsDir)) {
	const files = readdirSync(componentsDir)
		.filter((name) => name.endsWith('.css'))
		.sort();
	for (const file of files) {
		parts.push(`/* ${file} */\n${readFileSync(join(componentsDir, file), 'utf8')}`);
	}
}

const bundle = parts.join('\n\n');
writeFileSync(join(distDir, 'host-platform.css'), bundle, 'utf8');

if (existsSync(componentsDir)) {
	const distComponentsDir = join(distDir, 'components');
	if (!existsSync(distComponentsDir)) {
		mkdirSync(distComponentsDir, { recursive: true });
	}
	for (const file of readdirSync(componentsDir)) {
		if (file.endsWith('.css')) {
			cpSync(join(componentsDir, file), join(distComponentsDir, file));
		}
	}
}

console.log(`[host-platform] wrote ${bundle.length} bytes to dist/host-platform.css`);
