/**
 * List Command Display Formatters
 * Terminal output formatting with box-drawing and color coding
 */

import chalk from 'chalk';
import type {
	ComponentDisplayItem,
	FaceDisplayItem,
	GroupedComponents,
	DisplayConfig,
} from './list.types.js';
import { TYPE_COLORS, TYPE_LABELS } from './list.types.js';
import { truncate, highlightMatches, DEFAULT_DISPLAY_CONFIG } from './list.utils.js';
import { logger } from '../utils/logger.js';

/**
 * Get chalk color function for component type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTypeColor(type: keyof typeof TYPE_COLORS): any {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const colorMap: Record<string, any> = {
		cyan: chalk.cyan,
		green: chalk.green,
		yellow: chalk.yellow,
		magenta: chalk.magenta,
		blue: chalk.blue,
		red: chalk.red,
	};
	return colorMap[TYPE_COLORS[type]] || chalk.white;
}

/**
 * Create a section header with box-drawing characters
 */
export function createSectionHeader(
	_title: string,
	count: number,
	type: keyof typeof TYPE_COLORS,
	config: DisplayConfig = DEFAULT_DISPLAY_CONFIG
): string {
	const color = getTypeColor(type);
	const label = `${TYPE_LABELS[type]} (${count})`;

	if (config.useBoxDrawing) {
		const width = Math.max(label.length + 4, 50);
		const topBorder = '┌' + '─'.repeat(width - 2) + '┐';
		const bottomBorder = '└' + '─'.repeat(width - 2) + '┘';
		const paddedLabel = ` ${label} `.padEnd(width - 2);

		return [
			color(topBorder),
			color('│') + chalk.bold(paddedLabel) + color('│'),
			color(bottomBorder),
		].join('\n');
	}

	return color.bold(`\n${label}\n${'─'.repeat(50)}`);
}

/**
 * Format installation status indicator
 */
export function formatInstallStatus(item: ComponentDisplayItem): string {
	if (item.installed) {
		const status = chalk.green('✓');
		const version = item.installedVersion ? chalk.dim(` v${item.installedVersion}`) : '';
		const modified = item.modified ? chalk.yellow(' (modified)') : '';
		return `${status}${version}${modified}`;
	}
	return chalk.dim('○');
}

/**
 * Format a single component item for display
 */
export function formatComponentItem(
	item: ComponentDisplayItem,
	config: DisplayConfig = DEFAULT_DISPLAY_CONFIG
): string {
	const lines: string[] = [];
	const typeColor = getTypeColor(item.type);

	// Name and status
	const status = formatInstallStatus(item);
	const name = typeColor.bold(item.name);
	const tags = item.tags
		.slice(0, 3)
		.map((t) => chalk.dim(`#${t}`))
		.join(' ');

	lines.push(`${status} ${name} ${tags}`);

	// Description (with optional highlighting)
	let description = truncate(item.description, config.maxDescriptionLength);
	if (config.highlightMatches && item.matchedTerms?.length) {
		description = highlightMatches(description, item.matchedTerms, chalk.yellow);
	}
	lines.push(`   ${chalk.dim(description)}`);

	// Additional info line
	const info: string[] = [];

	if (config.showDependencies && item.dependencyCount > 0) {
		info.push(chalk.dim(`deps: ${item.dependencyCount}`));
	}

	if (config.showLesserVersion && item.lesserVersion) {
		info.push(chalk.dim(`lesser: ${item.lesserVersion}`));
	}

	if (item.domain) {
		info.push(chalk.dim(`domain: ${item.domain}`));
	}

	if (info.length > 0) {
		lines.push(`   ${info.join(' │ ')}`);
	}

	return lines.join('\n');
}

/**
 * Format face details for --details flag
 */
