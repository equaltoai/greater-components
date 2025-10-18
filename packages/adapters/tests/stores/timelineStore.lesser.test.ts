/**
 * Timeline Store - Lesser Integration Tests
 * 
 * Tests for Lesser-specific metadata handling in timeline store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTimelineStore } from '../../src/stores/timelineStore.js';
import type { TimelineConfig, TimelineItem, LesserTimelineMetadata } from '../../src/stores/types.js';

describe('TimelineStore - Lesser Integration', () => {
  let mockTransportManager: any;
  let store: ReturnType<typeof createTimelineStore>;

  beforeEach(() => {
    mockTransportManager = {
      on: vi.fn(() => vi.fn()),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    const config: TimelineConfig = {
      transportManager: mockTransportManager,
      itemHeight: 100,
      containerHeight: 500,
      overscan: 5,
    };

    store = createTimelineStore(config);
  });

  describe('Lesser Metadata Handling', () => {
    it('should accept items with Lesser metadata', () => {
      const lesserMetadata: LesserTimelineMetadata = {
        estimatedCost: 1500,
        moderationScore: 0.2,
        hasCommunityNotes: true,
        communityNotesCount: 3,
        isQuote: false,
        quoteCount: 5,
        quoteable: true,
        quotePermission: 'EVERYONE',
        authorTrustScore: 85,
        aiModerationAction: 'NONE',
        aiConfidence: 0.95,
      };

      const itemId = store.addItem({
        type: 'status',
        content: { text: 'Test post with Lesser metadata' },
        metadata: {
          lesser: lesserMetadata,
        },
      });

      const state = store.get();
      const addedItem = state.items.find((item) => item.id === itemId);

      expect(addedItem).toBeDefined();
      expect(addedItem?.metadata?.lesser).toEqual(lesserMetadata);
    });

    it('should preserve Lesser metadata through updates', () => {
      const itemId = store.addItem({
        type: 'status',
        content: { text: 'Original' },
        metadata: {
          lesser: {
            estimatedCost: 1000,
            trustScore: 80,
          },
        },
      });

      store.replaceItem(itemId, {
        content: { text: 'Updated' },
        metadata: {
          lesser: {
            estimatedCost: 1000,
            authorTrustScore: 80,
            quoteCount: 10,
          },
        },
      });

      const state = store.get();
      const item = state.items.find((i) => i.id === itemId);

      expect(item?.content.text).toBe('Updated');
      expect(item?.metadata?.lesser?.quoteCount).toBe(10);
    });
  });

  describe('Lesser-Specific Selectors', () => {
    beforeEach(() => {
      // Add test items with varying Lesser metadata
      store.addItem({
        type: 'status',
        content: { id: '1' },
        metadata: {
          lesser: {
            estimatedCost: 500,
            authorTrustScore: 90,
          },
        },
      });

      store.addItem({
        type: 'status',
        content: { id: '2' },
        metadata: {
          lesser: {
            estimatedCost: 2000,
            authorTrustScore: 45,
          },
        },
      });

      store.addItem({
        type: 'status',
        content: { id: '3' },
        metadata: {
          lesser: {
            hasCommunityNotes: true,
            communityNotesCount: 2,
          },
        },
      });

      store.addItem({
        type: 'status',
        content: { id: '4' },
        metadata: {
          lesser: {
            isQuote: true,
            quoteCount: 3,
          },
        },
      });

      store.addItem({
        type: 'status',
        content: { id: '5' },
        metadata: {
          lesser: {
            aiModerationAction: 'FLAG',
            aiConfidence: 0.85,
          },
        },
      });

      // Item without Lesser metadata
      store.addItem({
        type: 'status',
        content: { id: '6' },
      });
    });

    it('getItemsWithCost() should filter by cost threshold', () => {
      const cheapItems = store.getItemsWithCost(1000);
      expect(cheapItems).toHaveLength(1);
      expect(cheapItems[0].content.id).toBe('1');

      const allWithCost = store.getItemsWithCost();
      expect(allWithCost).toHaveLength(2);
    });

    it('getItemsWithTrustScore() should filter by minimum trust score', () => {
      const highTrust = store.getItemsWithTrustScore(80);
      expect(highTrust).toHaveLength(1);
      expect(highTrust[0].content.id).toBe('1');

      const mediumTrust = store.getItemsWithTrustScore(40);
      expect(mediumTrust).toHaveLength(2);
    });

    it('getItemsWithCommunityNotes() should return only noted items', () => {
      const notedItems = store.getItemsWithCommunityNotes();
      expect(notedItems).toHaveLength(1);
      expect(notedItems[0].content.id).toBe('3');
    });

    it('getQuotePosts() should return only quote posts', () => {
      const quotePosts = store.getQuotePosts();
      expect(quotePosts).toHaveLength(1);
      expect(quotePosts[0].content.id).toBe('4');
    });

    it('getModeratedItems() should filter by moderation action', () => {
      const flaggedItems = store.getModeratedItems('FLAG');
      expect(flaggedItems).toHaveLength(1);
      expect(flaggedItems[0].content.id).toBe('5');

      const allModerated = store.getModeratedItems();
      expect(allModerated).toHaveLength(1);
    });
  });

  describe('Streaming Edits with Lesser Metadata', () => {
    it('should update items with Lesser metadata', () => {
      const itemId = store.addItem({
        type: 'status',
        content: { text: 'Post' },
        metadata: {
          lesser: {
            quoteCount: 0,
          },
        },
      });

      // Use replaceItem for direct updates
      store.replaceItem(itemId, {
        metadata: {
          lesser: {
            quoteCount: 5,
          },
        },
      });

      const state = store.get();
      const item = state.items.find((i) => i.id === itemId);
      expect(item).toBeDefined();
      expect(item?.metadata?.lesser).toBeDefined();
    });

    it('should support adding Lesser metadata to existing items', () => {
      const itemId = store.addItem({
        type: 'status',
        content: { text: 'Post' },
      });

      // Add Lesser metadata via replace
      store.replaceItem(itemId, {
        metadata: {
          lesser: {
            hasCommunityNotes: true,
            communityNotesCount: 1,
          },
        },
      });

      const state = store.get();
      const item = state.items.find((i) => i.id === itemId);
      expect(item?.metadata?.lesser).toBeDefined();
    });
  });

  describe('Data Integrity', () => {
    it('should not break with missing Lesser metadata', () => {
      store.addItem({
        type: 'status',
        content: { text: 'Regular post' },
      });

      expect(() => store.getItemsWithCost()).not.toThrow();
      expect(() => store.getItemsWithTrustScore(50)).not.toThrow();
      expect(() => store.getItemsWithCommunityNotes()).not.toThrow();
    });

    it('should handle partial Lesser metadata', () => {
      store.addItem({
        type: 'status',
        content: { text: 'Partial metadata' },
        metadata: {
          lesser: {
            estimatedCost: 100,
            // Missing other fields
          },
        },
      });

      const costFiltered = store.getItemsWithCost(200);
      expect(costFiltered).toHaveLength(1);

      const trustFiltered = store.getItemsWithTrustScore(50);
      expect(trustFiltered).toHaveLength(0);
    });
  });
});

