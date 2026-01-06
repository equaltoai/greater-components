#!/usr/bin/env node
/**
 * Prepare a GitHub-only Greater Components release commit.
 *
 * - Sets root package.json version
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
	const latestPath = path.join(rootDir, 'registry', 'latest.json');

	const pkg = readJson(packageJsonPath);
	writeJson(packageJsonPath, { ...pkg, version });

	writeJson(latestPath, {
		ref: tag,
		version,
		updatedAt: new Date().toISOString(),
	});

	execSync(`node scripts/generate-registry-index.js --ref ${tag}`, {
		cwd: rootDir,
		stdio: 'inherit',
	});

	execSync('node scripts/validate-registry-index.js --strict', {
		cwd: rootDir,
		stdio: 'inherit',
	});
}

main();
