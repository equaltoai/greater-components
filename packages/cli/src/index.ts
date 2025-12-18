#!/usr/bin/env node
/**
 * Greater Components CLI
 * Add ActivityPub components to your project
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { diffCommand } from './commands/diff.js';
import { updateCommand } from './commands/update.js';
import { doctorCommand } from './commands/doctor.js';
import { auditCommand } from './commands/audit.js';
import { cacheCommand } from './commands/cache.js';

console.log('[DEBUG] ENV GREATER_CLI_LOCAL_REPO_ROOT:', process.env['GREATER_CLI_LOCAL_REPO_ROOT']);

const program = new Command()
	.name('greater')
	.description('CLI for adding Greater Components to your project')
	.version('0.1.0');

// Add commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(diffCommand);
program.addCommand(updateCommand);
program.addCommand(doctorCommand);
program.addCommand(auditCommand);
program.addCommand(cacheCommand);

// Error handling
program.exitOverride();

try {
	await program.parseAsync(process.argv);
} catch (error) {
	if (error instanceof Error && error.name !== 'CommanderError') {
		console.error(chalk.red('\n✖ Error:'), error.message);
		process.exit(1);
	}
}
