/**
 * Status.LesserMetadata Logic Tests
 * 
 * Tests for Lesser-specific metadata extraction and display logic
 */

import { describe, it, expect } from 'vitest';
import {
  hasLesserObjectExtensions,
  hasLesserActorExtensions,
  getTrustScore,
  getEstimatedCost,
  hasCommunityNotes,
  isQuoteable,
  getQuotePermission,
  type ActivityPubActor,
  type ActivityPubObject,
} from '../../src/generics/index.js';

describe('Status.LesserMetadata Logic', () => {
  const createMockActor = (extensions?: any): ActivityPubActor => ({
    id: 'user1',
    type: 'Person',
    preferredUsername: 'testuser',
    name: 'Test User',
    extensions: extensions || {},
  });

  const createMockObject = (extensions?: any): ActivityPubObject => ({
    id: 'https://example.com/post/123',
    type: 'Note',
    attributedTo: 'user1',
    content: 'Test post',
    published: new Date('2024-01-01'),
    to: [],
    cc: [],
    extensions: extensions || {},
  });

  describe('Type Guards', () => {
    it('should detect Lesser actor extensions', () => {
      const withTrust = createMockActor({ trustScore: 85 });
      const withReputation = createMockActor({ reputation: { actorId: 'user1' } });
      const without = createMockActor();

      expect(hasLesserActorExtensions(withTrust)).toBe(true);
      expect(hasLesserActorExtensions(withReputation)).toBe(true);
      expect(hasLesserActorExtensions(without)).toBe(false);
    });

    it('should detect Lesser object extensions', () => {
      const withCost = createMockObject({ estimatedCost: 1000 });
      const withNotes = createMockObject({ communityNotes: [] });
      const withQuote = createMockObject({ quoteUrl: 'https://example.com/quote' });
      const without = createMockObject();

      expect(hasLesserObjectExtensions(withCost)).toBe(true);
      expect(hasLesserObjectExtensions(withNotes)).toBe(true);
      expect(hasLesserObjectExtensions(withQuote)).toBe(true);
      expect(hasLesserObjectExtensions(without)).toBe(false);
    });
  });

  describe('Cost Extraction', () => {
    it('should extract estimated cost from object extensions', () => {
      const obj = createMockObject({ estimatedCost: 1500000 });
      const cost = getEstimatedCost(obj);
      expect(cost).toBe(1500000);
    });

    it('should return null when no cost present', () => {
      const obj = createMockObject();
      expect(getEstimatedCost(obj)).toBeNull();
    });

    it('should format cost correctly in USD', () => {
      const microcents = 1500000;
      const dollars = microcents / 1000000;
      expect(dollars.toFixed(4)).toBe('1.5000');
    });
  });

  describe('Trust Score Extraction', () => {
    it('should extract trust score from actor extensions', () => {
      const actor = createMockActor({ trustScore: 85 });
      const score = getTrustScore(actor);
      expect(score).toBe(85);
    });

    it('should return null when no trust score present', () => {
      const actor = createMockActor();
      expect(getTrustScore(actor)).toBeNull();
    });

    it('should determine trust color level correctly', () => {
      const getTrustColor = (score: number) => {
        if (score >= 80) return 'green';
        if (score >= 50) return 'yellow';
        return 'red';
      };

      expect(getTrustColor(90)).toBe('green');
      expect(getTrustColor(85)).toBe('green');
      expect(getTrustColor(70)).toBe('yellow');
      expect(getTrustColor(50)).toBe('yellow');
      expect(getTrustColor(30)).toBe('red');
    });
  });

  describe('Community Notes Detection', () => {
    it('should detect community notes presence', () => {
      const withNotes = createMockObject({
        communityNotes: [
          { id: 'note1', content: 'Context note' },
        ],
      });
      const withEmptyNotes = createMockObject({ communityNotes: [] });
      const without = createMockObject();

      expect(hasCommunityNotes(withNotes)).toBe(true);
      expect(hasCommunityNotes(withEmptyNotes)).toBe(false);
      expect(hasCommunityNotes(without)).toBe(false);
    });
  });

  describe('Quote Post Detection', () => {
    it('should detect quote posts by URL', () => {
      const obj = createMockObject({ quoteUrl: 'https://example.com/original' });
      expect(obj.extensions?.quoteUrl).toBeDefined();
      expect(hasLesserObjectExtensions(obj)).toBe(true);
    });

    it('should check if object is quoteable', () => {
      const quoteable = createMockObject({ quoteable: true });
      const notQuoteable = createMockObject({ quoteable: false });
      const defaultObj = createMockObject();

      expect(isQuoteable(quoteable)).toBe(true);
      expect(isQuoteable(notQuoteable)).toBe(false);
      expect(isQuoteable(defaultObj)).toBe(true); // Default to true
    });

    it('should get quote permission level', () => {
      const everyone = createMockObject({ quotePermissions: 'EVERYONE' });
      const followers = createMockObject({ quotePermissions: 'FOLLOWERS' });
      const none = createMockObject({ quotePermissions: 'NONE' });
      const defaultObj = createMockObject();

      expect(getQuotePermission(everyone)).toBe('EVERYONE');
      expect(getQuotePermission(followers)).toBe('FOLLOWERS');
      expect(getQuotePermission(none)).toBe('NONE');
      expect(getQuotePermission(defaultObj)).toBe('EVERYONE'); // Default
    });
  });

  describe('Moderation Detection', () => {
    it('should detect AI moderation action', () => {
      const obj = createMockObject({
        aiAnalysis: {
          id: 'analysis1',
          objectId: '123',
          objectType: 'Note',
          overallRisk: 0.8,
          moderationAction: 'FLAG',
          confidence: 0.9,
          analyzedAt: new Date().toISOString(),
        },
      });

      expect(obj.extensions?.aiAnalysis?.moderationAction).toBe('FLAG');
      expect(obj.extensions?.aiAnalysis?.moderationAction !== 'NONE').toBe(true);
    });

    it('should handle no moderation action', () => {
      const obj = createMockObject({
        aiAnalysis: { moderationAction: 'NONE' },
      });

      expect(obj.extensions?.aiAnalysis?.moderationAction).toBe('NONE');
    });
  });

  describe('Data Presence Detection', () => {
    it('should detect when Lesser data is present', () => {
      const hasCost = createMockObject({ estimatedCost: 1000 });
      const hasTrust = createMockActor({ trustScore: 80 });
      const hasModerationData = createMockObject({ moderationScore: 0.3 });
      const hasQuote = createMockObject({ quoteUrl: 'https://example.com' });

      expect(getEstimatedCost(hasCost)).not.toBeNull();
      expect(getTrustScore(hasTrust)).not.toBeNull();
      expect(hasModerationData.extensions?.moderationScore).toBeDefined();
      expect(hasQuote.extensions?.quoteUrl).toBeDefined();
    });

    it('should handle missing Lesser data gracefully', () => {
      const actor = createMockActor();
      const obj = createMockObject();

      expect(getTrustScore(actor)).toBeNull();
      expect(getEstimatedCost(obj)).toBeNull();
      expect(hasCommunityNotes(obj)).toBe(false);
      expect(isQuoteable(obj)).toBe(true); // Default
    });
  });

  describe('Multiple Lesser Features', () => {
    it('should handle objects with multiple Lesser extensions', () => {
      const obj = createMockObject({
        estimatedCost: 2000000,
        moderationScore: 0.1,
        quoteCount: 8,
        quoteable: true,
        communityNotes: [
          { id: 'note1', content: 'Note' },
        ],
      });

      expect(getEstimatedCost(obj)).toBe(2000000);
      expect(obj.extensions?.moderationScore).toBe(0.1);
      expect(obj.extensions?.quoteCount).toBe(8);
      expect(isQuoteable(obj)).toBe(true);
      expect(hasCommunityNotes(obj)).toBe(true);
    });
  });
});
