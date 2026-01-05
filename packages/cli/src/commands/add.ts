/**
 * Add command - Add components to your project
 * Enhanced to support faces, shared modules, patterns, and full dependency resolution
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import {
	readConfig,
	configExists,
	writeConfig,
	addInstalledComponent,
	getInstalledComponentNames,
	FALLBACK_REF,
} from '../utils/config.js';
import { componentRegistry, getComponent, type ComponentMetadata } from '../registry/index.js';
import { getFaceManifest, getAllFaceNames } from '../registry/faces.js';
import { getAllSharedModuleNames } from '../registry/shared.js';
import { getAllPatternNames } from '../registry/patterns.js';
import type { ComponentFile } from '../registry/index.js';
import { fetchComponents, type FetchOptions } from '../utils/fetch.js';

import { writeComponentFilesWithTransform, fileExists } from '../utils/files.js';
import { getInstallTarget } from '../utils/install-path.js';
import {
	installDependencies,
	getMissingDependencies,
	detectPackageManager,
} from '../utils/packages.js';
import { logger } from '../utils/logger.js';
import { parseItems, parseItemName, validateParseResult } from '../utils/item-parser.js';
import {
	resolveDependencies,
	getInstallationOrder,
	type DependencyResolutionResult,
} from '../utils/dependency-resolver.js';
import {
	generatePreview,
	displayPreview,
	displayDryRunPreview,
	displayResolutionErrors,
} from '../utils/install-preview.js';
import {
	resolveFaceDependencies,
	updateConfigWithFace,
	injectFaceCss,
	displayFaceInstallSummary,
} from '../utils/face-installer.js';
import { resolveRef, fetchRegistryIndex, type RegistryIndex } from '../utils/registry-index.js';
import { hasGreaterImports } from '../utils/transform.js';
import { ensureLocalRepoRoot } from '../utils/local-repo.js';
import { resolveRefForFetch } from '../utils/ref.js';

const GREATER_COMPONENTS_PACKAGE = '@equaltoai/greater-components';
const GREATER_TAG_VERSION_RE = /^greater-v(\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?)$/;

const CORE_PACKAGES = ['primitives', 'icons', 'tokens', 'utils', 'content', 'adapters', 'headless'];

function getGreaterComponentsVersionSpec(ref: string): string {
	const match = GREATER_TAG_VERSION_RE.exec(ref);
	return match?.[1] ?? 'latest';
}

/**
 * Build interactive selection choices
 */
export function buildSelectionChoices(): Array<{
	title: string;
	value: string;
	description?: string;
}> {
	const choices: Array<{ title: string; value: string; description?: string }> = [];

	// Add faces first
	const faces = getAllFaceNames();
	if (faces.length > 0) {
		choices.push({
			title: chalk.bold.cyan('── Faces ──'),
			value: '',
			description: 'Complete UI bundles',
		});
		for (const name of faces) {
			const manifest = getFaceManifest(name);
			choices.push({
				title: `  faces/${name}`,
				value: `faces/${name}`,
				description: manifest?.description || '',
			});
		}
	}

	// Add primitives
	const primitives = Object.values(componentRegistry).filter((c) => c.type === 'primitive');
	if (primitives.length > 0) {
		choices.push({
			title: chalk.bold.cyan('── Primitives ──'),
			value: '',
			description: 'Headless UI primitives',
		});
		for (const comp of primitives) {
			choices.push({
				title: `  ${comp.name}`,
				value: comp.name,
				description: comp.description,
			});
		}
	}

	// Add shared modules
	const shared = getAllSharedModuleNames();
	if (shared.length > 0) {
		choices.push({
			title: chalk.bold.cyan('── Shared Modules ──'),
			value: '',
			description: 'Reusable feature modules',
		});
		for (const name of shared) {
			choices.push({
				title: `  shared/${name}`,
				value: `shared/${name}`,
				description: '',
			});
		}
	}

	// Add patterns
	const patterns = getAllPatternNames();
	if (patterns.length > 0) {
		choices.push({
			title: chalk.bold.cyan('── Patterns ──'),
			value: '',
			description: 'UI patterns',
		});
		for (const name of patterns) {
			choices.push({
				title: `  patterns/${name}`,
				value: `patterns/${name}`,
				description: '',
			});
		}
	}

	return choices.filter((c) => c.value !== '');
}

