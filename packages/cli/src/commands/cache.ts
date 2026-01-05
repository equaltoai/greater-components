/**
 * Cache Command
 * Manage the local cache for offline use
 *
 * Commands:
 * - greater cache ls         List all cached refs
 * - greater cache clear      Clear all cached files
 * - greater cache clear <ref> Clear cache for a specific ref
 * - greater cache prefetch <ref> [items...] Pre-populate cache for offline use
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger.js';
import { getCacheStatus, getCachedRefs, type CacheStatus } from '../utils/offline.js';
import { clearCache, clearAllCache, getCacheDir, fetchFromGitTag } from '../utils/git-fetch.js';
import {
	fetchRegistryIndex,
	resolveRef,
	clearRegistryCache,
	clearAllRegistryCache,
	getAllFaceNames,
	getAllSharedNames,
	getAllComponentNames,
	getFaceChecksums,
	getSharedChecksums,
	getComponentChecksums,
} from '../utils/registry-index.js';
import { FALLBACK_REF } from '../utils/config.js';
import { resolveRefForFetch } from '../utils/ref.js';

/**
 * List cached refs and their status
 */
async function listAction(): Promise<void> {
	const spinner = ora('Loading cache information...').start();

	try {
		const refs = await getCachedRefs();

		if (refs.length === 0) {
			spinner.info('No cached refs found');
			logger.info('');
			logger.info('Use "greater cache prefetch <ref>" to populate the cache.');
			return;
		}

		spinner.succeed(`Found ${refs.length} cached ref(s)`);
		logger.info('');

		// Get detailed status for each ref
		const statuses: CacheStatus[] = [];
		for (const ref of refs) {
			const status = await getCacheStatus(ref);
			statuses.push(status);
		}

		// Display as a table
		logger.info(chalk.bold('Cached Refs:'));
		logger.info('');

		for (const status of statuses) {
			const icon = status.hasRegistryIndex ? '✓' : '○';
			const registryStatus = status.hasRegistryIndex
				? chalk.green('registry cached')
				: chalk.yellow('no registry');
			const fileCount = status.cachedFiles.length;

			logger.info(`  ${icon} ${chalk.cyan(status.ref)} - ${fileCount} file(s), ${registryStatus}`);
		}

		logger.info('');
		logger.info(`Cache location: ${chalk.dim(getCacheDir('').replace(/[/\\]$/, ''))}`);
	} catch (error) {
		spinner.fail('Failed to list cache');
		throw error;
	}
}

/**
 * Clear cache (all or specific ref)
 */
async function clearAction(ref?: string, options?: { all?: boolean }): Promise<void> {
	const spinner = ora(ref ? `Clearing cache for ${ref}...` : 'Clearing all cache...').start();

	try {
		if (ref) {
			const targetRef = await resolveRefForFetch(ref);
			const refsToClear = targetRef !== ref ? [ref, targetRef] : [ref];

			// Clear specific ref
			await Promise.all(refsToClear.flatMap((r) => [clearCache(r), clearRegistryCache(r)]));
			spinner.succeed(`Cleared cache for ${chalk.cyan(ref)}`);
		} else if (options?.all) {
			// Clear all cache
			await Promise.all([clearAllCache(), clearAllRegistryCache()]);
			spinner.succeed('Cleared all cached files');
		} else {
			// Show warning and ask for confirmation
			spinner.stop();
			logger.warn('This will clear all cached files.');
			logger.info('Use --all flag to confirm, or specify a ref to clear.');
			logger.info('');
			logger.info('Examples:');
			logger.info('  greater cache clear --all');
			logger.info('  greater cache clear greater-v4.2.0');
			return;
		}

		logger.info('');
		logger.info(chalk.dim('The cache will be repopulated automatically on next fetch.'));
	} catch (error) {
		spinner.fail('Failed to clear cache');
		throw error;
	}
}

/**
 * Resolve and validate items to prefetch
 */
interface PrefetchItem {
	type: 'face' | 'shared' | 'component';
	name: string;
	files: string[];
}

