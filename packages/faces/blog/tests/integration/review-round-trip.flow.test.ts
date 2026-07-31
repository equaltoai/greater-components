/**
 * Review workflow round trip: queue -> card -> verdict action.
 *
 * The fixture below is a verbatim `SharedDraftReviews` response payload — the
 * exact edges/node shape the pinned Lesser contract (LESSER_REF v1.5.32)
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
	describeApprovalRequirement,
	resolveReviewState,
} from '../../src/components/Review/state.js';
import type { DraftReviewData } from '../../src/types.js';

/** Verbatim `SharedDraftReviews` query payload shape. */
const SHARED_DRAFT_REVIEWS_RESPONSE = {
	data: {
		sharedDraftReviews: {
			__typename: 'DraftReviewConnection',
			totalCount: 2,
			pageInfo: { __typename: 'PageInfo', hasNextPage: false, endCursor: 'cursor-2' },
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
			],
		},
	},
} as const;

/** The mapping a consumer performs: connection edges -> renderable reviews. */
function toQueue(response: typeof SHARED_DRAFT_REVIEWS_RESPONSE): DraftReviewData[] {
	return response.data.sharedDraftReviews.edges.map((edge) => edge.node as DraftReviewData);
}

describe('Review workflow round trip', () => {
	const queue = toQueue(SHARED_DRAFT_REVIEWS_RESPONSE);

	it('maps a shared-review connection into a renderable queue', () => {
		expect(queue).toHaveLength(SHARED_DRAFT_REVIEWS_RESPONSE.data.sharedDraftReviews.totalCount);
		expect(queue.map((review) => review.draftId)).toEqual(['draft-agent-1', 'draft-human-2']);
	});

	it('renders the agent-authored draft with agent attribution and a pending state', () => {
		const review = queue[0]!;
		render(QueueCard, { props: { review, href: `/review/${review.draftId}` } });

		expect(screen.getByRole('heading', { name: 'Quarterly protocol notes' })).toBeInTheDocument();
		expect(screen.getByText('Agent-generated')).toBeInTheDocument();
		expect(screen.getByText('Newsroom Agent')).toBeInTheDocument();
		// No reviewStatus from the server and no verdicts -> derived, awaiting.
		expect(screen.getByText('Awaiting review')).toBeInTheDocument();
	});

	it('renders the human-authored draft with the server status verbatim', () => {
		const review = queue[1]!;
		render(QueueCard, { props: { review } });

		expect(resolveReviewState(review)).toMatchObject({
			label: 'Changes requested',
			source: 'server',
			tone: 'changes-requested',
		});
		expect(screen.getByText('Changes requested')).toBeInTheDocument();
		expect(screen.queryByText('Agent-generated')).not.toBeInTheDocument();
	});

	it('makes principal approval and the revocable invite legible on the agent draft', () => {
		const review = queue[0]!;
		render(AttributionStrip, {
			props: { review, approvalRequirement: describeApprovalRequirement(review) },
		});

		expect(screen.getByText('Newsroom Agent')).toBeInTheDocument();
		expect(screen.getByText('Not yet reviewed')).toBeInTheDocument();
		expect(
			screen.getByText(/requires the principal's approval\. No verdict recorded yet\./)
		).toBeInTheDocument();
		expect(screen.getByText('Invitations can be revoked.')).toBeInTheDocument();
	});

	it('shows the recorded reviewer and editor notes on the human draft', () => {
		const review = queue[1]!;
		render(AttributionStrip, {
			props: {
				review,
				approvalRequirement: describeApprovalRequirement(review, { invitedReviewerCount: 2 }),
			},
		});

		expect(screen.getByText('Sam')).toBeInTheDocument();
		expect(screen.getByText('Needs a worked example in section two.')).toBeInTheDocument();
		expect(
			screen.getByText('Requires a verdict from all 2 invited reviewers. 1 of 2 recorded.')
		).toBeInTheDocument();
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
