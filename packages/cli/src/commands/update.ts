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
	type FileChecksumEntry,
	type InstalledComponent,
} from '../utils/config.js';
import { resolveRef, fetchRegistryIndex } from '../utils/registry-index.js';
import { getComponent, getAllRegistryEntries } from '../registry/index.js';
import { fetchComponentFiles, type FetchOptions } from '../utils/fetch.js';
import { readFile, readFileBuffer, writeFile, fileExists } from '../utils/files.js';
import { computeDiff, formatDiffStats, type DiffResult } from '../utils/diff.js';
import { computeChecksum } from '../utils/integrity.js';

import { transformImports } from '../utils/transform.js';
import { logger } from '../utils/logger.js';
import { getInstalledFilePath } from '../utils/install-path.js';
import { ensureLocalRepoRoot } from '../utils/local-repo.js';
import { resolveRefForFetch } from '../utils/ref.js';
import { fetchFromGitTag } from '../utils/git-fetch.js';
import {
	evaluatePruneCandidates,
	isImmutablePriorRef,
	planComponentPrune,
	pruneHasFailures,
	type PruneResult,
	type PruneSkip,
} from '../utils/prune.js';

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
	/** Outcome for each file this component owned at its prior ref but not at the target ref. */
	prunes: PruneResult[];
	/** Set when prune planning produced no candidates; always reported. */
	pruneSkipped?: PruneSkip;
	/** Install path + canonical checksum for every file this component owns at the target ref. */
	managedChecksums: FileChecksumEntry[];
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

