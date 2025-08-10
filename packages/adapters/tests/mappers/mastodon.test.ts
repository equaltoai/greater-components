/**
 * Unit tests for Mastodon API mappers
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  mapMastodonAccount,
  mapMastodonStatus,
  mapMastodonNotification,
  mapMastodonStreamingEvent,
  batchMapMastodonAccounts,
  batchMapMastodonStatuses,
  batchMapMastodonNotifications
} from '../../src/mappers/mastodon/mappers.js';
import {
  mastodonAccountFixtures,
  mastodonStatusFixtures,
  mastodonNotificationFixtures,
  mastodonRelationshipFixtures,
  mastodonStreamingEventFixtures,
  mastodonErrorFixtures,
  mastodonBatchFixtures
} from '../../src/fixtures/mastodon.js';

describe('Mastodon Account Mapper', () => {
  it('should map valid account successfully', () => {
    const account = mastodonAccountFixtures[0];
    const result = mapMastodonAccount(account);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(account.id);
    expect(result.data?.username).toBe(account.username);
    expect(result.data?.acct).toBe(account.acct);
    expect(result.data?.displayName).toBe(account.display_name);
    expect(result.data?.followersCount).toBe(account.followers_count);
    expect(result.data?.verified).toBe(account.verified);
    expect(result.data?.bot).toBe(account.bot);
    expect(result.data?.metadata.source).toBe('mastodon');
    expect(result.data?.metadata.apiVersion).toBe('v1');
  });

  it('should map account with relationship', () => {
    const account = mastodonAccountFixtures[0];
    const relationship = mastodonRelationshipFixtures[0];
    const result = mapMastodonAccount(account, relationship);

    expect(result.success).toBe(true);
    expect(result.data?.relationship).toBeDefined();
    expect(result.data?.relationship?.following).toBe(relationship.following);
    expect(result.data?.relationship?.followedBy).toBe(relationship.followed_by);
    expect(result.data?.relationship?.endorsed).toBe(relationship.endorsed);
  });

  it('should handle account with empty fields gracefully', () => {
    const account = mastodonAccountFixtures[1];
    const result = mapMastodonAccount(account);

    expect(result.success).toBe(true);
    expect(result.data?.fields).toEqual([]);
    expect(result.data?.verified).toBe(false);
    expect(result.data?.bot).toBe(true); // This account is a bot
  });

  it('should fail with invalid account ID', () => {
    const invalidAccount = { ...mastodonAccountFixtures[0], id: null as any };
    const result = mapMastodonAccount(invalidAccount);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('Invalid account');
  });

  it('should fail with missing account data', () => {
    const result = mapMastodonAccount(null as any);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should provide performance metrics', () => {
    const account = mastodonAccountFixtures[0];
    const result = mapMastodonAccount(account);

    expect(result.success).toBe(true);
    expect(result.metrics).toBeDefined();
    expect(result.metrics?.mappingTimeMs).toBeGreaterThan(0);
    expect(result.metrics?.fieldsProcessed).toBeGreaterThan(0);
  });
});

describe('Mastodon Status Mapper', () => {
  it('should map basic status successfully', () => {
    const status = mastodonStatusFixtures[0];
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(status.id);
    expect(result.data?.content).toBe(status.content);
    expect(result.data?.visibility).toBe(status.visibility);
    expect(result.data?.account.id).toBe(status.account.id);
    expect(result.data?.repliesCount).toBe(status.replies_count);
    expect(result.data?.favourited).toBe(status.favourited);
    expect(result.data?.metadata.source).toBe('mastodon');
  });

  it('should map status with media attachments', () => {
    const status = mastodonStatusFixtures[0];
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data?.mediaAttachments).toBeDefined();
    expect(result.data?.mediaAttachments.length).toBe(status.media_attachments.length);
    
    const firstMedia = result.data?.mediaAttachments[0];
    const originalMedia = status.media_attachments[0];
    expect(firstMedia?.id).toBe(originalMedia.id);
    expect(firstMedia?.type).toBe(originalMedia.type);
    expect(firstMedia?.description).toBe(originalMedia.description);
  });

  it('should map status with poll', () => {
    const status = mastodonStatusFixtures[0];
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data?.poll).toBeDefined();
    expect(result.data?.poll?.id).toBe(status.poll?.id);
    expect(result.data?.poll?.expired).toBe(status.poll?.expired);
    expect(result.data?.poll?.options.length).toBe(status.poll?.options.length);
  });

  it('should map reply status with parent info', () => {
    const status = mastodonStatusFixtures[1]; // This is a reply
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data?.inReplyTo).toBeDefined();
    expect(result.data?.inReplyTo?.id).toBe(status.in_reply_to_id);
    expect(result.data?.inReplyTo?.accountId).toBe(status.in_reply_to_account_id);
  });

  it('should map status with sensitive content', () => {
    const status = mastodonStatusFixtures[2]; // This has sensitive content
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data?.sensitive).toBe(true);
    expect(result.data?.spoilerText).toBeDefined();
    expect(result.data?.editedAt).toBeDefined();
  });

  it('should handle status with mentions and tags', () => {
    const status = mastodonStatusFixtures[1];
    const result = mapMastodonStatus(status);

    expect(result.success).toBe(true);
    expect(result.data?.mentions.length).toBeGreaterThan(0);
    expect(result.data?.mentions[0].username).toBe(status.mentions[0].username);
    
    // First status has tags
    const statusWithTags = mastodonStatusFixtures[0];
    const resultWithTags = mapMastodonStatus(statusWithTags);
    expect(resultWithTags.data?.tags.length).toBeGreaterThan(0);
  });

  it('should fail with invalid status ID', () => {
    const invalidStatus = { ...mastodonStatusFixtures[0], id: null as any };
    const result = mapMastodonStatus(invalidStatus);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should fail with missing account', () => {
    const invalidStatus = { ...mastodonStatusFixtures[0], account: null as any };
    const result = mapMastodonStatus(invalidStatus);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('missing account');
  });
});

describe('Mastodon Notification Mapper', () => {
  it('should map favourite notification', () => {
    const notification = mastodonNotificationFixtures[0]; // favourite
    const result = mapMastodonNotification(notification);

    expect(result.success).toBe(true);
    expect(result.data?.type).toBe('favourite');
    expect(result.data?.account.id).toBe(notification.account.id);
    expect(result.data?.status?.id).toBe(notification.status?.id);
  });

  it('should map follow notification without status', () => {
    const notification = mastodonNotificationFixtures[3]; // follow
    const result = mapMastodonNotification(notification);

    expect(result.success).toBe(true);
    expect(result.data?.type).toBe('follow');
    expect(result.data?.status).toBeUndefined();
    expect(result.data?.account.id).toBe(notification.account.id);
  });

  it('should map all notification types', () => {
    const types = ['favourite', 'reblog', 'mention', 'follow', 'poll'];
    
    types.forEach((type, index) => {
      const notification = mastodonNotificationFixtures[index];
      const result = mapMastodonNotification(notification);
      
      expect(result.success).toBe(true);
      expect(result.data?.type).toBe(type);
    });
  });

  it('should fail with invalid notification', () => {
    const invalidNotification = { ...mastodonNotificationFixtures[0], id: null as any };
    const result = mapMastodonNotification(invalidNotification);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should fail with missing account', () => {
    const invalidNotification = { ...mastodonNotificationFixtures[0], account: null as any };
    const result = mapMastodonNotification(invalidNotification);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });
});

describe('Mastodon Streaming Event Mapper', () => {
  it('should map update event', () => {
    const event = mastodonStreamingEventFixtures[0]; // update
    const result = mapMastodonStreamingEvent(event);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('editType' in result.data!) {
      expect(result.data.editType).toBe('content');
      expect(result.data.id).toBeDefined();
    }
  });

  it('should map delete event', () => {
    const event = mastodonStreamingEventFixtures[3]; // delete
    const result = mapMastodonStreamingEvent(event);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('itemType' in result.data!) {
      expect(result.data.itemType).toBe('status');
      expect(result.data.id).toBe(event.payload);
    }
  });

  it('should map notification event', () => {
    const event = mastodonStreamingEventFixtures[1]; // notification
    const result = mapMastodonStreamingEvent(event);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    if ('type' in result.data!) {
      expect(result.data.type).toBe('notification');
    }
  });

  it('should fail with invalid event type', () => {
    const invalidEvent = { ...mastodonStreamingEventFixtures[0], event: null as any };
    const result = mapMastodonStreamingEvent(invalidEvent);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
  });

  it('should fail with malformed JSON payload', () => {
    const invalidEvent = {
      stream: ["user"],
      event: "update",
      payload: "invalid json {{"
    };
    const result = mapMastodonStreamingEvent(invalidEvent);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.message).toContain('not valid JSON');
  });
});

describe('Mastodon Batch Mappers', () => {
  it('should batch map accounts successfully', () => {
    const accounts = mastodonAccountFixtures;
    const relationships = new Map();
    relationships.set(accounts[0].id, mastodonRelationshipFixtures[0]);
    
    const result = batchMapMastodonAccounts(accounts, relationships);

    expect(result.successful.length).toBe(accounts.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(accounts.length);
    expect(result.processingTimeMs).toBeGreaterThan(0);
    
    // Check relationship was mapped
    const accountWithRelationship = result.successful.find(acc => acc.id === accounts[0].id);
    expect(accountWithRelationship?.relationship).toBeDefined();
  });

  it('should batch map statuses successfully', () => {
    const statuses = mastodonStatusFixtures;
    const result = batchMapMastodonStatuses(statuses);

    expect(result.successful.length).toBe(statuses.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(statuses.length);
  });

  it('should batch map notifications successfully', () => {
    const notifications = mastodonNotificationFixtures;
    const result = batchMapMastodonNotifications(notifications);

    expect(result.successful.length).toBe(notifications.length);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(notifications.length);
  });

  it('should handle mixed valid and invalid data', () => {
    const mixedAccounts = [
      mastodonAccountFixtures[0],
      { id: null, username: "invalid" }, // Invalid
      mastodonAccountFixtures[1],
      null // Invalid
    ];
    
    const result = batchMapMastodonAccounts(mixedAccounts as any);

    expect(result.successful.length).toBe(2); // Only valid accounts
    expect(result.failed.length).toBe(2); // Invalid accounts
    expect(result.totalProcessed).toBe(4);
    
    // Check that error details are provided
    expect(result.failed[0].error).toBeDefined();
    expect(result.failed[0].payload).toBeDefined();
  });

  it('should handle empty arrays', () => {
    const result = batchMapMastodonAccounts([]);
    
    expect(result.successful.length).toBe(0);
    expect(result.failed.length).toBe(0);
    expect(result.totalProcessed).toBe(0);
  });
});

describe('Error Handling', () => {
  it('should provide detailed error information', () => {
    const result = mapMastodonAccount(mastodonErrorFixtures.invalidAccount as any);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('validation');
    expect(result.error?.payload).toBeDefined();
    expect(result.error?.source?.api).toBe('mastodon');
    expect(result.error?.source?.version).toBe('v1');
  });

  it('should handle transformation errors', () => {
    const circularRef: any = { id: "test" };
    circularRef.self = circularRef;
    
    // This should not cause the mapper to crash
    const result = mapMastodonAccount(circularRef);
    
    // May succeed or fail, but should not throw
    expect(typeof result.success).toBe('boolean');
  });

  it('should preserve original payload in errors', () => {
    const invalidData = mastodonErrorFixtures.invalidAccount;
    const result = mapMastodonAccount(invalidData as any);

    expect(result.success).toBe(false);
    expect(result.error?.payload).toEqual(invalidData);
  });
});

describe('Performance and Memory', () => {
  it('should handle large batch operations efficiently', () => {
    // Create a large array of accounts
    const largeAccountArray = Array(1000).fill(null).map((_, i) => ({
      ...mastodonAccountFixtures[0],
      id: `account_${i}`,
      username: `user_${i}`
    }));

    const startTime = performance.now();
    const result = batchMapMastodonAccounts(largeAccountArray);
    const endTime = performance.now();

    expect(result.successful.length).toBe(1000);
    expect(result.failed.length).toBe(0);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
  });

  it('should not leak memory during mapping', () => {
    // This is a basic test - in a real scenario you'd use more sophisticated memory monitoring
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Perform many mapping operations
    for (let i = 0; i < 100; i++) {
      mapMastodonAccount(mastodonAccountFixtures[0]);
      mapMastodonStatus(mastodonStatusFixtures[0]);
      mapMastodonNotification(mastodonNotificationFixtures[0]);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;
    
    // Memory growth should be reasonable (less than 10MB for this test)
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
  });
});

describe('Edge Cases', () => {
  it('should handle undefined optional fields', () => {
    const minimalAccount = {
      id: "test_123",
      username: "test",
      acct: "test@example.com",
      display_name: "Test User",
      locked: false,
      bot: false,
      group: false,
      created_at: "2023-12-15T10:00:00.000Z",
      note: "",
      url: "https://example.com/@test",
      avatar: "https://example.com/avatar.jpg",
      avatar_static: "https://example.com/avatar.jpg",
      header: "https://example.com/header.jpg",
      header_static: "https://example.com/header.jpg",
      followers_count: 0,
      following_count: 0,
      statuses_count: 0
    };

    const result = mapMastodonAccount(minimalAccount);
    expect(result.success).toBe(true);
    expect(result.data?.fields).toEqual([]);
    expect(result.data?.verified).toBe(false);
  });

  it('should handle extreme numeric values', () => {
    const accountWithExtremeValues = {
      ...mastodonAccountFixtures[0],
      followers_count: Number.MAX_SAFE_INTEGER,
      following_count: -1, // Invalid but should be handled
      statuses_count: 0
    };

    const result = mapMastodonAccount(accountWithExtremeValues);
    expect(result.success).toBe(true);
    expect(result.data?.followersCount).toBe(Number.MAX_SAFE_INTEGER);
    expect(result.data?.followingCount).toBe(-1); // Should preserve the value
  });

  it('should handle very long text content', () => {
    const longContent = "A".repeat(10000);
    const statusWithLongContent = {
      ...mastodonStatusFixtures[0],
      content: longContent
    };

    const result = mapMastodonStatus(statusWithLongContent);
    expect(result.success).toBe(true);
    expect(result.data?.content).toBe(longContent);
  });
});