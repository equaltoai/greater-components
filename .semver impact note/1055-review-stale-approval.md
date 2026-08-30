# Minor: Review chrome demotes stale approvals out of the success tone

- **Impact:** Minor
- **Surface:** `@equaltoai/greater-components-blog` review chrome — `Review.QueueCard`, `Review.AttributionStrip`, `resolveReviewState`, review state types, `--gr-blog-review-stale-*` theme tokens
- **User-facing change:** When Lesser marks the newest recorded approval as void for the current revision (`DraftReviewVerdictRecord.stale` / `.current` from the pinned v1.6.28 contract), the review chrome now resolves a `stale-approved` state — "Latest verdict: Approved (superseded)" with an explanation that the approval no longer counts — instead of the green approved badge, including when `reviewStatus` still spells the approval. Additive surface: new `ReviewStateTone` value `stale-approved`, new `stale` / `detail` fields on `ReviewStateDescriptor`, new exported string constants, new `--gr-blog-review-stale-*` tokens. Older or partial projections without the markers render exactly as before, and a genuinely current approval keeps the approved tone.

Closes #1055.
