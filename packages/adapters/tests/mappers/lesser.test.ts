/**
 * Unit tests for Lesser GraphQL API mappers
 */

import { describe, it, expect } from 'vitest';
import {
  mapLesserAccount,
  mapLesserPost,
  mapLesserNotification,
  mapLesserStreamingUpdate,
  handleLesserGraphQLResponse,
  mapLesserTimelineConnection,
  batchMapLesserAccounts,
  batchMapLesserPosts,
  batchMapLesserNotifications
} from '../../src/mappers/lesser/mappers.js';
import {
  lesserAccountFixtures,
  lesserPostFixtures,
  lesserNotificationFixtures,
  lesserRelationshipFixtures,
  lesserStreamingUpdateFixtures,
  lesserGraphQLResponseFixtures,
  lesserTimelineConnectionFixture,
  lesserErrorFixtures,
  lesserBatchFixtures
} from '../../src/fixtures/lesser.js';

describe('Lesser Account Mapper', () => {
  it('should map valid account successfully', () => {
    const account = lesserAccountFixtures[0];
    const result = mapLesserAccount(account);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(account.id);
    expect(result.data?.username).toBe(account.localHandle);
    expect(result.data?.acct).toBe(account.handle);
    expect(result.data?.displayName).toBe(account.displayName);
    expect(result.data?.followersCount).toBe(account.followerCount);
    expect(result.data?.verified).toBe(account.isVerified);
    expect(result.data?.bot).toBe(account.isBot);
    expect(result.data?.metadata.source).toBe('lesser');
    expect(result.data?.metadata.apiVersion).toBe('graphql-v1');
  });

  it('should map account with relationship', () => {
    const account = lesserAccountFixtures[0];
    const relationship = lesserRelationshipFixtures[0];
    const result = mapLesserAccount(account, relationship);

    expect(result.success).toBe(true);
    expect(result.data?.relationship).toBeDefined();
    expect(result.data?.relationship?.following).toBe(relationship.isFollowing);
    expect(result.data?.relationship?.followedBy).toBe(relationship.isFollowedBy);
    expect(result.data?.relationship?.endorsed).toBe(relationship.isEndorsed);
    expect(result.data?.relationship?.note).toBe(relationship.personalNote);
  });

  it('should handle bot account', () => {
    const account = lesserAccountFixtures[1]; // This is a bot
    const result = mapLesserAccount(account);

    expect(result.success).toBe(true);
    expect(result.data?.bot).toBe(true);
    expect(result.data?.verified).toBe(false);
  });

  it('should map profile fields correctly', () => {
    const account = lesserAccountFixtures[0];
    const result = mapLesserAccount(account);

    expect(result.success).toBe(true);
    expect(result.data?.fields.length).toBe(account.profileFields.length);
    expect(result.data?.fields[0].name).toBe(account.profileFields[0].label);
    expect(result.data?.fields[0].value).toBe(account.profileFields[0].content);
    expect(result.data?.fields[0].verifiedAt).toBe(account.profileFields[0].verifiedAt);
  });

  it('should extract username from handle correctly', () => {
    const account = lesserAccountFixtures[0];
    const result = mapLesserAccount(account);

    expect(result.success).toBe(true);
    // Should extract "bob" from "bob@lesser.network"
    expect(result.data?.username).toBe("bob");
    expect(result.data?.acct).toBe("bob@lesser.network");
  });

  it('should fail with invalid account ID', () => {
    const invalidAccount = { ...lesserAccountFixtures[0], id: null as any };
    const result = mapLesserAccount(invalidAccount);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('Invalid account');
  });

  it('should handle account with minimal data', () => {
    const minimalAccount = {
      id: "acc_minimal",
      handle: "minimal@test.com",
      localHandle: "minimal",
      displayName: "",
      bio: "",
      avatarUrl: "",
      bannerUrl: "",
      joinedAt: "2023-01-01T00:00:00.000Z",
      isVerified: false,
      isBot: false,
      isLocked: false,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      profileFields: [],
      customEmojis: []
    };

    const result = mapLesserAccount(minimalAccount);
    expect(result.success).toBe(true);
    expect(result.data?.fields).toEqual([]);
  });
});

