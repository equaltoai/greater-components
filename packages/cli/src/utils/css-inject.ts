/**
 * CSS Injection Utilities
 * Handles injecting Greater Components CSS imports into project entry points
 *
 * CSS Import Paths (from official documentation):
 * - Tokens: @equaltoai/greater-components/tokens/theme.css
 * - Primitives: @equaltoai/greater-components/primitives/style.css
 * - Faces: @equaltoai/greater-components/faces/{face}/style.css
 */

import path from 'node:path';
import fs from 'fs-extra';
import { readFile, writeFile, fileExists } from './files.js';
import type { CssEntryPoint, ProjectType } from './files.js';
import { fetchFromGitTag } from './git-fetch.js';

/**
 * CSS import configuration
 */
export interface CssImportConfig {
	/** Import tokens CSS */
	tokens: boolean;
	/** Import primitives CSS */
	primitives: boolean;
	/** Face-specific CSS to import */
	face: string | null;
}

/**
 * Result of CSS injection
 */
export interface CssInjectionResult {
	/** Whether injection was successful */
	success: boolean;
	/** Path to the file that was modified */
	filePath: string;
	/** Imports that were added */
	addedImports: string[];
	/** Imports that already existed */
	existingImports: string[];
	/** Error message if injection failed */
	error?: string;
}

/**
 * CSS import paths for Greater Components (npm package imports)
 * Verified against official documentation:
 * - tokens/theme.css: Design tokens (colors, spacing, typography variables)
 * - primitives/style.css: Component styles (button, card, container classes)
 * - faces/{face}/style.css: Face-specific component styles
 */
const CSS_IMPORTS_NPM = {
	tokens: '@equaltoai/greater-components/tokens/theme.css',
	primitives: '@equaltoai/greater-components/primitives/style.css',
	faces: {
		social: '@equaltoai/greater-components/faces/social/style.css',
		blog: '@equaltoai/greater-components/faces/blog/style.css',
		community: '@equaltoai/greater-components/faces/community/style.css',
		artist: '@equaltoai/greater-components/faces/artist/style.css',
	},
} as const;

/**
 * CSS source file paths in the Greater Components repository
 * These are the relative paths from the repo root to the CSS source files
 */
export const CSS_SOURCE_PATHS = {
	tokens: 'packages/tokens/dist/theme.css',
	primitives: 'packages/primitives/src/theme.css',
	faces: {
		social: 'packages/faces/social/src/theme.css',
		blog: 'packages/faces/blog/src/theme.css',
		community: 'packages/faces/community/src/theme.css',
		artist: 'packages/faces/artist/src/theme.css',
	},
} as const;

/**
 * Local CSS file names when copied to consumer project
 */
export const CSS_LOCAL_FILES = {
	tokens: 'tokens.css',
	primitives: 'primitives.css',
	faces: {
		social: 'social.css',
		blog: 'blog.css',
		community: 'community.css',
		artist: 'artist.css',
	},
} as const;

/**
 * Extended CSS import configuration with source mode support
 */
export interface ExtendedCssImportConfig extends CssImportConfig {
	/** CSS source mode: 'local' uses copied files, 'npm' uses package imports */
	source?: 'local' | 'npm';
	/** Local CSS directory path (used when source is 'local') */
	localDir?: string;
	/** Lib alias for local imports (e.g., '$lib') */
	libAlias?: string;
}

/**
 * Generate local CSS import path
 */
function getLocalCssPath(libAlias: string, localDir: string, fileName: string): string {
	return `${libAlias}/${localDir}/${fileName}`;
}

/**
 * Generate CSS import statements based on configuration
 * Import order is critical: tokens first, then primitives, then face styles
 *
 * @param config - CSS import configuration
 * @returns Array of import statements
 */
