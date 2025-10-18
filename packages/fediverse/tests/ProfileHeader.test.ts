/**
 * ProfileHeader Logic Tests
 * 
 * Tests the pure logic functions used by ProfileHeader component including:
 * - Count formatting
 * - Banner style computation
 * - Display name processing
 * - Join date formatting
 * - Click handler conditions
 * - Field verification
 */

import { describe, it, expect, vi } from 'vitest';

// Interfaces
interface UnifiedAccount {
  id: string;
  username: string;
  displayName?: string;
  header?: string;
  headerStatic?: string;
  avatar?: string;
  avatarStatic?: string;
  note?: string;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  statusesCount?: number;
  fields?: Array<{
    name: string;
    value: string;
    verifiedAt?: string;
  }>;
  bot?: boolean;
  locked?: boolean;
  verified?: boolean;
}

// Format count for display
function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`;
  if (count < 1000000) return `${Math.floor(count / 1000)}K`;
  if (count < 10000000) return `${(count / 1000000).toFixed(1)}M`;
  return `${Math.floor(count / 1000000)}M`;
}

// Format join date
function formatJoinDate(createdAt?: string): string {
  if (!createdAt) return '';
  try {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return '';
  }
}

// Get display name
function getDisplayName(account: UnifiedAccount, emojiRenderer?: (text: string) => string): string {
  const name = account.displayName || account.username;
  return emojiRenderer ? emojiRenderer(name) : name;
}

// Compute banner style
function getBannerStyle(
  showBanner: boolean,
  account: UnifiedAccount,
  bannerLoaded: boolean,
  bannerError: boolean,
  fallbackColor: string
): string {
  if (showBanner && account.header && !bannerError && bannerLoaded) {
    return `background-image: url('${account.header}');`;
  }
  return `background-color: ${fallbackColor};`;
}

// Check if should show banner image
function shouldShowBannerImage(showBanner: boolean, header?: string): boolean {
  return showBanner && !!header;
}

// Check if should show bio
function shouldShowBio(showBio: boolean, note?: string): boolean {
  return showBio && !!note;
}

// Check if should show fields
function shouldShowFields(showFields: boolean, fields?: UnifiedAccount['fields']): boolean {
  return showFields && !!fields && fields.length > 0;
}

// Check if should show join date
function shouldShowJoinDate(show: boolean, createdAt?: string): boolean {
  return show && !!createdAt;
}

// Check if should show counts
function shouldShowCounts(showCounts: boolean): boolean {
  return showCounts;
}

// Check if count is clickable
type CountHandler = () => void;

function isCountClickable(clickable: boolean, handler?: CountHandler): boolean {
  return clickable && handler !== undefined;
}

// Check if should call handler
function shouldCallHandler(clickable: boolean, handler?: CountHandler): boolean {
  return clickable && handler !== undefined;
}

// Check if field is verified
function isFieldVerified(field: { verifiedAt?: string }): boolean {
  return !!field.verifiedAt;
}

// Get verification date
function getVerificationDate(verifiedAt?: string): string {
  if (!verifiedAt) return '';
  try {
    const date = new Date(verifiedAt);
    return date.toLocaleDateString();
  } catch {
    return '';
  }
}

// Check if account has avatar
function hasAvatar(account: UnifiedAccount): boolean {
  return !!account.avatar;
}

// Get avatar alt text
function getAvatarAlt(account: UnifiedAccount): string {
  return account.displayName || account.username;
}

// Check if account is bot
function isBot(account: UnifiedAccount): boolean {
  return account.bot === true;
}

// Check if account is locked
function isLocked(account: UnifiedAccount): boolean {
  return account.locked === true;
}

// Check if account is verified
function isVerified(account: UnifiedAccount): boolean {
  return account.verified === true;
}

// Build profile header class
function buildHeaderClass(className: string): string {
  const classes = ['gr-profile-header', className].filter(Boolean).join(' ');
  return classes;
}

// Get count label
function getCountLabel(type: 'posts' | 'followers' | 'following', count: number): string {
  const labels = {
    posts: count === 1 ? 'post' : 'posts',
    followers: count === 1 ? 'follower' : 'followers',
    following: 'following',
  };
  return labels[type];
}

// Check if has header image
function hasHeader(account: UnifiedAccount): boolean {
  return !!account.header;
}

// Sanitize HTML content
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Truncate bio
function truncateBio(bio: string, maxLength: number = 200): string {
  if (bio.length <= maxLength) return bio;
  return bio.slice(0, maxLength) + '...';
}

// Get total interaction count
function getTotalInteractions(account: UnifiedAccount): number {
  return (
    (account.followersCount || 0) +
    (account.followingCount || 0) +
    (account.statusesCount || 0)
  );
}

describe('ProfileHeader - Count Formatting', () => {
  it('formats numbers under 1K', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(42)).toBe('42');
    expect(formatCount(999)).toBe('999');
  });

  it('formats 1K-10K with decimals', () => {
    expect(formatCount(1000)).toBe('1.0K');
    expect(formatCount(1500)).toBe('1.5K');
    expect(formatCount(9999)).toBe('10.0K');
  });

  it('formats 10K-1M without decimals', () => {
    expect(formatCount(10000)).toBe('10K');
    expect(formatCount(50000)).toBe('50K');
    expect(formatCount(999999)).toBe('999K');
  });

  it('formats 1M-10M with decimals', () => {
    expect(formatCount(1000000)).toBe('1.0M');
    expect(formatCount(1500000)).toBe('1.5M');
    expect(formatCount(9999999)).toBe('10.0M');
  });

  it('formats 10M+ without decimals', () => {
    expect(formatCount(10000000)).toBe('10M');
    expect(formatCount(50000000)).toBe('50M');
  });
});

describe('ProfileHeader - Join Date Formatting', () => {
  it('formats valid date', () => {
    const formatted = formatJoinDate('2024-01-15T00:00:00Z');
    expect(formatted).toBeTruthy();
    expect(formatted).toContain('2024');
    expect(formatted).toContain('January');
  });

  it('handles missing date', () => {
    expect(formatJoinDate(undefined)).toBe('');
  });

  it('handles invalid date', () => {
    const result = formatJoinDate('invalid');
    // Invalid dates may return 'Invalid Date' or ''
    expect(result === '' || result === 'Invalid Date').toBe(true);
  });

  it('formats different months', () => {
    const june = formatJoinDate('2024-06-15T12:00:00Z');
    const december = formatJoinDate('2024-12-15T12:00:00Z');
    // Just check they're formatted and contain year
    expect(june).toContain('2024');
    expect(december).toContain('2024');
  });
});

describe('ProfileHeader - Display Name', () => {
  const account: UnifiedAccount = {
    id: '1',
    username: 'testuser',
    displayName: 'Test User',
  };

  it('uses display name when available', () => {
    expect(getDisplayName(account)).toBe('Test User');
  });

  it('falls back to username', () => {
    const noDisplay = { ...account, displayName: undefined };
    expect(getDisplayName(noDisplay)).toBe('testuser');
  });

  it('applies emoji renderer', () => {
    const renderer = (text: string) => text.toUpperCase();
    expect(getDisplayName(account, renderer)).toBe('TEST USER');
  });
});

describe('ProfileHeader - Banner Style', () => {
  const account: UnifiedAccount = {
    id: '1',
    username: 'test',
    header: 'https://example.com/banner.jpg',
  };

  it('shows banner image when loaded', () => {
    const style = getBannerStyle(true, account, true, false, '#000');
    expect(style).toContain('background-image');
    expect(style).toContain(account.header);
  });

  it('shows fallback when banner disabled', () => {
    const style = getBannerStyle(false, account, true, false, '#000');
    expect(style).toBe('background-color: #000;');
  });

  it('shows fallback when error', () => {
    const style = getBannerStyle(true, account, false, true, '#000');
    expect(style).toBe('background-color: #000;');
  });

  it('shows fallback when not loaded', () => {
    const style = getBannerStyle(true, account, false, false, '#000');
    expect(style).toBe('background-color: #000;');
  });

  it('shows fallback when no header', () => {
    const noHeader = { ...account, header: undefined };
    const style = getBannerStyle(true, noHeader, true, false, '#000');
    expect(style).toBe('background-color: #000;');
  });
});

describe('ProfileHeader - Display Conditions', () => {
  it('checks if should show banner', () => {
    expect(shouldShowBannerImage(true, 'https://example.com/banner.jpg')).toBe(true);
    expect(shouldShowBannerImage(false, 'https://example.com/banner.jpg')).toBe(false);
    expect(shouldShowBannerImage(true, undefined)).toBe(false);
  });

  it('checks if should show bio', () => {
    expect(shouldShowBio(true, 'Bio text')).toBe(true);
    expect(shouldShowBio(false, 'Bio text')).toBe(false);
    expect(shouldShowBio(true, '')).toBe(false);
    expect(shouldShowBio(true, undefined)).toBe(false);
  });

  it('checks if should show fields', () => {
    expect(shouldShowFields(true, [{ name: 'Field', value: 'Value' }])).toBe(true);
    expect(shouldShowFields(false, [{ name: 'Field', value: 'Value' }])).toBe(false);
    expect(shouldShowFields(true, [])).toBe(false);
    expect(shouldShowFields(true, undefined)).toBe(false);
  });

  it('checks if should show join date', () => {
    expect(shouldShowJoinDate(true, '2024-01-01')).toBe(true);
    expect(shouldShowJoinDate(false, '2024-01-01')).toBe(false);
    expect(shouldShowJoinDate(true, undefined)).toBe(false);
  });

  it('checks if should show counts', () => {
    expect(shouldShowCounts(true)).toBe(true);
    expect(shouldShowCounts(false)).toBe(false);
  });
});

describe('ProfileHeader - Click Handling', () => {
  it('checks if count is clickable', () => {
    expect(isCountClickable(true, () => {})).toBe(true);
    expect(isCountClickable(false, () => {})).toBe(false);
    expect(isCountClickable(true, undefined)).toBe(false);
  });

  it('checks if should call handler', () => {
    expect(shouldCallHandler(true, () => {})).toBe(true);
    expect(shouldCallHandler(false, () => {})).toBe(false);
    expect(shouldCallHandler(true, undefined)).toBe(false);
  });
});

describe('ProfileHeader - Field Verification', () => {
  it('detects verified fields', () => {
    expect(isFieldVerified({ verifiedAt: '2024-01-01' })).toBe(true);
    expect(isFieldVerified({ verifiedAt: undefined })).toBe(false);
    expect(isFieldVerified({})).toBe(false);
  });

  it('formats verification date', () => {
    const formatted = getVerificationDate('2024-01-15T00:00:00Z');
    expect(formatted).toBeTruthy();
  });

  it('handles invalid verification date', () => {
    expect(getVerificationDate(undefined)).toBe('');
    const result = getVerificationDate('invalid');
    // Invalid dates may return 'Invalid Date' or ''
    expect(result === '' || result === 'Invalid Date').toBe(true);
  });
});

describe('ProfileHeader - Avatar', () => {
  it('checks if has avatar', () => {
    expect(hasAvatar({ id: '1', username: 'test', avatar: 'url' })).toBe(true);
    expect(hasAvatar({ id: '1', username: 'test' })).toBe(false);
  });

  it('gets avatar alt text', () => {
    expect(getAvatarAlt({ id: '1', username: 'test', displayName: 'Test' })).toBe('Test');
    expect(getAvatarAlt({ id: '1', username: 'test' })).toBe('test');
  });
});

describe('ProfileHeader - Account Badges', () => {
  it('detects bot accounts', () => {
    expect(isBot({ id: '1', username: 'test', bot: true })).toBe(true);
    expect(isBot({ id: '1', username: 'test', bot: false })).toBe(false);
    expect(isBot({ id: '1', username: 'test' })).toBe(false);
  });

  it('detects locked accounts', () => {
    expect(isLocked({ id: '1', username: 'test', locked: true })).toBe(true);
    expect(isLocked({ id: '1', username: 'test', locked: false })).toBe(false);
  });

  it('detects verified accounts', () => {
    expect(isVerified({ id: '1', username: 'test', verified: true })).toBe(true);
    expect(isVerified({ id: '1', username: 'test', verified: false })).toBe(false);
  });
});

describe('ProfileHeader - CSS Classes', () => {
  it('builds header class', () => {
    expect(buildHeaderClass('')).toBe('gr-profile-header');
    expect(buildHeaderClass('custom')).toBe('gr-profile-header custom');
    expect(buildHeaderClass('custom-1 custom-2')).toBe('gr-profile-header custom-1 custom-2');
  });
});

describe('ProfileHeader - Count Labels', () => {
  it('gets singular labels', () => {
    expect(getCountLabel('posts', 1)).toBe('post');
    expect(getCountLabel('followers', 1)).toBe('follower');
  });

  it('gets plural labels', () => {
    expect(getCountLabel('posts', 0)).toBe('posts');
    expect(getCountLabel('posts', 2)).toBe('posts');
    expect(getCountLabel('followers', 0)).toBe('followers');
    expect(getCountLabel('followers', 5)).toBe('followers');
  });

  it('gets following label', () => {
    expect(getCountLabel('following', 0)).toBe('following');
    expect(getCountLabel('following', 1)).toBe('following');
    expect(getCountLabel('following', 10)).toBe('following');
  });
});

describe('ProfileHeader - Header Image', () => {
  it('checks if has header', () => {
    expect(hasHeader({ id: '1', username: 'test', header: 'url' })).toBe(true);
    expect(hasHeader({ id: '1', username: 'test' })).toBe(false);
  });
});

describe('ProfileHeader - Bio Processing', () => {
  it('strips HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('truncates long bio', () => {
    const long = 'A'.repeat(300);
    const truncated = truncateBio(long, 200);
    expect(truncated).toHaveLength(203); // 200 + '...'
  });

  it('does not truncate short bio', () => {
    expect(truncateBio('Short bio', 200)).toBe('Short bio');
  });
});

describe('ProfileHeader - Statistics', () => {
  it('calculates total interactions', () => {
    const account: UnifiedAccount = {
      id: '1',
      username: 'test',
      followersCount: 100,
      followingCount: 50,
      statusesCount: 250,
    };
    expect(getTotalInteractions(account)).toBe(400);
  });

  it('handles missing counts', () => {
    const account: UnifiedAccount = { id: '1', username: 'test' };
    expect(getTotalInteractions(account)).toBe(0);
  });
});

describe('ProfileHeader - Edge Cases', () => {
  it('handles empty account', () => {
    const minimal: UnifiedAccount = { id: '1', username: 'test' };
    expect(getDisplayName(minimal)).toBe('test');
    expect(hasAvatar(minimal)).toBe(false);
    expect(hasHeader(minimal)).toBe(false);
    expect(isBot(minimal)).toBe(false);
  });

  it('handles very large counts', () => {
    expect(formatCount(999999999)).toBe('999M');
  });

  it('handles special characters in display name', () => {
    const account: UnifiedAccount = {
      id: '1',
      username: 'test',
      displayName: 'Test 🎉 User',
    };
    expect(getDisplayName(account)).toBe('Test 🎉 User');
  });

  it('handles empty bio', () => {
    expect(shouldShowBio(true, '')).toBe(false);
    expect(stripHtml('')).toBe('');
  });

  it('handles empty fields array', () => {
    expect(shouldShowFields(true, [])).toBe(false);
  });
});

describe('ProfileHeader - Integration', () => {
  const fullAccount: UnifiedAccount = {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    header: 'https://example.com/banner.jpg',
    avatar: 'https://example.com/avatar.jpg',
    note: '<p>Hello world!</p>',
    createdAt: '2024-01-01T00:00:00Z',
    followersCount: 1500,
    followingCount: 250,
    statusesCount: 5000,
    fields: [
      { name: 'Website', value: 'https://example.com', verifiedAt: '2024-01-01' },
      { name: 'Location', value: 'Earth' },
    ],
    bot: false,
    locked: false,
    verified: true,
  };

  it('processes complete profile display', () => {
    // Display name
    expect(getDisplayName(fullAccount)).toBe('John Doe');

    // Avatar
    expect(hasAvatar(fullAccount)).toBe(true);
    expect(getAvatarAlt(fullAccount)).toBe('John Doe');

    // Banner
    expect(hasHeader(fullAccount)).toBe(true);
    expect(shouldShowBannerImage(true, fullAccount.header)).toBe(true);

    // Bio
    expect(shouldShowBio(true, fullAccount.note)).toBe(true);
    const { note, fields, followersCount, followingCount, statusesCount } = fullAccount;
    expect(note).toBeDefined();
    if (!note) {
      throw new Error('Expected profile note to exist for sanitization');
    }
    expect(stripHtml(note)).toBe('Hello world!');

    // Fields
    expect(shouldShowFields(true, fields)).toBe(true);
    expect(fields).toBeDefined();
    if (!fields) {
      throw new Error('Expected fields to exist for verification check');
    }
    const firstField = fields[0];
    expect(firstField).toBeDefined();
    if (!firstField) {
      throw new Error('Expected at least one field for verification check');
    }
    expect(isFieldVerified(firstField)).toBe(true);

    // Join date
    expect(shouldShowJoinDate(true, fullAccount.createdAt)).toBe(true);
    const joinDate = formatJoinDate(fullAccount.createdAt);
    expect(joinDate).toBeTruthy();
    // Date should be formatted (may vary by timezone)
    expect(joinDate.length).toBeGreaterThan(0);

    // Counts
    expect(followersCount).toBeDefined();
    expect(followingCount).toBeDefined();
    expect(statusesCount).toBeDefined();
    if (
      followersCount === undefined ||
      followingCount === undefined ||
      statusesCount === undefined
    ) {
      throw new Error('Expected interaction counts to be defined');
    }
    expect(formatCount(followersCount)).toBe('1.5K');
    expect(formatCount(followingCount)).toBe('250');
    expect(formatCount(statusesCount)).toBe('5.0K');

    // Badges
    expect(isBot(fullAccount)).toBe(false);
    expect(isLocked(fullAccount)).toBe(false);
    expect(isVerified(fullAccount)).toBe(true);

    // Total
    expect(getTotalInteractions(fullAccount)).toBe(6750);
  });

  it('handles clickable counts workflow', () => {
    const followersHandler = vi.fn();
    const followingHandler = vi.fn();

    // Check clickability
    expect(isCountClickable(true, followersHandler)).toBe(true);
    expect(isCountClickable(true, followingHandler)).toBe(true);

    // Check handler calling
    expect(shouldCallHandler(true, followersHandler)).toBe(true);
    expect(shouldCallHandler(false, followersHandler)).toBe(false);
  });

  it('handles minimal profile', () => {
    const minimal: UnifiedAccount = {
      id: '1',
      username: 'newuser',
    };

    // Display
    expect(getDisplayName(minimal)).toBe('newuser');
    expect(getAvatarAlt(minimal)).toBe('newuser');

    // Missing elements
    expect(hasAvatar(minimal)).toBe(false);
    expect(hasHeader(minimal)).toBe(false);
    expect(shouldShowBio(true, minimal.note)).toBe(false);
    expect(shouldShowFields(true, minimal.fields)).toBe(false);
    expect(shouldShowJoinDate(true, minimal.createdAt)).toBe(false);

    // Counts
    expect(formatCount(minimal.followersCount || 0)).toBe('0');
    expect(getTotalInteractions(minimal)).toBe(0);

    // Badges
    expect(isBot(minimal)).toBe(false);
    expect(isVerified(minimal)).toBe(false);
  });
});
