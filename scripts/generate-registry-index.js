#!/usr/bin/env node
/**
 * Registry Index Generation Script
 *
 * Generates the registry-index.json file containing metadata and checksums
 * for all distributable components in Greater Components.
 *
 * Usage:
 *   node scripts/generate-registry-index.js [options]
 *
 * Options:
 *   --dry-run     Print output without writing file
 *   --validate    Validate existing registry index
 *   --verbose     Enable verbose logging
 */

import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const SCHEMA_VERSION = '1.0.0';
const OUTPUT_PATH = path.join(rootDir, 'registry', 'index.json');
const PACKAGES_DIR = path.join(rootDir, 'packages');

// Package directories to scan (matching actual project structure)
const PACKAGE_CONFIGS = {
	primitives: {
		type: 'primitives',
		srcDir: 'src',
		extensions: ['.svelte', '.ts', '.js', '.css', '.png'],
	},
	headless: {
		type: 'primitives',
		srcDir: 'src',
		extensions: ['.ts', '.js'],
	},
	icons: {
		type: 'primitives',
		srcDir: 'src',
		extensions: ['.svelte', '.ts'],
	},
	tokens: {
		type: 'utilities',
		srcDir: 'src',
		extensions: ['.css', '.ts', '.js', '.json'],
	},
	utils: {
		type: 'utilities',
		srcDir: 'src',
		extensions: ['.svelte', '.ts', '.js'],
	},
	adapters: {
		type: 'adapters',
		srcDir: 'src',
		extensions: ['.ts', '.js'],
	},
	content: {
		type: 'utilities',
		srcDir: 'src',
		extensions: ['.svelte', '.ts', '.js'],
	},
	fediverse: {
		type: 'components',
		srcDir: 'src',
		extensions: ['.svelte', '.ts', '.js'],
	},
};

// Faces to scan (under packages/faces/)
const FACES = ['social', 'blog', 'community', 'artist'];

// Shared modules to scan (under packages/shared/)
const SHARED_MODULES = ['auth', 'compose', 'notifications', 'search', 'admin', 'chat', 'messaging'];

// Colors for terminal output
const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

function logVerbose(message, verbose) {
	if (verbose) {
		console.log(`  ${colors.cyan}→${colors.reset} ${message}`);
	}
}

/**
 * Compute SHA-256 checksum in SRI format
 */
function computeChecksum(content) {
	const hash = createHash('sha256');
	hash.update(content);
	return `sha256-${hash.digest('base64')}`;
}

/**
 * Extract imports from file content
 */
function extractImports(content) {
	const imports = new Set();

	// Static imports
	const importFromRegex = /^\s*import\s+(?:type\s+)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm;
	// Side-effect imports
	const importSideEffectRegex = /^\s*import\s+['"]([^'"]+)['"]/gm;
	// Export from
	const exportFromRegex =
		/^\s*export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s*from\s+['"]([^'"]+)['"]/gm;
	// Dynamic imports
	const dynamicImportRegex = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

	let match;
	while ((match = importFromRegex.exec(content)) !== null) {
		imports.add(match[1]);
	}
	while ((match = importSideEffectRegex.exec(content)) !== null) {
		imports.add(match[1]);
	}
	while ((match = exportFromRegex.exec(content)) !== null) {
		imports.add(match[1]);
	}
	while ((match = dynamicImportRegex.exec(content)) !== null) {
		imports.add(match[1]);
	}

	return Array.from(imports);
}

/**
 * Analyze directory for external dependencies
 */
function analyzeDependencies(dir, extensions) {
	const externalDeps = new Set();
	const files = getFilesRecursive(dir, extensions);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const content = fs.readFileSync(fullPath, 'utf8');
		const imports = extractImports(content);

		for (const imp of imports) {
			if (imp.startsWith('.') || imp.startsWith('/')) continue;
			if (builtinModules.includes(imp) || imp.startsWith('node:')) continue;
			// Skip Svelte internals as they are implicit peer deps usually
			if (imp === 'svelte' || imp.startsWith('svelte/')) continue;

			// Handle scoped packages
			let pkgName = imp;
			if (imp.startsWith('@')) {
				const parts = imp.split('/');
				if (parts.length >= 2) pkgName = `${parts[0]}/${parts[1]}`;
			} else {
				const parts = imp.split('/');
				if (parts.length >= 1) pkgName = parts[0];
			}

			externalDeps.add(pkgName);
		}
	}

	return Array.from(externalDeps).sort();
}

