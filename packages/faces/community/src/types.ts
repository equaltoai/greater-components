/**
 * Community Face Type Definitions
 *
 * Comprehensive types for Reddit/forum-style community components.
 *
 * @module @equaltoai/greater-components/faces/community/types
 */

// ============================================================================
// Community Types
// ============================================================================

/**
 * Community rule definition
 */
export interface CommunityRule {
	/** Rule number/order */
	order: number;
	/** Short rule title */
	title: string;
	/** Full rule description */
	description: string;
	/** Whether rule is enforced by automod */
	autoEnforced?: boolean;
}

/**
 * Community statistics
 */
export interface CommunityStats {
	/** Total subscriber count */
	subscriberCount: number;
	/** Currently online/active users */
	activeCount: number;
	/** Total post count */
	postCount: number;
	/** Community creation date */
	createdAt: Date | string;
	/** Growth rate (subscribers per day) */
	growthRate?: number;
}

/**
 * Community data structure
 */
export interface CommunityData {
	/** Unique community identifier */
	id: string;
	/** Community name (e.g., "programming") */
	name: string;
	/** Display title */
	title: string;
	/** Community description */
	description: string;
	/** Sidebar content (markdown) */
	sidebar?: string;
	/** Banner image URL */
	bannerUrl?: string;
	/** Icon/avatar URL */
	iconUrl?: string;
	/** Primary theme color */
	primaryColor?: string;
	/** Community rules */
	rules: CommunityRule[];
	/** Community statistics */
	stats: CommunityStats;
	/** Whether community is NSFW */
	isNsfw?: boolean;
	/** Whether community is private */
	isPrivate?: boolean;
	/** Whether community is quarantined */
	isQuarantined?: boolean;
	/** Available post flairs */
	postFlairs?: FlairData[];
	/** Available user flairs */
	userFlairs?: FlairData[];
	/** Wiki enabled */
	wikiEnabled?: boolean;
	/** Moderator list */
	moderators?: ModeratorData[];
}

/**
 * Community component configuration
 */
