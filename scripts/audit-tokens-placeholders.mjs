#!/usr/bin/env node
/**
 * Audit Tokens Placeholders Script
 *
 * Fails if token reference placeholders like `{color.base.white}` are found in
 * emitted CSS/SCSS output for the tokens package, if source references a
 * selectable palette token that is absent from the emitted theme sheet, or if a
 * Greater custom-property reference has neither a definition nor a fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceExtensions = new Set([
	'.css',
	'.scss',
	'.pcss',
	'.sass',
	'.less',
	'.styl',
	'.svelte',
	'.vue',
	'.astro',
	'.js',
	'.jsx',
	'.mjs',
	'.cjs',
	'.ts',
	'.tsx',
	'.mts',
	'.cts',
	'.json',
	'.md',
	'.mdx',
	'.html',
	'.svg',
	'.yaml',
	'.yml',
	'.graphql',
]);
const standaloneStyleExtensions = new Set(['.css', '.scss', '.pcss', '.sass', '.less', '.styl']);
const componentStyleExtensions = new Set(['.svelte', '.vue', '.astro']);
const jsTsExtensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']);

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

function stripLeadingLineComments(content) {
	return content.replace(/^[\t ]*\/\/.*$/gm, (comment) => comment.replace(/[^\n]/g, ' '));
}

function referenceContent(file, content) {
	const withoutBlocks = stripBlockComments(content);
	return jsTsExtensions.has(path.extname(file))
		? stripLeadingLineComments(withoutBlocks)
		: withoutBlocks;
}

function definitionContent(file, content) {
	const extension = path.extname(file);
	if (standaloneStyleExtensions.has(extension)) return stripBlockComments(content);
	if (!componentStyleExtensions.has(extension)) return '';

	return Array.from(
		content.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi),
		(match) => match[1] ?? ''
	)
		.map(stripBlockComments)
		.join('\n');
}

function customPropertyReferences(content) {
	const references = [];

	for (let offset = 0; offset < content.length; offset += 1) {
		if (content.slice(offset, offset + 4).toLowerCase() !== 'var(') continue;

		let depth = 1;
		let quote = null;
		let end = offset + 4;
		for (; end < content.length && depth > 0; end += 1) {
			const character = content[end];
			if (quote) {
				if (character === '\\') end += 1;
				else if (character === quote) quote = null;
				continue;
			}
			if (character === '"' || character === "'") quote = character;
			else if (character === '(') depth += 1;
			else if (character === ')') depth -= 1;
		}
		if (depth > 0) continue;

		const body = content.slice(offset + 4, end - 1);
		const property = body.match(/^\s*(--gr-[\w-]+)/)?.[1];
		if (!property) continue;

		let bodyDepth = 0;
		let bodyQuote = null;
		let hasFallback = false;
		for (const character of body) {
			if (bodyQuote) {
				if (character === bodyQuote) bodyQuote = null;
				continue;
			}
			if (character === '"' || character === "'") bodyQuote = character;
			else if (character === '(') bodyDepth += 1;
			else if (character === ')') bodyDepth -= 1;
			else if (character === ',' && bodyDepth === 0) {
				hasFallback = true;
				break;
			}
		}

		references.push({ property, hasFallback, offset });
	}

	return references;
}

function auditTokenReferences() {
	const emittedThemePath = path.join(rootDir, 'packages', 'tokens', 'dist', 'theme.css');
	const palettesPath = path.join(rootDir, 'packages', 'tokens', 'src', 'palettes.json');
	const sourceRoots = ['packages', 'apps', 'examples', 'docs'].map((directory) =>
		path.join(rootDir, directory)
	);

	const emittedTheme = fs.readFileSync(emittedThemePath, 'utf8');
	const emittedProperties = new Set(
		Array.from(emittedTheme.matchAll(/(--gr-[\w-]+)\s*:/g), (match) => match[1])
	);
	const paletteNames = Object.keys(JSON.parse(fs.readFileSync(palettesPath, 'utf8')));
	const paletteReference = new RegExp(
		`var\\(\\s*(--gr-color-(?:${paletteNames.join('|')})-[\\w-]+)`,
		'g'
	);
	const sourceFiles = sourceRoots
		.flatMap((sourceRoot) => listFilesRecursive(sourceRoot))
		.filter((file) => {
			const relative = path.relative(rootDir, file);
			if (
				relative
					.split(path.sep)
					.some((part) =>
						['coverage', 'dist', 'node_modules', '.svelte-kit', 'build'].includes(part)
					)
			) {
				return false;
			}
			return sourceExtensions.has(path.extname(file));
		});
	const sourceProperties = new Set(emittedProperties);
	const paletteErrors = [];
	const referenceErrors = [];

	for (const file of sourceFiles) {
		const content = definitionContent(file, fs.readFileSync(file, 'utf8'));
		for (const match of content.matchAll(/(--gr-[\w-]+)\s*:/g)) {
			if (match[1]) sourceProperties.add(match[1]);
		}
	}

	for (const file of sourceFiles) {
		const content = fs.readFileSync(file, 'utf8');
		const uncommented = referenceContent(file, content);
		for (const match of uncommented.matchAll(paletteReference)) {
			const property = match[1];
			if (property && !emittedProperties.has(property)) {
				paletteErrors.push({
					file: path.relative(rootDir, file),
					line: lineNumberAt(content, match.index ?? 0),
					property,
				});
			}
		}
		for (const reference of customPropertyReferences(uncommented)) {
			if (!sourceProperties.has(reference.property) && !reference.hasFallback) {
				referenceErrors.push({
					file: path.relative(rootDir, file),
					line: lineNumberAt(content, reference.offset),
					property: reference.property,
				});
			}
		}
	}

	return { paletteErrors, referenceErrors, sourceFileCount: sourceFiles.length };
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
	if (
		errors.length > 0 ||
		tokenReferenceAudit.paletteErrors.length > 0 ||
		tokenReferenceAudit.referenceErrors.length > 0
	) {
		if (errors.length > 0) {
			log(`❌ Tokens placeholders audit FAILED (${errors.length} files)`, colors.red);
			errors.forEach((error) => {
				log(`   - ${error.file}`, colors.red);
				log(`     ${error.matches.join(', ')}`, colors.red);
			});
		}
		if (tokenReferenceAudit.paletteErrors.length > 0) {
			log(
				`❌ Selectable palette reference audit FAILED (${tokenReferenceAudit.paletteErrors.length} references)`,
				colors.red
			);
			tokenReferenceAudit.paletteErrors.forEach((error) => {
				log(`   - ${error.file}:${error.line} ${error.property}`, colors.red);
			});
			log(
				'   Selectable palette references must use properties present in the emitted token sheet.',
				colors.yellow
			);
		}
		if (tokenReferenceAudit.referenceErrors.length > 0) {
			log(
				`❌ Undefined no-fallback custom-property audit FAILED (${tokenReferenceAudit.referenceErrors.length} references)`,
				colors.red
			);
			tokenReferenceAudit.referenceErrors.forEach((error) => {
				log(`   - ${error.file}:${error.line} ${error.property}`, colors.red);
			});
			log(
				'   Greater custom properties must be defined in scanned source/the emitted sheet or provide a fallback.',
				colors.yellow
			);
		}
		process.exit(1);
	}

	log(`✅ Tokens placeholders audit PASSED (${files.length} files checked)`, colors.green);
	log(
		`✅ Selectable palette references and undefined no-fallback custom properties audit PASSED (${tokenReferenceAudit.sourceFileCount} source files checked)`,
		colors.green
	);
	process.exit(0);
}

main();
