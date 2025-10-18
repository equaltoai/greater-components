/**
 * ActionBar Logic Tests
 * 
 * Tests the pure logic functions used by ActionBar component
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface ActionCounts {
  replies: number;
  boosts: number;
  favorites: number;
  quotes?: number;
}

interface ActionStates {
  boosted?: boolean;
  favorited?: boolean;
  bookmarked?: boolean;
}

type ActionHandler = () => void;

// Format count for display
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
}

// Check if action is active
function isActionActive(action: 'boost' | 'favorite' | 'bookmark', states?: ActionStates): boolean {
  if (!states) return false;
  switch (action) {
    case 'boost':
      return states.boosted === true;
    case 'favorite':
      return states.favorited === true;
    case 'bookmark':
      return states.bookmarked === true;
  }
}

// Check if action is disabled
function isActionDisabled(readonly: boolean, handler?: ActionHandler): boolean {
  return readonly || handler === undefined;
}

// Get action icon name
function getActionIcon(action: 'reply' | 'boost' | 'favorite', state: boolean): string {
  if (action === 'boost') return state ? 'unboost' : 'boost';
  if (action === 'favorite') return state ? 'unfavorite' : 'favorite';
  return 'reply';
}

// Get action label
function getActionLabel(action: 'reply' | 'boost' | 'favorite', count: number, state: boolean): string {
  const countStr = count > 0 ? ` (${formatCount(count)})` : '';
  
  switch (action) {
    case 'reply':
      return `Reply${countStr}`;
    case 'boost':
      return state ? `Unboost${countStr}` : `Boost${countStr}`;
    case 'favorite':
      return state ? `Unfavorite${countStr}` : `Favorite${countStr}`;
  }
}

// Check if any handler is provided
function hasAnyHandler(handlers?: {
  onReply?: ActionHandler;
  onBoost?: ActionHandler;
  onFavorite?: ActionHandler;
  onShare?: ActionHandler;
  onQuote?: ActionHandler;
}): boolean {
  if (!handlers) return false;
  return !!(
    handlers.onReply ||
    handlers.onBoost ||
    handlers.onFavorite ||
    handlers.onShare ||
    handlers.onQuote
  );
}

// Get total interaction count
function getTotalInteractions(counts: ActionCounts): number {
  return counts.replies + counts.boosts + counts.favorites;
}

// Check if has interactions
function hasInteractions(counts: ActionCounts): boolean {
  return getTotalInteractions(counts) > 0;
}

describe('ActionBar - Count Formatting', () => {
  it('formats small numbers', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(42)).toBe('42');
    expect(formatCount(999)).toBe('999');
  });

  it('formats thousands', () => {
    expect(formatCount(1000)).toBe('1K');
    expect(formatCount(1500)).toBe('1.5K');
    expect(formatCount(12345)).toBe('12.3K');
  });

  it('formats millions', () => {
    expect(formatCount(1000000)).toBe('1M');
    expect(formatCount(1500000)).toBe('1.5M');
    expect(formatCount(12345678)).toBe('12.3M');
  });

  it('removes trailing .0', () => {
    expect(formatCount(1000)).toBe('1K');
    expect(formatCount(10000)).toBe('10K');
    expect(formatCount(1000000)).toBe('1M');
  });
});

describe('ActionBar - Action States', () => {
  it('detects boosted state', () => {
    expect(isActionActive('boost', { boosted: true })).toBe(true);
    expect(isActionActive('boost', { boosted: false })).toBe(false);
    expect(isActionActive('boost', {})).toBe(false);
    expect(isActionActive('boost', undefined)).toBe(false);
  });

  it('detects favorited state', () => {
    expect(isActionActive('favorite', { favorited: true })).toBe(true);
    expect(isActionActive('favorite', { favorited: false })).toBe(false);
  });

  it('detects bookmarked state', () => {
    expect(isActionActive('bookmark', { bookmarked: true })).toBe(true);
    expect(isActionActive('bookmark', { bookmarked: false })).toBe(false);
  });
});

describe('ActionBar - Action Disabled State', () => {
  it('disables when readonly', () => {
    expect(isActionDisabled(true, () => {})).toBe(true);
  });

  it('disables when no handler', () => {
    expect(isActionDisabled(false, undefined)).toBe(true);
  });

  it('enables when has handler and not readonly', () => {
    expect(isActionDisabled(false, () => {})).toBe(false);
  });
});

describe('ActionBar - Icon Names', () => {
  it('gets reply icon', () => {
    expect(getActionIcon('reply', false)).toBe('reply');
    expect(getActionIcon('reply', true)).toBe('reply');
  });

  it('gets boost icon based on state', () => {
    expect(getActionIcon('boost', false)).toBe('boost');
    expect(getActionIcon('boost', true)).toBe('unboost');
  });

  it('gets favorite icon based on state', () => {
    expect(getActionIcon('favorite', false)).toBe('favorite');
    expect(getActionIcon('favorite', true)).toBe('unfavorite');
  });
});

describe('ActionBar - Action Labels', () => {
  it('generates reply labels', () => {
    expect(getActionLabel('reply', 0, false)).toBe('Reply');
    expect(getActionLabel('reply', 5, false)).toBe('Reply (5)');
    expect(getActionLabel('reply', 1200, false)).toBe('Reply (1.2K)');
  });

  it('generates boost labels', () => {
    expect(getActionLabel('boost', 0, false)).toBe('Boost');
    expect(getActionLabel('boost', 10, false)).toBe('Boost (10)');
    expect(getActionLabel('boost', 0, true)).toBe('Unboost');
    expect(getActionLabel('boost', 10, true)).toBe('Unboost (10)');
  });

  it('generates favorite labels', () => {
    expect(getActionLabel('favorite', 0, false)).toBe('Favorite');
    expect(getActionLabel('favorite', 42, false)).toBe('Favorite (42)');
    expect(getActionLabel('favorite', 0, true)).toBe('Unfavorite');
    expect(getActionLabel('favorite', 42, true)).toBe('Unfavorite (42)');
  });
});

describe('ActionBar - Handler Detection', () => {
  it('detects when has handlers', () => {
    expect(hasAnyHandler({ onReply: () => {} })).toBe(true);
    expect(hasAnyHandler({ onBoost: () => {} })).toBe(true);
    expect(hasAnyHandler({ onFavorite: () => {} })).toBe(true);
    expect(hasAnyHandler({ onShare: () => {} })).toBe(true);
    expect(hasAnyHandler({ onQuote: () => {} })).toBe(true);
  });

  it('detects when no handlers', () => {
    expect(hasAnyHandler({})).toBe(false);
    expect(hasAnyHandler(undefined)).toBe(false);
  });
});

describe('ActionBar - Interaction Counts', () => {
  it('calculates total interactions', () => {
    expect(getTotalInteractions({ replies: 5, boosts: 10, favorites: 15 })).toBe(30);
  });

  it('handles zero interactions', () => {
    expect(getTotalInteractions({ replies: 0, boosts: 0, favorites: 0 })).toBe(0);
  });

  it('detects has interactions', () => {
    expect(hasInteractions({ replies: 1, boosts: 0, favorites: 0 })).toBe(true);
    expect(hasInteractions({ replies: 0, boosts: 1, favorites: 0 })).toBe(true);
    expect(hasInteractions({ replies: 0, boosts: 0, favorites: 1 })).toBe(true);
    expect(hasInteractions({ replies: 0, boosts: 0, favorites: 0 })).toBe(false);
  });
});

describe('ActionBar - Edge Cases', () => {
  it('handles very large counts', () => {
    expect(formatCount(999999999)).toBe('1000M');
  });

  it('handles negative counts gracefully', () => {
    expect(formatCount(-5)).toBe('-5');
  });

  it('handles decimal edge cases', () => {
    expect(formatCount(1001)).toBe('1K');
    expect(formatCount(1999)).toBe('2K');
  });
});

describe('ActionBar - Integration', () => {
  it('processes complete action bar state', () => {
    const counts: ActionCounts = {
      replies: 42,
      boosts: 1200,
      favorites: 850,
    };

    const states: ActionStates = {
      boosted: true,
      favorited: false,
    };

    // Check states
    expect(isActionActive('boost', states)).toBe(true);
    expect(isActionActive('favorite', states)).toBe(false);

    // Check icons
    expect(getActionIcon('boost', true)).toBe('unboost');
    expect(getActionIcon('favorite', false)).toBe('favorite');

    // Check labels
    expect(getActionLabel('reply', counts.replies, false)).toBe('Reply (42)');
    expect(getActionLabel('boost', counts.boosts, true)).toBe('Unboost (1.2K)');
    expect(getActionLabel('favorite', counts.favorites, false)).toBe('Favorite (850)');

    // Check interactions
    expect(hasInteractions(counts)).toBe(true);
    expect(getTotalInteractions(counts)).toBe(2092);
  });

  it('handles readonly mode', () => {
    const handlers = {
      onReply: () => {},
      onBoost: () => {},
      onFavorite: () => {},
    };

    expect(isActionDisabled(true, handlers.onReply)).toBe(true);
    expect(isActionDisabled(true, handlers.onBoost)).toBe(true);
    expect(isActionDisabled(true, handlers.onFavorite)).toBe(true);
  });

  it('handles missing handlers', () => {
    expect(isActionDisabled(false, undefined)).toBe(true);
    expect(hasAnyHandler(undefined)).toBe(false);
  });
});
