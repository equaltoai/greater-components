/**
 * Doctor command - Diagnose common issues with Greater Components setup
 * Checks version compatibility, missing dependencies, and configuration problems
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';
import {
	readConfig,
	configExists,
	getInstalledComponentNames,
	resolveAlias,
	type ComponentConfig,
} from '../utils/config.js';
import {
	isValidProject,
	detectProjectDetails,
	validateSvelteVersion,
	fileExists,
} from '../utils/files.js';
import { detectPackageManager, isDependencyInstalled } from '../utils/packages.js';
import { computeChecksum } from '../utils/integrity.js';
import { getAllComponentNames, getComponent } from '../registry/index.js';
import { logger } from '../utils/logger.js';
import { getInstalledFilePath } from '../utils/install-path.js';

/**
 * Severity levels for diagnostic checks
 */
export type Severity = 'error' | 'warning' | 'info';

/**
 * Result of a single diagnostic check
 */
export interface DiagnosticResult {
	name: string;
	passed: boolean;
	severity: Severity;
	message: string;
	details?: string;
	fix?: string;
	autoFixable?: boolean;
}

/**
 * Overall diagnostic summary
 */
export interface DiagnosticSummary {
	totalChecks: number;
	passed: number;
	failed: number;
	warnings: number;
	errors: number;
	results: DiagnosticResult[];
}

/**
 * Required Node.js version (per official documentation: Node.js >= 20.0.0)
 * @see https://greater.fediverse.dev/getting-started
 */
const REQUIRED_NODE_VERSION = 20;

/**
 * Required Svelte version (per official documentation: Svelte >= 5.0.0)
 * @see https://greater.fediverse.dev/getting-started
 */
const REQUIRED_SVELTE_VERSION = 5;

/**
 * Format a check result with appropriate icon and color
 */
export function formatResult(result: DiagnosticResult): string {
	const icon = result.passed
		? chalk.green('✓')
		: result.severity === 'error'
			? chalk.red('✖')
			: chalk.yellow('⚠');

	const color = result.passed
		? chalk.green
		: result.severity === 'error'
			? chalk.red
			: chalk.yellow;

	let output = `${icon} ${color(result.name)}: ${result.message}`;

	if (result.details) {
		output += `\n   ${chalk.dim(result.details)}`;
	}

	if (!result.passed && result.fix) {
		output += `\n   ${chalk.cyan('Fix:')} ${result.fix}`;
	}

	return output;
}

/**
 * Check if Node.js version meets requirements
 * Per official documentation: Node.js >= 20.0.0 required
 */
export function checkNodeVersion(): DiagnosticResult {
	const nodeVersion = process.versions.node;
	const majorVersion = parseInt(nodeVersion.split('.')[0] ?? '0', 10);
	const passed = majorVersion >= REQUIRED_NODE_VERSION;

	return {
		name: 'Node.js Version',
		passed,
		severity: 'error',
		message: passed
			? `v${nodeVersion} (meets requirement ≥${REQUIRED_NODE_VERSION})`
			: `v${nodeVersion} (requires ≥${REQUIRED_NODE_VERSION})`,
		fix: passed ? undefined : `Upgrade Node.js to version ${REQUIRED_NODE_VERSION} or higher`,
		autoFixable: false,
	};
}

/**
 * Check if Svelte version meets requirements
 * Per official documentation: Svelte >= 5.0.0 required
 */
export async function checkSvelteVersion(cwd: string): Promise<DiagnosticResult> {
	const validation = await validateSvelteVersion(cwd);

	if (!validation.version) {
		return {
			name: 'Svelte Version',
			passed: false,
			severity: 'error',
			message: 'Svelte not installed',
			fix: 'pnpm add svelte@^5.0.0',
			autoFixable: true,
		};
	}

	return {
		name: 'Svelte Version',
		passed: validation.valid,
		severity: 'error',
		message: validation.valid
			? `v${validation.version.raw} (meets requirement ≥${REQUIRED_SVELTE_VERSION})`
			: `v${validation.version.raw} (requires ≥${REQUIRED_SVELTE_VERSION})`,
		fix: validation.valid ? undefined : 'pnpm add svelte@^5.0.0',
		autoFixable: true,
	};
}

