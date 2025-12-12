/**
 * List Command Types
 * Type definitions for the enhanced list command
 */

import type { ComponentType, ComponentDomain, FaceManifest } from '../registry/index.js';

/**
 * List command options from CLI arguments
 */
export interface ListOptions {
	/** Filter by component type */
	type?: ComponentType;
	/** Filter by domain category */
	domain?: ComponentDomain;
	/** Show only installed components */
	installed?: boolean;
	/** Show only available (not installed) components */
	available?: boolean;
	/** Output as JSON */
	json?: boolean;
	/** Show detailed information for faces */
	details?: boolean;
}

/**
 * Search query for fuzzy matching
 */
export interface SearchQuery {
	/** Raw query string */
	raw: string;
	/** Normalized lowercase query */
	normalized: string;
	/** Query tokens for multi-word search */
	tokens: string[];
}

/**
 * Component display item with installation status
 */
export interface ComponentDisplayItem {
	name: string;
	type: ComponentType;
	description: string;
	version: string;
	tags: string[];
	domain?: ComponentDomain;
	lesserVersion?: string;
	dependencyCount: number;
	installed: boolean;
	installedVersion?: string;
	modified?: boolean;
	/** Match score for search results (0-1) */
	matchScore?: number;
	/** Matched terms for highlighting */
	matchedTerms?: string[];
}

/**
 * Face display item with additional face-specific info
 */
export interface FaceDisplayItem extends ComponentDisplayItem {
	type: 'face';
	includes: FaceManifest['includes'];
	styles: FaceManifest['styles'];
	recommendedShared?: string[];
	examples?: string[];
	docs?: string[];
}

/**
 * Grouped components by type for display
 */
export interface GroupedComponents {
	primitives: ComponentDisplayItem[];
	compounds: ComponentDisplayItem[];
	patterns: ComponentDisplayItem[];
	adapters: ComponentDisplayItem[];
	shared: ComponentDisplayItem[];
	faces: FaceDisplayItem[];
}

/**
 * JSON output format for machine-readable output
 */
export interface ListJsonOutput {
	version: string;
	timestamp: string;
	query?: string;
	filters: {
		type?: ComponentType;
		domain?: ComponentDomain;
		installed?: boolean;
		available?: boolean;
	};
	stats: {
		total: number;
		installed: number;
		available: number;
		byType: Record<ComponentType, number>;
	};
	components: ComponentDisplayItem[];
	faces?: FaceDisplayItem[];
}

/**
 * Display configuration for terminal output
 */
export interface DisplayConfig {
	/** Use box-drawing characters */
	useBoxDrawing: boolean;
	/** Enable color output */
	useColors: boolean;
	/** Maximum description length before truncation */
	maxDescriptionLength: number;
	/** Show dependency count */
	showDependencies: boolean;
	/** Show Lesser version requirements */
	showLesserVersion: boolean;
	/** Highlight search matches */
	highlightMatches: boolean;
}

/**
 * Type colors for terminal output
 */
export const TYPE_COLORS: Record<ComponentType, string> = {
	primitive: 'cyan',
	compound: 'green',
	pattern: 'yellow',
	adapter: 'magenta',
	shared: 'blue',
	face: 'red',
};

/**
 * Type display labels
 */
export const TYPE_LABELS: Record<ComponentType, string> = {
	primitive: 'Primitives',
	compound: 'Compound Components',
	pattern: 'Patterns',
	adapter: 'Adapters',
	shared: 'Shared Modules',
	face: 'Faces',
};

/**
 * Box drawing characters for terminal output
 */
export const BOX_CHARS = {
	topLeft: '┌',
	topRight: '┐',
	bottomLeft: '└',
	bottomRight: '┘',
	horizontal: '─',
	vertical: '│',
	teeRight: '├',
	teeLeft: '┤',
	teeDown: '┬',
	teeUp: '┴',
	cross: '┼',
} as const;
