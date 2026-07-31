import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LesserGraphQLAdapter, createSubmitDraftReviewHandler } from '../LesserGraphQLAdapter';
import { createGraphQLClient } from '../client';
import {
	SharedDraftReviewsDocument,
	DraftReviewDocument,
	ShareDraftForReviewDocument,
	RevokeDraftReviewDocument,
	SubmitDraftReviewDocument,
} from '../generated/types.js';

vi.mock('../client', () => ({
	createGraphQLClient: vi.fn(),
}));

global.fetch = vi.fn();

describe('Shared-draft review operations (Lesser M2a contract)', () => {
	let adapter!: LesserGraphQLAdapter;
	let mockApolloClient: any;

	const draftReviewPayload = {
		__typename: 'DraftReview',
		draftId: 'draft-1',
		title: 'A shared draft',
		subtitle: null,
		excerpt: 'Excerpt',
		contentFormat: 'MARKDOWN',
		status: 'DRAFT',
		scheduledAt: null,
		updatedAt: '2026-07-30T09:00:00.000Z',
		createdAt: '2026-07-29T09:00:00.000Z',
		reviewStatus: 'Approved',
		editorNotes: null,
		generatedBy: null,
		reviewedBy: null,
		grant: null,
		verdicts: [],
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockApolloClient = {
			query: vi.fn(),
			mutate: vi.fn(),
			subscribe: vi.fn(),
		};

		(createGraphQLClient as any).mockReturnValue({
			client: mockApolloClient,
			updateToken: vi.fn(),
			close: vi.fn(),
		});

		adapter = new LesserGraphQLAdapter({
			httpEndpoint: 'https://example.com/graphql',
			token: 'test-token',
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('queries the shared review queue', async () => {
		mockApolloClient.query.mockResolvedValue({
			data: {
				sharedDraftReviews: {
					totalCount: 1,
					pageInfo: { hasNextPage: false, endCursor: null },
					edges: [{ cursor: 'c1', node: draftReviewPayload }],
				},
			},
		});

		const result = await adapter.getSharedDraftReviews({ first: 20 });

		expect(mockApolloClient.query).toHaveBeenCalledWith(
			expect.objectContaining({
				query: SharedDraftReviewsDocument,
				variables: { first: 20 },
			})
		);
		expect(result.totalCount).toBe(1);
		expect(result.edges[0]?.node.draftId).toBe('draft-1');
	});

	it('queries a single draft review by id', async () => {
		mockApolloClient.query.mockResolvedValue({ data: { draftReview: draftReviewPayload } });

		const result = await adapter.getDraftReview('draft-1');

		expect(mockApolloClient.query).toHaveBeenCalledWith(
			expect.objectContaining({ query: DraftReviewDocument, variables: { id: 'draft-1' } })
		);
		expect(result?.draftId).toBe('draft-1');
	});

	it('invites a reviewer', async () => {
		mockApolloClient.mutate.mockResolvedValue({
			data: { shareDraftForReview: draftReviewPayload },
		});

		await adapter.shareDraftForReview('draft-1', 'kim@lesser.host');

		expect(mockApolloClient.mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				mutation: ShareDraftForReviewDocument,
				variables: { draftId: 'draft-1', reviewer: 'kim@lesser.host' },
			})
		);
	});

	it('revokes a reviewer invitation', async () => {
		mockApolloClient.mutate.mockResolvedValue({ data: { revokeDraftReview: true } });

		await expect(adapter.revokeDraftReview('draft-1', 'kim@lesser.host')).resolves.toBe(true);

		expect(mockApolloClient.mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				mutation: RevokeDraftReviewDocument,
				variables: { draftId: 'draft-1', reviewer: 'kim@lesser.host' },
			})
		);
	});

	it('submits an approval verdict', async () => {
		mockApolloClient.mutate.mockResolvedValue({
			data: { submitDraftReview: draftReviewPayload },
		});

		const result = await adapter.submitDraftReview({
			draftId: 'draft-1',
			verdict: 'APPROVED',
			notes: null,
		});

		expect(mockApolloClient.mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				mutation: SubmitDraftReviewDocument,
				variables: { draftId: 'draft-1', verdict: 'APPROVED', notes: null },
			})
		);
		expect(result.reviewStatus).toBe('Approved');
	});

	describe('createSubmitDraftReviewHandler', () => {
		it('wires a VerdictActions submission straight to submitDraftReview', async () => {
			mockApolloClient.mutate.mockResolvedValue({
				data: { submitDraftReview: draftReviewPayload },
			});

			const handler = createSubmitDraftReviewHandler(adapter);
			await handler({
				draftId: 'draft-1',
				verdict: 'CHANGES_REQUESTED',
				notes: 'Tighten the intro',
			});

			expect(mockApolloClient.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					mutation: SubmitDraftReviewDocument,
					variables: {
						draftId: 'draft-1',
						verdict: 'CHANGES_REQUESTED',
						notes: 'Tighten the intro',
					},
				})
			);
		});

		it('sends an explicit null when the reviewer left notes empty', async () => {
			mockApolloClient.mutate.mockResolvedValue({
				data: { submitDraftReview: draftReviewPayload },
			});

			const handler = createSubmitDraftReviewHandler(adapter);
			await handler({ draftId: 'draft-1', verdict: 'APPROVED' });

			expect(mockApolloClient.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { draftId: 'draft-1', verdict: 'APPROVED', notes: null },
				})
			);
		});

		it('propagates server rejections so the dialog can surface them', async () => {
			mockApolloClient.mutate.mockRejectedValue(new Error('reviewer not invited'));

			const handler = createSubmitDraftReviewHandler(adapter);

			await expect(handler({ draftId: 'draft-1', verdict: 'APPROVED' })).rejects.toThrow();
		});
	});
});
