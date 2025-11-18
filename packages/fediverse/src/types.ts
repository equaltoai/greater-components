/**
 * Common types for Fediverse components
 */

export type MediaCategory = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFV' | 'DOCUMENT';

export interface MediaAttachment {
	id: string;
	type: 'image' | 'video' | 'audio' | 'gifv';
	url: string;
	previewUrl?: string;
	description?: string;
	sensitive?: boolean;
	spoilerText?: string | null;
	mediaCategory?: MediaCategory;
	blurhash?: string;
	meta?: {
		width?: number;
		height?: number;
		duration?: number;
	};
}

/**
 * Lesser-specific: Reputation information
 */
export interface Reputation {
	actorId: string;
	instance: string;
	totalScore: number;
	trustScore: number;
	activityScore: number;
	moderationScore: number;
	communityScore: number;
	calculatedAt: string | Date;
	version: string;
	evidence: {
		totalPosts: number;
		totalFollowers: number;
		accountAge: number;
		vouchCount: number;
		trustingActors: number;
		averageTrustScore: number;
	};
	signature?: string;
}

/**
 * Lesser-specific: Vouch from one actor to another
 */
export interface Vouch {
	id: string;
	from: Account;
	to: Account;
	confidence: number;
	context: string;
	voucherReputation: number;
	createdAt: string | Date;
	expiresAt: string | Date;
	active: boolean;
	revoked: boolean;
	revokedAt?: string | Date;
}

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

	// Lesser-specific fields
	trustScore?: number;
	reputation?: Reputation;
	vouches?: Vouch[];
}

/**
 * Lesser-specific: Community note on content
 */
export interface CommunityNote {
	id: string;
	author: Account;
	content: string;
	helpful: number;
	notHelpful: number;
	createdAt: string | Date;
}

/**
 * Lesser-specific: Quote context
 */
export interface QuoteContext {
	originalAuthor: Account;
	originalNote?: Status;
	quoteAllowed: boolean;
	quoteType: 'FULL' | 'PARTIAL' | 'COMMENTARY' | 'REACTION';
	withdrawn: boolean;
}

/**
 * Lesser-specific: Quote permission levels
 */
export type QuotePermission = 'EVERYONE' | 'FOLLOWERS' | 'NONE';

/**
 * Lesser-specific: AI analysis results
 */
export interface AIAnalysis {
	id: string;
	objectId: string;
	objectType: string;
	overallRisk: number;
	moderationAction: 'NONE' | 'FLAG' | 'HIDE' | 'REMOVE' | 'SHADOW_BAN' | 'REVIEW';
	confidence: number;
	analyzedAt: string | Date;
	textAnalysis?: {
		sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
		toxicityScore: number;
		containsPII: boolean;
		dominantLanguage: string;
	};
	imageAnalysis?: {
		isNSFW: boolean;
		nsfwConfidence: number;
		violenceScore: number;
		weaponsDetected: boolean;
	};
}

export interface Status {
	id: string;
	uri: string;
	url: string;
	account: Account;
	content: string;
	createdAt: string | Date;
	editedAt?: string | Date;
	sensitive?: boolean;
	spoilerText?: string;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	language?: string;
	repliesCount: number;
	reblogsCount: number;
	favouritesCount: number;
	reblogged?: boolean;
	favourited?: boolean;
	bookmarked?: boolean;
	muted?: boolean;
	pinned?: boolean;
	reblog?: Status;
	mediaAttachments?: MediaAttachment[];
	mentions?: Mention[];
	tags?: Tag[];
	card?: Card;
	poll?: Poll;
	inReplyToId?: string;
	inReplyToAccountId?: string;
	inReplyToAccount?: Account;
	inReplyToStatus?: Status;
	isDeleted?: boolean;
	deletedAt?: string | Date;
	formerType?: string;

	// Lesser-specific fields
	estimatedCost?: number;
	moderationScore?: number;
	communityNotes?: CommunityNote[];
	quoteUrl?: string;
	quoteable?: boolean;
	quotePermissions?: QuotePermission;
	quoteContext?: QuoteContext;
	quoteCount?: number;
	aiAnalysis?: AIAnalysis;
}

export interface Mention {
	id: string;
	username: string;
	acct: string;
	url: string;
}

export interface Tag {
	name: string;
	url: string;
	history?: Array<{
		day: string;
		uses: string;
		accounts: string;
	}>;
}

export interface Card {
	url: string;
	title: string;
	description?: string;
	type: 'link' | 'photo' | 'video' | 'rich';
	image?: string;
	html?: string;
	width?: number;
	height?: number;
}

