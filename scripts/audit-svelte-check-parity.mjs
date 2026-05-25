#!/usr/bin/env node
/**
 * Audit svelte-check Parity
 *
 * Enforces that every Svelte-containing workspace package is enumerated
 * in the root `package.json` `check:svelte` script AND has its own
 * `tsconfig.check.json`. Closes the structural gap that allowed issue
 * #679 (CommandPalette type collision) to ship in greater-v0.9.1-rc.1:
 * adding new top-level packages (`shell` from G0, `host-platform` from
 * G2) updated `CORE_PACKAGES` in `transform.ts` but missed the workspace
 * `check:svelte` script, so the packages were silently uncovered by the
 * workspace-level type-check gate.
 *
 * Discovery is canonical (derives from `packages/*` filesystem) — adding
 * a new Svelte-containing package will fail this audit on next CI run
 * until the script is updated.
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
const rootPackageJsonPath = path.join(rootDir, 'package.json');

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
 * Recursively walk a directory looking for `.svelte` files. Returns
 * true on first hit. Skips `node_modules`, `dist`, `tests`, and
 * anything under `__tests__`.
 */
function containsSvelteFiles(dir) {
	if (!fs.existsSync(dir)) return false;
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (
				entry.name === 'node_modules' ||
				entry.name === 'dist' ||
				entry.name === 'tests' ||
				entry.name === '__tests__'
			) {
				continue;
			}
			if (containsSvelteFiles(full)) return true;
		} else if (entry.isFile() && entry.name.endsWith('.svelte')) {
			return true;
		}
	}
	return false;
}

/**
 * Discover all workspace packages by walking `packages/<top>` and
 * `packages/{shared,faces}/<sub>` for `package.json` files. Returns an
 * array of `{ name, dirRelative, dirAbsolute }`. Excludes top-level
 * `greater-components` (barrel) and `testing` (no svelte source).
 */
function discoverPackages() {
	const found = [];
	const topEntries = fs.readdirSync(packagesDir, { withFileTypes: true });

	for (const entry of topEntries) {
		if (!entry.isDirectory()) continue;
		if (entry.name === 'greater-components') continue;
		if (entry.name === 'testing') continue;

		const topPath = path.join(packagesDir, entry.name);
		const topPkgJson = path.join(topPath, 'package.json');

		// Top-level package (e.g. `packages/primitives`)
		if (fs.existsSync(topPkgJson)) {
			found.push({
				name: entry.name,
				dirRelative: `packages/${entry.name}`,
				dirAbsolute: topPath,
			});
		}

		// Nested packages under `packages/{shared,faces}/<sub>`
		if (entry.name === 'shared' || entry.name === 'faces') {
			const subEntries = fs.readdirSync(topPath, { withFileTypes: true });
			for (const sub of subEntries) {
				if (!sub.isDirectory()) continue;
				const subPath = path.join(topPath, sub.name);
				const subPkgJson = path.join(subPath, 'package.json');
				if (fs.existsSync(subPkgJson)) {
					found.push({
						name: `${entry.name}/${sub.name}`,
						dirRelative: `packages/${entry.name}/${sub.name}`,
						dirAbsolute: subPath,
					});
				}
			}
		}
	}

	return found;
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🧪 Audit svelte-check Parity', colors.bold);
	log('='.repeat(60) + '\n');

	const allPackages = discoverPackages();
	const sveltePackages = allPackages.filter((pkg) =>
		containsSvelteFiles(path.join(pkg.dirAbsolute, 'src'))
	);

	log(`📦 Discovered ${allPackages.length} workspace packages`, colors.reset);
	log(`   ${sveltePackages.length} contain .svelte files in src/`, colors.reset);

	const rootPkg = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
	const checkSvelteCmd = rootPkg.scripts?.['check:svelte'] ?? '';

	const errors = [];

	for (const pkg of sveltePackages) {
		// Each Svelte-containing package must have its own
		// `tsconfig.check.json` and must be enumerated in the workspace
		// `check:svelte` script.
		const tsconfigPath = path.join(pkg.dirAbsolute, 'tsconfig.check.json');

		if (!fs.existsSync(tsconfigPath)) {
			errors.push(
				`${pkg.dirRelative}: missing tsconfig.check.json (required because src/ contains .svelte files)`
			);
		}

		// The script enumerates each package via `pnpm --dir <dir> exec
		// svelte-check ...`. Look for the exact `--dir <dir>` token.
		const expectedToken = `--dir ${pkg.dirRelative} `;
		if (!checkSvelteCmd.includes(expectedToken)) {
			errors.push(
				`${pkg.dirRelative}: not enumerated in root package.json scripts.check:svelte ` +
					`(expected to find "${expectedToken.trim()}" in the command chain)`
			);
		}
	}

	log('\n' + '='.repeat(60), colors.bold);
	if (errors.length > 0) {
		log('❌ svelte-check parity violations', colors.red + colors.bold);
		log('='.repeat(60) + '\n', colors.red);
		for (const err of errors) {
			log(`  • ${err}`, colors.red);
		}
		log(
			'\nFix by adding the missing tsconfig.check.json (copy from an existing package) ' +
				'AND/OR by appending the package to the root `check:svelte` script. Both must be ' +
				'in sync; the workspace CI gate (`.github/workflows/lint.yml` → `pnpm check:svelte`) ' +
				'depends on the script enumeration to actually run svelte-check on each package.\n',
			colors.yellow
		);
		process.exit(1);
	}

	log('✅ All Svelte-containing packages are properly gated', colors.green + colors.bold);
	log('='.repeat(60) + '\n', colors.green);
}

main();
