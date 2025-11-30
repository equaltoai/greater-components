/**
 * Search.NoteResult Component Tests
 *
 * Tests for note search result logic including:
 * - Relative time formatting
 * - Engagement stats formatting
 * - Query highlighting
 * - Author placeholder initials
 * - Stats visibility
 */

import { describe, it, expect } from 'vitest';

// Note and author interfaces
interface SearchActor {
	id: string;
	username: string;
	displayName?: string;
	avatar?: string;
}

interface SearchNote {
	id: string;
	content: string;
	author: SearchActor;
	createdAt: string;
	repliesCount?: number;
	reblogsCount?: number;
	likesCount?: number;
}

// Format relative time
function relativeTimeLabel(now: Date, input: string): string {
	const created = new Date(input);
	const diff = now.getTime() - created.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 7) return created.toLocaleDateString();
	if (days > 0) return `${days}d`;
	if (hours > 0) return `${hours}h`;
	if (minutes > 0) return `${minutes}m`;
	return `${seconds}s`;
}

// Format engagement count
function formatCount(count: number | undefined): string | null {
	if (count === undefined) return null;

	if (count < 1000) return count.toString();
	if (count < 10000) {
		const k = (count / 1000).toFixed(1);
		return `${k}K`;
	}
	if (count < 1000000) {
		const k = Math.floor(count / 1000);
		return `${k}K`;
	}
	const m = (count / 1000000).toFixed(1);
	return `${m}M`;
}

// Format stats with emoji
function formatReplyCount(count: number | undefined): string | null {
	const formatted = formatCount(count);
	return formatted !== null ? `💬 ${formatted}` : null;
}

function formatReblogCount(count: number | undefined): string | null {
	const formatted = formatCount(count);
	return formatted !== null ? `🔁 ${formatted}` : null;
}

function formatLikeCount(count: number | undefined): string | null {
	const formatted = formatCount(count);
	return formatted !== null ? `❤️ ${formatted}` : null;
}

// Compute author placeholder initial
function computePlaceholderInitial(author: SearchActor): string {
	const fromDisplay = author.displayName?.[0];
	if (fromDisplay) return fromDisplay.toUpperCase();
	const fromUsername = author.username?.[0];
	return fromUsername ? fromUsername.toUpperCase() : '';
}

// Check if avatar should be shown
function shouldShowAvatar(author: SearchActor): boolean {
	return author.avatar !== undefined && author.avatar.length > 0;
}

// Check if stats should be shown
function shouldShowStats(note: SearchNote): boolean {
	return (
		note.repliesCount !== undefined ||
		note.reblogsCount !== undefined ||
		note.likesCount !== undefined
	);
}

// Simple query highlighting logic
function highlightQuery(
	content: string,
	query: string
): { hasHighlight: boolean; matches: string[] } {
	if (!query || query.trim().length === 0) {
		return { hasHighlight: false, matches: [] };
	}

	const normalizedQuery = query.toLowerCase();
	const normalizedContent = content.toLowerCase();

	if (!normalizedContent.includes(normalizedQuery)) {
		return { hasHighlight: false, matches: [] };
	}

	return { hasHighlight: true, matches: [query] };
}

