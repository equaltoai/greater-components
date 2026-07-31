#!/usr/bin/env node
/**
 * Audit CLI Registry Script
 *
 * Two audits, because there are two registries and only one of them was checked.
 *
 * 1. GENERATED registry (`registry/index.json`) — the checksum manifest the CLI
 *    verifies against. Validates that its paths resolve to real source files.
 *
 * 2. EXECUTABLE catalog (`packages/cli/src/registry/*.ts`) — the hand-maintained
 *    metadata that actually drives `greater add`: which files an entry installs,
 *    where they land, and which other entries must come with them. Nothing
 *    checked this against the generated registry, which is how `greater add
 *    review` came to produce a *checksum-valid but broken* install: the files
 *    were enumerated and their checksums verified, but `Review` was missing from
 *    `transform.ts:BLOG_COMPONENT_ROOTS`, so the installed components kept
 *    `../../types.js` imports that resolve to nothing.
 *
 * The second audit fails on a wrong path, an undeclared dependency, a typoed
 * dependency, and a face component directory missing from the transform's
 * install-layout rewrite list.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const registryPath = path.join(rootDir, 'registry', 'index.json');

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
 * Loads the hand-maintained catalog by transpiling it into a temp dir and
 * importing it. The catalog is a pure data module — its only runtime imports
 * are its three siblings — so this needs no bundler and no build step, and it
 * reads the *source of truth* rather than a possibly-stale `dist/`.
 */
async function loadExecutableCatalog() {
	const sources = [
		'src/registry/index.ts',
		'src/registry/shared.ts',
		'src/registry/patterns.ts',
		'src/registry/faces.ts',
		'src/utils/source-paths.ts',
	];

	const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'greater-cli-catalog-'));

	for (const relative of sources) {
		const absolute = path.join(rootDir, 'packages/cli', relative);
		if (!fs.existsSync(absolute)) {
			throw new Error(`CLI catalog source missing: ${relative} (CLI source layout changed?)`);
		}

		const { outputText } = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
			compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
			fileName: absolute,
		});

		const destination = path.join(outDir, relative.replace(/\.ts$/, '.js'));
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, outputText);
	}

	const catalog = await import(pathToFileURL(path.join(outDir, 'src/registry/index.js')).href);
	const sourcePaths = await import(
		pathToFileURL(path.join(outDir, 'src/utils/source-paths.js')).href
	);

	fs.rmSync(outDir, { recursive: true, force: true });

	return { catalog, buildSourcePathCandidates: sourcePaths.buildSourcePathCandidates };
}

