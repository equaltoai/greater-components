# greater-components Evidence Plan (Rubric v1.0.0)

`bash gov-infra/verifiers/gov-verify-rubric.sh` writes the schema `gov_rubric_report.v1` report to `gov-infra/evidence/gov-rubric-report.json` and per-control logs beside it. The protected-branch CI hook runs the same command and uploads `gov-infra/evidence/`.

## Exact-head provenance (sidecar, fail-closed)

`gov_rubric_report.v1` carries no commit attribution, so the report's schema cannot hold a head SHA. The CI hook therefore writes a repo-local sidecar after the verifier:

- `node gov-infra/verifiers/gov-write-provenance.mjs` → `gov-infra/evidence/gov-rubric-report.provenance.json`
- Fields: `headSha` (the expected head under test — the PR head from the workflow's `EXPECTED_HEAD_SHA`, the `pull_request.head.sha` in the event payload, or `GITHUB_SHA` for non-PR runs), `reportChecksumSha256`, `verifier` (path + pack version/digest from the report), `generatedAt`, `summary`, `source` (`github-actions` | `local`), and `run` (immutable GitHub run identity — `runId`, `runAttempt`, `runUrl`, `workflow`, `repository`, `eventName` — present only when `source` is `github-actions`).

### Exact-head CI contract (round-3)

- **Checkout**: every `pull_request` workflow (`test.yml`, `lint.yml`, `gov-rubric.yml`) checks out `ref: ${{ github.event.pull_request.head.sha || github.sha }}` — the immutable PR head, never the `refs/pull/…/merge` SHA — and verifies `git rev-parse HEAD` equals the expected head, failing the job otherwise.
- **Writer is fail-closed**: when running in GitHub Actions, `gov-write-provenance.mjs` fails (and the job fails) unless the required runner variables are present, `GITHUB_SHA` and the expected head are 40-hex SHAs, and the checked-out HEAD agrees with the expected PR head, `GITHUB_SHA`, and the event payload's `pull_request.head.sha`. A locally set `GITHUB_SHA` can never upgrade `source` to `github-actions` on its own — the full, consistent runner environment is required.
- **Artifact gating**: `gov-rubric.yml` uploads the `gov-rubric-evidence` artifact **only when the verifier and the provenance writer both succeed**. On failure it uploads an explicit `gov-rubric-failure` manifest instead, so the absence of the evidence artifact can never be mistaken for PASS.

**The CI-generated artifact (report + sidecar, uploaded as `gov-rubric-evidence` from `.github/workflows/gov-rubric.yml` at the exact PR head) is the staging proof.** The pre-commit `gov-rubric-report.json` in a PR is a snapshot of a local run at the code head (`source: "local"`, `run: null`); it is evidence that the head was green, not the authoritative exact-head proof. The provenance writer is Greater-owned — it is NOT part of the namespace-rendered pack (`gov-infra/verifiers/gov-verify-rubric.sh` is the rendered verifier and stays byte-stable across gov-init re-materializations).

| Controls             | Refresh command                 | Evidence                              |
| -------------------- | ------------------------------- | ------------------------------------- |
| QUA-_, CON-_, COM-\* | verifier                        | `gov-infra/evidence/*-output.log`     |
| SEC-3                | verifier / `check_supply_chain` | `gov-infra/evidence/SEC-3-output.log` |
| CMP-_, DOC-_         | verifier                        | planning docs and `DOC-5-parity.log`  |
| MAI-4                | verifier                        | `MAI-4-output.log`                    |
