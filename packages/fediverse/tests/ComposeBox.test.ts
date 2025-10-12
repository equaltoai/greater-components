/**
 * ComposeBox Logic Tests
 * 
 * Tests the pure logic functions used by ComposeBox component including:
 * - Character counting and limits
 * - Content warning validation
 * - Media attachment management
 * - Submit validation
 * - Draft data structure
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface ComposeMediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  description?: string;
}

interface ComposePoll {
  options: string[];
  expiresIn: number;
  multiple: boolean;
}

interface ComposeBoxDraft {
  content: string;
  contentWarning: string;
  hasContentWarning: boolean;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  mediaAttachments: ComposeMediaAttachment[];
  poll?: ComposePoll;
  replyToId?: string;
  timestamp: number;
}

// Calculate character count
function getContentLength(content: string): number {
  return content.length;
}

// Calculate total length including CW
function getTotalLength(content: string, contentWarning: string, hasCW: boolean): number {
  return content.length + (hasCW ? contentWarning.length : 0);
}

// Check if at soft limit
function isAtSoftLimit(contentLength: number, maxLength: number, threshold: number = 0.8): boolean {
  return contentLength >= maxLength * threshold;
}

// Check if at hard limit
function isAtHardLimit(contentLength: number, maxLength: number, mode: 'soft' | 'hard'): boolean {
  return mode === 'hard' && contentLength >= maxLength;
}

// Check if over limit
function isOverLimit(contentLength: number, maxLength: number): boolean {
  return contentLength > maxLength;
}

// Validate content warning length
function isValidCWLength(cw: string, maxLength: number): boolean {
  return cw.trim().length <= maxLength;
}

// Check if can submit
function canSubmit(
  disabled: boolean,
  isSubmitting: boolean,
  content: string,
  mediaAttachments: ComposeMediaAttachment[],
  poll: ComposePoll | undefined,
  mode: 'soft' | 'hard',
  isAtHard: boolean,
  hasCW: boolean,
  cw: string,
  maxCwLength: number
): boolean {
  return (
    !disabled &&
    !isSubmitting &&
    (content.trim().length > 0 || mediaAttachments.length > 0 || poll !== undefined) &&
    (mode === 'soft' || !isAtHard) &&
    (!hasCW || cw.trim().length <= maxCwLength)
  );
}

// Get character count color
function getCharacterCountColor(
  isOver: boolean,
  isAtSoft: boolean
): 'error' | 'warning' | 'default' {
  if (isOver) return 'error';
  if (isAtSoft) return 'warning';
  return 'default';
}

// Check if can add media
function canAddMedia(
  current: number,
  max: number
): boolean {
  return current < max;
}

// Validate media type
function isValidMediaType(
  fileType: string,
  supportedTypes: string[]
): boolean {
  return supportedTypes.some(supported => {
    if (supported.endsWith('/*')) {
      const prefix = supported.split('/')[0];
      return fileType.startsWith(prefix + '/');
    }
    return fileType === supported;
  });
}

// Build draft data
function buildDraftData(
  content: string,
  contentWarning: string,
  hasContentWarning: boolean,
  visibility: 'public' | 'unlisted' | 'private' | 'direct',
  mediaAttachments: ComposeMediaAttachment[],
  poll: ComposePoll | undefined,
  replyToId: string | undefined
): ComposeBoxDraft {
  return {
    content,
    contentWarning,
    hasContentWarning,
    visibility,
    mediaAttachments,
    poll,
    replyToId,
    timestamp: Date.now(),
  };
}

// Check if draft is empty
function isDraftEmpty(draft: ComposeBoxDraft): boolean {
  return (
    draft.content.trim().length === 0 &&
    draft.mediaAttachments.length === 0 &&
    !draft.poll
  );
}

// Calculate remaining characters
function getRemainingCharacters(contentLength: number, maxLength: number): number {
  return maxLength - contentLength;
}

// Format character count display
function formatCharacterCount(remaining: number, total: number): string {
  return remaining >= 0 ? `${remaining}` : `${remaining}`;
}

// Check if should show character count
function shouldShowCharacterCount(
  contentLength: number,
  maxLength: number,
  alwaysShow: boolean = false
): boolean {
  return alwaysShow || contentLength >= maxLength * 0.7;
}

// Validate poll
function isValidPoll(poll: ComposePoll | undefined): boolean {
  if (!poll) return true;
  return (
    poll.options.length >= 2 &&
    poll.options.every(opt => opt.trim().length > 0) &&
    poll.expiresIn > 0
  );
}

// Check if has content
function hasContent(
  content: string,
  mediaAttachments: ComposeMediaAttachment[],
  poll: ComposePoll | undefined
): boolean {
  return content.trim().length > 0 || mediaAttachments.length > 0 || poll !== undefined;
}

// Get visibility icon
function getVisibilityIcon(visibility: 'public' | 'unlisted' | 'private' | 'direct'): string {
  const icons = {
    public: 'globe',
    unlisted: 'unlock',
    private: 'lock',
    direct: 'envelope',
  };
  return icons[visibility];
}

// Get visibility label
function getVisibilityLabel(visibility: 'public' | 'unlisted' | 'private' | 'direct'): string {
  const labels = {
    public: 'Public',
    unlisted: 'Unlisted',
    private: 'Followers only',
    direct: 'Direct message',
  };
  return labels[visibility];
}

describe('ComposeBox - Character Counting', () => {
  it('counts content length', () => {
    expect(getContentLength('Hello world')).toBe(11);
    expect(getContentLength('')).toBe(0);
  });

  it('calculates total length with CW', () => {
    expect(getTotalLength('Hello', 'Warning', true)).toBe(12);
    expect(getTotalLength('Hello', 'Warning', false)).toBe(5);
  });

  it('detects soft limit', () => {
    expect(isAtSoftLimit(400, 500, 0.8)).toBe(true);
    expect(isAtSoftLimit(399, 500, 0.8)).toBe(false);
  });

  it('detects hard limit', () => {
    expect(isAtHardLimit(500, 500, 'hard')).toBe(true);
    expect(isAtHardLimit(500, 500, 'soft')).toBe(false);
    expect(isAtHardLimit(499, 500, 'hard')).toBe(false);
  });

  it('detects over limit', () => {
    expect(isOverLimit(501, 500)).toBe(true);
    expect(isOverLimit(500, 500)).toBe(false);
  });

  it('calculates remaining characters', () => {
    expect(getRemainingCharacters(100, 500)).toBe(400);
    expect(getRemainingCharacters(500, 500)).toBe(0);
    expect(getRemainingCharacters(600, 500)).toBe(-100);
  });
});

describe('ComposeBox - Content Warning', () => {
  it('validates CW length', () => {
    expect(isValidCWLength('Short', 100)).toBe(true);
    expect(isValidCWLength('A'.repeat(101), 100)).toBe(false);
  });

  it('trims whitespace in validation', () => {
    expect(isValidCWLength('  Text  ', 100)).toBe(true);
  });

  it('handles empty CW', () => {
    expect(isValidCWLength('', 100)).toBe(true);
  });
});

describe('ComposeBox - Submit Validation', () => {
  const validSetup = {
    disabled: false,
    isSubmitting: false,
    content: 'Hello',
    mediaAttachments: [],
    poll: undefined,
    mode: 'soft' as const,
    isAtHard: false,
    hasCW: false,
    cw: '',
    maxCwLength: 100,
  };

  it('allows submit with valid text', () => {
    expect(canSubmit(...Object.values(validSetup))).toBe(true);
  });

  it('allows submit with media only', () => {
    const withMedia = {
      ...validSetup,
      content: '',
      mediaAttachments: [{ id: '1', type: 'image' as const, url: '' }],
    };
    expect(canSubmit(...Object.values(withMedia))).toBe(true);
  });

  it('allows submit with poll only', () => {
    const withPoll = {
      ...validSetup,
      content: '',
      poll: { options: ['A', 'B'], expiresIn: 86400, multiple: false },
    };
    expect(canSubmit(...Object.values(withPoll))).toBe(true);
  });

  it('blocks submit when disabled', () => {
    const disabled = { ...validSetup, disabled: true };
    expect(canSubmit(...Object.values(disabled))).toBe(false);
  });

  it('blocks submit when submitting', () => {
    const submitting = { ...validSetup, isSubmitting: true };
    expect(canSubmit(...Object.values(submitting))).toBe(false);
  });

  it('blocks submit with empty content and no media/poll', () => {
    const empty = { ...validSetup, content: '' };
    expect(canSubmit(...Object.values(empty))).toBe(false);
  });

  it('blocks submit at hard limit', () => {
    const atLimit = {
      ...validSetup,
      mode: 'hard' as const,
      isAtHard: true,
    };
    expect(canSubmit(...Object.values(atLimit))).toBe(false);
  });

  it('blocks submit with invalid CW', () => {
    const invalidCW = {
      ...validSetup,
      hasCW: true,
      cw: 'A'.repeat(101),
      maxCwLength: 100,
    };
    expect(canSubmit(...Object.values(invalidCW))).toBe(false);
  });

  it('allows submit with whitespace-only content but has media', () => {
    const whitespaceWithMedia = {
      ...validSetup,
      content: '   ',
      mediaAttachments: [{ id: '1', type: 'image' as const, url: '' }],
    };
    expect(canSubmit(...Object.values(whitespaceWithMedia))).toBe(true);
  });
});

describe('ComposeBox - Character Count Color', () => {
  it('returns error when over limit', () => {
    expect(getCharacterCountColor(true, false)).toBe('error');
  });

  it('returns warning at soft limit', () => {
    expect(getCharacterCountColor(false, true)).toBe('warning');
  });

  it('returns default otherwise', () => {
    expect(getCharacterCountColor(false, false)).toBe('default');
  });
});

describe('ComposeBox - Media Management', () => {
  it('checks if can add media', () => {
    expect(canAddMedia(0, 4)).toBe(true);
    expect(canAddMedia(3, 4)).toBe(true);
    expect(canAddMedia(4, 4)).toBe(false);
  });

  it('validates media types', () => {
    expect(isValidMediaType('image/jpeg', ['image/*'])).toBe(true);
    expect(isValidMediaType('image/png', ['image/*', 'video/*'])).toBe(true);
    expect(isValidMediaType('video/mp4', ['image/*', 'video/*'])).toBe(true);
    expect(isValidMediaType('audio/mp3', ['image/*'])).toBe(false);
  });

  it('validates exact media types', () => {
    expect(isValidMediaType('image/jpeg', ['image/jpeg'])).toBe(true);
    expect(isValidMediaType('image/png', ['image/jpeg'])).toBe(false);
  });
});

describe('ComposeBox - Draft Management', () => {
  it('builds draft data', () => {
    const draft = buildDraftData(
      'Hello',
      'Warning',
      true,
      'public',
      [],
      undefined,
      'reply123'
    );
    expect(draft.content).toBe('Hello');
    expect(draft.contentWarning).toBe('Warning');
    expect(draft.hasContentWarning).toBe(true);
    expect(draft.visibility).toBe('public');
    expect(draft.replyToId).toBe('reply123');
    expect(draft.timestamp).toBeGreaterThan(0);
  });

  it('detects empty draft', () => {
    const empty = buildDraftData('', '', false, 'public', [], undefined, undefined);
    expect(isDraftEmpty(empty)).toBe(true);
  });

  it('detects non-empty draft with content', () => {
    const withContent = buildDraftData('Hello', '', false, 'public', [], undefined, undefined);
    expect(isDraftEmpty(withContent)).toBe(false);
  });

  it('detects non-empty draft with media', () => {
    const withMedia = buildDraftData(
      '',
      '',
      false,
      'public',
      [{ id: '1', type: 'image', url: '' }],
      undefined,
      undefined
    );
    expect(isDraftEmpty(withMedia)).toBe(false);
  });

  it('detects non-empty draft with poll', () => {
    const withPoll = buildDraftData(
      '',
      '',
      false,
      'public',
      [],
      { options: ['A', 'B'], expiresIn: 86400, multiple: false },
      undefined
    );
    expect(isDraftEmpty(withPoll)).toBe(false);
  });
});

describe('ComposeBox - Character Count Display', () => {
  it('formats positive remaining', () => {
    expect(formatCharacterCount(100, 500)).toBe('100');
  });

  it('formats zero remaining', () => {
    expect(formatCharacterCount(0, 500)).toBe('0');
  });

  it('formats negative remaining', () => {
    expect(formatCharacterCount(-50, 500)).toBe('-50');
  });

  it('shows count when above threshold', () => {
    expect(shouldShowCharacterCount(350, 500, false)).toBe(true);
    expect(shouldShowCharacterCount(300, 500, false)).toBe(false);
  });

  it('always shows when alwaysShow is true', () => {
    expect(shouldShowCharacterCount(10, 500, true)).toBe(true);
  });
});

describe('ComposeBox - Poll Validation', () => {
  it('validates valid poll', () => {
    const poll = {
      options: ['Option A', 'Option B'],
      expiresIn: 86400,
      multiple: false,
    };
    expect(isValidPoll(poll)).toBe(true);
  });

  it('allows undefined poll', () => {
    expect(isValidPoll(undefined)).toBe(true);
  });

  it('invalidates poll with less than 2 options', () => {
    const poll = {
      options: ['Only one'],
      expiresIn: 86400,
      multiple: false,
    };
    expect(isValidPoll(poll)).toBe(false);
  });

  it('invalidates poll with empty option', () => {
    const poll = {
      options: ['Option A', ''],
      expiresIn: 86400,
      multiple: false,
    };
    expect(isValidPoll(poll)).toBe(false);
  });

  it('invalidates poll with whitespace-only option', () => {
    const poll = {
      options: ['Option A', '   '],
      expiresIn: 86400,
      multiple: false,
    };
    expect(isValidPoll(poll)).toBe(false);
  });

  it('invalidates poll with zero expiry', () => {
    const poll = {
      options: ['Option A', 'Option B'],
      expiresIn: 0,
      multiple: false,
    };
    expect(isValidPoll(poll)).toBe(false);
  });
});

describe('ComposeBox - Content Detection', () => {
  it('detects text content', () => {
    expect(hasContent('Hello', [], undefined)).toBe(true);
  });

  it('detects media content', () => {
    expect(hasContent('', [{ id: '1', type: 'image', url: '' }], undefined)).toBe(true);
  });

  it('detects poll content', () => {
    const poll = { options: ['A', 'B'], expiresIn: 86400, multiple: false };
    expect(hasContent('', [], poll)).toBe(true);
  });

  it('ignores whitespace-only text', () => {
    expect(hasContent('   ', [], undefined)).toBe(false);
  });

  it('detects no content', () => {
    expect(hasContent('', [], undefined)).toBe(false);
  });
});

describe('ComposeBox - Visibility', () => {
  it('gets visibility icons', () => {
    expect(getVisibilityIcon('public')).toBe('globe');
    expect(getVisibilityIcon('unlisted')).toBe('unlock');
    expect(getVisibilityIcon('private')).toBe('lock');
    expect(getVisibilityIcon('direct')).toBe('envelope');
  });

  it('gets visibility labels', () => {
    expect(getVisibilityLabel('public')).toBe('Public');
    expect(getVisibilityLabel('unlisted')).toBe('Unlisted');
    expect(getVisibilityLabel('private')).toBe('Followers only');
    expect(getVisibilityLabel('direct')).toBe('Direct message');
  });
});

describe('ComposeBox - Edge Cases', () => {
  it('handles very long content', () => {
    const long = 'A'.repeat(10000);
    expect(getContentLength(long)).toBe(10000);
    expect(isOverLimit(10000, 500)).toBe(true);
  });

  it('handles unicode characters', () => {
    expect(getContentLength('Hello 👋 World')).toBe(14);
  });

  it('handles empty strings', () => {
    expect(getContentLength('')).toBe(0);
    expect(hasContent('', [], undefined)).toBe(false);
  });

  it('handles maximum media attachments', () => {
    expect(canAddMedia(10, 10)).toBe(false);
  });

  it('handles negative remaining characters', () => {
    expect(getRemainingCharacters(600, 500)).toBe(-100);
    expect(formatCharacterCount(-100, 500)).toBe('-100');
  });
});

describe('ComposeBox - Integration', () => {
  it('processes complete compose workflow', () => {
    const content = 'Hello world! This is a test post.';
    const contentWarning = '';
    const hasContentWarning = false;
    const visibility = 'public' as const;
    const mediaAttachments: ComposeMediaAttachment[] = [];
    const poll = undefined;
    const maxLength = 500;
    const maxCwLength = 100;

    // Check lengths
    const contentLength = getContentLength(content);
    expect(contentLength).toBe(content.length);

    // Check limits
    expect(isAtSoftLimit(contentLength, maxLength)).toBe(false);
    expect(isAtHardLimit(contentLength, maxLength, 'hard')).toBe(false);
    expect(isOverLimit(contentLength, maxLength)).toBe(false);

    // Check if can submit
    const canSub = canSubmit(
      false,
      false,
      content,
      mediaAttachments,
      poll,
      'soft',
      false,
      hasContentWarning,
      contentWarning,
      maxCwLength
    );
    expect(canSub).toBe(true);

    // Build draft
    const draft = buildDraftData(
      content,
      contentWarning,
      hasContentWarning,
      visibility,
      mediaAttachments,
      poll,
      undefined
    );
    expect(isDraftEmpty(draft)).toBe(false);

    // Check display
    const remaining = getRemainingCharacters(contentLength, maxLength);
    expect(remaining).toBe(maxLength - contentLength);
    expect(getCharacterCountColor(false, false)).toBe('default');
  });

  it('handles post with CW and media', () => {
    const content = 'Sensitive content here';
    const contentWarning = 'Eye contact';
    const hasContentWarning = true;
    const visibility = 'unlisted' as const;
    const mediaAttachments: ComposeMediaAttachment[] = [
      { id: '1', type: 'image', url: 'https://example.com/image.jpg', description: 'A photo' },
    ];

    // Validate CW
    expect(isValidCWLength(contentWarning, 100)).toBe(true);

    // Check can submit
    const canSub = canSubmit(
      false,
      false,
      content,
      mediaAttachments,
      undefined,
      'soft',
      false,
      hasContentWarning,
      contentWarning,
      100
    );
    expect(canSub).toBe(true);

    // Check content detection
    expect(hasContent(content, mediaAttachments, undefined)).toBe(true);

    // Check visibility
    expect(getVisibilityIcon(visibility)).toBe('unlock');
    expect(getVisibilityLabel(visibility)).toBe('Unlisted');
  });

  it('handles post at limits', () => {
    const content = 'A'.repeat(400);
    const maxLength = 500;

    // Check soft limit
    expect(isAtSoftLimit(400, maxLength)).toBe(true);
    expect(getCharacterCountColor(false, true)).toBe('warning');

    // Still can submit in soft mode
    expect(
      canSubmit(false, false, content, [], undefined, 'soft', false, false, '', 100)
    ).toBe(true);

    // Cannot submit at hard limit
    const atHard = 'A'.repeat(500);
    expect(
      canSubmit(false, false, atHard, [], undefined, 'hard', true, false, '', 100)
    ).toBe(false);
  });

  it('handles complex post with all features', () => {
    const content = 'Check out this poll!';
    const contentWarning = 'Poll';
    const hasContentWarning = true;
    const visibility = 'private' as const;
    const mediaAttachments: ComposeMediaAttachment[] = [];
    const poll: ComposePoll = {
      options: ['Option A', 'Option B', 'Option C'],
      expiresIn: 86400,
      multiple: true,
    };

    // Validate all components
    expect(hasContent(content, mediaAttachments, poll)).toBe(true);
    expect(isValidPoll(poll)).toBe(true);
    expect(isValidCWLength(contentWarning, 100)).toBe(true);

    // Build and validate draft
    const draft = buildDraftData(
      content,
      contentWarning,
      hasContentWarning,
      visibility,
      mediaAttachments,
      poll,
      undefined
    );
    expect(isDraftEmpty(draft)).toBe(false);
    expect(draft.poll?.multiple).toBe(true);
    expect(draft.poll?.options).toHaveLength(3);
  });
});
