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
 * Resolves the review state to render for a draft.
 *
 * **This is latest activity, never the publication gate.** Both branches below
 * report what most recently happened, not whether the draft may publish:
 *
 * 1. When Lesser supplied `reviewStatus`, that string is rendered verbatim
 *    (`source: 'server'`). Lesser overwrites `Draft.ReviewStatus` with the
 *    verdict on *every* submission, so it names the most recent submission —
 *    a later `CHANGES_REQUESTED` from one reviewer replaces an earlier
 *    `APPROVED` from another, and neither reflects the gate.
 * 2. Otherwise the newest recorded verdict is named (`source: 'verdicts'`).
 *
 * The real gate reconstructs, per reviewer holding an active grant, that
 * reviewer's newest verdict recorded *after* the grant was issued, and requires
 * all of them to approve — plus the instance principal for generated drafts.
 * That reconstruction needs the active-grant set and the principal's identity,
 * neither of which the pinned projection exposes, so the chrome does not
 * attempt it. See {@link describeApprovalRequirement}.
 *
 * Renderers pair the result with {@link REVIEW_STATE_QUALIFIER}.
 */
export function resolveReviewState(review: DraftReviewData): ReviewStateDescriptor {
	const serverStatus = review.reviewStatus?.trim();
	if (serverStatus) {
		return {
			tone: toneForServerStatus(serverStatus),
			label: serverStatus,
			source: 'server',
		};
	}

	const newest = latestVerdict(review.verdicts ?? []);
	if (!newest) {
		return { tone: 'pending', label: 'No review activity recorded', source: 'none' };
	}

	// The label names the verdict *record*, so it reads as history rather than
	// as a decision about the draft.
	return newest.verdict === 'CHANGES_REQUESTED'
		? { tone: 'changes-requested', label: 'Latest verdict: Changes requested', source: 'verdicts' }
		: { tone: 'approved', label: 'Latest verdict: Approved', source: 'verdicts' };
}

/**
 * Options for {@link describeApprovalRequirement}.
 */
export interface DescribeApprovalRequirementOptions {
	/**
	 * How many reviewers hold an **active** (unrevoked) grant on this draft.
	 *
	 * The pinned projection exposes only `DraftReview.grant` — the *viewer's
	 * own* invitation — not the full active set, so this cannot be derived from
	 * `DraftReviewData`. Supply it only from a source that genuinely enumerates
	 * active grants; when omitted the descriptor names the rules without
	 * implying any completion.
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
 * The descriptor reports no progress. Doing so honestly would require counting
 * reviewers with an active grant at the current round — data the pinned
 * projection does not carry — and counting `verdicts` instead would be wrong,
 * because that history is immutable and append-only. The chrome therefore names
 * the rules and stays neutral about how far along they are.
 */
export function describeApprovalRequirement(
	review: DraftReviewData,
	options: DescribeApprovalRequirementOptions = {}
): ReviewApprovalRequirement {
	const { activeReviewerCount } = options;

	return {
		allActiveReviewers: true,
		principalApproval: hasRecordedGenerator(review),
		...(activeReviewerCount === undefined ? {} : { activeReviewerCount }),
	};
}
