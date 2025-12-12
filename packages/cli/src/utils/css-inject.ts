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
import { readFile, writeFile, fileExists } from './files.js';
import type { CssEntryPoint, ProjectType } from './files.js';

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
 * CSS import paths for Greater Components
 * Verified against official documentation:
 * - tokens/theme.css: Design tokens (colors, spacing, typography variables)
 * - primitives/style.css: Component styles (button, card, container classes)
 * - faces/{face}/style.css: Face-specific component styles
 */
const CSS_IMPORTS = {
	tokens: '@equaltoai/greater-components/tokens/theme.css',
	primitives: '@equaltoai/greater-components/primitives/style.css',
	faces: {
		social: '@equaltoai/greater-components/faces/social/style.css',
		blog: '@equaltoai/greater-components/faces/blog/style.css',
		community: '@equaltoai/greater-components/faces/community/style.css',
	},
} as const;

/**
 * Generate CSS import statements based on configuration
 * Import order is critical: tokens first, then primitives, then face styles
 */
export function generateCssImports(config: CssImportConfig): string[] {
	const imports: string[] = [];

	// Tokens must come first (provides CSS custom properties)
	if (config.tokens) {
		imports.push(`import '${CSS_IMPORTS.tokens}';`);
	}

	// Primitives CSS (component class definitions)
	if (config.primitives) {
		imports.push(`import '${CSS_IMPORTS.primitives}';`);
	}

	// Face-specific CSS (must come after primitives)
	if (config.face && config.face in CSS_IMPORTS.faces) {
		const faceImport = CSS_IMPORTS.faces[config.face as keyof typeof CSS_IMPORTS.faces];
		imports.push(`import '${faceImport}';`);
	}

	return imports;
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
	const scriptMatch = content.match(/<script[^>]*>/);

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
			importsToAdd.push(`@import '${CSS_IMPORTS.tokens}';`);
			addedImports.push(CSS_IMPORTS.tokens);
		} else if (config.tokens) {
			existingImportsList.push(CSS_IMPORTS.tokens);
		}

		if (config.primitives && !existingImports.hasPrimitives) {
			importsToAdd.push(`@import '${CSS_IMPORTS.primitives}';`);
			addedImports.push(CSS_IMPORTS.primitives);
		} else if (config.primitives) {
			existingImportsList.push(CSS_IMPORTS.primitives);
		}

		if (config.face && config.face in CSS_IMPORTS.faces && !existingImports.hasFace) {
			const faceImport = CSS_IMPORTS.faces[config.face as keyof typeof CSS_IMPORTS.faces];
			importsToAdd.push(`@import '${faceImport}';`);
			addedImports.push(faceImport);
		} else if (config.face && existingImports.hasFace) {
			existingImportsList.push(
				CSS_IMPORTS.faces[config.face as keyof typeof CSS_IMPORTS.faces] || ''
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
 */
export async function injectCssImports(
	entryPoint: CssEntryPoint,
	config: CssImportConfig
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
