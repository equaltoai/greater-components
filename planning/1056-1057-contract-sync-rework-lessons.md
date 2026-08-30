# Lessons — #1056/#1057 Lesser v1.6.28 + Lesser Host v1.6.8 sync rework

Durable repo-local memory from the standing-review rework of PR #1057
(`chore/sync-lesser-v1.6.28-lesser-host-v1.6.8`). Hosted `memory.append` was not
available in the delegate session, so the lesson is recorded here per the
delegation instruction ("append only a durable repo-local lesson after
resolution").

## 1. A contract sync is not done when the snapshot and generated files are in

The adversarial review found five gaps that the sync itself had shipped past:
weak verdict-record guards (no `current`/`stale`/`contentHash` exactness), no
generator-replay gate, a stale review-workflow doc still claiming the server
gate was absent at v1.6.0, a wrong registry-delta claim in the PR body (8
checksum entries, not 25; `introspection.json` is not registry-covered), and a
rubric report with no head attribution. Contract-sync PRs should ship the
exact-boundary guards, a replay gate, and doc truth in the same change — not
leave them for review.

## 2. pnpm overrides vs lockfile integrity

Adding a `pnpm.overrides` entry with `pnpm install --lockfile-only` re-resolved
the `@theory-cloud/facetheory` tarball and **dropped its `integrity` field** —
an unwanted supply-chain weakening. Fix: restore the lockfile and apply the
override change surgically (overrides block + importer specifiers), then prove
`pnpm install --frozen-lockfile` still passes. A lockfile regeneration can
silently remove integrity metadata; always diff the lockfile for integrity
loss before committing.

## 3. Generator-replay gates must scope to what generators rewrite

A replay gate that diffs the whole tree is fine, but the fail-path test must
mutate a generator _input_ (schema), not an output file: generators overwrite
their outputs, so corrupting `lesser-api.ts` gets healed, not detected. The
proven drift test (schema change → 3-file diff → non-zero exit → generated
files restored) is the honest proof the gate fires.

## 4. Namespace-rendered verifiers stay byte-stable

`gov-infra/verifiers/gov-verify-rubric.sh` is rendered from the namespace pack;
extend provenance with a **repo-owned** sibling (`gov-write-provenance.mjs`)
instead of editing the rendered verifier, so future gov-init re-materialization
does not conflict. `gov_rubric_report.v1` cannot carry a commit SHA, so bind
the exact head with a sidecar (SHA + report checksum + verifier identity) and
document that the CI-generated artifact, not the pre-commit JSON, is the
staging proof.
