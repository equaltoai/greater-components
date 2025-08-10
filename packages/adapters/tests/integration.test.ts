/**
 * Integration tests for the @greater/adapters package
 * Verifies that all exports work correctly together
 */

import { describe, it, expect } from 'vitest';
import {
  // Mappers
  mapMastodonAccount,
  mapMastodonStatus,
  mapLesserAccount,
  mapLesserPost,
  MapperUtils,
  
  // Streaming
  StreamingOperationsManager,
  
  // Transport (existing)
  TransportManager,
  
  // Types work correctly
  type UnifiedAccount,
  type UnifiedStatus,
  type MastodonAccount,
  type LesserAccountFragment,
} from '../src/index.js';

// Import fixtures
import { mastodonAccountFixtures, mastodonStatusFixtures } from '../src/fixtures/mastodon.js';
import { lesserAccountFixtures, lesserPostFixtures } from '../src/fixtures/lesser.js';

describe('Package Integration', () => {
  it('should export all mapper functions', () => {
    expect(typeof mapMastodonAccount).toBe('function');
    expect(typeof mapMastodonStatus).toBe('function');
    expect(typeof mapLesserAccount).toBe('function');
    expect(typeof mapLesserPost).toBe('function');
  });

  it('should export streaming operations manager', () => {
    expect(typeof StreamingOperationsManager).toBe('function');
  });

  it('should export transport manager', () => {
    expect(typeof TransportManager).toBe('function');
  });

  it('should export mapper utilities', () => {
    expect(typeof MapperUtils).toBe('object');
    expect(typeof MapperUtils.createError).toBe('function');
    expect(typeof MapperUtils.safeExtract.string).toBe('function');
    expect(typeof MapperUtils.validateRequired).toBe('function');
    expect(typeof MapperUtils.createMetadata).toBe('function');
  });

  it('should successfully map Mastodon account to unified model', () => {
    const mastodonAccount = mastodonAccountFixtures[0]!;
    const result = mapMastodonAccount(mastodonAccount);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.metadata.source).toBe('mastodon');
  });

  it('should successfully map Lesser account to unified model', () => {
    const lesserAccount = lesserAccountFixtures[0]!;
    const result = mapLesserAccount(lesserAccount);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.metadata.source).toBe('lesser');
  });

  it('should create consistent unified models from different sources', () => {
    const mastodonAccount = mastodonAccountFixtures[0]!;
    const lesserAccount = lesserAccountFixtures[0]!;

    const mastodonResult = mapMastodonAccount(mastodonAccount);
    const lesserResult = mapLesserAccount(lesserAccount);

    expect(mastodonResult.success).toBe(true);
    expect(lesserResult.success).toBe(true);

    // Both should have the same unified structure
    const mastodonUnified = mastodonResult.data!;
    const lesserUnified = lesserResult.data!;

    // Check that both have the same required fields
    expect(typeof mastodonUnified.id).toBe('string');
    expect(typeof mastodonUnified.username).toBe('string');
    expect(typeof mastodonUnified.displayName).toBe('string');
    expect(typeof mastodonUnified.followersCount).toBe('number');

    expect(typeof lesserUnified.id).toBe('string');
    expect(typeof lesserUnified.username).toBe('string');
    expect(typeof lesserUnified.displayName).toBe('string');
    expect(typeof lesserUnified.followersCount).toBe('number');

    // Both should have metadata but from different sources
    expect(mastodonUnified.metadata.source).toBe('mastodon');
    expect(lesserUnified.metadata.source).toBe('lesser');
  });

  it('should handle post/status mapping from both sources', () => {
    const mastodonStatus = mastodonStatusFixtures[0]!;
    const lesserPost = lesserPostFixtures[0]!;

    const mastodonResult = mapMastodonStatus(mastodonStatus);
    const lesserResult = mapLesserPost(lesserPost);

    expect(mastodonResult.success).toBe(true);
    expect(lesserResult.success).toBe(true);

    const mastodonUnified = mastodonResult.data!;
    const lesserUnified = lesserResult.data!;

    // Both should have unified structure
    expect(typeof mastodonUnified.id).toBe('string');
    expect(typeof mastodonUnified.content).toBe('string');
    expect(typeof mastodonUnified.account).toBe('object');
    expect(Array.isArray(mastodonUnified.mediaAttachments)).toBe(true);

    expect(typeof lesserUnified.id).toBe('string');
    expect(typeof lesserUnified.content).toBe('string');
    expect(typeof lesserUnified.account).toBe('object');
    expect(Array.isArray(lesserUnified.mediaAttachments)).toBe(true);
  });

  it('should use mapper utilities correctly', () => {
    const testPayload = { id: '123', name: 'test', active: true, count: 42 };
    
    // Test safe extraction
    expect(MapperUtils.safeExtract.string(testPayload.name)).toBe('test');
    expect(MapperUtils.safeExtract.string(undefined)).toBe('');
    expect(MapperUtils.safeExtract.number(testPayload.count)).toBe(42);
    expect(MapperUtils.safeExtract.boolean(testPayload.active)).toBe(true);
    
    // Test validation
    const validation = MapperUtils.validateRequired(testPayload, ['id', 'name']);
    expect(validation.valid).toBe(true);
    expect(validation.missing).toEqual([]);
    
    const invalidValidation = MapperUtils.validateRequired(testPayload, ['id', 'missing_field']);
    expect(invalidValidation.valid).toBe(false);
    expect(invalidValidation.missing).toContain('missing_field');
    
    // Test metadata creation
    const metadata = MapperUtils.createMetadata('mastodon', 'v1', testPayload);
    expect(metadata.source).toBe('mastodon');
    expect(metadata.apiVersion).toBe('v1');
    expect(metadata.rawPayload).toBe(testPayload);
    expect(typeof metadata.lastUpdated).toBe('number');
  });

  it('should create and configure streaming operations manager', () => {
    // Create a mock transport manager
    const mockTransport = {
      connect: () => {},
      disconnect: () => {},
      on: () => () => {},
      off: () => {},
      getState: () => ({
        status: 'disconnected' as const,
        activeTransport: null,
        failureCount: 0,
        canFallback: false,
        reconnectAttempts: 0,
        latency: null,
        error: null,
        lastEventId: null,
        transportPriority: ['websocket' as const, 'sse' as const, 'polling' as const]
      }),
      destroy: () => {}
    };

    const streamingManager = new StreamingOperationsManager({
      transportManager: mockTransport,
      debounceMs: 100,
      maxQueueSize: 50,
      enableDeduplication: true,
      deduplicationWindowMs: 1000
    });

    expect(streamingManager).toBeDefined();
    
    const state = streamingManager.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.activeStreams.size).toBe(0);

    streamingManager.destroy();
  });

  it('should handle error cases gracefully', () => {
    // Test error creation utility
    const error = MapperUtils.createError(
      'validation',
      'Test error message',
      { invalid: 'payload' },
      'test.field',
      { api: 'test', version: 'v1' }
    );

    expect(error.type).toBe('validation');
    expect(error.message).toBe('Test error message');
    expect(error.payload).toEqual({ invalid: 'payload' });
    expect(error.fieldPath).toBe('test.field');
    expect(error.source?.api).toBe('test');
    expect(error.source?.version).toBe('v1');

    // Test mapper error handling
    const invalidMastodonAccount = { invalid: 'data' };
    const result = mapMastodonAccount(invalidMastodonAccount as any);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.type).toBe('validation');
  });
});

describe('Type Safety', () => {
  it('should enforce type safety at compile time', () => {
    // This test mainly verifies that TypeScript compilation succeeds
    // with proper type checking for the unified models
    
    const testUnifiedAccount: UnifiedAccount = {
      id: 'test_123',
      username: 'testuser',
      acct: 'testuser@example.com',
      displayName: 'Test User',
      note: 'Test bio',
      avatar: 'https://example.com/avatar.jpg',
      header: 'https://example.com/header.jpg',
      createdAt: '2023-12-15T10:00:00.000Z',
      followersCount: 100,
      followingCount: 50,
      statusesCount: 25,
      locked: false,
      verified: false,
      bot: false,
      fields: [],
      metadata: {
        source: 'mastodon',
        apiVersion: 'v1',
        lastUpdated: Date.now()
      }
    };

    expect(testUnifiedAccount.metadata.source).toBe('mastodon');
    expect(typeof testUnifiedAccount.followersCount).toBe('number');
  });
});