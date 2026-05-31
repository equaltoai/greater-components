#!/usr/bin/env node
/**
 * Audit pnpm-lock.yaml for preview tarballs and integrity-less package resolutions.
 *
 * Greater's source-install model relies on lockfile SRI for dependency provenance.
 * Preview-package services such as pkg.pr.new are intentionally mutable and must
 * not enter committed lockfiles; any package resolution block also needs a
 * sha512 integrity field so pnpm can verify fetched artifacts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LOCKFILE = process.env.LOCKFILE_PATH
	? path.resolve(process.env.LOCKFILE_PATH)
	: path.join(rootDir, 'pnpm-lock.yaml');
const DISALLOWED_TARBALL_RE = /pkg\.pr\.new/i;
const SHA512_INTEGRITY_RE = /\bintegrity:\s+sha512-[A-Za-z0-9+/]+=*/;

function packageSectionLines(lockfile) {
	const lines = lockfile.split('\n');
	const start = lines.findIndex((line) => line === 'packages:');
	if (start === -1) {
		throw new Error('pnpm-lock.yaml is missing a packages: section');
	}

	const end = lines.findIndex((line, index) => index > start && /^[^ \t].*:$/.test(line));
	return {
		lines: lines.slice(start + 1, end === -1 ? lines.length : end),
		startLineNumber: start + 2,
	};
}

function collectPackageBlocks(lines, startLineNumber) {
	const blocks = [];
	let current = null;

	for (const [index, line] of lines.entries()) {
		if (/^ {2}\S.*:$/.test(line)) {
			if (current) blocks.push(current);
			current = {
				key: line.trim().replace(/:$/, ''),
				lineNumber: startLineNumber + index,
				lines: [line],
			};
			continue;
		}

		current?.lines.push(line);
	}

	if (current) blocks.push(current);
	return blocks;
}

function main() {
	const lockfile = fs.readFileSync(LOCKFILE, 'utf8');
	const errors = [];

	const disallowedTarballLines = lockfile
		.split('\n')
		.map((line, index) => ({ line, lineNumber: index + 1 }))
		.filter(({ line }) => DISALLOWED_TARBALL_RE.test(line));

	for (const { line, lineNumber } of disallowedTarballLines) {
		errors.push(`pnpm-lock.yaml:${lineNumber}: disallowed pkg.pr.new reference: ${line.trim()}`);
	}

	const packageSection = packageSectionLines(lockfile);
	const packageBlocks = collectPackageBlocks(packageSection.lines, packageSection.startLineNumber);
	const resolutionBlocks = packageBlocks.filter(({ lines }) =>
		lines.some((line) => /^\s+resolution:/.test(line))
	);
	const missingIntegrityBlocks = resolutionBlocks.filter(
		({ lines }) => !SHA512_INTEGRITY_RE.test(lines.join('\n'))
	);

	for (const { key, lineNumber } of missingIntegrityBlocks) {
		errors.push(`pnpm-lock.yaml:${lineNumber}: ${key} resolution is missing sha512 integrity`);
	}

	if (errors.length > 0) {
		console.error('Lockfile integrity audit failed:');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log(
		`Lockfile integrity audit passed: no pkg.pr.new references; ${resolutionBlocks.length} package resolution blocks include sha512 integrity.`
	);
}

main();
