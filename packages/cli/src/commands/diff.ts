/**
 * Diff command - Compare installed components against registry versions
 * Shows differences between local files and upstream versions
 */

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'node:path';
import {
	readConfig,
	configExists,
	getInstalledComponent,
	getInstalledComponentNames,
	FALLBACK_REF,
	type ComponentConfig,
} from '../utils/config.js';
import { getComponent } from '../registry/index.js';
import { fetchComponentFiles, type FetchOptions } from '../utils/fetch.js';
import { readFile, fileExists } from '../utils/files.js';
import { computeDiff, formatDiffStats, type DiffResult } from '../utils/diff.js';
import { logger } from '../utils/logger.js';
import { fetchRegistryIndex, resolveRef } from '../utils/registry-index.js';
import { getInstalledFilePath } from '../utils/install-path.js';
import { ensureLocalRepoRoot } from '../utils/local-repo.js';
import { resolveRefForFetch } from '../utils/ref.js';
import { transformImports } from '../utils/transform.js';
import type { ComponentFile, ComponentMetadata } from '../registry/index.js';

/**
 * Result of diffing a single component
 */
interface ComponentDiffResult {
	componentName: string;
	files: FileDiffResult[];
	hasChanges: boolean;
	hasLocalModifications: boolean;
}

/**
 * Result of diffing a single file
 */
interface FileDiffResult {
	filePath: string;
	localPath: string;
	exists: boolean;
	diff: DiffResult | null;
	error?: string;
}

