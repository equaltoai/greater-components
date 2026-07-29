# greater-components Evidence Plan (Rubric v1.0.0)

`bash gov-infra/verifiers/gov-verify-rubric.sh` writes the schema `gov_rubric_report.v1` report to `gov-infra/evidence/gov-rubric-report.json` and per-control logs beside it. The protected-branch CI hook runs the same command and uploads `gov-infra/evidence/`.

| Controls             | Refresh command                 | Evidence                              |
| -------------------- | ------------------------------- | ------------------------------------- |
| QUA-_, CON-_, COM-\* | verifier                        | `gov-infra/evidence/*-output.log`     |
| SEC-3                | verifier / `check_supply_chain` | `gov-infra/evidence/SEC-3-output.log` |
| CMP-_, DOC-_         | verifier                        | planning docs and `DOC-5-parity.log`  |
| MAI-4                | verifier                        | `MAI-4-output.log`                    |
