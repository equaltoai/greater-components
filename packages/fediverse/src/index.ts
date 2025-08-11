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
 */
export { default as ComposeBox } from './components/ComposeBox.svelte';

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
 */
export { default as StatusCard } from './components/StatusCard.svelte';

/** 
 * High-performance virtualized timeline for rendering thousands of items.
 * @public
 */
export { default as TimelineVirtualized } from './components/TimelineVirtualized.svelte';

/** 
 * Notifications feed displaying grouped social interactions.
 * @public
 */
export { default as NotificationsFeed } from './components/NotificationsFeed.svelte';

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