function normalizeDiffItemName(name: string): string {
	return name.replace(/^faces?\//i, 'faces/');
}

function inferDiffFileType(filePath: string): ComponentFile['type'] {
	if (filePath.endsWith('.css')) return 'styles';
	if (filePath.endsWith('.d.ts') || filePath.endsWith('.d.ts.map')) return 'types';
	if (filePath.endsWith('.svelte') || filePath.includes('.svelte.')) return 'component';
	return filePath.endsWith('.ts') ? 'types' : 'utils';
}

async function hydrateFaceMetadataForDiff(
	componentName: string,
	component: ComponentMetadata,
	ref: string
): Promise<ComponentMetadata> {
	if (component.type !== 'face' || component.files.length > 0) return component;

	const faceName = componentName.replace(/^faces?\//i, '') || component.name;
	const registryIndex = await fetchRegistryIndex(ref);
	const face = registryIndex.faces[faceName];
	if (!face?.files.length) return component;

	return {
		...component,
		files: face.files.map((file) => {
			const withoutSrc = file.path.startsWith('src/') ? file.path.slice('src/'.length) : file.path;
			return {
				path: `greater/faces/${faceName}/${withoutSrc}`,
				content: '',
				type: inferDiffFileType(withoutSrc),
			};
		}),
	};
}

/**
 * Format a unified diff with colors for terminal output
 */
function formatColoredDiff(unifiedDiff: string): string {
	if (!unifiedDiff) {
		return '';
	}

	const lines = unifiedDiff.split('\n');
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

	return coloredLines.join('\n');
}

/**
 * Diff a single component against registry version
 */
async function diffComponent(
	componentName: string,
	config: ComponentConfig,
	cwd: string,
	options: { ref: string }
): Promise<ComponentDiffResult> {
	const baseComponent = getComponent(componentName);

	if (!baseComponent) {
		return {
			componentName,
			files: [],
			hasChanges: false,
			hasLocalModifications: false,
		};
	}

	const component = await hydrateFaceMetadataForDiff(componentName, baseComponent, options.ref);
	const installed = getInstalledComponent(componentName, config);
	const fetchOptions: FetchOptions = {
		ref: options.ref,
	};

	// Fetch remote files
	let remoteFiles: Map<string, { content: string; transform?: boolean }>;
	try {
		const fetchResult = await fetchComponentFiles(component, fetchOptions);
		remoteFiles = new Map(
			fetchResult.files.map((f) => [f.path, { content: f.content, transform: f.transform }])
		);
	} catch (error) {
		return {
			componentName,
			files: [
				{
					filePath: '*',
					localPath: '*',
					exists: false,
					diff: null,
					error: `Failed to fetch remote files: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
			hasChanges: false,
			hasLocalModifications: false,
		};
	}

	const fileDiffs: FileDiffResult[] = [];
	let hasChanges = false;
	let hasLocalModifications = false;

	for (const file of component.files) {
		const localPath = getInstalledFilePath(file.path, config, cwd);
		const remoteFile = remoteFiles.get(file.path);
		const remoteContent =
			remoteFile && remoteFile.transform !== false
				? transformImports(remoteFile.content, config, file.path).content
				: (remoteFile?.content ?? '');

		const result: FileDiffResult = {
			filePath: file.path,
			localPath,
			exists: false,
			diff: null,
		};

		if (await fileExists(localPath)) {
			result.exists = true;

			try {
				const localContent = await readFile(localPath);
				const diff = computeDiff(localContent, remoteContent, {
					filePath: file.path,
					contextLines: 3,
				});

				result.diff = diff;

				if (!diff.identical) {
					hasChanges = true;

					// Check if local was modified from installed version
					if (installed) {
						// compare checksums logic if needed
						// If we had stored the original checksum, we could compare
						// For now, any difference from remote indicates potential local modification
						hasLocalModifications = true;
					}
				}
			} catch (error) {
				result.error = `Failed to read local file: ${error instanceof Error ? error.message : String(error)}`;
			}
		} else {
			// File doesn't exist locally - show as all additions needed
			result.diff = computeDiff('', remoteContent, {
				filePath: file.path,
				contextLines: 3,
			});
			hasChanges = true;
		}

		fileDiffs.push(result);
	}

	return {
		componentName,
		files: fileDiffs,
		hasChanges,
		hasLocalModifications,
	};
}

/**
 * Display diff results for a component
 */
function displayComponentDiff(result: ComponentDiffResult): void {
	const { componentName, files, hasChanges, hasLocalModifications } = result;

	const hasErrors = files.some((f) => f.error);

	if (!hasChanges && !hasErrors) {
		logger.info(chalk.green(`✓ ${componentName}: up to date`));
		return;
	}

	logger.info(chalk.yellow(`\n━━━ ${componentName} ━━━`));

	if (hasLocalModifications) {
		logger.info(chalk.yellow('  ⚠ Local modifications detected'));
	}

	for (const file of files) {
		if (file.error) {
			logger.error(chalk.red(`  ✖ ${file.filePath}: ${file.error}`));
			continue;
		}

		if (!file.diff) {
			continue;
		}

		if (file.diff.identical) {
			continue;
		}

		if (file.diff.isBinary) {
			logger.info(chalk.dim(`  ${file.filePath}: binary file differs`));
			continue;
		}

		const stats = formatDiffStats(file.diff.stats);
		const existsLabel = file.exists ? '' : chalk.yellow(' (new file)');
		logger.info(chalk.bold(`\n  ${file.filePath}${existsLabel} (${stats})`));

		if (file.diff.unifiedDiff) {
			const coloredDiff = formatColoredDiff(file.diff.unifiedDiff);
			// Indent the diff output
			const indentedDiff = coloredDiff
				.split('\n')
				.map((line) => `    ${line}`)
				.join('\n');
			logger.info(indentedDiff);
		}
	}
}

/**
 * Display summary of all diffs
 */
function displayDiffSummary(results: ComponentDiffResult[]): void {
	const withChanges = results.filter((r) => r.hasChanges);
	const withLocalMods = results.filter((r) => r.hasLocalModifications);

	logger.info(chalk.bold('\n━━━ Summary ━━━'));
	logger.info(`  Components checked: ${results.length}`);
	logger.info(`  With upstream changes: ${withChanges.length}`);
	logger.info(`  With local modifications: ${withLocalMods.length}`);

	if (withChanges.length > 0) {
		logger.info(chalk.dim(`\n  Run ${chalk.cyan('greater update')} to apply upstream changes`));
	}
}

export const diffCommand = new Command()
	.name('diff')
	.description('Compare installed components against registry versions')
	.argument('[items...]', 'Components to diff (default: all installed)')
	.option('--ref <tag>', 'Compare against specific version/tag')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('--summary', 'Show summary only, no detailed diff')
	.action(async (items: string[], options) => {
		const cwd = path.resolve(options.cwd || process.cwd());
		ensureLocalRepoRoot(cwd);

		// Check if initialized
		if (!(await configExists(cwd))) {
			logger.error(chalk.red('✖ Greater Components is not initialized'));
			logger.note(chalk.dim('  Run ') + chalk.cyan('greater init') + chalk.dim(' first\n'));
			process.exit(1);
		}

		// Read config
		const config = await readConfig(cwd);
		if (!config) {
			logger.error(chalk.red('✖ Failed to read configuration'));
			process.exit(1);
		}

		const resolved = await resolveRef(options.ref, config.ref, FALLBACK_REF);
		const targetRef = await resolveRefForFetch(resolved.ref);

		// Determine which components to diff
		let componentNames: string[];

		if (items.length > 0) {
			// Validate specified components exist
			componentNames = items.map(normalizeDiffItemName);
			const invalid = componentNames.filter((name) => !getComponent(name));
			if (invalid.length > 0) {
				logger.error(chalk.red(`\n✖ Unknown components: ${invalid.join(', ')}`));
				logger.note(
					chalk.dim('  Run ') +
						chalk.cyan('greater list') +
						chalk.dim(' to see available components\n')
				);
				process.exit(1);
			}
		} else {
			// Diff all installed components
			componentNames = getInstalledComponentNames(config).map(normalizeDiffItemName);

			if (componentNames.length === 0) {
				logger.info(chalk.yellow('\n✖ No components installed'));
				logger.note(
					chalk.dim('  Run ') +
						chalk.cyan('greater add <component>') +
						chalk.dim(' to install components\n')
				);
				process.exit(0);
			}
		}

		logger.info(
			chalk.bold(`\n🔍 Comparing ${componentNames.length} component(s) against ${targetRef}...\n`)
		);

		// Diff each component
		const results: ComponentDiffResult[] = [];

		for (const name of componentNames) {
			const result = await diffComponent(name, config, cwd, { ref: targetRef });
			results.push(result);

			if (!options.summary) {
				displayComponentDiff(result);
			}
		}

		// Display summary
		displayDiffSummary(results);

		// Exit with code 1 if there are changes (useful for CI)
		const hasAnyChanges = results.some((r) => r.hasChanges);
		if (hasAnyChanges) {
			process.exit(1);
		}
	});
