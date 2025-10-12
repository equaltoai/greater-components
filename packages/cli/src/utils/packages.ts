/**
 * Package management utilities
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import type { ComponentDependency } from '../registry/index.js';

/**
 * Detect package manager
 */
export async function detectPackageManager(cwd: string): Promise<'pnpm' | 'yarn' | 'npm'> {
	// Check for lock files
	if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
		return 'pnpm';
	}

	if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
		return 'yarn';
	}

	return 'npm';
}

/**
 * Install dependencies
 */
export async function installDependencies(
	dependencies: ComponentDependency[],
	cwd: string,
	dev: boolean = false
): Promise<void> {
	if (dependencies.length === 0) {
		return;
	}

	const pm = await detectPackageManager(cwd);
	const packages = dependencies.map((dep) => `${dep.name}@${dep.version}`);

	const args: string[] = [];

	switch (pm) {
		case 'pnpm':
			args.push('add');
			if (dev) args.push('-D');
			args.push(...packages);
			break;

		case 'yarn':
			args.push('add');
			if (dev) args.push('--dev');
			args.push(...packages);
			break;

		case 'npm':
			args.push('install');
			if (dev) args.push('--save-dev');
			args.push(...packages);
			break;
	}

	await execa(pm, args, { cwd, stdio: 'inherit' });
}

/**
 * Check if dependency is installed
 */
export async function isDependencyInstalled(
	packageName: string,
	cwd: string
): Promise<boolean> {
	const packageJsonPath = path.join(cwd, 'package.json');

	if (!(await fs.pathExists(packageJsonPath))) {
		return false;
	}

	try {
		const content = await fs.readFile(packageJsonPath, 'utf-8');
		const pkg = JSON.parse(content);

		return !!(
			pkg.dependencies?.[packageName] ||
			pkg.devDependencies?.[packageName] ||
			pkg.peerDependencies?.[packageName]
		);
	} catch {
		return false;
	}
}

/**
 * Get missing dependencies
 */
export async function getMissingDependencies(
	dependencies: ComponentDependency[],
	cwd: string
): Promise<ComponentDependency[]> {
	const missing: ComponentDependency[] = [];

	for (const dep of dependencies) {
		if (!(await isDependencyInstalled(dep.name, cwd))) {
			missing.push(dep);
		}
	}

	return missing;
}

