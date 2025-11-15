/**
 * Tests for Lesser GraphQL Converters
 */

import { describe, it, expect } from 'vitest';
import {
	convertGraphQLActorListPage,
	convertGraphQLActorToLesserAccount,
	convertGraphQLUserPreferences,
	convertGraphQLPushSubscription,
	convertGraphQLObjectToLesser,
} from '../graphqlConverters.js';

describe('convertGraphQLActorListPage', () => {
	it('should convert valid ActorListPage data', () => {
		const data = {
			actors: [
				{
					id: '1',
					username: 'alice',
					domain: 'example.com',
					displayName: 'Alice',
					summary: 'Test user',
					avatar: 'https://example.com/avatar.jpg',
					header: 'https://example.com/header.jpg',
					followers: 100,
					following: 50,
					statusesCount: 200,
					bot: false,
					locked: false,
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-02T00:00:00Z',
					trustScore: 0.8,
					fields: [],
				},
			],
			nextCursor: 'cursor123',
			totalCount: 100,
		};

		const result = convertGraphQLActorListPage(data);

		expect(result).not.toBeNull();
		if (result) {
			expect(result.actors).toHaveLength(1);
			expect(result.actors[0]?.localHandle).toBe('alice');
			expect(result.actors[0]?.handle).toBe('alice@example.com');
			expect(result.actors[0]?.displayName).toBe('Alice');
			expect(result.nextCursor).toBe('cursor123');
			expect(result.totalCount).toBe(100);
		}
	});

	it('should handle empty actors array', () => {
		const data = {
			actors: [],
			totalCount: 0,
		};

		const result = convertGraphQLActorListPage(data);

		expect(result).not.toBeNull();
		expect(result?.actors).toHaveLength(0);
		expect(result?.totalCount).toBe(0);
		expect(result?.nextCursor).toBeUndefined();
	});

	it('should return null for invalid data', () => {
		expect(convertGraphQLActorListPage(null)).toBeNull();
		expect(convertGraphQLActorListPage(undefined)).toBeNull();
		expect(convertGraphQLActorListPage('invalid')).toBeNull();
	});
});

describe('convertGraphQLActorToLesserAccount edge cases', () => {
	it('handles malformed actors and timestamp fallbacks', () => {
		expect(convertGraphQLActorToLesserAccount('noop')).toBeNull();
		expect(convertGraphQLActorToLesserAccount({ id: 'x' })).toBeNull();

		const actor = convertGraphQLActorToLesserAccount({
			id: '1',
			username: 'bob',
			createdAt: 0,
			updatedAt: new Date('2024-01-01T00:00:00Z'),
			avatar: null,
			header: undefined,
			fields: [],
		});

		expect(actor?.joinedAt).toContain('1970');
		expect(actor?.avatarUrl).toBe('');
	});

	it('accepts already-normalized payloads and filters malformed emojis/fields', () => {
		const normalized = convertGraphQLActorToLesserAccount({
			id: 'acct-1',
			handle: 'alice@example.com',
			localHandle: 'alice',
			displayName: 'Alice',
			customEmojis: [
				{ code: 'happy', imageUrl: 'img.png', staticUrl: 'static.png', category: 'fun' },
				{ code: 'bad' },
			],
			profileFields: [
				{ label: 'Site', content: 'example.com' },
				{ label: '', content: '' },
			],
			joinedAt: new Date('2024-02-02T10:00:00Z'),
		});

		expect(normalized).not.toBeNull();
		expect(normalized?.customEmojis).toHaveLength(1);
		expect(normalized?.profileFields).toHaveLength(1);
		expect(normalized?.joinedAt).toBe('2024-02-02T10:00:00.000Z');
	});
});