export interface Poll {
	id: string;
	expiresAt?: string | Date;
	expired: boolean;
	multiple: boolean;
	votesCount: number;
	votersCount?: number;
	voted?: boolean;
	ownVotes?: number[];
	options: Array<{
		title: string;
		votesCount: number;
	}>;
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
	// Lesser-specific notification types
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
	read?: boolean;
	dismissed?: boolean;

	// Metadata for Lesser-specific payloads (derived from status/account changes)
	metadata?: {
		lesser?: {
			quoteStatus?: {
				id: string;
				content: string;
				author: string;
			};
			communityNote?: {
				id: string;
				content: string;
				helpful: number;
				notHelpful: number;
			};
			trustUpdate?: {
				newScore: number;
				previousScore?: number;
				reason?: string;
			};
			costAlert?: {
				amount: number;
				threshold: number;
			};
			moderationAction?: {
				action: string;
				reason: string;
				statusId?: string;
			};
		};
	};
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
	report?: {
		id: string;
		category: string;
		comment?: string;
	};
}

export interface AdminReportNotification extends BaseNotification {
	type: 'admin.report';
	report: {
		id: string;
		category: string;
		comment?: string;
		targetAccount?: Account;
		status?: Status;
	};
}

// Lesser-specific notification types
export interface QuoteNotification extends BaseNotification {
	type: 'quote';
	status: Status;
	quoteStatus: Status;
}

export interface CommunityNoteNotification extends BaseNotification {
	type: 'community_note';
	status: Status;
	communityNote: CommunityNote;
}

export interface TrustUpdateNotification extends BaseNotification {
	type: 'trust_update';
	trustScore: number;
	previousScore?: number;
	reason?: string;
}

export interface CostAlertNotification extends BaseNotification {
	type: 'cost_alert';
	amount: number;
	threshold: number;
	message: string;
}

export interface ModerationActionNotification extends BaseNotification {
	type: 'moderation_action';
	status?: Status;
	action: string;
	reason: string;
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
	| AdminReportNotification
	| QuoteNotification
	| CommunityNoteNotification
	| TrustUpdateNotification
	| CostAlertNotification
	| ModerationActionNotification;

export interface NotificationGroup {
	id: string;
	type: NotificationType;
	notifications: Notification[];
	accounts: Account[];
	sampleNotification: Notification;
	count: number;
	latestCreatedAt: string | Date;
	allRead: boolean;
}

export interface NotificationsFeedProps {
	notifications: Notification[];
	groups?: NotificationGroup[];
	grouped?: boolean;
	onNotificationClick?: (notification: Notification) => void;
	onMarkAsRead?: (notificationId: string) => void;
	onMarkAllAsRead?: () => void;
	onDismiss?: (notificationId: string) => void;
	loading?: boolean;
	loadingMore?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
	emptyStateMessage?: string;
	estimateSize?: number;
	overscan?: number;
	density?: 'compact' | 'comfortable';
	className?: string;
}

export interface ComposeBoxDraft {
	id?: string;
	content: string;
	contentWarning?: string;
	hasContentWarning: boolean;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	mediaAttachments: ComposeMediaAttachment[];
	poll?: ComposePoll;
	replyToId?: string;
	timestamp: number;
}

export interface ComposeMediaAttachment {
	id: string;
	file: File;
	url: string;
	type: 'image' | 'video' | 'audio' | 'gifv';
	description?: string;
	uploading?: boolean;
	error?: string;
}

export interface ComposePoll {
	options: string[];
	expiresIn: number; // Duration in seconds
	multiple: boolean;
}

export interface ComposeBoxProps {
	initialContent?: string;
	replyToStatus?: Status;
	maxLength?: number;
	maxCwLength?: number;
	placeholder?: string;
	cwPlaceholder?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	supportedMediaTypes?: string[];
	maxMediaAttachments?: number;
	enablePolls?: boolean;
	enableContentWarnings?: boolean;
	enableVisibilitySettings?: boolean;
	defaultVisibility?: 'public' | 'unlisted' | 'private' | 'direct';
	characterCountMode?: 'soft' | 'hard';
	draftKey?: string;
	onSubmit?: (draft: ComposeBoxDraft) => Promise<void> | void;
	onCancel?: () => void;
	onDraftSave?: (draft: ComposeBoxDraft) => void;
	onMediaUpload?: (file: File) => Promise<ComposeMediaAttachment>;
	onMediaRemove?: (id: string) => void;
	className?: string;
}
