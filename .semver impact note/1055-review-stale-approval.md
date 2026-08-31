# Minor: Review chrome demotes stale approvals out of the success tone

- **Impact:** Minor
- **Surface:** `@equaltoai/greater-components-blog` review chrome — `Review.QueueCard`, `Review.AttributionStrip`, `resolveReviewState`, review state types, `--gr-blog-review-stale-*` theme tokens
- **User-facing change:** When Lesser marks the newest recorded approval as void for the current revision (`DraftReviewVerdictRecord.stale` / `.current` from the pinned v1.6.28 contract), the review chrome now resolves a `stale-approved` state — "Latest verdict: Approved (superseded)" with an explanation that the approval no longer counts — instead of the green approved badge, including when `reviewStatus` still spells the approval. Additive surface: new `ReviewStateTone` value `stale-approved`, new `detail` field and new typed-optional `stale?: boolean` field on `ReviewStateDescriptor` (the resolver emits an explicit boolean for every state it returns; the optional modifier keeps downstream TypeScript descriptor construction additive), new exported string constants, new `--gr-blog-review-stale-*` tokens. Older or partial projections without the markers render exactly as before, and a genuinely current approval keeps the approved tone.

Closes #1055.
