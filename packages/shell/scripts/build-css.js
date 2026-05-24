// Build the consolidated shell.css bundle from per-component CSS source files.
// Strict-CSP safe: only static CSS is concatenated; no eval or runtime style generation.

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

/**
 * Collect CSS files under src/ in a stable order:
 * 1. src/styles/base.css (foundational reset + tokens)
 * 2. src/components/*.css (per-component styles in alphabetical order)
 */
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
writeFileSync(join(distDir, 'shell.css'), bundle, 'utf8');

// Also copy the raw base.css and any per-component CSS for consumers who want granular imports.
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

console.log(`[shell] wrote ${bundle.length} bytes to dist/shell.css`);
