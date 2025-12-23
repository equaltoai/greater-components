import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'fs';
import { join, resolve } from 'path';

const rootDir = process.cwd();
const artifactsDir = join(rootDir, 'artifacts');
const packagesDir = join(rootDir, 'packages');

// Map of package folder names to desired artifact names
// format: directory: 'name-without-extension'
const packages = {
	tokens: 'greater-components-tokens',
	utils: 'greater-components-utils',
	primitives: 'greater-components-primitives',
	icons: 'greater-components-icons',
	adapters: 'greater-components-adapters',
	'faces/social': 'greater-components-social',
	testing: 'greater-components-testing',
	headless: 'greater-components-headless',
	cli: 'greater-components-cli',
};

function run(command, cwd = rootDir) {
	try {
		console.log(`> ${command}`);
		execSync(command, { cwd, stdio: 'inherit' });
		return true;
	} catch (e) {
		console.error(`Command failed: ${command}`);
		return false;
	}
}

function main() {
	console.log('📦 Preparing release artifacts...');

	// 1. Clean and create artifacts directory
	if (existsSync(artifactsDir)) {
		rmSync(artifactsDir, { recursive: true, force: true });
	}
	mkdirSync(artifactsDir);

	let successCount = 0;
	const errors = [];

	// 2. Build and Pack each package
	for (const [dirName, artifactName] of Object.entries(packages)) {
		const packagePath = join(packagesDir, dirName);

		if (!existsSync(packagePath)) {
			console.warn(`⚠️ Skipping ${dirName}: Directory not found`);
			continue;
		}

		console.log(`\nProcessing ${artifactName}...`);

		// Ensure clean build
		if (!run('pnpm build', packagePath)) {
			errors.push(`${artifactName}: Build failed`);
			continue;
		}

		// Pack (creates .tgz in the package dir)
		try {
			// pnpm pack returns the filename it created on stdout, but run() inherits stdio.
			// We'll trust it creates a .tgz file.
			run('pnpm pack', packagePath);

			// Find the generated .tgz file
			const files = readdirSync(packagePath);
			const tgzFile = files.find((f) => f.endsWith('.tgz'));

			if (!tgzFile) {
				errors.push(`${artifactName}: No .tgz file generated`);
				continue;
			}

			// Move and rename to artifacts dir
			// We standardize the name to pkg-name.tgz (or pkg-name-ver.tgz if we prefer)
			// For releases, having the version in the name is good, but pnpm pack adds it by default.
			// Let's keep the versioned name for clarity (except for the CLI, which we publish as a stable asset name).
			const sourcePath = join(packagePath, tgzFile);
			const destFileName = dirName === 'cli' ? 'greater-components-cli.tgz' : tgzFile;
			const destPath = join(artifactsDir, destFileName);

			renameSync(sourcePath, destPath);
			console.log(`✅ Packed: ${destPath}`);
			successCount++;
		} catch (e) {
			console.error(e);
			errors.push(`${artifactName}: Pack failed`);
		}
	}

	console.log(`\n================================`);
	console.log(`Summary: ${successCount} / ${Object.keys(packages).length} packages packaged.`);
	if (errors.length > 0) {
		console.log('Errors:');
		errors.forEach((e) => console.log(` - ${e}`));
		process.exit(1);
	} else {
		console.log(`\nArtifacts are ready in ${artifactsDir}`);
		console.log(`You can now upload these files to a GitHub Release.`);
	}
}

main();