export function generateCssImports(config: ExtendedCssImportConfig): string[] {
	const imports: string[] = [];
	const isLocal = config.source === 'local';
	const localDir = config.localDir || 'styles/greater';
	const libAlias = config.libAlias || '$lib';

	// Tokens must come first (provides CSS custom properties)
	if (config.tokens) {
		const importPath = isLocal
			? getLocalCssPath(libAlias, localDir, CSS_LOCAL_FILES.tokens)
			: CSS_IMPORTS_NPM.tokens;
		imports.push(`import '${importPath}';`);
	}

	// Primitives CSS (component class definitions)
	if (config.primitives) {
		const importPath = isLocal
			? getLocalCssPath(libAlias, localDir, CSS_LOCAL_FILES.primitives)
			: CSS_IMPORTS_NPM.primitives;
		imports.push(`import '${importPath}';`);
	}

	// Face-specific CSS (must come after primitives)
	if (config.face && config.face in CSS_IMPORTS_NPM.faces) {
		const faceKey = config.face as keyof typeof CSS_IMPORTS_NPM.faces;
		const importPath = isLocal
			? getLocalCssPath(libAlias, localDir, CSS_LOCAL_FILES.faces[faceKey])
			: CSS_IMPORTS_NPM.faces[faceKey];
		imports.push(`import '${importPath}';`);
	}

	return imports;
}

/**
 * Get the list of CSS files to copy for local mode
 * Returns source repo paths paired with local destination file names
 */
export function getCssFilesToCopy(config: CssImportConfig): Array<{
	sourcePath: string;
	localFileName: string;
}> {
	const files: Array<{ sourcePath: string; localFileName: string }> = [];

	if (config.tokens) {
		files.push({
			sourcePath: CSS_SOURCE_PATHS.tokens,
			localFileName: CSS_LOCAL_FILES.tokens,
		});
	}

	if (config.primitives) {
		files.push({
			sourcePath: CSS_SOURCE_PATHS.primitives,
			localFileName: CSS_LOCAL_FILES.primitives,
		});
	}

	if (config.face && config.face in CSS_SOURCE_PATHS.faces) {
		const faceKey = config.face as keyof typeof CSS_SOURCE_PATHS.faces;
		files.push({
			sourcePath: CSS_SOURCE_PATHS.faces[faceKey],
			localFileName: CSS_LOCAL_FILES.faces[faceKey],
		});
	}

	return files;
}

/**
 * Result of copying CSS files to the consumer project
 */
export interface CssCopyResult {
	/** Whether the copy operation was successful */
	success: boolean;
	/** Files that were copied */
	copiedFiles: string[];
	/** Files that already existed (skipped) */
	skippedFiles: string[];
	/** Directory where files were copied to */
	targetDir: string;
	/** Error message if operation failed */
	error?: string;
}

/**
 * Options for copying CSS files
 */
export interface CopyCssFilesOptions {
	/** Git ref to fetch CSS files from */
	ref: string;
	/** CSS config specifying which files to copy */
	cssConfig: CssImportConfig;
	/** Base lib directory (e.g., 'src/lib') */
	libDir: string;
	/** Local CSS directory relative to libDir (e.g., 'styles/greater') */
	localDir: string;
	/** Working directory of the consumer project */
	cwd: string;
	/** Whether to overwrite existing files */
	overwrite?: boolean;
	/** Skip cache and always fetch from network */
	skipCache?: boolean;
}

/**
 * Copy CSS files from the repository to the consumer's project
 * Fetches files from the Git tag and writes them to the local CSS directory
 */
