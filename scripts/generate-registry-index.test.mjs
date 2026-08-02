import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const fixtureRef = process.env.GREATER_REGISTRY_TEST_REF || 'HEAD';

function git(cwd, args, options = {}) {
	return execFileSync('git', args, { cwd, encoding: 'utf8', ...options }).trimEnd();
}

function sha256(content) {
	return createHash('sha256').update(content).digest('hex');
}

function runCheck(cwd, env = process.env) {
	return spawnSync(process.execPath, ['scripts/generate-registry-index.js', '--check'], {
		cwd,
		encoding: 'utf8',
		env,
	});
}

function perturb(content, version) {
	assert.match(content, /"schemaVersion": "1\.0\.0"/);
	return content.replace('"schemaVersion": "1.0.0"', `"schemaVersion": "${version}"`);
}

function withWorktree(fn) {
	const parent = mkdtempSync(join(tmpdir(), 'greater-registry-check-'));
	const cwd = join(parent, 'repo');
	git(repoRoot, ['worktree', 'add', '--detach', '--quiet', cwd, fixtureRef]);

	const rootModules = join(repoRoot, 'node_modules');
	if (existsSync(rootModules)) {
		symlinkSync(rootModules, join(cwd, 'node_modules'), 'dir');
	}

	try {
		return fn(cwd);
	} finally {
		git(repoRoot, ['worktree', 'remove', '--force', cwd]);
		rmSync(parent, { force: true, recursive: true });
	}
}

function withArchive(fn, { gitAvailable = false } = {}) {
	const parent = mkdtempSync(join(tmpdir(), 'greater-registry-no-git-'));
	const cwd = join(parent, 'repo');
	const binDir = join(parent, 'bin');
	mkdirSync(cwd);
	mkdirSync(binDir);

	const archive = execFileSync('git', ['archive', '--format=tar', fixtureRef], {
		cwd: repoRoot,
		maxBuffer: 64 * 1024 * 1024,
	});
	execFileSync('tar', ['-xf', '-', '-C', cwd], {
		input: archive,
		maxBuffer: 64 * 1024 * 1024,
	});

	const rootModules = join(repoRoot, 'node_modules');
	if (existsSync(rootModules)) {
		symlinkSync(rootModules, join(cwd, 'node_modules'), 'dir');
	}

	const env = gitAvailable ? { ...process.env } : { ...process.env, PATH: binDir };
	if (!gitAvailable) {
		const gitProbe = spawnSync('git', ['--version'], { env, encoding: 'utf8' });
		assert.equal(gitProbe.error?.code, 'ENOENT', 'git must be unavailable in the archive fixture');
	}

	try {
		return fn(cwd, env);
	} finally {
		rmSync(parent, { force: true, recursive: true });
	}
}

function expectFailure(result, context) {
	assert.notEqual(
		result.status,
		0,
		`${context} should fail\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
	);
}

function expectLegibleArtifactParseFailure(cwd, content, context) {
	const artifact = join(cwd, 'registry', 'index.json');
	writeFileSync(artifact, content);

	const result = runCheck(cwd);
	const output = `${result.stdout}\n${result.stderr}`;
	const parseErrorLines = output
		.split('\n')
		.filter((line) => line.includes('Unable to parse registry/index.json'));

	assert.equal(
		result.status,
		1,
		`${context} should exit 1\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
	);
	assert.equal(parseErrorLines.length, 1, `expected one parse error line\n${output}`);
	assert.match(parseErrorLines[0], /Unable to parse registry\/index\.json: .+/);
	assert.doesNotMatch(output, /TypeError|SyntaxError|\n\s+at\s/);
}

