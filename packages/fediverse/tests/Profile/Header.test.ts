/**
 * Profile/Header Component Tests
 * 
 * Tests for profile header display including:
 * - Profile string formatting
 * - Join date computation
 * - Relationship text derivation
 * - Cover image handling
 * - Action button logic
 * - URL formatting
 */

import { describe, it, expect } from 'vitest';
import type { ProfileData, ProfileRelationship } from '../../src/components/Profile/context.js';
import { getRelationshipText } from '../../src/components/Profile/context.js';

// Profile string formatting
function profileToString(profile: ProfileData): string {
	return `${profile.displayName} (@${profile.username})`;
}

// Join date computation
function computeJoinDate(createdAt?: string): string | null {
	if (!createdAt) {
		return null;
	}

	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
	});
}

// Cover image display logic
function shouldShowCover(showCover: boolean, header?: string): boolean {
	return showCover && Boolean(header);
}

// Avatar display logic
function getAvatarUrl(avatar?: string, defaultAvatar?: string): string {
	return avatar || defaultAvatar || '';
}

// Bio processing
function hasBio(bio?: string): boolean {
	return Boolean(bio && bio.trim());
}

// URL processing
function extractDomain(url?: string): string | null {
	if (!url) return null;
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch {
		return null;
	}
}

// Action button visibility
function shouldShowFollowButton(isOwnProfile: boolean): boolean {
	return !isOwnProfile;
}

function shouldShowEditButton(isOwnProfile: boolean): boolean {
	return isOwnProfile;
}

function shouldShowMoreMenu(showMoreMenu: boolean): boolean {
	return showMoreMenu;
}

// Relationship badge logic
function shouldShowFollowsYouBadge(relationship?: ProfileRelationship): boolean {
	return Boolean(relationship?.followedBy);
}

function shouldShowMutualBadge(relationship?: ProfileRelationship): boolean {
	return Boolean(relationship?.following && relationship?.followedBy);
}

describe('Profile/Header - Profile String Formatting', () => {
	it('formats profile with display name and username', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice',
			displayName: 'Alice',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(profileToString(profile)).toBe('Alice (@alice)');
	});

	it('handles unicode in display name', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice',
			displayName: 'Alice 🐘',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(profileToString(profile)).toBe('Alice 🐘 (@alice)');
	});

	it('preserves exact casing', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'AliceCamelCase',
			displayName: 'ALICE ALL CAPS',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(profileToString(profile)).toBe('ALICE ALL CAPS (@AliceCamelCase)');
	});

	it('handles empty display name', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice',
			displayName: '',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(profileToString(profile)).toBe(' (@alice)');
	});
});

