/**
 * @fileoverview Greater Fediverse - Specialized UI components for Fediverse applications
 * 
 * This package provides components specifically designed for building Mastodon,
 * Pleroma, and other ActivityPub-compatible social media interfaces. All components
 * feature real-time capabilities, accessibility support, and TypeScript integration.
 * 
 * @version 1.0.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

/**
 * Generic ActivityPub Types (Phase 2.1)
 * Type-safe interfaces that work across any ActivityPub implementation
 * @public
 */
export type {
	ActivityPubActor,
	ActivityPubObject,
	ActivityPubActivity,
	ActivityPubImage,
	ActivityPubTag,
	GenericStatus,
	GenericTimelineItem,
	GenericNotification,
	GenericAdapter,
} from './generics/index.js';

export {
	isFullActor,
	isFullObject,
	isNote,
	isLike,
	isAnnounce,
	isFollow,
	extractActor,
	extractObject,
	parseTimestamp,
	getVisibility,
} from './generics/index.js';

/**
 * Platform Adapters (Phase 2.1)
 * Convert platform-specific types to generic ActivityPub types
 * @public
 */
export {
	MastodonAdapter,
	PleromaAdapter,
	LesserAdapter,
	createAdapter,
	autoDetectAdapter,
} from './generics/adapters.js';

export type {
	MastodonStatus,
	MastodonExtensions,
	PleromaStatus,
	LesserStatus,
} from './generics/adapters.js';

/**
 * Advanced ActivityPub Patterns (Phase 2.2)
 * Production-ready components for common ActivityPub use cases.
 * These components use the generic ActivityPub types and work across any platform.
 * 
 * @public
 */
export {
	ThreadView,
	ContentWarningHandler,
	FederationIndicator,
	VisibilitySelector,
	ModerationTools,
	InstancePicker,
	CustomEmojiPicker,
	PollComposer,
	MediaComposer,
	BookmarkManager,
} from './patterns/index.js';

/**
 * Authentication Components (Phase 2.3)
 * Complete authentication flow for ActivityPub/Fediverse applications.
 * Supports email/password, WebAuthn, OAuth, 2FA, and password reset.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Auth from '@equaltoai/greater-components-fediverse/Auth';
 * 
 * <Auth.Root {handlers}>
 *   <Auth.LoginForm />
 * </Auth.Root>
 * ```
 */
export * as Auth from './components/Auth/index.js';

export type {
	LoginCredentials,
	RegisterData,
	WebAuthnCredential,
	OAuthData,
	TwoFactorData,
	PasswordResetData,
	AuthHandlers,
	AuthUser,
	AuthState,
	AuthContext,
} from './components/Auth/index.js';

/**
 * GraphQL Adapter for Lesser (Phase 2.3)
 * Type-safe GraphQL client with pre-built queries, mutations, and subscriptions
 * for Lesser's ActivityPub API.
 * 
 * @public
 * 
 * @example
 * ```typescript
 * import { createLesserClient } from '@equaltoai/greater-components-fediverse/adapters/graphql';
 * 
 * const client = createLesserClient({
 *   endpoint: 'https://api.lesser.example.com/graphql',
 *   token: 'your-auth-token',
 * });
 * 
 * // Fetch timeline
 * const timeline = await client.getTimeline({ limit: 20 });
 * 
 * // Subscribe to updates
 * const unsubscribe = client.subscribeToTimeline((event) => {
 *   console.log('New activity:', event.data.activity);
 * });
 * ```
 */
export {
	createLesserClient,
	createGraphQLClient,
	LesserClient,
	GraphQLClient,
} from './adapters/graphql/index.js';

