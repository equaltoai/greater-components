import { formatDateTime } from '@equaltoai/greater-components-utils';
import type {
	DraftReviewData,
	ReviewActorData,
	ReviewApprovalRequirement,
	ReviewStateDescriptor,
	ReviewStateTone,
} from '../../types.js';

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
 * Resolves the review state to render for a draft.
 *
 * Resolution order:
 *
 * 1. When Lesser supplied `reviewStatus`, that string is authoritative and is
 *    rendered verbatim (`source: 'server'`).
 * 2. Otherwise the state is summarised from the recorded verdicts
 *    (`source: 'derived'`). A recorded `CHANGES_REQUESTED` takes precedence
 *    over recorded approvals, so the summary never reads "Approved" while a
 *    reviewer has changes outstanding.
 *
 * This is a *display* summary. It does not decide whether a draft may publish —
 * Lesser owns that.
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

	const verdicts = review.verdicts ?? [];
	if (verdicts.length === 0) {
		return { tone: 'pending', label: 'Awaiting review', source: 'derived' };
	}

	if (verdicts.some((record) => record.verdict === 'CHANGES_REQUESTED')) {
		return { tone: 'changes-requested', label: 'Changes requested', source: 'derived' };
	}

	return { tone: 'approved', label: 'Approved', source: 'derived' };
}

/**
 * Options for {@link describeApprovalRequirement}.
 */
export interface DescribeApprovalRequirementOptions {
	/**
	 * How many reviewers were invited, when the consumer knows it.
	 *
	 * The pinned contract exposes only the single outstanding `grant`, not the
	 * full invite list, so this cannot be derived from `DraftReviewData` alone.
	 * When omitted the descriptor reports the recorded count without implying a
	 * total.
	 */
	invitedReviewerCount?: number;
}

/**
 * Describes, for display only, which approval rule governs a draft.
 *
 * The rule mirrored here is Lesser's: agent-authored drafts (`generatedBy` is
 * an agent, per the contract's `Actor.isAgent`) require the principal's
 * approval; other drafts require a verdict from every invited reviewer.
 *
 * This is a **presentation mirror, not an enforcement point**. Nothing in the
 * review chrome consumes the result to enable, disable, or gate a verdict
 * submission; Lesser enforces the policy and rejects invalid submissions, and
 * `DraftReviewData.reviewStatus` remains the authoritative status. The
 * descriptor exists purely so a reviewer can see what is being asked of them.
 */
export function describeApprovalRequirement(
	review: DraftReviewData,
	options: DescribeApprovalRequirementOptions = {}
): ReviewApprovalRequirement {
	const recorded = review.verdicts?.length ?? 0;

	if (review.generatedBy?.isAgent) {
		return { kind: 'principal-approval', recorded, required: 1 };
	}

	return {
		kind: 'all-reviewers',
		recorded,
		...(options.invitedReviewerCount === undefined
			? {}
			: { required: options.invitedReviewerCount }),
	};
}
