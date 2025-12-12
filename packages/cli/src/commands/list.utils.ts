/**
 * List Command Utilities
 * Helper functions for filtering, searching, and formatting component lists
 */

import type { ComponentMetadata, ComponentType, ComponentDomain } from '../registry/index.js';
import type { InstalledComponent } from '../utils/config.js';
import type { FaceManifest } from '../registry/index.js';
import type {
	ListOptions,
	SearchQuery,
	ComponentDisplayItem,
	FaceDisplayItem,
	GroupedComponents,
	ListJsonOutput,
	DisplayConfig,
} from './list.types.js';

/**
 * Default display configuration
 */
export const DEFAULT_DISPLAY_CONFIG: DisplayConfig = {
	useBoxDrawing: true,
	useColors: true,
	maxDescriptionLength: 60,
	showDependencies: true,
	showLesserVersion: true,
	highlightMatches: true,
};

/**
 * Parse search query into normalized tokens
 */
export function parseSearchQuery(query: string): SearchQuery {
	const normalized = query.toLowerCase().trim();
	const tokens = normalized.split(/\s+/).filter(Boolean);
	return { raw: query, normalized, tokens };
}

/**
 * Calculate fuzzy match score between query and text
 * Returns a score between 0 (no match) and 1 (exact match)
 */
export function fuzzyMatch(
	query: SearchQuery,
	text: string
): { score: number; matchedTerms: string[] } {
	const normalizedText = text.toLowerCase();
	const matchedTerms: string[] = [];
	let totalScore = 0;

	// Check for exact match
	if (normalizedText === query.normalized) {
		return { score: 1, matchedTerms: [query.raw] };
	}

	// Check for substring match
	if (normalizedText.includes(query.normalized)) {
		totalScore += 0.8;
		matchedTerms.push(query.raw);
	}

	// Check individual tokens
	for (const token of query.tokens) {
		if (normalizedText.includes(token)) {
			totalScore += 0.3 / query.tokens.length;
			if (!matchedTerms.includes(token)) {
				matchedTerms.push(token);
			}
		}
	}

	// Check for word boundary matches (higher score)
	const words = normalizedText.split(/[\s\-_]+/);
	for (const token of query.tokens) {
		if (words.some((word) => word.startsWith(token))) {
			totalScore += 0.2 / query.tokens.length;
		}
	}

	return { score: Math.min(totalScore, 1), matchedTerms };
}

/**
 * Search components by name, description, and tags
 */