describe('Lesser Post Mapper', () => {
  it('should map basic post successfully', () => {
    const post = lesserPostFixtures[0];
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(post.id);
    expect(result.data?.content).toBe(post.content);
    expect(result.data?.visibility).toBe('public'); // PUBLIC -> public
    expect(result.data?.account.id).toBe(post.author.id);
    expect(result.data?.repliesCount).toBe(post.interactionCounts.replies);
    expect(result.data?.favourited).toBe(post.userInteractions.isFavorited);
    expect(result.data?.metadata.source).toBe('lesser');
  });

  it('should map visibility correctly', () => {
    const testCases = [
      { lesser: 'PUBLIC', unified: 'public' },
      { lesser: 'UNLISTED', unified: 'unlisted' },
      { lesser: 'FOLLOWERS', unified: 'private' },
      { lesser: 'DIRECT', unified: 'direct' }
    ];

    testCases.forEach(({ lesser, unified }) => {
      const post = { ...lesserPostFixtures[0], visibility: lesser as any };
      const result = mapLesserPost(post);
      expect(result.success).toBe(true);
      expect(result.data?.visibility).toBe(unified);
    });
  });

  it('should map post with media attachments', () => {
    const post = lesserPostFixtures[0]; // Has media
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.mediaAttachments.length).toBe(post.attachments.length);
    
    const firstMedia = result.data?.mediaAttachments[0];
    const originalMedia = post.attachments[0];
    expect(firstMedia?.id).toBe(originalMedia.id);
    expect(firstMedia?.type).toBe('image'); // IMAGE -> image
    expect(firstMedia?.description).toBe(originalMedia.altText);
  });

  it('should map media types correctly', () => {
    const testCases = [
      { lesser: 'IMAGE', unified: 'image' },
      { lesser: 'VIDEO', unified: 'video' },
      { lesser: 'AUDIO', unified: 'audio' },
      { lesser: 'GIF', unified: 'gifv' },
      { lesser: 'UNKNOWN', unified: 'unknown' }
    ];

    testCases.forEach(({ lesser, unified }) => {
      const media = { ...lesserPostFixtures[0].attachments[0], mediaType: lesser as any };
      const post = { ...lesserPostFixtures[0], attachments: [media] };
      const result = mapLesserPost(post);
      
      expect(result.success).toBe(true);
      expect(result.data?.mediaAttachments[0]?.type).toBe(unified);
    });
  });

  it('should map post with poll', () => {
    const post = lesserPostFixtures[0]; // Has poll
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.poll).toBeDefined();
    expect(result.data?.poll?.id).toBe(post.poll?.id);
    expect(result.data?.poll?.expired).toBe(post.poll?.isExpired);
    expect(result.data?.poll?.multiple).toBe(post.poll?.allowsMultiple);
    expect(result.data?.poll?.voted).toBe(true); // Has userVote
    expect(result.data?.poll?.ownVotes).toEqual(post.poll?.userVote?.choices);
  });

  it('should map reply post with parent info', () => {
    const post = lesserPostFixtures[2]; // This is a reply
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.inReplyTo).toBeDefined();
    expect(result.data?.inReplyTo?.id).toBe(post.replyTo?.id);
    expect(result.data?.inReplyTo?.accountId).toBe(post.replyTo?.authorId);
  });

  it('should map post with content warning', () => {
    const post = lesserPostFixtures[3]; // This has content warning
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.sensitive).toBe(true);
    expect(result.data?.spoilerText).toBe(post.contentWarning);
    expect(result.data?.visibility).toBe('private'); // FOLLOWERS -> private
  });

  it('should map edited post', () => {
    const post = lesserPostFixtures[2]; // This has lastEditedAt
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.editedAt).toBe(post.lastEditedAt);
  });

  it('should handle mentions and hashtags', () => {
    const post = lesserPostFixtures[3]; // Has mentions and hashtags
    const result = mapLesserPost(post);

    expect(result.success).toBe(true);
    expect(result.data?.mentions.length).toBe(post.mentions.length);
    expect(result.data?.tags.length).toBe(post.hashtags.length);
    
    // Check mention mapping
    const firstMention = result.data?.mentions[0];
    const originalMention = post.mentions[0];
    expect(firstMention?.id).toBe(originalMention.account.id);
    expect(firstMention?.acct).toBe(originalMention.account.handle);
    
    // Check hashtag mapping
    const firstTag = result.data?.tags[0];
    const originalTag = post.hashtags[0];
    expect(firstTag?.name).toBe(originalTag.name);
    expect(firstTag?.url).toBe(originalTag.url);
  });

  it('should fail with invalid post ID', () => {
    const invalidPost = { ...lesserPostFixtures[0], id: null as any };
    const result = mapLesserPost(invalidPost);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should fail with missing author', () => {
    const invalidPost = { ...lesserPostFixtures[0], author: null as any };
    const result = mapLesserPost(invalidPost);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('missing author');
  });
});

