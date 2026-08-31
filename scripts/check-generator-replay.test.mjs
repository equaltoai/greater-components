import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
	checkCodegenConstraint,
	checkPlatform,
	collectDirt,
	diffAfterReplay,
	restoreReplayDirt,
} from './check-generator-replay.mjs';

const V5_PKG = JSON.stringify({
	pnpm: {
		overrides: {
			'@graphql-codegen/typescript': '<6.0.0',
			'@graphql-codegen/typescript-operations': '<6.0.0',
		},
	},
});

function lockfileWith(entries) {
	// Mimic pnpm-lock.yaml package keys, e.g.
	//   '@graphql-codegen/typescript@5.0.9':
	//   '@graphql-codegen/typescript@5.0.9(graphql@16.13.2)':
	return entries
		.map(
			(entry) =>
				`  '${entry}':\n    version: ${entry
					.split('@')
					.at(-1)
					.replace(/[^.0-9].*$/, '')}\n`
		)
		.join('');
}

function gitIn(cwd, args) {
	return execFileSync('git', args, { cwd, encoding: 'utf8' }).trimEnd();
}

function createRepo() {
	const cwd = mkdtempSync(join(tmpdir(), 'greater-generator-replay-'));
	gitIn(cwd, ['init', '-q']);
	const dir = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated');
	mkdirSync(dir, { recursive: true });
	const tracked = join(dir, 'lesser-api.ts');
	writeFileSync(tracked, 'const committed = true;\n');
	gitIn(cwd, ['add', '.']);
	gitIn(cwd, [
		'-c',
		'user.name=Test Committer',
		'-c',
		'user.email=committer@example.com',
		'-c',
		'commit.gpgsign=false',
		'commit',
		'-q',
		'-m',
		'base',
	]);
	return cwd;
}

function roots() {
	return ['packages/adapters/src'];
}

test('checkCodegenConstraint: v5 lockfile for both plugins is clean', () => {
	const errors = checkCodegenConstraint({
		packageJson: V5_PKG,
		lockfile: lockfileWith([
			'@graphql-codegen/typescript@5.0.9',
			'@graphql-codegen/typescript@5.0.9(graphql@16.13.2)',
			'@graphql-codegen/typescript-operations@5.0.9',
			'@graphql-codegen/typescript-operations@5.0.9(graphql@16.13.2)',
		]),
	});
	assert.deepEqual(errors, []);
});

test('checkCodegenConstraint: each plugin is proven independently (typescript v6 alone fails only typescript)', () => {
	const errors = checkCodegenConstraint({
		packageJson: V5_PKG,
		lockfile: lockfileWith([
			'@graphql-codegen/typescript@6.1.6',
			'@graphql-codegen/typescript-operations@5.0.9',
		]),
	});
	const text = errors.join('\n');
	assert.ok(text.includes('@graphql-codegen/typescript resolves to a v6'), text);
	assert.ok(!text.includes('@graphql-codegen/typescript-operations resolves to a v6'), text);
});

test('checkCodegenConstraint: each plugin is proven independently (typescript-operations v6 alone fails only that plugin)', () => {
	const errors = checkCodegenConstraint({
		packageJson: V5_PKG,
		lockfile: lockfileWith([
			'@graphql-codegen/typescript@5.0.9',
			'@graphql-codegen/typescript-operations@6.1.6',
		]),
	});
	const text = errors.join('\n');
	assert.ok(text.includes('@graphql-codegen/typescript-operations resolves to a v6'), text);
	assert.ok(!text.includes('@graphql-codegen/typescript resolves to a v6'), text);
});

test('checkCodegenConstraint: missing override is reported per package', () => {
	const errors = checkCodegenConstraint({
		packageJson: JSON.stringify({
			pnpm: { overrides: { '@graphql-codegen/typescript': '<6.0.0' } },
		}),
		lockfile: lockfileWith([
			'@graphql-codegen/typescript@5.0.9',
			'@graphql-codegen/typescript-operations@5.0.9',
		]),
	});
	const text = errors.join('\n');
	assert.ok(
		text.includes('@graphql-codegen/typescript-operations must be overridden to <6.0.0'),
		text
	);
	assert.ok(!text.includes('@graphql-codegen/typescript must be overridden'), text);
});

test('checkCodegenConstraint: unresolvable plugin is reported', () => {
	const errors = checkCodegenConstraint({
		packageJson: V5_PKG,
		lockfile: lockfileWith(['@graphql-codegen/typescript@5.0.9']),
	});
	assert.ok(
		errors.some((e) =>
			e.includes('@graphql-codegen/typescript-operations has no resolved version')
		),
		errors.join('\n')
	);
});

