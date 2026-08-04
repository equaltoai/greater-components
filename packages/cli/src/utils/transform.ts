/**
 * Import Path Transformation Engine
 * Transforms legacy/internal Greater Components import paths to a consumer-friendly layout.
 *
 * - Canonicalizes legacy hyphenated packages (e.g. `@equaltoai/greater-components-utils`)
 *   to umbrella subpath imports (e.g. `@equaltoai/greater-components/utils`).
 * - Rewrites shared module imports to local CLI-installed paths based on `components.json`.
 *   During a real vendored write, local targets are emitted relative to the source file so
 *   the copied tree does not depend on a consumer alias.
 */

import path from 'node:path';
import { resolveAlias, type ComponentConfig } from './config.js';

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

export interface TransformContext {
	/** Absolute path of the file as written into the consumer project. */
	sourceFilePath: string;
	/** Absolute consumer project root used to resolve components.json paths. */
	consumerRoot: string;
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
	'@equaltoai/greater-components-shell': '@equaltoai/greater-components/shell',
	'@equaltoai/greater-components-host-platform': '@equaltoai/greater-components/host-platform',
	// Social face legacy name
	'@equaltoai/greater-components-fediverse': '@equaltoai/greater-components/faces/social',
};

/**
 * Shared module package names that can be installed locally by the CLI.
 */
const SHARED_MODULES = [
	'auth',
	'admin',
	'agent',
	'compose',
	'messaging',
	'search',
	'notifications',
	'chat',
	'soul',
] as const;

const HEADLESS_PRIMITIVE_SUBPATHS = [
	'alert',
	'avatar',
	'button',
	'menu',
	'modal',
	'skeleton',
	'spinner',
	'tabs',
	'textfield',
	'tooltip',
] as const;
/**
 * Blog-face component directories whose installed layout differs from the
 * source layout: the face's `src/types.ts` installs as `lib/blog-types.ts` and
 * `src/share.ts` as `lib/blog-share.ts`, so `../../types` / `../../share`
 * imports inside these directories have to be rewritten.
 *
 * Every directory under `packages/faces/blog/src/components/` that the registry
 * ships must appear here. Omitting one produces a checksum-valid but broken
 * install: the files copy and verify, then fail to resolve `../../types.js`.
 * `audit-cli-registry.mjs` enforces the enumeration against the registry.
 */
const BLOG_COMPONENT_ROOTS = new Set([
	'Article',
	'Author',
	'Publication',
	'Navigation',
	'Editor',
	'Review',
]);

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
	'shell',
	'host-platform',
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

const SCRIPT_FILE_EXTENSION_RE = /\.(?:svelte\.)?[cm]?[jt]s$/;

function normalizeTransformFilePath(filePath?: string): string {
	return filePath?.replace(/\\/g, '/').replace(/^\/+/, '') ?? '';
}

function isHeadlessPrimitiveSourceFile(filePath?: string): boolean {
	const normalized = normalizeTransformFilePath(filePath);
	if (!normalized) return false;

	if (normalized.startsWith('lib/primitives/')) return true;
	if (normalized.includes('/')) return false;

	const rootFile = normalized.replace(SCRIPT_FILE_EXTENSION_RE, '');
	return (
		rootFile !== normalized && (HEADLESS_PRIMITIVE_SUBPATHS as readonly string[]).includes(rootFile)
	);
}

function isFlattenedFaceLibInstall(filePath?: string): boolean {
	const normalized = normalizeTransformFilePath(filePath);
	if (!normalized) return false;

	if (isHeadlessPrimitiveSourceFile(normalized)) return false;
	if (normalized.startsWith('lib/lib/')) return true;
	if (normalized.includes('/')) return false;

	return SCRIPT_FILE_EXTENSION_RE.test(normalized);
}

function isLibComponentInstall(filePath?: string): boolean {
	const normalized = normalizeTransformFilePath(filePath);
	return normalized.startsWith('lib/components/') || normalized.startsWith('components/');
}

