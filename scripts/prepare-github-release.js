#!/usr/bin/env node
/**
 * Prepare a GitHub-only Greater Components release commit.
 *
 * - Sets root package.json version
 * - Sets packages/cli/package.json version (CLI tarball version)
 * - Updates registry/latest.json to point at `greater-vX.Y.Z`
 * - Regenerates registry/index.json with ref override (so index.ref is the tag)
 *
 * Usage:
 *   node scripts/prepare-github-release.js 0.1.0
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const semverPattern = /^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$/;
const isStableSemver = (v) => !v.includes('-');

function die(message) {
	console.error(message);
	process.exit(1);
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
	fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function skipWhitespace(text, i) {
	while (i < text.length && /\s/.test(text[i])) i += 1;
	return i;
}

function findJsonStringEnd(text, start) {
	// Returns index *after* the closing quote.
	let i = start + 1;
	while (i < text.length) {
		const ch = text[i];
		if (ch === '\\') {
			i += 2;
			continue;
		}
		if (ch === '"') return i + 1;
		i += 1;
	}
	throw new Error('Unterminated JSON string');
}

function skipJsonBalanced(text, start, openChar, closeChar) {
	let i = start;
	let depth = 0;
	let inString = false;

	while (i < text.length) {
		const ch = text[i];

		if (inString) {
			if (ch === '\\') {
				i += 2;
				continue;
			}
			if (ch === '"') inString = false;
			i += 1;
			continue;
		}

		if (ch === '"') {
			inString = true;
			i += 1;
			continue;
		}

		if (ch === openChar) depth += 1;
		if (ch === closeChar) {
			depth -= 1;
			if (depth === 0) return i + 1;
		}

		i += 1;
	}

	throw new Error(`Unterminated JSON ${openChar}${closeChar} value`);
}

function skipJsonPrimitive(text, start) {
	let i = start;
	while (i < text.length && !/[\s,\]}]/.test(text[i])) i += 1;
	return i;
}

function skipJsonValue(text, start) {
	let i = skipWhitespace(text, start);
	const ch = text[i];
	if (ch === '"') return findJsonStringEnd(text, i);
	if (ch === '{') return skipJsonBalanced(text, i, '{', '}');
	if (ch === '[') return skipJsonBalanced(text, i, '[', ']');
	return skipJsonPrimitive(text, i);
}

function replaceTopLevelJsonStringProperty(text, property, value) {
	let i = skipWhitespace(text, 0);
	if (text[i] !== '{') throw new Error('Expected JSON object');
	i += 1;

	while (i < text.length) {
		i = skipWhitespace(text, i);

		if (text[i] === '}') return { changed: false, text };

		// Allow optional commas (and any whitespace) between properties.
		if (text[i] === ',') {
			i += 1;
			continue;
		}

		if (text[i] !== '"') throw new Error('Expected JSON string key');
		const keyStart = i;
		const keyEnd = findJsonStringEnd(text, keyStart);
		const key = JSON.parse(text.slice(keyStart, keyEnd));
		i = skipWhitespace(text, keyEnd);

		if (text[i] !== ':') throw new Error('Expected ":" after JSON object key');
		i = skipWhitespace(text, i + 1);

		if (key === property) {
			if (text[i] !== '"') throw new Error(`Expected string value for "${property}"`);
			const valueStart = i;
			const valueEnd = findJsonStringEnd(text, valueStart);
			const oldValue = JSON.parse(text.slice(valueStart, valueEnd));
			const newLiteral = JSON.stringify(value);
			const updated = text.slice(0, valueStart) + newLiteral + text.slice(valueEnd);
			return { changed: oldValue !== value, text: updated };
		}

		i = skipJsonValue(text, i);
		i = skipWhitespace(text, i);

		if (text[i] === ',') i += 1;
	}

	throw new Error('Unterminated JSON object');
}

function updateJsonVersion(filePath, version) {
	if (!fs.existsSync(filePath)) return;

	const original = fs.readFileSync(filePath, 'utf8');
	const parsed = JSON.parse(original);
	if (parsed?.version === version) return;

	const replaced = replaceTopLevelJsonStringProperty(original, 'version', version);
	if (!replaced.changed) return;

	const updated = replaced.text.endsWith('\n') ? replaced.text : replaced.text + '\n';
	const verify = JSON.parse(updated);
	if (verify?.version !== version) {
		throw new Error(`Failed to update version for ${filePath}`);
	}

	fs.writeFileSync(filePath, updated);
}

function updateWorkspacePackageVersions(version) {
	const packagesDir = path.join(rootDir, 'packages');
	const workspaceRoots = [
		packagesDir,
		path.join(packagesDir, 'faces'),
		path.join(packagesDir, 'shared'),
	];

	for (const dir of workspaceRoots) {
		if (!fs.existsSync(dir)) continue;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			const packageJsonPath = path.join(dir, entry.name, 'package.json');
			updateJsonVersion(packageJsonPath, version);

			const manifestPath = path.join(dir, entry.name, 'manifest.json');
			updateJsonVersion(manifestPath, version);
		}
	}
}

function registryIndexMatchesTag({ version, tag }) {
	const indexPath = path.join(rootDir, 'registry', 'index.json');
	if (!fs.existsSync(indexPath)) return false;

	try {
		const index = readJson(indexPath);
		if (index?.version !== version) return false;
		if (index?.ref !== tag) return false;

		// Ensure checksums are valid so we don't skip regeneration when files changed.
		execSync('node scripts/validate-registry-index.js --strict', {
			cwd: rootDir,
			stdio: 'ignore',
		});

		return true;
	} catch {
		return false;
	}
}

function main() {
	const args = process.argv.slice(2);
	const version = args[0];

	if (!version) {
		die('Usage: node scripts/prepare-github-release.js <version>');
	}

	if (!semverPattern.test(version)) {
		die(`Invalid semver version: ${version}`);
	}

	const tag = `greater-v${version}`;

	const packageJsonPath = path.join(rootDir, 'package.json');
	const cliPackageJsonPath = path.join(rootDir, 'packages', 'cli', 'package.json');
	const latestPath = path.join(rootDir, 'registry', 'latest.json');

	updateJsonVersion(packageJsonPath, version);
	updateJsonVersion(cliPackageJsonPath, version);

	updateWorkspacePackageVersions(version);

	if (isStableSemver(version)) {
		const existingLatest = fs.existsSync(latestPath) ? readJson(latestPath) : null;
		if (existingLatest?.ref !== tag || existingLatest?.version !== version) {
			writeJson(latestPath, {
				ref: tag,
				version,
				updatedAt: new Date().toISOString(),
			});
		}
	}

	if (!registryIndexMatchesTag({ version, tag })) {
		execSync(`node scripts/generate-registry-index.js --ref ${tag}`, {
			cwd: rootDir,
			stdio: 'inherit',
		});
	}

	execSync('node scripts/validate-registry-index.js --strict', {
		cwd: rootDir,
		stdio: 'inherit',
	});

	execSync('node scripts/validate-release-versions.js', {
		cwd: rootDir,
		stdio: 'inherit',
	});
}

main();
