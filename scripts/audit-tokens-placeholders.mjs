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
import { stripCssBlockComments } from './css-source.mjs';

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
const componentStyleExtensions = new Set(['.svelte', '.vue', '.astro', '.html', '.svg']);
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

function canStartJsRegex(content, offset) {
	let previousOffset = offset - 1;
	while (previousOffset >= 0 && /\s/.test(content[previousOffset])) previousOffset -= 1;
	if (previousOffset < 0) return true;

	const previousCharacter = content[previousOffset];
	if (previousCharacter === '<' && /[A-Za-z]/.test(content[offset + 1] ?? '')) return false;
	// This conservative accept set knowingly omits regex starts after `}`, `)`, and
	// `else`. Expanding it without a full parser can classify division as regex; that
	// safe-direction false positive copies the candidate verbatim and suppresses
	// comment stripping, so suspicious token references remain visible and fail loud.
	// The JSX ambiguity above is structurally unreachable in the current audited tree,
	// which contains no .jsx or .tsx files.
	if (/[([{,:;=!?&|+\-*%^~<>]/.test(previousCharacter)) return true;

	const prefix = content.slice(0, previousOffset + 1);
	return /(?:^|[^\w$])(return|throw|case|delete|void|typeof|yield|await|instanceof|in|of)\s*$/.test(
		prefix
	);
}

function stripJsComments(content, { stripLineComments = true } = {}) {
	let result = '';
	let quote = null;

	for (let offset = 0; offset < content.length; offset += 1) {
		const character = content[offset];
		if (quote) {
			result += character;
			if (character === '\\' && offset + 1 < content.length) {
				offset += 1;
				result += content[offset];
			} else if (character === quote) {
				quote = null;
			} else if (quote !== '`' && (character === '\n' || character === '\r')) {
				quote = null;
			}
			continue;
		}

		if (character === '"' || character === "'" || character === '`') {
			quote = character;
			result += character;
			continue;
		}

		if (character === '/' && content[offset + 1] === '/') {
			while (offset < content.length && content[offset] !== '\n' && content[offset] !== '\r') {
				result += stripLineComments ? ' ' : content[offset];
				offset += 1;
			}
			offset -= 1;
			continue;
		}

		if (character === '/' && content[offset + 1] === '*') {
			const commentEnd = content.indexOf('*/', offset + 2);
			if (commentEnd === -1) {
				// Unlike CSS, an unterminated JS block comment is a syntax error. Keep
				// the remainder visible so the audit fails loud instead of losing EOF.
				result += content.slice(offset);
				break;
			}

			for (; offset <= commentEnd + 1; offset += 1) {
				const commentCharacter = content[offset];
				result += commentCharacter === '\n' || commentCharacter === '\r' ? commentCharacter : ' ';
			}
			offset -= 1;
			continue;
		}

		if (character === '/' && canStartJsRegex(content, offset)) {
			let inCharacterClass = false;
			result += character;
			for (offset += 1; offset < content.length; offset += 1) {
				const regexCharacter = content[offset];
				result += regexCharacter;
				if (regexCharacter === '\\' && offset + 1 < content.length) {
					offset += 1;
					result += content[offset];
				} else if (regexCharacter === '[') {
					inCharacterClass = true;
				} else if (regexCharacter === ']') {
					inCharacterClass = false;
				} else if (regexCharacter === '/' && !inCharacterClass) {
					break;
				} else if (regexCharacter === '\n' || regexCharacter === '\r') {
					break;
				}
			}
			continue;
		}

		result += character;
	}

	return result;
}

function markupTagEnd(content, offset) {
	let quote = null;
	for (; offset < content.length; offset += 1) {
		const character = content[offset];
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") quote = character;
		else if (character === '>') return offset;
	}
	return -1;
}

function markupExpressionEnd(content, offset) {
	let depth = 0;
	let quote = null;
	let lineComment = false;
	let blockComment = false;
	let regex = false;
	let regexCharacterClass = false;

	for (; offset < content.length; offset += 1) {
		const character = content[offset];
		if (lineComment) {
			if (character === '\n' || character === '\r') lineComment = false;
			continue;
		}
		if (blockComment) {
			if (character === '*' && content[offset + 1] === '/') {
				blockComment = false;
				offset += 1;
			}
			continue;
		}
		if (quote) {
			if (character === '\\') offset += 1;
			else if (character === quote) quote = null;
			else if (quote !== '`' && (character === '\n' || character === '\r')) quote = null;
			continue;
		}
		if (regex) {
			if (character === '\\') offset += 1;
			else if (character === '[') regexCharacterClass = true;
			else if (character === ']') regexCharacterClass = false;
			else if (character === '/' && !regexCharacterClass) regex = false;
			else if (character === '\n' || character === '\r') regex = false;
			continue;
		}

		if (character === '"' || character === "'" || character === '`') quote = character;
		else if (character === '/' && content[offset + 1] === '/') {
			lineComment = true;
			offset += 1;
		} else if (character === '/' && content[offset + 1] === '*') {
			blockComment = true;
			offset += 1;
		} else if (
			character === '/' &&
			!(content[offset - 1] === '{' && /[A-Za-z]/.test(content[offset + 1] ?? '')) &&
			canStartJsRegex(content, offset)
		) {
			regex = true;
		} else if (character === '{') depth += 1;
		else if (character === '}' && --depth === 0) return offset;
	}

	return -1;
}

function componentRegions(content) {
	const regions = [];
	let offset = 0;

	while (offset < content.length) {
		if (content.startsWith('<!--', offset)) {
			const commentEnd = content.indexOf('-->', offset + 4);
			if (commentEnd === -1) break;
			offset = commentEnd + 3;
			continue;
		}

		if (content[offset] === '{') {
			const expressionEnd = markupExpressionEnd(content, offset);
			if (expressionEnd === -1) break;
			offset = expressionEnd + 1;
			continue;
		}

		if (content[offset] !== '<') {
			offset += 1;
			continue;
		}

		const opening = content.slice(offset).match(/^<(script|style)(?=[\s/>])/i);
		if (!opening) {
			const markupTag = content
				.slice(offset)
				.match(/^<\/?[A-Za-z][\w:.-]*(?=[\s/>])|^<!(?!--)|^<\?/i);
			if (!markupTag) {
				offset += 1;
				continue;
			}
			const tagEnd = markupTagEnd(content, offset + 1);
			offset = tagEnd === -1 ? offset + 1 : tagEnd + 1;
			continue;
		}

		const type = opening[1].toLowerCase();
		const openingEnd = markupTagEnd(content, offset + opening[0].length);
		if (openingEnd === -1) break;

		const closingPattern = new RegExp(`<\\/${type}\\s*>`, 'gi');
		closingPattern.lastIndex = openingEnd + 1;
		const closing = closingPattern.exec(content);
		if (!closing) break;

		regions.push({
			type,
			start: offset,
			contentStart: openingEnd + 1,
			contentEnd: closing.index,
			end: closingPattern.lastIndex,
		});
		offset = closingPattern.lastIndex;
	}

	return regions;
}

function stripComponentRegionComments(content) {
	let result = '';
	let offset = 0;
	for (const region of componentRegions(content)) {
		result += content.slice(offset, region.contentStart);
		const regionContent = content.slice(region.contentStart, region.contentEnd);
		result +=
			region.type === 'script'
				? // Preserve component-script line comments as audited text (base behavior),
					// while JS lexing keeps block-comment syntax out of strings and regexes.
					stripJsComments(regionContent, { stripLineComments: false })
				: stripCssBlockComments(regionContent);
		result += content.slice(region.contentEnd, region.end);
		offset = region.end;
	}
	return result + content.slice(offset);
}

function referenceContent(file, content) {
	const extension = path.extname(file);
	if (standaloneStyleExtensions.has(extension)) return stripCssBlockComments(content);
	if (componentStyleExtensions.has(extension)) return stripComponentRegionComments(content);
	if (jsTsExtensions.has(extension)) {
		return stripJsComments(content);
	}
	return content;
}

function definitionContent(file, content) {
	const extension = path.extname(file);
	if (standaloneStyleExtensions.has(extension)) return stripCssBlockComments(content);
	if (!componentStyleExtensions.has(extension)) return '';

	return componentRegions(content)
		.filter((region) => region.type === 'style')
		.map((region) => content.slice(region.contentStart, region.contentEnd))
		.map(stripCssBlockComments)
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

export function auditTokenReferences({
	rootDirectory = rootDir,
	emittedThemePath = path.join(rootDirectory, 'packages', 'tokens', 'dist', 'theme.css'),
	palettesPath = path.join(rootDirectory, 'packages', 'tokens', 'src', 'palettes.json'),
	sourceRoots = ['packages', 'apps', 'examples', 'docs'].map((directory) =>
		path.join(rootDirectory, directory)
	),
} = {}) {
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
			const relative = path.relative(rootDirectory, file);
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
					file: path.relative(rootDirectory, file),
					line: lineNumberAt(content, match.index ?? 0),
					property,
				});
			}
		}
		for (const reference of customPropertyReferences(uncommented)) {
			if (!sourceProperties.has(reference.property) && !reference.hasFallback) {
				referenceErrors.push({
					file: path.relative(rootDirectory, file),
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

if (
	process.argv[1] &&
	fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
	main();
}
