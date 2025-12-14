import type { Account } from '../../../src/types';

export const validActor: Account = {
	id: '1',
	username: 'testuser',
	acct: 'testuser',
	displayName: 'Test User',
	note: 'Test Bio',
	avatar: 'https://example.com/avatar.jpg',
	header: 'https://example.com/header.jpg',
	url: 'https://example.com/@testuser',
	followersCount: 100,
	followingCount: 50,
	statusesCount: 200,
	createdAt: '2023-01-01T00:00:00Z',
	trustScore: 0.9,
};

export const actorMissingFields: Partial<Account> = {
	id: '2',
	username: 'minimal',
	// missing display name, bio, avatar, etc.
};

export const validProfileData = {
	id: '1',
	username: 'testuser',
	displayName: 'Test User',
	bio: 'Test Bio',
	avatar: 'https://example.com/avatar.jpg',
	header: 'https://example.com/header.jpg',
	url: 'https://example.com/@testuser',
	followersCount: 100,
	followingCount: 50,
	statusesCount: 200,
	createdAt: '2023-01-01T00:00:00Z',
	trustScore: 0.9,
	fields: [{ name: 'Website', value: 'https://example.com', verifiedAt: '2023-01-01T00:00:00Z' }],
	isFollowing: false,
	isFollowedBy: false,
	isBlocked: false,
	isMuted: false,
};
