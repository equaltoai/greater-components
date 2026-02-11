/**
 * Registry Path → Local Install Path
 *
 * Components in the CLI registry use virtual paths to map to monorepo source files (e.g. `lib/components/...`).
 * This module converts those virtual paths into consumer-project filesystem paths based on `components.json`.
 */

import type { ComponentConfig } from './config.js';
import { resolveAlias } from './config.js';
import { resolvePathWithinDir } from './path-safety.js';

export interface InstallTarget {
	/** Absolute base directory to write into */
	targetDir: string;
	/** Relative path within targetDir */
	relativePath: string;
}

export function normalizeRegistryPath(filePath: string): string {
	return filePath.replace(/\\/g, '/').replace(/^\/+/, '');
}

/**
 * Resolve where a registry file should be installed locally.
 *
 * - `lib/...` is installed relative to `aliases.lib` (default: `$lib`)
 * - `shared/...` is installed relative to `aliases.components` (default: `$lib/components`)
 */
export function getInstallTarget(
	filePath: string,
	config: ComponentConfig,
	cwd: string = process.cwd()
): InstallTarget {
	const normalized = normalizeRegistryPath(filePath);

	// Headless primitives are installed relative to `aliases.hooks` (default: `$lib/primitives`)
	if (normalized.startsWith('lib/primitives/')) {
		return {
			targetDir: resolveAlias(config.aliases.hooks, config, cwd),
			relativePath: normalized.slice('lib/primitives/'.length),
		};
	}

	if (normalized.startsWith('lib/')) {
		return {
			targetDir: resolveAlias(config.aliases.lib, config, cwd),
			relativePath: normalized.slice('lib/'.length),
		};
	}

	if (normalized.startsWith('shared/')) {
		return {
			targetDir: resolveAlias(config.aliases.components, config, cwd),
			relativePath: normalized.slice('shared/'.length),
		};
	}

	if (normalized.startsWith('greater/')) {
		return {
			targetDir: resolveAlias(config.aliases.greater, config, cwd),
			relativePath: normalized.slice('greater/'.length),
		};
	}

	return {
		targetDir: cwd,
		relativePath: normalized,
	};
}

export function getInstalledFilePath(
	filePath: string,
	config: ComponentConfig,
	cwd: string = process.cwd()
): string {
	const target = getInstallTarget(filePath, config, cwd);
	return resolvePathWithinDir(target.targetDir, target.relativePath, 'install path');
}
