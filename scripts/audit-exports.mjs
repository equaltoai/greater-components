#!/usr/bin/env node
/**
 * Audit Exports Script
 *
 * Verifies that all `exports` in package.json point to existing files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function getPackageJsons(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			if (file === 'node_modules' || file === 'dist' || file === '.git') return;
			results = results.concat(getPackageJsons(filePath));
		} else if (file === 'package.json') {
			results.push(filePath);
		}
	});
	return results;
}

function resolveExports(exports, packagePath) {
	const files = [];
	if (typeof exports === 'string') {
		files.push(path.resolve(packagePath, exports));
	} else if (Array.isArray(exports)) {
		for (const entry of exports) {
			files.push(...resolveExports(entry, packagePath));
		}
	} else if (typeof exports === 'object' && exports !== null) {
		for (const key in exports) {
			files.push(...resolveExports(exports[key], packagePath));
		}
	}
	return files;
}

function listFilesRecursive(dir) {
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...listFilesRecursive(fullPath));
		} else {
			results.push(fullPath);
		}
	}
	return results;
}

function globToRegExp(globPattern) {
	const escaped = globPattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
	return new RegExp(`^${escaped.replace(/\*/g, '.*')}$`);
}

function checkGlobTarget(globPathAbs) {
	const globPathPosix = globPathAbs.split(path.sep).join('/');
	const starIndex = globPathPosix.indexOf('*');
	if (starIndex === -1) {
		return { ok: fs.existsSync(globPathAbs), message: 'File not found' };
	}

	const prefix = globPathPosix.slice(0, starIndex);
	const lastSlash = prefix.lastIndexOf('/');
	const baseDirPosix = lastSlash === -1 ? '.' : prefix.slice(0, lastSlash);
	const baseDirAbs = path.resolve(baseDirPosix);

	if (!fs.existsSync(baseDirAbs)) {
		return { ok: false, message: `Base directory not found: ${baseDirPosix}` };
	}

	const fromBase = globPathPosix.slice(baseDirPosix === '.' ? 0 : baseDirPosix.length + 1);
	const regex = globToRegExp(fromBase);

	for (const file of listFilesRecursive(baseDirAbs)) {
		const rel = path.relative(baseDirAbs, file).split(path.sep).join('/');
		if (regex.test(rel)) {
			return { ok: true };
		}
	}

	return { ok: false, message: `No files match: ${fromBase}` };
}

function auditPackage(packageJsonPath) {
	const content = fs.readFileSync(packageJsonPath, 'utf8');
	const pkg = JSON.parse(content);
	const packageDir = path.dirname(packageJsonPath);

	if (!pkg.exports) {
		return { errors: [], warnings: [] };
	}

	const errors = [];
	const filesToCheck = resolveExports(pkg.exports, packageDir);

	filesToCheck.forEach((file) => {
		if (file.includes('*')) {
			const result = checkGlobTarget(file);
			if (!result.ok) {
				errors.push(
					`Glob does not resolve: ${path.relative(packageDir, file)}${
						result.message ? ` (${result.message})` : ''
					}`
				);
			}
			return;
		}

		if (!fs.existsSync(file)) {
			errors.push(`File not found: ${path.relative(packageDir, file)}`);
		}
	});

	return { errors, warnings: [] };
}

function main() {
	log('\n' + '='.repeat(60), colors.bold);
	log('🔍 Audit Exports', colors.bold);
	log('='.repeat(60) + '\n');

	const packageJsons = getPackageJsons(rootDir);
	let hasErrors = false;
	let checkedCount = 0;

	packageJsons.forEach((pkgPath) => {
		// Skip root package.json if it doesn't have exports or is just workspace root
		if (pkgPath === path.join(rootDir, 'package.json')) return;

		const { errors } = auditPackage(pkgPath);
		const relativePath = path.relative(rootDir, pkgPath);

		if (errors.length > 0) {
			hasErrors = true;
			log(`❌ ${relativePath}`, colors.red);
			errors.forEach((err) => log(`   - ${err}`, colors.red));
		} else {
			// log(`✅ ${relativePath}`, colors.green);
			checkedCount++;
		}
	});

	log('\n' + '='.repeat(60));
	if (hasErrors) {
		log('❌ Export audit FAILED', colors.red);
		process.exit(1);
	} else {
		log(`✅ Export audit PASSED (${checkedCount} packages checked)`, colors.green);
		process.exit(0);
	}
}

main();
