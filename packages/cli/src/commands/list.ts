/**
 * List command - List all available components with filtering, search, and JSON output
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { componentRegistry } from '../registry/index.js';
import { sharedModuleRegistry } from '../registry/shared.js';
import { patternRegistry } from '../registry/patterns.js';
import { faceRegistry, getFaceManifest } from '../registry/faces.js';
import { readConfig, configExists, type InstalledComponent } from '../utils/config.js';
import { fetchRegistryIndex, resolveRef } from '../utils/registry-index.js';
import { resolveRefForFetch } from '../utils/ref.js';
import { logger } from '../utils/logger.js';
import type { ComponentMetadata } from '../registry/index.js';
import type { ListOptions } from './list.types.js';
import {
	parseSearchQuery,
	searchComponentsList,
	applyFilters,
	toDisplayItem,
	toFaceDisplayItem,
	groupByType,
	buildJsonOutput,
	DEFAULT_DISPLAY_CONFIG,
} from './list.utils.js';
import {
	displayGroupedComponents,
	displaySummary,
	displaySearchHeader,
	displayNoResults,
	formatFaceDetails,
} from './list.display.js';

/**
 * Get all components from all registries
 */
function getAllComponents(): ComponentMetadata[] {
	const components: ComponentMetadata[] = [];

	// Main component registry
	components.push(...Object.values(componentRegistry));

	// Shared modules
	components.push(...(Object.values(sharedModuleRegistry) as ComponentMetadata[]));

	// Patterns
	components.push(...(Object.values(patternRegistry) as ComponentMetadata[]));

	return components;
}

/**
 * When `--ref` is supplied, list the registry index from that tag
 * directly. Local in-memory registries (`componentRegistry`,
 * `sharedModuleRegistry`, etc.) describe what the CURRENT CLI build was
 * generated against — not what a future / past tag advertises. Fetching
 * the index of an arbitrary tag lets consumers preview what `greater
 * add --ref <tag>` would offer before adopting that tag. Reported as
 * host FYI #2 during Project 41 PR-A review; tracked as PR-E item 13.
 */
async function listAtRef(ref: string, options: ListOptions): Promise<void> {
	const { ref: resolvedRef } = await resolveRef(ref, undefined, ref);
	const pinnedSha = await resolveRefForFetch(resolvedRef);
	const refLabel =
		pinnedSha === resolvedRef ? resolvedRef : `${resolvedRef} (pinned to ${pinnedSha})`;

	if (!options.json) {
		logger.info(chalk.bold(`\n📦 Greater Components @ ${refLabel}\n`));
		logger.note(chalk.dim('Fetching registry index from the named ref...'));
	}

	const index = await fetchRegistryIndex(pinnedSha);

	if (options.json) {
		logger.info(
			JSON.stringify(
				{
					ref: resolvedRef,
					pinnedSha,
					version: index.version,
					components: Object.keys(index.components ?? {}).sort(),
					faces: Object.keys(index.faces ?? {}).sort(),
					shared: Object.keys(index.shared ?? {}).sort(),
				},
				null,
				2
			)
		);
		return;
	}

	logger.newline();
	const sections: Array<[string, Record<string, { version: string; description?: string }>]> = [
		['Components', index.components ?? {}],
		['Shared modules', index.shared ?? {}],
		['Faces', index.faces ?? {}],
	];

	for (const [label, entries] of sections) {
		const names = Object.keys(entries).sort();
		if (names.length === 0) continue;
		logger.info(chalk.bold(`${label} (${names.length}):`));
		for (const name of names) {
			const entry = entries[name];
			const versionText = entry?.version ? chalk.dim(` @${entry.version}`) : '';
			const descText = entry?.description ? chalk.dim(` — ${entry.description}`) : '';
			logger.info(`  • ${chalk.cyan(name)}${versionText}${descText}`);
		}
		logger.newline();
	}

	logger.note(chalk.dim(`To install from this ref:  greater add <name> --ref ${resolvedRef}`));
	logger.newline();
}