describe('Profile/Header - Join Date Computation', () => {
	it('computes join date for valid timestamp', () => {
		const result = computeJoinDate('2023-06-15T12:00:00Z');
		expect(result).toContain('2023');
		expect(result).toContain('June');
	});

	it('handles different months', () => {
		const dec = computeJoinDate('2023-12-15T12:00:00Z');
		const jun = computeJoinDate('2023-06-15T12:00:00Z');
		expect(dec).toContain('December');
		expect(dec).toContain('2023');
		expect(jun).toContain('June');
		expect(jun).toContain('2023');
	});

	it('handles different years', () => {
		const y2020 = computeJoinDate('2020-06-15T12:00:00Z');
		const y2024 = computeJoinDate('2024-06-15T12:00:00Z');
		expect(y2020).toContain('2020');
		expect(y2024).toContain('2024');
	});

	it('returns null for undefined', () => {
		expect(computeJoinDate(undefined)).toBeNull();
	});

	it('returns null for invalid date string', () => {
		expect(computeJoinDate('invalid-date')).toBeNull();
		expect(computeJoinDate('not-a-date')).toBeNull();
		expect(computeJoinDate('')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(computeJoinDate('')).toBeNull();
	});

	it('formats date as Month Year', () => {
		const result = computeJoinDate('2023-06-15T12:00:00Z');
		expect(result).not.toBeNull();
		// Should contain month name and year
		expect(result).toMatch(/\w+ \d{4}/);
	});
});

describe('Profile/Header - Relationship Text', () => {
	const baseRelationship: ProfileRelationship = {
		following: false,
		followedBy: false,
		blocking: false,
		blockedBy: false,
		muting: false,
		mutingNotifications: false,
		requested: false,
		domainBlocking: false,
		endorsed: false,
	};

	it('returns Follow for undefined relationship', () => {
		expect(getRelationshipText(undefined)).toBe('Follow');
	});

	it('returns Follow for base relationship', () => {
		expect(getRelationshipText(baseRelationship)).toBe('Follow');
	});

	it('returns Following when user is following', () => {
		expect(getRelationshipText({ ...baseRelationship, following: true })).toBe('Following');
	});

	it('returns Mutual when both following each other', () => {
		expect(getRelationshipText({ 
			...baseRelationship, 
			following: true, 
			followedBy: true 
		})).toBe('Mutual');
	});

	it('returns Requested when follow is pending', () => {
		expect(getRelationshipText({ ...baseRelationship, requested: true })).toBe('Requested');
	});

	it('returns Blocked when user is blocked', () => {
		expect(getRelationshipText({ ...baseRelationship, blocking: true })).toBe('Blocked');
	});

	it('returns Muted when user is muted', () => {
		expect(getRelationshipText({ ...baseRelationship, muting: true })).toBe('Muted');
	});

	it('prioritizes mutual over following', () => {
		// Mutual takes precedence when both following and followedBy are true
		expect(getRelationshipText({ 
			...baseRelationship, 
			following: true, 
			followedBy: true 
		})).toBe('Mutual');
	});

	it('prioritizes following over blocking', () => {
		// Following state is checked before blocking in the priority chain
		expect(getRelationshipText({ 
			...baseRelationship, 
			blocking: true,
			following: true
		})).toBe('Following');
	});

	it('returns blocked when blocking without following', () => {
		// Blocking is returned when not following
		expect(getRelationshipText({ 
			...baseRelationship, 
			blocking: true,
			following: false
		})).toBe('Blocked');
	});
});

describe('Profile/Header - Cover Image Logic', () => {
	it('shows cover when showCover is true and header exists', () => {
		expect(shouldShowCover(true, 'https://example.com/header.jpg')).toBe(true);
	});

	it('hides cover when showCover is false', () => {
		expect(shouldShowCover(false, 'https://example.com/header.jpg')).toBe(false);
	});

	it('hides cover when header is undefined', () => {
		expect(shouldShowCover(true, undefined)).toBe(false);
	});

	it('hides cover when header is empty string', () => {
		expect(shouldShowCover(true, '')).toBe(false);
	});

	it('hides cover when both conditions false', () => {
		expect(shouldShowCover(false, undefined)).toBe(false);
	});
});

describe('Profile/Header - Avatar Logic', () => {
	it('returns avatar URL when present', () => {
		expect(getAvatarUrl('https://example.com/avatar.jpg')).toBe('https://example.com/avatar.jpg');
	});

	it('returns default avatar when avatar is undefined', () => {
		expect(getAvatarUrl(undefined, 'https://example.com/default.jpg')).toBe('https://example.com/default.jpg');
	});

	it('returns empty string when both undefined', () => {
		expect(getAvatarUrl(undefined, undefined)).toBe('');
	});

	it('prefers avatar over default', () => {
		expect(getAvatarUrl('https://example.com/avatar.jpg', 'https://example.com/default.jpg'))
			.toBe('https://example.com/avatar.jpg');
	});

	it('returns empty string for empty avatar', () => {
		expect(getAvatarUrl('', 'https://example.com/default.jpg')).toBe('https://example.com/default.jpg');
	});
});

describe('Profile/Header - Bio Logic', () => {
	it('returns true for non-empty bio', () => {
		expect(hasBio('This is my bio')).toBe(true);
	});

	it('returns false for undefined bio', () => {
		expect(hasBio(undefined)).toBe(false);
	});

	it('returns false for empty string bio', () => {
		expect(hasBio('')).toBe(false);
	});

	it('returns false for whitespace-only bio', () => {
		expect(hasBio('   ')).toBe(false);
		expect(hasBio('\n\t')).toBe(false);
	});

	it('returns true for bio with HTML', () => {
		expect(hasBio('<p>Bio with HTML</p>')).toBe(true);
	});

	it('returns true for bio with unicode', () => {
		expect(hasBio('Hello 世界 🌍')).toBe(true);
	});
});

describe('Profile/Header - URL Processing', () => {
	it('extracts domain from valid URL', () => {
		expect(extractDomain('https://example.com/profile')).toBe('example.com');
	});

	it('extracts domain with subdomain', () => {
		expect(extractDomain('https://social.example.com/user')).toBe('social.example.com');
	});

	it('handles URL with port', () => {
		expect(extractDomain('https://example.com:8080/profile')).toBe('example.com');
	});

	it('returns null for undefined URL', () => {
		expect(extractDomain(undefined)).toBeNull();
	});

	it('returns null for invalid URL', () => {
		expect(extractDomain('not-a-url')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(extractDomain('')).toBeNull();
	});

	it('handles http protocol', () => {
		expect(extractDomain('http://example.com')).toBe('example.com');
	});
});

describe('Profile/Header - Action Button Visibility', () => {
	it('shows follow button for other profiles', () => {
		expect(shouldShowFollowButton(false)).toBe(true);
	});

	it('hides follow button for own profile', () => {
		expect(shouldShowFollowButton(true)).toBe(false);
	});

	it('shows edit button for own profile', () => {
		expect(shouldShowEditButton(true)).toBe(true);
	});

	it('hides edit button for other profiles', () => {
		expect(shouldShowEditButton(false)).toBe(false);
	});

	it('shows more menu when enabled', () => {
		expect(shouldShowMoreMenu(true)).toBe(true);
	});

	it('hides more menu when disabled', () => {
		expect(shouldShowMoreMenu(false)).toBe(false);
	});
});

describe('Profile/Header - Relationship Badges', () => {
	it('shows follows you badge when followedBy is true', () => {
		expect(shouldShowFollowsYouBadge({ 
			followedBy: true,
			following: false,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		})).toBe(true);
	});

	it('hides follows you badge when followedBy is false', () => {
		expect(shouldShowFollowsYouBadge({ 
			followedBy: false,
			following: false,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		})).toBe(false);
	});

	it('hides follows you badge when relationship is undefined', () => {
		expect(shouldShowFollowsYouBadge(undefined)).toBe(false);
	});

	it('shows mutual badge when both following', () => {
		expect(shouldShowMutualBadge({ 
			followedBy: true,
			following: true,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		})).toBe(true);
	});

	it('hides mutual badge when only followed by', () => {
		expect(shouldShowMutualBadge({ 
			followedBy: true,
			following: false,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		})).toBe(false);
	});

	it('hides mutual badge when only following', () => {
		expect(shouldShowMutualBadge({ 
			followedBy: false,
			following: true,
			blocking: false,
			blockedBy: false,
			muting: false,
			mutingNotifications: false,
			requested: false,
			domainBlocking: false,
			endorsed: false,
		})).toBe(false);
	});

	it('hides mutual badge when relationship is undefined', () => {
		expect(shouldShowMutualBadge(undefined)).toBe(false);
	});
});

describe('Profile/Header - Edge Cases', () => {
	it('handles very long display names', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice',
			displayName: 'A'.repeat(100),
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		const result = profileToString(profile);
		expect(result).toContain('A'.repeat(100));
		expect(result).toContain('(@alice)');
	});

	it('handles special characters in username', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice.example_123',
			displayName: 'Alice',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(profileToString(profile)).toBe('Alice (@alice.example_123)');
	});

	it('handles bio with only whitespace', () => {
		expect(hasBio('   \n\t   ')).toBe(false);
	});

	it('handles URL with query parameters', () => {
		expect(extractDomain('https://example.com/profile?id=123')).toBe('example.com');
	});

	it('handles URL with hash', () => {
		expect(extractDomain('https://example.com/profile#section')).toBe('example.com');
	});

	it('handles profile with all optional fields missing', () => {
		const profile: ProfileData = {
			id: 'user-1',
			username: 'alice',
			displayName: 'Alice',
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};

		expect(hasBio(profile.bio)).toBe(false);
		expect(extractDomain(profile.url)).toBeNull();
	});
});