export function searchComponentsList(
	components: ComponentMetadata[],
	query: SearchQuery
): Array<ComponentMetadata & { matchScore: number; matchedTerms: string[] }> {
	if (!query.normalized) {
		return components.map((c) => ({ ...c, matchScore: 1, matchedTerms: [] }));
	}

	const results: Array<ComponentMetadata & { matchScore: number; matchedTerms: string[] }> = [];

	for (const component of components) {
		const allMatchedTerms: string[] = [];
		let maxScore = 0;

		// Match against name (highest weight)
		const nameMatch = fuzzyMatch(query, component.name);
		if (nameMatch.score > 0) {
			maxScore = Math.max(maxScore, nameMatch.score);
			allMatchedTerms.push(...nameMatch.matchedTerms);
		}

		// Match against description
		const descMatch = fuzzyMatch(query, component.description);
		if (descMatch.score > 0) {
			maxScore = Math.max(maxScore, descMatch.score * 0.7);
			allMatchedTerms.push(...descMatch.matchedTerms);
		}

		// Match against tags
		for (const tag of component.tags) {
			const tagMatch = fuzzyMatch(query, tag);
			if (tagMatch.score > 0) {
				maxScore = Math.max(maxScore, tagMatch.score * 0.5);
				allMatchedTerms.push(...tagMatch.matchedTerms);
			}
		}

		if (maxScore > 0) {
			results.push({
				...component,
				matchScore: maxScore,
				matchedTerms: [...new Set(allMatchedTerms)],
			});
		}
	}

	// Sort by match score descending
	return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Filter components by type
 */
export function filterByType(
	components: ComponentMetadata[],
	type: ComponentType
): ComponentMetadata[] {
	return components.filter((c) => c.type === type);
}

/**
 * Filter components by domain
 */
export function filterByDomain(
	components: ComponentMetadata[],
	domain: ComponentDomain
): ComponentMetadata[] {
	return components.filter((c) => c.domain === domain);
}

/**
 * Check if a component is installed
 */
export function isInstalled(
	componentName: string,
	installedComponents: InstalledComponent[]
): InstalledComponent | undefined {
	return installedComponents.find((c) => c.name === componentName);
}

/**
 * Filter components by installation status
 */
export function filterByInstallationStatus(
	components: ComponentMetadata[],
	installedComponents: InstalledComponent[],
	showInstalled: boolean
): ComponentMetadata[] {
	return components.filter((c) => {
		const installed = isInstalled(c.name, installedComponents);
		return showInstalled ? !!installed : !installed;
	});
}

/**
 * Convert ComponentMetadata to ComponentDisplayItem
 */
export function toDisplayItem(
	component: ComponentMetadata,
	installedComponents: InstalledComponent[],
	matchScore?: number,
	matchedTerms?: string[]
): ComponentDisplayItem {
	const installed = isInstalled(component.name, installedComponents);

	return {
		name: component.name,
		type: component.type,
		description: component.description,
		version: component.version,
		tags: component.tags,
		domain: component.domain,
		lesserVersion: component.lesserVersion,
		dependencyCount: component.registryDependencies.length,
		installed: !!installed,
		installedVersion: installed?.version,
		modified: installed?.modified,
		matchScore,
		matchedTerms,
	};
}

/**
 * Convert FaceManifest to FaceDisplayItem
 */
export function toFaceDisplayItem(
	face: FaceManifest,
	installedComponents: InstalledComponent[],
	matchScore?: number,
	matchedTerms?: string[]
): FaceDisplayItem {
	const installed = isInstalled(face.name, installedComponents);

	return {
		name: face.name,
		type: 'face',
		description: face.description,
		version: face.version,
		tags: face.tags,
		domain: face.domain,
		lesserVersion: face.lesserVersion,
		dependencyCount:
			face.includes.primitives.length +
			face.includes.shared.length +
			face.includes.patterns.length +
			face.includes.components.length,
		installed: !!installed,
		installedVersion: installed?.version,
		modified: installed?.modified,
		matchScore,
		matchedTerms,
		includes: face.includes,
		styles: face.styles,
		recommendedShared: face.recommendedShared,
		examples: face.examples,
		docs: face.docs,
	};
}

/**
 * Group components by type
 */
export function groupByType(
	components: ComponentDisplayItem[],
	faces: FaceDisplayItem[]
): GroupedComponents {
	return {
		primitives: components.filter((c) => c.type === 'primitive'),
		compounds: components.filter((c) => c.type === 'compound'),
		patterns: components.filter((c) => c.type === 'pattern'),
		adapters: components.filter((c) => c.type === 'adapter'),
		shared: components.filter((c) => c.type === 'shared'),
		faces,
	};
}

/**
 * Apply all filters to components
 */
export function applyFilters(
	components: ComponentMetadata[],
	installedComponents: InstalledComponent[],
	options: ListOptions
): ComponentMetadata[] {
	let filtered = [...components];

	if (options.type) {
		filtered = filterByType(filtered, options.type);
	}

	if (options.domain) {
		filtered = filterByDomain(filtered, options.domain);
	}

	if (options.installed) {
		filtered = filterByInstallationStatus(filtered, installedComponents, true);
	} else if (options.available) {
		filtered = filterByInstallationStatus(filtered, installedComponents, false);
	}

	return filtered;
}

/**
 * Build JSON output structure
 */
export function buildJsonOutput(
	components: ComponentDisplayItem[],
	faces: FaceDisplayItem[],
	options: ListOptions,
	query?: string
): ListJsonOutput {
	const allItems = [...components, ...faces];
	const installedCount = allItems.filter((c) => c.installed).length;

	const byType: Record<ComponentType, number> = {
		primitive: 0,
		compound: 0,
		pattern: 0,
		adapter: 0,
		shared: 0,
		face: 0,
	};

	for (const item of allItems) {
		byType[item.type]++;
	}

	return {
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		query,
		filters: {
			type: options.type,
			domain: options.domain,
			installed: options.installed,
			available: options.available,
		},
		stats: {
			total: allItems.length,
			installed: installedCount,
			available: allItems.length - installedCount,
			byType,
		},
		components,
		faces: faces.length > 0 ? faces : undefined,
	};
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
}

/**
 * Highlight matched terms in text
 */
export function highlightMatches(
	text: string,
	matchedTerms: string[],
	highlightFn: (text: string) => string
): string {
	if (!matchedTerms.length) return text;

	let result = text;
	for (const term of matchedTerms) {
		const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
		result = result.replace(regex, (match) => highlightFn(match));
	}
	return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
