# Review Workflow

Chrome for Lesser's shared-draft review workflow: a queue card, an attribution
strip, and confirm-guarded verdict actions.

Pinned contract: `docs/lesser/contracts/graphql-schema.graphql` at
**LESSER_REF v1.5.32**, which introduced `DraftReview`, `DraftReviewGrant`,
`DraftReviewVerdictRecord`, the `DraftReviewVerdict` enum, and the
`sharedDraftReviews` / `draftReview` / `shareDraftForReview` /
`revokeDraftReview` / `submitDraftReview` operations.

## Where policy lives

**Lesser owns review semantics. These components render data and report reviewer
intent; they do not decide anything.**

- `reviewStatus` is the authoritative status. When the server supplies it, the
  chrome renders it **verbatim**. Only when it is absent does the chrome
  summarise the recorded verdicts, and it labels that summary as derived.
- Agent authorship comes from the contract field `Actor.isAgent`. It is never
  inferred from a name, a domain, or anything else.
- `describeApprovalRequirement()` mirrors Lesser's rule for **display only**.
  Nothing consumes its result to enable, disable, or gate a submission. The
  verdict buttons are gated solely by the consumer's `disabled` prop, and the
  server rejects submissions it does not permit.

The rule it mirrors: agent-authored drafts require the principal's approval;
other drafts require a verdict from every invited reviewer. Invitations are
revocable via `revokeDraftReview`.

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
recorded" is information a reviewer needs. Review status is always shown.

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
`approved` / `changes` / `pending` / `agent` background, foreground, and border
triples, with light and dark values.

Neutral steps are written as `var(--gr-color-neutral-N, var(--gr-color-gray-N))`
because `--gr-color-neutral-*` is a bridge-level alias rather than a token the
tokens package emits. Consumers that bridge their brand through
`--gr-color-neutral-*` win; consumers that do not still render correctly.

## Accessibility

- Review state is always carried by text — never colour alone.
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
