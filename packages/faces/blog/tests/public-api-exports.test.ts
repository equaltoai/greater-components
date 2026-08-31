/**
 * Source-entry reachability tests.
 *
 * The pinned review wording and state helpers are promised to consumers
 * (docs/faces/blog/review-workflow.md, the #1055 semver note), so they must
 * be importable through the package root `@equaltoai/greater-components-blog`
 * — not only through the internal `components/Review` module.
 *
 * What this file proves: the *source* entry (`src/index.ts`) re-exports the
 * pinned names. The vitest config aliases the package name onto `src/`, so
 * every import below resolves the source entry — this test would still pass
 * if a build dropped the names from `dist/`.
 *
 * What proves the built package instead: `scripts/assert-dist-public-exports.mjs`
 * runs at the end of the package build and statically asserts that
 * `dist/index.js` and `dist/index.d.ts` export the same pinned names (plain
 * Node cannot import the dist graph — transitive `.svelte` modules need a
 * bundler — so the check inspects the emitted export surface). Both halves
 * are required: this test keeps the source entry honest, that script keeps
 * the publishable artifact honest.
 */
import { describe, expect, it } from 'vitest';
import {
	REVIEW_STATE_QUALIFIER,
	REVIEW_STALE_APPROVAL_DETAIL,
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	REVIEW_STALE_APPROVAL_LABEL,
	describeApprovalRequirement,
	formatReviewDateTime,
	resolveReviewState,
	reviewActorHandle,
	reviewActorName,
} from '@equaltoai/greater-components-blog';
import type { ReviewStateDescriptor, ReviewStateTone } from '@equaltoai/greater-components-blog';
import { createMockDraftReview, createMockVerdict } from './mocks/mockDraftReview.js';

describe('package root public entry', () => {
	it('exports the pinned stale-approval wording', () => {
		expect(REVIEW_STALE_APPROVAL_LABEL).toBe('Latest verdict: Approved (superseded)');
		expect(REVIEW_STALE_APPROVAL_DETAIL).toBe(
			'This approval no longer counts. Approval for the current revision is outstanding.'
		);
		expect(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL).toBe(
			'This approval no longer counts. Principal approval for the current revision is outstanding.'
		);
	});

	it('exports the review-state qualifier', () => {
		expect(REVIEW_STATE_QUALIFIER).toBe('latest activity, not publication state');
	});

	it('exports the review state helpers', () => {
		expect(describeApprovalRequirement).toBeTypeOf('function');
		expect(formatReviewDateTime).toBeTypeOf('function');
		expect(resolveReviewState).toBeTypeOf('function');
		expect(reviewActorHandle).toBeTypeOf('function');
		expect(reviewActorName).toBeTypeOf('function');
	});

	it('carries the stale-approved tone in ReviewStateTone at the public entry', () => {
		const tone: ReviewStateTone = 'stale-approved';
		expect(tone).toBe('stale-approved');
	});

	it('resolves the stale-approved descriptor through the public entry', () => {
		// Lesser's authoritative stale marker on the newest approval.
		const review = createMockDraftReview('d1', {
			verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
		});

		const state: ReviewStateDescriptor = resolveReviewState(review);

		expect(state.tone).toBe('stale-approved');
		expect(state.label).toBe(REVIEW_STALE_APPROVAL_LABEL);
		expect(state.detail).toBe(REVIEW_STALE_APPROVAL_DETAIL);
		expect(state.stale).toBe(true);
	});
});
