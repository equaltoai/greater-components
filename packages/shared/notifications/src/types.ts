/**
 * Types for Notifications components
 */

export interface Account {
	id: string;
	username: string;
	acct: string;
	displayName: string;
	avatar: string;
	avatarStatic?: string;
	header?: string;
	headerStatic?: string;
	note?: string;
	url: string;
	followersCount?: number;
	followingCount?: number;
	statusesCount?: number;
	bot?: boolean;
	locked?: boolean;
	verified?: boolean;
	createdAt: string | Date;
	trustScore?: number;
}

export interface MediaAttachment {
	id: string;
	type: 'image' | 'video' | 'audio' | 'gifv';
	url: string;
	previewUrl?: string;
	description?: string;
	sensitive?: boolean;
	spoilerText?: string | null;
	blurhash?: string;
}

export interface Mention {
	id: string;
	username: string;
	url: string;
	acct: string;
}

export interface Tag {
	name: string;
	url: string;
}

export interface Status {
	id: string;
	createdAt: string | Date;
	content: string;
	account: Account;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	sensitive: boolean;
	spoilerText?: string;
	mediaAttachments?: MediaAttachment[];
	mentions?: Mention[];
	tags?: Tag[];
	favouriteCount?: number;
	reblogCount?: number;
	repliesCount?: number;
	favourited?: boolean;
	reblogged?: boolean;
	bookmarked?: boolean;
	reblog?: Status;
	url?: string;
	inReplyToId?: string;
	inReplyToAccountId?: string;
}

export type NotificationType =
	| 'mention'
	| 'reblog'
	| 'favourite'
	| 'follow'
	| 'follow_request'
	| 'poll'
	| 'status'
	| 'update'
	| 'admin.sign_up'
	| 'admin.report'
	| 'quote'
	| 'community_note'
	| 'trust_update'
	| 'cost_alert'
	| 'moderation_action';

export interface BaseNotification {
	id: string;
	type: NotificationType;
	createdAt: string | Date;
	account: Account;
}

export interface MentionNotification extends BaseNotification {
	type: 'mention';
	status: Status;
}

export interface ReblogNotification extends BaseNotification {
	type: 'reblog';
	status: Status;
}

export interface FavouriteNotification extends BaseNotification {
	type: 'favourite';
	status: Status;
}

export interface FollowNotification extends BaseNotification {
	type: 'follow';
}

export interface FollowRequestNotification extends BaseNotification {
	type: 'follow_request';
}

export interface PollNotification extends BaseNotification {
	type: 'poll';
	status: Status;
}

export interface StatusNotification extends BaseNotification {
	type: 'status';
	status: Status;
}

export interface UpdateNotification extends BaseNotification {
	type: 'update';
	status: Status;
}

export interface AdminSignUpNotification extends BaseNotification {
	type: 'admin.sign_up';
}

export interface AdminReportNotification extends BaseNotification {
	type: 'admin.report';
	report: {
		id: string;
		targetAccount: Account;
		comment: string;
	};
}

export type Notification =
	| MentionNotification
	| ReblogNotification
	| FavouriteNotification
	| FollowNotification
	| FollowRequestNotification
	| PollNotification
	| StatusNotification
	| UpdateNotification
	| AdminSignUpNotification
	| AdminReportNotification;

export interface NotificationGroup {
	id: string;
	type: NotificationType;
	notifications: Notification[];
	count: number;
	latestAccount: Account;
	status?: Status;
	createdAt: string | Date;
	unread?: boolean;
}