test('checkPlatform: current POSIX platform is supported', () => {
	assert.deepEqual(checkPlatform(), []);
});

test('replay safety: clean tree has no dirt', () => {
	const cwd = createRepo();
	try {
		const { entries, error } = collectDirt({ cwd, roots: roots() });
		assert.equal(error, undefined);
		assert.deepEqual(entries, []);
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('replay safety: dirty tracked file is detected and left untouched (no data loss)', () => {
	const cwd = createRepo();
	try {
		const tracked = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'lesser-api.ts');
		writeFileSync(tracked, 'const wip = true;\n');
		const { entries, error } = collectDirt({ cwd, roots: roots() });
		assert.equal(error, undefined);
		assert.equal(entries.length, 1, JSON.stringify(entries));
		assert.ok(entries[0].path.endsWith('lesser-api.ts'), entries[0].path);
		// Refusal is read-only: the WIP content must survive untouched.
		assert.equal(
			readText(tracked),
			'const wip = true;\n',
			'WIP must not be modified by the refusal check'
		);
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('replay safety: dirty untracked file is detected and left untouched', () => {
	const cwd = createRepo();
	try {
		const untracked = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'wip.ts');
		writeFileSync(untracked, 'const wip = true;\n');
		const { entries, error } = collectDirt({ cwd, roots: roots() });
		assert.equal(error, undefined);
		assert.equal(entries.length, 1, JSON.stringify(entries));
		assert.ok(entries[0].path.endsWith('wip.ts'), entries[0].path);
		assert.equal(readText(untracked), 'const wip = true;\n');
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('replay safety: untracked directory is detected without data loss', () => {
	const cwd = createRepo();
	try {
		const dir = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'wip-dir');
		mkdirSync(dir, { recursive: true });
		writeFileSync(join(dir, 'nested.ts'), 'const wip = true;\n');
		const { entries, error } = collectDirt({ cwd, roots: roots() });
		assert.equal(error, undefined);
		assert.equal(entries.length, 1, JSON.stringify(entries));
		assert.ok(entries[0].path.includes('wip-dir'), entries[0].path);
		assert.ok(existsSync(join(dir, 'nested.ts')), 'untracked dir must survive the refusal check');
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('replay cleanup: restores tracked changes and removes replay-created untracked files and dirs', () => {
	const cwd = createRepo();
	try {
		const tracked = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'lesser-api.ts');
		writeFileSync(tracked, 'const replayed = true;\n');
		writeFileSync(join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'new.ts'), 'new\n');
		const dir = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'new-dir');
		mkdirSync(dir, { recursive: true });
		writeFileSync(join(dir, 'nested.ts'), 'nested\n');

		const errors = restoreReplayDirt({ cwd, roots: roots() });
		assert.deepEqual(errors, []);

		assert.equal(readText(tracked), 'const committed = true;\n', 'tracked file must be restored');
		assert.equal(
			existsSync(join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'new.ts')),
			false
		);
		assert.equal(existsSync(dir), false, 'replay-created dir must be removed');
		assert.equal(gitIn(cwd, ['status', '--porcelain']), '', 'tree must be clean after cleanup');
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('replay cleanup: cleanup failures are surfaced loudly', () => {
	const cwd = createRepo();
	try {
		writeFileSync(join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'new.ts'), 'new\n');
		const failingGit = () => ({ status: 1, stdout: '', stderr: 'simulated git failure' });
		const errors = restoreReplayDirt({ cwd, roots: roots(), gitFn: failingGit });
		assert.ok(errors.length > 0, 'cleanup failure must produce errors');
		assert.ok(errors.join('\n').includes('simulated git failure'));
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

test('diffAfterReplay: exposes replay drift without mutating the tree', () => {
	const cwd = createRepo();
	try {
		const tracked = join(cwd, 'packages', 'adapters', 'src', 'rest', 'generated', 'lesser-api.ts');
		writeFileSync(tracked, 'const drift = true;\n');
		const result = diffAfterReplay({ cwd, roots: roots() });
		assert.equal(result.error, undefined);
		assert.equal(result.changed.length, 1, JSON.stringify(result.changed));
		assert.ok(result.diff.includes('drift'), result.diff);
		// diffAfterReplay must not restore; restore is the cleanup step's job.
		assert.equal(readText(tracked), 'const drift = true;\n');
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});

function readText(filePath) {
	return readFileSync(filePath, 'utf8');
}
