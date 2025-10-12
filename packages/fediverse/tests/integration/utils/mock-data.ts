/**
 * Mock Data Generators for Integration Tests
 *
 * Provides utilities for generating realistic test data for
 * timelines, notifications, messages, and other entities.
 */

import type { Status, Account, Notification } from '../../../src/types.js';

let idCounter = 1;

/**
 * Generate unique ID
 */
export function generateId(): string {
	return `test-${idCounter++}`;
}

/**
 * Reset ID counter (for test isolation)
 */
export function resetIdCounter(): void {
	idCounter = 1;
}

/**
 * Generate mock account
 */
export function generateMockAccount(overrides?: Partial<Account>): Account {
	const id = overrides?.id || generateId();
	return {
		id,
		username: overrides?.username || `user${id}`,
		acct: overrides?.acct || `user${id}@example.com`,
		displayName: overrides?.displayName || `User ${id}`,
		locked: overrides?.locked ?? false,
		bot: overrides?.bot ?? false,
		discoverable: overrides?.discoverable ?? true,
		group: overrides?.group ?? false,
		createdAt: overrides?.createdAt || new Date().toISOString(),
		note: overrides?.note || '',
		url: overrides?.url || `https://example.com/@user${id}`,
		avatar: overrides?.avatar || `https://example.com/avatars/${id}.png`,
		avatarStatic: overrides?.avatarStatic || `https://example.com/avatars/${id}.png`,
		header: overrides?.header || `https://example.com/headers/${id}.png`,
		headerStatic: overrides?.headerStatic || `https://example.com/headers/${id}.png`,
		followersCount: overrides?.followersCount ?? 100,
		followingCount: overrides?.followingCount ?? 50,
		statusesCount: overrides?.statusesCount ?? 200,
		lastStatusAt: overrides?.lastStatusAt || new Date().toISOString(),
		emojis: overrides?.emojis || [],
		fields: overrides?.fields || [],
		...overrides,
	};
}

/**
 * Generate mock status/post
 */
export function generateMockStatus(overrides?: Partial<Status>): Status {
	const id = overrides?.id || generateId();
	const account = overrides?.account || generateMockAccount();
	
	return {
		id,
		uri: overrides?.uri || `https://example.com/users/${account.username}/statuses/${id}`,
		createdAt: overrides?.createdAt || new Date().toISOString(),
		account,
		content: overrides?.content || `This is test post ${id}`,
		visibility: overrides?.visibility || 'public',
		sensitive: overrides?.sensitive ?? false,
		spoilerText: overrides?.spoilerText || '',
		mediaAttachments: overrides?.mediaAttachments || [],
		application: overrides?.application,
		mentions: overrides?.mentions || [],
		tags: overrides?.tags || [],
		emojis: overrides?.emojis || [],
		reblogsCount: overrides?.reblogsCount ?? 0,
		favouritesCount: overrides?.favouritesCount ?? 0,
		repliesCount: overrides?.repliesCount ?? 0,
		url: overrides?.url || `https://example.com/@${account.username}/${id}`,
		inReplyToId: overrides?.inReplyToId,
		inReplyToAccountId: overrides?.inReplyToAccountId,
		reblog: overrides?.reblog,
		poll: overrides?.poll,
		card: overrides?.card,
		language: overrides?.language || 'en',
		text: overrides?.text,
		editedAt: overrides?.editedAt,
		favourited: overrides?.favourited ?? false,
		reblogged: overrides?.reblogged ?? false,
		muted: overrides?.muted ?? false,
		bookmarked: overrides?.bookmarked ?? false,
		pinned: overrides?.pinned ?? false,
		...overrides,
	};
}

/**
 * Generate mock timeline (array of statuses)
 */
export function generateMockTimeline(count: number, overrides?: Partial<Status>): Status[] {
	return Array.from({ length: count }, (_, i) => 
		generateMockStatus({ 
			...overrides,
			content: `Timeline post ${i + 1}`,
		})
	);
}

/**
 * Generate mock notification
 */