export interface CommunityConfig {
	/** Show subscriber count */
	showStats?: boolean;
	/** Show rules sidebar */
	showRules?: boolean;
	/** Show moderator list */
	showModerators?: boolean;
	/** Compact display mode */
	compact?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Community action handlers
 */
export interface CommunityHandlers {
	/** Subscribe to community */
	onSubscribe?: (communityId: string) => Promise<void> | void;
	/** Unsubscribe from community */
	onUnsubscribe?: (communityId: string) => Promise<void> | void;
	/** Report community */
	onReport?: (communityId: string, reason: string) => Promise<void> | void;
	/** Edit community settings (mod only) */
	onEdit?: (communityId: string, data: Partial<CommunityData>) => Promise<void> | void;
}

// ============================================================================
// Post Types
// ============================================================================

/**
 * Post sorting options
 */
export type PostSortOption = 'hot' | 'new' | 'top' | 'controversial' | 'rising';

/**
 * Time filter for top/controversial sorting
 */
export type TimeFilter = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Post type
 */
export type PostType = 'text' | 'link' | 'image' | 'video' | 'poll' | 'crosspost';

/**
 * Post data structure
 */
export interface PostData {
	/** Unique post identifier */
	id: string;
	/** Post title */
	title: string;
	/** Post content (for text posts) */
	content?: string;
	/** Link URL (for link posts) */
	url?: string;
	/** Post type */
	type: PostType;
	/** Author information */
	author: AuthorData;
	/** Community this post belongs to */
	community: Pick<CommunityData, 'id' | 'name' | 'title' | 'iconUrl'>;
	/** Post flair */
	flair?: FlairData;
	/** Vote score */
	score: number;
	/** Upvote ratio (0-1) */
	upvoteRatio: number;
	/** Current user's vote (-1, 0, 1) */
	userVote?: VoteDirection;
	/** Comment count */
	commentCount: number;
	/** Creation timestamp */
	createdAt: Date | string;
	/** Edit timestamp */
	editedAt?: Date | string;
	/** Whether post is pinned/stickied */
	isPinned?: boolean;
	/** Whether post is locked */
	isLocked?: boolean;
	/** Whether post is NSFW */
	isNsfw?: boolean;
	/** Whether post is spoiler */
	isSpoiler?: boolean;
	/** Whether post is archived */
	isArchived?: boolean;
	/** Whether current user saved this post */
	isSaved?: boolean;
	/** Media attachments */
	media?: MediaAttachment[];
	/** Poll data (for poll posts) */
	poll?: PollData;
	/** Crosspost source (for crossposts) */
	crosspostParent?: PostData;
	/** Awards received */
	awards?: AwardData[];
}

/**
 * Post component configuration
 */
export interface PostConfig {
	/** Display density */
	density?: 'compact' | 'card' | 'classic';
	/** Show vote buttons */
	showVoting?: boolean;
	/** Show community name */
	showCommunity?: boolean;
	/** Show author */
	showAuthor?: boolean;
	/** Show flair */
	showFlair?: boolean;
	/** Show awards */
	showAwards?: boolean;
	/** Expand media by default */
	expandMedia?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Post action handlers
 */
export interface PostHandlers {
	/** Upvote post */
	onUpvote?: (postId: string) => Promise<void> | void;
	/** Downvote post */
	onDownvote?: (postId: string) => Promise<void> | void;
	/** Remove vote */
	onRemoveVote?: (postId: string) => Promise<void> | void;
	/** Save post */
	onSave?: (postId: string) => Promise<void> | void;
	/** Unsave post */
	onUnsave?: (postId: string) => Promise<void> | void;
	/** Hide post */
	onHide?: (postId: string) => Promise<void> | void;
	/** Report post */
	onReport?: (postId: string, reason: string) => Promise<void> | void;
	/** Share post */
	onShare?: (postId: string) => Promise<void> | void;
	/** Crosspost */
	onCrosspost?: (postId: string, communityId: string) => Promise<void> | void;
	/** Edit post (author only) */
	onEdit?: (postId: string, content: string) => Promise<void> | void;
	/** Delete post (author only) */
	onDelete?: (postId: string) => Promise<void> | void;
	/** Navigate to post */
	onNavigate?: (postId: string) => void;
}

// ============================================================================
// Comment/Thread Types
// ============================================================================

/**
 * Comment sorting options
 */
export type CommentSortOption = 'best' | 'top' | 'new' | 'controversial' | 'old' | 'qa';

/**
 * Comment data structure
 */
export interface CommentData {
	/** Unique comment identifier */
	id: string;
	/** Parent comment ID (null for top-level) */
	parentId: string | null;
	/** Post this comment belongs to */
	postId: string;
	/** Comment content (markdown/HTML) */
	content: string;
	/** Comment author */
	author: AuthorData;
	/** Vote score */
	score: number;
	/** Current user's vote */
	userVote?: VoteDirection;
	/** Creation timestamp */
	createdAt: Date | string;
	/** Edit timestamp */
	editedAt?: Date | string;
	/** Nested depth level */
	depth: number;
	/** Child comments */
	children?: CommentData[];
	/** Whether comment is collapsed */
	isCollapsed?: boolean;
	/** Whether comment is deleted */
	isDeleted?: boolean;
	/** Whether comment is removed by mod */
	isRemoved?: boolean;
	/** Whether comment is stickied */
	isStickied?: boolean;
	/** Whether comment is from OP */
	isOp?: boolean;
	/** Whether comment is from mod */
	isMod?: boolean;
	/** Whether comment is from admin */
	isAdmin?: boolean;
	/** Author flair */
	authorFlair?: FlairData;
	/** Awards received */
	awards?: AwardData[];
	/** Number of hidden children (for "load more") */
	moreChildrenCount?: number;
}

/**
 * Thread data structure
 */
export interface ThreadData {
	/** The post being discussed */
	post: PostData;
	/** Top-level comments */
	comments: CommentData[];
	/** Total comment count */
	totalComments: number;
	/** Current sort order */
	sortBy: CommentSortOption;
}

/**
 * Thread component configuration
 */
export interface ThreadConfig {
	/** Maximum nesting depth to display */
	maxDepth?: number;
	/** Default collapsed depth */
	collapseDepth?: number;
	/** Show vote buttons */
	showVoting?: boolean;
	/** Show author flairs */
	showFlairs?: boolean;
	/** Highlight OP comments */
	highlightOp?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Thread action handlers
 */
export interface ThreadHandlers {
	/** Vote on comment */
	onVote?: (commentId: string, direction: VoteDirection) => Promise<void> | void;
	/** Reply to comment */
	onReply?: (parentId: string | null, content: string) => Promise<void> | void;
	/** Edit comment */
	onEdit?: (commentId: string, content: string) => Promise<void> | void;
	/** Delete comment */
	onDelete?: (commentId: string) => Promise<void> | void;
	/** Report comment */
	onReport?: (commentId: string, reason: string) => Promise<void> | void;
	/** Collapse/expand comment */
	onToggleCollapse?: (commentId: string) => void;
	/** Load more children */
	onLoadMore?: (commentId: string) => Promise<CommentData[]>;
	/** Change sort order */
	onSortChange?: (sortBy: CommentSortOption) => void;
}

// ============================================================================
// Voting Types
// ============================================================================

/**
 * Vote direction
 */
export type VoteDirection = -1 | 0 | 1;

/**
 * Vote data structure
 */
export interface VoteData {
	/** Current score */
	score: number;
	/** Upvote ratio (0-1) */
	ratio?: number;
	/** User's current vote */
	userVote: VoteDirection;
}

/**
 * Vote handlers
 */
export interface VoteHandlers {
	/** Upvote */
	onUpvote: () => Promise<void> | void;
	/** Downvote */
	onDownvote: () => Promise<void> | void;
	/** Remove vote */
	onRemoveVote: () => Promise<void> | void;
}

// ============================================================================
// Flair Types
// ============================================================================

/**
 * Flair type
 */
export type FlairType = 'post' | 'user';

/**
 * Flair data structure
 */
export interface FlairData {
	/** Unique flair identifier */
	id: string;
	/** Flair text */
	text: string;
	/** Background color */
	backgroundColor?: string;
	/** Text color */
	textColor?: string;
	/** Emoji/icon */
	emoji?: string;
	/** Whether flair is editable by user */
	isEditable?: boolean;
	/** Whether flair is mod-only */
	isModOnly?: boolean;
	/** Flair type */
	type: FlairType;
}

/**
 * Flair handlers
 */
export interface FlairHandlers {
	/** Select flair */
	onSelect?: (flairId: string) => Promise<void> | void;
	/** Edit flair text */
	onEdit?: (flairId: string, text: string) => Promise<void> | void;
	/** Clear flair */
	onClear?: () => Promise<void> | void;
}

// ============================================================================
// Moderation Types
// ============================================================================

/**
 * Moderation action types
 */
export type ModerationActionType =
	| 'remove'
	| 'approve'
	| 'spam'
	| 'lock'
	| 'unlock'
	| 'sticky'
	| 'unsticky'
	| 'distinguish'
	| 'undistinguish'
	| 'ban'
	| 'unban'
	| 'mute'
	| 'unmute'
	| 'flair'
	| 'nsfw'
	| 'spoiler';

/**
 * Moderation queue item
 */
export interface ModerationQueueItem {
	/** Item identifier */
	id: string;
	/** Item type */
	type: 'post' | 'comment';
	/** The content being moderated */
	content: PostData | CommentData;
	/** Report reasons */
	reports: ReportData[];
	/** Queue type */
	queue: 'reports' | 'spam' | 'modqueue' | 'unmoderated';
	/** When item was added to queue */
	queuedAt: Date | string;
}

/**
 * Report data
 */
export interface ReportData {
	/** Reporter (null if anonymous) */
	reporter?: AuthorData;
	/** Report reason */
	reason: string;
	/** Custom report text */
	customText?: string;
	/** Report timestamp */
	createdAt: Date | string;
}

/**
 * Ban data structure
 */
export interface BanData {
	/** Banned user */
	user: AuthorData;
	/** Ban reason */
	reason: string;
	/** Ban duration in days (null for permanent) */
	duration: number | null;
	/** Mod note (private) */
	modNote?: string;
	/** Ban message to user */
	banMessage?: string;
	/** Ban start date */
	bannedAt: Date | string;
	/** Ban expiry date */
	expiresAt?: Date | string;
	/** Banning moderator */
	bannedBy: AuthorData;
}

/**
 * Spam filter rule
 */
export interface SpamFilterRule {
	/** Rule identifier */
	id: string;
	/** Rule name */
	name: string;
	/** Rule type */
	type: 'keyword' | 'regex' | 'domain' | 'user_age' | 'karma';
	/** Rule pattern/value */
	pattern: string;
	/** Action to take */
	action: 'remove' | 'filter' | 'report';
	/** Whether rule is enabled */
	enabled: boolean;
}

/**
 * Moderation log entry
 */
export interface ModerationLogEntry {
	/** Log entry ID */
	id: string;
	/** Action type */
	action: ModerationActionType;
	/** Moderator who performed action */
	moderator: AuthorData;
	/** Target of action */
	target: PostData | CommentData | AuthorData;
	/** Action details/reason */
	details?: string;
	/** Timestamp */
	createdAt: Date | string;
}

/**
 * Moderation handlers
 */
export interface ModerationHandlers {
	/** Remove content */
	onRemove?: (itemId: string, reason: string) => Promise<void>;
	/** Approve content */
	onApprove?: (itemId: string) => Promise<void>;
	/** Mark as spam */
	onSpam?: (itemId: string) => Promise<void>;
	/** Lock post/comment */
	onLock?: (itemId: string) => Promise<void>;
	/** Unlock post/comment */
	onUnlock?: (itemId: string) => Promise<void>;
	/** Sticky post */
	onSticky?: (postId: string) => Promise<void>;
	/** Unsticky post */
	onUnsticky?: (postId: string) => Promise<void>;
	/** Distinguish comment */
	onDistinguish?: (commentId: string) => Promise<void>;
	/** Ban user */
	onBan?: (userId: string, data: Omit<BanData, 'user' | 'bannedAt' | 'bannedBy'>) => Promise<void>;
	/** Unban user */
	onUnban?: (userId: string) => Promise<void>;
	/** Set flair */
	onSetFlair?: (itemId: string, flairId: string) => Promise<void>;
	/** Mark NSFW */
	onMarkNsfw?: (postId: string) => Promise<void>;
	/** Mark spoiler */
	onMarkSpoiler?: (postId: string) => Promise<void>;
	/** Fetch mod queue */
	onFetchQueue?: (queue: string) => Promise<ModerationQueueItem[]>;
	/** Fetch mod log */
	onFetchLog?: (filters?: { action?: string; moderator?: string }) => Promise<ModerationLogEntry[]>;
}

// ============================================================================
// Wiki Types
// ============================================================================

/**
 * Wiki page data
 */
export interface WikiPageData {
	/** Page path/slug */
	path: string;
	/** Page title */
	title: string;
	/** Page content (markdown) */
	content: string;
	/** Last editor */
	lastEditor?: AuthorData;
	/** Last edit timestamp */
	lastEditedAt?: Date | string;
	/** Revision number */
	revision: number;
	/** Whether page is locked */
	isLocked?: boolean;
	/** Who can edit (everyone, approved, mods) */
	editPermission: 'everyone' | 'approved' | 'mods';
}

/**
 * Wiki revision data
 */
export interface WikiRevision {
	/** Revision ID */
	id: string;
	/** Revision number */
	revision: number;
	/** Editor */
	editor: AuthorData;
	/** Edit timestamp */
	editedAt: Date | string;
	/** Edit reason/summary */
	reason?: string;
	/** Content at this revision */
	content: string;
}

/**
 * Wiki handlers
 */
export interface WikiHandlers {
	/** Save page */
	onSave?: (path: string, content: string, reason?: string) => Promise<void>;
	/** Revert to revision */
	onRevert?: (path: string, revisionId: string) => Promise<void>;
	/** Lock page */
	onLock?: (path: string) => Promise<void>;
	/** Unlock page */
	onUnlock?: (path: string) => Promise<void>;
	/** Change permissions */
	onChangePermission?: (path: string, permission: WikiPageData['editPermission']) => Promise<void>;
	/** Fetch revision history */
	onFetchHistory?: (path: string) => Promise<WikiRevision[]>;
}

// ============================================================================
// Supporting Types
// ============================================================================

/**
 * Author/user data
 */
export interface AuthorData {
	/** User ID */
	id: string;
	/** Username */
	username: string;
	/** Display name */
	displayName?: string;
	/** Avatar URL */
	avatarUrl?: string;
	/** User flair in this community */
	flair?: FlairData;
	/** Account age */
	accountAge?: number;
	/** Karma score */
	karma?: number;
	/** Whether user is deleted */
	isDeleted?: boolean;
	/** Whether user is suspended */
	isSuspended?: boolean;
}

/**
 * Moderator data
 */
export interface ModeratorData extends AuthorData {
	/** Moderator permissions */
	permissions: ModeratorPermission[];
	/** When user became mod */
	addedAt: Date | string;
}

/**
 * Moderator permissions
 */
export type ModeratorPermission = 'all' | 'access' | 'config' | 'flair' | 'mail' | 'posts' | 'wiki';

/**
 * Media attachment
 */
export interface MediaAttachment {
	/** Media ID */
	id: string;
	/** Media type */
	type: 'image' | 'video' | 'gif';
	/** Media URL */
	url: string;
	/** Thumbnail URL */
	thumbnailUrl?: string;
	/** Width */
	width?: number;
	/** Height */
	height?: number;
	/** Alt text */
	alt?: string;
}

/**
 * Poll data
 */
export interface PollData {
	/** Poll ID */
	id: string;
	/** Poll options */
	options: PollOption[];
	/** Total votes */
	totalVotes: number;
	/** User's vote */
	userVote?: string;
	/** Poll end time */
	endsAt: Date | string;
	/** Whether poll has ended */
	isEnded: boolean;
}

/**
 * Poll option
 */
export interface PollOption {
	/** Option ID */
	id: string;
	/** Option text */
	text: string;
	/** Vote count */
	voteCount: number;
}

/**
 * Award data
 */
export interface AwardData {
	/** Award ID */
	id: string;
	/** Award name */
	name: string;
	/** Award icon URL */
	iconUrl: string;
	/** Award count */
	count: number;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Community context
 */
export interface CommunityContext {
	community: CommunityData;
	config: Required<CommunityConfig>;
	handlers: CommunityHandlers;
	isSubscribed: boolean;
	isModerator: boolean;
}

/**
 * Post context
 */
export interface PostContext {
	post: PostData;
	config: Required<PostConfig>;
	handlers: PostHandlers;
}

/**
 * Thread context
 */
export interface ThreadContext {
	thread: ThreadData;
	config: Required<ThreadConfig>;
	handlers: ThreadHandlers;
}

/**
 * Moderation context
 */
export interface ModerationContext {
	handlers: ModerationHandlers;
	queue: ModerationQueueItem[];
	log: ModerationLogEntry[];
	loading: boolean;
	error: string | null;
}

/**
 * Wiki context
 */
export interface WikiContext {
	page: WikiPageData;
	handlers: WikiHandlers;
	editing: boolean;
	draft: string;
	history: WikiRevision[];
	loading: boolean;
	error: string | null;
}
