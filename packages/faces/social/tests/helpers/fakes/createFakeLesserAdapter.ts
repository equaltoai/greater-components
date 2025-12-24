import { vi, type Mock } from 'vitest';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

export function createFakeLesserAdapter(
	overrides: Partial<LesserGraphQLAdapter> = {}
): LesserGraphQLAdapter {
	return {
		// Profile / Actor
		getActorByUsername: vi.fn().mockResolvedValue(null),
		getRelationship: vi.fn().mockResolvedValue(null),
		getFollowers: vi.fn().mockResolvedValue({ actors: [], totalCount: 0, nextCursor: null }),
		getFollowing: vi.fn().mockResolvedValue({ actors: [], totalCount: 0, nextCursor: null }),
		followActor: vi.fn().mockResolvedValue(undefined),
		unfollowActor: vi.fn().mockResolvedValue(undefined),
		blockActor: vi.fn().mockResolvedValue(undefined),
		unblockActor: vi.fn().mockResolvedValue(undefined),
		muteActor: vi.fn().mockResolvedValue(undefined),
		unmuteActor: vi.fn().mockResolvedValue(undefined),
		updateProfile: vi.fn().mockResolvedValue({}),

		// Preferences
		getUserPreferences: vi.fn().mockResolvedValue(null),
		updateUserPreferences: vi.fn().mockResolvedValue({}),
		updateStreamingPreferences: vi.fn().mockResolvedValue({}),

		// Notifications
		getPushSubscription: vi.fn().mockResolvedValue(null),
		registerPushSubscription: vi.fn().mockResolvedValue({}),
		updatePushSubscription: vi.fn().mockResolvedValue({}),
		deletePushSubscription: vi.fn().mockResolvedValue(true),

		...overrides,
	} as unknown as LesserGraphQLAdapter;
}

export function adapterThatReturnsActor(actor: unknown): LesserGraphQLAdapter {
	return createFakeLesserAdapter({
		getActorByUsername: vi.fn().mockResolvedValue(actor),
	});
}

export function adapterThatThrowsOnce(
	method: keyof LesserGraphQLAdapter,
	error: Error = new Error('Test Error')
): LesserGraphQLAdapter {
	const adapter = createFakeLesserAdapter();
	(adapter[method] as unknown as Mock).mockRejectedValueOnce(error);
	return adapter;
}
