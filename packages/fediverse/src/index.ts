// Export all components
export { default as ActionBar } from './components/ActionBar.svelte';
export { default as ComposeBox } from './components/ComposeBox.svelte';
export { default as ContentRenderer } from './components/ContentRenderer.svelte';
export { default as ProfileHeader } from './components/ProfileHeader.svelte';
export { default as StatusCard } from './components/StatusCard.svelte';
export { default as TimelineVirtualized } from './components/TimelineVirtualized.svelte';
export { default as NotificationsFeed } from './components/NotificationsFeed.svelte';
export { default as NotificationItem } from './components/NotificationItem.svelte';

// Export real-time enabled components
export { default as TimelineVirtualizedReactive } from './components/TimelineVirtualizedReactive.svelte';
export { default as NotificationsFeedReactive } from './components/NotificationsFeedReactive.svelte';
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