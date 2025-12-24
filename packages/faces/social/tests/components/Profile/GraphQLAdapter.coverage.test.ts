import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileGraphQLController } from '../../../src/components/Profile/GraphQLAdapter';
import { createFakeLesserAdapter } from '../../helpers/fakes/createFakeLesserAdapter';
import { createTestProfileContext } from '../../helpers/fakes/createTestProfileContext';
import { validActor } from '../../helpers/fixtures/profile';

describe('ProfileGraphQLController Coverage', () => {
	let context: ReturnType<typeof createTestProfileContext>;
	let adapter: any;
	let controller: ProfileGraphQLController;

	beforeEach(() => {
		context = createTestProfileContext();
		adapter = createFakeLesserAdapter();
	});

	function createController(options: any = {}) {
		return new ProfileGraphQLController({
			context,
			adapter,
			username: 'testuser',
			...options,
		});
	}

	describe('Initialization & Error Handling', () => {
		it('handles loadProfile failure gracefully', async () => {
			adapter.getActorByUsername.mockRejectedValue(new Error('Network error'));
			controller = createController();

			await controller.initialize();

			expect(context.state.error).toBe('Network error');
			expect(context.state.loading).toBe(false);
		});

		it('handles profile not found (null actor)', async () => {
			adapter.getActorByUsername.mockResolvedValue(null);
			controller = createController();

			await controller.initialize();

			expect(context.state.error).toBe('Profile not found');
		});

		it('handles invalid profile payload (map returns null)', async () => {
			adapter.getActorByUsername.mockResolvedValue({});
			controller = createController();

			await controller.initialize();

			expect(context.state.error).toBe('Invalid profile payload received from server');
		});

		it('handles partial failures: followers fails but profile loads', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			adapter.getFollowers.mockRejectedValue(new Error('Followers failed'));
			adapter.getFollowing.mockResolvedValue({ actors: [], totalCount: 0 });

			controller = createController();
			await controller.initialize();

			expect(context.state.profile?.id).toBe(validActor.id);
			expect(context.state.error).toBe('Followers failed');
			expect(context.state.loading).toBe(false);
		});

		it('handles partial failures: following fails', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			adapter.getFollowers.mockResolvedValue({ actors: [], totalCount: 0 });
			adapter.getFollowing.mockRejectedValue(new Error('Following failed'));

			controller = createController();
			await controller.initialize();

			expect(context.state.profile?.id).toBe(validActor.id);
			expect(context.state.error).toBe('Following failed');
		});

		it('handles relationship fetch failure (logs warning but continues)', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			adapter.getRelationship.mockRejectedValue(new Error('Rel fail'));
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			controller = createController();
			await controller.initialize();

			expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch relationship', expect.any(Error));
			expect(context.state.profile?.id).toBe(validActor.id);
			consoleSpy.mockRestore();
		});
	});

	describe('Followers/Following Pagination', () => {
		it('loadFollowers respects loading state', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			// Setup init call to return a cursor so we can load more
			adapter.getFollowers.mockResolvedValueOnce({
				actors: [],
				totalCount: 10,
				nextCursor: 'page2',
			});

			controller = createController();
			await controller.initialize();

			let resolveFollowers: any;
			// Use mockImplementation to capture resolve function
			adapter.getFollowers.mockImplementation(() => new Promise((r) => (resolveFollowers = r)));

			// First call
			const p1 = context.handlers.onLoadMoreFollowers?.();

			// Second call should return immediately (void) because loading is true
			const p2 = context.handlers.onLoadMoreFollowers?.();

			expect(resolveFollowers).toBeDefined();
			resolveFollowers({ actors: [], totalCount: 0 });
			await p1;
			await p2;

			// Expect getFollowers to be called twice:
			// 1. initialize calls loadFollowers(true)
			// 2. handlers.onLoadMoreFollowers calls loadFollowers(false)
			expect(adapter.getFollowers).toHaveBeenCalledTimes(2);
		});

		it('loadFollowers(false) aborts if no cursor', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			// Initial load returns no nextCursor
			adapter.getFollowers.mockResolvedValue({ actors: [], totalCount: 0, nextCursor: null });

			controller = createController();
			await controller.initialize();

			adapter.getFollowers.mockClear();

			// Try load more
			await context.handlers.onLoadMoreFollowers?.();

			expect(adapter.getFollowers).not.toHaveBeenCalled();
		});

		it('loadFollowing(false) aborts if no cursor', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			// Initial load returns no nextCursor
			adapter.getFollowing.mockResolvedValue({ actors: [], totalCount: 0, nextCursor: null });

			controller = createController();
			await controller.initialize();

			adapter.getFollowing.mockClear();

			// Try load more
			await context.handlers.onLoadMoreFollowing?.();

			expect(adapter.getFollowing).not.toHaveBeenCalled();
		});
	});

	describe('mapGraphQLActor edge cases', () => {
		it('filters invalid fields', async () => {
			const actorWithWeirdFields = {
				...validActor,
				fields: [
					null,
					undefined,
					'string', // not object
					{}, // object but no name/value
					{ name: '', value: '' }, // empty name and value
					{ name: 'Valid', value: 'Field' }, // valid
				],
			};

			adapter.getActorByUsername.mockResolvedValue(actorWithWeirdFields);

			controller = createController();
			await controller.initialize();

			const profile = context.state.profile;
			expect(profile?.fields).toHaveLength(1);
			expect(profile?.fields?.[0].name).toBe('Valid');
		});

		it('returns null for invalid actor object', async () => {
			adapter.getActorByUsername.mockResolvedValue(null);
			controller = createController();
			await controller.initialize();
			expect(context.state.error).toBe('Profile not found');
		});
	});

	describe('normalizeActorPage edge cases', () => {
		it('handles null/invalid page response', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			// getFollowers returns null
			adapter.getFollowers.mockResolvedValue(null as any);

			controller = createController();
			await controller.initialize();

			// Should result in empty list
			expect(context.state.followers).toEqual([]);
			expect(context.state.followersTotal).toBe(0);
		});

		it('handles page response with missing actors array', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			// actors missing
			adapter.getFollowers.mockResolvedValue({ totalCount: 10 } as any);

			controller = createController();
			await controller.initialize();

			expect(context.state.followers).toEqual([]);
		});

		it('handles page response with empty nextCursor string', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);

			adapter.getFollowers.mockResolvedValue({
				actors: [],
				totalCount: 0,
				nextCursor: '', // Empty string should become null
			});

			controller = createController();
			await controller.initialize();

			expect(context.state.followersCursor).toBeNull();
		});
	});

	describe('Lifecycle', () => {
		it('throws if methods called after destroy', async () => {
			controller = createController();
			controller.destroy();

			// Calling a handler should trigger ensureActive() check
			// We mock followActor or just assume onFollow uses it
			// context.handlers.onFollow calls controller.followActor which calls ensureActive.

			await expect(context.handlers.onFollow?.('123')).rejects.toThrow(
				'Profile controller has been destroyed.'
			);
		});
	});
});
