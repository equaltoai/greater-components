/**
 * Package management utilities
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { minVersion, satisfies } from 'semver';
import type { ComponentDependency } from '../registry/index.js';

export interface DependencyDeclarationStatus {
	present: boolean;
	installed: boolean;
	declaration?: string;
	floorCheckSkipped: boolean;
}

export interface DependencyManifestDrift {
	dependency: ComponentDependency;
	declaration: string;
}

export interface DependencyInstallPlan {
	missing: ComponentDependency[];
	drift: DependencyManifestDrift[];
}

export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun' | 'deno';

/**
 * Detect package manager
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
	// Check for lock files
	if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
		return 'pnpm';
	}

	if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
		return 'yarn';
	}

	if (
		(await fs.pathExists(path.join(cwd, 'bun.lock'))) ||
		(await fs.pathExists(path.join(cwd, 'bun.lockb')))
	) {
		return 'bun';
	}

	if (await fs.pathExists(path.join(cwd, 'deno.lock'))) {
		return 'deno';
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
				if (pkg.packageManager.startsWith('bun@')) return 'bun';
				if (pkg.packageManager.startsWith('deno@')) return 'deno';
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

		case 'bun':
			args.push('add');
			if (dev) args.push('--dev');
			args.push(...packages);
			break;

		case 'deno':
			args.push('add');
			if (dev) args.push('--dev');
			args.push(...packages.map((packageSpec) => `npm:${packageSpec}`));
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
		return { present: false, installed: false, floorCheckSkipped: false };
	}

	try {
		const content = await fs.readFile(packageJsonPath, 'utf-8');
		const pkg = JSON.parse(content) as {
			dependencies?: Record<string, string>;
			devDependencies?: Record<string, string>;
			peerDependencies?: Record<string, string>;
			optionalDependencies?: Record<string, string>;
		};
		const installedVersion =
			pkg.dependencies?.[packageName] ||
			pkg.devDependencies?.[packageName] ||
			pkg.peerDependencies?.[packageName] ||
			pkg.optionalDependencies?.[packageName];

		if (!installedVersion) {
			return { present: false, installed: false, floorCheckSkipped: false };
		}
		if (!requiredVersion) {
			return {
				present: true,
				installed: true,
				declaration: installedVersion,
				floorCheckSkipped: false,
			};
		}

		let installedFloor;
		try {
			installedFloor = minVersion(installedVersion);
		} catch {
			return {
				present: true,
				installed: true,
				declaration: installedVersion,
				floorCheckSkipped: true,
			};
		}

		if (!installedFloor) {
			return {
				present: true,
				installed: true,
				declaration: installedVersion,
				floorCheckSkipped: true,
			};
		}

		return {
			present: true,
			installed: satisfies(installedFloor, requiredVersion),
			declaration: installedVersion,
			floorCheckSkipped: false,
		};
	} catch {
		return { present: false, installed: false, floorCheckSkipped: false };
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
	return (await getDependencyInstallPlan(dependencies, cwd)).missing;
}

/**
 * Separate dependencies absent from package.json from consumer-owned declarations
 * that do not satisfy Greater's required floor. Only absent dependencies are safe
 * for the CLI to install; package managers would otherwise rewrite the declaration.
 */
export async function getDependencyInstallPlan(
	dependencies: ComponentDependency[],
	cwd: string
): Promise<DependencyInstallPlan> {
	const plan: DependencyInstallPlan = { missing: [], drift: [] };

	for (const dep of dependencies) {
		const status = await getDependencyDeclarationStatus(dep.name, cwd, dep.version);
		if (!status.present) {
			plan.missing.push(dep);
		} else if (!status.installed && status.declaration) {
			plan.drift.push({ dependency: dep, declaration: status.declaration });
		}
	}

	return plan;
}