describe('Lesser Notification Mapper', () => {
  it('should map different notification types', () => {
    const typeMapping = [
      { lesser: 'FAVORITE', unified: 'favourite' },
      { lesser: 'SHARE', unified: 'reblog' },
      { lesser: 'MENTION', unified: 'mention' },
      { lesser: 'FOLLOW', unified: 'follow' },
      { lesser: 'POLL_ENDED', unified: 'poll' }
    ];

    typeMapping.forEach(({ lesser, unified }, index) => {
      const notification = lesserNotificationFixtures[index];
      const result = mapLesserNotification(notification);
      
      expect(result.success).toBe(true);
      expect(result.data?.type).toBe(unified);
    });
  });

  it('should map notification with target post', () => {
    const notification = lesserNotificationFixtures[0]; // FAVORITE with target post
    const result = mapLesserNotification(notification);

    expect(result.success).toBe(true);
    expect(result.data?.status).toBeDefined();
    expect(result.data?.status?.id).toBe(notification.targetPost?.id);
  });

  it('should map notification without target post', () => {
    const notification = lesserNotificationFixtures[3]; // FOLLOW without target post
    const result = mapLesserNotification(notification);

    expect(result.success).toBe(true);
    expect(result.data?.status).toBeUndefined();
  });

  it('should map read status', () => {
    const readNotification = lesserNotificationFixtures[2]; // This is read
    const unreadNotification = lesserNotificationFixtures[0]; // This is unread
    
    const readResult = mapLesserNotification(readNotification);
    const unreadResult = mapLesserNotification(unreadNotification);

    expect(readResult.success).toBe(true);
    expect(readResult.data?.read).toBe(true);
    
    expect(unreadResult.success).toBe(true);
    expect(unreadResult.data?.read).toBe(false);
  });

  it('should fail with invalid notification ID', () => {
    const invalidNotification = { ...lesserNotificationFixtures[0], id: null as any };
    const result = mapLesserNotification(invalidNotification);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should fail with missing trigger account', () => {
    const invalidNotification = { ...lesserNotificationFixtures[0], triggerAccount: null as any };
    const result = mapLesserNotification(invalidNotification);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('missing trigger account');
  });
});