export type {
	GraphQLConfig,
	Variables,
	GraphQLResponse,
	GraphQLError,
	LesserActor,
	LesserNote,
	LesserActivity,
	ActorListPage,
	TimelineResult,
	ActorResult,
	NoteResult,
	CreateNoteResult,
	LikeResult,
	AnnounceResult,
	FollowResult,
	SubscriptionEvent,
	TimelineUpdateEvent,
	NotificationEvent,
	SearchResult,
	FollowersResult,
	FollowingResult,
	NotificationsResult,
	ProfileFieldInput,
	UpdateProfileInput,
	Visibility,
	ExpandMediaPreference,
	TimelineOrder,
	StreamQuality,
	DigestFrequency,
	UserPreferences,
	PostingPreferences,
	ReadingPreferences,
	DiscoveryPreferences,
	StreamingPreferences,
	NotificationPreferences,
	PrivacyPreferences,
	ReblogFilter,
	UpdateUserPreferencesInput,
	StreamingPreferencesInput,
	ReblogFilterInput,
	UserPreferencesResult,
	UpdateUserPreferencesResult,
	UpdateStreamingPreferencesResult,
	PushSubscription,
	PushSubscriptionKeys,
	PushSubscriptionAlerts,
	PushSubscriptionResult,
	RegisterPushSubscriptionInput,
	RegisterPushSubscriptionResult,
	UpdatePushSubscriptionInput,
	UpdatePushSubscriptionResult,
	DeletePushSubscriptionResult,
	PushSubscriptionKeysInput,
	PushSubscriptionAlertsInput,
} from './adapters/graphql/index.js';

/**
 * Profile Components (Phase 2.4)
 * Complete profile viewing and editing system.
 * Supports viewing profiles, editing own profile, following, blocking, and custom fields.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
 * 
 * <Profile.Root {profile} {handlers} isOwnProfile={true}>
 *   <Profile.Header />
 *   <Profile.Stats />
 *   <Profile.Tabs />
 * </Profile.Root>
 * ```
 */
export * as Profile from './components/Profile/index.js';

export type {
	ProfileData,
	ProfileField,
	ProfileRelationship,
	ProfileEditData,
	ProfileTab,
	ProfileHandlers,
	ProfileState,
	ProfileContext,
} from './components/Profile/index.js';

/**
 * Search Components (Phase 2.4)
 * Complete search system with AI semantic search.
 * Supports full-text search, filtering by type, and real-time results.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Search from '@equaltoai/greater-components-fediverse/Search';
 * 
 * <Search.Root {handlers}>
 *   <Search.Bar placeholder="Search..." />
 *   <Search.Filters />
 *   <Search.Results />
 * </Search.Root>
 * ```
 */
export * as Search from './components/Search/index.js';

export type {
	SearchResultType,
	SearchActor,
	SearchNote,
	SearchTag,
	SearchResults,
	SearchOptions,
	SearchHandlers,
	SearchState,
	SearchContext,
} from './components/Search/index.js';

/**
 * Lists Components (Phase 2.5)
 * Complete lists management system for organizing and viewing curated actor feeds.
 * Supports creating, editing, and deleting lists with public/private visibility.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Lists from '@equaltoai/greater-components-fediverse/Lists';
 * 
 * <Lists.Root {handlers}>
 *   <Lists.Manager />
 *   <Lists.Editor />
 *   <Lists.Timeline />
 * </Lists.Root>
 * ```
 */
export * as Lists from './components/Lists/index.js';

export type {
	ListData,
	ListMember,
	ListFormData,
	ListsHandlers,
	ListsState,
	ListsContext,
} from './components/Lists/index.js';

/**
 * Messages Components (Phase 2.5)
 * Complete direct messaging system for private conversations.
 * Supports threaded conversations, real-time messaging, and read receipts.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
 * 
 * <Messages.Root {handlers}>
 *   <Messages.Conversations currentUserId="me" />
 *   <Messages.Thread />
 *   <Messages.Composer />
 * </Messages.Root>
 * ```
 */
export * as Messages from './components/Messages/index.js';

export type {
	MessageParticipant,
	DirectMessage,
	Conversation,
	MessagesHandlers,
	MessagesState,
	MessagesContext,
} from './components/Messages/index.js';

