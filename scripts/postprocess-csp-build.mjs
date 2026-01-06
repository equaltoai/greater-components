#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * @param {string} dir
 * @returns {string[]}
 */
function findHtmlFiles(dir) {
	/** @type {string[]} */
	const results = [];

	const entries = readdirSync(dir);
	for (const entry of entries) {
		const fullPath = path.join(dir, entry);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			results.push(...findHtmlFiles(fullPath));
			continue;
		}

		if (stat.isFile() && fullPath.endsWith('.html')) {
			results.push(fullPath);
		}
	}

	return results;
}

/**
 * @param {string} input
 * @returns {string}
 */
function normalizeBasePath(input) {
	if (!input) return '';
	const base = input.endsWith('/') ? input.slice(0, -1) : input;
	return base.startsWith('/') ? base : `/${base}`;
}

function usage() {
	console.error(
		[
			'Usage:',
			'  node scripts/postprocess-csp-build.mjs <buildDir> [--base <basePath>]',
			'',
			'Examples:',
			'  node scripts/postprocess-csp-build.mjs apps/playground/build --base /greater-components',
			'  node scripts/postprocess-csp-build.mjs apps/docs/build --base /greater-components/docs',
		].join('\n')
	);
	process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0) usage();

const buildDir = path.resolve(process.cwd(), args[0]);
const baseFlagIndex = args.indexOf('--base');
const basePath = normalizeBasePath(baseFlagIndex >= 0 ? args[baseFlagIndex + 1] : '');

if (!existsSync(buildDir) || !statSync(buildDir).isDirectory()) {
	console.error(`Build directory not found: ${buildDir}`);
	process.exit(2);
}

const htmlFiles = findHtmlFiles(buildDir);
const inlineScriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi;

let filesUpdated = 0;
let scriptsExtracted = 0;

for (const htmlFilePath of htmlFiles) {
	const original = readFileSync(htmlFilePath, 'utf-8');
	const htmlDir = path.dirname(htmlFilePath);
	const htmlBaseName = path.basename(htmlFilePath, '.html');

	let didChange = false;

	const updated = original.replace(inlineScriptRegex, (full, rawAttrs, rawBody) => {
		const attrs = rawAttrs ?? '';
		const body = rawBody ?? '';

		if (/\bsrc\s*=/.test(attrs)) {
			return full;
		}

		if (!body.trim()) {
			return full;
		}

		const hash = createHash('sha256').update(body).digest('hex').slice(0, 12);
		const scriptFileName = `${htmlBaseName}.csp-inline-${hash}.js`;
		const scriptFilePath = path.join(htmlDir, scriptFileName);

		if (!existsSync(scriptFilePath) || readFileSync(scriptFilePath, 'utf-8') !== body) {
			writeFileSync(scriptFilePath, body, 'utf-8');
		}

		const relFromBuildRoot = path.relative(buildDir, scriptFilePath).split(path.sep).join('/');
		const src = basePath ? `${basePath}/${relFromBuildRoot}` : `./${scriptFileName}`;

		const cleanedAttrs = attrs.trim();
		const newAttrs = cleanedAttrs ? ` ${cleanedAttrs} src="${src}"` : ` src="${src}"`;

		scriptsExtracted += 1;
		didChange = true;
		return `<script${newAttrs}></script>`;
	});

	if (didChange) {
		writeFileSync(htmlFilePath, updated, 'utf-8');
		filesUpdated += 1;
	}
}

console.log(
	`CSP postprocess complete: ${filesUpdated} HTML file(s) updated, ${scriptsExtracted} inline script(s) extracted`
);
