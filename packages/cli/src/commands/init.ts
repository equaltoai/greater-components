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
	type ComponentConfig,
} from '../utils/config.js';
import { isValidProject, detectProjectType, getSvelteVersion } from '../utils/files.js';
import { logger } from '../utils/logger.js';

export const initCommand = new Command()
	.name('init')
	.description('Initialize Greater Components in your project')
	.option('-y, --yes', 'Skip prompts and use defaults')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.action(async (options) => {
		const cwd = path.resolve(options.cwd || process.cwd());

		logger.info(chalk.bold('\n✨ Welcome to Greater Components\n'));

		// Check if valid project
		const spinner = ora('Checking project...').start();

		if (!(await isValidProject(cwd))) {
			spinner.fail('Not a valid project. Please run this command in a project root with package.json');
			process.exit(1);
		}

		// Check if already initialized
		if (await configExists(cwd)) {
			spinner.warn('Greater Components is already initialized in this project');
			process.exit(0);
		}

		// Detect project details
		const projectType = await detectProjectType(cwd);
		const svelteVersion = await getSvelteVersion(cwd);

		spinner.succeed('Project detected');

		// Show project info
		logger.note(chalk.dim('\nProject Information:'));
		logger.note(chalk.dim(`  Type: ${projectType}`));
		logger.note(chalk.dim(`  Svelte: v${svelteVersion || 'unknown'}\n`));

		// Verify Svelte 5
		if (svelteVersion && svelteVersion < 5) {
			logger.warn(chalk.yellow('⚠️  Greater Components requires Svelte 5+'));
			logger.note(chalk.dim('  Please upgrade Svelte before continuing\n'));
			process.exit(1);
		}

		// Get configuration
		let config: ComponentConfig;

		if (options.yes) {
			config = createDefaultConfig();
		} else {
			const response = await prompts([
				{
					type: 'select',
					name: 'style',
					message: 'Which style would you like to use?',
					choices: [
						{ title: 'Default', value: 'default' },
						{ title: 'New York', value: 'new-york' },
					],
					initial: 0,
				},
				{
					type: 'text',
					name: 'componentsPath',
					message: 'Where would you like to store components?',
					initial: '$lib/components/ui',
				},
				{
					type: 'text',
					name: 'utilsPath',
					message: 'Where would you like to store utils?',
					initial: '$lib/utils',
				},
			]);

			if (!response.style) {
				logger.error(chalk.red('\n✖ Setup cancelled'));
				process.exit(0);
			}

			config = {
				style: response.style,
				rsc: false,
				tsx: true,
				aliases: {
					components: '$lib/components',
					utils: response.utilsPath,
					ui: response.componentsPath,
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};
		}

		// Write configuration
		const configSpinner = ora('Creating configuration...').start();

		try {
			await writeConfig(config, cwd);
			configSpinner.succeed('Configuration created');
		} catch (error) {
			configSpinner.fail('Failed to create configuration');
			console.error(chalk.red(error instanceof Error ? error.message : String(error)));
			process.exit(1);
		}

		// Success
		logger.success(chalk.green('\n✓ Greater Components initialized successfully!\n'));
		logger.note(chalk.dim('Next steps:'));
		logger.note(chalk.dim('  1. Add your first component: ') + chalk.cyan('greater add button'));
		logger.note(chalk.dim('  2. Browse components: ') + chalk.cyan('greater list'));
		logger.note(chalk.dim('  3. View documentation: ') + chalk.cyan('https://greater.fediverse.dev\n'));
	});