/**
 * Filters Components (Phase 2.7)
 * Complete content filtering system for keyword/phrase filtering.
 * Supports context-specific filters (home, notifications, public, thread, account) with expiration.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Filters from '@equaltoai/greater-components-fediverse/Filters';
 * 
 * <Filters.Root {handlers}>
 *   <Filters.Manager />
 *   <Filters.Editor />
 *   
 *   <!-- Wrap content to check for filters -->
 *   <Filters.FilteredContent content={post.content} context="home">
 *     <StatusCard {post} />
 *   </Filters.FilteredContent>
 * </Filters.Root>
 * ```
 */
export * as Filters from './components/Filters/index.js';

export type {
	ContentFilter,
	FilterContext,
	FilterAction,
	FilterFormData,
	FiltersHandlers,
	FiltersState,
	FiltersContext,
} from './components/Filters/index.js';

/**
 * Admin Components (Phase 2.6)
 * Complete admin dashboard for instance management.
 * Includes user management, reports, moderation, federation, settings, logs, and analytics.
 * 
 * @public
 * 
 * @example
 * ```svelte
 * import * as Admin from '@equaltoai/greater-components-fediverse/Admin';
 * 
 * <Admin.Root {handlers}>
 *   <Admin.Overview />
 *   <Admin.Users />
 *   <Admin.Reports />
 *   <Admin.Moderation />
 *   <Admin.Federation />
 *   <Admin.Settings />
 *   <Admin.Logs />
 *   <Admin.Analytics />
 * </Admin.Root>
 * ```
 */
export * as Admin from './components/Admin/index.js';

export type {
	AdminStats,
	AdminUser,
	AdminReport,
	FederatedInstance,
	InstanceSettings,
	LogEntry,
	AnalyticsData,
	AdminHandlers,
	AdminState,
	AdminContext,
} from './components/Admin/index.js';

/**
 * Core Fediverse UI components
 * @public
 */

/** 
 * Action bar with like, boost, reply, and share buttons for status interactions.
 * @public
 */
export { default as ActionBar } from './components/ActionBar.svelte';

/** 
 * Compose box for creating new posts with media attachments and polls.
 * @public
 * @deprecated Use Compose compound component instead
 */
export { default as ComposeBox } from './components/ComposeBox.svelte';

/**
 * Compose compound component - flexible, composable post creation
 * @public
 */
export {
	Compose as ComposeCompound,
	Root as ComposeRoot,
	Editor as ComposeEditor,
	Submit as ComposeSubmit,
	CharacterCount as ComposeCharacterCount,
	VisibilitySelect as ComposeVisibilitySelect
} from './components/Compose/index.js';
export type {
	ComposeContext,
	ComposeConfig,
	ComposeHandlers,
	ComposeState,
	PostVisibility,
	ComposeAttachment
} from './components/Compose/context.js';

/** 
 * Content renderer for sanitized HTML with mention and hashtag support.
 * @public
 */
export { default as ContentRenderer } from './components/ContentRenderer.svelte';

/** 
 * Profile header displaying user information, stats, and follow button.
 * @public
 */
export { default as ProfileHeader } from './components/ProfileHeader.svelte';

/** 
 * Status card displaying a single social media post with full anatomy.
 * @public
 * @deprecated Use Status compound component instead
 */
export { default as StatusCard } from './components/StatusCard.svelte';

/**
 * Status compound component - flexible, composable status cards
 * @public
 */
export { 
  Status as StatusCompound,
  Root as StatusRoot, 
  Header as StatusHeader, 
  Content as StatusContent, 
  Media as StatusMedia, 
  Actions as StatusActions 
} from './components/Status/index.js';
export type { StatusContext, StatusConfig, StatusActionHandlers } from './components/Status/context.js';

/** 
 * High-performance virtualized timeline for rendering thousands of items.
 * @public
 * @deprecated Use Timeline compound component instead
 */
