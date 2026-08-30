# Review Workflow

Chrome for Lesser's shared-draft review workflow: a queue card, an attribution
strip, and confirm-guarded verdict actions.

Pinned contract: `docs/lesser/contracts/graphql-schema.graphql` at **LESSER_REF v1.6.28**.
The shareable-draft review surface was introduced in v1.5.33: `DraftReview`, `DraftReviewGrant`,
`DraftReviewVerdictRecord`, the `DraftReviewVerdict` enum, and the
`sharedDraftReviews` / `draftReview` / `shareDraftForReview` /
`revokeDraftReview` / `submitDraftReview` operations. v1.6.28 carries the M4
release surface — `publishEligibility` and the verdict-record `current`/`stale`
authority markers — plus the M3 editorial-media preview (`draftPreview`, with
`includeAccessUrls` defaulting to `false` so protected media URLs stay explicit
opt-in) and the optional hash-bound `contentHash` constraint on
`submitDraftReview`.

## Where policy lives

**Lesser owns review semantics. These components render data and report reviewer
intent; they do not decide anything.** Since v1.6.28 the contract carries the
server-computed publication gate (`DraftReview.publishEligibility` →
`DraftPublishEligibility` with `eligible`, `blockingReasons`, `reviewersApproved`,
`principalApprovalRequired`, `principalApproved`) and per-verdict authority
markers (`DraftReviewVerdictRecord.current` / `.stale`, which say whether a
verdict still applies to the current draft revision and active grant). Those
fields are authoritative: the gate is whatever the server computed, and a stale
verdict record is not gate input no matter what the history reads.

### `reviewStatus` is latest activity, not publication state

Lesser's `SubmitDraftReviewVerdict` overwrites `Draft.ReviewStatus` with the
submitted verdict on **every** submission, so the field names the most recent
submission — a later `CHANGES_REQUESTED` from one reviewer replaces an earlier
`APPROVED` from another. It is not the publication gate.

The gate itself is server-computed and exposed directly on the pinned
projection: `DraftReview.publishEligibility` carries the eligibility projection,
and `DraftReviewVerdictRecord.current` / `.stale` mark which recorded verdicts
are valid for the current revision and active grant. The chrome reads that
surface rather than reconstructing it — the reconstruction the v1.6.0-era
projection forced (active-grant set + instance-principal identity, neither of
which was exposed) is no longer needed.

So the chrome renders `reviewStatus` verbatim, and when it is absent names the
newest recorded verdict, and in both cases pairs the badge with the exact
qualifier **"latest activity, not publication state"**. It never derives an
Approved / Changes-requested _state_, and it never renders a completion claim.
With no activity at all it shows "No review activity recorded". The qualifier is
deliberate even now that the gate is in-contract: the badge is an activity
marker, and the authoritative gate lives in `publishEligibility`, which the
chrome never substitutes activity history for.

### Stale approvals do not look current

A media or content change stales earlier verdicts upstream: Lesser re-hashes the
draft and marks the affected verdict records with the authoritative
`current` / `stale` markers. Since issue #1055 the chrome consumes those
markers: when the newest recorded approval is voided for the current revision
(`stale: true` or `current: false`), `resolveReviewState` emits the
`stale-approved` state instead of letting the approval read as current —
including when `reviewStatus` still spells the approval, which Lesser only
overwrites on submission.

The stale state keeps the approval **visible as history** while demoting it:

- Badge label: `Latest verdict: Approved (superseded)` — the parenthetical
  preserves the record without implying the current revision is approved.
- Badge tone: `stale-approved` — the neutral palette with a dashed border,
  never the approved green.
- Explanation, rendered as visible text beneath the badge:
  `This approval no longer counts. Approval for the current revision is outstanding.`
  — or, when `publishEligibility` says the principal rule is in force and
  unsatisfied:
  `This approval no longer counts. Principal approval for the current revision is outstanding.`
  The principal wording covers the TheoryLive incident: an agent-generated draft
  whose media changed after the principal approved.