/**
 * Get Git ref (tag or commit)
 */
function getGitRef() {
	try {
		// Try to get the current tag
		const tag = execSync('git describe --tags --exact-match 2>/dev/null', {
			encoding: 'utf8',
			cwd: rootDir,
		}).trim();
		return tag;
	} catch {
		// Fall back to commit SHA
		try {
			const commit = execSync('git rev-parse HEAD', {
				encoding: 'utf8',
				cwd: rootDir,
			}).trim();
			return commit.substring(0, 12);
		} catch {
			return 'unknown';
		}
	}
}

/**
 * Read package.json version
 */
function getVersion() {
	const packageJsonPath = path.join(rootDir, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	return packageJson.version;
}

/**
 * Recursively get all files matching extensions
 */
function getFilesRecursive(dir, extensions, basePath = '') {
	const files = [];

	if (!fs.existsSync(dir)) {
		return files;
	}

	const entries = fs
		.readdirSync(dir, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name));

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.join(basePath, entry.name);

		if (entry.isDirectory()) {
			// Skip test directories and node_modules
			if (entry.name === 'tests' || entry.name === 'node_modules' || entry.name === '__tests__') {
				continue;
			}
			files.push(...getFilesRecursive(fullPath, extensions, relativePath));
		} else if (entry.isFile()) {
			const ext = path.extname(entry.name);
			if (extensions.includes(ext)) {
				files.push(relativePath);
			}
		}
	}

	return files;
}

/**
 * Process files and compute checksums
 */
function processFiles(packageDir, srcDir, extensions, verbose) {
	const srcPath = path.join(packageDir, srcDir);
	const files = getFilesRecursive(srcPath, extensions);
	const result = [];

	for (const file of files) {
		const fullPath = path.join(srcPath, file);
		const content = fs.readFileSync(fullPath);
		const checksum = computeChecksum(content);
		const stats = fs.statSync(fullPath);

		result.push({
			path: path.join(srcDir, file).replace(/\\/g, '/'),
			checksum,
			size: stats.size,
		});

		logVerbose(`${file} → ${checksum.substring(0, 20)}...`, verbose);
	}

	return result;
}

/**
 * Collect versions of all workspace packages
 */
function getPackageVersions() {
	const versions = {};

	// Core packages
	for (const pkgName of Object.keys(PACKAGE_CONFIGS)) {
		const p = path.join(PACKAGES_DIR, pkgName, 'package.json');
		if (fs.existsSync(p)) {
			const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
			versions[pkg.name] = pkg.version;
		}
	}

	// Faces
	for (const face of FACES) {
		const p = path.join(PACKAGES_DIR, 'faces', face, 'package.json');
		if (fs.existsSync(p)) {
			const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
			versions[pkg.name] = pkg.version;
		}
	}

	// Shared
	for (const mod of SHARED_MODULES) {
		const p = path.join(PACKAGES_DIR, 'shared', mod, 'package.json');
		if (fs.existsSync(p)) {
			const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
			versions[pkg.name] = pkg.version;
		}
	}

	return versions;
}

/**
 * Read manifest.json if it exists
 */
function readManifest(manifestPath) {
	if (fs.existsSync(manifestPath)) {
		return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
	}
	return null;
}

/**
 * Resolve dependency version from package.json
 */
function resolveDependencyVersion(depName, packageJson, workspaceVersions) {
	if (!packageJson) return 'latest';

	const allDeps = {
		...packageJson.dependencies,
		...packageJson.peerDependencies,
		...packageJson.devDependencies,
	};

	let version = allDeps[depName] || 'latest';

	if (version.startsWith('workspace:')) {
		if (workspaceVersions && workspaceVersions[depName]) {
			return workspaceVersions[depName];
		}
		console.warn(`[WARN] Could not resolve workspace version for ${depName}`);
		return 'latest';
	}

	return version;
}

/**
 * Map dependency names to objects with versions
 */
function mapDependencies(depNames, packageJson, workspaceVersions) {
	return depNames.map((name) => ({
		name,
		version: resolveDependencyVersion(name, packageJson, workspaceVersions),
	}));
}

/**
 * Process a package and extract component metadata
 */
