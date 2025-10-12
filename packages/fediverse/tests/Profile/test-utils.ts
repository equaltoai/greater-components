import { vi } from 'vitest';
import type {
	ProfileData,
	ProfileField,
	ProfileHandlers,
	ProfileRelationship,
	ProfileTab,
} from '../../src/components/Profile/context.js';

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const relationshipTemplate: ProfileRelationship = {
	following: false,
	followedBy: false,
	blocking: false,
	blockedBy: false,
	muting: false,
	mutingNotifications: false,
	requested: false,
	domainBlocking: false,
	endorsed: false,
	note: undefined,
};

const defaultFields: ProfileField[] = [
	{
		name: 'Website',
		value: '<a href="https://example.com">example.com</a>',
		verifiedAt: '2024-02-01T12:00:00Z',
	},
	{
		name: 'Pronouns',
		value: 'they/them',
	},
];

const defaultTabs: ProfileTab[] = [
	{ id: 'posts', label: 'Posts', count: 42 },
	{ id: 'replies', label: 'Replies', count: 7 },
	{ id: 'media', label: 'Media', count: 15 },
	{ id: 'likes', label: 'Likes', count: 101 },
];

const defaultProfile: ProfileData = {
	id: 'user-123',
	username: 'fediverse.dev',
	displayName: 'Fediverse Dev',
	bio: '<p>Building the <strong>future</strong> of the social web 🌐</p>',
	avatar: 'https://cdn.example.com/avatar.png',
	header: 'https://cdn.example.com/header.jpg',
	url: 'https://social.example.com/@fediverse.dev',
	followersCount: 182345,
	followingCount: 721,
	statusesCount: 9823,
	fields: defaultFields,
	createdAt: '2022-04-15T09:30:00Z',
	isFollowing: false,
	isFollowedBy: true,
	isBlocked: false,
	isMuted: false,
	relationship: {
		...relationshipTemplate,
		followedBy: true,
	},
};

const clone = <T>(value: T): T =>
	typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

export function createProfile(overrides: DeepPartial<ProfileData> = {}): ProfileData {
	const profile = clone(defaultProfile);
	return merge(profile, overrides);
}

export function createRelationship(overrides: DeepPartial<ProfileRelationship> = {}): ProfileRelationship {
	return merge(clone(relationshipTemplate), overrides);
}

export function createTabs(overrides: ProfileTab[] = defaultTabs): ProfileTab[] {
	return clone(overrides);
}

export function createMockHandlers(overrides: DeepPartial<ProfileHandlers> = {}): ProfileHandlers {
	const handlers: ProfileHandlers = {
		onFollow: vi.fn(),
		onUnfollow: vi.fn(),
		onBlock: vi.fn(),
		onUnblock: vi.fn(),
		onMute: vi.fn(),
		onUnmute: vi.fn(),
		onReport: vi.fn(),
		onSave: vi.fn(),
		onTabChange: vi.fn(),
		onAvatarUpload: vi.fn(),
		onHeaderUpload: vi.fn(),
		onShare: vi.fn(),
		onMention: vi.fn(),
		onMessage: vi.fn(),
	};

	return merge(handlers, overrides);
}

function merge<T>(target: T, source: DeepPartial<T>): T {
	for (const key of Object.keys(source) as Array<keyof T>) {
		const value = source[key];
		const current = target[key];
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			const base =
				current && typeof current === 'object' && !Array.isArray(current)
					? (clone(current) as T[keyof T])
					: ({} as T[keyof T]);
			// @ts-expect-error - recursive merge on nested object
			target[key] = merge(base, value as never);
		} else if (value !== undefined) {
			// @ts-expect-error - safe assignment for partial merge
			target[key] = clone(value);
		}
	}
	return target;
}

export function profileToString(profile: ProfileData): string {
	return `${profile.displayName} (@${profile.username})`;
}

export function computeJoinDate(createdAt?: string): string | null {
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