/**
 * Check if components.json exists and is valid
 */
export async function checkConfigFile(cwd: string): Promise<DiagnosticResult> {
	const exists = await configExists(cwd);

	if (!exists) {
		return {
			name: 'Configuration File',
			passed: false,
			severity: 'error',
			message: 'components.json not found',
			details: 'Greater Components has not been initialized in this project',
			fix: 'greater init',
			autoFixable: true,
		};
	}

	try {
		const config = await readConfig(cwd);
		if (!config) {
			return {
				name: 'Configuration File',
				passed: false,
				severity: 'error',
				message: 'components.json is invalid or corrupted',
				fix: 'Delete components.json and run: greater init',
				autoFixable: false,
			};
		}

		// Check for required fields
		const missingFields: string[] = [];
		if (!config.aliases) missingFields.push('aliases');
		if (!config.style) missingFields.push('style');

		if (missingFields.length > 0) {
			return {
				name: 'Configuration File',
				passed: false,
				severity: 'warning',
				message: `components.json missing fields: ${missingFields.join(', ')}`,
				fix: 'Run: greater init --force',
				autoFixable: false,
			};
		}

		return {
			name: 'Configuration File',
			passed: true,
			severity: 'info',
			message: 'components.json is valid',
			details: `Style: ${config.style}, Version: ${config.version || 'not set'}`,
		};
	} catch (error) {
		return {
			name: 'Configuration File',
			passed: false,
			severity: 'error',
			message: `Failed to parse components.json: ${error instanceof Error ? error.message : String(error)}`,
			fix: 'Check JSON syntax or delete and reinitialize',
			autoFixable: false,
		};
	}
}

/**
 * Check if alias paths exist in the filesystem
 */
export async function checkAliasPaths(
	cwd: string,
	config: ComponentConfig
): Promise<DiagnosticResult[]> {
	const results: DiagnosticResult[] = [];
	const aliases = config.aliases;

	for (const [aliasName, aliasPath] of Object.entries(aliases)) {
		const resolvedPath = resolveAlias(aliasPath, config, cwd);
		const exists = await fs.pathExists(resolvedPath);

		results.push({
			name: `Alias Path: ${aliasName}`,
			passed: exists,
			severity: 'warning',
			message: exists
				? `${aliasPath} → ${path.relative(cwd, resolvedPath)}`
				: `${aliasPath} does not exist`,
			details: exists ? undefined : `Expected at: ${resolvedPath}`,
			fix: exists ? undefined : `mkdir -p "${resolvedPath}"`,
			autoFixable: true,
		});
	}

	return results;
}

/**
 * Check for missing npm dependencies required by installed components
 */
export async function checkNpmDependencies(
	cwd: string,
	config: ComponentConfig
): Promise<DiagnosticResult[]> {
	const results: DiagnosticResult[] = [];
	const installedComponents = getInstalledComponentNames(config);
	const missingDeps: Set<string> = new Set();
	const pm = await detectPackageManager(cwd);

	for (const componentName of installedComponents) {
		const component = getComponent(componentName);
		if (!component) continue;

		for (const dep of component.dependencies) {
			if (!(await isDependencyInstalled(dep.name, cwd))) {
				missingDeps.add(`${dep.name}@${dep.version}`);
			}
		}
	}

	if (missingDeps.size > 0) {
		const depList = Array.from(missingDeps);
		results.push({
			name: 'NPM Dependencies',
			passed: false,
			severity: 'error',
			message: `${missingDeps.size} missing dependencies`,
			details:
				depList.slice(0, 5).join(', ') +
				(depList.length > 5 ? ` (+${depList.length - 5} more)` : ''),
			fix: `${pm} add ${depList.join(' ')}`,
			autoFixable: true,
		});
	} else {
		results.push({
			name: 'NPM Dependencies',
			passed: true,
			severity: 'info',
			message: 'All required dependencies are installed',
		});
	}

	return results;
}

/**
 * Check installed component files exist and verify checksums
 */
