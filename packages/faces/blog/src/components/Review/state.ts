import { formatDateTime } from '@equaltoai/greater-components-utils';
import type {
	DraftReviewData,
	ReviewActorData,
	ReviewApprovalRequirement,
	ReviewStateDescriptor,
	ReviewStateTone,
	ReviewVerdictRecordData,
} from '../../types.js';

/**
 * The qualifier the chrome renders alongside every resolved review state.
 *
 * Neither `reviewStatus` nor the verdict history is the publication gate, so
 * the state badge is always accompanied by this disclaimer. Exported so
 * consumers and tests assert the exact string rather than a paraphrase.
 */
export const REVIEW_STATE_QUALIFIER = 'latest activity, not publication state';

/**
 * Badge label for a recorded approval that Lesser has voided for the current
 * revision. The parenthetical keeps the history visible ("an approval was
 * recorded") while ruling out any reading of it as current approval.
 */
export const REVIEW_STALE_APPROVAL_LABEL = 'Latest verdict: Approved (superseded)';

/**
 * Explanation rendered with a stale approval when no principal rule is in
 * force. States that the recorded approval no longer counts and that approval
 * for the current revision is outstanding.
 */
export const REVIEW_STALE_APPROVAL_DETAIL =
	'This approval no longer counts. Approval for the current revision is outstanding.';

/**
 * Explanation rendered with a stale approval when the draft requires the
 * instance principal's approval — the TheoryLive case: a generated draft whose
 * media changed after the principal approved.
 */
export const REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL =
	'This approval no longer counts. Principal approval for the current revision is outstanding.';

/**
 * Formats a review timestamp for display while preserving a machine-readable
 * value for `<time datetime>`.
 *
 * Uses the same `formatDateTime` helper as `Article.Card`, so review chrome and
 * article chrome render timestamps identically.
 */
export function formatReviewDateTime(value: string | Date | null | undefined): {
	label: string;
	iso?: string;
} {
	if (value === null || value === undefined || value === '') {
		return { label: '' };
	}

	const formatted = formatDateTime(value);
	return {
		label: formatted.absolute,
		iso: formatted.iso || undefined,
	};
}

/**
 * Human-facing name for an actor, falling back to the handle.
 */
export function reviewActorName(actor: ReviewActorData | null | undefined): string {
	if (!actor) return '';
	const displayName = actor.displayName?.trim();
	if (displayName) return displayName;
	return actor.username;
}

/**
 * Fully-qualified handle for an actor (`@user` locally, `@user@domain` remote).
 */
export function reviewActorHandle(actor: ReviewActorData | null | undefined): string {
	if (!actor) return '';
	const domain = actor.domain?.trim();
	return domain ? `@${actor.username}@${domain}` : `@${actor.username}`;
}

/**
 * Maps a server-authored review status string onto a styling tone.
 *
 * The status *text* is always rendered verbatim — this only chooses a colour.
 * Unrecognised values fall back to the neutral `pending` tone so an unknown
 * server status is never mis-coloured as success or as a blocker.
 */
function toneForServerStatus(status: string): ReviewStateTone {
	const normalized = status.trim().toLowerCase();
	if (/\b(approved|accepted)\b/.test(normalized)) return 'approved';
	if (/\b(changes[ _-]?requested|rejected|revision[s]?[ _-]?requested)\b/.test(normalized)) {
		return 'changes-requested';
	}
	return 'pending';
}

/**
 * Picks the newest row of a verdict history.
 *
 * Ordering is by `recordedAt`. A row whose timestamp cannot be parsed never
 * wins the comparison, but it still counts as activity — the last such row is
 * used only when no row in the history has a usable timestamp. Lesser returns
 * the history in order, so the last row is the right fallback.
 */
function latestVerdict(
	verdicts: readonly ReviewVerdictRecordData[]
): ReviewVerdictRecordData | undefined {
	let newest: ReviewVerdictRecordData | undefined;
	let newestTime = Number.NEGATIVE_INFINITY;
	let fallback: ReviewVerdictRecordData | undefined;

	for (const record of verdicts) {
		if (!record) continue;
		fallback = record;

		const time = Date.parse(record.recordedAt ?? '');
		if (!Number.isNaN(time) && time >= newestTime) {
			newest = record;
			newestTime = time;
		}
	}

	return newest ?? fallback;
}

/**
 * Whether the newest verdict record is an approval that Lesser has voided for
 * the current revision.
 *
 * Staleness is consumed from the server-authored markers on the pinned
 * v1.6.28 contract (`DraftReviewVerdictRecord.stale` / `.current`) and never
 * inferred: an older or partial projection without the markers returns
 * `false`, which leaves the historical badge in place rather than inventing a
 * current approval either way.
 */
function isStaleApproval(record: ReviewVerdictRecordData | undefined): boolean {
	if (!record || record.verdict !== 'APPROVED') return false;
	return record.stale === true || record.current === false;
}

/**
 * The stale-approval descriptor shared by both resolution branches.
 *
 * The explanation names the principal rule only when Lesser's canonical gate
 * projection says it is in force and unsatisfied; partial projections get the
 * generic wording rather than a guessed rule.
 */
function staleApprovedState(review: DraftReviewData): ReviewStateDescriptor {
	const eligibility = review.publishEligibility;
	const principalOutstanding =
		eligibility !== undefined &&
		eligibility !== null &&
		eligibility.principalApprovalRequired === true &&
		eligibility.principalApproved === false;

	return {
		tone: 'stale-approved',
		label: REVIEW_STALE_APPROVAL_LABEL,
		source: 'verdicts',
		stale: true,
		detail: principalOutstanding
			? REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL
			: REVIEW_STALE_APPROVAL_DETAIL,
	};
}

