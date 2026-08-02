/**
 * Package management utilities
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { minVersion, satisfies } from 'semver';
import type { ComponentDependency } from '../registry/index.js';

export interface DependencyDeclarationStatus {
	installed: boolean;
	declaration?: string;
	floorCheckSkipped: boolean;
}

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

	// Fall back to package.json#packageManager (Corepack)
	const packageJsonPath = path.join(cwd, 'package.json');
	if (await fs.pathExists(packageJsonPath)) {
		try {
			const content = await fs.readFile(packageJsonPath, 'utf-8');
			const pkg = JSON.parse(content) as { packageManager?: unknown };
			if (typeof pkg.packageManager === 'string') {
				if (pkg.packageManager.startsWith('pnpm@')) return 'pnpm';
				if (pkg.packageManager.startsWith('yarn@')) return 'yarn';
				if (pkg.packageManager.startsWith('npm@')) return 'npm';
			}
		} catch {
			// Ignore and fall back to npm
		}
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
 * Check if dependency is installed at a compatible version.
 *
 * When no required version is provided, preserve the historical name-only check.
 * Non-semver declarations (for example workspace or git dependencies) also fall
 * back to name-only because their resolved versions are not available here.
 */
export async function getDependencyDeclarationStatus(
	packageName: string,
	cwd: string,
	requiredVersion?: string
): Promise<DependencyDeclarationStatus> {
	const packageJsonPath = path.join(cwd, 'package.json');

	if (!(await fs.pathExists(packageJsonPath))) {
		return { installed: false, floorCheckSkipped: false };
	}

	try {
		const content = await fs.readFile(packageJsonPath, 'utf-8');
		const pkg = JSON.parse(content) as {
			dependencies?: Record<string, string>;
			devDependencies?: Record<string, string>;
			peerDependencies?: Record<string, string>;
		};
		const installedVersion =
			pkg.dependencies?.[packageName] ||
			pkg.devDependencies?.[packageName] ||
			pkg.peerDependencies?.[packageName];

		if (!installedVersion) return { installed: false, floorCheckSkipped: false };
		if (!requiredVersion) {
			return { installed: true, declaration: installedVersion, floorCheckSkipped: false };
		}

		let installedFloor;
		try {
			installedFloor = minVersion(installedVersion);
		} catch {
			return { installed: true, declaration: installedVersion, floorCheckSkipped: true };
		}

		if (!installedFloor) {
			return { installed: true, declaration: installedVersion, floorCheckSkipped: true };
		}

		return {
			installed: satisfies(installedFloor, requiredVersion),
			declaration: installedVersion,
			floorCheckSkipped: false,
		};
	} catch {
		return { installed: false, floorCheckSkipped: false };
	}
}

export async function isDependencyInstalled(
	packageName: string,
	cwd: string,
	requiredVersion?: string
): Promise<boolean> {
	return (await getDependencyDeclarationStatus(packageName, cwd, requiredVersion)).installed;
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
		if (!(await isDependencyInstalled(dep.name, cwd, dep.version))) {
			missing.push(dep);
		}
	}

	return missing;
}
