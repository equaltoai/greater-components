/**
 * List command - List all available components
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { componentRegistry, getComponentsByType } from '../registry/index.js';
import { logger } from '../utils/logger.js';

export const listCommand = new Command()
	.name('list')
	.description('List all available components')
	.option('-t, --type <type>', 'Filter by type (primitive, compound, pattern, adapter)')
	.action((options) => {
		logger.info(chalk.bold('\n📦 Greater Components\n'));

		const types = options.type
			? [options.type as 'primitive' | 'compound' | 'pattern' | 'adapter']
			: (['primitive', 'compound', 'pattern', 'adapter'] as const);

		for (const type of types) {
			const components = getComponentsByType(type);

			if (components.length === 0) continue;

			logger.info(chalk.bold.cyan(`\n${type.toUpperCase()}S (${components.length})`));
			logger.note(chalk.dim('─'.repeat(60)));

			for (const comp of components) {
				const tags = comp.tags
					.slice(0, 3)
					.map((t) => chalk.dim(`#${t}`))
					.join(' ');
				logger.info(`\n${chalk.green('●')} ${chalk.bold(comp.name)} ${tags}`);
				logger.note(`  ${chalk.dim(comp.description)}`);

				if (comp.registryDependencies.length > 0) {
					logger.note(`  ${chalk.dim('Dependencies:')} ${comp.registryDependencies.join(', ')}`);
				}
			}
		}

		logger.note(chalk.dim('\n─'.repeat(60)));
		logger.note(chalk.dim(`\nTotal: ${Object.keys(componentRegistry).length} components\n`));
		logger.note(chalk.dim('Add components with: ') + chalk.cyan('greater add <component>\n'));
	});
