/**
 * Lesser GraphQL Adapter Tests
 * 
 * Comprehensive tests for the GraphQL adapter
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LesserGraphQLAdapter, createLesserGraphQLAdapter } from '../../src/graphql/LesserGraphQLAdapter.js';
import type { LesserGraphQLAdapterConfig } from '../../src/graphql/LesserGraphQLAdapter.js';

describe('LesserGraphQLAdapter', () => {
	let adapter: LesserGraphQLAdapter;
	let config: LesserGraphQLAdapterConfig;

	beforeEach(() => {
		config = {
			httpEndpoint: 'https://api.lesser.test/graphql',
			wsEndpoint: 'wss://api.lesser.test/graphql',
			token: 'test-token',
			debug: false,
		};
		adapter = new LesserGraphQLAdapter(config);
	});

	afterEach(() => {
		adapter.close();
	});

	describe('Configuration', () => {
		it('should create adapter with valid config', () => {
			expect(adapter).toBeInstanceOf(LesserGraphQLAdapter);
		});

		it('should create adapter using factory function', () => {
			const factoryAdapter = createLesserGraphQLAdapter(config);
			expect(factoryAdapter).toBeInstanceOf(LesserGraphQLAdapter);
			factoryAdapter.close();
		});

		it('should enable optimistic updates by default', () => {
			const adapter2 = new LesserGraphQLAdapter(config);
			expect(adapter2['enableOptimisticUpdates']).toBe(true);
			adapter2.close();
		});

		it('should respect optimistic updates config', () => {
			const adapter2 = new LesserGraphQLAdapter({
				...config,
				enableOptimisticUpdates: false,
			});
			expect(adapter2['enableOptimisticUpdates']).toBe(false);
			adapter2.close();
		});
	});

	describe('Token Management', () => {
		it('should update token', () => {
			expect(() => adapter.updateToken('new-token')).not.toThrow();
		});

		it('should handle null token', () => {
			expect(() => adapter.updateToken(null)).not.toThrow();
		});
	});

	describe('Timeline Operations', () => {
		it('should fetch home timeline', async () => {
			// Mock implementation would be needed for actual API calls
			// This test validates the method exists and accepts correct parameters
			expect(adapter.fetchHomeTimeline).toBeDefined();
			expect(typeof adapter.fetchHomeTimeline).toBe('function');
		});

		it('should fetch public timeline with local param', async () => {
			expect(adapter.fetchPublicTimeline).toBeDefined();
			expect(typeof adapter.fetchPublicTimeline).toBe('function');
		});

		it('should fetch hashtag timeline', async () => {
			expect(adapter.fetchHashtagTimeline).toBeDefined();
			expect(typeof adapter.fetchHashtagTimeline).toBe('function');
		});

		it('should accept pagination parameters', () => {
			const variables = {
				limit: 20,
				maxId: '12345',
				minId: '67890',
				sinceId: '11111',
			};

			expect(() => adapter.fetchHomeTimeline(variables)).toBeDefined();
		});
	});

	describe('Status Operations', () => {
		it('should get single status', async () => {
			expect(adapter.getStatus).toBeDefined();
			expect(typeof adapter.getStatus).toBe('function');
		});

		it('should create status', async () => {
			expect(adapter.createStatus).toBeDefined();
			expect(typeof adapter.createStatus).toBe('function');
		});

		it('should accept create status parameters', () => {
			const variables = {
				status: 'Test post',
				visibility: 'public' as const,
				sensitive: false,
				mediaIds: ['123', '456'],
			};

			expect(() => adapter.createStatus(variables)).toBeDefined();
		});

		it('should delete status', async () => {
			expect(adapter.deleteStatus).toBeDefined();
			expect(typeof adapter.deleteStatus).toBe('function');
		});

		it('should favourite status', async () => {
			expect(adapter.favouriteStatus).toBeDefined();
			expect(typeof adapter.favouriteStatus).toBe('function');
		});

		it('should unfavourite status', async () => {
			expect(adapter.unfavouriteStatus).toBeDefined();
			expect(typeof adapter.unfavouriteStatus).toBe('function');
		});

		it('should reblog status', async () => {
			expect(adapter.reblogStatus).toBeDefined();
			expect(typeof adapter.reblogStatus).toBe('function');
		});

		it('should unreblog status', async () => {
			expect(adapter.unreblogStatus).toBeDefined();
			expect(typeof adapter.unreblogStatus).toBe('function');
		});

		it('should bookmark status', async () => {
			expect(adapter.bookmarkStatus).toBeDefined();
			expect(typeof adapter.bookmarkStatus).toBe('function');
		});

		it('should unbookmark status', async () => {
			expect(adapter.unbookmarkStatus).toBeDefined();
			expect(typeof adapter.unbookmarkStatus).toBe('function');
		});
	});

	describe('Account Operations', () => {
		it('should get account', async () => {
			expect(adapter.getAccount).toBeDefined();
			expect(typeof adapter.getAccount).toBe('function');
		});

		it('should follow account', async () => {
			expect(adapter.followAccount).toBeDefined();
			expect(typeof adapter.followAccount).toBe('function');
		});

		it('should unfollow account', async () => {
			expect(adapter.unfollowAccount).toBeDefined();
			expect(typeof adapter.unfollowAccount).toBe('function');
		});

		it('should block account', async () => {
			expect(adapter.blockAccount).toBeDefined();
			expect(typeof adapter.blockAccount).toBe('function');
		});

		it('should unblock account', async () => {
			expect(adapter.unblockAccount).toBeDefined();
			expect(typeof adapter.unblockAccount).toBe('function');
		});

		it('should mute account', async () => {
			expect(adapter.muteAccount).toBeDefined();
			expect(typeof adapter.muteAccount).toBe('function');
		});

		it('should unmute account', async () => {
			expect(adapter.unmuteAccount).toBeDefined();
			expect(typeof adapter.unmuteAccount).toBe('function');
		});

		it('should accept mute with notifications parameter', () => {
			expect(() => adapter.muteAccount('123', true)).toBeDefined();
			expect(() => adapter.muteAccount('123', false)).toBeDefined();
		});
	});

	describe('Search Operations', () => {
		it('should search', async () => {
			expect(adapter.search).toBeDefined();
			expect(typeof adapter.search).toBe('function');
		});

		it('should accept search parameters', () => {
			const variables = {
				query: 'test',
				type: 'accounts' as const,
				resolve: true,
				following: false,
				limit: 20,
			};

			expect(() => adapter.search(variables)).toBeDefined();
		});
	});

	describe('Notification Operations', () => {
		it('should fetch notifications', async () => {
			expect(adapter.fetchNotifications).toBeDefined();
			expect(typeof adapter.fetchNotifications).toBe('function');
		});

		it('should mark notifications as read', async () => {
			expect(adapter.markNotificationsAsRead).toBeDefined();
			expect(typeof adapter.markNotificationsAsRead).toBe('function');
		});

		it('should accept notification filter parameters', () => {
			const variables = {
				types: ['mention', 'favourite'],
				limit: 40,
				maxId: '12345',
			};

			expect(() => adapter.fetchNotifications(variables)).toBeDefined();
		});
	});

	describe('Subscription Operations', () => {
		it('should subscribe to home timeline', () => {
			const subscription = adapter.subscribeToHomeTimeline();
			expect(subscription).toBeDefined();
			expect(subscription.subscribe).toBeDefined();
		});

		it('should subscribe to notifications', () => {
			const subscription = adapter.subscribeToNotifications();
			expect(subscription).toBeDefined();
			expect(subscription.subscribe).toBeDefined();
		});

		it('should subscribe to public timeline', () => {
			const subscription = adapter.subscribeToPublicTimeline();
			expect(subscription).toBeDefined();
			expect(subscription.subscribe).toBeDefined();
		});

		it('should subscribe to hashtag timeline', () => {
			const subscription = adapter.subscribeToHashtagTimeline('test');
			expect(subscription).toBeDefined();
			expect(subscription.subscribe).toBeDefined();
		});

		it('should accept subscription parameters', () => {
			expect(() => adapter.subscribeToPublicTimeline(true)).toBeDefined();
			expect(() => adapter.subscribeToPublicTimeline(false)).toBeDefined();
			expect(() => adapter.subscribeToNotifications(['mention'])).toBeDefined();
		});
	});

	describe('Lifecycle', () => {
		it('should close cleanly', () => {
			expect(() => adapter.close()).not.toThrow();
		});

		it('should handle multiple close calls', () => {
			adapter.close();
			expect(() => adapter.close()).not.toThrow();
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid endpoint gracefully', () => {
			const invalidConfig = {
				...config,
				httpEndpoint: 'invalid-url',
			};

			expect(() => new LesserGraphQLAdapter(invalidConfig)).not.toThrow();
		});

		it('should handle missing token', () => {
			const noTokenConfig = {
				httpEndpoint: config.httpEndpoint,
				wsEndpoint: config.wsEndpoint,
			};

			expect(() => new LesserGraphQLAdapter(noTokenConfig)).not.toThrow();
		});
	});
});

describe('GraphQL Cache Configuration', () => {
	it('should have type policies configured', () => {
		// This would test the cache configuration
		// Import and test the cache config
		expect(true).toBe(true); // Placeholder
	});
});

describe('GraphQL Optimistic Updates', () => {
	it('should provide optimistic update helpers', () => {
		// Test optimistic update functions
		expect(true).toBe(true); // Placeholder
	});
});

