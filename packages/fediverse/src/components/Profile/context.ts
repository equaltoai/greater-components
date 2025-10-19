/**
 * Profile Context
 * 
 * Provides profile state and handlers for all profile components.
 * Supports viewing and editing user profiles with custom fields.
 * 
 * @module Profile/context
 */

import { getContext, setContext } from 'svelte';

const PROFILE_CONTEXT_KEY = Symbol('profile-context');

/**
 * Profile data structure
 */
export interface ProfileData {
	id: string;
	username: string;
	displayName: string;
	bio?: string;
	avatar?: string;
	header?: string;
	url?: string;
	followersCount: number;
	followingCount: number;
	statusesCount: number;
	fields?: ProfileField[];
	createdAt?: string;
	isFollowing?: boolean;
	isFollowedBy?: boolean;
	isBlocked?: boolean;
	isMuted?: boolean;
	relationship?: ProfileRelationship;
	
	// Lesser-specific fields
	trustScore?: number;
	reputation?: {
		actorId: string;
		instance: string;
		totalScore: number;
		trustScore: number;
		activityScore: number;
		moderationScore: number;
		communityScore: number;
		calculatedAt: string;
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
	};
	vouches?: Array<{
		id: string;
		fromId: string;
		toId: string;
		confidence: number;
		context: string;
		voucherReputation: number;
		createdAt: string;
		expiresAt: string;
		active: boolean;
		revoked: boolean;
		revokedAt?: string;
	}>;
}

/**
 * Custom profile field
 */
export interface ProfileField {
	name: string;
	value: string;
	verifiedAt?: string;
}

/**
 * Profile relationship data
 */
export interface ProfileRelationship {
	following: boolean;
	followedBy: boolean;
	blocking: boolean;
	blockedBy: boolean;
	muting: boolean;
	mutingNotifications: boolean;
	requested: boolean;
	domainBlocking: boolean;
	endorsed: boolean;
	note?: string;
}

/**
 * Profile edit data
 */
export interface ProfileEditData {
	displayName?: string;
	bio?: string;
	avatar?: File | string;
	header?: File | string;
	fields?: ProfileField[];
}

/**
 * Profile tab definition
 */
export interface ProfileTab {
	id: string;
	label: string;
	count?: number;
	icon?: string;
}

/**
 * Privacy settings for account
 */
export interface PrivacySettings {
	/**
	 * Account is private (requires follow approval)
	 */
	isPrivate: boolean;

	/**
	 * Require manual approval for follow requests
	 */
	requireFollowApproval: boolean;

	/**
	 * Hide followers list from public
	 */
	hideFollowers: boolean;

	/**
	 * Hide following list from public
	 */
	hideFollowing: boolean;

	/**
	 * Hide relationship indicators
	 */
	hideRelationships: boolean;

	/**
	 * Allow indexing by search engines
	 */
	searchableBySearchEngines: boolean;

	/**
	 * Discoverable in recommendations
	 */
	discoverable: boolean;

	/**
	 * Show adult content
	 */
	showAdultContent: boolean;

	/**
	 * Autoplay GIFs
	 */
	autoplayGifs: boolean;

	/**
	 * Autoplay videos
	 */
	autoplayVideos: boolean;
}

/**
 * Follow request from another user
 */
export interface FollowRequest {
	id: string;
	account: ProfileData;
	createdAt: string;
}

/**
 * Blocked account information
 */
export interface BlockedAccount {
	id: string;
	account: ProfileData;
	blockedAt: string;
	note?: string;
}

/**
 * Muted account information
 */
export interface MutedAccount {
	id: string;
	account: ProfileData;
	mutedAt: string;
	muteNotifications: boolean;
	expiresAt?: string;
	note?: string;
}

/**
 * Featured hashtag
 */
export interface FeaturedHashtag {
	name: string;
	usageCount: number;
	lastUsed?: string;
}

/**
 * Account migration information
 */
export interface AccountMigration {
	targetAccount: ProfileData;
	status: 'pending' | 'completed' | 'failed';
	movedAt?: string;
	followersCount?: number;
}

/**
 * Profile event handlers
 */
export interface ProfileHandlers {
	/**
	 * Handle follow action
	 */
	onFollow?: (userId: string) => Promise<void>;