export { default as TimelineVirtualized } from './components/TimelineVirtualized.svelte';

/**
 * Timeline compound component - flexible, composable timelines
 * @public
 */
export {
	Timeline as TimelineCompound,
	Root as TimelineRoot,
	Item as TimelineItem,
	LoadMore as TimelineLoadMore,
	EmptyState as TimelineEmptyState,
	ErrorState as TimelineErrorState
} from './components/Timeline/index.js';
export type {
	TimelineContext,
	TimelineCompoundConfig,
	TimelineHandlers,
	TimelineCompoundState,
	TimelineMode,
	TimelineDensity
} from './components/Timeline/context.js';

/** 
 * Notifications feed displaying grouped social interactions.
 * @public
 * @deprecated Use Notifications compound component instead
 */
export { default as NotificationsFeed } from './components/NotificationsFeed.svelte';

/**
 * Notifications compound component - flexible, composable notifications
 * @public
 */
export {
	Notifications as NotificationsCompound,
	Root as NotificationsRoot,
	Item as NotificationsItem,
	Group as NotificationsGroup,
	Filter as NotificationsFilter,
} from './components/Notifications/index.js';
export type {
	NotificationsContext,
	NotificationsConfig,
	NotificationsHandlers,
	NotificationsState,
	NotificationDisplayMode,
	NotificationFilter,
} from './components/Notifications/context.js';

/** 
 * Individual notification item with type-specific rendering.
 * @public
 */
export { default as NotificationItem } from './components/NotificationItem.svelte';

/** 
 * Settings panel for configuring timeline and notification preferences.
 * @public
 */
export { default as SettingsPanel } from './components/SettingsPanel.svelte';

/**
 * Real-time enabled components with live streaming capabilities
 * @public
 */

/** 
 * Reactive timeline with real-time updates and streaming support.
 * @public
 */
export { default as TimelineVirtualizedReactive } from './components/TimelineVirtualizedReactive.svelte';

/** 
 * Reactive notifications feed with live updates and streaming.
 * @public
 */
export { default as NotificationsFeedReactive } from './components/NotificationsFeedReactive.svelte';

/** 
 * Wrapper component for adding real-time capabilities to any component.
 * @public
 */
export { default as RealtimeWrapper } from './components/RealtimeWrapper.svelte';

// Export types
export type {
  MediaAttachment,
  Account,
  Status,
  Mention,
  Tag,
  Card,
  Poll,
  NotificationType,
  BaseNotification,
  MentionNotification,
  ReblogNotification,
  FavouriteNotification,
  FollowNotification,
  FollowRequestNotification,
  PollNotification,
  StatusNotification,
  UpdateNotification,
  AdminSignUpNotification,
  AdminReportNotification,
  Notification,
  NotificationGroup,
  NotificationsFeedProps,
  ComposeBoxDraft,
  ComposeMediaAttachment,
  ComposePoll,
  ComposeBoxProps
} from './types';

// Export utilities
export {
  groupNotifications,
  getGroupTitle,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTime,
  shouldHighlightNotification
} from './utils/notificationGrouping';

// Export stores and transport
export { TransportManager } from './lib/transport';
export { TimelineStore } from './lib/timelineStore';
export { NotificationStore } from './lib/notificationStore';

// Export integration utilities
export {
  createTimelineIntegration,
  createNotificationIntegration,
  createSharedTransport,
  withRealtime,
  realtimeErrorBoundary
} from './lib/integration';

// Export store and transport types
export type {
  ConnectionConfig,
  TimelineIntegrationConfig,
  NotificationIntegrationConfig,
  RealtimeIndicatorProps
} from './lib/integration';

export type {
  TransportConfig,
  StreamingMessage,
  TransportEventMap,
  TransportEventType
} from './lib/transport';

export type {
  TimelineState,
  TimelineConfig
} from './lib/timelineStore';

export type {
  NotificationState,
  NotificationConfig
} from './lib/notificationStore';