describe('Lesser Streaming Update Mapper', () => {
  it('should map POST_CREATED event', () => {
    const update = lesserStreamingUpdateFixtures[0]; // POST_CREATED
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('type' in result.data!) {
      expect(result.data.type).toBe('status');
    }
  });

  it('should map POST_DELETED event', () => {
    const update = lesserStreamingUpdateFixtures[3]; // POST_DELETED
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('itemType' in result.data!) {
      expect(result.data.itemType).toBe('status');
      expect(result.data.id).toBe('post_deleted_example_123');
    }
  });

  it('should map POST_UPDATED event', () => {
    const update = lesserStreamingUpdateFixtures[2]; // POST_UPDATED
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('editType' in result.data!) {
      expect(result.data.editType).toBe('content');
    }
  });

  it('should map NOTIFICATION_CREATED event', () => {
    const update = lesserStreamingUpdateFixtures[1]; // NOTIFICATION_CREATED
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('type' in result.data!) {
      expect(result.data.type).toBe('notification');
    }
  });

  it('should map ACCOUNT_UPDATED event', () => {
    const update = lesserStreamingUpdateFixtures[4]; // ACCOUNT_UPDATED
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('type' in result.data!) {
      expect(result.data.type).toBe('status'); // Generic mapping
    }
  });

  it('should fail with invalid event type', () => {
    const invalidUpdate = { ...lesserStreamingUpdateFixtures[0], eventType: null as any };
    const result = mapLesserStreamingUpdate(invalidUpdate);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should handle timestamp conversion', () => {
    const update = lesserStreamingUpdateFixtures[0];
    const result = mapLesserStreamingUpdate(update);

    expect(result.success).toBe(true);
    
    if ('timestamp' in result.data!) {
      expect(typeof result.data.timestamp).toBe('number');
      expect(result.data.timestamp).toBeGreaterThan(0);
    }
  });
});

describe('Lesser GraphQL Response Handler', () => {
  it('should handle successful response', () => {
    const response = lesserGraphQLResponseFixtures[0]; // Successful response
    const result = handleLesserGraphQLResponse(response);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.timeline).toBeDefined();
  });

  it('should handle error response', () => {
    const response = lesserGraphQLResponseFixtures[1]; // Error response
    const result = handleLesserGraphQLResponse(response);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('GraphQL response contains errors');
  });

  it('should handle response without data', () => {
    const response = { errors: [] }; // No data field
    const result = handleLesserGraphQLResponse(response);

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('missing data');
  });

  it('should include GraphQL errors in error message', () => {
    const response = lesserGraphQLResponseFixtures[1]; // Has errors
    const result = handleLesserGraphQLResponse(response);

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Authentication required');
  });
});

