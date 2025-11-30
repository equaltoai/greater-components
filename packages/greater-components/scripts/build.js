import {
	cpSync,
	mkdirSync,
	rmSync,
	existsSync,
	writeFileSync,
	readdirSync,
	readFileSync,
	statSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');
const workspaceRoot = join(packageRoot, '..');
const repoRoot = join(workspaceRoot, '..');
const distDir = join(packageRoot, 'dist');

const packages = [
	// Core
	{ key: 'primitives', dir: 'primitives' },
	{ key: 'tokens', dir: 'tokens' },
	{ key: 'icons', dir: 'icons' },
	{ key: 'headless', dir: 'headless' },
	{ key: 'utils', dir: 'utils' },
	// Content (heavy deps)
	{ key: 'content', dir: 'content' },
	// Shared
	{ key: 'shared/auth', dir: 'shared/auth' },
	{ key: 'shared/admin', dir: 'shared/admin' },
	{ key: 'shared/compose', dir: 'shared/compose' },
	{ key: 'shared/messaging', dir: 'shared/messaging' },
	{ key: 'shared/search', dir: 'shared/search' },
	{ key: 'shared/notifications', dir: 'shared/notifications' },
	{ key: 'shared/chat', dir: 'shared/chat' },
	// Faces
	{ key: 'faces/social', dir: 'faces/social' },
	{ key: 'fediverse', dir: 'faces/social' },
	// Tools
	{ key: 'adapters', dir: 'adapters' },
	{ key: 'testing', dir: 'testing' },
	{ key: 'cli', dir: 'cli' },
];

function ensureBuilt(sourceDir) {
	if (!existsSync(sourceDir)) {
		throw new Error(
			`Expected build output missing at ${sourceDir}. Run "pnpm -r build" before building greater-components.`
		);
	}
}

function copyPackageOutput() {
	rmSync(distDir, { recursive: true, force: true });
	mkdirSync(distDir, { recursive: true });

	for (const { key, dir } of packages) {
		const source = join(workspaceRoot, dir, 'dist');
		ensureBuilt(source);
		const destination = join(distDir, key);
		mkdirSync(dirname(destination), { recursive: true });
		cpSync(source, destination, { recursive: true });

		// Also copy src for packages that export source files
		const srcSource = join(workspaceRoot, dir, 'src');
		if (existsSync(srcSource)) {
			const srcDest = join(distDir, key, 'src');
			cpSync(srcSource, srcDest, { recursive: true });
		}
	}
}

function getAllFiles(dir) {
	let results = [];
	const list = readdirSync(dir);
	list.forEach(function (file) {
		file = join(dir, file);
		const stat = statSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(getAllFiles(file));
		} else {
			if (file.endsWith('.js') || file.endsWith('.d.ts') || file.endsWith('.svelte')) {
				results.push(file);
			}
		}
	});
	return results;
}

function rewriteImports() {
	console.log('Rewriting imports to relative paths...');
	const files = getAllFiles(distDir);

	const packageNames = new Set(packages.map((p) => p.key));
	const packageExports = {};

	for (const { key, dir } of packages) {
		try {
			const pkgJson = JSON.parse(readFileSync(join(workspaceRoot, dir, 'package.json'), 'utf8'));
			packageExports[key] = pkgJson.exports || {};
		} catch (e) {
			console.warn(`Could not read package.json for ${key}`);
		}
	}

	files.forEach((file) => {
		let content = readFileSync(file, 'utf8');
		const originalContent = content;

		// Regex to match @equaltoai/greater-components-<pkg> imports
		const regex = /@equaltoai\/greater-components-([a-z0-9-]+)(?:\/([^'"]*))?/g;

		content = content.replace(regex, (match, pkgName, subpath) => {
			if (!packageNames.has(pkgName)) {
				return match;
			}

			const fileDir = dirname(file);
			const targetDir = join(distDir, pkgName);
			let relPath = relative(fileDir, targetDir);

			if (!relPath.startsWith('.')) {
				relPath = './' + relPath;
			}

			// Normalize to forward slashes for imports
			relPath = relPath.split(sep).join('/');

			if (subpath) {
				// Try to resolve using exports
				const exports = packageExports[pkgName];
				const exportKey = `./${subpath}`;

				if (exports && exports[exportKey]) {
					const entry = exports[exportKey];
					let targetFile =
						typeof entry === 'string'
							? entry
							: entry.import || entry.default || entry.svelte || entry.types;

					if (targetFile) {
						// Strip ./dist/ prefix as we are linking to the root of the copied dist folder
						targetFile = targetFile.replace(/^\.\/dist\//, '');
						return `${relPath}/${targetFile}`;
					}
				}

				return `${relPath}/${subpath}`;
			}
			return `${relPath}/index.js`;
		});

		if (content !== originalContent) {
			writeFileSync(file, content, 'utf8');
		}
	});
	console.log(`Processed imports in ${files.length} files.`);
}

function generateRootBarrels() {
	// Export commonly used packages from the root barrel for convenience
	const exposedPackages = [
		'primitives',
		'tokens',
		'icons',
		'headless',
		'utils',
		'adapters',
		'testing',
		'cli',
		'fediverse',
	];
	const entryTargets = exposedPackages
		.map((key) => `export * from './${key}/index.js';`)
		.join('\n');
	const entryTypes = exposedPackages.map((key) => `export * from './${key}/index.js';`).join('\n');

	writeFileSync(join(distDir, 'index.js'), `${entryTargets}\n`, 'utf8');
	writeFileSync(join(distDir, 'index.d.ts'), `${entryTypes}\n`, 'utf8');
}

function aggregateStyles() {
	console.log('Aggregating styles...');
	let combinedStyles = '';

	// Add a header
	combinedStyles += '/* Greater Components - Unified Styles */\n\n';

	for (const { key, dir } of packages) {
		const packageDist = join(workspaceRoot, dir, 'dist');

		// Check for common style filenames
		const styleFiles = ['style.css', 'styles.css', 'theme.css', 'greater-components-fediverse.css'];
		let foundStyle = false;

		for (const file of styleFiles) {
			const stylePath = join(packageDist, file);
			if (existsSync(stylePath)) {
				console.log(`Including styles from ${key} (${file})`);
				const content = readFileSync(stylePath, 'utf8');
				combinedStyles += `/* Package: ${key} */\n`;
				combinedStyles += content + '\n\n';
				foundStyle = true;
				break; // Only include one style file per package to avoid duplication if aliases exist
			}
		}

		if (!foundStyle) {
			// console.log(`No styles found for ${key}`);
		}
	}

	writeFileSync(join(distDir, 'style.css'), combinedStyles, 'utf8');
	console.log('Styles aggregated into dist/style.css');
}

copyPackageOutput();
rewriteImports();
generateRootBarrels();
aggregateStyles();

const licenseSource = join(repoRoot, 'LICENSE');
if (existsSync(licenseSource)) {
	cpSync(licenseSource, join(packageRoot, 'LICENSE'));
}

console.log('greater-components build complete.');