export async function checkInstalledComponents(
	cwd: string,
	config: ComponentConfig
): Promise<DiagnosticResult[]> {
	const results: DiagnosticResult[] = [];
	const installedComponents = config.installed || [];

	if (installedComponents.length === 0) {
		results.push({
			name: 'Installed Components',
			passed: true,
			severity: 'info',
			message: 'No components installed yet',
			details: 'Run: greater add <component> to install components',
		});
		return results;
	}

	let missingFiles = 0;
	let modifiedFiles = 0;
	let validFiles = 0;
	const orphanedComponents: string[] = [];
	const modifiedComponents: string[] = [];

	for (const installed of installedComponents) {
		const component = getComponent(installed.name);

		if (!component) {
			orphanedComponents.push(installed.name);
			continue;
		}

		for (const file of component.files) {
			const localPath = getInstalledFilePath(file.path, config, cwd);
			const exists = await fileExists(localPath);

			if (!exists) {
				missingFiles++;
				continue;
			}

			// Check checksum if available
			const checksumEntry = installed.checksums?.find((c) => c.path === file.path);
			if (checksumEntry) {
				try {
					const content = await fs.readFile(localPath);
					const currentChecksum = computeChecksum(content);

					if (currentChecksum !== checksumEntry.checksum) {
						modifiedFiles++;
						if (!modifiedComponents.includes(installed.name)) {
							modifiedComponents.push(installed.name);
						}
					} else {
						validFiles++;
					}
				} catch {
					missingFiles++;
				}
			} else {
				validFiles++;
			}
		}
	}

	// Report missing files
	if (missingFiles > 0) {
		results.push({
			name: 'Component Files',
			passed: false,
			severity: 'error',
			message: `${missingFiles} component file(s) missing`,
			fix: 'Run: greater add <component> --force to reinstall',
			autoFixable: false,
		});
	}

	// Report modified files
	if (modifiedFiles > 0) {
		results.push({
			name: 'Local Modifications',
			passed: true,
			severity: 'warning',
			message: `${modifiedFiles} file(s) have local modifications`,
			details: `Components: ${modifiedComponents.join(', ')}`,
		});
	}

	// Report orphaned components (in config but not in registry)
	if (orphanedComponents.length > 0) {
		results.push({
			name: 'Orphaned Components',
			passed: false,
			severity: 'warning',
			message: `${orphanedComponents.length} component(s) not found in registry`,
			details: orphanedComponents.join(', '),
			fix: 'Remove from components.json or check component names',
			autoFixable: false,
		});
	}

	// Report valid state
	if (missingFiles === 0 && orphanedComponents.length === 0) {
		results.push({
			name: 'Component Files',
			passed: true,
			severity: 'info',
			message: `${validFiles} file(s) verified`,
		});
	}

	return results;
}

/**
 * Check for orphaned files (in filesystem but not in config)
 */
export async function checkOrphanedFiles(
	cwd: string,
	config: ComponentConfig
): Promise<DiagnosticResult> {
	const installedNames = new Set(getInstalledComponentNames(config));
	const expectedFiles = new Set<string>();

	for (const installed of config.installed ?? []) {
		const component = getComponent(installed.name);
		if (!component) continue;

		for (const file of component.files) {
			expectedFiles.add(getInstalledFilePath(file.path, config, cwd));
		}
	}

	const orphanedComponents = new Set<string>();

	// Iterate over all known components in the registry by checking filesystem presence for their expected files.
	// This avoids assuming a particular on-disk folder layout (shadcn-style) and works for `lib/*` + `shared/*`.
	for (const componentName of getAllComponentNames()) {
		if (installedNames.has(componentName)) continue;

		const component = getComponent(componentName);
		if (!component) continue;

		for (const file of component.files) {
			const localPath = getInstalledFilePath(file.path, config, cwd);
			if (expectedFiles.has(localPath)) continue;
			if (await fs.pathExists(localPath)) {
				orphanedComponents.add(componentName);
				break;
			}
		}
	}

	if (orphanedComponents.size > 0) {
		const list = Array.from(orphanedComponents).sort();
		return {
			name: 'Orphaned Files',
			passed: false,
			severity: 'warning',
			message: `${list.length} component(s) have files on disk but are not tracked in components.json`,
			details: list.join(', '),
			fix: 'Add to config with: greater add <component> or remove manually',
			autoFixable: false,
		};
	}

	return {
		name: 'Orphaned Files',
		passed: true,
		severity: 'info',
		message: 'No orphaned component files detected',
	};
}

