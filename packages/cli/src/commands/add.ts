/**
 * Add command - Add components to your project
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import { readConfig, configExists, resolveAlias } from '../utils/config.js';
import {
	componentRegistry,
	getComponent,
	resolveComponentDependencies,
	getAllComponentNames,
} from '../registry/index.js';
import { fetchComponents } from '../utils/fetch.js';
import { writeComponentFiles } from '../utils/files.js';
import {
	installDependencies,
	getMissingDependencies,
	detectPackageManager,
} from '../utils/packages.js';

export const addCommand = new Command()
	.name('add')
	.description('Add components to your project')
	.argument('[components...]', 'Components to add')
	.option('-y, --yes', 'Skip confirmation prompts')
	.option('-a, --all', 'Add all dependencies')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('--path <path>', 'Custom installation path')
	.action(async (components: string[], options) => {
		const cwd = path.resolve(options.cwd || process.cwd());

		// Check if initialized
		if (!(await configExists(cwd))) {
			console.log(chalk.red('✖ Greater Components is not initialized'));
			console.log(chalk.dim('  Run ') + chalk.cyan('greater init') + chalk.dim(' first\n'));
			process.exit(1);
		}

		// Read config
		const config = await readConfig(cwd);
		if (!config) {
			console.log(chalk.red('✖ Failed to read configuration'));
			process.exit(1);
		}

		// Get components to install
		let selectedComponents: string[] = components;

		if (selectedComponents.length === 0) {
			// Interactive selection
			const availableComponents = getAllComponentNames();
			const response = await prompts({
				type: 'multiselect',
				name: 'components',
				message: 'Select components to add:',
				choices: availableComponents.map((name) => {
					const meta = getComponent(name);
					return {
						title: name,
						value: name,
						description: meta?.description || '',
					};
				}),
				hint: 'Space to select. Enter to confirm.',
			});

			if (!response.components || response.components.length === 0) {
				console.log(chalk.yellow('\n✖ No components selected'));
				process.exit(0);
			}

			selectedComponents = response.components;
		}

		// Validate components
		const invalidComponents = selectedComponents.filter((name) => !getComponent(name));
		if (invalidComponents.length > 0) {
			console.log(chalk.red(`\n✖ Unknown components: ${invalidComponents.join(', ')}`));
			console.log(chalk.dim('  Run ') + chalk.cyan('greater list') + chalk.dim(' to see available components\n'));
			process.exit(1);
		}

		// Resolve dependencies
		const allComponents = new Set<string>();
		for (const name of selectedComponents) {
			resolveComponentDependencies(name).forEach((dep) => allComponents.add(dep));
		}

		const componentsToInstall = Array.from(allComponents);

		// Show what will be installed
		console.log(chalk.bold('\n📦 Components to install:\n'));
		for (const name of componentsToInstall) {
			const meta = getComponent(name);
			if (meta) {
				const badge = chalk.dim(`[${meta.type}]`);
				console.log(`  ${badge} ${name}`);
			}
		}
		console.log('');

		// Confirm
		if (!options.yes) {
			const response = await prompts({
				type: 'confirm',
				name: 'confirm',
				message: 'Continue with installation?',
				initial: true,
			});

			if (!response.confirm) {
				console.log(chalk.yellow('\n✖ Installation cancelled'));
				process.exit(0);
			}
		}

		// Fetch components
		const fetchSpinner = ora('Fetching components...').start();

		let componentFiles: Map<string, any>;
		try {
			componentFiles = await fetchComponents(componentsToInstall, componentRegistry);
			fetchSpinner.succeed(`Fetched ${componentsToInstall.length} component(s)`);
		} catch (error) {
			fetchSpinner.fail('Failed to fetch components');
			console.error(chalk.red(error instanceof Error ? error.message : String(error)));
			process.exit(1);
		}

		// Write files
		const writeSpinner = ora('Writing files...').start();

		try {
			const targetDir = options.path
				? path.resolve(cwd, options.path)
				: resolveAlias(config.aliases.ui, config, cwd);

			for (const [name, files] of componentFiles.entries()) {
				await writeComponentFiles(files, targetDir);
			}

			writeSpinner.succeed(`Wrote files to ${path.relative(cwd, targetDir)}`);
		} catch (error) {
			writeSpinner.fail('Failed to write files');
			console.error(chalk.red(error instanceof Error ? error.message : String(error)));
			process.exit(1);
		}

		// Install npm dependencies
		const allDeps = new Set<{ name: string; version: string }>();
		const allDevDeps = new Set<{ name: string; version: string }>();

		for (const name of componentsToInstall) {
			const meta = getComponent(name);
			if (meta) {
				meta.dependencies.forEach((dep) => allDeps.add(dep));
				meta.devDependencies.forEach((dep) => allDevDeps.add(dep));
			}
		}

		const deps = Array.from(allDeps);
		const devDeps = Array.from(allDevDeps);

		// Check which dependencies are missing
		const missingDeps = await getMissingDependencies(deps, cwd);
		const missingDevDeps = await getMissingDependencies(devDeps, cwd);

		if (missingDeps.length > 0 || missingDevDeps.length > 0) {
			console.log(chalk.bold('\n📦 Installing dependencies:\n'));

			if (missingDeps.length > 0) {
				console.log(chalk.dim('  Dependencies:'));
				missingDeps.forEach((dep) => console.log(`    - ${dep.name}@${dep.version}`));
			}

			if (missingDevDeps.length > 0) {
				console.log(chalk.dim('  Dev Dependencies:'));
				missingDevDeps.forEach((dep) => console.log(`    - ${dep.name}@${dep.version}`));
			}

			console.log('');

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

		// Success
		console.log(chalk.green('\n✓ Components added successfully!\n'));
		console.log(chalk.dim('Import and use in your components:'));
		console.log(chalk.cyan(`  import { ... } from '${config.aliases.ui}'\n`));
	});

