/**
 * Tests for Generic Adapters
 */

import { describe, it, expect } from 'vitest';
import { LesserAdapter } from '../../src/generics/adapters.js';
import { hasLesserActorExtensions, hasLesserObjectExtensions } from '../../src/generics/index.js';

describe('LesserAdapter', () => {
  it('should populate ActivityPub extensions correctly', () => {
    const mockLesserStatus = {
      metadata: { localId: 'test-123' },
      object: {
        id: 'test-123',
        type: 'Note',
        content: 'Test content',
        published: '2023-01-01T00:00:00Z',
        attributedTo: {
          id: 'actor-123',
          type: 'Person',
          extensions: {
            trustScore: 85,
            reputation: { level: 'HIGH' },
            vouches: []
          }
        },
        extensions: {
          estimatedCost: 1000,
          moderationScore: 0.2,
          communityNotes: [],
          quoteUrl: undefined,
          quoteable: true,
          quotePermissions: 'EVERYONE',
          quoteContext: undefined,
          quoteCount: 0,
          aiAnalysis: undefined,
        }
      }
    };

    const adapter = new LesserAdapter();
    const generic = adapter.toGeneric(mockLesserStatus);

    // Test that type guards work
    expect(hasLesserActorExtensions(generic.account)).toBe(true);
    expect(hasLesserObjectExtensions(generic.activityPubObject)).toBe(true);

    // Test that extensions contain the expected data
    expect(generic.account.extensions?.trustScore).toBe(85);
    expect(generic.account.extensions?.reputation?.level).toBe('HIGH');
    expect(generic.activityPubObject.extensions?.estimatedCost).toBe(1000);
    expect(generic.activityPubObject.extensions?.moderationScore).toBe(0.2);
    expect(generic.activityPubObject.extensions?.quoteable).toBe(true);
  });

  it('should handle missing extensions gracefully', () => {
    const mockLesserStatus = {
      metadata: { localId: 'test-456' },
      object: {
        id: 'test-456',
        type: 'Note',
        content: 'Simple content',
        published: '2023-01-01T00:00:00Z',
        attributedTo: {
          id: 'actor-456',
          type: 'Person'
        }
      }
    };

    const adapter = new LesserAdapter();
    const generic = adapter.toGeneric(mockLesserStatus);

    // Test that type guards return false for missing extensions
    expect(hasLesserActorExtensions(generic.account)).toBe(false);
    expect(hasLesserObjectExtensions(generic.activityPubObject)).toBe(false);

    // Test that basic fields are still populated
    expect(generic.id).toBe('test-456');
    expect(generic.content).toBe('Simple content');
  });
});