describe('Lesser Timeline Connection Mapper', () => {
  it('should map timeline connection successfully', () => {
    const connection = lesserTimelineConnectionFixture;
    const result = mapLesserTimelineConnection(connection);

    expect(result.successful.length).toBe(connection.edges.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(connection.edges.length);
    expect(result.processingTimeMs).toBeGreaterThan(0);
  });

  it('should handle connection without edges', () => {
    const emptyConnection = {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
    
    const result = mapLesserTimelineConnection(emptyConnection);
    expect(result.successful.length).toBe(0);
    expect(result.totalProcessed).toBe(0);
  });

  it('should handle connection with invalid edges', () => {
    const connectionWithInvalidEdges = {
      edges: [
        { node: lesserPostFixtures[0], cursor: "valid" },
        { node: null, cursor: "invalid" }, // Invalid node
        { node: lesserPostFixtures[1], cursor: "valid2" }
      ],
      pageInfo: { hasNextPage: false, hasPreviousPage: false }
    };

    const result = mapLesserTimelineConnection(connectionWithInvalidEdges as any);
    expect(result.successful.length).toBe(2); // Only valid nodes
    expect(result.totalProcessed).toBe(3); // All edges processed
  });
});

describe('Lesser Batch Mappers', () => {
  it('should batch map accounts successfully', () => {
    const accounts = lesserAccountFixtures;
    const relationships = new Map();
    relationships.set(accounts[0].id, lesserRelationshipFixtures[0]);
    
    const result = batchMapLesserAccounts(accounts, relationships);

    expect(result.successful.length).toBe(accounts.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(accounts.length);
    expect(result.processingTimeMs).toBeGreaterThan(0);
  });

  it('should batch map posts successfully', () => {
    const posts = lesserPostFixtures;
    const result = batchMapLesserPosts(posts);

    expect(result.successful.length).toBe(posts.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(posts.length);
  });

  it('should batch map notifications successfully', () => {
    const notifications = lesserNotificationFixtures;
    const result = batchMapLesserNotifications(notifications);

    expect(result.successful.length).toBe(notifications.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(notifications.length);
  });

  it('should handle mixed valid and invalid data', () => {
    const mixedData = [
      lesserAccountFixtures[0],
      { invalid: "data" },
      lesserAccountFixtures[1],
      null
    ];
    
    const result = batchMapLesserAccounts(mixedData as any);

    expect(result.successful.length).toBe(2);
    expect(result.failed.length).toBe(2);
    expect(result.totalProcessed).toBe(4);
  });
});

describe('Performance Tests', () => {
  it('should handle large batches efficiently', () => {
    const largeAccountArray = Array(500).fill(null).map((_, i) => ({
      ...lesserAccountFixtures[0],
      id: `acc_large_${i}`,
      handle: `user_${i}@test.lesser.network`
    }));

    const startTime = performance.now();
    const result = batchMapLesserAccounts(largeAccountArray);
    const endTime = performance.now();

    expect(result.successful.length).toBe(500);
    expect(result.failed.length).toBe(0);
    expect(endTime - startTime).toBeLessThan(500); // Should complete in less than 500ms
  });

  it('should provide accurate performance metrics', () => {
    const account = lesserAccountFixtures[0];
    const result = mapLesserAccount(account);

    expect(result.success).toBe(true);
    expect(result.metrics).toBeDefined();
    expect(result.metrics?.mappingTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.metrics?.fieldsProcessed).toBeGreaterThan(0);
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle extreme string lengths', () => {
    const longBio = "A".repeat(50000);
    const accountWithLongBio = {
      ...lesserAccountFixtures[0],
      bio: longBio
    };

    const result = mapLesserAccount(accountWithLongBio);
    expect(result.success).toBe(true);
    expect(result.data?.note).toBe(longBio);
  });

  it('should handle extreme numeric values', () => {
    const accountWithExtremeValues = {
      ...lesserAccountFixtures[0],
      followerCount: Number.MAX_SAFE_INTEGER,
      followingCount: -100,
      postCount: 0
    };

    const result = mapLesserAccount(accountWithExtremeValues);
    expect(result.success).toBe(true);
    expect(result.data?.followersCount).toBe(Number.MAX_SAFE_INTEGER);
    expect(result.data?.followingCount).toBe(-100);
  });

  it('should handle malformed dates gracefully', () => {
    const postWithBadDate = {
      ...lesserPostFixtures[0],
      publishedAt: "not-a-date"
    };

    const result = mapLesserPost(postWithBadDate);
    expect(result.success).toBe(true);
    expect(result.data?.createdAt).toBe("not-a-date"); // Should preserve as-is
  });

  it('should provide detailed error context', () => {
    const invalidData = lesserErrorFixtures.invalidAccount;
    const result = mapLesserAccount(invalidData as any);

    expect(result.success).toBe(false);
    expect(result.error?.payload).toBeDefined();
    expect(result.error?.source?.api).toBe('lesser');
    expect(result.error?.source?.version).toBe('graphql-v1');
  });

  it('should handle circular references without crashing', () => {
    const circularAccount: any = {
      ...lesserAccountFixtures[0]
    };
    circularAccount.self = circularAccount;

    // Should not throw an error
    const result = mapLesserAccount(circularAccount);
    expect(typeof result.success).toBe('boolean');
  });

  it('should handle null and undefined values consistently', () => {
    const accountWithNulls = {
      ...lesserAccountFixtures[0],
      displayName: null,
      bio: undefined,
      avatarUrl: null,
      bannerUrl: undefined
    };

    const result = mapLesserAccount(accountWithNulls as any);
    expect(result.success).toBe(true);
    expect(result.data?.displayName).toBe('');
    expect(result.data?.note).toBe('');
    expect(result.data?.avatar).toBe('');
    expect(result.data?.header).toBe('');
  });
});