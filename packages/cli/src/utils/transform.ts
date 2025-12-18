/**
 * Import Path Transformation Engine
 * Transforms legacy/internal Greater Components import paths to a consumer-friendly layout.
 *
 * - Canonicalizes legacy hyphenated packages (e.g. `@equaltoai/greater-components-utils`)
 *   to umbrella subpath imports (e.g. `@equaltoai/greater-components/utils`).
 * - Rewrites shared module imports to local CLI-installed paths based on `components.json`
 *   (e.g. `@equaltoai/greater-components-auth` → `$lib/components/auth` by default).
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
 * Legacy package rewrites (hyphenated → umbrella subpath).
 */
const LEGACY_PACKAGE_REWRITES: Record<string, string> = {
	'@equaltoai/greater-components-primitives': '@equaltoai/greater-components/primitives',
	'@equaltoai/greater-components-icons': '@equaltoai/greater-components/icons',
	'@equaltoai/greater-components-tokens': '@equaltoai/greater-components/tokens',
	'@equaltoai/greater-components-utils': '@equaltoai/greater-components/utils',
	'@equaltoai/greater-components-content': '@equaltoai/greater-components/content',
	'@equaltoai/greater-components-adapters': '@equaltoai/greater-components/adapters',
	'@equaltoai/greater-components-headless': '@equaltoai/greater-components/headless',
	// Social face legacy name
	'@equaltoai/greater-components-fediverse': '@equaltoai/greater-components/faces/social',
};

/**
 * Shared module package names that can be installed locally by the CLI.
 */
const SHARED_MODULES = [
	'auth',
	'admin',
	'compose',
	'messaging',
	'search',
	'notifications',
	'chat',
] as const;

const HEADLESS_PRIMITIVE_SUBPATHS = ['button', 'menu', 'modal', 'tooltip', 'tabs'] as const;

/**
 * Core packages that should be mapped to the greater alias
 */
const CORE_PACKAGES = [
	'primitives',
	'icons',
	'tokens',
	'utils',
	'content',
	'adapters',
	'headless',
] as const;

/**
 * Build path mappings from config aliases
 */
export function buildPathMappings(config: ComponentConfig): PathMapping[] {
	const mappings: PathMapping[] = [];
	const aliases = config.aliases;
	const isVendoredMode = config.installMode === 'vendored';

	// Local shared modules (preferred when installed via CLI)
	for (const shared of SHARED_MODULES) {
		mappings.push({
			from: `@equaltoai/greater-components/shared/${shared}`,
			to: `${aliases.components}/${shared}`,
			isGlob: false,
		});
		mappings.push({
			from: `@equaltoai/greater-components-${shared}`,
			to: `${aliases.components}/${shared}`,
			isGlob: false,
		});
	}

	// Headless primitives should resolve to locally installed builders.
	// Only apply specific mappings in non-vendored mode (hybrid),
	// as vendored mode handles headless via the generic core package mapping.
	if (!isVendoredMode) {
		for (const primitive of HEADLESS_PRIMITIVE_SUBPATHS) {
			mappings.push({
				from: `@equaltoai/greater-components-headless/${primitive}`,
				to: `${aliases.hooks}/${primitive}`,
				isGlob: false,
			});
			mappings.push({
				from: `@equaltoai/greater-components/headless/${primitive}`,
				to: `${aliases.hooks}/${primitive}`,
				isGlob: false,
			});
		}
	}

	// Core packages mapped to greater alias in fully-vendored mode.
	if (isVendoredMode) {
		for (const pkg of CORE_PACKAGES) {
			mappings.push({
				from: `@equaltoai/greater-components/${pkg}`,
				to: `${aliases.greater}/${pkg}`,
				isGlob: false,
			});
			mappings.push({
				from: `@equaltoai/greater-components-${pkg}`,
				to: `${aliases.greater}/${pkg}`,
				isGlob: false,
			});
		}
	}

	// Legacy package rewrites (hyphenated → umbrella subpath)
	// Only apply these in hybrid mode (vendored mode rewrites core packages locally).
	if (!isVendoredMode) {
		for (const [from, to] of Object.entries(LEGACY_PACKAGE_REWRITES)) {
			mappings.push({ from, to, isGlob: false });
		}
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
	// Side-effect imports: import 'path'
	sideEffectImport: /import\s*(['"])([^'"]+)\1/g,
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
	if (!content.includes('@equaltoai/greater-components')) return false;

	const stripped = stripComments(stripHtmlComments(content));

	for (const pattern of [
		IMPORT_PATTERNS.esImport,
		IMPORT_PATTERNS.dynamicImport,
		IMPORT_PATTERNS.reExport,
		IMPORT_PATTERNS.cssImport,
		IMPORT_PATTERNS.sideEffectImport,
	]) {
		pattern.lastIndex = 0;
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(stripped)) !== null) {
			const importPath = match[2];
			if (importPath?.includes('@equaltoai/greater-components')) return true;
		}
	}

	return false;
}

type StripState = 'normal' | 'line-comment' | 'block-comment' | 'single' | 'double' | 'template';

function stripHtmlComments(content: string): string {
	if (!content.includes('<!--')) return content;

	return content.replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\n]/g, ' '));
}

function stripComments(content: string): string {
	let state: StripState = 'normal';
	let result = '';

	for (let i = 0; i < content.length; i++) {
		const char = content[i] ?? '';
		const next = content[i + 1] ?? '';

		if (state === 'line-comment') {
			if (char === '\n') {
				state = 'normal';
				result += '\n';
			} else {
				result += ' ';
			}
			continue;
		}

		if (state === 'block-comment') {
			if (char === '*' && next === '/') {
				state = 'normal';
				result += '  ';
				i++;
				continue;
			}

			if (char === '\n') {
				result += '\n';
			} else {
				result += ' ';
			}
			continue;
		}

		if (state === 'single') {
			result += char;
			if (char === '\\') {
				result += next;
				i++;
				continue;
			}
			if (char === "'") state = 'normal';
			continue;
		}

		if (state === 'double') {
			result += char;
			if (char === '\\') {
				result += next;
				i++;
				continue;
			}
			if (char === '"') state = 'normal';
			continue;
		}

		if (state === 'template') {
			result += char;
			if (char === '\\') {
				result += next;
				i++;
				continue;
			}
			if (char === '`') state = 'normal';
			continue;
		}

		// normal
		if (char === '/' && next === '/') {
			state = 'line-comment';
			result += '  ';
			i++;
			continue;
		}

		if (char === '/' && next === '*') {
			state = 'block-comment';
			result += '  ';
			i++;
			continue;
		}

		if (char === "'") {
			state = 'single';
			result += char;
			continue;
		}

		if (char === '"') {
			state = 'double';
			result += char;
			continue;
		}

		if (char === '`') {
			state = 'template';
			result += char;
			continue;
		}

		result += char;
	}

	return result;
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