export function generateMockNotification(type: Notification['type'], overrides?: Partial<Notification>): Notification {
	const id = overrides?.id || generateId();
	const account = overrides?.account || generateMockAccount();
	
	const base: Notification = {
		id,
		type,
		createdAt: overrides?.createdAt || new Date().toISOString(),
		account,
	};

	// Add status for types that include it
	if (['mention', 'reblog', 'favourite', 'poll', 'status'].includes(type)) {
		base.status = overrides?.status || generateMockStatus({ account });
	}

	return {
		...base,
		...overrides,
	};
}

/**
 * Generate multiple notifications
 */
export function generateMockNotifications(count: number, type?: Notification['type']): Notification[] {
	const types: Notification['type'][] = type ? [type] : [
		'mention',
		'reblog',
		'favourite',
		'follow',
		'poll',
		'follow_request',
	];

	return Array.from({ length: count }, (_, i) => {
		const notifType = types[i % types.length];
		return generateMockNotification(notifType, {
			id: `notif-${i + 1}`,
		});
	});
}

/**
 * Generate large dataset for performance testing
 */
export function generateLargeDataset(size: number): {
	timeline: Status[];
	accounts: Account[];
	notifications: Notification[];
} {
	const accounts: Account[] = [];
	const timeline: Status[] = [];
	const notifications: Notification[] = [];

	// Generate accounts first
	for (let i = 0; i < Math.min(size / 10, 100); i++) {
		accounts.push(generateMockAccount());
	}

	// Generate timeline posts
	for (let i = 0; i < size; i++) {
		const account = accounts[i % accounts.length];
		timeline.push(generateMockStatus({ account }));
	}

	// Generate notifications
	for (let i = 0; i < Math.min(size / 2, 500); i++) {
		const account = accounts[i % accounts.length];
		notifications.push(generateMockNotification('favourite', { account }));
	}

	return { timeline, accounts, notifications };
}

/**
 * Generate mock conversation/message thread
 */
export function generateMockThread(depth: number): Status[] {
	const thread: Status[] = [];
	let parentId: string | undefined;

	for (let i = 0; i < depth; i++) {
		const status = generateMockStatus({
			content: `Message ${i + 1} in thread`,
			inReplyToId: parentId,
		});
		thread.push(status);
		parentId = status.id;
	}

	return thread;
}

/**
 * Simulate real-time event
 */
export interface RealtimeEvent {
	type: 'timeline' | 'notification' | 'conversation';
	action: 'create' | 'update' | 'delete';
	data: Status | Notification | Account;
}

/**
 * Generate mock real-time event
 */
export function generateRealtimeEvent(
	type: RealtimeEvent['type'],
	action: RealtimeEvent['action'] = 'create'
): RealtimeEvent {
	let data: Status | Notification | Account;

	switch (type) {
		case 'timeline':
			data = generateMockStatus();
			break;
		case 'notification':
			data = generateMockNotification('mention');
			break;
		case 'conversation':
			data = generateMockStatus();
			break;
	}

	return { type, action, data };
}

/**
 * Generate performance test data with specific characteristics
 */
export function generatePerformanceTestData(config: {
	statusCount?: number;
	withMedia?: boolean;
	withPolls?: boolean;
	longContent?: boolean;
}): Status[] {
	const {
		statusCount = 1000,
		withMedia = false,
		withPolls = false,
		longContent = false,
	} = config;

	return Array.from({ length: statusCount }, (_, i) => {
		const overrides: Partial<Status> = {
			content: longContent 
				? `This is a very long post with lots of content. `.repeat(20)
				: `Performance test post ${i + 1}`,
		};

		if (withMedia && i % 3 === 0) {
			overrides.mediaAttachments = [
				{
					id: generateId(),
					type: 'image',
					url: `https://example.com/media/${i}.jpg`,
					previewUrl: `https://example.com/media/${i}_preview.jpg`,
					description: 'Test image',
				},
			];
		}

		if (withPolls && i % 5 === 0) {
			overrides.poll = {
				id: generateId(),
				expiresAt: new Date(Date.now() + 86400000).toISOString(),
				expired: false,
				multiple: false,
				votesCount: 10,
				votersCount: 10,
				voted: false,
				ownVotes: [],
				options: [
					{ title: 'Option 1', votesCount: 5 },
					{ title: 'Option 2', votesCount: 5 },
				],
				emojis: [],
			};
		}

		return generateMockStatus(overrides);
	});
}