export const listAction = async (query: string | undefined, options: ListOptions) => {
	// When `--ref` is supplied, defer to the remote-ref path. The local
	// in-memory registries do not describe arbitrary tags.
	if (options.ref) {
		await listAtRef(options.ref, options);
		return;
	}

	// Load config to get installed components
	let installedComponents: InstalledComponent[] = [];

	if (await configExists()) {
		try {
			const config = await readConfig();
			installedComponents = config?.installed || [];
		} catch {
			// Config exists but couldn't be loaded, continue without installed info
		}
	}

	// Get all components
	let components = getAllComponents();

	// Handle face-specific queries (e.g., "faces/social")
	const faceMatch = query?.match(/^faces?\/(\w+)$/i);
	if (faceMatch) {
		const faceName = (faceMatch[1] ?? '').toLowerCase();
		const face = getFaceManifest(faceName);

		if (face) {
			if (options.json) {
				const faceItem = toFaceDisplayItem(face, installedComponents);
				logger.info(JSON.stringify(faceItem, null, 2));
				return;
			}

			if (options.details) {
				const faceItem = toFaceDisplayItem(face, installedComponents);
				logger.info(formatFaceDetails(faceItem));
				return;
			}

			// Show face summary
			// const faceItem = toFaceDisplayItem(face, installedComponents);
			logger.info(chalk.bold(`\n📦 ${face.name} Face\n`));
			logger.info(chalk.dim(face.description));
			logger.newline();
			logger.info(chalk.dim('Use --details to see included components and CSS entry points'));
			return;
		} else {
			logger.error(chalk.red(`Face "${faceName}" not found`));
			logger.info(chalk.dim('Available faces: ' + Object.keys(faceRegistry).join(', ')));
			return;
		}
	}

	// Apply search if query provided
	let searchResults: Array<ComponentMetadata & { matchScore?: number; matchedTerms?: string[] }> =
		[];
	if (query && !faceMatch) {
		const searchQuery = parseSearchQuery(query);
		searchResults = searchComponentsList(components, searchQuery);
		components = searchResults;
	}

	// Apply filters
	components = applyFilters(components, installedComponents, options);

	// Get faces (apply type filter)
	let faces = Object.values(faceRegistry);
	if (options.type && options.type !== 'face') {
		faces = [];
	} else if (options.type === 'face') {
		components = [];
	}

	// Apply domain filter to faces
	if (options.domain) {
		faces = faces.filter((f) => f.domain === options.domain);
	}

	// Convert to display items
	const displayItems = components.map((c) => {
		const searchResult = searchResults.find((sr) => sr.name === c.name);
		return toDisplayItem(
			c,
			installedComponents,
			searchResult?.matchScore,
			searchResult?.matchedTerms
		);
	});

	const faceDisplayItems = faces.map((f) => toFaceDisplayItem(f, installedComponents));

	// Check for no results
	if (displayItems.length === 0 && faceDisplayItems.length === 0) {
		if (options.json) {
			logger.info(JSON.stringify(buildJsonOutput([], [], options, query), null, 2));
		} else {
			displayNoResults(query);
		}
		return;
	}

	// Output as JSON if requested
	if (options.json) {
		const jsonOutput = buildJsonOutput(displayItems, faceDisplayItems, options, query);
		logger.info(JSON.stringify(jsonOutput, null, 2));
		return;
	}

	// Display header
	logger.info(chalk.bold('\n📦 Greater Components\n'));

	// Show search header if searching
	if (query) {
		displaySearchHeader(query, displayItems.length + faceDisplayItems.length);
	}

	// Group and display
	const grouped = groupByType(displayItems, faceDisplayItems);
	displayGroupedComponents(grouped, DEFAULT_DISPLAY_CONFIG, options.details);

	// Display summary
	const totalInstalled = [...displayItems, ...faceDisplayItems].filter((c) => c.installed).length;
	const isFiltered = !!(
		options.type ||
		options.domain ||
		options.installed ||
		options.available ||
		query
	);
	displaySummary(displayItems.length + faceDisplayItems.length, totalInstalled, isFiltered);
};

export const listCommand = new Command()
	.name('list')
	.description('List all available components with filtering and search')
	.argument('[query]', 'Search query to filter components by name, description, or tags')
	.option(
		'-t, --type <type>',
		'Filter by type (primitive, compound, pattern, adapter, shared, face)'
	)
	.option(
		'--domain <domain>',
		'Filter by domain (social, blog, community, artist, auth, admin, chat, core)'
	)
	.option('--installed', 'Show only installed components')
	.option('--available', 'Show only not-installed components')
	.option('--json', 'Output as JSON for machine-readable format')
	.option('--details', 'Show detailed information for faces')
	.option(
		'--ref <tag>',
		'List the registry of an arbitrary published tag (e.g. "greater-v0.9.1-rc.2"). When set, the local in-memory registry is bypassed and the named ref is fetched from GitHub'
	)
	.action(listAction);