/**
 * Resolves the review state to render for a draft.
 *
 * **This is latest activity, never the publication gate.** The branches below
 * report what most recently happened, not whether the draft may publish:
 *
 * 1. When Lesser supplied `reviewStatus`, that string is rendered verbatim
 *    (`source: 'server'`). Lesser overwrites `Draft.ReviewStatus` with the
 *    verdict on *every* submission, so it names the most recent submission —
 *    a later `CHANGES_REQUESTED` from one reviewer replaces an earlier
 *    `APPROVED` from another, and neither reflects the gate.
 * 2. Otherwise the newest recorded verdict is named (`source: 'verdicts'`).
 *
 * **One exception honours a more authoritative signal.** When the newest
 * recorded approval carries Lesser's stale markers (`stale: true` or
 * `current: false` on the verdict record) the resolver emits the
 * `stale-approved` state instead of letting that approval read as current —
 * even when `reviewStatus` still spells the approval. A media or content
 * change stales earlier verdicts upstream, and the badge must not keep the
 * success tone or wording of a current approval after that happens. The
 * historical record stays visible; it is just demoted to history.
 *
 * Lesser v1.6.28 exposes the canonical publication gate separately through
 * `publishEligibility`. This resolver deliberately remains an activity badge;
 * it never substitutes activity history for that server-authored gate. See
 * {@link describeApprovalRequirement}.
 *
 * Renderers pair the result with {@link REVIEW_STATE_QUALIFIER}.
 */
export function resolveReviewState(review: DraftReviewData): ReviewStateDescriptor {
	const newest = latestVerdict(review.verdicts ?? []);
	const staleApproved = isStaleApproval(newest);

	const serverStatus = review.reviewStatus?.trim();
	if (serverStatus) {
		// A server string that would read as an approval is not rendered as one
		// when Lesser's own markers void the underlying approval. Any other server
		// string (including changes-requested and unrecognised values) stays
		// verbatim — it already avoids the success reading.
		if (staleApproved && toneForServerStatus(serverStatus) === 'approved') {
			return staleApprovedState(review);
		}

		return {
			tone: toneForServerStatus(serverStatus),
			label: serverStatus,
			source: 'server',
			stale: false,
		};
	}

	if (!newest) {
		return { tone: 'pending', label: 'No review activity recorded', source: 'none', stale: false };
	}

	if (staleApproved) {
		return staleApprovedState(review);
	}

	// The label names the verdict *record*, so it reads as history rather than
	// as a decision about the draft.
	return newest.verdict === 'CHANGES_REQUESTED'
		? {
				tone: 'changes-requested',
				label: 'Latest verdict: Changes requested',
				source: 'verdicts',
				stale: false,
			}
		: { tone: 'approved', label: 'Latest verdict: Approved', source: 'verdicts', stale: false };
}

/**
 * Options for {@link describeApprovalRequirement}.
 */
export interface DescribeApprovalRequirementOptions {
	/**
	 * How many reviewers hold an **active** (unrevoked) grant on this draft.
	 *
	 * Lesser v1.6.4 projects `activeReviewerIds` and the complete grant set. This
	 * override remains useful for partial selections and backwards-compatible
	 * consumer-provided view models.
	 *
	 * Note this is the *active* count, not an invited count: a revoked grant
	 * leaves the required set immediately while its verdict history remains as
	 * audit-only record.
	 */
	activeReviewerCount?: number;
}

/**
 * Whether the draft records a generator, which is what arms the principal rule.
 *
 * Lesser tests `strings.TrimSpace(draft.GeneratedBy) != ""` — a plain non-empty
 * string check. It is deliberately **not** keyed on `Actor.isAgent`, so a draft
 * generated by a delegated local actor arms the rule exactly as an agent-
 * generated draft does. An actor projection with no usable identity is treated
 * as absent, mirroring the upstream trim.
 */
function hasRecordedGenerator(review: DraftReviewData): boolean {
	const generator = review.generatedBy;
	if (!generator) return false;

	return Boolean(generator.id?.trim() || generator.username?.trim());
}

/**
 * Describes, for display only, which approval rules govern a draft.
 *
 * Lesser's rules are **cumulative**. `PublishDraft` requires unanimous approval
 * from every active reviewer grant for *every* draft, and — whenever the draft
 * records a generator — additionally requires the instance principal's own
 * active grant and current `APPROVED` verdict. A generated draft must satisfy
 * both; no other reviewer can substitute for the principal, and a generated
 * draft that never grants the principal fails closed.
 *
 * This is a **presentation mirror, not an enforcement point**. Nothing in the
 * review chrome consumes the result to enable, disable, or gate a verdict
 * submission; Lesser enforces the policy and rejects invalid submissions.
 *
 * Reviewer count comes from Lesser's canonical `activeReviewerIds` projection,
 * or from an explicit override for partial view models. It never counts verdict
 * history, which remains immutable and append-only.
 */
export function describeApprovalRequirement(
	review: DraftReviewData,
	options: DescribeApprovalRequirementOptions = {}
): ReviewApprovalRequirement {
	const activeReviewerCount =
		options.activeReviewerCount ??
		review.activeReviewerIds?.length ??
		(review.grantsTruncated
			? undefined
			: review.grants?.filter((grant) => grant.status === 'ACTIVE').length);
	const principalApproval =
		review.publishEligibility?.principalApprovalRequired ??
		review.principalApprovalRequired ??
		hasRecordedGenerator(review);

	return {
		allActiveReviewers: true,
		principalApproval,
		...(activeReviewerCount === undefined ? {} : { activeReviewerCount }),
	};
}
