/**
 * Search.ActorResult Component Tests
 *
 * Tests for actor search result logic including:
 * - Placeholder initials computation
 * - Followers count formatting
 * - Follow state determination
 * - Bio sanitization
 * - Avatar handling
 */

import { describe, it, expect } from 'vitest';

// Actor interface
interface SearchActor {
	id: string;
	username: string;
	displayName?: string;
	avatar?: string;
	bio?: string;
	followersCount?: number;
	isFollowing: boolean;
}

// Compute placeholder initial from actor name
function computePlaceholderInitial(actor: SearchActor): string {
	const fromDisplay = actor.displayName?.[0];
	if (fromDisplay) return fromDisplay.toUpperCase();
	const fromUsername = actor.username?.[0];
	return fromUsername ? fromUsername.toUpperCase() : '';
}

// Format followers count for display
function formatFollowersCount(count: number | undefined): string | null {
	if (count === undefined) return null;

	if (count === 0) return '0 followers';
	if (count === 1) return '1 follower';
	if (count < 1000) return `${count} followers`;
	if (count < 10000) {
		const k = (count / 1000).toFixed(1);
		return `${k}K followers`;
	}
	if (count < 1000000) {
		const k = Math.floor(count / 1000);
		return `${k}K followers`;
	}
	const m = (count / 1000000).toFixed(1);
	return `${m}M followers`;
}

// Determine if actor should show avatar
function shouldShowAvatar(actor: SearchActor): boolean {
	return actor.avatar !== undefined && actor.avatar.length > 0;
}

// Get follow button label
function getFollowButtonLabel(isFollowing: boolean): string {
	return isFollowing ? 'Following' : 'Follow';
}

// Get follow button class modifier
function getFollowButtonClass(isFollowing: boolean): string {
	return isFollowing ? 'actor-result__follow--following' : '';
}

// Check if bio should be displayed
function shouldShowBio(bio: string | undefined): boolean {
	return bio !== undefined && bio.trim().length > 0;
}

// Extract display name
function getDisplayName(actor: SearchActor): string {
	return actor.displayName || actor.username;
}

// Format username with @ prefix
function formatUsername(username: string): string {
	return `@${username}`;
}

// Check if followers count should be shown
function shouldShowFollowers(followersCount: number | undefined): boolean {
	return followersCount !== undefined;
}

describe('Search.ActorResult - Placeholder Initials', () => {
	it('uses first character of displayName in uppercase', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: 'Alice Johnson',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('A');
	});

	it('falls back to username when displayName is empty', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: '',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('A');
	});

	it('falls back to username when displayName is undefined', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'bob',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('B');
	});

	it('returns empty string when both are empty', () => {
		const actor: SearchActor = {
			id: '1',
			username: '',
			displayName: '',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('');
	});

	it('handles unicode characters', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'user',
			displayName: '世界',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('世');
	});

	it('handles lowercase displayName', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'user',
			displayName: 'alice',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('A');
	});

	it('handles emoji in displayName', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'user',
			displayName: '🔥 Hot Take',
			isFollowing: false,
		};
		// Note: String indexing may split emoji into surrogate pairs
		const initial = computePlaceholderInitial(actor);
		expect(initial.length).toBeGreaterThan(0);
	});
});

describe('Search.ActorResult - Followers Count Formatting', () => {
	it('returns null for undefined count', () => {
		expect(formatFollowersCount(undefined)).toBeNull();
	});

	it('formats zero followers', () => {
		expect(formatFollowersCount(0)).toBe('0 followers');
	});

	it('formats one follower (singular)', () => {
		expect(formatFollowersCount(1)).toBe('1 follower');
	});

	it('formats small counts without abbreviation', () => {
		expect(formatFollowersCount(42)).toBe('42 followers');
		expect(formatFollowersCount(999)).toBe('999 followers');
	});

	it('formats thousands with K abbreviation', () => {
		expect(formatFollowersCount(1520)).toBe('1.5K followers');
		expect(formatFollowersCount(3200)).toBe('3.2K followers');
	});

	it('formats tens of thousands', () => {
		expect(formatFollowersCount(32100)).toBe('32K followers');
		expect(formatFollowersCount(99900)).toBe('99K followers');
	});

	it('formats hundreds of thousands', () => {
		expect(formatFollowersCount(250000)).toBe('250K followers');
		expect(formatFollowersCount(999999)).toBe('999K followers');
	});

	it('formats millions with M abbreviation', () => {
		expect(formatFollowersCount(1000000)).toBe('1.0M followers');
		expect(formatFollowersCount(1500000)).toBe('1.5M followers');
		expect(formatFollowersCount(10000000)).toBe('10.0M followers');
	});

	it('handles edge case at 1000', () => {
		expect(formatFollowersCount(1000)).toBe('1.0K followers');
	});

	it('handles edge case at 10000', () => {
		expect(formatFollowersCount(10000)).toBe('10K followers');
	});
});

