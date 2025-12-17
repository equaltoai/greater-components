#!/usr/bin/env node
/**
 * Audit CLI Registry Script
 *
 * Validates that CLI registry paths resolve to real source files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const registryPath = path.join(rootDir, 'registry', 'index.json');

const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('📚 Audit CLI Registry', colors.bold);
	log('='.repeat(60) + '\n');

	if (!fs.existsSync(registryPath)) {
		log(`❌ Registry index not found: ${registryPath}`, colors.red);
		log('   Please run `pnpm generate-registry` first.', colors.yellow);
		process.exit(1);
	}

	let registry;
	try {
		registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
	} catch (e) {
		log(`❌ Failed to parse registry index: ${e.message}`, colors.red);
		process.exit(1);
	}

	const errors = [];
	let checkedCount = 0;

	const sectionBaseDirs = {
		components: (key) => path.join(rootDir, 'packages', key),
		faces: (key) => path.join(rootDir, 'packages', 'faces', key),
		shared: (key) => path.join(rootDir, 'packages', 'shared', key),
	};

	const checkSection = (sectionName, items, getBaseDir) => {
		if (!items) return;

		for (const [key, item] of Object.entries(items)) {
			if (!item?.files || !Array.isArray(item.files)) continue;

			const baseDir = getBaseDir(key);

			for (const file of item.files) {
				const filePath = typeof file === 'string' ? file : file.path;
				if (!filePath) continue;

				const fullPath = path.join(baseDir, filePath);
				if (!fs.existsSync(fullPath)) {
					errors.push(
						`[${sectionName}] ${key}: File not found: ${path.relative(rootDir, fullPath)}`
					);
				}
				checkedCount++;
			}
		}
	};

	checkSection('components', registry.components, sectionBaseDirs.components);
	checkSection('faces', registry.faces, sectionBaseDirs.faces);
	checkSection('shared', registry.shared, sectionBaseDirs.shared);

	// Also check checksums keys as they are direct file paths
	if (registry.checksums) {
		for (const filePath of Object.keys(registry.checksums)) {
			const fullPath = path.join(rootDir, filePath);
			if (!fs.existsSync(fullPath)) {
				errors.push(`[checksums] File not found: ${filePath}`);
			}
			checkedCount++;
		}
	}

	if (errors.length > 0) {
		// Deduplicate errors
		const uniqueErrors = [...new Set(errors)];
		log(`❌ Registry audit FAILED`, colors.red);
		uniqueErrors.forEach((err) => log(`   - ${err}`, colors.red));
		process.exit(1);
	} else {
		log(`✅ Registry audit PASSED (${checkedCount} files verified)`, colors.green);
		process.exit(0);
	}
}

main();
