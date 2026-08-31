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
	REVIEW_STALE_APPROVAL_DETAIL,
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	REVIEW_STALE_APPROVAL_LABEL,
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

		// v1.6.4 adds canonical draft revision, grant-set, and publication eligibility data;
		// v1.6.5 adds nullable actedBy attribution on Draft/Article. v1.6.22 carries the
		// PROG-M1 passkey signup surface. v1.6.23-v1.6.28 add the M3 editorial-media and
		// M4 promo-package surfaces and extend submitDraftReview / shareDraftForReview with
		// optional includeAccessUrls / contentHash args; the review types themselves
		// (DraftReview, DraftReviewVerdict, DraftReviewVerdictRecord, DraftReviewGrant,
		// publishEligibility) are untouched, so the boundary moves without any change to
		// the assertions below. They keep the review chrome pinned to the exact
		// synchronized release boundary.
		expect(ref).toContain('tag: v1.6.28');
		expect(ref).toMatch(/commit: [0-9a-f]{40}/);
	});

	it('keeps every LESSER_REF version comment aligned with the pinned tag', () => {
		// The review chrome's comments name the contract they mirror. When the
		// pin moves during a sync-contracts walk, these references must move
		// with it — a comment citing an old tag is a lie about authority, so
		// this check derives the expected version from LESSER_REF.txt itself
		// and fails until every mention is brought in line.
		const pinnedTag = /tag:\s*(v[0-9]+\.[0-9]+\.[0-9]+)/.exec(readLesserRef())?.[1];
		expect(pinnedTag, 'LESSER_REF.txt carries no parsable release tag').toBeDefined();

		const commentedFiles = [
			'packages/faces/blog/src/types.ts',
			'packages/faces/blog/tests/integration/review-round-trip.flow.test.ts',
			'packages/faces/blog/tests/mocks/mockDraftReview.ts',
		];

		for (const relativePath of commentedFiles) {
			const source = readFileSync(resolve(findRepoRoot(), relativePath), 'utf8');
			const mentions = [...source.matchAll(/LESSER_REF (v[0-9]+\.[0-9]+\.[0-9]+)/g)].map(
				(match) => match[1]
			);

			expect(
				mentions.length,
				`${relativePath} no longer names the pinned contract`
			).toBeGreaterThan(0);
			for (const mention of mentions) {
				expect(mention, `${relativePath} cites ${mention}; pinned contract is ${pinnedTag}`).toBe(
					pinnedTag
				);
			}
		}
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

	it('carries exact authoritative current/stale verdict markers and contentHash', () => {
		// v1.6.28: the server computes whether a verdict record still applies to
		// the current draft revision and active grant (current/stale), and binds
		// records to content with contentHash. These are authoritative gate
		// inputs — the chrome must never substitute activity history for them.
		const block = /type DraftReviewVerdictRecord \{([\s\S]*?)\n\}/.exec(schema)?.[1] ?? '';
		const fields = block
			.replace(/"""[\s\S]*?"""/g, '')
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0 && !line.startsWith('#'))
			.map((line) => line.split(/[:(\s]/)[0] ?? '')
			.filter((name) => name.length > 0);

		expect(fields).toEqual([
			'verdict',
			'notes',
			'contentHash',
			'reviewerId',
			'reviewer',
			'recordedAt',
			'current',
			'stale',
		]);
		expect(block).toContain('contentHash: String');
		expect(block).toContain('current: Boolean!');
		expect(block).toContain('stale: Boolean!');
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

	describe('stale approval policy (issue #1055)', () => {
		it('consumes the authoritative current/stale markers instead of inferring staleness', () => {
			// A media or content change stales earlier verdicts upstream; the
			// chrome must read that decision, not reconstruct it.
			const marked = createMockDraftReview('d1', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
			});
			expect(resolveReviewState(marked)).toMatchObject({
				tone: 'stale-approved',
				label: REVIEW_STALE_APPROVAL_LABEL,
				stale: true,
			});

			const clearedCurrent = createMockDraftReview('d2', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', current: false })],
			});
			expect(resolveReviewState(clearedCurrent).tone).toBe('stale-approved');

			// Absent markers (older/partial projections) leave the qualified
			// activity badge in place — staleness is never guessed.
			const unmarked = createMockDraftReview('d3', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED' })],
			});
			expect(resolveReviewState(unmarked)).toMatchObject({
				tone: 'approved',
				label: 'Latest verdict: Approved',
				stale: false,
			});
		});

		it('never pairs a stale approval with the success tone or a bare Approved label', () => {
			const states = [
				resolveReviewState(
					createMockDraftReview('d1', {
						verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
					})
				),
				resolveReviewState(
					createMockDraftReview('d2', {
						reviewStatus: 'Approved',
						verdicts: [createMockVerdict({ verdict: 'APPROVED', current: false })],
					})
				),
			];

			for (const state of states) {
				expect(state.tone).not.toBe('approved');
				expect(state.label).not.toBe('Approved');
				expect(state.detail).toBeTruthy();
				expect(state.detail).toContain('no longer counts');
			}
		});

		it('names the outstanding principal approval from publishEligibility, not from history', () => {
			const principal = createMockDraftReview('d1', {
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
			const generic = createMockDraftReview('d2', {
				verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
			});

			expect(resolveReviewState(principal).detail).toBe(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL);
			expect(resolveReviewState(generic).detail).toBe(REVIEW_STALE_APPROVAL_DETAIL);
		});
	});

	it('exposes the review queries and mutations the adapters bind', () => {
		expect(schema).toContain(
			'sharedDraftReviews(first: Int, after: Cursor): DraftReviewConnection!'
		);
		// Draft preview is the M3 editorial-media render surface; includeAccessUrls
		// defaults to false so protected media URLs stay explicit opt-in.
		expect(schema).toContain(
			'draftPreview(id: ID!, includeAccessUrls: Boolean = false): DraftPreview!'
		);
		expect(schema).toContain(
			'draftReview(id: ID!, includeAccessUrls: Boolean = false): DraftReview'
		);
		expect(schema).toContain(
			'shareDraftForReview(draftId: ID!, reviewer: String!, includeAccessUrls: Boolean = false): DraftReview!'
		);
		expect(schema).toContain('revokeDraftReview(draftId: ID!, reviewer: String!): Boolean!');
		expect(schema).toContain(
			'submitDraftReview(draftId: ID!, verdict: DraftReviewVerdict!, notes: String, includeAccessUrls: Boolean = false, contentHash: String): DraftReview!'
		);
	});
});
