export type TimelineFilter = 'home' | 'local' | 'federated';

export type MediaAttachment = {
	id: string;
	type: 'image' | 'video' | 'gifv' | 'audio';
	url: string;
	previewUrl?: string;
	description?: string;
	mediaCategory?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFV';
	sensitive?: boolean;
};

export type Account = {
	id: string;
	username: string;
	acct: string;
	displayName?: string;
	avatar: string;
	header?: string;
	url: string;
	note?: string;
	followersCount: number;
	followingCount: number;
	statusesCount: number;
	verified?: boolean;
	locked?: boolean;
	bot?: boolean;
	createdAt: string;
};

export type Status = {
	id: string;
	uri: string;
	url: string;
	account: Account;
	content: string;
	createdAt: string;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	repliesCount: number;
	reblogsCount: number;
	favouritesCount: number;
	spoilerText?: string;
	sensitive?: boolean;
	mediaAttachments: MediaAttachment[];
	mentions: Array<{ id: string; username: string; acct: string; url: string }>;
	tags: Array<{ name: string; url: string }>;
	inReplyToId?: string;
	reblog?: Status;
	poll?: {
		id: string;
		expiresAt?: string;
		expired?: boolean;
		multiple: boolean;
		votesCount: number;
		options: Array<{ title: string; votesCount: number }>;
	};
};

export type Notification = {
	id: string;
	type: 'mention' | 'reblog' | 'favourite' | 'follow' | 'follow_request';
	createdAt: string;
	account: Account;
	status?: Status;
	read: boolean;
};

export type UnifiedAccount = {
	id: string;
	username: string;
	acct: string;
	displayName: string;
	note?: string;
	avatar: string;
	header?: string;
	createdAt: string;
	followersCount: number;
	followingCount: number;
	statusesCount: number;
	locked?: boolean;
	verified?: boolean;
	bot?: boolean;
	fields?: Array<{ name: string; value: string }>;
	metadata?: Record<string, unknown>;
	relationship?: {
		following?: boolean;
		followedBy?: boolean;
		requested?: boolean;
		blocking?: boolean;
		muting?: boolean;
		mutingNotifications?: boolean;
		domainBlocking?: boolean;
		endorsed?: boolean;
	};
};

export type ProfileConnection = {
	id: string;
	displayName: string;
	acct: string;
	avatar: string;
	note?: string;
	followersCount: number;
	followingCount: number;
	mutuals?: number;
	following: boolean;
	verified?: boolean;
	lastActive?: string;
};

export type TimelineSeed = Record<TimelineFilter, Status[]>;

export type SearchResultType = 'actors' | 'notes' | 'tags' | 'all';

export interface SearchActor {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
	bio?: string;
	followersCount?: number;
	isFollowing?: boolean;
}

export interface SearchNote {
	id: string;
	content: string;
	author: {
		id: string;
		username: string;
		displayName: string;
		avatar?: string;
	};
	createdAt: string;
	likesCount?: number;
	repliesCount?: number;
	reblogsCount?: number;
}

export interface SearchTag {
	name: string;
	count: number;
	trending?: boolean;
}

export interface SearchResults {
	actors: SearchActor[];
	notes: SearchNote[];
	tags: SearchTag[];
	total: number;
}
