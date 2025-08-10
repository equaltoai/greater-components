/**
 * Common types for Fediverse components
 */

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'gifv';
  url: string;
  previewUrl?: string;
  description?: string;
  blurhash?: string;
  meta?: {
    width?: number;
    height?: number;
    duration?: number;
  };
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
  | 'admin.report';

export interface BaseNotification {
  id: string;
  type: NotificationType;
  createdAt: string | Date;
  account: Account;
  read?: boolean;
  dismissed?: boolean;
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