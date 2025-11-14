#!/usr/bin/env node

/**
 * JSR Publishing Script
 *
 * This script publishes Greater Components packages to JSR (JavaScript Registry).
 * It handles building packages, validating configurations, and publishing to JSR.
 *
 * Usage:
 *   pnpm publish:jsr              - Publish all packages
 *   pnpm publish:jsr:dry          - Dry run (no actual publishing)
 *   pnpm publish:jsr:single --package=primitives  - Publish single package
 */

import { spawnSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const packageArg = args.find((arg) => arg.startsWith('--package='));
const singlePackage = packageArg ? packageArg.split('=')[1] : null;

// List of packages to publish
const packages = ['tokens', 'utils', 'primitives', 'icons', 'adapters', 'fediverse', 'testing'];

/**
 * Execute a command and handle errors without invoking a shell
 * @param {string} command
 * @param {string[]} args
 * @param {import('child_process').SpawnSyncOptions & { log?: boolean }} [options]
 */
function run(command, args = [], options = {}) {
	const { log = true, ...spawnOptions } = options;
	const commandLabel = [command, ...args].join(' ').trim();

	if (log) {
		console.log(`\n→ ${commandLabel}`);
	}

	const result = spawnSync(command, args, {
		cwd: spawnOptions.cwd ?? rootDir,
		stdio: spawnOptions.stdio ?? 'inherit',
		...spawnOptions,
	});

	if (result.error) {
		console.error(`✗ Command failed: ${commandLabel}`);
		throw result.error;
	}

	if (result.status !== 0) {
		console.error(`✗ Command failed: ${commandLabel}`);
		throw new Error(`Command exited with status ${result.status}`);
	}

	return result;
}

/**
 * Check if JSR CLI is installed
 */
function checkJsrCli() {
	try {
		run('npx', ['jsr', '--version'], { stdio: 'ignore', log: false });
		console.log('✓ JSR CLI is available');
		return true;
	} catch (error) {
		console.error('✗ JSR CLI not found. Installing...');
		run('npm', ['install', '-g', 'jsr']);
		return true;
	}
}

/**
 * Validate package configuration
 */
function validatePackage(packageName) {
	const packageDir = join(rootDir, 'packages', packageName);
	const jsrConfigPath = join(packageDir, 'jsr.json');
	const packageJsonPath = join(packageDir, 'package.json');

	console.log(`\nValidating ${packageName}...`);

	// Check if jsr.json exists
	if (!existsSync(jsrConfigPath)) {
		console.error(`✗ jsr.json not found for ${packageName}`);
		return false;
	}

	// Check if package.json exists
	if (!existsSync(packageJsonPath)) {
		console.error(`✗ package.json not found for ${packageName}`);
		return false;
	}

	// Read and validate jsr.json
	try {
		const jsrConfig = JSON.parse(readFileSync(jsrConfigPath, 'utf-8'));
		console.log(`  - Package name: ${jsrConfig.name}`);
		console.log(`  - Version: ${jsrConfig.version}`);
		console.log(`  - Exports: ${Object.keys(jsrConfig.exports).length} entry points`);
	} catch (error) {
		console.error(`✗ Invalid jsr.json for ${packageName}:`, error.message);
		return false;
	}

	console.log(`✓ ${packageName} configuration is valid`);
	return true;
}

/**
 * Build a package
 */
function buildPackage(packageName) {
	console.log(`\n📦 Building ${packageName}...`);

	try {
		run('pnpm', ['--filter', `@equaltoai/${packageName}`, 'build']);
		console.log(`✓ ${packageName} built successfully`);
		return true;
	} catch (error) {
		console.error(`✗ Failed to build ${packageName}`);
		return false;
	}
}

/**
 * Publish a package to JSR
 */
function publishPackage(packageName, dryRun = false) {
	const packageDir = join(rootDir, 'packages', packageName);
	console.log(`\n📤 ${dryRun ? 'Dry run' : 'Publishing'} ${packageName} to JSR...`);

	try {
		const args = ['jsr', 'publish'];
		if (dryRun) {
			args.push('--dry-run');
		}
		run('npx', args, { cwd: packageDir });
		console.log(`✓ ${packageName} ${dryRun ? 'validated' : 'published'} successfully`);
		return true;
	} catch (error) {
		console.error(`✗ Failed to publish ${packageName}`);
		return false;
	}
}

/**
 * Main publishing workflow
 */
async function main() {
	console.log('🚀 Greater Components JSR Publishing Script\n');
	console.log('='.repeat(60));

	// Determine which packages to publish
	const packagesToPublish = singlePackage ? [singlePackage] : packages;

	console.log(`\nMode: ${isDryRun ? 'DRY RUN' : 'PUBLISH'}`);
	console.log(`Packages: ${packagesToPublish.join(', ')}\n`);

	// Check JSR CLI
	if (!checkJsrCli()) {
		console.error('✗ JSR CLI check failed');
		process.exit(1);
	}

	// Step 1: Validate all packages
	console.log('\n' + '='.repeat(60));
	console.log('Step 1: Validating packages');
	console.log('='.repeat(60));

	for (const pkg of packagesToPublish) {
		if (!validatePackage(pkg)) {
			console.error(`\n✗ Validation failed for ${pkg}`);
			process.exit(1);
		}
	}

	// Step 2: Build all packages
	console.log('\n' + '='.repeat(60));
	console.log('Step 2: Building packages');
	console.log('='.repeat(60));

	for (const pkg of packagesToPublish) {
		if (!buildPackage(pkg)) {
			console.error(`\n✗ Build failed for ${pkg}`);
			process.exit(1);
		}
	}

	// Step 3: Publish packages
	console.log('\n' + '='.repeat(60));
	console.log(`Step 3: ${isDryRun ? 'Validating' : 'Publishing'} packages`);
	console.log('='.repeat(60));

	const results = {
		success: [],
		failed: [],
	};

	for (const pkg of packagesToPublish) {
		const success = publishPackage(pkg, isDryRun);
		if (success) {
			results.success.push(pkg);
		} else {
			results.failed.push(pkg);
		}
	}

	// Summary
	console.log('\n' + '='.repeat(60));
	console.log('Summary');
	console.log('='.repeat(60));
	console.log(`\n✓ Successful: ${results.success.length}`);
	if (results.success.length > 0) {
		results.success.forEach((pkg) => console.log(`  - ${pkg}`));
	}

	if (results.failed.length > 0) {
		console.log(`\n✗ Failed: ${results.failed.length}`);
		results.failed.forEach((pkg) => console.log(`  - ${pkg}`));
		process.exit(1);
	}

	console.log(`\n🎉 ${isDryRun ? 'Validation' : 'Publishing'} completed successfully!`);

	if (isDryRun) {
		console.log('\n💡 Run without --dry-run to actually publish to JSR');
	} else {
		console.log('\n📚 Packages are now available on JSR:');
		packagesToPublish.forEach((pkg) => {
			console.log(`   https://jsr.io/@equaltoai/${pkg}`);
		});
	}
}

// Run the script
main().catch((error) => {
	console.error('\n✗ Publishing failed:', error);
	process.exit(1);
});
