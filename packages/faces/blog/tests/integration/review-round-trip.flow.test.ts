/**
 * Review workflow round trip: queue -> card -> verdict action.
 *
 * The fixture below is a verbatim `SharedDraftReviews` response payload — the
 * exact edges/node shape the pinned Lesser contract (LESSER_REF v1.6.0)
 * returns for the query in
 * `packages/faces/social/src/adapters/graphql/documents/draft-review.graphql`.
 * The flow maps that payload into the queue, renders a card per draft, drives a
 * verdict through the confirm guard, and asserts the emitted submission matches
 * `SubmitDraftReview`'s mutation variables exactly.
 *
 * The transport half of the trip — that this payload reaches
 * `submitDraftReview` with those variables — is covered by
 * `packages/adapters/src/graphql/__tests__/draftReview.test.ts`. Together the
 * two halves close the loop across the adapter boundary.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import QueueCard from '../../src/components/Review/QueueCard.svelte';
import AttributionStrip from '../../src/components/Review/AttributionStrip.svelte';
import VerdictActions from '../../src/components/Review/VerdictActions.svelte';
import {
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	REVIEW_STALE_APPROVAL_LABEL,
	describeApprovalRequirement,
	resolveReviewState,
} from '../../src/components/Review/state.js';
import type { SharedDraftReviewsQuery } from '@equaltoai/greater-components-adapters';
import type { DraftReviewData } from '../../src/types.js';

/**
 * Verbatim `SharedDraftReviews` query payload.
 *
 * Checked with `satisfies SharedDraftReviewsQuery` — the codegen'd type for the
 * query in `packages/faces/social/src/adapters/graphql/documents/draft-review.graphql`
 * — so that if the pinned contract's projection drifts and the types are
 * regenerated, this fixture stops compiling instead of silently testing a shape
 * Lesser no longer returns.
 */
const SHARED_DRAFT_REVIEWS_RESPONSE = {
	data: {
		__typename: 'Query',
		sharedDraftReviews: {
			__typename: 'DraftReviewConnection',
			totalCount: 3,
			pageInfo: { __typename: 'PageInfo', hasNextPage: false, endCursor: 'cursor-3' },
			edges: [
				{
					__typename: 'DraftReviewEdge',
					cursor: 'cursor-1',
					node: {
						__typename: 'DraftReview',
						draftId: 'draft-agent-1',
						title: 'Quarterly protocol notes',
						subtitle: 'What shipped in the federation layer',
						excerpt: 'A summary of the quarter, drafted by the newsroom agent.',
						contentFormat: 'MARKDOWN',
						status: 'DRAFT',
						scheduledAt: null,
						updatedAt: '2026-07-30T09:15:00.000Z',
						createdAt: '2026-07-28T11:00:00.000Z',
						reviewStatus: null,
						editorNotes: null,
						generatedBy: {
							__typename: 'Actor',
							id: 'actor-agent',
							username: 'newsroom',
							domain: null,
							displayName: 'Newsroom Agent',
							avatar: '/avatars/newsroom.png',
							isAgent: true,
						},
						reviewedBy: null,
						grant: {
							__typename: 'DraftReviewGrant',
							grantedAt: '2026-07-29T08:00:00.000Z',
							reviewer: {
								__typename: 'Actor',
								id: 'actor-principal',
								username: 'aron',
								domain: null,
								displayName: 'Aron',
								avatar: null,
								isAgent: false,
							},
						},
						verdicts: [],
					},
				},
				{
					__typename: 'DraftReviewEdge',
					cursor: 'cursor-2',
					node: {
						__typename: 'DraftReview',
						draftId: 'draft-human-2',
						title: 'Field guide to review invites',
						subtitle: null,
						excerpt: 'Written by a human editor and shared with two reviewers.',
						contentFormat: 'HTML',
						status: 'DRAFT',
						scheduledAt: '2026-08-05T09:00:00.000Z',
						updatedAt: '2026-07-30T10:00:00.000Z',
						createdAt: '2026-07-27T11:00:00.000Z',
						reviewStatus: 'Changes requested',
						editorNotes: 'Needs a worked example in section two.',
						generatedBy: {
							__typename: 'Actor',
							id: 'actor-human',
							username: 'kim',
							domain: 'lesser.host',
							displayName: 'Kim',
							avatar: null,
							isAgent: false,
						},
						reviewedBy: {
							__typename: 'Actor',
							id: 'actor-reviewer',
							username: 'sam',
							domain: null,
							displayName: 'Sam',
							avatar: null,
							isAgent: false,
						},
						grant: null,
						verdicts: [
							{
								__typename: 'DraftReviewVerdictRecord',
								verdict: 'CHANGES_REQUESTED',
								notes: 'Add the worked example.',
								recordedAt: '2026-07-30T09:45:00.000Z',
								reviewer: {
									__typename: 'Actor',
									id: 'actor-reviewer',
									username: 'sam',
									domain: null,
									displayName: 'Sam',
									avatar: null,
									isAgent: false,
								},
							},
						],
					},
				},
				{
					__typename: 'DraftReviewEdge',
					cursor: 'cursor-3',
					node: {
						__typename: 'DraftReview',
						draftId: 'draft-stale-3',
						title: 'Festival coverage with swapped photos',
						subtitle: null,
						excerpt: 'Approved by the principal, then the media changed.',
						contentFormat: 'MARKDOWN',
						status: 'DRAFT',
						scheduledAt: null,
						updatedAt: '2026-08-29T15:00:00.000Z',
						createdAt: '2026-08-28T09:00:00.000Z',
						reviewStatus: 'Approved',
						editorNotes: null,
						generatedBy: {
							__typename: 'Actor',
							id: 'actor-agent-3',
							username: 'newsroom',
							domain: null,
							displayName: 'Newsroom Agent',
							avatar: '/avatars/newsroom.png',
							isAgent: true,
						},
						reviewedBy: {
							__typename: 'Actor',
							id: 'actor-principal',
							username: 'aron',
							domain: null,
							displayName: 'Aron',
							avatar: null,
							isAgent: false,
						},
						grant: null,
						verdicts: [
							{
								__typename: 'DraftReviewVerdictRecord',
								verdict: 'APPROVED',
								notes: null,
								recordedAt: '2026-08-29T09:00:00.000Z',
								current: false,
								stale: true,
								reviewer: {
									__typename: 'Actor',
									id: 'actor-principal',
									username: 'aron',
									domain: null,
									displayName: 'Aron',
									avatar: null,
									isAgent: false,
								},
							},
						],
						publishEligibility: {
							__typename: 'DraftPublishEligibility',
							eligible: false,
							blockingReasons: ['principal approval is outstanding for the current revision'],
							reviewersApproved: false,
							principalApprovalRequired: true,
							principalApproved: false,
						},
					},
				},
			],
		},
	},
} as const satisfies { data: SharedDraftReviewsQuery };

