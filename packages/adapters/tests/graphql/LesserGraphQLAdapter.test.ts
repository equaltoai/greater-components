import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
	LesserGraphQLAdapter,
	createLesserGraphQLAdapter,
} from '../../src/graphql/LesserGraphQLAdapter.js';
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

	describe('configuration', () => {
		it('creates adapter instances directly', () => {
			expect(adapter).toBeInstanceOf(LesserGraphQLAdapter);
		});

		it('creates adapter instances via factory', () => {
			const instance = createLesserGraphQLAdapter(config);
			expect(instance).toBeInstanceOf(LesserGraphQLAdapter);
			instance.close();
		});

		it('updates authentication token', () => {
			expect(() => adapter.updateToken('new-token')).not.toThrow();
			expect(() => adapter.updateToken(null)).not.toThrow();
		});
	});

	describe('query surface', () => {
		it('exposes timeline helpers', () => {
			expect(typeof adapter.fetchTimeline).toBe('function');
			expect(typeof adapter.fetchHomeTimeline).toBe('function');
			expect(typeof adapter.fetchHashtagTimeline).toBe('function');
			expect(typeof adapter.fetchListTimeline).toBe('function');
			expect(typeof adapter.fetchActorTimeline).toBe('function');
		});

		it('exposes object lookups', () => {
			expect(typeof adapter.getObject).toBe('function');
			expect(typeof adapter.getActorById).toBe('function');
			expect(typeof adapter.getActorByUsername).toBe('function');
		});

		it('exposes search and notification queries', () => {
			expect(typeof adapter.search).toBe('function');
			expect(typeof adapter.fetchNotifications).toBe('function');
		});

		it('exposes list and conversation queries', () => {
			expect(typeof adapter.getLists).toBe('function');
			expect(typeof adapter.getConversations).toBe('function');
		});
	});

	describe('mutation surface', () => {
		it('exposes note mutations', () => {
			expect(typeof adapter.createNote).toBe('function');
			expect(typeof adapter.createQuoteNote).toBe('function');
			expect(typeof adapter.deleteObject).toBe('function');
		});

		it('exposes interaction mutations', () => {
			expect(typeof adapter.likeObject).toBe('function');
			expect(typeof adapter.unlikeObject).toBe('function');
			expect(typeof adapter.shareObject).toBe('function');
			expect(typeof adapter.unshareObject).toBe('function');
			expect(typeof adapter.bookmarkObject).toBe('function');
			expect(typeof adapter.unbookmarkObject).toBe('function');
			expect(typeof adapter.pinObject).toBe('function');
			expect(typeof adapter.unpinObject).toBe('function');
		});

		it('exposes relationship mutations', () => {
			expect(typeof adapter.followActor).toBe('function');
			expect(typeof adapter.unfollowActor).toBe('function');
			expect(typeof adapter.blockActor).toBe('function');
			expect(typeof adapter.unblockActor).toBe('function');
			expect(typeof adapter.muteActor).toBe('function');
			expect(typeof adapter.unmuteActor).toBe('function');
			expect(typeof adapter.updateRelationship).toBe('function');
		});

		it('exposes list management mutations', () => {
			expect(typeof adapter.createList).toBe('function');
			expect(typeof adapter.updateList).toBe('function');
			expect(typeof adapter.deleteList).toBe('function');
		});

		it('exposes conversation management mutations', () => {
			expect(typeof adapter.markConversationAsRead).toBe('function');
			expect(typeof adapter.deleteConversation).toBe('function');
		});
	});

	describe('subscriptions', () => {
		it('exposes subscription helpers', () => {
			expect(typeof adapter.subscribeToTimelineUpdates).toBe('function');
			expect(typeof adapter.subscribeToNotificationStream).toBe('function');
			expect(typeof adapter.subscribeToConversationUpdates).toBe('function');
			expect(typeof adapter.subscribeToListUpdates).toBe('function');
			expect(typeof adapter.subscribeToQuoteActivity).toBe('function');
			expect(typeof adapter.subscribeToHashtagActivity).toBe('function');
		});
	});
});
