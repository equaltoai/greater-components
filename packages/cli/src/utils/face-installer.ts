/**
 * Face Bundle Installer
 * Handles complete installation of face bundles with all dependencies
 */

import path from 'node:path';
import chalk from 'chalk';
import type { FaceManifest } from '../registry/index.js';
import { getFaceManifest } from '../registry/faces.js';
import { resolveDependencies, type DependencyResolutionResult } from './dependency-resolver.js';
import { parseItemName, type ParsedItem } from './item-parser.js';
import type { ComponentConfig } from './config.js';
import { writeConfig } from './config.js';
import { injectCssImports, type CssImportConfig } from './css-inject.js';
import { detectProjectDetails } from './files.js';
import { logger } from './logger.js';

/**
 * Face installation options
 */
export interface FaceInstallOptions {
	/** Skip CSS injection */
	skipCss?: boolean;
	/** Custom installation path */
	customPath?: string;
	/** Skip optional shared modules */
	skipOptional?: boolean;
	/** Already installed components to skip */
	skipInstalled?: string[];
}

/**
 * Face installation result
 */
export interface FaceInstallResult {
	/** Face name */
	face: string;
	/** Face manifest */
	manifest: FaceManifest;
	/** Dependency resolution result */
	resolution: DependencyResolutionResult;
	/** CSS injection result */
	cssInjected: boolean;
	/** Config updated */
	configUpdated: boolean;
}

/**
 * Get all components included in a face as ParsedItems
 */
export function getFaceItemsForResolution(manifest: FaceManifest): ParsedItem[] {
	const items: ParsedItem[] = [];

	// Add primitives
	for (const name of manifest.includes.primitives) {
		items.push(parseItemName(name));
	}

	// Add shared modules
	for (const name of manifest.includes.shared) {
		items.push(parseItemName(`shared/${name}`));
	}

	// Add patterns
	for (const name of manifest.includes.patterns) {
		items.push(parseItemName(`patterns/${name}`));
	}

	// Add face-specific components
	for (const name of manifest.includes.components) {
		items.push(parseItemName(name));
	}

	return items.filter((item) => item.found);
}

/**
 * Resolve all dependencies for a face
 */
export function resolveFaceDependencies(
	faceName: string,
	options: FaceInstallOptions = {}
): DependencyResolutionResult | null {
	const manifest = getFaceManifest(faceName);

	if (!manifest) {
		return null;
	}

	const items = getFaceItemsForResolution(manifest);

	// Add recommended shared modules if not skipping optional
	if (!options.skipOptional && manifest.recommendedShared) {
		for (const name of manifest.recommendedShared) {
			const item = parseItemName(`shared/${name}`);
			if (item.found && !items.some((i) => i.name === item.name)) {
				items.push(item);
			}
		}
	}

	return resolveDependencies(items, {
		includeOptional: !options.skipOptional,
		skipInstalled: options.skipInstalled,
	});
}

/**
 * Update config with face selection
 */
export async function updateConfigWithFace(
	config: ComponentConfig,
	faceName: string,
	cwd: string
): Promise<ComponentConfig> {
	const updatedConfig: ComponentConfig = {
		...config,
		css: {
			...config.css,
			face: faceName,
		},
	};

	await writeConfig(updatedConfig, cwd);
	return updatedConfig;
}

/**
 * Inject face CSS imports into project
 */
export async function injectFaceCss(
	faceName: string,
	config: ComponentConfig,
	cwd: string
): Promise<boolean> {
	const projectDetails = await detectProjectDetails(cwd);

	if (projectDetails.cssEntryPoints.length === 0) {
		logger.warn(chalk.yellow('⚠️  No CSS entry point found. Please add CSS imports manually.'));
		logger.note(chalk.dim(`  Add to your layout/entry file:`));
		logger.note(chalk.cyan(`    import '@equaltoai/greater-components/tokens/theme.css';`));
		logger.note(chalk.cyan(`    import '@equaltoai/greater-components/primitives/style.css';`));
		logger.note(
			chalk.cyan(`    import '@equaltoai/greater-components/faces/${faceName}/style.css';`)
		);
		return false;
	}

	const cssConfig: CssImportConfig = {
		tokens: config.css?.tokens ?? true,
		primitives: config.css?.primitives ?? true,
		face: faceName,
	};

	// Try to inject into the first entry point
	const entryPoint = projectDetails.cssEntryPoints[0];

	if (!entryPoint) {
		logger.warn(chalk.yellow('⚠️  No CSS entry point found.'));
		return false;
	}

	try {
		const result = await injectCssImports(entryPoint, cssConfig);

		if (result.success) {
			logger.info(chalk.green(`✓ CSS imports added to ${path.relative(cwd, result.filePath)}`));
			if (result.addedImports.length > 0) {
				for (const imp of result.addedImports) {
					logger.note(chalk.dim(`  + ${imp}`));
				}
			}
			return true;
		} else {
			logger.warn(chalk.yellow(`⚠️  Could not inject CSS: ${result.error}`));
			return false;
		}
	} catch (error) {
		logger.warn(
			chalk.yellow(
				`⚠️  CSS injection failed: ${error instanceof Error ? error.message : String(error)}`
			)
		);
		return false;
	}
}

/**
 * Display face installation summary
 */
export function displayFaceInstallSummary(result: FaceInstallResult): void {
	logger.info(chalk.bold(`\n🎭 Face "${result.face}" installed successfully!\n`));

	const manifest = result.manifest;

	logger.info(chalk.dim('Included:'));
	logger.info(`  Primitives: ${chalk.cyan(manifest.includes.primitives.length)}`);
	logger.info(`  Shared:     ${chalk.cyan(manifest.includes.shared.length)}`);
	logger.info(`  Patterns:   ${chalk.cyan(manifest.includes.patterns.length)}`);
	logger.info(`  Components: ${chalk.cyan(manifest.includes.components.length)}`);

	if (result.cssInjected) {
		logger.info(chalk.green('\n✓ CSS imports configured'));
	}

	if (result.configUpdated) {
		logger.info(chalk.green('✓ Configuration updated'));
	}

	logger.note(chalk.dim('\nNext steps:'));
	logger.note(chalk.dim('  Import components from your configured aliases'));
	logger.note(
		chalk.cyan(
			`  import { Timeline, Status } from '${manifest.styles.main.replace('/style.css', '')}';`
		)
	);
}
