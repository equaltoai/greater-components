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

## `shareDraftForReview` conditional-create conflict carries no `extensions.code`

- **Observed at:** `v1.5.33` (`fea2ba6bc6978525e0d11aab54a27592ade5b954`)
- **Greater surface:** `LesserGraphQLAdapter.shareDraftForReviewIfAbsent`,
  `isDraftReviewShareConflict` (`packages/adapters/src/graphql/LesserGraphQLAdapter.ts`)
- **Status:** open — reported via factory for filing against `lesser`

### What happens

A duplicate reviewer invite loses the conditional create and Greater receives a GraphQL error with
**no `extensions.code` at all**, so it cannot be distinguished from an unrelated fault by any stable
signal.

The error keeps its type all the way to the wire, and loses it at the last step:

1. `pkg/storage/repositories/draft_repository.go` — `CreateDraftReviewGrant` writes with
   `IfNotExists()`, i.e. an `attribute_not_exists` condition, and returns the driver error
   unchanged:

   ```go
   func (r *DraftRepository) CreateDraftReviewGrant(ctx context.Context, grant *models.DraftReviewGrant) error {
   	if err := grant.UpdateKeys(); err != nil {
   		return err
   	}
   	return r.db.WithContext(ctx).Model(grant).IfNotExists().Create()
   }
   ```

2. `tabletheory v2.0.5` — `pkg/query/put_operations.go` answers the failed condition with a plain
   sentinel-wrapped error, `condition check failed: item with the same key already exists`. It is
   **not** a Lesser `*AppError`.

3. `pkg/services/cms/draft_review.go` — `DraftService.ShareDraftForReview` returns that error
   verbatim (`return nil, err`), and `graph/mutation_resolvers_cms.go` `ShareDraftForReview` does
   the same.

4. `cmd/graphql/main.go` — `graphQLErrorPresenter` only attaches a code when the error _is_ an
   `AppError`:

   ```go
   if appErr, ok := apperrors.AsAppError(err); ok {
   	gqlErr.Extensions["code"] = string(appErr.Code)
   	...
   }
   ```

   `apperrors.AsAppError` is `errors.As(err, &appErr)`, and nothing in the chain above is an
   `*AppError`, so no `code` is written.

Lesser already has the right code for this condition and uses it elsewhere:
`pkg/errors/storage.go` `DynamoDBConditionalCheckFailed` returns `CodeConflict` (`"CONFLICT"`), and
`pkg/storage/theorydb/errors.go` `MapError` maps `"condition check failed"` onto it. This repository
path just never routes through `MapError`.

### What Greater does meanwhile

`isDraftReviewShareConflict` classifies on `extensions.code` only, accepting `CONFLICT` and
`ALREADY_EXISTS`. With no code present, a duplicate share is **not** reported as
`already-invited`; it is rethrown as an ordinary error.

Greater deliberately does **not** match the failure message. Server message text is not contract:
matching it would let an upstream wording change silently reclassify a real fault as a benign
"already invited" notice, and a token as broad as `duplicate` occurs in failures unrelated to this
grant. Under-reporting a known condition is recoverable; presenting a fault as an expected condition
is not.

Note this is a race-only path in practice: `ShareDraftForReview` reads the grant first and takes the
regrant branch when one exists, so the conditional create only loses when two shares land
concurrently.

### What closes it

Any Lesser change that gives the conditional-create failure a stable `extensions.code` — most
directly, routing the repository error through `theorydb.MapError` (or wrapping it with
`errors.DynamoDBConditionalCheckFailed`) so the presenter finds an `*AppError`. No Greater change is
then required: `isDraftReviewShareConflict` already accepts `CONFLICT`.

The tripwire is
`packages/adapters/src/graphql/__tests__/draftReviewShareConflict.test.ts`, which asserts that an
uncoded conflict is rethrown. When that test starts looking wrong, the gap has closed — resync the
snapshot and update this entry.
