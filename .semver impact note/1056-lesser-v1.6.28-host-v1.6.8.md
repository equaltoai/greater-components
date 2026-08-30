# Minor — pin Lesser v1.6.28 and Lesser Host v1.6.8 released contracts

Greater now pins the operator-published Lesser v1.6.28
(`8f483cc5f9fe46ffc845d70297f32f6ab8d7bcbf`) and Lesser Host v1.6.8
(`0971fd7fd02489ce8092355816d4cecca0716f0c`) file-only contract snapshots and
regenerates the GraphQL and REST adapter artifacts from those exact releases
through the repo generators (no hand edits).

The Lesser delta from v1.6.22 is additive:

- **M3 editorial media** — `EditorialMediaUsage`/`Provenance`, upload grants
  (`UploadGrant`, `mintUploadGrant`, `finalizeUploadGrant`), draft editorial
  media lifecycle, short-lived per-asset access URLs.
- **M4 promotional packages** — `PromoPackage` with hash-bound review,
  current/stale verdict records (`PromoPackageVerdictRecord.current/stale`),
  and `PromoPackageReleaseEligibility` (`publishEligibility` analog for the
  promo surface).
- `draftReview`, `shareDraftForReview`, and `submitDraftReview` gain optional
  `includeAccessUrls` / `contentHash` arguments; the `DraftReview` review types
  themselves are unchanged.
- OpenAPI auth metadata is fixed upstream: previously unannotated anonymous
  routes now carry explicit `security: []` declarations and the export
  endpoints carry `bearerAuth`, so `check:openapi-auth:strict` is green with an
  empty known-gap baseline.

Lesser Host v1.6.8 changes no published contract file relative to v1.6.6; the
pin record advances to track the operator-designated release.

Existing adapter function signatures, component behavior, theming tokens,
accessibility semantics, and Mastodon-compatible surfaces are preserved; the
new GraphQL surface is available in the generated types but not yet consumed by
components (that consumption is #1055). Generated-type consumers gain only
additive names.

This sync also pins `@graphql-codegen/typescript(-operations)` back to v5 in
the root devDependencies: the v6 toolchain (bumped in #1052) re-emits
enum/input types into the same output file as the `typescript` plugin
(dotansimha/graphql-code-generator#10782, unfixed at 6.1.6), which would make
`generate:graphql` produce TS2300-duplicate output. The pinned v5 toolchain
regenerates byte-clean, and the committed generated artifacts match it.
