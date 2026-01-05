/**
 * Init command - Initialize Greater Components in a project
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import {
	createDefaultConfig,
	writeConfig,
	configExists,
	DEFAULT_REF,
	FALLBACK_REF,
	type ComponentConfig,
} from '../utils/config.js';
import { resolveRef } from '../utils/registry-index.js';
import { resolveRefForFetch } from '../utils/ref.js';
import {
	isValidProject,
	detectProjectDetails,
	validateSvelteVersion,
	type ProjectDetectionResult,
	type ProjectType,
} from '../utils/files.js';
import {
	injectCssImports,
	getRecommendedEntryPoint,
	copyCssFiles,
	type CssImportConfig,
	type ExtendedCssImportConfig,
} from '../utils/css-inject.js';
import { injectIdProvider } from '../utils/id-provider-inject.js';
import { faceRegistry } from '../registry/faces.js';
import { logger } from '../utils/logger.js';
import { ensureLocalRepoRoot } from '../utils/local-repo.js';

/**
 * Available faces for selection
 */
const AVAILABLE_FACES = [
	{
		title: 'None (core primitives only)',
		value: null,
		description: 'Basic UI components without ActivityPub features',
	},
	{ title: 'Social', value: 'social', description: 'Twitter/Mastodon-style social media UI' },
	{ title: 'Blog', value: 'blog', description: 'Long-form content and article UI' },
	{ title: 'Community', value: 'community', description: 'Forum and group discussion UI' },
	{
		title: 'Artist',
		value: 'artist',
		description: 'Visual artist portfolios and gallery platforms',
	},
] as const;

/**
 * Format project type for display
 */
function formatProjectType(type: ProjectType): string {
	switch (type) {
		case 'sveltekit':
			return 'SvelteKit';
		case 'vite-svelte':
			return 'Vite + Svelte';
		case 'svelte':
			return 'Svelte';
		default:
			return 'Unknown';
	}
}

/**
 * Display project detection summary
 */
function displayProjectSummary(details: ProjectDetectionResult): void {
	logger.info(chalk.bold('\n📋 Project Detection Summary\n'));

	const typeLabel = formatProjectType(details.type);
	const typeColor = details.type === 'unknown' ? chalk.yellow : chalk.green;

	logger.info(`  ${chalk.dim('Project Type:')} ${typeColor(typeLabel)}`);

	if (details.svelteConfigPath) {
		logger.info(
			`  ${chalk.dim('Svelte Config:')} ${chalk.cyan(path.basename(details.svelteConfigPath))}`
		);
	}

	if (details.viteConfigPath) {
		logger.info(
			`  ${chalk.dim('Vite Config:')} ${chalk.cyan(path.basename(details.viteConfigPath))}`
		);
	}

	logger.info(
		`  ${chalk.dim('TypeScript:')} ${details.hasTypeScript ? chalk.green('Yes') : chalk.dim('No')}`
	);

	if (details.cssEntryPoints.length > 0) {
		logger.info(`  ${chalk.dim('CSS Entry Points:')}`);
		for (const entry of details.cssEntryPoints) {
			const relativePath = path.relative(process.cwd(), entry.path);
			logger.info(
				`    ${chalk.dim('•')} ${chalk.cyan(relativePath)} ${chalk.dim(`(${entry.type})`)}`
			);
		}
	}

	logger.newline();
}

/**
 * Display configuration summary before creation
 */
function displayConfigSummary(config: ComponentConfig, face: string | null): void {
	logger.info(chalk.bold('\n📦 Configuration Summary\n'));

	logger.info(`  ${chalk.dim('Style:')} ${chalk.cyan(config.style)}`);
	logger.info(`  ${chalk.dim('Components:')} ${chalk.cyan(config.aliases.ui)}`);
	logger.info(`  ${chalk.dim('Utils:')} ${chalk.cyan(config.aliases.utils)}`);
	logger.info(`  ${chalk.dim('Headless Primitives:')} ${chalk.cyan(config.aliases.hooks)}`);
	logger.info(`  ${chalk.dim('Version Tag:')} ${chalk.cyan(config.ref)}`);

	if (face) {
		const faceInfo = faceRegistry[face];
		logger.info(
			`  ${chalk.dim('Face:')} ${chalk.cyan(face)} ${chalk.dim(`- ${faceInfo?.description || ''}`)}`
		);
	} else {
		logger.info(`  ${chalk.dim('Face:')} ${chalk.dim('None (core primitives only)')}`);
	}

	logger.newline();
}

