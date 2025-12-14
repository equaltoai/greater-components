import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileGraphQLController } from '@equaltoai/greater-components-fediverse/components/Profile/GraphQLAdapter';
import { createFakeLesserAdapter } from '../../helpers/fakes/createFakeLesserAdapter';
import { createTestProfileContext } from '../../helpers/fakes/createTestProfileContext';
import { validActor } from '../../helpers/fixtures/profile';

describe('ProfileGraphQLController', () => {
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

	describe('Lifecycle & Configuration', () => {
		it('updates isOwnProfile on construction', () => {
			createController({ isOwnProfile: true });
			expect(context.state.isOwnProfile).toBe(true);

			createController({ isOwnProfile: false });
			expect(context.state.isOwnProfile).toBe(false);
		});

		it('matches() returns true for same configuration', () => {
			controller = createController({ pageSize: 40 });
			expect(controller.matches(adapter, 'testuser', 40)).toBe(true);
			expect(controller.matches(adapter, 'other', 40)).toBe(false);
		});

		it('setIsOwnProfile() updates state', () => {
			controller = createController();
			controller.setIsOwnProfile(true);
			expect(context.state.isOwnProfile).toBe(true);
		});

		it('destroy() cleans up resources', () => {
			controller = createController({ enablePreferences: true, isOwnProfile: true });
			controller.destroy();

			// Ensuring methods throw after destroy
			expect(() => (controller as any).ensureActive()).toThrow(/destroyed/);
		});
	});

	describe('Initialization', () => {
		it('initialize() loads profile successfully', async () => {
			(adapter.getActorByUsername as any).mockResolvedValue(validActor);
			(adapter.getRelationship as any).mockResolvedValue({ following: true });
			(adapter.getFollowers as any).mockResolvedValue({
				actors: [],
				totalCount: 100,
				nextCursor: null,
			});
			(adapter.getFollowing as any).mockResolvedValue({
				actors: [],
				totalCount: 50,
				nextCursor: null,
			});

			controller = createController();
			await controller.initialize();

			expect(context.state.loading).toBe(false);
			expect(context.state.error).toBeNull();
			expect(context.state.profile).toEqual(
				expect.objectContaining({
					username: validActor.username,
					isFollowing: true,
					followersCount: 100,
					followingCount: 50,
				})
			);

			// Should trigger followers/following loads
			expect(adapter.getFollowers).toHaveBeenCalledWith('testuser', 40, undefined);
			expect(adapter.getFollowing).toHaveBeenCalledWith('testuser', 40, undefined);
		});

		it('handles profile not found', async () => {
			adapter.getActorByUsername.mockResolvedValue(null);

			controller = createController();
			await controller.initialize();

			expect(context.state.error).toBe('Profile not found');
			expect(context.state.loading).toBe(false);
			// Should NOT load followers/following
			expect(adapter.getFollowers).not.toHaveBeenCalled();
		});

		it('handles adapter errors during load', async () => {
			(adapter as any).getActorByUsername.mockRejectedValue(new Error('Network error'));

			controller = createController();
			await controller.initialize();

			expect(context.state.error).toBe('Network error');
			expect(context.state.loading).toBe(false);
		});

		it('initialize() is idempotent (returns same promise)', async () => {
			(adapter as any).getActorByUsername.mockResolvedValue(validActor);

			controller = createController();
			const p1 = controller.initialize();
			const p2 = controller.initialize();

			// They might be different promises due to implementation details (wrapper vs inner)
			// but they should both complete without double-fetching.
			await Promise.all([p1, p2]);

			expect(adapter.getActorByUsername).toHaveBeenCalledTimes(1);
		});
	});

	describe('Pagination', () => {
		beforeEach(async () => {
			(adapter as any).getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
			vi.clearAllMocks(); // Clear initial calls
		});

		it('loadFollowers(false) does nothing if no cursor', async () => {
			// Initial load set cursor to null (default mock)
			await (controller as any).loadFollowers(false);
			expect(adapter.getFollowers).not.toHaveBeenCalled();
		});

		it('loadFollowers(true) resets list and loads page', async () => {
			const page1 = {
				actors: [{ ...validActor, id: 'f1', username: 'f1' }],
				totalCount: 10,
				nextCursor: 'next',
			};
			(adapter as any).getFollowers.mockResolvedValue(page1);

			await (controller as any).loadFollowers(true);

			expect(adapter.getFollowers).toHaveBeenCalledWith('testuser', 40, undefined);
			expect(context.state.followers).toHaveLength(1);
			expect(context.state.followers[0].username).toBe('f1');
			expect(context.state.followersCursor).toBe('next');
			expect(context.state.followersTotal).toBe(10);
		});

		it('loadFollowers(false) uses cursor', async () => {
			// Setup state with cursor
			context.updateState({ followersCursor: 'abc' });

			const page2 = { actors: [], totalCount: 10, nextCursor: null };
			(adapter as any).getFollowers.mockResolvedValue(page2);

			await (controller as any).loadFollowers(false);

			expect(adapter.getFollowers).toHaveBeenCalledWith('testuser', 40, 'abc');
		});

		it('loadFollowing mirrors loadFollowers behavior', async () => {
			const page1 = {
				actors: [{ ...validActor, id: 'fw1', username: 'fw1' }],
				totalCount: 5,
				nextCursor: 'next',
			};
			(adapter as any).getFollowing.mockResolvedValue(page1);

			await (controller as any).loadFollowing(true);

			expect(adapter.getFollowing).toHaveBeenCalledWith('testuser', 40, undefined);
			expect(context.state.following).toHaveLength(1);
			expect(context.state.followingTotal).toBe(5);
		});

		it('prevents concurrent loading', async () => {
			(adapter as any).getFollowers.mockImplementation(async () => {
				await new Promise((r) => setTimeout(r, 10));
				return { actors: [], totalCount: 0, nextCursor: null };
			});

			const p1 = (controller as any).loadFollowers(true);
			const p2 = (controller as any).loadFollowers(true);

			await Promise.all([p1, p2]);
			expect(adapter.getFollowers).toHaveBeenCalledTimes(1);
		});
	});

	describe('Actions & Relationships', () => {
		beforeEach(async () => {
			(adapter as any).getActorByUsername.mockResolvedValue(validActor);
			// Mock lists to return consistent counts so they don't overwrite profile counts with 0
			(adapter as any).getFollowers.mockResolvedValue({
				totalCount: validActor.followersCount ?? 0,
				nextCursor: null,
			});
			(adapter.getFollowing as any).mockResolvedValue({
				actors: [],
				totalCount: validActor.followingCount ?? 0,
				nextCursor: null,
			});

			controller = createController();
			await controller.initialize();
			vi.clearAllMocks();
		});

		it('followActor updates local state and calls adapter', async () => {
			await (controller as any).followActor('target-id');

			expect(adapter.followActor).toHaveBeenCalledWith('target-id');
		});

		it('updates current profile relationship if actor matches', async () => {
			// The initialized profile has id='1' (from validActor)
			await (controller as any).followActor('1');

			expect(context.state.profile?.isFollowing).toBe(true);
			expect(context.state.profile?.relationship?.following).toBe(true);
			// Should increment followers count
			expect(context.state.profile?.followersCount).toBe((validActor.followersCount || 0) + 1);
		});

		it('getFollowing() updates state', async () => {
			(adapter as any).getFollowing.mockResolvedValue({
				actors: [],
				totalCount: 51,
				nextCursor: null,
			});

			await (controller as any).loadFollowing(true);

			expect(adapter.getFollowing).toHaveBeenCalled();
			expect(context.state.profile?.followingCount).toBe((validActor.followingCount || 0) + 1);
		});

		it('unfollowActor updates local state and calls adapter', async () => {
			// First set to following
			const currentProfile = context.state.profile;
			if (!currentProfile) throw new Error('Profile not loaded');
			context.updateState({
				profile: { ...currentProfile, isFollowing: true, followersCount: 100 },
			});

			await (controller as any).unfollowActor('1');

			expect(adapter.unfollowActor).toHaveBeenCalledWith('1');
			expect(context.state.profile?.isFollowing).toBe(false);
			expect(context.state.profile?.followersCount).toBe(99);
		});

		it('block/unblock updates blocking state', async () => {
			await (controller as any).blockActor('1');
			expect(adapter.blockActor).toHaveBeenCalledWith('1');
			expect(context.state.profile?.isBlocked).toBe(true);

			await (controller as any).unblockActor('1');
			expect(adapter.unblockActor).toHaveBeenCalledWith('1');
			expect(context.state.profile?.isBlocked).toBe(false);
		});

		it('mute/unmute updates muting state', async () => {
			await (controller as any).muteActor('1', true);
			expect(adapter.muteActor).toHaveBeenCalledWith('1', true);
			expect(context.state.profile?.isMuted).toBe(true);
			expect(context.state.profile?.relationship?.mutingNotifications).toBe(true);

			await (controller as any).unmuteActor('1');
			expect(adapter.unmuteActor).toHaveBeenCalledWith('1');
			expect(context.state.profile?.isMuted).toBe(false);
		});
	});

	describe('Profile Update', () => {
		beforeEach(async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
		});

		it('updateProfile calls adapter and updates state', async () => {
			const updateData = {
				displayName: 'New Name',
				bio: 'New Bio',
			};

			const updatedActor = { ...validActor, displayName: 'New Name', summary: 'New Bio' };
			adapter.updateProfile.mockResolvedValue(updatedActor);

			await (controller as any).updateProfile(updateData);

			expect(adapter.updateProfile).toHaveBeenCalledWith(
				expect.objectContaining({
					displayName: 'New Name',
					bio: 'New Bio',
				})
			);

			expect(context.state.profile?.displayName).toBe('New Name');
			expect(context.state.profile?.bio).toBe('New Bio');
		});

		it('handles invalid profile response after update', async () => {
			adapter.updateProfile.mockResolvedValue(null); // Invalid

			await expect((controller as any).updateProfile({})).rejects.toThrow(
				'Received invalid profile payload'
			);
		});
	});

	describe('Preferences Integration', () => {
		it('initializes preferences controller when enabled', async () => {
			controller = createController({ enablePreferences: true, isOwnProfile: true });

			// Check if handlers are set
			expect(context.handlers.onLoadPreferences).toBeDefined();
			expect(context.handlers.onUpdatePrivacySettings).toBeDefined();
			expect(context.handlers.onGetPrivacySettings).toBeDefined();

			// We can't easily check if controller is created as it is private,
			// but presence of handlers is a good proxy.
		});

		it('does not initialize preferences when disabled or not own profile', () => {
			controller = createController({ enablePreferences: true, isOwnProfile: false });
			expect(context.handlers.onLoadPreferences).toBeUndefined();

			controller = createController({ enablePreferences: false, isOwnProfile: true });
			expect(context.handlers.onLoadPreferences).toBeUndefined();
		});
	});

	describe('Data Mapping', () => {
		it('mapGraphQLActor handles invalid/empty fields', () => {
			controller = createController();
			const mapper = (controller as any).mapGraphQLActor.bind(controller);

			const input = {
				id: '1',
				username: 'user',
				fields: [
					null,
					undefined,
					{}, // Empty object
					{ name: 'n', value: null }, // Invalid value
					{ name: null, value: 'v' }, // Invalid name
					{ name: '', value: '' }, // Empty both (should be skipped)
					{ name: 'Valid', value: 'Value', verifiedAt: 123 }, // verifiedAt not string
					{ name: 'Valid', value: 'Value', verifiedAt: '2021' }, // Valid
				],
			};

			const result = mapper(input);
			// Fields that have at least name OR value are kept.
			expect(result.fields).toHaveLength(4);
			
			expect(result.fields[0]).toEqual({ name: 'n', value: '', verifiedAt: undefined });
			expect(result.fields[1]).toEqual({ name: '', value: 'v', verifiedAt: undefined });
			expect(result.fields[2]).toEqual({ name: 'Valid', value: 'Value', verifiedAt: undefined });
			expect(result.fields[3]).toEqual({ name: 'Valid', value: 'Value', verifiedAt: '2021' });
		});
	});
});