describe('convertGraphQLUserPreferences', () => {
	it('should convert valid preferences data', () => {
		const data = {
			actorId: 'user123',
			posting: {
				defaultVisibility: 'PUBLIC',
				defaultSensitive: false,
				defaultLanguage: 'en',
			},
			reading: {
				expandSpoilers: false,
				expandMedia: 'DEFAULT',
				autoplayGifs: true,
				timelineOrder: 'NEWEST',
			},
			discovery: {
				showFollowCounts: true,
				searchSuggestionsEnabled: true,
				personalizedSearchEnabled: true,
			},
			streaming: {
				defaultQuality: 'AUTO',
				autoQuality: true,
				preloadNext: false,
				dataSaver: false,
			},
			notifications: {
				email: false,
				push: true,
				inApp: true,
				digest: 'NEVER',
			},
			privacy: {
				defaultVisibility: 'PUBLIC',
				indexable: true,
				showOnlineStatus: false,
			},
			reblogFilters: [{ key: 'filter1', enabled: true }],
		};

		const result = convertGraphQLUserPreferences(data);

		expect(result).not.toBeNull();
		expect(result?.actorId).toBe('user123');
		expect(result?.posting.defaultVisibility).toBe('PUBLIC');
		expect(result?.reading.expandMedia).toBe('DEFAULT');
		expect(result?.streaming.defaultQuality).toBe('AUTO');
		expect(result?.notifications.push).toBe(true);
		expect(result?.privacy.indexable).toBe(true);
		expect(result?.reblogFilters).toHaveLength(1);
	});

	it('should handle missing nested objects with defaults', () => {
		const data = {
			actorId: 'user123',
		};

		const result = convertGraphQLUserPreferences(data);

		expect(result).not.toBeNull();
		expect(result?.actorId).toBe('user123');
		expect(result?.posting.defaultVisibility).toBe('PUBLIC');
		expect(result?.reading.autoplayGifs).toBe(false);
		expect(result?.discovery.showFollowCounts).toBe(true);
	});

	it('should return null for invalid data', () => {
		expect(convertGraphQLUserPreferences(null)).toBeNull();
		expect(convertGraphQLUserPreferences({ noActorId: 'invalid' })).toBeNull();
	});
});

describe('convertGraphQLObjectToLesser edge cases', () => {
	const baseActor = {
		id: 'actor1',
		username: 'actor',
		createdAt: '2024-01-01T00:00:00Z',
		displayName: 'Actor',
		summary: '',
		avatar: '',
		header: '',
		followers: 0,
		following: 0,
		statusesCount: 0,
		fields: [],
	};

	it('returns null for invalid objects or actors', () => {
		expect(convertGraphQLObjectToLesser(null)).toBeNull();
		expect(
			convertGraphQLObjectToLesser({ id: '1', type: 'Note', content: 'hi', actor: {} })
		).toBeNull();
	});

	it('normalizes permissions, visibility, and quote context defaults', () => {
		const result = convertGraphQLObjectToLesser({
			id: 'obj1',
			type: 'Note',
			content: 'hello',
			createdAt: 1700000000000,
			updatedAt: undefined,
			actor: baseActor,
			visibility: 'FOLLOWERS',
			quotePermissions: 'unknown',
			quoteContext: {
				quoteAllowed: false,
				quoteType: 'invalid',
				originalNote: { id: 'note1' },
			},
		});

		expect(result).not.toBeNull();
		expect(result?.visibility).toBe('PRIVATE');
		expect(result?.quotePermissions).toBe('EVERYONE');
		expect(result?.quoteContext?.quoteType).toBe('FULL');
		expect(result?.quoteContext?.quoteAllowed).toBe(false);
	});
});

describe('convertGraphQLPushSubscription', () => {
	it('should convert valid push subscription data', () => {
		const data = {
			id: 'sub123',
			endpoint: 'https://push.example.com/subscription',
			keys: {
				auth: 'auth_key_here',
				p256dh: 'p256dh_key_here',
			},
			alerts: {
				follow: true,
				favourite: true,
				reblog: false,
				mention: true,
				poll: false,
				followRequest: true,
				status: true,
				update: false,
				adminSignUp: false,
				adminReport: false,
			},
			policy: 'all',
			serverKey: 'server_vapid_key',
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-02T00:00:00Z',
		};

		const result = convertGraphQLPushSubscription(data);

		expect(result).not.toBeNull();
		expect(result?.id).toBe('sub123');
		expect(result?.endpoint).toBe('https://push.example.com/subscription');
		expect(result?.keys.auth).toBe('auth_key_here');
		expect(result?.keys.p256dh).toBe('p256dh_key_here');
		expect(result?.alerts.follow).toBe(true);
		expect(result?.alerts.reblog).toBe(false);
		expect(result?.policy).toBe('all');
	});

	it('should return null for invalid data', () => {
		expect(convertGraphQLPushSubscription(null)).toBeNull();
		expect(convertGraphQLPushSubscription({ id: '123' })).toBeNull(); // missing required fields
	});

	it('should handle missing optional fields', () => {
		const data = {
			id: 'sub123',
			endpoint: 'https://push.example.com/subscription',
			keys: {
				auth: 'auth_key',
				p256dh: 'p256dh_key',
			},
			alerts: {
				follow: true,
				favourite: true,
				reblog: true,
				mention: true,
				poll: true,
				followRequest: true,
				status: true,
				update: true,
				adminSignUp: true,
				adminReport: true,
			},
			policy: 'all',
		};

		const result = convertGraphQLPushSubscription(data);

		expect(result).not.toBeNull();
		expect(result?.serverKey).toBeUndefined();
		expect(result?.createdAt).toBeUndefined();
		expect(result?.updatedAt).toBeUndefined();
	});

	it('guards against malformed push subscription shapes', () => {
		expect(
			convertGraphQLPushSubscription({
				id: 'oops',
				endpoint: 'https://push.example.com/subscription',
				keys: {},
				alerts: 'not-an-object',
			})
		).toBeNull();

		const defaults = convertGraphQLPushSubscription({
			id: 'sub456',
			endpoint: 'https://push.example.com/with-defaults',
			keys: { auth: 'a', p256dh: 'b' },
			alerts: {},
			policy: 'mentions-only',
		});

		expect(defaults?.alerts.follow).toBe(true);
		expect(defaults?.alerts.adminReport).toBe(false);
		expect(defaults?.policy).toBe('mentions-only');
	});
});

