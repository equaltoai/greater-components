#!/usr/bin/env node
/**
 * Bundle Size Analysis Script
 * 
 * Analyzes bundle sizes across all packages and provides
 * detailed reports on optimization opportunities.
 */

import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get all JS files recursively
 */
async function getJSFiles(dir, fileList = []) {
	const files = await readdir(dir, { withFileTypes: true });

	for (const file of files) {
		const filePath = join(dir, file.name);

		if (file.isDirectory()) {
			// Skip node_modules in dist
			if (file.name === 'node_modules') continue;
			await getJSFiles(filePath, fileList);
		} else if (file.name.endsWith('.js') && !file.name.endsWith('.map')) {
			const stats = await stat(filePath);
			fileList.push({
				path: relative(rootDir, filePath),
				size: stats.size,
			});
		}
	}

	return fileList;
}

/**
 * Analyze package bundles
 */
async function analyzePackage(packageName) {
	const distDir = join(rootDir, 'packages', packageName, 'dist');

	try {
		const files = await getJSFiles(distDir);

		const totalSize = files.reduce((sum, file) => sum + file.size, 0);
		const avgSize = files.length > 0 ? totalSize / files.length : 0;
		const largestFile = files.reduce((max, file) => (file.size > max.size ? file : max), {
			size: 0,
		});

		return {
			packageName,
			fileCount: files.length,
			totalSize,
			avgSize,
			largestFile,
			files: files.sort((a, b) => b.size - a.size),
		};
	} catch (error) {
		if (error.code === 'ENOENT') {
			return null; // Package not built
		}
		throw error;
	}
}

/**
 * Print analysis results
 */
function printAnalysis(analysis) {
	console.log('\n' + '='.repeat(80));
	console.log(`📦 Bundle Size Analysis`);
	console.log('='.repeat(80) + '\n');

	// Overall summary
	const totalFiles = analysis.reduce((sum, pkg) => sum + pkg.fileCount, 0);
	const totalSize = analysis.reduce((sum, pkg) => sum + pkg.totalSize, 0);

	console.log('📊 Overall Summary:');
	console.log(`   Total Packages: ${analysis.length}`);
	console.log(`   Total Files: ${totalFiles}`);
	console.log(`   Total Size: ${formatBytes(totalSize)}`);
	console.log(`   Average Package Size: ${formatBytes(totalSize / analysis.length)}\n`);

	// Per-package breakdown
	console.log('📦 Package Breakdown:\n');

	for (const pkg of analysis.sort((a, b) => b.totalSize - a.totalSize)) {
		console.log(`   ${pkg.packageName}:`);
		console.log(`   ├─ Files: ${pkg.fileCount}`);
		console.log(`   ├─ Total: ${formatBytes(pkg.totalSize)}`);
		console.log(`   ├─ Average: ${formatBytes(pkg.avgSize)}`);
		console.log(
			`   └─ Largest: ${formatBytes(pkg.largestFile.size)} (${pkg.largestFile.path})\n`
		);
	}

	// Largest files across all packages
	console.log('🔍 Top 20 Largest Files:\n');

	const allFiles = analysis.flatMap((pkg) => pkg.files);
	const top20 = allFiles.sort((a, b) => b.size - a.size).slice(0, 20);

	top20.forEach((file, index) => {
		console.log(`   ${String(index + 1).padStart(2)}. ${formatBytes(file.size).padEnd(10)} ${file.path}`);
	});

	// Optimization recommendations
	console.log('\n💡 Optimization Recommendations:\n');

	const largeFiles = allFiles.filter((f) => f.size > 50 * 1024); // > 50KB
	if (largeFiles.length > 0) {
		console.log(
			`   ⚠️  ${largeFiles.length} files exceed 50KB - consider code splitting`
		);
	}

	const iconsPkg = analysis.find((p) => p.packageName === 'icons');
	if (iconsPkg && iconsPkg.totalSize > 100 * 1024) {
		console.log(`   ⚠️  Icons package is ${formatBytes(iconsPkg.totalSize)} - ensure tree-shaking works`);
	}

	const avgLarge = analysis.filter((p) => p.avgSize > 10 * 1024);
	if (avgLarge.length > 0) {
		console.log(
			`   ⚠️  ${avgLarge.length} packages have average file size > 10KB`
		);
	}

	console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Main execution
 */
async function main() {
	const packages = [
		'adapters',
		'cli',
		'fediverse',
		'headless',
		'icons',
		'primitives',
		'testing',
		'tokens',
		'utils',
	];

	const analysis = [];

	for (const pkg of packages) {
		const result = await analyzePackage(pkg);
		if (result) {
			analysis.push(result);
		}
	}

	if (analysis.length === 0) {
		console.error('No packages built. Run `pnpm build` first.');
		process.exit(1);
	}

	printAnalysis(analysis);

	// Export for CI/CD
	if (process.env.CI) {
		console.log('\n📄 Machine-readable output:');
		console.log(JSON.stringify(analysis, null, 2));
	}
}

main().catch((error) => {
	console.error('Error analyzing bundles:', error);
	process.exit(1);
});

