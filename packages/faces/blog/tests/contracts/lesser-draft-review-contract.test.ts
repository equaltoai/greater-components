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

		// v1.6.0 added contentHash to verdict records; v1.6.2 retains that surface
		// and adds canonical Article.renderedHtml. The field assertions below keep
		// the review chrome pinned to the exact synchronized release boundary.
		expect(ref).toContain('tag: v1.6.2');
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
				'grant',
				'verdicts',
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

	describe('what the projection does NOT expose', () => {
		// These assertions are the justification for the chrome's neutral display.
		// If any of them starts failing, the projection has gained data that could
		// support a richer, still-honest state — which is the signal to revisit
		// `resolveReviewState` / `describeApprovalRequirement`, not to work around.

		it("exposes only the viewer's own grant, never the active grant set", () => {
			const fields = readTypeBlock(schema, 'type DraftReview {');

			// Singular `grant`, not `grants: [...]`. Without the full active set the
			// chrome cannot count eligible reviewers, so it reports no progress.
			expect(fields).toContain('grant');
			expect(fields).not.toContain('grants');
			expect(schema).toContain('grant: DraftReviewGrant');
			expect(schema).not.toMatch(/grants:\s*\[DraftReviewGrant/);
		});

		it('carries no revocation marker on the grant, so active-ness is not derivable', () => {
			const grantFields = readTypeBlock(schema, 'type DraftReviewGrant {');

			expect(grantFields).toEqual(expect.arrayContaining(['reviewer', 'grantedAt']));
			expect(grantFields).not.toContain('revokedAt');
		});

		it('carries no server-computed publication gate', () => {
			const fields = readTypeBlock(schema, 'type DraftReview {');

			// Lesser computes the gate in PublishDraft and does not project it. This
			// is the recorded upstream candidate; until it lands, the chrome must
			// not synthesise one.
			for (const gateish of ['canPublish', 'publishable', 'approvalState', 'gateState']) {
				expect(fields).not.toContain(gateish);
			}
		});

		it('names no instance principal, so principal approval cannot be evaluated here', () => {
			const fields = readTypeBlock(schema, 'type DraftReview {');

			for (const principalish of ['principal', 'principalApproved', 'requiredReviewers']) {
				expect(fields).not.toContain(principalish);
			}
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

		it('reports no progress count, because the projection cannot support one', () => {
			const review = createMockDraftReview('d1', {
				generatedBy: createMockAgentActor('a1'),
				verdicts: [createMockVerdict(), createMockVerdict(), createMockVerdict()],
			});

			const requirement = describeApprovalRequirement(review);
			expect(requirement).not.toHaveProperty('recorded');
			expect(requirement).not.toHaveProperty('required');
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
