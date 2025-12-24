/**
 * Update command - Update installed components to newer versions
 * Handles conflict detection and resolution for locally modified files
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import {
	readConfig,
	configExists,
	writeConfig,
	getInstalledComponent,
	getInstalledComponentNames,
	addInstalledComponent,
	FALLBACK_REF,
	type ComponentConfig,
	type InstalledComponent,
} from '../utils/config.js';
import { resolveRef } from '../utils/registry-index.js';
import { getComponent } from '../registry/index.js';
import { fetchComponentFiles, type FetchOptions } from '../utils/fetch.js';
import { readFile, writeFile, fileExists } from '../utils/files.js';
import { computeDiff, formatDiffStats, type DiffResult } from '../utils/diff.js';

import { transformImports } from '../utils/transform.js';
import { logger } from '../utils/logger.js';
import { getInstalledFilePath } from '../utils/install-path.js';
import { ensureLocalRepoRoot } from '../utils/local-repo.js';

/**
 * Conflict resolution choice
 */
type ConflictResolution = 'keep' | 'overwrite' | 'skip' | 'show-diff';

/**
 * Update status for a component
 */
interface ComponentUpdateStatus {
	componentName: string;
	currentVersion: string;
	targetVersion: string;
	files: FileUpdateStatus[];
	hasConflicts: boolean;
	skipped: boolean;
	error?: string;
}

/**
 * Update status for a single file
 */
interface FileUpdateStatus {
	filePath: string;
	localPath: string;
	status: 'updated' | 'created' | 'skipped' | 'conflict' | 'error';
	hasLocalModifications: boolean;
	diff?: DiffResult;
	error?: string;
}

/**
 * Check if a local file has been modified from its installed version
 */
async function checkLocalModification(
	_localPath: string,
	installed: InstalledComponent | undefined
): Promise<boolean> {
	if (!installed) {
		return false;
	}

	// If component is marked as modified, it has local changes
	if (installed.modified) {
		return true;
	}

	return false;
}

/**
 * Prompt user for conflict resolution
 */
async function promptConflictResolution(
	componentName: string,
	filePath: string,
	diff: DiffResult
): Promise<ConflictResolution> {
	const stats = formatDiffStats(diff.stats);

	logger.info(chalk.yellow(`\n⚠ Conflict in ${componentName}/${filePath}`));
	logger.info(chalk.dim(`  Local file has modifications (${stats})`));

	const response = await prompts({
		type: 'select',
		name: 'resolution',
		message: 'How would you like to resolve this conflict?',
		choices: [
			{ title: 'Keep local version (skip update)', value: 'keep' },
			{ title: 'Overwrite with upstream version', value: 'overwrite' },
			{ title: 'Show diff and decide', value: 'show-diff' },
			{ title: 'Skip this component entirely', value: 'skip' },
		],
	});

	return response.resolution || 'keep';
}

/**
 * Display colored diff for conflict resolution
 */
function displayConflictDiff(diff: DiffResult): void {
	if (!diff.unifiedDiff) {
		return;
	}

	const lines = diff.unifiedDiff.split('\n');
	const coloredLines = lines.map((line) => {
		if (line.startsWith('+++') || line.startsWith('---')) {
			return chalk.bold(line);
		}
		if (line.startsWith('@@')) {
			return chalk.cyan(line);
		}
		if (line.startsWith('+')) {
			return chalk.green(line);
		}
		if (line.startsWith('-')) {
			return chalk.red(line);
		}
		return line;
	});

	logger.info('\n' + coloredLines.join('\n') + '\n');
}

/**
 * Update a single component
 */
