/**
 * Contract-drift guard for the shared-draft review chrome.
 *
 * The review chrome renders a view model (`DraftReviewData` and friends) rather
 * than the generated GraphQL types, so nothing in the type system fails when
 * Lesser adds, renames, or drops a `DraftReview` field. These tests read the
 * pinned snapshot directly and fail if the chrome's view model stops matching
 * it — which is the signal to run the sync-contracts walk, not to patch the
 * view model in place.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	REVIEW_STATE_QUALIFIER,
	describeApprovalRequirement,
	resolveReviewState,
} from '../../src/components/Review/state.js';
import {
	createMockAgentActor,
	createMockDraftReview,
	createMockVerdict,
} from '../mocks/mockDraftReview.js';

function findRepoRoot(start = process.cwd()): string {
	let current = start;

	for (;;) {
		if (existsSync(resolve(current, 'docs/lesser/contracts/graphql-schema.graphql'))) {
			return current;
		}

		const parent = dirname(current);
		if (parent === current) {
			throw new Error('Could not locate repository root from current working directory.');
		}
		current = parent;
	}
}

function readLesserSchema(): string {
	return readFileSync(
		resolve(findRepoRoot(), 'docs/lesser/contracts/graphql-schema.graphql'),
		'utf8'
	);
}

function readLesserRef(): string {
	return readFileSync(resolve(findRepoRoot(), 'docs/lesser/contracts/LESSER_REF.txt'), 'utf8');
}

/** Extracts the field names declared on a GraphQL type or enum block. */
function readTypeBlock(schema: string, declaration: string): string[] {
	const start = schema.indexOf(declaration);
	expect(start, `${declaration} missing from the pinned snapshot`).toBeGreaterThan(-1);

	const end = schema.indexOf('\n}', start);
	const body = schema.slice(start + declaration.length, end);

	return body
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith('#'))
		.map((line) => line.split(/[:(\s]/)[0] ?? '')
		.filter((name) => name.length > 0);
}