/**
 * Display post-initialization instructions
 * CSS import paths verified against official documentation:
 * - @equaltoai/greater-components/tokens/theme.css
 * - @equaltoai/greater-components/primitives/style.css
 * - @equaltoai/greater-components/faces/{face}/style.css
 */
function displayPostInitInstructions(
	_config: ComponentConfig,
	face: string | null,
	cssInjected: boolean
): void {
	logger.success(chalk.green('\n✓ Greater Components initialized successfully!\n'));

	logger.info(chalk.bold('Next steps:\n'));

	// Step 1: CSS imports (if not auto-injected)
	if (!cssInjected) {
		logger.info(chalk.dim('  1. ') + chalk.white('Add CSS imports to your root layout:'));
		logger.info(chalk.cyan(`     import '@equaltoai/greater-components/tokens/theme.css';`));
		logger.info(chalk.cyan(`     import '@equaltoai/greater-components/primitives/style.css';`));
		if (face) {
			logger.info(
				chalk.cyan(`     import '@equaltoai/greater-components/faces/${face}/style.css';`)
			);
		}
		logger.newline();
	}

	// Step 2: Add components
	const stepNum = cssInjected ? 1 : 2;
	logger.info(chalk.dim(`  ${stepNum}. `) + chalk.white('Add your first component:'));
	logger.info(chalk.cyan('     greater add button'));
	logger.newline();

	// Step 3: Face-specific components
	if (face) {
		logger.info(chalk.dim(`  ${stepNum + 1}. `) + chalk.white(`Add ${face} face components:`));
		const faceInfo = faceRegistry[face];
		if (faceInfo?.includes?.components) {
			const exampleComponents = faceInfo.includes.components.slice(0, 3);
			logger.info(chalk.cyan(`     greater add ${exampleComponents.join(' ')}`));
		}
		logger.newline();
	}

	// Additional commands
	logger.info(chalk.bold('Useful commands:\n'));
	logger.info(
		`  ${chalk.cyan('greater list')}          ${chalk.dim('Browse all available components')}`
	);
	logger.info(
		`  ${chalk.cyan('greater add <name>')}    ${chalk.dim('Add a component to your project')}`
	);
	logger.info(
		`  ${chalk.cyan('greater add --all')}     ${chalk.dim('Add all dependencies automatically')}`
	);
	logger.newline();

	// Documentation link
	logger.info(chalk.dim('Documentation: ') + chalk.cyan('https://greater.fediverse.dev'));
	logger.newline();
}

