# Upstream contract gaps

<!-- AI Training: how Greater records a missing piece of Lesser's contract instead of working around it -->

Gaps in the pinned Lesser contract that Greater has chosen to **surface** rather than reconstruct
client-side.

The rule this file exists to enforce: when the pinned snapshot cannot support a state the adapter or
component wants, Greater renders/reports the honest, neutral outcome and records the gap here. It
does not derive the missing state from data that happens to be present — a second implementation of
a server rule can disagree with the one the server actually applies, and a message string is not
contract.

Each entry names the pinned tag it was observed at, the exact upstream path, what Greater does
meanwhile, and what would let Greater stop doing that.

---

## `shareDraftForReview` conditional-create conflict carries no `extensions.code` (closed)

- **Observed at:** `v1.5.33` (`fea2ba6bc6978525e0d11aab54a27592ade5b954`)
- **Closed at:** `v1.6.0` (`858ad4f94fba055e2d0f9b6a8e0bb78dfea2c796`)
- **Greater surface:** `LesserGraphQLAdapter.shareDraftForReviewIfAbsent`,
  `isDraftReviewShareConflict` (`packages/adapters/src/graphql/LesserGraphQLAdapter.ts`)
- **Status:** closed — factory's `lesser`-filing obligation is withdrawn

### Resolution verified at `v1.6.0`

The complete upstream error chain now preserves a stable conflict code:

1. `pkg/storage/repositories/draft_repository.go` wraps the failed `IfNotExists` condition with
   `apperrors.DynamoDBConditionalCheckFailed`.
2. That `*AppError` maps to `CodeConflict` (`"CONFLICT"`) and survives
   `ShareDraftForReview`.
3. `graphQLErrorPresenter` writes the code to GraphQL `Extensions["code"]` as `"CONFLICT"`.
4. Greater's existing `DRAFT_REVIEW_CONFLICT_CODES` already accepts `CONFLICT`, so no adapter
   behavior change is required.

`isDraftReviewShareConflict` continues to classify on `extensions.code` only, accepting `CONFLICT`
and `ALREADY_EXISTS`.

Greater deliberately does **not** match the failure message. Server message text is not contract:
matching it would let an upstream wording change silently reclassify a real fault as a benign
"already invited" notice, and a token as broad as `duplicate` occurs in failures unrelated to this
grant. Under-reporting a known condition is recoverable; presenting a fault as an expected condition
is not.

`packages/adapters/src/graphql/__tests__/draftReviewShareConflict.test.ts` remains a defensive,
mock-driven assertion of Greater's code-only classification. It has no coupling to upstream Lesser
and is structurally incapable of detecting future upstream drift.
