#!/usr/bin/env node
/**
 * Audit Tokens Placeholders Script
 *
 * Fails if token reference placeholders like `{color.base.white}` are found in
 * emitted CSS/SCSS output for the tokens package, or if package source references
 * a selectable palette token that is absent from the emitted theme sheet.
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

function lineNumberAt(content, offset) {
	return content.slice(0, offset).split('\n').length;
}

function stripBlockComments(content) {
	return content.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));
}

function auditTokenReferences() {
	const emittedThemePath = path.join(rootDir, 'packages', 'tokens', 'dist', 'theme.css');
	const palettesPath = path.join(rootDir, 'packages', 'tokens', 'src', 'palettes.json');
	const packagesDir = path.join(rootDir, 'packages');

	const emittedTheme = fs.readFileSync(emittedThemePath, 'utf8');
	const emittedProperties = new Set(
		Array.from(emittedTheme.matchAll(/(--gr-[\w-]+)\s*:/g), (match) => match[1])
	);
	const paletteNames = Object.keys(JSON.parse(fs.readFileSync(palettesPath, 'utf8')));
	const paletteReference = new RegExp(
		`var\\(\\s*(--gr-color-(?:${paletteNames.join('|')})-[\\w-]+)`,
		'g'
	);
	const sourceFiles = listFilesRecursive(packagesDir).filter((file) => {
		const relative = path.relative(packagesDir, file);
		if (
			relative.split(path.sep).some((part) => ['coverage', 'dist', 'node_modules'].includes(part))
		) {
			return false;
		}
		return file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.svelte');
	});
	const errors = [];

	for (const file of sourceFiles) {
		const content = fs.readFileSync(file, 'utf8');
		const uncommented = stripBlockComments(content);
		for (const match of uncommented.matchAll(paletteReference)) {
			const property = match[1];
			if (property && !emittedProperties.has(property)) {
				errors.push({
					file: path.relative(rootDir, file),
					line: lineNumberAt(content, match.index ?? 0),
					property,
				});
			}
		}
	}

	return { errors, sourceFileCount: sourceFiles.length };
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🪙 Audit Tokens Output & References', colors.bold);
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

	const tokenReferenceAudit = auditTokenReferences();

	log('\n' + '='.repeat(60));
	if (errors.length > 0 || tokenReferenceAudit.errors.length > 0) {
		if (errors.length > 0) {
			log(`❌ Tokens placeholders audit FAILED (${errors.length} files)`, colors.red);
			errors.forEach((error) => {
				log(`   - ${error.file}`, colors.red);
				log(`     ${error.matches.join(', ')}`, colors.red);
			});
		}
		if (tokenReferenceAudit.errors.length > 0) {
			log(
				`❌ Token reference existence audit FAILED (${tokenReferenceAudit.errors.length} references)`,
				colors.red
			);
			tokenReferenceAudit.errors.forEach((error) => {
				log(`   - ${error.file}:${error.line} ${error.property}`, colors.red);
			});
			log(
				'   Selectable palette references must use properties present in the emitted token sheet.',
				colors.yellow
			);
		}
		process.exit(1);
	}

	log(`✅ Tokens placeholders audit PASSED (${files.length} files checked)`, colors.green);
	log(
		`✅ Token reference existence audit PASSED (${tokenReferenceAudit.sourceFileCount} source files checked)`,
		colors.green
	);
	process.exit(0);
}

main();
