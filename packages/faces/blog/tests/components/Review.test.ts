import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import QueueCard from '../../src/components/Review/QueueCard.svelte';
import AttributionStrip from '../../src/components/Review/AttributionStrip.svelte';
import VerdictActions from '../../src/components/Review/VerdictActions.svelte';
import {
	describeApprovalRequirement,
	resolveReviewState,
	reviewActorHandle,
	reviewActorName,
} from '../../src/components/Review/state.js';
import {
	createMockAgentActor,
	createMockDraftReview,
	createMockReviewActor,
	createMockVerdict,
} from '../mocks/mockDraftReview.js';

describe('Review workflow chrome', () => {
	describe('state helpers', () => {
		it('renders a server-supplied reviewStatus verbatim and marks it authoritative', () => {
			const review = createMockDraftReview('d1', { reviewStatus: 'Awaiting principal sign-off' });
			const state = resolveReviewState(review);

			expect(state.label).toBe('Awaiting principal sign-off');
			expect(state.source).toBe('server');
		});

		it('falls back to the neutral tone for an unrecognised server status', () => {
			const review = createMockDraftReview('d1', { reviewStatus: 'Escalated to legal' });

			expect(resolveReviewState(review).tone).toBe('pending');
		});

		it('tones a recognisable server status without altering its text', () => {
			const approved = createMockDraftReview('d1', { reviewStatus: 'Approved' });
			const changes = createMockDraftReview('d2', { reviewStatus: 'Changes requested' });

			expect(resolveReviewState(approved).tone).toBe('approved');
			expect(resolveReviewState(changes).tone).toBe('changes-requested');
		});

		it('derives an awaiting state when there is no status and no verdict', () => {
			const state = resolveReviewState(createMockDraftReview('d1'));

			expect(state).toMatchObject({
				tone: 'pending',
				label: 'Awaiting review',
				source: 'derived',
			});
		});

		it('lets a recorded CHANGES_REQUESTED outrank recorded approvals', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED' }),
					createMockVerdict({ verdict: 'CHANGES_REQUESTED', notes: 'Tighten the intro' }),
				],
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'changes-requested',
				source: 'derived',
			});
		});

		it('derives approved only when every recorded verdict approves', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict(),
					createMockVerdict({ reviewer: createMockReviewActor('r2') }),
				],
			});

			expect(resolveReviewState(review)).toMatchObject({ tone: 'approved', source: 'derived' });
		});

		it('describes agent-authored drafts as requiring principal approval', () => {
			const review = createMockDraftReview('d1', { generatedBy: createMockAgentActor('a1') });

			expect(describeApprovalRequirement(review)).toEqual({
				kind: 'principal-approval',
				recorded: 0,
				required: 1,
			});
		});

		it('describes human-authored drafts as requiring all invited reviewers', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1'),
				verdicts: [createMockVerdict()],
			});

			expect(describeApprovalRequirement(review, { invitedReviewerCount: 3 })).toEqual({
				kind: 'all-reviewers',
				recorded: 1,
				required: 3,
			});
		});

		it('omits a required count when the invited reviewer count is unknown', () => {
			const review = createMockDraftReview('d1', { generatedBy: createMockReviewActor('h1') });

			expect(describeApprovalRequirement(review)).not.toHaveProperty('required');
		});

		it('formats local and remote handles', () => {
			expect(reviewActorHandle(createMockReviewActor('x', { username: 'ada' }))).toBe('@ada');
			expect(
				reviewActorHandle(createMockReviewActor('x', { username: 'ada', domain: 'lesser.host' }))
			).toBe('@ada@lesser.host');
		});

		it('falls back to the username when no display name is set', () => {
			expect(reviewActorName(createMockReviewActor('x', { displayName: null }))).toBe('user-x');
			expect(reviewActorName(createMockReviewActor('x', { displayName: '  ' }))).toBe('user-x');
		});
	});

	describe('Review.QueueCard', () => {
		it('renders draft identity and links the title when href is given', () => {
			render(QueueCard, {
				props: { review: createMockDraftReview('d1'), href: '/drafts/d1' },
			});

			const link = screen.getByRole('link', { name: 'Draft d1' });
			expect(link).toHaveAttribute('href', '/drafts/d1');
			expect(screen.getByText('Subtitle for d1')).toBeInTheDocument();
			expect(screen.getByText('Excerpt for d1')).toBeInTheDocument();
		});

		it('renders the title as plain text rather than inventing a route', () => {
			render(QueueCard, { props: { review: createMockDraftReview('d1') } });

			expect(screen.queryByRole('link')).not.toBeInTheDocument();
			expect(screen.getByRole('heading', { name: 'Draft d1' })).toBeInTheDocument();
		});

		it('falls back to a placeholder for an untitled draft', () => {
			render(QueueCard, {
				props: { review: createMockDraftReview('d1', { title: null }) },
			});

			expect(screen.getByRole('heading', { name: 'Untitled draft' })).toBeInTheDocument();
		});

		it('marks agent-generated drafts', () => {
			render(QueueCard, {
				props: {
					review: createMockDraftReview('d1', { generatedBy: createMockAgentActor('a1') }),
				},
			});

			expect(screen.getByText('Agent-generated')).toBeInTheDocument();
			expect(screen.getByText('Agent a1')).toBeInTheDocument();
		});

		it('does not mark human-generated drafts as agent output', () => {
			render(QueueCard, {
				props: {
					review: createMockDraftReview('d1', { generatedBy: createMockReviewActor('h1') }),
				},
			});

			expect(screen.queryByText('Agent-generated')).not.toBeInTheDocument();
		});

		it('names the card by its title for assistive technology', () => {
			const { container } = render(QueueCard, {
				props: { review: createMockDraftReview('d1') },
			});

			const article = container.querySelector('article');
			const heading = container.querySelector('h2');
			expect(article).toHaveAttribute('aria-labelledby', heading?.id);
		});

		it('honours the requested heading level', () => {
			const { container } = render(QueueCard, {
				props: { review: createMockDraftReview('d1'), headingLevel: 3 },
			});

			expect(container.querySelector('h3')).toBeInTheDocument();
		});

		it('renders a machine-readable updated timestamp', () => {
			const { container } = render(QueueCard, {
				props: { review: createMockDraftReview('d1') },
			});

			const time = container.querySelector('time');
			expect(time).toHaveAttribute('datetime', '2026-07-30T09:00:00.000Z');
		});

		it('surfaces the verdict state as text, not colour alone', () => {
			render(QueueCard, {
				props: {
					review: createMockDraftReview('d1', {
						verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED' })],
					}),
				},
			});

			expect(screen.getByText('Changes requested')).toBeInTheDocument();
		});

		it('hides the excerpt when asked', () => {
			render(QueueCard, {
				props: { review: createMockDraftReview('d1'), showExcerpt: false },
			});

			expect(screen.queryByText('Excerpt for d1')).not.toBeInTheDocument();
		});
	});

	describe('Review.AttributionStrip', () => {
		it('renders all four attribution fields with values', () => {
			render(AttributionStrip, {
				props: {
					review: createMockDraftReview('d1', {
						generatedBy: createMockAgentActor('a1'),
						reviewedBy: createMockReviewActor('r1'),
						reviewStatus: 'Approved',
						editorNotes: 'Checked the sourcing.',
					}),
				},
			});

			expect(screen.getByText('Generated by')).toBeInTheDocument();
			expect(screen.getByText('Agent a1')).toBeInTheDocument();
			expect(screen.getByText('Reviewed by')).toBeInTheDocument();
			expect(screen.getByText('User r1')).toBeInTheDocument();
			expect(screen.getByText('Review status')).toBeInTheDocument();
			expect(screen.getByText('Approved')).toBeInTheDocument();
			expect(screen.getByText('Editor notes')).toBeInTheDocument();
			expect(screen.getByText('Checked the sourcing.')).toBeInTheDocument();
		});

		it('renders explicit empty states rather than dropping fields', () => {
			render(AttributionStrip, { props: { review: createMockDraftReview('d1') } });

			expect(screen.getByText('Not recorded')).toBeInTheDocument();
			expect(screen.getByText('Not yet reviewed')).toBeInTheDocument();
			expect(screen.getByText('None')).toBeInTheDocument();
			expect(screen.getByText('Awaiting review')).toBeInTheDocument();
		});

		it('omits empty fields when showEmptyFields is false', () => {
			render(AttributionStrip, {
				props: { review: createMockDraftReview('d1'), showEmptyFields: false },
			});

			expect(screen.queryByText('Generated by')).not.toBeInTheDocument();
			expect(screen.queryByText('Reviewed by')).not.toBeInTheDocument();
			expect(screen.queryByText('Editor notes')).not.toBeInTheDocument();
			// Review status is always shown — it is the authoritative field.
			expect(screen.getByText('Review status')).toBeInTheDocument();
		});

		it('discloses when the status was summarised rather than served', () => {
			render(AttributionStrip, { props: { review: createMockDraftReview('d1') } });

			expect(screen.getByText('summarised from recorded verdicts')).toBeInTheDocument();
		});

		it('does not claim a summary when the server supplied the status', () => {
			render(AttributionStrip, {
				props: { review: createMockDraftReview('d1', { reviewStatus: 'In review' }) },
			});

			expect(screen.queryByText('summarised from recorded verdicts')).not.toBeInTheDocument();
		});

		it('makes principal approval legible for agent-authored drafts', () => {
			const review = createMockDraftReview('d1', { generatedBy: createMockAgentActor('a1') });

			render(AttributionStrip, {
				props: { review, approvalRequirement: describeApprovalRequirement(review) },
			});

			expect(
				screen.getByText(/requires the principal's approval\. No verdict recorded yet\./)
			).toBeInTheDocument();
		});

		it('makes the all-reviewers rule legible with counts', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1'),
				verdicts: [createMockVerdict()],
			});

			render(AttributionStrip, {
				props: {
					review,
					approvalRequirement: describeApprovalRequirement(review, { invitedReviewerCount: 3 }),
				},
			});

			expect(
				screen.getByText('Requires a verdict from all 3 invited reviewers. 1 of 3 recorded.')
			).toBeInTheDocument();
		});

		it('states that an outstanding invitation is revocable', () => {
			render(AttributionStrip, {
				props: {
					review: createMockDraftReview('d1', {
						grant: {
							reviewer: createMockReviewActor('r9', { username: 'kim', domain: 'lesser.host' }),
							grantedAt: '2026-07-29T08:00:00.000Z',
						},
					}),
				},
			});

			expect(screen.getByText('Review invitation')).toBeInTheDocument();
			expect(screen.getByText('@kim@lesser.host')).toBeInTheDocument();
			expect(screen.getByText('Invitations can be revoked.')).toBeInTheDocument();
		});

		it('omits the invitation row when there is no outstanding grant', () => {
			render(AttributionStrip, { props: { review: createMockDraftReview('d1') } });

			expect(screen.queryByText('Review invitation')).not.toBeInTheDocument();
		});
	});

	describe('Review.VerdictActions', () => {
		const baseProps = { draftId: 'd1', onSubmit: vi.fn() };

		it('guards approval behind a confirmation dialog', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

			expect(await screen.findByRole('dialog')).toBeInTheDocument();
			expect(screen.getByText('Approve this draft?')).toBeInTheDocument();
			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('submits the approval only after confirmation', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
			const dialog = await screen.findByRole('dialog');
			const confirm = within(dialog).getByRole('button', { name: 'Approve' });
			await fireEvent.click(confirm);

			await waitFor(() =>
				expect(onSubmit).toHaveBeenCalledWith({ draftId: 'd1', verdict: 'APPROVED' })
			);
		});

		it('blocks a changes-requested verdict until notes are supplied', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Request changes' }));
			const dialog = await screen.findByRole('dialog');
			const confirm = within(dialog).getByRole('button', { name: 'Request changes' });

			expect(confirm).toBeDisabled();
			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('submits notes with a changes-requested verdict', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Request changes' }));
			const dialog = await screen.findByRole('dialog');
			const notes = within(dialog).getByLabelText(/Notes/);
			await fireEvent.input(notes, { target: { value: '  Tighten the intro  ' } });

			await fireEvent.click(within(dialog).getByRole('button', { name: 'Request changes' }));

			await waitFor(() =>
				expect(onSubmit).toHaveBeenCalledWith({
					draftId: 'd1',
					verdict: 'CHANGES_REQUESTED',
					notes: 'Tighten the intro',
				})
			);
		});

		it('marks the notes field required and invalid when blank on blur', async () => {
			render(VerdictActions, { props: baseProps });

			await fireEvent.click(screen.getByRole('button', { name: 'Request changes' }));
			const dialog = await screen.findByRole('dialog');
			const notes = within(dialog).getByLabelText(/Notes/);

			expect(notes).toBeRequired();

			await fireEvent.blur(notes);

			expect(notes).toHaveAttribute('aria-invalid', 'true');

			// The TextArea primitive renders the error with role="alert" and wires
			// it to the field via aria-describedby.
			const fieldError = within(dialog).getByText('Notes are required when requesting changes.');
			expect(fieldError).toBeInTheDocument();
			expect(notes.getAttribute('aria-describedby')).toContain(fieldError.id);
		});

		it('allows a notes-free changes verdict when the guard is disabled', async () => {
			const onSubmit = vi.fn().mockResolvedValue(undefined);
			render(VerdictActions, {
				props: { ...baseProps, onSubmit, requireNotesForChanges: false },
			});

			await fireEvent.click(screen.getByRole('button', { name: 'Request changes' }));
			const dialog = await screen.findByRole('dialog');
			await fireEvent.click(within(dialog).getByRole('button', { name: 'Request changes' }));

			await waitFor(() =>
				expect(onSubmit).toHaveBeenCalledWith({ draftId: 'd1', verdict: 'CHANGES_REQUESTED' })
			);
		});

		it('keeps the dialog open and announces a submission failure', async () => {
			const onSubmit = vi.fn().mockRejectedValue(new Error('Reviewer not invited'));
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
			const dialog = await screen.findByRole('dialog');
			await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

			const alert = await screen.findByRole('alert');
			expect(alert).toHaveTextContent('Reviewer not invited');
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		it('dismisses without submitting when cancelled', async () => {
			const onSubmit = vi.fn();
			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
			const dialog = await screen.findByRole('dialog');
			await fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

			await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('disables both verdict actions when disabled', () => {
			render(VerdictActions, { props: { ...baseProps, disabled: true } });

			expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
			expect(screen.getByRole('button', { name: 'Request changes' })).toBeDisabled();
		});
	});
});