function isBlogComponentInstall(filePath?: string): boolean {
	const normalized = normalizeTransformFilePath(filePath);
	const match = normalized.match(/^(?:lib\/)?components\/([^/]+)\//);
	return !!match?.[1] && BLOG_COMPONENT_ROOTS.has(match[1]);
}

function replaceRelativePrefix(
	importPath: string,
	fromPrefix: string,
	toPrefix: string
): string | null {
	if (importPath === fromPrefix) return toPrefix;
	if (importPath === `${fromPrefix}.js`) return `${toPrefix}.js`;
	if (importPath === `${fromPrefix}.ts`) return `${toPrefix}.ts`;
	if (importPath.startsWith(`${fromPrefix}/`)) {
		return `${toPrefix}${importPath.slice(fromPrefix.length)}`;
	}
	return null;
}

/**
 * Registry virtual paths can map face files to flatter consumer install paths.
 * Rewrite only the relative imports whose source layout differs from the installed layout.
 */
function transformRelativeInstallPath(importPath: string, filePath?: string): string | null {
	const normalizedFilePath = normalizeTransformFilePath(filePath);
	if (normalizedFilePath === 'lib/blog-share.ts' || normalizedFilePath === 'blog-share.ts') {
		const transformed = replaceRelativePrefix(importPath, './types', './blog-types');
		if (transformed) return transformed;
	}

	if (!importPath.startsWith('../')) return null;

	if (isFlattenedFaceLibInstall(filePath)) {
		for (const [fromPrefix, toPrefix] of [
			['../generics', './generics'],
			['../types', './types'],
			['../utils', './utils'],
		] as const) {
			const transformed = replaceRelativePrefix(importPath, fromPrefix, toPrefix);
			if (transformed) return transformed;
		}
	}

	if (isBlogComponentInstall(filePath)) {
		for (const [fromPrefix, toPrefix] of [
			['../../types', '../../blog-types'],
			['../../share', '../../blog-share'],
		] as const) {
			const transformed = replaceRelativePrefix(importPath, fromPrefix, toPrefix);
			if (transformed) return transformed;
		}
	}

	if (isLibComponentInstall(filePath)) {
		const transformed = replaceRelativePrefix(importPath, '../lib', '..');
		if (transformed) return transformed;
	}

	return null;
}

function transformImportPath(
	importPath: string,
	mappings: PathMapping[],
	config: ComponentConfig,
	filePath?: string,
	context?: TransformContext
): string | null {
	const mappedPath = transformPath(importPath, mappings);
	if (mappedPath) {
		return toRelativeVendoredPath(mappedPath, config, context) ?? mappedPath;
	}

	return transformRelativeInstallPath(importPath, filePath);
}

function toRelativeVendoredPath(
	mappedPath: string,
	config: ComponentConfig,
	context?: TransformContext
): string | null {
	if (config.installMode !== 'vendored' || !context) return null;

	const configuredRoots = [
		config.aliases.greater,
		config.aliases.components,
		config.aliases.hooks,
		config.aliases.ui,
		config.aliases.utils,
		config.aliases.lib,
	].sort((a, b) => b.length - a.length);

	for (const configuredRoot of configuredRoots) {
		if (mappedPath !== configuredRoot && !mappedPath.startsWith(`${configuredRoot}/`)) continue;

		const suffix = mappedPath.slice(configuredRoot.length).replace(/^\/+/, '');
		const targetPath = path.join(
			resolveAlias(configuredRoot, config, context.consumerRoot),
			suffix
		);
		let relativePath = path.relative(path.dirname(context.sourceFilePath), targetPath);
		relativePath = relativePath.replace(/\\/g, '/');
		if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
		return relativePath;
	}

	return null;
}

/**
 * Regex patterns for different import types
 * Patterns are designed to avoid ReDoS (no nested quantifiers on overlapping character classes)
 */
const IMPORT_PATTERNS = {
	// ES module imports: import { x } from 'path' or import x from 'path'
	// Statement imports are anchored to statement starts so comment prose such as
	// "Re-export ..." cannot consume the following executable import/export.
	esImport: /(?:^|[;\n\r])\s*import\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
	// Side-effect imports: import 'path'
	sideEffectImport: /(?:^|[;\n\r])\s*import\s*(['"])([^'"]+)\1/g,
	// Dynamic imports: import('path') or import("path")
	dynamicImport: /(?<![\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
	// Re-exports: export { x } from 'path' or export * from 'path'
	reExport: /(?:^|[;\n\r])\s*export\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
	// CSS @import: @import 'path' or @import url('path')
	cssImport: /@import\s+(?:url\s*\(\s*)?(['"])([^'"]+)\1(?:\s*\))?/g,
};

function isExecutableScriptMatch(content: string, offset: number): boolean {
	let state: StripState = 'normal';
	let escaped = false;

	for (let i = 0; i < offset; i++) {
		const char = content[i] ?? '';
		const next = content[i + 1] ?? '';

		if (state === 'line-comment') {
			if (char === '\n') {
				state = 'normal';
			}
			continue;
		}

		if (state === 'block-comment') {
			if (char === '*' && next === '/') {
				state = 'normal';
				i++;
			}
			continue;
		}

		if (state === 'single' || state === 'double' || state === 'template') {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (
				(state === 'single' && char === "'") ||
				(state === 'double' && char === '"') ||
				(state === 'template' && char === '`')
			) {
				state = 'normal';
			}
			continue;
		}

		if (char === '/' && next === '/') {
			state = 'line-comment';
			i++;
			continue;
		}

		if (char === '/' && next === '*') {
			state = 'block-comment';
			i++;
			continue;
		}

		if (char === "'") {
			state = 'single';
			continue;
		}

		if (char === '"') {
			state = 'double';
			continue;
		}

		if (char === '`') {
			state = 'template';
		}
	}

	return state === 'normal';
}

/**
 * Transform imports in TypeScript/JavaScript content
 */
function transformScriptImports(
	content: string,
	mappings: PathMapping[],
	config: ComponentConfig,
	filePath?: string,
	context?: TransformContext
): TransformResult {
	let transformedContent = content;
	let transformedCount = 0;
	const transformedPaths: Array<{ from: string; to: string }> = [];

	// Process ES imports
	const beforeEsImports = transformedContent;
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.esImport,
		(match, _quote, importPath, offset) => {
			const statementOffset = offset + match.search(/\bimport\b/);
			if (!isExecutableScriptMatch(beforeEsImports, statementOffset)) {
				return match;
			}
			const newPath = transformImportPath(importPath, mappings, config, filePath, context);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	// Process side-effect imports
	const beforeSideEffectImports = transformedContent;
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.sideEffectImport,
		(match, _quote, importPath, offset) => {
			const statementOffset = offset + match.search(/\bimport\b/);
			if (!isExecutableScriptMatch(beforeSideEffectImports, statementOffset)) {
				return match;
			}
			const newPath = transformImportPath(importPath, mappings, config, filePath, context);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	// Process dynamic imports
	const beforeDynamicImports = transformedContent;
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.dynamicImport,
		(match, _quote, importPath, offset) => {
			const statementOffset = offset + match.search(/\bimport\b/);
			if (!isExecutableScriptMatch(beforeDynamicImports, statementOffset)) {
				return match;
			}
			const newPath = transformImportPath(importPath, mappings, config, filePath, context);
			if (newPath) {
				transformedCount++;
				transformedPaths.push({ from: importPath, to: newPath });
				return match.replace(importPath, newPath);
			}
			return match;
		}
	);

	// Process re-exports
	const beforeReExports = transformedContent;
	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.reExport,
		(match, _quote, importPath, offset) => {
			const statementOffset = offset + match.search(/\bexport\b/);
			if (!isExecutableScriptMatch(beforeReExports, statementOffset)) {
				return match;
			}
			const newPath = transformImportPath(importPath, mappings, config, filePath, context);
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
function transformCssImports(
	content: string,
	mappings: PathMapping[],
	config: ComponentConfig,
	context?: TransformContext
): TransformResult {
	let transformedContent = content;
	let transformedCount = 0;
	const transformedPaths: Array<{ from: string; to: string }> = [];

	transformedContent = transformedContent.replace(
		IMPORT_PATTERNS.cssImport,
		(match, _quote, importPath) => {
			const mappedPath = transformPath(importPath, mappings);
			const newPath = mappedPath
				? (toRelativeVendoredPath(mappedPath, config, context) ?? mappedPath)
				: null;
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
 * Extract and transform script blocks from Svelte files using indexOf (CodeQL-safe)
 */
function extractScriptBlocks(
	content: string
): Array<{ start: number; end: number; content: string }> {
	return extractTagBlocks(content, 'script');
}

/**
 * Extract and transform style blocks from Svelte files using indexOf (CodeQL-safe)
 */
function extractStyleBlocks(
	content: string
): Array<{ start: number; end: number; content: string }> {
	return extractTagBlocks(content, 'style');
}

/**
 * Extract blocks by tag name using indexOf instead of regex
 */
function isTagNameBoundary(value: string | undefined): boolean {
	return value === undefined || value === '>' || value === '/' || /\s/.test(value);
}

function findOpeningTag(lowerContent: string, tagName: string, searchFrom: number): number {
	const openTag = `<${tagName.toLowerCase()}`;
	let index = searchFrom;

	while (true) {
		const startIdx = lowerContent.indexOf(openTag, index);
		if (startIdx === -1) return -1;

		if (isTagNameBoundary(lowerContent[startIdx + openTag.length])) {
			return startIdx;
		}

		index = startIdx + openTag.length;
	}
}

function extractTagBlocks(
	content: string,
	tagName: string
): Array<{ start: number; end: number; content: string }> {
	const blocks: Array<{ start: number; end: number; content: string }> = [];
	const lowerContent = content.toLowerCase();
	const closeTag = `</${tagName}>`;

	let searchFrom = 0;
	while (true) {
		const startIdx = findOpeningTag(lowerContent, tagName, searchFrom);
		if (startIdx === -1) break;

		// Find the end of the opening tag
		const openTagEnd = content.indexOf('>', startIdx);
		if (openTagEnd === -1) break;

		// Find the closing tag
		const closeIdx = lowerContent.indexOf(closeTag, openTagEnd);
		if (closeIdx === -1) break;

		const blockEnd = closeIdx + closeTag.length;
		const innerContent = content.substring(openTagEnd + 1, closeIdx);

		blocks.push({
			start: startIdx,
			end: blockEnd,
			content: innerContent,
		});

		searchFrom = blockEnd;
	}

	return blocks;
}

/**
 * Transform imports in a Svelte file
 * Handles both <script> and <style> blocks
 */
export function transformSvelteImports(content: string, config: ComponentConfig): TransformResult {
	return transformSvelteImportsForFile(content, config);
}

function transformSvelteImportsForFile(
	content: string,
	config: ComponentConfig,
	filePath?: string,
	context?: TransformContext
): TransformResult {
	const mappings = buildPathMappings(config);
	let transformedContent = content;
	let totalTransformed = 0;
	const allTransformedPaths: Array<{ from: string; to: string }> = [];

	// Transform script blocks
	const scriptBlocks = extractScriptBlocks(content);
	// Process in reverse order to maintain correct positions
	for (const block of scriptBlocks.reverse()) {
		const result = transformScriptImports(block.content, mappings, config, filePath, context);
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
		const result = transformCssImports(block.content, mappings, config, context);
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
	config: ComponentConfig,
	filePath?: string,
	context?: TransformContext
): TransformResult {
	const mappings = buildPathMappings(config);
	return transformScriptImports(content, mappings, config, filePath, context);
}

/**
 * Transform imports in a CSS file
 */
export function transformCssFileImports(
	content: string,
	config: ComponentConfig,
	context?: TransformContext
): TransformResult {
	const mappings = buildPathMappings(config);
	return transformCssImports(content, mappings, config, context);
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
	filePath?: string,
	context?: TransformContext
): TransformResult {
	// Detect file type from extension or content
	const ext = filePath?.split('.').pop()?.toLowerCase();

	if (ext === 'svelte') {
		return transformSvelteImportsForFile(content, config, filePath, context);
	}

	if (ext === 'css' || ext === 'scss' || ext === 'less') {
		return transformCssFileImports(content, config, context);
	}

	// Trust explicit file extensions before content sniffing so JSDoc examples like
	// `<script>` inside .ts files do not get misclassified as Svelte.
	if (ext) {
		return transformTypeScriptImports(content, config, filePath, context);
	}

	if (content.includes('<script')) {
		return transformSvelteImportsForFile(content, config, filePath, context);
	}

	// Default to TypeScript/JavaScript handling for extensionless text files.
	return transformTypeScriptImports(content, config, filePath, context);
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