async function resolveItems(
	ref: string,
	items: string[]
): Promise<{
	items: PrefetchItem[];
	registryIndex: Awaited<ReturnType<typeof fetchRegistryIndex>>;
}> {
	const registryIndex = await fetchRegistryIndex(ref);
	const resolvedItems: PrefetchItem[] = [];

	// If no items specified, prefetch everything
	if (items.length === 0) {
		// Add all faces
		for (const faceName of getAllFaceNames(registryIndex)) {
			const checksums = getFaceChecksums(registryIndex, faceName);
			if (checksums) {
				resolvedItems.push({
					type: 'face',
					name: faceName,
					files: Object.keys(checksums),
				});
			}
		}

		// Add all shared modules
		for (const sharedName of getAllSharedNames(registryIndex)) {
			const checksums = getSharedChecksums(registryIndex, sharedName);
			if (checksums) {
				resolvedItems.push({
					type: 'shared',
					name: sharedName,
					files: Object.keys(checksums),
				});
			}
		}

		// Add all components
		for (const componentName of getAllComponentNames(registryIndex)) {
			const checksums = getComponentChecksums(registryIndex, componentName);
			if (checksums) {
				resolvedItems.push({
					type: 'component',
					name: componentName,
					files: Object.keys(checksums),
				});
			}
		}
	} else {
		// Resolve specified items
		for (const item of items) {
			// Check if it's a face
			if (item.startsWith('faces/') || getAllFaceNames(registryIndex).includes(item)) {
				const faceName = item.startsWith('faces/') ? item.slice(6) : item;
				const checksums = getFaceChecksums(registryIndex, faceName);
				if (checksums) {
					resolvedItems.push({
						type: 'face',
						name: faceName,
						files: Object.keys(checksums),
					});
				} else {
					logger.warn(`Face "${faceName}" not found in registry`);
				}
				continue;
			}

			// Check if it's a shared module
			if (item.startsWith('shared/') || getAllSharedNames(registryIndex).includes(item)) {
				const sharedName = item.startsWith('shared/') ? item.slice(7) : item;
				const checksums = getSharedChecksums(registryIndex, sharedName);
				if (checksums) {
					resolvedItems.push({
						type: 'shared',
						name: sharedName,
						files: Object.keys(checksums),
					});
				} else {
					logger.warn(`Shared module "${sharedName}" not found in registry`);
				}
				continue;
			}

			// Check if it's a component
			const checksums = getComponentChecksums(registryIndex, item);
			if (checksums) {
				resolvedItems.push({
					type: 'component',
					name: item,
					files: Object.keys(checksums),
				});
			} else {
				logger.warn(`Component "${item}" not found in registry`);
			}
		}
	}

	return { items: resolvedItems, registryIndex };
}

/**
 * Prefetch files for offline use
 */
async function prefetchAction(
	refOrItems: string,
	items: string[],
	options: { all?: boolean }
): Promise<void> {
	// Resolve the ref
	const { ref, source } = await resolveRef(refOrItems, undefined, FALLBACK_REF);
	const displayRef = source === 'explicit' ? refOrItems : ref;
	const targetRef = await resolveRefForFetch(ref);

	logger.info(`Prefetching files from ${chalk.cyan(displayRef)}...`);
	logger.info('');

	const spinner = ora('Loading registry index...').start();

	try {
		// Resolve items to prefetch
		const { items: resolvedItems } = await resolveItems(targetRef, options.all ? [] : items);

		if (resolvedItems.length === 0) {
			spinner.info('No items to prefetch');
			return;
		}

		// Calculate total files
		const totalFiles = resolvedItems.reduce((sum, item) => sum + item.files.length, 0);
		spinner.text = `Prefetching ${totalFiles} files from ${resolvedItems.length} item(s)...`;

		let fetchedCount = 0;
		let errorCount = 0;
		const errors: string[] = [];

		for (const item of resolvedItems) {
			for (const filePath of item.files) {
				try {
					await fetchFromGitTag(targetRef, filePath, { skipCache: false });
					fetchedCount++;
					spinner.text = `Prefetching... ${fetchedCount}/${totalFiles}`;
				} catch {
					errorCount++;
					errors.push(`${item.name}/${filePath.split('/').pop()}`);
				}
			}
		}

		if (errorCount > 0) {
			spinner.warn(`Prefetched ${fetchedCount}/${totalFiles} files (${errorCount} errors)`);
			logger.info('');
			logger.warn('Failed files:');
			for (const err of errors.slice(0, 5)) {
				logger.info(`  - ${err}`);
			}
			if (errors.length > 5) {
				logger.info(`  ... and ${errors.length - 5} more`);
			}
		} else {
			spinner.succeed(`Prefetched ${fetchedCount} files for offline use`);
		}

		// Show summary
		logger.info('');
		logger.info(chalk.bold('Summary:'));
		const faceCount = resolvedItems.filter((i) => i.type === 'face').length;
		const sharedCount = resolvedItems.filter((i) => i.type === 'shared').length;
		const componentCount = resolvedItems.filter((i) => i.type === 'component').length;

		if (faceCount > 0) logger.info(`  Faces: ${faceCount}`);
		if (sharedCount > 0) logger.info(`  Shared modules: ${sharedCount}`);
		if (componentCount > 0) logger.info(`  Components: ${componentCount}`);
		logger.info(`  Total files: ${fetchedCount}`);
		logger.info('');
		logger.info(chalk.dim(`Cache location: ${getCacheDir(targetRef)}`));
	} catch (error) {
		spinner.fail('Failed to prefetch');
		throw error;
	}
}

/**
 * Cache command with subcommands
 */
export const cacheCommand = new Command()
	.name('cache')
	.description('Manage the local cache for offline use');

// Subcommand: ls
cacheCommand.command('ls').alias('list').description('List all cached refs').action(listAction);

// Subcommand: clear
cacheCommand
	.command('clear [ref]')
	.description('Clear cache (all or specific ref)')
	.option('-a, --all', 'Clear all cached files')
	.action(clearAction);

// Subcommand: prefetch
cacheCommand
	.command('prefetch <ref> [items...]')
	.description('Pre-populate cache for offline use')
	.option('-a, --all', 'Prefetch all items (faces, shared, components)')
	.action(prefetchAction);
