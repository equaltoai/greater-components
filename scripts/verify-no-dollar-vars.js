#!/usr/bin/env node
/**
 * Verification script to ensure no $ prefixed temporary variables ($0, $1, $2, etc.)
 * remain in compiled output that could conflict with Svelte 5 runes.
 *
 * This checks for the EXACT problematic pattern: standalone $ followed by digits
 * that are actual JavaScript variables/identifiers, not:
 * - Regex backreferences in strings ("$1")
 * - Part of other identifiers (index$1, glob$1)
 * - In comments
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..');

// Pattern to match: ANY variable starting with $ (including $$)
// This matches: $0, $1, $$exports, $$anchor, $$props, $$array, $$value, $$render, etc.
// Note: We don't use \b because $ is not a word character, so \b doesn't work correctly
const PROBLEMATIC_PATTERN = /\$+[a-zA-Z0-9_]+/g;

// Packages that compile Svelte code
const PACKAGES_TO_CHECK = ['fediverse', 'primitives', 'icons'];

function findJSFiles(dir, fileList = []) {
	const files = readdirSync(dir);

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			// Skip node_modules
			if (file === 'node_modules') continue;
			findJSFiles(filePath, fileList);
		} else if (file.endsWith('.js') && !file.endsWith('.map')) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

function checkFile(filePath) {
	const content = readFileSync(filePath, 'utf8');
	const lines = content.split('\n');
	const issues = [];

	// Check each line
	lines.forEach((line, lineNum) => {
		// Skip comments
		if (/^\s*\/\//.test(line) || /\/\*.*\*\//.test(line)) {
			return;
		}

		// Skip if it's clearly a regex backreference in a string
		if (/["'`].*\$\d+.*["'`]/.test(line)) {
			return;
		}

		// Check for problematic pattern
		let match;
		const regex = new RegExp(PROBLEMATIC_PATTERN);
		while ((match = regex.exec(line)) !== null) {
			const varName = match[0]; // e.g., "$0", "$$exports", "$$anchor2", "$$render"
			const index = match.index;

			// Skip if it's part of another identifier (like index$1, glob$1)
			// Check character before: if it's a word character, skip
			if (index > 0 && /\w/.test(line[index - 1])) {
				continue;
			}
			// Check character after: if it's a word character, skip
			if (index + varName.length < line.length && /\w/.test(line[index + varName.length])) {
				continue;
			}

			// Skip if it's in a string literal
			const before = line.slice(0, index);
			const singleQuotes = (before.match(/'/g) || []).length;
			const doubleQuotes = (before.match(/"/g) || []).length;
			const backticks = (before.match(/`/g) || []).length;
			if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || backticks % 2 !== 0) {
				continue;
			}

			// This is a problematic standalone $ variable
			issues.push({
				line: lineNum + 1,
				column: index + 1,
				variable: varName,
				content: line.trim(),
			});
		}
	});

	return issues;
}

function main() {
	console.log('🔍 Verifying no $ prefixed variables in compiled output...\n');

	let totalIssues = 0;
	const allIssues = [];

	for (const pkg of PACKAGES_TO_CHECK) {
		const distDir = join(repoRoot, 'packages', pkg, 'dist');

		try {
			const files = findJSFiles(distDir);
			console.log(`📦 ${pkg}: Checking ${files.length} files...`);

			for (const file of files) {
				const issues = checkFile(file);
				if (issues.length > 0) {
					totalIssues += issues.length;
					const relativePath = file.replace(repoRoot + '/', '');
					allIssues.push({ file: relativePath, issues });
				}
			}
		} catch (err) {
			if (err.code === 'ENOENT') {
				console.log(`⚠️  ${pkg}: dist directory not found (may need to build)`);
			} else {
				throw err;
			}
		}
	}

	console.log('\n' + '='.repeat(60));

	if (totalIssues === 0) {
		console.log('✅ SUCCESS: No problematic $ prefixed variables found!');
		process.exit(0);
	} else {
		console.log(`❌ FAILURE: Found ${totalIssues} problematic $ prefixed variable(s)\n`);

		for (const { file, issues } of allIssues) {
			console.log(`\n📄 ${file}:`);
			for (const issue of issues) {
				console.log(`   Line ${issue.line}, Col ${issue.column}: ${issue.variable}`);
				console.log(`   ${issue.content}`);
			}
		}

		console.log('\n❌ Build verification failed. Please fix the plugin.');
		process.exit(1);
	}
}

main();