export const addAction = async (
	items: string[],
	options: {
		yes?: boolean;
		all?: boolean;
		cwd?: string;
		path?: string;
		ref?: string;
		force?: boolean;
		dryRun?: boolean;
		cssOnly?: boolean;
		skipVerify?: boolean;
		verifySignature?: boolean;
	}
) => {
	const cwd = path.resolve(options.cwd || process.cwd());
	ensureLocalRepoRoot(cwd);

	// Check if initialized
	if (!(await configExists(cwd))) {
		logger.error(chalk.red('✖ Greater Components is not initialized'));
		logger.note(chalk.dim('  Run ') + chalk.cyan('greater init') + chalk.dim(' first\n'));
		process.exit(1);
	}

	// Read config
	let config = await readConfig(cwd);
	if (!config) {
		logger.error(chalk.red('✖ Failed to read configuration'));
		process.exit(1);
	}

	const resolved = await resolveRef(options.ref, config.ref, FALLBACK_REF);
	const targetRef = await resolveRefForFetch(resolved.ref);

	// Fetch registry index for dependency resolution
	const registrySpinner = ora('Loading registry...').start();
	let registryIndex: RegistryIndex | undefined;
	try {
		registryIndex = await fetchRegistryIndex(targetRef);
		registrySpinner.succeed('Registry loaded');
	} catch (error) {
		registrySpinner.warn(
			`Failed to load registry index: ${error instanceof Error ? error.message : String(error)}`
		);
		logger.warn(chalk.yellow('Falling back to static dependency resolution (may be outdated)'));
	}

	// Get items to install
	let selectedItems: string[] = items;

	if (selectedItems.length === 0) {
		// Interactive selection with categorized choices
		const choices = buildSelectionChoices();
		const response = await prompts({
			type: 'multiselect',
			name: 'items',
			message: 'Select items to add:',
			choices,
			hint: 'Space to select. Enter to confirm.',
		});

		if (!response.items || response.items.length === 0) {
			logger.warn(chalk.yellow('\n✖ No items selected'));
			process.exit(0);
		}

		selectedItems = response.items;
	}

	// Parse and validate items
	const parseResult = parseItems(selectedItems);
	const validation = validateParseResult(parseResult);

	if (!validation.valid) {
		logger.error(chalk.red('\n✖ Unknown items:'));
		for (const error of validation.errors) {
			logger.error(`  ${chalk.red('→')} ${error}`);
		}
		logger.note(
			chalk.dim('\n  Run ') + chalk.cyan('greater list') + chalk.dim(' to see available items\n')
		);
		process.exit(1);
	}

	// Check for face installations
	const faceItems = parseResult.byType.faces;
	const nonFaceItems = parseResult.items.filter((i) => i.type !== 'face');

	// Get already installed components for skip list
	const installedNames = getInstalledComponentNames(config);
	const skipInstalled = options.force ? [] : installedNames;

	// Resolve dependencies
	let resolution: DependencyResolutionResult;
	let isFaceInstall = false;

	if (faceItems.length > 0) {
		// Face installation - resolve face dependencies
		isFaceInstall = true;
		const faceName = faceItems[0]?.name ?? '';

		const faceResolution = resolveFaceDependencies(faceName, {
			skipOptional: !options.all,
			skipInstalled,
			registryIndex,
		});

		if (!faceResolution) {
			logger.error(chalk.red(`\n✖ Face "${faceName}" not found`));
			process.exit(1);
		}

		resolution = faceResolution;

		// Add any additional non-face items
		if (nonFaceItems.length > 0) {
			const additionalResolution = resolveDependencies(nonFaceItems, {
				includeOptional: options.all,
				skipInstalled,
				registryIndex,
			});
			// Merge resolutions
			for (const dep of additionalResolution.resolved) {
				if (!resolution.resolved.some((r) => r.name === dep.name)) {
					resolution.resolved.push(dep);
				}
			}
			resolution.npmDependencies.push(...additionalResolution.npmDependencies);
			resolution.npmDevDependencies.push(...additionalResolution.npmDevDependencies);
		}
	} else {
		// Regular component installation
		resolution = resolveDependencies(parseResult.items, {
			includeOptional: options.all,
			skipInstalled,
			registryIndex,
		});
	}

	// Check for resolution errors
	if (!resolution.success) {
		displayResolutionErrors(resolution);
		process.exit(1);
	}

	// Check if anything to install
	if (resolution.resolved.length === 0) {
		logger.info(chalk.yellow('\n✓ All requested items are already installed\n'));
		process.exit(0);
	}

	const isVendoredMode = config.installMode === 'vendored';

	// In vendored mode, ensure core packages are installed when needed.
	const needsCorePackages = isVendoredMode
		? resolution.resolved.some(
				(dep) =>
					dep.type === 'face' ||
					dep.type === 'shared' ||
					dep.type === 'compound' ||
					dep.type === 'pattern' ||
					dep.type === 'adapter'
			)
		: false;

	if (needsCorePackages) {
		const missingCore = CORE_PACKAGES.filter(
			(pkg) => !skipInstalled.includes(pkg) && !resolution.resolved.some((dep) => dep.name === pkg)
		);

		if (missingCore.length > 0) {
			const coreItems = missingCore.map((name) => parseItemName(name));
			const missingCoreItems = coreItems.filter((item) => !item.found).map((item) => item.input);
			if (missingCoreItems.length > 0) {
				logger.error(chalk.red('\n✖ Missing core registry items:'));
				for (const name of missingCoreItems) {
					logger.error(`  ${chalk.red('→')} ${name}`);
				}
				process.exit(1);
			}

			const coreResolution = resolveDependencies(coreItems, {
				includeOptional: options.all,
				skipInstalled,
				registryIndex,
			});

			if (!coreResolution.success) {
				displayResolutionErrors(coreResolution);
				process.exit(1);
			}

			for (const dep of coreResolution.resolved) {
				if (!resolution.resolved.some((r) => r.name === dep.name)) {
					resolution.resolved.push(dep);
				}
			}
			resolution.npmDependencies.push(...coreResolution.npmDependencies);
			resolution.npmDevDependencies.push(...coreResolution.npmDevDependencies);
		}
	}

	// In vendored mode, headless primitives are provided by the vendored headless core package.
	// Skip installing them as transitive dependencies to avoid duplicated and inconsistent layouts.
	if (isVendoredMode && needsCorePackages) {
		resolution.resolved = resolution.resolved.filter((dep) => dep.type !== 'primitive');
	}

	// Ensure the umbrella package is installed when installing any non-headless components.
	// Skip if in vendored mode.
	const requiresGreaterComponents = resolution.resolved.some(
		(dep) => dep.type === 'face' || dep.type === 'shared' || dep.type === 'compound'
	);
	if (
		requiresGreaterComponents &&
		!isVendoredMode &&
		!resolution.npmDependencies.some((dep) => dep.name === GREATER_COMPONENTS_PACKAGE)
	) {
		resolution.npmDependencies.push({
			name: GREATER_COMPONENTS_PACKAGE,
			version: getGreaterComponentsVersionSpec(targetRef),
		});
	}

	// Generate and display preview
	const preview = generatePreview(resolution, config, cwd, options.path);

	// Dry run - just show preview and exit
	if (options.dryRun) {
		displayDryRunPreview(preview);
		process.exit(0);
	}

	displayPreview(preview);

	// Confirm installation
	if (!options.yes) {
		const response = await prompts({
			type: 'confirm',
			name: 'confirm',
			message: 'Continue with installation?',
			initial: true,
		});

		if (!response.confirm) {
			logger.warn(chalk.yellow('\n✖ Installation cancelled'));
			process.exit(0);
		}
	}

	// Check for existing files if not forcing
	if (!options.force) {
		const existingFiles: string[] = [];
		for (const targetPath of preview.targetPaths) {
			for (const file of targetPath.files) {
				const fullPath = path.join(targetPath.targetDir, file);
				if (await fileExists(fullPath)) {
					existingFiles.push(fullPath);
				}
			}
		}

		if (existingFiles.length > 0) {
			logger.warn(chalk.yellow('\n⚠️  The following files already exist:'));
			for (const file of existingFiles.slice(0, 5)) {
				logger.warn(`  ${chalk.dim(path.relative(cwd, file))}`);
			}
			if (existingFiles.length > 5) {
				logger.warn(chalk.dim(`  ... and ${existingFiles.length - 5} more`));
			}

			const response = await prompts({
				type: 'confirm',
				name: 'overwrite',
				message: 'Overwrite existing files?',
				initial: false,
			});

			if (!response.overwrite) {
				logger.warn(chalk.yellow('\n✖ Installation cancelled'));
				logger.note(chalk.dim('  Use --force to overwrite existing files\n'));
				process.exit(0);
			}
		}
	}

	// Get installation order (dependencies first)
	const installOrder = getInstallationOrder(resolution);

	// Fetch components
	const fetchSpinner = ora('Fetching components...').start();

	const fetchOptions: FetchOptions = {
		ref: targetRef,
		verbose: false,
		skipVerification: options.skipVerify,
		verifySignature: options.verifySignature,
		failFast: true,
	};

	let componentFiles: Map<string, ComponentFile[]>;
	try {
		// Build registry map for fetching
		const registryMap: Record<string, ComponentMetadata> = {};
		for (const dep of resolution.resolved) {
			registryMap[dep.name] = dep.metadata;
		}

		componentFiles = await fetchComponents(installOrder, registryMap, fetchOptions);
		fetchSpinner.succeed(`Fetched ${installOrder.length} component(s)`);
	} catch (error) {
		fetchSpinner.fail('Failed to fetch components');
		console.error(chalk.red(error instanceof Error ? error.message : String(error)));
		process.exit(1);
	}

	// CSS-only mode for faces
	if (options.cssOnly && isFaceInstall) {
		const faceName = faceItems[0]?.name ?? '';
		const cssSpinner = ora('Injecting CSS imports...').start();

		try {
			const cssInjected = await injectFaceCss(faceName, config, cwd);
			if (cssInjected) {
				cssSpinner.succeed('CSS imports added');
			} else {
				cssSpinner.warn('CSS imports need manual configuration');
			}

			// Update config with face
			config = await updateConfigWithFace(config, faceName, cwd);
			logger.success(chalk.green('\n✓ Face CSS configured successfully!\n'));
			process.exit(0);
		} catch (error) {
			cssSpinner.fail('Failed to inject CSS');
			console.error(chalk.red(error instanceof Error ? error.message : String(error)));
			process.exit(1);
		}
	}

	// Write files with import transformation
	const writeSpinner = ora('Writing and transforming files...').start();
	const vendoredImportFailures: string[] = [];

	try {
		let totalTransformed = 0;
		let totalFiles = 0;

		for (const dep of resolution.resolved) {
			const files = componentFiles.get(dep.name);
			if (!files) continue;

			const overrideDir = options.path ? path.resolve(cwd, options.path) : null;
			const byTargetDir = new Map<string, ComponentFile[]>();

			for (const file of files) {
				const target = getInstallTarget(file.path, config, cwd);
				const targetDir = overrideDir ?? target.targetDir;
				const mappedFile: ComponentFile = { ...file, path: target.relativePath };

				const group = byTargetDir.get(targetDir) ?? [];
				group.push(mappedFile);
				byTargetDir.set(targetDir, group);
			}

			for (const [targetDir, groupFiles] of byTargetDir) {
				const result = await writeComponentFilesWithTransform(groupFiles, targetDir, config);
				totalFiles += result.writtenFiles.length;
				totalTransformed += result.transformResults.reduce((sum, r) => sum + r.transformedCount, 0);

				if (isVendoredMode) {
					for (let i = 0; i < result.writtenFiles.length; i++) {
						const content = result.transformResults[i]?.content;
						if (content && hasGreaterImports(content)) {
							vendoredImportFailures.push(result.writtenFiles[i] ?? '');
						}
					}
				}
			}
		}

		writeSpinner.succeed(`Wrote ${totalFiles} file(s)`);

		if (totalTransformed > 0) {
			logger.info(
				chalk.dim(`  ↳ Transformed ${totalTransformed} import path(s) to match your aliases`)
			);
		}

		// Vendored import gate: ensure no runtime coupling on @equaltoai/greater-components*
		if (isVendoredMode && vendoredImportFailures.length > 0) {
			logger.error(
				chalk.red(
					'\n✖ Verification Failed: Found remaining @equaltoai/greater-components imports in vendored files:'
				)
			);
			for (const file of [...new Set(vendoredImportFailures)].filter(Boolean)) {
				logger.error(`  ${chalk.red('→')} ${path.relative(cwd, file)}`);
			}
			process.exit(1);
		}
	} catch (error) {
		writeSpinner.fail('Failed to write files');
		console.error(chalk.red(error instanceof Error ? error.message : String(error)));
		process.exit(1);
	}

	// Update installed components tracking in config
	const updateConfigSpinner = ora('Updating configuration...').start();
	try {
		let updatedConfig = config;

		for (const dep of resolution.resolved) {
			updatedConfig = addInstalledComponent(updatedConfig, dep.name, targetRef);
		}

		// Update face in config if face installation
		if (isFaceInstall) {
			const faceName = faceItems[0]?.name ?? '';
			updatedConfig = {
				...updatedConfig,
				css: {
					...updatedConfig.css,
					face: faceName,
				},
			};
		}

		updatedConfig = {
			...updatedConfig,
			ref: targetRef,
		};

		await writeConfig(updatedConfig, cwd);
		config = updatedConfig;
		updateConfigSpinner.succeed('Updated components.json');
	} catch (error) {
		updateConfigSpinner.fail('Failed to update configuration');
		console.error(chalk.red(error instanceof Error ? error.message : String(error)));
		// Continue anyway - files are already written
	}

	// Inject CSS for face installations
	if (isFaceInstall) {
		const faceName = faceItems[0]?.name ?? '';
		const cssSpinner = ora('Configuring CSS imports...').start();

		try {
			const cssInjected = await injectFaceCss(faceName, config, cwd);
			if (cssInjected) {
				cssSpinner.succeed('CSS imports configured');
			} else {
				cssSpinner.warn('CSS imports need manual configuration');
			}
		} catch {
			cssSpinner.warn('CSS injection skipped');
		}
	}

	// Install npm dependencies
	const allDeps = resolution.npmDependencies.filter((dep) => {
		if (!isVendoredMode) return true;
		return !dep.name.startsWith('@equaltoai/greater-components-');
	});
	const allDevDeps = resolution.npmDevDependencies.filter((dep) => {
		if (!isVendoredMode) return true;
		return !dep.name.startsWith('@equaltoai/greater-components-');
	});

	// Check which dependencies are missing
	const missingDeps = await getMissingDependencies(allDeps, cwd);
	const missingDevDeps = await getMissingDependencies(allDevDeps, cwd);

	if (missingDeps.length > 0 || missingDevDeps.length > 0) {
		logger.info(chalk.bold('\n📦 Installing dependencies:\n'));

		if (missingDeps.length > 0) {
			logger.note(chalk.dim('  Dependencies:'));
			missingDeps.forEach((dep) => logger.info(`    - ${dep.name}@${dep.version}`));
		}

		if (missingDevDeps.length > 0) {
			logger.note(chalk.dim('  Dev Dependencies:'));
			missingDevDeps.forEach((dep) => logger.info(`    - ${dep.name}@${dep.version}`));
		}

		logger.newline();

		const pm = await detectPackageManager(cwd);
		const installSpinner = ora(`Installing with ${pm}...`).start();

		try {
			if (missingDeps.length > 0) {
				await installDependencies(missingDeps, cwd, false);
			}

			if (missingDevDeps.length > 0) {
				await installDependencies(missingDevDeps, cwd, true);
			}

			installSpinner.succeed('Dependencies installed');
		} catch (error) {
			installSpinner.fail('Failed to install dependencies');
			console.error(chalk.red(error instanceof Error ? error.message : String(error)));
			process.exit(1);
		}
	}

	// Success message
	if (isFaceInstall) {
		const faceName = faceItems[0]?.name ?? '';
		const manifest = getFaceManifest(faceName);
		if (manifest) {
			displayFaceInstallSummary({
				face: faceName,
				manifest,
				resolution,
				cssInjected: true,
				configUpdated: true,
			});
		}
	} else {
		logger.success(chalk.green('\n✓ Components added successfully!\n'));

		// Show import examples based on what was installed
		logger.note(chalk.dim('Import and use in your components:'));

		if (parseResult.byType.primitives.length > 0) {
			const primitiveName = parseResult.byType.primitives[0]?.name;
			if (primitiveName) {
				const functionName =
					'create' + primitiveName.slice(0, 1).toUpperCase() + primitiveName.slice(1);
				logger.note(
					chalk.cyan(
						`  import { ${functionName} } from '${config.aliases.lib}/primitives/${primitiveName}';`
					)
				);
			}
		}
		if (parseResult.byType.shared.length > 0) {
			const sharedName = parseResult.byType.shared[0]?.name;
			if (sharedName) {
				const namespaceName = sharedName.slice(0, 1).toUpperCase() + sharedName.slice(1);
				logger.note(
					chalk.cyan(
						`  import * as ${namespaceName} from '${config.aliases.components}/${sharedName}';`
					)
				);
			}
		}
		if (parseResult.byType.patterns.length > 0) {
			const patternName = parseResult.byType.patterns[0]?.name;
			const pattern = patternName ? getComponent(patternName) : null;
			const patternFile = pattern?.files?.find((file) => file.path.endsWith('.svelte'));
			if (patternName && patternFile) {
				const target = getInstallTarget(patternFile.path, config, cwd);
				const componentName = path.basename(target.relativePath).replace(/\.svelte$/, '');
				logger.note(
					chalk.cyan(
						`  import ${componentName} from '${config.aliases.lib}/${target.relativePath}';`
					)
				);
			}
		}
		logger.newline();
	}
};

export const addCommand = new Command()
	.name('add')
	.description('Add components, faces, shared modules, or patterns to your project')
	.argument('[items...]', 'Items to add (e.g., button modal shared/auth faces/social)')
	.option('-y, --yes', 'Skip confirmation prompts')
	.option('-a, --all', 'Include optional dependencies')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('--path <path>', 'Custom installation path')
	.option('--ref <tag>', 'Git ref/tag to fetch from')
	.option('-f, --force', 'Overwrite existing files')
	.option('--dry-run', 'Preview installation without writing files')
	.option('--css-only', 'Only install CSS files (for faces)')
	.option('--skip-verify', 'Skip integrity verification (development only)')
	.option('--verify-signature', 'Verify Git tag signature')
	.action(addAction);
