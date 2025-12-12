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
		extensions: ['.svelte', '.ts', '.js'],
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
		extensions: ['.css', '.ts', '.js'],
	},
	utils: {
		type: 'utilities',
		srcDir: 'src',
		extensions: ['.ts', '.js'],
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
const FACES = ['social', 'blog', 'community'];

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

	const entries = fs.readdirSync(dir, { withFileTypes: true });

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
 * Read manifest.json if it exists
 */
function readManifest(manifestPath) {
	if (fs.existsSync(manifestPath)) {
		return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
	}
	return null;
}

/**
 * Process a package and extract component metadata
 */
function processPackage(packageName, config, verbose) {
	const packageDir = path.join(PACKAGES_DIR, packageName);
	const packageJsonPath = path.join(packageDir, 'package.json');

	if (!fs.existsSync(packageJsonPath)) {
		log(`  ⚠️  Skipping ${packageName}: package.json not found`, colors.yellow);
		return null;
	}

	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const files = processFiles(packageDir, config.srcDir, config.extensions, verbose);

	return {
		name: packageName,
		version: packageJson.version,
		description: packageJson.description || '',
		type: config.type,
		files,
		dependencies: Object.keys(packageJson.dependencies || {}).filter((dep) =>
			dep.startsWith('@equaltoai/greater-components')
		),
		peerDependencies: Object.keys(packageJson.peerDependencies || {}),
		tags: packageJson.keywords || [],
	};
}

/**
 * Process a face package
 */
function processFace(faceName, verbose) {
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
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		version = packageJson.version || version;
	}

	// Process source files
	const files = processFiles(faceDir, 'src', ['.svelte', '.ts', '.js', '.css'], verbose);

	return {
		name: faceName,
		version,
		description: manifest.description,
		includes: {
			primitives: Object.keys(manifest.components || {}).filter(
				(c) => manifest.components[c].subcomponents === undefined
			),
			shared:
				manifest.dependencies?.internal?.map((dep) =>
					dep.replace('@equaltoai/greater-components-', '')
				) || [],
			patterns: [],
			components: Object.keys(manifest.components || {}),
		},
		files,
		styles: {
			main: `@equaltoai/greater-components/faces/${faceName}/style.css`,
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		dependencies: manifest.dependencies?.internal || [],
		peerDependencies: manifest.dependencies?.peer || [],
	};
}

/**
 * Process a shared module
 */
function processSharedModule(moduleName, verbose) {
	const moduleDir = path.join(PACKAGES_DIR, 'shared', moduleName);
	const manifestPath = path.join(moduleDir, 'manifest.json');

	const manifest = readManifest(manifestPath);
	if (!manifest) {
		log(`  ⚠️  Skipping shared module ${moduleName}: manifest.json not found`, colors.yellow);
		return null;
	}

	// Process source files
	const files = processFiles(moduleDir, 'src', ['.svelte', '.ts', '.js'], verbose);

	return {
		name: moduleName,
		version: manifest.version,
		description: manifest.description,
		exports: Object.keys(manifest.components || {}),
		files,
		dependencies: manifest.dependencies?.internal || [],
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

	log(`📋 Version: ${version}`, colors.cyan);
	log(`🏷️  Git ref: ${ref}`, colors.cyan);
	log(`📅 Generated: ${generatedAt}\n`, colors.cyan);

	// Process packages
	log('📦 Processing packages...', colors.blue);
	const components = {};

	for (const [packageName, config] of Object.entries(PACKAGE_CONFIGS)) {
		log(`  Processing ${packageName}...`);
		const result = processPackage(packageName, config, verbose);
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
		const result = processFace(faceName, verbose);
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
		const result = processSharedModule(moduleName, verbose);
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

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(registryIndex, null, 2));
		log(`✅ Registry index written to ${OUTPUT_PATH}`, colors.green);
	}
}

main().catch((error) => {
	log(`\n❌ Error: ${error.message}`, colors.red);
	console.error(error);
	process.exit(1);
});