export async function copyCssFiles(options: CopyCssFilesOptions): Promise<CssCopyResult> {
	const { ref, cssConfig, libDir, localDir, cwd, overwrite = false, skipCache = false } = options;

	// Resolve the target directory
	// Convert $lib to actual path if needed
	const resolvedLibDir = libDir.startsWith('$lib') ? libDir.replace('$lib', 'src/lib') : libDir;
	const targetDir = path.join(cwd, resolvedLibDir, localDir);

	const copiedFiles: string[] = [];
	const skippedFiles: string[] = [];

	try {
		// Ensure target directory exists
		await fs.ensureDir(targetDir);

		// Get the list of CSS files to copy
		const filesToCopy = getCssFilesToCopy(cssConfig);

		// Fetch and write each file
		for (const { sourcePath, localFileName } of filesToCopy) {
			const targetPath = path.join(targetDir, localFileName);

			// Check if file already exists
			if (!overwrite && (await fs.pathExists(targetPath))) {
				skippedFiles.push(localFileName);
				continue;
			}

			try {
				// Fetch the file from the Git tag
				const content = await fetchFromGitTag(ref, sourcePath, { skipCache });

				// Write to the target path
				await fs.writeFile(targetPath, content);
				copiedFiles.push(localFileName);
			} catch (error) {
				// If a specific file fails, report the error but continue
				const errorMessage = error instanceof Error ? error.message : String(error);
				return {
					success: false,
					copiedFiles,
					skippedFiles,
					targetDir,
					error: `Failed to copy ${sourcePath}: ${errorMessage}`,
				};
			}
		}

		return {
			success: true,
			copiedFiles,
			skippedFiles,
			targetDir,
		};
	} catch (error) {
		return {
			success: false,
			copiedFiles,
			skippedFiles,
			targetDir,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Check if a file already contains Greater Components CSS imports
 */
export function detectExistingCssImports(content: string): {
	hasTokens: boolean;
	hasPrimitives: boolean;
	hasFace: string | null;
} {
	const result = {
		hasTokens: false,
		hasPrimitives: false,
		hasFace: null as string | null,
	};

	// Check for tokens import (various formats)
	const tokensPatterns = [
		/@equaltoai\/greater-components\/tokens\/theme\.css/,
		/@equaltoai\/greater-components-tokens\/theme\.css/,
		/greater-components.*tokens.*\.css/,
	];
	result.hasTokens = tokensPatterns.some((pattern) => pattern.test(content));

	// Check for primitives import
	const primitivesPatterns = [
		/@equaltoai\/greater-components\/primitives\/style\.css/,
		/@equaltoai\/greater-components-primitives\/style\.css/,
		/@equaltoai\/greater-components-primitives\/theme\.css/,
		/greater-components.*primitives.*\.css/,
	];
	result.hasPrimitives = primitivesPatterns.some((pattern) => pattern.test(content));

	// Check for face imports
	const facePatterns: Array<[RegExp, string]> = [
		[/greater-components.*faces\/social.*\.css/, 'social'],
		[/greater-components.*faces\/blog.*\.css/, 'blog'],
		[/greater-components.*faces\/community.*\.css/, 'community'],
		[/greater-components-social.*\.css/, 'social'],
	];
	for (const [pattern, face] of facePatterns) {
		if (pattern.test(content)) {
			result.hasFace = face;
			break;
		}
	}

	return result;
}

/**
 * Find the best insertion point for CSS imports in a Svelte file
 */
function findSvelteInsertionPoint(content: string): {
	index: number;
	needsScriptTag: boolean;
} {
	// Look for existing <script> tag
	const scriptMatch = content.match(/<script[^>]*>/i);

	if (scriptMatch && scriptMatch.index !== undefined) {
		// Insert after the opening script tag
		return {
			index: scriptMatch.index + scriptMatch[0].length,
			needsScriptTag: false,
		};
	}

	// No script tag found, need to add one at the beginning
	return {
		index: 0,
		needsScriptTag: true,
	};
}

/**
 * Find the best insertion point for CSS imports in a JS/TS file
 */
function findJsInsertionPoint(content: string): number {
	// Look for existing imports
	const importMatches = [...content.matchAll(/^import\s+.*?;?\s*$/gm)];

	if (importMatches.length > 0) {
		// Find the last import statement
		const lastImport = importMatches[importMatches.length - 1];
		if (lastImport && lastImport.index !== undefined) {
			// Insert after the last import
			return lastImport.index + lastImport[0].length;
		}
	}

	// No imports found, insert at the beginning
	return 0;
}

/**
 * Inject CSS imports into a Svelte file
 */
async function injectIntoSvelteFile(
	filePath: string,
	imports: string[],
	existingImports: { hasTokens: boolean; hasPrimitives: boolean; hasFace: string | null }
): Promise<CssInjectionResult> {
	try {
		const content = await readFile(filePath);
		const { index, needsScriptTag } = findSvelteInsertionPoint(content);

		const addedImports: string[] = [];
		const existingImportsList: string[] = [];

		// Filter out imports that already exist
		const importsToAdd = imports.filter((imp) => {
			if (imp.includes('tokens') && existingImports.hasTokens) {
				existingImportsList.push(imp);
				return false;
			}
			if (imp.includes('primitives') && existingImports.hasPrimitives) {
				existingImportsList.push(imp);
				return false;
			}
			if (imp.includes('faces') && existingImports.hasFace) {
				existingImportsList.push(imp);
				return false;
			}
			addedImports.push(imp);
			return true;
		});

		if (importsToAdd.length === 0) {
			return {
				success: true,
				filePath,
				addedImports: [],
				existingImports: existingImportsList,
			};
		}

		let newContent: string;
		const importBlock = '\n\t' + importsToAdd.join('\n\t') + '\n';

		if (needsScriptTag) {
			// Add script tag with imports at the beginning
			newContent = `<script lang="ts">${importBlock}</script>\n\n${content}`;
		} else {
			// Insert imports after the script tag
			newContent = content.slice(0, index) + importBlock + content.slice(index);
		}

		await writeFile(filePath, newContent);

		return {
			success: true,
			filePath,
			addedImports,
			existingImports: existingImportsList,
		};
	} catch (error) {
		return {
			success: false,
			filePath,
			addedImports: [],
			existingImports: [],
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Inject CSS imports into a JS/TS file
 */
async function injectIntoJsFile(
	filePath: string,
	imports: string[],
	existingImports: { hasTokens: boolean; hasPrimitives: boolean; hasFace: string | null }
): Promise<CssInjectionResult> {
	try {
		const content = await readFile(filePath);
		const index = findJsInsertionPoint(content);

		const addedImports: string[] = [];
		const existingImportsList: string[] = [];

		// Filter out imports that already exist
		const importsToAdd = imports.filter((imp) => {
			if (imp.includes('tokens') && existingImports.hasTokens) {
				existingImportsList.push(imp);
				return false;
			}
			if (imp.includes('primitives') && existingImports.hasPrimitives) {
				existingImportsList.push(imp);
				return false;
			}
			if (imp.includes('faces') && existingImports.hasFace) {
				existingImportsList.push(imp);
				return false;
			}
			addedImports.push(imp);
			return true;
		});

		if (importsToAdd.length === 0) {
			return {
				success: true,
				filePath,
				addedImports: [],
				existingImports: existingImportsList,
			};
		}

		const importBlock = importsToAdd.join('\n') + '\n';
		const newContent =
			content.slice(0, index) + (index > 0 ? '\n' : '') + importBlock + content.slice(index);

		await writeFile(filePath, newContent);

		return {
			success: true,
			filePath,
			addedImports,
			existingImports: existingImportsList,
		};
	} catch (error) {
		return {
			success: false,
			filePath,
			addedImports: [],
			existingImports: [],
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Inject CSS imports into a CSS file (using @import)
 */
async function injectIntoCssFile(
	filePath: string,
	config: CssImportConfig,
	existingImports: { hasTokens: boolean; hasPrimitives: boolean; hasFace: string | null }
): Promise<CssInjectionResult> {
	try {
		const content = await readFile(filePath);

		const addedImports: string[] = [];
		const existingImportsList: string[] = [];
		const importsToAdd: string[] = [];

		// Generate @import statements for CSS files
		if (config.tokens && !existingImports.hasTokens) {
			importsToAdd.push(`@import '${CSS_IMPORTS_NPM.tokens}';`);
			addedImports.push(CSS_IMPORTS_NPM.tokens);
		} else if (config.tokens) {
			existingImportsList.push(CSS_IMPORTS_NPM.tokens);
		}

		if (config.primitives && !existingImports.hasPrimitives) {
			importsToAdd.push(`@import '${CSS_IMPORTS_NPM.primitives}';`);
			addedImports.push(CSS_IMPORTS_NPM.primitives);
		} else if (config.primitives) {
			existingImportsList.push(CSS_IMPORTS_NPM.primitives);
		}

		if (config.face && config.face in CSS_IMPORTS_NPM.faces && !existingImports.hasFace) {
			const faceImport = CSS_IMPORTS_NPM.faces[config.face as keyof typeof CSS_IMPORTS_NPM.faces];
			importsToAdd.push(`@import '${faceImport}';`);
			addedImports.push(faceImport);
		} else if (config.face && existingImports.hasFace) {
			existingImportsList.push(
				CSS_IMPORTS_NPM.faces[config.face as keyof typeof CSS_IMPORTS_NPM.faces] || ''
			);
		}

		if (importsToAdd.length === 0) {
			return {
				success: true,
				filePath,
				addedImports: [],
				existingImports: existingImportsList,
			};
		}

		// Insert at the beginning of the CSS file
		const importBlock = importsToAdd.join('\n') + '\n\n';
		const newContent = importBlock + content;

		await writeFile(filePath, newContent);

		return {
			success: true,
			filePath,
			addedImports,
			existingImports: existingImportsList,
		};
	} catch (error) {
		return {
			success: false,
			filePath,
			addedImports: [],
			existingImports: [],
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Inject CSS imports into the appropriate entry point
 * Supports both npm package imports and local file imports based on config.source
 */
export async function injectCssImports(
	entryPoint: CssEntryPoint,
	config: ExtendedCssImportConfig
): Promise<CssInjectionResult> {
	if (!(await fileExists(entryPoint.path))) {
		return {
			success: false,
			filePath: entryPoint.path,
			addedImports: [],
			existingImports: [],
			error: `File not found: ${entryPoint.path}`,
		};
	}

	const content = await readFile(entryPoint.path);
	const existingImports = detectExistingCssImports(content);
	const imports = generateCssImports(config);

	const ext = path.extname(entryPoint.path).toLowerCase();

	if (ext === '.svelte') {
		return injectIntoSvelteFile(entryPoint.path, imports, existingImports);
	} else if (ext === '.css') {
		return injectIntoCssFile(entryPoint.path, config, existingImports);
	} else if (['.ts', '.js', '.mjs'].includes(ext)) {
		return injectIntoJsFile(entryPoint.path, imports, existingImports);
	}

	return {
		success: false,
		filePath: entryPoint.path,
		addedImports: [],
		existingImports: [],
		error: `Unsupported file type: ${ext}`,
	};
}

/**
 * Get recommended entry point for CSS injection based on project type
 */
export function getRecommendedEntryPoint(
	entryPoints: CssEntryPoint[],
	projectType: ProjectType
): CssEntryPoint | null {
	if (entryPoints.length === 0) {
		return null;
	}

	// For SvelteKit, prefer +layout.svelte
	if (projectType === 'sveltekit') {
		const layout = entryPoints.find((e) => e.type === 'root-layout');
		if (layout) return layout;
	}

	// For Vite + Svelte, prefer main.ts/js
	if (projectType === 'vite-svelte') {
		const main = entryPoints.find((e) => e.type === 'main');
		if (main) return main;
	}

	// Fall back to first entry point by priority
	return entryPoints[0] ?? null;
}
