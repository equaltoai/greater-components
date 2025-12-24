#!/usr/bin/env node
/**
 * Audit Runtime Dependencies Script
 *
 * Checks dist files for bare imports and ensures they are listed in dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

function getPackageDirs(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			if (file === 'node_modules' || file === 'dist' || file === '.git') return;
			// Check if it's a package
			if (fs.existsSync(path.join(filePath, 'package.json'))) {
				results.push(filePath);
			}
			// Recurse
			results = results.concat(getPackageDirs(filePath));
		}
	});
	return results;
}

function getJsFiles(dir) {
	let results = [];
	if (!fs.existsSync(dir)) return results;

	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			results = results.concat(getJsFiles(filePath));
		} else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs')) {
			results.push(filePath);
		}
	});
	return results;
}

function extractImports(content) {
	const imports = new Set();

	const importFromRegex = /^\s*import\s+(?:type\s+)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm;
	const importSideEffectRegex = /^\s*import\s+['"]([^'"]+)['"]/gm;
	const exportFromRegex =
		/^\s*export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s*from\s+['"]([^'"]+)['"]/gm;

	const dynamicImportRegex = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
	const requireRegex = /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

	const isCommentLine = (index) => {
		const lineStart = content.lastIndexOf('\n', index) + 1;
		const prefix = content.slice(lineStart, index).trimStart();
		return prefix.startsWith('*') || prefix.startsWith('//') || prefix.startsWith('/*');
	};

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
		if (isCommentLine(match.index)) continue;
		imports.add(match[1]);
	}
	while ((match = requireRegex.exec(content)) !== null) {
		if (isCommentLine(match.index)) continue;
		imports.add(match[1]);
	}

	return Array.from(imports);
}

function auditPackage(packageDir) {
	const packageJsonPath = path.join(packageDir, 'package.json');
	const distDir = path.join(packageDir, 'dist');

	if (!fs.existsSync(distDir)) return null;

	const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const deps = new Set([
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
		// Allow self-reference
		pkg.name,
	]);

	const jsFiles = getJsFiles(distDir);
	const errors = [];

	jsFiles.forEach((file) => {
		const content = fs.readFileSync(file, 'utf8');
		const imports = extractImports(content);

		imports.forEach((imp) => {
			if (imp.startsWith('.') || imp.startsWith('/')) return; // Relative or absolute
			if (builtinModules.includes(imp) || imp.startsWith('node:')) return; // Built-ins

			// Handle scoped packages and subpaths (e.g. @scope/pkg/sub)
			let pkgName = imp;
			if (imp.startsWith('@')) {
				const parts = imp.split('/');
				if (parts.length >= 2) pkgName = `${parts[0]}/${parts[1]}`;
			} else {
				const parts = imp.split('/');
				if (parts.length >= 1) pkgName = parts[0];
			}

			if (!deps.has(pkgName)) {
				errors.push({ file: path.relative(packageDir, file), import: imp, pkgName });
			}
		});
	});

	return errors;
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('📦 Audit Runtime Dependencies', colors.bold);
	log('='.repeat(60) + '\n');

	// We only want to check packages in 'packages/' directory usually,
	// but let's check everything that has a package.json and dist
	const packageDirs = getPackageDirs(rootDir);
	let hasErrors = false;
	let checkedCount = 0;

	packageDirs.forEach((pkgDir) => {
		// Skip root
		if (pkgDir === rootDir) return;

		const errors = auditPackage(pkgDir);
		if (errors === null) return; // No dist dir

		const relativePath = path.relative(rootDir, pkgDir);

		if (errors.length > 0) {
			hasErrors = true;
			log(`❌ ${relativePath}`, colors.red);
			// Deduplicate errors
			const uniqueErrors = new Set(errors.map((e) => `${e.import} (in ${e.file})`));
			uniqueErrors.forEach((err) => log(`   - Missing dep: ${err}`, colors.red));
		} else {
			checkedCount++;
		}
	});

	log('\n' + '='.repeat(60));
	if (hasErrors) {
		log('❌ Runtime dependency audit FAILED', colors.red);
		process.exit(1);
	} else {
		log(`✅ Runtime dependency audit PASSED (${checkedCount} packages checked)`, colors.green);
		process.exit(0);
	}
}

main();
