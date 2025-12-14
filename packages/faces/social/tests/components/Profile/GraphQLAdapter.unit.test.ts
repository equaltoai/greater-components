import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileGraphQLController } from '../../../src/components/Profile/GraphQLAdapter';
import { createFakeLesserAdapter } from '../../helpers/fakes/createFakeLesserAdapter';
import { createTestProfileContext } from '../../helpers/fakes/createTestProfileContext';
import { validActor } from '../../helpers/fixtures/profile';

describe('ProfileGraphQLController Unit', () => {
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

	describe('Lifecycle', () => {
		it('initializes correctly', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
			expect(context.state.profile?.username).toBe(validActor.username);
		});

		it('matches config', () => {
			controller = createController();
			expect(controller.matches(adapter, 'testuser', 40)).toBe(true);
			expect(controller.matches(adapter, 'other', 40)).toBe(false);
		});

		it('updates isOwnProfile', () => {
			controller = createController();
			controller.setIsOwnProfile(true);
			expect(context.state.isOwnProfile).toBe(true);
		});
	});

	describe('Error Handling', () => {
		it('handles profile not found', async () => {
			adapter.getActorByUsername.mockResolvedValue(null);
			controller = createController();
			await controller.initialize();
			expect(context.state.error).toContain('Profile not found');
		});

		it('handles invalid profile data', async () => {
			adapter.getActorByUsername.mockResolvedValue({}); // invalid
			controller = createController();
			await controller.initialize();
			expect(context.state.error).toContain('Invalid profile payload');
		});

		it('handles loadFollowers error', async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			adapter.getFollowers.mockRejectedValue(new Error('Network error'));
			controller = createController();
			await controller.initialize();
			// Profile should load, but followers failed
			expect(context.state.profile).toBeDefined();
			expect(context.state.error).toContain('Network error');
		});
	});

	describe('Interactions', () => {
		beforeEach(async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
		});

		it('follows actor', async () => {
			await context.handlers.onFollow?.('target-id');
			expect(adapter.followActor).toHaveBeenCalledWith('target-id');
		});

		it('unfollows actor', async () => {
			await context.handlers.onUnfollow?.('target-id');
			expect(adapter.unfollowActor).toHaveBeenCalledWith('target-id');
		});

		it('blocks actor', async () => {
			await context.handlers.onBlock?.('target-id');
			expect(adapter.blockActor).toHaveBeenCalledWith('target-id');
		});

		it('unblocks actor', async () => {
			await context.handlers.onUnblock?.('target-id');
			expect(adapter.unblockActor).toHaveBeenCalledWith('target-id');
		});

		it('mutes actor', async () => {
			await context.handlers.onMute?.('target-id', true);
			expect(adapter.muteActor).toHaveBeenCalledWith('target-id', true);
		});

		it('unmutes actor', async () => {
			await context.handlers.onUnmute?.('target-id');
			expect(adapter.unmuteActor).toHaveBeenCalledWith('target-id');
		});
	});

	describe('Profile Update', () => {
		beforeEach(async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
		});

		it('updates profile', async () => {
			const updateData = { displayName: 'New Name' };
			const updatedActor = { ...validActor, displayName: 'New Name' };
			adapter.updateProfile.mockResolvedValue(updatedActor);

			await context.handlers.onSave?.(updateData);

			expect(adapter.updateProfile).toHaveBeenCalledWith(
				expect.objectContaining({
					displayName: 'New Name',
				})
			);
			expect(context.state.profile?.displayName).toBe('New Name');
		});

		it('handles update error', async () => {
			adapter.updateProfile.mockRejectedValue(new Error('Update failed'));
			await expect(context.handlers.onSave?.({})).rejects.toThrow('Update failed');
		});
	});

	describe('Pagination', () => {
		beforeEach(async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
			controller = createController();
			await controller.initialize();
		});

		it('loads more followers', async () => {
			context.updateState({ followersCursor: 'next-page' });
			adapter.getFollowers.mockResolvedValue({
				actors: [{ id: 'f1', username: 'follower1' }],
				totalCount: 1,
				nextCursor: null,
			});

			await context.handlers.onLoadMoreFollowers?.();

			expect(adapter.getFollowers).toHaveBeenCalledWith(
				'testuser',
				40,
				'next-page'
			);
			expect(context.state.followers).toHaveLength(1);
			expect(context.state.followersCursor).toBeNull();
		});

		it('loads more following', async () => {
			context.updateState({ followingCursor: 'next-page' });
			adapter.getFollowing.mockResolvedValue({
				actors: [{ id: 'f1', username: 'following1' }],
				totalCount: 1,
				nextCursor: null,
			});

			await context.handlers.onLoadMoreFollowing?.();

			expect(adapter.getFollowing).toHaveBeenCalledWith(
				'testuser',
				40,
				'next-page'
			);
			expect(context.state.following).toHaveLength(1);
			expect(context.state.followingCursor).toBeNull();
		});
	});

    describe('Relationship Updates', () => {
         beforeEach(async () => {
			adapter.getActorByUsername.mockResolvedValue(validActor);
            // Setup a follower to update
            adapter.getFollowers.mockResolvedValue({
				actors: [{ id: 'f1', username: 'follower1', relationship: { following: false } }],
				totalCount: 1,
				nextCursor: null,
			});
			controller = createController();
			await controller.initialize();
		});

        it('updates relationship in lists when following', async () => {
            await context.handlers.onFollow?.('f1');
            expect(context.state.followers[0].relationship?.following).toBe(true);
        });

         it('updates relationship in lists when muting', async () => {
            await context.handlers.onMute?.('f1', false);
            expect(context.state.followers[0].relationship?.muting).toBe(true);
        });
    });
});
