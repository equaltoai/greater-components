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
		it('renders a server-supplied reviewStatus verbatim, as latest activity', () => {
			const review = createMockDraftReview('d1', { reviewStatus: 'Awaiting principal sign-off' });
			const state = resolveReviewState(review);

			expect(state.label).toBe('Awaiting principal sign-off');
			// `source: 'server'` means "Lesser said this", NOT "this is the gate".
			// Lesser overwrites ReviewStatus on every verdict submission.
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

		it('reports no activity when there is no status and no verdict', () => {
			const state = resolveReviewState(createMockDraftReview('d1'));

			expect(state).toMatchObject({
				tone: 'pending',
				label: 'No review activity recorded',
				source: 'none',
			});
		});

		it('names the newest verdict record rather than deriving a gate state', () => {
			// An earlier APPROVED followed by a later CHANGES_REQUESTED. The old
			// implementation scanned the whole history for any CHANGES_REQUESTED;
			// the point here is that the *newest* row wins, and that the label
			// names the record instead of asserting the draft's state.
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED', recordedAt: '2026-07-30T09:00:00.000Z' }),
					createMockVerdict({
						verdict: 'CHANGES_REQUESTED',
						notes: 'Tighten the intro',
						recordedAt: '2026-07-30T11:00:00.000Z',
					}),
				],
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'changes-requested',
				label: 'Latest verdict: Changes requested',
				source: 'verdicts',
			});
		});

		it('lets a later approval supersede an earlier changes-requested', () => {
			// The inverse ordering. A history-wide "any CHANGES_REQUESTED wins"
			// rule would report changes-requested here, which is wrong: the
			// reviewer came back and approved.
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({
						verdict: 'CHANGES_REQUESTED',
						notes: 'Tighten the intro',
						recordedAt: '2026-07-30T09:00:00.000Z',
					}),
					createMockVerdict({ verdict: 'APPROVED', recordedAt: '2026-07-30T11:00:00.000Z' }),
				],
			});

			expect(resolveReviewState(review)).toMatchObject({
				label: 'Latest verdict: Approved',
				source: 'verdicts',
			});
		});

		it('breaks a recordedAt tie by append order, matching the history', () => {
			// Lesser returns the history in order, so on an exact timestamp tie the
			// later row is the later submission.
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED', recordedAt: '2026-07-30T10:00:00.000Z' }),
					createMockVerdict({
						verdict: 'CHANGES_REQUESTED',
						recordedAt: '2026-07-30T10:00:00.000Z',
					}),
				],
			});

			expect(resolveReviewState(review).label).toBe('Latest verdict: Changes requested');
		});

		it('does not let an unparseable timestamp displace a placeable one', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED', recordedAt: '2026-07-30T10:00:00.000Z' }),
					createMockVerdict({ verdict: 'CHANGES_REQUESTED', recordedAt: 'not-a-timestamp' }),
				],
			});

			expect(resolveReviewState(review).label).toBe('Latest verdict: Approved');
		});

		it('still reports activity when no timestamp can be parsed at all', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED', recordedAt: 'nope' }),
					createMockVerdict({ verdict: 'CHANGES_REQUESTED', recordedAt: 'nope' }),
				],
			});

			// Unusable timestamps must not collapse real activity into "nothing
			// recorded" — that would understate the review state.
			expect(resolveReviewState(review)).toMatchObject({
				label: 'Latest verdict: Changes requested',
				source: 'verdicts',
			});
		});

		it('treats a blank reviewStatus as no status rather than a blank badge', () => {
			const review = createMockDraftReview('d1', { reviewStatus: '   ' });

			expect(resolveReviewState(review)).toMatchObject({
				label: 'No review activity recorded',
				source: 'none',
			});
		});

		it('reports an active reviewer count of zero rather than dropping it', () => {
			// Zero active grants is meaningful — it is the vacuous case that lets a
			// human-authored draft publish. It must not be swallowed as falsy.
			const requirement = describeApprovalRequirement(createMockDraftReview('d1'), {
				activeReviewerCount: 0,
			});

			expect(requirement).toHaveProperty('activeReviewerCount', 0);
		});

		it('orders by recordedAt, not by array position', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [
					createMockVerdict({ verdict: 'APPROVED', recordedAt: '2026-07-30T12:00:00.000Z' }),
					createMockVerdict({
						verdict: 'CHANGES_REQUESTED',
						recordedAt: '2026-07-30T08:00:00.000Z',
					}),
				],
			});

			expect(resolveReviewState(review).label).toBe('Latest verdict: Approved');
		});

		it('never labels a resolved state as a bare publication decision', () => {
			// Guards the F2 rule directly: no branch may emit "Approved" or
			// "Changes requested" standing alone, because neither reviewStatus nor
			// the verdict history is the publication gate.
			const cases = [
				createMockDraftReview('d1'),
				createMockDraftReview('d2', { verdicts: [createMockVerdict({ verdict: 'APPROVED' })] }),
				createMockDraftReview('d3', {
					verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED' })],
				}),
			];

			for (const review of cases) {
				const { label } = resolveReviewState(review);
				expect(label).not.toBe('Approved');
				expect(label).not.toBe('Changes requested');
			}
		});

		it('requires both unanimous reviewers and the principal for a generated draft', () => {
			// Mirrors lesser's TestDraftReviewGateRequiresAllActiveReviewersAndPrincipal:
			// PublishDraft evaluates HasUnanimousActiveApproval for every draft and
			// HasPrincipalApproval as well when GeneratedBy is non-empty.
			const review = createMockDraftReview('d1', { generatedBy: createMockAgentActor('a1') });

			expect(describeApprovalRequirement(review)).toEqual({
				allActiveReviewers: true,
				principalApproval: true,
			});
		});

		it('arms the principal rule for a delegated non-agent generator', () => {
			// Lesser keys the rule on a non-empty GeneratedBy string, not on
			// Actor.isAgent, so a delegated local actor counts exactly the same.
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1', { isAgent: false }),
			});

			expect(describeApprovalRequirement(review)).toEqual({
				allActiveReviewers: true,
				principalApproval: true,
			});
		});

		it('requires only unanimous active reviewers when no generator is recorded', () => {
			const review = createMockDraftReview('d1', { generatedBy: null });

			expect(describeApprovalRequirement(review)).toEqual({
				allActiveReviewers: true,
				principalApproval: false,
			});
		});

		it('treats an identity-less generator projection as no generator', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: { id: '  ', username: '  ', isAgent: true },
			});

			expect(describeApprovalRequirement(review).principalApproval).toBe(false);
		});

		it('never reports progress derived from the immutable verdict history', () => {
			// verdicts are append-only rounds: repeats and revoke/re-grant cycles
			// make any count taken from them meaningless as progress.
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1'),
				verdicts: [
					createMockVerdict(),
					createMockVerdict({ reviewer: createMockReviewActor('r2') }),
					createMockVerdict({ reviewer: createMockReviewActor('r2') }),
				],
			});

			const requirement = describeApprovalRequirement(review);
			expect(requirement).not.toHaveProperty('recorded');
			expect(requirement).not.toHaveProperty('required');
			expect(requirement).not.toHaveProperty('activeReviewerCount');
		});

		it('reports an active reviewer count only when the caller supplies one', () => {
			const review = createMockDraftReview('d1', { generatedBy: createMockReviewActor('h1') });

			expect(describeApprovalRequirement(review, { activeReviewerCount: 3 })).toEqual({
				allActiveReviewers: true,
				principalApproval: true,
				activeReviewerCount: 3,
			});
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

			expect(screen.getByText('Latest verdict: Changes requested')).toBeInTheDocument();
		});

		it('qualifies the card state badge as latest activity', () => {
			// The badge colour must never be the only thing distinguishing
			// "someone approved" from "this draft may publish".
			render(QueueCard, {
				props: {
					review: createMockDraftReview('d1', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
					}),
				},
			});

			expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();
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
			expect(screen.getByText('No review activity recorded')).toBeInTheDocument();
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

		it('qualifies a server-supplied status as latest activity, not publication state', () => {
			render(AttributionStrip, {
				props: { review: createMockDraftReview('d1', { reviewStatus: 'Approved' }) },
			});

			expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();
		});

		it('qualifies a verdict-sourced status the same way', () => {
			render(AttributionStrip, {
				props: {
					review: createMockDraftReview('d1', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
					}),
				},
			});

			expect(screen.getByText('Latest verdict: Approved')).toBeInTheDocument();
			expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();
		});

		it('omits the qualifier only when nothing has been recorded', () => {
			render(AttributionStrip, { props: { review: createMockDraftReview('d1') } });

			expect(screen.queryByText('latest activity, not publication state')).not.toBeInTheDocument();
		});

		it('states both requirements for a generated draft', () => {
			const review = createMockDraftReview('d1', { generatedBy: createMockAgentActor('a1') });

			render(AttributionStrip, {
				props: { review, approvalRequirement: describeApprovalRequirement(review) },
			});

			const approval = screen.getByText(/Requires approval from/);
			expect(approval).toHaveTextContent('every reviewer with an active invitation');
			expect(approval).toHaveTextContent('from the instance principal as well');
			expect(approval).toHaveTextContent('Both are required.');
		});

		it('states both requirements for a delegated non-agent generator', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1', { isAgent: false }),
			});

			render(AttributionStrip, {
				props: { review, approvalRequirement: describeApprovalRequirement(review) },
			});

			expect(screen.getByText(/Requires approval from/)).toHaveTextContent(
				'from the instance principal as well'
			);
		});

		it('states only the reviewer rule when no generator is recorded', () => {
			const review = createMockDraftReview('d1', { generatedBy: null });

			render(AttributionStrip, {
				props: {
					review,
					approvalRequirement: describeApprovalRequirement(review, { activeReviewerCount: 3 }),
				},
			});

			const approval = screen.getByText(/Requires approval from/);
			expect(approval).toHaveTextContent('all 3 reviewers with an active invitation');
			expect(approval).not.toHaveTextContent('instance principal');
		});

		it('never renders an "N of M" progress claim', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockReviewActor('h1'),
				verdicts: [createMockVerdict(), createMockVerdict()],
			});

			const { container } = render(AttributionStrip, {
				props: {
					review,
					approvalRequirement: describeApprovalRequirement(review, { activeReviewerCount: 3 }),
				},
			});

			expect(container.textContent).not.toMatch(/\d+\s+of\s+\d+/);
			expect(container.textContent).not.toMatch(/recorded so far/);
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

		it('uses the 48px button size for every verdict action', async () => {
			render(VerdictActions, { props: baseProps });

			const approve = screen.getByRole('button', { name: 'Approve' });
			const requestChanges = screen.getByRole('button', { name: 'Request changes' });
			expect(approve).toHaveClass('gr-button--lg');
			expect(requestChanges).toHaveClass('gr-button--lg');

			await fireEvent.click(approve);
			const dialog = await screen.findByRole('dialog');
			expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveClass('gr-button--lg');
			expect(within(dialog).getByRole('button', { name: 'Approve' })).toHaveClass('gr-button--lg');
		});

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

		it('reopens with the failure when dismissed while the submission is in flight', async () => {
			// Modal's header close button writes open = false unconditionally — it is
			// not gated by closeOnEscape / closeOnBackdrop — so a reviewer can dismiss
			// the dialog mid-submit. A rejection must not be lost behind it.
			let rejectSubmission!: (reason: Error) => void;
			const onSubmit = vi.fn(
				() =>
					new Promise((_resolve, reject) => {
						rejectSubmission = reject;
					})
			);

			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
			const dialog = await screen.findByRole('dialog');
			await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

			// Dismiss while still in flight.
			await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

			rejectSubmission(new Error('reviewer not invited'));

			expect(await screen.findByRole('alert')).toHaveTextContent('reviewer not invited');
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		it('ignores Cancel while a submission is in flight', async () => {
			let resolveSubmission!: () => void;
			const onSubmit = vi.fn(
				() =>
					new Promise<void>((resolve) => {
						resolveSubmission = resolve;
					})
			);

			render(VerdictActions, { props: { ...baseProps, onSubmit } });

			await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
			const dialog = await screen.findByRole('dialog');
			await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

			expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled();

			resolveSubmission();
			await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		});

		it('disables both verdict actions when disabled', () => {
			render(VerdictActions, { props: { ...baseProps, disabled: true } });

			expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
			expect(screen.getByRole('button', { name: 'Request changes' })).toBeDisabled();
		});
	});
});