Staleness is consumed, never inferred: an older or partial projection without
the markers renders the ordinary qualified activity badge. It never shows a
genuinely current approval as stale either — a record carrying
`current: true` / `stale: false` keeps the approved tone. The exported
constants (`REVIEW_STALE_APPROVAL_LABEL`, `REVIEW_STALE_APPROVAL_DETAIL`,
`REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL`) pin the exact strings so consumers
and tests assert them rather than paraphrases.

### The approval rules are cumulative

`describeApprovalRequirement()` mirrors Lesser's rules for **display only**.
Nothing consumes its result to enable, disable, or gate a submission. The
verdict buttons are gated solely by the consumer's `disabled` prop, and the
server rejects submissions it does not permit.

The rules it mirrors, from `PublishDraft`, apply **together** — they are not
alternatives:

1. **Always** — unanimous approval from every reviewer holding an active
   (unrevoked) grant. With no active grants this is vacuously satisfied, which
   is how human-authored drafts keep their pre-review behaviour.
2. **Additionally, whenever the draft records a generator** — the instance
   principal's own active grant and current `APPROVED` verdict. No other
   reviewer can substitute, and a generated draft that never grants the
   principal fails closed.

Rule 2 is keyed on a non-empty `generatedBy`, **not** on `generatedBy.isAgent`.
Lesser tests `strings.TrimSpace(draft.GeneratedBy) != ""`, so a draft generated
by a delegated local actor arms the principal rule exactly as an agent-generated
draft does. (`Actor.isAgent` is still a real contract field and still drives the
"Agent-generated" badge — it just does not decide approval semantics.)

The descriptor reports **no progress count**. Honest progress would count
reviewers with an active grant at the current round; counting `verdicts`
instead would be wrong, because that history is immutable and append-only, so
repeats and revoke/re-grant cycles make "3 of 3 recorded" meaningless. Supply
`activeReviewerCount` only from a source that genuinely enumerates active
grants; otherwise the chrome names the rules and stays neutral.

Invitations are revocable via `revokeDraftReview`. A revoked grant leaves the
required set immediately while its verdict history remains as audit-only record.

### Upstream candidate — delivered in v1.6.28

The publication gate the chrome previously could not display is now in the
pinned contract: `DraftReview.publishEligibility` (`DraftPublishEligibility`)
is the server-computed gate, and `DraftReviewVerdictRecord.current` / `.stale`
say which verdicts are valid gate input for the current revision and active
grant. Reimplementing Lesser's gate client-side would remain a correctness
hazard — a second implementation that can disagree with the one that actually
gates publication — so the chrome still does not do that. It renders the
activity badge and reads the authoritative projection (`publishEligibility`
feeds `describeApprovalRequirement()`), leaving gate truth where it is
computed: on the server, in the contract.

## Components

### `Review.QueueCard`

One entry of a review queue: draft identity, author/agent attribution, verdict
state.

| Prop             | Type              | Notes                                                           |
| ---------------- | ----------------- | --------------------------------------------------------------- |
| `review`         | `DraftReviewData` | required                                                        |
| `href`           | `string`          | omit and the title renders as plain text — no route is invented |
| `headingLevel`   | `2 \| 3 \| 4`     | default `2`                                                     |
| `showExcerpt`    | `boolean`         | default `true`                                                  |
| `showAgentBadge` | `boolean`         | default `true`                                                  |
| `attribution`    | `Snippet`         | usually `Review.AttributionStrip`                               |
| `actions`        | `Snippet`         | usually `Review.VerdictActions`                                 |

The card is deliberately **not** wrapped in a single anchor — the title carries
the link and actions sit alongside — because a `<button>` inside an `<a>` is
invalid HTML and hostile to screen readers.

### `Review.AttributionStrip`

`generatedBy` / `reviewedBy` / `reviewStatus` / `editorNotes`, plus the
outstanding invitation and the approval rule when supplied.

| Prop                  | Type                        | Notes                                |
| --------------------- | --------------------------- | ------------------------------------ |
| `review`              | `DraftReviewData`           | required                             |
| `approvalRequirement` | `ReviewApprovalRequirement` | from `describeApprovalRequirement()` |
| `showEmptyFields`     | `boolean`                   | default `true`                       |
| `density`             | `'sm' \| 'md'`              | default `'sm'`                       |

