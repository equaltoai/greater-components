#!/usr/bin/env node
/**
 * Prove that Greater's pinned Lesser and Lesser Host snapshots are exact,
 * byte-for-byte mirrors of the commits recorded in their pin files.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BUFFER = 128 * 1024 * 1024;

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: options.cwd,
		encoding: options.encoding ?? 'utf8',
		maxBuffer: MAX_BUFFER,
		env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...options.env },
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(' ')} failed (${result.status ?? 'signal'}):\n${String(result.stdout)}\n${String(result.stderr)}`
		);
	}
	return result.stdout;
}

function parsePin(pinPath) {
	const values = Object.fromEntries(
		readFileSync(pinPath, 'utf8')
			.split(/\r?\n/)
			.filter(Boolean)
			.map((line) => {
				const separator = line.indexOf(':');
				return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
			})
	);
	if (!/^v\d/.test(values.tag ?? '') || !/^[0-9a-f]{40}$/i.test(values.commit ?? '')) {
		throw new Error(`invalid pin record: ${pinPath}`);
	}
	return { tag: values.tag, commit: values.commit.toLowerCase() };
}

function collectFiles(root, current = root, output = []) {
	for (const entry of readdirSync(current, { withFileTypes: true })) {
		const fullPath = join(current, entry.name);
		if (entry.isDirectory()) collectFiles(root, fullPath, output);
		else if (entry.isFile()) output.push(relative(root, fullPath).replaceAll('\\', '/'));
	}
	return output.sort();
}

function checkoutPinnedRepository(remote, pin, prefixes, destination) {
	run('git', ['init', '--quiet', destination]);
	run('git', ['remote', 'add', 'origin', remote], { cwd: destination });
	run(
		'git',
		['fetch', '--quiet', '--depth=1', '--filter=blob:none', 'origin', `refs/tags/${pin.tag}`],
		{ cwd: destination }
	);
	const fetched = String(
		run('git', ['rev-parse', 'FETCH_HEAD^{commit}'], { cwd: destination })
	).trim();
	if (fetched.toLowerCase() !== pin.commit) {
		throw new Error(
			`pin mismatch for ${remote}: ${pin.tag} resolves to ${fetched}, expected ${pin.commit}`
		);
	}

	run('git', ['sparse-checkout', 'init', '--no-cone'], { cwd: destination });
	run('git', ['sparse-checkout', 'set', '--no-cone', ...prefixes], { cwd: destination });
	run('git', ['checkout', '--quiet', '--detach', pin.commit], { cwd: destination });
}

function verifyMirror({ label, localRoot, upstreamRoot, ownedFiles = [] }) {
	const owned = new Set(ownedFiles);
	const localFiles = collectFiles(localRoot).filter((filePath) => !owned.has(filePath));
	const upstreamFiles = collectFiles(upstreamRoot);
	const localSet = new Set(localFiles);
	const upstreamSet = new Set(upstreamFiles);
	const errors = [];

	for (const filePath of upstreamFiles) {
		if (!localSet.has(filePath)) errors.push(`${label}: missing local file ${filePath}`);
	}
	for (const filePath of localFiles) {
		if (!upstreamSet.has(filePath)) errors.push(`${label}: unexpected local file ${filePath}`);
	}
	for (const filePath of upstreamFiles) {
		if (!localSet.has(filePath)) continue;
		const local = readFileSync(join(localRoot, filePath));
		const upstream = readFileSync(join(upstreamRoot, filePath));
		if (!local.equals(upstream)) errors.push(`${label}: byte mismatch ${filePath}`);
	}

	return { errors, files: upstreamFiles.length };
}

function verifySingleFile(label, localPath, upstreamPath) {
	return readFileSync(localPath).equals(readFileSync(upstreamPath))
		? []
		: [`${label}: byte mismatch ${relative(ROOT, localPath).replaceAll('\\', '/')}`];
}

function runSelfTest() {
	const fixture = mkdtempSync(join(tmpdir(), 'greater-contract-parity-self-test-'));
	try {
		const upstream = join(fixture, 'upstream');
		const local = join(fixture, 'local');
		mkdirSync(join(upstream, 'docs', 'contracts'), { recursive: true });
		mkdirSync(local, { recursive: true });
		writeFileSync(join(upstream, 'docs', 'contracts', 'contract.json'), '{"ok":true}\n');
		run('git', ['init', '--quiet'], { cwd: upstream });
		run('git', ['add', '.'], { cwd: upstream });
		run('git', ['-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture'], {
			cwd: upstream,
			env: {
				GIT_AUTHOR_NAME: 'Greater Contract Test',
				GIT_AUTHOR_EMAIL: 'test@example.invalid',
				GIT_COMMITTER_NAME: 'Greater Contract Test',
				GIT_COMMITTER_EMAIL: 'test@example.invalid',
			},
		});
		run('git', ['tag', 'v1.0.0'], { cwd: upstream });
		const commit = String(run('git', ['rev-parse', 'HEAD'], { cwd: upstream })).trim();
		writeFileSync(join(local, 'contract.json'), '{"ok":true}\n');
		writeFileSync(join(local, 'PIN.txt'), `tag: v1.0.0\ncommit: ${commit}\n`);

		const checkout = join(fixture, 'checkout');
		checkoutPinnedRepository(
			upstream,
			parsePin(join(local, 'PIN.txt')),
			['docs/contracts'],
			checkout
		);
		const clean = verifyMirror({
			label: 'fixture',
			localRoot: local,
			upstreamRoot: join(checkout, 'docs', 'contracts'),
			ownedFiles: ['PIN.txt'],
		});
		if (clean.errors.length > 0) throw new Error(clean.errors.join('\n'));

		writeFileSync(join(local, 'contract.json'), '{"ok":false}\n');
		const drift = verifyMirror({
			label: 'fixture',
			localRoot: local,
			upstreamRoot: join(checkout, 'docs', 'contracts'),
			ownedFiles: ['PIN.txt'],
		});
		if (!drift.errors.some((error) => error.includes('byte mismatch contract.json'))) {
			throw new Error('self-test failed to detect byte drift');
		}
		writeFileSync(join(local, 'extra.json'), '{}\n');
		const extra = verifyMirror({
			label: 'fixture',
			localRoot: local,
			upstreamRoot: join(checkout, 'docs', 'contracts'),
			ownedFiles: ['PIN.txt'],
		});
		if (!extra.errors.some((error) => error.includes('unexpected local file extra.json'))) {
			throw new Error('self-test failed to detect file-set drift');
		}
		console.log('Pinned contract snapshot self-test passed.');
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
}

if (process.argv.includes('--self-test')) {
	runSelfTest();
	process.exit(0);
}

const lesserPin = parsePin(join(ROOT, 'docs', 'lesser', 'contracts', 'LESSER_REF.txt'));
const hostPin = parsePin(join(ROOT, 'docs', 'lesser-host', 'contracts', 'LESSER_HOST_REF.txt'));
const tempRoot = mkdtempSync(join(tmpdir(), 'greater-contract-parity-'));
try {
	const lesserCheckout = join(tempRoot, 'lesser');
	const hostCheckout = join(tempRoot, 'lesser-host');
	checkoutPinnedRepository(
		process.env.LESSER_CONTRACT_REPO_URL ?? 'https://github.com/equaltoai/lesser.git',
		lesserPin,
		['docs/contracts'],
		lesserCheckout
	);
	checkoutPinnedRepository(
		process.env.LESSER_HOST_CONTRACT_REPO_URL ?? 'https://github.com/equaltoai/lesser-host.git',
		hostPin,
		['docs/contracts', 'docs/spec/v3'],
		hostCheckout
	);

	const checks = [
		verifyMirror({
			label: 'Lesser contracts',
			localRoot: join(ROOT, 'docs', 'lesser', 'contracts'),
			upstreamRoot: join(lesserCheckout, 'docs', 'contracts'),
			ownedFiles: ['LESSER_REF.txt', 'openapi-auth-baseline.json', 'upstream-gaps.md'],
		}),
		verifyMirror({
			label: 'Lesser Host contracts',
			localRoot: join(ROOT, 'docs', 'lesser-host', 'contracts'),
			upstreamRoot: join(hostCheckout, 'docs', 'contracts'),
			ownedFiles: ['LESSER_HOST_REF.txt'],
		}),
		verifyMirror({
			label: 'Lesser Host v3 spec',
			localRoot: join(ROOT, 'docs', 'lesser-host', 'spec', 'v3'),
			upstreamRoot: join(hostCheckout, 'docs', 'spec', 'v3'),
		}),
	];
	const errors = checks.flatMap((check) => check.errors);
	errors.push(
		...verifySingleFile(
			'Lesser schema alias',
			join(ROOT, 'schemas', 'lesser', 'schema.graphql'),
			join(lesserCheckout, 'docs', 'contracts', 'graphql-schema.graphql')
		)
	);

	if (errors.length > 0) {
		console.error('Pinned contract snapshot parity failed:');
		for (const error of errors) console.error(`  - ${error}`);
		process.exitCode = 1;
	} else {
		console.log(
			`Pinned contract snapshots match Lesser ${lesserPin.tag} (${lesserPin.commit}) and ` +
				`Lesser Host ${hostPin.tag} (${hostPin.commit}); ` +
				`${checks.reduce((sum, check) => sum + check.files, 0) + 1} files verified.`
		);
	}
} finally {
	rmSync(tempRoot, { recursive: true, force: true });
}
