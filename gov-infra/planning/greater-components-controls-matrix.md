# greater-components Controls Matrix (v1.0.0)

| Control ID | Threat IDs                 | Control                                                                                                                               | Deterministic evidence |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| SEC-3      | THR-1                      | Pin GitHub Actions by immutable commit, require `pnpm-lock.yaml`, install with lifecycle scripts disabled, then scan lifecycle hooks. | `SEC-3-output.log`     |
| COM-2      | THR-1                      | Require Node 24 and the declared pnpm 10.25.0 toolchain.                                                                              | `COM-2-output.log`     |
| QUA-1      | THR-2                      | Run workspace unit/integration tests.                                                                                                 | `QUA-1-output.log`     |
| CON-3      | THR-2                      | Validate Lesser OpenAPI authorization and registry generated state.                                                                   | `CON-3-output.log`     |
| COM-1      | THR-2                      | Build workspace and validate registry generation.                                                                                     | `COM-1-output.log`     |
| QUA-2      | THR-3                      | Run the committed accessibility suite.                                                                                                | `QUA-2-output.log`     |
| SEC-4      | THR-3                      | Run CSP and accessibility CI checks.                                                                                                  | `SEC-4-output.log`     |
| MAI-4      | THR-4                      | Require a protected-branch GitHub Actions invocation of the rubric.                                                                   | `MAI-4-output.log`     |
| DOC-5      | THR-1, THR-2, THR-3, THR-4 | Require threat/control parity.                                                                                                        | `DOC-5-parity.log`     |
