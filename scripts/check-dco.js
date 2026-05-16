#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);

function argValue(name) {
	const index = args.indexOf(name);
	if (index === -1) return undefined;
	return args[index + 1];
}

function git(gitArgs) {
	return execFileSync('git', gitArgs, { encoding: 'utf8' }).trimEnd();
}

function error(message) {
	console.error(`::error::${message}`);
}

function parseCommit(sha) {
	const raw = git(['show', '-s', '--format=%H%x00%P%x00%an%x00%ae%x00%B', sha]);
	const [commitSha, parentLine, authorName, authorEmail, ...bodyParts] = raw.split('\0');
	return {
		sha: commitSha,
		parents: parentLine.length > 0 ? parentLine.split(' ') : [],
		authorName,
		authorEmail,
		body: bodyParts.join('\0'),
	};
}

function validSignoff(commit) {
	const signoffPattern = /^Signed-off-by:\s*(.*?)\s*<([^>]+)>\s*$/gim;
	const matches = [...commit.body.matchAll(signoffPattern)];
	return matches.length > 0;
}

function remediationConfigEnabled() {
	if (!existsSync('.github/dco.yml')) return false;
	const config = readFileSync('.github/dco.yml', 'utf8');
	return /allowRemediationCommits:\s*[\s\S]*?\bindividual:\s*true\b/i.test(config);
}

function remediationEntries(commit) {
	const firstLine = commit.body.split(/\r?\n/, 1)[0] ?? '';
	const header = firstLine.match(/^DCO remediation commit for (.+) <([^>]+)>\s*$/i);
	if (!header || !validSignoff(commit)) return [];

	const [, remediatorName, remediatorEmail] = header;
	const normalizedEmail = remediatorEmail.toLowerCase();
	if (commit.authorEmail.toLowerCase() !== normalizedEmail) return [];

	const entryPattern =
		/^I,\s*(.+)\s*<([^>]+)>,\s*hereby add my Signed-off-by to this commit:\s*([0-9a-f]{40})\s*$/gim;
	return [...commit.body.matchAll(entryPattern)]
		.filter((match) => match[2].toLowerCase() === normalizedEmail)
		.map((match) => ({
			target: match[3],
			name: remediatorName,
			email: remediatorEmail,
			remediationSha: commit.sha,
		}));
}

const base = argValue('--base') ?? process.env.DCO_BASE_REF ?? process.env.BASE_REF;
const head = argValue('--head') ?? process.env.DCO_HEAD_REF ?? process.env.HEAD_REF ?? 'HEAD';

if (!base) {
	error('Missing DCO base ref. Pass --base <ref> or set DCO_BASE_REF.');
	process.exit(1);
}

let commits;
try {
	const output = git(['rev-list', `${base}..${head}`]);
	commits = output.length > 0 ? output.split('\n') : [];
} catch (cause) {
	error(`Unable to list commits for ${base}..${head}: ${cause.message}`);
	process.exit(1);
}

if (commits.length === 0) {
	console.log(`dco: no commits to check in ${base}..${head}`);
	process.exit(0);
}

const parsedCommits = commits.map(parseCommit);
const individualRemediationEnabled = remediationConfigEnabled();
const remediations = new Map();

if (individualRemediationEnabled) {
	for (const commit of parsedCommits) {
		for (const entry of remediationEntries(commit)) {
			remediations.set(entry.target, entry);
		}
	}
}

let failed = false;
for (const commit of parsedCommits) {
	if (commit.parents.length > 1) {
		console.log(`dco: skipping merge commit ${commit.sha}`);
		continue;
	}

	if (validSignoff(commit)) {
		console.log(`dco: ${commit.sha} signed off by ${commit.authorName} <${commit.authorEmail}>`);
		continue;
	}

	const remediation = remediations.get(commit.sha);
	if (
		individualRemediationEnabled &&
		remediation &&
		remediation.email.toLowerCase() === commit.authorEmail.toLowerCase()
	) {
		console.log(
			`dco: ${commit.sha} remediated by ${remediation.remediationSha} for ${remediation.name} <${remediation.email}>`
		);
		continue;
	}

	error(
		`Commit ${commit.sha} is missing Signed-off-by for ${commit.authorName} <${commit.authorEmail}>`
	);
	failed = true;
}

if (failed) process.exit(1);
console.log(`dco: PASS (${parsedCommits.length} commits checked)`);