const tests = [
	[
		'unstaged drift fails without changing the artifact bytes',
		() =>
			withWorktree((cwd) => {
				const artifact = join(cwd, 'registry', 'index.json');
				const drifted = perturb(readFileSync(artifact, 'utf8'), '1.0.2');
				writeFileSync(artifact, drifted);
				const before = sha256(readFileSync(artifact));

				const result = runCheck(cwd);

				expectFailure(result, 'unstaged registry drift');
				assert.equal(sha256(readFileSync(artifact)), before);
				assert.equal(readFileSync(artifact, 'utf8'), drifted);
			}),
	],
	[
		'missing artifact fails with a legible generation command and no stack trace',
		() =>
			withWorktree((cwd) => {
				const artifact = join(cwd, 'registry', 'index.json');
				rmSync(artifact);

				const result = runCheck(cwd);
				const output = `${result.stdout}\n${result.stderr}`;

				expectFailure(result, 'missing registry artifact');
				assert.match(
					output,
					/registry\/index\.json is missing; run `pnpm generate-registry` to create it/
				);
				assert.doesNotMatch(output, /ENOENT|\n\s+at\s/);
			}),
	],
	...[
		['null artifact', 'null'],
		['string artifact', '"str"'],
		['number artifact', '42'],
		['array artifact', '[]'],
		['object missing required top-level keys', '{}'],
		['truncated JSON artifact', '{"schemaVersion":'],
		['empty artifact', ''],
		['artifact with trailing garbage', '{"schemaVersion":"1.0.0"} trailing'],
	].map(([name, content]) => [
		`${name} fails with a legible parse error and no stack trace`,
		() => withWorktree((cwd) => expectLegibleArtifactParseFailure(cwd, content, name)),
	]),
	[
		'staged-only drift fails with a diff while the worktree matches generation',
		() =>
			withWorktree((cwd) => {
				const artifact = join(cwd, 'registry', 'index.json');
				const clean = readFileSync(artifact, 'utf8');
				writeFileSync(artifact, perturb(clean, '1.0.1'));
				git(cwd, ['add', 'registry/index.json']);
				writeFileSync(artifact, clean);

				const result = runCheck(cwd);
				const output = `${result.stdout}\n${result.stderr}`;

				expectFailure(result, 'staged-only registry drift');
				assert.match(output, /diff --git a\/registry\/index\.json b\/registry\/index\.json/);
				assert.match(output, /Staged registry index is stale/);
				assert.equal(readFileSync(artifact, 'utf8'), clean);
			}),
	],
	[
		'git ownership refusal fails closed instead of skipping staged-only drift',
		() =>
			withWorktree((cwd) => {
				const artifact = join(cwd, 'registry', 'index.json');
				const clean = readFileSync(artifact, 'utf8');
				writeFileSync(artifact, perturb(clean, '1.0.1'));
				git(cwd, ['add', 'registry/index.json']);
				writeFileSync(artifact, clean);

				const result = runCheck(cwd, {
					...process.env,
					GIT_TEST_ASSUME_DIFFERENT_OWNER: '1',
				});
				const output = `${result.stdout}\n${result.stderr}`;

				expectFailure(result, 'git ownership refusal');
				assert.match(
					output,
					/Unable to determine whether the registry has staged changes: git failed \(exit 128\)/
				);
				assert.doesNotMatch(output, /Registry index is freshly generated|\n\s+at\s/);
			}),
	],
	[
		'clean artifact passes freshness checking',
		() =>
			withWorktree((cwd) => {
				const artifact = join(cwd, 'registry', 'index.json');
				const before = sha256(readFileSync(artifact));

				const result = runCheck(cwd);

				assert.equal(
					result.status,
					0,
					`clean registry should pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
				);
				assert.equal(sha256(readFileSync(artifact)), before);
			}),
	],
	[
		'fresh artifact passes without git or a work tree',
		() =>
			withArchive((cwd, env) => {
				const result = runCheck(cwd, env);
				const output = `${result.stdout}\n${result.stderr}`;

				assert.equal(
					result.status,
					0,
					`fresh registry without git should pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
				);
				assert.match(output, /Registry index is freshly generated/);
				assert.doesNotMatch(output, /ENOENT|\n\s+at\s/);
			}),
	],
	[
		"git's no-repository message skips only the staged-drift leg",
		() =>
			withArchive(
				(cwd, env) => {
					const result = runCheck(cwd, env);
					const output = `${result.stdout}\n${result.stderr}`;

					assert.equal(
						result.status,
						0,
						`fresh registry outside a work tree should pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
					);
					assert.match(output, /Registry index is freshly generated/);
					assert.doesNotMatch(output, /Unable to determine|\n\s+at\s/);
				},
				{ gitAvailable: true }
			),
	],
	[
		"git's missing-GIT_DIR message skips only the staged-drift leg",
		() =>
			withArchive(
				(cwd, env) => {
					const result = runCheck(cwd, {
						...env,
						GIT_DIR: join(cwd, 'missing-git-dir'),
					});
					const output = `${result.stdout}\n${result.stderr}`;

					assert.equal(
						result.status,
						0,
						`fresh registry with a missing GIT_DIR should pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
					);
					assert.match(output, /Registry index is freshly generated/);
					assert.doesNotMatch(output, /Unable to determine|\n\s+at\s/);
				},
				{ gitAvailable: true }
			),
	],
	[
		'stale artifact fails with a diff without git or a work tree',
		() =>
			withArchive((cwd, env) => {
				const artifact = join(cwd, 'registry', 'index.json');
				writeFileSync(artifact, perturb(readFileSync(artifact, 'utf8'), '1.0.2'));

				const result = runCheck(cwd, env);
				const output = `${result.stdout}\n${result.stderr}`;

				expectFailure(result, 'stale registry without git');
				assert.match(output, /--- registry\/index\.json/);
				assert.match(output, /\+\+\+ generated registry\/index\.json/);
				assert.match(output, /Registry index is stale/);
				assert.doesNotMatch(output, /ENOENT|\n\s+at\s/);
			}),
	],
];

let passed = 0;
for (const [name, test] of tests) {
	try {
		test();
		passed++;
		console.log(`✓ ${name}`);
	} catch (error) {
		console.error(`✗ ${name}`);
		console.error(error);
		process.exitCode = 1;
	}
}

console.log(`\n${passed}/${tests.length} registry check tests passed`);
