/**
 * File system utilities
 */

import fs from 'fs-extra';
import path from 'node:path';
import type { ComponentFile } from '../registry/index.js';
import type { ComponentConfig } from './config.js';
import { transformImports, getTransformSummary, type TransformResult } from './transform.js';

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
	await fs.ensureDir(dirPath);
}

/**
 * Write file with directory creation
 */
export async function writeFile(filePath: string, content: string | Buffer): Promise<void> {
	const dir = path.dirname(filePath);
	await ensureDir(dir);
	if (typeof content === 'string') {
		await fs.writeFile(filePath, content, 'utf-8');
		return;
	}

	await fs.writeFile(filePath, content);
}

/**
 * Read file
 */
export async function readFile(filePath: string): Promise<string> {
	return fs.readFile(filePath, 'utf-8');
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
	return fs.pathExists(filePath);
}

/**
 * Result of writing component files with transformation
 */
export interface WriteResult {
	/** Files that were written */
	writtenFiles: string[];
	/** Transformation results for each file */
	transformResults: TransformResult[];
	/** Summary of transformations */
	transformSummary: string;
}

/**
 * Write component files to project (without transformation)
 * @deprecated Use writeComponentFilesWithTransform for new code
 */
export async function writeComponentFiles(
	files: ComponentFile[],
	targetDir: string
): Promise<void> {
	for (const file of files) {
		const filePath = path.join(targetDir, file.path);
		await writeFile(filePath, file.raw ?? file.content);
	}
}

/**
 * Write component files to project with import transformation
 * Transforms Greater Components internal imports to consumer project aliases
 */
export async function writeComponentFilesWithTransform(
	files: ComponentFile[],
	targetDir: string,
	config: ComponentConfig
): Promise<WriteResult> {
	const writtenFiles: string[] = [];
	const transformResults: TransformResult[] = [];

	for (const file of files) {
		const filePath = path.join(targetDir, file.path);

		// Binary files (or explicitly non-transforming files) are written as-is.
		if (file.raw || file.transform === false) {
			transformResults.push({
				content: '',
				transformedCount: 0,
				transformedPaths: [],
				hasChanges: false,
			});
			await writeFile(filePath, file.raw ?? file.content);
			writtenFiles.push(filePath);
			continue;
		}

		// Transform imports based on file type
		const result = transformImports(file.content, config, file.path);
		transformResults.push(result);

		// Write the transformed content
		await writeFile(filePath, result.content);
		writtenFiles.push(filePath);
	}

	return {
		writtenFiles,
		transformResults,
		transformSummary: getTransformSummary(transformResults),
	};
}

/**
 * Check if directory is a valid project root
 */
export async function isValidProject(cwd: string): Promise<boolean> {
	const packageJsonPath = path.join(cwd, 'package.json');
	return fileExists(packageJsonPath);
}

/**
 * Project type enum for enhanced detection
 */
export type ProjectType = 'sveltekit' | 'vite-svelte' | 'svelte' | 'unknown';

/**
 * Detailed project detection result
 */
export interface ProjectDetectionResult {
	/** Detected project type */
	type: ProjectType;
	/** Path to svelte.config.js if found */
	svelteConfigPath: string | null;
	/** Path to vite.config.* if found */
	viteConfigPath: string | null;
	/** Path to package.json */
	packageJsonPath: string;
	/** Detected CSS entry points */
	cssEntryPoints: CssEntryPoint[];
	/** Whether TypeScript is configured */
	hasTypeScript: boolean;
}

/**
 * CSS entry point for injection
 */
export interface CssEntryPoint {
	/** Path to the file */
	path: string;
	/** Type of entry point */
	type: 'layout' | 'main' | 'app-css' | 'root-layout';
	/** Priority for injection (lower = higher priority) */
	priority: number;
}

/**
 * Detect project type (SvelteKit, Vite + Svelte, bare Svelte, etc.)
 * Returns detailed detection result with paths
 */
export async function detectProjectType(cwd: string): Promise<ProjectType> {
	const result = await detectProjectDetails(cwd);
	return result.type;
}

/**
 * Get detailed project detection result
 */
export async function detectProjectDetails(cwd: string): Promise<ProjectDetectionResult> {
	const packageJsonPath = path.join(cwd, 'package.json');

	const result: ProjectDetectionResult = {
		type: 'unknown',
		svelteConfigPath: null,
		viteConfigPath: null,
		packageJsonPath,
		cssEntryPoints: [],
		hasTypeScript: false,
	};

	if (!(await fileExists(packageJsonPath))) {
		return result;
	}

	try {
		const content = await readFile(packageJsonPath);
		const pkg = JSON.parse(content);

		// Check for TypeScript
		result.hasTypeScript = !!(
			pkg.devDependencies?.['typescript'] || (await fileExists(path.join(cwd, 'tsconfig.json')))
		);

		// Check for svelte.config.js
		const svelteConfigPaths = ['svelte.config.js', 'svelte.config.ts'];
		for (const configPath of svelteConfigPaths) {
			const fullPath = path.join(cwd, configPath);
			if (await fileExists(fullPath)) {
				result.svelteConfigPath = fullPath;
				break;
			}
		}

		// Check for vite.config.*
		const viteConfigPaths = ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'];
		for (const configPath of viteConfigPaths) {
			const fullPath = path.join(cwd, configPath);
			if (await fileExists(fullPath)) {
				result.viteConfigPath = fullPath;
				break;
			}
		}

		// Detect project type
		const hasSvelteKit = !!(
			pkg.dependencies?.['@sveltejs/kit'] || pkg.devDependencies?.['@sveltejs/kit']
		);
		const hasSvelte = !!(pkg.dependencies?.['svelte'] || pkg.devDependencies?.['svelte']);
		const hasVite = !!pkg.devDependencies?.['vite'];

		if (hasSvelteKit && result.svelteConfigPath) {
			result.type = 'sveltekit';
		} else if (hasVite && hasSvelte) {
			result.type = 'vite-svelte';
		} else if (hasSvelte) {
			result.type = 'svelte';
		}

		// Detect CSS entry points
		result.cssEntryPoints = await detectCssEntryPoints(cwd, result.type);

		return result;
	} catch {
		return result;
	}
}