/**
 * Check Lesser version compatibility if configured
 */
export async function checkLesserVersion(
	config: ComponentConfig
): Promise<DiagnosticResult | null> {
	if (!config.lesserVersion) {
		return null;
	}

	// Parse Lesser version requirement
	const lesserVersion = config.lesserVersion;

	return {
		name: 'Lesser Version',
		passed: true,
		severity: 'info',
		message: `Configured for Lesser ${lesserVersion}`,
		details: 'Ensure your Lesser instance matches this version',
	};
}

/**
 * Check project structure
 */
export async function checkProjectStructure(cwd: string): Promise<DiagnosticResult> {
	const details = await detectProjectDetails(cwd);

	if (details.type === 'unknown') {
		return {
			name: 'Project Structure',
			passed: false,
			severity: 'warning',
			message: 'Could not detect project type',
			details: 'Expected SvelteKit, Vite+Svelte, or Svelte project',
			fix: 'Ensure package.json has svelte as a dependency',
			autoFixable: false,
		};
	}

	const typeLabels: Record<string, string> = {
		sveltekit: 'SvelteKit',
		'vite-svelte': 'Vite + Svelte',
		svelte: 'Svelte',
	};

	return {
		name: 'Project Structure',
		passed: true,
		severity: 'info',
		message: `${typeLabels[details.type]} project detected`,
		details: `TypeScript: ${details.hasTypeScript ? 'Yes' : 'No'}`,
	};
}

/**
 * Display diagnostic summary
 */
export function displaySummary(summary: DiagnosticSummary): void {
	logger.newline();
	logger.info(chalk.bold('─'.repeat(50)));
	logger.info(chalk.bold('Summary'));
	logger.info(chalk.bold('─'.repeat(50)));

	const passedText = chalk.green(`${summary.passed} passed`);
	const failedText =
		summary.errors > 0 ? chalk.red(`${summary.errors} errors`) : chalk.dim('0 errors');
	const warningsText =
		summary.warnings > 0 ? chalk.yellow(`${summary.warnings} warnings`) : chalk.dim('0 warnings');

	logger.info(
		`Total: ${summary.totalChecks} checks | ${passedText} | ${failedText} | ${warningsText}`
	);
	logger.newline();

	if (summary.errors > 0) {
		logger.error(chalk.red('✖ Some checks failed. Please fix the errors above.'));
	} else if (summary.warnings > 0) {
		logger.warn(chalk.yellow('⚠ All checks passed with warnings.'));
	} else {
		logger.success(chalk.green('✓ All checks passed! Your project is healthy.'));
	}
}

/**
 * Run auto-fix for fixable issues
 */
export async function runAutoFix(
	results: DiagnosticResult[],
	_cwd: string
): Promise<{ fixed: number; failed: number }> {
	const fixable = results.filter((r) => !r.passed && r.autoFixable && r.fix);
	let fixed = 0;
	let failed = 0;

	for (const result of fixable) {
		const spinner = ora(`Fixing: ${result.name}`).start();

		try {
			// Handle specific fixes
			if (result.name === 'Configuration File' && result.fix === 'greater init') {
				// Cannot auto-run init as it requires prompts
				spinner.warn('Run manually: greater init');
				continue;
			}

			if (result.name.startsWith('Alias Path:') && result.fix?.startsWith('mkdir')) {
				const pathMatch = result.fix.match(/mkdir -p "(.+)"/);
				if (pathMatch) {
					await fs.ensureDir(pathMatch[1] ?? '');
					spinner.succeed(`Created directory: ${pathMatch[1]}`);
					fixed++;
					continue;
				}
			}

			// For npm install commands, just show the command
			if (result.fix?.includes('pnpm add') || result.fix?.includes('npm install')) {
				spinner.info(`Run manually: ${result.fix}`);
				continue;
			}

			spinner.warn(`Manual fix required: ${result.fix}`);
		} catch (error) {
			spinner.fail(`Failed to fix: ${error instanceof Error ? error.message : String(error)}`);
			failed++;
		}
	}

	return { fixed, failed };
}

