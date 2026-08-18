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

---

## Historical hosted-genesis cross-repo byte-agreement coverage unavailable

- **Observed at:** Lesser `v1.6.0` (`858ad4f94fba055e2d0f9b6a8e0bb78dfea2c796`) and Lesser Host
  `v1.6.0` (`01f916d5ef6f80c749779a4156ffde7cfb3a7eae`)
- **Greater surface:** historical `host-v1.0.7` fixtures and
  `HostedSoulBootstrapProject49Representability.test.ts`
- **Status:** open coverage gap — re-establish when a same-version fixture pair exists

The historical host-v1.0.7 cross-repo byte-agreement fixtures and the Project 49 representability
assertion were deliberately dropped in this sync. At the v1.6.0 pins, no same-version Lesser/Host
fixture pair exists: Lesser vendors `testdata/hosted-genesis/v1.0.6/`, while Lesser Host ships
current-era fixtures, and the two fixture sets have diverged.

The removed assertion is coverage Greater intends to re-establish when the upstream repositories
again publish a same-version fixture pair. Greater does not restore or synthesize mismatched
historical fixtures in the meantime.

---

## Quote Posts REST compatibility surface was 501-only (closed)

- **Observed at:** `v1.6.0` (`858ad4f94fba055e2d0f9b6a8e0bb78dfea2c796`)
- **Closed at:** `v1.6.5` (`a1eb3c6740bd5aca99273130e2b52d3c4c5775ea`), re-verified at `v1.6.22`
  (`0e3e1315ad31b63d859285df4692d6db9afcb14b`)
- **Greater surface:** REST adapter compatibility; quote flows use GraphQL
- **Status:** closed — no Greater code change required

At v1.6.0, four Quote Posts REST endpoints lost their `200` responses and were `501`-only:

- `GET /api/v1/accounts/{id}/quote_permissions`
- `PUT /api/v1/accounts/quote_permissions`
- `POST /api/v1/statuses/{id}/quote`
- `GET /api/v1/statuses/{id}/quotes`

Quote creation, listing, and permissions were therefore GraphQL-only at v1.6.0; quote retraction
(`DELETE /api/v1/statuses/{id}/quote/{quote_id}`) remained available over REST. Upstream had also
dropped the `QuotePermissionsResponse`, `QuoteStatusAccount`, `QuoteStatusSummary`, and
`QuoteStatusSummaryList` schemas.

### Resolution verified at `v1.6.22`

All four endpoints declare `200` responses again, and all four schemas are present in the pinned
snapshot. The restoration in fact landed by `v1.6.5`, one pin before this record was re-read: the
v1.6.5 sync advanced the pin without re-verifying this entry, so the "open" status above was stale
for a full release cycle. Re-verifying every open gap against the newly pinned snapshot — not
against the record's own prose — is what this sync did differently.

This is Mastodon-compat-relevant because REST is the Mastodon-compat path. The capability is back on
the Mastodon-compat surface, so nothing is degraded for non-Lesser consumers.

Greater's quote flows still go through GraphQL and no adapter or component change accompanies this
closure. Whether Greater should now _also_ offer the REST quote path is a separate adapter-surface
decision, deliberately not taken inside a contract-sync change.