/**
 * Detect potential CSS entry points for injection
 */
export async function detectCssEntryPoints(
	cwd: string,
	projectType: ProjectType
): Promise<CssEntryPoint[]> {
	const entryPoints: CssEntryPoint[] = [];

	// SvelteKit-specific entry points
	if (projectType === 'sveltekit') {
		const layoutPaths = [
			'src/routes/+layout.svelte',
			'src/routes/+layout.ts',
			'src/routes/+layout.js',
		];

		for (const layoutPath of layoutPaths) {
			const fullPath = path.join(cwd, layoutPath);
			if (await fileExists(fullPath)) {
				entryPoints.push({
					path: fullPath,
					type: layoutPath.endsWith('.svelte') ? 'root-layout' : 'layout',
					priority: 1,
				});
			}
		}

		// Check for app.css in SvelteKit
		const appCssPath = path.join(cwd, 'src/app.css');
		if (await fileExists(appCssPath)) {
			entryPoints.push({
				path: appCssPath,
				type: 'app-css',
				priority: 2,
			});
		}
	}

	// Vite + Svelte entry points
	if (projectType === 'vite-svelte') {
		const mainPaths = ['src/main.ts', 'src/main.js', 'src/index.ts', 'src/index.js'];

		for (const mainPath of mainPaths) {
			const fullPath = path.join(cwd, mainPath);
			if (await fileExists(fullPath)) {
				entryPoints.push({
					path: fullPath,
					type: 'main',
					priority: 1,
				});
				break;
			}
		}

		// Check for App.svelte
		const appSveltePath = path.join(cwd, 'src/App.svelte');
		if (await fileExists(appSveltePath)) {
			entryPoints.push({
				path: appSveltePath,
				type: 'root-layout',
				priority: 2,
			});
		}
	}

	// Generic app.css fallback
	const genericAppCss = path.join(cwd, 'src/app.css');
	if ((await fileExists(genericAppCss)) && !entryPoints.some((e) => e.path === genericAppCss)) {
		entryPoints.push({
			path: genericAppCss,
			type: 'app-css',
			priority: 3,
		});
	}

	// Sort by priority
	return entryPoints.sort((a, b) => a.priority - b.priority);
}

/**
 * Get Svelte version from package.json
 * Returns full semver version string for detailed validation
 */
export async function getSvelteVersion(cwd: string): Promise<number | null> {
	const versionInfo = await getSvelteVersionDetails(cwd);
	return versionInfo?.major ?? null;
}

/**
 * Detailed Svelte version information
 */
export interface SvelteVersionInfo {
	/** Raw version string from package.json */
	raw: string;
	/** Major version number */
	major: number;
	/** Minor version number */
	minor: number;
	/** Patch version number */
	patch: number;
	/** Whether version meets minimum requirement (5.0.0) */
	meetsMinimum: boolean;
}

/**
 * Get detailed Svelte version information
 */
export async function getSvelteVersionDetails(cwd: string): Promise<SvelteVersionInfo | null> {
	const packageJsonPath = path.join(cwd, 'package.json');

	if (!(await fileExists(packageJsonPath))) {
		return null;
	}

	try {
		const content = await readFile(packageJsonPath);
		const pkg = JSON.parse(content);
		const svelteVersion = pkg.dependencies?.['svelte'] || pkg.devDependencies?.['svelte'];

		if (!svelteVersion) {
			return null;
		}

		// Parse version string (handles ^5.0.0, ~5.0.0, 5.0.0, >=5.0.0, etc.)
		const match = svelteVersion.match(/(\d+)\.(\d+)\.(\d+)/);
		if (!match) {
			return null;
		}

		const major = parseInt(match[1], 10);
		const minor = parseInt(match[2], 10);
		const patch = parseInt(match[3], 10);

		return {
			raw: svelteVersion,
			major,
			minor,
			patch,
			meetsMinimum: major >= 5,
		};
	} catch {
		return null;
	}
}

/**
 * Validate Svelte version meets minimum requirement
 * Returns upgrade instructions if version is too low
 */
export async function validateSvelteVersion(cwd: string): Promise<{
	valid: boolean;
	version: SvelteVersionInfo | null;
	upgradeInstructions: string | null;
}> {
	const version = await getSvelteVersionDetails(cwd);

	if (!version) {
		return {
			valid: false,
			version: null,
			upgradeInstructions: 'Svelte is not installed. Install with: pnpm add svelte@^5.0.0',
		};
	}

	if (!version.meetsMinimum) {
		return {
			valid: false,
			version,
			upgradeInstructions: `Svelte ${version.raw} is installed, but Greater Components requires Svelte 5+.\n\nUpgrade with:\n  pnpm add svelte@^5.0.0\n\nOr with npm:\n  npm install svelte@^5.0.0`,
		};
	}

	return {
		valid: true,
		version,
		upgradeInstructions: null,
	};
}