/** Reads a `new Set([...])` string-literal enumeration out of a TS source file. */
function readSetLiteral(filePath, identifier) {
	const contents = fs.readFileSync(filePath, 'utf8');
	const match = contents.match(
		new RegExp(`${identifier}\\s*(?::[^=]+)?=\\s*new Set\\(\\s*\\[([^\\]]*)\\]`)
	);

	if (!match?.[1]) {
		throw new Error(`Could not read ${identifier} from ${path.relative(rootDir, filePath)}`);
	}

	return new Set([...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((entry) => entry[1]));
}

/** Import specifiers referenced by a source file. */
function readImportSpecifiers(filePath) {
	const contents = fs.readFileSync(filePath, 'utf8');
	const specifiers = [];
	const patterns = [
		/(?:^|[;\n\r])\s*import\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*export\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?<![\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
	];

	for (const pattern of patterns) {
		let match;
		while ((match = pattern.exec(contents)) !== null) {
			if (match[2]) specifiers.push(match[2]);
		}
	}

	return specifiers;
}

/**
 * Faces whose `src/types.ts` / `src/share.ts` install under a face-scoped name
 * (`lib/<face>-types.ts`), which is what makes the transform's relative-import
 * rewrite necessary in the first place.
 */
const FACE_SCOPED_DOMAINS = ['social', 'blog', 'community', 'artist', 'agent'];

async function auditExecutableCatalog(registry) {
	const errors = [];
	const { catalog, buildSourcePathCandidates } = await loadExecutableCatalog();

	const registries = {
		component: catalog.componentRegistry ?? {},
		shared: catalog.sharedModuleRegistry ?? {},
		pattern: catalog.patternRegistry ?? {},
		face: catalog.faceRegistry ?? {},
	};

	// Every name any entry may legitimately depend on.
	const knownNames = new Set(Object.values(registries).flatMap((entries) => Object.keys(entries)));

	// Flat view across all four registries, for dependency-closure walking.
	const allEntries = Object.assign({}, ...Object.values(registries));

	/**
	 * Everything an install of `name` pulls in, transitively — which is what
	 * `dependency-resolver.ts` does. A dependency satisfied through an
	 * intermediate entry is genuinely present in the consumer's tree, so only a
	 * name missing from the whole closure is a real omission.
	 */
	const closureCache = new Map();
	function dependencyClosure(name) {
		const cached = closureCache.get(name);
		if (cached) return cached;

		const seen = new Set();
		const queue = [...(allEntries[name]?.registryDependencies ?? [])];

		while (queue.length > 0) {
			const next = queue.shift();
			if (seen.has(next)) continue;
			seen.add(next);
			queue.push(...(allEntries[next]?.registryDependencies ?? []));
		}

		closureCache.set(name, seen);
		return seen;
	}

	const checksums = registry.checksums ?? {};
	let entriesChecked = 0;
	let filesChecked = 0;

	// Records, per face, which component directories the catalog actually ships.
	const shippedComponentDirs = new Map();

	for (const [registryName, entries] of Object.entries(registries)) {
		for (const [name, entry] of Object.entries(entries)) {
			if (!entry || !Array.isArray(entry.files)) continue;
			entriesChecked++;

			// --- typoed / unknown dependency -----------------------------------
			for (const dependency of entry.registryDependencies ?? []) {
				if (!knownNames.has(dependency)) {
					errors.push(
						`[catalog:${registryName}] ${name}: registryDependencies names '${dependency}', ` +
							`which is not an entry in any CLI registry`
					);
				}
			}

			const installed = dependencyClosure(name);

			for (const file of entry.files) {
				const virtualPath = typeof file === 'string' ? file : file?.path;
				if (!virtualPath) continue;
				filesChecked++;

				// --- wrong path -------------------------------------------------
				// The CLI resolves an entry's virtual path against the generated
				// registry's checksum map. A path that resolves nowhere in that map
				// is a 404 at install time, however real it looks.
				const candidates = buildSourcePathCandidates(entry, virtualPath);
				const resolved = candidates.find((candidate) => checksums[candidate]);

				if (!resolved) {
					const onDisk = candidates.find((candidate) =>
						fs.existsSync(path.join(rootDir, candidate))
					);
					errors.push(
						`[catalog:${registryName}] ${name}: '${virtualPath}' resolves to no checksummed ` +
							`source` +
							(onDisk
								? ` (${onDisk} exists but is not in registry/index.json — regenerate the registry)`
								: ` (tried: ${candidates.slice(0, 3).join(', ')})`)
					);
					continue;
				}

				// Track blog/social/... component directories for the transform check.
				const faceComponentMatch = resolved.match(
					/^packages\/faces\/([^/]+)\/src\/components\/([^/]+)\//
				);
				if (faceComponentMatch) {
					const [, face, dir] = faceComponentMatch;
					if (!shippedComponentDirs.has(face)) shippedComponentDirs.set(face, new Set());
					shippedComponentDirs.get(face).add(dir);
				}

				// --- omitted dependency ------------------------------------------
				// A file that imports the face's `types` / `share` module only works
				// once that module is installed too, i.e. declared as a dependency.
				const absolute = path.join(rootDir, resolved);
				if (!fs.existsSync(absolute)) continue;

				const faceMatch = resolved.match(/^packages\/faces\/([^/]+)\/src\//);
				if (!faceMatch || !FACE_SCOPED_DOMAINS.includes(faceMatch[1])) continue;
				const face = faceMatch[1];

				for (const specifier of readImportSpecifiers(absolute)) {
					if (!specifier.startsWith('.')) continue;

					const bare = specifier.replace(/\.(js|ts)$/, '');
					const required = bare.endsWith('/types')
						? `${face}-types`
						: bare.endsWith('/share')
							? `${face}-share`
							: null;

					if (required && knownNames.has(required) && !installed.has(required)) {
						errors.push(
							`[catalog:${registryName}] ${name}: ${resolved} imports '${specifier}', but ` +
								`'${required}' is not in this entry's registryDependencies closure — the ` +
								`install would be missing it`
						);
					}
				}
			}
		}
	}

	// --- install-layout rewrite coverage ------------------------------------
	// This is the check that would have caught the `greater add review` break.
	// `transform.ts` rewrites `../../types` -> `../../blog-types` only for
	// directories it knows about; a shipped directory that is missing from the
	// set installs files whose imports resolve to nothing.
	const transformPath = path.join(rootDir, 'packages/cli/src/utils/transform.ts');
	const blogRoots = readSetLiteral(transformPath, 'BLOG_COMPONENT_ROOTS');

	for (const dir of shippedComponentDirs.get('blog') ?? []) {
		if (!blogRoots.has(dir)) {
			errors.push(
				`[catalog:transform] blog face ships components/${dir}/ but ` +
					`transform.ts:BLOG_COMPONENT_ROOTS omits '${dir}' — vendored files there keep ` +
					`'../../types.js' imports while blog-types installs as 'lib/blog-types.ts', ` +
					`producing a checksum-valid but broken install`
			);
		}
	}

	log(
		`\n🧾 Executable catalog: ${entriesChecked} entries, ${filesChecked} files, ` +
			`${blogRoots.size} blog transform roots`,
		colors.reset
	);

	return errors;
}

async function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('📚 Audit CLI Registry', colors.bold);
	log('='.repeat(60) + '\n');

	if (!fs.existsSync(registryPath)) {
		log(`❌ Registry index not found: ${registryPath}`, colors.red);
		log('   Please run `pnpm generate-registry` first.', colors.yellow);
		process.exit(1);
	}

	let registry;
	try {
		registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
	} catch (e) {
		log(`❌ Failed to parse registry index: ${e.message}`, colors.red);
		process.exit(1);
	}

	const errors = [];
	let checkedCount = 0;

	const sectionBaseDirs = {
		components: (key) => path.join(rootDir, 'packages', key),
		faces: (key) => path.join(rootDir, 'packages', 'faces', key),
		shared: (key) => path.join(rootDir, 'packages', 'shared', key),
	};

	const checkSection = (sectionName, items, getBaseDir) => {
		if (!items) return;

		for (const [key, item] of Object.entries(items)) {
			if (!item?.files || !Array.isArray(item.files)) continue;

			const baseDir = getBaseDir(key);

			for (const file of item.files) {
				const filePath = typeof file === 'string' ? file : file.path;
				if (!filePath) continue;

				const fullPath = path.join(baseDir, filePath);
				if (!fs.existsSync(fullPath)) {
					errors.push(
						`[${sectionName}] ${key}: File not found: ${path.relative(rootDir, fullPath)}`
					);
				}
				checkedCount++;
			}
		}
	};

	checkSection('components', registry.components, sectionBaseDirs.components);
	checkSection('faces', registry.faces, sectionBaseDirs.faces);
	checkSection('shared', registry.shared, sectionBaseDirs.shared);

	// Also check checksums keys as they are direct file paths
	if (registry.checksums) {
		for (const filePath of Object.keys(registry.checksums)) {
			const fullPath = path.join(rootDir, filePath);
			if (!fs.existsSync(fullPath)) {
				errors.push(`[checksums] File not found: ${filePath}`);
			}
			checkedCount++;
		}
	}

	errors.push(...(await auditExecutableCatalog(registry)));

	if (errors.length > 0) {
		// Deduplicate errors
		const uniqueErrors = [...new Set(errors)];
		log(`\n❌ Registry audit FAILED`, colors.red);
		uniqueErrors.forEach((err) => log(`   - ${err}`, colors.red));
		process.exit(1);
	} else {
		log(
			`\n✅ Registry audit PASSED (${checkedCount} generated-registry files verified, ` +
				`executable catalog in parity)`,
			colors.green
		);
		process.exit(0);
	}
}

main().catch((error) => {
	log(`❌ Registry audit could not run: ${error.message}`, colors.red);
	process.exit(1);
});
