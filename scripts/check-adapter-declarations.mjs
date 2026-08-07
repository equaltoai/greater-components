#!/usr/bin/env node
/**
 * Re-emit the tracked adapter declarations from the public entrypoint and prove
 * that the committed `.d.ts` / `.d.ts.map` files are a deterministic fixed point.
 */

import { spawnSync } from 'node:child_process';
import {
	cpSync,
	existsSync,
	lstatSync,
	mkdtempSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADAPTERS = join(ROOT, 'packages', 'adapters');
const SOURCE = join(ADAPTERS, 'src');
const GENERATED_SUFFIXES = ['.d.ts', '.d.ts.map'];
const TSC = join(ADAPTERS, 'node_modules', '.bin', 'tsc');

function isGenerated(filePath) {
	return GENERATED_SUFFIXES.some((suffix) => filePath.endsWith(suffix));
}

function collectGenerated(root, current = root, output = new Map()) {
	for (const entry of readdirSync(current, { withFileTypes: true })) {
		const fullPath = join(current, entry.name);
		if (entry.isDirectory()) {
			collectGenerated(root, fullPath, output);
		} else if (entry.isFile() && isGenerated(entry.name)) {
			output.set(relative(root, fullPath).replaceAll('\\', '/'), readFileSync(fullPath));
		}
	}
	return output;
}

function run(command, args, cwd) {
	const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' });
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(' ')} failed (${result.status ?? 'signal'}):\n${result.stdout}\n${result.stderr}`
		);
	}
}

function emitToTemporaryPackage(tempPackage) {
	const tempSource = join(tempPackage, 'src');
	cpSync(SOURCE, tempSource, {
		recursive: true,
		filter: (sourcePath) => !isGenerated(sourcePath),
	});

	const nodeModules = join(ADAPTERS, 'node_modules');
	if (!existsSync(nodeModules) || !lstatSync(nodeModules).isDirectory()) {
		throw new Error('packages/adapters/node_modules is missing; run pnpm install first');
	}
	symlinkSync(nodeModules, join(tempPackage, 'node_modules'), 'dir');

	run(
		TSC,
		[
			'src/index.ts',
			'--ignoreConfig',
			'--declaration',
			'--declarationMap',
			'--emitDeclarationOnly',
			'--outDir',
			'src',
			'--target',
			'ES2022',
			'--module',
			'ESNext',
			'--moduleResolution',
			'bundler',
			'--strict',
			'--noUncheckedIndexedAccess',
			'--noPropertyAccessFromIndexSignature',
			'--esModuleInterop',
			'--allowSyntheticDefaultImports',
			'--skipLibCheck',
		],
		tempPackage
	);

	const declarations = [...collectGenerated(tempSource).keys()]
		.filter((filePath) => filePath.endsWith('.d.ts'))
		.map((filePath) => join(tempSource, filePath));
	run(
		'corepack',
		['pnpm', 'exec', 'prettier', '--config', join(ROOT, '.prettierrc'), '--write', ...declarations],
		ROOT
	);
	return tempSource;
}

function compareGenerated(expectedRoot, actualRoot) {
	const expected = collectGenerated(expectedRoot);
	const actual = collectGenerated(actualRoot);
	const paths = [...new Set([...expected.keys(), ...actual.keys()])].sort();
	const differences = [];

	for (const filePath of paths) {
		if (!expected.has(filePath)) differences.push(`missing tracked output: ${filePath}`);
		else if (!actual.has(filePath)) differences.push(`stale tracked-only output: ${filePath}`);
		else if (!expected.get(filePath).equals(actual.get(filePath))) {
			differences.push(`content differs: ${filePath}`);
		}
	}
	return { differences, generated: expected };
}

function writeGenerated(generated) {
	for (const filePath of collectGenerated(SOURCE).keys()) {
		rmSync(join(SOURCE, filePath));
	}
	for (const [filePath, content] of generated) {
		const destination = join(SOURCE, filePath);
		mkdirSync(dirname(destination), { recursive: true });
		writeFileSync(destination, content);
	}
}

const write = process.argv.includes('--write');
const selfTest = process.argv.includes('--self-test');
const tempRoot = mkdtempSync(join(tmpdir(), 'greater-adapter-declarations-'));
try {
	const emittedRoot = emitToTemporaryPackage(join(tempRoot, 'adapters'));
	const { differences, generated } = compareGenerated(emittedRoot, SOURCE);

	if (selfTest) {
		if (differences.length > 0) {
			throw new Error(`self-test requires a fresh baseline:\n${differences.join('\n')}`);
		}
		const declaration = [...generated.keys()].find((filePath) => filePath.endsWith('.d.ts'));
		if (!declaration) throw new Error('self-test could not find an emitted declaration');
		writeFileSync(join(emittedRoot, declaration), Buffer.from('// deliberately stale\n'));
		const stale = compareGenerated(emittedRoot, SOURCE).differences;
		if (!stale.some((difference) => difference === `content differs: ${declaration}`)) {
			throw new Error('self-test failed to detect a stale declaration');
		}
		console.log('Adapter declaration freshness self-test passed.');
	} else if (write) {
		writeGenerated(generated);
		console.log(`Wrote ${generated.size} adapter declaration artifacts.`);
	} else if (differences.length > 0) {
		console.error('Adapter declarations are stale:');
		for (const difference of differences) console.error(`  - ${difference}`);
		console.error('Run: pnpm generate:adapter-declarations');
		process.exitCode = 1;
	} else {
		console.log(`Adapter declarations are fresh (${generated.size} artifacts).`);
	}
} finally {
	rmSync(tempRoot, { recursive: true, force: true });
}
