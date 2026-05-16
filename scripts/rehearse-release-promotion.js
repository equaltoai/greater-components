#!/usr/bin/env node
/**
 * Rehearse Greater's release-promotion merge path.
 *
 * The check is intentionally git-topology aware. Ordinary PRs to `staging` are often
 * squash-merged, so use `--simulate-squash` for those PRs. Release-topology repair
 * branches must be merged with a merge commit and should be checked without
 * `--simulate-squash` so their premain/main ancestry is preserved.
 */

import { spawnSync } from 'node:child_process';

const gitIdentityEnv = {
	GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || 'greater release rehearsal',
	GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL || 'release-rehearsal@equalto.ai',
	GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || 'greater release rehearsal',
	GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL || 'release-rehearsal@equalto.ai',
};

function parseArgs(argv) {
	const args = {
		candidate: 'HEAD',
		stagingBase: 'origin/staging',
		premain: 'origin/premain',
		main: 'origin/main',
		simulateSquash: false,
	};

	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === '--') continue;
		if (arg === '--simulate-squash') {
			args.simulateSquash = true;
			continue;
		}

		const key = arg.startsWith('--') ? arg.slice(2) : null;
		if (!key) die(`Unexpected positional argument: ${arg}`);

		const value = argv[i + 1];
		if (!value || value.startsWith('--')) die(`Missing value for ${arg}`);
		i += 1;

		if (key === 'candidate') args.candidate = value;
		else if (key === 'staging-base') args.stagingBase = value;
		else if (key === 'premain') args.premain = value;
		else if (key === 'main') args.main = value;
		else die(`Unknown argument: ${arg}`);
	}

	return args;
}

function die(message) {
	console.error(`release-rehearsal: FAIL (${message})`);
	process.exit(1);
}

function git(args, { allowFailure = false, input = undefined } = {}) {
	const result = spawnSync('git', args, {
		encoding: 'utf8',
		env: { ...process.env, ...gitIdentityEnv },
		input,
		stdio: ['pipe', 'pipe', 'pipe'],
	});

	if (!allowFailure && result.status !== 0) {
		const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
		die(`git ${args.join(' ')} failed${detail ? `\n${detail}` : ''}`);
	}

	return result;
}

function resolveCommit(ref, label) {
	const result = git(['rev-parse', '--verify', `${ref}^{commit}`], { allowFailure: true });
	if (result.status !== 0) {
		const hint = label.startsWith('origin/')
			? `run: git fetch origin ${label.replace(/^origin\//, '')}`
			: `check ref: ${label}`;
		die(`missing ${label} (${hint})`);
	}
	return result.stdout.trim();
}

function resolveTree(ref) {
	return git(['rev-parse', '--verify', `${ref}^{tree}`]).stdout.trim();
}

function short(ref) {
	return git(['rev-parse', '--short', ref]).stdout.trim();
}

function commitTree(tree, parents, message) {
	const args = ['commit-tree', tree];
	for (const parent of parents) args.push('-p', parent);
	return git(args, { input: `${message}\n` }).stdout.trim();
}

function mergeTree(base, head, label) {
	const result = git(['merge-tree', '--write-tree', base, head], { allowFailure: true });
	if (result.status !== 0) {
		const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
		die(`${label} would conflict${details ? `\n${details}` : ''}`);
	}

	const tree = result.stdout.trim().split('\n')[0]?.trim();
	if (!/^[0-9a-f]{40}$/i.test(tree)) die(`${label} did not produce a tree`);

	console.log(`release-rehearsal: PASS ${label} (${short(base)} <- ${short(head)})`);
	return tree;
}

function main() {
	const args = parseArgs(process.argv.slice(2));

	const candidate = resolveCommit(args.candidate, args.candidate);
	const stagingBase = resolveCommit(args.stagingBase, args.stagingBase);
	const premain = resolveCommit(args.premain, args.premain);
	const mainBranch = resolveCommit(args.main, args.main);

	console.log('release-rehearsal: refs');
	console.log(`  candidate:    ${args.candidate} (${short(candidate)})`);
	console.log(`  staging base: ${args.stagingBase} (${short(stagingBase)})`);
	console.log(`  premain:      ${args.premain} (${short(premain)})`);
	console.log(`  main:         ${args.main} (${short(mainBranch)})`);
	console.log(
		`  mode:         ${args.simulateSquash ? 'simulate squash into staging' : 'preserve candidate topology'}`
	);

	const stagedCandidate = args.simulateSquash
		? commitTree(resolveTree(candidate), [stagingBase], 'synthetic: squash candidate into staging')
		: candidate;

	if (args.simulateSquash) {
		console.log(`  synthetic staging: ${short(stagedCandidate)}`);
	}

	const stagingToPremainTree = mergeTree(premain, stagedCandidate, 'staging -> premain promotion');
	const syntheticPremain = commitTree(
		stagingToPremainTree,
		[premain, stagedCandidate],
		'synthetic: staging promoted to premain'
	);
	console.log(`  synthetic premain: ${short(syntheticPremain)}`);

	mergeTree(mainBranch, stagedCandidate, 'staging -> main direct promotion');
	mergeTree(mainBranch, syntheticPremain, 'premain -> main promotion');

	console.log('release-rehearsal: PASS (all promotion paths are conflict-free)');
}

main();
