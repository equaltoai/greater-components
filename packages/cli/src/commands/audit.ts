/**
 * Audit command - View and manage the security audit log
 * Shows component installation history, verification status, and security warnings
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
	readAuditLog,
	clearAuditLog,
	getAuditLogPath,
	type AuditLogEntry,
	type AuditAction,
} from '../utils/security.js';
import { logger } from '../utils/logger.js';
import fs from 'fs-extra';

/**
 * Format a timestamp for display
 */
function formatTimestamp(isoString: string): string {
	const date = new Date(isoString);
	return date.toLocaleString();
}

/**
 * Format an audit entry for display
 */
function formatEntry(entry: AuditLogEntry, verbose: boolean): string {
	const lines: string[] = [];

	// Header with timestamp and action
	const actionColors: Record<AuditAction, (text: string) => string> = {
		install: chalk.green,
		update: chalk.blue,
		remove: chalk.red,
		verify: chalk.cyan,
		fetch: chalk.gray,
		config_change: chalk.yellow,
		security_warning: chalk.red,
	};

	const actionIcons: Record<AuditAction, string> = {
		install: '📦',
		update: '🔄',
		remove: '🗑️',
		verify: '✓',
		fetch: '⬇️',
		config_change: '⚙️',
		security_warning: '⚠️',
	};

	const colorFn = actionColors[entry.action] || chalk.white;
	const icon = actionIcons[entry.action] || '•';

	lines.push(
		`${icon} ${colorFn(entry.action.toUpperCase())} ${chalk.dim(formatTimestamp(entry.timestamp))}`
	);

	// Component and ref
	if (entry.component) {
		lines.push(`   Component: ${chalk.cyan(entry.component)}`);
	}

	if (entry.ref) {
		lines.push(`   Ref: ${chalk.yellow(entry.ref)}`);
	}

	// Verification status
	if (entry.verified !== undefined) {
		const verifiedIcon = entry.verified ? chalk.green('✓') : chalk.red('✖');
		const verifiedText = entry.verified ? 'Verified' : 'Not Verified';
		lines.push(`   Integrity: ${verifiedIcon} ${verifiedText}`);
	}

	if (entry.signatureStatus) {
		const sigIcon = entry.signatureStatus === 'valid' ? chalk.green('✓') : chalk.yellow('⚠');
		lines.push(`   Signature: ${sigIcon} ${entry.signatureStatus}`);
	}

	// Warnings
	if (entry.warnings && entry.warnings.length > 0) {
		lines.push(`   Warnings:`);
		for (const warning of entry.warnings) {
			lines.push(`     ${chalk.yellow('⚠')} ${warning}`);
		}
	}

	// Verbose details
	if (verbose) {
		if (entry.checksums && Object.keys(entry.checksums).length > 0) {
			lines.push(`   Checksums:`);
			for (const [filePath, checksum] of Object.entries(entry.checksums)) {
				lines.push(`     ${chalk.dim(filePath)}: ${chalk.dim(checksum.slice(0, 20))}...`);
			}
		}

		if (entry.details) {
			lines.push(`   Details: ${chalk.dim(JSON.stringify(entry.details))}`);
		}

		if (entry.errorMessage) {
			lines.push(`   Error: ${chalk.red(entry.errorMessage)}`);
		}
	}

	// Success/failure indicator
	if (!entry.success) {
		lines.push(`   ${chalk.red('✖ Failed')}`);
	}

	return lines.join('\n');
}

/**
 * Format entries as JSON
 */
function formatAsJson(entries: AuditLogEntry[]): string {
	return JSON.stringify(entries, null, 2);
}

export const auditCommand = new Command()
	.name('audit')
	.description('View and manage the security audit log')
	.option('-n, --limit <number>', 'Maximum number of entries to show', '20')
	.option('-a, --action <type>', 'Filter by action type (install, update, verify, etc.)')
	.option('-c, --component <name>', 'Filter by component name')
	.option('--since <date>', 'Show entries since date (ISO format or relative like "7d")')
	.option('--json', 'Output as JSON')
	.option('-v, --verbose', 'Show detailed information including checksums')
	.option('--clear', 'Clear the audit log')
	.option('--path', 'Show the audit log file path')
	.action(async (options) => {
		// Show path
		if (options.path) {
			const logPath = getAuditLogPath();
			logger.info(`Audit log path: ${logPath}`);

			if (await fs.pathExists(logPath)) {
				const stats = await fs.stat(logPath);
				logger.info(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
			} else {
				logger.info('(Log file does not exist yet)');
			}
			return;
		}

		// Clear log
		if (options.clear) {
			await clearAuditLog();
			logger.success(chalk.green('✓ Audit log cleared'));
			return;
		}

		// Parse options
		const limit = parseInt(options.limit, 10) || 20;
		const action = options.action as AuditAction | undefined;

		let since: Date | undefined;
		if (options.since) {
			// Support relative dates like "7d", "24h", "1w"
			const relativeMatch = options.since.match(/^(\d+)([dhwm])$/);
			if (relativeMatch) {
				const value = parseInt(relativeMatch[1], 10);
				const unit = relativeMatch[2];
				const now = Date.now();
				const msPerUnit: Record<string, number> = {
					h: 60 * 60 * 1000,
					d: 24 * 60 * 60 * 1000,
					w: 7 * 24 * 60 * 60 * 1000,
					m: 30 * 24 * 60 * 60 * 1000,
				};
				since = new Date(now - value * (msPerUnit[unit] ?? 0));
			} else {
				since = new Date(options.since);
				if (isNaN(since.getTime())) {
					logger.error(
						chalk.red('Invalid date format. Use ISO format or relative (e.g., "7d", "24h")')
					);
					process.exit(1);
				}
			}
		}

		// Read entries
		const entries = await readAuditLog({
			limit,
			action,
			component: options.component,
			since,
		});

		if (entries.length === 0) {
			logger.info(chalk.dim('No audit log entries found'));
			return;
		}

		// Output
		if (options.json) {
			logger.info(formatAsJson(entries));
		} else {
			logger.info(chalk.bold(`\n📋 Audit Log (${entries.length} entries)\n`));

			for (const entry of entries) {
				logger.info(formatEntry(entry, options.verbose));
				logger.info('');
			}

			// Summary
			const installs = entries.filter((e) => e.action === 'install').length;
			const warnings = entries.filter((e) => e.action === 'security_warning').length;
			const verified = entries.filter((e) => e.verified === true).length;

			logger.info(chalk.dim('─'.repeat(50)));
			logger.info(
				`${chalk.green(installs)} installs, ` +
					`${chalk.cyan(verified)} verified, ` +
					`${chalk.yellow(warnings)} warnings`
			);
		}
	});
