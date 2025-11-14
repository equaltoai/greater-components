/**
 * File system utilities
 */

import fs from 'fs-extra';
import path from 'node:path';
import type { ComponentFile } from '../registry/index.js';

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
	await fs.ensureDir(dirPath);
}

/**
 * Write file with directory creation
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
	const dir = path.dirname(filePath);
	await ensureDir(dir);
	await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Read file
 */
export async function readFile(filePath: string): Promise<string> {
	return fs.readFile(filePath, 'utf-8');
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
	return fs.pathExists(filePath);
}

/**
 * Write component files to project
 */
export async function writeComponentFiles(
	files: ComponentFile[],
	targetDir: string
): Promise<void> {
	for (const file of files) {
		const filePath = path.join(targetDir, file.path);
		await writeFile(filePath, file.content);
	}
}

/**
 * Check if directory is a valid project root
 */
export async function isValidProject(cwd: string): Promise<boolean> {
	const packageJsonPath = path.join(cwd, 'package.json');
	return fileExists(packageJsonPath);
}

/**
 * Detect project type (SvelteKit, Vite, etc.)
 */
export async function detectProjectType(cwd: string): Promise<'sveltekit' | 'vite' | 'unknown'> {
	const packageJsonPath = path.join(cwd, 'package.json');

	if (!(await fileExists(packageJsonPath))) {
		return 'unknown';
	}

	try {
		const content = await readFile(packageJsonPath);
		const pkg = JSON.parse(content);

		if (pkg.dependencies?.['@sveltejs/kit'] || pkg.devDependencies?.['@sveltejs/kit']) {
			return 'sveltekit';
		}

		if (pkg.devDependencies?.['vite']) {
			return 'vite';
		}

		return 'unknown';
	} catch {
		return 'unknown';
	}
}

/**
 * Get Svelte version from package.json
 */
export async function getSvelteVersion(cwd: string): Promise<number | null> {
	const packageJsonPath = path.join(cwd, 'package.json');

	if (!(await fileExists(packageJsonPath))) {
		return null;
	}

	try {
		const content = await readFile(packageJsonPath);
		const pkg = JSON.parse(content);
		const svelteVersion = pkg.dependencies?.['svelte'] || pkg.devDependencies?.['svelte'];

		if (!svelteVersion) {
			return null;
		}

		// Extract major version
		const match = svelteVersion.match(/^\^?(\d+)\./);
		return match ? parseInt(match[1], 10) : null;
	} catch {
		return null;
	}
}