function processPackage(packageName, config, verbose, workspaceVersions) {
	const packageDir = path.join(PACKAGES_DIR, packageName);
	const packageJsonPath = path.join(packageDir, 'package.json');

	if (!fs.existsSync(packageJsonPath)) {
		log(`  ⚠️  Skipping ${packageName}: package.json not found`, colors.yellow);
		return null;
	}

	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const files = processFiles(packageDir, config.srcDir, config.extensions, verbose);

	// Analyze actual used dependencies from source
	const detectedDeps = analyzeDependencies(path.join(packageDir, config.srcDir), config.extensions);

	// Filter for internal dependencies (Greater components)
	const internalDeps = detectedDeps.filter(
		(dep) => dep.startsWith('@equaltoai/greater-components') && dep !== packageJson.name
	);

	// Filter for external dependencies (everything else)
	// We merge detected external deps with declared ones to be safe
	const externalDepsNames = new Set([
		...Object.keys(packageJson.dependencies || {}),
		...Object.keys(packageJson.peerDependencies || {}),
		...detectedDeps.filter((dep) => !dep.startsWith('@equaltoai/greater-components')),
	]);

	return {
		name: packageName,
		version: packageJson.version,
		description: packageJson.description || '',
		type: config.type,
		files,
		dependencies: internalDeps.map((dep) => ({
			name: dep.replace('@equaltoai/greater-components-', ''),
			version: resolveDependencyVersion(dep, packageJson, workspaceVersions),
		})),
		peerDependencies: mapDependencies(
			Array.from(externalDepsNames),
			packageJson,
			workspaceVersions
		),
		tags: packageJson.keywords || [],
	};
}

/**
 * Process a face package
 */
