#!/usr/bin/env node
/**
 * Registry Index Validation Script
 *
 * Validates the registry-index.json file:
 * - Schema validation
 * - Checksum verification against actual files
 * - File existence checks
 *
 * Usage:
 *   node scripts/validate-registry-index.js [options]
 *
 * Options:
 *   --strict      Fail on any warning
 *   --verbose     Show detailed output
 *   --fix         Regenerate checksums for mismatched files
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const REGISTRY_PATH = path.join(rootDir, 'registry', 'index.json');
const SCHEMA_PATH = path.join(rootDir, 'schemas', 'registry-index.schema.json');

// Colors for terminal output
const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

/**
 * Compute SHA-256 checksum in SRI format
 */
function computeChecksum(content) {
	const hash = createHash('sha256');
	hash.update(content);
	return `sha256-${hash.digest('base64')}`;
}

/**
 * Validate schema structure
 */
function validateSchema(index) {
	const errors = [];
	const warnings = [];

	// Required top-level fields
	const requiredFields = [
		'schemaVersion',
		'generatedAt',
		'ref',
		'version',
		'checksums',
		'components',
		'faces',
		'shared',
	];
	for (const field of requiredFields) {
		if (!(field in index)) {
			errors.push(`Missing required field: ${field}`);
		}
	}

	// Validate schemaVersion
	if (index.schemaVersion && index.schemaVersion !== '1.0.0') {
		warnings.push(`Unexpected schemaVersion: ${index.schemaVersion}`);
	}

	// Validate generatedAt is valid ISO timestamp
	if (index.generatedAt) {
		const date = new Date(index.generatedAt);
		if (isNaN(date.getTime())) {
			errors.push(`Invalid generatedAt timestamp: ${index.generatedAt}`);
		}
	}

	// Validate version format
	if (index.version && !/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(index.version)) {
		warnings.push(`Version does not follow semver: ${index.version}`);
	}

	return { errors, warnings };
}

/**
 * Validate checksums against actual files
 */
function validateChecksums(checksums, verbose) {
	const errors = [];
	const warnings = [];
	const mismatches = [];

	let checked = 0;
	let missing = 0;
	let mismatch = 0;

	for (const [filePath, expectedChecksum] of Object.entries(checksums)) {
		const fullPath = path.join(rootDir, filePath);

		if (!fs.existsSync(fullPath)) {
			missing++;
			warnings.push(`File not found: ${filePath}`);
			continue;
		}

		const content = fs.readFileSync(fullPath);
		const actualChecksum = computeChecksum(content);

		if (actualChecksum !== expectedChecksum) {
			mismatch++;
			errors.push(`Checksum mismatch for ${filePath}`);
			mismatches.push({
				path: filePath,
				expected: expectedChecksum,
				actual: actualChecksum,
			});

			if (verbose) {
				log(`    Expected: ${expectedChecksum}`, colors.yellow);
				log(`    Actual:   ${actualChecksum}`, colors.yellow);
			}
		} else {
			checked++;
			if (verbose) {
				log(`  ✓ ${filePath}`, colors.green);
			}
		}
	}

	return { errors, warnings, mismatches, stats: { checked, missing, mismatch } };
}

/**
 * Validate component metadata
 */
function validateComponents(components) {
	const errors = [];
	const warnings = [];

	for (const [name, component] of Object.entries(components)) {
		if (!component.name) {
			errors.push(`Component ${name} missing name field`);
		}
		if (!component.version) {
			warnings.push(`Component ${name} missing version field`);
		}
		if (!component.files || !Array.isArray(component.files)) {
			errors.push(`Component ${name} missing or invalid files array`);
		}
	}

	return { errors, warnings };
}

/**
 * Main validation function
 */
async function main() {
	const args = process.argv.slice(2);
	const strict = args.includes('--strict');
	const verbose = args.includes('--verbose');
	const fix = args.includes('--fix');

	log('\n' + '='.repeat(60), colors.bold);
	log('🔍 Registry Index Validation', colors.bold);
	log('='.repeat(60) + '\n');

	// Check registry file exists
	if (!fs.existsSync(REGISTRY_PATH)) {
		log(`❌ Registry index not found: ${REGISTRY_PATH}`, colors.red);
		log('\nRun `pnpm generate-registry` to create it.', colors.yellow);
		process.exit(1);
	}

	// Load registry index
	let index;
	try {
		index = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
	} catch (error) {
		log(`❌ Failed to parse registry index: ${error.message}`, colors.red);
		process.exit(1);
	}

	log(`📋 Registry version: ${index.version}`, colors.cyan);
	log(`🏷️  Git ref: ${index.ref}`, colors.cyan);
	log(`📅 Generated: ${index.generatedAt}\n`, colors.cyan);

	const allErrors = [];
	const allWarnings = [];

	// Validate schema
	log('📐 Validating schema...', colors.blue);
	const schemaResult = validateSchema(index);
	allErrors.push(...schemaResult.errors);
	allWarnings.push(...schemaResult.warnings);

	if (schemaResult.errors.length === 0) {
		log('  ✅ Schema valid', colors.green);
	} else {
		log('  ❌ Schema validation failed', colors.red);
	}

	// Validate checksums
	log('\n🔐 Validating checksums...', colors.blue);
	const checksumResult = validateChecksums(index.checksums || {}, verbose);
	allErrors.push(...checksumResult.errors);
	allWarnings.push(...checksumResult.warnings);

	log(`  • Verified: ${checksumResult.stats.checked}`, colors.green);
	if (checksumResult.stats.missing > 0) {
		log(`  • Missing: ${checksumResult.stats.missing}`, colors.yellow);
	}
	if (checksumResult.stats.mismatch > 0) {
		log(`  • Mismatched: ${checksumResult.stats.mismatch}`, colors.red);
	}

	// Validate components
	log('\n📦 Validating components...', colors.blue);
	const componentResult = validateComponents(index.components || {});
	allErrors.push(...componentResult.errors);
	allWarnings.push(...componentResult.warnings);

	log(`  • Components: ${Object.keys(index.components || {}).length}`);
	log(`  • Faces: ${Object.keys(index.faces || {}).length}`);
	log(`  • Shared: ${Object.keys(index.shared || {}).length}`);

	// Summary
	log('\n' + '='.repeat(60));
	log('📊 Validation Summary:', colors.bold);

	if (allErrors.length > 0) {
		log(`\n❌ Errors (${allErrors.length}):`, colors.red);
		allErrors.forEach((err) => log(`  • ${err}`, colors.red));
	}

	if (allWarnings.length > 0) {
		log(`\n⚠️  Warnings (${allWarnings.length}):`, colors.yellow);
		allWarnings.forEach((warn) => log(`  • ${warn}`, colors.yellow));
	}

	log('='.repeat(60) + '\n');

	// Exit code
	if (allErrors.length > 0) {
		log('❌ Validation FAILED', colors.red);
		process.exit(1);
	} else if (strict && allWarnings.length > 0) {
		log('❌ Validation FAILED (strict mode)', colors.red);
		process.exit(1);
	} else {
		log('✅ Validation PASSED', colors.green);
		process.exit(0);
	}
}

main().catch((error) => {
	log(`\n❌ Error: ${error.message}`, colors.red);
	console.error(error);
	process.exit(1);
});