function createBinaryDiffResult(filePath: string, identical: boolean): DiffResult {
	return {
		identical,
		isBinary: true,
		hunks: [],
		stats: identical
			? { additions: 0, deletions: 0, unchanged: 1, totalLines: 1 }
			: { additions: 1, deletions: 1, unchanged: 0, totalLines: 2 },
		unifiedDiff: identical
			? ''
			: filePath
				? `Binary files a/${filePath} and b/${filePath} differ`
				: 'Binary files differ',
	};
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
			prunes: [],
			managedChecksums: [],
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
	let remoteFiles: typeof component.files;
	try {
		const fetchResult = await fetchComponentFiles(component, fetchOptions);
		remoteFiles = fetchResult.files;
	} catch (error) {
		return {
			componentName,
			currentVersion,
			targetVersion,
			files: [],
			hasConflicts: false,
			skipped: true,
			prunes: [],
			managedChecksums: [],
			error: `Failed to fetch: ${error instanceof Error ? error.message : String(error)}`,
		};
	}

	const fileStatuses: FileUpdateStatus[] = [];
	const managedChecksums: FileChecksumEntry[] = [];
	let hasConflicts = false;
	let skipComponent = false;

	for (const file of remoteFiles) {
		const localPath = getInstalledFilePath(file.path, config, cwd);
		const remoteContent = file.content;
		const remoteRaw = file.raw;
		const isBinaryFile = !!remoteRaw;
		const shouldBypassTransform = file.transform === false;

		// The canonical managed content for this file at the target ref: exactly what
		// the CLI writes, and what gets recorded in `components.json` as this
		// component's ownership fingerprint. Recording the canonical rendering
		// rather than the bytes on disk means a file the user chose to keep local
		// edits to is still correctly seen as modified by the next update.
		const managedContent: string | Buffer = isBinaryFile
			? remoteRaw
			: shouldBypassTransform
				? remoteContent
				: transformImports(remoteContent, config, file.path, {
						sourceFilePath: localPath,
						consumerRoot: cwd,
					}).content;

		managedChecksums.push({
			path: file.path,
			checksum: computeChecksum(
				Buffer.isBuffer(managedContent) ? managedContent : Buffer.from(managedContent, 'utf-8')
			),
		});

		const status: FileUpdateStatus = {
			filePath: file.path,
			localPath,
			status: 'updated',
			hasLocalModifications: false,
		};

		const localExists = await fileExists(localPath);

		if (localExists) {
			try {
				const diff = isBinaryFile
					? createBinaryDiffResult(file.path, (await readFileBuffer(localPath)).equals(remoteRaw))
					: computeDiff(await readFile(localPath), remoteContent, {
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
					await writeFile(localPath, managedContent);
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
					await writeFile(localPath, managedContent);
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
		prunes: [],
		managedChecksums,
	};
}

/**
 * Plan and carry out obsolete-file pruning for one component.
 *
 * Runs *after* the component's writes so that a failed write never leaves the
 * consumer with neither the new file nor the old one. Ownership comes entirely
 * from the two immutable registry indexes — see `utils/prune.ts`.
 */
async function pruneComponent(
	componentName: string,
	config: ComponentConfig,
	cwd: string,
	options: { oldRef: string | undefined; newRef: string; dryRun?: boolean }
): Promise<{ results: PruneResult[]; skipped?: PruneSkip }> {
	const component = getComponent(componentName);
	if (!component) {
		return {
			results: [],
			skipped: { kind: 'unresolved', reason: 'component not found in registry' },
		};
	}

	const { oldRef, newRef } = options;

	if (!isImmutablePriorRef(oldRef)) {
		// A package version or branch name recorded by an older CLI never becomes
		// immutable, so re-running cannot help. This update records an immutable ref
		// and the ownership record, which is what makes the next one prune exactly.
		return {
			results: [],
			skipped: {
				kind: 'not-applicable',
				reason:
					`prior ref ${oldRef ? `"${oldRef}"` : '(unset)'} is not an immutable registry ref, ` +
					`so obsolete files from that install cannot be identified`,
			},
		};
	}

	if (oldRef === newRef) {
		return { results: [] };
	}

	let oldIndex;
	let newIndex;
	try {
		[oldIndex, newIndex] = await Promise.all([
			fetchRegistryIndex(oldRef),
			fetchRegistryIndex(newRef),
		]);
	} catch (error) {
		// Transient by nature. Advancing here would make the next run see
		// `oldRef === newRef` and drop the prune permanently, so this run fails and
		// the component keeps its recorded ref.
		return {
			results: [],
			skipped: {
				kind: 'unresolved',
				reason: `could not load registry index: ${
					error instanceof Error ? error.message : String(error)
				}`,
			},
		};
	}

	const recorded = getInstalledComponent(componentName, config)?.checksums ?? [];

	const plan = planComponentPrune({
		component,
		allEntries: getAllRegistryEntries(),
		config,
		cwd,
		oldIndex,
		newIndex,
		recorded,
	});

	if (plan.skipped) {
		return { results: [], skipped: plan.skipped };
	}

	if (plan.candidates.length === 0) {
		return { results: [] };
	}

	const results = await evaluatePruneCandidates({
		candidates: plan.candidates,
		config,
		cwd,
		oldRef,
		dryRun: options.dryRun ?? false,
		fetchSource: (ref, sourcePath) => fetchFromGitTag(ref, sourcePath),
	});

	return { results };
}

/**
 * Whether a component's update left anything in a failed state.
 *
 * Drives the process exit code. An `unresolved` prune skip counts: planning that
 * could not run this turn is unfinished work, not an outcome, and treating it as
 * success is what lets a transient index failure suppress a real prune forever.
 */
function componentFailed(result: ComponentUpdateStatus): boolean {
	return (
		!!result.error ||
		result.files.some((f) => f.status === 'error') ||
		pruneHasFailures(result.prunes) ||
		result.pruneSkipped?.kind === 'unresolved'
	);
}

/**
 * Whether a component actually finished upgrading to the target ref.
 *
 * Only a completed component may advance its own recorded ref and checksums, and
 * the top-level `ref` may only advance when every component completed. A
 * component the consumer chose to skip did not upgrade, so it is not a success
 * either — its files are still at the prior ref.
 */
function componentCompleted(result: ComponentUpdateStatus): boolean {
	return !componentFailed(result) && !result.skipped;
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
	let pruned = 0;
	let blocked = 0;

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

		const prunedFiles = result.prunes.filter((p) => p.status === 'pruned');
		const blockedFiles = result.prunes.filter(
			(p) => p.status === 'blocked' || p.status === 'error'
		);
		if (prunedFiles.length > 0) {
			parts.push(chalk.magenta(`${prunedFiles.length} ${dryRun ? 'to prune' : 'pruned'}`));
			pruned += prunedFiles.length;
		}
		if (blockedFiles.length > 0) {
			parts.push(chalk.red(`${blockedFiles.length} prune blocked`));
			blocked += blockedFiles.length;
		}

		const pruneUnresolved = result.pruneSkipped?.kind === 'unresolved';
		if (pruneUnresolved) {
			parts.push(chalk.red('prune not planned'));
			errors++;
		}

		const statusStr = parts.length > 0 ? parts.join(', ') : 'no changes';
		// A component whose prune could not be planned did not finish upgrading, so
		// its recorded ref stays put; a green tick and a target version would both
		// be false.
		const versionStr =
			result.currentVersion !== result.targetVersion && !pruneUnresolved
				? chalk.dim(` (${result.currentVersion} → ${result.targetVersion})`)
				: '';
		const mark = pruneUnresolved ? chalk.red('✖') : chalk.green('✓');

		logger.info(`  ${mark} ${result.componentName}: ${statusStr}${versionStr}`);

		for (const file of prunedFiles) {
			logger.info(
				chalk.magenta(`      ${dryRun ? '- would remove' : '- removed'} ${file.localPath}`) +
					chalk.dim(` (no longer part of ${result.componentName})`)
			);
		}
		for (const file of blockedFiles) {
			logger.error(chalk.red(`      ✖ preserved ${file.localPath}`));
			logger.error(chalk.dim(`        ${file.reason ?? 'unknown reason'}`));
		}
		// Inferred-only candidates that did not byte-match are, as far as the CLI
		// can prove, not Greater files at all. Surfacing them as warnings would
		// alarm consumers about their own sources, so they stay at debug level.
		for (const file of result.prunes.filter((p) => p.status === 'retained')) {
			logger.debug(`prune: retained ${file.localPath} — ${file.reason ?? 'unverified ownership'}`);
		}
		// Both kinds are reported; only `unresolved` is unfinished work, and it is
		// counted as a failure above rather than presented as a passing update.
		if (pruneUnresolved && result.pruneSkipped) {
			logger.error(
				chalk.red(`      ✖ obsolete-file pruning could not run: ${result.pruneSkipped.reason}`)
			);
		} else if (result.pruneSkipped) {
			logger.info(
				chalk.dim(`      · obsolete-file pruning not applicable: ${result.pruneSkipped.reason}`)
			);
		}
	}

	logger.info(chalk.bold('\n━━━ Totals ━━━'));
	logger.info(`  Files updated: ${chalk.green(updated)}`);
	logger.info(`  Files created: ${chalk.blue(created)}`);
	logger.info(`  Files skipped: ${chalk.dim(skipped)}`);
	if (pruned > 0) {
		logger.info(`  Files ${dryRun ? 'to prune' : 'pruned'}: ${chalk.magenta(pruned)}`);
	}
	if (conflicts > 0) {
		logger.info(`  Conflicts: ${chalk.yellow(conflicts)}`);
	}
	if (blocked > 0) {
		logger.info(`  Prunes blocked: ${chalk.red(blocked)}`);
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

	// Read config. A dry run must not rewrite `components.json`, not even to
	// persist a schema migration.
	let config = await readConfig(cwd, { persistMigration: !options.dryRun });
	if (!config) {
		logger.error(chalk.red('✖ Failed to read configuration'));
		process.exit(1);
	}

	const resolved = await resolveRef(options.ref, config.ref, FALLBACK_REF);
	const targetRef = await resolveRefForFetch(resolved.ref);

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

		const priorRef = getInstalledComponent(name, config)?.version;

		const result = await updateComponent(name, config, cwd, {
			ref: targetRef,
			force: options.force,
			dryRun: options.dryRun,
		});

		// Prune only after this component's writes are on disk, and only when the
		// writes themselves succeeded — otherwise a half-written update could lose
		// both the new file and the old one.
		if (!result.skipped && !result.error && !result.files.some((f) => f.status === 'error')) {
			spinner.text = `Pruning obsolete ${name} files...`;
			const prune = await pruneComponent(name, config, cwd, {
				oldRef: priorRef,
				newRef: targetRef,
				dryRun: options.dryRun,
			});
			result.prunes = prune.results;
			if (prune.skipped) {
				result.pruneSkipped = prune.skipped;
			}
		}

		results.push(result);
	}

	spinner.stop();

	// `components.json` records the target ref for a component only once every
	// write *and* every prune for that component completed. A component whose
	// obsolete files could not be removed — or whose prune could not be planned
	// this run, or that the consumer skipped — keeps its prior recorded ref, so
	// the config never claims an upgrade that did not fully happen and the next
	// run still has a prior ref to prune against.
	const allCompleted = results.every((r) => componentCompleted(r));
	const anyFailed = results.some((r) => componentFailed(r));

	if (!options.dryRun) {
		for (const result of results) {
			if (!componentCompleted(result)) continue;
			config = addInstalledComponent(
				config,
				result.componentName,
				result.targetVersion,
				result.managedChecksums
			);
		}

		if (allCompleted) {
			config = {
				...config,
				ref: targetRef,
			};
		}

		await writeConfig(config, cwd);
	}

	// Display results
	displayUpdateResults(results, options.dryRun || false);

	if (!allCompleted && !options.dryRun) {
		logger.warn(
			chalk.yellow(
				'\n⚠ components.json still records the prior ref for the component(s) above; ' +
					're-run the update once the reported files are resolved.\n'
			)
		);
	}

	if (anyFailed) {
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
