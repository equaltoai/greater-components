/**
 * List command - List all available components
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { componentRegistry, getComponentsByType } from '../registry/index.js';

export const listCommand = new Command()
	.name('list')
	.description('List all available components')
	.option('-t, --type <type>', 'Filter by type (primitive, compound, pattern, adapter)')
	.action((options) => {
		console.log(chalk.bold('\n📦 Greater Components\n'));

		const types = options.type
			? [options.type as 'primitive' | 'compound' | 'pattern' | 'adapter']
			: (['primitive', 'compound', 'pattern', 'adapter'] as const);

		for (const type of types) {
			const components = getComponentsByType(type);

			if (components.length === 0) continue;

			console.log(chalk.bold.cyan(`\n${type.toUpperCase()}S (${components.length})`));
			console.log(chalk.dim('─'.repeat(60)));

			for (const comp of components) {
				const tags = comp.tags.slice(0, 3).map((t) => chalk.dim(`#${t}`)).join(' ');
				console.log(`\n${chalk.green('●')} ${chalk.bold(comp.name)} ${tags}`);
				console.log(`  ${chalk.dim(comp.description)}`);

				if (comp.registryDependencies.length > 0) {
					console.log(`  ${chalk.dim('Dependencies:')} ${comp.registryDependencies.join(', ')}`);
				}
			}
		}

		console.log(chalk.dim('\n─'.repeat(60)));
		console.log(chalk.dim(`\nTotal: ${Object.keys(componentRegistry).length} components\n`));
		console.log(chalk.dim('Add components with: ') + chalk.cyan('greater add <component>\n'));
	});

