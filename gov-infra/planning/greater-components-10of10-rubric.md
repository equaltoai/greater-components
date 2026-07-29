# greater-components 10-of-10 Rubric (v1.0.0)

The deterministic entrypoint is `bash gov-infra/verifiers/gov-verify-rubric.sh`. Every check fails closed; missing tooling is BLOCKED and does not yield a passing report.

| Category        | Controls                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Quality         | workspace tests, accessibility tests, 75% lines/functions/statements and 60% branches coverage       |
| Consistency     | Prettier, ESLint/typecheck, OpenAPI and registry validation                                          |
| Completeness    | build, Node/pnpm pins, package parity, coverage floor, CSP/logging posture                           |
| Security        | static configuration checks, vulnerability audit, strict supply-chain scan, accessibility/CSP checks |
| Compliance      | controls matrix, evidence plan, threat model                                                         |
| Maintainability | source-budget, planning, duplicate verifier and CI hook checks                                       |
| Docs            | planning artifacts and threat/control parity                                                         |