export const initAction = async (options: {
	yes?: boolean;
	cwd?: string;
	ref?: string;
	skipCss?: boolean;
	face?: string;
}) => {
	const cwd = path.resolve(options.cwd || process.cwd());
	ensureLocalRepoRoot(cwd);

	logger.info(chalk.bold('\n✨ Welcome to Greater Components\n'));

	// Check if valid project
	const spinner = ora('Checking project...').start();

	if (!(await isValidProject(cwd))) {
		spinner.fail(
			'Not a valid project. Please run this command in a project root with package.json'
		);
		process.exit(1);
	}

	// Check if already initialized
	if (await configExists(cwd)) {
		spinner.warn('Greater Components is already initialized in this project');
		logger.note(chalk.dim('\n  To reinitialize, delete components.json and run again.\n'));
		process.exit(0);
	}

	// Detect project details
	const projectDetails = await detectProjectDetails(cwd);
	spinner.succeed('Project detected');

	// Display project summary
	displayProjectSummary(projectDetails);

	// Validate Svelte version
	const svelteValidation = await validateSvelteVersion(cwd);

	if (!svelteValidation.valid) {
		logger.error(chalk.red('\n✖ Svelte version requirement not met\n'));

		if (svelteValidation.upgradeInstructions) {
			logger.info(chalk.yellow(svelteValidation.upgradeInstructions));
		}

		logger.newline();
		process.exit(1);
	}

	// Display Svelte version
	if (svelteValidation.version) {
		logger.info(
			chalk.green('✓') +
				chalk.dim(` Svelte ${svelteValidation.version.raw} detected (requires 5.0.0+)`)
		);
		logger.newline();
	}

	// Validate face option if provided
	let selectedFace: string | null = options.face || null;
	if (selectedFace && !['social', 'blog', 'community', 'artist'].includes(selectedFace)) {
		logger.error(chalk.red(`\n✖ Invalid face: ${selectedFace}`));
		logger.note(chalk.dim('  Available faces: social, blog, community, artist\n'));
		process.exit(1);
	}

	// Resolve ref (supports "latest" alias via registry/latest.json)
	const resolved = await resolveRef(options.ref || DEFAULT_REF, undefined, FALLBACK_REF);
	const targetRef = await resolveRefForFetch(resolved.ref);

	// Get configuration
	let config: ComponentConfig;

	if (options.yes) {
		// Non-interactive mode with defaults
		config = createDefaultConfig({
			projectType: projectDetails.type,
			hasTypeScript: projectDetails.hasTypeScript,
			ref: targetRef,
			face: selectedFace,
		});
	} else {
		// Interactive configuration
		const response = await prompts([
			{
				type: 'select',
				name: 'style',
				message: 'Which style would you like to use?',
				choices: [
					{ title: 'Default', value: 'default', description: 'Clean, modern default style' },
					{ title: 'New York', value: 'new-york', description: 'Refined, editorial style' },
					{ title: 'Minimal', value: 'minimal', description: 'Stripped-down, lightweight style' },
				],
				initial: 0,
			},
			{
				type: 'text',
				name: 'componentsPath',
				message: 'Where would you like to store components?',
				initial:
					projectDetails.type === 'sveltekit' ? '$lib/components/ui' : 'src/lib/components/ui',
			},
			{
				type: 'text',
				name: 'utilsPath',
				message: 'Where would you like to store utils?',
				initial: projectDetails.type === 'sveltekit' ? '$lib/utils' : 'src/lib/utils',
			},
			{
				type: 'text',
				name: 'hooksPath',
				message: 'Where would you like to store headless primitives?',
				initial: projectDetails.type === 'sveltekit' ? '$lib/primitives' : 'src/lib/primitives',
			},
			{
				type: selectedFace ? null : 'select',
				name: 'face',
				message: 'Would you like to use a pre-built face?',
				choices: AVAILABLE_FACES.map((f) => ({
					title: f.title,
					value: f.value,
					description: f.description,
				})),
				initial: 0,
			},
		]);

		if (!response.style) {
			logger.error(chalk.red('\n✖ Setup cancelled'));
			process.exit(0);
		}

		// Use pre-selected face or prompt response
		const finalFace = selectedFace || response.face;

		// Create base config with defaults
		const defaultConfig = createDefaultConfig({
			projectType: projectDetails.type,
			hasTypeScript: projectDetails.hasTypeScript,
			ref: targetRef,
			face: finalFace,
		});

		// Override with user selections
		config = {
			...defaultConfig,
			style: response.style,
			aliases: {
				...defaultConfig.aliases,
				components: response.componentsPath.replace('/ui', ''),
				utils: response.utilsPath,
				ui: response.componentsPath,
				hooks: response.hooksPath,
			},
		};

		selectedFace = finalFace;
	}

	// Display configuration summary
	displayConfigSummary(config, selectedFace);

	// Confirm before proceeding (unless --yes)
	if (!options.yes) {
		const confirmResponse = await prompts({
			type: 'confirm',
			name: 'confirm',
			message: 'Create configuration with these settings?',
			initial: true,
		});

		if (!confirmResponse.confirm) {
			logger.warn(chalk.yellow('\n✖ Setup cancelled'));
			process.exit(0);
		}
	}

	// Write configuration
	const configSpinner = ora('Creating configuration...').start();

	try {
		await writeConfig(config, cwd);
		configSpinner.succeed('Configuration created (components.json)');
	} catch (error) {
		configSpinner.fail('Failed to create configuration');
		logger.error(chalk.red(error instanceof Error ? error.message : String(error)));
		process.exit(1);
	}

	// CSS injection
	let cssInjected = false;
	let _cssCopied = false;

	if (!options.skipCss && projectDetails.cssEntryPoints.length > 0) {
		const isLocalMode = config.css?.source === 'local';
		const localDir = config.css?.localDir ?? 'styles/greater';
		const libAlias = config.aliases.lib;

		const cssConfig: CssImportConfig = {
			tokens: config.css?.tokens ?? true,
			primitives: config.css?.primitives ?? true,
			face: selectedFace,
		};

		// Step 1: Copy CSS files for local mode
		if (isLocalMode) {
			const copySpinner = ora('Copying CSS files...').start();

			try {
				const copyResult = await copyCssFiles({
					ref: config.ref,
					cssConfig,
					libDir: libAlias,
					localDir,
					cwd,
					overwrite: false,
				});

				if (copyResult.success) {
					if (copyResult.copiedFiles.length > 0) {
						copySpinner.succeed(
							`Copied ${copyResult.copiedFiles.length} CSS file(s) to ${path.relative(cwd, copyResult.targetDir)}`
						);
						_cssCopied = true;
					} else if (copyResult.skippedFiles.length > 0) {
						copySpinner.info('CSS files already exist (skipped)');
						_cssCopied = true;
					}
				} else {
					copySpinner.warn(`Could not copy CSS files: ${copyResult.error}`);
				}
			} catch {
				copySpinner.warn('CSS file copying failed, you can copy files manually');
			}
		}

		// Step 2: Build extended config for import generation
		const extendedCssConfig: ExtendedCssImportConfig = {
			...cssConfig,
			source: config.css?.source ?? 'local',
			localDir,
			libAlias,
		};

		// Get recommended entry point
		const recommendedEntry = getRecommendedEntryPoint(
			projectDetails.cssEntryPoints,
			projectDetails.type
		);

		if (recommendedEntry) {
			let targetEntry = recommendedEntry;

			// In interactive mode, let user choose
			if (!options.yes && projectDetails.cssEntryPoints.length > 1) {
				const cssResponse = await prompts({
					type: 'select',
					name: 'entryPoint',
					message: 'Where should CSS imports be added?',
					choices: [
						...projectDetails.cssEntryPoints.map((e) => ({
							title: path.relative(cwd, e.path),
							value: e,
							description: `${e.type} file`,
						})),
						{ title: 'Skip CSS injection', value: null, description: 'Add imports manually' },
					],
					initial: 0,
				});

				if (cssResponse.entryPoint === undefined) {
					logger.warn(chalk.yellow('\n✖ Setup cancelled'));
					process.exit(0);
				}

				targetEntry = cssResponse.entryPoint;
			}

			if (targetEntry) {
				const cssSpinner = ora('Injecting CSS imports...').start();

				try {
					const result = await injectCssImports(targetEntry, extendedCssConfig);

					if (result.success) {
						if (result.addedImports.length > 0) {
							cssSpinner.succeed(`Added CSS imports to ${path.relative(cwd, result.filePath)}`);
							cssInjected = true;
						} else {
							cssSpinner.info('CSS imports already present');
							cssInjected = true;
						}
					} else {
						cssSpinner.warn(`Could not inject CSS: ${result.error}`);
					}
				} catch {
					cssSpinner.warn('CSS injection failed, you can add imports manually');
				}
			}
		}
	}

	// IdProvider injection
	const rootLayout = projectDetails.cssEntryPoints.find((e) => e.type === 'root-layout');
	if (rootLayout) {
		const idSpinner = ora('Injecting IdProvider...').start();
		try {
			const result = await injectIdProvider(rootLayout.path, config);
			if (result.success) {
				if (result.skipped) {
					idSpinner.info('IdProvider already configured');
				} else {
					idSpinner.succeed(`IdProvider injected into ${path.relative(cwd, rootLayout.path)}`);
				}
			} else {
				idSpinner.warn(`Failed to inject IdProvider: ${result.error}`);
			}
		} catch (error) {
			idSpinner.warn(
				`Failed to inject IdProvider: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Display post-init instructions
	displayPostInitInstructions(config, selectedFace, cssInjected);
};

export const initCommand = new Command()
	.name('init')
	.description('Initialize Greater Components in your project')
	.option('-y, --yes', 'Skip prompts and use defaults')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('--ref <tag>', 'Pin to a specific version tag (default: latest stable)')
	.option('--skip-css', 'Skip automatic CSS injection')
	.option('--face <name>', 'Pre-select a face (social, blog, community, artist)')
	.action(initAction);
