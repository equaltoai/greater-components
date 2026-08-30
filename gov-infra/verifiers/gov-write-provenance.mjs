#!/usr/bin/env node
/**
 * Exact-head provenance sidecar for the rubric report (fail-closed).
 *
 * Repo-local provenance writer — NOT part of the namespace-rendered governance
 * pack (that is `gov-infra/verifiers/gov-verify-rubric.sh`; this file is
 * Greater-owned and must stay byte-stable across gov-init re-materializations).
 *
 * `gov_rubric_report.v1` carries no commit attribution, so the report's schema
 * cannot hold a head SHA. This writer emits a sidecar next to the report that
 * binds the exact head the report was generated at:
 *
 *   - `headSha` — the expected head under test (the PR head SHA from the
 *     workflow's `EXPECTED_HEAD_SHA`, the `pull_request.head.sha` in the event
 *     payload, or `GITHUB_SHA` for non-PR runs), which must equal the actually
 *     checked-out `git rev-parse HEAD`;
 *   - `reportChecksumSha256` — binds the sidecar to these exact report bytes;
 *   - `verifier` — the canonical verifier identity (path + pack version/digest
 *     read from the report itself);
 *   - `source` — `github-actions` or `local`; `github-actions` is claimed only
 *     when the runner environment is genuinely GitHub Actions (see below);
 *   - `run` — immutable GitHub run identity (`runId`, `runAttempt`, `runUrl`,
 *     `workflow`, `repository`) when `source` is `github-actions`, `null`
 *     otherwise.
 *
 * Fail-closed semantics: in a GitHub Actions environment the writer fails
 * (non-zero exit) — and the workflow therefore fails — if any of the required
 * runner variables are missing, if `GITHUB_SHA` or the expected head is not a
 * 40-hex SHA, or if the checked-out HEAD disagrees with the expected PR head.
 * A `pull_request` event must carry `pull_request.head.sha` in the event
 * payload and it must agree with the checked-out HEAD. For non-PR events
 * (push / workflow_dispatch / schedule), the checked-out HEAD must also agree
 * with the runner's `GITHUB_SHA`; for `pull_request` events the runner's
 * `GITHUB_SHA` is the PR merge-ref SHA and is intentionally not compared (the
 * event head is authoritative). A locally set `GITHUB_SHA` can never upgrade
 * `source` to `github-actions` on its own: the full GitHub Actions environment
 * must be present and consistent.
 *
 * The CI-generated artifact (report + sidecar uploaded from
 * `.github/workflows/gov-rubric.yml` only after verifier + provenance both
 * succeed) is the exact-head staging proof; the pre-commit JSON in the PR is a
 * snapshot, not that proof. See
 * `gov-infra/planning/greater-components-evidence-plan.md`.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = 'gov-infra/evidence/gov-rubric-report.json';
const SIDECAR = 'gov-infra/evidence/gov-rubric-report.provenance.json';
const VERIFIER = 'gov-infra/verifiers/gov-verify-rubric.sh';

const SHA1_RE = /^[0-9a-f]{40}$/;

// Runner variables GitHub sets for every job; the writer refuses to claim a
// `github-actions` source without all of them.
const REQUIRED_CI_ENV = [
	'GITHUB_SHA',
	'GITHUB_RUN_ID',
	'GITHUB_RUN_ATTEMPT',
	'GITHUB_REPOSITORY',
	'GITHUB_SERVER_URL',
	'GITHUB_WORKFLOW',
	'GITHUB_EVENT_NAME',
];

function fail(errors) {
	console.error(`gov-write-provenance FAILED\n\n${errors.join('\n')}`);
	process.exit(1);
}

function gitHead() {
	try {
		return String(
			execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' })
		).trim();
	} catch {
		return null;
	}
}

function eventHeadSha() {
	const eventPath = process.env.GITHUB_EVENT_PATH;
	if (!eventPath) return null;
	try {
		const event = JSON.parse(readFileSync(eventPath, 'utf8'));
		return event?.pull_request?.head?.sha ?? null;
	} catch {
		return null;
	}
}

const reportPath = join(ROOT, REPORT);
let report;
try {
	report = JSON.parse(readFileSync(reportPath, 'utf8'));
} catch (error) {
	console.error(
		`gov-write-provenance: cannot read ${REPORT} (${error.message}); run gov-verify-rubric.sh first.`
	);
	process.exit(1);
}

const env = process.env;
const isGitHubActions = env.GITHUB_ACTIONS === 'true';
const githubSha = env.GITHUB_SHA ?? null;
const eventHead = eventHeadSha();
const expectedHead = env.EXPECTED_HEAD_SHA ?? eventHead ?? githubSha;
const actualHead = gitHead();
const reportChecksumSha256 = createHash('sha256').update(readFileSync(reportPath)).digest('hex');

const errors = [];
if (isGitHubActions) {
	for (const name of REQUIRED_CI_ENV) {
		if (!env[name]) errors.push(`missing required GitHub Actions variable ${name}`);
	}
	if (env.GITHUB_EVENT_NAME === 'pull_request' && !eventHead) {
		errors.push(
			'pull_request event payload carries no pull_request.head.sha (GITHUB_EVENT_PATH missing or malformed)'
		);
	}
}
if (githubSha !== null && !SHA1_RE.test(githubSha)) {
	errors.push(`GITHUB_SHA is not a 40-hex SHA: ${githubSha}`);
}
if (expectedHead && !SHA1_RE.test(expectedHead)) {
	errors.push(`expected head SHA is not a 40-hex SHA: ${expectedHead}`);
}
if (expectedHead && eventHead && expectedHead !== eventHead) {
	errors.push(
		`expected head ${expectedHead} disagrees with event payload pull_request.head.sha ${eventHead}`
	);
}
if (actualHead === null) {
	errors.push('cannot resolve the checked-out HEAD (git rev-parse HEAD failed)');
}
if (actualHead && expectedHead && actualHead !== expectedHead) {
	errors.push(
		`checked-out HEAD ${actualHead} does not match the expected head ${expectedHead}; ` +
			'CI must check out the immutable PR head, not the refs/pull merge SHA'
	);
}
// For pull_request events the runner's GITHUB_SHA is the PR merge-ref SHA
// (refs/pull/<n>/merge), which legitimately differs from the checked-out
// immutable PR head; head equivalence for PRs is enforced above via
// EXPECTED_HEAD_SHA / pull_request.head.sha. GITHUB_SHA is comparable only
// for non-PR events (push / workflow_dispatch / schedule), where it is the
// commit under test.
if (
	isGitHubActions &&
	env.GITHUB_EVENT_NAME !== 'pull_request' &&
	githubSha &&
	actualHead &&
	actualHead !== githubSha
) {
	errors.push(`checked-out HEAD ${actualHead} does not match GITHUB_SHA ${githubSha}`);
}
if (errors.length > 0) fail(errors);

const source = isGitHubActions ? 'github-actions' : 'local';
const run = isGitHubActions
	? {
			runId: env.GITHUB_RUN_ID,
			runAttempt: env.GITHUB_RUN_ATTEMPT,
			runUrl: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
			workflow: env.GITHUB_WORKFLOW,
			repository: env.GITHUB_REPOSITORY,
			eventName: env.GITHUB_EVENT_NAME,
		}
	: null;

const sidecar = {
	reportPath: REPORT,
	reportChecksumSha256,
	headSha: expectedHead ?? actualHead,
	source,
	run,
	generatedAt: report.timestamp,
	canonicalReportSchema: 'gov_rubric_report.v1',
	verifier: {
		path: VERIFIER,
		packVersion: report.pack?.version,
		packDigest: report.pack?.digest,
	},
	summary: report.summary,
};

writeFileSync(join(ROOT, SIDECAR), `${JSON.stringify(sidecar, null, 2)}\n`);
console.log(
	`Provenance written to ${SIDECAR}: head ${sidecar.headSha} (${source}${run ? `, run ${run.runId}` : ''}), ` +
		`report sha256 ${reportChecksumSha256}, verifier ${VERIFIER}`
);
