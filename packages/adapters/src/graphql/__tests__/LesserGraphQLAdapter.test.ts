import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LesserGraphQLAdapter, createLesserGraphQLAdapter } from '../LesserGraphQLAdapter';
import { createGraphQLClient } from '../client';

// Mock createGraphQLClient
vi.mock('../client', () => ({
	createGraphQLClient: vi.fn(),
}));

// Mock global fetch
const globalFetch = vi.fn();
global.fetch = globalFetch;

describe('LesserGraphQLAdapter', () => {
	let adapter!: LesserGraphQLAdapter;
	let mockApolloClient: any;
	let mockClientInstance: any;

	const config = {
		httpEndpoint: 'https://example.com/graphql',
		token: 'test-token',
		headers: { 'X-Custom': 'header' },
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockApolloClient = {
			query: vi.fn(),
			mutate: vi.fn(),
			subscribe: vi.fn(),
		};

		mockClientInstance = {
			client: mockApolloClient,
			updateToken: vi.fn(),
			close: vi.fn(),
		};

		(createGraphQLClient as any).mockReturnValue(mockClientInstance);

		adapter = new LesserGraphQLAdapter(config);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Constructor & Config', () => {
		it('should create client with correct config', () => {
			expect(createGraphQLClient).toHaveBeenCalledWith(config);
			expect(adapter.isAuthenticated()).toBe(true);
			expect(adapter.getToken()).toBe('test-token');
		});

		it('should update token', () => {
			adapter.updateToken('new-token');
			expect(adapter.getToken()).toBe('new-token');
			expect(mockClientInstance.updateToken).toHaveBeenCalledWith('new-token');
		});

		it('should refresh token', () => {
			adapter.refreshToken('refreshed-token');
			expect(adapter.getToken()).toBe('refreshed-token');
		});

		it('should close client', () => {
			adapter.close();
			expect(mockClientInstance.close).toHaveBeenCalled();
		});

		it('should use createLesserGraphQLAdapter helper', () => {
			const a = createLesserGraphQLAdapter(config);
			expect(a).toBeInstanceOf(LesserGraphQLAdapter);
		});
	});

	describe('verifyCredentials', () => {
		it('should verify successfully', async () => {
			mockApolloClient.query.mockResolvedValue({
				data: { viewer: { id: '1', username: 'user' } },
			});

			const result = await adapter.verifyCredentials();
			expect(result.id).toBe('1');
		});

		it('should throw if no token', async () => {
			const noAuthAdapter = new LesserGraphQLAdapter({ ...config, token: undefined });
			await expect(noAuthAdapter.verifyCredentials()).rejects.toThrow(
				'No authentication token provided'
			);
		});

		it('should throw if viewer is missing', async () => {
			mockApolloClient.query.mockResolvedValue({ data: {} });
			await expect(adapter.verifyCredentials()).rejects.toThrow('Invalid authentication token');
		});

		it('should handle auth errors', async () => {
			mockApolloClient.query.mockRejectedValue(new Error('401 Unauthorized'));
			await expect(adapter.verifyCredentials()).rejects.toThrow('Authentication failed');
		});

		it('should handle other errors', async () => {
			mockApolloClient.query.mockRejectedValue(new Error('Network error'));
			await expect(adapter.verifyCredentials()).rejects.toThrow('Failed to verify credentials');
		});
	});

	describe('Generic Query/Mutate Handling', () => {
		it('should return undefined if query returns undefined data', async () => {
			mockApolloClient.query.mockResolvedValue({}); // No data
			await expect(adapter.getObject('1')).resolves.toBeUndefined();
		});

		it('should return empty array if conversations query returns undefined data', async () => {
			mockApolloClient.query.mockResolvedValue({}); // No data
			await expect(adapter.getConversations({} as any)).resolves.toEqual([]);
		});

		it('should throw if mutation returns null data', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: null });
			await expect(adapter.createNote({ content: 'test' } as any)).rejects.toThrow(
				'Mutation completed without returning data'
			);
		});
	});

	describe('uploadMedia', () => {
		const file = new File(['content'], 'test.png', { type: 'image/png' });

		it('should upload media successfully', async () => {
			globalFetch.mockResolvedValue({
				ok: true,
				json: async () => ({
					data: { uploadMedia: { media: { id: 'media_1' }, uploadId: 'upload_1' } },
				}),
			} as Response);

			const result = await adapter.uploadMedia({ file });
			expect(result.media.id).toBe('media_1');

			expect(globalFetch).toHaveBeenCalledWith(
				config.httpEndpoint,
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						authorization: 'Bearer test-token',
					}),
					body: expect.any(FormData),
				})
			);
		});

		it('should throw if input file is invalid', async () => {
			await expect(adapter.uploadMedia({ file: {} as any })).rejects.toThrow(
				'UploadMedia input.file must be a File or Blob'
			);
		});

		it('should handle upload failure (non-200)', async () => {
			globalFetch.mockResolvedValue({
				ok: false,
				status: 500,
				text: async () => 'Server Error',
			} as Response);

			await expect(adapter.uploadMedia({ file })).rejects.toThrow('Upload failed (500)');
		});

		it('should handle GraphQL errors in upload response', async () => {
			globalFetch.mockResolvedValue({
				ok: true,
				json: async () => ({
					errors: [{ message: 'File too large' }],
				}),
			} as Response);

			await expect(adapter.uploadMedia({ file })).rejects.toThrow('File too large');
		});

		it('should throw if upload mutation returns no payload', async () => {
			globalFetch.mockResolvedValue({
				ok: true,
				json: async () => ({
					data: { uploadMedia: null },
				}),
			} as Response);
			await expect(adapter.uploadMedia({ file })).rejects.toThrow(
				'Upload media mutation returned no payload'
			);
		});
	});

	describe('Relationship Fallback', () => {
		it('should use fallback if getRelationship fails with missing target id error', async () => {
			const error = new Error('Field "target_id" is missing');
			mockApolloClient.query
				.mockRejectedValueOnce(error) // First call fails
				.mockResolvedValueOnce({ data: { relationships: [{ id: 'rel_1' }] } }); // Fallback succeeds

			const result = await adapter.getRelationship('1');
			expect(result?.id).toBe('rel_1');
			expect(mockApolloClient.query).toHaveBeenCalledTimes(2);
		});

		it('should rethrow if error is not target id related', async () => {
			mockApolloClient.query.mockRejectedValue(new Error('Other error'));
			await expect(adapter.getRelationship('1')).rejects.toThrow('Other error');
		});
	});

	describe('Timeline Methods', () => {
		it('fetchHomeTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchHomeTimeline({ first: 10 });
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'HOME', first: 10 } })
			);
		});

		it('fetchPublicTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchPublicTimeline({}, 'LOCAL');
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'LOCAL' } })
			);
		});

		it('fetchDirectTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchDirectTimeline();
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'DIRECT' } })
			);
		});

		it('fetchHashtagTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchHashtagTimeline('tag');
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'HASHTAG', hashtag: 'tag' } })
			);
		});

		it('fetchListTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchListTimeline('list_1');
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'LIST', listId: 'list_1' } })
			);
		});

		it('fetchActorTimeline', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { timeline: { edges: [] } } });
			await adapter.fetchActorTimeline('actor_1');
			expect(mockApolloClient.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { type: 'ACTOR', actorId: 'actor_1' } })
			);
		});
	});

	describe('Basic Wrappers (Query)', () => {
		it('getObject', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { object: { id: '1' } } });
			await adapter.getObject('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getActorById', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { actor: { id: '1' } } });
			await adapter.getActorById('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getActorByUsername', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { actor: { id: '1' } } });
			await adapter.getActorByUsername('user');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('search', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { search: { accounts: [] } } });
			await adapter.search({ query: 'test' });
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('fetchNotifications', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { notifications: { edges: [] } } });
			await adapter.fetchNotifications({});
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getConversations', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { conversations: [] } });
			await adapter.getConversations({});
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getConversation', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { conversation: {} } });
			await adapter.getConversation('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getLists', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { lists: [] } });
			await adapter.getLists();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getList', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { list: {} } });
			await adapter.getList('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getListAccounts', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { listAccounts: [] } });
			await adapter.getListAccounts('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getObjectWithQuotes', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { object: {} } });
			await adapter.getObjectWithQuotes('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getRelationships', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { relationships: [] } });
			await adapter.getRelationships(['1']);
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFollowers', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { followers: [] } });
			await adapter.getFollowers('user');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFollowing', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { following: [] } });
			await adapter.getFollowing('user');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getUserPreferences', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { userPreferences: {} } });
			await adapter.getUserPreferences();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getPushSubscription', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { pushSubscription: {} } });
			await adapter.getPushSubscription();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getCommunityNotesByObject', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { object: {} } });
			await adapter.getCommunityNotesByObject('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getAIAnalysis', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { aiAnalysis: {} } });
			await adapter.getAIAnalysis('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getAIStats', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { aiStats: {} } });
			await adapter.getAIStats('DAY');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getAICapabilities', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { aiCapabilities: {} } });
			await adapter.getAICapabilities();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getTrustGraph', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { trustGraph: {} } });
			await adapter.getTrustGraph('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getCostBreakdown', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { costBreakdown: {} } });
			await adapter.getCostBreakdown();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getInstanceBudgets', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { instanceBudgets: {} } });
			await adapter.getInstanceBudgets();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFederationLimits', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { federationLimits: {} } });
			await adapter.getFederationLimits();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getThreadContext', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { threadContext: {} } });
			await adapter.getThreadContext('1');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getSeveredRelationships', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { severedRelationships: [] } });
			await adapter.getSeveredRelationships();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFederationHealth', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { federationHealth: {} } });
			await adapter.getFederationHealth();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFederationStatus', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { federationStatus: {} } });
			await adapter.getFederationStatus('domain.com');
			expect(mockApolloClient.query).toHaveBeenCalled();
		});

		it('getFollowedHashtags', async () => {
			mockApolloClient.query.mockResolvedValue({ data: { followedHashtags: [] } });
			await adapter.getFollowedHashtags();
			expect(mockApolloClient.query).toHaveBeenCalled();
		});
	});

	describe('Basic Wrappers (Mutation)', () => {
		it('createNote', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { createNote: {} } });
			await adapter.createNote({ content: 'test' } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('dismissNotification', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { dismissNotification: true } });
			await adapter.dismissNotification('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('clearNotifications', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { clearNotifications: true } });
			await adapter.clearNotifications();
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('markConversationAsRead', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { markConversationAsRead: true } });
			await adapter.markConversationAsRead('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('deleteConversation', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { deleteConversation: true } });
			await adapter.deleteConversation('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('createList', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { createList: {} } });
			await adapter.createList({ title: 'list' } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateList', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateList: {} } });
			await adapter.updateList('1', { title: 'list' } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('deleteList', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { deleteList: true } });
			await adapter.deleteList('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('addAccountsToList', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { addAccountsToList: {} } });
			await adapter.addAccountsToList('1', ['2']);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('removeAccountsFromList', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { removeAccountsFromList: {} } });
			await adapter.removeAccountsFromList('1', ['2']);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('createQuoteNote', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { createQuoteNote: {} } });
			await adapter.createQuoteNote({ content: 'quote' } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('withdrawFromQuotes', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { withdrawFromQuotes: true } });
			await adapter.withdrawFromQuotes('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateQuotePermissions', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateQuotePermissions: {} } });
			await adapter.updateQuotePermissions('1', true, 'EVERYONE');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('deleteObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { deleteObject: true } });
			await adapter.deleteObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('likeObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { likeObject: {} } });
			await adapter.likeObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unlikeObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unlikeObject: {} } });
			await adapter.unlikeObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('shareObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { shareObject: {} } });
			await adapter.shareObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unshareObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unshareObject: {} } });
			await adapter.unshareObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('bookmarkObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { bookmarkObject: {} } });
			await adapter.bookmarkObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unbookmarkObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unbookmarkObject: {} } });
			await adapter.unbookmarkObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('pinObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { pinObject: {} } });
			await adapter.pinObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unpinObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unpinObject: {} } });
			await adapter.unpinObject('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('followActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { followActor: {} } });
			await adapter.followActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unfollowActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unfollowActor: {} } });
			await adapter.unfollowActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('blockActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { blockActor: {} } });
			await adapter.blockActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unblockActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unblockActor: {} } });
			await adapter.unblockActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('muteActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { muteActor: {} } });
			await adapter.muteActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unmuteActor', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unmuteActor: {} } });
			await adapter.unmuteActor('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateRelationship', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateRelationship: {} } });
			await adapter.updateRelationship('1', {} as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateProfile', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateProfile: {} } });
			await adapter.updateProfile({});
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateUserPreferences', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateUserPreferences: {} } });
			await adapter.updateUserPreferences({});
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateStreamingPreferences', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateStreamingPreferences: {} } });
			await adapter.updateStreamingPreferences({});
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('registerPushSubscription', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { registerPushSubscription: {} } });
			await adapter.registerPushSubscription({ endpoint: 'url' } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updatePushSubscription', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updatePushSubscription: {} } });
			await adapter.updatePushSubscription({ alerts: {} } as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('deletePushSubscription', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { deletePushSubscription: true } });
			await adapter.deletePushSubscription();
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('addCommunityNote', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { addCommunityNote: {} } });
			await adapter.addCommunityNote({ objectId: '1', content: 'note' });
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('voteCommunityNote', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { voteCommunityNote: {} } });
			await adapter.voteCommunityNote('1', true);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('flagObject', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { flagObject: {} } });
			await adapter.flagObject({ objectId: '1', reason: 'spam' });
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('createModerationPattern', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { createModerationPattern: {} } });
			await adapter.createModerationPattern({} as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('deleteModerationPattern', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { deleteModerationPattern: true } });
			await adapter.deleteModerationPattern('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('requestAIAnalysis', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { requestAIAnalysis: {} } });
			await adapter.requestAIAnalysis('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('setInstanceBudget', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { setInstanceBudget: {} } });
			await adapter.setInstanceBudget('dom', 100);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('optimizeFederationCosts', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { optimizeFederationCosts: {} } });
			await adapter.optimizeFederationCosts(100);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('setFederationLimit', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { setFederationLimit: {} } });
			await adapter.setFederationLimit('dom', {});
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('syncThread', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { syncThread: {} } });
			await adapter.syncThread('url');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('syncMissingReplies', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { syncMissingReplies: {} } });
			await adapter.syncMissingReplies('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('acknowledgeSeverance', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { acknowledgeSeverance: {} } });
			await adapter.acknowledgeSeverance('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('attemptReconnection', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { attemptReconnection: {} } });
			await adapter.attemptReconnection('1');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('pauseFederation', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { pauseFederation: {} } });
			await adapter.pauseFederation('dom', 'reason');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('resumeFederation', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { resumeFederation: {} } });
			await adapter.resumeFederation('dom');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('followHashtag', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { followHashtag: {} } });
			await adapter.followHashtag('tag');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unfollowHashtag', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { unfollowHashtag: {} } });
			await adapter.unfollowHashtag('tag');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('muteHashtag', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { muteHashtag: {} } });
			await adapter.muteHashtag('tag');
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('updateHashtagNotifications', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateHashtagNotifications: {} } });
			await adapter.updateHashtagNotifications('tag', {} as any);
			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('unmuteHashtag', async () => {
			mockApolloClient.mutate.mockResolvedValue({ data: { updateHashtagNotifications: {} } });
			await adapter.unmuteHashtag('tag');
			expect(mockApolloClient.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						settings: expect.objectContaining({ muted: false }),
					}),
				})
			);
		});
	});

	describe('Subscriptions', () => {
		it('subscribeToTimelineUpdates', () => {
			adapter.subscribeToTimelineUpdates({} as any);
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToNotificationStream', () => {
			adapter.subscribeToNotificationStream();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToConversationUpdates', () => {
			adapter.subscribeToConversationUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToListUpdates', () => {
			adapter.subscribeToListUpdates({ listId: '1' });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToQuoteActivity', () => {
			adapter.subscribeToQuoteActivity({ noteId: '1' });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToHashtagActivity', () => {
			adapter.subscribeToHashtagActivity({ hashtags: 'tag' });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToActivityStream', () => {
			adapter.subscribeToActivityStream();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToRelationshipUpdates', () => {
			adapter.subscribeToRelationshipUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToCostUpdates', () => {
			adapter.subscribeToCostUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToModerationEvents', () => {
			adapter.subscribeToModerationEvents();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToTrustUpdates', () => {
			adapter.subscribeToTrustUpdates({ actorId: '1' });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToAiAnalysisUpdates', () => {
			adapter.subscribeToAiAnalysisUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToMetricsUpdates', () => {
			adapter.subscribeToMetricsUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToModerationAlerts', () => {
			adapter.subscribeToModerationAlerts();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToCostAlerts', () => {
			adapter.subscribeToCostAlerts({ thresholdUSD: 100 });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToBudgetAlerts', () => {
			adapter.subscribeToBudgetAlerts();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToFederationHealthUpdates', () => {
			adapter.subscribeToFederationHealthUpdates();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToModerationQueueUpdate', () => {
			adapter.subscribeToModerationQueueUpdate();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToThreatIntelligence', () => {
			adapter.subscribeToThreatIntelligence();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToPerformanceAlert', () => {
			adapter.subscribeToPerformanceAlert({ severity: 'WARNING' });
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});

		it('subscribeToInfrastructureEvent', () => {
			adapter.subscribeToInfrastructureEvent();
			expect(mockApolloClient.subscribe).toHaveBeenCalled();
		});
	});
});
