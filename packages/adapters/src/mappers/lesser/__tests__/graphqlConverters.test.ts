/**
 * Tests for Lesser GraphQL Converters
 */

import { describe, it, expect } from 'vitest';
import {
  convertGraphQLActorListPage,
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
          fields: []
        }
      ],
      nextCursor: 'cursor123',
      totalCount: 100
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
      totalCount: 0
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

describe('convertGraphQLUserPreferences', () => {
  it('should convert valid preferences data', () => {
    const data = {
      actorId: 'user123',
      posting: {
        defaultVisibility: 'PUBLIC',
        defaultSensitive: false,
        defaultLanguage: 'en'
      },
      reading: {
        expandSpoilers: false,
        expandMedia: 'DEFAULT',
        autoplayGifs: true,
        timelineOrder: 'NEWEST'
      },
      discovery: {
        showFollowCounts: true,
        searchSuggestionsEnabled: true,
        personalizedSearchEnabled: true
      },
      streaming: {
        defaultQuality: 'AUTO',
        autoQuality: true,
        preloadNext: false,
        dataSaver: false
      },
      notifications: {
        email: false,
        push: true,
        inApp: true,
        digest: 'NEVER'
      },
      privacy: {
        defaultVisibility: 'PUBLIC',
        indexable: true,
        showOnlineStatus: false
      },
      reblogFilters: [
        { key: 'filter1', enabled: true }
      ]
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
      actorId: 'user123'
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

describe('convertGraphQLPushSubscription', () => {
  it('should convert valid push subscription data', () => {
    const data = {
      id: 'sub123',
      endpoint: 'https://push.example.com/subscription',
      keys: {
        auth: 'auth_key_here',
        p256dh: 'p256dh_key_here'
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
        adminReport: false
      },
      policy: 'all',
      serverKey: 'server_vapid_key',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
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
        p256dh: 'p256dh_key'
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
        adminReport: true
      },
      policy: 'all'
    };

    const result = convertGraphQLPushSubscription(data);

    expect(result).not.toBeNull();
    expect(result?.serverKey).toBeUndefined();
    expect(result?.createdAt).toBeUndefined();
    expect(result?.updatedAt).toBeUndefined();
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
});
