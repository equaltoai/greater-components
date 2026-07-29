# greater-components Threat Model (custom — v1.0.0)

## Scope

- **System:** Svelte 5 Fediverse UI component library, CLI source installer, adapters, registry, docs and playground.
- **In-scope data:** source, registry checksums, pinned public API contracts, CI tokens and runtime configuration; no wallet keys or payment data.
- **Environments:** development, staging, protected main/release; production-like means staging CI against the committed lockfile.
- **Third parties:** GitHub Actions, pnpm registry, Lesser and Lesser Host contract snapshots.
- **Out of scope:** backend processing, key custody, payment processing and cloud deployment.
- **Assurance target:** audit-ready repository controls.

## Assets and trust boundaries

- **Assets:** component API stability, WCAG baseline, `--gr-*` theming API, contract snapshots, registry checksums, release tags.
- **Trust boundaries:** contributor code and dependencies; GitHub Actions; CLI consumers; upstream Lesser/Lesser Host snapshots.
- **Entry points:** pull requests to `staging`, CLI registry generation, adapter contract sync and release workflow.

| Threat ID | Title                    | What can go wrong                                                               | Primary controls    | Verification                                          |
| --------- | ------------------------ | ------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------- |
| THR-1     | Supply-chain compromise  | A mutable Action, lifecycle hook, or unlocked dependency executes in CI.        | SEC-3, COM-2        | `check_supply_chain`                                  |
| THR-2     | Consumer breakage        | Source-installed consumers receive invalid build, types, or registry checksums. | QUA-1, CON-3, COM-1 | workspace tests, OpenAPI auth and registry validation |
| THR-3     | Accessibility regression | Interactive surfaces regress keyboard or assistive-technology behaviour.        | QUA-2, SEC-4        | accessibility test suite                              |
| THR-4     | Governance drift         | CI ceases to run the deterministic rubric or reports stale evidence.            | MAI-4, DOC-5        | verifier CI-hook and parity checks                    |