	/**
	 * Handle unfollow action
	 */
	onUnfollow?: (userId: string) => Promise<void>;

	/**
	 * Handle block action
	 */
	onBlock?: (userId: string) => Promise<void>;

	/**
	 * Handle unblock action
	 */
	onUnblock?: (userId: string) => Promise<void>;

	/**
	 * Handle mute action
	 */
	onMute?: (userId: string, notifications?: boolean) => Promise<void>;

	/**
	 * Handle unmute action
	 */
	onUnmute?: (userId: string) => Promise<void>;

	/**
	 * Handle report action
	 */
	onReport?: (userId: string) => void;

	/**
	 * Handle profile save
	 */
	onSave?: (data: ProfileEditData) => Promise<void>;

	/**
	 * Handle tab change
	 */
	onTabChange?: (tabId: string) => void;

	/**
	 * Handle avatar upload
	 */
	onAvatarUpload?: (file: File) => Promise<string>;

	/**
	 * Handle header upload
	 */
	onHeaderUpload?: (file: File) => Promise<string>;

	/**
	 * Handle share profile
	 */
	onShare?: () => void;

	/**
	 * Handle mention user
	 */
	onMention?: (username: string) => void;

	/**
	 * Handle direct message
	 */
	onMessage?: (userId: string) => void;

	// Follow request handlers
	/**
	 * Approve a follow request
	 */
	onApproveFollowRequest?: (requestId: string) => Promise<void>;

	/**
	 * Reject a follow request
	 */
	onRejectFollowRequest?: (requestId: string) => Promise<void>;

	// Endorsement handlers
	/**
	 * Endorse an account (feature on profile)
	 */
	onEndorseAccount?: (userId: string) => Promise<void>;

	/**
	 * Remove account endorsement
	 */
	onUnendorseAccount?: (userId: string) => Promise<void>;

	/**
	 * Reorder endorsed accounts
	 */
	onReorderEndorsements?: (userIds: string[]) => Promise<void>;

	// Featured hashtag handlers
	/**
	 * Add a featured hashtag
	 */
	onAddFeaturedHashtag?: (hashtag: string) => Promise<void>;

	/**
	 * Remove a featured hashtag
	 */
	onRemoveFeaturedHashtag?: (hashtag: string) => Promise<void>;

	/**
	 * Reorder featured hashtags
	 */
	onReorderHashtags?: (hashtags: string[]) => Promise<void>;

	// Privacy settings handler
	/**
	 * Update privacy settings
	 */
	onUpdatePrivacySettings?: (settings: Partial<PrivacySettings>) => Promise<void>;

	// Migration handlers
	/**
	 * Initiate account migration
	 */
	onInitiateMigration?: (targetAccount: string) => Promise<void>;

	/**
	 * Cancel account migration
	 */
	onCancelMigration?: () => Promise<void>;

	// Block/Mute note handlers
	/**
	 * Update note for blocked user
	 */
	onUpdateBlockNote?: (userId: string, note: string) => Promise<void>;

	/**
	 * Update note for muted user
	 */
	onUpdateMuteNote?: (userId: string, note: string) => Promise<void>;

	// Field verification
	/**
	 * Verify a profile field (initiate rel=me verification)
	 */
	onVerifyField?: (fieldName: string) => Promise<void>;

	// Follower management
	/**
	 * Remove a follower
	 */
	onRemoveFollower?: (userId: string) => Promise<void>;

	/**
	 * Load more followers
	 */
	onLoadMoreFollowers?: () => Promise<void>;

	/**
	 * Load more following
	 */
	onLoadMoreFollowing?: () => Promise<void>;

	/**
	 * Search followers
	 */
	onSearchFollowers?: (query: string) => void;

	/**
	 * Search following
	 */
	onSearchFollowing?: (query: string) => void;
}

/**
 * Profile state
 */
export interface ProfileState {
	/**
	 * Current profile data
	 */
	profile: ProfileData | null;

	/**
	 * Whether in edit mode
	 */
	editMode: boolean;

	/**
	 * Whether a profile operation is in progress
	 */
	loading: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Active tab
	 */
	activeTab: string;

