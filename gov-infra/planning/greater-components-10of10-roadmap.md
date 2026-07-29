# greater-components Governance Roadmap (v1.0.0)

## M0 — Materialize CI-core governance

- Scaffold canonical `gov-infra`, planning evidence, deterministic verifier and staging PR CI hook.
- Do not weaken lint, coverage, contract, accessibility, registry or supply-chain gates.

## M1 — Resolve materialized rubric findings

- Pin every GitHub Action by immutable commit SHA if the supply-chain gate identifies a floating ref.
- Address failed checks in repository-owned follow-up changes; no exclusions or reduced thresholds.

## M2 — Maintain evidence

- Run the verifier at each PR head and retain `gov-infra/evidence/gov-rubric-report.json`.
- Update planning controls whenever a new deterministic gate is added.
