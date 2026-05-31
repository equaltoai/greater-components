import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const checkDcoScript = join(repoRoot, 'scripts', 'check-dco.js');

function git(cwd, args) {
	return execFileSync('git', args, { cwd, encoding: 'utf8' }).trimEnd();
}

function createRepo() {
	const cwd = mkdtempSync(join(tmpdir(), 'greater-check-dco-'));
	git(cwd, ['init', '-q']);
	mkdirSync(join(cwd, '.github'), { recursive: true });
	writeFileSync(join(cwd, '.github', 'dco.yml'), 'allowRemediationCommits:\n  individual: true\n');
	git(cwd, ['add', '.github/dco.yml']);
	git(cwd, [
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

function commit(cwd, { authorEmail, authorName, body, subject = 'test commit' }) {
	const args = [
		'-c',
		'user.name=Test Committer',
		'-c',
		'user.email=committer@example.com',
		'-c',
		'commit.gpgsign=false',
		'commit',
		'-q',
		'--allow-empty',
		`--author=${authorName} <${authorEmail}>`,
		'-m',
		subject,
	];
	if (body) args.push('-m', body);
	git(cwd, args);
	return git(cwd, ['rev-parse', 'HEAD']);
}

function runDco(cwd, base, head = 'HEAD') {
	return spawnSync(process.execPath, [checkDcoScript, '--base', base, '--head', head], {
		cwd,
		encoding: 'utf8',
	});
}

function withRepo(fn) {
	const cwd = createRepo();
	try {
		return fn(cwd);
	} finally {
		rmSync(cwd, { force: true, recursive: true });
	}
}

function expectDcoPass(cwd, base, head) {
	const result = runDco(cwd, base, head);
	assert.equal(
		result.status,
		0,
		`expected DCO pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
	);
	return result;
}

function expectDcoFail(cwd, base, head) {
	const result = runDco(cwd, base, head);
	assert.notEqual(
		result.status,
		0,
		`expected DCO failure\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
	);
	return result;
}

const tests = [
	[
		'human author with matching Signed-off-by passes',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'Author Example',
					authorEmail: 'author@example.com',
					body: 'Signed-off-by: Author Example <AUTHOR@example.com>',
				});

				expectDcoPass(cwd, base);
			}),
	],
	[
		'human author with only non-matching Signed-off-by fails',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'Author Example',
					authorEmail: 'author@example.com',
					body: 'Signed-off-by: Someone Else <other@example.com>',
				});

				const result = expectDcoFail(cwd, base);
				assert.match(
					result.stderr,
					/missing Signed-off-by matching Author Example <author@example\.com>/
				);
			}),
	],
	[
		'routed TheoryMCP App author with corresponding agent signoff passes',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'greater-steward[bot]',
					authorEmail: '287077153+greater-steward[bot]@users.noreply.github.com',
					body: 'Signed-off-by: Greater steward <greater.equaltoai@theorymcp.ai>',
				});

				const result = expectDcoPass(cwd, base);
				assert.match(result.stdout, /routed TheoryMCP App allowlist/);
			}),
	],
	[
		'GitHub bot numeric noreply author with canonical bot signoff passes',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'github-actions[bot]',
					authorEmail: '41898282+github-actions[bot]@users.noreply.github.com',
					body: 'Signed-off-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>',
				});

				const result = expectDcoPass(cwd, base);
				assert.match(result.stdout, /GitHub bot noreply normalization/);
			}),
	],
	[
		'GitHub bot numeric noreply author cannot use a different bot signoff',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'github-actions[bot]',
					authorEmail: '41898282+github-actions[bot]@users.noreply.github.com',
					body: 'Signed-off-by: dependabot[bot] <dependabot[bot]@users.noreply.github.com>',
				});

				expectDcoFail(cwd, base);
			}),
	],
	[
		'non-allowlisted bot author with mismatched signoff fails',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				commit(cwd, {
					authorName: 'dependabot[bot]',
					authorEmail: '49699333+dependabot[bot]@users.noreply.github.com',
					body: 'Signed-off-by: Greater steward <greater.equaltoai@theorymcp.ai>',
				});

				expectDcoFail(cwd, base);
			}),
	],
	[
		'merge commits without signoff are skipped',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				git(cwd, ['checkout', '-q', '-b', 'topic']);
				commit(cwd, {
					authorName: 'Topic Author',
					authorEmail: 'topic@example.com',
					body: 'Signed-off-by: Topic Author <topic@example.com>',
				});
				git(cwd, ['checkout', '-q', '-']);
				commit(cwd, {
					authorName: 'Main Author',
					authorEmail: 'main@example.com',
					body: 'Signed-off-by: Main Author <main@example.com>',
				});
				git(cwd, [
					'-c',
					'user.name=Merge Committer',
					'-c',
					'user.email=merge@example.com',
					'-c',
					'commit.gpgsign=false',
					'merge',
					'-q',
					'--no-ff',
					'topic',
					'-m',
					'Merge topic',
				]);

				const result = expectDcoPass(cwd, base);
				assert.match(result.stdout, /skipping merge commit/);
			}),
	],
	[
		'signed remediation commits continue to remediate individual commits',
		() =>
			withRepo((cwd) => {
				const base = git(cwd, ['rev-parse', 'HEAD']);
				const badSha = commit(cwd, {
					authorName: 'Author Example',
					authorEmail: 'author@example.com',
					subject: 'unsigned commit',
				});
				commit(cwd, {
					authorName: 'Author Example',
					authorEmail: 'author@example.com',
					subject: 'DCO remediation commit for Author Example <author@example.com>',
					body: [
						`I, Author Example <author@example.com>, hereby add my Signed-off-by to this commit: ${badSha}`,
						'',
						'Signed-off-by: Author Example <author@example.com>',
					].join('\n'),
				});

				const result = expectDcoPass(cwd, base);
				assert.match(
					result.stdout,
					new RegExp(`remediated by [0-9a-f]{40} for Author Example <author@example\\.com>`)
				);
			}),
	],
];

let failed = false;
for (const [name, test] of tests) {
	try {
		test();
		console.log(`ok - ${name}`);
	} catch (cause) {
		failed = true;
		console.error(`not ok - ${name}`);
		console.error(cause);
	}
}

if (failed) process.exit(1);
console.log(`check-dco tests: PASS (${tests.length} tests)`);