export const doctorAction = async (options: { cwd?: string; fix?: boolean; json?: boolean }) => {
	const cwd = path.resolve(options.cwd || process.cwd());

	if (!options.json) {
		logger.info(chalk.bold('\n🩺 Greater Components Doctor\n'));
	}

	// Check if valid project first
	if (!(await isValidProject(cwd))) {
		if (options.json) {
			logger.info(
				JSON.stringify(
					{
						error: 'Not a valid project',
						message: 'No package.json found in the current directory',
					},
					null,
					2
				)
			);
		} else {
			logger.error(chalk.red('✖ Not a valid project'));
			logger.note(chalk.dim('  No package.json found. Run this command in a project root.\n'));
		}
		process.exit(1);
	}
	const results: DiagnosticResult[] = [];

	// Run all diagnostic checks
	const spinner = ora('Running diagnostics...').start();

	// 1. Check Node.js version
	results.push(checkNodeVersion());

	// 2. Check Svelte version
	results.push(await checkSvelteVersion(cwd));

	// 3. Check project structure
	results.push(await checkProjectStructure(cwd));

	// 4. Check configuration file
	const configResult = await checkConfigFile(cwd);
	results.push(configResult);

	// Only continue with config-dependent checks if config exists and is valid
	let config: ComponentConfig | null = null;
	if (configResult.passed) {
		config = await readConfig(cwd);
	}

	if (config) {
		// 5. Check alias paths
		const aliasResults = await checkAliasPaths(cwd, config);
		results.push(...aliasResults);

		// 6. Check npm dependencies
		const depResults = await checkNpmDependencies(cwd, config);
		results.push(...depResults);

		// 7. Check installed components
		const componentResults = await checkInstalledComponents(cwd, config);
		results.push(...componentResults);

		// 8. Check orphaned files
		results.push(await checkOrphanedFiles(cwd, config));

		// 9. Check Lesser version if configured
		const lesserResult = await checkLesserVersion(config);
		if (lesserResult) {
			results.push(lesserResult);
		}
	}

	spinner.stop();

	// Calculate summary
	const summary: DiagnosticSummary = {
		totalChecks: results.length,
		passed: results.filter((r) => r.passed).length,
		failed: results.filter((r) => !r.passed).length,
		warnings: results.filter((r) => !r.passed && r.severity === 'warning').length,
		errors: results.filter((r) => !r.passed && r.severity === 'error').length,
		results,
	};

	// Output results
	if (options.json) {
		logger.info(JSON.stringify(summary, null, 2));
	} else {
		// Display each result
		for (const result of results) {
			logger.info(formatResult(result));
		}

		// Display summary
		displaySummary(summary);

		// Run auto-fix if requested
		if (options.fix) {
			const fixableCount = results.filter((r) => !r.passed && r.autoFixable).length;

			if (fixableCount > 0) {
				logger.newline();
				logger.info(chalk.bold('🔧 Running auto-fix...\n'));

				const { fixed, failed } = await runAutoFix(results, cwd);

				logger.newline();
				if (fixed > 0) {
					logger.success(chalk.green(`✓ Fixed ${fixed} issue(s)`));
				}
				if (failed > 0) {
					logger.error(chalk.red(`✖ Failed to fix ${failed} issue(s)`));
				}
			} else {
				logger.info(chalk.dim('\nNo auto-fixable issues found.'));
			}
		} else if (summary.errors > 0 || summary.warnings > 0) {
			const fixableCount = results.filter((r) => !r.passed && r.autoFixable).length;
			if (fixableCount > 0) {
				logger.newline();
				logger.info(
					chalk.dim(
						`Tip: Run ${chalk.cyan('greater doctor --fix')} to auto-fix ${fixableCount} issue(s)`
					)
				);
			}
		}
	}

	// Exit with error code if there are errors
	process.exit(summary.errors > 0 ? 1 : 0);
};

export const doctorCommand = new Command()
	.name('doctor')
	.description('Diagnose common issues with Greater Components setup')
	.option('--cwd <path>', 'Working directory (default: current directory)')
	.option('--fix', 'Attempt to auto-fix simple issues')
	.option('--json', 'Output results as JSON')
	.action(doctorAction);
