# greater-components Evidence Plan (Rubric v1.0.0)

`bash gov-infra/verifiers/gov-verify-rubric.sh` writes the schema `gov_rubric_report.v1` report to `gov-infra/evidence/gov-rubric-report.json` and per-control logs beside it. The protected-branch CI hook runs the same command and uploads `gov-infra/evidence/`.

## Exact-head provenance (sidecar)

`gov_rubric_report.v1` carries no commit attribution, so the report's schema cannot hold a head SHA. The CI hook therefore writes a repo-local sidecar after the verifier:

- `node gov-infra/verifiers/gov-write-provenance.mjs` → `gov-infra/evidence/gov-rubric-report.provenance.json`
- Fields: `headSha` (GitHub Actions `GITHUB_SHA` — the exact commit under test; `git rev-parse HEAD` for local runs), `reportChecksumSha256`, `verifier` (path + pack version/digest from the report), `generatedAt`, `source` (`github-actions` | `local`).

**The CI-generated artifact (report + sidecar, uploaded as `gov-rubric-evidence` from `.github/workflows/gov-rubric.yml`) is the exact-head staging proof.** The pre-commit `gov-rubric-report.json` in a PR is a snapshot of a local run at the code head; it is evidence that the head was green, not the authoritative exact-head proof. The provenance writer is Greater-owned — it is NOT part of the namespace-rendered pack (`gov-infra/verifiers/gov-verify-rubric.sh` is the rendered verifier and stays byte-stable across gov-init re-materializations).

| Controls             | Refresh command                 | Evidence                              |
| -------------------- | ------------------------------- | ------------------------------------- |
| QUA-_, CON-_, COM-\* | verifier                        | `gov-infra/evidence/*-output.log`     |
| SEC-3                | verifier / `check_supply_chain` | `gov-infra/evidence/SEC-3-output.log` |
| CMP-_, DOC-_         | verifier                        | planning docs and `DOC-5-parity.log`  |
| MAI-4                | verifier                        | `MAI-4-output.log`                    |
