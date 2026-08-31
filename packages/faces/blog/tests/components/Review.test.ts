import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import QueueCard from '../../src/components/Review/QueueCard.svelte';
import AttributionStrip from '../../src/components/Review/AttributionStrip.svelte';
import VerdictActions from '../../src/components/Review/VerdictActions.svelte';
import {
	REVIEW_STALE_APPROVAL_DETAIL,
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	REVIEW_STALE_APPROVAL_LABEL,
	describeApprovalRequirement,
	resolveReviewState,
	reviewActorHandle,
	reviewActorName,
} from '../../src/components/Review/state.js';
import type { DraftPublishEligibilityData } from '../../src/types.js';
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

	describe('stale approval (issue #1055)', () => {
		function createMockEligibility(
			overrides: Partial<DraftPublishEligibilityData> = {}
		): DraftPublishEligibilityData {
			return {
				eligible: false,
				blockingReasons: ['the current revision has not been approved'],
				reviewersApproved: false,
				principalApprovalRequired: false,
				principalApproved: false,
				...overrides,
			};
		}

		it('marks an approval stale when Lesser sets the stale marker', () => {
			// The incident shape: media changed after the approval was recorded, so
			// the verdict record carries Lesser's authoritative stale marker and the
			// gate reports not eligible.
			const review = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: createMockEligibility(),
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'stale-approved',
				label: REVIEW_STALE_APPROVAL_LABEL,
				source: 'verdicts',
				stale: true,
				detail: REVIEW_STALE_APPROVAL_DETAIL,
			});
		});

		it('marks an approval stale when Lesser clears the current marker', () => {
			// `current` and `stale` are the two authoritative markers; either one
			// voiding the record is enough.
			const review = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', current: false })],
			});

			expect(resolveReviewState(review).tone).toBe('stale-approved');
			expect(resolveReviewState(review).stale).toBe(true);
		});

		it('keeps a genuinely current approval on the success tone', () => {
			const review = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: false })],
				publishEligibility: createMockEligibility({
					eligible: true,
					blockingReasons: [],
					reviewersApproved: true,
				}),
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'approved',
				label: 'Latest verdict: Approved',
				stale: false,
			});
		});

		it('names the principal rule when the stale draft requires principal approval', () => {
			// TheoryLive case: an agent-generated draft whose principal approval was
			// voided by a media change. The detail must say the principal approval
			// is outstanding, not merely that "approval" is.
			const review = createMockDraftReview('d1', {
				generatedBy: createMockAgentActor('a1'),
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: createMockEligibility({
					principalApprovalRequired: true,
					principalApproved: false,
				}),
			});

			expect(resolveReviewState(review).detail).toBe(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL);
		});

		it('uses the generic detail when the principal rule is satisfied or absent', () => {
			const satisfied = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: createMockEligibility({
					principalApprovalRequired: true,
					principalApproved: true,
				}),
			});
			const notRequired = createMockDraftReview('d2', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: createMockEligibility(),
			});

			expect(resolveReviewState(satisfied).detail).toBe(REVIEW_STALE_APPROVAL_DETAIL);
			expect(resolveReviewState(notRequired).detail).toBe(REVIEW_STALE_APPROVAL_DETAIL);
		});

		it('overrides an approval-shaped reviewStatus when the verdict markers void it', () => {
			// Lesser overwrites reviewStatus only on submission, so after a media
			// change it can still spell the approval while the verdict markers say
			// it no longer applies. The authoritative markers win; the badge must
			// not keep the success reading.
			const review = createMockDraftReview('d1', {
				reviewStatus: 'Approved',
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: createMockEligibility(),
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'stale-approved',
				label: REVIEW_STALE_APPROVAL_LABEL,
				stale: true,
			});
		});

		it('still renders a non-approval reviewStatus verbatim alongside stale markers', () => {
			// A server string that already avoids the success reading is not
			// replaced — it is the newer activity signal.
			const review = createMockDraftReview('d1', {
				reviewStatus: 'Changes requested',
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'changes-requested',
				label: 'Changes requested',
				source: 'server',
				stale: false,
			});
		});

		it('does not mark a stale changes-requested verdict as a stale approval', () => {
			// The demotion targets approvals only — a stale changes-request keeps
			// its existing qualified presentation.
			const review = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED', stale: true })],
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'changes-requested',
				label: 'Latest verdict: Changes requested',
				stale: false,
			});
		});

		it('degrades to the historical badge when the projection carries no markers', () => {
			// Older or partial projections omit current/stale entirely. Staleness
			// is consumed from the server, never inferred — the badge stays the
			// qualified activity badge and the draft is never shown as eligible.
			const review = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
			});

			expect(resolveReviewState(review)).toMatchObject({
				tone: 'approved',
				label: 'Latest verdict: Approved',
				stale: false,
			});
		});

		it('never resolves a stale approval to the success tone or a bare Approved', () => {
			const cases = [
				createMockDraftReview('d1', {
					verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				}),
				createMockDraftReview('d2', {
					reviewStatus: 'Approved',
					verdicts: [createMockVerdict({ verdict: 'APPROVED', current: false })],
				}),
			];

			for (const review of cases) {
				const state = resolveReviewState(review);
				expect(state.tone).not.toBe('approved');
				expect(state.label).not.toBe('Approved');
				expect(state.stale).toBe(true);
			}
		});

		describe('authority boundary — mutation-negative cases', () => {
			// Lesser's verdict-record markers are the only staleness authority.
			// Every case below fails under the mutation
			// `isStaleApproval(newest) || review.publishEligibility?.eligible === false`,
			// proving the gate projection is presentation data for the badge and can
			// never be promoted into a staleness inference.

			function createIneligiblePrincipalEligibility(): DraftPublishEligibilityData {
				return createMockEligibility({
					eligible: false,
					blockingReasons: ['principal approval outstanding'],
					principalApprovalRequired: true,
					principalApproved: false,
				});
			}

			it('keeps a marker-less current approval approved when the gate is ineligible', () => {
				// The incident inversion: the principal approval is outstanding and
				// the gate reports ineligible, yet the newest verdict carries no
				// voiding marker — so the approval is current and keeps its tone.
				const review = createMockDraftReview('d1', {
					generatedBy: createMockAgentActor('a1'),
					verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
					publishEligibility: createIneligiblePrincipalEligibility(),
				});
				const state = resolveReviewState(review);

				expect(state).toMatchObject({
					tone: 'approved',
					label: 'Latest verdict: Approved',
					source: 'verdicts',
					stale: false,
				});
				expect(state.detail).toBeUndefined();
			});

			it('keeps an explicitly current approval approved when the gate is ineligible', () => {
				const review = createMockDraftReview('d1', {
					generatedBy: createMockAgentActor('a1'),
					verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: false })],
					publishEligibility: createIneligiblePrincipalEligibility(),
				});

				expect(resolveReviewState(review)).toMatchObject({
					tone: 'approved',
					label: 'Latest verdict: Approved',
					stale: false,
				});
			});

			it('keeps an approval-shaped reviewStatus current when the gate is ineligible', () => {
				// The server-string branch must honour the same boundary: an
				// ineligible gate never rewrites an unvoided approval reading.
				const review = createMockDraftReview('d1', {
					reviewStatus: 'Approved',
					verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: false })],
					publishEligibility: createIneligiblePrincipalEligibility(),
				});

				expect(resolveReviewState(review)).toMatchObject({
					tone: 'approved',
					label: 'Approved',
					source: 'server',
					stale: false,
				});
			});

			it('demotes contradictory authoritative markers in the safe direction', () => {
				// `current: true` and `stale: true` cannot both describe one
				// revision; when Lesser's projection carries both, the badge fails
				// closed — superseded — and never lets the approval read as current.
				const review = createMockDraftReview('d1', {
					verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: true })],
				});

				expect(resolveReviewState(review)).toMatchObject({
					tone: 'stale-approved',
					label: REVIEW_STALE_APPROVAL_LABEL,
					source: 'verdicts',
					stale: true,
				});
			});

			it('demotes contradictory markers even when reviewStatus still spells the approval', () => {
				const review = createMockDraftReview('d1', {
					reviewStatus: 'Approved',
					verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: true })],
				});

				expect(resolveReviewState(review)).toMatchObject({
					tone: 'stale-approved',
					label: REVIEW_STALE_APPROVAL_LABEL,
					stale: true,
				});
			});

			it('emits an explicit stale boolean for every resolved state', () => {
				// The descriptor types the field optional for additive downstream
				// construction; the resolver itself never leaves it undefined.
				const reviews = [
					createMockDraftReview('d1'),
					createMockDraftReview('d2', { reviewStatus: 'Approved' }),
					createMockDraftReview('d3', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
					}),
					createMockDraftReview('d4', {
						verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED' })],
					}),
					createMockDraftReview('d5', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
					}),
				];

				for (const review of reviews) {
					expect(typeof resolveReviewState(review).stale).toBe('boolean');
				}
			});
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

		it('renders a stale approval without the success tone or current-approval wording', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockAgentActor('a1'),
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: {
					eligible: false,
					blockingReasons: [],
					reviewersApproved: false,
					principalApprovalRequired: true,
					principalApproved: false,
				},
			});

			const { container } = render(QueueCard, { props: { review } });

			// The recorded approval stays visible — demoted to history, not hidden.
			expect(screen.getByText(REVIEW_STALE_APPROVAL_LABEL)).toBeInTheDocument();
			// The explanation states it no longer counts and names the outstanding
			// principal approval.
			expect(screen.getByText(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL)).toBeInTheDocument();
			// And the badge must not carry the approved/success tone.
			const badge = container.querySelector('.gr-blog-review-card__state');
			expect(badge).toHaveClass('gr-blog-review-card__state--stale-approved');
			expect(badge).not.toHaveClass('gr-blog-review-card__state--approved');
			// The activity qualifier still applies to the stale badge.
			expect(screen.getByText('latest activity, not publication state')).toBeInTheDocument();
		});

		it('keeps a genuinely current approval on the success tone', () => {
			const { container } = render(QueueCard, {
				props: {
					review: createMockDraftReview('d1', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED', current: true, stale: false })],
					}),
				},
			});

			const badge = container.querySelector('.gr-blog-review-card__state');
			expect(badge).toHaveClass('gr-blog-review-card__state--approved');
			expect(badge).not.toHaveClass('gr-blog-review-card__state--stale-approved');
			expect(screen.queryByText(REVIEW_STALE_APPROVAL_DETAIL)).not.toBeInTheDocument();
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

		it('shows a stale approval as history, without the success tone', () => {
			// Even when reviewStatus still spells the approval, the strip must show
			// the voided state: visible text, non-success tone, outstanding approval.
			const review = createMockDraftReview('d1', {
				reviewStatus: 'Approved',
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
				publishEligibility: {
					eligible: false,
					blockingReasons: [],
					reviewersApproved: false,
					principalApprovalRequired: true,
					principalApproved: false,
				},
			});

			const { container } = render(AttributionStrip, { props: { review } });

			expect(screen.getByText(REVIEW_STALE_APPROVAL_LABEL)).toBeInTheDocument();
			expect(screen.getByText(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL)).toBeInTheDocument();
			expect(screen.queryByText('Approved', { exact: true })).not.toBeInTheDocument();

			const badge = container.querySelector('.gr-blog-review-attribution__state');
			expect(badge).toHaveClass('gr-blog-review-attribution__state--stale-approved');
			expect(badge).not.toHaveClass('gr-blog-review-attribution__state--approved');
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
