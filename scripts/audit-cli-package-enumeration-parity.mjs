#!/usr/bin/env node
/**
 * Audit CLI Package-Enumeration Parity
 *
 * Enforces that every top-level workspace package (parallel to
 * `packages/primitives`, NOT nested under `packages/{shared,faces}/`)
 * is enumerated in all three CLI files that hand-maintain
 * top-level-package lists:
 *
 *   1. packages/cli/src/utils/transform.ts:CORE_PACKAGES
 *   2. packages/cli/src/utils/dependency-resolver.ts:CORE_PACKAGE_NAMES
 *   3. packages/cli/src/utils/fetch.ts:CORE_PACKAGE_NAMES
 *
 * Closes the structural gap that allowed issue #674 to ship in
 * greater-v0.9.1-rc.0: adding `shell` (G0) and `host-platform` (G2)
 * updated transform.ts:CORE_PACKAGES but missed the matching sets in
 * dependency-resolver.ts and fetch.ts. The result: the CLI routed
 * `greater add shell --ref greater-v0.9.1-rc.0` into a non-existent
 * `packages/shared/shell/...` path tree and returned 404 for every
 * shell file.
 *
 * Discovery is canonical (derives from `packages/*` filesystem) —
 * adding a new top-level package will fail this audit on next CI run
 * until all three CLI files are updated.
 *
 * Part of Project 41 (#680) — workspace svelte-check parity restoration.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const TRANSFORM_TS = path.join(rootDir, 'packages/cli/src/utils/transform.ts');
const DEPENDENCY_RESOLVER_TS = path.join(rootDir, 'packages/cli/src/utils/dependency-resolver.ts');
const FETCH_TS = path.join(rootDir, 'packages/cli/src/utils/fetch.ts');

/**
 * Top-level packages that are NOT routed through the CLI as installable
 * components and therefore SHOULDN'T appear in the CLI enumerations.
 * `greater-components` is the root barrel; `cli` is the CLI itself;
 * `testing` is Vitest fixtures; `shared` and `faces` are nested-package
 * containers (their nested subpackages are listed under different CLI
 * sets — faces under faceRegistry, shared modules under sharedRegistry).
 */
const NON_CORE_TOP_LEVEL_PACKAGES = new Set([
	'greater-components',
	'cli',
	'testing',
	'shared',
	'faces',
]);

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

/**
 * Discover top-level workspace packages — those that live at
 * `packages/<name>/package.json`, parallel to `primitives`, `icons`,
 * etc. Excludes nested subpackages under `packages/{shared,faces}/`.
 */
function discoverTopLevelPackages() {
	const found = [];
	const entries = fs.readdirSync(packagesDir, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		if (NON_CORE_TOP_LEVEL_PACKAGES.has(entry.name)) continue;

		const pkgJson = path.join(packagesDir, entry.name, 'package.json');
		if (!fs.existsSync(pkgJson)) continue;

		found.push(entry.name);
	}

	return found;
}

/**
 * Look for `'<name>'` (single-quoted string literal) within a file's
 * contents. The CLI source uses single-quoted strings for these
 * enumerations; widening the check (e.g. allow double-quoted) is a
 * future concern if the codebase style changes.
 */
function fileContainsQuotedName(filePath, name) {
	if (!fs.existsSync(filePath)) {
		throw new Error(`Audit can't find ${filePath}; CLI source layout changed?`);
	}
	const contents = fs.readFileSync(filePath, 'utf8');
	return contents.includes(`'${name}'`);
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🧱 Audit CLI Package-Enumeration Parity', colors.bold);
	log('='.repeat(60) + '\n');

	const topLevelPackages = discoverTopLevelPackages();
	log(`📦 Discovered ${topLevelPackages.length} top-level workspace packages:`, colors.reset);
	for (const name of topLevelPackages) {
		log(`   • ${name}`);
	}

	const enumerationSites = [
		{
			file: TRANSFORM_TS,
			label: 'packages/cli/src/utils/transform.ts:CORE_PACKAGES',
		},
		{
			file: DEPENDENCY_RESOLVER_TS,
			label: 'packages/cli/src/utils/dependency-resolver.ts:CORE_PACKAGE_NAMES',
		},
		{
			file: FETCH_TS,
			label: 'packages/cli/src/utils/fetch.ts:CORE_PACKAGE_NAMES',
		},
	];

	const errors = [];

	for (const pkg of topLevelPackages) {
		for (const site of enumerationSites) {
			if (!fileContainsQuotedName(site.file, pkg)) {
				errors.push(
					`${pkg}: not enumerated in ${site.label} ` +
						`(expected to find '${pkg}' as a string literal in the file)`
				);
			}
		}
	}

	log('\n' + '='.repeat(60), colors.bold);
	if (errors.length > 0) {
		log('❌ CLI package-enumeration parity violations', colors.red + colors.bold);
		log('='.repeat(60) + '\n', colors.red);
		for (const err of errors) {
			log(`  • ${err}`, colors.red);
		}
		log(
			"\nFix by adding the package's name to all four single-source-of-truth " +
				'enumeration sites:\n' +
				'  • packages/cli/src/utils/transform.ts:CORE_PACKAGES (array)\n' +
				'  • packages/cli/src/utils/dependency-resolver.ts:CORE_PACKAGE_NAMES (Set)\n' +
				'  • packages/cli/src/utils/fetch.ts:CORE_PACKAGE_NAMES (Set)\n' +
				'  • package.json scripts.check:svelte\n' +
				'    (enforced separately by audit-svelte-check-parity.mjs)\n' +
				'\nAll four must stay in lockstep. See PR #675 (issue #674 fix) for ' +
				'the discovery story.\n',
			colors.yellow
		);
		process.exit(1);
	}

	log('✅ All top-level packages enumerated in every CLI site', colors.green + colors.bold);
	log('='.repeat(60) + '\n', colors.green);
}

main();
