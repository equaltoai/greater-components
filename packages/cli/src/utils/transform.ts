/**
 * Import Path Transformation Engine
 * Transforms internal Greater Components import paths to consumer project aliases
 */

import type { ComponentConfig } from './config.js';

/**
 * Path mapping rule for transforming imports
 */
export interface PathMapping {
	/** Source pattern to match (supports glob-like patterns) */
	from: string;
	/** Target alias to replace with */
	to: string;
	/** Whether this is a glob pattern */
	isGlob?: boolean;
}

/**
 * Transformation result with statistics
 */
export interface TransformResult {
	/** Transformed content */
	content: string;
	/** Number of imports transformed */
	transformedCount: number;
	/** List of transformed import paths */
	transformedPaths: Array<{ from: string; to: string }>;
	/** Whether any transformations were made */
	hasChanges: boolean;
}

/**
 * Default path mappings for Greater Components internal packages
 * Maps internal package names to consumer alias keys
 *
 * Based on official Greater Components v3.0.0+ package structure:
 * - /primitives - Core UI components (Button, Card, Modal, etc.)
 * - /headless - Behavior-only components (no styling)
 * - /utils - Shared helper functions
 * - /icons - Feather icons and custom icons
 * - /tokens - Design system tokens and CSS variables
 * - /adapters - Protocol adapters (Lesser GraphQL)
 * - /content - Rich content rendering (CodeBlock, MarkdownRenderer)
 * - /faces/social - Twitter/Mastodon-style UI (Timeline, Status)
 * - /shared/* - Shared components (auth, admin, compose, messaging, search, notifications)
 */
const DEFAULT_PATH_MAPPINGS: Record<string, keyof ComponentConfig['aliases']> = {
	// Current v3.0.0+ slash-based paths (official)
	'@equaltoai/greater-components/primitives': 'ui',
	'@equaltoai/greater-components/headless': 'hooks',
	'@equaltoai/greater-components/utils': 'utils',
	'@equaltoai/greater-components/icons': 'ui',
	'@equaltoai/greater-components/tokens': 'ui',
	'@equaltoai/greater-components/adapters': 'lib',
	'@equaltoai/greater-components/content': 'ui',
	// Legacy hyphenated paths (for backwards compatibility)
	'@equaltoai/greater-components-primitives': 'ui',
	'@equaltoai/greater-components-headless': 'hooks',
	'@equaltoai/greater-components-utils': 'utils',
	'@equaltoai/greater-components-icons': 'ui',
	'@equaltoai/greater-components-tokens': 'ui',
	'@equaltoai/greater-components-adapters': 'lib',
	'@equaltoai/greater-components-content': 'ui',
};

/**
 * Subpath mappings for headless package (e.g., /button, /modal)
 */
const HEADLESS_SUBPATHS = ['button', 'modal', 'menu', 'tooltip', 'tabs'];

/**
 * Build path mappings from config aliases
 */
export function buildPathMappings(config: ComponentConfig): PathMapping[] {
	const mappings: PathMapping[] = [];
	const aliases = config.aliases;

	// Add headless subpath mappings first (more specific)
	for (const subpath of HEADLESS_SUBPATHS) {
		// Current v3.0.0+ format
		mappings.push({
			from: `@equaltoai/greater-components/headless/${subpath}`,
			to: `${aliases.hooks}/${subpath}`,
			isGlob: false,
		});
		// Legacy format
		mappings.push({
			from: `@equaltoai/greater-components-headless/${subpath}`,
			to: `${aliases.hooks}/${subpath}`,
			isGlob: false,
		});
	}

	// Add base package mappings
	for (const [pkg, aliasKey] of Object.entries(DEFAULT_PATH_MAPPINGS)) {
		const targetAlias = aliases[aliasKey];
		if (targetAlias) {
			mappings.push({
				from: pkg,
				to: targetAlias,
				isGlob: false,
			});
		}
	}

	// Add faces/social mapping (Twitter/Mastodon-style UI)
	mappings.push({
		from: '@equaltoai/greater-components/faces/social',
		to: aliases.ui,
		isGlob: false,
	});

	// Shared component paths (auth, admin, compose, messaging, search, notifications)
	const sharedPaths = ['auth', 'admin', 'compose', 'messaging', 'search', 'notifications'];
	for (const shared of sharedPaths) {
		mappings.push({
			from: `@equaltoai/greater-components/shared/${shared}`,
			to: `${aliases.components}/${shared}`,
			isGlob: false,
		});
	}

	return mappings;
}