export function formatFaceDetails(face: FaceDisplayItem): string {
	const lines: string[] = [];
	const color = getTypeColor('face');

	// Header
	lines.push(color.bold(`\n${face.name} Face Details`));
	lines.push(chalk.dim('─'.repeat(50)));

	// Description
	lines.push(chalk.white(face.description));
	lines.push('');

	// Included components
	lines.push(chalk.bold('Included Components:'));

	if (face.includes.primitives.length > 0) {
		lines.push(`  ${chalk.cyan('Primitives:')} ${face.includes.primitives.join(', ')}`);
	}
	if (face.includes.shared.length > 0) {
		lines.push(`  ${chalk.blue('Shared:')} ${face.includes.shared.join(', ')}`);
	}
	if (face.includes.patterns.length > 0) {
		lines.push(`  ${chalk.yellow('Patterns:')} ${face.includes.patterns.join(', ')}`);
	}
	if (face.includes.components.length > 0) {
		lines.push(`  ${chalk.green('Components:')} ${face.includes.components.join(', ')}`);
	}

	// Recommended shared modules
	if (face.recommendedShared?.length) {
		lines.push('');
		lines.push(chalk.bold('Recommended Shared Modules:'));
		lines.push(`  ${face.recommendedShared.join(', ')}`);
	}

	// CSS entry points
	lines.push('');
	lines.push(chalk.bold('CSS Entry Points:'));
	lines.push(`  ${chalk.dim('Main:')} ${face.styles.main}`);
	if (face.styles.tokens) {
		lines.push(`  ${chalk.dim('Tokens:')} ${face.styles.tokens}`);
	}

	// Examples
	if (face.examples?.length) {
		lines.push('');
		lines.push(chalk.bold('Examples:'));
		for (const example of face.examples) {
			lines.push(`  ${chalk.dim('•')} ${example}`);
		}
	}

	// Documentation
	if (face.docs?.length) {
		lines.push('');
		lines.push(chalk.bold('Documentation:'));
		for (const doc of face.docs) {
			lines.push(`  ${chalk.dim('•')} ${doc}`);
		}
	}

	return lines.join('\n');
}

/**
 * Display grouped components
 */
export function displayGroupedComponents(
	grouped: GroupedComponents,
	config: DisplayConfig = DEFAULT_DISPLAY_CONFIG,
	showDetails: boolean = false
): void {
	const sections: Array<{ type: keyof typeof TYPE_COLORS; items: ComponentDisplayItem[] }> = [
		{ type: 'primitive', items: grouped.primitives },
		{ type: 'compound', items: grouped.compounds },
		{ type: 'pattern', items: grouped.patterns },
		{ type: 'adapter', items: grouped.adapters },
		{ type: 'shared', items: grouped.shared },
		{ type: 'face', items: grouped.faces },
	];

	for (const section of sections) {
		if (section.items.length === 0) continue;

		logger.info(
			createSectionHeader(TYPE_LABELS[section.type], section.items.length, section.type, config)
		);
		logger.newline();

		for (const item of section.items) {
			logger.info(formatComponentItem(item, config));
			logger.newline();
		}

		// Show face details if requested
		if (showDetails && section.type === 'face') {
			for (const face of grouped.faces) {
				logger.info(formatFaceDetails(face));
				logger.newline();
			}
		}
	}
}

/**
 * Display summary footer
 */
export function displaySummary(total: number, installed: number, filtered: boolean): void {
	logger.info(chalk.dim('─'.repeat(50)));

	const parts: string[] = [];
	parts.push(`Total: ${total} components`);
	parts.push(`Installed: ${chalk.green(installed.toString())}`);
	parts.push(`Available: ${chalk.cyan((total - installed).toString())}`);

	if (filtered) {
		parts.push(chalk.dim('(filtered)'));
	}

	logger.info(chalk.dim(parts.join(' │ ')));
	logger.newline();
	logger.info(chalk.dim('Add components with: ') + chalk.cyan('greater add <component>'));
	logger.info(chalk.dim('Show face details: ') + chalk.cyan('greater list faces/social --details'));
	logger.newline();
}

/**
 * Display search results header
 */
export function displaySearchHeader(query: string, resultCount: number): void {
	logger.info(chalk.bold(`\n🔍 Search results for "${query}"`));
	logger.info(chalk.dim(`Found ${resultCount} matching components\n`));
}

/**
 * Display no results message
 */
export function displayNoResults(query?: string): void {
	if (query) {
		logger.info(chalk.yellow(`\nNo components found matching "${query}"`));
		logger.info(chalk.dim('Try a different search term or remove filters\n'));
	} else {
		logger.info(chalk.yellow('\nNo components match the specified filters'));
		logger.info(chalk.dim('Try removing some filters\n'));
	}
}