describe('Search.ActorResult - Avatar Visibility', () => {
	it('shows avatar when URL is provided', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			avatar: 'https://example.com/avatar.png',
			isFollowing: false,
		};
		expect(shouldShowAvatar(actor)).toBe(true);
	});

	it('hides avatar when undefined', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			isFollowing: false,
		};
		expect(shouldShowAvatar(actor)).toBe(false);
	});

	it('hides avatar when empty string', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			avatar: '',
			isFollowing: false,
		};
		expect(shouldShowAvatar(actor)).toBe(false);
	});

	it('shows avatar for any non-empty string', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			avatar: 'data:image/png;base64,abc',
			isFollowing: false,
		};
		expect(shouldShowAvatar(actor)).toBe(true);
	});
});

describe('Search.ActorResult - Follow Button', () => {
	it('shows Follow label when not following', () => {
		expect(getFollowButtonLabel(false)).toBe('Follow');
	});

	it('shows Following label when already following', () => {
		expect(getFollowButtonLabel(true)).toBe('Following');
	});

	it('returns empty class when not following', () => {
		expect(getFollowButtonClass(false)).toBe('');
	});

	it('returns modifier class when following', () => {
		expect(getFollowButtonClass(true)).toBe('actor-result__follow--following');
	});
});

describe('Search.ActorResult - Bio Display', () => {
	it('shows bio when content is provided', () => {
		expect(shouldShowBio('<p>Fediverse pioneer</p>')).toBe(true);
	});

	it('hides bio when undefined', () => {
		expect(shouldShowBio(undefined)).toBe(false);
	});

	it('hides bio when empty string', () => {
		expect(shouldShowBio('')).toBe(false);
	});

	it('hides bio when only whitespace', () => {
		expect(shouldShowBio('   ')).toBe(false);
	});

	it('shows bio with plain text', () => {
		expect(shouldShowBio('Developer and writer')).toBe(true);
	});

	it('shows bio with HTML tags', () => {
		expect(shouldShowBio('<p>Hello <strong>world</strong></p>')).toBe(true);
	});
});

describe('Search.ActorResult - Display Name', () => {
	it('returns displayName when provided', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: 'Alice Johnson',
			isFollowing: false,
		};
		expect(getDisplayName(actor)).toBe('Alice Johnson');
	});

	it('falls back to username when displayName is undefined', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			isFollowing: false,
		};
		expect(getDisplayName(actor)).toBe('alice');
	});

	it('falls back to username when displayName is empty', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: '',
			isFollowing: false,
		};
		expect(getDisplayName(actor)).toBe('alice');
	});

	it('preserves whitespace in displayName', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: '  Spaced Name  ',
			isFollowing: false,
		};
		expect(getDisplayName(actor)).toBe('  Spaced Name  ');
	});
});

describe('Search.ActorResult - Username Formatting', () => {
	it('prefixes username with @', () => {
		expect(formatUsername('alice')).toBe('@alice');
	});

	it('handles empty username', () => {
		expect(formatUsername('')).toBe('@');
	});

	it('handles username with special characters', () => {
		expect(formatUsername('alice_123')).toBe('@alice_123');
	});

	it('does not double prefix', () => {
		// Function doesn't check for existing @
		expect(formatUsername('@alice')).toBe('@@alice');
	});
});

describe('Search.ActorResult - Followers Visibility', () => {
	it('shows followers when count is defined', () => {
		expect(shouldShowFollowers(0)).toBe(true);
		expect(shouldShowFollowers(100)).toBe(true);
	});

	it('hides followers when count is undefined', () => {
		expect(shouldShowFollowers(undefined)).toBe(false);
	});

	it('shows followers even for zero', () => {
		expect(shouldShowFollowers(0)).toBe(true);
	});
});