/**
 * Transform a single import path using the mappings
 */
export function transformPath(importPath: string, mappings: PathMapping[]): string | null {
	// Sort mappings by length (longest first) to match most specific first
	const sortedMappings = [...mappings].sort((a, b) => b.from.length - a.from.length);

	for (const mapping of sortedMappings) {
		if (mapping.isGlob) {
			// Handle glob patterns (future extension)
			const pattern = mapping.from.replace(/\*/g, '.*');
			const regex = new RegExp(`^${pattern}`);
			if (regex.test(importPath)) {
				return importPath.replace(regex, mapping.to);
			}
		} else {
			// Exact match or prefix match
			if (importPath === mapping.from) {
				return mapping.to;
			}
			// Handle subpath imports (e.g., @pkg/primitives/Button)
			if (importPath.startsWith(mapping.from + '/')) {
				const subpath = importPath.slice(mapping.from.length);
				return mapping.to + subpath;
			}
		}
	}

	return null; // No transformation needed
}

/**
 * Regex patterns for different import types
 */
const IMPORT_PATTERNS = {
	// ES module imports: import { x } from 'path' or import x from 'path'
	esImport:
		/import\s+(?:type\s+)?(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s*,?\s*)*\s*from\s*(['"])([^'"]+)\1/g,
	// Dynamic imports: import('path') or import("path")
	dynamicImport: /import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
	// Re-exports: export { x } from 'path' or export * from 'path'
	reExport: /export\s+(?:type\s+)?(?:\{[^}]*\}|\*)\s*from\s*(['"])([^'"]+)\1/g,
	// CSS @import: @import 'path' or @import url('path')
	cssImport: /@import\s+(?:url\s*\(\s*)?(['"])([^'"]+)\1(?:\s*\))?/g,
};

/**
 * Transform imports in TypeScript/JavaScript content
 */
function transformScriptImports(content: string, mappings: PathMapping[]): TransformResult {
	let transformedContent = content;
	let transformedCount = 0;
	const transformedPaths: Array<{ from: string; to: string }> = [];

	// Process ES imports
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.esImport,
		(match, _quote, importPath) => {
			const newPath = transformPath(importPath, mappings);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	// Process dynamic imports
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.dynamicImport,
		(match, _quote, importPath) => {
			const newPath = transformPath(importPath, mappings);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	// Process re-exports
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.reExport,
		(match, _quote, importPath) => {
			const newPath = transformPath(importPath, mappings);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	return {
		content: transformedContent,
		transformedCount,
		transformedPaths,
		hasChanges: transformedCount > 0,
	};
}

/**
 * Transform CSS @import statements
 */
function transformCssImports(content: string, mappings: PathMapping[]): TransformResult {
	let transformedContent = content;
	let transformedCount = 0;
	const transformedPaths: Array<{ from: string; to: string }> = [];

	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.cssImport,
		(match, _quote, importPath) => {
			const newPath = transformPath(importPath, mappings);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	return {
		content: transformedContent,
		transformedCount,
		transformedPaths,
		hasChanges: transformedCount > 0,
	};
}

/**
 * Extract and transform script blocks from Svelte files
 */
function extractScriptBlocks(
	content: string
): Array<{ start: number; end: number; content: string }> {
	const blocks: Array<{ start: number; end: number; content: string }> = [];
	const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
	let match;

	while ((match = scriptRegex.exec(content)) !== null) {
		blocks.push({
			start: match.index,
			end: match.index + match[0].length,
			content: match[1] ?? '',
		});
	}

	return blocks;
}

/**
 * Extract and transform style blocks from Svelte files
 */
function extractStyleBlocks(
	content: string
): Array<{ start: number; end: number; content: string }> {
	const blocks: Array<{ start: number; end: number; content: string }> = [];
	const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
	let match;

	while ((match = styleRegex.exec(content)) !== null) {
		blocks.push({
			start: match.index,
			end: match.index + match[0].length,
			content: match[1] ?? '',
		});
	}

	return blocks;
}

/**
 * Transform imports in a Svelte file
 * Handles both <script> and <style> blocks
 */
export function transformSvelteImports(content: string, config: ComponentConfig): TransformResult {
	const mappings = buildPathMappings(config);
	let transformedContent = content;
	let totalTransformed = 0;
	const allTransformedPaths: Array<{ from: string; to: string }> = [];

	// Transform script blocks
	const scriptBlocks = extractScriptBlocks(content);
	// Process in reverse order to maintain correct positions
	for (const block of scriptBlocks.reverse()) {
		const result = transformScriptImports(block.content, mappings);
		if (result.hasChanges) {
			const before = transformedContent.slice(0, block.start);
			const after = transformedContent.slice(block.end);
			const tag = transformedContent.slice(
				block.start,
				block.start + transformedContent.slice(block.start).indexOf('>') + 1
			);
			const closeTag = '</script>';
			transformedContent = before + tag + result.content + closeTag + after;
			totalTransformed += result.transformedCount;
			allTransformedPaths.push(...result.transformedPaths);
		}
	}

	// Transform style blocks
	const styleBlocks = extractStyleBlocks(transformedContent);
	for (const block of styleBlocks.reverse()) {
		const result = transformCssImports(block.content, mappings);
		if (result.hasChanges) {
			const before = transformedContent.slice(0, block.start);
			const after = transformedContent.slice(block.end);
			const tag = transformedContent.slice(
				block.start,
				block.start + transformedContent.slice(block.start).indexOf('>') + 1
			);
			const closeTag = '</style>';
			transformedContent = before + tag + result.content + closeTag + after;
			totalTransformed += result.transformedCount;
			allTransformedPaths.push(...result.transformedPaths);
		}
	}

	return {
		content: transformedContent,
		transformedCount: totalTransformed,
		transformedPaths: allTransformedPaths,
		hasChanges: totalTransformed > 0,
	};
}

/**
 * Transform imports in a TypeScript file
 */
export function transformTypeScriptImports(
	content: string,
	config: ComponentConfig
): TransformResult {
	const mappings = buildPathMappings(config);
	return transformScriptImports(content, mappings);
}

/**
 * Transform imports in a CSS file
 */
export function transformCssFileImports(content: string, config: ComponentConfig): TransformResult {
	const mappings = buildPathMappings(config);
	return transformCssImports(content, mappings);
}

/**
 * Main transformation function - auto-detects file type
 * @param content File content to transform
 * @param config Component configuration with aliases
 * @param filePath Optional file path for type detection
 * @returns Transformation result
 */
export function transformImports(
	content: string,
	config: ComponentConfig,
	filePath?: string
): TransformResult {
	// Detect file type from extension or content
	const ext = filePath?.split('.').pop()?.toLowerCase();

	if (ext === 'svelte' || content.includes('<script')) {
		return transformSvelteImports(content, config);
	}

	if (ext === 'css' || ext === 'scss' || ext === 'less') {
		return transformCssFileImports(content, config);
	}

	// Default to TypeScript/JavaScript handling
	return transformTypeScriptImports(content, config);
}

/**
 * Check if content contains any Greater Components imports
 */
export function hasGreaterImports(content: string): boolean {
	return content.includes('@equaltoai/greater-components');
}

/**
 * Get a summary of transformations for logging
 */
export function getTransformSummary(results: TransformResult[]): string {
	const totalTransformed = results.reduce((sum, r) => sum + r.transformedCount, 0);
	const filesWithChanges = results.filter((r) => r.hasChanges).length;

	if (totalTransformed === 0) {
		return 'No import transformations needed';
	}

	return `Transformed ${totalTransformed} import(s) across ${filesWithChanges} file(s)`;
}
