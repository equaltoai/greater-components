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

## 5. Round 3: pull_request CI must check out the immutable PR head, not the merge SHA

`actions/checkout` on a `pull_request` event defaults to `refs/pull/<n>/merge` — a synthetic
merge commit, not the commit under review. Round-2 CI "at the exact head" was therefore
evidence about the merge SHA, not the PR head. Every `pull_request` workflow now checks out
`ref: ${{ github.event.pull_request.head.sha || github.sha }}`, verifies `git rev-parse HEAD`
equals the expected head (failing the job otherwise), and the provenance writer is fail-closed:
it fails unless the checked-out HEAD, the expected PR head, `GITHUB_SHA`, and the event payload's
`pull_request.head.sha` all agree, and it embeds the immutable GitHub run identity (runId /
runAttempt / runUrl / workflow / repository). The `gov-rubric-evidence` artifact is uploaded only
after verifier + provenance both succeed; failures upload an explicit failure manifest.

## 6. Round 3: replay gates must refuse before mutating developer WIP

The first replay gate ran the generators first and restored afterwards — a developer's
pre-existing tracked edit or untracked file under the generated roots would have been
overwritten by the generator and then erased by the restore. The gate now refuses before any
generator runs whenever the generated roots contain pre-existing tracked or untracked dirt
(WIP survives untouched), and because refusal guarantees a clean start, cleanup can safely
remove only replay-created changes (tracked via `git restore`, untracked files and directories
via roots-scoped `git clean -fd`), with cleanup exit codes checked and a final clean-status
verify failing loudly. Proofs: clean path (exit 0), generator-drift path (schema change → diff
→ exit 1 → roots restored), dirty tracked-file refusal, dirty untracked-file refusal, and
untracked-directory refusal, all without data loss (covered by
`scripts/check-generator-replay.test.mjs` and live runs).

## 7. Round 3: lockfile constraint checks must be package-specific

The codegen v5 constraint initially scanned `@graphql-codegen/(typescript|typescript-operations)`
with one regex per loop iteration, so both plugins observed the same combined major set — a
`typescript-operations` v6 entry could not be attributed to the right package. The check now
anchors each plugin's own lockfile keys (`@graphql-codegen/typescript@…` never matches
`@graphql-codegen/typescript-operations@…` and vice versa), fixes the `CODENGE_PACKAGES` →
`CODEGEN_PACKAGES` naming typo, and unit-proves each plugin independently.