	/**
	 * Available tabs
	 */
	tabs: ProfileTab[];

	/**
	 * Whether profile is own profile
	 */
	isOwnProfile: boolean;

	/**
	 * Cached followers generated by integrations
	 */
	followers: ProfileData[];

	/**
	 * Loading state for followers pagination
	 */
	followersLoading: boolean;

	/**
	 * Total followers (from GraphQL pagination)
	 */
	followersTotal?: number;

	/**
	 * Cursor for fetching more followers
	 */
	followersCursor?: string | null;

	/**
	 * Cached following accounts
	 */
	following: ProfileData[];

	/**
	 * Loading state for following pagination
	 */
	followingLoading: boolean;

	/**
	 * Total following count (from GraphQL pagination)
	 */
	followingTotal?: number;

	/**
	 * Cursor for fetching more following accounts
	 */
	followingCursor?: string | null;
}

/**
 * Profile context
 */
export interface ProfileContext {
	/**
	 * Current profile state
	 */
	state: ProfileState;

	/**
	 * Profile event handlers
	 */
	handlers: ProfileHandlers;

	/**
	 * Update profile state
	 */
	updateState: (partial: Partial<ProfileState>) => void;

	/**
	 * Replace profile handlers
	 */
	setHandlers: (handlers: ProfileHandlers) => void;

	/**
	 * Clear profile error
	 */
	clearError: () => void;

	/**
	 * Toggle edit mode
	 */
	toggleEdit: () => void;

	/**
	 * Set active tab
	 */
	setActiveTab: (tabId: string) => void;
}

/**
 * Default tabs for profile
 */
export const DEFAULT_TABS: ProfileTab[] = [
	{ id: 'posts', label: 'Posts' },
	{ id: 'replies', label: 'Replies' },
	{ id: 'media', label: 'Media' },
	{ id: 'likes', label: 'Likes' },
];

/**
 * Create profile context
 * 
 * @param profile - Initial profile data
 * @param handlers - Profile event handlers
 * @param isOwnProfile - Whether this is the current user's profile
 * @returns Profile context
 */
export function createProfileContext(
	profile: ProfileData | null = null,
	handlers: ProfileHandlers = {},
	isOwnProfile = false
): ProfileContext {
	const state = $state<ProfileState>({
		profile,
		editMode: false,
		loading: false,
		error: null,
		activeTab: 'posts',
		tabs: DEFAULT_TABS,
		isOwnProfile,
		followers: [],
		followersLoading: false,
		followersTotal: profile?.followersCount,
		followersCursor: null,
		following: [],
		followingLoading: false,
		followingTotal: profile?.followingCount,
		followingCursor: null,
	});

	const context: ProfileContext = {
		state,
		handlers,
		updateState: (partial: Partial<ProfileState>) => {
			Object.assign(state, partial);
		},
		setHandlers: (nextHandlers: ProfileHandlers) => {
			context.handlers = nextHandlers;
		},
		clearError: () => {
			state.error = null;
		},
		toggleEdit: () => {
			state.editMode = !state.editMode;
		},
		setActiveTab: (tabId: string) => {
			state.activeTab = tabId;
			handlers.onTabChange?.(tabId);
		},
	};

	setContext(PROFILE_CONTEXT_KEY, context);
	return context;
}

/**
 * Get profile context
 * 
 * Must be called within a Profile component tree.
 * 
 * @throws Error if called outside Profile component tree
 * @returns Profile context
 */
export function getProfileContext(): ProfileContext {
	const context = getContext<ProfileContext>(PROFILE_CONTEXT_KEY);
	if (!context) {
		throw new Error('Profile components must be used within a Profile.Root component');
	}
	return context;
}

/**
 * Format follower count
 */
export function formatCount(count: number): string {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	}
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K`;
	}
	return count.toString();
}

/**
 * Get relationship status text
 */
export function getRelationshipText(relationship?: ProfileRelationship): string {
	if (!relationship) return 'Follow';
	if (relationship.following && relationship.followedBy) return 'Mutual';
	if (relationship.following) return 'Following';
	if (relationship.requested) return 'Requested';
	if (relationship.blocking) return 'Blocked';
	if (relationship.muting) return 'Muted';
	return 'Follow';
}
