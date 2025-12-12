/**
 * @fileoverview Greater Community Face - UI components for Reddit/forum-style discussions
 *
 * This package provides components specifically designed for building community forums,
 * discussion boards, and Reddit-style applications. All components feature
 * accessibility support, nested threading, and TypeScript integration.
 *
 * @version 1.0.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

// ============================================================================
// Compound Components
// ============================================================================

/**
 * Community compound component for community display and management
 */
export * from './components/Community/index.js';
export { Community } from './components/Community/index.js';

/**
 * Post compound component for forum posts with voting
 */
export * from './components/Post/index.js';
export { Post } from './components/Post/index.js';

/**
 * Thread compound component for nested comment threading
 */
export * from './components/Thread/index.js';
export { Thread } from './components/Thread/index.js';

/**
 * Voting compound component for upvote/downvote functionality
 */
export * from './components/Voting/index.js';
export { Voting } from './components/Voting/index.js';

/**
 * Flair compound component for post and user flairs
 */
export * from './components/Flair/index.js';
export { Flair } from './components/Flair/index.js';

/**
 * Moderation compound component for mod tools
 */
export * from './components/Moderation/index.js';
export { Moderation } from './components/Moderation/index.js';

/**
 * Wiki compound component for community wikis
 */
export * from './components/Wiki/index.js';
export { Wiki } from './components/Wiki/index.js';

// ============================================================================
// Standalone Components
// ============================================================================

// Standalone components exports removed as files are not present in expected location
// export { default as CommunityIndex } from './components/CommunityIndex.svelte';
// export { default as CommunityHeader } from './components/CommunityHeader.svelte';
// export { default as PostListing } from './components/PostListing.svelte';
// export { default as ThreadView } from './components/ThreadView.svelte';
// export { default as CommentTree } from './components/CommentTree.svelte';
// export { default as VoteButtons } from './components/VoteButtons.svelte';
// export { default as FlairSelector } from './components/FlairSelector.svelte';
// export { default as ModerationPanel } from './components/ModerationPanel.svelte';
// export { default as RulesSidebar } from './components/RulesSidebar.svelte';
// export { default as WikiPage } from './components/WikiPage.svelte';

// ============================================================================
// Patterns
// ============================================================================

export * from './patterns/index.js';

// ============================================================================
// Types
// ============================================================================

export type {
	// Community types
	CommunityData,
	CommunityConfig,
	CommunityHandlers,
	CommunityContext,
	CommunityStats,
	CommunityRule,
	// Post types
	PostData,
	PostConfig,
	PostHandlers,
	PostContext,
	PostSortOption,
	PostType,
	TimeFilter,
	// Thread types
	ThreadData,
	ThreadConfig,
	ThreadHandlers,
	ThreadContext,
	CommentData,
	CommentSortOption,
	// Voting types
	VoteData,
	VoteDirection,
	VoteHandlers,
	// Flair types
	FlairData,
	FlairType,
	FlairHandlers,
	// Moderation types
	ModerationActionType,
	ModerationQueueItem,
	ModerationHandlers,
	ModerationContext,
	ModerationLogEntry,
	BanData,
	SpamFilterRule,
	ReportData,
	// Wiki types
	WikiPageData,
	WikiRevision,
	WikiHandlers,
	// Supporting types
	AuthorData,
	ModeratorData,
	ModeratorPermission,
	MediaAttachment,
	PollData,
	PollOption,
	AwardData,
} from './types.js';
