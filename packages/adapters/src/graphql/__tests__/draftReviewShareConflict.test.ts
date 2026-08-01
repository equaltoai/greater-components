import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	LesserGraphQLAdapter,
	LesserGraphQLAdapterError,
	isDraftReviewShareConflict,
} from '../LesserGraphQLAdapter';
import { createGraphQLClient } from '../client';
import { ShareDraftForReviewDocument } from '../generated/types.js';

/**
 * Lesser v1.5.33 creates a draft-review grant conditionally
 * (`IfNotExists()`, pkg/storage/repositories/draft_repository.go
 * `CreateDraftReviewGrant`) and version-conditions the regrant path. A
 * duplicate share fails loudly on purpose: the condition is what preserves a
 * concurrent revocation, so one operator's re-share must never silently undo
 * another's revoke.
 *
 * The client's only job is to name that condition. It must not re-issue the
 * grant, retry, or present the refusal as success.
 *
 * Classification is by `extensions.code` and nothing else. At the pinned
 * v1.5.33 the conditional-create path returns its storage error unwrapped, so
 * Lesser's presenter attaches no code and Greater rethrows instead of
 * classifying — see `docs/lesser/contracts/upstream-gaps.md`. Matching the
 * message text would close that gap by guessing: server strings are not
 * contract, so a wording change upstream would silently start reporting real
 * faults as a benign "already invited" notice.
 */

vi.mock('../client', () => ({
	createGraphQLClient: vi.fn(),
}));

global.fetch = vi.fn();

const draftReviewPayload = {
	__typename: 'DraftReview',
	draftId: 'draft-1',
	title: 'A shared draft',
	subtitle: null,
	excerpt: 'Excerpt',
	contentFormat: 'MARKDOWN',
	status: 'DRAFT',
	scheduledAt: null,
	updatedAt: '2026-08-01T09:00:00.000Z',
	createdAt: '2026-07-31T09:00:00.000Z',
	reviewStatus: null,
	editorNotes: null,
	generatedBy: null,
	reviewedBy: null,
	grant: {
		__typename: 'DraftReviewGrant',
		grantedAt: '2026-08-01T09:00:00.000Z',
		reviewer: {
			__typename: 'Actor',
			id: 'actor-2',
			username: 'reviewer',
			domain: null,
			displayName: 'Reviewer',
			avatar: null,
			isAgent: false,
		},
	},
	verdicts: [],
};

/** Conditional-create refusal as it arrives when Lesser wraps it as an AppError. */
const conflictWithCode = {
	errors: [{ message: 'Conditional check failed', extensions: { code: 'CONFLICT' } }],
};

/**
 * The same refusal as v1.5.33 actually delivers it. `CreateDraftReviewGrant`
 * returns the tabletheory error unwrapped, so `graphQLErrorPresenter` finds no
 * `*AppError` and writes no `extensions.code` — the client is left with a
 * message it must not read.
 */
const conflictWithoutCode = {
	errors: [{ message: 'condition check failed: item with the same key already exists' }],
};

describe('isDraftReviewShareConflict', () => {
	it('recognises a structured conflict code', () => {
		expect(isDraftReviewShareConflict(conflictWithCode)).toBe(true);
		expect(
			isDraftReviewShareConflict({ errors: [{ extensions: { code: 'ALREADY_EXISTS' } }] })
		).toBe(true);
	});

	it('reads the code preserved on an adapter error', () => {
		expect(
			isDraftReviewShareConflict(
				new LesserGraphQLAdapterError('safe', { serverCodes: ['CONFLICT'] })
			)
		).toBe(true);
	});

	/**
	 * The upstream gap, asserted as behaviour rather than papered over. When
	 * Lesser starts coding this failure these expectations flip — that is the
	 * signal to resync the snapshot, not a regression.
	 */
	it('does not classify an uncoded conflict, however the message reads', () => {
		expect(isDraftReviewShareConflict(conflictWithoutCode)).toBe(false);
		expect(isDraftReviewShareConflict(new Error('ConditionalCheckFailedException'))).toBe(false);
		expect(isDraftReviewShareConflict(new Error('grant already exists'))).toBe(false);
		expect(
			isDraftReviewShareConflict(
				new LesserGraphQLAdapterError('safe', { debugMessages: ['conditional check failed'] })
			)
		).toBe(false);
	});

	/**
	 * The reason message matching was rejected: text this broad appears in
	 * failures that have nothing to do with an existing grant, and reading it
	 * would present a fault as a benign notice.
	 */
	it('does not claim an unrelated failure that merely mentions a duplicate', () => {
		expect(isDraftReviewShareConflict(new Error('network down'))).toBe(false);
		expect(
			isDraftReviewShareConflict({
				errors: [
					{
						message: 'duplicate request id rejected by the rate limiter',
						extensions: { code: 'TOO_MANY_REQUESTS' },
					},
				],
			})
		).toBe(false);
		expect(isDraftReviewShareConflict({ errors: [{ extensions: { code: 'FORBIDDEN' } }] })).toBe(
			false
		);
		expect(
			isDraftReviewShareConflict({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] })
		).toBe(false);
		expect(isDraftReviewShareConflict(null)).toBe(false);
	});
});