Empty fields render an explicit empty state rather than disappearing — "not
recorded" is information a reviewer needs. Review status is always shown, and
is always accompanied by the "latest activity, not publication state"
qualifier.

### `Review.VerdictActions`

| Prop                                   | Type                                           | Notes           |
| -------------------------------------- | ---------------------------------------------- | --------------- |
| `draftId`                              | `string`                                       | required        |
| `onSubmit`                             | `(s: VerdictSubmission) => Promise \| unknown` | required        |
| `disabled`                             | `boolean`                                      | default `false` |
| `requireNotesForChanges`               | `boolean`                                      | default `true`  |
| `approveLabel` / `requestChangesLabel` | `string`                                       |                 |

Both verdicts open a confirmation dialog first. A rejected `onSubmit` keeps the
dialog open, surfaces the message via `role="alert"`, and preserves the notes so
the reviewer can retry — including when the dialog was dismissed while the
submission was still in flight.

## Wiring to Lesser

```svelte
<script lang="ts">
	import { Review, describeApprovalRequirement } from '@equaltoai/greater-components-blog';
	import { createSubmitDraftReviewHandler } from '@equaltoai/greater-components-adapters';

	let { adapter, reviews } = $props();
	const submitVerdict = createSubmitDraftReviewHandler(adapter);
</script>

{#each reviews as review (review.draftId)}
	<Review.QueueCard {review} href={`/review/${review.draftId}`}>
		{#snippet attribution()}
			<Review.AttributionStrip {review} approvalRequirement={describeApprovalRequirement(review)} />
		{/snippet}
		{#snippet actions()}
			<Review.VerdictActions draftId={review.draftId} onSubmit={submitVerdict} />
		{/snippet}
	</Review.QueueCard>
{/each}
```

Populate `reviews` from `adapter.getSharedDraftReviews({ first: 20 })`, mapping
`edges[].node`.

## SSR and strict CSP

All three components render on the server with no DOM globals and emit no inline
`style` attribute, no `<style>` element, and no `<script>` element, so they need
no CSP nonce or hash. Verified in `tests/review-ssr.test.ts` and by
`greater doctor --csp` on a vendored copy.

Styling lives entirely in the face stylesheet (`src/theme.css`), per the blog
face convention.

## Theming

New tokens are prefixed `--gr-blog-review-*`: card padding and radius, plus
`approved` / `changes` / `pending` / `stale` / `agent` background, foreground,
and border triples, with light and dark values. The `stale` triple is
deliberately neutral (gray palette, not the approved green) so a superseded
approval is visually demoted; the dashed border on `--stale-approved` badges
distinguishes them from plain pending badges without relying on colour alone.

`neutral` is a selectable palette name, but `--gr-color-neutral-*` was never an
emitted token family. This PR removes the never-functional, consumer-facing
`--gr-color-neutral-N` → `--gr-color-gray-N` bridge pattern. Consumers
bridge neutral values through the emitted `--gr-color-gray-*` family or through
their own component-level overrides. The repository guard rejects palette names
used as custom-property paths so the removed pattern cannot return.

## Accessibility

- Review state is always carried by text — never colour alone. The stale
  approval demotion is announced by its label and explanation text, so the
  "no longer counts" state survives screen readers that see no badge colour.
- Cards expose `aria-labelledby` pointing at their heading, and `headingLevel`
  keeps the page outline correct.
- The notes field uses the `TextArea` primitive, which supplies label
  association, `aria-invalid`, `aria-describedby`, and `role="alert"` on the
  error.
- `Modal` supplies the focus trap, Escape handling, and focus restoration.
- A `forced-colors: active` block keeps state badges and the agent marker
  distinguishable when author colours are dropped.

## Contract drift

`tests/contracts/lesser-draft-review-contract.test.ts` reads the pinned snapshot
and fails if the contract stops matching what these components render. When it
goes red, run the `sync-contracts` walk — do not patch the view model in place.
