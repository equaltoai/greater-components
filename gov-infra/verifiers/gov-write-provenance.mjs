#!/usr/bin/env node
/**
 * Exact-head provenance sidecar for the rubric report.
 *
 * Repo-local provenance writer — NOT part of the namespace-rendered governance
 * pack (that is `gov-infra/verifiers/gov-verify-rubric.sh`; this file is
 * Greater-owned and must stay byte-stable across gov-init re-materializations).
 *
 * `gov_rubric_report.v1` carries no commit attribution, so the report's schema
 * cannot hold a head SHA. This writer emits a sidecar next to the report that
 * binds the exact head the report was generated at:
 *
 *   - `headSha` — GitHub Actions `GITHUB_SHA` (the exact commit under test),
 *     falling back to `git rev-parse HEAD` for local runs;
 *   - `reportChecksumSha256` — binds the sidecar to these exact report bytes;
 *   - `verifier` — the canonical verifier identity (path + pack version/digest
 *     read from the report itself);
 *   - `source` — `github-actions` or `local`, so a checked-in sidecar can never
 *     be mistaken for a CI run.
 *
 * The CI-generated artifact (report + sidecar uploaded from
 * `.github/workflows/gov-rubric.yml`) is the exact-head staging proof; the
 * pre-commit JSON in the PR is a snapshot, not that proof. See
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

const headSha =
	process.env.GITHUB_SHA ??
	String(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' })).trim();
const source = process.env.GITHUB_SHA ? 'github-actions' : 'local';
const reportChecksumSha256 = createHash('sha256').update(readFileSync(reportPath)).digest('hex');

const sidecar = {
	reportPath: REPORT,
	reportChecksumSha256,
	headSha,
	source,
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
	`Provenance written to ${SIDECAR}: head ${headSha} (${source}), report sha256 ${reportChecksumSha256}, verifier ${VERIFIER}`
);
