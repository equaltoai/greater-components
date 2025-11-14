import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const playgroundDir = path.resolve(projectDir, '..');
const outDir = path.resolve(playgroundDir, 'build');
const clientDir = path.resolve(playgroundDir, '.svelte-kit/output/client');
const pagesDir = path.resolve(playgroundDir, '.svelte-kit/output/prerendered/pages');

/**
 * @param {string} source
 * @param {string} destination
 */
const copyRecursive = (source, destination) => {
	if (!fs.existsSync(source)) {
		return;
	}

	fs.cpSync(source, destination, { recursive: true, dereference: true });
};

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

copyRecursive(clientDir, outDir);
copyRecursive(pagesDir, outDir);

console.log(`Static build prepared at ${outDir}`);