describe('Lesser shared-draft review contract', () => {
	const schema = readLesserSchema();

	it('is pinned to a release carrying the review surface', () => {
		const ref = readLesserRef();

		// v1.6.4 adds canonical draft revision, grant-set, and publication eligibility data.
		// The assertions below keep
		// the review chrome pinned to the exact synchronized release boundary.
		expect(ref).toContain('tag: v1.6.4');
		expect(ref).toMatch(/commit: [0-9a-f]{40}/);
	});

	it('declares every DraftReview field the chrome renders', () => {
		const fields = readTypeBlock(schema, 'type DraftReview {');

		expect(fields).toEqual(
			expect.arrayContaining([
				'draftId',
				'title',
				'subtitle',
				'excerpt',
				'contentFormat',
				'status',
				'scheduledAt',
				'updatedAt',
				'createdAt',
				'generatedBy',
				'reviewedBy',
				'reviewStatus',
				'editorNotes',
				'contentHash',
				'revision',
				'activeReviewerIds',
				'publishEligible',
				'publishBlockingReasons',
				'reviewersApproved',
				'principalApprovalRequired',
				'principalApproved',
				'grants',
				'grant',
				'verdicts',
				'publishEligibility',
			])
		);
	});

	it('declares exactly the two verdicts the chrome offers', () => {
		expect(readTypeBlock(schema, 'enum DraftReviewVerdict {')).toEqual([
			'APPROVED',
			'CHANGES_REQUESTED',
		]);
	});

	it('declares the verdict record fields the attribution strip reads', () => {
		expect(readTypeBlock(schema, 'type DraftReviewVerdictRecord {')).toEqual(
			expect.arrayContaining(['verdict', 'notes', 'reviewer', 'recordedAt'])
		);
	});

	it('declares the grant fields backing the revocable-invitation row', () => {
		expect(readTypeBlock(schema, 'type DraftReviewGrant {')).toEqual(
			expect.arrayContaining(['reviewer', 'grantedAt'])
		);
	});

	it('exposes isAgent on Actor, which is how the chrome identifies agent authorship', () => {
		expect(readTypeBlock(schema, 'type Actor {')).toContain('isAgent');
	});

	describe('canonical publication eligibility projection', () => {
		it("retains the viewer's grant and exposes the complete grant set", () => {
			const fields = readTypeBlock(schema, 'type DraftReview {');

			expect(fields).toContain('grant');
			expect(fields).toContain('grants');
			expect(schema).toContain('grant: DraftReviewGrant');
			expect(schema).toMatch(/grants:\s*\[DraftReviewGrant/);
		});

		it('carries canonical grant lifecycle markers', () => {
			const grantFields = readTypeBlock(schema, 'type DraftReviewGrant {');

			expect(grantFields).toEqual(
				expect.arrayContaining(['reviewer', 'grantedAt', 'status', 'revokedAt'])
			);
		});

		it('carries the server-computed publication gate', () => {
			const fields = readTypeBlock(schema, 'type DraftReview {');
			expect(fields).toEqual(
				expect.arrayContaining([
					'publishEligible',
					'publishBlockingReasons',
					'reviewersApproved',
					'principalApprovalRequired',
					'principalApproved',
					'publishEligibility',
				])
			);
		});
	});

	describe('policy the chrome is allowed to state', () => {
		it('qualifies every resolved state as latest activity, not publication state', () => {
			expect(REVIEW_STATE_QUALIFIER).toBe('latest activity, not publication state');
		});

		it('never resolves a bare Approved / Changes requested publication state', () => {
			// reviewStatus is overwritten on every verdict submission upstream, and
			// the verdict history is immutable, so neither yields a gate state.
			const fromVerdicts = [
				createMockDraftReview('d1', { verdicts: [createMockVerdict({ verdict: 'APPROVED' })] }),
				createMockDraftReview('d2', {
					verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED' })],
				}),
			];

			for (const review of fromVerdicts) {
				const { label, source } = resolveReviewState(review);
				expect(source).toBe('verdicts');
				expect(label).toMatch(/^Latest verdict: /);
			}

			expect(resolveReviewState(createMockDraftReview('d3'))).toMatchObject({
				label: 'No review activity recorded',
				source: 'none',
			});
		});

		it('models the approval rules cumulatively, keyed on generatedBy not isAgent', () => {
			const agentGenerated = createMockDraftReview('d1', {
				generatedBy: createMockAgentActor('a1'),
			});
			const delegatedGenerated = createMockDraftReview('d2', {
				generatedBy: { id: 'actor-kim', username: 'kim', isAgent: false },
			});
			const notGenerated = createMockDraftReview('d3', { generatedBy: null });

			// Both generated cases arm the principal rule *in addition to* the
			// always-on unanimous-active-reviewer rule.
			for (const review of [agentGenerated, delegatedGenerated]) {
				expect(describeApprovalRequirement(review)).toEqual({
					allActiveReviewers: true,
					principalApproval: true,
				});
			}

			expect(describeApprovalRequirement(notGenerated)).toEqual({
				allActiveReviewers: true,
				principalApproval: false,
			});
		});

		it('does not invent progress for a partial consumer-provided view model', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockAgentActor('a1'),
				verdicts: [createMockVerdict(), createMockVerdict(), createMockVerdict()],
			});

			const requirement = describeApprovalRequirement(review);
			expect(requirement).not.toHaveProperty('recorded');
			expect(requirement).not.toHaveProperty('required');
		});

		it('derives active reviewer count and principal rule from the canonical projection', () => {
			const review = createMockDraftReview('d4', {
				activeReviewerIds: ['reviewer-1', 'reviewer-2'],
				principalApprovalRequired: true,
			});

			expect(describeApprovalRequirement(review)).toEqual({
				allActiveReviewers: true,
				principalApproval: true,
				activeReviewerCount: 2,
			});
		});
	});

	it('exposes the review queries and mutations the adapters bind', () => {
		expect(schema).toContain(
			'sharedDraftReviews(first: Int, after: Cursor): DraftReviewConnection!'
		);
		expect(schema).toContain('draftReview(id: ID!): DraftReview');
		expect(schema).toContain('shareDraftForReview(draftId: ID!, reviewer: String!): DraftReview!');
		expect(schema).toContain('revokeDraftReview(draftId: ID!, reviewer: String!): Boolean!');
		expect(schema).toContain(
			'submitDraftReview(draftId: ID!, verdict: DraftReviewVerdict!, notes: String): DraftReview!'
		);
	});
});