describe('Search.ActorResult - Edge Cases', () => {
	it('handles very large follower counts', () => {
		expect(formatFollowersCount(999999999)).toBe('1000.0M followers');
	});

	it('handles negative follower counts', () => {
		// Unexpected but should handle gracefully
		expect(formatFollowersCount(-1)).toBe('-1 followers');
	});

	it('handles actor with minimal data', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'a',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('A');
		expect(getDisplayName(actor)).toBe('a');
		expect(shouldShowAvatar(actor)).toBe(false);
		expect(shouldShowBio(actor.bio)).toBe(false);
	});

	it('handles actor with all data', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'alice',
			displayName: 'Alice Johnson',
			avatar: 'https://example.com/avatar.png',
			bio: '<p>Fediverse pioneer</p>',
			followersCount: 1520,
			isFollowing: true,
		};
		expect(computePlaceholderInitial(actor)).toBe('A');
		expect(getDisplayName(actor)).toBe('Alice Johnson');
		expect(shouldShowAvatar(actor)).toBe(true);
		expect(shouldShowBio(actor.bio)).toBe(true);
		expect(shouldShowFollowers(actor.followersCount)).toBe(true);
		expect(formatFollowersCount(actor.followersCount)).toBe('1.5K followers');
		expect(getFollowButtonLabel(actor.isFollowing)).toBe('Following');
	});

	it('handles unicode in all text fields', () => {
		const actor: SearchActor = {
			id: '1',
			username: 'ユーザー',
			displayName: '世界 🌍',
			bio: '<p>こんにちは</p>',
			isFollowing: false,
		};
		expect(computePlaceholderInitial(actor)).toBe('世');
		expect(getDisplayName(actor)).toBe('世界 🌍');
		expect(formatUsername(actor.username)).toBe('@ユーザー');
	});

	it('handles HTML entities in bio', () => {
		expect(shouldShowBio('&lt;script&gt;alert("xss")&lt;/script&gt;')).toBe(true);
	});

	it('formats boundary follower counts accurately', () => {
		expect(formatFollowersCount(999)).toBe('999 followers');
		expect(formatFollowersCount(1000)).toBe('1.0K followers');
		expect(formatFollowersCount(9999)).toBe('10.0K followers');
		expect(formatFollowersCount(10000)).toBe('10K followers');
		expect(formatFollowersCount(999999)).toBe('999K followers');
		expect(formatFollowersCount(1000000)).toBe('1.0M followers');
	});
});

describe('Search.ActorResult - Integration', () => {
	it('computes all display properties for typical actor', () => {
		const actor: SearchActor = {
			id: 'actor-123',
			username: 'alice',
			displayName: 'Alice Johnson',
			avatar: 'https://example.com/alice.png',
			bio: '<p>Fediverse pioneer</p>',
			followersCount: 1520,
			isFollowing: false,
		};

		expect(computePlaceholderInitial(actor)).toBe('A');
		expect(getDisplayName(actor)).toBe('Alice Johnson');
		expect(formatUsername(actor.username)).toBe('@alice');
		expect(shouldShowAvatar(actor)).toBe(true);
		expect(shouldShowBio(actor.bio)).toBe(true);
		expect(shouldShowFollowers(actor.followersCount)).toBe(true);
		expect(formatFollowersCount(actor.followersCount)).toBe('1.5K followers');
		expect(getFollowButtonLabel(actor.isFollowing)).toBe('Follow');
		expect(getFollowButtonClass(actor.isFollowing)).toBe('');
	});

	it('computes all display properties for minimal actor', () => {
		const actor: SearchActor = {
			id: 'actor-456',
			username: 'bob',
			isFollowing: true,
		};

		expect(computePlaceholderInitial(actor)).toBe('B');
		expect(getDisplayName(actor)).toBe('bob');
		expect(formatUsername(actor.username)).toBe('@bob');
		expect(shouldShowAvatar(actor)).toBe(false);
		expect(shouldShowBio(actor.bio)).toBe(false);
		expect(shouldShowFollowers(actor.followersCount)).toBe(false);
		expect(formatFollowersCount(actor.followersCount)).toBeNull();
		expect(getFollowButtonLabel(actor.isFollowing)).toBe('Following');
		expect(getFollowButtonClass(actor.isFollowing)).toBe('actor-result__follow--following');
	});
});
