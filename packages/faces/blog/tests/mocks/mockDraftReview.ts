/**
 * Mock Draft Review Data
 *
 * Factory functions producing `DraftReviewData` shaped exactly like the pinned
 * Lesser contract snapshot (LESSER_REF v1.5.32) returns it.
 */

import type { DraftReviewData, ReviewActorData, ReviewVerdictRecordData } from '../../src/types.js';

export function createMockReviewActor(
	id: string,
	overrides: Partial<ReviewActorData> = {}
): ReviewActorData {
	return {
		id,
		username: `user-${id}`,
		domain: null,
		displayName: `User ${id}`,
		avatar: `/avatars/${id}.png`,
		isAgent: false,
		...overrides,
	};
}

export function createMockAgentActor(
	id: string,
	overrides: Partial<ReviewActorData> = {}
): ReviewActorData {
	return createMockReviewActor(id, {
		username: `agent-${id}`,
		displayName: `Agent ${id}`,
		isAgent: true,
		...overrides,
	});
}

export function createMockVerdict(
	overrides: Partial<ReviewVerdictRecordData> = {}
): ReviewVerdictRecordData {
	return {
		verdict: 'APPROVED',
		notes: null,
		reviewer: createMockReviewActor('reviewer-1'),
		recordedAt: '2026-07-30T10:00:00.000Z',
		...overrides,
	};
}

export function createMockDraftReview(
	draftId: string,
	overrides: Partial<DraftReviewData> = {}
): DraftReviewData {
	return {
		draftId,
		title: `Draft ${draftId}`,
		subtitle: `Subtitle for ${draftId}`,
		excerpt: `Excerpt for ${draftId}`,
		contentFormat: 'MARKDOWN',
		status: 'DRAFT',
		scheduledAt: null,
		updatedAt: '2026-07-30T09:00:00.000Z',
		createdAt: '2026-07-29T09:00:00.000Z',
		generatedBy: null,
		reviewedBy: null,
		reviewStatus: null,
		editorNotes: null,
		grant: null,
		verdicts: [],
		...overrides,
	};
}
