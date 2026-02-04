#!/usr/bin/env node
/**
 * Release version consistency checks.
 *
 * Ensures the Greater Components release version is consistent across:
 * - root package.json
 * - packages/cli/package.json (CLI tarball version)
 * - registry/latest.json
 * - registry/index.json
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

function readJson(relPath) {
	const fullPath = path.join(rootDir, relPath);
	return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function isIsoDate(value) {
	if (typeof value !== 'string') return false;
	const date = new Date(value);
	return !Number.isNaN(date.getTime()) && value.includes('T');
}

function isStableSemver(value) {
	return typeof value === 'string' && /^\d+\.\d+\.\d+$/.test(value);
}

function isSemver(value) {
	return typeof value === 'string' && /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(value);
}

function getWorkspaceVersionMismatches(expectedVersion) {
	const mismatches = [];
	const packagesDir = path.join(rootDir, 'packages');

	/** @type {string[]} */
	const roots = [packagesDir, path.join(packagesDir, 'faces'), path.join(packagesDir, 'shared')];

	for (const dir of roots) {
		if (!fs.existsSync(dir)) continue;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			const relDir = path.relative(rootDir, path.join(dir, entry.name));
			const packageJsonRel = path.join(relDir, 'package.json');
			const manifestRel = path.join(relDir, 'manifest.json');

			if (fs.existsSync(path.join(rootDir, packageJsonRel))) {
				const pkg = readJson(packageJsonRel);
				if (pkg?.version !== expectedVersion) {
					mismatches.push(
						`${packageJsonRel} version (${pkg?.version ?? 'missing'}) must match root (${expectedVersion})`
					);
				}
			}

			if (fs.existsSync(path.join(rootDir, manifestRel))) {
				const manifest = readJson(manifestRel);
				if (manifest?.version !== expectedVersion) {
					mismatches.push(
						`${manifestRel} version (${manifest?.version ?? 'missing'}) must match root (${expectedVersion})`
					);
				}
			}
		}
	}

	return mismatches;
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🔖 Validate Release Versions', colors.bold);
	log('='.repeat(60) + '\n', colors.bold);

	const rootPkg = readJson('package.json');
	const cliPkg = readJson('packages/cli/package.json');
	const latest = readJson('registry/latest.json');
	const index = readJson('registry/index.json');

	const version = rootPkg?.version;
	if (typeof version !== 'string' || !version.trim()) {
		log('❌ Invalid root version in package.json', colors.red);
		process.exit(1);
	}

	const expectedRef = `greater-v${version}`;
	const errors = [];

	if (cliPkg?.version !== version) {
		errors.push(
			`packages/cli/package.json version (${cliPkg?.version ?? 'missing'}) must match root (${version})`
		);
	}

	errors.push(...getWorkspaceVersionMismatches(version));

	if (index?.version !== version) {
		errors.push(
			`registry/index.json version (${index?.version ?? 'missing'}) must match root (${version})`
		);
	}

	if (index?.ref !== expectedRef) {
		errors.push(`registry/index.json ref (${index?.ref ?? 'missing'}) must be ${expectedRef}`);
	}

	// `registry/latest.json` is the *latest stable* release ref.
	if (isStableSemver(version)) {
		if (latest?.version !== version) {
			errors.push(
				`registry/latest.json version (${latest?.version ?? 'missing'}) must match root (${version})`
			);
		}

		if (latest?.ref !== expectedRef) {
			errors.push(`registry/latest.json ref (${latest?.ref ?? 'missing'}) must be ${expectedRef}`);
		}

		if (latest?.updatedAt && !isIsoDate(latest.updatedAt)) {
			errors.push(
				`registry/latest.json updatedAt is not a valid ISO timestamp: ${String(latest.updatedAt)}`
			);
		}
	} else {
		// When building a prerelease (e.g., `X.Y.Z-rc.N`), `latest.json` must remain on a stable tag.
		if (!isSemver(latest?.version)) {
			errors.push(`registry/latest.json version is not a valid semver: ${String(latest?.version)}`);
		} else if (!isStableSemver(latest.version)) {
			errors.push(
				`registry/latest.json must remain stable during prereleases (expected no '-' in version, got ${latest.version})`
			);
		}

		const latestExpectedRef = `greater-v${latest?.version ?? ''}`;
		if (latest?.ref !== latestExpectedRef) {
			errors.push(
				`registry/latest.json ref (${latest?.ref ?? 'missing'}) must be ${latestExpectedRef || 'greater-v<stable>'}`
			);
		}

		if (latest?.updatedAt && !isIsoDate(latest.updatedAt)) {
			errors.push(
				`registry/latest.json updatedAt is not a valid ISO timestamp: ${String(latest.updatedAt)}`
			);
		}
	}

	if (errors.length > 0) {
		log('❌ Release version validation FAILED', colors.red);
		errors.forEach((error) => log(`   - ${error}`, colors.red));
		log('\nFix by running:', colors.yellow);
		log(`  pnpm release:prepare ${version}`, colors.yellow);
		process.exit(1);
	}

	log(`✅ Release versions in sync (${version})`, colors.green);
	process.exit(0);
}

main();
