/**
 * Installation Preview Generator
 * Formats and displays installation plan for user confirmation
 */

import chalk from 'chalk';
import path from 'node:path';
import type { DependencyResolutionResult, ResolvedDependency } from './dependency-resolver.js';
import { groupByType, estimateDiskSpace } from './dependency-resolver.js';
import type { ComponentConfig } from './config.js';
import { logger } from './logger.js';
import { getInstallTarget } from './install-path.js';

/**
 * Target path information for a component
 */
export interface TargetPathInfo {
	name: string;
	type: string;
	targetDir: string;
	files: string[];
}

/**
 * Installation preview data
 */
export interface InstallationPreview {
	/** Components grouped by type */
	byType: Record<string, ResolvedDependency[]>;
	/** Target paths for each component */
	targetPaths: TargetPathInfo[];
	/** NPM dependencies to install */
	npmDependencies: Array<{ name: string; version: string }>;
	/** NPM dev dependencies to install */
	npmDevDependencies: Array<{ name: string; version: string }>;
	/** Disk space estimate */
	diskSpace: { files: number; estimatedKB: string };
	/** Total component count */
	totalComponents: number;
	/** Direct requests count */
	directRequests: number;
	/** Transitive dependencies count */
	transitiveDeps: number;
}

/**
 * Generate installation preview from resolution result
 */
export function generatePreview(
	result: DependencyResolutionResult,
	config: ComponentConfig,
	cwd: string,
	customPath?: string
): InstallationPreview {
	const byType = groupByType(result);
	const diskSpace = estimateDiskSpace(result);
	const overrideDir = customPath ? path.resolve(cwd, customPath) : null;

	const targetPaths: TargetPathInfo[] = result.resolved.map((dep) => {
		const rawFiles =
			'files' in dep.metadata && dep.metadata.files
				? (dep.metadata.files as Array<{ path: string }>)
				: [];

		const firstTarget = rawFiles[0] ? getInstallTarget(rawFiles[0].path, config, cwd) : null;
		const targetDir = overrideDir ?? firstTarget?.targetDir ?? cwd;
		const files = rawFiles.map((file) => getInstallTarget(file.path, config, cwd).relativePath);

		return {
			name: dep.name,
			type: dep.type,
			targetDir,
			files,
		};
	});

	const directRequests = result.resolved.filter((d) => d.isDirectRequest).length;
	const transitiveDeps = result.resolved.length - directRequests;

	return {
		byType,
		targetPaths,
		npmDependencies: result.npmDependencies,
		npmDevDependencies: result.npmDevDependencies,
		diskSpace,
		totalComponents: result.resolved.length,
		directRequests,
		transitiveDeps,
	};
}

/**
 * Display installation preview to console
 */
export function displayPreview(preview: InstallationPreview): void {
	logger.info(chalk.bold('\n📦 Installation Plan\n'));
	logger.note(chalk.dim('─'.repeat(60)));

	// Summary
	logger.info(`\n${chalk.bold('Summary:')}`);
	logger.info(`  Total components: ${chalk.cyan(preview.totalComponents)}`);
	logger.info(`  Direct requests:  ${chalk.green(preview.directRequests)}`);
	logger.info(`  Dependencies:     ${chalk.yellow(preview.transitiveDeps)}`);
	logger.info(`  Files to write:   ${chalk.cyan(preview.diskSpace.files)}`);
	logger.info(`  Estimated size:   ${chalk.dim(preview.diskSpace.estimatedKB)}`);

	// Components by type
	logger.info(`\n${chalk.bold('Components to install:')}\n`);

	const typeLabels: Record<string, string> = {
		primitives: '🔧 Primitives',
		compounds: '📦 Compound Components',
		patterns: '🎨 Patterns',
		shared: '🔗 Shared Modules',
		faces: '🎭 Faces',
		adapters: '🔌 Adapters',
	};

	for (const [type, deps] of Object.entries(preview.byType)) {
		if (deps.length === 0) continue;

		const label = typeLabels[type] || type;
		logger.info(`  ${chalk.bold.cyan(label)} (${deps.length})`);

		for (const dep of deps) {
			const marker = dep.isDirectRequest ? chalk.green('●') : chalk.dim('○');
			const name = dep.isDirectRequest ? chalk.bold(dep.name) : chalk.dim(dep.name);
			logger.info(`    ${marker} ${name}`);
		}
		logger.newline();
	}

	// Target paths
	logger.info(`${chalk.bold('Target paths:')}\n`);
	const uniquePaths = [...new Set(preview.targetPaths.map((t) => t.targetDir))];
	for (const path of uniquePaths) {
		const components = preview.targetPaths.filter((t) => t.targetDir === path);
		logger.info(`  ${chalk.dim(path)}`);
		logger.info(`    ${chalk.dim(`(${components.length} component(s))`)}`);
	}

	// NPM dependencies
	if (preview.npmDependencies.length > 0 || preview.npmDevDependencies.length > 0) {
		logger.info(`\n${chalk.bold('NPM dependencies to install:')}\n`);

		if (preview.npmDependencies.length > 0) {
			logger.info(`  ${chalk.dim('Dependencies:')}`);
			for (const dep of preview.npmDependencies) {
				logger.info(`    ${chalk.cyan(dep.name)}@${chalk.dim(dep.version)}`);
			}
		}

		if (preview.npmDevDependencies.length > 0) {
			logger.info(`  ${chalk.dim('Dev Dependencies:')}`);
			for (const dep of preview.npmDevDependencies) {
				logger.info(`    ${chalk.cyan(dep.name)}@${chalk.dim(dep.version)}`);
			}
		}
	}

	logger.note(chalk.dim('\n─'.repeat(60)));
}

/**
 * Display dry-run preview (no actual installation)
 */
export function displayDryRunPreview(preview: InstallationPreview): void {
	logger.info(chalk.bold.yellow('\n🔍 DRY RUN - No files will be written\n'));
	displayPreview(preview);
	logger.info(chalk.yellow('\n⚠️  This was a dry run. No changes were made.\n'));
}

/**
 * Display errors from resolution
 */
export function displayResolutionErrors(result: DependencyResolutionResult): void {
	if (result.circular.length > 0) {
		logger.error(chalk.red('\n✖ Circular dependencies detected:\n'));
		for (const cycle of result.circular) {
			logger.error(`  ${chalk.red('→')} ${cycle.message}`);
		}
	}

	if (result.missing.length > 0) {
		logger.error(chalk.red('\n✖ Missing dependencies:\n'));
		for (const missing of result.missing) {
			logger.error(`  ${chalk.red('→')} "${missing.name}" required by ${missing.requiredBy}`);
		}
	}
}
