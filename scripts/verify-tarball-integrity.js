#!/usr/bin/env node
/**
 * Verify direct GitHub release tarball dependencies are pinned with SRI.
 *
 * The lockfile is the install-time integrity gate, while package.json's
 * `greaterVerifiedTarballs` map makes the human-reviewed dependency pin
 * auditable before pnpm materializes the lock entry.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PACKAGE_JSON = path.join(rootDir, 'package.json');
const LOCKFILE = path.join(rootDir, 'pnpm-lock.yaml');
const GITHUB_RELEASE_TARBALL_RE =
	/^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/[^#\s]+\/[^#\s]+\.t(?:ar\.)?gz(?:#(?<integrity>sha512-[A-Za-z0-9+/]+=*))?$/;
const SRI_RE = /^sha512-[A-Za-z0-9+/]+=*$/;

function collectDependencySpecs(pkg) {
	return {
		...(pkg.dependencies ?? {}),
		...(pkg.devDependencies ?? {}),
		...(pkg.optionalDependencies ?? {}),
	};
}

function findLockBlock(lockfile, spec) {
	const packagesStart = lockfile.indexOf('\npackages:\n');
	if (packagesStart === -1) return null;
	const snapshotsStart = lockfile.indexOf('\nsnapshots:\n', packagesStart);
	const packagesText = lockfile.slice(
		packagesStart,
		snapshotsStart === -1 ? lockfile.length : snapshotsStart
	);

	const lineStart = packagesText
		.split('\n')
		.find((line) => line.startsWith('  ') && !line.startsWith('    ') && line.includes(spec));

	if (!lineStart) return null;

	const keyIndex = lockfile.indexOf(lineStart, packagesStart);
	const start = keyIndex + lineStart.length + 1;
	const next = /\n\s{2}\S/g;
	next.lastIndex = start;
	const nextMatch = next.exec(lockfile);
	return lockfile.slice(start, nextMatch?.index ?? lockfile.length);
}

function main() {
	const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
	const lockfile = fs.readFileSync(LOCKFILE, 'utf8');
	const deps = collectDependencySpecs(pkg);
	const verifiedTarballs = pkg.greaterVerifiedTarballs ?? {};
	const errors = [];
	let checked = 0;

	for (const [name, spec] of Object.entries(deps)) {
		if (typeof spec !== 'string') continue;
		const match = GITHUB_RELEASE_TARBALL_RE.exec(spec);
		if (!match) continue;

		checked += 1;
		const embeddedIntegrity = match.groups?.integrity;
		const verification = verifiedTarballs[name];
		const integrity = verification?.integrity;

		if (embeddedIntegrity) {
			errors.push(
				`${name}: keep the dependency URL fragment-free; record SRI in greaterVerifiedTarballs so pnpm store paths stay bounded`
			);
		}

		if (!verification || verification.url !== spec) {
			errors.push(`${name}: greaterVerifiedTarballs entry must match the dependency URL`);
			continue;
		}

		if (!integrity || !SRI_RE.test(integrity)) {
			errors.push(`${name}: greaterVerifiedTarballs entry must include a sha512 integrity value`);
			continue;
		}

		if (!lockfile.includes(`specifier: ${spec}`)) {
			errors.push(`${name}: pnpm-lock.yaml importer specifier does not match package.json`);
		}

		const block = findLockBlock(lockfile, spec);
		if (!block) {
			errors.push(`${name}: pnpm-lock.yaml is missing a package block for the exact tarball spec`);
			continue;
		}

		if (!block.includes(`integrity: ${integrity}`)) {
			errors.push(`${name}: pnpm-lock.yaml resolution integrity does not match package.json SRI`);
		}

		if (!block.includes(`tarball: ${spec}`)) {
			errors.push(
				`${name}: pnpm-lock.yaml resolution tarball does not preserve the SRI-pinned URL`
			);
		}
	}

	if (errors.length > 0) {
		console.error('GitHub release tarball integrity verification failed:');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log(`GitHub release tarball integrity verified (${checked} checked).`);
}

main();