describe('shareDraftForReviewIfAbsent (Lesser v1.5.33 conditional grant)', () => {
	let adapter!: LesserGraphQLAdapter;
	let mockApolloClient: { query: ReturnType<typeof vi.fn>; mutate: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		vi.clearAllMocks();

		mockApolloClient = { query: vi.fn(), mutate: vi.fn() };
		(createGraphQLClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			client: mockApolloClient,
			updateToken: vi.fn(),
			close: vi.fn(),
		});

		adapter = new LesserGraphQLAdapter({
			httpEndpoint: 'https://lesser.example/graphql',
			token: 'test-token',
		});
	});

	it('reports a first-time share as invited', async () => {
		mockApolloClient.mutate.mockResolvedValue({
			data: { shareDraftForReview: draftReviewPayload },
		});

		const outcome = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');

		expect(outcome).toMatchObject({ status: 'invited' });
		expect(outcome.status === 'invited' && outcome.review).toEqual(draftReviewPayload);
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
		expect(mockApolloClient.mutate.mock.calls[0]?.[0]).toMatchObject({
			mutation: ShareDraftForReviewDocument,
			variables: { draftId: 'draft-1', reviewer: 'reviewer' },
		});
	});

	it('reports a duplicate share as already-invited given a structured conflict code', async () => {
		mockApolloClient.mutate.mockResolvedValue(conflictWithCode);

		const outcome = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');

		expect(outcome).toEqual({
			status: 'already-invited',
			draftId: 'draft-1',
			reviewer: 'reviewer',
			cause: expect.any(LesserGraphQLAdapterError),
		});
		// No auto-regrant and no retry: one attempt, full stop.
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
	});

	/**
	 * The v1.5.33 shape. Rethrowing is the honest outcome while the code is
	 * missing: a caller told "already invited" on the strength of a message
	 * string could be looking at any failure at all.
	 */
	it('rethrows an uncoded conditional-create conflict rather than guessing', async () => {
		mockApolloClient.mutate.mockResolvedValue(conflictWithoutCode);

		await expect(adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer')).rejects.toBeInstanceOf(
			LesserGraphQLAdapterError
		);
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
	});

	it('never fabricates a review payload for a refused share', async () => {
		mockApolloClient.mutate.mockResolvedValue(conflictWithCode);

		const outcome = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');

		// The share did not happen; presenting server state here would tell the
		// caller a grant exists that this call did not create.
		expect(outcome.status).toBe('already-invited');
		expect(outcome).not.toHaveProperty('review');
	});

	it('rethrows a failure it cannot identify as a duplicate', async () => {
		mockApolloClient.mutate.mockResolvedValue({
			errors: [{ message: 'internal error', extensions: { code: 'INTERNAL_SERVER_ERROR' } }],
		});

		await expect(adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer')).rejects.toBeInstanceOf(
			LesserGraphQLAdapterError
		);
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
	});

	it('rethrows an authorization failure rather than calling it already-invited', async () => {
		mockApolloClient.mutate.mockResolvedValue({
			errors: [{ message: 'forbidden', extensions: { code: 'FORBIDDEN' } }],
		});

		await expect(adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer')).rejects.toBeInstanceOf(
			LesserGraphQLAdapterError
		);
	});

	it('succeeds when a revoked reviewer is deliberately re-shared', async () => {
		// Lesser's regrant path clears revocation and restores the queue keys,
		// so a re-share after a revoke is an ordinary success — not a conflict.
		mockApolloClient.mutate.mockResolvedValue({
			data: { shareDraftForReview: draftReviewPayload },
		});

		const outcome = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');

		expect(outcome.status).toBe('invited');
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
	});

	it('does not retry a conflict on a subsequent explicit call', async () => {
		mockApolloClient.mutate
			.mockResolvedValueOnce(conflictWithCode)
			.mockResolvedValueOnce({ data: { shareDraftForReview: draftReviewPayload } });

		const first = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');
		expect(first.status).toBe('already-invited');
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);

		// A second attempt happens only because the caller asked for one.
		const second = await adapter.shareDraftForReviewIfAbsent('draft-1', 'reviewer');
		expect(second.status).toBe('invited');
		expect(mockApolloClient.mutate).toHaveBeenCalledTimes(2);
	});

	it('leaves shareDraftForReview throwing on conflict', async () => {
		mockApolloClient.mutate.mockResolvedValue(conflictWithCode);

		await expect(adapter.shareDraftForReview('draft-1', 'reviewer')).rejects.toBeInstanceOf(
			LesserGraphQLAdapterError
		);
	});

	it('preserves the server code on the sanitised error without leaking messages', async () => {
		mockApolloClient.mutate.mockResolvedValue(conflictWithCode);

		const error = await adapter
			.shareDraftForReview('draft-1', 'reviewer')
			.catch((caught: unknown) => caught as LesserGraphQLAdapterError);

		expect(error.serverCodes).toEqual(['CONFLICT']);
		// The user-facing message stays generic; only the code enum survives.
		expect(error.message).not.toContain('Conditional check failed');
	});
});
