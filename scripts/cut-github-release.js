#!/usr/bin/env node
/**
 * One-command GitHub-only release helper.
 *
 * This script:
 * - Creates a release branch off `premain`
 * - Runs `pnpm release:prepare <version>`
 * - Commits + pushes release metadata
 * - Opens + merges the PR into `premain`
 * - Opens a release PR `premain → main` (optionally enables auto-merge and waits for the GitHub Release)
 *
 * Usage:
 *   pnpm release:cut 0.1.0
 *   pnpm release:cut 0.1.0 --auto --wait
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(
	path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
);

const semverPattern = /^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$/;

function usage() {
	console.log(`Usage:
  pnpm release:cut <version> [--auto] [--wait] [--merge-method merge|squash]

Examples:
  pnpm release:cut 0.1.0
  pnpm release:cut 0.1.0 --auto --wait
`);
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: rootDir,
		stdio: options.stdio ?? 'inherit',
		env: options.env ? { ...process.env, ...options.env } : process.env,
		encoding: 'utf8',
	});

	if (result.error) throw result.error;
	if (result.status !== 0) {
		const details = [
			`${command} ${args.join(' ')}`,
			typeof result.stdout === 'string' ? result.stdout.trim() : '',
			typeof result.stderr === 'string' ? result.stderr.trim() : '',
		]
			.filter(Boolean)
			.join('\n');
		throw new Error(`Command failed (${result.status}):\n${details}`);
	}

	return typeof result.stdout === 'string' ? result.stdout : '';
}

function runQuiet(command, args, options = {}) {
	return run(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForReleaseAssets(tag, timeoutMs) {
	const startedAt = Date.now();
	const required = new Set([
		'greater-components-cli.tgz',
		'registry/index.json',
		'registry/latest.json',
	]);

	while (true) {
		if (Date.now() - startedAt > timeoutMs) {
			throw new Error(`Timed out waiting for GitHub Release assets for ${tag}`);
		}

		try {
			const json = runQuiet('gh', ['release', 'view', tag, '--json', 'url,assets']);
			const release = JSON.parse(json);
			const assetNames = new Set((release.assets ?? []).map((a) => a.name));
			const missing = Array.from(required).filter((name) => !assetNames.has(name));

			if (missing.length === 0) {
				return release.url;
			}
		} catch {
			// Release not created yet, or GH API error; keep polling.
		}

		await sleep(10_000);
	}
}

async function waitForPrMerged(prNumber, timeoutMs) {
	const startedAt = Date.now();

	while (true) {
		if (Date.now() - startedAt > timeoutMs) {
			throw new Error(`Timed out waiting for PR #${prNumber} to merge`);
		}

		const json = runQuiet('gh', ['pr', 'view', String(prNumber), '--json', 'state,mergedAt,url']);
		const pr = JSON.parse(json);
		if (pr.state === 'MERGED') return pr.url;
		if (pr.state === 'CLOSED')
			throw new Error(`PR #${prNumber} was closed without merging: ${pr.url}`);

		await sleep(10_000);
	}
}

function getPr(base, head) {
	const json = runQuiet('gh', [
		'pr',
		'list',
		'--base',
		base,
		'--head',
		head,
		'--state',
		'open',
		'--json',
		'number,url',
		'--jq',
		'.[0]',
	]);
	if (!json || json === 'null') return null;
	return JSON.parse(json);
}

async function main() {
	const args = process.argv.slice(2);
	const version = args.find((arg) => !arg.startsWith('-'));
	const auto = args.includes('--auto');
	const wait = args.includes('--wait') || auto;

	const mergeMethodFlag = args.find((arg) => arg.startsWith('--merge-method='));
	const mergeMethodArg = mergeMethodFlag?.slice('--merge-method='.length);
	const mergeMethodIndex = args.indexOf('--merge-method');
	const mergeMethod =
		mergeMethodArg ?? (mergeMethodIndex !== -1 ? args[mergeMethodIndex + 1] : undefined) ?? 'merge';

	if (!version || args.includes('--help') || args.includes('-h')) {
		usage();
		process.exit(version ? 0 : 1);
	}

	if (!semverPattern.test(version)) {
		console.error(`Invalid semver version: ${version}`);
		process.exit(1);
	}

	if (!['merge', 'squash'].includes(mergeMethod)) {
		console.error(`Invalid --merge-method: ${mergeMethod} (expected merge|squash)`);
		process.exit(1);
	}

	const tag = `greater-v${version}`;
	const releaseBranch = `release/${tag}`;
	const releaseTitle = `chore(release): ${tag}`;

	console.log(`\n🏷️  Target release: ${tag}`);

	// Preconditions
	run('gh', ['auth', 'status']);

	const repoRoot = runQuiet('git', ['rev-parse', '--show-toplevel']);
	if (path.resolve(repoRoot) !== rootDir) {
		console.error(`Run this command from the repo root: ${rootDir}`);
		process.exit(1);
	}

	const dirty = runQuiet('git', ['status', '--porcelain']);
	if (dirty) {
		console.error('Working tree is not clean. Commit or stash changes first.');
		process.exit(1);
	}

	// Ensure refs are up to date
	run('git', ['fetch', 'origin', 'premain', 'main', '--tags', '--force']);

	// Ensure we can switch to premain
	try {
		run('git', ['switch', 'premain']);
	} catch {
		run('git', ['switch', '-c', 'premain', 'origin/premain']);
	}

	// Fast-forward premain to origin
	run('git', ['merge', '--ff-only', 'origin/premain']);

	// Create release branch
	try {
		run('git', ['switch', '-c', releaseBranch]);
	} catch {
		console.error(`Release branch already exists locally: ${releaseBranch}`);
		process.exit(1);
	}

	// Prepare release metadata
	run('pnpm', ['release:prepare', version]);

	// Commit
	run('git', [
		'add',
		'package.json',
		'packages/cli/package.json',
		'registry/index.json',
		'registry/latest.json',
	]);
	run('git', ['commit', '-s', '-m', releaseTitle]);
	run('git', ['push', '-u', 'origin', releaseBranch]);

	// PR into premain (merge immediately)
	let premainPr = getPr('premain', releaseBranch);
	if (!premainPr) {
		const body = [
			`Prepares ${tag} release metadata (GitHub-only).`,
			'',
			'This PR is safe to merge immediately. It updates:',
			'- root version (package.json)',
			'- CLI version (packages/cli/package.json)',
			'- registry/latest.json (ref/version)',
			'- registry/index.json (ref/version/checksums)',
		].join('\n');

		run('gh', [
			'pr',
			'create',
			'--base',
			'premain',
			'--head',
			releaseBranch,
			'--title',
			releaseTitle,
			'--body',
			body,
		]);
		premainPr = getPr('premain', releaseBranch);
	}

	if (!premainPr) {
		throw new Error('Failed to create or locate the premain PR');
	}

	console.log(`\n✅ Created premain PR: ${premainPr.url}`);
	run('gh', ['pr', 'merge', String(premainPr.number), '--merge', '--delete-branch']);

	// Open release PR premain -> main
	let mainPr = getPr('main', 'premain');
	if (!mainPr) {
		const body = [
			`Release cut for ${tag}.`,
			'',
			'Once merged, GitHub Actions will:',
			`- create the git tag ${tag} from main`,
			`- publish GitHub Release artifacts (greater-components-cli.tgz + registry files)`,
		].join('\n');

		run('gh', [
			'pr',
			'create',
			'--base',
			'main',
			'--head',
			'premain',
			'--title',
			releaseTitle,
			'--body',
			body,
		]);
		mainPr = getPr('main', 'premain');
	}

	if (!mainPr) {
		throw new Error('Failed to create or locate the main release PR');
	}

	console.log(`\n🚀 Release PR to main: ${mainPr.url}`);

	if (auto) {
		const mergeArgs = ['pr', 'merge', String(mainPr.number), '--auto', `--${mergeMethod}`];
		try {
			run('gh', mergeArgs);
			console.log('✅ Auto-merge enabled for the main release PR');
		} catch (error) {
			console.warn('\n⚠️  Failed to enable auto-merge for the main release PR');
			console.warn(String(error.message ?? error));
		}
	}

	if (!wait) {
		console.log('\nNext step: get the main PR approved and merged.');
		console.log(`- PR: ${mainPr.url}`);
		console.log(
			`- After merge, install via: npm install -g <GitHub Release URL>/${tag}/greater-components-cli.tgz`
		);
		return;
	}

	console.log('\n⏳ Waiting for main PR merge...');
	await waitForPrMerged(mainPr.number, 2 * 60 * 60 * 1000);

	console.log(`\n⏳ Waiting for GitHub Release assets for ${tag}...`);
	const releaseUrl = await waitForReleaseAssets(tag, 30 * 60 * 1000);

	console.log(`\n✅ Release ready: ${releaseUrl}`);
	console.log('\nInstall / upgrade:');
	console.log(
		`npm install -g https://github.com/equaltoai/greater-components/releases/download/${tag}/greater-components-cli.tgz`
	);
	console.log(`greater update --all --ref ${tag} --yes`);
}

main().catch((error) => {
	console.error('\n❌ Release cut failed');
	console.error(error.message ?? error);
	process.exit(1);
});
