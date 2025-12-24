#!/usr/bin/env node
/**
 * Audit Dist Hygiene Script
 *
 * Fails if pnpm store paths (e.g. `.pnpm/`) are found in package `dist/` output.
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

function getDistDirs(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			if (file === 'node_modules' || file === '.git') return;
			if (file === 'dist') {
				// Only consider package dist folders (must have a sibling package.json).
				const packageJson = path.join(dir, 'package.json');
				if (fs.existsSync(packageJson) && dir !== rootDir) {
					results.push(filePath);
				}
			} else {
				results = results.concat(getDistDirs(filePath));
			}
		}
	});
	return results;
}

function scanFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');
	const issues = [];
	if (content.includes('.pnpm')) {
		issues.push('Contains ".pnpm"');
	}
	return issues;
}

function scanDir(dir) {
	let issues = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			issues = issues.concat(scanDir(filePath));
		} else {
			// Skip source maps and non-text files if needed, but checking all is safer
			if (file.endsWith('.map')) return;

			const fileIssues = scanFile(filePath);
			if (fileIssues.length > 0) {
				issues.push({ path: filePath, issues: fileIssues });
			}
		}
	});
	return issues;
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🧹 Audit Dist Hygiene', colors.bold);
	log('='.repeat(60) + '\n');

	const distDirs = getDistDirs(rootDir);
	let hasErrors = false;
	let checkedCount = 0;

	distDirs.forEach((distDir) => {
		const relativePath = path.relative(rootDir, distDir);
		const issues = scanDir(distDir);

		if (issues.length > 0) {
			hasErrors = true;
			log(`❌ ${relativePath}`, colors.red);
			issues.forEach((issue) => {
				log(`   - ${path.relative(distDir, issue.path)}: ${issue.issues.join(', ')}`, colors.red);
			});
		} else {
			checkedCount++;
		}
	});

	log('\n' + '='.repeat(60));
	if (hasErrors) {
		log('❌ Dist hygiene audit FAILED', colors.red);
		process.exit(1);
	} else {
		log(`✅ Dist hygiene audit PASSED (${checkedCount} dist directories checked)`, colors.green);
		process.exit(0);
	}
}

main();