function processFace(faceName, verbose, workspaceVersions) {
	const faceDir = path.join(PACKAGES_DIR, 'faces', faceName);
	const manifestPath = path.join(faceDir, 'manifest.json');
	const packageJsonPath = path.join(faceDir, 'package.json');

	const manifest = readManifest(manifestPath);
	if (!manifest) {
		log(`  ⚠️  Skipping face ${faceName}: manifest.json not found`, colors.yellow);
		return null;
	}

	// Get version from package.json if it exists, otherwise from manifest
	let version = manifest.version;
	let declaredDeps = [];
	let packageJson = {};

	if (fs.existsSync(packageJsonPath)) {
		packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		version = packageJson.version || version;
		declaredDeps = [
			...Object.keys(packageJson.dependencies || {}),
			...Object.keys(packageJson.peerDependencies || {}),
		];
	}

	// Process source files
	const extensions = ['.svelte', '.ts', '.js', '.css'];
	const files = processFiles(faceDir, 'src', extensions, verbose);

	// Analyze actual used dependencies from source
	const detectedDeps = analyzeDependencies(path.join(faceDir, 'src'), extensions);

	// Combine declared and detected external deps
	const externalDeps = new Set([
		...declaredDeps,
		...detectedDeps.filter((dep) => !dep.startsWith('@equaltoai/greater-components')),
	]);

	// Internal dependencies often come from manifest, but we can verify with detected ones
	const internalDeps = new Set([
		...(manifest.dependencies?.internal || []),
		...detectedDeps.filter((dep) => dep.startsWith('@equaltoai/greater-components')),
	]);

	// Filter self-dependency if packageJson has name
	const filteredInternalDeps = Array.from(internalDeps).filter((dep) => dep !== packageJson.name);

	return {
		name: faceName,
		version,
		description: manifest.description,
		includes: {
			primitives: Object.keys(manifest.components || {}).filter(
				(c) => manifest.components[c].subcomponents === undefined
			),
			shared: filteredInternalDeps
				.map((dep) => dep.replace('@equaltoai/greater-components-', ''))
				.filter((name) => !name.startsWith('@equaltoai/greater-components')), // Clean up any misses
			patterns: [],
			components: Object.keys(manifest.components || {}),
		},
		files,
		styles: {
			main: `@equaltoai/greater-components/faces/${faceName}/style.css`,
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		dependencies: filteredInternalDeps.sort().map((dep) => ({
			name: dep.replace('@equaltoai/greater-components-', ''),
			version: resolveDependencyVersion(dep, packageJson, workspaceVersions),
		})),
		peerDependencies: mapDependencies(
			Array.from(externalDeps).sort(),
			packageJson,
			workspaceVersions
		),
	};
}

/**
 * Process a shared module
 */
function processSharedModule(moduleName, verbose, workspaceVersions) {
	const moduleDir = path.join(PACKAGES_DIR, 'shared', moduleName);
	const manifestPath = path.join(moduleDir, 'manifest.json');
	const packageJsonPath = path.join(moduleDir, 'package.json');

	const manifest = readManifest(manifestPath);
	if (!manifest) {
		log(`  ⚠️  Skipping shared module ${moduleName}: manifest.json not found`, colors.yellow);
		return null;
	}

	let declaredDeps = [];
	let packageJson = {};

	if (fs.existsSync(packageJsonPath)) {
		packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		declaredDeps = [
			...Object.keys(packageJson.dependencies || {}),
			...Object.keys(packageJson.peerDependencies || {}),
		];
	}

	// Process source files
	const extensions = ['.svelte', '.ts', '.js'];
	const files = processFiles(moduleDir, 'src', extensions, verbose);

	// Analyze actual used dependencies from source
	const detectedDeps = analyzeDependencies(path.join(moduleDir, 'src'), extensions);

	const externalDeps = new Set([
		...declaredDeps,
		...detectedDeps.filter((dep) => !dep.startsWith('@equaltoai/greater-components')),
	]);

	const internalDeps = new Set([
		...(manifest.dependencies?.internal || []),
		...detectedDeps.filter((dep) => dep.startsWith('@equaltoai/greater-components')),
	]);

	// Filter self-dependency
	const filteredInternalDeps = Array.from(internalDeps).filter((dep) => dep !== packageJson.name);

	return {
		name: moduleName,
		version: manifest.version,
		description: manifest.description,
		exports: Object.keys(manifest.components || {}),
		files,
		dependencies: filteredInternalDeps.sort().map((dep) => ({
			name: dep.replace('@equaltoai/greater-components-', ''),
			version: resolveDependencyVersion(dep, packageJson, workspaceVersions),
		})),
		peerDependencies: mapDependencies(
			Array.from(externalDeps).sort(),
			packageJson,
			workspaceVersions
		),
		types: manifest.types || [],
	};
}

/**
 * Build the complete checksums map
 */
function buildChecksumsMap(components, faces, shared) {
	const checksums = {};

	// Add component file checksums
	for (const [name, component] of Object.entries(components)) {
		for (const file of component.files) {
			const key = `packages/${name}/${file.path}`;
			checksums[key] = file.checksum;
		}
	}

	// Add face file checksums
	for (const [name, face] of Object.entries(faces)) {
		for (const file of face.files) {
			const key = `packages/faces/${name}/${file.path}`;
			checksums[key] = file.checksum;
		}
	}

	// Add shared module file checksums
	for (const [name, module] of Object.entries(shared)) {
		for (const file of module.files) {
			const key = `packages/shared/${name}/${file.path}`;
			checksums[key] = file.checksum;
		}
	}

	return checksums;
}

/**
 * Validate registry index against schema
 */
function validateRegistryIndex(index) {
	const errors = [];

	// Check required fields
	const requiredFields = [
		'schemaVersion',
		'generatedAt',
		'ref',
		'version',
		'checksums',
		'components',
		'faces',
		'shared',
	];
	for (const field of requiredFields) {
		if (!(field in index)) {
			errors.push(`Missing required field: ${field}`);
		}
	}

	// Validate schemaVersion
	if (index.schemaVersion !== SCHEMA_VERSION) {
		errors.push(`Invalid schemaVersion: expected ${SCHEMA_VERSION}, got ${index.schemaVersion}`);
	}

	// Validate generatedAt is ISO timestamp
	if (index.generatedAt && isNaN(Date.parse(index.generatedAt))) {
		errors.push(`Invalid generatedAt timestamp: ${index.generatedAt}`);
	}

	// Validate checksums format
	const checksumPattern = /^sha256-[A-Za-z0-9+/]+=*$/;
	for (const [filePath, checksum] of Object.entries(index.checksums || {})) {
		if (!checksumPattern.test(checksum)) {
			errors.push(`Invalid checksum format for ${filePath}: ${checksum}`);
		}
	}

	// Validate all referenced files exist
	for (const [filePath] of Object.entries(index.checksums || {})) {
		const fullPath = path.join(rootDir, filePath);
		if (!fs.existsSync(fullPath)) {
			errors.push(`Referenced file does not exist: ${filePath}`);
		}
	}

	return errors;
}

/**
 * Main execution
 */
async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const validateOnly = args.includes('--validate');
	const verbose = args.includes('--verbose');

	log('\n' + '='.repeat(60), colors.bold);
	log('📦 Greater Components Registry Index Generator', colors.bold);
	log('='.repeat(60) + '\n');

	// Validate existing index if requested
	if (validateOnly) {
		log('🔍 Validating existing registry index...', colors.blue);

		if (!fs.existsSync(OUTPUT_PATH)) {
			log('❌ Registry index not found at ' + OUTPUT_PATH, colors.red);
			process.exit(1);
		}

		const index = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
		const errors = validateRegistryIndex(index);

		if (errors.length > 0) {
			log('\n❌ Validation failed:', colors.red);
			errors.forEach((err) => log(`  • ${err}`, colors.red));
			process.exit(1);
		}

		log('✅ Registry index is valid', colors.green);
		process.exit(0);
	}

	// Get metadata
	const version = getVersion();
	const ref = getGitRef();
	const generatedAt = new Date().toISOString();

	// Get workspace versions
	const workspaceVersions = getPackageVersions();

	log(`📋 Version: ${version}`, colors.cyan);
	log(`🏷️  Git ref: ${ref}`, colors.cyan);
	log(`📅 Generated: ${generatedAt}\n`, colors.cyan);

	// Process packages
	log('📦 Processing packages...', colors.blue);
	const components = {};

	for (const [packageName, config] of Object.entries(PACKAGE_CONFIGS)) {
		log(`  Processing ${packageName}...`);
		const result = processPackage(packageName, config, verbose, workspaceVersions);
		if (result) {
			components[packageName] = result;
			log(`  ✅ ${packageName}: ${result.files.length} files`, colors.green);
		}
	}

	// Process faces
	log('\n🎭 Processing faces...', colors.blue);
	const faces = {};

	for (const faceName of FACES) {
		log(`  Processing ${faceName}...`);
		const result = processFace(faceName, verbose, workspaceVersions);
		if (result) {
			faces[faceName] = result;
			log(`  ✅ ${faceName}: ${result.files.length} files`, colors.green);
		}
	}

	// Process shared modules
	log('\n🔗 Processing shared modules...', colors.blue);
	const shared = {};

	for (const moduleName of SHARED_MODULES) {
		log(`  Processing ${moduleName}...`);
		const result = processSharedModule(moduleName, verbose, workspaceVersions);
		if (result) {
			shared[moduleName] = result;
			log(`  ✅ ${moduleName}: ${result.files.length} files`, colors.green);
		}
	}

	// Build checksums map
	const checksums = buildChecksumsMap(components, faces, shared);

	// Build registry index
	const registryIndex = {
		$schema: 'https://equalto.ai/schemas/registry-index.schema.json',
		schemaVersion: SCHEMA_VERSION,
		generatedAt,
		ref,
		version,
		checksums,
		components,
		faces,
		shared,
	};

	// Validate before writing
	log('\n🔍 Validating generated index...', colors.blue);
	const errors = validateRegistryIndex(registryIndex);

	if (errors.length > 0) {
		log('\n⚠️  Validation warnings:', colors.yellow);
		errors.forEach((err) => log(`  • ${err}`, colors.yellow));
	}

	// Summary
	log('\n' + '='.repeat(60));
	log('📊 Summary:', colors.bold);
	log(`  • Packages: ${Object.keys(components).length}`);
	log(`  • Faces: ${Object.keys(faces).length}`);
	log(`  • Shared modules: ${Object.keys(shared).length}`);
	log(`  • Total checksums: ${Object.keys(checksums).length}`);
	log('='.repeat(60) + '\n');

	// Output
	if (dryRun) {
		log('🔍 Dry run - not writing file', colors.yellow);
		log('\nGenerated index:\n');
		console.log(JSON.stringify(registryIndex, null, 2));
	} else {
		// Ensure registry directory exists
		const registryDir = path.dirname(OUTPUT_PATH);
		if (!fs.existsSync(registryDir)) {
			fs.mkdirSync(registryDir, { recursive: true });
		}

		let output = JSON.stringify(registryIndex);
		try {
			const prettier = await import('prettier');
			output = await prettier.format(output, { filepath: OUTPUT_PATH });
		} catch {
			// Fallback for environments without Prettier installed.
			output = JSON.stringify(registryIndex, null, 2) + '\n';
		}

		fs.writeFileSync(OUTPUT_PATH, output);
		log(`✅ Registry index written to ${OUTPUT_PATH}`, colors.green);
	}
}

main().catch((error) => {
	log(`\n❌ Error: ${error.message}`, colors.red);
	console.error(error);
	process.exit(1);
});