describe('convertGraphQLObjectToLesser', () => {
	const actor = {
		id: 'actor1',
		username: 'alice',
		domain: null,
		displayName: 'Alice',
		summary: 'Test actor',
		avatar: 'https://example.com/avatar.png',
		header: 'https://example.com/header.png',
		followers: 10,
		following: 5,
		statusesCount: 20,
		bot: false,
		locked: false,
		updatedAt: '2024-01-02T00:00:00Z',
		trustScore: 0.5,
		fields: [],
	};

	it('falls back to updatedAt when createdAt is missing', () => {
		const object = {
			id: 'note1',
			type: 'NOTE',
			content: 'Hello world',
			visibility: 'PUBLIC',
			sensitive: false,
			attachments: [],
			tags: [],
			mentions: [],
			repliesCount: 0,
			likesCount: 0,
			sharesCount: 0,
			estimatedCost: 0,
			quoteable: true,
			quotePermissions: 'EVERYONE',
			quoteCount: 0,
			communityNotes: [],
			actor,
			createdAt: null,
			updatedAt: '2024-01-03T00:00:00Z',
		};

		const result = convertGraphQLObjectToLesser(object);
		expect(result).not.toBeNull();
		expect(result?.createdAt).toBe('2024-01-03T00:00:00Z');
		expect(result?.updatedAt).toBe('2024-01-03T00:00:00Z');
	});

	it('falls back to published timestamp when audit fields are missing', () => {
		const object = {
			id: 'note2',
			type: 'NOTE',
			content: 'Fallback test',
			visibility: 'PUBLIC',
			sensitive: false,
			attachments: [],
			tags: [],
			mentions: [],
			repliesCount: 0,
			likesCount: 0,
			sharesCount: 0,
			estimatedCost: 0,
			quoteable: true,
			quotePermissions: 'EVERYONE',
			quoteCount: 0,
			communityNotes: [],
			actor,
			createdAt: undefined,
			updatedAt: undefined,
			published: '2024-02-01T12:34:00Z',
		};

		const result = convertGraphQLObjectToLesser(object);
		expect(result).not.toBeNull();
		expect(result?.createdAt).toBe('2024-02-01T12:34:00Z');
		expect(result?.updatedAt).toBe('2024-02-01T12:34:00Z');
	});

	it('normalizes quote permissions, timeouts, and filters malformed collections', () => {
		const normalizedActor = {
			id: 'actor-normalized',
			handle: 'norm@example.com',
			localHandle: 'norm',
			displayName: 'Norm',
			bio: '',
			avatarUrl: '',
			bannerUrl: '',
			joinedAt: 1700000000000,
			isVerified: false,
			isBot: false,
			isLocked: false,
			followerCount: 0,
			followingCount: 0,
			postCount: 0,
			profileFields: [],
			customEmojis: [],
		};

		const object = {
			id: 'note3',
			type: 'NOTE',
			content: 'Edge case object',
			visibility: 'PRIVATE',
			quotePermissions: 'followers',
			actor: normalizedActor,
			lastActivity: 1_700_000_000_000,
			attachments: [
				{ id: 'att-1', type: 'image', url: 'https://example.com/1.png', previewUrl: 123 },
				{ type: 'invalid' },
			],
			tags: [{ name: 'tag', url: '/tag' }, { name: null }],
			mentions: [
				{ id: 'm-1', username: 'bob', url: '/bob' },
				{ id: null },
			],
			communityNotes: [
				{
					id: 'note-1',
					content: 'Context',
					helpful: 1,
					notHelpful: 0,
					createdAt: '2024-01-01T00:00:00Z',
					author: { whatever: true },
				},
			],
		};

		const result = convertGraphQLObjectToLesser(object);

		expect(result).not.toBeNull();
		expect(result?.quotePermissions).toBe('FOLLOWERS');
		expect(result?.createdAt).toBe('2023-11-14T22:13:20.000Z');
		expect(result?.attachments).toHaveLength(1);
		expect(result?.mentions).toHaveLength(1);
		expect(result?.tags).toHaveLength(1);
		expect(result?.communityNotes?.[0]?.author).toBeUndefined();
	});
});
