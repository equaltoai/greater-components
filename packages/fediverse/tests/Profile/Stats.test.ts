/**
 * Profile/Stats Component Tests
 * 
 * Tests for profile statistics display including:
 * - Count formatting
 * - Label pluralization
 * - Event data creation
 * - Configuration handling
 */

import { describe, it, expect } from 'vitest';
import { formatCount } from '../../src/components/Profile/context.js';
import type { ProfileData } from '../../src/components/Profile/context.js';

// Label pluralization logic
function getLabel(count: number, singular: string, plural: string): string {
	return count === 1 ? singular : plural;
}

// Event detail creation logic
interface StatClickDetail {
	type: 'posts' | 'following' | 'followers';
	profile?: ProfileData;
}

function createStatClickDetail(type: StatClickDetail['type'], profile?: ProfileData): StatClickDetail {
	return { type, profile };
}

// Configuration handling
interface StatsConfig {
	clickable?: boolean;
	showPosts?: boolean;
	class?: string;
}

function shouldShowPosts(config: StatsConfig): boolean {
	return config.showPosts !== false;
}

function isClickable(config: StatsConfig): boolean {
	return config.clickable !== false;
}

function getClassName(config: StatsConfig): string {
	return ['profile-stats', config.class].filter(Boolean).join(' ');
}

describe('Profile/Stats - Count Formatting', () => {
	it('formats large numbers as millions with one decimal', () => {
		expect(formatCount(1_250_000)).toBe('1.3M');
	});

	it('formats exact millions', () => {
		expect(formatCount(2_000_000)).toBe('2.0M');
	});

	it('formats thousands with one decimal place', () => {
		expect(formatCount(12_345)).toBe('12.3K');
	});

	it('formats exact thousands', () => {
		expect(formatCount(5_000)).toBe('5.0K');
	});

	it('returns raw count for small numbers', () => {
		expect(formatCount(532)).toBe('532');
	});

	it('formats zero', () => {
		expect(formatCount(0)).toBe('0');
	});

	it('formats one', () => {
		expect(formatCount(1)).toBe('1');
	});

	it('formats 999 without K suffix', () => {
		expect(formatCount(999)).toBe('999');
	});

	it('formats 1000 with K suffix', () => {
		expect(formatCount(1000)).toBe('1.0K');
	});

	it('formats 999,999 with K suffix', () => {
		expect(formatCount(999_999)).toBe('1000.0K');
	});

	it('formats 1,000,000 with M suffix', () => {
		expect(formatCount(1_000_000)).toBe('1.0M');
	});
});

describe('Profile/Stats - Label Pluralization', () => {
	it('returns singular for count of 1', () => {
		expect(getLabel(1, 'post', 'posts')).toBe('post');
		expect(getLabel(1, 'follower', 'followers')).toBe('follower');
	});

	it('returns plural for count of 0', () => {
		expect(getLabel(0, 'post', 'posts')).toBe('posts');
	});

	it('returns plural for count greater than 1', () => {
		expect(getLabel(2, 'post', 'posts')).toBe('posts');
		expect(getLabel(100, 'follower', 'followers')).toBe('followers');
		expect(getLabel(1000, 'post', 'posts')).toBe('posts');
	});

	it('handles all stat types correctly', () => {
		// Posts
		expect(getLabel(1, 'post', 'posts')).toBe('post');
		expect(getLabel(5, 'post', 'posts')).toBe('posts');
		
		// Followers
		expect(getLabel(1, 'follower', 'followers')).toBe('follower');
		expect(getLabel(10, 'follower', 'followers')).toBe('followers');
		
		// Following
		expect(getLabel(1, 'following', 'following')).toBe('following'); // Same in both cases
	});
});

describe('Profile/Stats - Event Detail Creation', () => {
	const mockProfile: ProfileData = {
		id: 'user-123',
		username: 'alice',
		displayName: 'Alice',
		followersCount: 100,
		followingCount: 50,
		statusesCount: 200,
	};

	it('creates posts click detail', () => {
		const detail = createStatClickDetail('posts', mockProfile);
		
		expect(detail.type).toBe('posts');
		expect(detail.profile?.id).toBe('user-123');
	});

	it('creates following click detail', () => {
		const detail = createStatClickDetail('following', mockProfile);
		
		expect(detail.type).toBe('following');
		expect(detail.profile).toBe(mockProfile);
	});

	it('creates followers click detail', () => {
		const detail = createStatClickDetail('followers', mockProfile);
		
		expect(detail.type).toBe('followers');
		expect(detail.profile).toBe(mockProfile);
	});

	it('handles missing profile', () => {
		const detail = createStatClickDetail('posts');
		
		expect(detail.type).toBe('posts');
		expect(detail.profile).toBeUndefined();
	});
});

describe('Profile/Stats - Configuration', () => {
	it('shows posts by default', () => {
		expect(shouldShowPosts({})).toBe(true);
		expect(shouldShowPosts({ showPosts: undefined })).toBe(true);
	});

	it('hides posts when showPosts is false', () => {
		expect(shouldShowPosts({ showPosts: false })).toBe(false);
	});

	it('shows posts when showPosts is true', () => {
		expect(shouldShowPosts({ showPosts: true })).toBe(true);
	});

	it('is clickable by default', () => {
		expect(isClickable({})).toBe(true);
		expect(isClickable({ clickable: undefined })).toBe(true);
	});

	it('is not clickable when clickable is false', () => {
		expect(isClickable({ clickable: false })).toBe(false);
	});

	it('is clickable when clickable is true', () => {
		expect(isClickable({ clickable: true })).toBe(true);
	});

	it('generates default class name', () => {
		expect(getClassName({})).toBe('profile-stats');
	});

	it('includes custom class', () => {
		expect(getClassName({ class: 'custom-stats' })).toBe('profile-stats custom-stats');
	});

	it('handles empty custom class', () => {
		expect(getClassName({ class: '' })).toBe('profile-stats');
	});

	it('handles multiple class configurations', () => {
		const className = getClassName({ 
			class: 'custom-stats another-class',
			clickable: true,
			showPosts: false 
		});
		expect(className).toBe('profile-stats custom-stats another-class');
	});
});

describe('Profile/Stats - Data Display', () => {
	it('formats all counts consistently', () => {
		const counts = {
			statusesCount: 1_234,
			followingCount: 567,
			followersCount: 89_000,
		};

		expect(formatCount(counts.statusesCount)).toBe('1.2K');
		expect(formatCount(counts.followingCount)).toBe('567');
		expect(formatCount(counts.followersCount)).toBe('89.0K');
	});

	it('handles zero counts', () => {
		const counts = {
			statusesCount: 0,
			followingCount: 0,
			followersCount: 0,
		};

		expect(formatCount(counts.statusesCount)).toBe('0');
		expect(formatCount(counts.followingCount)).toBe('0');
		expect(formatCount(counts.followersCount)).toBe('0');
	});

	it('handles very large counts', () => {
		const counts = {
			statusesCount: 5_500_000,
			followingCount: 2_100_000,
			followersCount: 999_999_999,
		};

		expect(formatCount(counts.statusesCount)).toBe('5.5M');
		expect(formatCount(counts.followingCount)).toBe('2.1M');
		expect(formatCount(counts.followersCount)).toBe('1000.0M');
	});
});
