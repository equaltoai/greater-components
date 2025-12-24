#!/usr/bin/env node
/**
 * Audit Tokens Placeholders Script
 *
 * Fails if token reference placeholders like `{color.base.white}` are found in
 * emitted CSS/SCSS output for the tokens package.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

function listFilesRecursive(dir) {
	const results = [];
	if (!fs.existsSync(dir)) return results;

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...listFilesRecursive(fullPath));
		} else {
			results.push(fullPath);
		}
	}

	return results;
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🪙 Audit Tokens Placeholders', colors.bold);
	log('='.repeat(60) + '\n');

	const distDir = path.join(rootDir, 'packages', 'tokens', 'dist');
	if (!fs.existsSync(distDir)) {
		log(`❌ Tokens dist directory not found: ${path.relative(rootDir, distDir)}`, colors.red);
		log('   Run `pnpm --filter @equaltoai/greater-components-tokens build` first.', colors.yellow);
		process.exit(1);
	}

	const files = listFilesRecursive(distDir).filter((file) => {
		if (file.endsWith('.map')) return false;
		return file.endsWith('.css') || file.endsWith('.scss');
	});

	// Match placeholders like `{color.base.white}` or `{spacing.scale.4}`.
	const placeholderRegex = /\{[a-z0-9]+(?:[._-][a-z0-9]+)+\}/gi;

	const errors = [];

	for (const file of files) {
		const content = fs.readFileSync(file, 'utf8');
		const matches = content.match(placeholderRegex);
		if (matches && matches.length > 0) {
			errors.push({
				file: path.relative(rootDir, file),
				matches: Array.from(new Set(matches)).slice(0, 10),
			});
		}
	}

	log('\n' + '='.repeat(60));
	if (errors.length > 0) {
		log(`❌ Tokens placeholders audit FAILED (${errors.length} files)`, colors.red);
		errors.forEach((error) => {
			log(`   - ${error.file}`, colors.red);
			log(`     ${error.matches.join(', ')}`, colors.red);
		});
		process.exit(1);
	}

	log(`✅ Tokens placeholders audit PASSED (${files.length} files checked)`, colors.green);
	process.exit(0);
}

main();