async function updateComponent(
	componentName: string,
	config: ComponentConfig,
	cwd: string,
	options: {
		ref: string;
		force?: boolean;
		dryRun?: boolean;
	}
): Promise<ComponentUpdateStatus> {
	const component = getComponent(componentName);

	if (!component) {
		return {
			componentName,
			currentVersion: 'unknown',
			targetVersion: options.ref,
			files: [],
			hasConflicts: false,
			skipped: true,
			error: 'Component not found in registry',
		};
	}

	const installed = getInstalledComponent(componentName, config);
	const currentVersion = installed?.version || 'not installed';
	const targetVersion = options.ref;

	const fetchOptions: FetchOptions = {
		ref: options.ref,
	};

	// Fetch remote files
	let remoteFiles: Map<string, string>;
	try {
		const fetchResult = await fetchComponentFiles(component, fetchOptions);
		remoteFiles = new Map(fetchResult.files.map((f) => [f.path, f.content]));
	} catch (error) {
		return {
			componentName,
			currentVersion,
			targetVersion,
			files: [],
			hasConflicts: false,
			skipped: true,
			error: `Failed to fetch: ${error instanceof Error ? error.message : String(error)}`,
		};
	}

	const fileStatuses: FileUpdateStatus[] = [];
	let hasConflicts = false;
	let skipComponent = false;

	for (const file of component.files) {
		const localPath = getInstalledFilePath(file.path, config, cwd);
		const remoteContent = remoteFiles.get(file.path) || '';

		const status: FileUpdateStatus = {
			filePath: file.path,
			localPath,
			status: 'updated',
			hasLocalModifications: false,
		};

		const localExists = await fileExists(localPath);

		if (localExists) {
			try {
				const localContent = await readFile(localPath);
				const diff = computeDiff(localContent, remoteContent, {
					filePath: file.path,
					contextLines: 3,
				});

				status.diff = diff;

				if (diff.identical) {
					status.status = 'skipped';
					fileStatuses.push(status);
					continue;
				}

				// Check for local modifications
				const hasLocalMods = await checkLocalModification(localPath, installed);
				status.hasLocalModifications = hasLocalMods || installed?.modified || false;

				if (status.hasLocalModifications && !options.force) {
					hasConflicts = true;
					status.status = 'conflict';

					if (!options.dryRun) {
						// Prompt for resolution
						let resolution = await promptConflictResolution(componentName, file.path, diff);

						// Handle show-diff option
						while (resolution === 'show-diff') {
							displayConflictDiff(diff);
							const followUp = await prompts({
								type: 'select',
								name: 'resolution',
								message: 'After reviewing the diff:',
								choices: [
									{ title: 'Keep local version', value: 'keep' },
									{ title: 'Overwrite with upstream', value: 'overwrite' },
									{ title: 'Skip this component', value: 'skip' },
								],
							});
							resolution = followUp.resolution || 'keep';
						}

						if (resolution === 'skip') {
							skipComponent = true;
							break;
						}

						if (resolution === 'keep') {
							status.status = 'skipped';
							fileStatuses.push(status);
							continue;
						}

						// resolution === 'overwrite' - continue to write
					}
				}

				// Apply transformation and write file
				if (!options.dryRun) {
					const transformed = transformImports(remoteContent, config, file.path);
					await writeFile(localPath, transformed.content);
				}

				status.status = 'updated';
			} catch (error) {
				status.status = 'error';
				status.error = error instanceof Error ? error.message : String(error);
			}
		} else {
			// New file - create it
			status.status = 'created';

			if (!options.dryRun) {
				try {
					const transformed = transformImports(remoteContent, config, file.path);
					await writeFile(localPath, transformed.content);
				} catch (error) {
					status.status = 'error';
					status.error = error instanceof Error ? error.message : String(error);
				}
			}
		}

		fileStatuses.push(status);
	}

	return {
		componentName,
		currentVersion,
		targetVersion,
		files: fileStatuses,
		hasConflicts,
		skipped: skipComponent,
	};
}

/**
 * Display update results
 */