/**
 * The mapping a consumer performs: connection edges -> renderable reviews.
 *
 * Deliberately cast-free. The nodes must be structurally assignable to
 * `DraftReviewData`, so a drift between the generated projection and the blog
 * face's view model surfaces here as a compile error rather than at runtime.
 */
function toQueue(response: typeof SHARED_DRAFT_REVIEWS_RESPONSE): DraftReviewData[] {
	return response.data.sharedDraftReviews.edges.map((edge) => edge.node);
}

describe('Review workflow round trip', () => {
	const queue = toQueue(SHARED_DRAFT_REVIEWS_RESPONSE);

	it('maps a shared-review connection into a renderable queue', () => {
		expect(queue).toHaveLength(SHARED_DRAFT_REVIEWS_RESPONSE.data.sharedDraftReviews.totalCount);
		expect(queue.map((review) => review.draftId)).toEqual([
			'draft-agent-1',
			'draft-human-2',
			'draft-stale-3',
		]);
	});

	it('renders the agent-authored draft with agent attribution and a pending state', () => {
		const review = queue[0]!;
		render(QueueCard, { props: { review, href: `/review/${review.draftId}` } });

		expect(screen.getByRole('heading', { name: 'Quarterly protocol notes' })).toBeInTheDocument();
		expect(screen.getByText('Agent-generated')).toBeInTheDocument();
		expect(screen.getByText('Newsroom Agent')).toBeInTheDocument();
		// No reviewStatus from the server and no verdicts -> nothing has happened.
		expect(screen.getByText('No review activity recorded')).toBeInTheDocument();
		// ...and with no activity there is nothing to qualify.
		expect(screen.queryByText('latest activity, not publication state')).not.toBeInTheDocument();
	});

	it('renders the human-authored draft status verbatim, qualified as latest activity', () => {
		const review = queue[1]!;
		render(QueueCard, { props: { review } });

		expect(resolveReviewState(review)).toMatchObject({
			label: 'Changes requested',
			source: 'server',
			tone: 'changes-requested',
		});
		expect(screen.getByText('Changes requested')).toBeInTheDocument();
		// Lesser overwrites ReviewStatus on every submission, so the card must not
		// let this read as the publication gate.
		expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();
		expect(screen.queryByText('Agent-generated')).not.toBeInTheDocument();
	});

	it('renders the changed-media draft as a stale approval, never a current one', () => {
		// The incident shape end to end: the principal approved, the media
		// changed, Lesser marked the verdict stale and the gate ineligible. The
		// card must keep the approval visible as history without the success
		// tone or the wording of a current approval.
		const review = queue[2]!;

		expect(resolveReviewState(review)).toMatchObject({
			tone: 'stale-approved',
			label: REVIEW_STALE_APPROVAL_LABEL,
			source: 'verdicts',
			stale: true,
			detail: REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
		});

		const { container } = render(QueueCard, { props: { review } });

		expect(screen.getByText(REVIEW_STALE_APPROVAL_LABEL)).toBeInTheDocument();
		expect(screen.getByText(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL)).toBeInTheDocument();
		expect(screen.queryByText('Approved', { exact: true })).not.toBeInTheDocument();
		expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();

		const badge = container.querySelector('.gr-blog-review-card__state');
		expect(badge).toHaveClass('gr-blog-review-card__state--stale-approved');
		expect(badge).not.toHaveClass('gr-blog-review-card__state--approved');
	});

	it('keeps publishEligibility the gate authority on the stale draft', () => {
		// The chrome consumes the canonical projection rather than recomputing
		// eligibility from the stale verdict history.
		const review = queue[2]!;

		expect(review.publishEligibility?.eligible).toBe(false);
		expect(describeApprovalRequirement(review)).toEqual({
			allActiveReviewers: true,
			principalApproval: true,
		});

		render(AttributionStrip, {
			props: { review, approvalRequirement: describeApprovalRequirement(review) },
		});

		expect(screen.getByText(REVIEW_STALE_APPROVAL_LABEL)).toBeInTheDocument();
		const approval = screen.getByText(/Requires approval from/);
		expect(approval).toHaveTextContent('from the instance principal as well');
	});

	it('states both cumulative requirements and the revocable invite on the agent draft', () => {
		const review = queue[0]!;
		render(AttributionStrip, {
			props: { review, approvalRequirement: describeApprovalRequirement(review) },
		});

		expect(screen.getByText('Newsroom Agent')).toBeInTheDocument();
		expect(screen.getByText('Not yet reviewed')).toBeInTheDocument();

		const approval = screen.getByText(/Requires approval from/);
		expect(approval).toHaveTextContent('every reviewer with an active invitation');
		expect(approval).toHaveTextContent('from the instance principal as well');
		expect(approval).toHaveTextContent('Both are required.');

		expect(screen.getByText('Invitations can be revoked.')).toBeInTheDocument();
	});

	it('also arms the principal rule for the delegated human-generated draft', () => {
		// `generatedBy` is Kim, a non-agent local actor. Lesser keys the principal
		// rule on a non-empty GeneratedBy, so this draft needs it too.
		const review = queue[1]!;
		expect(review.generatedBy?.isAgent).toBe(false);

		render(AttributionStrip, {
			props: {
				review,
				approvalRequirement: describeApprovalRequirement(review, { activeReviewerCount: 2 }),
			},
		});

		expect(screen.getByText('Sam')).toBeInTheDocument();
		expect(screen.getByText('Needs a worked example in section two.')).toBeInTheDocument();

		const approval = screen.getByText(/Requires approval from/);
		expect(approval).toHaveTextContent('all 2 reviewers with an active invitation');
		expect(approval).toHaveTextContent('from the instance principal as well');
	});

	it('never renders a progress claim anywhere in the queue chrome', () => {
		for (const review of queue) {
			const { container, unmount } = render(AttributionStrip, {
				props: {
					review,
					approvalRequirement: describeApprovalRequirement(review, { activeReviewerCount: 2 }),
				},
			});

			expect(container.textContent).not.toMatch(/\d+\s+of\s+\d+/);
			unmount();
		}
	});

	it('completes an approval round trip with SubmitDraftReview-shaped variables', async () => {
		const review = queue[0]!;
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(VerdictActions, { props: { draftId: review.draftId, onSubmit } });

		await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
		const dialog = await screen.findByRole('dialog');
		await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				draftId: 'draft-agent-1',
				verdict: 'APPROVED',
			})
		);

		// Mutation variables are (draftId, verdict, notes) — notes optional.
		const submission = onSubmit.mock.calls[0]![0];
		expect(Object.keys(submission).sort()).toEqual(['draftId', 'verdict']);
	});

	it('completes a changes-requested round trip carrying reviewer notes', async () => {
		const review = queue[1]!;
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(VerdictActions, { props: { draftId: review.draftId, onSubmit } });

		await fireEvent.click(screen.getByRole('button', { name: 'Request changes' }));
		const dialog = await screen.findByRole('dialog');
		await fireEvent.input(within(dialog).getByLabelText(/Notes/), {
			target: { value: 'Add the worked example.' },
		});
		await fireEvent.click(within(dialog).getByRole('button', { name: 'Request changes' }));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				draftId: 'draft-human-2',
				verdict: 'CHANGES_REQUESTED',
				notes: 'Add the worked example.',
			})
		);
	});

	it('keeps the queue usable when the server rejects a verdict', async () => {
		const review = queue[0]!;
		const onSubmit = vi.fn().mockRejectedValue(new Error('reviewer not invited'));

		render(VerdictActions, { props: { draftId: review.draftId, onSubmit } });

		await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
		const dialog = await screen.findByRole('dialog');
		await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('reviewer not invited');
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