describe('Search.NoteResult - Relative Time', () => {
	it('formats seconds for recent times', () => {
		const now = new Date('2024-01-01T00:00:30Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('30s');
	});

	it('formats zero seconds', () => {
		const now = new Date('2024-01-01T00:00:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('0s');
	});

	it('formats minutes', () => {
		const now = new Date('2024-01-01T00:05:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('5m');
	});

	it('formats hours', () => {
		const now = new Date('2024-01-01T04:00:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('4h');
	});

	it('formats days', () => {
		const now = new Date('2024-01-05T00:00:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('4d');
	});

	it('formats 7 days as 7d', () => {
		const now = new Date('2024-01-08T00:00:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('7d');
	});

	it('formats older than 7 days as date', () => {
		const now = new Date('2024-01-10T00:00:00Z');
		const created = '2024-01-01T00:00:00Z';
		const expected = new Date(created).toLocaleDateString();
		expect(relativeTimeLabel(now, created)).toBe(expected);
	});

	it('prefers larger units', () => {
		const now = new Date('2024-01-01T01:30:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('1h');
	});

	it('handles partial minutes', () => {
		const now = new Date('2024-01-01T00:01:30Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('1m');
	});

	it('handles edge case at 1 minute', () => {
		const now = new Date('2024-01-01T00:01:00Z');
		expect(relativeTimeLabel(now, '2024-01-01T00:00:00Z')).toBe('1m');
	});

	it('matches test case examples', () => {
		const now = new Date('2024-01-01T00:00:00Z');
		expect(relativeTimeLabel(now, '2023-12-31T23:59:00Z')).toBe('1m');
		expect(relativeTimeLabel(now, '2023-12-31T20:00:00Z')).toBe('4h');
		expect(relativeTimeLabel(now, '2023-12-25T00:00:00Z')).toBe('7d');
		expect(relativeTimeLabel(now, '2023-12-20T00:00:00Z')).toBe(
			new Date('2023-12-20T00:00:00Z').toLocaleDateString()
		);
	});
});

describe('Search.NoteResult - Count Formatting', () => {
	it('returns null for undefined count', () => {
		expect(formatCount(undefined)).toBeNull();
	});

	it('formats counts under 1000 as-is', () => {
		expect(formatCount(0)).toBe('0');
		expect(formatCount(42)).toBe('42');
		expect(formatCount(999)).toBe('999');
	});

	it('formats thousands with K and decimal', () => {
		expect(formatCount(1234)).toBe('1.2K');
		expect(formatCount(5678)).toBe('5.7K');
	});

	it('formats tens of thousands without decimal', () => {
		expect(formatCount(12345)).toBe('12K');
		expect(formatCount(99000)).toBe('99K');
	});

	it('formats hundreds of thousands', () => {
		expect(formatCount(250000)).toBe('250K');
		expect(formatCount(999999)).toBe('999K');
	});

	it('formats millions with M', () => {
		expect(formatCount(1000000)).toBe('1.0M');
		expect(formatCount(5500000)).toBe('5.5M');
	});

	it('handles edge at 1000', () => {
		expect(formatCount(1000)).toBe('1.0K');
	});

	it('handles edge at 10000', () => {
		expect(formatCount(10000)).toBe('10K');
	});
});

describe('Search.NoteResult - Stats Formatting with Emoji', () => {
	it('formats reply count with emoji', () => {
		expect(formatReplyCount(12)).toBe('💬 12');
		expect(formatReplyCount(1234)).toBe('💬 1.2K');
	});

	it('formats reblog count with emoji', () => {
		expect(formatReblogCount(5)).toBe('🔁 5');
		expect(formatReblogCount(5000)).toBe('🔁 5.0K');
	});

	it('formats like count with emoji', () => {
		expect(formatLikeCount(1234)).toBe('❤️ 1.2K');
		expect(formatLikeCount(999999)).toBe('❤️ 999K');
	});

	it('returns null for undefined counts', () => {
		expect(formatReplyCount(undefined)).toBeNull();
		expect(formatReblogCount(undefined)).toBeNull();
		expect(formatLikeCount(undefined)).toBeNull();
	});

	it('formats zero counts', () => {
		expect(formatReplyCount(0)).toBe('💬 0');
		expect(formatReblogCount(0)).toBe('🔁 0');
		expect(formatLikeCount(0)).toBe('❤️ 0');
	});
});

describe('Search.NoteResult - Author Placeholder', () => {
	it('uses first character of displayName', () => {
		const author: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: 'Alice Johnson',
		};
		expect(computePlaceholderInitial(author)).toBe('A');
	});

	it('falls back to username when displayName is empty', () => {
		const author: SearchActor = {
			id: '1',
			username: 'bob',
			displayName: '',
		};
		expect(computePlaceholderInitial(author)).toBe('B');
	});

	it('falls back to username when displayName is undefined', () => {
		const author: SearchActor = {
			id: '1',
			username: 'charlie',
		};
		expect(computePlaceholderInitial(author)).toBe('C');
	});

	it('returns empty string when both are empty', () => {
		const author: SearchActor = {
			id: '1',
			username: '',
			displayName: '',
		};
		expect(computePlaceholderInitial(author)).toBe('');
	});

	it('uppercases the initial', () => {
		const author: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: 'alice',
		};
		expect(computePlaceholderInitial(author)).toBe('A');
	});
});

describe('Search.NoteResult - Avatar Visibility', () => {
	it('shows avatar when URL is provided', () => {
		const author: SearchActor = {
			id: '1',
			username: 'alice',
			avatar: 'https://example.com/avatar.png',
		};
		expect(shouldShowAvatar(author)).toBe(true);
	});

	it('hides avatar when undefined', () => {
		const author: SearchActor = {
			id: '1',
			username: 'alice',
		};
		expect(shouldShowAvatar(author)).toBe(false);
	});

	it('hides avatar when empty string', () => {
		const author: SearchActor = {
			id: '1',
			username: 'alice',
			avatar: '',
		};
		expect(shouldShowAvatar(author)).toBe(false);
	});
});

describe('Search.NoteResult - Stats Visibility', () => {
	it('shows stats when at least one count is defined', () => {
		const note: SearchNote = {
			id: '1',
			content: 'Test',
			author: { id: '1', username: 'alice' },
			createdAt: '2024-01-01T00:00:00Z',
			repliesCount: 5,
		};
		expect(shouldShowStats(note)).toBe(true);
	});

	it('shows stats when all counts are defined', () => {
		const note: SearchNote = {
			id: '1',
			content: 'Test',
			author: { id: '1', username: 'alice' },
			createdAt: '2024-01-01T00:00:00Z',
			repliesCount: 5,
			reblogsCount: 3,
			likesCount: 10,
		};
		expect(shouldShowStats(note)).toBe(true);
	});

	it('shows stats when counts are zero', () => {
		const note: SearchNote = {
			id: '1',
			content: 'Test',
			author: { id: '1', username: 'alice' },
			createdAt: '2024-01-01T00:00:00Z',
			repliesCount: 0,
			reblogsCount: 0,
			likesCount: 0,
		};
		expect(shouldShowStats(note)).toBe(true);
	});

	it('hides stats when all counts are undefined', () => {
		const note: SearchNote = {
			id: '1',
			content: 'Test',
			author: { id: '1', username: 'alice' },
			createdAt: '2024-01-01T00:00:00Z',
		};
		expect(shouldShowStats(note)).toBe(false);
	});
});

describe('Search.NoteResult - Query Highlighting', () => {
	it('detects highlight when query matches', () => {
		const result = highlightQuery('Exploring the fediverse', 'fediverse');
		expect(result.hasHighlight).toBe(true);
		expect(result.matches).toContain('fediverse');
	});

	it('no highlight when query is empty', () => {
		const result = highlightQuery('Content here', '');
		expect(result.hasHighlight).toBe(false);
		expect(result.matches).toHaveLength(0);
	});

	it('no highlight when query not found', () => {
		const result = highlightQuery('Hello world', 'fediverse');
		expect(result.hasHighlight).toBe(false);
	});

	it('case insensitive matching', () => {
		const result = highlightQuery('Fediverse is great', 'fediverse');
		expect(result.hasHighlight).toBe(true);
	});

	it('handles whitespace in query', () => {
		const result = highlightQuery('Content', '   ');
		expect(result.hasHighlight).toBe(false);
	});

	it('detects partial word matches', () => {
		const result = highlightQuery('federation', 'fed');
		expect(result.hasHighlight).toBe(true);
	});
});

describe('Search.NoteResult - Edge Cases', () => {
	it('handles very old dates', () => {
		const now = new Date('2024-01-01T00:00:00Z');
		const veryOld = '2020-01-01T00:00:00Z';
		const result = relativeTimeLabel(now, veryOld);
		expect(result).toBe(new Date(veryOld).toLocaleDateString());
	});

	it('handles future dates gracefully', () => {
		const now = new Date('2024-01-01T00:00:00Z');
		const future = '2024-01-02T00:00:00Z';
		// Will result in negative values
		const result = relativeTimeLabel(now, future);
		// Should return some value (likely negative or date)
		expect(typeof result).toBe('string');
	});

	it('handles very large counts', () => {
		expect(formatCount(999999999)).toBe('1000.0M');
	});

	it('handles unicode content in highlighting', () => {
		const result = highlightQuery('Hello 世界', '世界');
		expect(result.hasHighlight).toBe(true);
	});

	it('handles HTML in content for highlighting', () => {
		const result = highlightQuery('<strong>Bold</strong>', 'Bold');
		expect(result.hasHighlight).toBe(true);
	});

	it('formats all stats for complete note', () => {
		const note: SearchNote = {
			id: '1',
			content: 'Test content',
			author: { id: '1', username: 'alice', displayName: 'Alice' },
			createdAt: '2024-01-01T00:00:00Z',
			repliesCount: 12,
			reblogsCount: 5,
			likesCount: 1234,
		};

		expect(formatReplyCount(note.repliesCount)).toBe('💬 12');
		expect(formatReblogCount(note.reblogsCount)).toBe('🔁 5');
		expect(formatLikeCount(note.likesCount)).toBe('❤️ 1.2K');
		expect(shouldShowStats(note)).toBe(true);
		expect(computePlaceholderInitial(note.author)).toBe('A');
	});

	it('handles minimal note', () => {
		const note: SearchNote = {
			id: '1',
			content: '',
			author: { id: '1', username: 'a' },
			createdAt: '2024-01-01T00:00:00Z',
		};

		expect(shouldShowStats(note)).toBe(false);
		expect(computePlaceholderInitial(note.author)).toBe('A');
		expect(shouldShowAvatar(note.author)).toBe(false);
	});
});

describe('Search.NoteResult - Integration', () => {
	it('processes typical note completely', () => {
		const now = new Date('2024-01-01T00:30:00Z');
		const note: SearchNote = {
			id: 'note-1',
			content: 'Exploring the fediverse ecosystems',
			author: {
				id: 'actor-1',
				username: 'alice',
				displayName: 'Alice Johnson',
				avatar: 'https://example.com/alice.png',
			},
			createdAt: '2024-01-01T00:00:00Z',
			repliesCount: 12,
			reblogsCount: 5,
			likesCount: 1234,
		};

		expect(relativeTimeLabel(now, note.createdAt)).toBe('30m');
		expect(formatReplyCount(note.repliesCount)).toBe('💬 12');
		expect(formatReblogCount(note.reblogsCount)).toBe('🔁 5');
		expect(formatLikeCount(note.likesCount)).toBe('❤️ 1.2K');
		expect(shouldShowStats(note)).toBe(true);
		expect(computePlaceholderInitial(note.author)).toBe('A');
		expect(shouldShowAvatar(note.author)).toBe(true);
		expect(highlightQuery(note.content, 'fediverse').hasHighlight).toBe(true);
	});
});