function displayUpdateResults(results: ComponentUpdateStatus[], dryRun: boolean): void {
	const prefix = dryRun ? chalk.cyan('[DRY RUN] ') : '';

	logger.info(chalk.bold(`\n${prefix}━━━ Update Summary ━━━\n`));

	let updated = 0;
	let created = 0;
	let skipped = 0;
	let conflicts = 0;
	let errors = 0;

	for (const result of results) {
		if (result.error) {
			logger.error(chalk.red(`  ✖ ${result.componentName}: ${result.error}`));
			errors++;
			continue;
		}

		if (result.skipped) {
			logger.info(chalk.yellow(`  ⊘ ${result.componentName}: skipped`));
			skipped++;
			continue;
		}

		const fileStats = result.files.reduce(
			(acc, f) => {
				acc[f.status] = (acc[f.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const parts: string[] = [];
		if (fileStats['updated']) {
			parts.push(chalk.green(`${fileStats['updated']} updated`));
			updated += fileStats['updated'];
		}
		if (fileStats['created']) {
			parts.push(chalk.blue(`${fileStats['created']} created`));
			created += fileStats['created'];
		}
		if (fileStats['skipped']) {
			parts.push(chalk.dim(`${fileStats['skipped']} unchanged`));
			skipped += fileStats['skipped'];
		}
		if (fileStats['conflict']) {
			parts.push(chalk.yellow(`${fileStats['conflict']} conflicts`));
			conflicts += fileStats['conflict'];
		}
		if (fileStats['error']) {
			parts.push(chalk.red(`${fileStats['error']} errors`));
			errors += fileStats['error'];
		}

		const statusStr = parts.length > 0 ? parts.join(', ') : 'no changes';
		const versionStr =
			result.currentVersion !== result.targetVersion
				? chalk.dim(` (${result.currentVersion} → ${result.targetVersion})`)
				: '';

		logger.info(`  ${chalk.green('✓')} ${result.componentName}: ${statusStr}${versionStr}`);
	}

	logger.info(chalk.bold('\n━━━ Totals ━━━'));
	logger.info(`  Files updated: ${chalk.green(updated)}`);
	logger.info(`  Files created: ${chalk.blue(created)}`);
	logger.info(`  Files skipped: ${chalk.dim(skipped)}`);
	if (conflicts > 0) {
		logger.info(`  Conflicts: ${chalk.yellow(conflicts)}`);
	}
	if (errors > 0) {
		logger.info(`  Errors: ${chalk.red(errors)}`);
	}
}

export const updateAction = async (
	items: string[],
	options: {
		all?: boolean;
		ref?: string;
		cwd?: string;
		force?: boolean;
		dryRun?: boolean;
		yes?: boolean;
	}
) => {
	const cwd = path.resolve(options.cwd || process.cwd());
	ensureLocalRepoRoot(cwd);

	// Check if initialized
	if (!(await configExists(cwd))) {
		logger.error(chalk.red('✖ Greater Components is not initialized'));
		logger.note(chalk.dim('  Run ') + chalk.cyan('greater init') + chalk.dim(' first\n'));
		process.exit(1);
	}

	// Read config
	let config = await readConfig(cwd);
	if (!config) {
		logger.error(chalk.red('✖ Failed to read configuration'));
		process.exit(1);
	}

	const resolved = await resolveRef(options.ref, config.ref, FALLBACK_REF);

	// Determine which components to update
	let componentNames: string[];

	if (options.all) {
		componentNames = getInstalledComponentNames(config);
	} else if (items.length > 0) {
		// Validate specified components
		const installed = getInstalledComponentNames(config);
		const notInstalled = items.filter((name) => !installed.includes(name));

		if (notInstalled.length > 0) {
			logger.warn(chalk.yellow(`\n⚠ Components not installed: ${notInstalled.join(', ')}`));
			logger.note(
				chalk.dim('  These will be skipped. Use ') +
					chalk.cyan('greater add') +
					chalk.dim(' to install new components.\n')
			);
		}

		componentNames = items.filter((name) => installed.includes(name));
	} else {
		logger.error(chalk.red('\n✖ No components specified'));
		logger.note(
			chalk.dim('  Use ') +
				chalk.cyan('greater update <component>') +
				chalk.dim(' or ') +
				chalk.cyan('greater update --all') +
				chalk.dim('\n')
		);
		process.exit(1);
	}

	if (componentNames.length === 0) {
		logger.info(chalk.yellow('\n✖ No components to update'));
		process.exit(0);
	}

	const targetRef = resolved.ref;
	const dryRunLabel = options.dryRun ? chalk.cyan(' [DRY RUN]') : '';

	logger.info(
		chalk.bold(
			`\n🔄 Updating ${componentNames.length} component(s) to ${targetRef}${dryRunLabel}\n`
		)
	);

	// Confirm if not using --yes
	if (!options.yes && !options.dryRun) {
		const response = await prompts({
			type: 'confirm',
			name: 'confirm',
			message: `Update ${componentNames.length} component(s)?`,
			initial: true,
		});

		if (!response.confirm) {
			logger.warn(chalk.yellow('\n✖ Update cancelled'));
			process.exit(0);
		}
	}

	const spinner = ora('Updating components...').start();

	// Update each component
	const results: ComponentUpdateStatus[] = [];

	for (const name of componentNames) {
		spinner.text = `Updating ${name}...`;

		const result = await updateComponent(name, config, cwd, {
			ref: targetRef,
			force: options.force,
			dryRun: options.dryRun,
		});

		results.push(result);

		// Update config with new version if successful
		if (!options.dryRun && !result.skipped && !result.error) {
			config = addInstalledComponent(config, name, result.targetVersion);
		}
	}

	spinner.stop();

	// Save updated config
	if (!options.dryRun) {
		config = {
			...config,
			ref: targetRef,
		};
		await writeConfig(config, cwd);
	}

	// Display results
	displayUpdateResults(results, options.dryRun || false);

	// Exit with error code if there were failures
	const hasErrors = results.some((r) => r.error || r.files.some((f) => f.status === 'error'));
	if (hasErrors) {
		process.exit(1);
	}
};

export const updateCommand = new Command()
	.name('update')
	.description('Update installed components to newer versions')
	.argument('[items...]', 'Components to update')
	.option('-a, --all', 'Update all installed components')
	.option('--ref <tag>', 'Update to specific version/tag')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('-f, --force', 'Overwrite local modifications without prompting')
	.option('--dry-run', 'Preview updates without making changes')
	.option('-y, --yes', 'Skip confirmation prompts')
	.action(updateAction);
