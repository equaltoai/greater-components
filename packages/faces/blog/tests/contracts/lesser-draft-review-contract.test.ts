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

	it('is pinned to the release that introduced the review surface', () => {
		const ref = readLesserRef();

		expect(ref).toContain('tag: v1.5.32');
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
